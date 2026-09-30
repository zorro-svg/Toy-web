/* =====================================
   TOY HAVEN JAVASCRIPT
   One file shared by every page. Each
   function checks that its elements exist
   on the page before it does any work.
===================================== */

/* Tells the CSS that JavaScript is running (used by scroll reveal) */
document.documentElement.classList.add("js");


/* =====================================
   SETTINGS
===================================== */

const FREE_DELIVERY_LIMIT = 10000;   // free delivery for orders over this amount
const DELIVERY_FEE = 500;            // delivery fee for smaller orders


/* =====================================
   PRODUCT DATA (JavaScript object array)
===================================== */

const products = [

    {
        id: 1,
        name: "Rainbow Unicorn",
        category: "Figurines",
        price: 4500,
        image: "🦄",
        description: "A sparkling collectible unicorn with a rainbow mane. Looks great on any shelf."
    },

    {
        id: 2,
        name: "Space Robot Hero",
        category: "Figurines",
        price: 5200,
        image: "🤖",
        description: "A poseable robot figurine with detailed metallic paint, ready for space adventures."
    },

    {
        id: 3,
        name: "Dino Buddy Plush",
        category: "Toys",
        price: 3800,
        image: "🦖",
        description: "A soft and cuddly dinosaur plush that is safe for children of all ages."
    },

    {
        id: 4,
        name: "Super Teddy",
        category: "Toys",
        price: 4200,
        image: "🧸",
        description: "A classic teddy bear in a tiny superhero cape. A perfect gift."
    },

    {
        id: 5,
        name: "Magic Building Blocks",
        category: "Toys",
        price: 6500,
        image: "🧱",
        description: "A set of colourful blocks for building castles, bridges and creative ideas."
    },

    {
        id: 6,
        name: "Family Quest",
        category: "Board Games",
        price: 7200,
        image: "🎲",
        description: "An adventure board game for 2 to 6 players. Roll, explore and complete quests together."
    },

    {
        id: 7,
        name: "Puzzle Planet",
        category: "Board Games",
        price: 5600,
        image: "🧩",
        description: "A puzzle-based board game where players race to rebuild a broken planet."
    },

    {
        id: 8,
        name: "Monster Race",
        category: "Board Games",
        price: 8100,
        image: "👾",
        description: "A fast and funny racing game with silly monsters and surprise cards."
    },

    {
        id: 9,
        name: "Red Speedster",
        category: "Diecast Cars",
        price: 4900,
        image: "🏎️",
        description: "A 1:32 scale diecast racing car with opening doors and rubber tyres."
    },

    {
        id: 10,
        name: "Classic Blue Racer",
        category: "Diecast Cars",
        price: 5300,
        image: "🚙",
        description: "A vintage-style blue model car with a shiny metal body."
    },

    {
        id: 11,
        name: "City Police Cruiser",
        category: "Diecast Cars",
        price: 4600,
        image: "🚓",
        description: "A detailed police car model with a light bar and a metal chassis."
    },

    {
        id: 12,
        name: "Golden Supercar",
        category: "Diecast Cars",
        price: 8900,
        image: "🏆",
        description: "A limited edition gold-finish supercar for serious collectors."
    }

];


/* =====================================
   REUSABLE HELPERS
   (used by many pages)
===================================== */

/* Read a value from localStorage (safe if empty or broken) */
function readStorage(key, fallback) {

    try {

        const value = JSON.parse(localStorage.getItem(key));

        return value === null ? fallback : value;

    } catch (error) {

        return fallback;

    }

}


/* Save a value to localStorage */
function writeStorage(key, value) {

    try {

        localStorage.setItem(key, JSON.stringify(value));

    } catch (error) {

        showToast("Could not save your data.");

    }

}


function getCart() {
    return readStorage("toyHavenCart", []);
}

function saveCart(cart) {
    writeStorage("toyHavenCart", cart);
}

function getCollection() {
    return readStorage("toyHavenCollection", []);
}

function saveCollection(collection) {
    writeStorage("toyHavenCollection", collection);
}

function findProduct(id) {
    return products.find(product => product.id === id);
}


/* Format a number as money */
function money(amount) {

    return "Rs. " + amount.toLocaleString("en-US");

}


/* Cart items joined with their product details and subtotals */
function getCartLines() {

    return getCart()
        .map(item => ({
            product: findProduct(item.id),
            quantity: item.quantity
        }))
        .filter(line => line.product)
        .map(line => ({
            product: line.product,
            quantity: line.quantity,
            subtotal: line.product.price * line.quantity
        }));

}


/* Delivery is free for orders over the limit */
function getDeliveryFee(subtotal) {

    if (subtotal === 0 || subtotal > FREE_DELIVERY_LIMIT) {
        return 0;
    }

    return DELIVERY_FEE;

}


/* Update the numbers in the navigation bar */
function updateNavCounts() {

    const cartCount = document.getElementById("cartCount");
    const collectionCount = document.getElementById("collectionCount");

    if (cartCount) {

        let total = 0;

        getCart().forEach(item => {
            total += item.quantity;
        });

        cartCount.textContent = total;

    }

    if (collectionCount) {

        collectionCount.textContent = getCollection().length;

    }

}


/* Small pop-up message */
let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);

}


/* =====================================
   FORM VALIDATION HELPERS
   (used by checkout, support, newsletter)
===================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

}


/* Show an error message under an input */
function setFieldError(input, message) {

    let error = document.getElementById(input.id + "Error");

    if (!error) {

        error = document.createElement("small");
        error.id = input.id + "Error";
        error.className = "error-text";
        error.setAttribute("role", "alert");

        input.insertAdjacentElement("afterend", error);

    }

    error.textContent = message;

    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);

}


/* Remove the error message from an input */
function clearFieldError(input) {

    const error = document.getElementById(input.id + "Error");

    if (error) {
        error.textContent = "";
    }

    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");

}


/* Clear an error as soon as the user edits the field */
function clearErrorsOnInput(form) {

    form.addEventListener("input", event => {

        if (event.target.id) {
            clearFieldError(event.target);
        }

    });

}


/* Each rule returns an error message, or "" when the value is fine */
const validationRules = {

    name: value => {

        if (value === "") return "Please enter your name.";

        if (value.length < 3) return "Name must be at least 3 characters.";

        if (!/^\p{L}[\p{L}\s.'-]*$/u.test(value)) {
            return "Name can only contain letters and spaces.";
        }

        return "";

    },

    email: value => {

        if (value === "") return "Please enter your email address.";

        if (!isValidEmail(value)) {
            return "Enter a valid email, for example name@email.com.";
        }

        return "";

    },

    address: value => {

        if (value === "") return "Please enter your delivery address.";

        if (value.length < 10) {
            return "Address must be at least 10 characters.";
        }

        return "";

    },

    payment: value => {

        return value === "" ? "Please choose a payment method." : "";

    },

    message: value => {

        if (value === "") return "Please write a message.";

        if (value.length < 10) {
            return "Message must be at least 10 characters.";
        }

        return "";

    }

};


/* Check a list of { input, rule } pairs. Returns true when all are valid. */
function validateFields(fields) {

    let firstInvalid = null;

    fields.forEach(field => {

        const message = field.rule(field.input.value.trim());

        if (message) {

            setFieldError(field.input, message);

            if (!firstInvalid) {
                firstInvalid = field.input;
            }

        } else {

            clearFieldError(field.input);

        }

    });

    if (firstInvalid) {

        firstInvalid.focus();

        return false;

    }

    return true;

}


/* =====================================
   SCROLL REVEAL
   Elements with class "reveal" fade in
   when they scroll into view.
===================================== */

let revealObserver;

function initReveal() {

    const elements = document.querySelectorAll(".reveal:not(.visible)");

    if (typeof window.IntersectionObserver !== "function") {

        elements.forEach(element => element.classList.add("visible"));

        return;

    }

    if (!revealObserver) {

        revealObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        }, { threshold: 0.1 });

    }

    elements.forEach(element => revealObserver.observe(element));

}


/* =====================================
   CART ACTIONS
===================================== */

function addToCart(id) {

    const cart = getCart();

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({ id: id, quantity: 1 });

    }

    saveCart(cart);

    updateNavCounts();

    showToast("Product added to cart 🛒");

}


function changeQuantity(id, change) {

    let cart = getCart();

    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(product => product.id !== id);

    }

    saveCart(cart);

    renderCart();

    updateNavCounts();

}


function removeFromCart(id) {

    const cart = getCart().filter(item => item.id !== id);

    saveCart(cart);

    renderCart();

    updateNavCounts();

}


function clearCart() {

    localStorage.removeItem("toyHavenCart");

    renderCart();

    updateNavCounts();

    showToast("Cart cleared 🛒");

}


/* =====================================
   PRODUCT CARD (used on Home + Shop)
===================================== */

function productCard(product) {

    return `

        <div class="product-card reveal">

            <div class="product-image" aria-hidden="true">
                ${product.image}
            </div>

            <h3>${product.name}</h3>

            <p class="product-category">${product.category}</p>

            <p class="price">${money(product.price)}</p>

            <div class="product-buttons">

                <button class="small-button"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

                <button class="small-button"
                    onclick="addToCollection(${product.id})">
                    ❤️ Collection
                </button>

                <button class="small-button"
                    onclick="openProductModal(${product.id})">
                    View
                </button>

            </div>

        </div>

    `;

}


/* =====================================
   SHOP PAGE: SEARCH + FILTER
===================================== */

function renderProducts() {

    const productList = document.getElementById("productList");

    if (!productList) return;

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const resultCount = document.getElementById("resultCount");


    function displayProducts() {

        const search = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;

        const filtered = products.filter(product => {

            const matchesSearch =
                product.name.toLowerCase().includes(search);

            const matchesCategory =
                category === "All" || product.category === category;

            return matchesSearch && matchesCategory;

        });

        if (resultCount) {

            resultCount.textContent =
                "Showing " + filtered.length + " of " +
                products.length + " products";

        }

        if (filtered.length === 0) {

            productList.innerHTML = "<h2>No products found 😢</h2>";

            return;

        }

        productList.innerHTML = filtered.map(productCard).join("");

        initReveal();

    }


    searchInput.addEventListener("input", displayProducts);
    categoryFilter.addEventListener("change", displayProducts);


    /* Read the category from the link, e.g. products.html?category=Toys */
    const category = new URLSearchParams(window.location.search).get("category");

    if (category) {

        categoryFilter.value = category;

    }

    displayProducts();

}


/* =====================================
   HOME PAGE PRODUCTS
===================================== */

function renderHomeProducts() {

    const container = document.getElementById("homeProducts");

    if (!container) return;

    container.innerHTML = products
        .slice(0, 4)
        .map(productCard)
        .join("");

}


/* =====================================
   PRODUCT OF THE DAY
   A different product each day of the month
===================================== */

function renderFeatured() {

    const container = document.getElementById("featuredProduct");

    if (!container) return;

    const today = new Date().getDate();

    const product = products[today % products.length];

    container.innerHTML = `

        <div class="featured-card reveal">

            <div class="product-image" aria-hidden="true">
                ${product.image}
            </div>

            <h3>${product.name}</h3>

            <p>${product.category}</p>

            <p class="price">${money(product.price)}</p>

            <button class="button"
                onclick="addToCart(${product.id})">
                Add to Cart 🛒
            </button>

        </div>

    `;

}


/* =====================================
   PRODUCT MODAL
===================================== */

let lastFocusedElement = null;

function openProductModal(id) {

    const product = findProduct(id);

    const modal = document.getElementById("productModal");
    const modalProduct = document.getElementById("modalProduct");

    if (!product || !modal) return;

    lastFocusedElement = document.activeElement;

    modalProduct.innerHTML = `

        <div class="product-image" aria-hidden="true">
            ${product.image}
        </div>

        <h2 id="modalTitle">${product.name}</h2>

        <p>Category: ${product.category}</p>

        <p>${product.description}</p>

        <p class="price">${money(product.price)}</p>

        <button class="button"
            onclick="addToCart(${product.id})">
            Add to Cart
        </button>

    `;

    modal.classList.add("show");

    document.getElementById("closeModal").focus();

}


function closeProductModal() {

    const modal = document.getElementById("productModal");

    if (modal) {

        modal.classList.remove("show");

    }

    /* Give focus back to the button that opened the modal */
    if (lastFocusedElement) {

        lastFocusedElement.focus();

        lastFocusedElement = null;

    }

}


function initModal() {

    const modal = document.getElementById("productModal");

    if (!modal) return;

    document.getElementById("closeModal")
        .addEventListener("click", closeProductModal);

    /* Click on the dark background closes the modal */
    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeProductModal();
        }

    });

    /* Escape key closes the modal */
    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && modal.classList.contains("show")) {
            closeProductModal();
        }

    });

}


/* =====================================
   COLLECTION / WISHLIST
===================================== */

function addToCollection(id) {

    const collection = getCollection();

    if (collection.find(item => item.id === id)) {

        showToast("Already in your collection ❤️");

        return;

    }

    collection.push({ id: id, status: "Interested" });

    saveCollection(collection);

    updateNavCounts();

    showToast("Added to collection ❤️");

}


function setCollectionStatus(id, status) {

    const collection = getCollection();

    const item = collection.find(product => product.id === id);

    if (item) {

        item.status = status;

    }

    saveCollection(collection);

    showToast("Marked as " + status);

}


function removeFromCollection(id) {

    const collection = getCollection().filter(item => item.id !== id);

    saveCollection(collection);

    renderWishlist();

    updateNavCounts();

    showToast("Removed from collection");

}


function renderWishlist() {

    const container = document.getElementById("wishlistItems");

    if (!container) return;

    const collection = getCollection().filter(item => findProduct(item.id));

    if (collection.length === 0) {

        container.innerHTML = `

            <div class="form-card">

                <h2>Your collection is empty ❤️</h2>

                <p>Go to the shop and add some products.</p>

                <br>

                <a href="products.html" class="button">Shop Now</a>

            </div>

        `;

        return;

    }

    const statuses = ["Interested", "Owned", "Not Interested"];

    container.innerHTML = collection.map(item => {

        const product = findProduct(item.id);

        const options = statuses.map(status => `
            <option value="${status}"
                ${item.status === status ? "selected" : ""}>
                ${status}
            </option>
        `).join("");

        return `

            <div class="product-card reveal">

                <div class="product-image" aria-hidden="true">
                    ${product.image}
                </div>

                <h3>${product.name}</h3>

                <p class="product-category">${product.category}</p>

                <p class="price">${money(product.price)}</p>

                <label class="status-label" for="status-${product.id}">
                    Status
                </label>

                <select class="status-select"
                    id="status-${product.id}"
                    onchange="setCollectionStatus(${product.id}, this.value)">
                    ${options}
                </select>

                <button class="small-button remove-button"
                    onclick="removeFromCollection(${product.id})">
                    Remove
                </button>

            </div>

        `;

    }).join("");

    initReveal();

}


/* =====================================
   CART PAGE
===================================== */

function renderCart() {

    const container = document.getElementById("cartItems");

    if (!container) return;

    const total = document.getElementById("cartTotal");

    const lines = getCartLines();

    if (lines.length === 0) {

        container.innerHTML = `

            <div class="form-card">

                <h3>Your cart is empty 🛒</h3>

                <p>Add some products to your cart.</p>

                <br>

                <a href="products.html" class="button">Shop Now</a>

            </div>

        `;

        if (total) {
            total.textContent = money(0);
        }

        return;

    }

    let totalPrice = 0;

    container.innerHTML = lines.map(line => {

        totalPrice += line.subtotal;

        return `

            <div class="cart-item">

                <div class="cart-item-image" aria-hidden="true">
                    ${line.product.image}
                </div>

                <div>

                    <h3>${line.product.name}</h3>

                    <p>${money(line.product.price)} each</p>

                </div>

                <div class="quantity-controls">

                    <button class="quantity-button"
                        aria-label="Decrease quantity of ${line.product.name}"
                        onclick="changeQuantity(${line.product.id}, -1)">
                        -
                    </button>

                    <strong>${line.quantity}</strong>

                    <button class="quantity-button"
                        aria-label="Increase quantity of ${line.product.name}"
                        onclick="changeQuantity(${line.product.id}, 1)">
                        +
                    </button>

                </div>

                <strong>${money(line.subtotal)}</strong>

                <button class="small-button"
                    onclick="removeFromCart(${line.product.id})">
                    Remove
                </button>

            </div>

        `;

    }).join("");

    if (total) {
        total.textContent = money(totalPrice);
    }

}


function initCartButtons() {

    const clearButton = document.getElementById("clearCartButton");

    if (clearButton) {

        clearButton.addEventListener("click", clearCart);

    }

}


/* =====================================
   CHECKOUT PAGE
===================================== */

function initCheckout() {

    const form = document.getElementById("checkoutForm");

    if (!form) return;

    const summary = document.getElementById("checkoutSummary");
    const totalElement = document.getElementById("checkoutTotal");

    const lines = getCartLines();

    let subtotal = 0;

    lines.forEach(line => {
        subtotal += line.subtotal;
    });

    const delivery = getDeliveryFee(subtotal);
    const total = subtotal + delivery;


    /* Order summary shown before confirmation */
    if (lines.length === 0) {

        summary.innerHTML = "<p>Your cart is empty.</p>";

    } else {

        const rows = lines.map(line => `

            <tr>
                <td>${line.product.name}</td>
                <td class="number">${line.quantity}</td>
                <td class="number">${money(line.subtotal)}</td>
            </tr>

        `).join("");

        summary.innerHTML = `

            <div class="table-wrapper">

                <table class="info-table">

                    <caption class="sr-only">Items in your order</caption>

                    <thead>
                        <tr>
                            <th scope="col">Product</th>
                            <th scope="col" class="number">Qty</th>
                            <th scope="col" class="number">Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>${rows}</tbody>

                    <tfoot>

                        <tr>
                            <th scope="row" colspan="2">Items</th>
                            <td class="number">${money(subtotal)}</td>
                        </tr>

                        <tr>
                            <th scope="row" colspan="2">Delivery</th>
                            <td class="number">
                                ${delivery === 0 ? "Free" : money(delivery)}
                            </td>
                        </tr>

                    </tfoot>

                </table>

            </div>

        `;

    }

    totalElement.textContent = money(total);

    clearErrorsOnInput(form);


    form.addEventListener("submit", event => {

        event.preventDefault();

        if (lines.length === 0) {

            showToast("Your cart is empty!");

            return;

        }

        const fields = [
            { input: document.getElementById("fullName"), rule: validationRules.name },
            { input: document.getElementById("email"), rule: validationRules.email },
            { input: document.getElementById("address"), rule: validationRules.address },
            { input: document.getElementById("paymentMethod"), rule: validationRules.payment }
        ];

        if (!validateFields(fields)) {

            showToast("Please fix the errors in the form.");

            return;

        }


        /* Build the order and save it in the order history */
        const order = {

            orderNumber: "TH" + Date.now(),

            name: fields[0].input.value.trim(),
            email: fields[1].input.value.trim(),
            address: fields[2].input.value.trim(),
            payment: fields[3].input.value,

            items: lines.map(line => ({
                id: line.product.id,
                name: line.product.name,
                quantity: line.quantity,
                price: line.product.price
            })),

            subtotal: subtotal,
            delivery: delivery,
            total: total,

            date: new Date().toLocaleString()

        };

        const orders = readStorage("toyHavenOrders", []);

        orders.push(order);

        writeStorage("toyHavenOrders", orders);

        localStorage.removeItem("toyHavenCart");

        updateNavCounts();


        /* Show the animated success message */
        form.style.display = "none";

        document.getElementById("checkoutSummaryCard").style.display = "none";

        document.getElementById("orderNumber").textContent =
            "Your order number is " + order.orderNumber + ".";

        const success = document.getElementById("checkoutSuccess");

        success.style.display = "block";

        success.focus();

    });

}


/* =====================================
   NEWSLETTER
===================================== */

function initNewsletter() {

    const form = document.getElementById("newsletterForm");

    if (!form) return;

    const input = document.getElementById("newsletterEmail");
    const message = document.getElementById("newsletterMessage");

    clearErrorsOnInput(form);

    form.addEventListener("submit", event => {

        event.preventDefault();

        message.textContent = "";

        if (!validateFields([{ input: input, rule: validationRules.email }])) {

            return;

        }

        const email = input.value.trim().toLowerCase();

        const subscribers = readStorage("toyHavenSubscribers", []);

        if (subscribers.includes(email)) {

            message.textContent = "You are already subscribed. 🎉";

        } else {

            subscribers.push(email);

            writeStorage("toyHavenSubscribers", subscribers);

            message.textContent = "Thank you for subscribing! 🎉";

        }

        form.reset();

    });

}


/* =====================================
   SUPPORT PAGE: FEEDBACK FORM
===================================== */

function initSupport() {

    const form = document.getElementById("feedbackForm");

    if (!form) return;

    const success = document.getElementById("feedbackSuccess");

    clearErrorsOnInput(form);

    form.addEventListener("submit", event => {

        event.preventDefault();

        success.textContent = "";

        const fields = [
            { input: document.getElementById("feedbackName"), rule: validationRules.name },
            { input: document.getElementById("feedbackEmail"), rule: validationRules.email },
            { input: document.getElementById("feedbackMessage"), rule: validationRules.message }
        ];

        if (!validateFields(fields)) {

            showToast("Please fix the errors in the form.");

            return;

        }

        const savedFeedback = readStorage("toyHavenFeedback", []);

        savedFeedback.push({

            name: fields[0].input.value.trim(),
            email: fields[1].input.value.trim(),
            message: fields[2].input.value.trim(),
            date: new Date().toLocaleString()

        });

        writeStorage("toyHavenFeedback", savedFeedback);

        success.textContent = "Thank you for your feedback! 💖";

        form.reset();

    });

}


/* =====================================
   FAQ ACCORDION
===================================== */

function initFAQ() {

    document.querySelectorAll(".faq-question").forEach(question => {

        question.addEventListener("click", function () {

            const answer = this.nextElementSibling;

            const isOpen = answer.classList.toggle("show");

            this.setAttribute("aria-expanded", isOpen);

            this.querySelector("span").textContent = isOpen ? "−" : "+";

        });

    });

}


/* =====================================
   MOBILE MENU (animated hamburger)
===================================== */

function initMenu() {

    const button = document.getElementById("menuButton");
    const links = document.getElementById("navLinks");

    if (!button || !links) return;

    button.addEventListener("click", () => {

        const isOpen = links.classList.toggle("show");

        button.classList.toggle("open", isOpen);

        button.setAttribute("aria-expanded", isOpen);

    });

}


/* =====================================
   HERO SLIDER (changes every 4 seconds)
===================================== */

function initHero() {

    const slides = document.querySelectorAll(".hero-slide");

    if (slides.length === 0) return;

    let currentSlide = 0;

    setInterval(() => {

        slides[currentSlide].classList.remove("active");

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.add("active");

    }, 4000);

}


/* =====================================
   PWA: REGISTER SERVICE WORKER
===================================== */

function initServiceWorker() {

    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js").catch(() => {
            /* Service workers only work on https or localhost */
        });

    });

}


/* =====================================
   PAGE START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateNavCounts();

    renderProducts();
    renderHomeProducts();
    renderFeatured();
    renderCart();
    renderWishlist();

    initCartButtons();
    initCheckout();
    initNewsletter();
    initSupport();
    initFAQ();
    initMenu();
    initHero();
    initModal();

    initReveal();
    initServiceWorker();

});