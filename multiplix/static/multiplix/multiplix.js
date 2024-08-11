document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#main").classList.add('navbar-brand-active');
    home();
    set_default();
    set_time("time-120");
    reset_message();

    //start test, only works if test hasn't been started, which is indicated if incrementer is null
    document.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            //console.log('enter clicked');
            if (incrementer == null) {
                console.log("test started");
                make_test();
            }
    }});
    //load homescreen and exit test
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            //console.log("back to home");
            home();
    }});
 
    //either addition or multiplication need to be selected
    document.querySelectorAll('.form-check-input').forEach((operation_switch) => {
        operation_switch.onclick = () => {
            reset_message();
            if (!sign_clicked()) {
                //If clicking that switch would turn both addition and multiplication off, undo it
                operation_switch.checked = true;
                settings_message("Select at least one operation");
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

    document.querySelectorAll('.time-options').forEach((button) => {
        button.onclick = () => {
            set_time(button.id);
        }
    })

    //limit the length in the settings input field, 4 for addition, 3 for multiplication
    document.querySelectorAll('.num-input').forEach((input) => {
        input.oninput = () => {
            let max_len = 3;
            if (input.id.includes("add")){
                max_len = 4;
            }
            if (input.value.length > 0 && Number(input.value[0]) == 0) {
                //prevents the user from entering 0 by removing all leading 0s
                //although only removing the first leading 0 would prevent the user from 
                //typing in ANY leading zeros(including lone 0s), it does not account for copy and pasting
                var leading_zeros = 0;
                for(i=0; i<input.value.length;i++){
                    if (Number(input.value[i]) == 0 && i == leading_zeros){
                        leading_zeros ++;
                    }
                }
                input.value = input.value.slice(beginning_zeros, input.value.length);
                //new value = input.value.slice(1, input.value.length);
                settings_message(`${operation} only takes ${max_len} digits`);
            }
            else if (input.value.length > max_len){
                input.value = input.value.slice(0,max_len);

                let operation = "Addition/Subtraction";
                if (max_len == 3){
                    operation = "Multiplication/Division";
                }
                settings_message(`${operation} only takes ${max_len} digits`);
            }
            else {
                reset_message();
            }
        }
    });

    //triggered a keydown with a button
    //because there's two buttons
    document.querySelectorAll('#enter').forEach((button) => {
        button.onclick = () => {
            let enterEvent = new KeyboardEvent("keydown", {
                key: "Enter",
                keyCode: 13,
                which: 13
            });
            document.dispatchEvent(enterEvent);
        }
    });

    document.querySelectorAll('#escape').forEach((button) => {
        button.onclick = () => {
            let escEvent = new KeyboardEvent("keydown", {
                key: "Escape",
                keyCode: 27,
                which: 27
              });
            document.dispatchEvent(escEvent);
        }
    });

    document.querySelector('#default-button').onclick = set_default;
});

function reset_message(){
    document.querySelector(".error-message").style.display = "none";
}

function settings_message(message){
    document.querySelector(".error-message").style.display = "flex";
    document.querySelector(".settings-error-message").innerHTML = message;
}

function set_default(){
    document.querySelector('#addition-switch').checked = default_settings[0];
    document.querySelector('#add_min_1').value = default_settings[1];
    document.querySelector('#add_max_1').value = default_settings[2];
    document.querySelector('#add_min_2').value = default_settings[3];
    document.querySelector('#add_max_2').value = default_settings[4];
    document.querySelector('#multiplication-switch').checked = default_settings[5];
    document.querySelector('#mult_min_1').value = default_settings[6];
    document.querySelector('#mult_max_1').value = default_settings[7];
    document.querySelector('#mult_min_2').value = default_settings[8];
    document.querySelector('#mult_max_2').value = default_settings[9];

    disable_inputs('add');
    disable_inputs('mult');
}

function set_time(id) {
    document.querySelectorAll('.time-options').forEach((button) => {
        button.classList.remove('time-option-active');
    })

    document.querySelector(`#${id}`).classList.add('time-option-active');
}

function disable_inputs(operation){
    if (sign_clicked(operation)){
        document.querySelectorAll(`.${operation}-input`).forEach((input)=>{
            input.disabled = false;
        });
    } else {
        document.querySelectorAll(`.${operation}-input`).forEach((input)=>{
            input.disabled = true;
        });
    }
}


function set_footer(){

}

//default settings 
const default_settings = [true, 12, 100, 12, 100, true, 5, 12, 12, 99];

var incrementer = null;
//this is the counter

const Count = function _Count() {
    return _Count.state.count;
};

const setState = (callback) => {
    callback();
    updateCounter(); // extracted function
}

const setQpm = (callback) => {
    callback();
    updateQPM();
}

Count.state = {
    test_id: 0,
    count: 10,
    current_qpm: 0,
    increment: () => {
        if (Count.state.count > 0) {
            setState(() => Count.state.count--);
            setQpm(() => Count.state.current_qpm = Math.round((Test.state.score / ((Test.state.time-Count.state.count)/60))*100) /100 );
        } else {
            clearInterval(incrementer);
            results();
        }
    },
    reset: (num) => {
        setState(() =>  Count.state.count = num);
        setQpm(() =>  Count.state.current_qpm = 0);
    },
    new_test: (id) => {
        Count.state.test_id = id;
    },
};

const updateCounter = () => {
    document.querySelector("#counter").innerHTML = Count();
};

const updateQPM = () => {
    document.querySelector("#test-qpm").innerHTML = Count.state.current_qpm;
}



var finish_test = null;

const Test = () => {

};

Test.state = {
    test_id: 0,
    score: 0,
    specifications: [], 
    time: 0,
    timestamp: 0,
    logged_in: false,
    is_default: true,
    a_times: [],
    s_times: [],
    m_times: [],
    d_times: [],
    reset_test: (id, specifications, time, is_default, logged_in) => {
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
        Test.state.logged_in = logged_in;
    },
    correct: () => {
        Test.state.score++;
    },
    new_time: (equation_type, time) => {
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

function results() {
    incrementer = null;
    const home = document.querySelector("#home");
    home.style.display = 'none';
    const test = document.querySelector("#test");
    test.style.display = 'none';
    const result = document.querySelector("#results");
    result.style.display = 'block';
    
    //console.log(incrementer == null);
    let qpm = Test.state.score / ((Test.state.time)/60);
    qpm = Math.round(qpm * 100) / 100;

    const result_message = document.querySelector('.result-message');
    const result_col = document.createElement('div');
    result_col.setAttribute('class', 'col-xl-8 col-sm-10 col-12 text-center result-message-text');

    //console.log(`The score is ${Test.state.score}`);

    document.querySelector('#score').innerHTML = Test.state.score;

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

    if (Test.state.logged_in) {
        if (!Test.state.is_default){
            result_col.innerHTML = "Play on default settings to save your scores.";
            result_message.appendChild(result_col);
        } else {
            const csrftoken = getCookie('csrftoken');
            fetch(`/test/${Test.state.test_id}`, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    score: Test.state.score,
                    qpm : qpm,
                    time: Test.state.time,
                    is_default: Test.state.is_default,
                }),
                credentials: 'same-origin',
            })
            .then( response => response.json())
            .then( result => {
                //console.log(result.message);
                if (result.message.length > 0){
                    result_col.innerHTML = "<div class='text-center congrats-text'>Congradulations!</div>";
                    result.message.forEach((msg) => {
                        const message = document.createElement('div');
                        message.innerHTML = `<span class="congrats-exclamation-mark"><i class="fa fa-exclamation-circle" ></i></span>&nbsp; ${msg}`;
                        //console.log("created");
                        result_col.appendChild(message);

                    });
                    result_message.appendChild(result_col);
                }
            });
        }
    } else {
        result_col.innerHTML = `<p><a href="/login">Log in</a> to save your data and place on the leaderboards.</p>`;
        result_message.appendChild(result_col);
    };
    document.querySelector("#answer").focus();
    document.querySelector("#answer").blur();
}
function make_test() {
    //hide message block within the test container, reactived if incorrect settings

    //clear input field
    document.querySelector('#answer').value = "";

    const time = get_time();
    
    //run validate settings
    const settings_info = validate_settings();
    const settings = settings_info[1];
    //console.log(settings_info[2]);

    const error = document.querySelector("#settings-error");
    error.style.display = 'none';

    if (settings_info[0]) {
        //console.log("test start");

        let is_def = is_default(settings);
        //hide error message
        const home = document.querySelector("#home");
        home.style.display = 'none';
        const test = document.querySelector("#test");
        test.style.display = 'block';
        const result = document.querySelector("#results");
        result.style.display = 'none';

        //save settings in test() function, send to test

        const csrftoken = getCookie('csrftoken');

        //after test completed, complete the test
        fetch(`/test`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({
                time: time,
                add: settings[0],
                mult: settings[5],
                is_default: is_def,
            }),
            credentials: 'same-origin',
        })
        .then( response => response.json())
        .then( result => {
            //console.log(result.logged_in);
            //test id, set count to that
            Count.state.new_test(result.test_id);
            Test.state.reset_test(result.test_id, settings, time, is_def, result.logged_in);
            //console.log(Test.state.specifications);
            generate_question();
        });

        document.querySelector("#answer").focus();

        //set time
        Count.state.reset(2);

        //console.log(timeoutId);

        if (incrementer == null) {
            incrementer = setInterval(Count.state.increment, 1000); 
        }

        //increment
    } else {
        let error_operation = 'Addition/Subtration';
        let error_message = "";
        if(settings_info[2].includes('mult')){
            error_operation = 'Multiplication/Division';
        }
        if(settings_info[2].includes('range')){
            error_message = `Enter a valid range for ${error_operation}`;
        } else {
            let upper_range = 999;
            if (error_operation.includes('A')){
                upper_range = 9999;
            }
            error_message = `Enter a valid number for ${error_operation} between 1 and ${upper_range}`;
        }
        settings_message(error_message);
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
    //console.log("incrementer emptied");
}

function generate_question(){
    // if add, make add, if mult, add mult
    let add = Test.state.specifications.slice(0,5);
    let mult = Test.state.specifications.slice(5,10);
    let term1 = 0;
    let term2 = 0;
    let sign = 'None'
    if (add[0]) {
        //console.log('add true');
        term1 = random_num(add[1], add[2]);
        term2 = random_num(add[3], add[4]);
        if (mult[0]){
            //console.log(mult[0]);
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
        //console.log(mult[0]);
        term1 = random_num(mult[1], mult[2]);
        term2 = random_num(mult[3], mult[4]);
        if (Math.random() < 0.5) {
            //mult
            sign = "multiplication";
        } else {
            sign = "division";
        }
    }
    equation = make_equation((term1), (term2), sign);

    //equation[0] is the question, equation[1] is the result
    //console.log(`${equation[0]} = ${equation[1]}`);

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
    let sign = "&times;";
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
        sign = "&divide;";
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
    //console.log(`${a} + ${b}`);
    equation = `${term1} ${sign} ${term2}`;
    return [equation, result, eq_type];
}

function display_question(equation, result, eq_type){
    const question = document.querySelector('#question');
    //console.log(question);
    question.innerHTML = equation;
    document.querySelector('#question').animate([{opacity: '0', right: '-20%'},{opacity : '1', right: '0%'}],{duration:100,})


    const score = document.querySelector('#current-score');
    score.innerHTML = Test.state.score;

    const input = document.querySelector('#answer');

    document.oninput = () => {
        //console.log(input.value);
        if ((input.value) == result){     
            input.value = "";
            Test.state.correct();
            Test.state.new_time(eq_type, Count.state.count);
            generate_question();
        }
    }
}

function get_time(){
    let time = 120;
    document.querySelectorAll('.time-options').forEach((option)=> {
        if (option.classList.contains('time-option-active')){
            time = option.innerHTML.slice(0,-1);
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

    const settings = [add, add_min_1, add_max_1, add_min_2, add_max_2, mult, mult_min_1, mult_max_1, mult_min_2, mult_max_2];
    //console.log(settings);
    
    if (add){
        //first, check if numeric
        //conveniently, - and + can be entered into a number input field, however, retrieving it in JS
        //returns a blank string, which results in 0 after Number(), which we do not want anyways
        //x == 0 takes care of a blank input, input = 0, and input has invalid characters
        settings.slice(1,5).forEach((x) => {
            if (isNaN(x) || x==0){
                is_valid = false;
                error_message = "add_num";
            } 
        });

        //then, check the range of the numbers
        if (is_valid){
            if (settings[1] == settings[2] || settings[3] == settings[4]){
                is_valid = false;
                error_message = "add_range";
            }
        }
    } if (mult && is_valid){
        settings.slice(6,10).forEach((x) => {
            if (isNaN(x) || x==0){
                is_valid = false;
                error_message = "mult_num";
            } 
        })
        if (is_valid){
            if (settings[6] == settings[7] || settings[8] == settings[9]){
                is_valid = false;
                error_message = "mult_range";
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
            average_times.push(`${Math.round(raw_time * 100) / 100}s`);
        }
    })
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

//taken from Django's website
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}