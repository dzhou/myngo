# -*- coding: utf-8 -*-

import actions
import conf
import handlers
import tornado
import tornado.httpserver
import tornado.web

class Myngo(tornado.web.Application):

    def __init__(self):
        settings = {'cookie_secret': conf.SECRET,
                    'xsrf_cookies': True,
                    'template_path': conf.TEMPLATE_PATH,
                    'static_path': conf.STATIC_PATH,
                    'debug': conf.DEBUG}
        # super(Myngo, self).__init__(handlers, **settings)
        tornado.web.Application.__init__(self, actions.urls+handlers.urls, **settings)

def run():
    server = tornado.httpserver.HTTPServer(Myngo())
    server.listen(conf.PORT)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    run()
        
