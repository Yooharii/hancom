const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => res.send('서버 실행 중'))

app.post('/api/chat', (req, res) => {
  const { message } = req.body          // 받기 — 보내온 문장 꺼냄
  console.log('받은 메시지:', message)        // 서버 터미널에 찍힘
  res.json({ ok: true, 받은문장: message })   // 답장 — '잘 받았다' 확인(영수증)
})

app.listen(3000, () => console.log('http://localhost:3000'))