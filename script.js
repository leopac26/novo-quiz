const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const startButton = document.getElementById('start');
const levelSelect = document.getElementById('level');

const allQuestions = {
  facil: [
    {
      question: "Quem construiu a arca?",
      answers: { a: "Moisés", b: "Abraão", c: "Noé" },
      correct: "c"
    },
    {
      question: "Quem foi lançado na cova dos leões?",
      answers: { a: "Daniel", b: "Davi", c: "Elias" },
      correct: "a"
    }
  ],
  medio: [
    {
      question: "Quantos livros tem o Novo Testamento?",
      answers: { a: "27", b: "39", c: "66" },
      correct: "a"
    },
    {
      question: "Qual apóstolo negou Jesus três vezes?",
      answers: { a: "João", b: "Pedro", c: "Paulo" },
      correct: "b"
    }
  ],
  dificil: [
    {
      question: "Quem foi o rei durante o nascimento de Jesus?",
      answers: { a: "Herodes", b: "Saul", c: "Davi" },
      correct: "a"
    },
    {
      question: "Qual profeta teve uma visão do vale de ossos secos?",
      answers: { a: "Jeremias", b: "Ezequiel", c: "Isaías" },
      correct: "b"
    }
  ]
};

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let countdown;

function showQuestion(index) {
  clearTimeout(timer);
  const current = currentQuestions[index];
  const answers = [];

  for (let letter in current.answers) {
    answers.push(
      `<label>
        <input type="radio" name="answer" value="${letter}">
        ${letter}: ${current.answers[letter]}
      </label><br>`
    );
  }

  quizContainer.innerHTML = `
    <div class="question"><strong>${current.question}</strong></div>
    <div class="answers">${answers.join('')}</div>
    <div id="countdown">⏳ Tempo restante: <span id="time">10</span>s</div>
    <div id="feedback"></div>
  `;

  let timeLeft = 10;
  countdown = setInterval(() => {
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      showFeedback(null);
    }
  }, 1000);

  // Adiciona escuta para clique
  const radios = quizContainer.querySelectorAll('input[name="answer"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      clearInterval(countdown);
      showFeedback(radio.value);
    });
  });
}

function showFeedback(userAnswer) {
  const current = currentQuestions[currentIndex];
  const feedback = document.getElementById('feedback');
  const isCorrect = userAnswer === current.correct;

  if (userAnswer) {
    if (isCorrect) {
      score++;
      feedback.innerHTML = `<p style="color: green;">✅ Correto! ${current.answers[current.correct]}</p>`;
    } else {
      feedback.innerHTML = `<p style="color: red;">❌ Errado. Resposta correta: ${current.answers[current.correct]}</p>`;
    }
  } else {
    feedback.innerHTML = `<p style="color: orange;">⏱️ Tempo esgotado! Resposta correta: ${current.answers[current.correct]}</p>`;
  }

  // Espera 3 segundos e vai para a próxima pergunta
  timer = setTimeout(() => {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
      showQuestion(currentIndex);
    } else {
      showResult();
    }
  }, 3000);
}

function showResult() {
  quizContainer.style.display = 'none';
  resultContainer.innerHTML = `Você acertou ${score} de ${currentQuestions.length} perguntas.`;
}

startButton.addEventListener('click', () => {
  const level = levelSelect.value;
  currentQuestions = allQuestions[level];
  currentIndex = 0;
  score = 0;
  resultContainer.innerHTML = '';
  quizContainer.style.display = 'block';
  showQuestion(currentIndex);
});
