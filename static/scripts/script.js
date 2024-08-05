let btnPressedId;
let hasAddedComponents = false;


// Extract button ID and the amount, then send to back-end as JSON
window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('data-entry');
    const submit = document.getElementById('sub-btn');
    const url = '/submit';
    if (submit) {
        submit.addEventListener('click', function(e){
            e.preventDefault();
            let amtIn = parseFloat(document.getElementById('amtField').value);
            if (checkValue(amtIn)) {
                alert('Amount cannot be 0 or less.');
                form.reset();
                return;
            }
            // TODO: Send as a single object not array of objects
            let clientData = [{
                btnId: btnPressedId, 
                amount: amtIn
            }];
            sendData(form, clientData, url);
        });
    }
});


function sendData(form, data, url) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (url == '/submit') {
                console.log('Response Converted: ' + JSON.stringify(response)); // DB
                updateDashboard(form, response);
            }
            if (url == '/create_new') console.log(data);
            if (url == '/change') alert('Password changed successfully!');
            if (url == '/delete') window.location.href = "/login";
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

function checkValue(amount) {
    return amount <= 0.0;
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


function checkPassReq(newPass, confPass) {
    if (newPass === '' || confPass === '') return false;
    if (!(newPass === confPass)) return false;
    const charReq = ['+', '-', '#', '!', '?', '_', '@', '%', '&', '*'];
    let charCtr = 0, numCtr = 0, len = newPass.length;

    for (let i = 0; i < len; i++) {
        if (charReq.includes(newPass[i])) charCtr++;
        if (!isNaN(newPass[i])) numCtr++;
    }
    return !((charCtr === 0 && numCtr === 0) || len < 8);
}


