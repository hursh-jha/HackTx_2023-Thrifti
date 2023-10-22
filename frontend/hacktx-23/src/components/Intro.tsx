import React, { useState } from 'react';
import { Input } from '~/components/ui/input'
import AIWriter from "react-aiwriter";
import { text } from 'stream/consumers';
import FileUpload from './FileUpload';

interface Props {
  enable: boolean;
  textUpdate: (newValue: string) => void; // Replace string with the actual type
}

const Intro = ({ enable, textUpdate }: Props) => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(
    { monthlyIncome: '', monthlyExpense: '', fileUpload: ''});
  const [fileUpload, setFileUpload] = useState(false);

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

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
    if (pageInputs[page - 1] !== undefined && pageInputs[page - 1] !== null && pageInputs[page - 1] !== '')
      textUpdate(pageInputs[page - 1] || '');
    return (
      <div className="center bg-white w-fit h-fit px-8 pt-6 pb-3 rounded-lg border-2 shadow-sm">
        <div className="content">
          {page === 1 && (
            <div>
              <Input
                name="monthlyIncome"
                className="text-4xl font-light !placeholder-emerald-600/50 text-emerald-600 py-8 mb-8 w-96 !ring-emerald-600"
                placeholder="$ 3000"
                value={formData.monthlyIncome}
                onChange={handleChange}
              />
            </div>
          )}

          {page === 2 && (
            <div>
              <Input
                name="monthlyExpense"
                className="text-4xl font-light !placeholder-emerald-600/50 text-emerald-600 py-8 mb-8 w-96 !ring-emerald-600"
                placeholder="$ 3000"
                value={formData.monthlyExpense}
                onChange={handleChange}
              />
            </div>
          )}


          {page === 3 && (
            <div className='block w-[350px]'>
              
              {/* <h1 className='text-emerald-600 mb-2'>accepted file types (.csv)</h1> */}
              <FileUpload textUpdate={setFileUpload} />
              <h1 className='text-emerald-600 my-3  text-center'>- or - {fileUpload}</h1>
              <button className="cursor-pointer w-full bg-gray-900 hover:bg-gray-800 text-center  text-white p-2 py-2 mb-5 rounded">
                link with plaid {fileUpload}
              </button>
            </div>
          )}


          {page === 4 && (
            <div>
              <Input
                name="monthlyExpense"
                className="text-4xl font-light !placeholder-emerald-600/50 text-emerald-600 py-8 mb-8 w-96 !ring-emerald-600"
                placeholder="$ 3000"
                value={formData.monthlyExpense}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        
        {page < pageInputs.length+2 && (
        <div className="inputs-ctr pb-4">
          <button className="left mt-2 rounded-md transition-all duration-100 bg-emerald-500 hover:bg-emerald-600 border-emerald-500 border-[1px] px-3 py-1 shadow-sm w-min" onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff" className="w-6 h-6">                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />               </svg>
          </button>

          <button className="float-right hover:text-emerald-600 mt-2 w-fit rounded-md px-2 py-1 text-slate-400 font-light" onClick={handleNext}>
            <p className="float-left pr-2">{true ? "skip this step" : "press enter"}</p>
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
