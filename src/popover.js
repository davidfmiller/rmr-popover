/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
/* global document,window,HTMLElement */

(function() {

  'use strict';

  var

  //
  VERSION = '0.1.6',

  // attribute on target nodes that will be inspected for popover data
  ATTR = 'data-popover',

  // default color
  COLOR = 'rgba(0,0,0,0.8)',

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
      o[i] = a[i];
    }
    if (! b) { return o; }
    for (i in b) {
      o[i] = b[i];
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
       n.setAttribute(i, attrs[i]);
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
    val = scope.factory ? scope.factory(node) : node.getAttribute(ATTR),
    data = {};

    try {
      data = JSON.parse(val);
    } catch (err) {
      data = { content : val };
    }

    if (! data.color) { data.color = COLOR; }

    return data;
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

    popover.style.backgroundColor = data.color;

    popoverXY = [
      targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2),
      targetRect.top - popoverRect.height - 5
    ];

    arrowXY = [popoverXY[0], popoverXY[1]];
    arrowXY[0] = popoverRect.width / 2 - 6;

    if (! data.position || data.position !== "side") { // top of target

      arrow.style.borderTopColor = data.color;

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

      arrowXY[1] = popoverRect.height;

    } else { // right-side of target

      popoverXY[0] = targetRect.left + targetRect.width + 10;
      popoverXY[1] = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;

      arrow.style.borderRightColor = data.color;

      arrowXY[0] = -10;
      arrowXY[1] = popoverRect.height / 2 - 5;

      if (popoverXY[0] + popoverRect.width > window.innerWidth) { // if clipped on right side, move to the left
        popoverXY[0] = targetRect.left - popoverRect.width - 5;
        popover.classList.add('left');
        arrowXY[0] = popoverRect.width;

        arrow.style.borderRightColor = 'transparent';
        arrow.style.borderLeftColor = data.color;

      }
    }

    popover.style.left = parseInt(popoverXY[0], 10) + 'px'
    popover.style.top = parseInt(popoverXY[1], 10) + 'px';

    arrow.style.left = parseInt(arrowXY[0], 10) + 'px';
    arrow.style.top = parseInt(arrowXY[1], 10) + 'px';
//    arrow.setAttribute('style', 'left: ' + parseInt(arrowXY[0], 10) + 'px; top:' + parseInt(arrowXY[1], 10) + 'px');
  },
  timeouts = {}, // store window.setTimeout handles for popover hiding
  pops = {};     // store popover HTMLElements keyed by their id attribute

  /**
   *
   *
   * @param node (node, optional) - the root element containing all elements with attached popovers
   * @param options (Object, optional) method to retrieve the popover's data for a given node
   */
  window.Popover = function(options) {

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
    defaultOptions = {
      debug : false,
      root : document.body,
      delay : { pop : 200, unpop : 300 },
      factory : null
    };

    options= merge(defaultOptions, options);

    // two events are fired
    this.events = {
      'pop' : function(target, popover) { },
      'unpop' : function(target, popover) { }
    };
    this.enabled = true;
    this.delay = options.delay;
    this.factory = options.factory;
    this.debug = options.debug;
    this.listeners = {};

    node = options.root ? (options.root instanceof HTMLElement ? options.root : document.querySelector(options.root)) : document.body;

    if (! node) {
      throw Error('Invalid Popover root [' + options.root + ']');
    }

    this.root = node;

    //
    nodes = arr(node.querySelectorAll('[' + ATTR + ']'));

    // add root node if it has the data-popover attribute
    if (node.hasAttribute(ATTR)) {
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

      // if there's no content and no specific class, abort since it's an empty popover
      if (! data.content && ! data['class']) { return; }

      data['class'] = (data['class'] ? data['class'] : '') + (data.position == "side" ? ' side' : ' top')  +' rmr-popover' + (data.persist ? ' persist' : '');
      data.id = target.getAttribute('id') + '-popover';

      // popover already exists
//      if (document.getElementById(data.id)) { return; }

      n = makeElement('div', {'data-target' : target.getAttribute('id'), 'role' : 'tooltip', 'class' : data['class'], 'id' : data.id });

      if (pops[data.id]) {
        if (timeouts[target.getAttribute('id')]) {
          window.clearTimeout(timeouts[target.getAttribute('id')]);
          delete timeouts[target.getAttribute('id')];
        }
        return;
      }

      n.innerHTML = '<b class="arrow"></b><div class="bd">' + (data.content ? data.content : '') + '</div>';
      window.document.body.appendChild(n);

      target.setAttribute('aria-describedby', data.id);

      positionPopover(n, target, data);

      pops[data.id] = n;

      if (delay) {
        window.setTimeout(function() { popper(); }, delay);
      } else {
        popper();
      }

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

      n.addEventListener('mouseleave', function(e) {
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

      timeouts[target.getAttribute('id')] = window.setTimeout(f, arguments.length == 1 ? $.delay.unpop : delay);
    };


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

        n.addEventListener('touchstart', l.on);
        n.addEventListener('mouseenter', l.on);
        n.addEventListener('focus', l.on);

        n.addEventListener('touchend', l.off);
        n.addEventListener('mouseleave', l.off);
        n.addEventListener('blur',  l.off);
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

      var n;
      for (var i in this.listeners) {

        n = document.getElementById(i);
        n.removeEventListener('mouseenter', this.listeners[i].pop);
        n.removeEventListener('focus', this.listeners[i].pop);
        n.removeEventListener('touchstart', this.listeners[i].pop);

        n.removeEventListener('mouseleave', this.listeners[i].unpop);
        n.removeEventListener('blur', this.listeners[i].unpop);
        n.removeEventListener('touchend', this.listeners[i].unpop);

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
  window.Popover.prototype.on = function(event, method) {
    this.events[event] = method;
    return this;
  };

  /**
   * Return a string representation of the instance
   *
   * @return {String}
   */
  window.Popover.prototype.toString = function() {
    return 'Popover ' + JSON.stringify({root : '' + this.root, enabled : this.enabled, delay : this.delay, debug : this.debug});
  };

}());
