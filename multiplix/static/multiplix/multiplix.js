//
//setTimeout(function, milliseconds)
document.addEventListener('DOMContentLoaded', function() {
    make_home();
    //start test, only works if test hasn't been started, which is indicated if incrementer is null
    document.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            console.log('enter clicked');
            if (incrementer == null) {
                console.log("test started");
                valid_settings();
                test();
            }
    }});
    //load homescreen and exit test
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            console.log("back to home");
            home();
    }});

    //test setting constraints
 
    //either addition or multiplication need to be selected
    document.querySelectorAll('.form-check-input').forEach((operation_switch) => {
        operation_switch.onclick = () => {
            if (!sign_clicked()) {
                operation_switch.checked = true;
                //put some error message
            }
        }
    });
});

var incrementer = null;
//this is the counter

const Count = function _Count() {
    return _Count.state.count;
};

const setState = (callback) => {
    callback();
    updateCounter(); // extracted function
}


Count.state = {
    test_id: 0,
    count: 10,
    increment: () => {
        if (Count.state.count > 0) {
            setState(() => Count.state.count--);
            console.log(Count.state.count);
        } else {
            console.log('hi');
            clearInterval(incrementer);
            results();
        }
    },
    reset: (num) => {
        setState(() =>  Count.state.count = num);
    }
};

const updateCounter = () => {
    document.querySelector("#counter").innerHTML = Count();
};

function make_home() {
    incrementer = null;
    const home = document.querySelector("#home");
    home.style.display = 'block';
    const test = document.querySelector("#test");
    test.style.display = 'none';
    const result = document.querySelector("#results");
    result.style.display = 'none';
    

    const settings = document.createElement('div');
    settings.setAttribute('id', 'settings');
    settings.setAttribute('class', 'row justify-content-center');
    
    const addition_boolean = document.createElement('div');

    //home.appendChild(home_wrapper);

    //when one is selected, deselect all others
}

function results() {
    incrementer = null;
    const home = document.querySelector("#home");
    home.style.display = 'none';
    const test = document.querySelector("#test");
    test.style.display = 'none';
    const result = document.querySelector("#results");
    result.style.display = 'block';
    
    console.log(incrementer == null);
    console.log('test ended');
}


function test() {
    const home = document.querySelector("#home");
    home.style.display = 'none';
    const test = document.querySelector("#test");
    test.style.display = 'block';
    const result = document.querySelector("#results");
    result.style.display = 'none';

    console.log(document.querySelector('#mult_max_1').value);
    //get all settings

    //only create a test object for bookkeeping purposes if user is logged in
    fetch(`/test`, {
        method: 'POST',
        body: JSON.stringify({
            time: get_time(),
            add_min_1: document.querySelector('#add_min_1').value,
            add_max_1: document.querySelector('#add_max_1').value,
            add_min_2: document.querySelector('#add_min_2').value,
            add_max_2: document.querySelector('#add_max_2').value,
            mult_min_1: document.querySelector('#mult_min_1').value,
            mult_max_1: document.querySelector('#mult_max_1').value,
            mult_min_2: document.querySelector('#mult_min_2').value,
            mult_max_2: document.querySelector('#mult_max_2').value,
            add: sign_clicked('add'),
            mult: sign_clicked('mult'),
        })
      })
    .then( response => response.json())
    .then( result => {
        console.log(result);
        //test id, set count to that
    });

    //question and result

    Count.state.reset(2);

    setTimeout(() => {
        if (incrementer != null) {
            console.log(Count.state.count);
        }
    }, 2*1000)

    if (incrementer == null) {
        incrementer = setInterval(Count.state.increment, 1000); 
    }

    //increment
}

function home() {
    const home = document.querySelector("#home");
    home.style.display = 'block';
    const test = document.querySelector("#test");
    test.style.display = 'none';
    const result = document.querySelector("#results");
    result.style.display = 'none';

    clearInterval(incrementer);
    incrementer = null;
    console.log("incrementer emptied");

}

function get_time(){
    document.querySelectorAll('.time-options').forEach((option)=> {
        if (option.checked){
            //console.log(option.value);
            return (option.value);
        }
    });
}

//check if addition or multiplication are on, or if either is on
function sign_clicked(sign) {
    let add_clicked=false;
    let mult_clicked=false;
    document.querySelectorAll('.form-check-input').forEach((option)=> {
        if (option.checked){
            if (option.id == 'addition-switch') {
                add_clicked=true;
            } else {
                mult_clicked=true;
            }
        }
    });
    if (sign=='add') {
        return add_clicked;
    } else if (sign=='mult') {
        return mult_clicked;
    } else {
        return add_clicked || mult_clicked;
    }

}

function valid_settings(){

}