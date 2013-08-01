#!/bin/sh
#commont
#command

echo ==================================以登录shell的方式运行命令；=================================
echo ========================================Install git-core:==================================
#sudo apt-get install git-core
#git config --global user.name "charleslei"
#git config --global user.email superwanderman@gmail.com
#git config --global color.ui true

echo =====================================相关命令=====================================================
#sudo apt-get install tree

echo ====================================Linux share 关于ubuntu下访问windows的共享目录===============================
#安装samba和smbfs
#sudo apt-get install samba
#sudo apt-get install smbfs
#i#2、打开一个文件浏览窗口，按快捷键ctrl + L，输入smb://192.168.0.*既可以访问windows的共享目录了。当然会要求输入访问用户名和密码，正确输入后就可以访问了。

echo ===================================设置root权限=====================================================
#sudo passwd root #根据提示输入密码。再使用： su 即可登陆root

echo ===================================install ssh server and client=======================================
#sudo apt-get install openssh-server openssh-client    #install server and client
#ssh localhost 
#sudo /etc/init.d/ssh stop
#sudo /etc/init.d/ssh start
#sudo /etc/init.d/ssh restart

echo=====================================将中文目录改回为英文：==================================================
#export LANG=en_US && xdg-user-dirs-gtk-update && export LANG=zh_CN.UTF-8

echo ============================================install vim===============================================
#sudo apt-get install vim
#git clone git://github.com/wongyouth/vimfiles ~/vimfiles
#ln -s ~/vimfiles ~/.vim
#echo "source ~/.vim/vimrc" > ~/.vimrc
#echo "source ~/.vim/gvimrc" > ~/.gvimrc
#cd ~/.vim
#git submodule init
#git submodule update
#vim +BundleInstall +qall

echo ==============================================install rvm=====================================
#sudo apt-get update
#sudo apt-get install curl bison build-essential  zlib1g-dev libssl-dev libreadline6-dev libxml2-dev
#curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash
#echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" # Load RVM function' >> ~/.profile
#source ~/.profile

echo =======================================Install Ruby env and rails：使用 rvm 可以安装所有到环境===================================。
#在终端-》编辑 -》配置文件首选项-》 “以登录 shell 方式运行命令 ”
#rvm install 1.9.3    # 安装1.9.2
#rvm use 1.9.3 --default       # 将1.9.2置为默认版本
#rvm -v                   # 验证版本
#rvm rubygems 2.0.1 # | latest       #Install rubygems。 如果以前是用 sudo方式安装的话，使用sudo apt-get autoremove先删除，然后再运行 sudo apt-get autoclean清理一下。//sudo apt-get install rubygems       //install gems
#gem update --system                     # 安装/更新 gem，如果安装正确的话，时间较长。
#gem install rails -v=3.2.0    # 安装固定版本 install rails。//sudo gem install rails -v=3.2.0
#rails -v             # 察看版本

echo ====================Install mysql==========================================================================
#sudo apt-get install libmysql-ruby libmysqlclient-dev
#sudo apt-get install mysql-server libmysql-ruby
#curl -O http://cdn.mysql.com/Downloads/MySQLGUITools/mysql-workbench-gpl-5.2.43-1ubu1204-i386.deb      #Install mysql workbench
#sudo dpkg -i mysql-workbench-gpl-5.2.43-1ubu1204-i386.deb；

echo ===============================Install Redis===========================================================
#curl -O http://redis.googlecode.com/files/redis-2.4.4.tar.gz
#tar xzf redis-2.4.4.tar.gz
#cd redis-2.4.4
#make
#若需要tcl的安装，请看这里：http://www.linuxfromscratch.org/blfs/view/cvs/general/tcl.html
#Redis的安装细节看这里：http://www.cnblogs.com/yjf512/archive/2012/02/20/2358799.html

echo ==========================================Install sqlite database================================================
#sudo apt-get install sqlite3 libsqlite3-dev

echo ================================================Install goolge chrome:==========================================
#sudo apt-get -f install
#curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_i386.deb
#sudo dpkg -i google-chrome-stable_current_i386.deb        #https://www.google.com/chrome/eula.html?platform=linux_ubuntu_i386

echo ============================================== install Sublime===================================================
#http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%202.0.1.tar.bz2
#tar jxf filename.tar.bz2

echo =============================================将关闭窗口放在最右面：==========================================
#gconftool-2 --set /apps/metacity/general/button_layout --type string "menu:minimize,maximize,close"


echo ======================================install QQ:============================================================
#download from ：http://www.longene.org/download/WineQQ2012-20120719-Longene.deb
#sudo dpkg -i package_file.deb


echo ===========================================install jdk===============================================
#curl -O http://download.oracle.com/otn-pub/java/jdk/6u45-b06/jdk-6u45-linux-i586.bin?AuthParam=1369332778_f94dda2dd0b75db91b7bc101e6958d7d
#download from http://www.oracle.com/technetwork/java/javase/downloads/jdk6downloads-1902814.html

#cd /home/charles/Downloads
#sudo mkdir /usr/lib/jvm
#sudo cp jdk-6u45-linux-i586.bin /usr/lib/jvm 
#cd /usr/lib/jvm
##赋予可执行权限：
#sudo chmod +x ./jdk-6u45-linux-i586.bin
#sudo ./jdk-6u45-linux-i586.bin 
#sudo mv jdk1.6.0_45/ java-1.6.0_45-sun/ 
#sudo ln -s java-1.6.0_45-sun java-6-sun 
#sudo rm jdk-6u45-linux-i586.bin 
##其次设置环境变量，主要是PATH、CLASSPATH和JAVA_HOME，注意PATH最后所添加的bin目录：
#sudo vim /etc/environment 
#PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/lib/jvm/java-6-sun/bin" 
#CLASSPATH="/usr/lib/jvm/java-6-sun/lib" 
#JAVA_HOME="/usr/lib/jvm/java-6-sun" 
##然后就是要告诉系统，我们使用的sun的JDK，而非OpenJDK了：
#sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-6-sun/bin/java 300 
#sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-6-sun/bin/javac 300 
#sudo update-alternatives --config java 
#java -version 

echo ===================================================install maven2=====================================
#sudo apt-get install maven2
#mvn -v

echo =================================install gnome-shell================================================================
##install ppa
#sudo add-apt-repository ppa:gnome3-team/gnome3
#sudo add-apt-repository ppa:ricotz/testing
##install 
#sudo apt-get update
#sudo apt-get install gnome-shell # 安装Gnome-shell 桌面
#sudo apt-get install gnome-shell-extensions # 安装extensions
#sudo apt-get install gnome-tweak-tool # 安装配置工具
#echo logout #完成后Log out，在登陆的时候选择Gnome即可。
#
#echo =================================优化界面========================================================================
##第一步是换上漂亮的Faenza图标：
#sudo add-apt-repository ppa:tiheum/equinox
#sudo apt-get update
#sudo apt-get install faenza-icon-theme faience-icon-theme  #很大 100M
#
#echo =================================安装常用系统软件========================================================================
##首先是Ubuntu Tweak这款小软件。装好之后，调教Ubuntu就变得十分轻松了。
#sudo add-apt-repository ppa:tualatrix/ppa
#sudo apt-get update
#sudo apt-get install ubuntu-tweak
##接下来要安装Flash插件（上视频网站必备）
#sudo apt-get install flashplugin-installer
##安装Nautilus扩展（右键点击，用terminal打开）
#sudo apt-get install nautilus-open-terminal
##每次下载了deb包，用软件中心安装实在太慢，用gdebi就够了。
#sudo apt-get install gdebi
#
#echo =================================中文支持========================================================================
##安装了fcitx,安装完成之后，在Language Support里面Keyboard input method system选择fcitx。
#sudo add-apt-repository ppa:fcitx-team/nightly
#sudo apt-get update
#sudo apt-get install fcitx
#sudo apt-get install fcitx-googlepinyin
#sudo apt-get install fcitx-sunpinyin
#sudo apt-get install fcitx-module-cloudpinyin
##最后要设置开机启动，在Startup Applications Preferences里面添加一个fcitx-daemon，然后在Command那一栏输入fcitx -d，保存退出即可。
#
#echo =================================安装其他========================================================================
##首先是Gwibber从12.04开始支持新浪、搜狐微博了。不过需要安装扩展。
#sudo apt-get install gwibber-service-sina
#sudo apt-get install gwibber-service-sohu
