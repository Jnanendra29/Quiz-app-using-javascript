//Write your javascript code here

let score = 0;
let timer = 60;
let interval;

const scoreDisplay = document.getElementById("score");
const startRulesDiv = document.getElementById("start-rules");

document.getElementById("startQuiz").addEventListener("click", function () {
  startRulesDiv.style.display = "none";
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  getQuestion();
  startTimer();
  updateScore();
});

// write play again code here
document.getElementById("playAgain").addEventListener("click", function () {
  score = 0;
  timer = 60;
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  getQuestion();
  startTimer();
  updateScore();
});

async function getQuestion() {
  try {
    // call the api here use async-await
    const response = await fetch("https://opentdb.com/api.php?amount=1");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    let question = data.results[0];
    // console.log(question)
    let questionDiv = document.getElementById("question");
    questionDiv.innerHTML = question.question;

    let incorrectAnswers = question.incorrect_answers;
    let correctIndex = Math.floor(Math.random() * 4);
    let answerBtns = document.querySelectorAll(".answer");
    answerBtns.forEach((btn, i) => {
      btn.innerHTML = "";
    });
    answerBtns.forEach((btn, i) => {
      if (i === correctIndex) {
        btn.innerHTML = question.correct_answer;
        btn.onclick = () => correctAnswer();
      } else {
        let content = incorrectAnswers.pop();
        if (content) {
          btn.innerHTML = content;
        }
        btn.onclick = () => wrongAnswer();
      }
    });
  } catch (error) {
    // error handling code
    console.log("error while fetching API", error);
    document.getElementById("question").textContent =
      "Error in fetching. Please refresh for try again or click the button for continue";
  }
}

function correctAnswer() {
  score += 10;
  updateScore();
  getQuestion();
}

function wrongAnswer() {
  getQuestion();
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(function () {
    timer -= 1;
    document.getElementById("timer").textContent =
      "Time left: " + timer + " seconds";
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(interval);
  document.getElementById("quizScreen").classList.add("hidden");
  const endmsg = document.getElementById("endMessage");
  const finalScoreDisp = document.getElementById("finalScore");

  if (score <= 20) {
    endmsg.textContent = "You played well...but try again for better score.";
  } else if (score > 20 && score <= 50) {
    endmsg.textContent = "You played good.";
  } else {
    endmsg.textContent = "You were execellent.";
  }

  endmsg.classList.remove("hidden");
  finalScoreDisp.textContent = "Your score: " + score;
  document.getElementById("endScreen").classList.remove("hidden");
}
