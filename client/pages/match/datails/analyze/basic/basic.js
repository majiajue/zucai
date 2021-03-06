// pages/match/datails/analyze/basic/basic.js
var wxCharts = require('../../../../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({
  data: {
    // navTab_top: ["分析", "预测", "赔率", "赛况", "评论"],
    navTab_top: ["分析", "方案", "赔率", "赛况"],
    // navTab_next: ["基本面", "盘面", "阵容", "积分", "交战信息"],
    navTab_next: ["基本面", "积分"],
    navTab_rate: ["欧赔", "亚盘"],
    weekday: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
    currentNavtab_top: "0",
    currentNavtab_next: "0",
    currentNavtab_rate: "0",
    match_id: 0,
    team_a: '',
    team_a: '',
    icon_b: '',
    icon_b: '',
    win: '',
    deuce: '',
    lose: '',
    fight_history: [],
    ranking_data: [],
    rate_data: [],
    rate_avg_data: [],
    rate_asia_data: [],
    match_data_now: [],
    plan_data: [],
    plan_length: 0,
    page: 0,
    isAllDisplayed: false,
    open_plan_list: 0
  },
  upper: function (e) {
    wx.showNavigationBarLoading()
    var that = this
    this.setData({
      page: 1
    })
    that.getData();
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  },
  lower: function (e) {
    var that = this
    that.nextLoad()
  },
  //跳转
  openDetail: function (event) {
    var plan_id = event.currentTarget.dataset.plan_id;
    wx.navigateTo({
      url: '../../../../program/details?plan_id=' + plan_id
    })
  },
  //首次获取数据及刷新
  getData: function () {
    var that = this
    var feed_data = []
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/plan/list',
      data: {
        'page': that.data.page,
        'match_id': that.data.match_id
      },
      method: 'GET',
      success: function (res) {
        feed_data = res.data.data.plan_list
        if (feed_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          for (var i = 0; i < feed_data.length; i++) {
            var time_distance = new Date().getTime() - new Date(feed_data[i].get_time).getTime()
            var day_distance = (time_distance / (24 * 3600 * 1000))
            var leave1 = time_distance % (24 * 3600 * 1000)
            var hours_distance = Math.floor(leave1 / (3600 * 1000))
            var leave2 = leave1 % (3600 * 1000)
            var minutes_distance = Math.floor(leave2 / (60 * 1000))
            if (parseInt(day_distance) > 1) {
              feed_data[i].time_distance = day_distance.toString() + '天前'
            } else if (parseInt(hours_distance) > 1) {
              feed_data[i].time_distance = hours_distance.toString() + '小时前'
            } else if (parseInt(minutes_distance) > 1) {
              feed_data[i].time_distance = minutes_distance.toString() + '分钟前'
            } else {
              feed_data[i].time_distance = '0分钟前'
            }
            feed_data[i].start_play = feed_data[i].start_play.substring(5, 16)
            feed_data[i].weekday = that.data.weekday[feed_data[i].weekday]
          }
          that.setData({
            plan_data: feed_data,
            plan_length: feed_data.length,
            page: 1
          })
        }
      }
    })
  },
  //继续加载
  nextLoad: function () {
    var that = this
    var next_data = []
    that.setData({
      page: that.data.page + 1
    })
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/plan/list',
      data: {
        'page': that.data.page,
        'match_id': that.data.match_id
      },
      method: 'GET',
      success: function (res) {
        next_data = res.data.data.plan_list
        if (next_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          for (var i = 0; i < next_data.length; i++) {
            var time_distance = new Date().getTime() - new Date(next_data[i].get_time).getTime()
            var day_distance = (time_distance / (24 * 3600 * 1000))
            var leave1 = time_distance % (24 * 3600 * 1000)
            var hours_distance = Math.floor(leave1 / (3600 * 1000))
            var leave2 = leave1 % (3600 * 1000)
            var minutes_distance = Math.floor(leave2 / (60 * 1000))
            if (parseInt(day_distance) > 1) {
              next_data[i].time_distance = day_distance.toString() + '天前'
            } else if (parseInt(hours_distance) > 1) {
              next_data[i].time_distance = hours_distance.toString() + '小时前'
            } else if (parseInt(minutes_distance) > 1) {
              next_data[i].time_distance = minutes_distance.toString() + '分钟前'
            } else {
              next_data[i].time_distance = '0分钟前'
            }
            next_data[i].start_play = next_data[i].start_play.substring(5, 16)
            next_data[i].weekday = that.data.weekday[next_data[i].weekday]
          }
          that.setData({
            plan_data: that.data.plan_data.concat(next_data),
            plan_length: that.data.plan_length + next_data.length,
          });
        }
      }
    })
  },
  switchTab_top: function (e) {
    if (e.currentTarget.dataset.idx == 0) {
      var that = this
      var fight_history = []
      wx.request({
        url: 'https://dat.soukoudai.com/api/v1/match/detail',
        data: {
          'match_id': that.data.match_id,
        },
        method: 'GET',
        success: function (res) {
          fight_history = res.data.fight_history
          that.setData({
            fight_history: fight_history
          })
        }
      })
      this.setData({
        currentNavtab_next: 0
      });
    }
    if (e.currentTarget.dataset.idx == 1) {
      this.getData()
    }
    if (e.currentTarget.dataset.idx == 2) {
      var that = this
      var rate_data = []
      var rate_avg_data = []
      var rate_asia_data = []
      wx.request({
        url: 'https://dat.soukoudai.com/api/v1/match/odds',
        data: {
          'match_id': that.data.match_id,
        },
        method: 'GET',
        success: function (res) {
          rate_data = res.data.data.euro
          rate_avg_data = res.data.data.avg
          rate_asia_data = res.data.data.asia
          that.setData({
            rate_data: rate_data,
            rate_avg_data: rate_avg_data,
            rate_asia_data: rate_asia_data
          })
        }
      })
      this.setData({
        currentNavtab_rate: 0
      });
    }
    if (e.currentTarget.dataset.idx == 3) {
      var that = this
      var match_data_now = []
      wx.request({
        url: 'https://dat.soukoudai.com/api/v1/match/statistics',
        data: {
          'match_id': that.data.match_id,
        },
        method: 'GET',
        success: function (res) {
          match_data_now = res.data.data
          that.setData({
            match_data_now: match_data_now
          })
        }
      })
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
    if (e.currentTarget.dataset.idx == 1) {
      var that = this
      var ranking_data = []
      wx.request({
        url: 'https://dat.soukoudai.com/api/v1/match/ranking',
        data: {
          'match_id': that.data.match_id,
        },
        method: 'GET',
        success: function (res) {
          ranking_data = res.data.data.total_ranking_lst
          that.setData({
            ranking_data: ranking_data
          })
        }
      })
    }
    if (e.currentTarget.dataset.idx == 2) {
      var that = this
      var forecast_data = []
      wx.request({
        url: 'https://dat.soukoudai.com/api/v1/match/analysis',
        data: {
          'match_id': that.data.match_id,
        },
        method: 'GET',
        success: function (res) {
          forecast_data = res.data.data
          that.setData({
            forecast_data: forecast_data
          })
        }
      })
    }
    if (e.currentTarget.dataset.idx == 2) {
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
  switchTab_rate: function (e) {
    this.setData({
      currentNavtab_rate: e.currentTarget.dataset.idx
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
    var open_plan_list = options.open_plan_list
    this.setData({
      match_id: match_id,
      team_a: team_a,
      team_b: team_b,
      icon_a: icon_a,
      icon_b: icon_b,
      win: win,
      deuce: deuce,
      lose: lose,
      open_plan_list: open_plan_list
    })
    
  },
  onReady: function () {
    // 页面渲染完成 
    var that = this
    if (that.data.open_plan_list == 1) {
      that.getData()
      this.setData({
        currentNavtab_top: 1
      })
    }
    var fight_history = []
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/match/detail',
      data: {
        'match_id': that.data.match_id,
      },
      method: 'GET',
      success: function (res) {
        fight_history = res.data.data
        that.setData({
          fight_history: fight_history
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