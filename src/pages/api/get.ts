import type { NextApiRequest, NextApiResponse } from "next";
import getLanguage from "@/services/getLanguage";
import getDetails from "@/services/getDetails";
import { openAi } from "@/config/openAi.config";
import sample from "@/utils/sample";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  type githubBody = {
    owner: string;
    repo: string;
    extra?: string;
  };
  const { owner, repo,extra } = req.body as githubBody;

  // Github API stuff , get details and language.
  const lang = await getLanguage(owner, repo);
  const languages = `${JSON.stringify(lang)}`;
  const details = await getDetails(owner, repo);
  const description: string = details?.description;
  const name: string = details?.name;
  const size: number = details?.size;
//   const stargazers_count: number = details?.stargazers_count;
//   const watchers_count: number = details?.watchers_count;
  const forks_count: number = details?.forks_count;
  const allow_forking: boolean = details.allow_forking;
  const forks: number = details.forks;
  const default_branch: string = details.default_branch;
  

  // OpenAI Chatgpt stuff

  const message:string =  ` Repo Name ${name} and created with ${languages} repo. Size - ${size} .  $ ${forks_count} forks. It is ${allow_forking} that it can be forked. It has ${forks} forks and the default branch is ${default_branch}. The description ${description} . ${extra} create a good readme for this repo with instructions on how to contribute and install. `;
  
  const response = await openAi.createChatCompletion({
    model:"gpt-3.5-turbo",
    messages:[
        {"role": "system", "content": `${sample.system}`},  
        {"role": "user", "content": `${sample.user1}`},
        {"role": "assistant", "content": `${sample.assistant}`},
        {"role": "user", "content": `${message}`}
    ]
})
res.status(200).json(response.data.choices[0].message?.content);
};
