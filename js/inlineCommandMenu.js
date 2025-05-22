document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('input');
    const commandMenuToggleBtn = document.querySelector('.command-menu-toggle-btn');
    const sendCommandBtn = document.querySelector('.send-command-btn');
    const inlineCommandMenu = document.getElementById('inlineCommandMenu');
    const commandCategoriesDiv = document.querySelector('.inline-command-menu .command-categories');
    const terminalOutput = document.getElementById('output');
    const terminalOutputDimmer = document.getElementById('terminalOutputDimmer');

    const SCROLL_TOP_CLASS = 'scrolled-to-top';
    const SCROLL_BOTTOM_CLASS = 'scrolled-to-bottom';

    function updateScrollMask(element) {
        if (!element) return;

        const SCROLL_END_TOLERANCE = 5;

        const isScrollable = element.scrollHeight > element.clientHeight;
        const { scrollTop, scrollHeight, clientHeight } = element;

        if (!isScrollable) {
            element.classList.remove(SCROLL_TOP_CLASS, SCROLL_BOTTOM_CLASS);
            return;
        }

        if (scrollTop <= SCROLL_END_TOLERANCE) {
            element.classList.add(SCROLL_TOP_CLASS);
            element.classList.remove(SCROLL_BOTTOM_CLASS);
        } else if (scrollTop + clientHeight >= scrollHeight - SCROLL_END_TOLERANCE) {
            element.classList.add(SCROLL_BOTTOM_CLASS);
            element.classList.remove(SCROLL_TOP_CLASS);
        } else {
            element.classList.remove(SCROLL_TOP_CLASS, SCROLL_BOTTOM_CLASS);
        }
    }

    function initializeOutputMask() {
        if (terminalOutput) {
            terminalOutput.classList.add(SCROLL_TOP_CLASS);
        }
    }

    terminalOutput.addEventListener('scroll', () => updateScrollMask(terminalOutput));
    inlineCommandMenu.addEventListener('scroll', () => updateScrollMask(inlineCommandMenu));

    window.addEventListener('load', () => {
        setTimeout(() => {
            initializeOutputMask();
        }, 100);
    });

    function executeCommandFromInput() {
        if (typeof handleCommand === 'function' && typeof username !== 'undefined' && typeof hostname !== 'undefined' && typeof getCurrentPath === 'function' && typeof print === 'function' && typeof updatePrompt === 'function') {
            const input = terminalInput.value;
            const promptTextWithInput = `<div>${username}@${hostname}:${getCurrentPath()}> ${input}</div>`;

            if (terminalOutput) {
                terminalOutput.innerHTML += promptTextWithInput;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                updateScrollMask(terminalOutput);
            } else {
                console.error("Terminal output element not found!");
            }

            terminalInput.value = '';
            updatePrompt();
            handleCommand(input);

            if (typeof commandHistory !== 'undefined' && typeof historyIndex !== 'undefined') {
                commandHistory.push(input);
            }

        } else {
            console.warn("Required terminal functions/variables not globally accessible for inlineCommandMenu.js. Please ensure `handleCommand`, `username`, `hostname`, `getCurrentPath`, `print`, `updatePrompt` are global (e.g., attached to window object or declared without let/const/var at top level).");
            const input = terminalInput.value;
            alert(`Command executed: ${input}`);
            terminalInput.value = '';
        }
    }

    function populateCommandMenu() {
        if (!commands || Object.keys(commands).length === 0) {
            console.warn('Commands object not found or empty. Cannot populate command menu.');
            commandCategoriesDiv.innerHTML = '<p>No commands available.</p>';
            return;
        }

        commandCategoriesDiv.innerHTML = '';

        const categorizedCommands = {};
        Object.keys(commands).forEach(cmdName => {
            const command = commands[cmdName];
            const category = command.category || 'Other';
            if (!categorizedCommands[category]) {
                categorizedCommands[category] = [];
            }
            categorizedCommands[category].push(cmdName);
        });

        const categoryOrder = ['Filesystem', 'System Control', 'Appearance', 'Audio & Media', 'Other'];

        const sortedCategoryNames = Object.keys(categorizedCommands).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);

            if (indexA === -1 && indexB === -1) {
                return a.localeCompare(b);
            }
            if (indexA === -1) {
                return 1;
            }
            if (indexB === -1) {
                return -1;
            }
            return indexA - indexB;
        });

        sortedCategoryNames.forEach(categoryName => {
            const categoryCommands = categorizedCommands[categoryName];
            if (!categoryCommands || categoryCommands.length === 0) return;

            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('menu-category');

            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = categoryName;
            categoryDiv.appendChild(categoryTitle);

            const commandGrid = document.createElement('div');
            commandGrid.classList.add('command-grid');
            categoryDiv.appendChild(commandGrid);

            categoryCommands.sort().forEach(cmdName => {
                const command = commands[cmdName];
                if (!command) return;

                const button = document.createElement('button');
                button.classList.add('command-button');
                button.setAttribute('data-command', cmdName);

                let iconHtml = '';
                switch (command.category) {
                    case 'Filesystem':
                        iconHtml = '<i class="fas fa-folder-open"></i>';
                        break;
                    case 'System Control':
                        iconHtml = '<i class="fas fa-terminal"></i>';
                        break;
                    case 'Appearance':
                        iconHtml = '<i class="fas fa-eye"></i>';
                        break;
                    case 'Audio & Media':
                        iconHtml = '<i class="fas fa-music"></i>';
                        break;
                    default:
                        iconHtml = '<i class="fas fa-cube"></i>';
                }
                if (cmdName === 'help' || cmdName === 'about') {
                    iconHtml = '<i class="fas fa-info-circle"></i>';
                }

                button.innerHTML = `
                    ${iconHtml}
                    <span class="command-name">${cmdName}</span>
                    <span class="command-description">${command.description || 'No description'}</span>
                `;

                button.addEventListener('click', () => {
                    terminalInput.value = cmdName;
                    terminalInput.focus();
                    inlineCommandMenu.classList.remove('is-active');
                    commandMenuToggleBtn.classList.remove('is-active');
                    terminalOutputDimmer.classList.remove('is-active');
                });

                commandGrid.appendChild(button);
            });
            updateScrollMask(inlineCommandMenu);
            commandCategoriesDiv.appendChild(categoryDiv);
        });
    }

    commandMenuToggleBtn.addEventListener('click', () => {
        const isActive = inlineCommandMenu.classList.toggle('is-active');
        commandMenuToggleBtn.classList.toggle('is-active');

        if (isActive) {
            populateCommandMenu();
            const inputContainer = document.querySelector('.input-container');
            const inputContainerHeight = inputContainer.offsetHeight;
            inlineCommandMenu.style.bottom = `${inputContainerHeight + 35}px`;
            updateScrollMask(inlineCommandMenu);
            terminalOutputDimmer.classList.add('is-active');
        } else {
            terminalOutputDimmer.classList.remove('is-active');
        }
    });

    if (sendCommandBtn) {
        sendCommandBtn.addEventListener('click', () => {
            executeCommandFromInput();
        });
    }

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = inlineCommandMenu.contains(event.target) || commandMenuToggleBtn.contains(event.target) || (sendCommandBtn && sendCommandBtn.contains(event.target));
        const isClickOnDimmer = terminalOutputDimmer.contains(event.target) && terminalOutputDimmer.classList.contains('is-active');

        if (!isClickInsideMenu && inlineCommandMenu.classList.contains('is-active') || isClickOnDimmer) {
            inlineCommandMenu.classList.remove('is-active');
            commandMenuToggleBtn.classList.remove('is-active');
            terminalOutputDimmer.classList.remove('is-active');
        }
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (inlineCommandMenu.classList.contains('is-active')) {
                inlineCommandMenu.classList.remove('is-active');
                commandMenuToggleBtn.classList.remove('is-active');
                terminalOutputDimmer.classList.remove('is-active');
                e.preventDefault();
            }
        }
    });
});