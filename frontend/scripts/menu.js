const menuEditBtn = document.getElementById('menu-edit-btn');

// Load menu on page load
async function loadMenu() {
  try {
    const res = await fetch("/api/menu");
    const data = await res.json();
    if (data.ok) {
      const menu = data.menu;
      const containerBody = document.querySelector('#menu .container-body');
      
      // Clear existing content except the view-all link
      const viewAllLink = containerBody.querySelector('.view-all-link');
      containerBody.innerHTML = '';
      
      let totalItems = 0;
      
      // Add categories
      menu.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'menu-category-title';
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);
        
        // Add items
        category.items.forEach(item => {
          const itemRow = document.createElement('div');
          itemRow.className = 'menu-item-row';
          
          const itemName = document.createElement('span');
          itemName.className = 'menu-item-name';
          itemName.textContent = item.name;
          
          const itemPrice = document.createElement('span');
          itemPrice.className = 'menu-item-price';
          itemPrice.textContent = `$${item.price.toFixed(2)}`;
          
          itemRow.appendChild(itemName);
          itemRow.appendChild(itemPrice);
          categoryDiv.appendChild(itemRow);
          
          totalItems++;
        });
        
        containerBody.appendChild(categoryDiv);
      });
      
      // Add back the view-all link
      containerBody.appendChild(viewAllLink);
      
      // Update badge
      const badge = document.querySelector('#menu .container-badge');
      badge.textContent = `${totalItems} items`;
    }
  } catch (err) {
    console.error("Failed to load menu:", err);
  }
}

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
    if (names.length > 0) {
      names[0].focus();
    }
  } else {
    menuEditBtn.textContent = 'Edit Menu';
  }
});

// Load menu when script runs
loadMenu();