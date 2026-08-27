(function(){
  var skuData=(window.OMS_SKU_DATA||[]).slice();
  var buyers=[
    {name:'采购用户A',company:'北美优选贸易有限公司'},
    {name:'采购用户B',company:'远洋分销有限公司'},
    {name:'Emily Chen',company:'West Coast Retail LLC'},
    {name:'Michael Lee',company:'Pacific Home Inc.'},
    {name:'采购用户C',company:'新航跨境有限公司'},
    {name:'Sophia Wang',company:'Bright Living Corp.'},
    {name:'采购用户D',company:'环球百货供应链'}
  ];
  var statuses=['待确认','已确认','拣货中','已发货','已签收','已取消'];
  var logistics=['UPS Ground','FedEx Ground','卡车派送'];
  var orders=[];
  for(var index=0;index<36;index++){
    var buyer=buyers[index%buyers.length];
    var itemCount=2+(index%3);
    var items=[];
    for(var itemIndex=0;itemIndex<itemCount;itemIndex++){
      var sku=skuData[(index*7+itemIndex*11)%Math.max(1,skuData.length)]||{};
      var quantity=2+((index+itemIndex*3)%12);
      var unitPrice=Number(sku.unitPrice||24.9);
      items.push({sku:sku.barcode||('SKU-'+index+'-'+itemIndex),name:sku.name||'示例商品',spec:sku.spec||'标准规格',img:sku.img||'',quantity:quantity,unitPrice:unitPrice,subtotal:unitPrice*quantity});
    }
    var productAmount=items.reduce(function(sum,item){return sum+item.subtotal},0);
    var operationFee=8+(index%5)*2;
    var logisticsFee=18+(index%4)*6;
    var status=statuses[index%statuses.length];
    var day=27-(index%27);
    var hour=9+(index%9);
    orders.push({
      id:'US-202608-'+String(1036-index).padStart(4,'0'),
      userName:buyer.name,
      company:buyer.company,
      createdAt:'2026-08-'+String(day).padStart(2,'0')+' '+String(hour).padStart(2,'0')+':'+String((index*7)%60).padStart(2,'0'),
      items:items,
      productAmount:productAmount,
      operationFee:operationFee,
      logisticsFee:logisticsFee,
      amount:productAmount+operationFee+logisticsFee,
      status:status,
      logistics:logistics[index%logistics.length],
      tracking:(status==='已发货'||status==='已签收')?'1Z'+String(908172635400+index):'',
      recipient:buyer.name,
      phone:'+1 512 555 '+String(1000+index),
      address:(120+index)+' Commerce Ave, Dallas, TX 75201',
      rejectReason:status==='已取消'?'采购方取消采购计划':''
    });
  }
  window.OMS_ORDER_DATA=orders;
})();
