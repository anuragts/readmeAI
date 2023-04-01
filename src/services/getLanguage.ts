export default async (owner:string , repo:string) => {
    const a =  await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
    const response = await a.json();
    return response
    //   console.log(response)
}
