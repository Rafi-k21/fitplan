const workoutForm = document.getElementById("workoutForm");
const weeklyRoutine = document.getElementById("weeklyRoutine");
const bulkRoutineInput = document.getElementById("bulkRoutineInput");
const autoBuildBtn = document.getElementById("autoBuildBtn");

let workouts = JSON.parse(localStorage.getItem("workouts")) || {};

autoBuildBtn.addEventListener("click", function () {
  const text = bulkRoutineInput.value.trim();

  if (!text) {
    alert("Paste your workout routine first.");
    return;
  }

  workouts = parseRoutineText(text);

  localStorage.setItem("workouts", JSON.stringify(workouts));
  bulkRoutineInput.value = "";
  displayWeeklyRoutine();

  alert("Routine built successfully!");
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
    const isDayLine = /^Day\s*\d+/i.test(line);

    if (isDayLine) {
      const dayMatch = line.match(/^Day\s*(\d+)/i);
      const dayNumber = dayMatch ? dayMatch[1] : "";

      currentDay = `Day ${dayNumber}`;

      const workoutName = line
        .replace(/^Day\s*\d+\s*[–-]\s*/i, "")
        .trim();

      newWorkouts[currentDay] = {
        name: workoutName || `Workout ${dayNumber}`,
        exercises: []
      };

      return;
    }

    const isExerciseLine = line.includes("–") || line.includes("-");

    if (!isExerciseLine) {
      currentSection = line;
      return;
    }

    if (currentDay && isExerciseLine) {
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
        sets = detail;
        reps = "";
      }

      newWorkouts[currentDay].exercises.push({
        section: currentSection,
        exercise: exerciseName,
        sets: sets,
        reps: reps
      });
    }
  });

  return newWorkouts;
}

workoutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const day = document.getElementById("day").value;
  const workoutName = document.getElementById("workoutName").value;
  const exercise = document.getElementById("exercise").value;
  const sets = document.getElementById("sets").value;
  const reps = document.getElementById("reps").value;

  if (!workouts[day]) {
    workouts[day] = {
      name: workoutName,
      exercises: []
    };
  }

  workouts[day].name = workoutName;

  workouts[day].exercises.push({
    section: "Custom",
    exercise,
    sets,
    reps
  });

  localStorage.setItem("workouts", JSON.stringify(workouts));

  document.getElementById("exercise").value = "";
  document.getElementById("sets").value = "";
  document.getElementById("reps").value = "";
  document.getElementById("exercise").focus();

  displayWeeklyRoutine();
});

function displayWeeklyRoutine() {
  weeklyRoutine.innerHTML = "";

  const daysOrder = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

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

      data.exercises.forEach((item, index) => {
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

            <button class="delete-btn" onclick="deleteExercise('${day}', ${index})">
              Delete
            </button>
          </div>
        `;
      });

      html += `
          <button class="clear-btn" onclick="clearDay('${day}')">Clear ${day}</button>
        </div>
      `;

      weeklyRoutine.innerHTML += html;
    }
  });

  if (!hasWorkout) {
    weeklyRoutine.innerHTML = `<p class="empty">No workout added yet.</p>`;
  }
}

function deleteExercise(day, index) {
  workouts[day].exercises.splice(index, 1);

  if (workouts[day].exercises.length === 0) {
    delete workouts[day];
  }

  localStorage.setItem("workouts", JSON.stringify(workouts));
  displayWeeklyRoutine();
}

function clearDay(day) {
  delete workouts[day];
  localStorage.setItem("workouts", JSON.stringify(workouts));
  displayWeeklyRoutine();
}

displayWeeklyRoutine();