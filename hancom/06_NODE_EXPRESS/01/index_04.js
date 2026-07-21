const express = require('express')
const app = express()

//3.규칙
app.get('/',(req,res) =>{
    res.send('서버 실행 중')
})

app.get('/api/users',(req,res) =>{
    res.json([
        {id:1, name: "KIM"},
        {id:2, name: "LEE"}
    ])
})

app.listen(3000,()=>console.log('http://localhost:3000'))