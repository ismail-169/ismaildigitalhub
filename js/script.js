document.addEventListener('DOMContentLoaded', function () {
    // ── LENIS SMOOTH SCROLL ──
    const lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smooth: true
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── GSAP + SCROLLTRIGGER ──
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ── HERO TEXT REVEAL ──
    gsap.to('.h-word', {
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.3
    });
    gsap.from('.hero-top', { opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero-bottom', { opacity: 0, y: 30, duration: 0.8, delay: 0.9, ease: 'power3.out' });

    // ── SCROLL-TRIGGERED REVEALS ──
    var reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(function (el, i) {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            delay: (i % 3) * 0.1
        });
    });

    // ── BENTO CARDS STAGGER ──
    gsap.utils.toArray('.bento-card').forEach(function (card) {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            opacity: 0,
            y: 50,
            duration: 0.7,
            ease: 'power3.out'
        });
    });

    // ── EXP ROWS SLIDE ──
    gsap.utils.toArray('.exp-row').forEach(function (row) {
        gsap.from(row, {
            scrollTrigger: {
                trigger: row,
                start: 'top 88%'
            },
            opacity: 0,
            x: -30,
            duration: 0.7,
            ease: 'power3.out'
        });
    });

    // ── NUMBER COUNTERS ──
    var numItems = document.querySelectorAll('.num-item');
    numItems.forEach(function (item) {
        var target = parseInt(item.dataset.target);
        var suffix = item.dataset.suffix || '';
        var numEl = item.querySelector('.num-val');

        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            once: true,
            onEnter: function () {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        var v = Math.floor(this.targets()[0].val);
                        numEl.textContent = v.toLocaleString() + suffix;
                    }
                });
            }
        });
    });

    // ── MARQUEE SPEED ON SCROLL ──
    var marqueeTrack = document.querySelector('.marquee-track');
    ScrollTrigger.create({
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: function (self) {
            var speed = 30 + Math.abs(self.getVelocity()) / 200;
            marqueeTrack.style.animationDuration = Math.max(8, 30 - speed * 0.3) + 's';
        }
    });

    // ── NAV SCROLL STATE ──
    var nav = document.querySelector('nav');
    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: function (self) {
            nav.style.borderBottomColor = self.progress > 0 ? '#222' : 'transparent';
            nav.style.background = self.progress > 0 ? 'rgba(12,12,12,0.9)' : 'rgba(12,12,12,0.7)';
        }
    });

    // ── MOBILE MENU ──
    var menuBtn = document.getElementById('menuBtn');
    var mobileNav = document.getElementById('mobileNav');
    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            menuBtn.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });

    // ── SMOOTH ANCHOR LINKS ──
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    // ── MAGNETIC HOVER ON CARDS (desktop) ──
    if (window.innerWidth > 768) {
        document.querySelectorAll('.bento-card, .contact-big, .hero-arrow').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, {
                    x: x * 0.08,
                    y: y * 0.08,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    // ── TAG CLOUD SHUFFLE ON HOVER ──
    document.querySelectorAll('.tag-cloud span').forEach(function (tag) {
        tag.addEventListener('mouseenter', function () {
            gsap.to(tag, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
        });
        tag.addEventListener('mouseleave', function () {
            gsap.to(tag, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // ── PARALLAX ON NUMBERS ──
    gsap.to('.numbers-grid', {
        scrollTrigger: {
            trigger: '.numbers',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -30,
        ease: 'none'
    });
});
