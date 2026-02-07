const menuEditBtn = document.getElementById('menu-edit-btn');

menuEditBtn.addEventListener('click', () => {
  menuEditBtn.classList.toggle('editing');
  const isEditing = menuEditBtn.classList.contains('editing');

  var names = document.querySelectorAll('.menu-item-name');
  var prices = document.querySelectorAll('.menu-item-price');

  for (var i = 0; i < names.length; i++) {
    names[i].toggleAttribute('contenteditable');
    prices[i].toggleAttribute('contenteditable');
  }

  if (isEditing) {
    menuEditBtn.textContent = 'Save';
    names[0].focus();
  } else {
    menuEditBtn.textContent = 'Edit Menu';
  }
});