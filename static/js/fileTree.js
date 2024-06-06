import { setData, displayImageWithUrlUpdate } from './media.js';

export function populateFileTree() {
    fetch('api.php?action=get_file_tree')
        .then(response => response.json())
        .then(data => {
            const fileTreeContainer = document.getElementById('fileTree');
            buildFileTree(fileTreeContainer, data);
        })
        .catch(error => console.error('Error fetching file tree:', error));
}

export function buildFileTree(container, nodes) {
    container.innerHTML = '';
    nodes.forEach(node => {
        if (node.type === 'directory') {
            const li = document.createElement('li');
            const icon = document.createElement('i');
            icon.className = 'fas fa-folder';
            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${node.name}`));

            if (node.children && node.children.length > 0) {
                const toggleIcon = document.createElement('span');
                toggleIcon.className = 'toggle-icon';
                toggleIcon.innerHTML = '&#9654;';
                li.insertBefore(toggleIcon, li.firstChild);

                const subList = document.createElement('ul');
                subList.style.display = 'none';
                buildFileTree(subList, node.children);
                li.appendChild(subList);

                toggleIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (subList.style.display === 'none') {
                        subList.style.display = 'block';
                        toggleIcon.innerHTML = '&#9660;';
                    } else {
                        subList.style.display = 'none';
                        toggleIcon.innerHTML = '&#9654;';
                    }
                });
            }

            li.addEventListener('click', (e) => {
                e.stopPropagation();
                fetch('api.php?action=update_images', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ directory: node.path })
                })
                .then(response => response.text())
                .then(message => {
                    console.log(message);
                    setTimeout(() => {
                        fetch('api.php?action=get_images')
                            .then(response => response.json())
                            .then(images => {
                                setData(images);
                                displayImageWithUrlUpdate(images[0]); // Display the first image from the selected folder
                            })
                            .catch(error => console.error('Error fetching images:', error));
                    }, 500);
                })
                .catch(error => console.error('Error updating images:', error));
            });

            container.appendChild(li);
        }
    });
}

export function expandAll() {
    const toggleIcons = document.querySelectorAll('#fileTree .toggle-icon');
    toggleIcons.forEach(icon => {
        const subList = icon.parentElement.querySelector('ul');
        if (subList) {
            subList.style.display = 'block';
            icon.innerHTML = '&#9660;';
        }
    });
}

export function collapseAll() {
    const toggleIcons = document.querySelectorAll('#fileTree .toggle-icon');
    toggleIcons.forEach(icon => {
        const subList = icon.parentElement.querySelector('ul');
        if (subList) {
            subList.style.display = 'none';
            icon.innerHTML = '&#9654;';
        }
    });
}
