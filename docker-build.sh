#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 打包构建
yarn docs:build
# 运行 docker-compose.yml(注意：重新构建容器)
docker-compose up --build

cd -
