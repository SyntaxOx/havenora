// ========================================
// CONTACT FORM
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}
