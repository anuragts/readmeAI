export default async (owner:string , repo:string) => {
    const data =  await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    const response = data.json()

    return response
    
}