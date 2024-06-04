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
});
