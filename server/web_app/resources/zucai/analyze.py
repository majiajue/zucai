# _*_ coding:utf-8 _*_
"""
Created by yueliuxin on 2018/4/4
"""

from flask import request
from flask_restful import Resource
from web_app.models.model import HistoryMatch
from . import api_path

class Analyze(Resource):
    api_url = api_path + 'analyze'

    def __init__(self):
        self.datetime_format = '%Y-%m-%d %H:%M:%S'
        self.date_format = '%m-%d'

    def post(self):
        """
        post
        :return:
        """
        fun_dict = {
            'get_jibenmian': self.get_jibenmian
        }
        form_data = request.get_json()
        flag = form_data['flag']
        func = fun_dict.get(flag)
        if func is None:
            return {'state': 1, "msg": "未知操作"}
        return func(form_data)

    def get_jibenmian(self, form_data):
        """
        基本面
        :return:
        """
        team1 = form_data['team1']
        team2 = form_data['team2']
        table_data = []
        fight_result = []
        #  历史交战
        data1 = HistoryMatch.query.filter(HistoryMatch.team1 == team1) \
            .filter(HistoryMatch.team2 == team2).all()
        data2 = HistoryMatch.query.filter(HistoryMatch.team1 == team1) \
            .filter(HistoryMatch.team2 == team2).all()
        data = data1+ data2
        history_fight = []
        if data:
            win = 0
            deuce = 0
            lose = 0
            for item in data:
                item = item.to_dict()
                if item['score1'] == item['score2']:
                    deuce += 1
                if item['team1'] == team1 and item['score1'] > item['score2']:
                    win += 1
                elif item['team1'] == team1 and item['score1'] < item['score2']:
                    lose += 1
                elif item['team2'] == team1 and item['score2'] > item['score1']:
                    win += 1
                elif item['team2'] == team1 and item['score2'] < item['score1']:
                    lose += 1
                history_fight.append([item['time'], item['alience'], item['team1'],
                                      item['score1'], item['score2'], item['team2']])
            fight_result.append('历史交战\t' + str(win) + '\t胜\t' + str(deuce) + '\t平\t' + str(lose) + '\t负')
            table_data.append(history_fight)
        #  主队最近8场
        data = HistoryMatch.query.filter(HistoryMatch.team1 == team1).order_by(HistoryMatch.time).limit(8)
        if data:
            win = 0
            deuce = 0
            lose = 0
            history_fight = []
            for item in data:
                item = item.to_dict()
                if item['score1'] == item['score2']:
                    deuce += 1
                if item['team1'] == team1 and item['score1'] > item['score2']:
                    win += 1
                elif item['team1'] == team1 and item['score1'] < item['score2']:
                    lose += 1
                history_fight.append([item['time'], item['alience'], item['team1'],
                                      item['score1'], item['score2'], item['team2']])
            fight_result.append('主队最近战绩\t' + str(win) + '\t胜\t' + str(deuce) + '\t平\t' + str(lose) + '\t负')
            table_data.append(history_fight)
        #  主队最近主场
        data = HistoryMatch.query.filter(HistoryMatch.team1 == team1) \
            .filter(HistoryMatch.is_main_team1 == 1).order_by(HistoryMatch.time).all()
        if data:
            win = 0
            deuce = 0
            lose = 0
            history_fight = []
            for item in data:
                item = item.to_dict()
                if item['score1'] == item['score2']:
                    deuce += 1
                if item['team1'] == team1 and item['score1'] > item['score2']:
                    win += 1
                elif item['team1'] == team1 and item['score1'] < item['score2']:
                    lose += 1
                history_fight.append([item['time'], item['alience'], item['team1'],
                                      item['score1'], item['score2'], item['team2']])
            fight_result.append('主队最近主场\t' + str(win) + '\t胜\t' + str(deuce) + '\t平\t' + str(lose) + '\t负')
            table_data.append(history_fight)
        #  客队最近8场
        data = HistoryMatch.query.filter(HistoryMatch.team1 == team2).order_by(HistoryMatch.time).limit(8)
        if data:
            win = 0
            deuce = 0
            lose = 0
            history_fight = []
            for item in data:
                item = item.to_dict()
                if item['score1'] == item['score2']:
                    deuce += 1
                if item['team1'] == team2 and item['score1'] > item['score2']:
                    win += 1
                elif item['team1'] == team2 and item['score1'] < item['score2']:
                    lose += 1
                history_fight.append([item['time'], item['alience'], item['team1'],
                                      item['score1'], item['score2'], item['team2']])
            fight_result.append('客队最近战绩\t' + str(win) + '\t胜\t' + str(deuce) + '\t平\t' + str(lose) + '\t负')
            table_data.append(history_fight)
        #  客队最近客场
        data = HistoryMatch.query.filter(HistoryMatch.team1 == team2) \
            .filter(HistoryMatch.is_main_team1 == 0).order_by(HistoryMatch.time).all()
        if data:
            win = 0
            deuce = 0
            lose = 0
            history_fight = []
            for item in data:
                item = item.to_dict()
                if item['score1'] == item['score2']:
                    deuce += 1
                if item['team1'] == team2 and item['score1'] > item['score2']:
                    win += 1
                elif item['team1'] == team2 and item['score1'] < item['score2']:
                    lose += 1
                history_fight.append([item['time'], item['alience'], item['team1'],
                                      item['score1'], item['score2'], item['team2']])
            fight_result.append('客队最近客场\t' + str(win) + '\t胜\t' + str(deuce) + '\t平\t' + str(lose) + '\t负')
            table_data.append(history_fight)
        return {"status": 0, "msg": "获取详情成功", "fight_history": table_data, "fight_result": fight_result}





