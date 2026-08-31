const root = document.documentElement;
const languageButton = document.querySelector("[data-language-toggle]");
const description = document.querySelector('meta[name="description"]');
const ogDescription = document.querySelector('meta[property="og:description"]');
const twitterDescription = document.querySelector('meta[name="twitter:description"]');

const pageMeta = {
  en: { title: "Faheem Shah Umer — AI & Mechatronics Engineer", description: "AI and mechatronics engineer building agentic systems for automotive and product development.", toggleLabel: "Switch to German" },
  de: { title: "Faheem Shah Umer — KI- & Mechatronikingenieur", description: "KI- und Mechatronikingenieur für agentische Systeme in der Automobil- und Produktentwicklung.", toggleLabel: "Auf Englisch wechseln" }
};

function applyLanguage(language) {
  const selected = language === "de" ? "de" : "en";
  root.lang = selected;
  document.querySelectorAll("[data-en][data-de]").forEach((element) => { element.textContent = element.dataset[selected]; });
  document.querySelectorAll("[data-en-aria][data-de-aria]").forEach((element) => { element.setAttribute("aria-label", element.dataset[`${selected}Aria`]); });
  document.querySelectorAll("[data-en-alt][data-de-alt]").forEach((element) => { element.alt = element.dataset[`${selected}Alt`]; });
  document.title = pageMeta[selected].title;
  description.content = pageMeta[selected].description;
  ogDescription.content = pageMeta[selected].description;
  twitterDescription.content = pageMeta[selected].description;
  languageButton.textContent = selected === "en" ? "DE" : "EN";
  languageButton.setAttribute("aria-label", pageMeta[selected].toggleLabel);
  languageButton.dataset.currentLanguage = selected;
  localStorage.setItem("portfolio-language", selected);
}

languageButton.addEventListener("click", () => { applyLanguage(languageButton.dataset.currentLanguage === "en" ? "de" : "en"); });
applyLanguage(localStorage.getItem("portfolio-language") === "de" ? "de" : "en");
document.querySelector("[data-year]").textContent = new Date().getFullYear();

const header = document.querySelector("[data-header]");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${visible.target.id}`;
    if (active) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-35% 0px -55%", threshold: [0,.2,.5] });
sections.forEach((section) => sectionObserver.observe(section));

if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const hero = document.querySelector(".hero");
  const shapes = [...document.querySelectorAll(".hero .shape")];
  hero.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 18;
    const y = (event.clientY / window.innerHeight - .5) * 18;
    shapes.forEach((shape,index) => { const factor = (index + 1) * .32; shape.style.translate = `${x * factor}px ${y * factor}px`; });
  });
}
