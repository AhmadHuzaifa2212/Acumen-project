// Booking Form Logic 

const form = document.getElementById("bookingForm");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

if (form && checkinInput && checkoutInput) {
  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);

  checkinInput.min = todayStr;
  checkoutInput.min = todayStr;
  checkinInput.value = todayStr;
  checkoutInput.value = todayStr;

  checkinInput.addEventListener("change", () => {
    if (!checkinInput.value) return;
    const checkinDate = new Date(checkinInput.value);
    const checkinStr = formatDate(checkinDate);
    checkoutInput.min = checkinStr;
    if (!checkoutInput.value || new Date(checkoutInput.value) < checkinDate) {
      checkoutInput.value = checkinStr;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fromCity = (document.getElementById("fromCity")?.value || "").trim();
    const toCity = (document.getElementById("toCity")?.value || "").trim();
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);
    const guests = parseInt(document.getElementById("guests").value, 10);

    if (!fromCity || !toCity) return alert("Please provide both 'From' and 'To' cities.");
    if (!checkinInput.value || checkin < today) return alert("Departure date cannot be in the past.");
    if (!checkoutInput.value || checkout < checkin) return alert("Return date must be same day or after departure.");
    if (isNaN(guests) || guests < 1) return alert("Guests must be at least 1.");

    const nights = Math.max(1, Math.round((checkout - checkin) / (1000 * 60 * 60 * 24)));
    const price = guests * nights * 1000;

    const booking = {
      from: fromCity,
      to: toCity,
      checkIn: checkin.toISOString(),
      checkOut: checkout.toISOString(),
      guests,
      price
    };

    // Save booking to localStorage and go directly to Checkout
    localStorage.setItem("acumen_checkout", JSON.stringify(booking));
    window.location.href = "pages/checkout.html";
  });
}

