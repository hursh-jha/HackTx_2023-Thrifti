// index.tsx
import Head from "next/head";
import Link from "next/link";
import { Input } from '~/components/ui/input';
import { Karla } from "next/font/google"
import { IBM_Plex_Mono } from "next/font/google"
import Intro from "~/components/Intro"
import AIWriter from "react-aiwriter";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppContext } from '~/pages/_app';
import PieChart from "~/components/PieChart";
import ReactLoading from 'react-loading';

import axios from "axios";

const labels = [
    "Restaurant",
    "Apparel",
    "Technology",
    "Groceries",
    "Entertainment",
    "Automotive",
    "Healthcare",
    "Education",
    "Travel",
    "Utilities",
  ];

  const data = [300, 50, 100, 200, 175, 250, 225, 80, 150, 120];


const sm = IBM_Plex_Mono({
    weight: ['400', '700'],
    subsets: ['latin']
});

const karla = Karla({
    weight: ['200', '300', '400', '500', '600', '700'],
    subsets: ['latin']
});

export default function Home() {
    const [enable, setEnable] = useState(false);
    const [text, setText] = useState("hey! i'm thrifti, your *free* AI financial advisor! i'll learn a little about your spending habits and hopefully save you a lot of cash.");
    const { ctxData, setCtxData } = useAppContext();
    const [umessage, setUMessage] = useState('');
    const router = useRouter();
    interface EntryState {
        data: any[];
        labels: string[];
    }
    const [entries, setEntries] = useState<EntryState>({ "data": [], "labels": [] });

    const customFunc = async (d_msg: string) => {
        let n_msg = "Give me insights into my spendings on " + d_msg + "."
        console.log(ctxData.userData.transactions)
        setCtxData({
            ...ctxData,
            messages: [
                ...ctxData.messages,
                {
                    "role": "user",
                    "content": n_msg
                },
            ],
        });
        // @ts-ignore
        const trStr = ctxData.userData.transactions.map(subList => subList.join(', ')).join('\n');
        const cleanedStr = trStr.replace(/["\n\r]/g, ' ');

        const response = await axios.post("http://127.0.0.1:5000/chat", {
            messages: [...ctxData.messages,
            {
                "role": "user",
                "content": n_msg
            }
            ],
            income: ctxData.userData.formData.monthlyIncome,
            expense: ctxData.userData.formData.monthlyExpense,
            transactions: cleanedStr
        });
        console.log(response.data)
        console.log(ctxData.messages)
        setCtxData({
            ...ctxData,
            messages: [
                ...ctxData.messages,
                {
                    "role": "user",
                    "content": n_msg
                },
                {
                    "role": response.data.role,
                    "content": response.data.content
                }
            ],
        });
    }

    useEffect(() => {
        if (!ctxData.userData.formData || !ctxData.userData.transactions || !ctxData.userData.formData.monthlyIncome || !ctxData.userData.formData.monthlyExpense) {
            router.push('/');
            return
        }
        
        const availableFunds = parseFloat(ctxData.userData.formData.monthlyIncome.split("$")[1]) - parseFloat(ctxData.userData.formData.monthlyExpense.split("$")[1]);
        // check available funds is a number
        if (isNaN(availableFunds)) {
            router.push('/');
        }

        axios.post("http://127.0.0.1:5000/category_creation", {
            category_list: ctxData.userData.transactions
        }).then((response) => {
            const categories = response.data;
            console.log(response.data)
            console.log("one." + ctxData.userData.formData.monthlyIncome)
            console.log("two." + ctxData.userData.formData.monthlyExpense)
            console.log("FUNDS: " + availableFunds)
            axios.post("http://127.0.0.1:5000/budget_creation", {
                category_list: categories,
                amount: availableFunds
            }).then((response) => {
                console.log("got res")
                console.log(response.data)
                const labels_lst = []
                const data_lst = []
                for (const [key, value] of Object.entries(response.data)) {
                    let short = key.replace(/['"`]/g, "")
                    if(short.startsWith("Travel")) {
                        short = "Entertainment"
                    }
                    labels_lst.push(short)
                    data_lst.push(value)
                }
                // @ts-ignore
                setEntries({
                    "data": data_lst,
                    "labels": labels_lst
                })
            })
        })
    }, []);

    const sendMessage = async () => {
        console.log(ctxData.userData.transactions)
        setCtxData({
            ...ctxData,
            messages: [
                ...ctxData.messages,
                {
                    "role": "user",
                    "content": umessage
                },
            ],
        });
        // @ts-ignore
        const trStr = ctxData.userData.transactions.map(subList => subList.join(', ')).join('\n');
        const cleanedStr = trStr.replace(/["\n\r]/g, ' ');

        const response = await axios.post("http://127.0.0.1:5000/chat", {
            messages: [...ctxData.messages,
            {
                "role": "user",
                "content": umessage
            }
            ],
            income: ctxData.userData.formData.monthlyIncome,
            expense: ctxData.userData.formData.monthlyExpense,
            transactions: cleanedStr
        });
        console.log(response.data)
        console.log(ctxData.messages)
        setCtxData({
            ...ctxData,
            messages: [
                ...ctxData.messages,
                {
                    "role": "user",
                    "content": umessage
                },
                {
                    "role": response.data.role,
                    "content": response.data.content
                }
            ],
        });
    }

    return (
        <>
            <Head>
                <title>thrifti | talk</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={"min-h-screen min-w-full  bg-gray-100 flex  content-center justify-center align-center" + karla.className}>
                <div className="min-h-screenblock flex-grow w-full text-slate-500">
                    <div className="px-[64px] py-16 text-lg fixed">
                        <p className="my-2 ">monthly income: {ctxData.userData.formData && ctxData.userData.formData.monthlyIncome}</p>
                        <p className="my-2">monthly expenses: {ctxData.userData.formData && ctxData.userData.formData.monthlyExpense}</p>
                        <p className="my-2">charges this month: {ctxData.userData.transactions && ctxData.userData.transactions.length}</p>
                    </div>
                </div>
                <div className="!min-w-[600px] !max-w-[600px] mx-2 my-10 items-end content-end self-end">
                    {ctxData.messages && ctxData.messages.map((message, index) => (
                        (index == ctxData.messages.length - 1 && message.role == "user") ? (
                            <div>
                                <div className="!min-w-[600px] !max-w-[600px] bg-white border-[1px] border-slate-300 py-2 px-8 my-4 rounded-lg shadow-sm">
                                    <p className="text-lg text-emerald-700 my-3"><strong className="text-emerald-800">{message.role}</strong>: {message.content}</p>
                                </div>
                                <div className="!min-w-[600px] !max-w-[600px] bg-white border-[1px] border-slate-300 py-2 px-8 my-4 rounded-lg shadow-sm">
                                    <ReactLoading color={"#059669"} type={"bars"} className="h-32 mx-auto my-2" height={"0%"} width={25} />
                                </div>
                            </div>

                        ) : (
                            <div className="!min-w-[600px] !max-w-[600px] bg-white border-[1px] border-slate-300 py-2 px-8 my-4 rounded-lg shadow-sm">
                                <p className="text-lg text-emerald-700 my-3"><strong className="text-emerald-800">{message.role}</strong>: {message.content}</p>
                            </div>
                        )
                    ))}
                    <div className="flex content-evenly justify-between">
                        <Input
                            name="monthlyExpense"
                            className={`text-lg mt-4 w-10/12 font-[400] focus:!ring-emerald-600  placeholder-emerald-600/50 text-emerald-600 py-5 ring-1 `}
                            placeholder="what are some meals i can cook on my budget?"
                            value={umessage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUMessage(e.target.value)}
                        />
                        <button className="mt-4 bg-emerald-600 text-white px-4 rounded-md" onClick={() => sendMessage()}>ask!</button>
                    </div>
                    {/* <input type="text" value={umessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUMessage(e.target.value)} /> */}
                </div>
                <div className="min-h-screen block flex-grow w-full ">
                    <div className="px-[64px] py-3 fixed text-lg float-right text-right">
                        {entries.labels.length < 1 && <ReactLoading color={"#059669"} type={"bars"} className="h-48 mx-auto ml-48 mt-32 top-0" height={"0%"} width={30} />}
                        <PieChart labels={entries.labels} data={entries.data} customFunc={customFunc}/>

                        {/* <p className="my-2 font-bold">Monthly Income: {ctxData.userData.formData && ctxData.userData.formData.monthlyIncome}</p> */}
                        {/* <p className=" font-bold">Monthly Expenses: {ctxData.userData.formData && ctxData.userData.formData.monthlyExpense}</p> */}
                    </div>
                </div>
            </main>
        </>
    );
}
