!function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(t){return e[t]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,r){"use strict";!function(){var t=function(e,t){var r=Element.prototype;return(r.matches||r.webkitMatchesSelector||r.mozMatchesSelector||r.msMatchesSelector||function(e){return-1!==[].indexOf.call(document.querySelectorAll(e),this)}).call(e,t)},r=function(e,t){var r={},n=null;for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);if(!t)return r;for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},n=function(e){var t=[],r=0;if(e instanceof Array)return e;if(!e.length)return t;for(r=0;r<e.length;r++)t.push(e[r]);return t},o=function(e){return"string"==typeof e?document.querySelector(e):e},i=function(e){return 0===Object.keys(e).length?"":Object.keys(e).reduce(function(t,r){return t.push(r+"="+encodeURIComponent(e[r])),t},[]).join("&")};e.exports={Browser:{isTouch:function(){return"undefined"!=typeof window&&"undefined"!=typeof navigator&&void 0!==window.orientation}},String:{isURL:function(e){return/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(e)},guid:function(e){return(e||"rmr-guid-")+parseInt(100*Math.random(),10)+"-"+parseInt(1e3*Math.random(),10)},localize:function(e,t){if("undefined"==typeof navigator)return t;var r=void 0,n=void 0;for(r in navigator.languages)if(navigator.languages.hasOwnProperty(r)&&(n=navigator.languages[r].toLowerCase(),e.hasOwnProperty(n)&&e[n].hasOwnProperty(t)))return e[n][t];for(r in navigator.languages)if(navigator.languages.hasOwnProperty(r)&&(n=navigator.languages[r].split("-")[0].toLowerCase(),e.hasOwnProperty(n)&&e[n].hasOwnProperty(t)))return e[n][t];return t}},Array:{coerce:n,last:function(e,t){for(var r=(e=n(e)).length-1;r>=0;){if(t?t(e[r]):e[r])return e[r];r--}return null}},Object:{merge:r,queryString:i},XHR:{request:function(e,t){if("undefined"==typeof XMLHttpRequest)return null;(e=r({form:null,url:"/",method:"get",params:null},e)).form&&(e.form=o(e.form),e.url=e.form.getAttribute("action"),e.method=e.form.getAttribute("method")?e.form.getAttribute("method"):"get",e.params=function(e){if(!(e=o(e)))return{};var t=e.querySelectorAll("select,input,textarea"),r={};for(var n in t)if(t.hasOwnProperty(n)){var i=t[n].getAttribute("name"),a=t[n].type?t[n].type:"text";t[n].hasAttribute("disabled")||("radio"===a||"checkbox"===a?t[n].checked&&(r[i]=t[n].value):r[i]=t[n].value)}return r}(e.form));var n=new XMLHttpRequest;n.onreadystatechange=function(){4===this.readyState&&t&&t(n)};var a=e.url;return"GET"===e.method.toUpperCase()&&e.params&&(a=a+"?"+i(e.params)),n.open(e.method,a,!0),n.send(),n}},Node:{ancestor:function(e,r,n){if(!(e=o(e)))return null;if(n&&t(e,r))return e;for(var i=e;i=i.parentNode;)if(t(i,r))return i;return null},matches:t,remove:function(e){return(e=o(e))?(e.parentNode.removeChild(e),!0):null},loader:function(){return'<svg version="1.1" class="rmr-loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.8s" repeatCount="indefinite"></animateTransform></path></svg>'},get:o,make:function(e,t){var r=document.createElement(e);for(var n in t)t.hasOwnProperty(n)&&t[n]&&r.setAttribute(n,t[n]);return r},getRect:function(e){var t=(e=o(e)).getBoundingClientRect(),r={top:t.top,left:t.left,bottom:t.bottom,right:t.right};return r.top+=window.pageYOffset,r.left+=window.pageXOffset,r.bottom+=window.pageYOffset,r.right+=window.pageYOffset,r.width=t.right-t.left,r.height=t.bottom-t.top,r},setStyles:function(e,t){if(!(e=o(e)))return!1;for(var r in t)t.hasOwnProperty(r)&&t[r]&&(e.style[r]=t[r]);return e}}}}()},function(e,t,r){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(){var t=r(0),o=t.String.guid,i=t.Object.merge,a=t.Array.coerce,s=t.Node.make,u=t.Node.getRect,d=function(e,t){var r=e.factory?e.factory(t):t.getAttribute(e.attribute),o=e.defaults;if("object"!==(void 0===r?"undefined":n(r)))try{"number"==typeof(r=JSON.parse(r))&&(r={content:r})}catch(e){r={content:r}}return i(o,r)},l=t.Node.setStyles,f=function(e,t,r){var n=u(t),o=u(e),i=e.querySelector(".arrow"),a=null,s=null;(s=[(a=[n.left+n.width/2-o.width/2,n.top-o.height-5-r.margin])[0],a[1]])[0]=o.width/2-5;var d=function(t,a){return(a=[(t=[n.left+n.width/2-o.width/2,n.top-o.height-5-r.margin])[0],t[1]])[0]=o.width/2-5,i.style.borderLeftColor="transparent",i.style.borderRightColor="transparent",t[1]-window.pageYOffset<0?(a[1]=-10,t[1]=n.bottom+5+r.margin,i.style.borderBottom="5px solid "+r.color,e.classList.add("bottom")):(a[1]=o.height,i.style.borderTopColor=r.color),t[0]<0?(t[0]=5,a[0]=n.left+n.width/2-10):t[0]<n.left&&(t[0]=n.left-5,a[0]=n.width/2),t[0]+o.width>window.innerWidth&&(t[0]=window.innerWidth-o.width-5,a[0]=o.width-n.width/2),[t,a]};if(r.position&&"side"===r.position){if(a[0]=n.left+n.width+5+r.margin,a[1]=n.top+n.height/2-o.height/2,i.style.borderRightColor=r.color,a[1]-window.pageYOffset<0?(a[1]=window.pageYOffset+r.margin,s[1]=5):s[1]=o.height/2-5,s[0]=-10,a[0]+o.width>window.innerWidth&&(a[0]=n.left-o.width-5-r.margin,e.classList.add("left"),s[0]=o.width,i.style.borderRightColor="transparent",i.style.borderLeftColor=r.color),a[0]<0){var f=d(a,s);a=f[0],s=f[1]}}else{var p=d(a,s);a=p[0],s=p[1]}l(e,{left:parseInt(a[0],10)+"px",top:parseInt(a[1],10)+"px",backgroundColor:r.color}),l(i,{left:parseInt(s[0],10)+"px",top:parseInt(s[1],10)+"px"})},p={},c={},h=function(e,r){var n=this,u={attribute:"data-popover",debug:!1,root:document.body,delay:{pop:200,unpop:300},factory:null},l=function(e,t){var r=e.target;p[r.getAttribute("id")]=window.setTimeout(function(){var e=r.getAttribute("id");r.removeAttribute("aria-describedBy");try{var t=c[e+"-popover"],o=d(n,r);t&&(n.debug||(n.events.unpop(r,t),o.destroy?(delete c[e+"-popover"],t.parentNode.removeChild(t)):t.classList.remove("pop")))}catch(e){n.debug&&window.console.log("ERROR",e)}},1===arguments.length?n.delay.unpop:t)},h=function(e){var t=e.target,r=t.getAttribute("id").replace("-popover","");t.addEventListener("mouseleave",function(){l({target:document.getElementById(r)})}),p[r]&&(window.clearTimeout(p[r]),delete p[r])},v=function(e,r){if(n.enabled){var o=e.target,i=d(n,o);i.class=(i.class?i.class:"")+("side"===i.position?" side":" top")+" rmr-popover"+(i.persist?" persist":""),i.id=o.getAttribute("id")+"-popover";var a=document.querySelector("#"+i.id);a||(a=s("div",{"data-target":o.getAttribute("id"),role:"tooltip",class:i.class,id:i.id}));n.debug&&window.console.log(i);var u=null;if(i.node&&((u=t.Node.get(i.node))||console.warn("Invalid reference node "+i.node+" for popover"),(u=u.cloneNode(!0)).removeAttribute("aria-hidden")),i.content||i.class||u||i.url){var l=function(e){if(a.parentNode||(a.innerHTML='<b class="arrow"></b><div class="bd">'+e+"</div>",window.document.body.appendChild(a)),u){var t=a.querySelector("div.bd");t.innerHTML="",t.appendChild(u)}o.setAttribute("aria-describedby",i.id),f(a,o,i),c[i.id]=a,window.setTimeout(function(){a&&(a.classList.add("pop"),c[a.getAttribute("id")]&&n.events.pop(o,a))},r||0),i.persist||a.addEventListener("mouseenter",h)};i.url&&!a.parentNode?t.XHR.request({url:i.url},function(e){200===e.status?l(e.responseText):n.debug&&window.console.error("Popover XHR request failed",i.url)}):l(i.content?i.content:"")}}},g=null,y=0,m=null,w=null,b=null,O=null;if((e=i(u,e)).hasOwnProperty("delay")?"number"==typeof e.delay&&(e.delay={pop:e.delay,unpop:e.delay}):e.delay=u.delay,e=i(u,e),this.defaults=i({color:"rgba(0,0,0,0.8)",margin:0,destroy:!0,class:""},r),this.events={pop:function(){},unpop:function(){}},this.enabled=!0,this.attribute=e.attribute,this.delay=e.delay,this.destroy=e.destroy,this.factory=e.factory,this.debug=e.debug,this.listeners={},!(w=e.root?e.root instanceof Element?e.root:document.querySelector(e.root):document.body))throw Error("Invalid Popover root ["+e.root+"]");for(this.root=w,g=a(w.querySelectorAll("["+this.attribute+"]")),w.hasAttribute(this.attribute)&&g.push(w),y=0;y<g.length;y++)(m=g[y]).getAttribute("id")||m.setAttribute("id",o("popover-target")),m.hasAttribute("title")&&m.setAttribute("title",""),b={on:function(e){"click"===e.type&&e.preventDefault(),v(e,n.delay.pop)},off:function(e){l(e,n.delay.unpop)}},O=d(this,m),this.listeners[m.getAttribute("id")]={pop:b.on,unpop:b.off},O.persist?b.on({target:m}):(O.events&&O.events.pop?m.addEventListener(O.events.pop,b.on):(m.addEventListener("touchstart",b.on),m.addEventListener("mouseenter",b.on)),O.events&&O.events.unpop?m.addEventListener(O.events.unpop,b.off):(m.addEventListener("touchend",b.off),m.addEventListener("mouseleave",b.off)));this.windowResizer=function(){var e=null,t=0,r=a(document.querySelectorAll(".rmr-popover.persist"));for(t=0;t<r.length;t++)e=document.getElementById(r[t].getAttribute("data-target")),f(r[t],e,d(this,e))},window.addEventListener("resize",function(){n.windowResizer()}),window.setTimeout(function(){n.windowResizer()},0),this.set=function(e,t){if(!this.defaults.hasOwnProperty(e))throw new Error("Invalid key ",e);this.defaults[e]=t},this.destroy=function(){var e=void 0,t=void 0,r=void 0;for(r in this.listeners)this.listeners.hasOwnProperty(r)&&(e=document.getElementById(r))&&((t=d(this,e)).events&&t.events.pop?e.removeEventListener(t.events.pop,this.listeners[r].pop):(e.removeEventListener("mouseenter",this.listeners[r].pop),e.removeEventListener("touchstart",this.listeners[r].pop)),t.events&&t.events.unpop?e.removeEventListener(t.events.unpop,this.listeners[r].unpop):(e.removeEventListener("mouseleave",this.listeners[r].unpop),e.removeEventListener("touchend",this.listeners[r].unpop)),l({target:e},0));return window.removeEventListener("resize",this.windowResizer),this},this.debug&&window.console.log(this.toString()),this.windowResizer()};h.prototype.on=function(e,t){return this.events[e]=t,this},h.prototype.toString=function(){return"Popover "+JSON.stringify({root:""+this.root,enabled:this.enabled,delay:this.delay,debug:this.debug})},e.exports=h}()},function(e,t,r){"use strict";window.Popover=r(1)}]);