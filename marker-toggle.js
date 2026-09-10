(function(){
  function initMarkerToggle(){
  var buttons=document.querySelectorAll('.marker-toggle');
  var existing=buttons[0]||null;
  buttons.forEach(function(item,index){if(index>0)item.remove()});
  // The data attribute may be persisted in generated HTML, but event listeners are not.
  // Keep the idempotency guard on the live DOM node so every page load binds once.
  if(existing&&existing.__markerToggleBound)return;
  var pageKey=document.body.dataset.page||location.pathname;
  var visibilityKey='oms-page-markers-visible:'+pageKey;
  var positionKey='oms-marker-toggle-position';
  var visible=true;
  try{visible=localStorage.getItem(visibilityKey)!=='false'}catch(error){}

  var button=existing||document.createElement('button');
  if(!existing){
    button.type='button';
    button.className='marker-toggle';
    button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3"></path><circle cx="12" cy="12" r="4"></circle></svg><span></span>';
    document.body.appendChild(button);
  }
  if(!button.querySelector('span'))button.appendChild(document.createElement('span'));
  button.__markerToggleBound=true;
  button.dataset.markerToggleReady='true';

  function applyVisibility(nextVisible){
    visible=nextVisible;
    document.body.classList.toggle('page-markers-hidden',!visible);
    document.querySelectorAll('[data-html-annotator-inline-root]').forEach(function(root){
      root.style.display=visible?'':'none';
    });
    button.querySelector('span').textContent=visible?'关闭标记':'查看标记';
    button.setAttribute('aria-pressed',String(visible));
    button.title=visible?'关闭当前页面所有标记':'查看当前页面所有标记';
    try{localStorage.setItem(visibilityKey,String(visible))}catch(error){}
  }

  function clampTop(top){return Math.max(8,Math.min(window.innerHeight-button.offsetHeight-8,top))}
  function applySavedPosition(){
    var saved=null;
    try{saved=JSON.parse(localStorage.getItem(positionKey)||'null')}catch(error){}
    if(!saved)return;
    button.style.top=clampTop(Number(saved.top)||8)+'px';
    button.style.bottom='auto';
    if(saved.side==='left'){button.style.left='8px';button.style.right='auto'}else{button.style.right='8px';button.style.left='auto'}
  }

  var dragging=false,moved=false,startX=0,startY=0,startLeft=0,startTop=0,ignoreClick=false;
  button.addEventListener('pointerdown',function(event){
    if(event.button!==0)return;
    var rect=button.getBoundingClientRect();
    dragging=true;moved=false;startX=event.clientX;startY=event.clientY;startLeft=rect.left;startTop=rect.top;
    button.classList.add('dragging');button.setPointerCapture(event.pointerId);
  });
  button.addEventListener('pointermove',function(event){
    if(!dragging)return;
    var dx=event.clientX-startX,dy=event.clientY-startY;
    if(Math.abs(dx)>4||Math.abs(dy)>4)moved=true;
    if(!moved)return;
    button.style.left=Math.max(0,Math.min(window.innerWidth-button.offsetWidth,startLeft+dx))+'px';
    button.style.top=clampTop(startTop+dy)+'px';button.style.right='auto';button.style.bottom='auto';
  });
  button.addEventListener('pointerup',function(event){
    if(!dragging)return;
    dragging=false;button.classList.remove('dragging');button.releasePointerCapture(event.pointerId);
    if(!moved)return;
    var rect=button.getBoundingClientRect(),side=rect.left+rect.width/2<window.innerWidth/2?'left':'right',top=clampTop(rect.top);
    button.style.top=top+'px';button.style.bottom='auto';
    if(side==='left'){button.style.left='8px';button.style.right='auto'}else{button.style.right='8px';button.style.left='auto'}
    try{localStorage.setItem(positionKey,JSON.stringify({side:side,top:top}))}catch(error){}
    ignoreClick=true;setTimeout(function(){ignoreClick=false},0);
  });
  button.addEventListener('click',function(){if(!ignoreClick&&!moved)applyVisibility(!visible);moved=false});
  window.addEventListener('resize',applySavedPosition);
  applyVisibility(visible);applySavedPosition();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMarkerToggle);
  else initMarkerToggle();
})();
