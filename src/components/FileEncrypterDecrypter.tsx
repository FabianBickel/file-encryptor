import { useState } from "react";

export function FileEncrypterDecrypter(props: {
  file: File | null;
  isEncrypted: boolean;
}) {
  const [passwordError, setPasswordError] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { file, isEncrypted } = props;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          className="w-max min-w-16 border-2 border-slate-300 text-slate-800 px-4 py-1 rounded-3xl mr-auto"
        />
        <button
          disabled={file === null}
          className={`w-max rounded-3xl px-4 py-2 border-2 border-transparent text-white ${
            file ? "cursor-pointer bg-slate-500" : "cursor-default bg-slate-300"
          }`}
          onClick={isEncrypted ? handleEncrypt : handleDecrypt}
        >
          {isEncrypted ? "Encrypt" : "Decrypt"} instead
        </button>
        <button
          disabled={file === null}
          className={`w-max rounded-3xl px-4 py-2 border-2 border-transparent text-white ${
            file ? "cursor-pointer bg-blue-500" : "cursor-default bg-slate-300"
          }`}
          onClick={isEncrypted ? handleDecrypt : handleEncrypt}
        >
          {isEncrypted ? "Decrypt" : "Encrypt"}
        </button>
      </div>
      {passwordError && <p className="pl-5 text-red-500">{passwordError}</p>}
    </div>
  );

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = event.target.value;
    setPassword(newPassword);
  }

  function validatePassword(password: string) {
    const errors = [];
    if (password.length < 10) {
      errors.push("Password must be at least 10 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[\^$*.\[\]{}()?"!@#%&/,><':;|_~`\\]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (^$*.[]{}()?'!@#%&,><':;|_~`)"
      );
    }

    setPasswordError(errors[0]);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
  }

  function handleEncrypt() {
    if (!file) return;
    try {
      validatePassword(password);
      encryptFile(file, password);
    } catch (error) {}
  }

  function handleDecrypt() {
    if (!file) return;
    try {
      validatePassword(password);
      decryptFile(file, password);
    } catch (error) {}
  }

  async function deriveKeys(
    password: string
  ): Promise<{ key1: CryptoKey; key2: CryptoKey }> {
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const key1 = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("1"),
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-CBC", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const key2 = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("2"),
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign", "verify"]
    );

    return { key1, key2 };
  }

  // Function to encrypt a file
  async function encryptFile(file: File, password: string): Promise<void> {
    const { key1, key2 } = await deriveKeys(password);
    const data = await file.arrayBuffer();

    // Encrypt the file
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key1,
      data
    );

    // Compute the integrity hash
    const hash = await window.crypto.subtle.sign("HMAC", key2, encryptedData);

    // Combine IV, encrypted data, and hash into a single Blob
    const combinedData = new Blob(
      [iv, new Uint8Array(encryptedData), new Uint8Array(hash)],
      { type: "application/octet-stream" }
    );

    // Automatically download the file
    downloadFile(combinedData, file.name + ".enc");
  }

  async function decryptFile(
    encryptedFile: File,
    password: string
  ): Promise<void> {
    const { key1, key2 } = await deriveKeys(password);

    // Read the file content
    const fileArrayBuffer = await encryptedFile.arrayBuffer();

    // Extract IV, encrypted data, and hash
    const iv = new Uint8Array(fileArrayBuffer.slice(0, 16)); // Assuming IV is the first 16 bytes
    const hashLength = 32; // Assuming SHA-256 hash
    const hash = new Uint8Array(
      fileArrayBuffer.slice(
        fileArrayBuffer.byteLength - hashLength,
        fileArrayBuffer.byteLength
      )
    );
    const encryptedData = new Uint8Array(
      fileArrayBuffer.slice(16, fileArrayBuffer.byteLength - hashLength)
    );

    // Verify the integrity before decrypting
    const isIntegrityOk = await window.crypto.subtle.verify(
      "HMAC",
      key2,
      hash,
      encryptedData // Only the encrypted data part should be hashed
    );

    if (!isIntegrityOk) {
      alert(
        "Hash mismatch!\nThe file has been corrupted or the password is incorrect."
      );
      return;
    }

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key1,
      encryptedData
    );

    // Create a Blob from the decrypted data
    const decryptedBlob = new Blob([decryptedData], {
      type: "application/octet-stream",
    });

    // Download the decrypted file, removing .enc extension
    const originalFilename = encryptedFile.name.replace(".enc", "");
    downloadFile(decryptedBlob, originalFilename);
  }

  function downloadFile(blob: Blob, filename: string) {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}
