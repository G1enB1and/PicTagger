document.addEventListener('DOMContentLoaded', () => {
    const resizerFileTree = document.getElementById('resizer-filetree');
    const resizerDataPanel = document.getElementById('resizer-datapanel');
    const fileTree = document.querySelector('.file-tree');
    const dataPanel = document.querySelector('.data-panel');
    const mainContent = document.querySelector('.main-content');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const fileTreeIcon = document.getElementById('file-tree-icon');
    const currentUrl = new URL(window.location.href);
    const dataPanelToggleParam = currentUrl.searchParams.get('dataPanelToggle');
    const leftPanelToggleParam = currentUrl.searchParams.get('leftPanelToggle');
    const showDataPanel = dataPanelToggleParam !== 'hide';
    const showLeftPanel = leftPanelToggleParam !== 'hide';

    console.log('JavaScript is running');
    console.log('Current URL:', currentUrl.toString());
    console.log('Data Panel Toggle Param:', dataPanelToggleParam);
    console.log('Left Panel Toggle Param:', leftPanelToggleParam);
    console.log('Show Data Panel:', showDataPanel);
    console.log('Show Left Panel:', showLeftPanel);

    // Function to toggle data panel
    const toggleDataPanel = (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        if (showDataPanel) {
            currentUrl.searchParams.set('dataPanelToggle', 'hide');
        } else {
            currentUrl.searchParams.set('dataPanelToggle', 'show');
        }
        console.log('Updated URL for Data Panel:', currentUrl.toString());
        window.location.href = currentUrl.toString();
    };

    // Function to toggle left panel
    const toggleLeftPanel = (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        if (showLeftPanel) {
            currentUrl.searchParams.set('leftPanelToggle', 'hide');
        } else {
            currentUrl.searchParams.set('leftPanelToggle', 'show');
        }
        console.log('Updated URL for Left Panel:', currentUrl.toString());
        window.location.href = currentUrl.toString();
    };

    // Attach click event listener to the hamburger icon
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', toggleDataPanel);
    } else {
        console.error('Hamburger icon not found');
    }

    // Attach click event listener to the file tree icon
    if (fileTreeIcon) {
        fileTreeIcon.addEventListener('click', toggleLeftPanel);
    } else {
        console.error('File tree icon not found');
    }

    const initResize = (resizer, panel, isFileTree) => {
        if (resizer && panel) {
            resizer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                window.addEventListener('mousemove', startResize);
                window.addEventListener('mouseup', stopResize);

                function startResize(event) {
                    if (isFileTree) {
                        let newWidth = event.clientX;
                        if (newWidth > 50 && newWidth < window.innerWidth - 100) { // Ensure some limits for resizing
                            panel.style.width = newWidth + 'px';
                            mainContent.style.width = (window.innerWidth - newWidth - (dataPanel ? dataPanel.offsetWidth : 0)) + 'px';
                        }
                    } else {
                        let newWidth = window.innerWidth - event.clientX;
                        if (newWidth > 50 && newWidth < window.innerWidth - 100) { // Ensure some limits for resizing
                            panel.style.width = newWidth + 'px';
                            mainContent.style.width = (window.innerWidth - newWidth - (fileTree ? fileTree.offsetWidth : 0)) + 'px';
                        }
                    }
                }

                function stopResize() {
                    window.removeEventListener('mousemove', startResize);
                    window.removeEventListener('mouseup', stopResize);
                }
            });
        } else {
            console.error('Resizer or panel not found');
        }
    };

    // Initialize resizers only if the corresponding elements are present
    if (resizerFileTree && fileTree) {
        initResize(resizerFileTree, fileTree, true);
    }

    if (resizerDataPanel && dataPanel) {
        initResize(resizerDataPanel, dataPanel, false);
    }

    // Function to save panel state to session storage
    function savePanelState() {
        const leftPanel = document.getElementById('leftPanel');
        const isLeftPanelOpen = leftPanel && leftPanel.style.display !== 'none';
        const dataPanel = document.querySelector('.data-panel');
        const isDataPanelOpen = dataPanel && dataPanel.style.display !== 'none';
        sessionStorage.setItem('leftPanelOpen', isLeftPanelOpen);
        sessionStorage.setItem('dataPanelOpen', isDataPanelOpen);
    }

    // Code from script2.js for handling media
    let data = [];
    let intervalId = null;
    let preloadedNextImage = new Image();
    let preloadedPrevImage = new Image();

    console.log('Script2 functionality loaded');

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
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

    function displayMedia() {
        const mediaUrl = getQueryParam('image');
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
            videoElement.src = ''; // Clear the video source
        }

        if (!mediaUrl && data.length > 0) {
            const firstMediaUrl = data[0];
            console.log(`Displaying first media: ${firstMediaUrl}`);
            preloadAndDisplayMedia(firstMediaUrl, imageElement, videoElement);
            history.replaceState(null, '', `?image=${encodeURIComponent(firstMediaUrl)}&panel=${getPanelState() ? 'open' : 'closed'}`);
        } else if (mediaUrl) {
            console.log(`Displaying media from URL: ${mediaUrl}`);
            preloadAndDisplayMedia(decodeURIComponent(mediaUrl), imageElement, videoElement);
        } else {
            console.error('Media URL not found in query parameters.');
        }
        preloadAdjacentMedia();
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

    function preloadAdjacentMedia() {
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

    function nextImage() {
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

    function prevImage() {
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

    function togglePlayPause() {
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
            intervalId = setInterval(nextImage, 5000);
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) playIcon.style.display = 'block';
            sessionStorage.setItem('isPlaying', 'true');
            console.log('Playing');
        }
    }

    function handleKeyPress(event) {
        console.log(`Key pressed: ${event.code}`);
        if (event.code === 'Space') {
            togglePlayPause();
        } else if (event.code === 'ArrowRight') {
            nextImage();
        } else if (event.code === 'ArrowLeft') {
            prevImage();
        } else if (event.altKey && event.code === 'Home') {
            collapseAll();
        } else if (event.altKey && event.code === 'End') {
            expandAll();
        }
    }

    const playPauseHoverArea = document.getElementById('playPauseHoverArea');
    if (playPauseHoverArea) {
        playPauseHoverArea.addEventListener('mouseenter', function() {
            document.getElementById('playPauseButton').style.opacity = 1;
        });
        playPauseHoverArea.addEventListener('mouseleave', function() {
            document.getElementById('playPauseButton').style.opacity = 0;
        });
        const playPauseButton = document.getElementById('playPauseButton');
        if (playPauseButton) {
            playPauseButton.addEventListener('mouseenter', function() {
                this.style.opacity = 1;
            });
            playPauseButton.addEventListener('mouseleave', function() {
                this.style.opacity = 0;
            });
        }
    }

    // Function to render images in the gallery
    function renderImages(images) {
        const imageGrid = document.getElementById('imageGrid');
        imageGrid.innerHTML = ''; // Clear previous images
        images.forEach((mediaPath) => {
            const mediaElement = document.createElement(mediaPath.endsWith('.mp4') ? 'video' : 'img');
            mediaElement.src = mediaPath;
            mediaElement.classList.add('imageItem');
            if (mediaPath.endsWith('.mp4')) {
                mediaElement.controls = true;
            }
            mediaElement.addEventListener('click', () => handleImageClick(mediaPath)); // Add click event listener
            imageGrid.appendChild(mediaElement);
        });
    }

    // Function to handle image click event
    function handleImageClick(mediaPath) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('view', 'slideshow');
        currentUrl.searchParams.set('image', mediaPath);
        window.history.pushState({}, '', currentUrl.toString());
        loadSlideshow(mediaPath);
    }

    // Function to load slideshow
    function loadSlideshow(mediaPath) {
        fetch('slideshow.php')
            .then(response => response.text())
            .then(html => {
                const mainContent = document.getElementById('mainContent');
                mainContent.innerHTML = html;
                displayMedia(mediaPath);
            })
            .catch(error => console.error('Error loading slideshow:', error));
    }

    // Update displayMedia to accept a media path
    function displayMedia(mediaUrl) {
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
            videoElement.src = ''; // Clear the video source
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
        preloadAdjacentMedia();
    }

    function initializePage() {
        console.log('Initializing page');

        // Fetch images.json to populate the data variable
        fetch('images.json')
            .then(response => response.json())
            .then(images => {
                data = images;
                console.log(`Data loaded: ${JSON.stringify(data)}`);
                renderImages(data); // Render images in the gallery
                displayMedia(); // Display the media after data is loaded

                // Event listener for the "Next" button
                const nextButton = document.getElementById('nextButton');
                if (nextButton) {
                    nextButton.removeEventListener('click', nextImage);
                    nextButton.addEventListener('click', nextImage);
                    console.log('Next button initialized');
                }

                // Event listener for the "Previous" button
                const prevButton = document.getElementById('prevButton');
                if (prevButton) {
                    prevButton.removeEventListener('click', prevImage);
                    prevButton.addEventListener('click', prevImage);
                    console.log('Previous button initialized');
                }

                // Event listener for the "Play/Pause" button
                const playPauseButton = document.getElementById('playPauseButton');
                if (playPauseButton) {
                    playPauseButton.removeEventListener('click', togglePlayPause);
                    playPauseButton.addEventListener('click', togglePlayPause);
                    console.log('Play/Pause button initialized');
                }

                // Restore play/pause state
                const isPlaying = sessionStorage.getItem('isPlaying');
                if (isPlaying === 'true') {
                    intervalId = setInterval(nextImage, 5000);
                    if (playPauseButton) {
                        playPauseButton.querySelector('.fa-play').style.display = 'none';
                        playPauseButton.querySelector('.fa-pause').style.display = 'block';
                    }
                    console.log('Resumed playing');
                } else {
                    if (playPauseButton) {
                        playPauseButton.querySelector('.fa-play').style.display = 'block';
                        playPauseButton.querySelector('.fa-pause').style.display = 'none';
                    }
                    console.log('Paused state');
                }

                // Add keypress event listener
                document.addEventListener('keydown', handleKeyPress);
                console.log('Keypress event listener added');
            })
            .catch(error => console.error('Error fetching images:', error));

        const fileTreeToggleOpened = document.getElementById('fileTreeToggleOpened');
        const fileTreeToggleClosed = document.getElementById('fileTreeToggleClosed');
        const logoClosed = document.getElementById('logoClosed');
        const leftPanel = document.getElementById('leftPanel');
        const resizeHandle = document.querySelector('.resize-handle');
        let isResizing = false;

        function toggleLeftPanel() {
            if (leftPanel.style.display === 'none' || leftPanel.style.display === '') {
                leftPanel.style.display = 'block';
                if (fileTreeToggleClosed) fileTreeToggleClosed.style.display = 'none';
                if (logoClosed) logoClosed.style.display = 'none';
            } else {
                leftPanel.style.display = 'none';
                if (fileTreeToggleClosed) fileTreeToggleClosed.style.display = 'flex';
                if (logoClosed) logoClosed.style.display = 'block';
            }
            savePanelState(); // Save panel state after toggling
        }

        if (fileTreeToggleOpened) {
            fileTreeToggleOpened.addEventListener('click', toggleLeftPanel);
        }
        if (fileTreeToggleClosed) {
            fileTreeToggleClosed.addEventListener('click', toggleLeftPanel);
        }

        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', (e) => {
                isResizing = true;
                document.addEventListener('mousemove', resizePanel);
                document.addEventListener('mouseup', stopResizing);
            });
        }

        function resizePanel(e) {
            if (!isResizing) return;
            const newWidth = Math.min(e.clientX, window.innerWidth * 0.24); // Limit the maximum width to 24%
            if (newWidth < window.innerWidth * 0.1 || newWidth > window.innerWidth * 0.24) return;
            leftPanel.style.width = `${newWidth}px`;
        }

        function stopResizing() {
            isResizing = false;
            document.removeEventListener('mousemove', resizePanel);
            document.removeEventListener('mouseup', stopResizing);
        }

        savePanelState(); // Save panel state on load
    }

    function expandAll() {
        const toggleIcons = document.querySelectorAll('#fileTree .toggle-icon');
        toggleIcons.forEach(icon => {
            const subList = icon.parentElement.querySelector('ul');
            if (subList) {
                subList.style.display = 'block';
                icon.innerHTML = '&#9660;'; // Down pointing triangle
            }
        });
    }

    function collapseAll() {
        const toggleIcons = document.querySelectorAll('#fileTree .toggle-icon');
        toggleIcons.forEach(icon => {
            const subList = icon.parentElement.querySelector('ul');
            if (subList) {
                subList.style.display = 'none';
                icon.innerHTML = '&#9654;'; // Right pointing triangle
            }
        });
    }

    function populateFileTree() {
        const fileTreeContainer = document.getElementById('fileTree');
        fetch('/api.php?action=get_file_tree')
            .then(response => response.json())
            .then(data => {
                buildFileTree(fileTreeContainer, data);
            })
            .catch(error => console.error('Error fetching file tree:', error));
    }

    function buildFileTree(container, nodes) {
        container.innerHTML = ''; // Clear the current file tree
        nodes.forEach(node => {
            const li = document.createElement('li');
            const icon = document.createElement('i');
            icon.className = 'fas fa-folder'; // Font Awesome folder icon
            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${node.name}`));

            if (node.type === 'directory') {
                if (node.children && node.children.length > 0) {
                    const toggleIcon = document.createElement('span');
                    toggleIcon.className = 'toggle-icon';
                    toggleIcon.innerHTML = '&#9654;'; // Right pointing triangle
                    li.insertBefore(toggleIcon, li.firstChild);

                    const subList = document.createElement('ul');
                    subList.style.display = 'none'; // Initially hide subfolders
                    buildFileTree(subList, node.children);
                    li.appendChild(subList);

                    toggleIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (subList.style.display === 'none') {
                            subList.style.display = 'block';
                            toggleIcon.innerHTML = '&#9660;'; // Down pointing triangle
                        } else {
                            subList.style.display = 'none';
                            toggleIcon.innerHTML = '&#9654;'; // Right pointing triangle
                        }
                    });
                }

                li.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event from bubbling up to parent elements
                    fetch('/api.php?action=update_images', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ directory: node.path })
                    })
                    .then(response => response.text())
                    .then(message => {
                        console.log(message);
                        // Introduce a longer delay to ensure images.json is updated
                        setTimeout(() => {
                            fetch('images.json')
                                .then(response => response.json())
                                .then(images => {
                                    data = images;
                                    console.log(`Data loaded: ${JSON.stringify(data)}`);
                                    if (data.length > 0) {
                                        // Display the first media after data is loaded and update the URL
                                        const firstMediaUrl = data[0];
                                        displayImageWithUrlUpdate(firstMediaUrl);
                                    } else {
                                        console.error('No media found in the selected directory.');
                                    }
                                })
                                .catch(error => console.error('Error fetching images:', error));
                        }, 300); // Delay of 3 seconds to ensure images.json is updated
                    })
                    .catch(error => console.error('Error updating images:', error));
                });
            }
            container.appendChild(li);
        });
    }

    function displayImageWithUrlUpdate(mediaUrl) {
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
                // Update the URL with the new media
                history.replaceState(null, '', `?image=${encodeURIComponent(mediaUrl)}`);
            };
            preloader.onerror = () => {
                console.error(`Failed to load image: ${mediaUrl}`);
            };
            preloader.src = mediaUrl;
        }
    }

    initializePage();
});
