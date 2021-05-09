FROM nginx
# 作者
MAINTAINER 2419267527@qq.com you
# 上传项目文件
COPY /public /usr/share/nginx/learning_blog/
# 上传 nginx 配置
COPY default.conf /etc/nginx/conf.d/
# 对外暴露端口
EXPOSE 80
