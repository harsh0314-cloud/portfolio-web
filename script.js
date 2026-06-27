/* ================================
   Portfolio Website JavaScript
   Handles navigation, animations,
   progress bars, and form validation.
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Enable JS-specific styles
  document.body.classList.remove("no-js");
  document.body.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const toTopButton = document.getElementById("toTop");

  /* ================================
     Mobile Navigation
  ================================ */
  const closeMenu = () => {
    if (!navToggle || !navMenu) return;

    navToggle.classList.remove("is-active");
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");

      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu when clicking outside it
    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("is-open")) return;

      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* ================================
     Smooth Scrolling Links
  ================================ */
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      closeMenu();
    });
  });

  /* ================================
     Header Scroll State + Back To Top
  ================================ */
  const updateScrollState = () => {
    const isScrolled = window.scrollY > 40;

    if (header) {
      header.classList.toggle("is-scrolled", isScrolled);
    }

    if (toTopButton) {
      toTopButton.classList.toggle("is-visible", window.scrollY > 520);
    }
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  if (toTopButton) {
    toTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  /* ================================
     Active Navigation Link On Scroll
  ================================ */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length > 0) {
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => activeSectionObserver.observe(section));
  }

  /* ================================
     Scroll Reveal Animations
  ================================ */
  const animatedItems = document.querySelectorAll(
    ".reveal, .skill-card, .project-card, .service-card"
  );

  const showItem = (item) => {
    item.classList.add("is-visible");

    // Start progress bar animation for skill cards
    if (item.classList.contains("skill-card")) {
      item.classList.add("show-progress");
    }
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showItem(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -70px 0px"
      }
    );

    animatedItems.forEach((item) => revealObserver.observe(item));
  } else {
    // Fallback for older browsers
    animatedItems.forEach(showItem);
  }

  /* ================================
     Contact Form Validation
  ================================ */
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showFormMessage = (message, type) => {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
  };

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        showFormMessage("Please fill in all fields.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage("Please enter a valid email address.", "error");
        return;
      }

      if (message.length < 10) {
        showFormMessage("Please enter a message with at least 10 characters.", "error");
        return;
      }

      // Since this is a static website, the form does not send data to a server.
      showFormMessage(`Thanks, ${name}! Your message has been received.`, "success");

      contactForm.reset();
    });
  }

  /* ================================
     Dynamic Footer Year
  ================================ */
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
