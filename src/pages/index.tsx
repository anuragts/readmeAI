import Head from "next/head";
import { useState } from "react";
// import Image from "next/image";
import { Inter } from "next/font/google";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [extraDetails, setExtraDetails] = useState<string>("");
  const [response, setResponse] = useState<string>("Nothing to show here!");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponse("");
    setLoading(true);
    const data = { owner, repo, extraDetails };
    const response = await fetch("/api/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    setLoading(false);
    setResponse(json);
  };

  return (
    <>
      <Head>
        <title>ReadME-AI</title>
        <meta name="description" content="Generated cool readme files." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col md:flex-row">
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-6">
            <label className="block mb-2 font-bold text-gray-700">
              Repository Owner:
            </label>
            <input
              className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
            />
            <label className="block mt-4 mb-2 font-bold text-gray-700">
              Repository Name:
            </label>
            <input
              className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              value={repo}
              onChange={(event) => setRepo(event.target.value)}
            />
            <label className="block mt-4 mb-2 font-bold text-gray-700">
              Extra Details:
            </label>
            <textarea
              className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={extraDetails}
              onChange={(event) => setExtraDetails(event.target.value)}
            />
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 focus:outline-none focus:bg-blue-400">
              Submit
            </button>
          </form>
          <div className="h-screen md:w-1/2 p-6 text-white bg-[#191825]">
            {loading && (
              <div className="text-white text-lg p-10">Loading...</div>
            )}
            {response && (
              <ReactMarkdown
                skipHtml={false}
                sourcePos={true}
                remarkPlugins={[remarkGfm]}
              >{response.replace(/<br \/>/g, '\n')}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
