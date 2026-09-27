import { getDriveAccessToken, setCachedDriveToken } from "./firebase.ts";

export interface SaveDriveResult {
  fileId: string;
  webViewLink: string;
  fileName: string;
}

/**
 * Searches for or creates a designated folder in the user's Google Drive.
 */
async function getOrCreateJauhariFolder(accessToken: string): Promise<string | null> {
  const folderName = "Project Jauhari - Saved Inquiries";

  try {
    // 1. Search for existing folder
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`
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

    // 2. Folder does not exist, create it
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        description: "Epistemological inquiries and synthesized responses from Project Jauhari.",
      }),
    });

    if (createRes.ok) {
      const createdFolder = await createRes.json();
      return createdFolder.id;
    }
  } catch (err) {
    console.warn("Could not query or create Jauhari folder, defaulting to root Drive:", err);
  }

  return null;
}

/**
 * Uploads a formatted inquiry to the user's Google Drive storage as a Markdown document.
 */
export async function uploadInquiryToGoogleDrive(params: {
  question: string;
  answer: string;
  focalAxiomId?: string;
  answerSource?: string;
  timestamp?: string;
  token?: string;
}): Promise<SaveDriveResult> {
  const accessToken = params.token || (await getDriveAccessToken(false));
  if (!accessToken) {
    throw new Error(
      "Google Drive authorization is required. Please click 'Connect Google Drive' or authorize access to enable saving."
    );
  }

  const dateStr = new Date().toISOString().split("T")[0];
  const sanitizedQuestionSlug = params.question
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .slice(0, 35)
    .replace(/\s+/g, "_");
  const fileName = `Jauhari_${sanitizedQuestionSlug || "Inquiry"}_${dateStr}.md`;

  // Assemble formatted Markdown content
  const markdownContent = `# Project Jauhari: Epistemological AI Inquiry
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

  // Get or create dedicated folder
  const folderId = await getOrCreateJauhariFolder(accessToken);

  // Metadata object for Google Drive
  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: fileName,
    mimeType: "text/markdown",
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  // Multipart upload boundary
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/markdown; charset=UTF-8\r\n\r\n" +
    markdownContent +
    closeDelimiter;

  const uploadRes = await fetch(
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

  if (!uploadRes.ok) {
    if (uploadRes.status === 401) {
      setCachedDriveToken(null);
      throw new Error("Your Google Drive session has expired. Please re-authorize Google Drive to continue.");
    }
    const errorData = await uploadRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Drive upload failed with status ${uploadRes.status}`
    );
  }

  const uploadedFile = await uploadRes.json();

  // If webViewLink wasn't returned in the create response, fetch metadata with webViewLink
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
