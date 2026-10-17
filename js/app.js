  window.renderChrome = renderChrome;

  // PWA: custom install button (always visible in interface)
  let deferredPrompt = null;
  const INSTALL_BTN_ID = 'pwa-install-btn';

  function ensureInstallButton() {
    if (document.getElementById(INSTALL_BTN_ID)) return;
    const btn = document.createElement('button');
    btn.id = INSTALL_BTN_ID;
    btn.className = 'btn btn-accent btn-sm pwa-install-btn';
    btn.innerHTML = '📲 تثبيت التطبيق';
    btn.title = 'تثبيت تطبيق PlayPass على جهازك';
    btn.type = 'button';
    btn.style.position = 'fixed';
    btn.style.bottom = '24px';
    btn.style.left = '24px';
    btn.style.zIndex = '2147483647';
    btn.style.width = 'auto';
    btn.style.minWidth = '140px';
    btn.style.padding = '12px 18px';
    btn.style.fontSize = '1rem';
    btn.style.fontWeight = '800';
    btn.style.borderRadius = '12px';
    btn.style.boxShadow = '0 8px 24px rgba(10,26,51,.35)';
    btn.style.display = 'block';
    btn.style.visibility = 'visible';
    btn.style.opacity = '1';
    btn.style.background = 'linear-gradient(135deg,#d4af2e,#c9a227)';
    btn.style.color = '#241b02';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          hideInstallButton();
        }
        deferredPrompt = null;
      } else {
        toast('للتثبيت يدوياً: من قائمة المتصفح (⋮) اختر "إضافة إلى الشاشة الرئيسية"');
      }
    };
    document.body.appendChild(btn);
  }

  function hideInstallButton() {
    const btn = document.getElementById(INSTALL_BTN_ID);
    if (btn) btn.remove();
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    ensureInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
  });

  if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    hideInstallButton();
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      ensureInstallButton();
    }, 500);
  });

  // PWA: register service worker
  if ("serviceWorker" in navigator && /^(https:|http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(location.protocol + "//" + location.hostname)) {
    window.addEventListener("load", function(){
      navigator
