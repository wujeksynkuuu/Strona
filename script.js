// --- 1. ZEGAR ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('liveClock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();


// --- 3. TYPEWRITER ---
const words = ["Niezastąpiony Wujek", "Programista", "Zjeb", "Inwestor"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function typeEffect() {
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


// --- 4. WYCISZANIE / WŁĄCZANIE JEDNEGO UTWORU ---
const bgAudio = document.getElementById("bgAudio");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");

function toggleMute() {
    if (bgAudio.paused) {
        bgAudio.play();
        bgAudio.muted = false;
        muteIcon.className = "fa-solid fa-volume-high";
    } else {
        if (bgAudio.muted) {
            bgAudio.muted = false;
            muteIcon.className = "fa-solid fa-volume-high";
        } else {
            bgAudio.muted = true;
            muteIcon.className = "fa-solid fa-volume-xmark";
        }
    }
}

muteBtn.addEventListener("click", toggleMute);

// Automatyczny start przy pierwszym kliknięciu w dowolne miejsce strony (obejście blokady przeglądarek)
document.addEventListener('click', () => {
    if (bgAudio && bgAudio.paused) {
        bgAudio.play().then(() => {
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
        }).catch(() => {
            // Przeglądarka zablokowała autoplay
        });
    }
}, { once: true });

// Start wideo na telefonach
const bgVideo = document.getElementById("bgVideo");

if (bgVideo) {
    document.addEventListener('touchstart', () => {
        if (bgVideo.paused) {
            bgVideo.play();
        }
    }, { once: true });
}
