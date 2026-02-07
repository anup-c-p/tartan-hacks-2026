const restaurants = [
  {
    id: "szechuan",
    name: "Szechuan Palace",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
    cuisine: "Chinese",
    price: "$$",
    time: "30-45 min",
    rating: "4.8",
    link: "/szechuan",
    promo: "Free Delivery"
  },
  {
    id: "bella-italia",
    name: "Bella Italia",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    cuisine: "Italian",
    price: "$$$",
    time: "15-25 min",
    rating: "4.6",
    link: "/bella-italia",
    promo: "BOGO Pizza"
  },
  {
    id: "burger-joint",
    name: "Burger Joint",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
    cuisine: "American",
    price: "$",
    time: "30-45 min",
    rating: "4.5",
    link: "/burger-joint",
    promo: "20% Off"
  },
  {
    id: "sushi-zen",
    name: "Sushi Zen",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
    cuisine: "Japanese",
    price: "$$$",
    time: "20-30 min",
    rating: "4.9",
    link: "/sushi-zen"
  },
  {
    id: "taco-fiesta",
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    cuisine: "Mexican",
    price: "$",
    time: "15-25 min",
    rating: "4.7",
    link: "/taco-fiesta"
  },
  {
    id: "green-leaf",
    name: "Green Leaf",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    cuisine: "Salad",
    price: "$$",
    time: "10-20 min",
    rating: "4.8",
    link: "/green-leaf"
  },
  {
    id: "curry-house",
    name: "Curry House",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=600&h=400&fit=crop",
    cuisine: "Indian",
    price: "$$",
    time: "30-40 min",
    rating: "4.6",
    link: "/curry-house"
  },
  {
    id: "steakhouse",
    name: "The Steakhouse",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop",
    cuisine: "Steak",
    price: "$$$$",
    time: "45-60 min",
    rating: "4.9",
    link: "/steakhouse"
  },
  {
    id: "morning-brew",
    name: "Morning Brew",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    cuisine: "Cafe",
    price: "$",
    time: "10-20 min",
    rating: "4.5",
    link: "/morning-brew"
  },
  {
    id: "pizza-slice",
    name: "Pizza Slice",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    cuisine: "Pizza",
    price: "$",
    time: "15-25 min",
    rating: "4.3",
    link: "/pizza-slice"
  }
];

function getFavorites() {
  const favs = localStorage.getItem('plato_favorites');
  return favs ? JSON.parse(favs) : [];
}

function toggleFavorite(event, id) {
  event.preventDefault(); // Prevent link navigation
  event.stopPropagation(); // Stop event bubbling

  let favs = getFavorites();
  const index = favs.indexOf(id);

  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push(id);
  }

  localStorage.setItem('plato_favorites', JSON.stringify(favs));
  updateHeartIcons();

  // If on favorites page, re-render
  if (window.location.pathname === '/favorites') {
    renderFavoritesPage();
  }
}

function updateHeartIcons() {
  const favs = getFavorites();
  document.querySelectorAll('.heart-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (favs.includes(id)) {
      btn.classList.add('active');
      btn.innerHTML = '❤️'; // Filled heart
      btn.style.color = 'red';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '🤍'; // Empty heart (using white heart emoji for visibility or outline SVG)
      // Using SVG for better control
      btn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(0,0,0,0.5); stroke: white;">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
             `;
      btn.style.color = 'inherit';
    }

    // If active (favorited), verify styling
    if (favs.includes(id)) {
      btn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4d4d" stroke="#ff4d4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
             `;
    }
  });
}

function renderFavoritesPage() {
  const container = document.getElementById('favorites-grid');
  if (!container) return;

  constfavs = getFavorites();
  const favs = getFavorites();
  const favRestaurants = restaurants.filter(r => favs.includes(r.id));

  if (favRestaurants.length === 0) {
    container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); margin-top: 40px;">
                <p>No favorites yet!</p>
                <a href="/customer" class="btn btn-primary" style="margin-top: 16px; display: inline-block;">Explore Food</a>
            </div>
        `;
    return;
  }

  container.innerHTML = favRestaurants.map(r => `
        <a href="${r.link}" style="text-decoration: none;" class="restaurant-link">
            <div class="restaurant-card" style="position: relative;">
                <button class="heart-btn active" data-id="${r.id}" onclick="toggleFavorite(event, '${r.id}')" 
                    style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4d4d" stroke="#ff4d4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <img src="${r.image}" class="restaurant-img" alt="${r.name}" style="height: 140px; width: 100%; object-fit: cover; background-color: #eee;">
                <div style="padding: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px; color: var(--text-primary);">${r.name}</div>
                        <div style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 12px; color: black;">${r.rating}</div>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary);">
                        ${r.cuisine} • ${r.price} • ${r.time}
                    </div>
                    ${r.promo ? `
                    <div style="margin-top: 10px; font-size: 12px; color: var(--accent); background: var(--accent-light); display: inline-block; padding: 4px 8px; border-radius: 4px;">
                        ${r.promo}
                    </div>` : ''}
                </div>
            </div>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeartIcons();
  if (window.location.pathname === '/favorites') {
    renderFavoritesPage();
  }
});
