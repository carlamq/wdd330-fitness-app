export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load header and footer templates
export async function loadHeaderFooter() {
  try {
    const headerRes = await fetch("/partials/header.html");
    const footerRes = await fetch("/partials/footer.html");
    
    const headerTemplate = await headerRes.text();
    const footerTemplate = await footerRes.text();

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
    
    if (headerElement) headerElement.innerHTML = headerTemplate;
    if (footerElement) footerElement.innerHTML = footerTemplate;
    
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
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
