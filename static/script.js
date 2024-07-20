let btnPressedId;
// Open the popup form
function opnDashboardForm(e) {
    e.preventDefault();
    btnPressedId = e.target.id;
    document.getElementById('data-entry').style.display = "block";
}

// Close the popup form
function clsDashboardForm(e) {
    e.preventDefault();
    document.getElementById('data-entry').style.display = "none";
}

// Extract button ID and the amount, then send to back-end as JSON
window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("data-entry");
    const submit = document.getElementById("sub-btn");
    submit.addEventListener('click', function(e){
        e.preventDefault();
        
        let amtIn = parseFloat(document.getElementById("amtField").value);
        if(amtIn < 0) {
            alert("Amount cannot be of negative value.");
            form.reset();
            return;
        }

        let clientData = [
            {'btnId': btnPressedId, 'amount': amtIn}
        ];

        $.ajax({
            url: '/submit',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(clientData),
            success: function(response) {
                console.log('Response: ' + response);
            },
            error: function(err) {
                console.log('Error: ' + err);
            }
        });
    });
});
