document.addEventListener('DOMContentLoaded', function() {
    var load_in_position = document.querySelector(".body").getBoundingClientRect().bottom + window.scrollY;
    
    if (window.innerHeight > load_in_position) {
        load_in_position = window.innerHeight;
    }

    document.querySelector("footer").style.top = `${load_in_position}px`;
    document.querySelector("footer").style.opacity = 1;
    //when the page is loaded, put the footer at the bottom just outside of view
    //when the window is larger than when first loaded, the footer sticks to the bottom.
    //and when minimized the footer snaps back to its position when it was first loaded

    //console.log(document.querySelector("footer").getBoundingClientRect().top);

    window.addEventListener("resize", () => {
        position_footer(load_in_position);
    });
});

function position_footer(load_in_position){
    const footer = document.querySelector("footer");
    const footer_info = footer.getBoundingClientRect();
    const body = document.querySelector(".body").getBoundingClientRect();
    if (footer_info.top < body.bottom) {
        location.reload();
    } else {
        if (load_in_position + footer_info.height < window.innerHeight){
            footer.style.top = `${window.innerHeight - footer_info.height}px`;
        } else {
            footer.style.top = load_in_position;
        }
    }
}

