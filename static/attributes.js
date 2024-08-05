function testDebugPrint1(e) {
    e.preventDefault();
    console.log('test-attributes');
}

let inputAttr = {
    id: '',
    type: '',
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