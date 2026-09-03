const root = document.documentElement;
root.classList.add("has-js");
const main = document.querySelector("#main");
const projectsSection = document.querySelector("#projects");
const experienceSection = document.querySelector("#experience");

if (main && projectsSection && experienceSection) {
  main.insertBefore(experienceSection, projectsSection);
  const projectDivider = experienceSection.querySelector(".character-divider-projects");
  if (projectDivider) projectsSection.prepend(projectDivider);
}

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

const characterEntrances = [
  { anchor: document.querySelector("#projects"), character: document.querySelector(".character-divider-projects") }
].filter(({ anchor, character }) => anchor && character);

const characterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const entrance = characterEntrances.find(({ anchor }) => anchor === entry.target);
    entrance?.character.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { rootMargin: "0px 0px -14%", threshold: .02 });
characterEntrances.forEach(({ anchor }) => characterObserver.observe(anchor));

const desktopStackHover = window.matchMedia("(min-width: 981px) and (hover: hover) and (pointer: fine)");
const stackCards = [...document.querySelectorAll(".stack-card")];
const stackPreview = document.createElement("div");
const stackPreviewTools = document.createElement("div");
let previewCard = null;
let stackPreviewHideTimer = 0;

stackPreview.className = "stack-hover-preview";
stackPreview.setAttribute("aria-hidden", "true");
stackPreviewTools.className = "stack-hover-tools";
stackPreview.append(stackPreviewTools);
document.body.append(stackPreview);

function hideStackPreview() {
  window.clearTimeout(stackPreviewHideTimer);
  stackPreviewHideTimer = 0;
  previewCard = null;
  stackPreview.classList.remove("is-visible");
}

function cancelStackPreviewHide() {
  window.clearTimeout(stackPreviewHideTimer);
  stackPreviewHideTimer = 0;
}

function scheduleStackPreviewHide() {
  cancelStackPreviewHide();
  stackPreviewHideTimer = window.setTimeout(hideStackPreview, 90);
}

function positionStackPreview(card) {
  const cardRect = card.getBoundingClientRect();
  const gridRect = card.closest(".stack-grid").getBoundingClientRect();
  const width = Math.min(920, gridRect.width - 32, window.innerWidth - 32);
  const left = Math.min(Math.max(16, gridRect.left + gridRect.width / 2 - width / 2), window.innerWidth - width - 16);

  stackPreview.style.width = `${width}px`;
  stackPreview.style.left = `${left}px`;
  stackPreview.style.top = "0";

  const previewHeight = stackPreview.offsetHeight;
  const centeredTop = cardRect.top + cardRect.height / 2 - previewHeight / 2;
  const maxTop = Math.max(16, window.innerHeight - previewHeight - 16);
  const top = Math.min(Math.max(16, centeredTop), maxTop);
  stackPreview.style.top = `${top}px`;
}

function showStackPreview(card) {
  if (!desktopStackHover.matches || card.open) return;
  if (previewCard && previewCard !== card) return;

  cancelStackPreviewHide();
  if (previewCard === card && stackPreview.classList.contains("is-visible")) return;

  const tools = [...card.querySelectorAll(".tool")].map((tool) => tool.cloneNode(true));
  stackPreviewTools.replaceChildren(...tools);
  previewCard = card;
  positionStackPreview(card);
  requestAnimationFrame(() => {
    if (previewCard === card) stackPreview.classList.add("is-visible");
  });
}

stackCards.forEach((card) => {
  card.addEventListener("pointerenter", () => showStackPreview(card));
  card.addEventListener("pointerleave", scheduleStackPreviewHide);
  card.addEventListener("toggle", hideStackPreview);
});

stackPreview.addEventListener("pointerenter", cancelStackPreviewHide);
stackPreview.addEventListener("pointerleave", scheduleStackPreviewHide);
desktopStackHover.addEventListener("change", hideStackPreview);
window.addEventListener("scroll", hideStackPreview, { passive: true });
window.addEventListener("resize", hideStackPreview);

const stackBookShelf = document.querySelector("[data-stack-books]");
const stackReader = document.querySelector("[data-stack-reader]");
const stackReaderSummary = document.querySelector("[data-stack-reader-summary]");
const stackReaderToolsLeft = document.querySelector("[data-stack-reader-tools-left]");
const stackReaderToolsRight = document.querySelector("[data-stack-reader-tools-right]");
const stackReaderMark = document.querySelector("[data-stack-reader-mark]");
const stackReaderClose = stackReader?.querySelector(".stack-reader-close");
const stackReaderPrevious = stackReader?.querySelector(".stack-reader-prev");
const stackReaderNext = stackReader?.querySelector(".stack-reader-next");
const desktopStackBooks = window.matchMedia("(min-width: 981px)");
const stackBookSettings = [
  { code: "AI", color: "#6670ff", ink: "#fff", height: "318px" },
  { code: "RAG", color: "#a45cff", ink: "#fff", height: "292px" },
  { code: "DEV", color: "#0b0b0b", ink: "#fff", height: "326px" },
  { code: "CAD", color: "#ff9b50", ink: "#0b0b0b", height: "284px" },
  { code: "ECU", color: "#63e6de", ink: "#0b0b0b", height: "312px" },
  { code: "DOC", color: "#c8b34d", ink: "#0b0b0b", height: "276px" }
];
const stackBookButtons = [];
let activeStackIndex = -1;
let stackNavigationTimer = 0;

function openStackBook(index) {
  const card = stackCards[index];
  const setting = stackBookSettings[index];
  const number = card.querySelector(".stack-summary small").cloneNode(true);
  const title = card.querySelector(".stack-summary strong").cloneNode(true);
  const description = card.querySelector(".stack-summary > span:last-child").cloneNode(true);
  const tools = [...card.querySelectorAll(".tool")];
  const midpoint = Math.ceil(tools.length / 2);

  const createBookIndex = (items, startAt) => items.map((tool, index) => {
    const item = tool.cloneNode(true);
    const toolNumber = document.createElement("span");
    toolNumber.className = "stack-tool-number";
    toolNumber.textContent = String(startAt + index).padStart(2, "0");
    item.className = "stack-page-tool";
    item.querySelector("img")?.classList.add("stack-page-tool-icon");
    item.prepend(toolNumber);
    return item;
  });

  number.className = "stack-reader-volume";
  title.id = "stack-reader-title";
  description.classList.add("stack-reader-description");
  stackReaderSummary.replaceChildren(number, title, description);
  stackReaderToolsLeft.replaceChildren(...createBookIndex(tools.slice(0, midpoint), 1));
  stackReaderToolsRight.replaceChildren(...createBookIndex(tools.slice(midpoint), midpoint + 1));
  stackReaderMark.textContent = number.textContent;
  stackReader.style.setProperty("--book-accent", setting.color);
  stackReader.style.setProperty("--book-ink", setting.ink);
  activeStackIndex = index;
  if (!stackReader.open) stackReader.showModal();
  requestAnimationFrame(() => stackReader.classList.add("is-unfolded"));
}

function moveStackBook(direction) {
  if (!stackReader.open || !stackBookButtons.length) return;
  window.clearTimeout(stackNavigationTimer);
  stackReader.classList.remove("is-unfolded");
  const nextIndex = (activeStackIndex + direction + stackBookButtons.length) % stackBookButtons.length;
  stackNavigationTimer = window.setTimeout(() => {
    if (stackReader.open) openStackBook(nextIndex);
  }, 220);
}

if (stackBookShelf && stackReader) {
  stackCards.forEach((card, index) => {
    const setting = stackBookSettings[index];
    const number = card.querySelector(".stack-summary small").textContent;
    const title = card.querySelector(".stack-summary strong").cloneNode(true);
    const book = document.createElement("button");
    book.type = "button";
    book.className = "stack-book";
    book.style.setProperty("--book-cover", setting.color);
    book.style.setProperty("--book-ink", setting.ink);
    book.style.setProperty("--book-height", setting.height);
    book.dataset.enAria = `Open ${title.dataset.en || title.textContent}`;
    book.dataset.deAria = `${title.dataset.de || title.textContent} öffnen`;
    book.setAttribute("aria-label", root.lang === "de" ? book.dataset.deAria : book.dataset.enAria);

    const numberLabel = document.createElement("span");
    numberLabel.className = "stack-book-number";
    numberLabel.textContent = number;
    title.classList.add("stack-book-title");
    const code = document.createElement("span");
    code.className = "stack-book-code";
    code.textContent = setting.code;
    book.append(numberLabel, title, code);
    book.addEventListener("click", () => {
      openStackBook(index);
      stackReaderClose.focus();
    });
    stackBookButtons.push(book);
    stackBookShelf.append(book);
  });

  stackReaderClose.addEventListener("click", () => stackReader.close());
  stackReaderPrevious.addEventListener("click", () => moveStackBook(-1));
  stackReaderNext.addEventListener("click", () => moveStackBook(1));
  stackReader.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveStackBook(-1);
    if (event.key === "ArrowRight") moveStackBook(1);
  });
  stackReader.addEventListener("click", (event) => {
    if (event.target === stackReader) stackReader.close();
  });
  stackReader.addEventListener("close", () => {
    window.clearTimeout(stackNavigationTimer);
    stackReader.classList.remove("is-unfolded");
    stackBookButtons[activeStackIndex]?.focus();
  });
  desktopStackBooks.addEventListener("change", (event) => {
    if (!event.matches && stackReader.open) stackReader.close();
  });
}

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
