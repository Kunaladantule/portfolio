document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('is-active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('is-active');
            navMenu.classList.remove('active');
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Active Link Highlighting ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust offset for the sticky header
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Reveal Elements on Scroll (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // --- Set Current Year in Footer ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Form Submission via Web3Forms ---
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    btn.innerHTML = 'Message Sent! <i class="fa-solid fa-check"></i>';
                    btn.style.background = '#25D366'; // Success green
                    contactForm.reset();
                } else {
                    btn.innerHTML = 'Error Sending <i class="fa-solid fa-xmark"></i>';
                    btn.style.background = '#ff5f56'; // Error red
                    console.error("Error from Web3Forms:", data);
                }
            } catch (error) {
                console.error("Submission failed:", error);
                btn.innerHTML = 'Error Sending <i class="fa-solid fa-xmark"></i>';
                btn.style.background = '#ff5f56';
            }
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = ''; // reset to default
                btn.disabled = false;
            }, 4000);
        });
    }
});