document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openLoginBtn");
  const openBtnDesktop = document.getElementById("openLoginBtnDesktop");

  // ======================
  // 🔹 Auth helpers
  // ======================
  function getUserEmail() {
    const user = JSON.parse(localStorage.getItem("acumen_user") || "{}");
    return user.email || null;
  }

  function setUserLoggedIn(email) {
    localStorage.setItem("acumen_user", JSON.stringify({ email }));
    updateNavbarState();
  }

  function setUserLoggedOut() {
    localStorage.removeItem("acumen_user");
    updateNavbarState();
  }

  // ======================
  // 🔹 Navbar Update
  // ======================
  function updateNavbarState() {
    const loginBtn = document.getElementById("openLoginBtn");
    const loginBtnDesktop = document.getElementById("openLoginBtnDesktop");
    const dashboardLinks = document.querySelectorAll(".dashboardLink");
    const userEmail = getUserEmail();
    const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";

    const dropdownDesktop = document.getElementById("userDropdownDesktop");
    const dropdownMobile = document.getElementById("userDropdownMobile");

    if (userEmail) {
      dashboardLinks.forEach(el => el.classList.add("hidden"));

      // --- Desktop icon ---
      if (loginBtnDesktop) {
        loginBtnDesktop.textContent = firstLetter;
        loginBtnDesktop.classList.add(
          "rounded-full", "w-10", "h-10", "flex", "items-center", "justify-center",
          "font-bold", "bg-blue-600", "text-white"
        );

        loginBtnDesktop.onclick = e => {
          e.stopPropagation(); // prevent closing when clicking on the icon
          dropdownDesktop?.classList.toggle("hidden");
        };
      }

      // --- Mobile icon (optional) ---
      if (loginBtn) {
        loginBtn.textContent = firstLetter;
        loginBtn.classList.add(
          "rounded-full", "w-10", "h-10", "flex", "items-center", "justify-center",
          "font-bold", "bg-blue-600", "text-white"
        );

        loginBtn.onclick = e => {
          e.stopPropagation();
          dropdownMobile?.classList.toggle("hidden");
        };
      }

      // --- Setup dropdown actions ---
      setupDropdownHandlers(dropdownDesktop);
      setupDropdownHandlers(dropdownMobile);

      // ✅ Close dropdown when clicking outside
      document.addEventListener("click", e => {
        if (
          !dropdownDesktop?.contains(e.target) &&
          !dropdownMobile?.contains(e.target) &&
          e.target !== loginBtnDesktop &&
          e.target !== loginBtn
        ) {
          dropdownDesktop?.classList.add("hidden");
          dropdownMobile?.classList.add("hidden");
        }
      });

    } else {
      // --- Logged-out view ---
      if (loginBtn) {
        loginBtn.textContent = "Login / Signup";
        loginBtn.classList.remove("rounded-full", "w-10", "h-10", "font-bold");
        loginBtn.onclick = async () => {
          await ensureModalLoaded();
          showModal();
        };
      }

      if (loginBtnDesktop) {
        loginBtnDesktop.textContent = "Login / Signup";
        loginBtnDesktop.classList.remove("rounded-full", "w-10", "h-10", "font-bold");
        loginBtnDesktop.onclick = async () => {
          await ensureModalLoaded();
          showModal();
        };
      }

      dashboardLinks.forEach(el => el.classList.add("hidden"));
    }
  }

  // ======================
  // 🔹 Dropdown Handlers
  // ======================
  function setupDropdownHandlers(dropdown) {
    if (!dropdown) return;

    dropdown.addEventListener("click", e => e.stopPropagation());

    const profile = dropdown.querySelector(".dropdown-profile");
    const bookings = dropdown.querySelector(".dropdown-bookings");
    const checkout = dropdown.querySelector(".dropdown-checkout");
    const logoutBtn = dropdown.querySelector(".dropdown-logout") || document.getElementById("logoutBtn");

    const handleSafeClick = callback => e => {
      e.preventDefault();
      e.stopPropagation(); // ✅ prevents icon click from toggling dropdown again
      callback();
      dropdown.classList.add("hidden");
    };

    if (profile) {
      profile.onclick = handleSafeClick(() => {
        window.open("pages/profile.html", "_blank");
      });
    }

    if (bookings) {
      bookings.onclick = handleSafeClick(() => {
        window.open("pages/dashboard.html", "_blank");
      });
    }

    if (checkout) {
      checkout.onclick = handleSafeClick(() => {
        window.open("pages/checkout.html", "_blank");
      });
    }

    if (logoutBtn) {
  logoutBtn.onclick = handleSafeClick(() => {
    setUserLoggedOut(); // remove user & update navbar immediately
    // Small delay to let UI refresh before redirect
    setTimeout(() => {
      window.location.href = "index.html";
    }, 300);
  });
}

  }

  // ======================
  // 🔹 Auth Success
  // ======================
  function handleAuthSuccess(email) {
    setUserLoggedIn(email);
    hideModal();
    updateNavbarState();
  }

  // ======================
  // 🔹 Modal loader
  // ======================
  async function ensureModalLoaded() {
    let modal = document.getElementById("loginModal");
    if (modal) return modal;
    try {
      const res = await fetch("./components/LoginModal.html", { cache: "no-store" });
      if (!res.ok) throw new Error("Fetch failed");
      const html = await res.text();
      injectModal(html);
    } catch {
      injectModal(`<div id="loginModal">Login failed to load</div>`);
    }
    return document.getElementById("loginModal");
  }

  function injectModal(html) {
    const root = document.getElementById("modal-root") || document.body;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    if (!document.getElementById("loginModal")) root.appendChild(wrapper.firstElementChild);
    bindModalEvents();
  }

  // ======================
  // 🔹 Modal Bindings
  // ======================
  function bindModalEvents() {
    const modal = document.getElementById("loginModal");
    const closeBtn = document.getElementById("closeLoginBtn");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginMessage = document.getElementById("loginMessage");
    const tabLogin = document.getElementById("tabLogin");
    const tabSignup = document.getElementById("tabSignup");

    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener("click", hideModal);
    modal.addEventListener("click", e => { if (e.target === modal) hideModal(); });

    if (tabLogin) tabLogin.addEventListener("click", () => switchTab("login"));
    if (tabSignup) tabSignup.addEventListener("click", () => switchTab("signup"));

    function switchTab(tab) {
      if (!loginForm || !signupForm) return;
      if (tab === "login") {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
      } else {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
      }
      loginMessage?.classList.add("hidden");
    }
    switchTab("login");

    function validateEmail(email) { return /\S+@\S+\.\S+/.test(email); }
    function showMessage(msg, style) {
      if (!loginMessage) return;
      loginMessage.textContent = msg;
      loginMessage.className = `mb-3 text-center ${style}`;
      loginMessage.classList.remove("hidden");
    }

    if (loginForm) {
      loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("loginEmail")?.value.trim() || "";
        const password = document.getElementById("loginPassword")?.value.trim() || "";
        if (!validateEmail(email)) return showMessage("Invalid login email.", "text-red-600");
        if (password.length < 6) return showMessage("Password too short.", "text-red-600");
        showMessage("Login successful!", "text-green-600");
        loginForm.reset();
        setTimeout(() => handleAuthSuccess(email), 1000);
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("signupName")?.value.trim() || "";
        const email = document.getElementById("signupEmail")?.value.trim() || "";
        const password = document.getElementById("signupPassword")?.value.trim() || "";
        if (!name) return showMessage("Name is required.", "text-red-600");
        if (!validateEmail(email)) return showMessage("Invalid signup email.", "text-red-600");
        if (password.length < 6) return showMessage("Password must be at least 6 characters.", "text-red-600");
        showMessage("Signup successful!", "text-green-600");
        signupForm.reset();
        setTimeout(() => handleAuthSuccess(email), 1000);
      });
    }
  }

  // ======================
  // 🔹 Modal visibility
  // ======================
  function showModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("hidden");
  }

  function hideModal() {
    const modal = document.getElementById("loginModal");
    const loginMessage = document.getElementById("loginMessage");
    if (modal) modal.classList.add("hidden");
    if (loginMessage) loginMessage.classList.add("hidden");
  }

  // ======================
  // 🔹 Init
  // ======================
  updateNavbarState();
});


