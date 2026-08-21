(() => {
  "use strict";

  const GUARD_TIMEOUT_MS = 6500;
  let timeoutId = 0;

  function elements() {
    const sessionCheck = document.getElementById("authSessionCheck");
    return {
      overlay: document.getElementById("authOverlay"),
      sessionCheck,
      title: sessionCheck?.querySelector("strong"),
      detail: document.getElementById("authBootstrapDetail"),
      actions: document.getElementById("authBootstrapActions"),
      retry: document.getElementById("authBootstrapRetry"),
      login: document.getElementById("authBootstrapLogin"),
    };
  }

  function isPending() {
    const { sessionCheck } = elements();
    return Boolean(
      sessionCheck
      && !sessionCheck.classList.contains("hidden")
      && !sessionCheck.classList.contains("is-error"),
    );
  }

  function resolve() {
    window.clearTimeout(timeoutId);
    timeoutId = 0;
  }

  function fail(message = "O jogo demorou para iniciar. Tente novamente ou acesse o login.") {
    resolve();
    const { overlay, sessionCheck, title, detail, actions } = elements();
    if (!sessionCheck) return;
    overlay?.classList.add("is-resolved");
    sessionCheck.classList.remove("hidden");
    sessionCheck.classList.add("is-error");
    actions?.classList.remove("hidden");
    if (title) title.textContent = "Falha ao iniciar";
    if (detail) detail.textContent = message;
  }

  function continueToLogin() {
    resolve();
    const { overlay, sessionCheck, actions } = elements();
    sessionCheck?.classList.add("hidden");
    sessionCheck?.classList.remove("is-error");
    actions?.classList.add("hidden");
    overlay?.classList.add("is-resolved");
    history.replaceState({}, "", `${location.pathname}#/login`);
    document.getElementById("authUsername")?.focus();
  }

  function retry() {
    const target = new URL(location.href);
    target.searchParams.set("retry", Date.now().toString());
    location.replace(target.toString());
  }

  function arm() {
    const { retry: retryButton, login: loginButton } = elements();
    retryButton?.addEventListener("click", retry);
    loginButton?.addEventListener("click", continueToLogin);
    timeoutId = window.setTimeout(() => {
      if (isPending()) fail();
    }, GUARD_TIMEOUT_MS);
  }

  window.V2DAuthBootGuard = { resolve, fail };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arm, { once: true });
  } else {
    arm();
  }
})();
