(function(){
  var importStep=1;
  var importOrders=[];
  var importSkuData=(window.OMS_SKU_DATA||[]).slice();

  function escapeValue(value){return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]})}
  function money(value){return '$'+Number(value||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function sampleOrders(){
    var first=importSkuData[0],second=importSkuData[1],third=importSkuData[2];
    if(!first)return [];
    function item(source,quantity){return {sku:source.barcode,name:source.name,spec:source.spec,img:source.img,quantity:quantity,unitPrice:source.unitPrice,subtotal:Number((source.unitPrice*quantity).toFixed(2))}}
    return [
      {orderNo:'AMZ-20260902-001',platform:'亚马逊',amount:'',recipient:'Olivia Chen',phone:'+1 512 555 1001',address:'Austin, TX 78701',items:[item(first,8)]},
      {orderNo:'WM-20260902-018',platform:'沃尔玛',amount:Number(((second?second.unitPrice:0)*4+(third?third.unitPrice:0)*3).toFixed(2)),recipient:'Daniel Lee',phone:'+1 512 555 1002',address:'Irvine, CA 92612',items:second&&third?[item(second,4),item(third,3)]:[item(first,6)]}
    ];
  }
  function setImportStep(step){
    importStep=Math.max(1,Math.min(2,step));
    document.querySelectorAll('[data-order-import-panel]').forEach(function(panel){panel.hidden=Number(panel.dataset.orderImportPanel)!==importStep});
    document.querySelectorAll('[data-order-import-step-indicator]').forEach(function(indicator){var value=Number(indicator.dataset.orderImportStepIndicator);indicator.classList.toggle('active',value===importStep);indicator.classList.toggle('done',value<importStep)});
    document.getElementById('order-import-back').hidden=importStep===1;
    document.getElementById('order-import-next').hidden=importStep===2;
    document.getElementById('order-import-submit').hidden=importStep!==2;
    document.getElementById('order-import-title').textContent=importStep===1?'订单导入':'订单预览';
  }
  function renderImportPreview(){
    importOrders=sampleOrders();
    document.getElementById('order-import-preview-count').textContent=importOrders.length+' 笔订单';
    document.getElementById('order-import-preview-body').innerHTML=importOrders.map(function(order){return '<tr><td><code class="v2-import-order-id">'+escapeValue(order.orderNo)+'</code></td><td><div class="v2-import-sku-list">'+order.items.map(function(item){return '<div class="v2-import-sku-item"><img src="'+escapeValue(item.img)+'" alt=""><span><strong>'+escapeValue(item.name)+'</strong><small>'+escapeValue(item.spec)+' · '+escapeValue(item.sku)+'</small></span></div>'}).join('')+'</div></td><td>'+order.items.reduce(function(sum,item){return sum+item.quantity},0)+' 件</td><td>'+escapeValue(order.platform)+'</td><td>'+(order.amount===''?'<span class="muted">—</span>':money(order.amount))+'</td><td>'+escapeValue(order.recipient)+'</td><td><div class="v2-import-address">'+escapeValue(order.address)+'</div></td></tr>'}).join('');
  }
  function openImport(){
    importStep=1;importOrders=[];document.getElementById('order-import-file').value='';document.getElementById('order-import-file-name').textContent='尚未选择文件';setImportStep(1);document.getElementById('order-import-modal').classList.add('open');
  }
  function closeImport(){document.getElementById('order-import-modal').classList.remove('open')}
  function createImportedOrders(){
    if(!importOrders.length){showToast('没有可创建的订单','warning');return}
    var logistics='待分配物流';
    var now=Date.now(),saved=[];try{saved=JSON.parse(localStorage.getItem('oms-v2-created-orders')||'[]')}catch(error){}
    var created=[];
    importOrders.forEach(function(source,index){
      var orderNo='IMP-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+String(now+index).slice(-6);
      var amount=source.amount===''?0:Number(source.amount);
      var order={id:orderNo,localOrderNo:orderNo,omsOrderNo:'',idempotencyKey:'ORDER-'+orderNo,userId:'USR-1001',userName:'订单导入',createdAt:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'),items:source.items,productAmount:amount,operationFee:0,logisticsFee:0,amount:amount,feeSnapshot:{shipping:0,oms:0,total:amount,logistics:logistics},status:'待分配仓库',reviewReasons:[],logistics:logistics,tracking:'',packages:[{packageNo:'PKG-'+String(now+index).slice(-10),logistics:logistics,tracking:'',status:'待分配仓库'}],recipient:source.recipient,phone:source.phone,address:source.address};
      if(!saved.some(function(item){return item.idempotencyKey===order.idempotencyKey})){saved.unshift(order);created.unshift(order)}
    });
    try{localStorage.setItem('oms-v2-created-orders',JSON.stringify(saved))}catch(error){showToast('订单创建失败，请稍后重试','warning');return}
    created.forEach(function(order){orderData.unshift(order)});
    updateOrderStats();applyOrderFilters();closeImport();showToast('订单创建成功');
  }
  document.getElementById('order-import-open').addEventListener('click',openImport);
  document.getElementById('order-import-close').addEventListener('click',closeImport);
  document.getElementById('order-import-cancel').addEventListener('click',closeImport);
  document.getElementById('order-import-modal').addEventListener('click',function(event){if(event.target===this)closeImport()});
  document.getElementById('order-import-next').addEventListener('click',function(){if(importStep===1){renderImportPreview();setImportStep(2)}});
  document.getElementById('order-import-back').addEventListener('click',function(){setImportStep(importStep-1)});
  document.getElementById('order-import-submit').addEventListener('click',createImportedOrders);
  document.getElementById('order-import-file').addEventListener('change',function(){var file=this.files&&this.files[0];if(!file)return;document.getElementById('order-import-file-name').textContent=file.name;showToast('文件已选择，可继续下一步')});
  document.addEventListener('keydown',function(event){if(event.key==='Escape')closeImport()});
})();
