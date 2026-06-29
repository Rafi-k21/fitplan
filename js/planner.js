const bulkRoutineInput = document.getElementById("bulkRoutineInput");
const autoBuildBtn = document.getElementById("autoBuildBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const weeklyRoutine = document.getElementById("weeklyRoutine");
const todayWorkout = document.getElementById("todayWorkout");
const todayTitle = document.getElementById("todayTitle");

let workouts = JSON.parse(localStorage.getItem("workouts")) || {};

const weekMap = {
  Monday: "Day 1",
  Tuesday: "Day 2",
  Wednesday: "Day 3",
  Thursday: "Day 4",
  Friday: null,
  Saturday: null,
  Sunday: null
};

autoBuildBtn.addEventListener("click", function () {
  const text = bulkRoutineInput.value.trim();

  if (!text) {
    alert("Paste your routine first.");
    return;
  }

  workouts = parseRoutineText(text);
  localStorage.setItem("workouts", JSON.stringify(workouts));

  bulkRoutineInput.value = "";
  displayTodayWorkout();
  displayWeeklyRoutine();

  alert("Routine built successfully.");
});

clearAllBtn.addEventListener("click", function () {
  localStorage.removeItem("workouts");
  workouts = {};
  displayTodayWorkout();
  displayWeeklyRoutine();
});

function parseRoutineText(text) {
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  const newWorkouts = {};
  let currentDay = null;
  let currentSection = "";

  lines.forEach(line => {
    const dayLine = line.match(/^Day\s*(\d+)\s*[–-]\s*(.+)$/i);

    if (dayLine) {
      currentDay = `Day ${dayLine[1]}`;
      newWorkouts[currentDay] = {
        name: dayLine[2].trim(),
        exercises: []
      };
      currentSection = "";
      return;
    }

    const isExerciseLine = line.includes("–") || line.includes("-");

    if (!isExerciseLine) {
      currentSection = line;
      return;
    }

    if (currentDay) {
      const cleanLine = line.replace("–", "-");
      const parts = cleanLine.split("-");

      const exerciseName = parts[0].trim();
      const detail = parts.slice(1).join("-").trim();

      let sets = "";
      let reps = "";

      const setRepMatch = detail.match(/(\d+)\s*[×x]\s*([\d-]+)/i);
      const setsOnlyMatch = detail.match(/(\d+)\s*sets?/i);

      if (setRepMatch) {
        sets = setRepMatch[1];
        reps = setRepMatch[2];
      } else if (setsOnlyMatch) {
        sets = setsOnlyMatch[1];
        reps = "AMRAP";
      } else {
        sets = "-";
        reps = "-";
      }

      newWorkouts[currentDay].exercises.push({
        section: currentSection || "Workout",
        exercise: exerciseName,
        sets,
        reps
      });
    }
  });

  return newWorkouts;
}

function getTodayName() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  return days[new Date().getDay()];
}

function displayTodayWorkout() {
  const todayName = getTodayName();
  const todayDay = weekMap[todayName];
  const data = todayDay ? workouts[todayDay] : null;

  todayTitle.textContent = `Today is ${todayName}`;

  if (!todayDay) {
    todayWorkout.innerHTML = `
      <div class="day-box">
        <h3>🏖️ Rest Day</h3>
        <p class="empty">
          Today is ${todayName}. Recover, eat well, and enjoy your day off.
        </p>
      </div>
    `;
    return;
  }

  if (!data || data.exercises.length === 0) {
    todayWorkout.innerHTML = `
      <div class="day-box">
        <h3>${todayDay}</h3>
        <p class="empty">No workout has been scheduled for today.</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="day-box">
      <h3>${todayDay} - ${data.name}</h3>
  `;

  let lastSection = "";

  data.exercises.forEach(item => {
    if (item.section && item.section !== lastSection) {
      html += `<h4 class="muscle-title">${item.section}</h4>`;
      lastSection = item.section;
    }

    html += `
      <div class="exercise-row">
        <div>
          <p><strong>${item.exercise}</strong></p>
          <p>${item.sets} sets × ${item.reps} reps</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  todayWorkout.innerHTML = html;
}

function displayWeeklyRoutine() {
  weeklyRoutine.innerHTML = "";

  const daysOrder = ["Day 1", "Day 2", "Day 3", "Day 4"];
  let hasWorkout = false;

  daysOrder.forEach(day => {
    const data = workouts[day];

    if (data && data.exercises.length > 0) {
      hasWorkout = true;

      let html = `
        <div class="day-box">
          <h3>${day} - ${data.name}</h3>
      `;

      let lastSection = "";

      data.exercises.forEach(item => {
        if (item.section && item.section !== lastSection) {
          html += `<h4 class="muscle-title">${item.section}</h4>`;
          lastSection = item.section;
        }

        html += `
          <div class="exercise-row">
            <div>
              <p><strong>${item.exercise}</strong></p>
              <p>${item.sets} sets × ${item.reps} reps</p>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      weeklyRoutine.innerHTML += html;
    }
  });

  if (!hasWorkout) {
    weeklyRoutine.innerHTML = `<p class="empty">No routine added yet. Paste your full routine above.</p>`;
  }
}

displayTodayWorkout();
displayWeeklyRoutine();