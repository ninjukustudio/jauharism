import { getDriveAccessToken, setCachedDriveToken } from "./firebase.ts";

export interface SaveDriveResult {
  fileId: string;
  webViewLink: string;
  fileName: string;
}

export interface DriveApiErrorDetails {
  status: number;
  message: string;
  reason?: string;
  domain?: string;
  isApiDisabled: boolean;
  isScopeInsufficient: boolean;
  isSessionExpired: boolean;
  enableApiUrl?: string;
  currentScopes?: string[];
  rawError?: any;
}

/**
 * Inspects the scopes granted on the active OAuth access token via Google tokeninfo endpoint.
 */
export async function inspectTokenScopes(accessToken: string): Promise<{
  scopes: string[];
  issuedTo?: string;
  email?: string;
  expiresIn?: number;
}> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${encodeURIComponent(
        accessToken
      )}`
    );
    if (res.ok) {
      const data = await res.json();
      const scopes = (data.scope || "").split(" ").filter(Boolean);
      return {
        scopes,
        issuedTo: data.issued_to,
        email: data.email,
        expiresIn: data.expires_in,
      };
    }
  } catch (err) {
    console.warn("Could not query tokeninfo for access token:", err);
  }
  return { scopes: [] };
}

/**
 * Parses Google Drive API error responses into structured diagnostic information.
 */
export function parseDriveApiError(
  status: number,
  errorData: any,
  tokenScopes?: string[]
): DriveApiErrorDetails {
  const errObj = errorData?.error || {};
  const message: string = errObj.message || errorData?.message || "";
  const firstError = Array.isArray(errObj.errors) ? errObj.errors[0] : null;
  const reason: string = firstError?.reason || errObj.status || "";
  const domain: string = firstError?.domain || "";

  // Check if Google Drive API is not enabled in the Google Cloud Project
  const isApiDisabled =
    reason === "accessNotConfigured" ||
    reason === "SERVICE_DISABLED" ||
    message.toLowerCase().includes("google drive api has not been used in project") ||
    message.toLowerCase().includes("or it is disabled") ||
    message.toLowerCase().includes("accessnotconfigured");

  // Check if token has insufficient scopes
  const isScopeInsufficient =
    reason === "insufficientPermissions" ||
    message.toLowerCase().includes("insufficient authentication scopes") ||
    message.toLowerCase().includes("insufficient permissions");

  const isSessionExpired = status === 401;

  let enableApiUrl = firstError?.extendedHelp;
  if (!enableApiUrl && isApiDisabled) {
    enableApiUrl =
      "https://console.cloud.google.com/apis/library/drive.googleapis.com?project=jauharism";
  }

  return {
    status,
    message,
    reason,
    domain,
    isApiDisabled,
    isScopeInsufficient,
    isSessionExpired,
    enableApiUrl,
    currentScopes: tokenScopes,
    rawError: errorData,
  };
}

export interface UploadInquiryParams {
  question: string;
  answer: string;
  focalAxiomId?: string;
  answerSource?: string;
  timestamp?: string;
  token?: string;
  customFileName?: string;
  customFolderName?: string | null;
}

/**
 * Assemble standardized Markdown content for the theological/epistemological inquiry.
 */
export function assembleMarkdownContent(params: {
  question: string;
  answer: string;
  focalAxiomId?: string;
  answerSource?: string;
  timestamp?: string;
}): string {
  return `# Project Jauhari: Epistemological AI Inquiry
**Date**: ${new Date().toLocaleString()}  
**Synthesis Model**: ${params.answerSource || "Project Jauhari Synthesis Engine"}  
${params.focalAxiomId ? `**Focal Axiom Reference**: ${params.focalAxiomId}\n` : ""}

---

## Theological / Epistemological Inquiry
> **"${params.question}"**

---

## Jauhari Epistemological Response
${params.answer}

---
*Archived from Project Jauhari (Islamic Rationalism Revival Framework).*  
*Preserved in personal Google Drive via Project Jauhari Integration.*
`;
}

/**
 * Direct browser download fallback: allows scholar to immediately download the inquiry
 * as a pristine Markdown (.md) file to their local machine.
 */
export function downloadInquiryAsMarkdown(params: {
  question: string;
  answer: string;
  focalAxiomId?: string;
  answerSource?: string;
  timestamp?: string;
  customFileName?: string;
}): void {
  const content = assembleMarkdownContent(params);
  const dateStr = new Date().toISOString().split("T")[0];
  const sanitizedQuestionSlug = params.question
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .slice(0, 35)
    .replace(/\s+/g, "_");
  const fileName =
    params.customFileName || `Jauhari_${sanitizedQuestionSlug || "Inquiry"}_${dateStr}.md`;

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Searches for or creates a folder only when explicitly requested by user.
 */
async function getOrCreateCustomFolder(
  accessToken: string,
  folderName: string
): Promise<string | null> {
  if (!folderName.trim()) return null;

  try {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `mimeType='application/vnd.google-apps.folder' and name='${folderName.trim()}' and trashed=false`
    )}&fields=files(id,name)`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
    }

    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName.trim(),
        mimeType: "application/vnd.google-apps.folder",
        description: "Project Jauhari Saved Inquiries Folder",
      }),
    });

    if (createRes.ok) {
      const createdFolder = await createRes.json();
      return createdFolder.id;
    }
  } catch (err) {
    console.warn("Could not query or create custom folder, defaulting to root Drive:", err);
  }

  return null;
}

/**
 * Uploads a formatted inquiry to the user's Google Drive storage as a Markdown document.
 * By default saves directly to user's Google Drive ("My Drive") with NO unwanted folder creation.
 */
export async function uploadInquiryToGoogleDrive(
  params: UploadInquiryParams
): Promise<SaveDriveResult> {
  const accessToken = params.token || (await getDriveAccessToken(false));
  if (!accessToken) {
    throw new Error(
      "Google Drive authorization is required. Please click 'Connect Google Drive' to authorize access."
    );
  }

  const dateStr = new Date().toISOString().split("T")[0];
  const sanitizedQuestionSlug = params.question
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .slice(0, 35)
    .replace(/\s+/g, "_");
  const fileName =
    params.customFileName || `Jauhari_${sanitizedQuestionSlug || "Inquiry"}_${dateStr}.md`;
  const markdownContent = assembleMarkdownContent(params);

  // Strategy A: RFC-compliant multipart upload
  const executeMultipartUpload = async (
    targetFolderId: string | null
  ): Promise<Response> => {
    const boundary = "JauhariBoundary" + Date.now();
    const metadata: { name: string; mimeType: string; parents?: string[] } = {
      name: fileName,
      mimeType: "text/markdown",
    };

    if (targetFolderId) {
      metadata.parents = [targetFolderId];
    }

    // RFC 2046 compliant multipart body
    const multipartRequestBody =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) +
      `\r\n--${boundary}\r\n` +
      `Content-Type: text/markdown; charset=UTF-8\r\n\r\n` +
      markdownContent +
      `\r\n--${boundary}--`;

    return await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );
  };

  // Strategy B: 2-step upload (Create metadata first, then PATCH content via upload endpoint)
  const executeTwoStepUpload = async (
    targetFolderId: string | null
  ): Promise<Response> => {
    const metadata: { name: string; mimeType: string; parents?: string[] } = {
      name: fileName,
      mimeType: "text/markdown",
    };
    if (targetFolderId) {
      metadata.parents = [targetFolderId];
    }

    // Step 1: Create file entity
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    if (!createRes.ok) {
      return createRes;
    }

    const created = await createRes.json();
    const fileId = created.id;

    // Step 2: Upload Markdown body content
    const uploadRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "text/markdown; charset=UTF-8",
        },
        body: markdownContent,
      }
    );

    if (uploadRes.ok) {
      return new Response(JSON.stringify(created), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return uploadRes;
  };

  // Determine target folder only if user explicitly specified customFolderName
  let folderId: string | null = null;
  if (params.customFolderName && params.customFolderName.trim()) {
    folderId = await getOrCreateCustomFolder(accessToken, params.customFolderName.trim());
  }

  // Upload directly to user's selected location (defaults to root My Drive)
  let uploadRes = await executeMultipartUpload(folderId);

  // If subfolder upload failed, fallback directly to root Google Drive
  if (!uploadRes.ok && folderId && (uploadRes.status === 403 || uploadRes.status === 404)) {
    console.warn(
      `Drive upload into folder ${folderId} failed (${uploadRes.status}). Retrying directly to root Google Drive...`
    );
    uploadRes = await executeMultipartUpload(null);
  }

  // If multipart upload failed, attempt Strategy B (2-step upload)
  if (!uploadRes.ok && uploadRes.status !== 401) {
    console.warn(
      `Multipart upload failed with status ${uploadRes.status}. Attempting two-step upload...`
    );
    uploadRes = await executeTwoStepUpload(null);
  }

  // If still not OK, perform detailed diagnostic analysis of the failure
  if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}));
    console.error("Google Drive API upload failed:", {
      status: uploadRes.status,
      errorData,
    });

    // Inspect active scopes to see if token actually has Drive permissions
    const tokenInfo = await inspectTokenScopes(accessToken);
    const parsedError = parseDriveApiError(uploadRes.status, errorData, tokenInfo.scopes);

    if (parsedError.isSessionExpired) {
      setCachedDriveToken(null);
      throw new Error(
        "Your Google Drive session has expired. Please re-connect Google Drive to continue."
      );
    }

    // CASE 1: Google Drive API is not enabled in Google Cloud Console
    if (parsedError.isApiDisabled) {
      throw new Error(
        `GOOGLE_DRIVE_API_DISABLED: Google Drive API is disabled in Google Cloud Project 'jauharism' (296974631120). Please enable the Google Drive API in Google Cloud Console to allow saving: ${parsedError.enableApiUrl}`
      );
    }

    // CASE 2: Token is missing Drive scopes
    const hasDriveScope =
      tokenInfo.scopes.includes("https://www.googleapis.com/auth/drive") ||
      tokenInfo.scopes.includes("https://www.googleapis.com/auth/drive.file");

    if (parsedError.isScopeInsufficient || (!hasDriveScope && tokenInfo.scopes.length > 0)) {
      setCachedDriveToken(null);
      throw new Error(
        `INSUFFICIENT_DRIVE_SCOPES: Google Drive access permissions were not granted by your Google account. (Active scopes: [${tokenInfo.scopes
          .map((s) => s.split("/").pop())
          .join(", ")}]). Please click 'Re-connect & Grant Permissions' and make sure the Google Drive access checkbox is checked on the authorization screen.`
      );
    }

    // CASE 3: General Google API error - preserve Google's exact message
    throw new Error(
      parsedError.message ||
        `Google Drive upload failed with status ${uploadRes.status} (${parsedError.reason || "Unknown reason"}).`
    );
  }

  const uploadedFile = await uploadRes.json();

  // Retrieve webViewLink if not already present
  let webViewLink = uploadedFile.webViewLink;
  if (!webViewLink && uploadedFile.id) {
    try {
      const metaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${uploadedFile.id}?fields=webViewLink`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        webViewLink = metaData.webViewLink;
      }
    } catch (metaErr) {
      console.warn("Could not retrieve webViewLink from Drive metadata:", metaErr);
    }
  }

  return {
    fileId: uploadedFile.id,
    webViewLink:
      webViewLink || `https://drive.google.com/file/d/${uploadedFile.id}/view`,
    fileName: uploadedFile.name || fileName,
  };
}
