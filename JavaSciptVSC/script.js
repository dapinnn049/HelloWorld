// script.js

/* 
  Script website romantis:
  - Menangani upload foto & preview
  - Menampilkan slider kata-kata romantis dengan fade animasi
  - Simpan foto & kata-kata di localStorage
  - Animasi background hati jatuh pelan
  - Musik latar dengan tombol play/pause
*/

/* ====================
   Variabel DOM
==================== */
const photoInput = document.getElementById('photo-input');
const mainPhoto = document.getElementById('main-photo');
const quoteDisplay = document.getElementById('quote-display');
const quoteForm = document.getElementById('quote-form');
const quoteInput = document.getElementById('quote-input');
const musicToggleBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

/* ====================
   Data dan State
==================== */
// Kata-kata romantis default (ubah di sini untuk teks awal)
const initialQuotes = [
  "Kau adalah cahaya di setiap langkahku.",
  "Bersamamu, dunia terasa sempurna.",
  "Cinta kita adalah cerita indah yang abadi.",
];

// Array kata yang akan diputar di slider
let quotes = [];
// Index kata yang sedang tampil
let currentQuoteIndex = 0;
// Interval slider
let sliderInterval;

/* ====================
   Resize canvas sesuai window
==================== */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* ====================
   Animasi background: hati jatuh pelan
==================== */
const hearts = [];
const HEART_COUNT = 30;

class Heart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = 10 + Math.random() * 20;
    this.speed = 0.3 + Math.random() * 0.7;
    this.opacity = 0.1 + Math.random() * 0.3;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.01 + Math.random() * 0.02;
  }
  update() {
    this.y += this.speed;
    this.angle += this.angleSpeed;
    if (this.y > canvas.height + this.size) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = 'rgba(255,182,193,0.7)'; // lightpink
    ctx.beginPath();
    // Draw simple heart shape using Bezier curves
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      this.size / 2,
      -this.size / 2,
      this.size,
      this.size / 3,
      0,
      this.size
    );
    ctx.bezierCurveTo(
      -this.size,
      this.size / 3,
      -this.size / 2,
      -this.size / 2,
      0,
      0
    );
    ctx.fill();
    ctx.restore();
  }
}

function initHearts() {
  hearts.length = 0;
  for (let i = 0; i < HEART_COUNT; i++) {
    hearts.push(new Heart());
  }
}
initHearts();

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

/* ====================
   Foto upload & preview
==================== */
// Load foto dari localStorage (base64) jika ada
function loadPhotoFromStorage() {
  const storedPhoto = localStorage.getItem('romanticPhoto');
  if (storedPhoto) {
    mainPhoto.src = storedPhoto;
  }
}

// Saat user pilih file foto
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;

  // Buat reader untuk convert ke base64
  const reader = new FileReader();
  reader.onload = function (e) {
    mainPhoto.src = e.target.result;
    // Simpan ke localStorage
    localStorage.setItem('romanticPhoto', e.target.result);
  };
  reader.readAsDataURL(file);
});

/* ====================
   Kata-kata romantis slider
==================== */
// Load quotes dari localStorage atau pakai default
function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem('romanticQuotes');
  if (storedQuotes) {
    try {
      const arr = JSON.parse(storedQuotes);
      if (Array.isArray(arr) && arr.length > 0) {
        quotes = arr;
        return;
      }
    } catch {}
  }
  quotes = [...initialQuotes];
}
loadQuotesFromStorage();

// Simpan quotes ke localStorage
function saveQuotesToStorage() {
  localStorage.setItem('romanticQuotes', JSON.stringify(quotes));
}

// Tampilkan kata dengan efek fade in/out
function showQuote(index) {
  quoteDisplay.classList.remove('visible');
  setTimeout(() => {
    quoteDisplay.textContent = quotes[index];
    quoteDisplay.classList.add('visible');
  }, 600);
}

// Slider otomatis
function startSlider() {
  showQuote(currentQuoteIndex);
  sliderInterval = setInterval(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    showQuote(currentQuoteIndex);
  }, 5000);
}
startSlider();

/* ====================
   Form tambah kata romantis
==================== */
quoteForm.addEventListener('submit', e => {
  e.preventDefault();
  const newQuote = quoteInput.value.trim();
  if (newQuote.length < 3) {
    alert('Kata-kata harus minimal 3 karakter.');
    return;
  }
  quotes.push(newQuote);
  saveQuotesToStorage();
  quoteInput.value = '';
  currentQuoteIndex = quotes.length - 1; // langsung tampil kata baru
  showQuote(currentQuoteIndex);
});

/* ====================
   Musik latar play/pause
==================== */
musicToggleBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggleBtn.textContent = 'Matikan Musik';
    musicToggleBtn.setAttribute('aria-pressed', 'true');
  } else {
    bgMusic.pause();
    musicToggleBtn.textContent = 'Putar Musik';
    musicToggleBtn.setAttribute('aria-pressed', 'false');
  }
});

// Optional: mulai musik saat halaman siap (tidak otomatis agar tidak mengganggu)
/* Uncomment jika mau autoplay (beberapa browser mungkin block autoplay)
// window.addEventListener('load', () => {
//   bgMusic.play().catch(() => {});
// });
*/

/* ====================
   Inisialisasi
==================== */
window.addEventListener('DOMContentLoaded', () => {
  loadPhotoFromStorage();
});
