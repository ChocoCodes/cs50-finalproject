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
            let clientData = {
                btn_id: btnPressedId, 
                amt: amtIn
            };
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
                const transactionTable = document.getElementById('transactions-data');
                const updatedFinances = [formatToPHP(response.u_savings), formatToPHP(response.u_spendings), formatToPHP(response.u_allowance)];
                const updatedTransactions = [response.transaction_id, response.date, response.type, formatToPHP(response.amt)];
                updateDisplayFinances(updatedFinances);
                updateDisplayTable(transactionTable, form, updatedTransactions);
            }
            if (url == '/create_new') {
                const goalsTable = document.getElementById('goals-table');
                const updatedGoals = [response.name, response.desc, formatToPHP(response.total_amt), formatToPHP(response.curr_dep), response.progress];
                updateDisplayTable(goalsTable, form, updatedGoals);
            }
            if (url == '/change') alert('Password changed successfully!');
            if (url == '/delete') window.location.href = "/login";
        },
        error: function(err) {
            e = JSON.stringify(err);
            alert('Error: ' + e) 
        }
    });
}


function formatToPHP(amount) {
    return '₱' + amount.toFixed(2);
}

function checkValue(amount) {
    return amount <= 0.0;
}

// Update User Finances
function updateDisplayFinances(financeData) {
    const displayId = ['save', 'spend', 'allow'];
    for (let i = 0; i < displayId.length; i++) {
        document.getElementById(displayId[i]).innerText = financeData[i];
    }
}

// Update Tables
function updateDisplayTable(table, form, tableData) {
    form.reset();
    form.style.display = "none";
    const FIELD_COUNT = tableData.length;
    let newEntry = table.insertRow(table.rows.length);
    for (let i = 0; i < FIELD_COUNT; i++) {
        let field = newEntry.insertCell(i);
        field.classList.add((i == 0) ? "text-start" : "text-end");
        field.innerText = tableData[i];
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


function getGoals(request) {
    $.ajax({
        url: '/goal_data',
        method: 'GET',
        success: function(response) {
            console.log(response); // DB 
            request(response);
        }
    });
}