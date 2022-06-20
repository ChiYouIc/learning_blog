# 获取当前分支
bran=`git branch | grep "*"`
bran=${bran/* /}
echo "Force push to Github ${bran}"

# -f force 强制推送
git push -f git@github.com:ChiYouIc/learning_blog.git ${bran}

echo -n "Over, Press any key to exit..."
read name
echo $name
