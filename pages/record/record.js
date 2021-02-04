// logs.js 
const app=getApp()
let load=false;
Page({
  data: { 
    list:[],
    page:1,
    height:""
  },
  onLoad() {
    let that=this 
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        that.setData({
          height:res.windowHeight-50
        })
      }
    })
    let data = {
      openId: app.globalData.openId,
      appId: 11,
      userId:app.globalData.userId,
      page:this.data.page
    }
    wx.request({
      url: app.globalData.requestLink+'quiz/userQuizFlow.htm',
      data: data,
      method: "post",
      dataType: "json",
      success(res) {
        console.log(res) 
        that.setData({
          list:res.data.DATA
        })
      }
    })
  },
  scroll(e){ 
    let that=this
    if(load==false){
      let page=this.data.page
      load=true
      page=page+1
      let data = {
        openId: app.globalData.openId,
        appId: 11,
        userId:app.globalData.userId,
        page:page
      }
      wx.request({
        url: app.globalData.requestLink+'quiz/userQuizFlow.htm',
        data: data,
        method: "post",
        dataType: "json",
        success(res) {
          console.log(res) 
          if(res.data.DATA){
            let list=that.data.list
            list=list.concat(res.data.DATA) 
            that.setData({
              list:list,
              page:page
            })
            load=false
          }else{
            return false
          }
          
        }
      })
    }
  }
})
