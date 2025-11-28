window.addEventListener("DOMContentLoaded", () => {
    // Animation at the apparition of the elements
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
                else {
                    entry.target.classList.remove('visible');
                }
            });
        },
        {
            threshold: 0.2
        }
    );
    revealElements.forEach((el) => observer.observe(el));

    // Navigation bar interaction
    const navGroups = [
        {
            buttonSelector: '#about_nav .about_nav_button',
            navSelector: '#about_nav_selection',
            contentClass: '.about_content'
        },
        {
            buttonSelector: '#skills_nav .skills_nav_button',
            navSelector: '#skills_nav_selection',
            contentClass: '.skills_content'
        }
    ];
    navGroups.forEach(({ buttonSelector, navSelector, contentClass }) => {
        const buttons = document.querySelectorAll(buttonSelector);
        const selection = document.querySelector(navSelector);
        const contents = document.querySelectorAll(contentClass);

        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                buttons.forEach(otherButton => otherButton.classList.remove('selected'));
                button.classList.add('selected');
                contents.forEach(section => section.classList.remove('selected'));

                const targetId = button.dataset.target;
                if (!targetId) {
                    return;
                } else {
                    if (targetId === 'about_goal' || targetId === 'skills_languages') {
                        selection.style.left = '5px';
                        selection.style.right = 'calc(50dvw + 65px)';
                    } else if (targetId === 'about_hobbies' || targetId === 'skills_tools') {
                        selection.style.left = 'calc(25dvw + 35px)';
                        selection.style.right = 'calc(25dvw + 35px)';
                    } else if (targetId === 'about_languages' || targetId === 'skills_os') {
                        selection.style.left = 'calc(50dvw + 65px)';
                        selection.style.right = '5px';
                    }
                }

                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('selected');
                }
            });
        });
    });

    // Modified smooth scrolling from page to page
    const step = () => window.innerHeight + 1
    let scrollIndex = Math.floor(window.scrollY / step());

    // Scroll indicator
    const blocs = document.querySelectorAll('.bloc');
    const scrollIndicator = document.createElement('div');
    scrollIndicator.classList.add('scroll-indicator');
    scrollIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
        <path fill="#ffffff" fill-rule="evenodd" d="M0 3.75A.75.75 0 0 1 .75 3h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 3.75ZM0 8a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8Zm.75 3.5a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H.75Z" clip-rule="evenodd"/>
    </svg>
    `
    scrollIndicator.innerHTML += `
        ${Array.from({ length: blocs.length }).map((_, i) => `<div data-index="${i}" data-tooltip="${blocs[i].dataset.tooltip}" class="scroll-indicator-line ${i === scrollIndex ? 'selected' : i < scrollIndex ? 'passed' : ''}"></div>`).join('')}
    `;
    document.body.insertBefore(scrollIndicator, document.querySelector("#title"));
    const scrollIndicatorLines = scrollIndicator.querySelectorAll('.scroll-indicator-line');
    scrollIndicator.addEventListener('click', (e) => {
        scrollIndicator.classList.toggle('selected');
    })

    let targetY = window.scrollY;
    let isAnimating = false;

    const clampScroll = (y) => {
        const max = document.body.scrollHeight - step();
        return Math.max(0, Math.min(max, y));
    };

    const scrollToTopButton = document.querySelector('#scroll-top');

    const smoothScrollTo = (targetY, duration = 1000) => {
        if (targetY === 0) {
            scrollToTopButton.classList.remove('selected');
        } else {
            scrollToTopButton.classList.add('selected');
        }
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing (ease-in-out)
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            window.scrollTo(0, startY + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const jump = (direction) => {
        if (isAnimating) return;
        isAnimating = true;
        targetY = clampScroll(targetY + step() * direction);
        scrollIndex = scrollIndex + direction;
        scrollIndex = scrollIndex < 0 ? 0 : scrollIndex >= blocs.length ? blocs.length - 1 : scrollIndex;
        scrollIndicatorLines.forEach((line, index) => {
            line.classList.toggle('selected', index === scrollIndex);
            line.classList.toggle('passed', index < scrollIndex);
        })
        smoothScrollTo(targetY, 500);
        setTimeout(() => {
            isAnimating = false;
        }, 650);
    };

    // Scroll per slide on desktop (wheel)
    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (document.body.classList.contains('lightbox-open') ||
            ((window.innerWidth < 1000 || window.innerHeight < 600) && scrollIndicator.classList.contains('selected'))) {
            return;
        }
        jump(Math.sign(event.deltaY));
    }, { passive: false });

    // Clavier
    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        if (document.body.classList.contains('lightbox-open') ||
            ((window.innerWidth < 1000 || window.innerHeight < 600) && scrollIndicator.classList.contains('selected'))) {
            return;
        }
        if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
            jump(1);
        } else if (['ArrowUp', 'PageUp'].includes(event.key)) {
            jump(-1);
        }
    });

    // Touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', (event) => {
        if (document.body.classList.contains('lightbox-open')) {
            return;
        }
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchmove', (event) => {
        if (document.body.classList.contains('lightbox-open')) {
            return;
        }
        event.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', (event) => {
        if (document.body.classList.contains('lightbox-open') ||
            ((window.innerWidth < 1000 || window.innerHeight < 600) && scrollIndicator.classList.contains('selected'))) {
            return;
        }
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                jump(1);
            } else {
                jump(-1);
            }
        }
    };

    window.addEventListener('scroll', () => {
        if (!isAnimating) {
            targetY = window.scrollY;
        }
    }, { passive: true });

    const scrollToIndex = (index) => {
        if (isAnimating || index === scrollIndex) return;
        isAnimating = true;
        
        const direction = index > scrollIndex ? 1 : -1;
        const steps = Math.abs(index - scrollIndex);
        targetY = clampScroll(window.scrollY + step() * direction * steps);
        scrollIndex = index;
        
        scrollIndicatorLines.forEach((line, i) => {
            line.classList.toggle('selected', i === scrollIndex);
            line.classList.toggle('passed', i < scrollIndex);
        });
        
        const duration = 500 + (steps - 1) * (1100 / 14);
        smoothScrollTo(targetY, duration);
        setTimeout(() => {
            isAnimating = false;
        }, duration + 150);
    };

    scrollIndicatorLines.forEach((line, index) => {
        line.addEventListener('click', () => {
            scrollToIndex(index);
        });
    });

    // First page button
    const firstPageButton = document.querySelector('#title svg');
    firstPageButton.addEventListener('click', () => {
        scrollIndex = 0;
        jump(1);
    });

    // Scroll to top function
    const scrollToTop = () => {
        if (isAnimating) return;
        isAnimating = true;
        scrollIndicatorLines.forEach((line, i) => {
            if (i === 0) {
                line.classList.add('selected');
                line.classList.remove('passed');
            } else {
                line.classList.remove('selected');
                line.classList.remove('passed');
            }
        });
        const duration = 500 + (Math.abs(0 - scrollIndex) - 1) * (1100 / 14);
        targetY = 0;
        scrollIndex = 0;
        smoothScrollTo(0, duration);
        setTimeout(() => {
            isAnimating = false;
        }, duration + 150);
    }

    // Scroll to top button
    scrollToTopButton.addEventListener('click', () => {
        scrollToTop();
    });

    // Scroll to the top at the refresh to prevent glitchs and bugs
    //scrollToTop();

    // If the size of the page change, scroll to the top
    window.addEventListener('resize', () => {
        scrollToTop();
    });

    // Project media lightbox
    const projectMediaElements = document.querySelectorAll('.project_image img, .project_image video');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
    const lightboxVideo = lightbox ? lightbox.querySelector('video') : null;

    if (lightbox && lightboxImage && lightboxVideo && projectMediaElements.length) {
        const resetLightboxMedia = () => {
            lightboxImage.classList.remove('active');
            lightboxImage.removeAttribute('src');
            lightboxImage.removeAttribute('alt');

            lightboxVideo.pause();
            lightboxVideo.classList.remove('active');
            lightboxVideo.removeAttribute('src');
            lightboxVideo.load();
        };

        const openLightbox = (type, source, altText = '') => {
            if (!source) return;
            resetLightboxMedia();

            if (type === 'image') {
                lightboxImage.src = source;
                lightboxImage.alt = altText;
                lightboxImage.classList.add('active');
            } else {
                lightboxVideo.src = source;
                lightboxVideo.classList.add('active');
                lightboxVideo.currentTime = 0;
            }

            lightbox.classList.add('visible');
            document.body.classList.add('lightbox-open');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('lightbox-open');
            resetLightboxMedia();
        };

        const getVideoSource = (videoElement) => {
            if (!videoElement) return '';
            if (videoElement.currentSrc) return videoElement.currentSrc;
            if (videoElement.getAttribute('src')) return videoElement.getAttribute('src');
            const sourceChild = videoElement.querySelector('source');
            return sourceChild ? sourceChild.src : '';
        };

        projectMediaElements.forEach((media) => {
            media.addEventListener('click', () => {
                if (media.tagName.toLowerCase() === 'video') {
                    const source = getVideoSource(media);
                    openLightbox('video', source);
                } else {
                    openLightbox('image', media.src, media.alt || '');
                }
            });
        });

        lightbox.addEventListener('click', (event) => {
            closeLightbox();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    }
});
