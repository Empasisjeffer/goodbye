document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Floating Hearts / Petals Animation
    const heartsContainer = document.getElementById('hearts-container');
    // Using a mix of soft emotional colors for the falling elements
    const heartColors = ['#8a2b4b', '#631f36', '#ffd1dc', '#ffffff', '#c95b83'];
    // Mix of hearts and petals
    const heartCharacters = ['❤', '♥', '❥', '💕', '🥀', '✧'];
    
    // Broken heart images for background mask
    const brokenHeartImages = [
        './aab0db3c-d26f-45f8-8f83-ce0739e5c32b (1).jpg',
        './8865239c-3758-4c92-a272-01aad4451501.jpg',
        './639759ca-abf5-40b1-b80a-6652c2e54a22.jpg',
        './7b9ee8a0-3961-4b41-b455-0c59b96adc48.jpg'
    ];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // 25% chance to create a broken heart image
        if (Math.random() < 0.25) {
            const randomImg = brokenHeartImages[Math.floor(Math.random() * brokenHeartImages.length)];
            heart.classList.add('falling-image-heart');
            heart.style.backgroundImage = `url('${randomImg}')`;
            heart.innerHTML = '<i class="fas fa-heart-broken"></i>';
            const size = Math.random() * 30 + 35; // 35px to 65px
            heart.style.fontSize = `${size}px`;
        } else {
            // Standard text character
            const char = heartCharacters[Math.floor(Math.random() * heartCharacters.length)];
            const color = heartColors[Math.floor(Math.random() * heartColors.length)];
            const size = Math.random() * 20 + 12; // 12px to 32px
            heart.innerText = char;
            heart.style.color = color;
            heart.style.fontSize = `${size}px`;
        }
        heart.style.left = `${Math.random() * 100}vw`;
        
        // Randomize animation
        const duration = Math.random() * 7 + 6; // 6s to 13s for slow, sad falling effect
        heart.style.animationDuration = `${duration}s`;
        
        // Remove element after animation completes to avoid memory leaks
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
        
        heartsContainer.appendChild(heart);
    }

    // Create hearts periodically
    setInterval(createHeart, 450);

    // 2. Audio Control with Playlist Logic
    const playBtn = document.getElementById('play-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;
    
    const playlist = [
        './Tothapi - Panata (Lyrics).mp3',
        './Panaginip - nicole (Official Music Video).mp3'
    ];
    let currentTrackIndex = 0;

    // Set volume to be a bit softer
    bgMusic.volume = 0.5;

    function updateTrackInfo() {
        const statusText = document.getElementById('music-status-text');
        const albumArt = document.getElementById('album-art');
        const panataStatus = document.querySelector('#play-panata .track-status');
        
        if (currentTrackIndex === 0) {
            if (panataStatus) panataStatus.innerHTML = isPlaying ? 'Playing... <i class="fas fa-music"></i>' : 'Click to Play <i class="fas fa-play"></i>';
            if (statusText) statusText.innerHTML = 'Next: Panaginip <i class="fas fa-forward" style="font-size: 0.8rem; margin-left: 5px;"></i>';
            if (albumArt) albumArt.classList.remove('playing');
        } else {
            if (panataStatus) panataStatus.innerHTML = 'Played <i class="fas fa-check"></i>';
            if (statusText) statusText.innerHTML = isPlaying ? 'Playing... <i class="fas fa-music" style="font-size: 0.8rem; margin-left: 5px;"></i>' : 'Click to Play <i class="fas fa-play" style="font-size: 0.8rem; margin-left: 5px;"></i>';
            if (albumArt && isPlaying) albumArt.classList.add('playing');
            else if (albumArt) albumArt.classList.remove('playing');
        }
    }

    function playTrack(index) {
        currentTrackIndex = index;
        bgMusic.src = playlist[currentTrackIndex];
        bgMusic.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            updateTrackInfo();
        }).catch(e => console.error("Audio playback failed:", e));
    }

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(e => {
                console.error("Audio playback failed, attempting first track:", e);
                playTrack(0);
            });
        }
        updateTrackInfo();
    }

    // Handle track ended -> play next
    bgMusic.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack(currentTrackIndex);
    });

    playBtn.addEventListener('click', toggleMusic);

    const playPanata = document.getElementById('play-panata');
    if (playPanata) {
        playPanata.addEventListener('click', () => playTrack(0));
    }

    const playPanaginip = document.getElementById('play-panaginip');
    if (playPanaginip) {
        playPanaginip.addEventListener('click', () => playTrack(1));
    }

    // 3. Scroll Intersection Observer for Smooth Fade-in Effects
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // Trigger initial visible check for elements already in viewport on load
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('visible');
            }
        });
    }, 150);


    // 5. Navigation Logic (SPA Tab Switching)
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    const appContent = document.getElementById('app-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            navButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all views
            views.forEach(view => {
                view.classList.remove('active');
            });

            // Show target view
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
            
            // Auto-play music when ANY view is clicked (Home, Letter, Photos, ML Memories, or Music)
            if (!isPlaying) {
                toggleMusic();
            }
            
            // Scroll to top of app content wrapper when switching views
            appContent.scrollTo(0, 0);
        });
    });

    // 6. Days Since Goodbye Countdown Logic
    function updateCountdown() {
        const goodbyeDate = new Date('2026-04-25T00:00:00'); // The date you said goodbye
        const now = new Date();
        const diffTime = Math.abs(now - goodbyeDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const daysElement = document.getElementById('days-count');
        if (daysElement) {
            daysElement.innerText = diffDays;
        }
    }

    updateCountdown();
});
