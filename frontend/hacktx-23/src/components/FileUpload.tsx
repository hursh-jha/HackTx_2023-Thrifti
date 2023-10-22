import { useState } from 'react';
import { useAppContext } from '~/pages/_app';

interface Props {
  textUpdate: (newValue: number) => void; // Replace string with the actual type
}

const FileUpload = ({ textUpdate }: Props) => {
  const [fileName, setFileName] = useState('');
  const { ctxData, setCtxData } = useAppContext();

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || '');
    console.log("File uploaded successfully!")
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result;
      // @ts-ignore
      const lines = csv.split('\n');
      // @ts-ignore
      const result = [];
      // @ts-ignore
      lines.forEach((line, index) => {
        const row = line.split(',');
        if (index === 0) {
          // Skip header row
          return;
        }
        result.push(row);
      });
      setCtxData({
        ...ctxData,
        userData: {
          ...ctxData.userData,
          // @ts-ignore
          transactions: result,
        },
      });
      // @ts-ignore
      console.log(result)
    };
    // alert("File uploaded successfully!")
    reader.readAsText(file);
    textUpdate(1)
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
