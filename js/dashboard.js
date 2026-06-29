const greeting = document.getElementById("greeting");
const todayDate = document.getElementById("todayDate");
const todayWorkout = document.getElementById("todayWorkout");

const workouts = JSON.parse(localStorage.getItem("workouts")) || {};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const weekMap = {
  Monday: "Day 1",
  Tuesday: "Day 2",
  Wednesday: "Day 3",
  Thursday: "Day 4",
  Friday: null,
  Saturday: null,
  Sunday: null
};

const now = new Date();
const hour = now.getHours();
const todayName = days[now.getDay()];
const todayDay = weekMap[todayName];

if (hour < 12) {
  greeting.textContent = "Good Morning, Rafi 👋";
} else if (hour < 18) {
  greeting.textContent = "Good Afternoon, Rafi 👋";
} else {
  greeting.textContent = "Good Evening, Rafi 👋";
}

todayDate.textContent = `Today is ${todayName}`;

function displayDashboardWorkout() {
  const data = todayDay ? workouts[todayDay] : null;

  if (!todayDay) {
    todayWorkout.innerHTML = `
      <div class="day-box">
        <h3>🏖️ Rest Day</h3>
        <p class="empty">
          Today is ${todayName}. Recover, eat well, and get ready for your next session.
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

displayDashboardWorkout();