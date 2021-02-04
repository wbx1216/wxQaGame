// app.js
App({
  onLaunch() {  
    wx.login({
      success: res => {
        let code = res.code
        wx.request({
          url: 'https://mina.jumengylh.com/doc/user/getWechatOpenId.htm',
          data: {
            code: code
          },
          method: "post",
          dataType: "json",
          success:res=> {
            if (res.data.DATA.openId) {
              let openId = res.data.DATA.openId  
              this.globalData.openId = openId  
              if (this.checkLoginReadyCallback){ 
                this.checkLoginReadyCallback(res);
              }
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
     requestLink:"https://mina.jumengylh.com/doc/"
    //requestLink:"http://192.168.20.2:50020/doc/"
  }
})
