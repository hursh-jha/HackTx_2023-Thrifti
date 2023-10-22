import { useState } from 'react';

const FileUpload = () => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || '');
  };

  return (
    <div className="flex flex-col items-start w-full">
      <span className="mb-2  text-emerald-600  float-right">{fileName ? fileName : "accepted file types (.csv)"}</span>
      <label htmlFor="fileInput" className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 w-full text-center  text-white p-2 rounded">
        choose file
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
