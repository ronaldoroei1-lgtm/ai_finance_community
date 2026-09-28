import React,{useEffect,useRef,useState} from 'react';
import type {Lang} from './data';
const steps=[{id:'main',he:'ההתחלה',en:'Start'},{id:'experience',he:'בשטח',en:'In practice'},{id:'services',he:'האפשרויות',en:'Explore'},{id:'team',he:'האנשים',en:'People'},{id:'community',he:'הקהילה',en:'Community'}];
export default function Journey({lang}:{lang:Lang}){
 const ref=useRef<HTMLDivElement>(null);const [active,setActive]=useState(0);
 useEffect(()=>{let frame=0;const update=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight;ref.current?.style.setProperty('--journey-progress',String(max>0?Math.min(1,scrollY/max):0));let next=0;steps.forEach((step,i)=>{const el=document.getElementById(step.id);if(el&&el.getBoundingClientRect().top<innerHeight*.45)next=i});setActive(next)};const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)}},[]);
 return <div className="af-journey" ref={ref}><div className="af-reading-line" aria-hidden="true"/><nav className="af-journey-nav" aria-label={lang==='he'?'הדרך באתר':'Your journey'}>{steps.map((step,i)=><a key={step.id} href={'#'+step.id} aria-current={active===i?'location':undefined}><i aria-hidden="true"/><span>{step[lang]}</span></a>)}</nav></div>
}
