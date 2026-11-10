/* Les contenus éditables vivent dans site-config.js. */
const PROJECTS = window.DARBDEV_CONFIG?.projects || [];

/* Felix Softwares - interactions de la landing page */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header sticky, navigation mobile et mega-menu accessible.
  const header = document.querySelector("#site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const megaTrigger = document.querySelector(".nav-link--button");
  const megaParent = document.querySelector(".has-mega-menu");

  const closeMenu = function () {
    if (!menuToggle || !mainNav) return;
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      mainNav.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
    });
  }

  if (megaTrigger && megaParent) {
    megaTrigger.addEventListener("click", function () {
      const isOpen = megaParent.classList.toggle("is-open");
      megaTrigger.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", function (event) {
      if (!megaParent.contains(event.target)) {
        megaParent.classList.remove("is-open");
        megaTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".main-nav a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  const updateScrollState = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
    const backToTop = document.querySelector("#back-to-top");
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 650);
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  // Slider hero avec autoplay, contrôles clavier et pause au survol.
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".slider-dot"));
  const sliderPrev = document.querySelector(".slider-arrow--prev");
  const sliderNext = document.querySelector(".slider-arrow:not(.slider-arrow--prev)");
  let activeSlide = 0;
  let sliderTimer;

  const showSlide = function (index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach(function (dot, dotIndex) {
      const isActive = dotIndex === activeSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const startSlider = function () {
    if (prefersReducedMotion || slides.length < 2) return;
    clearInterval(sliderTimer);
    sliderTimer = setInterval(function () { showSlide(activeSlide + 1); }, 6500);
  };
  const stopSlider = function () { clearInterval(sliderTimer); };
  sliderNext?.addEventListener("click", function () { showSlide(activeSlide + 1); startSlider(); });
  sliderPrev?.addEventListener("click", function () { showSlide(activeSlide - 1); startSlider(); });
  dots.forEach(function (dot) { dot.addEventListener("click", function () { showSlide(Number(dot.dataset.slideTo)); startSlider(); }); });
  document.querySelector(".hero")?.addEventListener("mouseenter", stopSlider);
  document.querySelector(".hero")?.addEventListener("mouseleave", startSlider);
  startSlider();

  // Apparition des blocs et compteurs déclenchés à l'entrée dans le viewport.
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(function (element) { revealObserver.observe(element); });

  // Timeline méthodologique : progression au scroll et panneau d'étape accessible.
  const methodology = document.querySelector("#methodologie");
  const methodProgressObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-progressing");
      observer.unobserve(entry.target);
    });
  }, { threshold: prefersReducedMotion ? 0 : .2 });
  if (methodology) methodProgressObserver.observe(methodology.querySelector(".method-timeline"));

  const methodSteps = Array.from(document.querySelectorAll(".method-step"));
  methodSteps.forEach(function (step) {
    const toggle = step.querySelector(".method-step__toggle");
    const details = step.querySelector(".method-step__details");
    if (!toggle || !details) return;
    toggle.addEventListener("click", function () {
      const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";
      methodSteps.forEach(function (otherStep) {
        const otherToggle = otherStep.querySelector(".method-step__toggle");
        const otherDetails = otherStep.querySelector(".method-step__details");
        if (!otherToggle || !otherDetails) return;
        const isCurrent = otherStep === step;
        otherToggle.setAttribute("aria-expanded", String(isCurrent ? shouldOpen : false));
        otherDetails.hidden = !(isCurrent && shouldOpen);
        otherStep.classList.toggle("is-open", isCurrent && shouldOpen);
      });
    });
  });

  // Projets de l'équipe : rendu DOM sécurisé depuis PROJECTS, sans HTML injecté.
  const projectGrid = document.querySelector("#team-projects-grid");
  const emptyProjects = document.querySelector("#projects-empty");
  const projectFilters = { member: "all", category: "all" };
  const memberFilterGroup = document.querySelector('.team-filter-group[aria-label="Filtrer par membre"]');
  if (memberFilterGroup && !memberFilterGroup.querySelector('[data-value="Mokhliss Himmich"]')) {
    const mokhlissFilter = document.createElement("button");
    mokhlissFilter.className = "team-filter";
    mokhlissFilter.type = "button";
    mokhlissFilter.dataset.projectFilter = "member";
    mokhlissFilter.dataset.value = "Mokhliss Himmich";
    mokhlissFilter.setAttribute("role", "tab");
    mokhlissFilter.setAttribute("aria-selected", "false");
    mokhlissFilter.textContent = "Mokhliss Himmich";
    memberFilterGroup.append(mokhlissFilter);
  }
  const projectFilterButtons = Array.from(document.querySelectorAll(".team-filter"));

  const safeUrl = function (value) {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (error) {
      return "";
    }
  };

  const projectInitials = function (title) {
    const words = title.replace("EXEMPLE À REMPLACER ·", "").trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map(function (word) { return word.charAt(0); }).join("").toUpperCase() || "PX";
  };

  const makeProjectLink = function (url, label, iconText) {
    const safe = safeUrl(url);
    if (!safe) return null;
    const link = document.createElement("a");
    link.href = safe;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(document.createTextNode(label + " "));
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = iconText;
    link.append(icon);
    return link;
  };

  const createProjectCard = function (project) {
    const card = document.createElement("article");
    card.className = "team-project-card reveal";

    const visual = document.createElement("div");
    visual.className = "team-project-card__visual";
    const imageUrl = safeUrl(project.image);
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = "Aperçu du projet " + project.title;
      image.loading = "lazy";
      visual.append(image);
    } else {
      visual.textContent = projectInitials(project.title);
      visual.setAttribute("aria-label", "Visuel de remplacement pour " + project.title);
    }
    card.append(visual);

    const category = document.createElement("span");
    category.className = "team-project-card__category";
    category.textContent = project.category;
    card.append(category);

    const title = document.createElement("h4");
    title.textContent = project.title;
    card.append(title);

    const description = document.createElement("p");
    description.className = "team-project-card__description";
    description.textContent = project.description;
    card.append(description);

    const techList = document.createElement("div");
    techList.className = "project-tech";
    project.tech.forEach(function (technology) {
      const badge = document.createElement("span");
      badge.textContent = technology;
      techList.append(badge);
    });
    card.append(techList);

    const footer = document.createElement("div");
    footer.className = "team-project-card__footer";
    const member = document.createElement("span");
    member.className = "team-project-card__member";
    member.textContent = project.member;
    footer.append(member);
    const links = document.createElement("div");
    links.className = "team-project-card__links";
    const githubLink = makeProjectLink(project.repoUrl, "Voir sur GitHub", "↗");
    const liveLink = makeProjectLink(project.liveUrl, "Démo", "↗");
    if (githubLink) links.append(githubLink);
    if (liveLink) links.append(liveLink);
    footer.append(links);
    card.append(footer);
    return card;
  };

  const renderProjects = function () {
    if (!projectGrid) return;
    const visibleProjects = PROJECTS.filter(function (project) {
      const matchesMember = projectFilters.member === "all" || project.member === projectFilters.member;
      const matchesCategory = projectFilters.category === "all" || project.category === projectFilters.category;
      return matchesMember && matchesCategory;
    });
    projectGrid.replaceChildren();
    visibleProjects.forEach(function (project) {
      const card = createProjectCard(project);
      projectGrid.append(card);
      revealObserver.observe(card);
    });
    if (emptyProjects) emptyProjects.hidden = visibleProjects.length > 0;
  };

  projectFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filterType = button.dataset.projectFilter;
      projectFilters[filterType] = button.dataset.value;
      projectFilterButtons.filter(function (item) { return item.dataset.projectFilter === filterType; }).forEach(function (item) {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });
      renderProjects();
    });
  });
  renderProjects();

  // Étude de cas : navigation légère entre problème, solution, produit et résultat.
  const caseSteps = [
    { title: "Le problème", copy: "Atlas Industries travaillait avec plusieurs fichiers et outils isolés. Chaque décision demandait une consolidation manuelle, ce qui ralentissait les équipes et rendait les priorités difficiles à partager.", result: "Le vrai sujet n'était pas le volume de données, mais la confiance dans la donnée." },
    { title: "La solution", copy: "Nous avons commencé par cartographier les flux critiques, puis défini un espace de pilotage unique avec des rôles, des alertes et une information fiable au bon moment.", result: "Une trajectoire claire avant d'écrire la première ligne de code." },
    { title: "Le produit", copy: "Le résultat est une plateforme métier responsive qui réunit indicateurs, tâches et décisions dans une expérience adaptée au quotidien des équipes.", result: "Un outil utilisé pendant les réunions comme dans l'action." },
    { title: "Le résultat", copy: "Après le déploiement, les équipes ont réduit les ressaisies et retrouvé une lecture commune de l'activité. La roadmap continue d'évoluer avec les usages.", result: "+31 % de productivité sur le périmètre pilote." }
  ];
  const caseButtons = Array.from(document.querySelectorAll(".case-step"));
  const caseTitle = document.querySelector("#case-title");
  const caseCopy = document.querySelector("#case-copy");
  const caseResult = document.querySelector("#case-result");
  const caseVisualNumber = document.querySelector("#case-visual span");
  caseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.caseStep);
      const step = caseSteps[index];
      if (!step) return;
      caseButtons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      if (caseTitle) caseTitle.textContent = step.title;
      if (caseCopy) caseCopy.textContent = step.copy;
      if (caseResult) caseResult.textContent = step.result;
      if (caseVisualNumber) caseVisualNumber.textContent = String(index + 1).padStart(2, "0");
    });
  });

  // Page « Tous les services » : même contenu, gabarit détaillé et CTA cohérent.
  const allServicesList = document.querySelector("#all-services-list");
  const createServiceDetail = function (service) {
    const article = document.createElement("article");
    article.className = "service-page-card reveal";
    const visual = document.createElement("div");
    visual.className = "service-page-card__visual";
    const number = document.createElement("span");
    number.textContent = service.number;
    visual.append(number);
    const category = document.createElement("small");
    category.textContent = service.category;
    visual.append(category);
    article.append(visual);

    const body = document.createElement("div");
    body.className = "service-page-card__body";
    const title = document.createElement("h2");
    title.textContent = service.title;
    body.append(title);
    const problemLabel = document.createElement("strong");
    problemLabel.textContent = "Le problème que nous résolvons";
    body.append(problemLabel);
    const problem = document.createElement("p");
    problem.textContent = service.problem;
    body.append(problem);
    const deliverablesLabel = document.createElement("strong");
    deliverablesLabel.textContent = "Ce que nous livrons";
    body.append(deliverablesLabel);
    const deliverables = document.createElement("p");
    deliverables.textContent = service.deliverables;
    body.append(deliverables);
    const technologies = document.createElement("div");
    technologies.className = "service-page-card__tech";
    service.tech.forEach(function (technology) {
      const badge = document.createElement("span");
      badge.textContent = technology;
      technologies.append(badge);
    });
    body.append(technologies);
    const outcome = document.createElement("p");
    outcome.className = "service-page-card__outcome";
    outcome.textContent = service.outcome;
    body.append(outcome);
    const link = document.createElement("a");
    link.className = "button button--accent";
    link.href = "index.html#" + service.anchor;
    link.append(document.createTextNode("Démarrer un projet "));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    link.append(arrow);
    body.append(link);
    article.append(body);
    return article;
  };
  if (allServicesList) {
    (window.DARBDEV_CONFIG?.services || []).forEach(function (service) {
      const card = createServiceDetail(service);
      allServicesList.append(card);
      revealObserver.observe(card);
    });
  }

  const counterObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const decimals = Number(counter.dataset.decimals || 0);
      if (prefersReducedMotion) {
        counter.textContent = target.toFixed(decimals).replace(".", ",");
        observer.unobserve(counter);
        return;
      }
      const start = performance.now();
      const duration = 1300;
      const animate = function (now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = (target * eased).toFixed(decimals).replace(".", ",");
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: .7 });
  document.querySelectorAll(".counter").forEach(function (counter) { counterObserver.observe(counter); });

  // Filtre des réalisations.
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;
      filterButtons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      projectCards.forEach(function (card) {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });

  // Carrousel de témoignages.
  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  const testimonialProgress = Array.from(document.querySelectorAll(".testimonial-progress span"));
  let activeTestimonial = 0;
  const showTestimonial = function (index) {
    if (!testimonials.length) return;
    activeTestimonial = (index + testimonials.length) % testimonials.length;
    testimonials.forEach(function (item, itemIndex) { item.classList.toggle("is-active", itemIndex === activeTestimonial); });
    testimonialProgress.forEach(function (item, itemIndex) { item.classList.toggle("is-active", itemIndex === activeTestimonial); });
  };
  document.querySelector(".testimonial-prev")?.addEventListener("click", function () { showTestimonial(activeTestimonial - 1); });
  document.querySelector(".testimonial-next")?.addEventListener("click", function () { showTestimonial(activeTestimonial + 1); });

  // Le comportement natif de details fournit déjà un accordéon clavier accessible.
  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      const summary = item.querySelector("summary");
      if (summary) summary.setAttribute("aria-expanded", String(item.open));
      if (item.open) document.querySelectorAll(".faq-item").forEach(function (other) {
        if (other !== item) {
          other.open = false;
          const otherSummary = other.querySelector("summary");
          if (otherSummary) otherSummary.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  // Mini-quiz de recommandation.
  const quizPanel = document.querySelector("#quiz-panel");
  const startQuiz = document.querySelector("#start-quiz");
  const quizClose = document.querySelector(".quiz-close");
  const quizOptions = document.querySelector("#quiz-options");
  const quizTitle = document.querySelector("#quiz-title");
  const quizBar = document.querySelector("#quiz-progress-bar");
  const quizResult = document.querySelector("#quiz-result");
  const quizResultTitle = document.querySelector("#quiz-result-title");
  const quizResultCopy = document.querySelector("#quiz-result-copy");
  const quizQuestions = [
    { title: "Quel est votre principal enjeu ?", options: [{ label: "Gagner en visibilité", value: "web" }, { label: "Fluidifier l'expérience", value: "app" }, { label: "Mieux piloter l'activité", value: "erp" }] },
    { title: "Qui utilisera principalement la solution ?", options: [{ label: "Mes clients", value: "web" }, { label: "Mes équipes terrain", value: "app" }, { label: "Toute mon organisation", value: "erp" }] },
    { title: "Quelle priorité vous ressemble le plus ?", options: [{ label: "Être remarquable", value: "web" }, { label: "Être simple et mobile", value: "app" }, { label: "Être plus efficace", value: "erp" }] }
  ];
  const quizResults = {
    web: { title: "Un site web professionnel", copy: "Une présence digitale claire et performante semble être votre meilleur prochain pas.", anchor: "#solution-web" },
    app: { title: "Une application web ou mobile", copy: "Une expérience fluide, accessible partout, peut transformer votre relation avec vos utilisateurs.", anchor: "#solution-app" },
    erp: { title: "Un ERP ou CRM sur mesure", copy: "La centralisation et l'automatisation peuvent vous faire gagner un temps précieux au quotidien.", anchor: "#solution-erp" }
  };
  let quizStep = 0;
  const quizScores = { web: 0, app: 0, erp: 0 };
  const renderQuiz = function () {
    const question = quizQuestions[quizStep];
    quizTitle.textContent = question.title;
    quizBar.style.width = ((quizStep + 1) / quizQuestions.length) * 100 + "%";
    quizOptions.innerHTML = "";
    question.options.forEach(function (option) {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", function () {
        quizScores[option.value] += 1;
        if (quizStep < quizQuestions.length - 1) { quizStep += 1; renderQuiz(); } else { showQuizResult(); }
      });
      quizOptions.appendChild(button);
    });
  };
  const showQuizResult = function () {
    const recommendation = Object.keys(quizScores).sort(function (a, b) { return quizScores[b] - quizScores[a]; })[0];
    quizOptions.hidden = true;
    quizTitle.hidden = true;
    quizResult.hidden = false;
    quizBar.style.width = "100%";
    quizResultTitle.textContent = quizResults[recommendation].title;
    quizResultCopy.textContent = quizResults[recommendation].copy;
  };
  startQuiz?.addEventListener("click", function () {
    quizStep = 0; quizScores.web = 0; quizScores.app = 0; quizScores.erp = 0;
    quizOptions.hidden = false; quizTitle.hidden = false; quizResult.hidden = true;
    renderQuiz(); quizPanel.hidden = false; quizPanel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
  quizClose?.addEventListener("click", function () { quizPanel.hidden = true; });

  // Validation client du formulaire, avec messages associés aux champs.
  const contactForm = document.querySelector(".contact-form--upgrade") || document.querySelector("#contact-form");
  const formSuccess = contactForm?.querySelector("#form-success") || document.querySelector("#form-success");
  const setError = function (field, message) {
    const error = field.closest("form")?.querySelector("#" + field.name + "-error") || document.querySelector("#" + field.name + "-error");
    field.classList.toggle("field-invalid", Boolean(message));
    if (error) error.textContent = message;
  };
  contactForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const project = contactForm.elements.project;
    const message = contactForm.elements.message;
    const consent = contactForm.elements.consent;
    let valid = true;
    if (name.value.trim().length < 2) { setError(name, "Indiquez votre nom complet."); valid = false; } else setError(name, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Vérifiez votre adresse email."); valid = false; } else setError(email, "");
    if (!project.value) { setError(project, "Choisissez un type de projet."); valid = false; } else setError(project, "");
    if (message.value.trim().length < 10) { setError(message, "Décrivez votre projet en quelques mots."); valid = false; } else setError(message, "");
    const consentError = contactForm.querySelector("#consent-error") || document.querySelector("#consent-error");
    if (!consent.checked) { consentError.textContent = "Votre accord est nécessaire pour envoyer le formulaire."; valid = false; } else consentError.textContent = "";
    if (!valid) return;
    formSuccess.hidden = false;
    contactForm.reset();
    window.setTimeout(function () { formSuccess.hidden = true; }, 7000);
  });

  document.querySelector(".newsletter-form")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (input.checkValidity()) { input.value = ""; input.placeholder = "Merci pour votre inscription"; }
  });

  document.querySelector("#back-to-top")?.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }); });
}());
