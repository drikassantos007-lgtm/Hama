import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const $=id=>document.getElementById(id);
const PAL={k:'#4a1038',w:'#fff8fc',p:'#ff6fb0',e:'#b0125f',x:'#ffffff',m:'#ff4fa3',d:'#7a2552',q:'#ffc2dd'};
function px(rows,s,pal){pal=Object.assign({},PAL,pal||{});let r='';rows.forEach((row,y)=>{[...row].forEach((c,x)=>{if(pal[c])r+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+pal[c]+'"/>'});});
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+rows[0].length+' '+rows.length+'" width="'+rows[0].length*s+'" height="'+rows.length*s+'" shape-rendering="crispEdges" aria-hidden="true">'+r+'</svg>'}
const GHOST=['.....kkkkkk.....','...kkwwwwwwkk...','..kwwwwwwwwwwk..','.kwwwwwwwwwwwwk.','.kwwwwwwwwwwwwk.','kwwweeewweeewwwk','kwwwexewwexewwwk','kwwweeewweeewwwk','kwppwwwwmmwwppwk','.kwwwwwwwwwwwwk.','.kwwwwwwwwwwwwk.','.kwwwwwwwwwwwwk.','.kwwwwwwwwwwwwk.','.kwwkkwwwwkkwwk.','..kk..kkkk..kk..'];
const HEART=['.kk.kk.','kppkppk','kpxppwk','kpppppk','.kpppk.','..kpk..','...k...'];
const SPARK=['...p...','...p...','..ppp..','ppppppp','..ppp..','...p...','...p...'];
const TREE=['...kkkk.....','..kppppkk...','.kppwppppk..','kppwpppppppk','kpppppwppppk','kpppppppppk.','.kkppppppkk.','....kddk....','....kddk....','...kkddkk...'];
const GIFT=['kkkkkkkkkk','kpppkkpppk','kpppkkpppk','kkkkkkkkkk','kpppkkpppk','kpppkkpppk','kpppkkpppk','kkkkkkkkkk'];
const COIN=['..kkkk..','.kppppk.','kpwpppmk','kpwpppmk','kppppppk','kppppmmk','.kmmmmk.','..kkkk..'];
const CAL=['.k......k.','kkkkkkkkkk','kppppppppk','kkkkkkkkkk','kwwwwwwwwk','kwpwpwpwwk','kwwwwwwwwk','kwpwpwwwwk','kkkkkkkkkk'];
const SP='#ff6fb0';
$('logo').innerHTML=px(GHOST,2,{w:'#f23f9b',k:'#8a1450',e:'#4a1038',x:'#fff',m:'#ffd1e6',p:'#ffa6cf'});
$('mid').innerHTML=px(GHOST,12);
$('bub').innerHTML=px(HEART,3);
$('h1').innerHTML=px(HEART,4);$('h2').innerHTML=px(HEART,3);
$('s1').innerHTML=px(SPARK,4,{p:SP});$('s2').innerHTML=px(SPARK,3,{p:SP});
$('spk').innerHTML=px(SPARK,3,{p:SP});
['t1','t2','t3','t4'].forEach(i=>$(i).innerHTML=px(TREE,8,{p:i=='t2'||i=='t4'?'#ff8fc4':'#ff5fa8'}));
$('i1').innerHTML=px(GIFT,4);$('i2').innerHTML=px(COIN,5);$('i3').innerHTML=px(CAL,4);
function steps(el,H,base,amp,seed,N){const p=[];for(let i=0;i<N;i++){const v=Math.sin(i*.9+seed)+Math.sin(i*.37)*1.3+2.3;const h=Math.min(H,Math.round((base+v*amp)/4)*4);const t=H-h;p.push((i*100/N)+'% '+t+'px',((i+1)*100/N)+'% '+t+'px')}
 el.style.clipPath='polygon('+p.join(',')+',100% 100%,0 100%)'}
steps($('edge'),52,10,6,1,44);
steps($('gr'),62,20,5,3,60);

document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>$(b.dataset.go).scrollIntoView({behavior:'smooth'}));


const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),col=collection(db,'encomendas');
let orders=[],filter='all',img='',q='',unsub=null;
$('lg').innerHTML=px(GHOST,8);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function parse(d){const[a,b,c]=d.split('-').map(Number);return new Date(a,b-1,c)}
function days(d){const t=new Date();t.setHours(0,0,0,0);return Math.round((parse(d)-t)/864e5)}
function fmt(d){return parse(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}
function when(d){const n=days(d);if(n<0)return['Atrasada há '+(-n)+(n==-1?' dia':' dias'),1];if(n==0)return['Entregar hoje!',1];if(n==1)return['Amanhã',0];return['Em '+n+' dias',0]}
const plural=n=>n+(n==1?' encomenda':' encomendas');

$('drop').onclick=()=>$('file').click();
$('file').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
 r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,520/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);img=c.toDataURL('image/jpeg',.75);$('drop').innerHTML='<img src="'+img+'" alt="">'};im.src=r.result};r.readAsDataURL(f)};
$('add').onclick=async()=>{const who=$('who').value.trim(),date=$('date').value;
 if(!who||!date){alert('Preencha de quem é e a data de entrega.');return}
 const b=$('add');b.disabled=true;
 try{await addDoc(col,{who,date,note:$('note').value.trim(),img,paid:false,done:false,criado:Date.now()});
  img='';$('who').value='';$('date').value='';$('note').value='';$('file').value='';$('drop').innerHTML='Toque para escolher a foto'}
 catch(e){alert('Não consegui salvar ('+e.code+'). Confira se está logada e se as regras foram publicadas.')}
 b.disabled=false};
$('list').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const o=orders.find(x=>x.id==b.dataset.id);if(!o)return;
 const r=doc(db,'encomendas',o.id);
 try{
  if(b.dataset.a=='pay')await updateDoc(r,{paid:!o.paid});
  if(b.dataset.a=='done')await updateDoc(r,{done:!o.done});
  if(b.dataset.a=='del'&&confirm('Apagar a encomenda de '+o.who+'?'))await deleteDoc(r);
 }catch(err){alert('Erro ao salvar: '+err.code)}};
$('q').oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
$('tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;filter=b.dataset.f;[...$('tabs').children].forEach(x=>x.classList.toggle('on',x===b));render()};
function render(){
 const active=orders.filter(o=>!o.done);
 $('sTotal').textContent=plural(active.length);
 $('sUnpaid').textContent=plural(orders.filter(o=>!o.paid).length);
 const nx=active.slice().sort((a,b)=>a.date.localeCompare(b.date))[0];
 $('sNext').textContent=nx?nx.who+' · '+fmt(nx.date):'Nada por enquanto';
 let l=orders.slice().sort((a,b)=>(a.done-b.done)||a.date.localeCompare(b.date));
 if(filter=='unpaid')l=l.filter(o=>!o.paid);
 if(filter=='paid')l=l.filter(o=>o.paid);
 if(filter=='done')l=l.filter(o=>o.done);
 if(q)l=l.filter(o=>(o.who+' '+o.note).toLowerCase().includes(q));
 $('list').innerHTML=l.length?l.map(o=>{const w=when(o.date);
  return '<div class="box card '+(o.paid?'paid ':'')+(o.done?'done':'')+'"><div class="pic">'+(o.img?'<img src="'+o.img+'" alt="Encomenda de '+esc(o.who)+'">':'<span style="font-size:2.4rem">🎀</span>')+'</div>'+
  '<div class="info"><h3>'+esc(o.who)+'</h3><span class="badge'+(w[1]&&!o.done?' late':'')+'">📆'+fmt(o.date)+(o.done?' · entregue ✔':' · '+w[0])+'</span>'+
  (o.note?'<div class="note">'+esc(o.note)+'</div>':'')+
  '<div class="acts"><button class="btn sm pay '+(o.paid?'ok':'')+'" data-a="pay" data-id="'+o.id+'">'+(o.paid?'✔ Pago':'Não pago')+'</button>'+
  '<button class="btn sm ghost" data-a="done" data-id="'+o.id+'">'+(o.done?'Desfazer':'Entregue')+'</button>'+
  '<button class="btn sm ghost" data-a="del" data-id="'+o.id+'" aria-label="Apagar">🗑</button></div></div></div>'}).join(''):'<div class="empty">Nenhuma encomenda por aqui ainda</div>';
}

onAuthStateChanged(auth,u=>{
 $('login').hidden=!!u;$('app').hidden=!u;
 if(unsub){unsub();unsub=null}
 orders=[];render();
 if(u)unsub=onSnapshot(col,s=>{orders=s.docs.map(d=>({id:d.id,...d.data()}));render()},e=>alert('Sem acesso aos dados: '+e.code));
});
async function entrar(){$('err').textContent='';try{await signInWithEmailAndPassword(auth,$('em').value.trim(),$('pw').value)}catch(e){$('err').textContent='E-mail ou senha incorretos.'}}
$('loginBtn').onclick=entrar;
$('pw').onkeydown=e=>{if(e.key=='Enter')entrar()};
$('out').onclick=()=>signOut(auth);

if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
