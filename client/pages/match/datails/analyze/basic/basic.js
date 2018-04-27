// pages/match/datails/analyze/basic/basic.js
var wxCharts = require('../../../../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({
  data: {
    // navTab_top: ["分析", "预测", "赔率", "赛况", "评论"],
    navTab_top: ["分析", "预测", "赔率", "赛况"],
    navTab_next: ["基本面", "盘面", "阵容", "积分", "交战信息"],
    currentNavtab_top: "0",
    currentNavtab_next: "0",
    match_id: 0,
    team_a: '',
    team_a: '',
    icon_b: '',
    icon_b: '',
    win: '',
    deuce: '',
    lose: '',
    fight_history: '',
    fight_result: ''
  },
  switchTab_top: function (e) {
    if (e.currentTarget.dataset.idx == 0) {
      var that = this
      var fight_history = []
      var fight_result = []
      wx.request({
        url: 'http://120.77.37.9:5000/api/zucai/analyze',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          'team1': that.data.team_a,
          'team2': that.data.team_b,
          'flag': 'get_jibenmian'
        },
        method: 'POST',
        success: function (res) {
          fight_history = res.data.fight_history
          fight_result = res.data.fight_result
          that.setData({
            fight_history: fight_history,
            fight_result: fight_result
          })
        }
      })
      this.setData({
        currentNavtab_next: 0
      });
    }
    if (e.currentTarget.dataset.idx == 1) {
      //预测的饼图
      var windowWidth = 160;
      try {
        var res = wx.getSystemInfoSync();
        windowWidth = parseInt(res.windowWidth * 0.42)
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
    }
    this.setData({
      currentNavtab_top: e.currentTarget.dataset.idx
    });
  },
  switchTab_next: function (e) {
    if (e.currentTarget.dataset.idx == 4) {
      //交战信息的圆圈
      var that = this;
      var width = wx.getSystemInfoSync().windowWidth
      var r = parseInt(width * 0.058)
      //画两个圆(x1, x2，胜率1，胜率2，颜色1，颜色2，半径，canvans_id)(胜率用小数表示，如0.5)
      that.draw_two_circle(parseInt(width * 0.243), parseInt(width * 0.631), 0.55, 0.45, r, 'two_circle1')
      that.draw_two_circle(parseInt(width * 0.243), parseInt(width * 0.631), 0.55, 0.45, r, 'two_circle2')
      that.draw_two_circle(parseInt(width * 0.243), parseInt(width * 0.631), 0.55, 0.45, r, 'two_circle3')
      that.draw_two_circle(parseInt(width * 0.243), parseInt(width * 0.631), 0.55, 0.45, r, 'two_circle4')
      that.draw_three_circle(parseInt(width * 0.146), parseInt(width * 0.437), parseInt(width * 0.728), 0.5, 0, 0.5, '#528259', r, 'three_circle')
      //交战信息的进度条
      that.draw_line('canvasLine1', '#b35c69')
      that.draw_line('canvasLine2', '#668fa3')
      that.draw_line('canvasLine3', '#b35c69')
      that.draw_line('canvasLine4', '#668fa3')
    }
    this.setData({
      currentNavtab_next: e.currentTarget.dataset.idx
    });
  },



  draw_circle: function (x, num, r, rate, cicle_color, cxt_arc) {
    var num_place = x-13
    if(num<10){
      num_place = x-11
    }
    cxt_arc.setFontSize(14)//圆心文字
    cxt_arc.fillText(num+'%', num_place, 40)
    cxt_arc.setStrokeStyle('#d2d2d2');//下层圆
    cxt_arc.beginPath();
    cxt_arc.arc(x, 35, r, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    if (rate != 0) {
      cxt_arc.setStrokeStyle(cicle_color);//上层圆
      cxt_arc.beginPath();
      cxt_arc.arc(x, 35, r, -Math.PI / 2, Math.PI * 2 * rate - Math.PI / 2, false);
      cxt_arc.stroke();
    }
    return cxt_arc
  },
  draw_two_circle: function (x1, x2, rate1, rate2, r, circle_id) {
    var that = this;
    var cxt_arc = wx.createCanvasContext(circle_id);
    cxt_arc.setLineWidth(4);
    cxt_arc.setLineCap('round')
    var num1 = parseInt(rate1 * 100)
    var num2 = parseInt(rate2 * 100)
    cxt_arc = that.draw_circle(x1, num1, r, rate1, '#b35c69', cxt_arc)
    cxt_arc = that.draw_circle(x2, num2, r, rate2, '#668fa3', cxt_arc)
    cxt_arc.draw(); 
  },
  draw_three_circle: function (x1, x2, x3, rate1, rate2, rate3, color, r, circle_id) {
    var that = this;
    var cxt_arc = wx.createCanvasContext(circle_id);
    cxt_arc.setLineWidth(4);
    cxt_arc.setLineCap('round')
    var num1 = parseInt(rate1 * 100)
    var num2 = parseInt(rate2 * 100)
    var num3 = parseInt(rate3 * 100)
    cxt_arc = that.draw_circle(x1, num1, r, rate1, '#b35c69', cxt_arc)
    cxt_arc = that.draw_circle(x2, num2, r, rate2, color, cxt_arc)
    cxt_arc = that.draw_circle(x3, num3, r, rate3, '#668fa3', cxt_arc)
    cxt_arc.draw();
  },
  draw_line: function (line_id, line_color) {
    var ctx = wx.createCanvasContext(line_id)
    ctx.setLineCap('round')
    ctx.setLineWidth(6)
    ctx.setStrokeStyle('#d2d2d2');
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.lineTo(140, 20)
    ctx.stroke()
    ctx.setStrokeStyle(line_color);
    ctx.beginPath();
    ctx.moveTo(20, 20)
    ctx.lineTo(80, 20)
    ctx.stroke()
    ctx.draw()
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 
    var match_id = options.match_id
    var team_a = options.team_a
    var team_b = options.team_b
    var icon_a = options.icon_a
    var icon_b = options.icon_b
    var win = options.win
    var deuce = options.deuce
    var lose = options.lose
    this.setData({
      match_id: match_id,
      team_a: team_a,
      team_b: team_b,
      icon_a: icon_a,
      icon_b: icon_b,
      win: win,
      deuce: deuce,
      lose: lose
    })
    
  },
  onReady: function () {
    // 页面渲染完成 
    var that = this
    var fight_history = []
    var fight_result = []
    wx.request({
      url: 'http://120.77.37.9:5000/api/zucai/analyze',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'team1': that.data.team_a,
        'team2': that.data.team_b,
        'flag': 'get_jibenmian'
      },
      method: 'POST',
      success: function (res) {
        fight_history = res.data.fight_history
        fight_result = res.data.fight_result
        that.setData({
          fight_history: fight_history,
          fight_result: fight_result
        })
      }
    })
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