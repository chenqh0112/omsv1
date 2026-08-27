(function(){
  var products=[
    {prefix:'AUR',name:'极光随行保温杯',price:24.9,img:'img1.jpg'},
    {prefix:'MNT',name:'山野运动水壶',price:29.9,img:'img2.jpg'},
    {prefix:'BIZ',name:'商务直饮保温杯',price:32.9,img:'img3.jpg'},
    {prefix:'KID',name:'儿童防漏吸管杯',price:18.9,img:'img4.jpg'},
    {prefix:'TRV',name:'旅行大容量水杯',price:34.9,img:'img5.jpg'},
    {prefix:'FTH',name:'羽毛轻量随手杯',price:22.9,img:'img1.jpg'},
    {prefix:'PND',name:'熊猫主题保温杯',price:27.9,img:'img2.jpg'},
    {prefix:'STR',name:'草莓吸管随行杯',price:21.9,img:'img3.jpg'},
    {prefix:'BKT',name:'篮球运动吨吨桶',price:31.9,img:'img4.jpg'},
    {prefix:'TGR',name:'虎纹车载保温杯',price:33.9,img:'img5.jpg'},
    {prefix:'SEA',name:'海盐渐变咖啡杯',price:26.9,img:'img1.jpg'},
    {prefix:'FRS',name:'森林露营保温壶',price:39.9,img:'img2.jpg'},
    {prefix:'FLW',name:'花朵手柄马克杯',price:23.9,img:'img3.jpg'},
    {prefix:'BLK',name:'曜石真空保温杯',price:35.9,img:'img4.jpg'},
    {prefix:'CLD',name:'云朵便携冷水杯',price:19.9,img:'img5.jpg'},
    {prefix:'SUN',name:'向日葵吸管杯',price:20.9,img:'img1.jpg'},
    {prefix:'ICE',name:'冰川双饮运动杯',price:30.9,img:'img2.jpg'},
    {prefix:'CTY',name:'城市通勤咖啡杯',price:28.9,img:'img3.jpg'},
    {prefix:'PET',name:'宠物外出饮水杯',price:17.9,img:'img4.jpg'},
    {prefix:'TEA',name:'茶饮分离随手杯',price:36.9,img:'img5.jpg'},
    {prefix:'GLS',name:'玻璃内胆办公杯',price:38.9,img:'img1.jpg'},
    {prefix:'CMP',name:'露营折叠水壶',price:25.9,img:'img2.jpg'},
    {prefix:'GYM',name:'健身摇摇蛋白杯',price:16.9,img:'img3.jpg'},
    {prefix:'MIN',name:'迷你便携保温杯',price:15.9,img:'img4.jpg'},
    {prefix:'PRM',name:'臻享礼盒保温杯',price:49.9,img:'img5.jpg'}
  ];
  var variants=[
    {code:'A',label:'20OZ · 雾灰',price:0},
    {code:'B',label:'30OZ · 海蓝',price:3},
    {code:'C',label:'40OZ · 樱粉',price:6},
    {code:'D',label:'64OZ · 墨黑',price:12}
  ];
  var organizations=[
    {company:'公司A',groups:['业务组A','业务组B'],salespeople:['业务员A','业务员B','业务员C']},
    {company:'公司B',groups:['业务组C','业务组D'],salespeople:['业务员D','业务员E','业务员F']},
    {company:'公司C',groups:['业务组E','业务组F'],salespeople:['业务员G','业务员H','业务员I']}
  ];

  function pad(value,length){return String(value).padStart(length,'0')}
  function dateBefore(days){
    var date=new Date(Date.UTC(2026,7,27-days));
    return date.getUTCFullYear()+'-'+pad(date.getUTCMonth()+1,2)+'-'+pad(date.getUTCDate(),2);
  }
  function money(value){return Math.round(value*100)/100}

  var data=[];
  products.forEach(function(product,productIndex){
    variants.forEach(function(variant,variantIndex){
      var index=productIndex*variants.length+variantIndex;
      var serial=index+1;
      var organization=organizations[index%organizations.length];
      var businessGroup=organization.groups[Math.floor(index/3)%organization.groups.length];
      var salesperson=organization.salespeople[index%organization.salespeople.length];
      var shelved=index%17===0?0:(index*47%220)+25;
      var transit=index%8===0?0:index*23%145;
      var receivedNotShelved=index*19%86;
      var locked=shelved?Math.min(shelved,index*7%32):0;
      var available=index%17===0?0:Math.max(0,shelved-locked-(index%9)*3);
      var total=shelved+transit+receivedNotShelved;
      var maxAge=index*13%72+2;
      var recordCount=index%3+1;
      var ageRecords=[];
      for(var recordIndex=0;recordIndex<recordCount;recordIndex++){
        var days=Math.max(1,maxAge-recordIndex*(6+index%8));
        ageRecords.push({days:days,shelvedDate:dateBefore(days),statisticsDate:'2026-08-27'});
      }
      var trayQuantity=available+(index*29%130);
      var unitPrice=money(product.price+variant.price+(index%5)*0.5);
      var todaySold=available?Math.min(available,index*7%19):0;
      var sellableStatus=available===0?'缺货':available<45?'偏少':'充足';

      data.push({
        id:'SKU-'+pad(serial,4),
        sku:'DS-'+product.prefix+'-'+pad(productIndex+1,2)+'-'+variant.code,
        barcode:'DS-'+product.prefix+'-'+pad(productIndex+1,2)+'-'+variant.code,
        name:product.name,
        spec:variant.label,
        img:product.img,
        company:organization.company,
        businessGroup:businessGroup,
        salesperson:salesperson,
        shelved:shelved,
        transit:transit,
        receivedNotShelved:receivedNotShelved,
        available:available,
        locked:locked,
        total:total,
        ageRecords:ageRecords,
        lowStock:available<30,
        unitPrice:unitPrice,
        trayQuantity:trayQuantity,
        todaySold:todaySold,
        todayRevenue:money(unitPrice*todaySold),
        sellableStatus:sellableStatus
      });
    });
  });

  window.OMS_SKU_DATA=data;
})();
