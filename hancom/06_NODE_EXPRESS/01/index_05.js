const express = require('express')
const app = express()

const users = [
    {id : 1, name:"KIM"},
    {id : 2, name:"LEE"},
    {id : 3, name:"CHOI"}
]

app.get('/api/users/:id',(req,res)=>{
    const user = users.find(u => u.id === Number(req.params.id))
    if(!user) return res.status(404).json({error:'없는유저'})
    res.json(user)
})

app.listen(3000,()=>console.log("http://localhost:3000/api/users/:id"))