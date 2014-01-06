
/* jshint undef: true,strict:true,trailing:true */
/* global YUI,document,window,Image */

/**
 @module Popover 
 */
YUI.add('popover', function(Y) {

    'use strict';

    /**
     @class Popover
     @constructor
     @param config (object)
     */
    var pops = {},
        timeouts = {},
        margin = 10,
        Popover = function(config) {
          Popover.superclass.constructor.apply(this, arguments);
        };

    Popover.ATTRS = {
      node : {
        value : null,
        setter : function(n) { return Y.one(n); },
        writeOnce : true
      }
    };

    Y.Popover = Y.extend(Popover, Y.Base, {

      initializer : function(config) {

        if (! this.get('node')) { return false; }

        Y.one(this.get('node')).all('[data-popover]').each(function(n) {

          if (! n.get('id')) { n.set('id', Y.guid()); }
          n.set('title', '');

          var on = function(e) {

            // if the popover is already displayed, abort
            if (pops[arguments[1].get('id')]) { return; }

            var defaults = {
              'class' : '',
              'orientation' : 'vertical',
              'content' : '',
              'margin' : 10,
            },
            data = null,
            offset = [0,0],
            location = null,
            node = null,
            arrow = null,
            loc = e.target.getXY(),
            region = null;

            try {
              data = Y.JSON.parse(e.target.getAttribute('data-popover'));
            } catch (err) {
              data = { content : e.target.getAttribute('data-popover') };
            }

            data = Y.merge(defaults, data);
            location = data.orientation == 'vertical' ? 'top' : 'right';

            node = Y.Node.create('<div id="' + arguments[1].get('id') + '-popover" class="popover '+ location + ' ' + (data.hasOwnProperty('class') ? data['class'] : '') + '"><b></b><div class="bd">' + data.content + '</div></div>');
            Y.one(document.body).append(node);
            arrow = node.one('> b');

            region = node.get('region');

            switch (data.orientation) {
              case 'vertical':

                if (region.top - region.height < 0) {
                  node.replaceClass('top', 'bottom');
                  offset[1] = e.target.get('region').height + data.margin;
                } else {
                  offset[1] = - region.height - 5;
                }
                break;

              case 'horizontal':

                offset[0] = e.target.get('region').width + data.margin;
                offset[1] = (e.target.get('region').height - region.height) / 2;


  //              arrow.setStyle('top', (region.height - arrow.get('region').height) / 2 + 'px');
          
  //              Y.log(Y.one('body').get('winWidth'));
  //              Y.log(region.left + parseInt(node.getComputedStyle('width'), 10));

  //              if (parseInt(node.getComputedStyle('width'), 10) + region.left > Y.one('body').get('winWidth')) {
  //                Y.log('too wide');
  //                offset[0] = - region.width - data.margin;
  //                node.replaceClass('right', 'left');
  //              }

                break;
            }

            node.setXY([loc[0] + offset[0], loc[1] + offset[1]]);

            // adjust location of arrow
            if (data.orientation == 'horizontal') {
              arrow.setXY([arrow.getXY[0], node.getXY()[1] + node.get('region').height / 2 - 5 ]);
            } else {
              arrow.setXY([node.getXY()[0] + node.get('region').width / 2 - 5, arrow.getXY()[1] ]);
            }

            node.on('mouseenter', function() {
              if (timeouts[e.target.get('id')]) {
                timeouts[e.target.get('id')].cancel();
                delete timeouts[e.target.get('id')];
              }
            });
      
            node.on('mouseleave', function() {
              timeouts[e.target.get('id')] = Y.later(300, null, function() {
                pops[e.target.get('id')].remove();
                delete(pops[e.target.get('id')]);
                Y.fire('popover:unpop', { node: e.target });
              }, []);
            });


            pops[e.target.get('id')] = node;
            node.addClass('pop');
  
            Y.fire('popover:pop', { node : e.target });
          },
          off = function(e) {
            timeouts[e.target.get('id')] = Y.later(300, null, function() {
              if (pops[e.target.get('id')]) {
                pops[e.target.get('id')].remove();
                delete(pops[e.target.get('id')]);
                Y.fire('popover:unpop', { node: e.target });
              }
            }, []);
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

