---
title: Git和Github基本用法
date: 2024-10-26 12:59:54
category: 技术笔记
tags:
- git
- github
post-info: true
---
# [git](https://git-scm.com/)和[github](https://github.com/)的关系和区别
## [git](https://git-scm.com/)

说到git，很多初学者的第一印象是github，好像git的用处就是从github仓库clone项目，或者也可以把自己的项目上传到github，但是为什么要上传，也不是很清楚。

其实，git作为一个分布式版本控制系统，是一个命令行工具，它最根本的功能是用于在本地管理和跟踪文件的更改历史，或者用更好理解的说法，git的基础功能是“存档”。
<!-- more -->

在打游戏的时候，你会时不时存个档，这样干了什么傻事以后还可以回档，比如你不小心销毁了一件很重要的装备以后，你可以通过回档撤销你干的傻事。同时，有些游戏还支持备份存档，也就是说你可以在这个存档的基础上，复制一个平行的存档，新存档生成的时候和原来的存档游戏进度相同，但是当新存档生成以后，就和原来的存档互不影响了，你可以在备份的存档里面干各种原来不敢在主存档干的事，就算把装备都融了，屋子都炸了也不用在意。有些游戏还支持存档互通，你在备份存档里面打败了新的boss，有了更好的装备，还可以送回主存档，加快主存档的进度。这样一来，坏事影响不了主存档，好事却可以。而存档文件通常不大，100多个G的游戏玩了几个月的存档文件可能还不到100M。有了存档的机制，你玩游戏的时候会更加放松工具自在。

git差不多就是这么一个玩意，git的本地仓库干的就是存档的活。有时候你会担心把原本良好的代码改坏而蹑手蹑脚，亦或者你有时突然感觉之前的代码更好。如果你每次改代码前都留一个备份，那你的文件夹会看起来很乱，而且每留一版备份，就会多一用倍的存储空间，十分不方便。而git所包含的版本控制功能就很好的解决解决了这个问题。git commit对应了游戏中的手动存档;git reset、git revert、git restore等命令对应了游戏中的回档;git branch对应了游戏中备份了一个平行存档;git checkout对应了切换存档;git merge对应了将其他备份存档的装备送到主存档。。。。。。有了这个类别，git的意义也就很好理解了。

## [github](https://github.com/)
git并不依赖github，git甚至不联网都能用，git是单人开发的时候也可以使用的工具，便于存档回档而存在。而github却依赖git，github是一个代码托管平台，它利用git来进行版本控制，允许你将本地的git仓库推送到远程，并与他人共享代码。除了github以外，国内还有类似gitee这样功能相似的平台，它们的基本功能是相似的。

除去让别人看得到自己的代码(开源)以外，github最核心的功能便是多人开发。对于一个多人完成的项目而言，每个成员闭门造车肯定会效率低下。github提供了一个多人协作的良好平台。在一个项目建立的时候，技术负责人创建一个github仓库，创建一个main分支,main分支是门面，是后续发布的根本，所以main分支必须是纯净的，所以在main的基础上创建一个dev分支，dev(develop)分支负责开发，后续的改动都在dev分支上面进行。团队的不同人负责不同的事情，比如张三负责增加菜单，王五负责增加背景音乐，那他们就分别在dev的基础上再分别开一个feature/menu和feature/music分支并在这两个分支上面做开发和改动，当开发的差不多了，就将这两个分支合并到dev分支，当开发到了一个阶段(比如实现了基本功能)，就由负责人在dev分支的基础是建立一个release分支，在这个分支上做最后的调试和bug修复，最后当一切都没有问题了，再由负责人将release合并到main分支。这样一来，main分支的代码始终是纯净的，稳定的，也方便了后续的发布和部署。

# git命令
## 配置类命令
### 配置全局用户名
{% codeblock lang:bash %}
git config --global user.name "Your Name"
{% endcodeblock %}
### 配置全局邮箱
{% codeblock lang:bash %}
git config --global user.email "you@example.com"
{% endcodeblock %}
配置全局用户名和邮箱有助于多人开发时让别人知道相关提交源自于谁

### 设置默认的文本编辑器
{% codeblock lang:bash %}
git config --global core.editor "code --wait"   //vscode
git config --global core.editor "vim"           //vim
git config --global core.editor "subl -n -w"    //sublime text
git config --global core.editor "atom --wait"   //atom
git config --global core.editor "clion --wait"  //clion
git config --global core.editor "charm -w"      //pycharm
{% endcodeblock %}
在进行commit操作以后，如果没有增加提交描述，git会强制打开一个默认文本编辑器让你编辑提交描述(一般默认是vim)，对于不熟悉vim的人而言，这会十分麻烦，设置一个趁手的默认文本编辑器会让编辑过程方便一些。

## 本地仓库命令
### 创建仓库
在项目文件夹根目录输入
{% codeblock lang:bash %}
git init
{% endcodeblock %}
初始化仓库以后，在根目录会出现一个名为.git的隐藏文件夹(要在文件资源管理器->查看->显示中勾选隐藏的项目才能看到)，就是由这个文件夹记录git仓库的各种信息和各种分支、提交。删掉这个文件夹，也就删掉了本地仓库，这时就又要通过git init重新创建本地仓库了。

### 更改缓存
{% codeblock lang:bash %}
git add <file>              //将单个文件添加到暂存区。
git add .                   //添加当前目录下的所有文件到暂存区。
git reset <file>            //清理特定文件的缓存
git reset                   //清理所有暂存的更改
git restore --staged <file> //效果和git reset <file>类似
git restore --staged .      //效果和git reset 类似
git reset --hard            //清除未提交的所有更改（包括暂存区和工作区）
git rm --cached <file>      //删除暂存区中特定文件的缓存，并且让Git停止追踪它
git rm -r --cached .        //删除暂存区中所有文件的缓存，并且让Git停止追踪它们
{% endcodeblock %}
在提交版本(存档)前需要提交的内容放入缓存，为后续提交指定范围。
如果要查看缓存的状态，我们可以使用
{% codeblock lang:bash %}
git status
{% endcodeblock %}
来查看哪些文件被缓存，哪些被追踪的文件没有被缓存
如果不出意外，你会觉得一个一个添加缓存很慢，我们当然希望能用一个命令就把该缓存的全都缓存、该删除缓存的全都删除了。但是直接用git add .又不合理，因为比如.venv(虚拟环境)、build这样的文件是不应该被git追踪并缓存的。因为这些文件很大、而且他们的变化是编译或者安装库的结果，不是我们应该关系的，也不是应该由我们手动更改的。我们需要一种方法，将这些文件排除在版本控制之外。
git提供了一种方法将文件或者文件夹排除在版本控制之外————.gitignore
首先，在要排除的文件或者文件夹所在的那一级目录新建一个文件，取名为.gitignore 。注意前面的点不要漏掉。
随后，将要排除的文件夹或者文件的名字填入其中，一行一个，再保存一下，这些被填入其中的文件和文件夹就被排除在版本控制之外了。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022313360.png)
有些时候.gitignore可能不生效，可以试试删了重建.gitignore ，在输入以下命令让Git停止追踪要忽略的内容
{% codeblock lang:bash %}
git rm -r --cached .
git add .
{% endcodeblock %}
当确定.gitignore生效以后，此后每次提交前更改缓存就只要执行
{% codeblock lang:bash %}
git add .
{% endcodeblock %}
就行了。

### 提交版本
提交版本相对应给游戏存档，是git最核心的功能，版本提交命令如下：
{% codeblock lang:bash %}
git commit                      //不带提交描述
git commit -m "commit message"  //带提交描述
{% endcodeblock %}
对应git，每次commit都是必须携带提交描述的，而且不能用空字符串代替，对于第一种命令，git会打开默认文本编辑器让你编辑提交信息，不会用vim记得按照本文前面的内容修改默认文本编辑器。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022405745.png)

![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022520450.png)
在第一行的空白处填上提交描述，保存以后关闭文本编辑器，提交就完成了。

对于第二种命令，直接将描述写在引号里面就行，不需要再去编辑文本编辑器。

如果需要查看之前提交过的版本，可以通过以下命令查看提交日志
{% codeblock lang:bash %}
git log             //打印日志完整信息
git log --oneline   //打印日志简略信息，每次提交占一行
{% endcodeblock %}

如果想要回到之前某一次提交之后，查看那次提交的[工作区](https://vscode.github.net.cn/docs/editor/workspaces#google_vignette)状态，可以通过命令
{% codeblock lang:bash %}
git checkout <commit-hash>
{% endcodeblock %}
回到那次提交后的状态。
<commit-hash>是那次的哈希值，git会为每次提交生成独一无二的哈希值，哈希值可以通过查看提交日志知晓。
这个命令可以改变[HEAD指针](https://juejin.cn/post/7103746773335687176)，但是这种状态类似只读状态，你在工作区做的任何更改都不会被保留。
查看完以后，可以通过
{% codeblock lang:bash %}
git checkout -
{% endcodeblock %}
返回最后一次提交的状态

### 版本回滚
版本回滚相对应游戏里的回档，可以通过以下几种命令进行版本回滚。

#### git reset命令
{% codeblock lang:bash %}
git reset --soft <commit-hash>       //仅重置 HEAD，不影响暂存区和工作区
git reset --mixed <commit-hash>      //重置 HEAD 和暂存区，保留工作区更改（默认）
git reset --hard <commit-hash>       //重置 HEAD、暂存区和工作区，彻底清除后续所有更改
{% endcodeblock %}
使用soft后缀的话，只会将那次提交之后的所有提交去除，但是工作区和缓存区都不会改变，如果你觉得某次提交之后的所有提交都没有什么实际意义，你希望自己的提交历史看起来清爽一点，但又感觉现在的工作区还不错，不想改动工作区，那不妨试试这个命令。
mixed后缀是git reset的默认方法，也就是如果你不加--后缀，就会默认带了--mixed，和soft的区别是，mixed还重置了缓存区，便于你进行手动恢复文件之类的操作(虽然并不是很好用)
如果希望完全回档，推荐使用hard后缀，hard后缀可以完全重置到那次提交以后的HEAD、暂存区和工作区，是最符合“回档”期望的命令，如果觉得某次提交之后的代码越写越屎，可以直接用这个命令穿越回过去(bushi)
直接撤回最近一次提交可以用
{% codeblock lang:bash %}
git reset --hard HEAD~1
{% endcodeblock %}
同理，如果你希望撤回最近n次提交，可以使用
{% codeblock lang:bash %}
git reset --hard HEAD~n
{% endcodeblock %}
如果想直接回到最近一次提交，清除未提交的所有更改（包括暂存区和工作区），可以使用
{% codeblock lang:bash %}
git reset --hard
{% endcodeblock %}

#### git revert命令
git reset简单粗暴，但也有其弊端，git reset会完全丢弃回滚的那次提交以后的所有提交，也就是说你回档以后又后悔了，那你就没的后悔了。
而且在多人开发中，reset如果回滚到了某次合并分支的结点之前，也会因为两边历史不同而造成冲突，所以在多人开发中，reset只能回退到最近一次合并或创建分支的结点之后，有一定局限。
如果要符合多人开发规范，需要使用git revert命令
{% codeblock lang:bash %}
git revert <commit-hash>     //撤销某次提交
git revert HEAD              //撤销最新的提交
git revert HEAD~3..HEAD      //撤销前3次提交，但是分三次提交
git revert -n HEAD~3..HEAD   //撤销前3次提交，但是一次性提交
{% endcodeblock %}
注意，-n是代表不提交模式，三次撤销完了也不会提交，需要
{% codeblock lang:bash %}
git commit -m "Reverted last 3 commits"
{% endcodeblock %}
手动提交
能撤销前三次，说明也能撤销前n次，把3改成其他数字就行。
和reset不一样，reset是撤销到某次提交之后，而revert则是撤销某次提交，没有之后。记得不要撤销过头。
git revert不会移除任何提交信息，而是在当前分支上创建一个新的提交，这个提交的内容会“反向应用”指定的更改，也就是说，使用git revert以后，提交历史反而会变多。
git revert和git reset相比不会在多人开发中产生因为历史不同而生的冲突和错误。
git revert可以撤销中间几次的提交，比如
{% codeblock lang:bash %}
 git revert -n HEAD~7..HEAD~4
{% endcodeblock %}
是撤销倒数第5次和倒数第6次提交。记得，
{% codeblock lang:bash %}
 git revert -n HEAD~x..HEAD~y
{% endcodeblock %}
撤销的是倒数第y+1到倒数第x-1次提交，不是倒数y到x次提交！很反常识对吗，反正找个理由说服自己就行。。。。。。
在git revert的时候，特别是撤销中间几次提交的时候，很容易发送冲突，这时候git会打开默认文本编辑器让你解决冲突，按照预期取舍就行，实在不知道怎么搞就点击接受组合。
在git revert的过程中，当你处于一个操作中，你可以通过下述命令选择继续、放弃或退出该操作。
{% codeblock lang:bash %}
git revert --continue   //如果你已经解决了冲突或完成了必要的更改，可以继续 revert 操作
git revert --abort      //放弃当前的 revert 操作，并将仓库恢复到 revert 操作开始之前的状态。
git revert --quit       //退出当前的 revert 操作，但保留已经应用的更改。
{% endcodeblock %}

#### git restore命令
如果你觉得git revert命令太复杂了，到是还有一种更加简单，而且还不破坏提交历史的方法
{% codeblock lang:bash %}
git restore --source=<commit-hash> --staged --worktree .
git commit -m "将版本回滚到<commit-hash>状态"
{% endcodeblock %}
这个命令并不会影响提交历史，而是从指定的提交中恢复文件到当前工作目录和暂存区，这意味着当前工作目录中的文件将被替换为指定提交中的版本。
这时候再手动commit一下，就可以将那个版本的工作区作为一个新的提交。
这样一来，也可以等效达成"回档"的目的，而且因为是在原基础上新建提交，所以并不会破坏之前的提交。
不过相比于git revert，git restore命令的跨度太大了，因为是恢复工作区和缓存，而不是回滚，虽然这种方法在多人开发中不会造成冲突，但其规范性还是不如git revert。

### 修改版本信息
有时你可能觉得之前某次提交不好，但是又不希望弄没之后的提交，这时候你可能需要通过rebase来修改个别提交
首先启动启动交互式 rebase
{% codeblock lang:bash %}
git rebase -i HEAD~4
{% endcodeblock %}
-i 用于启用交互模式，使用命令以后，git会打开默认文本编辑器进行交互编辑
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022617771.png)
中间那个是每次提交的哈希值，右边那个是每次提交的描述(我偷懒随便写的)
HEAD后面填了4，所以显示了最近4次提交，用更大的数字可以查看到跟之前的提交
之后我们要根据需求更改pick为其他命令
{% blockquote %}
常用命令
pick：保留该提交。相当于“选择”该提交并按原样应用到新的历史记录中。

edit：标记该提交需要修改，Git 会在这个提交暂停，允许你进行修改、补充内容或更改提交信息。修改完成后继续 rebase。

squash（简写：s）：将当前提交与前一个提交合并，并且会合并两者的提交信息。适用于整理多个小的提交，将它们合并成一个较大的提交。

fixup（简写：f）：类似于 squash，将当前提交与前一个提交合并，但不会保留当前提交的信息。这在仅想保留前一个提交信息的情况下非常有用。

reword：保留该提交，但允许修改其提交信息。

drop：删除该提交，从历史记录中移除它。
{% endblockquote %}
值得注意的是，reword只能修改提交描述，edit还可以修改那次提交的操作信息，比如你可以在文件里面加点什么删点什么，不过不出意外会出点冲突，这样就又要解决冲突了。
比如我们想修改4444那次提交，我们把4444那次提交前面的pick改成edit
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022711908.png)
之后我们保存并关闭编辑文件，就临时进入了那次提交的编辑状态(最近的不再是ddd，而是4444)
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022745612.png)
随后我们修改完相应的文件，用
{% codeblock lang:bash %}
git add .
{% endcodeblock %}
添加缓存，解决完冲突再用命令
{% codeblock lang:bash %}
git rebase --continue
{% endcodeblock %}
进入文本编辑器编辑提交信息，再保存关闭文本编辑器，修改就完成了。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022819349.png)
最近的一次提交也变回了ddd，而4444那次提交中则增加了你新编辑的那些操作。

和revert一样，rebase也不止有continue后缀
在revert过程中解决了冲突或其他更改，可以用相同命令选择继续、放弃或退出该操作
{% codeblock lang:bash %}
git rebase --continue   //如果你已经解决了冲突或完成了必要的更改，可以继续 rebase 操作
git rebase --abort      //放弃当前的 rebase 操作，并将仓库恢复到 rebase 操作开始之前的状态。
git rebase --quit       //退出当前的 rebase 操作，但保留已经应用的更改。
{% endcodeblock %}

### 分支管理
分支相当于游戏里的备份存档，在git中同样有着十分重要的功能。

#### 创建分支
使用命令
{% codeblock lang:bash %}
git branch <branch_name>
{% endcodeblock %}
你在哪个分支上创建分支，就是在哪个分支的基础上创建分支。。。。。。额，这可能不像是人话。
或者说，比如你在main这个分支上输入了
{% codeblock lang:bash %}
git branch dev
{% endcodeblock %}
的命令，那就是在main这个分支的基础上，分出了dev这个分支，dev将会继承main的所有文件信息和提交历史，同时后续对两者编辑又互不影响。

#### 切换分支
使用命令
{% codeblock lang:bash %}
git checkout <branch_name>
{% endcodeblock %}
可以切换到指定分支。
切换到不同分支以后，工作区和提交历史都会变成相应分支的状态。

对应创建分支，如果希望快一点，直接创建并切换到新分支，也可以用
{% codeblock lang:bash %}
git checkout -b <branch_name>
{% endcodeblock %}
直接一步到位。

#### 列出本地分支
使用命令
{% codeblock lang:bash %}
git branch
{% endcodeblock %}
可以列出本地分支的信息。比如：
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022846797.png)
说明本地仓库有两个分支，分别是main和dev，其中main前面有星号意味着目前切换到的分支是main。

#### 删除分支
使用命令
{% codeblock lang:bash %}
git branch -d <branch_name>
{% endcodeblock %}
可以删除本地分支

#### 合并分支
当开发到一点程度的时候，要将分支的内容合并到主干上，有两种方法可以合并分支
##### 用merge合并
一般情况下大多采用merge合并
{% codeblock lang:bash %}
git merge <branch_name>
{% endcodeblock %}
比如要将dev合并到main，那就先切换到main分支，再执行
{% codeblock lang:bash %}
git merge dev
{% endcodeblock %}
这样一来，dev就被合并到了main上
但经过这样的合并，main的提交历史就不一定是直线的了。比如我们在dev分支创建以后，先在dev上进行了三次提交，后来又在main上进行了一次提交，那通过merge合并以后，提交历史会变成这样：
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022917285.png)
如果你有某种洁癖，不能忍受非直线的历史，可以尝试后面的方法。

##### 用rebase合并
rebase不仅可以修改提交信息，还可以用来合并分支。
在和上面相同的情况下，通过
{% codeblock lang:bash %}
git rebase dev
{% endcodeblock %}
命令达到的效果是这样的：
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308022945990.png)
合并以后的提交历史依旧是直线，这样看起来更加干净，当然，如果用git merge也是完全没有问题的。

### 标签管理
当开发到了一个具有里程意义的时候，需要发布版本，发布前需要增加标签，为发布做准备。

#### 创建标签
{% codeblock lang:bash %}
git tag -a tag_name commit_hash -m "Tag message"
{% endcodeblock %}
-a 指定标签为附注标签。
-m 允许添加一个标签说明信息 "Release version 1.0"。
commit_hash是标签对应提交版本的哈希值
例如：
{% codeblock lang:bash %}
git tag -a v1.0 9fceb02 -m "Release version 1.0"
{% endcodeblock %}
9fceb02也可以换成完整的哈希值

#### 列出所有标签
{% codeblock lang:bash %}
git tag
{% endcodeblock %}

#### 删除标签
{% codeblock lang:bash %}
git tag -d tag_name
{% endcodeblock %}

#### 查看标签详情
{% codeblock lang:bash %}
git show tag_name
{% endcodeblock %}

#### 检出到标签版本
{% codeblock lang:bash %}
git checkout tag_name
{% endcodeblock %}
可以通过
{% codeblock lang:bash %}
git checkout -
{% endcodeblock %}
返回原来的分支。

## 远程仓库命令
### 增加远程仓库
增加远程仓库可以通过命令
{% codeblock lang:bash %}
git remote add <remote> <remote-URL>
{% endcodeblock %}
实现。
远程仓库的名称是由自己来取，不一定和github仓库那边一样，远程仓库URL要在github仓库那里获取，就是git clone后面常跟的那串URL。
例如可以添加一个名字取为origin的远程仓库
{% codeblock lang:bash %}
git remote add upstream https://github.com/another/repo.git
{% endcodeblock %}
远程仓库不一定只能添加一个，一个本地仓库可以添加很多个远程仓库(虽然没有必要)，可以通过切换上游分支来便于拉取和推送。
可以通过
{% codeblock lang:bash %}
git remote -v
{% endcodeblock %}
查看本地仓库添加了多少远程仓库。

### 新建远程分支
先在本地创建一个新分支，再切换到这个分支上(如果已经有分支了也可以不用创建，可以直接切换)
{% codeblock lang:bash %}
git checkout -b <local-branch>
{% endcodeblock %}
再将本地新分支推送到远程
{% codeblock lang:bash %}
git push -u <remote> <remote-branch>
{% endcodeblock %}
这样远程就多了一个分支，分支名和<remote-branch>设置的一样。
例如：
{% codeblock lang:bash %}
git checkout -b feature-branch
git push -u origin feature-branch
{% endcodeblock %}
这里的 -u 会将本地分支与远程分支设置为追踪关系，即将远程分支设置为本地分支的上游，以便将来可以直接使用 git pull 和 git push 来同步。

### 切换上游分支
{% codeblock lang:bash %}
git branch --set-upstream-to <remote>/<remote-branch> <local-branch>
{% endcodeblock %}
假设你想将本地的 feature 分支设置为跟踪远程的 origin/feature 分支，可以执行以下命令：
{% codeblock lang:bash %}
git branch --set-upstream-to origin/feature feature
{% endcodeblock %}
当然，也可以先切换至feature分支，在执行：
{% codeblock lang:bash %}
git branch -u origin/feature
{% endcodeblock %}
设置了上游分支以后,之后拉取和推送会简化许多。
可以通过
{% codeblock lang:bash %}
git branch -vv
{% endcodeblock %}
查看每个本地分支对应的上游
如果你不清楚远程仓库有哪些分支，可以通过
{% codeblock lang:bash %}
git fetch
git branch -r
{% endcodeblock %}
查看远程仓库所有分支。其中git fetch是获取远程仓库的所有信息(但是不改变工作区和缓存)
如果不想要上游分支了，可以先切换到你想取消上游设置的分支，再通过：
{% codeblock lang:bash %}
git branch --unset-upstream
{% endcodeblock %}
取消上游追踪。

### 拉取与推送
#### 拉取远程更新
{% codeblock lang:bash %}
git pull <remote> <remote-branch>
{% endcodeblock %}
例如从 origin 仓库的 main 分支拉取最新的提交到本地的 main 分支：
先切换到main分支。再执行
{% codeblock lang:bash %}
git pull origin main
{% endcodeblock %}
命令。
git pull可以看作git fetch + git merge 两个命令的结合
也就是说，上述命令可以等效成
{% codeblock lang:bash %}
git fetch <remote> <remote-branch>
git merge <remote> <remote-branch>
{% endcodeblock %}
或者
{% codeblock lang:bash %}
git fetch  <remote> <remote-branch>
git rebase <remote> <remote-branch>
{% endcodeblock %}
注意，多人协作时应当尽力避免rebase！
如果某个本地分支设置了上游分支，在这个本地分支上可以直接执行：
{% codeblock lang:bash %}
git pull
{% endcodeblock %}
git 会默认从上游分支拉取最新信息。

#### 推送到远程仓库
在push之前，最好先更新本地分支，避免与远程分支之间有冲突。所以先执行：
{% codeblock lang:bash %}
git fetch <remote> <remote-branch>
{% endcodeblock %}
再执行push操作：
{% codeblock lang:bash %}
git push <remote> <remote-branch>
{% endcodeblock %}
例如将本地 main 分支的提交推送到 origin 仓库的 main 分支:
先切换到main分支。再执行
{% codeblock lang:bash %}
git fetch origin main
git push origin main
{% endcodeblock %}
命令。
如果某个本地分支设置了上游分支，在这个本地分支上可以直接执行：
{% codeblock lang:bash %}
git fetch
git push
{% endcodeblock %}
git 会默认向上游分支推送最新信息。
如果有很多远程仓库，可以通过
{% codeblock lang:bash %}
git fetch --prune
{% endcodeblock %}
获取所有远程更新并清理无用的远程跟踪分支
如果你因为reset或者rebase导致提交历史发生了变化，和远程仓库的历史对不上，那么推送大概率会因为冲突而失败，这时需要一种更强硬的推送命令；
{% codeblock lang:bash %}
git fetch
git push --force <remote> <branch>
{% endcodeblock %}
强制推送会覆盖远程仓库中的分支内容，以匹配本地分支的状态，从而推送成功。
{% tip warning 但切记，在多人开发中应当极力避免这个命令出现，这会给其他成员造成极大麻烦！ %} 

### 删除分支
当一个分支完成了它的使命以后，通常要在本地和远程将这个分支删去。怎么在本地删除分支在前文写了，在远程仓库删除分支需要执行：
{% codeblock lang:bash %}
git push <remote> --delete <remote-branch>
{% endcodeblock %}
假设要删除远程仓库 origin 中的 feature-branch 分支，命令如下：
{% codeblock lang:bash %}
git push origin --delete feature-branch
{% endcodeblock %}

### 标签管理
在进行远程标签管理之前，需要先获取远程标签的信息：
{% codeblock lang:bash %}
git fetch <remote> --tags
{% endcodeblock %}
例如：
{% codeblock lang:bash %}
git fetch origin --tags
{% endcodeblock %}

#### 推送标签到远程仓库
{% codeblock lang:bash %}
git push <remote> <tag-name>    //推送单个标签
git push <remote> --tags        //推送单个标签
{% endcodeblock %}
例如：
{% codeblock lang:bash %}
git push origin v1.0
git push origin --tags
{% endcodeblock %}

#### 查看远程标签
{% codeblock lang:bash %}
git tag
{% endcodeblock %}

#### 删除远程标签
先删除本地标签,然后删除远程标签：
{% codeblock lang:bash %}
git push <remote> --delete <tag-name>
{% endcodeblock %}
例如：
{% codeblock lang:bash %}
git push origin --delete v1.0
{% endcodeblock %}

#### 更新远程标签
在 Git 中，标签是不可变的。因此，要更新标签，需要先删除旧的标签并重新推送。
先删除本地和远程的旧标签。再创建新的标签。最后推送新的标签到远程。

#### 发布(release)
创佳完标签以后就可以在github这样的远程仓库发布。直接进入远程仓库的网页，一般在右下角可以根据提示将创建了标签的版本发布。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308023027350.png)

# 多人开发事项
## 一般团队开发流程
对于一个多人完成的项目而言，在一个项目建立的时候，技术负责人创建一个github仓库，创建一个main分支,main分支是门面，是后续发布的根本，所以main分支必须是纯净的，因此在main的基础上创建一个dev分支，dev(develop)分支负责开发，后续的改动都在dev分支上面进行。团队的不同人负责不同的事情，比如张三负责增加菜单，王五负责增加背景音乐，那他们就分别在dev的基础上再分别开一个feature/menu和feature/music分支并在这两个分支上面做开发和改动，当开发的差不多了，就将这两个分支合并到dev分支，当开发到了一个阶段(比如实现了基本功能)，就由负责人在dev分支的基础是建立一个release分支，在这个分支上做最后的调试和bug修复，最后当一切都没有问题了，再由负责人将release合并到main分支。这样一来，main分支的代码始终是纯净的，稳定的，也方便了后续的发布和部署。

## 对项目做贡献
对于仓库创建者以外的成员(或者想给项目做贡献的人)，需要进入项目的仓库去fork这个仓库。
在英文中，"fork" 的字面意思是“叉”或“分叉”。在软件开发中，Fork 代表“分支”或“分流”的含义。它表示在某个项目或代码库的基础上“分出一条支流”，以独立的副本形式进行修改和发展。这个分支副本可以随着开发者的需求进行调整、增强或定制，与原始项目保持一定的独立性。

### Fork 仓库
fork的按钮一般在仓库的右上角
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308023112295.png)
在仓库页面右上角找到 "Fork" 按钮，点击后 GitHub 会在你的账户下创建一个该仓库的副本。
完成后，页面会跳转到你账户中的新 Fork 仓库，仓库名称会以 <你的用户名>/<仓库名> 的形式显示。

### 将 Fork 的仓库克隆到本地
在你自己的 Fork 仓库页面中，克隆这个仓库到你的本地系统(替换 <URL> 为你复制的仓库地址)
{% codeblock lang:bash %}
git clone <URL>
{% endcodeblock %}
随后进入克隆后的仓库目录。

### 配置远程仓库
默认情况下，Git 会将你的 Fork 仓库设为远程仓库（一般称为 origin）。但是，为了便于与原始仓库保持同步，通常会将原始仓库添加为另一个远程仓库，称为 upstream：
{% codeblock lang:bash %}
git remote add upstream <original-repository-URL>
{% endcodeblock %}
original-repository-URL是原始仓库的UPL

这样你的仓库就会有两个远程：
origin：指向你的 Fork 仓库。
upstream：指向原始仓库。

### 从原始仓库同步更新
为了保持你的 Fork 仓库与原始仓库的最新内容一致，定期同步更新是很重要的：
{% codeblock lang:bash %}
git fetch upstream
git merge upstream/main
{% endcodeblock %}
也可以使用 rebase，保持更整洁的提交记录：
{% codeblock lang:bash %}
git rebase upstream/main
{% endcodeblock %}

### 在 Fork 仓库中创建新分支并进行修改
创建并切换到一个新的分支，便于进行修改：
{% codeblock lang:bash %}
git checkout -b <new-branch-name>
{% endcodeblock %}
在新分支上进行修改、提交更改：
{% codeblock lang:bash %}
git add .
git commit -m "Description of changes"
{% endcodeblock %}

### 推送分支到你的 Fork 仓库
将你新分支上的更改推送到 GitHub 上的 Fork 仓库：
{% codeblock lang:bash %}
git push origin <new-branch-name>
{% endcodeblock %}

### 提交 Pull Request (PR)
在你的 Fork 仓库页面中，在左上角选择 Pull Request。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308023157591.png)
进入Pull Request以后点击New Pull Request
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308023253392.png)
编写 PR 描述，解释你所做的更改，并选择合适的目标分支（通常是 main 或 develop)。
提交 PR，等待原始仓库的维护者审核和合并。

### 同步最新更新
在原始仓库有新的更新时，可以通过以下命令保持同步：
{% codeblock lang:bash %}
git fetch upstream
git merge upstream/main
git push origin main
{% endcodeblock %}

### 注意事项
在多人开发中，应当:
+ 用git revert 代替git reset
+ 禁止在最近一次创建或合并分支的结点之前使用git reset 或者git rebase
+ 严禁对不止一人交互的仓库使用git push --force

上述三条注意事项都是为了避免对提交历史造成关键性影响，对提交历史的更改在多人协作中可能造成拉取和推送的冲突，而且还会影响到其他成员的工作。所以在多人开发中应该尽量通过创建新的提交来代替更改以往的提交。

# gui版

如果觉得git命令很麻烦，推荐使用github官方推出的工具[Github Desktop](https://desktop.github.com/download/)。

这是一个图形用户界面版的git工具，上述的各种命令基本都能通过按按钮实现，非常方便。

而且作为官方发布的工具，Github Desktop安全性也很高，可以很好避免因为错误使用命令而把工作区变得乱七八糟的风险。

不过Github Desktop只适用于Github，如果使用的是其他平台，可能需要用到例如Gitee Desktop等其他工具。