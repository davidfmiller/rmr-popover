/* jshint undef: true,strict:true,trailing:true */
/* global document,window */

(function() {

  'use strict';

  var
  guid = function(basename) {
    return basename + '-' + parseInt(Math.random() * 100) + '-' + parseInt(Math.random() * 1000);
  },

  /*
   * Retrieve an object containing
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
   * @param generator (function, optional) method to retrieve the content for a
   */
  window.Popover = function(node, generator) {

    // two events are fired
    this.events = {
      'pop' : function(target, popover) { },
      'unpop' : function(target, popover) { }
    };

    node = node ? node : document.body;

    var
    $ = this,
    nodes = node.querySelectorAll('[data-popover]'),
    i = 0,
    n,
    on = function(e) {

      var
      target = e.target,
      data = {},
      n,
      arrow,
      targetRect,
      popoverRect,
      popoverXY,
      arrowXY;

      try {
        data = JSON.parse(e.target.getAttribute('data-popover'));
      } catch (err) {
        data = { content : e.target.getAttribute('data-popover') };
      }

      if (generator) {
        data.content = generator(e.target.getAttribute('id'));
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

      popoverXY = [targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2), targetRect.top - popoverRect.height - 5];

      arrowXY = [popoverXY[0], popoverXY[1]];
      arrowXY[0] = popoverRect.width / 2 - 6;

      target.setAttribute('aria-describedby', data.id);
      pops[data.id] = n;

      n.setAttribute('style', 'left: ' + parseInt(popoverXY[0], 10) + 'px; top: ' + parseInt(popoverXY[1], 10) + 'px');

      arrow.setAttribute('style', 'left: ' + parseInt(arrowXY[0], 10) + 'px');

      n.classList.add('pop');

      n.addEventListener('mouseover', function(e) {

       var n = e.target,
           id;

        while (! n.classList.contains('rmr-popover')) {
          n = n.parentNode;
        }

        id = n.getAttribute('id').replace('-popover', '');

        n.addEventListener('mouseout', function(e) {
          off({ target: document.getElementById(id) });
        });

        if (timeouts[id]) {
          window.clearTimeout(timeouts[id]);
          delete timeouts[id];
        }
      });

      $.events.pop(target.getAttribute('id') + '', data.id);
    },

    off = function(e) {
      var target = e.target;
      timeouts[target.getAttribute('id')] = window.setTimeout(function() {
        var id = target.getAttribute('id');
        target.removeAttribute('aria-describedBy');
        try {
          var pop = pops[id + '-popover'];
          pop.parentNode.removeChild(pop);
          delete pops[id + '-popover'];

          $.events.unpop(target.getAttribute('id'), pop.getAttribute('id'));

        } catch (e) { }
      }, 300);

    };

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];

      if (! n.getAttribute('id')) {
        n.setAttribute('id', guid('popover-target') );
      }

      // clear out title since we don't want the tooltip to obscure the popover
      n.setAttribute('title', '');

      n.addEventListener('mouseover', on);
      n.addEventListener('focus', on);

      n.addEventListener('mouseout', off);
      n.addEventListener('blur', off);
    }
  };

  /*!
   *
   * @param event (string)
   * @param method (function)
   */
  window.Popover.prototype.on = function(event, method) {
    this.events[event] = method;
    return this;
  };

  /**
   *
   * @return string
   */
  window.Popover.prototype.toString = function() {
    return '[Popover]';
  };

}());
