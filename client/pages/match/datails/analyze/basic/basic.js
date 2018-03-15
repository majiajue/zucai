// pages/match/datails/analyze/basic/basic.js
var wxCharts = require('../../../../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
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
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 20,
        pie: {
          offsetAngle: 0
        }
      },
      title: {
        name: '负',
        color: '#7cb5ec',
        fontSize: 15
      },
      subtitle: {
        name: '45%',
        color: '#7cb5ec',
        fontSize: 15
      },
      series: [{
        name: '负',
        color: '#7cb5ec',
        data: 45,
        stroke: false
      }, {
        name: '平',
        color: '#52a83e',
        data: 20,
        stroke: false
      }, {
        name: '胜',
        color: '#db3b5e',
        data: 35,
        stroke: false
      }],
      disablePieStroke: true,//不显示间隔
      width: 160,
      height: 160,
      dataLabel: false,
      legend: true,
      background: '#F8F8F8',
      padding: 0
    });
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