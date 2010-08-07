(function($){

    if ( $.browser.msie ) {

        // For detecting is opacity is already set
        var alphaRegex = /^alpha\(opacity=(\d+)\)$/i;

        // Handle fadeIn and fadeOut methods
        $.each(['fadeIn', 'fadeOut'], function (i, method) {
            var _fn = $.fn[method];
            $.fn[method] = function (easing, callback) {
                if ((!this[0].style.filter || alphaRegex.test(this[0].style.filter))) {
                    if ($.isFunction(easing)) {
                        callback = easing;
                        easing = 'normal';
                    }
                    var _callback = callback;
                    callback = function () {
                        this.style.removeAttribute('filter');
                        (_callback || $.noop).call(this);
                    }
                }
                return _fn.call(this, easing, callback);
            }
        });
        
        // Handle fadeTo method when opacity is set to 1
        var _fadeTo = $.fn.fadeTo;
        $.fn.fadeTo = function (duration, opacity, callback) {
            if ( (!this[0].style.filter || alphaRegex.test(this[0].style.filter)) && parseInt(opacity) == 1) {
                var _callback = callback;
                callback = function () {
                    this.style.removeAttribute('filter');
                    (_callback || $.noop).call(this);
                }
            }
            return _fadeTo.call(this, duration, opacity, callback);
        }
        
        // Handle animate method when it contains opacity and that opacity
        // is set to 1
        var _animate = $.fn.animate;
        $.fn.animate = function () {
            var args = Array.prototype.slice.call(arguments);
            if ( 'opacity' in args[0] && (!this[0].style.filter || alphaRegex.test(this[0].style.filter)) && parseInt(args[0].opacity) == 1) {
                var i, fn, found = false;
                for (i = 1; i < args.length; i++) {
                    if ($.isFunction(args[i])) {
                        found = true;
                        break;
                    }
                }
                // If callback is a function
                if (found) {
                    fn = args[i];
                    args[i] = function () {
                        this.style.removeAttribute('filter');
                        (fn || $.noop).call(this);
                    }
                    // If callback is 'complete' in options object
                } else if (typeof args[1] == 'object') {
                    fn = args[1].complete;
                    args[1].complete = function () {
                        this.style.removeAttribute('filter');
                        (fn || $.noop).call(this);
                    };
                    // Else add our own callback
                } else {
                    args.push(function () {
                        this.style.removeAttribute('filter');
                    });
                }
            }
            return _animate.apply(this, args);
        }
        
        // Handle css method
        var _css = $.fn.css;
        $.fn.css = function () {

            if (!this.length) return this;

            var args = arguments,
                result = _css.apply(this, arguments);

            if  (
                    (
                            ! this[0].style.filter 
                        ||  alphaRegex.test(this[0].style.filter )
                    ) // Filter attribute exists on element
                &&  (
                        (
                                typeof args[0] == 'object'
                            &&  'opacity' in args[0] 
                            &&  parseInt(args[0].opacity) == 1
                        ) // Trying to change opacity to 1
                ||      (
                                args[0] == 'opacity' 
                            &&  parseInt(args[1]) == 1
                        ) // Trying to change opacity to 1
                    )
                ) {
                this[0].style.removeAttribute('filter');
            }
            
            return result;
        };
    }

})(jQuery)