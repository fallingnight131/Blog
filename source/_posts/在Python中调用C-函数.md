---
title: 在Python中调用C++函数
date: 2024-10-11 03:14:19
category: 技术笔记
tags:
- Python
- C++
- Ctype
- Pybind
post-info: true
---
Python 作为一种解释型语言，虽然易于编写和维护，但在执行速度上可能不如 C++ 这样的编译型语言。C++ 提供了高度优化的性能，尤其是在计算密集型任务中。
有时候，你可能已经有大量用 C++ 编写的现有代码或库，重新用 Python 实现这些功能费时费力。你或许想过通过调用 C++ 代码来复用这些现有的模块和算法。
<!-- more -->

---

要实现 C++ 和 Python 跨语言编程，可以使用 Python 的 ctypes 或 pybind11 来调用 C++ 代码。下面介绍两种方式：
# 方法一：使用 ctypes
ctypes 是 Python 的一个标准库，可以让你调用 C++ 动态链接库（如 .dll）。
## 编写 C++ 代码并生成动态链接库
编写 C++ 代码并编译成动态库（.dll），例如：
{% codeblock lang:cpp %}
// example.cpp
extern "C" {
    int add(int a, int b) {
        return a + b;
    }
    int sub(int a, int b) {
        return a - b;
    }
}
{% endcodeblock %}
编译该文件生成 .dll，例如使用 g++:
{% codeblock lang:bash %}
g++ -shared -o example.dll -fPIC example.cpp
{% endcodeblock %}
C++代码中使用了extern "C"是将C++转换成C风格。
C++ 编译器会对函数名进行一种称为 "name mangling" 的过程，即编译器会根据函数的名称、参数类型、返回值类型等信息生成一个唯一的标识符。这样做是为了支持函数重载（不同参数的同名函数），但它也导致编译后的函数名和源码中的名称不一致。
例如，C++ 中以下两个函数可能会在编译后被重整为不同的名字：
{% codeblock lang:cpp %}
int add(int a, int b);        // 可能被重整为 _Z3addii
float add(float a, float b);  // 可能被重整为 _Z3addff
{% endcodeblock %}
这个重整过程使得 Python 的 ctypes 无法找到正确的函数名称。
## 在 Python 中使用 ctypes 调用 C++ 函数
在 Python 中调用该动态库：
{% codeblock lang:python %}
import ctypes

# 加载 C++ 动态链接库
example = ctypes.CDLL('./example.dll')

# 调用 C++ 函数
result = example.add(5, 3)
print(result)  # 输出 8
result = example.sub(5, 3)
print(result)  # 输出 2
{% endcodeblock %}
于是我们就在Python中调用了C++的函数。
但使用 ctypes 调用 C++ 类是比较复杂的，因为 ctypes 主要用于处理 C 语言风格的函数调用，而 C++ 类的特性（如构造函数、析构函数、继承、多态等）无法直接通过 ctypes 调用。于是我们需要一种泛用性更高的方法——pybind11。
# 方法二：使用 pybind11
{% tip warning 请确定你可以使用Visual Studio编译器！ %} 
我之前用的MinGW的编译器一直生成失败，换成visual studio工具链的编译器就立马能生成了，应该是因为MinGW 的一些版本在处理 C++11 的多线程支持时存在兼容性问题。

---

pybind11 是一个轻量级的库，专门用于将 C++ 和 Python 绑定。
## 安装cmake
进入[cmake官网](https://cmake.org/)走下载流程就行。~~一般情况会C++的电脑里面都有cmake，除非你的电脑刚好是windows，而且电脑里刚好有visual studio。~~
## 下载pybind11的库
在github中搜索[pybind11](https://github.com/pybind/pybind11)，将仓库里面的内容下载到本地。
如果下载了[git](https://git-scm.com/)，可以直接用
{% codeblock lang:bash %}
git clone https://github.com/pybind/pybind11.git
{% endcodeblock %}
将文件拷贝到本地。

## 将pybind11库放进项目文件夹
官方文档中推荐将pybind11库放进一个叫extern的文件夹里面。
我们进入要使用pybind的项目的根目录，在里面新建一个叫extern的文件夹，把pybind11库移动进去。

## 编辑CmakeList文件
打开任意一个集成开发环境(比如vscode)，在根目录创建一个CmakeLists.txt文件。
{% codeblock lang:cmake %}
cmake_minimum_required(VERSION 3.23)
project(example)  # 设置项目名称

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(PYTHON_EXECUTABLE "D:/....../Python/python.exe")
set(PYTHON_LIBRARY "D:/....../Python/libs/python.lib")
set(PYTHON_INCLUDE_DIR "D:/....../Python/include")

add_subdirectory(extern/pybind11)
pybind11_add_module(example example.cpp)

{% endcodeblock %}
将上述脚本输入CmakeLists.txt文件。其中pybind11_add_module()中的**Example**代表等会生成的连接库文件的名字(可以换成其他的名字)，**example.cpp**则是包含要调用函数或者类的cpp文件，如果有多个cpp文件，就将多个cpp文件都加上去，用空格" "隔开。
set(PYTHON..............)那三行找到你电脑里面的python文件，将exe文件、lib文件、include文件夹的绝对地址换进去。
比如你用的python3.8，那第二行就要找的是python38.lib的绝对地址，以此类推，但注意的是这里选择的python和你后面解释python程序时用的python解释器必须是同一个python(比如你现在填的3.8后面就一定要用3.8去解释)

## 编写要调用的cpp文件

### C++函数的例子
//example.cpp
{% codeblock lang:cpp %}
#include <pybind11/pybind11.h>
namespace py = pybind11;

int add(int i, int j)
{
    return i + j;
}

PYBIND11_MODULE(example, m)
{
    // 可选，说明这个模块是做什么的
    m.doc() = "pybind11 example plugin";
    //def( "给python调用方法名"， &实际操作的函数， "函数功能说明" ，py::arg()初始化). 其中函数功能说明和初始化为可选
    m.def("add", &add, "A function which adds two numbers", py::arg("i")=1, py::arg("j")=2);
}
{% endcodeblock %}

### C++类的例子
{% codeblock lang:cpp %}
//example.cpp
#include <pybind11/pybind11.h>
#include <iostream>
namespace py = pybind11;
// 绑定一个类
class SomeClass
{
public:
    SomeClass(float scale_) : scale(scale_) {};
    float multiply(float input)
    {
        float res = input * scale;
        std::cout << "res:" << res << std::endl;
        return res;
    }

private:
    float scale;
};

PYBIND11_MODULE(example, m)
{
    py::class_<SomeClass>(m, "SomeClass")       // 绑定一个类
        .def("multiply", &SomeClass::multiply) // 绑定一个成员函数
        .def(py::init<float>());                // 绑定一个构造函数
}
{% endcodeblock %}

## 通过cmake构建动态连接库文件
在根目录创建一个名为build的文件夹，进入文件夹那级目录，在终端依次输入：
{% codeblock lang:bash %}
cmake ..
{% endcodeblock %}
{% codeblock lang:bash %}
cmake --build .
{% endcodeblock %}
({% hide 当然如果你装了和cmake有关的插件(Cmake和Cmake Tools)也可以用神秘小按钮代替命令 %} )

({% hide Cmake为CmakeLists.txt增加高亮等功能，Cmake Tools在下方增加了方便构建的按钮 %} )
这时你的build文件夹里出现了很多文件，在里面找到Debug(也可能是Release)文件夹，在其中找到一个.pyd(或者.so)结尾的文件，那就是动态链接库文件，后续会用到。

## 编写python文件，并引入C++写的模块

### 引入函数情况的例子
{% codeblock lang:python %}
# example.py
import sys


# 添加生成的模块路径
sys.path.append("D:/....../your_project/build/Debug")
# 或者sys.path.append("D:/....../your_project/build/Release")

import example as hw  

# 测试调用
print(hw.add(1, 2))     //result：3

{% endcodeblock %}

### 引入类情况的例子
{% codeblock lang:python %}
# example.py
import sys


# 添加生成的模块路径
sys.path.append("D:/....../your_project/build/Debug")
# 或者sys.path.append("D:/....../your_project/build/Release")
import example as ep

a = ep.SomeClass(3.0)

a.multiply(2.0)

print(a)
{% endcodeblock %}

sys.path.append()将包含 .pyd (或者.so)文件的目录添加到 sys.path 中，便于模块导入。

导入以后就可以直接运行了，切记，要用和之前set(PYTHON..............)里面填的一样的python解释器去运行，不然不一定会成功，如果你的集成开发环境安装了run code这样的插件，也记得换成python解释器，run code跑不了一点。