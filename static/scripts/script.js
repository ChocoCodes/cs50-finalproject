let btnPressedId;
let hasAddedComponents = false;
let isPasswordVisible = false;

const changeVisibility = () => {
    const passField =  document.getElementById("pass");
    const toggle = document.getElementById("password-toggle")
    isPasswordVisible = !isPasswordVisible;
    passField.type = isPasswordVisible ? "text" : "password";
    toggle.innerHTML = isPasswordVisible ? 
    `<path d="M2 8C2 8 6.47715 3 12 3C17.5228 3 22 8 22 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M21.544 13.045C21.848 13.4713 22 13.6845 22 14C22 14.3155 21.848 14.5287 21.544 14.955C20.1779 16.8706 16.6892 21 12 21C7.31078 21 3.8221 16.8706 2.45604 14.955C2.15201 14.5287 2 14.3155 2 14C2 13.6845 2.15201 13.4713 2.45604 13.045C3.8221 11.1294 7.31078 7 12 7C16.6892 7 20.1779 11.1294 21.544 13.045Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z" stroke="currentColor" stroke-width="1.5" />
    ` : 
    `<path d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M3 3L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    `;
}

const formatToPHP = (amount) => `₱${amount.toFixed(2)}`;

const checkValue = (amount) => amount <= 0.0;

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
            const transactionTable = document.getElementById('transactions-data');
            const table = document.getElementById('goals-table');
            if (url == '/submit') {
                const updatedFinances = [formatToPHP(response.u_savings), formatToPHP(response.u_spendings), formatToPHP(response.u_allowance)];
                const updatedTransactions = [response.transaction_id, response.date, response.type, formatToPHP(response.amt)];
                updateDisplayFinances(updatedFinances);
                updateDisplayTable(transactionTable, form, updatedTransactions);
            }
            if (url == '/create_new') {
                const updatedGoals = [response.name, response.desc, formatToPHP(response.total_amt), formatToPHP(response.curr_dep), response.progress];
                updateDisplayTable(table, form, updatedGoals);
            }
            if (url == '/update') {
                table.rows[index].cells[3].innerText = formatToPHP(response.curr_dep);
                table.rows[index].cells[4].innerText = response.progress;
            }  
            if (url == '/edit_goal') {
                table.rows[index].cells[0].innerText = response.name;
                table.rows[index].cells[1].innerText = response.desc;
                table.rows[index].cells[2].innerText = formatToPHP(response.total_amt);
            }
            if (url == '/change') alert('Password changed successfully!');
            if (url == '/delete') window.location.href = "/login";
            if (url == '/remove') document.getElementById('goals-table').deleteRow(index);
        },
        error: function(err) {
            e = JSON.stringify(err);
            alert('Error: ' + e) 
        }
    });
}

// Update User Finances
function updateDisplayFinances(financeData) {
    hasAddedComponents = false;
    const displayId = ['save', 'spend', 'allow'];
    for (let i = 0; i < displayId.length; i++) {
        document.getElementById(displayId[i]).innerText = financeData[i];
    }
}

// Update Tables
function updateDisplayTable(table, form, tableData) {
    hasAddedComponents = false;
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


function getIndex(name) {
    const table = document.getElementById('goals-table');
    rows = table.rows;
    for(let i = 0; i < rows.length; i++) {
        let cells = rows[i].cells;
        for(let j = 0; j < cells.length; j++) {
            if(cells[j].innerText === name) {
                return i;
            }
        }
    }
    return -1;
}   