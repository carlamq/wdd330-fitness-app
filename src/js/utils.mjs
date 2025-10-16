// Fitness App Utils - Based on SleepOutside structure

// Quick selector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// LocalStorage helpers
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Event listeners for touch and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
}

// Get URL parameters
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Render lists with templates
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render with template
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Load template files
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Load header and footer (main function)
export async function loadHeaderFooter() {
  const header = await loadTemplate("/partials/header.html");
  const footer = await loadTemplate("/partials/footer.html");
  
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  
  if (headerElement) renderWithTemplate(header, headerElement);
  if (footerElement) renderWithTemplate(footer, footerElement);
}

// Alert messages for user feedback
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  
  alert.innerHTML = `
    <p>${message}</p>
    <span class="alert-close">×</span>
  `;
  
  alert.addEventListener("click", function(e) {
    if (e.target.classList.contains("alert-close")) {
      const main = document.querySelector("main");
      main.removeChild(this);
    }
  });
  
  const main = document.querySelector("main");
  main.prepend(alert);
  
  if (scroll) {
    window.scrollTo(0, 0);
  }
}
