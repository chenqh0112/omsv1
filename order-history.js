(function(){
  var anchor=document.querySelector('[data-order-history-anchor]');
  if(!anchor)return;
  var currentUser=anchor.dataset.orderUser||'采购用户A';
  var orders=(window.OMS_ORDER_DATA||[]).filter(function(order){return order.userName===currentUser});
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]})}
  function money(value){return '$'+Number(value||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function statusClass(status){return 'order-status-'+({待确认:'pending',已确认:'confirmed',拣货中:'picking',已发货:'shipped',已签收:'signed',已取消:'cancelled'}[status]||'pending')}
  var button=document.createElement('button');
  button.className='order-history-trigger';
  button.type='button';
  button.title='我的订单';
  button.setAttribute('aria-label','查看我的订单');
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 2h9l4 4v16H6z"></path><path d="M14 2v5h5M9 12h7M9 16h7"></path></svg><span>'+orders.length+'</span>';
  anchor.insertBefore(button,anchor.firstChild);
  var overlay=document.createElement('div');
  overlay.className='modal-overlay';
  overlay.id='order-history-modal';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-labelledby','order-history-title');
  overlay.innerHTML='<div class="modal order-history-modal"><div class="modal-head"><div><h3 id="order-history-title">我的订单</h3><p>'+escapeHtml(currentUser)+' · 共 '+orders.length+' 笔</p></div><button class="close" type="button" aria-label="关闭">&times;</button></div><div class="modal-body"><div class="table-scroll"><table class="data-table order-history-table"><thead><tr><th>订单号</th><th>下单时间</th><th>SKU明细</th><th>订单金额</th><th>订单状态</th><th>物流单号</th></tr></thead><tbody>'+orders.map(function(order){return '<tr><td><code>'+order.id+'</code></td><td>'+order.createdAt+'</td><td><strong>'+escapeHtml(order.items[0].name)+'</strong><span>'+order.items.length+' 个SKU / '+order.items.reduce(function(sum,item){return sum+item.quantity},0)+' 件</span></td><td class="num"><strong>'+money(order.amount)+'</strong></td><td><span class="order-status '+statusClass(order.status)+'">'+order.status+'</span></td><td><code>'+(order.tracking||'-')+'</code></td></tr>'}).join('')+'</tbody></table></div></div><div class="modal-footer"><a class="btn btn-primary" href="order-management.html?user='+encodeURIComponent(currentUser)+'">查看全部订单</a></div></div>';
  document.body.appendChild(overlay);
  function close(){overlay.classList.remove('open')}
  button.addEventListener('click',function(){overlay.classList.add('open');overlay.querySelector('.close').focus()});
  overlay.querySelector('.close').addEventListener('click',close);
  overlay.addEventListener('click',function(event){if(event.target===overlay)close()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&overlay.classList.contains('open'))close()});
})();
