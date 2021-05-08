#!/usr/bin/env sh
 
# 确保脚本抛出遇到的错误
set -e
 
# 生成静态文件
yarn docs:build
 
# 进入生成的文件夹
cd public
 
git init
git add -A
git commit -m 'deploy'
 
# 发布到blog分支
git push -f https://gitee.com/athenIc/learning_blog.git master:blog

# 删除打包文件
# rm -r -f public/
 
cd -