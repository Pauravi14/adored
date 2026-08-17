(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const year = document.querySelector("[data-year]");
  const reveals = document.querySelectorAll("[data-reveal]");
  const heroShots = [...document.querySelectorAll("[data-hero-shot]")];

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  if (heroShots.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroShots[heroIndex].classList.remove("is-active");
      heroIndex = (heroIndex + 1) % heroShots.length;
      heroShots[heroIndex].classList.add("is-active");
    }, 5000);
  }

  const chevron = document.querySelector("[data-orbit-chevron]");
  const track = chevron && chevron.parentElement;
  const brandWord = document.querySelector(".path-word-end");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (chevron && track && !reduceMotion) {
    let start = null;
    let shown = false;
    const moveMs = 900;
    const holdMs = 1500;
    const cycle = moveMs + holdMs;

    const tick = (now) => {
      if (start == null) start = now;
      const t = (now - start) % cycle;
      const progress = t < moveMs ? t / moveMs : 1;
      const x = progress * track.clientWidth;
      chevron.style.transform = `translate(${x}px, -50%) translateX(-50%)`;
      chevron.style.opacity = t < 80 ? String(t / 80) : "1";
      if (progress >= 1 && !shown) {
        shown = true;
        brandWord?.classList.add("is-in");
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } else {
    if (chevron && track) {
      chevron.style.transform = `translate(${track.clientWidth}px, -50%) translateX(-50%)`;
    }
    brandWord?.classList.add("is-in");
  }
})();
