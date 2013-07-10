#coding:utf-8
# -*- coding: utf-8 -*-  
import re,os,shutil,sys
import urllib2,socket,cookielib
import pdb
from threading import Thread,stack_size,Lock
from Queue import Queue
import time
from gzip import GzipFile
from StringIO import StringIO
from bs4 import BeautifulSoup
import MySQLdb
import json
from urllib import quote;
import urllib;


class OperDatabase:
  def __init__(self):
    self

  def connect(self):
    #建立和数据库系统的连接
    conn = MySQLdb.connect(host='localhost', user='root', passwd='11')
    conn.select_db('publicopinions');
    ###获取操作游标 
    return conn.cursor()

  def insert_data(self,data):
    conn = self.connect()

    #change data
    vals = []
    for i in data:
      vals.append((i["mid"], i["uid"], i["m_addr"], i["screen_name"], i["gender"], i["fans"], i["u_icon_addr_list"], i["create_at"], i["content"], i["pic_addr"], i["keyword"], i["get_timestamp"]))

    #pdb.set_trace()
    conn.executemany( "insert into opinion_data (mid, uid, m_addr, screen_name, gender, fans, u_icon_addr_list, create_at, content, pic_addr, keyword, get_timestamp) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", vals)
    conn.close()

  def query_data(self):
    conn = self.connect()

    #change data
    vals = []
    conn.execute('select * from opinion_data where flag=0')
    results = conn.fetchall()
    conn.close()
    return results

  def update_flag(self, id):
    conn = self.connect()
    conn.executemany( """insert into opinion_data values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """, data)
    conn.close()


if __name__ == "__main__":
  #get public opinion keyword
  postUrl = 'http://l-dev1.cc.corp.qunar.com:8080/publicopinion/savePublicOpinions.json?currentId=63616C6C496E2C34343735353531363132343734'
  try:
    #get public opinion from database
    result = OperDatabase().query_data()
    keys = ('mid', 'uid', 'maddr', 'screenName', 'gender', 'fans', 'userIconAddrList', 'createdAt', 'content', 'picAddr', 'keyWord', 'getTimestamp', 'id', 'uaddr')
    for re in result:
      i = 0
      data = {}
      for k in keys:
        #data[k.decode('utf-8')] =  re[i].decode('utf-8') if isinstance(re[i], str) else str(re[i]).decode('utf-8')
        data[k] = re[i]
        i += 1
      pdb.set_trace()
      data = urllib.urlencode(data)
      req = urllib2.Request(postUrl, data)
      req.add_header('Content-Type', 'application/x-www-form-urlencoded')
      response = urllib2.urlopen(req)

      if response.code == 200:
        res = response.read()
        dataJ = json.loads(res.replace('\\n', ''))
        realData = dataJ['data']
        # only support weibo.com

  except Exception as e:
    print e
