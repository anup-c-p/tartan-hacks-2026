/* --- Store Info --- */
const storeInfo = document.getElementById('store-info');
const editStoreInfo = document.getElementById('edit-store-info');

editStoreInfo.addEventListener('click', () => {
    console.log('Edit Store Info');
    editStoreInfo.classList.toggle('editing');
    const isEditing = editStoreInfo.classList.contains('editing');

    editStoreInfo.innerText = isEditing ? 'Save' : 'Edit';

    const values = storeInfo.querySelectorAll('.info-value');
    values.forEach(e => {
        e.toggleAttribute('contenteditable');
    });
    values[0].focus();

    if (!isEditing) {
        // TODO @anup-c-p: save store info
    }
});