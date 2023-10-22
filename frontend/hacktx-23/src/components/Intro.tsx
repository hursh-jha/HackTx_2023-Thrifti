import React, { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { IBM_Plex_Mono } from "next/font/google";
import AIWriter from "react-aiwriter";
import { text } from 'stream/consumers';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';

const sm = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin']
});

interface Props {
  enable: boolean;
  textUpdate: (newValue: string) => void; // Replace string with the actual type
}

const Intro = ({ enable, textUpdate }: Props) => {
   const [page, setPage] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState(
    { monthlyIncome: '', monthlyExpense: '', fileUpload: '' }
  );
  const [fileUpload, setFileUpload] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleEnterPress);

    return () => {
      document.removeEventListener("keydown", handleEnterPress);
    };
  }, [page, fileUpload]);
  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
      setError('');
    }
  };

  const handleNext = () => {
    const currentPageInput = page === 1 ? formData.monthlyIncome : formData.monthlyExpense;
    if (currentPageInput === '' || !/^\$\s\d+(\.\d{1,2})?$/.test(currentPageInput)) {
      setError('Please enter a valid number.');
      return;
    }

    setError(''); 
    if (page === 3 && fileUpload === 1) {
      router.push("/chat")
      return
    }
    setPage(page + 1);
  };

  const renderErrorMessage = () => {
    if (!error) return null;
    return <div className="text-red-500 mt-2">{error}&nbsp;</div>;
  };

  const errorClass = error ? 'shake border-red-500' : '';

  const pageInputs: string[] = [
    "first off, let's get an idea of your income and expenses. how much do you make in a month?",
    "ok mr./ms./mx. moneybags! now, how much do you spend on rent?",
    "now, we can speed up the process by uploading a credit card statement. this is optional, but it'll help me learn more about your spending habits.",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9.]/g, ''); // remove non-numeric characters
    const newValue = `$ ${cleanedValue}`;
    setFormData({ ...formData, [name]: newValue });
  };

  if (enable) {
    textUpdate("");
    if (fileUpload === 1) {
      textUpdate("awesome! by clicking next or pressing enter, you agree to let us process your data.");
    }
    else if (pageInputs[page - 1] !== undefined && pageInputs[page - 1] !== null && pageInputs[page - 1] !== '')
      textUpdate(pageInputs[page - 1] || '');
  return (
  <div className={"center bg-white w-fit h-fit px-8 pt-8 pb-3 rounded-lg border-2 shadow-sm "}>
    <div className="content">
      {page === 1 && (
        <div>
          <Input
            name="monthlyIncome"
            className={`text-4xl font-light ring-slate-400 focus:!ring-emerald-600  placeholder-emerald-600/50 text-emerald-600 py-8 w-96 ring-2 ring-offset-2 ${error && page === 1 ? 'ring-red-500 shake' : ''}`}
            placeholder="$ 3000"
            value={formData.monthlyIncome}
            onChange={handleChange}
          />
          {page === 1 && <div className="text-red-500 mt-3 mb-4">{error}&nbsp;</div>}
        </div>
      )}

      {page === 2 && (
        <div>
          <Input
            name="monthlyExpense"
            className={`text-4xl font-light ring-slate-400 focus:!ring-emerald-600  placeholder-emerald-600/50 text-emerald-600 py-8  w-96 ring-2 ${error && page === 2 ? 'ring-red-500 shake' : 'ring-emerald-600'}`}
            placeholder="$ 3000"
            value={formData.monthlyExpense}
            onChange={handleChange}
          />
          {page === 2 && <div className="text-red-500 mt-3 mb-4">{error}&nbsp;</div>}
        </div>
      )}

      {page === 3 && (
        <div className='block w-[350px]'>
          <FileUpload textUpdate={setFileUpload} />
          <h1 className='text-emerald-600 my-3 text-center'>- or -</h1>
          <button className="cursor-pointer w-full bg-gray-900 hover:bg-gray-800 text-center text-white p-2 py-2 mb-5 rounded">
            link with plaid
          </button>
        </div>
      )}

      {page === 4 && (
        <div>
          <Input
            name="monthlyExpense"
            className={`text-4xl font-light ring-slate-400 focus:!ring-emerald-600  placeholder-emerald-600/50 text-emerald-600 py-8  w-96 ring-2 ${error && page === 4 ? 'ring-red-500 shake' : 'ring-emerald-600'}`}
            placeholder="$ 3000"
            value={formData.monthlyExpense}
            onChange={handleChange}
          />
          {error && page === 4 && <div className="text-red-500 mb-4">{error}</div>}
        </div>
      )}
    </div>

    {page < pageInputs.length + 2 && (
      <div className="inputs-ctr pb-4">
        <button className="left mt-2 rounded-md transition-all duration-100 bg-emerald-500 hover:bg-emerald-600 border-emerald-500 border-[1px] px-3 py-1 shadow-sm w-min" onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
        </button>

        <button 
          className={"float-right hover:text-emerald-600 mt-2 w-fit rounded-md px-2 py-1 text-slate-400 font-light "}
          onClick={handleNext}
        >
          <p className={"float-left pr-2 " + sm.className}>
            {(fileUpload === 0 && page === 3) ? "skip this step" : "press enter"}
          </p>
          <svg className="float-right w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </button>
      </div>
    )}
  </div>
);

  }
};

export default Intro;
