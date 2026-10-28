
document.addEventListener("DOMContentLoaded", function () {

    // 1. Display a welcome message
    console.log("Welcome to Sweet Delight Cakes!");

    // 2. Automatically update the copyright year
    const copyrightYear = document.getElementById("copyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // 3. Add hover effects to navigation links
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(function (link) {

        link.addEventListener("mouseenter", function () {
            link.style.color = "hotpink";
        });

        link.addEventListener("mouseleave", function () {
            link.style.color = "";
        });

    });

    // 4. Add hover effects to homepage links
    const homeLinks = document.querySelectorAll(".home-links a");

    homeLinks.forEach(function (link) {

        link.addEventListener("mouseenter", function () {
            link.style.backgroundColor = "lightpink";
        });

        link.addEventListener("mouseleave", function () {
            link.style.backgroundColor = "";
        });

    });

    // 5. Make the About navigation link bold
    navLinks.forEach(function (link) {

        if (link.textContent.trim().toLowerCase() === "about") {
            link.style.fontWeight = "bold";
        }

    });

    // 6. Enable smooth scrolling for section links
    const sectionLinks = document.querySelectorAll('a[href^="#"]');

    sectionLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (targetId && targetId.length > 1) {

                const target = document.querySelector(targetId);

                if (target) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        });
    });


    // ==========================================
    // SWEET DELIGHT CAKES ORDER CALCULATOR
    // ==========================================

    const orderForm = document.getElementById("orderForm");

    // Run the calculator only on the online orders page
    if (orderForm) {

        const product = document.getElementById("product");
        const quantity = document.getElementById("quantity");
        const deliveryArea = document.getElementById("deliveryArea");
        const address = document.getElementById("address");

        const cakeImage = document.getElementById("cakeImage");
        const cakeName = document.getElementById("cakeName");
        const cakeDescription = document.getElementById("cakeDescription");

        const displayQuantity = document.getElementById("displayQuantity");
        const deliveryFee = document.getElementById("deliveryFee");
        const cakePrice = document.getElementById("cakePrice");
        const subtotal = document.getElementById("subtotal");
        const grandTotal = document.getElementById("grandTotal");
        const orderMessage = document.getElementById("orderMessage");
        const submitMessage = document.getElementById("submitMessage");


        // 7. Cake products, prices, descriptions and image paths
        const cakes = {

            birthday: {
                name: "Birthday Cake",
                price: 350,
                description: "A delicious cake for birthday celebrations.",
                image: "_images/birthday_cake.avif"
            },

            wedding: {
                name: "Wedding Cake",
                price: 1500,
                description: "A beautiful cake for your special wedding day.",
                image: "_images/wedding_cake.avif"
            },

            babyshower: {
                name: "Baby Shower Cake",
                price: 450,
                description: "A lovely cake for a baby shower.",
                image: "_images/baby_shower_cake.avif"
            },

            graduation: {
                name: "Graduation Cake",
                price: 450,
                description: "Celebrate your achievement with a graduation cake.",
                image: "_images/graduation_cake.avif"
            },

            cupcakes: {
                name: "Vanilla Cupcakes",
                price: 25,
                description: "Soft and delicious vanilla cupcakes.",
                image: "_images/vanilla_cupacke.avif"
            },

            customised: {
                name: "Customised Cake",
                price: null,
                description: "Contact us for a quotation for your customised cake.",
                image: "_images/customise_cake.avif"
            }

        };


        // 8. Delivery fees
        const deliveryFees = {
            central: 0,
            gauteng: 150,
            other: 300
        };


        // 9. Get the selected delivery or collection method
        function getReceiveMethod() {

            const selected = document.querySelector(
                'input[name="receive"]:checked'
            );

            return selected ? selected.value : "";
        }


        // 10. Enable or disable delivery fields
        function updateDeliveryFields() {

            if (!address || !deliveryArea) {
                calculateTotal();
                return;
            }

            const receiveMethod = getReceiveMethod();
            const isDelivery = receiveMethod === "delivery";

            address.disabled = !isDelivery;
            address.required = isDelivery;

            deliveryArea.disabled = !isDelivery;
            deliveryArea.required = isDelivery;

            if (!isDelivery) {
                address.value = "";
                deliveryArea.value = "";
            }

            calculateTotal();
        }


        // 11. Display the selected cake image and details
        function updateCakeImage() {

            if (!product) {
                return;
            }

            const selectedCake = cakes[product.value];

            if (!selectedCake) {

                if (cakeName) {
                    cakeName.textContent = "Select a cake";
                }

                if (cakeDescription) {
                    cakeDescription.textContent =
                        "Select a cake to see its image and description.";
                }

                if (cakeImage) {
                    cakeImage.removeAttribute("src");
                    cakeImage.style.display = "none";
                }

                calculateTotal();
                return;
            }

            if (cakeName) {
                cakeName.textContent = selectedCake.name;
            }

            if (cakeDescription) {
                cakeDescription.textContent = selectedCake.description;
            }

            // Load the correct image
            if (cakeImage) {

                cakeImage.onerror = function () {

                    console.error(
                        "Unable to load cake image:",
                        selectedCake.image
                    );

                    cakeImage.style.display = "none";

                    if (cakeDescription) {
                        cakeDescription.textContent =
                            selectedCake.description +
                            " Image not found. Please check the filename and folder.";
                    }
                };

                cakeImage.onload = function () {
                    cakeImage.style.display = "block";
                };

                cakeImage.src = selectedCake.image;
                cakeImage.alt = selectedCake.name;
                cakeImage.style.width = "100%";
                cakeImage.style.maxWidth = "350px";
                cakeImage.style.height = "auto";
                cakeImage.style.objectFit = "contain";
            }

            // Display the cake price
            if (cakePrice) {
                cakePrice.textContent = selectedCake.price === null
                    ? "Quotation required"
                    : "R" + selectedCake.price.toFixed(2);
            }

            // Display a message for customised cakes
            if (orderMessage) {
                orderMessage.textContent = selectedCake.price === null
                    ? "Please contact us for a quotation for your customised cake."
                    : "";
            }

            calculateTotal();
        }


        // 12. Calculate the order total
        function calculateTotal() {

            const selectedCake = product
                ? cakes[product.value]
                : null;

            const quantityValue = quantity
                ? Math.max(1, parseInt(quantity.value, 10) || 1)
                : 1;

            const receiveMethod = getReceiveMethod();

            let fee = 0;
            let subTotalValue = 0;

            if (selectedCake && selectedCake.price !== null) {
                subTotalValue = selectedCake.price * quantityValue;
            }

            if (receiveMethod === "delivery" && deliveryArea) {
                fee = deliveryFees[deliveryArea.value] || 0;
            }

            const total = subTotalValue + fee;

            if (displayQuantity) {
                displayQuantity.textContent = quantityValue;
            }

            if (deliveryFee) {
                deliveryFee.textContent = "R" + fee.toFixed(2);
            }

            if (subtotal) {
                subtotal.textContent =
                    selectedCake && selectedCake.price !== null
                        ? "R" + subTotalValue.toFixed(2)
                        : "Quotation required";
            }

            if (grandTotal) {
                grandTotal.textContent =
                    selectedCake && selectedCake.price !== null
                        ? "R" + total.toFixed(2)
                        : "Quotation required";
            }
        }


        // 13. Update the image when a cake is selected
        if (product) {
            product.addEventListener("change", updateCakeImage);
        }


        // 14. Recalculate when the quantity changes
        if (quantity) {
            quantity.addEventListener("input", calculateTotal);
        }


        // 15. Recalculate when the delivery area changes
        if (deliveryArea) {
            deliveryArea.addEventListener("change", calculateTotal);
        }


        // 16. Update delivery fields when the method changes
        const receiveOptions = document.querySelectorAll(
            'input[name="receive"]'
        );

        receiveOptions.forEach(function (option) {
            option.addEventListener("change", updateDeliveryFields);
        });


        // 17. Prevent customers from choosing a past date
        const dateInput = document.getElementById("date");

        if (dateInput) {

            const today = new Date();

            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");

            dateInput.min = year + "-" + month + "-" + day;
        }


        // 18. Validate the form and display the thank-you message
        orderForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!orderForm.checkValidity()) {
                orderForm.reportValidity();
                return;
            }

            if (submitMessage) {
                submitMessage.textContent =
                    "Thank you for placing your order with Sweet Delight Cakes! 💗 " +
                    "We will be in touch with you soon.";
            }

        });


        // 19. Reset the calculator when the form is cleared
        orderForm.addEventListener("reset", function () {

            setTimeout(function () {

                updateDeliveryFields();
                updateCakeImage();

                if (orderMessage) {
                    orderMessage.textContent = "";
                }

                if (submitMessage) {
                    submitMessage.textContent = "";
                }

            }, 0);
        });


        // 20. Display the initial calculator values
        updateDeliveryFields();
        updateCakeImage();

    }

});

// CAKE SEARCH FUNCTION

const cakeSearchForm = document.getElementById("cakeSearchForm");
const cakeSearchInput = document.getElementById("cakeSearchInput");
const cakeSearchResults = document.getElementById("cakeSearchResults");

// Cakes available on the website
const cakeSearchCatalogue = {
    "birthday": "birthday-cake",
    "birthday cake": "birthday-cake",

    "wedding": "wedding-cake",
    "wedding cake": "wedding-cake",

    "baby shower": "baby-shower-cake",
    "baby shower cake": "baby-shower-cake",

    "graduation": "graduation-cake",
    "graduation cake": "graduation-cake",

    "cupcake": "cupcakes",
    "cupcakes": "cupcakes",

    "customised": "customised-cake",
    "customised cake": "customised-cake",
    "customized": "customised-cake",
    "customized cake": "customised-cake",
    "custom cake": "customised-cake"
};

if (cakeSearchForm) {
    cakeSearchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get the customer's search and make it lowercase
        const searchName = cakeSearchInput.value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

        // Find the matching cake
        const cakeID = cakeSearchCatalogue[searchName];

        if (cakeID) {
            // Open the Products & Services page at that cake
            window.location.href =
                "product_and_services.html#" + cakeID;
        } else {
            // Display an error for an invalid search
            cakeSearchResults.textContent =
                "Invalid search! Sorry, we could not find that cake. Please try another cake name.";

            cakeSearchResults.style.color = "red";
        }
    });
}
// =====================================
// SWEET DELIGHT CAKES
// JAVASCRIPT ANIMATIONS AND POSITIONING
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Add a fade-in animation to the hero section
    const hero = document.querySelector(".hero");

    if (hero) {
        hero.classList.add("fade-in");
    }

    // 2. Add a fade-in animation to product cards
    const productCards = document.querySelectorAll(
        ".product-card, .cake-card, .product-item"
    );

    productCards.forEach(function (card, index) {
        card.classList.add("fade-in");

        // Stagger the animations slightly
        card.style.animationDelay = (index * 0.15) + "s";
    });

    // 3. Create the back-to-top button automatically
    const backToTop = document.createElement("button");

    backToTop.id = "backToTop";
    backToTop.type = "button";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "Back to top");

    document.body.appendChild(backToTop);

    // 4. Show the button after scrolling down
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTop.style.display = "flex";
        } else {
            backToTop.style.display = "none";
        }
    }, { passive: true });

    // 5. Return smoothly to the top when clicked
    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});
    