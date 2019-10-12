#!/usr/bin/python
# coding: utf-8

# realXiaoice - server.py
# 2019/8/11 17:13
#

__author__ = "Benny <benny.think@gmail.com>"

import logging
import os
from platform import uname
import json
import traceback
from concurrent.futures import ThreadPoolExecutor
from tornado import web, ioloop, httpserver, gen, options
from tornado.concurrent import run_on_executor
from PIL import Image
import os
import multiprocessing
import contextlib
import hashlib
import re

PATH = ''


def converter(uri):
    # pure_name=img_path.split()
    # a/moon2.jpg   moon2.jpg
    img_path = os.path.join(PATH, uri)

    hash_id = hashlib.md5(img_path.encode('u8')).hexdigest()
    webp = os.path.join('webp', hash_id)+'.webp'
    if not os.path.exists(webp):
        im = Image.open(img_path)
        im.save(webp)
    return webp


# def process():
#     pool = multiprocessing.Pool(processes=8)
#     for i in files:
#         f = os.path.join(path, i)
#         pool.apply_async(converter, (f,))
#
#     pool.close()
#     pool.join()


class BaseHandler(web.RequestHandler):
    def data_received(self, chunk):
        pass


class ConvertHandler(BaseHandler):
    executor = ThreadPoolExecutor(max_workers=100)

    @run_on_executor
    def run_request(self):
        r = converter(self.request.uri[1:])
        return open(r, 'rb').read()

    @gen.coroutine
    def get(self):
        res = yield self.run_request()
        self.set_header("Content-type", "image/webp")
        self.write(res)


class RunServer:
    root_path = os.path.dirname(__file__)

    handlers = [
        (r'/.*', ConvertHandler),
    ]
    settings = {
        "cookie_secret": "5Li05DtnQewDZq1mDVB3HAAhFqUu2vD2USnqezkeu+M=",
        "xsrf_cookies": False,
        "autoreload": True
    }

    application = web.Application(handlers, **settings)

    @staticmethod
    def run_server(port=3333, host='127.0.0.1', **kwargs):
        tornado_server = httpserver.HTTPServer(RunServer.application, **kwargs, xheaders=True)
        tornado_server.bind(port, host)

        if uname()[0] == 'Windows':
            tornado_server.start()
        else:
            tornado_server.start(None)

        try:
            print('Server is running on http://{host}:{port}'.format(host=host, port=port))
            ioloop.IOLoop.instance().current().start()
        except KeyboardInterrupt:
            ioloop.IOLoop.instance().stop()
            print('"Ctrl+C" received, exiting.\n')


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    options.define("h", default='127.0.0.1', help="listen address", type=str)
    options.define("p", default=3333, help="running port", type=int)
    options.define("f", default='pics', help="Path to your pics", type=str)
    options.parse_command_line()
    p = options.options.p
    h = options.options.h
    PATH = options.options.f

    RunServer.run_server(port=p, host=h)
