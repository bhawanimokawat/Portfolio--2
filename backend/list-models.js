import 'dotenv/config'

const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100', {
  headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
})

if (!r.ok) {
  console.log('Error', r.status, await r.text())
} else {
  const { models } = await r.json()
  models
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .forEach((m) => console.log(m.name.replace('models/', '')))
}