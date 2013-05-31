
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
    var Popover = function(config) {
      Popover.superclass.constructor.apply(this, arguments);
/*
      this.set('url', config.hasOwnProperty('url') ? config.url : null);
      this.set('id', config.hasOwnProperty('id') ? config.id : null);
      this.set('duration', config.hasOwnProperty('duration') ? config.duration : null);
      this.set('styles', config.hasOwnProperty('styles') ? config.styles : null);
*/
      if (! this.get('node')) { return false; }
      
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

/*
        if (typeof config === 'string') {
          this.set('url', config);
          this.set('styles', null)
        } else if (config) {
          if (config.hasOwnProperty('url')) { this.set('url', config.url); }
          if (config.hasOwnProperty('duration')) { this.set('duration', config.duration); }
          this.set('styles', config.hasOwnProperty('styles') ? config.styles : null);
        }

        var img = new Image(), o = {};

        o.$ = this;
        o.node = Y.Node.create('<div id="' + this.get('id') + '"></div>');

        img.onload = function() {
          Y.one('body').append(o.node);

          var s = Y.merge(DEFAULT_STYLES, o.$.get('styles'));

          o.$.fire('start', this.src);
          s.image = 'url(' + this.src + ')';
          o.$._applyStyles(o.node, s);

          //o.node.setStyle('backgroundImage', 'url(' + this.src + ')');
          o.$.resize();
          o.node.transition({
            'opacity' : 1,
            'duration' : o.$.get('duration')
          }, function() {
            o.$.fire('end', o.$.get('url') );

            var styles = Y.merge(DEFAULT_STYLES, o.$.get('styles')),
                body = Y.one('body');

            styles.image = 'url(' + img.src + ')';

            o.$._applyStyles(body, styles);

            o.node.remove();
          });

          Y.on('windowresize', function() { o.$.resize(); });
        };
        img.src = this.get('url');
*/
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

  }, '3.3.1', { requires : ['node', 'base', 'event', 'event-resize', 'transition' ] });

