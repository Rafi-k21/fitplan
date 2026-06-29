const nutritionForm = document.getElementById("nutritionForm");
const nutritionResult = document.getElementById("nutritionResult");

nutritionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = Number(document.getElementById("weight").value);
  const goal = document.getElementById("goal").value;

  const maintenance = Math.round(weight * 33);
  const protein = Math.round(weight * 2);
  const fats = Math.round(weight * 1);
  const water = Math.round(weight * 0.04 * 10) / 10;

  let selectedCalories = maintenance;
  let goalText = "Maintain";

  if (goal === "bulk") {
    selectedCalories = maintenance + 250;
    goalText = "Lean Bulk";
  } else if (goal === "cut") {
    selectedCalories = maintenance - 400;
    goalText = "Cut";
  }

  const proteinCalories = protein * 4;
  const fatCalories = fats * 9;
  const carbCalories = selectedCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  const mealCalories = Math.round(selectedCalories / 4);
  const mealProtein = Math.round(protein / 4);

  <div class="meal-box">
  <h4>Nutrition Freedom 💡</h4>
  <p>
    Focus on hitting your daily calorie and protein targets.
    You can split your food into 2, 3, 4, or more meals depending
    on your lifestyle, appetite, and schedule.
  </p>
</div>
});