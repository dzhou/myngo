# -*- coding: utf-8 -*-

import conf
import connection
import pp
import pymongo
import os
import simplejson
import tornado.web

class BaseHandler(tornado.web.RequestHandler):

    @property
    def c(self):
        return pymongo.Connection(conf.MONGO_HOST, conf.MONGO_PORT)

    # def finish(self, chunk=None):
    #     self.c.end_request()
    #     super(BaseHandler, self).finish(chunk=chunk)

    def render(self, template_name, **kwargs):
        kwargs.update({'format': pp})
        if not kwargs.get('nav_section'):
            kwargs.update({'nav_section': 'db'})
        path = os.path.join(conf.TEMPLATE_PATH, template_name)
        super(BaseHandler, self).render(path, **kwargs)

    def respond_back_result(self, result, **kwargs):
        """ Transforms MongoDB command result to JSON. """
        rok = int(result['ok'])
        if rok == 1:
            d = {'success': True}
            d.update(kwargs)
            self.write(simplejson.dumps(d))
        else:
            self.write(simplejson.dumps({'success': False}))

        self.finish()

class DatabaseHandler(BaseHandler):

    def get(self):
        # TODO: add auth
        table = {'headers': ('DB names', 'Collections', 'Actions'),
                 'rows': [[db, self.c[db].collection_names()] for db in self.c.database_names()]}
        self.render('db_list.html', table=table)


class CollectionHandler(BaseHandler):

    def get(self, db_name):
        table = {'headers': ('Name', 'No. of documents'),
                 'rows': [[coll, self.c[db_name][coll].count()]
                          for coll in self.c[db_name].collection_names()]}
        self.render('coll_list.html', table=table, db_name=db_name)

class CollectionDetailHandler(BaseHandler):

    def get(self, db_name, coll_name):
        # TODO: collections; sort by object IDs, column will be all top-level keys
        page = self.get_argument('page', 0)
        sort_by = self.get_argument('sort_by')
        cursor = self.c[db_name][coll_name].find()
        objects = cursor.sort('_id').skip(page * 50).limit(50)
        headers = set()
        # TODO: decide if to use own fork of Tornado with sessions
        #       as so I could easily display columns, remember sorting
        #       direction etc.
        #       OK, this may not be necessary; check this documtent
        #       http://www.mongodb.org/display/DOCS/UI and Futon for CouchDB
        #       to get inspiration on what features to implement
            
        count = cursor.count()        
        pass

class LogHandler(BaseHandler):
    pass

class ShellHandler(BaseHandler):
    pass

class ServerInfoHandler(BaseHandler):

    def get(self):
        si = self.c.server_info()
        server_data = {'version': si['version'],
                       'status': si['ok'],
                       'host': self.c.host,
                       'port': self.c.port,
                       'system': si['sysInfo']}
        replication_data = {}
        sharding_data = {}
        self.render('server_info.html',
                    server_data=server_data,
                    replication_data=replication_data,
                    sharding_data=sharding_data,
                    nav_section='si')


urls = [(r'/', DatabaseHandler),
        (r'/_log/?$', LogHandler),
        (r'/_shell/?$', ShellHandler),
        (r'/_server/?$', ServerInfoHandler),
        (r'/(?P<db_name>[^_]\S+)/(?P<coll_name>\S+[^/])/?$', CollectionDetailHandler),
        (r'/(?P<db_name>[^_]\S+[^/])/?$', CollectionHandler),
        ]
