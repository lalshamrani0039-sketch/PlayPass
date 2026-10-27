<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>'),('
</rfl:parameter>estudy clubs | PlayPass</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container" style="padding:20px">
  <h1>🏟️ الأندية الرياضية</h1>
  <div class="filters">
    <select id="fCountry" onchange="render()" aria-label="تصفية حسب الدولة"><option value="">كل الدول 🌍</option></select>
    <input id="fSearch" placeholder="🔎 ابحث عن نادٍ..." oninput="render()" aria-label="بحث">
  </div>
  <div class="grid clubs" id="grid"></div>
  <p id="empty" style="display:none;color:var(--muted)">لا توجد أندية مطابقة.</p>
</div>
<script src="js/seed.js"></script><script src="js/store.js"></script>
<script>
const sel = document.getElementById("fCountry");
const clubs = DB.getClubs();
const countries = [...new Set(clubs.map(c => c.country.trim()))];
countries.forEach(c => {
  const o = document.createElement("option");
  o.value = c;
  o.textContent = c;
  sel.appendChild(o);
});
function render(){
  const co = sel.value.trim();
  const q = document.getElementById("fSearch").value.trim();
  let list = clubs.slice();
  if(co) list = list.filter(c => c.country.trim() === co);
  if(q) list = list.filter(c => c.name.includes(q) || c.city.includes(q));
  document.getElementById("grid").innerHTML = list.map(c => `
    <article class="card">
      <div class="card-cover" style="background:linear-gradient(135deg,${c.color1},${c.color2})"><span class="flag">${c.flag}</span>${c.emoji}</div>
      <div class="card-body"><h3>${c.name}</h3>
        <div class="meta"><span class="tag">📍 ${c.country} — ${c.city}</span><span class="tag green">${c.activities.length} أنشطة</span></div>
        <small style="color:var(--muted)">تأسس ${c.founded} • سعة الملعب ${Number(c.capacity).toLocaleString("ar")} متفرج</small>
      </div>
      <div class="card-actions"><a class="btn btn-primary btn-sm" href="club-details.html?id=${c.id}">عرض التفاصيل</a></div>
    </article>`).join("");
  document.getElementById("empty").style.display = list.length ? "none" : "";
}
render();
</script>
</body>
</html>
