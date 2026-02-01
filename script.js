document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.getElementById('themeToggle');
    const circle = document.getElementById('themeCircle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    toggle.addEventListener('click', () => {
        setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    function setTheme(theme) {
        html.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        toggle.classList.toggle('light-active', theme === 'light');
        circle.innerHTML = theme === 'light' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    window.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');
    });

    gsap.registerPlugin(ScrollTrigger);

    // reveal từ trái
    gsap.utils.toArray('.reveal-x-left').forEach(el => {
        gsap.from(el, {
            x: -120,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        });
    });

    // reveal từ phải
    gsap.utils.toArray('.reveal-x-right').forEach(el => {
        gsap.from(el, {
            x: 120,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        });
    });

    gsap.to(".hero-image img", {
        scale: 1.08,
        scrollTrigger: {
            trigger: ".hero-split",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
});

// Show form booking
function showForm(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeForm() {
  document.getElementById('booking').classList.remove('active');
  document.body.style.overflow = '';
}

// Show price table
function showTable(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
  content
}

function closeTable() {
  document.getElementById('price-table').classList.remove('active');
  document.body.style.overflow = '';
}


// Carousel
const track = document.querySelector(".feature-track");
let cards = Array.from(document.querySelectorAll(".feature-card"));
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let visible = getVisible();
let index = visible;

function getVisible() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function cardWidth() {
  if (window.innerWidth < 768) {
    return document.querySelector(".feature-viewport").offsetWidth;
  }
  return cards[0].getBoundingClientRect().width + 24;
}

function setupClones() {
  track.innerHTML = "";

  const originals = cards.slice(0);
  const first = originals.slice(0, visible).map(c => c.cloneNode(true));
  const last = originals.slice(-visible).map(c => c.cloneNode(true));

  last.forEach(c => track.appendChild(c));
  originals.forEach(c => track.appendChild(c));
  first.forEach(c => track.appendChild(c));

  cards = Array.from(document.querySelectorAll(".feature-card"));
  index = visible;

  requestAnimationFrame(() => move(true));
}

function move(noTransition = false) {
  track.style.transition = noTransition ? "none" : "transform 0.6s ease";
  track.style.transform = `translateX(-${index * cardWidth()}px)`;

  setActiveCard();
}

function setActiveCard() {
  cards.forEach(c => c.classList.remove("active"));

  const centerOffset = Math.floor(visible / 2);
  const activeIndex = index + centerOffset;

  if (cards[activeIndex]) {
    cards[activeIndex].classList.add("active");
  }
}

next.onclick = () => {
  index++;
  move();
};

prev.onclick = () => {
  index--;
  move();
};

track.addEventListener("transitionend", () => {
  if (index >= cards.length - visible) {
    index = visible;
    move(true);
  }
  if (index <= 0) {
    index = cards.length - visible;
    move(true);
  }
});

window.addEventListener("resize", () => {
  visible = getVisible();
  setupClones();
});

setupClones();

// Touch
const viewport = document.querySelector('.feature-viewport');

let isDragging = false;
let startX = 0;
let currentX = 0;
let dragOffset = 0;

/* ===== BASE OFFSET ===== */
function getBaseOffset() {
  return -index * cardWidth();
}

/* ===== START ===== */
function dragStart(x) {
  isDragging = true;
  startX = x;
  dragOffset = 0;
  track.style.transition = "none";
  viewport.classList.add('dragging');
}

/* ===== MOVE ===== */
function dragMove(x) {
  if (!isDragging) return;

  currentX = x;
  dragOffset = currentX - startX;

  track.style.transform =
    `translateX(${getBaseOffset() + dragOffset}px)`;
}

/* ===== END ===== */
function dragEnd() {
  if (!isDragging) return;

  isDragging = false;
  viewport.classList.remove('dragging');

  if (dragOffset > 80) index--;
  if (dragOffset < -80) index++;

  dragOffset = 0;
  move();
}

/* ===== DESKTOP ===== */
viewport.addEventListener('mousedown', e => {
  e.preventDefault();
  dragStart(e.clientX);
});

window.addEventListener('mousemove', e => dragMove(e.clientX));
window.addEventListener('mouseup', dragEnd);

/* ===== MOBILE ===== */
viewport.addEventListener('touchstart', e =>
  dragStart(e.touches[0].clientX)
);

viewport.addEventListener('touchmove', e => {
  dragMove(e.touches[0].clientX);
}, { passive: true });

viewport.addEventListener('touchend', dragEnd);

/* ===== CHECK FORM ===== */
document.getElementById("bookingForm").addEventListener("submit", function(e){
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const phoneNum = document.getElementById("phoneNum").value.trim();

  // Check phone number
  const phoneCheck = /^(0[3|5|7|8|9])[0-9]{8}$/;

  if(!phoneCheck.test(phoneNum)){
    e.preventDefault();
    alert("Số điện thoại không hợp lệ!");
    return;
  }

  // Check date
  if(new Date(endDate) <= new Date(startDate)){
    e.preventDefault();
    alert("Ngày về phải sau ngày đi!");
    return;
  }
});