const greeting = document.getElementById("greeting");
const todayDate = document.getElementById("todayDate");
const todayWorkout = document.getElementById("todayWorkout");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const now = new Date();
const hour = now.getHours();
const today = days[now.getDay()];

if (hour < 12) {
  greeting.textContent = "Good Morning, Rafi 👋";
} else if (hour < 18) {
  greeting.textContent = "Good Afternoon, Rafi 👋";
} else {
  greeting.textContent = "Good Evening, Rafi 👋";
}

todayDate.textContent = `Today is ${today}`;

const workouts = JSON.parse(localStorage.getItem("workouts")) || {};

function displayTodayWorkout() {
  const todayData = workouts[today];

  if (!todayData || todayData.exercises.length === 0) {
    todayWorkout.innerHTML = `<p class="empty">No workout planned for today. Rest day or add a workout from Planner.</p>`;
    return;
  }

  let html = `
    <div class="day-box">
      <h3>${today} - ${todayData.name}</h3>
  `;

  todayData.exercises.forEach((item) => {
    html += `
      <div class="exercise-row">
        <p><strong>${item.exercise}</strong></p>
        <p>${item.sets} sets × ${item.reps} reps</p>
      </div>
    `;
  });

  html += `</div>`;
  todayWorkout.innerHTML = html;
}

displayTodayWorkout();