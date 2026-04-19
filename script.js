document.addEventListener("DOMContentLoaded", () => {
    const pieces = Array.from(document.querySelectorAll('.art-piece'));
    const lightbox = document.getElementById('lightbox');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeButton = document.getElementById('lightbox-close');
    const filterButtons = Array.from(document.querySelectorAll('.gallery-filter button'));
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const updatesList = document.getElementById('updates-list');

    function openLightbox(title, description) {
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightbox.classList.remove('hidden');
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
    }

    pieces.forEach(piece => {
        piece.tabIndex = 0;
        piece.addEventListener('click', () => {
            openLightbox(piece.dataset.title, piece.dataset.description);
        });

        piece.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(piece.dataset.title, piece.dataset.description);
            }
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            pieces.forEach(piece => {
                const matches = filter === 'all' || piece.dataset.category === filter;
                piece.style.display = matches ? 'grid' : 'none';
            });
        });
    });

    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if (!name || !email) {
            formFeedback.textContent = 'Please enter your name and email.';
            formFeedback.style.color = '#c14d33';
            return;
        }

        formFeedback.textContent = `Thanks, ${name}! Your message has been received.`;
        formFeedback.style.color = '#7d5a50';
        updatesList.insertAdjacentHTML('afterbegin', `<li>Message received from ${name}</li>`);
        contactForm.reset();

        setTimeout(() => {
            formFeedback.textContent = '';
        }, 5000);
    });
});

