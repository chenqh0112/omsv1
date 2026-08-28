(function(){
  var hideTimer=null;

  function ensureToast(){
    var toast=document.getElementById('global-toast');
    if(toast)return toast;
    toast=document.createElement('div');
    toast.className='toast';
    toast.id='global-toast';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','polite');
    toast.setAttribute('aria-atomic','true');
    toast.innerHTML='<span class="toast-icon" aria-hidden="true">&#10003;</span><span class="toast-message"></span><a class="toast-action" href="#购物车" hidden>查看购物车</a>';
    document.body.appendChild(toast);
    return toast;
  }

  window.showToast=function(message,type,action){
    var toast=ensureToast();
    var toastType=type||'success';
    var actionLink=toast.querySelector('.toast-action');
    toast.className='toast toast-'+toastType;
    toast.querySelector('.toast-icon').innerHTML=toastType==='success'?'&#10003;':'!';
    toast.querySelector('.toast-message').textContent=message;
    actionLink.hidden=!action;
    actionLink.textContent=action&&action.label?action.label:'查看购物车';
    actionLink.onclick=action?function(event){event.preventDefault();toast.classList.remove('show');if(typeof action.onClick==='function')action.onClick()}:null;
    window.clearTimeout(hideTimer);
    requestAnimationFrame(function(){toast.classList.add('show')});
    hideTimer=window.setTimeout(function(){toast.classList.remove('show')},action?5000:3200);
  };

  ensureToast();
})();
