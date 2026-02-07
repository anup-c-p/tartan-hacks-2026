/* --- Store Info --- */
const storeInfo = document.getElementById('store-info');
const editStoreInfo = document.getElementById('edit-store-info');

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

function setEditing(isEditing) {
  editStoreInfo.classList.toggle('editing', isEditing);
  editStoreInfo.innerText = isEditing ? 'Save' : 'Edit';

  const values = storeInfo.querySelectorAll('.info-value');
  values.forEach(el => {
    if (isEditing) el.setAttribute('contenteditable', 'true');
    else el.removeAttribute('contenteditable');
  });

  if (isEditing) values[0]?.focus();
}

async function saveStoreInfo() {
  const values = storeInfo.querySelectorAll('.info-value');

  const payload = {
    name: values[0].textContent.trim(),
    description: values[1].textContent.trim(),
    categories: values[2].textContent.trim(),
    tags: values[3].textContent.trim(),
    priceRange: values[4].textContent.trim(),
    address: values[5].textContent.trim(),
    phone: values[6].textContent.trim()
  };

  // basic UI lock
  editStoreInfo.disabled = true;
  const oldLabel = editStoreInfo.innerText;
  editStoreInfo.innerText = "Saving...";

  try {
    const res = await fetch("/api/update-store-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error("Failed to save store info:", await res.text());
      // revert UI back to editing state so they don’t lose their cursor unexpectedly
      editStoreInfo.innerText = oldLabel;
      return false;
    }

    // success
    return true;
  } catch (err) {
    console.error("Error saving store info:", err);
    editStoreInfo.innerText = oldLabel;
    return false;
  } finally {
    editStoreInfo.disabled = false;
  }
}

editStoreInfo.addEventListener('click', async () => {
  const isEditing = editStoreInfo.classList.contains('editing');

  if (!isEditing) {
    // Enter edit mode
    setEditing(true);
    return;
  }

  // Leaving edit mode => SAVE
  const ok = await saveStoreInfo();
  if (ok) {
    setEditing(false);
  }
});

loadStoreInfo();
