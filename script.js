window.addEventListener('load', () => {
    const textHeight = document.querySelector('.desc').clientHeight;
    const text2 = document.querySelector('.button')
    text2.style.top = `calc(46% + ${textHeight}px)`;
});