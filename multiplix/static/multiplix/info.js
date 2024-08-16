document.addEventListener('DOMContentLoaded', function() {
    //navbar
    document.querySelector("#info").classList.add('nav-link-active');

    resize_title();
});

function resize_title(){
    const title = document.querySelector('.title'); 
    const screen_width = window.innerWidth;
   
    console.log(screen_width);
    console.log(title.getBoundingClientRect().width);
    if (title.getBoundingClientRect().width > 0.8 * screen_width){
        console.log(Math.floor(((0.8 * screen_width) / (title.getBoundingClientRect().width)) * 100));
        title.style.fontSize = `${Math.floor(((0.8 * screen_width) / (title.getBoundingClientRect().width)) * 100)}px`;
    }
}