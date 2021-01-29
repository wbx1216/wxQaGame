// index.js
// 获取应用实例
let Interval = null
const app = getApp()
Page({
  data: {
    list: [1, 2, 3, 4],
    cash: "0.0",
    width: "0",
    totalBag: "16118",
    lastId: 0,
    loadingDollar: "20",
    totalDollar: "11417",
    time: "9",
    card: "0",
    num: 0,
    renwulist: [{
      num: 5,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 5
    }, {
      num: 10,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 10
    }, {
      num: 25,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 25
    }, {
      num: 40,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 40
    }, {
      num: 60,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 60
    }, {
      num: 80,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 80
    },{
      num: 100,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 100
    },{
      num: 130,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 130
    },{
      num: 150,
      status: 0,
      url: "http://res.hodanet.com/upload/sy/20210018/19/renwuItem.png",
      old: 150
    }],
    first: false,
    opened: false,
    alert: false,
    right: false,
    url: "http://res.hodanet.com/upload/sy/20210019/18/newReward.png",
    rookieCash: "1.23",
    rankList: [{
      name: "念安",
      num: 324,
      dollar: 200
    }, {
      name: "念安",
      num: 324,
      dollar: 200
    }],
    masterId: ""
  },
  // 事件处理函数
  onHide() {
    clearInterval(Interval)
  },
  onShow() {
    wx.showLoading({
      title: '',
    })
    if (app.globalData.openId) {
      this.getInfo()
      wx.hideLoading()
    } else {
      app.checkLoginReadyCallback = res => {
        this.getInfo()
        wx.hideLoading()
      };
    }
  },
  getInfo() {
    if (!app.globalData.openId) {
      console.log("null")
      return false;
    } else {
      let that = this
      let data = {
        openId: app.globalData.openId,
        appId: 11
      }
      if (this.data.masterId) {
        data.masterId = this.data.masterId
      }
      let userId = wx.getStorageSync('userId')
      if (userId) {
        data.userId = userId
      }
      wx.request({
        url: app.globalData.requestLink+'user/getUserInfo.htm',
        data: data,
        method: "post",
        dataType: "json",
        success(res) {
          console.log(res)
          let data = res.data.DATA
          let renwulist = that.data.renwulist
          renwulist.forEach((item, idx) => {
            item.num = item.num - data.successAnswer
            renwulist[idx] = item
          })

          if (data) {
            let successAnswer=null 
            for(let i=0;i<9;i++){ 
              if(data.successAnswer<that.data.renwulist[i].old){ 
                successAnswer=i
                break; 
              }
            } 
            let answerWelfare = data.answerWelfare
            if (successAnswer > 0) {
              if (!answerWelfare) {
                for (let i = 0; i < successAnswer; i++) {
                  renwulist[i].status = 1
                }
              } else {
                let len = answerWelfare.length
                for (let i = 0; i < successAnswer; i++) {
                  if (i < len) {
                    renwulist[i].status = 2
                  } else {
                    renwulist[i].status = 1
                  }
                  renwulist[i].url = "http://res.hodanet.com/upload/sy/20210028/20/1611836541788.png"

                }
              }
            }
            let loadingDollar = 20
            if (data.cash > 20) {
              loadingDollar = 50
            }
            let width = data.cash / loadingDollar * 100
            that.setData({
              cash: data.cash,
              card: data.card,
              wechatAuth: data.wechatAuth,
              num: data.successAnswer,
              lastQuestionId: data.lastQuestionId,
              renwulist: renwulist,
              width: width,
              loadingDollar: loadingDollar
            })
            if (!data.rookieWelfare) {
              that.setData({
                first: true
              })
            }
            app.globalData.userId = data.userId
            wx.setStorage({
              key: "userId",
              data: data.userId
            })
          }
          that.getQ()
        }
      })
    }
  },
  onLoad(e) {
    if (e.masterId) {
      this.setData({
        masterId: e.masterId
      })
    }
  },

  getQ(e) {
    let lastQuestionId = this.data.lastQuestionId
    let that = this
    let data = {
      appId: 11,
      userId: app.globalData.userId,
      lastQuestionId: lastQuestionId
    }
    wx.request({
      url: app.globalData.requestLink+'quiz/getQuestionDatas.htm',
      data: data,
      method: "post",
      dataType: "json",
      success(res) {
        console.log(res)
        let text = []
        let rightIdx = null
        let random = Math.random()
        let idx = 0
        if (random > 0.5) {
          text.push(res.data.DATA[idx].wrongOpt)
          text.push(res.data.DATA[idx].rightOpt)
          rightIdx = 1
        } else {
          text.push(res.data.DATA[idx].rightOpt)
          text.push(res.data.DATA[idx].wrongOpt)
          rightIdx = 0
        }  
        that.setData({
          qaList: res.data.DATA,
          question: res.data.DATA[idx].question,
          text: text,
          rightIdx: rightIdx,
          questionId: res.data.DATA[idx].id,
          idx: idx,
          totalDollar:res.data.welfareData.leftCash,
          totalBag:res.data.welfareData.leftNum
        })
        clearInterval(Interval)
        that.timeLeft()
      }
    })
  },
  answer(e) {
    let card = this.data.card
    let that = this
    if (card == 0) {
      wx.showToast({
        title: '答题卡0',
        duration: 2000
      })
      return false
    } else {
      card = card - 1
    }
    let questionId = this.data.questionId
    let ret = null
    let opt = this.data.text[e.currentTarget.dataset.id]
    if (e.currentTarget.dataset.id == this.data.rightIdx) {
      ret = 1
    } else {
      ret = 0
    }
    let data = {
      appId: 11,
      userId: app.globalData.userId,
      questionId: questionId,
      ret: ret,
      opt: opt
    }
    console.log(data)
    wx.request({
      url: app.globalData.requestLink+'quiz/userQuizReport.htm',
      data: data,
      method: "post",
      dataType: "json",
      success(res) {
        console.log(res)
        let data = res.data.DATA
        if (ret == 1) {
          that.setData({
            alert: true,
            right: true,
            dollar: data.questionCash
          })
        } else {
          that.setData({
            alert: true,
            right: false
          })
        }
        that.getInfo()
      }
    })


  },
  changeQ() {
    let idx = this.data.idx + 1
    if (idx == this.data.qaList.length) {
      this.getQ()
    } else {
      let question = this.data.qaList[idx].question
      let text = []
      let rightIdx = null
      let random = Math.random()
      let questionId = this.data.qaList[idx].id
      if (random > 0.5) {
        text.push(this.data.qaList[idx].wrongOpt)
        text.push(this.data.qaList[idx].rightOpt)
        rightIdx = 1
      } else {
        text.push(this.data.qaList[idx].rightOpt)
        text.push(this.data.qaList[idx].wrongOpt)
        rightIdx = 0
      }
      this.setData({
        question: question,
        text: text,
        rightIdx: rightIdx,
        questionId: questionId,
        idx: idx,
        lastQuestionId: questionId
      })
    }
  },
  bindGetUserInfo() {
    let that = this
    wx.getUserInfo({
      success(res) {
        if (that.data.wechatAuth == 1) {
          that.tixian()
        } else {
          if (res.rawData) {
            let userInfo = JSON.parse(res.rawData)
            let data = {
              openId: app.globalData.openId,
              appId: 11,
              userId: app.globalData.userId,
              icon: userInfo.avatarUrl,
              nickName: userInfo.nickName
            }
            wx.request({
              url: app.globalData.requestLink+'user/getUserInfo.htm',
              data: data,
              method: "post",
              dataType: "json",
              success(res) {
                console.log(res)
                that.tixian()
              }
            })
          }
        }
      },
      fail(res) {
        wx.showToast({
          title: '请授权个人信息',
          icon: 'error',
          duration: 2000
        })

      }
    })

  },
  timeLeft() {
    let that = this
    Interval = setInterval(() => {
      let time = that.data.time
      time = time - 1
      that.setData({
        time: time
      })
      if (time < 0) {
        clearInterval(Interval)
        that.setData({
          time: 10
        })
        that.changeQ()
        that.timeLeft()
      }
    }, 1000);
  },
  ling(e) {
    let userId = app.globalData.userId
    let round = e.currentTarget.dataset.id
    if(this.data.renwulist[round].status==1){
    round = this.data.renwulist[round].old
    let data = {
      type: 2,
      appId: 11,
      userId: userId,
      round: round
    }
    let that = this
    wx.request({
      url: app.globalData.requestLink+'user/userOpenWelfare.htm',
      data: data,
      method: "post",
      dataType: "json",
      success(res) {
        console.log(res.data.DATA)
        that.getInfo()
        that.setData({
          opened: true,
          url: "http://res.hodanet.com/upload/sy/20210019/18/newReward2.png",
          rookieCash: res.data.DATA.answerCash
        })
      }
    })  
  } 
  },
  open() {
    let that = this
    let userId = app.globalData.userId
    let data = {
      type: 1,
      appId: 11,
      userId: userId
    }
    wx.request({
      url: app.globalData.requestLink+'user/userOpenWelfare.htm',
      data: data,
      method: "post",
      dataType: "json",
      success(res) {
        console.log(res)
        let cash = that.data.cash
        cash = cash + res.data.DATA.rookieCash
        let width = cash * 5
        that.setData({
          opened: true,
          url: "http://res.hodanet.com/upload/sy/20210019/18/newReward2.png",
          rookieCash: res.data.DATA.rookieCash,
          cash: cash,
          width: width
        })
      }
    })

  },
  close(e) {
    this.setData({
      right: false,
      alert: false
    })
    this.changeQ()
  },
  close2(e) {
    this.setData({
      first: false,
    })
  },
  tixian() {
    let cash=this.data.cash
    wx.navigateTo({
      url: "/pages/pay/pay?cash="+cash
    })
  },
  card() {
    let card = this.data.card || 0
    let successAnswer = this.data.num || 0
    wx.navigateTo({
      url: "/pages/card/card?card=" + card + "&successAnswer=" + successAnswer
    })
  }
})