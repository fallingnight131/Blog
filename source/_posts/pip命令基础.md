---
title: pip命令基础(包括虚拟环境的使用)
date: 2024-10-14 08:30:08
category: 技术笔记
tags:
- pip
- Python
post-info: true
---

# pip命令

## 安装包

{% codeblock lang:bash %}
pip install <包名>
{% endcodeblock %}
<!-- more -->

例如：
{% codeblock lang:bash %}
pip install numpy
{% endcodeblock %}
指定版本：
{% codeblock lang:bash %}
pip install numpy==1.21.0
{% endcodeblock %}

## 升级已安装的包
{% codeblock lang:bash %}
pip install --upgrade <包名>
{% endcodeblock %}

## 升级pip
{% codeblock lang:bash %}
python.exe -m pip install --upgrade pip
{% endcodeblock %}
如果你的电脑里面不止一个版本的python，记得把python.exe换成你这个项目用的那个版本的python的exe文件的绝对路径。如果绝对路径中有空格，就用双引号把路径框起来，在双引号前面加& ，例如：
{% codeblock lang:bash %}
& "D:\Program Files\Python\3.8\python.exe" -m pip install --upgrade pip
{% endcodeblock %}


## 卸载包
{% codeblock lang:bash %}
pip uninstall <包名>
{% endcodeblock %}

##  查看已安装的包
列出当前环境中已安装的所有包：
{% codeblock lang:bash %}
pip list
{% endcodeblock %}
如果想查看某个包的详细信息：
{% codeblock lang:bash %}
pip show <包名>
{% endcodeblock %}

## 搜索包
{% codeblock lang:bash %}
pip search <关键词>
{% endcodeblock %}

## 安装本地依赖
如果你有一个项目的依赖文件 requirements.txt，可以通过以下命令批量安装所需的包：
{% codeblock lang:bash %}
pip install -r requirements.txt
{% endcodeblock %}
requirements.txt 文件里面包含了一行行的包名和版本号，pip 会按照文件中的内容逐一安装，
例如，文件可能包含以下内容：
{% codeblock lang:makefile %}
numpy==1.21.2
pandas==1.3.3
matplotlib==3.4.3
{% endcodeblock %}
当你运行 pip install -r requirements.txt 时，pip 会自动安装这些列出的包及其指定版本。

## 导出已安装的包
可以将当前环境中的所有包导出到一个 requirements.txt 文件中，以便在其他环境中复现：
{% codeblock lang:bash %}
pip freeze > requirements.txt
{% endcodeblock %}

## 使用国内镜像源
### 直接安装包
在国内使用 pip 时，由于访问 PyPI 官方源速度较慢，可以使用国内镜像，例如清华源。使用时，可以指定源地址：
{% codeblock lang:bash %}
pip install <包名> -i https://pypi.tuna.tsinghua.edu.cn/simple
{% endcodeblock %}

### 永久换源
每次安装都要输入"-i https://pypi.tuna.tsinghua.edu.cn/simple"会很不方便，可以选择永久换源，这样每次安装只要pip install就行：
{% codeblock lang:bash %}
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
{% endcodeblock %}
### 恢复默认源
如果你不想换源了，可以恢复默认源：
{% codeblock lang:bash %}
pip config unset global.index-url
{% endcodeblock %}

## 检查过时的包
你可以检查已安装的包是否有可用更新：
{% codeblock lang:bash %}
pip list --outdated
{% endcodeblock %}

## 清除下载的缓存
当包的安装出现问题时，可以尝试清除 pip 缓存：
{% codeblock lang:bash %}
pip cache purge
{% endcodeblock %}
pip缓存会占用不少c盘空间，如果c盘空间告急的话非常推荐定期清除pip缓存，不过清除缓存以后下次再装相同的包会花更多时间。

## 检查依赖冲突
使用以下命令检查安装包时是否有依赖冲突：
{% codeblock lang:bash %}
pip check
{% endcodeblock %}

## 显示帮助
{% codeblock lang:bash %}
pip --help
{% endcodeblock %}

# 虚拟环境
## 虚拟环境的优势
直接在命令行输入pip install <包名>会导致包安装到系统Python的全局site-packages目录，
这在运行简单程序的时候没有什么问题，但是在程序比较复杂的时候会出现若干问题，
比如你电脑安装过多个python，但一般情况，哪怕你把你安装过的python的路径都加到过系统环境路径，系统默认python也只会默认为一个(一般是你最后安装的python版本)
你可以输入：
{% codeblock lang:bash %}
python --version
{% endcodeblock %}
查看成为系统默认python的那个版本
当你希望用3.8版本的python运行一个程序，而且你的IDE确实把python3.8作为了解释器，而你的系统默认python是3.9,那问题就来了，
哪怕你把pip install敲一万遍，包也不会被安装进python3.8的全局site-packages目录，程序自然也别想跑通，因为包安装的位置和你实际用到的解释器没用关系。
此外，就算你要用的就是3.9，而且确实安装对了，但是大型项目用到的包与包之间发生版本冲突是经常的，不同程序共用一个全局site-packages，那冲突发生的可能性就更大了，
你应该不希望隔一天运行同一个程序还要因为中间调过另一个程序而导致之前的程序因为包的版本冲突而突然跑不起来。
所以，我们需要把不同程序用到的包环境隔离开来，这需要用到虚拟环境。
虚拟环境不仅可以隔离环境防止冲突，而且创建虚拟环境时规定了python的版本，后续运行程序的时候只要在虚拟环境中直接用
{% codeblock lang:bash %}
python 文件名.py
{% endcodeblock %}
的命令就可以使用你希望的python版本解释程序，不用每次运行程序都为了用和系统python不一样的版本而输入一遍那个版本python执行程序的绝对路径。
同时，虚拟环境下pip install安装的包就在项目目录下，方便查找和管理。
## 创建虚拟环境
在项目根目录输入命令：
{% codeblock lang:bash %}
python -m venv envname
{% endcodeblock %}
当然，为了避免不必要的冲突可能，如果你要用到的python和系统默认python版本不一样，建议用下述命令：
{% codeblock lang:bash %}
path\to\python.exe -m venv envname
{% endcodeblock %}
path\to\python.exe 是你用的那个版本的python的可执行文件的绝对路径(windows以外的系统可能不叫exe)
envname是你创建的虚拟环境的名字，你可以随便换成其他名字，懒得取名可以直接换成.venv 例如：
{% codeblock lang:bash %}
python -m venv .venv
{% endcodeblock %}
python.exe的绝对路径中可能有空格，那就需要把绝对路径用&""框起来，例如：
{% codeblock lang:bash %}
& "D:\Program Files\Python\3.8\python.exe" -m venv .venv
{% endcodeblock %}
可以创建一个名叫.venv ，版本为python3.8的虚拟环境

## 激活进入虚拟环境
创建完毕以后，你输入创建命令的目录下会多一个叫.venv的文件夹(和你取的名字一样)，这就是你创建的虚拟环境。
打开这个文件夹，里面会有一个叫Scripts的文件(MacOS那里是bin文件)，打开这个文件夹，里面有个叫activate的文件，执行这个文件就能激活进入虚拟环境
我们回到之前创建虚拟环境的那一级目录，在那里输入命令:
{% codeblock lang:bash %}
.\envname/Scripts/activate	//Windows

source myenv/bin/activate	//Linux、Macos
{% endcodeblock %}
envname 是你取的虚拟环境的名字
例如你取的名字是.venv ,那激活命令就是
{% codeblock lang:bash %}
.\.venv/Scripts/activate	//Windows

source .venv/bin/activate	//Linux、Macos
{% endcodeblock %}
激活以后，每一行命令的路径前都会多一个(虚拟环境名)的前缀，比如：
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308011920434.png)
前面有个黄色括号就是成功了，在这个虚拟环境下pip install的所有包都会下进.venv/Lib/site-packages。
同时在这个虚拟环境下用
{% codeblock lang:bash %}
python 程序名.py
{% endcodeblock %}
运行程序，用到的解释器就是你创建虚拟环境时用的那版的python。
如果你用的IDE，比如vscode，记得把解释器换成虚拟环境的解释器(vscode会直接提示你换)，虚拟环境的解释器就在envname/Scripts/ 目录下。
之后每打开项目时把激活虚拟环境的命令输入一遍就行了。

# 使用包管理工具

使用pip安装包的时候可能会遇到版本冲突。如果想要更加便利高效地安装环境，可以使用现成的包管理工具，比如[Anaconda](https://www.anaconda.com/download)。

Anaconda需要使用conda命令来进行包管理。(其实和pip命令差不多)

## 安装环境

使用命令

{% codeblock lang:bash %}
conda create -n envname python=3.xx
{% endcodeblock %}

就可以创建一个名为envname，python版本为3.xx的虚拟环境。（哪怕本地没有这个版本的python也可以安装）

例如,创建一个名为pytorch，版本为3.12的conda环境可以使用命令：

{% codeblock lang:bash %}
conda create -n pytorch python=3.12
{% endcodeblock %}

如果想要创建一个和某个已有环境除名字以外一模一样的环境，可以通过命令：

{% codeblock lang:bash %}
conda create --name newname --clone envname
{% endcodeblock %}

例如,创建一个名为newpytorch，但是配置和已有环境pytorch一模一样的环境可以使用命令：

{% codeblock lang:bash %}
conda create --name newpytorch --clone pytorch
{% endcodeblock %}

## 查看已有环境

如果想要查看本地已创建的环境可以通过命令：

{% codeblock lang:bash %}
conda env list
{% endcodeblock %}

实现。

## 激活虚拟环境

激活已创建的虚拟环境可以通过命令：

{% codeblock lang:bash %}
conda activate envname
{% endcodeblock %}

例如激活名为pytorch的虚拟环境可以通过命令：

{% codeblock lang:bash %}
conda activate pytorch
{% endcodeblock %}

## 退出虚拟环境

退出虚拟环境可以通过命令：

{% codeblock lang:bash %}
conda deactivate
{% endcodeblock %}

退出以后会回到conda默认的base环境，以便于进入、创建或删除其他环境。

## 安装包

安装包可以通过命令：

{% codeblock lang:bash %}
conda install <包名>
{% endcodeblock %}

当然，如果有些包conda安装不了，也可以通过pip命令：

{% codeblock lang:bash %}
pip install <包名>
{% endcodeblock %}

实现。

## 卸载包

卸载包可以通过命令：

{% codeblock lang:bash %}
conda uninstall <包名>
{% endcodeblock %}

或者

{% codeblock lang:bash %}
pip uninstall <包名>
{% endcodeblock %}

实现。

## 删除环境

如果想要删除某个不想要的虚拟环境，可以通过命令：

{% codeblock lang:bash %}
conda remove --name envname --all
{% endcodeblock %}

例如删除名为pytorch的虚拟环境可以通过命令：

{% codeblock lang:bash %}
conda remove --name pytorch --all
{% endcodeblock %}

实现。
