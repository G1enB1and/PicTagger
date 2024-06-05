import { populateFileTree } from './fileTree.js';
import { renderImages, setData } from './media.js';

export function initializePage() {
    // Initialize file tree
    populateFileTree();

    // Fetch and display gallery images
    fetch('api.php?action=get_images')
        .then(response => response.json())
        .then(images => {
            setData(images);
            renderImages(images);
        })
        .catch(error => console.error('Error fetching images:', error));

    // Initialize panel toggles
    const fileTreeIcon = document.getElementById('file-tree-icon');
    const hamburgerIcon = document.getElementById('hamburger-icon');

    if (fileTreeIcon) {
        fileTreeIcon.addEventListener('click', toggleLeftPanel);
    } else {
        console.error('File tree icon not found');
    }

    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', toggleDataPanel);
    } else {
        console.error('Hamburger icon not found');
    }
}

function toggleLeftPanel(event) {
    event.preventDefault();
    const currentUrl = new URL(window.location.href);
    const leftPanelToggleParam = currentUrl.searchParams.get('leftPanelToggle');
    if (leftPanelToggleParam === 'hide') {
        currentUrl.searchParams.set('leftPanelToggle', 'show');
    } else {
        currentUrl.searchParams.set('leftPanelToggle', 'hide');
    }
    window.location.href = currentUrl.toString();
}

function toggleDataPanel(event) {
    event.preventDefault();
    const currentUrl = new URL(window.location.href);
    const dataPanelToggleParam = currentUrl.searchParams.get('dataPanelToggle');
    if (dataPanelToggleParam === 'hide') {
        currentUrl.searchParams.set('dataPanelToggle', 'show');
    } else {
        currentUrl.searchParams.set('dataPanelToggle', 'hide');
    }
    window.location.href = currentUrl.toString();
}
