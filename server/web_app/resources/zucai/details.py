# _*_ coding:utf-8 _*_
"""
Created by yueliuxin on 2018/3/8
"""

from flask import request
from flask_restful import Resource
from web_app.models.model import Details
from . import api_path

class DetailsGet(Resource):
    api_url = api_path + 'details'

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
        match_id = form_data['match_id']
        data = Details.query.filter(Details.id == match_id).first()
        if data:
            data = data.to_dict()
            for item in data:
                if item != 'id':
                    data[item] = data[item].split(',')
        return {"status": 0, "msg": "获取详情成功", "answer_data": data}





