(function () {
  "use strict";

  const resultEl = document.getElementById("result");
  const expressionEl = document.getElementById("expression");
  const buttonsEl = document.getElementById("buttons");
  const copyBtn = document.getElementById("copyBtn");

  // 상태
  let current = "0";     // 현재 입력 중인 값
  let previous = null;   // 이전 피연산자
  let operator = null;   // 선택된 연산자 (표시용 기호)
  let overwrite = true;  // 다음 숫자 입력 시 current를 덮어쓸지
  let hasError = false;

  const OP_FN = {
    "+": (a, b) => a + b,
    "−": (a, b) => a - b,
    "×": (a, b) => a * b,
    "÷": (a, b) => b === 0 ? null : a / b,
  };

  // 부동소수점 오차 완화 + 지수 표기 방지 정리
  function roundNum(n) {
    if (!isFinite(n)) return null;
    return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
  }

  function formatNum(str) {
    // 표시용: 너무 긴 숫자는 지수/자릿수 제한
    const n = Number(str);
    if (!isFinite(n)) return str;
    if (Math.abs(n) >= 1e15 || (n !== 0 && Math.abs(n) < 1e-10)) {
      return n.toExponential(6).replace(/e/, "E");
    }
    return str;
  }

  function render() {
    resultEl.textContent = formatNum(current);
    if (previous !== null && operator) {
      expressionEl.textContent = `${previous} ${operator} ${overwrite ? "" : current}`.trim();
    } else {
      expressionEl.textContent = "";
    }
  }

  function resetAll() {
    current = "0";
    previous = null;
    operator = null;
    overwrite = true;
    hasError = false;
    render();
  }

  function inputNumber(digit) {
    if (hasError) resetAll();
    if (overwrite) {
      current = digit;
      overwrite = false;
    } else {
      if (current === "0") current = digit;
      else current += digit;
    }
    render();
  }

  function inputDecimal() {
    if (hasError) resetAll();
    if (overwrite) {
      current = "0.";
      overwrite = false;
    } else if (!current.includes(".")) {
      current += ".";
    }
    render();
  }

  function negate() {
    if (hasError || current === "0") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    render();
  }

  function percent() {
    if (hasError) return;
    const val = roundNum(Number(current) / 100);
    current = String(val);
    overwrite = true;
    render();
  }

  function compute() {
    const a = Number(previous);
    const b = Number(current);
    const fn = OP_FN[operator];
    const raw = fn(a, b);
    if (raw === null) {
      showError();
      return null;
    }
    const rounded = roundNum(raw);
    if (rounded === null) {
      showError();
      return null;
    }
    return String(rounded);
  }

  function showError() {
    resultEl.textContent = "오류";
    expressionEl.textContent = "";
    hasError = true;
    // 다음 입력 시 resetAll이 호출됨
  }

  function chooseOperator(op) {
    if (hasError) return;
    // 연쇄 계산: 이미 연산자가 있고 새 숫자를 입력했다면 먼저 계산
    if (operator && !overwrite) {
      const res = compute();
      if (res === null) return;
      previous = res;
      current = res;
    } else {
      previous = current;
    }
    operator = op;
    overwrite = true;
    render();
  }

  function equals() {
    if (hasError || operator === null || previous === null) return;
    const res = compute();
    if (res === null) return;
    expressionEl.textContent = `${previous} ${operator} ${current} =`;
    current = res;
    previous = null;
    operator = null;
    overwrite = true;
    resultEl.textContent = formatNum(current);
  }

  function backspace() {
    if (hasError) { resetAll(); return; }
    if (overwrite) return;
    if (current.length <= 1 || (current.length === 2 && current.startsWith("-"))) {
      current = "0";
      overwrite = true;
    } else {
      current = current.slice(0, -1);
    }
    render();
  }

  // 클릭(이벤트 위임)
  buttonsEl.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    const { action, value } = btn.dataset;
    dispatch(action, value);
  });

  function dispatch(action, value) {
    switch (action) {
      case "number": inputNumber(value); break;
      case "decimal": inputDecimal(); break;
      case "operator": chooseOperator(value); break;
      case "equals": equals(); break;
      case "clear": resetAll(); break;
      case "negate": negate(); break;
      case "percent": percent(); break;
    }
  }

  // 복사
  copyBtn.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(resultEl.textContent);
      copyBtn.textContent = "복사됨!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "복사";
        copyBtn.classList.remove("copied");
      }, 1200);
    } catch (err) {
      copyBtn.textContent = "실패";
      setTimeout(() => (copyBtn.textContent = "복사"), 1200);
    }
  });

  // 키보드 입력
  const KEY_OP = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  window.addEventListener("keydown", function (e) {
    const k = e.key;
    let handledBtn = null;

    if (k >= "0" && k <= "9") {
      inputNumber(k);
      handledBtn = buttonsEl.querySelector(`[data-action="number"][data-value="${k}"]`);
    } else if (k === ".") {
      inputDecimal();
      handledBtn = buttonsEl.querySelector('[data-action="decimal"]');
    } else if (KEY_OP[k]) {
      chooseOperator(KEY_OP[k]);
      handledBtn = buttonsEl.querySelector(`[data-action="operator"][data-value="${KEY_OP[k]}"]`);
    } else if (k === "Enter" || k === "=") {
      e.preventDefault();
      equals();
      handledBtn = buttonsEl.querySelector('[data-action="equals"]');
    } else if (k === "Backspace") {
      backspace();
    } else if (k === "Escape") {
      resetAll();
      handledBtn = buttonsEl.querySelector('[data-action="clear"]');
    } else if (k === "%") {
      percent();
      handledBtn = buttonsEl.querySelector('[data-action="percent"]');
    } else {
      return;
    }

    // 눌림 피드백
    if (handledBtn) {
      handledBtn.classList.add("pressed");
      setTimeout(() => handledBtn.classList.remove("pressed"), 100);
    }
  });

  // 초기 렌더
  render();
})();
