Page({
  data: {
    // navTab: ["即时", "赛果", "赛程", "胜负彩"],
    navTab: ["即时", "完场"],
    currentNavtab: "0",
    feed: [],
    feed_length: 0,
    page: 1,
    isAllDisplayed: false,
    old_date_utc: '',
    is_finished: 0,
    loading: false,
    open_plan_list: 0
  },
  onLoad: function () {
    var that = this
    this.getData()
    that.setData({
      open_plan_list: 0
    })
  },
  switchTab: function(e){
    if (e.currentTarget.dataset.idx == 0) {
      this.setData({
        is_finished: 0,
        old_date_utc: ''
      })
    } else if (e.currentTarget.dataset.idx == 1) {
      this.setData({
        is_finished: 1,
        old_date_utc: ''
      })
    }
    this.getData();
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
    var that = this
    var match_id = event.currentTarget.dataset.match_id;
    var team_a = event.currentTarget.dataset.team_a;
    var team_b = event.currentTarget.dataset.team_b;
    var icon_a = event.currentTarget.dataset.icon_a;
    var icon_b = event.currentTarget.dataset.icon_b;
    var win = event.currentTarget.dataset.win;
    var deuce = event.currentTarget.dataset.deuce;
    var lose = event.currentTarget.dataset.lose;
    wx.navigateTo({
      url: '../match/datails/details?match_id=' + match_id + '&team_a=' + team_a + '&team_b=' + team_b + '&icon_a=' + icon_a + '&icon_b=' + icon_b + '&win=' + win + '&deuce=' + deuce + '&lose=' + lose + '&open_plan_list=' + that.data.open_plan_list 
    })
  },
  openPlanList: function (event) {
    var that = this
    that.setData({
      open_plan_list: 1
    })
    var that = this
    var match_id = event.currentTarget.dataset.match_id;
    var team_a = event.currentTarget.dataset.team_a;
    var team_b = event.currentTarget.dataset.team_b;
    var icon_a = event.currentTarget.dataset.icon_a;
    var icon_b = event.currentTarget.dataset.icon_b;
    var win = event.currentTarget.dataset.win;
    var deuce = event.currentTarget.dataset.deuce;
    var lose = event.currentTarget.dataset.lose;
    wx.navigateTo({
      url: '../match/datails/analyze/basic/basic?match_id=' + match_id + '&team_a=' + team_a + '&team_b=' + team_b + '&icon_a=' + icon_a + '&icon_b=' + icon_b + '&win=' + win + '&deuce=' + deuce + '&lose=' + lose + '&open_plan_list=' + that.data.open_plan_list
    })
  },
  //首次获取数据及刷新
  getData: function(){
    var that = this
    var feed_data = []
    that.setData({  
      loading: true,
      old_date_utc: ''
    })
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/match/list',
      data:{
        'page': that.data.page,
        'is_finished': that.data.is_finished
      },
      method: 'GET',
      success: function (res) {
        feed_data = res.data.data.match_list
        if (feed_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          for (var i=0; i<feed_data.length; i++) {
            if (that.data.old_date_utc == feed_data[i]['date_utc']) {
              delete feed_data[i]['date_utc']
            } else {
              that.data.old_date_utc = feed_data[i]['date_utc']
              feed_data[i]['date_utc'] = feed_data[i]['date_utc'].substring(5)
            }
            feed_data[i]['time_utc'] = feed_data[i]['start_play'].substring(11, 16)
            feed_data[i]['odds'] = feed_data[i]['odds'].split(':')
          }
          that.setData({
            feed: feed_data,
            feed_length: feed_data.length,
            page: 1
          })
        }
      }
    })
    that.setData({ loading: false })
  },

  //继续加载
  nextLoad: function(){
    var that = this
    var next_data = []
    that.setData({
      page: that.data.page + 1,
      loading: true
    })
    wx.request({
      url: 'https://dat.soukoudai.com/api/v1/match/list',
      data: {
        'page': that.data.page,
        'is_finished': that.data.is_finished
      },
      method: 'GET',
      success: function (res) {
        next_data = res.data.data.match_list
        if (next_data.length == 0) {
          that.data.isAllDisplayed = true
        } else {
          for (var i = 0; i < next_data.length; i++) {
            if (that.data.old_date_utc == next_data[i]['date_utc']) {
              delete next_data[i]['date_utc']
            } else {
              that.data.old_date_utc = next_data[i]['date_utc']
              next_data[i]['date_utc'] = next_data[i]['date_utc'].substring(5)
            }
            next_data[i]['time_utc'] = next_data[i]['start_play'].substring(11, 16)
            next_data[i]['odds'] = next_data[i]['odds'].split(':')
          }
          that.setData({
            feed: that.data.feed.concat(next_data),
            feed_length: that.data.feed_length + next_data.length,
          });
        }
      }
    })
    that.setData({ loading: false })
  }
});
