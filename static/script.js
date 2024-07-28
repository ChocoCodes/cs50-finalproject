let btnPressedId;
let hasAddedComponents = false;
// Open the popup form
function opnDashboardForm(e) {
    e.preventDefault();
    btnPressedId = e.target.id;
    document.getElementById('data-entry').style.display = "block";
    return;

}


// Close the popup form
function clsDashboardForm(e) {
    e.preventDefault();
    document.getElementById('data-entry').style.display = "none";
}


// Extract button ID and the amount, then send to back-end as JSON
window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('data-entry');
    const submit = document.getElementById('sub-btn');
    if (submit) {
        submit.addEventListener('click', function(e){
            e.preventDefault();
            sendData(form);
        });
    }
});

function sendData(form) {
    let amtIn = parseFloat(document.getElementById('amtField').value);
    if (amtIn < 0) {
        alert('Amount cannot be of negative value.');
        form.reset();
        return;
    }

    let clientData = [{
        'btnId': btnPressedId, 
        'amount': amtIn
    }];

    $.ajax({
        url: '/submit',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(clientData),
        success: function(response) {
            console.log('Response Converted: ' + JSON.stringify(response)); // DB
            updateDashboard(form, response);
        },
        error: function(err) {
            console.log('Error: ' + err); // DB
            alert('Error: ' + err) 
        }
    });
}

function formatToPHP(amount) {
    return '₱' + amount.toFixed(2);
}


function updateDashboard(inputForm, response) {
    const transactionTable = document.getElementById('transactions-data');
    const transactionDisplay = [response.transaction_id, response.date, response.type, formatToPHP(response.amt)];
    const FIELD_COUNT = transactionDisplay.length;
    const financeDisplay = [formatToPHP(response.u_savings), formatToPHP(response.u_spendings), formatToPHP(response.u_allowance)];
    const displayId = ['save', 'spend', 'allow'];
    // Reset and Close Input Form
    inputForm.reset();
    document.getElementById('data-entry').style.display = "none";
    // Update User Finances
    for (let i = 0; i < displayId.length; i++) {
        document.getElementById(displayId[i]).innerText = financeDisplay[i];
    }
    // Update Transaction Table
    let newEntry = transactionTable.insertRow(transactionTable.rows.length);
    for (let i = 0; i < FIELD_COUNT; i++) {
        let field = newEntry.insertCell(i);
        field.classList.add((i == 0) ? "text-start" : "text-end");
        field.innerText = transactionDisplay[i];
    }
}


let inputAttr = {
    id: '',
    type: 'password',
    placeholder: '',
    required: '',
    class: 'form-control',
    autocomplete: 'off',
};
let labelAttr = {
    class: 'h3 fw-s'
};
let smallAttr = {
    id: '',
    class: 'form-text text-muted'
};
let btnAttr = {
    class: '',
    id: ''
};
const btnClass = ['btn btn-primary', 'btn btn-danger'];


function showConfirmDelete(e) {
    e.preventDefault();
    if(hasAddedComponents) {
        return;
    }

    const profileForm = document.getElementById('profile-form');
    const newDiv = createDiv('form-group');
    let msg = 'Are you sure you want to delete your account? This process is irreversible.';
    let label = createLabelComponent(labelAttr, 'Delete Account');
    let confirmText = createSmallComponent(smallAttr, msg, 'deleteNotif');
    let yesBtn = createBtnComponent(btnAttr, 'Yes', 'yes-btn', 0), 
    noBtn = createBtnComponent(btnAttr, 'No', 'no-btn', 1);

    yesBtn.addEventListener('click', function() {
        username = document.getElementById('username').textContent.trim();
        console.log(username);
        sendDeleteRequest(username);
    });

    noBtn.addEventListener('click', function() {
        clsProfileForm(profileForm);
    });

    newDiv.appendChild(label);
    newDiv.appendChild(document.createElement('br'));
    newDiv.appendChild(confirmText);
    profileForm.appendChild(newDiv);
    profileForm.appendChild(yesBtn);
    profileForm.appendChild(noBtn);
    
    showForm(profileForm);
}



function createPasswordForm(e) {
    e.preventDefault();
    if (hasAddedComponents) {
        return;
    }
    
    const profileForm = document.getElementById('profile-form');
    const inputFieldIds = ['new-pass', 'confirm-pass'];
    const inputPlaceholders = ['Enter New Password', 'Re-enter New Password'];
    const inputReqs = ['Password should have the ff: 1 symbol, 1 number and length of 8 or more.', 'Please ensure that both inputs are the same.'];
    const smallNotifIds = ['npNotif', 'cpNotif'];
    const btnText = ['Change', 'Cancel'];

    const newDiv = createDiv('form-group');
    let label = createLabelComponent(labelAttr, 'Change Password');
    let newPass = createInputComponent(inputAttr, inputFieldIds[0], inputPlaceholders[0]),
    confirmPass = createInputComponent(inputAttr, inputFieldIds[1], inputPlaceholders[1]);
    let npSubTxt = createSmallComponent(smallAttr, inputReqs[0], smallNotifIds[0]), 
    cpSubTxt = createSmallComponent(smallAttr, inputReqs[1], smallNotifIds[1]);
    let submitBtn = createBtnComponent(btnAttr, btnText[0], 'sub-cp', 0),
    cancelBtn = createBtnComponent(btnAttr, btnText[1], 'cancel-cp', 1);
    
    submitBtn.addEventListener('click', function() {
        let newPass = document.getElementById(inputFieldIds[0]).value, 
        confPass = document.getElementById(inputFieldIds[1]).value;
        validatePassForm(newPass, confPass, profileForm);
    });
    cancelBtn.addEventListener('click', function() {
        clsProfileForm(profileForm);
    });
    
    newDiv.appendChild(label);
    newDiv.appendChild(newPass);
    newDiv.appendChild(npSubTxt);
    newDiv.appendChild(confirmPass);
    newDiv.appendChild(cpSubTxt);
    profileForm.appendChild(newDiv);
    profileForm.appendChild(submitBtn);
    profileForm.appendChild(cancelBtn);
    
    showForm(profileForm);
}   

function showForm(form) {
    hasAddedComponents = true;
    form.style.display = 'block';
}

function clsProfileForm(form) {
    form.style.display = "none";
    form.innerHTML = '';
    hasAddedComponents = false;
}


function sendDeleteRequest(username) {
    let userData = {
        'username': username
    };
    $.ajax({
        url: '/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function(response) {
            console.log('Response Converted: ' + JSON.stringify(response)); // DB
            window.location.href = "/login";
        },
        error: function(err) {
            console.log('Error: ' + err); // DB
            alert('Error: ' + err);
        }
    });
}


function createDiv(divClass) {
    newDiv = document.createElement('div');
    newDiv.setAttribute('class', divClass);
    return newDiv;
}


function createInputComponent(attributes, id, placeholder) {
    let input = document.createElement('input');
    for(let a in attributes) {
        if (a == "id") {
            attributes.id = id;
        }
        if (a == "placeholder") {
            attributes.placeholder = placeholder;
        }
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
        if (a == "id") {
            attributes.id = id;
        } 
        small.setAttribute(a, attributes[a]);
    }
    return small;
}


function createBtnComponent(attributes, text, id, idx) {
    let newBtn = document.createElement('button');
    newBtn.innerHTML = text;
    for(let a in attributes) {
        if (a == "class") {
            attributes.class = btnClass[idx];
        }
        if (a == "id") {
            attributes.id = id;
        }
        newBtn.setAttribute(a, attributes[a]);
    }
    return newBtn;
}

function testDebugPass(newPass, confPass) {
    if (newPass === '' && confPass === '') return false;
    return newPass === confPass;
}

function checkPassReq(newPass, confPass) {
    if (!(newPass === confPass)) return false;
    const charReq = ['+', '-', '#', '!', '?', '_', '@', '%', '&', '*'];
    let charCtr = 0, numCtr = 0;
    let len = newPass.length;

    for (let i = 0; i < len; i++) {
        if (charReq.includes(newPass[i])) charCtr++;
        if (!isNaN(newPass[i])) numCtr++;
    }
    return !((charCtr === 0 && numCtr === 0) || len < 8);
}

function validatePassForm(newPass, reEntered, form) {
    if (!testDebugPass(newPass, reEntered)) {
        form.reset();
        alert('passwords are not equal');
    } else {
        alert('passwords are equal');
    }
}
