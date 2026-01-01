// __________________________________________________________________________________
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

  body.removeAttribute("data-theme");
  toggleBtn.textContent = "🌙";
} else {

  body.setAttribute("data-theme", "dark");
  toggleBtn.textContent = "☀️";
  localStorage.setItem("theme", "dark"); 
}

// Theme toggle
toggleBtn.addEventListener("click", () => {
  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme");
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
});

// Mobile menu toggle
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  menuToggle.textContent = navMenu.classList.contains("show") ? "✖" : "☰";
});

const mobileNavLinks = document.querySelectorAll('#navMenu a');

mobileNavLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    menuToggle.textContent = "☰";
  });
});

// __________________________________________________________________________________
//skill fill
const skillFills = document.querySelectorAll('.skill-fill');
const skillsSection = document.querySelector('.skills');

function fillSkills() {
  const sectionTop = skillsSection.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight - 100;

  if (sectionTop < triggerPoint) {
    skillFills.forEach(fill => {
      const width = fill.getAttribute('data-width');
      fill.style.width = width;
    });

    window.removeEventListener('scroll', fillSkills);
  }
}

window.addEventListener('scroll', fillSkills);
fillSkills();


// __________________________________________________________________________________
// project
//filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projects.forEach(project => {
      project.style.display = (filter === 'all' || project.dataset.category === filter) ? 'block' : 'none';
    });

    refreshImages();
    adjustGrid();
  });
});

adjustGrid();
// __________________________________________________________________________________
// lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('#lightbox .close');
const prevBtn = document.querySelector('#lightbox .prev');
const nextBtn = document.querySelector('#lightbox .next');

let currentIndex = 0;
let images = [];
let overlays = [];

function refreshImages() {
  images = [...document.querySelectorAll('.project-card:not([style*="display: none"]) .project-img img')];
  overlays = [...document.querySelectorAll('.project-card:not([style*="display: none"]) .project-img .overlay')];

  overlays.forEach((overlay, i) => {
    overlay.onclick = () => showImage(i);
  });
}

function showImage(index) {
  if (index < 0 || index >= images.length) return;
  currentIndex = index;

  const card = images[currentIndex].closest('.project-card');

  lightboxImg.src = images[currentIndex].src;

  const title = card.dataset.title;
  const desc = card.dataset.description;
  const points = card.dataset.points ? card.dataset.points.split(',') : [];
  const code = card.dataset.code;
  const demo = card.dataset.demo;

  document.querySelector('.lightbox-info h3').textContent = title;
  document.querySelector('.lightbox-info p').textContent = desc;

  const ul = document.querySelector('.lightbox-info ul');
  ul.innerHTML = points.map(p => `<li>${p}</li>`).join('');

  const links = document.querySelector('.lightbox-links');
  links.innerHTML = `
    <a href="${code}" class="btn" target="_blank">Code</a>
     <a href="${demo}" class="btn live" target="_blank">Live Demo</a>
  `;

  lightbox.style.display = "flex";
  lightbox.classList.add("show");
  updateArrows();
}


function updateArrows() {
  prevBtn.classList.toggle("disabled", currentIndex === 0);
  nextBtn.classList.toggle("disabled", currentIndex === images.length - 1);
}

// close button
closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('show');
  setTimeout(() => (lightbox.style.display = "none"), 300);
});

// prev/next buttons
prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

// keyboard support
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'Escape') {
      lightbox.classList.remove('show');
      setTimeout(() => (lightbox.style.display = "none"), 300);
    }
  }
});

refreshImages();

function adjustGrid() {
  const container = document.querySelector('.projects-container');
  const visibleCards = [...container.querySelectorAll('.project-card')].filter(card => card.style.display !== 'none');

  if (visibleCards.length === 1) {
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    visibleCards[0].style.maxWidth = '350px';
  } else if (visibleCards.length === 2) {
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.gap = '25px';
    visibleCards.forEach(card => card.style.maxWidth = '350px');
  } else {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    container.style.gap = '25px';
    visibleCards.forEach(card => card.style.maxWidth = '100%');
  }
}

// __________________________________________________________________________________
// form
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const customAlert = document.getElementById('customAlert');
const alertMessage = document.getElementById('alertMessage');

function showAlert(message, type = "success") {
  alertMessage.textContent = message;
  customAlert.className = `custom-alert show ${type}`;

  setTimeout(() => {
    customAlert.classList.remove("show");
  }, 3000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      showAlert("✅ Message sent successfully!", "success");
      form.reset();
    } else {
      const data = await response.json();
      const errorMsg = data.errors
        ? data.errors.map(err => err.message).join(", ")
        : "Oops! Something went wrong.";

      showAlert("❌ " + errorMsg, "error");
    }

  } catch (error) {
    showAlert("❌ Network error. Please try again.", "error");
  }
});


// __________________________________________________________________________________
// chatbox
const chatNudge = document.getElementById('chat-nudge');
const chatBtn = document.getElementById('chat-btn');
const chatPopup = document.getElementById('chat-popup');
const chatClose = document.getElementById('chat-close');

setTimeout(() => {
  chatNudge.classList.add('show');
}, 4000);

setTimeout(() => {
  chatNudge.classList.remove('show');
  setTimeout(() => {
    chatNudge.style.display = 'none';
  }, 500);
}, 63000);

chatBtn.addEventListener('click', () => {
  chatPopup.style.display = chatPopup.style.display === 'block' ? 'none' : 'block';
});

chatClose.addEventListener('click', () => {
  chatPopup.style.display = 'none';
});

// __________________________________________________________________________________
// nav active
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let scrollY = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (scrollY >= offset && scrollY < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
});














