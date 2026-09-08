(function(){
  var importStep=1;
  var importOrders=[];
  var importSkuData=(window.OMS_SKU_DATA||[]).slice();
  var importLinkTarget=null;

  function escapeValue(value){return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]})}
  function money(value){return '$'+Number(value||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function sampleOrders(){
    var first=importSkuData[0],second=importSkuData[1],third=importSkuData[2];
    if(!first)return [];
    function item(source,quantity){return {platformSku:source.barcode,sku:source.barcode,matchedSku:source.barcode,productId:source.id||'',name:source.name,spec:source.spec,img:source.img,quantity:quantity,unitPrice:source.unitPrice,subtotal:Number((source.unitPrice*quantity).toFixed(2))}}
    var unmatched={platformSku:'AMZ-UNKNOWN-01',sku:'AMZ-UNKNOWN-01',name:'平台待匹配商品',spec:'默认规格',img:first.img,quantity:2,unitPrice:0,subtotal:0,matchedSku:'',productId:''};
    return [
      {orderNo:'AMZ-20260902-001',platform:'亚马逊',amount:'',recipient:'Olivia Chen',phone:'+1 512 555 1001',address:'Austin, TX 78701',items:[item(first,8),unmatched]},
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
    if(!importOrders.length)importOrders=sampleOrders();
    var unmatchedOnly=document.getElementById('order-import-unmatched').checked;
    var rows=importOrders.filter(function(order){return !unmatchedOnly||order.items.some(function(item){return !item.matchedSku})});
    document.getElementById('order-import-preview-count').textContent=rows.length+' 笔订单';
    document.getElementById('order-import-preview-body').innerHTML=rows.length?rows.map(function(order){var hasUnmatched=order.items.some(function(item){return !item.matchedSku});var status=hasUnmatched?'<span class="v2-match-pending">待关联</span>':'<span class="v2-match-ok">已关联</span>';var linked=order.items.filter(function(item){return item.matchedSku}).map(function(item){return '<code>'+escapeValue(item.matchedSku)+'</code>'}).join('<br>');var actions=order.items.map(function(item,index){return item.matchedSku?'<span class="muted">-</span>':'<button class="btn-link v2-link-sku" type="button" data-link-order="'+escapeValue(order.orderNo)+'" data-link-item="'+index+'">关联</button>'}).join('<br>');return '<tr><td><code class="v2-import-order-id">'+escapeValue(order.orderNo)+'</code></td><td><div class="v2-import-sku-list">'+order.items.map(function(item){return '<div class="v2-import-sku-item"><img src="'+escapeValue(item.img)+'" alt=""><span><strong>'+escapeValue(item.name)+'</strong><small>'+escapeValue(item.spec)+' · '+escapeValue(item.sku)+'</small></span></div>'}).join('')+'</div></td><td>'+order.items.reduce(function(sum,item){return sum+item.quantity},0)+' 件</td><td>'+escapeValue(order.platform)+'</td><td>'+(order.amount===''?'<span class="muted">—</span>':money(order.amount))+'</td><td>'+escapeValue(order.recipient)+'</td><td><div class="v2-import-address">'+escapeValue(order.address)+'</div></td><td>'+status+(linked?'<div class="v2-linked-skus">'+linked+'</div>':'')+'</td><td>'+actions+'</td></tr>'}).join(''):'<tr><td colspan="9" class="mark-table-empty">暂无匹配订单</td></tr>';
  }
  function openLink(orderNo,index){importLinkTarget={orderNo:orderNo,index:index};var list=document.getElementById('order-import-product-list');list.innerHTML=importSkuData.map(function(item){return '<button class="v2-import-product-option" type="button" data-link-sku="'+escapeValue(item.barcode)+'"><img src="'+escapeValue(item.img)+'" alt=""><span><strong>'+escapeValue(item.name)+'</strong><small>'+escapeValue(item.spec)+' · '+escapeValue(item.barcode)+'</small></span></button>'}).join('');document.getElementById('order-import-link-modal').classList.add('open')}
  function closeLink(){document.getElementById('order-import-link-modal').classList.remove('open');importLinkTarget=null}
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
      var productAmount=source.items.reduce(function(sum,item){return sum+Number(item.subtotal||0)},0);
      var order={id:orderNo,localOrderNo:orderNo,omsOrderNo:'',idempotencyKey:'ORDER-'+orderNo,userId:'USR-1001',userName:'订单导入',createdAt:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'),items:source.items,productAmount:productAmount,operationFee:0,logisticsFee:0,salesPrice:amount,salesShipping:0,salesTotal:amount,cargoPrice:productAmount,cargoShipping:0,cargoTotal:productAmount,amount:amount,feeSnapshot:{shipping:0,oms:0,total:amount,logistics:logistics},status:source.items.some(function(item){return !item.matchedSku})?'待关联':'待分配仓库',reviewReasons:[],logistics:logistics,tracking:'',packages:[{packageNo:'PKG-'+String(now+index).slice(-10),logistics:logistics,tracking:'',status:'待分配仓库'}],recipient:source.recipient,phone:source.phone,address:source.address};
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
  document.getElementById('order-import-unmatched').addEventListener('change',renderImportPreview);
  document.getElementById('order-import-preview-body').addEventListener('click',function(event){var button=event.target.closest('[data-link-order]');if(button)openLink(button.dataset.linkOrder,Number(button.dataset.linkItem))});
  document.getElementById('order-import-product-list').addEventListener('click',function(event){var button=event.target.closest('[data-link-sku]');if(!button||!importLinkTarget)return;var order=importOrders.find(function(entry){return entry.orderNo===importLinkTarget.orderNo});var product=importSkuData.find(function(entry){return entry.barcode===button.dataset.linkSku});if(order&&product){var target=order.items[importLinkTarget.index];if(!target.platformSku)target.platformSku=target.sku||'';target.matchedSku=product.barcode;target.sku=product.barcode;target.productId=product.id||'';target.name=product.name;target.spec=product.spec;target.img=product.img;target.unitPrice=product.unitPrice;target.subtotal=Number((product.unitPrice*target.quantity).toFixed(2));renderImportPreview();closeLink();showToast('SKU 关联成功')}});
  window.openOrderSkuLink=function(orderId,index){var order=window.orderData&&window.orderData.find(function(entry){return entry.id===orderId});if(!order)return;importOrders=[order];openLink(order.localOrderNo||order.id,index)};
  document.getElementById('order-import-link-close').addEventListener('click',closeLink);document.getElementById('order-import-link-cancel').addEventListener('click',closeLink);
  document.getElementById('order-import-file').addEventListener('change',function(){var file=this.files&&this.files[0];if(!file)return;document.getElementById('order-import-file-name').textContent=file.name;showToast('文件已选择，可继续下一步')});
  document.addEventListener('keydown',function(event){if(event.key==='Escape')closeImport()});
})();
