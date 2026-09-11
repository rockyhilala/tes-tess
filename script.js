// ===== Konfigurasi diambil dari window.WEDDING_CONFIG (diisi otomatis oleh builder) =====
var CFG = window.WEDDING_CONFIG || {};

// Handle URL parameters for recipient name
const urlParams = new URLSearchParams(window.location.search);
const recipientName = urlParams.get('kepada');

if (recipientName) {
  const newUrl = window.location.origin + window.location.pathname + '?kepada=' + recipientName;
  const ogUrlMeta = document.querySelector('meta[property="og:url"]');
  if (ogUrlMeta) ogUrlMeta.setAttribute("content", newUrl);
  const recipientEl = document.getElementById('recipient-name');
  if (recipientEl) recipientEl.textContent = recipientName.replace(/\+/g, ' ');
}

// Countdown function -> targets #countdown, renders Hari/Jam/Mnt/Dtk boxes
function countdown() {
  const countDate = new Date(CFG.countdownDate || "2027-01-01T00:00:00").getTime();
  const now = new Date().getTime();
  const gap = countDate - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const textDay = Math.max(Math.floor(gap / day), 0);
  const textHour = Math.max(Math.floor((gap % day) / hour), 0);
  const textMinute = Math.max(Math.floor((gap % hour) / minute), 0);
  const textSecond = Math.max(Math.floor((gap % minute) / second), 0);

  const el = document.getElementById('countdown');
  if (!el) return;
  el.innerHTML =
    `<div>${textDay}<p>Hari</p></div>
     <div>${textHour}<p>Jam</p></div>
     <div>${textMinute}<p>Mnt</p></div>
     <div>${textSecond}<p>Dtk</p></div>`;
}
setInterval(countdown, 1000);
countdown();

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Nomor rekening berhasil disalin!');
  }).catch(() => {
    alert('Gagal menyalin nomor rekening.');
  });
}

function openPhotoModal(src, alt) {
  const modal = document.getElementById('photo-modal');
  const img = document.getElementById('photo-modal-img');
  img.src = src;
  img.alt = alt || '';
  modal.classList.add('open');
}

function closePhotoModal() {
  document.getElementById('photo-modal').classList.remove('open');
}

// Build a simple animated waveform for the music card
function buildWaveform() {
  const wf = document.getElementById('waveform');
  if (!wf) return;
  const bars = 28;
  for (let i = 0; i < bars; i++) {
    const bar = document.createElement('span');
    bar.style.height = (30 + Math.random() * 70) + '%';
    wf.appendChild(bar);
  }
}
buildWaveform();

const PAUSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/></svg>';
const PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/></svg>';

// Play music, reveal all frames, and go fullscreen on "Open Invitation"
document.addEventListener('DOMContentLoaded', () => {
  const openMusicBtn = document.getElementById('open-music-btn');
  const frameCover = document.getElementById('frame-cover');
  const musicControlInline = document.getElementById('music-control-inline');
  const backgroundMusic = document.getElementById('background-music');

  const allFrames = [
    'frame-savedate',
    'frame-music',
    'frame-bridegroom',
    'frame-weddingday',
    'frame-detail',
    'frame-lovestory',
    'frame-gift',
    'frame-wishes',
    'frame-closing'
  ];

  if (openMusicBtn) {
    openMusicBtn.addEventListener('click', () => {
      frameCover.classList.add('out-frame');

      allFrames.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'flex';
      });

      document.body.style.overflow = 'auto';

      if (backgroundMusic) {
        backgroundMusic.play().catch(() => {});
        setMusicIcon(PAUSE_ICON);
      }

      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Gagal fullscreen: ${err.message}`);
        });
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    });
  }

  if (musicControlInline) musicControlInline.addEventListener('click', toggleMusic);

  function toggleMusic() {
    if (!backgroundMusic) return;
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      setMusicIcon(PAUSE_ICON);
    } else {
      backgroundMusic.pause();
      setMusicIcon(PLAY_ICON);
    }
  }

  function setMusicIcon(svg) {
    if (musicControlInline) musicControlInline.innerHTML = svg;
  }

  document.addEventListener('visibilitychange', () => {
    if (!backgroundMusic) return;
    const invitationOpened = frameCover.classList.contains('out-frame');
    if (document.hidden) {
      backgroundMusic.pause();
    } else if (invitationOpened && backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {});
    }
  });
});

// Scroll-reveal transitions
document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.35 };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.transisi').forEach(el => observer.observe(el));
});

// ===== Guestbook (ucapan) via Google Apps Script =====

const UCAPAN_URL = CFG.guestbookUrl || '';

document.addEventListener('DOMContentLoaded', function () {
  if (UCAPAN_URL) {
    fetchUcapan();
  } else {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'none';
  }
});

function fetchUcapan() {
  fetch(UCAPAN_URL)
    .then(response => response.json())
    .then(data => {
      data.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
      displayAllUcapan(data);
      const spinner = document.getElementById('spinner');
      if (spinner) spinner.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching ucapan:', error);
      const spinner = document.getElementById('spinner');
      if (spinner) spinner.style.display = 'none';
    });
}

function displayAllUcapan(ucapanData) {
  const ucapanContainer = document.getElementById('ucapan');
  if (!ucapanContainer) return;
  ucapanContainer.innerHTML = '';

  ucapanData.forEach(ucapan => {
    const waktu = new Date(ucapan.waktu);
    const tanggal = waktu.toLocaleDateString();
    const jam = waktu.toLocaleTimeString();

    const ucapanItem = document.createElement('div');
    ucapanItem.classList.add('ucapan-item');
    ucapanItem.innerHTML = `
      <small><em>${tanggal} : ${jam}</em></small><br/>
      <strong>${ucapan.nama} (${ucapan.kehadiran}):</strong>
      <p>${ucapan.pesan}</p>
      <hr>
    `;
    ucapanContainer.appendChild(ucapanItem);
  });
}

const formPernikahan = document.getElementById('formPernikahan');
if (formPernikahan) {
  formPernikahan.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!UCAPAN_URL) {
      displayAlert('Fitur ucapan belum diaktifkan.');
      return;
    }

    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'block';

    const nama = document.getElementById('nama').value;
    const kehadiran = document.getElementById('kehadiran').value;
    const pesan = document.getElementById('pesan').value;

    fetch(UCAPAN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ nama, kehadiran, pesan })
    })
      .then(response => response.text())
      .then(() => {
        if (spinner) spinner.style.display = 'none';
        formPernikahan.reset();
        displayAlert("Ucapan terkirim!");
        fetchUcapan();
      })
      .catch(() => {
        const respon = document.getElementById('respon');
        if (respon) respon.innerHTML = 'Terjadi kesalahan, coba lagi nanti.';
        if (spinner) spinner.style.display = 'none';
      });
  });
}

function displayAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.classList.add('alert-box');
  alertBox.innerHTML = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}
