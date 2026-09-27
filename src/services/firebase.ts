import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  reauthenticateWithPopup,
  linkWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App instance
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with configured database ID
export const db = getFirestore(
  app,
  "ai-studio-projectjauhariis-d187aa17-15c9-48ef-b68d-fe2b5afaa0c1"
);

// Google Auth Provider with Google Drive file scope
export const googleDriveProvider = new GoogleAuthProvider();
googleDriveProvider.addScope("https://www.googleapis.com/auth/drive.file");

// In-memory access token cache for Google Workspace OAuth (per security guidelines)
let cachedDriveAccessToken: string | null = null;
let isSigningIn = false;
const driveTokenListeners: ((token: string | null) => void)[] = [];

export const onDriveTokenChange = (cb: (token: string | null) => void) => {
  driveTokenListeners.push(cb);
  return () => {
    const idx = driveTokenListeners.indexOf(cb);
    if (idx !== -1) driveTokenListeners.splice(idx, 1);
  };
};

const notifyDriveTokenListeners = (token: string | null) => {
  cachedDriveAccessToken = token;
  driveTokenListeners.forEach((cb) => {
    try {
      cb(token);
    } catch (e) {
      console.warn("Drive token listener error:", e);
    }
  });
};

/**
 * Check if Google Drive access token is active in memory for this session
 */
export const hasDriveToken = (): boolean => {
  return !!cachedDriveAccessToken;
};

// Test connection on boot per Firebase skill guidelines
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore connection: client is currently offline or connecting.");
    }
  }
}
testFirestoreConnection();

/**
 * Auth State Listener
 */
export const initAuth = (
  onAuthChange: (user: User | null, token: string | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (!user) {
      notifyDriveTokenListeners(null);
    }
    onAuthChange(user, cachedDriveAccessToken);
  });
};

/**
 * Sign Up with Email and Password
 */
export const signUpWithEmail = async (
  email: string,
  pass: string,
  displayName?: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }

  // Record profile in Firestore
  try {
    await setDoc(
      doc(db, "users", credential.user.uid),
      {
        userId: credential.user.uid,
        email: credential.user.email,
        displayName: displayName || credential.user.email?.split("@")[0] || "Scholar",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("Could not save initial user profile doc:", e);
  }

  return credential.user;
};

/**
 * Sign In with Email and Password
 */
export const signInWithEmail = async (
  email: string,
  pass: string
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  try {
    await setDoc(
      doc(db, "users", credential.user.uid),
      {
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e) {
    // Non-fatal
  }
  return credential.user;
};

/**
 * Sign In / Connect with Google (Firebase Auth + Google Drive Token)
 */
export const signInWithGoogle = async (): Promise<{
  user: User;
  accessToken: string | null;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleDriveProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    notifyDriveTokenListeners(token);

    // Record user profile
    try {
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          userId: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email?.split("@")[0] || "Scholar",
          photoURL: result.user.photoURL || null,
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Could not update user profile doc:", e);
    }

    return { user: result.user, accessToken: token };
  } finally {
    isSigningIn = false;
  }
};

/**
 * Explicitly request or refresh Google Drive authorization from a direct user interaction.
 * Handles:
 * - Existing Google-authenticated users (reauthenticateWithPopup)
 * - Existing Email/Password users (linkWithPopup so accounts are merged and data preserved)
 * - Unauthenticated users (signInWithPopup)
 */
export const authorizeGoogleDrive = async (): Promise<string> => {
  if (cachedDriveAccessToken) {
    return cachedDriveAccessToken;
  }

  const currentUser = auth.currentUser;

  // 1. If currently signed in, check providers
  if (currentUser) {
    const isGoogleLinked = currentUser.providerData.some(
      (p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
    );

    if (isGoogleLinked) {
      try {
        const reauthResult = await reauthenticateWithPopup(currentUser, googleDriveProvider);
        const cred = GoogleAuthProvider.credentialFromResult(reauthResult);
        if (cred?.accessToken) {
          notifyDriveTokenListeners(cred.accessToken);
          return cred.accessToken;
        }
      } catch (err: any) {
        console.warn("Reauthenticate with Google popup attempted, falling back:", err);
        // If reauth fails or requires fresh signin, proceed to signInWithPopup
      }
    } else {
      // User is signed in with email/password (e.g. jumaidil@aol.com)
      // Link Google account so they retain their current UID and stored inquiries!
      try {
        const linkResult = await linkWithPopup(currentUser, googleDriveProvider);
        const cred = GoogleAuthProvider.credentialFromResult(linkResult);
        if (cred?.accessToken) {
          notifyDriveTokenListeners(cred.accessToken);
          return cred.accessToken;
        }
      } catch (linkErr: any) {
        if (
          linkErr.code === "auth/credential-already-in-use" ||
          linkErr.code === "auth/email-already-in-use"
        ) {
          console.warn("Google account already in use on another credential:", linkErr);
        } else {
          console.warn("Account link attempt warning:", linkErr);
        }
      }
    }
  }

  // 2. Standard interactive sign-in / re-auth popup
  const result = await signInWithPopup(auth, googleDriveProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error(
      "Google Drive access token was not returned. Please grant Drive permissions in the Google authorization popup."
    );
  }

  notifyDriveTokenListeners(credential.accessToken);
  return credential.accessToken;
};

/**
 * Retrieve cached Drive OAuth access token
 */
export const getDriveAccessToken = async (promptIfMissing = false): Promise<string | null> => {
  if (cachedDriveAccessToken) return cachedDriveAccessToken;

  if (promptIfMissing) {
    try {
      return await authorizeGoogleDrive();
    } catch (err: any) {
      console.error("Google Drive token retrieval failed:", err);
      return null;
    }
  }

  return null;
};

/**
 * Set Drive access token manually in memory
 */
export const setCachedDriveToken = (token: string | null) => {
  notifyDriveTokenListeners(token);
};

/**
 * Sign Out
 */
export const logOutUser = async (): Promise<void> => {
  await signOut(auth);
  notifyDriveTokenListeners(null);
};

// ==================== FIRESTORE INQUIRIES API ====================

export interface StoredInquiry {
  id: string;
  userId: string;
  question: string;
  focalAxiomId?: string;
  answer: string;
  answerSource?: string;
  isFallback?: boolean;
  timestamp: string;
  isSaved?: boolean;          // explicitly saved/bookmarked by scholar
  savedAt?: string;            // timestamp when saved
  savedToDrive?: boolean;
  driveFileId?: string;
  driveFileUrl?: string;
  driveFileName?: string;
}

/**
 * Record an inquiry to user's history in Firestore (/users/{userId}/inquiries/{inquiryId})
 */
export const saveInquiryToFirestore = async (
  userId: string,
  inquiry: Omit<StoredInquiry, "userId">
): Promise<void> => {
  if (!userId) return;
  const docRef = doc(db, "users", userId, "inquiries", inquiry.id);
  await setDoc(
    docRef,
    {
      ...inquiry,
      userId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

/**
 * Explicitly bookmark / save an inquiry into the permanent Saved Inquiries archive
 */
export const bookmarkInquiryInFirestore = async (
  userId: string,
  inquiryId: string,
  isSaved = true
): Promise<void> => {
  if (!userId || !inquiryId) return;
  const docRef = doc(db, "users", userId, "inquiries", inquiryId);
  await setDoc(
    docRef,
    {
      isSaved,
      savedAt: isSaved ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

/**
 * Fetch the 10 most recent inquiries for a user (strictly capped at 10)
 */
export const fetchRecentInquiriesFromFirestore = async (
  userId: string
): Promise<StoredInquiry[]> => {
  if (!userId) return [];
  try {
    const inquiriesRef = collection(db, "users", userId, "inquiries");
    // Order by timestamp descending and take strictly up to 10
    const q = query(inquiriesRef, orderBy("timestamp", "desc"), limit(10));
    const snapshot = await getDocs(q);

    const inquiries: StoredInquiry[] = [];
    snapshot.forEach((docSnap) => {
      inquiries.push(docSnap.data() as StoredInquiry);
    });
    return inquiries;
  } catch (error) {
    console.warn("Error fetching recent inquiries from Firestore:", error);
    return [];
  }
};

/**
 * Fetch ALL saved inquiries for a user (UNLIMITED - no 10-item cap!)
 * Retrieves all inquiries where isSaved == true OR savedToDrive == true
 */
export const fetchSavedInquiriesFromFirestore = async (
  userId: string
): Promise<StoredInquiry[]> => {
  if (!userId) return [];
  try {
    const inquiriesRef = collection(db, "users", userId, "inquiries");
    const snapshot = await getDocs(inquiriesRef);

    const savedInquiries: StoredInquiry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as StoredInquiry;
      if (data.isSaved || data.savedToDrive) {
        savedInquiries.push(data);
      }
    });

    // Sort by savedAt or timestamp descending
    savedInquiries.sort((a, b) => {
      const timeA = new Date(a.savedAt || a.timestamp).getTime();
      const timeB = new Date(b.savedAt || b.timestamp).getTime();
      return timeB - timeA;
    });

    return savedInquiries;
  } catch (error) {
    console.warn("Error fetching saved inquiries from Firestore:", error);
    return [];
  }
};

/**
 * Fetch all user inquiries for unified dashboard view
 */
export const fetchAllUserInquiriesFromFirestore = async (
  userId: string
): Promise<{ recent: StoredInquiry[]; saved: StoredInquiry[]; all: StoredInquiry[] }> => {
  if (!userId) return { recent: [], saved: [], all: [] };
  try {
    const inquiriesRef = collection(db, "users", userId, "inquiries");
    const snapshot = await getDocs(inquiriesRef);

    const all: StoredInquiry[] = [];
    snapshot.forEach((docSnap) => {
      all.push(docSnap.data() as StoredInquiry);
    });

    // Sort all by timestamp descending
    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 10 most recent inquiries
    const recent = all.slice(0, 10);

    // Saved inquiries (UNLIMITED - any inquiry marked isSaved or savedToDrive)
    const saved = all.filter((item) => item.isSaved || item.savedToDrive);
    saved.sort((a, b) => {
      const timeA = new Date(a.savedAt || a.timestamp).getTime();
      const timeB = new Date(b.savedAt || b.timestamp).getTime();
      return timeB - timeA;
    });

    return { recent, saved, all };
  } catch (error) {
    console.warn("Error fetching inquiries from Firestore:", error);
    return { recent: [], saved: [], all: [] };
  }
};

/**
 * Update Google Drive sync status of an inquiry in Firestore
 */
export const updateInquiryDriveStatusInFirestore = async (
  userId: string,
  inquiryId: string,
  driveData: { driveFileId: string; driveFileUrl: string; driveFileName: string }
): Promise<void> => {
  if (!userId || !inquiryId) return;
  const docRef = doc(db, "users", userId, "inquiries", inquiryId);
  await setDoc(
    docRef,
    {
      isSaved: true,
      savedToDrive: true,
      driveFileId: driveData.driveFileId,
      driveFileUrl: driveData.driveFileUrl,
      driveFileName: driveData.driveFileName,
      savedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

/**
 * Delete an inquiry from user history
 */
export const deleteInquiryFromFirestore = async (
  userId: string,
  inquiryId: string
): Promise<void> => {
  if (!userId || !inquiryId) return;
  const docRef = doc(db, "users", userId, "inquiries", inquiryId);
  await deleteDoc(docRef);
};
