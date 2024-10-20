const routes = ['/create_new', '/edit_goal', '/delete', '/change', '/remove', '/update'];
let index;


function updateGoalProgress(e) {
    e.preventDefault();
    if(hasAddedComponents) return;
    const profileForm = document.getElementById('profile-form');
    const fieldGrp = createDiv('form-group');

    getGoals(function(goals) {
        let label = createLabelComponent(labelAttr, 'Update Goal Progress');
        let deposit = createInputComponent(inputAttr, 'dep', 'Enter Amount', 'number');
        let select = createSelectComponent('edit-option', 'goals');
        let submitBtn = createBtnComponent(btnAttr, 'Submit', 'edit-submit', 0),
        cancelBtn = createBtnComponent(btnAttr, 'Cancel', 'edit-cancel', 1);
        populateDropdown(select, goals);

        let updateGoalDeposit = {};
        select.addEventListener('change', function() {
            let selected = parseInt(select.value);
            goals.forEach(goal => {
                if(selected === goal.id) {
                    index = getIndex(goal.name);
                    updateGoalDeposit.id = goal.id;
                    updateGoalDeposit.name = goal.name;
                    console.log(`Index: ${index}, ID: ${updateGoalDeposit.id}`);
                }
            });
        }); 

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let updateAmount = parseFloat(deposit.value);
            if (checkValue(updateAmount)) {
                alert('Amount cannot be negative/zero.');
                deposit.value = '';
                return;
            }
            updateGoalDeposit.amt = updateAmount;
            sendData(profileForm, updateGoalDeposit, routes[5]);
            clsProfileForm(profileForm);
        });

        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clsProfileForm(profileForm);
        });

        fieldGrp.appendChild(label);
        fieldGrp.appendChild(select);
        fieldGrp.appendChild(deposit);
        profileForm.appendChild(fieldGrp);
        profileForm.appendChild(submitBtn);
        profileForm.appendChild(cancelBtn);

        showForm(profileForm);
    });
}


function removeGoal(e) {
    e.preventDefault();
    if(hasAddedComponents) return;

    const profileForm = document.getElementById('profile-form');
    const fieldGrp = createDiv('form-group');

    getGoals(function(goals) {
        let label = createLabelComponent(labelAttr, 'Delete Goal');
        let submitBtn = createBtnComponent(btnAttr, 'Submit', 'edit-submit', 0),
        cancelBtn = createBtnComponent(btnAttr, 'Cancel', 'edit-cancel', 1);
        let select = createSelectComponent('edit-option', 'goals');
        populateDropdown(select, goals);

        let deleteGoal = {};
        select.addEventListener('change', function() {
            let selected = parseInt(select.value);
            goals.forEach(goal => {
                if(selected === goal.id) {
                    index = getIndex(goal.name);
                    deleteGoal.id = goal.id;
                    deleteGoal.name = goal.name;
                }
            });
        }); 

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendData(profileForm, deleteGoal, routes[4]);
            clsProfileForm(profileForm);
        });

        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clsProfileForm(profileForm);
        });

        fieldGrp.appendChild(label);
        fieldGrp.appendChild(select);
        profileForm.appendChild(fieldGrp);
        profileForm.appendChild(submitBtn);
        profileForm.appendChild(cancelBtn);

        showForm(profileForm);
    });
}


function editGoal(e) {
    e.preventDefault();
    if(hasAddedComponents) return;

    const profileForm = document.getElementById('profile-form');
    const fieldGrp = createDiv('form-group');

    getGoals(function(goals) {
        let editLabel = createLabelComponent(labelAttr, 'Edit Your Goal');
        let editName = createInputComponent(inputAttr, 'new-name', 'Enter Name', 'text'), 
        editDesc = createInputComponent(inputAttr, 'new-desc', 'Enter Description', 'text'),
        editTotal = createInputComponent(inputAttr, 'new-total', 'Enter Updated Amount', 'number');
        let submitBtn = createBtnComponent(btnAttr, 'Submit', 'edit-submit', 0),
        cancelBtn = createBtnComponent(btnAttr, 'Cancel', 'edit-cancel', 1);
        let select = createSelectComponent('edit-option', 'goals');
        populateDropdown(select, goals);
        let goalId;
        select.addEventListener('change', function() {
            let selected = parseInt(select.value);
            goals.forEach(goal => {
                if(selected === goal.id) {
                    index = getIndex(goal.name);
                    goalId = goal.id;
                    editName.value = goal.name;
                    editDesc.value = goal.desc;
                    editTotal.value = parseFloat(goal.total_amt);
                }
            });
        }); 

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!goalId) {
                alert("Select a goal to edit.");
                return;
            }
            
            let editedValues = {
                id: parseInt(goalId),
                name: editName.value,
                desc: editDesc.value,
            };

            if(editTotal.value === "" || checkValue(parseFloat(editTotal.value))) {
                alert('invalid amount.');
                editTotal.value = '';
                return;
            }
            editedValues.total_amt = parseFloat(editTotal.value);

            console.log(`${editedValues.name}, ${editedValues.desc}, ${editedValues.total_amt}`);
            sendData(profileForm, editedValues, routes[1]);
            clsProfileForm(profileForm);
        });

        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clsProfileForm(profileForm);
        });

        fieldGrp.appendChild(editLabel);
        fieldGrp.appendChild(select);
        fieldGrp.appendChild(editName);
        fieldGrp.appendChild(editDesc);
        fieldGrp.appendChild(editTotal);
        profileForm.appendChild(fieldGrp);
        profileForm.appendChild(submitBtn);
        profileForm.appendChild(cancelBtn);

        showForm(profileForm);
    });

}

function createNewGoal(e) {
    e.preventDefault();
    if (hasAddedComponents) return;
    const profileForm = document.getElementById('profile-form');
    const fieldGrp = createDiv('form-group');

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
        sendData(profileForm, newGoal, routes[0]);
        clsProfileForm(profileForm);
    });

    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clsProfileForm(profileForm);
    });

    fieldGrp.appendChild(formLabel);
    fieldGrp.appendChild(gName);
    fieldGrp.appendChild(gDesc);
    fieldGrp.appendChild(gAmt);
    profileForm.appendChild(fieldGrp);
    profileForm.appendChild(document.createElement('br'));
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


function opnDashboardForm(e) {
    e.preventDefault();
    btnPressedId = e.target.id;
    document.getElementById('data-entry').style.display = "block";
}


function clsDashboardForm(e) {
    e.preventDefault();
    document.getElementById('data-entry').style.display = "none";
}


function showDeleteForm(e) {
    e.preventDefault();
    if(hasAddedComponents) return; 

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
        let userData = {
            username: uName
        };
        sendData(profileForm, userData, routes[2]);
        clsProfileForm(profileForm);
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
    if (hasAddedComponents) return;

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
        sendData(profileForm, newPassData, routes[3]);
        clsProfileForm(profileForm);
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