/* xigai — 交互脚本：导航、进度、滚动入场、标签页 */
(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var progress = document.querySelector(".progress");
  var toTop = document.querySelector(".to-top");

  /* 移动端菜单 */
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* 滚动状态：导航底色、进度条、回到顶部 */
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var doc = document.documentElement;

    if (nav) nav.classList.toggle("is-solid", y > 40);

    if (progress) {
      var total = doc.scrollHeight - window.innerHeight;
      var ratio = total > 0 ? y / total : 0;
      progress.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
    }

    if (toTop) toTop.classList.toggle("is-visible", y > 560);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 滚动入场 */
  var items = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.dataset.delay || 0;
          setTimeout(function () { el.classList.add("is-in"); }, Number(delay));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* 标签页 */
  var tabButtons = document.querySelectorAll(".tab");

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");

      tabButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });

      document.querySelectorAll(".panel").forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === target);
      });
    });
  });

  /* 当前页面高亮 */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll('.nav__links a[data-nav="' + page + '"]').forEach(function (a) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    });
  }
})();
