const API_KEY = CONFIG.API_KEY;
const API_URL = `https://api.currencyfreaks.com/latest?apikey=${API_KEY}`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Set flag based on country code
const updateFlag = (element) => {
  let currencyCode = element.value;
  let countryCode = countryList[currencyCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Fetch exchange rates and update message
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const fromRate = parseFloat(data.rates[from]);
    const toRate = parseFloat(data.rates[to]);

    if (!fromRate || !toRate) {
      msg.innerText = "Currency not supported.";
      return;
    }

    const converted = ((toRate / fromRate) * amtVal).toFixed(2);
    msg.innerText = `${amtVal} ${from} = ${converted} ${to}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error("Error:", error);
  }
};

// Button click event
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Auto fetch on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
