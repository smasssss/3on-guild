/* GitHub Pages의 관리자 탭은 정적 클라이언트 잠금입니다. 인증이나 데이터 비공개를 보장하지 않습니다. */
(() => {
  'use strict';
  const data = window.GUILD_GUIDE_DATA;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const tabNames = ['guide','war','hero','admin'];

  function showTab(name) {
    if (name !== 'admin') lockAdmin();
    for (const tabName of tabNames) {
      const chosen = name === tabName;
      const button = $(`#tab-${tabName}`);
      button.classList.toggle('active', chosen);
      button.setAttribute('aria-selected', chosen ? 'true' : 'false');
      $(`#panel-${tabName}`).hidden = !chosen;
    }
    if (name === 'admin') refreshAdmin();
  }
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => showTab(button.dataset.tab)));

  const images = Array.from({length:30}, (_, i) => `assets/guide/guide-${String(i + 1).padStart(2,'0')}.jpg`);
  $('#guide-grid').innerHTML = images.map((src, i) => `<button type="button" class="guide-card" aria-label="공략사진 ${i+1} 크게 보기" data-image="${i}"><img src="${src}" alt="공략사진 ${i+1}" loading="${i<2?'eager':'lazy'}"></button>`).join('');
  let currentImage = 0;
  const lightbox = $('#lightbox');
  function updateLightbox() {
    $('#lightbox-image').src = images[currentImage];
    $('#lightbox-image').alt = `확대한 공략사진 ${currentImage+1}`;
    $('#lightbox-count').textContent = `${currentImage+1} / ${images.length}`;
  }
  $('#guide-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-image]');
    if (!button) return;
    currentImage = Number(button.dataset.image);
    updateLightbox();
    lightbox.showModal();
  });
  $('#lightbox-close').addEventListener('click', () => lightbox.close());
  $('#lightbox-prev').addEventListener('click', () => {currentImage = (currentImage+images.length-1)%images.length;updateLightbox();});
  $('#lightbox-next').addEventListener('click', () => {currentImage = (currentImage+1)%images.length;updateLightbox();});
  lightbox.addEventListener('click', (event) => {if (event.target === lightbox) lightbox.close();});
  document.addEventListener('keydown', (event) => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') {currentImage = (currentImage+images.length-1)%images.length;updateLightbox();}
    if (event.key === 'ArrowRight') {currentImage = (currentImage+1)%images.length;updateLightbox();}
  });

  const daySelect = $('#day-select');
  daySelect.innerHTML = data.days.map((day,i)=>`<option value="${i}">${day}</option>`).join('');
  const todayKorea = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',weekday:'short'}).format(new Date());
  daySelect.value = String(({Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6})[todayKorea] ?? 0);
  function renderWar() {
    const day = Number(daySelect.value);
    const entry = data.war[day];
    $('#day-label').textContent = `${data.days[day]} 자료`;
    $('#war-summary').innerHTML = `<div class="card summary"><small>서바이벌 배틀</small><strong>${day || 7}일차</strong></div><div class="card summary"><small>길드전</small><strong>${data.days[day]}</strong></div>`;
    $('#war-timeline').innerHTML = entry.sequence.map((key,index) => {
      const activity = data.activities[key];
      const start = [11,15,19,23,3,7][index];
      const end = (start+3)%24;
      const tasks = entry.tasks[index] || [];
      return `<article class="card time-card"><div class="time-rail">${String(start).padStart(2,'0')}:00–${String(end).padStart(2,'0')}:59</div><div class="time-main"><div class="time-head"><h3><img class="activity-icon" src="assets/icons/${escape(activity.icon)}" alt="">${escape(activity.name)}</h3><span class="goal">${escape(activity.goal)}</span></div><ul class="route-list">${activity.route.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>${tasks.length?`<ul class="task-list">${tasks.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:''}</div></article>`;
    }).join('');
    $('#tip-today').textContent = entry.tip;
    $('#tip-tomorrow').textContent = entry.tomorrow;
  }
  daySelect.addEventListener('change', renderWar);
  renderWar();

  const heroKeys = ['warrior','ranger','mage'];
  $('#hero-types').innerHTML = heroKeys.map((key,i)=>`<button type="button" class="subtab${i===0?' active':''}" role="tab" aria-selected="${i===0}" data-hero="${key}">${data.heroes[key].label}</button>`).join('');
  function renderHero(key) {
    document.querySelectorAll('[data-hero]').forEach(button=>{const active=button.dataset.hero===key;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
    const hero = data.heroes[key];
    $('#hero-content').innerHTML = `<div class="card hero-lead"><h3>${escape(hero.label)} 조합</h3><p>${escape(hero.tagline)}</p></div><div class="hero-roster">${hero.roster.map(([name,role,img])=>`<div class="card hero-member">${img?`<img src="assets/hero/${encodeURIComponent(img)}" alt="" onerror="this.hidden=true">`:''}<strong>${escape(name)}</strong><small>${escape(role)}</small></div>`).join('')}</div>${hero.sections.map(section=>`<article class="card hero-section"><h3>${escape(section.title)}</h3>${section.items?`<ul>${section.items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:''}${section.rows?`<div class="table-wrap"><table class="hero-table"><thead><tr><th>영웅·상황</th><th>권장 내용</th></tr></thead><tbody>${section.rows.map(row=>`<tr><td>${escape(row[0])}</td><td>${escape(row[1])}</td></tr>`).join('')}</tbody></table></div>`:''}</article>`).join('')}`;
  }
  $('#hero-types').addEventListener('click',event=>{const button=event.target.closest('[data-hero]');if(button)renderHero(button.dataset.hero);});
  renderHero('warrior');

  // 평문 대신 사전 계산된 SHA-256 다이제스트를 비교합니다. 정적 페이지이므로 인증 경계가 아닙니다.
  const digest = 'a91b21e23dd3b8cef04eff46433de003fb9380c11069b29c1c2dea23554e6536';
  let adminUnlocked = false;
  function lockAdmin() {
    adminUnlocked = false;
    $('#admin-password').value = '';
    $('#login-error').hidden = true;
    $('#login-form').hidden = false;
    $('#admin-content').hidden = true;
    const frame = $('#growth-frame');
    frame.removeAttribute('src');
    frame.hidden = true;
    growthLoaded = false;
  }
  function refreshAdmin() {
    $('#login-form').hidden = adminUnlocked;
    $('#admin-content').hidden = !adminUnlocked;
    if (adminUnlocked) loadBundledGrowth();
  }
  $('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = $('#admin-password').value;
    const bytes = new TextEncoder().encode(value);
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
    if (hash === digest) {
      adminUnlocked = true;
      $('#admin-password').value = '';
      $('#login-error').hidden = true;
      refreshAdmin();
    } else {
      $('#login-error').hidden = false;
    }
  });

  let growthLoaded = false;
  function loadBundledGrowth() {
    if (growthLoaded) return;
    const frame=$('#growth-frame');
    frame.addEventListener('load',()=>{
      const doc=frame.contentDocument;
      if (!doc) return;
      const fit=()=>{frame.style.height=Math.max(850,doc.documentElement.scrollHeight+32)+'px';};
      fit();
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fit).observe(doc.body);
      doc.addEventListener('click',()=>setTimeout(fit,80));
      doc.addEventListener('input',()=>setTimeout(fit,80));
    },{once:true});
    frame.src='data/3on-growth-2026-09-30.html';
    frame.hidden=false;
    growthLoaded=true;
  }
})();

