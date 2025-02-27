const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// Helper Functions

function isPrime(n) {
  if (n < 0) return false;
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

const isPerfect = (n) => {
  if (n < 2) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }

  return sum === n;
};

function isArmstrong(n) {
  if (n < 0) return false;
  const digits = n.toString().split("").map(Number);
  const power = digits.length;
  return digits.reduce((sum, digit) => sum + Math.pow(digit, power), 0) === n;
}

function digitSum(n) {
  if (n < 0) {
    n = Math.abs(n); // Take absolute value for digit sum calculation
    return -n
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  // Handle positive integers as usual
  return n
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit), 0);
}

async function getFunFact(n) {
  const url = `http://numbersapi.com/${n}/math?json=true`;
  try {
    const response = await axios.get(url);
    return response.data.text || `No fun fact available for ${n}`;
  } catch (error) {
    return `Error fetching fun fact for ${n}`;
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the number generator API",
  });
});

// API Route

app.get("/api/classify-number", async (req, res) => {
  const numberParam = req.query.number;

  if (!numberParam || numberParam.trim() === "") {
    return res.status(400).json({
      number: null,
      error: true,
    });
  }
  // Check if 'number' is an alphabetic string (invalid input)
  if (/^[a-zA-Z]+$/.test(numberParam)) {
    return res.status(400).json({
      number: numberParam,
      error: true,
    });
  }

  if (numberParam.includes(".")) {
    return res.status(400).json({
      number: numberParam,
      error: true,
    });
  }

  if (isNaN(numberParam)) {
    return res.status(400).json({
      number: numberParam,
      error: true,
    });
  }

  const number = Number(numberParam);

  const properties = [];

  // Check for Armstrong
  if (isArmstrong(number)) {
    properties.push("armstrong");
  }

  // Check for prime
  // if (isPrime(number)) {
  //   // properties.push("prime");
  // }

  // // Check for perfect number
  // if (isPerfect(number)) {
  //   // properties.push("perfect");
  // }

  // Check for even/odd
  if (number % 2 === 0) {
    properties.push("even");
  } else {
    properties.push("odd");
  }

  // Prepare the response
  const responseData = {
    number: number,
    is_prime: isPrime(number),
    is_perfect: isPerfect(number),
    properties: properties,
    digit_sum: digitSum(number),
  };

  // Fetch fun fact from Numbers API
  const funFact = await getFunFact(number);
  responseData.fun_fact = funFact;

  return res.status(200).json(responseData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
