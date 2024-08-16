document.addEventListener('DOMContentLoaded', function() {
    //navbar
    console.log(document.querySelector("#is_user").value);
    if (document.querySelector("#profile") != null && document.querySelector("#is_user").value === "True"){
        document.querySelector("#profile").classList.add('nav-link-active');
    }

    get_achievements();
    resize_user();
});

function resize_user(){
    const username = document.querySelector('.username'); 
    const screen_width = window.innerWidth;
   
    console.log(screen_width);
    if (username.getBoundingClientRect().width > 0.8 * screen_width){
        console.log(Math.floor(((0.8 * screen_width) / (username.getBoundingClientRect().width)) * 50));
        username.style.fontSize = `${Math.floor(((0.8 * screen_width) / (username.getBoundingClientRect().width)) * 50)}px`;
    }
}

function get_achievements(){
    const level_icons = {
        1 : "fire",
        2 : "dragon",
        3 : "dragon",
    }
    const placement_messages = {
        "place_overall" : "Top 100 QPM Leaderboard",
        "place_30" : "Top 50 QPM for 30s Leaderboard",
        "place_60" : "Top 50 QPM for 60s Leaderboard",
        "place_120" : "Top 50 QPM for 120s Leaderboard",
        "place_180" : "Top 50 QPM for 180s Leaderboard",
    }
    const achievements = document.querySelector('.achievements');
    fetch(`/profile_info/${document.querySelector('#username').value}`)
    .then( response => response.json())
    .then( result => {
        var values = Object.entries(result);
        console.log(values);
        values.forEach((value) => {
            if (value[0] === 'level'){
                if (value[1] > 0) {
                    const username = document.querySelector('.username');
                    const level_icon = document.createElement('span');
                    level_icon.setAttribute('class', `level-icon level-${value[1]}-icon`);
                    level_icon.innerHTML = `<i class="fa-solid fa-${level_icons[value[1]]}"></i>`;
                    username.insertBefore(level_icon, username.firstChild);
                }
            } else {
                if (value[1]){
                    console.log(value[0]);
                    const trophy_icon = document.createElement('span');
                    trophy_icon.setAttribute('class', 'trophy-icon');
                    trophy_icon.setAttribute('id', '${value[0]}');
                    trophy_icon.innerHTML = `<i class="fa-solid fa-trophy"></i>`;
                    trophy_icon.onclick = () => {
                        if (document.querySelector('.achievements-message').innerHTML != "" && document.querySelector('.achievements-message').innerHTML == placement_messages[value[0]]){
                            change_achievements_message("");
                        } else {
                            change_achievements_message(placement_messages[value[0]]);
                        }
                    }
                    achievements.appendChild(trophy_icon);
                }
            }
        });
    });
}

function change_achievements_message(message){
    const achievements_message = document.querySelector('.achievements-message');
    achievements_message.innerHTML = message;
}