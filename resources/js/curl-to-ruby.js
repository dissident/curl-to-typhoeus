/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["curlToRuby"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = curlToRuby;

	var _queryString = __webpack_require__(3);

	var _queryString2 = _interopRequireDefault(_queryString);

	var _jsonToRuby = __webpack_require__(6);

	var _jsonToRuby2 = _interopRequireDefault(_jsonToRuby);

	var _parseCommand = __webpack_require__(7);

	var _parseCommand2 = _interopRequireDefault(_parseCommand);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function curlToRuby(curl) {
		var prelude = "require 'typhoeus'\n";
		var coda = "\n" + "p response.code\n" + "p response.body\n";

		// List of curl flags that are boolean typed; this helps with parsing
		// a command like `curl -abc value` to know whether 'value' belongs to '-c'
		// or is just a positional argument instead.
		var boolOptions = ['#', 'progress-bar', '-', 'next', '0', 'http1.0', 'http1.1', 'http2', 'no-npn', 'no-alpn', '1', 'tlsv1', '2', 'sslv2', '3', 'sslv3', '4', 'ipv4', '6', 'ipv6', 'a', 'append', 'anyauth', 'B', 'use-ascii', 'basic', 'compressed', 'create-dirs', 'crlf', 'digest', 'disable-eprt', 'disable-epsv', 'environment', 'cert-status', 'false-start', 'f', 'fail', 'ftp-create-dirs', 'ftp-pasv', 'ftp-skip-pasv-ip', 'ftp-pret', 'ftp-ssl-ccc', 'ftp-ssl-control', 'g', 'globoff', 'G', 'get', 'ignore-content-length', 'i', 'include', 'I', 'head', 'j', 'junk-session-cookies', 'J', 'remote-header-name', 'k', 'insecure', 'l', 'list-only', 'L', 'location', 'location-trusted', 'metalink', 'n', 'netrc', 'N', 'no-buffer', 'netrc-file', 'netrc-optional', 'negotiate', 'no-keepalive', 'no-sessionid', 'ntlm', 'O', 'remote-name', 'oauth2-bearer', 'p', 'proxy-tunnel', 'path-as-is', 'post301', 'post302', 'post303', 'proxy-anyauth', 'proxy-basic', 'proxy-digest', 'proxy-negotiate', 'proxy-ntlm', 'q', 'raw', 'remote-name-all', 's', 'silent', 'sasl-ir', 'S', 'show-error', 'ssl', 'ssl-reqd', 'ssl-allow-beast', 'ssl-no-revoke', 'socks5-gssapi-nec', 'tcp-nodelay', 'tlsv1.0', 'tlsv1.1', 'tlsv1.2', 'tr-encoding', 'trace-time', 'v', 'verbose', 'xattr', 'h', 'help', 'M', 'manual', 'V', 'version'];

		var httpMethods = {
			'COPY': ':copy',
			'DELETE': ':delete',
			'GET': ':get',
			'HEAD': ':head',
			'LOCK': ':lock',
			'MKCOL': ':mkcol',
			'MoVE': ':move',
			'OPTIONS': ':options',
			'PATCH': ':patch',
			'POST': ':post',
			'PROPFIND': ':propfind',
			'PROPPATCH': ':proppatch',
			'PUT': ':put',
			'TRACE': ':trace',
			'UNLOCK': ':unlock'
		};

		var formUrlEncodedRegex = /^([^\s]+=[^\s]+)(&[^\s]+=[^\s]+)*$/;

		if (!curl.trim()) return;
		var cmd = (0, _parseCommand2.default)(curl, { boolFlags: boolOptions });

		if (cmd._[0] != "curl") throw "Not a curl command";

		var req = extractRelevantPieces(cmd);

		if (isSimple(req)) {
			return renderSimple(req);
		} else {
			return renderComplex(req);
		}

		// renderSimple renders a simple HTTP request using net/http convenience methods
		function renderSimple(req) {
			var ruby = "";

			ruby += 'response = Typhoeus.get("' + rubyEsc(req.url) + '")\n';

			return prelude + "\n" + ruby + coda;
		}

		// renderComplex renders Go code that requires making a http.Request.
		function renderComplex(req) {
			// First, figure out the headers
			var headers = {};
			for (var i = 0; i < req.headers.length; i++) {
				var split = req.headers[i].indexOf(":");
				if (split == -1) continue;
				var name = req.headers[i].substr(0, split).trim();
				var value = req.headers[i].substr(split + 1).trim();
				headers[toTitleCase(name)] = value;
			}

			// delete headers["Accept-Encoding"];

			var ruby = "";
			ruby += 'response = Typhoeus::Request.new(\n';

			ruby += '\t"' + rubyEsc(req.url) + '",\n';

			if (httpMethods[req.method]) {
				ruby += '\tmethod: ' + httpMethods[req.method] + ',\n';
			} else {
				ruby += '\tmethod: :get,\n';
			}

			// set basic auth
			if (req.basicauth) {
				ruby += '\tuserpwd: "' + rubyEsc(req.basicauth.user) + ':' + rubyEsc(req.basicauth.pass) + '",\n';
			}

			// if (headers["Content-Type"]) {
			// 	ruby += 'request.content_type = "' + rubyEsc(headers["Content-Type"]) + '"\n';
			// 	delete(headers["Content-Type"]);
			// }

			// set headers
			if (headers) {
				ruby += '\theaders: {\n';
				for (var name in headers) {
					ruby += '\t\t"' + rubyEsc(name) + '" => "' + rubyEsc(headers[name]) + '",\n';
				}
				ruby += '\t},\n';
			}

			function isJson(json) {
				try {
					JSON.parse(json);
					return true;
				} catch (e) {
					return false;
				}
			}

			if (req.data.ascii) {
				if (isJson(req.data.ascii)) {
					var json = JSON.parse(req.data.ascii);
					prelude += "require 'json'\n";
					ruby += "request.body = JSON.dump(" + (0, _jsonToRuby2.default)(json) + ")\n";
				} else if (formUrlEncodedRegex.test(req.data.ascii)) {
					var formData = _queryString2.default.parse(req.data.ascii);
					ruby += "request.set_form_data(\n";
					for (var name in formData) {
						var _value = formData[name];
						ruby += '  "' + rubyEsc(name) + '" => "' + rubyEsc(_value) + '",\n';
					}
					ruby += ")\n";
				} else {
					ruby += 'request.body = "' + rubyEsc(req.data.ascii) + '"\n';
				}
			}

			if (req.data.files && req.data.files.length > 0) {
				if (!req.data.ascii) {
					ruby += 'request.body = ""\n';
				}

				for (var i = 0; i < req.data.files.length; i++) {
					ruby += 'request.body << File.read("' + rubyEsc(req.data.files[i]) + '").delete("\\r\\n")\n';
				}
			}

			ruby += '\n';
			ruby += 'req_options = {\n';
			ruby += '  use_ssl: uri.scheme == "https",\n';
			if (req.insecure) {
				prelude += "require 'openssl'\n";
				ruby += '  verify_mode: OpenSSL::SSL::VERIFY_NONE,\n';
			}
			ruby += '}\n';

			ruby += '\n';
			ruby += 'response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|\n';
			ruby += '  http.request(request)\n';
			ruby += 'end\n';

			return prelude + "\n" + ruby + coda;
		}

		// extractRelevantPieces returns an object with relevant pieces
		// extracted from cmd, the parsed command. This accounts for
		// multiple flags that do the same thing and return structured
		// data that makes it easy to spit out Go code.
		function extractRelevantPieces(cmd) {
			var relevant = {
				url: "",
				method: "",
				headers: [],
				data: {}
			};

			// prefer --url over unnamed parameter, if it exists; keep first one only
			if (cmd.url && cmd.url.length > 0) relevant.url = cmd.url[0];else if (cmd._.length > 1) relevant.url = cmd._[1]; // position 1 because index 0 is the curl command itself

			relevant.url = fixUrl(relevant.url);

			// gather the headers together
			if (cmd.H) relevant.headers = relevant.headers.concat(cmd.H);
			if (cmd.header) relevant.headers = relevant.headers.concat(cmd.header);

			// set method to HEAD?
			if (cmd.I || cmd.head) relevant.method = "HEAD";

			// between -X and --request, prefer the long form I guess
			if (cmd.request && cmd.request.length > 0) relevant.method = cmd.request[cmd.request.length - 1].toUpperCase();else if (cmd.X && cmd.X.length > 0) relevant.method = cmd.X[cmd.X.length - 1].toUpperCase(); // if multiple, use last (according to curl docs)

			// join multiple request body data, if any
			var dataAscii = [];
			var dataFiles = [];
			var loadData = function loadData(d) {
				if (!relevant.method) relevant.method = "POST";
				for (var i = 0; i < d.length; i++) {
					if (d[i].length > 0 && d[i][0] == "@") dataFiles.push(d[i].substr(1));else dataAscii.push(d[i]);
				}
			};
			if (cmd.d) loadData(cmd.d);
			if (cmd.data) loadData(cmd.data);
			if (cmd['data-binary']) loadData(cmd['data-binary']);
			if (dataAscii.length > 0) relevant.data.ascii = dataAscii.join("&");
			if (dataFiles.length > 0) relevant.data.files = dataFiles;

			// between -u and --user, choose the long form...
			var basicAuthString = "";
			if (cmd.user && cmd.user.length > 0) basicAuthString = cmd.user[cmd.user.length - 1];else if (cmd.u && cmd.u.length > 0) basicAuthString = cmd.u[cmd.u.length - 1];
			var basicAuthSplit = basicAuthString.indexOf(":");
			if (basicAuthSplit > -1) {
				relevant.basicauth = {
					user: basicAuthString.substr(0, basicAuthSplit),
					pass: basicAuthString.substr(basicAuthSplit + 1)
				};
			} else {
				relevant.basicAuth = { user: basicAuthString, pass: "<PASSWORD>" };
			}

			if (cmd.k || cmd.insecure) {
				relevant.insecure = true;
			}

			// default to GET if nothing else specified
			if (!relevant.method) relevant.method = "GET";

			return relevant;
		}

		function fixUrl(url) {
			if (url && !new RegExp("^https?://", "i").test(url)) {
				return "http://" + url;
			} else {
				return url;
			}
		}

		function toTitleCase(str) {
			return str.replace(/\w*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}

		function rubyEsc(s) {
			return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
		}

		function isSimple() {
			return req.headers.length == 0 && req.method == "GET" && !req.data.ascii && !req.data.files && !req.basicauth && !req.insecure;
		}
	} /*
	  	curl-to-ruby
	  
	  	A simple utility to convert curl commands into ruby code.
	  
	  	Based on curl-to-go by Matt Holt
	  	https://github.com/mholt/curl-to-go
	  */

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(4);
	var objectAssign = __webpack_require__(5);

	function encoderForArrayFormat(opts) {
		switch (opts.arrayFormat) {
			case 'index':
				return function (key, value, index) {
					return value === null ? [
						encode(key, opts),
						'[',
						index,
						']'
					].join('') : [
						encode(key, opts),
						'[',
						encode(index, opts),
						']=',
						encode(value, opts)
					].join('');
				};

			case 'bracket':
				return function (key, value) {
					return value === null ? encode(key, opts) : [
						encode(key, opts),
						'[]=',
						encode(value, opts)
					].join('');
				};

			default:
				return function (key, value) {
					return value === null ? encode(key, opts) : [
						encode(key, opts),
						'=',
						encode(value, opts)
					].join('');
				};
		}
	}

	function parserForArrayFormat(opts) {
		var result;

		switch (opts.arrayFormat) {
			case 'index':
				return function (key, value, accumulator) {
					result = /\[(\d*)\]$/.exec(key);

					key = key.replace(/\[\d*\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = {};
					}

					accumulator[key][result[1]] = value;
				};

			case 'bracket':
				return function (key, value, accumulator) {
					result = /(\[\])$/.exec(key);
					key = key.replace(/\[\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					} else if (accumulator[key] === undefined) {
						accumulator[key] = [value];
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};

			default:
				return function (key, value, accumulator) {
					if (accumulator[key] === undefined) {
						accumulator[key] = value;
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};
		}
	}

	function encode(value, opts) {
		if (opts.encode) {
			return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
		}

		return value;
	}

	function keysSorter(input) {
		if (Array.isArray(input)) {
			return input.sort();
		} else if (typeof input === 'object') {
			return keysSorter(Object.keys(input)).sort(function (a, b) {
				return Number(a) - Number(b);
			}).map(function (key) {
				return input[key];
			});
		}

		return input;
	}

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str, opts) {
		opts = objectAssign({arrayFormat: 'none'}, opts);

		var formatter = parserForArrayFormat(opts);

		// Create an object with no prototype
		// https://github.com/sindresorhus/query-string/issues/47
		var ret = Object.create(null);

		if (typeof str !== 'string') {
			return ret;
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return ret;
		}

		str.split('&').forEach(function (param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			formatter(decodeURIComponent(key), val, ret);
		});

		return Object.keys(ret).sort().reduce(function (result, key) {
			var val = ret[key];
			if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
				// Sort object keys, not values
				result[key] = keysSorter(val);
			} else {
				result[key] = val;
			}

			return result;
		}, Object.create(null));
	};

	exports.stringify = function (obj, opts) {
		var defaults = {
			encode: true,
			strict: true,
			arrayFormat: 'none'
		};

		opts = objectAssign(defaults, opts);

		var formatter = encoderForArrayFormat(opts);

		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return encode(key, opts);
			}

			if (Array.isArray(val)) {
				var result = [];

				val.slice().forEach(function (val2) {
					if (val2 === undefined) {
						return;
					}

					result.push(formatter(key, val2, result.length));
				});

				return result.join('&');
			}

			return encode(key, opts) + '=' + encode(val, opts);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = jsonToRuby;
	function jsonToRuby(json) {
		var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

		var type = typeof json === "undefined" ? "undefined" : _typeof(json);
		if (json == null) {
			return "nil";
		} else if (type == "boolean") {
			return json.toString();
		} else if (type == "number") {
			return json.toString();
		} else if (type == "string") {
			return '"' + json.toString() + '"';
		} else if (Array.isArray(json)) {
			var ret = "[\n";
			json.forEach(function (element) {
				ret += indent + "  ";
				ret += jsonToRuby(element, indent + "  ");
				ret += ",\n";
			});
			ret = ret.slice(0, -2);
			ret += "\n" + indent + "]";
			return ret;
		} else if (type == "object") {
			var _ret = "{\n";
			for (var key in json) {
				_ret += indent + "  ";
				_ret += jsonToRuby(key);
				_ret += " => ";
				_ret += jsonToRuby(json[key], indent + "  ");
				_ret += ",\n";
			}
			_ret = _ret.slice(0, -2);
			_ret += "\n" + indent + "}";
			return _ret;
		} else {
			throw "Invalid JSON object";
		}
	}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = parseCommand;

	var _shellQuote = __webpack_require__(8);

	function parseCommand(input, options) {
	  if (typeof options === 'undefined') {
	    options = {};
	  }

	  // trim \ at and of line
	  input = input.replace(/\\\n/g, '');
	  input = input.trim();

	  var argv = (0, _shellQuote.parse)(input);

	  var argObj = { _: [] };

	  function setFlag(name, value) {
	    argObj[name] || (argObj[name] = []);
	    argObj[name].push(value);
	  }

	  while (argv.length) {
	    var flag = argv.shift();

	    /* Assume globs are typos/missing qutotes/shell-quote sillyness w */
	    if (flag.op == 'glob') {
	      flag = flag.pattern;
	    }

	    if (flag[0] == '-') {
	      flag = flag.substring(1, flag.length);
	      if (flag[0] == '-') {
	        /* long argument */
	        flag = flag.substring(1, flag.length);
	        if (boolFlag(flag)) {
	          argObj[flag] = true;
	        } else {
	          if (flag.indexOf('=') > 0) {
	            var flagName = flag.substring(0, flag.indexOf('='));
	            setFlag(flagName, flag.substring(flag.indexOf('=') + 1, flag.length));
	          } else {
	            setFlag(flag, argv.shift());
	          }
	        }
	      } else {
	        if (boolFlag(flag)) {
	          argObj[flag] = true;
	        } else if (flag.length > 1) {
	          setFlag(flag[0], flag.substring(1, flag.length));
	        } else {
	          setFlag(flag[0], argv.shift());
	        }
	      }
	      if (boolFlag(flag)) {
	        argObj[flag] = true;
	      }
	    } else {
	      setFlag('_', flag);
	    }
	  }

	  return argObj;

	  // boolFlag returns whether a flag is known to be boolean type
	  function boolFlag(flag) {
	    if (Array.isArray(options.boolFlags)) {
	      for (var i = 0; i < options.boolFlags.length; i++) {
	        if (options.boolFlags[i] == flag) return true;
	      }
	    }
	    return false;
	  }
	}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var json = typeof JSON !== undefined ? JSON : __webpack_require__(9);
	var map = __webpack_require__(12);
	var filter = __webpack_require__(13);
	var reduce = __webpack_require__(14);

	exports.quote = function (xs) {
	    return map(xs, function (s) {
	        if (s && typeof s === 'object') {
	            return s.op.replace(/(.)/g, '\\$1');
	        }
	        else if (/["\s]/.test(s) && !/'/.test(s)) {
	            return "'" + s.replace(/(['\\])/g, '\\$1') + "'";
	        }
	        else if (/["'\s]/.test(s)) {
	            return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"';
	        }
	        else {
	            return String(s).replace(/([#!"$&'()*,:;<=>?@\[\\\]^`{|}])/g, '\\$1'); 
	        }
	    }).join(' ');
	};

	var CONTROL = '(?:' + [
	    '\\|\\|', '\\&\\&', ';;', '\\|\\&', '[&;()|<>]'
	].join('|') + ')';
	var META = '|&;()<> \\t';
	var BAREWORD = '(\\\\[\'"' + META + ']|[^\\s\'"' + META + '])+';
	var SINGLE_QUOTE = '"((\\\\"|[^"])*?)"';
	var DOUBLE_QUOTE = '\'((\\\\\'|[^\'])*?)\'';

	var TOKEN = '';
	for (var i = 0; i < 4; i++) {
	    TOKEN += (Math.pow(16,8)*Math.random()).toString(16);
	}

	exports.parse = function (s, env, opts) {
	    var mapped = parse(s, env, opts);
	    if (typeof env !== 'function') return mapped;
	    return reduce(mapped, function (acc, s) {
	        if (typeof s === 'object') return acc.concat(s);
	        var xs = s.split(RegExp('(' + TOKEN + '.*?' + TOKEN + ')', 'g'));
	        if (xs.length === 1) return acc.concat(xs[0]);
	        return acc.concat(map(filter(xs, Boolean), function (x) {
	            if (RegExp('^' + TOKEN).test(x)) {
	                return json.parse(x.split(TOKEN)[1]);
	            }
	            else return x;
	        }));
	    }, []);
	};

	function parse (s, env, opts) {
	    var chunker = new RegExp([
	        '(' + CONTROL + ')', // control chars
	        '(' + BAREWORD + '|' + SINGLE_QUOTE + '|' + DOUBLE_QUOTE + ')*'
	    ].join('|'), 'g');
	    var match = filter(s.match(chunker), Boolean);
	    var commented = false;

	    if (!match) return [];
	    if (!env) env = {};
	    if (!opts) opts = {};
	    return map(match, function (s, j) {
	        if (commented) {
	            return;
	        }
	        if (RegExp('^' + CONTROL + '$').test(s)) {
	            return { op: s };
	        }

	        // Hand-written scanner/parser for Bash quoting rules:
	        //
	        //  1. inside single quotes, all characters are printed literally.
	        //  2. inside double quotes, all characters are printed literally
	        //     except variables prefixed by '$' and backslashes followed by
	        //     either a double quote or another backslash.
	        //  3. outside of any quotes, backslashes are treated as escape
	        //     characters and not printed (unless they are themselves escaped)
	        //  4. quote context can switch mid-token if there is no whitespace
	        //     between the two quote contexts (e.g. all'one'"token" parses as
	        //     "allonetoken")
	        var SQ = "'";
	        var DQ = '"';
	        var DS = '$';
	        var BS = opts.escape || '\\';
	        var quote = false;
	        var esc = false;
	        var out = '';
	        var isGlob = false;

	        for (var i = 0, len = s.length; i < len; i++) {
	            var c = s.charAt(i);
	            isGlob = isGlob || (!quote && (c === '*' || c === '?'));
	            if (esc) {
	                out += c;
	                esc = false;
	            }
	            else if (quote) {
	                if (c === quote) {
	                    quote = false;
	                }
	                else if (quote == SQ) {
	                    out += c;
	                }
	                else { // Double quote
	                    if (c === BS) {
	                        i += 1;
	                        c = s.charAt(i);
	                        if (c === DQ || c === BS || c === DS) {
	                            out += c;
	                        } else {
	                            out += BS + c;
	                        }
	                    }
	                    else if (c === DS) {
	                        out += parseEnvVar();
	                    }
	                    else {
	                        out += c;
	                    }
	                }
	            }
	            else if (c === DQ || c === SQ) {
	                quote = c;
	            }
	            else if (RegExp('^' + CONTROL + '$').test(c)) {
	                return { op: s };
	            }
	            else if (RegExp('^#$').test(c)) {
	                commented = true;
	                if (out.length){
	                    return [out, { comment: s.slice(i+1) + match.slice(j+1).join(' ') }];
	                }
	                return [{ comment: s.slice(i+1) + match.slice(j+1).join(' ') }];
	            }
	            else if (c === BS) {
	                esc = true;
	            }
	            else if (c === DS) {
	                out += parseEnvVar();
	            }
	            else out += c;
	        }

	        if (isGlob) return {op: 'glob', pattern: out};

	        return out;

	        function parseEnvVar() {
	            i += 1;
	            var varend, varname;
	            //debugger
	            if (s.charAt(i) === '{') {
	                i += 1;
	                if (s.charAt(i) === '}') {
	                    throw new Error("Bad substitution: " + s.substr(i - 2, 3));
	                }
	                varend = s.indexOf('}', i);
	                if (varend < 0) {
	                    throw new Error("Bad substitution: " + s.substr(i));
	                }
	                varname = s.substr(i, varend - i);
	                i = varend;
	            }
	            else if (/[*@#?$!_\-]/.test(s.charAt(i))) {
	                varname = s.charAt(i);
	                i += 1;
	            }
	            else {
	                varend = s.substr(i).match(/[^\w\d_]/);
	                if (!varend) {
	                    varname = s.substr(i);
	                    i = s.length;
	                } else {
	                    varname = s.substr(i, varend.index);
	                    i += varend.index - 1;
	                }
	            }
	            return getVar(null, '', varname);
	        }
	    })
	    // finalize parsed aruments
	    .reduce(function(prev, arg){
	        if (arg === undefined){
	            return prev;
	        }
	        return prev.concat(arg);
	    },[]);

	    function getVar (_, pre, key) {
	        var r = typeof env === 'function' ? env(key) : env[key];
	        if (r === undefined) r = '';

	        if (typeof r === 'object') {
	            return pre + TOKEN + json.stringify(r) + TOKEN;
	        }
	        else return pre + r;
	    }
	}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	exports.parse = __webpack_require__(10);
	exports.stringify = __webpack_require__(11);


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var at, // The index of the current character
	    ch, // The current character
	    escapee = {
	        '"':  '"',
	        '\\': '\\',
	        '/':  '/',
	        b:    '\b',
	        f:    '\f',
	        n:    '\n',
	        r:    '\r',
	        t:    '\t'
	    },
	    text,

	    error = function (m) {
	        // Call error when something is wrong.
	        throw {
	            name:    'SyntaxError',
	            message: m,
	            at:      at,
	            text:    text
	        };
	    },
	    
	    next = function (c) {
	        // If a c parameter is provided, verify that it matches the current character.
	        if (c && c !== ch) {
	            error("Expected '" + c + "' instead of '" + ch + "'");
	        }
	        
	        // Get the next character. When there are no more characters,
	        // return the empty string.
	        
	        ch = text.charAt(at);
	        at += 1;
	        return ch;
	    },
	    
	    number = function () {
	        // Parse a number value.
	        var number,
	            string = '';
	        
	        if (ch === '-') {
	            string = '-';
	            next('-');
	        }
	        while (ch >= '0' && ch <= '9') {
	            string += ch;
	            next();
	        }
	        if (ch === '.') {
	            string += '.';
	            while (next() && ch >= '0' && ch <= '9') {
	                string += ch;
	            }
	        }
	        if (ch === 'e' || ch === 'E') {
	            string += ch;
	            next();
	            if (ch === '-' || ch === '+') {
	                string += ch;
	                next();
	            }
	            while (ch >= '0' && ch <= '9') {
	                string += ch;
	                next();
	            }
	        }
	        number = +string;
	        if (!isFinite(number)) {
	            error("Bad number");
	        } else {
	            return number;
	        }
	    },
	    
	    string = function () {
	        // Parse a string value.
	        var hex,
	            i,
	            string = '',
	            uffff;
	        
	        // When parsing for string values, we must look for " and \ characters.
	        if (ch === '"') {
	            while (next()) {
	                if (ch === '"') {
	                    next();
	                    return string;
	                } else if (ch === '\\') {
	                    next();
	                    if (ch === 'u') {
	                        uffff = 0;
	                        for (i = 0; i < 4; i += 1) {
	                            hex = parseInt(next(), 16);
	                            if (!isFinite(hex)) {
	                                break;
	                            }
	                            uffff = uffff * 16 + hex;
	                        }
	                        string += String.fromCharCode(uffff);
	                    } else if (typeof escapee[ch] === 'string') {
	                        string += escapee[ch];
	                    } else {
	                        break;
	                    }
	                } else {
	                    string += ch;
	                }
	            }
	        }
	        error("Bad string");
	    },

	    white = function () {

	// Skip whitespace.

	        while (ch && ch <= ' ') {
	            next();
	        }
	    },

	    word = function () {

	// true, false, or null.

	        switch (ch) {
	        case 't':
	            next('t');
	            next('r');
	            next('u');
	            next('e');
	            return true;
	        case 'f':
	            next('f');
	            next('a');
	            next('l');
	            next('s');
	            next('e');
	            return false;
	        case 'n':
	            next('n');
	            next('u');
	            next('l');
	            next('l');
	            return null;
	        }
	        error("Unexpected '" + ch + "'");
	    },

	    value,  // Place holder for the value function.

	    array = function () {

	// Parse an array value.

	        var array = [];

	        if (ch === '[') {
	            next('[');
	            white();
	            if (ch === ']') {
	                next(']');
	                return array;   // empty array
	            }
	            while (ch) {
	                array.push(value());
	                white();
	                if (ch === ']') {
	                    next(']');
	                    return array;
	                }
	                next(',');
	                white();
	            }
	        }
	        error("Bad array");
	    },

	    object = function () {

	// Parse an object value.

	        var key,
	            object = {};

	        if (ch === '{') {
	            next('{');
	            white();
	            if (ch === '}') {
	                next('}');
	                return object;   // empty object
	            }
	            while (ch) {
	                key = string();
	                white();
	                next(':');
	                if (Object.hasOwnProperty.call(object, key)) {
	                    error('Duplicate key "' + key + '"');
	                }
	                object[key] = value();
	                white();
	                if (ch === '}') {
	                    next('}');
	                    return object;
	                }
	                next(',');
	                white();
	            }
	        }
	        error("Bad object");
	    };

	value = function () {

	// Parse a JSON value. It could be an object, an array, a string, a number,
	// or a word.

	    white();
	    switch (ch) {
	    case '{':
	        return object();
	    case '[':
	        return array();
	    case '"':
	        return string();
	    case '-':
	        return number();
	    default:
	        return ch >= '0' && ch <= '9' ? number() : word();
	    }
	};

	// Return the json_parse function. It will have access to all of the above
	// functions and variables.

	module.exports = function (source, reviver) {
	    var result;
	    
	    text = source;
	    at = 0;
	    ch = ' ';
	    result = value();
	    white();
	    if (ch) {
	        error("Syntax error");
	    }

	    // If there is a reviver function, we recursively walk the new structure,
	    // passing each name/value pair to the reviver function for possible
	    // transformation, starting with a temporary root object that holds the result
	    // in an empty key. If there is not a reviver function, we simply return the
	    // result.

	    return typeof reviver === 'function' ? (function walk(holder, key) {
	        var k, v, value = holder[key];
	        if (value && typeof value === 'object') {
	            for (k in value) {
	                if (Object.prototype.hasOwnProperty.call(value, k)) {
	                    v = walk(value, k);
	                    if (v !== undefined) {
	                        value[k] = v;
	                    } else {
	                        delete value[k];
	                    }
	                }
	            }
	        }
	        return reviver.call(holder, key, value);
	    }({'': result}, '')) : result;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    gap,
	    indent,
	    meta = {    // table of character substitutions
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"' : '\\"',
	        '\\': '\\\\'
	    },
	    rep;

	function quote(string) {
	    // If the string contains no control characters, no quote characters, and no
	    // backslash characters, then we can safely slap some quotes around it.
	    // Otherwise we must also replace the offending characters with safe escape
	    // sequences.
	    
	    escapable.lastIndex = 0;
	    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	        var c = meta[a];
	        return typeof c === 'string' ? c :
	            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    }) + '"' : '"' + string + '"';
	}

	function str(key, holder) {
	    // Produce a string from holder[key].
	    var i,          // The loop counter.
	        k,          // The member key.
	        v,          // The member value.
	        length,
	        mind = gap,
	        partial,
	        value = holder[key];
	    
	    // If the value has a toJSON method, call it to obtain a replacement value.
	    if (value && typeof value === 'object' &&
	            typeof value.toJSON === 'function') {
	        value = value.toJSON(key);
	    }
	    
	    // If we were called with a replacer function, then call the replacer to
	    // obtain a replacement value.
	    if (typeof rep === 'function') {
	        value = rep.call(holder, key, value);
	    }
	    
	    // What happens next depends on the value's type.
	    switch (typeof value) {
	        case 'string':
	            return quote(value);
	        
	        case 'number':
	            // JSON numbers must be finite. Encode non-finite numbers as null.
	            return isFinite(value) ? String(value) : 'null';
	        
	        case 'boolean':
	        case 'null':
	            // If the value is a boolean or null, convert it to a string. Note:
	            // typeof null does not produce 'null'. The case is included here in
	            // the remote chance that this gets fixed someday.
	            return String(value);
	            
	        case 'object':
	            if (!value) return 'null';
	            gap += indent;
	            partial = [];
	            
	            // Array.isArray
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	                
	                // Join all of the elements together, separated with commas, and
	                // wrap them in brackets.
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	            
	            // If the replacer is an array, use it to select the members to be
	            // stringified.
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    k = rep[i];
	                    if (typeof k === 'string') {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            else {
	                // Otherwise, iterate through all of the keys in the object.
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            
	        // Join all of the member texts together, separated with commas,
	        // and wrap them in braces.

	        v = partial.length === 0 ? '{}' : gap ?
	            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	            '{' + partial.join(',') + '}';
	        gap = mind;
	        return v;
	    }
	}

	module.exports = function (value, replacer, space) {
	    var i;
	    gap = '';
	    indent = '';
	    
	    // If the space parameter is a number, make an indent string containing that
	    // many spaces.
	    if (typeof space === 'number') {
	        for (i = 0; i < space; i += 1) {
	            indent += ' ';
	        }
	    }
	    // If the space parameter is a string, it will be used as the indent string.
	    else if (typeof space === 'string') {
	        indent = space;
	    }

	    // If there is a replacer, it must be a function or an array.
	    // Otherwise, throw an error.
	    rep = replacer;
	    if (replacer && typeof replacer !== 'function'
	    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
	        throw new Error('JSON.stringify');
	    }
	    
	    // Make a fake root object containing our value under the key of ''.
	    // Return the result of stringifying the value.
	    return str('', {'': value});
	};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = function (xs, f) {
	    if (xs.map) return xs.map(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        var x = xs[i];
	        if (hasOwn.call(xs, i)) res.push(f(x, i, xs));
	    }
	    return res;
	};

	var hasOwn = Object.prototype.hasOwnProperty;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/**
	 * Array#filter.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @return {Array}
	 */

	module.exports = function (arr, fn) {
	  if (arr.filter) return arr.filter(fn);
	  var ret = [];
	  for (var i = 0; i < arr.length; i++) {
	    if (!hasOwn.call(arr, i)) continue;
	    if (fn(arr[i], i, arr)) ret.push(arr[i]);
	  }
	  return ret;
	};

	var hasOwn = Object.prototype.hasOwnProperty;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var hasOwn = Object.prototype.hasOwnProperty;

	module.exports = function (xs, f, acc) {
	    var hasAcc = arguments.length >= 3;
	    if (hasAcc && xs.reduce) return xs.reduce(f, acc);
	    if (xs.reduce) return xs.reduce(f);
	    
	    for (var i = 0; i < xs.length; i++) {
	        if (!hasOwn.call(xs, i)) continue;
	        if (!hasAcc) {
	            acc = xs[i];
	            hasAcc = true;
	            continue;
	        }
	        acc = f(acc, xs[i], i);
	    }
	    return acc;
	};


/***/ })
/******/ ]);