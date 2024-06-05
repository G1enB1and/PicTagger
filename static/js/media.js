let data = [];
let intervalId = null;
let preloadedNextImage = new Image();
let preloadedPrevImage = new Image();

export function getIntervalId() {
    return intervalId;
}

export function setIntervalId(id) {
    intervalId = id;
}

export function renderImages(images) {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';
    images.forEach((mediaPath) => {
        const mediaElement = document.createElement(mediaPath.endsWith('.mp4') ? 'video' : 'img');
        mediaElement.src = mediaPath;
        mediaElement.classList.add('imageItem');
        if (mediaPath.endsWith('.mp4')) {
            mediaElement.controls = true;
        }
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

    console.log('displayMedia called');
    console.log('mediaUrl:', mediaUrl);
    console.log('data:', data);

    if (imageElement) {
        imageElement.style.display = 'none';
    }
    if (videoElement) {
        videoElement.style.display = 'none';
        videoElement.src = '';
    }

    if (mediaUrl) {
        console.log(`Displaying media from URL: ${mediaUrl}`);
        preloadAndDisplayMedia(decodeURIComponent(mediaUrl), imageElement, videoElement);
    } else if (data.length > 0) {
        const firstMediaUrl = data[0];
        console.log(`Displaying first media: ${firstMediaUrl}`);
        preloadAndDisplayMedia(firstMediaUrl, imageElement, videoElement);
        history.replaceState(null, '', `?image=${encodeURIComponent(firstMediaUrl)}&panel=${getPanelState() ? 'open' : 'closed'}`);
    } else {
        console.error('Media URL not found in query parameters.');
    }
}

function preloadAndDisplayMedia(src, imgElement, vidElement) {
    console.log('preloadAndDisplayMedia called with src:', src);
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
            console.log(`Image loaded and displayed: ${src}`);
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

    console.log(`Preloading next media: ${data[nextIndex]}`);
    console.log(`Preloading previous media: ${data[prevIndex]}`);
}

export function nextImage() {
    const currentMediaUrl = getCurrentImageUrl();
    const panelState = document.getElementById('leftPanel').style.display === 'block' ? 'open' : 'closed';
    if (!currentMediaUrl) {
        console.error('Media URL not found.');
        return;
    }
    const currentIndex = data.indexOf(decodeURIComponent(currentMediaUrl));
    const nextIndex = (currentIndex + 1) % data.length;
    const nextMediaUrl = data[nextIndex];
    if (nextMediaUrl) {
        window.location.href = `index.php?image=${encodeURIComponent(nextMediaUrl)}&panel=${panelState}`;
        console.log(`Navigating to next media: ${nextMediaUrl}`);
    } else {
        console.error('Next media URL not found.');
    }
}

export function prevImage() {
    const currentMediaUrl = getCurrentImageUrl();
    const panelState = document.getElementById('leftPanel').style.display === 'block' ? 'open' : 'closed';
    if (!currentMediaUrl) {
        console.error('Media URL not found.');
        return;
    }
    const currentIndex = data.indexOf(decodeURIComponent(currentMediaUrl));
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    const prevMediaUrl = data[prevIndex];
    if (prevMediaUrl) {
        window.location.href = `index.php?image=${encodeURIComponent(prevMediaUrl)}&panel=${panelState}`;
        console.log(`Navigating to previous media: ${prevMediaUrl}`);
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
        setIntervalId(null);
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        sessionStorage.setItem('isPlaying', 'false');
        console.log('Paused');
    } else {
        setIntervalId(setInterval(nextImage, 5000));
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        sessionStorage.setItem('isPlaying', 'true');
        console.log('Playing');
    }
}

export function setData(images) {
    data = images;
}

function getCurrentImageUrl() {
    const params = new URLSearchParams(window.location.search);
    const currentImageUrl = params.get('image');
    console.log(`Current image URL: ${currentImageUrl}`);
    return currentImageUrl;
}

function getPanelState() {
    const params = new URLSearchParams(window.location.search);
    return params.get('panel') === 'open';
}

export function displayImageWithUrlUpdate(mediaUrl) {
    const imageElement = document.getElementById('slideshowDisplayedImage');
    const videoElement = document.getElementById('slideshowDisplayedVideo');
    imageElement.style.display = 'none';
    videoElement.style.display = 'none';

    const isVideo = mediaUrl.endsWith('.mp4');
    if (isVideo) {
        videoElement.src = mediaUrl;
        videoElement.style.display = 'block';
        videoElement.load();
    } else {
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
