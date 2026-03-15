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
}); 