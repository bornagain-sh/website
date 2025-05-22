// js/fileBrowser.js

document.addEventListener('DOMContentLoaded', () => {
    const fileBrowserElement = document.getElementById('fileBrowser');
    const terminalInput = document.getElementById('input');

    // Recursive function to build the file browser HTML
    function buildFileBrowser(currentPath, dataNode) {
        let html = '<ul class="file-list">';

        // Add ".." to go up a directory, if not at root
        if (currentPath !== '/') {
            // Determine the parent path
            let parentPath = currentPath.split('/').filter(p => p !== '').slice(0, -1).join('/');
            parentPath = parentPath === '' ? '/' : '/' + parentPath + '/'; // Ensure it's a valid root or trailing slash for folder

            // Handle the case where the parent is the true root '/'
            if (parentPath === '//') { // This happens if we were at e.g., /images/ and want to go up to /
                parentPath = '/';
            } else if (parentPath.endsWith('/') && parentPath.length > 1) {
                // If it's a subfolder like /images/, the parent should be /
                // If it's a deeper subfolder like /projects/code/, the parent should be /projects/
                // The slicing logic for ".." is critical. Let's simplify.
                const pathParts = currentPath.split('/').filter(p => p !== '');
                if (pathParts.length > 0) {
                    pathParts.pop(); // Remove current directory
                    parentPath = '/' + pathParts.join('/') + (pathParts.length > 0 ? '/' : '');
                    if (parentPath === '/') parentPath = '/'; // Ensure root is just '/'
                } else {
                    parentPath = '/'; // Should not happen if currentPath is not '/'
                }
            }


            html += `<li class="folder-item" data-path="${parentPath}">
                        <i class="fas fa-folder"></i> <span class="folder-name">..</span>
                    </li>`;
        }

        // Add directories
        // Iterate over keys in dataNode (which is the current directory object)
        for (const key in dataNode) {
            if (key.endsWith('/') && typeof dataNode[key] === 'object' && dataNode[key] !== null) { // It's a directory
                const dirName = key.slice(0, -1); // Remove trailing slash
                const fullPath = (currentPath === '/' ? '/' : currentPath) + dirName + '/'; // Construct full path properly
                html += `<li class="folder-item" data-path="${fullPath}">
                            <i class="fas fa-folder"></i> <span class="folder-name">${dirName}</span>
                        </li>`;
            }
        }

        // Add files
        if (dataNode.files && dataNode.files.length > 0) {
            dataNode.files.forEach(file => {
                const fullPath = (currentPath === '/' ? '/' : currentPath) + file.name; // Construct full path properly
                html += `<li class="file-item" data-path="${fullPath}">
                            <i class="fas fa-file-alt"></i> <span class="file-name">${file.name}</span>
                        </li>`;
            });
        }
        
        html += '</ul>';
        return html;
    }

    // Function to render the file browser for a given path
    window.renderFileBrowser = (path = '/') => {
        let currentDataNode = filesystemData['/']; // Start at the actual root content
        let currentBrowserPath = '/';

        const pathParts = path.split('/').filter(p => p !== ''); // Split path and remove empty parts (e.g., from '//')

        let validPath = true;

        for (const part of pathParts) {
            const folderKey = part + '/';
            if (currentDataNode[folderKey]) {
                currentDataNode = currentDataNode[folderKey];
                currentBrowserPath += part + '/';
            } else {
                validPath = false;
                break;
            }
        }

        if (validPath) {
            fileBrowserElement.innerHTML = buildFileBrowser(currentBrowserPath, currentDataNode);
            fileBrowserElement.dataset.currentPath = currentBrowserPath; // Store current path
        } else {
            fileBrowserElement.innerHTML = '<p style="color: #ff0000;">Error: Path not found.</p>'; // Red error text
            fileBrowserElement.dataset.currentPath = '/'; // Reset to root on error
            renderFileBrowser('/'); // Optionally redirect to root on invalid path
        }
    };

    // Event listener for clicks on file browser items
    fileBrowserElement.addEventListener('click', (event) => {
        const target = event.target.closest('li');
        if (target) {
            let path = target.dataset.path;
            
            // Adjust path for consistency before use
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            // Ensure directories end with a slash, files don't
            if (target.classList.contains('folder-item') && !path.endsWith('/')) {
                path += '/';
            } else if (target.classList.contains('file-item') && path.endsWith('/')) {
                path = path.slice(0, -1);
            }

            if (target.classList.contains('folder-item')) {
                // If it's a folder, navigate into it
                renderFileBrowser(path);
} else if (target.classList.contains('file-item')) {
                // If it's a file, modify the input field to append the path
                const currentValue = terminalInput.value.trim(); // Get current input value, trim whitespace
                const pathToAdd = path; // The full path from the file browser

                // Check if the input field is empty or contains only whitespace
                if (currentValue === '') {
                    terminalInput.value = pathToAdd;
                } else {
                    // Split the current value by spaces to find the "last part"
                    const parts = currentValue.split(' ');
                    const lastPart = parts[parts.length - 1];

                    // Determine if the last part looks like a path already (e.g., starts with / or is a partial filename)
                    // This is a heuristic: if the last part is empty, or doesn't look like a command,
                    // or already seems like a path, we'll try to replace/append intelligently.
                    if (lastPart.startsWith('/') || lastPart === '' || lastPart.includes('.')) {
                        // If the last part is empty, or already looks like a path, replace it
                        // Or if it contains a '.', assume it's a filename being typed
                        parts[parts.length - 1] = pathToAdd;
                        terminalInput.value = parts.join(' ');
                    } else {
                        // Otherwise, append the path after a space
                        terminalInput.value = currentValue + ' ' + pathToAdd;
                    }
                }
                
                terminalInput.focus(); // Focus the input field
                // Set cursor to the end of the input field
                terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
                terminalInput.scrollLeft = terminalInput.scrollWidth; // Scroll to end of input
            }
        }
    });

    // Initial render of the file browser at root
    renderFileBrowser();
});