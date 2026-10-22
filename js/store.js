/* PlayPass store — طبقة بيانات قابلة للتبديل مع API حقيقي مستقبلاً.
   حالياً: محاكاة قاعدة بيانات عبر localStorage (وضع تجريبي موثّق).
   للربط الخلفي: استبدل دوال DB.* بنداءات fetch إلى /api/... دون تغيير باقي الكود. */
(function(){
  const KEY = "playpass_db_v2";
  const uid = (p)=> p + "-" + Math.random().toString(36).slice(2,7) + Date.now().toString(36).slice(-3);

  function init(){
    try{
      if(!localStorage.getItem(KEY)){
        localStorage.setItem(KEY, JSON.stringify(window.PLAYPASS_SEED));
      }
    }catch(e){ console.warn("storage unavailable", e); }
  }
  function read(){
    init();
    try{ return JSON.parse(localStorage.getItem(KEY)) || window.PLAYPASS_SEED; }
    catch(e){ return window.PLAYPASS_SEED; }
  }
  function write(db){ try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){} }

  window.DB = {
    all(){ return read(); },
    reset(){ localStorage.removeItem(KEY); init(); return read(); },
    clubs(){ return read().clubs; },
    club(id){ return read().clubs.find(c=>c.id===id); },
    countries(){ const s=[...new Set(read().clubs.map(c=>c.country))]; return s; },
    requests(){ return read().requests; },
    myRequests(pid){ return read().requests.filter(r=>r.playerId===pid).sort((a,b)=> b.createdAt.localeCompare(a.createdAt)); },
    clubRequests(cid){ return read().requests.filter(r=>r.clubId===cid).sort((a,b)=> b.createdAt.localeCompare(a.createdAt)); },
    getRequest(id){ return read().requests.find(r=>r.id===id); },
    createRequest(data){
      const db = read();
      const r = Object.assign({ id: uid("r"), status:"pending", createdAt: new Date().toISOString().slice(0,10) }, data);
      db.requests.push(r); write(db); return r;
    },
    setStatus(id, status){
      const db = read(); const r = db.requests.find(x=>x.id===id);
      if(r){ r.status = status; write(db); } return r;
    },
    scheduleFor(requestId){ return read().schedules.filter(s=>s.requestId===requestId); },
    addSlot(slot){
      const db = read();
      const s = Object.assign({ id: uid("s") }, slot);
      db.schedules.push(s); write(db); return s;
    },
    removeSlot(id){
      const db = read(); db.schedules = db.schedules.filter(s=>s.id!==id); write(db);
    },
    users(){ return read().users; },
    addUser(u){
      const db = read();
      const user = Object.assign({ id: uid("u") }, u);
      db.users.push(user); write(db); return user;
    },
    updateClub(id, patch){
      const db = read(); const c = db.clubs.find(x=>x.id===id);
      if(c){ Object.assign(c, patch); write(db); } return c;
    },
    addClub(c){
      const db = read();
      const club = Object.assign({ id: uid("c"), flag:"🏟️", emoji:"⚽", color1:"#0e7c5b", color2:"#0b2447", capacity:10000, founded:new Date().getFullYear(), city:"", stadium:"", activities:[] }, c);
      db.clubs.push(club); write(db); return club;
    }
  };
})();
