Page({
  data: {
    feed: [],
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
            feed_data[i].start_play = feed_data[i].start_play.substring(5, 16)
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
            next_data[i].start_play = next_data[i].start_play.substring(5,16)
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
