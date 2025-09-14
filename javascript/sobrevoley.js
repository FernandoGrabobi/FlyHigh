document.addEventListener('DOMContentLoaded', () => {

    const quizQuestions = document.querySelectorAll('.quiz-question');

    quizQuestions.forEach(question => {
        const options = question.querySelectorAll('.quiz-options button');
        const feedbackEl = question.querySelector('.quiz-feedback');

        options.forEach(button => {
            button.addEventListener('click', () => {
                // Deshabilitar todos los botones de esta pregunta
                options.forEach(btn => btn.disabled = true);

                const isCorrect = button.getAttribute('data-correct') === 'true';

                if (isCorrect) {
                    button.classList.add('correct');
                    feedbackEl.textContent = '¡Correcto!';
                    feedbackEl.style.color = '#4CAF50';
                } else {
                    button.classList.add('incorrect');
                    feedbackEl.textContent = 'Incorrecto.';
                    feedbackEl.style.color = '#F44336';
                    
                    // Resaltar la respuesta correcta
                    const correctButton = question.querySelector('[data-correct="true"]');
                    correctButton.classList.add('correct');
                }
            });
        });
    });

});