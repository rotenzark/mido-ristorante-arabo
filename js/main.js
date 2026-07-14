/* ================= MIDO — interazioni ================= */
(function(){
  'use strict';

  /* ---------- intro veil ---------- */
  var intro=document.getElementById('intro');
  if(intro){
    window.addEventListener('load',function(){
      setTimeout(function(){intro.classList.add('gone');},1150);
    });
    setTimeout(function(){intro.classList.add('gone');},2600);
  }

  /* ---------- orari (getDay 0=Dom..6=Sab) ---------- */
  var HOURS={
    0:[],
    1:[[12,15],[19,23]],
    2:[[12,15],[19,23]],
    3:[[12,15],[19,23]],
    4:[[12,15],[19,23]],
    5:[[19,23]],
    6:[[12,15],[19,23]]
  };
  var DAYS_IT=['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
  var DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function romeNow(){
    try{return new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'}));}
    catch(e){return new Date();}
  }
  function fmt(h){
    var hh=Math.floor(h), mm=Math.round((h-hh)*60);
    return hh+(mm?(':'+(mm<10?'0':'')+mm):'');
  }
  function computeStatus(){
    var now=romeNow(), d=now.getDay(), cur=now.getHours()+now.getMinutes()/60;
    var today=HOURS[d]||[], i, w;
    for(i=0;i<today.length;i++){
      w=today[i];
      if(cur>=w[0]&&cur<w[1]){
        return {open:true,until:w[1]};
      }
    }
    // next opening today
    for(i=0;i<today.length;i++){
      if(cur<today[i][0]) return {open:false,next:today[i][0],nextDay:d,sameDay:true};
    }
    // next opening in coming days
    for(var k=1;k<=7;k++){
      var nd=(d+k)%7, arr=HOURS[nd]||[];
      if(arr.length){return {open:false,next:arr[0][0],nextDay:nd,sameDay:false,inDays:k};}
    }
    return {open:false};
  }

  function renderStatus(lang){
    var s=computeStatus();
    var badge=document.getElementById('openBadge');
    if(!badge) return;
    var t=badge.querySelector('.t');
    badge.classList.toggle('op',s.open);
    var en=(lang==='en');
    if(s.open){
      t.innerHTML='<b>'+(en?'Open now':'Aperto ora')+'</b>'+(en?'until ':'fino alle ')+fmt(s.until);
    }else if(s.next!=null){
      var day=s.sameDay?(en?'today':'oggi'):(en?DAYS_EN[s.nextDay]:DAYS_IT[s.nextDay]);
      t.innerHTML='<b>'+(en?'Closed':'Chiuso')+'</b>'+(en?'opens ':'apre ')+day+' '+fmt(s.next);
    }else{
      t.innerHTML='<b>'+(en?'Closed':'Chiuso')+'</b>'+(en?'see hours':'vedi orari');
    }
  }

  function renderHours(lang){
    var box=document.getElementById('hoursList');
    if(!box) return;
    var en=(lang==='en');
    var today=romeNow().getDay();
    var order=[1,2,3,4,5,6,0];
    box.innerHTML=order.map(function(d){
      var arr=HOURS[d]||[];
      var label=en?DAYS_EN[d]:DAYS_IT[d];
      var val=arr.length?arr.map(function(w){return fmt(w[0])+'–'+fmt(w[1]);}).join(' · '):(en?'Closed':'Chiuso');
      return '<div class="hourrow'+(d===today?' today':'')+'"><span class="d">'+label+'</span><span>'+val+'</span></div>';
    }).join('');
  }

  /* ---------- i18n ---------- */
  var I18N={
    en:{
      "nav.story":"Story","nav.menu":"Menu","nav.misure":"Portions","nav.gallery":"Gallery","nav.visit":"Find us",
      "bar.book":"Book a table",
      "hero.kick":"Arab restaurant · Milan Ticinese · since 1990",
      "hero.h1":"The first Arab table<br>in the <em>shade of the Madonnina</em>",
      "hero.sub":"For over thirty years the Nassar family has been cooking authentic Middle-Eastern food under Arab arches and hanging lanterns — a small, homely restaurant on a narrow Ticinese street.",
      "hero.book":"Book a table","hero.menu":"See the menu",
      "hero.f1n":"1990","hero.f1l":"since",
      "hero.f2n":"4,4★","hero.f2l":"460 reviews",
      "hero.f3n":"Halal","hero.f3l":"veg & vegan too",
      "ribbon":"COUSCOUS · FALAFEL · HUMMUS · KOSHARI · MINT TEA · PANE ARABO · SHEIKH'S RICE · BABAGANUSH · SINCE 1990 ·",
      "story.kick":"1990 — Via Pietro Custodi",
      "story.h2":"Raafat, Maha and a <em>cuisine brought from home</em>",
      "story.p1":"Raafat arrived in Milan from Alexandria in Egypt with a degree in economics — and opened what many still call the very first Arab restaurant in the city. Since 1990 the Nassar family has welcomed guests on a narrow street in the Ticinese, a stone's throw from the old tram depot.",
      "story.pull":"“Real Arab cooking — not a Western version of it.”",
      "story.p2":"Raafat is the host: he seats you, tells stories and guides you through the courses with a sure eye. His wife Maha keeps the kitchen and the secrets of the most delicious recipes. Bright rough-plastered walls, red tablecloths and hanging lanterns do the rest.",
      "c1":"<b>Since</b> 1990","c2":"<b>Family</b> Nassar","c3":"<b>Egyptian</b> & Middle-Eastern","c4":"<b>Halal</b> · veg · vegan · gluten-free",
      "menu.kick":"On arabesque boards",
      "menu.h2":"The menu, <em>read under the arch</em>",
      "menu.sub":"A few of the house dishes, with the real prices from the arch-shaped boards on the wall. Antipasti and mains change with the day — ask Raafat.",
      "m1.t":"Primi piatti","m1.s":"first courses",
      "m2.t":"Antipasti & mezze","m2.s":"to share",
      "m3.t":"From the grill","m3.s":"secondi",
      "m4.t":"Dolci & tè","m4.s":"sweets & tea",
      "d.koshari":"Koshari","d.koshari.s":"rice with red lentils",
      "d.delta":"Riso del Delta","d.delta.s":"",
      "d.verdure":"Misto verdure ripiene","d.verdure.s":"stuffed vegetables",
      "d.gamberi":"Riso e gamberi o frutti di mare","d.gamberi.s":"",
      "d.borek":"Borek Cleopatra","d.borek.s":"",
      "d.cous":"Cous cous","d.cous.s":"meat, vegetable or fish",
      "d.macch":"Maccheroni all'egiziana","d.macch.s":"",
      "a.hummus":"Hummus","a.hummus.s":"chickpea cream",
      "a.baba":"Babaganush","a.baba.s":"smoked aubergine",
      "a.tabu":"Tabulé","a.tabu.s":"parsley & bulgur salad",
      "a.falafel":"Falafel","a.falafel.s":"fava-bean fritters",
      "a.pane":"Pane arabo","a.pane.s":"baked in-house",
      "a.form":"Formaggio piccante","a.form.s":"Sudanese-style",
      "s.kebab":"Kebab dallo spiedo","s.kebab.s":"the vertical spit",
      "s.sceicco":"Riso dello sceicco","s.sceicco.s":"saffron & dried fruit",
      "s.agnello":"Carni alla brace","s.agnello.s":"chef's choice",
      "s.veg":"Piatto vegano","s.veg.s":"on request",
      "dz.budini":"Budini","dz.budini.s":"coconut · chocolate · apricot",
      "dz.miele":"Dolci al miele","dz.miele.s":"Arab pastries",
      "dz.te":"Tè alla menta","dz.te.s":"hot or iced",
      "dz.carcade":"Carcadè · tamarindo","dz.carcade.s":"no alcohol served",
      "menu.note":"<b>20–30 € per person.</b> Prices shown are read from the restaurant's own menu boards; the full carte changes daily.",
      "mis.kick":"A Mido idea",
      "mis.h2":"One menu, <em>three sizes</em>",
      "mis.sub":"The set menu comes in three portions, so you order by appetite — each also in a vegetarian and vegan version.",
      "mis1.t":"Piccolo","mis1.p":"A gentle tasting: bread, a couple of mezze and one main.","mis1.v":"veg · vegan",
      "mis2.t":"Medio","mis2.p":"The classic table: sauces, salads, a first course and the grill.","mis2.v":"veg · vegan",
      "mis3.t":"Massimo","mis3.p":"The full feast, from mezze to sweets and mint tea.","mis3.v":"veg · vegan",
      "feat.kick":"The house signature",
      "feat.h2":"A couscous <em>steamed for eight hours</em>",
      "feat.p1":"The couscous is steamed slowly through the night — eight hours — the way it should be. Many regulars call it simply the best in the city.",
      "feat.p2":"Alongside it: the Sheikh's rice with saffron and dried fruit, fava-bean falafel, home-baked Arab bread and a pot of mint tea. No alcohol — just tea, carcadè and tamarind.",
      "feat.m1n":"8 h","feat.m1l":"steamed by night",
      "feat.m2n":"0","feat.m2l":"alcohol — tea instead",
      "feat.m3n":"100%","feat.m3l":"home-made",
      "gal.kick":"The table",
      "gal.h2":"Mezze, grill and <em>hanging lanterns</em>",
      "hosts.kick":"Two people, one table",
      "hosts.h2":"The host & the cook",
      "host1.t":"Raafat","host1.s":"the host",
      "host1.p":"From Alexandria to a narrow Ticinese street. Raafat welcomes every guest, tells the stories and picks the dishes for you — half restaurateur, half friend.",
      "host2.t":"Maha","host2.s":"the kitchen",
      "host2.p":"Maha guards the recipes and the pots: the eight-hour couscous, the sauces, the sweets. Homely food, made with care and without shortcuts.",
      "rev.kick":"What guests say",
      "rev.h2":"Reviews",
      "rev.sub":"460 reviews on Google",
      "visit.kick":"Find us",
      "visit.h2":"Via Pietro Custodi 4, Ticinese",
      "visit.addr":"Address","visit.hours":"Opening hours","visit.phone":"Phone","visit.web":"On the map",
      "visit.book":"Book a table","visit.dir":"Directions",
      "svc1":"Dine in","svc2":"Takeaway","svc3":"Home delivery","svc4":"Reservations",
      "faq.kick":"Good to know","faq.h2":"Questions & answers",
      "q1":"Where is Mido and how long has it been open?",
      "a1":"Mido is at Via Pietro Custodi 4, in the Ticinese district near the old tram depot, a few steps from the Navigli. The Nassar family has run it since 1990 — one of the very first Arab restaurants in Milan.",
      "q2":"What kind of cuisine is it?",
      "a2":"Authentic Middle-Eastern and Egyptian home cooking: couscous, koshari, falafel, hummus, babaganush, grilled meats, Arab bread and honey sweets. Everything is halal, with vegetarian, vegan and gluten-free options.",
      "q3":"Do you have vegetarian and vegan options?",
      "a3":"Yes. Many mezze and mains are naturally vegetarian or vegan, and the set menu comes in vegetarian and vegan versions in all three sizes.",
      "q4":"Is alcohol served?",
      "a4":"No alcohol is served. Instead you'll find mint tea, carcadè (hibiscus), tamarind and home-made lemonade.",
      "q5":"Can I get takeaway or delivery?",
      "a5":"Yes — you can eat in, order takeaway or have it delivered to your home. To book a table call 02 8375249.",
      "ft.tag":"Arab restaurant in Milan since 1990. Couscous, mezze and mint tea under Arab arches, in the Ticinese.",
      "ft.explore":"Explore","ft.contact":"Contact","ft.rights":"Demo site — not the official restaurant site.",
      "ft.disc":"Independent demonstration site created to show a possible online presence for Mido Ristorante Arabo. Photos, reviews and details are from public Google Maps sources and belong to their owners. Not affiliated with the restaurant."
    }
  };

  var current='it', ITCACHE={};
  function collectIT(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      ITCACHE[el.getAttribute('data-i18n')]=el.innerHTML;
    });
  }
  function apply(lang){
    current=lang;
    var dict=(lang==='en')?I18N.en:null;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(lang==='en'){ if(dict[k]!=null) el.innerHTML=dict[k]; }
      else { if(ITCACHE[k]!=null) el.innerHTML=ITCACHE[k]; }
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-l')===lang);
    });
    renderHours(lang);renderStatus(lang);
  }

  /* ---------- reveal ---------- */
  function initReveal(){
    var els=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(en){
      en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.14});
    els.forEach(function(e){io.observe(e);});
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded',function(){
    collectIT();
    document.querySelectorAll('.lang button').forEach(function(b){
      b.addEventListener('click',function(){apply(b.getAttribute('data-l'));});
    });
    var burger=document.querySelector('.burger'), links=document.querySelector('nav.links');
    if(burger){burger.addEventListener('click',function(){
      if(links.style.display==='flex'){links.style.display='';}
      else{links.style.display='flex';links.style.position='absolute';links.style.top='66px';links.style.right='18px';
        links.style.flexDirection='column';links.style.background='var(--sand)';links.style.padding='16px 20px';
        links.style.borderRadius='12px';links.style.border='1px solid var(--line)';links.style.boxShadow='var(--shadow)';}
    });}
    document.querySelectorAll('nav.links a').forEach(function(a){
      a.addEventListener('click',function(){if(links&&window.innerWidth<=920)links.style.display='';});
    });
    renderHours('it');renderStatus('it');initReveal();
    setInterval(function(){renderStatus(current);},60000);
  });
})();
