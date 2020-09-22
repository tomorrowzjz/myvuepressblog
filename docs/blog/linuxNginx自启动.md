# linuxNginx自启动
 出处：https://www.cnblogs.com/jackzhuo/

在linux系统的/etc/init.d/目录下创建nginx文件

vim /etc/init.d/nginx

在脚本中添加以下命令（内容主要参考[官方文档](https://www.nginx.com/resources/wiki/start/topics/examples/redhatnginxinit/)）

```
#!/bin/sh
#
# nginx - this script starts and stops the nginx daemon
#
# chkconfig:   - 85 15
# description:  NGINX is an HTTP(S) server, HTTP(S) reverse \
#               proxy and IMAP/POP3 proxy server
# processname: nginx
# config:      /etc/nginx/nginx.conf
# config:      /etc/sysconfig/nginx
# pidfile:      /lnmp/nginx/logs/nginx.pid

# Source function library.
. /etc/rc.d/init.d/functions

# Source networking configuration.
. /etc/sysconfig/network

# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

nginx="/lnmp/nginx/sbin/nginx"
prog=$(basename $nginx)

NGINX_CONF_FILE="/lnmp/nginx/conf/nginx.conf"

[ -f /etc/sysconfig/nginx ] && . /etc/sysconfig/nginx

lockfile=/var/lock/subsys/nginx

make_dirs() {
   # make required directories
   user=`$nginx -V 2>&1 | grep "configure arguments:.*--user=" | sed 's/[^*]*--user=\([^ ]*\).*/\1/g' -`
   if [ -n "$user" ]; then
      if [ -z "`grep $user /etc/passwd`" ]; then
         useradd -M -s /bin/nologin $user
      fi
      options=`$nginx -V 2>&1 | grep 'configure arguments:'`
      for opt in $options; do
          if [ `echo $opt | grep '.*-temp-path'` ]; then
              value=`echo $opt | cut -d "=" -f 2`
              if [ ! -d "$value" ]; then
                  # echo "creating" $value
                  mkdir -p $value && chown -R $user $value
              fi
          fi
       done
    fi
}

start() {
    [ -x $nginx ] || exit 5
    [ -f $NGINX_CONF_FILE ] || exit 6
    make_dirs
    echo -n $"Starting $prog: "
    daemon $nginx -c $NGINX_CONF_FILE
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}

stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    configtest || return $?
    stop
    sleep 1
    start
}

reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $prog -HUP
    retval=$?
    echo
}

force_reload() {
    restart
}

configtest() {
  $nginx -t -c $NGINX_CONF_FILE
}

rh_status() {
    status $prog
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
            ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
        exit 2
esac
```

其中，nginx=”/lnmp/nginx/sbin/nginx” 修改成nginx执行程序的路径。

NGINX_CONF_FILE=”/lnmp/nginx/conf/nginx.conf” 修改成配置文件的路径。

保存脚本文件后设置文件的执行权限：

chmod a+x /etc/init.d/nginx

测试脚本是否能使用：

/etc/init.d/nginx start

若出现以下错误：

Stopping nginx (via systemctl): Watning: nginx.service changed on disk.  Run 'systemctl daemonn-reload' to reload units.

按照提示执行即可：

systemctl daemon-reload

设置成服务并开机自启动

chkconfig --add /etc/init.d/nginx   #将nginx服务加入chkconfig管理列表

chkconfig nginx on            #设置终端模式开机启动

加完这个之后，就可以使用service对nginx进行启动，重启等操作了。

service nginx start

service nginx restart

service nginx stop

service nginx status
