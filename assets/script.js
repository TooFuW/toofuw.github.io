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
    scrollIndicator.innerHTML = `
        ${Array.from({ length: blocs.length }).map((_, i) => `<div data-index="${i}" class="scroll-indicator-line ${i === scrollIndex ? 'selected' : i < scrollIndex ? 'passed' : ''}"></div>`).join('')}
    `;
    document.body.insertBefore(scrollIndicator, document.querySelector("#title"));
    const scrollIndicatorLines = scrollIndicator.querySelectorAll('.scroll-indicator-line');

    let targetY = window.scrollY;
    let isAnimating = false;

    const clampScroll = (y) => {
        const max = document.body.scrollHeight - step();
        return Math.max(0, Math.min(max, y));
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
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setTimeout(() => {
            isAnimating = false;
        }, 650);
    };

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        jump(Math.sign(event.deltaY));
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
        if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
            event.preventDefault();
            jump(1);
        } else if (['ArrowUp', 'PageUp'].includes(event.key)) {
            event.preventDefault();
            jump(-1);
        }
    });

    window.addEventListener('scroll', () => {
        if (!isAnimating) targetY = window.scrollY;
    }, { passive: true });

    scrollIndicatorLines.forEach((line, index) => {
        line.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            window.scrollTo({ top: step() * index, behavior: 'smooth' });
            setTimeout(() => {
                isAnimating = false;
            }, 650);
            scrollIndex = index;
            scrollIndicatorLines.forEach((otherLine, otherIndex) => {
                otherLine.classList.toggle('selected', otherIndex === index);
                otherLine.classList.toggle('passed', otherIndex < index);
            })
        });
    });

    // First page button
    const firstPageButton = document.querySelector('#title svg');
    firstPageButton.addEventListener('click', () => {
        jump(1);
    });
});