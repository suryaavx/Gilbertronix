document.addEventListener('DOMContentLoaded', function () {
    // Minimal Page Load Animation
    document.body.style.opacity = '0';
    
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    });
    // --- 3D Globe Background ---
    let scene, camera, renderer, globe, stars;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function initGlobe() {
        const canvas = document.getElementById('bg-globe');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2.5;

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Globe
        const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
        const globeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.15 });
        globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);

        // Stars
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            if(Math.sqrt(x*x + y*y + z*z) > 100) starVertices.push(x, y, z);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0x555555, size: 0.7 });
        stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    }

    function animateGlobe() {
        requestAnimationFrame(animateGlobe);
        
        globe.rotation.y += 0.0005;
        
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    
    initGlobe();
    animateGlobe();

    // --- UI Interactions ---
    const countdownDate = new Date('October 8, 2025 09:00:00').getTime();
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = `<div class="font-orbitron text-4xl font-bold text-primary">The Event is Live!</div>`;
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Enhanced Mobile Menu for Better Mobile Support
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    let isMenuOpen = false;
    
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        
        // Enhanced mobile menu toggle
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('-translate-y-full');
        
        // Hamburger animation
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
        mobileMenuButton.classList.toggle('active');
        
        // Better mobile handling
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            mobileMenu.style.transform = 'translateY(0)';
            mobileMenu.style.opacity = '1';
            mobileMenu.style.zIndex = '9999';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            mobileMenu.style.transform = 'translateY(-100%)';
            mobileMenu.style.opacity = '0';
        }
    };
    
    // Enhanced mobile menu button click with touch support
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMenu);
        mobileMenuButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleMenu();
        }, { passive: false });
    }
    
    // Close menu when clicking on links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });

    // Optimized Header Scroll Effects
    const header = document.getElementById('main-header');
    let ticking = false;
    
    const updateHeader = () => {
        const scrollTop = window.pageYOffset;
        header.classList.toggle('header-scrolled', scrollTop > 50);
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Content is always visible - animations disabled for stability
    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.classList.add('is-visible');
    });
    
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = -y / 25;
            const rotateY = x / 25;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1) translateY(0)';
        });
    });
});