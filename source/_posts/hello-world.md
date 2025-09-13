---
title: Hello World(第一次使用hexo框架搭博客的过程)
date: 2024-10-06
categories: 心得分享
tags: 
      - hexo
post-info: true
---
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308023923486.png)

第一次写博客，就简述一下我用hexo搭建博客的过程吧。
<!-- more -->

# 要安装的环境

## git
Git 是一个开源的分布式版本控制系统，git自带的git bash可以让你在如windows这样的操作系统上也能执行Linux的命令。这在后续安装hexo时执行安装命令，以及部署hexo到github上时，会发挥其作用。
git的下载网站如下：[git官网](https://git-scm.com/)。
下载完毕以后，记得打开 Path 变量，添加本地环境安装目录。

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-06%20200948.png)

安装以后，就可以右键菜单中找到并使用git bash了

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-06%20201724.png)

## node.js
运行 Hexo 需要 JavaScript 环境, Hexo 的命令行工具（如 hexo init、hexo generate、hexo deploy 等）都是 JavaScript 脚本，它们依赖于 node.js 来运行。因此，安装 Node.js 是为了提供执行 Hexo 的环境。
node.js下载网站如下：[node官网](https://nodejs.org/en/)。记得直接下载那个LTS版本。

## hexo
{% codeblock lang:bash %}
npm install -g hexo-cli
{% endcodeblock %}
直接在任意地方打开git bash输入上述指令就行，hexo会被安装到你的 npm 全局目录，它的执行文件会被加入到环境变量path中，之后你就可以在任意终端中执行hexo命令。

# 在本地搭建博客

## 初始化
{% codeblock lang:bash %}
hexo init blog
{% endcodeblock %}
在磁盘中找一个好位置（通常就是你平时新建项目的地方）
通过上述命令初始化 Hexo 项目（当然，上述命令中的blog也可以改成其他名字）
之后你就得到了一个叫blog（或者其他名字）的项目文件夹，初始化的工作就完成了。

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-06%20205114.png)

## 生成
随后用一个你平时常用的集成开发环境（推荐vscode、WebStorm）打开之前得到的项目文件夹（blog）。在blog这一级文件夹中使用命令：
{% codeblock lang:bash %}
hexo g
{% endcodeblock %}
该指令的作用是在Hexo站点根目录下自动生成静态文件，这些文件通常被保存在一个名为“public”的文件夹中。（通常是html文件）
如果命令执行失败了，可以试试执行：
{% codeblock lang:bash %}
npm install
{% endcodeblock %}
再重新执行之前的指令。

## 启动本地服务器
生成完毕以后，就可以在本地浏览先前生成的网页了。
通过执行
{% codeblock lang:bash %}
hexo s
{% endcodeblock %}
在终端获得一个网站

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-06%20211446.png)

打开网站就进入了通过hexo生成的初始博客界面

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-06%20211554.png)

## 主题
刚刚生成的博客界面较为简陋，可以通过替换主题令其符合我们喜欢风格
主题可以在[官网提供的主题栏](https://hexo.io/themes/)下载。
点开想要下载的主题后一般会进入相应的github仓库，随后跟着相应的readme文件教程配置就行。

# 部署
只能在本地运行就意味着别人看不到，这与我们的期望相悖了，想要让博客可以在网上被别人查看，我们可以将其部署在github page上，再关联一个域名。

## 新建仓库
先在github新建一个仓库，一定要注意的是，仓库名要设置为username.github.io ,其中username就是你github的账户名，不这么取名就部署不了。

## 配置_config.yml文件
在blog目录下找到_config.yml文件，在文件的末尾加上如下代码：
{% codeblock lang:yml %}
deploy:
  type: git
  repository: https://github.com/username/username.github.io.git
  branch: main
{% endcodeblock %}
其中，username替换成你github的账户名（repository就是那个仓库的网址）

## 执行部署命令
在终端输入：
{% codeblock lang:bash %}
  hexo deploy
{% endcodeblock %}
之后完成部署

## 查看博客
在浏览器的网址栏输入username.github.io,也就是之前的仓库名，就能进入你博客的首页了。

## 关联域名
虽然通过username.github.io就可以查看自己的博客，但是在平时的生活经验中，网址的后缀一般都是.com、.cn这种，.github.io这种结尾在其他人看来会十分突兀，我们当然希望别人可通过.com、.cn这种符合生活经验的网址来查看我们的博客。要实现这点，我们可以关联一个域名到原本的github page上面，这样我们通过原本username.github.io这样的网址和新的网址就都可以访问博客了。

### 获取域名
国内我们可以在阿里云、腾讯云这样的网站购买域名，像.com这样的域名会贵一些，.cn、.top之类的价格就民亲多了。价格还会和域名的名字有关，名字是要你自己取的，可以在官方平台查询你取的域名在不同后缀的价格。阿里云官网查询的网址如下：
[<阿里云域名查询>](https://wanwang.aliyun.com/domain?spm=5176.21213303.J_qCOwPWspKEuWcmp8qiZNQ.22.54712f3d7XBoz4&scm=20140722.S_card@@%E4%BA%A7%E5%93%81@@3417315._.ID_card@@%E4%BA%A7%E5%93%81@@3417315-RL_%E5%9F%9F%E5%90%8D-LOC_search~UND~card~UND~item-OR_ser-PAR1_2150461f17283693878245823ebb0d-V_3-RE_cardNew)
进去直接在搜索框输入你取的域名就行，如果你取了类似aaa这样的域名的话，你可能会看见打底几万的天价，所以取名的时候尽量避免这种特殊的名字，如果你取的名字实在太贵可以在后面加几个数字试试。正常情况下你会看见如下的价位：

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-08%20154636.png)

追求性价比的话选个top的后缀也不错，当然，如果你要选com和cn也完全没问题,就是可能贵点。直接点注册就行，第一次注册域名会要求你实名认证，照着提示认证就行（不然后面解析和续费啥的都会受影响）。注册完域名以后，我们就有了一个可以关联到之前github page的新网址。

### 解析域名
在[阿里云首页](https://www.aliyun.com/?spm=5176.20180516001.console-base_top-nav.dlogo.14094babVNCrB0)点击右上角控制台，进入控制台后点击左上角菜单点击域名

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-08%20160219.png)


点击左边域名列表，就能查看到之前注册的域名了，在操作一栏选择解析，再点击添加记录，之后按照如下填法添加两条记录：

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-08%20161154.png)

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-08%20161319.png)

其中记录值那里就填你先前在github page浏览博客时用的网址(不用带http)

### github page配置
之后进入原先的代码仓库，点击setting，然后点击左侧菜单的page选项

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-08%20165317.png)

进入之后，找到Custom domain

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/2024-10-08%20165439.png)

在其中填入你之前注册的新域名，一开始可能会失败，失败了就等待一会再试试
成功了以后，新域名就可以访问你的博客了，而且原先.github.io的域名也可以访问，也就是说现在，你有两个网址可以打开你的博客。

### 注意
配置好github page之后在你的github仓库里面会生成一个名叫CNAME的文件，记得把这个文件拷贝到本地，不然在后续更新博客的时候会把仓库里面的CNAME文件抹去，CNAME文件没了就只能重新进行github page配置了，否则用新域名就无法访问博客了。

# 更新博客

## 上传更新的内容
在修改了博客的内容之后，想要更新之前上传在github的博客内容，在终端输入
{% codeblock lang:bash %}
  hexo deploy -g
{% endcodeblock %}
就能将更新的内容上传了。

## 修改文章内容
在blog/source/_posts目录下，你会发现.md文件，这种文件支持markdown语法，通过修改这些文件的内容就可以实现对文章内容的修改。

## 增加新的页面
在终端中执行
{% codeblock lang:bash %}
  hexo new page 'pagename'
{% endcodeblock %}
可以新建一个页面，这个页面会以文件夹的形式生成在blog/source下，其中pagename可以替换成其他名字，
在网页中，新的页面和Home以及Achieve同级

## 增加新的文章
在终端中执行
{% codeblock lang:bash %}
  hexo new "postname"
{% endcodeblock %}
可以新建一个文章，这个文章生成在blog/source/_posts下，其中postname可以替换成其他名字，生成的文件是.md文件，可以通过markdown语法编写。


到这里，基础的hexo使用方法就这样了，想要有更加炫酷的界面，可以参考主题和插件。其他的实在暂时想不到了，想到了再加，开摆！