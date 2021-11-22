/*! For license information please see novel.js.LICENSE.txt */
(() => {
  'use strict';
  var e = {
      126: (e) => {
        var t = Object.getOwnPropertySymbols,
          r = Object.prototype.hasOwnProperty,
          n = Object.prototype.propertyIsEnumerable;
        function o(e) {
          if (null == e)
            throw new TypeError(
              'Object.assign cannot be called with null or undefined',
            );
          return Object(e);
        }
        e.exports = (function () {
          try {
            if (!Object.assign) return !1;
            var e = new String('abc');
            if (((e[5] = 'de'), '5' === Object.getOwnPropertyNames(e)[0]))
              return !1;
            for (var t = {}, r = 0; r < 10; r++)
              t['_' + String.fromCharCode(r)] = r;
            if (
              '0123456789' !==
              Object.getOwnPropertyNames(t)
                .map(function (e) {
                  return t[e];
                })
                .join('')
            )
              return !1;
            var n = {};
            return (
              'abcdefghijklmnopqrst'.split('').forEach(function (e) {
                n[e] = e;
              }),
              'abcdefghijklmnopqrst' ===
                Object.keys(Object.assign({}, n)).join('')
            );
          } catch (e) {
            return !1;
          }
        })()
          ? Object.assign
          : function (e, u) {
              for (var c, i, a = o(e), l = 1; l < arguments.length; l++) {
                for (var s in (c = Object(arguments[l])))
                  r.call(c, s) && (a[s] = c[s]);
                if (t) {
                  i = t(c);
                  for (var f = 0; f < i.length; f++)
                    n.call(c, i[f]) && (a[i[f]] = c[i[f]]);
                }
              }
              return a;
            };
      },
      100: (e, t, r) => {
        var n = r(126),
          o = 60103,
          u = 60106;
        (t.Fragment = 60107), (t.StrictMode = 60108), (t.Profiler = 60114);
        var c = 60109,
          i = 60110,
          a = 60112;
        t.Suspense = 60113;
        var l = 60115,
          s = 60116;
        if ('function' == typeof Symbol && Symbol.for) {
          var f = Symbol.for;
          (o = f('react.element')),
            (u = f('react.portal')),
            (t.Fragment = f('react.fragment')),
            (t.StrictMode = f('react.strict_mode')),
            (t.Profiler = f('react.profiler')),
            (c = f('react.provider')),
            (i = f('react.context')),
            (a = f('react.forward_ref')),
            (t.Suspense = f('react.suspense')),
            (l = f('react.memo')),
            (s = f('react.lazy'));
        }
        var p = 'function' == typeof Symbol && Symbol.iterator;
        function d(e) {
          for (
            var t =
                'https://reactjs.org/docs/error-decoder.html?invariant=' + e,
              r = 1;
            r < arguments.length;
            r++
          )
            t += '&args[]=' + encodeURIComponent(arguments[r]);
          return (
            'Minified React error #' +
            e +
            '; visit ' +
            t +
            ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
          );
        }
        var y = {
            isMounted: function () {
              return !1;
            },
            enqueueForceUpdate: function () {},
            enqueueReplaceState: function () {},
            enqueueSetState: function () {},
          },
          h = {};
        function v(e, t, r) {
          (this.props = e),
            (this.context = t),
            (this.refs = h),
            (this.updater = r || y);
        }
        function m() {}
        function b(e, t, r) {
          (this.props = e),
            (this.context = t),
            (this.refs = h),
            (this.updater = r || y);
        }
        (v.prototype.isReactComponent = {}),
          (v.prototype.setState = function (e, t) {
            if ('object' != typeof e && 'function' != typeof e && null != e)
              throw Error(d(85));
            this.updater.enqueueSetState(this, e, t, 'setState');
          }),
          (v.prototype.forceUpdate = function (e) {
            this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
          }),
          (m.prototype = v.prototype);
        var g = (b.prototype = new m());
        (g.constructor = b), n(g, v.prototype), (g.isPureReactComponent = !0);
        var _ = { current: null },
          w = Object.prototype.hasOwnProperty,
          j = { key: !0, ref: !0, __self: !0, __source: !0 };
        function O(e, t, r) {
          var n,
            u = {},
            c = null,
            i = null;
          if (null != t)
            for (n in (void 0 !== t.ref && (i = t.ref),
            void 0 !== t.key && (c = '' + t.key),
            t))
              w.call(t, n) && !j.hasOwnProperty(n) && (u[n] = t[n]);
          var a = arguments.length - 2;
          if (1 === a) u.children = r;
          else if (1 < a) {
            for (var l = Array(a), s = 0; s < a; s++) l[s] = arguments[s + 2];
            u.children = l;
          }
          if (e && e.defaultProps)
            for (n in (a = e.defaultProps)) void 0 === u[n] && (u[n] = a[n]);
          return {
            $$typeof: o,
            type: e,
            key: c,
            ref: i,
            props: u,
            _owner: _.current,
          };
        }
        function k(e) {
          return 'object' == typeof e && null !== e && e.$$typeof === o;
        }
        var E = /\/+/g;
        function C(e, t) {
          return 'object' == typeof e && null !== e && null != e.key
            ? (function (e) {
                var t = { '=': '=0', ':': '=2' };
                return (
                  '$' +
                  e.replace(/[=:]/g, function (e) {
                    return t[e];
                  })
                );
              })('' + e.key)
            : t.toString(36);
        }
        function R(e, t, r, n, c) {
          var i = typeof e;
          ('undefined' !== i && 'boolean' !== i) || (e = null);
          var a = !1;
          if (null === e) a = !0;
          else
            switch (i) {
              case 'string':
              case 'number':
                a = !0;
                break;
              case 'object':
                switch (e.$$typeof) {
                  case o:
                  case u:
                    a = !0;
                }
            }
          if (a)
            return (
              (c = c((a = e))),
              (e = '' === n ? '.' + C(a, 0) : n),
              Array.isArray(c)
                ? ((r = ''),
                  null != e && (r = e.replace(E, '$&/') + '/'),
                  R(c, t, r, '', function (e) {
                    return e;
                  }))
                : null != c &&
                  (k(c) &&
                    (c = (function (e, t) {
                      return {
                        $$typeof: o,
                        type: e.type,
                        key: t,
                        ref: e.ref,
                        props: e.props,
                        _owner: e._owner,
                      };
                    })(
                      c,
                      r +
                        (!c.key || (a && a.key === c.key)
                          ? ''
                          : ('' + c.key).replace(E, '$&/') + '/') +
                        e,
                    )),
                  t.push(c)),
              1
            );
          if (((a = 0), (n = '' === n ? '.' : n + ':'), Array.isArray(e)))
            for (var l = 0; l < e.length; l++) {
              var s = n + C((i = e[l]), l);
              a += R(i, t, r, s, c);
            }
          else if (
            'function' ==
            typeof (s = (function (e) {
              return null === e || 'object' != typeof e
                ? null
                : 'function' == typeof (e = (p && e[p]) || e['@@iterator'])
                ? e
                : null;
            })(e))
          )
            for (e = s.call(e), l = 0; !(i = e.next()).done; )
              a += R((i = i.value), t, r, (s = n + C(i, l++)), c);
          else if ('object' === i)
            throw (
              ((t = '' + e),
              Error(
                d(
                  31,
                  '[object Object]' === t
                    ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                    : t,
                ),
              ))
            );
          return a;
        }
        function S(e, t, r) {
          if (null == e) return e;
          var n = [],
            o = 0;
          return (
            R(e, n, '', '', function (e) {
              return t.call(r, e, o++);
            }),
            n
          );
        }
        function $(e) {
          if (-1 === e._status) {
            var t = e._result;
            (t = t()),
              (e._status = 0),
              (e._result = t),
              t.then(
                function (t) {
                  0 === e._status &&
                    ((t = t.default), (e._status = 1), (e._result = t));
                },
                function (t) {
                  0 === e._status && ((e._status = 2), (e._result = t));
                },
              );
          }
          if (1 === e._status) return e._result;
          throw e._result;
        }
        var P = { current: null };
        function x() {
          var e = P.current;
          if (null === e) throw Error(d(321));
          return e;
        }
        var M = {
          ReactCurrentDispatcher: P,
          ReactCurrentBatchConfig: { transition: 0 },
          ReactCurrentOwner: _,
          IsSomeRendererActing: { current: !1 },
          assign: n,
        };
        (t.Children = {
          map: S,
          forEach: function (e, t, r) {
            S(
              e,
              function () {
                t.apply(this, arguments);
              },
              r,
            );
          },
          count: function (e) {
            var t = 0;
            return (
              S(e, function () {
                t++;
              }),
              t
            );
          },
          toArray: function (e) {
            return (
              S(e, function (e) {
                return e;
              }) || []
            );
          },
          only: function (e) {
            if (!k(e)) throw Error(d(143));
            return e;
          },
        }),
          (t.Component = v),
          (t.PureComponent = b),
          (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = M),
          (t.cloneElement = function (e, t, r) {
            if (null == e) throw Error(d(267, e));
            var u = n({}, e.props),
              c = e.key,
              i = e.ref,
              a = e._owner;
            if (null != t) {
              if (
                (void 0 !== t.ref && ((i = t.ref), (a = _.current)),
                void 0 !== t.key && (c = '' + t.key),
                e.type && e.type.defaultProps)
              )
                var l = e.type.defaultProps;
              for (s in t)
                w.call(t, s) &&
                  !j.hasOwnProperty(s) &&
                  (u[s] = void 0 === t[s] && void 0 !== l ? l[s] : t[s]);
            }
            var s = arguments.length - 2;
            if (1 === s) u.children = r;
            else if (1 < s) {
              l = Array(s);
              for (var f = 0; f < s; f++) l[f] = arguments[f + 2];
              u.children = l;
            }
            return {
              $$typeof: o,
              type: e.type,
              key: c,
              ref: i,
              props: u,
              _owner: a,
            };
          }),
          (t.createContext = function (e, t) {
            return (
              void 0 === t && (t = null),
              ((e = {
                $$typeof: i,
                _calculateChangedBits: t,
                _currentValue: e,
                _currentValue2: e,
                _threadCount: 0,
                Provider: null,
                Consumer: null,
              }).Provider = { $$typeof: c, _context: e }),
              (e.Consumer = e)
            );
          }),
          (t.createElement = O),
          (t.createFactory = function (e) {
            var t = O.bind(null, e);
            return (t.type = e), t;
          }),
          (t.createRef = function () {
            return { current: null };
          }),
          (t.forwardRef = function (e) {
            return { $$typeof: a, render: e };
          }),
          (t.isValidElement = k),
          (t.lazy = function (e) {
            return {
              $$typeof: s,
              _payload: { _status: -1, _result: e },
              _init: $,
            };
          }),
          (t.memo = function (e, t) {
            return { $$typeof: l, type: e, compare: void 0 === t ? null : t };
          }),
          (t.useCallback = function (e, t) {
            return x().useCallback(e, t);
          }),
          (t.useContext = function (e, t) {
            return x().useContext(e, t);
          }),
          (t.useDebugValue = function () {}),
          (t.useEffect = function (e, t) {
            return x().useEffect(e, t);
          }),
          (t.useImperativeHandle = function (e, t, r) {
            return x().useImperativeHandle(e, t, r);
          }),
          (t.useLayoutEffect = function (e, t) {
            return x().useLayoutEffect(e, t);
          }),
          (t.useMemo = function (e, t) {
            return x().useMemo(e, t);
          }),
          (t.useReducer = function (e, t, r) {
            return x().useReducer(e, t, r);
          }),
          (t.useRef = function (e) {
            return x().useRef(e);
          }),
          (t.useState = function (e) {
            return x().useState(e);
          }),
          (t.version = '17.0.2');
      },
      301: (e, t, r) => {
        e.exports = r(100);
      },
    },
    t = {};
  function r(n) {
    var o = t[n];
    if (void 0 !== o) return o.exports;
    var u = (t[n] = { exports: {} });
    return e[n](u, u.exports, r), u.exports;
  }
  (() => {
    Object.create, Object.create;
    class e extends HTMLElement {
      constructor() {
        super();
      }
      set nodeTree(e) {}
      set shadowRootNode(e) {}
      get shadowRootNode() {
        return this._shadowRootNode;
      }
      get nodeTree() {
        return this._nodeTree;
      }
      connectedCallback() {
        var e, t, r, n, o, u;
        return (
          (r = this),
          (n = void 0),
          (u = function* () {
            this._shadowRootNode = this.attachShadow({ mode: 'open' });
            const r = this.beforeMount,
              n = this.mounted;
            console.log('---beforeMount---'),
              r && 'function' == typeof r && (yield this.beforeMount()),
              console.log('--mounting--');
            const o = this.render && this.render();
            (this._nodeTree = o),
              (null === (e = this._nodeTree) || void 0 === e
                ? void 0
                : e.node) &&
                (null === (t = this._shadowRootNode) ||
                  void 0 === t ||
                  t.append(this._nodeTree.node)),
              console.log('--mounted--'),
              n && 'function' == typeof n && (yield this.mounted());
          }),
          new ((o = void 0) || (o = Promise))(function (e, t) {
            function c(e) {
              try {
                a(u.next(e));
              } catch (e) {
                t(e);
              }
            }
            function i(e) {
              try {
                a(u.throw(e));
              } catch (e) {
                t(e);
              }
            }
            function a(t) {
              var r;
              t.done
                ? e(t.value)
                : ((r = t.value),
                  r instanceof o
                    ? r
                    : new o(function (e) {
                        e(r);
                      })).then(c, i);
            }
            a((u = u.apply(r, n || [])).next());
          })
        );
      }
      render() {
        return null;
      }
    }
    const t = e;
    var n = r(301);
    HTMLElement;
    let o = class {
      handleClick() {
        console.log('a');
      }
      beforeMount() {
        console.log('a', this.render());
      }
      mounted() {}
      attributeChangedCallback(e, t, r) {
        console.log(e, t, r);
      }
      render() {
        return n.createElement(
          'div',
          { onClick: this.handleClick },
          n.createElement(
            'div',
            null,
            '11 ',
            n.createElement('span', null, '33'),
          ),
          n.createElement('span', null, '22'),
        );
      }
    };
    o = (function (e, t, r, n) {
      var o,
        u = arguments.length,
        c =
          u < 3
            ? t
            : null === n
            ? (n = Object.getOwnPropertyDescriptor(t, r))
            : n;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        c = Reflect.decorate(e, t, r, n);
      else
        for (var i = e.length - 1; i >= 0; i--)
          (o = e[i]) &&
            (c = (u < 3 ? o(c) : u > 3 ? o(t, r, c) : o(t, r)) || c);
      return u > 3 && c && Object.defineProperty(t, r, c), c;
    })(
      [
        (e) => {
          (e.prototype.speak = function () {
            console.log('I can speak ', this.language);
          }),
            (function (e, r, n) {
              const o = !!customElements.get(e);
              console.log(r.prototype, 'elCtor'),
                o ||
                  (Object.getOwnPropertyNames(r.prototype).map((e) => {
                    'constructor' !== e && (t.prototype[e] = r.prototype[e]);
                  }),
                  customElements.define(e, t));
            })('n-a', e);
        },
      ],
      o,
    );
  })();
})();
