---
title: B站视频下载平台说明文档
date: 2026-04-08 03:38:32
category: 说明文档
tags:
- bilibili
post-info: true
---
本篇文章是[B站视频下载器](https://fallingnight.com/bili_loader/login)的说明文档,有关原理问题请移步[这篇文章](https://fallingnight.com/blog/2025/04/01/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%88%AC%E5%8F%96%E6%96%B9%E6%B3%95/)
<!-- more -->

本平台进行过一次升级，对比旧版本：[旧版B站视频下载器](https://bilibililoader-fallingnight-n7mdqilcu.streamlit.app/)

# 相较于旧版的区别
本平台相较于旧版需要注册和登录，但也增加了能下载高清视频和番剧的功能。

# 注册与登录
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409174600877.png)

新平台相较于旧版需要注册和登录，登录和注册的账号和B站无关，可以随便取用户名和密码，密码随便想就行，取`111111`都行。

本平台无意收集用户数据，增加账号管理是因为新版平台增加了更多功能，也承担了更多代价，没有cookies信息的请求只能访问低清晰度的内容，所以我将自己的B站账号对应的cookies放入了这个系统维持它的运行，也就是说这个平台和我的B站账号有了关联。过于高频的访问会被B站后台注意到，也会导致我的B站账号存在被列入黑名单的风险，所以进行一定的频率和次数限制是无法避免的，本平台的账号管理纯粹为频率和次数限制服务，本平台承诺不会收集用户信息用于其他地方。

# 视频下载
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409181007777.png)

视频下载需要用户输入视频的BV号或者视频的网址，对于B站app端，BV号可以在对应视频的简介中找到。

例如：
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409181755035.png)
中的`BV1ct4y1n7t9`就是这个视频的BV号。

# 番剧下载
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409182148560.png)

番剧下载需要用户输入番剧对应的EP号或者番剧的网址，B站app端没什么好方法直接查看EP号，不过EP号都藏在网址里面，例如：
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409183123476.png)
中的`ep293024`就是那一集对应的EP号，B站app端也可以通过`分享->复制连接`获取对应番剧的网址。

番剧有下载次数限制，每个账号每天只能下载5次{% hide （当然你也可以注册多个账号，这样就有无数次下载机会了）%}，次数限制说到底还是为了缓解平台压力{% hide （保护我的B站账号）%}。

# 下载时限
从视频或番剧资源获取完成起算，你有30分钟的时间下载，逾期后视频或番剧资源会从服务器清除，请尽快下载。

# 获取无限下载次数
你当然可以通过注册多个账号获取无限下载次数{% hide （那说明你很坏了）%}，当然，你也可以贡献你的cookies，我们分担相同的风险，我自然也会给予你相对等的权限。

## 获取cookies
打开一个有检查功能的浏览器（如Chrome）

登录一个有大会员的B站账号，在B站的任意网页右键菜单，选择`检查`。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409184418011.png)

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409184532271.png)

在上方菜单选择`应用`。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409184721989.png)

在左侧目录中选择`cookie/https://www.bilibili.com`。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409184922704.png)

在右侧的变量中找到`bili_jct`和`SESSDATA`,并记录它们的值（Cookie Value）。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409185624128.png)

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409185416114.png)

## 上传cookies
点击本平台右上角的`设置`，打开`B站凭据设置`界面。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409185947951.png)

将之前获取的cookies输入其中，点击`保存`，随后本平台会对cookies信息进行校验，确定对应为有效大会员账号以后，在该cookies信息失效前，上传该cookies的账号会获取无限下载次数。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409190425149.png)

## 令cookies失效
cookies是关键信息，按理说不该泄露，所以你需要一个方法将cookies信息作废。

`bili_jct`和`SESSDATA`这两个信息绑定的是某个账号某次登录时与B站后台建立的会话连接，也就是说，只要你的B站账号从那个浏览器退出登录了，这两个cookies信息就会作废。

事实上，就算你不有意退出登录，这两个信息也会在大约两到三天内更新，而旧的自然会作废。

# 视频或番剧下载失败

## cookies过期
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409192107683.png)
上述两种情况是因为cookies信息过期造成的，上文有提到，cookies信息会自然过期，我平时比较懒，可能不会经常更新cookies。

遇到这种情况可以邮箱联系我更新cookies（邮箱等信息在本站的`关于`里面）。

或者你也可以自己在`设置`里面上传自己的cookies，用完以后再按照前文步骤作废cookies。

## 其他问题
服务器IP地址被B站后台拉黑、我的B站账号大会员过期等问题都有可能导致本平台下载功能受到影响，遇到这些问题可以邮箱联系我及时修复，最好附上报错的截图。

最后，希望这个平台能为你带来帮助与便捷，愿你使用愉快。