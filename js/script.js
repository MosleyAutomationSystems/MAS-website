/*
  MOSLEY AUTOMATION SYSTEMS — site script
  Why: every interactive control here has to work by keyboard alone and
  announce state changes to assistive tech (Mosley Standard, Pillar III).
  No framework — this is a static 5-page-class site, a build step is not
  justified by the complexity of what's here.
*/
(function () {
  "use strict";

  var STORAGE_KEY = "mas-a11y-prefs-v1";

  // Why: word-spacing presets live here once, not scattered across click handlers —
  // matches the config.py single-source-of-truth pattern from the toolkit side of MAS.
  var WORD_SPACING_VALUES = { normal: "0.02em", wide: "0.16em", wider: "0.24em" };

  /* ---------- Persisted preference state ---------- */
  function loadPrefs() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      // Why: private browsing / storage-blocked contexts throw on access,
      // not just on read — fail open with in-memory defaults instead of breaking the page.
      return {};
    }
  }
  function savePrefs(prefs) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (e) { /* storage unavailable — non-fatal */ }
  }

  var prefs = loadPrefs();
  var body = document.body;
  var announceEl = document.getElementById("a11yAnnounce");

  function announce(msg) {
    if (announceEl) { announceEl.textContent = msg; }
  }

  /* ---------- Apply stored prefs on load ---------- */
  function applyAll() {
    if (prefs.theme) { body.setAttribute("data-theme", prefs.theme); }
    if (prefs.fontsize) { body.setAttribute("data-fontsize", prefs.fontsize); }
    if (prefs.dyslexia) { body.setAttribute("data-dyslexia", "on"); }
    if (prefs.motion) { body.setAttribute("data-motion", "reduce"); }
    if (prefs.targets) { body.setAttribute("data-targets", "large"); }

    var wordSpacingKey = prefs.wordSpacing || "normal";
    document.documentElement.style.setProperty("--u-word-spacing", WORD_SPACING_VALUES[wordSpacingKey] || WORD_SPACING_VALUES.normal);

    var lineHeightVal = typeof prefs.lineHeight === "number" ? prefs.lineHeight : 1.6;
    document.documentElement.style.setProperty("--u-line-height", String(lineHeightVal));
    var lhInput = document.getElementById("lineHeightSlider");
    var lhOut = document.getElementById("lineHeightVal");
    if (lhInput) { lhInput.value = String(lineHeightVal); }
    if (lhOut) { lhOut.textContent = lineHeightVal.toFixed(1); }

    var letterSpacingVal = typeof prefs.letterSpacing === "number" ? prefs.letterSpacing : 0;
    document.documentElement.style.setProperty("--u-letter-spacing", letterSpacingVal + "em");
    var lsInput = document.getElementById("letterSpacingSlider");
    var lsOut = document.getElementById("letterSpacingVal");
    if (lsInput) { lsInput.value = String(letterSpacingVal); }
    if (lsOut) { lsOut.textContent = letterSpacingVal.toFixed(2) + "em"; }

    syncButtonStates();
  }

  function syncButtonStates() {
    document.querySelectorAll("[data-theme]").forEach(function (btn) {
      var isActive = (prefs.theme || "dark") === btn.getAttribute("data-theme");
      btn.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelectorAll("[data-fontsize]").forEach(function (btn) {
      var isActive = (prefs.fontsize || "normal") === btn.getAttribute("data-fontsize");
      btn.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelectorAll("[data-wordspacing]").forEach(function (btn) {
      var isActive = (prefs.wordSpacing || "normal") === btn.getAttribute("data-wordspacing");
      btn.setAttribute("aria-pressed", String(isActive));
    });
    var dys = document.getElementById("dyslexiaToggle");
    if (dys) { dys.setAttribute("aria-pressed", String(!!prefs.dyslexia)); }
    var mot = document.getElementById("motionToggle");
    if (mot) { mot.setAttribute("aria-pressed", String(!!prefs.motion)); }
    var tgt = document.getElementById("largeTargetsToggle");
    if (tgt) { tgt.setAttribute("aria-pressed", String(!!prefs.targets)); }
  }

  /* ---------- Theme buttons ---------- */
  document.querySelectorAll("[data-theme]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-theme");
      prefs.theme = val;
      body.setAttribute("data-theme", val);
      savePrefs(prefs);
      syncButtonStates();
      announce("Theme set to " + btn.textContent.trim());
    });
  });

  /* ---------- Font size buttons ---------- */
  document.querySelectorAll("[data-fontsize]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-fontsize");
      prefs.fontsize = val;
      body.setAttribute("data-fontsize", val);
      savePrefs(prefs);
      syncButtonStates();
      announce("Text size updated");
    });
  });

  /* ---------- Word spacing buttons ---------- */
  document.querySelectorAll("[data-wordspacing]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-wordspacing");
      prefs.wordSpacing = val;
      document.documentElement.style.setProperty("--u-word-spacing", WORD_SPACING_VALUES[val] || WORD_SPACING_VALUES.normal);
      savePrefs(prefs);
      syncButtonStates();
      announce("Word spacing set to " + btn.textContent.trim());
    });
  });

  /* ---------- Line height slider ---------- */
  var lineHeightSlider = document.getElementById("lineHeightSlider");
  var lineHeightVal = document.getElementById("lineHeightVal");
  if (lineHeightSlider) {
    lineHeightSlider.addEventListener("input", function () {
      var val = parseFloat(lineHeightSlider.value);
      document.documentElement.style.setProperty("--u-line-height", String(val));
      if (lineHeightVal) { lineHeightVal.textContent = val.toFixed(1); }
    });
    lineHeightSlider.addEventListener("change", function () {
      var val = parseFloat(lineHeightSlider.value);
      prefs.lineHeight = val;
      savePrefs(prefs);
      announce("Line height set to " + val.toFixed(1));
    });
  }

  /* ---------- Letter spacing slider ---------- */
  var letterSpacingSlider = document.getElementById("letterSpacingSlider");
  var letterSpacingVal = document.getElementById("letterSpacingVal");
  if (letterSpacingSlider) {
    letterSpacingSlider.addEventListener("input", function () {
      var val = parseFloat(letterSpacingSlider.value);
      document.documentElement.style.setProperty("--u-letter-spacing", val + "em");
      if (letterSpacingVal) { letterSpacingVal.textContent = val.toFixed(2) + "em"; }
    });
    letterSpacingSlider.addEventListener("change", function () {
      var val = parseFloat(letterSpacingSlider.value);
      prefs.letterSpacing = val;
      savePrefs(prefs);
      announce("Letter spacing set to " + val.toFixed(2) + "em");
    });
  }

  /* ---------- Toggle-style buttons ---------- */
  function wireToggle(id, prefKey, attrName, attrValue, label) {
    var btn = document.getElementById(id);
    if (!btn) { return; }
    btn.addEventListener("click", function () {
      var next = !prefs[prefKey];
      prefs[prefKey] = next;
      if (next) { body.setAttribute(attrName, attrValue); } else { body.removeAttribute(attrName); }
      savePrefs(prefs);
      syncButtonStates();
      announce(label + (next ? " on" : " off"));
    });
  }
  wireToggle("dyslexiaToggle", "dyslexia", "data-dyslexia", "on", "Reading-friendly font");
  wireToggle("motionToggle", "motion", "data-motion", "reduce", "Reduced motion");
  wireToggle("largeTargetsToggle", "targets", "data-targets", "large", "Large click targets");

  /* ---------- Reset ---------- */
  var resetBtn = document.getElementById("a11yReset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      prefs = {};
      savePrefs(prefs);
      ["data-theme", "data-fontsize", "data-dyslexia", "data-motion", "data-targets"].forEach(function (a) {
        body.removeAttribute(a);
      });
      document.documentElement.style.setProperty("--u-word-spacing", WORD_SPACING_VALUES.normal);
      document.documentElement.style.setProperty("--u-line-height", "1.6");
      document.documentElement.style.setProperty("--u-letter-spacing", "0em");
      if (lineHeightSlider) { lineHeightSlider.value = "1.6"; }
      if (lineHeightVal) { lineHeightVal.textContent = "1.6"; }
      if (letterSpacingSlider) { letterSpacingSlider.value = "0"; }
      if (letterSpacingVal) { letterSpacingVal.textContent = "0em"; }
      syncButtonStates();
      announce("Accessibility settings reset to defaults");
    });
  }

  /* ---------- Accessibility panel open/close ---------- */
  var a11yToggle = document.getElementById("a11yToggle");
  var a11yPanel = document.getElementById("a11yPanel");
  if (a11yToggle && a11yPanel) {
    a11yToggle.addEventListener("click", function () {
      var isOpen = !a11yPanel.hasAttribute("hidden");
      if (isOpen) {
        a11yPanel.setAttribute("hidden", "");
        a11yToggle.setAttribute("aria-expanded", "false");
      } else {
        a11yPanel.removeAttribute("hidden");
        a11yToggle.setAttribute("aria-expanded", "true");
        var firstBtn = a11yPanel.querySelector("button");
        if (firstBtn) { firstBtn.focus(); }
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !a11yPanel.hasAttribute("hidden")) {
        a11yPanel.setAttribute("hidden", "");
        a11yToggle.setAttribute("aria-expanded", "false");
        a11yToggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (a11yPanel.hasAttribute("hidden")) { return; }
      if (!a11yPanel.contains(e.target) && e.target !== a11yToggle && !a11yToggle.contains(e.target)) {
        a11yPanel.setAttribute("hidden", "");
        a11yToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  applyAll();
})();