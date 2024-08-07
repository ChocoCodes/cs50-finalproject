function createNewGoal(e) {
    e.preventDefault();
    if(hasAddedComponents) {
        return;
    }
    const profileForm = document.getElementById('profile-form');
    const fieldGrp = createDiv('form-group');
    const url = '/create_new';

    let formLabel = createLabelComponent(labelAttr, 'New Goal');
    let gName = createInputComponent(inputAttr, 'g-name', 'Enter Goal Name', 'text'),
    gDesc = createInputComponent(inputAttr, 'g-desc', 'Enter Goal Description', 'text'),
    gAmt = createInputComponent(inputAttr, 'g-amt', 'Enter Goal Amount', 'number');
    let submitBtn = createBtnComponent(btnAttr, 'Submit', 'gsubmit-btn', 0);
    cancelBtn = createBtnComponent(btnAttr, 'Cancel', 'gcancel-btn', 1);

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const name = gName.value, 
        desc = gDesc.value, 
        amt = parseFloat(gAmt.value);
        console.log(typeof(amt));
        console.log('Name: ' + name + ' Desc: ' + desc + ' Amt: ' + amt); // DB
        if(checkValue(amt)) {
            alert('invalid amount.');
            profileForm.reset();
            return;
        }
        let newGoal = {
            goal_name: name,
            goal_desc: desc,
            goal_amt: amt
        };
        console.log(newGoal) // DB
        sendData(profileForm, newGoal, url);
    });

    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clsProfileForm(profileForm);
    });

    fieldGrp.append(formLabel);
    fieldGrp.append(gName);
    fieldGrp.append(gDesc);
    fieldGrp.append(gAmt);
    profileForm.append(fieldGrp);
    profileForm.appendChild(document.createElement('br'));
    profileForm.append(submitBtn);
    profileForm.append(cancelBtn);
    showForm(profileForm);
}

// TODO
function editGoal(e) {
    e.preventDefault();
    const profileForm = document.getElementById('profile-form');
    const fieldGrp = createDiv('form-group');
    const url = '/edit_goal';
    getGoals(function(goals) {
        console.log(goals);
        let editName = createInputComponent(inputAttr, 'new-name', 'Enter Name', 'text'), 
        editDesc = createInputComponent(inputAttr, 'new-desc', 'Enter Description', 'text'),
        editTotal = createInputComponent(nputAttr, 'new-total', 'Enter Updated Amount', 'number');
        fieldGrp.append(editName);
        fieldGrp.append(editDesc);
        fieldGrp.append(editTotal);
    });

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


function opnDashboardForm(e) {
    e.preventDefault();
    btnPressedId = e.target.id;
    document.getElementById('data-entry').style.display = "block";
    return;

}


function clsDashboardForm(e) {
    e.preventDefault();
    document.getElementById('data-entry').style.display = "none";
}

function showDeleteForm(e) {
    e.preventDefault();
    if(hasAddedComponents) {
        return;
    }

    const url = '/delete';
    const profileForm = document.getElementById('profile-form');
    const newDiv = createDiv('form-group');
    let msg = 'Are you sure you want to delete your account? This process is irreversible.';
    let label = createLabelComponent(labelAttr, 'Delete Account');
    let confirmText = createSmallComponent(smallAttr, msg, 'deleteNotif');
    let yesBtn = createBtnComponent(btnAttr, 'Yes', 'yes-btn', 0), 
    noBtn = createBtnComponent(btnAttr, 'No', 'no-btn', 1);

    yesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        uName = document.getElementById('username').textContent.trim();
        console.log(username); // DB
        let userData = {
            username: uName
        };
        sendData(profileForm, userData, url);
    });

    noBtn.addEventListener('click', function(e) {
        e.preventDefault();
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
    const url = '/change';
    const profileForm = document.getElementById('profile-form');
    const inputFieldIds = ['new-pass', 'confirm-pass'];
    const inputPlaceholders = ['Enter New Password', 'Re-enter New Password'];
    const inputReqs = ['Password should have the ff: 1 symbol, 1 number and length of 8 or more.', 'Please ensure that both inputs are the same.'];
    const smallNotifIds = ['npNotif', 'cpNotif'];
    const btnText = ['Change', 'Cancel'];

    const newDiv = createDiv('form-group');
    let label = createLabelComponent(labelAttr, 'Change Password');
    let newPass = createInputComponent(inputAttr, inputFieldIds[0], inputPlaceholders[0], 'password'),
    confirmPass = createInputComponent(inputAttr, inputFieldIds[1], inputPlaceholders[1], 'password');
    let npSubTxt = createSmallComponent(smallAttr, inputReqs[0], smallNotifIds[0]), 
    cpSubTxt = createSmallComponent(smallAttr, inputReqs[1], smallNotifIds[1]);
    let submitBtn = createBtnComponent(btnAttr, btnText[0], 'sub-cp', 0),
    cancelBtn = createBtnComponent(btnAttr, btnText[1], 'cancel-cp', 1);
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let newPass = document.getElementById(inputFieldIds[0]).value, 
        confPass = document.getElementById(inputFieldIds[1]).value;
        if (!checkPassReq(newPass, confPass)) {
            alert('passwords are not equal');
            profileForm.reset();
            return;
        } 
        let newPassData = {
            new_password: newPass
        };
        sendData(profileForm, newPassData, url);
    });
    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
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