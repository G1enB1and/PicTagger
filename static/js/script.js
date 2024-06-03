document.addEventListener('DOMContentLoaded', () => {
    const resizerFileTree = document.getElementById('resizer-filetree');
    const resizerDataPanel = document.getElementById('resizer-datapanel');
    const fileTree = document.querySelector('.file-tree');
    const dataPanel = document.querySelector('.data-panel');
    const mainContent = document.querySelector('.main-content');

    const initResize = (resizer, panel, isFileTree) => {
        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            window.addEventListener('mousemove', startResize);
            window.addEventListener('mouseup', stopResize);

            function startResize(event) {
                if (isFileTree) {
                    let newWidth = event.clientX;
                    if (newWidth > 50 && newWidth < window.innerWidth - 100) { // Ensure some limits for resizing
                        panel.style.width = newWidth + 'px';
                        mainContent.style.width = (window.innerWidth - newWidth - dataPanel.offsetWidth) + 'px';
                    }
                } else {
                    let newWidth = window.innerWidth - event.clientX;
                    if (newWidth > 50 && newWidth < window.innerWidth - 100) { // Ensure some limits for resizing
                        panel.style.width = newWidth + 'px';
                        mainContent.style.width = (window.innerWidth - newWidth - fileTree.offsetWidth) + 'px';
                    }
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', startResize);
                window.removeEventListener('mouseup', stopResize);
            }
        });
    };

    initResize(resizerFileTree, fileTree, true);
    initResize(resizerDataPanel, dataPanel, false);
});
