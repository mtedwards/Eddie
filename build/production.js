var responsiveNav = (function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var responsiveNav = createCommonjsModule(function (module) {
	  /*! responsive-nav.js 1.0.39
	   * https://github.com/viljamis/responsive-nav.js
	   * http://responsive-nav.com
	   *
	   * Copyright (c) 2015 @viljamis
	   * Available under the MIT license
	   */

	  /* global Event */
	  (function (document, window, index) {

	    var responsiveNav = function (el, options) {
	      var computed = !!window.getComputedStyle;
	      /**
	       * getComputedStyle polyfill for old browsers
	       */

	      if (!computed) {
	        window.getComputedStyle = function (el) {
	          this.el = el;

	          this.getPropertyValue = function (prop) {
	            var re = /(\-([a-z]){1})/g;

	            if (prop === "float") {
	              prop = "styleFloat";
	            }

	            if (re.test(prop)) {
	              prop = prop.replace(re, function () {
	                return arguments[2].toUpperCase();
	              });
	            }

	            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
	          };

	          return this;
	        };
	      }
	      /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */

	      /**
	       * Add Event
	       * fn arg can be an object or a function, thanks to handleEvent
	       * read more at: http://www.thecssninja.com/javascript/handleevent
	       *
	       * @param  {element}  element
	       * @param  {event}    event
	       * @param  {Function} fn
	       * @param  {boolean}  bubbling
	       */


	      var addEvent = function (el, evt, fn, bubble) {
	        if ("addEventListener" in el) {
	          // BBOS6 doesn't support handleEvent, catch and polyfill
	          try {
	            el.addEventListener(evt, fn, bubble);
	          } catch (e) {
	            if (typeof fn === "object" && fn.handleEvent) {
	              el.addEventListener(evt, function (e) {
	                // Bind fn as this and set first arg as event object
	                fn.handleEvent.call(fn, e);
	              }, bubble);
	            } else {
	              throw e;
	            }
	          }
	        } else if ("attachEvent" in el) {
	          // check if the callback is an object and contains handleEvent
	          if (typeof fn === "object" && fn.handleEvent) {
	            el.attachEvent("on" + evt, function () {
	              // Bind fn as this
	              fn.handleEvent.call(fn);
	            });
	          } else {
	            el.attachEvent("on" + evt, fn);
	          }
	        }
	      },

	      /**
	       * Remove Event
	       *
	       * @param  {element}  element
	       * @param  {event}    event
	       * @param  {Function} fn
	       * @param  {boolean}  bubbling
	       */
	      removeEvent = function (el, evt, fn, bubble) {
	        if ("removeEventListener" in el) {
	          try {
	            el.removeEventListener(evt, fn, bubble);
	          } catch (e) {
	            if (typeof fn === "object" && fn.handleEvent) {
	              el.removeEventListener(evt, function (e) {
	                fn.handleEvent.call(fn, e);
	              }, bubble);
	            } else {
	              throw e;
	            }
	          }
	        } else if ("detachEvent" in el) {
	          if (typeof fn === "object" && fn.handleEvent) {
	            el.detachEvent("on" + evt, function () {
	              fn.handleEvent.call(fn);
	            });
	          } else {
	            el.detachEvent("on" + evt, fn);
	          }
	        }
	      },

	      /**
	       * Get the children of any element
	       *
	       * @param  {element}
	       * @return {array} Returns matching elements in an array
	       */
	      getChildren = function (e) {
	        if (e.children.length < 1) {
	          throw new Error("The Nav container has no containing elements");
	        } // Store all children in array


	        var children = []; // Loop through children and store in array if child != TextNode

	        for (var i = 0; i < e.children.length; i++) {
	          if (e.children[i].nodeType === 1) {
	            children.push(e.children[i]);
	          }
	        }

	        return children;
	      },

	      /**
	       * Sets multiple attributes at once
	       *
	       * @param {element} element
	       * @param {attrs}   attrs
	       */
	      setAttributes = function (el, attrs) {
	        for (var key in attrs) {
	          el.setAttribute(key, attrs[key]);
	        }
	      },

	      /**
	       * Adds a class to any element
	       *
	       * @param {element} element
	       * @param {string}  class
	       */
	      addClass = function (el, cls) {
	        if (el.className.indexOf(cls) !== 0) {
	          el.className += " " + cls;
	          el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
	        }
	      },

	      /**
	       * Remove a class from any element
	       *
	       * @param  {element} element
	       * @param  {string}  class
	       */
	      removeClass = function (el, cls) {
	        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
	        el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
	      },

	      /**
	       * forEach method that passes back the stuff we need
	       *
	       * @param  {array}    array
	       * @param  {Function} callback
	       * @param  {scope}    scope
	       */
	      forEach = function (array, callback, scope) {
	        for (var i = 0; i < array.length; i++) {
	          callback.call(scope, i, array[i]);
	        }
	      };

	      var nav,
	          opts,
	          navToggle,
	          styleElement = document.createElement("style"),
	          htmlEl = document.documentElement,
	          hasAnimFinished,
	          isMobile,
	          navOpen;

	      var ResponsiveNav = function (el, options) {
	        var i;
	        /**
	         * Default options
	         * @type {Object}
	         */

	        this.options = {
	          animate: true,
	          // Boolean: Use CSS3 transitions, true or false
	          transition: 284,
	          // Integer: Speed of the transition, in milliseconds
	          label: "Menu",
	          // String: Label for the navigation toggle
	          insert: "before",
	          // String: Insert the toggle before or after the navigation
	          customToggle: "",
	          // Selector: Specify the ID of a custom toggle
	          closeOnNavClick: false,
	          // Boolean: Close the navigation when one of the links are clicked
	          openPos: "relative",
	          // String: Position of the opened nav, relative or static
	          navClass: "nav-collapse",
	          // String: Default CSS class. If changed, you need to edit the CSS too!
	          navActiveClass: "js-nav-active",
	          // String: Class that is added to <html> element when nav is active
	          jsClass: "js",
	          // String: 'JS enabled' class which is added to <html> element
	          init: function () {},
	          // Function: Init callback
	          open: function () {},
	          // Function: Open callback
	          close: function () {} // Function: Close callback

	        }; // User defined options

	        for (i in options) {
	          this.options[i] = options[i];
	        } // Adds "js" class for <html>


	        addClass(htmlEl, this.options.jsClass); // Wrapper

	        this.wrapperEl = el.replace("#", ""); // Try selecting ID first

	        if (document.getElementById(this.wrapperEl)) {
	          this.wrapper = document.getElementById(this.wrapperEl); // If element with an ID doesn't exist, use querySelector
	        } else if (document.querySelector(this.wrapperEl)) {
	          this.wrapper = document.querySelector(this.wrapperEl); // If element doesn't exists, stop here.
	        } else {
	          throw new Error("The nav element you are trying to select doesn't exist");
	        } // Inner wrapper


	        this.wrapper.inner = getChildren(this.wrapper); // For minification

	        opts = this.options;
	        nav = this.wrapper; // Init

	        this._init(this);
	      };

	      ResponsiveNav.prototype = {
	        /**
	         * Unattaches events and removes any classes that were added
	         */
	        destroy: function () {
	          this._removeStyles();

	          removeClass(nav, "closed");
	          removeClass(nav, "opened");
	          removeClass(nav, opts.navClass);
	          removeClass(nav, opts.navClass + "-" + this.index);
	          removeClass(htmlEl, opts.navActiveClass);
	          nav.removeAttribute("style");
	          nav.removeAttribute("aria-hidden");
	          removeEvent(window, "resize", this, false);
	          removeEvent(window, "focus", this, false);
	          removeEvent(document.body, "touchmove", this, false);
	          removeEvent(navToggle, "touchstart", this, false);
	          removeEvent(navToggle, "touchend", this, false);
	          removeEvent(navToggle, "mouseup", this, false);
	          removeEvent(navToggle, "keyup", this, false);
	          removeEvent(navToggle, "click", this, false);

	          if (!opts.customToggle) {
	            navToggle.parentNode.removeChild(navToggle);
	          } else {
	            navToggle.removeAttribute("aria-hidden");
	          }
	        },

	        /**
	         * Toggles the navigation open/close
	         */
	        toggle: function () {
	          if (hasAnimFinished === true) {
	            if (!navOpen) {
	              this.open();
	            } else {
	              this.close();
	            }
	          }
	        },

	        /**
	         * Opens the navigation
	         */
	        open: function () {
	          if (!navOpen) {
	            removeClass(nav, "closed");
	            addClass(nav, "opened");
	            addClass(htmlEl, opts.navActiveClass);
	            addClass(navToggle, "active");
	            nav.style.position = opts.openPos;
	            setAttributes(nav, {
	              "aria-hidden": "false"
	            });
	            navOpen = true;
	            opts.open();
	          }
	        },

	        /**
	         * Closes the navigation
	         */
	        close: function () {
	          if (navOpen) {
	            addClass(nav, "closed");
	            removeClass(nav, "opened");
	            removeClass(htmlEl, opts.navActiveClass);
	            removeClass(navToggle, "active");
	            setAttributes(nav, {
	              "aria-hidden": "true"
	            }); // If animations are enabled, wait until they finish

	            if (opts.animate) {
	              hasAnimFinished = false;
	              setTimeout(function () {
	                nav.style.position = "absolute";
	                hasAnimFinished = true;
	              }, opts.transition + 10); // Animations aren't enabled, we can do these immediately
	            } else {
	              nav.style.position = "absolute";
	            }

	            navOpen = false;
	            opts.close();
	          }
	        },

	        /**
	         * Resize is called on window resize and orientation change.
	         * It initializes the CSS styles and height calculations.
	         */
	        resize: function () {
	          // Resize watches navigation toggle's display state
	          if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {
	            isMobile = true;
	            setAttributes(navToggle, {
	              "aria-hidden": "false"
	            }); // If the navigation is hidden

	            if (nav.className.match(/(^|\s)closed(\s|$)/)) {
	              setAttributes(nav, {
	                "aria-hidden": "true"
	              });
	              nav.style.position = "absolute";
	            }

	            this._createStyles();

	            this._calcHeight();
	          } else {
	            isMobile = false;
	            setAttributes(navToggle, {
	              "aria-hidden": "true"
	            });
	            setAttributes(nav, {
	              "aria-hidden": "false"
	            });
	            nav.style.position = opts.openPos;

	            this._removeStyles();
	          }
	        },

	        /**
	         * Takes care of all even handling
	         *
	         * @param  {event} event
	         * @return {type} returns the type of event that should be used
	         */
	        handleEvent: function (e) {
	          var evt = e || window.event;

	          switch (evt.type) {
	            case "touchstart":
	              this._onTouchStart(evt);

	              break;

	            case "touchmove":
	              this._onTouchMove(evt);

	              break;

	            case "touchend":
	            case "mouseup":
	              this._onTouchEnd(evt);

	              break;

	            case "click":
	              this._preventDefault(evt);

	              break;

	            case "keyup":
	              this._onKeyUp(evt);

	              break;

	            case "focus":
	            case "resize":
	              this.resize(evt);
	              break;
	          }
	        },

	        /**
	         * Initializes the widget
	         */
	        _init: function () {
	          this.index = index++;
	          addClass(nav, opts.navClass);
	          addClass(nav, opts.navClass + "-" + this.index);
	          addClass(nav, "closed");
	          hasAnimFinished = true;
	          navOpen = false;

	          this._closeOnNavClick();

	          this._createToggle();

	          this._transitions();

	          this.resize();
	          /**
	           * On IE8 the resize event triggers too early for some reason
	           * so it's called here again on init to make sure all the
	           * calculated styles are correct.
	           */

	          var self = this;
	          setTimeout(function () {
	            self.resize();
	          }, 20);
	          addEvent(window, "resize", this, false);
	          addEvent(window, "focus", this, false);
	          addEvent(document.body, "touchmove", this, false);
	          addEvent(navToggle, "touchstart", this, false);
	          addEvent(navToggle, "touchend", this, false);
	          addEvent(navToggle, "mouseup", this, false);
	          addEvent(navToggle, "keyup", this, false);
	          addEvent(navToggle, "click", this, false);
	          /**
	           * Init callback here
	           */

	          opts.init();
	        },

	        /**
	         * Creates Styles to the <head>
	         */
	        _createStyles: function () {
	          if (!styleElement.parentNode) {
	            styleElement.type = "text/css";
	            document.getElementsByTagName("head")[0].appendChild(styleElement);
	          }
	        },

	        /**
	         * Removes styles from the <head>
	         */
	        _removeStyles: function () {
	          if (styleElement.parentNode) {
	            styleElement.parentNode.removeChild(styleElement);
	          }
	        },

	        /**
	         * Creates Navigation Toggle
	         */
	        _createToggle: function () {
	          // If there's no toggle, let's create one
	          if (!opts.customToggle) {
	            var toggle = document.createElement("a");
	            toggle.innerHTML = opts.label;
	            setAttributes(toggle, {
	              "href": "#",
	              "class": "nav-toggle"
	            }); // Determine where to insert the toggle

	            if (opts.insert === "after") {
	              nav.parentNode.insertBefore(toggle, nav.nextSibling);
	            } else {
	              nav.parentNode.insertBefore(toggle, nav);
	            }

	            navToggle = toggle; // There is a toggle already, let's use that one
	          } else {
	            var toggleEl = opts.customToggle.replace("#", "");

	            if (document.getElementById(toggleEl)) {
	              navToggle = document.getElementById(toggleEl);
	            } else if (document.querySelector(toggleEl)) {
	              navToggle = document.querySelector(toggleEl);
	            } else {
	              throw new Error("The custom nav toggle you are trying to select doesn't exist");
	            }
	          }
	        },

	        /**
	         * Closes the navigation when a link inside is clicked.
	         */
	        _closeOnNavClick: function () {
	          if (opts.closeOnNavClick) {
	            var links = nav.getElementsByTagName("a"),
	                self = this;
	            forEach(links, function (i, el) {
	              addEvent(links[i], "click", function () {
	                if (isMobile) {
	                  self.toggle();
	                }
	              }, false);
	            });
	          }
	        },

	        /**
	         * Prevents the default functionality.
	         *
	         * @param  {event} event
	         */
	        _preventDefault: function (e) {
	          if (e.preventDefault) {
	            if (e.stopImmediatePropagation) {
	              e.stopImmediatePropagation();
	            }

	            e.preventDefault();
	            e.stopPropagation();
	            return false; // This is strictly for old IE
	          } else {
	            e.returnValue = false;
	          }
	        },

	        /**
	         * On touch start we get the location of the touch.
	         *
	         * @param  {event} event
	         */
	        _onTouchStart: function (e) {
	          if (!Event.prototype.stopImmediatePropagation) {
	            this._preventDefault(e);
	          }

	          this.startX = e.touches[0].clientX;
	          this.startY = e.touches[0].clientY;
	          this.touchHasMoved = false;
	          /**
	           * Remove mouseup event completely here to avoid
	           * double triggering the event.
	           */

	          removeEvent(navToggle, "mouseup", this, false);
	        },

	        /**
	         * Check if the user is scrolling instead of tapping.
	         *
	         * @param  {event} event
	         */
	        _onTouchMove: function (e) {
	          if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
	            this.touchHasMoved = true;
	          }
	        },

	        /**
	         * On touch end toggle the navigation.
	         *
	         * @param  {event} event
	         */
	        _onTouchEnd: function (e) {
	          this._preventDefault(e);

	          if (!isMobile) {
	            return;
	          } // If the user isn't scrolling


	          if (!this.touchHasMoved) {
	            // If the event type is touch
	            if (e.type === "touchend") {
	              this.toggle();
	              return; // Event type was click, not touch
	            } else {
	              var evt = e || window.event; // If it isn't a right click, do toggling

	              if (!(evt.which === 3 || evt.button === 2)) {
	                this.toggle();
	              }
	            }
	          }
	        },

	        /**
	         * For keyboard accessibility, toggle the navigation on Enter
	         * keypress too.
	         *
	         * @param  {event} event
	         */
	        _onKeyUp: function (e) {
	          var evt = e || window.event;

	          if (evt.keyCode === 13) {
	            this.toggle();
	          }
	        },

	        /**
	         * Adds the needed CSS transitions if animations are enabled
	         */
	        _transitions: function () {
	          if (opts.animate) {
	            var objStyle = nav.style,
	                transition = "max-height " + opts.transition + "ms";
	            objStyle.WebkitTransition = objStyle.MozTransition = objStyle.OTransition = objStyle.transition = transition;
	          }
	        },

	        /**
	         * Calculates the height of the navigation and then creates
	         * styles which are later added to the page <head>
	         */
	        _calcHeight: function () {
	          var savedHeight = 0;

	          for (var i = 0; i < nav.inner.length; i++) {
	            savedHeight += nav.inner[i].offsetHeight;
	          }

	          var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important} ." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened.dropdown-active {max-height:9999px !important}";

	          if (styleElement.styleSheet) {
	            styleElement.styleSheet.cssText = innerStyles;
	          } else {
	            styleElement.innerHTML = innerStyles;
	          }

	          innerStyles = "";
	        }
	      };
	      /**
	       * Return new Responsive Nav
	       */

	      return new ResponsiveNav(el, options);
	    };

	    if (module.exports) {
	      module.exports = responsiveNav;
	    } else {
	      window.responsiveNav = responsiveNav;
	    }
	  })(document, window, 0);
	});

	return responsiveNav;

}());

(function () {
  'use strict';

  // ==================================================
  // fancyBox v3.5.6
  //
  // Licensed GPLv3 for open source use
  // or fancyBox Commercial License for commercial use
  //
  // http://fancyapps.com/fancybox/
  // Copyright 2018 fancyApps
  //
  // ==================================================
  (function (window, document, $, undefined) {

    window.console = window.console || {
      info: function (stuff) {}
    }; // If there's no jQuery, fancyBox can't work
    // =========================================

    if (!$) {
      return;
    } // Check if fancyBox is already initialized
    // ========================================


    if ($.fn.fancybox) {
      console.info("fancyBox already initialized");
      return;
    } // Private default settings
    // ========================


    var defaults = {
      // Close existing modals
      // Set this to false if you do not need to stack multiple instances
      closeExisting: false,
      // Enable infinite gallery navigation
      loop: false,
      // Horizontal space between slides
      gutter: 50,
      // Enable keyboard navigation
      keyboard: true,
      // Should allow caption to overlap the content
      preventCaptionOverlap: true,
      // Should display navigation arrows at the screen edges
      arrows: true,
      // Should display counter at the top left corner
      infobar: true,
      // Should display close button (using `btnTpl.smallBtn` template) over the content
      // Can be true, false, "auto"
      // If "auto" - will be automatically enabled for "html", "inline" or "ajax" items
      smallBtn: "auto",
      // Should display toolbar (buttons at the top)
      // Can be true, false, "auto"
      // If "auto" - will be automatically hidden if "smallBtn" is enabled
      toolbar: "auto",
      // What buttons should appear in the top right corner.
      // Buttons will be created using templates from `btnTpl` option
      // and they will be placed into toolbar (class="fancybox-toolbar"` element)
      buttons: ["zoom", //"share",
      "slideShow", //"fullScreen",
      //"download",
      "thumbs", "close"],
      // Detect "idle" time in seconds
      idleTime: 3,
      // Disable right-click and use simple image protection for images
      protect: false,
      // Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
      modal: false,
      image: {
        // Wait for images to load before displaying
        //   true  - wait for image to load and then display;
        //   false - display thumbnail and load the full-sized image over top,
        //           requires predefined image dimensions (`data-width` and `data-height` attributes)
        preload: false
      },
      ajax: {
        // Object containing settings for ajax request
        settings: {
          // This helps to indicate that request comes from the modal
          // Feel free to change naming
          data: {
            fancybox: true
          }
        }
      },
      iframe: {
        // Iframe template
        tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
        // Preload iframe before displaying it
        // This allows to calculate iframe content width and height
        // (note: Due to "Same Origin Policy", you can't get cross domain data).
        preload: true,
        // Custom CSS styling for iframe wrapping element
        // You can use this to set custom iframe dimensions
        css: {},
        // Iframe tag attributes
        attr: {
          scrolling: "auto"
        }
      },
      // For HTML5 video only
      video: {
        tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}">' + '<source src="{{src}}" type="{{format}}" />' + 'Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!' + "</video>",
        format: "",
        // custom video format
        autoStart: true
      },
      // Default content type if cannot be detected automatically
      defaultType: "image",
      // Open/close animation type
      // Possible values:
      //   false            - disable
      //   "zoom"           - zoom images from/to thumbnail
      //   "fade"
      //   "zoom-in-out"
      //
      animationEffect: "zoom",
      // Duration in ms for open/close animation
      animationDuration: 366,
      // Should image change opacity while zooming
      // If opacity is "auto", then opacity will be changed if image and thumbnail have different aspect ratios
      zoomOpacity: "auto",
      // Transition effect between slides
      //
      // Possible values:
      //   false            - disable
      //   "fade'
      //   "slide'
      //   "circular'
      //   "tube'
      //   "zoom-in-out'
      //   "rotate'
      //
      transitionEffect: "fade",
      // Duration in ms for transition animation
      transitionDuration: 366,
      // Custom CSS class for slide element
      slideClass: "",
      // Custom CSS class for layout
      baseClass: "",
      // Base template for layout
      baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' + '<div class="fancybox-bg"></div>' + '<div class="fancybox-inner">' + '<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>' + '<div class="fancybox-toolbar">{{buttons}}</div>' + '<div class="fancybox-navigation">{{arrows}}</div>' + '<div class="fancybox-stage"></div>' + '<div class="fancybox-caption"><div class="fancybox-caption__body"></div></div>' + "</div>" + "</div>",
      // Loading indicator template
      spinnerTpl: '<div class="fancybox-loading"></div>',
      // Error message template
      errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
      btnTpl: {
        download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg>' + "</a>",
        zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>' + "</button>",
        close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg>' + "</button>",
        // Arrows
        arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' + '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div>' + "</button>",
        arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' + '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div>' + "</button>",
        // This small close button will be appended to your html/inline/ajax content by default,
        // if "smallBtn" option is not set to false
        smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg>' + "</button>"
      },
      // Container is injected into this element
      parentEl: "body",
      // Hide browser vertical scrollbars; use at your own risk
      hideScrollbar: true,
      // Focus handling
      // ==============
      // Try to focus on the first focusable element after opening
      autoFocus: true,
      // Put focus back to active element after closing
      backFocus: true,
      // Do not let user to focus on element outside modal content
      trapFocus: true,
      // Module specific options
      // =======================
      fullScreen: {
        autoStart: false
      },
      // Set `touch: false` to disable panning/swiping
      touch: {
        vertical: true,
        // Allow to drag content vertically
        momentum: true // Continue movement after releasing mouse/touch when panning

      },
      // Hash value when initializing manually,
      // set `false` to disable hash change
      hash: null,
      // Customize or add new media types
      // Example:

      /*
        media : {
          youtube : {
            params : {
              autoplay : 0
            }
          }
        }
      */
      media: {},
      slideShow: {
        autoStart: false,
        speed: 3000
      },
      thumbs: {
        autoStart: false,
        // Display thumbnails on opening
        hideOnClose: true,
        // Hide thumbnail grid when closing animation starts
        parentEl: ".fancybox-container",
        // Container is injected into this element
        axis: "y" // Vertical (y) or horizontal (x) scrolling

      },
      // Use mousewheel to navigate gallery
      // If 'auto' - enabled for images only
      wheel: "auto",
      // Callbacks
      //==========
      // See Documentation/API/Events for more information
      // Example:

      /*
        afterShow: function( instance, current ) {
          console.info( 'Clicked element:' );
          console.info( current.opts.$orig );
        }
      */
      onInit: $.noop,
      // When instance has been initialized
      beforeLoad: $.noop,
      // Before the content of a slide is being loaded
      afterLoad: $.noop,
      // When the content of a slide is done loading
      beforeShow: $.noop,
      // Before open animation starts
      afterShow: $.noop,
      // When content is done loading and animating
      beforeClose: $.noop,
      // Before the instance attempts to close. Return false to cancel the close.
      afterClose: $.noop,
      // After instance has been closed
      onActivate: $.noop,
      // When instance is brought to front
      onDeactivate: $.noop,
      // When other instance has been activated
      // Interaction
      // ===========
      // Use options below to customize taken action when user clicks or double clicks on the fancyBox area,
      // each option can be string or method that returns value.
      //
      // Possible values:
      //   "close"           - close instance
      //   "next"            - move to next gallery item
      //   "nextOrClose"     - move to next gallery item or close if gallery has only one item
      //   "toggleControls"  - show/hide controls
      //   "zoom"            - zoom image (if loaded)
      //   false             - do nothing
      // Clicked on the content
      clickContent: function (current, event) {
        return current.type === "image" ? "zoom" : false;
      },
      // Clicked on the slide
      clickSlide: "close",
      // Clicked on the background (backdrop) element;
      // if you have not changed the layout, then most likely you need to use `clickSlide` option
      clickOutside: "close",
      // Same as previous two, but for double click
      dblclickContent: false,
      dblclickSlide: false,
      dblclickOutside: false,
      // Custom options when mobile device is detected
      // =============================================
      mobile: {
        preventCaptionOverlap: false,
        idleTime: false,
        clickContent: function (current, event) {
          return current.type === "image" ? "toggleControls" : false;
        },
        clickSlide: function (current, event) {
          return current.type === "image" ? "toggleControls" : "close";
        },
        dblclickContent: function (current, event) {
          return current.type === "image" ? "zoom" : false;
        },
        dblclickSlide: function (current, event) {
          return current.type === "image" ? "zoom" : false;
        }
      },
      // Internationalization
      // ====================
      lang: "en",
      i18n: {
        en: {
          CLOSE: "Close",
          NEXT: "Next",
          PREV: "Previous",
          ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
          PLAY_START: "Start slideshow",
          PLAY_STOP: "Pause slideshow",
          FULL_SCREEN: "Full screen",
          THUMBS: "Thumbnails",
          DOWNLOAD: "Download",
          SHARE: "Share",
          ZOOM: "Zoom"
        },
        de: {
          CLOSE: "Schlie&szlig;en",
          NEXT: "Weiter",
          PREV: "Zur&uuml;ck",
          ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
          PLAY_START: "Diaschau starten",
          PLAY_STOP: "Diaschau beenden",
          FULL_SCREEN: "Vollbild",
          THUMBS: "Vorschaubilder",
          DOWNLOAD: "Herunterladen",
          SHARE: "Teilen",
          ZOOM: "Vergr&ouml;&szlig;ern"
        }
      }
    }; // Few useful variables and methods
    // ================================

    var $W = $(window);
    var $D = $(document);
    var called = 0; // Check if an object is a jQuery object and not a native JavaScript object
    // ========================================================================

    var isQuery = function (obj) {
      return obj && obj.hasOwnProperty && obj instanceof $;
    }; // Handle multiple browsers for "requestAnimationFrame" and "cancelAnimationFrame"
    // ===============================================================================


    var requestAFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || // if all else fails, use setTimeout
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    }();

    var cancelAFrame = function () {
      return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
        window.clearTimeout(id);
      };
    }(); // Detect the supported transition-end event property name
    // =======================================================


    var transitionEnd = function () {
      var el = document.createElement("fakeelement"),
          t;
      var transitions = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
      };

      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }

      return "transitionend";
    }(); // Force redraw on an element.
    // This helps in cases where the browser doesn't redraw an updated element properly
    // ================================================================================


    var forceRedraw = function ($el) {
      return $el && $el.length && $el[0].offsetHeight;
    }; // Exclude array (`buttons`) options from deep merging
    // ===================================================


    var mergeOpts = function (opts1, opts2) {
      var rez = $.extend(true, {}, opts1, opts2);
      $.each(opts2, function (key, value) {
        if ($.isArray(value)) {
          rez[key] = value;
        }
      });
      return rez;
    }; // How much of an element is visible in viewport
    // =============================================


    var inViewport = function (elem) {
      var elemCenter, rez;

      if (!elem || elem.ownerDocument !== document) {
        return false;
      }

      $(".fancybox-container").css("pointer-events", "none");
      elemCenter = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
      };
      rez = document.elementFromPoint(elemCenter.x, elemCenter.y) === elem;
      $(".fancybox-container").css("pointer-events", "");
      return rez;
    }; // Class definition
    // ================


    var FancyBox = function (content, opts, index) {
      var self = this;
      self.opts = mergeOpts({
        index: index
      }, $.fancybox.defaults);

      if ($.isPlainObject(opts)) {
        self.opts = mergeOpts(self.opts, opts);
      }

      if ($.fancybox.isMobile) {
        self.opts = mergeOpts(self.opts, self.opts.mobile);
      }

      self.id = self.opts.id || ++called;
      self.currIndex = parseInt(self.opts.index, 10) || 0;
      self.prevIndex = null;
      self.prevPos = null;
      self.currPos = 0;
      self.firstRun = true; // All group items

      self.group = []; // Existing slides (for current, next and previous gallery items)

      self.slides = {}; // Create group elements

      self.addContent(content);

      if (!self.group.length) {
        return;
      }

      self.init();
    };

    $.extend(FancyBox.prototype, {
      // Create DOM structure
      // ====================
      init: function () {
        var self = this,
            firstItem = self.group[self.currIndex],
            firstItemOpts = firstItem.opts,
            $container,
            buttonStr;

        if (firstItemOpts.closeExisting) {
          $.fancybox.close(true);
        } // Hide scrollbars
        // ===============


        $("body").addClass("fancybox-active");

        if (!$.fancybox.getInstance() && firstItemOpts.hideScrollbar !== false && !$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {
          $("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (window.innerWidth - document.documentElement.clientWidth) + "px;}</style>");
          $("body").addClass("compensate-for-scrollbar");
        } // Build html markup and set references
        // ====================================
        // Build html code for buttons and insert into main template


        buttonStr = "";
        $.each(firstItemOpts.buttons, function (index, value) {
          buttonStr += firstItemOpts.btnTpl[value] || "";
        }); // Create markup from base template, it will be initially hidden to
        // avoid unnecessary work like painting while initializing is not complete

        $container = $(self.translate(self, firstItemOpts.baseTpl.replace("{{buttons}}", buttonStr).replace("{{arrows}}", firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight))).attr("id", "fancybox-container-" + self.id).addClass(firstItemOpts.baseClass).data("FancyBox", self).appendTo(firstItemOpts.parentEl); // Create object holding references to jQuery wrapped nodes

        self.$refs = {
          container: $container
        };
        ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function (item) {
          self.$refs[item] = $container.find(".fancybox-" + item);
        });
        self.trigger("onInit"); // Enable events, deactive previous instances

        self.activate(); // Build slides, load and reveal content

        self.jumpTo(self.currIndex);
      },
      // Simple i18n support - replaces object keys found in template
      // with corresponding values
      // ============================================================
      translate: function (obj, str) {
        var arr = obj.opts.i18n[obj.opts.lang] || obj.opts.i18n.en;
        return str.replace(/\{\{(\w+)\}\}/g, function (match, n) {
          return arr[n] === undefined ? match : arr[n];
        });
      },
      // Populate current group with fresh content
      // Check if each object has valid type and content
      // ===============================================
      addContent: function (content) {
        var self = this,
            items = $.makeArray(content),
            thumbs;
        $.each(items, function (i, item) {
          var obj = {},
              opts = {},
              $item,
              type,
              found,
              src,
              srcParts; // Step 1 - Make sure we have an object
          // ====================================

          if ($.isPlainObject(item)) {
            // We probably have manual usage here, something like
            // $.fancybox.open( [ { src : "image.jpg", type : "image" } ] )
            obj = item;
            opts = item.opts || item;
          } else if ($.type(item) === "object" && $(item).length) {
            // Here we probably have jQuery collection returned by some selector
            $item = $(item); // Support attributes like `data-options='{"touch" : false}'` and `data-touch='false'`

            opts = $item.data() || {};
            opts = $.extend(true, {}, opts, opts.options); // Here we store clicked element

            opts.$orig = $item;
            obj.src = self.opts.src || opts.src || $item.attr("href"); // Assume that simple syntax is used, for example:
            //   `$.fancybox.open( $("#test"), {} );`

            if (!obj.type && !obj.src) {
              obj.type = "inline";
              obj.src = item;
            }
          } else {
            // Assume we have a simple html code, for example:
            //   $.fancybox.open( '<div><h1>Hi!</h1></div>' );
            obj = {
              type: "html",
              src: item + ""
            };
          } // Each gallery object has full collection of options


          obj.opts = $.extend(true, {}, self.opts, opts); // Do not merge buttons array

          if ($.isArray(opts.buttons)) {
            obj.opts.buttons = opts.buttons;
          }

          if ($.fancybox.isMobile && obj.opts.mobile) {
            obj.opts = mergeOpts(obj.opts, obj.opts.mobile);
          } // Step 2 - Make sure we have content type, if not - try to guess
          // ==============================================================


          type = obj.type || obj.opts.type;
          src = obj.src || "";

          if (!type && src) {
            if (found = src.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) {
              type = "video";

              if (!obj.opts.video.format) {
                obj.opts.video.format = "video/" + (found[1] === "ogv" ? "ogg" : found[1]);
              }
            } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
              type = "image";
            } else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
              type = "iframe";
              obj = $.extend(true, obj, {
                contentType: "pdf",
                opts: {
                  iframe: {
                    preload: false
                  }
                }
              });
            } else if (src.charAt(0) === "#") {
              type = "inline";
            }
          }

          if (type) {
            obj.type = type;
          } else {
            self.trigger("objectNeedsType", obj);
          }

          if (!obj.contentType) {
            obj.contentType = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1 ? "html" : obj.type;
          } // Step 3 - Some adjustments
          // =========================


          obj.index = self.group.length;

          if (obj.opts.smallBtn == "auto") {
            obj.opts.smallBtn = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1;
          }

          if (obj.opts.toolbar === "auto") {
            obj.opts.toolbar = !obj.opts.smallBtn;
          } // Find thumbnail image, check if exists and if is in the viewport


          obj.$thumb = obj.opts.$thumb || null;

          if (obj.opts.$trigger && obj.index === self.opts.index) {
            obj.$thumb = obj.opts.$trigger.find("img:first");

            if (obj.$thumb.length) {
              obj.opts.$orig = obj.opts.$trigger;
            }
          }

          if (!(obj.$thumb && obj.$thumb.length) && obj.opts.$orig) {
            obj.$thumb = obj.opts.$orig.find("img:first");
          }

          if (obj.$thumb && !obj.$thumb.length) {
            obj.$thumb = null;
          }

          obj.thumb = obj.opts.thumb || (obj.$thumb ? obj.$thumb[0].src : null); // "caption" is a "special" option, it can be used to customize caption per gallery item

          if ($.type(obj.opts.caption) === "function") {
            obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
          }

          if ($.type(self.opts.caption) === "function") {
            obj.opts.caption = self.opts.caption.apply(item, [self, obj]);
          } // Make sure we have caption as a string or jQuery object


          if (!(obj.opts.caption instanceof $)) {
            obj.opts.caption = obj.opts.caption === undefined ? "" : obj.opts.caption + "";
          } // Check if url contains "filter" used to filter the content
          // Example: "ajax.html #something"


          if (obj.type === "ajax") {
            srcParts = src.split(/\s+/, 2);

            if (srcParts.length > 1) {
              obj.src = srcParts.shift();
              obj.opts.filter = srcParts.shift();
            }
          } // Hide all buttons and disable interactivity for modal items


          if (obj.opts.modal) {
            obj.opts = $.extend(true, obj.opts, {
              trapFocus: true,
              // Remove buttons
              infobar: 0,
              toolbar: 0,
              smallBtn: 0,
              // Disable keyboard navigation
              keyboard: 0,
              // Disable some modules
              slideShow: 0,
              fullScreen: 0,
              thumbs: 0,
              touch: 0,
              // Disable click event handlers
              clickContent: false,
              clickSlide: false,
              clickOutside: false,
              dblclickContent: false,
              dblclickSlide: false,
              dblclickOutside: false
            });
          } // Step 4 - Add processed object to group
          // ======================================


          self.group.push(obj);
        }); // Update controls if gallery is already opened

        if (Object.keys(self.slides).length) {
          self.updateControls(); // Update thumbnails, if needed

          thumbs = self.Thumbs;

          if (thumbs && thumbs.isActive) {
            thumbs.create();
            thumbs.focus();
          }
        }
      },
      // Attach an event handler functions for:
      //   - navigation buttons
      //   - browser scrolling, resizing;
      //   - focusing
      //   - keyboard
      //   - detecting inactivity
      // ======================================
      addEvents: function () {
        var self = this;
        self.removeEvents(); // Make navigation elements clickable
        // ==================================

        self.$refs.container.on("click.fb-close", "[data-fancybox-close]", function (e) {
          e.stopPropagation();
          e.preventDefault();
          self.close(e);
        }).on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function (e) {
          e.stopPropagation();
          e.preventDefault();
          self.previous();
        }).on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function (e) {
          e.stopPropagation();
          e.preventDefault();
          self.next();
        }).on("click.fb", "[data-fancybox-zoom]", function (e) {
          // Click handler for zoom button
          self[self.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
        }); // Handle page scrolling and browser resizing
        // ==========================================

        $W.on("orientationchange.fb resize.fb", function (e) {
          if (e && e.originalEvent && e.originalEvent.type === "resize") {
            if (self.requestId) {
              cancelAFrame(self.requestId);
            }

            self.requestId = requestAFrame(function () {
              self.update(e);
            });
          } else {
            if (self.current && self.current.type === "iframe") {
              self.$refs.stage.hide();
            }

            setTimeout(function () {
              self.$refs.stage.show();
              self.update(e);
            }, $.fancybox.isMobile ? 600 : 250);
          }
        });
        $D.on("keydown.fb", function (e) {
          var instance = $.fancybox ? $.fancybox.getInstance() : null,
              current = instance.current,
              keycode = e.keyCode || e.which; // Trap keyboard focus inside of the modal
          // =======================================

          if (keycode == 9) {
            if (current.opts.trapFocus) {
              self.focus(e);
            }

            return;
          } // Enable keyboard navigation
          // ==========================


          if (!current.opts.keyboard || e.ctrlKey || e.altKey || e.shiftKey || $(e.target).is("input,textarea,video,audio")) {
            return;
          } // Backspace and Esc keys


          if (keycode === 8 || keycode === 27) {
            e.preventDefault();
            self.close(e);
            return;
          } // Left arrow and Up arrow


          if (keycode === 37 || keycode === 38) {
            e.preventDefault();
            self.previous();
            return;
          } // Righ arrow and Down arrow


          if (keycode === 39 || keycode === 40) {
            e.preventDefault();
            self.next();
            return;
          }

          self.trigger("afterKeydown", e, keycode);
        }); // Hide controls after some inactivity period

        if (self.group[self.currIndex].opts.idleTime) {
          self.idleSecondsCounter = 0;
          $D.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function (e) {
            self.idleSecondsCounter = 0;

            if (self.isIdle) {
              self.showControls();
            }

            self.isIdle = false;
          });
          self.idleInterval = window.setInterval(function () {
            self.idleSecondsCounter++;

            if (self.idleSecondsCounter >= self.group[self.currIndex].opts.idleTime && !self.isDragging) {
              self.isIdle = true;
              self.idleSecondsCounter = 0;
              self.hideControls();
            }
          }, 1000);
        }
      },
      // Remove events added by the core
      // ===============================
      removeEvents: function () {
        var self = this;
        $W.off("orientationchange.fb resize.fb");
        $D.off("keydown.fb .fb-idle");
        this.$refs.container.off(".fb-close .fb-prev .fb-next");

        if (self.idleInterval) {
          window.clearInterval(self.idleInterval);
          self.idleInterval = null;
        }
      },
      // Change to previous gallery item
      // ===============================
      previous: function (duration) {
        return this.jumpTo(this.currPos - 1, duration);
      },
      // Change to next gallery item
      // ===========================
      next: function (duration) {
        return this.jumpTo(this.currPos + 1, duration);
      },
      // Switch to selected gallery item
      // ===============================
      jumpTo: function (pos, duration) {
        var self = this,
            groupLen = self.group.length,
            firstRun,
            isMoved,
            loop,
            current,
            previous,
            slidePos,
            stagePos,
            prop,
            diff;

        if (self.isDragging || self.isClosing || self.isAnimating && self.firstRun) {
          return;
        } // Should loop?


        pos = parseInt(pos, 10);
        loop = self.current ? self.current.opts.loop : self.opts.loop;

        if (!loop && (pos < 0 || pos >= groupLen)) {
          return false;
        } // Check if opening for the first time; this helps to speed things up


        firstRun = self.firstRun = !Object.keys(self.slides).length; // Create slides

        previous = self.current;
        self.prevIndex = self.currIndex;
        self.prevPos = self.currPos;
        current = self.createSlide(pos);

        if (groupLen > 1) {
          if (loop || current.index < groupLen - 1) {
            self.createSlide(pos + 1);
          }

          if (loop || current.index > 0) {
            self.createSlide(pos - 1);
          }
        }

        self.current = current;
        self.currIndex = current.index;
        self.currPos = current.pos;
        self.trigger("beforeShow", firstRun);
        self.updateControls(); // Validate duration length

        current.forcedDuration = undefined;

        if ($.isNumeric(duration)) {
          current.forcedDuration = duration;
        } else {
          duration = current.opts[firstRun ? "animationDuration" : "transitionDuration"];
        }

        duration = parseInt(duration, 10); // Check if user has swiped the slides or if still animating

        isMoved = self.isMoved(current); // Make sure current slide is visible

        current.$slide.addClass("fancybox-slide--current"); // Fresh start - reveal container, current slide and start loading content

        if (firstRun) {
          if (current.opts.animationEffect && duration) {
            self.$refs.container.css("transition-duration", duration + "ms");
          }

          self.$refs.container.addClass("fancybox-is-open").trigger("focus"); // Attempt to load content into slide
          // This will later call `afterLoad` -> `revealContent`

          self.loadSlide(current);
          self.preload("image");
          return;
        } // Get actual slide/stage positions (before cleaning up)


        slidePos = $.fancybox.getTranslate(previous.$slide);
        stagePos = $.fancybox.getTranslate(self.$refs.stage); // Clean up all slides

        $.each(self.slides, function (index, slide) {
          $.fancybox.stop(slide.$slide, true);
        });

        if (previous.pos !== current.pos) {
          previous.isComplete = false;
        }

        previous.$slide.removeClass("fancybox-slide--complete fancybox-slide--current"); // If slides are out of place, then animate them to correct position

        if (isMoved) {
          // Calculate horizontal swipe distance
          diff = slidePos.left - (previous.pos * slidePos.width + previous.pos * previous.opts.gutter);
          $.each(self.slides, function (index, slide) {
            slide.$slide.removeClass("fancybox-animated").removeClass(function (index, className) {
              return (className.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
            }); // Make sure that each slide is in equal distance
            // This is mostly needed for freshly added slides, because they are not yet positioned

            var leftPos = slide.pos * slidePos.width + slide.pos * slide.opts.gutter;
            $.fancybox.setTranslate(slide.$slide, {
              top: 0,
              left: leftPos - stagePos.left + diff
            });

            if (slide.pos !== current.pos) {
              slide.$slide.addClass("fancybox-slide--" + (slide.pos > current.pos ? "next" : "previous"));
            } // Redraw to make sure that transition will start


            forceRedraw(slide.$slide); // Animate the slide

            $.fancybox.animate(slide.$slide, {
              top: 0,
              left: (slide.pos - current.pos) * slidePos.width + (slide.pos - current.pos) * slide.opts.gutter
            }, duration, function () {
              slide.$slide.css({
                transform: "",
                opacity: ""
              }).removeClass("fancybox-slide--next fancybox-slide--previous");

              if (slide.pos === self.currPos) {
                self.complete();
              }
            });
          });
        } else if (duration && current.opts.transitionEffect) {
          // Set transition effect for previously active slide
          prop = "fancybox-animated fancybox-fx-" + current.opts.transitionEffect;
          previous.$slide.addClass("fancybox-slide--" + (previous.pos > current.pos ? "next" : "previous"));
          $.fancybox.animate(previous.$slide, prop, duration, function () {
            previous.$slide.removeClass(prop).removeClass("fancybox-slide--next fancybox-slide--previous");
          }, false);
        }

        if (current.isLoaded) {
          self.revealContent(current);
        } else {
          self.loadSlide(current);
        }

        self.preload("image");
      },
      // Create new "slide" element
      // These are gallery items  that are actually added to DOM
      // =======================================================
      createSlide: function (pos) {
        var self = this,
            $slide,
            index;
        index = pos % self.group.length;
        index = index < 0 ? self.group.length + index : index;

        if (!self.slides[pos] && self.group[index]) {
          $slide = $('<div class="fancybox-slide"></div>').appendTo(self.$refs.stage);
          self.slides[pos] = $.extend(true, {}, self.group[index], {
            pos: pos,
            $slide: $slide,
            isLoaded: false
          });
          self.updateSlide(self.slides[pos]);
        }

        return self.slides[pos];
      },
      // Scale image to the actual size of the image;
      // x and y values should be relative to the slide
      // ==============================================
      scaleToActual: function (x, y, duration) {
        var self = this,
            current = self.current,
            $content = current.$content,
            canvasWidth = $.fancybox.getTranslate(current.$slide).width,
            canvasHeight = $.fancybox.getTranslate(current.$slide).height,
            newImgWidth = current.width,
            newImgHeight = current.height,
            imgPos,
            posX,
            posY,
            scaleX,
            scaleY;

        if (self.isAnimating || self.isMoved() || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
          return;
        }

        self.isAnimating = true;
        $.fancybox.stop($content);
        x = x === undefined ? canvasWidth * 0.5 : x;
        y = y === undefined ? canvasHeight * 0.5 : y;
        imgPos = $.fancybox.getTranslate($content);
        imgPos.top -= $.fancybox.getTranslate(current.$slide).top;
        imgPos.left -= $.fancybox.getTranslate(current.$slide).left;
        scaleX = newImgWidth / imgPos.width;
        scaleY = newImgHeight / imgPos.height; // Get center position for original image

        posX = canvasWidth * 0.5 - newImgWidth * 0.5;
        posY = canvasHeight * 0.5 - newImgHeight * 0.5; // Make sure image does not move away from edges

        if (newImgWidth > canvasWidth) {
          posX = imgPos.left * scaleX - (x * scaleX - x);

          if (posX > 0) {
            posX = 0;
          }

          if (posX < canvasWidth - newImgWidth) {
            posX = canvasWidth - newImgWidth;
          }
        }

        if (newImgHeight > canvasHeight) {
          posY = imgPos.top * scaleY - (y * scaleY - y);

          if (posY > 0) {
            posY = 0;
          }

          if (posY < canvasHeight - newImgHeight) {
            posY = canvasHeight - newImgHeight;
          }
        }

        self.updateCursor(newImgWidth, newImgHeight);
        $.fancybox.animate($content, {
          top: posY,
          left: posX,
          scaleX: scaleX,
          scaleY: scaleY
        }, duration || 366, function () {
          self.isAnimating = false;
        }); // Stop slideshow

        if (self.SlideShow && self.SlideShow.isActive) {
          self.SlideShow.stop();
        }
      },
      // Scale image to fit inside parent element
      // ========================================
      scaleToFit: function (duration) {
        var self = this,
            current = self.current,
            $content = current.$content,
            end;

        if (self.isAnimating || self.isMoved() || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
          return;
        }

        self.isAnimating = true;
        $.fancybox.stop($content);
        end = self.getFitPos(current);
        self.updateCursor(end.width, end.height);
        $.fancybox.animate($content, {
          top: end.top,
          left: end.left,
          scaleX: end.width / $content.width(),
          scaleY: end.height / $content.height()
        }, duration || 366, function () {
          self.isAnimating = false;
        });
      },
      // Calculate image size to fit inside viewport
      // ===========================================
      getFitPos: function (slide) {
        var self = this,
            $content = slide.$content,
            $slide = slide.$slide,
            width = slide.width || slide.opts.width,
            height = slide.height || slide.opts.height,
            maxWidth,
            maxHeight,
            minRatio,
            aspectRatio,
            rez = {};

        if (!slide.isLoaded || !$content || !$content.length) {
          return false;
        }

        maxWidth = $.fancybox.getTranslate(self.$refs.stage).width;
        maxHeight = $.fancybox.getTranslate(self.$refs.stage).height;
        maxWidth -= parseFloat($slide.css("paddingLeft")) + parseFloat($slide.css("paddingRight")) + parseFloat($content.css("marginLeft")) + parseFloat($content.css("marginRight"));
        maxHeight -= parseFloat($slide.css("paddingTop")) + parseFloat($slide.css("paddingBottom")) + parseFloat($content.css("marginTop")) + parseFloat($content.css("marginBottom"));

        if (!width || !height) {
          width = maxWidth;
          height = maxHeight;
        }

        minRatio = Math.min(1, maxWidth / width, maxHeight / height);
        width = minRatio * width;
        height = minRatio * height; // Adjust width/height to precisely fit into container

        if (width > maxWidth - 0.5) {
          width = maxWidth;
        }

        if (height > maxHeight - 0.5) {
          height = maxHeight;
        }

        if (slide.type === "image") {
          rez.top = Math.floor((maxHeight - height) * 0.5) + parseFloat($slide.css("paddingTop"));
          rez.left = Math.floor((maxWidth - width) * 0.5) + parseFloat($slide.css("paddingLeft"));
        } else if (slide.contentType === "video") {
          // Force aspect ratio for the video
          // "I say the whole world must learn of our peaceful ways… by force!"
          aspectRatio = slide.opts.width && slide.opts.height ? width / height : slide.opts.ratio || 16 / 9;

          if (height > width / aspectRatio) {
            height = width / aspectRatio;
          } else if (width > height * aspectRatio) {
            width = height * aspectRatio;
          }
        }

        rez.width = width;
        rez.height = height;
        return rez;
      },
      // Update content size and position for all slides
      // ==============================================
      update: function (e) {
        var self = this;
        $.each(self.slides, function (key, slide) {
          self.updateSlide(slide, e);
        });
      },
      // Update slide content position and size
      // ======================================
      updateSlide: function (slide, e) {
        var self = this,
            $content = slide && slide.$content,
            width = slide.width || slide.opts.width,
            height = slide.height || slide.opts.height,
            $slide = slide.$slide; // First, prevent caption overlap, if needed

        self.adjustCaption(slide); // Then resize content to fit inside the slide

        if ($content && (width || height || slide.contentType === "video") && !slide.hasError) {
          $.fancybox.stop($content);
          $.fancybox.setTranslate($content, self.getFitPos(slide));

          if (slide.pos === self.currPos) {
            self.isAnimating = false;
            self.updateCursor();
          }
        } // Then some adjustments


        self.adjustLayout(slide);

        if ($slide.length) {
          $slide.trigger("refresh");

          if (slide.pos === self.currPos) {
            self.$refs.toolbar.add(self.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar", $slide.get(0).scrollHeight > $slide.get(0).clientHeight);
          }
        }

        self.trigger("onUpdate", slide, e);
      },
      // Horizontally center slide
      // =========================
      centerSlide: function (duration) {
        var self = this,
            current = self.current,
            $slide = current.$slide;

        if (self.isClosing || !current) {
          return;
        }

        $slide.siblings().css({
          transform: "",
          opacity: ""
        });
        $slide.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next");
        $.fancybox.animate($slide, {
          top: 0,
          left: 0,
          opacity: 1
        }, duration === undefined ? 0 : duration, function () {
          // Clean up
          $slide.css({
            transform: "",
            opacity: ""
          });

          if (!current.isComplete) {
            self.complete();
          }
        }, false);
      },
      // Check if current slide is moved (swiped)
      // ========================================
      isMoved: function (slide) {
        var current = slide || this.current,
            slidePos,
            stagePos;

        if (!current) {
          return false;
        }

        stagePos = $.fancybox.getTranslate(this.$refs.stage);
        slidePos = $.fancybox.getTranslate(current.$slide);
        return !current.$slide.hasClass("fancybox-animated") && (Math.abs(slidePos.top - stagePos.top) > 0.5 || Math.abs(slidePos.left - stagePos.left) > 0.5);
      },
      // Update cursor style depending if content can be zoomed
      // ======================================================
      updateCursor: function (nextWidth, nextHeight) {
        var self = this,
            current = self.current,
            $container = self.$refs.container,
            canPan,
            isZoomable;

        if (!current || self.isClosing || !self.Guestures) {
          return;
        }

        $container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan");
        canPan = self.canPan(nextWidth, nextHeight);
        isZoomable = canPan ? true : self.isZoomable();
        $container.toggleClass("fancybox-is-zoomable", isZoomable);
        $("[data-fancybox-zoom]").prop("disabled", !isZoomable);

        if (canPan) {
          $container.addClass("fancybox-can-pan");
        } else if (isZoomable && (current.opts.clickContent === "zoom" || $.isFunction(current.opts.clickContent) && current.opts.clickContent(current) == "zoom")) {
          $container.addClass("fancybox-can-zoomIn");
        } else if (current.opts.touch && (current.opts.touch.vertical || self.group.length > 1) && current.contentType !== "video") {
          $container.addClass("fancybox-can-swipe");
        }
      },
      // Check if current slide is zoomable
      // ==================================
      isZoomable: function () {
        var self = this,
            current = self.current,
            fitPos; // Assume that slide is zoomable if:
        //   - image is still loading
        //   - actual size of the image is smaller than available area

        if (current && !self.isClosing && current.type === "image" && !current.hasError) {
          if (!current.isLoaded) {
            return true;
          }

          fitPos = self.getFitPos(current);

          if (fitPos && (current.width > fitPos.width || current.height > fitPos.height)) {
            return true;
          }
        }

        return false;
      },
      // Check if current image dimensions are smaller than actual
      // =========================================================
      isScaledDown: function (nextWidth, nextHeight) {
        var self = this,
            rez = false,
            current = self.current,
            $content = current.$content;

        if (nextWidth !== undefined && nextHeight !== undefined) {
          rez = nextWidth < current.width && nextHeight < current.height;
        } else if ($content) {
          rez = $.fancybox.getTranslate($content);
          rez = rez.width < current.width && rez.height < current.height;
        }

        return rez;
      },
      // Check if image dimensions exceed parent element
      // ===============================================
      canPan: function (nextWidth, nextHeight) {
        var self = this,
            current = self.current,
            pos = null,
            rez = false;

        if (current.type === "image" && (current.isComplete || nextWidth && nextHeight) && !current.hasError) {
          rez = self.getFitPos(current);

          if (nextWidth !== undefined && nextHeight !== undefined) {
            pos = {
              width: nextWidth,
              height: nextHeight
            };
          } else if (current.isComplete) {
            pos = $.fancybox.getTranslate(current.$content);
          }

          if (pos && rez) {
            rez = Math.abs(pos.width - rez.width) > 1.5 || Math.abs(pos.height - rez.height) > 1.5;
          }
        }

        return rez;
      },
      // Load content into the slide
      // ===========================
      loadSlide: function (slide) {
        var self = this,
            type,
            $slide,
            ajaxLoad;

        if (slide.isLoading || slide.isLoaded) {
          return;
        }

        slide.isLoading = true;

        if (self.trigger("beforeLoad", slide) === false) {
          slide.isLoading = false;
          return false;
        }

        type = slide.type;
        $slide = slide.$slide;
        $slide.off("refresh").trigger("onReset").addClass(slide.opts.slideClass); // Create content depending on the type

        switch (type) {
          case "image":
            self.setImage(slide);
            break;

          case "iframe":
            self.setIframe(slide);
            break;

          case "html":
            self.setContent(slide, slide.src || slide.content);
            break;

          case "video":
            self.setContent(slide, slide.opts.video.tpl.replace(/\{\{src\}\}/gi, slide.src).replace("{{format}}", slide.opts.videoFormat || slide.opts.video.format || "").replace("{{poster}}", slide.thumb || ""));
            break;

          case "inline":
            if ($(slide.src).length) {
              self.setContent(slide, $(slide.src));
            } else {
              self.setError(slide);
            }

            break;

          case "ajax":
            self.showLoading(slide);
            ajaxLoad = $.ajax($.extend({}, slide.opts.ajax.settings, {
              url: slide.src,
              success: function (data, textStatus) {
                if (textStatus === "success") {
                  self.setContent(slide, data);
                }
              },
              error: function (jqXHR, textStatus) {
                if (jqXHR && textStatus !== "abort") {
                  self.setError(slide);
                }
              }
            }));
            $slide.one("onReset", function () {
              ajaxLoad.abort();
            });
            break;

          default:
            self.setError(slide);
            break;
        }

        return true;
      },
      // Use thumbnail image, if possible
      // ================================
      setImage: function (slide) {
        var self = this,
            ghost; // Check if need to show loading icon

        setTimeout(function () {
          var $img = slide.$image;

          if (!self.isClosing && slide.isLoading && (!$img || !$img.length || !$img[0].complete) && !slide.hasError) {
            self.showLoading(slide);
          }
        }, 50); //Check if image has srcset

        self.checkSrcset(slide); // This will be wrapper containing both ghost and actual image

        slide.$content = $('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(slide.$slide.addClass("fancybox-slide--image")); // If we have a thumbnail, we can display it while actual image is loading
        // Users will not stare at black screen and actual image will appear gradually

        if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && slide.thumb) {
          slide.width = slide.opts.width;
          slide.height = slide.opts.height;
          ghost = document.createElement("img");

          ghost.onerror = function () {
            $(this).remove();
            slide.$ghost = null;
          };

          ghost.onload = function () {
            self.afterLoad(slide);
          };

          slide.$ghost = $(ghost).addClass("fancybox-image").appendTo(slide.$content).attr("src", slide.thumb);
        } // Start loading actual image


        self.setBigImage(slide);
      },
      // Check if image has srcset and get the source
      // ============================================
      checkSrcset: function (slide) {
        var srcset = slide.opts.srcset || slide.opts.image.srcset,
            found,
            temp,
            pxRatio,
            windowWidth; // If we have "srcset", then we need to find first matching "src" value.
        // This is necessary, because when you set an src attribute, the browser will preload the image
        // before any javascript or even CSS is applied.

        if (srcset) {
          pxRatio = window.devicePixelRatio || 1;
          windowWidth = window.innerWidth * pxRatio;
          temp = srcset.split(",").map(function (el) {
            var ret = {};
            el.trim().split(/\s+/).forEach(function (el, i) {
              var value = parseInt(el.substring(0, el.length - 1), 10);

              if (i === 0) {
                return ret.url = el;
              }

              if (value) {
                ret.value = value;
                ret.postfix = el[el.length - 1];
              }
            });
            return ret;
          }); // Sort by value

          temp.sort(function (a, b) {
            return a.value - b.value;
          }); // Ok, now we have an array of all srcset values

          for (var j = 0; j < temp.length; j++) {
            var el = temp[j];

            if (el.postfix === "w" && el.value >= windowWidth || el.postfix === "x" && el.value >= pxRatio) {
              found = el;
              break;
            }
          } // If not found, take the last one


          if (!found && temp.length) {
            found = temp[temp.length - 1];
          }

          if (found) {
            slide.src = found.url; // If we have default width/height values, we can calculate height for matching source

            if (slide.width && slide.height && found.postfix == "w") {
              slide.height = slide.width / slide.height * found.value;
              slide.width = found.value;
            }

            slide.opts.srcset = srcset;
          }
        }
      },
      // Create full-size image
      // ======================
      setBigImage: function (slide) {
        var self = this,
            img = document.createElement("img"),
            $img = $(img);
        slide.$image = $img.one("error", function () {
          self.setError(slide);
        }).one("load", function () {
          var sizes;

          if (!slide.$ghost) {
            self.resolveImageSlideSize(slide, this.naturalWidth, this.naturalHeight);
            self.afterLoad(slide);
          }

          if (self.isClosing) {
            return;
          }

          if (slide.opts.srcset) {
            sizes = slide.opts.sizes;

            if (!sizes || sizes === "auto") {
              sizes = (slide.width / slide.height > 1 && $W.width() / $W.height() > 1 ? "100" : Math.round(slide.width / slide.height * 100)) + "vw";
            }

            $img.attr("sizes", sizes).attr("srcset", slide.opts.srcset);
          } // Hide temporary image after some delay


          if (slide.$ghost) {
            setTimeout(function () {
              if (slide.$ghost && !self.isClosing) {
                slide.$ghost.hide();
              }
            }, Math.min(300, Math.max(1000, slide.height / 1600)));
          }

          self.hideLoading(slide);
        }).addClass("fancybox-image").attr("src", slide.src).appendTo(slide.$content);

        if ((img.complete || img.readyState == "complete") && $img.naturalWidth && $img.naturalHeight) {
          $img.trigger("load");
        } else if (img.error) {
          $img.trigger("error");
        }
      },
      // Computes the slide size from image size and maxWidth/maxHeight
      // ==============================================================
      resolveImageSlideSize: function (slide, imgWidth, imgHeight) {
        var maxWidth = parseInt(slide.opts.width, 10),
            maxHeight = parseInt(slide.opts.height, 10); // Sets the default values from the image

        slide.width = imgWidth;
        slide.height = imgHeight;

        if (maxWidth > 0) {
          slide.width = maxWidth;
          slide.height = Math.floor(maxWidth * imgHeight / imgWidth);
        }

        if (maxHeight > 0) {
          slide.width = Math.floor(maxHeight * imgWidth / imgHeight);
          slide.height = maxHeight;
        }
      },
      // Create iframe wrapper, iframe and bindings
      // ==========================================
      setIframe: function (slide) {
        var self = this,
            opts = slide.opts.iframe,
            $slide = slide.$slide,
            $iframe;
        slide.$content = $('<div class="fancybox-content' + (opts.preload ? " fancybox-is-hidden" : "") + '"></div>').css(opts.css).appendTo($slide);
        $slide.addClass("fancybox-slide--" + slide.contentType);
        slide.$iframe = $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime())).attr(opts.attr).appendTo(slide.$content);

        if (opts.preload) {
          self.showLoading(slide); // Unfortunately, it is not always possible to determine if iframe is successfully loaded
          // (due to browser security policy)

          $iframe.on("load.fb error.fb", function (e) {
            this.isReady = 1;
            slide.$slide.trigger("refresh");
            self.afterLoad(slide);
          }); // Recalculate iframe content size
          // ===============================

          $slide.on("refresh.fb", function () {
            var $content = slide.$content,
                frameWidth = opts.css.width,
                frameHeight = opts.css.height,
                $contents,
                $body;

            if ($iframe[0].isReady !== 1) {
              return;
            }

            try {
              $contents = $iframe.contents();
              $body = $contents.find("body");
            } catch (ignore) {} // Calculate content dimensions, if it is accessible


            if ($body && $body.length && $body.children().length) {
              // Avoid scrolling to top (if multiple instances)
              $slide.css("overflow", "visible");
              $content.css({
                width: "100%",
                "max-width": "100%",
                height: "9999px"
              });

              if (frameWidth === undefined) {
                frameWidth = Math.ceil(Math.max($body[0].clientWidth, $body.outerWidth(true)));
              }

              $content.css("width", frameWidth ? frameWidth : "").css("max-width", "");

              if (frameHeight === undefined) {
                frameHeight = Math.ceil(Math.max($body[0].clientHeight, $body.outerHeight(true)));
              }

              $content.css("height", frameHeight ? frameHeight : "");
              $slide.css("overflow", "auto");
            }

            $content.removeClass("fancybox-is-hidden");
          });
        } else {
          self.afterLoad(slide);
        }

        $iframe.attr("src", slide.src); // Remove iframe if closing or changing gallery item

        $slide.one("onReset", function () {
          // This helps IE not to throw errors when closing
          try {
            $(this).find("iframe").hide().unbind().attr("src", "//about:blank");
          } catch (ignore) {}

          $(this).off("refresh.fb").empty();
          slide.isLoaded = false;
          slide.isRevealed = false;
        });
      },
      // Wrap and append content to the slide
      // ======================================
      setContent: function (slide, content) {
        var self = this;

        if (self.isClosing) {
          return;
        }

        self.hideLoading(slide);

        if (slide.$content) {
          $.fancybox.stop(slide.$content);
        }

        slide.$slide.empty(); // If content is a jQuery object, then it will be moved to the slide.
        // The placeholder is created so we will know where to put it back.

        if (isQuery(content) && content.parent().length) {
          // Make sure content is not already moved to fancyBox
          if (content.hasClass("fancybox-content") || content.parent().hasClass("fancybox-content")) {
            content.parents(".fancybox-slide").trigger("onReset");
          } // Create temporary element marking original place of the content


          slide.$placeholder = $("<div>").hide().insertAfter(content); // Make sure content is visible

          content.css("display", "inline-block");
        } else if (!slide.hasError) {
          // If content is just a plain text, try to convert it to html
          if ($.type(content) === "string") {
            content = $("<div>").append($.trim(content)).contents();
          } // If "filter" option is provided, then filter content


          if (slide.opts.filter) {
            content = $("<div>").html(content).find(slide.opts.filter);
          }
        }

        slide.$slide.one("onReset", function () {
          // Pause all html5 video/audio
          $(this).find("video,audio").trigger("pause"); // Put content back

          if (slide.$placeholder) {
            slide.$placeholder.after(content.removeClass("fancybox-content").hide()).remove();
            slide.$placeholder = null;
          } // Remove custom close button


          if (slide.$smallBtn) {
            slide.$smallBtn.remove();
            slide.$smallBtn = null;
          } // Remove content and mark slide as not loaded


          if (!slide.hasError) {
            $(this).empty();
            slide.isLoaded = false;
            slide.isRevealed = false;
          }
        });
        $(content).appendTo(slide.$slide);

        if ($(content).is("video,audio")) {
          $(content).addClass("fancybox-video");
          $(content).wrap("<div></div>");
          slide.contentType = "video";
          slide.opts.width = slide.opts.width || $(content).attr("width");
          slide.opts.height = slide.opts.height || $(content).attr("height");
        }

        slide.$content = slide.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first();
        slide.$content.siblings().hide(); // Re-check if there is a valid content
        // (in some cases, ajax response can contain various elements or plain text)

        if (!slide.$content.length) {
          slide.$content = slide.$slide.wrapInner("<div></div>").children().first();
        }

        slide.$content.addClass("fancybox-content");
        slide.$slide.addClass("fancybox-slide--" + slide.contentType);
        self.afterLoad(slide);
      },
      // Display error message
      // =====================
      setError: function (slide) {
        slide.hasError = true;
        slide.$slide.trigger("onReset").removeClass("fancybox-slide--" + slide.contentType).addClass("fancybox-slide--error");
        slide.contentType = "html";
        this.setContent(slide, this.translate(slide, slide.opts.errorTpl));

        if (slide.pos === this.currPos) {
          this.isAnimating = false;
        }
      },
      // Show loading icon inside the slide
      // ==================================
      showLoading: function (slide) {
        var self = this;
        slide = slide || self.current;

        if (slide && !slide.$spinner) {
          slide.$spinner = $(self.translate(self, self.opts.spinnerTpl)).appendTo(slide.$slide).hide().fadeIn("fast");
        }
      },
      // Remove loading icon from the slide
      // ==================================
      hideLoading: function (slide) {
        var self = this;
        slide = slide || self.current;

        if (slide && slide.$spinner) {
          slide.$spinner.stop().remove();
          delete slide.$spinner;
        }
      },
      // Adjustments after slide content has been loaded
      // ===============================================
      afterLoad: function (slide) {
        var self = this;

        if (self.isClosing) {
          return;
        }

        slide.isLoading = false;
        slide.isLoaded = true;
        self.trigger("afterLoad", slide);
        self.hideLoading(slide); // Add small close button

        if (slide.opts.smallBtn && (!slide.$smallBtn || !slide.$smallBtn.length)) {
          slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).appendTo(slide.$content);
        } // Disable right click


        if (slide.opts.protect && slide.$content && !slide.hasError) {
          slide.$content.on("contextmenu.fb", function (e) {
            if (e.button == 2) {
              e.preventDefault();
            }

            return true;
          }); // Add fake element on top of the image
          // This makes a bit harder for user to select image

          if (slide.type === "image") {
            $('<div class="fancybox-spaceball"></div>').appendTo(slide.$content);
          }
        }

        self.adjustCaption(slide);
        self.adjustLayout(slide);

        if (slide.pos === self.currPos) {
          self.updateCursor();
        }

        self.revealContent(slide);
      },
      // Prevent caption overlap,
      // fix css inconsistency across browsers
      // =====================================
      adjustCaption: function (slide) {
        var self = this,
            current = slide || self.current,
            caption = current.opts.caption,
            preventOverlap = current.opts.preventCaptionOverlap,
            $caption = self.$refs.caption,
            $clone,
            captionH = false;
        $caption.toggleClass("fancybox-caption--separate", preventOverlap);

        if (preventOverlap && caption && caption.length) {
          if (current.pos !== self.currPos) {
            $clone = $caption.clone().appendTo($caption.parent());
            $clone.children().eq(0).empty().html(caption);
            captionH = $clone.outerHeight(true);
            $clone.empty().remove();
          } else if (self.$caption) {
            captionH = self.$caption.outerHeight(true);
          }

          current.$slide.css("padding-bottom", captionH || "");
        }
      },
      // Simple hack to fix inconsistency across browsers, described here (affects Edge, too):
      // https://bugzilla.mozilla.org/show_bug.cgi?id=748518
      // ====================================================================================
      adjustLayout: function (slide) {
        var self = this,
            current = slide || self.current,
            scrollHeight,
            marginBottom,
            inlinePadding,
            actualPadding;

        if (current.isLoaded && current.opts.disableLayoutFix !== true) {
          current.$content.css("margin-bottom", ""); // If we would always set margin-bottom for the content,
          // then it would potentially break vertical align

          if (current.$content.outerHeight() > current.$slide.height() + 0.5) {
            inlinePadding = current.$slide[0].style["padding-bottom"];
            actualPadding = current.$slide.css("padding-bottom");

            if (parseFloat(actualPadding) > 0) {
              scrollHeight = current.$slide[0].scrollHeight;
              current.$slide.css("padding-bottom", 0);

              if (Math.abs(scrollHeight - current.$slide[0].scrollHeight) < 1) {
                marginBottom = actualPadding;
              }

              current.$slide.css("padding-bottom", inlinePadding);
            }
          }

          current.$content.css("margin-bottom", marginBottom);
        }
      },
      // Make content visible
      // This method is called right after content has been loaded or
      // user navigates gallery and transition should start
      // ============================================================
      revealContent: function (slide) {
        var self = this,
            $slide = slide.$slide,
            end = false,
            start = false,
            isMoved = self.isMoved(slide),
            isRevealed = slide.isRevealed,
            effect,
            effectClassName,
            duration,
            opacity;
        slide.isRevealed = true;
        effect = slide.opts[self.firstRun ? "animationEffect" : "transitionEffect"];
        duration = slide.opts[self.firstRun ? "animationDuration" : "transitionDuration"];
        duration = parseInt(slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10);

        if (isMoved || slide.pos !== self.currPos || !duration) {
          effect = false;
        } // Check if can zoom


        if (effect === "zoom") {
          if (slide.pos === self.currPos && duration && slide.type === "image" && !slide.hasError && (start = self.getThumbPos(slide))) {
            end = self.getFitPos(slide);
          } else {
            effect = "fade";
          }
        } // Zoom animation
        // ==============


        if (effect === "zoom") {
          self.isAnimating = true;
          end.scaleX = end.width / start.width;
          end.scaleY = end.height / start.height; // Check if we need to animate opacity

          opacity = slide.opts.zoomOpacity;

          if (opacity == "auto") {
            opacity = Math.abs(slide.width / slide.height - start.width / start.height) > 0.1;
          }

          if (opacity) {
            start.opacity = 0.1;
            end.opacity = 1;
          } // Draw image at start position


          $.fancybox.setTranslate(slide.$content.removeClass("fancybox-is-hidden"), start);
          forceRedraw(slide.$content); // Start animation

          $.fancybox.animate(slide.$content, end, duration, function () {
            self.isAnimating = false;
            self.complete();
          });
          return;
        }

        self.updateSlide(slide); // Simply show content if no effect
        // ================================

        if (!effect) {
          slide.$content.removeClass("fancybox-is-hidden");

          if (!isRevealed && isMoved && slide.type === "image" && !slide.hasError) {
            slide.$content.hide().fadeIn("fast");
          }

          if (slide.pos === self.currPos) {
            self.complete();
          }

          return;
        } // Prepare for CSS transiton
        // =========================


        $.fancybox.stop($slide); //effectClassName = "fancybox-animated fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-fx-" + effect;

        effectClassName = "fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-animated fancybox-fx-" + effect;
        $slide.addClass(effectClassName).removeClass("fancybox-slide--current"); //.addClass(effectClassName);

        slide.$content.removeClass("fancybox-is-hidden"); // Force reflow

        forceRedraw($slide);

        if (slide.type !== "image") {
          slide.$content.hide().show(0);
        }

        $.fancybox.animate($slide, "fancybox-slide--current", duration, function () {
          $slide.removeClass(effectClassName).css({
            transform: "",
            opacity: ""
          });

          if (slide.pos === self.currPos) {
            self.complete();
          }
        }, true);
      },
      // Check if we can and have to zoom from thumbnail
      //================================================
      getThumbPos: function (slide) {
        var rez = false,
            $thumb = slide.$thumb,
            thumbPos,
            btw,
            brw,
            bbw,
            blw;

        if (!$thumb || !inViewport($thumb[0])) {
          return false;
        }

        thumbPos = $.fancybox.getTranslate($thumb);
        btw = parseFloat($thumb.css("border-top-width") || 0);
        brw = parseFloat($thumb.css("border-right-width") || 0);
        bbw = parseFloat($thumb.css("border-bottom-width") || 0);
        blw = parseFloat($thumb.css("border-left-width") || 0);
        rez = {
          top: thumbPos.top + btw,
          left: thumbPos.left + blw,
          width: thumbPos.width - brw - blw,
          height: thumbPos.height - btw - bbw,
          scaleX: 1,
          scaleY: 1
        };
        return thumbPos.width > 0 && thumbPos.height > 0 ? rez : false;
      },
      // Final adjustments after current gallery item is moved to position
      // and it`s content is loaded
      // ==================================================================
      complete: function () {
        var self = this,
            current = self.current,
            slides = {},
            $el;

        if (self.isMoved() || !current.isLoaded) {
          return;
        }

        if (!current.isComplete) {
          current.isComplete = true;
          current.$slide.siblings().trigger("onReset");
          self.preload("inline"); // Trigger any CSS transiton inside the slide

          forceRedraw(current.$slide);
          current.$slide.addClass("fancybox-slide--complete"); // Remove unnecessary slides

          $.each(self.slides, function (key, slide) {
            if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
              slides[slide.pos] = slide;
            } else if (slide) {
              $.fancybox.stop(slide.$slide);
              slide.$slide.off().remove();
            }
          });
          self.slides = slides;
        }

        self.isAnimating = false;
        self.updateCursor();
        self.trigger("afterShow"); // Autoplay first html5 video/audio

        if (!!current.opts.video.autoStart) {
          current.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function () {
            if (this.webkitExitFullscreen) {
              this.webkitExitFullscreen();
            }

            self.next();
          });
        } // Try to focus on the first focusable element


        if (current.opts.autoFocus && current.contentType === "html") {
          // Look for the first input with autofocus attribute
          $el = current.$content.find("input[autofocus]:enabled:visible:first");

          if ($el.length) {
            $el.trigger("focus");
          } else {
            self.focus(null, true);
          }
        } // Avoid jumping


        current.$slide.scrollTop(0).scrollLeft(0);
      },
      // Preload next and previous slides
      // ================================
      preload: function (type) {
        var self = this,
            prev,
            next;

        if (self.group.length < 2) {
          return;
        }

        next = self.slides[self.currPos + 1];
        prev = self.slides[self.currPos - 1];

        if (prev && prev.type === type) {
          self.loadSlide(prev);
        }

        if (next && next.type === type) {
          self.loadSlide(next);
        }
      },
      // Try to find and focus on the first focusable element
      // ====================================================
      focus: function (e, firstRun) {
        var self = this,
            focusableStr = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'].join(","),
            focusableItems,
            focusedItemIndex;

        if (self.isClosing) {
          return;
        }

        if (e || !self.current || !self.current.isComplete) {
          // Focus on any element inside fancybox
          focusableItems = self.$refs.container.find("*:visible");
        } else {
          // Focus inside current slide
          focusableItems = self.current.$slide.find("*:visible" + (firstRun ? ":not(.fancybox-close-small)" : ""));
        }

        focusableItems = focusableItems.filter(focusableStr).filter(function () {
          return $(this).css("visibility") !== "hidden" && !$(this).hasClass("disabled");
        });

        if (focusableItems.length) {
          focusedItemIndex = focusableItems.index(document.activeElement);

          if (e && e.shiftKey) {
            // Back tab
            if (focusedItemIndex < 0 || focusedItemIndex == 0) {
              e.preventDefault();
              focusableItems.eq(focusableItems.length - 1).trigger("focus");
            }
          } else {
            // Outside or Forward tab
            if (focusedItemIndex < 0 || focusedItemIndex == focusableItems.length - 1) {
              if (e) {
                e.preventDefault();
              }

              focusableItems.eq(0).trigger("focus");
            }
          }
        } else {
          self.$refs.container.trigger("focus");
        }
      },
      // Activates current instance - brings container to the front and enables keyboard,
      // notifies other instances about deactivating
      // =================================================================================
      activate: function () {
        var self = this; // Deactivate all instances

        $(".fancybox-container").each(function () {
          var instance = $(this).data("FancyBox"); // Skip self and closing instances

          if (instance && instance.id !== self.id && !instance.isClosing) {
            instance.trigger("onDeactivate");
            instance.removeEvents();
            instance.isVisible = false;
          }
        });
        self.isVisible = true;

        if (self.current || self.isIdle) {
          self.update();
          self.updateControls();
        }

        self.trigger("onActivate");
        self.addEvents();
      },
      // Start closing procedure
      // This will start "zoom-out" animation if needed and clean everything up afterwards
      // =================================================================================
      close: function (e, d) {
        var self = this,
            current = self.current,
            effect,
            duration,
            $content,
            domRect,
            opacity,
            start,
            end;

        var done = function () {
          self.cleanUp(e);
        };

        if (self.isClosing) {
          return false;
        }

        self.isClosing = true; // If beforeClose callback prevents closing, make sure content is centered

        if (self.trigger("beforeClose", e) === false) {
          self.isClosing = false;
          requestAFrame(function () {
            self.update();
          });
          return false;
        } // Remove all events
        // If there are multiple instances, they will be set again by "activate" method


        self.removeEvents();
        $content = current.$content;
        effect = current.opts.animationEffect;
        duration = $.isNumeric(d) ? d : effect ? current.opts.animationDuration : 0;
        current.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated");

        if (e !== true) {
          $.fancybox.stop(current.$slide);
        } else {
          effect = false;
        } // Remove other slides


        current.$slide.siblings().trigger("onReset").remove(); // Trigger animations

        if (duration) {
          self.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration", duration + "ms");
        } // Clean up


        self.hideLoading(current);
        self.hideControls(true);
        self.updateCursor(); // Check if possible to zoom-out

        if (effect === "zoom" && !($content && duration && current.type === "image" && !self.isMoved() && !current.hasError && (end = self.getThumbPos(current)))) {
          effect = "fade";
        }

        if (effect === "zoom") {
          $.fancybox.stop($content);
          domRect = $.fancybox.getTranslate($content);
          start = {
            top: domRect.top,
            left: domRect.left,
            scaleX: domRect.width / end.width,
            scaleY: domRect.height / end.height,
            width: end.width,
            height: end.height
          }; // Check if we need to animate opacity

          opacity = current.opts.zoomOpacity;

          if (opacity == "auto") {
            opacity = Math.abs(current.width / current.height - end.width / end.height) > 0.1;
          }

          if (opacity) {
            end.opacity = 0;
          }

          $.fancybox.setTranslate($content, start);
          forceRedraw($content);
          $.fancybox.animate($content, end, duration, done);
          return true;
        }

        if (effect && duration) {
          $.fancybox.animate(current.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"), "fancybox-animated fancybox-fx-" + effect, duration, done);
        } else {
          // If skip animation
          if (e === true) {
            setTimeout(done, duration);
          } else {
            done();
          }
        }

        return true;
      },
      // Final adjustments after removing the instance
      // =============================================
      cleanUp: function (e) {
        var self = this,
            instance,
            $focus = self.current.opts.$orig,
            x,
            y;
        self.current.$slide.trigger("onReset");
        self.$refs.container.empty().remove();
        self.trigger("afterClose", e); // Place back focus

        if (!!self.current.opts.backFocus) {
          if (!$focus || !$focus.length || !$focus.is(":visible")) {
            $focus = self.$trigger;
          }

          if ($focus && $focus.length) {
            x = window.scrollX;
            y = window.scrollY;
            $focus.trigger("focus");
            $("html, body").scrollTop(y).scrollLeft(x);
          }
        }

        self.current = null; // Check if there are other instances

        instance = $.fancybox.getInstance();

        if (instance) {
          instance.activate();
        } else {
          $("body").removeClass("fancybox-active compensate-for-scrollbar");
          $("#fancybox-style-noscroll").remove();
        }
      },
      // Call callback and trigger an event
      // ==================================
      trigger: function (name, slide) {
        var args = Array.prototype.slice.call(arguments, 1),
            self = this,
            obj = slide && slide.opts ? slide : self.current,
            rez;

        if (obj) {
          args.unshift(obj);
        } else {
          obj = self;
        }

        args.unshift(self);

        if ($.isFunction(obj.opts[name])) {
          rez = obj.opts[name].apply(obj, args);
        }

        if (rez === false) {
          return rez;
        }

        if (name === "afterClose" || !self.$refs) {
          $D.trigger(name + ".fb", args);
        } else {
          self.$refs.container.trigger(name + ".fb", args);
        }
      },
      // Update infobar values, navigation button states and reveal caption
      // ==================================================================
      updateControls: function () {
        var self = this,
            current = self.current,
            index = current.index,
            $container = self.$refs.container,
            $caption = self.$refs.caption,
            caption = current.opts.caption; // Recalculate content dimensions

        current.$slide.trigger("refresh"); // Set caption

        if (caption && caption.length) {
          self.$caption = $caption;
          $caption.children().eq(0).html(caption);
        } else {
          self.$caption = null;
        }

        if (!self.hasHiddenControls && !self.isIdle) {
          self.showControls();
        } // Update info and navigation elements


        $container.find("[data-fancybox-count]").html(self.group.length);
        $container.find("[data-fancybox-index]").html(index + 1);
        $container.find("[data-fancybox-prev]").prop("disabled", !current.opts.loop && index <= 0);
        $container.find("[data-fancybox-next]").prop("disabled", !current.opts.loop && index >= self.group.length - 1);

        if (current.type === "image") {
          // Re-enable buttons; update download button source
          $container.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href", current.opts.image.src || current.src).show();
        } else if (current.opts.toolbar) {
          $container.find("[data-fancybox-download],[data-fancybox-zoom]").hide();
        } // Make sure focus is not on disabled button/element


        if ($(document.activeElement).is(":hidden,[disabled]")) {
          self.$refs.container.trigger("focus");
        }
      },
      // Hide toolbar and caption
      // ========================
      hideControls: function (andCaption) {
        var self = this,
            arr = ["infobar", "toolbar", "nav"];

        if (andCaption || !self.current.opts.preventCaptionOverlap) {
          arr.push("caption");
        }

        this.$refs.container.removeClass(arr.map(function (i) {
          return "fancybox-show-" + i;
        }).join(" "));
        this.hasHiddenControls = true;
      },
      showControls: function () {
        var self = this,
            opts = self.current ? self.current.opts : self.opts,
            $container = self.$refs.container;
        self.hasHiddenControls = false;
        self.idleSecondsCounter = 0;
        $container.toggleClass("fancybox-show-toolbar", !!(opts.toolbar && opts.buttons)).toggleClass("fancybox-show-infobar", !!(opts.infobar && self.group.length > 1)).toggleClass("fancybox-show-caption", !!self.$caption).toggleClass("fancybox-show-nav", !!(opts.arrows && self.group.length > 1)).toggleClass("fancybox-is-modal", !!opts.modal);
      },
      // Toggle toolbar and caption
      // ==========================
      toggleControls: function () {
        if (this.hasHiddenControls) {
          this.showControls();
        } else {
          this.hideControls();
        }
      }
    });
    $.fancybox = {
      version: "3.5.6",
      defaults: defaults,
      // Get current instance and execute a command.
      //
      // Examples of usage:
      //
      //   $instance = $.fancybox.getInstance();
      //   $.fancybox.getInstance().jumpTo( 1 );
      //   $.fancybox.getInstance( 'jumpTo', 1 );
      //   $.fancybox.getInstance( function() {
      //       console.info( this.currIndex );
      //   });
      // ======================================================
      getInstance: function (command) {
        var instance = $('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),
            args = Array.prototype.slice.call(arguments, 1);

        if (instance instanceof FancyBox) {
          if ($.type(command) === "string") {
            instance[command].apply(instance, args);
          } else if ($.type(command) === "function") {
            command.apply(instance, args);
          }

          return instance;
        }

        return false;
      },
      // Create new instance
      // ===================
      open: function (items, opts, index) {
        return new FancyBox(items, opts, index);
      },
      // Close current or all instances
      // ==============================
      close: function (all) {
        var instance = this.getInstance();

        if (instance) {
          instance.close(); // Try to find and close next instance

          if (all === true) {
            this.close(all);
          }
        }
      },
      // Close all instances and unbind all events
      // =========================================
      destroy: function () {
        this.close(true);
        $D.add("body").off("click.fb-start", "**");
      },
      // Try to detect mobile devices
      // ============================
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      // Detect if 'translate3d' support is available
      // ============================================
      use3d: function () {
        var div = document.createElement("div");
        return window.getComputedStyle && window.getComputedStyle(div) && window.getComputedStyle(div).getPropertyValue("transform") && !(document.documentMode && document.documentMode < 11);
      }(),
      // Helper function to get current visual state of an element
      // returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
      // =====================================================================
      getTranslate: function ($el) {
        var domRect;

        if (!$el || !$el.length) {
          return false;
        }

        domRect = $el[0].getBoundingClientRect();
        return {
          top: domRect.top || 0,
          left: domRect.left || 0,
          width: domRect.width,
          height: domRect.height,
          opacity: parseFloat($el.css("opacity"))
        };
      },
      // Shortcut for setting "translate3d" properties for element
      // Can set be used to set opacity, too
      // ========================================================
      setTranslate: function ($el, props) {
        var str = "",
            css = {};

        if (!$el || !props) {
          return;
        }

        if (props.left !== undefined || props.top !== undefined) {
          str = (props.left === undefined ? $el.position().left : props.left) + "px, " + (props.top === undefined ? $el.position().top : props.top) + "px";

          if (this.use3d) {
            str = "translate3d(" + str + ", 0px)";
          } else {
            str = "translate(" + str + ")";
          }
        }

        if (props.scaleX !== undefined && props.scaleY !== undefined) {
          str += " scale(" + props.scaleX + ", " + props.scaleY + ")";
        } else if (props.scaleX !== undefined) {
          str += " scaleX(" + props.scaleX + ")";
        }

        if (str.length) {
          css.transform = str;
        }

        if (props.opacity !== undefined) {
          css.opacity = props.opacity;
        }

        if (props.width !== undefined) {
          css.width = props.width;
        }

        if (props.height !== undefined) {
          css.height = props.height;
        }

        return $el.css(css);
      },
      // Simple CSS transition handler
      // =============================
      animate: function ($el, to, duration, callback, leaveAnimationName) {
        var self = this,
            from;

        if ($.isFunction(duration)) {
          callback = duration;
          duration = null;
        }

        self.stop($el);
        from = self.getTranslate($el);
        $el.on(transitionEnd, function (e) {
          // Skip events from child elements and z-index change
          if (e && e.originalEvent && (!$el.is(e.originalEvent.target) || e.originalEvent.propertyName == "z-index")) {
            return;
          }

          self.stop($el);

          if ($.isNumeric(duration)) {
            $el.css("transition-duration", "");
          }

          if ($.isPlainObject(to)) {
            if (to.scaleX !== undefined && to.scaleY !== undefined) {
              self.setTranslate($el, {
                top: to.top,
                left: to.left,
                width: from.width * to.scaleX,
                height: from.height * to.scaleY,
                scaleX: 1,
                scaleY: 1
              });
            }
          } else if (leaveAnimationName !== true) {
            $el.removeClass(to);
          }

          if ($.isFunction(callback)) {
            callback(e);
          }
        });

        if ($.isNumeric(duration)) {
          $el.css("transition-duration", duration + "ms");
        } // Start animation by changing CSS properties or class name


        if ($.isPlainObject(to)) {
          if (to.scaleX !== undefined && to.scaleY !== undefined) {
            delete to.width;
            delete to.height;

            if ($el.parent().hasClass("fancybox-slide--image")) {
              $el.parent().addClass("fancybox-is-scaling");
            }
          }

          $.fancybox.setTranslate($el, to);
        } else {
          $el.addClass(to);
        } // Make sure that `transitionend` callback gets fired


        $el.data("timer", setTimeout(function () {
          $el.trigger(transitionEnd);
        }, duration + 33));
      },
      stop: function ($el, callCallback) {
        if ($el && $el.length) {
          clearTimeout($el.data("timer"));

          if (callCallback) {
            $el.trigger(transitionEnd);
          }

          $el.off(transitionEnd).css("transition-duration", "");
          $el.parent().removeClass("fancybox-is-scaling");
        }
      }
    }; // Default click handler for "fancyboxed" links
    // ============================================

    function _run(e, opts) {
      var items = [],
          index = 0,
          $target,
          value,
          instance; // Avoid opening multiple times

      if (e && e.isDefaultPrevented()) {
        return;
      }

      e.preventDefault();
      opts = opts || {};

      if (e && e.data) {
        opts = mergeOpts(e.data.options, opts);
      }

      $target = opts.$target || $(e.currentTarget).trigger("blur");
      instance = $.fancybox.getInstance();

      if (instance && instance.$trigger && instance.$trigger.is($target)) {
        return;
      }

      if (opts.selector) {
        items = $(opts.selector);
      } else {
        // Get all related items and find index for clicked one
        value = $target.attr("data-fancybox") || "";

        if (value) {
          items = e.data ? e.data.items : [];
          items = items.length ? items.filter('[data-fancybox="' + value + '"]') : $('[data-fancybox="' + value + '"]');
        } else {
          items = [$target];
        }
      }

      index = $(items).index($target); // Sometimes current item can not be found

      if (index < 0) {
        index = 0;
      }

      instance = $.fancybox.open(items, opts, index); // Save last active element

      instance.$trigger = $target;
    } // Create a jQuery plugin
    // ======================


    $.fn.fancybox = function (options) {
      var selector;
      options = options || {};
      selector = options.selector || false;

      if (selector) {
        // Use body element instead of document so it executes first
        $("body").off("click.fb-start", selector).on("click.fb-start", selector, {
          options: options
        }, _run);
      } else {
        this.off("click.fb-start").on("click.fb-start", {
          items: this,
          options: options
        }, _run);
      }

      return this;
    }; // Self initializing plugin for all elements having `data-fancybox` attribute
    // ==========================================================================


    $D.on("click.fb-start", "[data-fancybox]", _run); // Enable "trigger elements"
    // =========================

    $D.on("click.fb-start", "[data-fancybox-trigger]", function (e) {
      $('[data-fancybox="' + $(this).attr("data-fancybox-trigger") + '"]').eq($(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", {
        $trigger: $(this)
      });
    }); // Track focus event for better accessibility styling
    // ==================================================

    (function () {
      var buttonStr = ".fancybox-button",
          focusStr = "fancybox-focus",
          $pressed = null;
      $D.on("mousedown mouseup focus blur", buttonStr, function (e) {
        switch (e.type) {
          case "mousedown":
            $pressed = $(this);
            break;

          case "mouseup":
            $pressed = null;
            break;

          case "focusin":
            $(buttonStr).removeClass(focusStr);

            if (!$(this).is($pressed) && !$(this).is("[disabled]")) {
              $(this).addClass(focusStr);
            }

            break;

          case "focusout":
            $(buttonStr).removeClass(focusStr);
            break;
        }
      });
    })();
  })(window, document, jQuery); // ==========================================================================
  //
  // Media
  // Adds additional media type support
  //
  // ==========================================================================


  (function ($) {

    var defaults = {
      youtube: {
        matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
        params: {
          autoplay: 1,
          autohide: 1,
          fs: 1,
          rel: 0,
          hd: 1,
          wmode: "transparent",
          enablejsapi: 1,
          html5: 1
        },
        paramPlace: 8,
        type: "iframe",
        url: "https://www.youtube-nocookie.com/embed/$4",
        thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg"
      },
      vimeo: {
        matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
        params: {
          autoplay: 1,
          hd: 1,
          show_title: 1,
          show_byline: 1,
          show_portrait: 0,
          fullscreen: 1
        },
        paramPlace: 3,
        type: "iframe",
        url: "//player.vimeo.com/video/$2"
      },
      instagram: {
        matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
        type: "image",
        url: "//$1/p/$2/media/?size=l"
      },
      // Examples:
      // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
      // https://www.google.com/maps/@37.7852006,-122.4146355,14.65z
      // https://www.google.com/maps/@52.2111123,2.9237542,6.61z?hl=en
      // https://www.google.com/maps/place/Googleplex/@37.4220041,-122.0833494,17z/data=!4m5!3m4!1s0x0:0x6c296c66619367e0!8m2!3d37.4219998!4d-122.0840572
      gmap_place: {
        matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
        type: "iframe",
        url: function (rez) {
          return "//maps.google." + rez[2] + "/?ll=" + (rez[9] ? rez[9] + "&z=" + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : "") : rez[12] + "").replace(/\?/, "&") + "&output=" + (rez[12] && rez[12].indexOf("layer=c") > 0 ? "svembed" : "embed");
        }
      },
      // Examples:
      // https://www.google.com/maps/search/Empire+State+Building/
      // https://www.google.com/maps/search/?api=1&query=centurylink+field
      // https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393
      gmap_search: {
        matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
        type: "iframe",
        url: function (rez) {
          return "//maps.google." + rez[2] + "/maps?q=" + rez[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
        }
      }
    }; // Formats matching url to final form

    var format = function (url, rez, params) {
      if (!url) {
        return;
      }

      params = params || "";

      if ($.type(params) === "object") {
        params = $.param(params, true);
      }

      $.each(rez, function (key, value) {
        url = url.replace("$" + key, value || "");
      });

      if (params.length) {
        url += (url.indexOf("?") > 0 ? "&" : "?") + params;
      }

      return url;
    };

    $(document).on("objectNeedsType.fb", function (e, instance, item) {
      var url = item.src || "",
          type = false,
          media,
          thumb,
          rez,
          params,
          urlParams,
          paramObj,
          provider;
      media = $.extend(true, {}, defaults, item.opts.media); // Look for any matching media type

      $.each(media, function (providerName, providerOpts) {
        rez = url.match(providerOpts.matcher);

        if (!rez) {
          return;
        }

        type = providerOpts.type;
        provider = providerName;
        paramObj = {};

        if (providerOpts.paramPlace && rez[providerOpts.paramPlace]) {
          urlParams = rez[providerOpts.paramPlace];

          if (urlParams[0] == "?") {
            urlParams = urlParams.substring(1);
          }

          urlParams = urlParams.split("&");

          for (var m = 0; m < urlParams.length; ++m) {
            var p = urlParams[m].split("=", 2);

            if (p.length == 2) {
              paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
          }
        }

        params = $.extend(true, {}, providerOpts.params, item.opts[providerName], paramObj);
        url = $.type(providerOpts.url) === "function" ? providerOpts.url.call(this, rez, params, item) : format(providerOpts.url, rez, params);
        thumb = $.type(providerOpts.thumb) === "function" ? providerOpts.thumb.call(this, rez, params, item) : format(providerOpts.thumb, rez);

        if (providerName === "youtube") {
          url = url.replace(/&t=((\d+)m)?(\d+)s/, function (match, p1, m, s) {
            return "&start=" + ((m ? parseInt(m, 10) * 60 : 0) + parseInt(s, 10));
          });
        } else if (providerName === "vimeo") {
          url = url.replace("&%23", "#");
        }

        return false;
      }); // If it is found, then change content type and update the url

      if (type) {
        if (!item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length)) {
          item.opts.thumb = thumb;
        }

        if (type === "iframe") {
          item.opts = $.extend(true, item.opts, {
            iframe: {
              preload: false,
              attr: {
                scrolling: "no"
              }
            }
          });
        }

        $.extend(item, {
          type: type,
          src: url,
          origSrc: item.src,
          contentSource: provider,
          contentType: type === "image" ? "image" : provider == "gmap_place" || provider == "gmap_search" ? "map" : "video"
        });
      } else if (url) {
        item.type = item.opts.defaultType;
      }
    }); // Load YouTube/Video API on request to detect when video finished playing

    var VideoAPILoader = {
      youtube: {
        src: "https://www.youtube.com/iframe_api",
        class: "YT",
        loading: false,
        loaded: false
      },
      vimeo: {
        src: "https://player.vimeo.com/api/player.js",
        class: "Vimeo",
        loading: false,
        loaded: false
      },
      load: function (vendor) {
        var _this = this,
            script;

        if (this[vendor].loaded) {
          setTimeout(function () {
            _this.done(vendor);
          });
          return;
        }

        if (this[vendor].loading) {
          return;
        }

        this[vendor].loading = true;
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = this[vendor].src;

        if (vendor === "youtube") {
          window.onYouTubeIframeAPIReady = function () {
            _this[vendor].loaded = true;

            _this.done(vendor);
          };
        } else {
          script.onload = function () {
            _this[vendor].loaded = true;

            _this.done(vendor);
          };
        }

        document.body.appendChild(script);
      },
      done: function (vendor) {
        var instance, $el, player;

        if (vendor === "youtube") {
          delete window.onYouTubeIframeAPIReady;
        }

        instance = $.fancybox.getInstance();

        if (instance) {
          $el = instance.current.$content.find("iframe");

          if (vendor === "youtube" && YT !== undefined && YT) {
            player = new YT.Player($el.attr("id"), {
              events: {
                onStateChange: function (e) {
                  if (e.data == 0) {
                    instance.next();
                  }
                }
              }
            });
          } else if (vendor === "vimeo" && Vimeo !== undefined && Vimeo) {
            player = new Vimeo.Player($el);
            player.on("ended", function () {
              instance.next();
            });
          }
        }
      }
    };
    $(document).on({
      "afterShow.fb": function (e, instance, current) {
        if (instance.group.length > 1 && (current.contentSource === "youtube" || current.contentSource === "vimeo")) {
          VideoAPILoader.load(current.contentSource);
        }
      }
    });
  })(jQuery); // ==========================================================================
  //
  // Guestures
  // Adds touch guestures, handles click and tap events
  //
  // ==========================================================================


  (function (window, document, $) {

    var requestAFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || // if all else fails, use setTimeout
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    }();

    var cancelAFrame = function () {
      return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
        window.clearTimeout(id);
      };
    }();

    var getPointerXY = function (e) {
      var result = [];
      e = e.originalEvent || e || window.e;
      e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];

      for (var key in e) {
        if (e[key].pageX) {
          result.push({
            x: e[key].pageX,
            y: e[key].pageY
          });
        } else if (e[key].clientX) {
          result.push({
            x: e[key].clientX,
            y: e[key].clientY
          });
        }
      }

      return result;
    };

    var distance = function (point2, point1, what) {
      if (!point1 || !point2) {
        return 0;
      }

      if (what === "x") {
        return point2.x - point1.x;
      } else if (what === "y") {
        return point2.y - point1.y;
      }

      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };

    var isClickable = function ($el) {
      if ($el.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || $.isFunction($el.get(0).onclick) || $el.data("selectable")) {
        return true;
      } // Check for attributes like data-fancybox-next or data-fancybox-close


      for (var i = 0, atts = $el[0].attributes, n = atts.length; i < n; i++) {
        if (atts[i].nodeName.substr(0, 14) === "data-fancybox-") {
          return true;
        }
      }

      return false;
    };

    var hasScrollbars = function (el) {
      var overflowY = window.getComputedStyle(el)["overflow-y"],
          overflowX = window.getComputedStyle(el)["overflow-x"],
          vertical = (overflowY === "scroll" || overflowY === "auto") && el.scrollHeight > el.clientHeight,
          horizontal = (overflowX === "scroll" || overflowX === "auto") && el.scrollWidth > el.clientWidth;
      return vertical || horizontal;
    };

    var isScrollable = function ($el) {
      var rez = false;

      while (true) {
        rez = hasScrollbars($el.get(0));

        if (rez) {
          break;
        }

        $el = $el.parent();

        if (!$el.length || $el.hasClass("fancybox-stage") || $el.is("body")) {
          break;
        }
      }

      return rez;
    };

    var Guestures = function (instance) {
      var self = this;
      self.instance = instance;
      self.$bg = instance.$refs.bg;
      self.$stage = instance.$refs.stage;
      self.$container = instance.$refs.container;
      self.destroy();
      self.$container.on("touchstart.fb.touch mousedown.fb.touch", $.proxy(self, "ontouchstart"));
    };

    Guestures.prototype.destroy = function () {
      var self = this;
      self.$container.off(".fb.touch");
      $(document).off(".fb.touch");

      if (self.requestId) {
        cancelAFrame(self.requestId);
        self.requestId = null;
      }

      if (self.tapped) {
        clearTimeout(self.tapped);
        self.tapped = null;
      }
    };

    Guestures.prototype.ontouchstart = function (e) {
      var self = this,
          $target = $(e.target),
          instance = self.instance,
          current = instance.current,
          $slide = current.$slide,
          $content = current.$content,
          isTouchDevice = e.type == "touchstart"; // Do not respond to both (touch and mouse) events

      if (isTouchDevice) {
        self.$container.off("mousedown.fb.touch");
      } // Ignore right click


      if (e.originalEvent && e.originalEvent.button == 2) {
        return;
      } // Ignore taping on links, buttons, input elements


      if (!$slide.length || !$target.length || isClickable($target) || isClickable($target.parent())) {
        return;
      } // Ignore clicks on the scrollbar


      if (!$target.is("img") && e.originalEvent.clientX > $target[0].clientWidth + $target.offset().left) {
        return;
      } // Ignore clicks while zooming or closing


      if (!current || instance.isAnimating || current.$slide.hasClass("fancybox-animated")) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      self.realPoints = self.startPoints = getPointerXY(e);

      if (!self.startPoints.length) {
        return;
      } // Allow other scripts to catch touch event if "touch" is set to false


      if (current.touch) {
        e.stopPropagation();
      }

      self.startEvent = e;
      self.canTap = true;
      self.$target = $target;
      self.$content = $content;
      self.opts = current.opts.touch;
      self.isPanning = false;
      self.isSwiping = false;
      self.isZooming = false;
      self.isScrolling = false;
      self.canPan = instance.canPan();
      self.startTime = new Date().getTime();
      self.distanceX = self.distanceY = self.distance = 0;
      self.canvasWidth = Math.round($slide[0].clientWidth);
      self.canvasHeight = Math.round($slide[0].clientHeight);
      self.contentLastPos = null;
      self.contentStartPos = $.fancybox.getTranslate(self.$content) || {
        top: 0,
        left: 0
      };
      self.sliderStartPos = $.fancybox.getTranslate($slide); // Since position will be absolute, but we need to make it relative to the stage

      self.stagePos = $.fancybox.getTranslate(instance.$refs.stage);
      self.sliderStartPos.top -= self.stagePos.top;
      self.sliderStartPos.left -= self.stagePos.left;
      self.contentStartPos.top -= self.stagePos.top;
      self.contentStartPos.left -= self.stagePos.left;
      $(document).off(".fb.touch").on(isTouchDevice ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", $.proxy(self, "ontouchend")).on(isTouchDevice ? "touchmove.fb.touch" : "mousemove.fb.touch", $.proxy(self, "ontouchmove"));

      if ($.fancybox.isMobile) {
        document.addEventListener("scroll", self.onscroll, true);
      } // Skip if clicked outside the sliding area


      if (!(self.opts || self.canPan) || !($target.is(self.$stage) || self.$stage.find($target).length)) {
        if ($target.is(".fancybox-image")) {
          e.preventDefault();
        }

        if (!($.fancybox.isMobile && $target.parents(".fancybox-caption").length)) {
          return;
        }
      }

      self.isScrollable = isScrollable($target) || isScrollable($target.parent()); // Check if element is scrollable and try to prevent default behavior (scrolling)

      if (!($.fancybox.isMobile && self.isScrollable)) {
        e.preventDefault();
      } // One finger or mouse click - swipe or pan an image


      if (self.startPoints.length === 1 || current.hasError) {
        if (self.canPan) {
          $.fancybox.stop(self.$content);
          self.isPanning = true;
        } else {
          self.isSwiping = true;
        }

        self.$container.addClass("fancybox-is-grabbing");
      } // Two fingers - zoom image


      if (self.startPoints.length === 2 && current.type === "image" && (current.isLoaded || current.$ghost)) {
        self.canTap = false;
        self.isSwiping = false;
        self.isPanning = false;
        self.isZooming = true;
        $.fancybox.stop(self.$content);
        self.centerPointStartX = (self.startPoints[0].x + self.startPoints[1].x) * 0.5 - $(window).scrollLeft();
        self.centerPointStartY = (self.startPoints[0].y + self.startPoints[1].y) * 0.5 - $(window).scrollTop();
        self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
        self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;
        self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
      }
    };

    Guestures.prototype.onscroll = function (e) {
      var self = this;
      self.isScrolling = true;
      document.removeEventListener("scroll", self.onscroll, true);
    };

    Guestures.prototype.ontouchmove = function (e) {
      var self = this; // Make sure user has not released over iframe or disabled element

      if (e.originalEvent.buttons !== undefined && e.originalEvent.buttons === 0) {
        self.ontouchend(e);
        return;
      }

      if (self.isScrolling) {
        self.canTap = false;
        return;
      }

      self.newPoints = getPointerXY(e);

      if (!(self.opts || self.canPan) || !self.newPoints.length || !self.newPoints.length) {
        return;
      }

      if (!(self.isSwiping && self.isSwiping === true)) {
        e.preventDefault();
      }

      self.distanceX = distance(self.newPoints[0], self.startPoints[0], "x");
      self.distanceY = distance(self.newPoints[0], self.startPoints[0], "y");
      self.distance = distance(self.newPoints[0], self.startPoints[0]); // Skip false ontouchmove events (Chrome)

      if (self.distance > 0) {
        if (self.isSwiping) {
          self.onSwipe(e);
        } else if (self.isPanning) {
          self.onPan();
        } else if (self.isZooming) {
          self.onZoom();
        }
      }
    };

    Guestures.prototype.onSwipe = function (e) {
      var self = this,
          instance = self.instance,
          swiping = self.isSwiping,
          left = self.sliderStartPos.left || 0,
          angle; // If direction is not yet determined

      if (swiping === true) {
        // We need at least 10px distance to correctly calculate an angle
        if (Math.abs(self.distance) > 10) {
          self.canTap = false;

          if (instance.group.length < 2 && self.opts.vertical) {
            self.isSwiping = "y";
          } else if (instance.isDragging || self.opts.vertical === false || self.opts.vertical === "auto" && $(window).width() > 800) {
            self.isSwiping = "x";
          } else {
            angle = Math.abs(Math.atan2(self.distanceY, self.distanceX) * 180 / Math.PI);
            self.isSwiping = angle > 45 && angle < 135 ? "y" : "x";
          }

          if (self.isSwiping === "y" && $.fancybox.isMobile && self.isScrollable) {
            self.isScrolling = true;
            return;
          }

          instance.isDragging = self.isSwiping; // Reset points to avoid jumping, because we dropped first swipes to calculate the angle

          self.startPoints = self.newPoints;
          $.each(instance.slides, function (index, slide) {
            var slidePos, stagePos;
            $.fancybox.stop(slide.$slide);
            slidePos = $.fancybox.getTranslate(slide.$slide);
            stagePos = $.fancybox.getTranslate(instance.$refs.stage);
            slide.$slide.css({
              transform: "",
              opacity: "",
              "transition-duration": ""
            }).removeClass("fancybox-animated").removeClass(function (index, className) {
              return (className.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
            });

            if (slide.pos === instance.current.pos) {
              self.sliderStartPos.top = slidePos.top - stagePos.top;
              self.sliderStartPos.left = slidePos.left - stagePos.left;
            }

            $.fancybox.setTranslate(slide.$slide, {
              top: slidePos.top - stagePos.top,
              left: slidePos.left - stagePos.left
            });
          }); // Stop slideshow

          if (instance.SlideShow && instance.SlideShow.isActive) {
            instance.SlideShow.stop();
          }
        }

        return;
      } // Sticky edges


      if (swiping == "x") {
        if (self.distanceX > 0 && (self.instance.group.length < 2 || self.instance.current.index === 0 && !self.instance.current.opts.loop)) {
          left = left + Math.pow(self.distanceX, 0.8);
        } else if (self.distanceX < 0 && (self.instance.group.length < 2 || self.instance.current.index === self.instance.group.length - 1 && !self.instance.current.opts.loop)) {
          left = left - Math.pow(-self.distanceX, 0.8);
        } else {
          left = left + self.distanceX;
        }
      }

      self.sliderLastPos = {
        top: swiping == "x" ? 0 : self.sliderStartPos.top + self.distanceY,
        left: left
      };

      if (self.requestId) {
        cancelAFrame(self.requestId);
        self.requestId = null;
      }

      self.requestId = requestAFrame(function () {
        if (self.sliderLastPos) {
          $.each(self.instance.slides, function (index, slide) {
            var pos = slide.pos - self.instance.currPos;
            $.fancybox.setTranslate(slide.$slide, {
              top: self.sliderLastPos.top,
              left: self.sliderLastPos.left + pos * self.canvasWidth + pos * slide.opts.gutter
            });
          });
          self.$container.addClass("fancybox-is-sliding");
        }
      });
    };

    Guestures.prototype.onPan = function () {
      var self = this; // Prevent accidental movement (sometimes, when tapping casually, finger can move a bit)

      if (distance(self.newPoints[0], self.realPoints[0]) < ($.fancybox.isMobile ? 10 : 5)) {
        self.startPoints = self.newPoints;
        return;
      }

      self.canTap = false;
      self.contentLastPos = self.limitMovement();

      if (self.requestId) {
        cancelAFrame(self.requestId);
      }

      self.requestId = requestAFrame(function () {
        $.fancybox.setTranslate(self.$content, self.contentLastPos);
      });
    }; // Make panning sticky to the edges


    Guestures.prototype.limitMovement = function () {
      var self = this;
      var canvasWidth = self.canvasWidth;
      var canvasHeight = self.canvasHeight;
      var distanceX = self.distanceX;
      var distanceY = self.distanceY;
      var contentStartPos = self.contentStartPos;
      var currentOffsetX = contentStartPos.left;
      var currentOffsetY = contentStartPos.top;
      var currentWidth = contentStartPos.width;
      var currentHeight = contentStartPos.height;
      var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY, newOffsetX, newOffsetY;

      if (currentWidth > canvasWidth) {
        newOffsetX = currentOffsetX + distanceX;
      } else {
        newOffsetX = currentOffsetX;
      }

      newOffsetY = currentOffsetY + distanceY; // Slow down proportionally to traveled distance

      minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
      minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);
      maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
      maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5); //   ->

      if (distanceX > 0 && newOffsetX > minTranslateX) {
        newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
      } //    <-


      if (distanceX < 0 && newOffsetX < maxTranslateX) {
        newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
      } //   \/


      if (distanceY > 0 && newOffsetY > minTranslateY) {
        newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
      } //   /\


      if (distanceY < 0 && newOffsetY < maxTranslateY) {
        newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
      }

      return {
        top: newOffsetY,
        left: newOffsetX
      };
    };

    Guestures.prototype.limitPosition = function (newOffsetX, newOffsetY, newWidth, newHeight) {
      var self = this;
      var canvasWidth = self.canvasWidth;
      var canvasHeight = self.canvasHeight;

      if (newWidth > canvasWidth) {
        newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
        newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
      } else {
        // Center horizontally
        newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
      }

      if (newHeight > canvasHeight) {
        newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
        newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
      } else {
        // Center vertically
        newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
      }

      return {
        top: newOffsetY,
        left: newOffsetX
      };
    };

    Guestures.prototype.onZoom = function () {
      var self = this; // Calculate current distance between points to get pinch ratio and new width and height

      var contentStartPos = self.contentStartPos;
      var currentWidth = contentStartPos.width;
      var currentHeight = contentStartPos.height;
      var currentOffsetX = contentStartPos.left;
      var currentOffsetY = contentStartPos.top;
      var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);
      var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;
      var newWidth = Math.floor(currentWidth * pinchRatio);
      var newHeight = Math.floor(currentHeight * pinchRatio); // This is the translation due to pinch-zooming

      var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
      var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY; // Point between the two touches

      var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - $(window).scrollLeft();
      var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - $(window).scrollTop(); // And this is the translation due to translation of the centerpoint
      // between the two fingers

      var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
      var translateFromTranslatingY = centerPointEndY - self.centerPointStartY; // The new offset is the old/current one plus the total translation

      var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
      var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);
      var newPos = {
        top: newOffsetY,
        left: newOffsetX,
        scaleX: pinchRatio,
        scaleY: pinchRatio
      };
      self.canTap = false;
      self.newWidth = newWidth;
      self.newHeight = newHeight;
      self.contentLastPos = newPos;

      if (self.requestId) {
        cancelAFrame(self.requestId);
      }

      self.requestId = requestAFrame(function () {
        $.fancybox.setTranslate(self.$content, self.contentLastPos);
      });
    };

    Guestures.prototype.ontouchend = function (e) {
      var self = this;
      var swiping = self.isSwiping;
      var panning = self.isPanning;
      var zooming = self.isZooming;
      var scrolling = self.isScrolling;
      self.endPoints = getPointerXY(e);
      self.dMs = Math.max(new Date().getTime() - self.startTime, 1);
      self.$container.removeClass("fancybox-is-grabbing");
      $(document).off(".fb.touch");
      document.removeEventListener("scroll", self.onscroll, true);

      if (self.requestId) {
        cancelAFrame(self.requestId);
        self.requestId = null;
      }

      self.isSwiping = false;
      self.isPanning = false;
      self.isZooming = false;
      self.isScrolling = false;
      self.instance.isDragging = false;

      if (self.canTap) {
        return self.onTap(e);
      }

      self.speed = 100; // Speed in px/ms

      self.velocityX = self.distanceX / self.dMs * 0.5;
      self.velocityY = self.distanceY / self.dMs * 0.5;

      if (panning) {
        self.endPanning();
      } else if (zooming) {
        self.endZooming();
      } else {
        self.endSwiping(swiping, scrolling);
      }

      return;
    };

    Guestures.prototype.endSwiping = function (swiping, scrolling) {
      var self = this,
          ret = false,
          len = self.instance.group.length,
          distanceX = Math.abs(self.distanceX),
          canAdvance = swiping == "x" && len > 1 && (self.dMs > 130 && distanceX > 10 || distanceX > 50),
          speedX = 300;
      self.sliderLastPos = null; // Close if swiped vertically / navigate if horizontally

      if (swiping == "y" && !scrolling && Math.abs(self.distanceY) > 50) {
        // Continue vertical movement
        $.fancybox.animate(self.instance.current.$slide, {
          top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
          opacity: 0
        }, 200);
        ret = self.instance.close(true, 250);
      } else if (canAdvance && self.distanceX > 0) {
        ret = self.instance.previous(speedX);
      } else if (canAdvance && self.distanceX < 0) {
        ret = self.instance.next(speedX);
      }

      if (ret === false && (swiping == "x" || swiping == "y")) {
        self.instance.centerSlide(200);
      }

      self.$container.removeClass("fancybox-is-sliding");
    }; // Limit panning from edges
    // ========================


    Guestures.prototype.endPanning = function () {
      var self = this,
          newOffsetX,
          newOffsetY,
          newPos;

      if (!self.contentLastPos) {
        return;
      }

      if (self.opts.momentum === false || self.dMs > 350) {
        newOffsetX = self.contentLastPos.left;
        newOffsetY = self.contentLastPos.top;
      } else {
        // Continue movement
        newOffsetX = self.contentLastPos.left + self.velocityX * 500;
        newOffsetY = self.contentLastPos.top + self.velocityY * 500;
      }

      newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);
      newPos.width = self.contentStartPos.width;
      newPos.height = self.contentStartPos.height;
      $.fancybox.animate(self.$content, newPos, 366);
    };

    Guestures.prototype.endZooming = function () {
      var self = this;
      var current = self.instance.current;
      var newOffsetX, newOffsetY, newPos, reset;
      var newWidth = self.newWidth;
      var newHeight = self.newHeight;

      if (!self.contentLastPos) {
        return;
      }

      newOffsetX = self.contentLastPos.left;
      newOffsetY = self.contentLastPos.top;
      reset = {
        top: newOffsetY,
        left: newOffsetX,
        width: newWidth,
        height: newHeight,
        scaleX: 1,
        scaleY: 1
      }; // Reset scalex/scaleY values; this helps for perfomance and does not break animation

      $.fancybox.setTranslate(self.$content, reset);

      if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
        self.instance.scaleToFit(150);
      } else if (newWidth > current.width || newHeight > current.height) {
        self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);
      } else {
        newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);
        $.fancybox.animate(self.$content, newPos, 150);
      }
    };

    Guestures.prototype.onTap = function (e) {
      var self = this;
      var $target = $(e.target);
      var instance = self.instance;
      var current = instance.current;
      var endPoints = e && getPointerXY(e) || self.startPoints;
      var tapX = endPoints[0] ? endPoints[0].x - $(window).scrollLeft() - self.stagePos.left : 0;
      var tapY = endPoints[0] ? endPoints[0].y - $(window).scrollTop() - self.stagePos.top : 0;
      var where;

      var process = function (prefix) {
        var action = current.opts[prefix];

        if ($.isFunction(action)) {
          action = action.apply(instance, [current, e]);
        }

        if (!action) {
          return;
        }

        switch (action) {
          case "close":
            instance.close(self.startEvent);
            break;

          case "toggleControls":
            instance.toggleControls();
            break;

          case "next":
            instance.next();
            break;

          case "nextOrClose":
            if (instance.group.length > 1) {
              instance.next();
            } else {
              instance.close(self.startEvent);
            }

            break;

          case "zoom":
            if (current.type == "image" && (current.isLoaded || current.$ghost)) {
              if (instance.canPan()) {
                instance.scaleToFit();
              } else if (instance.isScaledDown()) {
                instance.scaleToActual(tapX, tapY);
              } else if (instance.group.length < 2) {
                instance.close(self.startEvent);
              }
            }

            break;
        }
      }; // Ignore right click


      if (e.originalEvent && e.originalEvent.button == 2) {
        return;
      } // Skip if clicked on the scrollbar


      if (!$target.is("img") && tapX > $target[0].clientWidth + $target.offset().left) {
        return;
      } // Check where is clicked


      if ($target.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) {
        where = "Outside";
      } else if ($target.is(".fancybox-slide")) {
        where = "Slide";
      } else if (instance.current.$content && instance.current.$content.find($target).addBack().filter($target).length) {
        where = "Content";
      } else {
        return;
      } // Check if this is a double tap


      if (self.tapped) {
        // Stop previously created single tap
        clearTimeout(self.tapped);
        self.tapped = null; // Skip if distance between taps is too big

        if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50) {
          return this;
        } // OK, now we assume that this is a double-tap


        process("dblclick" + where);
      } else {
        // Single tap will be processed if user has not clicked second time within 300ms
        // or there is no need to wait for double-tap
        self.tapX = tapX;
        self.tapY = tapY;

        if (current.opts["dblclick" + where] && current.opts["dblclick" + where] !== current.opts["click" + where]) {
          self.tapped = setTimeout(function () {
            self.tapped = null;

            if (!instance.isAnimating) {
              process("click" + where);
            }
          }, 500);
        } else {
          process("click" + where);
        }
      }

      return this;
    };

    $(document).on("onActivate.fb", function (e, instance) {
      if (instance && !instance.Guestures) {
        instance.Guestures = new Guestures(instance);
      }
    }).on("beforeClose.fb", function (e, instance) {
      if (instance && instance.Guestures) {
        instance.Guestures.destroy();
      }
    });
  })(window, document, jQuery); // ==========================================================================
  //
  // SlideShow
  // Enables slideshow functionality
  //
  // Example of usage:
  // $.fancybox.getInstance().SlideShow.start()
  //
  // ==========================================================================


  (function (document, $) {

    $.extend(true, $.fancybox.defaults, {
      btnTpl: {
        slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg>' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg>' + "</button>"
      },
      slideShow: {
        autoStart: false,
        speed: 3000,
        progress: true
      }
    });

    var SlideShow = function (instance) {
      this.instance = instance;
      this.init();
    };

    $.extend(SlideShow.prototype, {
      timer: null,
      isActive: false,
      $button: null,
      init: function () {
        var self = this,
            instance = self.instance,
            opts = instance.group[instance.currIndex].opts.slideShow;
        self.$button = instance.$refs.toolbar.find("[data-fancybox-play]").on("click", function () {
          self.toggle();
        });

        if (instance.group.length < 2 || !opts) {
          self.$button.hide();
        } else if (opts.progress) {
          self.$progress = $('<div class="fancybox-progress"></div>').appendTo(instance.$refs.inner);
        }
      },
      set: function (force) {
        var self = this,
            instance = self.instance,
            current = instance.current; // Check if reached last element

        if (current && (force === true || current.opts.loop || instance.currIndex < instance.group.length - 1)) {
          if (self.isActive && current.contentType !== "video") {
            if (self.$progress) {
              $.fancybox.animate(self.$progress.show(), {
                scaleX: 1
              }, current.opts.slideShow.speed);
            }

            self.timer = setTimeout(function () {
              if (!instance.current.opts.loop && instance.current.index == instance.group.length - 1) {
                instance.jumpTo(0);
              } else {
                instance.next();
              }
            }, current.opts.slideShow.speed);
          }
        } else {
          self.stop();
          instance.idleSecondsCounter = 0;
          instance.showControls();
        }
      },
      clear: function () {
        var self = this;
        clearTimeout(self.timer);
        self.timer = null;

        if (self.$progress) {
          self.$progress.removeAttr("style").hide();
        }
      },
      start: function () {
        var self = this,
            current = self.instance.current;

        if (current) {
          self.$button.attr("title", (current.opts.i18n[current.opts.lang] || current.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause");
          self.isActive = true;

          if (current.isComplete) {
            self.set(true);
          }

          self.instance.trigger("onSlideShowChange", true);
        }
      },
      stop: function () {
        var self = this,
            current = self.instance.current;
        self.clear();
        self.$button.attr("title", (current.opts.i18n[current.opts.lang] || current.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play");
        self.isActive = false;
        self.instance.trigger("onSlideShowChange", false);

        if (self.$progress) {
          self.$progress.removeAttr("style").hide();
        }
      },
      toggle: function () {
        var self = this;

        if (self.isActive) {
          self.stop();
        } else {
          self.start();
        }
      }
    });
    $(document).on({
      "onInit.fb": function (e, instance) {
        if (instance && !instance.SlideShow) {
          instance.SlideShow = new SlideShow(instance);
        }
      },
      "beforeShow.fb": function (e, instance, current, firstRun) {
        var SlideShow = instance && instance.SlideShow;

        if (firstRun) {
          if (SlideShow && current.opts.slideShow.autoStart) {
            SlideShow.start();
          }
        } else if (SlideShow && SlideShow.isActive) {
          SlideShow.clear();
        }
      },
      "afterShow.fb": function (e, instance, current) {
        var SlideShow = instance && instance.SlideShow;

        if (SlideShow && SlideShow.isActive) {
          SlideShow.set();
        }
      },
      "afterKeydown.fb": function (e, instance, current, keypress, keycode) {
        var SlideShow = instance && instance.SlideShow; // "P" or Spacebar

        if (SlideShow && current.opts.slideShow && (keycode === 80 || keycode === 32) && !$(document.activeElement).is("button,a,input")) {
          keypress.preventDefault();
          SlideShow.toggle();
        }
      },
      "beforeClose.fb onDeactivate.fb": function (e, instance) {
        var SlideShow = instance && instance.SlideShow;

        if (SlideShow) {
          SlideShow.stop();
        }
      }
    }); // Page Visibility API to pause slideshow when window is not active

    $(document).on("visibilitychange", function () {
      var instance = $.fancybox.getInstance(),
          SlideShow = instance && instance.SlideShow;

      if (SlideShow && SlideShow.isActive) {
        if (document.hidden) {
          SlideShow.clear();
        } else {
          SlideShow.set();
        }
      }
    });
  })(document, jQuery); // ==========================================================================
  //
  // FullScreen
  // Adds fullscreen functionality
  //
  // ==========================================================================


  (function (document, $) {

    var fn = function () {
      var fnMap = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], // new WebKit
      ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], // old WebKit (Safari 5.1)
      ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]];
      var ret = {};

      for (var i = 0; i < fnMap.length; i++) {
        var val = fnMap[i];

        if (val && val[1] in document) {
          for (var j = 0; j < val.length; j++) {
            ret[fnMap[0][j]] = val[j];
          }

          return ret;
        }
      }

      return false;
    }();

    if (fn) {
      var FullScreen = {
        request: function (elem) {
          elem = elem || document.documentElement;
          elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
        },
        exit: function () {
          document[fn.exitFullscreen]();
        },
        toggle: function (elem) {
          elem = elem || document.documentElement;

          if (this.isFullscreen()) {
            this.exit();
          } else {
            this.request(elem);
          }
        },
        isFullscreen: function () {
          return Boolean(document[fn.fullscreenElement]);
        },
        enabled: function () {
          return Boolean(document[fn.fullscreenEnabled]);
        }
      };
      $.extend(true, $.fancybox.defaults, {
        btnTpl: {
          fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>' + "</button>"
        },
        fullScreen: {
          autoStart: false
        }
      });
      $(document).on(fn.fullscreenchange, function () {
        var isFullscreen = FullScreen.isFullscreen(),
            instance = $.fancybox.getInstance();

        if (instance) {
          // If image is zooming, then force to stop and reposition properly
          if (instance.current && instance.current.type === "image" && instance.isAnimating) {
            instance.isAnimating = false;
            instance.update(true, true, 0);

            if (!instance.isComplete) {
              instance.complete();
            }
          }

          instance.trigger("onFullscreenChange", isFullscreen);
          instance.$refs.container.toggleClass("fancybox-is-fullscreen", isFullscreen);
          instance.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter", !isFullscreen).toggleClass("fancybox-button--fsexit", isFullscreen);
        }
      });
    }

    $(document).on({
      "onInit.fb": function (e, instance) {
        var $container;

        if (!fn) {
          instance.$refs.toolbar.find("[data-fancybox-fullscreen]").remove();
          return;
        }

        if (instance && instance.group[instance.currIndex].opts.fullScreen) {
          $container = instance.$refs.container;
          $container.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function (e) {
            e.stopPropagation();
            e.preventDefault();
            FullScreen.toggle();
          });

          if (instance.opts.fullScreen && instance.opts.fullScreen.autoStart === true) {
            FullScreen.request();
          } // Expose API


          instance.FullScreen = FullScreen;
        } else if (instance) {
          instance.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();
        }
      },
      "afterKeydown.fb": function (e, instance, current, keypress, keycode) {
        // "F"
        if (instance && instance.FullScreen && keycode === 70) {
          keypress.preventDefault();
          instance.FullScreen.toggle();
        }
      },
      "beforeClose.fb": function (e, instance) {
        if (instance && instance.FullScreen && instance.$refs.container.hasClass("fancybox-is-fullscreen")) {
          FullScreen.exit();
        }
      }
    });
  })(document, jQuery); // ==========================================================================
  //
  // Thumbs
  // Displays thumbnails in a grid
  //
  // ==========================================================================


  (function (document, $) {

    var CLASS = "fancybox-thumbs",
        CLASS_ACTIVE = CLASS + "-active"; // Make sure there are default values

    $.fancybox.defaults = $.extend(true, {
      btnTpl: {
        thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg>' + "</button>"
      },
      thumbs: {
        autoStart: false,
        // Display thumbnails on opening
        hideOnClose: true,
        // Hide thumbnail grid when closing animation starts
        parentEl: ".fancybox-container",
        // Container is injected into this element
        axis: "y" // Vertical (y) or horizontal (x) scrolling

      }
    }, $.fancybox.defaults);

    var FancyThumbs = function (instance) {
      this.init(instance);
    };

    $.extend(FancyThumbs.prototype, {
      $button: null,
      $grid: null,
      $list: null,
      isVisible: false,
      isActive: false,
      init: function (instance) {
        var self = this,
            group = instance.group,
            enabled = 0;
        self.instance = instance;
        self.opts = group[instance.currIndex].opts.thumbs;
        instance.Thumbs = self;
        self.$button = instance.$refs.toolbar.find("[data-fancybox-thumbs]"); // Enable thumbs if at least two group items have thumbnails

        for (var i = 0, len = group.length; i < len; i++) {
          if (group[i].thumb) {
            enabled++;
          }

          if (enabled > 1) {
            break;
          }
        }

        if (enabled > 1 && !!self.opts) {
          self.$button.removeAttr("style").on("click", function () {
            self.toggle();
          });
          self.isActive = true;
        } else {
          self.$button.hide();
        }
      },
      create: function () {
        var self = this,
            instance = self.instance,
            parentEl = self.opts.parentEl,
            list = [],
            src;

        if (!self.$grid) {
          // Create main element
          self.$grid = $('<div class="' + CLASS + " " + CLASS + "-" + self.opts.axis + '"></div>').appendTo(instance.$refs.container.find(parentEl).addBack().filter(parentEl)); // Add "click" event that performs gallery navigation

          self.$grid.on("click", "a", function () {
            instance.jumpTo($(this).attr("data-index"));
          });
        } // Build the list


        if (!self.$list) {
          self.$list = $('<div class="' + CLASS + '__list">').appendTo(self.$grid);
        }

        $.each(instance.group, function (i, item) {
          src = item.thumb;

          if (!src && item.type === "image") {
            src = item.src;
          }

          list.push('<a href="javascript:;" tabindex="0" data-index="' + i + '"' + (src && src.length ? ' style="background-image:url(' + src + ')"' : 'class="fancybox-thumbs-missing"') + "></a>");
        });
        self.$list[0].innerHTML = list.join("");

        if (self.opts.axis === "x") {
          // Set fixed width for list element to enable horizontal scrolling
          self.$list.width(parseInt(self.$grid.css("padding-right"), 10) + instance.group.length * self.$list.children().eq(0).outerWidth(true));
        }
      },
      focus: function (duration) {
        var self = this,
            $list = self.$list,
            $grid = self.$grid,
            thumb,
            thumbPos;

        if (!self.instance.current) {
          return;
        }

        thumb = $list.children().removeClass(CLASS_ACTIVE).filter('[data-index="' + self.instance.current.index + '"]').addClass(CLASS_ACTIVE);
        thumbPos = thumb.position(); // Check if need to scroll to make current thumb visible

        if (self.opts.axis === "y" && (thumbPos.top < 0 || thumbPos.top > $list.height() - thumb.outerHeight())) {
          $list.stop().animate({
            scrollTop: $list.scrollTop() + thumbPos.top
          }, duration);
        } else if (self.opts.axis === "x" && (thumbPos.left < $grid.scrollLeft() || thumbPos.left > $grid.scrollLeft() + ($grid.width() - thumb.outerWidth()))) {
          $list.parent().stop().animate({
            scrollLeft: thumbPos.left
          }, duration);
        }
      },
      update: function () {
        var that = this;
        that.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible);

        if (that.isVisible) {
          if (!that.$grid) {
            that.create();
          }

          that.instance.trigger("onThumbsShow");
          that.focus(0);
        } else if (that.$grid) {
          that.instance.trigger("onThumbsHide");
        } // Update content position


        that.instance.update();
      },
      hide: function () {
        this.isVisible = false;
        this.update();
      },
      show: function () {
        this.isVisible = true;
        this.update();
      },
      toggle: function () {
        this.isVisible = !this.isVisible;
        this.update();
      }
    });
    $(document).on({
      "onInit.fb": function (e, instance) {
        var Thumbs;

        if (instance && !instance.Thumbs) {
          Thumbs = new FancyThumbs(instance);

          if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
            Thumbs.show();
          }
        }
      },
      "beforeShow.fb": function (e, instance, item, firstRun) {
        var Thumbs = instance && instance.Thumbs;

        if (Thumbs && Thumbs.isVisible) {
          Thumbs.focus(firstRun ? 0 : 250);
        }
      },
      "afterKeydown.fb": function (e, instance, current, keypress, keycode) {
        var Thumbs = instance && instance.Thumbs; // "G"

        if (Thumbs && Thumbs.isActive && keycode === 71) {
          keypress.preventDefault();
          Thumbs.toggle();
        }
      },
      "beforeClose.fb": function (e, instance) {
        var Thumbs = instance && instance.Thumbs;

        if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
          Thumbs.$grid.hide();
        }
      }
    });
  })(document, jQuery); //// ==========================================================================
  //
  // Share
  // Displays simple form for sharing current url
  //
  // ==========================================================================


  (function (document, $) {

    $.extend(true, $.fancybox.defaults, {
      btnTpl: {
        share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg>' + "</button>"
      },
      share: {
        url: function (instance, item) {
          return (!instance.currentHash && !(item.type === "inline" || item.type === "html") ? item.origSrc || item.src : false) || window.location;
        },
        tpl: '<div class="fancybox-share">' + "<h1>{{SHARE}}</h1>" + "<p>" + '<a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>' + "<span>Facebook</span>" + "</a>" + '<a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>' + "<span>Twitter</span>" + "</a>" + '<a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg>' + "<span>Pinterest</span>" + "</a>" + "</p>" + '<p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p>' + "</div>"
      }
    });

    function escapeHtml(string) {
      var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;"
      };
      return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
      });
    }

    $(document).on("click", "[data-fancybox-share]", function () {
      var instance = $.fancybox.getInstance(),
          current = instance.current || null,
          url,
          tpl;

      if (!current) {
        return;
      }

      if ($.type(current.opts.share.url) === "function") {
        url = current.opts.share.url.apply(current, [instance, current]);
      }

      tpl = current.opts.share.tpl.replace(/\{\{media\}\}/g, current.type === "image" ? encodeURIComponent(current.src) : "").replace(/\{\{url\}\}/g, encodeURIComponent(url)).replace(/\{\{url_raw\}\}/g, escapeHtml(url)).replace(/\{\{descr\}\}/g, instance.$caption ? encodeURIComponent(instance.$caption.text()) : "");
      $.fancybox.open({
        src: instance.translate(instance, tpl),
        type: "html",
        opts: {
          touch: false,
          animationEffect: false,
          afterLoad: function (shareInstance, shareCurrent) {
            // Close self if parent instance is closing
            instance.$refs.container.one("beforeClose.fb", function () {
              shareInstance.close(null, 0);
            }); // Opening links in a popup window

            shareCurrent.$content.find(".fancybox-share__button").click(function () {
              window.open(this.href, "Share", "width=550, height=450");
              return false;
            });
          },
          mobile: {
            autoFocus: false
          }
        }
      });
    });
  })(document, jQuery); // ==========================================================================
  //
  // Hash
  // Enables linking to each modal
  //
  // ==========================================================================


  (function (window, document, $) {

    if (!$.escapeSelector) {
      $.escapeSelector = function (sel) {
        var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

        var fcssescape = function (ch, asCodePoint) {
          if (asCodePoint) {
            // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
            if (ch === "\0") {
              return "\uFFFD";
            } // Control characters and (dependent upon position) numbers get escaped as code points


            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
          } // Other potentially-special ASCII characters get backslash-escaped


          return "\\" + ch;
        };

        return (sel + "").replace(rcssescape, fcssescape);
      };
    } // Get info about gallery name and current index from url


    function parseUrl() {
      var hash = window.location.hash.substr(1),
          rez = hash.split("-"),
          index = rez.length > 1 && /^\+?\d+$/.test(rez[rez.length - 1]) ? parseInt(rez.pop(-1), 10) || 1 : 1,
          gallery = rez.join("-");
      return {
        hash: hash,

        /* Index is starting from 1 */
        index: index < 1 ? 1 : index,
        gallery: gallery
      };
    } // Trigger click evnt on links to open new fancyBox instance


    function triggerFromUrl(url) {
      if (url.gallery !== "") {
        // If we can find element matching 'data-fancybox' atribute,
        // then triggering click event should start fancyBox
        $("[data-fancybox='" + $.escapeSelector(url.gallery) + "']").eq(url.index - 1).focus().trigger("click.fb-start");
      }
    } // Get gallery name from current instance


    function getGalleryID(instance) {
      var opts, ret;

      if (!instance) {
        return false;
      }

      opts = instance.current ? instance.current.opts : instance.opts;
      ret = opts.hash || (opts.$orig ? opts.$orig.data("fancybox") || opts.$orig.data("fancybox-trigger") : "");
      return ret === "" ? false : ret;
    } // Start when DOM becomes ready


    $(function () {
      // Check if user has disabled this module
      if ($.fancybox.defaults.hash === false) {
        return;
      } // Update hash when opening/closing fancyBox


      $(document).on({
        "onInit.fb": function (e, instance) {
          var url, gallery;

          if (instance.group[instance.currIndex].opts.hash === false) {
            return;
          }

          url = parseUrl();
          gallery = getGalleryID(instance); // Make sure gallery start index matches index from hash

          if (gallery && url.gallery && gallery == url.gallery) {
            instance.currIndex = url.index - 1;
          }
        },
        "beforeShow.fb": function (e, instance, current, firstRun) {
          var gallery;

          if (!current || current.opts.hash === false) {
            return;
          } // Check if need to update window hash


          gallery = getGalleryID(instance);

          if (!gallery) {
            return;
          } // Variable containing last hash value set by fancyBox
          // It will be used to determine if fancyBox needs to close after hash change is detected


          instance.currentHash = gallery + (instance.group.length > 1 ? "-" + (current.index + 1) : ""); // If current hash is the same (this instance most likely is opened by hashchange), then do nothing

          if (window.location.hash === "#" + instance.currentHash) {
            return;
          }

          if (firstRun && !instance.origHash) {
            instance.origHash = window.location.hash;
          }

          if (instance.hashTimer) {
            clearTimeout(instance.hashTimer);
          } // Update hash


          instance.hashTimer = setTimeout(function () {
            if ("replaceState" in window.history) {
              window.history[firstRun ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + "#" + instance.currentHash);

              if (firstRun) {
                instance.hasCreatedHistory = true;
              }
            } else {
              window.location.hash = instance.currentHash;
            }

            instance.hashTimer = null;
          }, 300);
        },
        "beforeClose.fb": function (e, instance, current) {
          if (!current || current.opts.hash === false) {
            return;
          }

          clearTimeout(instance.hashTimer); // Goto previous history entry

          if (instance.currentHash && instance.hasCreatedHistory) {
            window.history.back();
          } else if (instance.currentHash) {
            if ("replaceState" in window.history) {
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (instance.origHash || ""));
            } else {
              window.location.hash = instance.origHash;
            }
          }

          instance.currentHash = null;
        }
      }); // Check if need to start/close after url has changed

      $(window).on("hashchange.fb", function () {
        var url = parseUrl(),
            fb = null; // Find last fancyBox instance that has "hash"

        $.each($(".fancybox-container").get().reverse(), function (index, value) {
          var tmp = $(value).data("FancyBox");

          if (tmp && tmp.currentHash) {
            fb = tmp;
            return false;
          }
        });

        if (fb) {
          // Now, compare hash values
          if (fb.currentHash !== url.gallery + "-" + url.index && !(url.index === 1 && fb.currentHash == url.gallery)) {
            fb.currentHash = null;
            fb.close();
          }
        } else if (url.gallery !== "") {
          triggerFromUrl(url);
        }
      }); // Check current hash and trigger click event on matching element to start fancyBox, if needed

      setTimeout(function () {
        if (!$.fancybox.getInstance()) {
          triggerFromUrl(parseUrl());
        }
      }, 50);
    });
  })(window, document, jQuery); // ==========================================================================
  //
  // Wheel
  // Basic mouse weheel support for gallery navigation
  //
  // ==========================================================================


  (function (document, $) {

    var prevTime = new Date().getTime();
    $(document).on({
      "onInit.fb": function (e, instance, current) {
        instance.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function (e) {
          var current = instance.current,
              currTime = new Date().getTime();

          if (instance.group.length < 2 || current.opts.wheel === false || current.opts.wheel === "auto" && current.type !== "image") {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          if (current.$slide.hasClass("fancybox-animated")) {
            return;
          }

          e = e.originalEvent || e;

          if (currTime - prevTime < 250) {
            return;
          }

          prevTime = currTime;
          instance[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "next" : "previous"]();
        });
      }
    });
  })(document, jQuery);

}());

(function () {
  'use strict';

  jQuery(document).ready(function ($) {
    if ($("#navToggle").length) {
      var nav = responsiveNav(".nav-collapse", {
        customToggle: "#navToggle"
      });
    }

    $("[data-fancybox]").fancybox({
      loop: true
    });
  });

}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Jlc3BvbnNpdmUtbmF2LmpzIiwibm9kZV9tb2R1bGVzL0BmYW5jeWFwcHMvZmFuY3lib3gvZGlzdC9qcXVlcnkuZmFuY3lib3guanMiLCJqcy9hcHAuanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJ3aW5kb3ciLCJpbmRleCIsInJlc3BvbnNpdmVOYXYiLCJlbCIsIm9wdGlvbnMiLCJjb21wdXRlZCIsImdldENvbXB1dGVkU3R5bGUiLCJnZXRQcm9wZXJ0eVZhbHVlIiwicHJvcCIsInJlIiwidGVzdCIsInJlcGxhY2UiLCJhcmd1bWVudHMiLCJ0b1VwcGVyQ2FzZSIsImN1cnJlbnRTdHlsZSIsImFkZEV2ZW50IiwiZXZ0IiwiZm4iLCJidWJibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImhhbmRsZUV2ZW50IiwiY2FsbCIsImF0dGFjaEV2ZW50IiwicmVtb3ZlRXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGV0YWNoRXZlbnQiLCJnZXRDaGlsZHJlbiIsImNoaWxkcmVuIiwibGVuZ3RoIiwiRXJyb3IiLCJpIiwibm9kZVR5cGUiLCJwdXNoIiwic2V0QXR0cmlidXRlcyIsImF0dHJzIiwia2V5Iiwic2V0QXR0cmlidXRlIiwiYWRkQ2xhc3MiLCJjbHMiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJyZWciLCJSZWdFeHAiLCJmb3JFYWNoIiwiYXJyYXkiLCJjYWxsYmFjayIsInNjb3BlIiwibmF2Iiwib3B0cyIsIm5hdlRvZ2dsZSIsInN0eWxlRWxlbWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sRWwiLCJkb2N1bWVudEVsZW1lbnQiLCJoYXNBbmltRmluaXNoZWQiLCJpc01vYmlsZSIsIm5hdk9wZW4iLCJSZXNwb25zaXZlTmF2IiwiYW5pbWF0ZSIsInRyYW5zaXRpb24iLCJsYWJlbCIsImluc2VydCIsImN1c3RvbVRvZ2dsZSIsImNsb3NlT25OYXZDbGljayIsIm9wZW5Qb3MiLCJuYXZDbGFzcyIsIm5hdkFjdGl2ZUNsYXNzIiwianNDbGFzcyIsImluaXQiLCJvcGVuIiwiY2xvc2UiLCJ3cmFwcGVyRWwiLCJnZXRFbGVtZW50QnlJZCIsIndyYXBwZXIiLCJxdWVyeVNlbGVjdG9yIiwiaW5uZXIiLCJfaW5pdCIsInByb3RvdHlwZSIsImRlc3Ryb3kiLCJfcmVtb3ZlU3R5bGVzIiwicmVtb3ZlQXR0cmlidXRlIiwiYm9keSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInRvZ2dsZSIsInN0eWxlIiwicG9zaXRpb24iLCJzZXRUaW1lb3V0IiwicmVzaXplIiwibWF0Y2giLCJfY3JlYXRlU3R5bGVzIiwiX2NhbGNIZWlnaHQiLCJldmVudCIsInR5cGUiLCJfb25Ub3VjaFN0YXJ0IiwiX29uVG91Y2hNb3ZlIiwiX29uVG91Y2hFbmQiLCJfcHJldmVudERlZmF1bHQiLCJfb25LZXlVcCIsIl9jbG9zZU9uTmF2Q2xpY2siLCJfY3JlYXRlVG9nZ2xlIiwiX3RyYW5zaXRpb25zIiwic2VsZiIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXBwZW5kQ2hpbGQiLCJpbm5lckhUTUwiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsInRvZ2dsZUVsIiwibGlua3MiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsInJldHVyblZhbHVlIiwiRXZlbnQiLCJzdGFydFgiLCJ0b3VjaGVzIiwiY2xpZW50WCIsInN0YXJ0WSIsImNsaWVudFkiLCJ0b3VjaEhhc01vdmVkIiwiTWF0aCIsImFicyIsIndoaWNoIiwiYnV0dG9uIiwia2V5Q29kZSIsIm9ialN0eWxlIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInNhdmVkSGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiaW5uZXJTdHlsZXMiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsIm1vZHVsZSIsImV4cG9ydHMiLCIkIiwidW5kZWZpbmVkIiwiY29uc29sZSIsImluZm8iLCJzdHVmZiIsImZhbmN5Ym94IiwiZGVmYXVsdHMiLCJjbG9zZUV4aXN0aW5nIiwibG9vcCIsImd1dHRlciIsImtleWJvYXJkIiwicHJldmVudENhcHRpb25PdmVybGFwIiwiYXJyb3dzIiwiaW5mb2JhciIsInNtYWxsQnRuIiwidG9vbGJhciIsImJ1dHRvbnMiLCJpZGxlVGltZSIsInByb3RlY3QiLCJtb2RhbCIsImltYWdlIiwicHJlbG9hZCIsImFqYXgiLCJzZXR0aW5ncyIsImRhdGEiLCJpZnJhbWUiLCJ0cGwiLCJjc3MiLCJhdHRyIiwic2Nyb2xsaW5nIiwidmlkZW8iLCJmb3JtYXQiLCJhdXRvU3RhcnQiLCJkZWZhdWx0VHlwZSIsImFuaW1hdGlvbkVmZmVjdCIsImFuaW1hdGlvbkR1cmF0aW9uIiwiem9vbU9wYWNpdHkiLCJ0cmFuc2l0aW9uRWZmZWN0IiwidHJhbnNpdGlvbkR1cmF0aW9uIiwic2xpZGVDbGFzcyIsImJhc2VDbGFzcyIsImJhc2VUcGwiLCJzcGlubmVyVHBsIiwiZXJyb3JUcGwiLCJidG5UcGwiLCJkb3dubG9hZCIsInpvb20iLCJhcnJvd0xlZnQiLCJhcnJvd1JpZ2h0IiwicGFyZW50RWwiLCJoaWRlU2Nyb2xsYmFyIiwiYXV0b0ZvY3VzIiwiYmFja0ZvY3VzIiwidHJhcEZvY3VzIiwiZnVsbFNjcmVlbiIsInRvdWNoIiwidmVydGljYWwiLCJtb21lbnR1bSIsImhhc2giLCJtZWRpYSIsInNsaWRlU2hvdyIsInNwZWVkIiwidGh1bWJzIiwiaGlkZU9uQ2xvc2UiLCJheGlzIiwid2hlZWwiLCJvbkluaXQiLCJub29wIiwiYmVmb3JlTG9hZCIsImFmdGVyTG9hZCIsImJlZm9yZVNob3ciLCJhZnRlclNob3ciLCJiZWZvcmVDbG9zZSIsImFmdGVyQ2xvc2UiLCJvbkFjdGl2YXRlIiwib25EZWFjdGl2YXRlIiwiY2xpY2tDb250ZW50IiwiY3VycmVudCIsImNsaWNrU2xpZGUiLCJjbGlja091dHNpZGUiLCJkYmxjbGlja0NvbnRlbnQiLCJkYmxjbGlja1NsaWRlIiwiZGJsY2xpY2tPdXRzaWRlIiwibW9iaWxlIiwibGFuZyIsImkxOG4iLCJlbiIsIkNMT1NFIiwiTkVYVCIsIlBSRVYiLCJFUlJPUiIsIlBMQVlfU1RBUlQiLCJQTEFZX1NUT1AiLCJGVUxMX1NDUkVFTiIsIlRIVU1CUyIsIkRPV05MT0FEIiwiU0hBUkUiLCJaT09NIiwiZGUiLCIkVyIsIiREIiwiY2FsbGVkIiwiaXNRdWVyeSIsIm9iaiIsImhhc093blByb3BlcnR5IiwicmVxdWVzdEFGcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJvQ2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJpZCIsImNsZWFyVGltZW91dCIsInRyYW5zaXRpb25FbmQiLCJ0IiwidHJhbnNpdGlvbnMiLCJmb3JjZVJlZHJhdyIsIiRlbCIsIm1lcmdlT3B0cyIsIm9wdHMxIiwib3B0czIiLCJyZXoiLCJleHRlbmQiLCJlYWNoIiwidmFsdWUiLCJpc0FycmF5IiwiaW5WaWV3cG9ydCIsImVsZW0iLCJlbGVtQ2VudGVyIiwib3duZXJEb2N1bWVudCIsIngiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0Iiwib2Zmc2V0V2lkdGgiLCJ5IiwidG9wIiwiZWxlbWVudEZyb21Qb2ludCIsIkZhbmN5Qm94IiwiY29udGVudCIsImlzUGxhaW5PYmplY3QiLCJjdXJySW5kZXgiLCJwYXJzZUludCIsInByZXZJbmRleCIsInByZXZQb3MiLCJjdXJyUG9zIiwiZmlyc3RSdW4iLCJncm91cCIsInNsaWRlcyIsImFkZENvbnRlbnQiLCJmaXJzdEl0ZW0iLCJmaXJzdEl0ZW1PcHRzIiwiJGNvbnRhaW5lciIsImJ1dHRvblN0ciIsImdldEluc3RhbmNlIiwic2Nyb2xsSGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJhcHBlbmQiLCJpbm5lcldpZHRoIiwiY2xpZW50V2lkdGgiLCJ0cmFuc2xhdGUiLCJhcHBlbmRUbyIsIiRyZWZzIiwiY29udGFpbmVyIiwiaXRlbSIsImZpbmQiLCJ0cmlnZ2VyIiwiYWN0aXZhdGUiLCJqdW1wVG8iLCJzdHIiLCJhcnIiLCJuIiwiaXRlbXMiLCJtYWtlQXJyYXkiLCIkaXRlbSIsImZvdW5kIiwic3JjIiwic3JjUGFydHMiLCIkb3JpZyIsImNvbnRlbnRUeXBlIiwiY2hhckF0IiwiaW5BcnJheSIsIiR0aHVtYiIsIiR0cmlnZ2VyIiwidGh1bWIiLCJjYXB0aW9uIiwiYXBwbHkiLCJzcGxpdCIsInNoaWZ0IiwiZmlsdGVyIiwiT2JqZWN0Iiwia2V5cyIsInVwZGF0ZUNvbnRyb2xzIiwiVGh1bWJzIiwiaXNBY3RpdmUiLCJjcmVhdGUiLCJmb2N1cyIsImFkZEV2ZW50cyIsInJlbW92ZUV2ZW50cyIsIm9uIiwicHJldmlvdXMiLCJuZXh0IiwiaXNTY2FsZWREb3duIiwib3JpZ2luYWxFdmVudCIsInJlcXVlc3RJZCIsInVwZGF0ZSIsInN0YWdlIiwiaGlkZSIsInNob3ciLCJpbnN0YW5jZSIsImtleWNvZGUiLCJjdHJsS2V5IiwiYWx0S2V5Iiwic2hpZnRLZXkiLCJ0YXJnZXQiLCJpcyIsImlkbGVTZWNvbmRzQ291bnRlciIsImlzSWRsZSIsInNob3dDb250cm9scyIsImlkbGVJbnRlcnZhbCIsInNldEludGVydmFsIiwiaXNEcmFnZ2luZyIsImhpZGVDb250cm9scyIsIm9mZiIsImNsZWFySW50ZXJ2YWwiLCJkdXJhdGlvbiIsInBvcyIsImdyb3VwTGVuIiwiaXNNb3ZlZCIsInNsaWRlUG9zIiwic3RhZ2VQb3MiLCJkaWZmIiwiaXNDbG9zaW5nIiwiaXNBbmltYXRpbmciLCJjcmVhdGVTbGlkZSIsImZvcmNlZER1cmF0aW9uIiwiaXNOdW1lcmljIiwiJHNsaWRlIiwibG9hZFNsaWRlIiwiZ2V0VHJhbnNsYXRlIiwic2xpZGUiLCJzdG9wIiwiaXNDb21wbGV0ZSIsIndpZHRoIiwiam9pbiIsImxlZnRQb3MiLCJzZXRUcmFuc2xhdGUiLCJ0cmFuc2Zvcm0iLCJvcGFjaXR5IiwiY29tcGxldGUiLCJpc0xvYWRlZCIsInJldmVhbENvbnRlbnQiLCJ1cGRhdGVTbGlkZSIsInNjYWxlVG9BY3R1YWwiLCIkY29udGVudCIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwiaGVpZ2h0IiwibmV3SW1nV2lkdGgiLCJuZXdJbWdIZWlnaHQiLCJpbWdQb3MiLCJwb3NYIiwicG9zWSIsInNjYWxlWCIsInNjYWxlWSIsImhhc0Vycm9yIiwidXBkYXRlQ3Vyc29yIiwiU2xpZGVTaG93Iiwic2NhbGVUb0ZpdCIsImVuZCIsImdldEZpdFBvcyIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwibWluUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBhcnNlRmxvYXQiLCJtaW4iLCJmbG9vciIsInJhdGlvIiwiYWRqdXN0Q2FwdGlvbiIsImFkanVzdExheW91dCIsImFkZCIsIm5hdmlnYXRpb24iLCJ0b2dnbGVDbGFzcyIsImdldCIsImNsaWVudEhlaWdodCIsImNlbnRlclNsaWRlIiwic2libGluZ3MiLCJwYXJlbnQiLCJoYXNDbGFzcyIsIm5leHRXaWR0aCIsIm5leHRIZWlnaHQiLCJjYW5QYW4iLCJpc1pvb21hYmxlIiwiR3Vlc3R1cmVzIiwiaXNGdW5jdGlvbiIsImZpdFBvcyIsImFqYXhMb2FkIiwiaXNMb2FkaW5nIiwic2V0SW1hZ2UiLCJzZXRJZnJhbWUiLCJzZXRDb250ZW50IiwidmlkZW9Gb3JtYXQiLCJzZXRFcnJvciIsInNob3dMb2FkaW5nIiwidXJsIiwic3VjY2VzcyIsInRleHRTdGF0dXMiLCJlcnJvciIsImpxWEhSIiwib25lIiwiYWJvcnQiLCJnaG9zdCIsIiRpbWciLCIkaW1hZ2UiLCJjaGVja1NyY3NldCIsIm9uZXJyb3IiLCJyZW1vdmUiLCIkZ2hvc3QiLCJvbmxvYWQiLCJzZXRCaWdJbWFnZSIsInNyY3NldCIsInRlbXAiLCJweFJhdGlvIiwid2luZG93V2lkdGgiLCJkZXZpY2VQaXhlbFJhdGlvIiwibWFwIiwicmV0IiwidHJpbSIsInN1YnN0cmluZyIsInBvc3RmaXgiLCJzb3J0IiwiYSIsImIiLCJqIiwiaW1nIiwic2l6ZXMiLCJyZXNvbHZlSW1hZ2VTbGlkZVNpemUiLCJuYXR1cmFsV2lkdGgiLCJuYXR1cmFsSGVpZ2h0Iiwicm91bmQiLCJtYXgiLCJoaWRlTG9hZGluZyIsInJlYWR5U3RhdGUiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIiRpZnJhbWUiLCJEYXRlIiwiZ2V0VGltZSIsImlzUmVhZHkiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCIkY29udGVudHMiLCIkYm9keSIsImNvbnRlbnRzIiwiaWdub3JlIiwiY2VpbCIsIm91dGVyV2lkdGgiLCJvdXRlckhlaWdodCIsInVuYmluZCIsImVtcHR5IiwiaXNSZXZlYWxlZCIsInBhcmVudHMiLCIkcGxhY2Vob2xkZXIiLCJpbnNlcnRBZnRlciIsImh0bWwiLCJhZnRlciIsIiRzbWFsbEJ0biIsIndyYXAiLCJmaXJzdCIsIndyYXBJbm5lciIsIiRzcGlubmVyIiwiZmFkZUluIiwicHJldmVudE92ZXJsYXAiLCIkY2FwdGlvbiIsIiRjbG9uZSIsImNhcHRpb25IIiwiY2xvbmUiLCJlcSIsIm1hcmdpbkJvdHRvbSIsImlubGluZVBhZGRpbmciLCJhY3R1YWxQYWRkaW5nIiwiZGlzYWJsZUxheW91dEZpeCIsInN0YXJ0IiwiZWZmZWN0IiwiZWZmZWN0Q2xhc3NOYW1lIiwiZ2V0VGh1bWJQb3MiLCJ0aHVtYlBvcyIsImJ0dyIsImJydyIsImJidyIsImJsdyIsIndlYmtpdEV4aXRGdWxsc2NyZWVuIiwic2Nyb2xsVG9wIiwic2Nyb2xsTGVmdCIsInByZXYiLCJmb2N1c2FibGVTdHIiLCJmb2N1c2FibGVJdGVtcyIsImZvY3VzZWRJdGVtSW5kZXgiLCJhY3RpdmVFbGVtZW50IiwiaXNWaXNpYmxlIiwiZCIsImRvbVJlY3QiLCJkb25lIiwiY2xlYW5VcCIsIiRmb2N1cyIsInNjcm9sbFgiLCJzY3JvbGxZIiwibmFtZSIsImFyZ3MiLCJBcnJheSIsInNsaWNlIiwidW5zaGlmdCIsImhhc0hpZGRlbkNvbnRyb2xzIiwiYW5kQ2FwdGlvbiIsInRvZ2dsZUNvbnRyb2xzIiwidmVyc2lvbiIsImNvbW1hbmQiLCJhbGwiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ1c2UzZCIsImRpdiIsImRvY3VtZW50TW9kZSIsInByb3BzIiwidG8iLCJsZWF2ZUFuaW1hdGlvbk5hbWUiLCJmcm9tIiwicHJvcGVydHlOYW1lIiwiY2FsbENhbGxiYWNrIiwiX3J1biIsIiR0YXJnZXQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJjdXJyZW50VGFyZ2V0Iiwic2VsZWN0b3IiLCJmb2N1c1N0ciIsIiRwcmVzc2VkIiwialF1ZXJ5IiwieW91dHViZSIsIm1hdGNoZXIiLCJwYXJhbXMiLCJhdXRvcGxheSIsImF1dG9oaWRlIiwiZnMiLCJyZWwiLCJoZCIsIndtb2RlIiwiZW5hYmxlanNhcGkiLCJodG1sNSIsInBhcmFtUGxhY2UiLCJ2aW1lbyIsInNob3dfdGl0bGUiLCJzaG93X2J5bGluZSIsInNob3dfcG9ydHJhaXQiLCJmdWxsc2NyZWVuIiwiaW5zdGFncmFtIiwiZ21hcF9wbGFjZSIsImdtYXBfc2VhcmNoIiwicGFyYW0iLCJ1cmxQYXJhbXMiLCJwYXJhbU9iaiIsInByb3ZpZGVyIiwicHJvdmlkZXJOYW1lIiwicHJvdmlkZXJPcHRzIiwibSIsInAiLCJkZWNvZGVVUklDb21wb25lbnQiLCJwMSIsInMiLCJvcmlnU3JjIiwiY29udGVudFNvdXJjZSIsIlZpZGVvQVBJTG9hZGVyIiwiY2xhc3MiLCJsb2FkaW5nIiwibG9hZGVkIiwibG9hZCIsInZlbmRvciIsIl90aGlzIiwic2NyaXB0Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCJwbGF5ZXIiLCJZVCIsIlBsYXllciIsImV2ZW50cyIsIm9uU3RhdGVDaGFuZ2UiLCJWaW1lbyIsImdldFBvaW50ZXJYWSIsInJlc3VsdCIsImNoYW5nZWRUb3VjaGVzIiwicGFnZVgiLCJwYWdlWSIsImRpc3RhbmNlIiwicG9pbnQyIiwicG9pbnQxIiwid2hhdCIsInNxcnQiLCJwb3ciLCJpc0NsaWNrYWJsZSIsIm9uY2xpY2siLCJhdHRzIiwiYXR0cmlidXRlcyIsIm5vZGVOYW1lIiwic3Vic3RyIiwiaGFzU2Nyb2xsYmFycyIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsImhvcml6b250YWwiLCJzY3JvbGxXaWR0aCIsImlzU2Nyb2xsYWJsZSIsIiRiZyIsImJnIiwiJHN0YWdlIiwicHJveHkiLCJ0YXBwZWQiLCJvbnRvdWNoc3RhcnQiLCJpc1RvdWNoRGV2aWNlIiwib2Zmc2V0IiwicmVhbFBvaW50cyIsInN0YXJ0UG9pbnRzIiwic3RhcnRFdmVudCIsImNhblRhcCIsImlzUGFubmluZyIsImlzU3dpcGluZyIsImlzWm9vbWluZyIsImlzU2Nyb2xsaW5nIiwic3RhcnRUaW1lIiwiZGlzdGFuY2VYIiwiZGlzdGFuY2VZIiwiY29udGVudExhc3RQb3MiLCJjb250ZW50U3RhcnRQb3MiLCJzbGlkZXJTdGFydFBvcyIsIm9uc2Nyb2xsIiwiY2VudGVyUG9pbnRTdGFydFgiLCJjZW50ZXJQb2ludFN0YXJ0WSIsInBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WCIsInBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WSIsInN0YXJ0RGlzdGFuY2VCZXR3ZWVuRmluZ2VycyIsIm9udG91Y2htb3ZlIiwib250b3VjaGVuZCIsIm5ld1BvaW50cyIsIm9uU3dpcGUiLCJvblBhbiIsIm9uWm9vbSIsInN3aXBpbmciLCJhbmdsZSIsImF0YW4yIiwiUEkiLCJzbGlkZXJMYXN0UG9zIiwibGltaXRNb3ZlbWVudCIsImN1cnJlbnRPZmZzZXRYIiwiY3VycmVudE9mZnNldFkiLCJjdXJyZW50V2lkdGgiLCJjdXJyZW50SGVpZ2h0IiwibWluVHJhbnNsYXRlWCIsIm1pblRyYW5zbGF0ZVkiLCJtYXhUcmFuc2xhdGVYIiwibWF4VHJhbnNsYXRlWSIsIm5ld09mZnNldFgiLCJuZXdPZmZzZXRZIiwibGltaXRQb3NpdGlvbiIsIm5ld1dpZHRoIiwibmV3SGVpZ2h0IiwiZW5kRGlzdGFuY2VCZXR3ZWVuRmluZ2VycyIsInBpbmNoUmF0aW8iLCJ0cmFuc2xhdGVGcm9tWm9vbWluZ1giLCJ0cmFuc2xhdGVGcm9tWm9vbWluZ1kiLCJjZW50ZXJQb2ludEVuZFgiLCJjZW50ZXJQb2ludEVuZFkiLCJ0cmFuc2xhdGVGcm9tVHJhbnNsYXRpbmdYIiwidHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWSIsIm5ld1BvcyIsInBhbm5pbmciLCJ6b29taW5nIiwiZW5kUG9pbnRzIiwiZE1zIiwib25UYXAiLCJ2ZWxvY2l0eVgiLCJ2ZWxvY2l0eVkiLCJlbmRQYW5uaW5nIiwiZW5kWm9vbWluZyIsImVuZFN3aXBpbmciLCJsZW4iLCJjYW5BZHZhbmNlIiwic3BlZWRYIiwicmVzZXQiLCJ0YXBYIiwidGFwWSIsIndoZXJlIiwicHJvY2VzcyIsInByZWZpeCIsImFjdGlvbiIsImFkZEJhY2siLCJwcm9ncmVzcyIsInRpbWVyIiwiJGJ1dHRvbiIsIiRwcm9ncmVzcyIsInNldCIsImZvcmNlIiwiY2xlYXIiLCJyZW1vdmVBdHRyIiwia2V5cHJlc3MiLCJoaWRkZW4iLCJmbk1hcCIsInZhbCIsIkZ1bGxTY3JlZW4iLCJyZXF1ZXN0IiwicmVxdWVzdEZ1bGxzY3JlZW4iLCJBTExPV19LRVlCT0FSRF9JTlBVVCIsImV4aXQiLCJleGl0RnVsbHNjcmVlbiIsImlzRnVsbHNjcmVlbiIsIkJvb2xlYW4iLCJmdWxsc2NyZWVuRWxlbWVudCIsImVuYWJsZWQiLCJmdWxsc2NyZWVuRW5hYmxlZCIsImZ1bGxzY3JlZW5jaGFuZ2UiLCJDTEFTUyIsIkNMQVNTX0FDVElWRSIsIkZhbmN5VGh1bWJzIiwiJGdyaWQiLCIkbGlzdCIsImxpc3QiLCJ0aGF0Iiwic2hhcmUiLCJjdXJyZW50SGFzaCIsImxvY2F0aW9uIiwiZXNjYXBlSHRtbCIsInN0cmluZyIsImVudGl0eU1hcCIsIlN0cmluZyIsImVuY29kZVVSSUNvbXBvbmVudCIsInRleHQiLCJzaGFyZUluc3RhbmNlIiwic2hhcmVDdXJyZW50IiwiY2xpY2siLCJocmVmIiwiZXNjYXBlU2VsZWN0b3IiLCJzZWwiLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidG9TdHJpbmciLCJwYXJzZVVybCIsInBvcCIsImdhbGxlcnkiLCJ0cmlnZ2VyRnJvbVVybCIsImdldEdhbGxlcnlJRCIsIm9yaWdIYXNoIiwiaGFzaFRpbWVyIiwiaGlzdG9yeSIsInRpdGxlIiwicGF0aG5hbWUiLCJzZWFyY2giLCJoYXNDcmVhdGVkSGlzdG9yeSIsImJhY2siLCJyZXBsYWNlU3RhdGUiLCJmYiIsInJldmVyc2UiLCJ0bXAiLCJwcmV2VGltZSIsImN1cnJUaW1lIiwiZGVsdGFZIiwiZGVsdGFYIiwid2hlZWxEZWx0YSIsImRldGFpbCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztDQUFBOzs7Ozs7Ozs7Q0FTQyxhQUFVQSxRQUFWLEVBQW9CQyxNQUFwQixFQUE0QkMsS0FBNUIsRUFBbUM7O0NBS2xDLFFBQUlDLGFBQWEsR0FBRyxVQUFVQyxFQUFWLEVBQWNDLE9BQWQsRUFBdUI7Q0FFekMsVUFBSUMsUUFBUSxHQUFHLENBQUMsQ0FBQ0wsTUFBTSxDQUFDTSxnQkFBeEI7Ozs7O0NBS0EsVUFBSSxDQUFDRCxRQUFMLEVBQWU7Q0FDYkwsUUFBQUEsTUFBTSxDQUFDTSxnQkFBUCxHQUEwQixVQUFTSCxFQUFULEVBQWE7Q0FDckMsZUFBS0EsRUFBTCxHQUFVQSxFQUFWOztDQUNBLGVBQUtJLGdCQUFMLEdBQXdCLFVBQVNDLElBQVQsRUFBZTtDQUNyQyxnQkFBSUMsRUFBRSxHQUFHLGlCQUFUOztDQUNBLGdCQUFJRCxJQUFJLEtBQUssT0FBYixFQUFzQjtDQUNwQkEsY0FBQUEsSUFBSSxHQUFHLFlBQVA7Q0FDRDs7Q0FDRCxnQkFBSUMsRUFBRSxDQUFDQyxJQUFILENBQVFGLElBQVIsQ0FBSixFQUFtQjtDQUNqQkEsY0FBQUEsSUFBSSxHQUFH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UUFBQUEsUUFBUSxDQUFDLENBQUMsQ0FBQzNVLENBQUMsQ0FBQ2l4QixNQUFILElBQWEsQ0FBQ2p4QixDQUFDLENBQUNreEIsTUFBaEIsSUFBMEJseEIsQ0FBQyxDQUFDbXhCLFVBQTVCLElBQTBDLENBQUNueEIsQ0FBQyxDQUFDb3hCLE1BQTlDLElBQXdELENBQXhELEdBQTRELE1BQTVELEdBQXFFLFVBQXRFLENBQVI7RUFDRCxPQXhCRDtFQXlCRDtFQTNCWSxHQUFmO0VBNkJELENBbENELEVBa0NHenlCLFFBbENILEVBa0Nhb2tCLE1BbENiOzs7Ozs7O0VDbitLQUEsTUFBTSxDQUFDcGtCLFFBQUQsQ0FBTixDQUFpQjB5QixLQUFqQixDQUF1QixVQUFVOXBCLENBQVYsRUFBYztFQUVuQyxNQUFHQSxDQUFDLENBQUMsWUFBRCxDQUFELENBQWdCOUcsTUFBbkIsRUFBMEI7RUFDeEIsUUFBSW9CLEdBQUcsR0FBRy9DLGFBQWEsQ0FBQyxlQUFELEVBQWtCO0VBQ3RDOEQsTUFBQUEsWUFBWSxFQUFFO0VBRHdCLEtBQWxCLENBQXZCO0VBR0Q7O0VBRUQyRSxFQUFBQSxDQUFDLENBQUMsaUJBQUQsQ0FBRCxDQUFxQkssUUFBckIsQ0FBOEI7RUFDOUJHLElBQUFBLElBQUksRUFBTztFQURtQixHQUE5QjtFQUlELENBWkQiLCJmaWxlIjoicHJvZHVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISByZXNwb25zaXZlLW5hdi5qcyAxLjAuMzlcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS92aWxqYW1pcy9yZXNwb25zaXZlLW5hdi5qc1xuICogaHR0cDovL3Jlc3BvbnNpdmUtbmF2LmNvbVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBAdmlsamFtaXNcbiAqIEF2YWlsYWJsZSB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKiBnbG9iYWwgRXZlbnQgKi9cbihmdW5jdGlvbiAoZG9jdW1lbnQsIHdpbmRvdywgaW5kZXgpIHtcbiAgLy8gSW5kZXggaXMgdXNlZCB0byBrZWVwIG11bHRpcGxlIG5hdnMgb24gdGhlIHNhbWUgcGFnZSBuYW1lc3BhY2VkXG5cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIHJlc3BvbnNpdmVOYXYgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblxuICAgIHZhciBjb21wdXRlZCA9ICEhd2luZG93LmdldENvbXB1dGVkU3R5bGU7XG5cbiAgICAvKipcbiAgICAgKiBnZXRDb21wdXRlZFN0eWxlIHBvbHlmaWxsIGZvciBvbGQgYnJvd3NlcnNcbiAgICAgKi9cbiAgICBpZiAoIWNvbXB1dGVkKSB7XG4gICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5nZXRQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgIHZhciByZSA9IC8oXFwtKFthLXpdKXsxfSkvZztcbiAgICAgICAgICBpZiAocHJvcCA9PT0gXCJmbG9hdFwiKSB7XG4gICAgICAgICAgICBwcm9wID0gXCJzdHlsZUZsb2F0XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZS50ZXN0KHByb3ApKSB7XG4gICAgICAgICAgICBwcm9wID0gcHJvcC5yZXBsYWNlKHJlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMl0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZWwuY3VycmVudFN0eWxlW3Byb3BdID8gZWwuY3VycmVudFN0eWxlW3Byb3BdIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH1cbiAgICAvKiBleHBvcnRlZCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQsIGdldENoaWxkcmVuLCBzZXRBdHRyaWJ1dGVzLCBhZGRDbGFzcywgcmVtb3ZlQ2xhc3MsIGZvckVhY2ggKi9cblxuICAgIC8qKlxuICAgICAqIEFkZCBFdmVudFxuICAgICAqIGZuIGFyZyBjYW4gYmUgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24sIHRoYW5rcyB0byBoYW5kbGVFdmVudFxuICAgICAqIHJlYWQgbW9yZSBhdDogaHR0cDovL3d3dy50aGVjc3NuaW5qYS5jb20vamF2YXNjcmlwdC9oYW5kbGVldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtICB7ZWxlbWVudH0gIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gIHtldmVudH0gICAgZXZlbnRcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAgICAgKiBAcGFyYW0gIHtib29sZWFufSAgYnViYmxpbmdcbiAgICAgKi9cbiAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbiAoZWwsIGV2dCwgZm4sIGJ1YmJsZSkge1xuICAgICAgICBpZiAoXCJhZGRFdmVudExpc3RlbmVyXCIgaW4gZWwpIHtcbiAgICAgICAgICAvLyBCQk9TNiBkb2Vzbid0IHN1cHBvcnQgaGFuZGxlRXZlbnQsIGNhdGNoIGFuZCBwb2x5ZmlsbFxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm4sIGJ1YmJsZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBCaW5kIGZuIGFzIHRoaXMgYW5kIHNldCBmaXJzdCBhcmcgYXMgZXZlbnQgb2JqZWN0XG4gICAgICAgICAgICAgICAgZm4uaGFuZGxlRXZlbnQuY2FsbChmbiwgZSk7XG4gICAgICAgICAgICAgIH0sIGJ1YmJsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcImF0dGFjaEV2ZW50XCIgaW4gZWwpIHtcbiAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgY2FsbGJhY2sgaXMgYW4gb2JqZWN0IGFuZCBjb250YWlucyBoYW5kbGVFdmVudFxuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KFwib25cIiArIGV2dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyBCaW5kIGZuIGFzIHRoaXNcbiAgICAgICAgICAgICAgZm4uaGFuZGxlRXZlbnQuY2FsbChmbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBFdmVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2VsZW1lbnR9ICBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gICAgZXZlbnRcbiAgICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgICAgICogQHBhcmFtICB7Ym9vbGVhbn0gIGJ1YmJsaW5nXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gKGVsLCBldnQsIGZuLCBidWJibGUpIHtcbiAgICAgICAgaWYgKFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiIGluIGVsKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmbiwgYnViYmxlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcIm9iamVjdFwiICYmIGZuLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4sIGUpO1xuICAgICAgICAgICAgICB9LCBidWJibGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXCJkZXRhY2hFdmVudFwiIGluIGVsKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgZWwuZGV0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmRldGFjaEV2ZW50KFwib25cIiArIGV2dCwgZm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgdGhlIGNoaWxkcmVuIG9mIGFueSBlbGVtZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZWxlbWVudH1cbiAgICAgICAqIEByZXR1cm4ge2FycmF5fSBSZXR1cm5zIG1hdGNoaW5nIGVsZW1lbnRzIGluIGFuIGFycmF5XG4gICAgICAgKi9cbiAgICAgIGdldENoaWxkcmVuID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUuY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBOYXYgY29udGFpbmVyIGhhcyBubyBjb250YWluaW5nIGVsZW1lbnRzXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN0b3JlIGFsbCBjaGlsZHJlbiBpbiBhcnJheVxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGNoaWxkcmVuIGFuZCBzdG9yZSBpbiBhcnJheSBpZiBjaGlsZCAhPSBUZXh0Tm9kZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZS5jaGlsZHJlbltpXS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChlLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXRzIG11bHRpcGxlIGF0dHJpYnV0ZXMgYXQgb25jZVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbWVudFxuICAgICAgICogQHBhcmFtIHthdHRyc30gICBhdHRyc1xuICAgICAgICovXG4gICAgICBzZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGVsLCBhdHRycykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGRzIGEgY2xhc3MgdG8gYW55IGVsZW1lbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgY2xhc3NcbiAgICAgICAqL1xuICAgICAgYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICAgICAgICBpZiAoZWwuY2xhc3NOYW1lLmluZGV4T2YoY2xzKSAhPT0gMCkge1xuICAgICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNscztcbiAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgvKF5cXHMqKXwoXFxzKiQpL2csXCJcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGEgY2xhc3MgZnJvbSBhbnkgZWxlbWVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gIGNsYXNzXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpO1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShyZWcsIFwiIFwiKS5yZXBsYWNlKC8oXlxccyopfChcXHMqJCkvZyxcIlwiKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogZm9yRWFjaCBtZXRob2QgdGhhdCBwYXNzZXMgYmFjayB0aGUgc3R1ZmYgd2UgbmVlZFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2FycmF5fSAgICBhcnJheVxuICAgICAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICAgKiBAcGFyYW0gIHtzY29wZX0gICAgc2NvcGVcbiAgICAgICAqL1xuICAgICAgZm9yRWFjaCA9IGZ1bmN0aW9uIChhcnJheSwgY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKHNjb3BlLCBpLCBhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICB2YXIgbmF2LFxuICAgICAgb3B0cyxcbiAgICAgIG5hdlRvZ2dsZSxcbiAgICAgIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKSxcbiAgICAgIGh0bWxFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgIGhhc0FuaW1GaW5pc2hlZCxcbiAgICAgIGlzTW9iaWxlLFxuICAgICAgbmF2T3BlbjtcblxuICAgIHZhciBSZXNwb25zaXZlTmF2ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IG9wdGlvbnNcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICBhbmltYXRlOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgLy8gQm9vbGVhbjogVXNlIENTUzMgdHJhbnNpdGlvbnMsIHRydWUgb3IgZmFsc2VcbiAgICAgICAgICB0cmFuc2l0aW9uOiAyODQsICAgICAgICAgICAgICAgICAgLy8gSW50ZWdlcjogU3BlZWQgb2YgdGhlIHRyYW5zaXRpb24sIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgIGxhYmVsOiBcIk1lbnVcIiwgICAgICAgICAgICAgICAgICAgIC8vIFN0cmluZzogTGFiZWwgZm9yIHRoZSBuYXZpZ2F0aW9uIHRvZ2dsZVxuICAgICAgICAgIGluc2VydDogXCJiZWZvcmVcIiwgICAgICAgICAgICAgICAgIC8vIFN0cmluZzogSW5zZXJ0IHRoZSB0b2dnbGUgYmVmb3JlIG9yIGFmdGVyIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgICAgY3VzdG9tVG9nZ2xlOiBcIlwiLCAgICAgICAgICAgICAgICAgLy8gU2VsZWN0b3I6IFNwZWNpZnkgdGhlIElEIG9mIGEgY3VzdG9tIHRvZ2dsZVxuICAgICAgICAgIGNsb3NlT25OYXZDbGljazogZmFsc2UsICAgICAgICAgICAvLyBCb29sZWFuOiBDbG9zZSB0aGUgbmF2aWdhdGlvbiB3aGVuIG9uZSBvZiB0aGUgbGlua3MgYXJlIGNsaWNrZWRcbiAgICAgICAgICBvcGVuUG9zOiBcInJlbGF0aXZlXCIsICAgICAgICAgICAgICAvLyBTdHJpbmc6IFBvc2l0aW9uIG9mIHRoZSBvcGVuZWQgbmF2LCByZWxhdGl2ZSBvciBzdGF0aWNcbiAgICAgICAgICBuYXZDbGFzczogXCJuYXYtY29sbGFwc2VcIiwgICAgICAgICAvLyBTdHJpbmc6IERlZmF1bHQgQ1NTIGNsYXNzLiBJZiBjaGFuZ2VkLCB5b3UgbmVlZCB0byBlZGl0IHRoZSBDU1MgdG9vIVxuICAgICAgICAgIG5hdkFjdGl2ZUNsYXNzOiBcImpzLW5hdi1hY3RpdmVcIiwgIC8vIFN0cmluZzogQ2xhc3MgdGhhdCBpcyBhZGRlZCB0byA8aHRtbD4gZWxlbWVudCB3aGVuIG5hdiBpcyBhY3RpdmVcbiAgICAgICAgICBqc0NsYXNzOiBcImpzXCIsICAgICAgICAgICAgICAgICAgICAvLyBTdHJpbmc6ICdKUyBlbmFibGVkJyBjbGFzcyB3aGljaCBpcyBhZGRlZCB0byA8aHRtbD4gZWxlbWVudFxuICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAgICAvLyBGdW5jdGlvbjogSW5pdCBjYWxsYmFja1xuICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAgICAvLyBGdW5jdGlvbjogT3BlbiBjYWxsYmFja1xuICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpe30gICAgICAgICAgICAgICAvLyBGdW5jdGlvbjogQ2xvc2UgY2FsbGJhY2tcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBVc2VyIGRlZmluZWQgb3B0aW9uc1xuICAgICAgICBmb3IgKGkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9uc1tpXSA9IG9wdGlvbnNbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGRzIFwianNcIiBjbGFzcyBmb3IgPGh0bWw+XG4gICAgICAgIGFkZENsYXNzKGh0bWxFbCwgdGhpcy5vcHRpb25zLmpzQ2xhc3MpO1xuXG4gICAgICAgIC8vIFdyYXBwZXJcbiAgICAgICAgdGhpcy53cmFwcGVyRWwgPSBlbC5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcblxuICAgICAgICAvLyBUcnkgc2VsZWN0aW5nIElEIGZpcnN0XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLndyYXBwZXJFbCkpIHtcbiAgICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLndyYXBwZXJFbCk7XG5cbiAgICAgICAgLy8gSWYgZWxlbWVudCB3aXRoIGFuIElEIGRvZXNuJ3QgZXhpc3QsIHVzZSBxdWVyeVNlbGVjdG9yXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLndyYXBwZXJFbCkpIHtcbiAgICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMud3JhcHBlckVsKTtcblxuICAgICAgICAvLyBJZiBlbGVtZW50IGRvZXNuJ3QgZXhpc3RzLCBzdG9wIGhlcmUuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG5hdiBlbGVtZW50IHlvdSBhcmUgdHJ5aW5nIHRvIHNlbGVjdCBkb2Vzbid0IGV4aXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5uZXIgd3JhcHBlclxuICAgICAgICB0aGlzLndyYXBwZXIuaW5uZXIgPSBnZXRDaGlsZHJlbih0aGlzLndyYXBwZXIpO1xuXG4gICAgICAgIC8vIEZvciBtaW5pZmljYXRpb25cbiAgICAgICAgb3B0cyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgbmF2ID0gdGhpcy53cmFwcGVyO1xuXG4gICAgICAgIC8vIEluaXRcbiAgICAgICAgdGhpcy5faW5pdCh0aGlzKTtcbiAgICAgIH07XG5cbiAgICBSZXNwb25zaXZlTmF2LnByb3RvdHlwZSA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBVbmF0dGFjaGVzIGV2ZW50cyBhbmQgcmVtb3ZlcyBhbnkgY2xhc3NlcyB0aGF0IHdlcmUgYWRkZWRcbiAgICAgICAqL1xuICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVTdHlsZXMoKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcIm9wZW5lZFwiKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBvcHRzLm5hdkNsYXNzKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBvcHRzLm5hdkNsYXNzICsgXCItXCIgKyB0aGlzLmluZGV4KTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaHRtbEVsLCBvcHRzLm5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgbmF2LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICBuYXYucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIik7XG5cbiAgICAgICAgcmVtb3ZlRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KHdpbmRvdywgXCJmb2N1c1wiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KGRvY3VtZW50LmJvZHksIFwidG91Y2htb3ZlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoc3RhcnRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwidG91Y2hlbmRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwibW91c2V1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJrZXl1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJjbGlja1wiLCB0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFvcHRzLmN1c3RvbVRvZ2dsZSkge1xuICAgICAgICAgIG5hdlRvZ2dsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5hdlRvZ2dsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmF2VG9nZ2xlLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIG5hdmlnYXRpb24gb3Blbi9jbG9zZVxuICAgICAgICovXG4gICAgICB0b2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGhhc0FuaW1GaW5pc2hlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghbmF2T3Blbikge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogT3BlbnMgdGhlIG5hdmlnYXRpb25cbiAgICAgICAqL1xuICAgICAgb3BlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIW5hdk9wZW4pIHtcbiAgICAgICAgICByZW1vdmVDbGFzcyhuYXYsIFwiY2xvc2VkXCIpO1xuICAgICAgICAgIGFkZENsYXNzKG5hdiwgXCJvcGVuZWRcIik7XG4gICAgICAgICAgYWRkQ2xhc3MoaHRtbEVsLCBvcHRzLm5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICBhZGRDbGFzcyhuYXZUb2dnbGUsIFwiYWN0aXZlXCIpO1xuICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IG9wdHMub3BlblBvcztcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJmYWxzZVwifSk7XG4gICAgICAgICAgbmF2T3BlbiA9IHRydWU7XG4gICAgICAgICAgb3B0cy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2xvc2VzIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgKi9cbiAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChuYXZPcGVuKSB7XG4gICAgICAgICAgYWRkQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhuYXYsIFwib3BlbmVkXCIpO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKGh0bWxFbCwgb3B0cy5uYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MobmF2VG9nZ2xlLCBcImFjdGl2ZVwiKTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KTtcblxuICAgICAgICAgIC8vIElmIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQsIHdhaXQgdW50aWwgdGhleSBmaW5pc2hcbiAgICAgICAgICBpZiAob3B0cy5hbmltYXRlKSB7XG4gICAgICAgICAgICBoYXNBbmltRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgIGhhc0FuaW1GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB9LCBvcHRzLnRyYW5zaXRpb24gKyAxMCk7XG5cbiAgICAgICAgICAvLyBBbmltYXRpb25zIGFyZW4ndCBlbmFibGVkLCB3ZSBjYW4gZG8gdGhlc2UgaW1tZWRpYXRlbHlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5hdk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICBvcHRzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzaXplIGlzIGNhbGxlZCBvbiB3aW5kb3cgcmVzaXplIGFuZCBvcmllbnRhdGlvbiBjaGFuZ2UuXG4gICAgICAgKiBJdCBpbml0aWFsaXplcyB0aGUgQ1NTIHN0eWxlcyBhbmQgaGVpZ2h0IGNhbGN1bGF0aW9ucy5cbiAgICAgICAqL1xuICAgICAgcmVzaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gUmVzaXplIHdhdGNoZXMgbmF2aWdhdGlvbiB0b2dnbGUncyBkaXNwbGF5IHN0YXRlXG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZUb2dnbGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpICE9PSBcIm5vbmVcIikge1xuXG4gICAgICAgICAgaXNNb2JpbGUgPSB0cnVlO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2VG9nZ2xlLCB7XCJhcmlhLWhpZGRlblwiOiBcImZhbHNlXCJ9KTtcblxuICAgICAgICAgIC8vIElmIHRoZSBuYXZpZ2F0aW9uIGlzIGhpZGRlblxuICAgICAgICAgIGlmIChuYXYuY2xhc3NOYW1lLm1hdGNoKC8oXnxcXHMpY2xvc2VkKFxcc3wkKS8pKSB7XG4gICAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KTtcbiAgICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9jcmVhdGVTdHlsZXMoKTtcbiAgICAgICAgICB0aGlzLl9jYWxjSGVpZ2h0KCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBpc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2VG9nZ2xlLCB7XCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2LCB7XCJhcmlhLWhpZGRlblwiOiBcImZhbHNlXCJ9KTtcbiAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBvcHRzLm9wZW5Qb3M7XG4gICAgICAgICAgdGhpcy5fcmVtb3ZlU3R5bGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGFrZXMgY2FyZSBvZiBhbGwgZXZlbiBoYW5kbGluZ1xuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICogQHJldHVybiB7dHlwZX0gcmV0dXJucyB0aGUgdHlwZSBvZiBldmVudCB0aGF0IHNob3VsZCBiZSB1c2VkXG4gICAgICAgKi9cbiAgICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZXZ0ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgc3dpdGNoIChldnQudHlwZSkge1xuICAgICAgICBjYXNlIFwidG91Y2hzdGFydFwiOlxuICAgICAgICAgIHRoaXMuX29uVG91Y2hTdGFydChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidG91Y2htb3ZlXCI6XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaE1vdmUoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRvdWNoZW5kXCI6XG4gICAgICAgIGNhc2UgXCJtb3VzZXVwXCI6XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaEVuZChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xpY2tcIjpcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwia2V5dXBcIjpcbiAgICAgICAgICB0aGlzLl9vbktleVVwKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb2N1c1wiOlxuICAgICAgICBjYXNlIFwicmVzaXplXCI6XG4gICAgICAgICAgdGhpcy5yZXNpemUoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplcyB0aGUgd2lkZ2V0XG4gICAgICAgKi9cbiAgICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleCsrO1xuXG4gICAgICAgIGFkZENsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyk7XG4gICAgICAgIGFkZENsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCk7XG4gICAgICAgIGFkZENsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgIGhhc0FuaW1GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIG5hdk9wZW4gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jbG9zZU9uTmF2Q2xpY2soKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlVG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIElFOCB0aGUgcmVzaXplIGV2ZW50IHRyaWdnZXJzIHRvbyBlYXJseSBmb3Igc29tZSByZWFzb25cbiAgICAgICAgICogc28gaXQncyBjYWxsZWQgaGVyZSBhZ2FpbiBvbiBpbml0IHRvIG1ha2Ugc3VyZSBhbGwgdGhlXG4gICAgICAgICAqIGNhbGN1bGF0ZWQgc3R5bGVzIGFyZSBjb3JyZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlc2l6ZSgpO1xuICAgICAgICB9LCAyMCk7XG5cbiAgICAgICAgYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJmb2N1c1wiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KGRvY3VtZW50LmJvZHksIFwidG91Y2htb3ZlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoc3RhcnRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwidG91Y2hlbmRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwibW91c2V1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJrZXl1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJjbGlja1wiLCB0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgY2FsbGJhY2sgaGVyZVxuICAgICAgICAgKi9cbiAgICAgICAgb3B0cy5pbml0KCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgU3R5bGVzIHRvIHRoZSA8aGVhZD5cbiAgICAgICAqL1xuICAgICAgX2NyZWF0ZVN0eWxlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXN0eWxlRWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlcyBzdHlsZXMgZnJvbSB0aGUgPGhlYWQ+XG4gICAgICAgKi9cbiAgICAgIF9yZW1vdmVTdHlsZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIE5hdmlnYXRpb24gVG9nZ2xlXG4gICAgICAgKi9cbiAgICAgIF9jcmVhdGVUb2dnbGU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIHRvZ2dsZSwgbGV0J3MgY3JlYXRlIG9uZVxuICAgICAgICBpZiAoIW9wdHMuY3VzdG9tVG9nZ2xlKSB7XG4gICAgICAgICAgdmFyIHRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgIHRvZ2dsZS5pbm5lckhUTUwgPSBvcHRzLmxhYmVsO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXModG9nZ2xlLCB7XG4gICAgICAgICAgICBcImhyZWZcIjogXCIjXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibmF2LXRvZ2dsZVwiXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hlcmUgdG8gaW5zZXJ0IHRoZSB0b2dnbGVcbiAgICAgICAgICBpZiAob3B0cy5pbnNlcnQgPT09IFwiYWZ0ZXJcIikge1xuICAgICAgICAgICAgbmF2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRvZ2dsZSwgbmF2Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRvZ2dsZSwgbmF2KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuYXZUb2dnbGUgPSB0b2dnbGU7XG5cbiAgICAgICAgLy8gVGhlcmUgaXMgYSB0b2dnbGUgYWxyZWFkeSwgbGV0J3MgdXNlIHRoYXQgb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRvZ2dsZUVsID0gb3B0cy5jdXN0b21Ub2dnbGUucmVwbGFjZShcIiNcIiwgXCJcIik7XG5cbiAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9nZ2xlRWwpKSB7XG4gICAgICAgICAgICBuYXZUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b2dnbGVFbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRvZ2dsZUVsKSkge1xuICAgICAgICAgICAgbmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0b2dnbGVFbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBjdXN0b20gbmF2IHRvZ2dsZSB5b3UgYXJlIHRyeWluZyB0byBzZWxlY3QgZG9lc24ndCBleGlzdFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2xvc2VzIHRoZSBuYXZpZ2F0aW9uIHdoZW4gYSBsaW5rIGluc2lkZSBpcyBjbGlja2VkLlxuICAgICAgICovXG4gICAgICBfY2xvc2VPbk5hdkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvcHRzLmNsb3NlT25OYXZDbGljaykge1xuICAgICAgICAgIHZhciBsaW5rcyA9IG5hdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIiksXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICBmb3JFYWNoKGxpbmtzLCBmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KGxpbmtzW2ldLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByZXZlbnRzIHRoZSBkZWZhdWx0IGZ1bmN0aW9uYWxpdHkuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9wcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgIGlmIChlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIFRoaXMgaXMgc3RyaWN0bHkgZm9yIG9sZCBJRVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBPbiB0b3VjaCBzdGFydCB3ZSBnZXQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0b3VjaC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uVG91Y2hTdGFydDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFFdmVudC5wcm90b3R5cGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgICAgdGhpcy50b3VjaEhhc01vdmVkID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBtb3VzZXVwIGV2ZW50IGNvbXBsZXRlbHkgaGVyZSB0byBhdm9pZFxuICAgICAgICAgKiBkb3VibGUgdHJpZ2dlcmluZyB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwibW91c2V1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIGlmIHRoZSB1c2VyIGlzIHNjcm9sbGluZyBpbnN0ZWFkIG9mIHRhcHBpbmcuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vblRvdWNoTW92ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5zdGFydFgpID4gMTAgfHxcbiAgICAgICAgTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLnN0YXJ0WSkgPiAxMCkge1xuICAgICAgICAgIHRoaXMudG91Y2hIYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogT24gdG91Y2ggZW5kIHRvZ2dsZSB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uVG91Y2hFbmQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgaXNuJ3Qgc2Nyb2xsaW5nXG4gICAgICAgIGlmICghdGhpcy50b3VjaEhhc01vdmVkKSB7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgZXZlbnQgdHlwZSBpcyB0b3VjaFxuICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwidG91Y2hlbmRcIikge1xuICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgIC8vIEV2ZW50IHR5cGUgd2FzIGNsaWNrLCBub3QgdG91Y2hcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2dCA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgICAgICAvLyBJZiBpdCBpc24ndCBhIHJpZ2h0IGNsaWNrLCBkbyB0b2dnbGluZ1xuICAgICAgICAgICAgaWYgKCEoZXZ0LndoaWNoID09PSAzIHx8IGV2dC5idXR0b24gPT09IDIpKSB7XG4gICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEZvciBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5LCB0b2dnbGUgdGhlIG5hdmlnYXRpb24gb24gRW50ZXJcbiAgICAgICAqIGtleXByZXNzIHRvby5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uS2V5VXA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBldnQgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyB0aGUgbmVlZGVkIENTUyB0cmFuc2l0aW9ucyBpZiBhbmltYXRpb25zIGFyZSBlbmFibGVkXG4gICAgICAgKi9cbiAgICAgIF90cmFuc2l0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob3B0cy5hbmltYXRlKSB7XG4gICAgICAgICAgdmFyIG9ialN0eWxlID0gbmF2LnN0eWxlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IFwibWF4LWhlaWdodCBcIiArIG9wdHMudHJhbnNpdGlvbiArIFwibXNcIjtcblxuICAgICAgICAgIG9ialN0eWxlLldlYmtpdFRyYW5zaXRpb24gPVxuICAgICAgICAgIG9ialN0eWxlLk1velRyYW5zaXRpb24gPVxuICAgICAgICAgIG9ialN0eWxlLk9UcmFuc2l0aW9uID1cbiAgICAgICAgICBvYmpTdHlsZS50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGVzIHRoZSBoZWlnaHQgb2YgdGhlIG5hdmlnYXRpb24gYW5kIHRoZW4gY3JlYXRlc1xuICAgICAgICogc3R5bGVzIHdoaWNoIGFyZSBsYXRlciBhZGRlZCB0byB0aGUgcGFnZSA8aGVhZD5cbiAgICAgICAqL1xuICAgICAgX2NhbGNIZWlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNhdmVkSGVpZ2h0ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYuaW5uZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBzYXZlZEhlaWdodCArPSBuYXYuaW5uZXJbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlubmVyU3R5bGVzID0gXCIuXCIgKyBvcHRzLmpzQ2xhc3MgKyBcIiAuXCIgKyBvcHRzLm5hdkNsYXNzICsgXCItXCIgKyB0aGlzLmluZGV4ICsgXCIub3BlbmVke21heC1oZWlnaHQ6XCIgKyBzYXZlZEhlaWdodCArIFwicHggIWltcG9ydGFudH0gLlwiICsgb3B0cy5qc0NsYXNzICsgXCIgLlwiICsgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCArIFwiLm9wZW5lZC5kcm9wZG93bi1hY3RpdmUge21heC1oZWlnaHQ6OTk5OXB4ICFpbXBvcnRhbnR9XCI7XG5cbiAgICAgICAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGlubmVyU3R5bGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBpbm5lclN0eWxlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlubmVyU3R5bGVzID0gXCJcIjtcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gbmV3IFJlc3BvbnNpdmUgTmF2XG4gICAgICovXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zaXZlTmF2KGVsLCBvcHRpb25zKTtcblxuICB9O1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSByZXNwb25zaXZlTmF2O1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5yZXNwb25zaXZlTmF2ID0gcmVzcG9uc2l2ZU5hdjtcbiAgfVxuXG59KGRvY3VtZW50LCB3aW5kb3csIDApKTtcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBmYW5jeUJveCB2My41LjZcbi8vXG4vLyBMaWNlbnNlZCBHUEx2MyBmb3Igb3BlbiBzb3VyY2UgdXNlXG4vLyBvciBmYW5jeUJveCBDb21tZXJjaWFsIExpY2Vuc2UgZm9yIGNvbW1lcmNpYWwgdXNlXG4vL1xuLy8gaHR0cDovL2ZhbmN5YXBwcy5jb20vZmFuY3lib3gvXG4vLyBDb3B5cmlnaHQgMjAxOCBmYW5jeUFwcHNcbi8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICB3aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHtcclxuICAgIGluZm86IGZ1bmN0aW9uKHN0dWZmKSB7fVxyXG4gIH07XHJcblxyXG4gIC8vIElmIHRoZXJlJ3Mgbm8galF1ZXJ5LCBmYW5jeUJveCBjYW4ndCB3b3JrXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgaWYgKCEkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayBpZiBmYW5jeUJveCBpcyBhbHJlYWR5IGluaXRpYWxpemVkXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBpZiAoJC5mbi5mYW5jeWJveCkge1xyXG4gICAgY29uc29sZS5pbmZvKFwiZmFuY3lCb3ggYWxyZWFkeSBpbml0aWFsaXplZFwiKTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBQcml2YXRlIGRlZmF1bHQgc2V0dGluZ3NcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgLy8gQ2xvc2UgZXhpc3RpbmcgbW9kYWxzXHJcbiAgICAvLyBTZXQgdGhpcyB0byBmYWxzZSBpZiB5b3UgZG8gbm90IG5lZWQgdG8gc3RhY2sgbXVsdGlwbGUgaW5zdGFuY2VzXHJcbiAgICBjbG9zZUV4aXN0aW5nOiBmYWxzZSxcclxuXHJcbiAgICAvLyBFbmFibGUgaW5maW5pdGUgZ2FsbGVyeSBuYXZpZ2F0aW9uXHJcbiAgICBsb29wOiBmYWxzZSxcclxuXHJcbiAgICAvLyBIb3Jpem9udGFsIHNwYWNlIGJldHdlZW4gc2xpZGVzXHJcbiAgICBndXR0ZXI6IDUwLFxyXG5cclxuICAgIC8vIEVuYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uXHJcbiAgICBrZXlib2FyZDogdHJ1ZSxcclxuXHJcbiAgICAvLyBTaG91bGQgYWxsb3cgY2FwdGlvbiB0byBvdmVybGFwIHRoZSBjb250ZW50XHJcbiAgICBwcmV2ZW50Q2FwdGlvbk92ZXJsYXA6IHRydWUsXHJcblxyXG4gICAgLy8gU2hvdWxkIGRpc3BsYXkgbmF2aWdhdGlvbiBhcnJvd3MgYXQgdGhlIHNjcmVlbiBlZGdlc1xyXG4gICAgYXJyb3dzOiB0cnVlLFxyXG5cclxuICAgIC8vIFNob3VsZCBkaXNwbGF5IGNvdW50ZXIgYXQgdGhlIHRvcCBsZWZ0IGNvcm5lclxyXG4gICAgaW5mb2JhcjogdHJ1ZSxcclxuXHJcbiAgICAvLyBTaG91bGQgZGlzcGxheSBjbG9zZSBidXR0b24gKHVzaW5nIGBidG5UcGwuc21hbGxCdG5gIHRlbXBsYXRlKSBvdmVyIHRoZSBjb250ZW50XHJcbiAgICAvLyBDYW4gYmUgdHJ1ZSwgZmFsc2UsIFwiYXV0b1wiXHJcbiAgICAvLyBJZiBcImF1dG9cIiAtIHdpbGwgYmUgYXV0b21hdGljYWxseSBlbmFibGVkIGZvciBcImh0bWxcIiwgXCJpbmxpbmVcIiBvciBcImFqYXhcIiBpdGVtc1xyXG4gICAgc21hbGxCdG46IFwiYXV0b1wiLFxyXG5cclxuICAgIC8vIFNob3VsZCBkaXNwbGF5IHRvb2xiYXIgKGJ1dHRvbnMgYXQgdGhlIHRvcClcclxuICAgIC8vIENhbiBiZSB0cnVlLCBmYWxzZSwgXCJhdXRvXCJcclxuICAgIC8vIElmIFwiYXV0b1wiIC0gd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGhpZGRlbiBpZiBcInNtYWxsQnRuXCIgaXMgZW5hYmxlZFxyXG4gICAgdG9vbGJhcjogXCJhdXRvXCIsXHJcblxyXG4gICAgLy8gV2hhdCBidXR0b25zIHNob3VsZCBhcHBlYXIgaW4gdGhlIHRvcCByaWdodCBjb3JuZXIuXHJcbiAgICAvLyBCdXR0b25zIHdpbGwgYmUgY3JlYXRlZCB1c2luZyB0ZW1wbGF0ZXMgZnJvbSBgYnRuVHBsYCBvcHRpb25cclxuICAgIC8vIGFuZCB0aGV5IHdpbGwgYmUgcGxhY2VkIGludG8gdG9vbGJhciAoY2xhc3M9XCJmYW5jeWJveC10b29sYmFyXCJgIGVsZW1lbnQpXHJcbiAgICBidXR0b25zOiBbXHJcbiAgICAgIFwiem9vbVwiLFxyXG4gICAgICAvL1wic2hhcmVcIixcclxuICAgICAgXCJzbGlkZVNob3dcIixcclxuICAgICAgLy9cImZ1bGxTY3JlZW5cIixcclxuICAgICAgLy9cImRvd25sb2FkXCIsXHJcbiAgICAgIFwidGh1bWJzXCIsXHJcbiAgICAgIFwiY2xvc2VcIlxyXG4gICAgXSxcclxuXHJcbiAgICAvLyBEZXRlY3QgXCJpZGxlXCIgdGltZSBpbiBzZWNvbmRzXHJcbiAgICBpZGxlVGltZTogMyxcclxuXHJcbiAgICAvLyBEaXNhYmxlIHJpZ2h0LWNsaWNrIGFuZCB1c2Ugc2ltcGxlIGltYWdlIHByb3RlY3Rpb24gZm9yIGltYWdlc1xyXG4gICAgcHJvdGVjdDogZmFsc2UsXHJcblxyXG4gICAgLy8gU2hvcnRjdXQgdG8gbWFrZSBjb250ZW50IFwibW9kYWxcIiAtIGRpc2FibGUga2V5Ym9hcmQgbmF2aWd0aW9uLCBoaWRlIGJ1dHRvbnMsIGV0Y1xyXG4gICAgbW9kYWw6IGZhbHNlLFxyXG5cclxuICAgIGltYWdlOiB7XHJcbiAgICAgIC8vIFdhaXQgZm9yIGltYWdlcyB0byBsb2FkIGJlZm9yZSBkaXNwbGF5aW5nXHJcbiAgICAgIC8vICAgdHJ1ZSAgLSB3YWl0IGZvciBpbWFnZSB0byBsb2FkIGFuZCB0aGVuIGRpc3BsYXk7XHJcbiAgICAgIC8vICAgZmFsc2UgLSBkaXNwbGF5IHRodW1ibmFpbCBhbmQgbG9hZCB0aGUgZnVsbC1zaXplZCBpbWFnZSBvdmVyIHRvcCxcclxuICAgICAgLy8gICAgICAgICAgIHJlcXVpcmVzIHByZWRlZmluZWQgaW1hZ2UgZGltZW5zaW9ucyAoYGRhdGEtd2lkdGhgIGFuZCBgZGF0YS1oZWlnaHRgIGF0dHJpYnV0ZXMpXHJcbiAgICAgIHByZWxvYWQ6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIGFqYXg6IHtcclxuICAgICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgc2V0dGluZ3MgZm9yIGFqYXggcmVxdWVzdFxyXG4gICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgIC8vIFRoaXMgaGVscHMgdG8gaW5kaWNhdGUgdGhhdCByZXF1ZXN0IGNvbWVzIGZyb20gdGhlIG1vZGFsXHJcbiAgICAgICAgLy8gRmVlbCBmcmVlIHRvIGNoYW5nZSBuYW1pbmdcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBmYW5jeWJveDogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpZnJhbWU6IHtcclxuICAgICAgLy8gSWZyYW1lIHRlbXBsYXRlXHJcbiAgICAgIHRwbDpcclxuICAgICAgICAnPGlmcmFtZSBpZD1cImZhbmN5Ym94LWZyYW1le3JuZH1cIiBuYW1lPVwiZmFuY3lib3gtZnJhbWV7cm5kfVwiIGNsYXNzPVwiZmFuY3lib3gtaWZyYW1lXCIgYWxsb3dmdWxsc2NyZWVuPVwiYWxsb3dmdWxsc2NyZWVuXCIgYWxsb3c9XCJhdXRvcGxheTsgZnVsbHNjcmVlblwiIHNyYz1cIlwiPjwvaWZyYW1lPicsXHJcblxyXG4gICAgICAvLyBQcmVsb2FkIGlmcmFtZSBiZWZvcmUgZGlzcGxheWluZyBpdFxyXG4gICAgICAvLyBUaGlzIGFsbG93cyB0byBjYWxjdWxhdGUgaWZyYW1lIGNvbnRlbnQgd2lkdGggYW5kIGhlaWdodFxyXG4gICAgICAvLyAobm90ZTogRHVlIHRvIFwiU2FtZSBPcmlnaW4gUG9saWN5XCIsIHlvdSBjYW4ndCBnZXQgY3Jvc3MgZG9tYWluIGRhdGEpLlxyXG4gICAgICBwcmVsb2FkOiB0cnVlLFxyXG5cclxuICAgICAgLy8gQ3VzdG9tIENTUyBzdHlsaW5nIGZvciBpZnJhbWUgd3JhcHBpbmcgZWxlbWVudFxyXG4gICAgICAvLyBZb3UgY2FuIHVzZSB0aGlzIHRvIHNldCBjdXN0b20gaWZyYW1lIGRpbWVuc2lvbnNcclxuICAgICAgY3NzOiB7fSxcclxuXHJcbiAgICAgIC8vIElmcmFtZSB0YWcgYXR0cmlidXRlc1xyXG4gICAgICBhdHRyOiB7XHJcbiAgICAgICAgc2Nyb2xsaW5nOiBcImF1dG9cIlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEZvciBIVE1MNSB2aWRlbyBvbmx5XHJcbiAgICB2aWRlbzoge1xyXG4gICAgICB0cGw6XHJcbiAgICAgICAgJzx2aWRlbyBjbGFzcz1cImZhbmN5Ym94LXZpZGVvXCIgY29udHJvbHMgY29udHJvbHNMaXN0PVwibm9kb3dubG9hZFwiIHBvc3Rlcj1cInt7cG9zdGVyfX1cIj4nICtcclxuICAgICAgICAnPHNvdXJjZSBzcmM9XCJ7e3NyY319XCIgdHlwZT1cInt7Zm9ybWF0fX1cIiAvPicgK1xyXG4gICAgICAgICdTb3JyeSwgeW91ciBicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IGVtYmVkZGVkIHZpZGVvcywgPGEgaHJlZj1cInt7c3JjfX1cIj5kb3dubG9hZDwvYT4gYW5kIHdhdGNoIHdpdGggeW91ciBmYXZvcml0ZSB2aWRlbyBwbGF5ZXIhJyArXHJcbiAgICAgICAgXCI8L3ZpZGVvPlwiLFxyXG4gICAgICBmb3JtYXQ6IFwiXCIsIC8vIGN1c3RvbSB2aWRlbyBmb3JtYXRcclxuICAgICAgYXV0b1N0YXJ0OiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIERlZmF1bHQgY29udGVudCB0eXBlIGlmIGNhbm5vdCBiZSBkZXRlY3RlZCBhdXRvbWF0aWNhbGx5XHJcbiAgICBkZWZhdWx0VHlwZTogXCJpbWFnZVwiLFxyXG5cclxuICAgIC8vIE9wZW4vY2xvc2UgYW5pbWF0aW9uIHR5cGVcclxuICAgIC8vIFBvc3NpYmxlIHZhbHVlczpcclxuICAgIC8vICAgZmFsc2UgICAgICAgICAgICAtIGRpc2FibGVcclxuICAgIC8vICAgXCJ6b29tXCIgICAgICAgICAgIC0gem9vbSBpbWFnZXMgZnJvbS90byB0aHVtYm5haWxcclxuICAgIC8vICAgXCJmYWRlXCJcclxuICAgIC8vICAgXCJ6b29tLWluLW91dFwiXHJcbiAgICAvL1xyXG4gICAgYW5pbWF0aW9uRWZmZWN0OiBcInpvb21cIixcclxuXHJcbiAgICAvLyBEdXJhdGlvbiBpbiBtcyBmb3Igb3Blbi9jbG9zZSBhbmltYXRpb25cclxuICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAzNjYsXHJcblxyXG4gICAgLy8gU2hvdWxkIGltYWdlIGNoYW5nZSBvcGFjaXR5IHdoaWxlIHpvb21pbmdcclxuICAgIC8vIElmIG9wYWNpdHkgaXMgXCJhdXRvXCIsIHRoZW4gb3BhY2l0eSB3aWxsIGJlIGNoYW5nZWQgaWYgaW1hZ2UgYW5kIHRodW1ibmFpbCBoYXZlIGRpZmZlcmVudCBhc3BlY3QgcmF0aW9zXHJcbiAgICB6b29tT3BhY2l0eTogXCJhdXRvXCIsXHJcblxyXG4gICAgLy8gVHJhbnNpdGlvbiBlZmZlY3QgYmV0d2VlbiBzbGlkZXNcclxuICAgIC8vXHJcbiAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6XHJcbiAgICAvLyAgIGZhbHNlICAgICAgICAgICAgLSBkaXNhYmxlXHJcbiAgICAvLyAgIFwiZmFkZSdcclxuICAgIC8vICAgXCJzbGlkZSdcclxuICAgIC8vICAgXCJjaXJjdWxhcidcclxuICAgIC8vICAgXCJ0dWJlJ1xyXG4gICAgLy8gICBcInpvb20taW4tb3V0J1xyXG4gICAgLy8gICBcInJvdGF0ZSdcclxuICAgIC8vXHJcbiAgICB0cmFuc2l0aW9uRWZmZWN0OiBcImZhZGVcIixcclxuXHJcbiAgICAvLyBEdXJhdGlvbiBpbiBtcyBmb3IgdHJhbnNpdGlvbiBhbmltYXRpb25cclxuICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMzY2LFxyXG5cclxuICAgIC8vIEN1c3RvbSBDU1MgY2xhc3MgZm9yIHNsaWRlIGVsZW1lbnRcclxuICAgIHNsaWRlQ2xhc3M6IFwiXCIsXHJcblxyXG4gICAgLy8gQ3VzdG9tIENTUyBjbGFzcyBmb3IgbGF5b3V0XHJcbiAgICBiYXNlQ2xhc3M6IFwiXCIsXHJcblxyXG4gICAgLy8gQmFzZSB0ZW1wbGF0ZSBmb3IgbGF5b3V0XHJcbiAgICBiYXNlVHBsOlxyXG4gICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWNvbnRhaW5lclwiIHJvbGU9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCI+JyArXHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtYmdcIj48L2Rpdj4nICtcclxuICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPicgK1xyXG4gICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWluZm9iYXJcIj48c3BhbiBkYXRhLWZhbmN5Ym94LWluZGV4Pjwvc3Bhbj4mbmJzcDsvJm5ic3A7PHNwYW4gZGF0YS1mYW5jeWJveC1jb3VudD48L3NwYW4+PC9kaXY+JyArXHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtdG9vbGJhclwiPnt7YnV0dG9uc319PC9kaXY+JyArXHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtbmF2aWdhdGlvblwiPnt7YXJyb3dzfX08L2Rpdj4nICtcclxuICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1zdGFnZVwiPjwvZGl2PicgK1xyXG4gICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWNhcHRpb25cIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtY2FwdGlvbl9fYm9keVwiPjwvZGl2PjwvZGl2PicgK1xyXG4gICAgICBcIjwvZGl2PlwiICtcclxuICAgICAgXCI8L2Rpdj5cIixcclxuXHJcbiAgICAvLyBMb2FkaW5nIGluZGljYXRvciB0ZW1wbGF0ZVxyXG4gICAgc3Bpbm5lclRwbDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1sb2FkaW5nXCI+PC9kaXY+JyxcclxuXHJcbiAgICAvLyBFcnJvciBtZXNzYWdlIHRlbXBsYXRlXHJcbiAgICBlcnJvclRwbDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1lcnJvclwiPjxwPnt7RVJST1J9fTwvcD48L2Rpdj4nLFxyXG5cclxuICAgIGJ0blRwbDoge1xyXG4gICAgICBkb3dubG9hZDpcclxuICAgICAgICAnPGEgZG93bmxvYWQgZGF0YS1mYW5jeWJveC1kb3dubG9hZCBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWRvd25sb2FkXCIgdGl0bGU9XCJ7e0RPV05MT0FEfX1cIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+JyArXHJcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTE4LjYyIDE3LjA5VjE5SDUuMzh2LTEuOTF6bS0yLjk3LTYuOTZMMTcgMTEuNDVsLTUgNC44Ny01LTQuODcgMS4zNi0xLjMyIDIuNjggMi42NFY1aDEuOTJ2Ny43N3pcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgXCI8L2E+XCIsXHJcblxyXG4gICAgICB6b29tOlxyXG4gICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtem9vbSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXpvb21cIiB0aXRsZT1cInt7Wk9PTX19XCI+JyArXHJcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTE4LjcgMTcuM2wtMy0zYTUuOSA1LjkgMCAwIDAtLjYtNy42IDUuOSA1LjkgMCAwIDAtOC40IDAgNS45IDUuOSAwIDAgMCAwIDguNCA1LjkgNS45IDAgMCAwIDcuNy43bDMgM2ExIDEgMCAwIDAgMS4zIDBjLjQtLjUuNC0xIDAtMS41ek04LjEgMTMuOGE0IDQgMCAwIDEgMC01LjcgNCA0IDAgMCAxIDUuNyAwIDQgNCAwIDAgMSAwIDUuNyA0IDQgMCAwIDEtNS43IDB6XCIvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPC9idXR0b24+XCIsXHJcblxyXG4gICAgICBjbG9zZTpcclxuICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tY2xvc2VcIiB0aXRsZT1cInt7Q0xPU0V9fVwiPicgK1xyXG4gICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk0xMiAxMC42TDYuNiA1LjIgNS4yIDYuNmw1LjQgNS40LTUuNCA1LjQgMS40IDEuNCA1LjQtNS40IDUuNCA1LjQgMS40LTEuNC01LjQtNS40IDUuNC01LjQtMS40LTEuNC01LjQgNS40elwiLz48L3N2Zz4nICtcclxuICAgICAgICBcIjwvYnV0dG9uPlwiLFxyXG5cclxuICAgICAgLy8gQXJyb3dzXHJcbiAgICAgIGFycm93TGVmdDpcclxuICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXByZXYgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1hcnJvd19sZWZ0XCIgdGl0bGU9XCJ7e1BSRVZ9fVwiPicgK1xyXG4gICAgICAgICc8ZGl2PjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTExLjI4IDE1LjdsLTEuMzQgMS4zN0w1IDEybDQuOTQtNS4wNyAxLjM0IDEuMzgtMi42OCAyLjcySDE5djEuOTRIOC42elwiLz48L3N2Zz48L2Rpdj4nICtcclxuICAgICAgICBcIjwvYnV0dG9uPlwiLFxyXG5cclxuICAgICAgYXJyb3dSaWdodDpcclxuICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LW5leHQgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1hcnJvd19yaWdodFwiIHRpdGxlPVwie3tORVhUfX1cIj4nICtcclxuICAgICAgICAnPGRpdj48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk0xNS40IDEyLjk3bC0yLjY4IDIuNzIgMS4zNCAxLjM4TDE5IDEybC00Ljk0LTUuMDctMS4zNCAxLjM4IDIuNjggMi43Mkg1djEuOTR6XCIvPjwvc3ZnPjwvZGl2PicgK1xyXG4gICAgICAgIFwiPC9idXR0b24+XCIsXHJcblxyXG4gICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXHJcbiAgICAgIC8vIGlmIFwic21hbGxCdG5cIiBvcHRpb24gaXMgbm90IHNldCB0byBmYWxzZVxyXG4gICAgICBzbWFsbEJ0bjpcclxuICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1jbG9zZS1zbWFsbFwiIHRpdGxlPVwie3tDTE9TRX19XCI+JyArXHJcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNMTMgMTJsNS01LTEtMS01IDUtNS01LTEgMSA1IDUtNSA1IDEgMSA1LTUgNSA1IDEtMXpcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgXCI8L2J1dHRvbj5cIlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDb250YWluZXIgaXMgaW5qZWN0ZWQgaW50byB0aGlzIGVsZW1lbnRcclxuICAgIHBhcmVudEVsOiBcImJvZHlcIixcclxuXHJcbiAgICAvLyBIaWRlIGJyb3dzZXIgdmVydGljYWwgc2Nyb2xsYmFyczsgdXNlIGF0IHlvdXIgb3duIHJpc2tcclxuICAgIGhpZGVTY3JvbGxiYXI6IHRydWUsXHJcblxyXG4gICAgLy8gRm9jdXMgaGFuZGxpbmdcclxuICAgIC8vID09PT09PT09PT09PT09XHJcblxyXG4gICAgLy8gVHJ5IHRvIGZvY3VzIG9uIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBhZnRlciBvcGVuaW5nXHJcbiAgICBhdXRvRm9jdXM6IHRydWUsXHJcblxyXG4gICAgLy8gUHV0IGZvY3VzIGJhY2sgdG8gYWN0aXZlIGVsZW1lbnQgYWZ0ZXIgY2xvc2luZ1xyXG4gICAgYmFja0ZvY3VzOiB0cnVlLFxyXG5cclxuICAgIC8vIERvIG5vdCBsZXQgdXNlciB0byBmb2N1cyBvbiBlbGVtZW50IG91dHNpZGUgbW9kYWwgY29udGVudFxyXG4gICAgdHJhcEZvY3VzOiB0cnVlLFxyXG5cclxuICAgIC8vIE1vZHVsZSBzcGVjaWZpYyBvcHRpb25zXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGZ1bGxTY3JlZW46IHtcclxuICAgICAgYXV0b1N0YXJ0OiBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTZXQgYHRvdWNoOiBmYWxzZWAgdG8gZGlzYWJsZSBwYW5uaW5nL3N3aXBpbmdcclxuICAgIHRvdWNoOiB7XHJcbiAgICAgIHZlcnRpY2FsOiB0cnVlLCAvLyBBbGxvdyB0byBkcmFnIGNvbnRlbnQgdmVydGljYWxseVxyXG4gICAgICBtb21lbnR1bTogdHJ1ZSAvLyBDb250aW51ZSBtb3ZlbWVudCBhZnRlciByZWxlYXNpbmcgbW91c2UvdG91Y2ggd2hlbiBwYW5uaW5nXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEhhc2ggdmFsdWUgd2hlbiBpbml0aWFsaXppbmcgbWFudWFsbHksXHJcbiAgICAvLyBzZXQgYGZhbHNlYCB0byBkaXNhYmxlIGhhc2ggY2hhbmdlXHJcbiAgICBoYXNoOiBudWxsLFxyXG5cclxuICAgIC8vIEN1c3RvbWl6ZSBvciBhZGQgbmV3IG1lZGlhIHR5cGVzXHJcbiAgICAvLyBFeGFtcGxlOlxyXG4gICAgLypcclxuICAgICAgbWVkaWEgOiB7XHJcbiAgICAgICAgeW91dHViZSA6IHtcclxuICAgICAgICAgIHBhcmFtcyA6IHtcclxuICAgICAgICAgICAgYXV0b3BsYXkgOiAwXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAqL1xyXG4gICAgbWVkaWE6IHt9LFxyXG5cclxuICAgIHNsaWRlU2hvdzoge1xyXG4gICAgICBhdXRvU3RhcnQ6IGZhbHNlLFxyXG4gICAgICBzcGVlZDogMzAwMFxyXG4gICAgfSxcclxuXHJcbiAgICB0aHVtYnM6IHtcclxuICAgICAgYXV0b1N0YXJ0OiBmYWxzZSwgLy8gRGlzcGxheSB0aHVtYm5haWxzIG9uIG9wZW5pbmdcclxuICAgICAgaGlkZU9uQ2xvc2U6IHRydWUsIC8vIEhpZGUgdGh1bWJuYWlsIGdyaWQgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBzdGFydHNcclxuICAgICAgcGFyZW50RWw6IFwiLmZhbmN5Ym94LWNvbnRhaW5lclwiLCAvLyBDb250YWluZXIgaXMgaW5qZWN0ZWQgaW50byB0aGlzIGVsZW1lbnRcclxuICAgICAgYXhpczogXCJ5XCIgLy8gVmVydGljYWwgKHkpIG9yIGhvcml6b250YWwgKHgpIHNjcm9sbGluZ1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBVc2UgbW91c2V3aGVlbCB0byBuYXZpZ2F0ZSBnYWxsZXJ5XHJcbiAgICAvLyBJZiAnYXV0bycgLSBlbmFibGVkIGZvciBpbWFnZXMgb25seVxyXG4gICAgd2hlZWw6IFwiYXV0b1wiLFxyXG5cclxuICAgIC8vIENhbGxiYWNrc1xyXG4gICAgLy89PT09PT09PT09XHJcblxyXG4gICAgLy8gU2VlIERvY3VtZW50YXRpb24vQVBJL0V2ZW50cyBmb3IgbW9yZSBpbmZvcm1hdGlvblxyXG4gICAgLy8gRXhhbXBsZTpcclxuICAgIC8qXHJcbiAgICAgIGFmdGVyU2hvdzogZnVuY3Rpb24oIGluc3RhbmNlLCBjdXJyZW50ICkge1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbyggJ0NsaWNrZWQgZWxlbWVudDonICk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCBjdXJyZW50Lm9wdHMuJG9yaWcgKTtcclxuICAgICAgfVxyXG4gICAgKi9cclxuXHJcbiAgICBvbkluaXQ6ICQubm9vcCwgLy8gV2hlbiBpbnN0YW5jZSBoYXMgYmVlbiBpbml0aWFsaXplZFxyXG5cclxuICAgIGJlZm9yZUxvYWQ6ICQubm9vcCwgLy8gQmVmb3JlIHRoZSBjb250ZW50IG9mIGEgc2xpZGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgICBhZnRlckxvYWQ6ICQubm9vcCwgLy8gV2hlbiB0aGUgY29udGVudCBvZiBhIHNsaWRlIGlzIGRvbmUgbG9hZGluZ1xyXG5cclxuICAgIGJlZm9yZVNob3c6ICQubm9vcCwgLy8gQmVmb3JlIG9wZW4gYW5pbWF0aW9uIHN0YXJ0c1xyXG4gICAgYWZ0ZXJTaG93OiAkLm5vb3AsIC8vIFdoZW4gY29udGVudCBpcyBkb25lIGxvYWRpbmcgYW5kIGFuaW1hdGluZ1xyXG5cclxuICAgIGJlZm9yZUNsb3NlOiAkLm5vb3AsIC8vIEJlZm9yZSB0aGUgaW5zdGFuY2UgYXR0ZW1wdHMgdG8gY2xvc2UuIFJldHVybiBmYWxzZSB0byBjYW5jZWwgdGhlIGNsb3NlLlxyXG4gICAgYWZ0ZXJDbG9zZTogJC5ub29wLCAvLyBBZnRlciBpbnN0YW5jZSBoYXMgYmVlbiBjbG9zZWRcclxuXHJcbiAgICBvbkFjdGl2YXRlOiAkLm5vb3AsIC8vIFdoZW4gaW5zdGFuY2UgaXMgYnJvdWdodCB0byBmcm9udFxyXG4gICAgb25EZWFjdGl2YXRlOiAkLm5vb3AsIC8vIFdoZW4gb3RoZXIgaW5zdGFuY2UgaGFzIGJlZW4gYWN0aXZhdGVkXHJcblxyXG4gICAgLy8gSW50ZXJhY3Rpb25cclxuICAgIC8vID09PT09PT09PT09XHJcblxyXG4gICAgLy8gVXNlIG9wdGlvbnMgYmVsb3cgdG8gY3VzdG9taXplIHRha2VuIGFjdGlvbiB3aGVuIHVzZXIgY2xpY2tzIG9yIGRvdWJsZSBjbGlja3Mgb24gdGhlIGZhbmN5Qm94IGFyZWEsXHJcbiAgICAvLyBlYWNoIG9wdGlvbiBjYW4gYmUgc3RyaW5nIG9yIG1ldGhvZCB0aGF0IHJldHVybnMgdmFsdWUuXHJcbiAgICAvL1xyXG4gICAgLy8gUG9zc2libGUgdmFsdWVzOlxyXG4gICAgLy8gICBcImNsb3NlXCIgICAgICAgICAgIC0gY2xvc2UgaW5zdGFuY2VcclxuICAgIC8vICAgXCJuZXh0XCIgICAgICAgICAgICAtIG1vdmUgdG8gbmV4dCBnYWxsZXJ5IGl0ZW1cclxuICAgIC8vICAgXCJuZXh0T3JDbG9zZVwiICAgICAtIG1vdmUgdG8gbmV4dCBnYWxsZXJ5IGl0ZW0gb3IgY2xvc2UgaWYgZ2FsbGVyeSBoYXMgb25seSBvbmUgaXRlbVxyXG4gICAgLy8gICBcInRvZ2dsZUNvbnRyb2xzXCIgIC0gc2hvdy9oaWRlIGNvbnRyb2xzXHJcbiAgICAvLyAgIFwiem9vbVwiICAgICAgICAgICAgLSB6b29tIGltYWdlIChpZiBsb2FkZWQpXHJcbiAgICAvLyAgIGZhbHNlICAgICAgICAgICAgIC0gZG8gbm90aGluZ1xyXG5cclxuICAgIC8vIENsaWNrZWQgb24gdGhlIGNvbnRlbnRcclxuICAgIGNsaWNrQ29udGVudDogZnVuY3Rpb24oY3VycmVudCwgZXZlbnQpIHtcclxuICAgICAgcmV0dXJuIGN1cnJlbnQudHlwZSA9PT0gXCJpbWFnZVwiID8gXCJ6b29tXCIgOiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ2xpY2tlZCBvbiB0aGUgc2xpZGVcclxuICAgIGNsaWNrU2xpZGU6IFwiY2xvc2VcIixcclxuXHJcbiAgICAvLyBDbGlja2VkIG9uIHRoZSBiYWNrZ3JvdW5kIChiYWNrZHJvcCkgZWxlbWVudDtcclxuICAgIC8vIGlmIHlvdSBoYXZlIG5vdCBjaGFuZ2VkIHRoZSBsYXlvdXQsIHRoZW4gbW9zdCBsaWtlbHkgeW91IG5lZWQgdG8gdXNlIGBjbGlja1NsaWRlYCBvcHRpb25cclxuICAgIGNsaWNrT3V0c2lkZTogXCJjbG9zZVwiLFxyXG5cclxuICAgIC8vIFNhbWUgYXMgcHJldmlvdXMgdHdvLCBidXQgZm9yIGRvdWJsZSBjbGlja1xyXG4gICAgZGJsY2xpY2tDb250ZW50OiBmYWxzZSxcclxuICAgIGRibGNsaWNrU2xpZGU6IGZhbHNlLFxyXG4gICAgZGJsY2xpY2tPdXRzaWRlOiBmYWxzZSxcclxuXHJcbiAgICAvLyBDdXN0b20gb3B0aW9ucyB3aGVuIG1vYmlsZSBkZXZpY2UgaXMgZGV0ZWN0ZWRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIG1vYmlsZToge1xyXG4gICAgICBwcmV2ZW50Q2FwdGlvbk92ZXJsYXA6IGZhbHNlLFxyXG4gICAgICBpZGxlVGltZTogZmFsc2UsXHJcbiAgICAgIGNsaWNrQ29udGVudDogZnVuY3Rpb24oY3VycmVudCwgZXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSBcImltYWdlXCIgPyBcInRvZ2dsZUNvbnRyb2xzXCIgOiBmYWxzZTtcclxuICAgICAgfSxcclxuICAgICAgY2xpY2tTbGlkZTogZnVuY3Rpb24oY3VycmVudCwgZXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSBcImltYWdlXCIgPyBcInRvZ2dsZUNvbnRyb2xzXCIgOiBcImNsb3NlXCI7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRibGNsaWNrQ29udGVudDogZnVuY3Rpb24oY3VycmVudCwgZXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSBcImltYWdlXCIgPyBcInpvb21cIiA6IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgICBkYmxjbGlja1NsaWRlOiBmdW5jdGlvbihjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiA/IFwiem9vbVwiIDogZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgbGFuZzogXCJlblwiLFxyXG4gICAgaTE4bjoge1xyXG4gICAgICBlbjoge1xyXG4gICAgICAgIENMT1NFOiBcIkNsb3NlXCIsXHJcbiAgICAgICAgTkVYVDogXCJOZXh0XCIsXHJcbiAgICAgICAgUFJFVjogXCJQcmV2aW91c1wiLFxyXG4gICAgICAgIEVSUk9SOiBcIlRoZSByZXF1ZXN0ZWQgY29udGVudCBjYW5ub3QgYmUgbG9hZGVkLiA8YnIvPiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLlwiLFxyXG4gICAgICAgIFBMQVlfU1RBUlQ6IFwiU3RhcnQgc2xpZGVzaG93XCIsXHJcbiAgICAgICAgUExBWV9TVE9QOiBcIlBhdXNlIHNsaWRlc2hvd1wiLFxyXG4gICAgICAgIEZVTExfU0NSRUVOOiBcIkZ1bGwgc2NyZWVuXCIsXHJcbiAgICAgICAgVEhVTUJTOiBcIlRodW1ibmFpbHNcIixcclxuICAgICAgICBET1dOTE9BRDogXCJEb3dubG9hZFwiLFxyXG4gICAgICAgIFNIQVJFOiBcIlNoYXJlXCIsXHJcbiAgICAgICAgWk9PTTogXCJab29tXCJcclxuICAgICAgfSxcclxuICAgICAgZGU6IHtcclxuICAgICAgICBDTE9TRTogXCJTY2hsaWUmc3psaWc7ZW5cIixcclxuICAgICAgICBORVhUOiBcIldlaXRlclwiLFxyXG4gICAgICAgIFBSRVY6IFwiWnVyJnV1bWw7Y2tcIixcclxuICAgICAgICBFUlJPUjogXCJEaWUgYW5nZWZvcmRlcnRlbiBEYXRlbiBrb25udGVuIG5pY2h0IGdlbGFkZW4gd2VyZGVuLiA8YnIvPiBCaXR0ZSB2ZXJzdWNoZW4gU2llIGVzIHNwJmF1bWw7dGVyIG5vY2htYWwuXCIsXHJcbiAgICAgICAgUExBWV9TVEFSVDogXCJEaWFzY2hhdSBzdGFydGVuXCIsXHJcbiAgICAgICAgUExBWV9TVE9QOiBcIkRpYXNjaGF1IGJlZW5kZW5cIixcclxuICAgICAgICBGVUxMX1NDUkVFTjogXCJWb2xsYmlsZFwiLFxyXG4gICAgICAgIFRIVU1CUzogXCJWb3JzY2hhdWJpbGRlclwiLFxyXG4gICAgICAgIERPV05MT0FEOiBcIkhlcnVudGVybGFkZW5cIixcclxuICAgICAgICBTSEFSRTogXCJUZWlsZW5cIixcclxuICAgICAgICBaT09NOiBcIlZlcmdyJm91bWw7JnN6bGlnO2VyblwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBGZXcgdXNlZnVsIHZhcmlhYmxlcyBhbmQgbWV0aG9kc1xyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciAkVyA9ICQod2luZG93KTtcclxuICB2YXIgJEQgPSAkKGRvY3VtZW50KTtcclxuXHJcbiAgdmFyIGNhbGxlZCA9IDA7XHJcblxyXG4gIC8vIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIGpRdWVyeSBvYmplY3QgYW5kIG5vdCBhIG5hdGl2ZSBKYXZhU2NyaXB0IG9iamVjdFxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIHZhciBpc1F1ZXJ5ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqICYmIG9iai5oYXNPd25Qcm9wZXJ0eSAmJiBvYmogaW5zdGFuY2VvZiAkO1xyXG4gIH07XHJcblxyXG4gIC8vIEhhbmRsZSBtdWx0aXBsZSBicm93c2VycyBmb3IgXCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIiBhbmQgXCJjYW5jZWxBbmltYXRpb25GcmFtZVwiXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIHZhciByZXF1ZXN0QUZyYW1lID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgLy8gaWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBzZXRUaW1lb3V0XHJcbiAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0pKCk7XHJcblxyXG4gIHZhciBjYW5jZWxBRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSkoKTtcclxuXHJcbiAgLy8gRGV0ZWN0IHRoZSBzdXBwb3J0ZWQgdHJhbnNpdGlvbi1lbmQgZXZlbnQgcHJvcGVydHkgbmFtZVxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICB2YXIgdHJhbnNpdGlvbkVuZCA9IChmdW5jdGlvbigpIHtcclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmYWtlZWxlbWVudFwiKSxcclxuICAgICAgdDtcclxuXHJcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSB7XHJcbiAgICAgIHRyYW5zaXRpb246IFwidHJhbnNpdGlvbmVuZFwiLFxyXG4gICAgICBPVHJhbnNpdGlvbjogXCJvVHJhbnNpdGlvbkVuZFwiLFxyXG4gICAgICBNb3pUcmFuc2l0aW9uOiBcInRyYW5zaXRpb25lbmRcIixcclxuICAgICAgV2Via2l0VHJhbnNpdGlvbjogXCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCJcclxuICAgIH07XHJcblxyXG4gICAgZm9yICh0IGluIHRyYW5zaXRpb25zKSB7XHJcbiAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25zW3RdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFwidHJhbnNpdGlvbmVuZFwiO1xyXG4gIH0pKCk7XHJcblxyXG4gIC8vIEZvcmNlIHJlZHJhdyBvbiBhbiBlbGVtZW50LlxyXG4gIC8vIFRoaXMgaGVscHMgaW4gY2FzZXMgd2hlcmUgdGhlIGJyb3dzZXIgZG9lc24ndCByZWRyYXcgYW4gdXBkYXRlZCBlbGVtZW50IHByb3Blcmx5XHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICB2YXIgZm9yY2VSZWRyYXcgPSBmdW5jdGlvbigkZWwpIHtcclxuICAgIHJldHVybiAkZWwgJiYgJGVsLmxlbmd0aCAmJiAkZWxbMF0ub2Zmc2V0SGVpZ2h0O1xyXG4gIH07XHJcblxyXG4gIC8vIEV4Y2x1ZGUgYXJyYXkgKGBidXR0b25zYCkgb3B0aW9ucyBmcm9tIGRlZXAgbWVyZ2luZ1xyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIHZhciBtZXJnZU9wdHMgPSBmdW5jdGlvbihvcHRzMSwgb3B0czIpIHtcclxuICAgIHZhciByZXogPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0czEsIG9wdHMyKTtcclxuXHJcbiAgICAkLmVhY2gob3B0czIsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgaWYgKCQuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICByZXpba2V5XSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmV6O1xyXG4gIH07XHJcblxyXG4gIC8vIEhvdyBtdWNoIG9mIGFuIGVsZW1lbnQgaXMgdmlzaWJsZSBpbiB2aWV3cG9ydFxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgaW5WaWV3cG9ydCA9IGZ1bmN0aW9uKGVsZW0pIHtcclxuICAgIHZhciBlbGVtQ2VudGVyLCByZXo7XHJcblxyXG4gICAgaWYgKCFlbGVtIHx8IGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIuZmFuY3lib3gtY29udGFpbmVyXCIpLmNzcyhcInBvaW50ZXItZXZlbnRzXCIsIFwibm9uZVwiKTtcclxuXHJcbiAgICBlbGVtQ2VudGVyID0ge1xyXG4gICAgICB4OiBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBlbGVtLm9mZnNldFdpZHRoIC8gMixcclxuICAgICAgeTogZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBlbGVtLm9mZnNldEhlaWdodCAvIDJcclxuICAgIH07XHJcblxyXG4gICAgcmV6ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlbGVtQ2VudGVyLngsIGVsZW1DZW50ZXIueSkgPT09IGVsZW07XHJcblxyXG4gICAgJChcIi5mYW5jeWJveC1jb250YWluZXJcIikuY3NzKFwicG9pbnRlci1ldmVudHNcIiwgXCJcIik7XHJcblxyXG4gICAgcmV0dXJuIHJlejtcclxuICB9O1xyXG5cclxuICAvLyBDbGFzcyBkZWZpbml0aW9uXHJcbiAgLy8gPT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgRmFuY3lCb3ggPSBmdW5jdGlvbihjb250ZW50LCBvcHRzLCBpbmRleCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYub3B0cyA9IG1lcmdlT3B0cyh7aW5kZXg6IGluZGV4fSwgJC5mYW5jeWJveC5kZWZhdWx0cyk7XHJcblxyXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChvcHRzKSkge1xyXG4gICAgICBzZWxmLm9wdHMgPSBtZXJnZU9wdHMoc2VsZi5vcHRzLCBvcHRzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJC5mYW5jeWJveC5pc01vYmlsZSkge1xyXG4gICAgICBzZWxmLm9wdHMgPSBtZXJnZU9wdHMoc2VsZi5vcHRzLCBzZWxmLm9wdHMubW9iaWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmlkID0gc2VsZi5vcHRzLmlkIHx8ICsrY2FsbGVkO1xyXG5cclxuICAgIHNlbGYuY3VyckluZGV4ID0gcGFyc2VJbnQoc2VsZi5vcHRzLmluZGV4LCAxMCkgfHwgMDtcclxuICAgIHNlbGYucHJldkluZGV4ID0gbnVsbDtcclxuXHJcbiAgICBzZWxmLnByZXZQb3MgPSBudWxsO1xyXG4gICAgc2VsZi5jdXJyUG9zID0gMDtcclxuXHJcbiAgICBzZWxmLmZpcnN0UnVuID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBBbGwgZ3JvdXAgaXRlbXNcclxuICAgIHNlbGYuZ3JvdXAgPSBbXTtcclxuXHJcbiAgICAvLyBFeGlzdGluZyBzbGlkZXMgKGZvciBjdXJyZW50LCBuZXh0IGFuZCBwcmV2aW91cyBnYWxsZXJ5IGl0ZW1zKVxyXG4gICAgc2VsZi5zbGlkZXMgPSB7fTtcclxuXHJcbiAgICAvLyBDcmVhdGUgZ3JvdXAgZWxlbWVudHNcclxuICAgIHNlbGYuYWRkQ29udGVudChjb250ZW50KTtcclxuXHJcbiAgICBpZiAoIXNlbGYuZ3JvdXAubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmluaXQoKTtcclxuICB9O1xyXG5cclxuICAkLmV4dGVuZChGYW5jeUJveC5wcm90b3R5cGUsIHtcclxuICAgIC8vIENyZWF0ZSBET00gc3RydWN0dXJlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgZmlyc3RJdGVtID0gc2VsZi5ncm91cFtzZWxmLmN1cnJJbmRleF0sXHJcbiAgICAgICAgZmlyc3RJdGVtT3B0cyA9IGZpcnN0SXRlbS5vcHRzLFxyXG4gICAgICAgICRjb250YWluZXIsXHJcbiAgICAgICAgYnV0dG9uU3RyO1xyXG5cclxuICAgICAgaWYgKGZpcnN0SXRlbU9wdHMuY2xvc2VFeGlzdGluZykge1xyXG4gICAgICAgICQuZmFuY3lib3guY2xvc2UodHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhpZGUgc2Nyb2xsYmFyc1xyXG4gICAgICAvLyA9PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiZmFuY3lib3gtYWN0aXZlXCIpO1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgICEkLmZhbmN5Ym94LmdldEluc3RhbmNlKCkgJiZcclxuICAgICAgICBmaXJzdEl0ZW1PcHRzLmhpZGVTY3JvbGxiYXIgIT09IGZhbHNlICYmXHJcbiAgICAgICAgISQuZmFuY3lib3guaXNNb2JpbGUgJiZcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICApIHtcclxuICAgICAgICAkKFwiaGVhZFwiKS5hcHBlbmQoXHJcbiAgICAgICAgICAnPHN0eWxlIGlkPVwiZmFuY3lib3gtc3R5bGUtbm9zY3JvbGxcIiB0eXBlPVwidGV4dC9jc3NcIj4uY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFye21hcmdpbi1yaWdodDonICtcclxuICAgICAgICAgICAgKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSArXHJcbiAgICAgICAgICAgIFwicHg7fTwvc3R5bGU+XCJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImNvbXBlbnNhdGUtZm9yLXNjcm9sbGJhclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgaHRtbCBtYXJrdXAgYW5kIHNldCByZWZlcmVuY2VzXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgLy8gQnVpbGQgaHRtbCBjb2RlIGZvciBidXR0b25zIGFuZCBpbnNlcnQgaW50byBtYWluIHRlbXBsYXRlXHJcbiAgICAgIGJ1dHRvblN0ciA9IFwiXCI7XHJcblxyXG4gICAgICAkLmVhY2goZmlyc3RJdGVtT3B0cy5idXR0b25zLCBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICBidXR0b25TdHIgKz0gZmlyc3RJdGVtT3B0cy5idG5UcGxbdmFsdWVdIHx8IFwiXCI7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIG1hcmt1cCBmcm9tIGJhc2UgdGVtcGxhdGUsIGl0IHdpbGwgYmUgaW5pdGlhbGx5IGhpZGRlbiB0b1xyXG4gICAgICAvLyBhdm9pZCB1bm5lY2Vzc2FyeSB3b3JrIGxpa2UgcGFpbnRpbmcgd2hpbGUgaW5pdGlhbGl6aW5nIGlzIG5vdCBjb21wbGV0ZVxyXG4gICAgICAkY29udGFpbmVyID0gJChcclxuICAgICAgICBzZWxmLnRyYW5zbGF0ZShcclxuICAgICAgICAgIHNlbGYsXHJcbiAgICAgICAgICBmaXJzdEl0ZW1PcHRzLmJhc2VUcGxcclxuICAgICAgICAgICAgLnJlcGxhY2UoXCJ7e2J1dHRvbnN9fVwiLCBidXR0b25TdHIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKFwie3thcnJvd3N9fVwiLCBmaXJzdEl0ZW1PcHRzLmJ0blRwbC5hcnJvd0xlZnQgKyBmaXJzdEl0ZW1PcHRzLmJ0blRwbC5hcnJvd1JpZ2h0KVxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJmYW5jeWJveC1jb250YWluZXItXCIgKyBzZWxmLmlkKVxyXG4gICAgICAgIC5hZGRDbGFzcyhmaXJzdEl0ZW1PcHRzLmJhc2VDbGFzcylcclxuICAgICAgICAuZGF0YShcIkZhbmN5Qm94XCIsIHNlbGYpXHJcbiAgICAgICAgLmFwcGVuZFRvKGZpcnN0SXRlbU9wdHMucGFyZW50RWwpO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIG9iamVjdCBob2xkaW5nIHJlZmVyZW5jZXMgdG8galF1ZXJ5IHdyYXBwZWQgbm9kZXNcclxuICAgICAgc2VsZi4kcmVmcyA9IHtcclxuICAgICAgICBjb250YWluZXI6ICRjb250YWluZXJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIFtcImJnXCIsIFwiaW5uZXJcIiwgXCJpbmZvYmFyXCIsIFwidG9vbGJhclwiLCBcInN0YWdlXCIsIFwiY2FwdGlvblwiLCBcIm5hdmlnYXRpb25cIl0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgc2VsZi4kcmVmc1tpdGVtXSA9ICRjb250YWluZXIuZmluZChcIi5mYW5jeWJveC1cIiArIGl0ZW0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcihcIm9uSW5pdFwiKTtcclxuXHJcbiAgICAgIC8vIEVuYWJsZSBldmVudHMsIGRlYWN0aXZlIHByZXZpb3VzIGluc3RhbmNlc1xyXG4gICAgICBzZWxmLmFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAvLyBCdWlsZCBzbGlkZXMsIGxvYWQgYW5kIHJldmVhbCBjb250ZW50XHJcbiAgICAgIHNlbGYuanVtcFRvKHNlbGYuY3VyckluZGV4KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2ltcGxlIGkxOG4gc3VwcG9ydCAtIHJlcGxhY2VzIG9iamVjdCBrZXlzIGZvdW5kIGluIHRlbXBsYXRlXHJcbiAgICAvLyB3aXRoIGNvcnJlc3BvbmRpbmcgdmFsdWVzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKG9iaiwgc3RyKSB7XHJcbiAgICAgIHZhciBhcnIgPSBvYmoub3B0cy5pMThuW29iai5vcHRzLmxhbmddIHx8IG9iai5vcHRzLmkxOG4uZW47XHJcblxyXG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xce1xceyhcXHcrKVxcfVxcfS9nLCBmdW5jdGlvbihtYXRjaCwgbikge1xyXG4gICAgICAgIHJldHVybiBhcnJbbl0gPT09IHVuZGVmaW5lZCA/IG1hdGNoIDogYXJyW25dO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gUG9wdWxhdGUgY3VycmVudCBncm91cCB3aXRoIGZyZXNoIGNvbnRlbnRcclxuICAgIC8vIENoZWNrIGlmIGVhY2ggb2JqZWN0IGhhcyB2YWxpZCB0eXBlIGFuZCBjb250ZW50XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGFkZENvbnRlbnQ6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGl0ZW1zID0gJC5tYWtlQXJyYXkoY29udGVudCksXHJcbiAgICAgICAgdGh1bWJzO1xyXG5cclxuICAgICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHt9LFxyXG4gICAgICAgICAgb3B0cyA9IHt9LFxyXG4gICAgICAgICAgJGl0ZW0sXHJcbiAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgZm91bmQsXHJcbiAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICBzcmNQYXJ0cztcclxuXHJcbiAgICAgICAgLy8gU3RlcCAxIC0gTWFrZSBzdXJlIHdlIGhhdmUgYW4gb2JqZWN0XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QoaXRlbSkpIHtcclxuICAgICAgICAgIC8vIFdlIHByb2JhYmx5IGhhdmUgbWFudWFsIHVzYWdlIGhlcmUsIHNvbWV0aGluZyBsaWtlXHJcbiAgICAgICAgICAvLyAkLmZhbmN5Ym94Lm9wZW4oIFsgeyBzcmMgOiBcImltYWdlLmpwZ1wiLCB0eXBlIDogXCJpbWFnZVwiIH0gXSApXHJcblxyXG4gICAgICAgICAgb2JqID0gaXRlbTtcclxuICAgICAgICAgIG9wdHMgPSBpdGVtLm9wdHMgfHwgaXRlbTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQudHlwZShpdGVtKSA9PT0gXCJvYmplY3RcIiAmJiAkKGl0ZW0pLmxlbmd0aCkge1xyXG4gICAgICAgICAgLy8gSGVyZSB3ZSBwcm9iYWJseSBoYXZlIGpRdWVyeSBjb2xsZWN0aW9uIHJldHVybmVkIGJ5IHNvbWUgc2VsZWN0b3JcclxuICAgICAgICAgICRpdGVtID0gJChpdGVtKTtcclxuXHJcbiAgICAgICAgICAvLyBTdXBwb3J0IGF0dHJpYnV0ZXMgbGlrZSBgZGF0YS1vcHRpb25zPSd7XCJ0b3VjaFwiIDogZmFsc2V9J2AgYW5kIGBkYXRhLXRvdWNoPSdmYWxzZSdgXHJcbiAgICAgICAgICBvcHRzID0gJGl0ZW0uZGF0YSgpIHx8IHt9O1xyXG4gICAgICAgICAgb3B0cyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRzLCBvcHRzLm9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgIC8vIEhlcmUgd2Ugc3RvcmUgY2xpY2tlZCBlbGVtZW50XHJcbiAgICAgICAgICBvcHRzLiRvcmlnID0gJGl0ZW07XHJcblxyXG4gICAgICAgICAgb2JqLnNyYyA9IHNlbGYub3B0cy5zcmMgfHwgb3B0cy5zcmMgfHwgJGl0ZW0uYXR0cihcImhyZWZcIik7XHJcblxyXG4gICAgICAgICAgLy8gQXNzdW1lIHRoYXQgc2ltcGxlIHN5bnRheCBpcyB1c2VkLCBmb3IgZXhhbXBsZTpcclxuICAgICAgICAgIC8vICAgYCQuZmFuY3lib3gub3BlbiggJChcIiN0ZXN0XCIpLCB7fSApO2BcclxuICAgICAgICAgIGlmICghb2JqLnR5cGUgJiYgIW9iai5zcmMpIHtcclxuICAgICAgICAgICAgb2JqLnR5cGUgPSBcImlubGluZVwiO1xyXG4gICAgICAgICAgICBvYmouc3JjID0gaXRlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gQXNzdW1lIHdlIGhhdmUgYSBzaW1wbGUgaHRtbCBjb2RlLCBmb3IgZXhhbXBsZTpcclxuICAgICAgICAgIC8vICAgJC5mYW5jeWJveC5vcGVuKCAnPGRpdj48aDE+SGkhPC9oMT48L2Rpdj4nICk7XHJcbiAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICBzcmM6IGl0ZW0gKyBcIlwiXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRWFjaCBnYWxsZXJ5IG9iamVjdCBoYXMgZnVsbCBjb2xsZWN0aW9uIG9mIG9wdGlvbnNcclxuICAgICAgICBvYmoub3B0cyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzZWxmLm9wdHMsIG9wdHMpO1xyXG5cclxuICAgICAgICAvLyBEbyBub3QgbWVyZ2UgYnV0dG9ucyBhcnJheVxyXG4gICAgICAgIGlmICgkLmlzQXJyYXkob3B0cy5idXR0b25zKSkge1xyXG4gICAgICAgICAgb2JqLm9wdHMuYnV0dG9ucyA9IG9wdHMuYnV0dG9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkLmZhbmN5Ym94LmlzTW9iaWxlICYmIG9iai5vcHRzLm1vYmlsZSkge1xyXG4gICAgICAgICAgb2JqLm9wdHMgPSBtZXJnZU9wdHMob2JqLm9wdHMsIG9iai5vcHRzLm1vYmlsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTdGVwIDIgLSBNYWtlIHN1cmUgd2UgaGF2ZSBjb250ZW50IHR5cGUsIGlmIG5vdCAtIHRyeSB0byBndWVzc1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHR5cGUgPSBvYmoudHlwZSB8fCBvYmoub3B0cy50eXBlO1xyXG4gICAgICAgIHNyYyA9IG9iai5zcmMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKCF0eXBlICYmIHNyYykge1xyXG4gICAgICAgICAgaWYgKChmb3VuZCA9IHNyYy5tYXRjaCgvXFwuKG1wNHxtb3Z8b2d2fHdlYm0pKChcXD98IykuKik/JC9pKSkpIHtcclxuICAgICAgICAgICAgdHlwZSA9IFwidmlkZW9cIjtcclxuXHJcbiAgICAgICAgICAgIGlmICghb2JqLm9wdHMudmlkZW8uZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgb2JqLm9wdHMudmlkZW8uZm9ybWF0ID0gXCJ2aWRlby9cIiArIChmb3VuZFsxXSA9PT0gXCJvZ3ZcIiA/IFwib2dnXCIgOiBmb3VuZFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3JjLm1hdGNoKC8oXmRhdGE6aW1hZ2VcXC9bYS16MC05K1xcLz1dKiwpfChcXC4oanAoZXxnfGVnKXxnaWZ8cG5nfGJtcHx3ZWJwfHN2Z3xpY28pKChcXD98IykuKik/JCkvaSkpIHtcclxuICAgICAgICAgICAgdHlwZSA9IFwiaW1hZ2VcIjtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc3JjLm1hdGNoKC9cXC4ocGRmKSgoXFw/fCMpLiopPyQvaSkpIHtcclxuICAgICAgICAgICAgdHlwZSA9IFwiaWZyYW1lXCI7XHJcbiAgICAgICAgICAgIG9iaiA9ICQuZXh0ZW5kKHRydWUsIG9iaiwge2NvbnRlbnRUeXBlOiBcInBkZlwiLCBvcHRzOiB7aWZyYW1lOiB7cHJlbG9hZDogZmFsc2V9fX0pO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzcmMuY2hhckF0KDApID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICB0eXBlID0gXCJpbmxpbmVcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICBvYmoudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlbGYudHJpZ2dlcihcIm9iamVjdE5lZWRzVHlwZVwiLCBvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFvYmouY29udGVudFR5cGUpIHtcclxuICAgICAgICAgIG9iai5jb250ZW50VHlwZSA9ICQuaW5BcnJheShvYmoudHlwZSwgW1wiaHRtbFwiLCBcImlubGluZVwiLCBcImFqYXhcIl0pID4gLTEgPyBcImh0bWxcIiA6IG9iai50eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3RlcCAzIC0gU29tZSBhZGp1c3RtZW50c1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgb2JqLmluZGV4ID0gc2VsZi5ncm91cC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmIChvYmoub3B0cy5zbWFsbEJ0biA9PSBcImF1dG9cIikge1xyXG4gICAgICAgICAgb2JqLm9wdHMuc21hbGxCdG4gPSAkLmluQXJyYXkob2JqLnR5cGUsIFtcImh0bWxcIiwgXCJpbmxpbmVcIiwgXCJhamF4XCJdKSA+IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9iai5vcHRzLnRvb2xiYXIgPT09IFwiYXV0b1wiKSB7XHJcbiAgICAgICAgICBvYmoub3B0cy50b29sYmFyID0gIW9iai5vcHRzLnNtYWxsQnRuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmluZCB0aHVtYm5haWwgaW1hZ2UsIGNoZWNrIGlmIGV4aXN0cyBhbmQgaWYgaXMgaW4gdGhlIHZpZXdwb3J0XHJcbiAgICAgICAgb2JqLiR0aHVtYiA9IG9iai5vcHRzLiR0aHVtYiB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAob2JqLm9wdHMuJHRyaWdnZXIgJiYgb2JqLmluZGV4ID09PSBzZWxmLm9wdHMuaW5kZXgpIHtcclxuICAgICAgICAgIG9iai4kdGh1bWIgPSBvYmoub3B0cy4kdHJpZ2dlci5maW5kKFwiaW1nOmZpcnN0XCIpO1xyXG5cclxuICAgICAgICAgIGlmIChvYmouJHRodW1iLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBvYmoub3B0cy4kb3JpZyA9IG9iai5vcHRzLiR0cmlnZ2VyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEob2JqLiR0aHVtYiAmJiBvYmouJHRodW1iLmxlbmd0aCkgJiYgb2JqLm9wdHMuJG9yaWcpIHtcclxuICAgICAgICAgIG9iai4kdGh1bWIgPSBvYmoub3B0cy4kb3JpZy5maW5kKFwiaW1nOmZpcnN0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9iai4kdGh1bWIgJiYgIW9iai4kdGh1bWIubGVuZ3RoKSB7XHJcbiAgICAgICAgICBvYmouJHRodW1iID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50aHVtYiA9IG9iai5vcHRzLnRodW1iIHx8IChvYmouJHRodW1iID8gb2JqLiR0aHVtYlswXS5zcmMgOiBudWxsKTtcclxuXHJcbiAgICAgICAgLy8gXCJjYXB0aW9uXCIgaXMgYSBcInNwZWNpYWxcIiBvcHRpb24sIGl0IGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBjYXB0aW9uIHBlciBnYWxsZXJ5IGl0ZW1cclxuICAgICAgICBpZiAoJC50eXBlKG9iai5vcHRzLmNhcHRpb24pID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgIG9iai5vcHRzLmNhcHRpb24gPSBvYmoub3B0cy5jYXB0aW9uLmFwcGx5KGl0ZW0sIFtzZWxmLCBvYmpdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkLnR5cGUoc2VsZi5vcHRzLmNhcHRpb24pID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgIG9iai5vcHRzLmNhcHRpb24gPSBzZWxmLm9wdHMuY2FwdGlvbi5hcHBseShpdGVtLCBbc2VsZiwgb2JqXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBjYXB0aW9uIGFzIGEgc3RyaW5nIG9yIGpRdWVyeSBvYmplY3RcclxuICAgICAgICBpZiAoIShvYmoub3B0cy5jYXB0aW9uIGluc3RhbmNlb2YgJCkpIHtcclxuICAgICAgICAgIG9iai5vcHRzLmNhcHRpb24gPSBvYmoub3B0cy5jYXB0aW9uID09PSB1bmRlZmluZWQgPyBcIlwiIDogb2JqLm9wdHMuY2FwdGlvbiArIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB1cmwgY29udGFpbnMgXCJmaWx0ZXJcIiB1c2VkIHRvIGZpbHRlciB0aGUgY29udGVudFxyXG4gICAgICAgIC8vIEV4YW1wbGU6IFwiYWpheC5odG1sICNzb21ldGhpbmdcIlxyXG4gICAgICAgIGlmIChvYmoudHlwZSA9PT0gXCJhamF4XCIpIHtcclxuICAgICAgICAgIHNyY1BhcnRzID0gc3JjLnNwbGl0KC9cXHMrLywgMik7XHJcblxyXG4gICAgICAgICAgaWYgKHNyY1BhcnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgb2JqLnNyYyA9IHNyY1BhcnRzLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICBvYmoub3B0cy5maWx0ZXIgPSBzcmNQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGlkZSBhbGwgYnV0dG9ucyBhbmQgZGlzYWJsZSBpbnRlcmFjdGl2aXR5IGZvciBtb2RhbCBpdGVtc1xyXG4gICAgICAgIGlmIChvYmoub3B0cy5tb2RhbCkge1xyXG4gICAgICAgICAgb2JqLm9wdHMgPSAkLmV4dGVuZCh0cnVlLCBvYmoub3B0cywge1xyXG4gICAgICAgICAgICB0cmFwRm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBidXR0b25zXHJcbiAgICAgICAgICAgIGluZm9iYXI6IDAsXHJcbiAgICAgICAgICAgIHRvb2xiYXI6IDAsXHJcblxyXG4gICAgICAgICAgICBzbWFsbEJ0bjogMCxcclxuXHJcbiAgICAgICAgICAgIC8vIERpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvblxyXG4gICAgICAgICAgICBrZXlib2FyZDogMCxcclxuXHJcbiAgICAgICAgICAgIC8vIERpc2FibGUgc29tZSBtb2R1bGVzXHJcbiAgICAgICAgICAgIHNsaWRlU2hvdzogMCxcclxuICAgICAgICAgICAgZnVsbFNjcmVlbjogMCxcclxuICAgICAgICAgICAgdGh1bWJzOiAwLFxyXG4gICAgICAgICAgICB0b3VjaDogMCxcclxuXHJcbiAgICAgICAgICAgIC8vIERpc2FibGUgY2xpY2sgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICAgICAgY2xpY2tDb250ZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgY2xpY2tTbGlkZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNsaWNrT3V0c2lkZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRibGNsaWNrQ29udGVudDogZmFsc2UsXHJcbiAgICAgICAgICAgIGRibGNsaWNrU2xpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkYmxjbGlja091dHNpZGU6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFN0ZXAgNCAtIEFkZCBwcm9jZXNzZWQgb2JqZWN0IHRvIGdyb3VwXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2VsZi5ncm91cC5wdXNoKG9iaik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gVXBkYXRlIGNvbnRyb2xzIGlmIGdhbGxlcnkgaXMgYWxyZWFkeSBvcGVuZWRcclxuICAgICAgaWYgKE9iamVjdC5rZXlzKHNlbGYuc2xpZGVzKS5sZW5ndGgpIHtcclxuICAgICAgICBzZWxmLnVwZGF0ZUNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSB0aHVtYm5haWxzLCBpZiBuZWVkZWRcclxuICAgICAgICB0aHVtYnMgPSBzZWxmLlRodW1icztcclxuXHJcbiAgICAgICAgaWYgKHRodW1icyAmJiB0aHVtYnMuaXNBY3RpdmUpIHtcclxuICAgICAgICAgIHRodW1icy5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgICB0aHVtYnMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gQXR0YWNoIGFuIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zIGZvcjpcclxuICAgIC8vICAgLSBuYXZpZ2F0aW9uIGJ1dHRvbnNcclxuICAgIC8vICAgLSBicm93c2VyIHNjcm9sbGluZywgcmVzaXppbmc7XHJcbiAgICAvLyAgIC0gZm9jdXNpbmdcclxuICAgIC8vICAgLSBrZXlib2FyZFxyXG4gICAgLy8gICAtIGRldGVjdGluZyBpbmFjdGl2aXR5XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGFkZEV2ZW50czogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHNlbGYucmVtb3ZlRXZlbnRzKCk7XHJcblxyXG4gICAgICAvLyBNYWtlIG5hdmlnYXRpb24gZWxlbWVudHMgY2xpY2thYmxlXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyXHJcbiAgICAgICAgLm9uKFwiY2xpY2suZmItY2xvc2VcIiwgXCJbZGF0YS1mYW5jeWJveC1jbG9zZV1cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLmNsb3NlKGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKFwidG91Y2hzdGFydC5mYi1wcmV2IGNsaWNrLmZiLXByZXZcIiwgXCJbZGF0YS1mYW5jeWJveC1wcmV2XVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIHNlbGYucHJldmlvdXMoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbihcInRvdWNoc3RhcnQuZmItbmV4dCBjbGljay5mYi1uZXh0XCIsIFwiW2RhdGEtZmFuY3lib3gtbmV4dF1cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLm5leHQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbihcImNsaWNrLmZiXCIsIFwiW2RhdGEtZmFuY3lib3gtem9vbV1cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgLy8gQ2xpY2sgaGFuZGxlciBmb3Igem9vbSBidXR0b25cclxuICAgICAgICAgIHNlbGZbc2VsZi5pc1NjYWxlZERvd24oKSA/IFwic2NhbGVUb0FjdHVhbFwiIDogXCJzY2FsZVRvRml0XCJdKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBIYW5kbGUgcGFnZSBzY3JvbGxpbmcgYW5kIGJyb3dzZXIgcmVzaXppbmdcclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAkVy5vbihcIm9yaWVudGF0aW9uY2hhbmdlLmZiIHJlc2l6ZS5mYlwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKGUgJiYgZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC50eXBlID09PSBcInJlc2l6ZVwiKSB7XHJcbiAgICAgICAgICBpZiAoc2VsZi5yZXF1ZXN0SWQpIHtcclxuICAgICAgICAgICAgY2FuY2VsQUZyYW1lKHNlbGYucmVxdWVzdElkKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZWxmLnJlcXVlc3RJZCA9IHJlcXVlc3RBRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlKGUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChzZWxmLmN1cnJlbnQgJiYgc2VsZi5jdXJyZW50LnR5cGUgPT09IFwiaWZyYW1lXCIpIHtcclxuICAgICAgICAgICAgc2VsZi4kcmVmcy5zdGFnZS5oaWRlKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi4kcmVmcy5zdGFnZS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgIHNlbGYudXBkYXRlKGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmlzTW9iaWxlID8gNjAwIDogMjUwXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkRC5vbihcImtleWRvd24uZmJcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZmFuY3lib3ggPyAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCkgOiBudWxsLFxyXG4gICAgICAgICAgY3VycmVudCA9IGluc3RhbmNlLmN1cnJlbnQsXHJcbiAgICAgICAgICBrZXljb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2g7XHJcblxyXG4gICAgICAgIC8vIFRyYXAga2V5Ym9hcmQgZm9jdXMgaW5zaWRlIG9mIHRoZSBtb2RhbFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBpZiAoa2V5Y29kZSA9PSA5KSB7XHJcbiAgICAgICAgICBpZiAoY3VycmVudC5vcHRzLnRyYXBGb2N1cykge1xyXG4gICAgICAgICAgICBzZWxmLmZvY3VzKGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVuYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50Lm9wdHMua2V5Ym9hcmQgfHwgZS5jdHJsS2V5IHx8IGUuYWx0S2V5IHx8IGUuc2hpZnRLZXkgfHwgJChlLnRhcmdldCkuaXMoXCJpbnB1dCx0ZXh0YXJlYSx2aWRlbyxhdWRpb1wiKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQmFja3NwYWNlIGFuZCBFc2Mga2V5c1xyXG4gICAgICAgIGlmIChrZXljb2RlID09PSA4IHx8IGtleWNvZGUgPT09IDI3KSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgc2VsZi5jbG9zZShlKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMZWZ0IGFycm93IGFuZCBVcCBhcnJvd1xyXG4gICAgICAgIGlmIChrZXljb2RlID09PSAzNyB8fCBrZXljb2RlID09PSAzOCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIHNlbGYucHJldmlvdXMoKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSaWdoIGFycm93IGFuZCBEb3duIGFycm93XHJcbiAgICAgICAgaWYgKGtleWNvZGUgPT09IDM5IHx8IGtleWNvZGUgPT09IDQwKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgc2VsZi5uZXh0KCk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKFwiYWZ0ZXJLZXlkb3duXCIsIGUsIGtleWNvZGUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIEhpZGUgY29udHJvbHMgYWZ0ZXIgc29tZSBpbmFjdGl2aXR5IHBlcmlvZFxyXG4gICAgICBpZiAoc2VsZi5ncm91cFtzZWxmLmN1cnJJbmRleF0ub3B0cy5pZGxlVGltZSkge1xyXG4gICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgJEQub24oXHJcbiAgICAgICAgICBcIm1vdXNlbW92ZS5mYi1pZGxlIG1vdXNlbGVhdmUuZmItaWRsZSBtb3VzZWRvd24uZmItaWRsZSB0b3VjaHN0YXJ0LmZiLWlkbGUgdG91Y2htb3ZlLmZiLWlkbGUgc2Nyb2xsLmZiLWlkbGUga2V5ZG93bi5mYi1pZGxlXCIsXHJcbiAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzSWRsZSkge1xyXG4gICAgICAgICAgICAgIHNlbGYuc2hvd0NvbnRyb2xzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuaXNJZGxlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc2VsZi5pZGxlSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlcisrO1xyXG5cclxuICAgICAgICAgIGlmIChzZWxmLmlkbGVTZWNvbmRzQ291bnRlciA+PSBzZWxmLmdyb3VwW3NlbGYuY3VyckluZGV4XS5vcHRzLmlkbGVUaW1lICYmICFzZWxmLmlzRHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0lkbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmhpZGVDb250cm9scygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFJlbW92ZSBldmVudHMgYWRkZWQgYnkgdGhlIGNvcmVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICByZW1vdmVFdmVudHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAkVy5vZmYoXCJvcmllbnRhdGlvbmNoYW5nZS5mYiByZXNpemUuZmJcIik7XHJcbiAgICAgICRELm9mZihcImtleWRvd24uZmIgLmZiLWlkbGVcIik7XHJcblxyXG4gICAgICB0aGlzLiRyZWZzLmNvbnRhaW5lci5vZmYoXCIuZmItY2xvc2UgLmZiLXByZXYgLmZiLW5leHRcIik7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pZGxlSW50ZXJ2YWwpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChzZWxmLmlkbGVJbnRlcnZhbCk7XHJcblxyXG4gICAgICAgIHNlbGYuaWRsZUludGVydmFsID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGFuZ2UgdG8gcHJldmlvdXMgZ2FsbGVyeSBpdGVtXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgcHJldmlvdXM6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmp1bXBUbyh0aGlzLmN1cnJQb3MgLSAxLCBkdXJhdGlvbik7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENoYW5nZSB0byBuZXh0IGdhbGxlcnkgaXRlbVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgbmV4dDogZnVuY3Rpb24oZHVyYXRpb24pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuanVtcFRvKHRoaXMuY3VyclBvcyArIDEsIGR1cmF0aW9uKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gU3dpdGNoIHRvIHNlbGVjdGVkIGdhbGxlcnkgaXRlbVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGp1bXBUbzogZnVuY3Rpb24ocG9zLCBkdXJhdGlvbikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgZ3JvdXBMZW4gPSBzZWxmLmdyb3VwLmxlbmd0aCxcclxuICAgICAgICBmaXJzdFJ1bixcclxuICAgICAgICBpc01vdmVkLFxyXG4gICAgICAgIGxvb3AsXHJcbiAgICAgICAgY3VycmVudCxcclxuICAgICAgICBwcmV2aW91cyxcclxuICAgICAgICBzbGlkZVBvcyxcclxuICAgICAgICBzdGFnZVBvcyxcclxuICAgICAgICBwcm9wLFxyXG4gICAgICAgIGRpZmY7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc0RyYWdnaW5nIHx8IHNlbGYuaXNDbG9zaW5nIHx8IChzZWxmLmlzQW5pbWF0aW5nICYmIHNlbGYuZmlyc3RSdW4pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTaG91bGQgbG9vcD9cclxuICAgICAgcG9zID0gcGFyc2VJbnQocG9zLCAxMCk7XHJcbiAgICAgIGxvb3AgPSBzZWxmLmN1cnJlbnQgPyBzZWxmLmN1cnJlbnQub3B0cy5sb29wIDogc2VsZi5vcHRzLmxvb3A7XHJcblxyXG4gICAgICBpZiAoIWxvb3AgJiYgKHBvcyA8IDAgfHwgcG9zID49IGdyb3VwTGVuKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgb3BlbmluZyBmb3IgdGhlIGZpcnN0IHRpbWU7IHRoaXMgaGVscHMgdG8gc3BlZWQgdGhpbmdzIHVwXHJcbiAgICAgIGZpcnN0UnVuID0gc2VsZi5maXJzdFJ1biA9ICFPYmplY3Qua2V5cyhzZWxmLnNsaWRlcykubGVuZ3RoO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIHNsaWRlc1xyXG4gICAgICBwcmV2aW91cyA9IHNlbGYuY3VycmVudDtcclxuXHJcbiAgICAgIHNlbGYucHJldkluZGV4ID0gc2VsZi5jdXJySW5kZXg7XHJcbiAgICAgIHNlbGYucHJldlBvcyA9IHNlbGYuY3VyclBvcztcclxuXHJcbiAgICAgIGN1cnJlbnQgPSBzZWxmLmNyZWF0ZVNsaWRlKHBvcyk7XHJcblxyXG4gICAgICBpZiAoZ3JvdXBMZW4gPiAxKSB7XHJcbiAgICAgICAgaWYgKGxvb3AgfHwgY3VycmVudC5pbmRleCA8IGdyb3VwTGVuIC0gMSkge1xyXG4gICAgICAgICAgc2VsZi5jcmVhdGVTbGlkZShwb3MgKyAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsb29wIHx8IGN1cnJlbnQuaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICBzZWxmLmNyZWF0ZVNsaWRlKHBvcyAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5jdXJyZW50ID0gY3VycmVudDtcclxuICAgICAgc2VsZi5jdXJySW5kZXggPSBjdXJyZW50LmluZGV4O1xyXG4gICAgICBzZWxmLmN1cnJQb3MgPSBjdXJyZW50LnBvcztcclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcihcImJlZm9yZVNob3dcIiwgZmlyc3RSdW4pO1xyXG5cclxuICAgICAgc2VsZi51cGRhdGVDb250cm9scygpO1xyXG5cclxuICAgICAgLy8gVmFsaWRhdGUgZHVyYXRpb24gbGVuZ3RoXHJcbiAgICAgIGN1cnJlbnQuZm9yY2VkRHVyYXRpb24gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBpZiAoJC5pc051bWVyaWMoZHVyYXRpb24pKSB7XHJcbiAgICAgICAgY3VycmVudC5mb3JjZWREdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGR1cmF0aW9uID0gY3VycmVudC5vcHRzW2ZpcnN0UnVuID8gXCJhbmltYXRpb25EdXJhdGlvblwiIDogXCJ0cmFuc2l0aW9uRHVyYXRpb25cIl07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGR1cmF0aW9uID0gcGFyc2VJbnQoZHVyYXRpb24sIDEwKTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIHVzZXIgaGFzIHN3aXBlZCB0aGUgc2xpZGVzIG9yIGlmIHN0aWxsIGFuaW1hdGluZ1xyXG4gICAgICBpc01vdmVkID0gc2VsZi5pc01vdmVkKGN1cnJlbnQpO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGN1cnJlbnQgc2xpZGUgaXMgdmlzaWJsZVxyXG4gICAgICBjdXJyZW50LiRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1jdXJyZW50XCIpO1xyXG5cclxuICAgICAgLy8gRnJlc2ggc3RhcnQgLSByZXZlYWwgY29udGFpbmVyLCBjdXJyZW50IHNsaWRlIGFuZCBzdGFydCBsb2FkaW5nIGNvbnRlbnRcclxuICAgICAgaWYgKGZpcnN0UnVuKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnQub3B0cy5hbmltYXRpb25FZmZlY3QgJiYgZHVyYXRpb24pIHtcclxuICAgICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIiwgZHVyYXRpb24gKyBcIm1zXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIuYWRkQ2xhc3MoXCJmYW5jeWJveC1pcy1vcGVuXCIpLnRyaWdnZXIoXCJmb2N1c1wiKTtcclxuXHJcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBsb2FkIGNvbnRlbnQgaW50byBzbGlkZVxyXG4gICAgICAgIC8vIFRoaXMgd2lsbCBsYXRlciBjYWxsIGBhZnRlckxvYWRgIC0+IGByZXZlYWxDb250ZW50YFxyXG4gICAgICAgIHNlbGYubG9hZFNsaWRlKGN1cnJlbnQpO1xyXG5cclxuICAgICAgICBzZWxmLnByZWxvYWQoXCJpbWFnZVwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBHZXQgYWN0dWFsIHNsaWRlL3N0YWdlIHBvc2l0aW9ucyAoYmVmb3JlIGNsZWFuaW5nIHVwKVxyXG4gICAgICBzbGlkZVBvcyA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKHByZXZpb3VzLiRzbGlkZSk7XHJcbiAgICAgIHN0YWdlUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoc2VsZi4kcmVmcy5zdGFnZSk7XHJcblxyXG4gICAgICAvLyBDbGVhbiB1cCBhbGwgc2xpZGVzXHJcbiAgICAgICQuZWFjaChzZWxmLnNsaWRlcywgZnVuY3Rpb24oaW5kZXgsIHNsaWRlKSB7XHJcbiAgICAgICAgJC5mYW5jeWJveC5zdG9wKHNsaWRlLiRzbGlkZSwgdHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHByZXZpb3VzLnBvcyAhPT0gY3VycmVudC5wb3MpIHtcclxuICAgICAgICBwcmV2aW91cy5pc0NvbXBsZXRlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByZXZpb3VzLiRzbGlkZS5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1jb21wbGV0ZSBmYW5jeWJveC1zbGlkZS0tY3VycmVudFwiKTtcclxuXHJcbiAgICAgIC8vIElmIHNsaWRlcyBhcmUgb3V0IG9mIHBsYWNlLCB0aGVuIGFuaW1hdGUgdGhlbSB0byBjb3JyZWN0IHBvc2l0aW9uXHJcbiAgICAgIGlmIChpc01vdmVkKSB7XHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGhvcml6b250YWwgc3dpcGUgZGlzdGFuY2VcclxuICAgICAgICBkaWZmID0gc2xpZGVQb3MubGVmdCAtIChwcmV2aW91cy5wb3MgKiBzbGlkZVBvcy53aWR0aCArIHByZXZpb3VzLnBvcyAqIHByZXZpb3VzLm9wdHMuZ3V0dGVyKTtcclxuXHJcbiAgICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcclxuICAgICAgICAgIHNsaWRlLiRzbGlkZS5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LWFuaW1hdGVkXCIpLnJlbW92ZUNsYXNzKGZ1bmN0aW9uKGluZGV4LCBjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjbGFzc05hbWUubWF0Y2goLyhefFxccylmYW5jeWJveC1meC1cXFMrL2cpIHx8IFtdKS5qb2luKFwiIFwiKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGVhY2ggc2xpZGUgaXMgaW4gZXF1YWwgZGlzdGFuY2VcclxuICAgICAgICAgIC8vIFRoaXMgaXMgbW9zdGx5IG5lZWRlZCBmb3IgZnJlc2hseSBhZGRlZCBzbGlkZXMsIGJlY2F1c2UgdGhleSBhcmUgbm90IHlldCBwb3NpdGlvbmVkXHJcbiAgICAgICAgICB2YXIgbGVmdFBvcyA9IHNsaWRlLnBvcyAqIHNsaWRlUG9zLndpZHRoICsgc2xpZGUucG9zICogc2xpZGUub3B0cy5ndXR0ZXI7XHJcblxyXG4gICAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoc2xpZGUuJHNsaWRlLCB7dG9wOiAwLCBsZWZ0OiBsZWZ0UG9zIC0gc3RhZ2VQb3MubGVmdCArIGRpZmZ9KTtcclxuXHJcbiAgICAgICAgICBpZiAoc2xpZGUucG9zICE9PSBjdXJyZW50LnBvcykge1xyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUuYWRkQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tXCIgKyAoc2xpZGUucG9zID4gY3VycmVudC5wb3MgPyBcIm5leHRcIiA6IFwicHJldmlvdXNcIikpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFJlZHJhdyB0byBtYWtlIHN1cmUgdGhhdCB0cmFuc2l0aW9uIHdpbGwgc3RhcnRcclxuICAgICAgICAgIGZvcmNlUmVkcmF3KHNsaWRlLiRzbGlkZSk7XHJcblxyXG4gICAgICAgICAgLy8gQW5pbWF0ZSB0aGUgc2xpZGVcclxuICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZShcclxuICAgICAgICAgICAgc2xpZGUuJHNsaWRlLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgIGxlZnQ6IChzbGlkZS5wb3MgLSBjdXJyZW50LnBvcykgKiBzbGlkZVBvcy53aWR0aCArIChzbGlkZS5wb3MgLSBjdXJyZW50LnBvcykgKiBzbGlkZS5vcHRzLmd1dHRlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkdXJhdGlvbixcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgc2xpZGUuJHNsaWRlXHJcbiAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICBvcGFjaXR5OiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzXCIpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gJiYgY3VycmVudC5vcHRzLnRyYW5zaXRpb25FZmZlY3QpIHtcclxuICAgICAgICAvLyBTZXQgdHJhbnNpdGlvbiBlZmZlY3QgZm9yIHByZXZpb3VzbHkgYWN0aXZlIHNsaWRlXHJcbiAgICAgICAgcHJvcCA9IFwiZmFuY3lib3gtYW5pbWF0ZWQgZmFuY3lib3gtZngtXCIgKyBjdXJyZW50Lm9wdHMudHJhbnNpdGlvbkVmZmVjdDtcclxuXHJcbiAgICAgICAgcHJldmlvdXMuJHNsaWRlLmFkZENsYXNzKFwiZmFuY3lib3gtc2xpZGUtLVwiICsgKHByZXZpb3VzLnBvcyA+IGN1cnJlbnQucG9zID8gXCJuZXh0XCIgOiBcInByZXZpb3VzXCIpKTtcclxuXHJcbiAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgICAgcHJldmlvdXMuJHNsaWRlLFxyXG4gICAgICAgICAgcHJvcCxcclxuICAgICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzLiRzbGlkZS5yZW1vdmVDbGFzcyhwcm9wKS5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91c1wiKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50LmlzTG9hZGVkKSB7XHJcbiAgICAgICAgc2VsZi5yZXZlYWxDb250ZW50KGN1cnJlbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYubG9hZFNsaWRlKGN1cnJlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnByZWxvYWQoXCJpbWFnZVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ3JlYXRlIG5ldyBcInNsaWRlXCIgZWxlbWVudFxyXG4gICAgLy8gVGhlc2UgYXJlIGdhbGxlcnkgaXRlbXMgIHRoYXQgYXJlIGFjdHVhbGx5IGFkZGVkIHRvIERPTVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGNyZWF0ZVNsaWRlOiBmdW5jdGlvbihwb3MpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICRzbGlkZSxcclxuICAgICAgICBpbmRleDtcclxuXHJcbiAgICAgIGluZGV4ID0gcG9zICUgc2VsZi5ncm91cC5sZW5ndGg7XHJcbiAgICAgIGluZGV4ID0gaW5kZXggPCAwID8gc2VsZi5ncm91cC5sZW5ndGggKyBpbmRleCA6IGluZGV4O1xyXG5cclxuICAgICAgaWYgKCFzZWxmLnNsaWRlc1twb3NdICYmIHNlbGYuZ3JvdXBbaW5kZXhdKSB7XHJcbiAgICAgICAgJHNsaWRlID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXNsaWRlXCI+PC9kaXY+JykuYXBwZW5kVG8oc2VsZi4kcmVmcy5zdGFnZSk7XHJcblxyXG4gICAgICAgIHNlbGYuc2xpZGVzW3Bvc10gPSAkLmV4dGVuZCh0cnVlLCB7fSwgc2VsZi5ncm91cFtpbmRleF0sIHtcclxuICAgICAgICAgIHBvczogcG9zLFxyXG4gICAgICAgICAgJHNsaWRlOiAkc2xpZGUsXHJcbiAgICAgICAgICBpc0xvYWRlZDogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVTbGlkZShzZWxmLnNsaWRlc1twb3NdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHNlbGYuc2xpZGVzW3Bvc107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFNjYWxlIGltYWdlIHRvIHRoZSBhY3R1YWwgc2l6ZSBvZiB0aGUgaW1hZ2U7XHJcbiAgICAvLyB4IGFuZCB5IHZhbHVlcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHNsaWRlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2NhbGVUb0FjdHVhbDogZnVuY3Rpb24oeCwgeSwgZHVyYXRpb24pIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQsXHJcbiAgICAgICAgJGNvbnRlbnQgPSBjdXJyZW50LiRjb250ZW50LFxyXG4gICAgICAgIGNhbnZhc1dpZHRoID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoY3VycmVudC4kc2xpZGUpLndpZHRoLFxyXG4gICAgICAgIGNhbnZhc0hlaWdodCA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKGN1cnJlbnQuJHNsaWRlKS5oZWlnaHQsXHJcbiAgICAgICAgbmV3SW1nV2lkdGggPSBjdXJyZW50LndpZHRoLFxyXG4gICAgICAgIG5ld0ltZ0hlaWdodCA9IGN1cnJlbnQuaGVpZ2h0LFxyXG4gICAgICAgIGltZ1BvcyxcclxuICAgICAgICBwb3NYLFxyXG4gICAgICAgIHBvc1ksXHJcbiAgICAgICAgc2NhbGVYLFxyXG4gICAgICAgIHNjYWxlWTtcclxuXHJcbiAgICAgIGlmIChzZWxmLmlzQW5pbWF0aW5nIHx8IHNlbGYuaXNNb3ZlZCgpIHx8ICEkY29udGVudCB8fCAhKGN1cnJlbnQudHlwZSA9PSBcImltYWdlXCIgJiYgY3VycmVudC5pc0xvYWRlZCAmJiAhY3VycmVudC5oYXNFcnJvcikpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgJC5mYW5jeWJveC5zdG9wKCRjb250ZW50KTtcclxuXHJcbiAgICAgIHggPSB4ID09PSB1bmRlZmluZWQgPyBjYW52YXNXaWR0aCAqIDAuNSA6IHg7XHJcbiAgICAgIHkgPSB5ID09PSB1bmRlZmluZWQgPyBjYW52YXNIZWlnaHQgKiAwLjUgOiB5O1xyXG5cclxuICAgICAgaW1nUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoJGNvbnRlbnQpO1xyXG5cclxuICAgICAgaW1nUG9zLnRvcCAtPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShjdXJyZW50LiRzbGlkZSkudG9wO1xyXG4gICAgICBpbWdQb3MubGVmdCAtPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShjdXJyZW50LiRzbGlkZSkubGVmdDtcclxuXHJcbiAgICAgIHNjYWxlWCA9IG5ld0ltZ1dpZHRoIC8gaW1nUG9zLndpZHRoO1xyXG4gICAgICBzY2FsZVkgPSBuZXdJbWdIZWlnaHQgLyBpbWdQb3MuaGVpZ2h0O1xyXG5cclxuICAgICAgLy8gR2V0IGNlbnRlciBwb3NpdGlvbiBmb3Igb3JpZ2luYWwgaW1hZ2VcclxuICAgICAgcG9zWCA9IGNhbnZhc1dpZHRoICogMC41IC0gbmV3SW1nV2lkdGggKiAwLjU7XHJcbiAgICAgIHBvc1kgPSBjYW52YXNIZWlnaHQgKiAwLjUgLSBuZXdJbWdIZWlnaHQgKiAwLjU7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgaW1hZ2UgZG9lcyBub3QgbW92ZSBhd2F5IGZyb20gZWRnZXNcclxuICAgICAgaWYgKG5ld0ltZ1dpZHRoID4gY2FudmFzV2lkdGgpIHtcclxuICAgICAgICBwb3NYID0gaW1nUG9zLmxlZnQgKiBzY2FsZVggLSAoeCAqIHNjYWxlWCAtIHgpO1xyXG5cclxuICAgICAgICBpZiAocG9zWCA+IDApIHtcclxuICAgICAgICAgIHBvc1ggPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc1ggPCBjYW52YXNXaWR0aCAtIG5ld0ltZ1dpZHRoKSB7XHJcbiAgICAgICAgICBwb3NYID0gY2FudmFzV2lkdGggLSBuZXdJbWdXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChuZXdJbWdIZWlnaHQgPiBjYW52YXNIZWlnaHQpIHtcclxuICAgICAgICBwb3NZID0gaW1nUG9zLnRvcCAqIHNjYWxlWSAtICh5ICogc2NhbGVZIC0geSk7XHJcblxyXG4gICAgICAgIGlmIChwb3NZID4gMCkge1xyXG4gICAgICAgICAgcG9zWSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocG9zWSA8IGNhbnZhc0hlaWdodCAtIG5ld0ltZ0hlaWdodCkge1xyXG4gICAgICAgICAgcG9zWSA9IGNhbnZhc0hlaWdodCAtIG5ld0ltZ0hlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKG5ld0ltZ1dpZHRoLCBuZXdJbWdIZWlnaHQpO1xyXG5cclxuICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgICRjb250ZW50LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRvcDogcG9zWSxcclxuICAgICAgICAgIGxlZnQ6IHBvc1gsXHJcbiAgICAgICAgICBzY2FsZVg6IHNjYWxlWCxcclxuICAgICAgICAgIHNjYWxlWTogc2NhbGVZXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdXJhdGlvbiB8fCAzNjYsXHJcbiAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzZWxmLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgLy8gU3RvcCBzbGlkZXNob3dcclxuICAgICAgaWYgKHNlbGYuU2xpZGVTaG93ICYmIHNlbGYuU2xpZGVTaG93LmlzQWN0aXZlKSB7XHJcbiAgICAgICAgc2VsZi5TbGlkZVNob3cuc3RvcCgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFNjYWxlIGltYWdlIHRvIGZpdCBpbnNpZGUgcGFyZW50IGVsZW1lbnRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBzY2FsZVRvRml0OiBmdW5jdGlvbihkdXJhdGlvbikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICAkY29udGVudCA9IGN1cnJlbnQuJGNvbnRlbnQsXHJcbiAgICAgICAgZW5kO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNBbmltYXRpbmcgfHwgc2VsZi5pc01vdmVkKCkgfHwgISRjb250ZW50IHx8ICEoY3VycmVudC50eXBlID09IFwiaW1hZ2VcIiAmJiBjdXJyZW50LmlzTG9hZGVkICYmICFjdXJyZW50Lmhhc0Vycm9yKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAkLmZhbmN5Ym94LnN0b3AoJGNvbnRlbnQpO1xyXG5cclxuICAgICAgZW5kID0gc2VsZi5nZXRGaXRQb3MoY3VycmVudCk7XHJcblxyXG4gICAgICBzZWxmLnVwZGF0ZUN1cnNvcihlbmQud2lkdGgsIGVuZC5oZWlnaHQpO1xyXG5cclxuICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgICRjb250ZW50LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRvcDogZW5kLnRvcCxcclxuICAgICAgICAgIGxlZnQ6IGVuZC5sZWZ0LFxyXG4gICAgICAgICAgc2NhbGVYOiBlbmQud2lkdGggLyAkY29udGVudC53aWR0aCgpLFxyXG4gICAgICAgICAgc2NhbGVZOiBlbmQuaGVpZ2h0IC8gJGNvbnRlbnQuaGVpZ2h0KClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGR1cmF0aW9uIHx8IDM2NixcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBpbWFnZSBzaXplIHRvIGZpdCBpbnNpZGUgdmlld3BvcnRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBnZXRGaXRQb3M6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICAkY29udGVudCA9IHNsaWRlLiRjb250ZW50LFxyXG4gICAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZSxcclxuICAgICAgICB3aWR0aCA9IHNsaWRlLndpZHRoIHx8IHNsaWRlLm9wdHMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0ID0gc2xpZGUuaGVpZ2h0IHx8IHNsaWRlLm9wdHMuaGVpZ2h0LFxyXG4gICAgICAgIG1heFdpZHRoLFxyXG4gICAgICAgIG1heEhlaWdodCxcclxuICAgICAgICBtaW5SYXRpbyxcclxuICAgICAgICBhc3BlY3RSYXRpbyxcclxuICAgICAgICByZXogPSB7fTtcclxuXHJcbiAgICAgIGlmICghc2xpZGUuaXNMb2FkZWQgfHwgISRjb250ZW50IHx8ICEkY29udGVudC5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1heFdpZHRoID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoc2VsZi4kcmVmcy5zdGFnZSkud2lkdGg7XHJcbiAgICAgIG1heEhlaWdodCA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKHNlbGYuJHJlZnMuc3RhZ2UpLmhlaWdodDtcclxuXHJcbiAgICAgIG1heFdpZHRoIC09XHJcbiAgICAgICAgcGFyc2VGbG9hdCgkc2xpZGUuY3NzKFwicGFkZGluZ0xlZnRcIikpICtcclxuICAgICAgICBwYXJzZUZsb2F0KCRzbGlkZS5jc3MoXCJwYWRkaW5nUmlnaHRcIikpICtcclxuICAgICAgICBwYXJzZUZsb2F0KCRjb250ZW50LmNzcyhcIm1hcmdpbkxlZnRcIikpICtcclxuICAgICAgICBwYXJzZUZsb2F0KCRjb250ZW50LmNzcyhcIm1hcmdpblJpZ2h0XCIpKTtcclxuXHJcbiAgICAgIG1heEhlaWdodCAtPVxyXG4gICAgICAgIHBhcnNlRmxvYXQoJHNsaWRlLmNzcyhcInBhZGRpbmdUb3BcIikpICtcclxuICAgICAgICBwYXJzZUZsb2F0KCRzbGlkZS5jc3MoXCJwYWRkaW5nQm90dG9tXCIpKSArXHJcbiAgICAgICAgcGFyc2VGbG9hdCgkY29udGVudC5jc3MoXCJtYXJnaW5Ub3BcIikpICtcclxuICAgICAgICBwYXJzZUZsb2F0KCRjb250ZW50LmNzcyhcIm1hcmdpbkJvdHRvbVwiKSk7XHJcblxyXG4gICAgICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpIHtcclxuICAgICAgICB3aWR0aCA9IG1heFdpZHRoO1xyXG4gICAgICAgIGhlaWdodCA9IG1heEhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbWluUmF0aW8gPSBNYXRoLm1pbigxLCBtYXhXaWR0aCAvIHdpZHRoLCBtYXhIZWlnaHQgLyBoZWlnaHQpO1xyXG5cclxuICAgICAgd2lkdGggPSBtaW5SYXRpbyAqIHdpZHRoO1xyXG4gICAgICBoZWlnaHQgPSBtaW5SYXRpbyAqIGhlaWdodDtcclxuXHJcbiAgICAgIC8vIEFkanVzdCB3aWR0aC9oZWlnaHQgdG8gcHJlY2lzZWx5IGZpdCBpbnRvIGNvbnRhaW5lclxyXG4gICAgICBpZiAod2lkdGggPiBtYXhXaWR0aCAtIDAuNSkge1xyXG4gICAgICAgIHdpZHRoID0gbWF4V2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoZWlnaHQgPiBtYXhIZWlnaHQgLSAwLjUpIHtcclxuICAgICAgICBoZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzbGlkZS50eXBlID09PSBcImltYWdlXCIpIHtcclxuICAgICAgICByZXoudG9wID0gTWF0aC5mbG9vcigobWF4SGVpZ2h0IC0gaGVpZ2h0KSAqIDAuNSkgKyBwYXJzZUZsb2F0KCRzbGlkZS5jc3MoXCJwYWRkaW5nVG9wXCIpKTtcclxuICAgICAgICByZXoubGVmdCA9IE1hdGguZmxvb3IoKG1heFdpZHRoIC0gd2lkdGgpICogMC41KSArIHBhcnNlRmxvYXQoJHNsaWRlLmNzcyhcInBhZGRpbmdMZWZ0XCIpKTtcclxuICAgICAgfSBlbHNlIGlmIChzbGlkZS5jb250ZW50VHlwZSA9PT0gXCJ2aWRlb1wiKSB7XHJcbiAgICAgICAgLy8gRm9yY2UgYXNwZWN0IHJhdGlvIGZvciB0aGUgdmlkZW9cclxuICAgICAgICAvLyBcIkkgc2F5IHRoZSB3aG9sZSB3b3JsZCBtdXN0IGxlYXJuIG9mIG91ciBwZWFjZWZ1bCB3YXlz4oCmIGJ5IGZvcmNlIVwiXHJcbiAgICAgICAgYXNwZWN0UmF0aW8gPSBzbGlkZS5vcHRzLndpZHRoICYmIHNsaWRlLm9wdHMuaGVpZ2h0ID8gd2lkdGggLyBoZWlnaHQgOiBzbGlkZS5vcHRzLnJhdGlvIHx8IDE2IC8gOTtcclxuXHJcbiAgICAgICAgaWYgKGhlaWdodCA+IHdpZHRoIC8gYXNwZWN0UmF0aW8pIHtcclxuICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XHJcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA+IGhlaWdodCAqIGFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV6LndpZHRoID0gd2lkdGg7XHJcbiAgICAgIHJlei5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICByZXR1cm4gcmV6O1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBVcGRhdGUgY29udGVudCBzaXplIGFuZCBwb3NpdGlvbiBmb3IgYWxsIHNsaWRlc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAkLmVhY2goc2VsZi5zbGlkZXMsIGZ1bmN0aW9uKGtleSwgc2xpZGUpIHtcclxuICAgICAgICBzZWxmLnVwZGF0ZVNsaWRlKHNsaWRlLCBlKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFVwZGF0ZSBzbGlkZSBjb250ZW50IHBvc2l0aW9uIGFuZCBzaXplXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHVwZGF0ZVNsaWRlOiBmdW5jdGlvbihzbGlkZSwgZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgJGNvbnRlbnQgPSBzbGlkZSAmJiBzbGlkZS4kY29udGVudCxcclxuICAgICAgICB3aWR0aCA9IHNsaWRlLndpZHRoIHx8IHNsaWRlLm9wdHMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0ID0gc2xpZGUuaGVpZ2h0IHx8IHNsaWRlLm9wdHMuaGVpZ2h0LFxyXG4gICAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZTtcclxuXHJcbiAgICAgIC8vIEZpcnN0LCBwcmV2ZW50IGNhcHRpb24gb3ZlcmxhcCwgaWYgbmVlZGVkXHJcbiAgICAgIHNlbGYuYWRqdXN0Q2FwdGlvbihzbGlkZSk7XHJcblxyXG4gICAgICAvLyBUaGVuIHJlc2l6ZSBjb250ZW50IHRvIGZpdCBpbnNpZGUgdGhlIHNsaWRlXHJcbiAgICAgIGlmICgkY29udGVudCAmJiAod2lkdGggfHwgaGVpZ2h0IHx8IHNsaWRlLmNvbnRlbnRUeXBlID09PSBcInZpZGVvXCIpICYmICFzbGlkZS5oYXNFcnJvcikge1xyXG4gICAgICAgICQuZmFuY3lib3guc3RvcCgkY29udGVudCk7XHJcblxyXG4gICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCRjb250ZW50LCBzZWxmLmdldEZpdFBvcyhzbGlkZSkpO1xyXG5cclxuICAgICAgICBpZiAoc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MpIHtcclxuICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBzZWxmLnVwZGF0ZUN1cnNvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhlbiBzb21lIGFkanVzdG1lbnRzXHJcbiAgICAgIHNlbGYuYWRqdXN0TGF5b3V0KHNsaWRlKTtcclxuXHJcbiAgICAgIGlmICgkc2xpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgJHNsaWRlLnRyaWdnZXIoXCJyZWZyZXNoXCIpO1xyXG5cclxuICAgICAgICBpZiAoc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MpIHtcclxuICAgICAgICAgIHNlbGYuJHJlZnMudG9vbGJhclxyXG4gICAgICAgICAgICAuYWRkKHNlbGYuJHJlZnMubmF2aWdhdGlvbi5maW5kKFwiLmZhbmN5Ym94LWJ1dHRvbi0tYXJyb3dfcmlnaHRcIikpXHJcbiAgICAgICAgICAgIC50b2dnbGVDbGFzcyhcImNvbXBlbnNhdGUtZm9yLXNjcm9sbGJhclwiLCAkc2xpZGUuZ2V0KDApLnNjcm9sbEhlaWdodCA+ICRzbGlkZS5nZXQoMCkuY2xpZW50SGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcihcIm9uVXBkYXRlXCIsIHNsaWRlLCBlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gSG9yaXpvbnRhbGx5IGNlbnRlciBzbGlkZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGNlbnRlclNsaWRlOiBmdW5jdGlvbihkdXJhdGlvbikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICAkc2xpZGUgPSBjdXJyZW50LiRzbGlkZTtcclxuXHJcbiAgICAgIGlmIChzZWxmLmlzQ2xvc2luZyB8fCAhY3VycmVudCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNsaWRlLnNpYmxpbmdzKCkuY3NzKHtcclxuICAgICAgICB0cmFuc2Zvcm06IFwiXCIsXHJcbiAgICAgICAgb3BhY2l0eTogXCJcIlxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzbGlkZVxyXG4gICAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAgIC5jaGlsZHJlbigpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzIGZhbmN5Ym94LXNsaWRlLS1uZXh0XCIpO1xyXG5cclxuICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgICRzbGlkZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IDAgOiBkdXJhdGlvbixcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIC8vIENsZWFuIHVwXHJcbiAgICAgICAgICAkc2xpZGUuY3NzKHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcIlwiLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiBcIlwiXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoIWN1cnJlbnQuaXNDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWxzZVxyXG4gICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGVjayBpZiBjdXJyZW50IHNsaWRlIGlzIG1vdmVkIChzd2lwZWQpXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaXNNb3ZlZDogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIGN1cnJlbnQgPSBzbGlkZSB8fCB0aGlzLmN1cnJlbnQsXHJcbiAgICAgICAgc2xpZGVQb3MsXHJcbiAgICAgICAgc3RhZ2VQb3M7XHJcblxyXG4gICAgICBpZiAoIWN1cnJlbnQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0YWdlUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUodGhpcy4kcmVmcy5zdGFnZSk7XHJcbiAgICAgIHNsaWRlUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoY3VycmVudC4kc2xpZGUpO1xyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICAhY3VycmVudC4kc2xpZGUuaGFzQ2xhc3MoXCJmYW5jeWJveC1hbmltYXRlZFwiKSAmJlxyXG4gICAgICAgIChNYXRoLmFicyhzbGlkZVBvcy50b3AgLSBzdGFnZVBvcy50b3ApID4gMC41IHx8IE1hdGguYWJzKHNsaWRlUG9zLmxlZnQgLSBzdGFnZVBvcy5sZWZ0KSA+IDAuNSlcclxuICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gVXBkYXRlIGN1cnNvciBzdHlsZSBkZXBlbmRpbmcgaWYgY29udGVudCBjYW4gYmUgem9vbWVkXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB1cGRhdGVDdXJzb3I6IGZ1bmN0aW9uKG5leHRXaWR0aCwgbmV4dEhlaWdodCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICAkY29udGFpbmVyID0gc2VsZi4kcmVmcy5jb250YWluZXIsXHJcbiAgICAgICAgY2FuUGFuLFxyXG4gICAgICAgIGlzWm9vbWFibGU7XHJcblxyXG4gICAgICBpZiAoIWN1cnJlbnQgfHwgc2VsZi5pc0Nsb3NpbmcgfHwgIXNlbGYuR3Vlc3R1cmVzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkY29udGFpbmVyLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtem9vbWFibGUgZmFuY3lib3gtY2FuLXpvb21JbiBmYW5jeWJveC1jYW4tem9vbU91dCBmYW5jeWJveC1jYW4tc3dpcGUgZmFuY3lib3gtY2FuLXBhblwiKTtcclxuXHJcbiAgICAgIGNhblBhbiA9IHNlbGYuY2FuUGFuKG5leHRXaWR0aCwgbmV4dEhlaWdodCk7XHJcblxyXG4gICAgICBpc1pvb21hYmxlID0gY2FuUGFuID8gdHJ1ZSA6IHNlbGYuaXNab29tYWJsZSgpO1xyXG5cclxuICAgICAgJGNvbnRhaW5lci50b2dnbGVDbGFzcyhcImZhbmN5Ym94LWlzLXpvb21hYmxlXCIsIGlzWm9vbWFibGUpO1xyXG5cclxuICAgICAgJChcIltkYXRhLWZhbmN5Ym94LXpvb21dXCIpLnByb3AoXCJkaXNhYmxlZFwiLCAhaXNab29tYWJsZSk7XHJcblxyXG4gICAgICBpZiAoY2FuUGFuKSB7XHJcbiAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyhcImZhbmN5Ym94LWNhbi1wYW5cIik7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgaXNab29tYWJsZSAmJlxyXG4gICAgICAgIChjdXJyZW50Lm9wdHMuY2xpY2tDb250ZW50ID09PSBcInpvb21cIiB8fCAoJC5pc0Z1bmN0aW9uKGN1cnJlbnQub3B0cy5jbGlja0NvbnRlbnQpICYmIGN1cnJlbnQub3B0cy5jbGlja0NvbnRlbnQoY3VycmVudCkgPT0gXCJ6b29tXCIpKVxyXG4gICAgICApIHtcclxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwiZmFuY3lib3gtY2FuLXpvb21JblwiKTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50Lm9wdHMudG91Y2ggJiYgKGN1cnJlbnQub3B0cy50b3VjaC52ZXJ0aWNhbCB8fCBzZWxmLmdyb3VwLmxlbmd0aCA+IDEpICYmIGN1cnJlbnQuY29udGVudFR5cGUgIT09IFwidmlkZW9cIikge1xyXG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoXCJmYW5jeWJveC1jYW4tc3dpcGVcIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgY3VycmVudCBzbGlkZSBpcyB6b29tYWJsZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGlzWm9vbWFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICBmaXRQb3M7XHJcblxyXG4gICAgICAvLyBBc3N1bWUgdGhhdCBzbGlkZSBpcyB6b29tYWJsZSBpZjpcclxuICAgICAgLy8gICAtIGltYWdlIGlzIHN0aWxsIGxvYWRpbmdcclxuICAgICAgLy8gICAtIGFjdHVhbCBzaXplIG9mIHRoZSBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gYXZhaWxhYmxlIGFyZWFcclxuICAgICAgaWYgKGN1cnJlbnQgJiYgIXNlbGYuaXNDbG9zaW5nICYmIGN1cnJlbnQudHlwZSA9PT0gXCJpbWFnZVwiICYmICFjdXJyZW50Lmhhc0Vycm9yKSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50LmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpdFBvcyA9IHNlbGYuZ2V0Rml0UG9zKGN1cnJlbnQpO1xyXG5cclxuICAgICAgICBpZiAoZml0UG9zICYmIChjdXJyZW50LndpZHRoID4gZml0UG9zLndpZHRoIHx8IGN1cnJlbnQuaGVpZ2h0ID4gZml0UG9zLmhlaWdodCkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGVjayBpZiBjdXJyZW50IGltYWdlIGRpbWVuc2lvbnMgYXJlIHNtYWxsZXIgdGhhbiBhY3R1YWxcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGlzU2NhbGVkRG93bjogZnVuY3Rpb24obmV4dFdpZHRoLCBuZXh0SGVpZ2h0KSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICByZXogPSBmYWxzZSxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICRjb250ZW50ID0gY3VycmVudC4kY29udGVudDtcclxuXHJcbiAgICAgIGlmIChuZXh0V2lkdGggIT09IHVuZGVmaW5lZCAmJiBuZXh0SGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXogPSBuZXh0V2lkdGggPCBjdXJyZW50LndpZHRoICYmIG5leHRIZWlnaHQgPCBjdXJyZW50LmhlaWdodDtcclxuICAgICAgfSBlbHNlIGlmICgkY29udGVudCkge1xyXG4gICAgICAgIHJleiA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCRjb250ZW50KTtcclxuICAgICAgICByZXogPSByZXoud2lkdGggPCBjdXJyZW50LndpZHRoICYmIHJlei5oZWlnaHQgPCBjdXJyZW50LmhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlejtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgaW1hZ2UgZGltZW5zaW9ucyBleGNlZWQgcGFyZW50IGVsZW1lbnRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgY2FuUGFuOiBmdW5jdGlvbihuZXh0V2lkdGgsIG5leHRIZWlnaHQpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQsXHJcbiAgICAgICAgcG9zID0gbnVsbCxcclxuICAgICAgICByZXogPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiAmJiAoY3VycmVudC5pc0NvbXBsZXRlIHx8IChuZXh0V2lkdGggJiYgbmV4dEhlaWdodCkpICYmICFjdXJyZW50Lmhhc0Vycm9yKSB7XHJcbiAgICAgICAgcmV6ID0gc2VsZi5nZXRGaXRQb3MoY3VycmVudCk7XHJcblxyXG4gICAgICAgIGlmIChuZXh0V2lkdGggIT09IHVuZGVmaW5lZCAmJiBuZXh0SGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHBvcyA9IHt3aWR0aDogbmV4dFdpZHRoLCBoZWlnaHQ6IG5leHRIZWlnaHR9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5pc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICBwb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShjdXJyZW50LiRjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwb3MgJiYgcmV6KSB7XHJcbiAgICAgICAgICByZXogPSBNYXRoLmFicyhwb3Mud2lkdGggLSByZXoud2lkdGgpID4gMS41IHx8IE1hdGguYWJzKHBvcy5oZWlnaHQgLSByZXouaGVpZ2h0KSA+IDEuNTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXo7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExvYWQgY29udGVudCBpbnRvIHRoZSBzbGlkZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgbG9hZFNsaWRlOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgdHlwZSxcclxuICAgICAgICAkc2xpZGUsXHJcbiAgICAgICAgYWpheExvYWQ7XHJcblxyXG4gICAgICBpZiAoc2xpZGUuaXNMb2FkaW5nIHx8IHNsaWRlLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzbGlkZS5pc0xvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKHNlbGYudHJpZ2dlcihcImJlZm9yZUxvYWRcIiwgc2xpZGUpID09PSBmYWxzZSkge1xyXG4gICAgICAgIHNsaWRlLmlzTG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHR5cGUgPSBzbGlkZS50eXBlO1xyXG4gICAgICAkc2xpZGUgPSBzbGlkZS4kc2xpZGU7XHJcblxyXG4gICAgICAkc2xpZGVcclxuICAgICAgICAub2ZmKFwicmVmcmVzaFwiKVxyXG4gICAgICAgIC50cmlnZ2VyKFwib25SZXNldFwiKVxyXG4gICAgICAgIC5hZGRDbGFzcyhzbGlkZS5vcHRzLnNsaWRlQ2xhc3MpO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIGNvbnRlbnQgZGVwZW5kaW5nIG9uIHRoZSB0eXBlXHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJpbWFnZVwiOlxyXG4gICAgICAgICAgc2VsZi5zZXRJbWFnZShzbGlkZSk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJpZnJhbWVcIjpcclxuICAgICAgICAgIHNlbGYuc2V0SWZyYW1lKHNsaWRlKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcImh0bWxcIjpcclxuICAgICAgICAgIHNlbGYuc2V0Q29udGVudChzbGlkZSwgc2xpZGUuc3JjIHx8IHNsaWRlLmNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwidmlkZW9cIjpcclxuICAgICAgICAgIHNlbGYuc2V0Q29udGVudChcclxuICAgICAgICAgICAgc2xpZGUsXHJcbiAgICAgICAgICAgIHNsaWRlLm9wdHMudmlkZW8udHBsXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xce1xce3NyY1xcfVxcfS9naSwgc2xpZGUuc3JjKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKFwie3tmb3JtYXR9fVwiLCBzbGlkZS5vcHRzLnZpZGVvRm9ybWF0IHx8IHNsaWRlLm9wdHMudmlkZW8uZm9ybWF0IHx8IFwiXCIpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7e3Bvc3Rlcn19XCIsIHNsaWRlLnRodW1iIHx8IFwiXCIpXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwiaW5saW5lXCI6XHJcbiAgICAgICAgICBpZiAoJChzbGlkZS5zcmMpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBzZWxmLnNldENvbnRlbnQoc2xpZGUsICQoc2xpZGUuc3JjKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLnNldEVycm9yKHNsaWRlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcImFqYXhcIjpcclxuICAgICAgICAgIHNlbGYuc2hvd0xvYWRpbmcoc2xpZGUpO1xyXG5cclxuICAgICAgICAgIGFqYXhMb2FkID0gJC5hamF4KFxyXG4gICAgICAgICAgICAkLmV4dGVuZCh7fSwgc2xpZGUub3B0cy5hamF4LnNldHRpbmdzLCB7XHJcbiAgICAgICAgICAgICAgdXJsOiBzbGlkZS5zcmMsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleHRTdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudChzbGlkZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChqcVhIUiAmJiB0ZXh0U3RhdHVzICE9PSBcImFib3J0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgc2VsZi5zZXRFcnJvcihzbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAkc2xpZGUub25lKFwib25SZXNldFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYWpheExvYWQuYWJvcnQoKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2VsZi5zZXRFcnJvcihzbGlkZSk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBVc2UgdGh1bWJuYWlsIGltYWdlLCBpZiBwb3NzaWJsZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBzZXRJbWFnZTogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGdob3N0O1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgbmVlZCB0byBzaG93IGxvYWRpbmcgaWNvblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciAkaW1nID0gc2xpZGUuJGltYWdlO1xyXG5cclxuICAgICAgICBpZiAoIXNlbGYuaXNDbG9zaW5nICYmIHNsaWRlLmlzTG9hZGluZyAmJiAoISRpbWcgfHwgISRpbWcubGVuZ3RoIHx8ICEkaW1nWzBdLmNvbXBsZXRlKSAmJiAhc2xpZGUuaGFzRXJyb3IpIHtcclxuICAgICAgICAgIHNlbGYuc2hvd0xvYWRpbmcoc2xpZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgNTApO1xyXG5cclxuICAgICAgLy9DaGVjayBpZiBpbWFnZSBoYXMgc3Jjc2V0XHJcbiAgICAgIHNlbGYuY2hlY2tTcmNzZXQoc2xpZGUpO1xyXG5cclxuICAgICAgLy8gVGhpcyB3aWxsIGJlIHdyYXBwZXIgY29udGFpbmluZyBib3RoIGdob3N0IGFuZCBhY3R1YWwgaW1hZ2VcclxuICAgICAgc2xpZGUuJGNvbnRlbnQgPSAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtY29udGVudFwiPjwvZGl2PicpXHJcbiAgICAgICAgLmFkZENsYXNzKFwiZmFuY3lib3gtaXMtaGlkZGVuXCIpXHJcbiAgICAgICAgLmFwcGVuZFRvKHNsaWRlLiRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1pbWFnZVwiKSk7XHJcblxyXG4gICAgICAvLyBJZiB3ZSBoYXZlIGEgdGh1bWJuYWlsLCB3ZSBjYW4gZGlzcGxheSBpdCB3aGlsZSBhY3R1YWwgaW1hZ2UgaXMgbG9hZGluZ1xyXG4gICAgICAvLyBVc2VycyB3aWxsIG5vdCBzdGFyZSBhdCBibGFjayBzY3JlZW4gYW5kIGFjdHVhbCBpbWFnZSB3aWxsIGFwcGVhciBncmFkdWFsbHlcclxuICAgICAgaWYgKHNsaWRlLm9wdHMucHJlbG9hZCAhPT0gZmFsc2UgJiYgc2xpZGUub3B0cy53aWR0aCAmJiBzbGlkZS5vcHRzLmhlaWdodCAmJiBzbGlkZS50aHVtYikge1xyXG4gICAgICAgIHNsaWRlLndpZHRoID0gc2xpZGUub3B0cy53aWR0aDtcclxuICAgICAgICBzbGlkZS5oZWlnaHQgPSBzbGlkZS5vcHRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgZ2hvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG5cclxuICAgICAgICBnaG9zdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgIHNsaWRlLiRnaG9zdCA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZ2hvc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzZWxmLmFmdGVyTG9hZChzbGlkZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2xpZGUuJGdob3N0ID0gJChnaG9zdClcclxuICAgICAgICAgIC5hZGRDbGFzcyhcImZhbmN5Ym94LWltYWdlXCIpXHJcbiAgICAgICAgICAuYXBwZW5kVG8oc2xpZGUuJGNvbnRlbnQpXHJcbiAgICAgICAgICAuYXR0cihcInNyY1wiLCBzbGlkZS50aHVtYik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFN0YXJ0IGxvYWRpbmcgYWN0dWFsIGltYWdlXHJcbiAgICAgIHNlbGYuc2V0QmlnSW1hZ2Uoc2xpZGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGVjayBpZiBpbWFnZSBoYXMgc3Jjc2V0IGFuZCBnZXQgdGhlIHNvdXJjZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIGNoZWNrU3Jjc2V0OiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc3Jjc2V0ID0gc2xpZGUub3B0cy5zcmNzZXQgfHwgc2xpZGUub3B0cy5pbWFnZS5zcmNzZXQsXHJcbiAgICAgICAgZm91bmQsXHJcbiAgICAgICAgdGVtcCxcclxuICAgICAgICBweFJhdGlvLFxyXG4gICAgICAgIHdpbmRvd1dpZHRoO1xyXG5cclxuICAgICAgLy8gSWYgd2UgaGF2ZSBcInNyY3NldFwiLCB0aGVuIHdlIG5lZWQgdG8gZmluZCBmaXJzdCBtYXRjaGluZyBcInNyY1wiIHZhbHVlLlxyXG4gICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSwgYmVjYXVzZSB3aGVuIHlvdSBzZXQgYW4gc3JjIGF0dHJpYnV0ZSwgdGhlIGJyb3dzZXIgd2lsbCBwcmVsb2FkIHRoZSBpbWFnZVxyXG4gICAgICAvLyBiZWZvcmUgYW55IGphdmFzY3JpcHQgb3IgZXZlbiBDU1MgaXMgYXBwbGllZC5cclxuICAgICAgaWYgKHNyY3NldCkge1xyXG4gICAgICAgIHB4UmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xyXG4gICAgICAgIHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiBweFJhdGlvO1xyXG5cclxuICAgICAgICB0ZW1wID0gc3Jjc2V0LnNwbGl0KFwiLFwiKS5tYXAoZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgIHZhciByZXQgPSB7fTtcclxuXHJcbiAgICAgICAgICBlbC50cmltKClcclxuICAgICAgICAgICAgLnNwbGl0KC9cXHMrLylcclxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWwsIGkpIHtcclxuICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZUludChlbC5zdWJzdHJpbmcoMCwgZWwubGVuZ3RoIC0gMSksIDEwKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAocmV0LnVybCA9IGVsKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXQucG9zdGZpeCA9IGVsW2VsLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gU29ydCBieSB2YWx1ZVxyXG4gICAgICAgIHRlbXAuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICByZXR1cm4gYS52YWx1ZSAtIGIudmFsdWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE9rLCBub3cgd2UgaGF2ZSBhbiBhcnJheSBvZiBhbGwgc3Jjc2V0IHZhbHVlc1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGVtcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgdmFyIGVsID0gdGVtcFtqXTtcclxuXHJcbiAgICAgICAgICBpZiAoKGVsLnBvc3RmaXggPT09IFwid1wiICYmIGVsLnZhbHVlID49IHdpbmRvd1dpZHRoKSB8fCAoZWwucG9zdGZpeCA9PT0gXCJ4XCIgJiYgZWwudmFsdWUgPj0gcHhSYXRpbykpIHtcclxuICAgICAgICAgICAgZm91bmQgPSBlbDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBub3QgZm91bmQsIHRha2UgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgaWYgKCFmb3VuZCAmJiB0ZW1wLmxlbmd0aCkge1xyXG4gICAgICAgICAgZm91bmQgPSB0ZW1wW3RlbXAubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgIHNsaWRlLnNyYyA9IGZvdW5kLnVybDtcclxuXHJcbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGRlZmF1bHQgd2lkdGgvaGVpZ2h0IHZhbHVlcywgd2UgY2FuIGNhbGN1bGF0ZSBoZWlnaHQgZm9yIG1hdGNoaW5nIHNvdXJjZVxyXG4gICAgICAgICAgaWYgKHNsaWRlLndpZHRoICYmIHNsaWRlLmhlaWdodCAmJiBmb3VuZC5wb3N0Zml4ID09IFwid1wiKSB7XHJcbiAgICAgICAgICAgIHNsaWRlLmhlaWdodCA9IChzbGlkZS53aWR0aCAvIHNsaWRlLmhlaWdodCkgKiBmb3VuZC52YWx1ZTtcclxuICAgICAgICAgICAgc2xpZGUud2lkdGggPSBmb3VuZC52YWx1ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzbGlkZS5vcHRzLnNyY3NldCA9IHNyY3NldDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ3JlYXRlIGZ1bGwtc2l6ZSBpbWFnZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHNldEJpZ0ltYWdlOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSxcclxuICAgICAgICAkaW1nID0gJChpbWcpO1xyXG5cclxuICAgICAgc2xpZGUuJGltYWdlID0gJGltZ1xyXG4gICAgICAgIC5vbmUoXCJlcnJvclwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYuc2V0RXJyb3Ioc2xpZGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uZShcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgc2l6ZXM7XHJcblxyXG4gICAgICAgICAgaWYgKCFzbGlkZS4kZ2hvc3QpIHtcclxuICAgICAgICAgICAgc2VsZi5yZXNvbHZlSW1hZ2VTbGlkZVNpemUoc2xpZGUsIHRoaXMubmF0dXJhbFdpZHRoLCB0aGlzLm5hdHVyYWxIZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5hZnRlckxvYWQoc2xpZGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzZWxmLmlzQ2xvc2luZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHNsaWRlLm9wdHMuc3Jjc2V0KSB7XHJcbiAgICAgICAgICAgIHNpemVzID0gc2xpZGUub3B0cy5zaXplcztcclxuXHJcbiAgICAgICAgICAgIGlmICghc2l6ZXMgfHwgc2l6ZXMgPT09IFwiYXV0b1wiKSB7XHJcbiAgICAgICAgICAgICAgc2l6ZXMgPVxyXG4gICAgICAgICAgICAgICAgKHNsaWRlLndpZHRoIC8gc2xpZGUuaGVpZ2h0ID4gMSAmJiAkVy53aWR0aCgpIC8gJFcuaGVpZ2h0KCkgPiAxID8gXCIxMDBcIiA6IE1hdGgucm91bmQoKHNsaWRlLndpZHRoIC8gc2xpZGUuaGVpZ2h0KSAqIDEwMCkpICtcclxuICAgICAgICAgICAgICAgIFwidndcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGltZy5hdHRyKFwic2l6ZXNcIiwgc2l6ZXMpLmF0dHIoXCJzcmNzZXRcIiwgc2xpZGUub3B0cy5zcmNzZXQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIEhpZGUgdGVtcG9yYXJ5IGltYWdlIGFmdGVyIHNvbWUgZGVsYXlcclxuICAgICAgICAgIGlmIChzbGlkZS4kZ2hvc3QpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBpZiAoc2xpZGUuJGdob3N0ICYmICFzZWxmLmlzQ2xvc2luZykge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGdob3N0LmhpZGUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIE1hdGgubWluKDMwMCwgTWF0aC5tYXgoMTAwMCwgc2xpZGUuaGVpZ2h0IC8gMTYwMCkpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZWxmLmhpZGVMb2FkaW5nKHNsaWRlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5hZGRDbGFzcyhcImZhbmN5Ym94LWltYWdlXCIpXHJcbiAgICAgICAgLmF0dHIoXCJzcmNcIiwgc2xpZGUuc3JjKVxyXG4gICAgICAgIC5hcHBlbmRUbyhzbGlkZS4kY29udGVudCk7XHJcblxyXG4gICAgICBpZiAoKGltZy5jb21wbGV0ZSB8fCBpbWcucmVhZHlTdGF0ZSA9PSBcImNvbXBsZXRlXCIpICYmICRpbWcubmF0dXJhbFdpZHRoICYmICRpbWcubmF0dXJhbEhlaWdodCkge1xyXG4gICAgICAgICRpbWcudHJpZ2dlcihcImxvYWRcIik7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW1nLmVycm9yKSB7XHJcbiAgICAgICAgJGltZy50cmlnZ2VyKFwiZXJyb3JcIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ29tcHV0ZXMgdGhlIHNsaWRlIHNpemUgZnJvbSBpbWFnZSBzaXplIGFuZCBtYXhXaWR0aC9tYXhIZWlnaHRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgcmVzb2x2ZUltYWdlU2xpZGVTaXplOiBmdW5jdGlvbihzbGlkZSwgaW1nV2lkdGgsIGltZ0hlaWdodCkge1xyXG4gICAgICB2YXIgbWF4V2lkdGggPSBwYXJzZUludChzbGlkZS5vcHRzLndpZHRoLCAxMCksXHJcbiAgICAgICAgbWF4SGVpZ2h0ID0gcGFyc2VJbnQoc2xpZGUub3B0cy5oZWlnaHQsIDEwKTtcclxuXHJcbiAgICAgIC8vIFNldHMgdGhlIGRlZmF1bHQgdmFsdWVzIGZyb20gdGhlIGltYWdlXHJcbiAgICAgIHNsaWRlLndpZHRoID0gaW1nV2lkdGg7XHJcbiAgICAgIHNsaWRlLmhlaWdodCA9IGltZ0hlaWdodDtcclxuXHJcbiAgICAgIGlmIChtYXhXaWR0aCA+IDApIHtcclxuICAgICAgICBzbGlkZS53aWR0aCA9IG1heFdpZHRoO1xyXG4gICAgICAgIHNsaWRlLmhlaWdodCA9IE1hdGguZmxvb3IoKG1heFdpZHRoICogaW1nSGVpZ2h0KSAvIGltZ1dpZHRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG1heEhlaWdodCA+IDApIHtcclxuICAgICAgICBzbGlkZS53aWR0aCA9IE1hdGguZmxvb3IoKG1heEhlaWdodCAqIGltZ1dpZHRoKSAvIGltZ0hlaWdodCk7XHJcbiAgICAgICAgc2xpZGUuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENyZWF0ZSBpZnJhbWUgd3JhcHBlciwgaWZyYW1lIGFuZCBiaW5kaW5nc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2V0SWZyYW1lOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgb3B0cyA9IHNsaWRlLm9wdHMuaWZyYW1lLFxyXG4gICAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZSxcclxuICAgICAgICAkaWZyYW1lO1xyXG5cclxuICAgICAgc2xpZGUuJGNvbnRlbnQgPSAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtY29udGVudCcgKyAob3B0cy5wcmVsb2FkID8gXCIgZmFuY3lib3gtaXMtaGlkZGVuXCIgOiBcIlwiKSArICdcIj48L2Rpdj4nKVxyXG4gICAgICAgIC5jc3Mob3B0cy5jc3MpXHJcbiAgICAgICAgLmFwcGVuZFRvKCRzbGlkZSk7XHJcblxyXG4gICAgICAkc2xpZGUuYWRkQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tXCIgKyBzbGlkZS5jb250ZW50VHlwZSk7XHJcblxyXG4gICAgICBzbGlkZS4kaWZyYW1lID0gJGlmcmFtZSA9ICQob3B0cy50cGwucmVwbGFjZSgvXFx7cm5kXFx9L2csIG5ldyBEYXRlKCkuZ2V0VGltZSgpKSlcclxuICAgICAgICAuYXR0cihvcHRzLmF0dHIpXHJcbiAgICAgICAgLmFwcGVuZFRvKHNsaWRlLiRjb250ZW50KTtcclxuXHJcbiAgICAgIGlmIChvcHRzLnByZWxvYWQpIHtcclxuICAgICAgICBzZWxmLnNob3dMb2FkaW5nKHNsaWRlKTtcclxuXHJcbiAgICAgICAgLy8gVW5mb3J0dW5hdGVseSwgaXQgaXMgbm90IGFsd2F5cyBwb3NzaWJsZSB0byBkZXRlcm1pbmUgaWYgaWZyYW1lIGlzIHN1Y2Nlc3NmdWxseSBsb2FkZWRcclxuICAgICAgICAvLyAoZHVlIHRvIGJyb3dzZXIgc2VjdXJpdHkgcG9saWN5KVxyXG5cclxuICAgICAgICAkaWZyYW1lLm9uKFwibG9hZC5mYiBlcnJvci5mYlwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICB0aGlzLmlzUmVhZHkgPSAxO1xyXG5cclxuICAgICAgICAgIHNsaWRlLiRzbGlkZS50cmlnZ2VyKFwicmVmcmVzaFwiKTtcclxuXHJcbiAgICAgICAgICBzZWxmLmFmdGVyTG9hZChzbGlkZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFJlY2FsY3VsYXRlIGlmcmFtZSBjb250ZW50IHNpemVcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICRzbGlkZS5vbihcInJlZnJlc2guZmJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgJGNvbnRlbnQgPSBzbGlkZS4kY29udGVudCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aCA9IG9wdHMuY3NzLndpZHRoLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodCA9IG9wdHMuY3NzLmhlaWdodCxcclxuICAgICAgICAgICAgJGNvbnRlbnRzLFxyXG4gICAgICAgICAgICAkYm9keTtcclxuXHJcbiAgICAgICAgICBpZiAoJGlmcmFtZVswXS5pc1JlYWR5ICE9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAkY29udGVudHMgPSAkaWZyYW1lLmNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgICRib2R5ID0gJGNvbnRlbnRzLmZpbmQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICAgIC8vIENhbGN1bGF0ZSBjb250ZW50IGRpbWVuc2lvbnMsIGlmIGl0IGlzIGFjY2Vzc2libGVcclxuICAgICAgICAgIGlmICgkYm9keSAmJiAkYm9keS5sZW5ndGggJiYgJGJvZHkuY2hpbGRyZW4oKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gQXZvaWQgc2Nyb2xsaW5nIHRvIHRvcCAoaWYgbXVsdGlwbGUgaW5zdGFuY2VzKVxyXG4gICAgICAgICAgICAkc2xpZGUuY3NzKFwib3ZlcmZsb3dcIiwgXCJ2aXNpYmxlXCIpO1xyXG5cclxuICAgICAgICAgICAgJGNvbnRlbnQuY3NzKHtcclxuICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgXCJtYXgtd2lkdGhcIjogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiBcIjk5OTlweFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZyYW1lV2lkdGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGZyYW1lV2lkdGggPSBNYXRoLmNlaWwoTWF0aC5tYXgoJGJvZHlbMF0uY2xpZW50V2lkdGgsICRib2R5Lm91dGVyV2lkdGgodHJ1ZSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGNvbnRlbnQuY3NzKFwid2lkdGhcIiwgZnJhbWVXaWR0aCA/IGZyYW1lV2lkdGggOiBcIlwiKS5jc3MoXCJtYXgtd2lkdGhcIiwgXCJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoZnJhbWVIZWlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGZyYW1lSGVpZ2h0ID0gTWF0aC5jZWlsKE1hdGgubWF4KCRib2R5WzBdLmNsaWVudEhlaWdodCwgJGJvZHkub3V0ZXJIZWlnaHQodHJ1ZSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGNvbnRlbnQuY3NzKFwiaGVpZ2h0XCIsIGZyYW1lSGVpZ2h0ID8gZnJhbWVIZWlnaHQgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICRzbGlkZS5jc3MoXCJvdmVyZmxvd1wiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJGNvbnRlbnQucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1oaWRkZW5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5hZnRlckxvYWQoc2xpZGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkaWZyYW1lLmF0dHIoXCJzcmNcIiwgc2xpZGUuc3JjKTtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSBpZnJhbWUgaWYgY2xvc2luZyBvciBjaGFuZ2luZyBnYWxsZXJ5IGl0ZW1cclxuICAgICAgJHNsaWRlLm9uZShcIm9uUmVzZXRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gVGhpcyBoZWxwcyBJRSBub3QgdG8gdGhyb3cgZXJyb3JzIHdoZW4gY2xvc2luZ1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAkKHRoaXMpXHJcbiAgICAgICAgICAgIC5maW5kKFwiaWZyYW1lXCIpXHJcbiAgICAgICAgICAgIC5oaWRlKClcclxuICAgICAgICAgICAgLnVuYmluZCgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3JjXCIsIFwiLy9hYm91dDpibGFua1wiKTtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcblxyXG4gICAgICAgICQodGhpcylcclxuICAgICAgICAgIC5vZmYoXCJyZWZyZXNoLmZiXCIpXHJcbiAgICAgICAgICAuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgc2xpZGUuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICBzbGlkZS5pc1JldmVhbGVkID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBXcmFwIGFuZCBhcHBlbmQgY29udGVudCB0byB0aGUgc2xpZGVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2V0Q29udGVudDogZnVuY3Rpb24oc2xpZGUsIGNvbnRlbnQpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmhpZGVMb2FkaW5nKHNsaWRlKTtcclxuXHJcbiAgICAgIGlmIChzbGlkZS4kY29udGVudCkge1xyXG4gICAgICAgICQuZmFuY3lib3guc3RvcChzbGlkZS4kY29udGVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNsaWRlLiRzbGlkZS5lbXB0eSgpO1xyXG5cclxuICAgICAgLy8gSWYgY29udGVudCBpcyBhIGpRdWVyeSBvYmplY3QsIHRoZW4gaXQgd2lsbCBiZSBtb3ZlZCB0byB0aGUgc2xpZGUuXHJcbiAgICAgIC8vIFRoZSBwbGFjZWhvbGRlciBpcyBjcmVhdGVkIHNvIHdlIHdpbGwga25vdyB3aGVyZSB0byBwdXQgaXQgYmFjay5cclxuICAgICAgaWYgKGlzUXVlcnkoY29udGVudCkgJiYgY29udGVudC5wYXJlbnQoKS5sZW5ndGgpIHtcclxuICAgICAgICAvLyBNYWtlIHN1cmUgY29udGVudCBpcyBub3QgYWxyZWFkeSBtb3ZlZCB0byBmYW5jeUJveFxyXG4gICAgICAgIGlmIChjb250ZW50Lmhhc0NsYXNzKFwiZmFuY3lib3gtY29udGVudFwiKSB8fCBjb250ZW50LnBhcmVudCgpLmhhc0NsYXNzKFwiZmFuY3lib3gtY29udGVudFwiKSkge1xyXG4gICAgICAgICAgY29udGVudC5wYXJlbnRzKFwiLmZhbmN5Ym94LXNsaWRlXCIpLnRyaWdnZXIoXCJvblJlc2V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRlbXBvcmFyeSBlbGVtZW50IG1hcmtpbmcgb3JpZ2luYWwgcGxhY2Ugb2YgdGhlIGNvbnRlbnRcclxuICAgICAgICBzbGlkZS4kcGxhY2Vob2xkZXIgPSAkKFwiPGRpdj5cIilcclxuICAgICAgICAgIC5oaWRlKClcclxuICAgICAgICAgIC5pbnNlcnRBZnRlcihjb250ZW50KTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIGNvbnRlbnQgaXMgdmlzaWJsZVxyXG4gICAgICAgIGNvbnRlbnQuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZS1ibG9ja1wiKTtcclxuICAgICAgfSBlbHNlIGlmICghc2xpZGUuaGFzRXJyb3IpIHtcclxuICAgICAgICAvLyBJZiBjb250ZW50IGlzIGp1c3QgYSBwbGFpbiB0ZXh0LCB0cnkgdG8gY29udmVydCBpdCB0byBodG1sXHJcbiAgICAgICAgaWYgKCQudHlwZShjb250ZW50KSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgY29udGVudCA9ICQoXCI8ZGl2PlwiKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCQudHJpbShjb250ZW50KSlcclxuICAgICAgICAgICAgLmNvbnRlbnRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBcImZpbHRlclwiIG9wdGlvbiBpcyBwcm92aWRlZCwgdGhlbiBmaWx0ZXIgY29udGVudFxyXG4gICAgICAgIGlmIChzbGlkZS5vcHRzLmZpbHRlcikge1xyXG4gICAgICAgICAgY29udGVudCA9ICQoXCI8ZGl2PlwiKVxyXG4gICAgICAgICAgICAuaHRtbChjb250ZW50KVxyXG4gICAgICAgICAgICAuZmluZChzbGlkZS5vcHRzLmZpbHRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzbGlkZS4kc2xpZGUub25lKFwib25SZXNldFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBQYXVzZSBhbGwgaHRtbDUgdmlkZW8vYXVkaW9cclxuICAgICAgICAkKHRoaXMpXHJcbiAgICAgICAgICAuZmluZChcInZpZGVvLGF1ZGlvXCIpXHJcbiAgICAgICAgICAudHJpZ2dlcihcInBhdXNlXCIpO1xyXG5cclxuICAgICAgICAvLyBQdXQgY29udGVudCBiYWNrXHJcbiAgICAgICAgaWYgKHNsaWRlLiRwbGFjZWhvbGRlcikge1xyXG4gICAgICAgICAgc2xpZGUuJHBsYWNlaG9sZGVyLmFmdGVyKGNvbnRlbnQucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1jb250ZW50XCIpLmhpZGUoKSkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgc2xpZGUuJHBsYWNlaG9sZGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBjdXN0b20gY2xvc2UgYnV0dG9uXHJcbiAgICAgICAgaWYgKHNsaWRlLiRzbWFsbEJ0bikge1xyXG4gICAgICAgICAgc2xpZGUuJHNtYWxsQnRuLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgIHNsaWRlLiRzbWFsbEJ0biA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgY29udGVudCBhbmQgbWFyayBzbGlkZSBhcyBub3QgbG9hZGVkXHJcbiAgICAgICAgaWYgKCFzbGlkZS5oYXNFcnJvcikge1xyXG4gICAgICAgICAgJCh0aGlzKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICAgIHNsaWRlLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBzbGlkZS5pc1JldmVhbGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQoY29udGVudCkuYXBwZW5kVG8oc2xpZGUuJHNsaWRlKTtcclxuXHJcbiAgICAgIGlmICgkKGNvbnRlbnQpLmlzKFwidmlkZW8sYXVkaW9cIikpIHtcclxuICAgICAgICAkKGNvbnRlbnQpLmFkZENsYXNzKFwiZmFuY3lib3gtdmlkZW9cIik7XHJcblxyXG4gICAgICAgICQoY29udGVudCkud3JhcChcIjxkaXY+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICBzbGlkZS5jb250ZW50VHlwZSA9IFwidmlkZW9cIjtcclxuXHJcbiAgICAgICAgc2xpZGUub3B0cy53aWR0aCA9IHNsaWRlLm9wdHMud2lkdGggfHwgJChjb250ZW50KS5hdHRyKFwid2lkdGhcIik7XHJcbiAgICAgICAgc2xpZGUub3B0cy5oZWlnaHQgPSBzbGlkZS5vcHRzLmhlaWdodCB8fCAkKGNvbnRlbnQpLmF0dHIoXCJoZWlnaHRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNsaWRlLiRjb250ZW50ID0gc2xpZGUuJHNsaWRlXHJcbiAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAuZmlsdGVyKFwiZGl2LGZvcm0sbWFpbix2aWRlbyxhdWRpbyxhcnRpY2xlLC5mYW5jeWJveC1jb250ZW50XCIpXHJcbiAgICAgICAgLmZpcnN0KCk7XHJcblxyXG4gICAgICBzbGlkZS4kY29udGVudC5zaWJsaW5ncygpLmhpZGUoKTtcclxuXHJcbiAgICAgIC8vIFJlLWNoZWNrIGlmIHRoZXJlIGlzIGEgdmFsaWQgY29udGVudFxyXG4gICAgICAvLyAoaW4gc29tZSBjYXNlcywgYWpheCByZXNwb25zZSBjYW4gY29udGFpbiB2YXJpb3VzIGVsZW1lbnRzIG9yIHBsYWluIHRleHQpXHJcbiAgICAgIGlmICghc2xpZGUuJGNvbnRlbnQubGVuZ3RoKSB7XHJcbiAgICAgICAgc2xpZGUuJGNvbnRlbnQgPSBzbGlkZS4kc2xpZGVcclxuICAgICAgICAgIC53cmFwSW5uZXIoXCI8ZGl2PjwvZGl2PlwiKVxyXG4gICAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAgIC5maXJzdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzbGlkZS4kY29udGVudC5hZGRDbGFzcyhcImZhbmN5Ym94LWNvbnRlbnRcIik7XHJcblxyXG4gICAgICBzbGlkZS4kc2xpZGUuYWRkQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tXCIgKyBzbGlkZS5jb250ZW50VHlwZSk7XHJcblxyXG4gICAgICBzZWxmLmFmdGVyTG9hZChzbGlkZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIERpc3BsYXkgZXJyb3IgbWVzc2FnZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2V0RXJyb3I6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHNsaWRlLmhhc0Vycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgIHNsaWRlLiRzbGlkZVxyXG4gICAgICAgIC50cmlnZ2VyKFwib25SZXNldFwiKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1cIiArIHNsaWRlLmNvbnRlbnRUeXBlKVxyXG4gICAgICAgIC5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1lcnJvclwiKTtcclxuXHJcbiAgICAgIHNsaWRlLmNvbnRlbnRUeXBlID0gXCJodG1sXCI7XHJcblxyXG4gICAgICB0aGlzLnNldENvbnRlbnQoc2xpZGUsIHRoaXMudHJhbnNsYXRlKHNsaWRlLCBzbGlkZS5vcHRzLmVycm9yVHBsKSk7XHJcblxyXG4gICAgICBpZiAoc2xpZGUucG9zID09PSB0aGlzLmN1cnJQb3MpIHtcclxuICAgICAgICB0aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2hvdyBsb2FkaW5nIGljb24gaW5zaWRlIHRoZSBzbGlkZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHNob3dMb2FkaW5nOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICBzbGlkZSA9IHNsaWRlIHx8IHNlbGYuY3VycmVudDtcclxuXHJcbiAgICAgIGlmIChzbGlkZSAmJiAhc2xpZGUuJHNwaW5uZXIpIHtcclxuICAgICAgICBzbGlkZS4kc3Bpbm5lciA9ICQoc2VsZi50cmFuc2xhdGUoc2VsZiwgc2VsZi5vcHRzLnNwaW5uZXJUcGwpKVxyXG4gICAgICAgICAgLmFwcGVuZFRvKHNsaWRlLiRzbGlkZSlcclxuICAgICAgICAgIC5oaWRlKClcclxuICAgICAgICAgIC5mYWRlSW4oXCJmYXN0XCIpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFJlbW92ZSBsb2FkaW5nIGljb24gZnJvbSB0aGUgc2xpZGVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBoaWRlTG9hZGluZzogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgc2xpZGUgPSBzbGlkZSB8fCBzZWxmLmN1cnJlbnQ7XHJcblxyXG4gICAgICBpZiAoc2xpZGUgJiYgc2xpZGUuJHNwaW5uZXIpIHtcclxuICAgICAgICBzbGlkZS4kc3Bpbm5lci5zdG9wKCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGRlbGV0ZSBzbGlkZS4kc3Bpbm5lcjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBZGp1c3RtZW50cyBhZnRlciBzbGlkZSBjb250ZW50IGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBhZnRlckxvYWQ6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIGlmIChzZWxmLmlzQ2xvc2luZykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2xpZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHNsaWRlLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcihcImFmdGVyTG9hZFwiLCBzbGlkZSk7XHJcblxyXG4gICAgICBzZWxmLmhpZGVMb2FkaW5nKHNsaWRlKTtcclxuXHJcbiAgICAgIC8vIEFkZCBzbWFsbCBjbG9zZSBidXR0b25cclxuICAgICAgaWYgKHNsaWRlLm9wdHMuc21hbGxCdG4gJiYgKCFzbGlkZS4kc21hbGxCdG4gfHwgIXNsaWRlLiRzbWFsbEJ0bi5sZW5ndGgpKSB7XHJcbiAgICAgICAgc2xpZGUuJHNtYWxsQnRuID0gJChzZWxmLnRyYW5zbGF0ZShzbGlkZSwgc2xpZGUub3B0cy5idG5UcGwuc21hbGxCdG4pKS5hcHBlbmRUbyhzbGlkZS4kY29udGVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERpc2FibGUgcmlnaHQgY2xpY2tcclxuICAgICAgaWYgKHNsaWRlLm9wdHMucHJvdGVjdCAmJiBzbGlkZS4kY29udGVudCAmJiAhc2xpZGUuaGFzRXJyb3IpIHtcclxuICAgICAgICBzbGlkZS4kY29udGVudC5vbihcImNvbnRleHRtZW51LmZiXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgIGlmIChlLmJ1dHRvbiA9PSAyKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGZha2UgZWxlbWVudCBvbiB0b3Agb2YgdGhlIGltYWdlXHJcbiAgICAgICAgLy8gVGhpcyBtYWtlcyBhIGJpdCBoYXJkZXIgZm9yIHVzZXIgdG8gc2VsZWN0IGltYWdlXHJcbiAgICAgICAgaWYgKHNsaWRlLnR5cGUgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgICAgJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXNwYWNlYmFsbFwiPjwvZGl2PicpLmFwcGVuZFRvKHNsaWRlLiRjb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuYWRqdXN0Q2FwdGlvbihzbGlkZSk7XHJcblxyXG4gICAgICBzZWxmLmFkanVzdExheW91dChzbGlkZSk7XHJcblxyXG4gICAgICBpZiAoc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MpIHtcclxuICAgICAgICBzZWxmLnVwZGF0ZUN1cnNvcigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnJldmVhbENvbnRlbnQoc2xpZGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBQcmV2ZW50IGNhcHRpb24gb3ZlcmxhcCxcclxuICAgIC8vIGZpeCBjc3MgaW5jb25zaXN0ZW5jeSBhY3Jvc3MgYnJvd3NlcnNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBhZGp1c3RDYXB0aW9uOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNsaWRlIHx8IHNlbGYuY3VycmVudCxcclxuICAgICAgICBjYXB0aW9uID0gY3VycmVudC5vcHRzLmNhcHRpb24sXHJcbiAgICAgICAgcHJldmVudE92ZXJsYXAgPSBjdXJyZW50Lm9wdHMucHJldmVudENhcHRpb25PdmVybGFwLFxyXG4gICAgICAgICRjYXB0aW9uID0gc2VsZi4kcmVmcy5jYXB0aW9uLFxyXG4gICAgICAgICRjbG9uZSxcclxuICAgICAgICBjYXB0aW9uSCA9IGZhbHNlO1xyXG5cclxuICAgICAgJGNhcHRpb24udG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1jYXB0aW9uLS1zZXBhcmF0ZVwiLCBwcmV2ZW50T3ZlcmxhcCk7XHJcblxyXG4gICAgICBpZiAocHJldmVudE92ZXJsYXAgJiYgY2FwdGlvbiAmJiBjYXB0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChjdXJyZW50LnBvcyAhPT0gc2VsZi5jdXJyUG9zKSB7XHJcbiAgICAgICAgICAkY2xvbmUgPSAkY2FwdGlvbi5jbG9uZSgpLmFwcGVuZFRvKCRjYXB0aW9uLnBhcmVudCgpKTtcclxuXHJcbiAgICAgICAgICAkY2xvbmVcclxuICAgICAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAgICAgLmVxKDApXHJcbiAgICAgICAgICAgIC5lbXB0eSgpXHJcbiAgICAgICAgICAgIC5odG1sKGNhcHRpb24pO1xyXG5cclxuICAgICAgICAgIGNhcHRpb25IID0gJGNsb25lLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICAgICRjbG9uZS5lbXB0eSgpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZi4kY2FwdGlvbikge1xyXG4gICAgICAgICAgY2FwdGlvbkggPSBzZWxmLiRjYXB0aW9uLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VycmVudC4kc2xpZGUuY3NzKFwicGFkZGluZy1ib3R0b21cIiwgY2FwdGlvbkggfHwgXCJcIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2ltcGxlIGhhY2sgdG8gZml4IGluY29uc2lzdGVuY3kgYWNyb3NzIGJyb3dzZXJzLCBkZXNjcmliZWQgaGVyZSAoYWZmZWN0cyBFZGdlLCB0b28pOlxyXG4gICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzQ4NTE4XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBhZGp1c3RMYXlvdXQ6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2xpZGUgfHwgc2VsZi5jdXJyZW50LFxyXG4gICAgICAgIHNjcm9sbEhlaWdodCxcclxuICAgICAgICBtYXJnaW5Cb3R0b20sXHJcbiAgICAgICAgaW5saW5lUGFkZGluZyxcclxuICAgICAgICBhY3R1YWxQYWRkaW5nO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuaXNMb2FkZWQgJiYgY3VycmVudC5vcHRzLmRpc2FibGVMYXlvdXRGaXggIT09IHRydWUpIHtcclxuICAgICAgICBjdXJyZW50LiRjb250ZW50LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgXCJcIik7XHJcblxyXG4gICAgICAgIC8vIElmIHdlIHdvdWxkIGFsd2F5cyBzZXQgbWFyZ2luLWJvdHRvbSBmb3IgdGhlIGNvbnRlbnQsXHJcbiAgICAgICAgLy8gdGhlbiBpdCB3b3VsZCBwb3RlbnRpYWxseSBicmVhayB2ZXJ0aWNhbCBhbGlnblxyXG4gICAgICAgIGlmIChjdXJyZW50LiRjb250ZW50Lm91dGVySGVpZ2h0KCkgPiBjdXJyZW50LiRzbGlkZS5oZWlnaHQoKSArIDAuNSkge1xyXG4gICAgICAgICAgaW5saW5lUGFkZGluZyA9IGN1cnJlbnQuJHNsaWRlWzBdLnN0eWxlW1wicGFkZGluZy1ib3R0b21cIl07XHJcbiAgICAgICAgICBhY3R1YWxQYWRkaW5nID0gY3VycmVudC4kc2xpZGUuY3NzKFwicGFkZGluZy1ib3R0b21cIik7XHJcblxyXG4gICAgICAgICAgaWYgKHBhcnNlRmxvYXQoYWN0dWFsUGFkZGluZykgPiAwKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbEhlaWdodCA9IGN1cnJlbnQuJHNsaWRlWzBdLnNjcm9sbEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLmNzcyhcInBhZGRpbmctYm90dG9tXCIsIDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNjcm9sbEhlaWdodCAtIGN1cnJlbnQuJHNsaWRlWzBdLnNjcm9sbEhlaWdodCkgPCAxKSB7XHJcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tID0gYWN0dWFsUGFkZGluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuY3NzKFwicGFkZGluZy1ib3R0b21cIiwgaW5saW5lUGFkZGluZyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50LiRjb250ZW50LmNzcyhcIm1hcmdpbi1ib3R0b21cIiwgbWFyZ2luQm90dG9tKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBNYWtlIGNvbnRlbnQgdmlzaWJsZVxyXG4gICAgLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIHJpZ2h0IGFmdGVyIGNvbnRlbnQgaGFzIGJlZW4gbG9hZGVkIG9yXHJcbiAgICAvLyB1c2VyIG5hdmlnYXRlcyBnYWxsZXJ5IGFuZCB0cmFuc2l0aW9uIHNob3VsZCBzdGFydFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgcmV2ZWFsQ29udGVudDogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZSxcclxuICAgICAgICBlbmQgPSBmYWxzZSxcclxuICAgICAgICBzdGFydCA9IGZhbHNlLFxyXG4gICAgICAgIGlzTW92ZWQgPSBzZWxmLmlzTW92ZWQoc2xpZGUpLFxyXG4gICAgICAgIGlzUmV2ZWFsZWQgPSBzbGlkZS5pc1JldmVhbGVkLFxyXG4gICAgICAgIGVmZmVjdCxcclxuICAgICAgICBlZmZlY3RDbGFzc05hbWUsXHJcbiAgICAgICAgZHVyYXRpb24sXHJcbiAgICAgICAgb3BhY2l0eTtcclxuXHJcbiAgICAgIHNsaWRlLmlzUmV2ZWFsZWQgPSB0cnVlO1xyXG5cclxuICAgICAgZWZmZWN0ID0gc2xpZGUub3B0c1tzZWxmLmZpcnN0UnVuID8gXCJhbmltYXRpb25FZmZlY3RcIiA6IFwidHJhbnNpdGlvbkVmZmVjdFwiXTtcclxuICAgICAgZHVyYXRpb24gPSBzbGlkZS5vcHRzW3NlbGYuZmlyc3RSdW4gPyBcImFuaW1hdGlvbkR1cmF0aW9uXCIgOiBcInRyYW5zaXRpb25EdXJhdGlvblwiXTtcclxuXHJcbiAgICAgIGR1cmF0aW9uID0gcGFyc2VJbnQoc2xpZGUuZm9yY2VkRHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGR1cmF0aW9uIDogc2xpZGUuZm9yY2VkRHVyYXRpb24sIDEwKTtcclxuXHJcbiAgICAgIGlmIChpc01vdmVkIHx8IHNsaWRlLnBvcyAhPT0gc2VsZi5jdXJyUG9zIHx8ICFkdXJhdGlvbikge1xyXG4gICAgICAgIGVmZmVjdCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBjYW4gem9vbVxyXG4gICAgICBpZiAoZWZmZWN0ID09PSBcInpvb21cIikge1xyXG4gICAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcyAmJiBkdXJhdGlvbiAmJiBzbGlkZS50eXBlID09PSBcImltYWdlXCIgJiYgIXNsaWRlLmhhc0Vycm9yICYmIChzdGFydCA9IHNlbGYuZ2V0VGh1bWJQb3Moc2xpZGUpKSkge1xyXG4gICAgICAgICAgZW5kID0gc2VsZi5nZXRGaXRQb3Moc2xpZGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlZmZlY3QgPSBcImZhZGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFpvb20gYW5pbWF0aW9uXHJcbiAgICAgIC8vID09PT09PT09PT09PT09XHJcbiAgICAgIGlmIChlZmZlY3QgPT09IFwiem9vbVwiKSB7XHJcbiAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIGVuZC5zY2FsZVggPSBlbmQud2lkdGggLyBzdGFydC53aWR0aDtcclxuICAgICAgICBlbmQuc2NhbGVZID0gZW5kLmhlaWdodCAvIHN0YXJ0LmhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIG9wYWNpdHlcclxuICAgICAgICBvcGFjaXR5ID0gc2xpZGUub3B0cy56b29tT3BhY2l0eTtcclxuXHJcbiAgICAgICAgaWYgKG9wYWNpdHkgPT0gXCJhdXRvXCIpIHtcclxuICAgICAgICAgIG9wYWNpdHkgPSBNYXRoLmFicyhzbGlkZS53aWR0aCAvIHNsaWRlLmhlaWdodCAtIHN0YXJ0LndpZHRoIC8gc3RhcnQuaGVpZ2h0KSA+IDAuMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcGFjaXR5KSB7XHJcbiAgICAgICAgICBzdGFydC5vcGFjaXR5ID0gMC4xO1xyXG4gICAgICAgICAgZW5kLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRHJhdyBpbWFnZSBhdCBzdGFydCBwb3NpdGlvblxyXG4gICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKHNsaWRlLiRjb250ZW50LnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtaGlkZGVuXCIpLCBzdGFydCk7XHJcblxyXG4gICAgICAgIGZvcmNlUmVkcmF3KHNsaWRlLiRjb250ZW50KTtcclxuXHJcbiAgICAgICAgLy8gU3RhcnQgYW5pbWF0aW9uXHJcbiAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKHNsaWRlLiRjb250ZW50LCBlbmQsIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi51cGRhdGVTbGlkZShzbGlkZSk7XHJcblxyXG4gICAgICAvLyBTaW1wbHkgc2hvdyBjb250ZW50IGlmIG5vIGVmZmVjdFxyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICBpZiAoIWVmZmVjdCkge1xyXG4gICAgICAgIHNsaWRlLiRjb250ZW50LnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtaGlkZGVuXCIpO1xyXG5cclxuICAgICAgICBpZiAoIWlzUmV2ZWFsZWQgJiYgaXNNb3ZlZCAmJiBzbGlkZS50eXBlID09PSBcImltYWdlXCIgJiYgIXNsaWRlLmhhc0Vycm9yKSB7XHJcbiAgICAgICAgICBzbGlkZS4kY29udGVudC5oaWRlKCkuZmFkZUluKFwiZmFzdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcykge1xyXG4gICAgICAgICAgc2VsZi5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVwYXJlIGZvciBDU1MgdHJhbnNpdG9uXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgJC5mYW5jeWJveC5zdG9wKCRzbGlkZSk7XHJcblxyXG4gICAgICAvL2VmZmVjdENsYXNzTmFtZSA9IFwiZmFuY3lib3gtYW5pbWF0ZWQgZmFuY3lib3gtc2xpZGUtLVwiICsgKHNsaWRlLnBvcyA+PSBzZWxmLnByZXZQb3MgPyBcIm5leHRcIiA6IFwicHJldmlvdXNcIikgKyBcIiBmYW5jeWJveC1meC1cIiArIGVmZmVjdDtcclxuICAgICAgZWZmZWN0Q2xhc3NOYW1lID0gXCJmYW5jeWJveC1zbGlkZS0tXCIgKyAoc2xpZGUucG9zID49IHNlbGYucHJldlBvcyA/IFwibmV4dFwiIDogXCJwcmV2aW91c1wiKSArIFwiIGZhbmN5Ym94LWFuaW1hdGVkIGZhbmN5Ym94LWZ4LVwiICsgZWZmZWN0O1xyXG5cclxuICAgICAgJHNsaWRlLmFkZENsYXNzKGVmZmVjdENsYXNzTmFtZSkucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tY3VycmVudFwiKTsgLy8uYWRkQ2xhc3MoZWZmZWN0Q2xhc3NOYW1lKTtcclxuXHJcbiAgICAgIHNsaWRlLiRjb250ZW50LnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtaGlkZGVuXCIpO1xyXG5cclxuICAgICAgLy8gRm9yY2UgcmVmbG93XHJcbiAgICAgIGZvcmNlUmVkcmF3KCRzbGlkZSk7XHJcblxyXG4gICAgICBpZiAoc2xpZGUudHlwZSAhPT0gXCJpbWFnZVwiKSB7XHJcbiAgICAgICAgc2xpZGUuJGNvbnRlbnQuaGlkZSgpLnNob3coMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQuZmFuY3lib3guYW5pbWF0ZShcclxuICAgICAgICAkc2xpZGUsXHJcbiAgICAgICAgXCJmYW5jeWJveC1zbGlkZS0tY3VycmVudFwiLFxyXG4gICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJHNsaWRlLnJlbW92ZUNsYXNzKGVmZmVjdENsYXNzTmFtZSkuY3NzKHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcIlwiLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiBcIlwiXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MpIHtcclxuICAgICAgICAgICAgc2VsZi5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHJ1ZVxyXG4gICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGVjayBpZiB3ZSBjYW4gYW5kIGhhdmUgdG8gem9vbSBmcm9tIHRodW1ibmFpbFxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBnZXRUaHVtYlBvczogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHJleiA9IGZhbHNlLFxyXG4gICAgICAgICR0aHVtYiA9IHNsaWRlLiR0aHVtYixcclxuICAgICAgICB0aHVtYlBvcyxcclxuICAgICAgICBidHcsXHJcbiAgICAgICAgYnJ3LFxyXG4gICAgICAgIGJidyxcclxuICAgICAgICBibHc7XHJcblxyXG4gICAgICBpZiAoISR0aHVtYiB8fCAhaW5WaWV3cG9ydCgkdGh1bWJbMF0pKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aHVtYlBvcyA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCR0aHVtYik7XHJcblxyXG4gICAgICBidHcgPSBwYXJzZUZsb2F0KCR0aHVtYi5jc3MoXCJib3JkZXItdG9wLXdpZHRoXCIpIHx8IDApO1xyXG4gICAgICBicncgPSBwYXJzZUZsb2F0KCR0aHVtYi5jc3MoXCJib3JkZXItcmlnaHQtd2lkdGhcIikgfHwgMCk7XHJcbiAgICAgIGJidyA9IHBhcnNlRmxvYXQoJHRodW1iLmNzcyhcImJvcmRlci1ib3R0b20td2lkdGhcIikgfHwgMCk7XHJcbiAgICAgIGJsdyA9IHBhcnNlRmxvYXQoJHRodW1iLmNzcyhcImJvcmRlci1sZWZ0LXdpZHRoXCIpIHx8IDApO1xyXG5cclxuICAgICAgcmV6ID0ge1xyXG4gICAgICAgIHRvcDogdGh1bWJQb3MudG9wICsgYnR3LFxyXG4gICAgICAgIGxlZnQ6IHRodW1iUG9zLmxlZnQgKyBibHcsXHJcbiAgICAgICAgd2lkdGg6IHRodW1iUG9zLndpZHRoIC0gYnJ3IC0gYmx3LFxyXG4gICAgICAgIGhlaWdodDogdGh1bWJQb3MuaGVpZ2h0IC0gYnR3IC0gYmJ3LFxyXG4gICAgICAgIHNjYWxlWDogMSxcclxuICAgICAgICBzY2FsZVk6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiB0aHVtYlBvcy53aWR0aCA+IDAgJiYgdGh1bWJQb3MuaGVpZ2h0ID4gMCA/IHJleiA6IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBGaW5hbCBhZGp1c3RtZW50cyBhZnRlciBjdXJyZW50IGdhbGxlcnkgaXRlbSBpcyBtb3ZlZCB0byBwb3NpdGlvblxyXG4gICAgLy8gYW5kIGl0YHMgY29udGVudCBpcyBsb2FkZWRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQsXHJcbiAgICAgICAgc2xpZGVzID0ge30sXHJcbiAgICAgICAgJGVsO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNNb3ZlZCgpIHx8ICFjdXJyZW50LmlzTG9hZGVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWN1cnJlbnQuaXNDb21wbGV0ZSkge1xyXG4gICAgICAgIGN1cnJlbnQuaXNDb21wbGV0ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGN1cnJlbnQuJHNsaWRlLnNpYmxpbmdzKCkudHJpZ2dlcihcIm9uUmVzZXRcIik7XHJcblxyXG4gICAgICAgIHNlbGYucHJlbG9hZChcImlubGluZVwiKTtcclxuXHJcbiAgICAgICAgLy8gVHJpZ2dlciBhbnkgQ1NTIHRyYW5zaXRvbiBpbnNpZGUgdGhlIHNsaWRlXHJcbiAgICAgICAgZm9yY2VSZWRyYXcoY3VycmVudC4kc2xpZGUpO1xyXG5cclxuICAgICAgICBjdXJyZW50LiRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1jb21wbGV0ZVwiKTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHVubmVjZXNzYXJ5IHNsaWRlc1xyXG4gICAgICAgICQuZWFjaChzZWxmLnNsaWRlcywgZnVuY3Rpb24oa2V5LCBzbGlkZSkge1xyXG4gICAgICAgICAgaWYgKHNsaWRlLnBvcyA+PSBzZWxmLmN1cnJQb3MgLSAxICYmIHNsaWRlLnBvcyA8PSBzZWxmLmN1cnJQb3MgKyAxKSB7XHJcbiAgICAgICAgICAgIHNsaWRlc1tzbGlkZS5wb3NdID0gc2xpZGU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHNsaWRlKSB7XHJcbiAgICAgICAgICAgICQuZmFuY3lib3guc3RvcChzbGlkZS4kc2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUuJHNsaWRlLm9mZigpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZWxmLnNsaWRlcyA9IHNsaWRlcztcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgc2VsZi51cGRhdGVDdXJzb3IoKTtcclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcihcImFmdGVyU2hvd1wiKTtcclxuXHJcbiAgICAgIC8vIEF1dG9wbGF5IGZpcnN0IGh0bWw1IHZpZGVvL2F1ZGlvXHJcbiAgICAgIGlmICghIWN1cnJlbnQub3B0cy52aWRlby5hdXRvU3RhcnQpIHtcclxuICAgICAgICBjdXJyZW50LiRzbGlkZVxyXG4gICAgICAgICAgLmZpbmQoXCJ2aWRlbyxhdWRpb1wiKVxyXG4gICAgICAgICAgLmZpbHRlcihcIjp2aXNpYmxlOmZpcnN0XCIpXHJcbiAgICAgICAgICAudHJpZ2dlcihcInBsYXlcIilcclxuICAgICAgICAgIC5vbmUoXCJlbmRlZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgICB0aGlzLndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYubmV4dCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRyeSB0byBmb2N1cyBvbiB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnRcclxuICAgICAgaWYgKGN1cnJlbnQub3B0cy5hdXRvRm9jdXMgJiYgY3VycmVudC5jb250ZW50VHlwZSA9PT0gXCJodG1sXCIpIHtcclxuICAgICAgICAvLyBMb29rIGZvciB0aGUgZmlyc3QgaW5wdXQgd2l0aCBhdXRvZm9jdXMgYXR0cmlidXRlXHJcbiAgICAgICAgJGVsID0gY3VycmVudC4kY29udGVudC5maW5kKFwiaW5wdXRbYXV0b2ZvY3VzXTplbmFibGVkOnZpc2libGU6Zmlyc3RcIik7XHJcblxyXG4gICAgICAgIGlmICgkZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkZWwudHJpZ2dlcihcImZvY3VzXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLmZvY3VzKG51bGwsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQXZvaWQganVtcGluZ1xyXG4gICAgICBjdXJyZW50LiRzbGlkZS5zY3JvbGxUb3AoMCkuc2Nyb2xsTGVmdCgwKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gUHJlbG9hZCBuZXh0IGFuZCBwcmV2aW91cyBzbGlkZXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgcHJlbG9hZDogZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgcHJldixcclxuICAgICAgICBuZXh0O1xyXG5cclxuICAgICAgaWYgKHNlbGYuZ3JvdXAubGVuZ3RoIDwgMikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbmV4dCA9IHNlbGYuc2xpZGVzW3NlbGYuY3VyclBvcyArIDFdO1xyXG4gICAgICBwcmV2ID0gc2VsZi5zbGlkZXNbc2VsZi5jdXJyUG9zIC0gMV07XHJcblxyXG4gICAgICBpZiAocHJldiAmJiBwcmV2LnR5cGUgPT09IHR5cGUpIHtcclxuICAgICAgICBzZWxmLmxvYWRTbGlkZShwcmV2KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5leHQgJiYgbmV4dC50eXBlID09PSB0eXBlKSB7XHJcbiAgICAgICAgc2VsZi5sb2FkU2xpZGUobmV4dCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gVHJ5IHRvIGZpbmQgYW5kIGZvY3VzIG9uIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGZvY3VzOiBmdW5jdGlvbihlLCBmaXJzdFJ1bikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgZm9jdXNhYmxlU3RyID0gW1xyXG4gICAgICAgICAgXCJhW2hyZWZdXCIsXHJcbiAgICAgICAgICBcImFyZWFbaHJlZl1cIixcclxuICAgICAgICAgICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFt0eXBlPVwiaGlkZGVuXCJdKTpub3QoW2FyaWEtaGlkZGVuXSknLFxyXG4gICAgICAgICAgXCJzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKVwiLFxyXG4gICAgICAgICAgXCJ0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pXCIsXHJcbiAgICAgICAgICBcImJ1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pXCIsXHJcbiAgICAgICAgICBcImlmcmFtZVwiLFxyXG4gICAgICAgICAgXCJvYmplY3RcIixcclxuICAgICAgICAgIFwiZW1iZWRcIixcclxuICAgICAgICAgIFwidmlkZW9cIixcclxuICAgICAgICAgIFwiYXVkaW9cIixcclxuICAgICAgICAgIFwiW2NvbnRlbnRlZGl0YWJsZV1cIixcclxuICAgICAgICAgICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXhePVwiLVwiXSknXHJcbiAgICAgICAgXS5qb2luKFwiLFwiKSxcclxuICAgICAgICBmb2N1c2FibGVJdGVtcyxcclxuICAgICAgICBmb2N1c2VkSXRlbUluZGV4O1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZSB8fCAhc2VsZi5jdXJyZW50IHx8ICFzZWxmLmN1cnJlbnQuaXNDb21wbGV0ZSkge1xyXG4gICAgICAgIC8vIEZvY3VzIG9uIGFueSBlbGVtZW50IGluc2lkZSBmYW5jeWJveFxyXG4gICAgICAgIGZvY3VzYWJsZUl0ZW1zID0gc2VsZi4kcmVmcy5jb250YWluZXIuZmluZChcIio6dmlzaWJsZVwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGb2N1cyBpbnNpZGUgY3VycmVudCBzbGlkZVxyXG4gICAgICAgIGZvY3VzYWJsZUl0ZW1zID0gc2VsZi5jdXJyZW50LiRzbGlkZS5maW5kKFwiKjp2aXNpYmxlXCIgKyAoZmlyc3RSdW4gPyBcIjpub3QoLmZhbmN5Ym94LWNsb3NlLXNtYWxsKVwiIDogXCJcIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb2N1c2FibGVJdGVtcyA9IGZvY3VzYWJsZUl0ZW1zLmZpbHRlcihmb2N1c2FibGVTdHIpLmZpbHRlcihmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzKS5jc3MoXCJ2aXNpYmlsaXR5XCIpICE9PSBcImhpZGRlblwiICYmICEkKHRoaXMpLmhhc0NsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKGZvY3VzYWJsZUl0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgIGZvY3VzZWRJdGVtSW5kZXggPSBmb2N1c2FibGVJdGVtcy5pbmRleChkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICAgICAgaWYgKGUgJiYgZS5zaGlmdEtleSkge1xyXG4gICAgICAgICAgLy8gQmFjayB0YWJcclxuICAgICAgICAgIGlmIChmb2N1c2VkSXRlbUluZGV4IDwgMCB8fCBmb2N1c2VkSXRlbUluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgZm9jdXNhYmxlSXRlbXMuZXEoZm9jdXNhYmxlSXRlbXMubGVuZ3RoIC0gMSkudHJpZ2dlcihcImZvY3VzXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBPdXRzaWRlIG9yIEZvcndhcmQgdGFiXHJcbiAgICAgICAgICBpZiAoZm9jdXNlZEl0ZW1JbmRleCA8IDAgfHwgZm9jdXNlZEl0ZW1JbmRleCA9PSBmb2N1c2FibGVJdGVtcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb2N1c2FibGVJdGVtcy5lcSgwKS50cmlnZ2VyKFwiZm9jdXNcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLnRyaWdnZXIoXCJmb2N1c1wiKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBY3RpdmF0ZXMgY3VycmVudCBpbnN0YW5jZSAtIGJyaW5ncyBjb250YWluZXIgdG8gdGhlIGZyb250IGFuZCBlbmFibGVzIGtleWJvYXJkLFxyXG4gICAgLy8gbm90aWZpZXMgb3RoZXIgaW5zdGFuY2VzIGFib3V0IGRlYWN0aXZhdGluZ1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAvLyBEZWFjdGl2YXRlIGFsbCBpbnN0YW5jZXNcclxuICAgICAgJChcIi5mYW5jeWJveC1jb250YWluZXJcIikuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSAkKHRoaXMpLmRhdGEoXCJGYW5jeUJveFwiKTtcclxuXHJcbiAgICAgICAgLy8gU2tpcCBzZWxmIGFuZCBjbG9zaW5nIGluc3RhbmNlc1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS5pZCAhPT0gc2VsZi5pZCAmJiAhaW5zdGFuY2UuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS50cmlnZ2VyKFwib25EZWFjdGl2YXRlXCIpO1xyXG5cclxuICAgICAgICAgIGluc3RhbmNlLnJlbW92ZUV2ZW50cygpO1xyXG5cclxuICAgICAgICAgIGluc3RhbmNlLmlzVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZWxmLmlzVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICBpZiAoc2VsZi5jdXJyZW50IHx8IHNlbGYuaXNJZGxlKSB7XHJcbiAgICAgICAgc2VsZi51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVDb250cm9scygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnRyaWdnZXIoXCJvbkFjdGl2YXRlXCIpO1xyXG5cclxuICAgICAgc2VsZi5hZGRFdmVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gU3RhcnQgY2xvc2luZyBwcm9jZWR1cmVcclxuICAgIC8vIFRoaXMgd2lsbCBzdGFydCBcInpvb20tb3V0XCIgYW5pbWF0aW9uIGlmIG5lZWRlZCBhbmQgY2xlYW4gZXZlcnl0aGluZyB1cCBhZnRlcndhcmRzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBjbG9zZTogZnVuY3Rpb24oZSwgZCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICBlZmZlY3QsXHJcbiAgICAgICAgZHVyYXRpb24sXHJcbiAgICAgICAgJGNvbnRlbnQsXHJcbiAgICAgICAgZG9tUmVjdCxcclxuICAgICAgICBvcGFjaXR5LFxyXG4gICAgICAgIHN0YXJ0LFxyXG4gICAgICAgIGVuZDtcclxuXHJcbiAgICAgIHZhciBkb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5jbGVhblVwKGUpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmlzQ2xvc2luZyA9IHRydWU7XHJcblxyXG4gICAgICAvLyBJZiBiZWZvcmVDbG9zZSBjYWxsYmFjayBwcmV2ZW50cyBjbG9zaW5nLCBtYWtlIHN1cmUgY29udGVudCBpcyBjZW50ZXJlZFxyXG4gICAgICBpZiAoc2VsZi50cmlnZ2VyKFwiYmVmb3JlQ2xvc2VcIiwgZSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgc2VsZi5pc0Nsb3NpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHNcclxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIGluc3RhbmNlcywgdGhleSB3aWxsIGJlIHNldCBhZ2FpbiBieSBcImFjdGl2YXRlXCIgbWV0aG9kXHJcbiAgICAgIHNlbGYucmVtb3ZlRXZlbnRzKCk7XHJcblxyXG4gICAgICAkY29udGVudCA9IGN1cnJlbnQuJGNvbnRlbnQ7XHJcbiAgICAgIGVmZmVjdCA9IGN1cnJlbnQub3B0cy5hbmltYXRpb25FZmZlY3Q7XHJcbiAgICAgIGR1cmF0aW9uID0gJC5pc051bWVyaWMoZCkgPyBkIDogZWZmZWN0ID8gY3VycmVudC5vcHRzLmFuaW1hdGlvbkR1cmF0aW9uIDogMDtcclxuXHJcbiAgICAgIGN1cnJlbnQuJHNsaWRlLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWNvbXBsZXRlIGZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cyBmYW5jeWJveC1hbmltYXRlZFwiKTtcclxuXHJcbiAgICAgIGlmIChlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgJC5mYW5jeWJveC5zdG9wKGN1cnJlbnQuJHNsaWRlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlZmZlY3QgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIG90aGVyIHNsaWRlc1xyXG4gICAgICBjdXJyZW50LiRzbGlkZVxyXG4gICAgICAgIC5zaWJsaW5ncygpXHJcbiAgICAgICAgLnRyaWdnZXIoXCJvblJlc2V0XCIpXHJcbiAgICAgICAgLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy8gVHJpZ2dlciBhbmltYXRpb25zXHJcbiAgICAgIGlmIChkdXJhdGlvbikge1xyXG4gICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyXHJcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1vcGVuXCIpXHJcbiAgICAgICAgICAuYWRkQ2xhc3MoXCJmYW5jeWJveC1pcy1jbG9zaW5nXCIpXHJcbiAgICAgICAgICAuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBkdXJhdGlvbiArIFwibXNcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENsZWFuIHVwXHJcbiAgICAgIHNlbGYuaGlkZUxvYWRpbmcoY3VycmVudCk7XHJcblxyXG4gICAgICBzZWxmLmhpZGVDb250cm9scyh0cnVlKTtcclxuXHJcbiAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCk7XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBwb3NzaWJsZSB0byB6b29tLW91dFxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZWZmZWN0ID09PSBcInpvb21cIiAmJlxyXG4gICAgICAgICEoJGNvbnRlbnQgJiYgZHVyYXRpb24gJiYgY3VycmVudC50eXBlID09PSBcImltYWdlXCIgJiYgIXNlbGYuaXNNb3ZlZCgpICYmICFjdXJyZW50Lmhhc0Vycm9yICYmIChlbmQgPSBzZWxmLmdldFRodW1iUG9zKGN1cnJlbnQpKSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgZWZmZWN0ID0gXCJmYWRlXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlZmZlY3QgPT09IFwiem9vbVwiKSB7XHJcbiAgICAgICAgJC5mYW5jeWJveC5zdG9wKCRjb250ZW50KTtcclxuXHJcbiAgICAgICAgZG9tUmVjdCA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCRjb250ZW50KTtcclxuXHJcbiAgICAgICAgc3RhcnQgPSB7XHJcbiAgICAgICAgICB0b3A6IGRvbVJlY3QudG9wLFxyXG4gICAgICAgICAgbGVmdDogZG9tUmVjdC5sZWZ0LFxyXG4gICAgICAgICAgc2NhbGVYOiBkb21SZWN0LndpZHRoIC8gZW5kLndpZHRoLFxyXG4gICAgICAgICAgc2NhbGVZOiBkb21SZWN0LmhlaWdodCAvIGVuZC5oZWlnaHQsXHJcbiAgICAgICAgICB3aWR0aDogZW5kLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBlbmQuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIG9wYWNpdHlcclxuICAgICAgICBvcGFjaXR5ID0gY3VycmVudC5vcHRzLnpvb21PcGFjaXR5O1xyXG5cclxuICAgICAgICBpZiAob3BhY2l0eSA9PSBcImF1dG9cIikge1xyXG4gICAgICAgICAgb3BhY2l0eSA9IE1hdGguYWJzKGN1cnJlbnQud2lkdGggLyBjdXJyZW50LmhlaWdodCAtIGVuZC53aWR0aCAvIGVuZC5oZWlnaHQpID4gMC4xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wYWNpdHkpIHtcclxuICAgICAgICAgIGVuZC5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCRjb250ZW50LCBzdGFydCk7XHJcblxyXG4gICAgICAgIGZvcmNlUmVkcmF3KCRjb250ZW50KTtcclxuXHJcbiAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCRjb250ZW50LCBlbmQsIGR1cmF0aW9uLCBkb25lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlZmZlY3QgJiYgZHVyYXRpb24pIHtcclxuICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoXHJcbiAgICAgICAgICBjdXJyZW50LiRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1wcmV2aW91c1wiKS5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1jdXJyZW50XCIpLFxyXG4gICAgICAgICAgXCJmYW5jeWJveC1hbmltYXRlZCBmYW5jeWJveC1meC1cIiArIGVmZmVjdCxcclxuICAgICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgICAgZG9uZVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSWYgc2tpcCBhbmltYXRpb25cclxuICAgICAgICBpZiAoZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dChkb25lLCBkdXJhdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBGaW5hbCBhZGp1c3RtZW50cyBhZnRlciByZW1vdmluZyB0aGUgaW5zdGFuY2VcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGNsZWFuVXA6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGluc3RhbmNlLFxyXG4gICAgICAgICRmb2N1cyA9IHNlbGYuY3VycmVudC5vcHRzLiRvcmlnLFxyXG4gICAgICAgIHgsXHJcbiAgICAgICAgeTtcclxuXHJcbiAgICAgIHNlbGYuY3VycmVudC4kc2xpZGUudHJpZ2dlcihcIm9uUmVzZXRcIik7XHJcblxyXG4gICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5lbXB0eSgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKFwiYWZ0ZXJDbG9zZVwiLCBlKTtcclxuXHJcbiAgICAgIC8vIFBsYWNlIGJhY2sgZm9jdXNcclxuICAgICAgaWYgKCEhc2VsZi5jdXJyZW50Lm9wdHMuYmFja0ZvY3VzKSB7XHJcbiAgICAgICAgaWYgKCEkZm9jdXMgfHwgISRmb2N1cy5sZW5ndGggfHwgISRmb2N1cy5pcyhcIjp2aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAkZm9jdXMgPSBzZWxmLiR0cmlnZ2VyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRmb2N1cyAmJiAkZm9jdXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICB4ID0gd2luZG93LnNjcm9sbFg7XHJcbiAgICAgICAgICB5ID0gd2luZG93LnNjcm9sbFk7XHJcblxyXG4gICAgICAgICAgJGZvY3VzLnRyaWdnZXIoXCJmb2N1c1wiKTtcclxuXHJcbiAgICAgICAgICAkKFwiaHRtbCwgYm9keVwiKVxyXG4gICAgICAgICAgICAuc2Nyb2xsVG9wKHkpXHJcbiAgICAgICAgICAgIC5zY3JvbGxMZWZ0KHgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5jdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBvdGhlciBpbnN0YW5jZXNcclxuICAgICAgaW5zdGFuY2UgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCk7XHJcblxyXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICBpbnN0YW5jZS5hY3RpdmF0ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtYWN0aXZlIGNvbXBlbnNhdGUtZm9yLXNjcm9sbGJhclwiKTtcclxuXHJcbiAgICAgICAgJChcIiNmYW5jeWJveC1zdHlsZS1ub3Njcm9sbFwiKS5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDYWxsIGNhbGxiYWNrIGFuZCB0cmlnZ2VyIGFuIGV2ZW50XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdHJpZ2dlcjogZnVuY3Rpb24obmFtZSwgc2xpZGUpIHtcclxuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG4gICAgICAgIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIG9iaiA9IHNsaWRlICYmIHNsaWRlLm9wdHMgPyBzbGlkZSA6IHNlbGYuY3VycmVudCxcclxuICAgICAgICByZXo7XHJcblxyXG4gICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgYXJncy51bnNoaWZ0KG9iaik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqID0gc2VsZjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXJncy51bnNoaWZ0KHNlbGYpO1xyXG5cclxuICAgICAgaWYgKCQuaXNGdW5jdGlvbihvYmoub3B0c1tuYW1lXSkpIHtcclxuICAgICAgICByZXogPSBvYmoub3B0c1tuYW1lXS5hcHBseShvYmosIGFyZ3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmV6ID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiByZXo7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChuYW1lID09PSBcImFmdGVyQ2xvc2VcIiB8fCAhc2VsZi4kcmVmcykge1xyXG4gICAgICAgICRELnRyaWdnZXIobmFtZSArIFwiLmZiXCIsIGFyZ3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLnRyaWdnZXIobmFtZSArIFwiLmZiXCIsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFVwZGF0ZSBpbmZvYmFyIHZhbHVlcywgbmF2aWdhdGlvbiBidXR0b24gc3RhdGVzIGFuZCByZXZlYWwgY2FwdGlvblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdXBkYXRlQ29udHJvbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICBpbmRleCA9IGN1cnJlbnQuaW5kZXgsXHJcbiAgICAgICAgJGNvbnRhaW5lciA9IHNlbGYuJHJlZnMuY29udGFpbmVyLFxyXG4gICAgICAgICRjYXB0aW9uID0gc2VsZi4kcmVmcy5jYXB0aW9uLFxyXG4gICAgICAgIGNhcHRpb24gPSBjdXJyZW50Lm9wdHMuY2FwdGlvbjtcclxuXHJcbiAgICAgIC8vIFJlY2FsY3VsYXRlIGNvbnRlbnQgZGltZW5zaW9uc1xyXG4gICAgICBjdXJyZW50LiRzbGlkZS50cmlnZ2VyKFwicmVmcmVzaFwiKTtcclxuXHJcbiAgICAgIC8vIFNldCBjYXB0aW9uXHJcbiAgICAgIGlmIChjYXB0aW9uICYmIGNhcHRpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgc2VsZi4kY2FwdGlvbiA9ICRjYXB0aW9uO1xyXG5cclxuICAgICAgICAkY2FwdGlvblxyXG4gICAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAgIC5lcSgwKVxyXG4gICAgICAgICAgLmh0bWwoY2FwdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi4kY2FwdGlvbiA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghc2VsZi5oYXNIaWRkZW5Db250cm9scyAmJiAhc2VsZi5pc0lkbGUpIHtcclxuICAgICAgICBzZWxmLnNob3dDb250cm9scygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVcGRhdGUgaW5mbyBhbmQgbmF2aWdhdGlvbiBlbGVtZW50c1xyXG4gICAgICAkY29udGFpbmVyLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1jb3VudF1cIikuaHRtbChzZWxmLmdyb3VwLmxlbmd0aCk7XHJcbiAgICAgICRjb250YWluZXIuZmluZChcIltkYXRhLWZhbmN5Ym94LWluZGV4XVwiKS5odG1sKGluZGV4ICsgMSk7XHJcblxyXG4gICAgICAkY29udGFpbmVyLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1wcmV2XVwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgIWN1cnJlbnQub3B0cy5sb29wICYmIGluZGV4IDw9IDApO1xyXG4gICAgICAkY29udGFpbmVyLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1uZXh0XVwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgIWN1cnJlbnQub3B0cy5sb29wICYmIGluZGV4ID49IHNlbGYuZ3JvdXAubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICBpZiAoY3VycmVudC50eXBlID09PSBcImltYWdlXCIpIHtcclxuICAgICAgICAvLyBSZS1lbmFibGUgYnV0dG9uczsgdXBkYXRlIGRvd25sb2FkIGJ1dHRvbiBzb3VyY2VcclxuICAgICAgICAkY29udGFpbmVyXHJcbiAgICAgICAgICAuZmluZChcIltkYXRhLWZhbmN5Ym94LXpvb21dXCIpXHJcbiAgICAgICAgICAuc2hvdygpXHJcbiAgICAgICAgICAuZW5kKClcclxuICAgICAgICAgIC5maW5kKFwiW2RhdGEtZmFuY3lib3gtZG93bmxvYWRdXCIpXHJcbiAgICAgICAgICAuYXR0cihcImhyZWZcIiwgY3VycmVudC5vcHRzLmltYWdlLnNyYyB8fCBjdXJyZW50LnNyYylcclxuICAgICAgICAgIC5zaG93KCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5vcHRzLnRvb2xiYXIpIHtcclxuICAgICAgICAkY29udGFpbmVyLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1kb3dubG9hZF0sW2RhdGEtZmFuY3lib3gtem9vbV1cIikuaGlkZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgZm9jdXMgaXMgbm90IG9uIGRpc2FibGVkIGJ1dHRvbi9lbGVtZW50XHJcbiAgICAgIGlmICgkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmlzKFwiOmhpZGRlbixbZGlzYWJsZWRdXCIpKSB7XHJcbiAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIudHJpZ2dlcihcImZvY3VzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEhpZGUgdG9vbGJhciBhbmQgY2FwdGlvblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaGlkZUNvbnRyb2xzOiBmdW5jdGlvbihhbmRDYXB0aW9uKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBhcnIgPSBbXCJpbmZvYmFyXCIsIFwidG9vbGJhclwiLCBcIm5hdlwiXTtcclxuXHJcbiAgICAgIGlmIChhbmRDYXB0aW9uIHx8ICFzZWxmLmN1cnJlbnQub3B0cy5wcmV2ZW50Q2FwdGlvbk92ZXJsYXApIHtcclxuICAgICAgICBhcnIucHVzaChcImNhcHRpb25cIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGFpbmVyLnJlbW92ZUNsYXNzKFxyXG4gICAgICAgIGFyclxyXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImZhbmN5Ym94LXNob3ctXCIgKyBpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5qb2luKFwiIFwiKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5oYXNIaWRkZW5Db250cm9scyA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dDb250cm9sczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBvcHRzID0gc2VsZi5jdXJyZW50ID8gc2VsZi5jdXJyZW50Lm9wdHMgOiBzZWxmLm9wdHMsXHJcbiAgICAgICAgJGNvbnRhaW5lciA9IHNlbGYuJHJlZnMuY29udGFpbmVyO1xyXG5cclxuICAgICAgc2VsZi5oYXNIaWRkZW5Db250cm9scyA9IGZhbHNlO1xyXG4gICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAkY29udGFpbmVyXHJcbiAgICAgICAgLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtc2hvdy10b29sYmFyXCIsICEhKG9wdHMudG9vbGJhciAmJiBvcHRzLmJ1dHRvbnMpKVxyXG4gICAgICAgIC50b2dnbGVDbGFzcyhcImZhbmN5Ym94LXNob3ctaW5mb2JhclwiLCAhIShvcHRzLmluZm9iYXIgJiYgc2VsZi5ncm91cC5sZW5ndGggPiAxKSlcclxuICAgICAgICAudG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1zaG93LWNhcHRpb25cIiwgISFzZWxmLiRjYXB0aW9uKVxyXG4gICAgICAgIC50b2dnbGVDbGFzcyhcImZhbmN5Ym94LXNob3ctbmF2XCIsICEhKG9wdHMuYXJyb3dzICYmIHNlbGYuZ3JvdXAubGVuZ3RoID4gMSkpXHJcbiAgICAgICAgLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtaXMtbW9kYWxcIiwgISFvcHRzLm1vZGFsKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gVG9nZ2xlIHRvb2xiYXIgYW5kIGNhcHRpb25cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdG9nZ2xlQ29udHJvbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5oYXNIaWRkZW5Db250cm9scykge1xyXG4gICAgICAgIHRoaXMuc2hvd0NvbnRyb2xzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5oaWRlQ29udHJvbHMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkLmZhbmN5Ym94ID0ge1xyXG4gICAgdmVyc2lvbjogXCIzLjUuNlwiLFxyXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRzLFxyXG5cclxuICAgIC8vIEdldCBjdXJyZW50IGluc3RhbmNlIGFuZCBleGVjdXRlIGEgY29tbWFuZC5cclxuICAgIC8vXHJcbiAgICAvLyBFeGFtcGxlcyBvZiB1c2FnZTpcclxuICAgIC8vXHJcbiAgICAvLyAgICRpbnN0YW5jZSA9ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKTtcclxuICAgIC8vICAgJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpLmp1bXBUbyggMSApO1xyXG4gICAgLy8gICAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCAnanVtcFRvJywgMSApO1xyXG4gICAgLy8gICAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCBmdW5jdGlvbigpIHtcclxuICAgIC8vICAgICAgIGNvbnNvbGUuaW5mbyggdGhpcy5jdXJySW5kZXggKTtcclxuICAgIC8vICAgfSk7XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24oY29tbWFuZCkge1xyXG4gICAgICB2YXIgaW5zdGFuY2UgPSAkKCcuZmFuY3lib3gtY29udGFpbmVyOm5vdChcIi5mYW5jeWJveC1pcy1jbG9zaW5nXCIpOmxhc3QnKS5kYXRhKFwiRmFuY3lCb3hcIiksXHJcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcblxyXG4gICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBGYW5jeUJveCkge1xyXG4gICAgICAgIGlmICgkLnR5cGUoY29tbWFuZCkgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgIGluc3RhbmNlW2NvbW1hbmRdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCQudHlwZShjb21tYW5kKSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICBjb21tYW5kLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDcmVhdGUgbmV3IGluc3RhbmNlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgb3BlbjogZnVuY3Rpb24oaXRlbXMsIG9wdHMsIGluZGV4KSB7XHJcbiAgICAgIHJldHVybiBuZXcgRmFuY3lCb3goaXRlbXMsIG9wdHMsIGluZGV4KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ2xvc2UgY3VycmVudCBvciBhbGwgaW5zdGFuY2VzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBjbG9zZTogZnVuY3Rpb24oYWxsKSB7XHJcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2V0SW5zdGFuY2UoKTtcclxuXHJcbiAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgIGluc3RhbmNlLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGFuZCBjbG9zZSBuZXh0IGluc3RhbmNlXHJcbiAgICAgICAgaWYgKGFsbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdGhpcy5jbG9zZShhbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDbG9zZSBhbGwgaW5zdGFuY2VzIGFuZCB1bmJpbmQgYWxsIGV2ZW50c1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5jbG9zZSh0cnVlKTtcclxuXHJcbiAgICAgICRELmFkZChcImJvZHlcIikub2ZmKFwiY2xpY2suZmItc3RhcnRcIiwgXCIqKlwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gVHJ5IHRvIGRldGVjdCBtb2JpbGUgZGV2aWNlc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGlzTW9iaWxlOiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXHJcblxyXG4gICAgLy8gRGV0ZWN0IGlmICd0cmFuc2xhdGUzZCcgc3VwcG9ydCBpcyBhdmFpbGFibGVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdXNlM2Q6IChmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICYmXHJcbiAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2KSAmJlxyXG4gICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRpdikuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKSAmJlxyXG4gICAgICAgICEoZG9jdW1lbnQuZG9jdW1lbnRNb2RlICYmIGRvY3VtZW50LmRvY3VtZW50TW9kZSA8IDExKVxyXG4gICAgICApO1xyXG4gICAgfSkoKSxcclxuXHJcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGN1cnJlbnQgdmlzdWFsIHN0YXRlIG9mIGFuIGVsZW1lbnRcclxuICAgIC8vIHJldHVybnMgYXJyYXlbIHRvcCwgbGVmdCwgaG9yaXpvbnRhbC1zY2FsZSwgdmVydGljYWwtc2NhbGUsIG9wYWNpdHkgXVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgZ2V0VHJhbnNsYXRlOiBmdW5jdGlvbigkZWwpIHtcclxuICAgICAgdmFyIGRvbVJlY3Q7XHJcblxyXG4gICAgICBpZiAoISRlbCB8fCAhJGVsLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZG9tUmVjdCA9ICRlbFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdG9wOiBkb21SZWN0LnRvcCB8fCAwLFxyXG4gICAgICAgIGxlZnQ6IGRvbVJlY3QubGVmdCB8fCAwLFxyXG4gICAgICAgIHdpZHRoOiBkb21SZWN0LndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZG9tUmVjdC5oZWlnaHQsXHJcbiAgICAgICAgb3BhY2l0eTogcGFyc2VGbG9hdCgkZWwuY3NzKFwib3BhY2l0eVwiKSlcclxuICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2hvcnRjdXQgZm9yIHNldHRpbmcgXCJ0cmFuc2xhdGUzZFwiIHByb3BlcnRpZXMgZm9yIGVsZW1lbnRcclxuICAgIC8vIENhbiBzZXQgYmUgdXNlZCB0byBzZXQgb3BhY2l0eSwgdG9vXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHNldFRyYW5zbGF0ZTogZnVuY3Rpb24oJGVsLCBwcm9wcykge1xyXG4gICAgICB2YXIgc3RyID0gXCJcIixcclxuICAgICAgICBjc3MgPSB7fTtcclxuXHJcbiAgICAgIGlmICghJGVsIHx8ICFwcm9wcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHByb3BzLmxlZnQgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy50b3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHN0ciA9XHJcbiAgICAgICAgICAocHJvcHMubGVmdCA9PT0gdW5kZWZpbmVkID8gJGVsLnBvc2l0aW9uKCkubGVmdCA6IHByb3BzLmxlZnQpICtcclxuICAgICAgICAgIFwicHgsIFwiICtcclxuICAgICAgICAgIChwcm9wcy50b3AgPT09IHVuZGVmaW5lZCA/ICRlbC5wb3NpdGlvbigpLnRvcCA6IHByb3BzLnRvcCkgK1xyXG4gICAgICAgICAgXCJweFwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy51c2UzZCkge1xyXG4gICAgICAgICAgc3RyID0gXCJ0cmFuc2xhdGUzZChcIiArIHN0ciArIFwiLCAwcHgpXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN0ciA9IFwidHJhbnNsYXRlKFwiICsgc3RyICsgXCIpXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvcHMuc2NhbGVYICE9PSB1bmRlZmluZWQgJiYgcHJvcHMuc2NhbGVZICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzdHIgKz0gXCIgc2NhbGUoXCIgKyBwcm9wcy5zY2FsZVggKyBcIiwgXCIgKyBwcm9wcy5zY2FsZVkgKyBcIilcIjtcclxuICAgICAgfSBlbHNlIGlmIChwcm9wcy5zY2FsZVggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHN0ciArPSBcIiBzY2FsZVgoXCIgKyBwcm9wcy5zY2FsZVggKyBcIilcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHN0ci5sZW5ndGgpIHtcclxuICAgICAgICBjc3MudHJhbnNmb3JtID0gc3RyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvcHMub3BhY2l0eSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY3NzLm9wYWNpdHkgPSBwcm9wcy5vcGFjaXR5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvcHMud2lkdGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNzcy53aWR0aCA9IHByb3BzLndpZHRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvcHMuaGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjc3MuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gJGVsLmNzcyhjc3MpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTaW1wbGUgQ1NTIHRyYW5zaXRpb24gaGFuZGxlclxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBhbmltYXRlOiBmdW5jdGlvbigkZWwsIHRvLCBkdXJhdGlvbiwgY2FsbGJhY2ssIGxlYXZlQW5pbWF0aW9uTmFtZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgZnJvbTtcclxuXHJcbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oZHVyYXRpb24pKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBkdXJhdGlvbjtcclxuICAgICAgICBkdXJhdGlvbiA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuc3RvcCgkZWwpO1xyXG5cclxuICAgICAgZnJvbSA9IHNlbGYuZ2V0VHJhbnNsYXRlKCRlbCk7XHJcblxyXG4gICAgICAkZWwub24odHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIC8vIFNraXAgZXZlbnRzIGZyb20gY2hpbGQgZWxlbWVudHMgYW5kIHotaW5kZXggY2hhbmdlXHJcbiAgICAgICAgaWYgKGUgJiYgZS5vcmlnaW5hbEV2ZW50ICYmICghJGVsLmlzKGUub3JpZ2luYWxFdmVudC50YXJnZXQpIHx8IGUub3JpZ2luYWxFdmVudC5wcm9wZXJ0eU5hbWUgPT0gXCJ6LWluZGV4XCIpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnN0b3AoJGVsKTtcclxuXHJcbiAgICAgICAgaWYgKCQuaXNOdW1lcmljKGR1cmF0aW9uKSkge1xyXG4gICAgICAgICAgJGVsLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIiwgXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHRvKSkge1xyXG4gICAgICAgICAgaWYgKHRvLnNjYWxlWCAhPT0gdW5kZWZpbmVkICYmIHRvLnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0VHJhbnNsYXRlKCRlbCwge1xyXG4gICAgICAgICAgICAgIHRvcDogdG8udG9wLFxyXG4gICAgICAgICAgICAgIGxlZnQ6IHRvLmxlZnQsXHJcbiAgICAgICAgICAgICAgd2lkdGg6IGZyb20ud2lkdGggKiB0by5zY2FsZVgsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiBmcm9tLmhlaWdodCAqIHRvLnNjYWxlWSxcclxuICAgICAgICAgICAgICBzY2FsZVg6IDEsXHJcbiAgICAgICAgICAgICAgc2NhbGVZOiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobGVhdmVBbmltYXRpb25OYW1lICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3ModG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoJC5pc051bWVyaWMoZHVyYXRpb24pKSB7XHJcbiAgICAgICAgJGVsLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIiwgZHVyYXRpb24gKyBcIm1zXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTdGFydCBhbmltYXRpb24gYnkgY2hhbmdpbmcgQ1NTIHByb3BlcnRpZXMgb3IgY2xhc3MgbmFtZVxyXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHRvKSkge1xyXG4gICAgICAgIGlmICh0by5zY2FsZVggIT09IHVuZGVmaW5lZCAmJiB0by5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgZGVsZXRlIHRvLndpZHRoO1xyXG4gICAgICAgICAgZGVsZXRlIHRvLmhlaWdodDtcclxuXHJcbiAgICAgICAgICBpZiAoJGVsLnBhcmVudCgpLmhhc0NsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWltYWdlXCIpKSB7XHJcbiAgICAgICAgICAgICRlbC5wYXJlbnQoKS5hZGRDbGFzcyhcImZhbmN5Ym94LWlzLXNjYWxpbmdcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSgkZWwsIHRvKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkZWwuYWRkQ2xhc3ModG8pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCBgdHJhbnNpdGlvbmVuZGAgY2FsbGJhY2sgZ2V0cyBmaXJlZFxyXG4gICAgICAkZWwuZGF0YShcclxuICAgICAgICBcInRpbWVyXCIsXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICRlbC50cmlnZ2VyKHRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgIH0sIGR1cmF0aW9uICsgMzMpXHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0b3A6IGZ1bmN0aW9uKCRlbCwgY2FsbENhbGxiYWNrKSB7XHJcbiAgICAgIGlmICgkZWwgJiYgJGVsLmxlbmd0aCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCgkZWwuZGF0YShcInRpbWVyXCIpKTtcclxuXHJcbiAgICAgICAgaWYgKGNhbGxDYWxsYmFjaykge1xyXG4gICAgICAgICAgJGVsLnRyaWdnZXIodHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZWwub2ZmKHRyYW5zaXRpb25FbmQpLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIiwgXCJcIik7XHJcblxyXG4gICAgICAgICRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LWlzLXNjYWxpbmdcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBEZWZhdWx0IGNsaWNrIGhhbmRsZXIgZm9yIFwiZmFuY3lib3hlZFwiIGxpbmtzXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gX3J1bihlLCBvcHRzKSB7XHJcbiAgICB2YXIgaXRlbXMgPSBbXSxcclxuICAgICAgaW5kZXggPSAwLFxyXG4gICAgICAkdGFyZ2V0LFxyXG4gICAgICB2YWx1ZSxcclxuICAgICAgaW5zdGFuY2U7XHJcblxyXG4gICAgLy8gQXZvaWQgb3BlbmluZyBtdWx0aXBsZSB0aW1lc1xyXG4gICAgaWYgKGUgJiYgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICAgIGlmIChlICYmIGUuZGF0YSkge1xyXG4gICAgICBvcHRzID0gbWVyZ2VPcHRzKGUuZGF0YS5vcHRpb25zLCBvcHRzKTtcclxuICAgIH1cclxuXHJcbiAgICAkdGFyZ2V0ID0gb3B0cy4kdGFyZ2V0IHx8ICQoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKFwiYmx1clwiKTtcclxuICAgIGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kdHJpZ2dlciAmJiBpbnN0YW5jZS4kdHJpZ2dlci5pcygkdGFyZ2V0KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdHMuc2VsZWN0b3IpIHtcclxuICAgICAgaXRlbXMgPSAkKG9wdHMuc2VsZWN0b3IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gR2V0IGFsbCByZWxhdGVkIGl0ZW1zIGFuZCBmaW5kIGluZGV4IGZvciBjbGlja2VkIG9uZVxyXG4gICAgICB2YWx1ZSA9ICR0YXJnZXQuYXR0cihcImRhdGEtZmFuY3lib3hcIikgfHwgXCJcIjtcclxuXHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIGl0ZW1zID0gZS5kYXRhID8gZS5kYXRhLml0ZW1zIDogW107XHJcbiAgICAgICAgaXRlbXMgPSBpdGVtcy5sZW5ndGggPyBpdGVtcy5maWx0ZXIoJ1tkYXRhLWZhbmN5Ym94PVwiJyArIHZhbHVlICsgJ1wiXScpIDogJCgnW2RhdGEtZmFuY3lib3g9XCInICsgdmFsdWUgKyAnXCJdJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbXMgPSBbJHRhcmdldF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbmRleCA9ICQoaXRlbXMpLmluZGV4KCR0YXJnZXQpO1xyXG5cclxuICAgIC8vIFNvbWV0aW1lcyBjdXJyZW50IGl0ZW0gY2FuIG5vdCBiZSBmb3VuZFxyXG4gICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICBpbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaW5zdGFuY2UgPSAkLmZhbmN5Ym94Lm9wZW4oaXRlbXMsIG9wdHMsIGluZGV4KTtcclxuXHJcbiAgICAvLyBTYXZlIGxhc3QgYWN0aXZlIGVsZW1lbnRcclxuICAgIGluc3RhbmNlLiR0cmlnZ2VyID0gJHRhcmdldDtcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZSBhIGpRdWVyeSBwbHVnaW5cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICQuZm4uZmFuY3lib3ggPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICB2YXIgc2VsZWN0b3I7XHJcblxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICBzZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3IgfHwgZmFsc2U7XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICAgIC8vIFVzZSBib2R5IGVsZW1lbnQgaW5zdGVhZCBvZiBkb2N1bWVudCBzbyBpdCBleGVjdXRlcyBmaXJzdFxyXG4gICAgICAkKFwiYm9keVwiKVxyXG4gICAgICAgIC5vZmYoXCJjbGljay5mYi1zdGFydFwiLCBzZWxlY3RvcilcclxuICAgICAgICAub24oXCJjbGljay5mYi1zdGFydFwiLCBzZWxlY3Rvciwge29wdGlvbnM6IG9wdGlvbnN9LCBfcnVuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMub2ZmKFwiY2xpY2suZmItc3RhcnRcIikub24oXHJcbiAgICAgICAgXCJjbGljay5mYi1zdGFydFwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGl0ZW1zOiB0aGlzLFxyXG4gICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX3J1blxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIC8vIFNlbGYgaW5pdGlhbGl6aW5nIHBsdWdpbiBmb3IgYWxsIGVsZW1lbnRzIGhhdmluZyBgZGF0YS1mYW5jeWJveGAgYXR0cmlidXRlXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJEQub24oXCJjbGljay5mYi1zdGFydFwiLCBcIltkYXRhLWZhbmN5Ym94XVwiLCBfcnVuKTtcclxuXHJcbiAgLy8gRW5hYmxlIFwidHJpZ2dlciBlbGVtZW50c1wiXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAkRC5vbihcImNsaWNrLmZiLXN0YXJ0XCIsIFwiW2RhdGEtZmFuY3lib3gtdHJpZ2dlcl1cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgJCgnW2RhdGEtZmFuY3lib3g9XCInICsgJCh0aGlzKS5hdHRyKFwiZGF0YS1mYW5jeWJveC10cmlnZ2VyXCIpICsgJ1wiXScpXHJcbiAgICAgIC5lcSgkKHRoaXMpLmF0dHIoXCJkYXRhLWZhbmN5Ym94LWluZGV4XCIpIHx8IDApXHJcbiAgICAgIC50cmlnZ2VyKFwiY2xpY2suZmItc3RhcnRcIiwge1xyXG4gICAgICAgICR0cmlnZ2VyOiAkKHRoaXMpXHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBUcmFjayBmb2N1cyBldmVudCBmb3IgYmV0dGVyIGFjY2Vzc2liaWxpdHkgc3R5bGluZ1xyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGJ1dHRvblN0ciA9IFwiLmZhbmN5Ym94LWJ1dHRvblwiLFxyXG4gICAgICBmb2N1c1N0ciA9IFwiZmFuY3lib3gtZm9jdXNcIixcclxuICAgICAgJHByZXNzZWQgPSBudWxsO1xyXG5cclxuICAgICRELm9uKFwibW91c2Vkb3duIG1vdXNldXAgZm9jdXMgYmx1clwiLCBidXR0b25TdHIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwibW91c2Vkb3duXCI6XHJcbiAgICAgICAgICAkcHJlc3NlZCA9ICQodGhpcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibW91c2V1cFwiOlxyXG4gICAgICAgICAgJHByZXNzZWQgPSBudWxsO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImZvY3VzaW5cIjpcclxuICAgICAgICAgICQoYnV0dG9uU3RyKS5yZW1vdmVDbGFzcyhmb2N1c1N0cik7XHJcblxyXG4gICAgICAgICAgaWYgKCEkKHRoaXMpLmlzKCRwcmVzc2VkKSAmJiAhJCh0aGlzKS5pcyhcIltkaXNhYmxlZF1cIikpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhmb2N1c1N0cik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZm9jdXNvdXRcIjpcclxuICAgICAgICAgICQoYnV0dG9uU3RyKS5yZW1vdmVDbGFzcyhmb2N1c1N0cik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSkoKTtcclxufSkod2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KTtcclxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vL1xyXG4vLyBNZWRpYVxyXG4vLyBBZGRzIGFkZGl0aW9uYWwgbWVkaWEgdHlwZSBzdXBwb3J0XHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbihmdW5jdGlvbigkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIC8vIE9iamVjdCBjb250YWluaW5nIHByb3BlcnRpZXMgZm9yIGVhY2ggbWVkaWEgdHlwZVxyXG4gIHZhciBkZWZhdWx0cyA9IHtcclxuICAgIHlvdXR1YmU6IHtcclxuICAgICAgbWF0Y2hlcjogLyh5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmV8eW91dHViZVxcLW5vY29va2llXFwuY29tKVxcLyh3YXRjaFxcPyguKiYpP3Y9fHZcXC98dVxcL3xlbWJlZFxcLz8pPyh2aWRlb3Nlcmllc1xcP2xpc3Q9KC4qKXxbXFx3LV17MTF9fFxcP2xpc3RUeXBlPSguKikmbGlzdD0oLiopKSguKikvaSxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgYXV0b3BsYXk6IDEsXHJcbiAgICAgICAgYXV0b2hpZGU6IDEsXHJcbiAgICAgICAgZnM6IDEsXHJcbiAgICAgICAgcmVsOiAwLFxyXG4gICAgICAgIGhkOiAxLFxyXG4gICAgICAgIHdtb2RlOiBcInRyYW5zcGFyZW50XCIsXHJcbiAgICAgICAgZW5hYmxlanNhcGk6IDEsXHJcbiAgICAgICAgaHRtbDU6IDFcclxuICAgICAgfSxcclxuICAgICAgcGFyYW1QbGFjZTogOCxcclxuICAgICAgdHlwZTogXCJpZnJhbWVcIixcclxuICAgICAgdXJsOiBcImh0dHBzOi8vd3d3LnlvdXR1YmUtbm9jb29raWUuY29tL2VtYmVkLyQ0XCIsXHJcbiAgICAgIHRodW1iOiBcImh0dHBzOi8vaW1nLnlvdXR1YmUuY29tL3ZpLyQ0L2hxZGVmYXVsdC5qcGdcIlxyXG4gICAgfSxcclxuXHJcbiAgICB2aW1lbzoge1xyXG4gICAgICBtYXRjaGVyOiAvXi4rdmltZW8uY29tXFwvKC4qXFwvKT8oW1xcZF0rKSguKik/LyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgYXV0b3BsYXk6IDEsXHJcbiAgICAgICAgaGQ6IDEsXHJcbiAgICAgICAgc2hvd190aXRsZTogMSxcclxuICAgICAgICBzaG93X2J5bGluZTogMSxcclxuICAgICAgICBzaG93X3BvcnRyYWl0OiAwLFxyXG4gICAgICAgIGZ1bGxzY3JlZW46IDFcclxuICAgICAgfSxcclxuICAgICAgcGFyYW1QbGFjZTogMyxcclxuICAgICAgdHlwZTogXCJpZnJhbWVcIixcclxuICAgICAgdXJsOiBcIi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8kMlwiXHJcbiAgICB9LFxyXG5cclxuICAgIGluc3RhZ3JhbToge1xyXG4gICAgICBtYXRjaGVyOiAvKGluc3RhZ3JcXC5hbXxpbnN0YWdyYW1cXC5jb20pXFwvcFxcLyhbYS16QS1aMC05X1xcLV0rKVxcLz8vaSxcclxuICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICB1cmw6IFwiLy8kMS9wLyQyL21lZGlhLz9zaXplPWxcIlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBFeGFtcGxlczpcclxuICAgIC8vIGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP2xsPTQ4Ljg1Nzk5NSwyLjI5NDI5NyZzcG49MC4wMDc2NjYsMC4wMjExMzYmdD1tJno9MTZcclxuICAgIC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9AMzcuNzg1MjAwNiwtMTIyLjQxNDYzNTUsMTQuNjV6XHJcbiAgICAvLyBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvQDUyLjIxMTExMjMsMi45MjM3NTQyLDYuNjF6P2hsPWVuXHJcbiAgICAvLyBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvcGxhY2UvR29vZ2xlcGxleC9AMzcuNDIyMDA0MSwtMTIyLjA4MzM0OTQsMTd6L2RhdGE9ITRtNSEzbTQhMXMweDA6MHg2YzI5NmM2NjYxOTM2N2UwIThtMiEzZDM3LjQyMTk5OTghNGQtMTIyLjA4NDA1NzJcclxuICAgIGdtYXBfcGxhY2U6IHtcclxuICAgICAgbWF0Y2hlcjogLyhtYXBzXFwuKT9nb29nbGVcXC4oW2Etel17MiwzfShcXC5bYS16XXsyfSk/KVxcLygoKG1hcHNcXC8ocGxhY2VcXC8oLiopXFwvKT9cXEAoLiopLChcXGQrLj9cXGQrPyl6KSl8KFxcP2xsPSkpKC4qKT8vaSxcclxuICAgICAgdHlwZTogXCJpZnJhbWVcIixcclxuICAgICAgdXJsOiBmdW5jdGlvbihyZXopIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgXCIvL21hcHMuZ29vZ2xlLlwiICtcclxuICAgICAgICAgIHJlelsyXSArXHJcbiAgICAgICAgICBcIi8/bGw9XCIgK1xyXG4gICAgICAgICAgKHJlels5XSA/IHJlels5XSArIFwiJno9XCIgKyBNYXRoLmZsb29yKHJlelsxMF0pICsgKHJlelsxMl0gPyByZXpbMTJdLnJlcGxhY2UoL15cXC8vLCBcIiZcIikgOiBcIlwiKSA6IHJlelsxMl0gKyBcIlwiKS5yZXBsYWNlKC9cXD8vLCBcIiZcIikgK1xyXG4gICAgICAgICAgXCImb3V0cHV0PVwiICtcclxuICAgICAgICAgIChyZXpbMTJdICYmIHJlelsxMl0uaW5kZXhPZihcImxheWVyPWNcIikgPiAwID8gXCJzdmVtYmVkXCIgOiBcImVtYmVkXCIpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBFeGFtcGxlczpcclxuICAgIC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvRW1waXJlK1N0YXRlK0J1aWxkaW5nL1xyXG4gICAgLy8gaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3NlYXJjaC8/YXBpPTEmcXVlcnk9Y2VudHVyeWxpbmsrZmllbGRcclxuICAgIC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PTQ3LjU5NTE1MTgsLTEyMi4zMzE2MzkzXHJcbiAgICBnbWFwX3NlYXJjaDoge1xyXG4gICAgICBtYXRjaGVyOiAvKG1hcHNcXC4pP2dvb2dsZVxcLihbYS16XXsyLDN9KFxcLlthLXpdezJ9KT8pXFwvKG1hcHNcXC9zZWFyY2hcXC8pKC4qKS9pLFxyXG4gICAgICB0eXBlOiBcImlmcmFtZVwiLFxyXG4gICAgICB1cmw6IGZ1bmN0aW9uKHJleikge1xyXG4gICAgICAgIHJldHVybiBcIi8vbWFwcy5nb29nbGUuXCIgKyByZXpbMl0gKyBcIi9tYXBzP3E9XCIgKyByZXpbNV0ucmVwbGFjZShcInF1ZXJ5PVwiLCBcInE9XCIpLnJlcGxhY2UoXCJhcGk9MVwiLCBcIlwiKSArIFwiJm91dHB1dD1lbWJlZFwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gRm9ybWF0cyBtYXRjaGluZyB1cmwgdG8gZmluYWwgZm9ybVxyXG4gIHZhciBmb3JtYXQgPSBmdW5jdGlvbih1cmwsIHJleiwgcGFyYW1zKSB7XHJcbiAgICBpZiAoIXVybCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IFwiXCI7XHJcblxyXG4gICAgaWYgKCQudHlwZShwYXJhbXMpID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgIHBhcmFtcyA9ICQucGFyYW0ocGFyYW1zLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAkLmVhY2gocmV6LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKFwiJFwiICsga2V5LCB2YWx1ZSB8fCBcIlwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChwYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgIHVybCArPSAodXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpICsgcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB1cmw7XHJcbiAgfTtcclxuXHJcbiAgJChkb2N1bWVudCkub24oXCJvYmplY3ROZWVkc1R5cGUuZmJcIiwgZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGl0ZW0pIHtcclxuICAgIHZhciB1cmwgPSBpdGVtLnNyYyB8fCBcIlwiLFxyXG4gICAgICB0eXBlID0gZmFsc2UsXHJcbiAgICAgIG1lZGlhLFxyXG4gICAgICB0aHVtYixcclxuICAgICAgcmV6LFxyXG4gICAgICBwYXJhbXMsXHJcbiAgICAgIHVybFBhcmFtcyxcclxuICAgICAgcGFyYW1PYmosXHJcbiAgICAgIHByb3ZpZGVyO1xyXG5cclxuICAgIG1lZGlhID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBpdGVtLm9wdHMubWVkaWEpO1xyXG5cclxuICAgIC8vIExvb2sgZm9yIGFueSBtYXRjaGluZyBtZWRpYSB0eXBlXHJcbiAgICAkLmVhY2gobWVkaWEsIGZ1bmN0aW9uKHByb3ZpZGVyTmFtZSwgcHJvdmlkZXJPcHRzKSB7XHJcbiAgICAgIHJleiA9IHVybC5tYXRjaChwcm92aWRlck9wdHMubWF0Y2hlcik7XHJcblxyXG4gICAgICBpZiAoIXJleikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdHlwZSA9IHByb3ZpZGVyT3B0cy50eXBlO1xyXG4gICAgICBwcm92aWRlciA9IHByb3ZpZGVyTmFtZTtcclxuICAgICAgcGFyYW1PYmogPSB7fTtcclxuXHJcbiAgICAgIGlmIChwcm92aWRlck9wdHMucGFyYW1QbGFjZSAmJiByZXpbcHJvdmlkZXJPcHRzLnBhcmFtUGxhY2VdKSB7XHJcbiAgICAgICAgdXJsUGFyYW1zID0gcmV6W3Byb3ZpZGVyT3B0cy5wYXJhbVBsYWNlXTtcclxuXHJcbiAgICAgICAgaWYgKHVybFBhcmFtc1swXSA9PSBcIj9cIikge1xyXG4gICAgICAgICAgdXJsUGFyYW1zID0gdXJsUGFyYW1zLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVybFBhcmFtcyA9IHVybFBhcmFtcy5zcGxpdChcIiZcIik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdXJsUGFyYW1zLmxlbmd0aDsgKyttKSB7XHJcbiAgICAgICAgICB2YXIgcCA9IHVybFBhcmFtc1ttXS5zcGxpdChcIj1cIiwgMik7XHJcblxyXG4gICAgICAgICAgaWYgKHAubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgcGFyYW1PYmpbcFswXV0gPSBkZWNvZGVVUklDb21wb25lbnQocFsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhcmFtcyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBwcm92aWRlck9wdHMucGFyYW1zLCBpdGVtLm9wdHNbcHJvdmlkZXJOYW1lXSwgcGFyYW1PYmopO1xyXG5cclxuICAgICAgdXJsID1cclxuICAgICAgICAkLnR5cGUocHJvdmlkZXJPcHRzLnVybCkgPT09IFwiZnVuY3Rpb25cIiA/IHByb3ZpZGVyT3B0cy51cmwuY2FsbCh0aGlzLCByZXosIHBhcmFtcywgaXRlbSkgOiBmb3JtYXQocHJvdmlkZXJPcHRzLnVybCwgcmV6LCBwYXJhbXMpO1xyXG5cclxuICAgICAgdGh1bWIgPVxyXG4gICAgICAgICQudHlwZShwcm92aWRlck9wdHMudGh1bWIpID09PSBcImZ1bmN0aW9uXCIgPyBwcm92aWRlck9wdHMudGh1bWIuY2FsbCh0aGlzLCByZXosIHBhcmFtcywgaXRlbSkgOiBmb3JtYXQocHJvdmlkZXJPcHRzLnRodW1iLCByZXopO1xyXG5cclxuICAgICAgaWYgKHByb3ZpZGVyTmFtZSA9PT0gXCJ5b3V0dWJlXCIpIHtcclxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvJnQ9KChcXGQrKW0pPyhcXGQrKXMvLCBmdW5jdGlvbihtYXRjaCwgcDEsIG0sIHMpIHtcclxuICAgICAgICAgIHJldHVybiBcIiZzdGFydD1cIiArICgobSA/IHBhcnNlSW50KG0sIDEwKSAqIDYwIDogMCkgKyBwYXJzZUludChzLCAxMCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKHByb3ZpZGVyTmFtZSA9PT0gXCJ2aW1lb1wiKSB7XHJcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoXCImJTIzXCIsIFwiI1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSWYgaXQgaXMgZm91bmQsIHRoZW4gY2hhbmdlIGNvbnRlbnQgdHlwZSBhbmQgdXBkYXRlIHRoZSB1cmxcclxuXHJcbiAgICBpZiAodHlwZSkge1xyXG4gICAgICBpZiAoIWl0ZW0ub3B0cy50aHVtYiAmJiAhKGl0ZW0ub3B0cy4kdGh1bWIgJiYgaXRlbS5vcHRzLiR0aHVtYi5sZW5ndGgpKSB7XHJcbiAgICAgICAgaXRlbS5vcHRzLnRodW1iID0gdGh1bWI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09PSBcImlmcmFtZVwiKSB7XHJcbiAgICAgICAgaXRlbS5vcHRzID0gJC5leHRlbmQodHJ1ZSwgaXRlbS5vcHRzLCB7XHJcbiAgICAgICAgICBpZnJhbWU6IHtcclxuICAgICAgICAgICAgcHJlbG9hZDogZmFsc2UsXHJcbiAgICAgICAgICAgIGF0dHI6IHtcclxuICAgICAgICAgICAgICBzY3JvbGxpbmc6IFwibm9cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQuZXh0ZW5kKGl0ZW0sIHtcclxuICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgIHNyYzogdXJsLFxyXG4gICAgICAgIG9yaWdTcmM6IGl0ZW0uc3JjLFxyXG4gICAgICAgIGNvbnRlbnRTb3VyY2U6IHByb3ZpZGVyLFxyXG4gICAgICAgIGNvbnRlbnRUeXBlOiB0eXBlID09PSBcImltYWdlXCIgPyBcImltYWdlXCIgOiBwcm92aWRlciA9PSBcImdtYXBfcGxhY2VcIiB8fCBwcm92aWRlciA9PSBcImdtYXBfc2VhcmNoXCIgPyBcIm1hcFwiIDogXCJ2aWRlb1wiXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICh1cmwpIHtcclxuICAgICAgaXRlbS50eXBlID0gaXRlbS5vcHRzLmRlZmF1bHRUeXBlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBMb2FkIFlvdVR1YmUvVmlkZW8gQVBJIG9uIHJlcXVlc3QgdG8gZGV0ZWN0IHdoZW4gdmlkZW8gZmluaXNoZWQgcGxheWluZ1xyXG4gIHZhciBWaWRlb0FQSUxvYWRlciA9IHtcclxuICAgIHlvdXR1YmU6IHtcclxuICAgICAgc3JjOiBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGlcIixcclxuICAgICAgY2xhc3M6IFwiWVRcIixcclxuICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGxvYWRlZDogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgdmltZW86IHtcclxuICAgICAgc3JjOiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9hcGkvcGxheWVyLmpzXCIsXHJcbiAgICAgIGNsYXNzOiBcIlZpbWVvXCIsXHJcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICBsb2FkZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWQ6IGZ1bmN0aW9uKHZlbmRvcikge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzLFxyXG4gICAgICAgIHNjcmlwdDtcclxuXHJcbiAgICAgIGlmICh0aGlzW3ZlbmRvcl0ubG9hZGVkKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIF90aGlzLmRvbmUodmVuZG9yKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzW3ZlbmRvcl0ubG9hZGluZykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpc1t2ZW5kb3JdLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgc2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gICAgICBzY3JpcHQuc3JjID0gdGhpc1t2ZW5kb3JdLnNyYztcclxuXHJcbiAgICAgIGlmICh2ZW5kb3IgPT09IFwieW91dHViZVwiKSB7XHJcbiAgICAgICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBfdGhpc1t2ZW5kb3JdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICBfdGhpcy5kb25lKHZlbmRvcik7XHJcbiAgICAgICAgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBfdGhpc1t2ZW5kb3JdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICBfdGhpcy5kb25lKHZlbmRvcik7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgfSxcclxuICAgIGRvbmU6IGZ1bmN0aW9uKHZlbmRvcikge1xyXG4gICAgICB2YXIgaW5zdGFuY2UsICRlbCwgcGxheWVyO1xyXG5cclxuICAgICAgaWYgKHZlbmRvciA9PT0gXCJ5b3V0dWJlXCIpIHtcclxuICAgICAgICBkZWxldGUgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpbnN0YW5jZSA9ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKTtcclxuXHJcbiAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICRlbCA9IGluc3RhbmNlLmN1cnJlbnQuJGNvbnRlbnQuZmluZChcImlmcmFtZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKHZlbmRvciA9PT0gXCJ5b3V0dWJlXCIgJiYgWVQgIT09IHVuZGVmaW5lZCAmJiBZVCkge1xyXG4gICAgICAgICAgcGxheWVyID0gbmV3IFlULlBsYXllcigkZWwuYXR0cihcImlkXCIpLCB7XHJcbiAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgIG9uU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmRhdGEgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICBpbnN0YW5jZS5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHZlbmRvciA9PT0gXCJ2aW1lb1wiICYmIFZpbWVvICE9PSB1bmRlZmluZWQgJiYgVmltZW8pIHtcclxuICAgICAgICAgIHBsYXllciA9IG5ldyBWaW1lby5QbGF5ZXIoJGVsKTtcclxuXHJcbiAgICAgICAgICBwbGF5ZXIub24oXCJlbmRlZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UubmV4dCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgJChkb2N1bWVudCkub24oe1xyXG4gICAgXCJhZnRlclNob3cuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQpIHtcclxuICAgICAgaWYgKGluc3RhbmNlLmdyb3VwLmxlbmd0aCA+IDEgJiYgKGN1cnJlbnQuY29udGVudFNvdXJjZSA9PT0gXCJ5b3V0dWJlXCIgfHwgY3VycmVudC5jb250ZW50U291cmNlID09PSBcInZpbWVvXCIpKSB7XHJcbiAgICAgICAgVmlkZW9BUElMb2FkZXIubG9hZChjdXJyZW50LmNvbnRlbnRTb3VyY2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pKGpRdWVyeSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gR3Vlc3R1cmVzXHJcbi8vIEFkZHMgdG91Y2ggZ3Vlc3R1cmVzLCBoYW5kbGVzIGNsaWNrIGFuZCB0YXAgZXZlbnRzXHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIHZhciByZXF1ZXN0QUZyYW1lID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgLy8gaWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBzZXRUaW1lb3V0XHJcbiAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0pKCk7XHJcblxyXG4gIHZhciBjYW5jZWxBRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSkoKTtcclxuXHJcbiAgdmFyIGdldFBvaW50ZXJYWSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBlID0gZS5vcmlnaW5hbEV2ZW50IHx8IGUgfHwgd2luZG93LmU7XHJcbiAgICBlID0gZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPyBlLnRvdWNoZXMgOiBlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID8gZS5jaGFuZ2VkVG91Y2hlcyA6IFtlXTtcclxuXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gZSkge1xyXG4gICAgICBpZiAoZVtrZXldLnBhZ2VYKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgeDogZVtrZXldLnBhZ2VYLFxyXG4gICAgICAgICAgeTogZVtrZXldLnBhZ2VZXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZVtrZXldLmNsaWVudFgpIHtcclxuICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICB4OiBlW2tleV0uY2xpZW50WCxcclxuICAgICAgICAgIHk6IGVba2V5XS5jbGllbnRZXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcblxyXG4gIHZhciBkaXN0YW5jZSA9IGZ1bmN0aW9uKHBvaW50MiwgcG9pbnQxLCB3aGF0KSB7XHJcbiAgICBpZiAoIXBvaW50MSB8fCAhcG9pbnQyKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aGF0ID09PSBcInhcIikge1xyXG4gICAgICByZXR1cm4gcG9pbnQyLnggLSBwb2ludDEueDtcclxuICAgIH0gZWxzZSBpZiAod2hhdCA9PT0gXCJ5XCIpIHtcclxuICAgICAgcmV0dXJuIHBvaW50Mi55IC0gcG9pbnQxLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhwb2ludDIueCAtIHBvaW50MS54LCAyKSArIE1hdGgucG93KHBvaW50Mi55IC0gcG9pbnQxLnksIDIpKTtcclxuICB9O1xyXG5cclxuICB2YXIgaXNDbGlja2FibGUgPSBmdW5jdGlvbigkZWwpIHtcclxuICAgIGlmIChcclxuICAgICAgJGVsLmlzKCdhLGFyZWEsYnV0dG9uLFtyb2xlPVwiYnV0dG9uXCJdLGlucHV0LGxhYmVsLHNlbGVjdCxzdW1tYXJ5LHRleHRhcmVhLHZpZGVvLGF1ZGlvLGlmcmFtZScpIHx8XHJcbiAgICAgICQuaXNGdW5jdGlvbigkZWwuZ2V0KDApLm9uY2xpY2spIHx8XHJcbiAgICAgICRlbC5kYXRhKFwic2VsZWN0YWJsZVwiKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGZvciBhdHRyaWJ1dGVzIGxpa2UgZGF0YS1mYW5jeWJveC1uZXh0IG9yIGRhdGEtZmFuY3lib3gtY2xvc2VcclxuICAgIGZvciAodmFyIGkgPSAwLCBhdHRzID0gJGVsWzBdLmF0dHJpYnV0ZXMsIG4gPSBhdHRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICBpZiAoYXR0c1tpXS5ub2RlTmFtZS5zdWJzdHIoMCwgMTQpID09PSBcImRhdGEtZmFuY3lib3gtXCIpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICB2YXIgaGFzU2Nyb2xsYmFycyA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICB2YXIgb3ZlcmZsb3dZID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpW1wib3ZlcmZsb3cteVwiXSxcclxuICAgICAgb3ZlcmZsb3dYID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpW1wib3ZlcmZsb3cteFwiXSxcclxuICAgICAgdmVydGljYWwgPSAob3ZlcmZsb3dZID09PSBcInNjcm9sbFwiIHx8IG92ZXJmbG93WSA9PT0gXCJhdXRvXCIpICYmIGVsLnNjcm9sbEhlaWdodCA+IGVsLmNsaWVudEhlaWdodCxcclxuICAgICAgaG9yaXpvbnRhbCA9IChvdmVyZmxvd1ggPT09IFwic2Nyb2xsXCIgfHwgb3ZlcmZsb3dYID09PSBcImF1dG9cIikgJiYgZWwuc2Nyb2xsV2lkdGggPiBlbC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICByZXR1cm4gdmVydGljYWwgfHwgaG9yaXpvbnRhbDtcclxuICB9O1xyXG5cclxuICB2YXIgaXNTY3JvbGxhYmxlID0gZnVuY3Rpb24oJGVsKSB7XHJcbiAgICB2YXIgcmV6ID0gZmFsc2U7XHJcblxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgcmV6ID0gaGFzU2Nyb2xsYmFycygkZWwuZ2V0KDApKTtcclxuXHJcbiAgICAgIGlmIChyZXopIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgJGVsID0gJGVsLnBhcmVudCgpO1xyXG5cclxuICAgICAgaWYgKCEkZWwubGVuZ3RoIHx8ICRlbC5oYXNDbGFzcyhcImZhbmN5Ym94LXN0YWdlXCIpIHx8ICRlbC5pcyhcImJvZHlcIikpIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXo7XHJcbiAgfTtcclxuXHJcbiAgdmFyIEd1ZXN0dXJlcyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG5cclxuICAgIHNlbGYuJGJnID0gaW5zdGFuY2UuJHJlZnMuYmc7XHJcbiAgICBzZWxmLiRzdGFnZSA9IGluc3RhbmNlLiRyZWZzLnN0YWdlO1xyXG4gICAgc2VsZi4kY29udGFpbmVyID0gaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyO1xyXG5cclxuICAgIHNlbGYuZGVzdHJveSgpO1xyXG5cclxuICAgIHNlbGYuJGNvbnRhaW5lci5vbihcInRvdWNoc3RhcnQuZmIudG91Y2ggbW91c2Vkb3duLmZiLnRvdWNoXCIsICQucHJveHkoc2VsZiwgXCJvbnRvdWNoc3RhcnRcIikpO1xyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuJGNvbnRhaW5lci5vZmYoXCIuZmIudG91Y2hcIik7XHJcblxyXG4gICAgJChkb2N1bWVudCkub2ZmKFwiLmZiLnRvdWNoXCIpO1xyXG5cclxuICAgIGlmIChzZWxmLnJlcXVlc3RJZCkge1xyXG4gICAgICBjYW5jZWxBRnJhbWUoc2VsZi5yZXF1ZXN0SWQpO1xyXG4gICAgICBzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYudGFwcGVkKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLnRhcHBlZCk7XHJcbiAgICAgIHNlbGYudGFwcGVkID0gbnVsbDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9udG91Y2hzdGFydCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLFxyXG4gICAgICBpbnN0YW5jZSA9IHNlbGYuaW5zdGFuY2UsXHJcbiAgICAgIGN1cnJlbnQgPSBpbnN0YW5jZS5jdXJyZW50LFxyXG4gICAgICAkc2xpZGUgPSBjdXJyZW50LiRzbGlkZSxcclxuICAgICAgJGNvbnRlbnQgPSBjdXJyZW50LiRjb250ZW50LFxyXG4gICAgICBpc1RvdWNoRGV2aWNlID0gZS50eXBlID09IFwidG91Y2hzdGFydFwiO1xyXG5cclxuICAgIC8vIERvIG5vdCByZXNwb25kIHRvIGJvdGggKHRvdWNoIGFuZCBtb3VzZSkgZXZlbnRzXHJcbiAgICBpZiAoaXNUb3VjaERldmljZSkge1xyXG4gICAgICBzZWxmLiRjb250YWluZXIub2ZmKFwibW91c2Vkb3duLmZiLnRvdWNoXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElnbm9yZSByaWdodCBjbGlja1xyXG4gICAgaWYgKGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuYnV0dG9uID09IDIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElnbm9yZSB0YXBpbmcgb24gbGlua3MsIGJ1dHRvbnMsIGlucHV0IGVsZW1lbnRzXHJcbiAgICBpZiAoISRzbGlkZS5sZW5ndGggfHwgISR0YXJnZXQubGVuZ3RoIHx8IGlzQ2xpY2thYmxlKCR0YXJnZXQpIHx8IGlzQ2xpY2thYmxlKCR0YXJnZXQucGFyZW50KCkpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIElnbm9yZSBjbGlja3Mgb24gdGhlIHNjcm9sbGJhclxyXG4gICAgaWYgKCEkdGFyZ2V0LmlzKFwiaW1nXCIpICYmIGUub3JpZ2luYWxFdmVudC5jbGllbnRYID4gJHRhcmdldFswXS5jbGllbnRXaWR0aCArICR0YXJnZXQub2Zmc2V0KCkubGVmdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWdub3JlIGNsaWNrcyB3aGlsZSB6b29taW5nIG9yIGNsb3NpbmdcclxuICAgIGlmICghY3VycmVudCB8fCBpbnN0YW5jZS5pc0FuaW1hdGluZyB8fCBjdXJyZW50LiRzbGlkZS5oYXNDbGFzcyhcImZhbmN5Ym94LWFuaW1hdGVkXCIpKSB7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnJlYWxQb2ludHMgPSBzZWxmLnN0YXJ0UG9pbnRzID0gZ2V0UG9pbnRlclhZKGUpO1xyXG5cclxuICAgIGlmICghc2VsZi5zdGFydFBvaW50cy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFsbG93IG90aGVyIHNjcmlwdHMgdG8gY2F0Y2ggdG91Y2ggZXZlbnQgaWYgXCJ0b3VjaFwiIGlzIHNldCB0byBmYWxzZVxyXG4gICAgaWYgKGN1cnJlbnQudG91Y2gpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnN0YXJ0RXZlbnQgPSBlO1xyXG5cclxuICAgIHNlbGYuY2FuVGFwID0gdHJ1ZTtcclxuICAgIHNlbGYuJHRhcmdldCA9ICR0YXJnZXQ7XHJcbiAgICBzZWxmLiRjb250ZW50ID0gJGNvbnRlbnQ7XHJcbiAgICBzZWxmLm9wdHMgPSBjdXJyZW50Lm9wdHMudG91Y2g7XHJcblxyXG4gICAgc2VsZi5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICAgIHNlbGYuaXNTd2lwaW5nID0gZmFsc2U7XHJcbiAgICBzZWxmLmlzWm9vbWluZyA9IGZhbHNlO1xyXG4gICAgc2VsZi5pc1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgc2VsZi5jYW5QYW4gPSBpbnN0YW5jZS5jYW5QYW4oKTtcclxuXHJcbiAgICBzZWxmLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgc2VsZi5kaXN0YW5jZVggPSBzZWxmLmRpc3RhbmNlWSA9IHNlbGYuZGlzdGFuY2UgPSAwO1xyXG5cclxuICAgIHNlbGYuY2FudmFzV2lkdGggPSBNYXRoLnJvdW5kKCRzbGlkZVswXS5jbGllbnRXaWR0aCk7XHJcbiAgICBzZWxmLmNhbnZhc0hlaWdodCA9IE1hdGgucm91bmQoJHNsaWRlWzBdLmNsaWVudEhlaWdodCk7XHJcblxyXG4gICAgc2VsZi5jb250ZW50TGFzdFBvcyA9IG51bGw7XHJcbiAgICBzZWxmLmNvbnRlbnRTdGFydFBvcyA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKHNlbGYuJGNvbnRlbnQpIHx8IHt0b3A6IDAsIGxlZnQ6IDB9O1xyXG4gICAgc2VsZi5zbGlkZXJTdGFydFBvcyA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCRzbGlkZSk7XHJcblxyXG4gICAgLy8gU2luY2UgcG9zaXRpb24gd2lsbCBiZSBhYnNvbHV0ZSwgYnV0IHdlIG5lZWQgdG8gbWFrZSBpdCByZWxhdGl2ZSB0byB0aGUgc3RhZ2VcclxuICAgIHNlbGYuc3RhZ2VQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShpbnN0YW5jZS4kcmVmcy5zdGFnZSk7XHJcblxyXG4gICAgc2VsZi5zbGlkZXJTdGFydFBvcy50b3AgLT0gc2VsZi5zdGFnZVBvcy50b3A7XHJcbiAgICBzZWxmLnNsaWRlclN0YXJ0UG9zLmxlZnQgLT0gc2VsZi5zdGFnZVBvcy5sZWZ0O1xyXG5cclxuICAgIHNlbGYuY29udGVudFN0YXJ0UG9zLnRvcCAtPSBzZWxmLnN0YWdlUG9zLnRvcDtcclxuICAgIHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQgLT0gc2VsZi5zdGFnZVBvcy5sZWZ0O1xyXG5cclxuICAgICQoZG9jdW1lbnQpXHJcbiAgICAgIC5vZmYoXCIuZmIudG91Y2hcIilcclxuICAgICAgLm9uKGlzVG91Y2hEZXZpY2UgPyBcInRvdWNoZW5kLmZiLnRvdWNoIHRvdWNoY2FuY2VsLmZiLnRvdWNoXCIgOiBcIm1vdXNldXAuZmIudG91Y2ggbW91c2VsZWF2ZS5mYi50b3VjaFwiLCAkLnByb3h5KHNlbGYsIFwib250b3VjaGVuZFwiKSlcclxuICAgICAgLm9uKGlzVG91Y2hEZXZpY2UgPyBcInRvdWNobW92ZS5mYi50b3VjaFwiIDogXCJtb3VzZW1vdmUuZmIudG91Y2hcIiwgJC5wcm94eShzZWxmLCBcIm9udG91Y2htb3ZlXCIpKTtcclxuXHJcbiAgICBpZiAoJC5mYW5jeWJveC5pc01vYmlsZSkge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNlbGYub25zY3JvbGwsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNraXAgaWYgY2xpY2tlZCBvdXRzaWRlIHRoZSBzbGlkaW5nIGFyZWFcclxuICAgIGlmICghKHNlbGYub3B0cyB8fCBzZWxmLmNhblBhbikgfHwgISgkdGFyZ2V0LmlzKHNlbGYuJHN0YWdlKSB8fCBzZWxmLiRzdGFnZS5maW5kKCR0YXJnZXQpLmxlbmd0aCkpIHtcclxuICAgICAgaWYgKCR0YXJnZXQuaXMoXCIuZmFuY3lib3gtaW1hZ2VcIikpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKCQuZmFuY3lib3guaXNNb2JpbGUgJiYgJHRhcmdldC5wYXJlbnRzKFwiLmZhbmN5Ym94LWNhcHRpb25cIikubGVuZ3RoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuaXNTY3JvbGxhYmxlID0gaXNTY3JvbGxhYmxlKCR0YXJnZXQpIHx8IGlzU2Nyb2xsYWJsZSgkdGFyZ2V0LnBhcmVudCgpKTtcclxuXHJcbiAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIHNjcm9sbGFibGUgYW5kIHRyeSB0byBwcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3IgKHNjcm9sbGluZylcclxuICAgIGlmICghKCQuZmFuY3lib3guaXNNb2JpbGUgJiYgc2VsZi5pc1Njcm9sbGFibGUpKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPbmUgZmluZ2VyIG9yIG1vdXNlIGNsaWNrIC0gc3dpcGUgb3IgcGFuIGFuIGltYWdlXHJcbiAgICBpZiAoc2VsZi5zdGFydFBvaW50cy5sZW5ndGggPT09IDEgfHwgY3VycmVudC5oYXNFcnJvcikge1xyXG4gICAgICBpZiAoc2VsZi5jYW5QYW4pIHtcclxuICAgICAgICAkLmZhbmN5Ym94LnN0b3Aoc2VsZi4kY29udGVudCk7XHJcblxyXG4gICAgICAgIHNlbGYuaXNQYW5uaW5nID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmLmlzU3dpcGluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcyhcImZhbmN5Ym94LWlzLWdyYWJiaW5nXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFR3byBmaW5nZXJzIC0gem9vbSBpbWFnZVxyXG4gICAgaWYgKHNlbGYuc3RhcnRQb2ludHMubGVuZ3RoID09PSAyICYmIGN1cnJlbnQudHlwZSA9PT0gXCJpbWFnZVwiICYmIChjdXJyZW50LmlzTG9hZGVkIHx8IGN1cnJlbnQuJGdob3N0KSkge1xyXG4gICAgICBzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG4gICAgICBzZWxmLmlzU3dpcGluZyA9IGZhbHNlO1xyXG4gICAgICBzZWxmLmlzUGFubmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgc2VsZi5pc1pvb21pbmcgPSB0cnVlO1xyXG5cclxuICAgICAgJC5mYW5jeWJveC5zdG9wKHNlbGYuJGNvbnRlbnQpO1xyXG5cclxuICAgICAgc2VsZi5jZW50ZXJQb2ludFN0YXJ0WCA9IChzZWxmLnN0YXJ0UG9pbnRzWzBdLnggKyBzZWxmLnN0YXJ0UG9pbnRzWzFdLngpICogMC41IC0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKTtcclxuICAgICAgc2VsZi5jZW50ZXJQb2ludFN0YXJ0WSA9IChzZWxmLnN0YXJ0UG9pbnRzWzBdLnkgKyBzZWxmLnN0YXJ0UG9pbnRzWzFdLnkpICogMC41IC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgc2VsZi5wZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFggPSAoc2VsZi5jZW50ZXJQb2ludFN0YXJ0WCAtIHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQpIC8gc2VsZi5jb250ZW50U3RhcnRQb3Mud2lkdGg7XHJcbiAgICAgIHNlbGYucGVyY2VudGFnZU9mSW1hZ2VBdFBpbmNoUG9pbnRZID0gKHNlbGYuY2VudGVyUG9pbnRTdGFydFkgLSBzZWxmLmNvbnRlbnRTdGFydFBvcy50b3ApIC8gc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0O1xyXG5cclxuICAgICAgc2VsZi5zdGFydERpc3RhbmNlQmV0d2VlbkZpbmdlcnMgPSBkaXN0YW5jZShzZWxmLnN0YXJ0UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzFdKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9uc2Nyb2xsID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuaXNTY3JvbGxpbmcgPSB0cnVlO1xyXG5cclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2VsZi5vbnNjcm9sbCwgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5vbnRvdWNobW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgdXNlciBoYXMgbm90IHJlbGVhc2VkIG92ZXIgaWZyYW1lIG9yIGRpc2FibGVkIGVsZW1lbnRcclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQuYnV0dG9ucyAhPT0gdW5kZWZpbmVkICYmIGUub3JpZ2luYWxFdmVudC5idXR0b25zID09PSAwKSB7XHJcbiAgICAgIHNlbGYub250b3VjaGVuZChlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxmLmlzU2Nyb2xsaW5nKSB7XHJcbiAgICAgIHNlbGYuY2FuVGFwID0gZmFsc2U7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLm5ld1BvaW50cyA9IGdldFBvaW50ZXJYWShlKTtcclxuXHJcbiAgICBpZiAoIShzZWxmLm9wdHMgfHwgc2VsZi5jYW5QYW4pIHx8ICFzZWxmLm5ld1BvaW50cy5sZW5ndGggfHwgIXNlbGYubmV3UG9pbnRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEoc2VsZi5pc1N3aXBpbmcgJiYgc2VsZi5pc1N3aXBpbmcgPT09IHRydWUpKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmRpc3RhbmNlWCA9IGRpc3RhbmNlKHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCBcInhcIik7XHJcbiAgICBzZWxmLmRpc3RhbmNlWSA9IGRpc3RhbmNlKHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCBcInlcIik7XHJcblxyXG4gICAgc2VsZi5kaXN0YW5jZSA9IGRpc3RhbmNlKHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdKTtcclxuXHJcbiAgICAvLyBTa2lwIGZhbHNlIG9udG91Y2htb3ZlIGV2ZW50cyAoQ2hyb21lKVxyXG4gICAgaWYgKHNlbGYuZGlzdGFuY2UgPiAwKSB7XHJcbiAgICAgIGlmIChzZWxmLmlzU3dpcGluZykge1xyXG4gICAgICAgIHNlbGYub25Td2lwZShlKTtcclxuICAgICAgfSBlbHNlIGlmIChzZWxmLmlzUGFubmluZykge1xyXG4gICAgICAgIHNlbGYub25QYW4oKTtcclxuICAgICAgfSBlbHNlIGlmIChzZWxmLmlzWm9vbWluZykge1xyXG4gICAgICAgIHNlbGYub25ab29tKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9uU3dpcGUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZSxcclxuICAgICAgc3dpcGluZyA9IHNlbGYuaXNTd2lwaW5nLFxyXG4gICAgICBsZWZ0ID0gc2VsZi5zbGlkZXJTdGFydFBvcy5sZWZ0IHx8IDAsXHJcbiAgICAgIGFuZ2xlO1xyXG5cclxuICAgIC8vIElmIGRpcmVjdGlvbiBpcyBub3QgeWV0IGRldGVybWluZWRcclxuICAgIGlmIChzd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgIC8vIFdlIG5lZWQgYXQgbGVhc3QgMTBweCBkaXN0YW5jZSB0byBjb3JyZWN0bHkgY2FsY3VsYXRlIGFuIGFuZ2xlXHJcbiAgICAgIGlmIChNYXRoLmFicyhzZWxmLmRpc3RhbmNlKSA+IDEwKSB7XHJcbiAgICAgICAgc2VsZi5jYW5UYXAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlLmdyb3VwLmxlbmd0aCA8IDIgJiYgc2VsZi5vcHRzLnZlcnRpY2FsKSB7XHJcbiAgICAgICAgICBzZWxmLmlzU3dpcGluZyA9IFwieVwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UuaXNEcmFnZ2luZyB8fCBzZWxmLm9wdHMudmVydGljYWwgPT09IGZhbHNlIHx8IChzZWxmLm9wdHMudmVydGljYWwgPT09IFwiYXV0b1wiICYmICQod2luZG93KS53aWR0aCgpID4gODAwKSkge1xyXG4gICAgICAgICAgc2VsZi5pc1N3aXBpbmcgPSBcInhcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYW5nbGUgPSBNYXRoLmFicygoTWF0aC5hdGFuMihzZWxmLmRpc3RhbmNlWSwgc2VsZi5kaXN0YW5jZVgpICogMTgwKSAvIE1hdGguUEkpO1xyXG5cclxuICAgICAgICAgIHNlbGYuaXNTd2lwaW5nID0gYW5nbGUgPiA0NSAmJiBhbmdsZSA8IDEzNSA/IFwieVwiIDogXCJ4XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5pc1N3aXBpbmcgPT09IFwieVwiICYmICQuZmFuY3lib3guaXNNb2JpbGUgJiYgc2VsZi5pc1Njcm9sbGFibGUpIHtcclxuICAgICAgICAgIHNlbGYuaXNTY3JvbGxpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlLmlzRHJhZ2dpbmcgPSBzZWxmLmlzU3dpcGluZztcclxuXHJcbiAgICAgICAgLy8gUmVzZXQgcG9pbnRzIHRvIGF2b2lkIGp1bXBpbmcsIGJlY2F1c2Ugd2UgZHJvcHBlZCBmaXJzdCBzd2lwZXMgdG8gY2FsY3VsYXRlIHRoZSBhbmdsZVxyXG4gICAgICAgIHNlbGYuc3RhcnRQb2ludHMgPSBzZWxmLm5ld1BvaW50cztcclxuXHJcbiAgICAgICAgJC5lYWNoKGluc3RhbmNlLnNsaWRlcywgZnVuY3Rpb24oaW5kZXgsIHNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgc2xpZGVQb3MsIHN0YWdlUG9zO1xyXG5cclxuICAgICAgICAgICQuZmFuY3lib3guc3RvcChzbGlkZS4kc2xpZGUpO1xyXG5cclxuICAgICAgICAgIHNsaWRlUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoc2xpZGUuJHNsaWRlKTtcclxuICAgICAgICAgIHN0YWdlUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoaW5zdGFuY2UuJHJlZnMuc3RhZ2UpO1xyXG5cclxuICAgICAgICAgIHNsaWRlLiRzbGlkZVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwiXCIsXHJcbiAgICAgICAgICAgICAgb3BhY2l0eTogXCJcIixcclxuICAgICAgICAgICAgICBcInRyYW5zaXRpb24tZHVyYXRpb25cIjogXCJcIlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1hbmltYXRlZFwiKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoZnVuY3Rpb24oaW5kZXgsIGNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAoY2xhc3NOYW1lLm1hdGNoKC8oXnxcXHMpZmFuY3lib3gtZngtXFxTKy9nKSB8fCBbXSkuam9pbihcIiBcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmIChzbGlkZS5wb3MgPT09IGluc3RhbmNlLmN1cnJlbnQucG9zKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2xpZGVyU3RhcnRQb3MudG9wID0gc2xpZGVQb3MudG9wIC0gc3RhZ2VQb3MudG9wO1xyXG4gICAgICAgICAgICBzZWxmLnNsaWRlclN0YXJ0UG9zLmxlZnQgPSBzbGlkZVBvcy5sZWZ0IC0gc3RhZ2VQb3MubGVmdDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZShzbGlkZS4kc2xpZGUsIHtcclxuICAgICAgICAgICAgdG9wOiBzbGlkZVBvcy50b3AgLSBzdGFnZVBvcy50b3AsXHJcbiAgICAgICAgICAgIGxlZnQ6IHNsaWRlUG9zLmxlZnQgLSBzdGFnZVBvcy5sZWZ0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gU3RvcCBzbGlkZXNob3dcclxuICAgICAgICBpZiAoaW5zdGFuY2UuU2xpZGVTaG93ICYmIGluc3RhbmNlLlNsaWRlU2hvdy5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgaW5zdGFuY2UuU2xpZGVTaG93LnN0b3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGlja3kgZWRnZXNcclxuICAgIGlmIChzd2lwaW5nID09IFwieFwiKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBzZWxmLmRpc3RhbmNlWCA+IDAgJiZcclxuICAgICAgICAoc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGggPCAyIHx8IChzZWxmLmluc3RhbmNlLmN1cnJlbnQuaW5kZXggPT09IDAgJiYgIXNlbGYuaW5zdGFuY2UuY3VycmVudC5vcHRzLmxvb3ApKVxyXG4gICAgICApIHtcclxuICAgICAgICBsZWZ0ID0gbGVmdCArIE1hdGgucG93KHNlbGYuZGlzdGFuY2VYLCAwLjgpO1xyXG4gICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgIHNlbGYuZGlzdGFuY2VYIDwgMCAmJlxyXG4gICAgICAgIChzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCA8IDIgfHxcclxuICAgICAgICAgIChzZWxmLmluc3RhbmNlLmN1cnJlbnQuaW5kZXggPT09IHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIC0gMSAmJiAhc2VsZi5pbnN0YW5jZS5jdXJyZW50Lm9wdHMubG9vcCkpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGxlZnQgPSBsZWZ0IC0gTWF0aC5wb3coLXNlbGYuZGlzdGFuY2VYLCAwLjgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxlZnQgPSBsZWZ0ICsgc2VsZi5kaXN0YW5jZVg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnNsaWRlckxhc3RQb3MgPSB7XHJcbiAgICAgIHRvcDogc3dpcGluZyA9PSBcInhcIiA/IDAgOiBzZWxmLnNsaWRlclN0YXJ0UG9zLnRvcCArIHNlbGYuZGlzdGFuY2VZLFxyXG4gICAgICBsZWZ0OiBsZWZ0XHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChzZWxmLnJlcXVlc3RJZCkge1xyXG4gICAgICBjYW5jZWxBRnJhbWUoc2VsZi5yZXF1ZXN0SWQpO1xyXG5cclxuICAgICAgc2VsZi5yZXF1ZXN0SWQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYucmVxdWVzdElkID0gcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHNlbGYuc2xpZGVyTGFzdFBvcykge1xyXG4gICAgICAgICQuZWFjaChzZWxmLmluc3RhbmNlLnNsaWRlcywgZnVuY3Rpb24oaW5kZXgsIHNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgcG9zID0gc2xpZGUucG9zIC0gc2VsZi5pbnN0YW5jZS5jdXJyUG9zO1xyXG5cclxuICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKHNsaWRlLiRzbGlkZSwge1xyXG4gICAgICAgICAgICB0b3A6IHNlbGYuc2xpZGVyTGFzdFBvcy50b3AsXHJcbiAgICAgICAgICAgIGxlZnQ6IHNlbGYuc2xpZGVyTGFzdFBvcy5sZWZ0ICsgcG9zICogc2VsZi5jYW52YXNXaWR0aCArIHBvcyAqIHNsaWRlLm9wdHMuZ3V0dGVyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKFwiZmFuY3lib3gtaXMtc2xpZGluZ1wiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5vblBhbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIFByZXZlbnQgYWNjaWRlbnRhbCBtb3ZlbWVudCAoc29tZXRpbWVzLCB3aGVuIHRhcHBpbmcgY2FzdWFsbHksIGZpbmdlciBjYW4gbW92ZSBhIGJpdClcclxuICAgIGlmIChkaXN0YW5jZShzZWxmLm5ld1BvaW50c1swXSwgc2VsZi5yZWFsUG9pbnRzWzBdKSA8ICgkLmZhbmN5Ym94LmlzTW9iaWxlID8gMTAgOiA1KSkge1xyXG4gICAgICBzZWxmLnN0YXJ0UG9pbnRzID0gc2VsZi5uZXdQb2ludHM7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG5cclxuICAgIHNlbGYuY29udGVudExhc3RQb3MgPSBzZWxmLmxpbWl0TW92ZW1lbnQoKTtcclxuXHJcbiAgICBpZiAoc2VsZi5yZXF1ZXN0SWQpIHtcclxuICAgICAgY2FuY2VsQUZyYW1lKHNlbGYucmVxdWVzdElkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnJlcXVlc3RJZCA9IHJlcXVlc3RBRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKHNlbGYuJGNvbnRlbnQsIHNlbGYuY29udGVudExhc3RQb3MpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gTWFrZSBwYW5uaW5nIHN0aWNreSB0byB0aGUgZWRnZXNcclxuICBHdWVzdHVyZXMucHJvdG90eXBlLmxpbWl0TW92ZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgY2FudmFzV2lkdGggPSBzZWxmLmNhbnZhc1dpZHRoO1xyXG4gICAgdmFyIGNhbnZhc0hlaWdodCA9IHNlbGYuY2FudmFzSGVpZ2h0O1xyXG5cclxuICAgIHZhciBkaXN0YW5jZVggPSBzZWxmLmRpc3RhbmNlWDtcclxuICAgIHZhciBkaXN0YW5jZVkgPSBzZWxmLmRpc3RhbmNlWTtcclxuXHJcbiAgICB2YXIgY29udGVudFN0YXJ0UG9zID0gc2VsZi5jb250ZW50U3RhcnRQb3M7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRPZmZzZXRYID0gY29udGVudFN0YXJ0UG9zLmxlZnQ7XHJcbiAgICB2YXIgY3VycmVudE9mZnNldFkgPSBjb250ZW50U3RhcnRQb3MudG9wO1xyXG5cclxuICAgIHZhciBjdXJyZW50V2lkdGggPSBjb250ZW50U3RhcnRQb3Mud2lkdGg7XHJcbiAgICB2YXIgY3VycmVudEhlaWdodCA9IGNvbnRlbnRTdGFydFBvcy5oZWlnaHQ7XHJcblxyXG4gICAgdmFyIG1pblRyYW5zbGF0ZVgsIG1pblRyYW5zbGF0ZVksIG1heFRyYW5zbGF0ZVgsIG1heFRyYW5zbGF0ZVksIG5ld09mZnNldFgsIG5ld09mZnNldFk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnRXaWR0aCA+IGNhbnZhc1dpZHRoKSB7XHJcbiAgICAgIG5ld09mZnNldFggPSBjdXJyZW50T2Zmc2V0WCArIGRpc3RhbmNlWDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld09mZnNldFggPSBjdXJyZW50T2Zmc2V0WDtcclxuICAgIH1cclxuXHJcbiAgICBuZXdPZmZzZXRZID0gY3VycmVudE9mZnNldFkgKyBkaXN0YW5jZVk7XHJcblxyXG4gICAgLy8gU2xvdyBkb3duIHByb3BvcnRpb25hbGx5IHRvIHRyYXZlbGVkIGRpc3RhbmNlXHJcbiAgICBtaW5UcmFuc2xhdGVYID0gTWF0aC5tYXgoMCwgY2FudmFzV2lkdGggKiAwLjUgLSBjdXJyZW50V2lkdGggKiAwLjUpO1xyXG4gICAgbWluVHJhbnNsYXRlWSA9IE1hdGgubWF4KDAsIGNhbnZhc0hlaWdodCAqIDAuNSAtIGN1cnJlbnRIZWlnaHQgKiAwLjUpO1xyXG5cclxuICAgIG1heFRyYW5zbGF0ZVggPSBNYXRoLm1pbihjYW52YXNXaWR0aCAtIGN1cnJlbnRXaWR0aCwgY2FudmFzV2lkdGggKiAwLjUgLSBjdXJyZW50V2lkdGggKiAwLjUpO1xyXG4gICAgbWF4VHJhbnNsYXRlWSA9IE1hdGgubWluKGNhbnZhc0hlaWdodCAtIGN1cnJlbnRIZWlnaHQsIGNhbnZhc0hlaWdodCAqIDAuNSAtIGN1cnJlbnRIZWlnaHQgKiAwLjUpO1xyXG5cclxuICAgIC8vICAgLT5cclxuICAgIGlmIChkaXN0YW5jZVggPiAwICYmIG5ld09mZnNldFggPiBtaW5UcmFuc2xhdGVYKSB7XHJcbiAgICAgIG5ld09mZnNldFggPSBtaW5UcmFuc2xhdGVYIC0gMSArIE1hdGgucG93KC1taW5UcmFuc2xhdGVYICsgY3VycmVudE9mZnNldFggKyBkaXN0YW5jZVgsIDAuOCkgfHwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgICA8LVxyXG4gICAgaWYgKGRpc3RhbmNlWCA8IDAgJiYgbmV3T2Zmc2V0WCA8IG1heFRyYW5zbGF0ZVgpIHtcclxuICAgICAgbmV3T2Zmc2V0WCA9IG1heFRyYW5zbGF0ZVggKyAxIC0gTWF0aC5wb3cobWF4VHJhbnNsYXRlWCAtIGN1cnJlbnRPZmZzZXRYIC0gZGlzdGFuY2VYLCAwLjgpIHx8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gICBcXC9cclxuICAgIGlmIChkaXN0YW5jZVkgPiAwICYmIG5ld09mZnNldFkgPiBtaW5UcmFuc2xhdGVZKSB7XHJcbiAgICAgIG5ld09mZnNldFkgPSBtaW5UcmFuc2xhdGVZIC0gMSArIE1hdGgucG93KC1taW5UcmFuc2xhdGVZICsgY3VycmVudE9mZnNldFkgKyBkaXN0YW5jZVksIDAuOCkgfHwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgIC9cXFxyXG4gICAgaWYgKGRpc3RhbmNlWSA8IDAgJiYgbmV3T2Zmc2V0WSA8IG1heFRyYW5zbGF0ZVkpIHtcclxuICAgICAgbmV3T2Zmc2V0WSA9IG1heFRyYW5zbGF0ZVkgKyAxIC0gTWF0aC5wb3cobWF4VHJhbnNsYXRlWSAtIGN1cnJlbnRPZmZzZXRZIC0gZGlzdGFuY2VZLCAwLjgpIHx8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG9wOiBuZXdPZmZzZXRZLFxyXG4gICAgICBsZWZ0OiBuZXdPZmZzZXRYXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUubGltaXRQb3NpdGlvbiA9IGZ1bmN0aW9uKG5ld09mZnNldFgsIG5ld09mZnNldFksIG5ld1dpZHRoLCBuZXdIZWlnaHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgY2FudmFzV2lkdGggPSBzZWxmLmNhbnZhc1dpZHRoO1xyXG4gICAgdmFyIGNhbnZhc0hlaWdodCA9IHNlbGYuY2FudmFzSGVpZ2h0O1xyXG5cclxuICAgIGlmIChuZXdXaWR0aCA+IGNhbnZhc1dpZHRoKSB7XHJcbiAgICAgIG5ld09mZnNldFggPSBuZXdPZmZzZXRYID4gMCA/IDAgOiBuZXdPZmZzZXRYO1xyXG4gICAgICBuZXdPZmZzZXRYID0gbmV3T2Zmc2V0WCA8IGNhbnZhc1dpZHRoIC0gbmV3V2lkdGggPyBjYW52YXNXaWR0aCAtIG5ld1dpZHRoIDogbmV3T2Zmc2V0WDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIENlbnRlciBob3Jpem9udGFsbHlcclxuICAgICAgbmV3T2Zmc2V0WCA9IE1hdGgubWF4KDAsIGNhbnZhc1dpZHRoIC8gMiAtIG5ld1dpZHRoIC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5ld0hlaWdodCA+IGNhbnZhc0hlaWdodCkge1xyXG4gICAgICBuZXdPZmZzZXRZID0gbmV3T2Zmc2V0WSA+IDAgPyAwIDogbmV3T2Zmc2V0WTtcclxuICAgICAgbmV3T2Zmc2V0WSA9IG5ld09mZnNldFkgPCBjYW52YXNIZWlnaHQgLSBuZXdIZWlnaHQgPyBjYW52YXNIZWlnaHQgLSBuZXdIZWlnaHQgOiBuZXdPZmZzZXRZO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQ2VudGVyIHZlcnRpY2FsbHlcclxuICAgICAgbmV3T2Zmc2V0WSA9IE1hdGgubWF4KDAsIGNhbnZhc0hlaWdodCAvIDIgLSBuZXdIZWlnaHQgLyAyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3A6IG5ld09mZnNldFksXHJcbiAgICAgIGxlZnQ6IG5ld09mZnNldFhcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5vblpvb20gPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgY3VycmVudCBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cyB0byBnZXQgcGluY2ggcmF0aW8gYW5kIG5ldyB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICB2YXIgY29udGVudFN0YXJ0UG9zID0gc2VsZi5jb250ZW50U3RhcnRQb3M7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRXaWR0aCA9IGNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuICAgIHZhciBjdXJyZW50SGVpZ2h0ID0gY29udGVudFN0YXJ0UG9zLmhlaWdodDtcclxuXHJcbiAgICB2YXIgY3VycmVudE9mZnNldFggPSBjb250ZW50U3RhcnRQb3MubGVmdDtcclxuICAgIHZhciBjdXJyZW50T2Zmc2V0WSA9IGNvbnRlbnRTdGFydFBvcy50b3A7XHJcblxyXG4gICAgdmFyIGVuZERpc3RhbmNlQmV0d2VlbkZpbmdlcnMgPSBkaXN0YW5jZShzZWxmLm5ld1BvaW50c1swXSwgc2VsZi5uZXdQb2ludHNbMV0pO1xyXG5cclxuICAgIHZhciBwaW5jaFJhdGlvID0gZW5kRGlzdGFuY2VCZXR3ZWVuRmluZ2VycyAvIHNlbGYuc3RhcnREaXN0YW5jZUJldHdlZW5GaW5nZXJzO1xyXG5cclxuICAgIHZhciBuZXdXaWR0aCA9IE1hdGguZmxvb3IoY3VycmVudFdpZHRoICogcGluY2hSYXRpbyk7XHJcbiAgICB2YXIgbmV3SGVpZ2h0ID0gTWF0aC5mbG9vcihjdXJyZW50SGVpZ2h0ICogcGluY2hSYXRpbyk7XHJcblxyXG4gICAgLy8gVGhpcyBpcyB0aGUgdHJhbnNsYXRpb24gZHVlIHRvIHBpbmNoLXpvb21pbmdcclxuICAgIHZhciB0cmFuc2xhdGVGcm9tWm9vbWluZ1ggPSAoY3VycmVudFdpZHRoIC0gbmV3V2lkdGgpICogc2VsZi5wZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFg7XHJcbiAgICB2YXIgdHJhbnNsYXRlRnJvbVpvb21pbmdZID0gKGN1cnJlbnRIZWlnaHQgLSBuZXdIZWlnaHQpICogc2VsZi5wZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFk7XHJcblxyXG4gICAgLy8gUG9pbnQgYmV0d2VlbiB0aGUgdHdvIHRvdWNoZXNcclxuICAgIHZhciBjZW50ZXJQb2ludEVuZFggPSAoc2VsZi5uZXdQb2ludHNbMF0ueCArIHNlbGYubmV3UG9pbnRzWzFdLngpIC8gMiAtICQod2luZG93KS5zY3JvbGxMZWZ0KCk7XHJcbiAgICB2YXIgY2VudGVyUG9pbnRFbmRZID0gKHNlbGYubmV3UG9pbnRzWzBdLnkgKyBzZWxmLm5ld1BvaW50c1sxXS55KSAvIDIgLSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgLy8gQW5kIHRoaXMgaXMgdGhlIHRyYW5zbGF0aW9uIGR1ZSB0byB0cmFuc2xhdGlvbiBvZiB0aGUgY2VudGVycG9pbnRcclxuICAgIC8vIGJldHdlZW4gdGhlIHR3byBmaW5nZXJzXHJcbiAgICB2YXIgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWCA9IGNlbnRlclBvaW50RW5kWCAtIHNlbGYuY2VudGVyUG9pbnRTdGFydFg7XHJcbiAgICB2YXIgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWSA9IGNlbnRlclBvaW50RW5kWSAtIHNlbGYuY2VudGVyUG9pbnRTdGFydFk7XHJcblxyXG4gICAgLy8gVGhlIG5ldyBvZmZzZXQgaXMgdGhlIG9sZC9jdXJyZW50IG9uZSBwbHVzIHRoZSB0b3RhbCB0cmFuc2xhdGlvblxyXG4gICAgdmFyIG5ld09mZnNldFggPSBjdXJyZW50T2Zmc2V0WCArICh0cmFuc2xhdGVGcm9tWm9vbWluZ1ggKyB0cmFuc2xhdGVGcm9tVHJhbnNsYXRpbmdYKTtcclxuICAgIHZhciBuZXdPZmZzZXRZID0gY3VycmVudE9mZnNldFkgKyAodHJhbnNsYXRlRnJvbVpvb21pbmdZICsgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWSk7XHJcblxyXG4gICAgdmFyIG5ld1BvcyA9IHtcclxuICAgICAgdG9wOiBuZXdPZmZzZXRZLFxyXG4gICAgICBsZWZ0OiBuZXdPZmZzZXRYLFxyXG4gICAgICBzY2FsZVg6IHBpbmNoUmF0aW8sXHJcbiAgICAgIHNjYWxlWTogcGluY2hSYXRpb1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG5cclxuICAgIHNlbGYubmV3V2lkdGggPSBuZXdXaWR0aDtcclxuICAgIHNlbGYubmV3SGVpZ2h0ID0gbmV3SGVpZ2h0O1xyXG5cclxuICAgIHNlbGYuY29udGVudExhc3RQb3MgPSBuZXdQb3M7XHJcblxyXG4gICAgaWYgKHNlbGYucmVxdWVzdElkKSB7XHJcbiAgICAgIGNhbmNlbEFGcmFtZShzZWxmLnJlcXVlc3RJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5yZXF1ZXN0SWQgPSByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG4gICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZShzZWxmLiRjb250ZW50LCBzZWxmLmNvbnRlbnRMYXN0UG9zKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUub250b3VjaGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgc3dpcGluZyA9IHNlbGYuaXNTd2lwaW5nO1xyXG4gICAgdmFyIHBhbm5pbmcgPSBzZWxmLmlzUGFubmluZztcclxuICAgIHZhciB6b29taW5nID0gc2VsZi5pc1pvb21pbmc7XHJcbiAgICB2YXIgc2Nyb2xsaW5nID0gc2VsZi5pc1Njcm9sbGluZztcclxuXHJcbiAgICBzZWxmLmVuZFBvaW50cyA9IGdldFBvaW50ZXJYWShlKTtcclxuICAgIHNlbGYuZE1zID0gTWF0aC5tYXgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzZWxmLnN0YXJ0VGltZSwgMSk7XHJcblxyXG4gICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtZ3JhYmJpbmdcIik7XHJcblxyXG4gICAgJChkb2N1bWVudCkub2ZmKFwiLmZiLnRvdWNoXCIpO1xyXG5cclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2VsZi5vbnNjcm9sbCwgdHJ1ZSk7XHJcblxyXG4gICAgaWYgKHNlbGYucmVxdWVzdElkKSB7XHJcbiAgICAgIGNhbmNlbEFGcmFtZShzZWxmLnJlcXVlc3RJZCk7XHJcblxyXG4gICAgICBzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5pc1N3aXBpbmcgPSBmYWxzZTtcclxuICAgIHNlbGYuaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgICBzZWxmLmlzWm9vbWluZyA9IGZhbHNlO1xyXG4gICAgc2VsZi5pc1Njcm9sbGluZyA9IGZhbHNlO1xyXG5cclxuICAgIHNlbGYuaW5zdGFuY2UuaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG5cclxuICAgIGlmIChzZWxmLmNhblRhcCkge1xyXG4gICAgICByZXR1cm4gc2VsZi5vblRhcChlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnNwZWVkID0gMTAwO1xyXG5cclxuICAgIC8vIFNwZWVkIGluIHB4L21zXHJcbiAgICBzZWxmLnZlbG9jaXR5WCA9IChzZWxmLmRpc3RhbmNlWCAvIHNlbGYuZE1zKSAqIDAuNTtcclxuICAgIHNlbGYudmVsb2NpdHlZID0gKHNlbGYuZGlzdGFuY2VZIC8gc2VsZi5kTXMpICogMC41O1xyXG5cclxuICAgIGlmIChwYW5uaW5nKSB7XHJcbiAgICAgIHNlbGYuZW5kUGFubmluZygpO1xyXG4gICAgfSBlbHNlIGlmICh6b29taW5nKSB7XHJcbiAgICAgIHNlbGYuZW5kWm9vbWluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5lbmRTd2lwaW5nKHN3aXBpbmcsIHNjcm9sbGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUuZW5kU3dpcGluZyA9IGZ1bmN0aW9uKHN3aXBpbmcsIHNjcm9sbGluZykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICByZXQgPSBmYWxzZSxcclxuICAgICAgbGVuID0gc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGgsXHJcbiAgICAgIGRpc3RhbmNlWCA9IE1hdGguYWJzKHNlbGYuZGlzdGFuY2VYKSxcclxuICAgICAgY2FuQWR2YW5jZSA9IHN3aXBpbmcgPT0gXCJ4XCIgJiYgbGVuID4gMSAmJiAoKHNlbGYuZE1zID4gMTMwICYmIGRpc3RhbmNlWCA+IDEwKSB8fCBkaXN0YW5jZVggPiA1MCksXHJcbiAgICAgIHNwZWVkWCA9IDMwMDtcclxuXHJcbiAgICBzZWxmLnNsaWRlckxhc3RQb3MgPSBudWxsO1xyXG5cclxuICAgIC8vIENsb3NlIGlmIHN3aXBlZCB2ZXJ0aWNhbGx5IC8gbmF2aWdhdGUgaWYgaG9yaXpvbnRhbGx5XHJcbiAgICBpZiAoc3dpcGluZyA9PSBcInlcIiAmJiAhc2Nyb2xsaW5nICYmIE1hdGguYWJzKHNlbGYuZGlzdGFuY2VZKSA+IDUwKSB7XHJcbiAgICAgIC8vIENvbnRpbnVlIHZlcnRpY2FsIG1vdmVtZW50XHJcbiAgICAgICQuZmFuY3lib3guYW5pbWF0ZShcclxuICAgICAgICBzZWxmLmluc3RhbmNlLmN1cnJlbnQuJHNsaWRlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRvcDogc2VsZi5zbGlkZXJTdGFydFBvcy50b3AgKyBzZWxmLmRpc3RhbmNlWSArIHNlbGYudmVsb2NpdHlZICogMTUwLFxyXG4gICAgICAgICAgb3BhY2l0eTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgMjAwXHJcbiAgICAgICk7XHJcbiAgICAgIHJldCA9IHNlbGYuaW5zdGFuY2UuY2xvc2UodHJ1ZSwgMjUwKTtcclxuICAgIH0gZWxzZSBpZiAoY2FuQWR2YW5jZSAmJiBzZWxmLmRpc3RhbmNlWCA+IDApIHtcclxuICAgICAgcmV0ID0gc2VsZi5pbnN0YW5jZS5wcmV2aW91cyhzcGVlZFgpO1xyXG4gICAgfSBlbHNlIGlmIChjYW5BZHZhbmNlICYmIHNlbGYuZGlzdGFuY2VYIDwgMCkge1xyXG4gICAgICByZXQgPSBzZWxmLmluc3RhbmNlLm5leHQoc3BlZWRYKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmV0ID09PSBmYWxzZSAmJiAoc3dpcGluZyA9PSBcInhcIiB8fCBzd2lwaW5nID09IFwieVwiKSkge1xyXG4gICAgICBzZWxmLmluc3RhbmNlLmNlbnRlclNsaWRlKDIwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtc2xpZGluZ1wiKTtcclxuICB9O1xyXG5cclxuICAvLyBMaW1pdCBwYW5uaW5nIGZyb20gZWRnZXNcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLmVuZFBhbm5pbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgbmV3T2Zmc2V0WCxcclxuICAgICAgbmV3T2Zmc2V0WSxcclxuICAgICAgbmV3UG9zO1xyXG5cclxuICAgIGlmICghc2VsZi5jb250ZW50TGFzdFBvcykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYub3B0cy5tb21lbnR1bSA9PT0gZmFsc2UgfHwgc2VsZi5kTXMgPiAzNTApIHtcclxuICAgICAgbmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudExhc3RQb3MubGVmdDtcclxuICAgICAgbmV3T2Zmc2V0WSA9IHNlbGYuY29udGVudExhc3RQb3MudG9wO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQ29udGludWUgbW92ZW1lbnRcclxuICAgICAgbmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudExhc3RQb3MubGVmdCArIHNlbGYudmVsb2NpdHlYICogNTAwO1xyXG4gICAgICBuZXdPZmZzZXRZID0gc2VsZi5jb250ZW50TGFzdFBvcy50b3AgKyBzZWxmLnZlbG9jaXR5WSAqIDUwMDtcclxuICAgIH1cclxuXHJcbiAgICBuZXdQb3MgPSBzZWxmLmxpbWl0UG9zaXRpb24obmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgc2VsZi5jb250ZW50U3RhcnRQb3Mud2lkdGgsIHNlbGYuY29udGVudFN0YXJ0UG9zLmhlaWdodCk7XHJcblxyXG4gICAgbmV3UG9zLndpZHRoID0gc2VsZi5jb250ZW50U3RhcnRQb3Mud2lkdGg7XHJcbiAgICBuZXdQb3MuaGVpZ2h0ID0gc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0O1xyXG5cclxuICAgICQuZmFuY3lib3guYW5pbWF0ZShzZWxmLiRjb250ZW50LCBuZXdQb3MsIDM2Nik7XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5lbmRab29taW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGN1cnJlbnQgPSBzZWxmLmluc3RhbmNlLmN1cnJlbnQ7XHJcblxyXG4gICAgdmFyIG5ld09mZnNldFgsIG5ld09mZnNldFksIG5ld1BvcywgcmVzZXQ7XHJcblxyXG4gICAgdmFyIG5ld1dpZHRoID0gc2VsZi5uZXdXaWR0aDtcclxuICAgIHZhciBuZXdIZWlnaHQgPSBzZWxmLm5ld0hlaWdodDtcclxuXHJcbiAgICBpZiAoIXNlbGYuY29udGVudExhc3RQb3MpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld09mZnNldFggPSBzZWxmLmNvbnRlbnRMYXN0UG9zLmxlZnQ7XHJcbiAgICBuZXdPZmZzZXRZID0gc2VsZi5jb250ZW50TGFzdFBvcy50b3A7XHJcblxyXG4gICAgcmVzZXQgPSB7XHJcbiAgICAgIHRvcDogbmV3T2Zmc2V0WSxcclxuICAgICAgbGVmdDogbmV3T2Zmc2V0WCxcclxuICAgICAgd2lkdGg6IG5ld1dpZHRoLFxyXG4gICAgICBoZWlnaHQ6IG5ld0hlaWdodCxcclxuICAgICAgc2NhbGVYOiAxLFxyXG4gICAgICBzY2FsZVk6IDFcclxuICAgIH07XHJcblxyXG4gICAgLy8gUmVzZXQgc2NhbGV4L3NjYWxlWSB2YWx1ZXM7IHRoaXMgaGVscHMgZm9yIHBlcmZvbWFuY2UgYW5kIGRvZXMgbm90IGJyZWFrIGFuaW1hdGlvblxyXG4gICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoc2VsZi4kY29udGVudCwgcmVzZXQpO1xyXG5cclxuICAgIGlmIChuZXdXaWR0aCA8IHNlbGYuY2FudmFzV2lkdGggJiYgbmV3SGVpZ2h0IDwgc2VsZi5jYW52YXNIZWlnaHQpIHtcclxuICAgICAgc2VsZi5pbnN0YW5jZS5zY2FsZVRvRml0KDE1MCk7XHJcbiAgICB9IGVsc2UgaWYgKG5ld1dpZHRoID4gY3VycmVudC53aWR0aCB8fCBuZXdIZWlnaHQgPiBjdXJyZW50LmhlaWdodCkge1xyXG4gICAgICBzZWxmLmluc3RhbmNlLnNjYWxlVG9BY3R1YWwoc2VsZi5jZW50ZXJQb2ludFN0YXJ0WCwgc2VsZi5jZW50ZXJQb2ludFN0YXJ0WSwgMTUwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld1BvcyA9IHNlbGYubGltaXRQb3NpdGlvbihuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcclxuXHJcbiAgICAgICQuZmFuY3lib3guYW5pbWF0ZShzZWxmLiRjb250ZW50LCBuZXdQb3MsIDE1MCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5vblRhcCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcblxyXG4gICAgdmFyIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZTtcclxuICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UuY3VycmVudDtcclxuXHJcbiAgICB2YXIgZW5kUG9pbnRzID0gKGUgJiYgZ2V0UG9pbnRlclhZKGUpKSB8fCBzZWxmLnN0YXJ0UG9pbnRzO1xyXG5cclxuICAgIHZhciB0YXBYID0gZW5kUG9pbnRzWzBdID8gZW5kUG9pbnRzWzBdLnggLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpIC0gc2VsZi5zdGFnZVBvcy5sZWZ0IDogMDtcclxuICAgIHZhciB0YXBZID0gZW5kUG9pbnRzWzBdID8gZW5kUG9pbnRzWzBdLnkgLSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgLSBzZWxmLnN0YWdlUG9zLnRvcCA6IDA7XHJcblxyXG4gICAgdmFyIHdoZXJlO1xyXG5cclxuICAgIHZhciBwcm9jZXNzID0gZnVuY3Rpb24ocHJlZml4KSB7XHJcbiAgICAgIHZhciBhY3Rpb24gPSBjdXJyZW50Lm9wdHNbcHJlZml4XTtcclxuXHJcbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oYWN0aW9uKSkge1xyXG4gICAgICAgIGFjdGlvbiA9IGFjdGlvbi5hcHBseShpbnN0YW5jZSwgW2N1cnJlbnQsIGVdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFhY3Rpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcImNsb3NlXCI6XHJcbiAgICAgICAgICBpbnN0YW5jZS5jbG9zZShzZWxmLnN0YXJ0RXZlbnQpO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwidG9nZ2xlQ29udHJvbHNcIjpcclxuICAgICAgICAgIGluc3RhbmNlLnRvZ2dsZUNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJuZXh0XCI6XHJcbiAgICAgICAgICBpbnN0YW5jZS5uZXh0KCk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJuZXh0T3JDbG9zZVwiOlxyXG4gICAgICAgICAgaWYgKGluc3RhbmNlLmdyb3VwLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UubmV4dCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UuY2xvc2Uoc2VsZi5zdGFydEV2ZW50KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcInpvb21cIjpcclxuICAgICAgICAgIGlmIChjdXJyZW50LnR5cGUgPT0gXCJpbWFnZVwiICYmIChjdXJyZW50LmlzTG9hZGVkIHx8IGN1cnJlbnQuJGdob3N0KSkge1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2UuY2FuUGFuKCkpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5zY2FsZVRvRml0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UuaXNTY2FsZWREb3duKCkpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5zY2FsZVRvQWN0dWFsKHRhcFgsIHRhcFkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlLmdyb3VwLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5jbG9zZShzZWxmLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSWdub3JlIHJpZ2h0IGNsaWNrXHJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5idXR0b24gPT0gMikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2tpcCBpZiBjbGlja2VkIG9uIHRoZSBzY3JvbGxiYXJcclxuICAgIGlmICghJHRhcmdldC5pcyhcImltZ1wiKSAmJiB0YXBYID4gJHRhcmdldFswXS5jbGllbnRXaWR0aCArICR0YXJnZXQub2Zmc2V0KCkubGVmdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgd2hlcmUgaXMgY2xpY2tlZFxyXG4gICAgaWYgKCR0YXJnZXQuaXMoXCIuZmFuY3lib3gtYmcsLmZhbmN5Ym94LWlubmVyLC5mYW5jeWJveC1vdXRlciwuZmFuY3lib3gtY29udGFpbmVyXCIpKSB7XHJcbiAgICAgIHdoZXJlID0gXCJPdXRzaWRlXCI7XHJcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaXMoXCIuZmFuY3lib3gtc2xpZGVcIikpIHtcclxuICAgICAgd2hlcmUgPSBcIlNsaWRlXCI7XHJcbiAgICB9IGVsc2UgaWYgKFxyXG4gICAgICBpbnN0YW5jZS5jdXJyZW50LiRjb250ZW50ICYmXHJcbiAgICAgIGluc3RhbmNlLmN1cnJlbnQuJGNvbnRlbnRcclxuICAgICAgICAuZmluZCgkdGFyZ2V0KVxyXG4gICAgICAgIC5hZGRCYWNrKClcclxuICAgICAgICAuZmlsdGVyKCR0YXJnZXQpLmxlbmd0aFxyXG4gICAgKSB7XHJcbiAgICAgIHdoZXJlID0gXCJDb250ZW50XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIGRvdWJsZSB0YXBcclxuICAgIGlmIChzZWxmLnRhcHBlZCkge1xyXG4gICAgICAvLyBTdG9wIHByZXZpb3VzbHkgY3JlYXRlZCBzaW5nbGUgdGFwXHJcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLnRhcHBlZCk7XHJcbiAgICAgIHNlbGYudGFwcGVkID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIFNraXAgaWYgZGlzdGFuY2UgYmV0d2VlbiB0YXBzIGlzIHRvbyBiaWdcclxuICAgICAgaWYgKE1hdGguYWJzKHRhcFggLSBzZWxmLnRhcFgpID4gNTAgfHwgTWF0aC5hYnModGFwWSAtIHNlbGYudGFwWSkgPiA1MCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBPSywgbm93IHdlIGFzc3VtZSB0aGF0IHRoaXMgaXMgYSBkb3VibGUtdGFwXHJcbiAgICAgIHByb2Nlc3MoXCJkYmxjbGlja1wiICsgd2hlcmUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gU2luZ2xlIHRhcCB3aWxsIGJlIHByb2Nlc3NlZCBpZiB1c2VyIGhhcyBub3QgY2xpY2tlZCBzZWNvbmQgdGltZSB3aXRoaW4gMzAwbXNcclxuICAgICAgLy8gb3IgdGhlcmUgaXMgbm8gbmVlZCB0byB3YWl0IGZvciBkb3VibGUtdGFwXHJcbiAgICAgIHNlbGYudGFwWCA9IHRhcFg7XHJcbiAgICAgIHNlbGYudGFwWSA9IHRhcFk7XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5vcHRzW1wiZGJsY2xpY2tcIiArIHdoZXJlXSAmJiBjdXJyZW50Lm9wdHNbXCJkYmxjbGlja1wiICsgd2hlcmVdICE9PSBjdXJyZW50Lm9wdHNbXCJjbGlja1wiICsgd2hlcmVdKSB7XHJcbiAgICAgICAgc2VsZi50YXBwZWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi50YXBwZWQgPSBudWxsO1xyXG5cclxuICAgICAgICAgIGlmICghaW5zdGFuY2UuaXNBbmltYXRpbmcpIHtcclxuICAgICAgICAgICAgcHJvY2VzcyhcImNsaWNrXCIgKyB3aGVyZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcm9jZXNzKFwiY2xpY2tcIiArIHdoZXJlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gICQoZG9jdW1lbnQpXHJcbiAgICAub24oXCJvbkFjdGl2YXRlLmZiXCIsIGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcbiAgICAgIGlmIChpbnN0YW5jZSAmJiAhaW5zdGFuY2UuR3Vlc3R1cmVzKSB7XHJcbiAgICAgICAgaW5zdGFuY2UuR3Vlc3R1cmVzID0gbmV3IEd1ZXN0dXJlcyhpbnN0YW5jZSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAub24oXCJiZWZvcmVDbG9zZS5mYlwiLCBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuR3Vlc3R1cmVzKSB7XHJcbiAgICAgICAgaW5zdGFuY2UuR3Vlc3R1cmVzLmRlc3Ryb3koKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbn0pKHdpbmRvdywgZG9jdW1lbnQsIGpRdWVyeSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gU2xpZGVTaG93XHJcbi8vIEVuYWJsZXMgc2xpZGVzaG93IGZ1bmN0aW9uYWxpdHlcclxuLy9cclxuLy8gRXhhbXBsZSBvZiB1c2FnZTpcclxuLy8gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpLlNsaWRlU2hvdy5zdGFydCgpXHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbihmdW5jdGlvbihkb2N1bWVudCwgJCkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAkLmV4dGVuZCh0cnVlLCAkLmZhbmN5Ym94LmRlZmF1bHRzLCB7XHJcbiAgICBidG5UcGw6IHtcclxuICAgICAgc2xpZGVTaG93OlxyXG4gICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtcGxheSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXBsYXlcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+JyArXHJcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTYuNSA1LjR2MTMuMmwxMS02LjZ6XCIvPjwvc3ZnPicgK1xyXG4gICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk04LjMzIDUuNzVoMi4ydjEyLjVoLTIuMlY1Ljc1em01LjE1IDBoMi4ydjEyLjVoLTIuMlY1Ljc1elwiLz48L3N2Zz4nICtcclxuICAgICAgICBcIjwvYnV0dG9uPlwiXHJcbiAgICB9LFxyXG4gICAgc2xpZGVTaG93OiB7XHJcbiAgICAgIGF1dG9TdGFydDogZmFsc2UsXHJcbiAgICAgIHNwZWVkOiAzMDAwLFxyXG4gICAgICBwcm9ncmVzczogdHJ1ZVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgU2xpZGVTaG93ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH07XHJcblxyXG4gICQuZXh0ZW5kKFNsaWRlU2hvdy5wcm90b3R5cGUsIHtcclxuICAgIHRpbWVyOiBudWxsLFxyXG4gICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgJGJ1dHRvbjogbnVsbCxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZSxcclxuICAgICAgICBvcHRzID0gaW5zdGFuY2UuZ3JvdXBbaW5zdGFuY2UuY3VyckluZGV4XS5vcHRzLnNsaWRlU2hvdztcclxuXHJcbiAgICAgIHNlbGYuJGJ1dHRvbiA9IGluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZChcIltkYXRhLWZhbmN5Ym94LXBsYXldXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi50b2dnbGUoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCAhb3B0cykge1xyXG4gICAgICAgIHNlbGYuJGJ1dHRvbi5oaWRlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAob3B0cy5wcm9ncmVzcykge1xyXG4gICAgICAgIHNlbGYuJHByb2dyZXNzID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXByb2dyZXNzXCI+PC9kaXY+JykuYXBwZW5kVG8oaW5zdGFuY2UuJHJlZnMuaW5uZXIpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldDogZnVuY3Rpb24oZm9yY2UpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZSxcclxuICAgICAgICBjdXJyZW50ID0gaW5zdGFuY2UuY3VycmVudDtcclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIHJlYWNoZWQgbGFzdCBlbGVtZW50XHJcbiAgICAgIGlmIChjdXJyZW50ICYmIChmb3JjZSA9PT0gdHJ1ZSB8fCBjdXJyZW50Lm9wdHMubG9vcCB8fCBpbnN0YW5jZS5jdXJySW5kZXggPCBpbnN0YW5jZS5ncm91cC5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgIGlmIChzZWxmLmlzQWN0aXZlICYmIGN1cnJlbnQuY29udGVudFR5cGUgIT09IFwidmlkZW9cIikge1xyXG4gICAgICAgICAgaWYgKHNlbGYuJHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZShzZWxmLiRwcm9ncmVzcy5zaG93KCksIHtzY2FsZVg6IDF9LCBjdXJyZW50Lm9wdHMuc2xpZGVTaG93LnNwZWVkKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZWxmLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5jdXJyZW50Lm9wdHMubG9vcCAmJiBpbnN0YW5jZS5jdXJyZW50LmluZGV4ID09IGluc3RhbmNlLmdyb3VwLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5qdW1wVG8oMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaW5zdGFuY2UubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCBjdXJyZW50Lm9wdHMuc2xpZGVTaG93LnNwZWVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5zdG9wKCk7XHJcbiAgICAgICAgaW5zdGFuY2UuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuICAgICAgICBpbnN0YW5jZS5zaG93Q29udHJvbHMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVyKTtcclxuXHJcbiAgICAgIHNlbGYudGltZXIgPSBudWxsO1xyXG5cclxuICAgICAgaWYgKHNlbGYuJHByb2dyZXNzKSB7XHJcbiAgICAgICAgc2VsZi4kcHJvZ3Jlc3MucmVtb3ZlQXR0cihcInN0eWxlXCIpLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5pbnN0YW5jZS5jdXJyZW50O1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnQpIHtcclxuICAgICAgICBzZWxmLiRidXR0b25cclxuICAgICAgICAgIC5hdHRyKFwidGl0bGVcIiwgKGN1cnJlbnQub3B0cy5pMThuW2N1cnJlbnQub3B0cy5sYW5nXSB8fCBjdXJyZW50Lm9wdHMuaTE4bi5lbikuUExBWV9TVE9QKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtYnV0dG9uLS1wbGF5XCIpXHJcbiAgICAgICAgICAuYWRkQ2xhc3MoXCJmYW5jeWJveC1idXR0b24tLXBhdXNlXCIpO1xyXG5cclxuICAgICAgICBzZWxmLmlzQWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnQuaXNDb21wbGV0ZSkge1xyXG4gICAgICAgICAgc2VsZi5zZXQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLmluc3RhbmNlLnRyaWdnZXIoXCJvblNsaWRlU2hvd0NoYW5nZVwiLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzZWxmLmluc3RhbmNlLmN1cnJlbnQ7XHJcblxyXG4gICAgICBzZWxmLmNsZWFyKCk7XHJcblxyXG4gICAgICBzZWxmLiRidXR0b25cclxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIChjdXJyZW50Lm9wdHMuaTE4bltjdXJyZW50Lm9wdHMubGFuZ10gfHwgY3VycmVudC5vcHRzLmkxOG4uZW4pLlBMQVlfU1RBUlQpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtYnV0dG9uLS1wYXVzZVwiKVxyXG4gICAgICAgIC5hZGRDbGFzcyhcImZhbmN5Ym94LWJ1dHRvbi0tcGxheVwiKTtcclxuXHJcbiAgICAgIHNlbGYuaXNBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgIHNlbGYuaW5zdGFuY2UudHJpZ2dlcihcIm9uU2xpZGVTaG93Q2hhbmdlXCIsIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChzZWxmLiRwcm9ncmVzcykge1xyXG4gICAgICAgIHNlbGYuJHByb2dyZXNzLnJlbW92ZUF0dHIoXCJzdHlsZVwiKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNBY3RpdmUpIHtcclxuICAgICAgICBzZWxmLnN0b3AoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmLnN0YXJ0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChkb2N1bWVudCkub24oe1xyXG4gICAgXCJvbkluaXQuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuICAgICAgaWYgKGluc3RhbmNlICYmICFpbnN0YW5jZS5TbGlkZVNob3cpIHtcclxuICAgICAgICBpbnN0YW5jZS5TbGlkZVNob3cgPSBuZXcgU2xpZGVTaG93KGluc3RhbmNlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImJlZm9yZVNob3cuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGZpcnN0UnVuKSB7XHJcbiAgICAgIHZhciBTbGlkZVNob3cgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5TbGlkZVNob3c7XHJcblxyXG4gICAgICBpZiAoZmlyc3RSdW4pIHtcclxuICAgICAgICBpZiAoU2xpZGVTaG93ICYmIGN1cnJlbnQub3B0cy5zbGlkZVNob3cuYXV0b1N0YXJ0KSB7XHJcbiAgICAgICAgICBTbGlkZVNob3cuc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoU2xpZGVTaG93ICYmIFNsaWRlU2hvdy5pc0FjdGl2ZSkge1xyXG4gICAgICAgIFNsaWRlU2hvdy5jbGVhcigpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFwiYWZ0ZXJTaG93LmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50KSB7XHJcbiAgICAgIHZhciBTbGlkZVNob3cgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5TbGlkZVNob3c7XHJcblxyXG4gICAgICBpZiAoU2xpZGVTaG93ICYmIFNsaWRlU2hvdy5pc0FjdGl2ZSkge1xyXG4gICAgICAgIFNsaWRlU2hvdy5zZXQoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImFmdGVyS2V5ZG93bi5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCwga2V5cHJlc3MsIGtleWNvZGUpIHtcclxuICAgICAgdmFyIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcbiAgICAgIC8vIFwiUFwiIG9yIFNwYWNlYmFyXHJcbiAgICAgIGlmIChTbGlkZVNob3cgJiYgY3VycmVudC5vcHRzLnNsaWRlU2hvdyAmJiAoa2V5Y29kZSA9PT0gODAgfHwga2V5Y29kZSA9PT0gMzIpICYmICEkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmlzKFwiYnV0dG9uLGEsaW5wdXRcIikpIHtcclxuICAgICAgICBrZXlwcmVzcy5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBTbGlkZVNob3cudG9nZ2xlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgXCJiZWZvcmVDbG9zZS5mYiBvbkRlYWN0aXZhdGUuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuICAgICAgdmFyIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcbiAgICAgIGlmIChTbGlkZVNob3cpIHtcclxuICAgICAgICBTbGlkZVNob3cuc3RvcCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIFBhZ2UgVmlzaWJpbGl0eSBBUEkgdG8gcGF1c2Ugc2xpZGVzaG93IHdoZW4gd2luZG93IGlzIG5vdCBhY3RpdmVcclxuICAkKGRvY3VtZW50KS5vbihcInZpc2liaWxpdHljaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCksXHJcbiAgICAgIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcbiAgICBpZiAoU2xpZGVTaG93ICYmIFNsaWRlU2hvdy5pc0FjdGl2ZSkge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XHJcbiAgICAgICAgU2xpZGVTaG93LmNsZWFyKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgU2xpZGVTaG93LnNldCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pKGRvY3VtZW50LCBqUXVlcnkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIEZ1bGxTY3JlZW5cclxuLy8gQWRkcyBmdWxsc2NyZWVuIGZ1bmN0aW9uYWxpdHlcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKGRvY3VtZW50LCAkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIC8vIENvbGxlY3Rpb24gb2YgbWV0aG9kcyBzdXBwb3J0ZWQgYnkgdXNlciBicm93c2VyXHJcbiAgdmFyIGZuID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGZuTWFwID0gW1xyXG4gICAgICBbXCJyZXF1ZXN0RnVsbHNjcmVlblwiLCBcImV4aXRGdWxsc2NyZWVuXCIsIFwiZnVsbHNjcmVlbkVsZW1lbnRcIiwgXCJmdWxsc2NyZWVuRW5hYmxlZFwiLCBcImZ1bGxzY3JlZW5jaGFuZ2VcIiwgXCJmdWxsc2NyZWVuZXJyb3JcIl0sXHJcbiAgICAgIC8vIG5ldyBXZWJLaXRcclxuICAgICAgW1xyXG4gICAgICAgIFwid2Via2l0UmVxdWVzdEZ1bGxzY3JlZW5cIixcclxuICAgICAgICBcIndlYmtpdEV4aXRGdWxsc2NyZWVuXCIsXHJcbiAgICAgICAgXCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudFwiLFxyXG4gICAgICAgIFwid2Via2l0RnVsbHNjcmVlbkVuYWJsZWRcIixcclxuICAgICAgICBcIndlYmtpdGZ1bGxzY3JlZW5jaGFuZ2VcIixcclxuICAgICAgICBcIndlYmtpdGZ1bGxzY3JlZW5lcnJvclwiXHJcbiAgICAgIF0sXHJcbiAgICAgIC8vIG9sZCBXZWJLaXQgKFNhZmFyaSA1LjEpXHJcbiAgICAgIFtcclxuICAgICAgICBcIndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuXCIsXHJcbiAgICAgICAgXCJ3ZWJraXRDYW5jZWxGdWxsU2NyZWVuXCIsXHJcbiAgICAgICAgXCJ3ZWJraXRDdXJyZW50RnVsbFNjcmVlbkVsZW1lbnRcIixcclxuICAgICAgICBcIndlYmtpdENhbmNlbEZ1bGxTY3JlZW5cIixcclxuICAgICAgICBcIndlYmtpdGZ1bGxzY3JlZW5jaGFuZ2VcIixcclxuICAgICAgICBcIndlYmtpdGZ1bGxzY3JlZW5lcnJvclwiXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICBcIm1velJlcXVlc3RGdWxsU2NyZWVuXCIsXHJcbiAgICAgICAgXCJtb3pDYW5jZWxGdWxsU2NyZWVuXCIsXHJcbiAgICAgICAgXCJtb3pGdWxsU2NyZWVuRWxlbWVudFwiLFxyXG4gICAgICAgIFwibW96RnVsbFNjcmVlbkVuYWJsZWRcIixcclxuICAgICAgICBcIm1vemZ1bGxzY3JlZW5jaGFuZ2VcIixcclxuICAgICAgICBcIm1vemZ1bGxzY3JlZW5lcnJvclwiXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcIm1zUmVxdWVzdEZ1bGxzY3JlZW5cIiwgXCJtc0V4aXRGdWxsc2NyZWVuXCIsIFwibXNGdWxsc2NyZWVuRWxlbWVudFwiLCBcIm1zRnVsbHNjcmVlbkVuYWJsZWRcIiwgXCJNU0Z1bGxzY3JlZW5DaGFuZ2VcIiwgXCJNU0Z1bGxzY3JlZW5FcnJvclwiXVxyXG4gICAgXTtcclxuXHJcbiAgICB2YXIgcmV0ID0ge307XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbk1hcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgdmFsID0gZm5NYXBbaV07XHJcblxyXG4gICAgICBpZiAodmFsICYmIHZhbFsxXSBpbiBkb2N1bWVudCkge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICByZXRbZm5NYXBbMF1bal1dID0gdmFsW2pdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9KSgpO1xyXG5cclxuICBpZiAoZm4pIHtcclxuICAgIHZhciBGdWxsU2NyZWVuID0ge1xyXG4gICAgICByZXF1ZXN0OiBmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgZWxlbSA9IGVsZW0gfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuICAgICAgICBlbGVtW2ZuLnJlcXVlc3RGdWxsc2NyZWVuXShlbGVtLkFMTE9XX0tFWUJPQVJEX0lOUFVUKTtcclxuICAgICAgfSxcclxuICAgICAgZXhpdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZG9jdW1lbnRbZm4uZXhpdEZ1bGxzY3JlZW5dKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHRvZ2dsZTogZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgIGVsZW0gPSBlbGVtIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNGdWxsc2NyZWVuKCkpIHtcclxuICAgICAgICAgIHRoaXMuZXhpdCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlcXVlc3QoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBpc0Z1bGxzY3JlZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBCb29sZWFuKGRvY3VtZW50W2ZuLmZ1bGxzY3JlZW5FbGVtZW50XSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBCb29sZWFuKGRvY3VtZW50W2ZuLmZ1bGxzY3JlZW5FbmFibGVkXSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJC5leHRlbmQodHJ1ZSwgJC5mYW5jeWJveC5kZWZhdWx0cywge1xyXG4gICAgICBidG5UcGw6IHtcclxuICAgICAgICBmdWxsU2NyZWVuOlxyXG4gICAgICAgICAgJzxidXR0b24gZGF0YS1mYW5jeWJveC1mdWxsc2NyZWVuIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tZnNlbnRlclwiIHRpdGxlPVwie3tGVUxMX1NDUkVFTn19XCI+JyArXHJcbiAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNNyAxNEg1djVoNXYtMkg3di0zem0tMi00aDJWN2gzVjVINXY1em0xMiA3aC0zdjJoNXYtNWgtMnYzek0xNCA1djJoM3YzaDJWNWgtNXpcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNNSAxNmgzdjNoMnYtNUg1em0zLThINXYyaDVWNUg4em02IDExaDJ2LTNoM3YtMmgtNXptMi0xMVY1aC0ydjVoNVY4elwiLz48L3N2Zz4nICtcclxuICAgICAgICAgIFwiPC9idXR0b24+XCJcclxuICAgICAgfSxcclxuICAgICAgZnVsbFNjcmVlbjoge1xyXG4gICAgICAgIGF1dG9TdGFydDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oZm4uZnVsbHNjcmVlbmNoYW5nZSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBpc0Z1bGxzY3JlZW4gPSBGdWxsU2NyZWVuLmlzRnVsbHNjcmVlbigpLFxyXG4gICAgICAgIGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgLy8gSWYgaW1hZ2UgaXMgem9vbWluZywgdGhlbiBmb3JjZSB0byBzdG9wIGFuZCByZXBvc2l0aW9uIHByb3Blcmx5XHJcbiAgICAgICAgaWYgKGluc3RhbmNlLmN1cnJlbnQgJiYgaW5zdGFuY2UuY3VycmVudC50eXBlID09PSBcImltYWdlXCIgJiYgaW5zdGFuY2UuaXNBbmltYXRpbmcpIHtcclxuICAgICAgICAgIGluc3RhbmNlLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgaW5zdGFuY2UudXBkYXRlKHRydWUsIHRydWUsIDApO1xyXG5cclxuICAgICAgICAgIGlmICghaW5zdGFuY2UuaXNDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UudHJpZ2dlcihcIm9uRnVsbHNjcmVlbkNoYW5nZVwiLCBpc0Z1bGxzY3JlZW4pO1xyXG5cclxuICAgICAgICBpbnN0YW5jZS4kcmVmcy5jb250YWluZXIudG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1pcy1mdWxsc2NyZWVuXCIsIGlzRnVsbHNjcmVlbik7XHJcblxyXG4gICAgICAgIGluc3RhbmNlLiRyZWZzLnRvb2xiYXJcclxuICAgICAgICAgIC5maW5kKFwiW2RhdGEtZmFuY3lib3gtZnVsbHNjcmVlbl1cIilcclxuICAgICAgICAgIC50b2dnbGVDbGFzcyhcImZhbmN5Ym94LWJ1dHRvbi0tZnNlbnRlclwiLCAhaXNGdWxsc2NyZWVuKVxyXG4gICAgICAgICAgLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtYnV0dG9uLS1mc2V4aXRcIiwgaXNGdWxsc2NyZWVuKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkKGRvY3VtZW50KS5vbih7XHJcbiAgICBcIm9uSW5pdC5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICB2YXIgJGNvbnRhaW5lcjtcclxuXHJcbiAgICAgIGlmICghZm4pIHtcclxuICAgICAgICBpbnN0YW5jZS4kcmVmcy50b29sYmFyLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1mdWxsc2NyZWVuXVwiKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuZ3JvdXBbaW5zdGFuY2UuY3VyckluZGV4XS5vcHRzLmZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAkY29udGFpbmVyID0gaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyO1xyXG5cclxuICAgICAgICAkY29udGFpbmVyLm9uKFwiY2xpY2suZmItZnVsbHNjcmVlblwiLCBcIltkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW5dXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgRnVsbFNjcmVlbi50b2dnbGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlLm9wdHMuZnVsbFNjcmVlbiAmJiBpbnN0YW5jZS5vcHRzLmZ1bGxTY3JlZW4uYXV0b1N0YXJ0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBGdWxsU2NyZWVuLnJlcXVlc3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEV4cG9zZSBBUElcclxuICAgICAgICBpbnN0YW5jZS5GdWxsU2NyZWVuID0gRnVsbFNjcmVlbjtcclxuICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgIGluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZChcIltkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW5dXCIpLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImFmdGVyS2V5ZG93bi5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCwga2V5cHJlc3MsIGtleWNvZGUpIHtcclxuICAgICAgLy8gXCJGXCJcclxuICAgICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLkZ1bGxTY3JlZW4gJiYga2V5Y29kZSA9PT0gNzApIHtcclxuICAgICAgICBrZXlwcmVzcy5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpbnN0YW5jZS5GdWxsU2NyZWVuLnRvZ2dsZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFwiYmVmb3JlQ2xvc2UuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuICAgICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLkZ1bGxTY3JlZW4gJiYgaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyLmhhc0NsYXNzKFwiZmFuY3lib3gtaXMtZnVsbHNjcmVlblwiKSkge1xyXG4gICAgICAgIEZ1bGxTY3JlZW4uZXhpdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pKGRvY3VtZW50LCBqUXVlcnkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIFRodW1ic1xyXG4vLyBEaXNwbGF5cyB0aHVtYm5haWxzIGluIGEgZ3JpZFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4oZnVuY3Rpb24oZG9jdW1lbnQsICQpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgdmFyIENMQVNTID0gXCJmYW5jeWJveC10aHVtYnNcIixcclxuICAgIENMQVNTX0FDVElWRSA9IENMQVNTICsgXCItYWN0aXZlXCI7XHJcblxyXG4gIC8vIE1ha2Ugc3VyZSB0aGVyZSBhcmUgZGVmYXVsdCB2YWx1ZXNcclxuICAkLmZhbmN5Ym94LmRlZmF1bHRzID0gJC5leHRlbmQoXHJcbiAgICB0cnVlLFxyXG4gICAge1xyXG4gICAgICBidG5UcGw6IHtcclxuICAgICAgICB0aHVtYnM6XHJcbiAgICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXRodW1icyBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXRodW1ic1wiIHRpdGxlPVwie3tUSFVNQlN9fVwiPicgK1xyXG4gICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTE0LjU5IDE0LjU5aDMuNzZ2My43NmgtMy43NnYtMy43NnptLTQuNDcgMGgzLjc2djMuNzZoLTMuNzZ2LTMuNzZ6bS00LjQ3IDBoMy43NnYzLjc2SDUuNjV2LTMuNzZ6bTguOTQtNC40N2gzLjc2djMuNzZoLTMuNzZ2LTMuNzZ6bS00LjQ3IDBoMy43NnYzLjc2aC0zLjc2di0zLjc2em0tNC40NyAwaDMuNzZ2My43Nkg1LjY1di0zLjc2em04Ljk0LTQuNDdoMy43NnYzLjc2aC0zLjc2VjUuNjV6bS00LjQ3IDBoMy43NnYzLjc2aC0zLjc2VjUuNjV6bS00LjQ3IDBoMy43NnYzLjc2SDUuNjVWNS42NXpcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgICBcIjwvYnV0dG9uPlwiXHJcbiAgICAgIH0sXHJcbiAgICAgIHRodW1iczoge1xyXG4gICAgICAgIGF1dG9TdGFydDogZmFsc2UsIC8vIERpc3BsYXkgdGh1bWJuYWlscyBvbiBvcGVuaW5nXHJcbiAgICAgICAgaGlkZU9uQ2xvc2U6IHRydWUsIC8vIEhpZGUgdGh1bWJuYWlsIGdyaWQgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBzdGFydHNcclxuICAgICAgICBwYXJlbnRFbDogXCIuZmFuY3lib3gtY29udGFpbmVyXCIsIC8vIENvbnRhaW5lciBpcyBpbmplY3RlZCBpbnRvIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIGF4aXM6IFwieVwiIC8vIFZlcnRpY2FsICh5KSBvciBob3Jpem9udGFsICh4KSBzY3JvbGxpbmdcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgICQuZmFuY3lib3guZGVmYXVsdHNcclxuICApO1xyXG5cclxuICB2YXIgRmFuY3lUaHVtYnMgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgdGhpcy5pbml0KGluc3RhbmNlKTtcclxuICB9O1xyXG5cclxuICAkLmV4dGVuZChGYW5jeVRodW1icy5wcm90b3R5cGUsIHtcclxuICAgICRidXR0b246IG51bGwsXHJcbiAgICAkZ3JpZDogbnVsbCxcclxuICAgICRsaXN0OiBudWxsLFxyXG4gICAgaXNWaXNpYmxlOiBmYWxzZSxcclxuICAgIGlzQWN0aXZlOiBmYWxzZSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgZ3JvdXAgPSBpbnN0YW5jZS5ncm91cCxcclxuICAgICAgICBlbmFibGVkID0gMDtcclxuXHJcbiAgICAgIHNlbGYuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgICAgc2VsZi5vcHRzID0gZ3JvdXBbaW5zdGFuY2UuY3VyckluZGV4XS5vcHRzLnRodW1icztcclxuXHJcbiAgICAgIGluc3RhbmNlLlRodW1icyA9IHNlbGY7XHJcblxyXG4gICAgICBzZWxmLiRidXR0b24gPSBpbnN0YW5jZS4kcmVmcy50b29sYmFyLmZpbmQoXCJbZGF0YS1mYW5jeWJveC10aHVtYnNdXCIpO1xyXG5cclxuICAgICAgLy8gRW5hYmxlIHRodW1icyBpZiBhdCBsZWFzdCB0d28gZ3JvdXAgaXRlbXMgaGF2ZSB0aHVtYm5haWxzXHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBncm91cC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmIChncm91cFtpXS50aHVtYikge1xyXG4gICAgICAgICAgZW5hYmxlZCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVuYWJsZWQgPiAxKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlbmFibGVkID4gMSAmJiAhIXNlbGYub3B0cykge1xyXG4gICAgICAgIHNlbGYuJGJ1dHRvbi5yZW1vdmVBdHRyKFwic3R5bGVcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNlbGYuaXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYuJGJ1dHRvbi5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZSxcclxuICAgICAgICBwYXJlbnRFbCA9IHNlbGYub3B0cy5wYXJlbnRFbCxcclxuICAgICAgICBsaXN0ID0gW10sXHJcbiAgICAgICAgc3JjO1xyXG5cclxuICAgICAgaWYgKCFzZWxmLiRncmlkKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIG1haW4gZWxlbWVudFxyXG4gICAgICAgIHNlbGYuJGdyaWQgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIENMQVNTICsgXCIgXCIgKyBDTEFTUyArIFwiLVwiICsgc2VsZi5vcHRzLmF4aXMgKyAnXCI+PC9kaXY+JykuYXBwZW5kVG8oXHJcbiAgICAgICAgICBpbnN0YW5jZS4kcmVmcy5jb250YWluZXJcclxuICAgICAgICAgICAgLmZpbmQocGFyZW50RWwpXHJcbiAgICAgICAgICAgIC5hZGRCYWNrKClcclxuICAgICAgICAgICAgLmZpbHRlcihwYXJlbnRFbClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJjbGlja1wiIGV2ZW50IHRoYXQgcGVyZm9ybXMgZ2FsbGVyeSBuYXZpZ2F0aW9uXHJcbiAgICAgICAgc2VsZi4kZ3JpZC5vbihcImNsaWNrXCIsIFwiYVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLmp1bXBUbygkKHRoaXMpLmF0dHIoXCJkYXRhLWluZGV4XCIpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgdGhlIGxpc3RcclxuICAgICAgaWYgKCFzZWxmLiRsaXN0KSB7XHJcbiAgICAgICAgc2VsZi4kbGlzdCA9ICQoJzxkaXYgY2xhc3M9XCInICsgQ0xBU1MgKyAnX19saXN0XCI+JykuYXBwZW5kVG8oc2VsZi4kZ3JpZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQuZWFjaChpbnN0YW5jZS5ncm91cCwgZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgIHNyYyA9IGl0ZW0udGh1bWI7XHJcblxyXG4gICAgICAgIGlmICghc3JjICYmIGl0ZW0udHlwZSA9PT0gXCJpbWFnZVwiKSB7XHJcbiAgICAgICAgICBzcmMgPSBpdGVtLnNyYztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpc3QucHVzaChcclxuICAgICAgICAgICc8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgdGFiaW5kZXg9XCIwXCIgZGF0YS1pbmRleD1cIicgK1xyXG4gICAgICAgICAgICBpICtcclxuICAgICAgICAgICAgJ1wiJyArXHJcbiAgICAgICAgICAgIChzcmMgJiYgc3JjLmxlbmd0aCA/ICcgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOnVybCgnICsgc3JjICsgJylcIicgOiAnY2xhc3M9XCJmYW5jeWJveC10aHVtYnMtbWlzc2luZ1wiJykgK1xyXG4gICAgICAgICAgICBcIj48L2E+XCJcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNlbGYuJGxpc3RbMF0uaW5uZXJIVE1MID0gbGlzdC5qb2luKFwiXCIpO1xyXG5cclxuICAgICAgaWYgKHNlbGYub3B0cy5heGlzID09PSBcInhcIikge1xyXG4gICAgICAgIC8vIFNldCBmaXhlZCB3aWR0aCBmb3IgbGlzdCBlbGVtZW50IHRvIGVuYWJsZSBob3Jpem9udGFsIHNjcm9sbGluZ1xyXG4gICAgICAgIHNlbGYuJGxpc3Qud2lkdGgoXHJcbiAgICAgICAgICBwYXJzZUludChzZWxmLiRncmlkLmNzcyhcInBhZGRpbmctcmlnaHRcIiksIDEwKSArXHJcbiAgICAgICAgICAgIGluc3RhbmNlLmdyb3VwLmxlbmd0aCAqXHJcbiAgICAgICAgICAgICAgc2VsZi4kbGlzdFxyXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAgICAgICAgIC5lcSgwKVxyXG4gICAgICAgICAgICAgICAgLm91dGVyV2lkdGgodHJ1ZSlcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGZvY3VzOiBmdW5jdGlvbihkdXJhdGlvbikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgJGxpc3QgPSBzZWxmLiRsaXN0LFxyXG4gICAgICAgICRncmlkID0gc2VsZi4kZ3JpZCxcclxuICAgICAgICB0aHVtYixcclxuICAgICAgICB0aHVtYlBvcztcclxuXHJcbiAgICAgIGlmICghc2VsZi5pbnN0YW5jZS5jdXJyZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aHVtYiA9ICRsaXN0XHJcbiAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoQ0xBU1NfQUNUSVZFKVxyXG4gICAgICAgIC5maWx0ZXIoJ1tkYXRhLWluZGV4PVwiJyArIHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCArICdcIl0nKVxyXG4gICAgICAgIC5hZGRDbGFzcyhDTEFTU19BQ1RJVkUpO1xyXG5cclxuICAgICAgdGh1bWJQb3MgPSB0aHVtYi5wb3NpdGlvbigpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgbmVlZCB0byBzY3JvbGwgdG8gbWFrZSBjdXJyZW50IHRodW1iIHZpc2libGVcclxuICAgICAgaWYgKHNlbGYub3B0cy5heGlzID09PSBcInlcIiAmJiAodGh1bWJQb3MudG9wIDwgMCB8fCB0aHVtYlBvcy50b3AgPiAkbGlzdC5oZWlnaHQoKSAtIHRodW1iLm91dGVySGVpZ2h0KCkpKSB7XHJcbiAgICAgICAgJGxpc3Quc3RvcCgpLmFuaW1hdGUoXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJGxpc3Quc2Nyb2xsVG9wKCkgKyB0aHVtYlBvcy50b3BcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkdXJhdGlvblxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgc2VsZi5vcHRzLmF4aXMgPT09IFwieFwiICYmXHJcbiAgICAgICAgKHRodW1iUG9zLmxlZnQgPCAkZ3JpZC5zY3JvbGxMZWZ0KCkgfHwgdGh1bWJQb3MubGVmdCA+ICRncmlkLnNjcm9sbExlZnQoKSArICgkZ3JpZC53aWR0aCgpIC0gdGh1bWIub3V0ZXJXaWR0aCgpKSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgJGxpc3RcclxuICAgICAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAgICAgLnN0b3AoKVxyXG4gICAgICAgICAgLmFuaW1hdGUoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiB0aHVtYlBvcy5sZWZ0XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGR1cmF0aW9uXHJcbiAgICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgdGhhdC5pbnN0YW5jZS4kcmVmcy5jb250YWluZXIudG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1zaG93LXRodW1ic1wiLCB0aGlzLmlzVmlzaWJsZSk7XHJcblxyXG4gICAgICBpZiAodGhhdC5pc1Zpc2libGUpIHtcclxuICAgICAgICBpZiAoIXRoYXQuJGdyaWQpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGF0Lmluc3RhbmNlLnRyaWdnZXIoXCJvblRodW1ic1Nob3dcIik7XHJcblxyXG4gICAgICAgIHRoYXQuZm9jdXMoMCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhhdC4kZ3JpZCkge1xyXG4gICAgICAgIHRoYXQuaW5zdGFuY2UudHJpZ2dlcihcIm9uVGh1bWJzSGlkZVwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVXBkYXRlIGNvbnRlbnQgcG9zaXRpb25cclxuICAgICAgdGhhdC5pbnN0YW5jZS51cGRhdGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuaXNWaXNpYmxlID0gIXRoaXMuaXNWaXNpYmxlO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKGRvY3VtZW50KS5vbih7XHJcbiAgICBcIm9uSW5pdC5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICB2YXIgVGh1bWJzO1xyXG5cclxuICAgICAgaWYgKGluc3RhbmNlICYmICFpbnN0YW5jZS5UaHVtYnMpIHtcclxuICAgICAgICBUaHVtYnMgPSBuZXcgRmFuY3lUaHVtYnMoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICBpZiAoVGh1bWJzLmlzQWN0aXZlICYmIFRodW1icy5vcHRzLmF1dG9TdGFydCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgVGh1bWJzLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgXCJiZWZvcmVTaG93LmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBpdGVtLCBmaXJzdFJ1bikge1xyXG4gICAgICB2YXIgVGh1bWJzID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuVGh1bWJzO1xyXG5cclxuICAgICAgaWYgKFRodW1icyAmJiBUaHVtYnMuaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgVGh1bWJzLmZvY3VzKGZpcnN0UnVuID8gMCA6IDI1MCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgXCJhZnRlcktleWRvd24uZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGtleXByZXNzLCBrZXljb2RlKSB7XHJcbiAgICAgIHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG4gICAgICAvLyBcIkdcIlxyXG4gICAgICBpZiAoVGh1bWJzICYmIFRodW1icy5pc0FjdGl2ZSAmJiBrZXljb2RlID09PSA3MSkge1xyXG4gICAgICAgIGtleXByZXNzLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIFRodW1icy50b2dnbGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImJlZm9yZUNsb3NlLmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcbiAgICAgIHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG4gICAgICBpZiAoVGh1bWJzICYmIFRodW1icy5pc1Zpc2libGUgJiYgVGh1bWJzLm9wdHMuaGlkZU9uQ2xvc2UgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgVGh1bWJzLiRncmlkLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59KShkb2N1bWVudCwgalF1ZXJ5KTtcclxuXG4vLy8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIFNoYXJlXHJcbi8vIERpc3BsYXlzIHNpbXBsZSBmb3JtIGZvciBzaGFyaW5nIGN1cnJlbnQgdXJsXHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbihmdW5jdGlvbihkb2N1bWVudCwgJCkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAkLmV4dGVuZCh0cnVlLCAkLmZhbmN5Ym94LmRlZmF1bHRzLCB7XHJcbiAgICBidG5UcGw6IHtcclxuICAgICAgc2hhcmU6XHJcbiAgICAgICAgJzxidXR0b24gZGF0YS1mYW5jeWJveC1zaGFyZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXNoYXJlXCIgdGl0bGU9XCJ7e1NIQVJFfX1cIj4nICtcclxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNMi41NSAxOWMxLjQtOC40IDkuMS05LjggMTEuOS05LjhWNWw3IDctNyA2LjN2LTMuNWMtMi44IDAtMTAuNSAyLjEtMTEuOSA0LjJ6XCIvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPC9idXR0b24+XCJcclxuICAgIH0sXHJcbiAgICBzaGFyZToge1xyXG4gICAgICB1cmw6IGZ1bmN0aW9uKGluc3RhbmNlLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICghaW5zdGFuY2UuY3VycmVudEhhc2ggJiYgIShpdGVtLnR5cGUgPT09IFwiaW5saW5lXCIgfHwgaXRlbS50eXBlID09PSBcImh0bWxcIikgPyBpdGVtLm9yaWdTcmMgfHwgaXRlbS5zcmMgOiBmYWxzZSkgfHwgd2luZG93LmxvY2F0aW9uXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuICAgICAgdHBsOlxyXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtc2hhcmVcIj4nICtcclxuICAgICAgICBcIjxoMT57e1NIQVJFfX08L2gxPlwiICtcclxuICAgICAgICBcIjxwPlwiICtcclxuICAgICAgICAnPGEgY2xhc3M9XCJmYW5jeWJveC1zaGFyZV9fYnV0dG9uIGZhbmN5Ym94LXNoYXJlX19idXR0b24tLWZiXCIgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PXt7dXJsfX1cIj4nICtcclxuICAgICAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIm0yODcgNDU2di0yOTljMC0yMSA2LTM1IDM1LTM1aDM4di02M2MtNy0xLTI5LTMtNTUtMy01NCAwLTkxIDMzLTkxIDk0djMwNm0xNDMtMjU0aC0yMDV2NzJoMTk2XCIgLz48L3N2Zz4nICtcclxuICAgICAgICBcIjxzcGFuPkZhY2Vib29rPC9zcGFuPlwiICtcclxuICAgICAgICBcIjwvYT5cIiArXHJcbiAgICAgICAgJzxhIGNsYXNzPVwiZmFuY3lib3gtc2hhcmVfX2J1dHRvbiBmYW5jeWJveC1zaGFyZV9fYnV0dG9uLS10d1wiIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD91cmw9e3t1cmx9fSZ0ZXh0PXt7ZGVzY3J9fVwiPicgK1xyXG4gICAgICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTQ1NiAxMzNjLTE0IDctMzEgMTEtNDcgMTMgMTctMTAgMzAtMjcgMzctNDYtMTUgMTAtMzQgMTYtNTIgMjAtNjEtNjItMTU3LTctMTQxIDc1LTY4LTMtMTI5LTM1LTE2OS04NS0yMiAzNy0xMSA4NiAyNiAxMDktMTMgMC0yNi00LTM3LTkgMCAzOSAyOCA3MiA2NSA4MC0xMiAzLTI1IDQtMzcgMiAxMCAzMyA0MSA1NyA3NyA1Ny00MiAzMC03NyAzOC0xMjIgMzQgMTcwIDExMSAzNzgtMzIgMzU5LTIwOCAxNi0xMSAzMC0yNSA0MS00MnpcIiAvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPHNwYW4+VHdpdHRlcjwvc3Bhbj5cIiArXHJcbiAgICAgICAgXCI8L2E+XCIgK1xyXG4gICAgICAgICc8YSBjbGFzcz1cImZhbmN5Ym94LXNoYXJlX19idXR0b24gZmFuY3lib3gtc2hhcmVfX2J1dHRvbi0tcHRcIiBocmVmPVwiaHR0cHM6Ly93d3cucGludGVyZXN0LmNvbS9waW4vY3JlYXRlL2J1dHRvbi8/dXJsPXt7dXJsfX0mZGVzY3JpcHRpb249e3tkZXNjcn19Jm1lZGlhPXt7bWVkaWF9fVwiPicgK1xyXG4gICAgICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTI2NSA1NmMtMTA5IDAtMTY0IDc4LTE2NCAxNDQgMCAzOSAxNSA3NCA0NyA4NyA1IDIgMTAgMCAxMi01bDQtMTljMi02IDEtOC0zLTEzLTktMTEtMTUtMjUtMTUtNDUgMC01OCA0My0xMTAgMTEzLTExMCA2MiAwIDk2IDM4IDk2IDg4IDAgNjctMzAgMTIyLTczIDEyMi0yNCAwLTQyLTE5LTM2LTQ0IDYtMjkgMjAtNjAgMjAtODEgMC0xOS0xMC0zNS0zMS0zNS0yNSAwLTQ0IDI2LTQ0IDYwIDAgMjEgNyAzNiA3IDM2bC0zMCAxMjVjLTggMzctMSA4MyAwIDg3IDAgMyA0IDQgNSAyIDItMyAzMi0zOSA0Mi03NWwxNi02NGM4IDE2IDMxIDI5IDU2IDI5IDc0IDAgMTI0LTY3IDEyNC0xNTcgMC02OS01OC0xMzItMTQ2LTEzMnpcIiBmaWxsPVwiI2ZmZlwiLz48L3N2Zz4nICtcclxuICAgICAgICBcIjxzcGFuPlBpbnRlcmVzdDwvc3Bhbj5cIiArXHJcbiAgICAgICAgXCI8L2E+XCIgK1xyXG4gICAgICAgIFwiPC9wPlwiICtcclxuICAgICAgICAnPHA+PGlucHV0IGNsYXNzPVwiZmFuY3lib3gtc2hhcmVfX2lucHV0XCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cInt7dXJsX3Jhd319XCIgb25jbGljaz1cInNlbGVjdCgpXCIgLz48L3A+JyArXHJcbiAgICAgICAgXCI8L2Rpdj5cIlxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cmluZykge1xyXG4gICAgdmFyIGVudGl0eU1hcCA9IHtcclxuICAgICAgXCImXCI6IFwiJmFtcDtcIixcclxuICAgICAgXCI8XCI6IFwiJmx0O1wiLFxyXG4gICAgICBcIj5cIjogXCImZ3Q7XCIsXHJcbiAgICAgICdcIic6IFwiJnF1b3Q7XCIsXHJcbiAgICAgIFwiJ1wiOiBcIiYjMzk7XCIsXHJcbiAgICAgIFwiL1wiOiBcIiYjeDJGO1wiLFxyXG4gICAgICBcImBcIjogXCImI3g2MDtcIixcclxuICAgICAgXCI9XCI6IFwiJiN4M0Q7XCJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL1smPD5cIidgPVxcL10vZywgZnVuY3Rpb24ocykge1xyXG4gICAgICByZXR1cm4gZW50aXR5TWFwW3NdO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiW2RhdGEtZmFuY3lib3gtc2hhcmVdXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpLFxyXG4gICAgICBjdXJyZW50ID0gaW5zdGFuY2UuY3VycmVudCB8fCBudWxsLFxyXG4gICAgICB1cmwsXHJcbiAgICAgIHRwbDtcclxuXHJcbiAgICBpZiAoIWN1cnJlbnQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkLnR5cGUoY3VycmVudC5vcHRzLnNoYXJlLnVybCkgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICB1cmwgPSBjdXJyZW50Lm9wdHMuc2hhcmUudXJsLmFwcGx5KGN1cnJlbnQsIFtpbnN0YW5jZSwgY3VycmVudF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRwbCA9IGN1cnJlbnQub3B0cy5zaGFyZS50cGxcclxuICAgICAgLnJlcGxhY2UoL1xce1xce21lZGlhXFx9XFx9L2csIGN1cnJlbnQudHlwZSA9PT0gXCJpbWFnZVwiID8gZW5jb2RlVVJJQ29tcG9uZW50KGN1cnJlbnQuc3JjKSA6IFwiXCIpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHtcXHt1cmxcXH1cXH0vZywgZW5jb2RlVVJJQ29tcG9uZW50KHVybCkpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHtcXHt1cmxfcmF3XFx9XFx9L2csIGVzY2FwZUh0bWwodXJsKSlcclxuICAgICAgLnJlcGxhY2UoL1xce1xce2Rlc2NyXFx9XFx9L2csIGluc3RhbmNlLiRjYXB0aW9uID8gZW5jb2RlVVJJQ29tcG9uZW50KGluc3RhbmNlLiRjYXB0aW9uLnRleHQoKSkgOiBcIlwiKTtcclxuXHJcbiAgICAkLmZhbmN5Ym94Lm9wZW4oe1xyXG4gICAgICBzcmM6IGluc3RhbmNlLnRyYW5zbGF0ZShpbnN0YW5jZSwgdHBsKSxcclxuICAgICAgdHlwZTogXCJodG1sXCIsXHJcbiAgICAgIG9wdHM6IHtcclxuICAgICAgICB0b3VjaDogZmFsc2UsXHJcbiAgICAgICAgYW5pbWF0aW9uRWZmZWN0OiBmYWxzZSxcclxuICAgICAgICBhZnRlckxvYWQ6IGZ1bmN0aW9uKHNoYXJlSW5zdGFuY2UsIHNoYXJlQ3VycmVudCkge1xyXG4gICAgICAgICAgLy8gQ2xvc2Ugc2VsZiBpZiBwYXJlbnQgaW5zdGFuY2UgaXMgY2xvc2luZ1xyXG4gICAgICAgICAgaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyLm9uZShcImJlZm9yZUNsb3NlLmZiXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzaGFyZUluc3RhbmNlLmNsb3NlKG51bGwsIDApO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gT3BlbmluZyBsaW5rcyBpbiBhIHBvcHVwIHdpbmRvd1xyXG4gICAgICAgICAgc2hhcmVDdXJyZW50LiRjb250ZW50LmZpbmQoXCIuZmFuY3lib3gtc2hhcmVfX2J1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgd2luZG93Lm9wZW4odGhpcy5ocmVmLCBcIlNoYXJlXCIsIFwid2lkdGg9NTUwLCBoZWlnaHQ9NDUwXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1vYmlsZToge1xyXG4gICAgICAgICAgYXV0b0ZvY3VzOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pKGRvY3VtZW50LCBqUXVlcnkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIEhhc2hcclxuLy8gRW5hYmxlcyBsaW5raW5nIHRvIGVhY2ggbW9kYWxcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgLy8gU2ltcGxlICQuZXNjYXBlU2VsZWN0b3IgcG9seWZpbGwgKGZvciBqUXVlcnkgcHJpb3IgdjMpXHJcbiAgaWYgKCEkLmVzY2FwZVNlbGVjdG9yKSB7XHJcbiAgICAkLmVzY2FwZVNlbGVjdG9yID0gZnVuY3Rpb24oc2VsKSB7XHJcbiAgICAgIHZhciByY3NzZXNjYXBlID0gLyhbXFwwLVxceDFmXFx4N2ZdfF4tP1xcZCl8Xi0kfFteXFx4ODAtXFx1RkZGRlxcdy1dL2c7XHJcbiAgICAgIHZhciBmY3NzZXNjYXBlID0gZnVuY3Rpb24oY2gsIGFzQ29kZVBvaW50KSB7XHJcbiAgICAgICAgaWYgKGFzQ29kZVBvaW50KSB7XHJcbiAgICAgICAgICAvLyBVKzAwMDAgTlVMTCBiZWNvbWVzIFUrRkZGRCBSRVBMQUNFTUVOVCBDSEFSQUNURVJcclxuICAgICAgICAgIGlmIChjaCA9PT0gXCJcXDBcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcXHVGRkZEXCI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQ29udHJvbCBjaGFyYWN0ZXJzIGFuZCAoZGVwZW5kZW50IHVwb24gcG9zaXRpb24pIG51bWJlcnMgZ2V0IGVzY2FwZWQgYXMgY29kZSBwb2ludHNcclxuICAgICAgICAgIHJldHVybiBjaC5zbGljZSgwLCAtMSkgKyBcIlxcXFxcIiArIGNoLmNoYXJDb2RlQXQoY2gubGVuZ3RoIC0gMSkudG9TdHJpbmcoMTYpICsgXCIgXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBPdGhlciBwb3RlbnRpYWxseS1zcGVjaWFsIEFTQ0lJIGNoYXJhY3RlcnMgZ2V0IGJhY2tzbGFzaC1lc2NhcGVkXHJcbiAgICAgICAgcmV0dXJuIFwiXFxcXFwiICsgY2g7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gKHNlbCArIFwiXCIpLnJlcGxhY2UocmNzc2VzY2FwZSwgZmNzc2VzY2FwZSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGluZm8gYWJvdXQgZ2FsbGVyeSBuYW1lIGFuZCBjdXJyZW50IGluZGV4IGZyb20gdXJsXHJcbiAgZnVuY3Rpb24gcGFyc2VVcmwoKSB7XHJcbiAgICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSxcclxuICAgICAgcmV6ID0gaGFzaC5zcGxpdChcIi1cIiksXHJcbiAgICAgIGluZGV4ID0gcmV6Lmxlbmd0aCA+IDEgJiYgL15cXCs/XFxkKyQvLnRlc3QocmV6W3Jlei5sZW5ndGggLSAxXSkgPyBwYXJzZUludChyZXoucG9wKC0xKSwgMTApIHx8IDEgOiAxLFxyXG4gICAgICBnYWxsZXJ5ID0gcmV6LmpvaW4oXCItXCIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhhc2g6IGhhc2gsXHJcbiAgICAgIC8qIEluZGV4IGlzIHN0YXJ0aW5nIGZyb20gMSAqL1xyXG4gICAgICBpbmRleDogaW5kZXggPCAxID8gMSA6IGluZGV4LFxyXG4gICAgICBnYWxsZXJ5OiBnYWxsZXJ5XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gVHJpZ2dlciBjbGljayBldm50IG9uIGxpbmtzIHRvIG9wZW4gbmV3IGZhbmN5Qm94IGluc3RhbmNlXHJcbiAgZnVuY3Rpb24gdHJpZ2dlckZyb21VcmwodXJsKSB7XHJcbiAgICBpZiAodXJsLmdhbGxlcnkgIT09IFwiXCIpIHtcclxuICAgICAgLy8gSWYgd2UgY2FuIGZpbmQgZWxlbWVudCBtYXRjaGluZyAnZGF0YS1mYW5jeWJveCcgYXRyaWJ1dGUsXHJcbiAgICAgIC8vIHRoZW4gdHJpZ2dlcmluZyBjbGljayBldmVudCBzaG91bGQgc3RhcnQgZmFuY3lCb3hcclxuICAgICAgJChcIltkYXRhLWZhbmN5Ym94PSdcIiArICQuZXNjYXBlU2VsZWN0b3IodXJsLmdhbGxlcnkpICsgXCInXVwiKVxyXG4gICAgICAgIC5lcSh1cmwuaW5kZXggLSAxKVxyXG4gICAgICAgIC5mb2N1cygpXHJcbiAgICAgICAgLnRyaWdnZXIoXCJjbGljay5mYi1zdGFydFwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBnYWxsZXJ5IG5hbWUgZnJvbSBjdXJyZW50IGluc3RhbmNlXHJcbiAgZnVuY3Rpb24gZ2V0R2FsbGVyeUlEKGluc3RhbmNlKSB7XHJcbiAgICB2YXIgb3B0cywgcmV0O1xyXG5cclxuICAgIGlmICghaW5zdGFuY2UpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdHMgPSBpbnN0YW5jZS5jdXJyZW50ID8gaW5zdGFuY2UuY3VycmVudC5vcHRzIDogaW5zdGFuY2Uub3B0cztcclxuICAgIHJldCA9IG9wdHMuaGFzaCB8fCAob3B0cy4kb3JpZyA/IG9wdHMuJG9yaWcuZGF0YShcImZhbmN5Ym94XCIpIHx8IG9wdHMuJG9yaWcuZGF0YShcImZhbmN5Ym94LXRyaWdnZXJcIikgOiBcIlwiKTtcclxuXHJcbiAgICByZXR1cm4gcmV0ID09PSBcIlwiID8gZmFsc2UgOiByZXQ7XHJcbiAgfVxyXG5cclxuICAvLyBTdGFydCB3aGVuIERPTSBiZWNvbWVzIHJlYWR5XHJcbiAgJChmdW5jdGlvbigpIHtcclxuICAgIC8vIENoZWNrIGlmIHVzZXIgaGFzIGRpc2FibGVkIHRoaXMgbW9kdWxlXHJcbiAgICBpZiAoJC5mYW5jeWJveC5kZWZhdWx0cy5oYXNoID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGhhc2ggd2hlbiBvcGVuaW5nL2Nsb3NpbmcgZmFuY3lCb3hcclxuICAgICQoZG9jdW1lbnQpLm9uKHtcclxuICAgICAgXCJvbkluaXQuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgdXJsLCBnYWxsZXJ5O1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UuZ3JvdXBbaW5zdGFuY2UuY3VyckluZGV4XS5vcHRzLmhhc2ggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cmwgPSBwYXJzZVVybCgpO1xyXG4gICAgICAgIGdhbGxlcnkgPSBnZXRHYWxsZXJ5SUQoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgZ2FsbGVyeSBzdGFydCBpbmRleCBtYXRjaGVzIGluZGV4IGZyb20gaGFzaFxyXG4gICAgICAgIGlmIChnYWxsZXJ5ICYmIHVybC5nYWxsZXJ5ICYmIGdhbGxlcnkgPT0gdXJsLmdhbGxlcnkpIHtcclxuICAgICAgICAgIGluc3RhbmNlLmN1cnJJbmRleCA9IHVybC5pbmRleCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgXCJiZWZvcmVTaG93LmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50LCBmaXJzdFJ1bikge1xyXG4gICAgICAgIHZhciBnYWxsZXJ5O1xyXG5cclxuICAgICAgICBpZiAoIWN1cnJlbnQgfHwgY3VycmVudC5vcHRzLmhhc2ggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiBuZWVkIHRvIHVwZGF0ZSB3aW5kb3cgaGFzaFxyXG4gICAgICAgIGdhbGxlcnkgPSBnZXRHYWxsZXJ5SUQoaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICBpZiAoIWdhbGxlcnkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFZhcmlhYmxlIGNvbnRhaW5pbmcgbGFzdCBoYXNoIHZhbHVlIHNldCBieSBmYW5jeUJveFxyXG4gICAgICAgIC8vIEl0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgaWYgZmFuY3lCb3ggbmVlZHMgdG8gY2xvc2UgYWZ0ZXIgaGFzaCBjaGFuZ2UgaXMgZGV0ZWN0ZWRcclxuICAgICAgICBpbnN0YW5jZS5jdXJyZW50SGFzaCA9IGdhbGxlcnkgKyAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoID4gMSA/IFwiLVwiICsgKGN1cnJlbnQuaW5kZXggKyAxKSA6IFwiXCIpO1xyXG5cclxuICAgICAgICAvLyBJZiBjdXJyZW50IGhhc2ggaXMgdGhlIHNhbWUgKHRoaXMgaW5zdGFuY2UgbW9zdCBsaWtlbHkgaXMgb3BlbmVkIGJ5IGhhc2hjaGFuZ2UpLCB0aGVuIGRvIG5vdGhpbmdcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09IFwiI1wiICsgaW5zdGFuY2UuY3VycmVudEhhc2gpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaXJzdFJ1biAmJiAhaW5zdGFuY2Uub3JpZ0hhc2gpIHtcclxuICAgICAgICAgIGluc3RhbmNlLm9yaWdIYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UuaGFzaFRpbWVyKSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQoaW5zdGFuY2UuaGFzaFRpbWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBoYXNoXHJcbiAgICAgICAgaW5zdGFuY2UuaGFzaFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmIChcInJlcGxhY2VTdGF0ZVwiIGluIHdpbmRvdy5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5W2ZpcnN0UnVuID8gXCJwdXNoU3RhdGVcIiA6IFwicmVwbGFjZVN0YXRlXCJdKFxyXG4gICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlLFxyXG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKyBcIiNcIiArIGluc3RhbmNlLmN1cnJlbnRIYXNoXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlyc3RSdW4pIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5oYXNDcmVhdGVkSGlzdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaW5zdGFuY2UuY3VycmVudEhhc2g7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaW5zdGFuY2UuaGFzaFRpbWVyID0gbnVsbDtcclxuICAgICAgICB9LCAzMDApO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgXCJiZWZvcmVDbG9zZS5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCkge1xyXG4gICAgICAgIGlmICghY3VycmVudCB8fCBjdXJyZW50Lm9wdHMuaGFzaCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dChpbnN0YW5jZS5oYXNoVGltZXIpO1xyXG5cclxuICAgICAgICAvLyBHb3RvIHByZXZpb3VzIGhpc3RvcnkgZW50cnlcclxuICAgICAgICBpZiAoaW5zdGFuY2UuY3VycmVudEhhc2ggJiYgaW5zdGFuY2UuaGFzQ3JlYXRlZEhpc3RvcnkpIHtcclxuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlLmN1cnJlbnRIYXNoKSB7XHJcbiAgICAgICAgICBpZiAoXCJyZXBsYWNlU3RhdGVcIiBpbiB3aW5kb3cuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgKGluc3RhbmNlLm9yaWdIYXNoIHx8IFwiXCIpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaW5zdGFuY2Uub3JpZ0hhc2g7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZS5jdXJyZW50SGFzaCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENoZWNrIGlmIG5lZWQgdG8gc3RhcnQvY2xvc2UgYWZ0ZXIgdXJsIGhhcyBjaGFuZ2VkXHJcbiAgICAkKHdpbmRvdykub24oXCJoYXNoY2hhbmdlLmZiXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgdXJsID0gcGFyc2VVcmwoKSxcclxuICAgICAgICBmYiA9IG51bGw7XHJcblxyXG4gICAgICAvLyBGaW5kIGxhc3QgZmFuY3lCb3ggaW5zdGFuY2UgdGhhdCBoYXMgXCJoYXNoXCJcclxuICAgICAgJC5lYWNoKFxyXG4gICAgICAgICQoXCIuZmFuY3lib3gtY29udGFpbmVyXCIpXHJcbiAgICAgICAgICAuZ2V0KClcclxuICAgICAgICAgIC5yZXZlcnNlKCksXHJcbiAgICAgICAgZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICB2YXIgdG1wID0gJCh2YWx1ZSkuZGF0YShcIkZhbmN5Qm94XCIpO1xyXG5cclxuICAgICAgICAgIGlmICh0bXAgJiYgdG1wLmN1cnJlbnRIYXNoKSB7XHJcbiAgICAgICAgICAgIGZiID0gdG1wO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGZiKSB7XHJcbiAgICAgICAgLy8gTm93LCBjb21wYXJlIGhhc2ggdmFsdWVzXHJcbiAgICAgICAgaWYgKGZiLmN1cnJlbnRIYXNoICE9PSB1cmwuZ2FsbGVyeSArIFwiLVwiICsgdXJsLmluZGV4ICYmICEodXJsLmluZGV4ID09PSAxICYmIGZiLmN1cnJlbnRIYXNoID09IHVybC5nYWxsZXJ5KSkge1xyXG4gICAgICAgICAgZmIuY3VycmVudEhhc2ggPSBudWxsO1xyXG5cclxuICAgICAgICAgIGZiLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHVybC5nYWxsZXJ5ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdHJpZ2dlckZyb21VcmwodXJsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgY3VycmVudCBoYXNoIGFuZCB0cmlnZ2VyIGNsaWNrIGV2ZW50IG9uIG1hdGNoaW5nIGVsZW1lbnQgdG8gc3RhcnQgZmFuY3lCb3gsIGlmIG5lZWRlZFxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKCEkLmZhbmN5Ym94LmdldEluc3RhbmNlKCkpIHtcclxuICAgICAgICB0cmlnZ2VyRnJvbVVybChwYXJzZVVybCgpKTtcclxuICAgICAgfVxyXG4gICAgfSwgNTApO1xyXG4gIH0pO1xyXG59KSh3aW5kb3csIGRvY3VtZW50LCBqUXVlcnkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIFdoZWVsXHJcbi8vIEJhc2ljIG1vdXNlIHdlaGVlbCBzdXBwb3J0IGZvciBnYWxsZXJ5IG5hdmlnYXRpb25cclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKGRvY3VtZW50LCAkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIHZhciBwcmV2VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAkKGRvY3VtZW50KS5vbih7XHJcbiAgICBcIm9uSW5pdC5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCkge1xyXG4gICAgICBpbnN0YW5jZS4kcmVmcy5zdGFnZS5vbihcIm1vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwgd2hlZWwgTW96TW91c2VQaXhlbFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnQgPSBpbnN0YW5jZS5jdXJyZW50LFxyXG4gICAgICAgICAgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlLmdyb3VwLmxlbmd0aCA8IDIgfHwgY3VycmVudC5vcHRzLndoZWVsID09PSBmYWxzZSB8fCAoY3VycmVudC5vcHRzLndoZWVsID09PSBcImF1dG9cIiAmJiBjdXJyZW50LnR5cGUgIT09IFwiaW1hZ2VcIikpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudC4kc2xpZGUuaGFzQ2xhc3MoXCJmYW5jeWJveC1hbmltYXRlZFwiKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZSA9IGUub3JpZ2luYWxFdmVudCB8fCBlO1xyXG5cclxuICAgICAgICBpZiAoY3VyclRpbWUgLSBwcmV2VGltZSA8IDI1MCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJldlRpbWUgPSBjdXJyVGltZTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2VbKC1lLmRlbHRhWSB8fCAtZS5kZWx0YVggfHwgZS53aGVlbERlbHRhIHx8IC1lLmRldGFpbCkgPCAwID8gXCJuZXh0XCIgOiBcInByZXZpb3VzXCJdKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KShkb2N1bWVudCwgalF1ZXJ5KTtcclxuIiwiXG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oICQgKSB7XG5cbiAgaWYoJChcIiNuYXZUb2dnbGVcIikubGVuZ3RoKXtcbiAgICB2YXIgbmF2ID0gcmVzcG9uc2l2ZU5hdihcIi5uYXYtY29sbGFwc2VcIiwge1xuICAgICAgIGN1c3RvbVRvZ2dsZTogXCIjbmF2VG9nZ2xlXCJcbiAgICB9KTtcbiAgfVxuXG4gICQoXCJbZGF0YS1mYW5jeWJveF1cIikuZmFuY3lib3goe1xuXHRcdGxvb3AgICAgIDogdHJ1ZVxuXHR9KTtcblxufSk7XG4iXX0=
