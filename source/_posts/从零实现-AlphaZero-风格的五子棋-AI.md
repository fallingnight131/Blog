---
title: 从零实现 AlphaZero 风格的五子棋 AI
date: 2026-01-20 04:29:06
category: 项目文档
tags:
- Python
- Vue
- flask
- MCTS
- ResNet
post-info: true
---

> 本文详细介绍如何结合蒙特卡罗树搜索（MCTS）与深度残差网络，从零实现一个能够通过自我对弈持续提升棋力的五子棋 AI 系统。


# 项目概述

本项目是一个基于 AlphaZero 思想实现的五子棋 AI 系统。与传统的博弈 AI（如 Minimax + Alpha-Beta 剪枝）不同，本系统不依赖人类专家知识或手工设计的评估函数，而是让 AI 通过**自我对弈**从零开始学习五子棋策略。

<!-- more -->

## 项目特点

| 特性 | 说明 |
|------|------|
| 🎮 **AlphaZero 风格** | 结合 MCTS 与深度神经网络，实现端到端学习 |
| 🔄 **自我对弈训练** | 无需人类棋谱，从零开始自我博弈提升棋力 |
| 🌐 **现代 Web 界面** | Vue 3 + TypeScript 前端，支持人机对弈 |
| ⚡ **多进程加速** | 支持多进程并行自对弈，大幅提升训练效率 |
| 📊 **训练可视化** | 自动记录训练过程，生成损失曲线和胜率图表 |

## 技术栈

**后端：** Python 3.10+ / PyTorch 2.1.0 / FastAPI 0.104.1

**前端：** Vue 3.3 / TypeScript 5.3 / Vite 5.0 / Pinia 2.1

---

# 核心原理

## AlphaZero 算法思想

2017年，DeepMind 发布了 AlphaZero，仅通过自我对弈就在围棋、国际象棋、日本将棋上超越了所有前任冠军程序。其核心思想包括：

1. **深度神经网络**：用一个网络同时预测当前局面的**价值**（谁更可能赢）和**策略**（下一步应该走哪里）
2. **蒙特卡罗树搜索**：利用神经网络的预测来指导搜索，而非传统的随机模拟
3. **自我对弈**：AI 与自己对弈产生训练数据，不断迭代提升

```
┌────────────────────────────────────────────────────────────┐
│                    AlphaZero 训练循环                       │
│                                                            │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐            │
│   │  自我对弈 │ ──▶ │ 收集数据 │ ──▶ │ 训练网络 │ ──┐       │
│   └─────────┘     └─────────┘     └─────────┘   │        │
│        ▲                                          │        │
│        └──────────────────────────────────────────┘        │
│                        更新模型                             │
└────────────────────────────────────────────────────────────┘
```

## 蒙特卡罗树搜索 (MCTS)

MCTS 是一种启发式搜索算法，通过模拟来评估局面的好坏。AlphaZero 使用神经网络改进了传统 MCTS：

### 四个阶段

```
    选择 (Selection)          扩展 (Expansion)
         │                         │
         ▼                         ▼
    ┌─────────┐               ┌─────────┐
    │  根节点  │               │ 新节点   │
    │    ●    │──────────────▶│    ○    │
    │   / \   │               │         │
    │  ●   ●  │               └─────────┘
    └─────────┘                    │
                                   ▼
    回溯 (Backpropagation)    评估 (Evaluation)
         │                         │
         ▼                         ▼
    ┌─────────┐               ┌─────────┐
    │ 更新统计 │               │神经网络  │
    │  V, N   │◀──────────────│ (P, V)  │
    │ 向上传播 │               │         │
    └─────────┘               └─────────┘
```

1. **选择 (Selection)**：从根节点开始，根据 UCB 公式选择子节点，直到到达叶子节点
2. **扩展 (Expansion)**：在叶子节点扩展可能的子节点
3. **评估 (Evaluation)**：使用神经网络评估新节点的价值
4. **回溯 (Backpropagation)**：将评估结果向上传播，更新路径上所有节点的统计信息

### UCB 公式

节点选择使用 PUCT (Predictor Upper Confidence bounds applied to Trees) 公式：

$$UCB(s, a) = Q(s, a) + c_{puct} \cdot P(s, a) \cdot \frac{\sqrt{\sum_{b} N(s, b)}}{1 + N(s, a)}$$

其中：
- $Q(s, a)$：动作 $a$ 的平均价值（累计价值 / 访问次数）
- $P(s, a)$：策略网络给出的先验概率
- $N(s, a)$：动作 $a$ 的访问次数
- $c_{puct}$：探索常数（本项目使用 0.8）

这个公式巧妙地平衡了**利用**（选择高价值动作）和**探索**（尝试访问较少的动作）。

### Dirichlet 噪声

为了增加探索性，训练时在根节点添加 Dirichlet 噪声：

$$P_{root}(a) = (1 - \epsilon) \cdot P(a) + \epsilon \cdot Dir(\alpha)$$

本项目使用 $\epsilon = 0.01$, $\alpha = 0.3$。

## 策略价值网络

网络采用**双头架构**，共享特征提取层，分别输出策略和价值：

```
输入: (batch, 3, 15, 15)
  ├── 通道0: 当前玩家棋子位置
  ├── 通道1: 对手棋子位置
  └── 通道2: 空位位置
        │
        ▼
┌─────────────────────────────────┐
│  Conv2d(3→32, 3×3) + BN + ReLU  │  初始卷积层
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│        ResBlock × 5             │  5个残差块
│  ┌─────────────────────────┐    │
│  │ Conv(32,32) → BN → ReLU │    │
│  │ Conv(32,32) → BN        │    │
│  │      + skip connection  │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
        │
        ├───────────────────────────┐
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│     价值头       │         │     策略头       │
│   Conv(32→1)    │         │  Conv(32→16)    │
│   Flatten       │         │  Conv(16→1)     │
│   Linear(128)   │         │  Flatten        │
│   Linear(1)     │         │  Softmax        │
│   Tanh          │         │                 │
└─────────────────┘         └─────────────────┘
        │                           │
        ▼                           ▼
  局面价值 ∈ [-1, 1]        落子概率 ∈ [0, 1]^225
```

---

# 系统架构

```
Gomoku-AI/
├── backend/                    # 后端服务
│   ├── main.py                 # FastAPI 入口
│   ├── game/
│   │   └── board.py            # 棋盘逻辑
│   ├── ai/
│   │   ├── network.py          # 神经网络定义
│   │   ├── mcts.py             # MCTS 算法
│   │   └── train.py            # 训练脚本
│   └── models/
│       └── best_model.pth      # 训练好的模型
│
├── frontend/                   # Vue 前端
│   └── src/
│       ├── components/         # 组件 (棋盘、控制面板等)
│       ├── stores/             # Pinia 状态管理
│       └── api/                # API 调用
│
└── deploy/                     # 部署配置
    ├── deploy.sh
    └── nginx.conf
```

## 前后端交互流程

```
┌─────────────┐                    ┌─────────────┐
│   前端 Vue   │                    │  后端 FastAPI │
│             │                    │             │
│  1. 点击落子 │ ─── POST /move ──▶ │             │
│             │                    │  2. 执行MCTS │
│             │                    │     搜索     │
│  4. 显示结果 │ ◀── AI落子+胜率 ─── │  3. 返回结果 │
│             │                    │             │
└─────────────┘                    └─────────────┘
```

---

# 代码实现详解

## 神经网络设计

### 残差块

残差连接使得网络可以更深，同时避免梯度消失：

```python
class ResidualBlock(nn.Module):
    """残差块"""
    
    def __init__(self, channels: int):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        residual = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += residual  # 残差连接
        out = self.relu(out)
        return out
```

### 策略价值网络

```python
class PolicyValueNetwork(nn.Module):
    """策略-价值网络"""
    
    def __init__(self, in_channels=3, hidden_channels=32, num_blocks=5):
        super().__init__()
        
        # 初始卷积层
        self.conv_init = nn.Conv2d(in_channels, hidden_channels, 3, padding=1)
        self.bn_init = nn.BatchNorm2d(hidden_channels)
        
        # 残差块
        self.res_blocks = nn.ModuleList([
            ResidualBlock(hidden_channels) for _ in range(num_blocks)
        ])
        
        # 策略头：输出每个位置的落子概率
        self.policy_conv = nn.Conv2d(hidden_channels, 1, kernel_size=3, padding=1)
        
        # 价值头：输出当前局面的胜率评估
        self.value_conv = nn.Conv2d(hidden_channels, 1, kernel_size=1)
        self.value_fc1 = nn.Linear(225, 128)
        self.value_fc2 = nn.Linear(128, 1)

    def forward(self, x):
        # 特征提取
        x = F.relu(self.bn_init(self.conv_init(x)))
        for block in self.res_blocks:
            x = block(x)
        
        # 策略头
        policy = self.policy_conv(x).view(x.size(0), -1)
        
        # 价值头
        value = F.relu(self.value_conv(x)).view(x.size(0), -1)
        value = torch.tanh(self.value_fc2(F.relu(self.value_fc1(value))))
        
        return value, policy
```

### 棋盘状态编码

将棋盘转换为神经网络输入的三通道张量：

```python
def board_to_tensor(board: list) -> torch.Tensor:
    """
    将棋盘转换为神经网络输入
    
    输入 board: 15x15 矩阵，1=当前方，-1=对方，0=空
    输出: (3, 15, 15) 张量
    """
    board_arr = np.array(board)
    
    current_player = (board_arr == 1).astype(np.float32)   # 当前玩家棋子
    opponent = (board_arr == -1).astype(np.float32)        # 对手棋子
    empty = (board_arr == 0).astype(np.float32)            # 空位
    
    return torch.FloatTensor(np.stack([current_player, opponent, empty]))
```

## MCTS 实现

### 节点定义

```python
class Node:
    """MCTS 树节点"""
    
    def __init__(self, board, parent=None, move=None):
        self.board = board           # 当前局面
        self.parent = parent         # 父节点
        self.move = move             # 到达该节点的动作
        self.children = {}           # 子节点字典 {move: (child, prior)}
        self.visit_count = 0         # 访问次数 N
        self.value_sum = 0.0         # 累计价值 W
        self.value = None            # 神经网络评估值
    
    @property
    def q_value(self):
        """平均价值 Q = W / N"""
        if self.visit_count == 0:
            return 0.0
        return self.value_sum / self.visit_count
```

### UCB 子节点选择

```python
def _select_child(self, node: Node) -> Node:
    """根据 UCB 公式选择子节点"""
    total_visits = sum(
        (child.visit_count if child else 0) 
        for child, _ in node.children.values()
    )
    sqrt_total = math.sqrt(total_visits + 1)
    
    best_score = -float('inf')
    best_move = None
    
    for move, (child, prior) in node.children.items():
        if child and child.visit_count > 0:
            # 已访问节点：使用实际 Q 值
            exploit = child.q_value
            explore = self.c_puct * prior * sqrt_total / (child.visit_count + 1)
        else:
            # 未访问节点：使用平均值估计
            exploit = avg_value
            explore = self.c_puct * prior * sqrt_total
        
        score = explore - exploit  # 注意：这里取负是因为子节点视角相反
        if score > best_score:
            best_score = score
            best_move = move
    
    return self._get_or_create_child(node, best_move)
```

### 完整搜索流程

```python
def search(self, root_board, num_simulations):
    """执行 MCTS 搜索"""
    root = Node(root_board)
    
    for _ in range(num_simulations):
        node = root
        search_path = [node]
        
        # 1. 选择：沿树下降到叶子节点
        while node.children:
            node = self._select_child(node)
            search_path.append(node)
        
        # 2. 扩展与评估
        if not self._is_terminal(node.board):
            self._expand_node(node)  # 使用神经网络扩展
        else:
            node.value = self._evaluate_terminal(node.board)
        
        # 3. 回溯：更新路径上所有节点
        value = node.value
        for n in reversed(search_path):
            n.visit_count += 1
            n.value_sum += value
            value = -value  # 翻转视角
    
    return self._get_results(root), root
```

## 自我对弈训练

### 训练数据生成

每局自对弈结束后，收集所有经历的局面作为训练数据：

```python
def generate_single_game(model_state_dict, num_simulations):
    """生成单局自对弈数据"""
    model = PolicyValueNetwork()
    model.load_state_dict(model_state_dict)
    
    board = [[0] * 15 for _ in range(15)]
    mcts = MCTS(model=model)
    
    for move_num in range(225):
        # MCTS 搜索
        (value, action_probs), root = mcts.search(board, num_simulations)
        
        # 根据概率选择动作
        action = select_action(action_probs, temperature=0.1)
        x, y = action
        board[x][y] = 1
        
        if is_game_over(board):
            break
        
        # 翻转视角（双方交替）
        flip_board(board)
    
    # 返回训练数据：(局面, 策略, 价值)
    return mcts.get_train_data()
```

### 数据增强

五子棋棋盘具有 D4 对称性（4次旋转 × 2次翻转 = 8倍数据增强）：

```python
def augment_data(boards, policies, values, weights):
    """D4 对称变换数据增强"""
    augmented = []
    
    for board, policy, value, weight in zip(boards, policies, values, weights):
        for k in range(4):  # 0°, 90°, 180°, 270° 旋转
            for flip in [False, True]:  # 是否水平翻转
                new_board = torch.rot90(board, k, [1, 2])
                new_policy = torch.rot90(policy, k, [0, 1])
                
                if flip:
                    new_board = torch.flip(new_board, [2])
                    new_policy = torch.flip(new_policy, [1])
                
                augmented.append((new_board, new_policy, value, weight))
    
    return augmented
```

### 训练损失函数

使用组合损失：价值损失（MSE）+ 策略损失（KL散度）

```python
def train_step(model, batch):
    boards, target_policies, target_values = batch
    
    pred_values, pred_policies = model(boards)
    
    # 价值损失：均方误差
    value_loss = F.mse_loss(pred_values, target_values)
    
    # 策略损失：KL散度
    policy_loss = F.kl_div(
        F.log_softmax(pred_policies, dim=1),
        target_policies,
        reduction='batchmean'
    )
    
    # 总损失（价值损失权重更高）
    total_loss = 2 * value_loss + policy_loss
    
    return total_loss
```

### 模型选择策略

采用 AlphaZero 风格的模型选择，确保模型持续进步：

```python
def evaluate_and_update(new_model, best_model, num_games=20):
    """评估新模型并决定是否更新"""
    wins = 0
    
    for game in range(num_games):
        # 新模型 vs 最佳模型对弈
        winner = play_game(new_model, best_model)
        if winner == 1:  # 新模型获胜
            wins += 1
    
    win_rate = wins / num_games
    
    # 胜率超过 55% 才更新最佳模型
    if win_rate > 0.55:
        save_model(new_model, 'best_model.pth')
        return True
    return False
```

---

# 项目部署与使用

## 环境配置

```bash
# 1. 克隆项目
git clone https://github.com/fallingnight131/Gomoku-AI.git
cd Gomoku-AI

# 2. 创建 Conda 环境
conda create -n gomoku python=3.10 -y
conda activate gomoku

# 3. 安装后端依赖
cd backend
pip install -r requirements.txt

# 4. 安装前端依赖
cd ../frontend
npm install
```

## 启动服务

```bash
# 终端1：启动后端
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 终端2：启动前端
cd frontend
npm run dev
```

访问 http://localhost:5173 开始游戏！

## 训练模型

```bash
cd backend

# 快速测试（5-10分钟）
python -m ai.train -n 5 --samples 10 --simulations 30 --workers 4

# 标准训练（2-4小时）
python -m ai.train -n 50 --samples 100 --simulations 30 --workers 10

# 完整训练（8-24小时）
python -m ai.train -n 200 --samples 100 --simulations 30 --workers 10
```

## 训练参数说明

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `-n, --iterations` | 100 | 训练迭代次数 |
| `--samples` | 100 | 每轮自对弈局数 |
| `--simulations` | 30 | 训练时 MCTS 模拟次数 |
| `--workers` | 10 | 并行进程数 |
| `--eval-interval` | 10 | 评估间隔 |
| `--win-threshold` | 0.55 | 更新最佳模型的胜率阈值 |

---


# 参考资料

1. [Mastering the Game of Go without Human Knowledge](https://www.nature.com/articles/nature24270) - AlphaGo Zero 论文
2. [Mastering Chess and Shogi by Self-Play](https://arxiv.org/abs/1712.01815) - AlphaZero 论文
3. [Monte Carlo Tree Search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) - 蒙特卡罗树搜索介绍
4. [Deep Residual Learning](https://arxiv.org/abs/1512.03385) - ResNet 论文

---

**代码仓库：** [GitHub - Gomoku-AI](https://github.com/fallingnight131/Gomoku-AI)

**临时部署：** [五子棋AI](https://fallingnight.cn/)

如果这篇文章对你有帮助，欢迎 Star ⭐ 支持！
