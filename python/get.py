#coding:utf-8
# -*- coding: utf-8 -*-  
import re,os,shutil,sys
import urllib2,socket,cookielib
import pdb
from threading import Thread,stack_size,Lock
from Queue import Queue
import time
from datetime import datetime
from gzip import GzipFile
from StringIO import StringIO
from bs4 import BeautifulSoup
import MySQLdb
import json
import urllib
from urllib import quote;
import hashlib
import base64

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
      gz = GzipFile(fileobj=StringIO(resp.read()), mode="r")
      resp = urllib2.addinfourl(gz, old_resp.headers, old_resp.url, old_resp.code)
      resp.msg = old_resp.msg
    # deflate
    if resp.headers.get("content-encoding") == "deflate":
      gz = StringIO( deflate(resp.read()))
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
      vals.append((i["mid"].encode('utf-8'), i["uid"].encode('utf-8'), i["m_addr"].encode('utf-8'), i["screen_name"].encode('utf-8'), i["gender"].encode('utf-8'), i["fans"], i["u_icon_addr_list"].encode('utf-8'), i["create_at"].encode('utf-8'), i["content"].encode('utf-8'), i["pic_addr"].encode('utf-8'), i["keyword"].encode('utf-8'), i["get_timestamp"].encode('utf-8'), i["u_addr"].encode('utf-8')))

    #pdb.set_trace()
    conn.executemany( "insert into opinion_data (mid, uid, m_addr, screen_name, gender, fans, u_icon_addr_list, create_at, content, pic_addr, keyword, get_timestamp, u_addr) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", vals)
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

  def time_now(self):
    return datetime.now().strftime('%Y-%m-%d %X')

  def strip_dl(self, dl, keyword):
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
        #pdb.set_trace()
        dataEles = pinfo.find_all('a')
        for aele in dataEles:
          info2 = aele
          if info2.get('class') == ['date']:
            res['create_at'] = time.strftime('%Y-%m-%d %X', time.localtime(int(info2.get('date')[0:10])))
        if res.has_key('create_at') == False:
            res['create_at'] = '2000-01-01 01:01:01'


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

    res['u_icon_addr_list'] = str(";".join(res['u_icon_addr_list']))

    #get content
    info5 = ps[0].find('em')
    temp1 = []
    for con in info5.contents:
      temp1.append(str(con))

    #get pic_addr
    info6 = bdl.ul and bdl.ul.find_all('li') or []
    res['pic_addr'] = []
    for pic in info6:
      img = pic.find('img')
      if img and img != -1:
        res['pic_addr'].append(img.get('src'))
    #pdb.set_trace()
    res['pic_addr'] = str(';'.join(res['pic_addr']))

    res['content'] = str(''.join(temp1))
    res['gender'] = '1'
    res['fans'] = 0
    #TODO: add
    res['keyword'] = keyword
    res['get_timestamp'] = self.time_now()

    return res

  def strip_script(self,sc, key):
    if sc.count('<dl') > 0:
      #delete commont
      cmddlr = re.compile(r'<dl class="comment.*?</dl>', re.I)
      sc = cmddlr.sub('', sc)

      #find all dl
      dls = re.compile(r'<dl class="feed_list".*?</dl>',re.I).findall(sc)

      weibos = []
      for dl in dls:
        try:
          val = self.strip_dl(dl, key)
          weibos.append(val)
        except Exception as e:
          print e
        else:
          continue

      OperDatabase().insert_data(weibos)
      return weibos


  def copy(self, key):
    cookies = { 'ALF': '1375867636', 'SINAGLOBAL': '9009630936197.938.1373267335738', 'ULV': '1373275379136:1:1:1:2638962375931.442.1373275379129:', 'un': 'chunlei2046@sina.com' }
    page = self.f.get(self.baseurl, cookies)
    page = page.replace('\\n', '').replace('\\t', '').replace('\\/', '/').replace('\\"', '"').replace('\\u', '\u')#.replace('\\', '')
    soup = BeautifulSoup(page)
    scripts = re.compile(r'<script>.*?STK\.pageletM\.view\((.*?)\)</script>',re.I).findall(page)
    allres = []
    for sc in scripts:
      script = self.strip_script(sc, key)
      if script:
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

class LoginWeibo:
  def __init__(self):
    #获取一个保存cookie的对象
    cj = cookielib.LWPCookieJar()
    #将一个保存cookie对象，和一个HTTP的cookie的处理器绑定
    cookie_support = urllib2.HTTPCookieProcessor(cj)
    #创建一个opener，将保存了cookie的http处理器，还有设置一个handler用于处理http的URL的打开
    opener = urllib2.build_opener(cookie_support, urllib2.HTTPHandler)
    #将包含了cookie、http处理器、http的handler的资源和urllib2对象板顶在一起
    urllib2.install_opener(opener)

    self.postdata = {
        'entry': 'weibo',
        'gateway': '1',
        'from': '',
        'savestate': '7',
        'userticket': '1',
        'ssosimplelogin': '1',
        'vsnf': '1',
        'vsnval': '',
        'su': '',
        'service': 'miniblog',
        'servertime': '',
        'nonce': '',
        'pwencode': 'wsse',
        'sp': '',
        'encoding': 'UTF-8',
        'url': 'http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack',
        'returntype': 'META'
    }

  def get_servertime(self):
    url = 'http://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=dW5kZWZpbmVk&client=ssologin.js(v1.3.18)&_=1329806375939'
    data = urllib2.urlopen(url).read()
    p = re.compile('\((.*)\)')
    try:
      json_data = p.search(data).group(1)
      data = json.loads(json_data)
      servertime = str(data['servertime'])
      nonce = data['nonce']
      return servertime, nonce
    except:
      print 'Get severtime error!'
      return None

  def get_pwd(self, pwd, servertime, nonce):
    pwd1 = hashlib.sha1(pwd).hexdigest()
    pwd2 = hashlib.sha1(pwd1).hexdigest()
    pwd3_ = pwd2 + servertime + nonce
    pwd3 = hashlib.sha1(pwd3_).hexdigest()
    return pwd3

  def get_user(self, username):
    username_ = urllib.quote(username)
    username = base64.encodestring(username_)[:-1]
    return username

  def do_login(self):
    username = 'Charles_Lei'#微博账号
    pwd = '20062010'#微博密码
    url = 'http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.3.18)'
    try:
      servertime, nonce = self.get_servertime()
    except:
      return
    self.postdata['servertime'] = servertime
    self.postdata['nonce'] = nonce
    self.postdata['su'] = self.get_user(username)
    self.postdata['sp'] = self.get_pwd(pwd, servertime, nonce)
    self.postdata = urllib.urlencode(self.postdata)
    headers = {'User-Agent':'Mozilla/5.0 (X11; Linux i686; rv:8.0) Gecko/20100101 Firefox/8.0'}
    #其实到了这里，已经能够使用urllib2请求新浪任何的内容了，这里已经登陆成功了
    pdb.set_trace()
    req  = urllib2.Request( url = url, data = self.postdata, headers = headers)
    result = urllib2.urlopen(req)
    text = result.read()
    #print text
    p = re.compile('location\.replace\(\'(.*?)\'\)')
    try:
      login_url = p.search(text).group(1)
      print login_url
      #print login_url
      urllib2.urlopen(login_url)
      print "login success"
    except:
      print 'Login error!'
    #测试读取数据，下面的URL，可以换成任意的地址，都能把内容读取下来
    req = urllib2.Request(url='http://e.weibo.com/aj/mblog/mbloglist?page=1&count=15&max_id=3463810566724276&pre_page=1&end_id=3458270641877724&pagebar=1&_k=134138430655960&uid=2383944094&_t=0&__rnd=1341384513840',)
    result = urllib2.urlopen(req)
    text = result.read()
    print len(result.read())
    #unicode(eval(b),"utf-8")
    print eval("u'''"+text+"'''")




if __name__ == "__main__":
  LoginWeibo().do_login()
  #get public opinion keyword
  getKeywordsUrl = 'http://l-dev1.cc.corp.qunar.com:8080/publicopinion/querySetting.json?currentId=63616C6C496E2C34343735353531363132343734&keyWordsStatus=1'
  #weiboURL = 'http://s.weibo.com/weibo/qunar&xsort=time&nodup=1'
  weiboURL = 'http://s.weibo.com/weibo/'
  try:
    req = urllib2.Request(getKeywordsUrl)
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    response = urllib2.urlopen(req)

    if response.code == 200:
      print '===============================request keywords success url'
      data = response.read()
      dataJ = json.loads(data.replace('\\n', ''))
      realData = dataJ['data']
      # only support weibo.com
      for d in realData:
        if d['product'] == 'weibo':
          keywords = d['keywords']
          for k in keywords:
            n = 1
            total = 2
            allweibos = []
            while n <= total:
              url1 = weiboURL + quote(k.encode('UTF-8')) + '&xsort=time&nodup=1&page=' + str(n)
              print '===============================url', url1
              res = SiteCopyer(url1).copy(k)
              allweibos.extend(res)
              n += 1

            myfile = open('/home/charles/work/agile/text.txt','w')
            temp = []
            for obj in allweibos:
              temp.append(str(obj))

            myfile.write(''.join(temp))
            myfile.close()

  except Exception as e:
    print e
