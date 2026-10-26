/* PlayPass store — قاعدة بيانات محلية باستخدام localStorage */
(function(){
  const USERS_KEY = "playpass_users_v2";
  const CLUBS_KEY = "playpass_clubs_v2";
  const REQUESTS_KEY = "playpass_requests_v2";
  const SCHEDULES_KEY = "playpass_schedules_v2";
  const CURRENT_USER_KEY = "playpass_current_user_v2";

  const uid = (p)=> p + "-" + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

  function load(key, def){
    try{ return JSON.parse(localStorage.getItem(key)) || def; }catch(e){ return def; }
  }
  function save(key, data){
    try{ localStorage.setItem(key, JSON.stringify(data)); }catch(e){}
  }

  const defaultUsers = [
    { id:"u-player", role:"player", name:"أحمد الشمري", email:"player@playpass.sa", pass:"123456", country:"السعودية", idType:"national", idNumber:"1234567890", dob:"1995-05-15", photo:"" },
    { id:"u-visitor", role:"visitor", name:"زائر تجريبي", email:"visitor@playpass.sa", pass:"123456", country:"مصر", idType:"passport", idNumber:"A1234567", dob:"1990-01-01", photo:"" },
    { id:"u-club", role:"club", name:"نادي الهلال", email:"club@playpass.sa", pass:"123456", clubId:"c-hilal", country:"السعودية" },
    { id:"u-admin", role:"admin", name:"مشرف الاتحاد", email:"admin@playpass.sa", pass:"123456", country:"السعودية" }
  ];

  const defaultClubs = [
    { id:"c-hilal", name:"نادي الهلال", country:"السعودية", flag:"🇸🇦", city:"الرياض", color1:"#0b2447", color2:"#1a6fd4", emoji:"🌙", stadium:"المملكة أرينا", capacity:26000, founded:1957,
      desc:"زعيم الكرة السعودية وآسيا.",
      activities:["تدريب كرة قدم جماعي","تدريب لياقة بدنية","ورشة تكتيكية","جولة في الملعب والمتحف","لقاء مع لاعبي الفريق الأول"] },
    { id:"c-barca", name:"نادي برشلونة", country:"إسبانيا", flag:"🇪🇸", city:"برشلونة", color1:"#a50044", color2:"#004d98", emoji:"🔵", stadium:"الكامب نو", capacity:99354, founded:1899,
      desc:"أحد أشهر أندية العالم ومدرسة لاماسيا.",
      activities:["تدريب بأسلوب لاماسيا","تحليل أداء بالفيديو","جولة في الكامب نو","ورشة تغذية رياضية","مباراة ودية"] },
    { id:"c-bayern", name:"بايرن ميونخ", country:"ألمانيا", flag:"🇩🇪", city:"ميونخ", color1:"#dc052d", color2:"#7a0019", emoji:"🔴", stadium:"أليانز أرينا", capacity:75000, founded:1900,
      desc:"العملاق البافاري.",
      activities:["تدريب بدني عالي الكثافة","ورشة تكتيكية","اختبارات قياس بدنية"] },
    { id:"c-ahly", name:"النادي الأهلي", country:"مصر", flag:"🇪🇬", city:"القاهرة", color1:"#c8102e", color2:"#7a0019", emoji:"🦅", stadium:"استاد القاهرة", capacity:75000, founded:1907,
      desc:"نادي القرن الإفريقي.",
      activities:["تدريب كرة قدم جماعي","تدريب حراس المرمى","جولة في الجزيرة"] },
    { id:"c-ajax", name:"أياكس أمستردام", country:"هولندا", flag:"🇳🇱", city:"أمستردام", color1:"#d2122e", color2:"#ffffff", emoji:"⚪", stadium:"يوهان كرويف أرينا", capacity:55500, founded:1900,
      desc:"مدرسة المواهب الأوروبية.",
      activities:["تدريب المهارات الفردية","ورشة ذكاء تكتيكي","قياسات أداء"] },
    { id:"c-sao", name:"نادي ساو باولو", country:"البرازيل", flag:"🇧🇷", city:"ساو باولو", color1:"#1493d1", color2:"#c8102e", emoji:"🇧🇷", stadium:"المورومبي", capacity:66795, founded:1930,
      desc:"مهد السامبا.",
      activities:["كرة شاطئية وشوارع","تدريب مهارات السامبا"] },
    { id:"c-tokyo", name:"طوكيو فيردي", country:"اليابان", flag:"🇯🇵", city:"طوكيو", color1:"#0a7a3d", color2:"#0b2447", emoji:"🟢", stadium:"أجينوموتو", capacity:49970, founded:1969,
      desc:"الانضباط الياباني.",
      activities:["تدريب انضباطي صباحي","تحليل تقني بالذكاء الاصطناعي"] },
    { id:"c-sydney", name:"نادي سيدني", country:"أستراليا", flag:"🇦🇺", city:"سيدني", color1:"#0ea5e9", color2:"#0b2447", emoji:"🌊", stadium:"أليانز سيدني", capacity:42500, founded:2004,
      desc:"بوابة كرة القدم في أوقيانوسيا.",
      activities:["تدريب لياقة هوائية","تدريب تكتيكي"] },
    { id:"c-raja", name:"نادي الرجاء الرياضي", country:"المغرب", flag:"🇲🇦", city:"الدار البيضاء", color1:"#0a7a3d", color2:"#ffffff", emoji:"🦅", stadium:"دونور", capacity:67000, founded:1949,
      desc:"النسور الخضر.",
      activities:["تدريب جماعي","جولة في مركب الوازيس","لقاء مع الجماهير"] },
    { id:"c-galatasaray", name:"نادي غلطة سراي", country:"تركيا", flag:"🇹🇷", city:"إسطنبول", color1:"#ff0000", color2:"#ffffff", emoji:"🟡", stadium:"رامضان شكر", capacity:52000, founded:1905,
      desc:"أحد أشهر أندية تركيا.",
      activities:["تدريب كرة قدم جماعي","جولة في ملعب رامضان شكر","حفلات ونشاطات ترفيهية"] }
  ];

  const defaultRequests = [
    { id:"r-1001", playerId:"u-player", clubId:"c-barca", activities:["تدريب بأسلوب لاماسيا","جولة في الكامب نو"], start:"2026-11-10", end:"2026-11-16", notes:"أرغب بتطوير التمرير والاستحواذ.", status:"approved", createdAt:"2026-09-20" },
    { id:"r-1002", playerId:"u-player", clubId:"c-hilal", activities:["تدريب لياقة بدنية"], start:"2026-12-01", end:"2026-12-05", notes:"", status:"pending", createdAt:"2026-10-02" }
  ];

  const defaultSchedules = [
    { id:"s-1", requestId:"r-1001", day:"اليوم 1 — 10 نوفمبر", time:"09:00 - 11:00", title:"تدريب استحواذ وتمرير", place:"ملعب لاماسيا الفرعي" },
    { id:"s-2", requestId:"r-1001", day:"اليوم 1 — 10 نوفمبر", time:"16:00 - 17:30", title:"جولة في الكامب نو والمتحف", place:"الكامب نو" },
    { id:"s-3", requestId:"r-1001", day:"اليوم 3 — 12 نوفمبر", time:"10:00 - 12:00", title:"تحليل أداء بالفيديو", place:"قاعة التحليل" }
  ];

  function init(){
    if(!localStorage.getItem(USERS_KEY)) localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    if(!localStorage.getItem(CLUBS_KEY)) localStorage.setItem(CLUBS_KEY, JSON.stringify(defaultClubs));
    if(!localStorage.getItem(REQUESTS_KEY)) localStorage.setItem(REQUESTS_KEY, JSON.stringify(defaultRequests));
    if(!localStorage.getItem(SCHEDULES_KEY)) localStorage.setItem(SCHEDULES_KEY, JSON.stringify(defaultSchedules));
  }
  init();

  function load(key, def){
    try{ return JSON.parse(localStorage.getItem(key)) || def; }catch(e){ return def; }
  }
  function save(key, data){
    try{ localStorage.setItem(key, JSON.stringify(data)); }catch(e){}
  }

  function getUsers(){ return load(USERS_KEY, []); }
  function getClubs(){ return load(CLUBS_KEY, []); }
  function getCountries(){ return [...new Set(getClubs().map(c => c.country))]; }
  function getClub(id){ return getClubs().find(c => c.id === id); }
  function addClub(club){
    const clubs = getClubs();
    const c = Object.assign({ id: uid("c"), flag:"🏟️", emoji:"⚽", color1:"#0e7c5b", color2:"#0b2447", capacity:10000, founded:new Date().getFullYear(), city:"", stadium:"", activities:[] }, club);
    clubs.push(c);
    save(CLUBS_KEY, clubs);
    return c;
  }
  function updateClub(id, patch){
    const clubs = getClubs();
    const idx = clubs.findIndex(c => c.id === id);
    if(idx === -1) return null;
    clubs[idx] = Object.assign({}, clubs[idx], patch);
    save(CLUBS_KEY, clubs);
    return clubs[idx];
  }
  function getRequests(){ return load(REQUESTS_KEY, []); }
  function getMyRequests(userId){
    return getRequests().filter(r => r.playerId === userId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }
  function getClubRequests(clubId){
    return getRequests().filter(r => r.clubId === clubId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }
  function getRequest(id){
    return getRequests().find(r => r.id === id);
  }
  function createRequest(data){
    const requests = getRequests();
    const r = Object.assign({ id: uid("r"), status:"pending", createdAt: new Date().toISOString().slice(0,10) }, data);
    requests.push(r);
    save(REQUESTS_KEY, requests);
    return r;
  }
  function setRequestStatus(id, status){
    const requests = getRequests();
    const r = requests.find(x => x.id === id);
    if(r){ r.status = status; save(REQUESTS_KEY, requests); }
    return r;
  }
  function getSchedules(){ return load(SCHEDULES_KEY, []); }
  function getScheduleFor(requestId){
    return getSchedules().filter(s => s.requestId === requestId);
  }
  function addSlot(slot){
    const schedules = getSchedules();
    const s = Object.assign({ id: uid("s") }, slot);
    schedules.push(s);
    save(SCHEDULES_KEY, schedules);
    return s;
  }
  function removeSlot(id){
    const schedules = getSchedules().filter(s => s.id !== id);
    save(SCHEDULES_KEY, schedules);
  }

  window.DB = {
    register: function(userData){
      const users = load(USERS_KEY, []);
      if(users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())){
        return { success:false, message:"البريد الإلكتروني مسجل مسبقاً" };
      }
      const user = Object.assign({ id: uid("u"), photo:"" }, userData);
      users.push(user);
      save(USERS_KEY, users);
      return { success:true, user };
    },
    login: function(email, pass){
      const users = load(USERS_KEY, []);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);
      if(!user) return null;
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      return user;
    },
    logout: function(){ localStorage.removeItem(CURRENT_USER_KEY); },
    getCurrentUser: function(){
      const id = localStorage.getItem(CURRENT_USER_KEY);
      if(!id) return null;
      const users = load(USERS_KEY, []);
      return users.find(u => u.id === id) || null;
    },
    getUsers: getUsers,
    getClubs: getClubs,
    getClub: getClub,
    addClub: addClub,
    updateClub: updateClub,
    getCountries: getCountries,
    getRequests: getRequests,
    getMyRequests: getMyRequests,
    getClubRequests: getClubRequests,
    getRequest: getRequest,
    createRequest: createRequest,
    setRequestStatus: setRequestStatus,
    getSchedules: getSchedules,
    getScheduleFor: getScheduleFor,
    addSlot: addSlot,
    removeSlot: removeSlot,
    all: () => ({ users: load(USERS_KEY,[]), clubs: getClubs(), requests: getRequests(), schedules: getSchedules() }),
    reset: () => {
      localStorage.removeItem(USERS_KEY);
      localStorage.removeItem(CLUBS_KEY);
      localStorage.removeItem(REQUESTS_KEY);
      localStorage.removeItem(SCHEDULES_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      location.reload();
    }
  };
})();
