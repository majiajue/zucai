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
  draw_circle: function (x, num, r, rate, cicle_color, cxt_arc) {
    cxt_arc.setFontSize(14)//圆心文字
    cxt_arc.fillText(num+'%', x - 13, 40)
    cxt_arc.setStrokeStyle('#d2d2d2');//下层圆
    cxt_arc.beginPath();
    cxt_arc.arc(x, 35, r, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.setStrokeStyle(cicle_color);//上层圆
    cxt_arc.beginPath();
    cxt_arc.arc(x, 35, r, -Math.PI / 2, Math.PI * 2 * rate - Math.PI / 2, false);
    cxt_arc.stroke();
    return cxt_arc
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 
  },
  onReady: function () {
    // 页面渲染完成 
    //预测的饼图
    var windowWidth = 160;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      windowWidth = parseInt(windowWidth*0.388)
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
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
      width: windowWidth,
      height: 160,
      dataLabel: false,
      legend: true,
      background: '#F8F8F8',
      padding: 0
    });
    //交战信息的圆圈
    var that = this;
    var cxt_arc = wx.createCanvasContext('canvasArc');
    var width = wx.getSystemInfoSync().windowWidth
    console.log(width)
    cxt_arc.setLineWidth(4);
    cxt_arc.setLineCap('round')
    var r = parseInt(width * 0.061)
    cxt_arc = that.draw_circle(100, 55, r, 0.5, '#b35c69', cxt_arc)
    cxt_arc = that.draw_circle(260, 45, r, 0.5, '#668fa3', cxt_arc)
    cxt_arc.draw(); 
    var ctx = wx.createCanvasContext('canvasLine1')
    ctx.setLineCap('round')
    ctx.setLineWidth(6)
    ctx.setStrokeStyle('#d2d2d2');
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.lineTo(140, 20)
    ctx.stroke()
    ctx.setStrokeStyle('#b35c69');
    ctx.beginPath();
    ctx.moveTo(20, 20)
    ctx.lineTo(80, 20)
    ctx.stroke()
    ctx.draw()

    ctx = wx.createCanvasContext('canvasLine2')
    ctx.setLineCap('round')
    ctx.setLineWidth(6)
    ctx.setStrokeStyle('#d2d2d2');
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.lineTo(140, 20)
    ctx.stroke()
    ctx.setStrokeStyle('#668fa3');
    ctx.beginPath();
    ctx.moveTo(20, 20)
    ctx.lineTo(80, 20)
    ctx.stroke()
    ctx.draw()
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