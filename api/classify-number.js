const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

function isPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function isPerfect(n) {
  const divisors = [];
  for (let i = 1; i < n; i++) {
    if (n % i === 0) divisors.push(i);
  }
  return divisors.reduce((sum, num) => sum + num, 0) === n;
}

function isArmstrong(n) {
  const digits = n.toString().split("").map(Number);
  const power = digits.length;
  return digits.reduce((sum, digit) => sum + Math.pow(digit, power), 0) === n;
}

function digitSum(n) {
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

// API route
app.get("/api/classify-number", async (req, res) => {
  const number = parseInt(req.query.number);

  if (/^[a-zA-Z]+$/.test(number)) {
    return res.status(400).json({
      number: "alphabet",
      error: true,
    });
  }

  if (number < 0) {
    return res.status(400).json({
      number: number,
      error: true,
    });
  }

  const properties = [];

  // Check for Armstrong
  if (isArmstrong(number)) {
    properties.push("armstrong");
  }

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
