function createSelectComponent(id, name) {
    const select = document.createElement('select');
    select.name = name;
    select.id = id;
    return select;
}


function populateDropdown(select, data) {
    const placeholder = createPlaceholder('Goals');
    select.appendChild(placeholder);
    console.log(typeof(data));
    data.forEach(data => {
        const option = document.createElement('option');
        option.value = data.id;
        option.textContent = data.name;
        select.appendChild(option);
    });
}


function createPlaceholder(text) {
    const placeholder = document.createElement('option');
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.value = "";
    placeholder.textContent = text;
    return placeholder;
}


function createBtnComponent(attributes, text, id, idx) {
    const newBtn = document.createElement('button');
    newBtn.innerHTML = text;
    for(let a in attributes) {
        if (a == "class") attributes.class = btnClass[idx];
        if (a == "id") attributes.id = id;
        newBtn.setAttribute(a, attributes[a]);
    }
    return newBtn;
}


function createDiv(divClass) {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', divClass);
    return newDiv;
}


function createInputComponent(attributes, id, placeholder, type) {
    const input = document.createElement('input');
    for(let a in attributes) {
        if (a == 'type') attributes.type = type;
        if (a == "id") attributes.id = id;
        if (a == "placeholder") attributes.placeholder = placeholder;
        input.setAttribute(a, attributes[a]);
    }
    return input;
}


function createLabelComponent(attributes, text) {
    const label = document.createElement('label');
    label.innerHTML = text;
    for (let a in attributes) {
        label.setAttribute(a, attributes[a]);
    }
    return label;
}


function createSmallComponent(attributes, text, id) {
    const small = document.createElement('small');
    small.innerHTML = text;
    for (let a in attributes) {
        if (a == "id") attributes.id = id;
        small.setAttribute(a, attributes[a]);
    }
    return small;
}
