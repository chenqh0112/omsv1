(function(){
  var STORAGE_KEY='oms-current-role';
  var DEFAULT_ROLE='super-admin';
  var roles=[
    {
      id:'super-admin',
      name:'超管',
      initials:'超',
      description:'查看全部公司与业务组数据',
      avatarClass:'super'
    },
    {
      id:'company-admin',
      name:'公司A管理员',
      initials:'公',
      description:'管理公司A的全部业务数据',
      avatarClass:'company'
    },
    {
      id:'group-admin',
      name:'公司A业务组A管理员',
      initials:'组',
      description:'管理公司A业务组A的数据',
      avatarClass:'group'
    },
    {
      id:'salesperson',
      name:'公司A业务组A业务员',
      initials:'员',
      description:'查看本人负责的业务数据',
      avatarClass:'sales'
    }
  ];
  var currentRoleId=readStoredRole();
  var pendingRoleId=currentRoleId;
  var lastFocusedElement=null;

  function getRole(id){
    return roles.find(function(role){return role.id===id})||roles[0];
  }

  function readStoredRole(){
    try{
      var stored=localStorage.getItem(STORAGE_KEY);
      return roles.some(function(role){return role.id===stored})?stored:DEFAULT_ROLE;
    }catch(error){
      return DEFAULT_ROLE;
    }
  }

  function storeRole(id){
    try{localStorage.setItem(STORAGE_KEY,id)}catch(error){}
  }

  function createModal(){
    var overlay=document.createElement('div');
    overlay.className='modal-overlay';
    overlay.id='role-switch-modal';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','role-switch-title');
    overlay.innerHTML=
      '<div class="modal role-modal">'
      +'<div class="modal-head">'
      +'<h3 id="role-switch-title">切换身份</h3>'
      +'<button class="close" type="button" data-role-close aria-label="关闭">&times;</button>'
      +'</div>'
      +'<div class="modal-body">'
      +'<div class="role-current" id="role-current-text"></div>'
      +'<div class="role-list" role="radiogroup" aria-label="可切换身份">'
      +roles.map(function(role){
        return '<button class="role-option" type="button" role="radio" data-role-id="'+role.id+'" aria-checked="false">'
          +'<span class="role-option-avatar '+role.avatarClass+'">'+role.initials+'</span>'
          +'<span class="role-option-copy"><span class="role-option-name">'+role.name+'</span><span class="role-option-desc">'+role.description+'</span></span>'
          +'<span class="role-option-check" aria-hidden="true"></span>'
          +'</button>';
      }).join('')
      +'</div>'
      +'</div>'
      +'<div class="modal-footer">'
      +'<button class="btn btn-ghost" type="button" data-role-close>取消</button>'
      +'<button class="btn btn-primary" type="button" id="role-switch-confirm">确认切换</button>'
      +'</div>'
      +'</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click',function(event){
      var option=event.target.closest('[data-role-id]');
      if(option){selectPendingRole(option.dataset.roleId);return}
      if(event.target===overlay||event.target.closest('[data-role-close]'))closeModal();
    });
    document.getElementById('role-switch-confirm').addEventListener('click',confirmRole);
  }

  function updateRoleUI(){
    var role=getRole(currentRoleId);
    document.querySelectorAll('[data-role-avatar]').forEach(function(avatar){
      avatar.textContent=role.initials;
      avatar.title='当前身份：'+role.name+'，点击切换';
      avatar.setAttribute('aria-label','当前身份：'+role.name+'，切换身份');
      ['super','company','group','sales'].forEach(function(name){
        avatar.classList.toggle('avatar--'+name,role.avatarClass===name);
      });
    });
    document.querySelectorAll('[data-role-name]').forEach(function(label){label.textContent=role.name});
  }

  function notifyRoleChange(){
    window.dispatchEvent(new CustomEvent('oms-role-change',{detail:{role:getRole(currentRoleId)}}));
  }

  function selectPendingRole(id){
    pendingRoleId=id;
    document.querySelectorAll('.role-option').forEach(function(option){
      var selected=option.dataset.roleId===id;
      option.classList.toggle('selected',selected);
      option.setAttribute('aria-checked',selected?'true':'false');
    });
  }

  function openModal(){
    lastFocusedElement=document.activeElement;
    pendingRoleId=currentRoleId;
    document.getElementById('role-current-text').textContent='当前身份：'+getRole(currentRoleId).name;
    selectPendingRole(pendingRoleId);
    var overlay=document.getElementById('role-switch-modal');
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
    var selected=overlay.querySelector('.role-option.selected');
    if(selected)selected.focus();
  }

  function closeModal(){
    document.getElementById('role-switch-modal').classList.remove('open');
    document.body.style.overflow='';
    if(lastFocusedElement)lastFocusedElement.focus();
  }

  function confirmRole(){
    var previousRole=getRole(currentRoleId);
    var nextRole=getRole(pendingRoleId);
    currentRoleId=nextRole.id;
    storeRole(currentRoleId);
    updateRoleUI();
    notifyRoleChange();
    closeModal();
    if(previousRole.id!==nextRole.id&&typeof window.showToast==='function'){
      window.showToast('已切换为'+nextRole.name);
    }
  }

  createModal();
  updateRoleUI();
  window.OMSRole={
    getCurrent:function(){return getRole(currentRoleId)},
    getAll:function(){return roles.slice()}
  };
  document.querySelectorAll('[data-role-avatar]').forEach(function(avatar){
    avatar.addEventListener('click',openModal);
  });
  document.addEventListener('keydown',function(event){
    var modal=document.getElementById('role-switch-modal');
    if(event.key==='Escape'&&modal.classList.contains('open'))closeModal();
  });
  notifyRoleChange();
})();
