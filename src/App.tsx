import { useEffect, useState } from "react";
import FileUploader from "./components/FileUploader";
import { FileEncrypterDecrypter } from "./components/FileEncryptorDecryptor";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);

  useEffect(() => {
    document.title = "File Encryptor";
  }, [])

  return (
    <div className="p-4 max-w-screen-sm h-screen mx-auto gap-4 flex flex-col justify-center">
      <FileUploader onFileSelected={selectFile} isDragging={false}/>
      <FileEncrypterDecrypter
        file={file}
        isEncrypted={isEncrypted}
      />
    </div>
  );

  function selectFile(file: File) {
    setFile(file);
    if (file.name.endsWith(".enc")) {
      setIsEncrypted(true);
    } else {
      setIsEncrypted(false);
    }
  }
}

export default App;
