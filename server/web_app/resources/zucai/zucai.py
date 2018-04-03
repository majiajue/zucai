# _*_ coding:utf-8 _*_
"""
Created by yueliuxin on 2018/3/8
"""

from flask import request
from flask_restful import Resource
from web_app.models.model import Match, db
from . import api_path
import datetime


class Zucai(Resource):
    api_url = api_path + 'zucai'

    def __init__(self):
        self.datetime_format = '%Y-%m-%d %H:%M:%S'
        self.date_format = '%m-%d'

    def post(self):
        """
        post
        :return:
        """
        fun_dict = {
            'get_table_data': self.get_table_data
        }
        form_data = request.get_json()
        flag = form_data['flag']
        func = fun_dict.get(flag)
        if func is None:
            return {'state': 1, "msg": "未知操作"}
        return func(form_data)

    def get_table_data(self, form_data):
        """
        获得表格数据
        :return:
        """
        page = form_data['page']
        data = []
        ex_data = db.session.query(
            Match
        ).order_by(Match.start_time).limit(8).offset(page * 8 - 8)
        if ex_data.count() > 0:
            last_display_date = datetime.datetime. \
                strftime(datetime.datetime.strptime(ex_data[0].to_dict()['start_time'], self.datetime_format), '%m-%d')
            for item in ex_data:
                tmp = item.to_dict()
                start_time = datetime.datetime.strptime(tmp['start_time'], self.datetime_format)
                end_time = start_time + datetime.timedelta(minutes=105)
                if datetime.datetime.now() < start_time:
                    tmp['start_status'] = 0
                elif start_time <= datetime.datetime.now() <= end_time:
                    tmp['start_status'] = 1
                elif datetime.datetime.now() > end_time:
                    tmp['start_status'] = 2
                display_date = datetime.datetime.strftime(start_time, '%m-%d')
                if display_date != last_display_date:
                    tmp['display_date'] = display_date
                    last_display_date = display_date
                tmp['display_time'] = datetime.datetime.strftime(start_time, '%H:%M')
                data.append(tmp)
            data[0]['display_date']\
                = datetime.datetime.strftime(datetime.datetime.strptime(ex_data[0].to_dict()['start_time'],
                                                                            self.datetime_format), '%m-%d')
        return {"status": 0, "msg": "获取首页成功", "answer_data": data}





