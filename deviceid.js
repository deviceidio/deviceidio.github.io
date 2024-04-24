async function sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    });
  }

   // const UAParser = require('./lib/ua-parser');
    const uap = new UAParser();
    //const url = 'https://test.deviceid.io';
    const url = 'https://api.deviceid.io';
    var loaded = '';
    var key;
    var iv;
    var old = null;
    var cookieStored = null;
    var stored_id = '';
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    function getArch() {
        const f = new Float32Array(1);
        const u = new Uint8Array(f.buffer);
        f[0] = Infinity / Infinity; 
        return u[3];
    }

    function matchProp(value, media) {
        return matchMedia(`(${media}: `.concat(value, ")")).matches;
    }

    function getHardwareConcurrency(){
        if(navigator.hardwareConcurrency){
            return navigator.hardwareConcurrency;
        }
        return '';
    }

    function getNavigatorCpuClass(){
        if(navigator.cpuClass){
            return navigator.cpuClass;
        }
        return '';
    }

    function colorDepth() {
        return window.screen.colorDepth;
    }

    function forcedColors() {
        if (matchProp('active', 'forced-colors')) {
            return true;
        } else if (matchProp('none', 'forced-colors')) {
            return false;
        } else return undefined
    }

    function HDR() {
        if (matchProp('high', 'dynamic-range')) {
            return true;
        } else if (matchProp('standard', 'dynamic-range')) {
            return true;
        } else return undefined
    }

    function getAppCodeName(){
        return navigator.appCodeName;
    }

    function getOscpu(){
        if(navigator.oscpu){
            return navigator.oscpu;
        }
        return '';
    }

    function getAppName(){
        return navigator.appName;
    }

    function getAppVersion(){
        return navigator.appVersion;
    }

    function getLanguages(){
        if(navigator.languages){
            return navigator.languages.join("~~");
        }
        return '';
    }

    function getLocalStorage() {
        try {
            return Boolean(window.localStorage)
          } catch (e) {
            return true
          }
    }

    function monochrome() {
        var min = 0;
        var max = 255;
        while (min <= max) {
            const mid = Math.floor((min + max) / 2);
            if (matchProp(mid, 'max-monochrome')) {
              return mid;
            } else if (matchProp(mid + 1, 'max-monochrome')) {
              return mid + 1; 
            } else {
              min = mid + 1;
            }
          }
          return undefined;
    }

    function getMimeTypes(){
        var mimeTypes = [];
        for(var i = 0; i < navigator.mimeTypes.length; i++){
            var mt = navigator.mimeTypes[i];
            mimeTypes.push([mt.description, mt.type, mt.suffixes].join("~~"));
        }
        return mimeTypes.join(";;");
    }

    function getPluginsUsingMimeTypes(){
        var plugins = [];
        for(var i = 0; i < navigator.mimeTypes.length; i++){
            var mt = navigator.mimeTypes[i];
            plugins.push([mt.enabledPlugin.name, mt.enabledPlugin.description, mt.enabledPlugin.filename].join("::")+mt.type);
        }
        return plugins.join(";;");
    }

    function getProduct(){
        return navigator.product;	
    }

    function getProductSub(){
        return navigator.productSub;
    }

    function getVendor(){
        return navigator.vendor;
    }
    
    function getVendorSub(){
        return navigator.vendorSub;
    }

    function getTouchSupport(){
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
    }

    function getBuildId(){
        if(navigator.buildID){
            return navigator.buildID;
        }
        return '';
    }

    function getNavigatorPrototype(){
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
    }

    function getMathsConstants(){
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
    
        return [
            asinh(1),
            (acosh(1e300) == "Infinity") ? "Infinity" : acosh(1e300),
            atanh(0.5),
            expm1(1),
            cbrt(100),
            log1p(10),
            sinh(1),
            cosh(10),
            tanh(1)
        ].join(";");
    }

    function createCanvas() {
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
            return "Not supported";
        }
    }

async function getAudio() {
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
                audioData.pxi_full_buffer_hash = XXH.h64(dt, 0xA3FC ).toString(16);
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
    return audioData
}
}

    function colorGamut() {
        const gamuts = ['rec2020', 'p3', 'srgb'];
        return gamuts.some(gamut => matchProp(gamut, 'color-gamut')) ? gamuts[0] : '';
    }

    function contrast() {
        const keywords = ['no-preference', 'more', 'less', 'forced'];
  for (const keyword of keywords) {
    if (matchProp(keyword, 'prefers-contrast')) {
      return keyword;
    }
  }
  return '';
    }

    function indexedDB() {
        try {
            return Boolean(window.indexedDB)
          } catch (e) {
            return true
          }
    }

    function sessionStorage() {
        try {
            return Boolean(window.sessionStorage)
        } catch(e) {
            return true
        }
    }

    function invertedColors() {
        if (matchProp('inverted', 'inverted-colors'))  {
            return 2;
        } else if (matchProp('inverted', 'none')) {
            return 1;
        } else {
            return 0;
        }
    }

    function reducedMotion() {
        if (matchProp('reduce', 'prefers-reduced-motion')) {
            return 2;
        } else if (matchProp('no-prederence', 'prefers-reduced-motion')) {
            return 1;
        } else {
            return 0;
        }
    }

    function reducedTransparency() {
        if (matchProp('reduce', 'prefers-reduced-transparency')) {
            return 2;
        } else if (matchProp('no-prederence', 'prefers-reduced-transparency')) {
            return 1;
        } else {
            return 0;
        }
    }

    function isTouchDevice () {
        const prefixes = ['','-webkit-', '-moz-', '-o-', '-ms-', ''];
  const query = query => window.matchMedia(query).matches;
  return ('ontouchstart' in window ||  
          (window.DocumentTouch && document instanceof window.DocumentTouch)) || 
         query(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(''));
      }
      var Detector = function() {
        // a font will be compared against all the three default fonts.
        // and if it doesn't match all 3 then that font is not available.
        var baseFonts = ['monospace', 'sans-serif', 'serif'];
    
        //we use m or w because these two characters take up the maximum width.
        // And we use a LLi so that the same matching fonts can get separated
        var testString = "mmmmmmmmmmlli";
    
        //we test using 72px font size, we may use any size. I guess larger the better.
        var testSize = '72px';
    
        var h = document.getElementsByTagName("body")[0];
    
        // create a SPAN in the document to get the width of the text we use to test
        var s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        var defaultWidth = {};
        var defaultHeight = {};
        for (var index in baseFonts) {
            //get the default width for the three base fonts
            s.style.fontFamily = baseFonts[index];
            h.appendChild(s);
            defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
            defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
            h.removeChild(s);
        }
    
        function detect(font) {
            var detected = false;
            for (var index in baseFonts) {
                s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
                h.appendChild(s);
                var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
                h.removeChild(s);
                detected = detected || matched;
            }
            return detected;
        }
    
        this.detect = detect;
    };

      function getFonts() {
        const t0 = performance.now();
        var fonts = ['.Aqua Kana', '.Helvetica LT MM', '.Times LT MM', '18thCentury', '8514oem', 'AR BERKLEY', 'AR JULIAN', 'AR PL UKai CN', 'AR PL UMing CN', 'AR PL UMing HK', 'AR PL UMing TW', 'AR PL UMing TW MBE', 'Aakar', 'Abadi MT Condensed Extra Bold', 'Abadi MT Condensed Light', 'Abyssinica SIL', 'AcmeFont', 'Adobe Arabic', 'Agency FB', 'Aharoni', 'Aharoni Bold', 'Al Bayan', 'Al Bayan Bold', 'Al Bayan Plain', 'Al Nile', 'Al Tarikh', 'Aldhabi', 'Alfredo', 'Algerian', 'Alien Encounters', 'Almonte Snow', 'American Typewriter', 'American Typewriter Bold', 'American Typewriter Condensed', 'American Typewriter Light', 'Amethyst', 'Andale Mono', 'Andale Mono Version', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Ani', 'AnjaliOldLipi', 'Aparajita', 'Apple Braille', 'Apple Braille Outline 6 Dot', 'Apple Braille Outline 8 Dot', 'Apple Braille Pinpoint 6 Dot', 'Apple Braille Pinpoint 8 Dot', 'Apple Chancery', 'Apple Color Emoji', 'Apple LiGothic Medium', 'Apple LiSung Light', 'Apple SD Gothic Neo', 'Apple SD Gothic Neo Regular', 'Apple SD GothicNeo ExtraBold', 'Apple Symbols', 'AppleGothic', 'AppleGothic Regular', 'AppleMyungjo', 'AppleMyungjo Regular', 'AquaKana', 'Arabic Transparent', 'Arabic Typesetting', 'Arial', 'Arial Baltic', 'Arial Black', 'Arial Bold', 'Arial Bold Italic', 'Arial CE', 'Arial CYR', 'Arial Greek', 'Arial Hebrew', 'Arial Hebrew Bold', 'Arial Italic', 'Arial Narrow', 'Arial Narrow Bold', 'Arial Narrow Bold Italic', 'Arial Narrow Italic', 'Arial Rounded Bold', 'Arial Rounded MT Bold', 'Arial TUR', 'Arial Unicode MS', 'ArialHB', 'Arimo', 'Asimov', 'Autumn', 'Avenir', 'Avenir Black', 'Avenir Book', 'Avenir Next', 'Avenir Next Bold', 'Avenir Next Condensed', 'Avenir Next Condensed Bold', 'Avenir Next Demi Bold', 'Avenir Next Heavy', 'Avenir Next Regular', 'Avenir Roman', 'Ayuthaya', 'BN Jinx', 'BN Machine', 'BOUTON International Symbols', 'Baby Kruffy', 'Baghdad', 'Bahnschrift', 'Balthazar', 'Bangla MN', 'Bangla MN Bold', 'Bangla Sangam MN', 'Bangla Sangam MN Bold', 'Baskerville', 'Baskerville Bold', 'Baskerville Bold Italic', 'Baskerville Old Face', 'Baskerville SemiBold', 'Baskerville SemiBold Italic', 'Bastion', 'Batang', 'BatangChe', 'Bauhaus 93', 'Beirut', 'Bell MT', 'Bell MT Bold', 'Bell MT Italic', 'Bellerose', 'Berlin Sans FB', 'Berlin Sans FB Demi', 'Bernard MT Condensed', 'BiauKai', 'Big Caslon', 'Big Caslon Medium', 'Birch Std', 'Bitstream Charter', 'Bitstream Vera Sans', 'Blackadder ITC', 'Blackoak Std', 'Bobcat', 'Bodoni 72', 'Bodoni MT', 'Bodoni MT Black', 'Bodoni MT Poster Compressed', 'Bodoni Ornaments', 'BolsterBold', 'Book Antiqua', 'Book Antiqua Bold', 'Bookman Old Style', 'Bookman Old Style Bold', 'Bookshelf Symbol 7', 'Borealis', 'Bradley Hand', 'Bradley Hand ITC', 'Braggadocio', 'Brandish', 'Britannic Bold', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Brush Script', 'Brush Script MT', 'Brush Script MT Italic', 'Brush Script Std', 'Brussels', 'Calibri', 'Calibri Bold', 'Calibri Light', 'Californian FB', 'Calisto MT', 'Calisto MT Bold', 'Calligraphic', 'Calvin', 'Cambria', 'Cambria Bold', 'Cambria Math', 'Candara', 'Candara Bold', 'Candles', 'Carrois Gothic SC', 'Castellar', 'Centaur', 'Century', 'Century Gothic', 'Century Gothic Bold', 'Century Schoolbook', 'Century Schoolbook Bold', 'Century Schoolbook L', 'Chalkboard', 'Chalkboard Bold', 'Chalkboard SE', 'Chalkboard SE Bold', 'ChalkboardBold', 'Chalkduster', 'Chandas', 'Chaparral Pro', 'Chaparral Pro Light', 'Charlemagne Std', 'Charter', 'Chilanka', 'Chiller', 'Chinyen', 'Clarendon', 'Cochin', 'Cochin Bold', 'Colbert', 'Colonna MT', 'Comic Sans MS', 'Comic Sans MS Bold', 'Commons', 'Consolas', 'Consolas Bold', 'Constantia', 'Constantia Bold', 'Coolsville', 'Cooper Black', 'Cooper Std Black', 'Copperplate', 'Copperplate Bold', 'Copperplate Gothic Bold', 'Copperplate Light', 'Corbel', 'Corbel Bold', 'Cordia New', 'CordiaUPC', 'Corporate', 'Corsiva', 'Corsiva Hebrew', 'Corsiva Hebrew Bold', 'Courier', 'Courier 10 Pitch', 'Courier Bold', 'Courier New', 'Courier New Baltic', 'Courier New Bold', 'Courier New CE', 'Courier New Italic', 'Courier Oblique', 'Cracked Johnnie', 'Creepygirl', 'Curlz MT', 'Cursor', 'Cutive Mono', 'DFKai-SB', 'DIN Alternate', 'DIN Condensed', 'Damascus', 'Damascus Bold', 'Dancing Script', 'DaunPenh', 'David', 'Dayton', 'DecoType Naskh', 'Deja Vu', 'DejaVu LGC Sans', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Deneane', 'Desdemona', 'Detente', 'Devanagari MT', 'Devanagari MT Bold', 'Devanagari Sangam MN', 'Didot', 'Didot Bold', 'Digifit', 'DilleniaUPC', 'Dingbats', 'Distant Galaxy', 'Diwan Kufi', 'Diwan Kufi Regular', 'Diwan Thuluth', 'Diwan Thuluth Regular', 'DokChampa', 'Dominican', 'Dotum', 'DotumChe', 'Droid Sans', 'Droid Sans Fallback', 'Droid Sans Mono', 'Dyuthi', 'Ebrima', 'Edwardian Script ITC', 'Elephant', 'Emmett', 'Engravers MT', 'Engravers MT Bold', 'Enliven', 'Eras Bold ITC', 'Estrangelo Edessa', 'Ethnocentric', 'EucrosiaUPC', 'Euphemia', 'Euphemia UCAS', 'Euphemia UCAS Bold', 'Eurostile', 'Eurostile Bold', 'Expressway Rg', 'FangSong', 'Farah', 'Farisi', 'Felix Titling', 'Fingerpop', 'Fixedsys', 'Flubber', 'Footlight MT Light', 'Forte', 'FrankRuehl', 'Frankfurter Venetian TT', 'Franklin Gothic Book', 'Franklin Gothic Book Italic', 'Franklin Gothic Medium', 'Franklin Gothic Medium Cond', 'Franklin Gothic Medium Italic', 'FreeMono', 'FreeSans', 'FreeSerif', 'FreesiaUPC', 'Freestyle Script', 'French Script MT', 'Futura', 'Futura Condensed ExtraBold', 'Futura Medium', 'GB18030 Bitmap', 'Gabriola', 'Gadugi', 'Garamond', 'Garamond Bold', 'Gargi', 'Garuda', 'Gautami', 'Gazzarelli', 'Geeza Pro', 'Geeza Pro Bold', 'Geneva', 'GenevaCY', 'Gentium', 'Gentium Basic', 'Gentium Book Basic', 'GentiumAlt', 'Georgia', 'Georgia Bold', 'Geotype TT', 'Giddyup Std', 'Gigi', 'Gill', 'Gill Sans', 'Gill Sans Bold', 'Gill Sans MT', 'Gill Sans MT Bold', 'Gill Sans MT Condensed', 'Gill Sans MT Ext Condensed Bold', 'Gill Sans MT Italic', 'Gill Sans Ultra Bold', 'Gill Sans Ultra Bold Condensed', 'Gisha', 'Glockenspiel', 'Gloucester MT Extra Condensed', 'Good Times', 'Goudy', 'Goudy Old Style', 'Goudy Old Style Bold', 'Goudy Stout', 'Greek Diner Inline TT', 'Gubbi', 'Gujarati MT', 'Gujarati MT Bold', 'Gujarati Sangam MN', 'Gujarati Sangam MN Bold', 'Gulim', 'GulimChe', 'GungSeo Regular', 'Gungseouche', 'Gungsuh', 'GungsuhChe', 'Gurmukhi', 'Gurmukhi MN', 'Gurmukhi MN Bold', 'Gurmukhi MT', 'Gurmukhi Sangam MN', 'Gurmukhi Sangam MN Bold', 'Haettenschweiler', 'Hand Me Down S (BRK)', 'Hansen', 'Harlow Solid Italic', 'Harrington', 'Harvest', 'HarvestItal', 'Haxton Logos TT', 'HeadLineA Regular', 'HeadlineA', 'Heavy Heap', 'Hei', 'Hei Regular', 'Heiti SC', 'Heiti SC Light', 'Heiti SC Medium', 'Heiti TC', 'Heiti TC Light', 'Heiti TC Medium', 'Helvetica', 'Helvetica Bold', 'Helvetica CY Bold', 'Helvetica CY Plain', 'Helvetica LT Std', 'Helvetica Light', 'Helvetica Neue', 'Helvetica Neue Bold', 'Helvetica Neue Medium', 'Helvetica Oblique', 'HelveticaCY', 'HelveticaNeueLT Com 107 XBlkCn', 'Herculanum', 'High Tower Text', 'Highboot', 'Hiragino Kaku Gothic Pro W3', 'Hiragino Kaku Gothic Pro W6', 'Hiragino Kaku Gothic ProN W3', 'Hiragino Kaku Gothic ProN W6', 'Hiragino Kaku Gothic Std W8', 'Hiragino Kaku Gothic StdN W8', 'Hiragino Maru Gothic Pro W4', 'Hiragino Maru Gothic ProN W4', 'Hiragino Mincho Pro W3', 'Hiragino Mincho Pro W6', 'Hiragino Mincho ProN W3', 'Hiragino Mincho ProN W6', 'Hiragino Sans GB W3', 'Hiragino Sans GB W6', 'Hiragino Sans W0', 'Hiragino Sans W1', 'Hiragino Sans W2', 'Hiragino Sans W3', 'Hiragino Sans W4', 'Hiragino Sans W5', 'Hiragino Sans W6', 'Hiragino Sans W7', 'Hiragino Sans W8', 'Hiragino Sans W9', 'Hobo Std', 'Hoefler Text', 'Hoefler Text Black', 'Hoefler Text Ornaments', 'Hollywood Hills', 'Hombre', 'Huxley Titling', 'ITC Stone Serif', 'ITF Devanagari', 'ITF Devanagari Marathi', 'ITF Devanagari Medium', 'Impact', 'Imprint MT Shadow', 'InaiMathi', 'Induction', 'Informal Roman', 'Ink Free', 'IrisUPC', 'Iskoola Pota', 'Italianate', 'Jamrul', 'JasmineUPC', 'Javanese Text', 'Jokerman', 'Juice ITC', 'KacstArt', 'KacstBook', 'KacstDecorative', 'KacstDigital', 'KacstFarsi', 'KacstLetter', 'KacstNaskh', 'KacstOffice', 'KacstOne', 'KacstPen', 'KacstPoster', 'KacstQurn', 'KacstScreen', 'KacstTitle', 'KacstTitleL', 'Kai', 'Kai Regular', 'KaiTi', 'Kailasa', 'Kailasa Regular', 'Kaiti SC', 'Kaiti SC Black', 'Kalapi', 'Kalimati', 'Kalinga', 'Kannada MN', 'Kannada MN Bold', 'Kannada Sangam MN', 'Kannada Sangam MN Bold', 'Kartika', 'Karumbi', 'Kedage', 'Kefa', 'Kefa Bold', 'Keraleeyam', 'Keyboard', 'Khmer MN', 'Khmer MN Bold', 'Khmer OS', 'Khmer OS System', 'Khmer Sangam MN', 'Khmer UI', 'Kinnari', 'Kino MT', 'KodchiangUPC', 'Kohinoor Bangla', 'Kohinoor Devanagari', 'Kohinoor Telugu', 'Kokila', 'Kokonor', 'Kokonor Regular', 'Kozuka Gothic Pr6N B', 'Kristen ITC', 'Krungthep', 'KufiStandardGK', 'KufiStandardGK Regular', 'Kunstler Script', 'Laksaman', 'Lao MN', 'Lao Sangam MN', 'Lao UI', 'LastResort', 'Latha', 'Leelawadee', 'Letter Gothic Std', 'LetterOMatic!', 'Levenim MT', 'LiHei Pro', 'LiSong Pro', 'Liberation Mono', 'Liberation Sans', 'Liberation Sans Narrow', 'Liberation Serif', 'Likhan', 'LilyUPC', 'Limousine', 'Lithos Pro Regular', 'LittleLordFontleroy', 'Lohit Assamese', 'Lohit Bengali', 'Lohit Devanagari', 'Lohit Gujarati', 'Lohit Gurmukhi', 'Lohit Hindi', 'Lohit Kannada', 'Lohit Malayalam', 'Lohit Odia', 'Lohit Punjabi', 'Lohit Tamil', 'Lohit Tamil Classical', 'Lohit Telugu', 'Loma', 'Lucida Blackletter', 'Lucida Bright', 'Lucida Bright Demibold', 'Lucida Bright Demibold Italic', 'Lucida Bright Italic', 'Lucida Calligraphy', 'Lucida Calligraphy Italic', 'Lucida Console', 'Lucida Fax', 'Lucida Fax Demibold', 'Lucida Fax Regular', 'Lucida Grande', 'Lucida Grande Bold', 'Lucida Handwriting', 'Lucida Handwriting Italic', 'Lucida Sans', 'Lucida Sans Demibold Italic', 'Lucida Sans Typewriter', 'Lucida Sans Typewriter Bold', 'Lucida Sans Unicode', 'Luminari', 'Luxi Mono', 'MS Gothic', 'MS Mincho', 'MS Outlook', 'MS PGothic', 'MS PMincho', 'MS Reference Sans Serif', 'MS Reference Specialty', 'MS Sans Serif', 'MS Serif', 'MS UI Gothic', 'MT Extra', 'MV Boli', 'Mael', 'Magneto', 'Maiandra GD', 'Malayalam MN', 'Malayalam MN Bold', 'Malayalam Sangam MN', 'Malayalam Sangam MN Bold', 'Malgun Gothic', 'Mallige', 'Mangal', 'Manorly', 'Marion', 'Marion Bold', 'Marker Felt', 'Marker Felt Thin', 'Marlett', 'Martina', 'Matura MT Script Capitals', 'Meera', 'Meiryo', 'Meiryo Bold', 'Meiryo UI', 'MelodBold', 'Menlo', 'Menlo Bold', 'Mesquite Std', 'Microsoft', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft JhengHei UI', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Tai Le Bold', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft YaHei UI', 'Microsoft Yi Baiti', 'Minerva', 'MingLiU', 'MingLiU-ExtB', 'MingLiU_HKSCS', 'Minion Pro', 'Miriam', 'Mishafi', 'Mishafi Gold', 'Mistral', 'Modern', 'Modern No. 20', 'Monaco', 'Mongolian Baiti', 'Monospace', 'Monotype Corsiva', 'Monotype Sorts', 'MoolBoran', 'Moonbeam', 'MotoyaLMaru', 'Mshtakan', 'Mshtakan Bold', 'Mukti Narrow', 'Muna', 'Myanmar MN', 'Myanmar MN Bold', 'Myanmar Sangam MN', 'Myanmar Text', 'Mycalc', 'Myriad Arabic', 'Myriad Hebrew', 'Myriad Pro', 'NISC18030', 'NSimSun', 'Nadeem', 'Nadeem Regular', 'Nakula', 'Nanum Barun Gothic', 'Nanum Gothic', 'Nanum Myeongjo', 'NanumBarunGothic', 'NanumGothic', 'NanumGothic Bold', 'NanumGothicCoding', 'NanumMyeongjo', 'NanumMyeongjo Bold', 'Narkisim', 'Nasalization', 'Navilu', 'Neon Lights', 'New Peninim MT', 'New Peninim MT Bold', 'News Gothic MT', 'News Gothic MT Bold', 'Niagara Engraved', 'Niagara Solid', 'Nimbus Mono L', 'Nimbus Roman No9 L', 'Nimbus Sans L', 'Nimbus Sans L Condensed', 'Nina', 'Nirmala UI', 'Nirmala.ttf', 'Norasi', 'Noteworthy', 'Noteworthy Bold', 'Noto Color Emoji', 'Noto Emoji', 'Noto Mono', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', 'Noto Sans', 'Noto Sans Armenian', 'Noto Sans Bengali', 'Noto Sans CJK', 'Noto Sans Canadian Aboriginal', 'Noto Sans Cherokee', 'Noto Sans Devanagari', 'Noto Sans Ethiopic', 'Noto Sans Georgian', 'Noto Sans Gujarati', 'Noto Sans Gurmukhi', 'Noto Sans Hebrew', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans Kannada', 'Noto Sans Khmer', 'Noto Sans Lao', 'Noto Sans Malayalam', 'Noto Sans Myanmar', 'Noto Sans Oriya', 'Noto Sans SC', 'Noto Sans Sinhala', 'Noto Sans Symbols', 'Noto Sans TC', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Thai', 'Noto Sans Yi', 'Noto Serif', 'Notram', 'November', 'Nueva Std', 'Nueva Std Cond', 'Nyala', 'OCR A Extended', 'OCR A Std', 'Old English Text MT', 'OldeEnglish', 'Onyx', 'OpenSymbol', 'OpineHeavy', 'Optima', 'Optima Bold', 'Optima Regular', 'Orator Std', 'Oriya MN', 'Oriya MN Bold', 'Oriya Sangam MN', 'Oriya Sangam MN Bold', 'Osaka', 'Osaka-Mono', 'OsakaMono', 'PCMyungjo Regular', 'PCmyoungjo', 'PMingLiU', 'PMingLiU-ExtB', 'PR Celtic Narrow', 'PT Mono', 'PT Sans', 'PT Sans Bold', 'PT Sans Caption Bold', 'PT Sans Narrow Bold', 'PT Serif', 'Padauk', 'Padauk Book', 'Padmaa', 'Pagul', 'Palace Script MT', 'Palatino', 'Palatino Bold', 'Palatino Linotype', 'Palatino Linotype Bold', 'Papyrus', 'Papyrus Condensed', 'Parchment', 'Parry Hotter', 'PenultimateLight', 'Perpetua', 'Perpetua Bold', 'Perpetua Titling MT', 'Perpetua Titling MT Bold', 'Phetsarath OT', 'Phosphate', 'Phosphate Inline', 'Phosphate Solid', 'PhrasticMedium', 'PilGi Regular', 'Pilgiche', 'PingFang HK', 'PingFang SC', 'PingFang TC', 'Pirate', 'Plantagenet Cherokee', 'Playbill', 'Poor Richard', 'Poplar Std', 'Pothana2000', 'Prestige Elite Std', 'Pristina', 'Purisa', 'QuiverItal', 'Raanana', 'Raanana Bold', 'Raavi', 'Rachana', 'Rage Italic', 'RaghuMalayalam', 'Ravie', 'Rekha', 'Roboto', 'Rockwell', 'Rockwell Bold', 'Rockwell Condensed', 'Rockwell Extra Bold', 'Rockwell Italic', 'Rod', 'Roland', 'Rondalo', 'Rosewood Std Regular', 'RowdyHeavy', 'Russel Write TT', 'SF Movie Poster', 'STFangsong', 'STHeiti', 'STIXGeneral', 'STIXGeneral-Bold', 'STIXGeneral-Regular', 'STIXIntegralsD', 'STIXIntegralsD-Bold', 'STIXIntegralsSm', 'STIXIntegralsSm-Bold', 'STIXIntegralsUp', 'STIXIntegralsUp-Bold', 'STIXIntegralsUp-Regular', 'STIXIntegralsUpD', 'STIXIntegralsUpD-Bold', 'STIXIntegralsUpD-Regular', 'STIXIntegralsUpSm', 'STIXIntegralsUpSm-Bold', 'STIXNonUnicode', 'STIXNonUnicode-Bold', 'STIXSizeFiveSym', 'STIXSizeFiveSym-Regular', 'STIXSizeFourSym', 'STIXSizeFourSym-Bold', 'STIXSizeOneSym', 'STIXSizeOneSym-Bold', 'STIXSizeThreeSym', 'STIXSizeThreeSym-Bold', 'STIXSizeTwoSym', 'STIXSizeTwoSym-Bold', 'STIXVariants', 'STIXVariants-Bold', 'STKaiti', 'STSong', 'STXihei', 'SWGamekeys MT', 'Saab', 'Sahadeva', 'Sakkal Majalla', 'Salina', 'Samanata', 'Samyak Devanagari', 'Samyak Gujarati', 'Samyak Malayalam', 'Samyak Tamil', 'Sana', 'Sana Regular', 'Sans', 'Sarai', 'Sathu', 'Savoye LET Plain:1.0', 'Sawasdee', 'Script', 'Script MT Bold', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Pseudo', 'Segoe Script', 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Semilight', 'Segoe UI Symbol', 'Serif', 'Shonar Bangla', 'Showcard Gothic', 'Shree Devanagari 714', 'Shruti', 'SignPainter-HouseScript', 'Silom', 'SimHei', 'SimSun', 'SimSun-ExtB', 'Simplified Arabic', 'Simplified Arabic Fixed', 'Sinhala MN', 'Sinhala MN Bold', 'Sinhala Sangam MN', 'Sinhala Sangam MN Bold', 'Sitka', 'Skia', 'Skia Regular', 'Skinny', 'Small Fonts', 'Snap ITC', 'Snell Roundhand', 'Snowdrift', 'Songti SC', 'Songti SC Black', 'Songti TC', 'Source Code Pro', 'Splash', 'Standard Symbols L', 'Stencil', 'Stencil Std', 'Stephen', 'Sukhumvit Set', 'Suruma', 'Sylfaen', 'Symbol', 'Symbole', 'System', 'System Font', 'TAMu_Kadambri', 'TAMu_Kalyani', 'TAMu_Maduram', 'TSCu_Comic', 'TSCu_Paranar', 'TSCu_Times', 'Tahoma', 'Tahoma Negreta', 'TakaoExGothic', 'TakaoExMincho', 'TakaoGothic', 'TakaoMincho', 'TakaoPGothic', 'TakaoPMincho', 'Tamil MN', 'Tamil MN Bold', 'Tamil Sangam MN', 'Tamil Sangam MN Bold', 'Tarzan', 'Tekton Pro', 'Tekton Pro Cond', 'Tekton Pro Ext', 'Telugu MN', 'Telugu MN Bold', 'Telugu Sangam MN', 'Telugu Sangam MN Bold', 'Tempus Sans ITC', 'Terminal', 'Terminator Two', 'Thonburi', 'Thonburi Bold', 'Tibetan Machine Uni', 'Times', 'Times Bold', 'Times New Roman', 'Times New Roman Baltic', 'Times New Roman Bold', 'Times New Roman Italic', 'Times Roman', 'Tlwg Mono', 'Tlwg Typewriter', 'Tlwg Typist', 'Tlwg Typo', 'TlwgMono', 'TlwgTypewriter', 'Toledo', 'Traditional Arabic', 'Trajan Pro', 'Trattatello', 'Trebuchet MS', 'Trebuchet MS Bold', 'Tunga', 'Tw Cen MT', 'Tw Cen MT Bold', 'Tw Cen MT Italic', 'URW Bookman L', 'URW Chancery L', 'URW Gothic L', 'URW Palladio L', 'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Mono', 'Ukai', 'Ume Gothic', 'Ume Mincho', 'Ume P Gothic', 'Ume P Mincho', 'Ume UI Gothic', 'Uming', 'Umpush', 'UnBatang', 'UnDinaru', 'UnDotum', 'UnGraphic', 'UnGungseo', 'UnPilgi', 'Untitled1', 'Urdu Typesetting', 'Uroob', 'Utkal', 'Utopia', 'Utsaah', 'Valken', 'Vani', 'Vemana2000', 'Verdana', 'Verdana Bold', 'Vijaya', 'Viner Hand ITC', 'Vivaldi', 'Vivian', 'Vladimir Script', 'Vrinda', 'Waree', 'Waseem', 'Waverly', 'Webdings', 'WenQuanYi Bitmap Song', 'WenQuanYi Micro Hei', 'WenQuanYi Micro Hei Mono', 'WenQuanYi Zen Hei', 'Whimsy TT', 'Wide Latin', 'Wingdings', 'Wingdings 2', 'Wingdings 3', 'Woodcut', 'X-Files', 'Year supply of fairy cakes', 'Yu Gothic', 'Yu Mincho', 'Yuppy SC', 'Yuppy SC Regular', 'Yuppy TC', 'Yuppy TC Regular', 'Zapf Dingbats', 'Zapfino', 'Zawgyi-One', 'gargi', 'lklug', 'mry_KacstQurn', 'ori1Uni']; //  		var fonts = ["Times", "Times New Roman", "tata", "toto"];
        const d = new Detector();
        var detected = '';
        fonts.forEach((font) => {
            if (d.detect(font)) detected += font + ',';
        });
       // console.log(performance.now() - t0);
        return detected;
      }

      function blending() {
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
      }

      function checkOS(res) {
        if (res.os == null || res.os == undefined) return '-';
        const Desktop = ['AIX', 'Amiga OS', 'Arch', 'BeOS', 'CentOS', 'Chromium OS', 'Contiki', 'Fedora', 'FreeBSD', 'Debian', 'Deepin', 'DragonFly', 'elementary OS',
    'Gentoo', 'GhostBSD', 'GNU', 'Haiku', 'HP-UX', 'Hurd', 'Joli', 'Linpus', 'Linux', 'Linspire', 'Mageia', 'Mandriva', 'Manjaro', 'MeeGo', 'Minix', 'Mint', 'Morph OS', 
    'NetBSD', 'OpenBSD', 'OpenVMS', 'OS/2', 'PC-BSD', 'PCLinuxOS', 'Plan9', 'RedHat', 'RISC OS', 'Sabayon', 'SerenityOS', 'Slackware', 'Solaris', 'SUSE', 'Ubuntu',
    'VectorLinux', 'Zenwalk'];
        const mobile = ['Android', 'Android-x86', 'Bada', 'BlackBerry', 'Firefox OS', 'Fuchsia', 'HarmonyOS', 'iOS', 'KaiOS', 'Maemo', 'QNX', 'RIM Tablet OS',
    'Sailfish', 'Series40', 'Symbian', 'Tizen', 'WebOS', 'Windows Phone', 'Windows Mobile'];
        if (Desktop.includes(res.os.name)) {
            return 0;
        } else if (mobile.includes(res.os.name)) {
            return 6;
        } else {
            return 7;
        }
      }

      function cryptoSupport() {
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
      }

      function webGL() {
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
          return XXH.h64(m, 0xA3FC ).toString(16);
      }

async function webGLParameters() {
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
    return(XXH.h64(JSON.stringify([webGLData, webGL2Data, experimentalWebGLData]), 0xA3FC ).toString(16));
    /*
    webGLParma.push(XXH.h64(JSON.stringify(webGLData), 0xA3FC ).toString(16));
    webGLParma.push(XXH.h64(JSON.stringify(webGL2Data), 0xA3FC ).toString(16));
    webGLParma.push(XXH.h64(JSON.stringify(experimentalWebGLData), 0xA3FC ).toString(16));
    */
}).catch(error => {
    console.error(error)
})
return value;
      }
  
     async function id(params) {
        const xhr = new XMLHttpRequest();
        var recivedTime = 0;
        var sentTime = null;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  recivedTime = performance.now();
              }
            }
          };
          
          xhr.open('POST', 'https://test.deviceid.io/index.json');
      
          xhr.setRequestHeader("Content-Type", "text/plain");
          sentTime = performance.now()
          xhr.send(JSON.stringify({id: stored_id}));
        return new Promise(async (resolve, reject) => {
        const platform = window.navigator.platform;
        var doNotTrack = "";
if (window.navigator.doNotTrack != null && window.navigator.doNotTrack != "unspecified"){
    if(window.navigator.doNotTrack == "1" || window.navigator.doNotTrack == "yes"){
        doNotTrack = "yes";
    } else {
        doNotTrack = "no";
    }
} else {
	doNotTrack = "NC";
}
const timezone = new Date().getTimezoneOffset();
const resolution = window.screen.width+"x"+window.screen.height;
    var cnv = createCanvas();
    const cnv1 = createCanvas();
    if (cnv1 != cnv) cnv = undefined;
    const uapRes = uap.getResult();
    const prv = await detectIncognito();
    var device = 0;
    const arch = uapRes.cpu.architecture;
    if (uapRes.os != undefined && uapRes.os != null && uapRes.os.name == 'macOS' || uapRes.device.model == 'Macintosh') {
        device = 1; 
    } else if (uapRes.device != null && uapRes.device != undefined && uapRes.device.vendor == 'Apple') {
        if (uapRes.os.name == 'iOS') {
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
        if (uapRes.device.type == undefined) {
            if (uapRes.os.name == undefined) {
                device = 7;                
            } else {
                device = checkOS(uapRes);
            }
        } else {
            if (uapRes.device == null || uapRes.device == undefined) {
                device = 0;
            } else {
            const type = uapRes.device.type;
            if (type == 'mobile') {
                device = 6
            } else if (type == 'tablet') {
                device = 5;
            } else if (type == 'werable') {
                device = 2;
            } else if (uapRes.os != null && uapRes.os != undefined) {
                if (uapRes.os.name == undefined) {
                    device = 7;
                } else {
                    device = checkOS(uapRes);
                }
            }
        }
        }
    } 
    const obj = {
        a: XXH.h64(await getFonts(), 0xA3FC ).toString(16), // fonts - 2, 5
        c: getMimeTypes(),
        b: cryptoSupport(), // crypto - 3, 1
        d: blending(), // blending - 1, 2
        g: await getAudio(), // audio - 3, 7
        i: getOscpu(), // osCPU - 1, 1
        j: getLanguages(), // languages - 2, 4
        k: colorDepth(), // 1, 3
        l: navigator.deviceMemory, // 1, 2
        m: resolution, // 1, 3
        n: getHardwareConcurrency(), // 1, 3
        o: timezone, // 1, 2
        t: getNavigatorCpuClass(), // 1, 2
        v: XXH.h64(getPluginsUsingMimeTypes(), 0xA3FC ).toString(16), // 2, 5
        w: XXH.h64(cnv, 0xA3FC ).toString(16), // 2, 8
        x: getTouchSupport(), // 2, 1
        y: getVendor(), // 1, 2
        z: getVendorSub(), // ~ flavors - 1, 2
        bb: colorGamut(), // 2, 1
        cc: invertedColors(), // 1, 1
        dd: forcedColors(), // 1, 1
        ee: monochrome(), // 1, 1
        ff: contrast(), // 2, 1
        gg: reducedMotion(), // 3, 1
        hh: HDR(), // 2, 1
        ii: XXH.h64(getMathsConstants(), 0xA3FC ).toString(16), // 3, 3
        jj: await webGLParameters(), // 3, 7
        ll: getArch(), // 3, 1
        a0: isTouchDevice(), // 1, 1
        b0: reducedTransparency(), // 2, 1
        b2: webGL(), // 3, 9
    }

    const mini_print = {
        a: obj.a,
        d: obj.g,
        e: obj.w,
        f: obj.ii,
        g: obj.jj,
        h: obj.b2
    }

    obj['b1'] = XXH.h64( JSON.stringify(mini_print), 0xCAFEBABE ).toString(16);
    obj['zz'] = XXH.h64( JSON.stringify(obj), 0xCAFEBABE ).toString(16);
    obj['a2'] = getAppCodeName();
    obj['a3'] = getAppName();
    obj['a4'] = getAppVersion();
    obj['a5'] = getProduct(); // 1, 1
    obj['a6'] = getProductSub(); // 1, 2
    obj['a7'] = XXH.h64(getNavigatorPrototype(), 0xA3FC ).toString(16); // 1, 4
    obj['a9'] = getBuildId();
    obj['b1'] = doNotTrack;
    obj['kk'] = navigator.pdfViewerEnabled;
    obj['aa'] = navigator.cookieEnabled;
    obj['p'] = sessionStorage();
    obj['q'] = getLocalStorage();
    obj['r'] = indexedDB();
    obj['s'] = Boolean(window.openDatabase);
    obj['ua'] = navigator.userAgent;
        const end = performance.now();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                  const timing = performance.now() - end;
                  const decipher = crypto.createDecipher('aes-256-cbc', key, iv);
                  const decoded = decipher.update(xhr.responseText, 'hex', 'utf8') +
                  decipher.final('utf8');
                  const parsed = JSON.parse(decoded);
                  if (parsed['code'] != null) {
                      localStorage.setItem('c:GkK?_5eVdQdiQT0Fb?', parsed['code']);
                      setCookie('-BAL4_z*-wQ=6TYqCA!U', parsed['code'], {secure: true, 'expires': 3600});
                  }
                  delete parsed['code'];
                  parsed['private'] = prv;
                  parsed['platform'] = uapRes;
                  parsed['adblock'] = obj.c;
                  parsed['dev'] = device;
                  resolve(parsed);
                  const xhr1 = new XMLHttpRequest();
                  xhr1.open('POST', url + '/updateTime');
                  xhr1.setRequestHeader("Content-Type", "text/plain");
                  xhr1.send(JSON.stringify({timing, visit_id: parsed['visit_id']}));
                  } else {
                      reject(xhr.responseText);
                    }
                }
            }
            xhr.open('POST', url + '/id');
            xhr.setRequestHeader('Authorization', 'Bearer ' + loaded);
            xhr.setRequestHeader("Content-Type", "text/plain");

            var res = {tls: stored_id, dev: device, url: window.location.href, platform, private: prv, print: obj, old, cookie: cookieStored, start: sentTime, end, local: obj.q};
            if (params != undefined) {
                if (params.request_id != undefined) {res['id'] = params.request_id}
                if (params.data != undefined) {res['tag'] = params.data}
            }
            xhr.send(JSON.stringify(res));
    });
}

 function load(data) {
     //localStorage.removeItem('c:GkK?_5eVdQdiQT0Fb?');
    // setCookie('-BAL4_z*-wQ=6TYqCA!U', '', {secure: true, 'expires': 3600});
     stored_id = localStorage.getItem('deviceID_identifier');
     if (stored_id == null || stored_id == undefined) {
         stored_id = makeid(20);
         localStorage.setItem('deviceID_identifier', stored_id);
     }
     sha512('c7VEVapazCwNVcWgi1Ej').then((val) => {
        iv = val.substring(0, 16);
     });
     return new Promise(async (resolve, reject) => {
        if (typeof data === 'object') {
         if (!("apiKey" in data)) {
             reject('please provide an apiKey');
             return;
         } else if (!("secret" in data)) {
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
                   loaded = xhr.responseText;
                   sha512(data.secret).then(val => {
                    const key = val.substring(0, 32);
                    if (typeof(Storage) !== "undefined") {
                        old = localStorage.getItem('c:GkK?_5eVdQdiQT0Fb?');
                        if (navigator.cookieEnabled) {
                            cookieStored = getCookie('-BAL4_z*-wQ=6TYqCA!U');
                        }
                      } 
                      resolve(true);
                      return;
                   });
                 } else {
                     reject(xhr.responseText);
                     return;
                 }
             }
             }
         xhr.open('POST', url + '/load');
         xhr.setRequestHeader("Content-Type", "text/plain");
         xhr.send(JSON.stringify({key: encodeURIComponent(data.apiKey)}));
     });
 }

 function getCookie(cname) {
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
}

function setCookie(name, value, options = {}) {

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
}


