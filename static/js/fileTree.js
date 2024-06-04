// fileTree.js
import { setData, displayImageWithUrlUpdate } from './media.js';
import { expandAll, collapseAll } from './events.js';

// Function to populate the file tree
export function populateFileTree() {
    const fileTreeContainer = document.getElementById('fileTree');
    fetch('/file-tree')
        .then(response => response.json())
        .then(data => {
            buildFileTree(fileTreeContainer, data);
        })
        .catch(error => console.error('Error fetching file tree:', error));
}

// Function to build the file tree
export function buildFileTree(container, nodes) {
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
                fetch('/update-images', {
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
                                setData(images);
                                console.log(`Data loaded: ${JSON.stringify(images)}`);
                                if (images.length > 0) {
                                    // Display the first media after data is loaded and update the URL
                                    const firstMediaUrl = images[0];
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