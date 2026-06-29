const workoutForm = document.getElementById("workoutForm");
const weeklyRoutine = document.getElementById("weeklyRoutine");

let workouts = JSON.parse(localStorage.getItem("workouts")) || {};

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
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  let hasWorkout = false;

  daysOrder.forEach((day) => {
    const data = workouts[day];

    if (data && data.exercises.length > 0) {
      hasWorkout = true;

      let dayHTML = `
        <div class="day-box">
          <h3>${day} - ${data.name}</h3>
      `;

      data.exercises.forEach((item, index) => {
        dayHTML += `
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

      dayHTML += `
          <button class="clear-btn" onclick="clearDay('${day}')">Clear ${day}</button>
        </div>
      `;

      weeklyRoutine.innerHTML += dayHTML;
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