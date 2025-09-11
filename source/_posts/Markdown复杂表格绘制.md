---
title: Markdown复杂表格绘制
date: 2025-03-24 10:05:48
category: 技术笔记
tags:
- Markdown
- Latex
- html
post-info: true
---
# 基础表格绘制

## 画一张表

表格的基本语法如下，第一行是表格的标题行，第二行固定以 `---` 做分隔，列通过使用 `|` 來添加。宽度是自动分配的，如果第二行和第一行列数不一样也会自动对齐（但是会不美观）。空格会被忽视掉。`|`没有对齐也没有关系，最后形成的表格都是会自动对齐的。

{% codeblock lang:markdown %}

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text3    |
| Text4    | Text5    | Text6    |

{% endcodeblock %}

效果如下：

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text3    |
| Text4    | Text5    | Text6    |
<!-- more -->
## 对齐方法

默认是左对齐，但是如果希望自定义对齐方法也是可以的.

{% codeblock lang:markdown %}

| 预设对齐 | 靠左对齐 | 靠右对齐 | 置中对齐 |
| ----- | :----- | -----: | :-----: |
| Text1 | Text2 | Text3 | Text4 |
| Text5 | Text6 | Text7 | Text8 |
| Text9 | Text10 | Text11 | Text12 |

{% endcodeblock %}

效果如下：

| 预设对齐 | 靠左对齐 | 靠右对齐 | 置中对齐 |
| -------- | :------- | -------: | :------: |
| Text1    | Text2    |    Text3 |  Text4   |
| Text5    | Text6    |    Text7 |  Text8   |
| Text9    | Text10   |   Text11 |  Text12  |

## 表内换行

可以使用html标签`<br>`实现换行。

{% codeblock lang:markdown %}

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text3    |
| Text4    | Text5    | Text6<br>Text7    |

{% endcodeblock %}  

效果如下：

| Column 1 | Column 2 | Column 3       |
| -------- | -------- | -------------- |
| Text1    | Text2    | Text3          |
| Text4    | Text5    | Text6<br>Text7 |

## 特殊符号绘制

由于`|`有特殊意义，所以不能直接在表内使用。可以使用`&#124`来绘制`|`。

{% codeblock lang:markdown %}

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text3    |
| Text4    | Text5    | Text6&#124;Text7   |

{% endcodeblock %}  

效果如下：

| Column 1 | Column 2 | Column 3       |
| -------- | -------- | -------------- |
| Text1    | Text2    | Text3          |
| Text4    | Text5    | Text6 &#124;Text7 |

当你希望表中有空行的时候，直接不填东西是不行的。

例如：

{% codeblock lang:markdown %}

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text 3   |
|          |          |          |
| Text4    | Text5    | Text6    |

{% endcodeblock %}  

效果如下：

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text 3   |
|          |          |          |
| Text4    | Text5    | Text6    |

可以看到，中间一行直接凭空消失了。因为markdown会忽视没有填任何东西的行。

正确的写法是用`&nbsp;`占位。

{% codeblock lang:markdown %}

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text 3   |
| &nbsp;   |          |          |
| Text4    | Text5    | Text6    |

{% endcodeblock %}  

效果如下：

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Text1    | Text2    | Text 3   |
| &nbsp;   |          |          |
| Text4    | Text5    | Text6    |

这样一来，原本没有内容的一行就不会被忽视了。

## 复杂符号绘制

例如$a_{j}$、$x^{n}$这样有上标下标的符号；以及$\theta$这样的希腊符号，可以通过Latex实现，表格内部是支持Latex的。

在表格里面通过

```
$具体Latex语句$
``` 

可以插入复杂符号。

例如:

```
| $a_{j}$ | $x^{n}$ | $\theta$ |
| :-------: | :-------: | :--------: |
|   Text1   |   Text2   |   Text3    |
|   Text4   |   Text5   |   Text6    |
```

效果如下：

| $a_{j}$ | $x^{n}$ | $\theta$ |
| :-------: | :-------: | :--------: |
|   Text1   |   Text2   |   Text3    |
|   Text4   |   Text5   |   Text6    |



# 复杂表格绘制

如果要画更加复杂的表格，例如要合并单元格的话，markdown自带的表格绘制方法就不适用了。

需要通过html的方法实现单元格合并。

## 画一张表

首先用html画一个简单的表格：

```
<table border="1" width="600px" cellspacing="10">
    <tr>
        <th>Column 1</th> 
        <th>Column 2</th> 
        <th>Column 3</th> 
    </tr>
    <tr>
        <td>Text1</td> 
        <td>Text2</td> 
        <td>Text3</td> 
    </tr>
    <tr>
        <td>Text4</td> 
        <td>Text5</td> 
        <td>Text6</td> 
    </tr>
</table>
```

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th>Column 1</th> 
        <th>Column 2</th> 
        <th>Column 3</th> 
    </tr>
    <tr>
        <td>Text1</td> 
        <td>Text2</td> 
        <td>Text3</td> 
    </tr>
    <tr>
        <td>Text4</td> 
        <td>Text5</td> 
        <td>Text6</td> 
    </tr>
</table>

其中`<th>`表示标题、`<td>`表示内容。

## 对齐方法

可以设置`align`来自定义对齐：
{% codeblock lang:html %}
<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="left">Column 1</th> 
        <th align="center">Column 2</th> 
        <th align="right">Column 3</th> 
    </tr>
    <tr>
  		<td align="left">Text1</td> 
        <td align="center">Text2</td> 
        <td align="right">Text3</td> 
    </tr>
    <tr>
        <td align="left">Text4</td> 
        <td align="center">Text5</td> 
        <td align="right">Text6</td> 
    </tr>
</table>
{% endcodeblock %}  

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="left">Column 1</th> 
        <th align="center">Column 2</th> 
        <th align="right">Column 3</th> 
    </tr>
    <tr>
  		<td align="left">Text1</td> 
        <td align="center">Text2</td> 
        <td align="right">Text3</td> 
    </tr>
    <tr>
        <td align="left">Text4</td> 
        <td align="center">Text5</td> 
        <td align="right">Text6</td> 
    </tr>
</table>

## 复杂符号绘制

在html中，需要通过：
```
$具体Latex语句$
``` 
插入复杂符号。

```
<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="center">$a_{j}$</th> 
        <th align="center">$x^{n}$</th> 
        <th align="center">$\sigma$</th> 
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td align="center">Text2</td> 
        <td align="center">Text3</td> 
    </tr>
    <tr>
        <td align="center">Text4</td> 
        <td align="center">Text5</td> 
        <td align="center">Text6</td> 
    </tr>
</table>
``` 
<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="center">$a_{j}$</th> 
        <th align="center">$x^{n}$</th> 
        <th align="center">$\sigma$</th> 
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td align="center">Text2</td> 
        <td align="center">Text3</td> 
    </tr>
    <tr>
        <td align="center">Text4</td> 
        <td align="center">Text5</td> 
        <td align="center">Text6</td> 
    </tr>
</table>


## 合并单元格

### 合并行

可以通过`colspan`实现行的合并。

{% codeblock lang:html %}

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th colspan="2" align="center">Column 1</th> 
        <th align="center">Column 2</th> 
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td align="center">Text2</td> 
        <td align="center">Text3</td> 
    </tr>
    <tr>
        <td align="center">Text4</td> 
        <td align="center">Text5</td> 
        <td align="center">Text6</td> 
    </tr>
</table>

{% endcodeblock %}  

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th colspan="2" align="center">Column 1</th> 
        <th align="center">Column 2</th> 
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td align="center">Text2</td> 
        <td align="center">Text3</td> 
    </tr>
    <tr>
        <td align="center">Text4</td> 
        <td align="center">Text5</td> 
        <td align="center">Text6</td> 
    </tr>
</table>

这样一来，第一行前两列就成功合并了，以此类推如果想要合并前三列，把`colspan="2"`改成`colspan="3"`就可以实现。

### 合并列

可以通过`rowspan`实现行的合并。

{% codeblock lang:html %}

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="center">Column 1</th> 
        <th align="center">Column 2</th> 
		<th align="center">Column 3</th>
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td align="center">Text2</td> 
        <td rowspan="2" align="center">Text3</td> 
    </tr>
    <tr>
        <td align="center">Text4</td> 
        <td align="center">Text5</td>
    </tr>
</table>


{% endcodeblock %}  

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="center">Column 1</th> 
        <th align="center">Column 2</th> 
		<th align="center">Column 3</th>
   	</tr>
    <tr>
  		<td align="center">Text1</td> 
        <td align="center">Text2</td> 
        <td rowspan="2" align="center">Text3</td> 
    </tr>
    <tr>
        <td align="center">Text4</td> 
        <td align="center">Text5</td>
    </tr>
</table>




这样一来，第三列后两列就成功合并了，以此类推如果想要合并更多三列，把`colspan="2"`的`2`改成其他数字就可以实现。

不过要注意的是，合并列以后，上面的行会占用下面的行，也就是说下面的行要减少相应的列。比如上述例子中，第二行的第三列的`rowspan`设置为2（列数跨度为2），那么也就是说，这个格子会占用第三行的一列，所以第三行应该少设置一列。

## 同时合并行和列

同时使用`colspan`和`rowspan`可以实现同时合并行和列
{% codeblock lang:html %}

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="center">Column 1</th> 
        <th align="center">Column 2</th> 
		<th align="center">Column 3</th>
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td colspan="2" rowspan="2" align="center">Text2</td> 
    </tr>
    <tr>
        <td align="center">Text3</td> 
    </tr>
</table>


{% endcodeblock %}  

<table border="1" width="600px" cellspacing="10">
    <tr>
        <th align="center">Column 1</th> 
        <th align="center">Column 2</th> 
		<th align="center">Column 3</th>
    </tr>
    <tr>
  		<td align="center">Text1</td> 
        <td colspan="2" rowspan="2" align="center">Text2</td> 
    </tr>
    <tr>
        <td align="center">Text3</td> 
    </tr>
</table>
