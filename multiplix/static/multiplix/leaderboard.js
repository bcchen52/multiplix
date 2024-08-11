document.addEventListener('DOMContentLoaded', function() {
    //navbar
    document.querySelector("#leaderboard").classList.add('nav-link-active');

    document.querySelector("#page-button-container").style.visibility="hidden";
    load_leaderboard('overall', 1, "new-leaderboard");

    document.querySelectorAll('.leaderboard-button').forEach((button) => {
        button.onclick = () => {
            load_leaderboard(button.id, 1, "new-leaderboard");
        }
    });
});

//making things opaque and then changing it after animation makes it much smoother
function load_leaderboard(leaderboard, page, call_type){
    hide_current_button(leaderboard);
    if (call_type === "new-leaderboard"){
        document.querySelector('#leaderboard-title').style.opacity=0;
        document.querySelector('#leaderboard-title').animate([{opacity: "0", right: "15%"},{right : '0%', opacity:'1'}],{duration:200,})
        document.querySelector('#leaderboard-title').style.opacity=1;
    }
    fetch(`/leaderboard/${leaderboard}/${page}`)
    .then( response => response.json())
    .then( result => {
        const container = document.querySelector("#leaderboard-container");
        container.innerHTML = "";

        document.querySelector('h1').innerHTML = result.display_name;
        document.querySelector('title').innerHTML = result.display_name;

        var promise = Promise.resolve();

        if (result.leaderboard.length == 0){
            container.innerHTML = "Wow so empty";
            document.querySelector("#page-button-container").style.visibility="hidden";
        } else {
            result.leaderboard.forEach((test_info)=>{
                const test = document.createElement('div');
                test.setAttribute("class", "row justify-content-around leaderboard-entry");
                const user = document.createElement('div');
                const qpm = document.createElement('div');
                const place = document.createElement('div');
                place.setAttribute("class", "col-2 text-center place-sign");
                user.setAttribute("class", "col-2 text-center my-auto");
                qpm.setAttribute("class", "col-2 text-center my-auto");
                user.innerHTML = test_info.name;
                qpm.innerHTML = test_info.qpm;
                place.innerHTML = test_info.place;
    
                test.appendChild(user);
                test.appendChild(place);
                test.appendChild(qpm);

                test.onclick = () => {
                    window.location.href = `profile/${test_info.name}`;
                }
                container.appendChild(test);

                test.style.opacity = 0;
            });


            document.querySelectorAll('.leaderboard-entry').forEach((test) => {
                promise = promise.then(function () {
                    if (!isNaN(call_type)){
                        if (page > call_type){
                            //if going to the right, load from the right
                            test.animate([{opacity: "0", left: "20%"},{left : '0%', opacity:'1'}],{duration:100});
                        } else {
                            test.animate([{opacity: "0", right: "20%"},{right : '0%', opacity:'1'}],{duration:100});
                        }
                    } else {
                        //if loading the page, load downward
                        test.animate([{opacity: "0"},{opacity:'1'}],{duration:100});
                    }                    
                    test.style.opacity = 1;
                    return new Promise(function (resolve) {
                            setTimeout(resolve, 200);
                    });
                });
            });

            //fill up container with empty
            for (let x=0; x < (5-result.leaderboard.length); x++){
                const test = document.createElement('div');
                test.setAttribute("class", "row justify-content-around leaderboard-entry leaderboard-entry-empty");
                const place = document.createElement('div');
                place.setAttribute("class", "col-2 text-center place-sign");
                place.innerHTML = "None";
                test.appendChild(place);
                container.appendChild(test);
            }

            document.querySelector("#page-button-container").style.visiblity="visible";

            document.querySelector("#current").innerHTML = page;
            document.querySelector('#current').style.visibility = "visible"

            for (page_button in result.page_info){
                const button = document.querySelector(`#${page_button}`);
                button.style.visibility = "hidden";
                //console.log(eval(`result.page_info.${page_button}`));
                if (eval(`result.page_info.${page_button}`)){
                    button.style.visibility = "visible";
                    button.innerHTML = eval(`result.page_info.${page_button}`);
                }
            }

            //only animate here if its the first page, if not, then it will animate by itself
            document.querySelectorAll('.page-button-clickable').forEach((button) => {    
                button.onclick = () => {
                    animate_page_buttons(button.id);
                    load_leaderboard(leaderboard, button.innerHTML, page);
                }
            });

            if (isNaN(call_type)){
                animate_page_buttons("default");
            }
        }
    });
}

function animate_page_buttons(direction){
    var promise = Promise.resolve();
    let buttons = document.querySelectorAll('.page-button');
    if (direction === "prev" || direction === "bwd"){
        buttons = [...buttons];
        buttons = buttons.reverse();
    }

    buttons.forEach((button) => {
        button.style.opacity=0;
    });
    buttons.forEach((button) => {
        let opacity = 1;
        if (button.classList.contains("page-button-mute")){
            opacity = 0.6;
        }
        promise = promise.then(function () {
            if (direction === "next" || direction === "fwd"){
                button.animate([{left: '20px', opacity:'0'},{left : '0%', opacity:opacity}],{duration:200});
            } else if (direction === "prev" || direction === "bwd") {
                button.animate([{right: '20px', opacity:'0'},{right : '0%', opacity:opacity}],{duration:200})
            } else if (direction === "default"){
                button.animate([{opacity:'0'},{opacity:opacity}],{duration:200});
            }
            button.style.opacity=opacity;     
            return new Promise(function (resolve) {
                setTimeout(resolve, 100);
            });
        });
    });
}

function hide_current_button(leaderboard){
    document.querySelectorAll('.leaderboard-button').forEach((button) => {
        if (button.id === leaderboard){
            button.classList.add("leaderboard-button-active");
        } else {
            button.classList.remove("leaderboard-button-active");
        }
    });
}