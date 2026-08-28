(function(){
  var baseUsers=[
    ['采购用户A','北美优选贸易有限公司','B2B分销商','buyer.a@northchoice.com','+1 512 555 1001'],
    ['采购用户B','远洋分销有限公司','B2B分销商','buyer.b@oceanwide.cn','+86 21 5566 0288'],
    ['Emily Chen','West Coast Retail LLC','外部客户','emily@westcoastretail.com','+1 213 555 0188'],
    ['Michael Lee','Pacific Home Inc.','B2B分销商','michael@pacifichome.com','+1 415 555 0266'],
    ['采购用户C','新航跨境有限公司','外部客户','buyer.c@newroute.cn','+86 755 8821 0399'],
    ['Sophia Wang','Bright Living Corp.','B2B分销商','sophia@brightliving.com','+1 206 555 0142'],
    ['采购用户D','环球百货供应链','B2B分销商','buyer.d@globalmart.cn','+86 20 3768 0511'],
    ['Daniel Wu','Urban Nest Trading','外部客户','daniel@urbannest.co','+1 646 555 0175'],
    ['Olivia Zhang','Evergreen Commerce LLC','B2B分销商','olivia@evergreencommerce.com','+1 503 555 0129'],
    ['Jason Liu','Sunrise Distribution Inc.','B2B分销商','jason@sunrisedist.com','+1 714 555 0230'],
    ['采购用户E','华盛贸易有限公司','外部客户','buyer.e@huasheng.cn','+86 571 8890 1633'],
    ['Grace Lin','Maple House Retail','外部客户','grace@maplehouse.ca','+1 604 555 0194'],
    ['Kevin Zhou','Blue Harbor Supply','B2B分销商','kevin@blueharbor.com','+1 305 555 0216'],
    ['采购用户F','海拓供应链有限公司','B2B分销商','buyer.f@haituo.cn','+86 592 5088 277'],
    ['Mia Xu','Modern Living Market','外部客户','mia@modernliving.us','+1 312 555 0190'],
    ['Ethan Huang','North Star Wholesale','B2B分销商','ethan@northstarwholesale.com','+1 612 555 0156'],
    ['采购用户G','启程跨境电商有限公司','外部客户','buyer.g@qicheng.cn','+86 10 6598 2041'],
    ['Ava Tang','Home Plus Group','B2B分销商','ava@homeplusgroup.com','+1 702 555 0182'],
    ['Leo Sun','Metro Retail Partners','外部客户','leo@metroretail.com','+1 917 555 0248'],
    ['采购用户H','万联商贸有限公司','B2B分销商','buyer.h@wanlian.cn','+86 27 8781 6022'],
    ['Isabella Gao','Coastal Goods LLC','外部客户','isabella@coastalgoods.com','+1 843 555 0169'],
    ['Noah Yang','Prime Choice Imports','B2B分销商','noah@primechoice.com','+1 281 555 0205'],
    ['采购用户I','东岸优品有限公司','外部客户','buyer.i@eastshore.cn','+86 25 8367 1960'],
    ['Chloe He','Golden State Bazaar','B2B分销商','chloe@goldenstatebazaar.com','+1 408 555 0137'],
    ['Lucas Qian','Oak & Pine Trading','外部客户','lucas@oakpinetrading.com','+1 919 555 0171'],
    ['采购用户J','星桥国际贸易有限公司','B2B分销商','buyer.j@starbridge.cn','+86 22 2331 8902'],
    ['Ella Feng','Central Market Hub','外部客户','ella@centralmarkethub.com','+1 314 555 0224'],
    ['Henry Lu','Redwood Distribution','B2B分销商','henry@redwooddist.com','+1 650 555 0186'],
    ['采购用户K','联创家居用品有限公司','外部客户','buyer.k@lianchuang.cn','+86 769 2288 0940'],
    ['Nora Jiang','Cloud Nine Retail','B2B分销商','nora@cloudnineretail.com','+1 469 555 0118']
  ];
  var orders=window.OMS_ORDER_DATA||[];
  window.OMS_USER_DATA=baseUsers.map(function(item,index){
    var userOrders=orders.filter(function(order){return order.userName===item[0]});
    return {
      id:'USR-'+String(1001+index),userName:item[0],company:item[1],type:item[2],email:item[3],phone:item[4],
      registeredAt:'2026-'+String(8-(index%7)).padStart(2,'0')+'-'+String(2+(index*3)%25).padStart(2,'0'),
      lastLogin:index%7===0?'2026-06-'+String(10+index%15).padStart(2,'0')+' 09:20':'2026-08-'+String(27-index%24).padStart(2,'0')+' '+String(8+index%10).padStart(2,'0')+':'+String((index*7)%60).padStart(2,'0'),
      status:index%9===0?'冻结':'正常',orderCount:userOrders.length,
      totalSpend:userOrders.reduce(function(sum,order){return sum+(order.status==='已关闭'?0:order.amount)},0)
    };
  });
})();
