(() => {
 const btn=document.querySelector(".menu-toggle"),menu=document.querySelector(".mobile-menu");if(!btn||!menu)return;
 btn.addEventListener("click",()=>{const open=menu.classList.toggle("open");btn.setAttribute("aria-expanded",open);btn.setAttribute("aria-label",open?"Close navigation":"Open navigation");menu.setAttribute("aria-hidden",!open)});
 menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Open navigation")}));
})();