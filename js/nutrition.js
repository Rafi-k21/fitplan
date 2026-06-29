const nutritionForm = document.getElementById("nutritionForm");
const nutritionResult = document.getElementById("nutritionResult");

nutritionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = Number(document.getElementById("weight").value);
  const goal = document.getElementById("goal").value;

  if (!weight || !goal) {
    nutritionResult.innerHTML = `<p class="empty">Please enter your weight and select a goal.</p>`;
    return;
  }

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
  const carbs = Math.max(0, Math.round(carbCalories / 4));

  nutritionResult.innerHTML = `
    <h3>Your Daily Nutrition Targets</h3>

    <div class="nutrition-grid">
      <div class="nutrition-box">
        <span>Goal</span>
        <strong>${goalText}</strong>
      </div>

      <div class="nutrition-box">
        <span>Calories</span>
        <strong>${selectedCalories} kcal</strong>
      </div>

      <div class="nutrition-box">
        <span>Protein</span>
        <strong>${protein}g</strong>
      </div>

      <div class="nutrition-box">
        <span>Carbs</span>
        <strong>${carbs}g</strong>
      </div>

      <div class="nutrition-box">
        <span>Fats</span>
        <strong>${fats}g</strong>
      </div>

      <div class="nutrition-box">
        <span>Water</span>
        <strong>${water}L</strong>
      </div>
    </div>

    <div class="meal-box">
      <h4>Nutrition Freedom 💡</h4>
      <p>
        Focus on reaching your daily calorie and protein targets.
        You can split your food into 2, 3, 4, or more meals depending
        on your lifestyle, appetite, and schedule.
      </p>
    </div>
  `;
});