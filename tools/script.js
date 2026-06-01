const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = 'Please complete all fields before sending.';
            return;
        }

        formStatus.textContent = 'Preparing your custom financial roadmap...';
        contactForm.querySelector('button').disabled = true;

        setTimeout(() => {
            formStatus.textContent = `Thanks, ${name}! Your inquiry has been received. A DMPR Traders specialist will contact you shortly.`;
            contactForm.reset();
            contactForm.querySelector('button').disabled = false;
        }, 1400);
    });
}
