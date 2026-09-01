(function(){
  var nav=document.querySelector('.nav-list');
  if(!nav)return;

  var currentPage=document.body.dataset.page||'';
  function active(page){return currentPage===page?' active':''}
  function current(pages){return pages.indexOf(currentPage)!==-1?' nav-group-current':''}

  var chevron='<svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>';
  var loginIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path></svg>';
  var orderIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path></svg>';
  var returnIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 14 4 9l5-5"></path><path d="M4 9h10a6 6 0 0 1 6 6v5"></path></svg>';
  var inventoryIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"></path><path d="m4 7.5 8 4.5 8-4.5M12 12v9"></path></svg>';
  var systemIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20.3h-3v-.08a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.56-1.04h-.08v-3h.08A1.7 1.7 0 0 0 7 9.92a1.7 1.7 0 0 0-.34-1.88L6.6 7.98l2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.7 4.7v-.08h3v.08a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04h.08v3h-.08A1.7 1.7 0 0 0 19.4 15z"></path></svg>';
  var feeIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18M7 15h4"></path></svg>';
  var trayIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>';
  var gridIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>';
  var globalIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path></svg>';

  nav.setAttribute('aria-label','主导航');
  nav.innerHTML=
    '<div class="nav-section-label">全局说明</div>'
    +'<a class="nav-primary'+active('global-overview')+'" href="global-overview.html" data-nav="global-overview">'+globalIcon+'<span>全局说明</span></a>'
    +'<div class="nav-section-label nav-section-admin">管理端</div>'
    +'<a class="nav-primary'+active('login')+'" href="login.html" data-nav="login">'+loginIcon+'<span>登录</span></a>'
    +'<details class="nav-group'+current(['orders'])+'" open>'
      +'<summary class="nav-group-toggle">'+orderIcon+'<span>订单</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('orders')+'" href="order-management.html" data-nav="orders">订单管理</a></div>'
    +'</details>'
    +'<details class="nav-group'+current(['returns'])+'" open>'
      +'<summary class="nav-group-toggle">'+returnIcon+'<span>售后</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('returns')+'" href="returns.html" data-nav="returns">退货管理</a></div>'
    +'</details>'
    +'<details class="nav-group'+current(['sku','tray-management'])+'" open>'
      +'<summary class="nav-group-toggle">'+inventoryIcon+'<span>库存</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('sku')+'" href="index.html" data-nav="sku">库存管理</a><a class="nav-child'+active('tray-management')+'" href="cargo-tray-management.html" data-nav="tray-management">美国货盘管理</a></div>'
    +'</details>'
    +'<details class="nav-group'+current(['users'])+'" open>'
      +'<summary class="nav-group-toggle">'+systemIcon+'<span>系统</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('users')+'" href="user-management.html" data-nav="users">用户管理</a></div>'
    +'</details>'
    +'<details class="nav-group'+current(['fees'])+'" open>'
      +'<summary class="nav-group-toggle">'+feeIcon+'<span>费用</span>'+chevron+'</summary>'
      +'<div class="nav-children"><a class="nav-child'+active('fees')+'" href="fees.html" data-nav="fees">费用明细</a></div>'
    +'</details>'
    +'<div class="nav-section-label nav-section-public">公开界面</div>'
    +'<a class="nav-primary'+active('tray')+'" href="cargo-tray.html" data-nav="tray">'+trayIcon+'<span>美国货盘</span></a>'
    +'<a class="nav-primary'+active('tray-v2')+'" href="cargo-tray-v2.html" data-nav="tray-v2">'+gridIcon+'<span>美国货盘V2</span></a>';
  var activeItem=nav.querySelector('.active');
  if(activeItem)requestAnimationFrame(function(){activeItem.scrollIntoView({block:'nearest'})});
})();
