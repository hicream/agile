#!/bin/sh
sudo apt-get install git-core
git config --global color.ui true
sudo apt-get update
sudo apt-get install curl bison build-essential zlib1g-dev libssl-dev libreadline6-dev libxml2-dev

echo =====================apach=================
sudo apt-get install apache2
curl 'http://localhost'
read $IS DEL

echo ====================php====================
sudo apt-get install php5 libapache2-mod-php5
sudo /etc/init.d/apache2 restart
sudo vim /var/www/testphp.php


echo ==========在浏览器中测试 http://localhost/testphp.php======
curl 'http://localhost/testphp.php'
read $IS DEL
sudo rm /var/www/testphp.php

echo ===========install mysql=============================
sudo apt-get install mysql-server

echo ===========找到行 bind-address = 127.0.0.1 注释掉，保存，退出.======
sudo vim /etc/mysql/my.cnf
sudo /etc/init.d/mysql restart


echo =============PHP 与MySQL协同=====================


echo =========去掉行 “;extension=mysql.so”的;号注释===============
sudo vim /etc/php5/apache2/php.ini

echo ========='config root'===================
echo '<VirtualHost *:80>DocumentRoot /home/ux/www </VirtualHost>' > /etc/apache2/httpd.conf
sudo /etc/init.d/apache2 restart




