let currentDirectory = ['/'];

function getCurrentPath() {
    return currentDirectory.join('');
}

function changeDirectory(path) {
    const originalDirectory = [...currentDirectory];
    let success = false;
    const targetPath = resolvePath(getCurrentPath(), path);
    const targetNodeInfo = getNodeByPath(targetPath);

    if (path === '/') {
        currentDirectory = ['/'];
        success = true;
    } else if (targetNodeInfo && targetNodeInfo.currentNode && isDirectoryNode(targetNodeInfo.currentNode)) {
        currentDirectory = targetPath.split('/').filter(Boolean).map(dir => dir + '/');
        if (currentDirectory.length > 0 && currentDirectory[0] !== '/') {
            currentDirectory.unshift('/');
        }
        if (!targetPath.endsWith('/')) {
            currentDirectory[currentDirectory.length - 1] += '/';
        }
        success = true;
    } else if (path === '..') {
        if (currentDirectory.length > 1) {
            currentDirectory.pop();
            success = true;
        }
    } else if (path === '.') {
        success = true;
    }

    if (!success) {
        currentDirectory = originalDirectory;
    }
    return success;
}

function listDirectoryContents(path) {
    const nodeInfo = getNodeByPath(path);
    if (nodeInfo && nodeInfo.currentNode) {
        const contents = [];
        if (nodeInfo.currentNode.files) {
            contents.push(...nodeInfo.currentNode.files.map(file => file.name));
        }
        for (const key in nodeInfo.currentNode) {
            if (key.endsWith('/') && key !== 'files') {
                contents.push(key);
            }
        }
        return contents;
    } else {
        return null;
    }
}

function resolvePath(currentPath, targetPath) {
    const currentParts = currentPath.split('/').filter(Boolean);
    const targetParts = targetPath.split('/').filter(Boolean);
    const absoluteParts = [];

    if (targetPath.startsWith('/')) {
        absoluteParts.push('');
    } else {
        absoluteParts.push(...currentParts);
    }

    for (const part of targetParts) {
        if (part === '..') {
            if (absoluteParts.length > 0) {
                absoluteParts.pop();
            }
        } else if (part !== '.') {
            absoluteParts.push(part);
        }
    }

    let resolvedPath = '';
    if (absoluteParts.length > 0) {
        resolvedPath = '/' + absoluteParts.filter(Boolean).join('/');
    } else {
        resolvedPath = '/';
    }
    return resolvedPath;
}

function isDirectoryNode(node) {
    return typeof node === 'object' && node !== null && Object.keys(node).length > 0;
}

function pathExists(path) {
    const nodeInfo = getNodeByPath(path);
    return !!(nodeInfo && nodeInfo.currentNode && isDirectoryNode(nodeInfo.currentNode));
}

function getNodeByPath(path) {
    if (path === '/') {
        return {
            currentPath: '/',
            currentNode: filesystemData['/'],
            parentPath: undefined,
            possibleChildren: Object.keys(filesystemData['/']).filter(key => typeof filesystemData['/'][key] === 'object' || filesystemData['/'][key]?.files)
        };
    }

    const pathParts = path.split('/').filter(Boolean);
    let currentNode = filesystemData['/'];
    let parentNode = undefined;
    let currentFullPath = '/';

    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const isLastPart = i === pathParts.length - 1;
        const directoryKeyWithSlash = part + '/';
        const directoryKeyWithoutSlash = part;
        const fileFound = currentNode?.files?.find(file => file.name === part);

        if (currentNode && isDirectoryNode(currentNode) && (currentNode[directoryKeyWithSlash] || currentNode[directoryKeyWithoutSlash])) {
            parentNode = currentNode;
            currentNode = currentNode[directoryKeyWithSlash] || currentNode[directoryKeyWithoutSlash];
            currentFullPath += (currentNode === parentNode[directoryKeyWithSlash] ? directoryKeyWithSlash : directoryKeyWithoutSlash + '/');
        } else if (currentNode && fileFound && isLastPart) {
            return {
                currentPath: path,
                currentNode: fileFound,
                parentPath: currentFullPath.slice(0, -part.length - (currentFullPath.endsWith('/') ? 1 : 0)),
                possibleChildren: []
            };
        } else {
            return undefined;
        }
    }

    if (isDirectoryNode(currentNode)) {
        return {
            currentPath: path,
            currentNode: currentNode,
            parentPath: pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') + '/' : '/',
            possibleChildren: Object.keys(currentNode).filter(key => typeof currentNode[key] === 'object' || currentNode[key]?.files)
        };
    }

    return undefined;
}