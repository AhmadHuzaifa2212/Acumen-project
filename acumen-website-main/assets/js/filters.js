document.addEventListener('DOMContentLoaded', () => {
    // Ensure this runs after api.js has fetched and stored the data
    if (!window.acumenApp || !window.acumenApp.allTravelData) {
        console.error("Filter script loaded before data was ready.");
        return;
    }

    const allData = window.acumenApp.allTravelData;
    const renderCards = window.acumenApp.renderCards;

    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const ratingFilter = document.getElementById('ratingFilter');
    const typeFilter = document.getElementById('typeFilter');
    const locationFilter = document.getElementById('locationFilter');

    let currentFilters = {
        price: 1000,
        rating: 0,
        types: [],
        location: ''
    };

    function applyFilters() {
        let filteredData = [...allData];

        // Price filter
        filteredData = filteredData.filter(item => item.price <= currentFilters.price);

        // Rating filter
        if (currentFilters.rating > 0) {
            filteredData = filteredData.filter(item => item.rating >= currentFilters.rating);
        }

        // Type filter
        if (currentFilters.types.length > 0) {
            filteredData = filteredData.filter(item => currentFilters.types.includes(item.type));
        }

        // Location filter
        if (currentFilters.location) {
            filteredData = filteredData.filter(item => item.location === currentFilters.location);
        }

        renderCards(filteredData);
    }

    // --- Populate Location Filter ---
    function populateLocations() {
        const locations = [...new Set(allData.map(item => item.location))];
        locations.sort();
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    }

    // --- Event Listeners ---

    // Price Range
    priceRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value, 10);
        priceValue.textContent = `$${value}`;
        currentFilters.price = value;
        applyFilters();
    });

    // Rating
    ratingFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('rating-btn')) {
            const rating = parseInt(e.target.dataset.rating, 10);
            
            // Toggle active state
            ratingFilter.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
            
            if (currentFilters.rating === rating) {
                currentFilters.rating = 0; // Deselect
            } else {
                currentFilters.rating = rating;
                e.target.classList.add('bg-blue-500', 'text-white');
            }
            
            applyFilters();
        }
    });

    // Hotel Type
    typeFilter.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const selectedTypes = [];
            typeFilter.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                selectedTypes.push(checkbox.value);
            });
            currentFilters.types = selectedTypes;
            applyFilters();
        }
    });

    // Location
    locationFilter.addEventListener('change', (e) => {
        currentFilters.location = e.target.value;
        applyFilters();
    });

    // Initial population
    populateLocations();
});
