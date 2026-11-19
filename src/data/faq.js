// Locked answers. Shown instantly, no request is sent.
// `keywords`: if a typed question contains any of them, this answer is used.
// `chip`: true = also shown as a button in the chat.
export const faqs = [
  {
    id: 'futurevio',
    question: 'What is FUTUREVIO PRO?',
    chip: false,
    keywords: ['futurevio'],
    answer:
      'FUTUREVIO PRO is an AI-powered platform built to modernize school curricula and improve learning outcomes. It has a responsive, modular UI, smart curriculum recommendations, comparison dashboards, and real-time collaboration for schools, boards and incubation centers. It won 1st position at the Aravali Incubation Program.',
  },
  {
    id: 'projects',
    question: 'What projects has Varsha built?',
    chip: true,
    keywords: ['project', 'built', 'portfolio work'],
    answer:
      'Varsha’s main project is FUTUREVIO PRO, an AI-powered platform for modernizing school curricula. You can see the latest projects in the Projects section above.',
  },
  {
    id: 'skills',
    question: 'What are her main skills?',
    chip: true,
    keywords: ['skill', 'technolog', 'tech stack', 'know', 'language'],
    answer:
      'Programming: Python, C and C++. Web: HTML5 and CSS3. AI tools: ChatGPT, Gemini, Claude, Grok and Copilot. Workflow tools: Google Sites, Notion, MS Word, Excel and PowerPoint. She also works on organization, time management, teamwork and problem-solving.',
  },
  {
    id: 'internship',
    question: 'Tell me about her internship',
    chip: true,
    keywords: ['intern', 'kaushalam', 'experience'],
    answer:
      'Varsha interned at Kaushalam Foundation (Internship Camp Incubation Center, Jaipur) from Jun to Jul 2025. She worked on coding assignments and project management, explored smart curriculum tools and dashboards, joined startup and pitching workshops, and prototyped a tech solution with a cross-functional team under industry mentors.',
  },
  {
    id: 'award',
    question: 'What award has she won?',
    chip: true,
    keywords: ['award', 'certificate', 'won', 'achievement', 'aravali'],
    answer:
      'Varsha received a Certificate of Excellence for securing 1st position at the Aravali Incubation Program, organized by Kaushalam Foundation at Mahindra World City, Jaipur, for her project FUTUREVIO PRO.',
  },
  {
    id: 'education',
    question: 'Where does she study?',
    chip: false,
    keywords: ['study', 'college', 'university', 'education', 'degree', 'jecrc', 'school'],
    answer:
      'Varsha is pursuing a B.Tech in Computer Science (Artificial Intelligence & Data Science) at JECRC University, Jaipur, from Aug 2025 to 2029. She completed Higher Secondary (Physics, Chemistry & Mathematics) at Rawat Public School, Jaipur, in 2024.',
  },
  {
    id: 'contact',
    question: 'How can I contact her?',
    chip: false,
    keywords: ['contact', 'email', 'reach', 'hire', 'collaborat'],
    answer: 'You can email Varsha at varshadabi1121@gmail.com, or use the contact section on this page.',
  },
]

// Returns the best matching FAQ for a typed question, or null.
export function findFaq(text) {
  const t = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const faq of faqs) {
    const score = faq.keywords.filter((k) => t.includes(k)).length
    if (score > bestScore) {
      best = faq
      bestScore = score
    }
  }
  return best
}