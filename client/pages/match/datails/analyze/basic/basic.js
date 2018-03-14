// pages/match/datails/analyze/basic/basic.js
Page({
  data: {
    navTab_top: ["分析", "预测", "赔率", "赛况", "评论"],
    navTab_next: ["基本面", "盘面", "阵容", "积分", "交战信息"],
    currentNavtab_top: "0",
    currentNavtab_next: "0"
  },
  switchTab_top: function (e) {
    this.setData({
      currentNavtab_top: e.currentTarget.dataset.idx
    });
  },
  switchTab_next: function (e) {
    this.setData({
      currentNavtab_next: e.currentTarget.dataset.idx
    });
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 
  },
  onReady: function () {
    // 页面渲染完成 
  },
  onShow: function () {
    // 页面显示 
  },
  onHide: function () {
    // 页面隐藏 
  },
  onUnload: function () {
    // 页面关闭 
  }
})