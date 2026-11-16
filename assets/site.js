// 全站共用程式：首頁卡片 + 每週頁面的上一週/下一週。
// 資料來源只有 data/lessons.js（window.LESSONS）。
(function () {
  const lessons = (window.LESSONS || []).slice().sort((a, b) => a.week - b.week);
  const inLessons = location.pathname.includes('/lessons/');
  const root = inLessons ? '../' : '';
  const pad = n => String(n).padStart(2, '0');

  // ---------- 首頁 ----------
  const list = document.getElementById('week-list');
  if (list) {
    const filterBox = document.getElementById('filters');
    const allTags = [...new Set(lessons.flatMap(l => l.tags))];
    let active = null;

    function render() {
      list.innerHTML = '';
      lessons.filter(l => !active || l.tags.includes(active)).forEach(l => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a class="week-card" href="${root}${l.file}">
            <div class="week-no">${pad(l.week)}<small>Week</small></div>
            <div>
              <h2></h2><p></p>
              <ul class="tags">${l.tags.map(t => `<li>${t}</li>`).join('')}</ul>
            </div>
          </a>`;
        li.querySelector('h2').textContent = l.title;
        li.querySelector('p').textContent = l.summary;
        list.appendChild(li);
      });
      filterBox.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', String((b.dataset.tag || null) === active)));
    }

    const mk = (label, tag) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = label; if (tag) b.dataset.tag = tag;
      b.onclick = () => { active = tag || null; render(); };
      filterBox.appendChild(b);
    };
    mk('全部');
    allTags.forEach(t => mk(t, t));
    render();
    const count = document.getElementById('week-count');
    if (count) count.textContent = lessons.length;
  }

  // ---------- 每週頁面 ----------
  const week = Number(document.body.dataset.week);
  const pager = document.getElementById('pager');
  if (week && pager) {
    const i = lessons.findIndex(l => l.week === week);
    const prev = lessons[i - 1], next = lessons[i + 1];
    pager.innerHTML =
      (prev ? `<a class="prev" href="${root}${prev.file}">← 第 ${prev.week} 週・${prev.title}</a>` : '') +
      (next ? `<a class="next" href="${root}${next.file}">第 ${next.week} 週・${next.title} →</a>` : '');
  }
})();
