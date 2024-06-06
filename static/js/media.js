let data = [];
let preloadedNextImage = new Image();
let preloadedPrevImage = new Image();

export function setData(images) {
    data = images;
    renderImages();
}

function renderImages() {
    const imageGrid = document.getElementById('imageGrid');
    if (!imageGrid) {
        console.error('Image grid container not found.');
        return;
    }

    imageGrid.innerHTML = '';
    data.forEach(mediaPath => {
        const mediaElement = document.createElement('img');
        mediaElement.src = mediaPath;
        mediaElement.classList.add('imageItem');
        mediaElement.addEventListener('click', () => handleImageClick(mediaPath));
        imageGrid.appendChild(mediaElement);
    });
}

function handleImageClick(mediaPath) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('view', 'slideshow');
    currentUrl.searchParams.set('image', mediaPath);
    window.history.pushState({}, '', currentUrl.toString());
    loadSlideshow(mediaPath);
}

function loadSlideshow(mediaPath) {
    fetch('slideshow.php')
        .then(response => response.text())
        .then(html => {
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = html;
            displayMedia(mediaPath);
            preloadAdjacentMedia();
        })
        .catch(error => console.error('Error loading slideshow:', error));
}

export function displayMedia(mediaUrl) {
    const imageElement = document.getElementById('slideshowDisplayedImage');
    const videoElement = document.getElementById('slideshowDisplayedVideo');

    if (imageElement) {
        imageElement.style.display = 'none';
    }
    if (videoElement) {
        videoElement.style.display = 'none';
        videoElement.src = '';
    }

    if (mediaUrl) {
        preloadAndDisplayMedia(decodeURIComponent(mediaUrl), imageElement, videoElement);
    } else if (data.length > 0) {
        const firstMediaUrl = data[0];
        preloadAndDisplayMedia(firstMediaUrl, imageElement, videoElement);
        history.replaceState(null, '', `?image=${encodeURIComponent(firstMediaUrl)}&panel=${getPanelState() ? 'open' : 'closed'}`);
    } else {
        console.error('Media URL not found in query parameters.');
    }
}

function preloadAndDisplayMedia(src, imgElement, vidElement) {
    const isVideo = src.endsWith('.mp4');
    if (isVideo && vidElement) {
        vidElement.src = src;
        vidElement.style.display = 'block';
        vidElement.autoplay = true;
        vidElement.load();
        if (imgElement) imgElement.style.display = 'none';
    } else if (imgElement) {
        if (vidElement) vidElement.style.display = 'none';
        const preloader = new Image();
        preloader.onload = () => {
            imgElement.src = src;
            imgElement.style.display = 'block';
        };
        preloader.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
        preloader.src = src;
    }
}

export function preloadAdjacentMedia() {
    const currentMediaUrl = getCurrentImageUrl();
    if (!currentMediaUrl) {
        console.error('Media URL not found.');
        return;
    }
    const currentIndex = data.indexOf(decodeURIComponent(currentMediaUrl));

    const nextIndex = (currentIndex + 1) % data.length;
    const prevIndex = (currentIndex - 1 + data.length) % data.length;

    preloadedNextImage.src = data[nextIndex];
    preloadedPrevImage.src = data[prevIndex];
}

export function nextImage() {
    const currentMediaUrl = getCurrentImageUrl();
    const panelState = getPanelState() ? 'open' : 'closed';
    if (!currentMediaUrl) {
        console.error('Media URL not found.');
        return;
    }
    const currentIndex = data.indexOf(decodeURIComponent(currentMediaUrl));
    const nextIndex = (currentIndex + 1) % data.length;
    const nextMediaUrl = data[nextIndex];
    if (nextMediaUrl) {
        window.location.href = `index.php?image=${encodeURIComponent(nextMediaUrl)}&panel=${panelState}`;
    } else {
        console.error('Next media URL not found.');
    }
}

export function prevImage() {
    const currentMediaUrl = getCurrentImageUrl();
    const panelState = getPanelState() ? 'open' : 'closed';
    if (!currentMediaUrl) {
        console.error('Media URL not found.');
        return;
    }
    const currentIndex = data.indexOf(decodeURIComponent(currentMediaUrl));
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    const prevMediaUrl = data[prevIndex];
    if (prevMediaUrl) {
        window.location.href = `index.php?image=${encodeURIComponent(prevMediaUrl)}&panel=${panelState}`;
    } else {
        console.error('Previous media URL not found.');
    }
}

export function togglePlayPause() {
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = playPauseButton.querySelector('.fa-play');
    const pauseIcon = playPauseButton.querySelector('.fa-pause');
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        sessionStorage.setItem('isPlaying', 'false');
    } else {
        intervalId = setInterval(nextImage, 4000); // Set interval to 4 seconds
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        sessionStorage.setItem('isPlaying', 'true');
    }
}

export function displayImageWithUrlUpdate(mediaUrl) {
    const imageElement = document.getElementById('slideshowDisplayedImage');
    const videoElement = document.getElementById('slideshowDisplayedVideo');

    if (imageElement) {
        imageElement.style.display = 'none';
    }
    if (videoElement) {
        videoElement.style.display = 'none';
    }

    const isVideo = mediaUrl.endsWith('.mp4');
    if (isVideo && videoElement) {
        videoElement.src = mediaUrl;
        videoElement.style.display = 'block';
        videoElement.load();
    } else if (imageElement) {
        const preloader = new Image();
        preloader.onload = () => {
            imageElement.src = mediaUrl;
            imageElement.style.display = 'block';
            history.replaceState(null, '', `?image=${encodeURIComponent(mediaUrl)}`);
        };
        preloader.onerror = () => {
            console.error(`Failed to load image: ${mediaUrl}`);
        };
        preloader.src = mediaUrl;
    }
}

function getCurrentImageUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('image');
}

function getPanelState() {
    const params = new URLSearchParams(window.location.search);
    return params.get('panel') === 'open';
}
