/* Sử ký YBA Gia Định — hiển thị từ window.SUKY (data.js, sinh bởi 03_CongCu/build_suky.py) */
(function(){
"use strict";
const D = window.SUKY;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const P = Object.fromEntries(D.photos.map(p => [p.id, p]));
const img = (p, cls="") => `<img src="${p.t}" alt="${esc(p.cap)}" loading="lazy" decoding="async"${cls?` class="${cls}"`:""}>`;

/* ---------- nav ---------- */
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("dac", scrollY > 60), {passive:true});
nav.querySelector(".menu").addEventListener("click", e => {
  const mo = nav.classList.toggle("mo"); e.currentTarget.setAttribute("aria-expanded", mo);
});
nav.querySelectorAll("ul a").forEach(a => a.addEventListener("click", () => nav.classList.remove("mo")));

/* ---------- hero ---------- */
const kham = $("#kham");
const shapes = ["r2 c2","","","","","r2 c2","","","","","r2 c2","","","",""];
D.hero.forEach((id,i) => {
  const p = P[id]; if (!p) return;
  kham.insertAdjacentHTML("beforeend", `<figure class="${shapes[i%shapes.length]}" style="animation-delay:${(i*0.09).toFixed(2)}s"><img src="${p.f}" alt=""></figure>`);
});
$("#hero-phu").textContent = D.meta.heroPhu;
$("#hero-moc").innerHTML = D.meta.heroMoc.map(m => `<div><b>${esc(m.b)}</b><small>${esc(m.small)}</small></div>`).join("");

/* ---------- mở đầu ---------- */
$("#modau-van").innerHTML = D.modau.map(p => `<p>${esc(p)}</p>`).join("") + `<div class="chu-de">${esc(D.chuDe)}</div>`;
$("#diaban").innerHTML = D.diaban.map(x => `<li>${esc(x)}</li>`).join("");
$("#diaban-note").textContent = D.diabanNote;
document.querySelector(".modau aside").insertAdjacentHTML("beforeend", (D.modauAnh||[]).map(id => { const p = P[id]; return p ? `<figure class="modau-anh"><button data-anh="${id}" aria-label="Xem ảnh">${img(p)}</button><figcaption>${esc(p.ev || p.cap)}${p.dl ? " · " + esc(p.dl) : ""}</figcaption></figure>` : ""; }).join(""));
$("#trucot").innerHTML = D.trucot.map(t => `<div><b>${esc(t.b)}</b><p>${esc(t.p)}</p></div>`).join("");
$("#so").innerHTML = D.so.map(s => `<div><b>${esc(s.b)}</b><span>${esc(s.span)}</span><small>${esc(s.small)}</small></div>`).join("");

/* ---------- lightbox ---------- */
let lbList = [], lbI = 0, lbTimer = null;
const lb = $("#lb"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
let lastFocus = null;
function lbShow(){
  const p = P[lbList[lbI]];
  lbImg.src = p.f; lbImg.alt = p.cap;
  lbCap.innerHTML = `<b>${esc(p.ev || p.cap)}</b>${p.ev && p.cap !== p.ev ? esc(p.cap) + "<br>" : ""}<small>${esc([p.dl, p.src, `${lbI+1}/${lbList.length}`].filter(Boolean).join("  ·  "))}</small>`;
  const n = P[lbList[(lbI+1)%lbList.length]]; if (n) { const im = new Image(); im.src = n.f; }
}
function openLb(list, id){
  lbList = list; lbI = Math.max(0, list.indexOf(id)); lastFocus = document.activeElement;
  lb.classList.add("mo"); document.body.style.overflow = "hidden"; lbShow(); $("#lb-dong").focus();
}
function closeLb(){ lb.classList.remove("mo"); document.body.style.overflow = mocDlg && mocDlg.classList.contains("mo") ? "hidden" : ""; stopShow(); lastFocus && lastFocus.focus(); }
const step = d => { lbI = (lbI + d + lbList.length) % lbList.length; lbShow(); };
function stopShow(){ clearInterval(lbTimer); lbTimer = null; $("#lb-chieu").textContent = "Trình chiếu"; }
$("#lb-dong").onclick = closeLb; $("#lb-truoc").onclick = () => step(-1); $("#lb-sau").onclick = () => step(1);
$("#lb-chieu").onclick = () => { if (lbTimer) return stopShow(); lbTimer = setInterval(() => step(1), 3800); $("#lb-chieu").textContent = "Dừng trình chiếu"; };
lb.addEventListener("click", e => { if (e.target === lb || e.target.tagName === "FIGURE") closeLb(); });
addEventListener("keydown", e => {
  if (!lb.classList.contains("mo")) return;
  if (e.key === "Escape") { e.stopImmediatePropagation(); closeLb(); } else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1);
});
let tx = null;
lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, {passive:true});
lb.addEventListener("touchend", e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); tx = null; });
document.addEventListener("click", e => {
  const b = e.target.closest("[data-anh]"); if (!b) return;
  const list = (b.closest("[data-ds]")?.dataset.ds || b.dataset.anh).split(",");
  openLb(list, b.dataset.anh);
});
const anhBtn = (id, extra="") => { const p = P[id]; return p ? `<button data-anh="${id}" aria-label="Xem ảnh: ${esc(p.cap)}"${extra}>${img(p)}</button>` : ""; };

/* ---------- biên niên ---------- */
$("#rail").innerHTML = D.chuong.map(c => `<a href="#${c.id}">${esc(c.lama)}<small>${esc(c.years)}</small></a>`).join("");
const capOf = p => `${p.dl ? p.dl + " · " : ""}${p.ev || p.cap}`;
$("#chuong").innerHTML = D.chuong.map(c => `<article class="chuong${c.tuonglai?" tuonglai":""}" id="${c.id}">
  <div class="dau">
    <div class="so-la-ma" aria-hidden="true">${esc(c.lama)}</div>
    <div><p class="nk">${esc(c.nk)} · ${esc(c.years)}</p><h3>${esc(c.title)}</h3></div>
    ${c.chunhiem ? `<div class="chan"><div><b>${esc(c.chunhiem.name.split(" · ").map(n => "Anh " + n).join(" · "))}</b><small>${esc(c.chunhiem.role)}</small></div>${c.chunhiem.imgs.map(u=>`<img src="${u}" alt="Chân dung Chủ nhiệm" loading="lazy">`).join("")}</div>` : ""}
  </div>
  <div class="than">
    <div class="ke"><p class="lead">${esc(c.lead)}</p>
    ${c.doan.map(d => { const ids = d.anh.filter(id => P[id]);
      return `<section class="doan"><h4>${esc(d.nhan)}</h4>${d.text.map(p=>`<p>${esc(p)}</p>`).join("")}
      ${ids.length ? `<div class="dai" data-ds="${ids.join(",")}">${ids.map(id => { const p = P[id];
        return `<figure><button data-anh="${id}" aria-label="Xem ảnh: ${esc(p.cap)}">${img(p)}</button><figcaption>${esc(capOf(p))}</figcaption></figure>`; }).join("")}</div>` : ""}</section>`; }).join("")}
    </div>
    <aside><ol class="dauan" aria-label="Dấu mốc">${c.dauan.map((d,i)=>{ const co = d.text || (d.anh&&d.anh.length) || (d.links&&d.links.length); const inner = `<time>${esc(d.dl)}</time><span class="tl">${esc(d.title)}${d.note?`<small>${esc(d.note)}</small>`:""}${(d.anh&&d.anh.length)?`<em class="so-anh">${d.anh.length} ảnh</em>`:""}</span>`; return co ? `<li><button class="moc-btn" data-moc="${c.id}:${i}" aria-haspopup="dialog">${inner}<span class="mui" aria-hidden="true">›</span></button></li>` : `<li>${inner}</li>`; }).join("")}</ol>
    ${c.ghichu ? `<p class="ghichu">${esc(c.ghichu)}</p>` : ""}</aside>
  </div>
</article>`).join("");
const railLinks = [...document.querySelectorAll("#rail a")];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) railLinks.forEach(a => a.classList.toggle("on", a.hash === "#" + e.target.id));
}), {rootMargin:"-40% 0px -55% 0px"});
document.querySelectorAll(".chuong").forEach(c => io.observe(c));

/* ---------- chi tiết dấu mốc ---------- */
const mocDlg = document.getElementById("moc");
let mocLast = null;
function openMoc(key){
  const [cid, i] = key.split(":"); const c = D.chuong.find(x => x.id === cid); const d = c.dauan[+i];
  const ids = (d.anh || []).filter(id => P[id]);
  mocDlg.querySelector(".moc-noi").innerHTML = `
    <p class="moc-nk">${esc(c.nk)} · ${esc(c.years)}</p>
    <h3><time>${esc(d.dl)}</time>${esc(d.title)}</h3>
    ${d.text ? `<p class="moc-text">${esc(d.text)}</p>` : ""}
    ${ids.length ? `<div class="moc-anh" data-ds="${ids.join(",")}">${ids.map(id => { const p = P[id]; return `<button data-anh="${id}" aria-label="Xem ảnh: ${esc(p.cap)}">${img(p)}</button>`; }).join("")}</div>`
                 : `<p class="moc-trong">Chưa có ảnh tư liệu cho mốc này trong kho.</p>`}
    <div class="moc-nguon">${d.note ? `<span>Nguồn: ${esc(d.note)}</span>` : ""}${(d.links||[]).map(l => `<a href="${esc(l.u)}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join("")}</div>`;
  mocLast = document.activeElement; mocDlg.classList.add("mo"); document.body.style.overflow = "hidden";
  mocDlg.querySelector(".moc-dong").focus();
}
function closeMoc(){ mocDlg.classList.remove("mo"); document.body.style.overflow = ""; mocLast && mocLast.focus(); }
document.addEventListener("click", e => { const b = e.target.closest("[data-moc]"); if (b) openMoc(b.dataset.moc); });
mocDlg.querySelector(".moc-dong").onclick = closeMoc;
mocDlg.addEventListener("click", e => { if (e.target === mocDlg) closeMoc(); });
addEventListener("keydown", e => { if (e.key === "Escape" && mocDlg.classList.contains("mo") && !lb.classList.contains("mo")) closeMoc(); });

/* ---------- người gánh vác ---------- */
$("#chunhiem").innerHTML = D.chunhiem.map(c => `<figure><img src="${c.img}" alt="Chân dung ${esc(c.name)}" loading="lazy"><figcaption><b>${esc(c.name)}</b><span>${esc(c.nk)}</span><em>${esc(c.years)}</em></figcaption></figure>`).join("");
$("#bcn").innerHTML = D.bcn.map(g => `<div><h3>${esc(g.title)}</h3><p class="chu">${esc(g.note)}</p><ul>${g.people.map(p=>`<li>${esc(p.name)}<small>${esc(p.role)}</small></li>`).join("")}</ul></div>`).join("");

/* ---------- truyền thống ---------- */
$("#tt").innerHTML = D.truyenthong.map(t => {
  const ids = t.anh.filter(id => P[id]);
  return `<div class="tt"><div><h3>${esc(t.title)}</h3>${t.text.map(p=>`<p>${esc(p)}</p>`).join("")}
  <div class="nam">${t.nam.map(n=>`<span>${esc(n)}</span>`).join("")}</div></div>
  <div class="tt-anh" data-ds="${ids.join(",")}">${ids.slice(0,3).map(id=>{const p=P[id];return `<button data-anh="${id}" aria-label="Xem ảnh: ${esc(capOf(p))}" title="${esc(capOf(p))}">${img(p)}<span>${esc(p.dl||"")}</span></button>`;}).join("")}</div></div>`; }).join("");

/* ---------- dòng thời gian ---------- */
const E = D.events;
$("#dtg-dan").textContent = `${E.length} sự kiện có ngày tháng và nguồn, từ năm 2009 đến lịch hẹn tháng 12/2026.`;
const nkSel = $("#dtg-nk");
D.chuong.forEach(c => nkSel.insertAdjacentHTML("beforeend", `<option value="${c.lama}">${esc(c.nk)} (${esc(c.years)})</option>`));
let dtgTopic = "";
$("#dtg-chude").innerHTML = `<button class="chip" aria-pressed="true" data-t="">Tất cả</button>` + D.topics.map(t => `<button class="chip" aria-pressed="false" data-t="${esc(t)}">${esc(t)}</button>`).join("");
$("#dtg-chude").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return; dtgTopic = b.dataset.t;
  $("#dtg-chude").querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); drawDtg();
});
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase();
function drawDtg(){
  const q = norm($("#dtg-tim").value.trim()), nk = nkSel.value;
  let year = null, out = [];
  E.filter(e => (!dtgTopic || e.topic === dtgTopic) && (!nk || e.nk === nk) && (!q || norm(e.title + " " + e.text + " " + e.topic).includes(q)))
   .forEach(e => {
    const y = e.date.slice(0,4);
    if (y !== year) { year = y; out.push(`<li class="nam-hd">${y}</li>`); }
    const p = e.anh && P[e.anh];
    out.push(`<li class="sk"><time>${esc(e.dl)}</time><div class="tl"><b>${esc(e.title)}</b><p>${esc(e.text)}</p><div class="meta">${esc(e.topic)} · Nguồn: ${esc(e.src.join(", "))}${e.status?` · <span class="sap">${esc(e.status)}</span>`:""}</div></div>${p?`<button class="thumb" data-anh="${p.id}" aria-label="Xem ảnh">${img(p)}</button>`:"<span></span>"}</li>`);
  });
  $("#dtg").innerHTML = out.join("") || `<li style="padding:24px 0">Không có sự kiện khớp bộ lọc. Hãy bỏ bớt điều kiện tìm.</li>`;
}
$("#dtg-tim").addEventListener("input", drawDtg); nkSel.addEventListener("change", drawDtg); drawDtg();

/* ---------- album ---------- */
const years = [...new Set(D.photos.map(p => p.y).filter(Boolean))].sort();
years.forEach(y => $("#album-nam").insertAdjacentHTML("beforeend", `<option>${y}</option>`));
$("#album-nam").insertAdjacentHTML("beforeend", `<option value="?">Chưa rõ năm</option>`);
let aTopic = "", aEvent = "", shown = 0, cur = [];
const PAGE = 60;
$("#album-chude").innerHTML = `<button class="chip" aria-pressed="true" data-t="">Mọi chủ đề</button>` + D.topics.map(t => `<button class="chip" aria-pressed="false" data-t="${esc(t)}">${esc(t)}</button>`).join("");
$("#album-chude").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return; aTopic = b.dataset.t;
  $("#album-chude").querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); drawAlbum();
});
$("#album-su-kien").innerHTML = D.albumEvents.map(a => { const p = P[a.cover];
  return `<button aria-pressed="false" data-ev="${esc(a.key)}">${p?`<img src="${p.t}" alt="" loading="lazy">`:""}<span>${esc(a.key)}<small>${esc(a.dl)} · ${a.n} ảnh</small></span></button>`; }).join("");
$("#album-su-kien").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  aEvent = aEvent === b.dataset.ev ? "" : b.dataset.ev;
  $("#album-su-kien").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x.dataset.ev === aEvent)); drawAlbum();
});
function drawAlbum(){
  const q = norm($("#album-tim").value.trim()), y = $("#album-nam").value;
  cur = D.photos.filter(p => p.album !== false && (!aTopic || p.topic === aTopic) && (!aEvent || p.ev === aEvent)
     && (!y || (y === "?" ? !p.y : p.y === y)) && (!q || norm(p.cap + " " + (p.ev||"")).includes(q))).map(p => p.id);
  shown = 0; $("#luoi").innerHTML = ""; $("#luoi").dataset.ds = cur.join(","); more();
  $("#album-dem").textContent = `${cur.length} / ${D.photos.length} ảnh`;
}
function more(){
  const html = cur.slice(shown, shown + PAGE).map(id => { const p = P[id];
    return `<button data-anh="${id}" aria-label="Xem ảnh: ${esc(p.cap)}"><img src="${p.t}" alt="${esc(p.cap)}" loading="lazy" decoding="async" width="${p.w}" height="${p.h}"><span>${esc(p.ev || p.cap)}${p.dl?` · ${esc(p.dl)}`:""}</span></button>`; }).join("");
  $("#luoi").insertAdjacentHTML("beforeend", html); shown += PAGE; $("#them").hidden = shown >= cur.length;
}
$("#them").onclick = more;
$("#album-tim").addEventListener("input", drawAlbum); $("#album-nam").addEventListener("change", drawAlbum);
drawAlbum();

/* ---------- nguồn ---------- */
$("#nguon-dan").textContent = D.meta.nguonDan;
$("#nguon-ds").innerHTML = D.sources.map(s => `<p><code>${esc(s.id)}</code>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`:esc(s.title)}<br><small>${esc(s.pub)}${s.loc?` · ${esc(s.loc)}`:""}</small></p>`).join("");
$("#luuy").innerHTML = `<b>Lưu ý biên soạn</b><ul>${D.luuy.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
$("#chan-trang").textContent = D.meta.chanTrang;

/* ---------- nhạc ---------- */
const au = $("#audio"), nut = $("#nhac-nut"), nh = $("#nhac");
nut.onclick = () => { if (au.paused) { au.play(); } else { au.pause(); } };
au.onplay = () => { nh.classList.add("dang"); nut.textContent = "❚❚"; nut.setAttribute("aria-label","Tạm dừng bài hát"); };
au.onpause = () => { nh.classList.remove("dang"); nut.textContent = "▶"; nut.setAttribute("aria-label","Phát bài Giữ Ấm Đường Xa"); };
})();
