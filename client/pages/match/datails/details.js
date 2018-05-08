Page({
  data: {
    match_id: 0,
    team_a: '',
    team_a: '',
    icon_b: '',
    icon_b: '',
    win: '',
    deuce: '',
    lose: '',
    feed: ''
  },
  //跳转
  openAnalyze: function (event) {
    wx.navigateTo({
      url: './analyze/basic/basic?match_id=' + this.data.match_id + '&team_a=' + this.data.team_a + '&team_b=' + this.data.team_b + '&icon_a=' + this.data.icon_a + '&icon_b=' + this.data.icon_b + '&win=' + this.data.win + '&deuce=' + this.data.deuce + '&lose=' + this.data.lose
    })
  },
  draw_circle: function (x, num, r, rate, cicle_color, cxt_arc) {
    cxt_arc.setFontSize(14)//圆心文字
    var fontX = x-8
    if (num < 10) {
      x -= 5
    }
    cxt_arc.fillText(num, fontX, 35)
    cxt_arc.setStrokeStyle('#d2d2d2');//下层圆
    cxt_arc.beginPath();
    cxt_arc.arc(x, 30, r, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.setStrokeStyle(cicle_color);//上层圆
    cxt_arc.beginPath();
    cxt_arc.arc(x, 30, r, -Math.PI / 2, Math.PI * 2 * rate - Math.PI / 2, false);
    cxt_arc.stroke();
    return cxt_arc
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
    var that = this
    var feed_data = []
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/match/summary',
      data: {
        'match_id': match_id
      },
      method: 'GET',
      success: function (res) {
        feed_data = res.data.data
        that.setData({
          feed: feed_data
        })
        var cxt_arc = wx.createCanvasContext('canvasArc');
        var width = wx.getSystemInfoSync().windowWidth
        cxt_arc.setLineWidth(4);
        cxt_arc.setLineCap('round')
        var r = parseInt(width * 0.061)
        cxt_arc = that.draw_circle(parseInt(width * 0.088), that.data.feed.total_company_stat.comp_num_list[0], r, that.data.feed.total_company_stat.comp_num_list[0] / that.data.feed.total_company_stat.comp_count, '#b35c69', cxt_arc)
        cxt_arc = that.draw_circle(parseInt(width * 0.319), that.data.feed.total_company_stat.comp_num_list[1], r, that.data.feed.total_company_stat.comp_num_list[1] / that.data.feed.total_company_stat.comp_count, '#5e8b65', cxt_arc)
        cxt_arc = that.draw_circle(parseInt(width * 0.57), that.data.feed.total_company_stat.comp_num_list[2], r, that.data.feed.total_company_stat.comp_num_list[2] / that.data.feed.total_company_stat.comp_count, '#668fa2', cxt_arc)
        cxt_arc.draw(); 
      }
    })
  },
  onReady: function () {
    // 页面渲染完成 
    
  }
}) 