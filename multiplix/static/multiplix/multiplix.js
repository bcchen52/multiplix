document.addEventListener('DOMContentLoaded', function() {
    home();
    //start test, only works if test hasn't been started, which is indicated if incrementer is null
    document.addEventListener("keydown", event => {
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
                if (operation_switch.id == "addition-switch") {
                    operation = "add";
                }
                disable_inputs(operation);
            }
        }
    });

    document.querySelector('.default').onclick = () => {
        document.querySelector('#addition-switch').checked = default_settings[0];
        document.querySelector('#add_min_1').value = default_settings[1];
        document.querySelector('#add_max_1').value = default_settings[2];
        document.querySelector('#add_min_2').value = default_settings[3];
        document.querySelector('#add_max_2').value = default_settings[4];
        document.querySelector('#multiplication-switch').checked = default_settings[5];
        document.querySelector('#mult_min_1').value = default_settings[1];
        document.querySelector('#mult_max_1').value = default_settings[2];
        document.querySelector('#mult_min_2').value = default_settings[3];
        document.querySelector('#mult_max_2').value = default_settings[4];

        disable_inputs('add');
        disable_inputs('mult');

        console.log('default clicked');
    }

    //default button
});

function disable_inputs(operation){
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

//TODO list 
//if user...
//-----full
//leaderboard
//user stats

//-----backend
//leaderboard models 

//-----frontend
//settings


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
    timestamp: 0,
    is_default: true,
    a_times: [],
    s_times: [],
    m_times: [],
    d_times: [],
    reset_test: (id, specifications, time, is_default) => {
        Test.state.test_id = id;
        Test.state.score = 0;
        Test.state.time = time;
        Test.state.timestamp = time;
        Test.state.specifications = specifications;
        Test.state.a_times = [];
        Test.state.s_times = [];
        Test.state.m_times = [];
        Test.state.d_times = [];
        Test.state.is_default = is_default;
    },
    correct: () => {
        Test.state.score++;
    },
    new_time: (equation_type, time) => {
        //console.log(equation_type);
        //console.log(`${Test.state.timestamp} - ${time} = ${Test.state.timestamp-time}`)
        if (equation_type == "addition") {
            Test.state.a_times.push(Test.state.timestamp-time);
        } else if (equation_type == "subtraction") {
            Test.state.s_times.push(Test.state.timestamp-time);
        } else if (equation_type == "division") {
            Test.state.d_times.push(Test.state.timestamp-time);
        } else {
            Test.state.m_times.push(Test.state.timestamp-time);
        }
        Test.state.timestamp = time;
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

    let qpm = Test.state.score / ((Test.state.time)/60);
    qpm = Math.round(qpm * 100) / 100;

    document.querySelector('#score').innerHTML = Test.state.score;
    console.log(document.querySelector('#score'));

    const qpm_div = document.querySelector('#qpm');

    average_times = get_average_times();

    qpm_div.innerHTML = qpm;


    //average times
    const addition_averages = document.querySelector('#addition-averages');
    addition_averages.style.display = "none";
    const multiplication_averages = document.querySelector('#multiplication-averages');
    multiplication_averages.style.display = "none";

    if (Test.state.specifications[0]){
        addition_averages.style.display = 'block';
        document.querySelector('#add-avg').innerHTML = average_times[0];
        document.querySelector('#sub-avg').innerHTML = average_times[1];
    } if (Test.state.specifications[5]){
        multiplication_averages.style.display = 'block';
        document.querySelector('#mult-avg').innerHTML = average_times[2];
        document.querySelector('#div-avg').innerHTML = average_times[3];
    } 

    //warning message

    console.log(document.querySelector('#logged_in').value == false);
    const result_message = document.querySelector('.result-message');

    if (document.querySelector('#logged_in').value == "True") {
        if (!Test.state.is_default){
            result_message.innerHTML = "Play on default settings to save your scores.";
        } else {
            result_message.innerHTML = ""; 
        }
    } else {
        console.log("not logged in");
        result_message.innerHTML = `<p><a href="/login">Log in</a> to save your data and place on the leaderboards.</p>`;
    };
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
        console.log("test start");

        let is_def = is_default(settings);
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
                is_default: is_def,
            })
        })
        .then( response => response.json())
        .then( result => {
            console.log(document.querySelector('#add_min_1').value);
            console.log(result.test_id);
            //test id, set count to that
            Count.state.new_test(result.test_id);
            Test.state.reset_test(result.test_id, settings, time, is_def);
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
        Count.state.reset(1);


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
                if (Math.random() < 0.5) {
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

    display_question(equation[0], equation[1], equation[2]);
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
        term2 = b;
    }
    console.log(`${a} + ${b}`);
    equation = `${term1} ${sign} ${term2}`;
    return [equation, result, eq_type];
}


function display_question(equation, result, eq_type){
    //console.log(display_question.caller);

    const question = document.querySelector('#question');
    //console.log(question);
    question.innerHTML = equation;

    const score = document.querySelector('#current-score');
    score.innerHTML = Test.state.score;

    const input = document.querySelector('#answer');

    document.oninput = () => {
        //console.log(input.value);
        if ((input.value) == result){     
            input.value = "";
            Test.state.correct();
            Test.state.new_time(eq_type, Count.state.count);
            console.log(`The time is ${Count.state.count}`);
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

function get_average_times(){
    //return add, sub, mult, div

    const total_times = [Test.state.a_times, Test.state.s_times, Test.state.m_times, Test.state.d_times];

    const average_times = [];

    total_times.forEach((time) => {
        if (time.length == 0) {
            average_times.push("N/A");
        } else {
            let raw_time = time.reduce((a, b) => a + b, 0) / time.length;

            //rounds to 0.00 if necessary
            average_times.push(Math.round(raw_time * 100) / 100);
        }
    })
    console.log(average_times);

    return average_times;
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
