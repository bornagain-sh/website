const terminalInput = document.getElementById('input');
const terminalOutput = document.getElementById('output');
const username = 'listener';
const hostname = 'bornagainshell';
let currentPath = '/';
const commandHistory = [];
let historyIndex = -1;
let currentVolume = 0.2;
let currentAudio = null;

    const commands = {
        'ls': {
            description: 'List directory contents',
            hasPathCompletion: true,
            pathCompletionType: 'both',
            category: 'Filesystem'
        },
        'cd': {
            description: 'Change the current directory',
            hasPathCompletion: true,
            pathCompletionType: 'directories',
            category: 'Filesystem'
        },
        'clear': {
            description: 'Clear the terminal',
            hasPathCompletion: false,
            category: 'System Control'
        },
        'help': {
            description: 'Show available commands',
            hasPathCompletion: false,
            category: 'System Control'
        },
        'pwd': {
            description: 'Print working directory',
            hasPathCompletion: false,
            category: 'Filesystem'
        },
        'cat': {
            description: 'Display file contents',
            hasPathCompletion: true,
            pathCompletionType: 'both',
            category: 'Filesystem'
        },
        'decode': {
            description: 'Decode and display file contents',
            hasPathCompletion: true,
            pathCompletionType: 'both',
            category: 'Filesystem'
        },
        'bg_color': {
            description: 'Set the background color',
            hasPathCompletion: false,
            category: 'Appearance' // Neue Kategorie für GUI-Einstellungen
        },
        'line_distance': {
            description: 'Set the line drawing distance',
            hasPathCompletion: false,
            category: 'Appearance'
        },
        'particle_speed': {
            description: 'Set the particle speed',
            hasPathCompletion: false,
            category: 'Appearance'
        },
        'particle_count': {
            description: 'Set the particle count',
            hasPathCompletion: false,
            category: 'Appearance'
        },
        'toggle_lines': {
            description: 'Toggle drawing lines between particles',
            hasPathCompletion: false,
            category: 'Appearance'
        },
        'volumeup': {
            description: 'Increase volume',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'volumedown': {
            description: 'Decrease volume',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'volumeinfo': {
            description: 'Show current volume',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'open': {
            description: 'Open a file (supports .txt, .jpg, .png, .mp3)',
            hasPathCompletion: true,
            pathCompletionType: 'files',
            category: 'Filesystem'
        },
        'repeat': {
            description: 'Repeat the song currently playing',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'play': {
            description: 'Play a song',
            hasPathCompletion: true,
            pathCompletionType: 'files',
            category: 'Audio & Media'
        },
        'stop': {
            description: 'Stop the current song',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'spotify': {
            description: 'Open Spotify link',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'youtube': {
            description: 'Open YouTube link',
            hasPathCompletion: false,
            category: 'Audio & Media'
        },
        'about': {
            description: 'About Born Again Shell',
            category: 'System Control' // Info-Befehl
        }
    };

function print(text, className = 'response') {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function getCurrentPath() {
    return currentPath;
}

function setCurrentPath(newPath) {
    currentPath = newPath;
    updatePrompt();
}

function updatePrompt() {
    terminalInput.placeholder = `${username}@${hostname}:${getCurrentPath()}> `;
    terminalInput.focus();
}

function handleHelp() {
    print('Available commands:');
    for (const cmd in commands) {
        print(`  ${cmd} - ${commands[cmd].description}`);
    }
}

function handleClear() {
    terminalOutput.innerHTML = ''; // Leert den Inhalt
    terminalOutput.scrollTop = 0;   // Scrollt nach oben

    // Setzt die Klasse für den oberen Rand und entfernt die für den unteren Rand
    terminalOutput.classList.add(SCROLL_TOP_CLASS);
    terminalOutput.classList.remove(SCROLL_BOTTOM_CLASS);

    print("Terminal cleared.");
}

function handleLs(args) {
    const lsPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath;
    const lsContents = listDirectoryContents(lsPath);
    if (lsContents) {
        print(lsContents.join('\n'));
    } else {
        print(`ls: cannot access '${args[0] || '.'}': No such file or directory`, 'error');
    }
}

function handleCd(args) {
    const newDir = args[0];
    if (!newDir) {
        setCurrentPath('/');
    } else {
        const resolvedPath = resolvePath(currentPath, newDir);
        const contents = listDirectoryContents(resolvedPath);
        if (contents !== null) {
            setCurrentPath(resolvedPath);
        } else {
            print(`cd: The directory '${newDir}' does not exist`, 'error');
        }
    }
}

function handlePwd() {
    print(getCurrentPath());
}

function getFileContent(filePath) {
    return fileContentsData[filePath] || null;
}

function handleCat(args) {
    if (args.length === 0) {
        print('cat: missing filename', 'error');
    } else {
        const fileName = args[0];
        const currentDirContents = listDirectoryContents(currentPath) || [];
        const fileExistsInCurrentDir = currentDirContents.includes(fileName);

        if (fileExistsInCurrentDir) {
            const fileContent = fileContentsData[fileName];
            if (fileContent) {
                if (fileContent.encoded) {
                    print(`cat: The file '${fileName}' is encoded. Use 'decode'.`, 'warning');
                } else {
                    print(fileContent.content);
                }
            } else {
                print(`cat: Error reading file '${fileName}'.`, 'error');
            }
        } else {
            const filePath = resolvePath(currentPath, fileName);
            const fileNameFromPath = filePath.split('/').pop();
            const fileContent = fileContentsData[fileNameFromPath];
            if (fileContent) {
                if (fileContent.encoded) {
                    print(`cat: The file '${fileName}' is encoded. Use 'decode'.`, 'warning');
                } else {
                    print(fileContent.content);
                }
            } else {
                print(`cat: '${fileName}': No such file or directory`, 'error');
            }
        }
    }
}

function handleDecode(args) {
    if (args.length === 0) {
        print('decode: missing filename', 'error');
        return;
    }

    const filename = args[0];
    const currentDirContents = listDirectoryContents(currentPath) || [];
    const fileExistsInCurrentDir = currentDirContents.includes(filename);

    const animateDecodeOutput = (name, encodedText) => {
        const decodedString = atob(encodedText);
        print(`Decoding ${name}...`);
        const outputLine = document.createElement('pre');
        terminalOutput.appendChild(outputLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', ';', ':', ',', '.', '/', '<', '>', '?'];
        let charIndex = 0;
        const baseDelay = 50;
        const randomFactor = 0.5;
        let currentOutput = '> ';
        const initialDelay = 500 + Math.random() * 500;

        setTimeout(() => {
            outputLine.textContent = currentOutput;
            function animateCharReveal() {
                if (charIndex < decodedString.length) {
                    const currentChar = decodedString[charIndex];
                    let animationSteps = 0;
                    const maxAnimationSteps = 3 + Math.floor(Math.random() * 3);
                    function animateInterimChars() {
                        if (animationSteps < maxAnimationSteps) {
                            const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
                            outputLine.textContent = currentOutput + randomChar;
                            animationSteps++;
                            setTimeout(animateInterimChars, baseDelay / 2);
                        } else {
                            currentOutput += currentChar;
                            outputLine.textContent = currentOutput;
                            charIndex++;
                            const nextDelay = baseDelay + Math.random() * baseDelay * randomFactor;
                            setTimeout(animateCharReveal, nextDelay);
                        }
                    }
                    animateInterimChars();
                }
            }
            animateCharReveal();
        }, initialDelay);
    };

    if (fileExistsInCurrentDir) {
        const fileContent = fileContentsData[filename];
        if (fileContent && fileContent.encoded) {
            animateDecodeOutput(filename, fileContent.content);
        } else if (fileContent && !fileContent.encoded) {
            print(`decode: The file '${filename}' is not encoded.`, 'warning');
        } else {
            print(`decode: Error reading file '${filename}'.`, 'error');
        }
    } else {
        const filePath = resolvePath(currentPath, filename);
        const fileNameFromPath = filePath.split('/').pop();
        const fileContent = fileContentsData[fileNameFromPath];
        if (fileContent && fileContent.encoded) {
            animateDecodeOutput(fileNameFromPath, fileContent.content);
        } else if (fileContent && !fileContent.encoded) {
            print(`decode: The file '${filename}' is not encoded.`, 'warning');
        } else {
            print(`decode: '${filename}': No such file or directory`, 'error');
        }
    }
}

function handleCommand(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
        case 'help':
            handleHelp();
            break;
        case 'clear':
            handleClear();
            break;
        case 'ls':
            handleLs(args);
            break;
        case 'cd':
            handleCd(args);
            break;
        case 'pwd':
            handlePwd();
            break;
        case 'cat':
            handleCat(args);
            break;
        case 'decode':
            handleDecode(args);
            break;
        case 'bg_color':
            setBackgroundColor(args[0]);
            break;
        case 'line_distance':
            setLineDistance(args[0]);
            break;
        case 'particle_speed':
            setParticleSpeed(args[0]);
            break;
        case 'particle_count':
            setParticleCount(args[0]);
            break;
        case 'toggle_lines':
            toggleLines();
            break;
        case 'volumeup':
            adjustVolume(0.1);
            break;
        case 'volumedown':
            adjustVolume(-0.1);
            break;
        case 'volumeinfo':
            showVolume();
            break;
        case 'open':
            handleOpen(args);
            break;
        case 'play':
            playSong(args.join(' '), filesystemData);
            break;
        case 'repeat':
            handleRepeat(); // Keine Argumente mehr erwartet
            break;
        case 'stop':
            stopMusic();
            break;
        case 'spotify':
            window.open('https://open.spotify.com/artist/YOUR_ARTIST_ID', '_blank');
            break;
        case 'youtube':
            window.open('https://youtube.com/YOUR_CHANNEL_URL', '_blank');
            break;
        case 'about':
            print('Born Again Shell is a hybrid project combining music, hacker aesthetics, and emotional storytelling.');
            break;
        default:
            print(`Command not found: ${command}`, 'error');
    }
}

function executeCommand(commandString) {
    handleCommand(commandString);
}

function findCommonPrefix(strings) {
    if (!strings || strings.length === 0) {
        return "";
    }
    if (strings.length === 1) {
        return strings[0];
    }
    let prefix = "";
    const firstString = strings[0];
    for (let i = 0; i < firstString.length; i++) {
        const char = firstString[i];
        if (strings.every(str => str[i] === char)) {
            prefix += char;
        } else {
            break;
        }
    }
    return prefix;
}

function generateAndHandleCompletions() {
    const input = terminalInput.value;
    const parts = input.trim().split(/\s+/);
    const commandPart = parts[0];
    const argumentPart = parts.slice(1).join(' ');

    let suggestions = [];

    if (!commandPart) {
        suggestions = Object.keys(commands);
    } else if (!argumentPart && commandPart === 'cd') {
        suggestions = getCompletionsForPath(getCurrentPath(), '');
        if (suggestions.length > 0) {
            printCompletionSuggestions(input, suggestions);
        }
    } else if (!argumentPart && commandPart === 'cat') {
        suggestions = getCompletionsForFiles(getCurrentPath(), '');
        if (suggestions.length > 0) {
            printCompletionSuggestions(input, suggestions);
        }
    } else if (!argumentPart) {
        suggestions = Object.keys(commands).filter(cmd => cmd.startsWith(commandPart));
        handleCommandCompletions(input, suggestions);
    } else if (commands[commandPart] && commands[commandPart].hasPathCompletion) {
        const { pathCompletionType } = commands[commandPart];
        const completionPathInfo = determineCompletionPath(getCurrentPath(), argumentPart);
        const dirContents = listDirectoryContents(completionPathInfo.pathToComplete) || [];
        suggestions = dirContents.filter(item => item.startsWith(completionPathInfo.prefix));

        if (pathCompletionType === 'directories') {
            suggestions = suggestions.filter(item => item.endsWith('/'));
        }

        handlePathCompletions(input, argumentPart, suggestions, pathCompletionType);
    }
}

function getCompletionsForPath(basePath, prefix) {
    const contents = listDirectoryContents(basePath) || [];
    return contents.filter(item => item.endsWith('/') && item.startsWith(prefix));
}

function getCompletionsForFiles(basePath, prefix) {
    const contents = listDirectoryContents(basePath) || [];
    return contents.filter(item => !item.endsWith('/') && item.startsWith(prefix));
}

function determineCompletionPath(currentPath, argumentPart) {
    let pathToComplete = currentPath;
    let prefix = argumentPart;

    if (argumentPart.startsWith('/')) {
        const parts = argumentPart.split('/').filter(Boolean);
        if (parts.length > 0) {
            pathToComplete = '/' + parts.slice(0, -1).join('/');
            prefix = parts.slice(-1)[0];
            if (argumentPart.endsWith('/')) {
                pathToComplete = argumentPart.slice(0, -1);
                prefix = '';
            } else if (argumentPart === '/') {
                pathToComplete = '/';
                prefix = '';
            }
        } else {
            pathToComplete = '/';
            prefix = '';
        }
    } else if (argumentPart.includes('/')) {
        const lastSlashIndex = argumentPart.lastIndexOf('/');
        pathToComplete = resolvePath(currentPath, argumentPart.substring(0, lastSlashIndex));
        prefix = argumentPart.substring(lastSlashIndex + 1);
    }

    return { pathToComplete, prefix };
}

function printCompletionSuggestions(input, suggestions) {
    print(`${username}@${hostname}:${getCurrentPath()}> ${input}`);
    print(suggestions.join('\n'));
}

function handleCommandCompletions(input, suggestions) {
    if (suggestions.length === 1) {
        terminalInput.value = suggestions[0] + ' ';
    } else if (suggestions.length > 1) {
        const commonPrefix = findCommonPrefix(suggestions);
        if (commonPrefix.length > input.length) {
            terminalInput.value = commonPrefix + ' ';
        } else {
            printCompletionSuggestions(input, suggestions);
        }
    } else {
        printCompletionSuggestions(input, [`No commands found starting with '${input}'.`]);
    }
}

function handlePathCompletions(input, argumentPart, suggestions, pathCompletionType) {
    if (suggestions.length === 1) {
        const suggestion = suggestions[0];
        let completedPath = argumentPart;
        const suggestionWithoutSlash = suggestion.slice(0, -1);
        if (!argumentPart.endsWith(suggestionWithoutSlash)) {
            completedPath = argumentPart.includes('/') ? `${argumentPart.substring(0, argumentPart.lastIndexOf('/') + 1)}${suggestion}` : suggestion;
        }
        terminalInput.value = `${input.split(' ')[0]} ${completedPath}${pathCompletionType === 'directories' && !completedPath.endsWith('/') ? '/' : ''}`;
    } else if (suggestions.length > 1) {
        const commonPrefix = findCommonPrefix(suggestions);
        const basePath = argumentPart.includes('/') ? argumentPart.substring(0, argumentPart.lastIndexOf('/') + 1) : '';
        const completedUpTo = basePath + commonPrefix;
        terminalInput.value = `${input.split(' ')[0]} ${completedUpTo}`;
        printCompletionSuggestions(input, suggestions);
    } else {
        printCompletionSuggestions(input, [`No ${pathCompletionType === 'directories' ? 'directories' : 'files or directories'} found starting with '${argumentPart}'.`]);
    }
}

terminalInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = terminalInput.value;
        const promptTextWithInput = `<div>${username}@${hostname}:${getCurrentPath()}> ${input}</div>`;
        terminalOutput.innerHTML += promptTextWithInput;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        terminalInput.value = '';
        updatePrompt();
        handleCommand(input);
        commandHistory.push(input);
        historyIndex = commandHistory.length;
    } else if (event.key === 'Tab') {
        event.preventDefault();
        generateAndHandleCompletions();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            terminalInput.value = '';
            historyIndex = commandHistory.length;
        }
    } else {
        if (terminalInput.value.trim() === '') {
            updatePrompt();
        } else {
            terminalInput.placeholder = '';
        }
    }
});

window.addEventListener('load', () => {
    const loadingIntro = [
        'Starting Born Again Shell...\n',
        `Loggin in user '${username}'... OK`,
        'Authenticatoin... CORRECT',
        'Loading system... DONE\n',
        `Current volume: ${currentVolume.toFixed(2)}`,
    ];

    loadingIntro.forEach((line, index) => {
        setTimeout(() => {
            print(line);
            if (index === loadingIntro.length - 1) {
                // Nachdem die Ladeinformationen ausgegeben wurden:
                const outputElement = document.querySelector('.output');
                if (outputElement) {
                    outputElement.innerHTML = ''; // Leert den Output
                }

                // Jetzt die Willkommensnachricht ausgeben
                const welcomeMessage = `====================================
   WELCOME TO BORN AGAIN SHELL
====================================
Use 'ls','cd','cat','play' or type 'help' for all available commands.`;
                print(welcomeMessage);
                updatePrompt();
            }
        }, 1000 * index);
    });
});
