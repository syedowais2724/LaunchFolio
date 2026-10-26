import type { Portfolio, Experience, Project, Education } from '../types'

const headers: Record<string, string> = {
  'summary':'bio','profile':'bio','professional summary':'bio','about me':'bio','objective':'bio',
  'experience':'experience','work experience':'experience','professional experience':'experience','employment':'experience','internships':'experience',
  'projects':'projects','personal projects':'projects','academic projects':'projects','selected projects':'projects',
  'skills':'skills','technical skills':'skills','technologies':'skills','education':'education',
  'certifications':'other','achievements':'other','interests':'other','languages':'other',
}
const compactHeaders=Object.fromEntries(Object.entries(headers).map(([key,value])=>[key.replace(/\s/g,''),value]))
const dateRange=/(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?(?:19|20)\d{2}\s*(?:[-–—]|to)\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?(?:(?:19|20)\d{2}|present|current|now)/i
const clean=(s:string)=>s.replace(/^\s*[•◦▪●·*]\s*/,'').replace(/^\s*\|\s*/,'').replace(/\s*\|\s*$/,'').trim()
const withoutLinks=(s:string)=>s.replace(/\[?https?:\/\/[^\s\]]+\]?/g,'').replace(/\s*\|\s*$/,'').trim()
const primaryBullet=(s:string)=>/^[•▪●]\s*/.test(s)
function blocks(lines:string[],kind:'experience'|'projects'|'education'):string[][]{
  const result:string[][]=[];let current:string[]=[]
  const hasPrimary=lines.some(primaryBullet)
  for(let i=0;i<lines.length;i++){
    const line=lines[i]
    const start=hasPrimary?primaryBullet(line):kind==='projects'
      ?i===0||(!/^[◦·*-]/.test(line)&&line.length<100&&/^(tools|tech(?:nologies)?|stack)\s*:/i.test(lines[i+1]||''))
      :i===0||Boolean(line.match(dateRange)&&clean(line).replace(dateRange,'').length>2&&!/^[◦·*-]/.test(line))
    if(start&&current.length){result.push(current);current=[]}current.push(line)
  }
  if(current.length)result.push(current)
  return result
}
export function parseResume(text: string): Partial<Portfolio> {
  const lines=text.split(/\r?\n/).map(s=>s.replace(/[\t ]+/g,' ').trim()).filter(Boolean)
  const groups:Record<string,string[]>={};let section='header'
  for(const line of lines){const key=line.toLowerCase().replace(/[^a-z]/g,'');if(compactHeaders[key]){section=compactHeaders[key];continue}(groups[section]??=[]).push(line)}
  // A fresh import must not inherit demo projects or details from the previous person.
  const result:Partial<Portfolio>={name:'',title:'',location:'',email:'',bio:'',skills:'',github:'',linkedin:'',website:'',photo:'',experience:[],projects:[],education:[]}
  const header=groups.header||[]
  const email=text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]
  if(email)result.email=email
  const name=header.slice(0,6).map(withoutLinks).find(l=>/^[\p{L} .'-]{3,65}$/u.test(l)&&l.split(/\s+/).length<=6&&!/resume|curriculum|engineer|developer|designer|portfolio/i.test(l))
  if(name)result.name=name===name.toUpperCase()?name.toLowerCase().replace(/\b\p{L}/gu,m=>m.toUpperCase()):name
  const role=header.find(l=>/engineer|developer|designer|analyst|student|researcher|manager/i.test(l)&&l.length<100&&!/@|https?:/i.test(l))
  if(role)result.title=clean(role.split('|')[0])
  const profileText=header.join('\n')
  const urls=profileText.match(/(?:https?:\/\/)?(?:www\.)?(?:github\.com|linkedin\.com\/in)\/[\w./-]+/gi)||[]
  for(const url of urls){const full=/^https?:/i.test(url)?url:`https://${url}`;if(/github\.com\/[\w-]+\/?$/i.test(url))result.github=full;else if(/linkedin/i.test(url))result.linkedin=full}
  const personalSite=(profileText.match(/https?:\/\/[^\s\]|]+/gi)||[]).find(u=>!/github\.com|linkedin\.com/i.test(u))
  if(personalSite)result.website=personalSite
  if(groups.bio?.length)result.bio=groups.bio.map(withoutLinks).join(' ')
  if(groups.skills?.length)result.skills=groups.skills.map(l=>clean(l).replace(/^[^:]{1,35}:\s*/,'' )).join(', ')
  if(groups.experience?.length)result.experience=blocks(groups.experience,'experience').map(rows=>{
    const heading=withoutLinks(clean(rows[0])),date=heading.match(dateRange)?.[0]||'',company=clean(heading.replace(date,''))
    const second=rows[1]||'',isRole=!/^[◦·*-]/.test(second)&&second.length<130&&!/[.!?]$/.test(second)
    const roleLine=isRole?clean(second.split('|')[0]).replace(/\s+(?:India|Remote|Hybrid)$/i,''):''
    const entry:Experience={id:crypto.randomUUID(),company,role:roleLine,period:date,description:rows.slice(isRole?2:1).map(l=>clean(withoutLinks(l))).join('\n')};return entry
  })
  if(!result.title&&result.experience?.[0]?.role)result.title=result.experience[0].role
  if(groups.projects?.length)result.projects=blocks(groups.projects,'projects').map(rows=>{
    const tools=rows.find(l=>/^(tools|tech(?:nologies)?|stack)\s*:/i.test(clean(l)))
    const link=rows.join(' ').match(/https?:\/\/[^\s\]]+/)?.[0]||''
    const p:Project={id:crypto.randomUUID(),title:withoutLinks(clean(rows[0])),description:rows.slice(1).filter(l=>l!==tools).map(l=>clean(withoutLinks(l))).filter(Boolean).join('\n'),tags:tools?clean(tools).replace(/^[^:]+:\s*/,''):'',url:link,image:''};return p
  })
  if(groups.education?.length)result.education=blocks(groups.education,'education').map(rows=>{
    const heading=clean(rows[0]),date=heading.match(dateRange)?.[0]||''
    const e:Education={id:crypto.randomUUID(),school:clean(heading.replace(date,'')),degree:rows.slice(1).map(l=>clean(l.split('|')[0])).join(' · '),period:date};return e
  })
  return result
}

export async function extractPdf(file: File): Promise<string> {
  if(file.size>10*1024*1024)throw new Error('Please choose a PDF smaller than 10 MB.')
  const {getDocument,GlobalWorkerOptions}=await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).href
  const task=getDocument({data:new Uint8Array(await file.arrayBuffer())})
  try{
    const pdf=await task.promise
    if(pdf.numPages>15)throw new Error('Please use a resume with 15 pages or fewer.')
    const pages:string[]=[]
    for(let n=1;n<=pdf.numPages;n++){
      const page=await pdf.getPage(n), content=await page.getTextContent()
      const rows:{y:number;items:{x:number;width:number;text:string}[];urls:string[]}[]=[]
      for(const item of content.items){if(!('str'in item)||!item.str.trim())continue;const y=item.transform[5];let row=rows.find(r=>Math.abs(r.y-y)<3);if(!row){row={y,items:[],urls:[]};rows.push(row)}row.items.push({x:item.transform[4],width:item.width,text:item.str})}
      rows.sort((a,b)=>b.y-a.y)
      for(const annotation of await page.getAnnotations()){
        if(annotation.subtype!=='Link'||typeof annotation.url!=='string'||!Array.isArray(annotation.rect))continue
        const y=(annotation.rect[1]+annotation.rect[3])/2
        const nearest=rows.reduce<typeof rows[number]|undefined>((best,row)=>!best||Math.abs(row.y-y)<Math.abs(best.y-y)?row:best,undefined)
        if(nearest&&Math.abs(nearest.y-y)<18&&!nearest.urls.includes(annotation.url))nearest.urls.push(annotation.url)
      }
      const lines=rows.map(row=>{row.items.sort((a,b)=>a.x-b.x);let end=0,line='';for(const item of row.items){const gap=item.x-end;line+=(line?(gap>22?' | ':' '):'')+item.text;end=item.x+item.width}return line+(row.urls.length?' '+row.urls.map(url=>`[${url}]`).join(' '):'')})
      pages.push(lines.join('\n'))
    }
    const text=pages.join('\n')
    if(text.replace(/\s/g,'').length<35)throw new Error('This looks like a scanned PDF. Text recognition is not included yet. Paste your resume text or enter your details instead.')
    return text
  }finally{await task.destroy()}
}
