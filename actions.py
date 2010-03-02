# -*- coding: utf-8 -*-

from handlers import BaseHandler
from pymongo.son import SON
import tornado.web

class CloneDatabase(BaseHandler):

    def post(self):
        original = self.get_argument('original')
        new = self.get_argument('new')
        cmd = SON([('copydb', 1),
                   ('fromdb', original),
                   ('todb', new)])
        result = self.c['admin'].command(cmd, check=False)
        self.respond_back_result(result)


class DropDatabase(BaseHandler):

    def post(self):
        db = self.get_argument('db')
        cmd = SON(data={'dropDatabase': 1})
        result = self.c[db].command(cmd, check=False)
        self.respond_back_result(result)


class RepairDatabase(BaseHandler):

    def post(self):
        db = self.get_argument('db')
        cmd = SON(data={'repairDatabase': 1})
        result = self.c[db].command(cmd, check=False)
        self.respond_back_result(result)

    

urls = [(r'/x_clone_db/?$', CloneDatabase),
        (r'/x_drop_db/?$', DropDatabase),
        (r'/x_repair_db/?$', RepairDatabase),
        ]
