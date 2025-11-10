// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.counter, .stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.innerText);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counter animation
if (document.querySelector('.counter') || document.querySelector('.stat-number')) {
    animateCounter();
}

// Donation Page Functionality
if (window.location.pathname.includes('donate')) {
    let selectedAmount = 0;

    // Amount selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');

    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedAmount = parseInt(button.dataset.amount);
            if (customAmountInput) customAmountInput.value = '';
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            selectedAmount = parseInt(customAmountInput.value) || 0;
        });
    }

    // Donate button handler
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
        donateBtn.addEventListener('click', function() {
            const amountInput = selectedAmount || parseInt(document.getElementById('customAmount')?.value) || 0;
            const helpType = document.getElementById('helpType')?.value || document.getElementById('help-type')?.value;

            if (!amountInput || amountInput < 1 || !helpType) {
                alert('Please enter a valid amount (minimum 1 INR) and select a help type.');
                return;
            }

            const amount = parseInt(amountInput) * 100; // Convert to paise

            const options = {
                key: 'rzp_test_RJSVyDHXWzqylO',
                amount: amount,
                currency: 'INR',
                name: 'Hope Foundation',
                description: `Donation for ${helpType}`,
                handler: function (response) {
                    alert('Donation successful. Payment id: ' + response.razorpay_payment_id);

                    // Generate PDF receipt using jsPDF
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();

                    doc.setFontSize(16);
                    doc.text("Donation Receipt", 20, 20);
                    doc.setFontSize(12);
                    doc.text(`Payment ID: ${response.razorpay_payment_id}`, 20, 40);
                    doc.text(`Amount: ₹${(amount / 100).toFixed(2)}`, 20, 50);
                    doc.text("Thank you for your generous support!", 20, 70);

                    doc.save(`donation_receipt_${response.razorpay_payment_id}.pdf`);
                },
                prefill: {name:'', email:''},
                theme: {color: '#0b74de'}
            };

            const rzp = new Razorpay(options);
            rzp.open();
        });
    }
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Initialize EmailJS with your public key
        emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key

        const formData = {
            from_name: document.getElementById('contactName').value,
            from_email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // Send email using EmailJS
        emailjs.send('service_vg5qa5p', 'template_ig3use8', formData)
            .then(function(response) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }, function(error) {
                console.error('Error:', error);
                alert('Failed to send message. Please try again.');
            });
    });
}

// Volunteer Form Handler
const volunteerForm = document.getElementById('volunteerForm');
if (volunteerForm) {
    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: volunteerForm.querySelector('input[placeholder="Your Name"]').value,
            email: volunteerForm.querySelector('input[placeholder="Email Address"]').value,
            phone: volunteerForm.querySelector('input[placeholder="Phone Number"]').value,
            skills: volunteerForm.querySelector('select').value,
            message: 'Volunteer registration from website'
        };

        // Initialize EmailJS with your public key
        emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key

        // Send email using EmailJS
        emailjs.send('service_vg5qa5p', 'template_ig3use8', formData)
            .then(function(response) {
                alert('Thank you for your interest in volunteering! We will contact you soon.');
                volunteerForm.reset();
            }, function(error) {
                console.error('Error:', error);
                alert('Failed to submit form. Please try again.');
            });
    });
}

// Newsletter Form Handler
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
        }
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
        
        // Close other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
    });
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card, .completed-project');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category?.includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Success Modal
function showSuccessModal(paymentId) {
    const modal = document.getElementById('successModal');
    if (modal) {
        const transactionElement = modal.querySelector('.transaction-id');
        if (transactionElement) {
            transactionElement.textContent = `Transaction ID: ${paymentId}`;
        }
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with close button
const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Load animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .team-member, .stat-item').forEach(el => {
    observer.observe(el);
});
