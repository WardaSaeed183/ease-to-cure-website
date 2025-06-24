document.getElementById('bmiForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const heightCm = parseFloat(document.getElementById('heightCm').value);
  const weightKg = parseFloat(document.getElementById('weightKg').value);

  const result = document.getElementById('result');
  const bmiCategory = document.getElementById('bmiCategory');
  const advice = document.getElementById('advice');
  const bmiResultSection = document.getElementById('bmiResult');

  bmiResultSection.style.display = 'none';
  result.textContent = '';
  bmiCategory.textContent = '';
  advice.textContent = '';

  if (!age || age < 1 || age > 120) {
    alert('Please enter a valid age between 1 and 120.');
    return;
  }
  if (!gender) {
    alert('Please select your gender.');
    return;
  }
  if (!heightCm || heightCm < 30 || heightCm > 300) {
    alert('Please enter a valid height in cm (30 - 300).');
    return;
  }
  if (!weightKg || weightKg < 2 || weightKg > 500) {
    alert('Please enter a valid weight in kg (2 - 500).');
    return;
  }

  const heightMeters = heightCm / 100;
  const bmi = weightKg / (heightMeters * heightMeters);

  result.textContent = `Your BMI is: ${bmi.toFixed(2)}`;

  let category = '';
  let adviceText = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    adviceText = 'You are underweight. Consider a nutritious diet and consult a healthcare professional if needed.';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal Weight';
    adviceText = 'Great! Maintain your weight with a balanced diet and regular exercise.';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    adviceText = 'You are overweight. Increasing physical activity and watching your diet can help.';
  } else {
    category = 'Obesity';
    adviceText = 'Obesity detected. It is advisable to consult healthcare professionals for proper guidance.';
  }

  bmiCategory.textContent = category;
  advice.textContent = adviceText;

  let ageAdvice = '';
  if (age < 18) {
    ageAdvice = 'You are still growing, so BMI is just an estimate. Focus on healthy habits.';
  } else if (age >= 65) {
    ageAdvice = 'As an elderly person, regular health check-ups and balanced nutrition are important.';
  } else {
    ageAdvice = 'Maintain a healthy lifestyle with a balanced diet and regular exercise.';
  }

  advice.textContent += '\\n' + ageAdvice;
  bmiResultSection.style.display = 'block';
});
