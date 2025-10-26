// burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if(burger){ burger.onclick = ()=> nav.classList.toggle('active'); }

// header scroll color change
const header = document.getElementById('header');
window.addEventListener('scroll', ()=>{
  if(window.scrollY>50){ header.classList.add('scrolled'); }
  else{ header.classList.remove('scrolled'); }
});

// gallery change
function changeImage(el){
  const main=document.getElementById('main-img');
  main.src=el.src;
  document.querySelectorAll('.thumbs img').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
}
