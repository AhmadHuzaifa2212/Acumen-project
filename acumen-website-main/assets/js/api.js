document.addEventListener("DOMContentLoaded", () => {
  // Create a global namespace to share data and functions
  window.acumenApp = {};

  const cardsContainer = document.getElementById("apiCards");
  const loader = document.getElementById("loader");
  const toast = document.getElementById("toast");

  async function fetchData() {
    loader.classList.remove("hidden");
    try {
      const response = await fetch("./assets/data/mock-data.json");
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      
      // Store data and render function globally
      window.acumenApp.allTravelData = data;
      window.acumenApp.renderCards = renderCards;

      renderCards(data);

      // Now that data is ready, load the filter script
      loadFilterScript();

    } catch (error) {
      console.error(error);
      showToast("Failed to load data. Please try again.", "error");
    } finally {
      loader.classList.add("hidden");
    }
  }

  function renderCards(data) {
    cardsContainer.innerHTML = "";
    if (data.length === 0) {
        cardsContainer.innerHTML = `<p class="text-center text-gray-500 col-span-full">No results match your criteria.</p>`;
        return;
    }
    data.forEach(item => {
      const card = document.createElement("div");
      card.className = `
        relative rounded-2xl overflow-hidden shadow-lg border border-gray-200
        transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group
      `;
      card.innerHTML = `
        <!-- Background Image with overlay inside -->
        <div class="relative h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
             style="background-image: url('${item.image || "https://source.unsplash.com/800x600/?travel"}')">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
          
          <!-- Price Badge -->
          <div class="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            $${item.price}
          </div>

          <!-- Rating Badge -->
          <div class="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full shadow-md flex items-center">
            <span class="material-icons text-base mr-1">star</span>
            <span>${item.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <!-- Content -->
        <div class="absolute bottom-0 left-0 right-0 p-5 text-white bg-gradient-to-t from-black/80 to-transparent">
          <h3 class="text-lg sm:text-xl font-semibold mb-1 group-hover:text-yellow-300 transition-colors">
            ${item.title}
          </h3>
          <p class="text-xs text-gray-300 mb-2">${item.location} - <span class="font-semibold">${item.type}</span></p>
          <p class="text-sm mb-4">${item.description}</p>
          <button class="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition">
            Explore
          </button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  }

  function loadFilterScript() {
      const script = document.createElement('script');
      script.src = './assets/js/filters.js';
      document.body.appendChild(script);
  }

  function showToast(message, type) {
    toast.textContent = message;
    toast.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white ${
      type === "error" ? "bg-red-600" : "bg-green-600"
    }`;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  }

  fetchData();
});
