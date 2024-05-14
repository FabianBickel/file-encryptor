import { useState } from "react";
import FileUploader from "./components/FileUploader";
import { FileEncrypterDecrypter } from "./components/FileEncrypterDecrypter";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);

  return (
    <div className="p-4 max-w-screen-sm h-screen mx-auto gap-4 flex flex-col justify-center">
      {/* <h1 className="text-2xl border-b border-slate-400 pb-2">File Protector</h1> */}
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
