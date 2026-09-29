(() => {
  "use strict";

  const doc = document;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    doc.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7%", threshold: .08 });
    doc.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  }

  const problemCards = [...doc.querySelectorAll(".lp-problem")];
  problemCards.forEach((card) => {
    const trigger = card.querySelector("button");
    const content = card.querySelector(".lp-problem__content");
    trigger.addEventListener("click", () => {
      const wasOpen = card.classList.contains("is-open");
      problemCards.forEach((item) => {
        item.classList.remove("is-open");
        item.querySelector("button").setAttribute("aria-expanded", "false");
        item.querySelector(".lp-problem__content").hidden = true;
      });
      if (!wasOpen) {
        card.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        content.hidden = false;
      }
    });
  });

  const track = doc.querySelector(".lp-testimonial-track");
  const testimonials = [...doc.querySelectorAll(".lp-testimonial")];
  const prev = doc.querySelector(".lp-carousel-prev");
  const next = doc.querySelector(".lp-carousel-next");
  const dots = doc.querySelector(".lp-carousel-dots");
  let testimonialIndex = 0;
  const visibleTestimonials = () => window.innerWidth <= 720 ? 1 : 2;
  const moveTestimonials = (target) => {
    const max = Math.max(0, testimonials.length - visibleTestimonials());
    testimonialIndex = Math.min(Math.max(target, 0), max);
    const cardWidth = testimonials[0]?.getBoundingClientRect().width || 0;
    track.style.transform = `translateX(-${testimonialIndex * (cardWidth + 16)}px)`;
    [...dots.children].forEach((dot, index) => dot.classList.toggle("is-active", index === testimonialIndex));
  };
  const buildDots = () => {
    const count = Math.max(1, testimonials.length - visibleTestimonials() + 1);
    dots.replaceChildren();
    Array.from({length:count}).forEach((_, index) => {
      const dot = doc.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar depoimento ${index + 1}`);
      dot.addEventListener("click", () => moveTestimonials(index));
      dots.appendChild(dot);
    });
  };
  prev?.addEventListener("click", () => moveTestimonials(testimonialIndex - 1));
  next?.addEventListener("click", () => moveTestimonials(testimonialIndex + 1));
  window.addEventListener("resize", () => { buildDots(); moveTestimonials(testimonialIndex); });
  buildDots();
  moveTestimonials(0);

  doc.querySelectorAll("[data-cta]").forEach((link) => link.addEventListener("click", () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:"whatsapp_click",cta_location:link.dataset.cta});
  }));

  const contactOverlay = doc.querySelector("[data-contact-overlay]");
  const contactForm = doc.querySelector("[data-contact-form]");
  const contactError = doc.querySelector("[data-contact-error]");
  const openContact = () => {
    contactOverlay?.classList.add("is-open");
    contactOverlay?.setAttribute("aria-hidden", "false");
    doc.body.classList.add("is-modal-open");
    window.setTimeout(() => contactForm?.elements.name?.focus(), 120);
  };
  const closeContact = () => {
    contactOverlay?.classList.remove("is-open");
    contactOverlay?.setAttribute("aria-hidden", "true");
    doc.body.classList.remove("is-modal-open");
  };

  doc.querySelectorAll("[data-contact-trigger]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    openContact();
  }));
  doc.querySelector("[data-contact-close]")?.addEventListener("click", closeContact);
  contactOverlay?.addEventListener("click", (event) => { if (event.target === contactOverlay) closeContact(); });
  doc.addEventListener("keydown", (event) => { if (event.key === "Escape") closeContact(); });

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const submit = contactForm.querySelector(".contact-submit");
    const data = Object.fromEntries(new FormData(contactForm));
    const params = new URLSearchParams(location.search);
    const payload = {
      ...data,
      source: params.get("utm_source") ? "Landing Page · Campanha" : "Landing Page",
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      campaign: params.get("utm_campaign"),
      ad_name: params.get("utm_content"),
      fbclid: params.get("fbclid")
    };
    submit.disabled = true;
    submit.querySelector("span").textContent = "Abrindo o WhatsApp...";
    contactError.hidden = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "contact_started", lead_problem: data.problem, source: payload.source });
    const text = `Olá, Lipe! Sou ${data.name}, da empresa ${data.company}. Meu principal desafio hoje é: ${data.problem}.`;
    location.href = `https://wa.me/5575992454549?text=${encodeURIComponent(text)}`;
  });
})();
