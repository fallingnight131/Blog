---
title: 用Matlab实现高斯消元法
date: 2024-11-19 17:39:59
category: 学习笔记
tags:
- 运筹与优化
- 高斯消元法
- Matlab
post-info: true
---

# 函数实现
{% codeblock lang:matlab %}
function x = gauss_elim(A, b)
    % 获取矩阵 A 的维度
    [n, ~] = size(A);
    
    % 扩展矩阵 A 和向量 b 组成增广矩阵 [A|b]
    Ab = [A b];
    
    % 高斯消元过程
    for i = 1:n
        % 选取主元素（行交换）
        [~, maxRow] = max(abs(Ab(i:n, i))); % 找到第 i 列的最大元素
        maxRow = maxRow + i - 1; % 修正为全矩阵的行号
        if i ~= maxRow
            % 交换行
            Ab([i, maxRow], :) = Ab([maxRow, i], :);
        end
        
        % 消元过程，消去主元下方的元素
        for j = i+1:n
            % 计算系数
            factor = Ab(j, i) / Ab(i, i);
            % 更新该行
            Ab(j, :) = Ab(j, :) - factor * Ab(i, :);
        end
    end
    
    % 回代求解
    x = zeros(n, 1); % 初始化解向量
    for i = n:-1:1
        x(i) = (Ab(i, end) - Ab(i, 1:n) * x) / Ab(i, i);
    end
end

{% endcodeblock %}
<!-- more -->