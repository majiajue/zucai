//answer.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    question_id: 0,
    answer_id : 0,
    feed: [],
    feed_length: 0
  },
  //事件处理函数
  toQuestion: function() {
    wx.navigateTo({
      url: '../question/question'
    })
  },
  onLoad: function (options) {
    var question_id = options.question_id;
    var answer_id = options.answer_id
    this.setData({ 
      question_id: question_id,
      answer_id: answer_id
    })
    var that = this;
    this.getData();
  },
  getData: function () {
    var feed = util.getData2();
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
  },
  tapName: function(event){
    console.log(event)
  }
})
