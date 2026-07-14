require('dotenv').config()
const key = process.env.GROQ_API_KEY

const main = async()=>{
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
      'Authorization': 'Bearer'+ " " + key
    },
    body: JSON.stringify({
      
      model: 'llama-3.1-8b-instant',
    
      messages: [{ role: 'user', content: '한컴아카데미 설명해줄래?' }]
    })
  })
  const data = await groqRes.json()
  console.log(data.choices?.[0]?.message?.content || data)
}

main()