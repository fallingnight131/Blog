---
title: 在Arknights 主题中通过valine配置评论区
date: 2024-10-08 18:10:35
category: 心得分享
tags:
- hexo
- valine
post-info: true
---
# 安装valine环境
输入命令
{% codeblock %}
npm install valine --save
{% endcodeblock %}
<!-- more -->

# 获取AppID、AppKey和server_url
AppID、AppKey和server_url通过后端服务平台[LeanCloud](https://console.leancloud.app/)获取，记得最好是国际版（问就是国内版没配成功。。。）
点击左上角创建应用
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308021649179.png)
取个名字，然后选开发版
应用创建好以后，进入刚刚创建的应用，选择左边的设置>应用凭证，然后就能看到你的AppID、AppKey和server_url了。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308021740180.png)
注意，在应用凭证这个界面里，server_url对应的是REST API 服务器地址

# 配置文件
复制上述的三串东西，在你对应主题的_config文件里把地址黏贴在valine对应位置
{% codeblock %}
valine:
  enable: true
  app_id: 
  app_key: 
  server_url:  
  avatar: 'gravatar' # (''/mp/identicon/monsterid/wavatar/robohash/retro/hide)
  avatar_cdn: 'https://dn-qiniu-avatar.qbox.me/avatar/' # 自定义 avatar cdn
{% endcodeblock %}

# 安全域名
在之前[LeanCloud](https://console.leancloud.app/)的设置栏下的安全中心中，在Web 安全域名框里填下你的博客网址。   
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308021508202.png)
之后，评论区就配置好了

# 管理评论
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308021830140.png)
在数据存储->结构化数据->Comment里面可以看到你博客下发送的评论，你也可以根据需求删除或对这些评论进行其他操作。

# 自定义头像
在[gravatar](https://gravatar.com/)用邮箱注册一个账户并设置头像，以后如果在valine评论区配置中的**avatar:**参数为**'gravatar'**的博客中评论，头像就会变成你在[gravatar](https://gravatar.com/)设置的头像。头像设置完有个缓存期，期间评论没有头像不必心急。
