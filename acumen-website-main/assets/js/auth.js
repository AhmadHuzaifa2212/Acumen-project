document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("openLoginBtn");
  const loginBtnDesktop = document.getElementById("openLoginBtnDesktop");
  const logoutBtn = document.getElementById("logout-btn-mobile");
  const logoutBtnDesktop = document.getElementById("logout-btn-desktop");
  const dashboardLink = document.getElementById("dashboard-link-mobile");
  const dashboardLinkDesktop = document.getElementById("dashboard-link-desktop");

  function updateNav() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      loginBtn?.classList.add("hidden");
      loginBtnDesktop?.classList.add("hidden");
      logoutBtn?.classList.remove("hidden");
      logoutBtnDesktop?.classList.remove("hidden");
      dashboardLink?.classList.remove("hidden");
      dashboardLinkDesktop?.classList.remove("hidden");
    } else {
      loginBtn?.classList.remove("hidden");
      loginBtnDesktop?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
      logoutBtnDesktop?.classList.add("hidden");
      dashboardLink?.classList.add("hidden");
      dashboardLinkDesktop?.classList.add("hidden");
    }
  }

  function login() {
    localStorage.setItem("isLoggedIn", "true");
    updateNav();
  }

  function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/index.html";
  }

  logoutBtn?.addEventListener("click", logout);
  logoutBtnDesktop?.addEventListener("click", logout);

  // Expose login function to global scope
  window.login = login;

  updateNav();
});
