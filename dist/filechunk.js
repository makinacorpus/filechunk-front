(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=20)})([function(a){var b=a.exports='undefined'!=typeof window&&window.Math==Math?window:'undefined'!=typeof self&&self.Math==Math?self:Function('return this')();'number'==typeof __g&&(__g=b)},function(a,b,c){var d=c(23)('wks'),e=c(11),f=c(0).Symbol,g='function'==typeof f,h=a.exports=function(a){return d[a]||(d[a]=g&&f[a]||(g?f:e)('Symbol.'+a))};h.store=d},function(a,b,c){var d=c(3);a.exports=function(a){if(!d(a))throw TypeError(a+' is not an object!');return a}},function(a){a.exports=function(a){return'object'==typeof a?null!==a:'function'==typeof a}},function(a,b,c){var d=c(5);a.exports=function(e,f,a){return(d(e),void 0===f)?e:1===a?function(b){return e.call(f,b)}:2===a?function(c,a){return e.call(f,c,a)}:3===a?function(d,a,b){return e.call(f,d,a,b)}:function(){return e.apply(f,arguments)}}},function(a){a.exports=function(a){if('function'!=typeof a)throw TypeError(a+' is not a function!');return a}},function(a){var b=a.exports={version:'2.5.1'};'number'==typeof __e&&(__e=b)},function(a,b,c){a.exports=!c(13)(function(){return 7!=Object.defineProperty({},'a',{get:function(){return 7}}).a})},function(a){var b={}.toString;a.exports=function(a){return b.call(a).slice(8,-1)}},function(a,b,c){var d=c(2),e=c(25),f=c(26),g=Object.defineProperty;b.f=c(7)?Object.defineProperty:function(a,b,c){if(d(a),b=f(b,!0),d(c),e)try{return g(a,b,c)}catch(a){}if('get'in c||'set'in c)throw TypeError('Accessors not supported!');return'value'in c&&(a[b]=c.value),a}},function(a,b,c){var d=c(8),e=c(1)('toStringTag'),f='Arguments'==d(function(){return arguments}()),g=function(a,b){try{return a[b]}catch(a){}};a.exports=function(a){var b,c,h;return a===void 0?'Undefined':null===a?'Null':'string'==typeof(c=g(b=Object(a),e))?c:f?d(b):'Object'==(h=d(b))&&'function'==typeof b.callee?'Arguments':h}},function(a){var b=0,c=Math.random();a.exports=function(a){return'Symbol('.concat(a===void 0?'':a,')_',(++b+c).toString(36))}},function(a,b,c){var d=c(9),e=c(27);a.exports=c(7)?function(a,b,c){return d.f(a,b,e(1,c))}:function(a,b,c){return a[b]=c,a}},function(a){a.exports=function(a){try{return!!a()}catch(a){return!0}}},function(a,b,c){var d=c(3),e=c(0).document,f=d(e)&&d(e.createElement);a.exports=function(a){return f?e.createElement(a):{}}},function(a,b,c){var d=c(0),e=c(12),f=c(16),g=c(11)('src'),h='toString',i=Function[h],j=(''+i).split(h);c(6).inspectSource=function(a){return i.call(a)},(a.exports=function(a,b,c,h){var i='function'==typeof c;i&&(f(c,'name')||e(c,'name',b));a[b]===c||(i&&(f(c,g)||e(c,g,a[b]?''+a[b]:j.join(b+''))),a===d?a[b]=c:h?a[b]?a[b]=c:e(a,b,c):(delete a[b],e(a,b,c)))})(Function.prototype,h,function(){return'function'==typeof this&&this[g]||i.call(this)})},function(a){var b={}.hasOwnProperty;a.exports=function(a,c){return b.call(a,c)}},function(a){a.exports={}},function(a,b,c){var d,e,f,g=c(4),h=c(36),i=c(37),j=c(14),k=c(0),l=k.process,m=k.setImmediate,n=k.clearImmediate,o=k.MessageChannel,p=k.Dispatch,q=0,r={},s='onreadystatechange',t=function(){var a=+this;if(r.hasOwnProperty(a)){var b=r[a];delete r[a],b()}},u=function(a){t.call(a.data)};m&&n||(m=function(a){for(var b=[],c=1;arguments.length>c;)b.push(arguments[c++]);return r[++q]=function(){h('function'==typeof a?a:Function(a),b)},d(q),q},n=function(a){delete r[a]},'process'==c(8)(l)?d=function(a){l.nextTick(g(t,a,1))}:p&&p.now?d=function(a){p.now(g(t,a,1))}:o?(e=new o,f=e.port2,e.port1.onmessage=u,d=g(f.postMessage,f,1)):k.addEventListener&&'function'==typeof postMessage&&!k.importScripts?(d=function(a){k.postMessage(a+'','*')},k.addEventListener('message',u,!1)):s in j('script')?d=function(a){i.appendChild(j('script'))[s]=function(){i.removeChild(this),t.call(a)}}:d=function(a){setTimeout(g(t,a,1),0)}),a.exports={set:m,clear:n}},function(a,b,c){'use strict';function d(a){var b,c;this.promise=new a(function(a,d){if(b!=void 0||c!=void 0)throw TypeError('Bad Promise constructor');b=a,c=d}),this.resolve=e(b),this.reject=e(c)}var e=c(5);a.exports.f=function(a){return new d(a)}},function(a,b,c){c(21),a.exports=c(45)},function(a,b,c){'use strict';var d,e,f,g,h=c(22),i=c(0),j=c(4),k=c(10),l=c(24),m=c(3),n=c(5),o=c(28),p=c(29),q=c(35),r=c(18).set,s=c(38)(),t=c(19),u=c(39),v=c(40),w='Promise',x=i.TypeError,y=i.process,z=i[w],A='process'==k(y),B=function(){},D=e=t.f,C=!!function(){try{var a=z.resolve(1),b=(a.constructor={})[c(1)('species')]=function(a){a(B,B)};return(A||'function'==typeof PromiseRejectionEvent)&&a.then(B)instanceof b}catch(a){}}(),E=function(a){var b;return m(a)&&'function'==typeof(b=a.then)&&b},F=function(a,b){if(!a._n){a._n=!0;var c=a._c;s(function(){for(var d=a._v,e=1==a._s,f=0,g=function(b){var c,f,g=e?b.ok:b.fail,h=b.resolve,i=b.reject,j=b.domain;try{g?(!e&&(2==a._h&&I(a),a._h=1),!0===g?c=d:(j&&j.enter(),c=g(d),j&&j.exit()),c===b.promise?i(x('Promise-chain cycle')):(f=E(c))?f.call(c,h,i):h(c)):i(d)}catch(a){i(a)}};c.length>f;)g(c[f++]);a._c=[],a._n=!1,b&&!a._h&&G(a)})}},G=function(a){r.call(i,function(){var b,c,d,e=a._v,f=H(a);if(f&&(b=u(function(){A?y.emit('unhandledRejection',e,a):(c=i.onunhandledrejection)?c({promise:a,reason:e}):(d=i.console)&&d.error&&d.error('Unhandled promise rejection',e)}),a._h=A||H(a)?2:1),a._a=void 0,f&&b.e)throw b.v})},H=function(a){if(1==a._h)return!1;for(var b,c=a._a||a._c,d=0;c.length>d;)if(b=c[d++],b.fail||!H(b.promise))return!1;return!0},I=function(a){r.call(i,function(){var b;A?y.emit('rejectionHandled',a):(b=i.onrejectionhandled)&&b({promise:a,reason:a._v})})},J=function(a){var b=this;b._d||(b._d=!0,b=b._w||b,b._v=a,b._s=2,!b._a&&(b._a=b._c.slice()),F(b,!0))},K=function(a){var b,c=this;if(!c._d){c._d=!0,c=c._w||c;try{if(c===a)throw x('Promise can\'t be resolved itself');(b=E(a))?s(function(){var d={_w:c,_d:!1};try{b.call(a,j(K,d,1),j(J,d,1))}catch(a){J.call(d,a)}}):(c._v=a,c._s=1,F(c,!1))}catch(a){J.call({_w:c,_d:!1},a)}}};C||(z=function(a){o(this,z,w,'_h'),n(a),d.call(this);try{a(j(K,this,1),j(J,this,1))}catch(a){J.call(this,a)}},d=function(){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},d.prototype=c(41)(z.prototype,{then:function(a,b){var c=D(q(this,z));return c.ok='function'!=typeof a||a,c.fail='function'==typeof b&&b,c.domain=A?y.domain:void 0,this._c.push(c),this._a&&this._a.push(c),this._s&&F(this,!1),c.promise},catch:function(a){return this.then(void 0,a)}}),f=function(){var a=new d;this.promise=a,this.resolve=j(K,a,1),this.reject=j(J,a,1)},t.f=D=function(a){return a===z||a===g?new f(a):e(a)}),l(l.G+l.W+l.F*!C,{Promise:z}),c(42)(z,w),c(43)(w),g=c(6)[w],l(l.S+l.F*!C,w,{reject:function(a){var b=D(this),c=b.reject;return c(a),b.promise}}),l(l.S+l.F*(h||!C),w,{resolve:function(a){return v(h&&this===g?z:this,a)}}),l(l.S+l.F*!(C&&c(44)(function(a){z.all(a)['catch'](B)})),w,{all:function(a){var b=this,c=D(b),d=c.resolve,e=c.reject,f=u(function(){var c=[],f=0,g=1;p(a,!1,function(a){var h=f++,i=!1;c.push(void 0),g++,b.resolve(a).then(function(a){i||(i=!0,c[h]=a,--g||d(c))},e)}),--g||d(c)});return f.e&&e(f.v),c.promise},race:function(a){var b=this,c=D(b),d=c.reject,e=u(function(){p(a,!1,function(a){b.resolve(a).then(c.resolve,d)})});return e.e&&d(e.v),c.promise}})},function(a){a.exports=!1},function(a,b,c){var d=c(0),e='__core-js_shared__',f=d[e]||(d[e]={});a.exports=function(a){return f[a]||(f[a]={})}},function(a,b,c){var d=c(0),e=c(6),f=c(12),g=c(15),h=c(4),i='prototype',j=function(a,b,c){var k,l,m,n,o=a&j.F,p=a&j.G,q=a&j.S,r=a&j.P,s=a&j.B,t=p?d:q?d[b]||(d[b]={}):(d[b]||{})[i],u=p?e:e[b]||(e[b]={}),v=u[i]||(u[i]={});for(k in p&&(c=b),c)l=!o&&t&&void 0!==t[k],m=(l?t:c)[k],n=s&&l?h(m,d):r&&'function'==typeof m?h(Function.call,m):m,t&&g(t,k,m,a&j.U),u[k]!=m&&f(u,k,n),r&&v[k]!=m&&(v[k]=m)};d.core=e,j.F=1,j.G=2,j.S=4,j.P=8,j.B=16,j.W=32,j.U=64,j.R=128,a.exports=j},function(a,b,c){a.exports=!c(7)&&!c(13)(function(){return 7!=Object.defineProperty(c(14)('div'),'a',{get:function(){return 7}}).a})},function(a,b,c){var d=c(3);a.exports=function(a,b){if(!d(a))return a;var c,e;if(b&&'function'==typeof(c=a.toString)&&!d(e=c.call(a)))return e;if('function'==typeof(c=a.valueOf)&&!d(e=c.call(a)))return e;if(!b&&'function'==typeof(c=a.toString)&&!d(e=c.call(a)))return e;throw TypeError('Can\'t convert object to primitive value')}},function(a){a.exports=function(a,b){return{enumerable:!(1&a),configurable:!(2&a),writable:!(4&a),value:b}}},function(a){a.exports=function(a,b,c,d){if(!(a instanceof b)||d!==void 0&&d in a)throw TypeError(c+': incorrect invocation!');return a}},function(a,b,c){var d=c(4),e=c(30),g=c(31),h=c(2),i=c(32),j=c(34),k={},l={},b=a.exports=function(a,b,c,m,n){var o,p,q,r,s=n?function(){return a}:j(a),t=d(c,m,b?2:1),f=0;if('function'!=typeof s)throw TypeError(a+' is not iterable!');if(g(s)){for(o=i(a.length);o>f;f++)if(r=b?t(h(p=a[f])[0],p[1]):t(a[f]),r===k||r===l)return r;}else for(q=s.call(a);!(p=q.next()).done;)if(r=e(q,t,p.value,b),r===k||r===l)return r};b.BREAK=k,b.RETURN=l},function(a,b,c){var d=c(2);a.exports=function(a,b,c,e){try{return e?b(d(c)[0],c[1]):b(c)}catch(b){var f=a['return'];throw void 0!==f&&d(f.call(a)),b}}},function(a,b,c){var d=c(17),e=c(1)('iterator'),f=Array.prototype;a.exports=function(a){return a!==void 0&&(d.Array===a||f[e]===a)}},function(a,b,c){var d=c(33),e=Math.min;a.exports=function(a){return 0<a?e(d(a),9007199254740991):0}},function(a){var b=Math.ceil,c=Math.floor;a.exports=function(a){return isNaN(a=+a)?0:(0<a?c:b)(a)}},function(a,b,c){var d=c(10),e=c(1)('iterator'),f=c(17);a.exports=c(6).getIteratorMethod=function(a){if(a!=void 0)return a[e]||a['@@iterator']||f[d(a)]}},function(a,b,c){var d=c(2),e=c(5),f=c(1)('species');a.exports=function(a,b){var c,g=d(a).constructor;return g===void 0||(c=d(g)[f])==void 0?b:e(c)}},function(a){a.exports=function(a,b,c){var d=c===void 0;switch(b.length){case 0:return d?a():a.call(c);case 1:return d?a(b[0]):a.call(c,b[0]);case 2:return d?a(b[0],b[1]):a.call(c,b[0],b[1]);case 3:return d?a(b[0],b[1],b[2]):a.call(c,b[0],b[1],b[2]);case 4:return d?a(b[0],b[1],b[2],b[3]):a.call(c,b[0],b[1],b[2],b[3]);}return a.apply(c,b)}},function(a,b,c){var d=c(0).document;a.exports=d&&d.documentElement},function(a,b,c){var d=c(0),e=c(18).set,f=d.MutationObserver||d.WebKitMutationObserver,g=d.process,h=d.Promise,i='process'==c(8)(g);a.exports=function(){var a,b,c,j=function(){var d,e;for(i&&(d=g.domain)&&d.exit();a;){e=a.fn,a=a.next;try{e()}catch(d){throw a?c():b=void 0,d}}b=void 0,d&&d.enter()};if(i)c=function(){g.nextTick(j)};else if(f){var k=!0,l=document.createTextNode('');new f(j).observe(l,{characterData:!0}),c=function(){l.data=k=!k}}else if(h&&h.resolve){var m=h.resolve();c=function(){m.then(j)}}else c=function(){e.call(d,j)};return function(d){var e={fn:d,next:void 0};b&&(b.next=e),a||(a=e,c()),b=e}}},function(a){a.exports=function(a){try{return{e:!1,v:a()}}catch(a){return{e:!0,v:a}}}},function(a,b,c){var d=c(2),e=c(3),f=c(19);a.exports=function(a,b){if(d(a),e(b)&&b.constructor===a)return b;var c=f.f(a),g=c.resolve;return g(b),c.promise}},function(a,b,c){var d=c(15);a.exports=function(a,b,c){for(var e in b)d(a,e,b[e],c);return a}},function(a,b,c){var d=c(9).f,e=c(16),f=c(1)('toStringTag');a.exports=function(a,b,c){a&&!e(a=c?a:a.prototype,f)&&d(a,f,{configurable:!0,value:b})}},function(a,b,c){'use strict';var d=c(0),e=c(9),f=c(7),g=c(1)('species');a.exports=function(a){var b=d[a];f&&b&&!b[g]&&e.f(b,g,{configurable:!0,get:function(){return this}})}},function(a,b,c){var d=c(1)('iterator'),e=!1;try{var f=[7][d]();f['return']=function(){e=!0},Array.from(f,function(){throw 2})}catch(a){}a.exports=function(a,b){if(!b&&!e)return!1;var c=!1;try{var f=[7],g=f[d]();g.next=function(){return{done:c=!0}},f[d]=function(){return g},a(f)}catch(a){}return c}},function(a,b,c){'use strict';c(46),c(47)},function(){},function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0}),c(48);var d=c(49);Drupal.behaviors.filechunk={attach:function(a){for(var b,c=0,e=a.querySelectorAll('.filechunk-widget-table');c<e.length;c++)b=e[c],new d.FilechunkWidget(b,Drupal.t)}}},function(){'use strict'},function(a,b){'use strict';function c(){var a=window.navigator.userAgent,b=a.indexOf('MSIE ');if(0<b)return parseInt(a.substring(b+5,a.indexOf('.',b)),10);var c=a.indexOf('Trident/');if(0<c){var d=a.indexOf('rv:');return parseInt(a.substring(d+3,a.indexOf('.',d)),10)}return null}function d(a,b){if('number'!=typeof a)if('string'!=typeof a)throw'Invalid argument, number is not a number';else if(a=parseInt(a,10),isNaN(a))throw'Invalid argument, number is not a number';if(b&&a<b)throw'Invalid argument, number must be over '+b;return a}var e='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};Object.defineProperty(b,'__esModule',{value:!0});var f=function(){return function(a,b,c){this.id=a,this.filename=b,this.hash=c||null,this.preview=c||null}}(),g=function(){return function(a){if(this.removeButtonTemplate='<button class="filechunk-remove btn btn-primary" type="submit" value="Remove">\' + Drupal.t( "Remove" ) + \'</button>',this.itemPreviewTemplate='<li data-fid="FID"></li>','file'!==a.type)throw'Input widget is not a file input';if(!a.hasAttribute('data-token'))throw'Input widget has no token set, file upload is not possible';if(!a.hasAttribute('data-uri-upload'))throw'Input widget has no upload url set, file upload is not possible';if(!a.hasAttribute('data-uri-remove'))throw'Input widget has no remove url set, file upload is not possible';this.token=a.getAttribute('data-token'),this.isMultiple=a.multiple,this.chunksize=d(a.getAttribute('data-chunksize')||2097152),this.maxCount=this.isMultiple?d(a.getAttribute('data-max-count'))||1:1,this.uploadUrl=a.getAttribute('data-uri-upload'),this.removeUrl=a.getAttribute('data-uri-remove'),this.removeButtonTemplate=a.getAttribute('data-tpl-remove')||'<button class="filechunk-remove btn btn-primary" type="submit" value="LABEL">LABEL</button>',this.itemPreviewTemplate=a.getAttribute('data-tpl-item')||'<li data-fid="FID"></li>'}}(),h=function(){function a(a,b){var d=this;if(this.currentValue=[],!FileReader)throw'Your browser is too old, file upload is not supported';if(!a.parentElement)throw'What?';a=a.parentElement;var h=a.querySelector('input[type=file]');if(!(h instanceof HTMLInputElement))throw'Could not find the input[type=file] element';var i=a.querySelector('input[rel=fid]');if(!(i instanceof HTMLInputElement))throw'Could not find the input[type=file] element';var j=a.querySelector('.filechunk-widget-drop');if(!(j instanceof HTMLElement))throw'Could not find the drop zone';var k=a.querySelector('.preview-thumbnail');k||(k=document.createElement('ul'),k.classList.add('preview-container'),a.appendChild(k)),this.config=new g(h),this.isMSIE=null!==c(),this.translateCallback=b,this.wrapper=a,this.dropZone=j,this.inputElement=h,this.previewContainer=k,this.valueElement=i,this.errorElement=this.createElementFromString('<div class="messages error file-upload-js-error" aria-live="polite" style="display: none;"></div>'),this.dropZone.insertBefore(this.errorElement,this.dropZone.firstChild),this.progressBar=this.createElementFromString('<div class="progressbar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style="display: none;"></div>'),this.wrapper.insertBefore(this.progressBar,this.valueElement),this.inputElement.style.opacity='0',this.inputElement.style.position='absolute',this.inputElement.style.top='0',this.inputElement.style.left='0',this.inputElement.style.bottom='0',this.inputElement.style.right='0',this.inputElement.required=!1;try{var l=JSON.parse(this.valueElement.value);for(var m in l){var n=l[m];'object'===('undefined'==typeof n?'undefined':e(n))&&this.currentValue.push(new f(m,n.filename,n.hash,n.preview))}}catch(a){console.log(a),this.showError(this.translate('Invalid default value'))}this.refresh(),this.inputElement.addEventListener('change',function(a){return d.onUploadChangeListener(a)}),this.inputElement.addEventListener('drop',function(a){return d.onUploadChangeListener(a)})}return a.prototype.createElementFromString=function(a){var b=document.createElement('div');if(b.innerHTML=a,!b.firstElementChild)throw'Invalid HTML input given, could not create element';return b.firstElementChild},a.prototype.translate=function(a,b){if(this.translateCallback)return this.translateCallback(a,b);var c=a;for(var d in b)c.replace(d,b[d]);return c},a.prototype.showError=function(a){this.errorElement.innerHTML=a,this.errorElement.style.display='block'},a.prototype.clearError=function(){this.errorElement.style.display='none',this.errorElement.innerHTML=''},a.prototype.refresh=function(){var a=this,b={};this.previewContainer.innerHTML='';for(var c,d=function(c){var d=e.config.itemPreviewTemplate.replace('FID',c.id),f=e.createElementFromString(d);f.innerHTML=c.filename||c.hash||c.id;var g=e.config.removeButtonTemplate.replace('LABEL',e.translate('Remove')),h=e.createElementFromString(g);h.addEventListener('click',function(b){b.stopPropagation(),b.preventDefault(),a.remoteRemoveCall(c.id).then(function(){for(var b=0;b<a.currentValue.length;++b)a.currentValue[b].id==c.id&&a.currentValue.splice(b,1);a.refresh()}).catch(function(b){a.showError(b),a.refresh()})}),b[c.id]={filename:c.filename,hash:c.hash},f.appendChild(h),e.previewContainer.appendChild(f)},e=this,f=0,g=this.currentValue;f<g.length;f++)c=g[f],d(c);this.valueElement.value=JSON.stringify(b)},a.prototype.updateProgress=function(a,b){var c=a.toString();this.progressBar.style.display='block',b=b||c+'%',this.progressBar.style.width=c+'%',this.progressBar.innerHTML=b,this.progressBar.setAttribute('aria-valuenow',a.toString())},a.prototype.remoteRemoveCall=function(a){var b=this;return new Promise(function(c){var d=new XMLHttpRequest;d.open('POST',b.config.removeUrl),d.setRequestHeader('X-Requested-With','XMLHttpRequest'),d.setRequestHeader('Accept','application/json'),d.setRequestHeader('X-File-Id',a),d.setRequestHeader('X-File-Token',b.config.token),d.overrideMimeType&&d.overrideMimeType('application/octet-stream'),d.addEventListener('load',function(){c()}),d.addEventListener('error',function(){throw d.status+': '+d.statusText+': '+d.responseText}),d.send()})},a.prototype.remoteUploadCall=function(a,b,c){var d=this,e=Math.min(b+c,a.size);return new Promise(function(g,h){var i=new XMLHttpRequest;i.open('POST',d.config.uploadUrl),i.setRequestHeader('X-Requested-With','XMLHttpRequest'),i.setRequestHeader('Accept','application/json'),i.setRequestHeader('X-File-Name',btoa(encodeURIComponent(a.name))),i.setRequestHeader('Content-Range','bytes '+b+'-'+e+'/'+a.size),i.setRequestHeader('Content-type','application/octet-stream'),i.setRequestHeader('X-File-Token',d.config.token),i.overrideMimeType&&i.overrideMimeType('application/octet-stream'),i.addEventListener('loadend',function(){try{var b=JSON.parse(i.responseText);if(200!==i.status)throw b.message||'error: '+i.status+' '+i.statusText;else if(a.size<=e||b.finished){if(!b.fid||!b.hash)throw d.translate('File could not be completely uploaded');d.updateProgress(100),g(new f(b.fid,a.name,b.hash,b.preview))}else d.updateProgress(Math.round(100*(b.offset/a.size))),b.resume&&b.offset?g(d.remoteUploadCall(a,b.offset,c)):g(d.remoteUploadCall(a,e,c))}catch(a){h(a)}}),i.send(a.slice(b,e))})},a.prototype.replaceUpload=function(){var a=this;if(this.isMSIE){var b=this.inputElement.cloneNode(!1);this.inputElement.parentElement.replaceChild(this.inputElement,b),this.inputElement=b,this.inputElement.addEventListener('change',function(b){return a.onUploadChangeListener(b)}),this.inputElement.addEventListener('drop',function(b){return a.onUploadChangeListener(b)})}else this.inputElement.value='';this.progressBar.setAttribute('aria-valuenow','0'),this.progressBar.style.display='none',this.refresh()},a.prototype.onUploadChangeListener=function(){var a=this,b=this.inputElement.files;if(!b||!b.length)return void this.replaceUpload();if(this.config.maxCount&&Object.keys(this.currentValue).length+b.length>this.config.maxCount)return this.showError(this.translate('A maximum of @count elements is allowed',{"@count":this.config.maxCount})),void this.replaceUpload();this.updateProgress(0);for(var c,d=0;d<b.length;++d)c=b[d],this.showError(this.translate('Uploading file @file...',{"@file":c.name})),this.remoteUploadCall(c,0,this.config.chunksize).then(function(b){a.currentValue.push(b),a.clearError(),a.replaceUpload()}).catch(function(b){a.showError(b),console.log(b),a.replaceUpload()})},a}();b.FilechunkWidget=h}]);