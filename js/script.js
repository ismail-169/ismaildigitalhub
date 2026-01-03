document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 30 : 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = ['#00f6ff', '#ff006e', '#39ff14', '#bf00ff'][Math.floor(Math.random() * 4)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    let animationId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 246, 255, ${0.2 - distance / 500})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    }

    init();
    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const newIsMobile = window.innerWidth <= 768;
        const newParticleCount = newIsMobile ? 30 : 100;
        
        if (newParticleCount !== particles.length) {
            particles.length = 0;
            for (let i = 0; i < newParticleCount; i++) {
                particles.push(new Particle());
            }
        }
    });

    const modeBtns = document.querySelectorAll('.mode-btn');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroTagline = document.getElementById('heroTagline');
    const developerContent = document.getElementById('developerContent');
    const supportContent = document.getElementById('supportContent');

    const content = {
        developer: {
            subtitle: 'Full-Stack Web3 Developer',
            tagline: 'Building the future of decentralized infrastructure. Specializing in blockchain development, dApp creation, and cross-chain solutions.'
        },
        support: {
            subtitle: 'Customer Support Specialist | Web3 & Trading Platform Support',
            tagline: 'Combining technical expertise with exceptional support skills. Helping users navigate the complexities of Web3, crypto trading, and blockchain technology.'
        }
    };

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = this.getAttribute('data-mode');

            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            heroSubtitle.style.opacity = '0';
            heroTagline.style.opacity = '0';
            
            setTimeout(() => {
                heroSubtitle.textContent = content[mode].subtitle;
                heroTagline.textContent = content[mode].tagline;
                heroSubtitle.style.opacity = '1';
                heroTagline.style.opacity = '1';
            }, 200);

            if (mode === 'developer') {
                developerContent.classList.add('active');
                supportContent.classList.remove('active');
            } else {
                supportContent.classList.add('active');
                developerContent.classList.remove('active');
            }

            setTimeout(() => {
                const firstSection = mode === 'developer' ? 
                    document.querySelector('#developerContent .section-container') : 
                    document.querySelector('#supportContent .section-container');
                if (firstSection) {
                    firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    });

    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .skill-category, .project-card, .value-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    let autoScrollEnabled = false;
    let hasAutoScrolled = false;

    const autoScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && 
                developerContent.classList.contains('active') && 
                !hasAutoScrolled &&
                autoScrollEnabled) {
                
                setTimeout(() => {
                    modeBtns.forEach(b => b.classList.remove('active'));
                    document.querySelector('[data-mode="support"]').classList.add('active');
                    
                    heroSubtitle.style.opacity = '0';
                    heroTagline.style.opacity = '0';
                    
                    setTimeout(() => {
                        heroSubtitle.textContent = content.support.subtitle;
                        heroTagline.textContent = content.support.tagline;
                        heroSubtitle.style.opacity = '1';
                        heroTagline.style.opacity = '1';
                    }, 200);

                    supportContent.classList.add('active');
                    developerContent.classList.remove('active');
                    
                    hasAutoScrolled = true;
                    
                    setTimeout(() => {
                        const firstSupportSection = document.querySelector('#supportContent .section-container');
                        if (firstSupportSection) {
                            firstSupportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                }, 500);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    const lastDeveloperElement = document.querySelector('#developerContent .value-grid');
    if (lastDeveloperElement) {
        autoScrollObserver.observe(lastDeveloperElement);
    }

    setTimeout(() => {
        autoScrollEnabled = true;
    }, 2000);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            hasAutoScrolled = false;
        }, true);
    });
});