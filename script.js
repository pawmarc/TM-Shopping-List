const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('#filter');
const addBtn = document.querySelector('.btn[type="submit"]')
let isEditMode = false;


function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function addItem(e) {
    e.preventDefault();

    const itemToEdit = itemList.querySelector(".edit-mode");
    const newItem = itemInput.value;

    if (newItem === '') {
        alert("Please add an item");
        return;
    }

    // ! added NEW
    if (checkIfExists(newItem)) {
        alert("That item already exists!");
        if (itemToEdit) {
            itemToEdit.classList.remove("edit-mode");

        }
        checkUI();
        return;
    }


    if (isEditMode) {

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();

    }
    // add to DOM
    addItemToDOM(newItem);

    // add to localStorage
    addToLocalStorage(newItem)

    checkUI();
}
function onAddItemSubmit(e) {
    e.preventDefault();

    const itemToEdit = itemList.querySelector(".edit-mode");
    const newItem = itemInput.value;

    // Validate Input
    if (newItem === "") {
        alert("Please add an item");
        return;
    }

    if (checkIfItemExists(newItem)) {
        alert("That item already exists!");
        itemToEdit.classList.remove("edit-mode");
        isEditMode = false;
        checkUI();
        return;
    }

    // Check for edit mode
    if (isEditMode) {
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;
    }
    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";
}


function addItemToDOM(newItem) {
    const newLi = document.createElement('li');
    newLi.className = "item";
    const textNode = document.createTextNode(newItem);
    newLi.appendChild(textNode);

    const button = createButton('remove-item btn-link text-red');
    newLi.appendChild(button);
    itemList.appendChild(newLi);
}



function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    "remove-item btn-link text-red";
    return button;
}
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;

    return icon;
}
function onClickItem(e) {
    if (e.target.parentNode.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        if(e.target.id === 'item-list'){
            return;
        }
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    isEditMode = true;
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.classList.remove('edit-mode');
    })
    addBtn.style.backgroundColor = "#228B22";
    addBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item"
    item.classList.add('edit-mode');
    itemInput.value = item.textContent;
    itemInput.focus();
}

function removeItem(listItemToRemove) {

    if (confirm('Are you sure?')) {
        listItemToRemove.remove();
        removeItemFromStorage(listItemToRemove.textContent)
    }

    checkUI();
}

function clearAll() {
    if (!confirm('Are you sure you want to delete all?')) {
        return;
    }
    while (itemList.firstChild) {
        itemList.firstChild.remove();
    }
    localStorage.clear();
    checkUI();
}

function checkUI() {
    itemInput.value = '';
    const items = document.querySelectorAll('.item');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    addBtn.style.backgroundColor = "#333";
    isEditMode = false;
}

function filterItems(e) {
    const listItems = document.querySelectorAll('.item');
    const filterText = e.target.value.toLowerCase();
    listItems.forEach(item => {
        const itemName = item.firstChild.textContent.trim().toLowerCase();
        console.log(itemName.indexOf(filterText));
        if (itemName.indexOf(filterText) != -1) {
            item.style.display = 'flex';
            return;
        }
        item.style.display = 'none';
    })
}

function checkIfExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

// LOCAL STORAGE ---->
function addToLocalStorage(newItem) {
    const items = getItemsFromStorage();

    if (items === null) {
        items = [];
    }
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
}

function removeItemFromStorage(itemName) {
    const items = getItemsFromStorage();

    if (items === null) {
        return;
    }
    const newItems = items.filter(item => item !== itemName);
    localStorage.setItem('items', JSON.stringify(newItems));
}

function getItemsFromStorage() {
    let items = JSON.parse(localStorage.getItem('items'));
    if (items === null) items = [];

    return items;
}
// LOCAL STORAGE END <----

// Initialize the app
function init() {
    itemForm.addEventListener('submit', addItem);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearAll);
    filter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();