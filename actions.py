# -*- coding: utf-8 -*-

from handlers import BaseHandler
from pymongo.son import SON
import tornado.web

#
# DB actions
#
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


#
# Collection Actions
#
class DropCollection(BaseHandler):

    def post(self):
        db = self.get_argument('db')
        coll = self.get_argument('coll')
        self.c[db].drop_collection(coll)
        self.respond_back_result({'ok': 1})


class RenameCollection(BaseHandler):

    def post(self):
        db = self.get_argument('db')
        original = self.get_argument('original')
        new = self.get_argument('new')
        self.c[db][original].rename(new)
        self.respond_back_result({'ok': 1})


class ValidateCollection(BaseHandler):

    def post(self):
        db = self.get_argument('db')
        coll = self.get_argument('coll')
        cmd = SON(data={'validate': coll})
        result = self.c[db].command(cmd, check=False)
        result['result'] = '<pre>'+result['result']+'</pre>' # format the string
        self.respond_back_result(result)
    

urls = [(r'/x_clone_db/?$', CloneDatabase),
        (r'/x_drop_db/?$', DropDatabase),
        (r'/x_repair_db/?$', RepairDatabase),
        (r'/x_drop_coll/?$', DropCollection),
        (r'/x_rename_coll/?$', RenameCollection),
        (r'/x_validate_coll/?$', ValidateCollection),
        ]

