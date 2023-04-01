import type { NextApiRequest, NextApiResponse } from "next";
import getLanguage from "@/services/getLanguage";
import getDetails from "@/services/getDetails";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  type githubBody = {
    owner: string;
    repo: string;
  };
  const { owner, repo } = req.body as githubBody;
  const lang = await getLanguage(owner, repo);
  const languages = `${JSON.stringify(lang)}`;
  const details = await getDetails(owner, repo);
  const description: string = details?.description;
  const name: string = details?.name;
  const size: number = details?.size;
  const stargazers_count: number = details?.stargazers_count;
  const watchers_count: number = details?.watchers_count;
  const forks_count: number = details?.forks_count;
  const allow_forking: boolean = details.allow_forking;
  const forks: number = details.forks;
  const default_branch: string = details.default_branch;
  res.status(200).json({
    name: `${name}`,
    description: `${description}`,
    size: `${size}`,
    stargazers_count: `${stargazers_count}`,
    watchers_count: `${watchers_count}`,
    forks_count: `${forks_count}`,
    allow_forking: `${allow_forking}`,
    forks: `${forks}`,
    default_branch: `${default_branch}`,
    lang: `$${languages}`,
  });
};
