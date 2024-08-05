function testDebugPrint(e) {
    e.preventDefault();
    console.log('test-components');
}


function createBtnComponent(attributes, text, id, idx) {
    let newBtn = document.createElement('button');
    newBtn.innerHTML = text;
    for(let a in attributes) {
        if (a == "class") attributes.class = btnClass[idx];
        if (a == "id") attributes.id = id;
        newBtn.setAttribute(a, attributes[a]);
    }
    return newBtn;
}
function createDiv(divClass) {
    newDiv = document.createElement('div');
    newDiv.setAttribute('class', divClass);
    return newDiv;
}


function createInputComponent(attributes, id, placeholder, type) {
    let input = document.createElement('input');
    for(let a in attributes) {
        if (a == 'type') attributes.type = type;
        if (a == "id") attributes.id = id;
        if (a == "placeholder") attributes.placeholder = placeholder;
        input.setAttribute(a, attributes[a]);
    }
    return input;
}


function createLabelComponent(attributes, text) {
    let label = document.createElement('label');
    label.innerHTML = text;
    for (let a in attributes) {
        label.setAttribute(a, attributes[a]);
    }
    return label;
}


function createSmallComponent(attributes, text, id) {
    let small = document.createElement('small');
    small.innerHTML = text;
    for (let a in attributes) {
        if (a == "id") attributes.id = id;
        small.setAttribute(a, attributes[a]);
    }
    return small;
}
