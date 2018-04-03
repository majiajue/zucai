Page({
  data: {
    navTab: ["即时", "赛果", "赛程", "胜负彩"],
    currentNavtab: "0",
    feed: [],
    feed_length: 0,
    page: 1,
    isAllDisplayed: false
  },
  onLoad: function () {
    this.getData();
  },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  upper: function (e) {
    wx.showNavigationBarLoading()
    var that = this
    this.setData({
      page: 1
    })
    that.getData();
    setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
  },
  lower: function (e) {
    var that = this
    that.nextLoad()
  },
  //跳转
  openDetail: function (event) {
    var match_id = event.currentTarget.dataset.match_id;
    var team_a = event.currentTarget.dataset.team_a;
    var team_b = event.currentTarget.dataset.team_b;
    var icon_a = event.currentTarget.dataset.icon_a;
    var icon_b = event.currentTarget.dataset.icon_b;
    var win = event.currentTarget.dataset.win;
    var deuce = event.currentTarget.dataset.deuce;
    var lose = event.currentTarget.dataset.lose;
    wx.navigateTo({
      url: '../match/datails/details?match_id=' + match_id + '&team_a=' + team_a + '&team_b=' + team_b + '&icon_a=' + icon_a + '&icon_b=' + icon_b + '&win=' + win + '&deuce=' + deuce + '&lose=' + lose
    })
  },
  //首次获取数据及刷新
  getData: function(){
    var that = this
    var feed_data = []
    wx.request({
      url: 'http://120.77.37.9:5000/api/zucai/zucai',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        'page': that.data.page,
        'flag': 'get_table_data'
      },
      method: 'POST',
      success: function (res) {
        feed_data = res.data.answer_data
        if (feed_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          that.setData({
            feed: feed_data,
            feed_length: feed_data.length
          })
        }
      }
    })
  },

  //继续加载
  nextLoad: function(){
    var that = this
    var next_data = []
    var last_data = ''
    for (var i = that.data.feed_length - 1 ; i >= 0; i--) {
      if (that.data.feed[i]['display_date']) {
        last_data = that.data.feed[i]['display_date']
        break
      }
    }
    that.setData({
      page: that.data.page + 1
    })
    wx.request({
      url: 'http://120.77.37.9:5000/api/zucai/zucai',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'page': that.data.page,
        'flag': 'get_table_data'
      },
      method: 'POST',
      success: function (res) {
        next_data = res.data.answer_data
        if (next_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          for (var i = 0; i < next_data.length; i++) {
            if (next_data[i]['display_date']) {
              if (next_data[i]['display_date'] == last_data){
                delete next_data[i]['display_date']
              }
              break
            }
          }
          that.setData({
            feed: that.data.feed.concat(next_data),
            feed_length: that.data.feed_length + next_data.length
          });
        }
      }
    })
  }
});
