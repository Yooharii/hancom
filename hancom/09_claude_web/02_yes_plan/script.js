(function () {
  "use strict";

  const currentEl = document.getElementById("current");
  const historyEl = document.getElementById("history");
  const buttonsEl = document.querySelector(".buttons");

  // 상태
  let current = "0";      // 현재 입력 중인 값(문자열)
  let previous = null;    // 이전 확정 값(숫자)
  let operator = null;    // 선택된 연산자
  let resetNext = false;  // 다음 숫자 입력 시 current 초기화 여부
  let errored = false;    // 오류 상태

  const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  function updateDisplay() {
    currentEl.textContent = current;
    if (operator !== null && previous !== null) {
      historyEl.textContent = formatNumber(previous) + " " + OP_SYMBOL[operator];
    } else {
      historyEl.textContent = "";
    }
  }

  // 긴 숫자 포맷: 오버플로 방지
  function formatNumber(n) {
    if (!isFinite(n)) return "Error";
    if (Number.isInteger(n) && Math.abs(n) < 1e16) return String(n);
    // 유효숫자 제한 후 불필요한 0 제거
    let s = n.toPrecision(12);
    if (s.indexOf("e") === -1) {
      s = parseFloat(s).toString();
    }
    if (s.length > 14) s = n.toExponential(6);
    return s;
  }

  function compute(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
    }
    return b;
  }

  function setError() {
    current = "Error";
    previous = null;
    operator = null;
    resetNext = true;
    errored = true;
    updateDisplay();
  }

  function inputNumber(digit) {
    if (errored) clearAll();
    if (resetNext) {
      current = "0";
      resetNext = false;
    }
    if (current === "0") {
      current = digit;
    } else {
      if (current.replace("-", "").length >= 15) return; // 자릿수 제한
      current += digit;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (errored) clearAll();
    if (resetNext) {
      current = "0";
      resetNext = false;
    }
    if (current.indexOf(".") === -1) {
      current += ".";
    }
    updateDisplay();
  }

  function chooseOperator(nextOp) {
    if (errored) return;
    const inputVal = parseFloat(current);

    if (operator !== null && !resetNext && previous !== null) {
      // 연속 연산: 중간 결과 계산
      const result = compute(previous, inputVal, operator);
      if (!isFinite(result)) return setError();
      previous = result;
      current = formatNumber(result);
    } else {
      previous = inputVal;
    }

    operator = nextOp;
    resetNext = true;
    updateDisplay();
  }

  function equals() {
    if (errored || operator === null || previous === null) return;
    const inputVal = parseFloat(current);
    const result = compute(previous, inputVal, operator);
    if (!isFinite(result)) return setError();
    current = formatNumber(result);
    previous = null;
    operator = null;
    resetNext = true;
    updateDisplay();
  }

  function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    errored = false;
    updateDisplay();
  }

  function negate() {
    if (errored) return;
    if (current === "0" || current === "Error") return;
    current = current.charAt(0) === "-" ? current.slice(1) : "-" + current;
    updateDisplay();
  }

  function percent() {
    if (errored) return;
    const val = parseFloat(current) / 100;
    current = formatNumber(val);
    resetNext = true;
    updateDisplay();
  }

  // 클릭 처리
  buttonsEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.dataset.num !== undefined) {
      inputNumber(btn.dataset.num);
      return;
    }

    switch (btn.dataset.action) {
      case "decimal": inputDecimal(); break;
      case "operator": chooseOperator(btn.dataset.op); break;
      case "equals": equals(); break;
      case "clear": clearAll(); break;
      case "negate": negate(); break;
      case "percent": percent(); break;
    }
    highlightOperator();
  });

  // 활성 연산자 버튼 강조
  function highlightOperator() {
    document.querySelectorAll(".btn-op").forEach(function (b) {
      b.classList.toggle("active", operator !== null && b.dataset.op === operator && resetNext);
    });
  }

  // 키보드 지원
  document.addEventListener("keydown", function (e) {
    const key = e.key;
    if (key >= "0" && key <= "9") {
      inputNumber(key);
    } else if (key === ".") {
      inputDecimal();
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
      e.preventDefault();
      equals();
    } else if (key === "Escape") {
      clearAll();
    } else if (key === "Backspace") {
      if (!errored && !resetNext && current !== "0") {
        current = current.length > 1 ? current.slice(0, -1) : "0";
        if (current === "-" || current === "") current = "0";
        updateDisplay();
      }
    } else if (key === "%") {
      percent();
    } else {
      return;
    }
    highlightOperator();
  });

  updateDisplay();
})();
