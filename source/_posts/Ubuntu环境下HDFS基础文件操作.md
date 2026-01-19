---
title: Ubuntu环境下HDFS基础文件操作
date: 2025-10-14 19:09:37
category: 技术笔记
tags:
- HDFS
- Hadoop
- Java
- Ubuntu
- Linux
- 大数据
post-info: true
mathjax: false
katex: false
---
# HDFS和Hadoop的关系和用处
## 什么是 Hadoop
Hadoop 是一个开源的大数据处理框架，由 Apache 基金会维护。
它的目标是：
{% blockquote %}
让“成千上万台普通计算机”能像“一台超级计算机”一样处理海量数据。
{% endblockquote %}
<!-- more -->
Hadoop 主要包括四个核心模块：

| 模块 | 全称 | 功能 |
| -------- | -------- | -------- |
| HDFS | Hadoop Distributed File System | 分布式文件存储系统 |
| YARN | Yet Another Resource Negotiator | 负责任务调度与资源管理 |
| MapReduce | —— | 分布式数据计算框架 |
| Common | —— | 公共工具、配置、依赖库 |


一句话总结：
{% blockquote %}
Hadoop = 分布式存储（HDFS） + 分布式计算（MapReduce） + 调度管理（YARN）
{% endblockquote %}

## 什么是 HDFS
HDFS（Hadoop Distributed File System） 是 Hadoop 的分布式文件系统。
它是 Hadoop 存储数据的底层基础。

你可以把它理解为：
{% blockquote %}
一个“把多台机器的硬盘组合在一起”的虚拟超大硬盘。
{% endblockquote %}

## HDFS 的核心思想
假设你有一个 10TB 的文件，而你的电脑只有 1TB 硬盘，
那你可以用 HDFS 把它分成若干个块（block），分别存到多台机器上。

HDFS 由两个主要角色组成：

| 角色| 说明 |
| -------- | -------- |
| NameNode | 管理文件系统的“目录结构”和“元数据”（记录每个文件在哪台机器上） |
| DataNode | 真正存放文件数据的节点（可以有很多台机器） |

## HDFS和Hadoop的关系
Hadoop负责大数据计算框架（存储+计算），是总系统；
HDFS负责分布式文件存储，是Hadoop 的底层存储模块。

# 环境准备
## Linux系统
本文的所有命令是Ubuntu环境下运行的，可以买一个云服务器初始化的时候选择ubuntu系统，或者下载一个ubuntu镜像在虚拟机上跑。

## 安装 JDK（建议 Java 8）
本文使用Java对文件进行操作，所以需要安装JDK。建议安装Java 8，用其他版本可能有起冲突的风险。
{% codeblock lang:bash %}
sudo apt update
sudo apt install openjdk-8-jdk -y
java -version
{% endcodeblock %}

## 安装 Hadoop（建议使用 Hadoop 3.3.x）
### 下载并解压
{% codeblock lang:bash %}
wget https://downloads.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz
tar -zxvf hadoop-3.3.6.tar.gz
sudo mv hadoop-3.3.6 /usr/local/hadoop
{% endcodeblock %}

如果你没有安装 wget，可以先安装：
{% codeblock lang:bash %}
sudo apt update
sudo apt install wget -y
{% endcodeblock %}

### 配置环境变量
打开配置文件：
{% codeblock lang:bash %}
sudo nano ~/.bashrc
{% endcodeblock %}

在文件末尾加上：
```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```
加完以后保存并退出（Ctrl+O → 回车 → Ctrl+X）。

然后执行：
{% codeblock lang:bash %}
source ~/.bashrc
{% endcodeblock %}
使配置文件生效。

### 验证安装
执行：
{% codeblock lang:bash %}
hadoop version
{% endcodeblock %}
出现 Hadoop 版本号则安装成功。

由于HDFS是Hadoop的子模块，所以安装完Hadoop以后系统就自带了HDFS。

# 启动 Hadoop 单机模式（或伪分布式）
## 建立ssh连接
本文是单机模式，所以只需要和自己（localhost）建立ssh免密登录就行。如果是正常情况下多台机器实现分布式，则需要和本机以及每台机器都配置免密登录。

### 安装并启动 SSH 服务
执行：
{% codeblock lang:bash %}
sudo apt update
sudo apt install openssh-server -y
{% endcodeblock %}

安装好后启动 SSH 服务：
{% codeblock lang:bash %}
sudo systemctl enable ssh
sudo systemctl start ssh
{% endcodeblock %}

确认 SSH 正在运行：
{% codeblock lang:bash %}
sudo systemctl status ssh
{% endcodeblock %}

应看到状态为：
{% codeblock lang:bash %}
Active: active (running)
{% endcodeblock %}

### 配置本机免密登录（localhost）
让 Hadoop 在执行脚本时能自动 SSH 登录自己而不用密码。

生成 SSH 密钥：
{% codeblock lang:bash %}
ssh-keygen -t rsa -P ""
{% endcodeblock %}
一路回车（Enter）即可。

把公钥加到本机授权文件（多机器的话则是把本机公钥加到每台机器的授权文件）：
{% codeblock lang:bash %}
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
{% endcodeblock %}

测试免密登录：
{% codeblock lang:bash %}
ssh localhost
{% endcodeblock %}

第一次可能会提示：
{% codeblock lang:bash %}
Are you sure you want to continue connecting (yes/no)?
{% endcodeblock %}

输入：
{% codeblock lang:bash %}
yes
{% endcodeblock %}

然后如果能直接进入（没有要求输入密码），说明成功。

退出：
{% codeblock lang:bash %}
exit
{% endcodeblock %}

## 在 Hadoop 的配置文件中显式设置 JAVA_HOME
由于SSH 默认启动的是 非登录 shell，不会加载 ~/.bashrc，所以 .bashrc中的 JAVA_HOME 虽然在 .bashrc 里，但 Hadoop 的脚本看不到。

因此需要编辑：
```
$HADOOP_HOME/etc/hadoop/hadoop-env.sh
```

执行命令：
{% codeblock lang:bash %}
nano /usr/local/hadoop/etc/hadoop/hadoop-env.sh
{% endcodeblock %}

找到这一行（大概在文件中间位置）：
{% codeblock lang:bash %}
# export JAVA_HOME=
{% endcodeblock %}

把注释去掉并改成你系统真实的 Java 路径，例如（以 Java 8 为例）：
{% codeblock lang:bash %}
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
{% endcodeblock %}
保存并退出（Ctrl+O → 回车 → Ctrl+X）。

保存后重新加载环境
{% codeblock lang:bash %}
source ~/.bashrc
{% endcodeblock %}

## 定义NameNode所在地址
打开配置文件
{% codeblock lang:bash %}
sudo nano /usr/local/hadoop/etc/hadoop/core-site.xml
{% endcodeblock %}

找到：
{% codeblock lang:xml %}
<property>
<property>
{% endcodeblock %}

将`<property>`和中间夹着的内容改成：
{% codeblock lang:xml %}
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://localhost:9000</value>
</property>
{% endcodeblock %}
保存并退出（Ctrl+O → 回车 → Ctrl+X）。

这样系统就能知道 NameNode 所在主机的主机名或 IP（localhost）。

## 启动
启动前需格式化 NameNode（必须重新格式化）。
{% codeblock lang:bash %}
hdfs namenode -format
{% endcodeblock %}

输入启动 HDFS 的命令：
{% codeblock lang:bash %}
start-dfs.sh
{% endcodeblock %}

确认启动结果：
{% codeblock lang:bash %}
jps
{% endcodeblock %}

输出应当包含：
{% codeblock lang:bash %}
NameNode
DataNode
SecondaryNameNode
Jps
{% endcodeblock %}
等信息。

可以尝试在浏览器输入：
{% codeblock lang:txt %}
http://localhost:9870
{% endcodeblock %}
打开 Hadoop 的 HDFS Web 管理界面，如果成功打开，说明 HDFS 已经成功启动了。

大部分情况下ubuntu系统没有图形界面，只有纯终端，如果用的是虚拟机，可以通过：
{% codeblock lang:bash %}
hostname -I
{% endcodeblock %}
在 Ubuntu 虚拟机中查看 IP 地址。

假设输出：
{% codeblock lang:bash %}
192.168.56.101
{% endcodeblock %}
在宿主机的浏览器里输入：
{% codeblock lang:txt %}
http://192.168.56.101:9870
{% endcodeblock %}
就可以打开管理界面了。

如果用的是云服务器，则在本地电脑执行：
{% codeblock lang:bash %}
ssh -L 9870:localhost:9870 username@<你的服务器IP>
{% endcodeblock %}
`username`改成云服务器那边的用户名。

然后在本地浏览器打开：
{% codeblock lang:txt %}
http://localhost:9870
{% endcodeblock %}
这条命令让你本地的 9870 端口 “转发” 到远程服务器的 9870 端口上。


# 通过脚本实现HDFS文件操作
## 准备工作
确保以下前提都满足：

1. Hadoop 已经正确安装并能启动：
{% codeblock lang:bash %}
start-dfs.sh
jps
{% endcodeblock %}
能看到 NameNode、DataNode、SecondaryNameNode。

2. Java 环境配置正确：
{% codeblock lang:bash %}
java -version
javac -version
{% endcodeblock %}

3. HDFS 运行正常：
{% codeblock lang:bash %}
hdfs dfs -mkdir /test
hdfs dfs -ls /
{% endcodeblock %}

## 编写 Java 脚本
在一个方便的目录下创建一个项目目录：
{% codeblock lang:bash %}
mkdir -p ~/hdfs-java-api
cd ~/hdfs-java-api
{% endcodeblock %}

创建一个 Java 文件：
{% codeblock lang:bash %}
nano HdfsClient.java
{% endcodeblock %}

在这个 Java 文件里写入如下代码：
{% codeblock lang:java %}
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileStatus;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;

public class HdfsClient {
    public static void main(String[] args) throws Exception {
        // 1. 设置 Hadoop 配置信息
        Configuration conf = new Configuration();
        conf.set("fs.defaultFS", "hdfs://localhost:9000"); // 如果配置了 hostname 就写 hdfs://CivilightEterna:9000

        // 2. 获取文件系统对象
        FileSystem fs = FileSystem.get(new URI("hdfs://localhost:9000"), conf, "username");

        // 3. 创建目录
        Path dir = new Path("/experiment");
        if (!fs.exists(dir)) {
            fs.mkdirs(dir);
            System.out.println("✅ 目录 /experiment 创建成功！");
        }

        // 4. 上传文件
        Path localFile = new Path("/home/username/test.txt");
        Path hdfsFile = new Path("/experiment/test.txt");
        fs.copyFromLocalFile(localFile, hdfsFile);
        System.out.println("✅ 文件上传成功！");

        // 5. 读取文件
        FSDataInputStream inputStream = fs.open(hdfsFile);
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        System.out.println("✅ 文件内容：");
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        reader.close();

        // 6. 查看文件信息
        FileStatus status = fs.getFileStatus(hdfsFile);
        System.out.println("✅ 文件路径：" + status.getPath());
        System.out.println("✅ 文件大小：" + status.getLen() + " bytes");

        // 7. 删除文件
        fs.delete(hdfsFile, true);
        System.out.println("✅ 文件已删除。");

        // 8. 关闭文件系统
        fs.close();
    }
}
{% endcodeblock %}
将其中的`username`改成自己的用户名。

然后在本地ubuntu用户目录创建一个名`test.txt`的文件：
{% codeblock lang:bash %}
echo "Hello HDFS from Java API!" > /home/username/test.txt
{% endcodeblock %}
同样将其中的`username`改成自己的用户名。

## 编译并运行
设置 Hadoop 的依赖路径：
```
export HADOOP_CLASSPATH=$(hadoop classpath)
```

编译：
```
javac -cp $HADOOP_CLASSPATH HdfsClient.java
```

如果编译成功，会生成：
```
HdfsClient.class
```

运行程序：
```
java -cp $HADOOP_CLASSPATH:. HdfsClient
```
注意后面的 `:.` 代表当前目录也要加入 classpath。

## 运行效果示例
如果一切正常，你会看到输出：
{% codeblock lang:bash %}
✅ 目录 /experiment 创建成功！
✅ 文件上传成功！
✅ 文件内容：
Hello HDFS from Java API!
✅ 文件路径：hdfs://localhost:9000/experiment/test.txt
✅ 文件大小：26 bytes
✅ 文件已删除。
{% endcodeblock %}

同时你可以验证：
{% codeblock lang:bash %}
hdfs dfs -ls /experiment
{% endcodeblock %}
来确认是否真的上传和删除了文件。