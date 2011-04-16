(function($){
  
  var _css, _animate, hijackCallback, hijackArgs;

    if ( ! $.support.opacity && 'filter' in (document.createElement('div')).style ) {

      // Callback wrapper that removes filter attribute
      hijackCallback = function( callback ) {
        return function () {
          var filter = this.style.filter;
          if ( /^(0|1)$/.test( _css.call( $(this), 'opacity' ))) {
            this.style.removeAttribute('filter');
          }
          (callback || $.noop).call(this);
        }
      }
      
      // Loops through arguments, hijacking callback if it
      // exists. If a callback doesn't exist, one is added.
      hijackArgs = function( args ) {
        var found;

        args = $.map( args, function( arg ) {
          if ( $.isFunction( arg )) {
            found = true;
            arg = hijackCallback( arg );
          }
          return arg;
        });

        if ( ! found ) {
          args.push( hijackCallback() );
        }

        return args;
      }

          
      // Handle css method
      _css = $.fn.css;
      $.fn.css = function () {

        // Exit early if empty
        if ( ! this.length ) return this;

        // Apply styles
        _css.apply( this, arguments );

        // Remove filter if opacity is 0 or 1
        if ( arguments[0] == 'opacity' || 'opacity' in arguments[0] ) {
          this.each( hijackCallback() );
        } 

        return this;
      };

      // Handle animate method when it contains opacity
      _animate = $.fn.animate;
      $.fn.animate = function () {
        var args = Array.prototype.slice.call( arguments );

        // Exit early if empty
        if ( ! this.length ) return this;

        if ( 'opacity' in args[0] ) {
          if ( $.isPlainObject( args[1] ) ) {
            args[1].complete = hijackCallback( args[1].complete );
          } else {
            args = hijackArgs( args );
          }
        }
        return _animate.apply( this, args );
      }
      
  }

  })( jQuery )
