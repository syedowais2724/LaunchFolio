export type TemplateId = 'editorial' | 'devfolio' | 'orbit' | 'vcard' | 'nextmotion' | 'craft'
export type Experience = { id: string; company: string; role: string; period: string; description: string }
export type Project = { id: string; title: string; description: string; tags: string; url: string; image: string }
export type Education = { id: string; school: string; degree: string; period: string }
export type Portfolio = {
  name: string; title: string; location: string; email: string; bio: string;
  github: string; linkedin: string; website: string; photo: string;
  skills: string; experience: Experience[]; projects: Project[]; education: Education[];
  available: boolean; template: TemplateId; accent: string;
}
export const templateList: { id: TemplateId; name: string; label: string; description: string; source: string }[] = [
  { id: 'editorial', name: 'Aitezaz', label: 'BOLD & EXPRESSIVE', description: 'The design behind your portfolio: a cream opening, oversized type, italic name and dark sections.', source: 'Aitezaz’s MIT portfolio, adapted from the portfolio-v2 design' },
  { id: 'devfolio', name: 'Shubh Devfolio', label: 'CLEAN & CONFIDENT', description: 'Shubh’s black-and-violet developer style, signature name underline and clear project cards.', source: 'Shubh Porwal’s MIT Devfolio, adapted for editable content' },
  { id: 'orbit', name: 'Orbit 3D', label: 'IMMERSIVE & PLAYFUL', description: 'An original take on the floating-laptop concept, with 3D motion and cosmic colours.', source: 'Original LaunchFolio CSS 3D; no Jonathan Jesni code or assets' },
  { id: 'vcard', name: 'vCard', label: 'CHARCOAL & AMBER', description: 'A fixed profile sidebar, amber highlights and working About, Resume, Projects and Contact tabs.', source: 'codewithsadee’s MIT vCard, adapted to your portfolio content' },
  { id: 'nextmotion', name: 'nextMotion', label: 'ANIMATED & MODERN', description: 'A dot-grid introduction, animated profile card and a bold project grid.', source: 'Jacob Pixler’s MIT nextMotion, adapted for standalone export' },
  { id: 'craft', name: 'Craft', label: 'PERSONAL & PLAYFUL', description: 'A warm, compact homepage with theme switching and an original interactive 3D scene.', source: 'Takuya Matsuyama’s homepage, with attribution; original 3D artwork' },
]
export const templateAccents: Record<TemplateId,string> = { editorial:'#6ee7b7',devfolio:'#9f55ff',orbit:'#f0abfc',vcard:'#ffdb70',nextmotion:'#93c5fd',craft:'#319795' }
export function migrateTemplate(value:unknown):unknown{
  if(value&&typeof value==='object'&&'template' in value&&['brittany','ryan','simplefolio','cv'].includes(String(value.template)))return {...value,template:'editorial'}
  return value
}
export const emptyPortfolio: Portfolio = {
  name: '', title: '', location: '', email: '', bio: '', github: '', linkedin: '', website: '', photo: '',
  skills: '', experience: [], projects: [], education: [], available: true, template: 'editorial', accent: '#6ee7b7',
}
export const samplePortfolio: Portfolio = {
  name: 'Alex Morgan', title: 'Creative developer', location: 'Bengaluru, India', email: 'alex@example.com',
  bio: 'I turn thoughtful ideas into useful digital experiences. A developer with a soft spot for good design, small details, and making complicated things feel simple.',
  github: 'https://github.com', linkedin: 'https://linkedin.com', website: '', photo: '',
  skills: 'React, TypeScript, Python, Next.js, Figma, PostgreSQL', available: true, template: 'editorial', accent: '#6ee7b7',
  experience: [{id:'ex-1',company:'Studio North',role:'Frontend developer',period:'2025 — Present',description:'Building accessible web experiences and bringing design systems to life.'}],
  projects: [
    {id:'pr-1',title:'Daylight',description:'A calmer space to plan your day. Thoughtful task management for people, not productivity robots.',tags:'React, TypeScript',url:'',image:''},
    {id:'pr-2',title:'Goodspace',description:'Connecting local communities through shared spaces and better conversations.',tags:'Next.js, PostgreSQL',url:'',image:''},
  ],
  education: [{id:'ed-1',school:'University of Design & Technology',degree:'B.Tech in Computer Science',period:'2021 — 2025'}],
}
