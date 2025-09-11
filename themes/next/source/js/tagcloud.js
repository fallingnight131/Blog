function initTagCanvas() {
    try {
        TagCanvas.Start('my3DTags', 'tags', {
            textFont: 'Georgia,Optima',
            textColour: null,
            outlineColour: 'black',
            weight: true,
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05,
            bgRadius: 1,
            freezeDecel: true
        });
    } catch (e) {
        const myTags = document.getElementById('myTags');
        if (myTags) myTags.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', initTagCanvas);
document.addEventListener('pjax:complete', initTagCanvas);
document.addEventListener('pjax:end', initTagCanvas);
