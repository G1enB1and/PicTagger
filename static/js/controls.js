let intervalId = null;
const transitionInterval = 4000;

export function togglePlayPause() {
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = playPauseButton ? playPauseButton.querySelector('.fa-play') : null;
    const pauseIcon = playPauseButton ? playPauseButton.querySelector('.fa-pause') : null;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        sessionStorage.setItem('isPlaying', 'false');
        console.log('Paused');
    } else {
        intervalId = setInterval(nextImage, transitionInterval);
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        sessionStorage.setItem('isPlaying', 'true');
        console.log('Playing');
    }
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
        console.log(`Navigating to next media: ${nextMediaUrl}`);
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
        console.log(`Navigating to previous media: ${prevMediaUrl}`);
    } else {
        console.error('Previous media URL not found.');
    }
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
