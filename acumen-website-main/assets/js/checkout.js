document.addEventListener("DOMContentLoaded", () => {
  const summaryEl = document.getElementById("bookingSummary");
  const confirmBtn = document.getElementById("confirmBtn");

  let booking = null;

  // Try from localStorage
  const raw = localStorage.getItem("acumen_checkout");
  if (raw) {
    try { booking = JSON.parse(raw); } catch {}
  }

  // Or from query string ?from=...&to=...
  if (!booking) {
    const params = new URLSearchParams(window.location.search);
    booking = {
      from: params.get("from") || "—",
      to: params.get("to") || "—",
      checkIn: params.get("checkIn") || "",
      checkOut: params.get("checkOut") || "",
      guests: params.get("guests") || 1,
      price: params.get("price") || 0
    };
  }

  function formatDate(dStr) {
    if (!dStr) return "—";
    const d = new Date(dStr);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  if (booking && summaryEl) {
    summaryEl.innerHTML = `
      <p><strong>From:</strong> ${escapeHtml(booking.from)}</p>
      <p><strong>To:</strong> ${escapeHtml(booking.to)}</p>
      <p><strong>Departure:</strong> ${formatDate(booking.checkIn)}</p>
      <p><strong>Return:</strong> ${formatDate(booking.checkOut)}</p>
      <p><strong>Guests:</strong> ${booking.guests}</p>
      <p><strong>Price:</strong> ₹${Number(booking.price).toFixed(2)}</p>
    `;
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const key = "acumen_bookings";
      let list = [];
      try {
        list = JSON.parse(localStorage.getItem(key)) || [];
      } catch {}
      
      const confirmed = { 
        ...booking, 
        id: "BKG-" + Date.now(),
        status: "Upcoming",
        bookingDate: new Date().toISOString()
      };
      list.push(confirmed);
      localStorage.setItem(key, JSON.stringify(list));

      localStorage.removeItem("acumen_checkout");

      alert("✅ Booking confirmed!");
      window.location.href = "dashboard.html";
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
});
