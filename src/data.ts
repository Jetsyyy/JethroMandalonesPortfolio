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
  resume: 'https://drive.google.com/file/d/18i_QD-arFGC7lMZagb80krc0bJ9RE3Ya/view',
}

// Video demos hosted in Google Drive ("Portolio Websites" folder, shared as anyone-with-link).
// `driveId` is the file id from the Drive share link.
export type Demo = {
  driveId: string
  title: string
  kind: string
  platform: 'Web' | 'Mobile'
  stack: string
  role: string
  description: string
  highlights: string[]
  portrait?: boolean
}

export const demos: Demo[] = [
  {
    driveId: '1cycaufQV_DLGk7mAX20n3Yo7EbxQVnPJ',
    title: 'Genrev Systems',
    kind: 'Web-based management system',
    platform: 'Web',
    stack: 'Laravel',
    role: 'Developer',
    // TODO: confirm details for Genrev Systems
    description: 'A full web system with secure account login and role-based access, shown end to end in a recorded walkthrough.',
    highlights: ['Account login & registration', 'Role-based access', 'Responsive dashboard UI'],
  },
  {
    driveId: '1D-MwmxlJNNfi27Bv9yr7e_NNn0A979mC',
    title: 'Sandalivid',
    kind: 'Pixel-art study session app',
    platform: 'Web',
    stack: 'JavaScript',
    role: 'Developer',
    // TODO: confirm details for Sandalivid
    description: 'A cozy pixel-art study room where you set a task, pick a theme and run a focused study-session timer.',
    highlights: ['Focus session timer', 'Custom themes & colours', 'Hand-crafted pixel-art scene'],
  },
  {
    driveId: '1xKL33D-CDo3dH3Ioa4gb_cht2VFvotCh',
    title: 'Succor Haven',
    kind: 'AI tutoring mobile app',
    platform: 'Mobile',
    stack: 'Flutter',
    role: 'Developer',
    description: 'A mobile tutoring companion with separate student, teacher and admin sign-in, bilingual UI and AI-guided study help.',
    highlights: ['Student / Teacher / Admin roles', 'Email & phone OTP sign-in', 'English / 中文 interface'],
    portrait: true,
  },
]

// The sales pitch: what clients can hire you for.
export const pitch = {
  headline: 'Full-stack systems',
  headlineAccent: 'with a business analyst’s mind.',
  sub: 'I design, build and ship web apps, AI tools and analytics systems, and I make sure each one solves a real business problem.',
  buildWords: ['web apps', 'AI tools', 'dashboards', 'voice agents', 'mobile apps', 'inventory systems'],
  availability: 'Available for freelance and full-time work, for clients in the Philippines and abroad.',
}

export type Service = { key: string; title: string; tag: string; body: string; deliverables: string[] }

export const services: Service[] = [
  {
    key: 'build',
    title: 'Build',
    tag: 'Web & system development',
    body: 'Custom web applications and information systems, from database design to deployment.',
    deliverables: ['Laravel / PHP systems', 'React & Next.js front-ends', 'REST APIs & auth'],
  },
  {
    key: 'ai',
    title: 'Integrate AI',
    tag: 'AI features & voice agents',
    body: 'Practical AI inside your product: chat, speech, tutoring and automated phone agents.',
    deliverables: ['OpenAI & Azure AI', 'Retell AI voice agents', 'Prompt & flow design'],
  },
  {
    key: 'analyze',
    title: 'Analyze',
    tag: 'Dashboards & forecasting',
    body: 'Turn operational data into decisions with dashboards, reports and demand forecasting.',
    deliverables: ['Predictive analytics', 'Inventory forecasting', 'KPI dashboards'],
  },
  {
    key: 'mobile',
    title: 'Go mobile',
    tag: 'Cross-platform apps',
    body: 'Android and iOS apps from a single Flutter codebase, backed by a real API.',
    deliverables: ['Flutter + Riverpod', 'Firebase / PostgreSQL', 'Node.js backends'],
  },
  {
    key: 'design',
    title: 'Design',
    tag: 'UI prototyping & graphics',
    body: 'Clean, responsive interfaces prototyped in Figma, plus promotional graphics that match.',
    deliverables: ['Figma prototypes', 'Responsive layouts', 'Pubmats & social assets'],
  },
  {
    key: 'plan',
    title: 'Plan',
    tag: 'Systems analysis',
    body: 'Requirements gathering and process modelling, so the right system gets built.',
    deliverables: ['Requirements & scope', 'Process & data models', 'Client coordination'],
  },
]

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
  mock: 'analytics' | 'chat' | 'mobile' | 'web'
}

export const projects: Project[] = [
  {
    title: "Joshua's Meat Products Inc.",
    kind: 'Predictive Analytics & Inventory Forecasting System',
    role: 'Lead Programmer / System Analyst',
    description:
      'A web-based system that forecasts inventory demand and surfaces predictive insights so the business can plan production and cut waste.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Analytics'],
    mock: 'analytics',
    featured: true,
  },
  {
    title: 'TalkReady',
    kind: 'AI-Powered Communication & Speaking App',
    role: 'Project Lead',
    description:
      'Helps users build speaking confidence with AI-driven conversation practice, pronunciation feedback and progress tracking.',
    tech: ['React', 'Node.js', 'OpenAI', 'Azure AI', 'Firebase'],
    mock: 'chat',
    badge: 'IEEE APWiMob 2025',
    featured: true,
  },
  {
    title: 'Succor Haven',
    kind: 'AI Tutoring Mobile App',
    role: 'Developer',
    description: 'A mobile tutoring companion that gives learners personalised, AI-guided study help.',
    tech: ['Flutter', 'Riverpod', 'Node.js', 'PostgreSQL'],
    mock: 'mobile',
  },
  {
    title: 'eKalinga',
    kind: 'Mental Health Advocacy Website',
    role: 'Developer',
    description: 'A Laravel-based platform for PLSP that promotes mental health awareness and connects students to support.',
    tech: ['Laravel', 'Blade', 'MySQL'],
    mock: 'web',
  },
  {
    title: 'E-Athleta',
    kind: 'Athlete Information System',
    role: 'System Analyst',
    description: 'An information system for managing athlete records and data, from requirements analysis through system design.',
    tech: ['Systems Analysis', 'Web'],
    mock: 'web',
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
