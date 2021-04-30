Math.easeInOutQuad = (t, b, c, d) => {
  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};
const startPauseButton = document.querySelector(".timer__button");
const alertDiv = document.querySelector(".timer__alert");
const alertText = document.querySelector(".timer__alertText");
const alertButton = document.querySelector(".timer__alertClose");
const counterText = document.querySelector("#counterText");
const circle = document.querySelector(".timer__svg");
const circleCircuit = Math.floor(2 * Math.PI * 50); //50 is the radius of the circle svg
let state = "stop";
const scrollTo = (element, to, duration) => {
  let start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

  const animateScroll = () => {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
};
const selectors = {
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};
const time = {
  hours: 0,
  minutes: 0,
  seconds: 0,
};
let timeLeft = 0;
const setTimeLeft = () => {
  timeLeft = time.hours * 3600 + time.minutes * 60 + time.seconds;
};
let timeLimit = timeLeft;
let timePassed = 0;

const timeFormat = (value) => {
  return value < 10 ? `0${value}` : value;
};

const showAlert = (message) => {
  alertText.textContent = message;
  alertDiv.style.transform = "translate(-50%, -50%) scale(1)";
};

const createElement = (value, type, className) => {
  const option = document.createElement(type);
  option.value = value;
  option.textContent = timeFormat(value);
  option.classList.add(className);
  return option;
};

const createTimeUnits = (() => {
  for (let [key, value] of Object.entries(selectors)) {
    for (let i = -1; i <= (key === "hours" ? 25 : 60); i++) {
      value.appendChild(createElement(i, "li", `timer__${key}Value`));
    }
  }
})();

const setTime = () => {
  const timeLeftObject = {
    hours: Math.floor(timeLeft / 3600),
    minutes: Math.floor((timeLeft % 3600) / 60),
    seconds: Math.floor((timeLeft % 3600) % 60),
  };
  for ([unit, value] of Object.entries(timeLeftObject)) {
    const htmlElement = document.querySelectorAll(`.timer__${unit}Value`);
    htmlElement.forEach((element, index) => {
      element.classList.remove(`timer__${unit}Value--current`);
      if (index === value + 1) {
        element.classList.add(`timer__${unit}Value--current`);
        scrollTo(
          htmlElement[value + 1].parentElement,
          htmlElement[value + 1].offsetTop -
            htmlElement[value + 1].parentElement.clientHeight +
            htmlElement[value + 1].clientHeight * 1.5,
          100
        );
      }
    });
  }
};
setTime();
// init circle
circle.setAttribute("stroke-dasharray", `${circleCircuit} ${circleCircuit}`);

const setCircleDasharray = () => {
  const toZero = (number) => {
    return number < 0 ? 0 : number;
  };
  const timeFraction =
    timeLeft / timeLimit - (1 / timeLimit) * (1 - timeLeft / timeLimit);
  const circleDasharray = `${toZero(timeFraction * circleCircuit).toFixed(
    0
  )} ${circleCircuit}`;
  circle.setAttribute("stroke-dasharray", circleDasharray);
};

let timerInterval;
const startTimer = () => {
  counterText.textContent = "time left";
  state = "start";
  timerInterval = setInterval(() => {
    timePassed++;
    timeLeft = timeLimit - timePassed;
    setTime();
    setCircleDasharray();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      stopTimer();
    }
  }, 1000);
};
const stopTimer = () => {
  counterText.textContent = "set time";
  state = "stop";
  startPauseButton.classList.remove("timer__button--pause");
  timePassed = 0;
  setTimeLeft();
  setTime();
  showAlert("The countdown is over");
  setTimeout(() => {
    circle.setAttribute(
      "stroke-dasharray",
      `${circleCircuit} ${circleCircuit}`
    );
  }, 1000);
};

const pauseTimer = () => {
  state = "pause";
  startPauseButton.classList.remove("timer__button--pause");
  clearInterval(timerInterval);
};

startPauseButton.addEventListener("click", () => {
  if (startPauseButton.classList.contains("timer__button--pause")) {
    startPauseButton.classList.remove("timer__button--pause");
    pauseTimer();
  } else {
    if (timeLeft == 0) {
      showAlert("Please set the time first!");
    } else {
      startPauseButton.classList.add("timer__button--pause");
      startTimer();
    }
  }
});

alertButton.addEventListener("click", () => {
  alertDiv.style.transform = "translate(-50%, -50%) scale(0)";
});

// scrolling/settings
const timerNumbersContainer = document.querySelectorAll(".timer__setTime");
const scrollUnits = (elementId, direction) => {
  if (state == "stop") {
    if (
      time[elementId] >= 0 &&
      time[elementId] < (elementId == "hours" ? 24 : 59) &&
      direction > 0
    ) {
      time[elementId] += direction;
    } else if (
      time[elementId] > 0 &&
      time[elementId] <= (elementId == "hours" ? 24 : 59) &&
      direction < 0
    ) {
      time[elementId] += direction;
    }
    setTimeLeft();
    timeLimit = timeLeft;
    setTime();
  }
};

timerNumbersContainer.forEach((element) => {
  const elementId = element.id;
  const scrollSensitivity = 0;
  element.onwheel = (e) => {
    if (e.deltaY > scrollSensitivity) {
      scrollUnits(elementId, 1);
    } else if (e.deltaY < -scrollSensitivity) {
      scrollUnits(elementId, -1);
    }
  };
  let lastTouch = 0;
  element.addEventListener("touchmove", (e) => {
    const touch = e.touches[0].pageY - element.offsetTop;
    const scrollSensitivity = 20;
    if (touch - scrollSensitivity > lastTouch) {
      scrollUnits(elementId, -1);
      lastTouch = touch;
    } else if (touch + scrollSensitivity < lastTouch) {
      scrollUnits(elementId, 1);
      lastTouch = touch;
    }
  });
});
