document.addEventListener('DOMContentLoaded', function () {
    const isMobile = window.innerWidth <= 768;

    // ── INTERACTIVE DOT GRID BACKGROUND ──
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w, h, dots = [], mouse = { x: -1000, y: -1000 };
    const SPACING = isMobile ? 40 : 30;
    const DOT_R = 1;
    const INTERACT_R = isMobile ? 0 : 150;

    function initCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        dots = [];
        for (let x = 0; x < w; x += SPACING) {
            for (let y = 0; y < h; y += SPACING) {
                dots.push({ ox: x, oy: y, x: x, y: y });
            }
        }
    }

    function drawDots() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const dx = mouse.x - d.ox;
            const dy = mouse.y - d.oy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (INTERACT_R > 0 && dist < INTERACT_R) {
                const force = (1 - dist / INTERACT_R) * 12;
                d.x = d.ox - (dx / dist) * force;
                d.y = d.oy - (dy / dist) * force;
            } else {
                d.x += (d.ox - d.x) * 0.1;
                d.y += (d.oy - d.y) * 0.1;
            }

            const alpha = INTERACT_R > 0 && dist < INTERACT_R
                ? 0.15 + (1 - dist / INTERACT_R) * 0.5
                : 0.08;

            ctx.beginPath();
            ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.fill();
        }
        requestAnimationFrame(drawDots);
    }

    initCanvas();
    drawDots();
    window.addEventListener('resize', initCanvas);

    if (!isMobile) {
        document.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
    }

    // ── CURSOR GLOW ──
    if (!isMobile) {
        const glow = document.getElementById('cursorGlow');
        let gx = 0, gy = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', function (e) {
            gx = e.clientX;
            gy = e.clientY;
        });
        function animateGlow() {
            cx += (gx - cx) * 0.08;
            cy += (gy - cy) * 0.08;
            glow.style.left = cx + 'px';
            glow.style.top = cy + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ── NAV SCROLL ──
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── MOBILE MENU ──
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    toggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            mobileMenu.classList.remove('open');
        });
    });

    // ── TYPING EFFECT ──
    const titles = [
        'AI Data Trainer',
        'Annotation Specialist',
        'RLHF Evaluator',
        'Code Reviewer',
        'Prompt Engineer'
    ];
    const typingEl = document.getElementById('typingText');
    let titleIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = titles[titleIdx];
        if (isDeleting) {
            charIdx--;
            typingEl.textContent = current.substring(0, charIdx);
            if (charIdx === 0) {
                isDeleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 40);
        } else {
            charIdx++;
            typingEl.textContent = current.substring(0, charIdx);
            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 80);
        }
    }
    setTimeout(type, 1000);

    // ── STAT COUNTERS ──
    let statsCounted = false;
    const statsSection = document.getElementById('stats');

    function formatNumber(n) {
        if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
        return n.toString();
    }

    function countUp() {
        if (statsCounted) return;
        statsCounted = true;
        document.querySelectorAll('.stat-item').forEach(function (item) {
            const target = parseInt(item.dataset.target);
            const suffix = item.dataset.suffix || '';
            const numEl = item.querySelector('.stat-number');
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                numEl.textContent = formatNumber(current) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ── SCROLL REVEALS ──
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                if (entry.target === statsSection) {
                    countUp();
                }
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, index * 80);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
    observer.observe(statsSection);

    // also observe service cards & skill groups for stagger
    document.querySelectorAll('.service-card, .skill-group, .value-card, .timeline-item').forEach(function (el) {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
            observer.observe(el);
        }
    });

    // ── 3D TILT ON CARDS ──
    if (!isMobile) {
        document.querySelectorAll('[data-tilt]').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ── SCROLL TO TOP ──
    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function () {
        scrollBtn.classList.toggle('show', window.pageYOffset > 400);
    });
    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── SMOOTH NAV LINKS ──
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
