# _*_ coding:utf-8 _*_
"""
Created by yueliuxin on 2018/3/8
"""

from flask import request
from flask_restful import Resource
from web_app.models.model import Match, db
from . import api_path
import datetime


class LoginManage(Resource):
    api_url = [api_path + 'zucai', api_path + 'zucai/<flag>']

    def __init__(self):
        self.datetime_format = '%Y-%m-%d %H:%M:%S'
        self.date_format = '%m-%d'

    def get(self):
        """
        :return:
        """
        data = []
        ex_data = db.session.query(
            Match
        ).limit(5)
        if ex_data:
            for item in ex_data:
                tmp = item.to_dict()
                start_time = datetime.datetime.strptime(tmp['start_time'], self.datetime_format)
                tmp['display_date'] = datetime.datetime.strftime(start_time, '%m-%d')
                tmp['display_time'] = datetime.datetime.strftime(start_time, '%H:%M')
                end_time = start_time + datetime.timedelta(minutes=105)
                if datetime.datetime.now() < start_time:
                    tmp['start_status'] = 0
                elif start_time <= datetime.datetime.now() <= end_time:
                    tmp['start_status'] = 1
                elif datetime.datetime.now() > end_time:
                    tmp['start_status'] = 2
                data.append(tmp)
        return {"status": 0, "msg": "获取首页成功", "answer_data": data}

    def post(self, **kwargs):
        """
        post
        :return:
        """
        fun_dict = {
            'get_table_data': self.get_table_data
        }
        if 'flag' in kwargs:
            flag_name = kwargs.get('flag')
            form_data = request.get_json()
            fun = fun_dict.get(flag_name)
            if fun:
                return fun(form_data)
        else:
            return {'status': 1, 'msg': '未知请求'}, 401

    def get_table_data(self, form_data):
        """
        获得表格数据
        :return:
        """
        """
        query = LoginInfo.query.filter(
            LoginInfo.account == account if account else text('')
        ).filter(
            LoginInfo.phone == phoneNumber if phoneNumber else text('')
        )
        if gameId != 0:
            query = query.filter(LoginInfo.game_id == gameId)
        data = query.order_by(
            LoginInfo.id.desc()
        ).all()
        """

        data = [{'account': u'987', 'last_login_time': '2018-08-08 10:10:10',
                 'ip': u'22.22.22.22', 'phone': u'13311111111', 'game_id': 104, 'id': 3},
                {'account': u'321', 'last_login_time': '2018-01-01 10:10:10',
                 'ip': u'11.11.11.11', 'phone': u'13387654321', 'game_id': 104, 'id': 2},
                {'account': u'123', 'last_login_time': '2018-02-07 15:23:36',
                 'ip': u'12.12.12.12', 'phone': u'13312345678', 'game_id': 102, 'id': 1}]

        table_data = []
        for item in data:
            if item['game_id'] == 102:
                gameName = '我在大清当皇帝'
            elif item['game_id'] == 104:
                gameName = '叫我万岁爷'
            else:
                gameName = '未知'
            account = item['account']
            isFrozen = True
            isIpBlocked = True
            gameId = item['game_id']
            phoneNumber = item['phone']
            lastLoginTime = item['last_login_time']
            lastLoginIp = item['ip']
            table_data.append({'gameId': gameId, 'gameName': gameName, 'account': account, 'phoneNumber': phoneNumber,
                               'lastLoginTime': lastLoginTime, 'lastLoginIp': lastLoginIp,
                               'isFrozen': isFrozen, 'isIpBlocked': isIpBlocked})
        return {'status': 0, 'msg': '', 'tableData': table_data}





