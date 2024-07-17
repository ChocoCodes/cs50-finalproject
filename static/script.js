function opnDashboardForm(e) {
    e.preventDefault();
    console.log('0');
    document.getElementById('data-entry').style.display = "block";
}

function clsDashboardForm(e) {
    e.preventDefault();
    console.log('1');
    document.getElementById('data-entry').style.display = "none";
}