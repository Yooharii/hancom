const express = require('express')
const app = express()

app.use(express.json())

let users = [
    { id: 1, name: 'KIM' },
    { id: 2, name: 'LEE' },
    { id: 3, name: 'CHOI' },
    { id: 4, name: 'PARK' }
]

// 전체 조회
app.get('/api/users', (req, res) => {
    res.json(users)
})

// 단건 조회
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id))
    if (!user) return res.status(404).json({ error: '없는 유저' })
    res.json(user)
})

// 추가
app.post('/api/users', (req, res) => {
    const { name } = req.body
    const newUser = { id: Date.now(), name }
    users.push(newUser)
    res.status(201).json(newUser)
})

// 수정
app.put('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id))
    if (!user) return res.status(404).json({ error: '없는 유저' })
    user.name = req.body.name
    res.json(user)
})

// 삭제
app.delete('/api/users/:id', (req, res) => {
    users = users.filter(u => u.id !== Number(req.params.id))
    res.json({ ok: true })
})

app.listen(3000, () => console.log('http://localhost:3000'))
