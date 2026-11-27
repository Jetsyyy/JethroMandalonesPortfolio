// All portfolio content lives here — edit this file to update the site.

export const profile = {
  name: 'Jethro Katigbak Mandalones',
  shortName: 'Jethro',
  initials: 'JM',
  roles: ['Full-Stack Developer', 'AI Integration Developer', 'Software Engineer'],
  tagline:
    'Information Systems graduate building AI-integrated software that solves real business problems, from predictive analytics to mobile apps.',
  location: 'San Pablo City, Laguna, Philippines',
  // TODO: replace with your real links
  email: 'your.email@example.com',
  github: 'https://github.com/Jetsyyy',
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
    { value: '3', label: 'Industry roles' },
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
  { group: 'Frontend', items: ['React', 'Next.js', 'JavaScript', 'Blade', 'Tailwind CSS'] },
  { group: 'Database', items: ['MySQL', 'PostgreSQL', 'Firebase', 'Supabase'] },
  { group: 'AI Integration', items: ['OpenAI API', 'Azure AI', 'Retell AI'] },
  { group: 'Mobile', items: ['Flutter'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Figma', 'Vercel'] },
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

export type Job = {
  role: string
  org: string
  type: string
  location?: string
  period: string
  points: string[]
  tech?: string[]
}

// Kept as separate entries on purpose: short-term engagement, freelance and OJT.
export const experience: Job[] = [
  {
    role: 'Developer',
    org: "Gallagher's Resource LLC",
    type: 'Short-term engagement',
    period: 'Sep – Oct 2026',
    points: [
      'Worked on AI-powered voice agent development using Retell AI.',
      'Configured and tested voice agent prompts and call flows.',
      'Assisted with voice-agent behavior, background audio, and sound-related requirements.',
      'Collaborated on development tasks involving React, Next.js, Vercel, and Supabase.',
      'Participated in testing and troubleshooting AI voice-agent functionality.',
    ],
    tech: ['Retell AI', 'React', 'Next.js', 'Supabase', 'Vercel'],
  },
  {
    role: 'Freelance Web Designer & Laravel Developer',
    org: 'Freelance',
    type: 'Freelance',
    location: 'Remote / San Pablo City, Laguna',
    period: '2026',
    points: [
      'Designed and developed web-based applications using Laravel and PHP.',
      'Created responsive website interfaces and user-friendly layouts.',
      'Worked with database integration and backend functionality.',
      'Handled freelance development projects and client requirements.',
    ],
    tech: ['Laravel', 'PHP', 'MySQL'],
  },
  {
    role: 'Web Development / Research Development Intern',
    org: "Alexa's Engineering Services",
    type: 'Internship · 486 OJT hours',
    location: 'Calauan, Laguna',
    period: 'Feb – May 2026',
    points: [
      'Participated in research and web development initiatives.',
      'Led website development tasks alongside a fellow developer.',
      'Worked on UI prototyping and website interface improvements.',
      'Assisted with Gmail OTP integration and contact hub functionality.',
      'Created promotional materials and supported social media management.',
    ],
    tech: ['Web Development', 'UI Prototyping', 'Gmail OTP'],
  },
]

export const leadership = [
  { role: 'Vice President', org: 'PLSP Information Systems Club', period: 'SY 2025–2026', highlight: true },
  { role: 'Third Year Representative', org: 'IS Club' },
  { role: 'First & Second Year Representative', org: 'ALIW Organization' },
  { role: 'PubMat Member / Lead Graphic Designer', org: 'IS Club' },
  { role: 'Department Representative', org: 'CCST' },
]

export const leadershipSummary =
  'Coordinated between faculty and students and led initiatives reaching 300+ Information Systems students.'
