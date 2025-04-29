// EmailJS initialization
(function() {
    // Initialize with public key
    emailjs.init("dpj_SbgW_xKrELvT2");
})();

// Initialize Swiper
const swiper = new Swiper(".productSwiper", {
    loop: true,
    autoplay: {
        delay: 1000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    effect: "fade",
    fadeEffect: {
        crossFade: true
    }
});

// Language handling
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update dropdown selection
    document.querySelector('.lang-select').value = lang;

    // Update all translatable elements
    document.querySelectorAll('.translate').forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Set initial language based on stored preference or default to 'en'
document.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(storedLang);
});

// Modal elements
const modal = document.getElementById('orderModal');
const closeBtn = document.getElementsByClassName('close-btn')[0];
const orderForm = document.getElementById('orderForm');
const confirmationMessage = document.getElementById('confirmationMessage');

// Open order form
function openOrderForm(productName, price) {
    modal.style.display = 'block';
    document.getElementById('productName').value = productName;
    document.getElementById('productPrice').value = price;
}

// Close modal when clicking the close button
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    if (event.target == confirmationMessage) {
        confirmationMessage.style.display = 'none';
    }
}

// Handle form submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Match the email template variables exactly
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        product_name: document.getElementById('productName').value,
        product_price: document.getElementById('productPrice').value + ' DA',
        customer_address: document.getElementById('address').value,
        order_date: new Date().toLocaleString()
    };

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLanguage === 'ar' ? '...جاري الإرسال' : 
                               currentLanguage === 'fr' ? 'Envoi...' : 
                               'Sending...';

        // Send email using EmailJS
        const response = await emailjs.send(
            'service_saor93o',
            'template_t4wllwk',
            formData
        );

        console.log('Email sent successfully:', response);

        // Show confirmation message
        modal.style.display = 'none';
        confirmationMessage.style.display = 'block';
        
        // Reset form
        orderForm.reset();

        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Hide confirmation message after 3 seconds
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('Error details:', error);
        
        let errorMessage;
        if (error.text && error.text.includes('Gmail_API: Invalid grant')) {
            errorMessage = currentLanguage === 'ar' ? 'خطأ في الاتصال بخدمة البريد الإلكتروني. يرجى الاتصال بمسؤول الموقع.' :
                          currentLanguage === 'fr' ? 'Erreur de connexion au service de messagerie. Veuillez contacter l\'administrateur.' :
                          'Email service connection error. Please contact the administrator.';
        } else {
            errorMessage = currentLanguage === 'ar' ? 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.' :
                          currentLanguage === 'fr' ? 'Une erreur est survenue lors de l\'envoi de la commande. Veuillez réessayer.' :
                          'There was an error submitting your order. Please try again.';
        }
        
        alert(errorMessage);
        
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Image Slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.product-images');
    if (!slider) return;

    const images = slider.querySelectorAll('img');
    const dotsContainer = slider.querySelector('.image-dots');
    let currentIndex = 0;

    // Create dots
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showImage(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    // Navigation buttons
    slider.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    slider.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        images[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Auto-advance
    let interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 4000);

    // Pause auto-advance on hover
    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }, 4000);
    });
}); 