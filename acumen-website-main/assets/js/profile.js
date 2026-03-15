// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Form elements
  const profileForm = document.getElementById('profileForm');
  const resetBtn = document.getElementById('resetBtn');
  const messageContainer = document.getElementById('messageContainer');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  // Input fields
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const preferredDestinationSelect = document.getElementById('preferredDestination');
  const travelStyleSelect = document.getElementById('travelStyle');
  const accommodationTypeSelect = document.getElementById('accommodationType');
  const groupSizeSelect = document.getElementById('groupSize');
  const emailNotificationsCheckbox = document.getElementById('emailNotifications');
  const smsNotificationsCheckbox = document.getElementById('smsNotifications');
  const marketingCommunicationsCheckbox = document.getElementById('marketingCommunications');

  // Error elements
  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // Logout functionality
  const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnDesktop');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear local storage
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userLoginStatus');
      
      // Redirect to home page
      window.location.href = '../index.html';
    });
  });

  // Default profile data
  const defaultProfileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDestination: '',
    travelStyle: '',
    accommodationType: '',
    groupSize: '',
    emailNotifications: false,
    smsNotifications: false,
    marketingCommunications: false
  };

  // Load profile data from local storage
  function loadProfileData() {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      try {
        const profileData = JSON.parse(savedData);
        populateForm(profileData);
      } catch (error) {
        console.error('Error loading profile data:', error);
        populateForm(defaultProfileData);
      }
    } else {
      populateForm(defaultProfileData);
    }
  }

  // Populate form with data
  function populateForm(data) {
    firstNameInput.value = data.firstName || '';
    lastNameInput.value = data.lastName || '';
    emailInput.value = data.email || '';
    phoneInput.value = data.phone || '';
    preferredDestinationSelect.value = data.preferredDestination || '';
    travelStyleSelect.value = data.travelStyle || '';
    accommodationTypeSelect.value = data.accommodationType || '';
    groupSizeSelect.value = data.groupSize || '';
    emailNotificationsCheckbox.checked = data.emailNotifications || false;
    smsNotificationsCheckbox.checked = data.smsNotifications || false;
    marketingCommunicationsCheckbox.checked = data.marketingCommunications || false;
  }

  // Save profile data to local storage
  function saveProfileData(data) {
    try {
      localStorage.setItem('userProfile', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving profile data:', error);
      return false;
    }
  }

  // Validation functions
  function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === '') {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
      return null; // Phone is optional
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  function validateName(name, fieldName) {
    if (!name || name.trim() === '') {
      return `${fieldName} is required`;
    }
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters long`;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return `${fieldName} can only contain letters and spaces`;
    }
    return null;
  }

  // Show error message
  function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
    element.previousElementSibling.classList.add('border-red-500');
    element.previousElementSibling.classList.remove('border-gray-300');
  }

  // Hide error message
  function hideError(element) {
    element.classList.add('hidden');
    element.previousElementSibling.classList.remove('border-red-500');
    element.previousElementSibling.classList.add('border-gray-300');
  }

  // Clear all errors
  function clearAllErrors() {
    [firstNameError, lastNameError, emailError, phoneError].forEach(error => {
      hideError(error);
    });
  }

  // Show success message
  function showSuccessMessage() {
    messageContainer.classList.remove('hidden');
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageContainer.classList.add('hidden');
      successMessage.classList.add('hidden');
    }, 5000);
  }

  // Show error message
  function showErrorMessage() {
    messageContainer.classList.remove('hidden');
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageContainer.classList.add('hidden');
      errorMessage.classList.add('hidden');
    }, 5000);
  }

  // Validate form
  function validateForm() {
    clearAllErrors();
    let isValid = true;

    // Validate first name
    const firstNameErrorMsg = validateName(firstNameInput.value, 'First name');
    if (firstNameErrorMsg) {
      showError(firstNameError, firstNameErrorMsg);
      isValid = false;
    }

    // Validate last name
    const lastNameErrorMsg = validateName(lastNameInput.value, 'Last name');
    if (lastNameErrorMsg) {
      showError(lastNameError, lastNameErrorMsg);
      isValid = false;
    }

    // Validate email
    const emailErrorMsg = validateEmail(emailInput.value);
    if (emailErrorMsg) {
      showError(emailError, emailErrorMsg);
      isValid = false;
    }

    // Validate phone (optional)
    const phoneErrorMsg = validatePhone(phoneInput.value);
    if (phoneErrorMsg) {
      showError(phoneError, phoneErrorMsg);
      isValid = false;
    }

    return isValid;
  }

  // Collect form data
  function collectFormData() {
    return {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      preferredDestination: preferredDestinationSelect.value,
      travelStyle: travelStyleSelect.value,
      accommodationType: accommodationTypeSelect.value,
      groupSize: groupSizeSelect.value,
      emailNotifications: emailNotificationsCheckbox.checked,
      smsNotifications: smsNotificationsCheckbox.checked,
      marketingCommunications: marketingCommunicationsCheckbox.checked
    };
  }

  // Form submission handler
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showErrorMessage();
        return;
      }

      const formData = collectFormData();
      
      // Simulate API call delay
      const submitBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-icons mr-2 animate-spin">refresh</span>Saving...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const success = saveProfileData(formData);
        
        if (success) {
          showSuccessMessage();
          
          // Update user login status if email is provided
          if (formData.email) {
            localStorage.setItem('userLoginStatus', JSON.stringify({
              isLoggedIn: true,
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`.trim()
            }));
          }
        } else {
          showErrorMessage();
        }

        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // Reset button handler
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all fields to default values? This action cannot be undone.')) {
        populateForm(defaultProfileData);
        clearAllErrors();
        messageContainer.classList.add('hidden');
      }
    });
  }

  // Real-time validation
  firstNameInput.addEventListener('blur', () => {
    const error = validateName(firstNameInput.value, 'First name');
    if (error) {
      showError(firstNameError, error);
    } else {
      hideError(firstNameError);
    }
  });

  lastNameInput.addEventListener('blur', () => {
    const error = validateName(lastNameInput.value, 'Last name');
    if (error) {
      showError(lastNameError, error);
    } else {
      hideError(lastNameError);
    }
  });

  emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    if (error) {
      showError(emailError, error);
    } else {
      hideError(emailError);
    }
  });

  phoneInput.addEventListener('blur', () => {
    const error = validatePhone(phoneInput.value);
    if (error) {
      showError(phoneError, error);
    } else {
      hideError(phoneError);
    }
  });

  // Clear errors on input
  [firstNameInput, lastNameInput, emailInput, phoneInput].forEach(input => {
    input.addEventListener('input', () => {
      const errorElement = document.getElementById(input.id + 'Error');
      if (errorElement) {
        hideError(errorElement);
      }
    });
  });

  // Load profile data on page load
  loadProfileData();

  // Check if user is logged in
  const loginStatus = localStorage.getItem('userLoginStatus');
  if (!loginStatus) {
    // Redirect to home page if not logged in
    window.location.href = '../index.html';
  }
});
