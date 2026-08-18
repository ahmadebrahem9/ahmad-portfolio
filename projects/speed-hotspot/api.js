(function () {
  "use strict";
  const config = window.PORTAL_CONFIG;

  async function request(url, options) {
    let response;
    try {
      response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
    } catch (_) {
      throw new Error("server_unreachable");
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.code || "invalid_credentials");
    return payload;
  }

  async function login(username, password) {
    if (config.mode === "mock") {
      await new Promise(resolve => setTimeout(resolve, 850));
      return { success: true, username, timeRemaining: "23 ساعة و45 دقيقة", dataUsed: "245 MB", dataRemaining: "1.75 GB", sessionStartedAt: Date.now() };
    }
    return request(config.api.loginUrl, { method: "POST", body: JSON.stringify({ username, password }) });
  }

  async function logout() {
    if (config.mode === "mock") return { success: true };
    return request(config.api.logoutUrl, { method: "POST", body: "{}" });
  }

  window.PortalAPI = { login, logout };
})();
