/* DOAÊ - código compartilhado por todas as telas.
   Os dados ficam no localStorage do navegador (simulação até existir banco de dados). */
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const ler=(k,p)=>{try{return JSON.parse(localStorage.getItem(k))??p}catch{return p}};
const gravar=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const sessao=()=>ler('sessao',null),usuarios=()=>ler('usuarios',[]),itens=()=>ler('itens',[]);
const eu=()=>{const s=sessao();return s&&usuarios().find(u=>u.usuario===s.usuario)};
const sair=()=>{localStorage.removeItem('sessao');location.href='index.html'};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=t=>t.replace(/\D/g,'');
const CAT={alimentos:['🍎','Alimentos'],naoperecivel:['🥫','Não perecíveis'],racao:['🐾','Ração para pets'],roupas:['👕','Roupas'],higiene:['🧼','Higiene e limpeza'],outros:['🎁','Outros']};
const STATUS={disponivel:'Disponível',pendente:'Pendente',doado:'Doado'};

/* dados de exemplo (só na primeira vez) */
if(!localStorage.getItem('usuarios')){
 gravar('usuarios',[
  {tipo:'doador',usuario:'maria',senha:'123456',nome:'Maria Souza',cpf:'529.982.247-25',cidade:'Itajubá',endereco:'Rua das Flores, 120, Centro',telefone:'(35) 99999-1111',email:'maria@email.com'},
  {tipo:'ong',usuario:'esperanca',senha:'123456',nome:'ONG Esperança',cnpj:'11.222.333/0001-81',cidades:'Itajubá, Piranguinho',endereco:'Av. Central, 50, Itajubá',itens:['alimentos','roupas'],responsavel:'João Lima',cpf:'529.982.247-25',telefone:'(35) 98888-2222',email:'contato@esperanca.org'}]);
 gravar('itens',[
  {id:1,doador:'maria',nome:'Cesta básica',cat:'alimentos',qtd:'2 cestas',descricao:'Arroz, feijão, óleo e macarrão.',cidade:'Itajubá',foto:'',status:'disponivel',ong:''},
  {id:2,doador:'maria',nome:'Ração para cães',cat:'racao',qtd:'5 kg',descricao:'Pacote fechado, validade em 2027.',cidade:'Itajubá',foto:'',status:'disponivel',ong:''},
  {id:3,doador:'maria',nome:'Casacos de inverno',cat:'roupas',qtd:'8 peças',descricao:'Adultos, lavados e em bom estado.',cidade:'Itajubá',foto:'',status:'pendente',ong:'esperanca'}]);
}

/* cabeçalho, rodapé e proteção de páginas (cada <body> tem data-pag e data-exige) */
const B=document.body.dataset,S=sessao();
if(B.exige&&(!S||(B.exige!=='todos'&&S.tipo!==B.exige)))location.replace('login.html');
const INICIO=!S?'index.html':S.tipo==='ong'?'home-ong.html':'home-doador.html';
const NAV={
 publica:'<a class="btn btn-claro" href="cadastro.html?tipo=doador">Sou doador</a><a class="btn btn-claro" href="cadastro.html?tipo=ong">Sou ONG</a><a class="btn" href="login.html">Entrar</a>',
 home:'<a class="btn btn-claro" href="perfil.html">Meu perfil</a><button class="btn" onclick="sair()">Sair</button>',
 interna:`<a class="btn btn-claro" href="${INICIO}">Voltar ao início</a><button class="btn" onclick="sair()">Sair</button>`,
 auth:'<a class="btn btn-claro" href="index.html">Voltar ao site</a>'};
document.body.insertAdjacentHTML('afterbegin',`<header class="topo"><a class="logo" href="${B.pag==='home'||B.pag==='interna'?INICIO:'index.html'}">DOA<span>Ê</span></a><nav>${NAV[B.pag]||''}</nav></header>`);
document.body.insertAdjacentHTML('beforeend','<footer class="rodape"><a href="termos.html">Termos de uso</a><a href="#">Instagram</a><a href="#">Facebook</a><p>DOAÊ, projeto acadêmico</p></footer>');

/* máscaras: formatam enquanto a pessoa digita */
const MASC={
 cpf:v=>num(v).slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'),
 cnpj:v=>num(v).slice(0,14).replace(/(\d{2})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d{1,2})$/,'$1-$2'),
 tel:v=>{v=num(v).slice(0,11);return v.length>10?v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3'):v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3').replace(/-$/,'')}};
document.addEventListener('input',e=>{const m=e.target.dataset?.m;if(m)e.target.value=MASC[m](e.target.value)});

/* validações */
function cpfOk(c){c=num(c);if(c.length!==11||/^(\d)\1+$/.test(c))return false;
 for(let t=9;t<11;t++){let s=0;for(let i=0;i<t;i++)s+=c[i]*(t+1-i);if(((s*10)%11)%10!=c[t])return false}return true}
function validar(i){const v=i.value.trim(),m=i.dataset.m;
 if(!v)return'Preencha este campo.';
 if(m==='cpf'&&!cpfOk(v))return'CPF inválido. Confira os números.';
 if(m==='cnpj'&&num(v).length!==14)return'O CNPJ deve ter 14 números.';
 if(m==='tel'&&num(v).length<10)return'Informe o telefone com DDD.';
 if(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(v))return'Informe um e-mail válido.';
 if(i.name==='senha'&&v.length<6)return'Use pelo menos 6 caracteres.';
 if(i.name==='senha2'&&v!==$('[name=senha]',i.form).value)return'As senhas não são iguais.';
 return''}
const erroCampo=(i,e)=>{const c=i.closest('.campo');c.classList.toggle('invalido',!!e);$('.erro',c).textContent=e};
function checar(form){let ok=true,primeiro;
 $$('input:not([type=file]):not([type=checkbox]):not([type=radio]),select,textarea',form).forEach(i=>{
  if(i.disabled||i.dataset.opc!==undefined)return;const e=validar(i);erroCampo(i,e);if(e){ok=false;primeiro??=i}});
 primeiro?.focus();return ok}
document.addEventListener('focusout',e=>{const i=e.target;
 if(i.form?.hasAttribute('data-valida')&&i.closest('.campo')&&i.dataset.opc===undefined&&i.type!=='file'&&!i.disabled)erroCampo(i,validar(i))});

/* peças de HTML reutilizáveis */
const campo=(id,rot,tipo='text',val='',m='',dica='')=>`<div class="campo"><label for="${id}">${rot}</label><input id="${id}" name="${id}" type="${tipo}" value="${esc(val)}" ${m?`data-m="${m}" inputmode="numeric"`:''}>${dica?`<span class="dica">${dica}</span>`:''}<span class="erro"></span></div>`;
const cartaoItem=(i,extra='',attr='')=>`<article class="item" ${attr}><div class="foto">${i.foto?`<img src="${i.foto}" alt="">`:`<span class="icone">${CAT[i.cat][0]}</span>`}</div><div class="corpo"><span class="selo ${i.status}">${STATUS[i.status]}</span><h3>${esc(i.nome)}</h3><p>${esc(i.qtd)}</p><p class="suave">${esc(i.cidade)}</p>${extra}</div></article>`;
const stats=(lista,S)=>`<div class="stats">${S.map(([k,r])=>`<div class="stat"><b>${lista.filter(i=>i.status===k).length}</b>${r}</div>`).join('')}</div>`;
