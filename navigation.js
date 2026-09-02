(function(){
  var nav=document.querySelector('.nav-list');
  if(!nav)return;

  var currentPage=document.body.dataset.page||'';
  var ADMIN_SESSION_KEY='oms-admin-session';
  var publicPages=['login','tray-v2'];
  function readAdminSession(){try{return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY)||'null')}catch(error){return null}}
  function clearAdminSession(){sessionStorage.removeItem(ADMIN_SESSION_KEY)}
  var adminSession=readAdminSession();
  if(adminSession&&(!adminSession.expiresAt||adminSession.expiresAt<=Date.now())){
    clearAdminSession();adminSession=null;
  }
  function active(page){return currentPage===page?' active':''}
  function current(pages){return pages.indexOf(currentPage)!==-1?' nav-group-current':''}

  var chevron='<svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>';
  var orderIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path></svg>';
  var inventoryIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"></path><path d="m4 7.5 8 4.5 8-4.5M12 12v9"></path></svg>';
  var gridIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>';
  var globalIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path></svg>';

  nav.setAttribute('aria-label','主导航');
  nav.innerHTML=
    '<div class="nav-section-label">全局说明</div>'
    +'<a class="nav-primary'+active('global-overview')+'" href="global-overview.html" data-nav="global-overview">'+globalIcon+'<span>全局说明</span></a>'
    +'<div class="nav-section-label nav-section-admin">管理端</div>'
    +'<details class="nav-group'+current(['orders'])+'" open>'
      +'<summary class="nav-group-toggle">'+orderIcon+'<span>订单</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('orders')+'" href="order-management.html" data-nav="orders">订单管理</a></div>'
    +'</details>'
    +'<details class="nav-group'+current(['sku','tray-management'])+'" open>'
      +'<summary class="nav-group-toggle">'+inventoryIcon+'<span>库存</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('sku')+'" href="index.html" data-nav="sku">库存管理</a><a class="nav-child'+active('tray-management')+'" href="cargo-tray-management.html" data-nav="tray-management">美国货盘管理</a></div>'
    +'</details>'
    +'<div class="nav-section-label nav-section-public">前端界面</div>'
    +'<a class="nav-primary'+active('tray-v2')+'" href="cargo-tray-v2.html" data-nav="tray-v2">'+gridIcon+'<span>蜂鸟美国货盘页面</span></a>';
  var activeItem=nav.querySelector('.active');
  if(activeItem)requestAnimationFrame(function(){activeItem.scrollIntoView({block:'nearest'})});
  var footer=document.querySelector('.nav-footer');
  if(footer)footer.innerHTML='';
  return;
  if(publicPages.indexOf(currentPage)===-1){
    var footer=document.querySelector('.nav-footer');
    var session=adminSession||{userName:'管理员'};
    footer.innerHTML='<span class="nav-session-user">'+String(session.userName||'管理员').replace(/[&<>"]/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]})+'</span><button class="nav-logout" type="button">退出登录</button>';
    footer.querySelector('.nav-logout').addEventListener('click',function(){clearAdminSession();location.replace('login.html?reason=logout')});
  }
})();
