import React, { useState, useCallback } from "react";
import { InboxIcon } from "../assets/Icons";

function FileUploader(props: {
  onFileSelected: Function;
  isDragging: boolean;
}) {
  const { isDragging } = props;

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(file);
    }
    props.onFileSelected(file);
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(true);
    },
    []
  );

  const handleDragEnd = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
    },
    []
  );

  const handleFileInputClick = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          setFile(file);
          props.onFileSelected(file);
        }
      };
      fileInput.click();
    },
    []
  );

  const c = isDragOver ? "green" : "slate";

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`border-[3px] border-dashed rounded-3xl p-6 cursor-pointer bg-${c}-200 border-${c}-400 text-${c}-400`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragEnd}
        onDragExit={handleDragEnd}
        onClick={handleFileInputClick}
      >
        <div className="h-6 flex justify-between">
          <p className="font-bold">
            {isDragging ? "Drop your file here!" : "Click to add a file!"}
          </p>
          <InboxIcon />
        </div>
      </div>
      {file && (
        <div className="pl-[1.2rem] -mb-2 text-green-600 font-bold">
          File selected: {file.name}
        </div>
      )}
    </div>
  );
}

export default FileUploader;
