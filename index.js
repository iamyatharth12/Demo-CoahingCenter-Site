document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger
    if (window.gsap) gsap.registerPlugin(ScrollTrigger);

    /* ====================================================
       1. ACTIVE NAV LINK — highlight current page
       ==================================================== */
    const currentPath = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ====================================================
       2. MOBILE MENU — hamburger toggle
       ==================================================== */
    const navToggle = document.querySelector(".nav-toggle");
    const navbar = document.querySelector(".navbar");
    if (navToggle && navbar) {
        navToggle.addEventListener("click", () => {
            navbar.classList.toggle("nav-open");
        });
        // Close menu when a link is clicked (mobile)
        document.querySelectorAll(".nav-links a").forEach(a => {
            a.addEventListener("click", () => navbar.classList.remove("nav-open"));
        });
    }

    /* ====================================================
       3. HERO ANIMATIONS (Home only)
       ==================================================== */
    if (document.querySelector(".hero-title")) {
        const heroTl = gsap.timeline();
        heroTl.from(".hero-title", {
            y: 100, opacity: 0, duration: 1, ease: "power4.out"
        })
        .from(".hero-subtitle", {
            y: 50, opacity: 0, duration: 0.8, ease: "power3.out"
        }, "-=0.6")
        .from(".hero-ctas", {
            y: 50, opacity: 0, duration: 0.8, ease: "power3.out"
        }, "-=0.6")
        .from(".image-wrapper", {
            scale: 0.9, opacity: 0, duration: 1.2, ease: "power4.out"
        }, "-=1");
    }

    /* ====================================================
       4. COUNTERS — animate any .counter with data-target
       ==================================================== */
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        const suffix = counter.getAttribute("data-suffix") || "";
        const triggerEl = counter.closest(".trust-strip, .results-highlight, .section-pad, .section-pad-dark, .page-hero") || counter;
        ScrollTrigger.create({
            trigger: triggerEl,
            start: "top 85%",
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        counter.innerHTML = Math.round(obj.val).toLocaleString() + suffix;
                    }
                });
            },
            once: true
        });
    });

    /* ====================================================
       5. GENERIC FADE-UP — any [data-animate="fade-up"]
       ==================================================== */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
        gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true
            }
        });
    });

    /* ====================================================
       6. STAGGERED FADE-UP — [data-animate="stagger-up"] children
       ==================================================== */
    document.querySelectorAll('[data-animate="stagger-up"]').forEach(parent => {
        const children = parent.children;
        gsap.from(children, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
                trigger: parent,
                start: "top 85%",
                once: true
            }
        });
    });

    /* ====================================================
       7. PAGE-HERO ENTRANCE
       ==================================================== */
    if (document.querySelector(".page-hero h1")) {
        gsap.from(".page-hero .breadcrumb", {
            y: 20, opacity: 0, duration: 0.6, ease: "power2.out"
        });
        gsap.from(".page-hero h1", {
            y: 60, opacity: 0, duration: 0.9, ease: "power4.out", delay: 0.15
        });
        gsap.from(".page-hero p", {
            y: 30, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.4
        });
    }

    /* ====================================================
       8. COURSE EXPLORER TABS
       ==================================================== */
    const courseTabs = document.querySelectorAll(".course-tab");
    const courseDetails = document.querySelectorAll(".course-detail");
    if (courseTabs.length) {
        courseTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-course");
                courseTabs.forEach(t => t.classList.remove("active"));
                courseDetails.forEach(d => d.classList.remove("active"));
                tab.classList.add("active");
                const detail = document.getElementById("course-" + target);
                if (detail) detail.classList.add("active");
            });
        });
    }

    /* ====================================================
       9. GALLERY LIGHTBOX
       ==================================================== */
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        const lightboxImg = lightbox.querySelector("img");
        const lightboxClose = lightbox.querySelector(".lightbox-close");
        document.querySelectorAll(".gallery-item").forEach(item => {
            item.addEventListener("click", () => {
                const img = item.querySelector("img");
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add("open");
                }
            });
        });
        const closeLightbox = () => lightbox.classList.remove("open");
        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
        });
    }

    /* ====================================================
       10. FILTER CHIPS (testimonials, gallery) — visual only
       ==================================================== */
    document.querySelectorAll(".filter-group").forEach(group => {
        const chips = group.querySelectorAll(".filter-chip");
        const targetSelector = group.getAttribute("data-filter-target");
        if (!targetSelector) return;
        const items = document.querySelectorAll(targetSelector);
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                chips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                const filter = chip.getAttribute("data-filter");
                items.forEach(item => {
                    if (filter === "all" || item.getAttribute("data-cat") === filter) {
                        item.style.display = "";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    });

    /* ====================================================
       11. FORM SUBMISSION (any form)
       ==================================================== */
    document.querySelectorAll("form.js-form").forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector("button[type=submit]");
            if (!btn) return;
            const originalText = btn.innerText;
            btn.innerText = "Submitting...";
            btn.style.backgroundColor = "var(--success)";
            setTimeout(() => {
                btn.innerText = "Sent Successfully ✓";
                form.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "";
                }, 3000);
            }, 1200);
        });
    });

    /* ====================================================
       12. TIMELINE ITEMS — staggered reveal
       ==================================================== */
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (timelineItems.length) {
        gsap.from(timelineItems, {
            x: -30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top 80%",
                once: true
            }
        });
    }

    /* ====================================================
       13. THEME TOGGLE
       ==================================================== */
    const currentTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    if (currentTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    }
    document.querySelectorAll(".theme-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            if (theme === "light") {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
            }
        });
    });
});
