---
title: 将python程序打包成可执行的文件
date: 2024-10-13 02:16:35
category: 技术笔记
tags:
- Python
- pyinstaller
post-info: true

---
作为一种解释型语言而非编译型语言，python并不像C++那样可以直接生成可执行文件。
这意味着一个python程序想在另一台电脑上跑就必须在另一台电脑装python解释器。但生活经验告诉你，你用的应用都有可执行文件（windows中是exe），它们当中大概率有python编译的部分，但它们为什么可以有可执行文件？
事实上，python也不是完全不能有可执行文件，但是要通过工具打包，PyInstaller就是一种方法。
PyInstaller 是一个将 Python 脚本打包为独立可执行文件的工具，支持 Windows、macOS 和 Linux 系统。以下是使用 PyInstaller 的步骤：
<!-- more -->

# 安装 PyInstaller
在终端输入命令：
{% codeblock lang:bash %}
pip install pyinstaller
{% endcodeblock %}

# 打包 Python 脚本
假设你有一个 Python 文件 app.py，在解释器里你通过运行它来运行整个项目，你可以通过以下方法打包它：
## 直接打包
{% codeblock lang:bash %}
pyinstaller app.py
{% endcodeblock %}
然后你会看到，PyInstaller 会生成一个 dist 目录，其中包含一个 app 文件夹，这个文件夹内就是打包后的可执行文件。此外，还会生成 build 目录（构建过程中的临时文件）和 .spec 文件（配置文件）。
## 生成单个可执行文件
{% codeblock lang:bash %}
pyinstaller --onefile app.py
{% endcodeblock %}
这样一来，dist 目录下就只有app的可执行文件了，没有了其他的依赖项，但是这样一来，可执行文件的大小会比原来大很多，之前的依赖项、解释器、第三方库都被打包进了可执行文件。
## 指定图标
{% codeblock lang:bash %}
pyinstaller --onefile --icon=myicon.ico app.py
{% endcodeblock %}
myicon.ico是你的图标文件，它最好和app.py放在同一级目录，ico文件可以用图片文件在[aconvert](https://www.aconvert.com/cn/icon/png-to-ico/)自行制作。
指定图标之后，你的可执行文件的图标就不再是
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308023419650.png)
这样的默认可执行文件图标了

## 不显示控制台窗口（适用于 GUI 应用程序）
{% codeblock lang:bash %}
pyinstaller --onefile --windowed app.py
{% endcodeblock %}
这样一来，启动可执行文件就不会启动终端了。
## 打包外部资源（如图片、音频等）
{% codeblock lang:bash %}
# Windows
pyinstaller --add-data "path_to_file;target_folder" app.py
# macOS/Linux
pyinstaller --add-data "path_to_file:target_folder" app.py
{% endcodeblock %}
比如你的文件结构长这样：
{% codeblock lang:txt %}
project_folder/
│
├── app.py                        # 主程序
├── resources/                    # 顶层文件夹
│   ├── images/
│   │   └── assets/
│   │       └── logo.png          # 需要打包的图片文件
│   └── config/
│       └── config.yaml           # 需要打包的配置文件
{% endcodeblock %}
此时，logo.png 被放在 resources/images/assets/ 文件夹下，而 config.yaml 位于 resources/config/ 文件夹中。
那么，此时，windows命令就是：
{% codeblock lang:bash %}
pyinstaller --onefile \
    --add-data "resources/config/config.yaml;resources/config" \
    --add-data "resources/images/assets/logo.png;resources/images/assets" app.py
{% endcodeblock %}

# 生成后的文件
打包完成后，你会在 dist 文件夹中找到打包好的可执行文件。
如果你使用了 --onefile 选项，它会生成一个独立的 .exe 文件（Windows）或其他可执行文件。
如果没有使用 --onefile，则会生成一个包含多个文件的目录。

# 使用 .spec 文件
PyInstaller 会生成一个 .spec 文件，其中保存了打包时的配置信息。如果你想修改打包过程中的某些细节，可以编辑这个 .spec 文件，然后使用以下命令重新打包：
{% codeblock lang:bash %}
pyinstaller app.spec
{% endcodeblock %}

# 其他
上述打包 Python 脚本的各种选项可以叠加，比如假设你想要打包一个 GUI 程序，并生成一个单独的可执行文件，同时使用自定义图标，可以运行：
{% codeblock lang:bash %}
pyinstaller --onefile --windowed --icon=myicon.ico app.py
{% endcodeblock %}