document.addEventListener('DOMContentLoaded', function() {
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
                validity(form);
                create_message(message, form);
            }
        }
        form.onblur = () => {
            message.style.display = "none";
        }
        console.log(form.id);
    });

    document.querySelectorAll('.login-form').forEach((form) => {
        form.oninput = () => {
            validity(form);
        }
    });

    //keydown causes issues
    //each time anything is clicked, check if the forms are valid
    document.onkeyup = () => {
        console.log("clicked");
        register_validity(register_button);
        register_validity(login_button);
    }
});

function validity(form){
    console.log(form.id);
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
            message.innerHTML = `Username cannot be empty.`;
        } else if (form.value.length < 16){
            message.innerHTML = `${16 - form.value.length} characters remaining.`;
        } else {
            message.innerHTML = `Username at max length.`;
        }
    } else if (form.id == "register-password"){
        if (validity(form)){
            message.innerHTML = `Valid password.`;
        } else {
            message.innerHTML = `Password needs ${8 - form.value.length} more characters.`;
        }
    } else if (form.id == "register-email"){
        if (validity(form)){
            message.innerHTML = `Valid email.`;
        } else {
            message.innerHTML = `Enter a valid email that contains "@"`;
        }
    } else if (form.id == "register-confirm"){
        if (validity(form)){
            message.innerHTML = `Valid password.`;
        } else {
            message.innerHTML = `Must match a VALID password.`;
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
