/* Exact rational parsing keeps decimals and repeating decimals comparable. */
(function (root) {
  'use strict';
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  function rational(n,d=1n) {
    if (d===0n) return null;
    if (d<0n) {n=-n;d=-d;}
    const g=gcd(n<0n?-n:n,d); return {n:n/g,d:d/g};
  }
  function parse(value) {
    const s=String(value).trim().replace(/−/g,'-').replace(/\s*\/\s*/g,'/').replace(',', '.');
    if (!s || s.length>80) return null;
    let m;
    if ((m=s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/))) {
      const whole=BigInt(m[1]),num=BigInt(m[2]),den=BigInt(m[3]);
      return rational(whole*den+(m[1].startsWith('-')?-num:num),den);
    }
    if ((m=s.match(/^(-?\d+)\/(\d+)$/))) return rational(BigInt(m[1]),BigInt(m[2]));
    if ((m=s.match(/^(-?)(\d*)\.(\d*)\((\d+)\)$/))) {
      const scale=10n**BigInt(m[3].length), cycle=10n**BigInt(m[4].length)-1n;
      const n=(BigInt(m[2]||'0')*scale+BigInt(m[3]||'0'))*cycle+BigInt(m[4]);
      return rational(m[1]?-n:n,scale*cycle);
    }
    if ((m=s.match(/^(-?)(\d+)(?:\.(\d+))?$/))) {
      const scale=10n**BigInt((m[3]||'').length);
      const n=BigInt(m[2])*scale+BigInt(m[3]||'0');
      return rational(m[1]?-n:n,scale);
    }
    return null;
  }
  function equal(a,b) {const x=parse(a),y=parse(b); return !!x&&!!y&&x.n===y.n&&x.d===y.d;}
  function check(value,expected,type='number') {
    const s=String(value).trim().replace(/−/g,'-').replace(/\s*\/\s*/g,'/');
    if(type==='symbol'||type==='text') return s===expected;
    if(type==='fraction'||type==='reduced') {
      const m=s.match(/^(-?\d+)\/(\d+)$/); if(!m||!equal(s,expected))return false;
      return type!=='reduced'||gcd(BigInt(m[1])<0n?-BigInt(m[1]):BigInt(m[1]),BigInt(m[2]))===1n;
    }
    if(type==='mixed') {
      const m=s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
      return !!m&&BigInt(m[2])<BigInt(m[3])&&gcd(BigInt(m[2]),BigInt(m[3]))===1n&&equal(s,expected);
    }
    if(type==='decimal'&&!/^\d+[,.]\d*(?:\(\d+\))?$/.test(s))return false;
    if(type==='integer'&&!/^\d+$/.test(s))return false;
    return equal(s,expected);
  }
  function rectangle(cells) {
    const base=[0,1,2,12,13,14];
    const all=new Set([...base,...cells]);
    if(all.size!==16||[...all].some(i=>!Number.isInteger(i)||i<0||i>=36))return false;
    const maxR=Math.max(...[...all].map(i=>Math.floor(i/12))),maxC=Math.max(...[...all].map(i=>i%12));
    return (maxR+1)*(maxC+1)===16;
  }
  function chocolate(cells) {return cells.length===24&&Array.from({length:8},(_,i)=>cells.filter(v=>v===i+1).length).every(n=>n===3);}
  const api={parse,equal,check,rectangle,chocolate};
  root.PracticeMath=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
