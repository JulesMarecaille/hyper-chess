

function validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateUsername(name){
    const re = /^[a-zA-Z\-\_\@0-9]{3,100}$/;
    return re.test(String(name).toLowerCase());
}

function validatePassword(password){
    const re = /^.{5,100}$/;
    return re.test(String(password).toLowerCase());
}

export { validateEmail, validateUsername, validatePassword }
