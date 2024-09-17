// Wait for the entire DOM to load before executing the script
document.addEventListener('DOMContentLoaded', () => {

  // Grab the element that will display the list of items
  const itemsContainer = document.getElementById('items-container');
  const sortOptions = document.getElementById('sort-options');

  // Grab the form container for editing items
  const editFormContainer = document.getElementById('edit-form-container');
  
  // Grab the actual form used for editing an item
  const editForm = document.getElementById('editForm');

  // Grab various input fields for editing an item's properties
  const editName = document.getElementById('editName');
  const editBrand = document.getElementById('editBrand');
  const editPrice = document.getElementById('editPrice');
  const editWeight = document.getElementById('editWeight');
  const editQuantity = document.getElementById('editQuantity');
  const editStore = document.getElementById('editStore');
  const editCategory = document.getElementById('editCategory');
  const editImage = document.getElementById('editImage');

  // Grab the cart items list and total price display elements
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  // Grab the search input and button elements
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // Grab the checkout button and message container
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutMessage = document.getElementById('checkout-message');

  // Array to store the items available in the grocery store
  let items = [
    // Example item objects with properties like name, brand, price, etc.
    { name: 'Apples', brand: 'FreshFarm', price: 1.99, weight: '1kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Produce', image: 'image/apple.png' },
    { name: 'Milk', brand: 'Organic Valley', price: 3.99, weight: '1L', quantity: '1 bottle', store: 'Ambatogrocery', category: 'Dairy', image: 'image/milk.png' },
    { name: 'Bananas', brand: 'FreshLand', price: 2.49, weight: '1kg', quantity: '3 bunches', store: 'Ambatogrocery', category: 'Produce', image: 'image/banana.png' },
    { name: 'Eggs', brand: 'HappyHens', price: 4.29, weight: '12 pcs', quantity: '1 dozen', store: 'Ambatogrocery', category: 'Dairy', image: 'image/egg.png' },
    { name: 'Orange', brand: 'FreshFarm', price: 1.79, weight: '1kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Produce', image: 'image/orange.png' },
    { name: 'Chocolate', brand: 'FreshFarm', price: 12.79, weight: '2kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Diary', image: 'image/choco.png' },
  ];

  // Array to store items added to the cart
  let cart = [];

  // Variable to keep track of the item being edited (by index)
  let editingIndex = null;

  // Function to display items in the itemsContainer
  function displayItems(filteredItems = items) {
    itemsContainer.innerHTML = ''; // Clear current items
    filteredItems.forEach((item, index) => { // Iterate over each item
      const itemDiv = document.createElement('div'); // Create a div for each item
      itemDiv.classList.add('item'); // Add a class for styling
      // Populate the item div with item details and buttons
      itemDiv.innerHTML = `
        <img src="${item.image || '/image/banana.png'}" alt="${item.name}" class="product-image">
        <div class="product-item">
          <p><strong>Product Name:</strong> ${item.name}</p>
          <p><strong>Brand:</strong> ${item.brand}</p>
          <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
          <p><strong>Weight/Volume:</strong> ${item.weight}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          <p><strong>Store:</strong> ${item.store}</p>
          <p><strong>Category:</strong> ${item.category}</p>
        </div>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="add-to-cart-btn" data-index="${index}">Add to Cart</button>
      `;
      itemsContainer.appendChild(itemDiv); // Append the item div to the container
    });
  }

   // Function to sort items based on selected criteria
   function sortItems(criteria) {
    let sortedItems = [...items]; // Create a copy of the items array

    switch (criteria) {
      case 'name':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
        break;
      case 'price-asc':
        sortedItems.sort((a, b) => a.price - b.price); // Sort by price (low to high)
        break;
      case 'price-desc':
        sortedItems.sort((a, b) => b.price - a.price); // Sort by price (high to low)
        break;
      case 'category':
        sortedItems.sort((a, b) => a.category.localeCompare(b.category)); // Sort alphabetically by category
        break;
      default:
        break;
    }
    displayItems(sortedItems); // Display the sorted items
  }

  // Function to open the edit form for a specific item
  function openEditForm(index) {
    const item = items[index]; // Get the item to be edited
    editingIndex = index; // Save the index of the item being edited
    // Populate the form inputs with the item's details
    editName.value = item.name;
    editBrand.value = item.brand;
    editPrice.value = item.price;
    editWeight.value = item.weight;
    editQuantity.value = item.quantity;
    editStore.value = item.store;
    editCategory.value = item.category;
    editImage.value = ''; // Clear the image input field
    // Show the edit form
    editFormContainer.classList.remove('hidden');
  }

  // Function to save the edits made to the item
  function saveEdit(e) {
    e.preventDefault(); // Prevent the form from submitting
    if (editingIndex !== null) { // Check if an item is being edited
      const item = items[editingIndex]; // Get the item being edited
      // Update the item's details with the form inputs
      item.name = editName.value;
      item.brand = editBrand.value;
      item.price = parseFloat(editPrice.value);
      item.weight = editWeight.value;
      item.quantity = editQuantity.value;
      item.store = editStore.value;
      item.category = editCategory.value;

      // Handle updating the image if a new file is uploaded
      const file = editImage.files[0];
      if (file) {
        const reader = new FileReader(); // Create a FileReader to read the image
        reader.onload = function(event) {
          item.image = event.target.result; // Set the item's image to the uploaded image
          displayItems(); // Redisplay the updated items
        };
        reader.readAsDataURL(file); // Read the image file as a data URL
      } else {
        displayItems(); // Redisplay items without changing the image
      }

      // Hide the edit form after saving
      editFormContainer.classList.add('hidden');
      editingIndex = null; // Reset the editing index
    }
  }

  // Function to add an item to the cart
  function addToCart(index) {
    const item = items[index]; // Get the selected item
    const existingCartItem = cart.find(cartItem => cartItem.name === item.name); // Check if item is already in the cart
    
    // If the item is already in the cart, update the quantity
    if (existingCartItem) {
      existingCartItem.quantity = `${parseInt(existingCartItem.quantity) + parseInt(item.quantity)} units`;
    } else {
      cart.push({ ...item }); // If not, add the item to the cart
    }

    updateCart(); // Update the cart display
  }

  // Function to remove an item from the cart
  function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart array
    updateCart(); // Update the cart display
  }

  // Function to remove an item from the list of available items
  function removeItem(index) {
    items.splice(index, 1); // Remove the item from the items array
    displayItems(); // Redisplay the remaining items
  }

  // Function to update the cart display
  function updateCart() {
    cartItems.innerHTML = ''; // Clear the current cart display
    let total = 0; // Initialize the total price
    cart.forEach((cartItem, index) => { // Iterate over each cart item
      const itemDiv = document.createElement('li'); // Create a list item for each cart item
      // Populate the cart item with details
      itemDiv.innerHTML = `
        <p><strong>Product Name:</strong> ${cartItem.name}</p>
        <p><strong>Quantity:</strong> ${cartItem.quantity}</p>
        <p><strong>Price:</strong> $${cartItem.price.toFixed(2)}</p>
        <button class="remove-from-cart-btn" data-index="${index}">Delete</button>
      `;
      cartItems.appendChild(itemDiv); // Append the cart item to the cart display
      total += cartItem.price; // Add the price to the total
    });
    cartTotal.textContent = total.toFixed(2); // Update the total price display
  }

  // Function to search items based on the search input
  function searchItems() {
    const query = searchInput.value.toLowerCase(); // Get the search query and convert to lowercase
    // Filter the items based on whether their name, brand, store, or category matches the query
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.store.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    displayItems(filteredItems); // Display the filtered items
  }

  // Function to handle checkout and clear the cart
  function handleCheckout() {
    cart = []; // Empty the cart
    updateCart(); // Update the cart display
    checkoutMessage.classList.remove('hidden'); // Show a checkout success message
    setTimeout(() => checkoutMessage.classList.add('hidden'), 3000); // Hide the message after 3 seconds
  }

  // Add event listeners to handle searching and checkout
  searchBtn.addEventListener('click', searchItems);
  searchInput.addEventListener('keyup', searchItems);

  checkoutBtn.addEventListener('click', handleCheckout);

  // Add event listener to handle item clicks for editing, adding to cart, or removing
  itemsContainer.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index'); // Get the index of the clicked item
    if (e.target.classList.contains('edit-btn')) {
      openEditForm(index); // Open the edit form if the "Edit" button was clicked
    } else if (e.target.classList.contains('add-to-cart-btn')) {
      addToCart(index); // Add to cart if the "Add to Cart" button was clicked
    } else if (e.target.classList.contains('remove-btn')) {
      removeItem(index); // Remove the item if the "Remove" button was clicked
    }
  });

  // Add event listener to handle removing items from the cart
  cartItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-from-cart-btn')) {
      const index = e.target.getAttribute('data-index'); // Get the index of the cart item
      removeFromCart(index); // Remove the item from the cart
    }
  });

  // Add event listener to handle saving edits when the form is submitted
  editForm.addEventListener('submit', saveEdit);

  // Event listener for sorting
  sortOptions.addEventListener('change', (e) => {
    const selectedCriteria = e.target.value; // Get the selected sort option
    sortItems(selectedCriteria); // Call the sorting function with the selected criteria
  });

  // Initial display of items
  displayItems(); 
});
