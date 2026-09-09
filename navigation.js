(function(){
  var nav=document.querySelector('.nav-list');
  if(!nav)return;

  var currentPage=document.body.dataset.page||'';
  var markerStyle=document.createElement('link');markerStyle.rel='stylesheet';markerStyle.href='marker-toggle.css';document.head.appendChild(markerStyle);
  var markerScript=document.createElement('script');markerScript.src='marker-toggle.js';document.body.appendChild(markerScript);
  if(currentPage==='inbound'||currentPage==='packaging-shipping'){
    var notesScript=document.createElement('script');notesScript.src='notes.js';document.body.appendChild(notesScript);
  }
  if(currentPage==='packaging-shipping'){var bmStyle=document.createElement('link');bmStyle.rel='stylesheet';bmStyle.href='packaging-bm.css';document.head.appendChild(bmStyle)}
  if(currentPage==='packaging-shipping'){
    var headModal=document.getElementById('head-modal');
    var headBar=headModal&&headModal.querySelector('.modal-head');
    if(headBar&&!headBar.querySelector('.head-modal-actions')){
      var actions=document.createElement('div');actions.className='head-modal-actions';actions.innerHTML='<button class="btn btn-ghost">下载</button><button class="btn btn-ghost head-return">返回</button>';headBar.appendChild(actions);
    }
    if(headModal){
      var returnButton=headModal.querySelector('.head-return');
      if(returnButton)returnButton.addEventListener('click',function(){headModal.classList.remove('open')});
      var receiving=headModal.querySelector('.inline-fields');
      if(receiving){var selects=receiving.querySelectorAll('select');['海外仓','美国','美国货盘'].forEach(function(label,index){if(selects[index]){selects[index].innerHTML='';var option=document.createElement('option');option.textContent=label;selects[index].appendChild(option)}})}
      var headBox=headModal.querySelector('.head-box');
      if(headBox){
        var trayEntry=headBox.querySelector('.head-tray-entry');if(trayEntry)trayEntry.remove();
        var boxHeading=headBox.querySelector('h3');
        if(boxHeading&&!boxHeading.querySelector('.head-pack-handler'))boxHeading.innerHTML='装箱信息 <span class="head-pack-handler">打包处理人: 123@123.com(1)</span>';
        var boxToolbar=headBox.querySelector('.head-toolbar');
        if(boxToolbar&&!boxToolbar.querySelector('.head-box-extra')){
          var toolbarButtons=boxToolbar.querySelectorAll('button');if(toolbarButtons[0]&&toolbarButtons[0].textContent.trim()==='分仓')toolbarButtons[0].remove();
          toolbarButtons=boxToolbar.querySelectorAll('button');if(toolbarButtons[1])toolbarButtons[1].textContent='打印标签';
          var extra=document.createElement('div');extra.className='head-box-extra';extra.innerHTML='<label>真空袋 <input type="number" value="0" min="0"></label><label class="head-radio"><input type="radio" name="vacuum-bag" disabled> 需要</label><label class="head-radio active"><input type="radio" name="vacuum-bag" checked> 不需要</label><button class="btn btn-ghost head-add-box" type="button">＋ 加箱子</button><input class="head-box-count" type="number" value="1" min="1" aria-label="箱子数量">';boxToolbar.appendChild(extra);
          var boxHeader=document.createElement('div');boxHeader.className='head-box-header';headBox.insertBefore(boxHeader,boxHeading);boxHeader.appendChild(boxHeading);boxHeader.appendChild(boxToolbar);
        }
        var boxTable=headBox.querySelector('.data-table');
        if(boxTable&&!boxTable.dataset.enhanced){
          boxTable.dataset.enhanced='true';boxTable.innerHTML='<thead><tr><th>图片</th><th>基本信息</th><th>数量</th><th>箱子1</th></tr></thead><tbody><tr><td><img class="head-product-image" src="img1.jpg" alt="商品图片"></td><td><div class="head-product-info">asin：X015623256<br>fnsku：X015623256<br>颜色：camel<br>尺码类型：MD<br>尺码：30x29x14cm</div></td><td>1</td><td><div class="head-cell-input"><input type="number" value="1" min="0"><button type="button">＋</button></div></td></tr><tr><td></td><td>总数</td><td>1</td><td>1</td></tr><tr><td></td><td></td><td>重量/kg<br><em>重量/磅</em></td><td><input class="head-measure-input" type="number" value="1"><strong class="head-red-value">2.2</strong></td></tr><tr><td></td><td></td><td>尺寸/cm3<br><em>英寸/in</em></td><td><div class="head-dim-inputs"><input type="number" value="1"><input type="number" value="1"><input type="number" value="1"></div><strong class="head-red-value">0.4 * 0.4 * 0.4</strong></td></tr></tbody>';
          var packGrid=document.createElement('div');packGrid.className='head-pack-grid';headBox.insertBefore(packGrid,boxTable);packGrid.appendChild(boxTable);
        }
      }
      function openHeadUploadModal(){
        var uploadModal=document.getElementById('head-upload-modal');
        if(!uploadModal){
          document.body.insertAdjacentHTML('beforeend','<div class="modal-overlay head-upload-overlay" id="head-upload-modal"><div class="head-upload-modal" role="dialog" aria-modal="true" aria-labelledby="head-upload-title"><div class="head-upload-header"><h3 id="head-upload-title">上传箱标</h3><button type="button" class="head-upload-close" aria-label="关闭">×</button></div><div class="head-upload-body"><section class="head-upload-section"><h4>地址信息</h4><div class="head-upload-selects"><label><b>*</b>货仓类型<select><option>海外仓</option></select></label><select aria-label="国家"><option>美国</option></select><select aria-label="仓库"><option>海外仓AAZZ</option></select><button type="button" class="head-upload-plus">＋</button></div><p class="head-upload-warning">非（美国）费用较高,不推荐</p><div class="head-upload-address">(详细地址及邮编，<em>请仔细核对</em>)<br>州：海外仓州<br>城市：海外仓城市<br>邮编：4海外仓邮编<br>地址：海外仓地址</div></section><section class="head-upload-section"><h4>物流计划</h4><p class="head-upload-note">● 物流中心优先根据主计划进行拼单，当主计划无法拼单时，再根据备选1，备选2进行拼单</p><label class="head-upload-logistics">* 物流方式<select><option>海运</option></select></label><div class="head-plan-grid"><div>计划名称</div><div>派送方式</div><div>物流渠道</div><strong>主计划<br><em>(必填)</em></strong><select><option>UPS派</option></select><select><option>普船</option></select><strong>备选1<br>(选填)</strong><select disabled><option>请选择派送方式</option></select><select disabled><option>请选择物流渠道</option></select><strong>备选2<br>(选填)</strong><select disabled><option>请选择派送方式</option></select><select disabled><option>请选择物流渠道</option></select></div></section><div class="head-upload-track"><label>* 追踪编号<input placeholder="8位货件追踪编号"></label><small>请输入货件追踪编号，可以亚马逊后台获得</small><label class="head-upload-check"><input type="checkbox"> 允许重量不足单独发走</label></div></div><div class="head-upload-footer"><button type="button" class="btn btn-ghost head-upload-cancel">关闭</button><button type="button" class="btn btn-primary">上传箱标文件</button></div></div></div>');
          uploadModal=document.getElementById('head-upload-modal');
          uploadModal.querySelector('.head-upload-close').addEventListener('click',function(){uploadModal.classList.remove('open')});
          uploadModal.querySelector('.head-upload-cancel').addEventListener('click',function(){uploadModal.classList.remove('open')});
          uploadModal.addEventListener('click',function(event){if(event.target===uploadModal)uploadModal.classList.remove('open')});
        }
        uploadModal.classList.add('open');
      }
      var aside=headModal.querySelector('.head-content aside');
      if(aside&&!aside.querySelector('.head-label-actions')){
        var asideButtons=aside.querySelectorAll(':scope > button');
        if(asideButtons.length>=3){
          var actionRow=document.createElement('div');actionRow.className='head-label-actions';
          var label=document.createElement('span');label.className='head-label-name';label.textContent='箱标';actionRow.appendChild(label);
          var upload=asideButtons[0],print=asideButtons[1],download=asideButtons[2];
          upload.classList.add('head-upload');upload.textContent='上传';
          print.classList.add('head-outline-action');print.textContent='打印';
          download.classList.add('head-outline-action');download.textContent='下载';
          var help=document.createElement('button');help.type='button';help.className='head-help';help.textContent='?';help.setAttribute('aria-label','箱标帮助');help.title='上传箱标文件';
          aside.insertBefore(actionRow,upload);actionRow.appendChild(upload);actionRow.appendChild(help);actionRow.appendChild(print);actionRow.appendChild(download);
          upload.addEventListener('click',function(){openHeadUploadModal()});
        }
      }
    }
  }
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
  var logisticsIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"></path><circle cx="7" cy="19" r="2"></circle><circle cx="18" cy="19" r="2"></circle></svg>';
  var globalIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path></svg>';

  var brand=document.querySelector('.nav-brand');
  if(brand)brand.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22V12h6v10"></path></svg><span>工作管理平台</span>';
  nav.setAttribute('aria-label','主导航');
  nav.innerHTML=
    '<a class="nav-primary'+active('global-overview')+'" href="global-overview.html" data-nav="global-overview" title="全局说明">'+globalIcon+'<span>全局说明</span></a>'
    +'<div class="nav-group nav-hover-group'+current(['orders','sku','tray-management','inbound'])+'">'
      +'<div class="nav-group-toggle" tabindex="0" title="海外仓">'+inventoryIcon+'<span>海外仓</span>'+chevron+'</div>'
      +'<div class="nav-children"><a class="nav-child'+active('inbound')+'" href="inbound.html" data-nav="inbound">入库单管理</a><a class="nav-child'+active('orders')+'" href="order-management.html" data-nav="orders">订单管理</a><a class="nav-child'+active('sku')+'" href="index.html" data-nav="sku">库存管理</a><a class="nav-child'+active('tray-management')+'" href="cargo-tray-management.html" data-nav="tray-management">美国货盘管理</a></div>'
    +'</div>'
    +'<div class="nav-group nav-hover-group'+current(['packaging-shipping'])+'">'
      +'<div class="nav-group-toggle" tabindex="0" title="物流中心">'+logisticsIcon+'<span>物流中心</span>'+chevron+'</div>'
      +'<div class="nav-children"><a class="nav-child'+active('packaging-shipping')+'" href="packaging-shipping.html" data-nav="packaging-shipping">包装发货</a></div>'
    +'</div>'
    +'<a class="nav-primary'+active('tray-v2')+'" href="cargo-tray-v2.html" data-nav="tray-v2" title="美国货盘">'+gridIcon+'<span>美国货盘</span></a>';
  nav.querySelectorAll('.nav-hover-group .nav-group-toggle').forEach(function(toggle){
    toggle.addEventListener('click',function(event){
      event.stopPropagation();
      var group=toggle.parentElement;
      nav.querySelectorAll('.nav-hover-group.open').forEach(function(item){if(item!==group)item.classList.remove('open')});
      group.classList.toggle('open');
    });
  });
  document.addEventListener('click',function(event){if(!event.target.closest('.nav-hover-group'))nav.querySelectorAll('.nav-hover-group.open').forEach(function(item){item.classList.remove('open')})});
  var activeItem=nav.querySelector('.active');
  if(activeItem)requestAnimationFrame(function(){activeItem.scrollIntoView({block:'nearest'})});
  var topbarLeft=document.querySelector('.topbar-left');
  if(topbarLeft&&!topbarLeft.querySelector('.bm-search')){
    var search=document.createElement('label');
    search.className='bm-search';
    search.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg><input type="search" placeholder="请输入菜单" aria-label="搜索菜单">';
    topbarLeft.insertBefore(search,topbarLeft.firstChild);
  }
  var pageTabNames={inbound:'入库单管理',orders:'订单管理',sku:'库存管理','tray-management':'美国货盘管理'};
  if(pageTabNames[currentPage]){
    var topbar=document.querySelector('.topbar');
    if(topbar&&!document.querySelector('.bm-page-tabs')){
      var pageTabs=document.createElement('div');pageTabs.className='bm-page-tabs';
      pageTabs.innerHTML='<div class="bm-page-tab active">'+pageTabNames[currentPage]+'<button type="button" aria-label="关闭页面标签">×</button></div>';
      topbar.insertAdjacentElement('afterend',pageTabs);
    }
  }
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
