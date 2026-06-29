const nutritionForm = document.getElementById("nutritionForm");
const nutritionResult = document.getElementById("nutritionResult");

nutritionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = Number(document.getElementById("weight").value);
  const goal = document.getElementById("goal").value;

  const maintenance = Math.round(weight * 33);
  const leanBulk = maintenance + 250;
  const cut = maintenance - 400;
  const protein = Math.round(weight * 2);

  let selectedCalories = maintenance;

  if (goal === "bulk") {
    selectedCalories = leanBulk;
  } else if (goal === "cut") {
    selectedCalories = cut;
  }

  nutritionResult.innerHTML = `
    <h3>Your Daily Target</h3>
    <p><strong>Weight:</strong> ${weight}kg</p>
    <p><strong>Selected Goal Calories:</strong> ${selectedCalories} kcal/day</p>
    <p><strong>Maintenance:</strong> ${maintenance} kcal/day</p>
    <p><strong>Lean Bulk:</strong> ${leanBulk} kcal/day</p>
    <p><strong>Cut:</strong> ${cut} kcal/day</p>
    <p><strong>Protein Target:</strong> ${protein}g/day</p>
  `;
});