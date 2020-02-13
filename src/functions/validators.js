export function textValidator(value, from, to) {
    if(value.length === 0) {return {"result": null, "msg": "This input is required."};}
    if(!(value.length >=from)) {
        return {"result": false, "msg": "Fill longer text"};
    }
    if(!(value.length <= to)) {
        return {"result": false, "msg": "Text is too big"};
    }
    return {"result": true, "msg": ""};
}

export function passwordValidator(value, from=8) {
    if(value.length === 0) {return {"result": null, "msg": "This input is required."};}
    if(!(value.length >=from)) {
        return {"result": false, "msg": "Password is too short. Minimum length for password is "+from+" characters."};
    }
    return {"result": true, "msg": ""};
}

export function emailValidator(value) {
    if(value.length === 0) {return {"result": null, "msg": "This input is required."};}
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(value)) {
        return {"result": false, "msg": "Email address is not valid"};
    }
    return {"result": true, "msg": ""};
}

export function imageValidator(value) {
    if(value.length === 0) {return {"result": null, "msg": "This input is required."};}
    const val_array = value.split('.');
    const ext = val_array[val_array.length - 1 ];
    const types = ['png', 'jpg', 'jpeg'];
    if(types.indexOf((ext).toLowerCase()) === -1) {
        return {"result": false, "msg": "Bad image format. Allowed formats are PNG and JPG (JPEG)."};
    }
    return {"result": true, "msg": ""};
}

