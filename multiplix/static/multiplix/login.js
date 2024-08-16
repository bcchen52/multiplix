document.addEventListener('DOMContentLoaded', function() {
    //navbar
    document.querySelector("#login").classList.add('nav-link-active');
    
    const message = document.querySelector('#register-message');

    const register_button = document.querySelector("#register-button");
    const login_button = document.querySelector("#login-button");

    //register button

    document.querySelectorAll('.register-form').forEach((form) => {
        //when each form is clicked, validate input oninput
        form.onfocus = () => {
            message.style.display = "block";

            //first validate, determining if form is valid, which is used in create_message to determine message
            validity(form);
            create_message(message, form);
            
            form.oninput = () => {
                clean_input(form)
                validity(form);
                create_message(message, form);
            }
        }
        form.onblur = () => {
            message.style.display = "none";
        }
        //console.log(form.id);
    });

    document.querySelectorAll('.login-form').forEach((form) => {
        form.oninput = () => {
            validity(form);
        }
    });

    //keydown causes issues
    //each time anything is clicked, check if the forms are valid
    document.onkeyup = () => {
        //console.log("clicked");
        register_validity(register_button);
        register_validity(login_button);
    }
});

function clean_input(form){
    //removes white space from all, special characters from user, and special characters except for @ and . in email
    if (form.id.includes('register')){
        if (form.id.includes('username')){
            form.value = form.value.replace(/[^a-zA-Z0-9 ]/g, "")
        } else if (form.id.includes('email')){
            //alphanumeric
            form.value = form.value.replace(/[^0-9a-zA-Z.@ ]/g, "")
        } 
        form.value = form.value.replace(/\s/g, "");
    }
}

function validity(form){
    //console.log(form.id);
    if (form.id == "register-username") {
        if (form.value.length > 0){
            //console.log("valid");
            form.setAttribute('class', 'form-control register-form is-valid');
            return true;
        } else {
            //console.log("invalid");
            form.setAttribute('class', 'form-control register-form is-invalid');
            return false;
        }
    } else if (form.id == "register-email") {
        if (form.value.includes("@")){
            //console.log("valid");
            form.setAttribute('class', 'form-control register-form is-valid');
            return true;
        } else {
            //console.log("invalid");
            form.setAttribute('class', 'form-control register-form is-invalid');
            return false;
        }
    } else if (form.id == "register-password") {
        if (form.value.length >= 8){
            form.setAttribute('class', 'form-control register-form is-valid');
            return true;
        } else {
            form.setAttribute('class', 'form-control register-form is-invalid');
            return false;
        }
    } else if (form.id == "register-confirm") {
        const password = document.querySelector("#register-password");
        if (form.value == password.value && validity(password)){
            form.setAttribute('class', 'form-control register-form is-valid');
            return true;
        } else {
            form.setAttribute('class', 'form-control register-form is-invalid');
            return false;
        }
    } else if (form.id == "login-username" || form.id == "login-password") {
        if (form.value.length > 0){
            form.setAttribute('class', 'form-control login-form is-valid');
            return true;
        } else {
            form.setAttribute('class', 'form-control login-form');
            return false;
        }
    }
}

function create_message(message, form){
    if (form.id == "register-username"){
        //user is valid if greater than 0
        if (!validity(form)){
            message.innerHTML = `<span><i class="fa fa-exclamation-circle my-auto register-exclamation-mark"></i>&nbsp;Username cannot be empty.</span>`;
        } else if (form.value.length < 16){
            message.innerHTML = `<span><span class="register-check-mark">&#10003;</span>&nbsp;${16 - form.value.length} characters remaining.</span>`;
        } else {
            message.innerHTML = `<span><span class="register-check-mark">&#10003;</span>&nbsp;Username at max length.</span>`;
        }
    } else if (form.id == "register-password"){
        if (validity(form)){
            message.innerHTML = `<span><span class="register-check-mark">&#10003;</span>&nbsp;Valid password.</span>`;
        } else {
            message.innerHTML = `<span><i class="fa fa-exclamation-circle my-auto register-exclamation-mark"></i>&nbsp;Password needs ${8 - form.value.length} more characters.</span>`;
        }
    } else if (form.id == "register-email"){
        if (validity(form)){
            message.innerHTML = `<span><span class="register-check-mark">&#10003;</span>&nbsp;Valid email.</span>`;
        } else {
            message.innerHTML = `<span><i class="fa fa-exclamation-circle my-auto register-exclamation-mark"></i>&nbsp;Enter a valid email that contains "@".</span>`;
        }
    } else if (form.id == "register-confirm"){
        if (validity(form)){
            message.innerHTML = `<span><span class="register-check-mark">&#10003;</span>&nbsp;Matches password.</span>`;
        } else {
            message.innerHTML = `<span><i class="fa fa-exclamation-circle my-auto register-exclamation-mark"></i>&nbsp;Must match a VALID password.</span>`;
        }
    }
}

function register_validity(button){
    button.disabled = false;

    if (button.id == "register-button"){
        document.querySelectorAll('.register-form').forEach((form) => {
            if (!form.className.includes('is-valid')){
                button.disabled = true;
            }
        });
    } else if (button.id == "login-button"){
        document.querySelectorAll('.login-form').forEach((form) => {
            if (!form.className.includes('is-valid')){
                button.disabled = true;
            }
        });
    }
}
