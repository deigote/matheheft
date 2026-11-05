(() => {
  'use strict';
  const STORAGE_KEY='mi-cuaderno:repaso-matematicas-6:2026-11-05:v1';
  const sheetId='repaso-6';
  const titles=['Brüche vergleichen und ordnen','Kürzen und Erweitern','Anteile berechnen','Dezimalzahlen auf der Zahlengeraden','Bruch und Dezimalzahl','Dezimalzahlen vergleichen und ordnen','Brüche in Dezimalzahlen umwandeln'];
  const shortTitles=['Brüche vergleichen','Kürzen und Erweitern','Anteile berechnen','Zahlengeraden','Brüche und Dezimalzahlen','Dezimalzahlen vergleichen','Division und Perioden'];
  const defaults=()=>({answers:{},notes:{},rectangle:[],rectangleDone:false,chocolate:Array(24).fill(0),lastSection:1});
  let state=defaults(), storageOK=true, result=null, activeSection=1, chosenFriend=1, lineChoices={a:0,b:0};
  const fields=[];
  let sectionResults={};
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fraction=s=>{const [n,d]=s.split('/');return `<span class="fraction" aria-label="${n} durch ${d}"><span>${n}</span><span>${d}</span></span>`;};
  const display=s=>String(s).includes('/')?fraction(s):escape(s);
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved&&typeof saved==='object') {
      state={...defaults(),...saved};
      state.answers=Object.fromEntries(Object.entries(saved.answers||{}).filter(([,v])=>typeof v==='string'&&v.length<=100));
      state.notes=Object.fromEntries(Object.entries(saved.notes||{}).filter(([,v])=>typeof v==='string'));
      state.rectangle=Array.isArray(saved.rectangle)?[...new Set(saved.rectangle.filter(n=>Number.isInteger(n)&&n>=0&&n<36&&!([0,1,2,12,13,14].includes(n))))]:[];
      state.rectangleDone=saved.rectangleDone===true;
      state.chocolate=Array.from({length:24},(_,i)=>Number.isInteger(saved.chocolate?.[i])&&saved.chocolate[i]>=0&&saved.chocolate[i]<=8?saved.chocolate[i]:0);
      state.lastSection=Number.isInteger(saved.lastSection)&&saved.lastSection>=1&&saved.lastSection<=7?saved.lastSection:1;
    }
  } catch {storageOK=false;}
  function save() {
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageOK=true;} catch {storageOK=false;}
    updateSaveStatus();
  }
  function updateSaveStatus() {
    const e=document.getElementById('save-status');
    e.classList.toggle('save-warning',!storageOK);
    e.innerHTML=storageOK?'<span aria-hidden="true">●</span> In diesem Browser gespeichert':'Speichern nicht möglich. Lass diesen Tab geöffnet.';
  }
  function input(id,answer,type='number',label='',unit='') {
    const section=Number(id[0]);fields.push({id,answer,type,section});
    const inputmode=['integer','number'].includes(type)?'decimal':'text';
    const control=type==='symbol'?`<select id="${id}" data-answer="${id}" aria-label="${escape(label)}"><option value="">?</option>${['<','>','='].map(v=>`<option value="${escape(v)}" ${state.answers[id]===v?'selected':''}>${escape(v)}</option>`).join('')}</select>`:
      `<input id="${id}" data-answer="${id}" type="text" inputmode="${inputmode}" autocomplete="off" spellcheck="false" maxlength="80" aria-label="${escape(label)}" aria-describedby="feedback-${id}" value="${escape(state.answers[id]||'')}" placeholder="${type==='fraction'||type==='reduced'?'a/b':type==='mixed'?'a b/c':'…'}">`;
    return `<span class="answer-wrap ${type==='symbol'?'symbol':''}" data-wrap="${id}">${control}${unit?`<span class="unit">${unit}</span>`:''}<span class="field-feedback" id="feedback-${id}"></span></span>`;
  }
  function selectType(id,answer,label) {
    fields.push({id,answer,type:'text',section:7});
    return `<span class="answer-wrap wide" data-wrap="${id}"><select id="${id}" data-answer="${id}" aria-label="${label}" aria-describedby="feedback-${id}"><option value="">Art auswählen…</option>${['abbrechend','reinperiodisch','gemischtperiodisch'].map(v=>`<option ${state.answers[id]===v?'selected':''}>${v}</option>`).join('')}</select><span class="field-feedback" id="feedback-${id}"></span></span>`;
  }
  const task=(label,title,content,hint='')=>`<article class="task"><div class="task-title"><span class="task-letter">${label}</span><h3 lang="de">${title}</h3></div>${hint?`<p class="hint" lang="de">${hint}</p>`:''}${content}</article>`;
  const rows=(items)=>`<div class="exercise-grid">${items.join('')}</div>`;
  const row=(n,content)=>`<div class="exercise-row"><span class="row-number">${n})</span>${content}</div>`;
  function order(prefix,values,answers,type) {
    return `<div class="order-exercise"><p class="given-values" lang="de">${values.map(display).join('<span class="dot-separator">·</span>')}</p><div class="order-inputs">${answers.map((a,i)=>(i?'<span class="less-sign">&lt;</span>':'')+input(`${prefix}-${i}`,a,type,`${prefix}: Position ${i+1}, aufsteigend`)).join('')}</div></div>`;
  }
  function renderContent() {
    fields.length=0;
    const sections=[];
    const compares=[['4/7','5/7','<'],['3/5','9/15','='],['5/8','2/3','<'],['7/9','3/4','>'],['5/6','8/10','>'],['3/10','1/3','<'],['7/12','2/3','<'],['4/9','8/18','=']];
    sections.push(task('a','Setze jeweils das richtige Zeichen <, > oder = ein.',rows(compares.map(([a,b,c],i)=>row(i+1,`${fraction(a)}${input(`1a-${i}`,c,'symbol',`1a, ${i+1}: ${a} verglichen mit ${b}`)}${fraction(b)}`))))+
      task('b','Ordne die Brüche vom kleinsten zum größten.',order('1b-1',['3/8','5/6','2/3','7/12'],['3/8','7/12','2/3','5/6'],'fraction')+order('1b-2',['4/5','7/10','3/4','5/8'],['5/8','7/10','3/4','4/5'],'fraction'),'Tipp: Bringe die Brüche auf einen gemeinsamen Nenner.'));
    sections.push(task('a','Ergänze den fehlenden Zähler oder Nenner und notiere den Faktor.',rows([
      row(1,`${fraction('5/8')} = <span class="fraction editable">${input('2a-1','25','integer','2a, 1: Zähler')}<span>40</span></span><span class="factor">× ${input('2a-1f','5','integer','2a, 1: Multiplikationsfaktor')}</span>`),
      row(2,`${fraction('7/12')} = <span class="fraction editable"><span>42</span>${input('2a-2','72','integer','2a, 2: Nenner')}</span><span class="factor">× ${input('2a-2f','6','integer','2a, 2: Multiplikationsfaktor')}</span>`),
      row(3,`${fraction('36/60')} = <span class="fraction editable"><span>3</span>${input('2a-3','5','integer','2a, 3: Nenner')}</span><span class="factor">÷ ${input('2a-3f','12','integer','2a, 3: Divisor')}</span>`),
      row(4,`${fraction('63/84')} = <span class="fraction editable">${input('2a-4','3','integer','2a, 4: Zähler')}<span>4</span></span><span class="factor">÷ ${input('2a-4f','21','integer','2a, 4: Divisor')}</span>`)
    ]))+
    task('b','Kürze vollständig und schreibe als gemischte Zahl.',rows([['70/24','35/12','2 11/12'],['126/45','14/5','2 4/5'],['154/66','7/3','2 1/3']].map(([q,a,b],i)=>row(i+1,`${fraction(q)} = ${input(`2b-${i}r`,a,'reduced',`2b, ${i+1}: vollständig gekürzter Bruch`)} = ${input(`2b-${i}m`,b,'mixed',`2b, ${i+1}: gemischte Zahl`)}`))),'Schreibweise: Bruch als a/b, gemischte Zahl als a b/c (z. B. 1 2/3).')+
    task('c','Erweitere auf den angegebenen Nenner.',rows([['9/20','45','100'],['13/25','52','100'],['7/8','875','1000'],['11/40','275','1000']].map(([q,a,d],i)=>row(i+1,`${fraction(q)} = <span class="fraction editable">${input(`2c-${i}`,a,'integer',`2c, ${i+1}: Zähler mit Nenner ${d}`)}<span>${d}</span></span>`))))+
    task('d','Schreibe die gemischten Zahlen als unechte Brüche.',rows([['4','2/7','30/7'],['3','5/6','23/6'],['2','7/8','23/8'],['5','3/10','53/10']].map(([w,f,a],i)=>row(i+1,`${w} ${fraction(f)} = ${input(`2d-${i}`,a,'fraction',`2d, ${i+1}: unechter Bruch`)}`)))));
    sections.push(task('a','Bestimme. Achte auf die Einheiten.',rows([['3/8','64 kg','24','kg'],['7/10','3 m (in cm)','210','cm'],['5/6','90 min','75','min'],['3/4','2 l (in ml)','1500','ml'],['2/9','45 €','10','€']].map(([f,q,a,u],i)=>row(i+1,`${fraction(f)} <span lang="de">von ${q}</span> = ${input(`3a-${i}`,a,'number',`3a, ${i+1}: Ergebnis in ${u}`,u)}`))))+
      task('b','Der blaue Teil entspricht 3/8 des Ganzen.',`<p lang="de">Ergänze das Bild zu einem ganzen Rechteck aus gleich großen Kästchen.</p><p class="interaction-help">Klicke die Kästchen an, die du ergänzen möchtest. Die blauen Kästchen gehören bereits zur Zeichnung.</p><div class="drawing-scroll"><div class="rectangle-grid" id="rectangle-grid"></div></div><label class="done-checkbox"><input type="checkbox" id="rectangle-done" ${state.rectangleDone?'checked':''}> Mein Rechteck ist fertig</label><p class="special-feedback" id="rectangle-feedback"></p>`)+
      task('c','Teile die Schokoladentafel gerecht unter 8 Freunde.',`<p lang="de">Zeichne die Gruppen ein. Wie viele Stücke und welchen Bruchteil erhält jeder?</p><p class="interaction-help">Wähle einen Freund und klicke seine Stücke an. Klicke ein Stück desselben Freundes erneut an, um die Zuordnung zu entfernen.</p><div class="friend-picker" role="group" aria-label="Wähle einen Freund">${Array.from({length:8},(_,i)=>`<button class="friend-button" data-friend="${i+1}" aria-pressed="${i===0}" style="--friend-color:var(--friend-${i+1})">${i+1}</button>`).join('')}</div><div class="chocolate-grid" id="chocolate-grid" aria-label="Tafel mit 24 Stücken"></div><p class="special-feedback" id="chocolate-feedback"></p><div class="sentence-answer" lang="de">Jeder bekommt ${input('3c-pieces','3','integer','3c: Stücke pro Freund')} Stücke = ${input('3c-fraction','1/8','fraction','3c: Bruchteil der Tafel')} der Tafel.</div>`)+
      task('d','In der Klasse 6a sind 30 Kinder. 2/5 spielen Fußball.',`<p lang="de">Wie viele Kinder spielen Fußball?</p>${input('3d','12','number','3d: Anzahl der Kinder','Kinder')}`)+
      task('e','Nach 42 km hat Lena 7/10 einer Wanderstrecke geschafft.',`<p lang="de">Wie lang ist die gesamte Strecke?</p>${input('3e','60','number','3e: Gesamtlänge','km')}`)+
      task('f','3/8 eines Buches sind 54 Seiten. Wie viele Seiten hat das Buch?',input('3f','144','number','3f: Seiten des Buches','Seiten')));
    sections.push(task('a','Trage die Zahlen genau auf der Zahlengeraden ein.',numberline('a',260,[264,275,282,289]))+task('b','Trage die Zahlen genau auf der Zahlengeraden ein.',numberline('b',70,[73,85,91,99])));
    const table=[['1/5','0,2',true],['7/20','0,35',false],['5/8','0,625',true],['1/8','0,125',false],['9/25','0,36',true],['1/25','0,04',false],['11/20','0,55',true],['3/8','0,375',false],['3/4','0,75',true],['2/25','0,08',false]];
    sections.push(task('a','Vervollständige die Tabelle. Kürze jeden Bruch vollständig.',`<table class="conversion-table"><thead><tr><th scope="col" lang="de">Bruch (gekürzt)</th><th scope="col" lang="de">Dezimalzahl</th></tr></thead><tbody>${table.map(([f,d,given],i)=>`<tr><td>${given?fraction(f):input(`5-${i}`,f,'reduced',`5, Zeile ${i+1}: vollständig gekürzter Bruch`)}</td><td>${given?input(`5-${i}`,d,'decimal',`5, Zeile ${i+1}: Dezimalzahl`):d}</td></tr>`).join('')}</tbody></table>`));
    const decimals=[['0,8','0,80','='],['4,07','4,7','<'],['13,06','13,006','>'],['0,099','0,1','<'],['2,305','2,35','<'],['9,90','9,899','>'],['7,005','7,05','<'],['0,400','0,4','='],['5,020','5,002','>'],['14,7','14,699','>'],['0,501','0,499','>'],['8,031','8,31','<']];
    sections.push(task('a','Ordne jeweils vom kleinsten zum größten.',
      order('6a-1',['6,6','6,06','6,006','6,66','6,606','6,066'],['6,006','6,06','6,066','6,6','6,606','6,66'],'decimal')+
      order('6a-2',['32,5','3,25','32,05','3,205','3,52','32,005'],['3,205','3,25','3,52','32,005','32,05','32,5'],'decimal')+
      order('6a-3',['0,909','0,99','0,9','0,099','0,9099','0,999'],['0,099','0,9','0,909','0,9099','0,99','0,999'],'decimal'))+
      task('b','Setze <, > oder = ein.',rows(decimals.map(([a,b,c],i)=>row(i+1,`${a}${input(`6b-${i}`,c,'symbol',`6b, ${i+1}: ${a} verglichen mit ${b}`)}${b}`)))));
    sections.push(`<div class="notation-note"><span aria-hidden="true">✎</span><div><strong>So schreibst du deine Antwort</strong><p>Du kannst Komma oder Punkt verwenden. Setze die Periode in Klammern: Zum Beispiel bedeutet <b>0,(27)</b> die Zahl 0,272727…</p></div></div>`+
      [['4/9','0,(4)','reinperiodisch'],['5/12','0,41(6)','gemischtperiodisch'],['7/16','0,4375','abbrechend'],['13/30','0,4(3)','gemischtperiodisch']].map(([f,a,t],i)=>task('abcd'[i],'Wandle durch schriftliche Division um und bestimme die Art.',`<div class="division-question">${fraction(f)} = ${input(`7-${i}d`,a,'decimal',`7${'abcd'[i]}: Dezimalzahl`)}</div><label class="type-label" for="7-${i}t" lang="de">Art</label>${selectType(`7-${i}t`,t,`7${'abcd'[i]}: Art der Dezimalzahl`)}<label class="scratch-label" for="note-7-${i}" lang="de">Rechenweg (optional)</label><textarea class="scratchpad" id="note-7-${i}" data-note="7-${i}" rows="3" placeholder="Hier kannst du schriftlich dividieren…">${escape(state.notes[`7-${i}`]||'')}</textarea>`)).join(''));
    return sections;
  }
  const lineConfig={a:{start:260,targets:[264,275,282,289]},b:{start:70,targets:[73,85,91,99]}};
  const decimal=n=>(n/100).toFixed(2).replace('.',',');
  function numberline(id,start,targets) {
    targets.forEach((v,i)=>fields.push({id:`4${id}-${i}`,answer:String(v),type:'integer',section:4}));
    return `<p class="interaction-help">Wähle eine Zahl und klicke auf den passenden Strich. Mit den Pfeilen kannst du die Position anpassen.</p><div class="number-chips" role="group" aria-label="Zahlen zum Eintragen">${targets.map((v,i)=>`<button class="number-chip" data-line-choice="${id}-${i}" aria-pressed="${i===lineChoices[id]}">${decimal(v)} <span id="placed-${id}-${i}"></span></button>`).join('')}</div><div class="numberline" data-line="${id}"><div class="line-markers" id="markers-${id}"></div><div class="line-ticks">${Array.from({length:31},(_,i)=>`<button class="tick ${i%10===0?'major':''}" data-tick="${id}-${i}" style="--tick:${i}" aria-label="Eintragen bei ${decimal(start+i)}"><span></span>${i%10===0?`<b>${((start+i)/100).toFixed(1).replace('.',',')}</b>`:''}</button>`).join('')}</div></div><div class="line-controls"><button class="button small secondary" data-move="${id}:-1" aria-label="Ausgewählte Zahl einen Strich nach links bewegen">←</button><span id="line-status-${id}" role="status"></span><button class="button small secondary" data-move="${id}:1" aria-label="Ausgewählte Zahl einen Strich nach rechts bewegen">→</button><button class="text-button" data-unplace="${id}">Zahl entfernen</button></div><p class="special-feedback" id="line-feedback-${id}"></p>`;
  }
  const contents=renderContent();
  const total=fields.length+2;
  function completeField(f) {return String(state.answers[f.id]||'').trim().length>0;}
  function completed(section=0) {return fields.filter(f=>(!section||f.section===section)&&completeField(f)).length+((!section||section===3)?Number(state.rectangleDone)+Number(state.chocolate.every(Boolean)):0);}
  function totalFor(section) {return fields.filter(f=>f.section===section).length+(section===3?2:0);}
  function clearResult() {delete sectionResults[activeSection];if(!result)return;result=null;document.querySelectorAll('.is-correct,.is-incorrect').forEach(e=>e.classList.remove('is-correct','is-incorrect'));document.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));document.querySelectorAll('.field-feedback,.special-feedback').forEach(e=>e.textContent='');document.getElementById('results')?.replaceChildren();}
  function home() {
    const done=completed();
    document.title='Mein Matheheft · Mathematik';
    document.getElementById('main').innerHTML=`<div class="home"><section class="hero"><div><p class="eyebrow">DEIN PLATZ ZUM ÜBEN</p><h1>Mathe,<br>ganz in Ruhe<span>.</span></h1><p class="hero-description">Ein Heft zum Nachdenken, Ausprobieren und Weiterlernen.<br class="desktop-only"> Deine Antworten warten hier auf dich.</p></div><div class="hero-art" aria-hidden="true"><div class="paper paper-back"></div><div class="paper paper-front"><div class="paper-label">JEDEN TAG EIN BISSCHEN</div><div class="paper-equation">${fraction('3/4')}<span>=</span><span>0,75</span></div><div class="paper-grid">${Array.from({length:8},(_,i)=>`<span class="${i<6?'painted':''}"></span>`).join('')}</div><div class="pencil-line"></div></div><span class="art-spark">✳</span></div></section><section class="notebook-list" aria-labelledby="notebook-heading"><div class="list-heading"><h2 id="notebook-heading">Deine Übungsblätter</h2><span>01 Übungsblatt</span></div><a class="sheet-card" href="#${sheetId}/${state.lastSection}"><div class="card-symbol" aria-hidden="true">½</div><div class="card-content"><div class="card-meta"><time datetime="2026-11-05">5. NOV. 2026</time><span>KLASSE 6</span><span class="language-tag">DE</span></div><h3>Brüche und Dezimalzahlen</h3><p>Brüche vergleichen, kürzen und Anteile berechnen. Dazu Zahlengeraden, Dezimalzahlen und periodische Divisionen.</p><div class="card-bottom"><span>7 Kapitel · Mathematik, Klasse 6</span><span class="card-progress">${done?`${done} von ${total} Antworten`:'Noch nicht begonnen'}</span></div><div class="progress-track"><span style="width:${done/total*100}%"></span></div></div><span class="card-arrow" aria-hidden="true">↗</span></a></section><div class="home-note"><span aria-hidden="true">✧</span><p><strong>Ohne Eile, ohne Papier.</strong> Bearbeite ein Kapitel vollständig, um seine Antworten zu prüfen. Danach kannst du Fehler verbessern und es erneut versuchen.</p></div></div>`;
    updateSaveStatus();
  }
  function worksheet() {
    document.title=`${activeSection}. ${shortTitles[activeSection-1]} · Mein Matheheft`;
    document.getElementById('main').innerHTML=`<div class="workspace"><aside class="sidebar"><a class="back-link" href="#">← Alle Übungsblätter</a><p class="eyebrow">MATHEMATIK · KLASSE 6</p><h1>Brüche und<br>Dezimalzahlen</h1><p class="sidebar-date">Übungsblatt vom 5. November 2026</p><nav class="section-nav" aria-label="Kapitel des Übungsblatts">${shortTitles.map((t,i)=>`<a href="#${sheetId}/${i+1}" data-nav="${i+1}" ${activeSection===i+1?'aria-current="step"':''}><span class="section-number">${i+1}</span><span>${t}</span><span class="section-status" data-section-status="${i+1}"></span></a>`).join('')}</nav><div class="sidebar-progress"><div><strong>Dein Fortschritt</strong><span id="progress-count"></span></div><progress id="worksheet-progress" max="${total}" value="0" aria-label="Ausgefüllte Antworten"></progress><p id="progress-caption"></p></div><button class="text-button reset-button" data-reset>↺ Alles löschen</button></aside><div class="worksheet-body"><div class="worksheet-topline"><span>WIEDERHOLUNG · BRÜCHE & DEZIMALZAHLEN</span><span id="section-counter"></span></div>${contents.map((c,i)=>`<section class="section-panel" id="section-${i+1}" data-section="${i+1}" ${i+1!==activeSection?'hidden':''} aria-labelledby="heading-${i+1}"><div class="section-heading"><span class="large-section-number">${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">KAPITEL ${i+1} VON 7</p><h2 id="heading-${i+1}" lang="de" tabindex="-1">${titles[i]}</h2></div></div>${c}${i!==6?`<details class="notes"><summary>✎ Platz für meine Gedanken <span>(freiwillig)</span></summary><label class="sr-only" for="note-${i+1}">Notizen zu Kapitel ${i+1}</label><textarea class="scratchpad" id="note-${i+1}" data-note="${i+1}" rows="4" placeholder="Rechenwege, Ideen, Zwischenschritte…">${escape(state.notes[i+1]||'')}</textarea></details>`:''}</section>`).join('')}<div class="section-pagination"><a class="button secondary" id="previous-section">← Zurück</a><span id="pagination-status"></span><a class="button secondary" id="next-section">Weiter →</a></div><section id="results" aria-live="polite"></section><div class="check-bar"><div><strong id="check-title">Jeder Schritt zählt.</strong><p id="check-hint"></p></div><button class="button primary" id="check-all" disabled>Kapitel prüfen <span aria-hidden="true">✓</span></button></div></div></div>`;
    // contents are cached markup; restore the latest values after every route render.
    document.querySelectorAll('[data-answer]').forEach(e=>e.value=state.answers[e.dataset.answer]||'');
    document.querySelectorAll('[data-note]').forEach(e=>e.value=state.notes[e.dataset.note]||'');
    document.getElementById('rectangle-done').checked=state.rectangleDone;
    drawRectangle();drawChocolate();drawLine('a');drawLine('b');updateProgress();updateNavigation();
    if(result)showResults();
  }
  function route() {
    const match=location.hash.match(/^#repaso-6\/([1-7])$/);
    if(!match){home();return;}
    activeSection=Number(match[1]);result=sectionResults[activeSection]||null;state.lastSection=activeSection;save();worksheet();
  }
  function updateNavigation() {
    const nav=document.querySelector('.section-nav'),current=nav.querySelector('[aria-current]');
    if(nav.scrollWidth>nav.clientWidth)nav.scrollLeft=Math.max(0,current.offsetLeft-nav.offsetLeft-nav.clientWidth/2+current.clientWidth/2);
    document.getElementById('section-counter').textContent=`${activeSection} / 7`;
    document.getElementById('pagination-status').textContent=`Kapitel ${activeSection} von 7`;
    const prev=document.getElementById('previous-section'),next=document.getElementById('next-section');
    prev.href=activeSection===1?'#':`#${sheetId}/${activeSection-1}`;prev.textContent=activeSection===1?'← Übersicht':'← Zurück';
    next.href=activeSection===7?`#${sheetId}/1`:`#${sheetId}/${activeSection+1}`;next.textContent=activeSection===7?'Zurück zu Kapitel 1 ↗':'Weiter →';
  }
  function updateProgress() {
    if(!document.getElementById('progress-count'))return;
    const n=completed(),remaining=totalFor(activeSection)-completed(activeSection);
    document.getElementById('progress-count').textContent=`${n} / ${total}`;
    document.getElementById('worksheet-progress').value=n;
    document.getElementById('progress-caption').textContent=n===total?'Alle Kapitel ausgefüllt.':'Du kannst jederzeit aufhören und später weitermachen.';
    document.getElementById('check-all').disabled=remaining!==0;
    document.getElementById('check-title').textContent=remaining?'Jeder Schritt zählt.':'Kapitel vollständig!';
    document.getElementById('check-hint').textContent=remaining?`In diesem Kapitel fehlen noch ${remaining} Antworten.`:'Du kannst jetzt die Antworten dieses Kapitels prüfen.';
    for(let i=1;i<=7;i++){const el=document.querySelector(`[data-section-status="${i}"]`),done=completed(i)===totalFor(i);el.textContent=done?'✓':'';el.setAttribute('aria-label',done?'Fertig':`${completed(i)} von ${totalFor(i)}`);}
    updateSaveStatus();
  }
  function drawRectangle() {
    const base=[0,1,2,12,13,14];
    document.getElementById('rectangle-grid').innerHTML=Array.from({length:36},(_,i)=>base.includes(i)?`<span class="grid-cell blue" aria-label="Vorgegebenes blaues Kästchen"></span>`:`<button class="grid-cell ${state.rectangle.includes(i)?'added':''}" data-cell="${i}" aria-label="Zeile ${Math.floor(i/12)+1}, Spalte ${i%12+1}" aria-pressed="${state.rectangle.includes(i)}"></button>`).join('');
  }
  function drawChocolate() {
    document.getElementById('chocolate-grid').innerHTML=state.chocolate.map((v,i)=>`<button class="chocolate-cell ${v?'assigned':''}" data-chocolate="${i}" style="${v?`--piece-color:var(--friend-${v})`:''}" aria-label="Stück ${i+1}: ${v?`Freund ${v}`:'nicht zugeordnet'}">${v||''}</button>`).join('');
    document.querySelectorAll('[data-friend]').forEach(e=>e.setAttribute('aria-pressed',Number(e.dataset.friend)===chosenFriend));
  }
  function drawLine(id) {
    const {start,targets}=lineConfig[id],selected=lineChoices[id];
    document.getElementById(`markers-${id}`).innerHTML=targets.map((v,i)=>{
      const placed=state.answers[`4${id}-${i}`];if(!placed)return '';
      return `<span class="line-marker ${i===selected?'selected':''}" style="left:${(Number(placed)-start)/30*100}%;--marker-level:${i%2}" data-marker="${id}-${i}"><b>${decimal(v)}</b><span></span></span>`;
    }).join('');
    targets.forEach((v,i)=>{document.getElementById(`placed-${id}-${i}`).textContent=state.answers[`4${id}-${i}`]?'●':'';document.querySelector(`[data-line-choice="${id}-${i}"]`).setAttribute('aria-pressed',selected===i);});
    const placed=state.answers[`4${id}-${selected}`];
    document.getElementById(`line-status-${id}`).textContent=`${decimal(targets[selected])}: ${placed?'eingetragen':'noch nicht eingetragen'}`;
  }
  function setLine(id,value) {clearResult();state.answers[`4${id}-${lineChoices[id]}`]=String(Math.max(lineConfig[id].start,Math.min(lineConfig[id].start+30,value)));save();drawLine(id);updateProgress();}
  function verify() {
    if(completed(activeSection)!==totalFor(activeSection))return;
    result={};fields.filter(f=>f.section===activeSection).forEach(f=>result[f.id]=PracticeMath.check(state.answers[f.id],f.answer,f.type));
    if(activeSection===3){result.rectangle=PracticeMath.rectangle(state.rectangle);result.chocolate=PracticeMath.chocolate(state.chocolate);}
    sectionResults[activeSection]=result;
    showResults();document.getElementById('results').scrollIntoView({behavior:'smooth',block:'center'});
  }
  function showResults() {
    if(!result)return;
    const total=totalFor(activeSection);
    fields.filter(f=>f.section===activeSection).forEach(f=>{
      const wrap=document.querySelector(`[data-wrap="${f.id}"]`);if(!wrap)return;
      const ok=result[f.id];wrap.classList.toggle('is-correct',ok);wrap.classList.toggle('is-incorrect',!ok);
      wrap.querySelector('input,select').setAttribute('aria-invalid',!ok);
      wrap.querySelector('.field-feedback').textContent=ok?'✓ Richtig':'↺ Prüfen';
    });
    if(activeSection===3)for(const id of ['rectangle','chocolate']) {const el=document.getElementById(`${id}-feedback`);el.textContent=result[id]?'✓ Richtig!':'↺ Überprüfe diese Zeichnung und versuche es noch einmal.';el.className=`special-feedback ${result[id]?'is-correct':'is-incorrect'}`;}
    if(activeSection===4)for(const id of ['a','b']){const wrong=lineConfig[id].targets.filter((v,i)=>!result[`4${id}-${i}`]);const el=document.getElementById(`line-feedback-${id}`);el.textContent=wrong.length?`↺ Überprüfe die Position von: ${wrong.map(decimal).join(' · ')}.`:'✓ Alle Zahlen sind richtig eingetragen.';el.className=`special-feedback ${wrong.length?'is-incorrect':'is-correct'}`;}
    const right=Object.values(result).filter(Boolean).length;

    document.getElementById('results').innerHTML=`<div class="results-card ${right===total?'perfect':''}"><span class="results-icon" aria-hidden="true">${right===total?'✳':'↗'}</span><div><p class="eyebrow">DEIN ERGEBNIS · KAPITEL ${activeSection}</p><h2>${right===total?'Alles richtig! Gut gemacht.':`${right} von ${total} Antworten richtig`}</h2><p>${right===total?'Du hast dieses Kapitel geschafft.':'Fehler gehören zum Lernen. Überarbeite die markierten Antworten und prüfe sie noch einmal.'}</p></div></div>`;
  }
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-answer]')) {clearResult();state.answers[e.target.dataset.answer]=e.target.value;save();updateProgress();}
    if(e.target.matches('[data-note]')) {state.notes[e.target.dataset.note]=e.target.value;save();}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('select[data-answer]')){clearResult();state.answers[e.target.dataset.answer]=e.target.value;save();updateProgress();}
    if(e.target.id==='rectangle-done'){clearResult();state.rectangleDone=e.target.checked;save();updateProgress();}
  });
  document.addEventListener('click',e=>{
    if(e.target.closest('.skip-link')){e.preventDefault();document.getElementById('main').focus();return;}
    const button=e.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-reset'))document.getElementById('reset-dialog').showModal();
    if(button.id==='cancel-reset')document.getElementById('reset-dialog').close();
    if(button.id==='confirm-reset'){
      state=defaults();result=null;sectionResults={};try{localStorage.removeItem(STORAGE_KEY);storageOK=true;}catch{storageOK=false;}
      document.getElementById('reset-dialog').close();chosenFriend=1;lineChoices={a:0,b:0};route();
    }
    if(button.id==='check-all')verify();
    if(button.hasAttribute('data-cell')){
      clearResult();const id=Number(button.dataset.cell),has=state.rectangle.includes(id);
      state.rectangle=has?state.rectangle.filter(n=>n!==id):[...state.rectangle,id];state.rectangleDone=false;
      document.getElementById('rectangle-done').checked=false;save();
      button.classList.toggle('added',!has);button.setAttribute('aria-pressed',!has);updateProgress();
    }
    if(button.hasAttribute('data-friend')){chosenFriend=Number(button.dataset.friend);document.querySelectorAll('[data-friend]').forEach(e=>e.setAttribute('aria-pressed',Number(e.dataset.friend)===chosenFriend));}
    if(button.hasAttribute('data-chocolate')){
      clearResult();const id=Number(button.dataset.chocolate);state.chocolate[id]=state.chocolate[id]===chosenFriend?0:chosenFriend;save();
      const v=state.chocolate[id];button.textContent=v||'';button.classList.toggle('assigned',!!v);button.style.setProperty('--piece-color',v?`var(--friend-${v})`:'');button.setAttribute('aria-label',`Stück ${id+1}: ${v?`Freund ${v}`:'nicht zugeordnet'}`);updateProgress();
    }
    if(button.hasAttribute('data-line-choice')){const [id,i]=button.dataset.lineChoice.split('-');lineChoices[id]=Number(i);drawLine(id);}
    if(button.hasAttribute('data-tick')){const [id,i]=button.dataset.tick.split('-');setLine(id,lineConfig[id].start+Number(i));}
    if(button.hasAttribute('data-move')){const [id,delta]=button.dataset.move.split(':');const current=state.answers[`4${id}-${lineChoices[id]}`];setLine(id,current?Number(current)+Number(delta):lineConfig[id].start);}
    if(button.hasAttribute('data-unplace')){const id=button.dataset.unplace;clearResult();delete state.answers[`4${id}-${lineChoices[id]}`];save();drawLine(id);updateProgress();}
  });
  window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);if(location.hash)document.getElementById(`heading-${activeSection}`)?.focus({preventScroll:true});});
  route();
})();
