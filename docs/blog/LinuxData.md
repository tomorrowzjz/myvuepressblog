# linux
1.重启 nginx    service nginx reload
        重启nginx服务器步骤
        1.  cd /usr/local/nginx/sbin
        2.  ./nginx -s reload
2 遍历某目录下，所有文件，查找源代码的某一个函数方法
       > grep -rn "查找内容" --exclude-dir="root" *
         -r 是递归遍历
         -n 是具体哪一个行
         --exclude-dir 排除某个目录的查找
3.kill nginx
      查询nginx主进程号
      ps -ef | grep nginx
      在进程列表里 面找master进程，它的编号就是主进程号了。
      kill -QUIT 主进程号
4.Linux系统如何查看是多少位的
      getconf LONG_BIT
5.软连接是linux中一个常用命令，它的功能是为某一个文件在另外一个位置建立一个同不的链接（类似于Windows的快捷方式，别名）。

    具体用法是：ln -s 源文件(安装目录) 目标文件（环境变量值）。
    （echo $PATH）   在终端下输入这个命令回车 会显示你的环境变量值
    安装完npm 包后eg:nrm  nrm ls -bash: nrm: command not found   没有找到nrm
    ln -s /node-v12/bin/pm2 /usr/local/bin/

    修改软链接
    ln –snf  [新的源文件或目录]  [目标文件或目录]
6.  wget是一个下载文件的工具，它用在命令行下
    eg:下载安装包
       wget https://npm.taobao.org/mirrors/node/v4.4.7/node-v4.4.7-linux-x64.tar.gz
7. tar xvf node-v8.11.4-linux-x64.tar.xz #解压
    -x：解压
    -v：显示所有过程
    -f: 使用档案名字，切记，这个参数是最后一个参数，后面只能接档案名(解压后的文件夹名字是否使用压缩包的名字)。
8. rm -rf 文件夹名字||文件名
    删除当前目录下的所有文件及目录，并且是直接删除，无需逐一确认命令行为：
    rm  -rf  要删除的文件名或目录
    删除文件名 test.txt:
    rm  -rf   test.txt
    删除目录 test，不管该目录下是否有子目录或文件，都直接删除:
    rm  -rf   test/

    -f：不提示，强制删除文件或目录；
    -i：删除已有文件或目录之前先询问用户；
    -r,-R：递归删除，将指定目录下的所有文件与子目录一并删除；
    -v：显示指令的详细执行过程。
 9.-bash: nginx: command not found 解决方案
 https://blog.csdn.net/cn12306com/article/details/80643417
 10. Nginx设置成服务并开机自动启动
    https://www.cnblogs.com/gimin/p/8893559.html
    设置过程出现 service XXX does not support chkconfig问题
    解决问题
    https://blog.csdn.net/weixin_33725270/article/details/94017030
 11.Linux 管理服务开机启动、查看开机启动服务
    https://blog.csdn.net/aswedo/article/details/90345065

 12. ##
    Linux环境下，怎么确定Nginx是以那个config文件启动的？

    输入命令行： ps  -ef | grep nginx

    master process 后面的就是 nginx的目录。

    ps -e       //显示所有程序
    ps -f       //显示UID,PPIP,C与STIME栏位
    ps -ef      //是用标准的格式显示nginx这个进程
