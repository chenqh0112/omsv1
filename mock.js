// ========== Mock Data ==========
var DB = {
  warehouse: {id:'us-la',name:'美西仓(洛杉矶)',region:'US-West',address:'1234 Harbor Blvd, Los Angeles, CA 90012'},
  sellers: [
    {id:'s1',name:'内部团队A',type:'internal'},
    {id:'s2',name:'内部团队B',type:'internal'},
    {id:'s3',name:'外部-蜂鸟',type:'external'},
    {id:'s4',name:'外部-跨境达人',type:'external'},
    {id:'s5',name:'内部团队C',type:'internal'},
  ],
  platforms: ['Walmart','Temu','Amazon','TikTok Shop'],
  // SKU库存明细 (单仓:美西仓)
  skuInventory: [
    {sku:'BT-EP-001',name:'蓝牙耳机 Pro',img:'🎧',seller:'s1',available:320,locked:50,inTransit:200,reserved:80,doi:15,lowStock:false},
    {sku:'PH-CC-002',name:'iPhone手机壳',img:'📱',seller:'s1',available:8,locked:5,inTransit:0,reserved:10,doi:45,lowStock:true},
    {sku:'LD-ST-003',name:'LED灯带 5米',img:'💡',seller:'s2',available:150,locked:20,inTransit:100,reserved:30,doi:8,lowStock:false},
    {sku:'PB-BK-005',name:'便携充电宝 10000mAh',img:'🔋',seller:'s3',available:35,locked:15,inTransit:0,reserved:0,doi:60,lowStock:false},
    {sku:'WT-BT-006',name:'智能手表 GPS',img:'⌚',seller:'s3',available:85,locked:20,inTransit:120,reserved:40,doi:12,lowStock:false},
    {sku:'KB-WL-008',name:'机械键盘 无线',img:'⌨️',seller:'s4',available:120,locked:30,inTransit:60,reserved:25,doi:18,lowStock:false},
    {sku:'MK-BC-009',name:'化妆包 大容量',img:'💄',seller:'s5',available:200,locked:40,inTransit:100,reserved:60,doi:5,lowStock:false},
    {sku:'WT-BT-006',name:'智能手表 GPS',img:'⌚',seller:'s5',available:45,locked:10,inTransit:60,reserved:15,doi:30,lowStock:false},
    {sku:'PB-BK-005',name:'便携充电宝 10000mAh',img:'🔋',seller:'s1',available:30,locked:5,inTransit:40,reserved:10,doi:25,lowStock:false},
    {sku:'YG-MT-004',name:'瑜伽垫 TPE',img:'🧘',seller:'s2',available:2,locked:0,inTransit:80,reserved:0,doi:55,lowStock:true},
    {sku:'BK-BP-007',name:'登山背包 40L',img:'🎒',seller:'s4',available:0,locked:0,inTransit:80,reserved:0,doi:0,lowStock:true},
    {sku:'LD-ST-003',name:'LED灯带 5米',img:'💡',seller:'s3',available:90,locked:10,inTransit:0,reserved:20,doi:35,lowStock:false},
  ],
  // 美国货盘 - 按SKU聚合 (单仓)
  trayItems: [
    {sku:'BT-EP-001',name:'蓝牙耳机 Pro',img:'🎧',totalQty:320,sellers:[{id:'s1',qty:320}],available:320,allocated:0,external:0,internal:320},
    {sku:'PH-CC-002',name:'iPhone手机壳',img:'📱',totalQty:23,sellers:[{id:'s1',qty:23}],available:23,allocated:0,external:0,internal:23},
    {sku:'LD-ST-003',name:'LED灯带 5米',img:'💡',totalQty:360,sellers:[{id:'s2',qty:270},{id:'s3',qty:90}],available:360,allocated:0,external:90,internal:270},
    {sku:'YG-MT-004',name:'瑜伽垫 TPE',img:'🧘',totalQty:82,sellers:[{id:'s2',qty:82}],available:82,allocated:0,external:0,internal:82},
    {sku:'PB-BK-005',name:'便携充电宝 10000mAh',img:'🔋',totalQty:100,sellers:[{id:'s3',qty:35},{id:'s1',qty:65}],available:85,allocated:15,external:35,internal:65},
    {sku:'WT-BT-006',name:'智能手表 GPS',img:'⌚',totalQty:220,sellers:[{id:'s3',qty:165},{id:'s5',qty:55}],available:220,allocated:0,external:165,internal:55},
    {sku:'KB-WL-008',name:'机械键盘 无线',img:'⌨️',totalQty:150,sellers:[{id:'s4',qty:150}],available:150,allocated:0,external:150,internal:0},
    {sku:'MK-BC-009',name:'化妆包 大容量',img:'💄',totalQty:240,sellers:[{id:'s5',qty:240}],available:240,allocated:0,external:0,internal:240},
  ],
  // 库龄分布
  ageDistribution: [
    {range:'0-7天',count:2,color:'green'},
    {range:'8-15天',count:3,color:'green'},
    {range:'16-30天',count:3,color:'yellow'},
    {range:'31-60天',count:2,color:'orange'},
    {range:'61-90天',count:1,color:'red'},
    {range:'90天+',count:1,color:'red'},
  ],
  // 入库单列表
  inboundOrders: [
    {
      id:'IN-RP-20260825-001',
      type:'replenish',
      typeName:'补货入库',
      source:'zebra',
      sourceNo:'ZEBRA-BU-20260820',
      transferNo:'ZW-5031255',
      carrier:'新山UPS',
      seller:'s1',
      skus:[{sku:'BT-EP-001',name:'蓝牙耳机 Pro',qty:200,img:'🎧'},{sku:'PB-BK-005',name:'便携充电宝',qty:80,img:'🔋'}],
      totalQty:280,
      status:'intransit',
      statusText:'头程在途',
      currentStep:2,
      steps:['已发货','头程在途','已到港','已收货','已上架'],
      createTime:'2026-08-20 14:30',
      eta:'2026-08-28',
      trackingNodes:[
        {title:'物流中心发货',time:'2026-08-20 16:45',desc:'转单号 ZW-5031255 已生成,共280件',done:true},
        {title:'国内段运输中',time:'2026-08-21 09:20',desc:'已到达深圳集货仓',done:true},
        {title:'发往美国(海运)',time:'2026-08-22 08:00',desc:'预计航程 12 天',done:false,active:true},
        {title:'到港清关',time:'预计 2026-09-03',desc:'洛杉矶港',done:false},
        {title:'派送入仓',time:'预计 2026-09-05',desc:'美西仓签收',done:false},
      ]
    },
    {
      id:'IN-PR-20260824-003',
      type:'procure',
      typeName:'外采入库',
      source:'po',
      sourceNo:'PO-2026-0801-007',
      transferNo:'ZW-5031248',
      carrier:'海运快线',
      seller:'s2',
      skus:[{sku:'LD-ST-003',name:'LED灯带 5米',qty:500,img:'💡'}],
      totalQty:500,
      status:'intransit',
      statusText:'头程在途',
      currentStep:3,
      steps:['已发货','头程在途','已到港','已收货','已上架'],
      createTime:'2026-08-15 10:00',
      eta:'2026-08-30',
      trackingNodes:[
        {title:'供应商发货',time:'2026-08-15 14:00',desc:'国内收货质检完成,良品率 98.5%',done:true},
        {title:'国内集货',time:'2026-08-16 18:30',desc:'拼柜完成,共 3 个供应商',done:true},
        {title:'海运中',time:'2026-08-18 06:00',desc:'已开船,航行中',done:false,active:true},
        {title:'到港清关',time:'预计 2026-08-29',desc:'洛杉矶港',done:false},
        {title:'派送入仓',time:'预计 2026-08-31',desc:'美西仓签收',done:false},
      ]
    },
    {
      id:'IN-RP-20260818-002',
      type:'replenish',
      typeName:'补货入库',
      source:'zebra',
      sourceNo:'ZEBRA-BU-20260810',
      transferNo:'ZW-5031230',
      carrier:'空运',
      seller:'s3',
      skus:[{sku:'WT-BT-006',name:'智能手表 GPS',qty:120,img:'⌚'}],
      totalQty:120,
      status:'arrived',
      statusText:'已到港待收货',
      currentStep:3,
      steps:['已发货','头程在途','已到港','已收货','已上架'],
      createTime:'2026-08-10 09:00',
      eta:'2026-08-26',
      trackingNodes:[
        {title:'物流中心发货',time:'2026-08-10 11:30',desc:'转单号 ZW-5031230',done:true},
        {title:'空运中',time:'2026-08-11 03:00',desc:'航班号 CA983',done:true},
        {title:'已到港',time:'2026-08-25 08:15',desc:'LAX 机场,清关中',done:false,active:true},
        {title:'派送入仓',time:'预计 2026-08-26',desc:'美西仓',done:false},
        {title:'上架',time:'预计 2026-08-27',desc:'',done:false},
      ]
    },
    {
      id:'IN-DS-20260822-005',
      type:'drop',
      typeName:'一件代发入库',
      source:'seller',
      sourceNo:'-',
      transferNo:'-',
      carrier:'-',
      seller:'s4',
      skus:[{sku:'KB-WL-008',name:'机械键盘 无线',qty:50,img:'⌨️'}],
      totalQty:50,
      status:'received',
      statusText:'已收货待上架',
      currentStep:4,
      steps:['已发货','头程在途','已到港','已收货','已上架'],
      createTime:'2026-08-22 16:00',
      eta:'2026-08-26',
      trackingNodes:[
        {title:'卖家发货',time:'2026-08-22 16:00',desc:'',done:true},
        {title:'到达仓库',time:'2026-08-25 10:30',desc:'',done:true},
        {title:'清点收货',time:'2026-08-25 14:20',desc:'实收 50 件,与单据一致',done:false,active:true},
        {title:'上架中',time:'进行中',desc:'',done:false},
      ]
    },
    {
      id:'IN-RP-20260805-001',
      type:'replenish',
      typeName:'补货入库',
      source:'zebra',
      sourceNo:'ZEBRA-BU-20260728',
      transferNo:'ZW-5031201',
      carrier:'海运',
      seller:'s5',
      skus:[{sku:'MK-BC-009',name:'化妆包 大容量',qty:300,img:'💄'}],
      totalQty:300,
      status:'shelved',
      statusText:'已上架完成',
      currentStep:5,
      steps:['已发货','头程在途','已到港','已收货','已上架'],
      createTime:'2026-07-28 11:00',
      eta:'2026-08-10',
      trackingNodes:[
        {title:'物流中心发货',time:'2026-07-28 14:00',desc:'转单号 ZW-5031201',done:true},
        {title:'海运中',time:'2026-07-30 08:00',desc:'',done:true},
        {title:'到港清关',time:'2026-08-08 16:00',desc:'',done:true},
        {title:'派送入仓',time:'2026-08-09 10:30',desc:'',done:true},
        {title:'已上架',time:'2026-08-10 15:00',desc:'上架 300 件,库位 A-03-12',done:true},
      ]
    },
    {
      id:'IN-TR-20260815-001',
      type:'transfer',
      typeName:'中转入库',
      source:'other',
      sourceNo:'TRF-20260815-01',
      transferNo:'-',
      carrier:'本地卡车',
      seller:'s1',
      skus:[{sku:'PH-CC-002',name:'iPhone手机壳',qty:200,img:'📱'}],
      totalQty:200,
      status:'shelved',
      statusText:'已上架(待中转)',
      currentStep:5,
      steps:['已发货','头程在途','已到港','已收货','已上架'],
      createTime:'2026-08-15 09:00',
      eta:'2026-08-17',
      trackingNodes:[
        {title:'发货',time:'2026-08-15 10:00',desc:'中转来货',done:true},
        {title:'到达仓库',time:'2026-08-16 08:30',desc:'',done:true},
        {title:'清点收货',time:'2026-08-16 11:00',desc:'',done:true},
        {title:'上架',time:'2026-08-17 14:00',desc:'暂存区,待转出',done:true},
      ]
    },
  ],
};

// ========== API Stubs ==========
function delay(ms){return new Promise(function(r){setTimeout(r,ms)})}

// GET /api/inventory/list — fetch SKU inventory with filters
async function fetchInventory(filters){
  await delay(300);
  var data = DB.skuInventory.slice();
  if(filters && filters.seller && filters.seller !== 'all')
    data = data.filter(function(d){return d.seller === filters.seller});
  if(filters && filters.lowStock)
    data = data.filter(function(d){return d.lowStock});
  return {code:0,data:data,total:data.length};
}

// GET /api/tray/list — fetch US cargo tray aggregated items
async function fetchTray(){
  await delay(300);
  return {code:0,data:DB.trayItems,total:DB.trayItems.length};
}

// POST /api/tray/mark — mark seller inventory to tray
async function markToTray(payload){
  await delay(400);
  return {code:0,msg:'标记成功'};
}

// GET /api/inbound/list — fetch inbound orders
async function fetchInbound(filters){
  await delay(300);
  var data = DB.inboundOrders.slice();
  if(filters && filters.type && filters.type !== 'all')
    data = data.filter(function(d){return d.type === filters.type});
  if(filters && filters.status && filters.status !== 'all')
    data = data.filter(function(d){return d.status === filters.status});
  return {code:0,data:data,total:data.length};
}

// POST /api/inbound/create — create inbound order
async function createInbound(payload){
  await delay(500);
  return {code:0,msg:'入库单已创建',id:'IN-NEW-' + Date.now()};
}
