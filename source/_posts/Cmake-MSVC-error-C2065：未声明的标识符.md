---
title: Cmake MSVC error C2065：未声明的标识符
date: 2025-03-31 17:51:24
category: 报错修复
tags:
- C++
- Cmake
- MSVC
post-info: true
---

# 问题描述

用**cmake**加**MSVC工具链**编译**C++**程序的时候出现了`C2065：未声明的标识符`的报错。此前使用**minGW**的时候没有过这样的报错。
<!-- more -->

# 报错原因

问题是由于**源文件的字符编码不兼容**导致的。MSVC 默认使用**ANSI 编码**（如 GB2312 或 Shift-JIS）解析源文件，而源代码可能是**UTF-8**编码的，这就导致了 C2065（未声明的标识符）等错误，特别是当代码中包含非 ASCII 字符（如中文注释、字符串常量等）时。

# 解决方法

在CmakeLists增加：

{% codeblock lang:CmakeLists %}

if (CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")

​	add_compile_options(/source-charset:utf-8 /execution-charset:utf-8)

endif()

{% endcodeblock %}

这样就能强制 MSVC 以 UTF-8 解析代码，避免了字符编码问题引起的未声明标识符错误。
