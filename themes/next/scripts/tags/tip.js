'use strict';  
  
function render(data) {  
    return hexo.render.renderSync({ text: data, engine: 'markdown' });  
}  
  
hexo.extend.tag.register('tip', (args) => {  
    let theme = args[0];  
    let content = args.slice(1).join(' ');  
    return `<div class="tip ${theme}"><i class="i-adm i-${theme} icon"></i><div class="p">${render(content.trim())}</div></div>`;  
});
