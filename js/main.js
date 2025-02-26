try {
    particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#a855f7'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.2,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            animation: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#a855f7',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
        }
    },
    interactivity: {
        detect_on: 'window',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});
}
catch (error) {
    wompWomp(error);
}

window.addEventListener('appearance-changed', () => {
    let particlesEl;
    try {
        particlesEl = document.getElementById('particles-js');
    } catch (error) {
        wompWomp(error);
    }
    if (localStorage.getItem('showParticles') === 'false') {
        particlesEl.style.display = 'none';
    } else {
        particlesEl.style.display = 'block';
    }
});

function wompWomp(error) {
    console.error('Error while trying to get particles-js element. Are you sure that you, imported the js library & have an element called particles-js?? (yeah didnt think so. and if you did i have no clue why this error is here :) )', error);
}