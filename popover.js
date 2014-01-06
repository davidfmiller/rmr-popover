
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
    var pops = {}, Popover = function(config) {
      Popover.superclass.constructor.apply(this, arguments);

//      if (! this.get('node')) { return false; }

      Y.one(config.node).all('[data-popover]').each(function(n) {

        Y.log(n);
        if (! n.get('id')) { n.set('id', Y.guid()); }

        n.on('mouseenter', function(e) {

          Y.log('enter');
          
          var defaults = {
            'class' : '',
            'location' : 'above',
            'content' : ''
          },
          offset = [0,0],
          json = Y.merge(defaults, Y.JSON.parse(e.target.getAttribute('data-popover'))),
          n = Y.Node.create('<div class="popover '+ json.location + ' ' + (json.hasOwnProperty('class') ? json['class'] : '') + '"><b></b><div class="bd">' + json.content + '</div></div>'),
          loc = e.target.getXY();

          switch (json['location']) {
            case 'above':
              offset = [0,-30];
              break;
            case 'below':
              offset = [0,25];
              break;
            case 'left':
            case 'right':
              offset = [0,0];
          }

          Y.one(document.body).append(n);
          n.setXY([loc[0] + offset[0], loc[1] + offset[1]]);
          pops[e.target.get('id')] = n;
          n.addClass('pop');
        });

        n.on('mouseleave', function(e) {
          Y.log('leave');
          Y.log(pops);
          
          pops[e.target.get('id')].remove();
          delete(pops[e.target.get('id')]);
        });

      });

      return this;
    };

    Popover.ATTRS = {
      node : {
        value : null,
        setter : function(n) { return Y.one(n); },
        writeOnce : true
      },
      data : {
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

