/* jshint undef: true,strict:true,trailing:true */
/* global document,window */

(function() {

  'use strict';

  var

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
  timeouts = {},
  pops = {};


  /**
   *
   *
   * @param node (node, optional) - the root element containing all elements with attached popovers
   * @param generator (function, optional) method to retrieve the popover's data for a given node
   */
  window.Popover = function(node, generator, delay) {

    // two events are fired
    this.events = {
      'pop' : function(target, popover) { },
      'unpop' : function(target, popover) { }
    };

    if (arguments.length < 3) { delay = 100; }

    this.enabled = true;
    this.delay = delay;

    node = node ? (node instanceof HTMLElement ? node : document.querySelector(node)) : document.body;

    var
    $ = this,
    nodes = arr(node.querySelectorAll('[data-popover]')),
    i = 0,
    n,
    on = function(e) {

      if (! $.enabled) { return; }

      var
      target = e.target,
      data = {},
      n,
      arrow,
      targetRect,
      popoverRect,
      popoverXY,
      arrowXY;

      if (generator) {
        data = generator(target);
      }
      else  {
        try {
          data = JSON.parse(e.target.getAttribute('data-popover'));
        } catch (err) {
          data = { content : e.target.getAttribute('data-popover') };
        }
      }

      data['class'] = (data['class'] ? data['class'] : '') + ' rmr-popover';
      data.id = target.getAttribute('id') + '-popover';

      n = document.createElement('div');
      n.setAttribute('role', 'tooltip');
      n.setAttribute('class', data['class']);
      n.setAttribute('id', data.id);

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

      targetRect = getRect(target);
      popoverRect = getRect(n);

      popoverXY = [
        targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2),
        targetRect.top - popoverRect.height - 5
      ];

      arrowXY = [popoverXY[0], popoverXY[1]];
      arrowXY[0] = popoverRect.width / 2 - 6;

      target.setAttribute('aria-describedby', data.id);
      pops[data.id] = n;

      n.setAttribute('style', 'left: ' + parseInt(popoverXY[0], 10) + 'px; top: ' + parseInt(popoverXY[1], 10) + 'px');

      arrow.setAttribute('style', 'left: ' + parseInt(arrowXY[0], 10) + 'px');

      n.classList.add('pop');

      n.addEventListener('mouseenter', over);

      $.events.pop(target, n);
    },

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
    },

    /*
     *
     * @param e (MouseEvent)
     */
    off = function(e, delay) {
      var target = e.target;
      timeouts[target.getAttribute('id')] = window.setTimeout(function() {
        var id = target.getAttribute('id');
        target.removeAttribute('aria-describedBy');
        try {
          var pop = pops[id + '-popover'];
          pop.parentNode.removeChild(pop);
          delete pops[id + '-popover'];

          $.events.unpop(target, pop);

        } catch (e) { }
      }, arguments.length == 1 ? $.delay : delay);

    };

    // add root node if it has
    if (node.hasAttribute('data-popover')) {
      nodes.push(node);
    }

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];

      // ensure target has unique id
      if (! n.getAttribute('id')) {
        n.setAttribute('id', guid('popover-target') );
      }

      // clear out title since we don't want the tooltip to obscure the popover
      if (n.hasAttribute('title')) {
        n.setAttribute('title', '');
      }

      n.addEventListener('mouseenter', on);
      n.addEventListener('focus', on);

      n.addEventListener('mouseleave', function(e) {
       off(e, $.delay);
      });

      n.addEventListener('blur',  function(e) {
       off(e, $.delay);
      });
    }
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
    return '[Popover]';
  };

}());
