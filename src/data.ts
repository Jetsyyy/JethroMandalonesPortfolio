// All portfolio content lives here — edit this file to update the site.

export const profile = {
  name: 'Jethro Katigbak Mandalones',
  shortName: 'Jethro',
  initials: 'JM',
  roles: ['Full-Stack Developer', 'Software Engineer', 'Business Analyst'],
  tagline:
    'Information Systems graduate building AI-integrated software that solves real business problems, from predictive analytics to mobile apps.',
  location: 'San Pablo City, Laguna, Philippines',
  // TODO: replace with your real links
  email: 'your.email@example.com',
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-profile',
  resume: '#', // e.g. '/resume.pdf' after adding it to /public
}

export const about = {
  paragraphs: [
    "I'm an Information Systems graduate majoring in Business Analytics at Pamantasan ng Lungsod ng San Pablo. I work at the point where software engineering meets business needs: I understand how a system is built and why an organization needs it.",
    'My work spans full-stack web development, AI integration, mobile apps, and data-driven decision support. I enjoy turning messy real-world processes into clean, reliable systems, and leading the teams that build them.',
  ],
  focus: ['Software Development', 'Business Analytics', 'AI Integration', 'System Development'],
  stats: [
    { value: '6+', label: 'Systems built' },
    { value: '300+', label: 'Students led' },
    { value: '1', label: 'IEEE paper' },
  ],
}

export const education = {
  school: 'Pamantasan ng Lungsod ng San Pablo (PLSP)',
  degree: 'BS Information Systems',
  major: 'Major in Business Analytics',
  years: '2022 – 2026',
  honors: ["Top 6 Dean's Lister", 'Leadership Award', 'Service Award', 'Loyalty Award – Gawad Hiraya'],
}

export const qualifications = [
  {
    title: 'Full-Stack Development',
    body: 'End-to-end web systems with Laravel, Node.js and React, from database schema to deployed UI.',
  },
  {
    title: 'AI Integration',
    body: 'Shipping production features on OpenAI and Azure AI, including speech, tutoring and conversational tools.',
  },
  {
    title: 'Business Analytics',
    body: 'Predictive analytics and inventory forecasting that turn operational data into decisions.',
  },
  {
    title: 'Systems Analysis',
    body: 'Requirements gathering, process modelling and system design as a lead programmer and system analyst.',
  },
  {
    title: 'Research & Publication',
    body: 'Co-authored an IEEE APWiMob 2025 paper on the TalkReady AI communication app.',
  },
  {
    title: 'Leadership',
    body: 'Vice President of the PLSP IS Club, coordinating faculty and 300+ IS students.',
  },
]

export const techStack = [
  { group: 'Backend', items: ['PHP', 'Laravel', 'Node.js'] },
  { group: 'Frontend', items: ['React', 'JavaScript', 'Blade', 'Tailwind CSS'] },
  { group: 'Database', items: ['MySQL', 'PostgreSQL', 'Firebase'] },
  { group: 'AI Integration', items: ['OpenAI API', 'Azure AI'] },
  { group: 'Mobile', items: ['Flutter'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Figma'] },
]

export type Project = {
  title: string
  kind: string
  role: string
  description: string
  tech: string[]
  badge?: string
  featured?: boolean
  link?: string
}

export const projects: Project[] = [
  {
    title: "Joshua's Meat Products Inc.",
    kind: 'Predictive Analytics & Inventory Forecasting System',
    role: 'Lead Programmer / System Analyst',
    description:
      'A web-based system that forecasts inventory demand and surfaces predictive insights so the business can plan production and cut waste.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Analytics'],
    featured: true,
  },
  {
    title: 'TalkReady',
    kind: 'AI-Powered Communication & Speaking App',
    role: 'Project Lead',
    description:
      'Helps users build speaking confidence with AI-driven conversation practice, pronunciation feedback and progress tracking.',
    tech: ['React', 'Node.js', 'OpenAI', 'Azure AI', 'Firebase'],
    badge: 'IEEE APWiMob 2025',
    featured: true,
  },
  {
    title: 'Succor Haven',
    kind: 'AI Tutoring Mobile App',
    role: 'Developer',
    description: 'A mobile tutoring companion that gives learners personalised, AI-guided study help.',
    tech: ['Flutter', 'Riverpod', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'eKalinga',
    kind: 'Mental Health Advocacy Website',
    role: 'Developer',
    description: 'A Laravel-based platform for PLSP that promotes mental health awareness and connects students to support.',
    tech: ['Laravel', 'Blade', 'MySQL'],
  },
  {
    title: 'E-Athleta',
    kind: 'Athlete Information System',
    role: 'System Analyst',
    description: 'An information system for managing athlete records and data, from requirements analysis through system design.',
    tech: ['Systems Analysis', 'Web'],
  },
]

export const experience = [
  {
    role: 'OJT – Web Developer & Researcher',
    org: "Alexa's Engineering Services",
    period: 'OJT',
    points: [
      'Developed the company website and prototyped its UI in Figma.',
      'Integrated Gmail-based OTP verification for secure sign-in.',
      'Ran research to shape the site around business needs.',
    ],
  },
  {
    role: 'Lead Programmer / System Analyst',
    org: "Capstone – Joshua's Meat Products Inc.",
    period: '2025 – 2026',
    points: [
      'Led development of a predictive analytics and inventory forecasting system.',
      'Gathered requirements directly with the client and translated them into system design.',
    ],
  },
]

export const leadership = [
  { role: 'Vice President', org: 'PLSP Information Systems Club', period: 'SY 2025–2026', highlight: true },
  { role: 'Third Year Representative', org: 'IS Club' },
  { role: 'First & Second Year Representative', org: 'ALIW Organization' },
  { role: 'Lead Graphic Designer', org: 'PubMat Team' },
  { role: 'Department Representative', org: 'CCST' },
]

export const leadershipSummary =
  'Coordinated between faculty and students and led initiatives reaching 300+ Information Systems students.'
