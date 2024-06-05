import { initializePage } from './initialize.js';
import { handleKeyPress, expandAll, collapseAll } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('expandAll').addEventListener('click', expandAll);
    document.getElementById('collapseAll').addEventListener('click', collapseAll);
});
