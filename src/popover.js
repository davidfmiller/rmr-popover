
/* jshint undef: true,strict:true,trailing:true */
/* global YUI,document,window,Image */

/**
 @module Popover 
 */
YUI.add('popover', function(Y) {

    'use strict';

    var pops = {},
        timeouts = {},
        margin = 10,
        Popover = function(config) {
          Popover.superclass.constructor.apply(this, arguments);
        };

    Popover.ATTRS = {

      /**
        The top-level node under which popovers should be sought
        @property node
        @type {String}
      */
      node : {
        value : null,
        setter : function(n) { return Y.one(n); },
        writeOnce : true
      }
    };

    Y.Popover = Y.extend(Popover, Y.Base, {

      /**
       @class Popover
       @constructor
       @param config (object)
       */
      initializer : function(config) {

        if (! this.get('node')) { return false; }

        Y.one(this.get('node')).all('[data-popover]').each(function(n) {

          // ensure every node has an id attribute applied
          if (! n.get('id')) { n.set('id', Y.guid()); }

          var target = n, on = function(e) {

            // clear out the title attribute to prevent the tooltip from being displayed
            n.set('title', '');

            var defaults = {
              'id' : arguments[1].get('id') + '-popover',
              'content' : ''
            },
            data = null,
            offset = [0,0],
            location = null,
            node = null,
            arrow = null,
            tmp = e.target.get('id'),
            loc = e.target.getXY(),
            region = null;

            defaults = Y.merge(config.defaults, defaults);

            try {
              data = Y.JSON.parse(e.target.getAttribute('data-popover'));
            } catch (err) {
              data = { content : e.target.getAttribute('data-popover') };
            }
            
            data = Y.merge(defaults, data);

            if (! data.orientation) { data.orientation = 'vertical'; }
            if (! data.margin) { data.margin = 10; }

            if (pops[data.id]) {
              if (timeouts[tmp]) {
                timeouts[tmp].cancel();
                delete timeouts[tmp];
              }
              return;
            }

            // if no content is specified then use the title of the target node

            location = data.orientation == 'vertical' ? 'top' : 'right';

            node = Y.Node.create('<div id="' + data.id + '" role="tooltip" class="rmr-popover '+ location + ' ' + (data.hasOwnProperty('class') ? data['class'] : '') + '"><b></b><div class="bd">' + (data.content ? data.content : '') + '</div></div>');
            Y.one(document.body).append(node);
            arrow = node.one('> b');
            n.setAttribute('aria-describedby', data.id);

            region = node.get('region');

            switch (data.orientation) {
              case 'vertical':

                if (region.top - region.height < 0) {
                  node.replaceClass('top', 'bottom');
                  offset[1] = e.target.get('region').height + data.margin;
                } else {
                  offset[1] = - region.height - 5;
                }

                if (data.color) {
                  arrow.setStyle('borderTopColor', data.color);
                  arrow.setStyle('borderBottomColor', data.color);
                }

                break;

              case 'horizontal':

                offset[0] = e.target.get('region').width + data.margin;
                offset[1] = (e.target.get('region').height - region.height) / 2;

                if (data.color) {
                  arrow.setStyle('borderRightColor', data.color);
                  arrow.setStyle('borderLeftColor', data.color);
                }

                break;
            }

            node.setXY([loc[0] + offset[0], loc[1] + offset[1]]);

            if (node.getXY()[1] < 0) {
              node.setXY([node.getXY()[0], 10]);
              region = node.get('region');
            }

            // adjust location of arrow
            if (data.orientation == 'horizontal') {
              arrow.setXY([arrow.getXY[0], n.get('region').top + n.get('region').height / 2 - 5 ]);
            } else {
              arrow.setXY([node.getXY()[0] + Math.min(n.get('region').width, node.get('region').width) / 2 - 5, arrow.getXY()[1] ]);
            }

            if (data.persist) {
              node.on('mouseenter', function(e, id) {
                id = id[0];
                if (timeouts[id]) {
                  timeouts[id].cancel();
                  delete timeouts[id];
                }
              }, null, [n.get('id')]);
            }

            node.on('mouseleave', function(e) { off.call(this, n.get('id')); }, null);

            node.addClass('pop');

            pops[node.get('id')] = node;

            Y.fire('popover:pop', { node : e.target });
          },
          off = function(e) {

            var data = null;

            try {
              data = Y.JSON.parse(Y.one('#' + (typeof e == 'string' ? e : e.target.get('id'))).getAttribute('data-popover'));
              data = Y.merge(config.defaults, data);
            } catch (err) { data = config.defaults; }

            timeouts[n.get('id')] = Y.later(data.persist ? 300 : 1, null, function(a, b) {

              var id = a + '-popover', data = null;
              try {
                data = Y.JSON.parse(Y.one('#' + a).getAttribute('data-popover'));
              } catch (err) {
                data = {};
              }
              if (data && data.id) { id = data.id; }

              delete timeouts[id];
              if (pops[id]) {
                Y.one('#' + a).removeAttribute('aria-describedby');
                try {
                  pops[id].remove();
                  delete(pops[id]);
                  delete(timeouts[id]);
                } catch(e) { }
                Y.fire('popover:unpop', { node: Y.one('#' + a) });
              }
            }, [n.get('id'), target], false);
          };

          n.on('mouseenter', on, null, n);
          n.on('focus', on, null, n);

          n.on('mouseleave', off);
          n.on('blur', off);
        });

        return this;

      },

      /**
       @method destructor
       */
      destructor : function() {
        this.set('node', null);
      },

      /**
       Return a string representation of the object
       @method toString
       @return string
       */
      toString : function() {
        return '[Popover]';
      }

    });

  }, '3.3.1', { requires : ['node', 'base', 'event', 'json-parse', 'event-resize', 'transition' ] });

