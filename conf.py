# -*- coding: utf-8 -*-

import os
import base64

PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

PORT = 8000

SECRET = base64.b64encode(os.urandom(32))

TEMPLATE_PATH = os.path.join(PROJECT_PATH, 'templates')
STATIC_PATH = os.path.join(PROJECT_PATH, 'static')

# MongoDB
MONGO_PORT = 27017
MONGO_HOST = 'localhost'
