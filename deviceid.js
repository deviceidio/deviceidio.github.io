var _loaded = {};
function addScript(url) {
  if (!loaded[url]) {
    var s = document.createElement('script');
    s.src = url;
    document.head.appendChild(s);
    _loaded[url] = true;
  }
}
addScript("https://deviceidio.github.io/ua-parser.js");
addScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js");
addScript("https://cdn.jsdelivr.net/gh/Joe12387/detectIncognito@main/dist/es5/detectIncognito.min.js");
addScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function detectIncognito() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var browserName = 'Unknown';
                        function __callback(isPrivate) {
                            resolve({
                                isPrivate: isPrivate,
                                browserName: browserName
                            });
                        }
                        function identifyChromium() {
                            var ua = navigator.userAgent;
                            if (ua.match(/Chrome/)) {
                                if (navigator.brave !== undefined) {
                                    return 'Brave';
                                }
                                else if (ua.match(/Edg/)) {
                                    return 'Edge';
                                }
                                else if (ua.match(/OPR/)) {
                                    return 'Opera';
                                }
                                return 'Chrome';
                            }
                            else {
                                return 'Chromium';
                            }
                        }
                        function assertEvalToString(value) {
                            return value === eval.toString().length;
                        }
                        function isSafari() {
                            var v = navigator.vendor;
                            return (v !== undefined && v.indexOf('Apple') === 0 && assertEvalToString(37));
                        }
                        function isChrome() {
                            var v = navigator.vendor;
                            return (v !== undefined && v.indexOf('Google') === 0 && assertEvalToString(33));
                        }
                        function isFirefox() {
                            return (document.documentElement !== undefined &&
                                document.documentElement.style.MozAppearance !== undefined &&
                                assertEvalToString(37));
                        }
                        function isMSIE() {
                            return (navigator.msSaveBlob !== undefined && assertEvalToString(39));
                        }
                        /**
                         * Safari (Safari for iOS & macOS)
                         **/
                        function newSafariTest() {
                            var tmp_name = String(Math.random());
                            try {
                                var db = window.indexedDB.open(tmp_name, 1);
                                db.onupgradeneeded = function (i) {
                                    var _a, _b;
                                    var res = (_a = i.target) === null || _a === void 0 ? void 0 : _a.result;
                                    try {
                                        res.createObjectStore('test', {
                                            autoIncrement: true
                                        }).put(new Blob());
                                        __callback(false);
                                    }
                                    catch (e) {
                                        var message = e;
                                        if (e instanceof Error) {
                                            message = (_b = e.message) !== null && _b !== void 0 ? _b : e;
                                        }
                                        if (typeof message !== 'string') {
                                            __callback(false);
                                            return;
                                        }
                                        var matchesExpectedError = message.includes('BlobURLs are not yet supported');
                                        __callback(matchesExpectedError);
                                        return;
                                    }
                                    finally {
                                        res.close();
                                        window.indexedDB.deleteDatabase(tmp_name);
                                    }
                                };
                            }
                            catch (e) {
                                __callback(false);
                            }
                        }
                        function oldSafariTest() {
                            var openDB = window.openDatabase;
                            var storage = window.localStorage;
                            try {
                                openDB(null, null, null, null);
                            }
                            catch (e) {
                                __callback(true);
                                return;
                            }
                            try {
                                storage.setItem('test', '1');
                                storage.removeItem('test');
                            }
                            catch (e) {
                                __callback(true);
                                return;
                            }
                            __callback(false);
                        }
                        function safariPrivateTest() {
                            if (navigator.maxTouchPoints !== undefined) {
                                newSafariTest();
                            }
                            else {
                                oldSafariTest();
                            }
                        }
                        /**
                         * Chrome
                         **/
                        function getQuotaLimit() {
                            var w = window;
                            if (w.performance !== undefined &&
                                w.performance.memory !== undefined &&
                                w.performance.memory.jsHeapSizeLimit !== undefined) {
                                return performance.memory.jsHeapSizeLimit;
                            }
                            return 1073741824;
                        }
                        // >= 76
                        function storageQuotaChromePrivateTest() {
                            navigator.webkitTemporaryStorage.queryUsageAndQuota(function (_, quota) {
                                var quotaInMib = Math.round(quota / (1024 * 1024));
                                var quotaLimitInMib = Math.round(getQuotaLimit() / (1024 * 1024)) * 2;
                                __callback(quotaInMib < quotaLimitInMib);
                            }, function (e) {
                                reject(new Error('detectIncognito somehow failed to query storage quota: ' +
                                    e.message));
                            });
                        }
                        // 50 to 75
                        function oldChromePrivateTest() {
                            var fs = window.webkitRequestFileSystem;
                            var success = function () {
                                __callback(false);
                            };
                            var error = function () {
                                __callback(true);
                            };
                            fs(0, 1, success, error);
                        }
                        function chromePrivateTest() {
                            if (Promise !== undefined && Promise.allSettled !== undefined) {
                                storageQuotaChromePrivateTest();
                            }
                            else {
                                oldChromePrivateTest();
                            }
                        }
                        /**
                         * Firefox
                         **/
                        function firefoxPrivateTest() {
                            __callback(navigator.serviceWorker === undefined);
                        }
                        /**
                         * MSIE
                         **/
                        function msiePrivateTest() {
                            __callback(window.indexedDB === undefined);
                        }
                        function main() {
                            if (isSafari()) {
                                browserName = 'Safari';
                                safariPrivateTest();
                            }
                            else if (isChrome()) {
                                browserName = identifyChromium();
                                chromePrivateTest();
                            }
                            else if (isFirefox()) {
                                browserName = 'Firefox';
                                firefoxPrivateTest();
                            }
                            else if (isMSIE()) {
                                browserName = 'Internet Explorer';
                                msiePrivateTest();
                            }
                            else {
                                reject(new Error('detectIncognito cannot determine the browser'));
                            }
                        }
                        main();
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

(function (name, context, definition) {
    "use strict";
    if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
    else if (typeof define === "function" && define.amd) { define(definition); }
    else { context[name] = definition(); }
  })("DeviceID", this, function() {
    "use strict";
    // for IE8 and older
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;
        if (this == null) {
          throw new TypeError("'this' is null or undefined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) {
          return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
          n = 0;
        }
        if (n >= len) {
          return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
          if (k in O && O[k] === searchElement) {
            return k;
          }
          k++;
        }
        return -1;
      };
    }
    var DeviceID = function(options) {
      this.loaded = ''; // loaded token for communication
      this.stored_id = '';  // visit identifier for TLS
      this.old = ''; // stored localStorage ID
      this.cookie = ''; // stored cookie ID
      //this.url = 'https://test.deviceid.io:2996';
      this.url = 'https://api.deviceid.io';
      this.options = options;
      this.uap = new UAParser();
     // this.iv = 'c7VEVapazCwNVcWgi1Ej'.substring(0, 16);

     this.iv = CryptoJS.enc.Utf8.parse('c7VEVapazCwNVcWgi1Ej');
    };
    DeviceID.prototype = {
      load: function(done){
      //   localStorage.removeItem('c:GkK?_5eVdQdiQT0Fb?');
    // this.setCookie('-BAL4_z*-wQ=6TYqCA!U', '', {secure: true, 'expires': 3600});
     this.stored_id = localStorage.getItem('deviceID_identifier');
     if (this.stored_id == null || this.stored_id == undefined || this.stored_id.length != 20) {
         this.stored_id = this.makeid(20);
         localStorage.setItem('deviceID_identifier', this.stored_id);
     }
 
     return done(new Promise(async (resolve, reject) => {
        if (typeof this.options === 'object') {
         if (!("apiKey" in this.options)) {
             reject('please provide an apiKey');
             return;
         } else if (!("secret" in this.options)) {
             reject('please provide a secret key');
             return;
         }
        } else {
            reject('please provide data as an object to the load function');
        }
         const xhr = new XMLHttpRequest();
         xhr.onreadystatechange = () => {
             if (xhr.readyState === XMLHttpRequest.DONE) {
                 if (xhr.status === 200) {
                   this.loaded = xhr.responseText;
                   this.key = this.options.secret;
                   if (typeof(Storage) !== "undefined") {
                     this.old = localStorage.getItem('c:GkK?_5eVdQdiQT0Fb?');
                     if (navigator.cookieEnabled) {
                         this.cookieStored = this.getCookie('-BAL4_z*-wQ=6TYqCA!U');
                     }
                   } 
                   resolve(true);
                   const xhr1 = new XMLHttpRequest();
          xhr1.open('POST', 'https://test.deviceid.io/index.json');
      
          xhr1.setRequestHeader("Content-Type", "text/plain");
          xhr1.send(JSON.stringify({id: this.stored_id}));
                   return;
                 } else {
                     reject(xhr.responseText);
                     return;
                 }
             }
             }
         xhr.open('POST', this.url + '/load');
         xhr.setRequestHeader("Content-Type", "text/plain");
         xhr.send(JSON.stringify({key: encodeURIComponent(this.options.apiKey)}));
         detectIncognito().then((res) => {
            this.prv = res;
         });
         this.device = this.device();
     }));
      },
      id: async function(done){
        return done(new Promise(async (resolve, reject) => {
        const obj = {
            a: this.fonts(),
            b: this.cryptoSupport(),
            d: this.blending(),
            g: await this.getAudio(this),
            i: this.osCpu(),
            j: this.getLanguages(),
            k: window.screen.colorDepth,
            l: navigator.deviceMemory,
            m: window.screen.width+"x"+window.screen.height,
            c: window.screen.availHeight+"x"+window.screen.availWidth,
            n: this.getHardwareConcurrency(),
            o: new Date().getTimezoneOffset(),
            t: this.getNavigatorCpuClass(),
            v: this.getMimeTypes(),
            w: this.getCanvas(),
            x: this.getTouchSupport(),
            bb: this.colorGamut(),
            cc: this.invertedColors(),
            dd: this.forcedColors(),
            ee: this.monochrome(),
            ff: this.contrast(),
            gg: this.reducedMotion(),
            hh: this.hdr(),
            ii: this.getMathsConstants(),
            jj: await this.webGLParameters(),
            ll: this.arch(),
            b0: this.reducedTransparency(),
            b2: this.webGL()

        }
    obj['zz'] = this.x64hash128(JSON.stringify(obj), 31 );
    const mini_print = {
        a: obj.a,
        d: obj.g,
        f: obj.ii,
        h: obj.b2
    }
    obj['b1'] = this.x64hash128(JSON.stringify(mini_print), 31 );
    obj['a2'] = navigator.appCodeName;
    obj['a3'] = navigator.appName;
    obj['a4'] = navigator.appVersion;
    obj['a5'] = navigator.product; // 1, 1
    obj['a6'] = navigator.productSub; // 1, 2
    obj['a7'] = this.x64hash128(this.getNavigatorPrototype(), 31 ); // 1, 4
    obj['a9'] = navigator.buildID;
    obj['kk'] = navigator.pdfViewerEnabled;
    obj['aa'] = navigator.cookieEnabled;
    obj['p'] = this.sessionStorage();
    obj['q'] = this.localStorage();
    obj['r'] = this.indexedDB();
    obj['s'] = Boolean(window.openDatabase);
    obj['ua'] = navigator.userAgent;
        obj['y'] = navigator.vendor;
        obj['z'] = navigator.vendorSub;
        

        const end = performance.now();
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                  const timing = performance.now() - end;
                  var decrypted = CryptoJS.AES.decrypt(xhr.responseText, this.key).toString(CryptoJS.enc.Utf8);
                  const parsed = JSON.parse(decrypted);
                  if (parsed['code'] != null) {
                      localStorage.setItem('c:GkK?_5eVdQdiQT0Fb?', parsed['code']);
                      this.setCookie('-BAL4_z*-wQ=6TYqCA!U', parsed['code'], {secure: true, 'expires': 3600});
                  }
                  delete parsed['code'];
                  parsed['private'] = this.prv;
                  parsed['platform'] = this.uapRes;
                  parsed['adblock'] = obj.c;
                  parsed['dev'] = this.device;
                  resolve(parsed);
                  const xhr1 = new XMLHttpRequest();
                  xhr1.open('POST', this.url + '/updateTime');
                  xhr1.setRequestHeader("Content-Type", "text/plain");
                  xhr1.send(JSON.stringify({timing, visit_id: parsed['visit_id']}));
                  } else {
                      reject(xhr.responseText);
                    }
                }
            }
            xhr.open('POST', this.url + '/id');
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.loaded);
            xhr.setRequestHeader("Content-Type", "text/plain");

            var res = {tls: this.stored_id, dev: this.device, url: window.location.href, platform: {}, private: this.prv, print: obj, old: this.old, cookie: this.cookieStored, start: this.sentTime, end, local: obj.q};
            if (this.options != undefined) {
                if (this.options.request_id != undefined) {res['id'] = params.request_id}
                if (this.options.data != undefined) {res['tag'] = params.data}
            }
            xhr.send(JSON.stringify(res));
        }));
      },
      device: function() {
        this.uapRes = this.uap.getResult();
    var device = 0;
    const arch = this.uapRes.cpu.architecture;
    if (this.uapRes.os != undefined && this.uapRes.os != null && this.uapRes.os.name == 'macOS' || this.uapRes.device.model == 'Macintosh') {
        device = 1; 
    } else if (this.uapRes.device != null && this.uapRes.device != undefined && this.uapRes.device.vendor == 'Apple') {
        if (this.uapRes.os.name == 'iOS') {
            device = 3;
        } else if (uap.os.name == 'watchOS') {
            device = 2;
        } else {
            device = 1
        }
    } else if (arch == 'amd64' || arch == 'ia32' || arch == 'ia64' || arch == 'pa-risc' || arch == 'sparc' || arch == 'sparch64') { // Desktop
        device = 0;
    } else if (arch == '68k') { // mobile
        device = 6;
    } else if (arch == 'arm64') { // ipad / iphone
        device = 3;
    } else if (arch == 'ppc') { // mac
        device = 1;
    } else if (arch == 'avr' || arch == 'armhf' || arch == 'irix' || arch == 'irix64' || arch == 'mips' || arch == 'mips64') { // something weird
        device = 7;
    } else { // cpu arch undefined
        if (this.uapRes.device.type == undefined) {
            if (this.uapRes.os.name == undefined) {
                device = 7;                
            } else {
                device = checkOS(this.uapRes);
            }
        } else {
            if (this.uapRes.device == null || this.uapRes.device == undefined) {
                device = 0;
            } else {
            const type = this.uapRes.device.type;
            if (type == 'mobile') {
                device = 6
            } else if (type == 'tablet') {
                device = 5;
            } else if (type == 'werable') {
                device = 2;
            } else if (this.uapRes.os != null && this.uapRes.os != undefined) {
                if (this.uapRes.os == null || this.uapRes.os == undefined || this.uapRes.os.name == undefined) {
                    device = 7;
                } else {
                    device = checkOS(this.uapRes);
                }
            }
        }
        }
    } 
    return device;
      },
    indexedDB: function() {
        try {
            return Boolean(window.indexedDB)
          } catch (e) {
            return true
          }
    },
    localStorage: function() {
        try {
            return Boolean(window.localStorage)
          } catch (e) {
            return true
          }
    },
    sessionStorage: function() {
        try {
            return Boolean(window.sessionStorage)
        } catch(e) {
            return true
        }
    },
    getNavigatorPrototype: function() {
        try{
            var obj = window.navigator;
            var protoNavigator = [];
            do Object.getOwnPropertyNames(obj).forEach(function(name) {
                protoNavigator.push(name);
            });
            while(obj = Object.getPrototypeOf(obj));
    
            var res;
            var finalProto = [];
            protoNavigator.forEach(function(prop){
                var objDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), prop);
                if(objDesc != undefined){
                if(objDesc.value != undefined){
                    res = objDesc.value.toString();
                }else if(objDesc.get != undefined){
                    res = objDesc.get.toString();
                }
                }else{
                    res = "";
                }
                finalProto.push(prop+"~~~"+res);
    
            });
            return finalProto.join(";;;");
        } catch(e){
            return '';
        }
    },
    webGL: function() {
        var canvas, ctx, width = 256, height = 128;
      canvas = document.createElement("canvas");
      canvas.width = width,
      canvas.height = height,
      ctx = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || canvas.getContext("moz-webgl");
      if (ctx == null || ctx == undefined) return '';
        try {
            var f = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
            var g = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
            var h = ctx.createBuffer();
    
            ctx.bindBuffer(ctx.ARRAY_BUFFER, h);
    
            var i = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .7321, 0]);
    
            ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW), h.itemSize = 3, h.numItems = 3;
    
            var j = ctx.createProgram();
            var k = ctx.createShader(ctx.VERTEX_SHADER);
    
            ctx.shaderSource(k, f);
            ctx.compileShader(k);
    
            var l = ctx.createShader(ctx.FRAGMENT_SHADER);
    
            ctx.shaderSource(l, g);
            ctx.compileShader(l);
            ctx.attachShader(j, k);
            ctx.attachShader(j, l);
            ctx.linkProgram(j);
            ctx.useProgram(j);
    
            j.vertexPosAttrib = ctx.getAttribLocation(j, "attrVertex");
            j.offsetUniform = ctx.getUniformLocation(j, "uniformOffset");
    
            ctx.enableVertexAttribArray(j.vertexPosArray);
            ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);
            ctx.uniform2f(j.offsetUniform, 1, 1);
            ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);
    
        }
        catch (e) {	}
    
        var m = "";
    
      var n = new Uint8Array(width * height * 4);
      ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);
      m = JSON.stringify(n).replace(/,?"[0-9]+":/g, "");
      return this.x64hash128(m, 31);
  },
    arch: function() {
        const f = new Float32Array(1);
        const u = new Uint8Array(f.buffer);
        f[0] = Infinity / Infinity; 
        return u[3];
    },
     webGLParameters: async function() {
        // Based on and inspired by https://github.com/CesiumGS/webglreport

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
const WebGLConstants = [
    'ALIASED_LINE_WIDTH_RANGE',
    'ALIASED_POINT_SIZE_RANGE',
    'ALPHA_BITS',
    'BLUE_BITS',
    'DEPTH_BITS',
    'GREEN_BITS',
    'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
    'MAX_CUBE_MAP_TEXTURE_SIZE',
    'MAX_FRAGMENT_UNIFORM_VECTORS',
    'MAX_RENDERBUFFER_SIZE',
    'MAX_TEXTURE_IMAGE_UNITS',
    'MAX_TEXTURE_SIZE',
    'MAX_VARYING_VECTORS',
    'MAX_VERTEX_ATTRIBS',
    'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
    'MAX_VERTEX_UNIFORM_VECTORS',
    'MAX_VIEWPORT_DIMS',
    'RED_BITS',
    'RENDERER',
    'SHADING_LANGUAGE_VERSION',
    'STENCIL_BITS',
    'VERSION'
]

const WebGL2Constants = [
    'MAX_VARYING_COMPONENTS',
    'MAX_VERTEX_UNIFORM_COMPONENTS',
    'MAX_VERTEX_UNIFORM_BLOCKS',
    'MAX_VERTEX_OUTPUT_COMPONENTS',
    'MAX_PROGRAM_TEXEL_OFFSET',
    'MAX_3D_TEXTURE_SIZE',
    'MAX_ARRAY_TEXTURE_LAYERS',
    'MAX_COLOR_ATTACHMENTS',
    'MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS',
    'MAX_COMBINED_UNIFORM_BLOCKS',
    'MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS',
    'MAX_DRAW_BUFFERS',
    'MAX_ELEMENT_INDEX',
    'MAX_FRAGMENT_INPUT_COMPONENTS',
    'MAX_FRAGMENT_UNIFORM_COMPONENTS',
    'MAX_FRAGMENT_UNIFORM_BLOCKS',
    'MAX_SAMPLES',
    'MAX_SERVER_WAIT_TIMEOUT',
    'MAX_TEXTURE_LOD_BIAS',
    'MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS',
    'MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS',
    'MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS',
    'MAX_UNIFORM_BLOCK_SIZE',
    'MAX_UNIFORM_BUFFER_BINDINGS',
    'MIN_PROGRAM_TEXEL_OFFSET',
    'UNIFORM_BUFFER_OFFSET_ALIGNMENT'
]

const Categories = {
    'uniformBuffers': [
        'MAX_UNIFORM_BUFFER_BINDINGS',
        'MAX_UNIFORM_BLOCK_SIZE',
        'UNIFORM_BUFFER_OFFSET_ALIGNMENT',
        'MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS',
        'MAX_COMBINED_UNIFORM_BLOCKS',
        'MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS',
    ],
    'debugRendererInfo': [
        'UNMASKED_VENDOR_WEBGL',
        'UNMASKED_RENDERER_WEBGL',
    ],
    'fragmentShader': [
        'MAX_FRAGMENT_UNIFORM_VECTORS',
        'MAX_TEXTURE_IMAGE_UNITS',
        'MAX_FRAGMENT_INPUT_COMPONENTS',
        'MAX_FRAGMENT_UNIFORM_COMPONENTS',
        'MAX_FRAGMENT_UNIFORM_BLOCKS',
        'FRAGMENT_SHADER_BEST_FLOAT_PRECISION',
        'MIN_PROGRAM_TEXEL_OFFSET',
        'MAX_PROGRAM_TEXEL_OFFSET',
    ],
    'frameBuffer': [
        'MAX_DRAW_BUFFERS',
        'MAX_COLOR_ATTACHMENTS',
        'MAX_SAMPLES',
        'RGBA_BITS',
        'DEPTH_STENCIL_BITS',
        'MAX_RENDERBUFFER_SIZE',
        'MAX_VIEWPORT_DIMS'
    ],
    'rasterizer': [
        'ALIASED_LINE_WIDTH_RANGE',
        'ALIASED_POINT_SIZE_RANGE',
    ],
    'textures': [
        'MAX_TEXTURE_SIZE',
        'MAX_CUBE_MAP_TEXTURE_SIZE',
        'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
        'MAX_TEXTURE_MAX_ANISOTROPY_EXT',
        'MAX_3D_TEXTURE_SIZE',
        'MAX_ARRAY_TEXTURE_LAYERS',
        'MAX_TEXTURE_LOD_BIAS',
    ],
    'transformFeedback': [
        'MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS',
        'MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS',
        'MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS',
    ],
    'vertexShader': [
        'MAX_VARYING_VECTORS',
        'MAX_VERTEX_ATTRIBS',
        'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
        'MAX_VERTEX_UNIFORM_VECTORS',
        'MAX_VERTEX_UNIFORM_COMPONENTS',
        'MAX_VERTEX_UNIFORM_BLOCKS',
        'MAX_VERTEX_OUTPUT_COMPONENTS',
        'MAX_VARYING_COMPONENTS',
        'VERTEX_SHADER_BEST_FLOAT_PRECISION',
    ],
    'webGLContextInfo': [
        'CONTEXT',
        'ANTIALIAS',
        'DIRECT_3D',
        'MAJOR_PERFORMANCE_CAVEAT',
        'RENDERER',
        'SHADING_LANGUAGE_VERSION',
        'VERSION',
    ],
}

/* parameter helpers */
// https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic
const getMaxAnisotropy = (context) => {
    try {
        const extension = (
            context.getExtension('EXT_texture_filter_anisotropic') ||
            context.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
            context.getExtension('MOZ_EXT_texture_filter_anisotropic')
        )
        return context.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
    } catch (error) {
        console.error(error)
        return undefined
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
const getMaxDrawBuffers = (context) => {
    try {
        const extension = (
            context.getExtension('WEBGL_draw_buffers') ||
            context.getExtension('WEBKIT_WEBGL_draw_buffers') ||
            context.getExtension('MOZ_WEBGL_draw_buffers')
        )
        return context.getParameter(extension.MAX_DRAW_BUFFERS_WEBGL)
    } catch (error) {
        return undefined
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat/precision
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat/rangeMax
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat/rangeMin
const getShaderData = (shader) => {
    const shaderData = {}
    try {
        for (const prop in shader) {
            const shaderPrecisionFormat = shader[prop]
            shaderData[prop] = {
                precision: shaderPrecisionFormat.precision,
                rangeMax: shaderPrecisionFormat.rangeMax,
                rangeMin: shaderPrecisionFormat.rangeMin
            }
        }
        return shaderData
    } catch (error) {
        return undefined
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
const getShaderPrecisionFormat = (context, shaderType) => {
    const props = ['LOW_FLOAT', 'MEDIUM_FLOAT', 'HIGH_FLOAT']
    const precisionFormat = {}
    try {
        props.forEach(prop => {
            precisionFormat[prop] = context.getShaderPrecisionFormat(context[shaderType], context[prop])
            return
        })
        return precisionFormat
    } catch (error) {
        return undefined
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
const getUnmasked = (context, constant) => {
    try {
        const extension = context.getExtension('WEBGL_debug_renderer_info')
        const unmasked = context.getParameter(extension[constant])
        return unmasked
    } catch (error) {
        return undefined
    }
}

// Takes the parameter object and generate a fingerprint of sorted numeric values
function getNumericValues(parameters) {
  if (!parameters) return
  return [
    ...new Set(Object.values(parameters)
      .filter((val) => val && typeof val != 'string')
      .flat()
      .map((val) => Number(val) || 0)),
  ].sort((a, b) => (a - b))
}

// Highlight common GPU brands
function getGpuBrand(gpu) {
  if (!gpu) return
  const gpuBrandMatcher = /(adreno|amd|apple|intel|llvm|mali|microsoft|nvidia|parallels|powervr|samsung|swiftshader|virtualbox|vmware)/i

  const brand = (
    /radeon/i.test(gpu) ? 'AMD' :
    /geforce/i.test(gpu) ? 'NVIDIA' :
    ( (gpuBrandMatcher.exec(gpu) || [])[0] || 'Other' )
  )

  return brand
}

/* get WebGLRenderingContext or WebGL2RenderingContext */
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext
function getWebGL(contextType) {
    const errors = []
    let data = {}
    const isWebGL = /^(experimental-)?webgl$/ 
    const isWebGL2 = /^(experimental-)?webgl2$/
    const supportsWebGL = isWebGL.test(contextType) && 'WebGLRenderingContext' in window
    const supportsWebGL2 = isWebGL2.test(contextType) && 'WebGLRenderingContext' in window
    
    // detect support
    if (!supportsWebGL && !supportsWebGL2) {
        errors.push('not supported')
        return [data, errors]
    }

    // get canvas context
    let canvas
    let context
    let hasMajorPerformanceCaveat
    try {
        canvas = document.createElement('canvas')
        context = canvas.getContext(contextType, { failIfMajorPerformanceCaveat: true })
        if (!context) {
            hasMajorPerformanceCaveat = true
            context = canvas.getContext(contextType)
            if (!context) {
                throw new Error(`context of type ${typeof context}`)
            }
        }
    } catch (err) {
        console.error(err)

        errors.push('context blocked')
        return [data, errors]
    }

    // get supported extensions
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getSupportedExtensions
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Using_Extensions
    let webGLExtensions
    try {
        webGLExtensions = context.getSupportedExtensions()
    } catch (error) {
        console.error(error)
        errors.push('extensions blocked')
    }

    // get parameters
    let parameters
    try {
        const VERTEX_SHADER = getShaderData(getShaderPrecisionFormat(context, 'VERTEX_SHADER'))
        const FRAGMENT_SHADER = getShaderData(getShaderPrecisionFormat(context, 'FRAGMENT_SHADER'))

        parameters = {
            ANTIALIAS: context.getContextAttributes().antialias,
            CONTEXT: contextType,
            MAJOR_PERFORMANCE_CAVEAT: hasMajorPerformanceCaveat,
            MAX_TEXTURE_MAX_ANISOTROPY_EXT: getMaxAnisotropy(context),
            MAX_DRAW_BUFFERS_WEBGL: getMaxDrawBuffers(context),
            VERTEX_SHADER,
            VERTEX_SHADER_BEST_FLOAT_PRECISION: Object.values(VERTEX_SHADER.HIGH_FLOAT),
            FRAGMENT_SHADER,
            FRAGMENT_SHADER_BEST_FLOAT_PRECISION: Object.values(FRAGMENT_SHADER.HIGH_FLOAT),
            UNMASKED_VENDOR_WEBGL: getUnmasked(context, 'UNMASKED_VENDOR_WEBGL'),
            UNMASKED_RENDERER_WEBGL: getUnmasked(context, 'UNMASKED_RENDERER_WEBGL')
        }
        
        const glConstants =  [...WebGLConstants, ...(supportsWebGL2 ? WebGL2Constants : [])]
        glConstants.forEach(key => {
            const result = context.getParameter(context[key])
            const typedArray = result && (
                result.constructor === Float32Array ||
                result.constructor === Int32Array
            )
            parameters[key] = typedArray ? [...result] : result
        })

        parameters.RGBA_BITS = [
            parameters.RED_BITS,
            parameters.GREEN_BITS,
            parameters.BLUE_BITS,
            parameters.ALPHA_BITS,
        ]

        parameters.DEPTH_STENCIL_BITS = [
            parameters.DEPTH_BITS,
            parameters.STENCIL_BITS,
        ]

        parameters.DIRECT_3D = /Direct3D|D3D(\d+)/.test(parameters.UNMASKED_RENDERER_WEBGL)

    } catch (error) {
        console.error(error)
        errors.push('parameters blocked')
    }
    const gpu = String([parameters.UNMASKED_VENDOR_WEBGL, parameters.UNMASKED_RENDERER_WEBGL])
    const gpuBrand = getGpuBrand(gpu)

    // Structure parameter data
    let components = {}
    if (parameters) {
        Object.keys(Categories).forEach((name) => {
            const componentData = Categories[name].reduce((acc, key) => {
                if (parameters[key] !== undefined) {
                    acc[key] = parameters[key]
                }
                return acc
            }, {})

            // Only compile if the data exists
            if (Object.keys(componentData).length) {
                components[name] = componentData
            }
        }) 
    }

    data = {
        gpuHash: !parameters ? undefined : [gpuBrand,...getNumericValues(parameters)].join(':'),
        gpu,
        gpuBrand,
        ...components,
        webGLExtensions
    }

    return [data, errors]
}

const value = await Promise.all([
    getWebGL('webgl'),
    getWebGL('webgl2'),
    getWebGL('experimental-webgl'),
]).then((response) => {
    const [webGL, webGL2, experimentalWebGL] = response

    // Extract both data and errors
    const [webGLData, webGLErrors] = webGL
    const [webGL2Data, webGL2Errors] = webGL2
    const [experimentalWebGLData, experimentalWebGLErrors] = experimentalWebGL

    // Show the data
    /*
    console.log('WebGLRenderingContext: ', webGLData)
    console.log('WebGL2RenderingContext: ', webGL2Data)
    console.log('Experimental: ', experimentalWebGLData)
    */
   // return(XXH64(JSON.stringify([webGLData, webGL2Data, experimentalWebGLData]), 0xA3FC ).toString(16));
   return [this.x64hash128(JSON.stringify(webGLData), 31), this.x64hash128(JSON.stringify(webGL2Data), 31), this.x64hash128(JSON.stringify(experimentalWebGLData), 31)]
    /*
    webGLParma.push(XXH64(JSON.stringify(webGLData), 0xA3FC ).toString(16));
    webGLParma.push(XXH64(JSON.stringify(webGL2Data), 0xA3FC ).toString(16));
    webGLParma.push(XXH64(JSON.stringify(experimentalWebGLData), 0xA3FC ).toString(16));
    */
}).catch(error => {
    console.error(error)
})
return value;
      },
     getMathsConstants: function() {
        function asinh(x) {
            if (x === -Infinity) {
                return x;
            } else {
                return Math.log(x + Math.sqrt(x * x + 1));
            }
        }
    
        function acosh(x) {
            return Math.log(x + Math.sqrt(x * x - 1));
        }
    
        function atanh(x) {
            return Math.log((1 + x) / (1 - x)) / 2;
        }
    
        function cbrt(x) {
            var y = Math.pow(Math.abs(x), 1 / 3);
            return x < 0 ? -y : y;
        }
    
        function cosh(x) {
            var y = Math.exp(x);
            return (y + 1 / y) / 2;
        }
    
        function expm1(x) {
            return Math.exp(x) - 1;
        }
    
        function log1p(x) {
            return Math.log(1 + x);
        }
    
        function sinh(x) {
            var y = Math.exp(x);
            return (y - 1 / y) / 2;
        }
    
        function tanh(x) {
            if (x === Infinity) {
                return 1;
            } else if (x === -Infinity) {
                return -1;
            } else {
                var y = Math.exp(2 * x);
                return (y - 1) / (y + 1);
            }
        }
    
        return this.x64hash128([
            asinh(1),
            (acosh(1e300) == "Infinity") ? "Infinity" : acosh(1e300),
            atanh(0.5),
            expm1(1),
            cbrt(100),
            log1p(10),
            sinh(1),
            cosh(10),
            tanh(1)
        ].join(";"), 31);
    },
     hdr: function() {
        if (this.matchProp('high', 'dynamic-range')) {
            return true;
        } else if (this.matchProp('standard', 'dynamic-range')) {
            return true;
        } else return ''
    },
    contrast: function() {
        const keywords = ['no-preference', 'more', 'less', 'forced'];
        for (const keyword of keywords) {
            if (this.matchProp(keyword, 'prefers-contrast')) {
                return keyword;
            }
        }
        return '';
    },
    monochrome: function() {
        var min = 0;
        var max = 255;
        while (min <= max) {
            const mid = Math.floor((min + max) / 2);
            if (this.matchProp(mid, 'max-monochrome')) {
              return mid;
            } else if (this.matchProp(mid + 1, 'max-monochrome')) {
              return mid + 1; 
            } else {
              min = mid + 1;
            }
          }
          return '';
    },
    forcedColors: function() {
        if (this.matchProp('active', 'forced-colors')) {
            return true;
        } else if (this.matchProp('none', 'forced-colors')) {
            return false;
        } else return undefined
    },
    invertedColors: function() {
        if (this.matchProp('inverted', 'inverted-colors'))  {
            return 2;
        } else if (this.matchProp('inverted', 'none')) {
            return 1;
        } else {
            return 0;
        }
    },

    reducedMotion: function() {
        if (this.matchProp('reduce', 'prefers-reduced-motion')) {
            return 2;
        } else if (this.matchProp('no-prederence', 'prefers-reduced-motion')) {
            return 1;
        } else {
            return 0;
        }
    },

    reducedTransparency: function() {
        if (this.matchProp('reduce', 'prefers-reduced-transparency')) {
            return 2;
        } else if (this.matchProp('no-prederence', 'prefers-reduced-transparency')) {
            return 1;
        } else {
            return 0;
        }
    },
      matchProp: function(value, media) {
        return matchMedia(`(${media}: `.concat(value, ")")).matches;
    },
    colorGamut: function() {
        const gamuts = ['rec2020', 'p3', 'srgb'];
        return gamuts.some(gamut => this.matchProp(gamut, 'color-gamut')) ? gamuts[0] : '';
    },
    getTouchSupport: function() {
        var maxTouchPoints = 0;
        var touchEvent = false;
        if(typeof navigator.maxTouchPoints !== "undefined") {
            maxTouchPoints = navigator.maxTouchPoints;
        } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
            maxTouchPoints = navigator.msMaxTouchPoints;
        }
        try {
            document.createEvent("TouchEvent");
            touchEvent = true;
        } catch(_) { /* squelch */ }
        var touchStart = "ontouchstart" in window;
        return [maxTouchPoints, touchEvent, touchStart].join(";");
    },
    createCanvas: function() {
        try {
            const canvas = document.createElement("canvas");
            canvas.height = 60;
            canvas.width = 400;
            const canvasContext = canvas.getContext("2d");
            canvas.style.display = "inline";
            canvasContext.textBaseline = "alphabetic";
            canvasContext.fillStyle = "#f60";
            canvasContext.fillRect(125, 1, 62, 20);
            canvasContext.fillStyle = "#069";
            canvasContext.font = "11pt no-real-font-123";
            canvasContext.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
            canvasContext.fillStyle = "rgba(102, 204, 0, 0.7)";
            canvasContext.font = "18pt Arial";
            canvasContext.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);
            return canvas.toDataURL();
        } catch(e){
            return "";
        }
    },
      getCanvas: function() {
        const cnv = this.createCanvas();
        if (cnv == '') return '';
        const cnv1 = this.createCanvas();
        if (cnv1 != cnv) {
            return ''
        } else {
            return this.x64hash128(cnv, 31);
        }
      },
    getMimeTypes: function() {
        var mimeTypes = [];
        for(var i = 0; i < navigator.mimeTypes.length; i++){
            var mt = navigator.mimeTypes[i];
            mimeTypes.push([mt.description, mt.type, mt.suffixes].join("~~"));
        }
        return this.x64hash128(mimeTypes.join(";;"), 31);
    },
    getNavigatorCpuClass: function() {
        if(navigator.cpuClass){
            return navigator.cpuClass;
        }
        return '';
    },
    getHardwareConcurrency: function() {
        if(navigator.hardwareConcurrency){
            return navigator.hardwareConcurrency;
        }
        return '';
    },
    getLanguages: function() {
        if(navigator.languages){
            return navigator.languages.join("~~");
        }
        return '';
    },
    osCpu: function() {
        if(navigator.oscpu){
            return navigator.oscpu;
        }
        return '';
    },
    getAudio: async function(old_context) {
        var audioData = {};
    
    if ((window.AudioContext || window.webkitAudioContext) === undefined){
        audioData = "Not supported";
    } else {
        // Performs fingerprint as found in https://client.a.pxi.pub/PXmssU3ZQ0/main.min.js
        //Sum of buffer values
        function run_pxi_fp() {
            try {
                const context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100)
                audioData.pxi_output = 0;
    
                // Create oscillator
                const pxi_oscillator = context.createOscillator();
                pxi_oscillator.type = "triangle";
                pxi_oscillator.frequency.value = 1e4;
    
                // Create and configure compressor
                const pxi_compressor = context.createDynamicsCompressor();
                pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
                pxi_compressor.knee && (pxi_compressor.knee.value = 40);
                pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
                pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
                pxi_compressor.attack && (pxi_compressor.attack.value = 0);
                pxi_compressor.release && (pxi_compressor.release.value = .25);
    
                // Connect nodes
                pxi_oscillator.connect(pxi_compressor);
                pxi_compressor.connect(context.destination);
    
                // Start audio processing
                pxi_oscillator.start(0);
                context.startRendering();
                context.oncomplete = function (evnt) {
                    audioData.pxi_output = 0;
                    var dt = '';
                    for (var i = 0; i < evnt.renderedBuffer.length; i++) {
                        dt += evnt.renderedBuffer.getChannelData(0)[i].toString();
                    }
                    audioData.pxi_full_buffer_hash = old_context.x64hash128(JSON.stringify(dt), 31);
                    for (var i = 4500; 5e3 > i; i++) {
                        audioData.pxi_output += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
                    }
                    pxi_compressor.disconnect();
                }
            } catch (u) {
                audioData.pxi_output = 0;
            }
        }
    
        // End PXI fingerprint
    
        // Performs fingerprint as found in some versions of http://metrics.nt.vc/metrics.js
        function a(a, b, c) {
            for (var d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
            d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
            return a
        }
    
        function run_nt_vc_fp() {
            try {
                var nt_vc_context = window.AudioContext || window.webkitAudioContext;
                if ("function" !== typeof nt_vc_context) audioData.nt_vc_output = "Not available";
                else {
                    var f = new nt_vc_context,
                        d = f.createAnalyser();
                    audioData.nt_vc_output = a({}, f, "ac-");
                    audioData.nt_vc_output = a(audioData.nt_vc_output, f.destination, "ac-");
                    audioData.nt_vc_output = a(audioData.nt_vc_output, f.listener, "ac-");
                    audioData.nt_vc_output = a(audioData.nt_vc_output, d, "an-");
                }
            } catch (g) {
                audioData.nt_vc_output = 0
            }
        }
    
        // Performs fingerprint as found in https://www.cdn-net.com/cc.js
        var cc_output = [];
    
        function run_cc_fp() {
            var audioCtx = new (window.AudioContext || window.webkitAudioContext),
                oscillator = audioCtx.createOscillator(),
                analyser = audioCtx.createAnalyser(),
                gain = audioCtx.createGain(),
                scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
    
    
            gain.gain.value = 0; // Disable volume
            oscillator.type = "triangle"; // Set oscillator to output triangle wave
            oscillator.connect(analyser); // Connect oscillator output to analyser input
            analyser.connect(scriptProcessor); // Connect analyser output to scriptProcessor input
            scriptProcessor.connect(gain); // Connect scriptProcessor output to gain input
            gain.connect(audioCtx.destination); // Connect gain output to audiocontext destination
    
            scriptProcessor.onaudioprocess = function (bins) {
                bins = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatFrequencyData(bins);
                for (var i = 0; i < bins.length; i = i + 1) {
                    cc_output.push(bins[i]);
                }
                analyser.disconnect();
                scriptProcessor.disconnect();
                gain.disconnect();
                audioData.cc_output = cc_output.slice(0, 30);
            };
    
            oscillator.start(0);
        }
    
        // Performs a hybrid of cc/pxi methods found above
        var hybrid_output = [];
    
        function run_hybrid_fp() {
            var audioCtx = new (window.AudioContext || window.webkitAudioContext),
                oscillator = audioCtx.createOscillator(),
                analyser = audioCtx.createAnalyser(),
                gain = audioCtx.createGain(),
                scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
    
        // Create and configure compressor
            const compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold && (compressor.threshold.value = -50);
            compressor.knee && (compressor.knee.value = 40);
            compressor.ratio && (compressor.ratio.value = 12);
            compressor.reduction && (compressor.reduction.value = -20);
            compressor.attack && (compressor.attack.value = 0);
            compressor.release && (compressor.release.value = .25);
    
            gain.gain.value = 0; // Disable volume
            oscillator.type = "triangle"; // Set oscillator to output triangle wave
            oscillator.connect(compressor); // Connect oscillator output to dynamic compressor
            compressor.connect(analyser); // Connect compressor to analyser
            analyser.connect(scriptProcessor); // Connect analyser output to scriptProcessor input
            scriptProcessor.connect(gain); // Connect scriptProcessor output to gain input
            gain.connect(audioCtx.destination); // Connect gain output to audiocontext destination
    
            scriptProcessor.onaudioprocess = function (bins) {
                bins = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatFrequencyData(bins);
                for (var i = 0; i < bins.length; i = i + 1) {
                    hybrid_output.push(bins[i]);
                }
                analyser.disconnect();
                scriptProcessor.disconnect();
                gain.disconnect();
    
                audioData.hybrid_output = hybrid_output.slice(0, 30);
            };
    
            oscillator.start(0);
        }
    
        run_pxi_fp();
        run_nt_vc_fp();
        run_cc_fp();
        run_hybrid_fp();
        return this.x64hash128(JSON.stringify(audioData), 31);
    }
    },
    blending: function() {
        const blendingModes = ['screen', 'multiply', 'lighter'];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        for (const mode of blendingModes) {
        try {
            ctx.globalCompositeOperation = mode;
        } catch (error) {
            return false;
        }
        }
        return true;
      },
       makeid: function(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    },
    getCookie: function(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return null;
    },
    
    setCookie: function(name, value, options = {}) {
    
    options = {
      path: '/',
      // add other defaults here if necessary
      ...options
    };
    
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
    
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    
    document.cookie = updatedCookie;
    },    
    cryptoSupport: function() {
        if (!('crypto' in window)) {
          // Crypto API is not available at all
          return false;
        }
      
        try {
          const array = new Uint32Array(10);
          crypto.getRandomValues(array);
        } catch (error) {
          return false;
        }
      
        // Check for specific properties and methods for more comprehensive support:
        return {
          subtle: typeof crypto.subtle === 'object' ,
          random: typeof crypto.getRandomValues === 'function'
        };
      },
    fonts: function(keys, done) {
          var baseFonts = ["monospace", "sans-serif", "serif"];
  
          var fontList = [
                          "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
                          "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
                          "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
                          "Garamond", "Geneva", "Georgia",
                          "Helvetica", "Helvetica Neue",
                          "Impact",
                          "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
                          "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
                          "Palatino", "Palatino Linotype",
                          "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
                          "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
                          "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3", "Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
                          "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
                           "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
                          "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
                          "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
                          "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
                          "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
                          "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
                          "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
                          "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
                          "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
                          "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
                          "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
                          "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
                          "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
                          "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
                          "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
                          "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
                          "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
                          "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
                          "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
                          "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
                          "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
                          "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
                          "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
                          "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
                          "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
                          "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
                          "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
                          "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
                          "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"
                        ];
          //we use m or w because these two characters take up the maximum width.
          // And we use a LLi so that the same matching fonts can get separated
          var testString = "mmmmmmmmmmlli";
  
          //we test using 72px font size, we may use any size. I guess larger the better.
          var testSize = "72px";
  
          var h = document.getElementsByTagName("body")[0];
  
          // div to load spans for the base fonts
          var baseFontsDiv = document.createElement("div");
  
          // div to load spans for the fonts to detect
          var fontsDiv = document.createElement("div");
  
          var defaultWidth = {};
          var defaultHeight = {};
  
          // creates a span where the fonts will be loaded
          var createSpan = function() {
              var s = document.createElement("span");
              /*
               * We need this css as in some weird browser this
               * span elements shows up for a microSec which creates a
               * bad user experience
               */
              s.style.position = "absolute";
              s.style.left = "-9999px";
              s.style.fontSize = testSize;
              s.innerHTML = testString;
              return s;
          };
  
          // creates a span and load the font to detect and a base font for fallback
          var createSpanWithFonts = function(fontToDetect, baseFont) {
              var s = createSpan();
              s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
              return s;
          };
  
          // creates spans for the base fonts and adds them to baseFontsDiv
          var initializeBaseFontsSpans = function() {
              var spans = [];
              for (var index = 0, length = baseFonts.length; index < length; index++) {
                  var s = createSpan();
                  s.style.fontFamily = baseFonts[index];
                  baseFontsDiv.appendChild(s);
                  spans.push(s);
              }
              return spans;
          };
  
          // creates spans for the fonts to detect and adds them to fontsDiv
          var initializeFontsSpans = function() {
              var spans = {};
              for(var i = 0, l = fontList.length; i < l; i++) {
                  var fontSpans = [];
                  for(var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                      var s = createSpanWithFonts(fontList[i], baseFonts[j]);
                      fontsDiv.appendChild(s);
                      fontSpans.push(s);
                  }
                  spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
              }
              return spans;
          };
  
          // checks if a font is available
          var isFontAvailable = function(fontSpans) {
              var detected = false;
              for(var i = 0; i < baseFonts.length; i++) {
                  detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
                  if(detected) {
                      return detected;
                  }
              }
              return detected;
          };
  
          // create spans for base fonts
          var baseFontsSpans = initializeBaseFontsSpans();
  
          // add the spans to the DOM
          h.appendChild(baseFontsDiv);
  
          // get the default width for the three base fonts
          for (var index = 0, length = baseFonts.length; index < length; index++) {
              defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
              defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
          }
  
          // create spans for fonts to detect
          var fontsSpans = initializeFontsSpans();
  
          // add all the spans to the DOM
          h.appendChild(fontsDiv);
  
          // check available fonts
          var available = [];
          for(var i = 0, l = fontList.length; i < l; i++) {
              if(isFontAvailable(fontsSpans[fontList[i]])) {
                  available.push(fontList[i]);
              }
          }
          // remove spans from DOM
          h.removeChild(fontsDiv);
          h.removeChild(baseFontsDiv);
          return available;
      },
      /// MurmurHash3 related functions
  
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // added together as a 64bit int (as an array of two 32bit ints).
      //
      x64Add: function(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        var o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += m[0] + n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
      },
  
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // multiplied together as a 64bit int (as an array of two 32bit ints).
      //
      x64Multiply: function(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        var o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
      },
      //
      // Given a 64bit int (as an array of two 32bit ints) and an int
      // representing a number of bit positions, returns the 64bit int (as an
      // array of two 32bit ints) rotated left by that number of positions.
      //
      x64Rotl: function(m, n) {
        n %= 64;
        if (n === 32) {
          return [m[1], m[0]];
        }
        else if (n < 32) {
          return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
        }
        else {
          n -= 32;
          return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
        }
      },
      //
      // Given a 64bit int (as an array of two 32bit ints) and an int
      // representing a number of bit positions, returns the 64bit int (as an
      // array of two 32bit ints) shifted left by that number of positions.
      //
      x64LeftShift: function(m, n) {
        n %= 64;
        if (n === 0) {
          return m;
        }
        else if (n < 32) {
          return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
        }
        else {
          return [m[1] << (n - 32), 0];
        }
      },
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // xored together as a 64bit int (as an array of two 32bit ints).
      //
      x64Xor: function(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
      },
      //
      // Given a block, returns murmurHash3's final x64 mix of that block.
      // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
      // only place where we need to right shift 64bit ints.)
      //
      x64Fmix: function(h) {
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        return h;
      },
  
      //
      // Given a string and an optional seed as an int, returns a 128 bit
      // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
      //
      x64hash128: function (key, seed) {
        key = key || "";
        seed = seed || 0;
        var remainder = key.length % 16;
        var bytes = key.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [0x87c37b91, 0x114253d5];
        var c2 = [0x4cf5ad43, 0x2745937f];
        for (var i = 0; i < bytes; i = i + 16) {
          k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
          k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
          k1 = this.x64Multiply(k1, c1);
          k1 = this.x64Rotl(k1, 31);
          k1 = this.x64Multiply(k1, c2);
          h1 = this.x64Xor(h1, k1);
          h1 = this.x64Rotl(h1, 27);
          h1 = this.x64Add(h1, h2);
          h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
          k2 = this.x64Multiply(k2, c2);
          k2 = this.x64Rotl(k2, 33);
          k2 = this.x64Multiply(k2, c1);
          h2 = this.x64Xor(h2, k2);
          h2 = this.x64Rotl(h2, 31);
          h2 = this.x64Add(h2, h1);
          h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch(remainder) {
          case 15:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
          case 14:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
          case 13:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
          case 12:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
          case 11:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
          case 10:
            k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
          case 9:
            k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
            k2 = this.x64Multiply(k2, c2);
            k2 = this.x64Rotl(k2, 33);
            k2 = this.x64Multiply(k2, c1);
            h2 = this.x64Xor(h2, k2);
          case 8:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
          case 7:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
          case 6:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
          case 5:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
          case 4:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
          case 3:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
          case 2:
            k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
          case 1:
            k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
            k1 = this.x64Multiply(k1, c1);
            k1 = this.x64Rotl(k1, 31);
            k1 = this.x64Multiply(k1, c2);
            h1 = this.x64Xor(h1, k1);
        }
        h1 = this.x64Xor(h1, [0, key.length]);
        h2 = this.x64Xor(h2, [0, key.length]);
        h1 = this.x64Add(h1, h2);
        h2 = this.x64Add(h2, h1);
        h1 = this.x64Fmix(h1);
        h2 = this.x64Fmix(h2);
        h1 = this.x64Add(h1, h2);
        h2 = this.x64Add(h2, h1);
        return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
      }
    };
    return DeviceID;
  });
