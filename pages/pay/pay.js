// logs.js 

Page({
  data: {
    cash:0,
     list:[20,50,100],
     rule:true
  },
  onLoad(e) {
    this.setData({
      cash:e.cash
    }) 
  },
  record(){
    wx.navigateTo({
      url:"/pages/record/record"
    }) 
  },
  rule(){
    let rule=!this.data.rule
    this.setData({
      rule:rule
    })
  },
  tixian(){
    wx.showModal({ 
      content: '可提现金额不足', 
      showCancel:false,
    })
  }
})
