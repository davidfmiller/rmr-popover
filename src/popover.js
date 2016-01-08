/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
/* global document,window,HTMLElement */

(function() {

  'use strict';

  var

  //
  VERSION = '0.1.3',

  // node attribute
  ATTR = 'data-popover',

  /*
   * Generate a unique string
   *
   * @param basename (String)
   * @return string
   */
  guid = function(basename) {
    return basename + '-' + parseInt(Math.random() * 100, 10) + '-' + parseInt(Math.random() * 1000, 10);
  },

  /*
   *
   * @param a
   * @param b

   * @return Object
   */
  merge = function(a, b) {
    var o = {};
    for (var i in a) {
      o[i] = a[i];
    }
    for (i in b) {
      o[i] = b[i];
    }
    return o;
  },

  /*
   *
   * @param list (array-like thing)
   * @return Array
   */
  arr = function(list) {
    var ret = [], i = 0;
    for (i = 0; i < list.length; i++) {
      ret.push(list[i]);
    }

    return ret;
  },

  /*
   *
   * @param type (String)
   * @param attrs
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

    var rect = node.getBoundingClientRect();

    // create a new object that is not read-only
    var ret = { top : rect.top, left : rect.left, bottom: rect.bottom, right : rect.right };

    ret.top += window.pageYOffset;
    ret.left += window.pageXOffset;

    ret.bottom += window.pageYOffset;
    ret.right += window.pageYOffset;

    ret.width = rect.right - rect.left;
    ret.height = rect.bottom - rect.top;

    return ret;
  },

  /*!
   *
   *
   */
  getDataForNode = function(scope, node) {

    if (scope.factory) {
      return scope.factory(node);
    }

    var data = {};
    try {
      data = JSON.parse(node.getAttribute(ATTR));
    } catch (err) {
      data = { content : node.getAttribute(ATTR) };
    }

    return data;
  },

  timeouts = {},
  pops = {};

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
    off,
    over,
    defaultOptions = {
      debug : false,
      root : document.body,
      delay : { pop : 100, unpop : 1000 },
      factory : null
    };

    if (arguments.length < 1) {
      options = defaultOptions;
    } else {
      options = merge(defaultOptions, options);
    }

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

    if (this.debug) { window.console.log(this.toString()); }

    node = options.root ? (options.root instanceof HTMLElement ? options.root : document.querySelector(options.root)) : document.body;

    if (! node) {
      throw Error('Invalid Popover root [' + options.root + ']');
    }

    nodes = arr(node.querySelectorAll('[' + ATTR + ']'));


    on = function(e, delay) {

      if (! $.enabled) { return; }

      var
      target = e.target,
      data = {},
      n,
      arrow,
      targetRect = getRect(target),
      popoverRect,
      popoverXY,
      arrowXY,
      popper = function() {

        if (n) {
          n.classList.add('pop');
          // fire event listener
          if (pops[n.getAttribute('id')]) {
            $.events.pop(target, n);
          }
        }
      }

      data = getDataForNode($, target);

      // if there's no content and no specific class, abort since it's an empty popover
      if (! data.content && ! data['class']) { return; }

      data['class'] = (data['class'] ? data['class'] : '') + ' rmr-popover';
      data.id = target.getAttribute('id') + '-popover';

      // popover already exists
      if (document.getElementById(data.id)) { return; }

      n = makeElement('div', {'role' : 'tooltip', 'class' : data['class'], 'id' : data.id });

      if (pops[data.id]) {
        if (timeouts[target.getAttribute('id')]) {
          window.clearTimeout(timeouts[target.getAttribute('id')]);
          delete timeouts[target.getAttribute('id')];
        }
        return;
      }

      n.innerHTML = '<b></b><div class="bd">' + (data.content ? data.content : '') + '</div>';

      arrow = n.querySelector('b');

      window.document.body.appendChild(n);

      popoverRect = getRect(n);

      popoverXY = [
        targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2),
        targetRect.top - popoverRect.height - 5
      ];

      arrowXY = [popoverXY[0], popoverXY[1]];
      arrowXY[0] = popoverRect.width / 2 - 6;

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

      target.setAttribute('aria-describedby', data.id);
      n.setAttribute('style', 'left: ' + parseInt(popoverXY[0], 10) + 'px; top: ' + parseInt(popoverXY[1], 10) + 'px');

      pops[data.id] = n;
      arrow.setAttribute('style', 'left: ' + parseInt(arrowXY[0], 10) + 'px');

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

    /*
     *
     * @param e (MouseEvent)
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
     * @param e (MouseEvent) - target is the node who will have a popover attached
     */
    off = function(e, delay) {
      var target = e.target;
      timeouts[target.getAttribute('id')] = window.setTimeout(function() {
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
      }, arguments.length == 1 ? $.delay.unpop : delay);

    };

    // add root node if it has
    if (node.hasAttribute(ATTR)) {
      nodes.push(node);
    }

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];

      // ensure target has unique id
      if (! n.getAttribute('id')) { n.setAttribute('id', guid('popover-target') ); }

      // clear out title since we don't want the tooltip to obscure the popover
      if (n.hasAttribute('title')) { n.setAttribute('title', ''); }

      var l = {
        on  :  function(e) { on(e, $.delay.pop); },
        off : function(e) { off(e, $.delay.unpop); }
      },
      data = getDataForNode(this, n);

      this.listeners[n.getAttribute('id')] = {
        'pop' : l.on,
        'unpop' : l.off
      };

      if (data.persist) {
        l.on({ target : n });
      } else {

        n.addEventListener('mouseenter', l.on);
        n.addEventListener('focus', l.on);

        n.addEventListener('mouseleave', l.off);
        n.addEventListener('blur',  l.off);
      }
    }

    this.destroy = function() {

      var n;
      for (var i in this.listeners) {

        n = document.getElementById(i);
        n.removeEventListener('mouseenter', this.listeners[i].pop);
        n.removeEventListener('focus', this.listeners[i].pop);

        n.removeEventListener('mouseleave', this.listeners[i].unpop);
        n.removeEventListener('blur', this.listeners[i].unpop);

        off( { target : n }, 0);
      }

      return this;
    };
  };

  /*!
   *
   * @param event (string) - one of "pop" or "unpop"
   * @param method (function) - the method that will be invoked
   */
  window.Popover.prototype.on = function(event, method) {
    this.events[event] = method;
    return this;
  };

  /**
   *
   *
   * @return string
   */
  window.Popover.prototype.toString = function() {
    return '[Popover v' + VERSION + ']';
  };

}());
