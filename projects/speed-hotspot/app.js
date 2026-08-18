(function () {
  "use strict";
  const config = window.PORTAL_CONFIG;
  const $ = id => document.getElementById(id);
  const form = $("loginForm");
  const username = $("username");
  const password = $("password");
  const message = $("message");
  const loginButton = $("loginButton");
  let timer;

  const messages = {
    invalid_credentials: "بيانات الدخول غير صحيحة، تحقق منها وحاول مجدداً.",
    card_expired: "هذه البطاقة منتهية. يرجى استخدام بطاقة أخرى.",
    card_in_use: "هذه البطاقة مستخدمة حالياً على جهاز آخر.",
    server_unreachable: "لا يوجد اتصال بالخادم. تحقق من الشبكة وحاول مجدداً.",
    unknown: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً."
  };

  function initialize() {
    $("networkName").textContent = config.networkName;
    $("footerNetworkName").textContent = `شبكة ${config.networkName}`;
    document.title = `شبكة ${config.networkName} | تسجيل الدخول`;
    $("plansGrid").innerHTML = config.plans.map(plan => {
      const priceParts = String(plan.price).trim().split(/\s+/);
      const amount = priceParts.shift() || "";
      const currency = priceParts.join(" ");
      return `<article class="plan${plan.featured ? " featured" : ""}">
        ${plan.featured ? '<em>الأكثر طلباً</em>' : ""}
        <div class="plan-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
        <strong>${escapeHtml(plan.name)}</strong>
        <span><b>${escapeHtml(amount)}</b> ${escapeHtml(currency)}</span>
      </article>`;
    }).join("");
    $("whatsappLink").href = `https://wa.me/${String(config.whatsappNumber).replace(/\D/g, "")}`;
    $("supportLink").href = `tel:${config.supportPhone}`;
    if (config.logoUrl) $("networkLogo").innerHTML = `<img src="${escapeHtml(config.logoUrl)}" alt="شعار شبكة ${escapeHtml(config.networkName)}">`;
    restoreCredentials();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function showMessage(text, type) {
    message.textContent = text; message.className = `message ${type}`; message.hidden = false;
  }
  function clearMessage() { message.hidden = true; }
  function setLoading(active) {
    loginButton.disabled = active; loginButton.classList.toggle("loading", active);
    loginButton.querySelector(".button-label").textContent = active ? "جارٍ الاتصال..." : "اتصال بالإنترنت";
  }
  function showErrors(errors) {
    $("usernameError").textContent = errors.username || "";
    $("passwordError").textContent = errors.password || "";
    if (errors.username) username.focus(); else if (errors.password) password.focus();
  }
  function saveCredentials() {
    if ($("remember").checked) localStorage.setItem("portal_username", username.value.trim());
    else localStorage.removeItem("portal_username");
  }
  function restoreCredentials() {
    const saved = localStorage.getItem("portal_username");
    if (saved) { username.value = saved; $("remember").checked = true; }
  }

  async function handleLogin(event) {
    event.preventDefault(); clearMessage();
    const credentials = { username: username.value, password: password.value };
    const result = window.PortalValidation.validate(credentials);
    showErrors(result.errors);
    if (!result.valid) return;
    setLoading(true);
    try {
      const session = await window.PortalAPI.login(credentials.username.trim(), credentials.password);
      saveCredentials(); showMessage("تم تسجيل الدخول بنجاح. جارٍ تجهيز اتصالك...", "success");
      setTimeout(() => showStatus(session), 500);
    } catch (error) {
      showMessage(messages[error.message] || messages.unknown, "error");
    } finally { setLoading(false); }
  }

  function showStatus(session) {
    clearMessage(); $("loginView").hidden = true; $("statusView").hidden = false;
    $("statusUsername").textContent = session.username || username.value.trim();
    $("timeRemaining").textContent = session.timeRemaining || "غير محدد";
    $("dataUsed").textContent = session.dataUsed || "0 MB";
    $("dataRemaining").textContent = session.dataRemaining || "غير محدد";
    startDuration(session.sessionStartedAt || Date.now());
  }
  function startDuration(startedAt) {
    clearInterval(timer);
    const update = () => { const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000)); const h = String(Math.floor(seconds / 3600)).padStart(2, "0"); const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0"); const s = String(seconds % 60).padStart(2, "0"); $("sessionDuration").textContent = `${h}:${m}:${s}`; };
    update(); timer = setInterval(update, 1000);
  }
  async function handleLogout() {
    const button = $("logoutButton"); button.disabled = true; button.textContent = "جارٍ تسجيل الخروج...";
    try { await window.PortalAPI.logout(); clearInterval(timer); $("statusView").hidden = true; $("loginView").hidden = false; password.value = ""; showMessage("تم تسجيل الخروج بنجاح.", "success"); }
    catch (_) { $("statusView").hidden = true; $("loginView").hidden = false; showMessage(messages.server_unreachable, "error"); }
    finally { button.disabled = false; button.textContent = "تسجيل الخروج"; }
  }

  $("togglePassword").addEventListener("click", event => { const visible = password.type === "text"; password.type = visible ? "password" : "text"; event.currentTarget.setAttribute("aria-pressed", String(!visible)); event.currentTarget.setAttribute("aria-label", visible ? "إظهار كلمة المرور" : "إخفاء كلمة المرور"); });
  [username, password].forEach(input => input.addEventListener("input", () => { $(`${input.id}Error`).textContent = ""; clearMessage(); }));
  form.addEventListener("submit", handleLogin);
  $("logoutButton").addEventListener("click", handleLogout);
  initialize();
})();
