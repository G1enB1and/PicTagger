document.addEventListener('DOMContentLoaded', () => {
    const resizableContainers = document.querySelectorAll('.file-tree, .main-content, .data-panel');

    resizableContainers.forEach(container => {
        container.addEventListener('mousedown', initResize);
    });

    function initResize(e) {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    function resize(e) {
        // Resize logic here
        // Note: Implement logic to adjust the widths of the sections dynamically based on mouse movement
    }

    function stopResize(e) {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }
});
