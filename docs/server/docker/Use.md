---
title: Docker 容器使用
date: 2021-09-07
categories:
 - Server
tags:
 - Docker
---

## 1、获取镜像


``` bash
# 使用 docker pull 来载入 ubuntu 镜像
C:\Users\Elead-cy>docker pull ubuntu
```

## 2、启动容器

``` bash
# 使用交互式终端启动 ubuntu
C:\Users\Elead-cy>docker run -it ubuntu /bin/bash
```

**参数说明**：
* -i：交互式操作
* -t：终端
* ubuntu：Ubuntu 镜像
* /bin/bash：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 /bin/bash。

如果要退出终端，直接输入命令 `exit`：

``` bash
root@ed09e4490c57:/# exit
```

## 3、查看所有容器
``` bash
C:\Users\Elead-cy>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                      PORTS     NAMES
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   11 minutes ago   Exited (0) 10 minutes ago             rabbitmq
46a80633f501   redis                 "docker-entrypoint.s…"   2 days ago       Exited (0) 10 minutes ago             redis-test
2efb75a8d55d   redis                 "docker-entrypoint.s…"   2 days ago       Exited (0) 2 days ago                 elegant_grothendieck
1d86fe582569   redis                 "docker-entrypoint.s…"   2 days ago       Exited (127) 2 days ago               adoring_elbakyan
69eb6d865fcc   ubuntu                "/bin/bash"              2 days ago       Exited (0) 2 days ago                 epic_wilbur

```

## 4、启动一个已停止的容器
``` bash
# 末尾的编号对应上述容器的 CONTAINER ID
# docker start <容器 ID>
C:\Users\Elead-cy>docker start 46a80633f501    # 容器ID
46a80633f501
```

## 5、停止一个已启动的容器
``` bash
# docker stop <容器 ID>
C:\Users\Elead-cy>docker stop 46a80633f501    # 容器ID
46a80633f501
```

## 6、重启一个容器
``` bash
# docker restart <容器 ID>
C:\Users\Elead-cy>docker restart 46a80633f501    # 容器ID
46a80633f501
```

## 7、docker 镜像后台运行
``` bash
C:\Users\Elead-cy>docker run -itd --name ubuntu-test ubuntu /bin/bash
d242451b9f8676872339408a22ae627941f05f1f6897d55eddc2ef756073bee8
```
**参数说明**：
* -d：该参数使用后，容器默认不会直接进入容器，而是直接后台运行。


## 8、进入后台运行的容器
* docker attach：该方式进入容器，如果从容器中退出，会导致容器停止。
* docker exec：这是一个推荐方式，当推出容器终端后，容器依然运行在后台，使用 `docker exec -help` 命令查看更多参数详情。

**docker attach [<容器 ID>]**
``` bash
C:\Users\Elead-cy>docker attach d242451b9f86
root@d242451b9f86:/# ls
bin  boot  dev  etc  home  lib  lib32  lib64  libx32  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@d242451b9f86:/# exit
exit

C:\Users\Elead-cy>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                      PORTS                    NAMES
d242451b9f86   ubuntu                "/bin/bash"              7 minutes ago    Exited (0) 6 seconds ago                             ubuntu-test    # 容器停止
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   29 minutes ago   Exited (0) 28 minutes ago                            rabbitmq
46a80633f501   redis
```

**docker exec [参数（-it）] [<容器ID>] /bin/bash**
``` bash
C:\Users\Elead-cy>docker exec -it d242451b9f86 /bin/bash
root@d242451b9f86:/# ls
bin  boot  dev  etc  home  lib  lib32  lib64  libx32  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@d242451b9f86:/# exit

C:\Users\Elead-cy>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                      PORTS                    NAMES
d242451b9f86   ubuntu                "/bin/bash"              6 minutes ago    Up 6 minutes                                         ubuntu-test        # 容器依然运行
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   27 minutes ago   Exited (0) 27 minutes ago                            rabbitmq
46a80633f501   redis
```

## 9、导出容器快照
使用`docker export <容器 ID> > name.tar`将容器导出到当前文件目录下
``` bash
F:\>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                      PORTS                    NAMES
d242451b9f86   ubuntu                "/bin/bash"              14 minutes ago   Exited (0) 6 minutes ago                             ubuntu-test
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   36 minutes ago   Exited (0) 35 minutes ago                            rabbitmq
46a80633f501   redis                 "docker-entrypoint.s…"   2 days ago       Up 16 minutes               0.0.0.0:6379->6379/tcp   redis-test

F:\>docker export 46a80633f501 > redis-test.tar

F:\>ls
$RECYCLE.BIN          GameDownload   qqpcmgr_docpro
BaiduNetdiskDownload  msdia80.dll    "redis-test.tar"    #这里
CloudMusic            Program Files  System Volume Information
download              QQMusicCache   vue-org-tree-master
```

## 10、导入容器快照
可以使用 `docker import` 从容器快照文件中再导入为镜像，以下实例将快照文件 redis-test.tar 导入到镜像 test/redis:v1，也可以直接 `docker import [url|filePath] [REPOSITORY:TAG]`
``` bash
F:\>cat redis-test.tar | docker import - test/redis:v1
sha256:421b8c54db6e7a96d493a8522630e5e256855bd861de26a578d090c7ad6c3d69

F:\>docker images
REPOSITORY   TAG          IMAGE ID       CREATED         SIZE
test/redis   v1           421b8c54db6e   3 seconds ago   101MB
rabbitmq     management   095cd34350b9   7 days ago      187MB
mongo        latest       ca8e14b1fda6   8 days ago      493MB
ubuntu       latest       f63181f19b2f   9 days ago      72.9MB
redis        latest       621ceef7494a   2 weeks ago     104MB
centos       latest       300e315adb2f   7 weeks ago     209MB
```

## 11、删除容器
使用 `docker rm <容器ID>` 删除一个容器。
``` bash
F:\>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED             STATUS                         PORTS      NAMES
4869042ada84   redis                 "docker-entrypoint.s…"   43 seconds ago      Up 31 seconds                  6379/tcp   redis-test1
d242451b9f86   ubuntu                "/bin/bash"              About an hour ago   Exited (0) About an hour ago              ubuntu-test
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   2 hours ago         Exited (0) 2 hours ago                    rabbitmq
46a80633f501   redis                 "docker-entrypoint.s…"   2 days ago          Exited (0) 37 minutes ago                 redis-test

F:\>docker rm -f 4869042ada84
4869042ada84

F:\>docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

F:\>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED             STATUS                         PORTS     NAMES
d242451b9f86   ubuntu                "/bin/bash"              About an hour ago   Exited (0) About an hour ago             ubuntu-test
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   2 hours ago         Exited (0) 2 hours ago                   rabbitmq
46a80633f501   redis                 "docker-entrypoint.s…"   2 days ago          Exited (0) 37 minutes ago                redis-test

F:\>
```

**注意：`docker container prune`可以一次性清除所有已停止的 docker 容器。**

``` bash
F:\>docker ps -a
CONTAINER ID   IMAGE                 COMMAND                  CREATED             STATUS                         PORTS     NAMES
d242451b9f86   ubuntu                "/bin/bash"              About an hour ago   Exited (0) About an hour ago             ubuntu-test
972e0e7a04d0   rabbitmq:management   "docker-entrypoint.s…"   2 hours ago         Exited (0) 2 hours ago                   rabbitmq
46a80633f501   redis                 "docker-entrypoint.s…"   2 days ago          Exited (0) 40 minutes ago                redis-test

F:\>docker container prune
WARNING! This will remove all stopped containers.    # 警告
Are you sure you want to continue? [y/N] y
Deleted Containers:
d242451b9f8676872339408a22ae627941f05f1f6897d55eddc2ef756073bee8
972e0e7a04d09951cf2b9c3fc7d98a9defa5f9eeda038722a910e70505cfbe09
46a80633f501b8391e102a1424691fae45efded0570ed1a75f4fb074bbd49e42

Total reclaimed space: 1.272kB

F:\>docker ps -a
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

F:\>
```
