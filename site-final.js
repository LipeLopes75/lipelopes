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

  const practiceContent = {
    trafego: {number:"01",title:"Tráfego pago",actions:["Planejo e configuro campanhas","Instalo pixels e conversões","Otimizo, escalo e analiso resultados","Direciono criativos e copies"],tools:[["Meta Ads","∞","#0467df"],["Google Ads","A","#4285f4"]]},
    automacoes: {number:"02",title:"Automações",actions:["Captação e qualificação de leads","Atendimento automatizado no WhatsApp","Follow-up e recuperação de oportunidades","Distribuição de leads para vendedores"],tools:[["ManyChat","•••","#1f85ff"],["BotConversa","BC","#20b982"],["Make","M","#6d00cc"],["Zapier","✦","#ff4f00"],["n8n","···","#ea4b71"],["WhatsApp API","☎","#25d366"]]},
    ia: {number:"03",title:"Inteligência artificial",actions:["Pesquisa e diagnóstico","Planejamento estratégico","Criação de textos e copies","Análise de dados","Criação de imagens e vídeos"],tools:[["ChatGPT","✣","#10a37f"],["Claude","AI","#d97757"],["Gemini","✦","#8e75b2"]]},
    funis: {number:"04",title:"Funis e conversão",actions:["Posicionamento, oferta e copy","Páginas, captação e jornada no WhatsApp","Checkout e meios de pagamento","Testes de conversão e remarketing"],tools:[["WordPress","W","#21759b"],["Elementor","E","#92003b"],["Hotmart","HM","#f04e23"],["Kiwify","KW","#49c98f"],["Doppus","DP","#f3743c"]]},
    dados: {number:"05",title:"Dados e rastreamento",actions:["Configuração de tags e eventos","UTMs e rastreamento de campanhas","Leitura de métricas de mídia","Análise de dashboards comerciais"],tools:[["Tag Manager","◇","#246fdb"],["Meta Ads","∞","#0467df"],["Google Ads","A","#4285f4"],["Dashboards CRM","CRM","#62ddc0"]]},
    comercial: {number:"06",title:"Processo comercial",actions:["Qualificação, roteiro e funil no CRM","Follow-up e distribuição de oportunidades","Reuniões de fechamento","Treinamento, indicadores e metas"],tools:[["RD Station CRM","RD","#22c55e"],["Kommo","K","#6c63ff"]]}
  };

  const practiceTabs = [...doc.querySelectorAll("[data-practice-tab]")];
  const practiceNumber = doc.querySelector("#practice-number");
  const practiceTitle = doc.querySelector("#practice-panel-title");
  const practiceActions = doc.querySelector("#practice-actions");
  const practiceTools = doc.querySelector("#practice-tools");
  const toolMarkup = ([name, mark, color]) => `<span class="lp-tool"><i style="--brand:${color}" aria-hidden="true">${mark}</i><b>${name}</b></span>`;

  const selectPracticeTab = (key) => {
    const selected = practiceContent[key];
    if (!selected) return;
    practiceTabs.forEach((tab) => {
      const active = tab.dataset.practiceTab === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    practiceNumber.textContent = selected.number;
    practiceTitle.textContent = selected.title;
    practiceActions.innerHTML = selected.actions.map((item) => `<li>${item}</li>`).join("");
    practiceTools.innerHTML = selected.tools.map(toolMarkup).join("");
  };
  practiceTabs.forEach((tab) => tab.addEventListener("click", () => selectPracticeTab(tab.dataset.practiceTab)));

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
