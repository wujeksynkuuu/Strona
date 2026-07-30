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


// --- 3. DŹWIĘKI UI (WEB AUDIO API) ---
let audioCtx;
function playUiSound(freq, type = 'sine', duration = 0.05) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

// Podpięcie dźwięków do interaktywnych elementów
document.querySelectorAll('a, button, .tag').forEach(elem => {
    elem.addEventListener('mouseenter', () => playUiSound(600, 'sine', 0.03));
    elem.addEventListener('click', () => playUiSound(300, 'triangle', 0.08));
});


// --- 4. NIESTANDARDOWY KURSOR MYSZY ---
const cursorDot = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .tag, input').forEach(elem => {
    elem.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    elem.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
});


// --- 5. EKRAN WEJŚCIA, AUDIO I SUWAK GŁOŚNOŚCI ---
const overlay = document.getElementById("overlay");
const bgAudio = document.getElementById("bgAudio");
const bgVideo = document.getElementById("bgVideo");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");
const volumeSlider = document.getElementById("volumeSlider");

if (overlay) {
    overlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
        
        if (bgAudio) {
            bgAudio.play().then(() => {
                if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
            }).catch(() => {});
        }

        if (bgVideo && bgVideo.paused) {
            bgVideo.play().catch(() => {});
        }
    });
}

if (volumeSlider && bgAudio) {
    volumeSlider.addEventListener("input", (e) => {
        bgAudio.volume = e.target.value;
        if (bgAudio.volume == 0) {
            bgAudio.muted = true;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
        } else {
            bgAudio.muted = false;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
        }
    });
}

function toggleMute() {
    if (!bgAudio) return;

    if (bgAudio.paused) {
        bgAudio.play();
        bgAudio.muted = false;
        if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
    } else {
        if (bgAudio.muted) {
            bgAudio.muted = false;
            if (volumeSlider) volumeSlider.value = bgAudio.volume || 1;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
        } else {
            bgAudio.muted = true;
            if (volumeSlider) volumeSlider.value = 0;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
        }
    }
}

if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
}


// --- 6. INTEGRACJA LANYARD DISCORD API ---
const DISCORD_ID = "933668988150489088";

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await response.json();

        if (!json.success) return;

        const data = json.data;
        const statusDot = document.getElementById("discordStatusDot");

        // Aktualizacja kropki statusu
        if (statusDot) {
            statusDot.className = `status-dot ${data.discord_status}`;
        }

        // Spotify Activity
        const spotifyCard = document.getElementById("spotifyCard");
        const spotifyTrack = document.getElementById("spotifyTrack");
        const spotifyArtist = document.getElementById("spotifyArtist");

        if (data.listening_to_spotify && data.spotify) {
            if (spotifyTrack) spotifyTrack.textContent = data.spotify.song;
            if (spotifyArtist) spotifyArtist.textContent = `by ${data.spotify.artist}`;
            if (spotifyCard) spotifyCard.classList.remove("hidden");
        } else {
            if (spotifyCard) spotifyCard.classList.add("hidden");
        }

    } catch (e) {
        console.error("Błąd pobierania danych Lanyard API:", e);
    }
}

// Pierwsze pobranie + odświeżanie co 10 sekund
fetchDiscordStatus();
setInterval(fetchDiscordStatus, 10000);
