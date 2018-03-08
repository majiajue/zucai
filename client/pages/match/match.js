var util = require('../../utils/util.js')
Page({
  data: {
    navTab: ["即时", "赛果", "赛程", "胜负彩"],
    currentNavtab: "0",
    feed: [],
    feed_length: 0
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    this.refresh();
  },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },

  bindItemTap: function(event) {
    var question_id = event.currentTarget.dataset.question_id;
    var answer_id = event.currentTarget.dataset.answer_id;
    wx.navigateTo({
      url: '../answer/answer?question_id=' + question_id + '&answer_id=' + answer_id
    })
  },
  bindQueTap: function () {
    var question_id = event.currentTarget.dataset.question_id;
    wx.navigateTo({
      url: '../question/question?question_id=' + question_id
    })
  },
  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
  },

  //网络请求数据, 实现刷新
  refresh0: function(){
    var index_api = '';
    util.getData(index_api)
        .then(function(data){
          //this.setData({
          //
          //});
        });
  },

  //使用本地 fake 数据实现刷新效果
  refresh: function(){
    var feed = util.getData2();
    var feed_data = feed.data;
    this.setData({
      feed:feed_data,
      feed_length: feed_data.length
    });
  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function(){
    var next = util.discoveryNext();
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
  }
});
