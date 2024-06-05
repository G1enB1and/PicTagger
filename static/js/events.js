import { nextImage, prevImage, togglePlayPause } from './media.js';
import { expandAll, collapseAll } from './fileTree.js';

// Function to handle keypress
export function handleKeyPress(event) {
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

// Export expandAll and collapseAll
export { expandAll, collapseAll };
