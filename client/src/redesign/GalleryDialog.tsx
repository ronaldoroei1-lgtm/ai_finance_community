import React,{useEffect,useRef} from 'react';
import {X,ArrowLeft,ArrowRight} from 'lucide-react';
import type {Lang} from './data';
export default function GalleryDialog({items,index,onChange,onClose,lang}:{items:{src:string;alt:string}[];index:number;onChange:(n:number)=>void;onClose:()=>void;lang:Lang}){
 const ref=useRef<HTMLDialogElement>(null);const en=lang==='en';const item=items[index];
 useEffect(()=>{const el=ref.current;if(!el)return;const prev=document.activeElement as HTMLElement;el.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;el.close();prev?.focus()}},[]);
 if(!item)return null;
 return <dialog ref={ref} className="af-lightbox" aria-label={item.alt} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();onChange((index+1)%items.length)}if(e.key==='ArrowLeft'){e.preventDefault();onChange((index+items.length-1)%items.length)}}}><button className="af-dialog-close" autoFocus onClick={onClose} aria-label={en?'Close':'סגירה'}><X/></button><img src={item.src} alt={item.alt}/><div className="af-lightbox-controls"><button aria-label={en?'Previous image':'התמונה הקודמת'} onClick={()=>onChange((index+items.length-1)%items.length)}>{en?<ArrowLeft/>:<ArrowRight/>}</button><p aria-live="polite">{item.alt} · {index+1}/{items.length}</p><button aria-label={en?'Next image':'התמונה הבאה'} onClick={()=>onChange((index+1)%items.length)}>{en?<ArrowRight/>:<ArrowLeft/>}</button></div></dialog>
}
