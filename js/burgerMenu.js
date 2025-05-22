// js/burgerMenu.js

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenuBtn = document.getElementById('burgerMenuBtn');
    const rightMenu = document.getElementById('rightMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    // Funktion zum Öffnen des Burger-Menüs
    function openBurgerMenu() {
        rightMenu.classList.add('is-active');
        menuOverlay.classList.add('is-active');
        // Verhindert das Scrollen des Bodys, wenn das Menü geöffnet ist
        body.style.overflow = 'hidden';
    }

    // Funktion zum Schließen des Burger-Menüs
    function closeBurgerMenu() {
        rightMenu.classList.remove('is-active');
        menuOverlay.classList.remove('is-active');
        // Ermöglicht das Scrollen des Bodys wieder
        body.style.overflow = ''; // Setzt den Wert auf den Standard zurück
    }

    // Event Listener für den Burger-Button
    if (burgerMenuBtn) {
        burgerMenuBtn.addEventListener('click', () => {
            if (rightMenu.classList.contains('is-active')) {
                closeBurgerMenu();
            } else {
                openBurgerMenu();
            }
        });
    }

    // Event Listener für das Overlay (schließt das Menü, wenn außerhalb geklickt wird)
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            closeBurgerMenu();
        });
    }

    // Exponiere closeBurgerMenu global, damit es von onclick-Events in index.html aufgerufen werden kann
    window.closeBurgerMenu = closeBurgerMenu;
});
