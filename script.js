// --- 1. ZEGAR ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const clockElement = document.getElementById('liveClock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
setInterval(updateClock, 1000);
updateClock();


// --- 2. TYPEWRITER (EFEKT PISANIA) ---
const words = ["Niezastąpiony Wujek", "Programista", "Zjeb", "Inwestor"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function typeEffect() {
    if (!typewriterElement) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
}
typeEffect();


// --- 3. EKRAN WEJŚCIA (OVERLAY) I AUDIO/VIDEO ---
const overlay = document.getElementById("overlay");
const bgAudio = document.getElementById("bgAudio");
const bgVideo = document.getElementById("bgVideo");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");

// Kliknięcie w ekran wejściowy
if (overlay) {
    overlay.addEventListener("click", () => {
        // Schowanie czarnego ekranu z płynnym znikaniem
        overlay.classList.add("hidden");
        
        // Start muzyki
        if (bgAudio) {
            bgAudio.play().then(() => {
                if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
            }).catch(() => {});
        }

        // Start wideo
        if (bgVideo && bgVideo.paused) {
            bgVideo.play().catch(() => {});
        }
    });
}

// Przycisk Wycisz / Włącz
function toggleMute() {
    if (!bgAudio) return;

    if (bgAudio.paused) {
        bgAudio.play();
        bgAudio.muted = false;
        if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
    } else {
        if (bgAudio.muted) {
            bgAudio.muted = false;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
        } else {
            bgAudio.muted = true;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
        }
    }
}

if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
}
