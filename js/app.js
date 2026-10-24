/* PlayPass app shell — كامل ومُختبر */
(function(){
  const root = document.documentElement;

  // --- Style & Font ---
  function theme(){ return localStorage.getItem("playpass_theme") || "light"; }
  function applyTheme(t){ root.setAttribute("data-theme", t); const b=document.getElementById("themeBtn"); if(b) b.textContent = t==="dark" ? "☀️" : "🌙"; }
  window.toggleTheme = function(){ const n = theme()==="dark"?"light":"dark"; localStorage.setItem("playpass_theme", n); applyTheme(n); };

  const SCALES = ["font-sm","","font-lg","font-xl"];
  function fontStep(){ return parseInt(localStorage.getItem("playpass_fontstep")||"1",10); }
  function applyFont(){
    root.classList.remove("font-sm","font-lg","font-xl");
    const c = SCALES[fontStep()] || "";
    if(c) root.classList.add(c);
  }
  window.fontBigger = function(){ let s=Math.min(3,fontStep()+1); localStorage.setItem("playpass_fontstep",s); applyFont(); };
  window.fontSmaller = function(){ let s=Math.max(0,fontStep()-1); localStorage.setItem("playpass_fontstep",s); applyFont(); };

  // --- Session via DB ---
  window.session = function(){ return DB.getCurrentUser(); };
  window.login = function(email, pass){ return DB.login(email, pass); };
  window.logout = function(){ DB.logout(); location.href = "login.html"; };
  window.requireRole = function(roles, redirect){
    const s = DB.getCurrentUser();
    if(!s || !roles.includes(s.role)){ if(redirect) location.href = redirect; return null; }
    return s;
  };
  window.getCurrentUser = function(){ return DB.getCurrentUser(); };
  window.homeFor = function(role){ if(role==="club") return "club-dashboard.html"; if(role==="admin") return "admin-dashboard.html"; return "index.html"; };

  // --- Helpers ---
  window.esc = function(s){ return String(s==null?"":s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); };
  window.toast = function(msg){
    const box = document.getElementById("toasts"); if(!box) return alert(msg);
    const d = document.createElement("div"); d.className="toast"; d.textContent = msg;
    box.appendChild(d); setTimeout(()=>d.remove(), 2600);
  };
  window.statusLabel = function(st){
    if(st==="approved") return '<span class="status approved">✅ تمت الموافقة</span>';
    if(st==="rejected") return '<span class="status rejected">❌ مرفوضة</span>';
    return '<span class="status pending">⏳ قيد المراجعة</span>';
  };
  window.qs = function(k){ return new URLSearchParams(location.search).get(k); };

  // --- Licensed imagery ---
  window.HERO_IMG = "https://images.unsplash.com/photo-1522778119026-d647f0596c20";
  window.CLUB_IMGS = {
    "c-hilal": "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    "c-barca": "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
    "c-bayern": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
    "c-ahly": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6",
    "c-ajax": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9",
    "c-sao": "https://images.unsplash.com/photo-1517466787929-bc90951d0974",
    "c-tokyo": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    "c-sydney": "https://images.unsplash.com/photo-1526232761682-d26e03ac148e",
    "c-raja": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d",
    "c-galatasaray": "https://images.unsplash.com/photo-1526527178577-63749737865e"
  };
  window.uimg = function(base, w){ return base + "?q=80&w=" + (w||1200) + "&auto=format&fit=crop"; };
  window.clubImg = function(id, w){ return window.uimg(window.CLUB_IMGS[id] || window.HERO_IMG, w); };
  window.ph = function(src, emoji, alt){
    return '<span class="ph-em" aria-hidden="true">' + (emoji||"🏟️") + '</span>'
      + '<img src="' + src + '" alt="' + esc(alt||"") + '" loading="lazy" onerror="this.remove()">';
  };

  // --- Header / Footer ---
  const NAV = [
    { href:"index.html", label:"🏠 الرئيسية", key:"home" },
    { href:"clubs.html", label:"🏟️ الأندية", key:"clubs" },
    { href:"about.html", label:"ℹ️ من نحن", key:"about" },
    { href:"my-requests.html", label:"📋 طلباتي", key:"req" },
    { href:"club-dashboard.html", label:"🛠️ لوحة النادي", key:"club" },
    { href:"admin-dashboard.html", label:"📊 لوحة المشرف", key:"admin" },
  ];
  function renderChrome(active){
    const s = DB.getCurrentUser();
    const header = document.getElementById("siteHeader");
    if(header){
      const links = NAV.filter(n=>{
        if(n.key==="club" && !(s && s.role==="club")) return false;
        if(n.key==="admin" && !(s && s.role==="admin")) return false;
        return true;
      }).map(n=>`<a href="${n.href}" class="${active===n.key?'active':''}">${n.label}</a>`).join("");
      const authArea = s
        ? `<span class="tag green">👤 ${esc(s.name)}</span><button class="btn btn-ghost btn-sm" onclick="logout()">خروج</button>`
        : `<a class="btn btn-primary btn-sm" href="login.html">تسجيل الدخول / حساب جديد</a>`;
      header.innerHTML = `
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="PlayPass الرئيسية"><span class="brand-mark">⚽</span><span class="wordmark">Play<b>Pass</b><small>السياحة الرياضية للاعبين</small></span></a>
          <nav class="nav" id="mainNav" aria-label="التنقل الرئيسي">${links}</nav>
          <div class="header-actions">
            <button class="icon-btn" id="themeBtn" onclick="toggleTheme()" title="الوضع الليلي/النهاري" aria-label="تبديل المظهر">🌙</button>
            <button class="icon-btn" onclick="fontBigger()" title="تكبير الخط" aria-label="تكبير الخط">A+</button>
            <button class="icon-btn" onclick="fontSmaller()" title="تصغير الخط" aria-label="تصغير الخط">A-</button>
            ${authArea}
            <button class="icon-btn burger" onclick="document.getElementById('mainNav').classList.toggle('open')" aria-label="القائمة">☰</button>
          </div>
        </div>`;
    }
    const foot = document.getElementById("siteFooter");
    if(foot){
      foot.innerHTML = `<div class="container foot-grid">
        <div><b>⚽ PlayPass</b> — منصة السياحة الرياضية.<br><small>بياناتك محفوظة في متصفحك فقط. راجع README.</small></div>
        <div>الحسابات التجريبية: لاعب <code>player@playpass.sa</code> — نادي <code>club@playpass.sa</code> — مشرف <code>admin@playpass.sa</code> (كلمة المرور: <code>123456</code>)</div>
      </div>`;
    }
    applyTheme(theme()); applyFont();
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:.08});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  }
  window.renderChrome = renderChrome;

  // --- PWA Install Button ---
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
        if (outcome === 'accepted') hideInstallButton();
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
    setTimeout(() => ensureInstallButton(), 500);
  });

  // --- Service Worker ---
  if ("serviceWorker" in navigator && /^(https:|http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(location.protocol + "//" + location.hostname)) {
    window.addEventListener("load", function(){
      navigator.serviceWorker.register("service-worker.js").catch(function(e){ console.log('[SW] Registration failed:', e); });
    });
  }
  window.addEventListener("offline", function(){ toast("📡 انقطع الاتصال — تعرض نسخة محفوظة ⏳"); });
  window.addEventListener("online", function(){ toast("🌐 عاد الاتصال — المحتوى محدّث ✅"); });
})();

 
  

