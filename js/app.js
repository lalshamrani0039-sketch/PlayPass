   window.renderChrome = renderChrome;

  // PWA: custom install button (shown when browser offers installation)
  let deferredPrompt = null;
  const INSTALL_BTN_ID = 'pwa-install-btn';

  function ensureInstallButton() {
    if (document.getElementById(INSTALL_BTN_ID)) return;
    const btn = document.createElement('button');
    btn.id = INSTALL_BTN_ID;
    btn.className = 'btn btn-accent btn-sm pwa-install-btn';
    btn.innerHTML = '📲 تثبيت التطبيق';
    btn.title = 'تثبيت تطبيق PlayPass على جهازك';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.left = '20px';
    btn.style.zIndex = '1000';
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

  // إخفاء الزر إذا كان التطبيق يعمل بالفعل كتطبيق مثبت
  if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    hideInstallButton();
  }

  // PWA: register service worker (additive; guarded — file:// and old browsers skip silently)