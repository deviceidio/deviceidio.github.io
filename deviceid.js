
!function(t,e){"object"==typeof exports?module.exports=exports=e():"function"==typeof define&&define.amd?define([],e):t.CryptoJS=e()}(this,function(){var W,O,I,U,K,X,L,l,j,T,t,N,q,e,Z,V,G,J,Q,Y,$,t1,e1,r1,i1,o1,n1,s,s1,c1,a1,h1,l1,o,f1,r,d1,u1,n,c,a,h,f,d,i=function(h){var i;if("undefined"!=typeof window&&window.crypto&&(i=window.crypto),"undefined"!=typeof self&&self.crypto&&(i=self.crypto),!(i=!(i=!(i="undefined"!=typeof globalThis&&globalThis.crypto?globalThis.crypto:i)&&"undefined"!=typeof window&&window.msCrypto?window.msCrypto:i)&&"undefined"!=typeof global&&global.crypto?global.crypto:i)&&"function"==typeof require)try{i=require("crypto")}catch(t){}var r=Object.create||function(t){return e.prototype=t,t=new e,e.prototype=null,t};function e(){}var t={},o=t.lib={},n=o.Base={extend:function(t){var e=r(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),(e.init.prototype=e).$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},l=o.WordArray=n.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes,o=t.sigBytes;if(this.clamp(),i%4)for(var n=0;n<o;n++){var s=r[n>>>2]>>>24-n%4*8&255;e[i+n>>>2]|=s<<24-(i+n)%4*8}else for(var c=0;c<o;c+=4)e[i+c>>>2]=r[c>>>2];return this.sigBytes+=o,this},clamp:function(){var t=this.words,e=this.sigBytes;t[e>>>2]&=4294967295<<32-e%4*8,t.length=h.ceil(e/4)},clone:function(){var t=n.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e=[],r=0;r<t;r+=4)e.push(function(){if(i){if("function"==typeof i.getRandomValues)try{return i.getRandomValues(new Uint32Array(1))[0]}catch(t){}if("function"==typeof i.randomBytes)try{return i.randomBytes(4).readInt32LE()}catch(t){}}throw new Error("Native crypto module could not be used to get secure random number.")}());return new l.init(e,t)}}),s=t.enc={},c=s.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],o=0;o<r;o++){var n=e[o>>>2]>>>24-o%4*8&255;i.push((n>>>4).toString(16)),i.push((15&n).toString(16))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new l.init(r,e/2)}},a=s.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],o=0;o<r;o++){var n=e[o>>>2]>>>24-o%4*8&255;i.push(String.fromCharCode(n))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new l.init(r,e)}},f=s.Utf8={stringify:function(t){try{return decodeURIComponent(escape(a.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return a.parse(unescape(encodeURIComponent(t)))}},d=o.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=new l.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(t){var e,r=this._data,i=r.words,o=r.sigBytes,n=this.blockSize,s=o/(4*n),c=(s=t?h.ceil(s):h.max((0|s)-this._minBufferSize,0))*n,t=h.min(4*c,o);if(c){for(var a=0;a<c;a+=n)this._doProcessBlock(i,a);e=i.splice(0,c),r.sigBytes-=t}return new l.init(e,t)},clone:function(){var t=n.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),u=(o.Hasher=d.extend({cfg:n.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){d.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(r){return function(t,e){return new r.init(e).finalize(t)}},_createHmacHelper:function(r){return function(t,e){return new u.HMAC.init(r,e).finalize(t)}}}),t.algo={});return t}(Math),u=(u=(p=i).lib,W=u.Base,O=u.WordArray,(u=p.x64={}).Word=W.extend({init:function(t,e){this.high=t,this.low=e}}),u.WordArray=W.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:8*t.length},toX32:function(){for(var t=this.words,e=t.length,r=[],i=0;i<e;i++){var o=t[i];r.push(o.high),r.push(o.low)}return O.create(r,this.sigBytes)},clone:function(){for(var t=W.clone.call(this),e=t.words=this.words.slice(0),r=e.length,i=0;i<r;i++)e[i]=e[i].clone();return t}}),"function"==typeof ArrayBuffer&&(p=i.lib.WordArray,I=p.init,(p.init=function(t){if((t=(t=t instanceof ArrayBuffer?new Uint8Array(t):t)instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):t)instanceof Uint8Array){for(var e=t.byteLength,r=[],i=0;i<e;i++)r[i>>>2]|=t[i]<<24-i%4*8;I.call(this,r,e)}else I.apply(this,arguments)}).prototype=p),i),p1=u.lib.WordArray;function _1(t){return t<<8&4278255360|t>>>8&16711935}(u=u.enc).Utf16=u.Utf16BE={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],o=0;o<r;o+=2){var n=e[o>>>2]>>>16-o%4*8&65535;i.push(String.fromCharCode(n))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>1]|=t.charCodeAt(i)<<16-i%2*16;return p1.create(r,2*e)}},u.Utf16LE={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],o=0;o<r;o+=2){var n=_1(e[o>>>2]>>>16-o%4*8&65535);i.push(String.fromCharCode(n))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>1]|=_1(t.charCodeAt(i)<<16-i%2*16);return p1.create(r,2*e)}},U=(p=i).lib.WordArray,p.enc.Base64={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=this._map,o=(t.clamp(),[]),n=0;n<r;n+=3)for(var s=(e[n>>>2]>>>24-n%4*8&255)<<16|(e[n+1>>>2]>>>24-(n+1)%4*8&255)<<8|e[n+2>>>2]>>>24-(n+2)%4*8&255,c=0;c<4&&n+.75*c<r;c++)o.push(i.charAt(s>>>6*(3-c)&63));var a=i.charAt(64);if(a)for(;o.length%4;)o.push(a);return o.join("")},parse:function(t){var e=t.length,r=this._map;if(!(i=this._reverseMap))for(var i=this._reverseMap=[],o=0;o<r.length;o++)i[r.charCodeAt(o)]=o;for(var n,s,c=r.charAt(64),a=(!c||-1!==(c=t.indexOf(c))&&(e=c),t),h=e,l=i,f=[],d=0,u=0;u<h;u++)u%4&&(s=l[a.charCodeAt(u-1)]<<u%4*2,n=l[a.charCodeAt(u)]>>>6-u%4*2,s=s|n,f[d>>>2]|=s<<24-d%4*8,d++);return U.create(f,d)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},K=(u=i).lib.WordArray,u.enc.Base64url={stringify:function(t,e){for(var r=t.words,i=t.sigBytes,o=(e=void 0===e?!0:e)?this._safe_map:this._map,n=(t.clamp(),[]),s=0;s<i;s+=3)for(var c=(r[s>>>2]>>>24-s%4*8&255)<<16|(r[s+1>>>2]>>>24-(s+1)%4*8&255)<<8|r[s+2>>>2]>>>24-(s+2)%4*8&255,a=0;a<4&&s+.75*a<i;a++)n.push(o.charAt(c>>>6*(3-a)&63));var h=o.charAt(64);if(h)for(;n.length%4;)n.push(h);return n.join("")},parse:function(t,e){var r=t.length,i=(e=void 0===e?!0:e)?this._safe_map:this._map;if(!(o=this._reverseMap))for(var o=this._reverseMap=[],n=0;n<i.length;n++)o[i.charCodeAt(n)]=n;for(var s,c,e=i.charAt(64),a=(!e||-1!==(e=t.indexOf(e))&&(r=e),t),h=r,l=o,f=[],d=0,u=0;u<h;u++)u%4&&(c=l[a.charCodeAt(u-1)]<<u%4*2,s=l[a.charCodeAt(u)]>>>6-u%4*2,c=c|s,f[d>>>2]|=c<<24-d%4*8,d++);return K.create(f,d)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",_safe_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"};for(var y1=Math,p=i,g1=(u=p.lib).WordArray,v1=u.Hasher,u=p.algo,A=[],B1=0;B1<64;B1++)A[B1]=4294967296*y1.abs(y1.sin(B1+1))|0;function z(t,e,r,i,o,n,s){t=t+(e&r|~e&i)+o+s;return(t<<n|t>>>32-n)+e}function H(t,e,r,i,o,n,s){t=t+(e&i|r&~i)+o+s;return(t<<n|t>>>32-n)+e}function C(t,e,r,i,o,n,s){t=t+(e^r^i)+o+s;return(t<<n|t>>>32-n)+e}function R(t,e,r,i,o,n,s){t=t+(r^(e|~i))+o+s;return(t<<n|t>>>32-n)+e}u=u.MD5=v1.extend({_doReset:function(){this._hash=new g1.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,o=t[i];t[i]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8)}var n=this._hash.words,s=t[e+0],c=t[e+1],a=t[e+2],h=t[e+3],l=t[e+4],f=t[e+5],d=t[e+6],u=t[e+7],p=t[e+8],_=t[e+9],y=t[e+10],g=t[e+11],v=t[e+12],B=t[e+13],w=t[e+14],k=t[e+15],x=z(n[0],S=n[1],m=n[2],b=n[3],s,7,A[0]),b=z(b,x,S,m,c,12,A[1]),m=z(m,b,x,S,a,17,A[2]),S=z(S,m,b,x,h,22,A[3]);x=z(x,S,m,b,l,7,A[4]),b=z(b,x,S,m,f,12,A[5]),m=z(m,b,x,S,d,17,A[6]),S=z(S,m,b,x,u,22,A[7]),x=z(x,S,m,b,p,7,A[8]),b=z(b,x,S,m,_,12,A[9]),m=z(m,b,x,S,y,17,A[10]),S=z(S,m,b,x,g,22,A[11]),x=z(x,S,m,b,v,7,A[12]),b=z(b,x,S,m,B,12,A[13]),m=z(m,b,x,S,w,17,A[14]),x=H(x,S=z(S,m,b,x,k,22,A[15]),m,b,c,5,A[16]),b=H(b,x,S,m,d,9,A[17]),m=H(m,b,x,S,g,14,A[18]),S=H(S,m,b,x,s,20,A[19]),x=H(x,S,m,b,f,5,A[20]),b=H(b,x,S,m,y,9,A[21]),m=H(m,b,x,S,k,14,A[22]),S=H(S,m,b,x,l,20,A[23]),x=H(x,S,m,b,_,5,A[24]),b=H(b,x,S,m,w,9,A[25]),m=H(m,b,x,S,h,14,A[26]),S=H(S,m,b,x,p,20,A[27]),x=H(x,S,m,b,B,5,A[28]),b=H(b,x,S,m,a,9,A[29]),m=H(m,b,x,S,u,14,A[30]),x=C(x,S=H(S,m,b,x,v,20,A[31]),m,b,f,4,A[32]),b=C(b,x,S,m,p,11,A[33]),m=C(m,b,x,S,g,16,A[34]),S=C(S,m,b,x,w,23,A[35]),x=C(x,S,m,b,c,4,A[36]),b=C(b,x,S,m,l,11,A[37]),m=C(m,b,x,S,u,16,A[38]),S=C(S,m,b,x,y,23,A[39]),x=C(x,S,m,b,B,4,A[40]),b=C(b,x,S,m,s,11,A[41]),m=C(m,b,x,S,h,16,A[42]),S=C(S,m,b,x,d,23,A[43]),x=C(x,S,m,b,_,4,A[44]),b=C(b,x,S,m,v,11,A[45]),m=C(m,b,x,S,k,16,A[46]),x=R(x,S=C(S,m,b,x,a,23,A[47]),m,b,s,6,A[48]),b=R(b,x,S,m,u,10,A[49]),m=R(m,b,x,S,w,15,A[50]),S=R(S,m,b,x,f,21,A[51]),x=R(x,S,m,b,v,6,A[52]),b=R(b,x,S,m,h,10,A[53]),m=R(m,b,x,S,y,15,A[54]),S=R(S,m,b,x,c,21,A[55]),x=R(x,S,m,b,p,6,A[56]),b=R(b,x,S,m,k,10,A[57]),m=R(m,b,x,S,d,15,A[58]),S=R(S,m,b,x,B,21,A[59]),x=R(x,S,m,b,l,6,A[60]),b=R(b,x,S,m,g,10,A[61]),m=R(m,b,x,S,a,15,A[62]),S=R(S,m,b,x,_,21,A[63]),n[0]=n[0]+x|0,n[1]=n[1]+S|0,n[2]=n[2]+m|0,n[3]=n[3]+b|0},_doFinalize:function(){for(var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes,o=(e[i>>>5]|=128<<24-i%32,y1.floor(r/4294967296)),o=(e[15+(64+i>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),e[14+(64+i>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(e.length+1),this._process(),this._hash),n=o.words,s=0;s<4;s++){var c=n[s];n[s]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}return o},clone:function(){var t=v1.clone.call(this);return t._hash=this._hash.clone(),t}}),p.MD5=v1._createHelper(u),p.HmacMD5=v1._createHmacHelper(u),u=(p=i).lib,X=u.WordArray,L=u.Hasher,u=p.algo,l=[],u=u.SHA1=L.extend({_doReset:function(){this._hash=new X.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],o=r[1],n=r[2],s=r[3],c=r[4],a=0;a<80;a++){a<16?l[a]=0|t[e+a]:(h=l[a-3]^l[a-8]^l[a-14]^l[a-16],l[a]=h<<1|h>>>31);var h=(i<<5|i>>>27)+c+l[a];h+=a<20?1518500249+(o&n|~o&s):a<40?1859775393+(o^n^s):a<60?(o&n|o&s|n&s)-1894007588:(o^n^s)-899497514,c=s,s=n,n=o<<30|o>>>2,o=i,i=h}r[0]=r[0]+i|0,r[1]=r[1]+o|0,r[2]=r[2]+n|0,r[3]=r[3]+s|0,r[4]=r[4]+c|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=Math.floor(r/4294967296),e[15+(64+i>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=L.clone.call(this);return t._hash=this._hash.clone(),t}}),p.SHA1=L._createHelper(u),p.HmacSHA1=L._createHmacHelper(u);var w1=Math,p=i,k1=(u=p.lib).WordArray,x1=u.Hasher,u=p.algo,b1=[],m1=[];function S1(t){return 4294967296*(t-(0|t))|0}for(var A1=2,z1=0;z1<64;)!function(t){for(var e=w1.sqrt(t),r=2;r<=e;r++)if(!(t%r))return;return 1}(A1)||(z1<8&&(b1[z1]=S1(w1.pow(A1,.5))),m1[z1]=S1(w1.pow(A1,1/3)),z1++),A1++;var _=[],u=u.SHA256=x1.extend({_doReset:function(){this._hash=new k1.init(b1.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],o=r[1],n=r[2],s=r[3],c=r[4],a=r[5],h=r[6],l=r[7],f=0;f<64;f++){f<16?_[f]=0|t[e+f]:(d=_[f-15],u=_[f-2],_[f]=((d<<25|d>>>7)^(d<<14|d>>>18)^d>>>3)+_[f-7]+((u<<15|u>>>17)^(u<<13|u>>>19)^u>>>10)+_[f-16]);var d=i&o^i&n^o&n,u=l+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&a^~c&h)+m1[f]+_[f],l=h,h=a,a=c,c=s+u|0,s=n,n=o,o=i,i=u+(((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+d)|0}r[0]=r[0]+i|0,r[1]=r[1]+o|0,r[2]=r[2]+n|0,r[3]=r[3]+s|0,r[4]=r[4]+c|0,r[5]=r[5]+a|0,r[6]=r[6]+h|0,r[7]=r[7]+l|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=w1.floor(r/4294967296),e[15+(64+i>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=x1.clone.call(this);return t._hash=this._hash.clone(),t}}),p=(p.SHA256=x1._createHelper(u),p.HmacSHA256=x1._createHmacHelper(u),j=(p=i).lib.WordArray,u=p.algo,T=u.SHA256,u=u.SHA224=T.extend({_doReset:function(){this._hash=new j.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=T._doFinalize.call(this);return t.sigBytes-=4,t}}),p.SHA224=T._createHelper(u),p.HmacSHA224=T._createHmacHelper(u),i),H1=p.lib.Hasher,y=(u=p.x64).Word,C1=u.WordArray,u=p.algo;function g(){return y.create.apply(y,arguments)}for(var R1=[g(1116352408,3609767458),g(1899447441,602891725),g(3049323471,3964484399),g(3921009573,2173295548),g(961987163,4081628472),g(1508970993,3053834265),g(2453635748,2937671579),g(2870763221,3664609560),g(3624381080,2734883394),g(310598401,1164996542),g(607225278,1323610764),g(1426881987,3590304994),g(1925078388,4068182383),g(2162078206,991336113),g(2614888103,633803317),g(3248222580,3479774868),g(3835390401,2666613458),g(4022224774,944711139),g(264347078,2341262773),g(604807628,2007800933),g(770255983,1495990901),g(1249150122,1856431235),g(1555081692,3175218132),g(1996064986,2198950837),g(2554220882,3999719339),g(2821834349,766784016),g(2952996808,2566594879),g(3210313671,3203337956),g(3336571891,1034457026),g(3584528711,2466948901),g(113926993,3758326383),g(338241895,168717936),g(666307205,1188179964),g(773529912,1546045734),g(1294757372,1522805485),g(1396182291,2643833823),g(1695183700,2343527390),g(1986661051,1014477480),g(2177026350,1206759142),g(2456956037,344077627),g(2730485921,1290863460),g(2820302411,3158454273),g(3259730800,3505952657),g(3345764771,106217008),g(3516065817,3606008344),g(3600352804,1432725776),g(4094571909,1467031594),g(275423344,851169720),g(430227734,3100823752),g(506948616,1363258195),g(659060556,3750685593),g(883997877,3785050280),g(958139571,3318307427),g(1322822218,3812723403),g(1537002063,2003034995),g(1747873779,3602036899),g(1955562222,1575990012),g(2024104815,1125592928),g(2227730452,2716904306),g(2361852424,442776044),g(2428436474,593698344),g(2756734187,3733110249),g(3204031479,2999351573),g(3329325298,3815920427),g(3391569614,3928383900),g(3515267271,566280711),g(3940187606,3454069534),g(4118630271,4000239992),g(116418474,1914138554),g(174292421,2731055270),g(289380356,3203993006),g(460393269,320620315),g(685471733,587496836),g(852142971,1086792851),g(1017036298,365543100),g(1126000580,2618297676),g(1288033470,3409855158),g(1501505948,4234509866),g(1607167915,987167468),g(1816402316,1246189591)],D1=[],E1=0;E1<80;E1++)D1[E1]=g();u=u.SHA512=H1.extend({_doReset:function(){this._hash=new C1.init([new y.init(1779033703,4089235720),new y.init(3144134277,2227873595),new y.init(1013904242,4271175723),new y.init(2773480762,1595750129),new y.init(1359893119,2917565137),new y.init(2600822924,725511199),new y.init(528734635,4215389547),new y.init(1541459225,327033209)])},_doProcessBlock:function(W,O){for(var t=this._hash.words,e=t[0],r=t[1],i=t[2],o=t[3],n=t[4],s=t[5],c=t[6],t=t[7],I=e.high,a=e.low,U=r.high,h=r.low,K=i.high,l=i.low,X=o.high,f=o.low,L=n.high,d=n.low,j=s.high,u=s.low,T=c.high,p=c.low,N=t.high,_=t.low,y=I,g=a,v=U,B=h,w=K,k=l,q=X,x=f,b=L,m=d,Z=j,S=u,V=T,G=p,J=N,Q=_,A=0;A<80;A++)var z,H,C=D1[A],R=(A<16?(H=C.high=0|W[O+2*A],z=C.low=0|W[O+2*A+1]):(F=(P=D1[A-15]).high,P=P.low,M=(E=D1[A-2]).high,E=E.low,D=(R=D1[A-7]).high,R=R.low,$=(Y=D1[A-16]).high,H=(H=((F>>>1|P<<31)^(F>>>8|P<<24)^F>>>7)+D+((z=(D=(P>>>1|F<<31)^(P>>>8|F<<24)^(P>>>7|F<<25))+R)>>>0<D>>>0?1:0))+((M>>>19|E<<13)^(M<<3|E>>>29)^M>>>6)+((z+=P=(E>>>19|M<<13)^(E<<3|M>>>29)^(E>>>6|M<<26))>>>0<P>>>0?1:0),z+=F=Y.low,C.high=H=H+$+(z>>>0<F>>>0?1:0),C.low=z),b&Z^~b&V),D=m&S^~m&G,E=y&v^y&w^v&w,M=(g>>>28|y<<4)^(g<<30|y>>>2)^(g<<25|y>>>7),P=R1[A],Y=P.high,$=P.low,F=Q+((m>>>14|b<<18)^(m>>>18|b<<14)^(m<<23|b>>>9)),C=J+((b>>>14|m<<18)^(b>>>18|m<<14)^(b<<23|m>>>9))+(F>>>0<Q>>>0?1:0),t1=M+(g&B^g&k^B&k),J=V,Q=G,V=Z,G=S,Z=b,S=m,b=q+(C=C+R+((F=F+D)>>>0<D>>>0?1:0)+Y+((F=F+$)>>>0<$>>>0?1:0)+H+((F=F+z)>>>0<z>>>0?1:0))+((m=x+F|0)>>>0<x>>>0?1:0)|0,q=w,x=k,w=v,k=B,v=y,B=g,y=C+(((y>>>28|g<<4)^(y<<30|g>>>2)^(y<<25|g>>>7))+E+(t1>>>0<M>>>0?1:0))+((g=F+t1|0)>>>0<F>>>0?1:0)|0;a=e.low=a+g,e.high=I+y+(a>>>0<g>>>0?1:0),h=r.low=h+B,r.high=U+v+(h>>>0<B>>>0?1:0),l=i.low=l+k,i.high=K+w+(l>>>0<k>>>0?1:0),f=o.low=f+x,o.high=X+q+(f>>>0<x>>>0?1:0),d=n.low=d+m,n.high=L+b+(d>>>0<m>>>0?1:0),u=s.low=u+S,s.high=j+Z+(u>>>0<S>>>0?1:0),p=c.low=p+G,c.high=T+V+(p>>>0<G>>>0?1:0),_=t.low=_+Q,t.high=N+J+(_>>>0<Q>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[30+(128+i>>>10<<5)]=Math.floor(r/4294967296),e[31+(128+i>>>10<<5)]=r,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=H1.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32}),p.SHA512=H1._createHelper(u),p.HmacSHA512=H1._createHmacHelper(u),u=(p=i).x64,t=u.Word,N=u.WordArray,u=p.algo,q=u.SHA512,u=u.SHA384=q.extend({_doReset:function(){this._hash=new N.init([new t.init(3418070365,3238371032),new t.init(1654270250,914150663),new t.init(2438529370,812702999),new t.init(355462360,4144912697),new t.init(1731405415,4290775857),new t.init(2394180231,1750603025),new t.init(3675008525,1694076839),new t.init(1203062813,3204075428)])},_doFinalize:function(){var t=q._doFinalize.call(this);return t.sigBytes-=16,t}}),p.SHA384=q._createHelper(u),p.HmacSHA384=q._createHmacHelper(u);for(var M1=Math,p=i,P1=(u=p.lib).WordArray,F1=u.Hasher,W1=p.x64.Word,u=p.algo,O1=[],I1=[],U1=[],v=1,B=0,K1=0;K1<24;K1++){O1[v+5*B]=(K1+1)*(K1+2)/2%64;var X1=(2*v+3*B)%5;v=B%5,B=X1}for(v=0;v<5;v++)for(B=0;B<5;B++)I1[v+5*B]=B+(2*v+3*B)%5*5;for(var L1=1,j1=0;j1<24;j1++){for(var T1,N1=0,q1=0,Z1=0;Z1<7;Z1++)1&L1&&((T1=(1<<Z1)-1)<32?q1^=1<<T1:N1^=1<<T1-32),128&L1?L1=L1<<1^113:L1<<=1;U1[j1]=W1.create(N1,q1)}for(var D=[],V1=0;V1<25;V1++)D[V1]=W1.create();function G1(t,e,r){return t&e|~t&r}function J1(t,e,r){return t&r|e&~r}function Q1(t,e){return t<<e|t>>>32-e}function Y1(t){return"string"==typeof t?f1:o}function $1(t,e,r){var i,o=this._iv;o?(i=o,this._iv=void 0):i=this._prevBlock;for(var n=0;n<r;n++)t[e+n]^=i[n]}function t2(t,e,r,i){var o,n=this._iv;n?(o=n.slice(0),this._iv=void 0):o=this._prevBlock,i.encryptBlock(o,0);for(var s=0;s<r;s++)t[e+s]^=o[s]}function e2(t){var e,r,i;return 255==(t>>24&255)?(r=t>>8&255,i=255&t,255===(e=t>>16&255)?(e=0,255===r?(r=0,255===i?i=0:++i):++r):++e,t=0,t=(t+=e<<16)+(r<<8)+i):t+=1<<24,t}u=u.SHA3=F1.extend({cfg:F1.cfg.extend({outputLength:512}),_doReset:function(){for(var t=this._state=[],e=0;e<25;e++)t[e]=new W1.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(t,e){for(var r=this._state,i=this.blockSize/2,o=0;o<i;o++){var n=t[e+2*o],s=t[e+2*o+1],n=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8);(x=r[o]).high^=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),x.low^=n}for(var c=0;c<24;c++){for(var a=0;a<5;a++){for(var h=0,l=0,f=0;f<5;f++)h^=(x=r[a+5*f]).high,l^=x.low;var d=D[a];d.high=h,d.low=l}for(a=0;a<5;a++)for(var u=D[(a+4)%5],p=D[(a+1)%5],_=p.high,p=p.low,h=u.high^(_<<1|p>>>31),l=u.low^(p<<1|_>>>31),f=0;f<5;f++)(x=r[a+5*f]).high^=h,x.low^=l;for(var y=1;y<25;y++){var g=(x=r[y]).high,v=x.low,B=O1[y],g=(l=B<32?(h=g<<B|v>>>32-B,v<<B|g>>>32-B):(h=v<<B-32|g>>>64-B,g<<B-32|v>>>64-B),D[I1[y]]);g.high=h,g.low=l}var w=D[0],k=r[0];w.high=k.high,w.low=k.low;for(a=0;a<5;a++)for(f=0;f<5;f++){var x=r[y=a+5*f],b=D[y],m=D[(a+1)%5+5*f],S=D[(a+2)%5+5*f];x.high=b.high^~m.high&S.high,x.low=b.low^~m.low&S.low}x=r[0],w=U1[c];x.high^=w.high,x.low^=w.low}},_doFinalize:function(){for(var t=this._data,e=t.words,r=(this._nDataBytes,8*t.sigBytes),i=32*this.blockSize,o=(e[r>>>5]|=1<<24-r%32,e[(M1.ceil((1+r)/i)*i>>>5)-1]|=128,t.sigBytes=4*e.length,this._process(),this._state),r=this.cfg.outputLength/8,n=r/8,s=[],c=0;c<n;c++){var a=o[c],h=a.high,a=a.low,h=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8);s.push(16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8)),s.push(h)}return new P1.init(s,r)},clone:function(){for(var t=F1.clone.call(this),e=t._state=this._state.slice(0),r=0;r<25;r++)e[r]=e[r].clone();return t}}),p.SHA3=F1._createHelper(u),p.HmacSHA3=F1._createHmacHelper(u),Math,u=(p=i).lib,e=u.WordArray,Z=u.Hasher,u=p.algo,V=e.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),G=e.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),J=e.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),Q=e.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),Y=e.create([0,1518500249,1859775393,2400959708,2840853838]),$=e.create([1352829926,1548603684,1836072691,2053994217,0]),u=u.RIPEMD160=Z.extend({_doReset:function(){this._hash=e.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,o=t[i];t[i]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8)}for(var n,s,c,a,h,l,f=this._hash.words,d=Y.words,u=$.words,p=V.words,_=G.words,y=J.words,g=Q.words,v=n=f[0],B=s=f[1],w=c=f[2],k=a=f[3],x=h=f[4],r=0;r<80;r+=1)l=(l=Q1(l=(l=n+t[e+p[r]]|0)+(r<16?(s^c^a)+d[0]:r<32?G1(s,c,a)+d[1]:r<48?((s|~c)^a)+d[2]:r<64?J1(s,c,a)+d[3]:(s^(c|~a))+d[4])|0,y[r]))+h|0,n=h,h=a,a=Q1(c,10),c=s,s=l,l=(l=Q1(l=(l=v+t[e+_[r]]|0)+(r<16?(B^(w|~k))+u[0]:r<32?J1(B,w,k)+u[1]:r<48?((B|~w)^k)+u[2]:r<64?G1(B,w,k)+u[3]:(B^w^k)+u[4])|0,g[r]))+x|0,v=x,x=k,k=Q1(w,10),w=B,B=l;l=f[1]+c+k|0,f[1]=f[2]+a+x|0,f[2]=f[3]+h+v|0,f[3]=f[4]+n+B|0,f[4]=f[0]+s+w|0,f[0]=l},_doFinalize:function(){for(var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes,i=(e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(e.length+1),this._process(),this._hash),o=i.words,n=0;n<5;n++){var s=o[n];o[n]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8)}return i},clone:function(){var t=Z.clone.call(this);return t._hash=this._hash.clone(),t}}),p.RIPEMD160=Z._createHelper(u),p.HmacRIPEMD160=Z._createHmacHelper(u),u=(p=i).lib.Base,t1=p.enc.Utf8,p.algo.HMAC=u.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=t1.parse(e));for(var r=t.blockSize,i=4*r,t=((e=e.sigBytes>i?t.finalize(e):e).clamp(),this._oKey=e.clone()),e=this._iKey=e.clone(),o=t.words,n=e.words,s=0;s<r;s++)o[s]^=1549556828,n[s]^=909522486;t.sigBytes=e.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,t=e.finalize(t);return e.reset(),e.finalize(this._oKey.clone().concat(t))}}),u=(p=i).lib,w=u.Base,e1=u.WordArray,u=p.algo,P=u.SHA256,r1=u.HMAC,i1=u.PBKDF2=w.extend({cfg:w.extend({keySize:4,hasher:P,iterations:25e4}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=this.cfg,i=r1.create(r.hasher,t),o=e1.create(),n=e1.create([1]),s=o.words,c=n.words,a=r.keySize,h=r.iterations;s.length<a;){for(var l=i.update(e).finalize(n),f=(i.reset(),l.words),d=f.length,u=l,p=1;p<h;p++){u=i.finalize(u),i.reset();for(var _=u.words,y=0;y<d;y++)f[y]^=_[y]}o.concat(l),c[0]++}return o.sigBytes=4*a,o}}),p.PBKDF2=function(t,e,r){return i1.create(r).compute(t,e)},w=(u=i).lib,P=w.Base,o1=w.WordArray,w=u.algo,p=w.MD5,n1=w.EvpKDF=P.extend({cfg:P.extend({keySize:4,hasher:p,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r,i=this.cfg,o=i.hasher.create(),n=o1.create(),s=n.words,c=i.keySize,a=i.iterations;s.length<c;){r&&o.update(r),r=o.update(t).finalize(e),o.reset();for(var h=1;h<a;h++)r=o.finalize(r),o.reset();n.concat(r)}return n.sigBytes=4*c,n}}),u.EvpKDF=function(t,e,r){return n1.create(r).compute(t,e)},i.lib.Cipher||(P=(w=i).lib,p=P.Base,s=P.WordArray,s1=P.BufferedBlockAlgorithm,(u=w.enc).Utf8,c1=u.Base64,a1=w.algo.EvpKDF,h1=P.Cipher=s1.extend({cfg:p.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){s1.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(i){return{encrypt:function(t,e,r){return Y1(e).encrypt(i,t,e,r)},decrypt:function(t,e,r){return Y1(e).decrypt(i,t,e,r)}}}}),P.StreamCipher=h1.extend({_doFinalize:function(){return this._process(!0)},blockSize:1}),u=w.mode={},r=P.BlockCipherMode=p.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),r=u.CBC=((u=r.extend()).Encryptor=u.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;$1.call(this,t,e,i),r.encryptBlock(t,e),this._prevBlock=t.slice(e,e+i)}}),u.Decryptor=u.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,o=t.slice(e,e+i);r.decryptBlock(t,e),$1.call(this,t,e,i),this._prevBlock=o}}),u),u=(w.pad={}).Pkcs7={pad:function(t,e){for(var e=4*e,r=e-t.sigBytes%e,i=r<<24|r<<16|r<<8|r,o=[],n=0;n<r;n+=4)o.push(i);e=s.create(o,r);t.concat(e)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},P.BlockCipher=h1.extend({cfg:h1.cfg.extend({mode:r,padding:u}),reset:function(){h1.reset.call(this);var t,e=this.cfg,r=e.iv,e=e.mode;this._xformMode==this._ENC_XFORM_MODE?t=e.createEncryptor:(t=e.createDecryptor,this._minBufferSize=1),this._mode&&this._mode.__creator==t?this._mode.init(this,r&&r.words):(this._mode=t.call(e,this,r&&r.words),this._mode.__creator=t)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t,e=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(e.pad(this._data,this.blockSize),t=this._process(!0)):(t=this._process(!0),e.unpad(t)),t},blockSize:4}),l1=P.CipherParams=p.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}}),r=(w.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext,t=t.salt,t=t?s.create([1398893684,1701076831]).concat(t).concat(e):e;return t.toString(c1)},parse:function(t){var e,t=c1.parse(t),r=t.words;return 1398893684==r[0]&&1701076831==r[1]&&(e=s.create(r.slice(2,4)),r.splice(0,4),t.sigBytes-=16),l1.create({ciphertext:t,salt:e})}},o=P.SerializableCipher=p.extend({cfg:p.extend({format:r}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var o=t.createEncryptor(r,i),e=o.finalize(e),o=o.cfg;return l1.create({ciphertext:e,key:r,iv:o.iv,algorithm:t,mode:o.mode,padding:o.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,e,r,i){return i=this.cfg.extend(i),e=this._parse(e,i.format),t.createDecryptor(r,i).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),u=(w.kdf={}).OpenSSL={execute:function(t,e,r,i,o){i=i||s.random(8),o=(o?a1.create({keySize:e+r,hasher:o}):a1.create({keySize:e+r})).compute(t,i);t=s.create(o.words.slice(e),4*r);return o.sigBytes=4*e,l1.create({key:o,iv:t,salt:i})}},f1=P.PasswordBasedCipher=o.extend({cfg:o.cfg.extend({kdf:u}),encrypt:function(t,e,r,i){r=(i=this.cfg.extend(i)).kdf.execute(r,t.keySize,t.ivSize,i.salt,i.hasher),i.iv=r.iv,t=o.encrypt.call(this,t,e,r.key,i);return t.mixIn(r),t},decrypt:function(t,e,r,i){i=this.cfg.extend(i),e=this._parse(e,i.format);r=i.kdf.execute(r,t.keySize,t.ivSize,e.salt,i.hasher);return i.iv=r.iv,o.decrypt.call(this,t,e,r.key,i)}})),i.mode.CFB=((p=i.lib.BlockCipherMode.extend()).Encryptor=p.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;t2.call(this,t,e,i,r),this._prevBlock=t.slice(e,e+i)}}),p.Decryptor=p.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,o=t.slice(e,e+i);t2.call(this,t,e,i,r),this._prevBlock=o}}),p),i.mode.CTR=(r=i.lib.BlockCipherMode.extend(),w=r.Encryptor=r.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,o=this._iv,n=this._counter,s=(o&&(n=this._counter=o.slice(0),this._iv=void 0),n.slice(0));r.encryptBlock(s,0),n[i-1]=n[i-1]+1|0;for(var c=0;c<i;c++)t[e+c]^=s[c]}}),r.Decryptor=w,r),i.mode.CTRGladman=(P=i.lib.BlockCipherMode.extend(),u=P.Encryptor=P.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,o=this._iv,n=this._counter,s=(o&&(n=this._counter=o.slice(0),this._iv=void 0),0===((o=n)[0]=e2(o[0]))&&(o[1]=e2(o[1])),n.slice(0));r.encryptBlock(s,0);for(var c=0;c<i;c++)t[e+c]^=s[c]}}),P.Decryptor=u,P),i.mode.OFB=(p=i.lib.BlockCipherMode.extend(),w=p.Encryptor=p.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,o=this._iv,n=this._keystream;o&&(n=this._keystream=o.slice(0),this._iv=void 0),r.encryptBlock(n,0);for(var s=0;s<i;s++)t[e+s]^=n[s]}}),p.Decryptor=w,p),i.mode.ECB=((u=i.lib.BlockCipherMode.extend()).Encryptor=u.extend({processBlock:function(t,e){this._cipher.encryptBlock(t,e)}}),u.Decryptor=u.extend({processBlock:function(t,e){this._cipher.decryptBlock(t,e)}}),u),i.pad.AnsiX923={pad:function(t,e){var r=t.sigBytes,e=4*e,e=e-r%e,r=r+e-1;t.clamp(),t.words[r>>>2]|=e<<24-r%4*8,t.sigBytes+=e},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},i.pad.Iso10126={pad:function(t,e){e*=4,e-=t.sigBytes%e;t.concat(i.lib.WordArray.random(e-1)).concat(i.lib.WordArray.create([e<<24],1))},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},i.pad.Iso97971={pad:function(t,e){t.concat(i.lib.WordArray.create([2147483648],1)),i.pad.ZeroPadding.pad(t,e)},unpad:function(t){i.pad.ZeroPadding.unpad(t),t.sigBytes--}},i.pad.ZeroPadding={pad:function(t,e){e*=4;t.clamp(),t.sigBytes+=e-(t.sigBytes%e||e)},unpad:function(t){for(var e=t.words,r=t.sigBytes-1,r=t.sigBytes-1;0<=r;r--)if(e[r>>>2]>>>24-r%4*8&255){t.sigBytes=r+1;break}}},i.pad.NoPadding={pad:function(){},unpad:function(){}},d1=(P=i).lib.CipherParams,u1=P.enc.Hex,P.format.Hex={stringify:function(t){return t.ciphertext.toString(u1)},parse:function(t){t=u1.parse(t);return d1.create({ciphertext:t})}};for(var w=i,p=w.lib.BlockCipher,u=w.algo,k=[],r2=[],i2=[],o2=[],n2=[],s2=[],c2=[],a2=[],h2=[],l2=[],x=[],b=0;b<256;b++)x[b]=b<128?b<<1:b<<1^283;for(var m=0,S=0,b=0;b<256;b++){var E=S^S<<1^S<<2^S<<3^S<<4,f2=(k[m]=E=E>>>8^255&E^99,x[r2[E]=m]),d2=x[f2],u2=x[d2],M=257*x[E]^16843008*E;i2[m]=M<<24|M>>>8,o2[m]=M<<16|M>>>16,n2[m]=M<<8|M>>>24,s2[m]=M,c2[E]=(M=16843009*u2^65537*d2^257*f2^16843008*m)<<24|M>>>8,a2[E]=M<<16|M>>>16,h2[E]=M<<8|M>>>24,l2[E]=M,m?(m=f2^x[x[x[u2^f2]]],S^=x[x[S]]):m=S=1}var p2=[0,1,2,4,8,16,32,64,128,27,54],u=u.AES=p.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,r=t.sigBytes/4,i=4*(1+(this._nRounds=6+r)),o=this._keySchedule=[],n=0;n<i;n++)n<r?o[n]=e[n]:(a=o[n-1],n%r?6<r&&n%r==4&&(a=k[a>>>24]<<24|k[a>>>16&255]<<16|k[a>>>8&255]<<8|k[255&a]):(a=k[(a=a<<8|a>>>24)>>>24]<<24|k[a>>>16&255]<<16|k[a>>>8&255]<<8|k[255&a],a^=p2[n/r|0]<<24),o[n]=o[n-r]^a);for(var s=this._invKeySchedule=[],c=0;c<i;c++){var a,n=i-c;a=c%4?o[n]:o[n-4],s[c]=c<4||n<=4?a:c2[k[a>>>24]]^a2[k[a>>>16&255]]^h2[k[a>>>8&255]]^l2[k[255&a]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,i2,o2,n2,s2,k)},decryptBlock:function(t,e){var r=t[e+1],r=(t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,c2,a2,h2,l2,r2),t[e+1]);t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,i,o,n,s,c){for(var a=this._nRounds,h=t[e]^r[0],l=t[e+1]^r[1],f=t[e+2]^r[2],d=t[e+3]^r[3],u=4,p=1;p<a;p++)var _=i[h>>>24]^o[l>>>16&255]^n[f>>>8&255]^s[255&d]^r[u++],y=i[l>>>24]^o[f>>>16&255]^n[d>>>8&255]^s[255&h]^r[u++],g=i[f>>>24]^o[d>>>16&255]^n[h>>>8&255]^s[255&l]^r[u++],v=i[d>>>24]^o[h>>>16&255]^n[l>>>8&255]^s[255&f]^r[u++],h=_,l=y,f=g,d=v;_=(c[h>>>24]<<24|c[l>>>16&255]<<16|c[f>>>8&255]<<8|c[255&d])^r[u++],y=(c[l>>>24]<<24|c[f>>>16&255]<<16|c[d>>>8&255]<<8|c[255&h])^r[u++],g=(c[f>>>24]<<24|c[d>>>16&255]<<16|c[h>>>8&255]<<8|c[255&l])^r[u++],v=(c[d>>>24]<<24|c[h>>>16&255]<<16|c[l>>>8&255]<<8|c[255&f])^r[u++];t[e]=_,t[e+1]=y,t[e+2]=g,t[e+3]=v},keySize:8}),P=(w.AES=p._createHelper(u),i),_2=(w=P.lib).WordArray,w=w.BlockCipher,p=P.algo,y2=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],g2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],v2=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],B2=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],w2=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],k2=p.DES=w.extend({_doReset:function(){for(var t=this._key.words,e=[],r=0;r<56;r++){var i=y2[r]-1;e[r]=t[i>>>5]>>>31-i%32&1}for(var o=this._subKeys=[],n=0;n<16;n++){for(var s=o[n]=[],c=v2[n],r=0;r<24;r++)s[r/6|0]|=e[(g2[r]-1+c)%28]<<31-r%6,s[4+(r/6|0)]|=e[28+(g2[r+24]-1+c)%28]<<31-r%6;s[0]=s[0]<<1|s[0]>>>31;for(r=1;r<7;r++)s[r]=s[r]>>>4*(r-1)+3;s[7]=s[7]<<5|s[7]>>>27}for(var a=this._invSubKeys=[],r=0;r<16;r++)a[r]=o[15-r]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._subKeys)},decryptBlock:function(t,e){this._doCryptBlock(t,e,this._invSubKeys)},_doCryptBlock:function(t,e,r){this._lBlock=t[e],this._rBlock=t[e+1],x2.call(this,4,252645135),x2.call(this,16,65535),b2.call(this,2,858993459),b2.call(this,8,16711935),x2.call(this,1,1431655765);for(var i=0;i<16;i++){for(var o=r[i],n=this._lBlock,s=this._rBlock,c=0,a=0;a<8;a++)c|=B2[a][((s^o[a])&w2[a])>>>0];this._lBlock=s,this._rBlock=n^c}var h=this._lBlock;this._lBlock=this._rBlock,this._rBlock=h,x2.call(this,1,1431655765),b2.call(this,8,16711935),b2.call(this,2,858993459),x2.call(this,16,65535),x2.call(this,4,252645135),t[e]=this._lBlock,t[e+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});function x2(t,e){e=(this._lBlock>>>t^this._rBlock)&e;this._rBlock^=e,this._lBlock^=e<<t}function b2(t,e){e=(this._rBlock>>>t^this._lBlock)&e;this._lBlock^=e,this._rBlock^=e<<t}P.DES=w._createHelper(k2),p=p.TripleDES=w.extend({_doReset:function(){var t=this._key.words;if(2!==t.length&&4!==t.length&&t.length<6)throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");var e=t.slice(0,2),r=t.length<4?t.slice(0,2):t.slice(2,4),t=t.length<6?t.slice(0,2):t.slice(4,6);this._des1=k2.createEncryptor(_2.create(e)),this._des2=k2.createEncryptor(_2.create(r)),this._des3=k2.createEncryptor(_2.create(t))},encryptBlock:function(t,e){this._des1.encryptBlock(t,e),this._des2.decryptBlock(t,e),this._des3.encryptBlock(t,e)},decryptBlock:function(t,e){this._des3.decryptBlock(t,e),this._des2.encryptBlock(t,e),this._des1.decryptBlock(t,e)},keySize:6,ivSize:2,blockSize:2}),P.TripleDES=w._createHelper(p);var u=i,P=u.lib.StreamCipher,w=u.algo,m2=w.RC4=P.extend({_doReset:function(){for(var t=this._key,e=t.words,r=t.sigBytes,i=this._S=[],o=0;o<256;o++)i[o]=o;for(var o=0,n=0;o<256;o++){var s=o%r,s=e[s>>>2]>>>24-s%4*8&255,n=(n+i[o]+s)%256,s=i[o];i[o]=i[n],i[n]=s}this._i=this._j=0},_doProcessBlock:function(t,e){t[e]^=S2.call(this)},keySize:8,ivSize:0});function S2(){for(var t=this._S,e=this._i,r=this._j,i=0,o=0;o<4;o++){var r=(r+t[e=(e+1)%256])%256,n=t[e];t[e]=t[r],t[r]=n,i|=t[(t[e]+t[r])%256]<<24-8*o}return this._i=e,this._j=r,i}function A2(){for(var t=this._X,e=this._C,r=0;r<8;r++)c[r]=e[r];e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<c[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<c[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<c[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<c[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<c[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<c[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<c[6]>>>0?1:0)|0,this._b=e[7]>>>0<c[7]>>>0?1:0;for(r=0;r<8;r++){var i=t[r]+e[r],o=65535&i,n=i>>>16;a[r]=((o*o>>>17)+o*n>>>15)+n*n^((4294901760&i)*i|0)+((65535&i)*i|0)}t[0]=a[0]+(a[7]<<16|a[7]>>>16)+(a[6]<<16|a[6]>>>16)|0,t[1]=a[1]+(a[0]<<8|a[0]>>>24)+a[7]|0,t[2]=a[2]+(a[1]<<16|a[1]>>>16)+(a[0]<<16|a[0]>>>16)|0,t[3]=a[3]+(a[2]<<8|a[2]>>>24)+a[1]|0,t[4]=a[4]+(a[3]<<16|a[3]>>>16)+(a[2]<<16|a[2]>>>16)|0,t[5]=a[5]+(a[4]<<8|a[4]>>>24)+a[3]|0,t[6]=a[6]+(a[5]<<16|a[5]>>>16)+(a[4]<<16|a[4]>>>16)|0,t[7]=a[7]+(a[6]<<8|a[6]>>>24)+a[5]|0}function z2(){for(var t=this._X,e=this._C,r=0;r<8;r++)f[r]=e[r];e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<f[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<f[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<f[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<f[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<f[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<f[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<f[6]>>>0?1:0)|0,this._b=e[7]>>>0<f[7]>>>0?1:0;for(r=0;r<8;r++){var i=t[r]+e[r],o=65535&i,n=i>>>16;d[r]=((o*o>>>17)+o*n>>>15)+n*n^((4294901760&i)*i|0)+((65535&i)*i|0)}t[0]=d[0]+(d[7]<<16|d[7]>>>16)+(d[6]<<16|d[6]>>>16)|0,t[1]=d[1]+(d[0]<<8|d[0]>>>24)+d[7]|0,t[2]=d[2]+(d[1]<<16|d[1]>>>16)+(d[0]<<16|d[0]>>>16)|0,t[3]=d[3]+(d[2]<<8|d[2]>>>24)+d[1]|0,t[4]=d[4]+(d[3]<<16|d[3]>>>16)+(d[2]<<16|d[2]>>>16)|0,t[5]=d[5]+(d[4]<<8|d[4]>>>24)+d[3]|0,t[6]=d[6]+(d[5]<<16|d[5]>>>16)+(d[4]<<16|d[4]>>>16)|0,t[7]=d[7]+(d[6]<<8|d[6]>>>24)+d[5]|0}u.RC4=P._createHelper(m2),w=w.RC4Drop=m2.extend({cfg:m2.cfg.extend({drop:192}),_doReset:function(){m2._doReset.call(this);for(var t=this.cfg.drop;0<t;t--)S2.call(this)}}),u.RC4Drop=P._createHelper(w),u=(p=i).lib.StreamCipher,P=p.algo,n=[],c=[],a=[],P=P.Rabbit=u.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=0;r<4;r++)t[r]=16711935&(t[r]<<8|t[r]>>>24)|4278255360&(t[r]<<24|t[r]>>>8);for(var i=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],o=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]],r=this._b=0;r<4;r++)A2.call(this);for(r=0;r<8;r++)o[r]^=i[r+4&7];if(e){var e=e.words,n=e[0],e=e[1],n=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),e=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8),s=n>>>16|4294901760&e,c=e<<16|65535&n;o[0]^=n,o[1]^=s,o[2]^=e,o[3]^=c,o[4]^=n,o[5]^=s,o[6]^=e,o[7]^=c;for(r=0;r<4;r++)A2.call(this)}},_doProcessBlock:function(t,e){var r=this._X;A2.call(this),n[0]=r[0]^r[5]>>>16^r[3]<<16,n[1]=r[2]^r[7]>>>16^r[5]<<16,n[2]=r[4]^r[1]>>>16^r[7]<<16,n[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)n[i]=16711935&(n[i]<<8|n[i]>>>24)|4278255360&(n[i]<<24|n[i]>>>8),t[e+i]^=n[i]},blockSize:4,ivSize:2}),p.Rabbit=u._createHelper(P),p=(w=i).lib.StreamCipher,u=w.algo,h=[],f=[],d=[],u=u.RabbitLegacy=p.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],i=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]],o=this._b=0;o<4;o++)z2.call(this);for(o=0;o<8;o++)i[o]^=r[o+4&7];if(e){var t=e.words,e=t[0],t=t[1],e=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8),t=16711935&(t<<8|t>>>24)|4278255360&(t<<24|t>>>8),n=e>>>16|4294901760&t,s=t<<16|65535&e;i[0]^=e,i[1]^=n,i[2]^=t,i[3]^=s,i[4]^=e,i[5]^=n,i[6]^=t,i[7]^=s;for(o=0;o<4;o++)z2.call(this)}},_doProcessBlock:function(t,e){var r=this._X;z2.call(this),h[0]=r[0]^r[5]>>>16^r[3]<<16,h[1]=r[2]^r[7]>>>16^r[5]<<16,h[2]=r[4]^r[1]>>>16^r[7]<<16,h[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)h[i]=16711935&(h[i]<<8|h[i]>>>24)|4278255360&(h[i]<<24|h[i]>>>8),t[e+i]^=h[i]},blockSize:4,ivSize:2}),w.RabbitLegacy=p._createHelper(u);{w=(P=i).lib.BlockCipher,p=P.algo;const F=16,D2=[608135816,2242054355,320440878,57701188,2752067618,698298832,137296536,3964562569,1160258022,953160567,3193202383,887688300,3232508343,3380367581,1065670069,3041331479,2450970073,2306472731],E2=[[3509652390,2564797868,805139163,3491422135,3101798381,1780907670,3128725573,4046225305,614570311,3012652279,134345442,2240740374,1667834072,1901547113,2757295779,4103290238,227898511,1921955416,1904987480,2182433518,2069144605,3260701109,2620446009,720527379,3318853667,677414384,3393288472,3101374703,2390351024,1614419982,1822297739,2954791486,3608508353,3174124327,2024746970,1432378464,3864339955,2857741204,1464375394,1676153920,1439316330,715854006,3033291828,289532110,2706671279,2087905683,3018724369,1668267050,732546397,1947742710,3462151702,2609353502,2950085171,1814351708,2050118529,680887927,999245976,1800124847,3300911131,1713906067,1641548236,4213287313,1216130144,1575780402,4018429277,3917837745,3693486850,3949271944,596196993,3549867205,258830323,2213823033,772490370,2760122372,1774776394,2652871518,566650946,4142492826,1728879713,2882767088,1783734482,3629395816,2517608232,2874225571,1861159788,326777828,3124490320,2130389656,2716951837,967770486,1724537150,2185432712,2364442137,1164943284,2105845187,998989502,3765401048,2244026483,1075463327,1455516326,1322494562,910128902,469688178,1117454909,936433444,3490320968,3675253459,1240580251,122909385,2157517691,634681816,4142456567,3825094682,3061402683,2540495037,79693498,3249098678,1084186820,1583128258,426386531,1761308591,1047286709,322548459,995290223,1845252383,2603652396,3431023940,2942221577,3202600964,3727903485,1712269319,422464435,3234572375,1170764815,3523960633,3117677531,1434042557,442511882,3600875718,1076654713,1738483198,4213154764,2393238008,3677496056,1014306527,4251020053,793779912,2902807211,842905082,4246964064,1395751752,1040244610,2656851899,3396308128,445077038,3742853595,3577915638,679411651,2892444358,2354009459,1767581616,3150600392,3791627101,3102740896,284835224,4246832056,1258075500,768725851,2589189241,3069724005,3532540348,1274779536,3789419226,2764799539,1660621633,3471099624,4011903706,913787905,3497959166,737222580,2514213453,2928710040,3937242737,1804850592,3499020752,2949064160,2386320175,2390070455,2415321851,4061277028,2290661394,2416832540,1336762016,1754252060,3520065937,3014181293,791618072,3188594551,3933548030,2332172193,3852520463,3043980520,413987798,3465142937,3030929376,4245938359,2093235073,3534596313,375366246,2157278981,2479649556,555357303,3870105701,2008414854,3344188149,4221384143,3956125452,2067696032,3594591187,2921233993,2428461,544322398,577241275,1471733935,610547355,4027169054,1432588573,1507829418,2025931657,3646575487,545086370,48609733,2200306550,1653985193,298326376,1316178497,3007786442,2064951626,458293330,2589141269,3591329599,3164325604,727753846,2179363840,146436021,1461446943,4069977195,705550613,3059967265,3887724982,4281599278,3313849956,1404054877,2845806497,146425753,1854211946],[1266315497,3048417604,3681880366,3289982499,290971e4,1235738493,2632868024,2414719590,3970600049,1771706367,1449415276,3266420449,422970021,1963543593,2690192192,3826793022,1062508698,1531092325,1804592342,2583117782,2714934279,4024971509,1294809318,4028980673,1289560198,2221992742,1669523910,35572830,157838143,1052438473,1016535060,1802137761,1753167236,1386275462,3080475397,2857371447,1040679964,2145300060,2390574316,1461121720,2956646967,4031777805,4028374788,33600511,2920084762,1018524850,629373528,3691585981,3515945977,2091462646,2486323059,586499841,988145025,935516892,3367335476,2599673255,2839830854,265290510,3972581182,2759138881,3795373465,1005194799,847297441,406762289,1314163512,1332590856,1866599683,4127851711,750260880,613907577,1450815602,3165620655,3734664991,3650291728,3012275730,3704569646,1427272223,778793252,1343938022,2676280711,2052605720,1946737175,3164576444,3914038668,3967478842,3682934266,1661551462,3294938066,4011595847,840292616,3712170807,616741398,312560963,711312465,1351876610,322626781,1910503582,271666773,2175563734,1594956187,70604529,3617834859,1007753275,1495573769,4069517037,2549218298,2663038764,504708206,2263041392,3941167025,2249088522,1514023603,1998579484,1312622330,694541497,2582060303,2151582166,1382467621,776784248,2618340202,3323268794,2497899128,2784771155,503983604,4076293799,907881277,423175695,432175456,1378068232,4145222326,3954048622,3938656102,3820766613,2793130115,2977904593,26017576,3274890735,3194772133,1700274565,1756076034,4006520079,3677328699,720338349,1533947780,354530856,688349552,3973924725,1637815568,332179504,3949051286,53804574,2852348879,3044236432,1282449977,3583942155,3416972820,4006381244,1617046695,2628476075,3002303598,1686838959,431878346,2686675385,1700445008,1080580658,1009431731,832498133,3223435511,2605976345,2271191193,2516031870,1648197032,4164389018,2548247927,300782431,375919233,238389289,3353747414,2531188641,2019080857,1475708069,455242339,2609103871,448939670,3451063019,1395535956,2413381860,1841049896,1491858159,885456874,4264095073,4001119347,1565136089,3898914787,1108368660,540939232,1173283510,2745871338,3681308437,4207628240,3343053890,4016749493,1699691293,1103962373,3625875870,2256883143,3830138730,1031889488,3479347698,1535977030,4236805024,3251091107,2132092099,1774941330,1199868427,1452454533,157007616,2904115357,342012276,595725824,1480756522,206960106,497939518,591360097,863170706,2375253569,3596610801,1814182875,2094937945,3421402208,1082520231,3463918190,2785509508,435703966,3908032597,1641649973,2842273706,3305899714,1510255612,2148256476,2655287854,3276092548,4258621189,236887753,3681803219,274041037,1734335097,3815195456,3317970021,1899903192,1026095262,4050517792,356393447,2410691914,3873677099,3682840055],[3913112168,2491498743,4132185628,2489919796,1091903735,1979897079,3170134830,3567386728,3557303409,857797738,1136121015,1342202287,507115054,2535736646,337727348,3213592640,1301675037,2528481711,1895095763,1721773893,3216771564,62756741,2142006736,835421444,2531993523,1442658625,3659876326,2882144922,676362277,1392781812,170690266,3921047035,1759253602,3611846912,1745797284,664899054,1329594018,3901205900,3045908486,2062866102,2865634940,3543621612,3464012697,1080764994,553557557,3656615353,3996768171,991055499,499776247,1265440854,648242737,3940784050,980351604,3713745714,1749149687,3396870395,4211799374,3640570775,1161844396,3125318951,1431517754,545492359,4268468663,3499529547,1437099964,2702547544,3433638243,2581715763,2787789398,1060185593,1593081372,2418618748,4260947970,69676912,2159744348,86519011,2512459080,3838209314,1220612927,3339683548,133810670,1090789135,1078426020,1569222167,845107691,3583754449,4072456591,1091646820,628848692,1613405280,3757631651,526609435,236106946,48312990,2942717905,3402727701,1797494240,859738849,992217954,4005476642,2243076622,3870952857,3732016268,765654824,3490871365,2511836413,1685915746,3888969200,1414112111,2273134842,3281911079,4080962846,172450625,2569994100,980381355,4109958455,2819808352,2716589560,2568741196,3681446669,3329971472,1835478071,660984891,3704678404,4045999559,3422617507,3040415634,1762651403,1719377915,3470491036,2693910283,3642056355,3138596744,1364962596,2073328063,1983633131,926494387,3423689081,2150032023,4096667949,1749200295,3328846651,309677260,2016342300,1779581495,3079819751,111262694,1274766160,443224088,298511866,1025883608,3806446537,1145181785,168956806,3641502830,3584813610,1689216846,3666258015,3200248200,1692713982,2646376535,4042768518,1618508792,1610833997,3523052358,4130873264,2001055236,3610705100,2202168115,4028541809,2961195399,1006657119,2006996926,3186142756,1430667929,3210227297,1314452623,4074634658,4101304120,2273951170,1399257539,3367210612,3027628629,1190975929,2062231137,2333990788,2221543033,2438960610,1181637006,548689776,2362791313,3372408396,3104550113,3145860560,296247880,1970579870,3078560182,3769228297,1714227617,3291629107,3898220290,166772364,1251581989,493813264,448347421,195405023,2709975567,677966185,3703036547,1463355134,2715995803,1338867538,1343315457,2802222074,2684532164,233230375,2599980071,2000651841,3277868038,1638401717,4028070440,3237316320,6314154,819756386,300326615,590932579,1405279636,3267499572,3150704214,2428286686,3959192993,3461946742,1862657033,1266418056,963775037,2089974820,2263052895,1917689273,448879540,3550394620,3981727096,150775221,3627908307,1303187396,508620638,2975983352,2726630617,1817252668,1876281319,1457606340,908771278,3720792119,3617206836,2455994898,1729034894,1080033504],[976866871,3556439503,2881648439,1522871579,1555064734,1336096578,3548522304,2579274686,3574697629,3205460757,3593280638,3338716283,3079412587,564236357,2993598910,1781952180,1464380207,3163844217,3332601554,1699332808,1393555694,1183702653,3581086237,1288719814,691649499,2847557200,2895455976,3193889540,2717570544,1781354906,1676643554,2592534050,3230253752,1126444790,2770207658,2633158820,2210423226,2615765581,2414155088,3127139286,673620729,2805611233,1269405062,4015350505,3341807571,4149409754,1057255273,2012875353,2162469141,2276492801,2601117357,993977747,3918593370,2654263191,753973209,36408145,2530585658,25011837,3520020182,2088578344,530523599,2918365339,1524020338,1518925132,3760827505,3759777254,1202760957,3985898139,3906192525,674977740,4174734889,2031300136,2019492241,3983892565,4153806404,3822280332,352677332,2297720250,60907813,90501309,3286998549,1016092578,2535922412,2839152426,457141659,509813237,4120667899,652014361,1966332200,2975202805,55981186,2327461051,676427537,3255491064,2882294119,3433927263,1307055953,942726286,933058658,2468411793,3933900994,4215176142,1361170020,2001714738,2830558078,3274259782,1222529897,1679025792,2729314320,3714953764,1770335741,151462246,3013232138,1682292957,1483529935,471910574,1539241949,458788160,3436315007,1807016891,3718408830,978976581,1043663428,3165965781,1927990952,4200891579,2372276910,3208408903,3533431907,1412390302,2931980059,4132332400,1947078029,3881505623,4168226417,2941484381,1077988104,1320477388,886195818,18198404,3786409e3,2509781533,112762804,3463356488,1866414978,891333506,18488651,661792760,1628790961,3885187036,3141171499,876946877,2693282273,1372485963,791857591,2686433993,3759982718,3167212022,3472953795,2716379847,445679433,3561995674,3504004811,3574258232,54117162,3331405415,2381918588,3769707343,4154350007,1140177722,4074052095,668550556,3214352940,367459370,261225585,2610173221,4209349473,3468074219,3265815641,314222801,3066103646,3808782860,282218597,3406013506,3773591054,379116347,1285071038,846784868,2669647154,3771962079,3550491691,2305946142,453669953,1268987020,3317592352,3279303384,3744833421,2610507566,3859509063,266596637,3847019092,517658769,3462560207,3443424879,370717030,4247526661,2224018117,4143653529,4112773975,2788324899,2477274417,1456262402,2901442914,1517677493,1846949527,2295493580,3734397586,2176403920,1280348187,1908823572,3871786941,846861322,1172426758,3287448474,3383383037,1655181056,3139813346,901632758,1897031941,2986607138,3066810236,3447102507,1393639104,373351379,950779232,625454576,3124240540,4148612726,2007998917,544563296,2244738638,2330496472,2058025392,1291430526,424198748,50039436,29584100,3605783033,2429876329,2791104160,1057563949,3255363231,3075367218,3463963227,1469046755,985887462]];var H2={pbox:[],sbox:[]};function C2(t,e){var r=t.sbox[0][e>>24&255]+t.sbox[1][e>>16&255];return r=(r^=t.sbox[2][e>>8&255])+t.sbox[3][255&e]}function R2(e,t,r){let i=t,o=r,n;for(let t=0;t<F;++t)i^=e.pbox[t],o=C2(e,i)^o,n=i,i=o,o=n;return n=i,i=o,o=n,o^=e.pbox[F],{left:i^=e.pbox[F+1],right:o}}p=p.Blowfish=w.extend({_doReset:function(){if(this._keyPriorReset!==this._key){var t=this._keyPriorReset=this._key,n=t.words,t=t.sigBytes/4;{var s=H2,c=n,a=t;for(let e=0;e<4;e++){s.sbox[e]=[];for(let t=0;t<256;t++)s.sbox[e][t]=E2[e][t]}let e=0;for(let t=0;t<F+2;t++)s.pbox[t]=D2[t]^c[e],++e>=a&&(e=0);let r=0,i=0,o=0;for(let t=0;t<F+2;t+=2)o=R2(s,r,i),r=o.left,i=o.right,s.pbox[t]=r,s.pbox[t+1]=i;for(let e=0;e<4;e++)for(let t=0;t<256;t+=2)o=R2(s,r,i),r=o.left,i=o.right,s.sbox[e][t]=r,s.sbox[e][t+1]=i}}},encryptBlock:function(t,e){var r=R2(H2,t[e],t[e+1]);t[e]=r.left,t[e+1]=r.right},decryptBlock:function(t,e){var r=function(e,t,r){let i=t,o=r,n;for(let t=F+1;1<t;--t)i^=e.pbox[t],o=C2(e,i)^o,n=i,i=o,o=n;return n=i,i=o,o=n,o^=e.pbox[1],{left:i^=e.pbox[0],right:o}}(H2,t[e],t[e+1]);t[e]=r.left,t[e+1]=r.right},blockSize:2,keySize:4,ivSize:2}),P.Blowfish=w._createHelper(p)}return i});

(function(window,undefined){"use strict";var LIBVERSION="2.0.0-beta.2",EMPTY="",UNKNOWN="?",FUNC_TYPE="function",UNDEF_TYPE="undefined",OBJ_TYPE="object",STR_TYPE="string",MAJOR="major",MODEL="model",NAME="name",TYPE="type",VENDOR="vendor",VERSION="version",ARCHITECTURE="architecture",CONSOLE="console",MOBILE="mobile",TABLET="tablet",SMARTTV="smarttv",WEARABLE="wearable",EMBEDDED="embedded",USER_AGENT="user-agent",UA_MAX_LENGTH=500,BRANDS="brands",FORMFACTOR="formFactor",FULLVERLIST="fullVersionList",PLATFORM="platform",PLATFORMVER="platformVersion",BITNESS="bitness",CH_HEADER="sec-ch-ua",CH_HEADER_FULL_VER_LIST=CH_HEADER+"-full-version-list",CH_HEADER_ARCH=CH_HEADER+"-arch",CH_HEADER_BITNESS=CH_HEADER+"-"+BITNESS,CH_HEADER_FORM_FACTOR=CH_HEADER+"-form-factor",CH_HEADER_MOBILE=CH_HEADER+"-"+MOBILE,CH_HEADER_MODEL=CH_HEADER+"-"+MODEL,CH_HEADER_PLATFORM=CH_HEADER+"-"+PLATFORM,CH_HEADER_PLATFORM_VER=CH_HEADER_PLATFORM+"-version",CH_ALL_VALUES=[BRANDS,FULLVERLIST,MOBILE,MODEL,PLATFORM,PLATFORMVER,ARCHITECTURE,FORMFACTOR,BITNESS],UA_BROWSER="browser",UA_CPU="cpu",UA_DEVICE="device",UA_ENGINE="engine",UA_OS="os",UA_RESULT="result",AMAZON="Amazon",APPLE="Apple",ASUS="ASUS",BLACKBERRY="BlackBerry",GOOGLE="Google",HUAWEI="Huawei",LENOVO="Lenovo",LG="LG",MICROSOFT="Microsoft",MOTOROLA="Motorola",SAMSUNG="Samsung",SHARP="Sharp",SONY="Sony",XIAOMI="Xiaomi",ZEBRA="Zebra",PREFIX_MOBILE="Mobile ",SUFFIX_BROWSER=" Browser",CHROME="Chrome",EDGE="Edge",FIREFOX="Firefox",OPERA="Opera",FACEBOOK="Facebook",SOGOU="Sogou",WINDOWS="Windows";var isWindow=typeof window!==UNDEF_TYPE,NAVIGATOR=isWindow&&window.navigator?window.navigator:undefined,NAVIGATOR_UADATA=NAVIGATOR&&NAVIGATOR.userAgentData?NAVIGATOR.userAgentData:undefined;var extend=function(regexes,extensions){var mergedRegexes={};for(var i in regexes){mergedRegexes[i]=extensions[i]&&extensions[i].length%2===0?extensions[i].concat(regexes[i]):regexes[i]}return mergedRegexes},enumerize=function(arr){var enums={};for(var i=0;i<arr.length;i++){enums[arr[i].toUpperCase()]=arr[i]}return enums},has=function(str1,str2){if(typeof str1===OBJ_TYPE&&str1.length>0){for(var i in str1){if(lowerize(str1[i])==lowerize(str2))return true}return false}return isString(str1)?lowerize(str2).indexOf(lowerize(str1))!==-1:false},isExtensions=function(obj){for(var prop in obj){return/^(browser|cpu|device|engine|os)$/.test(prop)}},isString=function(val){return typeof val===STR_TYPE},itemListToArray=function(header){if(!header)return undefined;var arr=[];var tokens=strip(/\\?\"/g,header).split(",");for(var i=0;i<tokens.length;i++){if(tokens[i].indexOf(";")>-1){var token=trim(tokens[i]).split(";v=");arr[i]={brand:token[0],version:token[1]}}else{arr[i]=trim(tokens[i])}}return arr},lowerize=function(str){return isString(str)?str.toLowerCase():str},majorize=function(version){return isString(version)?strip(/[^\d\.]/g,version).split(".")[0]:undefined},setProps=function(arr){for(var i in arr){var propName=arr[i];if(typeof propName==OBJ_TYPE&&propName.length==2){this[propName[0]]=propName[1]}else{this[propName]=undefined}}return this},strip=function(pattern,str){return isString(str)?str.replace(pattern,EMPTY):str},stripQuotes=function(str){return strip(/\\?\"/g,str)},trim=function(str,len){if(isString(str)){str=strip(/^\s\s*/,str);return typeof len===UNDEF_TYPE?str:str.substring(0,UA_MAX_LENGTH)}};var rgxMapper=function(ua,arrays){if(!ua||!arrays)return;var i=0,j,k,p,q,matches,match;while(i<arrays.length&&!matches){var regex=arrays[i],props=arrays[i+1];j=k=0;while(j<regex.length&&!matches){if(!regex[j]){break}matches=regex[j++].exec(ua);if(!!matches){for(p=0;p<props.length;p++){match=matches[++k];q=props[p];if(typeof q===OBJ_TYPE&&q.length>0){if(q.length===2){if(typeof q[1]==FUNC_TYPE){this[q[0]]=q[1].call(this,match)}else{this[q[0]]=q[1]}}else if(q.length===3){if(typeof q[1]===FUNC_TYPE&&!(q[1].exec&&q[1].test)){this[q[0]]=match?q[1].call(this,match,q[2]):undefined}else{this[q[0]]=match?match.replace(q[1],q[2]):undefined}}else if(q.length===4){this[q[0]]=match?q[3].call(this,match.replace(q[1],q[2])):undefined}}else{this[q]=match?match:undefined}}}}i+=2}},strMapper=function(str,map){for(var i in map){if(typeof map[i]===OBJ_TYPE&&map[i].length>0){for(var j=0;j<map[i].length;j++){if(has(map[i][j],str)){return i===UNKNOWN?undefined:i}}}else if(has(map[i],str)){return i===UNKNOWN?undefined:i}}return map.hasOwnProperty("*")?map["*"]:str};var windowsVersionMap={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},formFactorMap={embedded:"Automotive",mobile:"Mobile",tablet:["Tablet","EInk"],smarttv:"TV",wearable:["VR","XR","Watch"],"?":["Desktop","Unknown"],"*":undefined};var defaultRegexes={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[VERSION,[NAME,PREFIX_MOBILE+"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[VERSION,[NAME,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[NAME,VERSION],[/opios[\/ ]+([\w\.]+)/i],[VERSION,[NAME,OPERA+" Mini"]],[/\bop(?:rg)?x\/([\w\.]+)/i],[VERSION,[NAME,OPERA+" GX"]],[/\bopr\/([\w\.]+)/i],[VERSION,[NAME,OPERA]],[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],[VERSION,[NAME,"Baidu"]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,/(heytap|ovi)browser\/([\d\.]+)/i,/(weibo)__([\d\.]+)/i],[NAME,VERSION],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[VERSION,[NAME,"UCBrowser"]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i,/micromessenger\/([\w\.]+)/i],[VERSION,[NAME,"WeChat"]],[/konqueror\/([\w\.]+)/i],[VERSION,[NAME,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[VERSION,[NAME,"IE"]],[/ya(?:search)?browser\/([\w\.]+)/i],[VERSION,[NAME,"Yandex"]],[/slbrowser\/([\w\.]+)/i],[VERSION,[NAME,"Smart "+LENOVO+SUFFIX_BROWSER]],[/(avast|avg)\/([\w\.]+)/i],[[NAME,/(.+)/,"$1 Secure"+SUFFIX_BROWSER],VERSION],[/\bfocus\/([\w\.]+)/i],[VERSION,[NAME,FIREFOX+" Focus"]],[/\bopt\/([\w\.]+)/i],[VERSION,[NAME,OPERA+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[VERSION,[NAME,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[VERSION,[NAME,"Dolphin"]],[/coast\/([\w\.]+)/i],[VERSION,[NAME,OPERA+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[VERSION,[NAME,"MIUI"+SUFFIX_BROWSER]],[/fxios\/([\w\.-]+)/i],[VERSION,[NAME,PREFIX_MOBILE+FIREFOX]],[/\bqihu|(qi?ho?o?|360)browser/i],[[NAME,"360"+SUFFIX_BROWSER]],[/(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i],[[NAME,/(.+)/,"$1"+SUFFIX_BROWSER],VERSION],[/samsungbrowser\/([\w\.]+)/i],[VERSION,[NAME,SAMSUNG+" Internet"]],[/(comodo_dragon)\/([\w\.]+)/i],[[NAME,/_/g," "],VERSION],[/metasr[\/ ]?([\d\.]+)/i],[VERSION,[NAME,SOGOU+" Explorer"]],[/(sogou)mo\w+\/([\d\.]+)/i],[[NAME,SOGOU+" Mobile"],VERSION],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i],[NAME,VERSION],[/(lbbrowser)/i,/\[(linkedin)app\]/i],[NAME],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[NAME,FACEBOOK],VERSION],[/(Klarna)\/([\w\.]+)/i,/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(alipay)client\/([\w\.]+)/i,/(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i],[NAME,VERSION],[/\bgsa\/([\w\.]+) .*safari\//i],[VERSION,[NAME,"GSA"]],[/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],[VERSION,[NAME,"TikTok"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[VERSION,[NAME,CHROME+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[NAME,CHROME+" WebView"],VERSION],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[VERSION,[NAME,"Android"+SUFFIX_BROWSER]],[/chrome\/([\w\.]+) mobile/i],[VERSION,[NAME,PREFIX_MOBILE+"Chrome"]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[NAME,VERSION],[/version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i],[VERSION,[NAME,PREFIX_MOBILE+"Safari"]],[/iphone .*mobile(?:\/\w+ | ?)safari/i],[[NAME,PREFIX_MOBILE+"Safari"]],[/version\/([\w\.\,]+) .*(safari)/i],[VERSION,NAME],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[NAME,[VERSION,"1"]],[/(webkit|khtml)\/([\w\.]+)/i],[NAME,VERSION],[/(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i],[[NAME,PREFIX_MOBILE+FIREFOX],VERSION],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[NAME,"Netscape"],VERSION],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[VERSION,[NAME,FIREFOX+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i,/panasonic;(viera)/i],[NAME,VERSION],[/(cobalt)\/([\w\.]+)/i],[NAME,[VERSION,/[^\d\.]+./,EMPTY]]],cpu:[[/\b(?:(amd|x|x86[-_]?|wow|win)64)\b/i],[[ARCHITECTURE,"amd64"]],[/(ia32(?=;))/i,/((?:i[346]|x)86)[;\)]/i],[[ARCHITECTURE,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[ARCHITECTURE,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[ARCHITECTURE,"armhf"]],[/windows (ce|mobile); ppc;/i],[[ARCHITECTURE,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[ARCHITECTURE,/ower/,EMPTY,lowerize]],[/(sun4\w)[;\)]/i],[[ARCHITECTURE,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[ARCHITECTURE,lowerize]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[MODEL,[VENDOR,SAMSUNG],[TYPE,TABLET]],[/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[MODEL,[VENDOR,SAMSUNG],[TYPE,MOBILE]],[/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],[MODEL,[VENDOR,APPLE],[TYPE,MOBILE]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[MODEL,[VENDOR,APPLE],[TYPE,TABLET]],[/(macintosh);/i],[MODEL,[VENDOR,APPLE]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[MODEL,[VENDOR,SHARP],[TYPE,MOBILE]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[MODEL,[VENDOR,HUAWEI],[TYPE,TABLET]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[MODEL,[VENDOR,HUAWEI],[TYPE,MOBILE]],[/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[MODEL,/_/g," "],[VENDOR,XIAOMI],[TYPE,MOBILE]],[/oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[MODEL,/_/g," "],[VENDOR,XIAOMI],[TYPE,TABLET]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[MODEL,[VENDOR,"OPPO"],[TYPE,MOBILE]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[MODEL,[VENDOR,"Vivo"],[TYPE,MOBILE]],[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],[MODEL,[VENDOR,"Realme"],[TYPE,MOBILE]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[MODEL,[VENDOR,MOTOROLA],[TYPE,MOBILE]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[MODEL,[VENDOR,MOTOROLA],[TYPE,TABLET]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[MODEL,[VENDOR,LG],[TYPE,TABLET]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[MODEL,[VENDOR,LG],[TYPE,MOBILE]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[MODEL,[VENDOR,LENOVO],[TYPE,TABLET]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[MODEL,/_/g," "],[VENDOR,"Nokia"],[TYPE,MOBILE]],[/(pixel c)\b/i],[MODEL,[VENDOR,GOOGLE],[TYPE,TABLET]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[MODEL,[VENDOR,GOOGLE],[TYPE,MOBILE]],[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[MODEL,[VENDOR,SONY],[TYPE,MOBILE]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[MODEL,"Xperia Tablet"],[VENDOR,SONY],[TYPE,TABLET]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[MODEL,[VENDOR,"OnePlus"],[TYPE,MOBILE]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[MODEL,[VENDOR,AMAZON],[TYPE,TABLET]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[MODEL,/(.+)/g,"Fire Phone $1"],[VENDOR,AMAZON],[TYPE,MOBILE]],[/(playbook);[-\w\),; ]+(rim)/i],[MODEL,VENDOR,[TYPE,TABLET]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[MODEL,[VENDOR,BLACKBERRY],[TYPE,MOBILE]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[MODEL,[VENDOR,ASUS],[TYPE,TABLET]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[MODEL,[VENDOR,ASUS],[TYPE,MOBILE]],[/(nexus 9)/i],[MODEL,[VENDOR,"HTC"],[TYPE,TABLET]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[VENDOR,[MODEL,/_/g," "],[TYPE,MOBILE]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[MODEL,[VENDOR,"Acer"],[TYPE,TABLET]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[MODEL,[VENDOR,"Meizu"],[TYPE,MOBILE]],[/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],[MODEL,[VENDOR,"Ulefone"],[TYPE,MOBILE]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/(kobo)\s(ereader|touch)/i,/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i],[VENDOR,MODEL,[TYPE,TABLET]],[/(surface duo)/i],[MODEL,[VENDOR,MICROSOFT],[TYPE,TABLET]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[MODEL,[VENDOR,"Fairphone"],[TYPE,MOBILE]],[/(shield[\w ]+) b/i],[MODEL,[VENDOR,"Nvidia"],[TYPE,TABLET]],[/(sprint) (\w+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/(kin\.[onetw]{3})/i],[[MODEL,/\./g," "],[VENDOR,MICROSOFT],[TYPE,MOBILE]],[/droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[MODEL,[VENDOR,ZEBRA],[TYPE,TABLET]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[MODEL,[VENDOR,ZEBRA],[TYPE,MOBILE]],[/smart-tv.+(samsung)/i],[VENDOR,[TYPE,SMARTTV]],[/hbbtv.+maple;(\d+)/i],[[MODEL,/^/,"SmartTV"],[VENDOR,SAMSUNG],[TYPE,SMARTTV]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[VENDOR,LG],[TYPE,SMARTTV]],[/(apple) ?tv/i],[VENDOR,[MODEL,APPLE+" TV"],[TYPE,SMARTTV]],[/crkey/i],[[MODEL,CHROME+"cast"],[VENDOR,GOOGLE],[TYPE,SMARTTV]],[/droid.+aft(\w+)( bui|\))/i],[MODEL,[VENDOR,AMAZON],[TYPE,SMARTTV]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[MODEL,[VENDOR,SHARP],[TYPE,SMARTTV]],[/(bravia[\w ]+)( bui|\))/i],[MODEL,[VENDOR,SONY],[TYPE,SMARTTV]],[/(mitv-\w{5}) bui/i],[MODEL,[VENDOR,XIAOMI],[TYPE,SMARTTV]],[/Hbbtv.*(technisat) (.*);/i],[VENDOR,MODEL,[TYPE,SMARTTV]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[VENDOR,trim],[MODEL,trim],[TYPE,SMARTTV]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[TYPE,SMARTTV]],[/(ouya)/i,/(nintendo) (\w+)/i],[VENDOR,MODEL,[TYPE,CONSOLE]],[/droid.+; (shield) bui/i],[MODEL,[VENDOR,"Nvidia"],[TYPE,CONSOLE]],[/(playstation \w+)/i],[MODEL,[VENDOR,SONY],[TYPE,CONSOLE]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[MODEL,[VENDOR,MICROSOFT],[TYPE,CONSOLE]],[/((pebble))app/i],[VENDOR,MODEL,[TYPE,WEARABLE]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[MODEL,[VENDOR,APPLE],[TYPE,WEARABLE]],[/droid.+; (glass) \d/i],[MODEL,[VENDOR,GOOGLE],[TYPE,WEARABLE]],[/droid.+; (wt63?0{2,3})\)/i],[MODEL,[VENDOR,ZEBRA],[TYPE,WEARABLE]],[/(quest( 2| pro)?)/i],[MODEL,[VENDOR,FACEBOOK],[TYPE,WEARABLE]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[VENDOR,[TYPE,EMBEDDED]],[/(aeobc)\b/i],[MODEL,[VENDOR,AMAZON],[TYPE,EMBEDDED]],[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],[MODEL,[TYPE,MOBILE]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[MODEL,[TYPE,TABLET]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[TYPE,TABLET]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[TYPE,MOBILE]],[/(android[-\w\. ]{0,9});.+buil/i],[MODEL,[VENDOR,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[VERSION,[NAME,EDGE+"HTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[VERSION,[NAME,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i,/\b(libweb)/i],[NAME,VERSION],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[VERSION,NAME]],os:[[/microsoft (windows) (vista|xp)/i],[NAME,VERSION],[/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],[NAME,[VERSION,strMapper,windowsVersionMap]],[/windows nt 6\.2; (arm)/i,/windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,/(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[VERSION,strMapper,windowsVersionMap],[NAME,WINDOWS]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,/cfnetwork\/.+darwin/i],[[VERSION,/_/g,"."],[NAME,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[NAME,"macOS"],[VERSION,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[VERSION,NAME],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[NAME,VERSION],[/\(bb(10);/i],[VERSION,[NAME,BLACKBERRY]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[VERSION,[NAME,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[VERSION,[NAME,FIREFOX+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[VERSION,[NAME,"webOS"]],[/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],[VERSION,[NAME,"watchOS"]],[/crkey\/([\d\.]+)/i],[VERSION,[NAME,CHROME+"cast"]],[/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],[[NAME,"Chrome OS"],VERSION],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) (\w+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[NAME,VERSION],[/(sunos) ?([\w\.\d]*)/i],[[NAME,"Solaris"],VERSION],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,/(unix) ?([\w\.]*)/i],[NAME,VERSION]]};var defaultProps=function(){var props={init:{},isIgnore:{},isIgnoreRgx:{},toString:{}};setProps.call(props.init,[[UA_BROWSER,[NAME,VERSION,MAJOR]],[UA_CPU,[ARCHITECTURE]],[UA_DEVICE,[TYPE,MODEL,VENDOR]],[UA_ENGINE,[NAME,VERSION]],[UA_OS,[NAME,VERSION]]]);setProps.call(props.isIgnore,[[UA_BROWSER,[VERSION,MAJOR]],[UA_ENGINE,[VERSION]],[UA_OS,[VERSION]]]);setProps.call(props.isIgnoreRgx,[[UA_BROWSER,/ ?browser$/i],[UA_OS,/ ?os$/i]]);setProps.call(props.toString,[[UA_BROWSER,[NAME,VERSION]],[UA_CPU,[ARCHITECTURE]],[UA_DEVICE,[VENDOR,MODEL]],[UA_ENGINE,[NAME,VERSION]],[UA_OS,[NAME,VERSION]]]);return props}();var createIData=function(item,itemType){var init_props=defaultProps.init[itemType],is_ignoreProps=defaultProps.isIgnore[itemType]||0,is_ignoreRgx=defaultProps.isIgnoreRgx[itemType]||0,toString_props=defaultProps.toString[itemType]||0;function IData(){setProps.call(this,init_props)}IData.prototype.getItem=function(){return item};IData.prototype.withClientHints=function(){if(!NAVIGATOR_UADATA){return item.parseCH().get()}return NAVIGATOR_UADATA.getHighEntropyValues(CH_ALL_VALUES).then(function(res){return item.setCH(new UACHData(res,false)).parseCH().get()})};IData.prototype.withFeatureCheck=function(){return item.detectFeature().get()};if(itemType!=UA_RESULT){IData.prototype.is=function(strToCheck){var is=false;for(var i in this){if(this.hasOwnProperty(i)&&!has(is_ignoreProps,i)&&lowerize(is_ignoreRgx?strip(is_ignoreRgx,this[i]):this[i])==lowerize(is_ignoreRgx?strip(is_ignoreRgx,strToCheck):strToCheck)){is=true;if(strToCheck!=UNDEF_TYPE)break}else if(strToCheck==UNDEF_TYPE&&is){is=!is;break}}return is};IData.prototype.toString=function(){var str=EMPTY;for(var i in toString_props){if(typeof this[toString_props[i]]!==UNDEF_TYPE){str+=(str?" ":EMPTY)+this[toString_props[i]]}}return str||UNDEF_TYPE}}if(!NAVIGATOR_UADATA){IData.prototype.then=function(cb){var that=this;var IDataResolve=function(){for(var prop in that){if(that.hasOwnProperty(prop)){this[prop]=that[prop]}}};IDataResolve.prototype={is:IData.prototype.is,toString:IData.prototype.toString};var resolveData=new IDataResolve;cb(resolveData);return resolveData}}return new IData};function UACHData(uach,isHttpUACH){uach=uach||{};setProps.call(this,CH_ALL_VALUES);if(isHttpUACH){setProps.call(this,[[BRANDS,itemListToArray(uach[CH_HEADER])],[FULLVERLIST,itemListToArray(uach[CH_HEADER_FULL_VER_LIST])],[MOBILE,/\?1/.test(uach[CH_HEADER_MOBILE])],[MODEL,stripQuotes(uach[CH_HEADER_MODEL])],[PLATFORM,stripQuotes(uach[CH_HEADER_PLATFORM])],[PLATFORMVER,stripQuotes(uach[CH_HEADER_PLATFORM_VER])],[ARCHITECTURE,stripQuotes(uach[CH_HEADER_ARCH])],[FORMFACTOR,itemListToArray(uach[CH_HEADER_FORM_FACTOR])],[BITNESS,stripQuotes(uach[CH_HEADER_BITNESS])]])}else{for(var prop in uach){if(this.hasOwnProperty(prop)&&typeof uach[prop]!==UNDEF_TYPE)this[prop]=uach[prop]}}}function UAItem(itemType,ua,rgxMap,uaCH){this.get=function(prop){if(!prop)return this.data;return this.data.hasOwnProperty(prop)?this.data[prop]:undefined};this.set=function(prop,val){this.data[prop]=val;return this};this.setCH=function(ch){this.uaCH=ch;return this};this.detectFeature=function(){if(NAVIGATOR&&NAVIGATOR.userAgent==this.ua){switch(this.itemType){case UA_BROWSER:if(NAVIGATOR.brave&&typeof NAVIGATOR.brave.isBrave==FUNC_TYPE){this.set(NAME,"Brave")}break;case UA_DEVICE:if(!this.get(TYPE)&&NAVIGATOR_UADATA&&NAVIGATOR_UADATA[MOBILE]){this.set(TYPE,MOBILE)}if(this.get(MODEL)=="Macintosh"&&NAVIGATOR&&typeof NAVIGATOR.standalone!==UNDEF_TYPE&&NAVIGATOR.maxTouchPoints&&NAVIGATOR.maxTouchPoints>2){this.set(MODEL,"iPad").set(TYPE,TABLET)}break;case UA_OS:if(!this.get(NAME)&&NAVIGATOR_UADATA&&NAVIGATOR_UADATA[PLATFORM]){this.set(NAME,NAVIGATOR_UADATA[PLATFORM])}break;case UA_RESULT:var data=this.data;var detect=function(itemType){return data[itemType].getItem().detectFeature().get()};this.set(UA_BROWSER,detect(UA_BROWSER)).set(UA_CPU,detect(UA_CPU)).set(UA_DEVICE,detect(UA_DEVICE)).set(UA_ENGINE,detect(UA_ENGINE)).set(UA_OS,detect(UA_OS))}}return this};this.parseUA=function(){if(this.itemType!=UA_RESULT){rgxMapper.call(this.data,this.ua,this.rgxMap)}if(this.itemType==UA_BROWSER){this.set(MAJOR,majorize(this.get(VERSION)))}return this};this.parseCH=function(){var uaCH=this.uaCH,rgxMap=this.rgxMap;switch(this.itemType){case UA_BROWSER:var brands=uaCH[FULLVERLIST]||uaCH[BRANDS],prevName;if(brands){for(var i in brands){var brandName=strip(/(Google|Microsoft) /,brands[i].brand||brands[i]),brandVersion=brands[i].version;if(!/not.a.brand/i.test(brandName)&&(!prevName||/chrom/i.test(prevName)&&!/chromi/i.test(brandName))){this.set(NAME,brandName).set(VERSION,brandVersion).set(MAJOR,majorize(brandVersion));prevName=brandName}}}break;case UA_CPU:var archName=uaCH[ARCHITECTURE];if(archName){if(archName&&uaCH[BITNESS]=="64")archName+="64";rgxMapper.call(this.data,archName+";",rgxMap)}break;case UA_DEVICE:if(uaCH[MOBILE]){this.set(TYPE,MOBILE)}if(uaCH[MODEL]){this.set(MODEL,uaCH[MODEL])}if(uaCH[MODEL]=="Xbox"){this.set(TYPE,CONSOLE).set(VENDOR,MICROSOFT)}if(uaCH[FORMFACTOR]){var ff;if(typeof uaCH[FORMFACTOR]!=="string"){var idx=0;while(!ff&&idx<uaCH[FORMFACTOR].length){ff=strMapper(uaCH[FORMFACTOR][idx++],formFactorMap)}}else{ff=strMapper(uaCH[FORMFACTOR],formFactorMap)}this.set(TYPE,ff)}break;case UA_OS:var osName=uaCH[PLATFORM];if(osName){var osVersion=uaCH[PLATFORMVER];if(osName==WINDOWS)osVersion=parseInt(majorize(osVersion),10)>=13?"11":"10";this.set(NAME,osName).set(VERSION,osVersion)}if(this.get(NAME)==WINDOWS&&uaCH[MODEL]=="Xbox"){this.set(NAME,"Xbox").set(VERSION,undefined)}break;case UA_RESULT:var data=this.data;var parse=function(itemType){return data[itemType].getItem().setCH(uaCH).parseCH().get()};this.set(UA_BROWSER,parse(UA_BROWSER)).set(UA_CPU,parse(UA_CPU)).set(UA_DEVICE,parse(UA_DEVICE)).set(UA_ENGINE,parse(UA_ENGINE)).set(UA_OS,parse(UA_OS))}return this};setProps.call(this,[["itemType",itemType],["ua",ua],["uaCH",uaCH],["rgxMap",rgxMap],["data",createIData(this,itemType)]]);return this}function UAParser(ua,extensions,headers){if(typeof ua===OBJ_TYPE){if(isExtensions(ua)){if(typeof extensions===OBJ_TYPE){headers=extensions}extensions=ua}else{headers=ua;extensions=undefined}ua=undefined}else if(typeof ua===STR_TYPE&&!isExtensions(extensions)){headers=extensions;extensions=undefined}if(!(this instanceof UAParser)){return new UAParser(ua,extensions,headers).getResult()}var userAgent=typeof ua===STR_TYPE?ua:NAVIGATOR&&NAVIGATOR.userAgent?NAVIGATOR.userAgent:headers&&headers[USER_AGENT]?headers[USER_AGENT]:EMPTY,httpUACH=new UACHData(headers,true),regexMap=extensions?extend(defaultRegexes,extensions):defaultRegexes,createItemFunc=function(itemType){if(itemType==UA_RESULT){return function(){return new UAItem(itemType,userAgent,regexMap,httpUACH).set("ua",userAgent).set(UA_BROWSER,this.getBrowser()).set(UA_CPU,this.getCPU()).set(UA_DEVICE,this.getDevice()).set(UA_ENGINE,this.getEngine()).set(UA_OS,this.getOS()).get()}}else{return function(){return new UAItem(itemType,userAgent,regexMap[itemType],httpUACH).parseUA().get()}}};setProps.call(this,[["getBrowser",createItemFunc(UA_BROWSER)],["getCPU",createItemFunc(UA_CPU)],["getDevice",createItemFunc(UA_DEVICE)],["getEngine",createItemFunc(UA_ENGINE)],["getOS",createItemFunc(UA_OS)],["getResult",createItemFunc(UA_RESULT)],["getUA",function(){return userAgent}],["setUA",function(ua){if(isString(ua))userAgent=ua.length>UA_MAX_LENGTH?trim(ua,UA_MAX_LENGTH):ua;return this}]]).setUA(userAgent);return this}UAParser.VERSION=LIBVERSION;UAParser.BROWSER=enumerize([NAME,VERSION,MAJOR]);UAParser.CPU=enumerize([ARCHITECTURE]);UAParser.DEVICE=enumerize([MODEL,VENDOR,TYPE,CONSOLE,MOBILE,SMARTTV,TABLET,WEARABLE,EMBEDDED]);UAParser.ENGINE=UAParser.OS=enumerize([NAME,VERSION]);if(typeof exports!==UNDEF_TYPE){if(typeof module!==UNDEF_TYPE&&module.exports){exports=module.exports=UAParser}exports.UAParser=UAParser}else{if(typeof define===FUNC_TYPE&&define.amd){define(function(){return UAParser})}else if(isWindow){window.UAParser=UAParser}}var $=isWindow&&(window.jQuery||window.Zepto);if($&&!$.ua){var parser=new UAParser;$.ua=parser.getResult();$.ua.get=function(){return parser.getUA()};$.ua.set=function(ua){parser.setUA(ua);var result=parser.getResult();for(var prop in result){$.ua[prop]=result[prop]}}}})(typeof window==="object"?window:this);

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
