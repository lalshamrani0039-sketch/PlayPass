/* PlayPass seed data — realistic demo clubs (Morocco + world). Stored to localStorage on first run. */
window.PLAYPASS_SEED = {
  users: [
    { id: "u-player", role: "player", name: "أحمد الشمري", email: "player@playpass.sa", pass: "123456", country: "السعودية", position: "وسط ميدان", age: 22 },
    { id: "u-visitor", role: "visitor", name: "زائر تجريبي", email: "visitor@playpass.sa", pass: "123456", country: "مصر" },
    { id: "u-club", role: "club", name: "نادي الهلال", email: "club@playpass.sa", pass: "123456", clubId: "c-hilal" },
    { id: "u-admin", role: "admin", name: "مشرف الاتحاد", email: "admin@playpass.sa", pass: "123456" }
  ],
  clubs: [
    { id:"c-hilal", name:"نادي الهلال", country:"السعودية", flag:"🇸🇦", city:"الرياض", color1:"#0b2447", color2:"#1a6fd4", emoji:"🌙", stadium:"المملكة أرينا", capacity:26000, founded:1957,
      desc:"زعيم الكرة السعودية وآسيا، مشهور بأكاديميته المتطورة وأسلوب اللعب الهجومي. يستقبل اللاعبين الزوار ببرامج تدريب احترافية وجولات في مرافقه الحديثة.",
      activities:["تدريب كرة قدم جماعي","تدريب لياقة بدنية","ورشة تكتيكية","جولة في الملعب والمتحف","لقاء مع لاعبي الفريق الأول"] },
    { id:"c-barca", name:"نادي برشلونة", country:"إسبانيا", flag:"🇪🇸", city:"برشلونة", color1:"#a50044", color2:"#004d98", emoji:"🔵", stadium:"الكامب نو", capacity:99354, founded:1899,
      desc:"أحد أشهر أندية العالم ومدرسة لاماسيا العريقة. تجربة الزيارة تشمل التدرب بأسلوب التيكي-تاكا وتحليل الأداء بالفيديو.",
      activities:["تدريب بأسلوب لاماسيا","تحليل أداء بالفيديو","جولة في الكامب نو","ورشة تغذية رياضية","مباراة ودية مع فئات النادي"] },
    { id:"c-bayern", name:"بايرن ميونخ", country:"ألمانيا", flag:"🇩🇪", city:"ميونخ", color1:"#dc052d", color2:"#7a0019", emoji:"🔴", stadium:"أليانز أرينا", capacity:75000, founded:1900,
      desc:"العملاق البافاري بانضباطه الألماني ومركز التدريب الأحدث أوروبياً. برامج بدنية وتكتيكية عالية الكثافة للزوار.",
      activities:["تدريب بدني عالي الكثافة","ورشة تكتيكية","اختبارات قياس بدنية","جولة في أليانز أرينا","لقاء مع الطاقم الفني"] },
    { id:"c-ahly", name:"النادي الأهلي", country:"مصر", flag:"🇪🇬", city:"القاهرة", color1:"#c8102e", color2:"#7a0019", emoji:"🦅", stadium:"استاد القاهرة", capacity:75000, founded:1907,
      desc:"نادي القرن الإفريقي وقلعة البطولات. أجواء جماهيرية استثنائية وبرامج تدريبية تجمع بين المهارة والروح القتالية.",
      activities:["تدريب كرة قدم جماعي","تدريب حراس المرمى","جولة في الجزيرة","محاضرة في الثقافة الرياضية","مباراة ودية"] },
    { id:"c-ajax", name:"أياكس أمستردام", country:"هولندا", flag:"🇳🇱", city:"أمستردام", color1:"#d2122e", color2:"#ffffff", emoji:"⚪", stadium:"يوهان كرويف أرينا", capacity:55500, founded:1900,
      desc:"مدرسة المواهب الأوروبية الأولى. يركز برنامج الزوار على تطوير المهارة الفردية والذكاء التكتيكي لل
