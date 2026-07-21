const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname))

// 조회
app.get('/api/students', async (req, res) => {
    const r = await fetch('http://192.168.10.28:5000/hancom/유민성/users', {
        headers: { 'Authorization': 'HANCOM' }
    })
    res.json(await r.json())
})

// 수정
app.put('/api/students/:id', async (req, res) => {
    const r = await fetch(`http://192.168.10.28:5000/hancom/유민성/users/${req.params.id}`, {
        method: 'PUT',
        headers: { 'Authorization': 'HANCOM', 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    })
    res.json(await r.json())
})

// 추가
app.post('/api/students', async (req, res) => {
    const r = await fetch('http://192.168.10.28:5000/hancom/유민성/users', {
        method: 'POST',
        headers: { 'Authorization': 'HANCOM', 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    })
    res.json(await r.json())
})

// 삭제
app.delete('/api/students/:id', async (req, res) => {
    const r = await fetch(`http://192.168.10.28:5000/hancom/유민성/users/${req.params.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'HANCOM' }
    })
    res.json(await r.json())
})

app.listen(3000, () => console.log('http://localhost:3000/index_10.html'))
