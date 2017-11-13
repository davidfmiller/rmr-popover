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
/***/ function(module, exports, __webpack_require__) {

	/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
	/* global document,window,Element,module,require */

	(function() {

	  "use strict";

	  window.Popover = __webpack_require__(1);

	}());

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
	/* global document,window,Element,module */

	(function() {

	  'use strict';

	  // prevent duplicate declaration
	//  if (window.Popover) { return; }

	  var

	  // VERSION = '0.1.9',

	  // default attribute on target nodes that will be inspected for popover data
	  ATTR = 'data-popover',

	  // default background color for popovers
	  COLOR = 'rgba(0,0,0,0.8)',

	  // offset of popover from target node
	  MARGIN = 0,

	  /*
	   * Generate a unique string suitable for id attributes
	   *
	   * @param basename (String)
	   * @return string
	   */
	  guid = function(basename) {
	    return basename + '-' + parseInt(Math.random() * 100, 10) + '-' + parseInt(Math.random() * 1000, 10);
	  },

	  /*
	   * Merge two objects into one, values in b take precedence over values in a
	   *
	   * @param a {Object}
	   * @param b {Object}

	   * @return Object
	   */
	  merge = function(a, b) {
	    var o = {};
	    for (var i in a) {
	      if (a.hasOwnProperty(i)) {
	        o[i] = a[i];
	      }
	    }
	    if (! b) { return o; }
	    for (i in b) {
	      if (b.hasOwnProperty(i)) {
	        o[i] = b[i];
	      }
	    }
	    return o;
	  },

	  /*
	   * Convert an array-like thing (ex: NodeList or arguments object) into a proper array
	   *
	   * @param list (array-like thing)
	   * @return Array
	   */
	  arr = function(list) {
	    var ret = [], i = 0;

	    if (! list.length) { return ret; }

	    for (i = 0; i < list.length; i++) {
	      ret.push(list[i]);
	    }

	    return ret;
	  },

	  /*
	   * Create an element with a set of attributes/values
	   *
	   * @param type (String)
	   * @param attrs {Object}
	   *
	   * @return HTMLElement
	   */
	  makeElement = function(type, attrs) {
	     var
	     n = document.createElement(type),
	     i = null;

	     for (i in attrs) {
	       if (attrs.hasOwnProperty(i)) {
	         n.setAttribute(i, attrs[i]);
	       }
	     }
	     return n;
	  },

	  /*
	   * Retrieve an object containing { top : xx, left : xx, bottom: xx, right: xx, width: xx, height: xx }
	   *
	   * @param node (DOMNode)
	   */
	  getRect = function(node) {

	    var
	    rect = node.getBoundingClientRect(),
	    ret = { top : rect.top, left : rect.left, bottom: rect.bottom, right : rect.right }; // create a new object that is not read-only

	    ret.top += window.pageYOffset;
	    ret.left += window.pageXOffset;

	    ret.bottom += window.pageYOffset;
	    ret.right += window.pageYOffset;

	    ret.width = rect.right - rect.left;
	    ret.height = rect.bottom - rect.top;

	    return ret;
	  },

	  /*
	   * Retrieve object containing popover data for an element on the page
	   *
	   * @param scope {Popover}
	   * @param node {
	   * @return {Object}
	   */
	  getDataForNode = function(scope, node) {

	    var
	    val = scope.factory ? scope.factory(node) : node.getAttribute(scope.attribute),
	    data = scope.defaults;

	    if (typeof val !== "object") {
	      try {
	        val = JSON.parse(val);

	        if (typeof val === 'number') {
	          val = { content : val };
	        }

	      } catch (err) {
	        val = { content : val };
	      }
	    }

	    return merge(data, val);
	  },


	  /*
	   *
	   * @param node {HTMLElement}
	   * @param styles {Object}
	   */
	  setStyles  = function(node, styles) {
	    for (var i in styles) {
	      if (styles.hasOwnProperty(i)) {
	        node.style[i] = styles[i];
	      }
	    }
	  },

	  /*
	   * Position a popover relative to its target parent
	   *
	   * @param popover {HTMLElement} - the
	   * @param target {HTMLElement}
	   * @param data {Object} - object containing data for the popover
	   */
	  positionPopover = function(popover, target, data) {

	    var
	    targetRect = getRect(target),
	    popoverRect = getRect(popover),
	    popoverXY,
	    arrowXY,
	    arrow = popover.querySelector('.arrow');

	    popoverXY = [
	      targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2),
	      targetRect.top - popoverRect.height - 5 - data.margin
	    ];

	    arrowXY = [popoverXY[0], popoverXY[1]];
	    arrowXY[0] = popoverRect.width / 2 - 5;

	    if (! data.position || data.position !== "side") { // top of target

	      if (popoverXY[1] - window.pageYOffset < 0) { // clipped at top of browser?
	        arrowXY[1] = -10;
	        popoverXY[1] = targetRect.bottom + 5 + data.margin;

	        arrow.style.borderBottom = '5px solid ' + data.color;
	        popover.classList.add('bottom');

	      } else { // top
	        arrowXY[1] = popoverRect.height;
	        arrow.style.borderTopColor = data.color;
	      }

	      if (popoverXY[0] < 0) { // are we clipped on the left of the browser window ?
	        popoverXY[0] = 5;
	        arrowXY[0] = targetRect.left + targetRect.width / 2 - 10;
	      } else if (popoverXY[0] < targetRect.left) { // is the popover further left than the target?
	        popoverXY[0] = targetRect.left - 5;
	        arrowXY[0] = targetRect.width / 2;
	      }

	      if (popoverXY[0] + popoverRect.width > window.innerWidth ) { // are we clipped on the right side of the browser window?
	        popoverXY[0] = window.innerWidth - popoverRect.width - 5;
	        arrowXY[0] = popoverRect.width - targetRect.width / 2;
	      }

	    } else { // right-side of target

	      popoverXY[0] = targetRect.left + targetRect.width + 5 + data.margin;
	      popoverXY[1] = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;

	      arrow.style.borderRightColor = data.color;

	      if (popoverXY[1] - window.pageYOffset < 0) {
	        popoverXY[1] = window.pageYOffset + data.margin;
	        arrowXY[1] = 5;
	      } else {
	        arrowXY[1] = popoverRect.height / 2 - 5;
	      }

	      arrowXY[0] = -10;


	      if (popoverXY[0] + popoverRect.width > window.innerWidth) { // if clipped on right side, move to the left
	        popoverXY[0] = targetRect.left - popoverRect.width - 5 - data.margin;
	        popover.classList.add('left');
	        arrowXY[0] = popoverRect.width;

	        arrow.style.borderRightColor = 'transparent';
	        arrow.style.borderLeftColor = data.color;
	      }
	    }

	    setStyles(popover, { "left" : parseInt(popoverXY[0], 10) + 'px', top : parseInt(popoverXY[1], 10) + 'px', backgroundColor : data.color });
	    setStyles(arrow, { "left" : parseInt(arrowXY[0], 10) + 'px', top : parseInt(arrowXY[1], 10) + 'px' });
	  },
	  timeouts = {}, // store window.setTimeout handles for popover hiding
	  pops = {};     // store popover HTMLElements keyed by their id attribute

	  /**
	   *
	   *
	   * @param node (node, optional) - the root element containing all elements with attached popovers
	   * @param options (Object, optional) method to retrieve the popover's data for a given node
	   */
	  var Popover = function(config, defaults) {

	    var
	    $ = this,
	    nodes,
	    i = 0,
	    n,
	    node,
	    on,
	    l,
	    data,
	    off,
	    over,
	    defaultConfig = {
	      attribute : ATTR,
	      debug : false,
	      root : document.body,
	      delay : { pop : 200, unpop : 300 },
	      factory : null
	    },
	    defaultProperties = {
	      'color' : COLOR,
	      'margin' : MARGIN,
	      'class' : ''
	    };

	    if (! config.hasOwnProperty('delay')) {
	      config.delay = defaultConfig.delay;
	    } else if (typeof config.delay == 'number') {
	      config.delay = { pop : config.delay, unpop : config.delay };
	    }

	    config = merge(defaultConfig, config);
	    this.defaults = merge(defaultProperties, defaults);

	    // two events are fired
	    this.events = {
	      'pop' : function(/*target, popover*/) { },
	      'unpop' : function(/*target, popover*/) { }
	    };
	    this.enabled = true;
	    this.attribute = config.attribute;
	    this.delay = config.delay;
	    this.factory = config.factory;
	    this.debug = config.debug;
	    this.listeners = {};

	    node = config.root ? (config.root instanceof Element ? config.root : document.querySelector(config.root)) : document.body;

	    if (! node) {
	      throw Error('Invalid Popover root [' + config.root + ']');
	    }

	    this.root = node;

	    //
	    nodes = arr(node.querySelectorAll('[' + this.attribute + ']'));

	    // add root node if it has the data-popover attribute
	    if (node.hasAttribute(this.attribute)) {
	      nodes.push(node);
	    }

	    /* Invoked when the mouse enters the popover target element
	     *
	     * @param e {MouseEvent}
	     * @param delay {Int} - number of milliseconds to delay
	     */
	    on = function(e, delay) {

	      if (! $.enabled) { return; }

	      var
	      target = e.target,
	      data = {},
	      n,
	      popper = function() {
	        if (n) {
	          n.classList.add('pop');
	          if (pops[n.getAttribute('id')]) { // fire event listener
	            $.events.pop(target, n);
	          }
	        }
	      };

	      data = getDataForNode($, target);

	      if ($.debug) { window.console.log(data); }

	      // if there's no content and no specific class, abort since it's an empty popover
	      if (! data.content && ! data['class']) { return; }

	      data['class'] = (data['class'] ? data['class'] : '') + (data.position === "side" ? ' side' : ' top')  +' rmr-popover' + (data.persist ? ' persist' : '');
	      data.id = target.getAttribute('id') + '-popover';

	      // if a popover with this id already exists, don't display the one we just created
	      if (pops[data.id]) {
	        if (timeouts[target.getAttribute('id')]) {
	          window.clearTimeout(timeouts[target.getAttribute('id')]);
	          delete timeouts[target.getAttribute('id')];
	        }
	        return;
	      }

	      n = makeElement('div', {'data-target' : target.getAttribute('id'), 'role' : 'tooltip', 'class' : data['class'], 'id' : data.id });

	      n.innerHTML = '<b class="arrow"></b><div class="bd">' + (data.content ? data.content : '') + '</div>';
	      window.document.body.appendChild(n);

	      target.setAttribute('aria-describedby', data.id);

	      positionPopover(n, target, data);

	      pops[data.id] = n;

	      window.setTimeout(function() { popper(); }, delay ? delay : 0);

	      //
	      if (! data.persist) {
	        n.addEventListener('mouseenter', over);
	      }
	    };

	    /* Invoked when mouse hovers over the popover element
	     *
	     * @param e {MouseEvent}
	     */
	    over = function(e) {
	     var n = e.target,
	         id;

	      id = n.getAttribute('id').replace('-popover', '');

	      n.addEventListener('mouseleave', function(/*e*/) {
	        off({ target: document.getElementById(id) });
	      });

	      if (timeouts[id]) {
	        window.clearTimeout(timeouts[id]);
	        delete timeouts[id];
	      }
	    };

	    /*
	     *
	     * @param e {MouseEvent} - mouseevent for the target element
	     * @param delay {Int}
	     */
	    off = function(e, delay) {

	      var
	      target = e.target,
	      f = function() {
	        var id = target.getAttribute('id');
	        target.removeAttribute('aria-describedBy');
	        try {
	          var pop = pops[id + '-popover'];

	          delete pops[id + '-popover'];

	          if (pop) {
	            if (! $.debug) { pop.parentNode.removeChild(pop); }
	            $.events.unpop(target, pop);
	          }

	        } catch (e) { window.console.log('ERROR', e); }
	      };

	      timeouts[target.getAttribute('id')] = window.setTimeout(f, arguments.length === 1 ? $.delay.unpop : delay);
	    };


	    // init

	    for (i = 0; i < nodes.length; i++) {
	      n = nodes[i];

	      // ensure target has unique id
	      if (! n.getAttribute('id')) { n.setAttribute('id', guid('popover-target') ); }

	      // clear out title since we don't want the tooltip to obscure the popover
	      if (n.hasAttribute('title')) { n.setAttribute('title', ''); }

	      l = {
	        on  :  function(e) { on(e, $.delay.pop); },
	        off : function(e) { off(e, $.delay.unpop); }
	      };
	      data = getDataForNode(this, n);

	      this.listeners[n.getAttribute('id')] = {
	        'pop' : l.on,
	        'unpop' : l.off
	      };

	      if (data.persist) { // if this is a persistent popover, create it immediately
	        l.on({ target : n });

	      } else {            // otherwise attach the necessary listeners for mouse/touch interaction

	        console.log(n, data.on, data.off);

	        if (data.events && data.events.pop) {
	          n.addEventListener(data.events.pop, l.on);
	        } else {
	          n.addEventListener('touchstart', l.on);
	          n.addEventListener('mouseenter', l.on);
	        }

	        if (data.events && data.events.unpop) {
	          n.addEventListener(data.events.unpop, l.off);
	        } else {
	          n.addEventListener('touchend', l.off);
	          n.addEventListener('mouseleave', l.off);
	        }
	      }
	    }

	    /*
	     * Re-position all persistent popovers on window resize
	     */
	    this.windowResizer = function() {

	      var persists = arr(document.querySelectorAll('.rmr-popover.persist')),
	          target = null;

	      for (var i = 0; i < persists.length; i++) {

	        target = document.getElementById(persists[i].getAttribute('data-target'));

	        positionPopover(
	          persists[i],
	          target,
	          getDataForNode(this, target)
	        );
	      }
	    };

	    window.addEventListener(
	      'resize',
	      function() { $.windowResizer(); }
	    );

	    this.destroy = function() {

	      var n, data;
	      for (var i in this.listeners) {

	        if (! this.listeners.hasOwnProperty(i)) {
	          continue;
	        }

	        n = document.getElementById(i);
	        data = getDataForNode(this, n);

	        if (data.events && data.events.pop) {
	          n.removeEventListener(data.events.pop, this.listeners[i].pop);
	        } else {
	          n.removeEventListener('mouseenter', this.listeners[i].pop);
	          n.removeEventListener('touchstart', this.listeners[i].pop);
	        }

	        if (data.events && data.events.unpop) {
	          n.removeEventListener(data.events.unpop, this.listeners[i].unpop);
	        } else {
	          n.removeEventListener('mouseleave', this.listeners[i].unpop);
	          n.removeEventListener('touchend', this.listeners[i].unpop);
	        }

	        // remove all popovers
	        off( { target : n }, 0);
	      }

	      // remove resize listener
	      window.removeEventListener('resize', this.windowResizer);

	      return this;
	    };

	    if (this.debug) { window.console.log(this.toString()); }
	  };

	  /*!
	   * Attach a listener to `pop`/`unpop` events
	   *
	   * @param event {String} - one of `pop` or `unpop`
	   * @param method {Function} - the method that will be invoked on the relevant event
	   * @chainable
	   */
	  Popover.prototype.on = function(event, method) {
	    this.events[event] = method;
	    return this;
	  };

	  /**
	   * Return a string representation of the instance
	   *
	   * @return {String}
	   */
	  Popover.prototype.toString = function() {
	    return 'Popover ' + JSON.stringify({root : '' + this.root, enabled : this.enabled, delay : this.delay, debug : this.debug});
	  };

	  module.exports = Popover;

	}());


/***/ }
/******/ ]);