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

	var _curlToRuby = __webpack_require__(2);

	var _curlToRuby2 = _interopRequireDefault(_curlToRuby);

	var _highlightPack = __webpack_require__(15);

	var _highlightPack2 = _interopRequireDefault(_highlightPack);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function init() {
	  var emptyOutputMsg = "Ruby code will appear here";
	  var formattedEmptyOutputMsg = '<span style="color: #777;">' + emptyOutputMsg + '</span>';

	  function getOutputHTML(input) {
	    if (!input) {
	      return formattedEmptyOutputMsg;
	    }

	    try {
	      var output = (0, _curlToRuby2.default)(input);
	      if (output) {
	        var coloredOutput = _highlightPack2.default.highlight("ruby", output);
	        return coloredOutput.value;
	      }
	    } catch (e) {
	      console.log(e);
	      return '<span class="clr-red">' + e + '</span>';
	    }
	  }

	  function updateOutput() {
	    var input = document.getElementById('input').value;
	    var output = document.getElementById('output');

	    output.innerHTML = getOutputHTML(input);
	  }

	  // Update placeholder text
	  ['focus', 'blur', 'keyup'].forEach(function (ev) {
	    document.getElementById('input').addEventListener(ev, updateOutput);
	  });
	  updateOutput();

	  // Highlights the output for the user
	  document.getElementById('output').addEventListener('click', function () {
	    if (document.selection) {
	      var range = document.body.createTextRange();
	      range.moveToElementText(this);
	      range.select();
	    } else if (window.getSelection) {
	      var _range = document.createRange();
	      _range.selectNode(this);
	      window.getSelection().addRange(_range);
	    }
	  });

	  window.useExample = function (name) {
	    var example = document.getElementById(name).innerHTML.trim();
	    var input = document.getElementById('input');
	    input.value = example;
	    updateOutput();
	  };
	}

	if (document.readyState != 'loading') {
	  init();
	} else {
	  document.addEventListener('DOMContentLoaded', init);
	}

/***/ }),
/* 1 */,
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


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _highlight = __webpack_require__(16);

	var _highlight2 = _interopRequireDefault(_highlight);

	var _ruby = __webpack_require__(17);

	var _ruby2 = _interopRequireDefault(_ruby);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_highlight2.default.registerLanguage('ruby', _ruby2.default);

	exports.default = _highlight2.default;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	Syntax highlighting with language autodetection.
	https://highlightjs.org/
	*/

	(function(factory) {

	  // Find the global object for export to both the browser and web workers.
	  var globalObject = typeof window === 'object' && window ||
	                     typeof self === 'object' && self;

	  // Setup highlight.js for different environments. First is Node.js or
	  // CommonJS.
	  if(true) {
	    factory(exports);
	  } else if(globalObject) {
	    // Export hljs globally even when using AMD for cases when this script
	    // is loaded with others that may still expect a global hljs.
	    globalObject.hljs = factory({});

	    // Finally register the global hljs with AMD.
	    if(typeof define === 'function' && define.amd) {
	      define([], function() {
	        return globalObject.hljs;
	      });
	    }
	  }

	}(function(hljs) {
	  // Convenience variables for build-in objects
	  var ArrayProto = [],
	      objectKeys = Object.keys;

	  // Global internal variables used within the highlight.js library.
	  var languages = {},
	      aliases   = {};

	  // Regular expressions used throughout the highlight.js library.
	  var noHighlightRe    = /^(no-?highlight|plain|text)$/i,
	      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
	      fixMarkupRe      = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

	  var spanEndTag = '</span>';

	  // Global options used when within external APIs. This is modified when
	  // calling the `hljs.configure` function.
	  var options = {
	    classPrefix: 'hljs-',
	    tabReplace: null,
	    useBR: false,
	    languages: undefined
	  };


	  /* Utility functions */

	  function escape(value) {
	    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	  }

	  function tag(node) {
	    return node.nodeName.toLowerCase();
	  }

	  function testRe(re, lexeme) {
	    var match = re && re.exec(lexeme);
	    return match && match.index === 0;
	  }

	  function isNotHighlighted(language) {
	    return noHighlightRe.test(language);
	  }

	  function blockLanguage(block) {
	    var i, match, length, _class;
	    var classes = block.className + ' ';

	    classes += block.parentNode ? block.parentNode.className : '';

	    // language-* takes precedence over non-prefixed class names.
	    match = languagePrefixRe.exec(classes);
	    if (match) {
	      return getLanguage(match[1]) ? match[1] : 'no-highlight';
	    }

	    classes = classes.split(/\s+/);

	    for (i = 0, length = classes.length; i < length; i++) {
	      _class = classes[i]

	      if (isNotHighlighted(_class) || getLanguage(_class)) {
	        return _class;
	      }
	    }
	  }

	  function inherit(parent) {  // inherit(parent, override_obj, override_obj, ...)
	    var key;
	    var result = {};
	    var objects = Array.prototype.slice.call(arguments, 1);

	    for (key in parent)
	      result[key] = parent[key];
	    objects.forEach(function(obj) {
	      for (key in obj)
	        result[key] = obj[key];
	    });
	    return result;
	  }

	  /* Stream merging */

	  function nodeStream(node) {
	    var result = [];
	    (function _nodeStream(node, offset) {
	      for (var child = node.firstChild; child; child = child.nextSibling) {
	        if (child.nodeType === 3)
	          offset += child.nodeValue.length;
	        else if (child.nodeType === 1) {
	          result.push({
	            event: 'start',
	            offset: offset,
	            node: child
	          });
	          offset = _nodeStream(child, offset);
	          // Prevent void elements from having an end tag that would actually
	          // double them in the output. There are more void elements in HTML
	          // but we list only those realistically expected in code display.
	          if (!tag(child).match(/br|hr|img|input/)) {
	            result.push({
	              event: 'stop',
	              offset: offset,
	              node: child
	            });
	          }
	        }
	      }
	      return offset;
	    })(node, 0);
	    return result;
	  }

	  function mergeStreams(original, highlighted, value) {
	    var processed = 0;
	    var result = '';
	    var nodeStack = [];

	    function selectStream() {
	      if (!original.length || !highlighted.length) {
	        return original.length ? original : highlighted;
	      }
	      if (original[0].offset !== highlighted[0].offset) {
	        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
	      }

	      /*
	      To avoid starting the stream just before it should stop the order is
	      ensured that original always starts first and closes last:

	      if (event1 == 'start' && event2 == 'start')
	        return original;
	      if (event1 == 'start' && event2 == 'stop')
	        return highlighted;
	      if (event1 == 'stop' && event2 == 'start')
	        return original;
	      if (event1 == 'stop' && event2 == 'stop')
	        return highlighted;

	      ... which is collapsed to:
	      */
	      return highlighted[0].event === 'start' ? original : highlighted;
	    }

	    function open(node) {
	      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value).replace('"', '&quot;') + '"';}
	      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
	    }

	    function close(node) {
	      result += '</' + tag(node) + '>';
	    }

	    function render(event) {
	      (event.event === 'start' ? open : close)(event.node);
	    }

	    while (original.length || highlighted.length) {
	      var stream = selectStream();
	      result += escape(value.substring(processed, stream[0].offset));
	      processed = stream[0].offset;
	      if (stream === original) {
	        /*
	        On any opening or closing tag of the original markup we first close
	        the entire highlighted node stack, then render the original tag along
	        with all the following original tags at the same offset and then
	        reopen all the tags on the highlighted stack.
	        */
	        nodeStack.reverse().forEach(close);
	        do {
	          render(stream.splice(0, 1)[0]);
	          stream = selectStream();
	        } while (stream === original && stream.length && stream[0].offset === processed);
	        nodeStack.reverse().forEach(open);
	      } else {
	        if (stream[0].event === 'start') {
	          nodeStack.push(stream[0].node);
	        } else {
	          nodeStack.pop();
	        }
	        render(stream.splice(0, 1)[0]);
	      }
	    }
	    return result + escape(value.substr(processed));
	  }

	  /* Initialization */

	  function expand_mode(mode) {
	    if (mode.variants && !mode.cached_variants) {
	      mode.cached_variants = mode.variants.map(function(variant) {
	        return inherit(mode, {variants: null}, variant);
	      });
	    }
	    return mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode];
	  }

	  function compileLanguage(language) {

	    function reStr(re) {
	        return (re && re.source) || re;
	    }

	    function langRe(value, global) {
	      return new RegExp(
	        reStr(value),
	        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
	      );
	    }

	    function compileMode(mode, parent) {
	      if (mode.compiled)
	        return;
	      mode.compiled = true;

	      mode.keywords = mode.keywords || mode.beginKeywords;
	      if (mode.keywords) {
	        var compiled_keywords = {};

	        var flatten = function(className, str) {
	          if (language.case_insensitive) {
	            str = str.toLowerCase();
	          }
	          str.split(' ').forEach(function(kw) {
	            var pair = kw.split('|');
	            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
	          });
	        };

	        if (typeof mode.keywords === 'string') { // string
	          flatten('keyword', mode.keywords);
	        } else {
	          objectKeys(mode.keywords).forEach(function (className) {
	            flatten(className, mode.keywords[className]);
	          });
	        }
	        mode.keywords = compiled_keywords;
	      }
	      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

	      if (parent) {
	        if (mode.beginKeywords) {
	          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
	        }
	        if (!mode.begin)
	          mode.begin = /\B|\b/;
	        mode.beginRe = langRe(mode.begin);
	        if (!mode.end && !mode.endsWithParent)
	          mode.end = /\B|\b/;
	        if (mode.end)
	          mode.endRe = langRe(mode.end);
	        mode.terminator_end = reStr(mode.end) || '';
	        if (mode.endsWithParent && parent.terminator_end)
	          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
	      }
	      if (mode.illegal)
	        mode.illegalRe = langRe(mode.illegal);
	      if (mode.relevance == null)
	        mode.relevance = 1;
	      if (!mode.contains) {
	        mode.contains = [];
	      }
	      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function(c) {
	        return expand_mode(c === 'self' ? mode : c)
	      }));
	      mode.contains.forEach(function(c) {compileMode(c, mode);});

	      if (mode.starts) {
	        compileMode(mode.starts, parent);
	      }

	      var terminators =
	        mode.contains.map(function(c) {
	          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
	        })
	        .concat([mode.terminator_end, mode.illegal])
	        .map(reStr)
	        .filter(Boolean);
	      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(/*s*/) {return null;}};
	    }

	    compileMode(language);
	  }

	  /*
	  Core highlighting function. Accepts a language name, or an alias, and a
	  string with the code to highlight. Returns an object with the following
	  properties:

	  - relevance (int)
	  - value (an HTML string with highlighting markup)

	  */
	  function highlight(name, value, ignore_illegals, continuation) {

	    function subMode(lexeme, mode) {
	      var i, length;

	      for (i = 0, length = mode.contains.length; i < length; i++) {
	        if (testRe(mode.contains[i].beginRe, lexeme)) {
	          return mode.contains[i];
	        }
	      }
	    }

	    function endOfMode(mode, lexeme) {
	      if (testRe(mode.endRe, lexeme)) {
	        while (mode.endsParent && mode.parent) {
	          mode = mode.parent;
	        }
	        return mode;
	      }
	      if (mode.endsWithParent) {
	        return endOfMode(mode.parent, lexeme);
	      }
	    }

	    function isIllegal(lexeme, mode) {
	      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
	    }

	    function keywordMatch(mode, match) {
	      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
	      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
	    }

	    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
	      var classPrefix = noPrefix ? '' : options.classPrefix,
	          openSpan    = '<span class="' + classPrefix,
	          closeSpan   = leaveOpen ? '' : spanEndTag

	      openSpan += classname + '">';

	      return openSpan + insideSpan + closeSpan;
	    }

	    function processKeywords() {
	      var keyword_match, last_index, match, result;

	      if (!top.keywords)
	        return escape(mode_buffer);

	      result = '';
	      last_index = 0;
	      top.lexemesRe.lastIndex = 0;
	      match = top.lexemesRe.exec(mode_buffer);

	      while (match) {
	        result += escape(mode_buffer.substring(last_index, match.index));
	        keyword_match = keywordMatch(top, match);
	        if (keyword_match) {
	          relevance += keyword_match[1];
	          result += buildSpan(keyword_match[0], escape(match[0]));
	        } else {
	          result += escape(match[0]);
	        }
	        last_index = top.lexemesRe.lastIndex;
	        match = top.lexemesRe.exec(mode_buffer);
	      }
	      return result + escape(mode_buffer.substr(last_index));
	    }

	    function processSubLanguage() {
	      var explicit = typeof top.subLanguage === 'string';
	      if (explicit && !languages[top.subLanguage]) {
	        return escape(mode_buffer);
	      }

	      var result = explicit ?
	                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
	                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

	      // Counting embedded language score towards the host language may be disabled
	      // with zeroing the containing mode relevance. Usecase in point is Markdown that
	      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
	      // score.
	      if (top.relevance > 0) {
	        relevance += result.relevance;
	      }
	      if (explicit) {
	        continuations[top.subLanguage] = result.top;
	      }
	      return buildSpan(result.language, result.value, false, true);
	    }

	    function processBuffer() {
	      result += (top.subLanguage != null ? processSubLanguage() : processKeywords());
	      mode_buffer = '';
	    }

	    function startNewMode(mode) {
	      result += mode.className? buildSpan(mode.className, '', true): '';
	      top = Object.create(mode, {parent: {value: top}});
	    }

	    function processLexeme(buffer, lexeme) {

	      mode_buffer += buffer;

	      if (lexeme == null) {
	        processBuffer();
	        return 0;
	      }

	      var new_mode = subMode(lexeme, top);
	      if (new_mode) {
	        if (new_mode.skip) {
	          mode_buffer += lexeme;
	        } else {
	          if (new_mode.excludeBegin) {
	            mode_buffer += lexeme;
	          }
	          processBuffer();
	          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
	            mode_buffer = lexeme;
	          }
	        }
	        startNewMode(new_mode, lexeme);
	        return new_mode.returnBegin ? 0 : lexeme.length;
	      }

	      var end_mode = endOfMode(top, lexeme);
	      if (end_mode) {
	        var origin = top;
	        if (origin.skip) {
	          mode_buffer += lexeme;
	        } else {
	          if (!(origin.returnEnd || origin.excludeEnd)) {
	            mode_buffer += lexeme;
	          }
	          processBuffer();
	          if (origin.excludeEnd) {
	            mode_buffer = lexeme;
	          }
	        }
	        do {
	          if (top.className) {
	            result += spanEndTag;
	          }
	          if (!top.skip) {
	            relevance += top.relevance;
	          }
	          top = top.parent;
	        } while (top !== end_mode.parent);
	        if (end_mode.starts) {
	          startNewMode(end_mode.starts, '');
	        }
	        return origin.returnEnd ? 0 : lexeme.length;
	      }

	      if (isIllegal(lexeme, top))
	        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

	      /*
	      Parser should not reach this point as all types of lexemes should be caught
	      earlier, but if it does due to some bug make sure it advances at least one
	      character forward to prevent infinite looping.
	      */
	      mode_buffer += lexeme;
	      return lexeme.length || 1;
	    }

	    var language = getLanguage(name);
	    if (!language) {
	      throw new Error('Unknown language: "' + name + '"');
	    }

	    compileLanguage(language);
	    var top = continuation || language;
	    var continuations = {}; // keep continuations for sub-languages
	    var result = '', current;
	    for(current = top; current !== language; current = current.parent) {
	      if (current.className) {
	        result = buildSpan(current.className, '', true) + result;
	      }
	    }
	    var mode_buffer = '';
	    var relevance = 0;
	    try {
	      var match, count, index = 0;
	      while (true) {
	        top.terminators.lastIndex = index;
	        match = top.terminators.exec(value);
	        if (!match)
	          break;
	        count = processLexeme(value.substring(index, match.index), match[0]);
	        index = match.index + count;
	      }
	      processLexeme(value.substr(index));
	      for(current = top; current.parent; current = current.parent) { // close dangling modes
	        if (current.className) {
	          result += spanEndTag;
	        }
	      }
	      return {
	        relevance: relevance,
	        value: result,
	        language: name,
	        top: top
	      };
	    } catch (e) {
	      if (e.message && e.message.indexOf('Illegal') !== -1) {
	        return {
	          relevance: 0,
	          value: escape(value)
	        };
	      } else {
	        throw e;
	      }
	    }
	  }

	  /*
	  Highlighting with language detection. Accepts a string with the code to
	  highlight. Returns an object with the following properties:

	  - language (detected language)
	  - relevance (int)
	  - value (an HTML string with highlighting markup)
	  - second_best (object with the same structure for second-best heuristically
	    detected language, may be absent)

	  */
	  function highlightAuto(text, languageSubset) {
	    languageSubset = languageSubset || options.languages || objectKeys(languages);
	    var result = {
	      relevance: 0,
	      value: escape(text)
	    };
	    var second_best = result;
	    languageSubset.filter(getLanguage).forEach(function(name) {
	      var current = highlight(name, text, false);
	      current.language = name;
	      if (current.relevance > second_best.relevance) {
	        second_best = current;
	      }
	      if (current.relevance > result.relevance) {
	        second_best = result;
	        result = current;
	      }
	    });
	    if (second_best.language) {
	      result.second_best = second_best;
	    }
	    return result;
	  }

	  /*
	  Post-processing of the highlighted markup:

	  - replace TABs with something more useful
	  - replace real line-breaks with '<br>' for non-pre containers

	  */
	  function fixMarkup(value) {
	    return !(options.tabReplace || options.useBR)
	      ? value
	      : value.replace(fixMarkupRe, function(match, p1) {
	          if (options.useBR && match === '\n') {
	            return '<br>';
	          } else if (options.tabReplace) {
	            return p1.replace(/\t/g, options.tabReplace);
	          }
	          return '';
	      });
	  }

	  function buildClassName(prevClassName, currentLang, resultLang) {
	    var language = currentLang ? aliases[currentLang] : resultLang,
	        result   = [prevClassName.trim()];

	    if (!prevClassName.match(/\bhljs\b/)) {
	      result.push('hljs');
	    }

	    if (prevClassName.indexOf(language) === -1) {
	      result.push(language);
	    }

	    return result.join(' ').trim();
	  }

	  /*
	  Applies highlighting to a DOM node containing code. Accepts a DOM node and
	  two optional parameters for fixMarkup.
	  */
	  function highlightBlock(block) {
	    var node, originalStream, result, resultNode, text;
	    var language = blockLanguage(block);

	    if (isNotHighlighted(language))
	        return;

	    if (options.useBR) {
	      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
	    } else {
	      node = block;
	    }
	    text = node.textContent;
	    result = language ? highlight(language, text, true) : highlightAuto(text);

	    originalStream = nodeStream(node);
	    if (originalStream.length) {
	      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      resultNode.innerHTML = result.value;
	      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
	    }
	    result.value = fixMarkup(result.value);

	    block.innerHTML = result.value;
	    block.className = buildClassName(block.className, language, result.language);
	    block.result = {
	      language: result.language,
	      re: result.relevance
	    };
	    if (result.second_best) {
	      block.second_best = {
	        language: result.second_best.language,
	        re: result.second_best.relevance
	      };
	    }
	  }

	  /*
	  Updates highlight.js global options with values passed in the form of an object.
	  */
	  function configure(user_options) {
	    options = inherit(options, user_options);
	  }

	  /*
	  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
	  */
	  function initHighlighting() {
	    if (initHighlighting.called)
	      return;
	    initHighlighting.called = true;

	    var blocks = document.querySelectorAll('pre code');
	    ArrayProto.forEach.call(blocks, highlightBlock);
	  }

	  /*
	  Attaches highlighting to the page load event.
	  */
	  function initHighlightingOnLoad() {
	    addEventListener('DOMContentLoaded', initHighlighting, false);
	    addEventListener('load', initHighlighting, false);
	  }

	  function registerLanguage(name, language) {
	    var lang = languages[name] = language(hljs);
	    if (lang.aliases) {
	      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
	    }
	  }

	  function listLanguages() {
	    return objectKeys(languages);
	  }

	  function getLanguage(name) {
	    name = (name || '').toLowerCase();
	    return languages[name] || languages[aliases[name]];
	  }

	  /* Interface definition */

	  hljs.highlight = highlight;
	  hljs.highlightAuto = highlightAuto;
	  hljs.fixMarkup = fixMarkup;
	  hljs.highlightBlock = highlightBlock;
	  hljs.configure = configure;
	  hljs.initHighlighting = initHighlighting;
	  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
	  hljs.registerLanguage = registerLanguage;
	  hljs.listLanguages = listLanguages;
	  hljs.getLanguage = getLanguage;
	  hljs.inherit = inherit;

	  // Common regexps
	  hljs.IDENT_RE = '[a-zA-Z]\\w*';
	  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
	  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
	  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
	  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
	  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

	  // Common modes
	  hljs.BACKSLASH_ESCAPE = {
	    begin: '\\\\[\\s\\S]', relevance: 0
	  };
	  hljs.APOS_STRING_MODE = {
	    className: 'string',
	    begin: '\'', end: '\'',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.QUOTE_STRING_MODE = {
	    className: 'string',
	    begin: '"', end: '"',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.PHRASAL_WORDS_MODE = {
	    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
	  };
	  hljs.COMMENT = function (begin, end, inherits) {
	    var mode = hljs.inherit(
	      {
	        className: 'comment',
	        begin: begin, end: end,
	        contains: []
	      },
	      inherits || {}
	    );
	    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
	    mode.contains.push({
	      className: 'doctag',
	      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
	      relevance: 0
	    });
	    return mode;
	  };
	  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
	  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
	  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
	  hljs.NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE,
	    relevance: 0
	  };
	  hljs.C_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.C_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.BINARY_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.BINARY_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.CSS_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE + '(' +
	      '%|em|ex|ch|rem'  +
	      '|vw|vh|vmin|vmax' +
	      '|cm|mm|in|pt|pc|px' +
	      '|deg|grad|rad|turn' +
	      '|s|ms' +
	      '|Hz|kHz' +
	      '|dpi|dpcm|dppx' +
	      ')?',
	    relevance: 0
	  };
	  hljs.REGEXP_MODE = {
	    className: 'regexp',
	    begin: /\//, end: /\/[gimuy]*/,
	    illegal: /\n/,
	    contains: [
	      hljs.BACKSLASH_ESCAPE,
	      {
	        begin: /\[/, end: /\]/,
	        relevance: 0,
	        contains: [hljs.BACKSLASH_ESCAPE]
	      }
	    ]
	  };
	  hljs.TITLE_MODE = {
	    className: 'title',
	    begin: hljs.IDENT_RE,
	    relevance: 0
	  };
	  hljs.UNDERSCORE_TITLE_MODE = {
	    className: 'title',
	    begin: hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };
	  hljs.METHOD_GUARD = {
	    // excludes method names from keyword processing
	    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };

	  return hljs;
	}));


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function(hljs) {
	  var RUBY_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?';
	  var RUBY_KEYWORDS = {
	    keyword:
	      'and then defined module in return redo if BEGIN retry end for self when ' +
	      'next until do begin unless END rescue else break undef not super class case ' +
	      'require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor',
	    literal:
	      'true false nil'
	  };
	  var YARDOCTAG = {
	    className: 'doctag',
	    begin: '@[A-Za-z]+'
	  };
	  var IRB_OBJECT = {
	    begin: '#<', end: '>'
	  };
	  var COMMENT_MODES = [
	    hljs.COMMENT(
	      '#',
	      '$',
	      {
	        contains: [YARDOCTAG]
	      }
	    ),
	    hljs.COMMENT(
	      '^\\=begin',
	      '^\\=end',
	      {
	        contains: [YARDOCTAG],
	        relevance: 10
	      }
	    ),
	    hljs.COMMENT('^__END__', '\\n$')
	  ];
	  var SUBST = {
	    className: 'subst',
	    begin: '#\\{', end: '}',
	    keywords: RUBY_KEYWORDS
	  };
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	    variants: [
	      {begin: /'/, end: /'/},
	      {begin: /"/, end: /"/},
	      {begin: /`/, end: /`/},
	      {begin: '%[qQwWx]?\\(', end: '\\)'},
	      {begin: '%[qQwWx]?\\[', end: '\\]'},
	      {begin: '%[qQwWx]?{', end: '}'},
	      {begin: '%[qQwWx]?<', end: '>'},
	      {begin: '%[qQwWx]?/', end: '/'},
	      {begin: '%[qQwWx]?%', end: '%'},
	      {begin: '%[qQwWx]?-', end: '-'},
	      {begin: '%[qQwWx]?\\|', end: '\\|'},
	      {
	        // \B in the beginning suppresses recognition of ?-sequences where ?
	        // is the last character of a preceding identifier, as in: `func?4`
	        begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/
	      },
	      {
	        begin: /<<(-?)\w+$/, end: /^\s*\w+$/,
	      }
	    ]
	  };
	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)', endsParent: true,
	    keywords: RUBY_KEYWORDS
	  };

	  var RUBY_DEFAULT_CONTAINS = [
	    STRING,
	    IRB_OBJECT,
	    {
	      className: 'class',
	      beginKeywords: 'class module', end: '$|;',
	      illegal: /=/,
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?'}),
	        {
	          begin: '<\\s*',
	          contains: [{
	            begin: '(' + hljs.IDENT_RE + '::)?' + hljs.IDENT_RE
	          }]
	        }
	      ].concat(COMMENT_MODES)
	    },
	    {
	      className: 'function',
	      beginKeywords: 'def', end: '$|;',
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {begin: RUBY_METHOD_RE}),
	        PARAMS
	      ].concat(COMMENT_MODES)
	    },
	    {
	      // swallow namespace qualifiers before symbols
	      begin: hljs.IDENT_RE + '::'
	    },
	    {
	      className: 'symbol',
	      begin: hljs.UNDERSCORE_IDENT_RE + '(\\!|\\?)?:',
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: ':(?!\\s)',
	      contains: [STRING, {begin: RUBY_METHOD_RE}],
	      relevance: 0
	    },
	    {
	      className: 'number',
	      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
	      relevance: 0
	    },
	    {
	      begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))' // variables
	    },
	    {
	      className: 'params',
	      begin: /\|/, end: /\|/,
	      keywords: RUBY_KEYWORDS
	    },
	    { // regexp container
	      begin: '(' + hljs.RE_STARTERS_RE + '|unless)\\s*',
	      keywords: 'unless',
	      contains: [
	        IRB_OBJECT,
	        {
	          className: 'regexp',
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	          illegal: /\n/,
	          variants: [
	            {begin: '/', end: '/[a-z]*'},
	            {begin: '%r{', end: '}[a-z]*'},
	            {begin: '%r\\(', end: '\\)[a-z]*'},
	            {begin: '%r!', end: '![a-z]*'},
	            {begin: '%r\\[', end: '\\][a-z]*'}
	          ]
	        }
	      ].concat(COMMENT_MODES),
	      relevance: 0
	    }
	  ].concat(COMMENT_MODES);

	  SUBST.contains = RUBY_DEFAULT_CONTAINS;
	  PARAMS.contains = RUBY_DEFAULT_CONTAINS;

	  var SIMPLE_PROMPT = "[>?]>";
	  var DEFAULT_PROMPT = "[\\w#]+\\(\\w+\\):\\d+:\\d+>";
	  var RVM_PROMPT = "(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>";

	  var IRB_DEFAULT = [
	    {
	      begin: /^\s*=>/,
	      starts: {
	        end: '$', contains: RUBY_DEFAULT_CONTAINS
	      }
	    },
	    {
	      className: 'meta',
	      begin: '^('+SIMPLE_PROMPT+"|"+DEFAULT_PROMPT+'|'+RVM_PROMPT+')',
	      starts: {
	        end: '$', contains: RUBY_DEFAULT_CONTAINS
	      }
	    }
	  ];

	  return {
	    aliases: ['rb', 'gemspec', 'podspec', 'thor', 'irb'],
	    keywords: RUBY_KEYWORDS,
	    illegal: /\/\*/,
	    contains: COMMENT_MODES.concat(IRB_DEFAULT).concat(RUBY_DEFAULT_CONTAINS)
	  };
	};

/***/ })
/******/ ]);