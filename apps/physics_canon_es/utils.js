export { key_bindings, key_states, onKeyDownHandler, onKeyUpHandler };

const key_bindings = {
    38: "up",
    40: "down",
    37: "left",
    39: "right",
    32: "space",
    16: "shift",
    13: "enter",
    27: "escape",
    8: "backspace",
    
    "w": "up",
    "s": "down",
    "a": "left",
    "d": "right",
    " ": "space",
}

const key_states = {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "space": false,
    "shift": false,
    "enter": false,
    "escape": false,
    "backspace": false,
}


function onKeyDownHandler(event) {
    // update key states
    if (key_bindings[event.keyCode] != undefined) {
        key_states[key_bindings[event.keyCode]] = true;
    }

    console.log(event.keyCode);
    console.log(key_states);
}


function onKeyUpHandler(event) {
    // update key states
    if (key_bindings[event.keyCode] != undefined) {
        key_states[key_bindings[event.keyCode]] = false;
    }

    console.log(event.keyCode);
    console.log(key_states);
}
