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
    toast.innerHTML='<span class="toast-icon" aria-hidden="true">&#10003;</span><span class="toast-message"></span>';
    document.body.appendChild(toast);
    return toast;
  }

  window.showToast=function(message,type){
    var toast=ensureToast();
    var toastType=type||'success';
    toast.className='toast toast-'+toastType;
    toast.querySelector('.toast-icon').innerHTML=toastType==='success'?'&#10003;':'!';
    toast.querySelector('.toast-message').textContent=message;
    window.clearTimeout(hideTimer);
    requestAnimationFrame(function(){toast.classList.add('show')});
    hideTimer=window.setTimeout(function(){toast.classList.remove('show')},2500);
  };

  ensureToast();
})();
