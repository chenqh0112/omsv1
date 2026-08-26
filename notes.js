(function(){
  var pageKey=document.body.dataset.page||'default';
  var pageNotes={
    sku:{title:'SKU管理注释'},
    inbound:{title:'入库单注释'},
    tray:{title:'美国货盘注释'},
    fees:{
      title:'费用注释',
      images:[
        {src:'assets/fee-note-container.png',alt:'集装箱入库费用参考',caption:'集装箱入库费用参考'},
        {src:'assets/fee-note-pallet.png',alt:'托盘入库费用参考',caption:'托盘入库费用参考'},
        {src:'assets/fee-note-loose-carton.png',alt:'散箱入库费用参考',caption:'散箱入库费用参考'},
        {src:'assets/fee-note-return.png',alt:'退货入库处理费参考',caption:'退货入库处理费参考'},
        {src:'assets/fee-note-storage.png',alt:'仓租费参考',caption:'仓租费参考'},
        {src:'assets/fee-note-packaging.png',alt:'包材费参考',caption:'包材费参考'}
      ]
    },
    login:{title:'登录注释'}
  };
  var note=pageNotes[pageKey]||{title:'当前菜单注释'};
  var topbarRight=document.querySelector('.topbar-right');
  if(!topbarRight)return;

  var button=document.createElement('button');
  button.className='btn btn-ghost notes-toggle';
  button.type='button';
  button.setAttribute('aria-label','查看注释');
  button.title='查看注释';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls','notes-panel');
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg><span>查看注释</span>';
  topbarRight.appendChild(button);

  var panel=document.createElement('aside');
  panel.className='notes-panel';
  panel.id='notes-panel';
  panel.setAttribute('aria-label',note.title);
  var content='<div class="notes-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg><p>当前菜单暂无注释</p></div>';
  if(note.images){
    content='<div class="notes-gallery">'+note.images.map(function(item,index){
      return '<button class="notes-image-card" type="button" data-note-image="'+index+'" aria-label="预览'+item.caption+'"><img src="'+item.src+'" alt="'+item.alt+'"><span>'+item.caption+'</span></button>';
    }).join('')+'</div>';
  }
  panel.innerHTML='<div class="notes-panel-head"><h2>'+note.title+'</h2><button class="notes-close" type="button" aria-label="收起注释" title="收起注释">&times;</button></div><div class="notes-content">'+content+'</div>';
  document.body.appendChild(panel);

  var backdrop=document.createElement('div');
  backdrop.className='notes-backdrop';
  document.body.appendChild(backdrop);

  var preview=document.createElement('div');
  preview.className='notes-preview';
  preview.setAttribute('role','dialog');
  preview.setAttribute('aria-modal','true');
  preview.setAttribute('aria-label','图片预览');
  preview.innerHTML='<button class="notes-preview-close" type="button" aria-label="关闭图片预览" title="关闭">&times;</button><img alt=""><div class="notes-preview-caption"></div>';
  document.body.appendChild(preview);

  function openNotes(){
    document.body.classList.add('notes-open');
    button.setAttribute('aria-expanded','true');
  }
  function closeNotes(){
    document.body.classList.remove('notes-open');
    button.setAttribute('aria-expanded','false');
  }
  function closePreview(){preview.classList.remove('open')}

  button.addEventListener('click',function(){
    if(document.body.classList.contains('notes-open'))closeNotes();else openNotes();
  });
  panel.querySelector('.notes-close').addEventListener('click',closeNotes);
  backdrop.addEventListener('click',closeNotes);
  panel.addEventListener('click',function(event){
    var card=event.target.closest('[data-note-image]');
    if(!card||!note.images)return;
    var item=note.images[parseInt(card.dataset.noteImage,10)];
    preview.querySelector('img').src=item.src;
    preview.querySelector('img').alt=item.alt;
    preview.querySelector('.notes-preview-caption').textContent=item.caption;
    preview.classList.add('open');
    preview.querySelector('.notes-preview-close').focus();
  });
  preview.addEventListener('click',function(event){if(event.target===preview||event.target.classList.contains('notes-preview-close'))closePreview()});
  document.addEventListener('keydown',function(event){
    if(event.key!=='Escape')return;
    if(preview.classList.contains('open'))closePreview();else if(document.body.classList.contains('notes-open'))closeNotes();
  });
})();
