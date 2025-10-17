---
title: Ubuntu环境下HBase数据管理
date: 2025-10-16 12:51:27
category: 技术笔记
tags:
- HDFS
- Hadoop
- HBase
- Java
- Ubuntu
- Linux
- 大数据
post-info: true
---
# HBase 的相关信息
## HBase 是什么
HBase 是一种分布式的、面向列（Column-oriented）的 NoSQL 数据库，是 Hadoop 生态系统 的重要组成部分。

它的全称是：
{% blockquote %}
Hadoop Database (HBase)
{% endblockquote %}

起源于 Google 的 Bigtable 论文，HBase 是 Bigtable 在开源界的实现，由 Apache 基金会维护。
<!-- more -->

## HBase 与 Hadoop 的关系
HBase 是 Hadoop 的上层应用之一，它依赖 Hadoop 的组件实现底层存储与分布式管理。

| 层次      | 组件                           | 作用                                    |
| ------- | ---------------------------- | ------------------------------------- |
| 存储层     | **HDFS**                     | 负责将数据分块、分布式存储在集群中                     |
| 计算层     | **MapReduce / Yarn / Spark** | 提供大数据批处理或计算框架                         |
| 数据库层    | **HBase**                    | 提供结构化数据的存储和随机访问                       |
| 查询层（可选） | **Hive / Impala / Phoenix**  | 提供SQL接口和查询优化                          |
| 协调层     | **ZooKeeper**                | 管理HBase的分布式协作、主从选举、RegionServer 状态监控等 |

可以这样理解它们的关系：
{% blockquote %}
🗂 HDFS 管数据的“存放位置”

🧮 MapReduce 管数据的“计算任务”

🏗 HBase 管数据的“存储结构与访问方式”
{% endblockquote %}

或者一句话概括：
{% blockquote %}
Hadoop 负责“存+算”，HBase 负责“查+改”。
{% endblockquote %}

## HBase 的数据模型（类比关系型数据库）
| 概念               | 对应关系型数据库 | 说明           |
| ---------------- | -------- | ------------ |
| Namespace        | 数据库      | 命名空间         |
| Table            | 表        | 存储数据的逻辑单元    |
| Row Key          | 主键       | 每行的唯一标识      |
| Column Family    | 列族       | 一组逻辑相关的列     |
| Column Qualifier | 列名       | 属于某个列族下的具体列  |
| Timestamp        | 版本号      | 同一单元格数据的时间版本 |
| Cell             | 单元格      | 存储具体数据（值）    |

举个例子：
{% codeblock lang:text %}
Table: Student
RowKey: 2015001
Column Family: Info, Score

Data:
RowKey | Info:Name | Info:Sex | Info:Age | Score:Math | Score:English
2015001 | Zhangsan  | male     | 23       | 86          | 69
{% endcodeblock %}

可以看到：

+ `Info` 是一个列族（存放学生基本信息）

+ `Score` 是另一个列族（存放成绩信息）

+ 每行由一个唯一的 `RowKey`（学号）标识

## HBase 和 Mysql 的区别
HBase 和 Mysql 都是数据库，但他们适用的领域不一样，可以把它们想象成两种不同的交通工具：

+ MySQL 像一辆精密的轿车：适合在结构化的道路（固定表结构）上快速、安全、准确地运送少量贵重物品（结构化数据）。它强调事务安全和数据一致性。

+ HBase 像一列重载的火车：适合在粗糙的轨道（松散结构）上运输海量的、各种形态的货物（半/非结构化数据）。它追求的是吞吐量和大容量，而不是每件货物的精确摆放。

✅ HBase 适合的场景有：

+ 数据量非常大（TB级以上）

+ 数据是稀疏表（不是每行都有所有列）

+ 需要高吞吐随机读写

+ 需要按时间或主键快速检索

+ 例如：

    + 用户行为日志系统

    + 传感器 IoT 数据

    + 社交关系存储

    + 推荐系统用户画像

    + 搜索引擎索引数据

❌ 不适合的场景：

+ 小数据量项目（几GB以内）

+ 需要复杂SQL、多表关联、事务支持

+ 表结构频繁变化

对于这些场景用 Mysql 会更合适。

# 环境准备
在使用 HBase 前需要先[搭好 HDFS 环境](https://fallingnight.com/2025/10/14/Ubuntu%E7%8E%AF%E5%A2%83%E4%B8%8BHDFS%E5%9F%BA%E7%A1%80%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C/)

## 安装 HBase
下载安装包：
{% codeblock lang:bash %}
wget https://archive.apache.org/dist/hbase/1.4.13/hbase-1.4.13-bin.tar.gz
{% endcodeblock %}

解压并移动到`/usr/local/`目录下：
{% codeblock lang:bash %}
sudo tar -zxvf hbase-1.4.13-bin.tar.gz -C /usr/local/
{% endcodeblock %}

## 配置环境变量
打开`Bash`配置文件：
{% codeblock lang:bash %}
sudo nano ~/.bashrc
{% endcodeblock %}

如果你按照之前[搭 HDFS 环境](https://fallingnight.com/2025/10/14/Ubuntu%E7%8E%AF%E5%A2%83%E4%B8%8BHDFS%E5%9F%BA%E7%A1%80%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C/#more)的那篇文章配置过`.bashrc`文件，把之前加在文集末尾的内容改成：
```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=/usr/local/hadoop
export HBASE_HOME=/usr/local/hbase
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$HBASE_HOME/bin:$HBASE_HOME/sbin
```
保存并退出（Ctrl+O → 回车 → Ctrl+X）。
修改以后相较于原来增加了`HBase`

之后执行：
{% codeblock lang:bash %}
source ~/.bashrc
{% endcodeblock %}
使配置文件生效。

随后打开 HBase 的配置文件：
{% codeblock lang:bash %}
sudo nano /usr/local/hbase/conf/hbase-site.xml
{% endcodeblock %}

找到：
{% codeblock lang:xml %}
<property>
<property>
{% endcodeblock %}

将`<property>`和中间夹着的内容改成：
{% codeblock lang:xml %}
<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>hdfs://localhost:9000/hbase</value>
  </property>

  <property>
    <name>hbase.zookeeper.property.dataDir</name>
    <value>/usr/local/hbase/zookeeper</value>
  </property>

  <property>
    <name>hbase.cluster.distributed</name>
    <value>true</value>
  </property>
</configuration>
{% endcodeblock %}
保存并退出（Ctrl+O → 回车 → Ctrl+X）。

# 启动 HBase
在 HDFS 已经启动的前提下，执行：
{% codeblock lang:bash %}
start-hbase.sh
{% endcodeblock %}
启动 HBase 。

如果想要关闭 HBase，可以执行：
{% codeblock lang:bash %}
stop-hbase.sh
{% endcodeblock %}

启动完以后执行：
{% codeblock lang:bash %}
jps
{% endcodeblock %}
进行验证。

如果输出包含：
{% codeblock lang:bash %}
HMaster
HRegionServer
{% endcodeblock %}
说明 HBase 启动成功。

# 使用 HBase 命令
## 打开和退出 HBase Shell
成功启动 HBase 以后可以执行：
{% codeblock lang:bash %}
hbase shell
{% endcodeblock %}
进入 `HBase Shell`。

进入成功会出现提示符：
{% codeblock lang:bash %}
hbase(main):001:0>
{% endcodeblock %}

`HBase Shell` 类似 mysql 命令行，在这里可以通过命令对数据和表进行操作管理。

想要退出 HBase Shell 可以直接执行：
{% codeblock lang:bash %}
exit
{% endcodeblock %}

## HBase Shell 常用命令
HBase 的命令不像 SQL，而是类 Ruby 语法。
命令格式大多是：
{% codeblock lang:bash %}
command '参数1', '参数2', ...
{% endcodeblock %}

### 表管理命令
| 命令                           | 功能               | 示例                         |
| ---------------------------- | ---------------- | -------------------------- |
| `list`                       | 列出所有表            | `list`                     |
| `create`                     | 创建表              | `create 'student', 'info'` |
| `describe`                   | 查看表结构            | `describe 'student'`       |
| `disable`                    | 禁用表（修改或删除前必须禁用）  | `disable 'student'`        |
| `enable`                     | 启用表              | `enable 'student'`         |
| `is_enabled` / `is_disabled` | 查看表状态            | `is_enabled 'student'`     |
| `drop`                       | 删除表（必须先 disable） | `drop 'student'`           |
| `exists`                     | 判断表是否存在          | `exists 'student'`         |

创建表例子：
{% codeblock lang:bash %}
create 'student', 'info'
{% endcodeblock %}
这会创建一张名为 student 的表，包含一个列族 info。

### 数据操作命令
| 命令          | 功能     | 示例                                            |
| ----------- | ------ | --------------------------------------------- |
| `put`       | 插入数据   | `put 'student', 'row1', 'info:name', 'Alice'` |
| `get`       | 读取单行数据 | `get 'student', 'row1'`                       |
| `scan`      | 扫描整张表  | `scan 'student'`                              |
| `delete`    | 删除某个列值 | `delete 'student', 'row1', 'info:name'`       |
| `deleteall` | 删除整行   | `deleteall 'student', 'row1'`                 |
| `count`     | 统计行数   | `count 'student'`                             |
| `truncate`  | 清空表数据  | `truncate 'student'`                          |

插入和读取示例：
{% codeblock lang:bash %}
put 'student', 'row1', 'info:name', 'Alice'
put 'student', 'row1', 'info:age', '21'
get 'student', 'row1'
{% endcodeblock %}

输出类似：
{% codeblock lang:bash %}
COLUMN                  CELL
 info:age               timestamp=..., value=21
 info:name              timestamp=..., value=Alice
{% endcodeblock %}

### 扫描查询
{% codeblock lang:bash %}
scan 'student'
{% endcodeblock %}

输出示例：
{% codeblock lang:bash %}
ROW                        COLUMN+CELL
 row1                      column=info:age, timestamp=..., value=21
                           column=info:name, timestamp=..., value=Alice
{% endcodeblock %}

你还可以加过滤条件，比如：
{% codeblock lang:bash %}
scan 'student', {STARTROW => 'row1', STOPROW => 'row9'}
{% endcodeblock %}

### 删除表数据
{% codeblock lang:bash %}
disable 'student'
drop 'student'
{% endcodeblock %}

或清空但保留表结构：
{% codeblock lang:bash %}
truncate 'student'
{% endcodeblock %}

### 管理命令（系统级）
| 命令                 | 功能                 |
| ------------------ | ------------------ |
| `status`           | 查看 HBase 集群状态      |
| `version`          | 查看 HBase 版本        |
| `whoami`           | 查看当前用户             |
| `status 'simple'`  | 查看 RegionServer 数量 |
| `status 'summary'` | 查看集群摘要             |

### 示例
例如要建的表叫 student，结构如下：

| RowKey  | info:name | info:sex | info:age | score:math | score:english |
| ------- | --------- | -------- | -------- | ---------- | ------------- |
| 2015001 | Zhangsan  | male     | 23       | 86         | 69            |

在 HBase 中：

+ 表名：`student`

+ 列族（Column Family）有两个：

  + `info`

  + `score`

+ 每个列族下有多个“列限定符”（Qualifier）：

  + `info:name`、`info:sex`、`info:age`

  + `score:math`、`score:english`

具体步骤如下：

#### 创建表：

命令：
{% codeblock lang:bash %}
create 'student', 'info', 'score'
{% endcodeblock %}

说明：

+ `student` 是表名；

+ `info` 和 `score` 是列族。

#### 插入数据

依次插入每一列数据：
{% codeblock lang:bash %}
put 'student', '2015001', 'info:name', 'Zhangsan'
put 'student', '2015001', 'info:sex', 'male'
put 'student', '2015001', 'info:age', '23'
put 'student', '2015001', 'score:math', '86'
put 'student', '2015001', 'score:english', '69'
{% endcodeblock %}

#### 查看表数据
查看单行:
{% codeblock lang:bash %}
get 'student', '2015001'
{% endcodeblock %}

输出类似：
{% codeblock lang:bash %}
COLUMN                    CELL
info:age                 timestamp=..., value=23
info:name                timestamp=..., value=Zhangsan
info:sex                 timestamp=..., value=male
score:english            timestamp=..., value=69
score:math               timestamp=..., value=86
{% endcodeblock %}

查看整张表:
{% codeblock lang:bash %}
scan 'student'
{% endcodeblock %}

输出类似：
{% codeblock lang:bash %}
ROW                        COLUMN+CELL
 2015001                   column=info:age, value=23
                           column=info:name, value=Zhangsan
                           column=info:sex, value=male
                           column=score:english, value=69
                           column=score:math, value=86
{% endcodeblock %}

#### 删除与清空操作
如果想删除整行：
{% codeblock lang:bash %}
deleteall 'student', '2015001'
{% endcodeblock %}

如果想清空表（但保留结构）：
{% codeblock lang:bash %}
truncate 'student'
{% endcodeblock %}

如果想彻底删除表：
{% codeblock lang:bash %}
disable 'student'
drop 'student'
{% endcodeblock %}

# 通过脚本使用 HBase
实际开发中肯定会通过编程实现与数据库的交互，而 HBase 提供了 Java 客户端接口，使得我们可以通过 Java 脚本使用 HBase 。

## 准备工作
确保已经启动 HDFS 和 HBase：
{% codeblock lang:bash %}
start-dfs.sh
start-hbase.sh
{% endcodeblock %}

检查进程：
{% codeblock lang:bash %}
jps
{% endcodeblock %}

确定输出包括：
{% codeblock lang:bash %}
NameNode
DataNode
SecondaryNameNode
HMaster
HRegionServer
{% endcodeblock %}

## 编写 Java 脚本
在一个方便的目录下创建一个项目目录：
{% codeblock lang:bash %}
mkdir -p ~/hbase-java-api
cd ~/hbase-java-api
{% endcodeblock %}

在该目录下创建一个 Java 文件：
{% codeblock lang:bash %}
nano HBaseExample.java
{% endcodeblock %}

在这个 Java 文件里写入如下代码：
{% codeblock lang:java %}
import java.io.IOException;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

public class HBaseExample {
    public static void main(String[] args) throws IOException {
        // 1. 创建HBase配置
        Configuration config = HBaseConfiguration.create();
        config.set("hbase.zookeeper.quorum", "localhost");
        config.set("hbase.zookeeper.property.clientPort", "2181");
        config.set("hbase.rootdir", "hdfs://localhost:9000/hbase");

        // 2. 建立连接
        Connection connection = ConnectionFactory.createConnection(config);
        Admin admin = connection.getAdmin();

        // 3. 创建表
        TableName tableName = TableName.valueOf("student");
        if (!admin.tableExists(tableName)) {
            TableDescriptorBuilder tableDesc = TableDescriptorBuilder.newBuilder(tableName);
            ColumnFamilyDescriptor family = ColumnFamilyDescriptorBuilder.newBuilder(Bytes.toBytes("info")).build();
            tableDesc.setColumnFamily(family);
            admin.createTable(tableDesc.build());
            System.out.println("✅ 表 'student' 已创建");
        } else {
            System.out.println("ℹ️ 表 'student' 已存在");
        }

        // 4. 插入数据
        Table table = connection.getTable(tableName);
        Put put = new Put(Bytes.toBytes("row1"));
        put.addColumn(Bytes.toBytes("info"), Bytes.toBytes("name"), Bytes.toBytes("Alice"));
        put.addColumn(Bytes.toBytes("info"), Bytes.toBytes("age"), Bytes.toBytes("21"));
        table.put(put);
        System.out.println("✅ 插入成功");

        // 5. 读取数据
        Get get = new Get(Bytes.toBytes("row1"));
        Result result = table.get(get);
        byte[] value = result.getValue(Bytes.toBytes("info"), Bytes.toBytes("name"));
        System.out.println("查询结果: " + Bytes.toString(value));

        // 6. 扫描整张表
        Scan scan = new Scan();
        ResultScanner scanner = table.getScanner(scan);
        for (Result res : scanner) {
            System.out.println(res);
        }
        scanner.close();

        // 7. 关闭资源
        table.close();
        admin.close();
        connection.close();
    }
}
{% endcodeblock %}

## 配置环境
设置 HBase 的依赖路径：
```
export HBASE_CLASSPATH=$(hbase classpath)
```

如果图方便，希望下次打开终端不用再输入如上命令，也可以把这行命令写进`.bashrc`文件，不过未来可能有冲突风险，需谨慎考虑。

## 编译运行
编译：
```
javac -cp $HBASE_CLASSPATH:. HBaseExample.java
```

运行:
```
java -cp $HBASE_CLASSPATH:. HBaseExample
```

## 在 Shell 验证结果
运行完 Java 程序后，打开 HBase shell：
{% codeblock lang:bash %}
hbase shell
list
scan 'student'
{% endcodeblock %}

预期输出：
{% codeblock lang:bash %}
ROW           COLUMN+CELL
 row1         column=info:age, timestamp=..., value=21
 row1         column=info:name, timestamp=..., value=Alice
1 row(s)
{% endcodeblock %}