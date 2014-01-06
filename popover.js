
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

      Y.one(config.node).all('[data-popover]').each(function(n) {

        if (! n.get('id')) { n.set('id', Y.guid()); }
        n.set('title', '');

        var on = function(e) {

          if (pops[arguments[1].get('id')]) {
            return;
          }

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
              
              Y.log(Y.one('body').get('winWidth'));
              Y.log(region.left + parseInt(node.getComputedStyle('width'), 10));

//              if (parseInt(node.getComputedStyle('width'), 10) + region.left > Y.one('body').get('winWidth')) {
                Y.log('too wide');
                offset[0] = - region.width - data.margin;
                node.replaceClass('right', 'left');
//              }

              break;
          }

          node.setXY([loc[0] + offset[0], loc[1] + offset[1]]);

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
            }, []);
          });


          pops[e.target.get('id')] = node;
          node.addClass('pop');
        },
        off = function(e) {
          timeouts[e.target.get('id')] = Y.later(300, null, function() {
            if (pops[e.target.get('id')]) {
              pops[e.target.get('id')].remove();
              delete(pops[e.target.get('id')]);
            }
          }, []);
        };

        n.on('mouseenter', on, null, n);
        n.on('focus', on, null, n);

        n.on('mouseleave', off);
        n.on('blur', off);

      });

      return this;
    };

    Popover.ATTRS = {
      node : {
        value : null,
        setter : function(n) { return Y.one(n); },
        writeOnce : true
      },
      content : {
        value : null
      }/*,
      id : {
        value : null,
        setter : function(id) { return id || 'backdrop'; },
        writeOnce : true
      },
      styles : {
        value : null
      },
      duration : {
        value : 1,
        setter : function(i) { return (i ? parseFloat(i, 10) : 1); }
      }
*/
    };

    Y.Popover = Y.extend(Popover, Y.Base, {

      /**
       @method destructor
       */
      destructor : function() {
        this.set('node', null);
        this.set('data', null);
      },

      /**
       @method unpop
       @chainable
       */
      unpop : function() {
        Y.one('.popover').removeClass('pop');
      },


      /**
       @method pop
       @chainable
       */
      pop : function() {

        Y.all('.popover').remove();
        var $ = this,
            markup = '<div class="popover"><div class="bd ' + this.get('data') + '"></div></div>';

        Y.one(document.body).insert(Y.Node.create(markup));
        Y.later(100, null, function() { Y.one('.popover').addClass('pop'); });
        Y.later(2000, null, function() { $.unpop(); });

        return this;
      },

      /**
       @method resize
       @chainable
       */
      resize : function() {
/*
        var body = Y.one(document.body),
            region = null,
            node = Y.one('#' + this.get('id'));

        body.setStyle('minHeight', body.get('winHeight') + 'px');

        region = body.get('region');
        if (node) { node.setStyles({'width': region.width + 'px', 'height': region.height + 'px'}); }

        return this;
*/
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

