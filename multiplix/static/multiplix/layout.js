document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);

    const footer = document.querySelector("footer");
    const body = document.querySelector(".body");
    var load_in_position = body.getBoundingClientRect().bottom;
    
    if (window.innerHeight > load_in_position) {
        load_in_position = window.innerHeight;
    }

    position_footer.state.set_position(load_in_position);
    footer.style.opacity = 1;
    //when the page is loaded, put the footer at the bottom just outside of view
    //when the window is larger than when first loaded, the footer sticks to the bottom.
    //and when minimized the footer snaps back to its position when it was first loaded

    window.addEventListener("resize", () => {
        position_footer();
    });

    //this is for the settings page, as the results can be a lot bigger than the rest of the page especially on smaller screens
    if (document.querySelector('#answer') != null){
        document.querySelector('#answer').addEventListener("blur", () => {
           position_footer();
        });
    }
});

function position_footer(){
    const footer = document.querySelector("footer");
    const footer_info = footer.getBoundingClientRect();
    const body = document.querySelector(".body").getBoundingClientRect();
    if (footer_info.top < body.bottom) {
        //change the position
        position_footer.state.set_position(body.bottom);
    } else {
        if (position_footer.state.position + footer_info.height < window.innerHeight){
            footer.style.top = `${window.innerHeight - footer_info.height}px`;
        } else {
            footer.style.top = `${position_footer.state.position}px`;
        }
    }
}

position_footer.state = {
    position: 0,
    set_position: (num) => {
        position_footer.state.position = num;
        document.querySelector("footer").style.top = `${num}px`;
    }
}

