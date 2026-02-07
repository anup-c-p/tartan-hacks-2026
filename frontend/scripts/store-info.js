/* --- Store Info --- */
const storeInfo = document.getElementById('store-info');
const editStoreInfo = document.getElementById('edit-store-info');

// Load store info on page load
async function loadStoreInfo() {
  try {
    const res = await fetch("/api/store-info");
    const data = await res.json();
    if (data.ok) {
      const info = data.info;
      const values = storeInfo.querySelectorAll('.info-value');
      values[0].textContent = info.name;
      values[1].textContent = info.description;
      values[2].textContent = info.categories;
      values[3].textContent = info.tags;
      values[4].textContent = info.priceRange;
      values[5].textContent = info.address;
      values[6].textContent = info.phone;
    }
  } catch (err) {
    console.error("Failed to load store info:", err);
  }
}

editStoreInfo.addEventListener('click', async () => {
    console.log('Edit Store Info');
    editStoreInfo.classList.toggle('editing');
    const isEditing = editStoreInfo.classList.contains('editing');

    editStoreInfo.innerText = isEditing ? 'Save' : 'Edit';

    const values = storeInfo.querySelectorAll('.info-value');
    values.forEach(e => {
        e.toggleAttribute('contenteditable');
    });
    if (isEditing) {
        values[0].focus();
    } else {
        // Save the changes
        const updatedInfo = {
            name: values[0].textContent.trim(),
            description: values[1].textContent.trim(),
            categories: values[2].textContent.trim(),
            tags: values[3].textContent.trim(),
            priceRange: values[4].textContent.trim(),
            address: values[5].textContent.trim(),
            phone: values[6].textContent.trim()
        };

        try {
            const res = await fetch("/api/update-store-info", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedInfo)
            });
            if (!res.ok) {
                console.error("Failed to save store info");
            } else {
                console.log("Store info saved");
            }
        } catch (err) {
            console.error("Error saving store info:", err);
        }
    }
});

// Load store info when script runs
loadStoreInfo();