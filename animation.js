(function() {
    'use strict';

    const EASTER_EGG_SEQUENCE = ['mano', 'uomo', 'omou', 'luna', 'sole'];
    let userSequence = [];

    function checkEasterEgg(iconName) {
        userSequence.push(iconName);

        if (userSequence.length > EASTER_EGG_SEQUENCE.length) {
            userSequence.shift();
        }

        if (JSON.stringify(userSequence) === JSON.stringify(EASTER_EGG_SEQUENCE)) {
            displayEasterEgg();
            userSequence = [];
        }
    }

    function displayEasterEgg() {
        if (document.querySelector('.easter-egg')) {
            return;
        }

        const message = document.createElement('div');
        message.className = 'easter-egg';
        message.textContent = 'Il gioco del Lotto è la tassa sulla stupidità';
        document.body.appendChild(message);

        setTimeout(() => {
            message.classList.add('fade-out');
            message.addEventListener('animationend', () => {
                message.remove();
            });
        }, 5000);
    }

    function setupIconAnimations() {
        const icons = document.querySelectorAll('.header-icon');

        icons.forEach(icon => {
            let animationClass = '';
            let iconName = '';

            if (icon.classList.contains('sole')) {
                animationClass = 'animate-right';
                iconName = 'sole';
            } else if (icon.classList.contains('omou')) {
                animationClass = 'animate-right';
                iconName = 'omou';
            } else if (icon.classList.contains('uomo')) {
                animationClass = 'animate-left';
                iconName = 'uomo';
            } else if (icon.classList.contains('luna')) {
                animationClass = 'animate-left';
                iconName = 'luna';
            } else if (icon.classList.contains('mano')) {
                animationClass = 'animate-vertical';
                iconName = 'mano';
            }

            if (iconName) {
                icon.addEventListener('click', () => checkEasterEgg(iconName));
            }

            if (animationClass) {
                icon.addEventListener('mouseenter', () => {
                    if (!icon.classList.contains(animationClass)) {
                        icon.classList.add(animationClass);
                    }
                });

                icon.addEventListener('mouseleave', () => {
                    if (icon.classList.contains(animationClass)) {
                        icon.addEventListener('animationiteration', () => {
                            icon.classList.remove(animationClass);
                        }, { once: true });
                    }
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', setupIconAnimations);

})();
