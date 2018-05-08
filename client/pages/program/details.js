Page({
  data: {
    feed: [],
    weekday: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
    plan_id: 0
  },
  onLoad: function (options) {
    var plan_id = options.plan_id
    this.setData({
      plan_id: plan_id
    })
    this.getData();
  },
  //首次获取数据及刷新
  getData: function () {
    var that = this
    var feed_data = []
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/plan/detail',
      data: {
        'plan_id': that.data.plan_id
      },
      method: 'GET',
      success: function (res) {
        feed_data = res.data.data
        feed_data.weekday = that.data.weekday[feed_data.weekday]
        feed_data.start_play = feed_data.start_play.substring(5,16)
        feed_data.get_time = feed_data.get_time.substring(5, 16)
        that.setData({
          feed: feed_data
        })
      }
    })
  }
});
