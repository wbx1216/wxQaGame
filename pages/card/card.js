// logs.js 
const app = getApp()
Page({
  data: {
    cardNum: 0,
    list: [{
      name: "邀请好友",
      des: "新用户奖励+5张",
      button: "邀请"
    }, {
      name: "每日签到",
      des: "奖励答题卡",
      button: "签到"
    }],
    // list: [{
    //   name: "邀请好友",
    //   des: "新用户奖励+5张",
    //   button: "邀请"
    // }, {
    //   name: "每日签到",
    //   des: "奖励答题卡",
    //   button: "签到"
    // }, {
    //   name: "观看视频",
    //   des: "随机奖励1~5张",
    //   button: "观看（0/6）"
    // }, {
    //   name: "点击广告+阅读15秒",
    //   des: "奖励1张",
    //   button: "点击（0/2）"
    // }],
    successAnswer:0,
    checkIn:0
  },
  onLoad(e) {
    let card=e.card||0
    let successAnswer=e.successAnswer||0
    let userId=app.globalData.userId 
    let that=this
    let data={appId:11,userId:userId}
    wx.request({
      url: app.globalData.requestLink+'user/getUserClockData.htm',
      data: data,
      method: "post",
      dataType: "json",
      success:function(res){ 
        console.log(res)
        that.setData({
          cardNum:card,
          successAnswer:successAnswer,
          checkIn:res.data.DATA.clockDay
        })
      }
    })
   

  },
  go(e) {
     if (e.currentTarget.dataset.idx == 1) {
      wx.navigateTo({
        url: "/pages/checkIn/checkIn"
      })
    }
  },
  onShareAppMessage(e){
    return {
      title: "转发测试",
      imageUrl: "",
      path: 'pages/index/index?masterId='+app.globalData.userId
    }
  }

})