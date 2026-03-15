// Sample data for suggestions (in a real app, this would come from an API)
const sampleData = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan-Dombivali",
    "Vasai-Virar",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Solapur",
    "Hubli-Dharwad",
    "Bareilly",
    "Moradabad",
    "Mysore",
    "Gurgaon",
    "Aligarh",
    "Jalandhar",
    "Tiruchirappalli",
    "Bhubaneswar",
    "Salem",
    "Warangal",
    "Mira-Bhayandar",
    "Thiruvananthapuram",
    "Bhiwandi",
    "Saharanpur",
    "Gorakhpur",
    "Guntur",
    "Bikaner",
    "Amravati",
    "Noida",
    "Jamshedpur",
    "Bhilai",
    "Cuttack",
    "Firozabad",
    "Kochi",
    "Nellore",
    "Bhavnagar",
    "Dehradun",
    "Durgapur",
    "Asansol",
    "Rourkela",
    "Nanded",
    "Kolhapur",
    "Ajmer",
    "Akola",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Siliguri",
    "Jhansi",
    "Ulhasnagar",
    "Jammu",
    "Sangli-Miraj",
    "Mangalore",
    "Erode",
    "Belgaum",
    "Ambattur",
    "Tirunelveli",
    "Malegaon",
    "Gaya",
    "Jalgaon",
    "Udaipur",
    "Maheshtala",
    "Tirupur",
    "Davanagere",
    "Kozhikode",
    "Akbarpur",
    "Kurnool",
    "Bokaro",
    "Rajahmundry",
    "Ballari",
    "Agartala",
    "Bhagalpur",
    "Latur",
    "Dhule",
    "Korba",
    "Bhilwara",
    "Brahmapur",
    "Muzaffarpur",
    "Ahmednagar",
    "Mathura",
    "Kollam",
    "Avadi",
    "Kadapa",
    "Anantapur",
    "Tiruvottiyur",
    "Karnal",
    "Bathinda",
    "Rampur",
    "Shivamogga",
    "Ratlam",
    "Modinagar",
    "Durg",
    "Shillong",
    "Imphal",
    "Hapur",
    "Ranipet",
    "Anand",
    "Munger",
    "Bhind",
    "Rajpur Sonarpur",
    "Bhiwani",
    "Madanapalle",
    "Siwan",
    "Bettiah",
    "Gandhidham",
    "Guna",
    "Pali",
    "Purnia",
    "Baharampur",
    "Barmer",
    "Navi Mumbai",
    "Thane",
    "Vasai",
    "Kalyan",
    "Dombivali",
    "Ulhasnagar",
    "Bhiwandi",
    "Mira-Bhayandar",
    "Panvel",
    "Badlapur",
    "Ambernath",
    "Karjat",
    "Khopoli",
    "Matheran",
    "Lonavala",
    "Khandala",
    "Alibaug",
    "Murud",
    "Dapoli",
    "Ratnagiri",
    "Sindhudurg",
    "Goa",
    "Pondicherry",
    "Kerala",
    "Karnataka",
    "Tamil Nadu",
    "Andhra Pradesh",
    "Telangana",
    "Maharashtra",
    "Gujarat",
    "Rajasthan",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Bihar",
    "West Bengal",
    "Odisha",
    "Jharkhand",
    "Chhattisgarh",
    "Assam",
    "Punjab",
    "Haryana",
    "Himachal Pradesh",
    "Uttarakhand",
    "Jammu and Kashmir",
    "Manipur",
    "Meghalaya",
    "Tripura",
    "Nagaland",
    "Arunachal Pradesh",
    "Mizoram",
    "Sikkim"
];

// Global variables for destination filtering
let currentDestinationFilter = null;
let allTravelData = [];
let filteredTravelData = [];

// Global function to filter travel cards based on destination
function filterTravelCardsByDestination(destination) {
    if (!destination || destination.trim() === '') {
        // If no destination, show all cards
        currentDestinationFilter = null;
        filteredTravelData = [...allTravelData];
        renderFilteredCards();
        return;
    }

    currentDestinationFilter = destination.trim();
    
    // Filter cards that have the destination in their destinations array
    filteredTravelData = allTravelData.filter(item => {
        if (!item.destinations || !Array.isArray(item.destinations)) {
            return false;
        }
        return item.destinations.some(dest => 
            dest.toLowerCase().includes(currentDestinationFilter.toLowerCase())
        );
    });

    renderFilteredCards();
}

// Function to render filtered cards with smooth animations
function renderFilteredCards() {
    const cardsContainer = document.getElementById("apiCards");
    const loader = document.getElementById("loader");
    const filterStatus = document.getElementById("filterStatus");
    const filterStatusText = document.getElementById("filterStatusText");
    
    if (!cardsContainer) return;

    // Show/hide filter status indicator
    if (filterStatus && filterStatusText) {
        if (currentDestinationFilter) {
            filterStatusText.textContent = `Showing trips for "${currentDestinationFilter}"`;
            filterStatus.classList.remove("hidden");
        } else {
            filterStatus.classList.add("hidden");
        }
    }

    // Show loader during filtering
    if (loader) {
        loader.classList.remove("hidden");
        loader.textContent = currentDestinationFilter ? `Finding trips for ${currentDestinationFilter}...` : "Loading all trips...";
    }

    // Clear existing cards with fade out effect
    const existingCards = cardsContainer.querySelectorAll('.travel-card');
    existingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) translateY(20px)';
        }, index * 50);
    });

    // Render new cards after a short delay
    setTimeout(() => {
        cardsContainer.innerHTML = "";
        
        if (filteredTravelData.length === 0) {
            // Show no results message
            cardsContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="max-w-md mx-auto">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                        <p class="text-gray-500 mb-4">
                            ${currentDestinationFilter ? `We couldn't find any trips for "${currentDestinationFilter}".` : 'No trips available at the moment.'}
                        </p>
                        ${currentDestinationFilter ? `
                            <button onclick="clearDestinationFilter()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                Show All Trips
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            // Render filtered cards with smooth animations
            filteredTravelData.forEach((item, index) => {
                const card = document.createElement("div");
                card.className = `
                    travel-card relative rounded-2xl overflow-hidden shadow-lg border border-gray-200
                    transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group
                    opacity-0 scale-95 translate-y-4
                `;
                card.innerHTML = `
                    <!-- Background Image with overlay inside -->
                    <div class="relative h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                         style="background-image: url('${item.image || "https://source.unsplash.com/800x600/?travel"}')">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        ${currentDestinationFilter ? `
                            <div class="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                ${currentDestinationFilter}
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Content -->
                    <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 class="text-lg sm:text-xl font-semibold mb-2 group-hover:text-yellow-300 transition-colors">
                            ${item.title}
                        </h3>
                        <p class="text-sm sm:text-base mb-4">${item.description}</p>
                        <button class="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition">
                            Explore
                        </button>
                    </div>
                `;
                cardsContainer.appendChild(card);

                // Animate card entrance
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, index * 100);
            });
        }

        // Hide loader
        if (loader) {
            loader.classList.add("hidden");
        }
    }, 300);
}

// Function to clear destination filter
function clearDestinationFilter() {
    currentDestinationFilter = null;
    filteredTravelData = [...allTravelData];
    renderFilteredCards();
}

// Function to initialize travel data (called from api.js)
function initializeTravelData(data) {
    allTravelData = data;
    filteredTravelData = [...data];
}

// Function to get current destination filter
function getCurrentDestinationFilter() {
    return currentDestinationFilter;
}

class SearchBox {
    constructor(containerId, dropdownId, selectedOptionId, suggestionsContainerId, searchInputId) {
        this.container = document.getElementById(containerId);
        this.searchDropdown = document.getElementById(dropdownId);
        this.selectedOption = document.getElementById(selectedOptionId);
        this.suggestionsContainer = document.getElementById(suggestionsContainerId);
        this.searchInput = document.getElementById(searchInputId);
        this.selectedIndex = -1;
        this.filteredData = [];
        this.isOpen = false;
        this.debounceTimer = null;
        
        if (this.container && this.searchDropdown && this.selectedOption && this.suggestionsContainer && this.searchInput) {
            this.init();
        }
    }

    init() {
        // Add event listeners
        this.searchDropdown.addEventListener('click', (e) => this.toggleDropdown(e));
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // Initialize with all options
        this.filteredData = sampleData;
        this.displayOptions();
    }

    toggleDropdown(e) {
        e.preventDefault();
        if (this.isOpen) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }

    showDropdown() {
        this.isOpen = true;
        this.suggestionsContainer.classList.remove('hidden');
        this.searchDropdown.classList.add('ring-2', 'ring-blue-500');
        // Focus on search input when dropdown opens
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    }

    hideDropdown() {
        this.isOpen = false;
        this.suggestionsContainer.classList.add('hidden');
        this.searchDropdown.classList.remove('ring-2', 'ring-blue-500');
        this.selectedIndex = -1;
        // Clear search input when dropdown closes
        this.searchInput.value = '';
        this.filteredData = sampleData;
        this.displayOptions();
    }

    handleInput(e) {
        const query = e.target.value.trim();
        
        // Clear previous timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Debounce the search to avoid too many API calls
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    performSearch(query) {
        if (query.length === 0) {
            this.filteredData = sampleData;
        } else {
            // Filter data based on query (case-insensitive)
            this.filteredData = sampleData.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            );
        }

        this.displayOptions();
    }

    handleKeydown(e) {
        const options = this.suggestionsContainer.querySelectorAll('.option-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, options.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredData.length) {
                    this.selectOption(this.selectedIndex);
                }
                break;
                
            case 'Escape':
                this.hideDropdown();
                break;
        }
    }

    updateSelection() {
        const options = this.suggestionsContainer.querySelectorAll('.option-item');
        
        options.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('bg-blue-100');
            } else {
                item.classList.remove('bg-blue-100');
            }
        });
    }

    displayOptions() {
        const searchQuery = this.searchInput.value.trim();
        
        if (this.filteredData.length === 0) {
            this.suggestionsContainer.innerHTML = `
                <div class="p-3 text-gray-500 text-center text-sm">
                    No cities found matching "${searchQuery}"
                </div>
            `;
            return;
        }

        const optionsHtml = this.filteredData
            .map((item, index) => `
                <div class="option-item p-2 sm:p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${index === this.selectedIndex ? 'bg-blue-100' : ''}" 
                     data-index="${index}">
                    <div class="flex items-center">
                        <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="text-sm sm:text-base">${this.highlightMatch(item, searchQuery)}</span>
                    </div>
                </div>
            `)
            .join('');

        // Find the search input container and insert options after it
        const searchContainer = this.suggestionsContainer.querySelector('.sticky');
        if (searchContainer) {
            // Remove existing options
            const existingOptions = this.suggestionsContainer.querySelectorAll('.option-item');
            existingOptions.forEach(option => option.remove());
            
            // Add new options after search container
            searchContainer.insertAdjacentHTML('afterend', optionsHtml);
        }

        // Add click event listeners to option items
        this.suggestionsContainer.querySelectorAll('.option-item').forEach((item, index) => {
            item.addEventListener('click', () => this.selectOption(index));
        });
    }

    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }

    selectOption(index) {
        const selectedValue = this.filteredData[index];
        this.selectedOption.textContent = selectedValue;
        this.selectedOption.classList.remove('text-gray-500');
        this.selectedOption.classList.add('text-gray-900');
        this.hideDropdown();
        
        // 🔹 NEW: Filter travel cards when destination is selected
        filterTravelCardsByDestination(selectedValue);
    }
}

// Initialize search boxes when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile search
    new SearchBox(
        'mobileSearchContainer', 
        'searchDropdown', 
        'selectedOption', 
        'suggestionsContainer', 
        'searchInput'
    );
    
    // Initialize desktop search
    new SearchBox(
        'desktopSearchContainer', 
        'searchDropdownDesktop', 
        'selectedOptionDesktop', 
        'suggestionsContainerDesktop', 
        'searchInputDesktop'
    );
    
    // Fallback: if containers don't exist, try to initialize with existing elements
    if (!document.getElementById('mobileSearchContainer') && !document.getElementById('desktopSearchContainer')) {
        // Try to find existing search elements and initialize
        const searchDropdown = document.getElementById('searchDropdown');
        const selectedOption = document.getElementById('selectedOption');
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        const searchInput = document.getElementById('searchInput');
        
        if (searchDropdown && selectedOption && suggestionsContainer && searchInput) {
            new SearchBox('searchContainer', 'searchDropdown', 'selectedOption', 'suggestionsContainer', 'searchInput');
        }
    }
    
    // 🔹 NEW: Listen for booking form submissions to filter cards
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Use validation from booking.js
            if (typeof window.validateBookingForm === 'function' && !window.validateBookingForm()) {
                return; // Validation failed, don't proceed
            }
            
            const destinationInput = document.getElementById('destination');
            if (destinationInput && destinationInput.value.trim()) {
                const destination = destinationInput.value.trim();
                
                // Update search dropdowns to show selected destination
                const selectedOptions = document.querySelectorAll('#selectedOption, #selectedOptionDesktop');
                selectedOptions.forEach(option => {
                    option.textContent = destination;
                    option.classList.remove('text-gray-500');
                    option.classList.add('text-gray-900');
                });
                
                // Filter travel cards based on destination
                filterTravelCardsByDestination(destination);
                
                // Show success message
                const resultBox = document.getElementById('bookingResult');
                if (resultBox) {
                    resultBox.innerHTML = `
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <p class="text-green-800 font-medium">Booking submitted successfully!</p>
                            </div>
                            <p class="text-green-700 text-sm mt-1">Showing travel options for ${destination}</p>
                        </div>
                        <p><strong>Destination:</strong> ${destination}</p>
                        <p><strong>Check-in:</strong> ${document.getElementById('checkin').value}</p>
                        <p><strong>Check-out:</strong> ${document.getElementById('checkout').value}</p>
                        <p><strong>Guests:</strong> ${document.getElementById('guests').value}</p>
                    `;
                    resultBox.classList.remove("hidden");
                }
                
                // Reset form after successful submission
                bookingForm.reset();
                
                // Reapply default values after reset
                const checkinInput = document.getElementById('checkin');
                const checkoutInput = document.getElementById('checkout');
                if (checkinInput && checkoutInput) {
                    const today = new Date();
                    const todayStr = today.toISOString().split('T')[0];
                    checkinInput.min = todayStr;
                    checkoutInput.min = todayStr;
                    checkinInput.value = todayStr;
                    checkoutInput.value = todayStr;
                }
            }
        });
    }
}); 