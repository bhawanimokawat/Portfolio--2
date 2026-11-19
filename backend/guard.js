import { projects } from './data/portfolio.js'

export const OFF_TOPIC_REPLY =
  'I can only answer questions about Varsha’s projects, skills, education, experience and award. Try asking about one of those!'

const keywords = [
  'varsha', 'dabi', 'she', 'her', 'portfolio', 'project', 'skill', 'education', 'study',
  'college', 'university', 'jecrc', 'school', 'intern', 'experience', 'work', 'award',
  'certificate', 'excellence', 'aravali', 'kaushalam', 'incubation', 'futurevio', 'python',
  'c++', 'html', 'css', 'tool', 'notion', 'excel', 'powerpoint', 'contact', 'email', 'reach',
  'hire', 'location', 'jaipur', 'btech', 'degree', 'ai', 'data science', 'achievement',
  'built', 'build', 'strength', 'technolog', 'language', 'workshop', 'mentor',
]

const titles = projects.map((p) => p.title.toLowerCase()).filter((t) => t !== 'project name')

// true if the question looks related to Varsha's portfolio
export function isOnTopic(text) {
  const t = text.toLowerCase()
  if (titles.some((title) => t.includes(title))) return true
  const tokens = t.match(/[a-z0-9+#]+/g) ?? []
  return keywords.some((k) =>
    k.includes(' ')
      ? t.includes(k)
      : k.length <= 3
        ? tokens.includes(k) // short words must match exactly ("ai", "her", "she")
        : tokens.some((tok) => tok.startsWith(k))
  )
}