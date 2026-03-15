document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("text-blue-600", "border-b-2", "border-blue-600");
    } else {
      link.classList.add("text-gray-700", "hover:text-blue-500");
    }
  });
});
