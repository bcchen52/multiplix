document.addEventListener('DOMContentLoaded', function() {
    //navbar
    document.querySelector("#faq").classList.add('nav-link-active');

    resize_title();

    document.querySelectorAll('.faq-item').forEach((item) => {
        item.onclick = () => {
            click_faq(item.id);
        }
    })
});

function resize_title(){
    const title = document.querySelector('.faq-title'); 
    const screen_width = window.innerWidth;
   
    console.log(screen_width);
    console.log(title.getBoundingClientRect().width);
    if (title.getBoundingClientRect().width > 0.8 * screen_width){
        //console.log(Math.floor(((0.8 * screen_width) / (title.getBoundingClientRect().width)) * 50));
        title.style.fontSize = `${Math.floor(((0.8 * screen_width) / (title.getBoundingClientRect().width)) * 50)}px`;
    }
}

function click_faq(id){
    document.querySelectorAll(".faq-content").forEach((content) => {
        if (content.id.includes(id)){
            if (getComputedStyle(content).display == "none"){
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        } else {
            content.style.display = "none";
        }
    })
}