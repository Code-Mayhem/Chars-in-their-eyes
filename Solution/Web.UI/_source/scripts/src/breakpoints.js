var site;
(function(window, $, undefined){
  "use strict";
  var Site = Site || {};

  var Site = function(){
      var obj = this;
      var resizeDelay = null;
      $.extend(obj, {

        breakpoints: [
             {
            'width': 460,
            'name': 'small'
          },
          {
            'width': 680,
            'name': 'medium'
          },
          {
            'width': 960,
            'name': 'large'
          },
          {
            'width': 1100,
            'name': 'max'
          }
        ],
        device: 'max',


        init: function(){
          this.$win = $(window);
          this.$win.on('device-type', $.proxy(this, 'handleResize'));
          this.$win.on('resize', $.proxy(this, 'resizeEventHandler'));
          this.$win.trigger('resize');
        },

        resizeEventHandler: function(){
          
          var w = window.innerWidth || document.documentElement.clientWidth,
              device = '';
          for (var i = 0; i < this.breakpoints.length; i++) {
            if (w < this.breakpoints[i].width) {
              device = this.breakpoints[i].name;
              break;
            } else {
              device = 'large';
            }
          }

          if(device !== this.device){
            this.device = device;
            this.$win.trigger('device-type', [this.device]);
          }

          //send out delayed resize event
          clearTimeout(resizeDelay);
          resizeDelay = setTimeout($.proxy(this, 'triggerResizeDelay'), 500);

        },

        triggerResizeDelay: function(){
          this.$win.trigger('resizing');
        }


      });

      return this.device;
    };
    
    site = new Site();

})(window, jQuery); 