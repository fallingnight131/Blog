'use strict';  
  
hexo.extend.tag.register('quot', (args) => {  
    let icon = args[0];  
    let content = args.slice(1).join(' ');  
    return `<div class="quot ${icon}"><p>${content.trim()}</p></div>`;  
})
