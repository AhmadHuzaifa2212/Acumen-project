(function () {
  const STORAGE_KEYS = ["bookings", "acumen_bookings"];
  const cardsContainer = document.getElementById("bookingsCardsContainer");
  const totalEl = document.getElementById("totalBookings");
  const upcomingEl = document.getElementById("upcomingBookings");
  const lastBookingEl = document.getElementById("lastBookingDate");
  const modalRoot = document.getElementById("modal-root");
  const MOCK_DATA_URL = "../assets/data/mock-bookingdata.json";

  try {
    if (!localStorage.getItem("acumen_user")) {
      window.location.href = "../index.html";
      return;
    }
  } catch {}

  async function loadBookings() {
    for (const key of STORAGE_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    try {
      const res = await fetch(MOCK_DATA_URL, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) return json;
      }
    } catch {}
    return [];
  }

  function formatDate(dStr) {
    if (!dStr) return "—";
    const dt = new Date(dStr);
    if (isNaN(dt.getTime())) return "—";
    return dt.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  function renderSummary(list) {
    const now = new Date();
    if (totalEl) totalEl.textContent = list.length;
    const upcomingCount = list.filter(b => {
      if (!b || !b.checkIn) return false;
      const checkIn = new Date(b.checkIn);
      if (isNaN(checkIn.getTime())) return false;
      return checkIn >= now;
    }).length;
    if (upcomingEl) upcomingEl.textContent = upcomingCount;

    const byDate = list.slice().sort((a, b) => {
      const aDate = new Date(a.bookingDate || a.checkIn || 0);
      const bDate = new Date(b.bookingDate || b.checkIn || 0);
      return bDate - aDate;
    });
    if (lastBookingEl) lastBookingEl.textContent = byDate.length ? formatDate(byDate[0].bookingDate || byDate[0].checkIn) : "—";
  }

  function statusBadgeClass(status) {
    if (!status) return "bg-gray-100 text-gray-700";
    const s = String(status).toLowerCase();
    if (s.includes("upcom")) return "bg-blue-100 text-blue-800";
    if (s.includes("complete") || s.includes("confirmed")) return "bg-green-100 text-green-800";
    if (s.includes("cancel")) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function renderCards(bookings) {
    if (!cardsContainer) return;
    if (!Array.isArray(bookings) || bookings.length === 0) {
      cardsContainer.innerHTML = `<div class="col-span-full p-6 text-center text-gray-600">No bookings found. <a href="../index.html" class="text-blue-600 underline">Search trips</a></div>`;
      return;
    }
    cardsContainer.innerHTML = bookings.map(b => {
      return `
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold">${escapeHtml(b.destination)}</h3>
            <p class="text-sm text-gray-500">${escapeHtml(b.hotel || "")}</p>
            <p class="mt-2 text-sm">${formatDate(b.checkIn)} — ${formatDate(b.checkOut)}</p>
            <p class="text-sm text-gray-600 mt-1">Guests: ${escapeHtml(String(b.guests || 1))}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Ref</p>
            <p class="font-medium">${escapeHtml(b.bookingRef || b.id || "—")}</p>
            <p class="text-sm text-gray-600 mt-3">₹${Number(b.price || 0).toFixed(2)}</p>
            <p class="text-sm mt-2"><span class="px-2 py-1 rounded-full text-xs ${statusBadgeClass(b.status)}">${escapeHtml(b.status || "—")}</span></p>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <button data-id="${escapeHtml(b.id || b.bookingRef)}" class="viewDetailsBtn inline-block px-3 py-1 rounded-md bg-blue-600 text-white text-sm shadow-sm">View Details</button>
          <div class="text-sm text-gray-500">${formatDate(b.bookingDate)}</div>
        </div>
      </div>`;
    }).join("");
  }

  function openDetailsModal(booking) {
    if (!modalRoot) return;
    closeModal();
    const overlay = document.createElement("div");
    overlay.id = "bookingModal";
    overlay.className = "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4";
    overlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-xl w-full overflow-auto">
        <div class="p-4 border-b flex items-center justify-between">
          <h2 class="text-lg font-semibold">Booking Details</h2>
          <button id="closeModalBtn" class="text-gray-500 hover:text-gray-800"><span class="material-icons">close</span></button>
        </div>
        <div class="p-4 space-y-3">
          <p><strong>Destination:</strong> ${escapeHtml(booking.destination)}</p>
          <p><strong>Hotel:</strong> ${escapeHtml(booking.hotel || "—")}</p>
          <p><strong>Dates:</strong> ${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}</p>
          <p><strong>Guests:</strong> ${escapeHtml(String(booking.guests || 1))}</p>
          <p><strong>Price:</strong> ₹${Number(booking.price || 0).toFixed(2)}</p>
          <p><strong>Status:</strong> ${escapeHtml(booking.status || "—")}</p>
          <p><strong>Notes:</strong> ${escapeHtml(booking.notes || "—")}</p>
        </div>
      </div>
    `;
    modalRoot.appendChild(overlay);
    overlay.querySelector("#closeModalBtn").addEventListener("click", closeModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  }

  function closeModal() {
    const modal = document.getElementById("bookingModal");
    if (modal) modal.remove();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const bookings = await loadBookings();
    renderSummary(bookings);
    renderCards(bookings);

    document.addEventListener("click", e => {
      const btn = e.target.closest(".viewDetailsBtn");
      if (!btn) return;
      const id = btn.dataset.id;
      const booking = bookings.find(b => (b.id === id || b.bookingRef === id));
      if (booking) openDetailsModal(booking);
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        try { localStorage.removeItem("acumen_user"); } catch {}
        window.location.href = "../index.html";
      });
    }
  });
})();
