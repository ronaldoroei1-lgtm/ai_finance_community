import { Component, type ReactNode } from 'react';
export default class ErrorBoundary extends Component<{children:ReactNode},{hasError:boolean}> {
 state={hasError:false};
 static getDerivedStateFromError(){return {hasError:true};}
 componentDidCatch(error:Error){console.error('Page render failed',error);}
 render(){if(!this.state.hasError)return this.props.children;const en=window.location.pathname.startsWith('/en');return <main dir={en?'ltr':'rtl'} style={{padding:'80px 24px',textAlign:'center',fontFamily:'Rubik,Arial,sans-serif'}}><h1>{en?'Let’s try that again':'ננסה שוב'}</h1><p>{en?'The page could not be displayed. Please reload it.':'העמוד לא נטען כראוי. אפשר לנסות לטעון אותו מחדש.'}</p><button onClick={()=>window.location.reload()}>{en?'Reload page':'טעינה מחדש'}</button><p><a href={en?'/en/':'/'}>{en?'Back to home':'חזרה לעמוד הבית'}</a></p></main>;}
}
