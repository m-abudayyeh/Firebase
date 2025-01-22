import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCF5CmAmVHjAjoZ3ChiQxlr95HeGu5S3U4",
    authDomain: "fire-store-a56dc.firebaseapp.com",
    projectId: "fire-store-a56dc",
    storageBucket: "fire-store-a56dc.firebasestorage.app",
    messagingSenderId: "912417364693",
    appId: "1:912417364693:web:953af605fa18b65a23205c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add Product
async function addProduct(event) {
    event.preventDefault();
    const photo = document.getElementById("img").value;
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("dec").value;

    await addDoc(collection(db, "products"), { photo, title, price, description });
    alert("Product added successfully!");
    displayProducts();
}

// Display Products
async function displayProducts() {
    const productsContainer = document.getElementById("productsRow");
    productsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach(docSnap => {
        const product = docSnap.data();
        const productId = docSnap.id;
        productsContainer.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${product.photo}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text fw-bold">Price: $${product.price}</p>
                        <div class="d-flex justify-content-between">
                           <button class="btn btn-warning btn-sm edit-btn" data-id="${productId}">Edit</button>
                           <button class="btn btn-danger btn-sm delete-btn" data-id="${productId}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });


    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            editProduct(productId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            deleteProduct(productId);
        });
    });

}

// Delete Product
async function deleteProduct(productId) {
    await deleteDoc(doc(db, "products", productId));
    alert("Product deleted successfully!");
    displayProducts();
}

// Edit Product
async function editProduct(productId) {
    const newTitle = prompt("Enter new title:");
    const newDescription = prompt("Enter new description:");
    const newPrice = prompt("Enter new price:");

    if (newTitle && newDescription && newPrice) {
        await updateDoc(doc(db, "products", productId), {
            title: newTitle,
            description: newDescription,
            price: newPrice
        });
        alert("Product updated successfully!");
        displayProducts();
    }
}



// Event Listener
const form = document.getElementById("productForm");
form.addEventListener("submit", addProduct);

document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
});

