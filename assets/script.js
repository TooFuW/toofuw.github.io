window.addEventListener("DOMContentLoaded", () => {
    const navGroups = [
        {
            buttonSelector: '#about_nav .about_nav_button',
            contentClass: '.about_content'
        },
        {
            buttonSelector: '#skills_nav .skills_nav_button',
            contentClass: '.skills_content'
        }
    ];

    navGroups.forEach(({ buttonSelector, contentClass }) => {
        const buttons = document.querySelectorAll(buttonSelector);
        const contents = document.querySelectorAll(contentClass);

        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                buttons.forEach(otherButton => otherButton.classList.remove('selected'));
                button.classList.add('selected');
                contents.forEach(section => section.classList.remove('selected'));

                const targetId = button.dataset.target;
                if (!targetId) {
                    return;
                }

                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('selected');
                }
            });
        });
    });
});
