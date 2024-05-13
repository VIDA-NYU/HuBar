/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/robust-orientation/orientation.js":
/*!********************************************************!*\
  !*** ./node_modules/robust-orientation/orientation.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar twoProduct = __webpack_require__(/*! two-product */ \"./node_modules/two-product/two-product.js\")\nvar robustSum = __webpack_require__(/*! robust-sum */ \"./node_modules/robust-sum/robust-sum.js\")\nvar robustScale = __webpack_require__(/*! robust-scale */ \"./node_modules/robust-scale/robust-scale.js\")\nvar robustSubtract = __webpack_require__(/*! robust-subtract */ \"./node_modules/robust-subtract/robust-diff.js\")\n\nvar NUM_EXPAND = 5\n\nvar EPSILON     = 1.1102230246251565e-16\nvar ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON\nvar ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON\n\nfunction orientation_3(sum, prod, scale, sub) {\n  return function orientation3Exact(m0, m1, m2) {\n    var p = sum(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])))\n    var n = sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0]))\n    var d = sub(p, n)\n    return d[d.length - 1]\n  }\n}\n\nfunction orientation_4(sum, prod, scale, sub) {\n  return function orientation4Exact(m0, m1, m2, m3) {\n    var p = sum(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))))\n    var n = sum(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))))\n    var d = sub(p, n)\n    return d[d.length - 1]\n  }\n}\n\nfunction orientation_5(sum, prod, scale, sub) {\n  return function orientation5Exact(m0, m1, m2, m3, m4) {\n    var p = sum(sum(sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m2[2]), sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), -m3[2]), scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m4[2]))), m1[3]), sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m3[2]), scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m4[2]))), -m2[3]), scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m4[2]))), m3[3]))), sum(scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), -m4[3]), sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m3[2]), scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m3[2]), scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), m4[2]))), -m1[3])))), sum(sum(scale(sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m4[2]))), m3[3]), sum(scale(sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))), -m4[3]), scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), m0[3]))), sum(scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), -m1[3]), sum(scale(sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))), m2[3]), scale(sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))), -m3[3])))))\n    var n = sum(sum(sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m2[2]), sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), -m3[2]), scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m3[2]), scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), m4[2]))), -m2[3])), sum(scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m4[2]))), m3[3]), scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), -m4[3]))), sum(sum(scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m4[2]))), -m1[3])), sum(scale(sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m4[2]))), m2[3]), scale(sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))), -m4[3]))))\n    var d = sub(p, n)\n    return d[d.length - 1]\n  }\n}\n\nfunction orientation(n) {\n  var fn =\n    n === 3 ? orientation_3 :\n    n === 4 ? orientation_4 : orientation_5\n\n  return fn(robustSum, twoProduct, robustScale, robustSubtract)\n}\n\nvar orientation3Exact = orientation(3)\nvar orientation4Exact = orientation(4)\n\nvar CACHED = [\n  function orientation0() { return 0 },\n  function orientation1() { return 0 },\n  function orientation2(a, b) {\n    return b[0] - a[0]\n  },\n  function orientation3(a, b, c) {\n    var l = (a[1] - c[1]) * (b[0] - c[0])\n    var r = (a[0] - c[0]) * (b[1] - c[1])\n    var det = l - r\n    var s\n    if(l > 0) {\n      if(r <= 0) {\n        return det\n      } else {\n        s = l + r\n      }\n    } else if(l < 0) {\n      if(r >= 0) {\n        return det\n      } else {\n        s = -(l + r)\n      }\n    } else {\n      return det\n    }\n    var tol = ERRBOUND3 * s\n    if(det >= tol || det <= -tol) {\n      return det\n    }\n    return orientation3Exact(a, b, c)\n  },\n  function orientation4(a,b,c,d) {\n    var adx = a[0] - d[0]\n    var bdx = b[0] - d[0]\n    var cdx = c[0] - d[0]\n    var ady = a[1] - d[1]\n    var bdy = b[1] - d[1]\n    var cdy = c[1] - d[1]\n    var adz = a[2] - d[2]\n    var bdz = b[2] - d[2]\n    var cdz = c[2] - d[2]\n    var bdxcdy = bdx * cdy\n    var cdxbdy = cdx * bdy\n    var cdxady = cdx * ady\n    var adxcdy = adx * cdy\n    var adxbdy = adx * bdy\n    var bdxady = bdx * ady\n    var det = adz * (bdxcdy - cdxbdy)\n            + bdz * (cdxady - adxcdy)\n            + cdz * (adxbdy - bdxady)\n    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)\n                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)\n                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)\n    var tol = ERRBOUND4 * permanent\n    if ((det > tol) || (-det > tol)) {\n      return det\n    }\n    return orientation4Exact(a,b,c,d)\n  }\n]\n\nfunction slowOrient(args) {\n  var proc = CACHED[args.length]\n  if(!proc) {\n    proc = CACHED[args.length] = orientation(args.length)\n  }\n  return proc.apply(undefined, args)\n}\n\nfunction proc (slow, o0, o1, o2, o3, o4, o5) {\n  return function getOrientation(a0, a1, a2, a3, a4) {\n    switch (arguments.length) {\n      case 0:\n      case 1:\n        return 0;\n      case 2:\n        return o2(a0, a1)\n      case 3:\n        return o3(a0, a1, a2)\n      case 4:\n        return o4(a0, a1, a2, a3)\n      case 5:\n        return o5(a0, a1, a2, a3, a4)\n    }\n\n    var s = new Array(arguments.length)\n    for (var i = 0; i < arguments.length; ++i) {\n      s[i] = arguments[i]\n    }\n    return slow(s)\n  }\n}\n\nfunction generateOrientationProc() {\n  while(CACHED.length <= NUM_EXPAND) {\n    CACHED.push(orientation(CACHED.length))\n  }\n  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))\n  for(var i=0; i<=NUM_EXPAND; ++i) {\n    module.exports[i] = CACHED[i]\n  }\n}\n\ngenerateOrientationProc()\n\n//# sourceURL=webpack://hubar/./node_modules/robust-orientation/orientation.js?");

/***/ }),

/***/ "./node_modules/robust-point-in-polygon/robust-pnp.js":
/*!************************************************************!*\
  !*** ./node_modules/robust-point-in-polygon/robust-pnp.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = robustPointInPolygon\n\nvar orient = __webpack_require__(/*! robust-orientation */ \"./node_modules/robust-orientation/orientation.js\")\n\nfunction robustPointInPolygon(vs, point) {\n  var x = point[0]\n  var y = point[1]\n  var n = vs.length\n  var inside = 1\n  var lim = n\n  for(var i = 0, j = n-1; i<lim; j=i++) {\n    var a = vs[i]\n    var b = vs[j]\n    var yi = a[1]\n    var yj = b[1]\n    if(yj < yi) {\n      if(yj < y && y < yi) {\n        var s = orient(a, b, point)\n        if(s === 0) {\n          return 0\n        } else {\n          inside ^= (0 < s)|0\n        }\n      } else if(y === yi) {\n        var c = vs[(i+1)%n]\n        var yk = c[1]\n        if(yi < yk) {\n          var s = orient(a, b, point)\n          if(s === 0) {\n            return 0\n          } else {\n            inside ^= (0 < s)|0\n          }\n        }\n      }\n    } else if(yi < yj) {\n      if(yi < y && y < yj) {\n        var s = orient(a, b, point)\n        if(s === 0) {\n          return 0\n        } else {\n          inside ^= (s < 0)|0\n        }\n      } else if(y === yi) {\n        var c = vs[(i+1)%n]\n        var yk = c[1]\n        if(yk < yi) {\n          var s = orient(a, b, point)\n          if(s === 0) {\n            return 0\n          } else {\n            inside ^= (s < 0)|0\n          }\n        }\n      }\n    } else if(y === yi) {\n      var x0 = Math.min(a[0], b[0])\n      var x1 = Math.max(a[0], b[0])\n      if(i === 0) {\n        while(j>0) {\n          var k = (j+n-1)%n\n          var p = vs[k]\n          if(p[1] !== y) {\n            break\n          }\n          var px = p[0]\n          x0 = Math.min(x0, px)\n          x1 = Math.max(x1, px)\n          j = k\n        }\n        if(j === 0) {\n          if(x0 <= x && x <= x1) {\n            return 0\n          }\n          return 1 \n        }\n        lim = j+1\n      }\n      var y0 = vs[(j+n-1)%n][1]\n      while(i+1<lim) {\n        var p = vs[i+1]\n        if(p[1] !== y) {\n          break\n        }\n        var px = p[0]\n        x0 = Math.min(x0, px)\n        x1 = Math.max(x1, px)\n        i += 1\n      }\n      if(x0 <= x && x <= x1) {\n        return 0\n      }\n      var y1 = vs[(i+1)%n][1]\n      if(x < x0 && (y0 < y !== y1 < y)) {\n        inside ^= 1\n      }\n    }\n  }\n  return 2 * inside - 1\n}\n\n//# sourceURL=webpack://hubar/./node_modules/robust-point-in-polygon/robust-pnp.js?");

/***/ }),

/***/ "./node_modules/robust-scale/robust-scale.js":
/*!***************************************************!*\
  !*** ./node_modules/robust-scale/robust-scale.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar twoProduct = __webpack_require__(/*! two-product */ \"./node_modules/two-product/two-product.js\")\nvar twoSum = __webpack_require__(/*! two-sum */ \"./node_modules/two-sum/two-sum.js\")\n\nmodule.exports = scaleLinearExpansion\n\nfunction scaleLinearExpansion(e, scale) {\n  var n = e.length\n  if(n === 1) {\n    var ts = twoProduct(e[0], scale)\n    if(ts[0]) {\n      return ts\n    }\n    return [ ts[1] ]\n  }\n  var g = new Array(2 * n)\n  var q = [0.1, 0.1]\n  var t = [0.1, 0.1]\n  var count = 0\n  twoProduct(e[0], scale, q)\n  if(q[0]) {\n    g[count++] = q[0]\n  }\n  for(var i=1; i<n; ++i) {\n    twoProduct(e[i], scale, t)\n    var pq = q[1]\n    twoSum(pq, t[0], q)\n    if(q[0]) {\n      g[count++] = q[0]\n    }\n    var a = t[1]\n    var b = q[1]\n    var x = a + b\n    var bv = x - a\n    var y = b - bv\n    q[1] = x\n    if(y) {\n      g[count++] = y\n    }\n  }\n  if(q[1]) {\n    g[count++] = q[1]\n  }\n  if(count === 0) {\n    g[count++] = 0.0\n  }\n  g.length = count\n  return g\n}\n\n//# sourceURL=webpack://hubar/./node_modules/robust-scale/robust-scale.js?");

/***/ }),

/***/ "./node_modules/robust-subtract/robust-diff.js":
/*!*****************************************************!*\
  !*** ./node_modules/robust-subtract/robust-diff.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = robustSubtract\n\n//Easy case: Add two scalars\nfunction scalarScalar(a, b) {\n  var x = a + b\n  var bv = x - a\n  var av = x - bv\n  var br = b - bv\n  var ar = a - av\n  var y = ar + br\n  if(y) {\n    return [y, x]\n  }\n  return [x]\n}\n\nfunction robustSubtract(e, f) {\n  var ne = e.length|0\n  var nf = f.length|0\n  if(ne === 1 && nf === 1) {\n    return scalarScalar(e[0], -f[0])\n  }\n  var n = ne + nf\n  var g = new Array(n)\n  var count = 0\n  var eptr = 0\n  var fptr = 0\n  var abs = Math.abs\n  var ei = e[eptr]\n  var ea = abs(ei)\n  var fi = -f[fptr]\n  var fa = abs(fi)\n  var a, b\n  if(ea < fa) {\n    b = ei\n    eptr += 1\n    if(eptr < ne) {\n      ei = e[eptr]\n      ea = abs(ei)\n    }\n  } else {\n    b = fi\n    fptr += 1\n    if(fptr < nf) {\n      fi = -f[fptr]\n      fa = abs(fi)\n    }\n  }\n  if((eptr < ne && ea < fa) || (fptr >= nf)) {\n    a = ei\n    eptr += 1\n    if(eptr < ne) {\n      ei = e[eptr]\n      ea = abs(ei)\n    }\n  } else {\n    a = fi\n    fptr += 1\n    if(fptr < nf) {\n      fi = -f[fptr]\n      fa = abs(fi)\n    }\n  }\n  var x = a + b\n  var bv = x - a\n  var y = b - bv\n  var q0 = y\n  var q1 = x\n  var _x, _bv, _av, _br, _ar\n  while(eptr < ne && fptr < nf) {\n    if(ea < fa) {\n      a = ei\n      eptr += 1\n      if(eptr < ne) {\n        ei = e[eptr]\n        ea = abs(ei)\n      }\n    } else {\n      a = fi\n      fptr += 1\n      if(fptr < nf) {\n        fi = -f[fptr]\n        fa = abs(fi)\n      }\n    }\n    b = q0\n    x = a + b\n    bv = x - a\n    y = b - bv\n    if(y) {\n      g[count++] = y\n    }\n    _x = q1 + x\n    _bv = _x - q1\n    _av = _x - _bv\n    _br = x - _bv\n    _ar = q1 - _av\n    q0 = _ar + _br\n    q1 = _x\n  }\n  while(eptr < ne) {\n    a = ei\n    b = q0\n    x = a + b\n    bv = x - a\n    y = b - bv\n    if(y) {\n      g[count++] = y\n    }\n    _x = q1 + x\n    _bv = _x - q1\n    _av = _x - _bv\n    _br = x - _bv\n    _ar = q1 - _av\n    q0 = _ar + _br\n    q1 = _x\n    eptr += 1\n    if(eptr < ne) {\n      ei = e[eptr]\n    }\n  }\n  while(fptr < nf) {\n    a = fi\n    b = q0\n    x = a + b\n    bv = x - a\n    y = b - bv\n    if(y) {\n      g[count++] = y\n    } \n    _x = q1 + x\n    _bv = _x - q1\n    _av = _x - _bv\n    _br = x - _bv\n    _ar = q1 - _av\n    q0 = _ar + _br\n    q1 = _x\n    fptr += 1\n    if(fptr < nf) {\n      fi = -f[fptr]\n    }\n  }\n  if(q0) {\n    g[count++] = q0\n  }\n  if(q1) {\n    g[count++] = q1\n  }\n  if(!count) {\n    g[count++] = 0.0  \n  }\n  g.length = count\n  return g\n}\n\n//# sourceURL=webpack://hubar/./node_modules/robust-subtract/robust-diff.js?");

/***/ }),

/***/ "./node_modules/robust-sum/robust-sum.js":
/*!***********************************************!*\
  !*** ./node_modules/robust-sum/robust-sum.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = linearExpansionSum\n\n//Easy case: Add two scalars\nfunction scalarScalar(a, b) {\n  var x = a + b\n  var bv = x - a\n  var av = x - bv\n  var br = b - bv\n  var ar = a - av\n  var y = ar + br\n  if(y) {\n    return [y, x]\n  }\n  return [x]\n}\n\nfunction linearExpansionSum(e, f) {\n  var ne = e.length|0\n  var nf = f.length|0\n  if(ne === 1 && nf === 1) {\n    return scalarScalar(e[0], f[0])\n  }\n  var n = ne + nf\n  var g = new Array(n)\n  var count = 0\n  var eptr = 0\n  var fptr = 0\n  var abs = Math.abs\n  var ei = e[eptr]\n  var ea = abs(ei)\n  var fi = f[fptr]\n  var fa = abs(fi)\n  var a, b\n  if(ea < fa) {\n    b = ei\n    eptr += 1\n    if(eptr < ne) {\n      ei = e[eptr]\n      ea = abs(ei)\n    }\n  } else {\n    b = fi\n    fptr += 1\n    if(fptr < nf) {\n      fi = f[fptr]\n      fa = abs(fi)\n    }\n  }\n  if((eptr < ne && ea < fa) || (fptr >= nf)) {\n    a = ei\n    eptr += 1\n    if(eptr < ne) {\n      ei = e[eptr]\n      ea = abs(ei)\n    }\n  } else {\n    a = fi\n    fptr += 1\n    if(fptr < nf) {\n      fi = f[fptr]\n      fa = abs(fi)\n    }\n  }\n  var x = a + b\n  var bv = x - a\n  var y = b - bv\n  var q0 = y\n  var q1 = x\n  var _x, _bv, _av, _br, _ar\n  while(eptr < ne && fptr < nf) {\n    if(ea < fa) {\n      a = ei\n      eptr += 1\n      if(eptr < ne) {\n        ei = e[eptr]\n        ea = abs(ei)\n      }\n    } else {\n      a = fi\n      fptr += 1\n      if(fptr < nf) {\n        fi = f[fptr]\n        fa = abs(fi)\n      }\n    }\n    b = q0\n    x = a + b\n    bv = x - a\n    y = b - bv\n    if(y) {\n      g[count++] = y\n    }\n    _x = q1 + x\n    _bv = _x - q1\n    _av = _x - _bv\n    _br = x - _bv\n    _ar = q1 - _av\n    q0 = _ar + _br\n    q1 = _x\n  }\n  while(eptr < ne) {\n    a = ei\n    b = q0\n    x = a + b\n    bv = x - a\n    y = b - bv\n    if(y) {\n      g[count++] = y\n    }\n    _x = q1 + x\n    _bv = _x - q1\n    _av = _x - _bv\n    _br = x - _bv\n    _ar = q1 - _av\n    q0 = _ar + _br\n    q1 = _x\n    eptr += 1\n    if(eptr < ne) {\n      ei = e[eptr]\n    }\n  }\n  while(fptr < nf) {\n    a = fi\n    b = q0\n    x = a + b\n    bv = x - a\n    y = b - bv\n    if(y) {\n      g[count++] = y\n    } \n    _x = q1 + x\n    _bv = _x - q1\n    _av = _x - _bv\n    _br = x - _bv\n    _ar = q1 - _av\n    q0 = _ar + _br\n    q1 = _x\n    fptr += 1\n    if(fptr < nf) {\n      fi = f[fptr]\n    }\n  }\n  if(q0) {\n    g[count++] = q0\n  }\n  if(q1) {\n    g[count++] = q1\n  }\n  if(!count) {\n    g[count++] = 0.0  \n  }\n  g.length = count\n  return g\n}\n\n//# sourceURL=webpack://hubar/./node_modules/robust-sum/robust-sum.js?");

/***/ }),

/***/ "./node_modules/two-product/two-product.js":
/*!*************************************************!*\
  !*** ./node_modules/two-product/two-product.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = twoProduct\n\nvar SPLITTER = +(Math.pow(2, 27) + 1.0)\n\nfunction twoProduct(a, b, result) {\n  var x = a * b\n\n  var c = SPLITTER * a\n  var abig = c - a\n  var ahi = c - abig\n  var alo = a - ahi\n\n  var d = SPLITTER * b\n  var bbig = d - b\n  var bhi = d - bbig\n  var blo = b - bhi\n\n  var err1 = x - (ahi * bhi)\n  var err2 = err1 - (alo * bhi)\n  var err3 = err2 - (ahi * blo)\n\n  var y = alo * blo - err3\n\n  if(result) {\n    result[0] = y\n    result[1] = x\n    return result\n  }\n\n  return [ y, x ]\n}\n\n//# sourceURL=webpack://hubar/./node_modules/two-product/two-product.js?");

/***/ }),

/***/ "./node_modules/two-sum/two-sum.js":
/*!*****************************************!*\
  !*** ./node_modules/two-sum/two-sum.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = fastTwoSum\n\nfunction fastTwoSum(a, b, result) {\n\tvar x = a + b\n\tvar bv = x - a\n\tvar av = x - bv\n\tvar br = b - bv\n\tvar ar = a - av\n\tif(result) {\n\t\tresult[0] = ar + br\n\t\tresult[1] = x\n\t\treturn result\n\t}\n\treturn [ar+br, x]\n}\n\n//# sourceURL=webpack://hubar/./node_modules/two-sum/two-sum.js?");

/***/ }),

/***/ "./src/lasso.js":
/*!**********************!*\
  !*** ./src/lasso.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-selection */ \"./node_modules/d3-selection/src/pointer.js\");\n/* harmony import */ var d3_drag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-drag */ \"./node_modules/d3-drag/src/drag.js\");\n/* harmony import */ var robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! robust-point-in-polygon */ \"./node_modules/robust-point-in-polygon/robust-pnp.js\");\n/* harmony import */ var robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0__);\n//lasso helpers\n\n\n\n\nlet lasso = ()=>{\n    let items =[],\n        closePathDistance = 100,\n        closePathSelect = true,\n        isPathClosed = false,\n        hoverSelect = true,\n        targetArea,\n        on = {start: function(){}, draw: function(){}, end: function(){}};\n    \n    // Function to execute on call\n    function lasso(_this) {\n    \n        // add a new group for the lasso\n        let g = _this.append(\"g\")\n            .attr(\"class\",\"lasso\");\n    \n        // add the drawn path for the lasso\n        let dyn_path = g.append(\"path\")\n            .attr(\"class\",\"drawn\");\n    \n        // add a closed path\n        let close_path = g.append(\"path\")\n            .attr(\"class\",\"loop_close\");\n    \n        // add an origin node\n        let origin_node = g.append(\"circle\")\n            .attr(\"class\",\"origin\");\n    \n        // The transformed lasso path for rendering\n        let tpath;\n    \n        // The lasso origin for calculations\n        let origin;\n    \n        // The transformed lasso origin for rendering\n        let torigin;\n    \n        // Store off coordinates drawn\n        let drawnCoords;\n    \n            // Apply drag behaviors\n        let dragAction = d3_drag__WEBPACK_IMPORTED_MODULE_1__[\"default\"]()\n            .on(\"start\",dragstart)\n            .on(\"drag\",dragmove)\n            .on(\"end\",dragend);\n    \n        // Call drag\n        targetArea.call(dragAction);\n    \n        function dragstart() {\n            // Init coordinates\n            drawnCoords = [];\n    \n            // Initialize paths\n            tpath = \"\";\n            dyn_path.attr(\"d\",null);\n            close_path.attr(\"d\",null);\n    \n            // Set every item to have a false selection and reset their center point and counters\n            items.nodes().forEach(function(e) {\n                e.__lasso.possible = false;\n                e.__lasso.selected = false;\n                e.__lasso.hoverSelect = false;\n                e.__lasso.loopSelect = false;\n    \n                let box = e.getBoundingClientRect();\n                e.__lasso.lassoPoint = [Math.round(box.left + box.width/2),Math.round(box.top + box.height/2)];\n            });\n    \n            // if hover is on, add hover function\n            if(hoverSelect) {\n                items.on(\"mouseover.lasso\",function() {\n                    // if hovered, change lasso selection attribute to true\n                    this.__lasso.hoverSelect = true;\n                });\n            }\n    \n            // Run user defined start function\n            on.start();\n        }\n    \n        function dragmove(event) {\n            // Get mouse position within body, used for calculations\n            let x,y;\n            if(event.sourceEvent.type === \"touchmove\") {\n                x = event.sourceEvent.touches[0].clientX;\n                y = event.sourceEvent.touches[0].clientY;\n            }\n            else {\n                x = event.sourceEvent.clientX;\n                y = event.sourceEvent.clientY;\n            }\n    \n    \n            // Get mouse position within drawing area, used for rendering\n            let tx = d3_selection__WEBPACK_IMPORTED_MODULE_2__[\"default\"](event, this)[0];\n            let ty = d3_selection__WEBPACK_IMPORTED_MODULE_2__[\"default\"](event, this)[1];\n    \n            // Initialize the path or add the latest point to it\n            if (tpath===\"\") {\n                tpath = tpath + \"M \" + tx + \" \" + ty;\n                origin = [x,y];\n                torigin = [tx,ty];\n                // Draw origin node\n                origin_node\n                    .attr(\"cx\",tx)\n                    .attr(\"cy\",ty)\n                    .attr(\"r\",4)\n                    .attr(\"display\",null);\n            }\n            else {\n                tpath = tpath + \" L \" + tx + \" \" + ty;\n            }\n    \n            drawnCoords.push([x,y]);\n    \n            // Calculate the current distance from the lasso origin\n            let distance = Math.sqrt(Math.pow(x-origin[0],2)+Math.pow(y-origin[1],2));\n    \n            // Set the closed path line\n            let close_draw_path = \"M \" + tx + \" \" + ty + \" L \" + torigin[0] + \" \" + torigin[1];\n    \n            // Draw the lines\n            dyn_path.attr(\"d\",tpath);\n    \n            close_path.attr(\"d\",close_draw_path);\n    \n            // Check if the path is closed\n            isPathClosed = distance<=closePathDistance ? true : false;\n    \n            // If within the closed path distance parameter, show the closed path. otherwise, hide it\n            if(isPathClosed && closePathSelect) {\n                close_path.attr(\"display\",null);\n            }\n            else {\n                close_path.attr(\"display\",\"none\");\n            }\n    \n            items.nodes().forEach(function(n) {\n                n.__lasso.loopSelect = (isPathClosed && closePathSelect) ? (robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0___default()(drawnCoords,n.__lasso.lassoPoint) < 1) : false;\n                n.__lasso.possible = n.__lasso.hoverSelect || n.__lasso.loopSelect;\n            });\n    \n            on.draw();\n        }\n    \n        function dragend() {\n            // Remove mouseover tagging function\n            items.on(\"mouseover.lasso\",null);\n\n            let none_selected = true;\n            items.nodes().forEach(function(n) {\n                n.__lasso.selected = n.__lasso.possible;\n                if(n.__lasso.possible)\n                    none_selected= false;\n                n.__lasso.possible = false;\n            });\n            \n            //clear lasso if none selected\n            if (none_selected){\n                dyn_path.attr(\"d\",null);\n                close_path.attr(\"d\",null);\n                origin_node.attr(\"display\",\"none\");\n            }\n            // Run user defined end function\n            on.end();\n        }\n    }\n    \n    // Set or get list of items for lasso to select\n    lasso.items  = function(_) {\n        if (!arguments.length) return items;\n        items = _;\n        let nodes = items.nodes();\n        nodes.forEach(function(n) {\n            n.__lasso = {\n                \"possible\": false,\n                \"selected\": false\n            };\n        });\n        return lasso;\n    };\n    \n    // Return possible items\n    lasso.possibleItems = function() {\n        return items.filter(function() {\n            return this.__lasso.possible;\n        });\n    }\n    \n    // Return selected items\n    lasso.selectedItems = function() {\n        return items.filter(function() {\n            return this.__lasso.selected;\n        });\n    }\n    \n    // Return not possible items\n    lasso.notPossibleItems = function() {\n        return items.filter(function() {\n            return !this.__lasso.possible;\n        });\n    }\n    \n    // Return not selected items\n    lasso.notSelectedItems = function() {\n        return items.filter(function() {\n            return !this.__lasso.selected;\n        });\n    }\n    \n    // Distance required before path auto closes loop\n    lasso.closePathDistance  = function(_) {\n        if (!arguments.length) return closePathDistance;\n        closePathDistance = _;\n        return lasso;\n    };\n    \n    // Option to loop select or not\n    lasso.closePathSelect = function(_) {\n        if (!arguments.length) return closePathSelect;\n        closePathSelect = _===true ? true : false;\n        return lasso;\n    };\n    \n    // Not sure what this is for\n    lasso.isPathClosed = function(_) {\n        if (!arguments.length) return isPathClosed;\n        isPathClosed = _===true ? true : false;\n        return lasso;\n    };\n    \n    // Option to select on hover or not\n    lasso.hoverSelect = function(_) {\n        if (!arguments.length) return hoverSelect;\n        hoverSelect = _===true ? true : false;\n        return lasso;\n    };\n    \n    // Events\n    lasso.on = function(type,_) {\n        if(!arguments.length) return on;\n        if(arguments.length===1) return on[type];\n        let types = [\"start\",\"draw\",\"end\"];\n        if(types.indexOf(type)>-1) {\n            on[type] = _;\n        }\n        return lasso;\n    };\n    \n    // Area where lasso can be triggered from\n    lasso.targetArea = function(_) {\n        if(!arguments.length) return targetArea;\n        targetArea = _;\n        return lasso;\n    }\n    \n    \n    \n    return lasso;\n};\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (lasso); // Default export\n\n\n//# sourceURL=webpack://hubar/./src/lasso.js?");

/***/ }),

/***/ "./node_modules/d3-dispatch/src/dispatch.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-dispatch/src/dispatch.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar noop = {value: () => {}};\n\nfunction dispatch() {\n  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {\n    if (!(t = arguments[i] + \"\") || (t in _) || /[\\s.]/.test(t)) throw new Error(\"illegal type: \" + t);\n    _[t] = [];\n  }\n  return new Dispatch(_);\n}\n\nfunction Dispatch(_) {\n  this._ = _;\n}\n\nfunction parseTypenames(typenames, types) {\n  return typenames.trim().split(/^|\\s+/).map(function(t) {\n    var name = \"\", i = t.indexOf(\".\");\n    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);\n    if (t && !types.hasOwnProperty(t)) throw new Error(\"unknown type: \" + t);\n    return {type: t, name: name};\n  });\n}\n\nDispatch.prototype = dispatch.prototype = {\n  constructor: Dispatch,\n  on: function(typename, callback) {\n    var _ = this._,\n        T = parseTypenames(typename + \"\", _),\n        t,\n        i = -1,\n        n = T.length;\n\n    // If no callback was specified, return the callback of the given type and name.\n    if (arguments.length < 2) {\n      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;\n      return;\n    }\n\n    // If a type was specified, set the callback for the given type and name.\n    // Otherwise, if a null callback was specified, remove callbacks of the given name.\n    if (callback != null && typeof callback !== \"function\") throw new Error(\"invalid callback: \" + callback);\n    while (++i < n) {\n      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);\n      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);\n    }\n\n    return this;\n  },\n  copy: function() {\n    var copy = {}, _ = this._;\n    for (var t in _) copy[t] = _[t].slice();\n    return new Dispatch(copy);\n  },\n  call: function(type, that) {\n    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];\n    if (!this._.hasOwnProperty(type)) throw new Error(\"unknown type: \" + type);\n    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);\n  },\n  apply: function(type, that, args) {\n    if (!this._.hasOwnProperty(type)) throw new Error(\"unknown type: \" + type);\n    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);\n  }\n};\n\nfunction get(type, name) {\n  for (var i = 0, n = type.length, c; i < n; ++i) {\n    if ((c = type[i]).name === name) {\n      return c.value;\n    }\n  }\n}\n\nfunction set(type, name, callback) {\n  for (var i = 0, n = type.length; i < n; ++i) {\n    if (type[i].name === name) {\n      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));\n      break;\n    }\n  }\n  if (callback != null) type.push({name: name, value: callback});\n  return type;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dispatch);\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-dispatch/src/dispatch.js?");

/***/ }),

/***/ "./node_modules/d3-drag/src/constant.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-drag/src/constant.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (x => () => x);\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-drag/src/constant.js?");

/***/ }),

/***/ "./node_modules/d3-drag/src/drag.js":
/*!******************************************!*\
  !*** ./node_modules/d3-drag/src/drag.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var d3_dispatch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-dispatch */ \"./node_modules/d3-dispatch/src/dispatch.js\");\n/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-selection */ \"./node_modules/d3-selection/src/select.js\");\n/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! d3-selection */ \"./node_modules/d3-selection/src/pointer.js\");\n/* harmony import */ var _nodrag_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodrag.js */ \"./node_modules/d3-drag/src/nodrag.js\");\n/* harmony import */ var _noevent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./noevent.js */ \"./node_modules/d3-drag/src/noevent.js\");\n/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constant.js */ \"./node_modules/d3-drag/src/constant.js\");\n/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./event.js */ \"./node_modules/d3-drag/src/event.js\");\n\n\n\n\n\n\n\n// Ignore right-click, since that should open the context menu.\nfunction defaultFilter(event) {\n  return !event.ctrlKey && !event.button;\n}\n\nfunction defaultContainer() {\n  return this.parentNode;\n}\n\nfunction defaultSubject(event, d) {\n  return d == null ? {x: event.x, y: event.y} : d;\n}\n\nfunction defaultTouchable() {\n  return navigator.maxTouchPoints || (\"ontouchstart\" in this);\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  var filter = defaultFilter,\n      container = defaultContainer,\n      subject = defaultSubject,\n      touchable = defaultTouchable,\n      gestures = {},\n      listeners = (0,d3_dispatch__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"start\", \"drag\", \"end\"),\n      active = 0,\n      mousedownx,\n      mousedowny,\n      mousemoving,\n      touchending,\n      clickDistance2 = 0;\n\n  function drag(selection) {\n    selection\n        .on(\"mousedown.drag\", mousedowned)\n      .filter(touchable)\n        .on(\"touchstart.drag\", touchstarted)\n        .on(\"touchmove.drag\", touchmoved, _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassive)\n        .on(\"touchend.drag touchcancel.drag\", touchended)\n        .style(\"touch-action\", \"none\")\n        .style(\"-webkit-tap-highlight-color\", \"rgba(0,0,0,0)\");\n  }\n\n  function mousedowned(event, d) {\n    if (touchending || !filter.call(this, event, d)) return;\n    var gesture = beforestart(this, container.call(this, event, d), event, d, \"mouse\");\n    if (!gesture) return;\n    (0,d3_selection__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(event.view)\n      .on(\"mousemove.drag\", mousemoved, _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture)\n      .on(\"mouseup.drag\", mouseupped, _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);\n    (0,_nodrag_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(event.view);\n    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__.nopropagation)(event);\n    mousemoving = false;\n    mousedownx = event.clientX;\n    mousedowny = event.clientY;\n    gesture(\"start\", event);\n  }\n\n  function mousemoved(event) {\n    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(event);\n    if (!mousemoving) {\n      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;\n      mousemoving = dx * dx + dy * dy > clickDistance2;\n    }\n    gestures.mouse(\"drag\", event);\n  }\n\n  function mouseupped(event) {\n    (0,d3_selection__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(event.view).on(\"mousemove.drag mouseup.drag\", null);\n    (0,_nodrag_js__WEBPACK_IMPORTED_MODULE_3__.yesdrag)(event.view, mousemoving);\n    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(event);\n    gestures.mouse(\"end\", event);\n  }\n\n  function touchstarted(event, d) {\n    if (!filter.call(this, event, d)) return;\n    var touches = event.changedTouches,\n        c = container.call(this, event, d),\n        n = touches.length, i, gesture;\n\n    for (i = 0; i < n; ++i) {\n      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {\n        (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__.nopropagation)(event);\n        gesture(\"start\", event, touches[i]);\n      }\n    }\n  }\n\n  function touchmoved(event) {\n    var touches = event.changedTouches,\n        n = touches.length, i, gesture;\n\n    for (i = 0; i < n; ++i) {\n      if (gesture = gestures[touches[i].identifier]) {\n        (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(event);\n        gesture(\"drag\", event, touches[i]);\n      }\n    }\n  }\n\n  function touchended(event) {\n    var touches = event.changedTouches,\n        n = touches.length, i, gesture;\n\n    if (touchending) clearTimeout(touchending);\n    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!\n    for (i = 0; i < n; ++i) {\n      if (gesture = gestures[touches[i].identifier]) {\n        (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__.nopropagation)(event);\n        gesture(\"end\", event, touches[i]);\n      }\n    }\n  }\n\n  function beforestart(that, container, event, d, identifier, touch) {\n    var dispatch = listeners.copy(),\n        p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(touch || event, container), dx, dy,\n        s;\n\n    if ((s = subject.call(that, new _event_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"](\"beforestart\", {\n        sourceEvent: event,\n        target: drag,\n        identifier,\n        active,\n        x: p[0],\n        y: p[1],\n        dx: 0,\n        dy: 0,\n        dispatch\n      }), d)) == null) return;\n\n    dx = s.x - p[0] || 0;\n    dy = s.y - p[1] || 0;\n\n    return function gesture(type, event, touch) {\n      var p0 = p, n;\n      switch (type) {\n        case \"start\": gestures[identifier] = gesture, n = active++; break;\n        case \"end\": delete gestures[identifier], --active; // falls through\n        case \"drag\": p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(touch || event, container), n = active; break;\n      }\n      dispatch.call(\n        type,\n        that,\n        new _event_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"](type, {\n          sourceEvent: event,\n          subject: s,\n          target: drag,\n          identifier,\n          active: n,\n          x: p[0] + dx,\n          y: p[1] + dy,\n          dx: p[0] - p0[0],\n          dy: p[1] - p0[1],\n          dispatch\n        }),\n        d\n      );\n    };\n  }\n\n  drag.filter = function(_) {\n    return arguments.length ? (filter = typeof _ === \"function\" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(!!_), drag) : filter;\n  };\n\n  drag.container = function(_) {\n    return arguments.length ? (container = typeof _ === \"function\" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(_), drag) : container;\n  };\n\n  drag.subject = function(_) {\n    return arguments.length ? (subject = typeof _ === \"function\" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(_), drag) : subject;\n  };\n\n  drag.touchable = function(_) {\n    return arguments.length ? (touchable = typeof _ === \"function\" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(!!_), drag) : touchable;\n  };\n\n  drag.on = function() {\n    var value = listeners.on.apply(listeners, arguments);\n    return value === listeners ? drag : value;\n  };\n\n  drag.clickDistance = function(_) {\n    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);\n  };\n\n  return drag;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-drag/src/drag.js?");

/***/ }),

/***/ "./node_modules/d3-drag/src/event.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-drag/src/event.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DragEvent)\n/* harmony export */ });\nfunction DragEvent(type, {\n  sourceEvent,\n  subject,\n  target,\n  identifier,\n  active,\n  x, y, dx, dy,\n  dispatch\n}) {\n  Object.defineProperties(this, {\n    type: {value: type, enumerable: true, configurable: true},\n    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},\n    subject: {value: subject, enumerable: true, configurable: true},\n    target: {value: target, enumerable: true, configurable: true},\n    identifier: {value: identifier, enumerable: true, configurable: true},\n    active: {value: active, enumerable: true, configurable: true},\n    x: {value: x, enumerable: true, configurable: true},\n    y: {value: y, enumerable: true, configurable: true},\n    dx: {value: dx, enumerable: true, configurable: true},\n    dy: {value: dy, enumerable: true, configurable: true},\n    _: {value: dispatch}\n  });\n}\n\nDragEvent.prototype.on = function() {\n  var value = this._.on.apply(this._, arguments);\n  return value === this._ ? this : value;\n};\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-drag/src/event.js?");

/***/ }),

/***/ "./node_modules/d3-drag/src/nodrag.js":
/*!********************************************!*\
  !*** ./node_modules/d3-drag/src/nodrag.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   yesdrag: () => (/* binding */ yesdrag)\n/* harmony export */ });\n/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ \"./node_modules/d3-selection/src/select.js\");\n/* harmony import */ var _noevent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./noevent.js */ \"./node_modules/d3-drag/src/noevent.js\");\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(view) {\n  var root = view.document.documentElement,\n      selection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(view).on(\"dragstart.drag\", _noevent_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);\n  if (\"onselectstart\" in root) {\n    selection.on(\"selectstart.drag\", _noevent_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);\n  } else {\n    root.__noselect = root.style.MozUserSelect;\n    root.style.MozUserSelect = \"none\";\n  }\n}\n\nfunction yesdrag(view, noclick) {\n  var root = view.document.documentElement,\n      selection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(view).on(\"dragstart.drag\", null);\n  if (noclick) {\n    selection.on(\"click.drag\", _noevent_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);\n    setTimeout(function() { selection.on(\"click.drag\", null); }, 0);\n  }\n  if (\"onselectstart\" in root) {\n    selection.on(\"selectstart.drag\", null);\n  } else {\n    root.style.MozUserSelect = root.__noselect;\n    delete root.__noselect;\n  }\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-drag/src/nodrag.js?");

/***/ }),

/***/ "./node_modules/d3-drag/src/noevent.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-drag/src/noevent.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   nonpassive: () => (/* binding */ nonpassive),\n/* harmony export */   nonpassivecapture: () => (/* binding */ nonpassivecapture),\n/* harmony export */   nopropagation: () => (/* binding */ nopropagation)\n/* harmony export */ });\n// These are typically used in conjunction with noevent to ensure that we can\n// preventDefault on the event.\nconst nonpassive = {passive: false};\nconst nonpassivecapture = {capture: true, passive: false};\n\nfunction nopropagation(event) {\n  event.stopImmediatePropagation();\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event) {\n  event.preventDefault();\n  event.stopImmediatePropagation();\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-drag/src/noevent.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/array.js":
/*!************************************************!*\
  !*** ./node_modules/d3-selection/src/array.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ array)\n/* harmony export */ });\n// Given something array like (or null), returns something that is strictly an\n// array. This is used to ensure that array-like objects passed to d3.selectAll\n// or selection.selectAll are converted into proper arrays when creating a\n// selection; we don’t ever want to create a selection backed by a live\n// HTMLCollection or NodeList. However, note that selection.selectAll will use a\n// static NodeList as a group, since it safely derived from querySelectorAll.\nfunction array(x) {\n  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/array.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/constant.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-selection/src/constant.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {\n  return function() {\n    return x;\n  };\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/constant.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/creator.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-selection/src/creator.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _namespace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./namespace.js */ \"./node_modules/d3-selection/src/namespace.js\");\n/* harmony import */ var _namespaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./namespaces.js */ \"./node_modules/d3-selection/src/namespaces.js\");\n\n\n\nfunction creatorInherit(name) {\n  return function() {\n    var document = this.ownerDocument,\n        uri = this.namespaceURI;\n    return uri === _namespaces_js__WEBPACK_IMPORTED_MODULE_0__.xhtml && document.documentElement.namespaceURI === _namespaces_js__WEBPACK_IMPORTED_MODULE_0__.xhtml\n        ? document.createElement(name)\n        : document.createElementNS(uri, name);\n  };\n}\n\nfunction creatorFixed(fullname) {\n  return function() {\n    return this.ownerDocument.createElementNS(fullname.space, fullname.local);\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {\n  var fullname = (0,_namespace_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(name);\n  return (fullname.local\n      ? creatorFixed\n      : creatorInherit)(fullname);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/creator.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/matcher.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-selection/src/matcher.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   childMatcher: () => (/* binding */ childMatcher),\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {\n  return function() {\n    return this.matches(selector);\n  };\n}\n\nfunction childMatcher(selector) {\n  return function(node) {\n    return node.matches(selector);\n  };\n}\n\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/matcher.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/namespace.js":
/*!****************************************************!*\
  !*** ./node_modules/d3-selection/src/namespace.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _namespaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./namespaces.js */ \"./node_modules/d3-selection/src/namespaces.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {\n  var prefix = name += \"\", i = prefix.indexOf(\":\");\n  if (i >= 0 && (prefix = name.slice(0, i)) !== \"xmlns\") name = name.slice(i + 1);\n  return _namespaces_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hasOwnProperty(prefix) ? {space: _namespaces_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"][prefix], local: name} : name; // eslint-disable-line no-prototype-builtins\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/namespace.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/namespaces.js":
/*!*****************************************************!*\
  !*** ./node_modules/d3-selection/src/namespaces.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   xhtml: () => (/* binding */ xhtml)\n/* harmony export */ });\nvar xhtml = \"http://www.w3.org/1999/xhtml\";\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  svg: \"http://www.w3.org/2000/svg\",\n  xhtml: xhtml,\n  xlink: \"http://www.w3.org/1999/xlink\",\n  xml: \"http://www.w3.org/XML/1998/namespace\",\n  xmlns: \"http://www.w3.org/2000/xmlns/\"\n});\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/namespaces.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/pointer.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-selection/src/pointer.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _sourceEvent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sourceEvent.js */ \"./node_modules/d3-selection/src/sourceEvent.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event, node) {\n  event = (0,_sourceEvent_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(event);\n  if (node === undefined) node = event.currentTarget;\n  if (node) {\n    var svg = node.ownerSVGElement || node;\n    if (svg.createSVGPoint) {\n      var point = svg.createSVGPoint();\n      point.x = event.clientX, point.y = event.clientY;\n      point = point.matrixTransform(node.getScreenCTM().inverse());\n      return [point.x, point.y];\n    }\n    if (node.getBoundingClientRect) {\n      var rect = node.getBoundingClientRect();\n      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];\n    }\n  }\n  return [event.pageX, event.pageY];\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/pointer.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/select.js":
/*!*************************************************!*\
  !*** ./node_modules/d3-selection/src/select.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _selection_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selection/index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {\n  return typeof selector === \"string\"\n      ? new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__.Selection([[document.querySelector(selector)]], [document.documentElement])\n      : new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__.Selection([[selector]], _selection_index_js__WEBPACK_IMPORTED_MODULE_0__.root);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/select.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/append.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/append.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../creator.js */ \"./node_modules/d3-selection/src/creator.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {\n  var create = typeof name === \"function\" ? name : (0,_creator_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(name);\n  return this.select(function() {\n    return this.appendChild(create.apply(this, arguments));\n  });\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/append.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/attr.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/attr.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _namespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../namespace.js */ \"./node_modules/d3-selection/src/namespace.js\");\n\n\nfunction attrRemove(name) {\n  return function() {\n    this.removeAttribute(name);\n  };\n}\n\nfunction attrRemoveNS(fullname) {\n  return function() {\n    this.removeAttributeNS(fullname.space, fullname.local);\n  };\n}\n\nfunction attrConstant(name, value) {\n  return function() {\n    this.setAttribute(name, value);\n  };\n}\n\nfunction attrConstantNS(fullname, value) {\n  return function() {\n    this.setAttributeNS(fullname.space, fullname.local, value);\n  };\n}\n\nfunction attrFunction(name, value) {\n  return function() {\n    var v = value.apply(this, arguments);\n    if (v == null) this.removeAttribute(name);\n    else this.setAttribute(name, v);\n  };\n}\n\nfunction attrFunctionNS(fullname, value) {\n  return function() {\n    var v = value.apply(this, arguments);\n    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);\n    else this.setAttributeNS(fullname.space, fullname.local, v);\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {\n  var fullname = (0,_namespace_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(name);\n\n  if (arguments.length < 2) {\n    var node = this.node();\n    return fullname.local\n        ? node.getAttributeNS(fullname.space, fullname.local)\n        : node.getAttribute(fullname);\n  }\n\n  return this.each((value == null\n      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === \"function\"\n      ? (fullname.local ? attrFunctionNS : attrFunction)\n      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/attr.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/call.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/call.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  var callback = arguments[0];\n  arguments[0] = this;\n  callback.apply(null, arguments);\n  return this;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/call.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/classed.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/classed.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction classArray(string) {\n  return string.trim().split(/^|\\s+/);\n}\n\nfunction classList(node) {\n  return node.classList || new ClassList(node);\n}\n\nfunction ClassList(node) {\n  this._node = node;\n  this._names = classArray(node.getAttribute(\"class\") || \"\");\n}\n\nClassList.prototype = {\n  add: function(name) {\n    var i = this._names.indexOf(name);\n    if (i < 0) {\n      this._names.push(name);\n      this._node.setAttribute(\"class\", this._names.join(\" \"));\n    }\n  },\n  remove: function(name) {\n    var i = this._names.indexOf(name);\n    if (i >= 0) {\n      this._names.splice(i, 1);\n      this._node.setAttribute(\"class\", this._names.join(\" \"));\n    }\n  },\n  contains: function(name) {\n    return this._names.indexOf(name) >= 0;\n  }\n};\n\nfunction classedAdd(node, names) {\n  var list = classList(node), i = -1, n = names.length;\n  while (++i < n) list.add(names[i]);\n}\n\nfunction classedRemove(node, names) {\n  var list = classList(node), i = -1, n = names.length;\n  while (++i < n) list.remove(names[i]);\n}\n\nfunction classedTrue(names) {\n  return function() {\n    classedAdd(this, names);\n  };\n}\n\nfunction classedFalse(names) {\n  return function() {\n    classedRemove(this, names);\n  };\n}\n\nfunction classedFunction(names, value) {\n  return function() {\n    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {\n  var names = classArray(name + \"\");\n\n  if (arguments.length < 2) {\n    var list = classList(this.node()), i = -1, n = names.length;\n    while (++i < n) if (!list.contains(names[i])) return false;\n    return true;\n  }\n\n  return this.each((typeof value === \"function\"\n      ? classedFunction : value\n      ? classedTrue\n      : classedFalse)(names, value));\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/classed.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/clone.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/clone.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction selection_cloneShallow() {\n  var clone = this.cloneNode(false), parent = this.parentNode;\n  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;\n}\n\nfunction selection_cloneDeep() {\n  var clone = this.cloneNode(true), parent = this.parentNode;\n  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(deep) {\n  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/clone.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/data.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/data.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n/* harmony import */ var _enter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enter.js */ \"./node_modules/d3-selection/src/selection/enter.js\");\n/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constant.js */ \"./node_modules/d3-selection/src/constant.js\");\n\n\n\n\nfunction bindIndex(parent, group, enter, update, exit, data) {\n  var i = 0,\n      node,\n      groupLength = group.length,\n      dataLength = data.length;\n\n  // Put any non-null nodes that fit into update.\n  // Put any null nodes into enter.\n  // Put any remaining data into enter.\n  for (; i < dataLength; ++i) {\n    if (node = group[i]) {\n      node.__data__ = data[i];\n      update[i] = node;\n    } else {\n      enter[i] = new _enter_js__WEBPACK_IMPORTED_MODULE_0__.EnterNode(parent, data[i]);\n    }\n  }\n\n  // Put any non-null nodes that don’t fit into exit.\n  for (; i < groupLength; ++i) {\n    if (node = group[i]) {\n      exit[i] = node;\n    }\n  }\n}\n\nfunction bindKey(parent, group, enter, update, exit, data, key) {\n  var i,\n      node,\n      nodeByKeyValue = new Map,\n      groupLength = group.length,\n      dataLength = data.length,\n      keyValues = new Array(groupLength),\n      keyValue;\n\n  // Compute the key for each node.\n  // If multiple nodes have the same key, the duplicates are added to exit.\n  for (i = 0; i < groupLength; ++i) {\n    if (node = group[i]) {\n      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + \"\";\n      if (nodeByKeyValue.has(keyValue)) {\n        exit[i] = node;\n      } else {\n        nodeByKeyValue.set(keyValue, node);\n      }\n    }\n  }\n\n  // Compute the key for each datum.\n  // If there a node associated with this key, join and add it to update.\n  // If there is not (or the key is a duplicate), add it to enter.\n  for (i = 0; i < dataLength; ++i) {\n    keyValue = key.call(parent, data[i], i, data) + \"\";\n    if (node = nodeByKeyValue.get(keyValue)) {\n      update[i] = node;\n      node.__data__ = data[i];\n      nodeByKeyValue.delete(keyValue);\n    } else {\n      enter[i] = new _enter_js__WEBPACK_IMPORTED_MODULE_0__.EnterNode(parent, data[i]);\n    }\n  }\n\n  // Add any remaining nodes that were not bound to data to exit.\n  for (i = 0; i < groupLength; ++i) {\n    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {\n      exit[i] = node;\n    }\n  }\n}\n\nfunction datum(node) {\n  return node.__data__;\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value, key) {\n  if (!arguments.length) return Array.from(this, datum);\n\n  var bind = key ? bindKey : bindIndex,\n      parents = this._parents,\n      groups = this._groups;\n\n  if (typeof value !== \"function\") value = (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(value);\n\n  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {\n    var parent = parents[j],\n        group = groups[j],\n        groupLength = group.length,\n        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),\n        dataLength = data.length,\n        enterGroup = enter[j] = new Array(dataLength),\n        updateGroup = update[j] = new Array(dataLength),\n        exitGroup = exit[j] = new Array(groupLength);\n\n    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);\n\n    // Now connect the enter nodes to their following update node, such that\n    // appendChild can insert the materialized enter node before this node,\n    // rather than at the end of the parent node.\n    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {\n      if (previous = enterGroup[i0]) {\n        if (i0 >= i1) i1 = i0 + 1;\n        while (!(next = updateGroup[i1]) && ++i1 < dataLength);\n        previous._next = next || null;\n      }\n    }\n  }\n\n  update = new _index_js__WEBPACK_IMPORTED_MODULE_2__.Selection(update, parents);\n  update._enter = enter;\n  update._exit = exit;\n  return update;\n}\n\n// Given some data, this returns an array-like view of it: an object that\n// exposes a length property and allows numeric indexing. Note that unlike\n// selectAll, this isn’t worried about “live” collections because the resulting\n// array will only be used briefly while data is being bound. (It is possible to\n// cause the data to change while iterating by using a key function, but please\n// don’t; we’d rather avoid a gratuitous copy.)\nfunction arraylike(data) {\n  return typeof data === \"object\" && \"length\" in data\n    ? data // Array, TypedArray, NodeList, array-like\n    : Array.from(data); // Map, Set, iterable, string, or anything else\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/data.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/datum.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/datum.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {\n  return arguments.length\n      ? this.property(\"__data__\", value)\n      : this.node().__data__;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/datum.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/dispatch.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/dispatch.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _window_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../window.js */ \"./node_modules/d3-selection/src/window.js\");\n\n\nfunction dispatchEvent(node, type, params) {\n  var window = (0,_window_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(node),\n      event = window.CustomEvent;\n\n  if (typeof event === \"function\") {\n    event = new event(type, params);\n  } else {\n    event = window.document.createEvent(\"Event\");\n    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;\n    else event.initEvent(type, false, false);\n  }\n\n  node.dispatchEvent(event);\n}\n\nfunction dispatchConstant(type, params) {\n  return function() {\n    return dispatchEvent(this, type, params);\n  };\n}\n\nfunction dispatchFunction(type, params) {\n  return function() {\n    return dispatchEvent(this, type, params.apply(this, arguments));\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(type, params) {\n  return this.each((typeof params === \"function\"\n      ? dispatchFunction\n      : dispatchConstant)(type, params));\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/dispatch.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/each.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/each.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback) {\n\n  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {\n    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {\n      if (node = group[i]) callback.call(node, node.__data__, i, group);\n    }\n  }\n\n  return this;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/each.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/empty.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/empty.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return !this.node();\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/empty.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/enter.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/enter.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EnterNode: () => (/* binding */ EnterNode),\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _sparse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sparse.js */ \"./node_modules/d3-selection/src/selection/sparse.js\");\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(this._enter || this._groups.map(_sparse_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]), this._parents);\n}\n\nfunction EnterNode(parent, datum) {\n  this.ownerDocument = parent.ownerDocument;\n  this.namespaceURI = parent.namespaceURI;\n  this._next = null;\n  this._parent = parent;\n  this.__data__ = datum;\n}\n\nEnterNode.prototype = {\n  constructor: EnterNode,\n  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },\n  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },\n  querySelector: function(selector) { return this._parent.querySelector(selector); },\n  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }\n};\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/enter.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/exit.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/exit.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _sparse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sparse.js */ \"./node_modules/d3-selection/src/selection/sparse.js\");\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(this._exit || this._groups.map(_sparse_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]), this._parents);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/exit.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/filter.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/filter.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matcher.js */ \"./node_modules/d3-selection/src/matcher.js\");\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {\n  if (typeof match !== \"function\") match = (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(match);\n\n  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {\n    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {\n      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {\n        subgroup.push(node);\n      }\n    }\n  }\n\n  return new _index_js__WEBPACK_IMPORTED_MODULE_1__.Selection(subgroups, this._parents);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/filter.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/html.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/html.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction htmlRemove() {\n  this.innerHTML = \"\";\n}\n\nfunction htmlConstant(value) {\n  return function() {\n    this.innerHTML = value;\n  };\n}\n\nfunction htmlFunction(value) {\n  return function() {\n    var v = value.apply(this, arguments);\n    this.innerHTML = v == null ? \"\" : v;\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {\n  return arguments.length\n      ? this.each(value == null\n          ? htmlRemove : (typeof value === \"function\"\n          ? htmlFunction\n          : htmlConstant)(value))\n      : this.node().innerHTML;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/html.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Selection: () => (/* binding */ Selection),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   root: () => (/* binding */ root)\n/* harmony export */ });\n/* harmony import */ var _select_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./select.js */ \"./node_modules/d3-selection/src/selection/select.js\");\n/* harmony import */ var _selectAll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectAll.js */ \"./node_modules/d3-selection/src/selection/selectAll.js\");\n/* harmony import */ var _selectChild_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectChild.js */ \"./node_modules/d3-selection/src/selection/selectChild.js\");\n/* harmony import */ var _selectChildren_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectChildren.js */ \"./node_modules/d3-selection/src/selection/selectChildren.js\");\n/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filter.js */ \"./node_modules/d3-selection/src/selection/filter.js\");\n/* harmony import */ var _data_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data.js */ \"./node_modules/d3-selection/src/selection/data.js\");\n/* harmony import */ var _enter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./enter.js */ \"./node_modules/d3-selection/src/selection/enter.js\");\n/* harmony import */ var _exit_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./exit.js */ \"./node_modules/d3-selection/src/selection/exit.js\");\n/* harmony import */ var _join_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./join.js */ \"./node_modules/d3-selection/src/selection/join.js\");\n/* harmony import */ var _merge_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./merge.js */ \"./node_modules/d3-selection/src/selection/merge.js\");\n/* harmony import */ var _order_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./order.js */ \"./node_modules/d3-selection/src/selection/order.js\");\n/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sort.js */ \"./node_modules/d3-selection/src/selection/sort.js\");\n/* harmony import */ var _call_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./call.js */ \"./node_modules/d3-selection/src/selection/call.js\");\n/* harmony import */ var _nodes_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./nodes.js */ \"./node_modules/d3-selection/src/selection/nodes.js\");\n/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./node.js */ \"./node_modules/d3-selection/src/selection/node.js\");\n/* harmony import */ var _size_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./size.js */ \"./node_modules/d3-selection/src/selection/size.js\");\n/* harmony import */ var _empty_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./empty.js */ \"./node_modules/d3-selection/src/selection/empty.js\");\n/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./each.js */ \"./node_modules/d3-selection/src/selection/each.js\");\n/* harmony import */ var _attr_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./attr.js */ \"./node_modules/d3-selection/src/selection/attr.js\");\n/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./style.js */ \"./node_modules/d3-selection/src/selection/style.js\");\n/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./property.js */ \"./node_modules/d3-selection/src/selection/property.js\");\n/* harmony import */ var _classed_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./classed.js */ \"./node_modules/d3-selection/src/selection/classed.js\");\n/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./text.js */ \"./node_modules/d3-selection/src/selection/text.js\");\n/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./html.js */ \"./node_modules/d3-selection/src/selection/html.js\");\n/* harmony import */ var _raise_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./raise.js */ \"./node_modules/d3-selection/src/selection/raise.js\");\n/* harmony import */ var _lower_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./lower.js */ \"./node_modules/d3-selection/src/selection/lower.js\");\n/* harmony import */ var _append_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./append.js */ \"./node_modules/d3-selection/src/selection/append.js\");\n/* harmony import */ var _insert_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./insert.js */ \"./node_modules/d3-selection/src/selection/insert.js\");\n/* harmony import */ var _remove_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./remove.js */ \"./node_modules/d3-selection/src/selection/remove.js\");\n/* harmony import */ var _clone_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./clone.js */ \"./node_modules/d3-selection/src/selection/clone.js\");\n/* harmony import */ var _datum_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./datum.js */ \"./node_modules/d3-selection/src/selection/datum.js\");\n/* harmony import */ var _on_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./on.js */ \"./node_modules/d3-selection/src/selection/on.js\");\n/* harmony import */ var _dispatch_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./dispatch.js */ \"./node_modules/d3-selection/src/selection/dispatch.js\");\n/* harmony import */ var _iterator_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./iterator.js */ \"./node_modules/d3-selection/src/selection/iterator.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvar root = [null];\n\nfunction Selection(groups, parents) {\n  this._groups = groups;\n  this._parents = parents;\n}\n\nfunction selection() {\n  return new Selection([[document.documentElement]], root);\n}\n\nfunction selection_selection() {\n  return this;\n}\n\nSelection.prototype = selection.prototype = {\n  constructor: Selection,\n  select: _select_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  selectAll: _selectAll_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  selectChild: _selectChild_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  selectChildren: _selectChildren_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  filter: _filter_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n  data: _data_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n  enter: _enter_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n  exit: _exit_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n  join: _join_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"],\n  merge: _merge_js__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n  selection: selection_selection,\n  order: _order_js__WEBPACK_IMPORTED_MODULE_10__[\"default\"],\n  sort: _sort_js__WEBPACK_IMPORTED_MODULE_11__[\"default\"],\n  call: _call_js__WEBPACK_IMPORTED_MODULE_12__[\"default\"],\n  nodes: _nodes_js__WEBPACK_IMPORTED_MODULE_13__[\"default\"],\n  node: _node_js__WEBPACK_IMPORTED_MODULE_14__[\"default\"],\n  size: _size_js__WEBPACK_IMPORTED_MODULE_15__[\"default\"],\n  empty: _empty_js__WEBPACK_IMPORTED_MODULE_16__[\"default\"],\n  each: _each_js__WEBPACK_IMPORTED_MODULE_17__[\"default\"],\n  attr: _attr_js__WEBPACK_IMPORTED_MODULE_18__[\"default\"],\n  style: _style_js__WEBPACK_IMPORTED_MODULE_19__[\"default\"],\n  property: _property_js__WEBPACK_IMPORTED_MODULE_20__[\"default\"],\n  classed: _classed_js__WEBPACK_IMPORTED_MODULE_21__[\"default\"],\n  text: _text_js__WEBPACK_IMPORTED_MODULE_22__[\"default\"],\n  html: _html_js__WEBPACK_IMPORTED_MODULE_23__[\"default\"],\n  raise: _raise_js__WEBPACK_IMPORTED_MODULE_24__[\"default\"],\n  lower: _lower_js__WEBPACK_IMPORTED_MODULE_25__[\"default\"],\n  append: _append_js__WEBPACK_IMPORTED_MODULE_26__[\"default\"],\n  insert: _insert_js__WEBPACK_IMPORTED_MODULE_27__[\"default\"],\n  remove: _remove_js__WEBPACK_IMPORTED_MODULE_28__[\"default\"],\n  clone: _clone_js__WEBPACK_IMPORTED_MODULE_29__[\"default\"],\n  datum: _datum_js__WEBPACK_IMPORTED_MODULE_30__[\"default\"],\n  on: _on_js__WEBPACK_IMPORTED_MODULE_31__[\"default\"],\n  dispatch: _dispatch_js__WEBPACK_IMPORTED_MODULE_32__[\"default\"],\n  [Symbol.iterator]: _iterator_js__WEBPACK_IMPORTED_MODULE_33__[\"default\"]\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (selection);\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/index.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/insert.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/insert.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../creator.js */ \"./node_modules/d3-selection/src/creator.js\");\n/* harmony import */ var _selector_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../selector.js */ \"./node_modules/d3-selection/src/selector.js\");\n\n\n\nfunction constantNull() {\n  return null;\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, before) {\n  var create = typeof name === \"function\" ? name : (0,_creator_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(name),\n      select = before == null ? constantNull : typeof before === \"function\" ? before : (0,_selector_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(before);\n  return this.select(function() {\n    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);\n  });\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/insert.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/iterator.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/iterator.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function* __WEBPACK_DEFAULT_EXPORT__() {\n  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {\n    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {\n      if (node = group[i]) yield node;\n    }\n  }\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/iterator.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/join.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/join.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(onenter, onupdate, onexit) {\n  var enter = this.enter(), update = this, exit = this.exit();\n  if (typeof onenter === \"function\") {\n    enter = onenter(enter);\n    if (enter) enter = enter.selection();\n  } else {\n    enter = enter.append(onenter + \"\");\n  }\n  if (onupdate != null) {\n    update = onupdate(update);\n    if (update) update = update.selection();\n  }\n  if (onexit == null) exit.remove(); else onexit(exit);\n  return enter && update ? enter.merge(update).order() : update;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/join.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/lower.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/lower.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction lower() {\n  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return this.each(lower);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/lower.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/merge.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/merge.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context) {\n  var selection = context.selection ? context.selection() : context;\n\n  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {\n    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {\n      if (node = group0[i] || group1[i]) {\n        merge[i] = node;\n      }\n    }\n  }\n\n  for (; j < m0; ++j) {\n    merges[j] = groups0[j];\n  }\n\n  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(merges, this._parents);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/merge.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/node.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/node.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n\n  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {\n    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {\n      var node = group[i];\n      if (node) return node;\n    }\n  }\n\n  return null;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/node.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/nodes.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/nodes.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return Array.from(this);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/nodes.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/on.js":
/*!*******************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/on.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction contextListener(listener) {\n  return function(event) {\n    listener.call(this, event, this.__data__);\n  };\n}\n\nfunction parseTypenames(typenames) {\n  return typenames.trim().split(/^|\\s+/).map(function(t) {\n    var name = \"\", i = t.indexOf(\".\");\n    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);\n    return {type: t, name: name};\n  });\n}\n\nfunction onRemove(typename) {\n  return function() {\n    var on = this.__on;\n    if (!on) return;\n    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {\n      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {\n        this.removeEventListener(o.type, o.listener, o.options);\n      } else {\n        on[++i] = o;\n      }\n    }\n    if (++i) on.length = i;\n    else delete this.__on;\n  };\n}\n\nfunction onAdd(typename, value, options) {\n  return function() {\n    var on = this.__on, o, listener = contextListener(value);\n    if (on) for (var j = 0, m = on.length; j < m; ++j) {\n      if ((o = on[j]).type === typename.type && o.name === typename.name) {\n        this.removeEventListener(o.type, o.listener, o.options);\n        this.addEventListener(o.type, o.listener = listener, o.options = options);\n        o.value = value;\n        return;\n      }\n    }\n    this.addEventListener(typename.type, listener, options);\n    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};\n    if (!on) this.__on = [o];\n    else on.push(o);\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(typename, value, options) {\n  var typenames = parseTypenames(typename + \"\"), i, n = typenames.length, t;\n\n  if (arguments.length < 2) {\n    var on = this.node().__on;\n    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {\n      for (i = 0, o = on[j]; i < n; ++i) {\n        if ((t = typenames[i]).type === o.type && t.name === o.name) {\n          return o.value;\n        }\n      }\n    }\n    return;\n  }\n\n  on = value ? onAdd : onRemove;\n  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));\n  return this;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/on.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/order.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/order.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n\n  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {\n    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {\n      if (node = group[i]) {\n        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);\n        next = node;\n      }\n    }\n  }\n\n  return this;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/order.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/property.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/property.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction propertyRemove(name) {\n  return function() {\n    delete this[name];\n  };\n}\n\nfunction propertyConstant(name, value) {\n  return function() {\n    this[name] = value;\n  };\n}\n\nfunction propertyFunction(name, value) {\n  return function() {\n    var v = value.apply(this, arguments);\n    if (v == null) delete this[name];\n    else this[name] = v;\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {\n  return arguments.length > 1\n      ? this.each((value == null\n          ? propertyRemove : typeof value === \"function\"\n          ? propertyFunction\n          : propertyConstant)(name, value))\n      : this.node()[name];\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/property.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/raise.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/raise.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction raise() {\n  if (this.nextSibling) this.parentNode.appendChild(this);\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return this.each(raise);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/raise.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/remove.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/remove.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction remove() {\n  var parent = this.parentNode;\n  if (parent) parent.removeChild(this);\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return this.each(remove);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/remove.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/select.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/select.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n/* harmony import */ var _selector_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../selector.js */ \"./node_modules/d3-selection/src/selector.js\");\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {\n  if (typeof select !== \"function\") select = (0,_selector_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(select);\n\n  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {\n    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {\n      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {\n        if (\"__data__\" in node) subnode.__data__ = node.__data__;\n        subgroup[i] = subnode;\n      }\n    }\n  }\n\n  return new _index_js__WEBPACK_IMPORTED_MODULE_1__.Selection(subgroups, this._parents);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/select.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/selectAll.js":
/*!**************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/selectAll.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../array.js */ \"./node_modules/d3-selection/src/array.js\");\n/* harmony import */ var _selectorAll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../selectorAll.js */ \"./node_modules/d3-selection/src/selectorAll.js\");\n\n\n\n\nfunction arrayAll(select) {\n  return function() {\n    return (0,_array_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(select.apply(this, arguments));\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {\n  if (typeof select === \"function\") select = arrayAll(select);\n  else select = (0,_selectorAll_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(select);\n\n  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {\n    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {\n      if (node = group[i]) {\n        subgroups.push(select.call(node, node.__data__, i, group));\n        parents.push(node);\n      }\n    }\n  }\n\n  return new _index_js__WEBPACK_IMPORTED_MODULE_2__.Selection(subgroups, parents);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/selectAll.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/selectChild.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/selectChild.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matcher.js */ \"./node_modules/d3-selection/src/matcher.js\");\n\n\nvar find = Array.prototype.find;\n\nfunction childFind(match) {\n  return function() {\n    return find.call(this.children, match);\n  };\n}\n\nfunction childFirst() {\n  return this.firstElementChild;\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {\n  return this.select(match == null ? childFirst\n      : childFind(typeof match === \"function\" ? match : (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__.childMatcher)(match)));\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/selectChild.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/selectChildren.js":
/*!*******************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/selectChildren.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matcher.js */ \"./node_modules/d3-selection/src/matcher.js\");\n\n\nvar filter = Array.prototype.filter;\n\nfunction children() {\n  return Array.from(this.children);\n}\n\nfunction childrenFilter(match) {\n  return function() {\n    return filter.call(this.children, match);\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {\n  return this.selectAll(match == null ? children\n      : childrenFilter(typeof match === \"function\" ? match : (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__.childMatcher)(match)));\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/selectChildren.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/size.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/size.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  let size = 0;\n  for (const node of this) ++size; // eslint-disable-line no-unused-vars\n  return size;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/size.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/sort.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/sort.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./node_modules/d3-selection/src/selection/index.js\");\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(compare) {\n  if (!compare) compare = ascending;\n\n  function compareNode(a, b) {\n    return a && b ? compare(a.__data__, b.__data__) : !a - !b;\n  }\n\n  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {\n    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {\n      if (node = group[i]) {\n        sortgroup[i] = node;\n      }\n    }\n    sortgroup.sort(compareNode);\n  }\n\n  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(sortgroups, this._parents).order();\n}\n\nfunction ascending(a, b) {\n  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/sort.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/sparse.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/sparse.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(update) {\n  return new Array(update.length);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/sparse.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/style.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/style.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   styleValue: () => (/* binding */ styleValue)\n/* harmony export */ });\n/* harmony import */ var _window_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../window.js */ \"./node_modules/d3-selection/src/window.js\");\n\n\nfunction styleRemove(name) {\n  return function() {\n    this.style.removeProperty(name);\n  };\n}\n\nfunction styleConstant(name, value, priority) {\n  return function() {\n    this.style.setProperty(name, value, priority);\n  };\n}\n\nfunction styleFunction(name, value, priority) {\n  return function() {\n    var v = value.apply(this, arguments);\n    if (v == null) this.style.removeProperty(name);\n    else this.style.setProperty(name, v, priority);\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value, priority) {\n  return arguments.length > 1\n      ? this.each((value == null\n            ? styleRemove : typeof value === \"function\"\n            ? styleFunction\n            : styleConstant)(name, value, priority == null ? \"\" : priority))\n      : styleValue(this.node(), name);\n}\n\nfunction styleValue(node, name) {\n  return node.style.getPropertyValue(name)\n      || (0,_window_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(node).getComputedStyle(node, null).getPropertyValue(name);\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/style.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selection/text.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/text.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction textRemove() {\n  this.textContent = \"\";\n}\n\nfunction textConstant(value) {\n  return function() {\n    this.textContent = value;\n  };\n}\n\nfunction textFunction(value) {\n  return function() {\n    var v = value.apply(this, arguments);\n    this.textContent = v == null ? \"\" : v;\n  };\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {\n  return arguments.length\n      ? this.each(value == null\n          ? textRemove : (typeof value === \"function\"\n          ? textFunction\n          : textConstant)(value))\n      : this.node().textContent;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selection/text.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selector.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-selection/src/selector.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction none() {}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {\n  return selector == null ? none : function() {\n    return this.querySelector(selector);\n  };\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selector.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/selectorAll.js":
/*!******************************************************!*\
  !*** ./node_modules/d3-selection/src/selectorAll.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction empty() {\n  return [];\n}\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {\n  return selector == null ? empty : function() {\n    return this.querySelectorAll(selector);\n  };\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/selectorAll.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/sourceEvent.js":
/*!******************************************************!*\
  !*** ./node_modules/d3-selection/src/sourceEvent.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event) {\n  let sourceEvent;\n  while (sourceEvent = event.sourceEvent) event = sourceEvent;\n  return event;\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/sourceEvent.js?");

/***/ }),

/***/ "./node_modules/d3-selection/src/window.js":
/*!*************************************************!*\
  !*** ./node_modules/d3-selection/src/window.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(node) {\n  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node\n      || (node.document && node) // node is a Window\n      || node.defaultView; // node is a Document\n}\n\n\n//# sourceURL=webpack://hubar/./node_modules/d3-selection/src/window.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/lasso.js");
/******/ 	
/******/ })()
;