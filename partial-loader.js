(function () {
  "use strict";

  const loadScript = function (source) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = source;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const loadPartials = async function () {
    let placeholders = Array.from(document.querySelectorAll("[data-partial]"));
    while (placeholders.length) {
      for (const placeholder of placeholders) {
        const name = placeholder.dataset.partial;
        if (!/^[a-z0-9-]+$/i.test(name)) throw new Error("Invalid partial name");
        const response = await fetch("partials/" + name + ".html");
        if (!response.ok) throw new Error("Unable to load partial: " + name);
        const template = document.createElement("template");
        template.innerHTML = await response.text();
        placeholder.replaceWith(template.content);
      }
      placeholders = Array.from(document.querySelectorAll("[data-partial]"));
    }
  };

  const keepNavigationOnLandingPage = function () {
    const anchors = {
      "services.html": "#solutions",
      "projects.html": "#projets",
      "methodologie.html": "#methodologie",
      "team.html": "#equipe",
      "contact.html": "#contact"
    };
    document.querySelectorAll("a").forEach(function (link) {
      const target = anchors[link.getAttribute("href")];
      if (target) link.setAttribute("href", target);
    });
  };

  loadPartials().then(function () {
    keepNavigationOnLandingPage();
    return loadScript("jsmain.js");
  }).catch(function (error) {
    console.error("DarbDev partial loading failed.", error);
  });
}());
