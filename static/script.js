let btnPressedId;
let hasAddedFields = false;
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
    submit.addEventListener('click', function(e){
        e.preventDefault();
        
        let amtIn = parseFloat(document.getElementById('amtField').value);
        if(amtIn < 0) {
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
    });
});

function formatToPHP(amount) {
    return '₱' + amount.toFixed(2);
}

function updateDashboard(inputForm, response) {
    const transactionTable = document.getElementById('transactions-data');
    let displayData = [response.transaction_id, response.date, response.type, formatToPHP(response.amt)];
    const FIELD_COUNT = displayData.length;
    // Reset and Close Input Form
    inputForm.reset();
    document.getElementById('data-entry').style.display = "none";
    // Update User Finances
    document.getElementById('save').innerText = formatToPHP(response.u_savings);
    document.getElementById('spend').innerText = formatToPHP(response.u_spendings);
    document.getElementById('allow').innerText = formatToPHP(response.u_allowance);
    // Update Transaction Table: 
    // TODO - align the first field
    let newEntry = transactionTable.insertRow(transactionTable.rows.length);
    for (let i = 0; i < FIELD_COUNT; i++) {
        let field = newEntry.insertCell(i);
        newEntry.classList.add((i == 0) ? "text-start" : "text-end");
        field.innerText = displayData[i];
    }
}

function showPasswordForm(e) {
    e.preventDefault();
    const profileForm = document.getElementById('profile-form');
    if (hasAddedFields) {
        return;
    }
    let newPass = createInputComponents();
    newPass.setAttribute('id', 'new-pass');
    let confirmPass = createInputComponents();
    confirmPass.setAttribute('id', 'confirm-pass');

    profileForm.appendChild(newPass);
    profileForm.appendChild(confirmPass);
    hasAddedFields = true;
    profileForm.style.display = 'block';
}   

function createInputComponents() {
    let inputAttr = {
        type: 'password',
        required: '',
        class: 'form-control',
        autocomplete: 'off',
    };
    let inputField = document.createElement('input');
    for(attr in inputAttr) {
        inputField.setAttribute(attr, inputAttr[attr]);
    }
    return inputField;
}

function showConfirmDialog(e) {

}
