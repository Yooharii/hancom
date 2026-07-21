/* ============================================================
   Mistral Calculator — vanilla JS logic
   ============================================================ */
(function () {
  'use strict';

  // ---- State -------------------------------------------------
  var currentInput = '0';   // string shown / being typed
  var previousInput = null; // stored operand (number) for pending op
  var operator = null;      // '+', '-', '*', '/'
  var resetNext = false;    // true right after an op or '=' → next digit starts fresh
  var history = [];         // array of { expr, value }

  var OP_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  // ---- DOM ---------------------------------------------------
  var exprEl = document.getElementById('calcExpr');
  var resultEl = document.getElementById('calcResult');
  var keysEl = document.getElementById('calcKeys');
  var historyListEl = document.getElementById('historyList');
  var clearHistoryBtn = document.getElementById('clearHistory');

  // ---- Helpers -----------------------------------------------
  function roundResult(n) {
    if (!isFinite(n)) return n;
    // Trim floating-point noise (e.g. 0.1 + 0.2) without losing precision.
    return parseFloat(n.toPrecision(12));
  }

  function groupThousands(numStr) {
    if (numStr === 'Error') return numStr;
    // Don't touch scientific notation.
    if (numStr.indexOf('e') !== -1 || numStr.indexOf('E') !== -1) return numStr;
    var neg = numStr.charAt(0) === '-';
    if (neg) numStr = numStr.slice(1);
    var parts = numStr.split('.');
    // Comma every 3 digits in the integer part; decimal part left untouched.
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + parts.join('.');
  }

  function formatNumber(value) {
    if (value === 'Error') return 'Error';
    var n = typeof value === 'number' ? value : parseFloat(value);
    if (!isFinite(n)) return 'Error';
    // Keep the raw typed string (handles trailing '.' and leading zeros while typing).
    var raw = typeof value === 'string' ? value : String(n);
    return groupThousands(raw);
  }

  function compute(a, op, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 'Error' : a / b;
      default: return b;
    }
  }

  // ---- Display -----------------------------------------------
  function updateDisplay() {
    resultEl.textContent = formatNumber(currentInput);
    if (operator !== null && previousInput !== null) {
      exprEl.textContent = formatNumber(previousInput) + ' ' + OP_SYMBOL[operator];
    } else {
      exprEl.innerHTML = '&nbsp;';
    }
    highlightActiveOp();
  }

  function highlightActiveOp() {
    var opButtons = keysEl.querySelectorAll('.calc-btn--op');
    opButtons.forEach(function (btn) {
      // Highlight only while waiting for the second operand.
      var isActive = resetNext && operator === btn.getAttribute('data-op');
      btn.classList.toggle('is-active', isActive);
    });
  }

  // ---- Actions -----------------------------------------------
  function inputDigit(d) {
    if (currentInput === 'Error') currentInput = '0';
    if (resetNext) {
      currentInput = d;
      resetNext = false;
    } else {
      currentInput = currentInput === '0' ? d : currentInput + d;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (currentInput === 'Error') currentInput = '0';
    if (resetNext) {
      currentInput = '0.';
      resetNext = false;
    } else if (currentInput.indexOf('.') === -1) {
      currentInput += '.';
    }
    updateDisplay();
  }

  function chooseOperator(nextOp) {
    if (currentInput === 'Error') return;
    var inputValue = parseFloat(currentInput);

    if (previousInput !== null && operator && !resetNext) {
      // Chain: evaluate the pending operation first.
      var result = compute(previousInput, operator, inputValue);
      if (result === 'Error') { showError(); return; }
      result = roundResult(result);
      previousInput = result;
      currentInput = String(result);
    } else if (previousInput === null) {
      previousInput = inputValue;
    }

    operator = nextOp;
    resetNext = true;
    updateDisplay();
  }

  function equals() {
    if (operator === null || previousInput === null || currentInput === 'Error') return;
    var b = parseFloat(currentInput);
    var exprText = formatNumber(previousInput) + ' ' + OP_SYMBOL[operator] + ' ' + groupThousands(String(b));
    var result = compute(previousInput, operator, b);

    if (result === 'Error') { showError(); return; }
    result = roundResult(result);

    addHistory(exprText, result);

    currentInput = String(result);
    previousInput = null;
    operator = null;
    resetNext = true;
    exprEl.textContent = exprText + ' =';
    resultEl.textContent = formatNumber(currentInput);
    highlightActiveOp();
  }

  function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    resetNext = false;
    updateDisplay();
  }

  function negate() {
    if (currentInput === 'Error' || currentInput === '0') return;
    currentInput = currentInput.charAt(0) === '-'
      ? currentInput.slice(1)
      : '-' + currentInput;
    updateDisplay();
  }

  function percent() {
    if (currentInput === 'Error') return;
    var n = parseFloat(currentInput);
    currentInput = String(roundResult(n / 100));
    resetNext = false;
    updateDisplay();
  }

  function backspace() {
    if (currentInput === 'Error') { currentInput = '0'; updateDisplay(); return; }
    if (resetNext) return;
    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.charAt(0) === '-')) {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }

  function showError() {
    currentInput = 'Error';
    previousInput = null;
    operator = null;
    resetNext = true;
    updateDisplay();
  }

  // ---- History -----------------------------------------------
  function addHistory(expr, value) {
    history.unshift({ expr: expr, value: value });
    if (history.length > 30) history.pop();
    renderHistory();
  }

  function renderHistory() {
    historyListEl.innerHTML = '';
    if (history.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'history-empty';
      empty.textContent = 'Your calculations will appear here.';
      historyListEl.appendChild(empty);
      return;
    }
    history.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'history-item';
      li.setAttribute('data-value', item.value);

      var expr = document.createElement('div');
      expr.className = 'history-expr';
      expr.textContent = item.expr + ' =';

      var val = document.createElement('div');
      val.className = 'history-value';
      val.textContent = groupThousands(String(item.value));

      li.appendChild(expr);
      li.appendChild(val);
      historyListEl.appendChild(li);
    });
  }

  function clearHistory() {
    history = [];
    renderHistory();
  }

  // ---- Events (delegation) -----------------------------------
  keysEl.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;

    if (btn.hasAttribute('data-digit')) { inputDigit(btn.getAttribute('data-digit')); return; }
    if (btn.hasAttribute('data-op')) { chooseOperator(btn.getAttribute('data-op')); return; }

    switch (btn.getAttribute('data-action')) {
      case 'decimal': inputDecimal(); break;
      case 'equals': equals(); break;
      case 'clear': clearAll(); break;
      case 'negate': negate(); break;
      case 'percent': percent(); break;
    }
  });

  clearHistoryBtn.addEventListener('click', clearHistory);

  // Reuse a history value by clicking it.
  historyListEl.addEventListener('click', function (e) {
    var item = e.target.closest('.history-item');
    if (!item) return;
    currentInput = item.getAttribute('data-value');
    previousInput = null;
    operator = null;
    resetNext = true;
    updateDisplay();
  });

  // ---- Keyboard ----------------------------------------------
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k >= '0' && k <= '9') { inputDigit(k); return; }
    if (k === '.') { inputDecimal(); return; }
    if (k === '+' || k === '-' || k === '*' || k === '/') { chooseOperator(k); return; }
    if (k === 'Enter' || k === '=') { e.preventDefault(); equals(); return; }
    if (k === 'Escape') { clearAll(); return; }
    if (k === 'Backspace') { backspace(); return; }
    if (k === '%') { percent(); return; }
  });

  // ---- Init --------------------------------------------------
  updateDisplay();
  renderHistory();
})();
