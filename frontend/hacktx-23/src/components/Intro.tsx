import React, { useState } from 'react';
import { Input } from '~/components/ui/input'
import AIWriter from "react-aiwriter";


const Intro = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(
    { monthlyIncome: '', monthlyExpense: '' });

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9.]/g, ''); // remove non-numeric characters
    const newValue = `$ ${cleanedValue}`;
    setFormData({ ...formData, [name]: newValue });
  };

  if(page >= 2) {
  return (
    <div className="center bg-white w-fit h-fit px-8 pt-6 pb-3 rounded-lg border-2 shadow-sm">
      <div className="content">
        {/* <h1 className="text-xl pb-6 text-emerald-600">Page {page}</h1> */}
        {page === 0 && (
          <div>
            {/* @ts-ignore */}
            <AIWriter delay={100}>
              <div>
                <p className='text-xl pb-4 text-emerald-600 w-[400px]'>hey! i'm thrifti, your *free* AI financial advisor! i'll learn a little about your spending habits and hopefully save you some cash.</p>
              </div>
            </AIWriter>
          </div>


        )}

        {page === 1 && (
          <div>
            {/* @ts-ignore */}
            {/* <AIWriter delay={100}> */}
              <div>
                <h1 className="text-xl pb-4  text-emerald-600">what's your monthly income?</h1>
              </div>
            {/* </AIWriter> */}
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
            {/* @ts-ignore */}
            {/* <AIWriter delay={100}> */}
              <h1 className="text-xl pb-4  text-emerald-600">how much do you spend on rent?</h1>
            {/* </AIWriter> */}
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

      <div className="inputs-ctr pb-4">
        <button className="left mt-2 rounded-md transition-all duration-100 bg-emerald-500 hover:bg-emerald-600 border-emerald-500 border-[1px] px-3 py-1 shadow-sm w-min" onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff" className="w-6 h-6">                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />               </svg>
        </button>

        <button className="float-right hover:text-emerald-600 mt-2 w-fit rounded-md px-2 py-1 text-slate-400 font-light" onClick={handleNext}>
          <p className="float-left pr-2">press enter</p>
          <svg className="float-right w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
        }
};

export default Intro;
