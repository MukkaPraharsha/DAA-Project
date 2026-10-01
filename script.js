/* =====================================================================
   Sort Lab — script.js
   All behaviour for the app. Sections (in order):
     1. data            algorithm metadata + race colours
     2. step recorders  one function per algorithm; each returns a list of steps
     3. state           shared variables for the current session
     4. UI building     chips + complexity table
     5. input modes     random / manual / preset arrays
     6. canvas drawing  gradient-filled bars
     7. step UI         description box, live array, step log
     8. stats bar
     9. playback        start / pause / step / reset, single + race loops
   ===================================================================== */

/* ---------- data ---------- */
const ALGOS = {
  bubble:    {name:"Bubble Sort",    best:"O(n)",      avg:"O(n²)",      worst:"O(n²)",      space:"O(1)",   stable:"Yes"},
  selection: {name:"Selection Sort", best:"O(n²)",     avg:"O(n²)",      worst:"O(n²)",      space:"O(1)",   stable:"No"},
  insertion: {name:"Insertion Sort", best:"O(n)",      avg:"O(n²)",      worst:"O(n²)",      space:"O(1)",   stable:"Yes"},
  merge:     {name:"Merge Sort",     best:"O(n log n)",avg:"O(n log n)", worst:"O(n log n)", space:"O(n)",   stable:"Yes"},
  quick:     {name:"Quick Sort",     best:"O(n log n)",avg:"O(n log n)", worst:"O(n²)",       space:"O(log n)",stable:"No"},
  heap:      {name:"Heap Sort",      best:"O(n log n)",avg:"O(n log n)", worst:"O(n log n)", space:"O(1)",   stable:"No"},
  shell:     {name:"Shell Sort",     best:"O(n log n)",avg:"O(n^1.3)",   worst:"O(n²)",       space:"O(1)",   stable:"No"},
  radix:     {name:"Radix Sort",     best:"O(nk)",     avg:"O(nk)",      worst:"O(nk)",       space:"O(n+k)", stable:"Yes"},
  counting:  {name:"Counting Sort",  best:"O(n+k)",    avg:"O(n+k)",     worst:"O(n+k)",      space:"O(n+k)", stable:"Yes"},
};
const COLORS = ["#5EC8D8","#F5A623","#A78BFA","#34D399","#F2545B","#7DD3FC","#FBBF24","#C4B5FD","#6EE7B7"];

// Gradient pairs [top, bottom] for each bar state.
var BAR_GRAD = {
  idle:    ['#8EA0CC','#46557D'],
  compare: ['#FFD66B','#F59E0B'],
  swap:    ['#FF8FA3','#E11D48'],
  pivot:   ['#D3B8FF','#7C3AED'],
  sorted:  ['#6EF3C5','#0D9488']
};
/* ---------- step recorders ---------- */
// Every step carries a human-readable description string so the UI can
// explain, in words, exactly what the algorithm just decided or did.
function rec(steps, type, arr, i, j, desc){ steps.push({type, arr:arr.slice(), i, j, desc}); }

function bubbleSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  for(let i=0;i<n;i++){ let swapped=false;
    for(let j=0;j<n-i-1;j++){
      const gt=a[j]>a[j+1];
      rec(steps,'compare',a,j,j+1, `Comparing index ${j} (${a[j]}) and index ${j+1} (${a[j+1]}) → ${a[j]} ${gt?'>':'≤'} ${a[j+1]}, ${gt?'swap needed':'no swap'}`);
      if(gt){ [a[j],a[j+1]]=[a[j+1],a[j]]; rec(steps,'swap',a,j,j+1, `Swapped index ${j} and ${j+1} → now [${a[j]}, ${a[j+1]}]`); swapped=true; }
    }
    rec(steps,'mark',a,n-i-1,n-i-1, `Index ${n-i-1} (value ${a[n-i-1]}) is now in its final sorted position.`);
    if(!swapped){ for(let k=n-i-2;k>=0;k--) rec(steps,'mark',a,k,k, `No swaps this pass — the rest of the array is already sorted.`); break; }
  }
  for(let k=0;k<n;k++) rec(steps,'mark',a,k,k, `Array fully sorted.`);
  return steps;
}
function selectionSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  for(let i=0;i<n;i++){ let min=i;
    for(let j=i+1;j<n;j++){
      const lt=a[j]<a[min];
      rec(steps,'compare',a,j,min, `Comparing index ${j} (${a[j]}) with current minimum index ${min} (${a[min]}) → ${lt?`new minimum is index ${j}`:'minimum unchanged'}`);
      if(lt) min=j;
    }
    if(min!==i){ [a[i],a[min]]=[a[min],a[i]]; rec(steps,'swap',a,i,min, `Swapped index ${i} and ${min} → smallest remaining value (${a[i]}) moved into position ${i}`); }
    rec(steps,'mark',a,i,i, `Index ${i} (value ${a[i]}) is now in its final sorted position.`);
  }
  return steps;
}
function insertionSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  rec(steps,'mark',a,0,0, `Index 0 is trivially sorted — starting from index 1.`);
  for(let i=1;i<n;i++){ let key=a[i]; let j=i-1;
    rec(steps,'compare',a,i,i, `Picked up value ${key} at index ${i} to insert into the sorted left part.`);
    while(j>=0){
      const gt=a[j]>key;
      rec(steps,'compare',a,j,i, `Comparing index ${j} (${a[j]}) with key ${key} → ${gt?'shift right':'insert here'}`);
      if(!gt) break;
      a[j+1]=a[j]; rec(steps,'swap',a,j,j+1, `Shifted ${a[j+1]} right from index ${j} to ${j+1}`); j--;
    }
    a[j+1]=key; rec(steps,'swap',a,j+1,i, `Inserted key ${key} at index ${j+1}`);
    for(let k=0;k<=i;k++) rec(steps,'mark',a,k,k, `Left portion [0..${i}] is now sorted.`);
  }
  return steps;
}
function shellSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  for(let gap=Math.floor(n/2); gap>0; gap=Math.floor(gap/2)){
    for(let i=gap;i<n;i++){ let temp=a[i]; let j=i;
      while(j>=gap){
        const gt=a[j-gap]>temp;
        rec(steps,'compare',a,j-gap,i, `Gap ${gap}: comparing index ${j-gap} (${a[j-gap]}) with index ${i} (${temp}) → ${gt?'shift':'stop'}`);
        if(!gt) break;
        a[j]=a[j-gap]; rec(steps,'swap',a,j,j-gap, `Shifted ${a[j]} from index ${j-gap} to ${j} (gap ${gap})`); j-=gap;
      }
      a[j]=temp; rec(steps,'swap',a,j,i, `Placed ${temp} at index ${j} (gap ${gap})`);
    }
  }
  for(let k=0;k<n;k++) rec(steps,'mark',a,k,k, `Array fully sorted.`);
  return steps;
}
function mergeSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  function merge(lo,mid,hi){ const left=a.slice(lo,mid+1), right=a.slice(mid+1,hi+1); let i=0,j=0,k=lo;
    while(i<left.length&&j<right.length){
      const le=left[i]<=right[j];
      rec(steps,'compare',a,lo+i,mid+1+j, `Merging [${lo}..${hi}]: comparing ${left[i]} and ${right[j]} → take ${le?left[i]:right[j]}`);
      if(le){ a[k]=left[i]; i++; } else { a[k]=right[j]; j++; }
      rec(steps,'swap',a,k,k, `Wrote ${a[k]} into merged position ${k}`); k++;
    }
    while(i<left.length){ a[k]=left[i]; rec(steps,'swap',a,k,k, `Copied remaining left value ${a[k]} into position ${k}`); i++; k++; }
    while(j<right.length){ a[k]=right[j]; rec(steps,'swap',a,k,k, `Copied remaining right value ${a[k]} into position ${k}`); j++; k++; }
  }
  function sort(lo,hi){ if(lo>=hi) return; const mid=Math.floor((lo+hi)/2); sort(lo,mid); sort(mid+1,hi); merge(lo,mid,hi); }
  sort(0,n-1);
  for(let k=0;k<n;k++) rec(steps,'mark',a,k,k, `Array fully sorted.`);
  return steps;
}
function quickSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  function partition(lo,hi){ const pivot=a[hi]; rec(steps,'pivot',a,hi,hi, `Chose pivot: value ${pivot} at index ${hi}`); let i=lo-1;
    for(let j=lo;j<hi;j++){
      const lt=a[j]<pivot;
      rec(steps,'compare',a,j,hi, `Comparing index ${j} (${a[j]}) with pivot ${pivot} → ${lt?'smaller, moves to the left side':'stays right'}`);
      if(lt){ i++; [a[i],a[j]]=[a[j],a[i]]; rec(steps,'swap',a,i,j, `Swapped index ${i} and ${j} to keep smaller values left of the pivot`); }
    }
    [a[i+1],a[hi]]=[a[hi],a[i+1]]; rec(steps,'swap',a,i+1,hi, `Placed pivot ${pivot} into its sorted position at index ${i+1}`); return i+1;
  }
  function sort(lo,hi){ if(lo<hi){ const p=partition(lo,hi); rec(steps,'mark',a,p,p, `Pivot at index ${p} is now in its final sorted position.`); sort(lo,p-1); sort(p+1,hi); } else if(lo===hi){ rec(steps,'mark',a,lo,lo, `Single element at index ${lo} is trivially sorted.`); } }
  sort(0,n-1);
  for(let k=0;k<n;k++) rec(steps,'mark',a,k,k, `Array fully sorted.`);
  return steps;
}
function heapSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  function heapify(size,root){ let largest=root, l=2*root+1, r=2*root+2;
    if(l<size){ rec(steps,'compare',a,l,largest, `Comparing left child index ${l} (${a[l]}) with index ${largest} (${a[largest]})`); if(a[l]>a[largest]) largest=l; }
    if(r<size){ rec(steps,'compare',a,r,largest, `Comparing right child index ${r} (${a[r]}) with index ${largest} (${a[largest]})`); if(a[r]>a[largest]) largest=r; }
    if(largest!==root){ [a[root],a[largest]]=[a[largest],a[root]]; rec(steps,'swap',a,root,largest, `Swapped index ${root} and ${largest} to restore max-heap order`); heapify(size,largest); }
  }
  for(let i=Math.floor(n/2)-1;i>=0;i--) heapify(n,i);
  for(let i=n-1;i>0;i--){ [a[0],a[i]]=[a[i],a[0]]; rec(steps,'swap',a,0,i, `Moved heap max (${a[i]}) from index 0 to sorted position ${i}`); rec(steps,'mark',a,i,i, `Index ${i} (value ${a[i]}) is now in its final sorted position.`); heapify(i,0); }
  rec(steps,'mark',a,0,0, `Array fully sorted.`);
  return steps;
}
function countingSort(a){ a=a.slice(); const steps=[]; const n=a.length;
  const max=Math.max(...a,0); const count=new Array(max+1).fill(0);
  for(let i=0;i<n;i++){ count[a[i]]++; rec(steps,'compare',a,i,i, `Counting occurrences of value ${a[i]}`); }
  for(let v=1;v<count.length;v++) count[v]+=count[v-1];
  const out=new Array(n);
  for(let i=n-1;i>=0;i--){ out[count[a[i]]-1]=a[i]; count[a[i]]--; const pos=count[a[i]];
    rec(steps,'swap',out.map((x,idx)=>x===undefined?a[idx]:x),pos,i, `Placed value ${a[i]} at its counted output position ${pos}`); }
  for(let k=0;k<n;k++) rec(steps,'mark',out,k,k, `Array fully sorted.`);
  return steps;
}
function radixSort(a){ a=a.slice(); const steps=[]; const n=a.length; const max=Math.max(...a,0);
  let arr=a.slice(); let digitPlace=1;
  for(let exp=1; Math.floor(max/exp)>0; exp*=10){
    const output=new Array(n).fill(0); const count=new Array(10).fill(0);
    for(let i=0;i<n;i++){ const d=Math.floor(arr[i]/exp)%10; count[d]++; rec(steps,'compare',arr,i,i, `Digit place ${digitPlace}: value ${arr[i]} has digit ${d}`); }
    for(let d=1;d<10;d++) count[d]+=count[d-1];
    for(let i=n-1;i>=0;i--){ const d=Math.floor(arr[i]/exp)%10; output[count[d]-1]=arr[i]; count[d]--; }
    arr=output; rec(steps,'swap',arr,0,n-1, `Bucketed all values by digit place ${digitPlace} → [${arr.join(', ')}]`); digitPlace++;
  }
  for(let k=0;k<n;k++) rec(steps,'mark',arr,k,k, `Array fully sorted.`);
  return steps;
}
const BUILD = {bubble:bubbleSort, selection:selectionSort, insertion:insertionSort, merge:mergeSort, quick:quickSort, heap:heapSort, shell:shellSort, radix:radixSort, counting:countingSort};

/* ---------- state ---------- */
let baseArray=[]; let mode='random'; let selected=new Set(['bubble']); let lastLogRow=-1;
let playing=false; let raf=null;
let singleSteps=[], singleIdx=0, singleStats={compare:0,write:0}, singleStart=0;
let races=[]; // {key, steps, idx, stats, done, finishTime, canvas, ctx}
let raceStart=0;

const $=id=>document.getElementById(id);

/* ---------- build UI: chips + complexity table ---------- */
const chipsWrap=$('algoChips');
Object.entries(ALGOS).forEach(([key,info],idx)=>{
  const c=document.createElement('div'); c.className='chip'+(selected.has(key)?' on':'');
    c.innerHTML=`<span class="dot" style="background:linear-gradient(135deg,${shade(COLORS[idx%COLORS.length],.35)},${COLORS[idx%COLORS.length]})"></span>${info.name}`;
  c.onclick=()=>{ if(playing) return;
    if(selected.has(key)){ if(selected.size>1){selected.delete(key); c.classList.remove('on');} }
    else { selected.add(key); c.classList.add('on'); }
    resetPlayback();
  };
  chipsWrap.appendChild(c);
});
const ctBody=document.querySelector('#complexityTable tbody');
Object.values(ALGOS).forEach(info=>{
  const tr=document.createElement('tr'); tr.dataset.name=info.name;
  tr.innerHTML=`<td>${info.name}</td><td class="mono">${info.best}</td><td class="mono">${info.avg}</td><td class="mono">${info.worst}</td><td class="mono">${info.space}</td><td>${info.stable}</td>`;
  ctBody.appendChild(tr);
});

/* ---------- input mode ---------- */
document.querySelectorAll('#modeSeg button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#modeSeg button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); mode=b.dataset.mode;
  $('modeRandom').style.display= mode==='random'?'flex':'none';
  $('modeManual').style.display= mode==='manual'?'flex':'none';
  $('modePreset').style.display= mode==='preset'?'flex':'none';
});
$('sizeSlider').oninput=e=>$('sizeVal').textContent=e.target.value;
$('sizePresetSlider').oninput=e=>$('sizePresetVal').textContent=e.target.value;
$('speedSlider').oninput=e=>{ const v=+e.target.value; $('speedVal').textContent= v<20?'step-by-step':v<50?'slow':v<80?'medium':'fast'; };

function randArr(n){ return Array.from({length:n},()=>1+Math.floor(Math.random()*98)); }
function setArray(arr, hintText){ baseArray=arr; $('arrayHint').textContent=hintText || `${arr.length} values · range 1–99`; resetPlayback(); drawIdle(); }

$('genRandomBtn').onclick=()=>setArray(randArr(+$('sizeSlider').value));
$('applyManualBtn').onclick=()=>{
  const vals=$('manualInput').value.split(',').map(s=>parseInt(s.trim(),10)).filter(n=>!isNaN(n)&&n>=0&&n<=999);
  if(vals.length<2){ $('arrayHint').textContent='Enter at least two valid non-negative numbers, comma-separated.'; return; }
  setArray(vals, `${vals.length} values from your input`);
};
$('genPresetBtn').onclick=()=>{
  const n=+$('sizePresetSlider').value; const p=$('presetSelect').value; let arr;
  if(p==='sorted') arr=randArr(n).sort((a,b)=>a-b);
  else if(p==='reverse') arr=randArr(n).sort((a,b)=>b-a);
  else if(p==='few') arr=Array.from({length:n},()=>1+Math.floor(Math.random()*5)*15);
  else { arr=randArr(n).sort((a,b)=>a-b); for(let i=0;i<Math.max(1,Math.floor(n*0.08));i++){ const x=Math.floor(Math.random()*n), y=Math.floor(Math.random()*n); [arr[x],arr[y]]=[arr[y],arr[x]]; } }
  setArray(arr, `${n} values · ${$('presetSelect').selectedOptions[0].text.toLowerCase()}`);
};
setArray(randArr(16));

/* ---------- stage rendering (idle preview) ---------- */
function drawIdle(){
  if(selected.size<=1){ drawBars($('singleCanvas'), baseArray, {}, 'var(--idle)'); }
  else { renderStage(); }
}
function renderStage(){
  const isRace = selected.size>1;
  $('singleStage').style.display = isRace? 'none':'block';
  $('raceStage').style.display = isRace? 'block':'none';
  if(!isRace){
    const key=[...selected][0]; $('singleAlgoName').textContent=ALGOS[key]?ALGOS[key].name:'—';
    $('singleStatus').textContent='idle';
    drawBars($('singleCanvas'), baseArray, {}, 'var(--idle)');
  } else {
    const grid=$('raceGrid'); grid.innerHTML='';
    [...selected].forEach((key,i)=>{
      const card=document.createElement('div'); card.className='raceCard'; card.id='race_'+key;
      card.innerHTML=`<div class="name"><span>${ALGOS[key].name}</span><span class="rank"></span></div>
        <canvas id="cv_${key}"></canvas>
        <div class="rstats"><span id="cmp_${key}">cmp 0</span><span id="wr_${key}">writes 0</span><span id="tm_${key}">0 ms</span></div>
        <div class="rstats" style="margin-top:2px;"><span id="st_${key}">step 0/0</span></div>`;
      grid.appendChild(card);
      requestAnimationFrame(()=>drawBars($('cv_'+key), baseArray, {}, COLORS[Object.keys(ALGOS).indexOf(key)%COLORS.length]));
    });
  }
  updateStatsBar();
  $('leaderPanel').style.display='none';
}
renderStage();

/* ---------- canvas bar drawing (linear-gradient fills) ---------- */
// Lighten (+) or darken (-) a #RRGGBB colour; used to build a two-stop gradient from one base colour.
function shade(hex, amt){
  const n=parseInt(hex.slice(1),16);
  const f=c=>Math.max(0,Math.min(255,Math.round(amt>=0 ? c+(255-c)*amt : c*(1+amt))));
  const r=f(n>>16), g=f((n>>8)&255), b=f(n&255);
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function drawBars(canvas, arr, hi, idleColor){
  if(!canvas) return;
  const dpr=window.devicePixelRatio||1;
  const cssW=canvas.clientWidth||canvas.parentElement.clientWidth; const cssH=canvas.clientHeight||110;
  canvas.width=cssW*dpr; canvas.height=cssH*dpr;
  const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,cssW,cssH);
  const n=arr.length; const gap=Math.max(1, n>60?1:2); const bw=Math.max(1,(cssW-gap*(n-1))/n);
  const max=Math.max(...arr,1);
  const labelReserve = bw>=13 ? 16 : 0; // room above bars for value labels
  const usableH = cssH - labelReserve - 4;
  // idle colour: default slate gradient, or a per-algorithm colour in race mode
  const idlePair = (idleColor && idleColor[0]==='#') ? [shade(idleColor,.25), shade(idleColor,-.45)] : BAR_GRAD.idle;
  for(let i=0;i<n;i++){
    const h=Math.max(2,(arr[i]/max)*usableH);
    let pair=idlePair, labelColor='#C7CEDA';
    if(hi.sortedSet && hi.sortedSet.has(i)) pair=BAR_GRAD.sorted;
    else if(hi.pivot===i){ pair=BAR_GRAD.pivot; labelColor='#B28DFF'; }
    else if(i===hi.i || i===hi.j){
      if(hi.type==='compare'){ pair=BAR_GRAD.compare; labelColor='#FBB03B'; }
      else if(hi.type==='swap'){ pair=BAR_GRAD.swap; labelColor='#FF5C7A'; }
    }
    const x=i*(bw+gap), y=cssH-h;
    const grad=ctx.createLinearGradient(0,y,0,cssH);   // top -> bottom of this bar
    grad.addColorStop(0,pair[0]); grad.addColorStop(1,pair[1]);
    ctx.fillStyle=grad;
    ctx.fillRect(x, y, bw, h);
    if(labelReserve){
      ctx.fillStyle=labelColor;
      ctx.font = `${Math.min(11,Math.max(9,bw*0.55))}px 'JetBrains Mono', monospace`;
      ctx.textAlign='center';
      ctx.fillText(String(arr[i]), x+bw/2, y-4);
    }
  }
}

/* ---------- step description + live array (single mode) ---------- */
const TYPE_BADGE = {compare:'🟨 COMPARE', swap:'🟥 SWAP/WRITE', pivot:'🟪 PIVOT', mark:'🟩 SORTED'};
function renderLiveArray(el, arr, type, i, j, sortedSet){
  el.innerHTML='';
  const valRow=document.createElement('div'); valRow.className='arrRow';
  const markRow=document.createElement('div'); markRow.className='arrRow markRow';
  arr.forEach((v,idx)=>{
    const cell=document.createElement('span'); cell.className='cell';
    let border='var(--line)', txt='var(--text)';
    if(sortedSet && sortedSet.has(idx)){ border='var(--sorted)'; txt='var(--sorted)'; }
    else if(idx===i || idx===j){
      if(type==='swap'){ border='var(--swap)'; txt='var(--swap)'; }
      else if(type==='pivot'){ border='var(--pivot)'; txt='var(--pivot)'; }
      else { border='var(--compare)'; txt='var(--compare)'; }
    }
    cell.style.borderColor=border; cell.style.color=txt;
    cell.textContent=v;
    valRow.appendChild(cell);
    const mark=document.createElement('span'); mark.className='markCell';
    if(idx===i || idx===j){ mark.textContent = type==='swap' ? '↔' : type==='pivot' ? 'P' : '↑'; mark.style.color=txt; }
    markRow.appendChild(mark);
  });
  el.appendChild(valRow); el.appendChild(markRow);
}
function updateStepUI(step, idx, total, stats){
  $('stepCounter').textContent = `Step ${idx} / ${total}`;
  $('stepDesc').textContent = (TYPE_BADGE[step.type]||'') + '\n' + step.desc;
  $('liveCompare').textContent = stats.compare;
  $('liveSwap').textContent = stats.write;
  $('liveStep').textContent = `${idx} / ${total}`;
}

/* ---------- full step-by-step log ---------- */
function buildStepLog(steps){
  const el=$('stepLog'); el.innerHTML='';
  const frag=document.createDocumentFragment();
  steps.forEach((s,idx)=>{
    const row=document.createElement('div'); row.className='stepLogRow pending'; row.id='logrow_'+idx;
    const badge=document.createElement('span'); badge.className='badge'; badge.textContent=TYPE_BADGE[s.type]||'';
    const idxEl=document.createElement('span'); idxEl.className='idx'; idxEl.textContent='#'+(idx+1);
    const descEl=document.createElement('span'); descEl.className='desc'; descEl.textContent=s.desc;
    row.appendChild(idxEl); row.appendChild(badge); row.appendChild(descEl);
    frag.appendChild(row);
  });
  el.appendChild(frag);
  $('stepLogCount').textContent = steps.length + ' steps total';
}
function markLogRow(idx){
  if(lastLogRow>=0){ const prev=document.getElementById('logrow_'+lastLogRow); if(prev){ prev.classList.remove('current'); prev.classList.add('done'); prev.classList.remove('pending'); } }
  const row=document.getElementById('logrow_'+idx);
  if(row){ row.classList.remove('pending'); row.classList.add('current'); if(typeof row.scrollIntoView==='function') row.scrollIntoView({block:'nearest'}); }
  lastLogRow=idx;
}
function markAllLogDone(total){
  if(lastLogRow>=0){ const prev=document.getElementById('logrow_'+lastLogRow); if(prev){ prev.classList.remove('current'); prev.classList.add('done'); } }
  for(let k=0;k<total;k++){ const row=document.getElementById('logrow_'+k); if(row){ row.classList.remove('pending','current'); row.classList.add('done'); } }
}

/* ---------- stats bar ---------- */
function updateStatsBar(){
  const bar=$('statsBar'); bar.innerHTML='';
  const isRace=selected.size>1;
  if(!isRace){
    bar.innerHTML=`
      <div class="stat"><div class="k">Array size</div><div class="v">${baseArray.length}</div></div>
      <div class="stat"><div class="k">Comparisons</div><div class="v compare">${singleStats.compare}</div></div>
      <div class="stat"><div class="k">Swaps / writes</div><div class="v swap">${singleStats.write}</div></div>
      <div class="stat"><div class="k">Step</div><div class="v">${singleIdx}/${singleSteps.length||0}</div></div>
      <div class="stat"><div class="k">Elapsed</div><div class="v sorted">${playing||singleIdx>0?((performance.now()-singleStart)/1000).toFixed(2)+'s':'0.00s'}</div></div>`;
  } else {
    const done=races.filter(r=>r.done).length;
    bar.innerHTML=`
      <div class="stat"><div class="k">Array size</div><div class="v">${baseArray.length}</div></div>
      <div class="stat"><div class="k">Algorithms racing</div><div class="v">${races.length}</div></div>
      <div class="stat"><div class="k">Finished</div><div class="v sorted">${done}/${races.length}</div></div>
      <div class="stat"><div class="k">Elapsed</div><div class="v">${races.length?((performance.now()-raceStart)/1000).toFixed(2)+'s':'0.00s'}</div></div>`;
  }
}

/* ---------- playback control ---------- */
function resetPlayback(){
  playing=false; if(raf) cancelAnimationFrame(raf);
  singleSteps=[]; singleIdx=0; singleStats={compare:0,write:0}; lastLogRow=-1;
  races=[];
  $('startBtn').disabled=false; $('pauseBtn').disabled=true; $('pauseBtn').textContent='Pause';
  $('stepBtn').disabled=false;
  $('leaderPanel').style.display='none';
  $('singleResult').style.display='none'; $('singleResult').textContent='';
  $('stepCounter').textContent='Step 0 / 0';
  $('stepDesc').textContent='Press Start to begin the walkthrough.';
  $('liveArray').innerHTML = '';
  if(baseArray.length) renderLiveArray($('liveArray'), baseArray, null, -1, -1, null);
  $('liveCompare').textContent='0'; $('liveSwap').textContent='0'; $('liveStep').textContent='0 / 0';
  $('stepLog').innerHTML='<div class="stepLogRow pending"><span class="idx">—</span><span class="desc">Press Start or Step once to generate the full step-by-step trace for this algorithm.</span></div>';
  $('stepLogCount').textContent='0 steps';
  document.querySelectorAll('#complexityTable tbody tr').forEach(tr=>tr.classList.remove('active'));
  renderStage();
}
$('resetBtn').onclick=resetPlayback;

function ensureSingleSteps(){
  const key=[...selected][0];
  if(singleSteps.length===0){
    singleSteps=BUILD[key](baseArray); singleStart=performance.now();
    document.querySelectorAll('#complexityTable tbody tr').forEach(tr=>{ tr.classList.toggle('active', tr.dataset.name===ALGOS[key].name); });
    buildStepLog(singleSteps);
  }
}
function renderSingleStepAt(idx){
  const s=singleSteps[idx];
  if(s.type==='compare') singleStats.compare++; else if(s.type==='swap') singleStats.write++;
  const sortedSet=new Set();
  for(let k=0;k<=idx;k++){ if(singleSteps[k].type==='mark') sortedSet.add(singleSteps[k].i); }
  drawBars($('singleCanvas'), s.arr, {type:s.type,i:s.i,j:s.j,pivot:s.type==='pivot'?s.i:undefined,sortedSet}, 'var(--idle)');
  renderLiveArray($('liveArray'), s.arr, s.type, s.i, s.j, sortedSet);
  updateStepUI(s, idx+1, singleSteps.length, singleStats);
  markLogRow(idx);
  updateStatsBar();
}
function finishSingle(){
  playing=false; $('singleStatus').textContent='done';
  const sortedSet=new Set(baseArray.map((_,i)=>i));
  const finalArr = singleSteps.length?singleSteps[singleSteps.length-1].arr:baseArray;
  drawBars($('singleCanvas'), finalArr, {sortedSet}, 'var(--idle)');
  renderLiveArray($('liveArray'), finalArr, 'mark', -1, -1, sortedSet);
  $('stepCounter').textContent = `Step ${singleSteps.length} / ${singleSteps.length}`;
  $('stepDesc').textContent = '🟩 DONE\nArray fully sorted — every element is in its final position.';
  $('liveStep').textContent = `${singleSteps.length} / ${singleSteps.length}`;
  markAllLogDone(singleSteps.length);
  $('startBtn').disabled=true; $('pauseBtn').disabled=true; $('stepBtn').disabled=true; updateStatsBar();
  const resEl=$('singleResult'); resEl.style.display='block';
  resEl.textContent = 'Sorted array: [ ' + finalArr.join(', ') + ' ]';
}

$('startBtn').onclick=()=>{
  if(playing) return;
  playing=true; $('startBtn').disabled=true; $('pauseBtn').disabled=false; $('stepBtn').disabled=true;
  const isRace=selected.size>1;
  if(isRace){
    if(races.length===0){
      races=[...selected].map((key,i)=>({key, steps:BUILD[key](baseArray), idx:0, stats:{compare:0,write:0}, done:false, finishTime:null, color:COLORS[Object.keys(ALGOS).indexOf(key)%COLORS.length]}));
      raceStart=performance.now();
      document.querySelectorAll('#complexityTable tbody tr').forEach(tr=>{ if(races.some(r=>ALGOS[r.key].name===tr.dataset.name)) tr.classList.add('active'); });
    }
    $('raceStatus').textContent='running';
    tickRace();
  } else {
    ensureSingleSteps();
    $('singleStatus').textContent='running';
    tickSingle();
  }
};
$('stepBtn').onclick=()=>{
  if(playing || selected.size>1) return;
  ensureSingleSteps();
  if(singleIdx<singleSteps.length){
    renderSingleStepAt(singleIdx); singleIdx++;
    $('singleStatus').textContent='paused';
    $('startBtn').disabled=false;
    if(singleIdx>=singleSteps.length) finishSingle();
  }
};
$('pauseBtn').onclick=()=>{
  playing=!playing; $('pauseBtn').textContent=playing?'Pause':'Resume';
  $('startBtn').disabled=playing; $('stepBtn').disabled=playing;
  if(playing){ $('singleStatus').textContent='running'; $('raceStatus').textContent='running'; if(selected.size>1) tickRace(); else tickSingle(); }
  else { $('singleStatus').textContent='paused'; $('raceStatus').textContent='paused'; }
};

function speedDelay(){ const v=+$('speedSlider').value; return Math.max(15, 900 - v*8.5); } // ms per step — slow end is a full second per step
let lastTick=0;
function tickSingle(){
  if(!playing) return;
  const now=performance.now();
  if(now-lastTick >= speedDelay()){
    lastTick=now;
    if(singleIdx<singleSteps.length){
      renderSingleStepAt(singleIdx);
      singleIdx++;
    } else {
      finishSingle();
      return;
    }
  }
  raf=requestAnimationFrame(tickSingle);
}
function tickRace(){
  if(!playing) return;
  const now=performance.now();
  if(now-lastTick >= speedDelay()){
    lastTick=now;
    races.forEach(r=>{
      if(r.done) return;
      if(r.idx<r.steps.length){
        const s=r.steps[r.idx];
        if(s.type==='compare') r.stats.compare++; else if(s.type==='swap') r.stats.write++;
        const sortedSet=new Set(); for(let k=0;k<=r.idx;k++){ if(r.steps[k].type==='mark') sortedSet.add(r.steps[k].i); }
        drawBars($('cv_'+r.key), s.arr, {type:s.type,i:s.i,j:s.j,pivot:s.type==='pivot'?s.i:undefined,sortedSet}, r.color);
        $('cmp_'+r.key).textContent='cmp '+r.stats.compare; $('wr_'+r.key).textContent='writes '+r.stats.write; $('tm_'+r.key).textContent=((performance.now()-raceStart)/1000).toFixed(2)+'s';
        $('st_'+r.key).textContent = `step ${r.idx+1}/${r.steps.length}`;
        r.idx++;
      } else {
        r.done=true; r.finishTime=performance.now()-raceStart;
        const sortedSet=new Set(baseArray.map((_,i)=>i));
        drawBars($('cv_'+r.key), r.steps.length?r.steps[r.steps.length-1].arr:baseArray, {sortedSet}, r.color);
        $('st_'+r.key).textContent = `step ${r.steps.length}/${r.steps.length} ✓`;
        document.getElementById('race_'+r.key).classList.add('done');
      }
    });
    updateStatsBar();
    if(races.every(r=>r.done)){
      playing=false; $('raceStatus').textContent='done'; $('startBtn').disabled=true; $('pauseBtn').disabled=true;
      showLeaderboard(); assignRanks(); return;
    }
  }
  raf=requestAnimationFrame(tickRace);
}
function assignRanks(){
  const ranked=[...races].sort((a,b)=>a.finishTime-b.finishTime);
  ranked.forEach((r,i)=>{ document.querySelector('#race_'+r.key+' .rank').textContent = '#'+(i+1); });
}
function showLeaderboard(){
  const body=$('leaderBody'); body.innerHTML='';
  const ranked=[...races].sort((a,b)=>a.finishTime-b.finishTime);
  ranked.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>#${i+1}</td><td>${ALGOS[r.key].name}</td><td class="mono">${r.stats.compare}</td><td class="mono">${r.stats.write}</td><td class="mono">${r.steps.length}</td><td class="mono">${(r.finishTime/1000).toFixed(3)}s</td>`;
    body.appendChild(tr);
  });
  $('leaderPanel').style.display='block';
  const ref = races[0];
  const finalArr = ref && ref.steps.length ? ref.steps[ref.steps.length-1].arr : baseArray;
  $('raceResult').textContent = 'Sorted array: [ ' + finalArr.join(', ') + ' ]';
}

window.addEventListener('resize', ()=>{ if(!playing) drawIdle(); });
