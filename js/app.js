<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>استعراض الأندية | PlayPass</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip-link" href="#main">تخطَّ إلى المحتوى</a>
<header class="site-header" id="siteHeader"></header>
<main class="container" id="main">
  <div class="section">
    <div class="section-head"><div><h2>🏟️ الأندية الرياضية</h2><p>تصفَّ حسب الدولة أو ابحث بالاسم</p></div></div>
    <div class="filters">
      <select id="fCountry" onchange="render()" aria-label="تصفية حسب الدولة"><option value="">كل الدول 🌍</option></select>
      <input id="fSearch" placeholder="🔎 ابحث عن نادٍ..." oninput="render()" aria-label="بحث">
    </div>
    <div class="grid clubs" id="grid"></div>
    <p id="empty" style="display:none;color:var(--muted)">لا توجد أندية مطابقة — جرّب تصفية أخرى.</p>
  </div>
</main>
<footer id="siteFooter"></footer><div id="toasts"></div>
<script>
// Simple inline data (no external dependencies)
const CLUBS = [
  { id:"c-hilal", name:"نادي الهلال", country:"السعودية", flag:"🇸🇦", city:"الرياض", color1:"#0b2447", color2:"#1a6fd4", emoji:"🌙", stadium:"المملكة أرينا", capacity:26000, founded:1957, activities:["تدريب كرة قدم جماعي","تدريب لياقة بدنية","ورشة تكتيكية","جولة في الملعب والمتحف"] },
  { id:"c-barca", name:"نادي برشلونة", country:"إسبانيا", flag:"🇪🇸", city:"برشلونة", color1:"#a50044", color2:"#004d98", emoji:"🔵", stadium:"الكامب نو", capacity:99354, founded:1899, activities:["تدريب بأسلوب لاماسيا","تحليل أداء بالفيديو","جولة في الكامب نو","ورشة تغذية رياضية"] },
  { id:"c-bayern", name:"بايرن ميونخ", country:"ألمانيا", flag:"🇩🇪", city:"ميونخ", color1:"#dc052d", color2:"#7a0019", emoji:"🔴", stadium:"أليانز أرينا", capacity:75000, founded:1900, activities:["تدريب بدني عالي الكثافة","ورشة تكتيكية","اختبارات قياس بدنية","جولة في أليانز أرينا"] },
  { id:"c-ahly", name:"النادي الأهلي", country:"مصر", flag:"🇪🇬", city:"القاهرة", color1:"#c8102e", color2:"#7a0019", emoji:"🦅", stadium:"استاد القاهرة", capacity:75000, founded:1907, activities:["تدريب كرة قدم جماعي","تدريب حراس المرمى","جولة في الجزيرة","محاضرة في الثقافة الرياضية"] },
  { id:"c-ajax", name:"أياكس أمستردام", country:"هولندا", flag:"🇳🇱", city:"أمستردام", color1:"#d2122e", color2:"#ffffff", emoji:"⚪", stadium:"يوهان كرويف أرينا", capacity:55500, founded:1900, activities:["تدريب المهارات الفردية","ورشة ذكاء تكتيكي","قياسات أداء","جولة في الأكاديمية"] },
  { id:"c-sao", name:"نادي ساو باولو", country:"البرازيل", flag:"🇧🇷", city:"ساو باولو", color1:"#1493d1", color2:"#c8102e", emoji:"🇧🇷", stadium:"المورومبي", capacity:66795, founded:1930, activities:["كرة شاطئية وشوارع","تدريب مهارات السامبا","ورشة إيقاع وحركة","جولة في المورومبي"] },
  { id:"c-tokyo", name:"طوكيو فيردي", country:"اليابان", flag:"🇯🇵", city:"طوكيو", color1:"#0a7a3d", color2:"#0b2447", emoji:"🟢", stadium:"أجينوموتو", capacity:49970, founded:1969, activities:["تدريب انضباطي صباحي","تحليل تقني بالذكاء الاصطناعي","ورشة ثقافة رياضية"] },
  { id:"c-sydney", name:"نادي سيدني", country:"أستراليا", flag:"🇦🇺", city:"سيدني", color1:"#0ea5e9", color2:"#0b2447", emoji:"🌊", stadium:"أليانز سيدني", capacity:42500, founded:2004, activities:["تدريب لياقة هوائية","تدريب تكتيكي","جولة بحرية رياضية"] },
  { id:"c-raja", name:"نادي الرجاء الرياضي", country:"المغرب", flag:"🇲🇦", city:"الدار البيضاء", color1:"#0a7a3d", color2:"#ffffff", emoji:"🦅", stadium:"دونور", capacity:67000, founded:1949, activities:["تدريب جماعي","جولة في مركب الوازيس","لقاء مع الجماهير"] },
  { id:"c-galatasaray", name:"نادي غلطة سراي", country:"تركيا", flag:"🇹🇷", city:"إسطنبول", color1:"#ff0000", color2:"#ffffff", emoji:"🟡", stadium:"رامضان شكر", capacity:52000, founded:1905, activities:["تدريب كرة قدم جماعي","جولة في ملعب رامضان شكر","حفلات ونشاطات ترفيهية"] }
];

const sel = document.getElementById("fCountry");
const countries = [...new Set(CLUBS.map(c => c.country.trim()))];
countries.forEach(c => {
  const o = document.createElement("option");
  o.value = c;
  o.textContent = c;
  sel.appendChild(o);
});

function render(){
  const co = sel.value.trim();
  const q = document.getElementById("fSearch").value.trim();
  let list = CLUBS.slice();
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
