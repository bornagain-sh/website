function setBackgroundColor(color) {
    canvas.style.backgroundColor = color;
    print(`Background color set to ${color}.`);
}

function setLineDistance(distance) {
    const newDistance = parseInt(distance);
    if (!isNaN(newDistance) && newDistance >= 0) {
        maxDistance = newDistance;
        print(`Line drawing distance set to ${newDistance}.`);
    } else {
        print('Error: Invalid line distance.');
    }
}

function setParticleSpeed(factor) {
    const speedFactor = parseFloat(factor);
    if (!isNaN(speedFactor)) {
        if (speedFactor >= 0.1 && speedFactor <= MAX_SPEED) {
            const targetSpeed = MAX_SPEED * speedFactor;
            objects.forEach(obj => {
                const currentSpeed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
                if (currentSpeed > 0) {
                    obj.vx = (obj.vx / currentSpeed) * targetSpeed;
                    obj.vy = (obj.vy / currentSpeed) * targetSpeed;
                } else {
                    const angle = Math.random() * Math.PI * 2;
                    obj.vx = Math.cos(angle) * targetSpeed;
                    obj.vy = Math.sin(angle) * targetSpeed;
                }
            });
            print(`Particle speed set to ${speedFactor} (target speed: ${targetSpeed.toFixed(2)}).`);
        } else {
            print(`Error: Speed factor must be between 0.1 and ${MAX_SPEED}.`);
        }
    } else {
        print('Error: Invalid speed factor.');
    }
}
function showVolume() {
    print(`Current volume: ${currentVolume.toFixed(2)}`);
}
function adjustVolume(change) {
    let newVolume = currentVolume + change;
    newVolume = Math.max(0, Math.min(1, newVolume));
    currentVolume = newVolume;
    if (currentAudio) {
        currentAudio.volume = newVolume;
    }
    print(`Volume adjusted to ${newVolume.toFixed(2)}`);
}
function toggleLines() {
    drawLinesEnabled = !drawLinesEnabled;
    print(`Draw lines ${drawLinesEnabled ? 'enabled' : 'disabled'}.`);
}
function setParticleCount(count) {
    const newCount = parseInt(count);
    if (!isNaN(newCount) && newCount >= 0) {
        const currentCount = objects.length;
        const difference = newCount - currentCount;
        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                objects.push(new FlyingObject());
            }
            print(`Added ${difference} particles. Current count: ${objects.length}.`);
        } else if (difference < 0) {
            objects.splice(newCount);
            print(`Removed ${-difference} particles. Current count: ${objects.length}.`);
        } else {
            print(`Particle count is already ${newCount}.`);
        }
    } else {
        print('Error: Invalid particle count.');
    }
}

function playSong(song, filesystem) {
    const resolvedPath = resolvePath(currentPath, song);
    const pathParts = resolvedPath.split('/').filter(Boolean);
    const filename = pathParts.pop();

    let targetDirectory = filesystem['/'];

    for (const part of pathParts) {
        if (targetDirectory && targetDirectory[part + '/']) {
            targetDirectory = targetDirectory[part + '/'];
        } else {
            print(`Directory ${pathParts.slice(0, pathParts.indexOf(part) + 1).join('/')} not found.`);
            return;
        }
    }

    if (targetDirectory && targetDirectory.files && targetDirectory.files.some(file => file.name === filename)) {
        stopMusic();
        const relativePathToSongForAudio = resolvedPath.startsWith('/') ? `.${resolvedPath}` : `./${resolvedPath}`;
        currentAudio = new Audio(relativePathToSongForAudio);
        currentAudio.volume = currentVolume;
        currentAudio.play()
            .then(() => {
                print(`Playing ${filename} | Volume: ${currentVolume.toFixed(2)} ... Use 'volumeup' and 'volumedown' to change volume`);
            })
            .catch(error => {
                print(`Error playing ${filename}.`);
            });
    } else {
        print(`Song ${song} not found.`);
    }
}

function stopMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        print("Music stopped.");
    } else {
        print("No music is currently playing.");
    }
}

function handleOpen(args) {
    if (args.length === 0) {
        print('open: missing filename', 'error');
        return;
    }

    const filepath = args[0];
    const resolvedPath = resolvePath(currentPath, filepath);
    const pathParts = resolvedPath.split('/').filter(Boolean);
    const filename = pathParts.pop();

    let targetDirectoryNode = filesystemData['/'];
    for (const part of pathParts) {
        if (targetDirectoryNode && targetDirectoryNode[part + '/']) {
            targetDirectoryNode = targetDirectoryNode[part + '/'];
        } else {
            print(`Directory ${pathParts.slice(0, pathParts.indexOf(part) + 1).join('/')} not found.`);
            return;
        }
    }

    if (targetDirectoryNode && targetDirectoryNode.files && targetDirectoryNode.files.some(file => file.name === filename)) {
        const file = targetDirectoryNode.files.find(f => f.name === filename);
        const fileType = filename.split('.').pop().toLowerCase();
        const fullSimulatedPath = resolvedPath.startsWith('/') ? `.${resolvedPath}` : `./${resolvedPath}`;

        if (fileType === 'txt') {
            handleCat([resolvedPath]);
        } else if (['jpg', 'png', 'jpeg', 'gif'].includes(fileType)) {
            const imgOverlay = document.createElement('div');
            imgOverlay.style.position = 'fixed';
            imgOverlay.style.top = '0';
            imgOverlay.style.left = '0';
            imgOverlay.style.width = '100vw';
            imgOverlay.style.height = '100vh';
            imgOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            imgOverlay.style.display = 'flex';
            imgOverlay.style.justifyContent = 'center';
            imgOverlay.style.alignItems = 'center';
            imgOverlay.style.zIndex = '9999';
            const img = document.createElement('img');
            img.src = fullSimulatedPath;
            img.style.maxWidth = '80%';
            img.style.maxHeight = '80%';
            img.style.borderRadius = '10px';
            imgOverlay.appendChild(img);
            document.body.appendChild(imgOverlay);
            imgOverlay.onclick = () => {
                document.body.removeChild(imgOverlay);
            };
            print(`Open ${filename}...`);
        } else if (fileType === 'mp3') {
            playSong(resolvedPath, filesystemData);
        } else {
            print(`Could not open file ${filename}. Unknown filetype.`);
        }
    } else {
        print(`File ${filepath} not found.`);
    }
}

function handleRepeat() {
    if (currentAudio) {
        currentAudio.loop = true;
        print(`Repeating current Song.`);
    } else {
        print(`No music is currently playing.`);
    }
}