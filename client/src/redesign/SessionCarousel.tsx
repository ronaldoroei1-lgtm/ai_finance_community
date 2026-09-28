import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import type { Lang } from './data';

export default function SessionCarousel({items,lang,onSelect}:{items:{src:string;alt:string}[];lang:Lang;onSelect:(index:number)=>void}) {
 const rail=useRef<HTMLDivElement>(null);
 const en=lang==='en';
 const featured=['tal-stage-gesture.webp','roei-workshop.webp','conference-hall.webp','team-session.webp','roei-audience.webp','hands-on-room.webp'];
 const ordered=items.map((item,index)=>({item,index})).sort((a,b)=>{const rank=(src:string)=>{const i=featured.indexOf(src.split('/').pop()??'');return i<0?featured.length:i};return rank(a.item.src)-rank(b.item.src)});
 const move=(direction:number)=>{
  const el=rail.current;if(!el)return;
  const card=el.querySelector('button');
  el.scrollBy({left:direction*((card?.getBoundingClientRect().width??300)+parseFloat(getComputedStyle(el).columnGap)),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 return <div className="af-session-carousel" role="region" aria-label={en?'Moments from our sessions':'רגעים מהמפגשים שלנו'} aria-roledescription={en?'carousel':'קרוסלה'}>
  <div className="af-carousel-toolbar"><span>{en?`${items.length} moments from the field · tap to enlarge`:`${items.length} רגעים מהשטח · לחצו להגדלה`}</span><div className="af-carousel-arrows" dir="ltr"><button type="button" onClick={()=>move(-1)} aria-label={en?'Scroll photos left':'הזזת התמונות שמאלה'} aria-controls="session-photo-rail"><ArrowLeft/></button><button type="button" onClick={()=>move(1)} aria-label={en?'Scroll photos right':'הזזת התמונות ימינה'} aria-controls="session-photo-rail"><ArrowRight/></button></div></div>
  <div className="af-session-rail" id="session-photo-rail" ref={rail} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}}} aria-label={en?'Use arrows or swipe to explore photos':'השתמשו בחצים או החליקו לצפייה בתמונות'}>{ordered.map(({item,index})=><button type="button" className="af-gallery-photo" key={item.src} onClick={()=>onSelect(index)} aria-label={`${en?'Enlarge':'הגדלה'}: ${item.alt}`}><img src={item.src} alt={item.alt} loading="lazy" decoding="async" width="640" height="480"/><span className="af-gallery-caption"><span>{item.alt}</span><Expand size={18}/></span></button>)}</div>
 </div>;
}
