---
title: 五子棋AI说明文档
date: 2026-04-09 15:53:01
category: 说明文档
tags:
- gomoku
- AI
post-info: true
---
本篇文章是[五子棋AI](https://fallingnight.com/gomoku/)的说明文档,有关原理问题请移步[这篇文章](https://fallingnight.com/blog/2026/01/20/%E4%BB%8E%E9%9B%B6%E5%AE%9E%E7%8E%B0-AlphaZero-%E9%A3%8E%E6%A0%BC%E7%9A%84%E4%BA%94%E5%AD%90%E6%A3%8B-AI/)
<!-- more -->

# 五子棋禁手规则
本平台的五子棋规则较为简单，没有设置禁手规则，所以黑子的胜算比白子高{% hide （其实你执黑也不一定能下赢人机）%}

# 基本功能
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409163139819.png)
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409163402587.png)

点击`开始游戏`开启对局，点击`重新开始`、`退出游戏`重开或结束对局。

勾选`玩家先手`或`AI先手`确定先手方（执黑）。

点击`悔棋`可以悔棋，没有次数限制。

# 胜率评估
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409164101961.png)
本平台提供了胜率预测功能，能在`AI评估`查看。

# 官方外挂
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409164409219.png)
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20260409164508853.png)
点击`机械飞升`获得AI辅佐视角。越绿的点越好，越红的点越差。

点击`血肉苦难`退出AI辅佐视角。

`100/3000`那个是模拟次数，模拟的越久结果越准确，敌方AI的模拟次数固定为200，也就是说你的AI比对面的强。

希望你不要沦落到开挂才能赢。

最后，祝你游玩愉快！{% hide 愉快在哪了我请问？%}