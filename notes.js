(function(){
  var NOTES_WIDTH_KEY='oms-notes-panel-width';
  var NOTES_BUTTON_POSITION_KEY='oms-notes-button-position';
  var NOTES_MIN_WIDTH=320;

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  function renderInline(value){
    return escapeHtml(value).replace(/`([^`]+)`/g,'<code>$1</code>');
  }

  function splitTableRow(line){
    return line.trim().replace(/^\||\|$/g,'').split('|').map(function(cell){return cell.trim()});
  }

  function isTableDivider(line){
    var cells=splitTableRow(line);
    return cells.length>0&&cells.every(function(cell){return /^:?-{3,}:?$/.test(cell)});
  }

  function renderNoteMarkdown(markdown){
    var lines=markdown.replace(/\r/g,'').split('\n');
    var html=[];
    var index=0;
    while(index<lines.length){
      var line=lines[index].trim();
      if(!line){index++;continue}

      var heading=line.match(/^(#{1,3})\s+(.+)$/);
      if(heading){
        var level=heading[1].length;
        html.push('<h'+level+'>'+renderInline(heading[2])+'</h'+level+'>');
        index++;
        continue;
      }

      if(line.charAt(0)==='|'&&index+1<lines.length&&isTableDivider(lines[index+1])){
        var headers=splitTableRow(line);
        var rows=[];
        index+=2;
        while(index<lines.length&&lines[index].trim().charAt(0)==='|'){
          rows.push(splitTableRow(lines[index]));
          index++;
        }
        html.push('<div class="notes-table-wrap"><table><thead><tr>'+headers.map(function(cell){return '<th>'+renderInline(cell)+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return '<tr>'+row.map(function(cell){return '<td>'+renderInline(cell)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>');
        continue;
      }

      if(/^[-]\s+/.test(line)){
        var bullets=[];
        while(index<lines.length&&/^[-]\s+/.test(lines[index].trim())){
          bullets.push(lines[index].trim().replace(/^[-]\s+/,''));
          index++;
        }
        html.push('<ul>'+bullets.map(function(item){return '<li>'+renderInline(item)+'</li>'}).join('')+'</ul>');
        continue;
      }

      if(/^\d+\.\s+/.test(line)){
        var steps=[];
        while(index<lines.length&&/^\d+\.\s+/.test(lines[index].trim())){
          steps.push(lines[index].trim().replace(/^\d+\.\s+/,''));
          index++;
        }
        html.push('<ol>'+steps.map(function(item){return '<li>'+renderInline(item)+'</li>'}).join('')+'</ol>');
        continue;
      }

      html.push('<p>'+renderInline(line)+'</p>');
      index++;
    }
    return '<article class="notes-document">'+html.join('')+'</article>';
  }

  var pageKey=document.body.dataset.page||'default';
  var pageNotes={
    sku:{title:'库存管理注释',markdown:'SKU管理页PRD.md'},
    inbound:{title:'入库单注释'},
    tray:{title:'美国货盘注释',markdown:'美国货盘页PRD.md'},
    'tray-v2':{title:'美国货盘V2注释',markdown:'美国货盘V2页PRD.md'},
    orders:{title:'订单管理注释',markdown:'订单管理页PRD.md'},
    'tray-management':{title:'美国货盘管理注释',markdown:'美国货盘管理页PRD.md'},
    users:{title:'用户管理注释',markdown:'用户管理页PRD.md'},
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

  function getMaxNotesWidth(){
    return Math.max(NOTES_MIN_WIDTH,Math.min(900,window.innerWidth-560));
  }

  function clampNotesWidth(value){
    return Math.min(getMaxNotesWidth(),Math.max(NOTES_MIN_WIDTH,Math.round(value)));
  }

  function readNotesWidth(){
    try{return clampNotesWidth(parseInt(localStorage.getItem(NOTES_WIDTH_KEY),10)||420)}catch(error){return 420}
  }

  function applyNotesWidth(value,save){
    var width=clampNotesWidth(value);
    document.documentElement.style.setProperty('--notes-panel-w',width+'px');
    if(panel){
      var resizer=panel.querySelector('.notes-resizer');
      if(resizer)resizer.setAttribute('aria-valuenow',String(width));
    }
    if(save){try{localStorage.setItem(NOTES_WIDTH_KEY,String(width))}catch(error){}}
    return width;
  }

  applyNotesWidth(readNotesWidth(),false);

  var button=document.createElement('button');
  button.className='btn btn-ghost notes-toggle notes-toggle-floating';
  button.type='button';
  button.setAttribute('aria-label','查看注释');
  button.title='查看注释';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls','notes-panel');
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg><span>查看注释</span>';
  document.body.appendChild(button);

  var panel=document.createElement('aside');
  panel.className='notes-panel';
  panel.id='notes-panel';
  panel.setAttribute('aria-label',note.title);
  var content='<div class="notes-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg><p>当前菜单暂无注释</p></div>';
  if(note.markdown)content='<div class="notes-loading">正在加载 PRD...</div>';
  if(note.images){
    content='<div class="notes-gallery">'+note.images.map(function(item,index){
      return '<button class="notes-image-card" type="button" data-note-image="'+index+'" aria-label="预览'+item.caption+'"><img src="'+item.src+'" alt="'+item.alt+'"><span>'+item.caption+'</span></button>';
    }).join('')+'</div>';
  }
  panel.innerHTML='<div class="notes-resizer" role="separator" tabindex="0" aria-label="调整注释区域宽度" aria-orientation="vertical" aria-valuemin="'+NOTES_MIN_WIDTH+'" aria-valuemax="'+getMaxNotesWidth()+'"></div><div class="notes-panel-head"><h2>'+note.title+'</h2><button class="notes-close" type="button" aria-label="收起注释" title="收起注释">&times;</button></div><div class="notes-content">'+content+'</div>';
  document.body.appendChild(panel);
  applyNotesWidth(readNotesWidth(),false);

  function readNotesButtonPosition(){
    try{
      var value=JSON.parse(localStorage.getItem(NOTES_BUTTON_POSITION_KEY)||'null');
      return value&&Number.isFinite(value.left)&&Number.isFinite(value.top)?value:null;
    }catch(error){return null}
  }

  var savedButtonPosition=readNotesButtonPosition();
  function applyNotesButtonPosition(position,save){
    if(!position){
      button.style.removeProperty('left');
      button.style.removeProperty('top');
      button.style.removeProperty('right');
      button.style.removeProperty('transform');
      return;
    }
    var rect=button.getBoundingClientRect();
    var panelSpace=document.body.classList.contains('notes-open')&&window.innerWidth>768?readNotesWidth()+16:16;
    var maxLeft=Math.max(8,window.innerWidth-panelSpace-rect.width);
    var maxTop=Math.max(8,window.innerHeight-rect.height-8);
    var next={left:Math.min(maxLeft,Math.max(8,Math.round(position.left))),top:Math.min(maxTop,Math.max(8,Math.round(position.top)))};
    button.style.left=next.left+'px';
    button.style.top=next.top+'px';
    button.style.right='auto';
    button.style.transform='none';
    savedButtonPosition=next;
    if(save){try{localStorage.setItem(NOTES_BUTTON_POSITION_KEY,JSON.stringify(next))}catch(error){}}
  }
  applyNotesButtonPosition(savedButtonPosition,false);

  if(note.markdown){
    fetch(note.markdown,{cache:'no-store'}).then(function(response){
      if(!response.ok)throw new Error('PRD request failed');
      return response.text();
    }).then(function(markdown){
      panel.querySelector('.notes-content').innerHTML=renderNoteMarkdown(markdown);
    }).catch(function(){
      panel.querySelector('.notes-content').innerHTML='<div class="notes-empty"><p>PRD 加载失败</p></div>';
    });
  }

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
    button.title='收起注释';
    applyNotesButtonPosition(savedButtonPosition,false);
  }
  function closeNotes(){
    document.body.classList.remove('notes-open');
    button.setAttribute('aria-expanded','false');
    button.title='查看注释';
    applyNotesButtonPosition(savedButtonPosition,false);
  }
  function closePreview(){preview.classList.remove('open')}

  var notesButtonDrag=null;
  var suppressNotesButtonClick=false;
  button.addEventListener('pointerdown',function(event){
    if(event.button!==0)return;
    var rect=button.getBoundingClientRect();
    notesButtonDrag={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,left:rect.left,top:rect.top,moved:false};
    button.setPointerCapture(event.pointerId);
    document.body.classList.add('notes-dragging');
  });
  button.addEventListener('pointermove',function(event){
    if(!notesButtonDrag||event.pointerId!==notesButtonDrag.pointerId)return;
    var deltaX=event.clientX-notesButtonDrag.startX;
    var deltaY=event.clientY-notesButtonDrag.startY;
    if(!notesButtonDrag.moved&&Math.hypot(deltaX,deltaY)<4)return;
    notesButtonDrag.moved=true;
    event.preventDefault();
    applyNotesButtonPosition({left:notesButtonDrag.left+deltaX,top:notesButtonDrag.top+deltaY},false);
  });
  function finishNotesButtonDrag(event){
    if(!notesButtonDrag||event.pointerId!==notesButtonDrag.pointerId)return;
    if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);
    if(notesButtonDrag.moved){
      applyNotesButtonPosition(savedButtonPosition,true);
      suppressNotesButtonClick=true;
    }
    notesButtonDrag=null;
    document.body.classList.remove('notes-dragging');
  }
  button.addEventListener('pointerup',finishNotesButtonDrag);
  button.addEventListener('pointercancel',finishNotesButtonDrag);
  button.addEventListener('click',function(event){
    if(suppressNotesButtonClick){suppressNotesButtonClick=false;event.preventDefault();return}
    if(document.body.classList.contains('notes-open'))closeNotes();else openNotes();
  });
  var resizer=panel.querySelector('.notes-resizer');
  resizer.addEventListener('pointerdown',function(event){
    if(window.innerWidth<=768)return;
    event.preventDefault();
    document.body.classList.add('notes-resizing');
    resizer.setPointerCapture(event.pointerId);
  });
  resizer.addEventListener('pointermove',function(event){
    if(!resizer.hasPointerCapture(event.pointerId))return;
    applyNotesWidth(window.innerWidth-event.clientX,false);
    applyNotesButtonPosition(savedButtonPosition,false);
  });
  resizer.addEventListener('pointerup',function(event){
    if(!resizer.hasPointerCapture(event.pointerId))return;
    resizer.releasePointerCapture(event.pointerId);
    document.body.classList.remove('notes-resizing');
    applyNotesWidth(window.innerWidth-event.clientX,true);
    applyNotesButtonPosition(savedButtonPosition,false);
  });
  resizer.addEventListener('pointercancel',function(){document.body.classList.remove('notes-resizing')});
  resizer.addEventListener('keydown',function(event){
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    var current=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--notes-panel-w'),10)||420;
    applyNotesWidth(current+(event.key==='ArrowLeft'?20:-20),true);
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
  window.addEventListener('resize',function(){
    resizer.setAttribute('aria-valuemax',String(getMaxNotesWidth()));
    applyNotesWidth(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--notes-panel-w'),10)||420,false);
    applyNotesButtonPosition(savedButtonPosition,false);
  });
  openNotes();
})();
