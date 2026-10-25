const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");
const strengthMeter = document.getElementById("strengthMeter");
const securityTips = document.getElementById("securityTips");

const requirements = {
  reqLength: password => password.length >= 12,
  reqLower: password => /[a-z]/.test(password),
  reqUpper: password => /[A-Z]/.test(password),
  reqNumber: password => /[0-9]/.test(password),
  reqSymbol: password => /[^A-Za-z0-9]/.test(password)
};

function updateChecklist(password) {
  let passed = 0;

  for (const [id, test] of Object.entries(requirements)) {
    const item = document.getElementById(id);
    const met = test(password);
    const icon = item.querySelector(".check");

    item.classList.toggle("met", met);
    icon.textContent = met ? "✓" : "○";

    if (met) passed++;
  }

  return passed;
}

function getTips(password, passed) {
  const tips = [];

  if (password.length < 12) {
    tips.push("Aim for at least 12 characters; longer passphrases are often better.");
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    tips.push("Use a mix of uppercase and lowercase letters.");
  }

  if (!/[0-9]/.test(password)) {
    tips.push("Consider including a number.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    tips.push("Consider including a special character.");
  }

  if (/(.)\1{2,}/.test(password)) {
    tips.push("Avoid repeating the same character several times.");
  }

  if (/password|123456|qwerty|admin|letmein/i.test(password)) {
    tips.push("Avoid common words and predictable patterns.");
  }

  if (/(harsh|admin|welcome|india|love|birth|200[0-9]|201[0-9])/i.test(password)) {
    tips.push("Avoid names, personal information and predictable dates.");
  }

  if (passed === 5) {
    tips.push("All five basic checks passed. Use this password for only one account.");
  }

  if (tips.length === 0) {
    tips.push("Keep using unique passwords for different accounts.");
  }

  tips.push("Use a password manager and enable two-factor authentication where possible.");

  return tips;
}

function renderTips(tips) {
  securityTips.replaceChildren();

  tips.forEach(tip => {
    const item = document.createElement("li");
    item.textContent = tip;
    securityTips.appendChild(item);
  });
}

function checkPassword() {
  const password = passwordInput.value;

  if (!password) {
    strengthText.textContent = "Not checked";
    strengthText.style.color = "";
    strengthBar.style.width = "0%";
    strengthBar.style.background = "#2563eb";
    strengthMeter.setAttribute("aria-valuenow", "0");

    updateChecklist("");
    renderTips([
      "Use a long, unique password for each account.",
      "Never share passwords or use personal details.",
      "Enable two-factor authentication when available."
    ]);
    return;
  }

  const passed = updateChecklist(password);
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const commonPattern =
    /password|123456|12345678|qwerty|admin|letmein|welcome/i.test(password) ||
    /(.)\1{2,}/.test(password);

  if (commonPattern) {
    score = Math.min(score, 2);
  }

  let label;
  let color;
  let percentage;

  if (password.length < 8 || score <= 2) {
    label = "Weak";
    color = "#dc2626";
    percentage = 25;
  } else if (score <= 4) {
    label = "Medium";
    color = "#d97706";
    percentage = 55;
  } else if (score <= 6) {
    label = "Strong";
    color = "#2563eb";
    percentage = 80;
  } else {
    label = "Very Strong";
    color = "#15803d";
    percentage = 100;
  }

  strengthText.textContent = label;
  strengthText.style.color = color;
  strengthBar.style.width = percentage + "%";
  strengthBar.style.background = color;
  strengthMeter.setAttribute("aria-valuenow", String(percentage));

  renderTips(getTips(password, passed));
}

toggleButton.addEventListener("click", () => {
  const showing = passwordInput.type === "password";

  passwordInput.type = showing ? "text" : "password";
  toggleButton.textContent = showing ? "Hide" : "Show";
  toggleButton.setAttribute("aria-label", showing ? "Hide password" : "Show password");
  toggleButton.setAttribute("aria-pressed", String(showing));
});

passwordInput.addEventListener("input", checkPassword);

// All checks run locally. No password is uploaded or stored by this code.
checkPassword();