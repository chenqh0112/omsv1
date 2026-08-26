(function(){
  var instances=[];

  function create(container,config){
    var options=(config.options||[]).slice();
    var selected=[];
    container.classList.add('multi-select');
    container.innerHTML=
      '<button class="multi-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">'
      +'<span class="multi-select-value"></span>'
      +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
      +'</button>'
      +'<div class="multi-select-menu">'
      +'<div class="multi-select-search"><input type="search" placeholder="搜索" aria-label="搜索选项"></div>'
      +'<div class="multi-select-options" role="listbox" aria-multiselectable="true"></div>'
      +'</div>';

    var trigger=container.querySelector('.multi-select-trigger');
    var valueLabel=container.querySelector('.multi-select-value');
    var menu=container.querySelector('.multi-select-menu');
    var search=container.querySelector('input');
    var optionsBox=container.querySelector('.multi-select-options');

    function updateLabel(){
      if(selected.length===0){
        valueLabel.textContent=config.placeholder||'请选择';
        trigger.classList.remove('has-value');
      }else if(selected.length===1){
        var match=options.find(function(option){return option.value===selected[0]});
        valueLabel.textContent=match?match.label:selected[0];
        trigger.classList.add('has-value');
      }else{
        valueLabel.textContent='已选择 '+selected.length+' 项';
        trigger.classList.add('has-value');
      }
    }

    function renderOptions(query){
      var keyword=(query||'').trim().toLowerCase();
      var visible=options.filter(function(option){return option.label.toLowerCase().indexOf(keyword)>-1});
      optionsBox.innerHTML='';
      if(visible.length===0){
        optionsBox.innerHTML='<div class="multi-select-empty">暂无匹配项</div>';
        return;
      }
      visible.forEach(function(option){
        var label=document.createElement('label');
        label.className='multi-select-option';
        label.innerHTML='<input type="checkbox" value="'+option.value+'"><span>'+option.label+'</span>';
        label.querySelector('input').checked=selected.indexOf(option.value)>-1;
        optionsBox.appendChild(label);
      });
    }

    function close(){
      container.classList.remove('open');
      trigger.setAttribute('aria-expanded','false');
    }

    trigger.addEventListener('click',function(){
      var willOpen=!container.classList.contains('open');
      instances.forEach(function(instance){instance.close()});
      container.classList.toggle('open',willOpen);
      trigger.setAttribute('aria-expanded',willOpen?'true':'false');
      if(willOpen){search.value='';renderOptions('');search.focus()}
    });
    search.addEventListener('input',function(){renderOptions(search.value)});
    optionsBox.addEventListener('change',function(event){
      if(event.target.type!=='checkbox')return;
      if(event.target.checked){
        if(selected.indexOf(event.target.value)<0)selected.push(event.target.value);
      }else{
        selected=selected.filter(function(value){return value!==event.target.value});
      }
      updateLabel();
      if(typeof config.onChange==='function')config.onChange(selected.slice());
    });

    var api={
      container:container,
      close:close,
      getValues:function(){return selected.slice()},
      clear:function(silent){selected=[];updateLabel();renderOptions(search.value);if(!silent&&config.onChange)config.onChange([])},
      setOptions:function(nextOptions,keepSelection){
        options=(nextOptions||[]).slice();
        if(!keepSelection)selected=[];
        else selected=selected.filter(function(value){return options.some(function(option){return option.value===value})});
        updateLabel();
        renderOptions(search.value);
      }
    };
    instances.push(api);
    updateLabel();
    renderOptions('');
    return api;
  }

  document.addEventListener('click',function(event){
    instances.forEach(function(instance){
      if(instance.container.isConnected&&!instance.container.contains(event.target))instance.close();
    });
  });

  window.OMSMultiSelect={create:create};
})();
