let currentQuestionIndex = 0;
let timer;
let timeLeft = 30;
let questions = [];
let userAnswers = [];

document.getElementById('start-btn').addEventListener('click', startQuiz);

async function startQuiz() {
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    // Soruları API'dan çek
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    questions = data.slice(0, 10).map((item, index) => {
        return {
            question: item.title,
            choices: generateChoices(item.body, index),
            correctAnswer: generateChoices(item.body, index)[0]  // Dummy correct answer
        };
    });

    showQuestion();
    startTimer();
}

function generateChoices(text, index) {
    // Şıklar için örnek parse fonksiyonu, gerçek senaryoda daha uygun parsing yapılabilir
    return [
        `A -  repellat `,
        `B -  occaecati `,
        `C -  excepturi `,
        `D -  reprehenderit`
    ];
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.className = 'disabled';
        li.addEventListener('click', () => selectAnswer(choice));
        choicesContainer.appendChild(li);
    });

    setTimeout(() => {
        document.querySelectorAll('#choices li').forEach(li => li.classList.remove('disabled'));
    }, 10000);
}

function selectAnswer(choice) {
    userAnswers.push({
        question: questions[currentQuestionIndex].question,
        answer: choice
    });
    currentQuestionIndex++;
    showQuestion();
    resetTimer();
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            userAnswers.push({
                question: questions[currentQuestionIndex].question,
                answer: 'Yanıtlanmadı'
            });
            currentQuestionIndex++;
            showQuestion();
            resetTimer();
        } else {
            timeLeft--;
            document.getElementById('time').textContent = timeLeft;
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('time').textContent = timeLeft;
    startTimer();
}

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const resultsTableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    userAnswers.forEach(answer => {
        const row = resultsTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = answer.question;
        cell2.textContent = answer.answer;
    });
}