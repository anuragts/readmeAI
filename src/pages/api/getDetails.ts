import type { NextApiRequest,NextApiResponse } from "next";

export default async (req:NextApiRequest ,  res:NextApiResponse) => {
    const owner:string = 'anuragts'
    const repo:string = 'codeAI'
    const a =  await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    const response = await a.json();
      res.status(200).json(response);
      // console.log(response)
}
