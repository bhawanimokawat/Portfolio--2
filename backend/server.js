import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { cleanMessages, askGemini } from './ai.js'
import { isOnTopic, OFF_TOPIC_REPLY } from './guard.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '10kb' }))

// 10 messages per minute per visitor
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a minute and try again.' },
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is working!' })
})

app.post('/api/chat', chatLimiter, async (req, res) => {
  const messages = cleanMessages(req.body?.messages)

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Please send a question.' })
  }

  // Off-topic: fixed reply, no AI call, no quota used
  if (!isOnTopic(messages[messages.length - 1].content)) {
    return res.json({ reply: OFF_TOPIC_REPLY })
  }
  try {
    const reply = await askGemini(messages)
    res.json({ reply })

  } catch (err) {
    console.error('Chat error:', err.message) // full detail stays in the server terminal
    const error =
      err.status === 429
        ? 'The assistant is busy right now. Please try again in a minute.'
        : 'The assistant is unavailable right now.'
    res.status(502).json({ error })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})