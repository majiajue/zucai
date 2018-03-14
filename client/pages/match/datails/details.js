Page({
  data: {},
  //跳转
  openAnalyze: function (event) {
    wx.navigateTo({
      url: './analyze/basic/basic'
    })
  },
  draw_circle: function (x, num, r, rate, cicle_color, cxt_arc) {
    cxt_arc.setFontSize(14)//圆心文字
    cxt_arc.fillText(num, x-8, 35)
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
  },
  onReady: function () {
    // 页面渲染完成 
    var that = this;
    var cxt_arc = wx.createCanvasContext('canvasArc');
    var width = wx.getSystemInfoSync().windowWidth
    cxt_arc.setLineWidth(4);
    cxt_arc.setLineCap('round')
    var r = parseInt(width * 0.061)
    cxt_arc = that.draw_circle(parseInt(width * 0.088), 11, r, 0.5, '#b35c69', cxt_arc)
    cxt_arc = that.draw_circle(parseInt(width * 0.319), 12, r, 0.5, '#5e8b65', cxt_arc)
    cxt_arc = that.draw_circle(parseInt(width * 0.55), 12, r, 0.5, '#668fa2', cxt_arc)
    cxt_arc.draw(); 
  }
}) 