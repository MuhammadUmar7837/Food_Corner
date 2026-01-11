const MENU_ITEMS = [
  {
    id: "p1",
    name: "Classic Arrabbiata Pasta",
    description:
      "A spicy Italian masterpiece with fresh basil and premium olive oil.",
    price: 12.99,
    category: "Pasta",
    image: "pasta.jpg",
  },
  {
    id: "b1",
    name: "The Dhabba Special Burger",
    description:
      "Double patty, caramelized onions, and our secret house sauce. A true feast!",
    price: 15.49,
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
  },
  {
    id: "r1",
    name: "Mediterranean Salmon Rice",
    description:
      "Grilled salmon steak served over fragrant saffron-infused rice and fresh vegetables.",
    price: 22.0,
    category: "Rice",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
  },
  {
    id: "p2",
    name: "Creamy Pesto Fusilli",
    description:
      "Handmade pesto sauce with toasted pine nuts, roasted garlic, and Parmesan.",
    price: 14.99,
    category: "Pasta",
    image: "pasta.jpg",
  },
  {
    id: "b2",
    name: "Spicy Paneer Crunch Burger",
    description:
      "Crispy paneer patty, hot chili mayo, fresh lettuce, and pickled onions.",
    price: 13.99,
    category: "Burgers",
    image: "burger.png",
  },
  {
    id: "r2",
    name: "Biryani Deluxe (Chicken/Veg)",
    description:
      "Fragrant basmati rice cooked with tender chicken/vegetables and aromatic spices.",
    price: 18.5,
    category: "Rice",
    image: "rice.jfif",
  },
  {
    id: "d1",
    name: "Chocolate Lava Cake",
    description:
      "Warm, rich chocolate cake with a molten center, served with vanilla ice cream.",
    price: 8.99,
    category: "Desserts",
    image: "cake.jfif",
  },
  {
    id: "d2",
    name: "Gulab Jamun with Rabri",
    description:
      "Soft, deep-fried milk solids soaked in rose syrup, topped with sweetened condensed milk.",
    price: 7.5,
    category: "Desserts",
    image: "rabri.jfif",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuGrid = document.getElementById("menu-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("order-modal");
  const closeModalBtn = document.querySelector(".close-modal"); // Renamed for clarity
  const checkoutForm = document.getElementById("checkout-form");
  const statusMsg = document.getElementById("status-msg");
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // --- Smooth Scroll Reveal (for sections like About, Menu, Testimonials, Gallery) ---
  const observerOptions = {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% of item is visible
    rootMargin: "0px",
  };
  const revealElements = document.querySelectorAll(".reveal");
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => sectionObserver.observe(el));

  // --- Sticky Navbar ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
      scrollToTopBtn.style.display = "block"; // Show scroll to top button
    } else {
      navbar.classList.remove("scrolled");
      scrollToTopBtn.style.display = "none"; // Hide scroll to top button
    }
  });

  // --- Populate Menu ---
  function renderMenu(category = "All") {
    menuGrid.innerHTML = ""; // Clear existing items
    const filtered =
      category === "All"
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => item.category === category);

    if (filtered.length === 0) {
      menuGrid.innerHTML = `<p class="no-items-message">No items found in the "${category}" category. Please check back later!</p>`;
      return;
    }

    filtered.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "menu-card reveal";
      // Stagger animation for menu cards
      card.style.transitionDelay = `${index * 0.1}s`;
      card.innerHTML = `
                <div class="card-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <span class="price-tag">$${item.price.toFixed(2)}</span>
                </div>
                <div class="card-body">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="btn-primary w-full" onclick="openOrderModal('${
                      item.id
                    }')">Order Now</button>
                </div>
            `;
      menuGrid.appendChild(card);
      // Observe each new card for reveal animation
      sectionObserver.observe(card);
    });
  }

  // --- Filter Logic ---
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenu(btn.dataset.category);
    });
  });

  // --- Modal Logic ---
  // Make openOrderModal globally accessible for onclick in HTML
  window.openOrderModal = (id) => {
    const item = MENU_ITEMS.find((i) => i.id === id);
    if (!item) return; // Should not happen if IDs are correct

    document.getElementById("item-id").value = item.id;
    document.getElementById("modal-img").src = item.image;
    document.getElementById("modal-img").alt = item.name; // Add alt text
    document.getElementById("modal-title").innerText = item.name;
    document.getElementById("modal-desc").innerText = item.description;

    statusMsg.innerHTML = ""; // Clear previous status messages
    checkoutForm.reset(); // Clear previous form inputs
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  // Close modal with button
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Close modal by clicking outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // --- Client-side Form Validation ---
  function validateForm(formData) {
    const errors = [];
    if (!formData.name.trim()) errors.push("Full Name is required.");
    if (!formData.phone.trim()) {
      errors.push("Phone is required.");
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.trim())) {
      // Basic phone number regex
      errors.push("Please enter a valid phone number.");
    }
    if (!formData.email.trim()) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      // Basic email regex
      errors.push("Please enter a valid email address.");
    }
    if (!formData.address.trim()) errors.push("Delivery Address is required.");

    if (errors.length > 0) {
      statusMsg.innerHTML = `<div class="alert alert-error">${errors.join(
        "<br>"
      )}</div>`;
      return false;
    }
    return true;
  }

  // --- Handle Order Submission (MOCK PHP Query) ---
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("submit-btn");

    const formData = {
      itemId: document.getElementById("item-id").value,
      name: document.getElementById("cust-name").value,
      phone: document.getElementById("cust-phone").value,
      email: document.getElementById("cust-email").value,
      address: document.getElementById("cust-address").value,
    };

    if (!validateForm(formData)) {
      return; // Stop if client-side validation fails
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Processing...";
    statusMsg.innerHTML = ""; // Clear previous messages

    try {
      // IMPORTANT: This 'api/order.php' will only work if you have a PHP server
      // running and an actual 'order.php' file at this path.
      // For demonstration, I'm using a placeholder/mock response.
      // In a real app, this would send data to your backend.
      const response = await fetch("api/order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); // Assuming your PHP returns JSON

      if (result.success) {
        statusMsg.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
        checkoutForm.reset();
        setTimeout(() => {
          modal.classList.remove("active");
          document.body.style.overflow = "auto";
        }, 3000); // Close modal after 3 seconds
      } else {
        statusMsg.innerHTML = `<div class="alert alert-error">${result.message}</div>`;
      }
    } catch (error) {
      console.error("Order submission error:", error);
      statusMsg.innerHTML = `<div class="alert alert-error">Failed to reach server or process order. Please try again.</div>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Confirm Order";
    }
  });

  // --- Scroll to Top functionality ---
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Initialize menu on page load
  renderMenu();
});

// --- Global function for 'Order Now' buttons in HTML ---
function scrollToMenu() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}
