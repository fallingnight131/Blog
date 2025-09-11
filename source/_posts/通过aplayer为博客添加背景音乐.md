---
title: 通过aplayer为Arknights主题博客添加背景音乐
date: 2024-10-11 03:18:08
category: 心得分享
tags:
- hexo
- aplayer
- html
- BGM
post-info: true
---
# 安装aplayer
{% codeblock %}
npm install aplayer --save
{% endcodeblock %}
直接在博客根目录输入命令即可
随后在_config.yml文件最底部加上
{% codeblock %}
aplayer:
  preload: 'metadata'
  theme: '#e6d0b2'
  autoplay: true
  loop: 'all'
{% endcodeblock %}
<!-- more -->

# 数据准备
想要用aplayer在博客放音乐，需要三种文件：
1. mp3文件(音频)
2. jpg/png文件(音乐封面)
3. lrc文件(歌词)

将准备好的文件放在如下位置
{% codeblock %}
your-blog/
├── source/
│   ├── assets/
│   │   ├── music/
│   │   │   └── yourmusic.mp3
│   │   ├── images/
│   │   │   └── yourmusic.jpg
│   │   └── lrc/
│   │       └── yourmusic.lrc
├── themes/
│   └── your-theme/
│       └── layout/
│           └── layout.pug
├── _config.yml
└── ...
{% endcodeblock %}
在source下创建相应的文件夹，并将文件放入。

# 在某篇文章添加音乐

```markdown
{% aplayerlist %}
{
    "autoplay": true,
    "showlrc": 0,
    "mutex": true,
    "music": [
        {
            "title": "music name",
            "author": "author name",
            "url": "/assets/music/music.mp3",
            "pic": "/assets/images/music.jpg",
            "lrc": "/assets/lrc/music.lrc"
        }
    ]
}
{% endaplayerlist %}
```

直接在想加音乐的文章中加入上述代码
就会得到下面的效果（没有的话就刷新一下页面）：
{% aplayerlist %}
{
    "autoplay": false,
    "showlrc": 0,
    "mutex": true,
    "music": [
        {
            "title": "ALLU",
            "author": "泽野弘之",
            "url": "https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/audio/ALLU.mp3",
            "pic": "https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308032711151.png"
        }
    ]
}
{% endaplayerlist %}
文章中多了一个音乐播放器，于是音乐添加成功了。

如果不想占用本地空间，url、pic、lrc后面也可以换成网址，像这样：
```markdown
{% aplayerlist %}
{
    "autoplay": true,
    "showlrc": 0,
    "mutex": true,
    "music": [
        {
            "title": "music name",
            "author": "author name",
            "url": "https://...",
            "pic": "https://...",
            "lrc": "https://..."
        }
    ]
}
{% endaplayerlist %}
```

这个三个网址是外部连接，可以通过将文件上传到[七牛云](https://www.qiniu.com/)的云存储空间以后生成。
当然，如果觉得麻烦，也可以直接上传到github仓库。

# 在Arknights主题中增加可自由关闭的全局背景音乐
上面的方法是将音乐播放器添加在文章中，而现在我们要实现的是博客的全局背景音乐，笔者用的主题是Arknights主题，本身并没有提供aplayer的接口，所以我在界面中自己加了一个按钮来控制背景音乐的开关。接下来是具体步骤：
## 找到layout.pug文件
文件位置如下：
{% codeblock %}
your-blog/
├── source/
│   ├── assets/
│   │   ├── music/
│   │   │   └── yourmusic.mp3
│   │   ├── images/
│   │   │   └── yourmusic.jpg
│   │   └── lrc/
│   │       └── yourmusic.lrc
├── themes/
│   └── arknights/
│       └── layout/
│         └── includes/
│           └── layout.pug
├── _config.yml
└── ...
{% endcodeblock %}

## 修改layout.pug文件
直接把文件修改替换成如下：
{% codeblock lang:html %}
-
  let pageTitle = page.title || config.subtitle || ''
  if (is_post()) pageTitle = page.title
  if (is_archive()) pageTitle = __('menu.archive.plural')
  if (is_tag()) pageTitle = __('menu.tag.plural') + ': ' + page.tag
  if (is_category()) pageTitle = __('menu.category.plural') + ': ' + page.category
  if (is_month()) pageTitle += ': ' + page.month + '/' + page.year
  if (is_year()) pageTitle += ': ' + page.year
  if (pageTitle) pageTitle += ' | '
  pageTitle += config.title
  const asideLogo = theme.aside.logo
  const pjax = theme.pjax ? theme.pjax.enable : false
  let searchConfig = null
  if (theme.search !== undefined && theme.search.enable === true) searchConfig = theme.search;
  const configs = JSON.stringify({
    root: config.root,
    search: {
      preload: searchConfig.preload,
      activeHolder: __('search.activeHolder'),
      blurHolder: __('search.blurHolder'),
      noResult: __('search.noResult')
    },
    code: {
      codeInfo: __('code.codeInfo'),
      copy: __('code.copy')
    }
  })

doctype html
html(lang=config.language theme-mode=theme.color)
  head
    include ./meta-data.pug
    link(rel="stylesheet", href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css")
    style.
      #music-control {
        position: absolute; /* 使用绝对定位 */
        bottom: 10px; /* 距离底部 10 像素 */
        left: 30px; /* 距离左侧 30 像素 */
        padding: 10px 20px;
        font-size: 16px;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        border: 0.5px solid white;
        border-radius: 0px;
        cursor: pointer;
        display: flex; /* 使用 flex 布局 */
        align-items: center; /* 垂直居中 */
        transition: background-color 0.3s ease, color 0.3s ease; /* 添加过渡效果 */
      }
      #music-control:hover {
        background-color: rgba(90, 90, 90, 0.5);
        color: #26a5e0;
      }
  body
    if pjax
      .loading(style="opacity: 0;")
        .loadingBar.left
        .loadingBar.right
    main
      include ./header.pug
      // 在这里添加控制按钮
      button#music-control(type="button") 背景音乐-♪
      article
        if body
          div!= body
        else
          block content
        include ./bottom-btn.pug
      include ./aside.pug
    if theme.canvas_dust
      canvas#canvas-dust
    // 在这里添加 APlayer 播放器并隐藏它
    #aplayer(style="display: none;")
    script(src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js")
    script.
      document.addEventListener('DOMContentLoaded', function () {
        const ap = new APlayer({
          container: document.getElementById('aplayer'),
          autoplay: true,
          loop: 'all',
          preload: 'metadata',
          theme: '#e6d0b2',
          audio: [
            {
              name: 'lifestream',
              artist: 'arknights',
              url: '/assets/music/lifestream(machine).mp3',
              cover: '/assets/images/lifestream.jpg',
              lrc: '/assets/lrc/lifestream.lrc'
            }
          ]
        });

        // 控制按钮的事件监听器
        const controlButton = document.getElementById('music-control');
        controlButton.addEventListener('click', function () {
          if (ap.audio.paused) {
            ap.play();
          } else {
            ap.pause();
          }
        });
      });
{% endcodeblock %}

修改完以后再通过
{% codeblock lang:bash %}
hexo clean
{% endcodeblock %}
{% codeblock lang:bash %}
hexo g
{% endcodeblock %}
{% codeblock lang:bash %}
hexo s
{% endcodeblock %}
重新构建博客，打开网页以后，界面的左下角始终有一个新的按钮，点击就能自由开关背景音乐。
![](https://fallingnight131.oss-cn-shanghai.aliyuncs.com/blog/image/20250308032425725.png)


