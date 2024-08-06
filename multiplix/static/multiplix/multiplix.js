document.addEventListener('DOMContentLoaded', function() {
    home();
    //start test, only works if test hasn't been started, which is indicated if incrementer is null
    document.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            console.log('enter clicked');
            if (incrementer == null) {
                console.log("test started");
                make_test();
            }
    }});
    //load homescreen and exit test
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            console.log("back to home");
            home();
    }});
 
    //either addition or multiplication need to be selected
    document.querySelectorAll('.form-check-input').forEach((operation_switch) => {
        operation_switch.onclick = () => {
            if (!sign_clicked()) {
                //If clicking that switch would turn both addition and multiplication off, undo it
                operation_switch.checked = true;
            } else {
                //If a click did happen
                let operation = "mult";
                let disabled = true;
                if (operation_switch.id == "addition-switch") {
                    operation = "add";
                }
                if (sign_clicked(operation)){
                    document.querySelectorAll(`.${operation}-input`).forEach((input)=>{
                        input.disabled = false;
                        console.log("undisabled");
                    });
                } else {
                    document.querySelectorAll(`.${operation}-input`).forEach((input)=>{
                        input.disabled = true;
                        console.log("disabled");
                    });
                }
            }
        }
    });

    //default button
});

//TODO list
//if default(add to Test.state)
//calculate adjusted score
//if user...
//leaderboard

//default settings 
const default_settings = [true, 12, 99, 5, 12, true, 12, 99, 5, 12];

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
            console.log(Count.state.test_id);
            clearInterval(incrementer);
            results();
        }
    },
    reset: (num) => {
        setState(() =>  Count.state.count = num);
    },
    new_test: (id) => {
        Count.state.test_id = id;
    },
};

const updateCounter = () => {
    document.querySelector("#counter").innerHTML = Count();
};

var finish_test = null;

const Test = () => {

};

Test.state = {
    test_id: 0,
    score: 0,
    specifications: [], 
    time: 0,
    timestamps: [],
    reset_test: (id, specifications, time) => {
        Test.state.test_id = id;
        Test.state.score = 0;
        Test.state.time = time;
        Test.state.specifications = specifications;
    },
    correct: () => {
        Test.state.score++;
    }
}

//kill this function?
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
    
    //console.log(incrementer == null);
    console.log(`The score is ${Test.state.score}`);

    const score = document.querySelector('#display-score');
    score.innerHTML = Test.state.score;
    const qpm = document.querySelector('#qpm');
    qpm.innerHTML = Test.state.score / ((Test.state.time)/60);

}


function make_test() {
    //hide message block within the test container, reactived if incorrect settings

    const time = get_time();
    
    //run validate settings
    let settings_info = validate_settings();
    const settings = settings_info[1];
    console.log(settings_info[2]);

    const error = document.querySelector("#settings-error");
    error.style.display = 'none';

    if (settings_info[0]) {
        //hide error message
        const home = document.querySelector("#home");
        home.style.display = 'none';
        const test = document.querySelector("#test");
        test.style.display = 'block';
        const result = document.querySelector("#results");
        result.style.display = 'none';

        //save settings in test() function, send to test

        //after test completed, complete the test
        fetch(`/test`, {
            method: 'POST',
            body: JSON.stringify({
                time: time,
                add: settings[0],
                mult: settings[5],
                is_default: is_default(settings),
            })
        })
        .then( response => response.json())
        .then( result => {
            console.log(document.querySelector('#add_min_1').value);
            console.log(result.test_id);
            //test id, set count to that
            Count.state.new_test(result.test_id);
            Test.state.reset_test(result.test_id, settings, time);
            console.log(Test.state.specifications);
            generate_question();
        });

        //console.log(test_id);

        document.querySelector("#answer").focus();

        //question and result
        //Create question + result
        //If enter box == result...
        //Question.state
        //question() generate question, put it and result into state
        //result() Give the input box the function based off question.state 

        //set time
        Count.state.reset(5);


        //idt i need this
        if (!finish_test){
            finish_test = setTimeout(() => {
                console.log("done");
            }, 3*1000)
        }

        clearTimeout(finish_test);
        finish_test = null;

        //console.log(timeoutId);

        if (incrementer == null) {
            incrementer = setInterval(Count.state.increment, 1000); 
        }

        //increment
    } else {
        console.log('no test');
        error.innerHTML = settings_info[2];
        error.style.display = 'block';
    }
}

function home() {
    const home = document.querySelector("#home");
    home.style.display = 'block';
    const test = document.querySelector("#test");
    test.style.display = 'none';
    const result = document.querySelector("#results");
    result.style.display = 'none';
    const error = document.querySelector("#settings-error");
    error.style.display = 'none';

    clearInterval(incrementer);
    incrementer = null;
    console.log("incrementer emptied");

}

function generate_question(){
    // if add, make add, if mult, add mult
    let add = Test.state.specifications.slice(0,5);
    let mult = Test.state.specifications.slice(5,10);
    let term1 = 0;
    let term2 = 0;
    let sign = 'None'
    if (add[0]) {
        console.log('add true');
        term1 = random_num(add[1], add[2]);
        term2 = random_num(add[3], add[4]);
        if (mult[0]){
            console.log(mult[0]);
            //if both
            if (Math.random() < 0.5) {
                //mult
                term1 = random_num(mult[1], mult[2]);
                term2 = random_num(mult[3], mult[4]);
                if (Math.random < 0.5) {
                    //mult
                    sign = "multiplication";
                } else {
                    sign = "division";
                }
            } else {
                //addition
                if (Math.random() < 0.5) {
                    //addition
                    sign = "addition";
                } else {
                    //subtraction
                    sign = "subtraction";
                }
            }
        } else {
            if (Math.random() < 0.5) {
                //addition
                sign = "addition";
            } else {
                sign = "subtraction";
            }
        }
    } else {
        console.log(mult[0]);
        term1 = random_num(mult[1], mult[2]);
        term2 = random_num(mult[3], mult[4]);
        if (Math.random() < 0.5) {
            //mult
            sign = "multiplication";
        } else {
            sign = "division";
        }
    }

    console.log(sign);

    equation = make_equation((term1), (term2), sign);

    //equation[0] is the question, equation[1] is the result
    console.log(`${equation[0]} = ${equation[1]}`);

    //set the state
    //display_question();

    display_question(equation[0], equation[1]);
}

function random_num(a, b){
    //a is min, b is max
    //let num = (Math.floor(Math.random() * (b - a + 1)));
    return Number(Math.floor(Math.random() * (b - a + 1))) + Number(a);
}

//given two terms, a(smaller) and b(larger)
function make_equation(a, b, eq_type){
    let equation = "";
    let result = 0;
    let term1 = 0;
    let term2 = 0;
    let sign = "*";
    if (eq_type === 'division'){
        let term3 = a * b;
        term1 = term3;
        if (Math.random() < 0.5){
            result = a;
            term2 = b;
        } else {
            result = b;
            term2 = a;
        }
        sign = "/";
    } else if (eq_type === 'addition'){
        result = a + b;
        term1 = a;
        term2 = b;
        sign = "+";
    } else if (eq_type === 'subtraction'){
        let term3 = a + b;
        term1 = term3;
        if (Math.random() < 0.5){
            result = a;
            term2 = b;
        } else {
            result = b;
            term2 = a;
        }
        sign = "-";
    } else {
        result = a * b;
        term1 = a;
        term1 = b;
    }
    console.log(`${a} + ${b}`);
    equation = `${term1} ${sign} ${term2}`;
    return [equation, result];
}


function display_question(equation, result){
    //console.log(display_question.caller);

    const question = document.querySelector('#question');
    //console.log(question);
    question.innerHTML = equation;

    const score = document.querySelector('#score');
    score.innerHTML = Test.state.score;

    const input = document.querySelector('#answer');

    document.oninput = () => {
        //console.log(input.value);
        if ((input.value) == result){     
            input.value = "";
            Test.state.correct();
            console.log(Count.state.count);
            generate_question();
        }
    }
    //generate_question();
}

function get_time(){
    let time = 120;
    document.querySelectorAll('.time-options').forEach((option)=> {
        if (option.checked){
            console.log(option.value);
            time = option.value;
        }
    });
    return time;
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

function validate_settings(){
    var is_valid = true;
    var error_message = "None";

    //get all settings
    const add_min_1 = Math.floor(Number(document.querySelector('#add_min_1').value));
    const add_max_1 = Math.floor(Number(document.querySelector('#add_max_1').value));
    const add_min_2 = Math.floor(Number(document.querySelector('#add_min_2').value));
    const add_max_2 = Math.floor(Number(document.querySelector('#add_max_2').value));
    const mult_min_1 = Math.floor(Number(document.querySelector('#mult_min_1').value));
    const mult_max_1 = Math.floor(Number(document.querySelector('#mult_max_1').value));
    const mult_min_2 = Math.floor(Number(document.querySelector('#mult_min_2').value));
    const mult_max_2 = Math.floor(Number(document.querySelector('#mult_max_2').value));
    const add = sign_clicked('add');
    const mult = sign_clicked('mult');

    const settings = [add, add_min_1, add_max_1, add_min_2, add_max_2, mult, mult_min_1, mult_max_1, mult_min_2, mult_max_2]

    console.log(settings);
    //console.log("running");
    
    if (add){
        //first, check if numeric
        settings.slice(1,5).forEach((x) => {
            if (isNaN(x)){
                is_valid = false;
                error_message = "Invalid Input";
            } 
        })

        //then, check the range of the numbers
        if (is_valid){
            if (settings[1] == settings[2] || settings[3] == settings[4]){
                is_valid = false;
                error_message = "Invalid Range";
            }
        }
    } if (mult){
        settings.slice(6,10).forEach((x) => {
            if (isNaN(x)){
                is_valid = false;
                error_message = "Invalid Input";
            } 
        })
        if (is_valid){
            if (settings[1] == settings[2] || settings[3] == settings[4]){
                is_valid = false;
                error_message = "Invalid Range";
            }
        }
    }

    //return [is_valid?, validated_settings, error_message]
    return [is_valid, settings, error_message];
}

function is_default(settings){
    var def = true;
    for (x in settings){
        if (settings[x] != default_settings[x]){
            def = false;
        }
    }
    return def;
}

function end_test(){
    //clear counters and timers 
    clearTimeout(finish_test);
    finish_test = null;
}
