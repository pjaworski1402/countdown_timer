const selectors = {
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

// generate options for selector

const createOption = (value) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
};

for (let [key, value] of Object.entries(selectors)) {
  if (key == "hours") {
    for (let i = 0; i <= 24; i++) {
      value.appendChild(createOption(i));
    }
  } else {
    for (let i = 0; i <= 60; i++) {
      value.appendChild(createOption(i));
    }
  }
}

// circle
const circle = document.querySelector(".timer__svg");
const circleCircuit = 2 * Math.PI * 50;
let timeLeft = 3;
const TIME_LIMIT = timeLeft;
let timePassed = 0;
circle.setAttribute("stroke-dasharray", `${circleCircuit} ${circleCircuit}`);

const timeFraction = () => {
  return timeLeft / TIME_LIMIT;
};

const setCircleDasharray = () => {
  const circleDasharray = `${(timeFraction() * circleCircuit).toFixed(
    0
  )} ${circleCircuit}`;
  circle.setAttribute("stroke-dasharray", circleDasharray);
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    setCircleDasharray();
    console.count();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      stopTimer();
    }
  }, 1000);
};

const startPauseButton = document.querySelector(".timer__button");

const stopTimer = () => {
  setTimeout(() => {
    startPauseButton.classList.remove("paused");
    timePassed = 0;
    circle.setAttribute(
      "stroke-dasharray",
      `${circleCircuit} ${circleCircuit}`
    );
  }, 1000);
};

startPauseButton.addEventListener("click", () => {
  startTimer();
  startPauseButton.classList.add("paused");
});
