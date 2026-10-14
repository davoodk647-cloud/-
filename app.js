/* ============================================================
   HEGEMON — App Logic
   انسان‌ساز باش!
   ============================================================ */

(function () {
  'use strict';

  // ---------- Data: seed lessons ----------
  var SEED_LESSONS = [
    { id: 'l1', title: 'معرفی اولیه در پرزنت', category: 'شروع و آشنایی', summary: 'آشنایی با مفاهیم پایه و نحوه شروع کار.', body: 'در این درس با مفاهیم پایه آشنا می‌شوید.\n\nپرزنت یعنی معرفی خدمات به دیگران به‌صورت حضوری یا آنلاین. هدف اصلی ایجاد ارتباط و اعتماد است.\n\nنکات کلیدی:\n۱. شناخت خدمات\n۲. آشنایی با مخاطب\n۳. آماده‌سازی ذهنی' },
    { id: 'l2', title: 'خدمات inoti و امکانات', category: 'خدمات inoti', summary: 'معرفی کامل خدمات و امکانات موجود.', body: 'در این درس خدمات inoti و امکانات آن را بررسی می‌کنیم.\n\nاین خدمات شامل:\n- معرفی خدمات\n- نحوه استفاده\n- مزایا و امکانات' },
    { id: 'l3', title: 'مهارت پرزنت حرفه‌ای', category: 'مهارت پرزنت', summary: 'تکنیک‌های پرزنت مؤثر و جذب مخاطب.', body: 'پرزنت حرفه‌ای نیازمند تمرین و مهارت است.\n\nمراحل:\n۱. آماده‌سازی متن\n۲. تمرین بیان\n۳. مدیریت سوالات\n۴. پیگیری' },
    { id: 'l4', title: 'متن‌های آماده برای استفاده', category: 'متن‌های آماده', summary: 'متن‌های پرزنت آماده برای شروع سریع.', body: 'متن‌های آماده به شما کمک می‌کنند سریع‌تر شروع کنید.\n\nمتن معرفی:\n«سلام، من [نام شما] هستم. خدمات ما شامل...»\n\nمتن پیگیری:\n«سلام مجدد، پیگیر خدمات ارائه‌شده بودم...»' },
    { id: 'l5', title: 'بازاریابی و پیگیری مشتری', category: 'بازاریابی و پیگیری', summary: 'نحوه جذب مشتری و پیگیری مؤثر.', body: 'بازاریابی و پیگیری از مهم‌ترین مهارت‌هاست.\n\n۱. شناسایی نیاز مشتری\n۲. ارائه راهکار\n۳. پیگیری منظم\n۴. حفظ ارتباط' },
    { id: 'l6', title: 'تیم‌سازی و رشد فردی', category: 'تیم‌سازی و رشد فردی', summary: 'چگونه تیم بسازیم و رشد کنیم.', body: 'تیم‌سازی کلید رشد پایدار است.\n\nماموریت تو؛ رشد خودت و کپی‌پیستِ فقط یک نفر، شبیه خودت!' }
  ];

  var STORAGE_KEY = 'hegemon_lessons';
  var DONE_KEY = 'hegemon_done';

  // ---------- State ----------
  var lessons = [];
  var doneSet = {};
  var currentFilter = 'all';

  // ---------- Utils ----------
  function faNum(n) {
    return String(n).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[+d]; });
  }
  function $(id) { return document.getElementById(id); }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons)); } catch (e) {}
  }
  function saveDone() {
    try { localStorage.setItem(DONE_KEY, JSON.stringify(doneSet)); } catch (e) {}
  }
  function load() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      lessons = s ? JSON.parse(s) : SEED_LESSONS.slice();
      if (!s) save();
    } catch (e) { lessons = SEED_LESSONS.slice(); }
    try {
      var d = localStorage.getItem(DONE_KEY);
      doneSet = d ? JSON.parse(d) : {};
    } catch (e) { doneSet = {}; }
  }

  // ---------- Render: stats ----------
  function renderStats() {
    $('courseCount').textContent = faNum(lessons.length);
    var doneCount = Object.keys(doneSet).filter(function (id) {
      return lessons.some(function (l) { return l.id === id; });
    }).length;
    $('doneCount').textContent = faNum(doneCount);
    var pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
    $('progressPercent').textContent = faNum(pct) + '٪';
  }

  // ---------- Render: filters ----------
  function renderFilters() {
    var cats = ['all'];
    lessons.forEach(function (l) { if (cats.indexOf(l.category) === -1) cats.push(l.category); });
    var html = cats.map(function (c) {
      var label = c === 'all' ? 'همه' : c;
      var active = currentFilter === c ? ' active' : '';
      return '<button class="filter-chip' + active + '" data-cat="' + c + '">' + label + '</button>';
    }).join('');
    $('filters').innerHTML = html;
  }

  // ---------- Render: course grid ----------
  function renderGrid() {
    var filtered = currentFilter === 'all'
      ? lessons
      : lessons.filter(function (l) { return l.category === currentFilter; });
    var q = ($('searchInput').value || '').trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(function (l) {
        return l.title.toLowerCase().indexOf(q) !== -1 || l.summary.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filtered.length === 0) {
      $('courseGrid').innerHTML = '';
      $('emptyState').classList.remove('hidden');
      return;
    }
    $('emptyState').classList.add('hidden');
    $('courseGrid').innerHTML = filtered.map(function (l) {
      var isDone = doneSet[l.id];
      return '<article class="course-card" data-id="' + l.id + '">' +
        '<span class="card-cat">' + l.category + '</span>' +
        '<h3>' + l.title + '</h3>' +
        '<p>' + l.summary + '</p>' +
        '<div class="card-footer">' +
          (isDone ? '<span class="done-badge">✓ مطالعه‌شده</span>' : '<span></span>') +
          '<span class="read-more">مشاهده ←</span>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  // ---------- Render: admin list ----------
  function renderAdminList() {
    var html = lessons.map(function (l) {
      return '<div class="admin-item" data-id="' + l.id + '">' +
        '<span class="ai-cat">' + l.category + '</span>' +
        '<span class="ai-title">' + l.title + '</span>' +
        '<div class="ai-actions">' +
          '<button class="edit-btn" data-id="' + l.id + '">ویرایش</button>' +
          '<button class="del-btn" data-id="' + l.id + '">حذف</button>' +
        '</div>' +
      '</div>';
    }).join('');
    $('adminLessonList').innerHTML = html;
  }

  // ---------- Modal ----------
  function openLesson(id) {
    var l = lessons.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    $('modalCategory').textContent = l.category;
    $('modalTitle').textContent = l.title;
    $('modalSummary').textContent = l.summary;
    $('modalBody').textContent = l.body;
    $('markDone').dataset.id = id;
    $('copyLesson').dataset.body = l.body;
    if (doneSet[id]) {
      $('markDone').textContent = '✓ مطالعه‌شده';
      $('markDone').disabled = true;
    } else {
      $('markDone').textContent = 'علامت‌گذاری به‌عنوان مطالعه‌شده ✓';
      $('markDone').disabled = false;
    }
    $('lessonModal').classList.remove('hidden');
  }
  function closeModal() { $('lessonModal').classList.add('hidden'); }

  // ---------- Admin form ----------
  function resetLessonForm() {
    $('lessonForm').reset();
    $('lessonId').value = '';
  }
  function fillLessonForm(id) {
    var l = lessons.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    $('lessonId').value = l.id;
    $('lessonTitle').value = l.title;
    $('lessonCategory').value = l.category;
    $('lessonSummary').value = l.summary;
    $('lessonBody').value = l.body;
  }
  function deleteLesson(id) {
    lessons = lessons.filter(function (x) { return x.id !== id; });
    delete doneSet[id];
    save(); saveDone();
    renderAll(); renderAdminList();
  }

  function renderAll() { renderStats(); renderFilters(); renderGrid(); }

  // ---------- Init ----------
  function init() {
    load();
    renderAll();

    // Search
    $('searchInput').addEventListener('input', renderGrid);

    // Filters (delegated)
    $('filters').addEventListener('click', function (e) {
      var chip = e.target.closest('.filter-chip');
      if (!chip) return;
      currentFilter = chip.dataset.cat;
      renderFilters(); renderGrid();
    });

    // Course grid (delegated)
    $('courseGrid').addEventListener('click', function (e) {
      var card = e.target.closest('.course-card');
      if (!card) return;
      openLesson(card.dataset.id);
    });

    // Modal
    $('modalClose').addEventListener('click', closeModal);
    $('modalBackdrop').addEventListener('click', closeModal);
    $('markDone').addEventListener('click', function () {
      var id = this.dataset.id;
      doneSet[id] = true; saveDone();
      closeModal(); renderAll();
    });
    $('copyLesson').addEventListener('click', function () {
      var body = this.dataset.body || '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(body).then(function () {
          var btn = $('copyLesson');
          var orig = btn.textContent;
          btn.textContent = 'کپی شد ✓';
          setTimeout(function () { btn.textContent = orig; }, 1500);
        });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Register toggle
    $('registerToggle').addEventListener('click', function () {
      $('signupPanel').classList.toggle('hidden');
      if (!$('signupPanel').classList.contains('hidden')) {
        $('signupPanel').scrollIntoView({ behavior: 'smooth' });
      }
    });
    $('closeSignup').addEventListener('click', function () { $('signupPanel').classList.add('hidden'); });

    // Signup form
    $('signupForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('signupMessage');
      msg.className = 'success';
      msg.textContent = 'اطلاعات دریافت شد. در نسخهٔ واقعی به درگاه پرداخت هدایت می‌شوید.';
      setTimeout(function () { msg.textContent = ''; msg.className = ''; }, 4000);
    });

    // Face sample
    $('faceSample').addEventListener('change', function () {
      var f = this.files[0];
      $('faceStatus').textContent = f ? 'تصویر انتخاب شد: ' + f.name : 'تصویری انتخاب نشده است.';
    });

    // Admin toggle
    $('adminToggle').addEventListener('click', function () {
      $('adminPanel').classList.toggle('hidden');
      if (!$('adminPanel').classList.contains('hidden')) {
        renderAdminList();
        $('adminPanel').scrollIntoView({ behavior: 'smooth' });
      }
    });
    $('closeAdmin').addEventListener('click', function () { $('adminPanel').classList.add('hidden'); });

    // Admin form
    $('lessonForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var id = $('lessonId').value;
      var title = $('lessonTitle').value.trim();
      var cat = $('lessonCategory').value;
      var summary = $('lessonSummary').value.trim();
      var body = $('lessonBody').value.trim();
      if (!title || !summary || !body) return;
      if (id) {
        lessons = lessons.map(function (l) {
          return l.id === id ? { id: id, title: title, category: cat, summary: summary, body: body } : l;
        });
      } else {
        lessons.push({ id: 'l' + Date.now(), title: title, category: cat, summary: summary, body: body });
      }
      save(); resetLessonForm(); renderAll(); renderAdminList();
    });
    $('cancelEdit').addEventListener('click', resetLessonForm);

    // Admin list (delegated)
    $('adminLessonList').addEventListener('click', function (e) {
      var editBtn = e.target.closest('.edit-btn');
      var delBtn = e.target.closest('.del-btn');
      if (editBtn) { fillLessonForm(editBtn.dataset.id); $('adminPanel').scrollIntoView({ behavior: 'smooth' }); }
      if (delBtn) { deleteLesson(delBtn.dataset.id); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
