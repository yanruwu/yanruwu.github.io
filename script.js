const shareButton=document.querySelector('#share');
if(shareButton){
shareButton.addEventListener('click',async()=>{
try{
if(navigator.share){await navigator.share({title:document.title,text:'Itinerario de viaje por los Dolomitas',url:location.href});return}
await navigator.clipboard.writeText(location.href);
const old=shareButton.textContent;
shareButton.textContent='Enlace copiado';
setTimeout(()=>shareButton.textContent=old,1600);
}catch{}
});
}

document.querySelectorAll('.media img').forEach(img=>{
img.addEventListener('error',()=>img.closest('.media').classList.add('img-err'),{once:true});
});

if('IntersectionObserver' in window){
const revealEls=document.querySelectorAll('.card,.day,.decision,.fact');
revealEls.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%3*0.08)+'s'});
const io=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target)}
});
},{threshold:.1,rootMargin:'0px'});
revealEls.forEach(el=>io.observe(el));

const navLinks=[...document.querySelectorAll('.nav a')];
const sections=[...document.querySelectorAll('main section[id]')];
if(navLinks.length && sections.length){
const spy=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(!entry.isIntersecting) return;
const link=navLinks.find(a=>a.getAttribute('href')==='#'+entry.target.id);
if(link){navLinks.forEach(a=>a.classList.remove('active'));link.classList.add('active')}
});
},{rootMargin:'-45% 0px -50% 0px'});
sections.forEach(s=>spy.observe(s));
}
}

(()=>{
const rowsEl=document.getElementById('calcRows');
if(!rowsEl) return;
const totalEl=document.getElementById('calcTotal');
const personEl=document.getElementById('calcPerson');

const PRICE={
alojamiento:{
rural:{label:'Casas rurales en San Vito di Cadore y Castelrotto/Siusi, 2 noches cada una.',low:720,high:1050},
hotel:{label:'Hoteles céntricos en Cortina y Ortisei, 2 noches cada uno.',low:1400,high:2000}
},
vehiculo:{
uno:{label:'Un vehículo de 7 plazas.',low:650,high:820,fuelLow:260,fuelHigh:380,fuelNote:'Un solo coche: menos parkings duplicados.'},
dos:{label:'Dos vehículos medianos.',low:780,high:1050,fuelLow:380,fuelHigh:560,fuelNote:'Dos coches: más combustible y parking.'}
},
comidaPP:{low:150,high:195},
remontesPP:{low:40,high:60}
};

const state={alojamiento:'rural',vehiculo:'uno',viajeros:6};
const eur=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+' €';
const range=(low,high)=>`${eur(low)}–${eur(high)}`;

function render(){
const aloj=PRICE.alojamiento[state.alojamiento];
const veh=PRICE.vehiculo[state.vehiculo];
const n=state.viajeros;
const rows=[
{name:'Alojamiento',note:aloj.label,low:aloj.low,high:aloj.high},
{name:'Coche(s)',note:veh.label,low:veh.low,high:veh.high},
{name:'Combustible, peajes y parkings',note:veh.fuelNote,low:veh.fuelLow,high:veh.fuelHigh},
{name:'Comida',note:`Supermercado, refugios y cenas para ${n} personas.`,low:PRICE.comidaPP.low*n,high:PRICE.comidaPP.high*n},
{name:'Remontes',note:`Seceda y opciones adicionales para ${n} personas.`,low:PRICE.remontesPP.low*n,high:PRICE.remontesPP.high*n}
];
rowsEl.innerHTML=rows.map(r=>`<div class="calc-row"><div><div class="c-name">${r.name}</div><div class="c-note">${r.note}</div></div><div class="c-value">${range(r.low,r.high)}</div></div>`).join('');

const totalLow=rows.reduce((s,r)=>s+r.low,0);
const totalHigh=rows.reduce((s,r)=>s+r.high,0);
totalEl.textContent=range(totalLow,totalHigh);
personEl.textContent=`≈ ${range(totalLow/n,totalHigh/n)}`;
[totalEl,personEl].forEach(el=>{el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse')});
}

document.querySelectorAll('.seg').forEach(seg=>{
seg.addEventListener('click',e=>{
const btn=e.target.closest('.seg-btn');
if(!btn) return;
seg.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
const group=seg.dataset.group;
state[group]=group==='viajeros'?Number(btn.dataset.value):btn.dataset.value;
render();
});
});

render();
})();
