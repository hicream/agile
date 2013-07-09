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

#http://s.weibo.com/weibo/qunar&xsort=time&nodup=1
#http://l-dev1.cc.corp.qunar.com:8080/publicOpinion/querySetting.json
class ContentEncodingProcessor(urllib2.BaseHandler):
  """A handler to add gzip capabilities to urllib2 requests """

  # add headers to requests
  def http_request(self, req):
    req.add_header("Accept-Encoding", "gzip, deflate")
    return req

  # decode
  def http_response(self, req, resp):
    old_resp = resp
    # gzip
    if resp.headers.get("content-encoding") == "gzip":
        gz = GzipFile(
                    fileobj=StringIO(resp.read()),
                    mode="r"
                  )
        resp = urllib2.addinfourl(gz, old_resp.headers, old_resp.url, old_resp.code)
        resp.msg = old_resp.msg
    # deflate
    if resp.headers.get("content-encoding") == "deflate":
        gz = StringIO( deflate(resp.read()) )
        resp = urllib2.addinfourl(gz, old_resp.headers, old_resp.url, old_resp.code)  # 'class to add info() and
        resp.msg = old_resp.msg
    return resp

# deflate support
import zlib
def deflate(data):   # zlib only provides the zlib compress format, not the deflate format;
  try:               # so on top of all there's this workaround:
    return zlib.decompress(data, -zlib.MAX_WBITS)
  except zlib.error:
    return zlib.decompress(data)

class Fetcher:
    def __init__(self,timeout=10,threads=None,stacksize=32768*16,loginfunc=None):
        #proxy_support = urllib2.ProxyHandler({'http':'http://localhost:3128'})
        cookie_support = urllib2.HTTPCookieProcessor(cookielib.CookieJar())
        encoding_support = ContentEncodingProcessor()
        #self.opener = urllib2.build_opener(cookie_support,encoding_support,proxy_support,urllib2.HTTPHandler)
        self.opener = urllib2.build_opener(cookie_support,encoding_support,urllib2.HTTPHandler)
        self.req = urllib2.Request('http://www.hsbc.com')
        socket.setdefaulttimeout(timeout)
        self.q_req = Queue()
        self.q_ans = Queue()
        self.lock = Lock()
        self.running = 0
        if loginfunc:
            self.opener = loginfunc(self.opener)
        if threads:
            self.threads = threads
            stack_size(stacksize)
            for i in range(threads):
                t = Thread(target=self.threadget)
                t.setDaemon(True)
                t.start()

    def __del__(self):
        time.sleep(0.5)
        self.q_req.join()
        self.q_ans.join()

    def taskleft(self):
        return self.q_req.qsize()+self.q_ans.qsize()+self.running

    def push(self,req,repeat=3):
        if not self.threads:
            print 'no thread, return get instead'
            return get(req,repeat)
        self.q_req.put(req)

    def pop(self):
        try:
            data = self.q_ans.get(block=True,timeout=10)
            self.q_ans.task_done()
        except:
            data = ['','']
        return data

    def threadget(self):
        while True:
            req = self.q_req.get()
            with self.lock:
                self.running += 1
            ans = self.get(req)
            print 'got',req
            self.q_ans.put((req,ans))
            try:
                self.q_req.task_done()
            except:
                pass
            with self.lock:
                self.running -= 1
            time.sleep(0.1) # don't spam

    def proxyisworking(self):
        try:
            self.opener.open('http://www.hsbc.com').read(1024)
            return True
        except Exception , what:
            print what
            return False
    def get(self,req,repeat=3):
        '''
        http GET req and repeat 3 times if failed
        html text is returned when succeeded
        '' is returned when failed
        '''
        try:
            response = self.opener.open(req)
            data = response.read()
        except Exception , what:
            print what,req
            if repeat>0:
                return self.get(req,repeat-1)
            else:
                print 'GET Failed',req
                return ''
        return data

    def post(self,req,repeat=3):
        '''
        http POST req and repeat 3 times if failed
        html text/True is returned when succeeded
        False is returned when failed
        '''
        if not isinstance(req,urllib2.Request):
            print 'post method need urllib.Request as argument'
            return False
        else:
            r = self.get(req,repeat)
            if r:
                return r
            else:
                return True

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

  def update_flag(self, id):
    conn = self.connect()
    conn.executemany( """insert into opinion_data values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """, data)
    conn.close()


class SiteCopyer:
    def __init__(self,url):
        #pdb.set_trace()
        self.baseurl = url
        self.desturl = ''
        self.home = self.baseurl.split('/')[2]
        self.f = Fetcher(threads=10)
        self.create_dir()

    def create_dir(self):
        try:
            shutil.rmtree(self.home)
        except Exception,what:
            print what
        try:
            os.mkdir(self.home)
            os.mkdir(self.home+'/media')
            os.mkdir(self.home+'/media/js')
            os.mkdir(self.home+'/media/css')
            os.mkdir(self.home+'/media/image')
        except Exception,what:
            print what

    def strip_dl(self, dl):
      res = {}
      bdl = BeautifulSoup(dl)
      ps =  bdl.find_all('p') # 2 results;the first is content;the second is controller;
      #get mid, uid, screen_name, m_add, 
      for pinfo in ps:
        if pinfo.get('class') and pinfo.get('class').count('info') > 0:
          #pdb.set_trace()
          info1 = pinfo.find('span').find_all('a')[1]
          temp = {}
          for ms in info1.get('action-data').split('&'):
            pair = ms.split('=')
            temp[pair[0]] = pair[1]

          res['mid'] = temp['mid']
          res['uid'] = temp['uid']
          res['screen_name'] = temp['name']
          res['m_addr'] = temp['url']

          #get  create_at
          for aele in pinfo.find_all('a'):
            if aele.get('class') == 'date':
              info2 = aele
              res['create_at'] = info2['title']
            else:
              res['create_at'] = ''


      #get u_addr
      info3 = ps[0].a
      res['u_addr'] = info3['href']

      #get u_icon_addr_list
      info4 = ps[0].contents
      res['u_icon_addr_list'] = []
      for addr in info4:
        img = addr.find('img')
        if img and img != -1:
          res['u_icon_addr_list'].append(img.get('src'))

      res['u_icon_addr_list'] = ";".join(res['u_icon_addr_list'])

      #get content
      info5 = ps[0].find('em')
      temp1 = []
      for con in info5.contents:
        temp1.append(con.encode('utf8'))

      #get pic_addr
      info6 = bdl.ul and bdl.ul.find_all('li') or []
      res['pic_addr'] = []
      for pic in info6:
        img = pic.find('img')
        if img and img != -1:
          res['pic_addr'].append(img.get('src'))
      res['pic_addr'] = ';'.join(res['pic_addr'])

      res['content'] = ''.join(temp1)
      res['gender'] = ''
      res['fans'] = 0
      #TODO: add
      res['keyword'] = ''
      res['get_timestamp'] = ''

      return res

    def strip_script(self,sc):
      if sc.count('<dl') > 0:
        #delete commont
          cmddlr = re.compile(r'<dl class="comment.*?</dl>', re.I)
          sc = cmddlr.sub('', sc)

          #find all dl
          dls = re.compile(r'<dl class="feed_list".*?</dl>',re.I).findall(sc)

          weibos = []
          for dl in dls:
            weibos.append(self.strip_dl(dl))

          OperDatabase().insert_data(weibos)
          return weibos


    def copy(self):
        cookies = {
            'ALF': '1375867636',
            'SINAGLOBAL': '9009630936197.938.1373267335738',
            'ULV': '1373275379136:1:1:1:2638962375931.442.1373275379129:',
            'un': 'chunlei2046@sina.com'
          }
        page = self.f.get(self.baseurl, cookies)
        page = page.replace('\\n', '').replace('\\t', '').replace('\\/', '/').replace('\\"', '"').replace('\\u', '\u')#.replace('\\', '')
        soup = BeautifulSoup(page)
        scripts = re.compile(r'<script>.*?STK\.pageletM\.view\((.*?)\)</script>',re.I).findall(page)
        allres = []
        for sc in scripts:
          script = self.strip_script(sc)
          if script:
            #pdb.set_trace()
            allres.extend(script)
        return allres

    def sendData(self, data):
      data = urllib.urlencode(data)
      request = urllib2.Request(self.desturl, data)
      response = urllib2.urlopen(request)
      if response.code == 200:
        # dowork
        return false
      else:
        # dowork
        return true

if __name__ == "__main__":
    if len(sys.argv) == 2:
        url = sys.argv[1]
        n = 1
        total = 2
        allweibos = []
        while n <= total:
          url1 = url + '&page=' + str(n)
          print '===============================url', url1
          res = SiteCopyer(url1).copy()
          allweibos.extend(res)
          n += 1

        myfile = open('/home/charles/work/agile/text.txt','w')
        temp = []
        for obj in allweibos:
          temp.append(str(obj))

        myfile.write(''.join(temp))
        myfile.close()
    else:
        print "Usage: python "+sys.argv[0]+" url"
