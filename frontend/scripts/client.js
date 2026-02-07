/* --- Store Info --- */
const storeInfo = document.getElementById('store-info');
const editStoreInfo = document.getElementById('edit-store-info');

editStoreInfo.addEventListener('click', () => {
    if (editStoreInfo.classList.contains('editing')) {
        // TODO @anup-c-p: save store info
    } else {
        storeInfo.querySelectorAll('.info-value');
    }

    editStoreInfo.classList.toggle('editing');
});

let storeData = {
  Name: ''
  Description: ''
  Cuisine: ''
  Adress: ''
  Phone: ''
}

let storeFieldConfig = {
  Name: ''
  Description: ''
  Cuisine: ''
  Adress: ''
  Phone: ''
}

