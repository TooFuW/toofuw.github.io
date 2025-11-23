window.addEventListener("DOMContentLoaded", (event) => {
    const buttons = document.querySelectorAll('.about_nav_button');
    const aboutContent = document.getElementById('about_content');
    const goal = document.getElementById("about_goal");
    const hobbies = document.getElementById("about_hobbies");
    const languages = document.getElementById("about_languages");
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('selected');
            buttons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('selected');
                }
            });
            switch (button.getAttribute('id')) {
                case 'goal':
                    goal.classList.add('selected');
                    hobbies.classList.remove('selected');
                    languages.classList.remove('selected');
                    break;
                case 'hobbies':
                    goal.classList.remove('selected');
                    hobbies.classList.add('selected');
                    languages.classList.remove('selected');
                    break;
                case 'languages':
                    goal.classList.remove('selected');
                    hobbies.classList.remove('selected');
                    languages.classList.add('selected');
                    break;
                default:
                    break;
            }
        });
    });
});