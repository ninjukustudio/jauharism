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
  serverTimestamp,
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
      cachedDriveAccessToken = null;
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
    cachedDriveAccessToken = credential?.accessToken || null;

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

    return { user: result.user, accessToken: cachedDriveAccessToken };
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve cached Drive OAuth access token or request one via interactive popup
 */
export const getDriveAccessToken = async (promptIfMissing = true): Promise<string | null> => {
  if (cachedDriveAccessToken) return cachedDriveAccessToken;

  if (promptIfMissing && auth.currentUser) {
    try {
      const res = await signInWithPopup(auth, googleDriveProvider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      cachedDriveAccessToken = credential?.accessToken || null;
      return cachedDriveAccessToken;
    } catch (err) {
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
  cachedDriveAccessToken = token;
};

/**
 * Sign Out
 */
export const logOutUser = async (): Promise<void> => {
  await signOut(auth);
  cachedDriveAccessToken = null;
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
  savedToDrive?: boolean;
  driveFileId?: string;
  driveFileUrl?: string;
  driveFileName?: string;
  savedAt?: string;
}

/**
 * Save an inquiry to user's recent inquiries (stores in /users/{userId}/inquiries/{inquiryId})
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
 * Fetch the 10 most recent inquiries for a user
 */
export const fetchRecentInquiriesFromFirestore = async (
  userId: string
): Promise<StoredInquiry[]> => {
  if (!userId) return [];
  try {
    const inquiriesRef = collection(db, "users", userId, "inquiries");
    // Order by timestamp descending and take up to 10
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
