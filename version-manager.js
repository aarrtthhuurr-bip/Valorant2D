(() => {
  "use strict";

  const versionMeta = document.querySelector('meta[name="valorant2d-version"]');
  const currentVersion = versionMeta?.content?.trim() || "0.0.0";
  const localIntegrated = ["localhost", "127.0.0.1"].includes(location.hostname)
    && location.port === "3000";
  const reloadKey = "valorant2d:version-reload";
  let reloadScheduled = false;
  let updateTimer = 0;

  function reloadForVersion(version, reason) {
    if (reloadScheduled) return;
    const previousAttempt = sessionStorage.getItem(reloadKey);
    const attempt = `${version}:${reason}`;
    if (previousAttempt === attempt) return;
    reloadScheduled = true;
    sessionStorage.setItem(reloadKey, attempt);
    const target = new URL(location.href);
    target.searchParams.set("app-version", version);
    target.searchParams.delete("cache-recovery");
    location.replace(target.toString());
  }

  async function clearValorantCaches() {
    if (!("caches" in window)) return;
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith("valorant2d-shell-"))
        .map((key) => caches.delete(key)),
    );
  }

  async function recoverBrokenApplication() {
    const stylesheetLoaded = Array.from(document.styleSheets)
      .some((sheet) => String(sheet.href || "").includes("/styles.css"));
    const gameLoaded = window.__VALORANT2D_BOOTED__ === true;
    if (stylesheetLoaded && gameLoaded) return;
    const recoveryKey = `valorant2d:asset-recovery:${currentVersion}`;
    if (sessionStorage.getItem(recoveryKey)) return;
    sessionStorage.setItem(recoveryKey, "1");
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    await clearValorantCaches();
    reloadForVersion(currentVersion, "asset-recovery");
  }

  async function readPublishedVersion() {
    const response = await fetch(`./updates.json?version-check=${Date.now()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const release = await response.json();
    if (release?.status !== "published" || !release.version) return null;
    return release;
  }

  async function checkForPublishedUpdate(registration) {
    try {
      const release = await readPublishedVersion();
      if (!release || release.version === currentVersion) {
        sessionStorage.removeItem(reloadKey);
        return;
      }

      sessionStorage.setItem("valorant2d:pending-version", release.version);
      await registration.update();
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      // Garante atualização mesmo quando o novo worker já estava ativo antes
      // do listener de controllerchange ser registrado.
      window.setTimeout(() => reloadForVersion(release.version, "published"), 900);
    } catch (error) {
      console.warn("[Versão] Verificação adiada:", error?.message || error);
    }
  }

  async function initializeVersionManager() {
    if (!("serviceWorker" in navigator)) return;

    if (localIntegrated) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      await clearValorantCaches();
      return;
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      const pendingVersion = sessionStorage.getItem("valorant2d:pending-version");
      if (pendingVersion) reloadForVersion(pendingVersion, "controller-change");
    });

    const registration = await navigator.serviceWorker.register("./service-worker.js", {
      scope: "./",
      updateViaCache: "none",
    });

    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });

    await checkForPublishedUpdate(registration);
    window.clearInterval(updateTimer);
    updateTimer = window.setInterval(() => {
      if (!document.hidden) void checkForPublishedUpdate(registration);
    }, 15 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void checkForPublishedUpdate(registration);
    });
  }

  window.addEventListener("load", () => {
    void initializeVersionManager().catch((error) => {
      console.warn("[PWA] Gerenciador de versão indisponível:", error?.message || error);
    });
    window.setTimeout(() => void recoverBrokenApplication(), 2200);
  });
})();
