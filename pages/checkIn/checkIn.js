 
const app = getApp()
Page({
  data: {
     array:[0,0,0],
     card:1,
     alert:false,
     checkList:[{day:1,checked:false},{day:2,checked:false},{day:3,checked:false},{day:4,checked:false},{day:5,checked:false},{day:6,checked:false},{day:7,checked:false}]
  },
  onLoad(e)  { 
    let clockDay=e.clockDay
    let isClock=e.isClock   
    if(isClock=="false"){
      isClock=false
    }else{
      isClock=true
    }
    let checkList=this.data.checkList  
    let len=clockDay%7
    if(len==0&&isClock==false){ 
    }else if(len==0&&isClock==true){
      for(let i=0;i<7;i++){
        checkList[i].checked=true
      }
    }else{
    for(let i=0;i<len;i++){
      checkList[i].checked=true
    } 
  }
    let array=[]
    if(clockDay<10){
      array.push(0)
      array.push(0)
      array.push(clockDay)
    }else if(clockDay<100&&clockDay>9){ 
      array.push(0)
      array.push(parseInt(clockDay/10))
      array.push(clockDay%10) 
    }else{
      array=[1,0,0]
    }
    this.setData({
      array:array,
      isClock:isClock,
      clockDay:clockDay,
      checkList:checkList
    })
  },
 randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
        //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
        break;
      default:
        return 0;
        break;
    }
  }, 
  checkIn(){
    let that=this
    let userId=app.globalData.userId
    let day=this.data.clockDay 
    let len=day%7 
    day=Number(day)+1 
    let card=day%7
    if(card==0){
      card=this.randomNum(8,10)
    }
    let data={day:day,card:card,appId:11,userId:userId} 
    console.log(data)
    let checkList=this.data.checkList 
    wx.request({
      url: app.globalData.requestLink+'user/userClockReport.htm',
      data: data,
      method: "post",
      dataType: "json",
      success(res) {
        console.log(res)
        app.globalData.accountCard=res.data.DATA.accountCard
        let array=[]
        if(day<10){
          array.push(0)
          array.push(0)
          array.push(day)
        }else if(day<100){
          array.push(0)
          array.push(parseInt(day/10))
          array.push(day%10) 
        }
        let len=day%7-1
        checkList[len].checked=true
        that.setData({
          array:array,
          isClock:true,
          clockDay:day,
          checkList:checkList,
          card:data.card,
          alert:true
        }) 
      }
    }) 
  },
   
  close(){
    this.setData({
      alert:false
    })
  },
  go(){
    wx.navigateTo({
              url: "/pages/index/index"
     })
  }
})
