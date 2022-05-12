(() => {
  "use strict";
  const t = {
    alwaysOpen: !1,
    activeClasses: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
    inactiveClasses: "text-gray-500 dark:text-gray-400",
    onOpen: () => {},
    onClose: () => {},
  };
  class e {
    constructor(e = [], i = {}) {
      (this._items = e), (this._options = { ...t, ...i }), this._init();
    }
    _init() {
      this._items.length &&
        this._items.map((t) => {
          t.active && this.open(t.id),
            t.triggerEl.addEventListener("click", () => {
              this.toggle(t.id);
            });
        });
    }
    getItem(t) {
      return this._items.filter((e) => e.id === t)[0];
    }
    open(t) {
      const e = this.getItem(t);
      this._options.alwaysOpen ||
        this._items.map((t) => {
          t !== e &&
            (t.triggerEl.classList.remove(...this._options.activeClasses.split(" ")),
            t.triggerEl.classList.add(...this._options.inactiveClasses.split(" ")),
            t.targetEl.classList.add("hidden"),
            t.triggerEl.setAttribute("aria-expanded", !1),
            (t.active = !1),
            t.iconEl && t.iconEl.classList.remove("rotate-180"));
        }),
        e.triggerEl.classList.add(...this._options.activeClasses.split(" ")),
        e.triggerEl.classList.remove(...this._options.inactiveClasses.split(" ")),
        e.triggerEl.setAttribute("aria-expanded", !0),
        e.targetEl.classList.remove("hidden"),
        (e.active = !0),
        e.iconEl && e.iconEl.classList.add("rotate-180"),
        this._options.onOpen(this, e);
    }
    toggle(t) {
      const e = this.getItem(t);
      e.active ? this.close(t) : this.open(t), this._options.onToggle(this, e);
    }
    close(t) {
      const e = this.getItem(t);
      e.triggerEl.classList.remove(...this._options.activeClasses.split(" ")),
        e.triggerEl.classList.add(...this._options.inactiveClasses.split(" ")),
        e.targetEl.classList.add("hidden"),
        e.triggerEl.setAttribute("aria-expanded", !1),
        (e.active = !1),
        e.iconEl && e.iconEl.classList.remove("rotate-180"),
        this._options.onClose(this, e);
    }
  }
  (window.Accordion = e),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-accordion]").forEach((i) => {
        const s = i.getAttribute("data-accordion"),
          n = i.getAttribute("data-active-classes"),
          r = i.getAttribute("data-inactive-classes"),
          o = [];
        i.querySelectorAll("[data-accordion-target]").forEach((t) => {
          const e = {
            id: t.getAttribute("data-accordion-target"),
            triggerEl: t,
            targetEl: document.querySelector(t.getAttribute("data-accordion-target")),
            iconEl: t.querySelector("[data-accordion-icon]"),
            active: "true" === t.getAttribute("aria-expanded"),
          };
          o.push(e);
        }),
          new e(o, { alwaysOpen: "open" === s, activeClasses: n || t.activeClasses, inactiveClasses: r || t.inactiveClasses });
      });
    });
  const i = { triggerEl: null, onCollapse: () => {}, onExpand: () => {}, onToggle: () => {} };
  class s {
    constructor(t = null, e) {
      (this._targetEl = t), (this._triggerEl = e ? e.triggerEl : i.triggerEl), (this._options = { ...i, ...e }), (this._visible = !1), this._init();
    }
    _init() {
      this._triggerEl &&
        (this._triggerEl.hasAttribute("aria-expanded")
          ? (this._visible = "true" === this._triggerEl.getAttribute("aria-expanded"))
          : (this._visible = !this._targetEl.classList.contains("hidden")),
        this._triggerEl.addEventListener("click", () => {
          this._visible ? this.collapse() : this.expand();
        }));
    }
    collapse() {
      this._targetEl.classList.add("hidden"),
        this._triggerEl && this._triggerEl.setAttribute("aria-expanded", "false"),
        (this._visible = !1),
        this._options.onCollapse(this);
    }
    expand() {
      this._targetEl.classList.remove("hidden"),
        this._triggerEl && this._triggerEl.setAttribute("aria-expanded", "true"),
        (this._visible = !0),
        this._options.onExpand(this);
    }
    toggle() {
      this._visible ? this.collapse() : this.expand();
    }
  }
  (window.Collapse = s),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-collapse-toggle]").forEach((t) => {
        const e = document.getElementById(t.getAttribute("data-collapse-toggle"));
        new s(e, { triggerEl: t });
      });
    });
  const n = {
    defaultPosition: 0,
    indicators: {
      items: [],
      activeClasses: "bg-white dark:bg-gray-800",
      inactiveClasses: "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800",
    },
    interval: 3e3,
    onNext: () => {},
    onPrev: () => {},
    onChange: () => {},
  };
  class r {
    constructor(t = [], e = {}) {
      (this._items = t),
        (this._options = { ...n, ...e, indicators: { ...n.indicators, ...e.indicators } }),
        (this._activeItem = this.getItem(this._options.defaultPosition)),
        (this._indicators = this._options.indicators.items),
        (this._interval = null),
        this._init();
    }
    _init() {
      this._items.map((t) => {
        t.el.classList.add("absolute", "inset-0", "transition-all", "transform");
      }),
        this._getActiveItem() ? this.slideTo(this._getActiveItem().position) : this.slideTo(0),
        this._indicators.map((t, e) => {
          t.el.addEventListener("click", () => {
            this.slideTo(e);
          });
        });
    }
    getItem(t) {
      return this._items[t];
    }
    slideTo(t) {
      const e = this._items[t],
        i = {
          left: 0 === e.position ? this._items[this._items.length - 1] : this._items[e.position - 1],
          middle: e,
          right: e.position === this._items.length - 1 ? this._items[0] : this._items[e.position + 1],
        };
      this._rotate(i), this._setActiveItem(e.position), this._interval && (this.pause(), this.cycle()), this._options.onChange(this);
    }
    next() {
      const t = this._getActiveItem();
      let e = null;
      (e = t.position === this._items.length - 1 ? this._items[0] : this._items[t.position + 1]),
        this.slideTo(e.position),
        this._options.onNext(this);
    }
    prev() {
      const t = this._getActiveItem();
      let e = null;
      (e = 0 === t.position ? this._items[this._items.length - 1] : this._items[t.position - 1]),
        this.slideTo(e.position),
        this._options.onPrev(this);
    }
    _rotate(t) {
      this._items.map((t) => {
        t.el.classList.add("hidden");
      }),
        t.left.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20"),
        t.left.el.classList.add("-translate-x-full", "z-10"),
        t.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10"),
        t.middle.el.classList.add("translate-x-0", "z-20"),
        t.right.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20"),
        t.right.el.classList.add("translate-x-full", "z-10");
    }
    cycle() {
      this._interval = setInterval(() => {
        this.next();
      }, this._options.interval);
    }
    pause() {
      clearInterval(this._interval);
    }
    _getActiveItem() {
      return this._activeItem;
    }
    _setActiveItem(t) {
      (this._activeItem = this._items[t]),
        this._indicators.length &&
          (this._indicators.map((t) => {
            t.el.setAttribute("aria-current", "false"),
              t.el.classList.remove(...this._options.indicators.activeClasses.split(" ")),
              t.el.classList.add(...this._options.indicators.inactiveClasses.split(" "));
          }),
          this._indicators[t].el.classList.add(...this._options.indicators.activeClasses.split(" ")),
          this._indicators[t].el.classList.remove(...this._options.indicators.inactiveClasses.split(" ")),
          this._indicators[t].el.setAttribute("aria-current", "true"));
    }
  }
  (window.Carousel = r),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-carousel]").forEach((t) => {
        const e = t.getAttribute("data-carousel-interval"),
          i = "slide" === t.getAttribute("data-carousel"),
          s = [];
        let o = 0;
        t.querySelectorAll("[data-carousel-item]").length &&
          [...t.querySelectorAll("[data-carousel-item]")].map((t, e) => {
            s.push({ position: e, el: t }), "active" === t.getAttribute("data-carousel-item") && (o = e);
          });
        const a = [];
        t.querySelectorAll("[data-carousel-slide-to]").length &&
          [...t.querySelectorAll("[data-carousel-slide-to]")].map((t) => {
            a.push({ position: t.getAttribute("data-carousel-slide-to"), el: t });
          });
        const l = new r(s, { defaultPosition: o, indicators: { items: a }, interval: e || n.interval });
        i && l.cycle();
        const c = t.querySelector("[data-carousel-next]"),
          d = t.querySelector("[data-carousel-prev]");
        c &&
          c.addEventListener("click", () => {
            l.next();
          }),
          d &&
            d.addEventListener("click", () => {
              l.prev();
            });
      });
    });
  const o = { triggerEl: null, transition: "transition-opacity", duration: 300, timing: "ease-out", onHide: () => {} };
  class a {
    constructor(t = null, e = {}) {
      (this._targetEl = t), (this._triggerEl = e ? e.triggerEl : o.triggerEl), (this._options = { ...o, ...e }), this._init();
    }
    _init() {
      this._triggerEl &&
        this._triggerEl.addEventListener("click", () => {
          this.hide();
        });
    }
    hide() {
      this._targetEl.classList.add(this._options.transition, `duration-${this._options.duration}`, this._options.timing, "opacity-0"),
        setTimeout(() => {
          this._targetEl.classList.add("hidden");
        }, this._options.duration),
        this._options.onHide(this, this._targetEl);
    }
  }
  function l(t) {
    if (null == t) return window;
    if ("[object Window]" !== t.toString()) {
      var e = t.ownerDocument;
      return (e && e.defaultView) || window;
    }
    return t;
  }
  function c(t) {
    return t instanceof l(t).Element || t instanceof Element;
  }
  function d(t) {
    return t instanceof l(t).HTMLElement || t instanceof HTMLElement;
  }
  function p(t) {
    return "undefined" != typeof ShadowRoot && (t instanceof l(t).ShadowRoot || t instanceof ShadowRoot);
  }
  (window.Dismiss = a),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-dismiss-target]").forEach((t) => {
        const e = document.querySelector(t.getAttribute("data-dismiss-target"));
        new a(e, { triggerEl: t });
      });
    });
  var u = Math.max,
    h = Math.min,
    f = Math.round;
  function g(t, e) {
    void 0 === e && (e = !1);
    var i = t.getBoundingClientRect(),
      s = 1,
      n = 1;
    if (d(t) && e) {
      var r = t.offsetHeight,
        o = t.offsetWidth;
      o > 0 && (s = f(i.width) / o || 1), r > 0 && (n = f(i.height) / r || 1);
    }
    return {
      width: i.width / s,
      height: i.height / n,
      top: i.top / n,
      right: i.right / s,
      bottom: i.bottom / n,
      left: i.left / s,
      x: i.left / s,
      y: i.top / n,
    };
  }
  function m(t) {
    var e = l(t);
    return { scrollLeft: e.pageXOffset, scrollTop: e.pageYOffset };
  }
  function v(t) {
    return t ? (t.nodeName || "").toLowerCase() : null;
  }
  function b(t) {
    return ((c(t) ? t.ownerDocument : t.document) || window.document).documentElement;
  }
  function _(t) {
    return g(b(t)).left + m(t).scrollLeft;
  }
  function y(t) {
    return l(t).getComputedStyle(t);
  }
  function E(t) {
    var e = y(t),
      i = e.overflow,
      s = e.overflowX,
      n = e.overflowY;
    return /auto|scroll|overlay|hidden/.test(i + n + s);
  }
  function w(t, e, i) {
    void 0 === i && (i = !1);
    var s,
      n,
      r = d(e),
      o =
        d(e) &&
        (function (t) {
          var e = t.getBoundingClientRect(),
            i = f(e.width) / t.offsetWidth || 1,
            s = f(e.height) / t.offsetHeight || 1;
          return 1 !== i || 1 !== s;
        })(e),
      a = b(e),
      c = g(t, o),
      p = { scrollLeft: 0, scrollTop: 0 },
      u = { x: 0, y: 0 };
    return (
      (r || (!r && !i)) &&
        (("body" !== v(e) || E(a)) && (p = (s = e) !== l(s) && d(s) ? { scrollLeft: (n = s).scrollLeft, scrollTop: n.scrollTop } : m(s)),
        d(e) ? (((u = g(e, !0)).x += e.clientLeft), (u.y += e.clientTop)) : a && (u.x = _(a))),
      { x: c.left + p.scrollLeft - u.x, y: c.top + p.scrollTop - u.y, width: c.width, height: c.height }
    );
  }
  function x(t) {
    var e = g(t),
      i = t.offsetWidth,
      s = t.offsetHeight;
    return (
      Math.abs(e.width - i) <= 1 && (i = e.width),
      Math.abs(e.height - s) <= 1 && (s = e.height),
      { x: t.offsetLeft, y: t.offsetTop, width: i, height: s }
    );
  }
  function L(t) {
    return "html" === v(t) ? t : t.assignedSlot || t.parentNode || (p(t) ? t.host : null) || b(t);
  }
  function O(t) {
    return ["html", "body", "#document"].indexOf(v(t)) >= 0 ? t.ownerDocument.body : d(t) && E(t) ? t : O(L(t));
  }
  function A(t, e) {
    var i;
    void 0 === e && (e = []);
    var s = O(t),
      n = s === (null == (i = t.ownerDocument) ? void 0 : i.body),
      r = l(s),
      o = n ? [r].concat(r.visualViewport || [], E(s) ? s : []) : s,
      a = e.concat(o);
    return n ? a : a.concat(A(L(o)));
  }
  function k(t) {
    return ["table", "td", "th"].indexOf(v(t)) >= 0;
  }
  function C(t) {
    return d(t) && "fixed" !== y(t).position ? t.offsetParent : null;
  }
  function T(t) {
    for (var e = l(t), i = C(t); i && k(i) && "static" === y(i).position; ) i = C(i);
    return i && ("html" === v(i) || ("body" === v(i) && "static" === y(i).position))
      ? e
      : i ||
          (function (t) {
            var e = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
            if (-1 !== navigator.userAgent.indexOf("Trident") && d(t) && "fixed" === y(t).position) return null;
            var i = L(t);
            for (p(i) && (i = i.host); d(i) && ["html", "body"].indexOf(v(i)) < 0; ) {
              var s = y(i);
              if (
                "none" !== s.transform ||
                "none" !== s.perspective ||
                "paint" === s.contain ||
                -1 !== ["transform", "perspective"].indexOf(s.willChange) ||
                (e && "filter" === s.willChange) ||
                (e && s.filter && "none" !== s.filter)
              )
                return i;
              i = i.parentNode;
            }
            return null;
          })(t) ||
          e;
  }
  var j = "top",
    I = "bottom",
    S = "right",
    D = "left",
    q = "auto",
    H = [j, I, S, D],
    P = "start",
    M = "end",
    B = "viewport",
    W = "popper",
    R = H.reduce(function (t, e) {
      return t.concat([e + "-" + P, e + "-" + M]);
    }, []),
    z = [].concat(H, [q]).reduce(function (t, e) {
      return t.concat([e, e + "-" + P, e + "-" + M]);
    }, []),
    V = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];
  function N(t) {
    var e = new Map(),
      i = new Set(),
      s = [];
    function n(t) {
      i.add(t.name),
        [].concat(t.requires || [], t.requiresIfExists || []).forEach(function (t) {
          if (!i.has(t)) {
            var s = e.get(t);
            s && n(s);
          }
        }),
        s.push(t);
    }
    return (
      t.forEach(function (t) {
        e.set(t.name, t);
      }),
      t.forEach(function (t) {
        i.has(t.name) || n(t);
      }),
      s
    );
  }
  var F = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function U() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
    return !e.some(function (t) {
      return !(t && "function" == typeof t.getBoundingClientRect);
    });
  }
  function X(t) {
    void 0 === t && (t = {});
    var e = t,
      i = e.defaultModifiers,
      s = void 0 === i ? [] : i,
      n = e.defaultOptions,
      r = void 0 === n ? F : n;
    return function (t, e, i) {
      void 0 === i && (i = r);
      var n,
        o,
        a = {
          placement: "bottom",
          orderedModifiers: [],
          options: Object.assign({}, F, r),
          modifiersData: {},
          elements: { reference: t, popper: e },
          attributes: {},
          styles: {},
        },
        l = [],
        d = !1,
        p = {
          state: a,
          setOptions: function (i) {
            var n = "function" == typeof i ? i(a.options) : i;
            u(),
              (a.options = Object.assign({}, r, a.options, n)),
              (a.scrollParents = { reference: c(t) ? A(t) : t.contextElement ? A(t.contextElement) : [], popper: A(e) });
            var o,
              d,
              h = (function (t) {
                var e = N(t);
                return V.reduce(function (t, i) {
                  return t.concat(
                    e.filter(function (t) {
                      return t.phase === i;
                    })
                  );
                }, []);
              })(
                ((o = [].concat(s, a.options.modifiers)),
                (d = o.reduce(function (t, e) {
                  var i = t[e.name];
                  return (
                    (t[e.name] = i
                      ? Object.assign({}, i, e, { options: Object.assign({}, i.options, e.options), data: Object.assign({}, i.data, e.data) })
                      : e),
                    t
                  );
                }, {})),
                Object.keys(d).map(function (t) {
                  return d[t];
                }))
              );
            return (
              (a.orderedModifiers = h.filter(function (t) {
                return t.enabled;
              })),
              a.orderedModifiers.forEach(function (t) {
                var e = t.name,
                  i = t.options,
                  s = void 0 === i ? {} : i,
                  n = t.effect;
                if ("function" == typeof n) {
                  var r = n({ state: a, name: e, instance: p, options: s });
                  l.push(r || function () {});
                }
              }),
              p.update()
            );
          },
          forceUpdate: function () {
            if (!d) {
              var t = a.elements,
                e = t.reference,
                i = t.popper;
              if (U(e, i)) {
                (a.rects = { reference: w(e, T(i), "fixed" === a.options.strategy), popper: x(i) }),
                  (a.reset = !1),
                  (a.placement = a.options.placement),
                  a.orderedModifiers.forEach(function (t) {
                    return (a.modifiersData[t.name] = Object.assign({}, t.data));
                  });
                for (var s = 0; s < a.orderedModifiers.length; s++)
                  if (!0 !== a.reset) {
                    var n = a.orderedModifiers[s],
                      r = n.fn,
                      o = n.options,
                      l = void 0 === o ? {} : o,
                      c = n.name;
                    "function" == typeof r && (a = r({ state: a, options: l, name: c, instance: p }) || a);
                  } else (a.reset = !1), (s = -1);
              }
            }
          },
          update:
            ((n = function () {
              return new Promise(function (t) {
                p.forceUpdate(), t(a);
              });
            }),
            function () {
              return (
                o ||
                  (o = new Promise(function (t) {
                    Promise.resolve().then(function () {
                      (o = void 0), t(n());
                    });
                  })),
                o
              );
            }),
          destroy: function () {
            u(), (d = !0);
          },
        };
      if (!U(t, e)) return p;
      function u() {
        l.forEach(function (t) {
          return t();
        }),
          (l = []);
      }
      return (
        p.setOptions(i).then(function (t) {
          !d && i.onFirstUpdate && i.onFirstUpdate(t);
        }),
        p
      );
    };
  }
  var Y = { passive: !0 };
  function $(t) {
    return t.split("-")[0];
  }
  function G(t) {
    return t.split("-")[1];
  }
  function J(t) {
    return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
  }
  function K(t) {
    var e,
      i = t.reference,
      s = t.element,
      n = t.placement,
      r = n ? $(n) : null,
      o = n ? G(n) : null,
      a = i.x + i.width / 2 - s.width / 2,
      l = i.y + i.height / 2 - s.height / 2;
    switch (r) {
      case j:
        e = { x: a, y: i.y - s.height };
        break;
      case I:
        e = { x: a, y: i.y + i.height };
        break;
      case S:
        e = { x: i.x + i.width, y: l };
        break;
      case D:
        e = { x: i.x - s.width, y: l };
        break;
      default:
        e = { x: i.x, y: i.y };
    }
    var c = r ? J(r) : null;
    if (null != c) {
      var d = "y" === c ? "height" : "width";
      switch (o) {
        case P:
          e[c] = e[c] - (i[d] / 2 - s[d] / 2);
          break;
        case M:
          e[c] = e[c] + (i[d] / 2 - s[d] / 2);
      }
    }
    return e;
  }
  var Q = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function Z(t) {
    var e,
      i = t.popper,
      s = t.popperRect,
      n = t.placement,
      r = t.variation,
      o = t.offsets,
      a = t.position,
      c = t.gpuAcceleration,
      d = t.adaptive,
      p = t.roundOffsets,
      u = t.isFixed,
      h = o.x,
      g = void 0 === h ? 0 : h,
      m = o.y,
      v = void 0 === m ? 0 : m,
      _ = "function" == typeof p ? p({ x: g, y: v }) : { x: g, y: v };
    (g = _.x), (v = _.y);
    var E = o.hasOwnProperty("x"),
      w = o.hasOwnProperty("y"),
      x = D,
      L = j,
      O = window;
    if (d) {
      var A = T(i),
        k = "clientHeight",
        C = "clientWidth";
      A === l(i) && "static" !== y((A = b(i))).position && "absolute" === a && ((k = "scrollHeight"), (C = "scrollWidth")),
        (A = A),
        (n === j || ((n === D || n === S) && r === M)) &&
          ((L = I), (v -= (u && A === O && O.visualViewport ? O.visualViewport.height : A[k]) - s.height), (v *= c ? 1 : -1)),
        (n !== D && ((n !== j && n !== I) || r !== M)) ||
          ((x = S), (g -= (u && A === O && O.visualViewport ? O.visualViewport.width : A[C]) - s.width), (g *= c ? 1 : -1));
    }
    var q,
      H = Object.assign({ position: a }, d && Q),
      P =
        !0 === p
          ? (function (t) {
              var e = t.x,
                i = t.y,
                s = window.devicePixelRatio || 1;
              return { x: f(e * s) / s || 0, y: f(i * s) / s || 0 };
            })({ x: g, y: v })
          : { x: g, y: v };
    return (
      (g = P.x),
      (v = P.y),
      c
        ? Object.assign(
            {},
            H,
            (((q = {})[L] = w ? "0" : ""),
            (q[x] = E ? "0" : ""),
            (q.transform = (O.devicePixelRatio || 1) <= 1 ? "translate(" + g + "px, " + v + "px)" : "translate3d(" + g + "px, " + v + "px, 0)"),
            q)
          )
        : Object.assign({}, H, (((e = {})[L] = w ? v + "px" : ""), (e[x] = E ? g + "px" : ""), (e.transform = ""), e))
    );
  }
  var tt = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function et(t) {
    return t.replace(/left|right|bottom|top/g, function (t) {
      return tt[t];
    });
  }
  var it = { start: "end", end: "start" };
  function st(t) {
    return t.replace(/start|end/g, function (t) {
      return it[t];
    });
  }
  function nt(t, e) {
    var i = e.getRootNode && e.getRootNode();
    if (t.contains(e)) return !0;
    if (i && p(i)) {
      var s = e;
      do {
        if (s && t.isSameNode(s)) return !0;
        s = s.parentNode || s.host;
      } while (s);
    }
    return !1;
  }
  function rt(t) {
    return Object.assign({}, t, { left: t.x, top: t.y, right: t.x + t.width, bottom: t.y + t.height });
  }
  function ot(t, e) {
    return e === B
      ? rt(
          (function (t) {
            var e = l(t),
              i = b(t),
              s = e.visualViewport,
              n = i.clientWidth,
              r = i.clientHeight,
              o = 0,
              a = 0;
            return (
              s &&
                ((n = s.width),
                (r = s.height),
                /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || ((o = s.offsetLeft), (a = s.offsetTop))),
              { width: n, height: r, x: o + _(t), y: a }
            );
          })(t)
        )
      : c(e)
      ? (function (t) {
          var e = g(t);
          return (
            (e.top = e.top + t.clientTop),
            (e.left = e.left + t.clientLeft),
            (e.bottom = e.top + t.clientHeight),
            (e.right = e.left + t.clientWidth),
            (e.width = t.clientWidth),
            (e.height = t.clientHeight),
            (e.x = e.left),
            (e.y = e.top),
            e
          );
        })(e)
      : rt(
          (function (t) {
            var e,
              i = b(t),
              s = m(t),
              n = null == (e = t.ownerDocument) ? void 0 : e.body,
              r = u(i.scrollWidth, i.clientWidth, n ? n.scrollWidth : 0, n ? n.clientWidth : 0),
              o = u(i.scrollHeight, i.clientHeight, n ? n.scrollHeight : 0, n ? n.clientHeight : 0),
              a = -s.scrollLeft + _(t),
              l = -s.scrollTop;
            return "rtl" === y(n || i).direction && (a += u(i.clientWidth, n ? n.clientWidth : 0) - r), { width: r, height: o, x: a, y: l };
          })(b(t))
        );
  }
  function at(t) {
    return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, t);
  }
  function lt(t, e) {
    return e.reduce(function (e, i) {
      return (e[i] = t), e;
    }, {});
  }
  function ct(t, e) {
    void 0 === e && (e = {});
    var i = e,
      s = i.placement,
      n = void 0 === s ? t.placement : s,
      r = i.boundary,
      o = void 0 === r ? "clippingParents" : r,
      a = i.rootBoundary,
      l = void 0 === a ? B : a,
      p = i.elementContext,
      f = void 0 === p ? W : p,
      m = i.altBoundary,
      _ = void 0 !== m && m,
      E = i.padding,
      w = void 0 === E ? 0 : E,
      x = at("number" != typeof w ? w : lt(w, H)),
      O = f === W ? "reference" : W,
      k = t.rects.popper,
      C = t.elements[_ ? O : f],
      D = (function (t, e, i) {
        var s =
            "clippingParents" === e
              ? (function (t) {
                  var e = A(L(t)),
                    i = ["absolute", "fixed"].indexOf(y(t).position) >= 0 && d(t) ? T(t) : t;
                  return c(i)
                    ? e.filter(function (t) {
                        return c(t) && nt(t, i) && "body" !== v(t);
                      })
                    : [];
                })(t)
              : [].concat(e),
          n = [].concat(s, [i]),
          r = n[0],
          o = n.reduce(function (e, i) {
            var s = ot(t, i);
            return (e.top = u(s.top, e.top)), (e.right = h(s.right, e.right)), (e.bottom = h(s.bottom, e.bottom)), (e.left = u(s.left, e.left)), e;
          }, ot(t, r));
        return (o.width = o.right - o.left), (o.height = o.bottom - o.top), (o.x = o.left), (o.y = o.top), o;
      })(c(C) ? C : C.contextElement || b(t.elements.popper), o, l),
      q = g(t.elements.reference),
      P = K({ reference: q, element: k, strategy: "absolute", placement: n }),
      M = rt(Object.assign({}, k, P)),
      R = f === W ? M : q,
      z = { top: D.top - R.top + x.top, bottom: R.bottom - D.bottom + x.bottom, left: D.left - R.left + x.left, right: R.right - D.right + x.right },
      V = t.modifiersData.offset;
    if (f === W && V) {
      var N = V[n];
      Object.keys(z).forEach(function (t) {
        var e = [S, I].indexOf(t) >= 0 ? 1 : -1,
          i = [j, I].indexOf(t) >= 0 ? "y" : "x";
        z[t] += N[i] * e;
      });
    }
    return z;
  }
  function dt(t, e, i) {
    return u(t, h(e, i));
  }
  function pt(t, e, i) {
    return (
      void 0 === i && (i = { x: 0, y: 0 }),
      { top: t.top - e.height - i.y, right: t.right - e.width + i.x, bottom: t.bottom - e.height + i.y, left: t.left - e.width - i.x }
    );
  }
  function ut(t) {
    return [j, S, I, D].some(function (e) {
      return t[e] >= 0;
    });
  }
  var ht = X({
    defaultModifiers: [
      {
        name: "eventListeners",
        enabled: !0,
        phase: "write",
        fn: function () {},
        effect: function (t) {
          var e = t.state,
            i = t.instance,
            s = t.options,
            n = s.scroll,
            r = void 0 === n || n,
            o = s.resize,
            a = void 0 === o || o,
            c = l(e.elements.popper),
            d = [].concat(e.scrollParents.reference, e.scrollParents.popper);
          return (
            r &&
              d.forEach(function (t) {
                t.addEventListener("scroll", i.update, Y);
              }),
            a && c.addEventListener("resize", i.update, Y),
            function () {
              r &&
                d.forEach(function (t) {
                  t.removeEventListener("scroll", i.update, Y);
                }),
                a && c.removeEventListener("resize", i.update, Y);
            }
          );
        },
        data: {},
      },
      {
        name: "popperOffsets",
        enabled: !0,
        phase: "read",
        fn: function (t) {
          var e = t.state,
            i = t.name;
          e.modifiersData[i] = K({ reference: e.rects.reference, element: e.rects.popper, strategy: "absolute", placement: e.placement });
        },
        data: {},
      },
      {
        name: "computeStyles",
        enabled: !0,
        phase: "beforeWrite",
        fn: function (t) {
          var e = t.state,
            i = t.options,
            s = i.gpuAcceleration,
            n = void 0 === s || s,
            r = i.adaptive,
            o = void 0 === r || r,
            a = i.roundOffsets,
            l = void 0 === a || a,
            c = {
              placement: $(e.placement),
              variation: G(e.placement),
              popper: e.elements.popper,
              popperRect: e.rects.popper,
              gpuAcceleration: n,
              isFixed: "fixed" === e.options.strategy,
            };
          null != e.modifiersData.popperOffsets &&
            (e.styles.popper = Object.assign(
              {},
              e.styles.popper,
              Z(Object.assign({}, c, { offsets: e.modifiersData.popperOffsets, position: e.options.strategy, adaptive: o, roundOffsets: l }))
            )),
            null != e.modifiersData.arrow &&
              (e.styles.arrow = Object.assign(
                {},
                e.styles.arrow,
                Z(Object.assign({}, c, { offsets: e.modifiersData.arrow, position: "absolute", adaptive: !1, roundOffsets: l }))
              )),
            (e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-placement": e.placement }));
        },
        data: {},
      },
      {
        name: "applyStyles",
        enabled: !0,
        phase: "write",
        fn: function (t) {
          var e = t.state;
          Object.keys(e.elements).forEach(function (t) {
            var i = e.styles[t] || {},
              s = e.attributes[t] || {},
              n = e.elements[t];
            d(n) &&
              v(n) &&
              (Object.assign(n.style, i),
              Object.keys(s).forEach(function (t) {
                var e = s[t];
                !1 === e ? n.removeAttribute(t) : n.setAttribute(t, !0 === e ? "" : e);
              }));
          });
        },
        effect: function (t) {
          var e = t.state,
            i = { popper: { position: e.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
          return (
            Object.assign(e.elements.popper.style, i.popper),
            (e.styles = i),
            e.elements.arrow && Object.assign(e.elements.arrow.style, i.arrow),
            function () {
              Object.keys(e.elements).forEach(function (t) {
                var s = e.elements[t],
                  n = e.attributes[t] || {},
                  r = Object.keys(e.styles.hasOwnProperty(t) ? e.styles[t] : i[t]).reduce(function (t, e) {
                    return (t[e] = ""), t;
                  }, {});
                d(s) &&
                  v(s) &&
                  (Object.assign(s.style, r),
                  Object.keys(n).forEach(function (t) {
                    s.removeAttribute(t);
                  }));
              });
            }
          );
        },
        requires: ["computeStyles"],
      },
      {
        name: "offset",
        enabled: !0,
        phase: "main",
        requires: ["popperOffsets"],
        fn: function (t) {
          var e = t.state,
            i = t.options,
            s = t.name,
            n = i.offset,
            r = void 0 === n ? [0, 0] : n,
            o = z.reduce(function (t, i) {
              return (
                (t[i] = (function (t, e, i) {
                  var s = $(t),
                    n = [D, j].indexOf(s) >= 0 ? -1 : 1,
                    r = "function" == typeof i ? i(Object.assign({}, e, { placement: t })) : i,
                    o = r[0],
                    a = r[1];
                  return (o = o || 0), (a = (a || 0) * n), [D, S].indexOf(s) >= 0 ? { x: a, y: o } : { x: o, y: a };
                })(i, e.rects, r)),
                t
              );
            }, {}),
            a = o[e.placement],
            l = a.x,
            c = a.y;
          null != e.modifiersData.popperOffsets && ((e.modifiersData.popperOffsets.x += l), (e.modifiersData.popperOffsets.y += c)),
            (e.modifiersData[s] = o);
        },
      },
      {
        name: "flip",
        enabled: !0,
        phase: "main",
        fn: function (t) {
          var e = t.state,
            i = t.options,
            s = t.name;
          if (!e.modifiersData[s]._skip) {
            for (
              var n = i.mainAxis,
                r = void 0 === n || n,
                o = i.altAxis,
                a = void 0 === o || o,
                l = i.fallbackPlacements,
                c = i.padding,
                d = i.boundary,
                p = i.rootBoundary,
                u = i.altBoundary,
                h = i.flipVariations,
                f = void 0 === h || h,
                g = i.allowedAutoPlacements,
                m = e.options.placement,
                v = $(m),
                b =
                  l ||
                  (v !== m && f
                    ? (function (t) {
                        if ($(t) === q) return [];
                        var e = et(t);
                        return [st(t), e, st(e)];
                      })(m)
                    : [et(m)]),
                _ = [m].concat(b).reduce(function (t, i) {
                  return t.concat(
                    $(i) === q
                      ? (function (t, e) {
                          void 0 === e && (e = {});
                          var i = e,
                            s = i.placement,
                            n = i.boundary,
                            r = i.rootBoundary,
                            o = i.padding,
                            a = i.flipVariations,
                            l = i.allowedAutoPlacements,
                            c = void 0 === l ? z : l,
                            d = G(s),
                            p = d
                              ? a
                                ? R
                                : R.filter(function (t) {
                                    return G(t) === d;
                                  })
                              : H,
                            u = p.filter(function (t) {
                              return c.indexOf(t) >= 0;
                            });
                          0 === u.length && (u = p);
                          var h = u.reduce(function (e, i) {
                            return (e[i] = ct(t, { placement: i, boundary: n, rootBoundary: r, padding: o })[$(i)]), e;
                          }, {});
                          return Object.keys(h).sort(function (t, e) {
                            return h[t] - h[e];
                          });
                        })(e, { placement: i, boundary: d, rootBoundary: p, padding: c, flipVariations: f, allowedAutoPlacements: g })
                      : i
                  );
                }, []),
                y = e.rects.reference,
                E = e.rects.popper,
                w = new Map(),
                x = !0,
                L = _[0],
                O = 0;
              O < _.length;
              O++
            ) {
              var A = _[O],
                k = $(A),
                C = G(A) === P,
                T = [j, I].indexOf(k) >= 0,
                M = T ? "width" : "height",
                B = ct(e, { placement: A, boundary: d, rootBoundary: p, altBoundary: u, padding: c }),
                W = T ? (C ? S : D) : C ? I : j;
              y[M] > E[M] && (W = et(W));
              var V = et(W),
                N = [];
              if (
                (r && N.push(B[k] <= 0),
                a && N.push(B[W] <= 0, B[V] <= 0),
                N.every(function (t) {
                  return t;
                }))
              ) {
                (L = A), (x = !1);
                break;
              }
              w.set(A, N);
            }
            if (x)
              for (
                var F = function (t) {
                    var e = _.find(function (e) {
                      var i = w.get(e);
                      if (i)
                        return i.slice(0, t).every(function (t) {
                          return t;
                        });
                    });
                    if (e) return (L = e), "break";
                  },
                  U = f ? 3 : 1;
                U > 0 && "break" !== F(U);
                U--
              );
            e.placement !== L && ((e.modifiersData[s]._skip = !0), (e.placement = L), (e.reset = !0));
          }
        },
        requiresIfExists: ["offset"],
        data: { _skip: !1 },
      },
      {
        name: "preventOverflow",
        enabled: !0,
        phase: "main",
        fn: function (t) {
          var e = t.state,
            i = t.options,
            s = t.name,
            n = i.mainAxis,
            r = void 0 === n || n,
            o = i.altAxis,
            a = void 0 !== o && o,
            l = i.boundary,
            c = i.rootBoundary,
            d = i.altBoundary,
            p = i.padding,
            f = i.tether,
            g = void 0 === f || f,
            m = i.tetherOffset,
            v = void 0 === m ? 0 : m,
            b = ct(e, { boundary: l, rootBoundary: c, padding: p, altBoundary: d }),
            _ = $(e.placement),
            y = G(e.placement),
            E = !y,
            w = J(_),
            L = "x" === w ? "y" : "x",
            O = e.modifiersData.popperOffsets,
            A = e.rects.reference,
            k = e.rects.popper,
            C = "function" == typeof v ? v(Object.assign({}, e.rects, { placement: e.placement })) : v,
            q = "number" == typeof C ? { mainAxis: C, altAxis: C } : Object.assign({ mainAxis: 0, altAxis: 0 }, C),
            H = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null,
            M = { x: 0, y: 0 };
          if (O) {
            if (r) {
              var B,
                W = "y" === w ? j : D,
                R = "y" === w ? I : S,
                z = "y" === w ? "height" : "width",
                V = O[w],
                N = V + b[W],
                F = V - b[R],
                U = g ? -k[z] / 2 : 0,
                X = y === P ? A[z] : k[z],
                Y = y === P ? -k[z] : -A[z],
                K = e.elements.arrow,
                Q = g && K ? x(K) : { width: 0, height: 0 },
                Z = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : { top: 0, right: 0, bottom: 0, left: 0 },
                tt = Z[W],
                et = Z[R],
                it = dt(0, A[z], Q[z]),
                st = E ? A[z] / 2 - U - it - tt - q.mainAxis : X - it - tt - q.mainAxis,
                nt = E ? -A[z] / 2 + U + it + et + q.mainAxis : Y + it + et + q.mainAxis,
                rt = e.elements.arrow && T(e.elements.arrow),
                ot = rt ? ("y" === w ? rt.clientTop || 0 : rt.clientLeft || 0) : 0,
                at = null != (B = null == H ? void 0 : H[w]) ? B : 0,
                lt = V + nt - at,
                pt = dt(g ? h(N, V + st - at - ot) : N, V, g ? u(F, lt) : F);
              (O[w] = pt), (M[w] = pt - V);
            }
            if (a) {
              var ut,
                ht = "x" === w ? j : D,
                ft = "x" === w ? I : S,
                gt = O[L],
                mt = "y" === L ? "height" : "width",
                vt = gt + b[ht],
                bt = gt - b[ft],
                _t = -1 !== [j, D].indexOf(_),
                yt = null != (ut = null == H ? void 0 : H[L]) ? ut : 0,
                Et = _t ? vt : gt - A[mt] - k[mt] - yt + q.altAxis,
                wt = _t ? gt + A[mt] + k[mt] - yt - q.altAxis : bt,
                xt =
                  g && _t
                    ? (function (t, e, i) {
                        var s = dt(t, e, i);
                        return s > i ? i : s;
                      })(Et, gt, wt)
                    : dt(g ? Et : vt, gt, g ? wt : bt);
              (O[L] = xt), (M[L] = xt - gt);
            }
            e.modifiersData[s] = M;
          }
        },
        requiresIfExists: ["offset"],
      },
      {
        name: "arrow",
        enabled: !0,
        phase: "main",
        fn: function (t) {
          var e,
            i = t.state,
            s = t.name,
            n = t.options,
            r = i.elements.arrow,
            o = i.modifiersData.popperOffsets,
            a = $(i.placement),
            l = J(a),
            c = [D, S].indexOf(a) >= 0 ? "height" : "width";
          if (r && o) {
            var d = (function (t, e) {
                return at(
                  "number" != typeof (t = "function" == typeof t ? t(Object.assign({}, e.rects, { placement: e.placement })) : t) ? t : lt(t, H)
                );
              })(n.padding, i),
              p = x(r),
              u = "y" === l ? j : D,
              h = "y" === l ? I : S,
              f = i.rects.reference[c] + i.rects.reference[l] - o[l] - i.rects.popper[c],
              g = o[l] - i.rects.reference[l],
              m = T(r),
              v = m ? ("y" === l ? m.clientHeight || 0 : m.clientWidth || 0) : 0,
              b = f / 2 - g / 2,
              _ = d[u],
              y = v - p[c] - d[h],
              E = v / 2 - p[c] / 2 + b,
              w = dt(_, E, y),
              L = l;
            i.modifiersData[s] = (((e = {})[L] = w), (e.centerOffset = w - E), e);
          }
        },
        effect: function (t) {
          var e = t.state,
            i = t.options.element,
            s = void 0 === i ? "[data-popper-arrow]" : i;
          null != s && ("string" != typeof s || (s = e.elements.popper.querySelector(s))) && nt(e.elements.popper, s) && (e.elements.arrow = s);
        },
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"],
      },
      {
        name: "hide",
        enabled: !0,
        phase: "main",
        requiresIfExists: ["preventOverflow"],
        fn: function (t) {
          var e = t.state,
            i = t.name,
            s = e.rects.reference,
            n = e.rects.popper,
            r = e.modifiersData.preventOverflow,
            o = ct(e, { elementContext: "reference" }),
            a = ct(e, { altBoundary: !0 }),
            l = pt(o, s),
            c = pt(a, n, r),
            d = ut(l),
            p = ut(c);
          (e.modifiersData[i] = { referenceClippingOffsets: l, popperEscapeOffsets: c, isReferenceHidden: d, hasPopperEscaped: p }),
            (e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-reference-hidden": d, "data-popper-escaped": p }));
        },
      },
    ],
  });
  const ft = { placement: "bottom", triggerType: "click", onShow: () => {}, onHide: () => {} };
  class gt {
    constructor(t = null, e = null, i = {}) {
      (this._targetEl = t),
        (this._triggerEl = e),
        (this._options = { ...ft, ...i }),
        (this._popperInstance = this._createPopperInstace()),
        (this._visible = !1),
        this._init();
    }
    _init() {
      this._triggerEl &&
        this._triggerEl.addEventListener("click", () => {
          this.toggle();
        });
    }
    _createPopperInstace() {
      return ht(this._triggerEl, this._targetEl, {
        placement: this._options.placement,
        modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
      });
    }
    _handleClickOutside(t, e) {
      const i = t.target;
      i === e || e.contains(i) || this._triggerEl.contains(i) || !this._visible || this.hide(),
        document.body.removeEventListener("click", this._handleClickOutside, !0);
    }
    toggle() {
      this._visible ? (this.hide(), document.body.removeEventListener("click", this._handleClickOutside, !0)) : this.show();
    }
    show() {
      this._targetEl.classList.remove("hidden"),
        this._targetEl.classList.add("block"),
        this._popperInstance.setOptions((t) => ({ ...t, modifiers: [...t.modifiers, { name: "eventListeners", enabled: !0 }] })),
        document.body.addEventListener(
          "click",
          (t) => {
            this._handleClickOutside(t, this._targetEl);
          },
          !0
        ),
        this._popperInstance.update(),
        (this._visible = !0),
        this._options.onShow(this);
    }
    hide() {
      this._targetEl.classList.remove("block"),
        this._targetEl.classList.add("hidden"),
        this._popperInstance.setOptions((t) => ({ ...t, modifiers: [...t.modifiers, { name: "eventListeners", enabled: !1 }] })),
        (this._visible = !1),
        this._options.onHide(this);
    }
  }
  (window.Dropdown = gt),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-dropdown-toggle]").forEach((t) => {
        const e = document.getElementById(t.getAttribute("data-dropdown-toggle")),
          i = t.getAttribute("data-dropdown-placement");
        new gt(e, t, { placement: i || ft.placement });
      });
    });
  const mt = {
    placement: "center",
    backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
    onHide: () => {},
    onShow: () => {},
    onToggle: () => {},
  };
  class vt {
    constructor(t = null, e = {}) {
      (this._targetEl = t), (this._options = { ...mt, ...e }), (this._isHidden = !0), this._init();
    }
    _init() {
      this._getPlacementClasses().map((t) => {
        this._targetEl.classList.add(t);
      });
    }
    _createBackdrop() {
      if (this._isHidden) {
        const t = document.createElement("div");
        t.setAttribute("modal-backdrop", ""), t.classList.add(...this._options.backdropClasses.split(" ")), document.querySelector("body").append(t);
      }
    }
    _destroyBackdropEl() {
      this._isHidden || document.querySelector("[modal-backdrop]").remove();
    }
    _getPlacementClasses() {
      switch (this._options.placement) {
        case "top-left":
          return ["justify-start", "items-start"];
        case "top-center":
          return ["justify-center", "items-start"];
        case "top-right":
          return ["justify-end", "items-start"];
        case "center-left":
          return ["justify-start", "items-center"];
        case "center":
        default:
          return ["justify-center", "items-center"];
        case "center-right":
          return ["justify-end", "items-center"];
        case "bottom-left":
          return ["justify-start", "items-end"];
        case "bottom-center":
          return ["justify-center", "items-end"];
        case "bottom-right":
          return ["justify-end", "items-end"];
      }
    }
    toggle() {
      this._isHidden ? this.show() : this.hide(), this._options.onToggle(this);
    }
    show() {
      this._targetEl.classList.add("flex"),
        this._targetEl.classList.remove("hidden"),
        this._targetEl.setAttribute("aria-modal", "true"),
        this._targetEl.setAttribute("role", "dialog"),
        this._targetEl.removeAttribute("aria-hidden"),
        this._createBackdrop(),
        (this._isHidden = !1),
        this._options.onShow(this);
    }
    hide() {
      this._targetEl.classList.add("hidden"),
        this._targetEl.classList.remove("flex"),
        this._targetEl.setAttribute("aria-hidden", "true"),
        this._targetEl.removeAttribute("aria-modal"),
        this._targetEl.removeAttribute("role"),
        this._destroyBackdropEl(),
        (this._isHidden = !0),
        this._options.onHide(this);
    }
  }
  window.Modal = vt;
  const bt = (t, e) => !!e.some((e) => e.id === t) && e.find((e) => e.id === t);
  document.addEventListener("DOMContentLoaded", () => {
    let t = [];
    document.querySelectorAll("[data-modal-toggle]").forEach((e) => {
      const i = e.getAttribute("data-modal-toggle"),
        s = document.getElementById(i),
        n = s.getAttribute("data-modal-placement");
      s && (s.hasAttribute("aria-hidden") || s.hasAttribute("aria-modal") || s.setAttribute("aria-hidden", "true"));
      let r = null;
      bt(i, t) ? ((r = bt(i, t)), (r = r.object)) : ((r = new vt(s, { placement: n || mt.placement })), t.push({ id: i, object: r })),
        e.addEventListener("click", () => {
          r.toggle();
        });
    });
  });
  const _t = {
    defaultTabId: null,
    activeClasses: "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500",
    inactiveClasses:
      "text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
    onShow: () => {},
  };
  class yt {
    constructor(t = [], e = {}) {
      (this._items = t), (this._activeTab = e ? this.getTab(e.defaultTabId) : null), (this._options = { ..._t, ...e }), this._init();
    }
    _init() {
      this._items.length &&
        (this._activeTab || this._setActiveTab(this._items[0]),
        this.show(this._activeTab.id, !0),
        this._items.map((t) => {
          t.triggerEl.addEventListener("click", () => {
            this.show(t.id);
          });
        }));
    }
    getActiveTab() {
      return this._activeTab;
    }
    _setActiveTab(t) {
      this._activeTab = t;
    }
    getTab(t) {
      return this._items.filter((e) => e.id === t)[0];
    }
    show(t, e = !1) {
      const i = this.getTab(t);
      (i !== this._activeTab || e) &&
        (this._items.map((t) => {
          t !== i &&
            (t.triggerEl.classList.remove(...this._options.activeClasses.split(" ")),
            t.triggerEl.classList.add(...this._options.inactiveClasses.split(" ")),
            t.targetEl.classList.add("hidden"),
            t.triggerEl.setAttribute("aria-selected", !1));
        }),
        i.triggerEl.classList.add(...this._options.activeClasses.split(" ")),
        i.triggerEl.classList.remove(...this._options.inactiveClasses.split(" ")),
        i.triggerEl.setAttribute("aria-selected", !0),
        i.targetEl.classList.remove("hidden"),
        this._setActiveTab(i),
        this._options.onShow(this, i));
    }
  }
  (window.Tabs = yt),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-tabs-toggle]").forEach((t) => {
        const e = [];
        let i = null;
        t.querySelectorAll('[role="tab"]').forEach((t) => {
          const s = "true" === t.getAttribute("aria-selected"),
            n = { id: t.getAttribute("data-tabs-target"), triggerEl: t, targetEl: document.querySelector(t.getAttribute("data-tabs-target")) };
          e.push(n), s && (i = n.id);
        }),
          new yt(e, { defaultTabId: i });
      });
    });
  const Et = { placement: "top", triggerType: "hover", onShow: () => {}, onHide: () => {} };
  class wt {
    constructor(t = null, e = null, i = {}) {
      (this._targetEl = t),
        (this._triggerEl = e),
        (this._options = { ...Et, ...i }),
        (this._popperInstance = this._createPopperInstace()),
        this._init();
    }
    _init() {
      if (this._triggerEl) {
        const t = this._getTriggerEvents();
        t.showEvents.forEach((t) => {
          this._triggerEl.addEventListener(t, () => {
            this.show();
          });
        }),
          t.hideEvents.forEach((t) => {
            this._triggerEl.addEventListener(t, () => {
              this.hide();
            });
          });
      }
    }
    _createPopperInstace() {
      return ht(this._triggerEl, this._targetEl, {
        placement: this._options.placement,
        modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
      });
    }
    _getTriggerEvents() {
      switch (this._options.triggerType) {
        case "hover":
        default:
          return { showEvents: ["mouseenter", "focus"], hideEvents: ["mouseleave", "blur"] };
        case "click":
          return { showEvents: ["click", "focus"], hideEvents: ["focusout", "blur"] };
      }
    }
    show() {
      this._targetEl.classList.remove("opacity-0", "invisible"),
        this._targetEl.classList.add("opacity-100", "visible"),
        this._popperInstance.setOptions((t) => ({ ...t, modifiers: [...t.modifiers, { name: "eventListeners", enabled: !0 }] })),
        this._popperInstance.update(),
        this._options.onShow(this);
    }
    hide() {
      this._targetEl.classList.remove("opacity-100", "visible"),
        this._targetEl.classList.add("opacity-0", "invisible"),
        this._popperInstance.setOptions((t) => ({ ...t, modifiers: [...t.modifiers, { name: "eventListeners", enabled: !1 }] })),
        this._options.onHide(this);
    }
  }
  (window.Tooltip = wt),
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-tooltip-target]").forEach((t) => {
        const e = document.getElementById(t.getAttribute("data-tooltip-target")),
          i = t.getAttribute("data-tooltip-trigger"),
          s = t.getAttribute("data-tooltip-placement");
        new wt(e, t, { placement: s || Et.placement, triggerType: i || Et.triggerType });
      });
    });
})();
