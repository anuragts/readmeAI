import Head from "next/head";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import Loading from "@/pages/components/Loading";

export default function Home() {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [extraDetails, setExtraDetails] = useState<string>("");
  const [repoLink, setRepoLink] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const extractRepoInfo = (link: string) => {
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const matches = link.match(regex);
    if (matches) {
      const [, owner, repo] = matches;
      return { owner, repo };
    } else {
      throw new Error("Invalid GitHub repo link");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponse("");
    setLoading(true);
    let data = { owner, repo, extraDetails };
    if (repoLink) {
      const { owner: extractedOwner, repo: extractedRepo } =
        extractRepoInfo(repoLink);
      setOwner(extractedOwner);
      setRepo(extractedRepo);
      data = { owner: extractedOwner, repo: extractedRepo, extraDetails };
    }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
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
          <div className="text-4xl block mb-[1rem] mt-[1rem] font-bold text-gray-700">ReadME-AI</div>
          <p className="mt-3 text-xl text-[#3B3B3B] mb-[2rem]">
                Make you Readme file perfect !
              </p>
          <label className="block mb-2 font-bold text-gray-700">
              GitHub Repository Link :
            </label>
            <input
              className="block w-full p-3 rounded bg-gray-200 border border-gray-300 mb-2"
              type="text"
              placeholder="e.g. https://github.com/octocat/hello-world"
              value={repoLink}
              onChange={(event) => setRepoLink(event.target.value)}
            />
            {/* <label className="block mb-2 font-bold text-gray-700">
              Repository Owner Username:
            </label>
            <input
              className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              placeholder="anuragts"
            />
            <label className="block mt-4 mb-2 font-bold text-gray-700">
              Repository Name:
            </label>
            <input
              className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              value={repo}
              onChange={(event) => setRepo(event.target.value)}
              placeholder="readmeAI"
            /> */}
            <label className="block mt-4 mb-2 font-bold text-gray-700">
              Extra Details about the project(Optional):
            </label>
            <textarea
              className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={extraDetails}
              onChange={(event) => setExtraDetails(event.target.value)}
              placeholder="Add any extra details about the project here."
            ></textarea>
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
          <div className="w-full md:w-1/2 p-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-screen">
              <div className="flex justify-between items-center">
                <h2 className="text-gray-200 font-bold text-lg">
                  Generated README.md
                </h2>
                {response && (
                  <FiCopy
                    className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-200"
                    onClick={() => copyToClipboard(response)}
                  />
                )}
              </div>
              <hr className="my-4" />
              {loading && (
                <div className="flex justify-center">
                  <Loading />
                </div>
              )}
              {response ? (
                <ReactMarkdown
                  children={response.replace(/\\n/g, " \n")}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className="text-gray-300"
                />
              ) : (
                <p className="text-gray-300 text-center">
                  Nothing to show here!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
