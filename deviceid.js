var CryptoJS =
  CryptoJS ||
  (function (Math, undefined) {
    /*
     * Local polyfil of Object.create
     */
    var create =
      Object.create ||
      (function () {
        function F() {}

        return function (obj) {
          var subtype;

          F.prototype = obj;

          subtype = new F();

          F.prototype = null;

          return subtype;
        };
      })();

    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = (C.lib = {});

    /**
     * Base object for prototypal inheritance.
     */
    var Base = (C_lib.Base = (function () {
      return {
        /**
         * Creates a new object that inherits from this object.
         *
         * @param {Object} overrides Properties to copy into the new object.
         *
         * @return {Object} The new object.
         *
         * @static
         *
         * @example
         *
         *     var MyType = CryptoJS.lib.Base.extend({
         *         field: 'value',
         *
         *         method: function () {
         *         }
         *     });
         */
        extend: function (overrides) {
          // Spawn
          var subtype = create(this);

          // Augment
          if (overrides) {
            subtype.mixIn(overrides);
          }

          // Create default initializer
          if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
            subtype.init = function () {
              subtype.$super.init.apply(this, arguments);
            };
          }

          // Initializer's prototype is the subtype object
          subtype.init.prototype = subtype;

          // Reference supertype
          subtype.$super = this;

          return subtype;
        },

        /**
         * Extends this object and runs the init method.
         * Arguments to create() will be passed to init().
         *
         * @return {Object} The new object.
         *
         * @static
         *
         * @example
         *
         *     var instance = MyType.create();
         */
        create: function () {
          var instance = this.extend();
          instance.init.apply(instance, arguments);

          return instance;
        },

        /**
         * Initializes a newly created object.
         * Override this method to add some logic when your objects are created.
         *
         * @example
         *
         *     var MyType = CryptoJS.lib.Base.extend({
         *         init: function () {
         *             // ...
         *         }
         *     });
         */
        init: function () {},

        /**
         * Copies properties into this object.
         *
         * @param {Object} properties The properties to mix in.
         *
         * @example
         *
         *     MyType.mixIn({
         *         field: 'value'
         *     });
         */
        mixIn: function (properties) {
          for (var propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
              this[propertyName] = properties[propertyName];
            }
          }

          // IE won't copy toString using the loop above
          if (properties.hasOwnProperty("toString")) {
            this.toString = properties.toString;
          }
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = instance.clone();
         */
        clone: function () {
          return this.init.prototype.extend(this);
        },
      };
    })());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = (C_lib.WordArray = Base.extend({
      /**
       * Initializes a newly created word array.
       *
       * @param {Array} words (Optional) An array of 32-bit words.
       * @param {number} sigBytes (Optional) The number of significant bytes in the words.
       *
       * @example
       *
       *     var wordArray = CryptoJS.lib.WordArray.create();
       *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
       *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
       */
      init: function (words, sigBytes) {
        words = this.words = words || [];

        if (sigBytes != undefined) {
          this.sigBytes = sigBytes;
        } else {
          this.sigBytes = words.length * 4;
        }
      },

      /**
       * Converts this word array to a string.
       *
       * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
       *
       * @return {string} The stringified word array.
       *
       * @example
       *
       *     var string = wordArray + '';
       *     var string = wordArray.toString();
       *     var string = wordArray.toString(CryptoJS.enc.Utf8);
       */
      toString: function (encoder) {
        return (encoder || Hex).stringify(this);
      },

      /**
       * Concatenates a word array to this word array.
       *
       * @param {WordArray} wordArray The word array to append.
       *
       * @return {WordArray} This word array.
       *
       * @example
       *
       *     wordArray1.concat(wordArray2);
       */
      concat: function (wordArray) {
        // Shortcuts
        var thisWords = this.words;
        var thatWords = wordArray.words;
        var thisSigBytes = this.sigBytes;
        var thatSigBytes = wordArray.sigBytes;

        // Clamp excess bits
        this.clamp();

        // Concat
        if (thisSigBytes % 4) {
          // Copy one byte at a time
          for (var i = 0; i < thatSigBytes; i++) {
            var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            thisWords[(thisSigBytes + i) >>> 2] |=
              thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
          }
        } else {
          // Copy one word at a time
          for (var i = 0; i < thatSigBytes; i += 4) {
            thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
          }
        }
        this.sigBytes += thatSigBytes;

        // Chainable
        return this;
      },

      /**
       * Removes insignificant bits.
       *
       * @example
       *
       *     wordArray.clamp();
       */
      clamp: function () {
        // Shortcuts
        var words = this.words;
        var sigBytes = this.sigBytes;

        // Clamp
        words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
        words.length = Math.ceil(sigBytes / 4);
      },

      /**
       * Creates a copy of this word array.
       *
       * @return {WordArray} The clone.
       *
       * @example
       *
       *     var clone = wordArray.clone();
       */
      clone: function () {
        var clone = Base.clone.call(this);
        clone.words = this.words.slice(0);

        return clone;
      },

      /**
       * Creates a word array filled with random bytes.
       *
       * @param {number} nBytes The number of random bytes to generate.
       *
       * @return {WordArray} The random word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.lib.WordArray.random(16);
       */
      random: function (nBytes) {
        var words = [];

        var r = function (m_w) {
          var m_w = m_w;
          var m_z = 0x3ade68b1;
          var mask = 0xffffffff;

          return function () {
            m_z = (0x9069 * (m_z & 0xffff) + (m_z >> 0x10)) & mask;
            m_w = (0x4650 * (m_w & 0xffff) + (m_w >> 0x10)) & mask;
            var result = ((m_z << 0x10) + m_w) & mask;
            result /= 0x100000000;
            result += 0.5;
            return result * (Math.random() > 0.5 ? 1 : -1);
          };
        };

        for (var i = 0, rcache; i < nBytes; i += 4) {
          var _r = r((rcache || Math.random()) * 0x100000000);

          rcache = _r() * 0x3ade67b7;
          words.push((_r() * 0x100000000) | 0);
        }

        return new WordArray.init(words, nBytes);
      },
    }));

    /**
     * Encoder namespace.
     */
    var C_enc = (C.enc = {});

    /**
     * Hex encoding strategy.
     */
    var Hex = (C_enc.Hex = {
      /**
       * Converts a word array to a hex string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The hex string.
       *
       * @static
       *
       * @example
       *
       *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
       */
      stringify: function (wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;

        // Convert
        var hexChars = [];
        for (var i = 0; i < sigBytes; i++) {
          var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          hexChars.push((bite >>> 4).toString(16));
          hexChars.push((bite & 0x0f).toString(16));
        }

        return hexChars.join("");
      },

      /**
       * Converts a hex string to a word array.
       *
       * @param {string} hexStr The hex string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
       */
      parse: function (hexStr) {
        // Shortcut
        var hexStrLength = hexStr.length;

        // Convert
        var words = [];
        for (var i = 0; i < hexStrLength; i += 2) {
          words[i >>> 3] |=
            parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }

        return new WordArray.init(words, hexStrLength / 2);
      },
    });

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = (C_enc.Latin1 = {
      /**
       * Converts a word array to a Latin1 string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The Latin1 string.
       *
       * @static
       *
       * @example
       *
       *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
       */
      stringify: function (wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;

        // Convert
        var latin1Chars = [];
        for (var i = 0; i < sigBytes; i++) {
          var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          latin1Chars.push(String.fromCharCode(bite));
        }

        return latin1Chars.join("");
      },

      /**
       * Converts a Latin1 string to a word array.
       *
       * @param {string} latin1Str The Latin1 string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
       */
      parse: function (latin1Str) {
        // Shortcut
        var latin1StrLength = latin1Str.length;

        // Convert
        var words = [];
        for (var i = 0; i < latin1StrLength; i++) {
          words[i >>> 2] |=
            (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
        }

        return new WordArray.init(words, latin1StrLength);
      },
    });

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = (C_enc.Utf8 = {
      /**
       * Converts a word array to a UTF-8 string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The UTF-8 string.
       *
       * @static
       *
       * @example
       *
       *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
       */
      stringify: function (wordArray) {
        try {
          return decodeURIComponent(escape(Latin1.stringify(wordArray)));
        } catch (e) {
          throw new Error("Malformed UTF-8 data");
        }
      },

      /**
       * Converts a UTF-8 string to a word array.
       *
       * @param {string} utf8Str The UTF-8 string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
       */
      parse: function (utf8Str) {
        return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
      },
    });

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = (C_lib.BufferedBlockAlgorithm = Base.extend({
      /**
       * Resets this block algorithm's data buffer to its initial state.
       *
       * @example
       *
       *     bufferedBlockAlgorithm.reset();
       */
      reset: function () {
        // Initial values
        this._data = new WordArray.init();
        this._nDataBytes = 0;
      },

      /**
       * Adds new data to this block algorithm's buffer.
       *
       * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
       *
       * @example
       *
       *     bufferedBlockAlgorithm._append('data');
       *     bufferedBlockAlgorithm._append(wordArray);
       */
      _append: function (data) {
        // Convert string to WordArray, else assume WordArray already
        if (typeof data == "string") {
          data = Utf8.parse(data);
        }

        // Append
        this._data.concat(data);
        this._nDataBytes += data.sigBytes;
      },

      /**
       * Processes available data blocks.
       *
       * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
       *
       * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
       *
       * @return {WordArray} The processed data.
       *
       * @example
       *
       *     var processedData = bufferedBlockAlgorithm._process();
       *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
       */
      _process: function (doFlush) {
        // Shortcuts
        var data = this._data;
        var dataWords = data.words;
        var dataSigBytes = data.sigBytes;
        var blockSize = this.blockSize;
        var blockSizeBytes = blockSize * 4;

        // Count blocks ready
        var nBlocksReady = dataSigBytes / blockSizeBytes;
        if (doFlush) {
          // Round up to include partial blocks
          nBlocksReady = Math.ceil(nBlocksReady);
        } else {
          // Round down to include only full blocks,
          // less the number of blocks that must remain in the buffer
          nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
        }

        // Count words ready
        var nWordsReady = nBlocksReady * blockSize;

        // Count bytes ready
        var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

        // Process blocks
        if (nWordsReady) {
          for (var offset = 0; offset < nWordsReady; offset += blockSize) {
            // Perform concrete-algorithm logic
            this._doProcessBlock(dataWords, offset);
          }

          // Remove processed words
          var processedWords = dataWords.splice(0, nWordsReady);
          data.sigBytes -= nBytesReady;
        }

        // Return processed words
        return new WordArray.init(processedWords, nBytesReady);
      },

      /**
       * Creates a copy of this object.
       *
       * @return {Object} The clone.
       *
       * @example
       *
       *     var clone = bufferedBlockAlgorithm.clone();
       */
      clone: function () {
        var clone = Base.clone.call(this);
        clone._data = this._data.clone();

        return clone;
      },

      _minBufferSize: 0,
    }));

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = (C_lib.Hasher = BufferedBlockAlgorithm.extend({
      /**
       * Configuration options.
       */
      cfg: Base.extend(),

      /**
       * Initializes a newly created hasher.
       *
       * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
       *
       * @example
       *
       *     var hasher = CryptoJS.algo.SHA256.create();
       */
      init: function (cfg) {
        // Apply config defaults
        this.cfg = this.cfg.extend(cfg);

        // Set initial values
        this.reset();
      },

      /**
       * Resets this hasher to its initial state.
       *
       * @example
       *
       *     hasher.reset();
       */
      reset: function () {
        // Reset data buffer
        BufferedBlockAlgorithm.reset.call(this);

        // Perform concrete-hasher logic
        this._doReset();
      },

      /**
       * Updates this hasher with a message.
       *
       * @param {WordArray|string} messageUpdate The message to append.
       *
       * @return {Hasher} This hasher.
       *
       * @example
       *
       *     hasher.update('message');
       *     hasher.update(wordArray);
       */
      update: function (messageUpdate) {
        // Append
        this._append(messageUpdate);

        // Update the hash
        this._process();

        // Chainable
        return this;
      },

      /**
       * Finalizes the hash computation.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} messageUpdate (Optional) A final message update.
       *
       * @return {WordArray} The hash.
       *
       * @example
       *
       *     var hash = hasher.finalize();
       *     var hash = hasher.finalize('message');
       *     var hash = hasher.finalize(wordArray);
       */
      finalize: function (messageUpdate) {
        // Final message update
        if (messageUpdate) {
          this._append(messageUpdate);
        }

        // Perform concrete-hasher logic
        var hash = this._doFinalize();

        return hash;
      },

      blockSize: 512 / 32,

      /**
       * Creates a shortcut function to a hasher's object interface.
       *
       * @param {Hasher} hasher The hasher to create a helper for.
       *
       * @return {Function} The shortcut function.
       *
       * @static
       *
       * @example
       *
       *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
       */
      _createHelper: function (hasher) {
        return function (message, cfg) {
          return new hasher.init(cfg).finalize(message);
        };
      },

      /**
       * Creates a shortcut function to the HMAC's object interface.
       *
       * @param {Hasher} hasher The hasher to use in this HMAC helper.
       *
       * @return {Function} The shortcut function.
       *
       * @static
       *
       * @example
       *
       *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
       */
      _createHmacHelper: function (hasher) {
        return function (message, key) {
          return new C_algo.HMAC.init(hasher, key).finalize(message);
        };
      },
    }));

    /**
     * Algorithm namespace.
     */
    var C_algo = (C.algo = {});

    return C;
  })(Math);

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var C_enc = C.enc;

  /**
   * Base64 encoding strategy.
   */
  var Base64 = (C_enc.Base64 = {
    /**
     * Converts a word array to a Base64 string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The Base64 string.
     *
     * @static
     *
     * @example
     *
     *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
     */
    stringify: function (wordArray) {
      // Shortcuts
      var words = wordArray.words;
      var sigBytes = wordArray.sigBytes;
      var map = this._map;

      // Clamp excess bits
      wordArray.clamp();

      // Convert
      var base64Chars = [];
      for (var i = 0; i < sigBytes; i += 3) {
        var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
        var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

        var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

        for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
          base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
        }
      }

      // Add padding
      var paddingChar = map.charAt(64);
      if (paddingChar) {
        while (base64Chars.length % 4) {
          base64Chars.push(paddingChar);
        }
      }

      return base64Chars.join("");
    },

    /**
     * Converts a Base64 string to a word array.
     *
     * @param {string} base64Str The Base64 string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
     */
    parse: function (base64Str) {
      // Shortcuts
      var base64StrLength = base64Str.length;
      var map = this._map;
      var reverseMap = this._reverseMap;

      if (!reverseMap) {
        reverseMap = this._reverseMap = [];
        for (var j = 0; j < map.length; j++) {
          reverseMap[map.charCodeAt(j)] = j;
        }
      }

      // Ignore padding
      var paddingChar = map.charAt(64);
      if (paddingChar) {
        var paddingIndex = base64Str.indexOf(paddingChar);
        if (paddingIndex !== -1) {
          base64StrLength = paddingIndex;
        }
      }

      // Convert
      return parseLoop(base64Str, base64StrLength, reverseMap);
    },

    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  });

  function parseLoop(base64Str, base64StrLength, reverseMap) {
    var words = [];
    var nBytes = 0;
    for (var i = 0; i < base64StrLength; i++) {
      if (i % 4) {
        var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
        var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
        words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
        nBytes++;
      }
    }
    return WordArray.create(words, nBytes);
  }
})();

(function (Math) {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_algo = C.algo;

  // Constants table
  var T = [];

  // Compute constants
  (function () {
    for (var i = 0; i < 64; i++) {
      T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
    }
  })();

  /**
   * MD5 hash algorithm.
   */
  var MD5 = (C_algo.MD5 = Hasher.extend({
    _doReset: function () {
      this._hash = new WordArray.init([
        0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476,
      ]);
    },

    _doProcessBlock: function (M, offset) {
      // Swap endian
      for (var i = 0; i < 16; i++) {
        // Shortcuts
        var offset_i = offset + i;
        var M_offset_i = M[offset_i];

        M[offset_i] =
          (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
          (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00);
      }

      // Shortcuts
      var H = this._hash.words;

      var M_offset_0 = M[offset + 0];
      var M_offset_1 = M[offset + 1];
      var M_offset_2 = M[offset + 2];
      var M_offset_3 = M[offset + 3];
      var M_offset_4 = M[offset + 4];
      var M_offset_5 = M[offset + 5];
      var M_offset_6 = M[offset + 6];
      var M_offset_7 = M[offset + 7];
      var M_offset_8 = M[offset + 8];
      var M_offset_9 = M[offset + 9];
      var M_offset_10 = M[offset + 10];
      var M_offset_11 = M[offset + 11];
      var M_offset_12 = M[offset + 12];
      var M_offset_13 = M[offset + 13];
      var M_offset_14 = M[offset + 14];
      var M_offset_15 = M[offset + 15];

      // Working varialbes
      var a = H[0];
      var b = H[1];
      var c = H[2];
      var d = H[3];

      // Computation
      a = FF(a, b, c, d, M_offset_0, 7, T[0]);
      d = FF(d, a, b, c, M_offset_1, 12, T[1]);
      c = FF(c, d, a, b, M_offset_2, 17, T[2]);
      b = FF(b, c, d, a, M_offset_3, 22, T[3]);
      a = FF(a, b, c, d, M_offset_4, 7, T[4]);
      d = FF(d, a, b, c, M_offset_5, 12, T[5]);
      c = FF(c, d, a, b, M_offset_6, 17, T[6]);
      b = FF(b, c, d, a, M_offset_7, 22, T[7]);
      a = FF(a, b, c, d, M_offset_8, 7, T[8]);
      d = FF(d, a, b, c, M_offset_9, 12, T[9]);
      c = FF(c, d, a, b, M_offset_10, 17, T[10]);
      b = FF(b, c, d, a, M_offset_11, 22, T[11]);
      a = FF(a, b, c, d, M_offset_12, 7, T[12]);
      d = FF(d, a, b, c, M_offset_13, 12, T[13]);
      c = FF(c, d, a, b, M_offset_14, 17, T[14]);
      b = FF(b, c, d, a, M_offset_15, 22, T[15]);

      a = GG(a, b, c, d, M_offset_1, 5, T[16]);
      d = GG(d, a, b, c, M_offset_6, 9, T[17]);
      c = GG(c, d, a, b, M_offset_11, 14, T[18]);
      b = GG(b, c, d, a, M_offset_0, 20, T[19]);
      a = GG(a, b, c, d, M_offset_5, 5, T[20]);
      d = GG(d, a, b, c, M_offset_10, 9, T[21]);
      c = GG(c, d, a, b, M_offset_15, 14, T[22]);
      b = GG(b, c, d, a, M_offset_4, 20, T[23]);
      a = GG(a, b, c, d, M_offset_9, 5, T[24]);
      d = GG(d, a, b, c, M_offset_14, 9, T[25]);
      c = GG(c, d, a, b, M_offset_3, 14, T[26]);
      b = GG(b, c, d, a, M_offset_8, 20, T[27]);
      a = GG(a, b, c, d, M_offset_13, 5, T[28]);
      d = GG(d, a, b, c, M_offset_2, 9, T[29]);
      c = GG(c, d, a, b, M_offset_7, 14, T[30]);
      b = GG(b, c, d, a, M_offset_12, 20, T[31]);

      a = HH(a, b, c, d, M_offset_5, 4, T[32]);
      d = HH(d, a, b, c, M_offset_8, 11, T[33]);
      c = HH(c, d, a, b, M_offset_11, 16, T[34]);
      b = HH(b, c, d, a, M_offset_14, 23, T[35]);
      a = HH(a, b, c, d, M_offset_1, 4, T[36]);
      d = HH(d, a, b, c, M_offset_4, 11, T[37]);
      c = HH(c, d, a, b, M_offset_7, 16, T[38]);
      b = HH(b, c, d, a, M_offset_10, 23, T[39]);
      a = HH(a, b, c, d, M_offset_13, 4, T[40]);
      d = HH(d, a, b, c, M_offset_0, 11, T[41]);
      c = HH(c, d, a, b, M_offset_3, 16, T[42]);
      b = HH(b, c, d, a, M_offset_6, 23, T[43]);
      a = HH(a, b, c, d, M_offset_9, 4, T[44]);
      d = HH(d, a, b, c, M_offset_12, 11, T[45]);
      c = HH(c, d, a, b, M_offset_15, 16, T[46]);
      b = HH(b, c, d, a, M_offset_2, 23, T[47]);

      a = II(a, b, c, d, M_offset_0, 6, T[48]);
      d = II(d, a, b, c, M_offset_7, 10, T[49]);
      c = II(c, d, a, b, M_offset_14, 15, T[50]);
      b = II(b, c, d, a, M_offset_5, 21, T[51]);
      a = II(a, b, c, d, M_offset_12, 6, T[52]);
      d = II(d, a, b, c, M_offset_3, 10, T[53]);
      c = II(c, d, a, b, M_offset_10, 15, T[54]);
      b = II(b, c, d, a, M_offset_1, 21, T[55]);
      a = II(a, b, c, d, M_offset_8, 6, T[56]);
      d = II(d, a, b, c, M_offset_15, 10, T[57]);
      c = II(c, d, a, b, M_offset_6, 15, T[58]);
      b = II(b, c, d, a, M_offset_13, 21, T[59]);
      a = II(a, b, c, d, M_offset_4, 6, T[60]);
      d = II(d, a, b, c, M_offset_11, 10, T[61]);
      c = II(c, d, a, b, M_offset_2, 15, T[62]);
      b = II(b, c, d, a, M_offset_9, 21, T[63]);

      // Intermediate hash value
      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
    },

    _doFinalize: function () {
      // Shortcuts
      var data = this._data;
      var dataWords = data.words;

      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;

      // Add padding
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));

      var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
      var nBitsTotalL = nBitsTotal;
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] =
        (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
        (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00);
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
        (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
        (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00);

      data.sigBytes = (dataWords.length + 1) * 4;

      // Hash final blocks
      this._process();

      // Shortcuts
      var hash = this._hash;
      var H = hash.words;

      // Swap endian
      for (var i = 0; i < 4; i++) {
        // Shortcut
        var H_i = H[i];

        H[i] =
          (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
          (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
      }

      // Return final computed hash
      return hash;
    },

    clone: function () {
      var clone = Hasher.clone.call(this);
      clone._hash = this._hash.clone();

      return clone;
    },
  }));

  function FF(a, b, c, d, x, s, t) {
    var n = a + ((b & c) | (~b & d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  }

  function GG(a, b, c, d, x, s, t) {
    var n = a + ((b & d) | (c & ~d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  }

  function HH(a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  }

  function II(a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  }

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.MD5('message');
   *     var hash = CryptoJS.MD5(wordArray);
   */
  C.MD5 = Hasher._createHelper(MD5);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacMD5(message, key);
   */
  C.HmacMD5 = Hasher._createHmacHelper(MD5);
})(Math);

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_algo = C.algo;

  // Reusable object
  var W = [];

  /**
   * SHA-1 hash algorithm.
   */
  var SHA1 = (C_algo.SHA1 = Hasher.extend({
    _doReset: function () {
      this._hash = new WordArray.init([
        0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
      ]);
    },

    _doProcessBlock: function (M, offset) {
      // Shortcut
      var H = this._hash.words;

      // Working variables
      var a = H[0];
      var b = H[1];
      var c = H[2];
      var d = H[3];
      var e = H[4];

      // Computation
      for (var i = 0; i < 80; i++) {
        if (i < 16) {
          W[i] = M[offset + i] | 0;
        } else {
          var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
          W[i] = (n << 1) | (n >>> 31);
        }

        var t = ((a << 5) | (a >>> 27)) + e + W[i];
        if (i < 20) {
          t += ((b & c) | (~b & d)) + 0x5a827999;
        } else if (i < 40) {
          t += (b ^ c ^ d) + 0x6ed9eba1;
        } else if (i < 60) {
          t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
        } /* if (i < 80) */ else {
          t += (b ^ c ^ d) - 0x359d3e2a;
        }

        e = d;
        d = c;
        c = (b << 30) | (b >>> 2);
        b = a;
        a = t;
      }

      // Intermediate hash value
      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
    },

    _doFinalize: function () {
      // Shortcuts
      var data = this._data;
      var dataWords = data.words;

      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;

      // Add padding
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
        nBitsTotal / 0x100000000,
      );
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
      data.sigBytes = dataWords.length * 4;

      // Hash final blocks
      this._process();

      // Return final computed hash
      return this._hash;
    },

    clone: function () {
      var clone = Hasher.clone.call(this);
      clone._hash = this._hash.clone();

      return clone;
    },
  }));

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.SHA1('message');
   *     var hash = CryptoJS.SHA1(wordArray);
   */
  C.SHA1 = Hasher._createHelper(SHA1);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacSHA1(message, key);
   */
  C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
})();

(function (Math) {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_algo = C.algo;

  // Initialization and round constants tables
  var H = [];
  var K = [];

  // Compute constants
  (function () {
    function isPrime(n) {
      var sqrtN = Math.sqrt(n);
      for (var factor = 2; factor <= sqrtN; factor++) {
        if (!(n % factor)) {
          return false;
        }
      }

      return true;
    }

    function getFractionalBits(n) {
      return ((n - (n | 0)) * 0x100000000) | 0;
    }

    var n = 2;
    var nPrime = 0;
    while (nPrime < 64) {
      if (isPrime(n)) {
        if (nPrime < 8) {
          H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
        }
        K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

        nPrime++;
      }

      n++;
    }
  })();

  // Reusable object
  var W = [];

  /**
   * SHA-256 hash algorithm.
   */
  var SHA256 = (C_algo.SHA256 = Hasher.extend({
    _doReset: function () {
      this._hash = new WordArray.init(H.slice(0));
    },

    _doProcessBlock: function (M, offset) {
      // Shortcut
      var H = this._hash.words;

      // Working variables
      var a = H[0];
      var b = H[1];
      var c = H[2];
      var d = H[3];
      var e = H[4];
      var f = H[5];
      var g = H[6];
      var h = H[7];

      // Computation
      for (var i = 0; i < 64; i++) {
        if (i < 16) {
          W[i] = M[offset + i] | 0;
        } else {
          var gamma0x = W[i - 15];
          var gamma0 =
            ((gamma0x << 25) | (gamma0x >>> 7)) ^
            ((gamma0x << 14) | (gamma0x >>> 18)) ^
            (gamma0x >>> 3);

          var gamma1x = W[i - 2];
          var gamma1 =
            ((gamma1x << 15) | (gamma1x >>> 17)) ^
            ((gamma1x << 13) | (gamma1x >>> 19)) ^
            (gamma1x >>> 10);

          W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
        }

        var ch = (e & f) ^ (~e & g);
        var maj = (a & b) ^ (a & c) ^ (b & c);

        var sigma0 =
          ((a << 30) | (a >>> 2)) ^
          ((a << 19) | (a >>> 13)) ^
          ((a << 10) | (a >>> 22));
        var sigma1 =
          ((e << 26) | (e >>> 6)) ^
          ((e << 21) | (e >>> 11)) ^
          ((e << 7) | (e >>> 25));

        var t1 = h + sigma1 + ch + K[i] + W[i];
        var t2 = sigma0 + maj;

        h = g;
        g = f;
        f = e;
        e = (d + t1) | 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) | 0;
      }

      // Intermediate hash value
      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    },

    _doFinalize: function () {
      // Shortcuts
      var data = this._data;
      var dataWords = data.words;

      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;

      // Add padding
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
        nBitsTotal / 0x100000000,
      );
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
      data.sigBytes = dataWords.length * 4;

      // Hash final blocks
      this._process();

      // Return final computed hash
      return this._hash;
    },

    clone: function () {
      var clone = Hasher.clone.call(this);
      clone._hash = this._hash.clone();

      return clone;
    },
  }));

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.SHA256('message');
   *     var hash = CryptoJS.SHA256(wordArray);
   */
  C.SHA256 = Hasher._createHelper(SHA256);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacSHA256(message, key);
   */
  C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
})(Math);

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var C_enc = C.enc;

  /**
   * UTF-16 BE encoding strategy.
   */
  var Utf16BE =
    (C_enc.Utf16 =
    C_enc.Utf16BE =
      {
        /**
         * Converts a word array to a UTF-16 BE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 BE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Convert
          var utf16Chars = [];
          for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
            utf16Chars.push(String.fromCharCode(codePoint));
          }

          return utf16Chars.join("");
        },

        /**
         * Converts a UTF-16 BE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 BE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
         */
        parse: function (utf16Str) {
          // Shortcut
          var utf16StrLength = utf16Str.length;

          // Convert
          var words = [];
          for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
          }

          return WordArray.create(words, utf16StrLength * 2);
        },
      });

  /**
   * UTF-16 LE encoding strategy.
   */
  C_enc.Utf16LE = {
    /**
     * Converts a word array to a UTF-16 LE string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The UTF-16 LE string.
     *
     * @static
     *
     * @example
     *
     *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
     */
    stringify: function (wordArray) {
      // Shortcuts
      var words = wordArray.words;
      var sigBytes = wordArray.sigBytes;

      // Convert
      var utf16Chars = [];
      for (var i = 0; i < sigBytes; i += 2) {
        var codePoint = swapEndian(
          (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff,
        );
        utf16Chars.push(String.fromCharCode(codePoint));
      }

      return utf16Chars.join("");
    },

    /**
     * Converts a UTF-16 LE string to a word array.
     *
     * @param {string} utf16Str The UTF-16 LE string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
     */
    parse: function (utf16Str) {
      // Shortcut
      var utf16StrLength = utf16Str.length;

      // Convert
      var words = [];
      for (var i = 0; i < utf16StrLength; i++) {
        words[i >>> 1] |= swapEndian(
          utf16Str.charCodeAt(i) << (16 - (i % 2) * 16),
        );
      }

      return WordArray.create(words, utf16StrLength * 2);
    },
  };

  function swapEndian(word) {
    return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
  }
})();

(function () {
  // Check if typed arrays are supported
  if (typeof ArrayBuffer != "function") {
    return;
  }

  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;

  // Reference original init
  var superInit = WordArray.init;

  // Augment WordArray.init to handle typed arrays
  var subInit = (WordArray.init = function (typedArray) {
    // Convert buffers to uint8
    if (typedArray instanceof ArrayBuffer) {
      typedArray = new Uint8Array(typedArray);
    }

    // Convert other array views to uint8
    if (
      typedArray instanceof Int8Array ||
      (typeof Uint8ClampedArray !== "undefined" &&
        typedArray instanceof Uint8ClampedArray) ||
      typedArray instanceof Int16Array ||
      typedArray instanceof Uint16Array ||
      typedArray instanceof Int32Array ||
      typedArray instanceof Uint32Array ||
      typedArray instanceof Float32Array ||
      typedArray instanceof Float64Array
    ) {
      typedArray = new Uint8Array(
        typedArray.buffer,
        typedArray.byteOffset,
        typedArray.byteLength,
      );
    }

    // Handle Uint8Array
    if (typedArray instanceof Uint8Array) {
      // Shortcut
      var typedArrayByteLength = typedArray.byteLength;

      // Extract bytes
      var words = [];
      for (var i = 0; i < typedArrayByteLength; i++) {
        words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
      }

      // Initialize this word array
      superInit.call(this, words, typedArrayByteLength);
    } else {
      // Else call normal init
      superInit.apply(this, arguments);
    }
  });

  subInit.prototype = WordArray;
})();

/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

(function (Math) {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_algo = C.algo;

  // Constants table
  var _zl = WordArray.create([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6,
    15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13,
    11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9,
    7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
  ]);
  var _zr = WordArray.create([
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
    10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10,
    0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10,
    4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
  ]);
  var _sl = WordArray.create([
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9,
    7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13,
    6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9,
    15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
  ]);
  var _sr = WordArray.create([
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
    9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
    13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
    12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
  ]);

  var _hl = WordArray.create([
    0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e,
  ]);
  var _hr = WordArray.create([
    0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000,
  ]);

  /**
   * RIPEMD160 hash algorithm.
   */
  var RIPEMD160 = (C_algo.RIPEMD160 = Hasher.extend({
    _doReset: function () {
      this._hash = WordArray.create([
        0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
      ]);
    },

    _doProcessBlock: function (M, offset) {
      // Swap endian
      for (var i = 0; i < 16; i++) {
        // Shortcuts
        var offset_i = offset + i;
        var M_offset_i = M[offset_i];

        // Swap
        M[offset_i] =
          (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
          (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00);
      }
      // Shortcut
      var H = this._hash.words;
      var hl = _hl.words;
      var hr = _hr.words;
      var zl = _zl.words;
      var zr = _zr.words;
      var sl = _sl.words;
      var sr = _sr.words;

      // Working variables
      var al, bl, cl, dl, el;
      var ar, br, cr, dr, er;

      ar = al = H[0];
      br = bl = H[1];
      cr = cl = H[2];
      dr = dl = H[3];
      er = el = H[4];
      // Computation
      var t;
      for (var i = 0; i < 80; i += 1) {
        t = (al + M[offset + zl[i]]) | 0;
        if (i < 16) {
          t += f1(bl, cl, dl) + hl[0];
        } else if (i < 32) {
          t += f2(bl, cl, dl) + hl[1];
        } else if (i < 48) {
          t += f3(bl, cl, dl) + hl[2];
        } else if (i < 64) {
          t += f4(bl, cl, dl) + hl[3];
        } else {
          // if (i<80) {
          t += f5(bl, cl, dl) + hl[4];
        }
        t = t | 0;
        t = rotl(t, sl[i]);
        t = (t + el) | 0;
        al = el;
        el = dl;
        dl = rotl(cl, 10);
        cl = bl;
        bl = t;

        t = (ar + M[offset + zr[i]]) | 0;
        if (i < 16) {
          t += f5(br, cr, dr) + hr[0];
        } else if (i < 32) {
          t += f4(br, cr, dr) + hr[1];
        } else if (i < 48) {
          t += f3(br, cr, dr) + hr[2];
        } else if (i < 64) {
          t += f2(br, cr, dr) + hr[3];
        } else {
          // if (i<80) {
          t += f1(br, cr, dr) + hr[4];
        }
        t = t | 0;
        t = rotl(t, sr[i]);
        t = (t + er) | 0;
        ar = er;
        er = dr;
        dr = rotl(cr, 10);
        cr = br;
        br = t;
      }
      // Intermediate hash value
      t = (H[1] + cl + dr) | 0;
      H[1] = (H[2] + dl + er) | 0;
      H[2] = (H[3] + el + ar) | 0;
      H[3] = (H[4] + al + br) | 0;
      H[4] = (H[0] + bl + cr) | 0;
      H[0] = t;
    },

    _doFinalize: function () {
      // Shortcuts
      var data = this._data;
      var dataWords = data.words;

      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;

      // Add padding
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
        (((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
        (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff00ff00);
      data.sigBytes = (dataWords.length + 1) * 4;

      // Hash final blocks
      this._process();

      // Shortcuts
      var hash = this._hash;
      var H = hash.words;

      // Swap endian
      for (var i = 0; i < 5; i++) {
        // Shortcut
        var H_i = H[i];

        // Swap
        H[i] =
          (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
          (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
      }

      // Return final computed hash
      return hash;
    },

    clone: function () {
      var clone = Hasher.clone.call(this);
      clone._hash = this._hash.clone();

      return clone;
    },
  }));

  function f1(x, y, z) {
    return x ^ y ^ z;
  }

  function f2(x, y, z) {
    return (x & y) | (~x & z);
  }

  function f3(x, y, z) {
    return (x | ~y) ^ z;
  }

  function f4(x, y, z) {
    return (x & z) | (y & ~z);
  }

  function f5(x, y, z) {
    return x ^ (y | ~z);
  }

  function rotl(x, n) {
    return (x << n) | (x >>> (32 - n));
  }

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.RIPEMD160('message');
   *     var hash = CryptoJS.RIPEMD160(wordArray);
   */
  C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
   */
  C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
})(Math);

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var Base = C_lib.Base;
  var C_enc = C.enc;
  var Utf8 = C_enc.Utf8;
  var C_algo = C.algo;

  /**
   * HMAC algorithm.
   */
  var HMAC = (C_algo.HMAC = Base.extend({
    /**
     * Initializes a newly created HMAC.
     *
     * @param {Hasher} hasher The hash algorithm to use.
     * @param {WordArray|string} key The secret key.
     *
     * @example
     *
     *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
     */
    init: function (hasher, key) {
      // Init hasher
      hasher = this._hasher = new hasher.init();

      // Convert string to WordArray, else assume WordArray already
      if (typeof key == "string") {
        key = Utf8.parse(key);
      }

      // Shortcuts
      var hasherBlockSize = hasher.blockSize;
      var hasherBlockSizeBytes = hasherBlockSize * 4;

      // Allow arbitrary length keys
      if (key.sigBytes > hasherBlockSizeBytes) {
        key = hasher.finalize(key);
      }

      // Clamp excess bits
      key.clamp();

      // Clone key for inner and outer pads
      var oKey = (this._oKey = key.clone());
      var iKey = (this._iKey = key.clone());

      // Shortcuts
      var oKeyWords = oKey.words;
      var iKeyWords = iKey.words;

      // XOR keys with pad constants
      for (var i = 0; i < hasherBlockSize; i++) {
        oKeyWords[i] ^= 0x5c5c5c5c;
        iKeyWords[i] ^= 0x36363636;
      }
      oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

      // Set initial values
      this.reset();
    },

    /**
     * Resets this HMAC to its initial state.
     *
     * @example
     *
     *     hmacHasher.reset();
     */
    reset: function () {
      // Shortcut
      var hasher = this._hasher;

      // Reset
      hasher.reset();
      hasher.update(this._iKey);
    },

    /**
     * Updates this HMAC with a message.
     *
     * @param {WordArray|string} messageUpdate The message to append.
     *
     * @return {HMAC} This HMAC instance.
     *
     * @example
     *
     *     hmacHasher.update('message');
     *     hmacHasher.update(wordArray);
     */
    update: function (messageUpdate) {
      this._hasher.update(messageUpdate);

      // Chainable
      return this;
    },

    /**
     * Finalizes the HMAC computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} messageUpdate (Optional) A final message update.
     *
     * @return {WordArray} The HMAC.
     *
     * @example
     *
     *     var hmac = hmacHasher.finalize();
     *     var hmac = hmacHasher.finalize('message');
     *     var hmac = hmacHasher.finalize(wordArray);
     */
    finalize: function (messageUpdate) {
      // Shortcut
      var hasher = this._hasher;

      // Compute HMAC
      var innerHash = hasher.finalize(messageUpdate);
      hasher.reset();
      var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

      return hmac;
    },
  }));
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var Base = C_lib.Base;
  var WordArray = C_lib.WordArray;
  var C_algo = C.algo;
  var SHA1 = C_algo.SHA1;
  var HMAC = C_algo.HMAC;

  /**
   * Password-Based Key Derivation Function 2 algorithm.
   */
  var PBKDF2 = (C_algo.PBKDF2 = Base.extend({
    /**
     * Configuration options.
     *
     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
     * @property {Hasher} hasher The hasher to use. Default: SHA1
     * @property {number} iterations The number of iterations to perform. Default: 1
     */
    cfg: Base.extend({
      keySize: 128 / 32,
      hasher: SHA1,
      iterations: 1,
    }),

    /**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     var kdf = CryptoJS.algo.PBKDF2.create();
     *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
     *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
     */
    init: function (cfg) {
      this.cfg = this.cfg.extend(cfg);
    },

    /**
     * Computes the Password-Based Key Derivation Function 2.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     var key = kdf.compute(password, salt);
     */
    compute: function (password, salt) {
      // Shortcut
      var cfg = this.cfg;

      // Init HMAC
      var hmac = HMAC.create(cfg.hasher, password);

      // Initial values
      var derivedKey = WordArray.create();
      var blockIndex = WordArray.create([0x00000001]);

      // Shortcuts
      var derivedKeyWords = derivedKey.words;
      var blockIndexWords = blockIndex.words;
      var keySize = cfg.keySize;
      var iterations = cfg.iterations;

      // Generate key
      while (derivedKeyWords.length < keySize) {
        var block = hmac.update(salt).finalize(blockIndex);
        hmac.reset();

        // Shortcuts
        var blockWords = block.words;
        var blockWordsLength = blockWords.length;

        // Iterations
        var intermediate = block;
        for (var i = 1; i < iterations; i++) {
          intermediate = hmac.finalize(intermediate);
          hmac.reset();

          // Shortcut
          var intermediateWords = intermediate.words;

          // XOR intermediate with block
          for (var j = 0; j < blockWordsLength; j++) {
            blockWords[j] ^= intermediateWords[j];
          }
        }

        derivedKey.concat(block);
        blockIndexWords[0]++;
      }
      derivedKey.sigBytes = keySize * 4;

      return derivedKey;
    },
  }));

  /**
   * Computes the Password-Based Key Derivation Function 2.
   *
   * @param {WordArray|string} password The password.
   * @param {WordArray|string} salt A salt.
   * @param {Object} cfg (Optional) The configuration options to use for this computation.
   *
   * @return {WordArray} The derived key.
   *
   * @static
   *
   * @example
   *
   *     var key = CryptoJS.PBKDF2(password, salt);
   *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
   *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
   */
  C.PBKDF2 = function (password, salt, cfg) {
    return PBKDF2.create(cfg).compute(password, salt);
  };
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var Base = C_lib.Base;
  var WordArray = C_lib.WordArray;
  var C_algo = C.algo;
  var MD5 = C_algo.MD5;

  /**
   * This key derivation function is meant to conform with EVP_BytesToKey.
   * www.openssl.org/docs/crypto/EVP_BytesToKey.html
   */
  var EvpKDF = (C_algo.EvpKDF = Base.extend({
    /**
     * Configuration options.
     *
     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
     * @property {Hasher} hasher The hash algorithm to use. Default: MD5
     * @property {number} iterations The number of iterations to perform. Default: 1
     */
    cfg: Base.extend({
      keySize: 128 / 32,
      hasher: MD5,
      iterations: 1,
    }),

    /**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     var kdf = CryptoJS.algo.EvpKDF.create();
     *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
     *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
     */
    init: function (cfg) {
      this.cfg = this.cfg.extend(cfg);
    },

    /**
     * Derives a key from a password.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     var key = kdf.compute(password, salt);
     */
    compute: function (password, salt) {
      // Shortcut
      var cfg = this.cfg;

      // Init hasher
      var hasher = cfg.hasher.create();

      // Initial values
      var derivedKey = WordArray.create();

      // Shortcuts
      var derivedKeyWords = derivedKey.words;
      var keySize = cfg.keySize;
      var iterations = cfg.iterations;

      // Generate key
      while (derivedKeyWords.length < keySize) {
        if (block) {
          hasher.update(block);
        }
        var block = hasher.update(password).finalize(salt);
        hasher.reset();

        // Iterations
        for (var i = 1; i < iterations; i++) {
          block = hasher.finalize(block);
          hasher.reset();
        }

        derivedKey.concat(block);
      }
      derivedKey.sigBytes = keySize * 4;

      return derivedKey;
    },
  }));

  /**
   * Derives a key from a password.
   *
   * @param {WordArray|string} password The password.
   * @param {WordArray|string} salt A salt.
   * @param {Object} cfg (Optional) The configuration options to use for this computation.
   *
   * @return {WordArray} The derived key.
   *
   * @static
   *
   * @example
   *
   *     var key = CryptoJS.EvpKDF(password, salt);
   *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
   *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
   */
  C.EvpKDF = function (password, salt, cfg) {
    return EvpKDF.create(cfg).compute(password, salt);
  };
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var C_algo = C.algo;
  var SHA256 = C_algo.SHA256;

  /**
   * SHA-224 hash algorithm.
   */
  var SHA224 = (C_algo.SHA224 = SHA256.extend({
    _doReset: function () {
      this._hash = new WordArray.init([
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511,
        0x64f98fa7, 0xbefa4fa4,
      ]);
    },

    _doFinalize: function () {
      var hash = SHA256._doFinalize.call(this);

      hash.sigBytes -= 4;

      return hash;
    },
  }));

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.SHA224('message');
   *     var hash = CryptoJS.SHA224(wordArray);
   */
  C.SHA224 = SHA256._createHelper(SHA224);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacSHA224(message, key);
   */
  C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
})();

(function (undefined) {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var Base = C_lib.Base;
  var X32WordArray = C_lib.WordArray;

  /**
   * x64 namespace.
   */
  var C_x64 = (C.x64 = {});

  /**
   * A 64-bit word.
   */
  var X64Word = (C_x64.Word = Base.extend({
    /**
     * Initializes a newly created 64-bit word.
     *
     * @param {number} high The high 32 bits.
     * @param {number} low The low 32 bits.
     *
     * @example
     *
     *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
     */
    init: function (high, low) {
      this.high = high;
      this.low = low;
    },

    /**
     * Bitwise NOTs this word.
     *
     * @return {X64Word} A new x64-Word object after negating.
     *
     * @example
     *
     *     var negated = x64Word.not();
     */
    // not: function () {
    // var high = ~this.high;
    // var low = ~this.low;

    // return X64Word.create(high, low);
    // },

    /**
     * Bitwise ANDs this word with the passed word.
     *
     * @param {X64Word} word The x64-Word to AND with this word.
     *
     * @return {X64Word} A new x64-Word object after ANDing.
     *
     * @example
     *
     *     var anded = x64Word.and(anotherX64Word);
     */
    // and: function (word) {
    // var high = this.high & word.high;
    // var low = this.low & word.low;

    // return X64Word.create(high, low);
    // },

    /**
     * Bitwise ORs this word with the passed word.
     *
     * @param {X64Word} word The x64-Word to OR with this word.
     *
     * @return {X64Word} A new x64-Word object after ORing.
     *
     * @example
     *
     *     var ored = x64Word.or(anotherX64Word);
     */
    // or: function (word) {
    // var high = this.high | word.high;
    // var low = this.low | word.low;

    // return X64Word.create(high, low);
    // },

    /**
     * Bitwise XORs this word with the passed word.
     *
     * @param {X64Word} word The x64-Word to XOR with this word.
     *
     * @return {X64Word} A new x64-Word object after XORing.
     *
     * @example
     *
     *     var xored = x64Word.xor(anotherX64Word);
     */
    // xor: function (word) {
    // var high = this.high ^ word.high;
    // var low = this.low ^ word.low;

    // return X64Word.create(high, low);
    // },

    /**
     * Shifts this word n bits to the left.
     *
     * @param {number} n The number of bits to shift.
     *
     * @return {X64Word} A new x64-Word object after shifting.
     *
     * @example
     *
     *     var shifted = x64Word.shiftL(25);
     */
    // shiftL: function (n) {
    // if (n < 32) {
    // var high = (this.high << n) | (this.low >>> (32 - n));
    // var low = this.low << n;
    // } else {
    // var high = this.low << (n - 32);
    // var low = 0;
    // }

    // return X64Word.create(high, low);
    // },

    /**
     * Shifts this word n bits to the right.
     *
     * @param {number} n The number of bits to shift.
     *
     * @return {X64Word} A new x64-Word object after shifting.
     *
     * @example
     *
     *     var shifted = x64Word.shiftR(7);
     */
    // shiftR: function (n) {
    // if (n < 32) {
    // var low = (this.low >>> n) | (this.high << (32 - n));
    // var high = this.high >>> n;
    // } else {
    // var low = this.high >>> (n - 32);
    // var high = 0;
    // }

    // return X64Word.create(high, low);
    // },

    /**
     * Rotates this word n bits to the left.
     *
     * @param {number} n The number of bits to rotate.
     *
     * @return {X64Word} A new x64-Word object after rotating.
     *
     * @example
     *
     *     var rotated = x64Word.rotL(25);
     */
    // rotL: function (n) {
    // return this.shiftL(n).or(this.shiftR(64 - n));
    // },

    /**
     * Rotates this word n bits to the right.
     *
     * @param {number} n The number of bits to rotate.
     *
     * @return {X64Word} A new x64-Word object after rotating.
     *
     * @example
     *
     *     var rotated = x64Word.rotR(7);
     */
    // rotR: function (n) {
    // return this.shiftR(n).or(this.shiftL(64 - n));
    // },

    /**
     * Adds this word with the passed word.
     *
     * @param {X64Word} word The x64-Word to add with this word.
     *
     * @return {X64Word} A new x64-Word object after adding.
     *
     * @example
     *
     *     var added = x64Word.add(anotherX64Word);
     */
    // add: function (word) {
    // var low = (this.low + word.low) | 0;
    // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
    // var high = (this.high + word.high + carry) | 0;

    // return X64Word.create(high, low);
    // }
  }));

  /**
   * An array of 64-bit words.
   *
   * @property {Array} words The array of CryptoJS.x64.Word objects.
   * @property {number} sigBytes The number of significant bytes in this word array.
   */
  var X64WordArray = (C_x64.WordArray = Base.extend({
    /**
     * Initializes a newly created word array.
     *
     * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
     *
     * @example
     *
     *     var wordArray = CryptoJS.x64.WordArray.create();
     *
     *     var wordArray = CryptoJS.x64.WordArray.create([
     *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
     *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
     *     ]);
     *
     *     var wordArray = CryptoJS.x64.WordArray.create([
     *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
     *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
     *     ], 10);
     */
    init: function (words, sigBytes) {
      words = this.words = words || [];

      if (sigBytes != undefined) {
        this.sigBytes = sigBytes;
      } else {
        this.sigBytes = words.length * 8;
      }
    },

    /**
     * Converts this 64-bit word array to a 32-bit word array.
     *
     * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
     *
     * @example
     *
     *     var x32WordArray = x64WordArray.toX32();
     */
    toX32: function () {
      // Shortcuts
      var x64Words = this.words;
      var x64WordsLength = x64Words.length;

      // Convert
      var x32Words = [];
      for (var i = 0; i < x64WordsLength; i++) {
        var x64Word = x64Words[i];
        x32Words.push(x64Word.high);
        x32Words.push(x64Word.low);
      }

      return X32WordArray.create(x32Words, this.sigBytes);
    },

    /**
     * Creates a copy of this word array.
     *
     * @return {X64WordArray} The clone.
     *
     * @example
     *
     *     var clone = x64WordArray.clone();
     */
    clone: function () {
      var clone = Base.clone.call(this);

      // Clone "words" array
      var words = (clone.words = this.words.slice(0));

      // Clone each X64Word object
      var wordsLength = words.length;
      for (var i = 0; i < wordsLength; i++) {
        words[i] = words[i].clone();
      }

      return clone;
    },
  }));
})();

(function (Math) {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_x64 = C.x64;
  var X64Word = C_x64.Word;
  var C_algo = C.algo;

  // Constants tables
  var RHO_OFFSETS = [];
  var PI_INDEXES = [];
  var ROUND_CONSTANTS = [];

  // Compute Constants
  (function () {
    // Compute rho offset constants
    var x = 1,
      y = 0;
    for (var t = 0; t < 24; t++) {
      RHO_OFFSETS[x + 5 * y] = (((t + 1) * (t + 2)) / 2) % 64;

      var newX = y % 5;
      var newY = (2 * x + 3 * y) % 5;
      x = newX;
      y = newY;
    }

    // Compute pi index constants
    for (var x = 0; x < 5; x++) {
      for (var y = 0; y < 5; y++) {
        PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
      }
    }

    // Compute round constants
    var LFSR = 0x01;
    for (var i = 0; i < 24; i++) {
      var roundConstantMsw = 0;
      var roundConstantLsw = 0;

      for (var j = 0; j < 7; j++) {
        if (LFSR & 0x01) {
          var bitPosition = (1 << j) - 1;
          if (bitPosition < 32) {
            roundConstantLsw ^= 1 << bitPosition;
          } /* if (bitPosition >= 32) */ else {
            roundConstantMsw ^= 1 << (bitPosition - 32);
          }
        }

        // Compute next LFSR
        if (LFSR & 0x80) {
          // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
          LFSR = (LFSR << 1) ^ 0x71;
        } else {
          LFSR <<= 1;
        }
      }

      ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
    }
  })();

  // Reusable objects for temporary values
  var T = [];
  (function () {
    for (var i = 0; i < 25; i++) {
      T[i] = X64Word.create();
    }
  })();

  /**
   * SHA-3 hash algorithm.
   */
  var SHA3 = (C_algo.SHA3 = Hasher.extend({
    /**
     * Configuration options.
     *
     * @property {number} outputLength
     *   The desired number of bits in the output hash.
     *   Only values permitted are: 224, 256, 384, 512.
     *   Default: 512
     */
    cfg: Hasher.cfg.extend({
      outputLength: 512,
    }),

    _doReset: function () {
      var state = (this._state = []);
      for (var i = 0; i < 25; i++) {
        state[i] = new X64Word.init();
      }

      this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    },

    _doProcessBlock: function (M, offset) {
      // Shortcuts
      var state = this._state;
      var nBlockSizeLanes = this.blockSize / 2;

      // Absorb
      for (var i = 0; i < nBlockSizeLanes; i++) {
        // Shortcuts
        var M2i = M[offset + 2 * i];
        var M2i1 = M[offset + 2 * i + 1];

        // Swap endian
        M2i =
          (((M2i << 8) | (M2i >>> 24)) & 0x00ff00ff) |
          (((M2i << 24) | (M2i >>> 8)) & 0xff00ff00);
        M2i1 =
          (((M2i1 << 8) | (M2i1 >>> 24)) & 0x00ff00ff) |
          (((M2i1 << 24) | (M2i1 >>> 8)) & 0xff00ff00);

        // Absorb message into state
        var lane = state[i];
        lane.high ^= M2i1;
        lane.low ^= M2i;
      }

      // Rounds
      for (var round = 0; round < 24; round++) {
        // Theta
        for (var x = 0; x < 5; x++) {
          // Mix column lanes
          var tMsw = 0,
            tLsw = 0;
          for (var y = 0; y < 5; y++) {
            var lane = state[x + 5 * y];
            tMsw ^= lane.high;
            tLsw ^= lane.low;
          }

          // Temporary values
          var Tx = T[x];
          Tx.high = tMsw;
          Tx.low = tLsw;
        }
        for (var x = 0; x < 5; x++) {
          // Shortcuts
          var Tx4 = T[(x + 4) % 5];
          var Tx1 = T[(x + 1) % 5];
          var Tx1Msw = Tx1.high;
          var Tx1Lsw = Tx1.low;

          // Mix surrounding columns
          var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
          var tLsw = Tx4.low ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
          for (var y = 0; y < 5; y++) {
            var lane = state[x + 5 * y];
            lane.high ^= tMsw;
            lane.low ^= tLsw;
          }
        }

        // Rho Pi
        for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
          // Shortcuts
          var lane = state[laneIndex];
          var laneMsw = lane.high;
          var laneLsw = lane.low;
          var rhoOffset = RHO_OFFSETS[laneIndex];

          // Rotate lanes
          if (rhoOffset < 32) {
            var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
            var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
          } /* if (rhoOffset >= 32) */ else {
            var tMsw =
              (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
            var tLsw =
              (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
          }

          // Transpose lanes
          var TPiLane = T[PI_INDEXES[laneIndex]];
          TPiLane.high = tMsw;
          TPiLane.low = tLsw;
        }

        // Rho pi at x = y = 0
        var T0 = T[0];
        var state0 = state[0];
        T0.high = state0.high;
        T0.low = state0.low;

        // Chi
        for (var x = 0; x < 5; x++) {
          for (var y = 0; y < 5; y++) {
            // Shortcuts
            var laneIndex = x + 5 * y;
            var lane = state[laneIndex];
            var TLane = T[laneIndex];
            var Tx1Lane = T[((x + 1) % 5) + 5 * y];
            var Tx2Lane = T[((x + 2) % 5) + 5 * y];

            // Mix rows
            lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
            lane.low = TLane.low ^ (~Tx1Lane.low & Tx2Lane.low);
          }
        }

        // Iota
        var lane = state[0];
        var roundConstant = ROUND_CONSTANTS[round];
        lane.high ^= roundConstant.high;
        lane.low ^= roundConstant.low;
      }
    },

    _doFinalize: function () {
      // Shortcuts
      var data = this._data;
      var dataWords = data.words;
      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;
      var blockSizeBits = this.blockSize * 32;

      // Add padding
      dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - (nBitsLeft % 32));
      dataWords[
        ((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1
      ] |= 0x80;
      data.sigBytes = dataWords.length * 4;

      // Hash final blocks
      this._process();

      // Shortcuts
      var state = this._state;
      var outputLengthBytes = this.cfg.outputLength / 8;
      var outputLengthLanes = outputLengthBytes / 8;

      // Squeeze
      var hashWords = [];
      for (var i = 0; i < outputLengthLanes; i++) {
        // Shortcuts
        var lane = state[i];
        var laneMsw = lane.high;
        var laneLsw = lane.low;

        // Swap endian
        laneMsw =
          (((laneMsw << 8) | (laneMsw >>> 24)) & 0x00ff00ff) |
          (((laneMsw << 24) | (laneMsw >>> 8)) & 0xff00ff00);
        laneLsw =
          (((laneLsw << 8) | (laneLsw >>> 24)) & 0x00ff00ff) |
          (((laneLsw << 24) | (laneLsw >>> 8)) & 0xff00ff00);

        // Squeeze state to retrieve hash
        hashWords.push(laneLsw);
        hashWords.push(laneMsw);
      }

      // Return final computed hash
      return new WordArray.init(hashWords, outputLengthBytes);
    },

    clone: function () {
      var clone = Hasher.clone.call(this);

      var state = (clone._state = this._state.slice(0));
      for (var i = 0; i < 25; i++) {
        state[i] = state[i].clone();
      }

      return clone;
    },
  }));

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.SHA3('message');
   *     var hash = CryptoJS.SHA3(wordArray);
   */
  C.SHA3 = Hasher._createHelper(SHA3);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacSHA3(message, key);
   */
  C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
})(Math);

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var Hasher = C_lib.Hasher;
  var C_x64 = C.x64;
  var X64Word = C_x64.Word;
  var X64WordArray = C_x64.WordArray;
  var C_algo = C.algo;

  function X64Word_create() {
    return X64Word.create.apply(X64Word, arguments);
  }

  // Constants
  var K = [
    X64Word_create(0x428a2f98, 0xd728ae22),
    X64Word_create(0x71374491, 0x23ef65cd),
    X64Word_create(0xb5c0fbcf, 0xec4d3b2f),
    X64Word_create(0xe9b5dba5, 0x8189dbbc),
    X64Word_create(0x3956c25b, 0xf348b538),
    X64Word_create(0x59f111f1, 0xb605d019),
    X64Word_create(0x923f82a4, 0xaf194f9b),
    X64Word_create(0xab1c5ed5, 0xda6d8118),
    X64Word_create(0xd807aa98, 0xa3030242),
    X64Word_create(0x12835b01, 0x45706fbe),
    X64Word_create(0x243185be, 0x4ee4b28c),
    X64Word_create(0x550c7dc3, 0xd5ffb4e2),
    X64Word_create(0x72be5d74, 0xf27b896f),
    X64Word_create(0x80deb1fe, 0x3b1696b1),
    X64Word_create(0x9bdc06a7, 0x25c71235),
    X64Word_create(0xc19bf174, 0xcf692694),
    X64Word_create(0xe49b69c1, 0x9ef14ad2),
    X64Word_create(0xefbe4786, 0x384f25e3),
    X64Word_create(0x0fc19dc6, 0x8b8cd5b5),
    X64Word_create(0x240ca1cc, 0x77ac9c65),
    X64Word_create(0x2de92c6f, 0x592b0275),
    X64Word_create(0x4a7484aa, 0x6ea6e483),
    X64Word_create(0x5cb0a9dc, 0xbd41fbd4),
    X64Word_create(0x76f988da, 0x831153b5),
    X64Word_create(0x983e5152, 0xee66dfab),
    X64Word_create(0xa831c66d, 0x2db43210),
    X64Word_create(0xb00327c8, 0x98fb213f),
    X64Word_create(0xbf597fc7, 0xbeef0ee4),
    X64Word_create(0xc6e00bf3, 0x3da88fc2),
    X64Word_create(0xd5a79147, 0x930aa725),
    X64Word_create(0x06ca6351, 0xe003826f),
    X64Word_create(0x14292967, 0x0a0e6e70),
    X64Word_create(0x27b70a85, 0x46d22ffc),
    X64Word_create(0x2e1b2138, 0x5c26c926),
    X64Word_create(0x4d2c6dfc, 0x5ac42aed),
    X64Word_create(0x53380d13, 0x9d95b3df),
    X64Word_create(0x650a7354, 0x8baf63de),
    X64Word_create(0x766a0abb, 0x3c77b2a8),
    X64Word_create(0x81c2c92e, 0x47edaee6),
    X64Word_create(0x92722c85, 0x1482353b),
    X64Word_create(0xa2bfe8a1, 0x4cf10364),
    X64Word_create(0xa81a664b, 0xbc423001),
    X64Word_create(0xc24b8b70, 0xd0f89791),
    X64Word_create(0xc76c51a3, 0x0654be30),
    X64Word_create(0xd192e819, 0xd6ef5218),
    X64Word_create(0xd6990624, 0x5565a910),
    X64Word_create(0xf40e3585, 0x5771202a),
    X64Word_create(0x106aa070, 0x32bbd1b8),
    X64Word_create(0x19a4c116, 0xb8d2d0c8),
    X64Word_create(0x1e376c08, 0x5141ab53),
    X64Word_create(0x2748774c, 0xdf8eeb99),
    X64Word_create(0x34b0bcb5, 0xe19b48a8),
    X64Word_create(0x391c0cb3, 0xc5c95a63),
    X64Word_create(0x4ed8aa4a, 0xe3418acb),
    X64Word_create(0x5b9cca4f, 0x7763e373),
    X64Word_create(0x682e6ff3, 0xd6b2b8a3),
    X64Word_create(0x748f82ee, 0x5defb2fc),
    X64Word_create(0x78a5636f, 0x43172f60),
    X64Word_create(0x84c87814, 0xa1f0ab72),
    X64Word_create(0x8cc70208, 0x1a6439ec),
    X64Word_create(0x90befffa, 0x23631e28),
    X64Word_create(0xa4506ceb, 0xde82bde9),
    X64Word_create(0xbef9a3f7, 0xb2c67915),
    X64Word_create(0xc67178f2, 0xe372532b),
    X64Word_create(0xca273ece, 0xea26619c),
    X64Word_create(0xd186b8c7, 0x21c0c207),
    X64Word_create(0xeada7dd6, 0xcde0eb1e),
    X64Word_create(0xf57d4f7f, 0xee6ed178),
    X64Word_create(0x06f067aa, 0x72176fba),
    X64Word_create(0x0a637dc5, 0xa2c898a6),
    X64Word_create(0x113f9804, 0xbef90dae),
    X64Word_create(0x1b710b35, 0x131c471b),
    X64Word_create(0x28db77f5, 0x23047d84),
    X64Word_create(0x32caab7b, 0x40c72493),
    X64Word_create(0x3c9ebe0a, 0x15c9bebc),
    X64Word_create(0x431d67c4, 0x9c100d4c),
    X64Word_create(0x4cc5d4be, 0xcb3e42b6),
    X64Word_create(0x597f299c, 0xfc657e2a),
    X64Word_create(0x5fcb6fab, 0x3ad6faec),
    X64Word_create(0x6c44198c, 0x4a475817),
  ];

  // Reusable objects
  var W = [];
  (function () {
    for (var i = 0; i < 80; i++) {
      W[i] = X64Word_create();
    }
  })();

  /**
   * SHA-512 hash algorithm.
   */
  var SHA512 = (C_algo.SHA512 = Hasher.extend({
    _doReset: function () {
      this._hash = new X64WordArray.init([
        new X64Word.init(0x6a09e667, 0xf3bcc908),
        new X64Word.init(0xbb67ae85, 0x84caa73b),
        new X64Word.init(0x3c6ef372, 0xfe94f82b),
        new X64Word.init(0xa54ff53a, 0x5f1d36f1),
        new X64Word.init(0x510e527f, 0xade682d1),
        new X64Word.init(0x9b05688c, 0x2b3e6c1f),
        new X64Word.init(0x1f83d9ab, 0xfb41bd6b),
        new X64Word.init(0x5be0cd19, 0x137e2179),
      ]);
    },

    _doProcessBlock: function (M, offset) {
      // Shortcuts
      var H = this._hash.words;

      var H0 = H[0];
      var H1 = H[1];
      var H2 = H[2];
      var H3 = H[3];
      var H4 = H[4];
      var H5 = H[5];
      var H6 = H[6];
      var H7 = H[7];

      var H0h = H0.high;
      var H0l = H0.low;
      var H1h = H1.high;
      var H1l = H1.low;
      var H2h = H2.high;
      var H2l = H2.low;
      var H3h = H3.high;
      var H3l = H3.low;
      var H4h = H4.high;
      var H4l = H4.low;
      var H5h = H5.high;
      var H5l = H5.low;
      var H6h = H6.high;
      var H6l = H6.low;
      var H7h = H7.high;
      var H7l = H7.low;

      // Working variables
      var ah = H0h;
      var al = H0l;
      var bh = H1h;
      var bl = H1l;
      var ch = H2h;
      var cl = H2l;
      var dh = H3h;
      var dl = H3l;
      var eh = H4h;
      var el = H4l;
      var fh = H5h;
      var fl = H5l;
      var gh = H6h;
      var gl = H6l;
      var hh = H7h;
      var hl = H7l;

      // Rounds
      for (var i = 0; i < 80; i++) {
        // Shortcut
        var Wi = W[i];

        // Extend message
        if (i < 16) {
          var Wih = (Wi.high = M[offset + i * 2] | 0);
          var Wil = (Wi.low = M[offset + i * 2 + 1] | 0);
        } else {
          // Gamma0
          var gamma0x = W[i - 15];
          var gamma0xh = gamma0x.high;
          var gamma0xl = gamma0x.low;
          var gamma0h =
            ((gamma0xh >>> 1) | (gamma0xl << 31)) ^
            ((gamma0xh >>> 8) | (gamma0xl << 24)) ^
            (gamma0xh >>> 7);
          var gamma0l =
            ((gamma0xl >>> 1) | (gamma0xh << 31)) ^
            ((gamma0xl >>> 8) | (gamma0xh << 24)) ^
            ((gamma0xl >>> 7) | (gamma0xh << 25));

          // Gamma1
          var gamma1x = W[i - 2];
          var gamma1xh = gamma1x.high;
          var gamma1xl = gamma1x.low;
          var gamma1h =
            ((gamma1xh >>> 19) | (gamma1xl << 13)) ^
            ((gamma1xh << 3) | (gamma1xl >>> 29)) ^
            (gamma1xh >>> 6);
          var gamma1l =
            ((gamma1xl >>> 19) | (gamma1xh << 13)) ^
            ((gamma1xl << 3) | (gamma1xh >>> 29)) ^
            ((gamma1xl >>> 6) | (gamma1xh << 26));

          // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
          var Wi7 = W[i - 7];
          var Wi7h = Wi7.high;
          var Wi7l = Wi7.low;

          var Wi16 = W[i - 16];
          var Wi16h = Wi16.high;
          var Wi16l = Wi16.low;

          var Wil = gamma0l + Wi7l;
          var Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
          var Wil = Wil + gamma1l;
          var Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
          var Wil = Wil + Wi16l;
          var Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

          Wi.high = Wih;
          Wi.low = Wil;
        }

        var chh = (eh & fh) ^ (~eh & gh);
        var chl = (el & fl) ^ (~el & gl);
        var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
        var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

        var sigma0h =
          ((ah >>> 28) | (al << 4)) ^
          ((ah << 30) | (al >>> 2)) ^
          ((ah << 25) | (al >>> 7));
        var sigma0l =
          ((al >>> 28) | (ah << 4)) ^
          ((al << 30) | (ah >>> 2)) ^
          ((al << 25) | (ah >>> 7));
        var sigma1h =
          ((eh >>> 14) | (el << 18)) ^
          ((eh >>> 18) | (el << 14)) ^
          ((eh << 23) | (el >>> 9));
        var sigma1l =
          ((el >>> 14) | (eh << 18)) ^
          ((el >>> 18) | (eh << 14)) ^
          ((el << 23) | (eh >>> 9));

        // t1 = h + sigma1 + ch + K[i] + W[i]
        var Ki = K[i];
        var Kih = Ki.high;
        var Kil = Ki.low;

        var t1l = hl + sigma1l;
        var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
        var t1l = t1l + chl;
        var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
        var t1l = t1l + Kil;
        var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
        var t1l = t1l + Wil;
        var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

        // t2 = sigma0 + maj
        var t2l = sigma0l + majl;
        var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

        // Update working variables
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        el = (dl + t1l) | 0;
        eh = (dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0)) | 0;
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        al = (t1l + t2l) | 0;
        ah = (t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0)) | 0;
      }

      // Intermediate hash value
      H0l = H0.low = H0l + al;
      H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
      H1l = H1.low = H1l + bl;
      H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
      H2l = H2.low = H2l + cl;
      H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
      H3l = H3.low = H3l + dl;
      H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
      H4l = H4.low = H4l + el;
      H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
      H5l = H5.low = H5l + fl;
      H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
      H6l = H6.low = H6l + gl;
      H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
      H7l = H7.low = H7l + hl;
      H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
    },

    _doFinalize: function () {
      // Shortcuts
      var data = this._data;
      var dataWords = data.words;

      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;

      // Add padding
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
      dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(
        nBitsTotal / 0x100000000,
      );
      dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
      data.sigBytes = dataWords.length * 4;

      // Hash final blocks
      this._process();

      // Convert hash to 32-bit word array before returning
      var hash = this._hash.toX32();

      // Return final computed hash
      return hash;
    },

    clone: function () {
      var clone = Hasher.clone.call(this);
      clone._hash = this._hash.clone();

      return clone;
    },

    blockSize: 1024 / 32,
  }));

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.SHA512('message');
   *     var hash = CryptoJS.SHA512(wordArray);
   */
  C.SHA512 = Hasher._createHelper(SHA512);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacSHA512(message, key);
   */
  C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_x64 = C.x64;
  var X64Word = C_x64.Word;
  var X64WordArray = C_x64.WordArray;
  var C_algo = C.algo;
  var SHA512 = C_algo.SHA512;

  /**
   * SHA-384 hash algorithm.
   */
  var SHA384 = (C_algo.SHA384 = SHA512.extend({
    _doReset: function () {
      this._hash = new X64WordArray.init([
        new X64Word.init(0xcbbb9d5d, 0xc1059ed8),
        new X64Word.init(0x629a292a, 0x367cd507),
        new X64Word.init(0x9159015a, 0x3070dd17),
        new X64Word.init(0x152fecd8, 0xf70e5939),
        new X64Word.init(0x67332667, 0xffc00b31),
        new X64Word.init(0x8eb44a87, 0x68581511),
        new X64Word.init(0xdb0c2e0d, 0x64f98fa7),
        new X64Word.init(0x47b5481d, 0xbefa4fa4),
      ]);
    },

    _doFinalize: function () {
      var hash = SHA512._doFinalize.call(this);

      hash.sigBytes -= 16;

      return hash;
    },
  }));

  /**
   * Shortcut function to the hasher's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   *
   * @return {WordArray} The hash.
   *
   * @static
   *
   * @example
   *
   *     var hash = CryptoJS.SHA384('message');
   *     var hash = CryptoJS.SHA384(wordArray);
   */
  C.SHA384 = SHA512._createHelper(SHA384);

  /**
   * Shortcut function to the HMAC's object interface.
   *
   * @param {WordArray|string} message The message to hash.
   * @param {WordArray|string} key The secret key.
   *
   * @return {WordArray} The HMAC.
   *
   * @static
   *
   * @example
   *
   *     var hmac = CryptoJS.HmacSHA384(message, key);
   */
  C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
})();

/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher ||
  (function (undefined) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */
    var Cipher = (C_lib.Cipher = BufferedBlockAlgorithm.extend({
      /**
       * Configuration options.
       *
       * @property {WordArray} iv The IV to use for this operation.
       */
      cfg: Base.extend(),

      /**
       * Creates this cipher in encryption mode.
       *
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {Cipher} A cipher instance.
       *
       * @static
       *
       * @example
       *
       *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
       */
      createEncryptor: function (key, cfg) {
        return this.create(this._ENC_XFORM_MODE, key, cfg);
      },

      /**
       * Creates this cipher in decryption mode.
       *
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {Cipher} A cipher instance.
       *
       * @static
       *
       * @example
       *
       *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
       */
      createDecryptor: function (key, cfg) {
        return this.create(this._DEC_XFORM_MODE, key, cfg);
      },

      /**
       * Initializes a newly created cipher.
       *
       * @param {number} xformMode Either the encryption or decryption transormation mode constant.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @example
       *
       *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
       */
      init: function (xformMode, key, cfg) {
        // Apply config defaults
        this.cfg = this.cfg.extend(cfg);

        // Store transform mode and key
        this._xformMode = xformMode;
        this._key = key;

        // Set initial values
        this.reset();
      },

      /**
       * Resets this cipher to its initial state.
       *
       * @example
       *
       *     cipher.reset();
       */
      reset: function () {
        // Reset data buffer
        BufferedBlockAlgorithm.reset.call(this);

        // Perform concrete-cipher logic
        this._doReset();
      },

      /**
       * Adds data to be encrypted or decrypted.
       *
       * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
       *
       * @return {WordArray} The data after processing.
       *
       * @example
       *
       *     var encrypted = cipher.process('data');
       *     var encrypted = cipher.process(wordArray);
       */
      process: function (dataUpdate) {
        // Append
        this._append(dataUpdate);

        // Process available blocks
        return this._process();
      },

      /**
       * Finalizes the encryption or decryption process.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
       *
       * @return {WordArray} The data after final processing.
       *
       * @example
       *
       *     var encrypted = cipher.finalize();
       *     var encrypted = cipher.finalize('data');
       *     var encrypted = cipher.finalize(wordArray);
       */
      finalize: function (dataUpdate) {
        // Final data update
        if (dataUpdate) {
          this._append(dataUpdate);
        }

        // Perform concrete-cipher logic
        var finalProcessedData = this._doFinalize();

        return finalProcessedData;
      },

      keySize: 128 / 32,

      ivSize: 128 / 32,

      _ENC_XFORM_MODE: 1,

      _DEC_XFORM_MODE: 2,

      /**
       * Creates shortcut functions to a cipher's object interface.
       *
       * @param {Cipher} cipher The cipher to create a helper for.
       *
       * @return {Object} An object with encrypt and decrypt shortcut functions.
       *
       * @static
       *
       * @example
       *
       *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
       */
      _createHelper: (function () {
        function selectCipherStrategy(key) {
          if (typeof key == "string") {
            return PasswordBasedCipher;
          } else {
            return SerializableCipher;
          }
        }

        return function (cipher) {
          return {
            encrypt: function (message, key, cfg) {
              return selectCipherStrategy(key).encrypt(
                cipher,
                message,
                key,
                cfg,
              );
            },

            decrypt: function (ciphertext, key, cfg) {
              return selectCipherStrategy(key).decrypt(
                cipher,
                ciphertext,
                key,
                cfg,
              );
            },
          };
        };
      })(),
    }));

    /**
     * Abstract base stream cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    var StreamCipher = (C_lib.StreamCipher = Cipher.extend({
      _doFinalize: function () {
        // Process partial blocks
        var finalProcessedBlocks = this._process(!!"flush");

        return finalProcessedBlocks;
      },

      blockSize: 1,
    }));

    /**
     * Mode namespace.
     */
    var C_mode = (C.mode = {});

    /**
     * Abstract base block cipher mode template.
     */
    var BlockCipherMode = (C_lib.BlockCipherMode = Base.extend({
      /**
       * Creates this mode for encryption.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @static
       *
       * @example
       *
       *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
       */
      createEncryptor: function (cipher, iv) {
        return this.Encryptor.create(cipher, iv);
      },

      /**
       * Creates this mode for decryption.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @static
       *
       * @example
       *
       *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
       */
      createDecryptor: function (cipher, iv) {
        return this.Decryptor.create(cipher, iv);
      },

      /**
       * Initializes a newly created mode.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @example
       *
       *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
       */
      init: function (cipher, iv) {
        this._cipher = cipher;
        this._iv = iv;
      },
    }));

    /**
     * Cipher Block Chaining mode.
     */
    var CBC = (C_mode.CBC = (function () {
      /**
       * Abstract base CBC mode.
       */
      var CBC = BlockCipherMode.extend();

      /**
       * CBC encryptor.
       */
      CBC.Encryptor = CBC.extend({
        /**
         * Processes the data block at offset.
         *
         * @param {Array} words The data words to operate on.
         * @param {number} offset The offset where the block starts.
         *
         * @example
         *
         *     mode.processBlock(data.words, offset);
         */
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;

          // XOR and encrypt
          xorBlock.call(this, words, offset, blockSize);
          cipher.encryptBlock(words, offset);

          // Remember this block to use with next block
          this._prevBlock = words.slice(offset, offset + blockSize);
        },
      });

      /**
       * CBC decryptor.
       */
      CBC.Decryptor = CBC.extend({
        /**
         * Processes the data block at offset.
         *
         * @param {Array} words The data words to operate on.
         * @param {number} offset The offset where the block starts.
         *
         * @example
         *
         *     mode.processBlock(data.words, offset);
         */
        processBlock: function (words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;

          // Remember this block to use with next block
          var thisBlock = words.slice(offset, offset + blockSize);

          // Decrypt and XOR
          cipher.decryptBlock(words, offset);
          xorBlock.call(this, words, offset, blockSize);

          // This block becomes the previous block
          this._prevBlock = thisBlock;
        },
      });

      function xorBlock(words, offset, blockSize) {
        // Shortcut
        var iv = this._iv;

        // Choose mixing block
        if (iv) {
          var block = iv;

          // Remove IV for subsequent blocks
          this._iv = undefined;
        } else {
          var block = this._prevBlock;
        }

        // XOR blocks
        for (var i = 0; i < blockSize; i++) {
          words[offset + i] ^= block[i];
        }
      }

      return CBC;
    })());

    /**
     * Padding namespace.
     */
    var C_pad = (C.pad = {});

    /**
     * PKCS #5/7 padding strategy.
     */
    var Pkcs7 = (C_pad.Pkcs7 = {
      /**
       * Pads data using the algorithm defined in PKCS #5/7.
       *
       * @param {WordArray} data The data to pad.
       * @param {number} blockSize The multiple that the data should be padded to.
       *
       * @static
       *
       * @example
       *
       *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
       */
      pad: function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;

        // Count padding bytes
        var nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);

        // Create padding word
        var paddingWord =
          (nPaddingBytes << 24) |
          (nPaddingBytes << 16) |
          (nPaddingBytes << 8) |
          nPaddingBytes;

        // Create padding
        var paddingWords = [];
        for (var i = 0; i < nPaddingBytes; i += 4) {
          paddingWords.push(paddingWord);
        }
        var padding = WordArray.create(paddingWords, nPaddingBytes);

        // Add padding
        data.concat(padding);
      },

      /**
       * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
       *
       * @param {WordArray} data The data to unpad.
       *
       * @static
       *
       * @example
       *
       *     CryptoJS.pad.Pkcs7.unpad(wordArray);
       */
      unpad: function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        data.sigBytes -= nPaddingBytes;
      },
    });

    /**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    var BlockCipher = (C_lib.BlockCipher = Cipher.extend({
      /**
       * Configuration options.
       *
       * @property {Mode} mode The block mode to use. Default: CBC
       * @property {Padding} padding The padding strategy to use. Default: Pkcs7
       */
      cfg: Cipher.cfg.extend({
        mode: CBC,
        padding: Pkcs7,
      }),

      reset: function () {
        // Reset cipher
        Cipher.reset.call(this);

        // Shortcuts
        var cfg = this.cfg;
        var iv = cfg.iv;
        var mode = cfg.mode;

        // Reset block mode
        if (this._xformMode == this._ENC_XFORM_MODE) {
          var modeCreator = mode.createEncryptor;
        } /* if (this._xformMode == this._DEC_XFORM_MODE) */ else {
          var modeCreator = mode.createDecryptor;
          // Keep at least one block in the buffer for unpadding
          this._minBufferSize = 1;
        }

        if (this._mode && this._mode.__creator == modeCreator) {
          this._mode.init(this, iv && iv.words);
        } else {
          this._mode = modeCreator.call(mode, this, iv && iv.words);
          this._mode.__creator = modeCreator;
        }
      },

      _doProcessBlock: function (words, offset) {
        this._mode.processBlock(words, offset);
      },

      _doFinalize: function () {
        // Shortcut
        var padding = this.cfg.padding;

        // Finalize
        if (this._xformMode == this._ENC_XFORM_MODE) {
          // Pad data
          padding.pad(this._data, this.blockSize);

          // Process final blocks
          var finalProcessedBlocks = this._process(!!"flush");
        } /* if (this._xformMode == this._DEC_XFORM_MODE) */ else {
          // Process final blocks
          var finalProcessedBlocks = this._process(!!"flush");

          // Unpad data
          padding.unpad(finalProcessedBlocks);
        }

        return finalProcessedBlocks;
      },

      blockSize: 128 / 32,
    }));

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = (C_lib.CipherParams = Base.extend({
      /**
       * Initializes a newly created cipher params object.
       *
       * @param {Object} cipherParams An object with any of the possible cipher parameters.
       *
       * @example
       *
       *     var cipherParams = CryptoJS.lib.CipherParams.create({
       *         ciphertext: ciphertextWordArray,
       *         key: keyWordArray,
       *         iv: ivWordArray,
       *         salt: saltWordArray,
       *         algorithm: CryptoJS.algo.AES,
       *         mode: CryptoJS.mode.CBC,
       *         padding: CryptoJS.pad.PKCS7,
       *         blockSize: 4,
       *         formatter: CryptoJS.format.OpenSSL
       *     });
       */
      init: function (cipherParams) {
        this.mixIn(cipherParams);
      },

      /**
       * Converts this cipher params object to a string.
       *
       * @param {Format} formatter (Optional) The formatting strategy to use.
       *
       * @return {string} The stringified cipher params.
       *
       * @throws Error If neither the formatter nor the default formatter is set.
       *
       * @example
       *
       *     var string = cipherParams + '';
       *     var string = cipherParams.toString();
       *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
       */
      toString: function (formatter) {
        return (formatter || this.formatter).stringify(this);
      },
    }));

    /**
     * Format namespace.
     */
    var C_format = (C.format = {});

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = (C_format.OpenSSL = {
      /**
       * Converts a cipher params object to an OpenSSL-compatible string.
       *
       * @param {CipherParams} cipherParams The cipher params object.
       *
       * @return {string} The OpenSSL-compatible string.
       *
       * @static
       *
       * @example
       *
       *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
       */
      stringify: function (cipherParams) {
        // Shortcuts
        var ciphertext = cipherParams.ciphertext;
        var salt = cipherParams.salt;

        // Format
        if (salt) {
          var wordArray = WordArray.create([0x53616c74, 0x65645f5f])
            .concat(salt)
            .concat(ciphertext);
        } else {
          var wordArray = ciphertext;
        }

        return wordArray.toString(Base64);
      },

      /**
       * Converts an OpenSSL-compatible string to a cipher params object.
       *
       * @param {string} openSSLStr The OpenSSL-compatible string.
       *
       * @return {CipherParams} The cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
       */
      parse: function (openSSLStr) {
        // Parse base64
        var ciphertext = Base64.parse(openSSLStr);

        // Shortcut
        var ciphertextWords = ciphertext.words;

        // Test for salt
        if (
          ciphertextWords[0] == 0x53616c74 &&
          ciphertextWords[1] == 0x65645f5f
        ) {
          // Extract salt
          var salt = WordArray.create(ciphertextWords.slice(2, 4));

          // Remove salt from ciphertext
          ciphertextWords.splice(0, 4);
          ciphertext.sigBytes -= 16;
        }

        return CipherParams.create({ ciphertext: ciphertext, salt: salt });
      },
    });

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    var SerializableCipher = (C_lib.SerializableCipher = Base.extend({
      /**
       * Configuration options.
       *
       * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
       */
      cfg: Base.extend({
        format: OpenSSLFormatter,
      }),

      /**
       * Encrypts a message.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {WordArray|string} message The message to encrypt.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {CipherParams} A cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
       */
      encrypt: function (cipher, message, key, cfg) {
        // Apply config defaults
        cfg = this.cfg.extend(cfg);

        // Encrypt
        var encryptor = cipher.createEncryptor(key, cfg);
        var ciphertext = encryptor.finalize(message);

        // Shortcut
        var cipherCfg = encryptor.cfg;

        // Create and return serializable cipher params
        return CipherParams.create({
          ciphertext: ciphertext,
          key: key,
          iv: cipherCfg.iv,
          algorithm: cipher,
          mode: cipherCfg.mode,
          padding: cipherCfg.padding,
          blockSize: cipher.blockSize,
          formatter: cfg.format,
        });
      },

      /**
       * Decrypts serialized ciphertext.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {WordArray} The plaintext.
       *
       * @static
       *
       * @example
       *
       *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
       *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
       */
      decrypt: function (cipher, ciphertext, key, cfg) {
        // Apply config defaults
        cfg = this.cfg.extend(cfg);

        // Convert string to CipherParams
        ciphertext = this._parse(ciphertext, cfg.format);

        // Decrypt
        var plaintext = cipher
          .createDecryptor(key, cfg)
          .finalize(ciphertext.ciphertext);

        return plaintext;
      },

      /**
       * Converts serialized ciphertext to CipherParams,
       * else assumed CipherParams already and returns ciphertext unchanged.
       *
       * @param {CipherParams|string} ciphertext The ciphertext.
       * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
       *
       * @return {CipherParams} The unserialized ciphertext.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
       */
      _parse: function (ciphertext, format) {
        if (typeof ciphertext == "string") {
          return format.parse(ciphertext, this);
        } else {
          return ciphertext;
        }
      },
    }));

    /**
     * Key derivation function namespace.
     */
    var C_kdf = (C.kdf = {});

    /**
     * OpenSSL key derivation function.
     */
    var OpenSSLKdf = (C_kdf.OpenSSL = {
      /**
       * Derives a key and IV from a password.
       *
       * @param {string} password The password to derive from.
       * @param {number} keySize The size in words of the key to generate.
       * @param {number} ivSize The size in words of the IV to generate.
       * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
       *
       * @return {CipherParams} A cipher params object with the key, IV, and salt.
       *
       * @static
       *
       * @example
       *
       *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
       *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
       */
      execute: function (password, keySize, ivSize, salt) {
        // Generate random salt
        if (!salt) {
          salt = WordArray.random(64 / 8);
        }

        // Derive key and IV
        var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(
          password,
          salt,
        );

        // Separate key and IV
        var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
        key.sigBytes = keySize * 4;

        // Return params
        return CipherParams.create({ key: key, iv: iv, salt: salt });
      },
    });

    /**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    var PasswordBasedCipher = (C_lib.PasswordBasedCipher =
      SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
          kdf: OpenSSLKdf,
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg);

          // Derive key and other params
          var derivedParams = cfg.kdf.execute(
            password,
            cipher.keySize,
            cipher.ivSize,
          );

          // Add IV to config
          cfg.iv = derivedParams.iv;

          // Encrypt
          var ciphertext = SerializableCipher.encrypt.call(
            this,
            cipher,
            message,
            derivedParams.key,
            cfg,
          );

          // Mix in derived params
          ciphertext.mixIn(derivedParams);

          return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg);

          // Convert string to CipherParams
          ciphertext = this._parse(ciphertext, cfg.format);

          // Derive key and other params
          var derivedParams = cfg.kdf.execute(
            password,
            cipher.keySize,
            cipher.ivSize,
            ciphertext.salt,
          );

          // Add IV to config
          cfg.iv = derivedParams.iv;

          // Decrypt
          var plaintext = SerializableCipher.decrypt.call(
            this,
            cipher,
            ciphertext,
            derivedParams.key,
            cfg,
          );

          return plaintext;
        },
      }));
  })();

/**
 * Cipher Feedback block mode.
 */
CryptoJS.mode.CFB = (function () {
  var CFB = CryptoJS.lib.BlockCipherMode.extend();

  CFB.Encryptor = CFB.extend({
    processBlock: function (words, offset) {
      // Shortcuts
      var cipher = this._cipher;
      var blockSize = cipher.blockSize;

      generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

      // Remember this block to use with next block
      this._prevBlock = words.slice(offset, offset + blockSize);
    },
  });

  CFB.Decryptor = CFB.extend({
    processBlock: function (words, offset) {
      // Shortcuts
      var cipher = this._cipher;
      var blockSize = cipher.blockSize;

      // Remember this block to use with next block
      var thisBlock = words.slice(offset, offset + blockSize);

      generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

      // This block becomes the previous block
      this._prevBlock = thisBlock;
    },
  });

  function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
    // Shortcut
    var iv = this._iv;

    // Generate keystream
    if (iv) {
      var keystream = iv.slice(0);

      // Remove IV for subsequent blocks
      this._iv = undefined;
    } else {
      var keystream = this._prevBlock;
    }
    cipher.encryptBlock(keystream, 0);

    // Encrypt
    for (var i = 0; i < blockSize; i++) {
      words[offset + i] ^= keystream[i];
    }
  }

  return CFB;
})();

/**
 * Electronic Codebook block mode.
 */
CryptoJS.mode.ECB = (function () {
  var ECB = CryptoJS.lib.BlockCipherMode.extend();

  ECB.Encryptor = ECB.extend({
    processBlock: function (words, offset) {
      this._cipher.encryptBlock(words, offset);
    },
  });

  ECB.Decryptor = ECB.extend({
    processBlock: function (words, offset) {
      this._cipher.decryptBlock(words, offset);
    },
  });

  return ECB;
})();

/**
 * ANSI X.923 padding strategy.
 */
CryptoJS.pad.AnsiX923 = {
  pad: function (data, blockSize) {
    // Shortcuts
    var dataSigBytes = data.sigBytes;
    var blockSizeBytes = blockSize * 4;

    // Count padding bytes
    var nPaddingBytes = blockSizeBytes - (dataSigBytes % blockSizeBytes);

    // Compute last byte position
    var lastBytePos = dataSigBytes + nPaddingBytes - 1;

    // Pad
    data.clamp();
    data.words[lastBytePos >>> 2] |=
      nPaddingBytes << (24 - (lastBytePos % 4) * 8);
    data.sigBytes += nPaddingBytes;
  },

  unpad: function (data) {
    // Get number of padding bytes from last byte
    var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    // Remove padding
    data.sigBytes -= nPaddingBytes;
  },
};

/**
 * ISO 10126 padding strategy.
 */
CryptoJS.pad.Iso10126 = {
  pad: function (data, blockSize) {
    // Shortcut
    var blockSizeBytes = blockSize * 4;

    // Count padding bytes
    var nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);

    // Pad
    data
      .concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1))
      .concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
  },

  unpad: function (data) {
    // Get number of padding bytes from last byte
    var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    // Remove padding
    data.sigBytes -= nPaddingBytes;
  },
};

/**
 * ISO/IEC 9797-1 Padding Method 2.
 */
CryptoJS.pad.Iso97971 = {
  pad: function (data, blockSize) {
    // Add 0x80 byte
    data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

    // Zero pad the rest
    CryptoJS.pad.ZeroPadding.pad(data, blockSize);
  },

  unpad: function (data) {
    // Remove zero padding
    CryptoJS.pad.ZeroPadding.unpad(data);

    // Remove one more byte -- the 0x80 byte
    data.sigBytes--;
  },
};

/**
 * Output Feedback block mode.
 */
CryptoJS.mode.OFB = (function () {
  var OFB = CryptoJS.lib.BlockCipherMode.extend();

  var Encryptor = (OFB.Encryptor = OFB.extend({
    processBlock: function (words, offset) {
      // Shortcuts
      var cipher = this._cipher;
      var blockSize = cipher.blockSize;
      var iv = this._iv;
      var keystream = this._keystream;

      // Generate keystream
      if (iv) {
        keystream = this._keystream = iv.slice(0);

        // Remove IV for subsequent blocks
        this._iv = undefined;
      }
      cipher.encryptBlock(keystream, 0);

      // Encrypt
      for (var i = 0; i < blockSize; i++) {
        words[offset + i] ^= keystream[i];
      }
    },
  }));

  OFB.Decryptor = Encryptor;

  return OFB;
})();

/**
 * A noop padding strategy.
 */
CryptoJS.pad.NoPadding = {
  pad: function () {},

  unpad: function () {},
};

(function (undefined) {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var CipherParams = C_lib.CipherParams;
  var C_enc = C.enc;
  var Hex = C_enc.Hex;
  var C_format = C.format;

  var HexFormatter = (C_format.Hex = {
    /**
     * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
     *
     * @param {CipherParams} cipherParams The cipher params object.
     *
     * @return {string} The hexadecimally encoded string.
     *
     * @static
     *
     * @example
     *
     *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
     */
    stringify: function (cipherParams) {
      return cipherParams.ciphertext.toString(Hex);
    },

    /**
     * Converts a hexadecimally encoded ciphertext string to a cipher params object.
     *
     * @param {string} input The hexadecimally encoded string.
     *
     * @return {CipherParams} The cipher params object.
     *
     * @static
     *
     * @example
     *
     *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
     */
    parse: function (input) {
      var ciphertext = Hex.parse(input);
      return CipherParams.create({ ciphertext: ciphertext });
    },
  });
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var BlockCipher = C_lib.BlockCipher;
  var C_algo = C.algo;

  // Lookup tables
  var SBOX = [];
  var INV_SBOX = [];
  var SUB_MIX_0 = [];
  var SUB_MIX_1 = [];
  var SUB_MIX_2 = [];
  var SUB_MIX_3 = [];
  var INV_SUB_MIX_0 = [];
  var INV_SUB_MIX_1 = [];
  var INV_SUB_MIX_2 = [];
  var INV_SUB_MIX_3 = [];

  // Compute lookup tables
  (function () {
    // Compute double table
    var d = [];
    for (var i = 0; i < 256; i++) {
      if (i < 128) {
        d[i] = i << 1;
      } else {
        d[i] = (i << 1) ^ 0x11b;
      }
    }

    // Walk GF(2^8)
    var x = 0;
    var xi = 0;
    for (var i = 0; i < 256; i++) {
      // Compute sbox
      var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
      sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
      SBOX[x] = sx;
      INV_SBOX[sx] = x;

      // Compute multiplication
      var x2 = d[x];
      var x4 = d[x2];
      var x8 = d[x4];

      // Compute sub bytes, mix columns tables
      var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
      SUB_MIX_0[x] = (t << 24) | (t >>> 8);
      SUB_MIX_1[x] = (t << 16) | (t >>> 16);
      SUB_MIX_2[x] = (t << 8) | (t >>> 24);
      SUB_MIX_3[x] = t;

      // Compute inv sub bytes, inv mix columns tables
      var t =
        (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
      INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
      INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
      INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
      INV_SUB_MIX_3[sx] = t;

      // Compute next counter
      if (!x) {
        x = xi = 1;
      } else {
        x = x2 ^ d[d[d[x8 ^ x2]]];
        xi ^= d[d[xi]];
      }
    }
  })();

  // Precomputed Rcon lookup
  var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

  /**
   * AES block cipher algorithm.
   */
  var AES = (C_algo.AES = BlockCipher.extend({
    _doReset: function () {
      // Skip reset of nRounds has been set before and key did not change
      if (this._nRounds && this._keyPriorReset === this._key) {
        return;
      }

      // Shortcuts
      var key = (this._keyPriorReset = this._key);
      var keyWords = key.words;
      var keySize = key.sigBytes / 4;

      // Compute number of rounds
      var nRounds = (this._nRounds = keySize + 6);

      // Compute number of key schedule rows
      var ksRows = (nRounds + 1) * 4;

      // Compute key schedule
      var keySchedule = (this._keySchedule = []);
      for (var ksRow = 0; ksRow < ksRows; ksRow++) {
        if (ksRow < keySize) {
          keySchedule[ksRow] = keyWords[ksRow];
        } else {
          var t = keySchedule[ksRow - 1];

          if (!(ksRow % keySize)) {
            // Rot word
            t = (t << 8) | (t >>> 24);

            // Sub word
            t =
              (SBOX[t >>> 24] << 24) |
              (SBOX[(t >>> 16) & 0xff] << 16) |
              (SBOX[(t >>> 8) & 0xff] << 8) |
              SBOX[t & 0xff];

            // Mix Rcon
            t ^= RCON[(ksRow / keySize) | 0] << 24;
          } else if (keySize > 6 && ksRow % keySize == 4) {
            // Sub word
            t =
              (SBOX[t >>> 24] << 24) |
              (SBOX[(t >>> 16) & 0xff] << 16) |
              (SBOX[(t >>> 8) & 0xff] << 8) |
              SBOX[t & 0xff];
          }

          keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
        }
      }

      // Compute inv key schedule
      var invKeySchedule = (this._invKeySchedule = []);
      for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
        var ksRow = ksRows - invKsRow;

        if (invKsRow % 4) {
          var t = keySchedule[ksRow];
        } else {
          var t = keySchedule[ksRow - 4];
        }

        if (invKsRow < 4 || ksRow <= 4) {
          invKeySchedule[invKsRow] = t;
        } else {
          invKeySchedule[invKsRow] =
            INV_SUB_MIX_0[SBOX[t >>> 24]] ^
            INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
            INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^
            INV_SUB_MIX_3[SBOX[t & 0xff]];
        }
      }
    },

    encryptBlock: function (M, offset) {
      this._doCryptBlock(
        M,
        offset,
        this._keySchedule,
        SUB_MIX_0,
        SUB_MIX_1,
        SUB_MIX_2,
        SUB_MIX_3,
        SBOX,
      );
    },

    decryptBlock: function (M, offset) {
      // Swap 2nd and 4th rows
      var t = M[offset + 1];
      M[offset + 1] = M[offset + 3];
      M[offset + 3] = t;

      this._doCryptBlock(
        M,
        offset,
        this._invKeySchedule,
        INV_SUB_MIX_0,
        INV_SUB_MIX_1,
        INV_SUB_MIX_2,
        INV_SUB_MIX_3,
        INV_SBOX,
      );

      // Inv swap 2nd and 4th rows
      var t = M[offset + 1];
      M[offset + 1] = M[offset + 3];
      M[offset + 3] = t;
    },

    _doCryptBlock: function (
      M,
      offset,
      keySchedule,
      SUB_MIX_0,
      SUB_MIX_1,
      SUB_MIX_2,
      SUB_MIX_3,
      SBOX,
    ) {
      // Shortcut
      var nRounds = this._nRounds;

      // Get input, add round key
      var s0 = M[offset] ^ keySchedule[0];
      var s1 = M[offset + 1] ^ keySchedule[1];
      var s2 = M[offset + 2] ^ keySchedule[2];
      var s3 = M[offset + 3] ^ keySchedule[3];

      // Key schedule row counter
      var ksRow = 4;

      // Rounds
      for (var round = 1; round < nRounds; round++) {
        // Shift rows, sub bytes, mix columns, add round key
        var t0 =
          SUB_MIX_0[s0 >>> 24] ^
          SUB_MIX_1[(s1 >>> 16) & 0xff] ^
          SUB_MIX_2[(s2 >>> 8) & 0xff] ^
          SUB_MIX_3[s3 & 0xff] ^
          keySchedule[ksRow++];
        var t1 =
          SUB_MIX_0[s1 >>> 24] ^
          SUB_MIX_1[(s2 >>> 16) & 0xff] ^
          SUB_MIX_2[(s3 >>> 8) & 0xff] ^
          SUB_MIX_3[s0 & 0xff] ^
          keySchedule[ksRow++];
        var t2 =
          SUB_MIX_0[s2 >>> 24] ^
          SUB_MIX_1[(s3 >>> 16) & 0xff] ^
          SUB_MIX_2[(s0 >>> 8) & 0xff] ^
          SUB_MIX_3[s1 & 0xff] ^
          keySchedule[ksRow++];
        var t3 =
          SUB_MIX_0[s3 >>> 24] ^
          SUB_MIX_1[(s0 >>> 16) & 0xff] ^
          SUB_MIX_2[(s1 >>> 8) & 0xff] ^
          SUB_MIX_3[s2 & 0xff] ^
          keySchedule[ksRow++];

        // Update state
        s0 = t0;
        s1 = t1;
        s2 = t2;
        s3 = t3;
      }

      // Shift rows, sub bytes, add round key
      var t0 =
        ((SBOX[s0 >>> 24] << 24) |
          (SBOX[(s1 >>> 16) & 0xff] << 16) |
          (SBOX[(s2 >>> 8) & 0xff] << 8) |
          SBOX[s3 & 0xff]) ^
        keySchedule[ksRow++];
      var t1 =
        ((SBOX[s1 >>> 24] << 24) |
          (SBOX[(s2 >>> 16) & 0xff] << 16) |
          (SBOX[(s3 >>> 8) & 0xff] << 8) |
          SBOX[s0 & 0xff]) ^
        keySchedule[ksRow++];
      var t2 =
        ((SBOX[s2 >>> 24] << 24) |
          (SBOX[(s3 >>> 16) & 0xff] << 16) |
          (SBOX[(s0 >>> 8) & 0xff] << 8) |
          SBOX[s1 & 0xff]) ^
        keySchedule[ksRow++];
      var t3 =
        ((SBOX[s3 >>> 24] << 24) |
          (SBOX[(s0 >>> 16) & 0xff] << 16) |
          (SBOX[(s1 >>> 8) & 0xff] << 8) |
          SBOX[s2 & 0xff]) ^
        keySchedule[ksRow++];

      // Set output
      M[offset] = t0;
      M[offset + 1] = t1;
      M[offset + 2] = t2;
      M[offset + 3] = t3;
    },

    keySize: 256 / 32,
  }));

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
   */
  C.AES = BlockCipher._createHelper(AES);
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var BlockCipher = C_lib.BlockCipher;
  var C_algo = C.algo;

  // Permuted Choice 1 constants
  var PC1 = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
    27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46,
    38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
  ];

  // Permuted Choice 2 constants
  var PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
    20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32,
  ];

  // Cumulative bit shift constants
  var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

  // SBOXes and round permutation constants
  var SBOX_P = [
    {
      0x0: 0x808200,
      0x10000000: 0x8000,
      0x20000000: 0x808002,
      0x30000000: 0x2,
      0x40000000: 0x200,
      0x50000000: 0x808202,
      0x60000000: 0x800202,
      0x70000000: 0x800000,
      0x80000000: 0x202,
      0x90000000: 0x800200,
      0xa0000000: 0x8200,
      0xb0000000: 0x808000,
      0xc0000000: 0x8002,
      0xd0000000: 0x800002,
      0xe0000000: 0x0,
      0xf0000000: 0x8202,
      0x8000000: 0x0,
      0x18000000: 0x808202,
      0x28000000: 0x8202,
      0x38000000: 0x8000,
      0x48000000: 0x808200,
      0x58000000: 0x200,
      0x68000000: 0x808002,
      0x78000000: 0x2,
      0x88000000: 0x800200,
      0x98000000: 0x8200,
      0xa8000000: 0x808000,
      0xb8000000: 0x800202,
      0xc8000000: 0x800002,
      0xd8000000: 0x8002,
      0xe8000000: 0x202,
      0xf8000000: 0x800000,
      0x1: 0x8000,
      0x10000001: 0x2,
      0x20000001: 0x808200,
      0x30000001: 0x800000,
      0x40000001: 0x808002,
      0x50000001: 0x8200,
      0x60000001: 0x200,
      0x70000001: 0x800202,
      0x80000001: 0x808202,
      0x90000001: 0x808000,
      0xa0000001: 0x800002,
      0xb0000001: 0x8202,
      0xc0000001: 0x202,
      0xd0000001: 0x800200,
      0xe0000001: 0x8002,
      0xf0000001: 0x0,
      0x8000001: 0x808202,
      0x18000001: 0x808000,
      0x28000001: 0x800000,
      0x38000001: 0x200,
      0x48000001: 0x8000,
      0x58000001: 0x800002,
      0x68000001: 0x2,
      0x78000001: 0x8202,
      0x88000001: 0x8002,
      0x98000001: 0x800202,
      0xa8000001: 0x202,
      0xb8000001: 0x808200,
      0xc8000001: 0x800200,
      0xd8000001: 0x0,
      0xe8000001: 0x8200,
      0xf8000001: 0x808002,
    },
    {
      0x0: 0x40084010,
      0x1000000: 0x4000,
      0x2000000: 0x80000,
      0x3000000: 0x40080010,
      0x4000000: 0x40000010,
      0x5000000: 0x40084000,
      0x6000000: 0x40004000,
      0x7000000: 0x10,
      0x8000000: 0x84000,
      0x9000000: 0x40004010,
      0xa000000: 0x40000000,
      0xb000000: 0x84010,
      0xc000000: 0x80010,
      0xd000000: 0x0,
      0xe000000: 0x4010,
      0xf000000: 0x40080000,
      0x800000: 0x40004000,
      0x1800000: 0x84010,
      0x2800000: 0x10,
      0x3800000: 0x40004010,
      0x4800000: 0x40084010,
      0x5800000: 0x40000000,
      0x6800000: 0x80000,
      0x7800000: 0x40080010,
      0x8800000: 0x80010,
      0x9800000: 0x0,
      0xa800000: 0x4000,
      0xb800000: 0x40080000,
      0xc800000: 0x40000010,
      0xd800000: 0x84000,
      0xe800000: 0x40084000,
      0xf800000: 0x4010,
      0x10000000: 0x0,
      0x11000000: 0x40080010,
      0x12000000: 0x40004010,
      0x13000000: 0x40084000,
      0x14000000: 0x40080000,
      0x15000000: 0x10,
      0x16000000: 0x84010,
      0x17000000: 0x4000,
      0x18000000: 0x4010,
      0x19000000: 0x80000,
      0x1a000000: 0x80010,
      0x1b000000: 0x40000010,
      0x1c000000: 0x84000,
      0x1d000000: 0x40004000,
      0x1e000000: 0x40000000,
      0x1f000000: 0x40084010,
      0x10800000: 0x84010,
      0x11800000: 0x80000,
      0x12800000: 0x40080000,
      0x13800000: 0x4000,
      0x14800000: 0x40004000,
      0x15800000: 0x40084010,
      0x16800000: 0x10,
      0x17800000: 0x40000000,
      0x18800000: 0x40084000,
      0x19800000: 0x40000010,
      0x1a800000: 0x40004010,
      0x1b800000: 0x80010,
      0x1c800000: 0x0,
      0x1d800000: 0x4010,
      0x1e800000: 0x40080010,
      0x1f800000: 0x84000,
    },
    {
      0x0: 0x104,
      0x100000: 0x0,
      0x200000: 0x4000100,
      0x300000: 0x10104,
      0x400000: 0x10004,
      0x500000: 0x4000004,
      0x600000: 0x4010104,
      0x700000: 0x4010000,
      0x800000: 0x4000000,
      0x900000: 0x4010100,
      0xa00000: 0x10100,
      0xb00000: 0x4010004,
      0xc00000: 0x4000104,
      0xd00000: 0x10000,
      0xe00000: 0x4,
      0xf00000: 0x100,
      0x80000: 0x4010100,
      0x180000: 0x4010004,
      0x280000: 0x0,
      0x380000: 0x4000100,
      0x480000: 0x4000004,
      0x580000: 0x10000,
      0x680000: 0x10004,
      0x780000: 0x104,
      0x880000: 0x4,
      0x980000: 0x100,
      0xa80000: 0x4010000,
      0xb80000: 0x10104,
      0xc80000: 0x10100,
      0xd80000: 0x4000104,
      0xe80000: 0x4010104,
      0xf80000: 0x4000000,
      0x1000000: 0x4010100,
      0x1100000: 0x10004,
      0x1200000: 0x10000,
      0x1300000: 0x4000100,
      0x1400000: 0x100,
      0x1500000: 0x4010104,
      0x1600000: 0x4000004,
      0x1700000: 0x0,
      0x1800000: 0x4000104,
      0x1900000: 0x4000000,
      0x1a00000: 0x4,
      0x1b00000: 0x10100,
      0x1c00000: 0x4010000,
      0x1d00000: 0x104,
      0x1e00000: 0x10104,
      0x1f00000: 0x4010004,
      0x1080000: 0x4000000,
      0x1180000: 0x104,
      0x1280000: 0x4010100,
      0x1380000: 0x0,
      0x1480000: 0x10004,
      0x1580000: 0x4000100,
      0x1680000: 0x100,
      0x1780000: 0x4010004,
      0x1880000: 0x10000,
      0x1980000: 0x4010104,
      0x1a80000: 0x10104,
      0x1b80000: 0x4000004,
      0x1c80000: 0x4000104,
      0x1d80000: 0x4010000,
      0x1e80000: 0x4,
      0x1f80000: 0x10100,
    },
    {
      0x0: 0x80401000,
      0x10000: 0x80001040,
      0x20000: 0x401040,
      0x30000: 0x80400000,
      0x40000: 0x0,
      0x50000: 0x401000,
      0x60000: 0x80000040,
      0x70000: 0x400040,
      0x80000: 0x80000000,
      0x90000: 0x400000,
      0xa0000: 0x40,
      0xb0000: 0x80001000,
      0xc0000: 0x80400040,
      0xd0000: 0x1040,
      0xe0000: 0x1000,
      0xf0000: 0x80401040,
      0x8000: 0x80001040,
      0x18000: 0x40,
      0x28000: 0x80400040,
      0x38000: 0x80001000,
      0x48000: 0x401000,
      0x58000: 0x80401040,
      0x68000: 0x0,
      0x78000: 0x80400000,
      0x88000: 0x1000,
      0x98000: 0x80401000,
      0xa8000: 0x400000,
      0xb8000: 0x1040,
      0xc8000: 0x80000000,
      0xd8000: 0x400040,
      0xe8000: 0x401040,
      0xf8000: 0x80000040,
      0x100000: 0x400040,
      0x110000: 0x401000,
      0x120000: 0x80000040,
      0x130000: 0x0,
      0x140000: 0x1040,
      0x150000: 0x80400040,
      0x160000: 0x80401000,
      0x170000: 0x80001040,
      0x180000: 0x80401040,
      0x190000: 0x80000000,
      0x1a0000: 0x80400000,
      0x1b0000: 0x401040,
      0x1c0000: 0x80001000,
      0x1d0000: 0x400000,
      0x1e0000: 0x40,
      0x1f0000: 0x1000,
      0x108000: 0x80400000,
      0x118000: 0x80401040,
      0x128000: 0x0,
      0x138000: 0x401000,
      0x148000: 0x400040,
      0x158000: 0x80000000,
      0x168000: 0x80001040,
      0x178000: 0x40,
      0x188000: 0x80000040,
      0x198000: 0x1000,
      0x1a8000: 0x80001000,
      0x1b8000: 0x80400040,
      0x1c8000: 0x1040,
      0x1d8000: 0x80401000,
      0x1e8000: 0x400000,
      0x1f8000: 0x401040,
    },
    {
      0x0: 0x80,
      0x1000: 0x1040000,
      0x2000: 0x40000,
      0x3000: 0x20000000,
      0x4000: 0x20040080,
      0x5000: 0x1000080,
      0x6000: 0x21000080,
      0x7000: 0x40080,
      0x8000: 0x1000000,
      0x9000: 0x20040000,
      0xa000: 0x20000080,
      0xb000: 0x21040080,
      0xc000: 0x21040000,
      0xd000: 0x0,
      0xe000: 0x1040080,
      0xf000: 0x21000000,
      0x800: 0x1040080,
      0x1800: 0x21000080,
      0x2800: 0x80,
      0x3800: 0x1040000,
      0x4800: 0x40000,
      0x5800: 0x20040080,
      0x6800: 0x21040000,
      0x7800: 0x20000000,
      0x8800: 0x20040000,
      0x9800: 0x0,
      0xa800: 0x21040080,
      0xb800: 0x1000080,
      0xc800: 0x20000080,
      0xd800: 0x21000000,
      0xe800: 0x1000000,
      0xf800: 0x40080,
      0x10000: 0x40000,
      0x11000: 0x80,
      0x12000: 0x20000000,
      0x13000: 0x21000080,
      0x14000: 0x1000080,
      0x15000: 0x21040000,
      0x16000: 0x20040080,
      0x17000: 0x1000000,
      0x18000: 0x21040080,
      0x19000: 0x21000000,
      0x1a000: 0x1040000,
      0x1b000: 0x20040000,
      0x1c000: 0x40080,
      0x1d000: 0x20000080,
      0x1e000: 0x0,
      0x1f000: 0x1040080,
      0x10800: 0x21000080,
      0x11800: 0x1000000,
      0x12800: 0x1040000,
      0x13800: 0x20040080,
      0x14800: 0x20000000,
      0x15800: 0x1040080,
      0x16800: 0x80,
      0x17800: 0x21040000,
      0x18800: 0x40080,
      0x19800: 0x21040080,
      0x1a800: 0x0,
      0x1b800: 0x21000000,
      0x1c800: 0x1000080,
      0x1d800: 0x40000,
      0x1e800: 0x20040000,
      0x1f800: 0x20000080,
    },
    {
      0x0: 0x10000008,
      0x100: 0x2000,
      0x200: 0x10200000,
      0x300: 0x10202008,
      0x400: 0x10002000,
      0x500: 0x200000,
      0x600: 0x200008,
      0x700: 0x10000000,
      0x800: 0x0,
      0x900: 0x10002008,
      0xa00: 0x202000,
      0xb00: 0x8,
      0xc00: 0x10200008,
      0xd00: 0x202008,
      0xe00: 0x2008,
      0xf00: 0x10202000,
      0x80: 0x10200000,
      0x180: 0x10202008,
      0x280: 0x8,
      0x380: 0x200000,
      0x480: 0x202008,
      0x580: 0x10000008,
      0x680: 0x10002000,
      0x780: 0x2008,
      0x880: 0x200008,
      0x980: 0x2000,
      0xa80: 0x10002008,
      0xb80: 0x10200008,
      0xc80: 0x0,
      0xd80: 0x10202000,
      0xe80: 0x202000,
      0xf80: 0x10000000,
      0x1000: 0x10002000,
      0x1100: 0x10200008,
      0x1200: 0x10202008,
      0x1300: 0x2008,
      0x1400: 0x200000,
      0x1500: 0x10000000,
      0x1600: 0x10000008,
      0x1700: 0x202000,
      0x1800: 0x202008,
      0x1900: 0x0,
      0x1a00: 0x8,
      0x1b00: 0x10200000,
      0x1c00: 0x2000,
      0x1d00: 0x10002008,
      0x1e00: 0x10202000,
      0x1f00: 0x200008,
      0x1080: 0x8,
      0x1180: 0x202000,
      0x1280: 0x200000,
      0x1380: 0x10000008,
      0x1480: 0x10002000,
      0x1580: 0x2008,
      0x1680: 0x10202008,
      0x1780: 0x10200000,
      0x1880: 0x10202000,
      0x1980: 0x10200008,
      0x1a80: 0x2000,
      0x1b80: 0x202008,
      0x1c80: 0x200008,
      0x1d80: 0x0,
      0x1e80: 0x10000000,
      0x1f80: 0x10002008,
    },
    {
      0x0: 0x100000,
      0x10: 0x2000401,
      0x20: 0x400,
      0x30: 0x100401,
      0x40: 0x2100401,
      0x50: 0x0,
      0x60: 0x1,
      0x70: 0x2100001,
      0x80: 0x2000400,
      0x90: 0x100001,
      0xa0: 0x2000001,
      0xb0: 0x2100400,
      0xc0: 0x2100000,
      0xd0: 0x401,
      0xe0: 0x100400,
      0xf0: 0x2000000,
      0x8: 0x2100001,
      0x18: 0x0,
      0x28: 0x2000401,
      0x38: 0x2100400,
      0x48: 0x100000,
      0x58: 0x2000001,
      0x68: 0x2000000,
      0x78: 0x401,
      0x88: 0x100401,
      0x98: 0x2000400,
      0xa8: 0x2100000,
      0xb8: 0x100001,
      0xc8: 0x400,
      0xd8: 0x2100401,
      0xe8: 0x1,
      0xf8: 0x100400,
      0x100: 0x2000000,
      0x110: 0x100000,
      0x120: 0x2000401,
      0x130: 0x2100001,
      0x140: 0x100001,
      0x150: 0x2000400,
      0x160: 0x2100400,
      0x170: 0x100401,
      0x180: 0x401,
      0x190: 0x2100401,
      0x1a0: 0x100400,
      0x1b0: 0x1,
      0x1c0: 0x0,
      0x1d0: 0x2100000,
      0x1e0: 0x2000001,
      0x1f0: 0x400,
      0x108: 0x100400,
      0x118: 0x2000401,
      0x128: 0x2100001,
      0x138: 0x1,
      0x148: 0x2000000,
      0x158: 0x100000,
      0x168: 0x401,
      0x178: 0x2100400,
      0x188: 0x2000001,
      0x198: 0x2100000,
      0x1a8: 0x0,
      0x1b8: 0x2100401,
      0x1c8: 0x100401,
      0x1d8: 0x400,
      0x1e8: 0x2000400,
      0x1f8: 0x100001,
    },
    {
      0x0: 0x8000820,
      0x1: 0x20000,
      0x2: 0x8000000,
      0x3: 0x20,
      0x4: 0x20020,
      0x5: 0x8020820,
      0x6: 0x8020800,
      0x7: 0x800,
      0x8: 0x8020000,
      0x9: 0x8000800,
      0xa: 0x20800,
      0xb: 0x8020020,
      0xc: 0x820,
      0xd: 0x0,
      0xe: 0x8000020,
      0xf: 0x20820,
      0x80000000: 0x800,
      0x80000001: 0x8020820,
      0x80000002: 0x8000820,
      0x80000003: 0x8000000,
      0x80000004: 0x8020000,
      0x80000005: 0x20800,
      0x80000006: 0x20820,
      0x80000007: 0x20,
      0x80000008: 0x8000020,
      0x80000009: 0x820,
      0x8000000a: 0x20020,
      0x8000000b: 0x8020800,
      0x8000000c: 0x0,
      0x8000000d: 0x8020020,
      0x8000000e: 0x8000800,
      0x8000000f: 0x20000,
      0x10: 0x20820,
      0x11: 0x8020800,
      0x12: 0x20,
      0x13: 0x800,
      0x14: 0x8000800,
      0x15: 0x8000020,
      0x16: 0x8020020,
      0x17: 0x20000,
      0x18: 0x0,
      0x19: 0x20020,
      0x1a: 0x8020000,
      0x1b: 0x8000820,
      0x1c: 0x8020820,
      0x1d: 0x20800,
      0x1e: 0x820,
      0x1f: 0x8000000,
      0x80000010: 0x20000,
      0x80000011: 0x800,
      0x80000012: 0x8020020,
      0x80000013: 0x20820,
      0x80000014: 0x20,
      0x80000015: 0x8020000,
      0x80000016: 0x8000000,
      0x80000017: 0x8000820,
      0x80000018: 0x8020820,
      0x80000019: 0x8000020,
      0x8000001a: 0x8000800,
      0x8000001b: 0x0,
      0x8000001c: 0x20800,
      0x8000001d: 0x820,
      0x8000001e: 0x20020,
      0x8000001f: 0x8020800,
    },
  ];

  // Masks that select the SBOX input
  var SBOX_MASK = [
    0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000, 0x0001f800, 0x00001f80,
    0x000001f8, 0x8000001f,
  ];

  /**
   * DES block cipher algorithm.
   */
  var DES = (C_algo.DES = BlockCipher.extend({
    _doReset: function () {
      // Shortcuts
      var key = this._key;
      var keyWords = key.words;

      // Select 56 bits according to PC1
      var keyBits = [];
      for (var i = 0; i < 56; i++) {
        var keyBitPos = PC1[i] - 1;
        keyBits[i] =
          (keyWords[keyBitPos >>> 5] >>> (31 - (keyBitPos % 32))) & 1;
      }

      // Assemble 16 subkeys
      var subKeys = (this._subKeys = []);
      for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
        // Create subkey
        var subKey = (subKeys[nSubKey] = []);

        // Shortcut
        var bitShift = BIT_SHIFTS[nSubKey];

        // Select 48 bits according to PC2
        for (var i = 0; i < 24; i++) {
          // Select from the left 28 key bits
          subKey[(i / 6) | 0] |=
            keyBits[(PC2[i] - 1 + bitShift) % 28] << (31 - (i % 6));

          // Select from the right 28 key bits
          subKey[4 + ((i / 6) | 0)] |=
            keyBits[28 + ((PC2[i + 24] - 1 + bitShift) % 28)] << (31 - (i % 6));
        }

        // Since each subkey is applied to an expanded 32-bit input,
        // the subkey can be broken into 8 values scaled to 32-bits,
        // which allows the key to be used without expansion
        subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
        for (var i = 1; i < 7; i++) {
          subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
        }
        subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
      }

      // Compute inverse subkeys
      var invSubKeys = (this._invSubKeys = []);
      for (var i = 0; i < 16; i++) {
        invSubKeys[i] = subKeys[15 - i];
      }
    },

    encryptBlock: function (M, offset) {
      this._doCryptBlock(M, offset, this._subKeys);
    },

    decryptBlock: function (M, offset) {
      this._doCryptBlock(M, offset, this._invSubKeys);
    },

    _doCryptBlock: function (M, offset, subKeys) {
      // Get input
      this._lBlock = M[offset];
      this._rBlock = M[offset + 1];

      // Initial permutation
      exchangeLR.call(this, 4, 0x0f0f0f0f);
      exchangeLR.call(this, 16, 0x0000ffff);
      exchangeRL.call(this, 2, 0x33333333);
      exchangeRL.call(this, 8, 0x00ff00ff);
      exchangeLR.call(this, 1, 0x55555555);

      // Rounds
      for (var round = 0; round < 16; round++) {
        // Shortcuts
        var subKey = subKeys[round];
        var lBlock = this._lBlock;
        var rBlock = this._rBlock;

        // Feistel function
        var f = 0;
        for (var i = 0; i < 8; i++) {
          f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
        }
        this._lBlock = rBlock;
        this._rBlock = lBlock ^ f;
      }

      // Undo swap from last round
      var t = this._lBlock;
      this._lBlock = this._rBlock;
      this._rBlock = t;

      // Final permutation
      exchangeLR.call(this, 1, 0x55555555);
      exchangeRL.call(this, 8, 0x00ff00ff);
      exchangeRL.call(this, 2, 0x33333333);
      exchangeLR.call(this, 16, 0x0000ffff);
      exchangeLR.call(this, 4, 0x0f0f0f0f);

      // Set output
      M[offset] = this._lBlock;
      M[offset + 1] = this._rBlock;
    },

    keySize: 64 / 32,

    ivSize: 64 / 32,

    blockSize: 64 / 32,
  }));

  // Swap bits across the left and right words
  function exchangeLR(offset, mask) {
    var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
    this._rBlock ^= t;
    this._lBlock ^= t << offset;
  }

  function exchangeRL(offset, mask) {
    var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
    this._lBlock ^= t;
    this._rBlock ^= t << offset;
  }

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
   */
  C.DES = BlockCipher._createHelper(DES);

  /**
   * Triple-DES block cipher algorithm.
   */
  var TripleDES = (C_algo.TripleDES = BlockCipher.extend({
    _doReset: function () {
      // Shortcuts
      var key = this._key;
      var keyWords = key.words;

      // Create DES instances
      this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
      this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
      this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
    },

    encryptBlock: function (M, offset) {
      this._des1.encryptBlock(M, offset);
      this._des2.decryptBlock(M, offset);
      this._des3.encryptBlock(M, offset);
    },

    decryptBlock: function (M, offset) {
      this._des3.decryptBlock(M, offset);
      this._des2.encryptBlock(M, offset);
      this._des1.decryptBlock(M, offset);
    },

    keySize: 192 / 32,

    ivSize: 64 / 32,

    blockSize: 64 / 32,
  }));

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
   */
  C.TripleDES = BlockCipher._createHelper(TripleDES);
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var StreamCipher = C_lib.StreamCipher;
  var C_algo = C.algo;

  /**
   * RC4 stream cipher algorithm.
   */
  var RC4 = (C_algo.RC4 = StreamCipher.extend({
    _doReset: function () {
      // Shortcuts
      var key = this._key;
      var keyWords = key.words;
      var keySigBytes = key.sigBytes;

      // Init sbox
      var S = (this._S = []);
      for (var i = 0; i < 256; i++) {
        S[i] = i;
      }

      // Key setup
      for (var i = 0, j = 0; i < 256; i++) {
        var keyByteIndex = i % keySigBytes;
        var keyByte =
          (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) &
          0xff;

        j = (j + S[i] + keyByte) % 256;

        // Swap
        var t = S[i];
        S[i] = S[j];
        S[j] = t;
      }

      // Counters
      this._i = this._j = 0;
    },

    _doProcessBlock: function (M, offset) {
      M[offset] ^= generateKeystreamWord.call(this);
    },

    keySize: 256 / 32,

    ivSize: 0,
  }));

  function generateKeystreamWord() {
    // Shortcuts
    var S = this._S;
    var i = this._i;
    var j = this._j;

    // Generate keystream word
    var keystreamWord = 0;
    for (var n = 0; n < 4; n++) {
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;

      // Swap
      var t = S[i];
      S[i] = S[j];
      S[j] = t;

      keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
    }

    // Update counters
    this._i = i;
    this._j = j;

    return keystreamWord;
  }

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
   */
  C.RC4 = StreamCipher._createHelper(RC4);

  /**
   * Modified RC4 stream cipher algorithm.
   */
  var RC4Drop = (C_algo.RC4Drop = RC4.extend({
    /**
     * Configuration options.
     *
     * @property {number} drop The number of keystream words to drop. Default 192
     */
    cfg: RC4.cfg.extend({
      drop: 192,
    }),

    _doReset: function () {
      RC4._doReset.call(this);

      // Drop
      for (var i = this.cfg.drop; i > 0; i--) {
        generateKeystreamWord.call(this);
      }
    },
  }));

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
   */
  C.RC4Drop = StreamCipher._createHelper(RC4Drop);
})();

/** @preserve
 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
 * derived from CryptoJS.mode.CTR
 * Jan Hruby jhruby.web@gmail.com
 */
CryptoJS.mode.CTRGladman = (function () {
  var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

  function incWord(word) {
    if (((word >> 24) & 0xff) === 0xff) {
      //overflow
      var b1 = (word >> 16) & 0xff;
      var b2 = (word >> 8) & 0xff;
      var b3 = word & 0xff;

      if (b1 === 0xff) {
        // overflow b1
        b1 = 0;
        if (b2 === 0xff) {
          b2 = 0;
          if (b3 === 0xff) {
            b3 = 0;
          } else {
            ++b3;
          }
        } else {
          ++b2;
        }
      } else {
        ++b1;
      }

      word = 0;
      word += b1 << 16;
      word += b2 << 8;
      word += b3;
    } else {
      word += 0x01 << 24;
    }
    return word;
  }

  function incCounter(counter) {
    if ((counter[0] = incWord(counter[0])) === 0) {
      // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
      counter[1] = incWord(counter[1]);
    }
    return counter;
  }

  var Encryptor = (CTRGladman.Encryptor = CTRGladman.extend({
    processBlock: function (words, offset) {
      // Shortcuts
      var cipher = this._cipher;
      var blockSize = cipher.blockSize;
      var iv = this._iv;
      var counter = this._counter;

      // Generate keystream
      if (iv) {
        counter = this._counter = iv.slice(0);

        // Remove IV for subsequent blocks
        this._iv = undefined;
      }

      incCounter(counter);

      var keystream = counter.slice(0);
      cipher.encryptBlock(keystream, 0);

      // Encrypt
      for (var i = 0; i < blockSize; i++) {
        words[offset + i] ^= keystream[i];
      }
    },
  }));

  CTRGladman.Decryptor = Encryptor;

  return CTRGladman;
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var StreamCipher = C_lib.StreamCipher;
  var C_algo = C.algo;

  // Reusable objects
  var S = [];
  var C_ = [];
  var G = [];

  /**
   * Rabbit stream cipher algorithm
   */
  var Rabbit = (C_algo.Rabbit = StreamCipher.extend({
    _doReset: function () {
      // Shortcuts
      var K = this._key.words;
      var iv = this.cfg.iv;

      // Swap endian
      for (var i = 0; i < 4; i++) {
        K[i] =
          (((K[i] << 8) | (K[i] >>> 24)) & 0x00ff00ff) |
          (((K[i] << 24) | (K[i] >>> 8)) & 0xff00ff00);
      }

      // Generate initial state values
      var X = (this._X = [
        K[0],
        (K[3] << 16) | (K[2] >>> 16),
        K[1],
        (K[0] << 16) | (K[3] >>> 16),
        K[2],
        (K[1] << 16) | (K[0] >>> 16),
        K[3],
        (K[2] << 16) | (K[1] >>> 16),
      ]);

      // Generate initial counter values
      var C = (this._C = [
        (K[2] << 16) | (K[2] >>> 16),
        (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
        (K[3] << 16) | (K[3] >>> 16),
        (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
        (K[0] << 16) | (K[0] >>> 16),
        (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
        (K[1] << 16) | (K[1] >>> 16),
        (K[3] & 0xffff0000) | (K[0] & 0x0000ffff),
      ]);

      // Carry bit
      this._b = 0;

      // Iterate the system four times
      for (var i = 0; i < 4; i++) {
        nextState.call(this);
      }

      // Modify the counters
      for (var i = 0; i < 8; i++) {
        C[i] ^= X[(i + 4) & 7];
      }

      // IV setup
      if (iv) {
        // Shortcuts
        var IV = iv.words;
        var IV_0 = IV[0];
        var IV_1 = IV[1];

        // Generate four subvectors
        var i0 =
          (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) |
          (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
        var i2 =
          (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) |
          (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
        var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
        var i3 = (i2 << 16) | (i0 & 0x0000ffff);

        // Modify counter values
        C[0] ^= i0;
        C[1] ^= i1;
        C[2] ^= i2;
        C[3] ^= i3;
        C[4] ^= i0;
        C[5] ^= i1;
        C[6] ^= i2;
        C[7] ^= i3;

        // Iterate the system four times
        for (var i = 0; i < 4; i++) {
          nextState.call(this);
        }
      }
    },

    _doProcessBlock: function (M, offset) {
      // Shortcut
      var X = this._X;

      // Iterate the system
      nextState.call(this);

      // Generate four keystream words
      S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
      S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
      S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
      S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

      for (var i = 0; i < 4; i++) {
        // Swap endian
        S[i] =
          (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
          (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

        // Encrypt
        M[offset + i] ^= S[i];
      }
    },

    blockSize: 128 / 32,

    ivSize: 64 / 32,
  }));

  function nextState() {
    // Shortcuts
    var X = this._X;
    var C = this._C;

    // Save old counter values
    for (var i = 0; i < 8; i++) {
      C_[i] = C[i];
    }

    // Calculate new counter values
    C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    C[1] = (C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0)) | 0;
    C[2] = (C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0)) | 0;
    C[3] = (C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0)) | 0;
    C[4] = (C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0)) | 0;
    C[5] = (C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0)) | 0;
    C[6] = (C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0)) | 0;
    C[7] = (C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0)) | 0;
    this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;

    // Calculate the g-values
    for (var i = 0; i < 8; i++) {
      var gx = X[i] + C[i];

      // Construct high and low argument for squaring
      var ga = gx & 0xffff;
      var gb = gx >>> 16;

      // Calculate high and low result of squaring
      var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
      var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

      // High XOR low
      G[i] = gh ^ gl;
    }

    // Calculate new state values
    X[0] =
      (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) |
      0;
    X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
    X[2] =
      (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) |
      0;
    X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
    X[4] =
      (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) |
      0;
    X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
    X[6] =
      (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) |
      0;
    X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
  }

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
   */
  C.Rabbit = StreamCipher._createHelper(Rabbit);
})();

/**
 * Counter block mode.
 */
CryptoJS.mode.CTR = (function () {
  var CTR = CryptoJS.lib.BlockCipherMode.extend();

  var Encryptor = (CTR.Encryptor = CTR.extend({
    processBlock: function (words, offset) {
      // Shortcuts
      var cipher = this._cipher;
      var blockSize = cipher.blockSize;
      var iv = this._iv;
      var counter = this._counter;

      // Generate keystream
      if (iv) {
        counter = this._counter = iv.slice(0);

        // Remove IV for subsequent blocks
        this._iv = undefined;
      }
      var keystream = counter.slice(0);
      cipher.encryptBlock(keystream, 0);

      // Increment counter
      counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

      // Encrypt
      for (var i = 0; i < blockSize; i++) {
        words[offset + i] ^= keystream[i];
      }
    },
  }));

  CTR.Decryptor = Encryptor;

  return CTR;
})();

(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var StreamCipher = C_lib.StreamCipher;
  var C_algo = C.algo;

  // Reusable objects
  var S = [];
  var C_ = [];
  var G = [];

  /**
   * Rabbit stream cipher algorithm.
   *
   * This is a legacy version that neglected to convert the key to little-endian.
   * This error doesn't affect the cipher's security,
   * but it does affect its compatibility with other implementations.
   */
  var RabbitLegacy = (C_algo.RabbitLegacy = StreamCipher.extend({
    _doReset: function () {
      // Shortcuts
      var K = this._key.words;
      var iv = this.cfg.iv;

      // Generate initial state values
      var X = (this._X = [
        K[0],
        (K[3] << 16) | (K[2] >>> 16),
        K[1],
        (K[0] << 16) | (K[3] >>> 16),
        K[2],
        (K[1] << 16) | (K[0] >>> 16),
        K[3],
        (K[2] << 16) | (K[1] >>> 16),
      ]);

      // Generate initial counter values
      var C = (this._C = [
        (K[2] << 16) | (K[2] >>> 16),
        (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
        (K[3] << 16) | (K[3] >>> 16),
        (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
        (K[0] << 16) | (K[0] >>> 16),
        (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
        (K[1] << 16) | (K[1] >>> 16),
        (K[3] & 0xffff0000) | (K[0] & 0x0000ffff),
      ]);

      // Carry bit
      this._b = 0;

      // Iterate the system four times
      for (var i = 0; i < 4; i++) {
        nextState.call(this);
      }

      // Modify the counters
      for (var i = 0; i < 8; i++) {
        C[i] ^= X[(i + 4) & 7];
      }

      // IV setup
      if (iv) {
        // Shortcuts
        var IV = iv.words;
        var IV_0 = IV[0];
        var IV_1 = IV[1];

        // Generate four subvectors
        var i0 =
          (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) |
          (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
        var i2 =
          (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) |
          (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
        var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
        var i3 = (i2 << 16) | (i0 & 0x0000ffff);

        // Modify counter values
        C[0] ^= i0;
        C[1] ^= i1;
        C[2] ^= i2;
        C[3] ^= i3;
        C[4] ^= i0;
        C[5] ^= i1;
        C[6] ^= i2;
        C[7] ^= i3;

        // Iterate the system four times
        for (var i = 0; i < 4; i++) {
          nextState.call(this);
        }
      }
    },

    _doProcessBlock: function (M, offset) {
      // Shortcut
      var X = this._X;

      // Iterate the system
      nextState.call(this);

      // Generate four keystream words
      S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
      S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
      S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
      S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

      for (var i = 0; i < 4; i++) {
        // Swap endian
        S[i] =
          (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
          (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

        // Encrypt
        M[offset + i] ^= S[i];
      }
    },

    blockSize: 128 / 32,

    ivSize: 64 / 32,
  }));

  function nextState() {
    // Shortcuts
    var X = this._X;
    var C = this._C;

    // Save old counter values
    for (var i = 0; i < 8; i++) {
      C_[i] = C[i];
    }

    // Calculate new counter values
    C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    C[1] = (C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0)) | 0;
    C[2] = (C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0)) | 0;
    C[3] = (C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0)) | 0;
    C[4] = (C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0)) | 0;
    C[5] = (C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0)) | 0;
    C[6] = (C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0)) | 0;
    C[7] = (C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0)) | 0;
    this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;

    // Calculate the g-values
    for (var i = 0; i < 8; i++) {
      var gx = X[i] + C[i];

      // Construct high and low argument for squaring
      var ga = gx & 0xffff;
      var gb = gx >>> 16;

      // Calculate high and low result of squaring
      var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
      var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

      // High XOR low
      G[i] = gh ^ gl;
    }

    // Calculate new state values
    X[0] =
      (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) |
      0;
    X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
    X[2] =
      (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) |
      0;
    X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
    X[4] =
      (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) |
      0;
    X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
    X[6] =
      (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) |
      0;
    X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
  }

  /**
   * Shortcut functions to the cipher's object interface.
   *
   * @example
   *
   *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
   *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
   */
  C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
})();

/**
 * Zero padding strategy.
 */
CryptoJS.pad.ZeroPadding = {
  pad: function (data, blockSize) {
    // Shortcut
    var blockSizeBytes = blockSize * 4;

    // Pad
    data.clamp();
    data.sigBytes +=
      blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
  },

  unpad: function (data) {
    // Shortcut
    var dataWords = data.words;

    // Unpad
    var i = data.sigBytes - 1;
    while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
      i--;
    }
    data.sigBytes = i + 1;
  },
};

// ****** END CRYPTO-JS ******


(function (window, undefined) {
  "use strict";

  //////////////
  // Constants
  /////////////

  var LIBVERSION = "0.7.20",
    EMPTY = "",
    UNKNOWN = "?",
    FUNC_TYPE = "function",
    UNDEF_TYPE = "undefined",
    OBJ_TYPE = "object",
    STR_TYPE = "string",
    MAJOR = "major", // deprecated
    MODEL = "model",
    NAME = "name",
    TYPE = "type",
    VENDOR = "vendor",
    VERSION = "version",
    ARCHITECTURE = "architecture",
    CONSOLE = "console",
    MOBILE = "mobile",
    TABLET = "tablet",
    SMARTTV = "smarttv",
    WEARABLE = "wearable",
    EMBEDDED = "embedded";

  ///////////
  // Helper
  //////////

  var util = {
    extend: function (regexes, extensions) {
      var mergedRegexes = {};
      for (var i in regexes) {
        if (extensions[i] && extensions[i].length % 2 === 0) {
          mergedRegexes[i] = extensions[i].concat(regexes[i]);
        } else {
          mergedRegexes[i] = regexes[i];
        }
      }
      return mergedRegexes;
    },
    has: function (str1, str2) {
      if (typeof str1 === "string") {
        return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
      } else {
        return false;
      }
    },
    lowerize: function (str) {
      return str.toLowerCase();
    },
    major: function (version) {
      return typeof version === STR_TYPE
        ? version.replace(/[^\d\.]/g, "").split(".")[0]
        : undefined;
    },
    trim: function (str) {
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    },
  };

  ///////////////
  // Map helper
  //////////////

  var mapper = {
    rgx: function (ua, arrays) {
      var i = 0,
        j,
        k,
        p,
        q,
        matches,
        match;

      // loop through all regexes maps
      while (i < arrays.length && !matches) {
        var regex = arrays[i], // even sequence (0,2,4,..)
          props = arrays[i + 1]; // odd sequence (1,3,5,..)
        j = k = 0;

        // try matching uastring with regexes
        while (j < regex.length && !matches) {
          matches = regex[j++].exec(ua);

          if (!!matches) {
            for (p = 0; p < props.length; p++) {
              match = matches[++k];
              q = props[p];
              // check if given property is actually array
              if (typeof q === OBJ_TYPE && q.length > 0) {
                if (q.length == 2) {
                  if (typeof q[1] == FUNC_TYPE) {
                    // assign modified match
                    this[q[0]] = q[1].call(this, match);
                  } else {
                    // assign given value, ignore regex match
                    this[q[0]] = q[1];
                  }
                } else if (q.length == 3) {
                  // check whether function or regex
                  if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                    // call function (usually string mapper)
                    this[q[0]] = match
                      ? q[1].call(this, match, q[2])
                      : undefined;
                  } else {
                    // sanitize match using given regex
                    this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                  }
                } else if (q.length == 4) {
                  this[q[0]] = match
                    ? q[3].call(this, match.replace(q[1], q[2]))
                    : undefined;
                }
              } else {
                this[q] = match ? match : undefined;
              }
            }
          }
        }
        i += 2;
      }
    },

    str: function (str, map) {
      for (var i in map) {
        // check if array
        if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
          for (var j = 0; j < map[i].length; j++) {
            if (util.has(map[i][j], str)) {
              return i === UNKNOWN ? undefined : i;
            }
          }
        } else if (util.has(map[i], str)) {
          return i === UNKNOWN ? undefined : i;
        }
      }
      return str;
    },
  };

  ///////////////
  // String map
  //////////////

  var maps = {
    browser: {
      oldsafari: {
        version: {
          "1.0": "/8",
          1.2: "/1",
          1.3: "/3",
          "2.0": "/412",
          "2.0.2": "/416",
          "2.0.3": "/417",
          "2.0.4": "/419",
          "?": "/",
        },
      },
    },

    device: {
      amazon: {
        model: {
          "Fire Phone": ["SD", "KF"],
        },
      },
      sprint: {
        model: {
          "Evo Shift 4G": "7373KT",
        },
        vendor: {
          HTC: "APA",
          Sprint: "Sprint",
        },
      },
    },

    os: {
      windows: {
        version: {
          ME: "4.90",
          "NT 3.11": "NT3.51",
          "NT 4.0": "NT4.0",
          2000: "NT 5.0",
          XP: ["NT 5.1", "NT 5.2"],
          Vista: "NT 6.0",
          7: "NT 6.1",
          8: "NT 6.2",
          8.1: "NT 6.3",
          10: ["NT 6.4", "NT 10.0"],
          RT: "ARM",
        },
      },
    },
  };

  //////////////
  // Regex map
  /////////////

  var regexes = {
    browser: [
      [
        // Presto based
        /(opera\smini)\/([\w\.-]+)/i, // Opera Mini
        /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, // Opera Mobi/Tablet
        /(opera).+version\/([\w\.]+)/i, // Opera > 9.80
        /(opera)[\/\s]+([\w\.]+)/i, // Opera < 9.80
      ],
      [NAME, VERSION],
      [
        /(opios)[\/\s]+([\w\.]+)/i, // Opera mini on iphone >= 8.0
      ],
      [[NAME, "Opera Mini"], VERSION],
      [
        /\s(opr)\/([\w\.]+)/i, // Opera Webkit
      ],
      [[NAME, "Opera"], VERSION],
      [
        // Mixed
        /(kindle)\/([\w\.]+)/i, // Kindle
        /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
        // Lunascape/Maxthon/Netfront/Jasmine/Blazer

        // Trident based
        /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
        // Avant/IEMobile/SlimBrowser/Baidu
        /(?:ms|\()(ie)\s([\w\.]+)/i, // Internet Explorer

        // Webkit/KHTML based
        /(rekonq)\/([\w\.]*)/i, // Rekonq
        /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i,
        // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
      ],
      [NAME, VERSION],
      [
        /(konqueror)\/([\w\.]+)/i, // Konqueror
      ],
      [[NAME, "Konqueror"], VERSION],
      [
        /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i, // IE11
      ],
      [[NAME, "IE"], VERSION],
      [
        /(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i, // Microsoft Edge
      ],
      [[NAME, "Edge"], VERSION],
      [
        /(yabrowser)\/([\w\.]+)/i, // Yandex
      ],
      [[NAME, "Yandex"], VERSION],
      [
        /(puffin)\/([\w\.]+)/i, // Puffin
      ],
      [[NAME, "Puffin"], VERSION],
      [
        /(focus)\/([\w\.]+)/i, // Firefox Focus
      ],
      [[NAME, "Firefox Focus"], VERSION],
      [
        /(opt)\/([\w\.]+)/i, // Opera Touch
      ],
      [[NAME, "Opera Touch"], VERSION],
      [
        /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i, // UCBrowser
      ],
      [[NAME, "UCBrowser"], VERSION],
      [
        /(comodo_dragon)\/([\w\.]+)/i, // Comodo Dragon
      ],
      [[NAME, /_/g, " "], VERSION],
      [
        /(windowswechat qbcore)\/([\w\.]+)/i, // WeChat Desktop for Windows Built-in Browser
      ],
      [[NAME, "WeChat(Win) Desktop"], VERSION],
      [
        /(micromessenger)\/([\w\.]+)/i, // WeChat
      ],
      [[NAME, "WeChat"], VERSION],
      [
        /(brave)\/([\w\.]+)/i, // Brave browser
      ],
      [[NAME, "Brave"], VERSION],
      [
        /(qqbrowserlite)\/([\w\.]+)/i, // QQBrowserLite
      ],
      [NAME, VERSION],
      [
        /(QQ)\/([\d\.]+)/i, // QQ, aka ShouQ
      ],
      [NAME, VERSION],
      [
        /m?(qqbrowser)[\/\s]?([\w\.]+)/i, // QQBrowser
      ],
      [NAME, VERSION],
      [
        /(BIDUBrowser)[\/\s]?([\w\.]+)/i, // Baidu Browser
      ],
      [NAME, VERSION],
      [
        /(2345Explorer)[\/\s]?([\w\.]+)/i, // 2345 Browser
      ],
      [NAME, VERSION],
      [
        /(MetaSr)[\/\s]?([\w\.]+)/i, // SouGouBrowser
      ],
      [NAME],
      [
        /(LBBROWSER)/i, // LieBao Browser
      ],
      [NAME],
      [
        /xiaomi\/miuibrowser\/([\w\.]+)/i, // MIUI Browser
      ],
      [VERSION, [NAME, "MIUI Browser"]],
      [
        /;fbav\/([\w\.]+);/i, // Facebook App for iOS & Android
      ],
      [VERSION, [NAME, "Facebook"]],
      [
        /safari\s(line)\/([\w\.]+)/i, // Line App for iOS
        /android.+(line)\/([\w\.]+)\/iab/i, // Line App for Android
      ],
      [NAME, VERSION],
      [
        /headlesschrome(?:\/([\w\.]+)|\s)/i, // Chrome Headless
      ],
      [VERSION, [NAME, "Chrome Headless"]],
      [
        /\swv\).+(chrome)\/([\w\.]+)/i, // Chrome WebView
      ],
      [[NAME, /(.+)/, "$1 WebView"], VERSION],
      [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
      [[NAME, /(.+(?:g|us))(.+)/, "$1 $2"], VERSION],
      [
        // Oculus / Samsung Browser

        /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i, // Android Browser
      ],
      [VERSION, [NAME, "Android Browser"]],
      [
        /(sailfishbrowser)\/([\w\.]+)/i, // Sailfish Browser
      ],
      [[NAME, "Sailfish Browser"], VERSION],
      [
        /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
        // Chrome/OmniWeb/Arora/Tizen/Nokia
      ],
      [NAME, VERSION],
      [
        /(dolfin)\/([\w\.]+)/i, // Dolphin
      ],
      [[NAME, "Dolphin"], VERSION],
      [
        /((?:android.+)crmo|crios)\/([\w\.]+)/i, // Chrome for Android/iOS
      ],
      [[NAME, "Chrome"], VERSION],
      [
        /(coast)\/([\w\.]+)/i, // Opera Coast
      ],
      [[NAME, "Opera Coast"], VERSION],
      [
        /fxios\/([\w\.-]+)/i, // Firefox for iOS
      ],
      [VERSION, [NAME, "Firefox"]],
      [
        /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i, // Mobile Safari
      ],
      [VERSION, [NAME, "Mobile Safari"]],
      [
        /version\/([\w\.]+).+?(mobile\s?safari|safari)/i, // Safari & Safari Mobile
      ],
      [VERSION, NAME],
      [
        /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i, // Google Search Appliance on iOS
      ],
      [[NAME, "GSA"], VERSION],
      [
        /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i, // Safari < 3.0
      ],
      [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]],
      [/(webkit|khtml)\/([\w\.]+)/i],
      [NAME, VERSION],
      [
        // Gecko based
        /(navigator|netscape)\/([\w\.-]+)/i, // Netscape
      ],
      [[NAME, "Netscape"], VERSION],
      [
        /(swiftfox)/i, // Swiftfox
        /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
        // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
        /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

        // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
        /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, // Mozilla

        // Other
        /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
        // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
        /(links)\s\(([\w\.]+)/i, // Links
        /(gobrowser)\/?([\w\.]*)/i, // GoBrowser
        /(ice\s?browser)\/v?([\w\._]+)/i, // ICE Browser
        /(mosaic)[\/\s]([\w\.]+)/i, // Mosaic
      ],
      [NAME, VERSION],
    ],

    cpu: [
      [
        /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i, // AMD64
      ],
      [[ARCHITECTURE, "amd64"]],
      [
        /(ia32(?=;))/i, // IA32 (quicktime)
      ],
      [[ARCHITECTURE, util.lowerize]],
      [
        /((?:i[346]|x)86)[;\)]/i, // IA32
      ],
      [[ARCHITECTURE, "ia32"]],
      [
        // PocketPC mistakenly identified as PowerPC
        /windows\s(ce|mobile);\sppc;/i,
      ],
      [[ARCHITECTURE, "arm"]],
      [
        /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i, // PowerPC
      ],
      [[ARCHITECTURE, /ower/, "", util.lowerize]],
      [
        /(sun4\w)[;\)]/i, // SPARC
      ],
      [[ARCHITECTURE, "sparc"]],
      [
        /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i,
        // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
      ],
      [[ARCHITECTURE, util.lowerize]],
    ],

    device: [
      [
        /\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i, // iPad/PlayBook
      ],
      [MODEL, VENDOR, [TYPE, TABLET]],
      [
        /applecoremedia\/[\w\.]+ \((ipad)/, // iPad
      ],
      [MODEL, [VENDOR, "Apple"], [TYPE, TABLET]],
      [
        /(apple\s{0,1}tv)/i, // Apple TV
      ],
      [
        [MODEL, "Apple TV"],
        [VENDOR, "Apple"],
      ],
      [
        /(archos)\s(gamepad2?)/i, // Archos
        /(hp).+(touchpad)/i, // HP TouchPad
        /(hp).+(tablet)/i, // HP Tablet
        /(kindle)\/([\w\.]+)/i, // Kindle
        /\s(nook)[\w\s]+build\/(\w+)/i, // Nook
        /(dell)\s(strea[kpr\s\d]*[\dko])/i, // Dell Streak
      ],
      [VENDOR, MODEL, [TYPE, TABLET]],
      [
        /(kf[A-z]+)\sbuild\/.+silk\//i, // Kindle Fire HD
      ],
      [MODEL, [VENDOR, "Amazon"], [TYPE, TABLET]],
      [
        /(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i, // Fire Phone
      ],
      [
        [MODEL, mapper.str, maps.device.amazon.model],
        [VENDOR, "Amazon"],
        [TYPE, MOBILE],
      ],
      [
        /android.+aft([bms])\sbuild/i, // Fire TV
      ],
      [MODEL, [VENDOR, "Amazon"], [TYPE, SMARTTV]],
      [
        /\((ip[honed|\s\w*]+);.+(apple)/i, // iPod/iPhone
      ],
      [MODEL, VENDOR, [TYPE, MOBILE]],
      [
        /\((ip[honed|\s\w*]+);/i, // iPod/iPhone
      ],
      [MODEL, [VENDOR, "Apple"], [TYPE, MOBILE]],
      [
        /(blackberry)[\s-]?(\w+)/i, // BlackBerry
        /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
        // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
        /(hp)\s([\w\s]+\w)/i, // HP iPAQ
        /(asus)-?(\w+)/i, // Asus
      ],
      [VENDOR, MODEL, [TYPE, MOBILE]],
      [
        /\(bb10;\s(\w+)/i, // BlackBerry 10
      ],
      [MODEL, [VENDOR, "BlackBerry"], [TYPE, MOBILE]],
      [
        // Asus Tablets
        /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i,
      ],
      [MODEL, [VENDOR, "Asus"], [TYPE, TABLET]],
      [
        /(sony)\s(tablet\s[ps])\sbuild\//i, // Sony
        /(sony)?(?:sgp.+)\sbuild\//i,
      ],
      [
        [VENDOR, "Sony"],
        [MODEL, "Xperia Tablet"],
        [TYPE, TABLET],
      ],
      [
        /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
      ],
      [MODEL, [VENDOR, "Sony"], [TYPE, MOBILE]],
      [
        /\s(ouya)\s/i, // Ouya
        /(nintendo)\s([wids3u]+)/i, // Nintendo
      ],
      [VENDOR, MODEL, [TYPE, CONSOLE]],
      [
        /android.+;\s(shield)\sbuild/i, // Nvidia
      ],
      [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]],
      [
        /(playstation\s[34portablevi]+)/i, // Playstation
      ],
      [MODEL, [VENDOR, "Sony"], [TYPE, CONSOLE]],
      [
        /(sprint\s(\w+))/i, // Sprint Phones
      ],
      [
        [VENDOR, mapper.str, maps.device.sprint.vendor],
        [MODEL, mapper.str, maps.device.sprint.model],
        [TYPE, MOBILE],
      ],
      [
        /(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i, // HTC
        /(zte)-(\w*)/i, // ZTE
        /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i,
        // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
      ],
      [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
      [
        /(nexus\s9)/i, // HTC Nexus 9
      ],
      [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
      [
        /d\/huawei([\w\s-]+)[;\)]/i,
        /(nexus\s6p)/i, // Huawei
      ],
      [MODEL, [VENDOR, "Huawei"], [TYPE, MOBILE]],
      [
        /(microsoft);\s(lumia[\s\w]+)/i, // Microsoft Lumia
      ],
      [VENDOR, MODEL, [TYPE, MOBILE]],
      [
        /[\s\(;](xbox(?:\sone)?)[\s\);]/i, // Microsoft Xbox
      ],
      [MODEL, [VENDOR, "Microsoft"], [TYPE, CONSOLE]],
      [
        /(kin\.[onetw]{3})/i, // Microsoft Kin
      ],
      [
        [MODEL, /\./g, " "],
        [VENDOR, "Microsoft"],
        [TYPE, MOBILE],
      ],
      [
        // Motorola
        /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
        /mot[\s-]?(\w*)/i,
        /(XT\d{3,4}) build\//i,
        /(nexus\s6)/i,
      ],
      [MODEL, [VENDOR, "Motorola"], [TYPE, MOBILE]],
      [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
      [MODEL, [VENDOR, "Motorola"], [TYPE, TABLET]],
      [
        /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i, // HbbTV devices
      ],
      [
        [VENDOR, util.trim],
        [MODEL, util.trim],
        [TYPE, SMARTTV],
      ],
      [/hbbtv.+maple;(\d+)/i],
      [
        [MODEL, /^/, "SmartTV"],
        [VENDOR, "Samsung"],
        [TYPE, SMARTTV],
      ],
      [
        /\(dtv[\);].+(aquos)/i, // Sharp
      ],
      [MODEL, [VENDOR, "Sharp"], [TYPE, SMARTTV]],
      [
        /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
        /((SM-T\w+))/i,
      ],
      [[VENDOR, "Samsung"], MODEL, [TYPE, TABLET]],
      [
        // Samsung
        /smart-tv.+(samsung)/i,
      ],
      [VENDOR, [TYPE, SMARTTV], MODEL],
      [
        /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
        /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
        /sec-((sgh\w+))/i,
      ],
      [[VENDOR, "Samsung"], MODEL, [TYPE, MOBILE]],
      [
        /sie-(\w*)/i, // Siemens
      ],
      [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
      [
        /(maemo|nokia).*(n900|lumia\s\d+)/i, // Nokia
        /(nokia)[\s_-]?([\w-]*)/i,
      ],
      [[VENDOR, "Nokia"], MODEL, [TYPE, MOBILE]],
      [
        /android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i, // Acer
      ],
      [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
      [
        /android.+([vl]k\-?\d{3})\s+build/i, // LG Tablet
      ],
      [MODEL, [VENDOR, "LG"], [TYPE, TABLET]],
      [
        /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i, // LG Tablet
      ],
      [[VENDOR, "LG"], MODEL, [TYPE, TABLET]],
      [
        /(lg) netcast\.tv/i, // LG SmartTV
      ],
      [VENDOR, MODEL, [TYPE, SMARTTV]],
      [
        /(nexus\s[45])/i, // LG
        /lg[e;\s\/-]+(\w*)/i,
        /android.+lg(\-?[\d\w]+)\s+build/i,
      ],
      [MODEL, [VENDOR, "LG"], [TYPE, MOBILE]],
      [
        /(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i, // Lenovo tablets
      ],
      [VENDOR, MODEL, [TYPE, TABLET]],
      [
        /android.+(ideatab[a-z0-9\-\s]+)/i, // Lenovo
      ],
      [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]],
      [/(lenovo)[_\s-]?([\w-]+)/i],
      [VENDOR, MODEL, [TYPE, MOBILE]],
      [
        /linux;.+((jolla));/i, // Jolla
      ],
      [VENDOR, MODEL, [TYPE, MOBILE]],
      [
        /((pebble))app\/[\d\.]+\s/i, // Pebble
      ],
      [VENDOR, MODEL, [TYPE, WEARABLE]],
      [
        /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i, // OPPO
      ],
      [VENDOR, MODEL, [TYPE, MOBILE]],
      [
        /crkey/i, // Google Chromecast
      ],
      [
        [MODEL, "Chromecast"],
        [VENDOR, "Google"],
      ],
      [
        /android.+;\s(glass)\s\d/i, // Google Glass
      ],
      [MODEL, [VENDOR, "Google"], [TYPE, WEARABLE]],
      [
        /android.+;\s(pixel c)[\s)]/i, // Google Pixel C
      ],
      [MODEL, [VENDOR, "Google"], [TYPE, TABLET]],
      [
        /android.+;\s(pixel( [23])?( xl)?)[\s)]/i, // Google Pixel
      ],
      [MODEL, [VENDOR, "Google"], [TYPE, MOBILE]],
      [
        /android.+;\s(\w+)\s+build\/hm\1/i, // Xiaomi Hongmi 'numeric' models
        /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Hongmi
        /android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,
        // Xiaomi Mi
        /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i, // Redmi Phones
      ],
      [
        [MODEL, /_/g, " "],
        [VENDOR, "Xiaomi"],
        [TYPE, MOBILE],
      ],
      [
        /android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i, // Mi Pad tablets
      ],
      [
        [MODEL, /_/g, " "],
        [VENDOR, "Xiaomi"],
        [TYPE, TABLET],
      ],
      [
        /android.+;\s(m[1-5]\snote)\sbuild/i, // Meizu
      ],
      [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
      [/(mz)-([\w-]{2,})/i],
      [[VENDOR, "Meizu"], MODEL, [TYPE, MOBILE]],
      [
        /android.+a000(1)\s+build/i, // OnePlus
        /android.+oneplus\s(a\d{4})\s+build/i,
      ],
      [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]],
      [
        /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i, // RCA Tablets
      ],
      [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
      [
        /android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i, // Dell Venue Tablets
      ],
      [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i, // Verizon Tablet
      ],
      [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i, // Barnes & Noble Tablet
      ],
      [[VENDOR, "Barnes & Noble"], MODEL, [TYPE, TABLET]],
      [
        /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i, // Barnes & Noble Tablet
      ],
      [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
      [
        /android.+;\s(k88)\sbuild/i, // ZTE K Series Tablet
      ],
      [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i, // Swiss GEN Mobile
      ],
      [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
      [
        /android.+[;\/]\s*(zur\d{3})\s+build/i, // Swiss ZUR Tablet
      ],
      [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i, // Zeki Tablets
      ],
      [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
      [
        /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
        /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i, // Dragon Touch Tablet
      ],
      [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i, // Insignia Tablets
      ],
      [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i, // NextBook Tablets
      ],
      [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i,
      ],
      [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
      [
        // Voice Xtreme Phones

        /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i, // LvTel Phones
      ],
      [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
      [/android.+;\s(PH-1)\s/i],
      [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
      [
        // Essential PH-1

        /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i, // Envizen Tablets
      ],
      [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i, // Le Pan Tablets
      ],
      [VENDOR, MODEL, [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i, // MachSpeed Tablets
      ],
      [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
      [
        /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i, // Trinity Tablets
      ],
      [VENDOR, MODEL, [TYPE, TABLET]],
      [
        /android.+[;\/]\s*TU_(1491)\s+build/i, // Rotor Tablets
      ],
      [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
      [
        /android.+(KS(.+))\s+build/i, // Amazon Kindle Tablets
      ],
      [MODEL, [VENDOR, "Amazon"], [TYPE, TABLET]],
      [
        /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i, // Gigaset Tablets
      ],
      [VENDOR, MODEL, [TYPE, TABLET]],
      [
        /\s(tablet|tab)[;\/]/i, // Unidentifiable Tablet
        /\s(mobile)(?:[;\/]|\ssafari)/i, // Unidentifiable Mobile
      ],
      [[TYPE, util.lowerize], VENDOR, MODEL],
      [
        /[\s\/\(](smart-?tv)[;\)]/i, // SmartTV
      ],
      [[TYPE, SMARTTV]],
      [
        /(android[\w\.\s\-]{0,9});.+build/i, // Generic Android Device
      ],
      [MODEL, [VENDOR, "Generic"]],
    ],

    engine: [
      [
        /windows.+\sedge\/([\w\.]+)/i, // EdgeHTML
      ],
      [VERSION, [NAME, "EdgeHTML"]],
      [
        /webkit\/537\.36.+chrome\/(?!27)/i, // Blink
      ],
      [[NAME, "Blink"]],
      [
        /(presto)\/([\w\.]+)/i, // Presto
        /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
        // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
        /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, // KHTML/Tasman/Links
        /(icab)[\/\s]([23]\.[\d\.]+)/i, // iCab
      ],
      [NAME, VERSION],
      [
        /rv\:([\w\.]{1,9}).+(gecko)/i, // Gecko
      ],
      [VERSION, NAME],
    ],

    os: [
      [
        // Windows based
        /microsoft\s(windows)\s(vista|xp)/i, // Windows (iTunes)
      ],
      [NAME, VERSION],
      [
        /(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
        /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, // Windows Phone
        /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i,
      ],
      [NAME, [VERSION, mapper.str, maps.os.windows.version]],
      [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
      [
        [NAME, "Windows"],
        [VERSION, mapper.str, maps.os.windows.version],
      ],
      [
        // Mobile/Embedded OS
        /\((bb)(10);/i, // BlackBerry 10
      ],
      [[NAME, "BlackBerry"], VERSION],
      [
        /(blackberry)\w*\/?([\w\.]*)/i, // Blackberry
        /(tizen)[\/\s]([\w\.]+)/i, // Tizen
        /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i,
        // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki/Sailfish OS
      ],
      [NAME, VERSION],
      [
        /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i, // Symbian
      ],
      [[NAME, "Symbian"], VERSION],
      [
        /\((series40);/i, // Series 40
      ],
      [NAME],
      [
        /mozilla.+\(mobile;.+gecko.+firefox/i, // Firefox OS
      ],
      [[NAME, "Firefox OS"], VERSION],
      [
        // Console
        /(nintendo|playstation)\s([wids34portablevu]+)/i, // Nintendo/Playstation

        // GNU/Linux based
        /(mint)[\/\s\(]?(\w*)/i, // Mint
        /(mageia|vectorlinux)[;\s]/i, // Mageia/VectorLinux
        /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
        // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
        // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
        /(hurd|linux)\s?([\w\.]*)/i, // Hurd/Linux
        /(gnu)\s?([\w\.]*)/i, // GNU
      ],
      [NAME, VERSION],
      [
        /(cros)\s[\w]+\s([\w\.]+\w)/i, // Chromium OS
      ],
      [[NAME, "Chromium OS"], VERSION],
      [
        // Solaris
        /(sunos)\s?([\w\.\d]*)/i, // Solaris
      ],
      [[NAME, "Solaris"], VERSION],
      [
        // BSD based
        /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
      ],
      [NAME, VERSION],
      [
        /(haiku)\s(\w+)/i, // Haiku
      ],
      [NAME, VERSION],
      [
        /cfnetwork\/.+darwin/i,
        /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i, // iOS
      ],
      [
        [VERSION, /_/g, "."],
        [NAME, "iOS"],
      ],
      [
        /(mac\sos\sx)\s?([\w\s\.]*)/i,
        /(macintosh|mac(?=_powerpc)\s)/i, // Mac OS
      ],
      [
        [NAME, "Mac OS"],
        [VERSION, /_/g, "."],
      ],
      [
        // Other
        /((?:open)?solaris)[\/\s-]?([\w\.]*)/i, // Solaris
        /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, // AIX
        /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
        // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS/Fuchsia
        /(unix)\s?([\w\.]*)/i, // UNIX
      ],
      [NAME, VERSION],
    ],
  };

  /////////////////
  // Constructor
  ////////////////
  var UAParser = function (uastring, extensions) {
    if (typeof uastring === "object") {
      extensions = uastring;
      uastring = undefined;
    }

    if (!(this instanceof UAParser)) {
      return new UAParser(uastring, extensions).getResult();
    }

    var ua =
      uastring ||
      (window && window.navigator && window.navigator.userAgent
        ? window.navigator.userAgent
        : EMPTY);
    var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

    this.getBrowser = function () {
      var browser = { name: undefined, version: undefined };
      mapper.rgx.call(browser, ua, rgxmap.browser);
      browser.major = util.major(browser.version); // deprecated
      return browser;
    };
    this.getCPU = function () {
      var cpu = { architecture: undefined };
      mapper.rgx.call(cpu, ua, rgxmap.cpu);
      return cpu;
    };
    this.getDevice = function () {
      var device = { vendor: undefined, model: undefined, type: undefined };
      mapper.rgx.call(device, ua, rgxmap.device);
      return device;
    };
    this.getEngine = function () {
      var engine = { name: undefined, version: undefined };
      mapper.rgx.call(engine, ua, rgxmap.engine);
      return engine;
    };
    this.getOS = function () {
      var os = { name: undefined, version: undefined };
      mapper.rgx.call(os, ua, rgxmap.os);
      return os;
    };
    this.getResult = function () {
      return {
        ua: this.getUA(),
        browser: this.getBrowser(),
        engine: this.getEngine(),
        os: this.getOS(),
        device: this.getDevice(),
        cpu: this.getCPU(),
      };
    };
    this.getUA = function () {
      return ua;
    };
    this.setUA = function (uastring) {
      ua = uastring;
      return this;
    };
    return this;
  };

  UAParser.VERSION = LIBVERSION;
  UAParser.BROWSER = {
    NAME: NAME,
    MAJOR: MAJOR, // deprecated
    VERSION: VERSION,
  };
  UAParser.CPU = {
    ARCHITECTURE: ARCHITECTURE,
  };
  UAParser.DEVICE = {
    MODEL: MODEL,
    VENDOR: VENDOR,
    TYPE: TYPE,
    CONSOLE: CONSOLE,
    MOBILE: MOBILE,
    SMARTTV: SMARTTV,
    TABLET: TABLET,
    WEARABLE: WEARABLE,
    EMBEDDED: EMBEDDED,
  };
  UAParser.ENGINE = {
    NAME: NAME,
    VERSION: VERSION,
  };
  UAParser.OS = {
    NAME: NAME,
    VERSION: VERSION,
  };

  ///////////
  // Export
  //////////

  // check js environment
  if (typeof exports !== UNDEF_TYPE) {
    // nodejs env
    if (typeof module !== UNDEF_TYPE && module.exports) {
      exports = module.exports = UAParser;
    }
    exports.UAParser = UAParser;
  } else {
    // requirejs env (optional)
    if (typeof define === "function" && define.amd) {
      define(function () {
        return UAParser;
      });
    } else if (window) {
      // browser env
      window.UAParser = UAParser;
    }
  }

  // jQuery/Zepto specific (optional)
  // Note:
  //   In AMD env the global scope should be kept clean, but jQuery is an exception.
  //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
  //   and we should catch that.
  var $ = window && (window.jQuery || window.Zepto);
  if (typeof $ !== UNDEF_TYPE && !$.ua) {
    var parser = new UAParser();
    $.ua = parser.getResult();
    $.ua.get = function () {
      return parser.getUA();
    };
    $.ua.set = function (uastring) {
      parser.setUA(uastring);
      var result = parser.getResult();
      for (var prop in result) {
        $.ua[prop] = result[prop];
      }
    };
  }

  // ***** END OF UAPARSER *****


  /*!
   * protobuf.js v7.3.2 (c) 2016, daniel wirtz
   * compiled wed, 12 jun 2024 08:24:21 utc
   * licensed under the bsd-3-clause license
   * see: https://github.com/dcodeio/protobuf.js for details
   */
!function(g){"use strict";!function(r,e,t){var i=function t(i){var n=e[i];return n||r[i][0].call(n=e[i]={exports:{}},t,n,n.exports),n.exports}(t[0]);i.util.global.protobuf=i,"function"==typeof define&&define.amd&&define(["long"],function(t){return t&&t.isLong&&(i.util.Long=t,i.configure()),i}),"object"==typeof module&&module&&module.exports&&(module.exports=i)}({1:[function(t,i,n){i.exports=function(t,i){var n=Array(arguments.length-1),s=0,r=2,u=!0;for(;r<arguments.length;)n[s++]=arguments[r++];return new Promise(function(r,e){n[s]=function(t){if(u)if(u=!1,t)e(t);else{for(var i=Array(arguments.length-1),n=0;n<i.length;)i[n++]=arguments[n];r.apply(null,i)}};try{t.apply(i||null,n)}catch(t){u&&(u=!1,e(t))}})}},{}],2:[function(t,i,n){n.length=function(t){var i=t.length;if(!i)return 0;for(var n=0;1<--i%4&&"="==(t[0|i]||"");)++n;return Math.ceil(3*t.length)/4-n};for(var f=Array(64),h=Array(123),r=0;r<64;)h[f[r]=r<26?r+65:r<52?r+71:r<62?r-4:r-59|43]=r++;n.encode=function(t,i,n){for(var r,e=null,s=[],u=0,o=0;i<n;){var h=t[i++];switch(o){case 0:s[u++]=f[h>>2],r=(3&h)<<4,o=1;break;case 1:s[u++]=f[r|h>>4],r=(15&h)<<2,o=2;break;case 2:s[u++]=f[r|h>>6],s[u++]=f[63&h],o=0}8191<u&&((e=e||[]).push(String.fromCharCode.apply(String,s)),u=0)}return o&&(s[u++]=f[r],s[u++]=61,1===o&&(s[u++]=61)),e?(u&&e.push(String.fromCharCode.apply(String,s.slice(0,u))),e.join("")):String.fromCharCode.apply(String,s.slice(0,u))};var c="invalid encoding";n.decode=function(t,i,n){for(var r,e=n,s=0,u=0;u<t.length;){var o=t.charCodeAt(u++);if(61==o&&1<s)break;if((o=h[o])===g)throw Error(c);switch(s){case 0:r=o,s=1;break;case 1:i[n++]=r<<2|(48&o)>>4,r=o,s=2;break;case 2:i[n++]=(15&r)<<4|(60&o)>>2,r=o,s=3;break;case 3:i[n++]=(3&r)<<6|o,s=0}}if(1===s)throw Error(c);return n-e},n.test=function(t){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t)}},{}],3:[function(t,i,n){function a(i,n){"string"==typeof i&&(n=i,i=g);var h=[];function f(t){if("string"!=typeof t){var i=c();if(a.verbose&&console.log("codegen: "+i),i="return "+i,t){for(var n=Object.keys(t),r=Array(n.length+1),e=Array(n.length),s=0;s<n.length;)r[s]=n[s],e[s]=t[n[s++]];return r[s]=i,Function.apply(null,r).apply(null,e)}return Function(i)()}for(var u=Array(arguments.length-1),o=0;o<u.length;)u[o]=arguments[++o];if(o=0,t=t.replace(/%([%dfijs])/g,function(t,i){var n=u[o++];switch(i){case"d":case"f":return""+ +(""+n);case"i":return""+Math.floor(n);case"j":return JSON.stringify(n);case"s":return""+n}return"%"}),o!==u.length)throw Error("parameter count mismatch");return h.push(t),f}function c(t){return"function "+(t||n||"")+"("+(i&&i.join(",")||"")+"){\n  "+h.join("\n  ")+"\n}"}return f.toString=c,f}(i.exports=a).verbose=!1},{}],4:[function(t,i,n){function r(){this.t={}}(i.exports=r).prototype.on=function(t,i,n){return(this.t[t]||(this.t[t]=[])).push({fn:i,ctx:n||this}),this},r.prototype.off=function(t,i){if(t===g)this.t={};else if(i===g)this.t[t]=[];else for(var n=this.t[t],r=0;r<n.length;)n[r].fn===i?n.splice(r,1):++r;return this},r.prototype.emit=function(t){var i=this.t[t];if(i){for(var n=[],r=1;r<arguments.length;)n.push(arguments[r++]);for(r=0;r<i.length;)i[r].fn.apply(i[r++].ctx,n)}return this}},{}],5:[function(t,i,n){i.exports=o;var s=t(1),u=t(7)("fs");function o(n,r,e){return r="function"==typeof r?(e=r,{}):r||{},e?!r.xhr&&u&&u.readFile?u.readFile(n,function(t,i){return t&&"undefined"!=typeof XMLHttpRequest?o.xhr(n,r,e):t?e(t):e(null,r.binary?i:i.toString("utf8"))}):o.xhr(n,r,e):s(o,this,n,r)}o.xhr=function(t,n,r){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4!==e.readyState)return g;if(0!==e.status&&200!==e.status)return r(Error("status "+e.status));if(n.binary){if(!(t=e.response))for(var t=[],i=0;i<e.responseText.length;++i)t.push(255&e.responseText.charCodeAt(i));return r(null,"undefined"!=typeof Uint8Array?new Uint8Array(t):t)}return r(null,e.responseText)},n.binary&&("overrideMimeType"in e&&e.overrideMimeType("text/plain; charset=x-user-defined"),e.responseType="arraybuffer"),e.open("GET",t),e.send()}},{1:1,7:7}],6:[function(t,i,n){function r(t){function i(t,i,n,r){var e=i<0?1:0;t(0===(i=e?-i:i)?0<1/i?0:2147483648:isNaN(i)?2143289344:34028234663852886e22<i?(e<<31|2139095040)>>>0:i<11754943508222875e-54?(e<<31|Math.round(i/1401298464324817e-60))>>>0:(e<<31|127+(t=Math.floor(Math.log(i)/Math.LN2))<<23|8388607&Math.round(i*Math.pow(2,-t)*8388608))>>>0,n,r)}function n(t,i,n){t=t(i,n),i=2*(t>>31)+1,n=t>>>23&255,t&=8388607;return 255==n?t?NaN:1/0*i:0==n?1401298464324817e-60*i*t:i*Math.pow(2,n-150)*(8388608+t)}function r(t,i,n){o[0]=t,i[n]=h[0],i[n+1]=h[1],i[n+2]=h[2],i[n+3]=h[3]}function e(t,i,n){o[0]=t,i[n]=h[3],i[n+1]=h[2],i[n+2]=h[1],i[n+3]=h[0]}function s(t,i){return h[0]=t[i],h[1]=t[i+1],h[2]=t[i+2],h[3]=t[i+3],o[0]}function u(t,i){return h[3]=t[i],h[2]=t[i+1],h[1]=t[i+2],h[0]=t[i+3],o[0]}var o,h,f,c,a;function l(t,i,n,r,e,s){var u,o=r<0?1:0;0===(r=o?-r:r)?(t(0,e,s+i),t(0<1/r?0:2147483648,e,s+n)):isNaN(r)?(t(0,e,s+i),t(2146959360,e,s+n)):17976931348623157e292<r?(t(0,e,s+i),t((o<<31|2146435072)>>>0,e,s+n)):r<22250738585072014e-324?(t((u=r/5e-324)>>>0,e,s+i),t((o<<31|u/4294967296)>>>0,e,s+n)):(t(4503599627370496*(u=r*Math.pow(2,-(r=1024===(r=Math.floor(Math.log(r)/Math.LN2))?1023:r)))>>>0,e,s+i),t((o<<31|r+1023<<20|1048576*u&1048575)>>>0,e,s+n))}function d(t,i,n,r,e){i=t(r,e+i),t=t(r,e+n),r=2*(t>>31)+1,e=t>>>20&2047,n=4294967296*(1048575&t)+i;return 2047==e?n?NaN:1/0*r:0==e?5e-324*r*n:r*Math.pow(2,e-1075)*(n+4503599627370496)}function v(t,i,n){f[0]=t,i[n]=c[0],i[n+1]=c[1],i[n+2]=c[2],i[n+3]=c[3],i[n+4]=c[4],i[n+5]=c[5],i[n+6]=c[6],i[n+7]=c[7]}function b(t,i,n){f[0]=t,i[n]=c[7],i[n+1]=c[6],i[n+2]=c[5],i[n+3]=c[4],i[n+4]=c[3],i[n+5]=c[2],i[n+6]=c[1],i[n+7]=c[0]}function p(t,i){return c[0]=t[i],c[1]=t[i+1],c[2]=t[i+2],c[3]=t[i+3],c[4]=t[i+4],c[5]=t[i+5],c[6]=t[i+6],c[7]=t[i+7],f[0]}function y(t,i){return c[7]=t[i],c[6]=t[i+1],c[5]=t[i+2],c[4]=t[i+3],c[3]=t[i+4],c[2]=t[i+5],c[1]=t[i+6],c[0]=t[i+7],f[0]}return"undefined"!=typeof Float32Array?(o=new Float32Array([-0]),h=new Uint8Array(o.buffer),a=128===h[3],t.writeFloatLE=a?r:e,t.writeFloatBE=a?e:r,t.readFloatLE=a?s:u,t.readFloatBE=a?u:s):(t.writeFloatLE=i.bind(null,m),t.writeFloatBE=i.bind(null,w),t.readFloatLE=n.bind(null,g),t.readFloatBE=n.bind(null,j)),"undefined"!=typeof Float64Array?(f=new Float64Array([-0]),c=new Uint8Array(f.buffer),a=128===c[7],t.writeDoubleLE=a?v:b,t.writeDoubleBE=a?b:v,t.readDoubleLE=a?p:y,t.readDoubleBE=a?y:p):(t.writeDoubleLE=l.bind(null,m,0,4),t.writeDoubleBE=l.bind(null,w,4,0),t.readDoubleLE=d.bind(null,g,0,4),t.readDoubleBE=d.bind(null,j,4,0)),t}function m(t,i,n){i[n]=255&t,i[n+1]=t>>>8&255,i[n+2]=t>>>16&255,i[n+3]=t>>>24}function w(t,i,n){i[n]=t>>>24,i[n+1]=t>>>16&255,i[n+2]=t>>>8&255,i[n+3]=255&t}function g(t,i){return(t[i]|t[i+1]<<8|t[i+2]<<16|t[i+3]<<24)>>>0}function j(t,i){return(t[i]<<24|t[i+1]<<16|t[i+2]<<8|t[i+3])>>>0}i.exports=r(r)},{}],7:[function(t,i,n){function r(t){try{var i=eval("require")(t);if(i&&(i.length||Object.keys(i).length))return i}catch(t){}return null}i.exports=r},{}],8:[function(t,i,n){var e=n.isAbsolute=function(t){return/^(?:\/|\w+:)/.test(t)},r=n.normalize=function(t){var i=(t=t.replace(/\\/g,"/").replace(/\/{2,}/g,"/")).split("/"),n=e(t),t="";n&&(t=i.shift()+"/");for(var r=0;r<i.length;)".."===i[r]?0<r&&".."!==i[r-1]?i.splice(--r,2):n?i.splice(r,1):++r:"."===i[r]?i.splice(r,1):++r;return t+i.join("/")};n.resolve=function(t,i,n){return n||(i=r(i)),!e(i)&&(t=(t=n?t:r(t)).replace(/(?:\/|^)[^/]+$/,"")).length?r(t+"/"+i):i}},{}],9:[function(t,i,n){i.exports=function(i,n,t){var r=t||8192,e=r>>>1,s=null,u=r;return function(t){if(t<1||e<t)return i(t);r<u+t&&(s=i(r),u=0);t=n.call(s,u,u+=t);return 7&u&&(u=1+(7|u)),t}}},{}],10:[function(t,i,n){n.length=function(t){for(var i,n=0,r=0;r<t.length;++r)(i=t.charCodeAt(r))<128?n+=1:i<2048?n+=2:55296==(64512&i)&&56320==(64512&t.charCodeAt(r+1))?(++r,n+=4):n+=3;return n},n.read=function(t,i,n){if(n-i<1)return"";for(var r,e=null,s=[],u=0;i<n;)(r=t[i++])<128?s[u++]=r:191<r&&r<224?s[u++]=(31&r)<<6|63&t[i++]:239<r&&r<365?(r=((7&r)<<18|(63&t[i++])<<12|(63&t[i++])<<6|63&t[i++])-65536,s[u++]=55296+(r>>10),s[u++]=56320+(1023&r)):s[u++]=(15&r)<<12|(63&t[i++])<<6|63&t[i++],8191<u&&((e=e||[]).push(String.fromCharCode.apply(String,s)),u=0);return e?(u&&e.push(String.fromCharCode.apply(String,s.slice(0,u))),e.join("")):String.fromCharCode.apply(String,s.slice(0,u))},n.write=function(t,i,n){for(var r,e,s=n,u=0;u<t.length;++u)(r=t.charCodeAt(u))<128?i[n++]=r:(r<2048?i[n++]=r>>6|192:(55296==(64512&r)&&56320==(64512&(e=t.charCodeAt(u+1)))?(++u,i[n++]=(r=65536+((1023&r)<<10)+(1023&e))>>18|240,i[n++]=r>>12&63|128):i[n++]=r>>12|224,i[n++]=r>>6&63|128),i[n++]=63&r|128);return n-s}},{}],11:[function(t,i,n){var l=t(14),d=t(33);function u(t,i,n,r){var e=!1;if(i.resolvedType)if(i.resolvedType instanceof l){t("switch(d%s){",r);for(var s=i.resolvedType.values,u=Object.keys(s),o=0;o<u.length;++o)s[u[o]]!==i.typeDefault||e||(t("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}',r,r,r),i.repeated||t("break"),e=!0),t("case%j:",u[o])("case %i:",s[u[o]])("m%s=%j",r,s[u[o]])("break");t("}")}else t('if(typeof d%s!=="object")',r)("throw TypeError(%j)",i.fullName+": object expected")("m%s=types[%i].fromObject(d%s)",r,n,r);else{var h=!1;switch(i.type){case"double":case"float":t("m%s=Number(d%s)",r,r);break;case"uint32":case"fixed32":t("m%s=d%s>>>0",r,r);break;case"int32":case"sint32":case"sfixed32":t("m%s=d%s|0",r,r);break;case"uint64":h=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":t("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j",r,r,h)('else if(typeof d%s==="string")',r)("m%s=parseInt(d%s,10)",r,r)('else if(typeof d%s==="number")',r)("m%s=d%s",r,r)('else if(typeof d%s==="object")',r)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)",r,r,r,h?"true":"");break;case"bytes":t('if(typeof d%s==="string")',r)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)",r,r,r)("else if(d%s.length >= 0)",r)("m%s=d%s",r,r);break;case"string":t("m%s=String(d%s)",r,r);break;case"bool":t("m%s=Boolean(d%s)",r,r)}}return t}function v(t,i,n,r){if(i.resolvedType)i.resolvedType instanceof l?t("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s",r,n,r,r,n,r,r):t("d%s=types[%i].toObject(m%s,o)",r,n,r);else{var e=!1;switch(i.type){case"double":case"float":t("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s",r,r,r,r);break;case"uint64":e=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":t('if(typeof m%s==="number")',r)("d%s=o.longs===String?String(m%s):m%s",r,r,r)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s",r,r,r,r,e?"true":"",r);break;case"bytes":t("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s",r,r,r,r,r);break;default:t("d%s=m%s",r,r)}}return t}n.fromObject=function(t){var i=t.fieldsArray,n=d.codegen(["d"],t.name+"$fromObject")("if(d instanceof this.ctor)")("return d");if(!i.length)return n("return new this.ctor");n("var m=new this.ctor");for(var r=0;r<i.length;++r){var e=i[r].resolve(),s=d.safeProp(e.name);e.map?(n("if(d%s){",s)('if(typeof d%s!=="object")',s)("throw TypeError(%j)",e.fullName+": object expected")("m%s={}",s)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){",s),u(n,e,r,s+"[ks[i]]")("}")("}")):e.repeated?(n("if(d%s){",s)("if(!Array.isArray(d%s))",s)("throw TypeError(%j)",e.fullName+": array expected")("m%s=[]",s)("for(var i=0;i<d%s.length;++i){",s),u(n,e,r,s+"[i]")("}")("}")):(e.resolvedType instanceof l||n("if(d%s!=null){",s),u(n,e,r,s),e.resolvedType instanceof l||n("}"))}return n("return m")},n.toObject=function(t){var i=t.fieldsArray.slice().sort(d.compareFieldsById);if(!i.length)return d.codegen()("return {}");for(var n=d.codegen(["m","o"],t.name+"$toObject")("if(!o)")("o={}")("var d={}"),r=[],e=[],s=[],u=0;u<i.length;++u)i[u].partOf||(i[u].resolve().repeated?r:i[u].map?e:s).push(i[u]);if(r.length){for(n("if(o.arrays||o.defaults){"),u=0;u<r.length;++u)n("d%s=[]",d.safeProp(r[u].name));n("}")}if(e.length){for(n("if(o.objects||o.defaults){"),u=0;u<e.length;++u)n("d%s={}",d.safeProp(e[u].name));n("}")}if(s.length){for(n("if(o.defaults){"),u=0;u<s.length;++u){var o,h=s[u],f=d.safeProp(h.name);h.resolvedType instanceof l?n("d%s=o.enums===String?%j:%j",f,h.resolvedType.valuesById[h.typeDefault],h.typeDefault):h.long?n("if(util.Long){")("var n=new util.Long(%i,%i,%j)",h.typeDefault.low,h.typeDefault.high,h.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n",f)("}else")("d%s=o.longs===String?%j:%i",f,h.typeDefault.toString(),h.typeDefault.toNumber()):h.bytes?(o="["+Array.prototype.slice.call(h.typeDefault).join(",")+"]",n("if(o.bytes===String)d%s=%j",f,String.fromCharCode.apply(String,h.typeDefault))("else{")("d%s=%s",f,o)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)",f,f)("}")):n("d%s=%j",f,h.typeDefault)}n("}")}for(var c=!1,u=0;u<i.length;++u){var h=i[u],a=t.i.indexOf(h),f=d.safeProp(h.name);h.map?(c||(c=!0,n("var ks2")),n("if(m%s&&(ks2=Object.keys(m%s)).length){",f,f)("d%s={}",f)("for(var j=0;j<ks2.length;++j){"),v(n,h,a,f+"[ks2[j]]")("}")):h.repeated?(n("if(m%s&&m%s.length){",f,f)("d%s=[]",f)("for(var j=0;j<m%s.length;++j){",f),v(n,h,a,f+"[j]")("}")):(n("if(m%s!=null&&m.hasOwnProperty(%j)){",f,h.name),v(n,h,a,f),h.partOf&&n("if(o.oneofs)")("d%s=%j",d.safeProp(h.partOf.name),h.name)),n("}")}return n("return d")}},{14:14,33:33}],12:[function(t,i,n){i.exports=function(t){var i=f.codegen(["r","l"],t.name+"$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor"+(t.fieldsArray.filter(function(t){return t.map}).length?",k,value":""))("while(r.pos<c){")("var t=r.uint32()");t.group&&i("if((t&7)===4)")("break");i("switch(t>>>3){");for(var n=0;n<t.fieldsArray.length;++n){var r=t.i[n].resolve(),e=r.resolvedType instanceof o?"int32":r.type,s="m"+f.safeProp(r.name);i("case %i: {",r.id),r.map?(i("if(%s===util.emptyObject)",s)("%s={}",s)("var c2 = r.uint32()+r.pos"),h.defaults[r.keyType]!==g?i("k=%j",h.defaults[r.keyType]):i("k=null"),h.defaults[e]!==g?i("value=%j",h.defaults[e]):i("value=null"),i("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break",r.keyType)("case 2:"),h.basic[e]===g?i("value=types[%i].decode(r,r.uint32())",n):i("value=r.%s()",e),i("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"),h.long[r.keyType]!==g?i('%s[typeof k==="object"?util.longToHash(k):k]=value',s):i("%s[k]=value",s)):r.repeated?(i("if(!(%s&&%s.length))",s,s)("%s=[]",s),h.packed[e]!==g&&i("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())",s,e)("}else"),h.basic[e]===g?i(r.resolvedType.group?"%s.push(types[%i].decode(r))":"%s.push(types[%i].decode(r,r.uint32()))",s,n):i("%s.push(r.%s())",s,e)):h.basic[e]===g?i(r.resolvedType.group?"%s=types[%i].decode(r)":"%s=types[%i].decode(r,r.uint32())",s,n):i("%s=r.%s()",s,e),i("break")("}")}for(i("default:")("r.skipType(t&7)")("break")("}")("}"),n=0;n<t.i.length;++n){var u=t.i[n];u.required&&i("if(!m.hasOwnProperty(%j))",u.name)("throw util.ProtocolError(%j,{instance:m})","missing required '"+u.name+"'")}return i("return m")};var o=t(14),h=t(32),f=t(33)},{14:14,32:32,33:33}],13:[function(t,i,n){i.exports=function(t){for(var i,n=a.codegen(["m","w"],t.name+"$encode")("if(!w)")("w=Writer.create()"),r=t.fieldsArray.slice().sort(a.compareFieldsById),e=0;e<r.length;++e){var s=r[e].resolve(),u=t.i.indexOf(s),o=s.resolvedType instanceof f?"int32":s.type,h=c.basic[o];i="m"+a.safeProp(s.name),s.map?(n("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){",i,s.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){",i)("w.uint32(%i).fork().uint32(%i).%s(ks[i])",(s.id<<3|2)>>>0,8|c.mapKey[s.keyType],s.keyType),h===g?n("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()",u,i):n(".uint32(%i).%s(%s[ks[i]]).ldelim()",16|h,o,i),n("}")("}")):s.repeated?(n("if(%s!=null&&%s.length){",i,i),s.packed&&c.packed[o]!==g?n("w.uint32(%i).fork()",(s.id<<3|2)>>>0)("for(var i=0;i<%s.length;++i)",i)("w.%s(%s[i])",o,i)("w.ldelim()"):(n("for(var i=0;i<%s.length;++i)",i),h===g?l(n,s,u,i+"[i]"):n("w.uint32(%i).%s(%s[i])",(s.id<<3|h)>>>0,o,i)),n("}")):(s.optional&&n("if(%s!=null&&Object.hasOwnProperty.call(m,%j))",i,s.name),h===g?l(n,s,u,i):n("w.uint32(%i).%s(%s)",(s.id<<3|h)>>>0,o,i))}return n("return w")};var f=t(14),c=t(32),a=t(33);function l(t,i,n,r){i.resolvedType.group?t("types[%i].encode(%s,w.uint32(%i)).uint32(%i)",n,r,(i.id<<3|3)>>>0,(i.id<<3|4)>>>0):t("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()",n,r,(i.id<<3|2)>>>0)}},{14:14,32:32,33:33}],14:[function(t,i,n){i.exports=s;var h=t(22),r=(((s.prototype=Object.create(h.prototype)).constructor=s).className="Enum",t(21)),e=t(33);function s(t,i,n,r,e,s){if(h.call(this,t,n),i&&"object"!=typeof i)throw TypeError("values must be an object");if(this.valuesById={},this.values=Object.create(this.valuesById),this.comment=r,this.comments=e||{},this.valuesOptions=s,this.reserved=g,i)for(var u=Object.keys(i),o=0;o<u.length;++o)"number"==typeof i[u[o]]&&(this.valuesById[this.values[u[o]]=i[u[o]]]=u[o])}s.fromJSON=function(t,i){t=new s(t,i.values,i.options,i.comment,i.comments);return t.reserved=i.reserved,t},s.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return e.toObject(["options",this.options,"valuesOptions",this.valuesOptions,"values",this.values,"reserved",this.reserved&&this.reserved.length?this.reserved:g,"comment",t?this.comment:g,"comments",t?this.comments:g])},s.prototype.add=function(t,i,n,r){if(!e.isString(t))throw TypeError("name must be a string");if(!e.isInteger(i))throw TypeError("id must be an integer");if(this.values[t]!==g)throw Error("duplicate name '"+t+"' in "+this);if(this.isReservedId(i))throw Error("id "+i+" is reserved in "+this);if(this.isReservedName(t))throw Error("name '"+t+"' is reserved in "+this);if(this.valuesById[i]!==g){if(!this.options||!this.options.allow_alias)throw Error("duplicate id "+i+" in "+this);this.values[t]=i}else this.valuesById[this.values[t]=i]=t;return r&&(this.valuesOptions===g&&(this.valuesOptions={}),this.valuesOptions[t]=r||null),this.comments[t]=n||null,this},s.prototype.remove=function(t){if(!e.isString(t))throw TypeError("name must be a string");var i=this.values[t];if(null==i)throw Error("name '"+t+"' does not exist in "+this);return delete this.valuesById[i],delete this.values[t],delete this.comments[t],this.valuesOptions&&delete this.valuesOptions[t],this},s.prototype.isReservedId=function(t){return r.isReservedId(this.reserved,t)},s.prototype.isReservedName=function(t){return r.isReservedName(this.reserved,t)}},{21:21,22:22,33:33}],15:[function(t,i,n){i.exports=u;var r,o=t(22),e=(((u.prototype=Object.create(o.prototype)).constructor=u).className="Field",t(14)),h=t(32),f=t(33),c=/^required|optional|repeated$/;function u(t,i,n,r,e,s,u){if(f.isObject(r)?(u=e,s=r,r=e=g):f.isObject(e)&&(u=s,s=e,e=g),o.call(this,t,s),!f.isInteger(i)||i<0)throw TypeError("id must be a non-negative integer");if(!f.isString(n))throw TypeError("type must be a string");if(r!==g&&!c.test(r=r.toString().toLowerCase()))throw TypeError("rule must be a string rule");if(e!==g&&!f.isString(e))throw TypeError("extend must be a string");this.rule=(r="proto3_optional"===r?"optional":r)&&"optional"!==r?r:g,this.type=n,this.id=i,this.extend=e||g,this.required="required"===r,this.optional=!this.required,this.repeated="repeated"===r,this.map=!1,this.message=null,this.partOf=null,this.typeDefault=null,this.defaultValue=null,this.long=!!f.Long&&h.long[n]!==g,this.bytes="bytes"===n,this.resolvedType=null,this.extensionField=null,this.declaringField=null,this.n=null,this.comment=u}u.fromJSON=function(t,i){return new u(t,i.id,i.type,i.rule,i.extend,i.options,i.comment)},Object.defineProperty(u.prototype,"packed",{get:function(){return null===this.n&&(this.n=!1!==this.getOption("packed")),this.n}}),u.prototype.setOption=function(t,i,n){return"packed"===t&&(this.n=null),o.prototype.setOption.call(this,t,i,n)},u.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return f.toObject(["rule","optional"!==this.rule&&this.rule||g,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",t?this.comment:g])},u.prototype.resolve=function(){var t;return this.resolved?this:((this.typeDefault=h.defaults[this.type])===g?(this.resolvedType=(this.declaringField||this).parent.lookupTypeOrEnum(this.type),this.resolvedType instanceof r?this.typeDefault=null:this.typeDefault=this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]):this.options&&this.options.proto3_optional&&(this.typeDefault=null),this.options&&null!=this.options.default&&(this.typeDefault=this.options.default,this.resolvedType instanceof e&&"string"==typeof this.typeDefault&&(this.typeDefault=this.resolvedType.values[this.typeDefault])),this.options&&(!0!==this.options.packed&&(this.options.packed===g||!this.resolvedType||this.resolvedType instanceof e)||delete this.options.packed,Object.keys(this.options).length||(this.options=g)),this.long?(this.typeDefault=f.Long.fromNumber(this.typeDefault,"u"==(this.type[0]||"")),Object.freeze&&Object.freeze(this.typeDefault)):this.bytes&&"string"==typeof this.typeDefault&&(f.base64.test(this.typeDefault)?f.base64.decode(this.typeDefault,t=f.newBuffer(f.base64.length(this.typeDefault)),0):f.utf8.write(this.typeDefault,t=f.newBuffer(f.utf8.length(this.typeDefault)),0),this.typeDefault=t),this.map?this.defaultValue=f.emptyObject:this.repeated?this.defaultValue=f.emptyArray:this.defaultValue=this.typeDefault,this.parent instanceof r&&(this.parent.ctor.prototype[this.name]=this.defaultValue),o.prototype.resolve.call(this))},u.d=function(n,r,e,s){return"function"==typeof r?r=f.decorateType(r).name:r&&"object"==typeof r&&(r=f.decorateEnum(r).name),function(t,i){f.decorateType(t.constructor).add(new u(i,n,r,e,{default:s}))}},u.r=function(t){r=t}},{14:14,22:22,32:32,33:33}],16:[function(t,i,n){var r=i.exports=t(17);r.build="light",r.load=function(t,i,n){return(i="function"==typeof i?(n=i,new r.Root):i||new r.Root).load(t,n)},r.loadSync=function(t,i){return(i=i||new r.Root).loadSync(t)},r.encoder=t(13),r.decoder=t(12),r.verifier=t(36),r.converter=t(11),r.ReflectionObject=t(22),r.Namespace=t(21),r.Root=t(26),r.Enum=t(14),r.Type=t(31),r.Field=t(15),r.OneOf=t(23),r.MapField=t(18),r.Service=t(30),r.Method=t(20),r.Message=t(19),r.wrappers=t(37),r.types=t(32),r.util=t(33),r.ReflectionObject.r(r.Root),r.Namespace.r(r.Type,r.Service,r.Enum),r.Root.r(r.Type),r.Field.r(r.Type)},{11:11,12:12,13:13,14:14,15:15,17:17,18:18,19:19,20:20,21:21,22:22,23:23,26:26,30:30,31:31,32:32,33:33,36:36,37:37}],17:[function(t,i,n){var r=n;function e(){r.util.r(),r.Writer.r(r.BufferWriter),r.Reader.r(r.BufferReader)}r.build="minimal",r.Writer=t(38),r.BufferWriter=t(39),r.Reader=t(24),r.BufferReader=t(25),r.util=t(35),r.rpc=t(28),r.roots=t(27),r.configure=e,e()},{24:24,25:25,27:27,28:28,35:35,38:38,39:39}],18:[function(t,i,n){i.exports=s;var u=t(15),r=(((s.prototype=Object.create(u.prototype)).constructor=s).className="MapField",t(32)),o=t(33);function s(t,i,n,r,e,s){if(u.call(this,t,i,r,g,g,e,s),!o.isString(n))throw TypeError("keyType must be a string");this.keyType=n,this.resolvedKeyType=null,this.map=!0}s.fromJSON=function(t,i){return new s(t,i.id,i.keyType,i.type,i.options,i.comment)},s.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return o.toObject(["keyType",this.keyType,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",t?this.comment:g])},s.prototype.resolve=function(){if(this.resolved)return this;if(r.mapKey[this.keyType]===g)throw Error("invalid key type: "+this.keyType);return u.prototype.resolve.call(this)},s.d=function(n,r,e){return"function"==typeof e?e=o.decorateType(e).name:e&&"object"==typeof e&&(e=o.decorateEnum(e).name),function(t,i){o.decorateType(t.constructor).add(new s(i,n,r,e))}}},{15:15,32:32,33:33}],19:[function(t,i,n){i.exports=e;var r=t(35);function e(t){if(t)for(var i=Object.keys(t),n=0;n<i.length;++n)this[i[n]]=t[i[n]]}e.create=function(t){return this.$type.create(t)},e.encode=function(t,i){return this.$type.encode(t,i)},e.encodeDelimited=function(t,i){return this.$type.encodeDelimited(t,i)},e.decode=function(t){return this.$type.decode(t)},e.decodeDelimited=function(t){return this.$type.decodeDelimited(t)},e.verify=function(t){return this.$type.verify(t)},e.fromObject=function(t){return this.$type.fromObject(t)},e.toObject=function(t,i){return this.$type.toObject(t,i)},e.prototype.toJSON=function(){return this.$type.toObject(this,r.toJSONOptions)}},{35:35}],20:[function(t,i,n){i.exports=r;var f=t(22),c=(((r.prototype=Object.create(f.prototype)).constructor=r).className="Method",t(33));function r(t,i,n,r,e,s,u,o,h){if(c.isObject(e)?(u=e,e=s=g):c.isObject(s)&&(u=s,s=g),i!==g&&!c.isString(i))throw TypeError("type must be a string");if(!c.isString(n))throw TypeError("requestType must be a string");if(!c.isString(r))throw TypeError("responseType must be a string");f.call(this,t,u),this.type=i||"rpc",this.requestType=n,this.requestStream=!!e||g,this.responseType=r,this.responseStream=!!s||g,this.resolvedRequestType=null,this.resolvedResponseType=null,this.comment=o,this.parsedOptions=h}r.fromJSON=function(t,i){return new r(t,i.type,i.requestType,i.responseType,i.requestStream,i.responseStream,i.options,i.comment,i.parsedOptions)},r.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return c.toObject(["type","rpc"!==this.type&&this.type||g,"requestType",this.requestType,"requestStream",this.requestStream,"responseType",this.responseType,"responseStream",this.responseStream,"options",this.options,"comment",t?this.comment:g,"parsedOptions",this.parsedOptions])},r.prototype.resolve=function(){return this.resolved?this:(this.resolvedRequestType=this.parent.lookupType(this.requestType),this.resolvedResponseType=this.parent.lookupType(this.responseType),f.prototype.resolve.call(this))}},{22:22,33:33}],21:[function(t,i,n){i.exports=a;var e,s,u,r=t(22),o=(((a.prototype=Object.create(r.prototype)).constructor=a).className="Namespace",t(15)),h=t(33),f=t(23);function c(t,i){if(!t||!t.length)return g;for(var n={},r=0;r<t.length;++r)n[t[r].name]=t[r].toJSON(i);return n}function a(t,i){r.call(this,t,i),this.nested=g,this.e=null}function l(t){return t.e=null,t}a.fromJSON=function(t,i){return new a(t,i.options).addJSON(i.nested)},a.arrayToJSON=c,a.isReservedId=function(t,i){if(t)for(var n=0;n<t.length;++n)if("string"!=typeof t[n]&&t[n][0]<=i&&t[n][1]>i)return!0;return!1},a.isReservedName=function(t,i){if(t)for(var n=0;n<t.length;++n)if(t[n]===i)return!0;return!1},Object.defineProperty(a.prototype,"nestedArray",{get:function(){return this.e||(this.e=h.toArray(this.nested))}}),a.prototype.toJSON=function(t){return h.toObject(["options",this.options,"nested",c(this.nestedArray,t)])},a.prototype.addJSON=function(t){if(t)for(var i,n=Object.keys(t),r=0;r<n.length;++r)i=t[n[r]],this.add((i.fields!==g?e:i.values!==g?u:i.methods!==g?s:i.id!==g?o:a).fromJSON(n[r],i));return this},a.prototype.get=function(t){return this.nested&&this.nested[t]||null},a.prototype.getEnum=function(t){if(this.nested&&this.nested[t]instanceof u)return this.nested[t].values;throw Error("no such enum: "+t)},a.prototype.add=function(t){if(!(t instanceof o&&t.extend!==g||t instanceof e||t instanceof f||t instanceof u||t instanceof s||t instanceof a))throw TypeError("object must be a valid nested object");if(this.nested){var i=this.get(t.name);if(i){if(!(i instanceof a&&t instanceof a)||i instanceof e||i instanceof s)throw Error("duplicate name '"+t.name+"' in "+this);for(var n=i.nestedArray,r=0;r<n.length;++r)t.add(n[r]);this.remove(i),this.nested||(this.nested={}),t.setOptions(i.options,!0)}}else this.nested={};return(this.nested[t.name]=t).onAdd(this),l(this)},a.prototype.remove=function(t){if(!(t instanceof r))throw TypeError("object must be a ReflectionObject");if(t.parent!==this)throw Error(t+" is not a member of "+this);return delete this.nested[t.name],Object.keys(this.nested).length||(this.nested=g),t.onRemove(this),l(this)},a.prototype.define=function(t,i){if(h.isString(t))t=t.split(".");else if(!Array.isArray(t))throw TypeError("illegal path");if(t&&t.length&&""===t[0])throw Error("path must be relative");for(var n=this;0<t.length;){var r=t.shift();if(n.nested&&n.nested[r]){if(!((n=n.nested[r])instanceof a))throw Error("path conflicts with non-namespace objects")}else n.add(n=new a(r))}return i&&n.addJSON(i),n},a.prototype.resolveAll=function(){for(var t=this.nestedArray,i=0;i<t.length;)t[i]instanceof a?t[i++].resolveAll():t[i++].resolve();return this.resolve()},a.prototype.lookup=function(t,i,n){if("boolean"==typeof i?(n=i,i=g):i&&!Array.isArray(i)&&(i=[i]),h.isString(t)&&t.length){if("."===t)return this.root;t=t.split(".")}else if(!t.length)return this;if(""===t[0])return this.root.lookup(t.slice(1),i);var r=this.get(t[0]);if(r){if(1===t.length){if(!i||~i.indexOf(r.constructor))return r}else if(r instanceof a&&(r=r.lookup(t.slice(1),i,!0)))return r}else for(var e=0;e<this.nestedArray.length;++e)if(this.e[e]instanceof a&&(r=this.e[e].lookup(t,i,!0)))return r;return null===this.parent||n?null:this.parent.lookup(t,i)},a.prototype.lookupType=function(t){var i=this.lookup(t,[e]);if(i)return i;throw Error("no such type: "+t)},a.prototype.lookupEnum=function(t){var i=this.lookup(t,[u]);if(i)return i;throw Error("no such Enum '"+t+"' in "+this)},a.prototype.lookupTypeOrEnum=function(t){var i=this.lookup(t,[e,u]);if(i)return i;throw Error("no such Type or Enum '"+t+"' in "+this)},a.prototype.lookupService=function(t){var i=this.lookup(t,[s]);if(i)return i;throw Error("no such Service '"+t+"' in "+this)},a.r=function(t,i,n){e=t,s=i,u=n}},{15:15,22:22,23:23,33:33}],22:[function(t,i,n){(i.exports=e).className="ReflectionObject";var r,u=t(33);function e(t,i){if(!u.isString(t))throw TypeError("name must be a string");if(i&&!u.isObject(i))throw TypeError("options must be an object");this.options=i,this.parsedOptions=null,this.name=t,this.parent=null,this.resolved=!1,this.comment=null,this.filename=null}Object.defineProperties(e.prototype,{root:{get:function(){for(var t=this;null!==t.parent;)t=t.parent;return t}},fullName:{get:function(){for(var t=[this.name],i=this.parent;i;)t.unshift(i.name),i=i.parent;return t.join(".")}}}),e.prototype.toJSON=function(){throw Error()},e.prototype.onAdd=function(t){this.parent&&this.parent!==t&&this.parent.remove(this),this.parent=t,this.resolved=!1;t=t.root;t instanceof r&&t.u(this)},e.prototype.onRemove=function(t){t=t.root;t instanceof r&&t.o(this),this.parent=null,this.resolved=!1},e.prototype.resolve=function(){return this.resolved||this.root instanceof r&&(this.resolved=!0),this},e.prototype.getOption=function(t){return this.options?this.options[t]:g},e.prototype.setOption=function(t,i,n){return n&&this.options&&this.options[t]!==g||((this.options||(this.options={}))[t]=i),this},e.prototype.setParsedOption=function(i,t,n){this.parsedOptions||(this.parsedOptions=[]);var r,e,s=this.parsedOptions;return n?(r=s.find(function(t){return Object.prototype.hasOwnProperty.call(t,i)}))?(e=r[i],u.setProperty(e,n,t)):((r={})[i]=u.setProperty({},n,t),s.push(r)):((e={})[i]=t,s.push(e)),this},e.prototype.setOptions=function(t,i){if(t)for(var n=Object.keys(t),r=0;r<n.length;++r)this.setOption(n[r],t[n[r]],i);return this},e.prototype.toString=function(){var t=this.constructor.className,i=this.fullName;return i.length?t+" "+i:t},e.r=function(t){r=t}},{33:33}],23:[function(t,i,n){i.exports=u;var e=t(22),r=(((u.prototype=Object.create(e.prototype)).constructor=u).className="OneOf",t(15)),s=t(33);function u(t,i,n,r){if(Array.isArray(i)||(n=i,i=g),e.call(this,t,n),i!==g&&!Array.isArray(i))throw TypeError("fieldNames must be an Array");this.oneof=i||[],this.fieldsArray=[],this.comment=r}function o(t){if(t.parent)for(var i=0;i<t.fieldsArray.length;++i)t.fieldsArray[i].parent||t.parent.add(t.fieldsArray[i])}u.fromJSON=function(t,i){return new u(t,i.oneof,i.options,i.comment)},u.prototype.toJSON=function(t){t=!!t&&!!t.keepComments;return s.toObject(["options",this.options,"oneof",this.oneof,"comment",t?this.comment:g])},u.prototype.add=function(t){if(t instanceof r)return t.parent&&t.parent!==this.parent&&t.parent.remove(t),this.oneof.push(t.name),this.fieldsArray.push(t),o(t.partOf=this),this;throw TypeError("field must be a Field")},u.prototype.remove=function(t){if(!(t instanceof r))throw TypeError("field must be a Field");var i=this.fieldsArray.indexOf(t);if(i<0)throw Error(t+" is not a member of "+this);return this.fieldsArray.splice(i,1),-1<(i=this.oneof.indexOf(t.name))&&this.oneof.splice(i,1),t.partOf=null,this},u.prototype.onAdd=function(t){e.prototype.onAdd.call(this,t);for(var i=0;i<this.oneof.length;++i){var n=t.get(this.oneof[i]);n&&!n.partOf&&(n.partOf=this).fieldsArray.push(n)}o(this)},u.prototype.onRemove=function(t){for(var i,n=0;n<this.fieldsArray.length;++n)(i=this.fieldsArray[n]).parent&&i.parent.remove(i);e.prototype.onRemove.call(this,t)},u.d=function(){for(var n=Array(arguments.length),t=0;t<arguments.length;)n[t]=arguments[t++];return function(t,i){s.decorateType(t.constructor).add(new u(i,n)),Object.defineProperty(t,i,{get:s.oneOfGetter(n),set:s.oneOfSetter(n)})}}},{15:15,22:22,33:33}],24:[function(t,i,n){i.exports=h;var r,e=t(35),s=e.LongBits,u=e.utf8;function o(t,i){return RangeError("index out of range: "+t.pos+" + "+(i||1)+" > "+t.len)}function h(t){this.buf=t,this.pos=0,this.len=t.length}function f(){return e.Buffer?function(t){return(h.create=function(t){return e.Buffer.isBuffer(t)?new r(t):a(t)})(t)}:a}var c,a="undefined"!=typeof Uint8Array?function(t){if(t instanceof Uint8Array||Array.isArray(t))return new h(t);throw Error("illegal buffer")}:function(t){if(Array.isArray(t))return new h(t);throw Error("illegal buffer")};function l(){var t=new s(0,0),i=0;if(!(4<this.len-this.pos)){for(;i<3;++i){if(this.pos>=this.len)throw o(this);if(t.lo=(t.lo|(127&this.buf[this.pos])<<7*i)>>>0,this.buf[this.pos++]<128)return t}return t.lo=(t.lo|(127&this.buf[this.pos++])<<7*i)>>>0,t}for(;i<4;++i)if(t.lo=(t.lo|(127&this.buf[this.pos])<<7*i)>>>0,this.buf[this.pos++]<128)return t;if(t.lo=(t.lo|(127&this.buf[this.pos])<<28)>>>0,t.hi=(t.hi|(127&this.buf[this.pos])>>4)>>>0,this.buf[this.pos++]<128)return t;if(i=0,4<this.len-this.pos){for(;i<5;++i)if(t.hi=(t.hi|(127&this.buf[this.pos])<<7*i+3)>>>0,this.buf[this.pos++]<128)return t}else for(;i<5;++i){if(this.pos>=this.len)throw o(this);if(t.hi=(t.hi|(127&this.buf[this.pos])<<7*i+3)>>>0,this.buf[this.pos++]<128)return t}throw Error("invalid varint encoding")}function d(t,i){return(t[i-4]|t[i-3]<<8|t[i-2]<<16|t[i-1]<<24)>>>0}function v(){if(this.pos+8>this.len)throw o(this,8);return new s(d(this.buf,this.pos+=4),d(this.buf,this.pos+=4))}h.create=f(),h.prototype.h=e.Array.prototype.subarray||e.Array.prototype.slice,h.prototype.uint32=(c=4294967295,function(){if(c=(127&this.buf[this.pos])>>>0,this.buf[this.pos++]<128||(c=(c|(127&this.buf[this.pos])<<7)>>>0,this.buf[this.pos++]<128||(c=(c|(127&this.buf[this.pos])<<14)>>>0,this.buf[this.pos++]<128||(c=(c|(127&this.buf[this.pos])<<21)>>>0,this.buf[this.pos++]<128||(c=(c|(15&this.buf[this.pos])<<28)>>>0,this.buf[this.pos++]<128||!((this.pos+=5)>this.len))))))return c;throw this.pos=this.len,o(this,10)}),h.prototype.int32=function(){return 0|this.uint32()},h.prototype.sint32=function(){var t=this.uint32();return t>>>1^-(1&t)|0},h.prototype.bool=function(){return 0!==this.uint32()},h.prototype.fixed32=function(){if(this.pos+4>this.len)throw o(this,4);return d(this.buf,this.pos+=4)},h.prototype.sfixed32=function(){if(this.pos+4>this.len)throw o(this,4);return 0|d(this.buf,this.pos+=4)},h.prototype.float=function(){if(this.pos+4>this.len)throw o(this,4);var t=e.float.readFloatLE(this.buf,this.pos);return this.pos+=4,t},h.prototype.double=function(){if(this.pos+8>this.len)throw o(this,4);var t=e.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,t},h.prototype.bytes=function(){var t=this.uint32(),i=this.pos,n=this.pos+t;if(n>this.len)throw o(this,t);return this.pos+=t,Array.isArray(this.buf)?this.buf.slice(i,n):i===n?(t=e.Buffer)?t.alloc(0):new this.buf.constructor(0):this.h.call(this.buf,i,n)},h.prototype.string=function(){var t=this.bytes();return u.read(t,0,t.length)},h.prototype.skip=function(t){if("number"==typeof t){if(this.pos+t>this.len)throw o(this,t);this.pos+=t}else do{if(this.pos>=this.len)throw o(this)}while(128&this.buf[this.pos++]);return this},h.prototype.skipType=function(t){switch(t){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;4!=(t=7&this.uint32());)this.skipType(t);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+t+" at offset "+this.pos)}return this},h.r=function(t){r=t,h.create=f(),r.r();var i=e.Long?"toLong":"toNumber";e.merge(h.prototype,{int64:function(){return l.call(this)[i](!1)},uint64:function(){return l.call(this)[i](!0)},sint64:function(){return l.call(this).zzDecode()[i](!1)},fixed64:function(){return v.call(this)[i](!0)},sfixed64:function(){return v.call(this)[i](!1)}})}},{35:35}],25:[function(t,i,n){i.exports=s;var r=t(24),e=((s.prototype=Object.create(r.prototype)).constructor=s,t(35));function s(t){r.call(this,t)}s.r=function(){e.Buffer&&(s.prototype.h=e.Buffer.prototype.slice)},s.prototype.string=function(){var t=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+t,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+t,this.len))},s.r()},{24:24,35:35}],26:[function(t,i,n){i.exports=h;var r,d,v,e=t(21),s=(((h.prototype=Object.create(e.prototype)).constructor=h).className="Root",t(15)),u=t(14),o=t(23),b=t(33);function h(t){e.call(this,"",t),this.deferred=[],this.files=[]}function p(){}h.fromJSON=function(t,i){return i=i||new h,t.options&&i.setOptions(t.options),i.addJSON(t.nested)},h.prototype.resolvePath=b.path.resolve,h.prototype.fetch=b.fetch,h.prototype.load=function t(i,s,e){"function"==typeof s&&(e=s,s=g);var u=this;if(!e)return b.asPromise(t,u,i,s);var o=e===p;function h(t,i){if(e){if(o)throw t;var n=e;e=null,n(t,i)}}function f(t){var i=t.lastIndexOf("google/protobuf/");if(-1<i){t=t.substring(i);if(t in v)return t}return null}function c(t,i){try{if(b.isString(i)&&"{"==(i[0]||"")&&(i=JSON.parse(i)),b.isString(i)){d.filename=t;var n,r=d(i,u,s),e=0;if(r.imports)for(;e<r.imports.length;++e)(n=f(r.imports[e])||u.resolvePath(t,r.imports[e]))&&a(n);if(r.weakImports)for(e=0;e<r.weakImports.length;++e)(n=f(r.weakImports[e])||u.resolvePath(t,r.weakImports[e]))&&a(n,!0)}else u.setOptions(i.options).addJSON(i.nested)}catch(t){h(t)}o||l||h(null,u)}function a(n,r){if(n=f(n)||n,!~u.files.indexOf(n))if(u.files.push(n),n in v)o?c(n,v[n]):(++l,setTimeout(function(){--l,c(n,v[n])}));else if(o){var t;try{t=b.fs.readFileSync(n).toString("utf8")}catch(t){return void(r||h(t))}c(n,t)}else++l,u.fetch(n,function(t,i){--l,e&&(t?r?l||h(null,u):h(t):c(n,i))})}var l=0;b.isString(i)&&(i=[i]);for(var n,r=0;r<i.length;++r)(n=u.resolvePath("",i[r]))&&a(n);return o?u:(l||h(null,u),g)},h.prototype.loadSync=function(t,i){if(b.isNode)return this.load(t,i,p);throw Error("not supported")},h.prototype.resolveAll=function(){if(this.deferred.length)throw Error("unresolvable extensions: "+this.deferred.map(function(t){return"'extend "+t.extend+"' in "+t.parent.fullName}).join(", "));return e.prototype.resolveAll.call(this)};var f=/^[A-Z]/;function c(t,i){var n,r=i.parent.lookup(i.extend);if(r)return n=new s(i.fullName,i.id,i.type,i.rule,g,i.options),r.get(n.name)||((n.declaringField=i).extensionField=n,r.add(n)),1}h.prototype.u=function(t){if(t instanceof s)t.extend===g||t.extensionField||c(0,t)||this.deferred.push(t);else if(t instanceof u)f.test(t.name)&&(t.parent[t.name]=t.values);else if(!(t instanceof o)){if(t instanceof r)for(var i=0;i<this.deferred.length;)c(0,this.deferred[i])?this.deferred.splice(i,1):++i;for(var n=0;n<t.nestedArray.length;++n)this.u(t.e[n]);f.test(t.name)&&(t.parent[t.name]=t)}},h.prototype.o=function(t){var i;if(t instanceof s)t.extend!==g&&(t.extensionField?(t.extensionField.parent.remove(t.extensionField),t.extensionField=null):-1<(i=this.deferred.indexOf(t))&&this.deferred.splice(i,1));else if(t instanceof u)f.test(t.name)&&delete t.parent[t.name];else if(t instanceof e){for(var n=0;n<t.nestedArray.length;++n)this.o(t.e[n]);f.test(t.name)&&delete t.parent[t.name]}},h.r=function(t,i,n){r=t,d=i,v=n}},{14:14,15:15,21:21,23:23,33:33}],27:[function(t,i,n){i.exports={}},{}],28:[function(t,i,n){n.Service=t(29)},{29:29}],29:[function(t,i,n){i.exports=r;var o=t(35);function r(t,i,n){if("function"!=typeof t)throw TypeError("rpcImpl must be a function");o.EventEmitter.call(this),this.rpcImpl=t,this.requestDelimited=!!i,this.responseDelimited=!!n}((r.prototype=Object.create(o.EventEmitter.prototype)).constructor=r).prototype.rpcCall=function t(n,i,r,e,s){if(!e)throw TypeError("request must be specified");var u=this;if(!s)return o.asPromise(t,u,n,i,r,e);if(!u.rpcImpl)return setTimeout(function(){s(Error("already ended"))},0),g;try{return u.rpcImpl(n,i[u.requestDelimited?"encodeDelimited":"encode"](e).finish(),function(t,i){if(t)return u.emit("error",t,n),s(t);if(null===i)return u.end(!0),g;if(!(i instanceof r))try{i=r[u.responseDelimited?"decodeDelimited":"decode"](i)}catch(t){return u.emit("error",t,n),s(t)}return u.emit("data",i,n),s(null,i)})}catch(t){return u.emit("error",t,n),setTimeout(function(){s(t)},0),g}},r.prototype.end=function(t){return this.rpcImpl&&(t||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}},{35:35}],30:[function(t,i,n){i.exports=u;var r=t(21),s=(((u.prototype=Object.create(r.prototype)).constructor=u).className="Service",t(20)),o=t(33),h=t(28);function u(t,i){r.call(this,t,i),this.methods={},this.f=null}function e(t){return t.f=null,t}u.fromJSON=function(t,i){var n=new u(t,i.options);if(i.methods)for(var r=Object.keys(i.methods),e=0;e<r.length;++e)n.add(s.fromJSON(r[e],i.methods[r[e]]));return i.nested&&n.addJSON(i.nested),n.comment=i.comment,n},u.prototype.toJSON=function(t){var i=r.prototype.toJSON.call(this,t),n=!!t&&!!t.keepComments;return o.toObject(["options",i&&i.options||g,"methods",r.arrayToJSON(this.methodsArray,t)||{},"nested",i&&i.nested||g,"comment",n?this.comment:g])},Object.defineProperty(u.prototype,"methodsArray",{get:function(){return this.f||(this.f=o.toArray(this.methods))}}),u.prototype.get=function(t){return this.methods[t]||r.prototype.get.call(this,t)},u.prototype.resolveAll=function(){for(var t=this.methodsArray,i=0;i<t.length;++i)t[i].resolve();return r.prototype.resolve.call(this)},u.prototype.add=function(t){if(this.get(t.name))throw Error("duplicate name '"+t.name+"' in "+this);return t instanceof s?e((this.methods[t.name]=t).parent=this):r.prototype.add.call(this,t)},u.prototype.remove=function(t){if(t instanceof s){if(this.methods[t.name]!==t)throw Error(t+" is not a member of "+this);return delete this.methods[t.name],t.parent=null,e(this)}return r.prototype.remove.call(this,t)},u.prototype.create=function(t,i,n){for(var r,e=new h.Service(t,i,n),s=0;s<this.methodsArray.length;++s){var u=o.lcFirst((r=this.f[s]).resolve().name).replace(/[^$\w_]/g,"");e[u]=o.codegen(["r","c"],o.isReserved(u)?u+"_":u)("return this.rpcCall(m,q,s,r,c)")({m:r,q:r.resolvedRequestType.ctor,s:r.resolvedResponseType.ctor})}return e}},{20:20,21:21,28:28,33:33}],31:[function(t,i,n){i.exports=w;var u=t(21),o=(((w.prototype=Object.create(u.prototype)).constructor=w).className="Type",t(14)),h=t(23),f=t(15),c=t(18),a=t(30),e=t(19),s=t(24),l=t(38),d=t(33),v=t(13),b=t(12),p=t(36),y=t(11),m=t(37);function w(t,i){u.call(this,t,i),this.fields={},this.oneofs=g,this.extensions=g,this.reserved=g,this.group=g,this.c=null,this.i=null,this.a=null,this.l=null}function r(t){return t.c=t.i=t.a=null,delete t.encode,delete t.decode,delete t.verify,t}Object.defineProperties(w.prototype,{fieldsById:{get:function(){if(!this.c){this.c={};for(var t=Object.keys(this.fields),i=0;i<t.length;++i){var n=this.fields[t[i]],r=n.id;if(this.c[r])throw Error("duplicate id "+r+" in "+this);this.c[r]=n}}return this.c}},fieldsArray:{get:function(){return this.i||(this.i=d.toArray(this.fields))}},oneofsArray:{get:function(){return this.a||(this.a=d.toArray(this.oneofs))}},ctor:{get:function(){return this.l||(this.ctor=w.generateConstructor(this)())},set:function(t){for(var i=t.prototype,n=(i instanceof e||((t.prototype=new e).constructor=t,d.merge(t.prototype,i)),t.$type=t.prototype.$type=this,d.merge(t,e,!0),this.l=t,0);n<this.fieldsArray.length;++n)this.i[n].resolve();for(var r={},n=0;n<this.oneofsArray.length;++n)r[this.a[n].resolve().name]={get:d.oneOfGetter(this.a[n].oneof),set:d.oneOfSetter(this.a[n].oneof)};n&&Object.defineProperties(t.prototype,r)}}}),w.generateConstructor=function(t){for(var i,n=d.codegen(["p"],t.name),r=0;r<t.fieldsArray.length;++r)(i=t.i[r]).map?n("this%s={}",d.safeProp(i.name)):i.repeated&&n("this%s=[]",d.safeProp(i.name));return n("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")},w.fromJSON=function(t,i){for(var n=new w(t,i.options),r=(n.extensions=i.extensions,n.reserved=i.reserved,Object.keys(i.fields)),e=0;e<r.length;++e)n.add((void 0!==i.fields[r[e]].keyType?c:f).fromJSON(r[e],i.fields[r[e]]));if(i.oneofs)for(r=Object.keys(i.oneofs),e=0;e<r.length;++e)n.add(h.fromJSON(r[e],i.oneofs[r[e]]));if(i.nested)for(r=Object.keys(i.nested),e=0;e<r.length;++e){var s=i.nested[r[e]];n.add((s.id!==g?f:s.fields!==g?w:s.values!==g?o:s.methods!==g?a:u).fromJSON(r[e],s))}return i.extensions&&i.extensions.length&&(n.extensions=i.extensions),i.reserved&&i.reserved.length&&(n.reserved=i.reserved),i.group&&(n.group=!0),i.comment&&(n.comment=i.comment),n},w.prototype.toJSON=function(t){var i=u.prototype.toJSON.call(this,t),n=!!t&&!!t.keepComments;return d.toObject(["options",i&&i.options||g,"oneofs",u.arrayToJSON(this.oneofsArray,t),"fields",u.arrayToJSON(this.fieldsArray.filter(function(t){return!t.declaringField}),t)||{},"extensions",this.extensions&&this.extensions.length?this.extensions:g,"reserved",this.reserved&&this.reserved.length?this.reserved:g,"group",this.group||g,"nested",i&&i.nested||g,"comment",n?this.comment:g])},w.prototype.resolveAll=function(){for(var t=this.fieldsArray,i=0;i<t.length;)t[i++].resolve();for(var n=this.oneofsArray,i=0;i<n.length;)n[i++].resolve();return u.prototype.resolveAll.call(this)},w.prototype.get=function(t){return this.fields[t]||this.oneofs&&this.oneofs[t]||this.nested&&this.nested[t]||null},w.prototype.add=function(t){if(this.get(t.name))throw Error("duplicate name '"+t.name+"' in "+this);if(t instanceof f&&t.extend===g){if((this.c||this.fieldsById)[t.id])throw Error("duplicate id "+t.id+" in "+this);if(this.isReservedId(t.id))throw Error("id "+t.id+" is reserved in "+this);if(this.isReservedName(t.name))throw Error("name '"+t.name+"' is reserved in "+this);return t.parent&&t.parent.remove(t),(this.fields[t.name]=t).message=this,t.onAdd(this),r(this)}return t instanceof h?(this.oneofs||(this.oneofs={}),(this.oneofs[t.name]=t).onAdd(this),r(this)):u.prototype.add.call(this,t)},w.prototype.remove=function(t){if(t instanceof f&&t.extend===g){if(this.fields&&this.fields[t.name]===t)return delete this.fields[t.name],t.parent=null,t.onRemove(this),r(this);throw Error(t+" is not a member of "+this)}if(t instanceof h){if(this.oneofs&&this.oneofs[t.name]===t)return delete this.oneofs[t.name],t.parent=null,t.onRemove(this),r(this);throw Error(t+" is not a member of "+this)}return u.prototype.remove.call(this,t)},w.prototype.isReservedId=function(t){return u.isReservedId(this.reserved,t)},w.prototype.isReservedName=function(t){return u.isReservedName(this.reserved,t)},w.prototype.create=function(t){return new this.ctor(t)},w.prototype.setup=function(){for(var t=this.fullName,i=[],n=0;n<this.fieldsArray.length;++n)i.push(this.i[n].resolve().resolvedType);this.encode=v(this)({Writer:l,types:i,util:d}),this.decode=b(this)({Reader:s,types:i,util:d}),this.verify=p(this)({types:i,util:d}),this.fromObject=y.fromObject(this)({types:i,util:d}),this.toObject=y.toObject(this)({types:i,util:d});var r,t=m[t];return t&&((r=Object.create(this)).fromObject=this.fromObject,this.fromObject=t.fromObject.bind(r),r.toObject=this.toObject,this.toObject=t.toObject.bind(r)),this},w.prototype.encode=function(t,i){return this.setup().encode(t,i)},w.prototype.encodeDelimited=function(t,i){return this.encode(t,i&&i.len?i.fork():i).ldelim()},w.prototype.decode=function(t,i){return this.setup().decode(t,i)},w.prototype.decodeDelimited=function(t){return t instanceof s||(t=s.create(t)),this.decode(t,t.uint32())},w.prototype.verify=function(t){return this.setup().verify(t)},w.prototype.fromObject=function(t){return this.setup().fromObject(t)},w.prototype.toObject=function(t,i){return this.setup().toObject(t,i)},w.d=function(i){return function(t){d.decorateType(t,i)}}},{11:11,12:12,13:13,14:14,15:15,18:18,19:19,21:21,23:23,24:24,30:30,33:33,36:36,37:37,38:38}],32:[function(t,i,n){var t=t(33),e=["double","float","int32","uint32","sint32","fixed32","sfixed32","int64","uint64","sint64","fixed64","sfixed64","bool","string","bytes"];function r(t,i){var n=0,r={};for(i|=0;n<t.length;)r[e[n+i]]=t[n++];return r}n.basic=r([1,5,0,0,0,5,5,0,0,0,1,1,0,2,2]),n.defaults=r([0,0,0,0,0,0,0,0,0,0,0,0,!1,"",t.emptyArray,null]),n.long=r([0,0,0,1,1],7),n.mapKey=r([0,0,0,5,5,0,0,0,1,1,0,2],2),n.packed=r([1,5,0,0,0,5,5,0,0,0,1,1,0])},{33:33}],33:[function(n,t,i){var r,e,s=t.exports=n(35),u=n(27),o=(s.codegen=n(3),s.fetch=n(5),s.path=n(8),s.fs=s.inquire("fs"),s.toArray=function(t){if(t){for(var i=Object.keys(t),n=Array(i.length),r=0;r<i.length;)n[r]=t[i[r++]];return n}return[]},s.toObject=function(t){for(var i={},n=0;n<t.length;){var r=t[n++],e=t[n++];e!==g&&(i[r]=e)}return i},/\\/g),h=/"/g,f=(s.isReserved=function(t){return/^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(t)},s.safeProp=function(t){return!/^[$\w_]+$/.test(t)||s.isReserved(t)?'["'+t.replace(o,"\\\\").replace(h,'\\"')+'"]':"."+t},s.ucFirst=function(t){return(t[0]||"").toUpperCase()+t.substring(1)},/_([a-z])/g),c=(s.camelCase=function(t){return t.substring(0,1)+t.substring(1).replace(f,function(t,i){return i.toUpperCase()})},s.compareFieldsById=function(t,i){return t.id-i.id},s.decorateType=function(t,i){return t.$type?(i&&t.$type.name!==i&&(s.decorateRoot.remove(t.$type),t.$type.name=i,s.decorateRoot.add(t.$type)),t.$type):(i=new(r=r||n(31))(i||t.name),s.decorateRoot.add(i),i.ctor=t,Object.defineProperty(t,"$type",{value:i,enumerable:!1}),Object.defineProperty(t.prototype,"$type",{value:i,enumerable:!1}),i)},0);s.decorateEnum=function(t){var i;return t.$type||(i=new(e=e||n(14))("Enum"+c++,t),s.decorateRoot.add(i),Object.defineProperty(t,"$type",{value:i,enumerable:!1}),i)},s.setProperty=function(t,i,n){if("object"!=typeof t)throw TypeError("dst must be an object");if(i)return function t(i,n,r){var e=n.shift();return"__proto__"!==e&&"prototype"!==e&&(0<n.length?i[e]=t(i[e]||{},n,r):((n=i[e])&&(r=[].concat(n).concat(r)),i[e]=r)),i}(t,i=i.split("."),n);throw TypeError("path must be specified")},Object.defineProperty(s,"decorateRoot",{get:function(){return u.decorated||(u.decorated=new(n(26)))}})},{14:14,26:26,27:27,3:3,31:31,35:35,5:5,8:8}],34:[function(t,i,n){i.exports=e;var r=t(35);function e(t,i){this.lo=t>>>0,this.hi=i>>>0}var s=e.zero=new e(0,0),u=(s.toNumber=function(){return 0},s.zzEncode=s.zzDecode=function(){return this},s.length=function(){return 1},e.zeroHash="\0\0\0\0\0\0\0\0",e.fromNumber=function(t){var i,n;return 0===t?s:(n=(t=(i=t<0)?-t:t)>>>0,t=(t-n)/4294967296>>>0,i&&(t=~t>>>0,n=~n>>>0,4294967295<++n&&(n=0,4294967295<++t&&(t=0))),new e(n,t))},e.from=function(t){if("number"==typeof t)return e.fromNumber(t);if(r.isString(t)){if(!r.Long)return e.fromNumber(parseInt(t,10));t=r.Long.fromString(t)}return t.low||t.high?new e(t.low>>>0,t.high>>>0):s},e.prototype.toNumber=function(t){var i;return!t&&this.hi>>>31?(t=1+~this.lo>>>0,i=~this.hi>>>0,-(t+4294967296*(i=t?i:i+1>>>0))):this.lo+4294967296*this.hi},e.prototype.toLong=function(t){return r.Long?new r.Long(0|this.lo,0|this.hi,!!t):{low:0|this.lo,high:0|this.hi,unsigned:!!t}},String.prototype.charCodeAt);e.fromHash=function(t){return"\0\0\0\0\0\0\0\0"===t?s:new e((u.call(t,0)|u.call(t,1)<<8|u.call(t,2)<<16|u.call(t,3)<<24)>>>0,(u.call(t,4)|u.call(t,5)<<8|u.call(t,6)<<16|u.call(t,7)<<24)>>>0)},e.prototype.toHash=function(){return String.fromCharCode(255&this.lo,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,255&this.hi,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},e.prototype.zzEncode=function(){var t=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^t)>>>0,this.lo=(this.lo<<1^t)>>>0,this},e.prototype.zzDecode=function(){var t=-(1&this.lo);return this.lo=((this.lo>>>1|this.hi<<31)^t)>>>0,this.hi=(this.hi>>>1^t)>>>0,this},e.prototype.length=function(){var t=this.lo,i=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return 0==n?0==i?t<16384?t<128?1:2:t<2097152?3:4:i<16384?i<128?5:6:i<2097152?7:8:n<128?9:10}},{35:35}],35:[function(t,i,n){var r=n;function e(t,i,n){for(var r=Object.keys(i),e=0;e<r.length;++e)t[r[e]]!==g&&n||(t[r[e]]=i[r[e]]);return t}function s(t){function n(t,i){if(!(this instanceof n))return new n(t,i);Object.defineProperty(this,"message",{get:function(){return t}}),Error.captureStackTrace?Error.captureStackTrace(this,n):Object.defineProperty(this,"stack",{value:Error().stack||""}),i&&e(this,i)}return n.prototype=Object.create(Error.prototype,{constructor:{value:n,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return t},set:g,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),n}r.asPromise=t(1),r.base64=t(2),r.EventEmitter=t(4),r.float=t(6),r.inquire=t(7),r.utf8=t(10),r.pool=t(9),r.LongBits=t(34),r.isNode=!!("undefined"!=typeof global&&global&&global.process&&global.process.versions&&global.process.versions.node),r.global=r.isNode&&global||"undefined"!=typeof window&&window||"undefined"!=typeof self&&self||this,r.emptyArray=Object.freeze?Object.freeze([]):[],r.emptyObject=Object.freeze?Object.freeze({}):{},r.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t},r.isString=function(t){return"string"==typeof t||t instanceof String},r.isObject=function(t){return t&&"object"==typeof t},r.isset=r.isSet=function(t,i){var n=t[i];return null!=n&&t.hasOwnProperty(i)&&("object"!=typeof n||0<(Array.isArray(n)?n:Object.keys(n)).length)},r.Buffer=function(){try{var t=r.inquire("buffer").Buffer;return t.prototype.utf8Write?t:null}catch(t){return null}}(),r.v=null,r.b=null,r.newBuffer=function(t){return"number"==typeof t?r.Buffer?r.b(t):new r.Array(t):r.Buffer?r.v(t):"undefined"==typeof Uint8Array?t:new Uint8Array(t)},r.Array="undefined"!=typeof Uint8Array?Uint8Array:Array,r.Long=r.global.dcodeIO&&r.global.dcodeIO.Long||r.global.Long||r.inquire("long"),r.key2Re=/^true|false|0|1$/,r.key32Re=/^-?(?:0|[1-9][0-9]*)$/,r.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,r.longToHash=function(t){return t?r.LongBits.from(t).toHash():r.LongBits.zeroHash},r.longFromHash=function(t,i){t=r.LongBits.fromHash(t);return r.Long?r.Long.fromBits(t.lo,t.hi,i):t.toNumber(!!i)},r.merge=e,r.lcFirst=function(t){return(t[0]||"").toLowerCase()+t.substring(1)},r.newError=s,r.ProtocolError=s("ProtocolError"),r.oneOfGetter=function(t){for(var n={},i=0;i<t.length;++i)n[t[i]]=1;return function(){for(var t=Object.keys(this),i=t.length-1;-1<i;--i)if(1===n[t[i]]&&this[t[i]]!==g&&null!==this[t[i]])return t[i]}},r.oneOfSetter=function(n){return function(t){for(var i=0;i<n.length;++i)n[i]!==t&&delete this[n[i]]}},r.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},r.r=function(){var n=r.Buffer;n?(r.v=n.from!==Uint8Array.from&&n.from||function(t,i){return new n(t,i)},r.b=n.allocUnsafe||function(t){return new n(t)}):r.v=r.b=null}},{1:1,10:10,2:2,34:34,4:4,6:6,7:7,9:9}],36:[function(t,i,n){i.exports=function(t){var i=h.codegen(["m"],t.name+"$verify")('if(typeof m!=="object"||m===null)')("return%j","object expected"),n=t.oneofsArray,r={};n.length&&i("var p={}");for(var e=0;e<t.fieldsArray.length;++e){var s,u=t.i[e].resolve(),o="m"+h.safeProp(u.name);u.optional&&i("if(%s!=null&&m.hasOwnProperty(%j)){",o,u.name),u.map?(i("if(!util.isObject(%s))",o)("return%j",f(u,"object"))("var k=Object.keys(%s)",o)("for(var i=0;i<k.length;++i){"),function(t,i,n){switch(i.keyType){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":t("if(!util.key32Re.test(%s))",n)("return%j",f(i,"integer key"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":t("if(!util.key64Re.test(%s))",n)("return%j",f(i,"integer|Long key"));break;case"bool":t("if(!util.key2Re.test(%s))",n)("return%j",f(i,"boolean key"))}}(i,u,"k[i]"),c(i,u,e,o+"[k[i]]")("}")):u.repeated?(i("if(!Array.isArray(%s))",o)("return%j",f(u,"array"))("for(var i=0;i<%s.length;++i){",o),c(i,u,e,o+"[i]")("}")):(u.partOf&&(s=h.safeProp(u.partOf.name),1===r[u.partOf.name]&&i("if(p%s===1)",s)("return%j",u.partOf.name+": multiple values"),r[u.partOf.name]=1,i("p%s=1",s)),c(i,u,e,o)),u.optional&&i("}")}return i("return null")};var u=t(14),h=t(33);function f(t,i){return t.name+": "+i+(t.repeated&&"array"!==i?"[]":t.map&&"object"!==i?"{k:"+t.keyType+"}":"")+" expected"}function c(t,i,n,r){if(i.resolvedType)if(i.resolvedType instanceof u){t("switch(%s){",r)("default:")("return%j",f(i,"enum value"));for(var e=Object.keys(i.resolvedType.values),s=0;s<e.length;++s)t("case %i:",i.resolvedType.values[e[s]]);t("break")("}")}else t("{")("var e=types[%i].verify(%s);",n,r)("if(e)")("return%j+e",i.name+".")("}");else switch(i.type){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":t("if(!util.isInteger(%s))",r)("return%j",f(i,"integer"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":t("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))",r,r,r,r)("return%j",f(i,"integer|Long"));break;case"float":case"double":t('if(typeof %s!=="number")',r)("return%j",f(i,"number"));break;case"bool":t('if(typeof %s!=="boolean")',r)("return%j",f(i,"boolean"));break;case"string":t("if(!util.isString(%s))",r)("return%j",f(i,"string"));break;case"bytes":t('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))',r,r,r)("return%j",f(i,"buffer"))}return t}},{14:14,33:33}],37:[function(t,i,n){var u=t(19);n[".google.protobuf.Any"]={fromObject:function(t){if(t&&t["@type"]){var i,n=t["@type"].substring(1+t["@type"].lastIndexOf("/")),n=this.lookup(n);if(n)return~(i="."==(t["@type"][0]||"")?t["@type"].slice(1):t["@type"]).indexOf("/")||(i="/"+i),this.create({type_url:i,value:n.encode(n.fromObject(t)).finish()})}return this.fromObject(t)},toObject:function(t,i){var n,r,e="",s="";return i&&i.json&&t.type_url&&t.value&&(s=t.type_url.substring(1+t.type_url.lastIndexOf("/")),e=t.type_url.substring(0,1+t.type_url.lastIndexOf("/")),(n=this.lookup(s))&&(t=n.decode(t.value))),!(t instanceof this.ctor)&&t instanceof u?(n=t.$type.toObject(t,i),r="."===t.$type.fullName[0]?t.$type.fullName.slice(1):t.$type.fullName,n["@type"]=s=(e=""===e?"type.googleapis.com/":e)+r,n):this.toObject(t,i)}}},{19:19}],38:[function(t,i,n){i.exports=a;var r,e=t(35),s=e.LongBits,u=e.base64,o=e.utf8;function h(t,i,n){this.fn=t,this.len=i,this.next=g,this.val=n}function f(){}function c(t){this.head=t.head,this.tail=t.tail,this.len=t.len,this.next=t.states}function a(){this.len=0,this.head=new h(f,0,0),this.tail=this.head,this.states=null}function l(){return e.Buffer?function(){return(a.create=function(){return new r})()}:function(){return new a}}function d(t,i,n){i[n]=255&t}function v(t,i){this.len=t,this.next=g,this.val=i}function b(t,i,n){for(;t.hi;)i[n++]=127&t.lo|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;127<t.lo;)i[n++]=127&t.lo|128,t.lo=t.lo>>>7;i[n++]=t.lo}function p(t,i,n){i[n]=255&t,i[n+1]=t>>>8&255,i[n+2]=t>>>16&255,i[n+3]=t>>>24}a.create=l(),a.alloc=function(t){return new e.Array(t)},e.Array!==Array&&(a.alloc=e.pool(a.alloc,e.Array.prototype.subarray)),a.prototype.p=function(t,i,n){return this.tail=this.tail.next=new h(t,i,n),this.len+=i,this},(v.prototype=Object.create(h.prototype)).fn=function(t,i,n){for(;127<t;)i[n++]=127&t|128,t>>>=7;i[n]=t},a.prototype.uint32=function(t){return this.len+=(this.tail=this.tail.next=new v((t>>>=0)<128?1:t<16384?2:t<2097152?3:t<268435456?4:5,t)).len,this},a.prototype.int32=function(t){return t<0?this.p(b,10,s.fromNumber(t)):this.uint32(t)},a.prototype.sint32=function(t){return this.uint32((t<<1^t>>31)>>>0)},a.prototype.int64=a.prototype.uint64=function(t){t=s.from(t);return this.p(b,t.length(),t)},a.prototype.sint64=function(t){t=s.from(t).zzEncode();return this.p(b,t.length(),t)},a.prototype.bool=function(t){return this.p(d,1,t?1:0)},a.prototype.sfixed32=a.prototype.fixed32=function(t){return this.p(p,4,t>>>0)},a.prototype.sfixed64=a.prototype.fixed64=function(t){t=s.from(t);return this.p(p,4,t.lo).p(p,4,t.hi)},a.prototype.float=function(t){return this.p(e.float.writeFloatLE,4,t)},a.prototype.double=function(t){return this.p(e.float.writeDoubleLE,8,t)};var y=e.Array.prototype.set?function(t,i,n){i.set(t,n)}:function(t,i,n){for(var r=0;r<t.length;++r)i[n+r]=t[r]};a.prototype.bytes=function(t){var i,n=t.length>>>0;return n?(e.isString(t)&&(i=a.alloc(n=u.length(t)),u.decode(t,i,0),t=i),this.uint32(n).p(y,n,t)):this.p(d,1,0)},a.prototype.string=function(t){var i=o.length(t);return i?this.uint32(i).p(o.write,i,t):this.p(d,1,0)},a.prototype.fork=function(){return this.states=new c(this),this.head=this.tail=new h(f,0,0),this.len=0,this},a.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new h(f,0,0),this.len=0),this},a.prototype.ldelim=function(){var t=this.head,i=this.tail,n=this.len;return this.reset().uint32(n),n&&(this.tail.next=t.next,this.tail=i,this.len+=n),this},a.prototype.finish=function(){for(var t=this.head.next,i=this.constructor.alloc(this.len),n=0;t;)t.fn(t.val,i,n),n+=t.len,t=t.next;return i},a.r=function(t){r=t,a.create=l(),r.r()}},{35:35}],39:[function(t,i,n){i.exports=s;var r=t(38),e=((s.prototype=Object.create(r.prototype)).constructor=s,t(35));function s(){r.call(this)}function u(t,i,n){t.length<40?e.utf8.write(t,i,n):i.utf8Write?i.utf8Write(t,n):i.write(t,n)}s.r=function(){s.alloc=e.b,s.writeBytesBuffer=e.Buffer&&e.Buffer.prototype instanceof Uint8Array&&"set"===e.Buffer.prototype.set.name?function(t,i,n){i.set(t,n)}:function(t,i,n){if(t.copy)t.copy(i,n,0,t.length);else for(var r=0;r<t.length;)i[n++]=t[r++]}},s.prototype.bytes=function(t){var i=(t=e.isString(t)?e.v(t,"base64"):t).length>>>0;return this.uint32(i),i&&this.p(s.writeBytesBuffer,i,t),this},s.prototype.string=function(t){var i=e.Buffer.byteLength(t);return this.uint32(i),i&&this.p(u,i,t),this},s.r()},{35:35,38:38}]},{},[16])}();
//# sourceMappingURL=protobuf.min.js.map

var bundle = (
  protobuf.roots["default"] ||
  (protobuf.roots["default"] = new protobuf.Root())
).addJSON({
  Response: {
    oneofs: {
      _j: {
        oneof: ["j"],
      },
    },
    fields: {
      a: {
        type: "string",
        id: 1,
      },
      b: {
        type: "string",
        id: 2,
      },
      c: {
        type: "bool",
        id: 3,
      },
      e: {
        type: "int32",
        id: 5,
      },
      f: {
        type: "int32",
        id: 6,
      },
      g: {
        type: "bool",
        id: 7,
      },
      h: {
        type: "bool",
        id: 8,
      },
      i: {
        type: "string",
        id: 9,
      },
      j: {
        type: "string",
        id: 10,
        options: {
          proto3_optional: true,
        },
      },
    },
  },
  Identification: {
    oneofs: {
      _tls: {
        oneof: ["tls"],
      },
      _dev: {
        oneof: ["dev"],
      },
      _url: {
        oneof: ["url"],
      },
      _private: {
        oneof: ["private"],
      },
      _old: {
        oneof: ["old"],
      },
      _cookie: {
        oneof: ["cookie"],
      },
      _local: {
        oneof: ["local"],
      },
      _print: {
        oneof: ["print"],
      },
      _id: {
        oneof: ["id"],
      },
      _tag: {
        oneof: ["tag"],
      },
    },
    fields: {
      tls: {
        type: "string",
        id: 1,
        options: {
          proto3_optional: true,
        },
      },
      dev: {
        type: "int32",
        id: 2,
        options: {
          proto3_optional: true,
        },
      },
      url: {
        type: "string",
        id: 3,
        options: {
          proto3_optional: true,
        },
      },
      platform: {
        keyType: "string",
        type: "string",
        id: 4,
      },
      private: {
        type: "Private",
        id: 5,
        options: {
          proto3_optional: true,
        },
      },
      old: {
        type: "string",
        id: 6,
        options: {
          proto3_optional: true,
        },
      },
      cookie: {
        type: "string",
        id: 7,
        options: {
          proto3_optional: true,
        },
      },
      clientTiming: {
        type: "int32",
        id: 8,
      },
      local: {
        type: "bool",
        id: 9,
        options: {
          proto3_optional: true,
        },
      },
      print: {
        type: "Print",
        id: 10,
        options: {
          proto3_optional: true,
        },
      },
      id: {
        type: "string",
        id: 11,
        options: {
          proto3_optional: true,
        },
      },
      tag: {
        type: "string",
        id: 12,
        options: {
          proto3_optional: true,
        },
      },
    },
  },
  Print: {
    oneofs: {
      _c1: {
        oneof: ["c1"],
      },
      _id: {
        oneof: ["id"],
      },
    },
    fields: {
      a: {
        type: "string",
        id: 1,
      },
      b: {
        keyType: "string",
        type: "bool",
        id: 2,
      },
      d: {
        type: "bool",
        id: 3,
      },
      g: {
        type: "Audio",
        id: 4,
      },
      i: {
        type: "string",
        id: 5,
      },
      j: {
        type: "string",
        id: 6,
      },
      k: {
        type: "int32",
        id: 7,
      },
      m: {
        type: "string",
        id: 8,
      },
      n: {
        type: "int32",
        id: 9,
      },
      o: {
        type: "int32",
        id: 10,
      },
      t: {
        type: "string",
        id: 11,
      },
      v: {
        type: "string",
        id: 12,
      },
      w: {
        type: "string",
        id: 13,
      },
      x: {
        type: "string",
        id: 14,
      },
      y: {
        type: "string",
        id: 15,
      },
      z: {
        type: "string",
        id: 16,
      },
      bb: {
        type: "string",
        id: 17,
      },
      cc: {
        type: "int32",
        id: 18,
      },
      dd: {
        type: "bool",
        id: 19,
      },
      ee: {
        type: "int32",
        id: 20,
      },
      ff: {
        type: "string",
        id: 21,
      },
      gg: {
        type: "int32",
        id: 22,
      },
      hh: {
        type: "bool",
        id: 23,
      },
      ii: {
        rule: "repeated",
        type: "double",
        id: 24,
      },
      jj: {
        rule: "repeated",
        type: "WebGLData",
        id: 25,
      },
      ll: {
        type: "int32",
        id: 26,
      },
      a1: {
        type: "string",
        id: 27,
      },
      a8: {
        type: "string",
        id: 28,
      },
      a0: {
        type: "bool",
        id: 29,
      },
      b0: {
        type: "int32",
        id: 30,
      },
      zz: {
        type: "string",
        id: 31,
      },
      a2: {
        type: "string",
        id: 32,
      },
      a3: {
        type: "string",
        id: 33,
      },
      a4: {
        type: "string",
        id: 34,
      },
      a5: {
        type: "string",
        id: 35,
      },
      a6: {
        type: "string",
        id: 36,
      },
      a7: {
        type: "string",
        id: 37,
      },
      a9: {
        type: "string",
        id: 38,
      },
      b1: {
        type: "string",
        id: 39,
      },
      kk: {
        type: "bool",
        id: 40,
      },
      aa: {
        type: "bool",
        id: 41,
      },
      p: {
        type: "bool",
        id: 42,
      },
      q: {
        type: "bool",
        id: 43,
      },
      r: {
        type: "bool",
        id: 44,
      },
      s: {
        type: "bool",
        id: 45,
      },
      b2: {
        type: "string",
        id: 46,
      },
      c: {
        rule: "repeated",
        type: "int32",
        id: 47,
      },
      c1: {
        type: "string",
        id: 48,
        options: {
          proto3_optional: true,
        },
      },
      id: {
        type: "string",
        id: 49,
        options: {
          proto3_optional: true,
        },
      },
      ua: {
        type: "string",
        id: 50,
      },
    },
  },
  WebGLData: {
    fields: {
      debugRendererInfo: {
        keyType: "string",
        type: "string",
        id: 1,
      },
      fragmentShader: {
        type: "FragmentShader",
        id: 2,
      },
      frameBuffer: {
        type: "FrameBuffer",
        id: 3,
      },
      gpu: {
        type: "string",
        id: 4,
      },
      gpuBrand: {
        type: "string",
        id: 5,
      },
      gpuHash: {
        type: "string",
        id: 6,
      },
      rasterizer: {
        type: "Rasterizer",
        id: 7,
      },
      textures: {
        keyType: "string",
        type: "int32",
        id: 8,
      },
      vertexShader: {
        type: "VertexShader",
        id: 9,
      },
      webGLContextInfo: {
        type: "WebGLContextInfo",
        id: 10,
      },
      webGLExtensions: {
        rule: "repeated",
        type: "string",
        id: 11,
      },
      transformFeedback: {
        keyType: "string",
        type: "int32",
        id: 12,
      },
      uniformBuffers: {
        keyType: "string",
        type: "int32",
        id: 13,
      },
    },
  },
  Rasterizer: {
    fields: {
      a: {
        rule: "repeated",
        type: "int32",
        id: 1,
      },
      b: {
        rule: "repeated",
        type: "int32",
        id: 2,
      },
    },
  },
  WebGLContextInfo: {
    oneofs: {
      _c: {
        oneof: ["c"],
      },
    },
    fields: {
      a: {
        type: "bool",
        id: 1,
      },
      b: {
        type: "string",
        id: 2,
      },
      c: {
        type: "bool",
        id: 3,
        options: {
          proto3_optional: true,
        },
      },
      d: {
        type: "bool",
        id: 4,
      },
      e: {
        type: "string",
        id: 5,
      },
      f: {
        type: "string",
        id: 6,
      },
    },
  },
  VertexShader: {
    oneofs: {
      _f: {
        oneof: ["f"],
      },
      _g: {
        oneof: ["g"],
      },
      _h: {
        oneof: ["h"],
      },
      _i: {
        oneof: ["i"],
      },
      _j: {
        oneof: ["j"],
      },
    },
    fields: {
      a: {
        type: "int32",
        id: 1,
      },
      b: {
        type: "int32",
        id: 2,
      },
      c: {
        type: "int32",
        id: 3,
      },
      d: {
        type: "int32",
        id: 4,
      },
      e: {
        rule: "repeated",
        type: "int32",
        id: 5,
      },
      f: {
        type: "int32",
        id: 6,
        options: {
          proto3_optional: true,
        },
      },
      g: {
        type: "int32",
        id: 7,
        options: {
          proto3_optional: true,
        },
      },
      h: {
        type: "int32",
        id: 8,
        options: {
          proto3_optional: true,
        },
      },
      i: {
        type: "int32",
        id: 9,
        options: {
          proto3_optional: true,
        },
      },
      j: {
        type: "int32",
        id: 10,
        options: {
          proto3_optional: true,
        },
      },
    },
  },
  FragmentShader: {
    oneofs: {
      _d: {
        oneof: ["d"],
      },
      _e: {
        oneof: ["e"],
      },
      _f: {
        oneof: ["f"],
      },
      _g: {
        oneof: ["g"],
      },
      _h: {
        oneof: ["h"],
      },
    },
    fields: {
      a: {
        rule: "repeated",
        type: "int32",
        id: 1,
      },
      b: {
        type: "int32",
        id: 2,
      },
      c: {
        type: "int32",
        id: 3,
      },
      d: {
        type: "int32",
        id: 4,
        options: {
          proto3_optional: true,
        },
      },
      e: {
        type: "int32",
        id: 5,
        options: {
          proto3_optional: true,
        },
      },
      f: {
        type: "int32",
        id: 6,
        options: {
          proto3_optional: true,
        },
      },
      g: {
        type: "int32",
        id: 7,
        options: {
          proto3_optional: true,
        },
      },
      h: {
        type: "int32",
        id: 8,
        options: {
          proto3_optional: true,
        },
      },
    },
  },
  FrameBuffer: {
    oneofs: {
      _e: {
        oneof: ["e"],
      },
      _f: {
        oneof: ["f"],
      },
      _g: {
        oneof: ["g"],
      },
    },
    fields: {
      a: {
        rule: "repeated",
        type: "int32",
        id: 1,
      },
      b: {
        type: "int32",
        id: 2,
      },
      c: {
        rule: "repeated",
        type: "int32",
        id: 3,
      },
      d: {
        rule: "repeated",
        type: "int32",
        id: 4,
      },
      e: {
        type: "int32",
        id: 5,
        options: {
          proto3_optional: true,
        },
      },
      f: {
        type: "int32",
        id: 6,
        options: {
          proto3_optional: true,
        },
      },
      g: {
        type: "int32",
        id: 7,
        options: {
          proto3_optional: true,
        },
      },
    },
  },
  Audio: {
    fields: {
      pxi: {
        type: "double",
        id: 1,
      },
      vc: {
        type: "AudioData",
        id: 2,
      },
      hash: {
        type: "string",
        id: 3,
      },
    },
  },
  AudioData: {
    fields: {
      a: {
        type: "double",
        id: 1,
      },
      b: {
        type: "int32",
        id: 2,
      },
      c: {
        type: "string",
        id: 3,
      },
      d: {
        type: "string",
        id: 4,
      },
      e: {
        type: "int32",
        id: 5,
      },
      f: {
        type: "int32",
        id: 6,
      },
      g: {
        type: "int32",
        id: 7,
      },
      h: {
        type: "int32",
        id: 8,
      },
      i: {
        type: "int32",
        id: 9,
      },
      j: {
        type: "string",
        id: 10,
      },
      k: {
        type: "string",
        id: 11,
      },
      l: {
        type: "int32",
        id: 12,
      },
      m: {
        type: "string",
        id: 13,
      },
      n: {
        type: "string",
        id: 14,
      },
      o: {
        type: "int32",
        id: 15,
      },
      p: {
        type: "int32",
        id: 16,
      },
      q: {
        type: "int32",
        id: 17,
      },
      r: {
        type: "int32",
        id: 18,
      },
      s: {
        type: "int32",
        id: 19,
      },
      t: {
        type: "int32",
        id: 20,
      },
      u: {
        type: "double",
        id: 21,
      },
    },
  },
  Private: {
    fields: {
      isPrivate: {
        type: "bool",
        id: 1,
      },
      browserName: {
        type: "string",
        id: 2,
      },
    },
  },
});


class DeviceIDError extends Error {
  constructor(message) {
    super(message);
    this.type = message.type;
    this.val = message.val;
    this.code = message.code;
  }
}

const {
  Identification,
  Print,
  Audio,
  AudioData,
  Private,
  FragmentShader,
  Rasterizer,
  FrameBuffer,
  WebGLData,
  VertexShader,
  WebGLContextInfo,
  Response,
} = bundle;

  var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P
          ? value
          : new P(function (resolve) {
              resolve(value);
            });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done
            ? resolve(result.value)
            : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
  var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
      var _ = {
          label: 0,
          sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: [],
        },
        f,
        y,
        t,
        g;
      return (
        (g = { next: verb(0), throw: verb(1), return: verb(2) }),
        typeof Symbol === "function" &&
          (g[Symbol.iterator] = function () {
            return this;
          }),
        g
      );
      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while ((g && ((g = 0), op[0] && (_ = 0)), _))
          try {
            if (
              ((f = 1),
              y &&
                (t =
                  op[0] & 2
                    ? y["return"]
                    : op[0]
                      ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                      : y.next) &&
                !(t = t.call(y, op[1])).done)
            )
              return t;
            if (((y = 0), t)) op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (
                  !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                  (op[0] === 6 || op[0] === 2)
                ) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2]) _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
  //exports.__esModule = true;
  function detectIncognito() {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              new Promise(function (resolve, reject) {
                var browserName = "Unknown";
                function __callback(isPrivate) {
                  resolve({
                    isPrivate: isPrivate,
                    browserName: browserName,
                  });
                }
                function identifyChromium() {
                  var ua = navigator.userAgent;
                  if (ua.match(/Chrome/)) {
                    if (navigator.brave !== undefined) {
                      return "Brave";
                    } else if (ua.match(/Edg/)) {
                      return "Edge";
                    } else if (ua.match(/OPR/)) {
                      return "Opera";
                    }
                    return "Chrome";
                  } else {
                    return "Chromium";
                  }
                }
                function assertEvalToString(value) {
                  return value === eval.toString().length;
                }
                function isSafari() {
                  var v = navigator.vendor;
                  return (
                    v !== undefined &&
                    v.indexOf("Apple") === 0 &&
                    assertEvalToString(37)
                  );
                }
                function isChrome() {
                  var v = navigator.vendor;
                  return (
                    v !== undefined &&
                    v.indexOf("Google") === 0 &&
                    assertEvalToString(33)
                  );
                }
                function isFirefox() {
                  return (
                    document.documentElement !== undefined &&
                    document.documentElement.style.MozAppearance !==
                      undefined &&
                    assertEvalToString(37)
                  );
                }
                function isMSIE() {
                  return (
                    navigator.msSaveBlob !== undefined && assertEvalToString(39)
                  );
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
                      var res =
                        (_a = i.target) === null || _a === void 0
                          ? void 0
                          : _a.result;
                      try {
                        res
                          .createObjectStore("test", {
                            autoIncrement: true,
                          })
                          .put(new Blob());
                        __callback(false);
                      } catch (e) {
                        var message = e;
                        if (e instanceof Error) {
                          message =
                            (_b = e.message) !== null && _b !== void 0 ? _b : e;
                        }
                        if (typeof message !== "string") {
                          __callback(false);
                          return;
                        }
                        var matchesExpectedError = message.includes(
                          "BlobURLs are not yet supported",
                        );
                        __callback(matchesExpectedError);
                        return;
                      } finally {
                        res.close();
                        window.indexedDB.deleteDatabase(tmp_name);
                      }
                    };
                  } catch (e) {
                    __callback(false);
                  }
                }
                function oldSafariTest() {
                  var openDB = window.openDatabase;
                  var storage = window.localStorage;
                  try {
                    openDB(null, null, null, null);
                  } catch (e) {
                    __callback(true);
                    return;
                  }
                  try {
                    storage.setItem("test", "1");
                    storage.removeItem("test");
                  } catch (e) {
                    __callback(true);
                    return;
                  }
                  __callback(false);
                }
                function safariPrivateTest() {
                  if (navigator.maxTouchPoints !== undefined) {
                    newSafariTest();
                  } else {
                    oldSafariTest();
                  }
                }
                /**
                 * Chrome
                 **/
                function getQuotaLimit() {
                  var w = window;
                  if (
                    w.performance !== undefined &&
                    w.performance.memory !== undefined &&
                    w.performance.memory.jsHeapSizeLimit !== undefined
                  ) {
                    return performance.memory.jsHeapSizeLimit;
                  }
                  return 1073741824;
                }
                // >= 76
                function storageQuotaChromePrivateTest() {
                  navigator.webkitTemporaryStorage.queryUsageAndQuota(
                    function (_, quota) {
                      var quotaInMib = Math.round(quota / (1024 * 1024));
                      var quotaLimitInMib =
                        Math.round(getQuotaLimit() / (1024 * 1024)) * 2;
                      __callback(quotaInMib < quotaLimitInMib);
                    },
                    function (e) {
                      reject(
                        new Error(
                          "detectIncognito somehow failed to query storage quota: " +
                            e.message,
                        ),
                      );
                    },
                  );
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
                  if (
                    Promise !== undefined &&
                    Promise.allSettled !== undefined
                  ) {
                    storageQuotaChromePrivateTest();
                  } else {
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
                    browserName = "Safari";
                    safariPrivateTest();
                  } else if (isChrome()) {
                    browserName = identifyChromium();
                    chromePrivateTest();
                  } else if (isFirefox()) {
                    browserName = "Firefox";
                    firefoxPrivateTest();
                  } else if (isMSIE()) {
                    browserName = "Internet Explorer";
                    msiePrivateTest();
                  } else {
                    reject(
                      new Error("detectIncognito cannot determine the browser"),
                    );
                  }
                }
                main();
              }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  }

  (function (name, context, definition) {
    "use strict";
    if (typeof module !== "undefined" && module.exports) {
      module.exports = definition();
    } else if (typeof define === "function" && define.amd) {
      define(definition);
    } else {
      context[name] = definition();
    }
  })("DeviceID", this, function () {
    "use strict";
    // for IE8 and older
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (searchElement, fromIndex) {
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
    var DeviceID = function (options) {
      this.loaded = ""; // loaded token for communication
      this.stored_id = ""; // visit identifier for TLS
      this.old = null; // stored localStorage ID
      this.cookie = null; // stored cookie ID
      this.url = "https://test.deviceid.io:3005";
      //this.url = 'https://api.deviceid.io';
      this.options = options;
      this.uap = new UAParser();
      this.tokenErrorCount = 0;
      this.iv = CryptoJS.enc.Utf8.parse("c7VEVapazCwNVcWgi1Ej");
    };
    DeviceID.prototype = {
      load: async function (done) {
        try {
          this.stored_id = localStorage.getItem("deviceID_identifier");
          if (
            this.stored_id == null ||
            this.stored_id == undefined ||
            this.stored_id.length != 20
          ) {
            this.stored_id = this.makeid(20);
            localStorage.setItem("deviceID_identifier", this.stored_id);
          }

          // return done(new Promise(async (resolve, reject) => {
          if (typeof this.options === "object") {
            if (!("apiKey" in this.options)) {
              return done(
                false,
                new DeviceIDError({
                  type: "LOAD ERROR",
                  code: 0,
                  val: "NO API KEY PROVIDED",
                }),
              );
              // return done(false);
            } else if (!("secret" in this.options)) {
              return done(
                false,
                new DeviceIDError({
                  type: "LOAD ERROR",
                  code: 1,
                  val: "NO SECRET KEY PROVIDED",
                }),
              );
              //  return done(false);
            }
          } else {
            return done(
              false,
              new DeviceIDError({
                type: "LOAD ERROR",
                code: 2,
                val: "NO DATA PROVIDED",
              }),
            );
            // return done(false);
          }
          const xhr1 = new XMLHttpRequest();
          xhr1.open("POST", "https://test.deviceid.io/index.json");

          xhr1.setRequestHeader("Content-Type", "text/plain");
          xhr1.send(JSON.stringify({ id: this.stored_id }));
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                try {
                  this.loaded = CryptoJS.AES.decrypt(
                    xhr.responseText,
                    this.options.secret,
                  ).toString(CryptoJS.enc.Utf8);
                } catch (e) {
                  return done(
                    false,
                    new DeviceIDError({
                      code: 10,
                      val: "SECRET KEY DECRYPTION FAILED",
                      type: "LOAD ERROR",
                    }),
                  );
                }
                // this.key = this.options.secret;
                if (typeof Storage !== "undefined") {
                  this.old = localStorage.getItem("c:GkK?_5eVdQdiQT0Fb?");
                }
                if (navigator.cookieEnabled) {
                  this.cookieStored = this.getCookie("-BAL4_z*-wQ=6TYqCA!U");
                }
                return done(true, null);
              } else {
                try {
                  const dt = xhr.responseText.split(":");
                  return done(
                    false,
                    new DeviceIDError({
                      type: "LOAD ERROR",
                      code: dt[1],
                      val: dt[0],
                    }),
                  );
                } catch (err) {
                  return done(
                    false,
                    new DeviceIDError({
                      type: "LOAD ERROR",
                      code: xhr.status,
                      val: xhr.responseText,
                    }),
                  );
                }
              }
            }
          };
          xhr.open(
            "GET",
            "https://test.deviceid.io:3005/load?key=" +
              encodeURIComponent(this.options.apiKey),
          );
          xhr.send();
          try {
            detectIncognito().then((res) => {
              this.prv = res;
            });
          } catch (e) {
            this.prv = {
              isPrivate: false,
              browserName: "-",
            };
          }
          this.device = this.device();
        } catch (e) {
          return done(
            false,
            new DeviceIDError({ code: 99, val: e, type: "Load Error" }),
          );
        }
      },
      id: async function (done) {
        try {
          var obj = undefined;
          var str =
            (typeof this.old === "string" && this.old.length > 0) ||
            (typeof this.cookieStored === "string" &&
              this.cookieStored.length > 0);
          const start = performance.now();
          if (!str) {
            const audioData = await this.getAudio(this);
            obj = {
              a: this.fonts(),
              b: this.cryptoSupport(),
              d: this.blending(),
              i: this.osCpu(),
              j: this.getLanguages(),
              k: window.screen.colorDepth,
              l: navigator.deviceMemory,
              m: window.screen.width + "x" + window.screen.height,
              c: [window.screen.availHeight, window.screen.availWidth],
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
              b2: this.webGL(),
            };
            obj["zz"] = this.x64hash128(JSON.stringify(obj), 31);
            /*
        const mini_print = {
          a: obj.a,
          d: obj.g,
          f: obj.ii,
          h: obj.b2,
        };
        obj["b1"] = this.x64hash128(JSON.stringify(mini_print), 31);
         */
            obj["b1"] = obj.jj[0].gpuHash + "&" + obj.jj[1].gpuHash;
            obj["a2"] = navigator.appCodeName;
            obj["a3"] = navigator.appName;
            obj["a4"] = navigator.appVersion;
            obj["a5"] = navigator.product; // 1, 1
            obj["a6"] = navigator.productSub; // 1, 2
            obj["a7"] = this.getNavigatorPrototype(); // 1, 4
            obj["a9"] = navigator.buildID;
            obj["kk"] = navigator.pdfViewerEnabled;
            obj["aa"] = navigator.cookieEnabled;
            obj["p"] = this.sessionStorage();
            obj["q"] = this.localStorage();
            obj["r"] = this.indexedDB();
            obj["s"] = Boolean(window.openDatabase);
            obj["ua"] = navigator.userAgent.split(" ").join("");
            obj["y"] = navigator.vendor;
            obj["z"] = navigator.vendorSub;
            audioData.vc = AudioData.fromObject({
              a: audioData.vc["ac-baseLatency"],
              b: audioData.vc["ac-channelCount"],
              c: audioData.vc["ac-channelCountMode"],
              d: audioData.vc["ac-channelInterpretation"],
              e: audioData.vc["ac-maxChannelCount"],
              f: audioData.vc["ac-numberOfInputs"],
              g: audioData.vc["ac-numberOfOutputs"],
              h: audioData.vc["ac-outputLatency"],
              i: audioData.vc["ac-sampleRate"],
              j: audioData.vc["ac-sinkId"],
              k: audioData.vc["ac-state"],
              l: audioData.vc["an-channelCount"],
              m: audioData.vc["an-channelCountMode"],
              n: audioData.vc["an-channelInterpretation"],
              o: audioData.vc["an-fftSize"],
              p: audioData.vc["an-frequencyBinCount"],
              q: audioData.vc["an-maxDecibels"],
              r: audioData.vc["an-minDecibels"],
              s: audioData.vc["an-numberOfInputs"],
              t: audioData.vc["an-numberOfOutputs"],
              u: audioData.vc["an-smoothingTimeConstant"],
            });
            const msg = Audio.fromObject(audioData);
            obj["g"] = msg;
          }
          const end = performance.now();
          var res = !str
            ? {
                tls: this.stored_id,
                dev: this.device,
                url: window.location.href,
                platform: {},
                private: this.prv,
                print: Print.fromObject(obj),
                clientTiming: end - start,
                local: obj.q,
              }
            : {
                tls: this.stored_id,
                dev: this.device,
                url: window.location.href,
                platform: {},
                private: this.prv,
                print: null,
                clientTiming: end - start,
                local: this.localStorage(),
                old: this.old,
                cookie: this.cookieStored,
              };
          if (this.options != undefined) {
            if (this.options.request_id != undefined) {
              res["id"] = params.request_id;
            }
            if (this.options.data != undefined) {
              res["tag"] = JSON.stringify(params.data);
            }
          }
          const message = Identification.fromObject(res);
          const buffer = Identification.encode(message).finish();
          const resp = await fetch(this.url + "/id", {
            method: "POST",
            body: buffer,
            headers: { Authorization: "Bearer " + this.loaded },
          });
          if (resp.status === 444) {
            if (this.tokenErrorCount > 2) {
              return new DeviceIDError({
                code: 201,
                type: "ID Error",
                val: "AUTH TOKEN PRESISTED AFTER MULTIPLE FAILURES",
              });
            } else this.tokenErrorCount++;
            localStorage.removeItem("c:GkK?_5eVdQdiQT0Fb?");
            this.setCookie("-BAL4_z*-wQ=6TYqCA!U", "", {
              secure: true,
              expires: 3600,
            });
            this.old = null;
            this.cookieStored = null;
            this.id(function (res) {
              return done(res, null);
            });
          } else if (resp.status !== 200)
            return done(
              null,
              new DeviceIDError({
                code: resp.status,
                val: resp.responseText,
                type: "ID Error",
              }),
            );
          const timing = performance.now() - end;
          const msg1 = Response.decode(
            new Uint8Array(await resp.arrayBuffer()),
          );
          const parsed = Response.toObject(msg1);

          if (parsed.j != null) {
            localStorage.setItem("c:GkK?_5eVdQdiQT0Fb?", parsed["j"]);
            this.setCookie("-BAL4_z*-wQ=6TYqCA!U", parsed["j"], {
              secure: true,
              expires: 3600,
            });
          }
          parsed.visit_id = parsed.a;
          parsed.device_id = parsed.b;
          parsed.device_found = parsed.c;
          parsed.threat_level = parsed.e;
          parsed.confidence = parsed.f;
          parsed.tempered = parsed.g;
          parsed.blocked = parsed.h;
          parsed.ip = parsed.i;
          delete parsed.j;
          delete parsed.a;
          delete parsed.b;
          delete parsed.c;
          delete parsed.e;
          delete parsed.f;
          delete parsed.g;
          delete parsed.h;
          delete parsed.i;
          parsed["private"] = this.prv;
          parsed["platform"] = this.uapRes;
          parsed["adblock"] = !str ? obj.c : false;
          parsed["dev"] = this.device;
          setTimeout(() => {
            const xhr1 = new XMLHttpRequest();
            xhr1.open("POST", this.url + "/updateTime");
            xhr1.setRequestHeader("Content-Type", "text/plain");
            xhr1.send(JSON.stringify({ timing, visit_id: parsed["visit_id"] }));
          }, 1);
          return done(parsed, null);
          //xhr.send(buffer);
        } catch (e) {
          return done(
            null,
            new DeviceIDError({ code: 20, val: e, type: "ID Error" }),
          );
        }
      },
      device: function () {
        this.uapRes = this.uap.getResult();
        var device = 0;
        const arch = this.uapRes.cpu.architecture;
        if (
          (this.uapRes.os != undefined &&
            this.uapRes.os != null &&
            this.uapRes.os.name == "macOS") ||
          this.uapRes.device.model == "Macintosh"
        ) {
          device = 1;
        } else if (
          this.uapRes.device != null &&
          this.uapRes.device != undefined &&
          this.uapRes.device.vendor == "Apple"
        ) {
          if (this.uapRes.os.name == "iOS") {
            device = 3;
          } else if (uap.os.name == "watchOS") {
            device = 2;
          } else {
            device = 1;
          }
        } else if (
          arch == "amd64" ||
          arch == "ia32" ||
          arch == "ia64" ||
          arch == "pa-risc" ||
          arch == "sparc" ||
          arch == "sparch64"
        ) {
          // Desktop
          device = 0;
        } else if (arch == "68k") {
          // mobile
          device = 6;
        } else if (arch == "arm64") {
          // ipad / iphone
          device = 3;
        } else if (arch == "ppc") {
          // mac
          device = 1;
        } else if (
          arch == "avr" ||
          arch == "armhf" ||
          arch == "irix" ||
          arch == "irix64" ||
          arch == "mips" ||
          arch == "mips64"
        ) {
          // something weird
          device = 7;
        } else {
          // cpu arch undefined
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
              if (type == "mobile") {
                device = 6;
              } else if (type == "tablet") {
                device = 5;
              } else if (type == "werable") {
                device = 2;
              } else if (
                this.uapRes.os != null &&
                this.uapRes.os != undefined
              ) {
                if (
                  this.uapRes.os == null ||
                  this.uapRes.os == undefined ||
                  this.uapRes.os.name == undefined
                ) {
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
      indexedDB: function () {
        try {
          return Boolean(window.indexedDB);
        } catch (e) {
          return true;
        }
      },
      localStorage: function () {
        try {
          return Boolean(window.localStorage);
        } catch (e) {
          return true;
        }
      },
      sessionStorage: function () {
        try {
          return Boolean(window.sessionStorage);
        } catch (e) {
          return true;
        }
      },
      getNavigatorPrototype: function () {
        try {
          var obj = window.navigator;
          var protoNavigator = [];
          do
            Object.getOwnPropertyNames(obj).forEach(function (name) {
              protoNavigator.push(name);
            });
          while ((obj = Object.getPrototypeOf(obj)));

          var res;
          var finalProto = [];
          protoNavigator.forEach(function (prop) {
            var objDesc = Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(navigator),
              prop,
            );
            if (objDesc != undefined) {
              if (objDesc.value != undefined) {
                res = objDesc.value.toString();
              } else if (objDesc.get != undefined) {
                res = objDesc.get.toString();
              }
            } else {
              res = "";
            }
            finalProto.push(prop + "~~~" + res);
          });
          return finalProto.join(";;;");
        } catch (e) {
          return "";
        }
      },
      webGL: function () {
        var canvas,
          ctx,
          width = 256,
          height = 128;
        canvas = document.createElement("canvas");
        (canvas.width = width),
          (canvas.height = height),
          (ctx =
            canvas.getContext("webgl2") ||
            canvas.getContext("experimental-webgl2") ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl") ||
            canvas.getContext("moz-webgl"));
        if (ctx == null || ctx == undefined) return "";
        try {
          var f =
            "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
          var g =
            "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
          var h = ctx.createBuffer();

          ctx.bindBuffer(ctx.ARRAY_BUFFER, h);

          var i = new Float32Array([
            -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.7321, 0,
          ]);

          ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW),
            (h.itemSize = 3),
            (h.numItems = 3);

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
          ctx.vertexAttribPointer(
            j.vertexPosAttrib,
            h.itemSize,
            ctx.FLOAT,
            !1,
            0,
            0,
          );
          ctx.uniform2f(j.offsetUniform, 1, 1);
          ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);
        } catch (e) {}

        var m = "";

        var n = new Uint8Array(width * height * 4);
        ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);

        // m = JSON.stringify(n).replace(/,?"[0-9]+":/g, "");
        m = JSON.stringify(n);
        // console.log(m);
        return this.x64hash128(m, 31);
      },
      arch: function () {
        const f = new Float32Array(1);
        const u = new Uint8Array(f.buffer);
        f[0] = Infinity / Infinity;
        return u[3];
      },
      webGLParameters: async function () {
        // Based on and inspired by https://github.com/CesiumGS/webglreport

        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
        const WebGLConstants = [
          "ALIASED_LINE_WIDTH_RANGE",
          "ALIASED_POINT_SIZE_RANGE",
          "ALPHA_BITS",
          "BLUE_BITS",
          "DEPTH_BITS",
          "GREEN_BITS",
          "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
          "MAX_CUBE_MAP_TEXTURE_SIZE",
          "MAX_FRAGMENT_UNIFORM_VECTORS",
          "MAX_RENDERBUFFER_SIZE",
          "MAX_TEXTURE_IMAGE_UNITS",
          "MAX_TEXTURE_SIZE",
          "MAX_VARYING_VECTORS",
          "MAX_VERTEX_ATTRIBS",
          "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
          "MAX_VERTEX_UNIFORM_VECTORS",
          "MAX_VIEWPORT_DIMS",
          "RED_BITS",
          "RENDERER",
          "SHADING_LANGUAGE_VERSION",
          "STENCIL_BITS",
          "VERSION",
        ];

        const WebGL2Constants = [
          "MAX_VARYING_COMPONENTS",
          "MAX_VERTEX_UNIFORM_COMPONENTS",
          "MAX_VERTEX_UNIFORM_BLOCKS",
          "MAX_VERTEX_OUTPUT_COMPONENTS",
          "MAX_PROGRAM_TEXEL_OFFSET",
          "MAX_3D_TEXTURE_SIZE",
          "MAX_ARRAY_TEXTURE_LAYERS",
          "MAX_COLOR_ATTACHMENTS",
          "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
          "MAX_COMBINED_UNIFORM_BLOCKS",
          "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
          "MAX_DRAW_BUFFERS",
          "MAX_ELEMENT_INDEX",
          "MAX_FRAGMENT_INPUT_COMPONENTS",
          "MAX_FRAGMENT_UNIFORM_COMPONENTS",
          "MAX_FRAGMENT_UNIFORM_BLOCKS",
          "MAX_SAMPLES",
          "MAX_SERVER_WAIT_TIMEOUT",
          "MAX_TEXTURE_LOD_BIAS",
          "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
          "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
          "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
          "MAX_UNIFORM_BLOCK_SIZE",
          "MAX_UNIFORM_BUFFER_BINDINGS",
          "MIN_PROGRAM_TEXEL_OFFSET",
          "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
        ];

        const Categories = {
          uniformBuffers: [
            "MAX_UNIFORM_BUFFER_BINDINGS",
            "MAX_UNIFORM_BLOCK_SIZE",
            "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
            "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
            "MAX_COMBINED_UNIFORM_BLOCKS",
            "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
          ],
          debugRendererInfo: [
            "UNMASKED_VENDOR_WEBGL",
            "UNMASKED_RENDERER_WEBGL",
          ],
          fragmentShader: [
            "MAX_FRAGMENT_UNIFORM_VECTORS",
            "MAX_TEXTURE_IMAGE_UNITS",
            "MAX_FRAGMENT_INPUT_COMPONENTS",
            "MAX_FRAGMENT_UNIFORM_COMPONENTS",
            "MAX_FRAGMENT_UNIFORM_BLOCKS",
            "FRAGMENT_SHADER_BEST_FLOAT_PRECISION",
            "MIN_PROGRAM_TEXEL_OFFSET",
            "MAX_PROGRAM_TEXEL_OFFSET",
          ],
          frameBuffer: [
            "MAX_DRAW_BUFFERS",
            "MAX_COLOR_ATTACHMENTS",
            "MAX_SAMPLES",
            "RGBA_BITS",
            "DEPTH_STENCIL_BITS",
            "MAX_RENDERBUFFER_SIZE",
            "MAX_VIEWPORT_DIMS",
          ],
          rasterizer: ["ALIASED_LINE_WIDTH_RANGE", "ALIASED_POINT_SIZE_RANGE"],
          textures: [
            "MAX_TEXTURE_SIZE",
            "MAX_CUBE_MAP_TEXTURE_SIZE",
            "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
            "MAX_TEXTURE_MAX_ANISOTROPY_EXT",
            "MAX_3D_TEXTURE_SIZE",
            "MAX_ARRAY_TEXTURE_LAYERS",
            "MAX_TEXTURE_LOD_BIAS",
          ],
          transformFeedback: [
            "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
            "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
            "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
          ],
          vertexShader: [
            "MAX_VARYING_VECTORS",
            "MAX_VERTEX_ATTRIBS",
            "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
            "MAX_VERTEX_UNIFORM_VECTORS",
            "MAX_VERTEX_UNIFORM_COMPONENTS",
            "MAX_VERTEX_UNIFORM_BLOCKS",
            "MAX_VERTEX_OUTPUT_COMPONENTS",
            "MAX_VARYING_COMPONENTS",
            "VERTEX_SHADER_BEST_FLOAT_PRECISION",
          ],
          webGLContextInfo: [
            "CONTEXT",
            "ANTIALIAS",
            "DIRECT_3D",
            "MAJOR_PERFORMANCE_CAVEAT",
            "RENDERER",
            "SHADING_LANGUAGE_VERSION",
            "VERSION",
          ],
        };

        /* parameter helpers */
        // https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic
        const getMaxAnisotropy = (context) => {
          try {
            const extension =
              context.getExtension("EXT_texture_filter_anisotropic") ||
              context.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
              context.getExtension("MOZ_EXT_texture_filter_anisotropic");
            return context.getParameter(
              extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT,
            );
          } catch (error) {
            console.error(error);
            return undefined;
          }
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
        const getMaxDrawBuffers = (context) => {
          try {
            const extension =
              context.getExtension("WEBGL_draw_buffers") ||
              context.getExtension("WEBKIT_WEBGL_draw_buffers") ||
              context.getExtension("MOZ_WEBGL_draw_buffers");
            return context.getParameter(extension.MAX_DRAW_BUFFERS_WEBGL);
          } catch (error) {
            return undefined;
          }
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat/precision
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat/rangeMax
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat/rangeMin
        const getShaderData = (shader) => {
          const shaderData = {};
          try {
            for (const prop in shader) {
              const shaderPrecisionFormat = shader[prop];
              shaderData[prop] = {
                precision: shaderPrecisionFormat.precision,
                rangeMax: shaderPrecisionFormat.rangeMax,
                rangeMin: shaderPrecisionFormat.rangeMin,
              };
            }
            return shaderData;
          } catch (error) {
            return undefined;
          }
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
        const getShaderPrecisionFormat = (context, shaderType) => {
          const props = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT"];
          const precisionFormat = {};
          try {
            props.forEach((prop) => {
              precisionFormat[prop] = context.getShaderPrecisionFormat(
                context[shaderType],
                context[prop],
              );
              return;
            });
            return precisionFormat;
          } catch (error) {
            return undefined;
          }
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
        const getUnmasked = (context, constant) => {
          try {
            const extension = context.getExtension("WEBGL_debug_renderer_info");
            const unmasked = context.getParameter(extension[constant]);
            return unmasked;
          } catch (error) {
            return undefined;
          }
        };

        // Takes the parameter object and generate a fingerprint of sorted numeric values
        function getNumericValues(parameters) {
          if (!parameters) return;
          return [
            ...new Set(
              Object.values(parameters)
                .filter((val) => val && typeof val != "string")
                .flat()
                .map((val) => Number(val) || 0),
            ),
          ].sort((a, b) => a - b);
        }

        // Highlight common GPU brands
        function getGpuBrand(gpu) {
          if (!gpu) return;
          const gpuBrandMatcher =
            /(adreno|amd|apple|intel|llvm|mali|microsoft|nvidia|parallels|powervr|samsung|swiftshader|virtualbox|vmware)/i;

          const brand = /radeon/i.test(gpu)
            ? "AMD"
            : /geforce/i.test(gpu)
              ? "NVIDIA"
              : (gpuBrandMatcher.exec(gpu) || [])[0] || "Other";

          return brand;
        }

        /* get WebGLRenderingContext or WebGL2RenderingContext */
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext
        function getWebGL(contextType) {
          const errors = [];
          let data = {};
          const isWebGL = /^(experimental-)?webgl$/;
          const isWebGL2 = /^(experimental-)?webgl2$/;
          const supportsWebGL =
            isWebGL.test(contextType) && "WebGLRenderingContext" in window;
          const supportsWebGL2 =
            isWebGL2.test(contextType) && "WebGLRenderingContext" in window;

          // detect support
          if (!supportsWebGL && !supportsWebGL2) {
            errors.push("not supported");
            return [data, errors];
          }

          // get canvas context
          let canvas;
          let context;
          let hasMajorPerformanceCaveat;
          try {
            canvas = document.createElement("canvas");
            context = canvas.getContext(contextType, {
              failIfMajorPerformanceCaveat: true,
            });
            if (!context) {
              hasMajorPerformanceCaveat = true;
              context = canvas.getContext(contextType);
              if (!context) {
                throw new Error(`context of type ${typeof context}`);
              }
            }
          } catch (err) {
            console.error(err);

            errors.push("context blocked");
            return [data, errors];
          }

          // get supported extensions
          // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getSupportedExtensions
          // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Using_Extensions
          let webGLExtensions;
          try {
            webGLExtensions = context.getSupportedExtensions();
          } catch (error) {
            console.error(error);
            errors.push("extensions blocked");
          }

          // get parameters
          let parameters;
          try {
            const VERTEX_SHADER = getShaderData(
              getShaderPrecisionFormat(context, "VERTEX_SHADER"),
            );
            const FRAGMENT_SHADER = getShaderData(
              getShaderPrecisionFormat(context, "FRAGMENT_SHADER"),
            );

            parameters = {
              ANTIALIAS: context.getContextAttributes().antialias,
              CONTEXT: contextType,
              MAJOR_PERFORMANCE_CAVEAT: hasMajorPerformanceCaveat,
              MAX_TEXTURE_MAX_ANISOTROPY_EXT: getMaxAnisotropy(context),
              MAX_DRAW_BUFFERS_WEBGL: getMaxDrawBuffers(context),
              VERTEX_SHADER,
              VERTEX_SHADER_BEST_FLOAT_PRECISION: Object.values(
                VERTEX_SHADER.HIGH_FLOAT,
              ),
              FRAGMENT_SHADER,
              FRAGMENT_SHADER_BEST_FLOAT_PRECISION: Object.values(
                FRAGMENT_SHADER.HIGH_FLOAT,
              ),
              UNMASKED_VENDOR_WEBGL: getUnmasked(
                context,
                "UNMASKED_VENDOR_WEBGL",
              ),
              UNMASKED_RENDERER_WEBGL: getUnmasked(
                context,
                "UNMASKED_RENDERER_WEBGL",
              ),
            };

            const glConstants = [
              ...WebGLConstants,
              ...(supportsWebGL2 ? WebGL2Constants : []),
            ];
            glConstants.forEach((key) => {
              const result = context.getParameter(context[key]);
              const typedArray =
                result &&
                (result.constructor === Float32Array ||
                  result.constructor === Int32Array);
              parameters[key] = typedArray ? [...result] : result;
            });

            parameters.RGBA_BITS = [
              parameters.RED_BITS,
              parameters.GREEN_BITS,
              parameters.BLUE_BITS,
              parameters.ALPHA_BITS,
            ];

            parameters.DEPTH_STENCIL_BITS = [
              parameters.DEPTH_BITS,
              parameters.STENCIL_BITS,
            ];

            parameters.DIRECT_3D = /Direct3D|D3D(\d+)/.test(
              parameters.UNMASKED_RENDERER_WEBGL,
            );
          } catch (error) {
            console.error(error);
            errors.push("parameters blocked");
          }
          const gpu = String([
            parameters.UNMASKED_VENDOR_WEBGL,
            parameters.UNMASKED_RENDERER_WEBGL,
          ]);
          const gpuBrand = getGpuBrand(gpu);

          // Structure parameter data
          let components = {};
          if (parameters) {
            Object.keys(Categories).forEach((name) => {
              const componentData = Categories[name].reduce((acc, key) => {
                if (parameters[key] !== undefined) {
                  acc[key] = parameters[key];
                }
                return acc;
              }, {});

              // Only compile if the data exists
              if (Object.keys(componentData).length) {
                components[name] = componentData;
              }
            });
          }

          data = {
            gpuHash: !parameters
              ? undefined
              : [gpuBrand, ...getNumericValues(parameters)].join(":"),
            gpu,
            gpuBrand,
            ...components,
            webGLExtensions,
          };

          return [data, errors];
        }

        const value = await Promise.all([
          getWebGL("webgl"),
          getWebGL("webgl2"),
          getWebGL("experimental-webgl"),
        ])
          .then((response) => {
            const [webGL, webGL2, experimentalWebGL] = response;

            // Extract both data and errors
            const [webGLData, webGLErrors] = webGL;
            const [webGL2Data, webGL2Errors] = webGL2;
            const [experimentalWebGLData, experimentalWebGLErrors] =
              experimentalWebGL;

            // Show the data
            /*
      console.log('WebGLRenderingContext: ', webGLData)
      console.log('WebGL2RenderingContext: ', webGL2Data)
      console.log('Experimental: ', experimentalWebGLData)
      */
            // return(XXH64(JSON.stringify([webGLData, webGL2Data, experimentalWebGLData]), 0xA3FC ).toString(16));
            webGLData.fragmentShader = FragmentShader.fromObject({
              a: webGLData.fragmentShader.FRAGMENT_SHADER_BEST_FLOAT_PRECISION,
              b: webGLData.fragmentShader.MAX_FRAGMENT_UNIFORM_VECTORS,
              c: webGLData.fragmentShader.MAX_TEXTURE_IMAGE_UNITS,
            });
            webGLData.frameBuffer = FrameBuffer.fromObject({
              a: webGLData.frameBuffer.DEPTH_STENCIL_BITS,
              b: webGLData.frameBuffer.MAX_RENDERBUFFER_SIZE,
              c: webGLData.frameBuffer.MAX_VIEWPORT_DIMS,
              d: webGLData.frameBuffer.RGBA_BITS,
            });
            webGLData.rasterizer = Rasterizer.fromObject({
              a: webGLData.rasterizer.ALIASED_LINE_WIDTH_RANGE,
              b: webGLData.rasterizer.ALIASED_POINT_SIZE_RANGE,
            });
            webGLData.vertexShader = VertexShader.fromObject({
              a: webGLData.vertexShader.MAX_VARYING_VECTORS,
              b: webGLData.vertexShader.MAX_VERTEX_ATTRIBS,
              c: webGLData.vertexShader.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
              d: webGLData.vertexShader.MAX_VERTEX_UNIFORM_VECTORS,
              e: webGLData.vertexShader.VERTEX_SHADER_BEST_FLOAT_PRECISION,
            });
            webGLData.webGLContextInfo = WebGLContextInfo.fromObject({
              a: webGLData.webGLContextInfo.ANTIALIAS,
              b: webGLData.webGLContextInfo.CONTEXT,
              c: webGLData.webGLContextInfo.DIRECT_3D,
              d: webGLData.webGLContextInfo.RENDERER,
              e: webGLData.webGLContextInfo.SHADING_LANGUAGE_VERSION,
              f: webGLData.webGLContextInfo.VERSION,
            });
            const msg = WebGLData.fromObject(webGLData);
            webGL2Data.fragmentShader = FragmentShader.fromObject({
              a: webGL2Data.fragmentShader.FRAGMENT_SHADER_BEST_FLOAT_PRECISION,
              b: webGL2Data.fragmentShader.MAX_FRAGMENT_UNIFORM_VECTORS,
              c: webGL2Data.fragmentShader.MAX_TEXTURE_IMAGE_UNITS,
              d: webGL2Data.fragmentShader.MAX_FRAGMENT_INPUT_COMPONENTS,
              e: webGL2Data.fragmentShader.MAX_FRAGMENT_UNIFORM_BLOCKS,
              f: webGL2Data.fragmentShader.MAX_FRAGMENT_UNIFORM_COMPONENTS,
              g: webGL2Data.fragmentShader.MAX_PROGRAM_TEXEL_OFFSET,
              h: webGL2Data.fragmentShader.MIN_PROGRAM_TEXEL_OFFSET,
            });
            webGL2Data.frameBuffer = FrameBuffer.fromObject({
              a: webGL2Data.frameBuffer.DEPTH_STENCIL_BITS,
              b: webGL2Data.frameBuffer.MAX_RENDERBUFFER_SIZE,
              c: webGL2Data.frameBuffer.MAX_VIEWPORT_DIMS,
              d: webGL2Data.frameBuffer.RGBA_BITS,
              e: webGL2Data.frameBuffer.MAX_COLOR_ATTACHMENTS,
              f: webGL2Data.frameBuffer.MAX_DRAW_BUFFERS,
              g: webGL2Data.frameBuffer.MAX_SAMPLES,
            });
            webGL2Data.rasterizer = Rasterizer.fromObject({
              a: webGL2Data.rasterizer.ALIASED_LINE_WIDTH_RANGE,
              b: webGL2Data.rasterizer.ALIASED_POINT_SIZE_RANGE,
            });
            webGL2Data.vertexShader = VertexShader.fromObject({
              a: webGL2Data.vertexShader.MAX_VARYING_VECTORS,
              b: webGL2Data.vertexShader.MAX_VERTEX_ATTRIBS,
              c: webGL2Data.vertexShader.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
              d: webGL2Data.vertexShader.MAX_VERTEX_UNIFORM_VECTORS,
              e: webGL2Data.vertexShader.VERTEX_SHADER_BEST_FLOAT_PRECISION,
              f: webGL2Data.vertexShader.MAX_VARYING_COMPONENTS,
              g: webGL2Data.vertexShader.MAX_VERTEX_OUTPUT_COMPONENTS,
              h: webGL2Data.vertexShader.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
              i: webGL2Data.vertexShader.MAX_VERTEX_UNIFORM_BLOCKS,
              j: webGL2Data.vertexShader.MAX_VERTEX_UNIFORM_COMPONENTS,
            });
            webGL2Data.webGLContextInfo = WebGLContextInfo.fromObject({
              a: webGL2Data.webGLContextInfo.ANTIALIAS,
              b: webGL2Data.webGLContextInfo.CONTEXT,
              c: webGL2Data.webGLContextInfo.DIRECT_3D,
              d: webGL2Data.webGLContextInfo.RENDERER,
              e: webGL2Data.webGLContextInfo.SHADING_LANGUAGE_VERSION,
              f: webGL2Data.webGLContextInfo.VERSION,
            });
            const msg2 = WebGLData.fromObject(webGL2Data);
            experimentalWebGLData.fragmentShader = FragmentShader.fromObject({
              a: experimentalWebGLData.fragmentShader
                .FRAGMENT_SHADER_BEST_FLOAT_PRECISION,
              b: experimentalWebGLData.fragmentShader
                .MAX_FRAGMENT_UNIFORM_VECTORS,
              c: experimentalWebGLData.fragmentShader.MAX_TEXTURE_IMAGE_UNITS,
            });
            experimentalWebGLData.frameBuffer = FrameBuffer.fromObject({
              a: experimentalWebGLData.frameBuffer.DEPTH_STENCIL_BITS,
              b: experimentalWebGLData.frameBuffer.MAX_RENDERBUFFER_SIZE,
              c: experimentalWebGLData.frameBuffer.MAX_VIEWPORT_DIMS,
              d: experimentalWebGLData.frameBuffer.RGBA_BITS,
            });
            experimentalWebGLData.rasterizer = Rasterizer.fromObject({
              a: experimentalWebGLData.rasterizer.ALIASED_LINE_WIDTH_RANGE,
              b: experimentalWebGLData.rasterizer.ALIASED_POINT_SIZE_RANGE,
            });
            experimentalWebGLData.vertexShader = VertexShader.fromObject({
              a: experimentalWebGLData.vertexShader.MAX_VARYING_VECTORS,
              b: experimentalWebGLData.vertexShader.MAX_VERTEX_ATTRIBS,
              c: experimentalWebGLData.vertexShader
                .MAX_VERTEX_TEXTURE_IMAGE_UNITS,
              d: experimentalWebGLData.vertexShader.MAX_VERTEX_UNIFORM_VECTORS,
              e: experimentalWebGLData.vertexShader
                .VERTEX_SHADER_BEST_FLOAT_PRECISION,
            });
            experimentalWebGLData.webGLContextInfo =
              WebGLContextInfo.fromObject({
                a: experimentalWebGLData.webGLContextInfo.ANTIALIAS,
                b: experimentalWebGLData.webGLContextInfo.CONTEXT,
                c: experimentalWebGLData.webGLContextInfo.DIRECT_3D,
                d: experimentalWebGLData.webGLContextInfo.RENDERER,
                e: experimentalWebGLData.webGLContextInfo
                  .SHADING_LANGUAGE_VERSION,
                f: experimentalWebGLData.webGLContextInfo.VERSION,
              });
            const msg3 = WebGLData.fromObject(experimentalWebGLData);
            return [msg, msg2, msg3];
            /*
      webGLParma.push(XXH64(JSON.stringify(webGLData), 0xA3FC ).toString(16));
      webGLParma.push(XXH64(JSON.stringify(webGL2Data), 0xA3FC ).toString(16));
      webGLParma.push(XXH64(JSON.stringify(experimentalWebGLData), 0xA3FC ).toString(16));
      */
          })
          .catch((error) => {
            console.error(error);
          });
        return value;
      },
      getMathsConstants: function () {
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
          acosh(1e300) == "Infinity" ? 0 : acosh(1e300),
          atanh(0.5),
          expm1(1),
          cbrt(100),
          log1p(10),
          sinh(1),
          cosh(10),
          tanh(1),
        ];
      },
      hdr: function () {
        if (this.matchProp("high", "dynamic-range")) {
          return true;
        } else if (this.matchProp("standard", "dynamic-range")) {
          return true;
        } else return "";
      },
      contrast: function () {
        const keywords = ["no-preference", "more", "less", "forced"];
        for (const keyword of keywords) {
          if (this.matchProp(keyword, "prefers-contrast")) {
            return keyword;
          }
        }
        return "";
      },
      monochrome: function () {
        var min = 0;
        var max = 255;
        while (min <= max) {
          const mid = Math.floor((min + max) / 2);
          if (this.matchProp(mid, "max-monochrome")) {
            return mid;
          } else if (this.matchProp(mid + 1, "max-monochrome")) {
            return mid + 1;
          } else {
            min = mid + 1;
          }
        }
        return "";
      },
      forcedColors: function () {
        if (this.matchProp("active", "forced-colors")) {
          return true;
        } else if (this.matchProp("none", "forced-colors")) {
          return false;
        } else return undefined;
      },
      invertedColors: function () {
        if (this.matchProp("inverted", "inverted-colors")) {
          return 2;
        } else if (this.matchProp("inverted", "none")) {
          return 1;
        } else {
          return 0;
        }
      },

      reducedMotion: function () {
        if (this.matchProp("reduce", "prefers-reduced-motion")) {
          return 2;
        } else if (this.matchProp("no-prederence", "prefers-reduced-motion")) {
          return 1;
        } else {
          return 0;
        }
      },

      reducedTransparency: function () {
        if (this.matchProp("reduce", "prefers-reduced-transparency")) {
          return 2;
        } else if (
          this.matchProp("no-prederence", "prefers-reduced-transparency")
        ) {
          return 1;
        } else {
          return 0;
        }
      },
      matchProp: function (value, media) {
        return matchMedia(`(${media}: `.concat(value, ")")).matches;
      },
      colorGamut: function () {
        const gamuts = ["rec2020", "p3", "srgb"];
        return gamuts.some((gamut) => this.matchProp(gamut, "color-gamut"))
          ? gamuts[0]
          : "";
      },
      getTouchSupport: function () {
        var maxTouchPoints = 0;
        var touchEvent = false;
        if (typeof navigator.maxTouchPoints !== "undefined") {
          maxTouchPoints = navigator.maxTouchPoints;
        } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
          maxTouchPoints = navigator.msMaxTouchPoints;
        }
        try {
          document.createEvent("TouchEvent");
          touchEvent = true;
        } catch (_) {
          /* squelch */
        }
        var touchStart = "ontouchstart" in window;
        return [maxTouchPoints, touchEvent, touchStart].join(";");
      },
      createCanvas: function () {
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
          canvasContext.fillText(
            "Cwm fjordbank glyphs vext quiz, \ud83d\ude03",
            2,
            15,
          );
          canvasContext.fillStyle = "rgba(102, 204, 0, 0.7)";
          canvasContext.font = "18pt Arial";
          canvasContext.fillText(
            "Cwm fjordbank glyphs vext quiz, \ud83d\ude03",
            4,
            45,
          );
          return canvas.toDataURL();
        } catch (e) {
          return "";
        }
      },
      getCanvas: function () {
        const cnv = this.createCanvas();
        if (cnv == "") return "";
        const cnv1 = this.createCanvas();
        if (cnv1 != cnv) {
          return "";
        } else {
          return this.x64hash128(cnv, 31);
        }
      },
      getMimeTypes: function () {
        var mimeTypes = "";
        for (var i = 0; i < navigator.mimeTypes.length; i++) {
          var mt = navigator.mimeTypes[i];
          mimeTypes += mt.description + "," + mt.type + "," + mt.suffixes + "&";
        }
        return mimeTypes;
      },
      getNavigatorCpuClass: function () {
        if (navigator.cpuClass) {
          return navigator.cpuClass;
        }
        return "";
      },
      getHardwareConcurrency: function () {
        if (navigator.hardwareConcurrency) {
          return navigator.hardwareConcurrency;
        }
        return "";
      },
      getLanguages: function () {
        if (navigator.languages) {
          return navigator.languages.join("~~");
        }
        return "";
      },
      osCpu: function () {
        if (navigator.oscpu) {
          return navigator.oscpu;
        }
        return "";
      },
      getAudio: async function (old_context) {
        var audioData = {};

        if ((window.AudioContext || window.webkitAudioContext) === undefined) {
          audioData = "Not supported";
        } else {
          // Performs fingerprint as found in https://client.a.pxi.pub/PXmssU3ZQ0/main.min.js
          //Sum of buffer values
          const run_pxi_fp = new Promise((resolve) => {
            try {
              const context = new (window.OfflineAudioContext ||
                window.webkitOfflineAudioContext)(1, 44100, 44100);
              audioData.pxi = 0;

              // Create oscillator
              const pxi_oscillator = context.createOscillator();
              pxi_oscillator.type = "triangle";
              pxi_oscillator.frequency.value = 1e4;

              // Create and configure compressor
              const pxi_compressor = context.createDynamicsCompressor();
              pxi_compressor.threshold &&
                (pxi_compressor.threshold.value = -50);
              pxi_compressor.knee && (pxi_compressor.knee.value = 40);
              pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
              pxi_compressor.reduction &&
                (pxi_compressor.reduction.value = -20);
              pxi_compressor.attack && (pxi_compressor.attack.value = 0);
              pxi_compressor.release && (pxi_compressor.release.value = 0.25);

              // Connect nodes
              pxi_oscillator.connect(pxi_compressor);
              pxi_compressor.connect(context.destination);

              // Start audio processing
              pxi_oscillator.start(0);
              context.startRendering();
              context.oncomplete = function (evnt) {
                audioData.pxi = 0;
                var dt = "";
                for (var i = 0; i < evnt.renderedBuffer.length; i++) {
                  dt += evnt.renderedBuffer.getChannelData(0)[i].toString();
                }
                var count = 0;
                for (var i = 4500; 5e3 > i; i++) {
                  count += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
                }
                resolve({
                  pxiOutput: count,
                  pxiFullBufferHash: old_context.x64hash128(dt, 31),
                });
                pxi_compressor.disconnect();
              };
            } catch (u) {
              resolve(0);
            }
          });

          // End PXI fingerprint

          // Performs fingerprint as found in some versions of http://metrics.nt.vc/metrics.js
          function a(a, b, c) {
            for (var d in b)
              "dopplerFactor" === d ||
                "speedOfSound" === d ||
                "currentTime" === d ||
                ("number" !== typeof b[d] && "string" !== typeof b[d]) ||
                (a[(c ? c : "") + d] = b[d]);
            return a;
          }

          function run_nt_vc_fp() {
            try {
              var nt_vc_context =
                window.AudioContext || window.webkitAudioContext;
              if ("function" !== typeof nt_vc_context)
                audioData.vc = "Not available";
              else {
                var f = new nt_vc_context(),
                  d = f.createAnalyser();
                audioData.vc = a({}, f, "ac-");
                audioData.vc = a(audioData.vc, f.destination, "ac-");
                audioData.vc = a(audioData.vc, f.listener, "ac-");
                audioData.vc = a(audioData.vc, d, "an-");
              }
            } catch (g) {
              audioData.vc = 0;
            }
          }

          // Performs fingerprint as found in https://www.cdn-net.com/cc.js
          var cc_output = [];

          const run_cc_fp = new Promise((resolve) => {
            var audioCtx = new (window.AudioContext ||
                window.webkitAudioContext)(),
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
              resolve(cc_output.slice(0, 30));
              //audioData.cc_output = cc_output.slice(0, 30);
            };

            oscillator.start(0);
          });

          // Performs a hybrid of cc/pxi methods found above
          var hybrid_output = [];

          const run_hybrid_fp = new Promise((resolve) => {
            var audioCtx = new (window.AudioContext ||
                window.webkitAudioContext)(),
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
            compressor.release && (compressor.release.value = 0.25);

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
              resolve(hybrid_output.slice(0, 30));
              analyser.disconnect();
              scriptProcessor.disconnect();
              gain.disconnect();
              //audioData.hybrid_output = hybrid_output.slice(0, 30);
            };
            oscillator.start(0);
          });
          run_nt_vc_fp();
          await run_pxi_fp.then((val) => {
            audioData.pxi = val.pxiOutput;
            audioData.hash = val.pxiFullBufferHash;
          });
          /*
          await run_cc_fp.then((val) => {
            console.log(val);
            audioData.cc = val;
          });

          await run_hybrid_fp.then((val) => {
            console.log(val);
            audioData.fp = val;
          }); */
          return audioData;
        }
      },
      blending: function () {
        const blendingModes = ["screen", "multiply", "lighter"];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        for (const mode of blendingModes) {
          try {
            ctx.globalCompositeOperation = mode;
          } catch (error) {
            return false;
          }
        }
        return true;
      },
      makeid: function (length) {
        let result = "";
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
          );
          counter += 1;
        }
        return result;
      },
      getCookie: function (cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return null;
      },

      setCookie: function (name, value, options = {}) {
        options = {
          path: "/",
          // add other defaults here if necessary
          ...options,
        };

        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }

        let updatedCookie =
          encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
          updatedCookie += "; " + optionKey;
          let optionValue = options[optionKey];
          if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
          }
        }

        document.cookie = updatedCookie;
      },
      cryptoSupport: function () {
        if (!("crypto" in window)) {
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
          subtle: typeof crypto.subtle === "object",
          random: typeof crypto.getRandomValues === "function",
        };
      },
      fonts: function (keys, done) {
        var baseFonts = ["monospace", "sans-serif", "serif"];

        var fontList = [
          "Andale Mono",
          "Arial",
          "Arial Black",
          "Arial Hebrew",
          "Arial MT",
          "Arial Narrow",
          "Arial Rounded MT Bold",
          "Arial Unicode MS",
          "Bitstream Vera Sans Mono",
          "Book Antiqua",
          "Bookman Old Style",
          "Calibri",
          "Cambria",
          "Cambria Math",
          "Century",
          "Century Gothic",
          "Century Schoolbook",
          "Comic Sans",
          "Comic Sans MS",
          "Consolas",
          "Courier",
          "Courier New",
          "Garamond",
          "Geneva",
          "Georgia",
          "Helvetica",
          "Helvetica Neue",
          "Impact",
          "Lucida Bright",
          "Lucida Calligraphy",
          "Lucida Console",
          "Lucida Fax",
          "LUCIDA GRANDE",
          "Lucida Handwriting",
          "Lucida Sans",
          "Lucida Sans Typewriter",
          "Lucida Sans Unicode",
          "Microsoft Sans Serif",
          "Monaco",
          "Monotype Corsiva",
          "MS Gothic",
          "MS Outlook",
          "MS PGothic",
          "MS Reference Sans Serif",
          "MS Sans Serif",
          "MS Serif",
          "MYRIAD",
          "MYRIAD PRO",
          "Palatino",
          "Palatino Linotype",
          "Segoe Print",
          "Segoe Script",
          "Segoe UI",
          "Segoe UI Light",
          "Segoe UI Semibold",
          "Segoe UI Symbol",
          "Tahoma",
          "Times",
          "Times New Roman",
          "Times New Roman PS",
          "Trebuchet MS",
          "Verdana",
          "Wingdings",
          "Wingdings 2",
          "Wingdings 3",
          "Abadi MT Condensed Light",
          "Academy Engraved LET",
          "ADOBE CASLON PRO",
          "Adobe Garamond",
          "ADOBE GARAMOND PRO",
          "Agency FB",
          "Aharoni",
          "Albertus Extra Bold",
          "Albertus Medium",
          "Algerian",
          "Amazone BT",
          "American Typewriter",
          "American Typewriter Condensed",
          "AmerType Md BT",
          "Andalus",
          "Angsana New",
          "AngsanaUPC",
          "Antique Olive",
          "Aparajita",
          "Apple Chancery",
          "Apple Color Emoji",
          "Apple SD Gothic Neo",
          "Arabic Typesetting",
          "ARCHER",
          "ARNO PRO",
          "Arrus BT",
          "Aurora Cn BT",
          "AvantGarde Bk BT",
          "AvantGarde Md BT",
          "AVENIR",
          "Ayuthaya",
          "Bandy",
          "Bangla Sangam MN",
          "Bank Gothic",
          "BankGothic Md BT",
          "Baskerville",
          "Baskerville Old Face",
          "Batang",
          "BatangChe",
          "Bauer Bodoni",
          "Bauhaus 93",
          "Bazooka",
          "Bell MT",
          "Bembo",
          "Benguiat Bk BT",
          "Berlin Sans FB",
          "Berlin Sans FB Demi",
          "Bernard MT Condensed",
          "BernhardFashion BT",
          "BernhardMod BT",
          "Big Caslon",
          "BinnerD",
          "Blackadder ITC",
          "BlairMdITC TT",
          "Bodoni 72",
          "Bodoni 72 Oldstyle",
          "Bodoni 72 Smallcaps",
          "Bodoni MT",
          "Bodoni MT Black",
          "Bodoni MT Condensed",
          "Bodoni MT Poster Compressed",
          "Bookshelf Symbol 7",
          "Boulder",
          "Bradley Hand",
          "Bradley Hand ITC",
          "Bremen Bd BT",
          "Britannic Bold",
          "Broadway",
          "Browallia New",
          "BrowalliaUPC",
          "Brush Script MT",
          "Californian FB",
          "Calisto MT",
          "Calligrapher",
          "Candara",
          "CaslonOpnface BT",
          "Castellar",
          "Centaur",
          "Cezanne",
          "CG Omega",
          "CG Times",
          "Chalkboard",
          "Chalkboard SE",
          "Chalkduster",
          "Charlesworth",
          "Charter Bd BT",
          "Charter BT",
          "Chaucer",
          "ChelthmITC Bk BT",
          "Chiller",
          "Clarendon",
          "Clarendon Condensed",
          "CloisterBlack BT",
          "Cochin",
          "Colonna MT",
          "Constantia",
          "Cooper Black",
          "Copperplate",
          "Copperplate Gothic",
          "Copperplate Gothic Bold",
          "Copperplate Gothic Light",
          "CopperplGoth Bd BT",
          "Corbel",
          "Cordia New",
          "CordiaUPC",
          "Cornerstone",
          "Coronet",
          "Cuckoo",
          "Curlz MT",
          "DaunPenh",
          "Dauphin",
          "David",
          "DB LCD Temp",
          "DELICIOUS",
          "Denmark",
          "DFKai-SB",
          "Didot",
          "DilleniaUPC",
          "DIN",
          "DokChampa",
          "Dotum",
          "DotumChe",
          "Ebrima",
          "Edwardian Script ITC",
          "Elephant",
          "English 111 Vivace BT",
          "Engravers MT",
          "EngraversGothic BT",
          "Eras Bold ITC",
          "Eras Demi ITC",
          "Eras Light ITC",
          "Eras Medium ITC",
          "EucrosiaUPC",
          "Euphemia",
          "Euphemia UCAS",
          "EUROSTILE",
          "Exotc350 Bd BT",
          "FangSong",
          "Felix Titling",
          "Fixedsys",
          "FONTIN",
          "Footlight MT Light",
          "Forte",
          "FrankRuehl",
          "Fransiscan",
          "Freefrm721 Blk BT",
          "FreesiaUPC",
          "Freestyle Script",
          "French Script MT",
          "FrnkGothITC Bk BT",
          "Fruitger",
          "FRUTIGER",
          "Futura",
          "Futura Bk BT",
          "Futura Lt BT",
          "Futura Md BT",
          "Futura ZBlk BT",
          "FuturaBlack BT",
          "Gabriola",
          "Galliard BT",
          "Gautami",
          "Geeza Pro",
          "Geometr231 BT",
          "Geometr231 Hv BT",
          "Geometr231 Lt BT",
          "GeoSlab 703 Lt BT",
          "GeoSlab 703 XBd BT",
          "Gigi",
          "Gill Sans",
          "Gill Sans MT",
          "Gill Sans MT Condensed",
          "Gill Sans MT Ext Condensed Bold",
          "Gill Sans Ultra Bold",
          "Gill Sans Ultra Bold Condensed",
          "Gisha",
          "Gloucester MT Extra Condensed",
          "GOTHAM",
          "GOTHAM BOLD",
          "Goudy Old Style",
          "Goudy Stout",
          "GoudyHandtooled BT",
          "GoudyOLSt BT",
          "Gujarati Sangam MN",
          "Gulim",
          "GulimChe",
          "Gungsuh",
          "GungsuhChe",
          "Gurmukhi MN",
          "Haettenschweiler",
          "Harlow Solid Italic",
          "Harrington",
          "Heather",
          "Heiti SC",
          "Heiti TC",
          "HELV",
          "Herald",
          "High Tower Text",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Mincho ProN",
          "Hoefler Text",
          "Humanst 521 Cn BT",
          "Humanst521 BT",
          "Humanst521 Lt BT",
          "Imprint MT Shadow",
          "Incised901 Bd BT",
          "Incised901 BT",
          "Incised901 Lt BT",
          "INCONSOLATA",
          "Informal Roman",
          "Informal011 BT",
          "INTERSTATE",
          "IrisUPC",
          "Iskoola Pota",
          "JasmineUPC",
          "Jazz LET",
          "Jenson",
          "Jester",
          "Jokerman",
          "Juice ITC",
          "Kabel Bk BT",
          "Kabel Ult BT",
          "Kailasa",
          "KaiTi",
          "Kalinga",
          "Kannada Sangam MN",
          "Kartika",
          "Kaufmann Bd BT",
          "Kaufmann BT",
          "Khmer UI",
          "KodchiangUPC",
          "Kokila",
          "Korinna BT",
          "Kristen ITC",
          "Krungthep",
          "Kunstler Script",
          "Lao UI",
          "Latha",
          "Leelawadee",
          "Letter Gothic",
          "Levenim MT",
          "LilyUPC",
          "Lithograph",
          "Lithograph Light",
          "Long Island",
          "Lydian BT",
          "Magneto",
          "Maiandra GD",
          "Malayalam Sangam MN",
          "Malgun Gothic",
          "Mangal",
          "Marigold",
          "Marion",
          "Marker Felt",
          "Market",
          "Marlett",
          "Matisse ITC",
          "Matura MT Script Capitals",
          "Meiryo",
          "Meiryo UI",
          "Microsoft Himalaya",
          "Microsoft JhengHei",
          "Microsoft New Tai Lue",
          "Microsoft PhagsPa",
          "Microsoft Tai Le",
          "Microsoft Uighur",
          "Microsoft YaHei",
          "Microsoft Yi Baiti",
          "MingLiU",
          "MingLiU_HKSCS",
          "MingLiU_HKSCS-ExtB",
          "MingLiU-ExtB",
          "Minion",
          "Minion Pro",
          "Miriam",
          "Miriam Fixed",
          "Mistral",
          "Modern",
          "Modern No. 20",
          "Mona Lisa Solid ITC TT",
          "Mongolian Baiti",
          "MONO",
          "MoolBoran",
          "Mrs Eaves",
          "MS LineDraw",
          "MS Mincho",
          "MS PMincho",
          "MS Reference Specialty",
          "MS UI Gothic",
          "MT Extra",
          "MUSEO",
          "MV Boli",
          "Nadeem",
          "Narkisim",
          "NEVIS",
          "News Gothic",
          "News GothicMT",
          "NewsGoth BT",
          "Niagara Engraved",
          "Niagara Solid",
          "Noteworthy",
          "NSimSun",
          "Nyala",
          "OCR A Extended",
          "Old Century",
          "Old English Text MT",
          "Onyx",
          "Onyx BT",
          "OPTIMA",
          "Oriya Sangam MN",
          "OSAKA",
          "OzHandicraft BT",
          "Palace Script MT",
          "Papyrus",
          "Parchment",
          "Party LET",
          "Pegasus",
          "Perpetua",
          "Perpetua Titling MT",
          "PetitaBold",
          "Pickwick",
          "Plantagenet Cherokee",
          "Playbill",
          "PMingLiU",
          "PMingLiU-ExtB",
          "Poor Richard",
          "Poster",
          "PosterBodoni BT",
          "PRINCETOWN LET",
          "Pristina",
          "PTBarnum BT",
          "Pythagoras",
          "Raavi",
          "Rage Italic",
          "Ravie",
          "Ribbon131 Bd BT",
          "Rockwell",
          "Rockwell Condensed",
          "Rockwell Extra Bold",
          "Rod",
          "Roman",
          "Sakkal Majalla",
          "Santa Fe LET",
          "Savoye LET",
          "Sceptre",
          "Script",
          "Script MT Bold",
          "SCRIPTINA",
          "Serifa",
          "Serifa BT",
          "Serifa Th BT",
          "ShelleyVolante BT",
          "Sherwood",
          "Shonar Bangla",
          "Showcard Gothic",
          "Shruti",
          "Signboard",
          "SILKSCREEN",
          "SimHei",
          "Simplified Arabic",
          "Simplified Arabic Fixed",
          "SimSun",
          "SimSun-ExtB",
          "Sinhala Sangam MN",
          "Sketch Rockwell",
          "Skia",
          "Small Fonts",
          "Snap ITC",
          "Snell Roundhand",
          "Socket",
          "Souvenir Lt BT",
          "Staccato222 BT",
          "Steamer",
          "Stencil",
          "Storybook",
          "Styllo",
          "Subway",
          "Swis721 BlkEx BT",
          "Swiss911 XCm BT",
          "Sylfaen",
          "Synchro LET",
          "System",
          "Tamil Sangam MN",
          "Technical",
          "Teletype",
          "Telugu Sangam MN",
          "Tempus Sans ITC",
          "Terminal",
          "Thonburi",
          "Traditional Arabic",
          "Trajan",
          "TRAJAN PRO",
          "Tristan",
          "Tubular",
          "Tunga",
          "Tw Cen MT",
          "Tw Cen MT Condensed",
          "Tw Cen MT Condensed Extra Bold",
          "TypoUpright BT",
          "Unicorn",
          "Univers",
          "Univers CE 55 Medium",
          "Univers Condensed",
          "Utsaah",
          "Vagabond",
          "Vani",
          "Vijaya",
          "Viner Hand ITC",
          "VisualUI",
          "Vivaldi",
          "Vladimir Script",
          "Vrinda",
          "Westminster",
          "WHITNEY",
          "Wide Latin",
          "ZapfEllipt BT",
          "ZapfHumnst BT",
          "ZapfHumnst Dm BT",
          "Zapfino",
          "Zurich BlkEx BT",
          "Zurich Ex BT",
          "ZWAdobeF",
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
        var createSpan = function () {
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
        var createSpanWithFonts = function (fontToDetect, baseFont) {
          var s = createSpan();
          s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
          return s;
        };

        // creates spans for the base fonts and adds them to baseFontsDiv
        var initializeBaseFontsSpans = function () {
          var spans = [];
          for (
            var index = 0, length = baseFonts.length;
            index < length;
            index++
          ) {
            var s = createSpan();
            s.style.fontFamily = baseFonts[index];
            baseFontsDiv.appendChild(s);
            spans.push(s);
          }
          return spans;
        };

        // creates spans for the fonts to detect and adds them to fontsDiv
        var initializeFontsSpans = function () {
          var spans = {};
          for (var i = 0, l = fontList.length; i < l; i++) {
            var fontSpans = [];
            for (
              var j = 0, numDefaultFonts = baseFonts.length;
              j < numDefaultFonts;
              j++
            ) {
              var s = createSpanWithFonts(fontList[i], baseFonts[j]);
              fontsDiv.appendChild(s);
              fontSpans.push(s);
            }
            spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
          }
          return spans;
        };

        // checks if a font is available
        var isFontAvailable = function (fontSpans) {
          var detected = false;
          for (var i = 0; i < baseFonts.length; i++) {
            detected =
              fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] ||
              fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]];
            if (detected) {
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
        for (
          var index = 0, length = baseFonts.length;
          index < length;
          index++
        ) {
          defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
          defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
        }

        // create spans for fonts to detect
        var fontsSpans = initializeFontsSpans();

        // add all the spans to the DOM
        h.appendChild(fontsDiv);

        // check available fonts
        var available = [];
        for (var i = 0, l = fontList.length; i < l; i++) {
          if (isFontAvailable(fontsSpans[fontList[i]])) {
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
      x64Add: function (m, n) {
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
      x64Multiply: function (m, n) {
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
        o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
      },
      //
      // Given a 64bit int (as an array of two 32bit ints) and an int
      // representing a number of bit positions, returns the 64bit int (as an
      // array of two 32bit ints) rotated left by that number of positions.
      //
      x64Rotl: function (m, n) {
        n %= 64;
        if (n === 32) {
          return [m[1], m[0]];
        } else if (n < 32) {
          return [
            (m[0] << n) | (m[1] >>> (32 - n)),
            (m[1] << n) | (m[0] >>> (32 - n)),
          ];
        } else {
          n -= 32;
          return [
            (m[1] << n) | (m[0] >>> (32 - n)),
            (m[0] << n) | (m[1] >>> (32 - n)),
          ];
        }
      },
      //
      // Given a 64bit int (as an array of two 32bit ints) and an int
      // representing a number of bit positions, returns the 64bit int (as an
      // array of two 32bit ints) shifted left by that number of positions.
      //
      x64LeftShift: function (m, n) {
        n %= 64;
        if (n === 0) {
          return m;
        } else if (n < 32) {
          return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
        } else {
          return [m[1] << (n - 32), 0];
        }
      },
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // xored together as a 64bit int (as an array of two 32bit ints).
      //
      x64Xor: function (m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
      },
      //
      // Given a block, returns murmurHash3's final x64 mix of that block.
      // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
      // only place where we need to right shift 64bit ints.)
      //
      x64Fmix: function (h) {
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
          k1 = [
            (key.charCodeAt(i + 4) & 0xff) |
              ((key.charCodeAt(i + 5) & 0xff) << 8) |
              ((key.charCodeAt(i + 6) & 0xff) << 16) |
              ((key.charCodeAt(i + 7) & 0xff) << 24),
            (key.charCodeAt(i) & 0xff) |
              ((key.charCodeAt(i + 1) & 0xff) << 8) |
              ((key.charCodeAt(i + 2) & 0xff) << 16) |
              ((key.charCodeAt(i + 3) & 0xff) << 24),
          ];
          k2 = [
            (key.charCodeAt(i + 12) & 0xff) |
              ((key.charCodeAt(i + 13) & 0xff) << 8) |
              ((key.charCodeAt(i + 14) & 0xff) << 16) |
              ((key.charCodeAt(i + 15) & 0xff) << 24),
            (key.charCodeAt(i + 8) & 0xff) |
              ((key.charCodeAt(i + 9) & 0xff) << 8) |
              ((key.charCodeAt(i + 10) & 0xff) << 16) |
              ((key.charCodeAt(i + 11) & 0xff) << 24),
          ];
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
        switch (remainder) {
          case 15:
            k2 = this.x64Xor(
              k2,
              this.x64LeftShift([0, key.charCodeAt(i + 14)], 48),
            );
          case 14:
            k2 = this.x64Xor(
              k2,
              this.x64LeftShift([0, key.charCodeAt(i + 13)], 40),
            );
          case 13:
            k2 = this.x64Xor(
              k2,
              this.x64LeftShift([0, key.charCodeAt(i + 12)], 32),
            );
          case 12:
            k2 = this.x64Xor(
              k2,
              this.x64LeftShift([0, key.charCodeAt(i + 11)], 24),
            );
          case 11:
            k2 = this.x64Xor(
              k2,
              this.x64LeftShift([0, key.charCodeAt(i + 10)], 16),
            );
          case 10:
            k2 = this.x64Xor(
              k2,
              this.x64LeftShift([0, key.charCodeAt(i + 9)], 8),
            );
          case 9:
            k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
            k2 = this.x64Multiply(k2, c2);
            k2 = this.x64Rotl(k2, 33);
            k2 = this.x64Multiply(k2, c1);
            h2 = this.x64Xor(h2, k2);
          case 8:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 7)], 56),
            );
          case 7:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 6)], 48),
            );
          case 6:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 5)], 40),
            );
          case 5:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 4)], 32),
            );
          case 4:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 3)], 24),
            );
          case 3:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 2)], 16),
            );
          case 2:
            k1 = this.x64Xor(
              k1,
              this.x64LeftShift([0, key.charCodeAt(i + 1)], 8),
            );
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
        return (
          ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8)
        );
      },
    };
    DeviceID.VERSION = "1.3.0";
    return DeviceID;
  });
})(typeof window === "object" ? window : this);
