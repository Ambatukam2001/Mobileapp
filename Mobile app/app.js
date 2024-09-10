document.addEventListener('DOMContentLoaded', () => {
  const itemsContainer = document.getElementById('items-container');
  const editFormContainer = document.getElementById('edit-form-container');
  const editForm = document.getElementById('editForm');
  const editName = document.getElementById('editName');
  const editBrand = document.getElementById('editBrand');
  const editPrice = document.getElementById('editPrice');
  const editWeight = document.getElementById('editWeight');
  const editQuantity = document.getElementById('editQuantity');
  const editStore = document.getElementById('editStore');
  const editCategory = document.getElementById('editCategory');
  const editImage = document.getElementById('editImage');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutMessage = document.getElementById('checkout-message');

  let items = [
    { name: 'Apples', brand: 'FreshFarm', price: 1.99, weight: '1kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Produce', image: 'image/apple.png' },
    { name: 'Milk', brand: 'Organic Valley', price: 3.99, weight: '1L', quantity: '1 bottle', store: 'Ambatogrocery', category: 'Dairy', image: 'image/milk.png' },
    { name: 'Bananas', brand: 'FreshLand', price: 2.49, weight: '1kg', quantity: '3 bunches', store: 'Ambatogrocery', category: 'Produce', image: 'image/banana.png' },
    { name: 'Eggs', brand: 'HappyHens', price: 4.29, weight: '12 pcs', quantity: '1 dozen', store: 'Ambatogrocery', category: 'Dairy', image: 'image/egg.png' },
    { name: 'Orange', brand: 'FreshFarm', price: 1.79, weight: '1kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Produce', image: 'image/orange.png' },
    { name: 'Chocolate', brand: 'FreshFarm', price: 12.79, weight: '2kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Diary', image: 'image/choco.png' },
  ];

  let cart = [];
  let editingIndex = null;

  function displayItems(filteredItems = items) {
    itemsContainer.innerHTML = '';
    filteredItems.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.innerHTML = `
        <img src="${item.image || '/image/banana.png'}" alt="${item.name}" class="product-image">
        <p><strong>Product Name:</strong> ${item.name}</p>
        <p><strong>Brand:</strong> ${item.brand}</p>
        <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
        <p><strong>Weight/Volume:</strong> ${item.weight}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Store:</strong> ${item.store}</p>
        <p><strong>Category:</strong> ${item.category}</p>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="add-to-cart-btn" data-index="${index}">Add to Cart</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      itemsContainer.appendChild(itemDiv);
    });
  }
  
  function openEditForm(index) {
    const item = items[index];
    editingIndex = index;
    editName.value = item.name;
    editBrand.value = item.brand;
    editPrice.value = item.price;
    editWeight.value = item.weight;
    editQuantity.value = item.quantity;
    editStore.value = item.store;
    editCategory.value = item.category;
    editImage.value = '';
    editFormContainer.classList.remove('hidden');
  }

  function saveEdit(e) {
    e.preventDefault();
    if (editingIndex !== null) {
      const item = items[editingIndex];
      item.name = editName.value;
      item.brand = editBrand.value;
      item.price = parseFloat(editPrice.value);
      item.weight = editWeight.value;
      item.quantity = editQuantity.value;
      item.store = editStore.value;
      item.category = editCategory.value;

      const file = editImage.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          item.image = event.target.result;
          displayItems();
        };
        reader.readAsDataURL(file);
      } else {
        displayItems();
      }

      editFormContainer.classList.add('hidden');
      editingIndex = null;
    }
  }

  function addToCart(index) {
    const item = items[index];
    const existingCartItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (existingCartItem) {
      existingCartItem.quantity = `${parseInt(existingCartItem.quantity) + parseInt(item.quantity)} units`;
    } else {
      cart.push({ ...item });
    }

    updateCart();
  }

  function removeItem(index) {
    items.splice(index, 1);
    displayItems();
  }

  function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(cartItem => {
      const itemDiv = document.createElement('li');
      itemDiv.innerHTML = `
        <p><strong>Product Name:</strong> ${cartItem.name}</p>
        <p><strong>Quantity:</strong> ${cartItem.quantity}</p>
        <p><strong>Price:</strong> $${cartItem.price.toFixed(2)}</p>
      `;
      cartItems.appendChild(itemDiv);
      total += cartItem.price;
    });
    cartTotal.textContent = total.toFixed(2);
  }

  function searchItems() {
    const query = searchInput.value.toLowerCase();
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.store.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    displayItems(filteredItems);
  }

  function handleCheckout() {
    cart = [];
    updateCart();
    checkoutMessage.classList.remove('hidden');
    setTimeout(() => checkoutMessage.classList.add('hidden'), 3000);
  }

  searchBtn.addEventListener('click', searchItems);
  searchInput.addEventListener('keyup', searchItems);

  checkoutBtn.addEventListener('click', handleCheckout);

  itemsContainer.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (e.target.classList.contains('edit-btn')) {
      openEditForm(index);
    } else if (e.target.classList.contains('add-to-cart-btn')) {
      addToCart(index);
    } else if (e.target.classList.contains('remove-btn')) {
      removeItem(index);
    }
  });

  editForm.addEventListener('submit', saveEdit);

  displayItems();
});
