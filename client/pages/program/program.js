Page({
  data: {
    feed: [],
    weekday: ['周一','周二','周三','周四','周五','周六','周天'],
    feed_length: 0,
    page: 1,
    isAllDisplayed: false,
  },
  onLoad: function () {
    this.getData();
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
      url: './details?plan_id=' + plan_id
    })
  },
  //首次获取数据及刷新
  getData: function () {
    var that = this
    var feed_data = []
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/plan/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'page': that.data.page
      },
      method: 'POST',
      success: function (res) {
        feed_data = res.data.data.plan_list
        if (feed_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          for (var i = 0; i < feed_data.length; i++) {
            var time_distance = new Date().getTime() - new Date(feed_data[i].get_time).getTime()
            var day_distance = (time_distance / (24 * 3600 * 1000))
            var leave1 = time_distance   % (24 * 3600 * 1000)
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
            feed: feed_data,
            feed_length: feed_data.length,
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
      header: {
        'content-type': 'application/json'
      },
      data: {
        'page': that.data.page
      },
      method: 'POST',
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
            next_data[i].start_play = next_data[i].start_play.substring(5,16)
            next_data[i].weekday = that.data.weekday[next_data[i].weekday]
          }
          that.setData({
            feed: that.data.feed.concat(next_data),
            feed_length: that.data.feed_length + next_data.length,
          });
        }
      }
    })
  }
});
