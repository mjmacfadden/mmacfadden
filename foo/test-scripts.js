// Configuration Data
const QUIZ_CONFIG = {
    questions: [
        { question: "I enjoy coming up with many different ideas for a single problem.", category: "Divergent" },
        { question: "I prefer focusing on one solution and refining it until it’s perfect.", category: "Convergent" },
        { question: "I like to plan every step of a project before starting.", category: "Planning" },
        { question: "I feel most creative when I can jump in and figure things out as I go.", category: "Improvisation" },
        { question: "I often think of unusual or unexpected ways to approach a task.", category: "Divergent" },
        { question: "I enjoy analyzing options to find the most practical solution.", category: "Convergent" },
        { question: "I feel more comfortable when I have a detailed plan to follow.", category: "Planning" },
        { question: "I thrive in situations where I can adapt on the fly.", category: "Improvisation" },
        { question: "I love exploring possibilities even if they don’t lead anywhere.", category: "Divergent" },
        { question: "I prefer tasks where I can narrow down to the best answer.", category: "Convergent" },
        { question: "I need a clear roadmap to feel confident in my work.", category: "Planning" },
        { question: "I’m energized by solving problems without a set plan.", category: "Improvisation" }
    ],
    archetypes: {
        "Divergent-Planning": "Visionary Architect",
        "Divergent-Improvisation": "Freeform Dreamer",
        "Convergent-Planning": "Precision Sculptor",
        "Convergent-Improvisation": "Adaptive Fixer"
    },
    redirectMap: {
        "Visionary Architect": "visionary-architect.html",
        "Freeform Dreamer": "freeform-dreamer.html",
        "Precision Sculptor": "precision-sculptor.html",
        "Adaptive Fixer": "adaptive-fixer.html"
    }
};

class CreativityQuiz {
    constructor() {
        // Clear localStorage on initialization
        localStorage.removeItem('quizAnswers');
        localStorage.removeItem('quizResults');

        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.scores = { Divergent: 0, Convergent: 0, Planning: 0, Improvisation: 0 };

        this.initializeDOM();
        this.bindEvents();
        this.showQuestion(this.currentQuestionIndex);
    }

    initializeDOM() {
        this.questionContainer = document.getElementById('question-container');
        this.navigation = document.getElementById('navigation');
        this.backBtn = document.getElementById('back-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.quizForm = document.getElementById('quiz-form');
        this.emailForm = document.getElementById('email-form');
        this.emailInput = document.getElementById('emailInput');
        this.emailError = document.getElementById('email-error');
        this.emailSuccess = document.getElementById('email-success');
        this.spinner = document.getElementById('loadingSpinner');
        this.resultText = document.getElementById('result-text');
    }

    bindEvents() {
        this.navigation.addEventListener('click', this.handleNavigation.bind(this));
        this.quizForm.addEventListener('submit', this.handleQuizSubmit.bind(this));
        this.emailForm.addEventListener('submit', this.handleEmailSubmit.bind(this));
        this.questionContainer.addEventListener('change', this.handleRadioChange.bind(this));
    }

    handleNavigation(e) {
        if (e.target.id === 'back-btn') {
            this.currentQuestionIndex--;
            this.showQuestion(this.currentQuestionIndex);
        } else if (e.target.id === 'next-btn') {
            const selectedAnswer = document.querySelector(`input[name="q${this.currentQuestionIndex}"]:checked`);
            
            // No need for alert since button is disabled until selection
            this.userAnswers[this.currentQuestionIndex] = parseInt(selectedAnswer.value);
            localStorage.setItem('quizAnswers', JSON.stringify(this.userAnswers));

            if (this.currentQuestionIndex === QUIZ_CONFIG.questions.length - 1) {
                this.quizForm.dispatchEvent(new Event('submit'));
                return;
            }

            this.currentQuestionIndex++;
            this.showQuestion(this.currentQuestionIndex);
        }
    }

    handleRadioChange() {
        const selectedAnswer = document.querySelector(`input[name="q${this.currentQuestionIndex}"]:checked`);
        this.nextBtn.disabled = !selectedAnswer;
    }

    showQuestion(index) {
        this.questionContainer.innerHTML = '';
        const q = QUIZ_CONFIG.questions[index];
        const questionDiv = document.createElement('div');
        
        questionDiv.innerHTML = this.createQuestionHTML(index, q);
        this.questionContainer.appendChild(questionDiv);

        this.updateNavigationButtons(index);
        this.handleRadioChange(); // Set initial state of Next button
    }

    createQuestionHTML(index, question) {
        return `
            <p class="question-number">${index + 1} of 12</p>
            <p class="question">${question.question}</p>
            <div class="d-flex align-items-center likert justify-content-center">
                <label>Strongly Disagree</label>
                <div class="d-flex gap-2">
                    ${[1, 2, 3, 4, 5].map(num => `
                        <div class='select'>
                            <span>${num}</span>
                            <input class="form-check-input" type="radio" 
                                   name="q${index}" 
                                   value="${num}" 
                                   ${this.userAnswers[index] === num ? 'checked' : ''}>
                        </div>
                    `).join('')}
                </div>
                <label>Strongly Agree</label>
            </div>
        `;
    }

    updateNavigationButtons(index) {
        this.backBtn.disabled = index === 0;
        this.backBtn.style.display = 'block';
        this.nextBtn.textContent = index === QUIZ_CONFIG.questions.length - 1 ? 'Submit' : 'Next';
    }

    handleQuizSubmit(e) {
        e.preventDefault();
        this.calculateScores();
        this.displayResults();
    }

    calculateScores() {
        Object.keys(this.scores).forEach(category => this.scores[category] = 0);

        QUIZ_CONFIG.questions.forEach((q, index) => {
            if (this.userAnswers[index] !== undefined) {
                this.scores[q.category] += this.userAnswers[index];
            }
        });
    }

    displayResults() {
        const thinker = this.scores.Divergent > this.scores.Convergent ? 'Divergent' : 'Convergent';
        const approach = this.scores.Planning > this.scores.Improvisation ? 'Planning' : 'Improvisation';
        const archetypeKey = `${thinker}-${approach}`;
        const archetype = QUIZ_CONFIG.archetypes[archetypeKey] || 'Unknown';

        this.resultText.innerHTML = `You are a <span>${archetype}</span>! Your creative style leans toward <span>${thinker}</span> thinking and a <span>${approach}</span> approach.`;
        
        const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
        resultsModal.show();

        localStorage.setItem('quizResults', JSON.stringify({ archetype, thinker, approach }));
        this.navigation.style.display = 'none';
    }

    handleEmailSubmit(event) {
        event.preventDefault();

        const email = this.emailInput.value;
        const submitBtn = this.emailForm.querySelector('button');
        const storedResults = JSON.parse(localStorage.getItem('quizResults')) || {};

        // Reset previous states
        this.emailInput.classList.remove('is-invalid');
        this.emailError.classList.remove('d-block');
        this.emailSuccess.classList.add('d-none');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.emailInput.classList.add('is-invalid');
            this.emailError.classList.add('d-block');
            return;
        }

        // Show spinner and disable button
        this.spinner.classList.remove('d-none');
        submitBtn.disabled = true;

        // Prepare data to send
        const data = {
            email: email,
            archetype: storedResults.archetype || 'Unknown',
            thinker: storedResults.thinker || 'Unknown',
            approach: storedResults.approach || 'Unknown'
        };

        // Send to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbwMTy2YbJZHIg8PwSeIt37SMMgDi6BfBGWiuPlSwM90CgVa0ZDLZIQK3TNwWY_WwSySNg/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Success case
            this.spinner.classList.add('d-none');
            submitBtn.disabled = false;
            this.emailSuccess.classList.remove('d-none');
            this.emailForm.reset();

            // Redirect to archetype page
            const redirectUrl = QUIZ_CONFIG.redirectMap[storedResults.archetype];
            if (redirectUrl) {
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000); // Delay for user to see success message
            } else {
                console.error('No redirect URL found for archetype:', storedResults.archetype);
            }
        })
        .catch(err => {
            // Error case
            this.spinner.classList.add('d-none');
            submitBtn.disabled = false;
            this.emailInput.classList.add('is-invalid');
            this.emailError.textContent = 'Something went wrong. Try again.';
            this.emailError.classList.add('d-block');
            console.error('Submission error:', err);
        });
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CreativityQuiz();
});