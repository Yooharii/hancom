// ── 말랑 계산기 로직 ──
(function () {
  "use strict";

  const resultEl = document.getElementById("result");
  const exprEl = document.getElementById("expr");
  const historyList = document.getElementById("historyList");
  const historyEmpty = document.getElementById("historyEmpty");
  const historyToggle = document.getElementById("historyToggle");
  const historySection = document.querySelector(".history");

  const OP_SIGN = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  let current = "0";        // 지금 입력 중인 숫자(문자열)
  let previous = null;      // 직전 피연산자(숫자)
  let operator = null;      // 대기 중인 연산자
  let hasTyped = false;     // 현재 피연산자에 입력이 있었는지
  let justEvaluated = false;
  let isError = false;

  // ── 숫자 표시 (천단위 콤마) ──
  function formatNumber(numStr) {
    if (numStr === "" || numStr === "-") return numStr;
    const neg = numStr.startsWith("-");
    const body = neg ? numStr.slice(1) : numStr;
    const [intPart, decPart] = body.split(".");
    const cleanInt = intPart.replace(/^0+(?=\d)/, "");
    const withComma = Number(cleanInt || "0").toLocaleString("en-US");
    let out = withComma;
    if (decPart !== undefined) out += "." + decPart;
    else if (body.endsWith(".")) out += ".";
    return (neg ? "−" : "") + out;
  }

  function render() {
    if (isError) return;
    resultEl.classList.remove("is-error");
    resultEl.textContent = formatNumber(current);
    if (operator && previous !== null) {
      exprEl.textContent = `${formatNumber(String(previous))} ${OP_SIGN[operator]}`;
    } else {
      exprEl.innerHTML = "&nbsp;";
    }
  }

  function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    hasTyped = false;
    justEvaluated = false;
    isError = false;
    render();
  }

  function showError(msg) {
    isError = true;
    resultEl.classList.add("is-error");
    resultEl.textContent = msg;
    exprEl.innerHTML = "&nbsp;";
    current = "0";
    previous = null;
    operator = null;
    hasTyped = false;
    justEvaluated = false;
  }

  function tidy(n) {
    return parseFloat(n.toPrecision(12));
  }

  function compute(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? null : a / b;
      default: return b;
    }
  }

  // ── 입력 ──
  function inputDigit(d) {
    if (isError) clearAll();
    if (justEvaluated && operator === null) { current = "0"; justEvaluated = false; }
    current = current === "0" ? d : current + d;
    hasTyped = true;
    render();
  }

  function inputDecimal() {
    if (isError) clearAll();
    if (justEvaluated && operator === null) { current = "0"; justEvaluated = false; }
    if (!current.includes(".")) current += ".";
    hasTyped = true;
    render();
  }

  function chooseOperator(op) {
    if (isError) clearAll();

    // 피연산자 입력 없이 연산자만 다시 누르면 → 연산자 교체
    if (operator && !hasTyped && previous !== null) {
      operator = op;
      render();
      return;
    }

    if (previous === null) {
      previous = parseFloat(current);
    } else if (operator && hasTyped) {
      const res = compute(previous, parseFloat(current), operator);
      if (res === null) { showError("0으로 나눌 수 없어요"); return; }
      previous = tidy(res);
      resultEl.textContent = formatNumber(String(previous));
    }
    operator = op;
    current = "0";
    hasTyped = false;
    justEvaluated = false;
    render();
  }

  function equals() {
    if (isError) { clearAll(); return; }
    if (operator === null || previous === null) return;
    const b = parseFloat(current);
    const res = compute(previous, b, operator);
    if (res === null) { showError("0으로 나눌 수 없어요"); return; }
    const value = tidy(res);
    const exprText = `${formatNumber(String(previous))} ${OP_SIGN[operator]} ${formatNumber(String(b))}`;
    addHistory(exprText, formatNumber(String(value)), String(value));

    current = String(value);
    exprEl.textContent = exprText + " =";
    resultEl.classList.remove("is-error");
    resultEl.textContent = formatNumber(current);
    previous = null;
    operator = null;
    hasTyped = false;
    justEvaluated = true;
  }

  function negate() {
    if (isError || current === "0") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    render();
  }

  function percent() {
    if (isError) return;
    current = String(tidy(parseFloat(current) / 100));
    hasTyped = true;
    render();
  }

  function backspace() {
    if (isError || justEvaluated) { clearAll(); return; }
    if (current.length <= 1 || (current.length === 2 && current.startsWith("-"))) {
      current = "0";
    } else {
      current = current.slice(0, -1);
    }
    render();
  }

  // ── 히스토리 ──
  function addHistory(exprText, resultDisplay, rawResult) {
    if (historyEmpty && historyEmpty.parentNode) historyEmpty.remove();
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "history__item";
    btn.innerHTML = `<span class="h-expr"></span><span class="h-res"></span>`;
    btn.querySelector(".h-expr").textContent = exprText;
    btn.querySelector(".h-res").textContent = resultDisplay;
    btn.addEventListener("click", function () {
      clearAll();
      current = rawResult;
      justEvaluated = true;
      render();
    });
    li.appendChild(btn);
    historyList.prepend(li);
  }

  // ── 버튼 클릭 ──
  document.querySelector(".keypad").addEventListener("click", function (e) {
    const key = e.target.closest(".key");
    if (!key) return;
    if (key.dataset.num !== undefined) inputDigit(key.dataset.num);
    else if (key.dataset.op !== undefined) chooseOperator(key.dataset.op);
    else {
      switch (key.dataset.action) {
        case "clear": clearAll(); break;
        case "negate": negate(); break;
        case "percent": percent(); break;
        case "decimal": inputDecimal(); break;
        case "equals": equals(); break;
      }
    }
  });

  // ── 히스토리 토글 ──
  historyToggle.addEventListener("click", function () {
    const collapsed = historySection.classList.toggle("is-collapsed");
    historyToggle.setAttribute("aria-expanded", String(!collapsed));
  });

  // ── 키보드 입력 ──
  const actionByKey = {
    "+": () => chooseOperator("+"),
    "-": () => chooseOperator("-"),
    "*": () => chooseOperator("*"),
    "/": () => chooseOperator("/"),
    "%": () => percent(),
    "Enter": () => equals(),
    "=": () => equals(),
    "Escape": () => clearAll(),
    "Backspace": () => backspace(),
    ".": () => inputDecimal(),
  };
  const selByKey = {
    "+": '[data-op="+"]', "-": '[data-op="-"]', "*": '[data-op="*"]', "/": '[data-op="/"]',
    "Enter": '[data-action="equals"]', "=": '[data-action="equals"]',
    "Escape": '[data-action="clear"]', "Backspace": '[data-action="clear"]',
    ".": '[data-action="decimal"]', "%": '[data-action="percent"]',
  };

  window.addEventListener("keydown", function (e) {
    if (e.key >= "0" && e.key <= "9") {
      inputDigit(e.key);
      flash(`[data-num="${e.key}"]`);
      return;
    }
    if (actionByKey[e.key]) {
      if (e.key === "Enter" || e.key === "/") e.preventDefault();
      actionByKey[e.key]();
      if (selByKey[e.key]) flash(selByKey[e.key]);
    }
  });

  // 키보드 입력 시 해당 버튼도 눌린 느낌
  function flash(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add("is-press");
    setTimeout(() => el.classList.remove("is-press"), 110);
  }

  render();
})();
