"use strict";

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
  "use strict";

  window.console = window.console || {
    info: function info(stuff) {}
  };

  // If there's no jQuery, fancyBox can't work
  // =========================================

  if (!$) {
    return;
  }

  // Check if fancyBox is already initialized
  // ========================================

  if ($.fn.fancybox) {
    console.info("fancyBox already initialized");

    return;
  }

  // Private default settings
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
    buttons: ["zoom",
    //"share",
    "slideShow",
    //"fullScreen",
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
      format: "", // custom video format
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
      vertical: true, // Allow to drag content vertically
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
      autoStart: false, // Display thumbnails on opening
      hideOnClose: true, // Hide thumbnail grid when closing animation starts
      parentEl: ".fancybox-container", // Container is injected into this element
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

    onInit: $.noop, // When instance has been initialized

    beforeLoad: $.noop, // Before the content of a slide is being loaded
    afterLoad: $.noop, // When the content of a slide is done loading

    beforeShow: $.noop, // Before open animation starts
    afterShow: $.noop, // When content is done loading and animating

    beforeClose: $.noop, // Before the instance attempts to close. Return false to cancel the close.
    afterClose: $.noop, // After instance has been closed

    onActivate: $.noop, // When instance is brought to front
    onDeactivate: $.noop, // When other instance has been activated

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
    clickContent: function clickContent(current, event) {
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
      clickContent: function clickContent(current, event) {
        return current.type === "image" ? "toggleControls" : false;
      },
      clickSlide: function clickSlide(current, event) {
        return current.type === "image" ? "toggleControls" : "close";
      },
      dblclickContent: function dblclickContent(current, event) {
        return current.type === "image" ? "zoom" : false;
      },
      dblclickSlide: function dblclickSlide(current, event) {
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
  };

  // Few useful variables and methods
  // ================================

  var $W = $(window);
  var $D = $(document);

  var called = 0;

  // Check if an object is a jQuery object and not a native JavaScript object
  // ========================================================================
  var isQuery = function isQuery(obj) {
    return obj && obj.hasOwnProperty && obj instanceof $;
  };

  // Handle multiple browsers for "requestAnimationFrame" and "cancelAnimationFrame"
  // ===============================================================================
  var requestAFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }();

  var cancelAFrame = function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
      window.clearTimeout(id);
    };
  }();

  // Detect the supported transition-end event property name
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
  }();

  // Force redraw on an element.
  // This helps in cases where the browser doesn't redraw an updated element properly
  // ================================================================================
  var forceRedraw = function forceRedraw($el) {
    return $el && $el.length && $el[0].offsetHeight;
  };

  // Exclude array (`buttons`) options from deep merging
  // ===================================================
  var mergeOpts = function mergeOpts(opts1, opts2) {
    var rez = $.extend(true, {}, opts1, opts2);

    $.each(opts2, function (key, value) {
      if ($.isArray(value)) {
        rez[key] = value;
      }
    });

    return rez;
  };

  // How much of an element is visible in viewport
  // =============================================

  var inViewport = function inViewport(elem) {
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
  };

  // Class definition
  // ================

  var FancyBox = function FancyBox(content, opts, index) {
    var self = this;

    self.opts = mergeOpts({ index: index }, $.fancybox.defaults);

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

    self.firstRun = true;

    // All group items
    self.group = [];

    // Existing slides (for current, next and previous gallery items)
    self.slides = {};

    // Create group elements
    self.addContent(content);

    if (!self.group.length) {
      return;
    }

    self.init();
  };

  $.extend(FancyBox.prototype, {
    // Create DOM structure
    // ====================

    init: function init() {
      var self = this,
          firstItem = self.group[self.currIndex],
          firstItemOpts = firstItem.opts,
          $container,
          buttonStr;

      if (firstItemOpts.closeExisting) {
        $.fancybox.close(true);
      }

      // Hide scrollbars
      // ===============

      $("body").addClass("fancybox-active");

      if (!$.fancybox.getInstance() && firstItemOpts.hideScrollbar !== false && !$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {
        $("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (window.innerWidth - document.documentElement.clientWidth) + "px;}</style>");

        $("body").addClass("compensate-for-scrollbar");
      }

      // Build html markup and set references
      // ====================================

      // Build html code for buttons and insert into main template
      buttonStr = "";

      $.each(firstItemOpts.buttons, function (index, value) {
        buttonStr += firstItemOpts.btnTpl[value] || "";
      });

      // Create markup from base template, it will be initially hidden to
      // avoid unnecessary work like painting while initializing is not complete
      $container = $(self.translate(self, firstItemOpts.baseTpl.replace("{{buttons}}", buttonStr).replace("{{arrows}}", firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight))).attr("id", "fancybox-container-" + self.id).addClass(firstItemOpts.baseClass).data("FancyBox", self).appendTo(firstItemOpts.parentEl);

      // Create object holding references to jQuery wrapped nodes
      self.$refs = {
        container: $container
      };

      ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function (item) {
        self.$refs[item] = $container.find(".fancybox-" + item);
      });

      self.trigger("onInit");

      // Enable events, deactive previous instances
      self.activate();

      // Build slides, load and reveal content
      self.jumpTo(self.currIndex);
    },

    // Simple i18n support - replaces object keys found in template
    // with corresponding values
    // ============================================================

    translate: function translate(obj, str) {
      var arr = obj.opts.i18n[obj.opts.lang] || obj.opts.i18n.en;

      return str.replace(/\{\{(\w+)\}\}/g, function (match, n) {
        return arr[n] === undefined ? match : arr[n];
      });
    },

    // Populate current group with fresh content
    // Check if each object has valid type and content
    // ===============================================

    addContent: function addContent(content) {
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
            srcParts;

        // Step 1 - Make sure we have an object
        // ====================================

        if ($.isPlainObject(item)) {
          // We probably have manual usage here, something like
          // $.fancybox.open( [ { src : "image.jpg", type : "image" } ] )

          obj = item;
          opts = item.opts || item;
        } else if ($.type(item) === "object" && $(item).length) {
          // Here we probably have jQuery collection returned by some selector
          $item = $(item);

          // Support attributes like `data-options='{"touch" : false}'` and `data-touch='false'`
          opts = $item.data() || {};
          opts = $.extend(true, {}, opts, opts.options);

          // Here we store clicked element
          opts.$orig = $item;

          obj.src = self.opts.src || opts.src || $item.attr("href");

          // Assume that simple syntax is used, for example:
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
        }

        // Each gallery object has full collection of options
        obj.opts = $.extend(true, {}, self.opts, opts);

        // Do not merge buttons array
        if ($.isArray(opts.buttons)) {
          obj.opts.buttons = opts.buttons;
        }

        if ($.fancybox.isMobile && obj.opts.mobile) {
          obj.opts = mergeOpts(obj.opts, obj.opts.mobile);
        }

        // Step 2 - Make sure we have content type, if not - try to guess
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
            obj = $.extend(true, obj, { contentType: "pdf", opts: { iframe: { preload: false } } });
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
        }

        // Step 3 - Some adjustments
        // =========================

        obj.index = self.group.length;

        if (obj.opts.smallBtn == "auto") {
          obj.opts.smallBtn = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1;
        }

        if (obj.opts.toolbar === "auto") {
          obj.opts.toolbar = !obj.opts.smallBtn;
        }

        // Find thumbnail image, check if exists and if is in the viewport
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

        obj.thumb = obj.opts.thumb || (obj.$thumb ? obj.$thumb[0].src : null);

        // "caption" is a "special" option, it can be used to customize caption per gallery item
        if ($.type(obj.opts.caption) === "function") {
          obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
        }

        if ($.type(self.opts.caption) === "function") {
          obj.opts.caption = self.opts.caption.apply(item, [self, obj]);
        }

        // Make sure we have caption as a string or jQuery object
        if (!(obj.opts.caption instanceof $)) {
          obj.opts.caption = obj.opts.caption === undefined ? "" : obj.opts.caption + "";
        }

        // Check if url contains "filter" used to filter the content
        // Example: "ajax.html #something"
        if (obj.type === "ajax") {
          srcParts = src.split(/\s+/, 2);

          if (srcParts.length > 1) {
            obj.src = srcParts.shift();

            obj.opts.filter = srcParts.shift();
          }
        }

        // Hide all buttons and disable interactivity for modal items
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
        }

        // Step 4 - Add processed object to group
        // ======================================

        self.group.push(obj);
      });

      // Update controls if gallery is already opened
      if (Object.keys(self.slides).length) {
        self.updateControls();

        // Update thumbnails, if needed
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

    addEvents: function addEvents() {
      var self = this;

      self.removeEvents();

      // Make navigation elements clickable
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
      });

      // Handle page scrolling and browser resizing
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
            keycode = e.keyCode || e.which;

        // Trap keyboard focus inside of the modal
        // =======================================

        if (keycode == 9) {
          if (current.opts.trapFocus) {
            self.focus(e);
          }

          return;
        }

        // Enable keyboard navigation
        // ==========================

        if (!current.opts.keyboard || e.ctrlKey || e.altKey || e.shiftKey || $(e.target).is("input,textarea,video,audio")) {
          return;
        }

        // Backspace and Esc keys
        if (keycode === 8 || keycode === 27) {
          e.preventDefault();

          self.close(e);

          return;
        }

        // Left arrow and Up arrow
        if (keycode === 37 || keycode === 38) {
          e.preventDefault();

          self.previous();

          return;
        }

        // Righ arrow and Down arrow
        if (keycode === 39 || keycode === 40) {
          e.preventDefault();

          self.next();

          return;
        }

        self.trigger("afterKeydown", e, keycode);
      });

      // Hide controls after some inactivity period
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

    removeEvents: function removeEvents() {
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

    previous: function previous(duration) {
      return this.jumpTo(this.currPos - 1, duration);
    },

    // Change to next gallery item
    // ===========================

    next: function next(duration) {
      return this.jumpTo(this.currPos + 1, duration);
    },

    // Switch to selected gallery item
    // ===============================

    jumpTo: function jumpTo(pos, duration) {
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
      }

      // Should loop?
      pos = parseInt(pos, 10);
      loop = self.current ? self.current.opts.loop : self.opts.loop;

      if (!loop && (pos < 0 || pos >= groupLen)) {
        return false;
      }

      // Check if opening for the first time; this helps to speed things up
      firstRun = self.firstRun = !Object.keys(self.slides).length;

      // Create slides
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

      self.updateControls();

      // Validate duration length
      current.forcedDuration = undefined;

      if ($.isNumeric(duration)) {
        current.forcedDuration = duration;
      } else {
        duration = current.opts[firstRun ? "animationDuration" : "transitionDuration"];
      }

      duration = parseInt(duration, 10);

      // Check if user has swiped the slides or if still animating
      isMoved = self.isMoved(current);

      // Make sure current slide is visible
      current.$slide.addClass("fancybox-slide--current");

      // Fresh start - reveal container, current slide and start loading content
      if (firstRun) {
        if (current.opts.animationEffect && duration) {
          self.$refs.container.css("transition-duration", duration + "ms");
        }

        self.$refs.container.addClass("fancybox-is-open").trigger("focus");

        // Attempt to load content into slide
        // This will later call `afterLoad` -> `revealContent`
        self.loadSlide(current);

        self.preload("image");

        return;
      }

      // Get actual slide/stage positions (before cleaning up)
      slidePos = $.fancybox.getTranslate(previous.$slide);
      stagePos = $.fancybox.getTranslate(self.$refs.stage);

      // Clean up all slides
      $.each(self.slides, function (index, slide) {
        $.fancybox.stop(slide.$slide, true);
      });

      if (previous.pos !== current.pos) {
        previous.isComplete = false;
      }

      previous.$slide.removeClass("fancybox-slide--complete fancybox-slide--current");

      // If slides are out of place, then animate them to correct position
      if (isMoved) {
        // Calculate horizontal swipe distance
        diff = slidePos.left - (previous.pos * slidePos.width + previous.pos * previous.opts.gutter);

        $.each(self.slides, function (index, slide) {
          slide.$slide.removeClass("fancybox-animated").removeClass(function (index, className) {
            return (className.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
          });

          // Make sure that each slide is in equal distance
          // This is mostly needed for freshly added slides, because they are not yet positioned
          var leftPos = slide.pos * slidePos.width + slide.pos * slide.opts.gutter;

          $.fancybox.setTranslate(slide.$slide, { top: 0, left: leftPos - stagePos.left + diff });

          if (slide.pos !== current.pos) {
            slide.$slide.addClass("fancybox-slide--" + (slide.pos > current.pos ? "next" : "previous"));
          }

          // Redraw to make sure that transition will start
          forceRedraw(slide.$slide);

          // Animate the slide
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

    createSlide: function createSlide(pos) {
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

    scaleToActual: function scaleToActual(x, y, duration) {
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
      scaleY = newImgHeight / imgPos.height;

      // Get center position for original image
      posX = canvasWidth * 0.5 - newImgWidth * 0.5;
      posY = canvasHeight * 0.5 - newImgHeight * 0.5;

      // Make sure image does not move away from edges
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
      });

      // Stop slideshow
      if (self.SlideShow && self.SlideShow.isActive) {
        self.SlideShow.stop();
      }
    },

    // Scale image to fit inside parent element
    // ========================================

    scaleToFit: function scaleToFit(duration) {
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

    getFitPos: function getFitPos(slide) {
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
      height = minRatio * height;

      // Adjust width/height to precisely fit into container
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

    update: function update(e) {
      var self = this;

      $.each(self.slides, function (key, slide) {
        self.updateSlide(slide, e);
      });
    },

    // Update slide content position and size
    // ======================================

    updateSlide: function updateSlide(slide, e) {
      var self = this,
          $content = slide && slide.$content,
          width = slide.width || slide.opts.width,
          height = slide.height || slide.opts.height,
          $slide = slide.$slide;

      // First, prevent caption overlap, if needed
      self.adjustCaption(slide);

      // Then resize content to fit inside the slide
      if ($content && (width || height || slide.contentType === "video") && !slide.hasError) {
        $.fancybox.stop($content);

        $.fancybox.setTranslate($content, self.getFitPos(slide));

        if (slide.pos === self.currPos) {
          self.isAnimating = false;

          self.updateCursor();
        }
      }

      // Then some adjustments
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

    centerSlide: function centerSlide(duration) {
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

    isMoved: function isMoved(slide) {
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

    updateCursor: function updateCursor(nextWidth, nextHeight) {
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

    isZoomable: function isZoomable() {
      var self = this,
          current = self.current,
          fitPos;

      // Assume that slide is zoomable if:
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

    isScaledDown: function isScaledDown(nextWidth, nextHeight) {
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

    canPan: function canPan(nextWidth, nextHeight) {
      var self = this,
          current = self.current,
          pos = null,
          rez = false;

      if (current.type === "image" && (current.isComplete || nextWidth && nextHeight) && !current.hasError) {
        rez = self.getFitPos(current);

        if (nextWidth !== undefined && nextHeight !== undefined) {
          pos = { width: nextWidth, height: nextHeight };
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

    loadSlide: function loadSlide(slide) {
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

      $slide.off("refresh").trigger("onReset").addClass(slide.opts.slideClass);

      // Create content depending on the type
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
            success: function success(data, textStatus) {
              if (textStatus === "success") {
                self.setContent(slide, data);
              }
            },
            error: function error(jqXHR, textStatus) {
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

    setImage: function setImage(slide) {
      var self = this,
          ghost;

      // Check if need to show loading icon
      setTimeout(function () {
        var $img = slide.$image;

        if (!self.isClosing && slide.isLoading && (!$img || !$img.length || !$img[0].complete) && !slide.hasError) {
          self.showLoading(slide);
        }
      }, 50);

      //Check if image has srcset
      self.checkSrcset(slide);

      // This will be wrapper containing both ghost and actual image
      slide.$content = $('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(slide.$slide.addClass("fancybox-slide--image"));

      // If we have a thumbnail, we can display it while actual image is loading
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
      }

      // Start loading actual image
      self.setBigImage(slide);
    },

    // Check if image has srcset and get the source
    // ============================================
    checkSrcset: function checkSrcset(slide) {
      var srcset = slide.opts.srcset || slide.opts.image.srcset,
          found,
          temp,
          pxRatio,
          windowWidth;

      // If we have "srcset", then we need to find first matching "src" value.
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
        });

        // Sort by value
        temp.sort(function (a, b) {
          return a.value - b.value;
        });

        // Ok, now we have an array of all srcset values
        for (var j = 0; j < temp.length; j++) {
          var el = temp[j];

          if (el.postfix === "w" && el.value >= windowWidth || el.postfix === "x" && el.value >= pxRatio) {
            found = el;
            break;
          }
        }

        // If not found, take the last one
        if (!found && temp.length) {
          found = temp[temp.length - 1];
        }

        if (found) {
          slide.src = found.url;

          // If we have default width/height values, we can calculate height for matching source
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

    setBigImage: function setBigImage(slide) {
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
        }

        // Hide temporary image after some delay
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

    resolveImageSlideSize: function resolveImageSlideSize(slide, imgWidth, imgHeight) {
      var maxWidth = parseInt(slide.opts.width, 10),
          maxHeight = parseInt(slide.opts.height, 10);

      // Sets the default values from the image
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

    setIframe: function setIframe(slide) {
      var self = this,
          opts = slide.opts.iframe,
          $slide = slide.$slide,
          $iframe;

      slide.$content = $('<div class="fancybox-content' + (opts.preload ? " fancybox-is-hidden" : "") + '"></div>').css(opts.css).appendTo($slide);

      $slide.addClass("fancybox-slide--" + slide.contentType);

      slide.$iframe = $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime())).attr(opts.attr).appendTo(slide.$content);

      if (opts.preload) {
        self.showLoading(slide);

        // Unfortunately, it is not always possible to determine if iframe is successfully loaded
        // (due to browser security policy)

        $iframe.on("load.fb error.fb", function (e) {
          this.isReady = 1;

          slide.$slide.trigger("refresh");

          self.afterLoad(slide);
        });

        // Recalculate iframe content size
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
          } catch (ignore) {}

          // Calculate content dimensions, if it is accessible
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

      $iframe.attr("src", slide.src);

      // Remove iframe if closing or changing gallery item
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

    setContent: function setContent(slide, content) {
      var self = this;

      if (self.isClosing) {
        return;
      }

      self.hideLoading(slide);

      if (slide.$content) {
        $.fancybox.stop(slide.$content);
      }

      slide.$slide.empty();

      // If content is a jQuery object, then it will be moved to the slide.
      // The placeholder is created so we will know where to put it back.
      if (isQuery(content) && content.parent().length) {
        // Make sure content is not already moved to fancyBox
        if (content.hasClass("fancybox-content") || content.parent().hasClass("fancybox-content")) {
          content.parents(".fancybox-slide").trigger("onReset");
        }

        // Create temporary element marking original place of the content
        slide.$placeholder = $("<div>").hide().insertAfter(content);

        // Make sure content is visible
        content.css("display", "inline-block");
      } else if (!slide.hasError) {
        // If content is just a plain text, try to convert it to html
        if ($.type(content) === "string") {
          content = $("<div>").append($.trim(content)).contents();
        }

        // If "filter" option is provided, then filter content
        if (slide.opts.filter) {
          content = $("<div>").html(content).find(slide.opts.filter);
        }
      }

      slide.$slide.one("onReset", function () {
        // Pause all html5 video/audio
        $(this).find("video,audio").trigger("pause");

        // Put content back
        if (slide.$placeholder) {
          slide.$placeholder.after(content.removeClass("fancybox-content").hide()).remove();

          slide.$placeholder = null;
        }

        // Remove custom close button
        if (slide.$smallBtn) {
          slide.$smallBtn.remove();

          slide.$smallBtn = null;
        }

        // Remove content and mark slide as not loaded
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

      slide.$content.siblings().hide();

      // Re-check if there is a valid content
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

    setError: function setError(slide) {
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

    showLoading: function showLoading(slide) {
      var self = this;

      slide = slide || self.current;

      if (slide && !slide.$spinner) {
        slide.$spinner = $(self.translate(self, self.opts.spinnerTpl)).appendTo(slide.$slide).hide().fadeIn("fast");
      }
    },

    // Remove loading icon from the slide
    // ==================================

    hideLoading: function hideLoading(slide) {
      var self = this;

      slide = slide || self.current;

      if (slide && slide.$spinner) {
        slide.$spinner.stop().remove();

        delete slide.$spinner;
      }
    },

    // Adjustments after slide content has been loaded
    // ===============================================

    afterLoad: function afterLoad(slide) {
      var self = this;

      if (self.isClosing) {
        return;
      }

      slide.isLoading = false;
      slide.isLoaded = true;

      self.trigger("afterLoad", slide);

      self.hideLoading(slide);

      // Add small close button
      if (slide.opts.smallBtn && (!slide.$smallBtn || !slide.$smallBtn.length)) {
        slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).appendTo(slide.$content);
      }

      // Disable right click
      if (slide.opts.protect && slide.$content && !slide.hasError) {
        slide.$content.on("contextmenu.fb", function (e) {
          if (e.button == 2) {
            e.preventDefault();
          }

          return true;
        });

        // Add fake element on top of the image
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

    adjustCaption: function adjustCaption(slide) {
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

    adjustLayout: function adjustLayout(slide) {
      var self = this,
          current = slide || self.current,
          scrollHeight,
          marginBottom,
          inlinePadding,
          actualPadding;

      if (current.isLoaded && current.opts.disableLayoutFix !== true) {
        current.$content.css("margin-bottom", "");

        // If we would always set margin-bottom for the content,
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

    revealContent: function revealContent(slide) {
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
      }

      // Check if can zoom
      if (effect === "zoom") {
        if (slide.pos === self.currPos && duration && slide.type === "image" && !slide.hasError && (start = self.getThumbPos(slide))) {
          end = self.getFitPos(slide);
        } else {
          effect = "fade";
        }
      }

      // Zoom animation
      // ==============
      if (effect === "zoom") {
        self.isAnimating = true;

        end.scaleX = end.width / start.width;
        end.scaleY = end.height / start.height;

        // Check if we need to animate opacity
        opacity = slide.opts.zoomOpacity;

        if (opacity == "auto") {
          opacity = Math.abs(slide.width / slide.height - start.width / start.height) > 0.1;
        }

        if (opacity) {
          start.opacity = 0.1;
          end.opacity = 1;
        }

        // Draw image at start position
        $.fancybox.setTranslate(slide.$content.removeClass("fancybox-is-hidden"), start);

        forceRedraw(slide.$content);

        // Start animation
        $.fancybox.animate(slide.$content, end, duration, function () {
          self.isAnimating = false;

          self.complete();
        });

        return;
      }

      self.updateSlide(slide);

      // Simply show content if no effect
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
      }

      // Prepare for CSS transiton
      // =========================
      $.fancybox.stop($slide);

      //effectClassName = "fancybox-animated fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-fx-" + effect;
      effectClassName = "fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-animated fancybox-fx-" + effect;

      $slide.addClass(effectClassName).removeClass("fancybox-slide--current"); //.addClass(effectClassName);

      slide.$content.removeClass("fancybox-is-hidden");

      // Force reflow
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

    getThumbPos: function getThumbPos(slide) {
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

    complete: function complete() {
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

        self.preload("inline");

        // Trigger any CSS transiton inside the slide
        forceRedraw(current.$slide);

        current.$slide.addClass("fancybox-slide--complete");

        // Remove unnecessary slides
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

      self.trigger("afterShow");

      // Autoplay first html5 video/audio
      if (!!current.opts.video.autoStart) {
        current.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function () {
          if (this.webkitExitFullscreen) {
            this.webkitExitFullscreen();
          }

          self.next();
        });
      }

      // Try to focus on the first focusable element
      if (current.opts.autoFocus && current.contentType === "html") {
        // Look for the first input with autofocus attribute
        $el = current.$content.find("input[autofocus]:enabled:visible:first");

        if ($el.length) {
          $el.trigger("focus");
        } else {
          self.focus(null, true);
        }
      }

      // Avoid jumping
      current.$slide.scrollTop(0).scrollLeft(0);
    },

    // Preload next and previous slides
    // ================================

    preload: function preload(type) {
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

    focus: function focus(e, firstRun) {
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

    activate: function activate() {
      var self = this;

      // Deactivate all instances
      $(".fancybox-container").each(function () {
        var instance = $(this).data("FancyBox");

        // Skip self and closing instances
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

    close: function close(e, d) {
      var self = this,
          current = self.current,
          effect,
          duration,
          $content,
          domRect,
          opacity,
          start,
          end;

      var done = function done() {
        self.cleanUp(e);
      };

      if (self.isClosing) {
        return false;
      }

      self.isClosing = true;

      // If beforeClose callback prevents closing, make sure content is centered
      if (self.trigger("beforeClose", e) === false) {
        self.isClosing = false;

        requestAFrame(function () {
          self.update();
        });

        return false;
      }

      // Remove all events
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
      }

      // Remove other slides
      current.$slide.siblings().trigger("onReset").remove();

      // Trigger animations
      if (duration) {
        self.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration", duration + "ms");
      }

      // Clean up
      self.hideLoading(current);

      self.hideControls(true);

      self.updateCursor();

      // Check if possible to zoom-out
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
        };

        // Check if we need to animate opacity
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

    cleanUp: function cleanUp(e) {
      var self = this,
          instance,
          $focus = self.current.opts.$orig,
          x,
          y;

      self.current.$slide.trigger("onReset");

      self.$refs.container.empty().remove();

      self.trigger("afterClose", e);

      // Place back focus
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

      self.current = null;

      // Check if there are other instances
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

    trigger: function trigger(name, slide) {
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

    updateControls: function updateControls() {
      var self = this,
          current = self.current,
          index = current.index,
          $container = self.$refs.container,
          $caption = self.$refs.caption,
          caption = current.opts.caption;

      // Recalculate content dimensions
      current.$slide.trigger("refresh");

      // Set caption
      if (caption && caption.length) {
        self.$caption = $caption;

        $caption.children().eq(0).html(caption);
      } else {
        self.$caption = null;
      }

      if (!self.hasHiddenControls && !self.isIdle) {
        self.showControls();
      }

      // Update info and navigation elements
      $container.find("[data-fancybox-count]").html(self.group.length);
      $container.find("[data-fancybox-index]").html(index + 1);

      $container.find("[data-fancybox-prev]").prop("disabled", !current.opts.loop && index <= 0);
      $container.find("[data-fancybox-next]").prop("disabled", !current.opts.loop && index >= self.group.length - 1);

      if (current.type === "image") {
        // Re-enable buttons; update download button source
        $container.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href", current.opts.image.src || current.src).show();
      } else if (current.opts.toolbar) {
        $container.find("[data-fancybox-download],[data-fancybox-zoom]").hide();
      }

      // Make sure focus is not on disabled button/element
      if ($(document.activeElement).is(":hidden,[disabled]")) {
        self.$refs.container.trigger("focus");
      }
    },

    // Hide toolbar and caption
    // ========================

    hideControls: function hideControls(andCaption) {
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

    showControls: function showControls() {
      var self = this,
          opts = self.current ? self.current.opts : self.opts,
          $container = self.$refs.container;

      self.hasHiddenControls = false;
      self.idleSecondsCounter = 0;

      $container.toggleClass("fancybox-show-toolbar", !!(opts.toolbar && opts.buttons)).toggleClass("fancybox-show-infobar", !!(opts.infobar && self.group.length > 1)).toggleClass("fancybox-show-caption", !!self.$caption).toggleClass("fancybox-show-nav", !!(opts.arrows && self.group.length > 1)).toggleClass("fancybox-is-modal", !!opts.modal);
    },

    // Toggle toolbar and caption
    // ==========================

    toggleControls: function toggleControls() {
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

    getInstance: function getInstance(command) {
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

    open: function open(items, opts, index) {
      return new FancyBox(items, opts, index);
    },

    // Close current or all instances
    // ==============================

    close: function close(all) {
      var instance = this.getInstance();

      if (instance) {
        instance.close();

        // Try to find and close next instance
        if (all === true) {
          this.close(all);
        }
      }
    },

    // Close all instances and unbind all events
    // =========================================

    destroy: function destroy() {
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

    getTranslate: function getTranslate($el) {
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

    setTranslate: function setTranslate($el, props) {
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

    animate: function animate($el, to, duration, callback, leaveAnimationName) {
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
      }

      // Start animation by changing CSS properties or class name
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
      }

      // Make sure that `transitionend` callback gets fired
      $el.data("timer", setTimeout(function () {
        $el.trigger(transitionEnd);
      }, duration + 33));
    },

    stop: function stop($el, callCallback) {
      if ($el && $el.length) {
        clearTimeout($el.data("timer"));

        if (callCallback) {
          $el.trigger(transitionEnd);
        }

        $el.off(transitionEnd).css("transition-duration", "");

        $el.parent().removeClass("fancybox-is-scaling");
      }
    }
  };

  // Default click handler for "fancyboxed" links
  // ============================================

  function _run(e, opts) {
    var items = [],
        index = 0,
        $target,
        value,
        instance;

    // Avoid opening multiple times
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

    index = $(items).index($target);

    // Sometimes current item can not be found
    if (index < 0) {
      index = 0;
    }

    instance = $.fancybox.open(items, opts, index);

    // Save last active element
    instance.$trigger = $target;
  }

  // Create a jQuery plugin
  // ======================

  $.fn.fancybox = function (options) {
    var selector;

    options = options || {};
    selector = options.selector || false;

    if (selector) {
      // Use body element instead of document so it executes first
      $("body").off("click.fb-start", selector).on("click.fb-start", selector, { options: options }, _run);
    } else {
      this.off("click.fb-start").on("click.fb-start", {
        items: this,
        options: options
      }, _run);
    }

    return this;
  };

  // Self initializing plugin for all elements having `data-fancybox` attribute
  // ==========================================================================

  $D.on("click.fb-start", "[data-fancybox]", _run);

  // Enable "trigger elements"
  // =========================

  $D.on("click.fb-start", "[data-fancybox-trigger]", function (e) {
    $('[data-fancybox="' + $(this).attr("data-fancybox-trigger") + '"]').eq($(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", {
      $trigger: $(this)
    });
  });

  // Track focus event for better accessibility styling
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
})(window, document, jQuery);

// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================
(function ($) {
  "use strict";

  // Object containing properties for each media type

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
      url: function url(rez) {
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
      url: function url(rez) {
        return "//maps.google." + rez[2] + "/maps?q=" + rez[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
      }
    }
  };

  // Formats matching url to final form
  var format = function format(url, rez, params) {
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

    media = $.extend(true, {}, defaults, item.opts.media);

    // Look for any matching media type
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
    });

    // If it is found, then change content type and update the url

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
  });

  // Load YouTube/Video API on request to detect when video finished playing
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

    load: function load(vendor) {
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
    done: function done(vendor) {
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
              onStateChange: function onStateChange(e) {
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
    "afterShow.fb": function afterShowFb(e, instance, current) {
      if (instance.group.length > 1 && (current.contentSource === "youtube" || current.contentSource === "vimeo")) {
        VideoAPILoader.load(current.contentSource);
      }
    }
  });
})(jQuery);

// ==========================================================================
//
// Guestures
// Adds touch guestures, handles click and tap events
//
// ==========================================================================
(function (window, document, $) {
  "use strict";

  var requestAFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }();

  var cancelAFrame = function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
      window.clearTimeout(id);
    };
  }();

  var getPointerXY = function getPointerXY(e) {
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

  var distance = function distance(point2, point1, what) {
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

  var isClickable = function isClickable($el) {
    if ($el.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || $.isFunction($el.get(0).onclick) || $el.data("selectable")) {
      return true;
    }

    // Check for attributes like data-fancybox-next or data-fancybox-close
    for (var i = 0, atts = $el[0].attributes, n = atts.length; i < n; i++) {
      if (atts[i].nodeName.substr(0, 14) === "data-fancybox-") {
        return true;
      }
    }

    return false;
  };

  var hasScrollbars = function hasScrollbars(el) {
    var overflowY = window.getComputedStyle(el)["overflow-y"],
        overflowX = window.getComputedStyle(el)["overflow-x"],
        vertical = (overflowY === "scroll" || overflowY === "auto") && el.scrollHeight > el.clientHeight,
        horizontal = (overflowX === "scroll" || overflowX === "auto") && el.scrollWidth > el.clientWidth;

    return vertical || horizontal;
  };

  var isScrollable = function isScrollable($el) {
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

  var Guestures = function Guestures(instance) {
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
        isTouchDevice = e.type == "touchstart";

    // Do not respond to both (touch and mouse) events
    if (isTouchDevice) {
      self.$container.off("mousedown.fb.touch");
    }

    // Ignore right click
    if (e.originalEvent && e.originalEvent.button == 2) {
      return;
    }

    // Ignore taping on links, buttons, input elements
    if (!$slide.length || !$target.length || isClickable($target) || isClickable($target.parent())) {
      return;
    }
    // Ignore clicks on the scrollbar
    if (!$target.is("img") && e.originalEvent.clientX > $target[0].clientWidth + $target.offset().left) {
      return;
    }

    // Ignore clicks while zooming or closing
    if (!current || instance.isAnimating || current.$slide.hasClass("fancybox-animated")) {
      e.stopPropagation();
      e.preventDefault();

      return;
    }

    self.realPoints = self.startPoints = getPointerXY(e);

    if (!self.startPoints.length) {
      return;
    }

    // Allow other scripts to catch touch event if "touch" is set to false
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
    self.contentStartPos = $.fancybox.getTranslate(self.$content) || { top: 0, left: 0 };
    self.sliderStartPos = $.fancybox.getTranslate($slide);

    // Since position will be absolute, but we need to make it relative to the stage
    self.stagePos = $.fancybox.getTranslate(instance.$refs.stage);

    self.sliderStartPos.top -= self.stagePos.top;
    self.sliderStartPos.left -= self.stagePos.left;

    self.contentStartPos.top -= self.stagePos.top;
    self.contentStartPos.left -= self.stagePos.left;

    $(document).off(".fb.touch").on(isTouchDevice ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", $.proxy(self, "ontouchend")).on(isTouchDevice ? "touchmove.fb.touch" : "mousemove.fb.touch", $.proxy(self, "ontouchmove"));

    if ($.fancybox.isMobile) {
      document.addEventListener("scroll", self.onscroll, true);
    }

    // Skip if clicked outside the sliding area
    if (!(self.opts || self.canPan) || !($target.is(self.$stage) || self.$stage.find($target).length)) {
      if ($target.is(".fancybox-image")) {
        e.preventDefault();
      }

      if (!($.fancybox.isMobile && $target.parents(".fancybox-caption").length)) {
        return;
      }
    }

    self.isScrollable = isScrollable($target) || isScrollable($target.parent());

    // Check if element is scrollable and try to prevent default behavior (scrolling)
    if (!($.fancybox.isMobile && self.isScrollable)) {
      e.preventDefault();
    }

    // One finger or mouse click - swipe or pan an image
    if (self.startPoints.length === 1 || current.hasError) {
      if (self.canPan) {
        $.fancybox.stop(self.$content);

        self.isPanning = true;
      } else {
        self.isSwiping = true;
      }

      self.$container.addClass("fancybox-is-grabbing");
    }

    // Two fingers - zoom image
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
    var self = this;

    // Make sure user has not released over iframe or disabled element
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

    self.distance = distance(self.newPoints[0], self.startPoints[0]);

    // Skip false ontouchmove events (Chrome)
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
        angle;

    // If direction is not yet determined
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

        instance.isDragging = self.isSwiping;

        // Reset points to avoid jumping, because we dropped first swipes to calculate the angle
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
        });

        // Stop slideshow
        if (instance.SlideShow && instance.SlideShow.isActive) {
          instance.SlideShow.stop();
        }
      }

      return;
    }

    // Sticky edges
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
    var self = this;

    // Prevent accidental movement (sometimes, when tapping casually, finger can move a bit)
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
  };

  // Make panning sticky to the edges
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

    newOffsetY = currentOffsetY + distanceY;

    // Slow down proportionally to traveled distance
    minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
    minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);

    maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
    maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5);

    //   ->
    if (distanceX > 0 && newOffsetX > minTranslateX) {
      newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
    }

    //    <-
    if (distanceX < 0 && newOffsetX < maxTranslateX) {
      newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
    }

    //   \/
    if (distanceY > 0 && newOffsetY > minTranslateY) {
      newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
    }

    //   /\
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
    var self = this;

    // Calculate current distance between points to get pinch ratio and new width and height
    var contentStartPos = self.contentStartPos;

    var currentWidth = contentStartPos.width;
    var currentHeight = contentStartPos.height;

    var currentOffsetX = contentStartPos.left;
    var currentOffsetY = contentStartPos.top;

    var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);

    var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;

    var newWidth = Math.floor(currentWidth * pinchRatio);
    var newHeight = Math.floor(currentHeight * pinchRatio);

    // This is the translation due to pinch-zooming
    var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
    var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;

    // Point between the two touches
    var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - $(window).scrollLeft();
    var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - $(window).scrollTop();

    // And this is the translation due to translation of the centerpoint
    // between the two fingers
    var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
    var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;

    // The new offset is the old/current one plus the total translation
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

    self.speed = 100;

    // Speed in px/ms
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

    self.sliderLastPos = null;

    // Close if swiped vertically / navigate if horizontally
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
  };

  // Limit panning from edges
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
    };

    // Reset scalex/scaleY values; this helps for perfomance and does not break animation
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

    var process = function process(prefix) {
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
    };

    // Ignore right click
    if (e.originalEvent && e.originalEvent.button == 2) {
      return;
    }

    // Skip if clicked on the scrollbar
    if (!$target.is("img") && tapX > $target[0].clientWidth + $target.offset().left) {
      return;
    }

    // Check where is clicked
    if ($target.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) {
      where = "Outside";
    } else if ($target.is(".fancybox-slide")) {
      where = "Slide";
    } else if (instance.current.$content && instance.current.$content.find($target).addBack().filter($target).length) {
      where = "Content";
    } else {
      return;
    }

    // Check if this is a double tap
    if (self.tapped) {
      // Stop previously created single tap
      clearTimeout(self.tapped);
      self.tapped = null;

      // Skip if distance between taps is too big
      if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50) {
        return this;
      }

      // OK, now we assume that this is a double-tap
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
})(window, document, jQuery);

// ==========================================================================
//
// SlideShow
// Enables slideshow functionality
//
// Example of usage:
// $.fancybox.getInstance().SlideShow.start()
//
// ==========================================================================
(function (document, $) {
  "use strict";

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

  var SlideShow = function SlideShow(instance) {
    this.instance = instance;
    this.init();
  };

  $.extend(SlideShow.prototype, {
    timer: null,
    isActive: false,
    $button: null,

    init: function init() {
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

    set: function set(force) {
      var self = this,
          instance = self.instance,
          current = instance.current;

      // Check if reached last element
      if (current && (force === true || current.opts.loop || instance.currIndex < instance.group.length - 1)) {
        if (self.isActive && current.contentType !== "video") {
          if (self.$progress) {
            $.fancybox.animate(self.$progress.show(), { scaleX: 1 }, current.opts.slideShow.speed);
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

    clear: function clear() {
      var self = this;

      clearTimeout(self.timer);

      self.timer = null;

      if (self.$progress) {
        self.$progress.removeAttr("style").hide();
      }
    },

    start: function start() {
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

    stop: function stop() {
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

    toggle: function toggle() {
      var self = this;

      if (self.isActive) {
        self.stop();
      } else {
        self.start();
      }
    }
  });

  $(document).on({
    "onInit.fb": function onInitFb(e, instance) {
      if (instance && !instance.SlideShow) {
        instance.SlideShow = new SlideShow(instance);
      }
    },

    "beforeShow.fb": function beforeShowFb(e, instance, current, firstRun) {
      var SlideShow = instance && instance.SlideShow;

      if (firstRun) {
        if (SlideShow && current.opts.slideShow.autoStart) {
          SlideShow.start();
        }
      } else if (SlideShow && SlideShow.isActive) {
        SlideShow.clear();
      }
    },

    "afterShow.fb": function afterShowFb(e, instance, current) {
      var SlideShow = instance && instance.SlideShow;

      if (SlideShow && SlideShow.isActive) {
        SlideShow.set();
      }
    },

    "afterKeydown.fb": function afterKeydownFb(e, instance, current, keypress, keycode) {
      var SlideShow = instance && instance.SlideShow;

      // "P" or Spacebar
      if (SlideShow && current.opts.slideShow && (keycode === 80 || keycode === 32) && !$(document.activeElement).is("button,a,input")) {
        keypress.preventDefault();

        SlideShow.toggle();
      }
    },

    "beforeClose.fb onDeactivate.fb": function beforeCloseFbOnDeactivateFb(e, instance) {
      var SlideShow = instance && instance.SlideShow;

      if (SlideShow) {
        SlideShow.stop();
      }
    }
  });

  // Page Visibility API to pause slideshow when window is not active
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
})(document, jQuery);

// ==========================================================================
//
// FullScreen
// Adds fullscreen functionality
//
// ==========================================================================
(function (document, $) {
  "use strict";

  // Collection of methods supported by user browser

  var fn = function () {
    var fnMap = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
    // new WebKit
    ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
    // old WebKit (Safari 5.1)
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
      request: function request(elem) {
        elem = elem || document.documentElement;

        elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
      },
      exit: function exit() {
        document[fn.exitFullscreen]();
      },
      toggle: function toggle(elem) {
        elem = elem || document.documentElement;

        if (this.isFullscreen()) {
          this.exit();
        } else {
          this.request(elem);
        }
      },
      isFullscreen: function isFullscreen() {
        return Boolean(document[fn.fullscreenElement]);
      },
      enabled: function enabled() {
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
    "onInit.fb": function onInitFb(e, instance) {
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
        }

        // Expose API
        instance.FullScreen = FullScreen;
      } else if (instance) {
        instance.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();
      }
    },

    "afterKeydown.fb": function afterKeydownFb(e, instance, current, keypress, keycode) {
      // "F"
      if (instance && instance.FullScreen && keycode === 70) {
        keypress.preventDefault();

        instance.FullScreen.toggle();
      }
    },

    "beforeClose.fb": function beforeCloseFb(e, instance) {
      if (instance && instance.FullScreen && instance.$refs.container.hasClass("fancybox-is-fullscreen")) {
        FullScreen.exit();
      }
    }
  });
})(document, jQuery);

// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
(function (document, $) {
  "use strict";

  var CLASS = "fancybox-thumbs",
      CLASS_ACTIVE = CLASS + "-active";

  // Make sure there are default values
  $.fancybox.defaults = $.extend(true, {
    btnTpl: {
      thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg>' + "</button>"
    },
    thumbs: {
      autoStart: false, // Display thumbnails on opening
      hideOnClose: true, // Hide thumbnail grid when closing animation starts
      parentEl: ".fancybox-container", // Container is injected into this element
      axis: "y" // Vertical (y) or horizontal (x) scrolling
    }
  }, $.fancybox.defaults);

  var FancyThumbs = function FancyThumbs(instance) {
    this.init(instance);
  };

  $.extend(FancyThumbs.prototype, {
    $button: null,
    $grid: null,
    $list: null,
    isVisible: false,
    isActive: false,

    init: function init(instance) {
      var self = this,
          group = instance.group,
          enabled = 0;

      self.instance = instance;
      self.opts = group[instance.currIndex].opts.thumbs;

      instance.Thumbs = self;

      self.$button = instance.$refs.toolbar.find("[data-fancybox-thumbs]");

      // Enable thumbs if at least two group items have thumbnails
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

    create: function create() {
      var self = this,
          instance = self.instance,
          parentEl = self.opts.parentEl,
          list = [],
          src;

      if (!self.$grid) {
        // Create main element
        self.$grid = $('<div class="' + CLASS + " " + CLASS + "-" + self.opts.axis + '"></div>').appendTo(instance.$refs.container.find(parentEl).addBack().filter(parentEl));

        // Add "click" event that performs gallery navigation
        self.$grid.on("click", "a", function () {
          instance.jumpTo($(this).attr("data-index"));
        });
      }

      // Build the list
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

    focus: function focus(duration) {
      var self = this,
          $list = self.$list,
          $grid = self.$grid,
          thumb,
          thumbPos;

      if (!self.instance.current) {
        return;
      }

      thumb = $list.children().removeClass(CLASS_ACTIVE).filter('[data-index="' + self.instance.current.index + '"]').addClass(CLASS_ACTIVE);

      thumbPos = thumb.position();

      // Check if need to scroll to make current thumb visible
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

    update: function update() {
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
      }

      // Update content position
      that.instance.update();
    },

    hide: function hide() {
      this.isVisible = false;
      this.update();
    },

    show: function show() {
      this.isVisible = true;
      this.update();
    },

    toggle: function toggle() {
      this.isVisible = !this.isVisible;
      this.update();
    }
  });

  $(document).on({
    "onInit.fb": function onInitFb(e, instance) {
      var Thumbs;

      if (instance && !instance.Thumbs) {
        Thumbs = new FancyThumbs(instance);

        if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
          Thumbs.show();
        }
      }
    },

    "beforeShow.fb": function beforeShowFb(e, instance, item, firstRun) {
      var Thumbs = instance && instance.Thumbs;

      if (Thumbs && Thumbs.isVisible) {
        Thumbs.focus(firstRun ? 0 : 250);
      }
    },

    "afterKeydown.fb": function afterKeydownFb(e, instance, current, keypress, keycode) {
      var Thumbs = instance && instance.Thumbs;

      // "G"
      if (Thumbs && Thumbs.isActive && keycode === 71) {
        keypress.preventDefault();

        Thumbs.toggle();
      }
    },

    "beforeClose.fb": function beforeCloseFb(e, instance) {
      var Thumbs = instance && instance.Thumbs;

      if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
        Thumbs.$grid.hide();
      }
    }
  });
})(document, jQuery);

//// ==========================================================================
//
// Share
// Displays simple form for sharing current url
//
// ==========================================================================
(function (document, $) {
  "use strict";

  $.extend(true, $.fancybox.defaults, {
    btnTpl: {
      share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg>' + "</button>"
    },
    share: {
      url: function url(instance, item) {
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
        afterLoad: function afterLoad(shareInstance, shareCurrent) {
          // Close self if parent instance is closing
          instance.$refs.container.one("beforeClose.fb", function () {
            shareInstance.close(null, 0);
          });

          // Opening links in a popup window
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
})(document, jQuery);

// ==========================================================================
//
// Hash
// Enables linking to each modal
//
// ==========================================================================
(function (window, document, $) {
  "use strict";

  // Simple $.escapeSelector polyfill (for jQuery prior v3)

  if (!$.escapeSelector) {
    $.escapeSelector = function (sel) {
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      var fcssescape = function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
          // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
          if (ch === "\0") {
            return "\uFFFD";
          }

          // Control characters and (dependent upon position) numbers get escaped as code points
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }

        // Other potentially-special ASCII characters get backslash-escaped
        return "\\" + ch;
      };

      return (sel + "").replace(rcssescape, fcssescape);
    };
  }

  // Get info about gallery name and current index from url
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
  }

  // Trigger click evnt on links to open new fancyBox instance
  function triggerFromUrl(url) {
    if (url.gallery !== "") {
      // If we can find element matching 'data-fancybox' atribute,
      // then triggering click event should start fancyBox
      $("[data-fancybox='" + $.escapeSelector(url.gallery) + "']").eq(url.index - 1).focus().trigger("click.fb-start");
    }
  }

  // Get gallery name from current instance
  function getGalleryID(instance) {
    var opts, ret;

    if (!instance) {
      return false;
    }

    opts = instance.current ? instance.current.opts : instance.opts;
    ret = opts.hash || (opts.$orig ? opts.$orig.data("fancybox") || opts.$orig.data("fancybox-trigger") : "");

    return ret === "" ? false : ret;
  }

  // Start when DOM becomes ready
  $(function () {
    // Check if user has disabled this module
    if ($.fancybox.defaults.hash === false) {
      return;
    }

    // Update hash when opening/closing fancyBox
    $(document).on({
      "onInit.fb": function onInitFb(e, instance) {
        var url, gallery;

        if (instance.group[instance.currIndex].opts.hash === false) {
          return;
        }

        url = parseUrl();
        gallery = getGalleryID(instance);

        // Make sure gallery start index matches index from hash
        if (gallery && url.gallery && gallery == url.gallery) {
          instance.currIndex = url.index - 1;
        }
      },

      "beforeShow.fb": function beforeShowFb(e, instance, current, firstRun) {
        var gallery;

        if (!current || current.opts.hash === false) {
          return;
        }

        // Check if need to update window hash
        gallery = getGalleryID(instance);

        if (!gallery) {
          return;
        }

        // Variable containing last hash value set by fancyBox
        // It will be used to determine if fancyBox needs to close after hash change is detected
        instance.currentHash = gallery + (instance.group.length > 1 ? "-" + (current.index + 1) : "");

        // If current hash is the same (this instance most likely is opened by hashchange), then do nothing
        if (window.location.hash === "#" + instance.currentHash) {
          return;
        }

        if (firstRun && !instance.origHash) {
          instance.origHash = window.location.hash;
        }

        if (instance.hashTimer) {
          clearTimeout(instance.hashTimer);
        }

        // Update hash
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

      "beforeClose.fb": function beforeCloseFb(e, instance, current) {
        if (!current || current.opts.hash === false) {
          return;
        }

        clearTimeout(instance.hashTimer);

        // Goto previous history entry
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
    });

    // Check if need to start/close after url has changed
    $(window).on("hashchange.fb", function () {
      var url = parseUrl(),
          fb = null;

      // Find last fancyBox instance that has "hash"
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
    });

    // Check current hash and trigger click event on matching element to start fancyBox, if needed
    setTimeout(function () {
      if (!$.fancybox.getInstance()) {
        triggerFromUrl(parseUrl());
      }
    }, 50);
  });
})(window, document, jQuery);

// ==========================================================================
//
// Wheel
// Basic mouse weheel support for gallery navigation
//
// ==========================================================================
(function (document, $) {
  "use strict";

  var prevTime = new Date().getTime();

  $(document).on({
    "onInit.fb": function onInitFb(e, instance, current) {
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
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! responsive-nav.js 1.0.39
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2015 @viljamis
 * Available under the MIT license
 */

/* global Event */
(function (document, window, index) {
  // Index is used to keep multiple navs on the same page namespaced

  "use strict";

  var responsiveNav = function responsiveNav(el, options) {

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
    var addEvent = function addEvent(el, evt, fn, bubble) {
      if ("addEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
          el.addEventListener(evt, fn, bubble);
        } catch (e) {
          if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
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
        if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
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
    removeEvent = function removeEvent(el, evt, fn, bubble) {
      if ("removeEventListener" in el) {
        try {
          el.removeEventListener(evt, fn, bubble);
        } catch (e) {
          if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
            el.removeEventListener(evt, function (e) {
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
      } else if ("detachEvent" in el) {
        if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
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
    getChildren = function getChildren(e) {
      if (e.children.length < 1) {
        throw new Error("The Nav container has no containing elements");
      }
      // Store all children in array
      var children = [];
      // Loop through children and store in array if child != TextNode
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
    setAttributes = function setAttributes(el, attrs) {
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
    addClass = function addClass(el, cls) {
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
    removeClass = function removeClass(el, cls) {
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
    forEach = function forEach(array, callback, scope) {
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

    var ResponsiveNav = function ResponsiveNav(el, options) {
      var i;

      /**
       * Default options
       * @type {Object}
       */
      this.options = {
        animate: true, // Boolean: Use CSS3 transitions, true or false
        transition: 284, // Integer: Speed of the transition, in milliseconds
        label: "Menu", // String: Label for the navigation toggle
        insert: "before", // String: Insert the toggle before or after the navigation
        customToggle: "", // Selector: Specify the ID of a custom toggle
        closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
        openPos: "relative", // String: Position of the opened nav, relative or static
        navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
        navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
        jsClass: "js", // String: 'JS enabled' class which is added to <html> element
        init: function init() {}, // Function: Init callback
        open: function open() {}, // Function: Open callback
        close: function close() {} // Function: Close callback
      };

      // User defined options
      for (i in options) {
        this.options[i] = options[i];
      }

      // Adds "js" class for <html>
      addClass(htmlEl, this.options.jsClass);

      // Wrapper
      this.wrapperEl = el.replace("#", "");

      // Try selecting ID first
      if (document.getElementById(this.wrapperEl)) {
        this.wrapper = document.getElementById(this.wrapperEl);

        // If element with an ID doesn't exist, use querySelector
      } else if (document.querySelector(this.wrapperEl)) {
        this.wrapper = document.querySelector(this.wrapperEl);

        // If element doesn't exists, stop here.
      } else {
        throw new Error("The nav element you are trying to select doesn't exist");
      }

      // Inner wrapper
      this.wrapper.inner = getChildren(this.wrapper);

      // For minification
      opts = this.options;
      nav = this.wrapper;

      // Init
      this._init(this);
    };

    ResponsiveNav.prototype = {

      /**
       * Unattaches events and removes any classes that were added
       */
      destroy: function destroy() {
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
      toggle: function toggle() {
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
      open: function open() {
        if (!navOpen) {
          removeClass(nav, "closed");
          addClass(nav, "opened");
          addClass(htmlEl, opts.navActiveClass);
          addClass(navToggle, "active");
          nav.style.position = opts.openPos;
          setAttributes(nav, { "aria-hidden": "false" });
          navOpen = true;
          opts.open();
        }
      },

      /**
       * Closes the navigation
       */
      close: function close() {
        if (navOpen) {
          addClass(nav, "closed");
          removeClass(nav, "opened");
          removeClass(htmlEl, opts.navActiveClass);
          removeClass(navToggle, "active");
          setAttributes(nav, { "aria-hidden": "true" });

          // If animations are enabled, wait until they finish
          if (opts.animate) {
            hasAnimFinished = false;
            setTimeout(function () {
              nav.style.position = "absolute";
              hasAnimFinished = true;
            }, opts.transition + 10);

            // Animations aren't enabled, we can do these immediately
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
      resize: function resize() {

        // Resize watches navigation toggle's display state
        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

          isMobile = true;
          setAttributes(navToggle, { "aria-hidden": "false" });

          // If the navigation is hidden
          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
            setAttributes(nav, { "aria-hidden": "true" });
            nav.style.position = "absolute";
          }

          this._createStyles();
          this._calcHeight();
        } else {

          isMobile = false;
          setAttributes(navToggle, { "aria-hidden": "true" });
          setAttributes(nav, { "aria-hidden": "false" });
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
      handleEvent: function handleEvent(e) {
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
      _init: function _init() {
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
      _createStyles: function _createStyles() {
        if (!styleElement.parentNode) {
          styleElement.type = "text/css";
          document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
      },

      /**
       * Removes styles from the <head>
       */
      _removeStyles: function _removeStyles() {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      },

      /**
       * Creates Navigation Toggle
       */
      _createToggle: function _createToggle() {

        // If there's no toggle, let's create one
        if (!opts.customToggle) {
          var toggle = document.createElement("a");
          toggle.innerHTML = opts.label;
          setAttributes(toggle, {
            "href": "#",
            "class": "nav-toggle"
          });

          // Determine where to insert the toggle
          if (opts.insert === "after") {
            nav.parentNode.insertBefore(toggle, nav.nextSibling);
          } else {
            nav.parentNode.insertBefore(toggle, nav);
          }

          navToggle = toggle;

          // There is a toggle already, let's use that one
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
      _closeOnNavClick: function _closeOnNavClick() {
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
      _preventDefault: function _preventDefault(e) {
        if (e.preventDefault) {
          if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          }
          e.preventDefault();
          e.stopPropagation();
          return false;

          // This is strictly for old IE
        } else {
          e.returnValue = false;
        }
      },

      /**
       * On touch start we get the location of the touch.
       *
       * @param  {event} event
       */
      _onTouchStart: function _onTouchStart(e) {
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
      _onTouchMove: function _onTouchMove(e) {
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
          this.touchHasMoved = true;
        }
      },

      /**
       * On touch end toggle the navigation.
       *
       * @param  {event} event
       */
      _onTouchEnd: function _onTouchEnd(e) {
        this._preventDefault(e);
        if (!isMobile) {
          return;
        }

        // If the user isn't scrolling
        if (!this.touchHasMoved) {

          // If the event type is touch
          if (e.type === "touchend") {
            this.toggle();
            return;

            // Event type was click, not touch
          } else {
            var evt = e || window.event;

            // If it isn't a right click, do toggling
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
      _onKeyUp: function _onKeyUp(e) {
        var evt = e || window.event;
        if (evt.keyCode === 13) {
          this.toggle();
        }
      },

      /**
       * Adds the needed CSS transitions if animations are enabled
       */
      _transitions: function _transitions() {
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
      _calcHeight: function _calcHeight() {
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

  if (typeof module !== "undefined" && module.exports) {
    module.exports = responsiveNav;
  } else {
    window.responsiveNav = responsiveNav;
  }
})(document, window, 0);
"use strict";

var nav = responsiveNav(".nav-collapse");

jQuery(document).ready(function ($) {

		$("[data-fancybox]").fancybox({
				loop: true
		});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5mYW5jeWJveC5qcyIsInJlc3BvbnNpdmUtbmF2LmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImRvY3VtZW50IiwiJCIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJpbmZvIiwic3R1ZmYiLCJmbiIsImZhbmN5Ym94IiwiZGVmYXVsdHMiLCJjbG9zZUV4aXN0aW5nIiwibG9vcCIsImd1dHRlciIsImtleWJvYXJkIiwicHJldmVudENhcHRpb25PdmVybGFwIiwiYXJyb3dzIiwiaW5mb2JhciIsInNtYWxsQnRuIiwidG9vbGJhciIsImJ1dHRvbnMiLCJpZGxlVGltZSIsInByb3RlY3QiLCJtb2RhbCIsImltYWdlIiwicHJlbG9hZCIsImFqYXgiLCJzZXR0aW5ncyIsImRhdGEiLCJpZnJhbWUiLCJ0cGwiLCJjc3MiLCJhdHRyIiwic2Nyb2xsaW5nIiwidmlkZW8iLCJmb3JtYXQiLCJhdXRvU3RhcnQiLCJkZWZhdWx0VHlwZSIsImFuaW1hdGlvbkVmZmVjdCIsImFuaW1hdGlvbkR1cmF0aW9uIiwiem9vbU9wYWNpdHkiLCJ0cmFuc2l0aW9uRWZmZWN0IiwidHJhbnNpdGlvbkR1cmF0aW9uIiwic2xpZGVDbGFzcyIsImJhc2VDbGFzcyIsImJhc2VUcGwiLCJzcGlubmVyVHBsIiwiZXJyb3JUcGwiLCJidG5UcGwiLCJkb3dubG9hZCIsInpvb20iLCJjbG9zZSIsImFycm93TGVmdCIsImFycm93UmlnaHQiLCJwYXJlbnRFbCIsImhpZGVTY3JvbGxiYXIiLCJhdXRvRm9jdXMiLCJiYWNrRm9jdXMiLCJ0cmFwRm9jdXMiLCJmdWxsU2NyZWVuIiwidG91Y2giLCJ2ZXJ0aWNhbCIsIm1vbWVudHVtIiwiaGFzaCIsIm1lZGlhIiwic2xpZGVTaG93Iiwic3BlZWQiLCJ0aHVtYnMiLCJoaWRlT25DbG9zZSIsImF4aXMiLCJ3aGVlbCIsIm9uSW5pdCIsIm5vb3AiLCJiZWZvcmVMb2FkIiwiYWZ0ZXJMb2FkIiwiYmVmb3JlU2hvdyIsImFmdGVyU2hvdyIsImJlZm9yZUNsb3NlIiwiYWZ0ZXJDbG9zZSIsIm9uQWN0aXZhdGUiLCJvbkRlYWN0aXZhdGUiLCJjbGlja0NvbnRlbnQiLCJjdXJyZW50IiwiZXZlbnQiLCJ0eXBlIiwiY2xpY2tTbGlkZSIsImNsaWNrT3V0c2lkZSIsImRibGNsaWNrQ29udGVudCIsImRibGNsaWNrU2xpZGUiLCJkYmxjbGlja091dHNpZGUiLCJtb2JpbGUiLCJsYW5nIiwiaTE4biIsImVuIiwiQ0xPU0UiLCJORVhUIiwiUFJFViIsIkVSUk9SIiwiUExBWV9TVEFSVCIsIlBMQVlfU1RPUCIsIkZVTExfU0NSRUVOIiwiVEhVTUJTIiwiRE9XTkxPQUQiLCJTSEFSRSIsIlpPT00iLCJkZSIsIiRXIiwiJEQiLCJjYWxsZWQiLCJpc1F1ZXJ5Iiwib2JqIiwiaGFzT3duUHJvcGVydHkiLCJyZXF1ZXN0QUZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwib1JlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwic2V0VGltZW91dCIsImNhbmNlbEFGcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwid2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJtb3pDYW5jZWxBbmltYXRpb25GcmFtZSIsIm9DYW5jZWxBbmltYXRpb25GcmFtZSIsImlkIiwiY2xlYXJUaW1lb3V0IiwidHJhbnNpdGlvbkVuZCIsImVsIiwiY3JlYXRlRWxlbWVudCIsInQiLCJ0cmFuc2l0aW9ucyIsInRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJXZWJraXRUcmFuc2l0aW9uIiwic3R5bGUiLCJmb3JjZVJlZHJhdyIsIiRlbCIsImxlbmd0aCIsIm9mZnNldEhlaWdodCIsIm1lcmdlT3B0cyIsIm9wdHMxIiwib3B0czIiLCJyZXoiLCJleHRlbmQiLCJlYWNoIiwia2V5IiwidmFsdWUiLCJpc0FycmF5IiwiaW5WaWV3cG9ydCIsImVsZW0iLCJlbGVtQ2VudGVyIiwib3duZXJEb2N1bWVudCIsIngiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0Iiwib2Zmc2V0V2lkdGgiLCJ5IiwidG9wIiwiZWxlbWVudEZyb21Qb2ludCIsIkZhbmN5Qm94IiwiY29udGVudCIsIm9wdHMiLCJpbmRleCIsInNlbGYiLCJpc1BsYWluT2JqZWN0IiwiaXNNb2JpbGUiLCJjdXJySW5kZXgiLCJwYXJzZUludCIsInByZXZJbmRleCIsInByZXZQb3MiLCJjdXJyUG9zIiwiZmlyc3RSdW4iLCJncm91cCIsInNsaWRlcyIsImFkZENvbnRlbnQiLCJpbml0IiwicHJvdG90eXBlIiwiZmlyc3RJdGVtIiwiZmlyc3RJdGVtT3B0cyIsIiRjb250YWluZXIiLCJidXR0b25TdHIiLCJhZGRDbGFzcyIsImdldEluc3RhbmNlIiwiYm9keSIsInNjcm9sbEhlaWdodCIsImlubmVySGVpZ2h0IiwiYXBwZW5kIiwiaW5uZXJXaWR0aCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFdpZHRoIiwidHJhbnNsYXRlIiwicmVwbGFjZSIsImFwcGVuZFRvIiwiJHJlZnMiLCJjb250YWluZXIiLCJmb3JFYWNoIiwiaXRlbSIsImZpbmQiLCJ0cmlnZ2VyIiwiYWN0aXZhdGUiLCJqdW1wVG8iLCJzdHIiLCJhcnIiLCJtYXRjaCIsIm4iLCJpdGVtcyIsIm1ha2VBcnJheSIsImkiLCIkaXRlbSIsImZvdW5kIiwic3JjIiwic3JjUGFydHMiLCJvcHRpb25zIiwiJG9yaWciLCJjb250ZW50VHlwZSIsImNoYXJBdCIsImluQXJyYXkiLCIkdGh1bWIiLCIkdHJpZ2dlciIsInRodW1iIiwiY2FwdGlvbiIsImFwcGx5Iiwic3BsaXQiLCJzaGlmdCIsImZpbHRlciIsInB1c2giLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlQ29udHJvbHMiLCJUaHVtYnMiLCJpc0FjdGl2ZSIsImNyZWF0ZSIsImZvY3VzIiwiYWRkRXZlbnRzIiwicmVtb3ZlRXZlbnRzIiwib24iLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJwcmV2aW91cyIsIm5leHQiLCJpc1NjYWxlZERvd24iLCJvcmlnaW5hbEV2ZW50IiwicmVxdWVzdElkIiwidXBkYXRlIiwic3RhZ2UiLCJoaWRlIiwic2hvdyIsImluc3RhbmNlIiwia2V5Y29kZSIsImtleUNvZGUiLCJ3aGljaCIsImN0cmxLZXkiLCJhbHRLZXkiLCJzaGlmdEtleSIsInRhcmdldCIsImlzIiwiaWRsZVNlY29uZHNDb3VudGVyIiwiaXNJZGxlIiwic2hvd0NvbnRyb2xzIiwiaWRsZUludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJpc0RyYWdnaW5nIiwiaGlkZUNvbnRyb2xzIiwib2ZmIiwiY2xlYXJJbnRlcnZhbCIsImR1cmF0aW9uIiwicG9zIiwiZ3JvdXBMZW4iLCJpc01vdmVkIiwic2xpZGVQb3MiLCJzdGFnZVBvcyIsInByb3AiLCJkaWZmIiwiaXNDbG9zaW5nIiwiaXNBbmltYXRpbmciLCJjcmVhdGVTbGlkZSIsImZvcmNlZER1cmF0aW9uIiwiaXNOdW1lcmljIiwiJHNsaWRlIiwibG9hZFNsaWRlIiwiZ2V0VHJhbnNsYXRlIiwic2xpZGUiLCJzdG9wIiwiaXNDb21wbGV0ZSIsInJlbW92ZUNsYXNzIiwid2lkdGgiLCJjbGFzc05hbWUiLCJqb2luIiwibGVmdFBvcyIsInNldFRyYW5zbGF0ZSIsImFuaW1hdGUiLCJ0cmFuc2Zvcm0iLCJvcGFjaXR5IiwiY29tcGxldGUiLCJpc0xvYWRlZCIsInJldmVhbENvbnRlbnQiLCJ1cGRhdGVTbGlkZSIsInNjYWxlVG9BY3R1YWwiLCIkY29udGVudCIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwiaGVpZ2h0IiwibmV3SW1nV2lkdGgiLCJuZXdJbWdIZWlnaHQiLCJpbWdQb3MiLCJwb3NYIiwicG9zWSIsInNjYWxlWCIsInNjYWxlWSIsImhhc0Vycm9yIiwidXBkYXRlQ3Vyc29yIiwiU2xpZGVTaG93Iiwic2NhbGVUb0ZpdCIsImVuZCIsImdldEZpdFBvcyIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwibWluUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBhcnNlRmxvYXQiLCJNYXRoIiwibWluIiwiZmxvb3IiLCJyYXRpbyIsImFkanVzdENhcHRpb24iLCJhZGp1c3RMYXlvdXQiLCJhZGQiLCJuYXZpZ2F0aW9uIiwidG9nZ2xlQ2xhc3MiLCJnZXQiLCJjbGllbnRIZWlnaHQiLCJjZW50ZXJTbGlkZSIsInNpYmxpbmdzIiwicGFyZW50IiwiY2hpbGRyZW4iLCJoYXNDbGFzcyIsImFicyIsIm5leHRXaWR0aCIsIm5leHRIZWlnaHQiLCJjYW5QYW4iLCJpc1pvb21hYmxlIiwiR3Vlc3R1cmVzIiwiaXNGdW5jdGlvbiIsImZpdFBvcyIsImFqYXhMb2FkIiwiaXNMb2FkaW5nIiwic2V0SW1hZ2UiLCJzZXRJZnJhbWUiLCJzZXRDb250ZW50IiwidmlkZW9Gb3JtYXQiLCJzZXRFcnJvciIsInNob3dMb2FkaW5nIiwidXJsIiwic3VjY2VzcyIsInRleHRTdGF0dXMiLCJlcnJvciIsImpxWEhSIiwib25lIiwiYWJvcnQiLCJnaG9zdCIsIiRpbWciLCIkaW1hZ2UiLCJjaGVja1NyY3NldCIsIm9uZXJyb3IiLCJyZW1vdmUiLCIkZ2hvc3QiLCJvbmxvYWQiLCJzZXRCaWdJbWFnZSIsInNyY3NldCIsInRlbXAiLCJweFJhdGlvIiwid2luZG93V2lkdGgiLCJkZXZpY2VQaXhlbFJhdGlvIiwibWFwIiwicmV0IiwidHJpbSIsInN1YnN0cmluZyIsInBvc3RmaXgiLCJzb3J0IiwiYSIsImIiLCJqIiwiaW1nIiwic2l6ZXMiLCJyZXNvbHZlSW1hZ2VTbGlkZVNpemUiLCJuYXR1cmFsV2lkdGgiLCJuYXR1cmFsSGVpZ2h0Iiwicm91bmQiLCJtYXgiLCJoaWRlTG9hZGluZyIsInJlYWR5U3RhdGUiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIiRpZnJhbWUiLCJEYXRlIiwiZ2V0VGltZSIsImlzUmVhZHkiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCIkY29udGVudHMiLCIkYm9keSIsImNvbnRlbnRzIiwiaWdub3JlIiwiY2VpbCIsIm91dGVyV2lkdGgiLCJvdXRlckhlaWdodCIsInVuYmluZCIsImVtcHR5IiwiaXNSZXZlYWxlZCIsInBhcmVudHMiLCIkcGxhY2Vob2xkZXIiLCJpbnNlcnRBZnRlciIsImh0bWwiLCJhZnRlciIsIiRzbWFsbEJ0biIsIndyYXAiLCJmaXJzdCIsIndyYXBJbm5lciIsIiRzcGlubmVyIiwiZmFkZUluIiwiYnV0dG9uIiwicHJldmVudE92ZXJsYXAiLCIkY2FwdGlvbiIsIiRjbG9uZSIsImNhcHRpb25IIiwiY2xvbmUiLCJlcSIsIm1hcmdpbkJvdHRvbSIsImlubGluZVBhZGRpbmciLCJhY3R1YWxQYWRkaW5nIiwiZGlzYWJsZUxheW91dEZpeCIsInN0YXJ0IiwiZWZmZWN0IiwiZWZmZWN0Q2xhc3NOYW1lIiwiZ2V0VGh1bWJQb3MiLCJ0aHVtYlBvcyIsImJ0dyIsImJydyIsImJidyIsImJsdyIsIndlYmtpdEV4aXRGdWxsc2NyZWVuIiwic2Nyb2xsVG9wIiwic2Nyb2xsTGVmdCIsInByZXYiLCJmb2N1c2FibGVTdHIiLCJmb2N1c2FibGVJdGVtcyIsImZvY3VzZWRJdGVtSW5kZXgiLCJhY3RpdmVFbGVtZW50IiwiaXNWaXNpYmxlIiwiZCIsImRvbVJlY3QiLCJkb25lIiwiY2xlYW5VcCIsIiRmb2N1cyIsInNjcm9sbFgiLCJzY3JvbGxZIiwibmFtZSIsImFyZ3MiLCJBcnJheSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsInVuc2hpZnQiLCJoYXNIaWRkZW5Db250cm9scyIsImFuZENhcHRpb24iLCJ0b2dnbGVDb250cm9scyIsInZlcnNpb24iLCJjb21tYW5kIiwib3BlbiIsImFsbCIsImRlc3Ryb3kiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidXNlM2QiLCJkaXYiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImRvY3VtZW50TW9kZSIsInByb3BzIiwicG9zaXRpb24iLCJ0byIsImxlYXZlQW5pbWF0aW9uTmFtZSIsImZyb20iLCJwcm9wZXJ0eU5hbWUiLCJjYWxsQ2FsbGJhY2siLCJfcnVuIiwiJHRhcmdldCIsImlzRGVmYXVsdFByZXZlbnRlZCIsImN1cnJlbnRUYXJnZXQiLCJzZWxlY3RvciIsImZvY3VzU3RyIiwiJHByZXNzZWQiLCJqUXVlcnkiLCJ5b3V0dWJlIiwibWF0Y2hlciIsInBhcmFtcyIsImF1dG9wbGF5IiwiYXV0b2hpZGUiLCJmcyIsInJlbCIsImhkIiwid21vZGUiLCJlbmFibGVqc2FwaSIsImh0bWw1IiwicGFyYW1QbGFjZSIsInZpbWVvIiwic2hvd190aXRsZSIsInNob3dfYnlsaW5lIiwic2hvd19wb3J0cmFpdCIsImZ1bGxzY3JlZW4iLCJpbnN0YWdyYW0iLCJnbWFwX3BsYWNlIiwiaW5kZXhPZiIsImdtYXBfc2VhcmNoIiwicGFyYW0iLCJ1cmxQYXJhbXMiLCJwYXJhbU9iaiIsInByb3ZpZGVyIiwicHJvdmlkZXJOYW1lIiwicHJvdmlkZXJPcHRzIiwibSIsInAiLCJkZWNvZGVVUklDb21wb25lbnQiLCJwMSIsInMiLCJvcmlnU3JjIiwiY29udGVudFNvdXJjZSIsIlZpZGVvQVBJTG9hZGVyIiwiY2xhc3MiLCJsb2FkaW5nIiwibG9hZGVkIiwibG9hZCIsInZlbmRvciIsIl90aGlzIiwic2NyaXB0Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCJhcHBlbmRDaGlsZCIsInBsYXllciIsIllUIiwiUGxheWVyIiwiZXZlbnRzIiwib25TdGF0ZUNoYW5nZSIsIlZpbWVvIiwiZ2V0UG9pbnRlclhZIiwicmVzdWx0IiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwicGFnZVgiLCJwYWdlWSIsImNsaWVudFgiLCJjbGllbnRZIiwiZGlzdGFuY2UiLCJwb2ludDIiLCJwb2ludDEiLCJ3aGF0Iiwic3FydCIsInBvdyIsImlzQ2xpY2thYmxlIiwib25jbGljayIsImF0dHMiLCJhdHRyaWJ1dGVzIiwibm9kZU5hbWUiLCJzdWJzdHIiLCJoYXNTY3JvbGxiYXJzIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiaG9yaXpvbnRhbCIsInNjcm9sbFdpZHRoIiwiaXNTY3JvbGxhYmxlIiwiJGJnIiwiYmciLCIkc3RhZ2UiLCJwcm94eSIsInRhcHBlZCIsIm9udG91Y2hzdGFydCIsImlzVG91Y2hEZXZpY2UiLCJvZmZzZXQiLCJyZWFsUG9pbnRzIiwic3RhcnRQb2ludHMiLCJzdGFydEV2ZW50IiwiY2FuVGFwIiwiaXNQYW5uaW5nIiwiaXNTd2lwaW5nIiwiaXNab29taW5nIiwiaXNTY3JvbGxpbmciLCJzdGFydFRpbWUiLCJkaXN0YW5jZVgiLCJkaXN0YW5jZVkiLCJjb250ZW50TGFzdFBvcyIsImNvbnRlbnRTdGFydFBvcyIsInNsaWRlclN0YXJ0UG9zIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uc2Nyb2xsIiwiY2VudGVyUG9pbnRTdGFydFgiLCJjZW50ZXJQb2ludFN0YXJ0WSIsInBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WCIsInBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WSIsInN0YXJ0RGlzdGFuY2VCZXR3ZWVuRmluZ2VycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvbnRvdWNobW92ZSIsIm9udG91Y2hlbmQiLCJuZXdQb2ludHMiLCJvblN3aXBlIiwib25QYW4iLCJvblpvb20iLCJzd2lwaW5nIiwiYW5nbGUiLCJhdGFuMiIsIlBJIiwic2xpZGVyTGFzdFBvcyIsImxpbWl0TW92ZW1lbnQiLCJjdXJyZW50T2Zmc2V0WCIsImN1cnJlbnRPZmZzZXRZIiwiY3VycmVudFdpZHRoIiwiY3VycmVudEhlaWdodCIsIm1pblRyYW5zbGF0ZVgiLCJtaW5UcmFuc2xhdGVZIiwibWF4VHJhbnNsYXRlWCIsIm1heFRyYW5zbGF0ZVkiLCJuZXdPZmZzZXRYIiwibmV3T2Zmc2V0WSIsImxpbWl0UG9zaXRpb24iLCJuZXdXaWR0aCIsIm5ld0hlaWdodCIsImVuZERpc3RhbmNlQmV0d2VlbkZpbmdlcnMiLCJwaW5jaFJhdGlvIiwidHJhbnNsYXRlRnJvbVpvb21pbmdYIiwidHJhbnNsYXRlRnJvbVpvb21pbmdZIiwiY2VudGVyUG9pbnRFbmRYIiwiY2VudGVyUG9pbnRFbmRZIiwidHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWCIsInRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1kiLCJuZXdQb3MiLCJwYW5uaW5nIiwiem9vbWluZyIsImVuZFBvaW50cyIsImRNcyIsIm9uVGFwIiwidmVsb2NpdHlYIiwidmVsb2NpdHlZIiwiZW5kUGFubmluZyIsImVuZFpvb21pbmciLCJlbmRTd2lwaW5nIiwibGVuIiwiY2FuQWR2YW5jZSIsInNwZWVkWCIsInJlc2V0IiwidGFwWCIsInRhcFkiLCJ3aGVyZSIsInByb2Nlc3MiLCJwcmVmaXgiLCJhY3Rpb24iLCJhZGRCYWNrIiwicHJvZ3Jlc3MiLCJ0aW1lciIsIiRidXR0b24iLCJ0b2dnbGUiLCIkcHJvZ3Jlc3MiLCJpbm5lciIsInNldCIsImZvcmNlIiwiY2xlYXIiLCJyZW1vdmVBdHRyIiwia2V5cHJlc3MiLCJoaWRkZW4iLCJmbk1hcCIsInZhbCIsIkZ1bGxTY3JlZW4iLCJyZXF1ZXN0IiwicmVxdWVzdEZ1bGxzY3JlZW4iLCJBTExPV19LRVlCT0FSRF9JTlBVVCIsImV4aXQiLCJleGl0RnVsbHNjcmVlbiIsImlzRnVsbHNjcmVlbiIsIkJvb2xlYW4iLCJmdWxsc2NyZWVuRWxlbWVudCIsImVuYWJsZWQiLCJmdWxsc2NyZWVuRW5hYmxlZCIsImZ1bGxzY3JlZW5jaGFuZ2UiLCJDTEFTUyIsIkNMQVNTX0FDVElWRSIsIkZhbmN5VGh1bWJzIiwiJGdyaWQiLCIkbGlzdCIsImxpc3QiLCJpbm5lckhUTUwiLCJ0aGF0Iiwic2hhcmUiLCJjdXJyZW50SGFzaCIsImxvY2F0aW9uIiwiZXNjYXBlSHRtbCIsInN0cmluZyIsImVudGl0eU1hcCIsIlN0cmluZyIsImVuY29kZVVSSUNvbXBvbmVudCIsInRleHQiLCJzaGFyZUluc3RhbmNlIiwic2hhcmVDdXJyZW50IiwiY2xpY2siLCJocmVmIiwiZXNjYXBlU2VsZWN0b3IiLCJzZWwiLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidG9TdHJpbmciLCJwYXJzZVVybCIsInBvcCIsImdhbGxlcnkiLCJ0cmlnZ2VyRnJvbVVybCIsImdldEdhbGxlcnlJRCIsIm9yaWdIYXNoIiwiaGFzaFRpbWVyIiwiaGlzdG9yeSIsInRpdGxlIiwicGF0aG5hbWUiLCJzZWFyY2giLCJoYXNDcmVhdGVkSGlzdG9yeSIsImJhY2siLCJyZXBsYWNlU3RhdGUiLCJmYiIsInJldmVyc2UiLCJ0bXAiLCJwcmV2VGltZSIsImN1cnJUaW1lIiwiZGVsdGFZIiwiZGVsdGFYIiwid2hlZWxEZWx0YSIsImRldGFpbCIsInJlc3BvbnNpdmVOYXYiLCJjb21wdXRlZCIsInJlIiwidG9VcHBlckNhc2UiLCJjdXJyZW50U3R5bGUiLCJhZGRFdmVudCIsImV2dCIsImJ1YmJsZSIsImhhbmRsZUV2ZW50IiwiYXR0YWNoRXZlbnQiLCJyZW1vdmVFdmVudCIsImRldGFjaEV2ZW50IiwiZ2V0Q2hpbGRyZW4iLCJFcnJvciIsIm5vZGVUeXBlIiwic2V0QXR0cmlidXRlcyIsImF0dHJzIiwic2V0QXR0cmlidXRlIiwiY2xzIiwicmVnIiwiUmVnRXhwIiwiYXJyYXkiLCJzY29wZSIsIm5hdiIsIm5hdlRvZ2dsZSIsInN0eWxlRWxlbWVudCIsImh0bWxFbCIsImhhc0FuaW1GaW5pc2hlZCIsIm5hdk9wZW4iLCJSZXNwb25zaXZlTmF2IiwibGFiZWwiLCJpbnNlcnQiLCJjdXN0b21Ub2dnbGUiLCJjbG9zZU9uTmF2Q2xpY2siLCJvcGVuUG9zIiwibmF2Q2xhc3MiLCJuYXZBY3RpdmVDbGFzcyIsImpzQ2xhc3MiLCJ3cmFwcGVyRWwiLCJnZXRFbGVtZW50QnlJZCIsIndyYXBwZXIiLCJxdWVyeVNlbGVjdG9yIiwiX2luaXQiLCJfcmVtb3ZlU3R5bGVzIiwicmVtb3ZlQXR0cmlidXRlIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwicmVzaXplIiwiX2NyZWF0ZVN0eWxlcyIsIl9jYWxjSGVpZ2h0IiwiX29uVG91Y2hTdGFydCIsIl9vblRvdWNoTW92ZSIsIl9vblRvdWNoRW5kIiwiX3ByZXZlbnREZWZhdWx0IiwiX29uS2V5VXAiLCJfY2xvc2VPbk5hdkNsaWNrIiwiX2NyZWF0ZVRvZ2dsZSIsIl90cmFuc2l0aW9ucyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaW5zZXJ0QmVmb3JlIiwibmV4dFNpYmxpbmciLCJ0b2dnbGVFbCIsImxpbmtzIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwicmV0dXJuVmFsdWUiLCJFdmVudCIsInN0YXJ0WCIsInN0YXJ0WSIsInRvdWNoSGFzTW92ZWQiLCJvYmpTdHlsZSIsInNhdmVkSGVpZ2h0IiwiaW5uZXJTdHlsZXMiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsVUFBU0EsTUFBVCxFQUFpQkMsUUFBakIsRUFBMkJDLENBQTNCLEVBQThCQyxTQUE5QixFQUF5QztBQUN4Qzs7QUFFQUgsU0FBT0ksT0FBUCxHQUFpQkosT0FBT0ksT0FBUCxJQUFrQjtBQUNqQ0MsVUFBTSxjQUFTQyxLQUFULEVBQWdCLENBQUU7QUFEUyxHQUFuQzs7QUFJQTtBQUNBOztBQUVBLE1BQUksQ0FBQ0osQ0FBTCxFQUFRO0FBQ047QUFDRDs7QUFFRDtBQUNBOztBQUVBLE1BQUlBLEVBQUVLLEVBQUYsQ0FBS0MsUUFBVCxFQUFtQjtBQUNqQkosWUFBUUMsSUFBUixDQUFhLDhCQUFiOztBQUVBO0FBQ0Q7O0FBRUQ7QUFDQTs7QUFFQSxNQUFJSSxXQUFXO0FBQ2I7QUFDQTtBQUNBQyxtQkFBZSxLQUhGOztBQUtiO0FBQ0FDLFVBQU0sS0FOTzs7QUFRYjtBQUNBQyxZQUFRLEVBVEs7O0FBV2I7QUFDQUMsY0FBVSxJQVpHOztBQWNiO0FBQ0FDLDJCQUF1QixJQWZWOztBQWlCYjtBQUNBQyxZQUFRLElBbEJLOztBQW9CYjtBQUNBQyxh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RCxXQUFPQyxPQUFQLEdBQWlCM0UsYUFBakI7QUFDRCxHQUZELE1BRU87QUFDTDl0QixXQUFPOHRCLGFBQVAsR0FBdUJBLGFBQXZCO0FBQ0Q7QUFFRixDQTdvQkEsRUE2b0JDN3RCLFFBN29CRCxFQTZvQldELE1BN29CWCxFQTZvQm1CLENBN29CbkIsQ0FBRDs7O0FDVEEsSUFBSXF2QixNQUFNdkIsY0FBYyxlQUFkLENBQVY7O0FBRUFoUCxPQUFPN2UsUUFBUCxFQUFpQnl5QixLQUFqQixDQUF1QixVQUFVeHlCLENBQVYsRUFBYzs7QUFFbkNBLElBQUUsaUJBQUYsRUFBcUJNLFFBQXJCLENBQThCO0FBQzlCRyxVQUFXO0FBRG1CLEdBQTlCO0FBSUQsQ0FORCIsImZpbGUiOiJwcm9kdWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIGZhbmN5Qm94IHYzLjUuNlxuLy9cbi8vIExpY2Vuc2VkIEdQTHYzIGZvciBvcGVuIHNvdXJjZSB1c2Vcbi8vIG9yIGZhbmN5Qm94IENvbW1lcmNpYWwgTGljZW5zZSBmb3IgY29tbWVyY2lhbCB1c2Vcbi8vXG4vLyBodHRwOi8vZmFuY3lhcHBzLmNvbS9mYW5jeWJveC9cbi8vIENvcHlyaWdodCAyMDE4IGZhbmN5QXBwc1xuLy9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge1xyXG4gICAgaW5mbzogZnVuY3Rpb24oc3R1ZmYpIHt9XHJcbiAgfTtcclxuXHJcbiAgLy8gSWYgdGhlcmUncyBubyBqUXVlcnksIGZhbmN5Qm94IGNhbid0IHdvcmtcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBpZiAoISQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIENoZWNrIGlmIGZhbmN5Qm94IGlzIGFscmVhZHkgaW5pdGlhbGl6ZWRcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIGlmICgkLmZuLmZhbmN5Ym94KSB7XHJcbiAgICBjb25zb2xlLmluZm8oXCJmYW5jeUJveCBhbHJlYWR5IGluaXRpYWxpemVkXCIpO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIFByaXZhdGUgZGVmYXVsdCBzZXR0aW5nc1xyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAvLyBDbG9zZSBleGlzdGluZyBtb2RhbHNcclxuICAgIC8vIFNldCB0aGlzIHRvIGZhbHNlIGlmIHlvdSBkbyBub3QgbmVlZCB0byBzdGFjayBtdWx0aXBsZSBpbnN0YW5jZXNcclxuICAgIGNsb3NlRXhpc3Rpbmc6IGZhbHNlLFxyXG5cclxuICAgIC8vIEVuYWJsZSBpbmZpbml0ZSBnYWxsZXJ5IG5hdmlnYXRpb25cclxuICAgIGxvb3A6IGZhbHNlLFxyXG5cclxuICAgIC8vIEhvcml6b250YWwgc3BhY2UgYmV0d2VlbiBzbGlkZXNcclxuICAgIGd1dHRlcjogNTAsXHJcblxyXG4gICAgLy8gRW5hYmxlIGtleWJvYXJkIG5hdmlnYXRpb25cclxuICAgIGtleWJvYXJkOiB0cnVlLFxyXG5cclxuICAgIC8vIFNob3VsZCBhbGxvdyBjYXB0aW9uIHRvIG92ZXJsYXAgdGhlIGNvbnRlbnRcclxuICAgIHByZXZlbnRDYXB0aW9uT3ZlcmxhcDogdHJ1ZSxcclxuXHJcbiAgICAvLyBTaG91bGQgZGlzcGxheSBuYXZpZ2F0aW9uIGFycm93cyBhdCB0aGUgc2NyZWVuIGVkZ2VzXHJcbiAgICBhcnJvd3M6IHRydWUsXHJcblxyXG4gICAgLy8gU2hvdWxkIGRpc3BsYXkgY291bnRlciBhdCB0aGUgdG9wIGxlZnQgY29ybmVyXHJcbiAgICBpbmZvYmFyOiB0cnVlLFxyXG5cclxuICAgIC8vIFNob3VsZCBkaXNwbGF5IGNsb3NlIGJ1dHRvbiAodXNpbmcgYGJ0blRwbC5zbWFsbEJ0bmAgdGVtcGxhdGUpIG92ZXIgdGhlIGNvbnRlbnRcclxuICAgIC8vIENhbiBiZSB0cnVlLCBmYWxzZSwgXCJhdXRvXCJcclxuICAgIC8vIElmIFwiYXV0b1wiIC0gd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGVuYWJsZWQgZm9yIFwiaHRtbFwiLCBcImlubGluZVwiIG9yIFwiYWpheFwiIGl0ZW1zXHJcbiAgICBzbWFsbEJ0bjogXCJhdXRvXCIsXHJcblxyXG4gICAgLy8gU2hvdWxkIGRpc3BsYXkgdG9vbGJhciAoYnV0dG9ucyBhdCB0aGUgdG9wKVxyXG4gICAgLy8gQ2FuIGJlIHRydWUsIGZhbHNlLCBcImF1dG9cIlxyXG4gICAgLy8gSWYgXCJhdXRvXCIgLSB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgaGlkZGVuIGlmIFwic21hbGxCdG5cIiBpcyBlbmFibGVkXHJcbiAgICB0b29sYmFyOiBcImF1dG9cIixcclxuXHJcbiAgICAvLyBXaGF0IGJ1dHRvbnMgc2hvdWxkIGFwcGVhciBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICAgIC8vIEJ1dHRvbnMgd2lsbCBiZSBjcmVhdGVkIHVzaW5nIHRlbXBsYXRlcyBmcm9tIGBidG5UcGxgIG9wdGlvblxyXG4gICAgLy8gYW5kIHRoZXkgd2lsbCBiZSBwbGFjZWQgaW50byB0b29sYmFyIChjbGFzcz1cImZhbmN5Ym94LXRvb2xiYXJcImAgZWxlbWVudClcclxuICAgIGJ1dHRvbnM6IFtcclxuICAgICAgXCJ6b29tXCIsXHJcbiAgICAgIC8vXCJzaGFyZVwiLFxyXG4gICAgICBcInNsaWRlU2hvd1wiLFxyXG4gICAgICAvL1wiZnVsbFNjcmVlblwiLFxyXG4gICAgICAvL1wiZG93bmxvYWRcIixcclxuICAgICAgXCJ0aHVtYnNcIixcclxuICAgICAgXCJjbG9zZVwiXHJcbiAgICBdLFxyXG5cclxuICAgIC8vIERldGVjdCBcImlkbGVcIiB0aW1lIGluIHNlY29uZHNcclxuICAgIGlkbGVUaW1lOiAzLFxyXG5cclxuICAgIC8vIERpc2FibGUgcmlnaHQtY2xpY2sgYW5kIHVzZSBzaW1wbGUgaW1hZ2UgcHJvdGVjdGlvbiBmb3IgaW1hZ2VzXHJcbiAgICBwcm90ZWN0OiBmYWxzZSxcclxuXHJcbiAgICAvLyBTaG9ydGN1dCB0byBtYWtlIGNvbnRlbnQgXCJtb2RhbFwiIC0gZGlzYWJsZSBrZXlib2FyZCBuYXZpZ3Rpb24sIGhpZGUgYnV0dG9ucywgZXRjXHJcbiAgICBtb2RhbDogZmFsc2UsXHJcblxyXG4gICAgaW1hZ2U6IHtcclxuICAgICAgLy8gV2FpdCBmb3IgaW1hZ2VzIHRvIGxvYWQgYmVmb3JlIGRpc3BsYXlpbmdcclxuICAgICAgLy8gICB0cnVlICAtIHdhaXQgZm9yIGltYWdlIHRvIGxvYWQgYW5kIHRoZW4gZGlzcGxheTtcclxuICAgICAgLy8gICBmYWxzZSAtIGRpc3BsYXkgdGh1bWJuYWlsIGFuZCBsb2FkIHRoZSBmdWxsLXNpemVkIGltYWdlIG92ZXIgdG9wLFxyXG4gICAgICAvLyAgICAgICAgICAgcmVxdWlyZXMgcHJlZGVmaW5lZCBpbWFnZSBkaW1lbnNpb25zIChgZGF0YS13aWR0aGAgYW5kIGBkYXRhLWhlaWdodGAgYXR0cmlidXRlcylcclxuICAgICAgcHJlbG9hZDogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgYWpheDoge1xyXG4gICAgICAvLyBPYmplY3QgY29udGFpbmluZyBzZXR0aW5ncyBmb3IgYWpheCByZXF1ZXN0XHJcbiAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgLy8gVGhpcyBoZWxwcyB0byBpbmRpY2F0ZSB0aGF0IHJlcXVlc3QgY29tZXMgZnJvbSB0aGUgbW9kYWxcclxuICAgICAgICAvLyBGZWVsIGZyZWUgdG8gY2hhbmdlIG5hbWluZ1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGZhbmN5Ym94OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGlmcmFtZToge1xyXG4gICAgICAvLyBJZnJhbWUgdGVtcGxhdGVcclxuICAgICAgdHBsOlxyXG4gICAgICAgICc8aWZyYW1lIGlkPVwiZmFuY3lib3gtZnJhbWV7cm5kfVwiIG5hbWU9XCJmYW5jeWJveC1mcmFtZXtybmR9XCIgY2xhc3M9XCJmYW5jeWJveC1pZnJhbWVcIiBhbGxvd2Z1bGxzY3JlZW49XCJhbGxvd2Z1bGxzY3JlZW5cIiBhbGxvdz1cImF1dG9wbGF5OyBmdWxsc2NyZWVuXCIgc3JjPVwiXCI+PC9pZnJhbWU+JyxcclxuXHJcbiAgICAgIC8vIFByZWxvYWQgaWZyYW1lIGJlZm9yZSBkaXNwbGF5aW5nIGl0XHJcbiAgICAgIC8vIFRoaXMgYWxsb3dzIHRvIGNhbGN1bGF0ZSBpZnJhbWUgY29udGVudCB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICAgIC8vIChub3RlOiBEdWUgdG8gXCJTYW1lIE9yaWdpbiBQb2xpY3lcIiwgeW91IGNhbid0IGdldCBjcm9zcyBkb21haW4gZGF0YSkuXHJcbiAgICAgIHByZWxvYWQ6IHRydWUsXHJcblxyXG4gICAgICAvLyBDdXN0b20gQ1NTIHN0eWxpbmcgZm9yIGlmcmFtZSB3cmFwcGluZyBlbGVtZW50XHJcbiAgICAgIC8vIFlvdSBjYW4gdXNlIHRoaXMgdG8gc2V0IGN1c3RvbSBpZnJhbWUgZGltZW5zaW9uc1xyXG4gICAgICBjc3M6IHt9LFxyXG5cclxuICAgICAgLy8gSWZyYW1lIHRhZyBhdHRyaWJ1dGVzXHJcbiAgICAgIGF0dHI6IHtcclxuICAgICAgICBzY3JvbGxpbmc6IFwiYXV0b1wiXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gRm9yIEhUTUw1IHZpZGVvIG9ubHlcclxuICAgIHZpZGVvOiB7XHJcbiAgICAgIHRwbDpcclxuICAgICAgICAnPHZpZGVvIGNsYXNzPVwiZmFuY3lib3gtdmlkZW9cIiBjb250cm9scyBjb250cm9sc0xpc3Q9XCJub2Rvd25sb2FkXCIgcG9zdGVyPVwie3twb3N0ZXJ9fVwiPicgK1xyXG4gICAgICAgICc8c291cmNlIHNyYz1cInt7c3JjfX1cIiB0eXBlPVwie3tmb3JtYXR9fVwiIC8+JyArXHJcbiAgICAgICAgJ1NvcnJ5LCB5b3VyIGJyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZW1iZWRkZWQgdmlkZW9zLCA8YSBocmVmPVwie3tzcmN9fVwiPmRvd25sb2FkPC9hPiBhbmQgd2F0Y2ggd2l0aCB5b3VyIGZhdm9yaXRlIHZpZGVvIHBsYXllciEnICtcclxuICAgICAgICBcIjwvdmlkZW8+XCIsXHJcbiAgICAgIGZvcm1hdDogXCJcIiwgLy8gY3VzdG9tIHZpZGVvIGZvcm1hdFxyXG4gICAgICBhdXRvU3RhcnQ6IHRydWVcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRGVmYXVsdCBjb250ZW50IHR5cGUgaWYgY2Fubm90IGJlIGRldGVjdGVkIGF1dG9tYXRpY2FsbHlcclxuICAgIGRlZmF1bHRUeXBlOiBcImltYWdlXCIsXHJcblxyXG4gICAgLy8gT3Blbi9jbG9zZSBhbmltYXRpb24gdHlwZVxyXG4gICAgLy8gUG9zc2libGUgdmFsdWVzOlxyXG4gICAgLy8gICBmYWxzZSAgICAgICAgICAgIC0gZGlzYWJsZVxyXG4gICAgLy8gICBcInpvb21cIiAgICAgICAgICAgLSB6b29tIGltYWdlcyBmcm9tL3RvIHRodW1ibmFpbFxyXG4gICAgLy8gICBcImZhZGVcIlxyXG4gICAgLy8gICBcInpvb20taW4tb3V0XCJcclxuICAgIC8vXHJcbiAgICBhbmltYXRpb25FZmZlY3Q6IFwiem9vbVwiLFxyXG5cclxuICAgIC8vIER1cmF0aW9uIGluIG1zIGZvciBvcGVuL2Nsb3NlIGFuaW1hdGlvblxyXG4gICAgYW5pbWF0aW9uRHVyYXRpb246IDM2NixcclxuXHJcbiAgICAvLyBTaG91bGQgaW1hZ2UgY2hhbmdlIG9wYWNpdHkgd2hpbGUgem9vbWluZ1xyXG4gICAgLy8gSWYgb3BhY2l0eSBpcyBcImF1dG9cIiwgdGhlbiBvcGFjaXR5IHdpbGwgYmUgY2hhbmdlZCBpZiBpbWFnZSBhbmQgdGh1bWJuYWlsIGhhdmUgZGlmZmVyZW50IGFzcGVjdCByYXRpb3NcclxuICAgIHpvb21PcGFjaXR5OiBcImF1dG9cIixcclxuXHJcbiAgICAvLyBUcmFuc2l0aW9uIGVmZmVjdCBiZXR3ZWVuIHNsaWRlc1xyXG4gICAgLy9cclxuICAgIC8vIFBvc3NpYmxlIHZhbHVlczpcclxuICAgIC8vICAgZmFsc2UgICAgICAgICAgICAtIGRpc2FibGVcclxuICAgIC8vICAgXCJmYWRlJ1xyXG4gICAgLy8gICBcInNsaWRlJ1xyXG4gICAgLy8gICBcImNpcmN1bGFyJ1xyXG4gICAgLy8gICBcInR1YmUnXHJcbiAgICAvLyAgIFwiem9vbS1pbi1vdXQnXHJcbiAgICAvLyAgIFwicm90YXRlJ1xyXG4gICAgLy9cclxuICAgIHRyYW5zaXRpb25FZmZlY3Q6IFwiZmFkZVwiLFxyXG5cclxuICAgIC8vIER1cmF0aW9uIGluIG1zIGZvciB0cmFuc2l0aW9uIGFuaW1hdGlvblxyXG4gICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAzNjYsXHJcblxyXG4gICAgLy8gQ3VzdG9tIENTUyBjbGFzcyBmb3Igc2xpZGUgZWxlbWVudFxyXG4gICAgc2xpZGVDbGFzczogXCJcIixcclxuXHJcbiAgICAvLyBDdXN0b20gQ1NTIGNsYXNzIGZvciBsYXlvdXRcclxuICAgIGJhc2VDbGFzczogXCJcIixcclxuXHJcbiAgICAvLyBCYXNlIHRlbXBsYXRlIGZvciBsYXlvdXRcclxuICAgIGJhc2VUcGw6XHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtY29udGFpbmVyXCIgcm9sZT1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIj4nICtcclxuICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1iZ1wiPjwvZGl2PicgK1xyXG4gICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWlubmVyXCI+JyArXHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtaW5mb2JhclwiPjxzcGFuIGRhdGEtZmFuY3lib3gtaW5kZXg+PC9zcGFuPiZuYnNwOy8mbmJzcDs8c3BhbiBkYXRhLWZhbmN5Ym94LWNvdW50Pjwvc3Bhbj48L2Rpdj4nICtcclxuICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC10b29sYmFyXCI+e3tidXR0b25zfX08L2Rpdj4nICtcclxuICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1uYXZpZ2F0aW9uXCI+e3thcnJvd3N9fTwvZGl2PicgK1xyXG4gICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXN0YWdlXCI+PC9kaXY+JyArXHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtY2FwdGlvblwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1jYXB0aW9uX19ib2R5XCI+PC9kaXY+PC9kaXY+JyArXHJcbiAgICAgIFwiPC9kaXY+XCIgK1xyXG4gICAgICBcIjwvZGl2PlwiLFxyXG5cclxuICAgIC8vIExvYWRpbmcgaW5kaWNhdG9yIHRlbXBsYXRlXHJcbiAgICBzcGlubmVyVHBsOiAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWxvYWRpbmdcIj48L2Rpdj4nLFxyXG5cclxuICAgIC8vIEVycm9yIG1lc3NhZ2UgdGVtcGxhdGVcclxuICAgIGVycm9yVHBsOiAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWVycm9yXCI+PHA+e3tFUlJPUn19PC9wPjwvZGl2PicsXHJcblxyXG4gICAgYnRuVHBsOiB7XHJcbiAgICAgIGRvd25sb2FkOlxyXG4gICAgICAgICc8YSBkb3dubG9hZCBkYXRhLWZhbmN5Ym94LWRvd25sb2FkIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tZG93bmxvYWRcIiB0aXRsZT1cInt7RE9XTkxPQUR9fVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4nICtcclxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNMTguNjIgMTcuMDlWMTlINS4zOHYtMS45MXptLTIuOTctNi45NkwxNyAxMS40NWwtNSA0Ljg3LTUtNC44NyAxLjM2LTEuMzIgMi42OCAyLjY0VjVoMS45MnY3Ljc3elwiLz48L3N2Zz4nICtcclxuICAgICAgICBcIjwvYT5cIixcclxuXHJcbiAgICAgIHpvb206XHJcbiAgICAgICAgJzxidXR0b24gZGF0YS1mYW5jeWJveC16b29tIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tem9vbVwiIHRpdGxlPVwie3taT09NfX1cIj4nICtcclxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNMTguNyAxNy4zbC0zLTNhNS45IDUuOSAwIDAgMC0uNi03LjYgNS45IDUuOSAwIDAgMC04LjQgMCA1LjkgNS45IDAgMCAwIDAgOC40IDUuOSA1LjkgMCAwIDAgNy43LjdsMyAzYTEgMSAwIDAgMCAxLjMgMGMuNC0uNS40LTEgMC0xLjV6TTguMSAxMy44YTQgNCAwIDAgMSAwLTUuNyA0IDQgMCAwIDEgNS43IDAgNCA0IDAgMCAxIDAgNS43IDQgNCAwIDAgMS01LjcgMHpcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgXCI8L2J1dHRvbj5cIixcclxuXHJcbiAgICAgIGNsb3NlOlxyXG4gICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtY2xvc2UgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1jbG9zZVwiIHRpdGxlPVwie3tDTE9TRX19XCI+JyArXHJcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTEyIDEwLjZMNi42IDUuMiA1LjIgNi42bDUuNCA1LjQtNS40IDUuNCAxLjQgMS40IDUuNC01LjQgNS40IDUuNCAxLjQtMS40LTUuNC01LjQgNS40LTUuNC0xLjQtMS40LTUuNCA1LjR6XCIvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPC9idXR0b24+XCIsXHJcblxyXG4gICAgICAvLyBBcnJvd3NcclxuICAgICAgYXJyb3dMZWZ0OlxyXG4gICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtcHJldiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWFycm93X2xlZnRcIiB0aXRsZT1cInt7UFJFVn19XCI+JyArXHJcbiAgICAgICAgJzxkaXY+PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNMTEuMjggMTUuN2wtMS4zNCAxLjM3TDUgMTJsNC45NC01LjA3IDEuMzQgMS4zOC0yLjY4IDIuNzJIMTl2MS45NEg4LjZ6XCIvPjwvc3ZnPjwvZGl2PicgK1xyXG4gICAgICAgIFwiPC9idXR0b24+XCIsXHJcblxyXG4gICAgICBhcnJvd1JpZ2h0OlxyXG4gICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtbmV4dCBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWFycm93X3JpZ2h0XCIgdGl0bGU9XCJ7e05FWFR9fVwiPicgK1xyXG4gICAgICAgICc8ZGl2PjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTE1LjQgMTIuOTdsLTIuNjggMi43MiAxLjM0IDEuMzhMMTkgMTJsLTQuOTQtNS4wNy0xLjM0IDEuMzggMi42OCAyLjcySDV2MS45NHpcIi8+PC9zdmc+PC9kaXY+JyArXHJcbiAgICAgICAgXCI8L2J1dHRvbj5cIixcclxuXHJcbiAgICAgIC8vIFRoaXMgc21hbGwgY2xvc2UgYnV0dG9uIHdpbGwgYmUgYXBwZW5kZWQgdG8geW91ciBodG1sL2lubGluZS9hamF4IGNvbnRlbnQgYnkgZGVmYXVsdCxcclxuICAgICAgLy8gaWYgXCJzbWFsbEJ0blwiIG9wdGlvbiBpcyBub3Qgc2V0IHRvIGZhbHNlXHJcbiAgICAgIHNtYWxsQnRuOlxyXG4gICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWNsb3NlLXNtYWxsXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj4nICtcclxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjFcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk0xMyAxMmw1LTUtMS0xLTUgNS01LTUtMSAxIDUgNS01IDUgMSAxIDUtNSA1IDUgMS0xelwiLz48L3N2Zz4nICtcclxuICAgICAgICBcIjwvYnV0dG9uPlwiXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENvbnRhaW5lciBpcyBpbmplY3RlZCBpbnRvIHRoaXMgZWxlbWVudFxyXG4gICAgcGFyZW50RWw6IFwiYm9keVwiLFxyXG5cclxuICAgIC8vIEhpZGUgYnJvd3NlciB2ZXJ0aWNhbCBzY3JvbGxiYXJzOyB1c2UgYXQgeW91ciBvd24gcmlza1xyXG4gICAgaGlkZVNjcm9sbGJhcjogdHJ1ZSxcclxuXHJcbiAgICAvLyBGb2N1cyBoYW5kbGluZ1xyXG4gICAgLy8gPT09PT09PT09PT09PT1cclxuXHJcbiAgICAvLyBUcnkgdG8gZm9jdXMgb24gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGFmdGVyIG9wZW5pbmdcclxuICAgIGF1dG9Gb2N1czogdHJ1ZSxcclxuXHJcbiAgICAvLyBQdXQgZm9jdXMgYmFjayB0byBhY3RpdmUgZWxlbWVudCBhZnRlciBjbG9zaW5nXHJcbiAgICBiYWNrRm9jdXM6IHRydWUsXHJcblxyXG4gICAgLy8gRG8gbm90IGxldCB1c2VyIHRvIGZvY3VzIG9uIGVsZW1lbnQgb3V0c2lkZSBtb2RhbCBjb250ZW50XHJcbiAgICB0cmFwRm9jdXM6IHRydWUsXHJcblxyXG4gICAgLy8gTW9kdWxlIHNwZWNpZmljIG9wdGlvbnNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgZnVsbFNjcmVlbjoge1xyXG4gICAgICBhdXRvU3RhcnQ6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFNldCBgdG91Y2g6IGZhbHNlYCB0byBkaXNhYmxlIHBhbm5pbmcvc3dpcGluZ1xyXG4gICAgdG91Y2g6IHtcclxuICAgICAgdmVydGljYWw6IHRydWUsIC8vIEFsbG93IHRvIGRyYWcgY29udGVudCB2ZXJ0aWNhbGx5XHJcbiAgICAgIG1vbWVudHVtOiB0cnVlIC8vIENvbnRpbnVlIG1vdmVtZW50IGFmdGVyIHJlbGVhc2luZyBtb3VzZS90b3VjaCB3aGVuIHBhbm5pbmdcclxuICAgIH0sXHJcblxyXG4gICAgLy8gSGFzaCB2YWx1ZSB3aGVuIGluaXRpYWxpemluZyBtYW51YWxseSxcclxuICAgIC8vIHNldCBgZmFsc2VgIHRvIGRpc2FibGUgaGFzaCBjaGFuZ2VcclxuICAgIGhhc2g6IG51bGwsXHJcblxyXG4gICAgLy8gQ3VzdG9taXplIG9yIGFkZCBuZXcgbWVkaWEgdHlwZXNcclxuICAgIC8vIEV4YW1wbGU6XHJcbiAgICAvKlxyXG4gICAgICBtZWRpYSA6IHtcclxuICAgICAgICB5b3V0dWJlIDoge1xyXG4gICAgICAgICAgcGFyYW1zIDoge1xyXG4gICAgICAgICAgICBhdXRvcGxheSA6IDBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICovXHJcbiAgICBtZWRpYToge30sXHJcblxyXG4gICAgc2xpZGVTaG93OiB7XHJcbiAgICAgIGF1dG9TdGFydDogZmFsc2UsXHJcbiAgICAgIHNwZWVkOiAzMDAwXHJcbiAgICB9LFxyXG5cclxuICAgIHRodW1iczoge1xyXG4gICAgICBhdXRvU3RhcnQ6IGZhbHNlLCAvLyBEaXNwbGF5IHRodW1ibmFpbHMgb24gb3BlbmluZ1xyXG4gICAgICBoaWRlT25DbG9zZTogdHJ1ZSwgLy8gSGlkZSB0aHVtYm5haWwgZ3JpZCB3aGVuIGNsb3NpbmcgYW5pbWF0aW9uIHN0YXJ0c1xyXG4gICAgICBwYXJlbnRFbDogXCIuZmFuY3lib3gtY29udGFpbmVyXCIsIC8vIENvbnRhaW5lciBpcyBpbmplY3RlZCBpbnRvIHRoaXMgZWxlbWVudFxyXG4gICAgICBheGlzOiBcInlcIiAvLyBWZXJ0aWNhbCAoeSkgb3IgaG9yaXpvbnRhbCAoeCkgc2Nyb2xsaW5nXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFVzZSBtb3VzZXdoZWVsIHRvIG5hdmlnYXRlIGdhbGxlcnlcclxuICAgIC8vIElmICdhdXRvJyAtIGVuYWJsZWQgZm9yIGltYWdlcyBvbmx5XHJcbiAgICB3aGVlbDogXCJhdXRvXCIsXHJcblxyXG4gICAgLy8gQ2FsbGJhY2tzXHJcbiAgICAvLz09PT09PT09PT1cclxuXHJcbiAgICAvLyBTZWUgRG9jdW1lbnRhdGlvbi9BUEkvRXZlbnRzIGZvciBtb3JlIGluZm9ybWF0aW9uXHJcbiAgICAvLyBFeGFtcGxlOlxyXG4gICAgLypcclxuICAgICAgYWZ0ZXJTaG93OiBmdW5jdGlvbiggaW5zdGFuY2UsIGN1cnJlbnQgKSB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCAnQ2xpY2tlZCBlbGVtZW50OicgKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oIGN1cnJlbnQub3B0cy4kb3JpZyApO1xyXG4gICAgICB9XHJcbiAgICAqL1xyXG5cclxuICAgIG9uSW5pdDogJC5ub29wLCAvLyBXaGVuIGluc3RhbmNlIGhhcyBiZWVuIGluaXRpYWxpemVkXHJcblxyXG4gICAgYmVmb3JlTG9hZDogJC5ub29wLCAvLyBCZWZvcmUgdGhlIGNvbnRlbnQgb2YgYSBzbGlkZSBpcyBiZWluZyBsb2FkZWRcclxuICAgIGFmdGVyTG9hZDogJC5ub29wLCAvLyBXaGVuIHRoZSBjb250ZW50IG9mIGEgc2xpZGUgaXMgZG9uZSBsb2FkaW5nXHJcblxyXG4gICAgYmVmb3JlU2hvdzogJC5ub29wLCAvLyBCZWZvcmUgb3BlbiBhbmltYXRpb24gc3RhcnRzXHJcbiAgICBhZnRlclNob3c6ICQubm9vcCwgLy8gV2hlbiBjb250ZW50IGlzIGRvbmUgbG9hZGluZyBhbmQgYW5pbWF0aW5nXHJcblxyXG4gICAgYmVmb3JlQ2xvc2U6ICQubm9vcCwgLy8gQmVmb3JlIHRoZSBpbnN0YW5jZSBhdHRlbXB0cyB0byBjbG9zZS4gUmV0dXJuIGZhbHNlIHRvIGNhbmNlbCB0aGUgY2xvc2UuXHJcbiAgICBhZnRlckNsb3NlOiAkLm5vb3AsIC8vIEFmdGVyIGluc3RhbmNlIGhhcyBiZWVuIGNsb3NlZFxyXG5cclxuICAgIG9uQWN0aXZhdGU6ICQubm9vcCwgLy8gV2hlbiBpbnN0YW5jZSBpcyBicm91Z2h0IHRvIGZyb250XHJcbiAgICBvbkRlYWN0aXZhdGU6ICQubm9vcCwgLy8gV2hlbiBvdGhlciBpbnN0YW5jZSBoYXMgYmVlbiBhY3RpdmF0ZWRcclxuXHJcbiAgICAvLyBJbnRlcmFjdGlvblxyXG4gICAgLy8gPT09PT09PT09PT1cclxuXHJcbiAgICAvLyBVc2Ugb3B0aW9ucyBiZWxvdyB0byBjdXN0b21pemUgdGFrZW4gYWN0aW9uIHdoZW4gdXNlciBjbGlja3Mgb3IgZG91YmxlIGNsaWNrcyBvbiB0aGUgZmFuY3lCb3ggYXJlYSxcclxuICAgIC8vIGVhY2ggb3B0aW9uIGNhbiBiZSBzdHJpbmcgb3IgbWV0aG9kIHRoYXQgcmV0dXJucyB2YWx1ZS5cclxuICAgIC8vXHJcbiAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6XHJcbiAgICAvLyAgIFwiY2xvc2VcIiAgICAgICAgICAgLSBjbG9zZSBpbnN0YW5jZVxyXG4gICAgLy8gICBcIm5leHRcIiAgICAgICAgICAgIC0gbW92ZSB0byBuZXh0IGdhbGxlcnkgaXRlbVxyXG4gICAgLy8gICBcIm5leHRPckNsb3NlXCIgICAgIC0gbW92ZSB0byBuZXh0IGdhbGxlcnkgaXRlbSBvciBjbG9zZSBpZiBnYWxsZXJ5IGhhcyBvbmx5IG9uZSBpdGVtXHJcbiAgICAvLyAgIFwidG9nZ2xlQ29udHJvbHNcIiAgLSBzaG93L2hpZGUgY29udHJvbHNcclxuICAgIC8vICAgXCJ6b29tXCIgICAgICAgICAgICAtIHpvb20gaW1hZ2UgKGlmIGxvYWRlZClcclxuICAgIC8vICAgZmFsc2UgICAgICAgICAgICAgLSBkbyBub3RoaW5nXHJcblxyXG4gICAgLy8gQ2xpY2tlZCBvbiB0aGUgY29udGVudFxyXG4gICAgY2xpY2tDb250ZW50OiBmdW5jdGlvbihjdXJyZW50LCBldmVudCkge1xyXG4gICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSBcImltYWdlXCIgPyBcInpvb21cIiA6IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDbGlja2VkIG9uIHRoZSBzbGlkZVxyXG4gICAgY2xpY2tTbGlkZTogXCJjbG9zZVwiLFxyXG5cclxuICAgIC8vIENsaWNrZWQgb24gdGhlIGJhY2tncm91bmQgKGJhY2tkcm9wKSBlbGVtZW50O1xyXG4gICAgLy8gaWYgeW91IGhhdmUgbm90IGNoYW5nZWQgdGhlIGxheW91dCwgdGhlbiBtb3N0IGxpa2VseSB5b3UgbmVlZCB0byB1c2UgYGNsaWNrU2xpZGVgIG9wdGlvblxyXG4gICAgY2xpY2tPdXRzaWRlOiBcImNsb3NlXCIsXHJcblxyXG4gICAgLy8gU2FtZSBhcyBwcmV2aW91cyB0d28sIGJ1dCBmb3IgZG91YmxlIGNsaWNrXHJcbiAgICBkYmxjbGlja0NvbnRlbnQ6IGZhbHNlLFxyXG4gICAgZGJsY2xpY2tTbGlkZTogZmFsc2UsXHJcbiAgICBkYmxjbGlja091dHNpZGU6IGZhbHNlLFxyXG5cclxuICAgIC8vIEN1c3RvbSBvcHRpb25zIHdoZW4gbW9iaWxlIGRldmljZSBpcyBkZXRlY3RlZFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgbW9iaWxlOiB7XHJcbiAgICAgIHByZXZlbnRDYXB0aW9uT3ZlcmxhcDogZmFsc2UsXHJcbiAgICAgIGlkbGVUaW1lOiBmYWxzZSxcclxuICAgICAgY2xpY2tDb250ZW50OiBmdW5jdGlvbihjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiA/IFwidG9nZ2xlQ29udHJvbHNcIiA6IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgICBjbGlja1NsaWRlOiBmdW5jdGlvbihjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiA/IFwidG9nZ2xlQ29udHJvbHNcIiA6IFwiY2xvc2VcIjtcclxuICAgICAgfSxcclxuICAgICAgZGJsY2xpY2tDb250ZW50OiBmdW5jdGlvbihjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiA/IFwiem9vbVwiIDogZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRibGNsaWNrU2xpZGU6IGZ1bmN0aW9uKGN1cnJlbnQsIGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQudHlwZSA9PT0gXCJpbWFnZVwiID8gXCJ6b29tXCIgOiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBJbnRlcm5hdGlvbmFsaXphdGlvblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBsYW5nOiBcImVuXCIsXHJcbiAgICBpMThuOiB7XHJcbiAgICAgIGVuOiB7XHJcbiAgICAgICAgQ0xPU0U6IFwiQ2xvc2VcIixcclxuICAgICAgICBORVhUOiBcIk5leHRcIixcclxuICAgICAgICBQUkVWOiBcIlByZXZpb3VzXCIsXHJcbiAgICAgICAgRVJST1I6IFwiVGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuIDxici8+IFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCIsXHJcbiAgICAgICAgUExBWV9TVEFSVDogXCJTdGFydCBzbGlkZXNob3dcIixcclxuICAgICAgICBQTEFZX1NUT1A6IFwiUGF1c2Ugc2xpZGVzaG93XCIsXHJcbiAgICAgICAgRlVMTF9TQ1JFRU46IFwiRnVsbCBzY3JlZW5cIixcclxuICAgICAgICBUSFVNQlM6IFwiVGh1bWJuYWlsc1wiLFxyXG4gICAgICAgIERPV05MT0FEOiBcIkRvd25sb2FkXCIsXHJcbiAgICAgICAgU0hBUkU6IFwiU2hhcmVcIixcclxuICAgICAgICBaT09NOiBcIlpvb21cIlxyXG4gICAgICB9LFxyXG4gICAgICBkZToge1xyXG4gICAgICAgIENMT1NFOiBcIlNjaGxpZSZzemxpZztlblwiLFxyXG4gICAgICAgIE5FWFQ6IFwiV2VpdGVyXCIsXHJcbiAgICAgICAgUFJFVjogXCJadXImdXVtbDtja1wiLFxyXG4gICAgICAgIEVSUk9SOiBcIkRpZSBhbmdlZm9yZGVydGVuIERhdGVuIGtvbm50ZW4gbmljaHQgZ2VsYWRlbiB3ZXJkZW4uIDxici8+IEJpdHRlIHZlcnN1Y2hlbiBTaWUgZXMgc3AmYXVtbDt0ZXIgbm9jaG1hbC5cIixcclxuICAgICAgICBQTEFZX1NUQVJUOiBcIkRpYXNjaGF1IHN0YXJ0ZW5cIixcclxuICAgICAgICBQTEFZX1NUT1A6IFwiRGlhc2NoYXUgYmVlbmRlblwiLFxyXG4gICAgICAgIEZVTExfU0NSRUVOOiBcIlZvbGxiaWxkXCIsXHJcbiAgICAgICAgVEhVTUJTOiBcIlZvcnNjaGF1YmlsZGVyXCIsXHJcbiAgICAgICAgRE9XTkxPQUQ6IFwiSGVydW50ZXJsYWRlblwiLFxyXG4gICAgICAgIFNIQVJFOiBcIlRlaWxlblwiLFxyXG4gICAgICAgIFpPT006IFwiVmVyZ3Imb3VtbDsmc3psaWc7ZXJuXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIEZldyB1c2VmdWwgdmFyaWFibGVzIGFuZCBtZXRob2RzXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgdmFyICRXID0gJCh3aW5kb3cpO1xyXG4gIHZhciAkRCA9ICQoZG9jdW1lbnQpO1xyXG5cclxuICB2YXIgY2FsbGVkID0gMDtcclxuXHJcbiAgLy8gQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgalF1ZXJ5IG9iamVjdCBhbmQgbm90IGEgbmF0aXZlIEphdmFTY3JpcHQgb2JqZWN0XHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgdmFyIGlzUXVlcnkgPSBmdW5jdGlvbihvYmopIHtcclxuICAgIHJldHVybiBvYmogJiYgb2JqLmhhc093blByb3BlcnR5ICYmIG9iaiBpbnN0YW5jZW9mICQ7XHJcbiAgfTtcclxuXHJcbiAgLy8gSGFuZGxlIG11bHRpcGxlIGJyb3dzZXJzIGZvciBcInJlcXVlc3RBbmltYXRpb25GcmFtZVwiIGFuZCBcImNhbmNlbEFuaW1hdGlvbkZyYW1lXCJcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgdmFyIHJlcXVlc3RBRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAvLyBpZiBhbGwgZWxzZSBmYWlscywgdXNlIHNldFRpbWVvdXRcclxuICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSkoKTtcclxuXHJcbiAgdmFyIGNhbmNlbEFGcmFtZSA9IChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9KSgpO1xyXG5cclxuICAvLyBEZXRlY3QgdGhlIHN1cHBvcnRlZCB0cmFuc2l0aW9uLWVuZCBldmVudCBwcm9wZXJ0eSBuYW1lXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIHZhciB0cmFuc2l0aW9uRW5kID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZha2VlbGVtZW50XCIpLFxyXG4gICAgICB0O1xyXG5cclxuICAgIHZhciB0cmFuc2l0aW9ucyA9IHtcclxuICAgICAgdHJhbnNpdGlvbjogXCJ0cmFuc2l0aW9uZW5kXCIsXHJcbiAgICAgIE9UcmFuc2l0aW9uOiBcIm9UcmFuc2l0aW9uRW5kXCIsXHJcbiAgICAgIE1velRyYW5zaXRpb246IFwidHJhbnNpdGlvbmVuZFwiLFxyXG4gICAgICBXZWJraXRUcmFuc2l0aW9uOiBcIndlYmtpdFRyYW5zaXRpb25FbmRcIlxyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKHQgaW4gdHJhbnNpdGlvbnMpIHtcclxuICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbnNbdF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gXCJ0cmFuc2l0aW9uZW5kXCI7XHJcbiAgfSkoKTtcclxuXHJcbiAgLy8gRm9yY2UgcmVkcmF3IG9uIGFuIGVsZW1lbnQuXHJcbiAgLy8gVGhpcyBoZWxwcyBpbiBjYXNlcyB3aGVyZSB0aGUgYnJvd3NlciBkb2Vzbid0IHJlZHJhdyBhbiB1cGRhdGVkIGVsZW1lbnQgcHJvcGVybHlcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIHZhciBmb3JjZVJlZHJhdyA9IGZ1bmN0aW9uKCRlbCkge1xyXG4gICAgcmV0dXJuICRlbCAmJiAkZWwubGVuZ3RoICYmICRlbFswXS5vZmZzZXRIZWlnaHQ7XHJcbiAgfTtcclxuXHJcbiAgLy8gRXhjbHVkZSBhcnJheSAoYGJ1dHRvbnNgKSBvcHRpb25zIGZyb20gZGVlcCBtZXJnaW5nXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgdmFyIG1lcmdlT3B0cyA9IGZ1bmN0aW9uKG9wdHMxLCBvcHRzMikge1xyXG4gICAgdmFyIHJleiA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRzMSwgb3B0czIpO1xyXG5cclxuICAgICQuZWFjaChvcHRzMiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoJC5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIHJleltrZXldID0gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXo7XHJcbiAgfTtcclxuXHJcbiAgLy8gSG93IG11Y2ggb2YgYW4gZWxlbWVudCBpcyB2aXNpYmxlIGluIHZpZXdwb3J0XHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBpblZpZXdwb3J0ID0gZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgdmFyIGVsZW1DZW50ZXIsIHJlejtcclxuXHJcbiAgICBpZiAoIWVsZW0gfHwgZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgJChcIi5mYW5jeWJveC1jb250YWluZXJcIikuY3NzKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpO1xyXG5cclxuICAgIGVsZW1DZW50ZXIgPSB7XHJcbiAgICAgIHg6IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGVsZW0ub2Zmc2V0V2lkdGggLyAyLFxyXG4gICAgICB5OiBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGVsZW0ub2Zmc2V0SGVpZ2h0IC8gMlxyXG4gICAgfTtcclxuXHJcbiAgICByZXogPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGVsZW1DZW50ZXIueCwgZWxlbUNlbnRlci55KSA9PT0gZWxlbTtcclxuXHJcbiAgICAkKFwiLmZhbmN5Ym94LWNvbnRhaW5lclwiKS5jc3MoXCJwb2ludGVyLWV2ZW50c1wiLCBcIlwiKTtcclxuXHJcbiAgICByZXR1cm4gcmV6O1xyXG4gIH07XHJcblxyXG4gIC8vIENsYXNzIGRlZmluaXRpb25cclxuICAvLyA9PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBGYW5jeUJveCA9IGZ1bmN0aW9uKGNvbnRlbnQsIG9wdHMsIGluZGV4KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5vcHRzID0gbWVyZ2VPcHRzKHtpbmRleDogaW5kZXh9LCAkLmZhbmN5Ym94LmRlZmF1bHRzKTtcclxuXHJcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KG9wdHMpKSB7XHJcbiAgICAgIHNlbGYub3B0cyA9IG1lcmdlT3B0cyhzZWxmLm9wdHMsIG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkLmZhbmN5Ym94LmlzTW9iaWxlKSB7XHJcbiAgICAgIHNlbGYub3B0cyA9IG1lcmdlT3B0cyhzZWxmLm9wdHMsIHNlbGYub3B0cy5tb2JpbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuaWQgPSBzZWxmLm9wdHMuaWQgfHwgKytjYWxsZWQ7XHJcblxyXG4gICAgc2VsZi5jdXJySW5kZXggPSBwYXJzZUludChzZWxmLm9wdHMuaW5kZXgsIDEwKSB8fCAwO1xyXG4gICAgc2VsZi5wcmV2SW5kZXggPSBudWxsO1xyXG5cclxuICAgIHNlbGYucHJldlBvcyA9IG51bGw7XHJcbiAgICBzZWxmLmN1cnJQb3MgPSAwO1xyXG5cclxuICAgIHNlbGYuZmlyc3RSdW4gPSB0cnVlO1xyXG5cclxuICAgIC8vIEFsbCBncm91cCBpdGVtc1xyXG4gICAgc2VsZi5ncm91cCA9IFtdO1xyXG5cclxuICAgIC8vIEV4aXN0aW5nIHNsaWRlcyAoZm9yIGN1cnJlbnQsIG5leHQgYW5kIHByZXZpb3VzIGdhbGxlcnkgaXRlbXMpXHJcbiAgICBzZWxmLnNsaWRlcyA9IHt9O1xyXG5cclxuICAgIC8vIENyZWF0ZSBncm91cCBlbGVtZW50c1xyXG4gICAgc2VsZi5hZGRDb250ZW50KGNvbnRlbnQpO1xyXG5cclxuICAgIGlmICghc2VsZi5ncm91cC5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuaW5pdCgpO1xyXG4gIH07XHJcblxyXG4gICQuZXh0ZW5kKEZhbmN5Qm94LnByb3RvdHlwZSwge1xyXG4gICAgLy8gQ3JlYXRlIERPTSBzdHJ1Y3R1cmVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBmaXJzdEl0ZW0gPSBzZWxmLmdyb3VwW3NlbGYuY3VyckluZGV4XSxcclxuICAgICAgICBmaXJzdEl0ZW1PcHRzID0gZmlyc3RJdGVtLm9wdHMsXHJcbiAgICAgICAgJGNvbnRhaW5lcixcclxuICAgICAgICBidXR0b25TdHI7XHJcblxyXG4gICAgICBpZiAoZmlyc3RJdGVtT3B0cy5jbG9zZUV4aXN0aW5nKSB7XHJcbiAgICAgICAgJC5mYW5jeWJveC5jbG9zZSh0cnVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSGlkZSBzY3JvbGxiYXJzXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJmYW5jeWJveC1hY3RpdmVcIik7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgISQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSAmJlxyXG4gICAgICAgIGZpcnN0SXRlbU9wdHMuaGlkZVNjcm9sbGJhciAhPT0gZmFsc2UgJiZcclxuICAgICAgICAhJC5mYW5jeWJveC5pc01vYmlsZSAmJlxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICkge1xyXG4gICAgICAgICQoXCJoZWFkXCIpLmFwcGVuZChcclxuICAgICAgICAgICc8c3R5bGUgaWQ9XCJmYW5jeWJveC1zdHlsZS1ub3Njcm9sbFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiPi5jb21wZW5zYXRlLWZvci1zY3JvbGxiYXJ7bWFyZ2luLXJpZ2h0OicgK1xyXG4gICAgICAgICAgICAod2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpICtcclxuICAgICAgICAgICAgXCJweDt9PC9zdHlsZT5cIlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBCdWlsZCBodG1sIG1hcmt1cCBhbmQgc2V0IHJlZmVyZW5jZXNcclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAvLyBCdWlsZCBodG1sIGNvZGUgZm9yIGJ1dHRvbnMgYW5kIGluc2VydCBpbnRvIG1haW4gdGVtcGxhdGVcclxuICAgICAgYnV0dG9uU3RyID0gXCJcIjtcclxuXHJcbiAgICAgICQuZWFjaChmaXJzdEl0ZW1PcHRzLmJ1dHRvbnMsIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgIGJ1dHRvblN0ciArPSBmaXJzdEl0ZW1PcHRzLmJ0blRwbFt2YWx1ZV0gfHwgXCJcIjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBDcmVhdGUgbWFya3VwIGZyb20gYmFzZSB0ZW1wbGF0ZSwgaXQgd2lsbCBiZSBpbml0aWFsbHkgaGlkZGVuIHRvXHJcbiAgICAgIC8vIGF2b2lkIHVubmVjZXNzYXJ5IHdvcmsgbGlrZSBwYWludGluZyB3aGlsZSBpbml0aWFsaXppbmcgaXMgbm90IGNvbXBsZXRlXHJcbiAgICAgICRjb250YWluZXIgPSAkKFxyXG4gICAgICAgIHNlbGYudHJhbnNsYXRlKFxyXG4gICAgICAgICAgc2VsZixcclxuICAgICAgICAgIGZpcnN0SXRlbU9wdHMuYmFzZVRwbFxyXG4gICAgICAgICAgICAucmVwbGFjZShcInt7YnV0dG9uc319XCIsIGJ1dHRvblN0cilcclxuICAgICAgICAgICAgLnJlcGxhY2UoXCJ7e2Fycm93c319XCIsIGZpcnN0SXRlbU9wdHMuYnRuVHBsLmFycm93TGVmdCArIGZpcnN0SXRlbU9wdHMuYnRuVHBsLmFycm93UmlnaHQpXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImZhbmN5Ym94LWNvbnRhaW5lci1cIiArIHNlbGYuaWQpXHJcbiAgICAgICAgLmFkZENsYXNzKGZpcnN0SXRlbU9wdHMuYmFzZUNsYXNzKVxyXG4gICAgICAgIC5kYXRhKFwiRmFuY3lCb3hcIiwgc2VsZilcclxuICAgICAgICAuYXBwZW5kVG8oZmlyc3RJdGVtT3B0cy5wYXJlbnRFbCk7XHJcblxyXG4gICAgICAvLyBDcmVhdGUgb2JqZWN0IGhvbGRpbmcgcmVmZXJlbmNlcyB0byBqUXVlcnkgd3JhcHBlZCBub2Rlc1xyXG4gICAgICBzZWxmLiRyZWZzID0ge1xyXG4gICAgICAgIGNvbnRhaW5lcjogJGNvbnRhaW5lclxyXG4gICAgICB9O1xyXG5cclxuICAgICAgW1wiYmdcIiwgXCJpbm5lclwiLCBcImluZm9iYXJcIiwgXCJ0b29sYmFyXCIsIFwic3RhZ2VcIiwgXCJjYXB0aW9uXCIsIFwibmF2aWdhdGlvblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICBzZWxmLiRyZWZzW2l0ZW1dID0gJGNvbnRhaW5lci5maW5kKFwiLmZhbmN5Ym94LVwiICsgaXRlbSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKFwib25Jbml0XCIpO1xyXG5cclxuICAgICAgLy8gRW5hYmxlIGV2ZW50cywgZGVhY3RpdmUgcHJldmlvdXMgaW5zdGFuY2VzXHJcbiAgICAgIHNlbGYuYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgIC8vIEJ1aWxkIHNsaWRlcywgbG9hZCBhbmQgcmV2ZWFsIGNvbnRlbnRcclxuICAgICAgc2VsZi5qdW1wVG8oc2VsZi5jdXJySW5kZXgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTaW1wbGUgaTE4biBzdXBwb3J0IC0gcmVwbGFjZXMgb2JqZWN0IGtleXMgZm91bmQgaW4gdGVtcGxhdGVcclxuICAgIC8vIHdpdGggY29ycmVzcG9uZGluZyB2YWx1ZXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24ob2JqLCBzdHIpIHtcclxuICAgICAgdmFyIGFyciA9IG9iai5vcHRzLmkxOG5bb2JqLm9wdHMubGFuZ10gfHwgb2JqLm9wdHMuaTE4bi5lbjtcclxuXHJcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFx7XFx7KFxcdyspXFx9XFx9L2csIGZ1bmN0aW9uKG1hdGNoLCBuKSB7XHJcbiAgICAgICAgcmV0dXJuIGFycltuXSA9PT0gdW5kZWZpbmVkID8gbWF0Y2ggOiBhcnJbbl07XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBQb3B1bGF0ZSBjdXJyZW50IGdyb3VwIHdpdGggZnJlc2ggY29udGVudFxyXG4gICAgLy8gQ2hlY2sgaWYgZWFjaCBvYmplY3QgaGFzIHZhbGlkIHR5cGUgYW5kIGNvbnRlbnRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgYWRkQ29udGVudDogZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgaXRlbXMgPSAkLm1ha2VBcnJheShjb250ZW50KSxcclxuICAgICAgICB0aHVtYnM7XHJcblxyXG4gICAgICAkLmVhY2goaXRlbXMsIGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICB2YXIgb2JqID0ge30sXHJcbiAgICAgICAgICBvcHRzID0ge30sXHJcbiAgICAgICAgICAkaXRlbSxcclxuICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICBmb3VuZCxcclxuICAgICAgICAgIHNyYyxcclxuICAgICAgICAgIHNyY1BhcnRzO1xyXG5cclxuICAgICAgICAvLyBTdGVwIDEgLSBNYWtlIHN1cmUgd2UgaGF2ZSBhbiBvYmplY3RcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChpdGVtKSkge1xyXG4gICAgICAgICAgLy8gV2UgcHJvYmFibHkgaGF2ZSBtYW51YWwgdXNhZ2UgaGVyZSwgc29tZXRoaW5nIGxpa2VcclxuICAgICAgICAgIC8vICQuZmFuY3lib3gub3BlbiggWyB7IHNyYyA6IFwiaW1hZ2UuanBnXCIsIHR5cGUgOiBcImltYWdlXCIgfSBdIClcclxuXHJcbiAgICAgICAgICBvYmogPSBpdGVtO1xyXG4gICAgICAgICAgb3B0cyA9IGl0ZW0ub3B0cyB8fCBpdGVtO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoJC50eXBlKGl0ZW0pID09PSBcIm9iamVjdFwiICYmICQoaXRlbSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAvLyBIZXJlIHdlIHByb2JhYmx5IGhhdmUgalF1ZXJ5IGNvbGxlY3Rpb24gcmV0dXJuZWQgYnkgc29tZSBzZWxlY3RvclxyXG4gICAgICAgICAgJGl0ZW0gPSAkKGl0ZW0pO1xyXG5cclxuICAgICAgICAgIC8vIFN1cHBvcnQgYXR0cmlidXRlcyBsaWtlIGBkYXRhLW9wdGlvbnM9J3tcInRvdWNoXCIgOiBmYWxzZX0nYCBhbmQgYGRhdGEtdG91Y2g9J2ZhbHNlJ2BcclxuICAgICAgICAgIG9wdHMgPSAkaXRlbS5kYXRhKCkgfHwge307XHJcbiAgICAgICAgICBvcHRzID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdHMsIG9wdHMub3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgLy8gSGVyZSB3ZSBzdG9yZSBjbGlja2VkIGVsZW1lbnRcclxuICAgICAgICAgIG9wdHMuJG9yaWcgPSAkaXRlbTtcclxuXHJcbiAgICAgICAgICBvYmouc3JjID0gc2VsZi5vcHRzLnNyYyB8fCBvcHRzLnNyYyB8fCAkaXRlbS5hdHRyKFwiaHJlZlwiKTtcclxuXHJcbiAgICAgICAgICAvLyBBc3N1bWUgdGhhdCBzaW1wbGUgc3ludGF4IGlzIHVzZWQsIGZvciBleGFtcGxlOlxyXG4gICAgICAgICAgLy8gICBgJC5mYW5jeWJveC5vcGVuKCAkKFwiI3Rlc3RcIiksIHt9ICk7YFxyXG4gICAgICAgICAgaWYgKCFvYmoudHlwZSAmJiAhb2JqLnNyYykge1xyXG4gICAgICAgICAgICBvYmoudHlwZSA9IFwiaW5saW5lXCI7XHJcbiAgICAgICAgICAgIG9iai5zcmMgPSBpdGVtO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBBc3N1bWUgd2UgaGF2ZSBhIHNpbXBsZSBodG1sIGNvZGUsIGZvciBleGFtcGxlOlxyXG4gICAgICAgICAgLy8gICAkLmZhbmN5Ym94Lm9wZW4oICc8ZGl2PjxoMT5IaSE8L2gxPjwvZGl2PicgKTtcclxuICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgdHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgIHNyYzogaXRlbSArIFwiXCJcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFYWNoIGdhbGxlcnkgb2JqZWN0IGhhcyBmdWxsIGNvbGxlY3Rpb24gb2Ygb3B0aW9uc1xyXG4gICAgICAgIG9iai5vcHRzID0gJC5leHRlbmQodHJ1ZSwge30sIHNlbGYub3B0cywgb3B0cyk7XHJcblxyXG4gICAgICAgIC8vIERvIG5vdCBtZXJnZSBidXR0b25zIGFycmF5XHJcbiAgICAgICAgaWYgKCQuaXNBcnJheShvcHRzLmJ1dHRvbnMpKSB7XHJcbiAgICAgICAgICBvYmoub3B0cy5idXR0b25zID0gb3B0cy5idXR0b25zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQuZmFuY3lib3guaXNNb2JpbGUgJiYgb2JqLm9wdHMubW9iaWxlKSB7XHJcbiAgICAgICAgICBvYmoub3B0cyA9IG1lcmdlT3B0cyhvYmoub3B0cywgb2JqLm9wdHMubW9iaWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFN0ZXAgMiAtIE1ha2Ugc3VyZSB3ZSBoYXZlIGNvbnRlbnQgdHlwZSwgaWYgbm90IC0gdHJ5IHRvIGd1ZXNzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdHlwZSA9IG9iai50eXBlIHx8IG9iai5vcHRzLnR5cGU7XHJcbiAgICAgICAgc3JjID0gb2JqLnNyYyB8fCBcIlwiO1xyXG5cclxuICAgICAgICBpZiAoIXR5cGUgJiYgc3JjKSB7XHJcbiAgICAgICAgICBpZiAoKGZvdW5kID0gc3JjLm1hdGNoKC9cXC4obXA0fG1vdnxvZ3Z8d2VibSkoKFxcP3wjKS4qKT8kL2kpKSkge1xyXG4gICAgICAgICAgICB0eXBlID0gXCJ2aWRlb1wiO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvYmoub3B0cy52aWRlby5mb3JtYXQpIHtcclxuICAgICAgICAgICAgICBvYmoub3B0cy52aWRlby5mb3JtYXQgPSBcInZpZGVvL1wiICsgKGZvdW5kWzFdID09PSBcIm9ndlwiID8gXCJvZ2dcIiA6IGZvdW5kWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChzcmMubWF0Y2goLyheZGF0YTppbWFnZVxcL1thLXowLTkrXFwvPV0qLCl8KFxcLihqcChlfGd8ZWcpfGdpZnxwbmd8Ym1wfHdlYnB8c3ZnfGljbykoKFxcP3wjKS4qKT8kKS9pKSkge1xyXG4gICAgICAgICAgICB0eXBlID0gXCJpbWFnZVwiO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzcmMubWF0Y2goL1xcLihwZGYpKChcXD98IykuKik/JC9pKSkge1xyXG4gICAgICAgICAgICB0eXBlID0gXCJpZnJhbWVcIjtcclxuICAgICAgICAgICAgb2JqID0gJC5leHRlbmQodHJ1ZSwgb2JqLCB7Y29udGVudFR5cGU6IFwicGRmXCIsIG9wdHM6IHtpZnJhbWU6IHtwcmVsb2FkOiBmYWxzZX19fSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHNyYy5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSBcImlubGluZVwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgIG9iai50eXBlID0gdHlwZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKFwib2JqZWN0TmVlZHNUeXBlXCIsIG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9iai5jb250ZW50VHlwZSkge1xyXG4gICAgICAgICAgb2JqLmNvbnRlbnRUeXBlID0gJC5pbkFycmF5KG9iai50eXBlLCBbXCJodG1sXCIsIFwiaW5saW5lXCIsIFwiYWpheFwiXSkgPiAtMSA/IFwiaHRtbFwiIDogb2JqLnR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTdGVwIDMgLSBTb21lIGFkanVzdG1lbnRzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBvYmouaW5kZXggPSBzZWxmLmdyb3VwLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKG9iai5vcHRzLnNtYWxsQnRuID09IFwiYXV0b1wiKSB7XHJcbiAgICAgICAgICBvYmoub3B0cy5zbWFsbEJ0biA9ICQuaW5BcnJheShvYmoudHlwZSwgW1wiaHRtbFwiLCBcImlubGluZVwiLCBcImFqYXhcIl0pID4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2JqLm9wdHMudG9vbGJhciA9PT0gXCJhdXRvXCIpIHtcclxuICAgICAgICAgIG9iai5vcHRzLnRvb2xiYXIgPSAhb2JqLm9wdHMuc21hbGxCdG47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGaW5kIHRodW1ibmFpbCBpbWFnZSwgY2hlY2sgaWYgZXhpc3RzIGFuZCBpZiBpcyBpbiB0aGUgdmlld3BvcnRcclxuICAgICAgICBvYmouJHRodW1iID0gb2JqLm9wdHMuJHRodW1iIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChvYmoub3B0cy4kdHJpZ2dlciAmJiBvYmouaW5kZXggPT09IHNlbGYub3B0cy5pbmRleCkge1xyXG4gICAgICAgICAgb2JqLiR0aHVtYiA9IG9iai5vcHRzLiR0cmlnZ2VyLmZpbmQoXCJpbWc6Zmlyc3RcIik7XHJcblxyXG4gICAgICAgICAgaWYgKG9iai4kdGh1bWIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG9iai5vcHRzLiRvcmlnID0gb2JqLm9wdHMuJHRyaWdnZXI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIShvYmouJHRodW1iICYmIG9iai4kdGh1bWIubGVuZ3RoKSAmJiBvYmoub3B0cy4kb3JpZykge1xyXG4gICAgICAgICAgb2JqLiR0aHVtYiA9IG9iai5vcHRzLiRvcmlnLmZpbmQoXCJpbWc6Zmlyc3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2JqLiR0aHVtYiAmJiAhb2JqLiR0aHVtYi5sZW5ndGgpIHtcclxuICAgICAgICAgIG9iai4kdGh1bWIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLnRodW1iID0gb2JqLm9wdHMudGh1bWIgfHwgKG9iai4kdGh1bWIgPyBvYmouJHRodW1iWzBdLnNyYyA6IG51bGwpO1xyXG5cclxuICAgICAgICAvLyBcImNhcHRpb25cIiBpcyBhIFwic3BlY2lhbFwiIG9wdGlvbiwgaXQgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIGNhcHRpb24gcGVyIGdhbGxlcnkgaXRlbVxyXG4gICAgICAgIGlmICgkLnR5cGUob2JqLm9wdHMuY2FwdGlvbikgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgb2JqLm9wdHMuY2FwdGlvbiA9IG9iai5vcHRzLmNhcHRpb24uYXBwbHkoaXRlbSwgW3NlbGYsIG9ial0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQudHlwZShzZWxmLm9wdHMuY2FwdGlvbikgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgb2JqLm9wdHMuY2FwdGlvbiA9IHNlbGYub3B0cy5jYXB0aW9uLmFwcGx5KGl0ZW0sIFtzZWxmLCBvYmpdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGNhcHRpb24gYXMgYSBzdHJpbmcgb3IgalF1ZXJ5IG9iamVjdFxyXG4gICAgICAgIGlmICghKG9iai5vcHRzLmNhcHRpb24gaW5zdGFuY2VvZiAkKSkge1xyXG4gICAgICAgICAgb2JqLm9wdHMuY2FwdGlvbiA9IG9iai5vcHRzLmNhcHRpb24gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBvYmoub3B0cy5jYXB0aW9uICsgXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHVybCBjb250YWlucyBcImZpbHRlclwiIHVzZWQgdG8gZmlsdGVyIHRoZSBjb250ZW50XHJcbiAgICAgICAgLy8gRXhhbXBsZTogXCJhamF4Lmh0bWwgI3NvbWV0aGluZ1wiXHJcbiAgICAgICAgaWYgKG9iai50eXBlID09PSBcImFqYXhcIikge1xyXG4gICAgICAgICAgc3JjUGFydHMgPSBzcmMuc3BsaXQoL1xccysvLCAyKTtcclxuXHJcbiAgICAgICAgICBpZiAoc3JjUGFydHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBvYmouc3JjID0gc3JjUGFydHMuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgIG9iai5vcHRzLmZpbHRlciA9IHNyY1BhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBIaWRlIGFsbCBidXR0b25zIGFuZCBkaXNhYmxlIGludGVyYWN0aXZpdHkgZm9yIG1vZGFsIGl0ZW1zXHJcbiAgICAgICAgaWYgKG9iai5vcHRzLm1vZGFsKSB7XHJcbiAgICAgICAgICBvYmoub3B0cyA9ICQuZXh0ZW5kKHRydWUsIG9iai5vcHRzLCB7XHJcbiAgICAgICAgICAgIHRyYXBGb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGJ1dHRvbnNcclxuICAgICAgICAgICAgaW5mb2JhcjogMCxcclxuICAgICAgICAgICAgdG9vbGJhcjogMCxcclxuXHJcbiAgICAgICAgICAgIHNtYWxsQnRuOiAwLFxyXG5cclxuICAgICAgICAgICAgLy8gRGlzYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiAwLFxyXG5cclxuICAgICAgICAgICAgLy8gRGlzYWJsZSBzb21lIG1vZHVsZXNcclxuICAgICAgICAgICAgc2xpZGVTaG93OiAwLFxyXG4gICAgICAgICAgICBmdWxsU2NyZWVuOiAwLFxyXG4gICAgICAgICAgICB0aHVtYnM6IDAsXHJcbiAgICAgICAgICAgIHRvdWNoOiAwLFxyXG5cclxuICAgICAgICAgICAgLy8gRGlzYWJsZSBjbGljayBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgICAgICBjbGlja0NvbnRlbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBjbGlja1NsaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgY2xpY2tPdXRzaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGJsY2xpY2tDb250ZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgZGJsY2xpY2tTbGlkZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRibGNsaWNrT3V0c2lkZTogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3RlcCA0IC0gQWRkIHByb2Nlc3NlZCBvYmplY3QgdG8gZ3JvdXBcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzZWxmLmdyb3VwLnB1c2gob2JqKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBVcGRhdGUgY29udHJvbHMgaWYgZ2FsbGVyeSBpcyBhbHJlYWR5IG9wZW5lZFxyXG4gICAgICBpZiAoT2JqZWN0LmtleXMoc2VsZi5zbGlkZXMpLmxlbmd0aCkge1xyXG4gICAgICAgIHNlbGYudXBkYXRlQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIHRodW1ibmFpbHMsIGlmIG5lZWRlZFxyXG4gICAgICAgIHRodW1icyA9IHNlbGYuVGh1bWJzO1xyXG5cclxuICAgICAgICBpZiAodGh1bWJzICYmIHRodW1icy5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgdGh1bWJzLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICAgIHRodW1icy5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBdHRhY2ggYW4gZXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgZm9yOlxyXG4gICAgLy8gICAtIG5hdmlnYXRpb24gYnV0dG9uc1xyXG4gICAgLy8gICAtIGJyb3dzZXIgc2Nyb2xsaW5nLCByZXNpemluZztcclxuICAgIC8vICAgLSBmb2N1c2luZ1xyXG4gICAgLy8gICAtIGtleWJvYXJkXHJcbiAgICAvLyAgIC0gZGV0ZWN0aW5nIGluYWN0aXZpdHlcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgYWRkRXZlbnRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgc2VsZi5yZW1vdmVFdmVudHMoKTtcclxuXHJcbiAgICAgIC8vIE1ha2UgbmF2aWdhdGlvbiBlbGVtZW50cyBjbGlja2FibGVcclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgc2VsZi4kcmVmcy5jb250YWluZXJcclxuICAgICAgICAub24oXCJjbGljay5mYi1jbG9zZVwiLCBcIltkYXRhLWZhbmN5Ym94LWNsb3NlXVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIHNlbGYuY2xvc2UoZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oXCJ0b3VjaHN0YXJ0LmZiLXByZXYgY2xpY2suZmItcHJldlwiLCBcIltkYXRhLWZhbmN5Ym94LXByZXZdXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgc2VsZi5wcmV2aW91cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKFwidG91Y2hzdGFydC5mYi1uZXh0IGNsaWNrLmZiLW5leHRcIiwgXCJbZGF0YS1mYW5jeWJveC1uZXh0XVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIHNlbGYubmV4dCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKFwiY2xpY2suZmJcIiwgXCJbZGF0YS1mYW5jeWJveC16b29tXVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAvLyBDbGljayBoYW5kbGVyIGZvciB6b29tIGJ1dHRvblxyXG4gICAgICAgICAgc2VsZltzZWxmLmlzU2NhbGVkRG93bigpID8gXCJzY2FsZVRvQWN0dWFsXCIgOiBcInNjYWxlVG9GaXRcIl0oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIC8vIEhhbmRsZSBwYWdlIHNjcm9sbGluZyBhbmQgYnJvd3NlciByZXNpemluZ1xyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICRXLm9uKFwib3JpZW50YXRpb25jaGFuZ2UuZmIgcmVzaXplLmZiXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZSAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LnR5cGUgPT09IFwicmVzaXplXCIpIHtcclxuICAgICAgICAgIGlmIChzZWxmLnJlcXVlc3RJZCkge1xyXG4gICAgICAgICAgICBjYW5jZWxBRnJhbWUoc2VsZi5yZXF1ZXN0SWQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNlbGYucmVxdWVzdElkID0gcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZi51cGRhdGUoZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHNlbGYuY3VycmVudCAmJiBzZWxmLmN1cnJlbnQudHlwZSA9PT0gXCJpZnJhbWVcIikge1xyXG4gICAgICAgICAgICBzZWxmLiRyZWZzLnN0YWdlLmhpZGUoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBzZWxmLiRyZWZzLnN0YWdlLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgc2VsZi51cGRhdGUoZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICQuZmFuY3lib3guaXNNb2JpbGUgPyA2MDAgOiAyNTBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRELm9uKFwia2V5ZG93bi5mYlwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gJC5mYW5jeWJveCA/ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSA6IG51bGwsXHJcbiAgICAgICAgICBjdXJyZW50ID0gaW5zdGFuY2UuY3VycmVudCxcclxuICAgICAgICAgIGtleWNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcclxuXHJcbiAgICAgICAgLy8gVHJhcCBrZXlib2FyZCBmb2N1cyBpbnNpZGUgb2YgdGhlIG1vZGFsXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGlmIChrZXljb2RlID09IDkpIHtcclxuICAgICAgICAgIGlmIChjdXJyZW50Lm9wdHMudHJhcEZvY3VzKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9jdXMoZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRW5hYmxlIGtleWJvYXJkIG5hdmlnYXRpb25cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBpZiAoIWN1cnJlbnQub3B0cy5rZXlib2FyZCB8fCBlLmN0cmxLZXkgfHwgZS5hbHRLZXkgfHwgZS5zaGlmdEtleSB8fCAkKGUudGFyZ2V0KS5pcyhcImlucHV0LHRleHRhcmVhLHZpZGVvLGF1ZGlvXCIpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCYWNrc3BhY2UgYW5kIEVzYyBrZXlzXHJcbiAgICAgICAgaWYgKGtleWNvZGUgPT09IDggfHwga2V5Y29kZSA9PT0gMjcpIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLmNsb3NlKGUpO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExlZnQgYXJyb3cgYW5kIFVwIGFycm93XHJcbiAgICAgICAgaWYgKGtleWNvZGUgPT09IDM3IHx8IGtleWNvZGUgPT09IDM4KSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgc2VsZi5wcmV2aW91cygpO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJpZ2ggYXJyb3cgYW5kIERvd24gYXJyb3dcclxuICAgICAgICBpZiAoa2V5Y29kZSA9PT0gMzkgfHwga2V5Y29kZSA9PT0gNDApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLm5leHQoKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnRyaWdnZXIoXCJhZnRlcktleWRvd25cIiwgZSwga2V5Y29kZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gSGlkZSBjb250cm9scyBhZnRlciBzb21lIGluYWN0aXZpdHkgcGVyaW9kXHJcbiAgICAgIGlmIChzZWxmLmdyb3VwW3NlbGYuY3VyckluZGV4XS5vcHRzLmlkbGVUaW1lKSB7XHJcbiAgICAgICAgc2VsZi5pZGxlU2Vjb25kc0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAkRC5vbihcclxuICAgICAgICAgIFwibW91c2Vtb3ZlLmZiLWlkbGUgbW91c2VsZWF2ZS5mYi1pZGxlIG1vdXNlZG93bi5mYi1pZGxlIHRvdWNoc3RhcnQuZmItaWRsZSB0b3VjaG1vdmUuZmItaWRsZSBzY3JvbGwuZmItaWRsZSBrZXlkb3duLmZiLWlkbGVcIixcclxuICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgc2VsZi5pZGxlU2Vjb25kc0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNJZGxlKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5zaG93Q29udHJvbHMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5pc0lkbGUgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzZWxmLmlkbGVJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyKys7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID49IHNlbGYuZ3JvdXBbc2VsZi5jdXJySW5kZXhdLm9wdHMuaWRsZVRpbWUgJiYgIXNlbGYuaXNEcmFnZ2luZykge1xyXG4gICAgICAgICAgICBzZWxmLmlzSWRsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaGlkZUNvbnRyb2xzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gUmVtb3ZlIGV2ZW50cyBhZGRlZCBieSB0aGUgY29yZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHJlbW92ZUV2ZW50czogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICRXLm9mZihcIm9yaWVudGF0aW9uY2hhbmdlLmZiIHJlc2l6ZS5mYlwiKTtcclxuICAgICAgJEQub2ZmKFwia2V5ZG93bi5mYiAuZmItaWRsZVwiKTtcclxuXHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGFpbmVyLm9mZihcIi5mYi1jbG9zZSAuZmItcHJldiAuZmItbmV4dFwiKTtcclxuXHJcbiAgICAgIGlmIChzZWxmLmlkbGVJbnRlcnZhbCkge1xyXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHNlbGYuaWRsZUludGVydmFsKTtcclxuXHJcbiAgICAgICAgc2VsZi5pZGxlSW50ZXJ2YWwgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENoYW5nZSB0byBwcmV2aW91cyBnYWxsZXJ5IGl0ZW1cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBwcmV2aW91czogZnVuY3Rpb24oZHVyYXRpb24pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuanVtcFRvKHRoaXMuY3VyclBvcyAtIDEsIGR1cmF0aW9uKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ2hhbmdlIHRvIG5leHQgZ2FsbGVyeSBpdGVtXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBuZXh0OiBmdW5jdGlvbihkdXJhdGlvbikge1xyXG4gICAgICByZXR1cm4gdGhpcy5qdW1wVG8odGhpcy5jdXJyUG9zICsgMSwgZHVyYXRpb24pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTd2l0Y2ggdG8gc2VsZWN0ZWQgZ2FsbGVyeSBpdGVtXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAganVtcFRvOiBmdW5jdGlvbihwb3MsIGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBncm91cExlbiA9IHNlbGYuZ3JvdXAubGVuZ3RoLFxyXG4gICAgICAgIGZpcnN0UnVuLFxyXG4gICAgICAgIGlzTW92ZWQsXHJcbiAgICAgICAgbG9vcCxcclxuICAgICAgICBjdXJyZW50LFxyXG4gICAgICAgIHByZXZpb3VzLFxyXG4gICAgICAgIHNsaWRlUG9zLFxyXG4gICAgICAgIHN0YWdlUG9zLFxyXG4gICAgICAgIHByb3AsXHJcbiAgICAgICAgZGlmZjtcclxuXHJcbiAgICAgIGlmIChzZWxmLmlzRHJhZ2dpbmcgfHwgc2VsZi5pc0Nsb3NpbmcgfHwgKHNlbGYuaXNBbmltYXRpbmcgJiYgc2VsZi5maXJzdFJ1bikpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNob3VsZCBsb29wP1xyXG4gICAgICBwb3MgPSBwYXJzZUludChwb3MsIDEwKTtcclxuICAgICAgbG9vcCA9IHNlbGYuY3VycmVudCA/IHNlbGYuY3VycmVudC5vcHRzLmxvb3AgOiBzZWxmLm9wdHMubG9vcDtcclxuXHJcbiAgICAgIGlmICghbG9vcCAmJiAocG9zIDwgMCB8fCBwb3MgPj0gZ3JvdXBMZW4pKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBvcGVuaW5nIGZvciB0aGUgZmlyc3QgdGltZTsgdGhpcyBoZWxwcyB0byBzcGVlZCB0aGluZ3MgdXBcclxuICAgICAgZmlyc3RSdW4gPSBzZWxmLmZpcnN0UnVuID0gIU9iamVjdC5rZXlzKHNlbGYuc2xpZGVzKS5sZW5ndGg7XHJcblxyXG4gICAgICAvLyBDcmVhdGUgc2xpZGVzXHJcbiAgICAgIHByZXZpb3VzID0gc2VsZi5jdXJyZW50O1xyXG5cclxuICAgICAgc2VsZi5wcmV2SW5kZXggPSBzZWxmLmN1cnJJbmRleDtcclxuICAgICAgc2VsZi5wcmV2UG9zID0gc2VsZi5jdXJyUG9zO1xyXG5cclxuICAgICAgY3VycmVudCA9IHNlbGYuY3JlYXRlU2xpZGUocG9zKTtcclxuXHJcbiAgICAgIGlmIChncm91cExlbiA+IDEpIHtcclxuICAgICAgICBpZiAobG9vcCB8fCBjdXJyZW50LmluZGV4IDwgZ3JvdXBMZW4gLSAxKSB7XHJcbiAgICAgICAgICBzZWxmLmNyZWF0ZVNsaWRlKHBvcyArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxvb3AgfHwgY3VycmVudC5pbmRleCA+IDApIHtcclxuICAgICAgICAgIHNlbGYuY3JlYXRlU2xpZGUocG9zIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmN1cnJlbnQgPSBjdXJyZW50O1xyXG4gICAgICBzZWxmLmN1cnJJbmRleCA9IGN1cnJlbnQuaW5kZXg7XHJcbiAgICAgIHNlbGYuY3VyclBvcyA9IGN1cnJlbnQucG9zO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKFwiYmVmb3JlU2hvd1wiLCBmaXJzdFJ1bik7XHJcblxyXG4gICAgICBzZWxmLnVwZGF0ZUNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAvLyBWYWxpZGF0ZSBkdXJhdGlvbiBsZW5ndGhcclxuICAgICAgY3VycmVudC5mb3JjZWREdXJhdGlvbiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgIGlmICgkLmlzTnVtZXJpYyhkdXJhdGlvbikpIHtcclxuICAgICAgICBjdXJyZW50LmZvcmNlZER1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHVyYXRpb24gPSBjdXJyZW50Lm9wdHNbZmlyc3RSdW4gPyBcImFuaW1hdGlvbkR1cmF0aW9uXCIgOiBcInRyYW5zaXRpb25EdXJhdGlvblwiXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZHVyYXRpb24gPSBwYXJzZUludChkdXJhdGlvbiwgMTApO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgdXNlciBoYXMgc3dpcGVkIHRoZSBzbGlkZXMgb3IgaWYgc3RpbGwgYW5pbWF0aW5nXHJcbiAgICAgIGlzTW92ZWQgPSBzZWxmLmlzTW92ZWQoY3VycmVudCk7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCBzbGlkZSBpcyB2aXNpYmxlXHJcbiAgICAgIGN1cnJlbnQuJHNsaWRlLmFkZENsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWN1cnJlbnRcIik7XHJcblxyXG4gICAgICAvLyBGcmVzaCBzdGFydCAtIHJldmVhbCBjb250YWluZXIsIGN1cnJlbnQgc2xpZGUgYW5kIHN0YXJ0IGxvYWRpbmcgY29udGVudFxyXG4gICAgICBpZiAoZmlyc3RSdW4pIHtcclxuICAgICAgICBpZiAoY3VycmVudC5vcHRzLmFuaW1hdGlvbkVmZmVjdCAmJiBkdXJhdGlvbikge1xyXG4gICAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBkdXJhdGlvbiArIFwibXNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5hZGRDbGFzcyhcImZhbmN5Ym94LWlzLW9wZW5cIikudHJpZ2dlcihcImZvY3VzXCIpO1xyXG5cclxuICAgICAgICAvLyBBdHRlbXB0IHRvIGxvYWQgY29udGVudCBpbnRvIHNsaWRlXHJcbiAgICAgICAgLy8gVGhpcyB3aWxsIGxhdGVyIGNhbGwgYGFmdGVyTG9hZGAgLT4gYHJldmVhbENvbnRlbnRgXHJcbiAgICAgICAgc2VsZi5sb2FkU2xpZGUoY3VycmVudCk7XHJcblxyXG4gICAgICAgIHNlbGYucHJlbG9hZChcImltYWdlXCIpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEdldCBhY3R1YWwgc2xpZGUvc3RhZ2UgcG9zaXRpb25zIChiZWZvcmUgY2xlYW5pbmcgdXApXHJcbiAgICAgIHNsaWRlUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUocHJldmlvdXMuJHNsaWRlKTtcclxuICAgICAgc3RhZ2VQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShzZWxmLiRyZWZzLnN0YWdlKTtcclxuXHJcbiAgICAgIC8vIENsZWFuIHVwIGFsbCBzbGlkZXNcclxuICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcclxuICAgICAgICAkLmZhbmN5Ym94LnN0b3Aoc2xpZGUuJHNsaWRlLCB0cnVlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAocHJldmlvdXMucG9zICE9PSBjdXJyZW50LnBvcykge1xyXG4gICAgICAgIHByZXZpb3VzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcHJldmlvdXMuJHNsaWRlLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWNvbXBsZXRlIGZhbmN5Ym94LXNsaWRlLS1jdXJyZW50XCIpO1xyXG5cclxuICAgICAgLy8gSWYgc2xpZGVzIGFyZSBvdXQgb2YgcGxhY2UsIHRoZW4gYW5pbWF0ZSB0aGVtIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuICAgICAgaWYgKGlzTW92ZWQpIHtcclxuICAgICAgICAvLyBDYWxjdWxhdGUgaG9yaXpvbnRhbCBzd2lwZSBkaXN0YW5jZVxyXG4gICAgICAgIGRpZmYgPSBzbGlkZVBvcy5sZWZ0IC0gKHByZXZpb3VzLnBvcyAqIHNsaWRlUG9zLndpZHRoICsgcHJldmlvdXMucG9zICogcHJldmlvdXMub3B0cy5ndXR0ZXIpO1xyXG5cclxuICAgICAgICAkLmVhY2goc2VsZi5zbGlkZXMsIGZ1bmN0aW9uKGluZGV4LCBzbGlkZSkge1xyXG4gICAgICAgICAgc2xpZGUuJHNsaWRlLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtYW5pbWF0ZWRcIikucmVtb3ZlQ2xhc3MoZnVuY3Rpb24oaW5kZXgsIGNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKGNsYXNzTmFtZS5tYXRjaCgvKF58XFxzKWZhbmN5Ym94LWZ4LVxcUysvZykgfHwgW10pLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgZWFjaCBzbGlkZSBpcyBpbiBlcXVhbCBkaXN0YW5jZVxyXG4gICAgICAgICAgLy8gVGhpcyBpcyBtb3N0bHkgbmVlZGVkIGZvciBmcmVzaGx5IGFkZGVkIHNsaWRlcywgYmVjYXVzZSB0aGV5IGFyZSBub3QgeWV0IHBvc2l0aW9uZWRcclxuICAgICAgICAgIHZhciBsZWZ0UG9zID0gc2xpZGUucG9zICogc2xpZGVQb3Mud2lkdGggKyBzbGlkZS5wb3MgKiBzbGlkZS5vcHRzLmd1dHRlcjtcclxuXHJcbiAgICAgICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZShzbGlkZS4kc2xpZGUsIHt0b3A6IDAsIGxlZnQ6IGxlZnRQb3MgLSBzdGFnZVBvcy5sZWZ0ICsgZGlmZn0pO1xyXG5cclxuICAgICAgICAgIGlmIChzbGlkZS5wb3MgIT09IGN1cnJlbnQucG9zKSB7XHJcbiAgICAgICAgICAgIHNsaWRlLiRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1cIiArIChzbGlkZS5wb3MgPiBjdXJyZW50LnBvcyA/IFwibmV4dFwiIDogXCJwcmV2aW91c1wiKSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUmVkcmF3IHRvIG1ha2Ugc3VyZSB0aGF0IHRyYW5zaXRpb24gd2lsbCBzdGFydFxyXG4gICAgICAgICAgZm9yY2VSZWRyYXcoc2xpZGUuJHNsaWRlKTtcclxuXHJcbiAgICAgICAgICAvLyBBbmltYXRlIHRoZSBzbGlkZVxyXG4gICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgbGVmdDogKHNsaWRlLnBvcyAtIGN1cnJlbnQucG9zKSAqIHNsaWRlUG9zLndpZHRoICsgKHNsaWRlLnBvcyAtIGN1cnJlbnQucG9zKSAqIHNsaWRlLm9wdHMuZ3V0dGVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGR1cmF0aW9uLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBzbGlkZS4kc2xpZGVcclxuICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFwiXCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tbmV4dCBmYW5jeWJveC1zbGlkZS0tcHJldmlvdXNcIik7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiAmJiBjdXJyZW50Lm9wdHMudHJhbnNpdGlvbkVmZmVjdCkge1xyXG4gICAgICAgIC8vIFNldCB0cmFuc2l0aW9uIGVmZmVjdCBmb3IgcHJldmlvdXNseSBhY3RpdmUgc2xpZGVcclxuICAgICAgICBwcm9wID0gXCJmYW5jeWJveC1hbmltYXRlZCBmYW5jeWJveC1meC1cIiArIGN1cnJlbnQub3B0cy50cmFuc2l0aW9uRWZmZWN0O1xyXG5cclxuICAgICAgICBwcmV2aW91cy4kc2xpZGUuYWRkQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tXCIgKyAocHJldmlvdXMucG9zID4gY3VycmVudC5wb3MgPyBcIm5leHRcIiA6IFwicHJldmlvdXNcIikpO1xyXG5cclxuICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoXHJcbiAgICAgICAgICBwcmV2aW91cy4kc2xpZGUsXHJcbiAgICAgICAgICBwcm9wLFxyXG4gICAgICAgICAgZHVyYXRpb24sXHJcbiAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHJldmlvdXMuJHNsaWRlLnJlbW92ZUNsYXNzKHByb3ApLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzXCIpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuaXNMb2FkZWQpIHtcclxuICAgICAgICBzZWxmLnJldmVhbENvbnRlbnQoY3VycmVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5sb2FkU2xpZGUoY3VycmVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYucHJlbG9hZChcImltYWdlXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDcmVhdGUgbmV3IFwic2xpZGVcIiBlbGVtZW50XHJcbiAgICAvLyBUaGVzZSBhcmUgZ2FsbGVyeSBpdGVtcyAgdGhhdCBhcmUgYWN0dWFsbHkgYWRkZWQgdG8gRE9NXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgY3JlYXRlU2xpZGU6IGZ1bmN0aW9uKHBvcykge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgJHNsaWRlLFxyXG4gICAgICAgIGluZGV4O1xyXG5cclxuICAgICAgaW5kZXggPSBwb3MgJSBzZWxmLmdyb3VwLmxlbmd0aDtcclxuICAgICAgaW5kZXggPSBpbmRleCA8IDAgPyBzZWxmLmdyb3VwLmxlbmd0aCArIGluZGV4IDogaW5kZXg7XHJcblxyXG4gICAgICBpZiAoIXNlbGYuc2xpZGVzW3Bvc10gJiYgc2VsZi5ncm91cFtpbmRleF0pIHtcclxuICAgICAgICAkc2xpZGUgPSAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtc2xpZGVcIj48L2Rpdj4nKS5hcHBlbmRUbyhzZWxmLiRyZWZzLnN0YWdlKTtcclxuXHJcbiAgICAgICAgc2VsZi5zbGlkZXNbcG9zXSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzZWxmLmdyb3VwW2luZGV4XSwge1xyXG4gICAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgICAkc2xpZGU6ICRzbGlkZSxcclxuICAgICAgICAgIGlzTG9hZGVkOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVNsaWRlKHNlbGYuc2xpZGVzW3Bvc10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc2VsZi5zbGlkZXNbcG9zXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2NhbGUgaW1hZ2UgdG8gdGhlIGFjdHVhbCBzaXplIG9mIHRoZSBpbWFnZTtcclxuICAgIC8vIHggYW5kIHkgdmFsdWVzIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgc2xpZGVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBzY2FsZVRvQWN0dWFsOiBmdW5jdGlvbih4LCB5LCBkdXJhdGlvbikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICAkY29udGVudCA9IGN1cnJlbnQuJGNvbnRlbnQsXHJcbiAgICAgICAgY2FudmFzV2lkdGggPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShjdXJyZW50LiRzbGlkZSkud2lkdGgsXHJcbiAgICAgICAgY2FudmFzSGVpZ2h0ID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoY3VycmVudC4kc2xpZGUpLmhlaWdodCxcclxuICAgICAgICBuZXdJbWdXaWR0aCA9IGN1cnJlbnQud2lkdGgsXHJcbiAgICAgICAgbmV3SW1nSGVpZ2h0ID0gY3VycmVudC5oZWlnaHQsXHJcbiAgICAgICAgaW1nUG9zLFxyXG4gICAgICAgIHBvc1gsXHJcbiAgICAgICAgcG9zWSxcclxuICAgICAgICBzY2FsZVgsXHJcbiAgICAgICAgc2NhbGVZO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNBbmltYXRpbmcgfHwgc2VsZi5pc01vdmVkKCkgfHwgISRjb250ZW50IHx8ICEoY3VycmVudC50eXBlID09IFwiaW1hZ2VcIiAmJiBjdXJyZW50LmlzTG9hZGVkICYmICFjdXJyZW50Lmhhc0Vycm9yKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAkLmZhbmN5Ym94LnN0b3AoJGNvbnRlbnQpO1xyXG5cclxuICAgICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IGNhbnZhc1dpZHRoICogMC41IDogeDtcclxuICAgICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IGNhbnZhc0hlaWdodCAqIDAuNSA6IHk7XHJcblxyXG4gICAgICBpbWdQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSgkY29udGVudCk7XHJcblxyXG4gICAgICBpbWdQb3MudG9wIC09ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKGN1cnJlbnQuJHNsaWRlKS50b3A7XHJcbiAgICAgIGltZ1Bvcy5sZWZ0IC09ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKGN1cnJlbnQuJHNsaWRlKS5sZWZ0O1xyXG5cclxuICAgICAgc2NhbGVYID0gbmV3SW1nV2lkdGggLyBpbWdQb3Mud2lkdGg7XHJcbiAgICAgIHNjYWxlWSA9IG5ld0ltZ0hlaWdodCAvIGltZ1Bvcy5oZWlnaHQ7XHJcblxyXG4gICAgICAvLyBHZXQgY2VudGVyIHBvc2l0aW9uIGZvciBvcmlnaW5hbCBpbWFnZVxyXG4gICAgICBwb3NYID0gY2FudmFzV2lkdGggKiAwLjUgLSBuZXdJbWdXaWR0aCAqIDAuNTtcclxuICAgICAgcG9zWSA9IGNhbnZhc0hlaWdodCAqIDAuNSAtIG5ld0ltZ0hlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSBpbWFnZSBkb2VzIG5vdCBtb3ZlIGF3YXkgZnJvbSBlZGdlc1xyXG4gICAgICBpZiAobmV3SW1nV2lkdGggPiBjYW52YXNXaWR0aCkge1xyXG4gICAgICAgIHBvc1ggPSBpbWdQb3MubGVmdCAqIHNjYWxlWCAtICh4ICogc2NhbGVYIC0geCk7XHJcblxyXG4gICAgICAgIGlmIChwb3NYID4gMCkge1xyXG4gICAgICAgICAgcG9zWCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocG9zWCA8IGNhbnZhc1dpZHRoIC0gbmV3SW1nV2lkdGgpIHtcclxuICAgICAgICAgIHBvc1ggPSBjYW52YXNXaWR0aCAtIG5ld0ltZ1dpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5ld0ltZ0hlaWdodCA+IGNhbnZhc0hlaWdodCkge1xyXG4gICAgICAgIHBvc1kgPSBpbWdQb3MudG9wICogc2NhbGVZIC0gKHkgKiBzY2FsZVkgLSB5KTtcclxuXHJcbiAgICAgICAgaWYgKHBvc1kgPiAwKSB7XHJcbiAgICAgICAgICBwb3NZID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwb3NZIDwgY2FudmFzSGVpZ2h0IC0gbmV3SW1nSGVpZ2h0KSB7XHJcbiAgICAgICAgICBwb3NZID0gY2FudmFzSGVpZ2h0IC0gbmV3SW1nSGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi51cGRhdGVDdXJzb3IobmV3SW1nV2lkdGgsIG5ld0ltZ0hlaWdodCk7XHJcblxyXG4gICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoXHJcbiAgICAgICAgJGNvbnRlbnQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdG9wOiBwb3NZLFxyXG4gICAgICAgICAgbGVmdDogcG9zWCxcclxuICAgICAgICAgIHNjYWxlWDogc2NhbGVYLFxyXG4gICAgICAgICAgc2NhbGVZOiBzY2FsZVlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGR1cmF0aW9uIHx8IDM2NixcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICAvLyBTdG9wIHNsaWRlc2hvd1xyXG4gICAgICBpZiAoc2VsZi5TbGlkZVNob3cgJiYgc2VsZi5TbGlkZVNob3cuaXNBY3RpdmUpIHtcclxuICAgICAgICBzZWxmLlNsaWRlU2hvdy5zdG9wKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2NhbGUgaW1hZ2UgdG8gZml0IGluc2lkZSBwYXJlbnQgZWxlbWVudFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHNjYWxlVG9GaXQ6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICRjb250ZW50ID0gY3VycmVudC4kY29udGVudCxcclxuICAgICAgICBlbmQ7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc0FuaW1hdGluZyB8fCBzZWxmLmlzTW92ZWQoKSB8fCAhJGNvbnRlbnQgfHwgIShjdXJyZW50LnR5cGUgPT0gXCJpbWFnZVwiICYmIGN1cnJlbnQuaXNMb2FkZWQgJiYgIWN1cnJlbnQuaGFzRXJyb3IpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmlzQW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICQuZmFuY3lib3guc3RvcCgkY29udGVudCk7XHJcblxyXG4gICAgICBlbmQgPSBzZWxmLmdldEZpdFBvcyhjdXJyZW50KTtcclxuXHJcbiAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKGVuZC53aWR0aCwgZW5kLmhlaWdodCk7XHJcblxyXG4gICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoXHJcbiAgICAgICAgJGNvbnRlbnQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdG9wOiBlbmQudG9wLFxyXG4gICAgICAgICAgbGVmdDogZW5kLmxlZnQsXHJcbiAgICAgICAgICBzY2FsZVg6IGVuZC53aWR0aCAvICRjb250ZW50LndpZHRoKCksXHJcbiAgICAgICAgICBzY2FsZVk6IGVuZC5oZWlnaHQgLyAkY29udGVudC5oZWlnaHQoKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZHVyYXRpb24gfHwgMzY2LFxyXG4gICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGltYWdlIHNpemUgdG8gZml0IGluc2lkZSB2aWV3cG9ydFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGdldEZpdFBvczogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICRjb250ZW50ID0gc2xpZGUuJGNvbnRlbnQsXHJcbiAgICAgICAgJHNsaWRlID0gc2xpZGUuJHNsaWRlLFxyXG4gICAgICAgIHdpZHRoID0gc2xpZGUud2lkdGggfHwgc2xpZGUub3B0cy53aWR0aCxcclxuICAgICAgICBoZWlnaHQgPSBzbGlkZS5oZWlnaHQgfHwgc2xpZGUub3B0cy5oZWlnaHQsXHJcbiAgICAgICAgbWF4V2lkdGgsXHJcbiAgICAgICAgbWF4SGVpZ2h0LFxyXG4gICAgICAgIG1pblJhdGlvLFxyXG4gICAgICAgIGFzcGVjdFJhdGlvLFxyXG4gICAgICAgIHJleiA9IHt9O1xyXG5cclxuICAgICAgaWYgKCFzbGlkZS5pc0xvYWRlZCB8fCAhJGNvbnRlbnQgfHwgISRjb250ZW50Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbWF4V2lkdGggPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShzZWxmLiRyZWZzLnN0YWdlKS53aWR0aDtcclxuICAgICAgbWF4SGVpZ2h0ID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoc2VsZi4kcmVmcy5zdGFnZSkuaGVpZ2h0O1xyXG5cclxuICAgICAgbWF4V2lkdGggLT1cclxuICAgICAgICBwYXJzZUZsb2F0KCRzbGlkZS5jc3MoXCJwYWRkaW5nTGVmdFwiKSkgK1xyXG4gICAgICAgIHBhcnNlRmxvYXQoJHNsaWRlLmNzcyhcInBhZGRpbmdSaWdodFwiKSkgK1xyXG4gICAgICAgIHBhcnNlRmxvYXQoJGNvbnRlbnQuY3NzKFwibWFyZ2luTGVmdFwiKSkgK1xyXG4gICAgICAgIHBhcnNlRmxvYXQoJGNvbnRlbnQuY3NzKFwibWFyZ2luUmlnaHRcIikpO1xyXG5cclxuICAgICAgbWF4SGVpZ2h0IC09XHJcbiAgICAgICAgcGFyc2VGbG9hdCgkc2xpZGUuY3NzKFwicGFkZGluZ1RvcFwiKSkgK1xyXG4gICAgICAgIHBhcnNlRmxvYXQoJHNsaWRlLmNzcyhcInBhZGRpbmdCb3R0b21cIikpICtcclxuICAgICAgICBwYXJzZUZsb2F0KCRjb250ZW50LmNzcyhcIm1hcmdpblRvcFwiKSkgK1xyXG4gICAgICAgIHBhcnNlRmxvYXQoJGNvbnRlbnQuY3NzKFwibWFyZ2luQm90dG9tXCIpKTtcclxuXHJcbiAgICAgIGlmICghd2lkdGggfHwgIWhlaWdodCkge1xyXG4gICAgICAgIHdpZHRoID0gbWF4V2lkdGg7XHJcbiAgICAgICAgaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtaW5SYXRpbyA9IE1hdGgubWluKDEsIG1heFdpZHRoIC8gd2lkdGgsIG1heEhlaWdodCAvIGhlaWdodCk7XHJcblxyXG4gICAgICB3aWR0aCA9IG1pblJhdGlvICogd2lkdGg7XHJcbiAgICAgIGhlaWdodCA9IG1pblJhdGlvICogaGVpZ2h0O1xyXG5cclxuICAgICAgLy8gQWRqdXN0IHdpZHRoL2hlaWdodCB0byBwcmVjaXNlbHkgZml0IGludG8gY29udGFpbmVyXHJcbiAgICAgIGlmICh3aWR0aCA+IG1heFdpZHRoIC0gMC41KSB7XHJcbiAgICAgICAgd2lkdGggPSBtYXhXaWR0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGhlaWdodCA+IG1heEhlaWdodCAtIDAuNSkge1xyXG4gICAgICAgIGhlaWdodCA9IG1heEhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNsaWRlLnR5cGUgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgIHJlei50b3AgPSBNYXRoLmZsb29yKChtYXhIZWlnaHQgLSBoZWlnaHQpICogMC41KSArIHBhcnNlRmxvYXQoJHNsaWRlLmNzcyhcInBhZGRpbmdUb3BcIikpO1xyXG4gICAgICAgIHJlei5sZWZ0ID0gTWF0aC5mbG9vcigobWF4V2lkdGggLSB3aWR0aCkgKiAwLjUpICsgcGFyc2VGbG9hdCgkc2xpZGUuY3NzKFwicGFkZGluZ0xlZnRcIikpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNsaWRlLmNvbnRlbnRUeXBlID09PSBcInZpZGVvXCIpIHtcclxuICAgICAgICAvLyBGb3JjZSBhc3BlY3QgcmF0aW8gZm9yIHRoZSB2aWRlb1xyXG4gICAgICAgIC8vIFwiSSBzYXkgdGhlIHdob2xlIHdvcmxkIG11c3QgbGVhcm4gb2Ygb3VyIHBlYWNlZnVsIHdheXPigKYgYnkgZm9yY2UhXCJcclxuICAgICAgICBhc3BlY3RSYXRpbyA9IHNsaWRlLm9wdHMud2lkdGggJiYgc2xpZGUub3B0cy5oZWlnaHQgPyB3aWR0aCAvIGhlaWdodCA6IHNsaWRlLm9wdHMucmF0aW8gfHwgMTYgLyA5O1xyXG5cclxuICAgICAgICBpZiAoaGVpZ2h0ID4gd2lkdGggLyBhc3BlY3RSYXRpbykge1xyXG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcclxuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoID4gaGVpZ2h0ICogYXNwZWN0UmF0aW8pIHtcclxuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXoud2lkdGggPSB3aWR0aDtcclxuICAgICAgcmV6LmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgIHJldHVybiByZXo7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFVwZGF0ZSBjb250ZW50IHNpemUgYW5kIHBvc2l0aW9uIGZvciBhbGwgc2xpZGVzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICQuZWFjaChzZWxmLnNsaWRlcywgZnVuY3Rpb24oa2V5LCBzbGlkZSkge1xyXG4gICAgICAgIHNlbGYudXBkYXRlU2xpZGUoc2xpZGUsIGUpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gVXBkYXRlIHNsaWRlIGNvbnRlbnQgcG9zaXRpb24gYW5kIHNpemVcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdXBkYXRlU2xpZGU6IGZ1bmN0aW9uKHNsaWRlLCBlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICAkY29udGVudCA9IHNsaWRlICYmIHNsaWRlLiRjb250ZW50LFxyXG4gICAgICAgIHdpZHRoID0gc2xpZGUud2lkdGggfHwgc2xpZGUub3B0cy53aWR0aCxcclxuICAgICAgICBoZWlnaHQgPSBzbGlkZS5oZWlnaHQgfHwgc2xpZGUub3B0cy5oZWlnaHQsXHJcbiAgICAgICAgJHNsaWRlID0gc2xpZGUuJHNsaWRlO1xyXG5cclxuICAgICAgLy8gRmlyc3QsIHByZXZlbnQgY2FwdGlvbiBvdmVybGFwLCBpZiBuZWVkZWRcclxuICAgICAgc2VsZi5hZGp1c3RDYXB0aW9uKHNsaWRlKTtcclxuXHJcbiAgICAgIC8vIFRoZW4gcmVzaXplIGNvbnRlbnQgdG8gZml0IGluc2lkZSB0aGUgc2xpZGVcclxuICAgICAgaWYgKCRjb250ZW50ICYmICh3aWR0aCB8fCBoZWlnaHQgfHwgc2xpZGUuY29udGVudFR5cGUgPT09IFwidmlkZW9cIikgJiYgIXNsaWRlLmhhc0Vycm9yKSB7XHJcbiAgICAgICAgJC5mYW5jeWJveC5zdG9wKCRjb250ZW50KTtcclxuXHJcbiAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoJGNvbnRlbnQsIHNlbGYuZ2V0Rml0UG9zKHNsaWRlKSk7XHJcblxyXG4gICAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcykge1xyXG4gICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGVuIHNvbWUgYWRqdXN0bWVudHNcclxuICAgICAgc2VsZi5hZGp1c3RMYXlvdXQoc2xpZGUpO1xyXG5cclxuICAgICAgaWYgKCRzbGlkZS5sZW5ndGgpIHtcclxuICAgICAgICAkc2xpZGUudHJpZ2dlcihcInJlZnJlc2hcIik7XHJcblxyXG4gICAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcykge1xyXG4gICAgICAgICAgc2VsZi4kcmVmcy50b29sYmFyXHJcbiAgICAgICAgICAgIC5hZGQoc2VsZi4kcmVmcy5uYXZpZ2F0aW9uLmZpbmQoXCIuZmFuY3lib3gtYnV0dG9uLS1hcnJvd19yaWdodFwiKSlcclxuICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKFwiY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFyXCIsICRzbGlkZS5nZXQoMCkuc2Nyb2xsSGVpZ2h0ID4gJHNsaWRlLmdldCgwKS5jbGllbnRIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKFwib25VcGRhdGVcIiwgc2xpZGUsIGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBIb3Jpem9udGFsbHkgY2VudGVyIHNsaWRlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgY2VudGVyU2xpZGU6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICRzbGlkZSA9IGN1cnJlbnQuJHNsaWRlO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNDbG9zaW5nIHx8ICFjdXJyZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2xpZGUuc2libGluZ3MoKS5jc3Moe1xyXG4gICAgICAgIHRyYW5zZm9ybTogXCJcIixcclxuICAgICAgICBvcGFjaXR5OiBcIlwiXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHNsaWRlXHJcbiAgICAgICAgLnBhcmVudCgpXHJcbiAgICAgICAgLmNoaWxkcmVuKClcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tcHJldmlvdXMgZmFuY3lib3gtc2xpZGUtLW5leHRcIik7XHJcblxyXG4gICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoXHJcbiAgICAgICAgJHNsaWRlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gMCA6IGR1cmF0aW9uLFxyXG4gICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgLy8gQ2xlYW4gdXBcclxuICAgICAgICAgICRzbGlkZS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwiXCIsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IFwiXCJcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmICghY3VycmVudC5pc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIHNlbGYuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhbHNlXHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENoZWNrIGlmIGN1cnJlbnQgc2xpZGUgaXMgbW92ZWQgKHN3aXBlZClcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBpc01vdmVkOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgY3VycmVudCA9IHNsaWRlIHx8IHRoaXMuY3VycmVudCxcclxuICAgICAgICBzbGlkZVBvcyxcclxuICAgICAgICBzdGFnZVBvcztcclxuXHJcbiAgICAgIGlmICghY3VycmVudCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3RhZ2VQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSh0aGlzLiRyZWZzLnN0YWdlKTtcclxuICAgICAgc2xpZGVQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShjdXJyZW50LiRzbGlkZSk7XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgICFjdXJyZW50LiRzbGlkZS5oYXNDbGFzcyhcImZhbmN5Ym94LWFuaW1hdGVkXCIpICYmXHJcbiAgICAgICAgKE1hdGguYWJzKHNsaWRlUG9zLnRvcCAtIHN0YWdlUG9zLnRvcCkgPiAwLjUgfHwgTWF0aC5hYnMoc2xpZGVQb3MubGVmdCAtIHN0YWdlUG9zLmxlZnQpID4gMC41KVxyXG4gICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBVcGRhdGUgY3Vyc29yIHN0eWxlIGRlcGVuZGluZyBpZiBjb250ZW50IGNhbiBiZSB6b29tZWRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHVwZGF0ZUN1cnNvcjogZnVuY3Rpb24obmV4dFdpZHRoLCBuZXh0SGVpZ2h0KSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICRjb250YWluZXIgPSBzZWxmLiRyZWZzLmNvbnRhaW5lcixcclxuICAgICAgICBjYW5QYW4sXHJcbiAgICAgICAgaXNab29tYWJsZTtcclxuXHJcbiAgICAgIGlmICghY3VycmVudCB8fCBzZWxmLmlzQ2xvc2luZyB8fCAhc2VsZi5HdWVzdHVyZXMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy16b29tYWJsZSBmYW5jeWJveC1jYW4tem9vbUluIGZhbmN5Ym94LWNhbi16b29tT3V0IGZhbmN5Ym94LWNhbi1zd2lwZSBmYW5jeWJveC1jYW4tcGFuXCIpO1xyXG5cclxuICAgICAgY2FuUGFuID0gc2VsZi5jYW5QYW4obmV4dFdpZHRoLCBuZXh0SGVpZ2h0KTtcclxuXHJcbiAgICAgIGlzWm9vbWFibGUgPSBjYW5QYW4gPyB0cnVlIDogc2VsZi5pc1pvb21hYmxlKCk7XHJcblxyXG4gICAgICAkY29udGFpbmVyLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtaXMtem9vbWFibGVcIiwgaXNab29tYWJsZSk7XHJcblxyXG4gICAgICAkKFwiW2RhdGEtZmFuY3lib3gtem9vbV1cIikucHJvcChcImRpc2FibGVkXCIsICFpc1pvb21hYmxlKTtcclxuXHJcbiAgICAgIGlmIChjYW5QYW4pIHtcclxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwiZmFuY3lib3gtY2FuLXBhblwiKTtcclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBpc1pvb21hYmxlICYmXHJcbiAgICAgICAgKGN1cnJlbnQub3B0cy5jbGlja0NvbnRlbnQgPT09IFwiem9vbVwiIHx8ICgkLmlzRnVuY3Rpb24oY3VycmVudC5vcHRzLmNsaWNrQ29udGVudCkgJiYgY3VycmVudC5vcHRzLmNsaWNrQ29udGVudChjdXJyZW50KSA9PSBcInpvb21cIikpXHJcbiAgICAgICkge1xyXG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoXCJmYW5jeWJveC1jYW4tem9vbUluXCIpO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQub3B0cy50b3VjaCAmJiAoY3VycmVudC5vcHRzLnRvdWNoLnZlcnRpY2FsIHx8IHNlbGYuZ3JvdXAubGVuZ3RoID4gMSkgJiYgY3VycmVudC5jb250ZW50VHlwZSAhPT0gXCJ2aWRlb1wiKSB7XHJcbiAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyhcImZhbmN5Ym94LWNhbi1zd2lwZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGVjayBpZiBjdXJyZW50IHNsaWRlIGlzIHpvb21hYmxlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaXNab29tYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgIGZpdFBvcztcclxuXHJcbiAgICAgIC8vIEFzc3VtZSB0aGF0IHNsaWRlIGlzIHpvb21hYmxlIGlmOlxyXG4gICAgICAvLyAgIC0gaW1hZ2UgaXMgc3RpbGwgbG9hZGluZ1xyXG4gICAgICAvLyAgIC0gYWN0dWFsIHNpemUgb2YgdGhlIGltYWdlIGlzIHNtYWxsZXIgdGhhbiBhdmFpbGFibGUgYXJlYVxyXG4gICAgICBpZiAoY3VycmVudCAmJiAhc2VsZi5pc0Nsb3NpbmcgJiYgY3VycmVudC50eXBlID09PSBcImltYWdlXCIgJiYgIWN1cnJlbnQuaGFzRXJyb3IpIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnQuaXNMb2FkZWQpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZml0UG9zID0gc2VsZi5nZXRGaXRQb3MoY3VycmVudCk7XHJcblxyXG4gICAgICAgIGlmIChmaXRQb3MgJiYgKGN1cnJlbnQud2lkdGggPiBmaXRQb3Mud2lkdGggfHwgY3VycmVudC5oZWlnaHQgPiBmaXRQb3MuaGVpZ2h0KSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENoZWNrIGlmIGN1cnJlbnQgaW1hZ2UgZGltZW5zaW9ucyBhcmUgc21hbGxlciB0aGFuIGFjdHVhbFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaXNTY2FsZWREb3duOiBmdW5jdGlvbihuZXh0V2lkdGgsIG5leHRIZWlnaHQpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIHJleiA9IGZhbHNlLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQsXHJcbiAgICAgICAgJGNvbnRlbnQgPSBjdXJyZW50LiRjb250ZW50O1xyXG5cclxuICAgICAgaWYgKG5leHRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5leHRIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJleiA9IG5leHRXaWR0aCA8IGN1cnJlbnQud2lkdGggJiYgbmV4dEhlaWdodCA8IGN1cnJlbnQuaGVpZ2h0O1xyXG4gICAgICB9IGVsc2UgaWYgKCRjb250ZW50KSB7XHJcbiAgICAgICAgcmV6ID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoJGNvbnRlbnQpO1xyXG4gICAgICAgIHJleiA9IHJlei53aWR0aCA8IGN1cnJlbnQud2lkdGggJiYgcmV6LmhlaWdodCA8IGN1cnJlbnQuaGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmV6O1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDaGVjayBpZiBpbWFnZSBkaW1lbnNpb25zIGV4Y2VlZCBwYXJlbnQgZWxlbWVudFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBjYW5QYW46IGZ1bmN0aW9uKG5leHRXaWR0aCwgbmV4dEhlaWdodCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICBwb3MgPSBudWxsLFxyXG4gICAgICAgIHJleiA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnQudHlwZSA9PT0gXCJpbWFnZVwiICYmIChjdXJyZW50LmlzQ29tcGxldGUgfHwgKG5leHRXaWR0aCAmJiBuZXh0SGVpZ2h0KSkgJiYgIWN1cnJlbnQuaGFzRXJyb3IpIHtcclxuICAgICAgICByZXogPSBzZWxmLmdldEZpdFBvcyhjdXJyZW50KTtcclxuXHJcbiAgICAgICAgaWYgKG5leHRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5leHRIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcG9zID0ge3dpZHRoOiBuZXh0V2lkdGgsIGhlaWdodDogbmV4dEhlaWdodH07XHJcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50LmlzQ29tcGxldGUpIHtcclxuICAgICAgICAgIHBvcyA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKGN1cnJlbnQuJGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvcyAmJiByZXopIHtcclxuICAgICAgICAgIHJleiA9IE1hdGguYWJzKHBvcy53aWR0aCAtIHJlei53aWR0aCkgPiAxLjUgfHwgTWF0aC5hYnMocG9zLmhlaWdodCAtIHJlei5oZWlnaHQpID4gMS41O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlejtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTG9hZCBjb250ZW50IGludG8gdGhlIHNsaWRlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBsb2FkU2xpZGU6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICB0eXBlLFxyXG4gICAgICAgICRzbGlkZSxcclxuICAgICAgICBhamF4TG9hZDtcclxuXHJcbiAgICAgIGlmIChzbGlkZS5pc0xvYWRpbmcgfHwgc2xpZGUuaXNMb2FkZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNsaWRlLmlzTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAoc2VsZi50cmlnZ2VyKFwiYmVmb3JlTG9hZFwiLCBzbGlkZSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgc2xpZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdHlwZSA9IHNsaWRlLnR5cGU7XHJcbiAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZTtcclxuXHJcbiAgICAgICRzbGlkZVxyXG4gICAgICAgIC5vZmYoXCJyZWZyZXNoXCIpXHJcbiAgICAgICAgLnRyaWdnZXIoXCJvblJlc2V0XCIpXHJcbiAgICAgICAgLmFkZENsYXNzKHNsaWRlLm9wdHMuc2xpZGVDbGFzcyk7XHJcblxyXG4gICAgICAvLyBDcmVhdGUgY29udGVudCBkZXBlbmRpbmcgb24gdGhlIHR5cGVcclxuICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImltYWdlXCI6XHJcbiAgICAgICAgICBzZWxmLnNldEltYWdlKHNsaWRlKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcImlmcmFtZVwiOlxyXG4gICAgICAgICAgc2VsZi5zZXRJZnJhbWUoc2xpZGUpO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwiaHRtbFwiOlxyXG4gICAgICAgICAgc2VsZi5zZXRDb250ZW50KHNsaWRlLCBzbGlkZS5zcmMgfHwgc2xpZGUuY29udGVudCk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJ2aWRlb1wiOlxyXG4gICAgICAgICAgc2VsZi5zZXRDb250ZW50KFxyXG4gICAgICAgICAgICBzbGlkZSxcclxuICAgICAgICAgICAgc2xpZGUub3B0cy52aWRlby50cGxcclxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFx7XFx7c3JjXFx9XFx9L2dpLCBzbGlkZS5zcmMpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7e2Zvcm1hdH19XCIsIHNsaWRlLm9wdHMudmlkZW9Gb3JtYXQgfHwgc2xpZGUub3B0cy52aWRlby5mb3JtYXQgfHwgXCJcIilcclxuICAgICAgICAgICAgICAucmVwbGFjZShcInt7cG9zdGVyfX1cIiwgc2xpZGUudGh1bWIgfHwgXCJcIilcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJpbmxpbmVcIjpcclxuICAgICAgICAgIGlmICgkKHNsaWRlLnNyYykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudChzbGlkZSwgJChzbGlkZS5zcmMpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0RXJyb3Ioc2xpZGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwiYWpheFwiOlxyXG4gICAgICAgICAgc2VsZi5zaG93TG9hZGluZyhzbGlkZSk7XHJcblxyXG4gICAgICAgICAgYWpheExvYWQgPSAkLmFqYXgoXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHt9LCBzbGlkZS5vcHRzLmFqYXguc2V0dGluZ3MsIHtcclxuICAgICAgICAgICAgICB1cmw6IHNsaWRlLnNyYyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgc2VsZi5zZXRDb250ZW50KHNsaWRlLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGpxWEhSICYmIHRleHRTdGF0dXMgIT09IFwiYWJvcnRcIikge1xyXG4gICAgICAgICAgICAgICAgICBzZWxmLnNldEVycm9yKHNsaWRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICRzbGlkZS5vbmUoXCJvblJlc2V0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhamF4TG9hZC5hYm9ydCgpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZWxmLnNldEVycm9yKHNsaWRlKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFVzZSB0aHVtYm5haWwgaW1hZ2UsIGlmIHBvc3NpYmxlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHNldEltYWdlOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgZ2hvc3Q7XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBuZWVkIHRvIHNob3cgbG9hZGluZyBpY29uXHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRpbWcgPSBzbGlkZS4kaW1hZ2U7XHJcblxyXG4gICAgICAgIGlmICghc2VsZi5pc0Nsb3NpbmcgJiYgc2xpZGUuaXNMb2FkaW5nICYmICghJGltZyB8fCAhJGltZy5sZW5ndGggfHwgISRpbWdbMF0uY29tcGxldGUpICYmICFzbGlkZS5oYXNFcnJvcikge1xyXG4gICAgICAgICAgc2VsZi5zaG93TG9hZGluZyhzbGlkZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCA1MCk7XHJcblxyXG4gICAgICAvL0NoZWNrIGlmIGltYWdlIGhhcyBzcmNzZXRcclxuICAgICAgc2VsZi5jaGVja1NyY3NldChzbGlkZSk7XHJcblxyXG4gICAgICAvLyBUaGlzIHdpbGwgYmUgd3JhcHBlciBjb250YWluaW5nIGJvdGggZ2hvc3QgYW5kIGFjdHVhbCBpbWFnZVxyXG4gICAgICBzbGlkZS4kY29udGVudCA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jb250ZW50XCI+PC9kaXY+JylcclxuICAgICAgICAuYWRkQ2xhc3MoXCJmYW5jeWJveC1pcy1oaWRkZW5cIilcclxuICAgICAgICAuYXBwZW5kVG8oc2xpZGUuJHNsaWRlLmFkZENsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWltYWdlXCIpKTtcclxuXHJcbiAgICAgIC8vIElmIHdlIGhhdmUgYSB0aHVtYm5haWwsIHdlIGNhbiBkaXNwbGF5IGl0IHdoaWxlIGFjdHVhbCBpbWFnZSBpcyBsb2FkaW5nXHJcbiAgICAgIC8vIFVzZXJzIHdpbGwgbm90IHN0YXJlIGF0IGJsYWNrIHNjcmVlbiBhbmQgYWN0dWFsIGltYWdlIHdpbGwgYXBwZWFyIGdyYWR1YWxseVxyXG4gICAgICBpZiAoc2xpZGUub3B0cy5wcmVsb2FkICE9PSBmYWxzZSAmJiBzbGlkZS5vcHRzLndpZHRoICYmIHNsaWRlLm9wdHMuaGVpZ2h0ICYmIHNsaWRlLnRodW1iKSB7XHJcbiAgICAgICAgc2xpZGUud2lkdGggPSBzbGlkZS5vcHRzLndpZHRoO1xyXG4gICAgICAgIHNsaWRlLmhlaWdodCA9IHNsaWRlLm9wdHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBnaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcblxyXG4gICAgICAgIGdob3N0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgc2xpZGUuJGdob3N0ID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnaG9zdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNlbGYuYWZ0ZXJMb2FkKHNsaWRlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzbGlkZS4kZ2hvc3QgPSAkKGdob3N0KVxyXG4gICAgICAgICAgLmFkZENsYXNzKFwiZmFuY3lib3gtaW1hZ2VcIilcclxuICAgICAgICAgIC5hcHBlbmRUbyhzbGlkZS4kY29udGVudClcclxuICAgICAgICAgIC5hdHRyKFwic3JjXCIsIHNsaWRlLnRodW1iKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU3RhcnQgbG9hZGluZyBhY3R1YWwgaW1hZ2VcclxuICAgICAgc2VsZi5zZXRCaWdJbWFnZShzbGlkZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENoZWNrIGlmIGltYWdlIGhhcyBzcmNzZXQgYW5kIGdldCB0aGUgc291cmNlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgY2hlY2tTcmNzZXQ6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzcmNzZXQgPSBzbGlkZS5vcHRzLnNyY3NldCB8fCBzbGlkZS5vcHRzLmltYWdlLnNyY3NldCxcclxuICAgICAgICBmb3VuZCxcclxuICAgICAgICB0ZW1wLFxyXG4gICAgICAgIHB4UmF0aW8sXHJcbiAgICAgICAgd2luZG93V2lkdGg7XHJcblxyXG4gICAgICAvLyBJZiB3ZSBoYXZlIFwic3Jjc2V0XCIsIHRoZW4gd2UgbmVlZCB0byBmaW5kIGZpcnN0IG1hdGNoaW5nIFwic3JjXCIgdmFsdWUuXHJcbiAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5LCBiZWNhdXNlIHdoZW4geW91IHNldCBhbiBzcmMgYXR0cmlidXRlLCB0aGUgYnJvd3NlciB3aWxsIHByZWxvYWQgdGhlIGltYWdlXHJcbiAgICAgIC8vIGJlZm9yZSBhbnkgamF2YXNjcmlwdCBvciBldmVuIENTUyBpcyBhcHBsaWVkLlxyXG4gICAgICBpZiAoc3Jjc2V0KSB7XHJcbiAgICAgICAgcHhSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XHJcbiAgICAgICAgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIHB4UmF0aW87XHJcblxyXG4gICAgICAgIHRlbXAgPSBzcmNzZXQuc3BsaXQoXCIsXCIpLm1hcChmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgdmFyIHJldCA9IHt9O1xyXG5cclxuICAgICAgICAgIGVsLnRyaW0oKVxyXG4gICAgICAgICAgICAuc3BsaXQoL1xccysvKVxyXG4gICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbihlbCwgaSkge1xyXG4gICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlSW50KGVsLnN1YnN0cmluZygwLCBlbC5sZW5ndGggLSAxKSwgMTApO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChyZXQudXJsID0gZWwpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldC5wb3N0Zml4ID0gZWxbZWwubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTb3J0IGJ5IHZhbHVlXHJcbiAgICAgICAgdGVtcC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgIHJldHVybiBhLnZhbHVlIC0gYi52YWx1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gT2ssIG5vdyB3ZSBoYXZlIGFuIGFycmF5IG9mIGFsbCBzcmNzZXQgdmFsdWVzXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0ZW1wLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICB2YXIgZWwgPSB0ZW1wW2pdO1xyXG5cclxuICAgICAgICAgIGlmICgoZWwucG9zdGZpeCA9PT0gXCJ3XCIgJiYgZWwudmFsdWUgPj0gd2luZG93V2lkdGgpIHx8IChlbC5wb3N0Zml4ID09PSBcInhcIiAmJiBlbC52YWx1ZSA+PSBweFJhdGlvKSkge1xyXG4gICAgICAgICAgICBmb3VuZCA9IGVsO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIG5vdCBmb3VuZCwgdGFrZSB0aGUgbGFzdCBvbmVcclxuICAgICAgICBpZiAoIWZvdW5kICYmIHRlbXAubGVuZ3RoKSB7XHJcbiAgICAgICAgICBmb3VuZCA9IHRlbXBbdGVtcC5sZW5ndGggLSAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgc2xpZGUuc3JjID0gZm91bmQudXJsO1xyXG5cclxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgZGVmYXVsdCB3aWR0aC9oZWlnaHQgdmFsdWVzLCB3ZSBjYW4gY2FsY3VsYXRlIGhlaWdodCBmb3IgbWF0Y2hpbmcgc291cmNlXHJcbiAgICAgICAgICBpZiAoc2xpZGUud2lkdGggJiYgc2xpZGUuaGVpZ2h0ICYmIGZvdW5kLnBvc3RmaXggPT0gXCJ3XCIpIHtcclxuICAgICAgICAgICAgc2xpZGUuaGVpZ2h0ID0gKHNsaWRlLndpZHRoIC8gc2xpZGUuaGVpZ2h0KSAqIGZvdW5kLnZhbHVlO1xyXG4gICAgICAgICAgICBzbGlkZS53aWR0aCA9IGZvdW5kLnZhbHVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNsaWRlLm9wdHMuc3Jjc2V0ID0gc3Jjc2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDcmVhdGUgZnVsbC1zaXplIGltYWdlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2V0QmlnSW1hZ2U6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpLFxyXG4gICAgICAgICRpbWcgPSAkKGltZyk7XHJcblxyXG4gICAgICBzbGlkZS4kaW1hZ2UgPSAkaW1nXHJcbiAgICAgICAgLm9uZShcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi5zZXRFcnJvcihzbGlkZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub25lKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBzaXplcztcclxuXHJcbiAgICAgICAgICBpZiAoIXNsaWRlLiRnaG9zdCkge1xyXG4gICAgICAgICAgICBzZWxmLnJlc29sdmVJbWFnZVNsaWRlU2l6ZShzbGlkZSwgdGhpcy5uYXR1cmFsV2lkdGgsIHRoaXMubmF0dXJhbEhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmFmdGVyTG9hZChzbGlkZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGYuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoc2xpZGUub3B0cy5zcmNzZXQpIHtcclxuICAgICAgICAgICAgc2l6ZXMgPSBzbGlkZS5vcHRzLnNpemVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzaXplcyB8fCBzaXplcyA9PT0gXCJhdXRvXCIpIHtcclxuICAgICAgICAgICAgICBzaXplcyA9XHJcbiAgICAgICAgICAgICAgICAoc2xpZGUud2lkdGggLyBzbGlkZS5oZWlnaHQgPiAxICYmICRXLndpZHRoKCkgLyAkVy5oZWlnaHQoKSA+IDEgPyBcIjEwMFwiIDogTWF0aC5yb3VuZCgoc2xpZGUud2lkdGggLyBzbGlkZS5oZWlnaHQpICogMTAwKSkgK1xyXG4gICAgICAgICAgICAgICAgXCJ2d1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkaW1nLmF0dHIoXCJzaXplc1wiLCBzaXplcykuYXR0cihcInNyY3NldFwiLCBzbGlkZS5vcHRzLnNyY3NldCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gSGlkZSB0ZW1wb3JhcnkgaW1hZ2UgYWZ0ZXIgc29tZSBkZWxheVxyXG4gICAgICAgICAgaWYgKHNsaWRlLiRnaG9zdCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGlmIChzbGlkZS4kZ2hvc3QgJiYgIXNlbGYuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kZ2hvc3QuaGlkZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgTWF0aC5taW4oMzAwLCBNYXRoLm1heCgxMDAwLCBzbGlkZS5oZWlnaHQgLyAxNjAwKSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoc2xpZGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmFkZENsYXNzKFwiZmFuY3lib3gtaW1hZ2VcIilcclxuICAgICAgICAuYXR0cihcInNyY1wiLCBzbGlkZS5zcmMpXHJcbiAgICAgICAgLmFwcGVuZFRvKHNsaWRlLiRjb250ZW50KTtcclxuXHJcbiAgICAgIGlmICgoaW1nLmNvbXBsZXRlIHx8IGltZy5yZWFkeVN0YXRlID09IFwiY29tcGxldGVcIikgJiYgJGltZy5uYXR1cmFsV2lkdGggJiYgJGltZy5uYXR1cmFsSGVpZ2h0KSB7XHJcbiAgICAgICAgJGltZy50cmlnZ2VyKFwibG9hZFwiKTtcclxuICAgICAgfSBlbHNlIGlmIChpbWcuZXJyb3IpIHtcclxuICAgICAgICAkaW1nLnRyaWdnZXIoXCJlcnJvclwiKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDb21wdXRlcyB0aGUgc2xpZGUgc2l6ZSBmcm9tIGltYWdlIHNpemUgYW5kIG1heFdpZHRoL21heEhlaWdodFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICByZXNvbHZlSW1hZ2VTbGlkZVNpemU6IGZ1bmN0aW9uKHNsaWRlLCBpbWdXaWR0aCwgaW1nSGVpZ2h0KSB7XHJcbiAgICAgIHZhciBtYXhXaWR0aCA9IHBhcnNlSW50KHNsaWRlLm9wdHMud2lkdGgsIDEwKSxcclxuICAgICAgICBtYXhIZWlnaHQgPSBwYXJzZUludChzbGlkZS5vcHRzLmhlaWdodCwgMTApO1xyXG5cclxuICAgICAgLy8gU2V0cyB0aGUgZGVmYXVsdCB2YWx1ZXMgZnJvbSB0aGUgaW1hZ2VcclxuICAgICAgc2xpZGUud2lkdGggPSBpbWdXaWR0aDtcclxuICAgICAgc2xpZGUuaGVpZ2h0ID0gaW1nSGVpZ2h0O1xyXG5cclxuICAgICAgaWYgKG1heFdpZHRoID4gMCkge1xyXG4gICAgICAgIHNsaWRlLndpZHRoID0gbWF4V2lkdGg7XHJcbiAgICAgICAgc2xpZGUuaGVpZ2h0ID0gTWF0aC5mbG9vcigobWF4V2lkdGggKiBpbWdIZWlnaHQpIC8gaW1nV2lkdGgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobWF4SGVpZ2h0ID4gMCkge1xyXG4gICAgICAgIHNsaWRlLndpZHRoID0gTWF0aC5mbG9vcigobWF4SGVpZ2h0ICogaW1nV2lkdGgpIC8gaW1nSGVpZ2h0KTtcclxuICAgICAgICBzbGlkZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ3JlYXRlIGlmcmFtZSB3cmFwcGVyLCBpZnJhbWUgYW5kIGJpbmRpbmdzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBzZXRJZnJhbWU6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBvcHRzID0gc2xpZGUub3B0cy5pZnJhbWUsXHJcbiAgICAgICAgJHNsaWRlID0gc2xpZGUuJHNsaWRlLFxyXG4gICAgICAgICRpZnJhbWU7XHJcblxyXG4gICAgICBzbGlkZS4kY29udGVudCA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jb250ZW50JyArIChvcHRzLnByZWxvYWQgPyBcIiBmYW5jeWJveC1pcy1oaWRkZW5cIiA6IFwiXCIpICsgJ1wiPjwvZGl2PicpXHJcbiAgICAgICAgLmNzcyhvcHRzLmNzcylcclxuICAgICAgICAuYXBwZW5kVG8oJHNsaWRlKTtcclxuXHJcbiAgICAgICRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1cIiArIHNsaWRlLmNvbnRlbnRUeXBlKTtcclxuXHJcbiAgICAgIHNsaWRlLiRpZnJhbWUgPSAkaWZyYW1lID0gJChvcHRzLnRwbC5yZXBsYWNlKC9cXHtybmRcXH0vZywgbmV3IERhdGUoKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIC5hdHRyKG9wdHMuYXR0cilcclxuICAgICAgICAuYXBwZW5kVG8oc2xpZGUuJGNvbnRlbnQpO1xyXG5cclxuICAgICAgaWYgKG9wdHMucHJlbG9hZCkge1xyXG4gICAgICAgIHNlbGYuc2hvd0xvYWRpbmcoc2xpZGUpO1xyXG5cclxuICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5LCBpdCBpcyBub3QgYWx3YXlzIHBvc3NpYmxlIHRvIGRldGVybWluZSBpZiBpZnJhbWUgaXMgc3VjY2Vzc2Z1bGx5IGxvYWRlZFxyXG4gICAgICAgIC8vIChkdWUgdG8gYnJvd3NlciBzZWN1cml0eSBwb2xpY3kpXHJcblxyXG4gICAgICAgICRpZnJhbWUub24oXCJsb2FkLmZiIGVycm9yLmZiXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IDE7XHJcblxyXG4gICAgICAgICAgc2xpZGUuJHNsaWRlLnRyaWdnZXIoXCJyZWZyZXNoXCIpO1xyXG5cclxuICAgICAgICAgIHNlbGYuYWZ0ZXJMb2FkKHNsaWRlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVjYWxjdWxhdGUgaWZyYW1lIGNvbnRlbnQgc2l6ZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgJHNsaWRlLm9uKFwicmVmcmVzaC5mYlwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciAkY29udGVudCA9IHNsaWRlLiRjb250ZW50LFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoID0gb3B0cy5jc3Mud2lkdGgsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0ID0gb3B0cy5jc3MuaGVpZ2h0LFxyXG4gICAgICAgICAgICAkY29udGVudHMsXHJcbiAgICAgICAgICAgICRib2R5O1xyXG5cclxuICAgICAgICAgIGlmICgkaWZyYW1lWzBdLmlzUmVhZHkgIT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICRjb250ZW50cyA9ICRpZnJhbWUuY29udGVudHMoKTtcclxuICAgICAgICAgICAgJGJvZHkgPSAkY29udGVudHMuZmluZChcImJvZHlcIik7XHJcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcblxyXG4gICAgICAgICAgLy8gQ2FsY3VsYXRlIGNvbnRlbnQgZGltZW5zaW9ucywgaWYgaXQgaXMgYWNjZXNzaWJsZVxyXG4gICAgICAgICAgaWYgKCRib2R5ICYmICRib2R5Lmxlbmd0aCAmJiAkYm9keS5jaGlsZHJlbigpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBBdm9pZCBzY3JvbGxpbmcgdG8gdG9wIChpZiBtdWx0aXBsZSBpbnN0YW5jZXMpXHJcbiAgICAgICAgICAgICRzbGlkZS5jc3MoXCJvdmVyZmxvd1wiLCBcInZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICAkY29udGVudC5jc3Moe1xyXG4gICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICBcIm1heC13aWR0aFwiOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICBoZWlnaHQ6IFwiOTk5OXB4XCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZnJhbWVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgZnJhbWVXaWR0aCA9IE1hdGguY2VpbChNYXRoLm1heCgkYm9keVswXS5jbGllbnRXaWR0aCwgJGJvZHkub3V0ZXJXaWR0aCh0cnVlKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkY29udGVudC5jc3MoXCJ3aWR0aFwiLCBmcmFtZVdpZHRoID8gZnJhbWVXaWR0aCA6IFwiXCIpLmNzcyhcIm1heC13aWR0aFwiLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmcmFtZUhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgZnJhbWVIZWlnaHQgPSBNYXRoLmNlaWwoTWF0aC5tYXgoJGJvZHlbMF0uY2xpZW50SGVpZ2h0LCAkYm9keS5vdXRlckhlaWdodCh0cnVlKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkY29udGVudC5jc3MoXCJoZWlnaHRcIiwgZnJhbWVIZWlnaHQgPyBmcmFtZUhlaWdodCA6IFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgJHNsaWRlLmNzcyhcIm92ZXJmbG93XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkY29udGVudC5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LWlzLWhpZGRlblwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmLmFmdGVyTG9hZChzbGlkZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRpZnJhbWUuYXR0cihcInNyY1wiLCBzbGlkZS5zcmMpO1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIGlmcmFtZSBpZiBjbG9zaW5nIG9yIGNoYW5naW5nIGdhbGxlcnkgaXRlbVxyXG4gICAgICAkc2xpZGUub25lKFwib25SZXNldFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBUaGlzIGhlbHBzIElFIG5vdCB0byB0aHJvdyBlcnJvcnMgd2hlbiBjbG9zaW5nXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICQodGhpcylcclxuICAgICAgICAgICAgLmZpbmQoXCJpZnJhbWVcIilcclxuICAgICAgICAgICAgLmhpZGUoKVxyXG4gICAgICAgICAgICAudW5iaW5kKClcclxuICAgICAgICAgICAgLmF0dHIoXCJzcmNcIiwgXCIvL2Fib3V0OmJsYW5rXCIpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgJCh0aGlzKVxyXG4gICAgICAgICAgLm9mZihcInJlZnJlc2guZmJcIilcclxuICAgICAgICAgIC5lbXB0eSgpO1xyXG5cclxuICAgICAgICBzbGlkZS5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHNsaWRlLmlzUmV2ZWFsZWQgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFdyYXAgYW5kIGFwcGVuZCBjb250ZW50IHRvIHRoZSBzbGlkZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBzZXRDb250ZW50OiBmdW5jdGlvbihzbGlkZSwgY29udGVudCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc0Nsb3NpbmcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuaGlkZUxvYWRpbmcoc2xpZGUpO1xyXG5cclxuICAgICAgaWYgKHNsaWRlLiRjb250ZW50KSB7XHJcbiAgICAgICAgJC5mYW5jeWJveC5zdG9wKHNsaWRlLiRjb250ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2xpZGUuJHNsaWRlLmVtcHR5KCk7XHJcblxyXG4gICAgICAvLyBJZiBjb250ZW50IGlzIGEgalF1ZXJ5IG9iamVjdCwgdGhlbiBpdCB3aWxsIGJlIG1vdmVkIHRvIHRoZSBzbGlkZS5cclxuICAgICAgLy8gVGhlIHBsYWNlaG9sZGVyIGlzIGNyZWF0ZWQgc28gd2Ugd2lsbCBrbm93IHdoZXJlIHRvIHB1dCBpdCBiYWNrLlxyXG4gICAgICBpZiAoaXNRdWVyeShjb250ZW50KSAmJiBjb250ZW50LnBhcmVudCgpLmxlbmd0aCkge1xyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjb250ZW50IGlzIG5vdCBhbHJlYWR5IG1vdmVkIHRvIGZhbmN5Qm94XHJcbiAgICAgICAgaWYgKGNvbnRlbnQuaGFzQ2xhc3MoXCJmYW5jeWJveC1jb250ZW50XCIpIHx8IGNvbnRlbnQucGFyZW50KCkuaGFzQ2xhc3MoXCJmYW5jeWJveC1jb250ZW50XCIpKSB7XHJcbiAgICAgICAgICBjb250ZW50LnBhcmVudHMoXCIuZmFuY3lib3gtc2xpZGVcIikudHJpZ2dlcihcIm9uUmVzZXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGVtcG9yYXJ5IGVsZW1lbnQgbWFya2luZyBvcmlnaW5hbCBwbGFjZSBvZiB0aGUgY29udGVudFxyXG4gICAgICAgIHNsaWRlLiRwbGFjZWhvbGRlciA9ICQoXCI8ZGl2PlwiKVxyXG4gICAgICAgICAgLmhpZGUoKVxyXG4gICAgICAgICAgLmluc2VydEFmdGVyKGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgY29udGVudCBpcyB2aXNpYmxlXHJcbiAgICAgICAgY29udGVudC5jc3MoXCJkaXNwbGF5XCIsIFwiaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzbGlkZS5oYXNFcnJvcikge1xyXG4gICAgICAgIC8vIElmIGNvbnRlbnQgaXMganVzdCBhIHBsYWluIHRleHQsIHRyeSB0byBjb252ZXJ0IGl0IHRvIGh0bWxcclxuICAgICAgICBpZiAoJC50eXBlKGNvbnRlbnQpID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICBjb250ZW50ID0gJChcIjxkaXY+XCIpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJC50cmltKGNvbnRlbnQpKVxyXG4gICAgICAgICAgICAuY29udGVudHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIFwiZmlsdGVyXCIgb3B0aW9uIGlzIHByb3ZpZGVkLCB0aGVuIGZpbHRlciBjb250ZW50XHJcbiAgICAgICAgaWYgKHNsaWRlLm9wdHMuZmlsdGVyKSB7XHJcbiAgICAgICAgICBjb250ZW50ID0gJChcIjxkaXY+XCIpXHJcbiAgICAgICAgICAgIC5odG1sKGNvbnRlbnQpXHJcbiAgICAgICAgICAgIC5maW5kKHNsaWRlLm9wdHMuZmlsdGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNsaWRlLiRzbGlkZS5vbmUoXCJvblJlc2V0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIFBhdXNlIGFsbCBodG1sNSB2aWRlby9hdWRpb1xyXG4gICAgICAgICQodGhpcylcclxuICAgICAgICAgIC5maW5kKFwidmlkZW8sYXVkaW9cIilcclxuICAgICAgICAgIC50cmlnZ2VyKFwicGF1c2VcIik7XHJcblxyXG4gICAgICAgIC8vIFB1dCBjb250ZW50IGJhY2tcclxuICAgICAgICBpZiAoc2xpZGUuJHBsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgICBzbGlkZS4kcGxhY2Vob2xkZXIuYWZ0ZXIoY29udGVudC5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LWNvbnRlbnRcIikuaGlkZSgpKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICBzbGlkZS4kcGxhY2Vob2xkZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGN1c3RvbSBjbG9zZSBidXR0b25cclxuICAgICAgICBpZiAoc2xpZGUuJHNtYWxsQnRuKSB7XHJcbiAgICAgICAgICBzbGlkZS4kc21hbGxCdG4ucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgc2xpZGUuJHNtYWxsQnRuID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBjb250ZW50IGFuZCBtYXJrIHNsaWRlIGFzIG5vdCBsb2FkZWRcclxuICAgICAgICBpZiAoIXNsaWRlLmhhc0Vycm9yKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgICAgc2xpZGUuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgIHNsaWRlLmlzUmV2ZWFsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJChjb250ZW50KS5hcHBlbmRUbyhzbGlkZS4kc2xpZGUpO1xyXG5cclxuICAgICAgaWYgKCQoY29udGVudCkuaXMoXCJ2aWRlbyxhdWRpb1wiKSkge1xyXG4gICAgICAgICQoY29udGVudCkuYWRkQ2xhc3MoXCJmYW5jeWJveC12aWRlb1wiKTtcclxuXHJcbiAgICAgICAgJChjb250ZW50KS53cmFwKFwiPGRpdj48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIHNsaWRlLmNvbnRlbnRUeXBlID0gXCJ2aWRlb1wiO1xyXG5cclxuICAgICAgICBzbGlkZS5vcHRzLndpZHRoID0gc2xpZGUub3B0cy53aWR0aCB8fCAkKGNvbnRlbnQpLmF0dHIoXCJ3aWR0aFwiKTtcclxuICAgICAgICBzbGlkZS5vcHRzLmhlaWdodCA9IHNsaWRlLm9wdHMuaGVpZ2h0IHx8ICQoY29udGVudCkuYXR0cihcImhlaWdodFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2xpZGUuJGNvbnRlbnQgPSBzbGlkZS4kc2xpZGVcclxuICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgIC5maWx0ZXIoXCJkaXYsZm9ybSxtYWluLHZpZGVvLGF1ZGlvLGFydGljbGUsLmZhbmN5Ym94LWNvbnRlbnRcIilcclxuICAgICAgICAuZmlyc3QoKTtcclxuXHJcbiAgICAgIHNsaWRlLiRjb250ZW50LnNpYmxpbmdzKCkuaGlkZSgpO1xyXG5cclxuICAgICAgLy8gUmUtY2hlY2sgaWYgdGhlcmUgaXMgYSB2YWxpZCBjb250ZW50XHJcbiAgICAgIC8vIChpbiBzb21lIGNhc2VzLCBhamF4IHJlc3BvbnNlIGNhbiBjb250YWluIHZhcmlvdXMgZWxlbWVudHMgb3IgcGxhaW4gdGV4dClcclxuICAgICAgaWYgKCFzbGlkZS4kY29udGVudC5sZW5ndGgpIHtcclxuICAgICAgICBzbGlkZS4kY29udGVudCA9IHNsaWRlLiRzbGlkZVxyXG4gICAgICAgICAgLndyYXBJbm5lcihcIjxkaXY+PC9kaXY+XCIpXHJcbiAgICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgICAgLmZpcnN0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNsaWRlLiRjb250ZW50LmFkZENsYXNzKFwiZmFuY3lib3gtY29udGVudFwiKTtcclxuXHJcbiAgICAgIHNsaWRlLiRzbGlkZS5hZGRDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1cIiArIHNsaWRlLmNvbnRlbnRUeXBlKTtcclxuXHJcbiAgICAgIHNlbGYuYWZ0ZXJMb2FkKHNsaWRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRGlzcGxheSBlcnJvciBtZXNzYWdlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBzZXRFcnJvcjogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgc2xpZGUuaGFzRXJyb3IgPSB0cnVlO1xyXG5cclxuICAgICAgc2xpZGUuJHNsaWRlXHJcbiAgICAgICAgLnRyaWdnZXIoXCJvblJlc2V0XCIpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLVwiICsgc2xpZGUuY29udGVudFR5cGUpXHJcbiAgICAgICAgLmFkZENsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWVycm9yXCIpO1xyXG5cclxuICAgICAgc2xpZGUuY29udGVudFR5cGUgPSBcImh0bWxcIjtcclxuXHJcbiAgICAgIHRoaXMuc2V0Q29udGVudChzbGlkZSwgdGhpcy50cmFuc2xhdGUoc2xpZGUsIHNsaWRlLm9wdHMuZXJyb3JUcGwpKTtcclxuXHJcbiAgICAgIGlmIChzbGlkZS5wb3MgPT09IHRoaXMuY3VyclBvcykge1xyXG4gICAgICAgIHRoaXMuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTaG93IGxvYWRpbmcgaWNvbiBpbnNpZGUgdGhlIHNsaWRlXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2hvd0xvYWRpbmc6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHNsaWRlID0gc2xpZGUgfHwgc2VsZi5jdXJyZW50O1xyXG5cclxuICAgICAgaWYgKHNsaWRlICYmICFzbGlkZS4kc3Bpbm5lcikge1xyXG4gICAgICAgIHNsaWRlLiRzcGlubmVyID0gJChzZWxmLnRyYW5zbGF0ZShzZWxmLCBzZWxmLm9wdHMuc3Bpbm5lclRwbCkpXHJcbiAgICAgICAgICAuYXBwZW5kVG8oc2xpZGUuJHNsaWRlKVxyXG4gICAgICAgICAgLmhpZGUoKVxyXG4gICAgICAgICAgLmZhZGVJbihcImZhc3RcIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gUmVtb3ZlIGxvYWRpbmcgaWNvbiBmcm9tIHRoZSBzbGlkZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGhpZGVMb2FkaW5nOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICBzbGlkZSA9IHNsaWRlIHx8IHNlbGYuY3VycmVudDtcclxuXHJcbiAgICAgIGlmIChzbGlkZSAmJiBzbGlkZS4kc3Bpbm5lcikge1xyXG4gICAgICAgIHNsaWRlLiRzcGlubmVyLnN0b3AoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgZGVsZXRlIHNsaWRlLiRzcGlubmVyO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkanVzdG1lbnRzIGFmdGVyIHNsaWRlIGNvbnRlbnQgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGFmdGVyTG9hZDogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzbGlkZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgc2xpZGUuaXNMb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKFwiYWZ0ZXJMb2FkXCIsIHNsaWRlKTtcclxuXHJcbiAgICAgIHNlbGYuaGlkZUxvYWRpbmcoc2xpZGUpO1xyXG5cclxuICAgICAgLy8gQWRkIHNtYWxsIGNsb3NlIGJ1dHRvblxyXG4gICAgICBpZiAoc2xpZGUub3B0cy5zbWFsbEJ0biAmJiAoIXNsaWRlLiRzbWFsbEJ0biB8fCAhc2xpZGUuJHNtYWxsQnRuLmxlbmd0aCkpIHtcclxuICAgICAgICBzbGlkZS4kc21hbGxCdG4gPSAkKHNlbGYudHJhbnNsYXRlKHNsaWRlLCBzbGlkZS5vcHRzLmJ0blRwbC5zbWFsbEJ0bikpLmFwcGVuZFRvKHNsaWRlLiRjb250ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGlzYWJsZSByaWdodCBjbGlja1xyXG4gICAgICBpZiAoc2xpZGUub3B0cy5wcm90ZWN0ICYmIHNsaWRlLiRjb250ZW50ICYmICFzbGlkZS5oYXNFcnJvcikge1xyXG4gICAgICAgIHNsaWRlLiRjb250ZW50Lm9uKFwiY29udGV4dG1lbnUuZmJcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgaWYgKGUuYnV0dG9uID09IDIpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgZmFrZSBlbGVtZW50IG9uIHRvcCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICAvLyBUaGlzIG1ha2VzIGEgYml0IGhhcmRlciBmb3IgdXNlciB0byBzZWxlY3QgaW1hZ2VcclxuICAgICAgICBpZiAoc2xpZGUudHlwZSA9PT0gXCJpbWFnZVwiKSB7XHJcbiAgICAgICAgICAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtc3BhY2ViYWxsXCI+PC9kaXY+JykuYXBwZW5kVG8oc2xpZGUuJGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5hZGp1c3RDYXB0aW9uKHNsaWRlKTtcclxuXHJcbiAgICAgIHNlbGYuYWRqdXN0TGF5b3V0KHNsaWRlKTtcclxuXHJcbiAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcykge1xyXG4gICAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYucmV2ZWFsQ29udGVudChzbGlkZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFByZXZlbnQgY2FwdGlvbiBvdmVybGFwLFxyXG4gICAgLy8gZml4IGNzcyBpbmNvbnNpc3RlbmN5IGFjcm9zcyBicm93c2Vyc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGFkanVzdENhcHRpb246IGZ1bmN0aW9uKHNsaWRlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2xpZGUgfHwgc2VsZi5jdXJyZW50LFxyXG4gICAgICAgIGNhcHRpb24gPSBjdXJyZW50Lm9wdHMuY2FwdGlvbixcclxuICAgICAgICBwcmV2ZW50T3ZlcmxhcCA9IGN1cnJlbnQub3B0cy5wcmV2ZW50Q2FwdGlvbk92ZXJsYXAsXHJcbiAgICAgICAgJGNhcHRpb24gPSBzZWxmLiRyZWZzLmNhcHRpb24sXHJcbiAgICAgICAgJGNsb25lLFxyXG4gICAgICAgIGNhcHRpb25IID0gZmFsc2U7XHJcblxyXG4gICAgICAkY2FwdGlvbi50b2dnbGVDbGFzcyhcImZhbmN5Ym94LWNhcHRpb24tLXNlcGFyYXRlXCIsIHByZXZlbnRPdmVybGFwKTtcclxuXHJcbiAgICAgIGlmIChwcmV2ZW50T3ZlcmxhcCAmJiBjYXB0aW9uICYmIGNhcHRpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnQucG9zICE9PSBzZWxmLmN1cnJQb3MpIHtcclxuICAgICAgICAgICRjbG9uZSA9ICRjYXB0aW9uLmNsb25lKCkuYXBwZW5kVG8oJGNhcHRpb24ucGFyZW50KCkpO1xyXG5cclxuICAgICAgICAgICRjbG9uZVxyXG4gICAgICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgICAgICAuZXEoMClcclxuICAgICAgICAgICAgLmVtcHR5KClcclxuICAgICAgICAgICAgLmh0bWwoY2FwdGlvbik7XHJcblxyXG4gICAgICAgICAgY2FwdGlvbkggPSAkY2xvbmUub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgJGNsb25lLmVtcHR5KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZWxmLiRjYXB0aW9uKSB7XHJcbiAgICAgICAgICBjYXB0aW9uSCA9IHNlbGYuJGNhcHRpb24ub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50LiRzbGlkZS5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiLCBjYXB0aW9uSCB8fCBcIlwiKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTaW1wbGUgaGFjayB0byBmaXggaW5jb25zaXN0ZW5jeSBhY3Jvc3MgYnJvd3NlcnMsIGRlc2NyaWJlZCBoZXJlIChhZmZlY3RzIEVkZ2UsIHRvbyk6XHJcbiAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD03NDg1MThcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGFkanVzdExheW91dDogZnVuY3Rpb24oc2xpZGUpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzbGlkZSB8fCBzZWxmLmN1cnJlbnQsXHJcbiAgICAgICAgc2Nyb2xsSGVpZ2h0LFxyXG4gICAgICAgIG1hcmdpbkJvdHRvbSxcclxuICAgICAgICBpbmxpbmVQYWRkaW5nLFxyXG4gICAgICAgIGFjdHVhbFBhZGRpbmc7XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5pc0xvYWRlZCAmJiBjdXJyZW50Lm9wdHMuZGlzYWJsZUxheW91dEZpeCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgIGN1cnJlbnQuJGNvbnRlbnQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBcIlwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgd2Ugd291bGQgYWx3YXlzIHNldCBtYXJnaW4tYm90dG9tIGZvciB0aGUgY29udGVudCxcclxuICAgICAgICAvLyB0aGVuIGl0IHdvdWxkIHBvdGVudGlhbGx5IGJyZWFrIHZlcnRpY2FsIGFsaWduXHJcbiAgICAgICAgaWYgKGN1cnJlbnQuJGNvbnRlbnQub3V0ZXJIZWlnaHQoKSA+IGN1cnJlbnQuJHNsaWRlLmhlaWdodCgpICsgMC41KSB7XHJcbiAgICAgICAgICBpbmxpbmVQYWRkaW5nID0gY3VycmVudC4kc2xpZGVbMF0uc3R5bGVbXCJwYWRkaW5nLWJvdHRvbVwiXTtcclxuICAgICAgICAgIGFjdHVhbFBhZGRpbmcgPSBjdXJyZW50LiRzbGlkZS5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiKTtcclxuXHJcbiAgICAgICAgICBpZiAocGFyc2VGbG9hdChhY3R1YWxQYWRkaW5nKSA+IDApIHtcclxuICAgICAgICAgICAgc2Nyb2xsSGVpZ2h0ID0gY3VycmVudC4kc2xpZGVbMF0uc2Nyb2xsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuY3NzKFwicGFkZGluZy1ib3R0b21cIiwgMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2Nyb2xsSGVpZ2h0IC0gY3VycmVudC4kc2xpZGVbMF0uc2Nyb2xsSGVpZ2h0KSA8IDEpIHtcclxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSBhY3R1YWxQYWRkaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50LiRzbGlkZS5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiLCBpbmxpbmVQYWRkaW5nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnQuJGNvbnRlbnQuY3NzKFwibWFyZ2luLWJvdHRvbVwiLCBtYXJnaW5Cb3R0b20pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIE1ha2UgY29udGVudCB2aXNpYmxlXHJcbiAgICAvLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgcmlnaHQgYWZ0ZXIgY29udGVudCBoYXMgYmVlbiBsb2FkZWQgb3JcclxuICAgIC8vIHVzZXIgbmF2aWdhdGVzIGdhbGxlcnkgYW5kIHRyYW5zaXRpb24gc2hvdWxkIHN0YXJ0XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICByZXZlYWxDb250ZW50OiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgJHNsaWRlID0gc2xpZGUuJHNsaWRlLFxyXG4gICAgICAgIGVuZCA9IGZhbHNlLFxyXG4gICAgICAgIHN0YXJ0ID0gZmFsc2UsXHJcbiAgICAgICAgaXNNb3ZlZCA9IHNlbGYuaXNNb3ZlZChzbGlkZSksXHJcbiAgICAgICAgaXNSZXZlYWxlZCA9IHNsaWRlLmlzUmV2ZWFsZWQsXHJcbiAgICAgICAgZWZmZWN0LFxyXG4gICAgICAgIGVmZmVjdENsYXNzTmFtZSxcclxuICAgICAgICBkdXJhdGlvbixcclxuICAgICAgICBvcGFjaXR5O1xyXG5cclxuICAgICAgc2xpZGUuaXNSZXZlYWxlZCA9IHRydWU7XHJcblxyXG4gICAgICBlZmZlY3QgPSBzbGlkZS5vcHRzW3NlbGYuZmlyc3RSdW4gPyBcImFuaW1hdGlvbkVmZmVjdFwiIDogXCJ0cmFuc2l0aW9uRWZmZWN0XCJdO1xyXG4gICAgICBkdXJhdGlvbiA9IHNsaWRlLm9wdHNbc2VsZi5maXJzdFJ1biA/IFwiYW5pbWF0aW9uRHVyYXRpb25cIiA6IFwidHJhbnNpdGlvbkR1cmF0aW9uXCJdO1xyXG5cclxuICAgICAgZHVyYXRpb24gPSBwYXJzZUludChzbGlkZS5mb3JjZWREdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gZHVyYXRpb24gOiBzbGlkZS5mb3JjZWREdXJhdGlvbiwgMTApO1xyXG5cclxuICAgICAgaWYgKGlzTW92ZWQgfHwgc2xpZGUucG9zICE9PSBzZWxmLmN1cnJQb3MgfHwgIWR1cmF0aW9uKSB7XHJcbiAgICAgICAgZWZmZWN0ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIGNhbiB6b29tXHJcbiAgICAgIGlmIChlZmZlY3QgPT09IFwiem9vbVwiKSB7XHJcbiAgICAgICAgaWYgKHNsaWRlLnBvcyA9PT0gc2VsZi5jdXJyUG9zICYmIGR1cmF0aW9uICYmIHNsaWRlLnR5cGUgPT09IFwiaW1hZ2VcIiAmJiAhc2xpZGUuaGFzRXJyb3IgJiYgKHN0YXJ0ID0gc2VsZi5nZXRUaHVtYlBvcyhzbGlkZSkpKSB7XHJcbiAgICAgICAgICBlbmQgPSBzZWxmLmdldEZpdFBvcyhzbGlkZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVmZmVjdCA9IFwiZmFkZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gWm9vbSBhbmltYXRpb25cclxuICAgICAgLy8gPT09PT09PT09PT09PT1cclxuICAgICAgaWYgKGVmZmVjdCA9PT0gXCJ6b29tXCIpIHtcclxuICAgICAgICBzZWxmLmlzQW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZW5kLnNjYWxlWCA9IGVuZC53aWR0aCAvIHN0YXJ0LndpZHRoO1xyXG4gICAgICAgIGVuZC5zY2FsZVkgPSBlbmQuaGVpZ2h0IC8gc3RhcnQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgb3BhY2l0eVxyXG4gICAgICAgIG9wYWNpdHkgPSBzbGlkZS5vcHRzLnpvb21PcGFjaXR5O1xyXG5cclxuICAgICAgICBpZiAob3BhY2l0eSA9PSBcImF1dG9cIikge1xyXG4gICAgICAgICAgb3BhY2l0eSA9IE1hdGguYWJzKHNsaWRlLndpZHRoIC8gc2xpZGUuaGVpZ2h0IC0gc3RhcnQud2lkdGggLyBzdGFydC5oZWlnaHQpID4gMC4xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wYWNpdHkpIHtcclxuICAgICAgICAgIHN0YXJ0Lm9wYWNpdHkgPSAwLjE7XHJcbiAgICAgICAgICBlbmQub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEcmF3IGltYWdlIGF0IHN0YXJ0IHBvc2l0aW9uXHJcbiAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoc2xpZGUuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1oaWRkZW5cIiksIHN0YXJ0KTtcclxuXHJcbiAgICAgICAgZm9yY2VSZWRyYXcoc2xpZGUuJGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAvLyBTdGFydCBhbmltYXRpb25cclxuICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoc2xpZGUuJGNvbnRlbnQsIGVuZCwgZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgIHNlbGYuY29tcGxldGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnVwZGF0ZVNsaWRlKHNsaWRlKTtcclxuXHJcbiAgICAgIC8vIFNpbXBseSBzaG93IGNvbnRlbnQgaWYgbm8gZWZmZWN0XHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgIGlmICghZWZmZWN0KSB7XHJcbiAgICAgICAgc2xpZGUuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1oaWRkZW5cIik7XHJcblxyXG4gICAgICAgIGlmICghaXNSZXZlYWxlZCAmJiBpc01vdmVkICYmIHNsaWRlLnR5cGUgPT09IFwiaW1hZ2VcIiAmJiAhc2xpZGUuaGFzRXJyb3IpIHtcclxuICAgICAgICAgIHNsaWRlLiRjb250ZW50LmhpZGUoKS5mYWRlSW4oXCJmYXN0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNsaWRlLnBvcyA9PT0gc2VsZi5jdXJyUG9zKSB7XHJcbiAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXBhcmUgZm9yIENTUyB0cmFuc2l0b25cclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAkLmZhbmN5Ym94LnN0b3AoJHNsaWRlKTtcclxuXHJcbiAgICAgIC8vZWZmZWN0Q2xhc3NOYW1lID0gXCJmYW5jeWJveC1hbmltYXRlZCBmYW5jeWJveC1zbGlkZS0tXCIgKyAoc2xpZGUucG9zID49IHNlbGYucHJldlBvcyA/IFwibmV4dFwiIDogXCJwcmV2aW91c1wiKSArIFwiIGZhbmN5Ym94LWZ4LVwiICsgZWZmZWN0O1xyXG4gICAgICBlZmZlY3RDbGFzc05hbWUgPSBcImZhbmN5Ym94LXNsaWRlLS1cIiArIChzbGlkZS5wb3MgPj0gc2VsZi5wcmV2UG9zID8gXCJuZXh0XCIgOiBcInByZXZpb3VzXCIpICsgXCIgZmFuY3lib3gtYW5pbWF0ZWQgZmFuY3lib3gtZngtXCIgKyBlZmZlY3Q7XHJcblxyXG4gICAgICAkc2xpZGUuYWRkQ2xhc3MoZWZmZWN0Q2xhc3NOYW1lKS5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LXNsaWRlLS1jdXJyZW50XCIpOyAvLy5hZGRDbGFzcyhlZmZlY3RDbGFzc05hbWUpO1xyXG5cclxuICAgICAgc2xpZGUuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1oaWRkZW5cIik7XHJcblxyXG4gICAgICAvLyBGb3JjZSByZWZsb3dcclxuICAgICAgZm9yY2VSZWRyYXcoJHNsaWRlKTtcclxuXHJcbiAgICAgIGlmIChzbGlkZS50eXBlICE9PSBcImltYWdlXCIpIHtcclxuICAgICAgICBzbGlkZS4kY29udGVudC5oaWRlKCkuc2hvdygwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgICRzbGlkZSxcclxuICAgICAgICBcImZhbmN5Ym94LXNsaWRlLS1jdXJyZW50XCIsXHJcbiAgICAgICAgZHVyYXRpb24sXHJcbiAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkc2xpZGUucmVtb3ZlQ2xhc3MoZWZmZWN0Q2xhc3NOYW1lKS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwiXCIsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IFwiXCJcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmIChzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcykge1xyXG4gICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cnVlXHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENoZWNrIGlmIHdlIGNhbiBhbmQgaGF2ZSB0byB6b29tIGZyb20gdGh1bWJuYWlsXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGdldFRodW1iUG9zOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXIgcmV6ID0gZmFsc2UsXHJcbiAgICAgICAgJHRodW1iID0gc2xpZGUuJHRodW1iLFxyXG4gICAgICAgIHRodW1iUG9zLFxyXG4gICAgICAgIGJ0dyxcclxuICAgICAgICBicncsXHJcbiAgICAgICAgYmJ3LFxyXG4gICAgICAgIGJsdztcclxuXHJcbiAgICAgIGlmICghJHRodW1iIHx8ICFpblZpZXdwb3J0KCR0aHVtYlswXSkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRodW1iUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoJHRodW1iKTtcclxuXHJcbiAgICAgIGJ0dyA9IHBhcnNlRmxvYXQoJHRodW1iLmNzcyhcImJvcmRlci10b3Atd2lkdGhcIikgfHwgMCk7XHJcbiAgICAgIGJydyA9IHBhcnNlRmxvYXQoJHRodW1iLmNzcyhcImJvcmRlci1yaWdodC13aWR0aFwiKSB8fCAwKTtcclxuICAgICAgYmJ3ID0gcGFyc2VGbG9hdCgkdGh1bWIuY3NzKFwiYm9yZGVyLWJvdHRvbS13aWR0aFwiKSB8fCAwKTtcclxuICAgICAgYmx3ID0gcGFyc2VGbG9hdCgkdGh1bWIuY3NzKFwiYm9yZGVyLWxlZnQtd2lkdGhcIikgfHwgMCk7XHJcblxyXG4gICAgICByZXogPSB7XHJcbiAgICAgICAgdG9wOiB0aHVtYlBvcy50b3AgKyBidHcsXHJcbiAgICAgICAgbGVmdDogdGh1bWJQb3MubGVmdCArIGJsdyxcclxuICAgICAgICB3aWR0aDogdGh1bWJQb3Mud2lkdGggLSBicncgLSBibHcsXHJcbiAgICAgICAgaGVpZ2h0OiB0aHVtYlBvcy5oZWlnaHQgLSBidHcgLSBiYncsXHJcbiAgICAgICAgc2NhbGVYOiAxLFxyXG4gICAgICAgIHNjYWxlWTogMVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIHRodW1iUG9zLndpZHRoID4gMCAmJiB0aHVtYlBvcy5oZWlnaHQgPiAwID8gcmV6IDogZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEZpbmFsIGFkanVzdG1lbnRzIGFmdGVyIGN1cnJlbnQgZ2FsbGVyeSBpdGVtIGlzIG1vdmVkIHRvIHBvc2l0aW9uXHJcbiAgICAvLyBhbmQgaXRgcyBjb250ZW50IGlzIGxvYWRlZFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuY3VycmVudCxcclxuICAgICAgICBzbGlkZXMgPSB7fSxcclxuICAgICAgICAkZWw7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc01vdmVkKCkgfHwgIWN1cnJlbnQuaXNMb2FkZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY3VycmVudC5pc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgY3VycmVudC5pc0NvbXBsZXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY3VycmVudC4kc2xpZGUuc2libGluZ3MoKS50cmlnZ2VyKFwib25SZXNldFwiKTtcclxuXHJcbiAgICAgICAgc2VsZi5wcmVsb2FkKFwiaW5saW5lXCIpO1xyXG5cclxuICAgICAgICAvLyBUcmlnZ2VyIGFueSBDU1MgdHJhbnNpdG9uIGluc2lkZSB0aGUgc2xpZGVcclxuICAgICAgICBmb3JjZVJlZHJhdyhjdXJyZW50LiRzbGlkZSk7XHJcblxyXG4gICAgICAgIGN1cnJlbnQuJHNsaWRlLmFkZENsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWNvbXBsZXRlXCIpO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgdW5uZWNlc3Nhcnkgc2xpZGVzXHJcbiAgICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbihrZXksIHNsaWRlKSB7XHJcbiAgICAgICAgICBpZiAoc2xpZGUucG9zID49IHNlbGYuY3VyclBvcyAtIDEgJiYgc2xpZGUucG9zIDw9IHNlbGYuY3VyclBvcyArIDEpIHtcclxuICAgICAgICAgICAgc2xpZGVzW3NsaWRlLnBvc10gPSBzbGlkZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc2xpZGUpIHtcclxuICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKHNsaWRlLiRzbGlkZSk7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUub2ZmKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNlbGYuc2xpZGVzID0gc2xpZGVzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICBzZWxmLnVwZGF0ZUN1cnNvcigpO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKFwiYWZ0ZXJTaG93XCIpO1xyXG5cclxuICAgICAgLy8gQXV0b3BsYXkgZmlyc3QgaHRtbDUgdmlkZW8vYXVkaW9cclxuICAgICAgaWYgKCEhY3VycmVudC5vcHRzLnZpZGVvLmF1dG9TdGFydCkge1xyXG4gICAgICAgIGN1cnJlbnQuJHNsaWRlXHJcbiAgICAgICAgICAuZmluZChcInZpZGVvLGF1ZGlvXCIpXHJcbiAgICAgICAgICAuZmlsdGVyKFwiOnZpc2libGU6Zmlyc3RcIilcclxuICAgICAgICAgIC50cmlnZ2VyKFwicGxheVwiKVxyXG4gICAgICAgICAgLm9uZShcImVuZGVkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICAgIHRoaXMud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5uZXh0KCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVHJ5IHRvIGZvY3VzIG9uIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudFxyXG4gICAgICBpZiAoY3VycmVudC5vcHRzLmF1dG9Gb2N1cyAmJiBjdXJyZW50LmNvbnRlbnRUeXBlID09PSBcImh0bWxcIikge1xyXG4gICAgICAgIC8vIExvb2sgZm9yIHRoZSBmaXJzdCBpbnB1dCB3aXRoIGF1dG9mb2N1cyBhdHRyaWJ1dGVcclxuICAgICAgICAkZWwgPSBjdXJyZW50LiRjb250ZW50LmZpbmQoXCJpbnB1dFthdXRvZm9jdXNdOmVuYWJsZWQ6dmlzaWJsZTpmaXJzdFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCRlbC5sZW5ndGgpIHtcclxuICAgICAgICAgICRlbC50cmlnZ2VyKFwiZm9jdXNcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlbGYuZm9jdXMobnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBdm9pZCBqdW1waW5nXHJcbiAgICAgIGN1cnJlbnQuJHNsaWRlLnNjcm9sbFRvcCgwKS5zY3JvbGxMZWZ0KDApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBQcmVsb2FkIG5leHQgYW5kIHByZXZpb3VzIHNsaWRlc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBwcmVsb2FkOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBwcmV2LFxyXG4gICAgICAgIG5leHQ7XHJcblxyXG4gICAgICBpZiAoc2VsZi5ncm91cC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0ID0gc2VsZi5zbGlkZXNbc2VsZi5jdXJyUG9zICsgMV07XHJcbiAgICAgIHByZXYgPSBzZWxmLnNsaWRlc1tzZWxmLmN1cnJQb3MgLSAxXTtcclxuXHJcbiAgICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgIHNlbGYubG9hZFNsaWRlKHByZXYpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmV4dCAmJiBuZXh0LnR5cGUgPT09IHR5cGUpIHtcclxuICAgICAgICBzZWxmLmxvYWRTbGlkZShuZXh0KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBUcnkgdG8gZmluZCBhbmQgZm9jdXMgb24gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgZm9jdXM6IGZ1bmN0aW9uKGUsIGZpcnN0UnVuKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBmb2N1c2FibGVTdHIgPSBbXHJcbiAgICAgICAgICBcImFbaHJlZl1cIixcclxuICAgICAgICAgIFwiYXJlYVtocmVmXVwiLFxyXG4gICAgICAgICAgJ2lucHV0Om5vdChbZGlzYWJsZWRdKTpub3QoW3R5cGU9XCJoaWRkZW5cIl0pOm5vdChbYXJpYS1oaWRkZW5dKScsXHJcbiAgICAgICAgICBcInNlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pXCIsXHJcbiAgICAgICAgICBcInRleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSlcIixcclxuICAgICAgICAgIFwiYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSlcIixcclxuICAgICAgICAgIFwiaWZyYW1lXCIsXHJcbiAgICAgICAgICBcIm9iamVjdFwiLFxyXG4gICAgICAgICAgXCJlbWJlZFwiLFxyXG4gICAgICAgICAgXCJ2aWRlb1wiLFxyXG4gICAgICAgICAgXCJhdWRpb1wiLFxyXG4gICAgICAgICAgXCJbY29udGVudGVkaXRhYmxlXVwiLFxyXG4gICAgICAgICAgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleF49XCItXCJdKSdcclxuICAgICAgICBdLmpvaW4oXCIsXCIpLFxyXG4gICAgICAgIGZvY3VzYWJsZUl0ZW1zLFxyXG4gICAgICAgIGZvY3VzZWRJdGVtSW5kZXg7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc0Nsb3NpbmcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlIHx8ICFzZWxmLmN1cnJlbnQgfHwgIXNlbGYuY3VycmVudC5pc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgLy8gRm9jdXMgb24gYW55IGVsZW1lbnQgaW5zaWRlIGZhbmN5Ym94XHJcbiAgICAgICAgZm9jdXNhYmxlSXRlbXMgPSBzZWxmLiRyZWZzLmNvbnRhaW5lci5maW5kKFwiKjp2aXNpYmxlXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZvY3VzIGluc2lkZSBjdXJyZW50IHNsaWRlXHJcbiAgICAgICAgZm9jdXNhYmxlSXRlbXMgPSBzZWxmLmN1cnJlbnQuJHNsaWRlLmZpbmQoXCIqOnZpc2libGVcIiArIChmaXJzdFJ1biA/IFwiOm5vdCguZmFuY3lib3gtY2xvc2Utc21hbGwpXCIgOiBcIlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvY3VzYWJsZUl0ZW1zID0gZm9jdXNhYmxlSXRlbXMuZmlsdGVyKGZvY3VzYWJsZVN0cikuZmlsdGVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkKHRoaXMpLmNzcyhcInZpc2liaWxpdHlcIikgIT09IFwiaGlkZGVuXCIgJiYgISQodGhpcykuaGFzQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoZm9jdXNhYmxlSXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgZm9jdXNlZEl0ZW1JbmRleCA9IGZvY3VzYWJsZUl0ZW1zLmluZGV4KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICBpZiAoZSAmJiBlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAvLyBCYWNrIHRhYlxyXG4gICAgICAgICAgaWYgKGZvY3VzZWRJdGVtSW5kZXggPCAwIHx8IGZvY3VzZWRJdGVtSW5kZXggPT0gMCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBmb2N1c2FibGVJdGVtcy5lcShmb2N1c2FibGVJdGVtcy5sZW5ndGggLSAxKS50cmlnZ2VyKFwiZm9jdXNcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIE91dHNpZGUgb3IgRm9yd2FyZCB0YWJcclxuICAgICAgICAgIGlmIChmb2N1c2VkSXRlbUluZGV4IDwgMCB8fCBmb2N1c2VkSXRlbUluZGV4ID09IGZvY3VzYWJsZUl0ZW1zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgaWYgKGUpIHtcclxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvY3VzYWJsZUl0ZW1zLmVxKDApLnRyaWdnZXIoXCJmb2N1c1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIudHJpZ2dlcihcImZvY3VzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFjdGl2YXRlcyBjdXJyZW50IGluc3RhbmNlIC0gYnJpbmdzIGNvbnRhaW5lciB0byB0aGUgZnJvbnQgYW5kIGVuYWJsZXMga2V5Ym9hcmQsXHJcbiAgICAvLyBub3RpZmllcyBvdGhlciBpbnN0YW5jZXMgYWJvdXQgZGVhY3RpdmF0aW5nXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIC8vIERlYWN0aXZhdGUgYWxsIGluc3RhbmNlc1xyXG4gICAgICAkKFwiLmZhbmN5Ym94LWNvbnRhaW5lclwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9ICQodGhpcykuZGF0YShcIkZhbmN5Qm94XCIpO1xyXG5cclxuICAgICAgICAvLyBTa2lwIHNlbGYgYW5kIGNsb3NpbmcgaW5zdGFuY2VzXHJcbiAgICAgICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLmlkICE9PSBzZWxmLmlkICYmICFpbnN0YW5jZS5pc0Nsb3NpbmcpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnRyaWdnZXIoXCJvbkRlYWN0aXZhdGVcIik7XHJcblxyXG4gICAgICAgICAgaW5zdGFuY2UucmVtb3ZlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgICAgaW5zdGFuY2UuaXNWaXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNlbGYuaXNWaXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmIChzZWxmLmN1cnJlbnQgfHwgc2VsZi5pc0lkbGUpIHtcclxuICAgICAgICBzZWxmLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcihcIm9uQWN0aXZhdGVcIik7XHJcblxyXG4gICAgICBzZWxmLmFkZEV2ZW50cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTdGFydCBjbG9zaW5nIHByb2NlZHVyZVxyXG4gICAgLy8gVGhpcyB3aWxsIHN0YXJ0IFwiem9vbS1vdXRcIiBhbmltYXRpb24gaWYgbmVlZGVkIGFuZCBjbGVhbiBldmVyeXRoaW5nIHVwIGFmdGVyd2FyZHNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGNsb3NlOiBmdW5jdGlvbihlLCBkKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgIGVmZmVjdCxcclxuICAgICAgICBkdXJhdGlvbixcclxuICAgICAgICAkY29udGVudCxcclxuICAgICAgICBkb21SZWN0LFxyXG4gICAgICAgIG9wYWNpdHksXHJcbiAgICAgICAgc3RhcnQsXHJcbiAgICAgICAgZW5kO1xyXG5cclxuICAgICAgdmFyIGRvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLmNsZWFuVXAoZSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc0Nsb3NpbmcpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuaXNDbG9zaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIElmIGJlZm9yZUNsb3NlIGNhbGxiYWNrIHByZXZlbnRzIGNsb3NpbmcsIG1ha2Ugc3VyZSBjb250ZW50IGlzIGNlbnRlcmVkXHJcbiAgICAgIGlmIChzZWxmLnRyaWdnZXIoXCJiZWZvcmVDbG9zZVwiLCBlKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICBzZWxmLmlzQ2xvc2luZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50c1xyXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgaW5zdGFuY2VzLCB0aGV5IHdpbGwgYmUgc2V0IGFnYWluIGJ5IFwiYWN0aXZhdGVcIiBtZXRob2RcclxuICAgICAgc2VsZi5yZW1vdmVFdmVudHMoKTtcclxuXHJcbiAgICAgICRjb250ZW50ID0gY3VycmVudC4kY29udGVudDtcclxuICAgICAgZWZmZWN0ID0gY3VycmVudC5vcHRzLmFuaW1hdGlvbkVmZmVjdDtcclxuICAgICAgZHVyYXRpb24gPSAkLmlzTnVtZXJpYyhkKSA/IGQgOiBlZmZlY3QgPyBjdXJyZW50Lm9wdHMuYW5pbWF0aW9uRHVyYXRpb24gOiAwO1xyXG5cclxuICAgICAgY3VycmVudC4kc2xpZGUucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0tY29tcGxldGUgZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzIGZhbmN5Ym94LWFuaW1hdGVkXCIpO1xyXG5cclxuICAgICAgaWYgKGUgIT09IHRydWUpIHtcclxuICAgICAgICAkLmZhbmN5Ym94LnN0b3AoY3VycmVudC4kc2xpZGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVmZmVjdCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgb3RoZXIgc2xpZGVzXHJcbiAgICAgIGN1cnJlbnQuJHNsaWRlXHJcbiAgICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgICAudHJpZ2dlcihcIm9uUmVzZXRcIilcclxuICAgICAgICAucmVtb3ZlKCk7XHJcblxyXG4gICAgICAvLyBUcmlnZ2VyIGFuaW1hdGlvbnNcclxuICAgICAgaWYgKGR1cmF0aW9uKSB7XHJcbiAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXJcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LWlzLW9wZW5cIilcclxuICAgICAgICAgIC5hZGRDbGFzcyhcImZhbmN5Ym94LWlzLWNsb3NpbmdcIilcclxuICAgICAgICAgIC5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsIGR1cmF0aW9uICsgXCJtc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2xlYW4gdXBcclxuICAgICAgc2VsZi5oaWRlTG9hZGluZyhjdXJyZW50KTtcclxuXHJcbiAgICAgIHNlbGYuaGlkZUNvbnRyb2xzKHRydWUpO1xyXG5cclxuICAgICAgc2VsZi51cGRhdGVDdXJzb3IoKTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIHBvc3NpYmxlIHRvIHpvb20tb3V0XHJcbiAgICAgIGlmIChcclxuICAgICAgICBlZmZlY3QgPT09IFwiem9vbVwiICYmXHJcbiAgICAgICAgISgkY29udGVudCAmJiBkdXJhdGlvbiAmJiBjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiAmJiAhc2VsZi5pc01vdmVkKCkgJiYgIWN1cnJlbnQuaGFzRXJyb3IgJiYgKGVuZCA9IHNlbGYuZ2V0VGh1bWJQb3MoY3VycmVudCkpKVxyXG4gICAgICApIHtcclxuICAgICAgICBlZmZlY3QgPSBcImZhZGVcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGVmZmVjdCA9PT0gXCJ6b29tXCIpIHtcclxuICAgICAgICAkLmZhbmN5Ym94LnN0b3AoJGNvbnRlbnQpO1xyXG5cclxuICAgICAgICBkb21SZWN0ID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoJGNvbnRlbnQpO1xyXG5cclxuICAgICAgICBzdGFydCA9IHtcclxuICAgICAgICAgIHRvcDogZG9tUmVjdC50b3AsXHJcbiAgICAgICAgICBsZWZ0OiBkb21SZWN0LmxlZnQsXHJcbiAgICAgICAgICBzY2FsZVg6IGRvbVJlY3Qud2lkdGggLyBlbmQud2lkdGgsXHJcbiAgICAgICAgICBzY2FsZVk6IGRvbVJlY3QuaGVpZ2h0IC8gZW5kLmhlaWdodCxcclxuICAgICAgICAgIHdpZHRoOiBlbmQud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IGVuZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgb3BhY2l0eVxyXG4gICAgICAgIG9wYWNpdHkgPSBjdXJyZW50Lm9wdHMuem9vbU9wYWNpdHk7XHJcblxyXG4gICAgICAgIGlmIChvcGFjaXR5ID09IFwiYXV0b1wiKSB7XHJcbiAgICAgICAgICBvcGFjaXR5ID0gTWF0aC5hYnMoY3VycmVudC53aWR0aCAvIGN1cnJlbnQuaGVpZ2h0IC0gZW5kLndpZHRoIC8gZW5kLmhlaWdodCkgPiAwLjE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3BhY2l0eSkge1xyXG4gICAgICAgICAgZW5kLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoJGNvbnRlbnQsIHN0YXJ0KTtcclxuXHJcbiAgICAgICAgZm9yY2VSZWRyYXcoJGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoJGNvbnRlbnQsIGVuZCwgZHVyYXRpb24sIGRvbmUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGVmZmVjdCAmJiBkdXJhdGlvbikge1xyXG4gICAgICAgICQuZmFuY3lib3guYW5pbWF0ZShcclxuICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLmFkZENsYXNzKFwiZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzXCIpLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtc2xpZGUtLWN1cnJlbnRcIiksXHJcbiAgICAgICAgICBcImZhbmN5Ym94LWFuaW1hdGVkIGZhbmN5Ym94LWZ4LVwiICsgZWZmZWN0LFxyXG4gICAgICAgICAgZHVyYXRpb24sXHJcbiAgICAgICAgICBkb25lXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJZiBza2lwIGFuaW1hdGlvblxyXG4gICAgICAgIGlmIChlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGRvbmUsIGR1cmF0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEZpbmFsIGFkanVzdG1lbnRzIGFmdGVyIHJlbW92aW5nIHRoZSBpbnN0YW5jZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgY2xlYW5VcDogZnVuY3Rpb24oZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgaW5zdGFuY2UsXHJcbiAgICAgICAgJGZvY3VzID0gc2VsZi5jdXJyZW50Lm9wdHMuJG9yaWcsXHJcbiAgICAgICAgeCxcclxuICAgICAgICB5O1xyXG5cclxuICAgICAgc2VsZi5jdXJyZW50LiRzbGlkZS50cmlnZ2VyKFwib25SZXNldFwiKTtcclxuXHJcbiAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLmVtcHR5KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBzZWxmLnRyaWdnZXIoXCJhZnRlckNsb3NlXCIsIGUpO1xyXG5cclxuICAgICAgLy8gUGxhY2UgYmFjayBmb2N1c1xyXG4gICAgICBpZiAoISFzZWxmLmN1cnJlbnQub3B0cy5iYWNrRm9jdXMpIHtcclxuICAgICAgICBpZiAoISRmb2N1cyB8fCAhJGZvY3VzLmxlbmd0aCB8fCAhJGZvY3VzLmlzKFwiOnZpc2libGVcIikpIHtcclxuICAgICAgICAgICRmb2N1cyA9IHNlbGYuJHRyaWdnZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGZvY3VzICYmICRmb2N1cy5sZW5ndGgpIHtcclxuICAgICAgICAgIHggPSB3aW5kb3cuc2Nyb2xsWDtcclxuICAgICAgICAgIHkgPSB3aW5kb3cuc2Nyb2xsWTtcclxuXHJcbiAgICAgICAgICAkZm9jdXMudHJpZ2dlcihcImZvY3VzXCIpO1xyXG5cclxuICAgICAgICAgICQoXCJodG1sLCBib2R5XCIpXHJcbiAgICAgICAgICAgIC5zY3JvbGxUb3AoeSlcclxuICAgICAgICAgICAgLnNjcm9sbExlZnQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmN1cnJlbnQgPSBudWxsO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIG90aGVyIGluc3RhbmNlc1xyXG4gICAgICBpbnN0YW5jZSA9ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKTtcclxuXHJcbiAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgIGluc3RhbmNlLmFjdGl2YXRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1hY3RpdmUgY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFyXCIpO1xyXG5cclxuICAgICAgICAkKFwiI2ZhbmN5Ym94LXN0eWxlLW5vc2Nyb2xsXCIpLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENhbGwgY2FsbGJhY2sgYW5kIHRyaWdnZXIgYW4gZXZlbnRcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB0cmlnZ2VyOiBmdW5jdGlvbihuYW1lLCBzbGlkZSkge1xyXG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcbiAgICAgICAgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgb2JqID0gc2xpZGUgJiYgc2xpZGUub3B0cyA/IHNsaWRlIDogc2VsZi5jdXJyZW50LFxyXG4gICAgICAgIHJlejtcclxuXHJcbiAgICAgIGlmIChvYmopIHtcclxuICAgICAgICBhcmdzLnVuc2hpZnQob2JqKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvYmogPSBzZWxmO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhcmdzLnVuc2hpZnQoc2VsZik7XHJcblxyXG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9iai5vcHRzW25hbWVdKSkge1xyXG4gICAgICAgIHJleiA9IG9iai5vcHRzW25hbWVdLmFwcGx5KG9iaiwgYXJncyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZXogPT09IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlejtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5hbWUgPT09IFwiYWZ0ZXJDbG9zZVwiIHx8ICFzZWxmLiRyZWZzKSB7XHJcbiAgICAgICAgJEQudHJpZ2dlcihuYW1lICsgXCIuZmJcIiwgYXJncyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIudHJpZ2dlcihuYW1lICsgXCIuZmJcIiwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gVXBkYXRlIGluZm9iYXIgdmFsdWVzLCBuYXZpZ2F0aW9uIGJ1dHRvbiBzdGF0ZXMgYW5kIHJldmVhbCBjYXB0aW9uXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB1cGRhdGVDb250cm9sczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgIGluZGV4ID0gY3VycmVudC5pbmRleCxcclxuICAgICAgICAkY29udGFpbmVyID0gc2VsZi4kcmVmcy5jb250YWluZXIsXHJcbiAgICAgICAgJGNhcHRpb24gPSBzZWxmLiRyZWZzLmNhcHRpb24sXHJcbiAgICAgICAgY2FwdGlvbiA9IGN1cnJlbnQub3B0cy5jYXB0aW9uO1xyXG5cclxuICAgICAgLy8gUmVjYWxjdWxhdGUgY29udGVudCBkaW1lbnNpb25zXHJcbiAgICAgIGN1cnJlbnQuJHNsaWRlLnRyaWdnZXIoXCJyZWZyZXNoXCIpO1xyXG5cclxuICAgICAgLy8gU2V0IGNhcHRpb25cclxuICAgICAgaWYgKGNhcHRpb24gJiYgY2FwdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICBzZWxmLiRjYXB0aW9uID0gJGNhcHRpb247XHJcblxyXG4gICAgICAgICRjYXB0aW9uXHJcbiAgICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgICAgLmVxKDApXHJcbiAgICAgICAgICAuaHRtbChjYXB0aW9uKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmLiRjYXB0aW9uID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFzZWxmLmhhc0hpZGRlbkNvbnRyb2xzICYmICFzZWxmLmlzSWRsZSkge1xyXG4gICAgICAgIHNlbGYuc2hvd0NvbnRyb2xzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFVwZGF0ZSBpbmZvIGFuZCBuYXZpZ2F0aW9uIGVsZW1lbnRzXHJcbiAgICAgICRjb250YWluZXIuZmluZChcIltkYXRhLWZhbmN5Ym94LWNvdW50XVwiKS5odG1sKHNlbGYuZ3JvdXAubGVuZ3RoKTtcclxuICAgICAgJGNvbnRhaW5lci5maW5kKFwiW2RhdGEtZmFuY3lib3gtaW5kZXhdXCIpLmh0bWwoaW5kZXggKyAxKTtcclxuXHJcbiAgICAgICRjb250YWluZXIuZmluZChcIltkYXRhLWZhbmN5Ym94LXByZXZdXCIpLnByb3AoXCJkaXNhYmxlZFwiLCAhY3VycmVudC5vcHRzLmxvb3AgJiYgaW5kZXggPD0gMCk7XHJcbiAgICAgICRjb250YWluZXIuZmluZChcIltkYXRhLWZhbmN5Ym94LW5leHRdXCIpLnByb3AoXCJkaXNhYmxlZFwiLCAhY3VycmVudC5vcHRzLmxvb3AgJiYgaW5kZXggPj0gc2VsZi5ncm91cC5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgIC8vIFJlLWVuYWJsZSBidXR0b25zOyB1cGRhdGUgZG93bmxvYWQgYnV0dG9uIHNvdXJjZVxyXG4gICAgICAgICRjb250YWluZXJcclxuICAgICAgICAgIC5maW5kKFwiW2RhdGEtZmFuY3lib3gtem9vbV1cIilcclxuICAgICAgICAgIC5zaG93KClcclxuICAgICAgICAgIC5lbmQoKVxyXG4gICAgICAgICAgLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1kb3dubG9hZF1cIilcclxuICAgICAgICAgIC5hdHRyKFwiaHJlZlwiLCBjdXJyZW50Lm9wdHMuaW1hZ2Uuc3JjIHx8IGN1cnJlbnQuc3JjKVxyXG4gICAgICAgICAgLnNob3coKTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50Lm9wdHMudG9vbGJhcikge1xyXG4gICAgICAgICRjb250YWluZXIuZmluZChcIltkYXRhLWZhbmN5Ym94LWRvd25sb2FkXSxbZGF0YS1mYW5jeWJveC16b29tXVwiKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSBmb2N1cyBpcyBub3Qgb24gZGlzYWJsZWQgYnV0dG9uL2VsZW1lbnRcclxuICAgICAgaWYgKCQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoXCI6aGlkZGVuLFtkaXNhYmxlZF1cIikpIHtcclxuICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci50cmlnZ2VyKFwiZm9jdXNcIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gSGlkZSB0b29sYmFyIGFuZCBjYXB0aW9uXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBoaWRlQ29udHJvbHM6IGZ1bmN0aW9uKGFuZENhcHRpb24pIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGFyciA9IFtcImluZm9iYXJcIiwgXCJ0b29sYmFyXCIsIFwibmF2XCJdO1xyXG5cclxuICAgICAgaWYgKGFuZENhcHRpb24gfHwgIXNlbGYuY3VycmVudC5vcHRzLnByZXZlbnRDYXB0aW9uT3ZlcmxhcCkge1xyXG4gICAgICAgIGFyci5wdXNoKFwiY2FwdGlvblwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kcmVmcy5jb250YWluZXIucmVtb3ZlQ2xhc3MoXHJcbiAgICAgICAgYXJyXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZmFuY3lib3gtc2hvdy1cIiArIGk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmpvaW4oXCIgXCIpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLmhhc0hpZGRlbkNvbnRyb2xzID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd0NvbnRyb2xzOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIG9wdHMgPSBzZWxmLmN1cnJlbnQgPyBzZWxmLmN1cnJlbnQub3B0cyA6IHNlbGYub3B0cyxcclxuICAgICAgICAkY29udGFpbmVyID0gc2VsZi4kcmVmcy5jb250YWluZXI7XHJcblxyXG4gICAgICBzZWxmLmhhc0hpZGRlbkNvbnRyb2xzID0gZmFsc2U7XHJcbiAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICRjb250YWluZXJcclxuICAgICAgICAudG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1zaG93LXRvb2xiYXJcIiwgISEob3B0cy50b29sYmFyICYmIG9wdHMuYnV0dG9ucykpXHJcbiAgICAgICAgLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtc2hvdy1pbmZvYmFyXCIsICEhKG9wdHMuaW5mb2JhciAmJiBzZWxmLmdyb3VwLmxlbmd0aCA+IDEpKVxyXG4gICAgICAgIC50b2dnbGVDbGFzcyhcImZhbmN5Ym94LXNob3ctY2FwdGlvblwiLCAhIXNlbGYuJGNhcHRpb24pXHJcbiAgICAgICAgLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtc2hvdy1uYXZcIiwgISEob3B0cy5hcnJvd3MgJiYgc2VsZi5ncm91cC5sZW5ndGggPiAxKSlcclxuICAgICAgICAudG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1pcy1tb2RhbFwiLCAhIW9wdHMubW9kYWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBUb2dnbGUgdG9vbGJhciBhbmQgY2FwdGlvblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB0b2dnbGVDb250cm9sczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc0hpZGRlbkNvbnRyb2xzKSB7XHJcbiAgICAgICAgdGhpcy5zaG93Q29udHJvbHMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmhpZGVDb250cm9scygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQuZmFuY3lib3ggPSB7XHJcbiAgICB2ZXJzaW9uOiBcIjMuNS42XCIsXHJcbiAgICBkZWZhdWx0czogZGVmYXVsdHMsXHJcblxyXG4gICAgLy8gR2V0IGN1cnJlbnQgaW5zdGFuY2UgYW5kIGV4ZWN1dGUgYSBjb21tYW5kLlxyXG4gICAgLy9cclxuICAgIC8vIEV4YW1wbGVzIG9mIHVzYWdlOlxyXG4gICAgLy9cclxuICAgIC8vICAgJGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG4gICAgLy8gICAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCkuanVtcFRvKCAxICk7XHJcbiAgICAvLyAgICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoICdqdW1wVG8nLCAxICk7XHJcbiAgICAvLyAgICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoIGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICAgICAgY29uc29sZS5pbmZvKCB0aGlzLmN1cnJJbmRleCApO1xyXG4gICAgLy8gICB9KTtcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbihjb21tYW5kKSB7XHJcbiAgICAgIHZhciBpbnN0YW5jZSA9ICQoJy5mYW5jeWJveC1jb250YWluZXI6bm90KFwiLmZhbmN5Ym94LWlzLWNsb3NpbmdcIik6bGFzdCcpLmRhdGEoXCJGYW5jeUJveFwiKSxcclxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuXHJcbiAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIEZhbmN5Qm94KSB7XHJcbiAgICAgICAgaWYgKCQudHlwZShjb21tYW5kKSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgaW5zdGFuY2VbY29tbWFuZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoJC50eXBlKGNvbW1hbmQpID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgIGNvbW1hbmQuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENyZWF0ZSBuZXcgaW5zdGFuY2VcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBvcGVuOiBmdW5jdGlvbihpdGVtcywgb3B0cywgaW5kZXgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBGYW5jeUJveChpdGVtcywgb3B0cywgaW5kZXgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDbG9zZSBjdXJyZW50IG9yIGFsbCBpbnN0YW5jZXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGNsb3NlOiBmdW5jdGlvbihhbGwpIHtcclxuICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgaW5zdGFuY2UuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYW5kIGNsb3NlIG5leHQgaW5zdGFuY2VcclxuICAgICAgICBpZiAoYWxsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB0aGlzLmNsb3NlKGFsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENsb3NlIGFsbCBpbnN0YW5jZXMgYW5kIHVuYmluZCBhbGwgZXZlbnRzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLmNsb3NlKHRydWUpO1xyXG5cclxuICAgICAgJEQuYWRkKFwiYm9keVwiKS5vZmYoXCJjbGljay5mYi1zdGFydFwiLCBcIioqXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBUcnkgdG8gZGV0ZWN0IG1vYmlsZSBkZXZpY2VzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaXNNb2JpbGU6IC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcclxuXHJcbiAgICAvLyBEZXRlY3QgaWYgJ3RyYW5zbGF0ZTNkJyBzdXBwb3J0IGlzIGF2YWlsYWJsZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB1c2UzZDogKGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiZcclxuICAgICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkaXYpICYmXHJcbiAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2KS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpICYmXHJcbiAgICAgICAgIShkb2N1bWVudC5kb2N1bWVudE1vZGUgJiYgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgMTEpXHJcbiAgICAgICk7XHJcbiAgICB9KSgpLFxyXG5cclxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgY3VycmVudCB2aXN1YWwgc3RhdGUgb2YgYW4gZWxlbWVudFxyXG4gICAgLy8gcmV0dXJucyBhcnJheVsgdG9wLCBsZWZ0LCBob3Jpem9udGFsLXNjYWxlLCB2ZXJ0aWNhbC1zY2FsZSwgb3BhY2l0eSBdXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBnZXRUcmFuc2xhdGU6IGZ1bmN0aW9uKCRlbCkge1xyXG4gICAgICB2YXIgZG9tUmVjdDtcclxuXHJcbiAgICAgIGlmICghJGVsIHx8ICEkZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkb21SZWN0ID0gJGVsWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0b3A6IGRvbVJlY3QudG9wIHx8IDAsXHJcbiAgICAgICAgbGVmdDogZG9tUmVjdC5sZWZ0IHx8IDAsXHJcbiAgICAgICAgd2lkdGg6IGRvbVJlY3Qud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBkb21SZWN0LmhlaWdodCxcclxuICAgICAgICBvcGFjaXR5OiBwYXJzZUZsb2F0KCRlbC5jc3MoXCJvcGFjaXR5XCIpKVxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBTaG9ydGN1dCBmb3Igc2V0dGluZyBcInRyYW5zbGF0ZTNkXCIgcHJvcGVydGllcyBmb3IgZWxlbWVudFxyXG4gICAgLy8gQ2FuIHNldCBiZSB1c2VkIHRvIHNldCBvcGFjaXR5LCB0b29cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgc2V0VHJhbnNsYXRlOiBmdW5jdGlvbigkZWwsIHByb3BzKSB7XHJcbiAgICAgIHZhciBzdHIgPSBcIlwiLFxyXG4gICAgICAgIGNzcyA9IHt9O1xyXG5cclxuICAgICAgaWYgKCEkZWwgfHwgIXByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvcHMubGVmdCAhPT0gdW5kZWZpbmVkIHx8IHByb3BzLnRvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3RyID1cclxuICAgICAgICAgIChwcm9wcy5sZWZ0ID09PSB1bmRlZmluZWQgPyAkZWwucG9zaXRpb24oKS5sZWZ0IDogcHJvcHMubGVmdCkgK1xyXG4gICAgICAgICAgXCJweCwgXCIgK1xyXG4gICAgICAgICAgKHByb3BzLnRvcCA9PT0gdW5kZWZpbmVkID8gJGVsLnBvc2l0aW9uKCkudG9wIDogcHJvcHMudG9wKSArXHJcbiAgICAgICAgICBcInB4XCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVzZTNkKSB7XHJcbiAgICAgICAgICBzdHIgPSBcInRyYW5zbGF0ZTNkKFwiICsgc3RyICsgXCIsIDBweClcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3RyID0gXCJ0cmFuc2xhdGUoXCIgKyBzdHIgKyBcIilcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9wcy5zY2FsZVggIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHN0ciArPSBcIiBzY2FsZShcIiArIHByb3BzLnNjYWxlWCArIFwiLCBcIiArIHByb3BzLnNjYWxlWSArIFwiKVwiO1xyXG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnNjYWxlWCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3RyICs9IFwiIHNjYWxlWChcIiArIHByb3BzLnNjYWxlWCArIFwiKVwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3RyLmxlbmd0aCkge1xyXG4gICAgICAgIGNzcy50cmFuc2Zvcm0gPSBzdHI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9wcy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjc3Mub3BhY2l0eSA9IHByb3BzLm9wYWNpdHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9wcy53aWR0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY3NzLndpZHRoID0gcHJvcHMud2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9wcy5oZWlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNzcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAkZWwuY3NzKGNzcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFNpbXBsZSBDU1MgdHJhbnNpdGlvbiBoYW5kbGVyXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uKCRlbCwgdG8sIGR1cmF0aW9uLCBjYWxsYmFjaywgbGVhdmVBbmltYXRpb25OYW1lKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBmcm9tO1xyXG5cclxuICAgICAgaWYgKCQuaXNGdW5jdGlvbihkdXJhdGlvbikpIHtcclxuICAgICAgICBjYWxsYmFjayA9IGR1cmF0aW9uO1xyXG4gICAgICAgIGR1cmF0aW9uID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5zdG9wKCRlbCk7XHJcblxyXG4gICAgICBmcm9tID0gc2VsZi5nZXRUcmFuc2xhdGUoJGVsKTtcclxuXHJcbiAgICAgICRlbC5vbih0cmFuc2l0aW9uRW5kLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLy8gU2tpcCBldmVudHMgZnJvbSBjaGlsZCBlbGVtZW50cyBhbmQgei1pbmRleCBjaGFuZ2VcclxuICAgICAgICBpZiAoZSAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgKCEkZWwuaXMoZS5vcmlnaW5hbEV2ZW50LnRhcmdldCkgfHwgZS5vcmlnaW5hbEV2ZW50LnByb3BlcnR5TmFtZSA9PSBcInotaW5kZXhcIikpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc3RvcCgkZWwpO1xyXG5cclxuICAgICAgICBpZiAoJC5pc051bWVyaWMoZHVyYXRpb24pKSB7XHJcbiAgICAgICAgICAkZWwuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QodG8pKSB7XHJcbiAgICAgICAgICBpZiAodG8uc2NhbGVYICE9PSB1bmRlZmluZWQgJiYgdG8uc2NhbGVZICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRUcmFuc2xhdGUoJGVsLCB7XHJcbiAgICAgICAgICAgICAgdG9wOiB0by50b3AsXHJcbiAgICAgICAgICAgICAgbGVmdDogdG8ubGVmdCxcclxuICAgICAgICAgICAgICB3aWR0aDogZnJvbS53aWR0aCAqIHRvLnNjYWxlWCxcclxuICAgICAgICAgICAgICBoZWlnaHQ6IGZyb20uaGVpZ2h0ICogdG8uc2NhbGVZLFxyXG4gICAgICAgICAgICAgIHNjYWxlWDogMSxcclxuICAgICAgICAgICAgICBzY2FsZVk6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZWF2ZUFuaW1hdGlvbk5hbWUgIT09IHRydWUpIHtcclxuICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyh0byk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICgkLmlzTnVtZXJpYyhkdXJhdGlvbikpIHtcclxuICAgICAgICAkZWwuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBkdXJhdGlvbiArIFwibXNcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBieSBjaGFuZ2luZyBDU1MgcHJvcGVydGllcyBvciBjbGFzcyBuYW1lXHJcbiAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QodG8pKSB7XHJcbiAgICAgICAgaWYgKHRvLnNjYWxlWCAhPT0gdW5kZWZpbmVkICYmIHRvLnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBkZWxldGUgdG8ud2lkdGg7XHJcbiAgICAgICAgICBkZWxldGUgdG8uaGVpZ2h0O1xyXG5cclxuICAgICAgICAgIGlmICgkZWwucGFyZW50KCkuaGFzQ2xhc3MoXCJmYW5jeWJveC1zbGlkZS0taW1hZ2VcIikpIHtcclxuICAgICAgICAgICAgJGVsLnBhcmVudCgpLmFkZENsYXNzKFwiZmFuY3lib3gtaXMtc2NhbGluZ1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCRlbCwgdG8pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICRlbC5hZGRDbGFzcyh0byk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGB0cmFuc2l0aW9uZW5kYCBjYWxsYmFjayBnZXRzIGZpcmVkXHJcbiAgICAgICRlbC5kYXRhKFxyXG4gICAgICAgIFwidGltZXJcIixcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJGVsLnRyaWdnZXIodHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgfSwgZHVyYXRpb24gKyAzMylcclxuICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RvcDogZnVuY3Rpb24oJGVsLCBjYWxsQ2FsbGJhY2spIHtcclxuICAgICAgaWYgKCRlbCAmJiAkZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KCRlbC5kYXRhKFwidGltZXJcIikpO1xyXG5cclxuICAgICAgICBpZiAoY2FsbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAkZWwudHJpZ2dlcih0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRlbC5vZmYodHJhbnNpdGlvbkVuZCkuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBcIlwiKTtcclxuXHJcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiZmFuY3lib3gtaXMtc2NhbGluZ1wiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIERlZmF1bHQgY2xpY2sgaGFuZGxlciBmb3IgXCJmYW5jeWJveGVkXCIgbGlua3NcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBmdW5jdGlvbiBfcnVuKGUsIG9wdHMpIHtcclxuICAgIHZhciBpdGVtcyA9IFtdLFxyXG4gICAgICBpbmRleCA9IDAsXHJcbiAgICAgICR0YXJnZXQsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgICBpbnN0YW5jZTtcclxuXHJcbiAgICAvLyBBdm9pZCBvcGVuaW5nIG11bHRpcGxlIHRpbWVzXHJcbiAgICBpZiAoZSAmJiBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgb3B0cyA9IG9wdHMgfHwge307XHJcblxyXG4gICAgaWYgKGUgJiYgZS5kYXRhKSB7XHJcbiAgICAgIG9wdHMgPSBtZXJnZU9wdHMoZS5kYXRhLm9wdGlvbnMsIG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgICR0YXJnZXQgPSBvcHRzLiR0YXJnZXQgfHwgJChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoXCJibHVyXCIpO1xyXG4gICAgaW5zdGFuY2UgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCk7XHJcblxyXG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLiR0cmlnZ2VyICYmIGluc3RhbmNlLiR0cmlnZ2VyLmlzKCR0YXJnZXQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0cy5zZWxlY3Rvcikge1xyXG4gICAgICBpdGVtcyA9ICQob3B0cy5zZWxlY3Rvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBHZXQgYWxsIHJlbGF0ZWQgaXRlbXMgYW5kIGZpbmQgaW5kZXggZm9yIGNsaWNrZWQgb25lXHJcbiAgICAgIHZhbHVlID0gJHRhcmdldC5hdHRyKFwiZGF0YS1mYW5jeWJveFwiKSB8fCBcIlwiO1xyXG5cclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgaXRlbXMgPSBlLmRhdGEgPyBlLmRhdGEuaXRlbXMgOiBbXTtcclxuICAgICAgICBpdGVtcyA9IGl0ZW1zLmxlbmd0aCA/IGl0ZW1zLmZpbHRlcignW2RhdGEtZmFuY3lib3g9XCInICsgdmFsdWUgKyAnXCJdJykgOiAkKCdbZGF0YS1mYW5jeWJveD1cIicgKyB2YWx1ZSArICdcIl0nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtcyA9IFskdGFyZ2V0XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluZGV4ID0gJChpdGVtcykuaW5kZXgoJHRhcmdldCk7XHJcblxyXG4gICAgLy8gU29tZXRpbWVzIGN1cnJlbnQgaXRlbSBjYW4gbm90IGJlIGZvdW5kXHJcbiAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgIGluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpbnN0YW5jZSA9ICQuZmFuY3lib3gub3BlbihpdGVtcywgb3B0cywgaW5kZXgpO1xyXG5cclxuICAgIC8vIFNhdmUgbGFzdCBhY3RpdmUgZWxlbWVudFxyXG4gICAgaW5zdGFuY2UuJHRyaWdnZXIgPSAkdGFyZ2V0O1xyXG4gIH1cclxuXHJcbiAgLy8gQ3JlYXRlIGEgalF1ZXJ5IHBsdWdpblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5mYW5jeWJveCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHZhciBzZWxlY3RvcjtcclxuXHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvciB8fCBmYWxzZTtcclxuXHJcbiAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgLy8gVXNlIGJvZHkgZWxlbWVudCBpbnN0ZWFkIG9mIGRvY3VtZW50IHNvIGl0IGV4ZWN1dGVzIGZpcnN0XHJcbiAgICAgICQoXCJib2R5XCIpXHJcbiAgICAgICAgLm9mZihcImNsaWNrLmZiLXN0YXJ0XCIsIHNlbGVjdG9yKVxyXG4gICAgICAgIC5vbihcImNsaWNrLmZiLXN0YXJ0XCIsIHNlbGVjdG9yLCB7b3B0aW9uczogb3B0aW9uc30sIF9ydW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vZmYoXCJjbGljay5mYi1zdGFydFwiKS5vbihcclxuICAgICAgICBcImNsaWNrLmZiLXN0YXJ0XCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaXRlbXM6IHRoaXMsXHJcbiAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXHJcbiAgICAgICAgfSxcclxuICAgICAgICBfcnVuXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgLy8gU2VsZiBpbml0aWFsaXppbmcgcGx1Z2luIGZvciBhbGwgZWxlbWVudHMgaGF2aW5nIGBkYXRhLWZhbmN5Ym94YCBhdHRyaWJ1dGVcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAkRC5vbihcImNsaWNrLmZiLXN0YXJ0XCIsIFwiW2RhdGEtZmFuY3lib3hdXCIsIF9ydW4pO1xyXG5cclxuICAvLyBFbmFibGUgXCJ0cmlnZ2VyIGVsZW1lbnRzXCJcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICRELm9uKFwiY2xpY2suZmItc3RhcnRcIiwgXCJbZGF0YS1mYW5jeWJveC10cmlnZ2VyXVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAkKCdbZGF0YS1mYW5jeWJveD1cIicgKyAkKHRoaXMpLmF0dHIoXCJkYXRhLWZhbmN5Ym94LXRyaWdnZXJcIikgKyAnXCJdJylcclxuICAgICAgLmVxKCQodGhpcykuYXR0cihcImRhdGEtZmFuY3lib3gtaW5kZXhcIikgfHwgMClcclxuICAgICAgLnRyaWdnZXIoXCJjbGljay5mYi1zdGFydFwiLCB7XHJcbiAgICAgICAgJHRyaWdnZXI6ICQodGhpcylcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIFRyYWNrIGZvY3VzIGV2ZW50IGZvciBiZXR0ZXIgYWNjZXNzaWJpbGl0eSBzdHlsaW5nXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYnV0dG9uU3RyID0gXCIuZmFuY3lib3gtYnV0dG9uXCIsXHJcbiAgICAgIGZvY3VzU3RyID0gXCJmYW5jeWJveC1mb2N1c1wiLFxyXG4gICAgICAkcHJlc3NlZCA9IG51bGw7XHJcblxyXG4gICAgJEQub24oXCJtb3VzZWRvd24gbW91c2V1cCBmb2N1cyBibHVyXCIsIGJ1dHRvblN0ciwgZnVuY3Rpb24oZSkge1xyXG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJtb3VzZWRvd25cIjpcclxuICAgICAgICAgICRwcmVzc2VkID0gJCh0aGlzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJtb3VzZXVwXCI6XHJcbiAgICAgICAgICAkcHJlc3NlZCA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZm9jdXNpblwiOlxyXG4gICAgICAgICAgJChidXR0b25TdHIpLnJlbW92ZUNsYXNzKGZvY3VzU3RyKTtcclxuXHJcbiAgICAgICAgICBpZiAoISQodGhpcykuaXMoJHByZXNzZWQpICYmICEkKHRoaXMpLmlzKFwiW2Rpc2FibGVkXVwiKSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKGZvY3VzU3RyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJmb2N1c291dFwiOlxyXG4gICAgICAgICAgJChidXR0b25TdHIpLnJlbW92ZUNsYXNzKGZvY3VzU3RyKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KSgpO1xyXG59KSh3aW5kb3csIGRvY3VtZW50LCBqUXVlcnkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIE1lZGlhXHJcbi8vIEFkZHMgYWRkaXRpb25hbCBtZWRpYSB0eXBlIHN1cHBvcnRcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKCQpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgcHJvcGVydGllcyBmb3IgZWFjaCBtZWRpYSB0eXBlXHJcbiAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgeW91dHViZToge1xyXG4gICAgICBtYXRjaGVyOiAvKHlvdXR1YmVcXC5jb218eW91dHVcXC5iZXx5b3V0dWJlXFwtbm9jb29raWVcXC5jb20pXFwvKHdhdGNoXFw/KC4qJik/dj18dlxcL3x1XFwvfGVtYmVkXFwvPyk/KHZpZGVvc2VyaWVzXFw/bGlzdD0oLiopfFtcXHctXXsxMX18XFw/bGlzdFR5cGU9KC4qKSZsaXN0PSguKikpKC4qKS9pLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBhdXRvcGxheTogMSxcclxuICAgICAgICBhdXRvaGlkZTogMSxcclxuICAgICAgICBmczogMSxcclxuICAgICAgICByZWw6IDAsXHJcbiAgICAgICAgaGQ6IDEsXHJcbiAgICAgICAgd21vZGU6IFwidHJhbnNwYXJlbnRcIixcclxuICAgICAgICBlbmFibGVqc2FwaTogMSxcclxuICAgICAgICBodG1sNTogMVxyXG4gICAgICB9LFxyXG4gICAgICBwYXJhbVBsYWNlOiA4LFxyXG4gICAgICB0eXBlOiBcImlmcmFtZVwiLFxyXG4gICAgICB1cmw6IFwiaHR0cHM6Ly93d3cueW91dHViZS1ub2Nvb2tpZS5jb20vZW1iZWQvJDRcIixcclxuICAgICAgdGh1bWI6IFwiaHR0cHM6Ly9pbWcueW91dHViZS5jb20vdmkvJDQvaHFkZWZhdWx0LmpwZ1wiXHJcbiAgICB9LFxyXG5cclxuICAgIHZpbWVvOiB7XHJcbiAgICAgIG1hdGNoZXI6IC9eLit2aW1lby5jb21cXC8oLipcXC8pPyhbXFxkXSspKC4qKT8vLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBhdXRvcGxheTogMSxcclxuICAgICAgICBoZDogMSxcclxuICAgICAgICBzaG93X3RpdGxlOiAxLFxyXG4gICAgICAgIHNob3dfYnlsaW5lOiAxLFxyXG4gICAgICAgIHNob3dfcG9ydHJhaXQ6IDAsXHJcbiAgICAgICAgZnVsbHNjcmVlbjogMVxyXG4gICAgICB9LFxyXG4gICAgICBwYXJhbVBsYWNlOiAzLFxyXG4gICAgICB0eXBlOiBcImlmcmFtZVwiLFxyXG4gICAgICB1cmw6IFwiLy9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLyQyXCJcclxuICAgIH0sXHJcblxyXG4gICAgaW5zdGFncmFtOiB7XHJcbiAgICAgIG1hdGNoZXI6IC8oaW5zdGFnclxcLmFtfGluc3RhZ3JhbVxcLmNvbSlcXC9wXFwvKFthLXpBLVowLTlfXFwtXSspXFwvPy9pLFxyXG4gICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgIHVybDogXCIvLyQxL3AvJDIvbWVkaWEvP3NpemU9bFwiXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEV4YW1wbGVzOlxyXG4gICAgLy8gaHR0cDovL21hcHMuZ29vZ2xlLmNvbS8/bGw9NDguODU3OTk1LDIuMjk0Mjk3JnNwbj0wLjAwNzY2NiwwLjAyMTEzNiZ0PW0mej0xNlxyXG4gICAgLy8gaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL0AzNy43ODUyMDA2LC0xMjIuNDE0NjM1NSwxNC42NXpcclxuICAgIC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9ANTIuMjExMTEyMywyLjkyMzc1NDIsNi42MXo/aGw9ZW5cclxuICAgIC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9wbGFjZS9Hb29nbGVwbGV4L0AzNy40MjIwMDQxLC0xMjIuMDgzMzQ5NCwxN3ovZGF0YT0hNG01ITNtNCExczB4MDoweDZjMjk2YzY2NjE5MzY3ZTAhOG0yITNkMzcuNDIxOTk5OCE0ZC0xMjIuMDg0MDU3MlxyXG4gICAgZ21hcF9wbGFjZToge1xyXG4gICAgICBtYXRjaGVyOiAvKG1hcHNcXC4pP2dvb2dsZVxcLihbYS16XXsyLDN9KFxcLlthLXpdezJ9KT8pXFwvKCgobWFwc1xcLyhwbGFjZVxcLyguKilcXC8pP1xcQCguKiksKFxcZCsuP1xcZCs/KXopKXwoXFw/bGw9KSkoLiopPy9pLFxyXG4gICAgICB0eXBlOiBcImlmcmFtZVwiLFxyXG4gICAgICB1cmw6IGZ1bmN0aW9uKHJleikge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICBcIi8vbWFwcy5nb29nbGUuXCIgK1xyXG4gICAgICAgICAgcmV6WzJdICtcclxuICAgICAgICAgIFwiLz9sbD1cIiArXHJcbiAgICAgICAgICAocmV6WzldID8gcmV6WzldICsgXCImej1cIiArIE1hdGguZmxvb3IocmV6WzEwXSkgKyAocmV6WzEyXSA/IHJlelsxMl0ucmVwbGFjZSgvXlxcLy8sIFwiJlwiKSA6IFwiXCIpIDogcmV6WzEyXSArIFwiXCIpLnJlcGxhY2UoL1xcPy8sIFwiJlwiKSArXHJcbiAgICAgICAgICBcIiZvdXRwdXQ9XCIgK1xyXG4gICAgICAgICAgKHJlelsxMl0gJiYgcmV6WzEyXS5pbmRleE9mKFwibGF5ZXI9Y1wiKSA+IDAgPyBcInN2ZW1iZWRcIiA6IFwiZW1iZWRcIilcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEV4YW1wbGVzOlxyXG4gICAgLy8gaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3NlYXJjaC9FbXBpcmUrU3RhdGUrQnVpbGRpbmcvXHJcbiAgICAvLyBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvc2VhcmNoLz9hcGk9MSZxdWVyeT1jZW50dXJ5bGluaytmaWVsZFxyXG4gICAgLy8gaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3NlYXJjaC8/YXBpPTEmcXVlcnk9NDcuNTk1MTUxOCwtMTIyLjMzMTYzOTNcclxuICAgIGdtYXBfc2VhcmNoOiB7XHJcbiAgICAgIG1hdGNoZXI6IC8obWFwc1xcLik/Z29vZ2xlXFwuKFthLXpdezIsM30oXFwuW2Etel17Mn0pPylcXC8obWFwc1xcL3NlYXJjaFxcLykoLiopL2ksXHJcbiAgICAgIHR5cGU6IFwiaWZyYW1lXCIsXHJcbiAgICAgIHVybDogZnVuY3Rpb24ocmV6KSB7XHJcbiAgICAgICAgcmV0dXJuIFwiLy9tYXBzLmdvb2dsZS5cIiArIHJlelsyXSArIFwiL21hcHM/cT1cIiArIHJlels1XS5yZXBsYWNlKFwicXVlcnk9XCIsIFwicT1cIikucmVwbGFjZShcImFwaT0xXCIsIFwiXCIpICsgXCImb3V0cHV0PWVtYmVkXCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBGb3JtYXRzIG1hdGNoaW5nIHVybCB0byBmaW5hbCBmb3JtXHJcbiAgdmFyIGZvcm1hdCA9IGZ1bmN0aW9uKHVybCwgcmV6LCBwYXJhbXMpIHtcclxuICAgIGlmICghdXJsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgXCJcIjtcclxuXHJcbiAgICBpZiAoJC50eXBlKHBhcmFtcykgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgcGFyYW1zID0gJC5wYXJhbShwYXJhbXMsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgICQuZWFjaChyZXosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoXCIkXCIgKyBrZXksIHZhbHVlIHx8IFwiXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHBhcmFtcy5sZW5ndGgpIHtcclxuICAgICAgdXJsICs9ICh1cmwuaW5kZXhPZihcIj9cIikgPiAwID8gXCImXCIgOiBcIj9cIikgKyBwYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVybDtcclxuICB9O1xyXG5cclxuICAkKGRvY3VtZW50KS5vbihcIm9iamVjdE5lZWRzVHlwZS5mYlwiLCBmdW5jdGlvbihlLCBpbnN0YW5jZSwgaXRlbSkge1xyXG4gICAgdmFyIHVybCA9IGl0ZW0uc3JjIHx8IFwiXCIsXHJcbiAgICAgIHR5cGUgPSBmYWxzZSxcclxuICAgICAgbWVkaWEsXHJcbiAgICAgIHRodW1iLFxyXG4gICAgICByZXosXHJcbiAgICAgIHBhcmFtcyxcclxuICAgICAgdXJsUGFyYW1zLFxyXG4gICAgICBwYXJhbU9iaixcclxuICAgICAgcHJvdmlkZXI7XHJcblxyXG4gICAgbWVkaWEgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGl0ZW0ub3B0cy5tZWRpYSk7XHJcblxyXG4gICAgLy8gTG9vayBmb3IgYW55IG1hdGNoaW5nIG1lZGlhIHR5cGVcclxuICAgICQuZWFjaChtZWRpYSwgZnVuY3Rpb24ocHJvdmlkZXJOYW1lLCBwcm92aWRlck9wdHMpIHtcclxuICAgICAgcmV6ID0gdXJsLm1hdGNoKHByb3ZpZGVyT3B0cy5tYXRjaGVyKTtcclxuXHJcbiAgICAgIGlmICghcmV6KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0eXBlID0gcHJvdmlkZXJPcHRzLnR5cGU7XHJcbiAgICAgIHByb3ZpZGVyID0gcHJvdmlkZXJOYW1lO1xyXG4gICAgICBwYXJhbU9iaiA9IHt9O1xyXG5cclxuICAgICAgaWYgKHByb3ZpZGVyT3B0cy5wYXJhbVBsYWNlICYmIHJleltwcm92aWRlck9wdHMucGFyYW1QbGFjZV0pIHtcclxuICAgICAgICB1cmxQYXJhbXMgPSByZXpbcHJvdmlkZXJPcHRzLnBhcmFtUGxhY2VdO1xyXG5cclxuICAgICAgICBpZiAodXJsUGFyYW1zWzBdID09IFwiP1wiKSB7XHJcbiAgICAgICAgICB1cmxQYXJhbXMgPSB1cmxQYXJhbXMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXJsUGFyYW1zID0gdXJsUGFyYW1zLnNwbGl0KFwiJlwiKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCB1cmxQYXJhbXMubGVuZ3RoOyArK20pIHtcclxuICAgICAgICAgIHZhciBwID0gdXJsUGFyYW1zW21dLnNwbGl0KFwiPVwiLCAyKTtcclxuXHJcbiAgICAgICAgICBpZiAocC5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICBwYXJhbU9ialtwWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcGFyYW1zID0gJC5leHRlbmQodHJ1ZSwge30sIHByb3ZpZGVyT3B0cy5wYXJhbXMsIGl0ZW0ub3B0c1twcm92aWRlck5hbWVdLCBwYXJhbU9iaik7XHJcblxyXG4gICAgICB1cmwgPVxyXG4gICAgICAgICQudHlwZShwcm92aWRlck9wdHMudXJsKSA9PT0gXCJmdW5jdGlvblwiID8gcHJvdmlkZXJPcHRzLnVybC5jYWxsKHRoaXMsIHJleiwgcGFyYW1zLCBpdGVtKSA6IGZvcm1hdChwcm92aWRlck9wdHMudXJsLCByZXosIHBhcmFtcyk7XHJcblxyXG4gICAgICB0aHVtYiA9XHJcbiAgICAgICAgJC50eXBlKHByb3ZpZGVyT3B0cy50aHVtYikgPT09IFwiZnVuY3Rpb25cIiA/IHByb3ZpZGVyT3B0cy50aHVtYi5jYWxsKHRoaXMsIHJleiwgcGFyYW1zLCBpdGVtKSA6IGZvcm1hdChwcm92aWRlck9wdHMudGh1bWIsIHJleik7XHJcblxyXG4gICAgICBpZiAocHJvdmlkZXJOYW1lID09PSBcInlvdXR1YmVcIikge1xyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8mdD0oKFxcZCspbSk/KFxcZCspcy8sIGZ1bmN0aW9uKG1hdGNoLCBwMSwgbSwgcykge1xyXG4gICAgICAgICAgcmV0dXJuIFwiJnN0YXJ0PVwiICsgKChtID8gcGFyc2VJbnQobSwgMTApICogNjAgOiAwKSArIHBhcnNlSW50KHMsIDEwKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXJOYW1lID09PSBcInZpbWVvXCIpIHtcclxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShcIiYlMjNcIiwgXCIjXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJZiBpdCBpcyBmb3VuZCwgdGhlbiBjaGFuZ2UgY29udGVudCB0eXBlIGFuZCB1cGRhdGUgdGhlIHVybFxyXG5cclxuICAgIGlmICh0eXBlKSB7XHJcbiAgICAgIGlmICghaXRlbS5vcHRzLnRodW1iICYmICEoaXRlbS5vcHRzLiR0aHVtYiAmJiBpdGVtLm9wdHMuJHRodW1iLmxlbmd0aCkpIHtcclxuICAgICAgICBpdGVtLm9wdHMudGh1bWIgPSB0aHVtYjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT09IFwiaWZyYW1lXCIpIHtcclxuICAgICAgICBpdGVtLm9wdHMgPSAkLmV4dGVuZCh0cnVlLCBpdGVtLm9wdHMsIHtcclxuICAgICAgICAgIGlmcmFtZToge1xyXG4gICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcclxuICAgICAgICAgICAgYXR0cjoge1xyXG4gICAgICAgICAgICAgIHNjcm9sbGluZzogXCJub1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJC5leHRlbmQoaXRlbSwge1xyXG4gICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgc3JjOiB1cmwsXHJcbiAgICAgICAgb3JpZ1NyYzogaXRlbS5zcmMsXHJcbiAgICAgICAgY29udGVudFNvdXJjZTogcHJvdmlkZXIsXHJcbiAgICAgICAgY29udGVudFR5cGU6IHR5cGUgPT09IFwiaW1hZ2VcIiA/IFwiaW1hZ2VcIiA6IHByb3ZpZGVyID09IFwiZ21hcF9wbGFjZVwiIHx8IHByb3ZpZGVyID09IFwiZ21hcF9zZWFyY2hcIiA/IFwibWFwXCIgOiBcInZpZGVvXCJcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHVybCkge1xyXG4gICAgICBpdGVtLnR5cGUgPSBpdGVtLm9wdHMuZGVmYXVsdFR5cGU7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIExvYWQgWW91VHViZS9WaWRlbyBBUEkgb24gcmVxdWVzdCB0byBkZXRlY3Qgd2hlbiB2aWRlbyBmaW5pc2hlZCBwbGF5aW5nXHJcbiAgdmFyIFZpZGVvQVBJTG9hZGVyID0ge1xyXG4gICAgeW91dHViZToge1xyXG4gICAgICBzcmM6IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaVwiLFxyXG4gICAgICBjbGFzczogXCJZVFwiLFxyXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgbG9hZGVkOiBmYWxzZVxyXG4gICAgfSxcclxuXHJcbiAgICB2aW1lbzoge1xyXG4gICAgICBzcmM6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2FwaS9wbGF5ZXIuanNcIixcclxuICAgICAgY2xhc3M6IFwiVmltZW9cIixcclxuICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGxvYWRlZDogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZDogZnVuY3Rpb24odmVuZG9yKSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXMsXHJcbiAgICAgICAgc2NyaXB0O1xyXG5cclxuICAgICAgaWYgKHRoaXNbdmVuZG9yXS5sb2FkZWQpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgX3RoaXMuZG9uZSh2ZW5kb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXNbdmVuZG9yXS5sb2FkaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzW3ZlbmRvcl0ubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gICAgICBzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiAgICAgIHNjcmlwdC5zcmMgPSB0aGlzW3ZlbmRvcl0uc3JjO1xyXG5cclxuICAgICAgaWYgKHZlbmRvciA9PT0gXCJ5b3V0dWJlXCIpIHtcclxuICAgICAgICB3aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIF90aGlzW3ZlbmRvcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgIF90aGlzLmRvbmUodmVuZG9yKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIF90aGlzW3ZlbmRvcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgIF90aGlzLmRvbmUodmVuZG9yKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICB9LFxyXG4gICAgZG9uZTogZnVuY3Rpb24odmVuZG9yKSB7XHJcbiAgICAgIHZhciBpbnN0YW5jZSwgJGVsLCBwbGF5ZXI7XHJcblxyXG4gICAgICBpZiAodmVuZG9yID09PSBcInlvdXR1YmVcIikge1xyXG4gICAgICAgIGRlbGV0ZSB3aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgJGVsID0gaW5zdGFuY2UuY3VycmVudC4kY29udGVudC5maW5kKFwiaWZyYW1lXCIpO1xyXG5cclxuICAgICAgICBpZiAodmVuZG9yID09PSBcInlvdXR1YmVcIiAmJiBZVCAhPT0gdW5kZWZpbmVkICYmIFlUKSB7XHJcbiAgICAgICAgICBwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCRlbC5hdHRyKFwiaWRcIiksIHtcclxuICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuZGF0YSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGluc3RhbmNlLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodmVuZG9yID09PSBcInZpbWVvXCIgJiYgVmltZW8gIT09IHVuZGVmaW5lZCAmJiBWaW1lbykge1xyXG4gICAgICAgICAgcGxheWVyID0gbmV3IFZpbWVvLlBsYXllcigkZWwpO1xyXG5cclxuICAgICAgICAgIHBsYXllci5vbihcImVuZGVkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5uZXh0KCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkKGRvY3VtZW50KS5vbih7XHJcbiAgICBcImFmdGVyU2hvdy5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCkge1xyXG4gICAgICBpZiAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoID4gMSAmJiAoY3VycmVudC5jb250ZW50U291cmNlID09PSBcInlvdXR1YmVcIiB8fCBjdXJyZW50LmNvbnRlbnRTb3VyY2UgPT09IFwidmltZW9cIikpIHtcclxuICAgICAgICBWaWRlb0FQSUxvYWRlci5sb2FkKGN1cnJlbnQuY29udGVudFNvdXJjZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufSkoalF1ZXJ5KTtcclxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vL1xyXG4vLyBHdWVzdHVyZXNcclxuLy8gQWRkcyB0b3VjaCBndWVzdHVyZXMsIGhhbmRsZXMgY2xpY2sgYW5kIHRhcCBldmVudHNcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgdmFyIHJlcXVlc3RBRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAvLyBpZiBhbGwgZWxzZSBmYWlscywgdXNlIHNldFRpbWVvdXRcclxuICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSkoKTtcclxuXHJcbiAgdmFyIGNhbmNlbEFGcmFtZSA9IChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgIHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9KSgpO1xyXG5cclxuICB2YXIgZ2V0UG9pbnRlclhZID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQgfHwgZSB8fCB3aW5kb3cuZTtcclxuICAgIGUgPSBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA/IGUudG91Y2hlcyA6IGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPyBlLmNoYW5nZWRUb3VjaGVzIDogW2VdO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBlKSB7XHJcbiAgICAgIGlmIChlW2tleV0ucGFnZVgpIHtcclxuICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICB4OiBlW2tleV0ucGFnZVgsXHJcbiAgICAgICAgICB5OiBlW2tleV0ucGFnZVlcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChlW2tleV0uY2xpZW50WCkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgIHg6IGVba2V5XS5jbGllbnRYLFxyXG4gICAgICAgICAgeTogZVtrZXldLmNsaWVudFlcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGRpc3RhbmNlID0gZnVuY3Rpb24ocG9pbnQyLCBwb2ludDEsIHdoYXQpIHtcclxuICAgIGlmICghcG9pbnQxIHx8ICFwb2ludDIpIHtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdoYXQgPT09IFwieFwiKSB7XHJcbiAgICAgIHJldHVybiBwb2ludDIueCAtIHBvaW50MS54O1xyXG4gICAgfSBlbHNlIGlmICh3aGF0ID09PSBcInlcIikge1xyXG4gICAgICByZXR1cm4gcG9pbnQyLnkgLSBwb2ludDEueTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50Mi54IC0gcG9pbnQxLngsIDIpICsgTWF0aC5wb3cocG9pbnQyLnkgLSBwb2ludDEueSwgMikpO1xyXG4gIH07XHJcblxyXG4gIHZhciBpc0NsaWNrYWJsZSA9IGZ1bmN0aW9uKCRlbCkge1xyXG4gICAgaWYgKFxyXG4gICAgICAkZWwuaXMoJ2EsYXJlYSxidXR0b24sW3JvbGU9XCJidXR0b25cIl0saW5wdXQsbGFiZWwsc2VsZWN0LHN1bW1hcnksdGV4dGFyZWEsdmlkZW8sYXVkaW8saWZyYW1lJykgfHxcclxuICAgICAgJC5pc0Z1bmN0aW9uKCRlbC5nZXQoMCkub25jbGljaykgfHxcclxuICAgICAgJGVsLmRhdGEoXCJzZWxlY3RhYmxlXCIpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGF0dHJpYnV0ZXMgbGlrZSBkYXRhLWZhbmN5Ym94LW5leHQgb3IgZGF0YS1mYW5jeWJveC1jbG9zZVxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGF0dHMgPSAkZWxbMF0uYXR0cmlidXRlcywgbiA9IGF0dHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgIGlmIChhdHRzW2ldLm5vZGVOYW1lLnN1YnN0cigwLCAxNCkgPT09IFwiZGF0YS1mYW5jeWJveC1cIikge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIHZhciBoYXNTY3JvbGxiYXJzID0gZnVuY3Rpb24oZWwpIHtcclxuICAgIHZhciBvdmVyZmxvd1kgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClbXCJvdmVyZmxvdy15XCJdLFxyXG4gICAgICBvdmVyZmxvd1ggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClbXCJvdmVyZmxvdy14XCJdLFxyXG4gICAgICB2ZXJ0aWNhbCA9IChvdmVyZmxvd1kgPT09IFwic2Nyb2xsXCIgfHwgb3ZlcmZsb3dZID09PSBcImF1dG9cIikgJiYgZWwuc2Nyb2xsSGVpZ2h0ID4gZWwuY2xpZW50SGVpZ2h0LFxyXG4gICAgICBob3Jpem9udGFsID0gKG92ZXJmbG93WCA9PT0gXCJzY3JvbGxcIiB8fCBvdmVyZmxvd1ggPT09IFwiYXV0b1wiKSAmJiBlbC5zY3JvbGxXaWR0aCA+IGVsLmNsaWVudFdpZHRoO1xyXG5cclxuICAgIHJldHVybiB2ZXJ0aWNhbCB8fCBob3Jpem9udGFsO1xyXG4gIH07XHJcblxyXG4gIHZhciBpc1Njcm9sbGFibGUgPSBmdW5jdGlvbigkZWwpIHtcclxuICAgIHZhciByZXogPSBmYWxzZTtcclxuXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICByZXogPSBoYXNTY3JvbGxiYXJzKCRlbC5nZXQoMCkpO1xyXG5cclxuICAgICAgaWYgKHJleikge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkZWwgPSAkZWwucGFyZW50KCk7XHJcblxyXG4gICAgICBpZiAoISRlbC5sZW5ndGggfHwgJGVsLmhhc0NsYXNzKFwiZmFuY3lib3gtc3RhZ2VcIikgfHwgJGVsLmlzKFwiYm9keVwiKSkge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlejtcclxuICB9O1xyXG5cclxuICB2YXIgR3Vlc3R1cmVzID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLmluc3RhbmNlID0gaW5zdGFuY2U7XHJcblxyXG4gICAgc2VsZi4kYmcgPSBpbnN0YW5jZS4kcmVmcy5iZztcclxuICAgIHNlbGYuJHN0YWdlID0gaW5zdGFuY2UuJHJlZnMuc3RhZ2U7XHJcbiAgICBzZWxmLiRjb250YWluZXIgPSBpbnN0YW5jZS4kcmVmcy5jb250YWluZXI7XHJcblxyXG4gICAgc2VsZi5kZXN0cm95KCk7XHJcblxyXG4gICAgc2VsZi4kY29udGFpbmVyLm9uKFwidG91Y2hzdGFydC5mYi50b3VjaCBtb3VzZWRvd24uZmIudG91Y2hcIiwgJC5wcm94eShzZWxmLCBcIm9udG91Y2hzdGFydFwiKSk7XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi4kY29udGFpbmVyLm9mZihcIi5mYi50b3VjaFwiKTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vZmYoXCIuZmIudG91Y2hcIik7XHJcblxyXG4gICAgaWYgKHNlbGYucmVxdWVzdElkKSB7XHJcbiAgICAgIGNhbmNlbEFGcmFtZShzZWxmLnJlcXVlc3RJZCk7XHJcbiAgICAgIHNlbGYucmVxdWVzdElkID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi50YXBwZWQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGFwcGVkKTtcclxuICAgICAgc2VsZi50YXBwZWQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUub250b3VjaHN0YXJ0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCksXHJcbiAgICAgIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZSxcclxuICAgICAgY3VycmVudCA9IGluc3RhbmNlLmN1cnJlbnQsXHJcbiAgICAgICRzbGlkZSA9IGN1cnJlbnQuJHNsaWRlLFxyXG4gICAgICAkY29udGVudCA9IGN1cnJlbnQuJGNvbnRlbnQsXHJcbiAgICAgIGlzVG91Y2hEZXZpY2UgPSBlLnR5cGUgPT0gXCJ0b3VjaHN0YXJ0XCI7XHJcblxyXG4gICAgLy8gRG8gbm90IHJlc3BvbmQgdG8gYm90aCAodG91Y2ggYW5kIG1vdXNlKSBldmVudHNcclxuICAgIGlmIChpc1RvdWNoRGV2aWNlKSB7XHJcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5vZmYoXCJtb3VzZWRvd24uZmIudG91Y2hcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWdub3JlIHJpZ2h0IGNsaWNrXHJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5idXR0b24gPT0gMikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWdub3JlIHRhcGluZyBvbiBsaW5rcywgYnV0dG9ucywgaW5wdXQgZWxlbWVudHNcclxuICAgIGlmICghJHNsaWRlLmxlbmd0aCB8fCAhJHRhcmdldC5sZW5ndGggfHwgaXNDbGlja2FibGUoJHRhcmdldCkgfHwgaXNDbGlja2FibGUoJHRhcmdldC5wYXJlbnQoKSkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gSWdub3JlIGNsaWNrcyBvbiB0aGUgc2Nyb2xsYmFyXHJcbiAgICBpZiAoISR0YXJnZXQuaXMoXCJpbWdcIikgJiYgZS5vcmlnaW5hbEV2ZW50LmNsaWVudFggPiAkdGFyZ2V0WzBdLmNsaWVudFdpZHRoICsgJHRhcmdldC5vZmZzZXQoKS5sZWZ0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZ25vcmUgY2xpY2tzIHdoaWxlIHpvb21pbmcgb3IgY2xvc2luZ1xyXG4gICAgaWYgKCFjdXJyZW50IHx8IGluc3RhbmNlLmlzQW5pbWF0aW5nIHx8IGN1cnJlbnQuJHNsaWRlLmhhc0NsYXNzKFwiZmFuY3lib3gtYW5pbWF0ZWRcIikpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYucmVhbFBvaW50cyA9IHNlbGYuc3RhcnRQb2ludHMgPSBnZXRQb2ludGVyWFkoZSk7XHJcblxyXG4gICAgaWYgKCFzZWxmLnN0YXJ0UG9pbnRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWxsb3cgb3RoZXIgc2NyaXB0cyB0byBjYXRjaCB0b3VjaCBldmVudCBpZiBcInRvdWNoXCIgaXMgc2V0IHRvIGZhbHNlXHJcbiAgICBpZiAoY3VycmVudC50b3VjaCkge1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuc3RhcnRFdmVudCA9IGU7XHJcblxyXG4gICAgc2VsZi5jYW5UYXAgPSB0cnVlO1xyXG4gICAgc2VsZi4kdGFyZ2V0ID0gJHRhcmdldDtcclxuICAgIHNlbGYuJGNvbnRlbnQgPSAkY29udGVudDtcclxuICAgIHNlbGYub3B0cyA9IGN1cnJlbnQub3B0cy50b3VjaDtcclxuXHJcbiAgICBzZWxmLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gICAgc2VsZi5pc1N3aXBpbmcgPSBmYWxzZTtcclxuICAgIHNlbGYuaXNab29taW5nID0gZmFsc2U7XHJcbiAgICBzZWxmLmlzU2Nyb2xsaW5nID0gZmFsc2U7XHJcbiAgICBzZWxmLmNhblBhbiA9IGluc3RhbmNlLmNhblBhbigpO1xyXG5cclxuICAgIHNlbGYuc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBzZWxmLmRpc3RhbmNlWCA9IHNlbGYuZGlzdGFuY2VZID0gc2VsZi5kaXN0YW5jZSA9IDA7XHJcblxyXG4gICAgc2VsZi5jYW52YXNXaWR0aCA9IE1hdGgucm91bmQoJHNsaWRlWzBdLmNsaWVudFdpZHRoKTtcclxuICAgIHNlbGYuY2FudmFzSGVpZ2h0ID0gTWF0aC5yb3VuZCgkc2xpZGVbMF0uY2xpZW50SGVpZ2h0KTtcclxuXHJcbiAgICBzZWxmLmNvbnRlbnRMYXN0UG9zID0gbnVsbDtcclxuICAgIHNlbGYuY29udGVudFN0YXJ0UG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoc2VsZi4kY29udGVudCkgfHwge3RvcDogMCwgbGVmdDogMH07XHJcbiAgICBzZWxmLnNsaWRlclN0YXJ0UG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoJHNsaWRlKTtcclxuXHJcbiAgICAvLyBTaW5jZSBwb3NpdGlvbiB3aWxsIGJlIGFic29sdXRlLCBidXQgd2UgbmVlZCB0byBtYWtlIGl0IHJlbGF0aXZlIHRvIHRoZSBzdGFnZVxyXG4gICAgc2VsZi5zdGFnZVBvcyA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKGluc3RhbmNlLiRyZWZzLnN0YWdlKTtcclxuXHJcbiAgICBzZWxmLnNsaWRlclN0YXJ0UG9zLnRvcCAtPSBzZWxmLnN0YWdlUG9zLnRvcDtcclxuICAgIHNlbGYuc2xpZGVyU3RhcnRQb3MubGVmdCAtPSBzZWxmLnN0YWdlUG9zLmxlZnQ7XHJcblxyXG4gICAgc2VsZi5jb250ZW50U3RhcnRQb3MudG9wIC09IHNlbGYuc3RhZ2VQb3MudG9wO1xyXG4gICAgc2VsZi5jb250ZW50U3RhcnRQb3MubGVmdCAtPSBzZWxmLnN0YWdlUG9zLmxlZnQ7XHJcblxyXG4gICAgJChkb2N1bWVudClcclxuICAgICAgLm9mZihcIi5mYi50b3VjaFwiKVxyXG4gICAgICAub24oaXNUb3VjaERldmljZSA/IFwidG91Y2hlbmQuZmIudG91Y2ggdG91Y2hjYW5jZWwuZmIudG91Y2hcIiA6IFwibW91c2V1cC5mYi50b3VjaCBtb3VzZWxlYXZlLmZiLnRvdWNoXCIsICQucHJveHkoc2VsZiwgXCJvbnRvdWNoZW5kXCIpKVxyXG4gICAgICAub24oaXNUb3VjaERldmljZSA/IFwidG91Y2htb3ZlLmZiLnRvdWNoXCIgOiBcIm1vdXNlbW92ZS5mYi50b3VjaFwiLCAkLnByb3h5KHNlbGYsIFwib250b3VjaG1vdmVcIikpO1xyXG5cclxuICAgIGlmICgkLmZhbmN5Ym94LmlzTW9iaWxlKSB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2VsZi5vbnNjcm9sbCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2tpcCBpZiBjbGlja2VkIG91dHNpZGUgdGhlIHNsaWRpbmcgYXJlYVxyXG4gICAgaWYgKCEoc2VsZi5vcHRzIHx8IHNlbGYuY2FuUGFuKSB8fCAhKCR0YXJnZXQuaXMoc2VsZi4kc3RhZ2UpIHx8IHNlbGYuJHN0YWdlLmZpbmQoJHRhcmdldCkubGVuZ3RoKSkge1xyXG4gICAgICBpZiAoJHRhcmdldC5pcyhcIi5mYW5jeWJveC1pbWFnZVwiKSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoJC5mYW5jeWJveC5pc01vYmlsZSAmJiAkdGFyZ2V0LnBhcmVudHMoXCIuZmFuY3lib3gtY2FwdGlvblwiKS5sZW5ndGgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5pc1Njcm9sbGFibGUgPSBpc1Njcm9sbGFibGUoJHRhcmdldCkgfHwgaXNTY3JvbGxhYmxlKCR0YXJnZXQucGFyZW50KCkpO1xyXG5cclxuICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgc2Nyb2xsYWJsZSBhbmQgdHJ5IHRvIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvciAoc2Nyb2xsaW5nKVxyXG4gICAgaWYgKCEoJC5mYW5jeWJveC5pc01vYmlsZSAmJiBzZWxmLmlzU2Nyb2xsYWJsZSkpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9uZSBmaW5nZXIgb3IgbW91c2UgY2xpY2sgLSBzd2lwZSBvciBwYW4gYW4gaW1hZ2VcclxuICAgIGlmIChzZWxmLnN0YXJ0UG9pbnRzLmxlbmd0aCA9PT0gMSB8fCBjdXJyZW50Lmhhc0Vycm9yKSB7XHJcbiAgICAgIGlmIChzZWxmLmNhblBhbikge1xyXG4gICAgICAgICQuZmFuY3lib3guc3RvcChzZWxmLiRjb250ZW50KTtcclxuXHJcbiAgICAgICAgc2VsZi5pc1Bhbm5pbmcgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYuaXNTd2lwaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKFwiZmFuY3lib3gtaXMtZ3JhYmJpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHdvIGZpbmdlcnMgLSB6b29tIGltYWdlXHJcbiAgICBpZiAoc2VsZi5zdGFydFBvaW50cy5sZW5ndGggPT09IDIgJiYgY3VycmVudC50eXBlID09PSBcImltYWdlXCIgJiYgKGN1cnJlbnQuaXNMb2FkZWQgfHwgY3VycmVudC4kZ2hvc3QpKSB7XHJcbiAgICAgIHNlbGYuY2FuVGFwID0gZmFsc2U7XHJcbiAgICAgIHNlbGYuaXNTd2lwaW5nID0gZmFsc2U7XHJcbiAgICAgIHNlbGYuaXNQYW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICBzZWxmLmlzWm9vbWluZyA9IHRydWU7XHJcblxyXG4gICAgICAkLmZhbmN5Ym94LnN0b3Aoc2VsZi4kY29udGVudCk7XHJcblxyXG4gICAgICBzZWxmLmNlbnRlclBvaW50U3RhcnRYID0gKHNlbGYuc3RhcnRQb2ludHNbMF0ueCArIHNlbGYuc3RhcnRQb2ludHNbMV0ueCkgKiAwLjUgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICBzZWxmLmNlbnRlclBvaW50U3RhcnRZID0gKHNlbGYuc3RhcnRQb2ludHNbMF0ueSArIHNlbGYuc3RhcnRQb2ludHNbMV0ueSkgKiAwLjUgLSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgICBzZWxmLnBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WCA9IChzZWxmLmNlbnRlclBvaW50U3RhcnRYIC0gc2VsZi5jb250ZW50U3RhcnRQb3MubGVmdCkgLyBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuICAgICAgc2VsZi5wZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFkgPSAoc2VsZi5jZW50ZXJQb2ludFN0YXJ0WSAtIHNlbGYuY29udGVudFN0YXJ0UG9zLnRvcCkgLyBzZWxmLmNvbnRlbnRTdGFydFBvcy5oZWlnaHQ7XHJcblxyXG4gICAgICBzZWxmLnN0YXJ0RGlzdGFuY2VCZXR3ZWVuRmluZ2VycyA9IGRpc3RhbmNlKHNlbGYuc3RhcnRQb2ludHNbMF0sIHNlbGYuc3RhcnRQb2ludHNbMV0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUub25zY3JvbGwgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5pc1Njcm9sbGluZyA9IHRydWU7XHJcblxyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBzZWxmLm9uc2Nyb2xsLCB0cnVlKTtcclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9udG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB1c2VyIGhhcyBub3QgcmVsZWFzZWQgb3ZlciBpZnJhbWUgb3IgZGlzYWJsZWQgZWxlbWVudFxyXG4gICAgaWYgKGUub3JpZ2luYWxFdmVudC5idXR0b25zICE9PSB1bmRlZmluZWQgJiYgZS5vcmlnaW5hbEV2ZW50LmJ1dHRvbnMgPT09IDApIHtcclxuICAgICAgc2VsZi5vbnRvdWNoZW5kKGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYuaXNTY3JvbGxpbmcpIHtcclxuICAgICAgc2VsZi5jYW5UYXAgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYubmV3UG9pbnRzID0gZ2V0UG9pbnRlclhZKGUpO1xyXG5cclxuICAgIGlmICghKHNlbGYub3B0cyB8fCBzZWxmLmNhblBhbikgfHwgIXNlbGYubmV3UG9pbnRzLmxlbmd0aCB8fCAhc2VsZi5uZXdQb2ludHMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIShzZWxmLmlzU3dpcGluZyAmJiBzZWxmLmlzU3dpcGluZyA9PT0gdHJ1ZSkpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuZGlzdGFuY2VYID0gZGlzdGFuY2Uoc2VsZi5uZXdQb2ludHNbMF0sIHNlbGYuc3RhcnRQb2ludHNbMF0sIFwieFwiKTtcclxuICAgIHNlbGYuZGlzdGFuY2VZID0gZGlzdGFuY2Uoc2VsZi5uZXdQb2ludHNbMF0sIHNlbGYuc3RhcnRQb2ludHNbMF0sIFwieVwiKTtcclxuXHJcbiAgICBzZWxmLmRpc3RhbmNlID0gZGlzdGFuY2Uoc2VsZi5uZXdQb2ludHNbMF0sIHNlbGYuc3RhcnRQb2ludHNbMF0pO1xyXG5cclxuICAgIC8vIFNraXAgZmFsc2Ugb250b3VjaG1vdmUgZXZlbnRzIChDaHJvbWUpXHJcbiAgICBpZiAoc2VsZi5kaXN0YW5jZSA+IDApIHtcclxuICAgICAgaWYgKHNlbGYuaXNTd2lwaW5nKSB7XHJcbiAgICAgICAgc2VsZi5vblN3aXBlKGUpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNlbGYuaXNQYW5uaW5nKSB7XHJcbiAgICAgICAgc2VsZi5vblBhbigpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNlbGYuaXNab29taW5nKSB7XHJcbiAgICAgICAgc2VsZi5vblpvb20oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUub25Td2lwZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgaW5zdGFuY2UgPSBzZWxmLmluc3RhbmNlLFxyXG4gICAgICBzd2lwaW5nID0gc2VsZi5pc1N3aXBpbmcsXHJcbiAgICAgIGxlZnQgPSBzZWxmLnNsaWRlclN0YXJ0UG9zLmxlZnQgfHwgMCxcclxuICAgICAgYW5nbGU7XHJcblxyXG4gICAgLy8gSWYgZGlyZWN0aW9uIGlzIG5vdCB5ZXQgZGV0ZXJtaW5lZFxyXG4gICAgaWYgKHN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgLy8gV2UgbmVlZCBhdCBsZWFzdCAxMHB4IGRpc3RhbmNlIHRvIGNvcnJlY3RseSBjYWxjdWxhdGUgYW4gYW5nbGVcclxuICAgICAgaWYgKE1hdGguYWJzKHNlbGYuZGlzdGFuY2UpID4gMTApIHtcclxuICAgICAgICBzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiAmJiBzZWxmLm9wdHMudmVydGljYWwpIHtcclxuICAgICAgICAgIHNlbGYuaXNTd2lwaW5nID0gXCJ5XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZS5pc0RyYWdnaW5nIHx8IHNlbGYub3B0cy52ZXJ0aWNhbCA9PT0gZmFsc2UgfHwgKHNlbGYub3B0cy52ZXJ0aWNhbCA9PT0gXCJhdXRvXCIgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiA4MDApKSB7XHJcbiAgICAgICAgICBzZWxmLmlzU3dpcGluZyA9IFwieFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhbmdsZSA9IE1hdGguYWJzKChNYXRoLmF0YW4yKHNlbGYuZGlzdGFuY2VZLCBzZWxmLmRpc3RhbmNlWCkgKiAxODApIC8gTWF0aC5QSSk7XHJcblxyXG4gICAgICAgICAgc2VsZi5pc1N3aXBpbmcgPSBhbmdsZSA+IDQ1ICYmIGFuZ2xlIDwgMTM1ID8gXCJ5XCIgOiBcInhcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmlzU3dpcGluZyA9PT0gXCJ5XCIgJiYgJC5mYW5jeWJveC5pc01vYmlsZSAmJiBzZWxmLmlzU2Nyb2xsYWJsZSkge1xyXG4gICAgICAgICAgc2VsZi5pc1Njcm9sbGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UuaXNEcmFnZ2luZyA9IHNlbGYuaXNTd2lwaW5nO1xyXG5cclxuICAgICAgICAvLyBSZXNldCBwb2ludHMgdG8gYXZvaWQganVtcGluZywgYmVjYXVzZSB3ZSBkcm9wcGVkIGZpcnN0IHN3aXBlcyB0byBjYWxjdWxhdGUgdGhlIGFuZ2xlXHJcbiAgICAgICAgc2VsZi5zdGFydFBvaW50cyA9IHNlbGYubmV3UG9pbnRzO1xyXG5cclxuICAgICAgICAkLmVhY2goaW5zdGFuY2Uuc2xpZGVzLCBmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcclxuICAgICAgICAgIHZhciBzbGlkZVBvcywgc3RhZ2VQb3M7XHJcblxyXG4gICAgICAgICAgJC5mYW5jeWJveC5zdG9wKHNsaWRlLiRzbGlkZSk7XHJcblxyXG4gICAgICAgICAgc2xpZGVQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShzbGlkZS4kc2xpZGUpO1xyXG4gICAgICAgICAgc3RhZ2VQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZShpbnN0YW5jZS4kcmVmcy5zdGFnZSk7XHJcblxyXG4gICAgICAgICAgc2xpZGUuJHNsaWRlXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogXCJcIixcclxuICAgICAgICAgICAgICBvcGFjaXR5OiBcIlwiLFxyXG4gICAgICAgICAgICAgIFwidHJhbnNpdGlvbi1kdXJhdGlvblwiOiBcIlwiXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImZhbmN5Ym94LWFuaW1hdGVkXCIpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhmdW5jdGlvbihpbmRleCwgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIChjbGFzc05hbWUubWF0Y2goLyhefFxccylmYW5jeWJveC1meC1cXFMrL2cpIHx8IFtdKS5qb2luKFwiIFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaWYgKHNsaWRlLnBvcyA9PT0gaW5zdGFuY2UuY3VycmVudC5wb3MpIHtcclxuICAgICAgICAgICAgc2VsZi5zbGlkZXJTdGFydFBvcy50b3AgPSBzbGlkZVBvcy50b3AgLSBzdGFnZVBvcy50b3A7XHJcbiAgICAgICAgICAgIHNlbGYuc2xpZGVyU3RhcnRQb3MubGVmdCA9IHNsaWRlUG9zLmxlZnQgLSBzdGFnZVBvcy5sZWZ0O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKHNsaWRlLiRzbGlkZSwge1xyXG4gICAgICAgICAgICB0b3A6IHNsaWRlUG9zLnRvcCAtIHN0YWdlUG9zLnRvcCxcclxuICAgICAgICAgICAgbGVmdDogc2xpZGVQb3MubGVmdCAtIHN0YWdlUG9zLmxlZnRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTdG9wIHNsaWRlc2hvd1xyXG4gICAgICAgIGlmIChpbnN0YW5jZS5TbGlkZVNob3cgJiYgaW5zdGFuY2UuU2xpZGVTaG93LmlzQWN0aXZlKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5TbGlkZVNob3cuc3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0aWNreSBlZGdlc1xyXG4gICAgaWYgKHN3aXBpbmcgPT0gXCJ4XCIpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHNlbGYuZGlzdGFuY2VYID4gMCAmJlxyXG4gICAgICAgIChzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCA8IDIgfHwgKHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCA9PT0gMCAmJiAhc2VsZi5pbnN0YW5jZS5jdXJyZW50Lm9wdHMubG9vcCkpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGxlZnQgPSBsZWZ0ICsgTWF0aC5wb3coc2VsZi5kaXN0YW5jZVgsIDAuOCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgc2VsZi5kaXN0YW5jZVggPCAwICYmXHJcbiAgICAgICAgKHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fFxyXG4gICAgICAgICAgKHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCA9PT0gc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGggLSAxICYmICFzZWxmLmluc3RhbmNlLmN1cnJlbnQub3B0cy5sb29wKSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgbGVmdCA9IGxlZnQgLSBNYXRoLnBvdygtc2VsZi5kaXN0YW5jZVgsIDAuOCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGVmdCA9IGxlZnQgKyBzZWxmLmRpc3RhbmNlWDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuc2xpZGVyTGFzdFBvcyA9IHtcclxuICAgICAgdG9wOiBzd2lwaW5nID09IFwieFwiID8gMCA6IHNlbGYuc2xpZGVyU3RhcnRQb3MudG9wICsgc2VsZi5kaXN0YW5jZVksXHJcbiAgICAgIGxlZnQ6IGxlZnRcclxuICAgIH07XHJcblxyXG4gICAgaWYgKHNlbGYucmVxdWVzdElkKSB7XHJcbiAgICAgIGNhbmNlbEFGcmFtZShzZWxmLnJlcXVlc3RJZCk7XHJcblxyXG4gICAgICBzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5yZXF1ZXN0SWQgPSByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoc2VsZi5zbGlkZXJMYXN0UG9zKSB7XHJcbiAgICAgICAgJC5lYWNoKHNlbGYuaW5zdGFuY2Uuc2xpZGVzLCBmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcclxuICAgICAgICAgIHZhciBwb3MgPSBzbGlkZS5wb3MgLSBzZWxmLmluc3RhbmNlLmN1cnJQb3M7XHJcblxyXG4gICAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoc2xpZGUuJHNsaWRlLCB7XHJcbiAgICAgICAgICAgIHRvcDogc2VsZi5zbGlkZXJMYXN0UG9zLnRvcCxcclxuICAgICAgICAgICAgbGVmdDogc2VsZi5zbGlkZXJMYXN0UG9zLmxlZnQgKyBwb3MgKiBzZWxmLmNhbnZhc1dpZHRoICsgcG9zICogc2xpZGUub3B0cy5ndXR0ZXJcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZWxmLiRjb250YWluZXIuYWRkQ2xhc3MoXCJmYW5jeWJveC1pcy1zbGlkaW5nXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9uUGFuID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8gUHJldmVudCBhY2NpZGVudGFsIG1vdmVtZW50IChzb21ldGltZXMsIHdoZW4gdGFwcGluZyBjYXN1YWxseSwgZmluZ2VyIGNhbiBtb3ZlIGEgYml0KVxyXG4gICAgaWYgKGRpc3RhbmNlKHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnJlYWxQb2ludHNbMF0pIDwgKCQuZmFuY3lib3guaXNNb2JpbGUgPyAxMCA6IDUpKSB7XHJcbiAgICAgIHNlbGYuc3RhcnRQb2ludHMgPSBzZWxmLm5ld1BvaW50cztcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuY2FuVGFwID0gZmFsc2U7XHJcblxyXG4gICAgc2VsZi5jb250ZW50TGFzdFBvcyA9IHNlbGYubGltaXRNb3ZlbWVudCgpO1xyXG5cclxuICAgIGlmIChzZWxmLnJlcXVlc3RJZCkge1xyXG4gICAgICBjYW5jZWxBRnJhbWUoc2VsZi5yZXF1ZXN0SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYucmVxdWVzdElkID0gcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoc2VsZi4kY29udGVudCwgc2VsZi5jb250ZW50TGFzdFBvcyk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLyBNYWtlIHBhbm5pbmcgc3RpY2t5IHRvIHRoZSBlZGdlc1xyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUubGltaXRNb3ZlbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBjYW52YXNXaWR0aCA9IHNlbGYuY2FudmFzV2lkdGg7XHJcbiAgICB2YXIgY2FudmFzSGVpZ2h0ID0gc2VsZi5jYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgdmFyIGRpc3RhbmNlWCA9IHNlbGYuZGlzdGFuY2VYO1xyXG4gICAgdmFyIGRpc3RhbmNlWSA9IHNlbGYuZGlzdGFuY2VZO1xyXG5cclxuICAgIHZhciBjb250ZW50U3RhcnRQb3MgPSBzZWxmLmNvbnRlbnRTdGFydFBvcztcclxuXHJcbiAgICB2YXIgY3VycmVudE9mZnNldFggPSBjb250ZW50U3RhcnRQb3MubGVmdDtcclxuICAgIHZhciBjdXJyZW50T2Zmc2V0WSA9IGNvbnRlbnRTdGFydFBvcy50b3A7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRXaWR0aCA9IGNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuICAgIHZhciBjdXJyZW50SGVpZ2h0ID0gY29udGVudFN0YXJ0UG9zLmhlaWdodDtcclxuXHJcbiAgICB2YXIgbWluVHJhbnNsYXRlWCwgbWluVHJhbnNsYXRlWSwgbWF4VHJhbnNsYXRlWCwgbWF4VHJhbnNsYXRlWSwgbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WTtcclxuXHJcbiAgICBpZiAoY3VycmVudFdpZHRoID4gY2FudmFzV2lkdGgpIHtcclxuICAgICAgbmV3T2Zmc2V0WCA9IGN1cnJlbnRPZmZzZXRYICsgZGlzdGFuY2VYO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3T2Zmc2V0WCA9IGN1cnJlbnRPZmZzZXRYO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld09mZnNldFkgPSBjdXJyZW50T2Zmc2V0WSArIGRpc3RhbmNlWTtcclxuXHJcbiAgICAvLyBTbG93IGRvd24gcHJvcG9ydGlvbmFsbHkgdG8gdHJhdmVsZWQgZGlzdGFuY2VcclxuICAgIG1pblRyYW5zbGF0ZVggPSBNYXRoLm1heCgwLCBjYW52YXNXaWR0aCAqIDAuNSAtIGN1cnJlbnRXaWR0aCAqIDAuNSk7XHJcbiAgICBtaW5UcmFuc2xhdGVZID0gTWF0aC5tYXgoMCwgY2FudmFzSGVpZ2h0ICogMC41IC0gY3VycmVudEhlaWdodCAqIDAuNSk7XHJcblxyXG4gICAgbWF4VHJhbnNsYXRlWCA9IE1hdGgubWluKGNhbnZhc1dpZHRoIC0gY3VycmVudFdpZHRoLCBjYW52YXNXaWR0aCAqIDAuNSAtIGN1cnJlbnRXaWR0aCAqIDAuNSk7XHJcbiAgICBtYXhUcmFuc2xhdGVZID0gTWF0aC5taW4oY2FudmFzSGVpZ2h0IC0gY3VycmVudEhlaWdodCwgY2FudmFzSGVpZ2h0ICogMC41IC0gY3VycmVudEhlaWdodCAqIDAuNSk7XHJcblxyXG4gICAgLy8gICAtPlxyXG4gICAgaWYgKGRpc3RhbmNlWCA+IDAgJiYgbmV3T2Zmc2V0WCA+IG1pblRyYW5zbGF0ZVgpIHtcclxuICAgICAgbmV3T2Zmc2V0WCA9IG1pblRyYW5zbGF0ZVggLSAxICsgTWF0aC5wb3coLW1pblRyYW5zbGF0ZVggKyBjdXJyZW50T2Zmc2V0WCArIGRpc3RhbmNlWCwgMC44KSB8fCAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICAgIDwtXHJcbiAgICBpZiAoZGlzdGFuY2VYIDwgMCAmJiBuZXdPZmZzZXRYIDwgbWF4VHJhbnNsYXRlWCkge1xyXG4gICAgICBuZXdPZmZzZXRYID0gbWF4VHJhbnNsYXRlWCArIDEgLSBNYXRoLnBvdyhtYXhUcmFuc2xhdGVYIC0gY3VycmVudE9mZnNldFggLSBkaXN0YW5jZVgsIDAuOCkgfHwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgIFxcL1xyXG4gICAgaWYgKGRpc3RhbmNlWSA+IDAgJiYgbmV3T2Zmc2V0WSA+IG1pblRyYW5zbGF0ZVkpIHtcclxuICAgICAgbmV3T2Zmc2V0WSA9IG1pblRyYW5zbGF0ZVkgLSAxICsgTWF0aC5wb3coLW1pblRyYW5zbGF0ZVkgKyBjdXJyZW50T2Zmc2V0WSArIGRpc3RhbmNlWSwgMC44KSB8fCAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICAgL1xcXHJcbiAgICBpZiAoZGlzdGFuY2VZIDwgMCAmJiBuZXdPZmZzZXRZIDwgbWF4VHJhbnNsYXRlWSkge1xyXG4gICAgICBuZXdPZmZzZXRZID0gbWF4VHJhbnNsYXRlWSArIDEgLSBNYXRoLnBvdyhtYXhUcmFuc2xhdGVZIC0gY3VycmVudE9mZnNldFkgLSBkaXN0YW5jZVksIDAuOCkgfHwgMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3A6IG5ld09mZnNldFksXHJcbiAgICAgIGxlZnQ6IG5ld09mZnNldFhcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5saW1pdFBvc2l0aW9uID0gZnVuY3Rpb24obmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3V2lkdGgsIG5ld0hlaWdodCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBjYW52YXNXaWR0aCA9IHNlbGYuY2FudmFzV2lkdGg7XHJcbiAgICB2YXIgY2FudmFzSGVpZ2h0ID0gc2VsZi5jYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgaWYgKG5ld1dpZHRoID4gY2FudmFzV2lkdGgpIHtcclxuICAgICAgbmV3T2Zmc2V0WCA9IG5ld09mZnNldFggPiAwID8gMCA6IG5ld09mZnNldFg7XHJcbiAgICAgIG5ld09mZnNldFggPSBuZXdPZmZzZXRYIDwgY2FudmFzV2lkdGggLSBuZXdXaWR0aCA/IGNhbnZhc1dpZHRoIC0gbmV3V2lkdGggOiBuZXdPZmZzZXRYO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQ2VudGVyIGhvcml6b250YWxseVxyXG4gICAgICBuZXdPZmZzZXRYID0gTWF0aC5tYXgoMCwgY2FudmFzV2lkdGggLyAyIC0gbmV3V2lkdGggLyAyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobmV3SGVpZ2h0ID4gY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgIG5ld09mZnNldFkgPSBuZXdPZmZzZXRZID4gMCA/IDAgOiBuZXdPZmZzZXRZO1xyXG4gICAgICBuZXdPZmZzZXRZID0gbmV3T2Zmc2V0WSA8IGNhbnZhc0hlaWdodCAtIG5ld0hlaWdodCA/IGNhbnZhc0hlaWdodCAtIG5ld0hlaWdodCA6IG5ld09mZnNldFk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBDZW50ZXIgdmVydGljYWxseVxyXG4gICAgICBuZXdPZmZzZXRZID0gTWF0aC5tYXgoMCwgY2FudmFzSGVpZ2h0IC8gMiAtIG5ld0hlaWdodCAvIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvcDogbmV3T2Zmc2V0WSxcclxuICAgICAgbGVmdDogbmV3T2Zmc2V0WFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9uWm9vbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBjdXJyZW50IGRpc3RhbmNlIGJldHdlZW4gcG9pbnRzIHRvIGdldCBwaW5jaCByYXRpbyBhbmQgbmV3IHdpZHRoIGFuZCBoZWlnaHRcclxuICAgIHZhciBjb250ZW50U3RhcnRQb3MgPSBzZWxmLmNvbnRlbnRTdGFydFBvcztcclxuXHJcbiAgICB2YXIgY3VycmVudFdpZHRoID0gY29udGVudFN0YXJ0UG9zLndpZHRoO1xyXG4gICAgdmFyIGN1cnJlbnRIZWlnaHQgPSBjb250ZW50U3RhcnRQb3MuaGVpZ2h0O1xyXG5cclxuICAgIHZhciBjdXJyZW50T2Zmc2V0WCA9IGNvbnRlbnRTdGFydFBvcy5sZWZ0O1xyXG4gICAgdmFyIGN1cnJlbnRPZmZzZXRZID0gY29udGVudFN0YXJ0UG9zLnRvcDtcclxuXHJcbiAgICB2YXIgZW5kRGlzdGFuY2VCZXR3ZWVuRmluZ2VycyA9IGRpc3RhbmNlKHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLm5ld1BvaW50c1sxXSk7XHJcblxyXG4gICAgdmFyIHBpbmNoUmF0aW8gPSBlbmREaXN0YW5jZUJldHdlZW5GaW5nZXJzIC8gc2VsZi5zdGFydERpc3RhbmNlQmV0d2VlbkZpbmdlcnM7XHJcblxyXG4gICAgdmFyIG5ld1dpZHRoID0gTWF0aC5mbG9vcihjdXJyZW50V2lkdGggKiBwaW5jaFJhdGlvKTtcclxuICAgIHZhciBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKGN1cnJlbnRIZWlnaHQgKiBwaW5jaFJhdGlvKTtcclxuXHJcbiAgICAvLyBUaGlzIGlzIHRoZSB0cmFuc2xhdGlvbiBkdWUgdG8gcGluY2gtem9vbWluZ1xyXG4gICAgdmFyIHRyYW5zbGF0ZUZyb21ab29taW5nWCA9IChjdXJyZW50V2lkdGggLSBuZXdXaWR0aCkgKiBzZWxmLnBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WDtcclxuICAgIHZhciB0cmFuc2xhdGVGcm9tWm9vbWluZ1kgPSAoY3VycmVudEhlaWdodCAtIG5ld0hlaWdodCkgKiBzZWxmLnBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WTtcclxuXHJcbiAgICAvLyBQb2ludCBiZXR3ZWVuIHRoZSB0d28gdG91Y2hlc1xyXG4gICAgdmFyIGNlbnRlclBvaW50RW5kWCA9IChzZWxmLm5ld1BvaW50c1swXS54ICsgc2VsZi5uZXdQb2ludHNbMV0ueCkgLyAyIC0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKTtcclxuICAgIHZhciBjZW50ZXJQb2ludEVuZFkgPSAoc2VsZi5uZXdQb2ludHNbMF0ueSArIHNlbGYubmV3UG9pbnRzWzFdLnkpIC8gMiAtICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAvLyBBbmQgdGhpcyBpcyB0aGUgdHJhbnNsYXRpb24gZHVlIHRvIHRyYW5zbGF0aW9uIG9mIHRoZSBjZW50ZXJwb2ludFxyXG4gICAgLy8gYmV0d2VlbiB0aGUgdHdvIGZpbmdlcnNcclxuICAgIHZhciB0cmFuc2xhdGVGcm9tVHJhbnNsYXRpbmdYID0gY2VudGVyUG9pbnRFbmRYIC0gc2VsZi5jZW50ZXJQb2ludFN0YXJ0WDtcclxuICAgIHZhciB0cmFuc2xhdGVGcm9tVHJhbnNsYXRpbmdZID0gY2VudGVyUG9pbnRFbmRZIC0gc2VsZi5jZW50ZXJQb2ludFN0YXJ0WTtcclxuXHJcbiAgICAvLyBUaGUgbmV3IG9mZnNldCBpcyB0aGUgb2xkL2N1cnJlbnQgb25lIHBsdXMgdGhlIHRvdGFsIHRyYW5zbGF0aW9uXHJcbiAgICB2YXIgbmV3T2Zmc2V0WCA9IGN1cnJlbnRPZmZzZXRYICsgKHRyYW5zbGF0ZUZyb21ab29taW5nWCArIHRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1gpO1xyXG4gICAgdmFyIG5ld09mZnNldFkgPSBjdXJyZW50T2Zmc2V0WSArICh0cmFuc2xhdGVGcm9tWm9vbWluZ1kgKyB0cmFuc2xhdGVGcm9tVHJhbnNsYXRpbmdZKTtcclxuXHJcbiAgICB2YXIgbmV3UG9zID0ge1xyXG4gICAgICB0b3A6IG5ld09mZnNldFksXHJcbiAgICAgIGxlZnQ6IG5ld09mZnNldFgsXHJcbiAgICAgIHNjYWxlWDogcGluY2hSYXRpbyxcclxuICAgICAgc2NhbGVZOiBwaW5jaFJhdGlvXHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuY2FuVGFwID0gZmFsc2U7XHJcblxyXG4gICAgc2VsZi5uZXdXaWR0aCA9IG5ld1dpZHRoO1xyXG4gICAgc2VsZi5uZXdIZWlnaHQgPSBuZXdIZWlnaHQ7XHJcblxyXG4gICAgc2VsZi5jb250ZW50TGFzdFBvcyA9IG5ld1BvcztcclxuXHJcbiAgICBpZiAoc2VsZi5yZXF1ZXN0SWQpIHtcclxuICAgICAgY2FuY2VsQUZyYW1lKHNlbGYucmVxdWVzdElkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnJlcXVlc3RJZCA9IHJlcXVlc3RBRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKHNlbGYuJGNvbnRlbnQsIHNlbGYuY29udGVudExhc3RQb3MpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5vbnRvdWNoZW5kID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBzd2lwaW5nID0gc2VsZi5pc1N3aXBpbmc7XHJcbiAgICB2YXIgcGFubmluZyA9IHNlbGYuaXNQYW5uaW5nO1xyXG4gICAgdmFyIHpvb21pbmcgPSBzZWxmLmlzWm9vbWluZztcclxuICAgIHZhciBzY3JvbGxpbmcgPSBzZWxmLmlzU2Nyb2xsaW5nO1xyXG5cclxuICAgIHNlbGYuZW5kUG9pbnRzID0gZ2V0UG9pbnRlclhZKGUpO1xyXG4gICAgc2VsZi5kTXMgPSBNYXRoLm1heChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHNlbGYuc3RhcnRUaW1lLCAxKTtcclxuXHJcbiAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1ncmFiYmluZ1wiKTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vZmYoXCIuZmIudG91Y2hcIik7XHJcblxyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBzZWxmLm9uc2Nyb2xsLCB0cnVlKTtcclxuXHJcbiAgICBpZiAoc2VsZi5yZXF1ZXN0SWQpIHtcclxuICAgICAgY2FuY2VsQUZyYW1lKHNlbGYucmVxdWVzdElkKTtcclxuXHJcbiAgICAgIHNlbGYucmVxdWVzdElkID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmlzU3dpcGluZyA9IGZhbHNlO1xyXG4gICAgc2VsZi5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICAgIHNlbGYuaXNab29taW5nID0gZmFsc2U7XHJcbiAgICBzZWxmLmlzU2Nyb2xsaW5nID0gZmFsc2U7XHJcblxyXG4gICAgc2VsZi5pbnN0YW5jZS5pc0RyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKHNlbGYuY2FuVGFwKSB7XHJcbiAgICAgIHJldHVybiBzZWxmLm9uVGFwKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuc3BlZWQgPSAxMDA7XHJcblxyXG4gICAgLy8gU3BlZWQgaW4gcHgvbXNcclxuICAgIHNlbGYudmVsb2NpdHlYID0gKHNlbGYuZGlzdGFuY2VYIC8gc2VsZi5kTXMpICogMC41O1xyXG4gICAgc2VsZi52ZWxvY2l0eVkgPSAoc2VsZi5kaXN0YW5jZVkgLyBzZWxmLmRNcykgKiAwLjU7XHJcblxyXG4gICAgaWYgKHBhbm5pbmcpIHtcclxuICAgICAgc2VsZi5lbmRQYW5uaW5nKCk7XHJcbiAgICB9IGVsc2UgaWYgKHpvb21pbmcpIHtcclxuICAgICAgc2VsZi5lbmRab29taW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmLmVuZFN3aXBpbmcoc3dpcGluZywgc2Nyb2xsaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbiAgfTtcclxuXHJcbiAgR3Vlc3R1cmVzLnByb3RvdHlwZS5lbmRTd2lwaW5nID0gZnVuY3Rpb24oc3dpcGluZywgc2Nyb2xsaW5nKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIHJldCA9IGZhbHNlLFxyXG4gICAgICBsZW4gPSBzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCxcclxuICAgICAgZGlzdGFuY2VYID0gTWF0aC5hYnMoc2VsZi5kaXN0YW5jZVgpLFxyXG4gICAgICBjYW5BZHZhbmNlID0gc3dpcGluZyA9PSBcInhcIiAmJiBsZW4gPiAxICYmICgoc2VsZi5kTXMgPiAxMzAgJiYgZGlzdGFuY2VYID4gMTApIHx8IGRpc3RhbmNlWCA+IDUwKSxcclxuICAgICAgc3BlZWRYID0gMzAwO1xyXG5cclxuICAgIHNlbGYuc2xpZGVyTGFzdFBvcyA9IG51bGw7XHJcblxyXG4gICAgLy8gQ2xvc2UgaWYgc3dpcGVkIHZlcnRpY2FsbHkgLyBuYXZpZ2F0ZSBpZiBob3Jpem9udGFsbHlcclxuICAgIGlmIChzd2lwaW5nID09IFwieVwiICYmICFzY3JvbGxpbmcgJiYgTWF0aC5hYnMoc2VsZi5kaXN0YW5jZVkpID4gNTApIHtcclxuICAgICAgLy8gQ29udGludWUgdmVydGljYWwgbW92ZW1lbnRcclxuICAgICAgJC5mYW5jeWJveC5hbmltYXRlKFxyXG4gICAgICAgIHNlbGYuaW5zdGFuY2UuY3VycmVudC4kc2xpZGUsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdG9wOiBzZWxmLnNsaWRlclN0YXJ0UG9zLnRvcCArIHNlbGYuZGlzdGFuY2VZICsgc2VsZi52ZWxvY2l0eVkgKiAxNTAsXHJcbiAgICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICAyMDBcclxuICAgICAgKTtcclxuICAgICAgcmV0ID0gc2VsZi5pbnN0YW5jZS5jbG9zZSh0cnVlLCAyNTApO1xyXG4gICAgfSBlbHNlIGlmIChjYW5BZHZhbmNlICYmIHNlbGYuZGlzdGFuY2VYID4gMCkge1xyXG4gICAgICByZXQgPSBzZWxmLmluc3RhbmNlLnByZXZpb3VzKHNwZWVkWCk7XHJcbiAgICB9IGVsc2UgaWYgKGNhbkFkdmFuY2UgJiYgc2VsZi5kaXN0YW5jZVggPCAwKSB7XHJcbiAgICAgIHJldCA9IHNlbGYuaW5zdGFuY2UubmV4dChzcGVlZFgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXQgPT09IGZhbHNlICYmIChzd2lwaW5nID09IFwieFwiIHx8IHN3aXBpbmcgPT0gXCJ5XCIpKSB7XHJcbiAgICAgIHNlbGYuaW5zdGFuY2UuY2VudGVyU2xpZGUoMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1pcy1zbGlkaW5nXCIpO1xyXG4gIH07XHJcblxyXG4gIC8vIExpbWl0IHBhbm5pbmcgZnJvbSBlZGdlc1xyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIEd1ZXN0dXJlcy5wcm90b3R5cGUuZW5kUGFubmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBuZXdPZmZzZXRYLFxyXG4gICAgICBuZXdPZmZzZXRZLFxyXG4gICAgICBuZXdQb3M7XHJcblxyXG4gICAgaWYgKCFzZWxmLmNvbnRlbnRMYXN0UG9zKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5vcHRzLm1vbWVudHVtID09PSBmYWxzZSB8fCBzZWxmLmRNcyA+IDM1MCkge1xyXG4gICAgICBuZXdPZmZzZXRYID0gc2VsZi5jb250ZW50TGFzdFBvcy5sZWZ0O1xyXG4gICAgICBuZXdPZmZzZXRZID0gc2VsZi5jb250ZW50TGFzdFBvcy50b3A7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBDb250aW51ZSBtb3ZlbWVudFxyXG4gICAgICBuZXdPZmZzZXRYID0gc2VsZi5jb250ZW50TGFzdFBvcy5sZWZ0ICsgc2VsZi52ZWxvY2l0eVggKiA1MDA7XHJcbiAgICAgIG5ld09mZnNldFkgPSBzZWxmLmNvbnRlbnRMYXN0UG9zLnRvcCArIHNlbGYudmVsb2NpdHlZICogNTAwO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld1BvcyA9IHNlbGYubGltaXRQb3NpdGlvbihuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aCwgc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0KTtcclxuXHJcbiAgICBuZXdQb3Mud2lkdGggPSBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuICAgIG5ld1Bvcy5oZWlnaHQgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy5oZWlnaHQ7XHJcblxyXG4gICAgJC5mYW5jeWJveC5hbmltYXRlKHNlbGYuJGNvbnRlbnQsIG5ld1BvcywgMzY2KTtcclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLmVuZFpvb21pbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgY3VycmVudCA9IHNlbGYuaW5zdGFuY2UuY3VycmVudDtcclxuXHJcbiAgICB2YXIgbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3UG9zLCByZXNldDtcclxuXHJcbiAgICB2YXIgbmV3V2lkdGggPSBzZWxmLm5ld1dpZHRoO1xyXG4gICAgdmFyIG5ld0hlaWdodCA9IHNlbGYubmV3SGVpZ2h0O1xyXG5cclxuICAgIGlmICghc2VsZi5jb250ZW50TGFzdFBvcykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudExhc3RQb3MubGVmdDtcclxuICAgIG5ld09mZnNldFkgPSBzZWxmLmNvbnRlbnRMYXN0UG9zLnRvcDtcclxuXHJcbiAgICByZXNldCA9IHtcclxuICAgICAgdG9wOiBuZXdPZmZzZXRZLFxyXG4gICAgICBsZWZ0OiBuZXdPZmZzZXRYLFxyXG4gICAgICB3aWR0aDogbmV3V2lkdGgsXHJcbiAgICAgIGhlaWdodDogbmV3SGVpZ2h0LFxyXG4gICAgICBzY2FsZVg6IDEsXHJcbiAgICAgIHNjYWxlWTogMVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZXNldCBzY2FsZXgvc2NhbGVZIHZhbHVlczsgdGhpcyBoZWxwcyBmb3IgcGVyZm9tYW5jZSBhbmQgZG9lcyBub3QgYnJlYWsgYW5pbWF0aW9uXHJcbiAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZShzZWxmLiRjb250ZW50LCByZXNldCk7XHJcblxyXG4gICAgaWYgKG5ld1dpZHRoIDwgc2VsZi5jYW52YXNXaWR0aCAmJiBuZXdIZWlnaHQgPCBzZWxmLmNhbnZhc0hlaWdodCkge1xyXG4gICAgICBzZWxmLmluc3RhbmNlLnNjYWxlVG9GaXQoMTUwKTtcclxuICAgIH0gZWxzZSBpZiAobmV3V2lkdGggPiBjdXJyZW50LndpZHRoIHx8IG5ld0hlaWdodCA+IGN1cnJlbnQuaGVpZ2h0KSB7XHJcbiAgICAgIHNlbGYuaW5zdGFuY2Uuc2NhbGVUb0FjdHVhbChzZWxmLmNlbnRlclBvaW50U3RhcnRYLCBzZWxmLmNlbnRlclBvaW50U3RhcnRZLCAxNTApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3UG9zID0gc2VsZi5saW1pdFBvc2l0aW9uKG5ld09mZnNldFgsIG5ld09mZnNldFksIG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xyXG5cclxuICAgICAgJC5mYW5jeWJveC5hbmltYXRlKHNlbGYuJGNvbnRlbnQsIG5ld1BvcywgMTUwKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBHdWVzdHVyZXMucHJvdG90eXBlLm9uVGFwID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuXHJcbiAgICB2YXIgaW5zdGFuY2UgPSBzZWxmLmluc3RhbmNlO1xyXG4gICAgdmFyIGN1cnJlbnQgPSBpbnN0YW5jZS5jdXJyZW50O1xyXG5cclxuICAgIHZhciBlbmRQb2ludHMgPSAoZSAmJiBnZXRQb2ludGVyWFkoZSkpIHx8IHNlbGYuc3RhcnRQb2ludHM7XHJcblxyXG4gICAgdmFyIHRhcFggPSBlbmRQb2ludHNbMF0gPyBlbmRQb2ludHNbMF0ueCAtICQod2luZG93KS5zY3JvbGxMZWZ0KCkgLSBzZWxmLnN0YWdlUG9zLmxlZnQgOiAwO1xyXG4gICAgdmFyIHRhcFkgPSBlbmRQb2ludHNbMF0gPyBlbmRQb2ludHNbMF0ueSAtICQod2luZG93KS5zY3JvbGxUb3AoKSAtIHNlbGYuc3RhZ2VQb3MudG9wIDogMDtcclxuXHJcbiAgICB2YXIgd2hlcmU7XHJcblxyXG4gICAgdmFyIHByb2Nlc3MgPSBmdW5jdGlvbihwcmVmaXgpIHtcclxuICAgICAgdmFyIGFjdGlvbiA9IGN1cnJlbnQub3B0c1twcmVmaXhdO1xyXG5cclxuICAgICAgaWYgKCQuaXNGdW5jdGlvbihhY3Rpb24pKSB7XHJcbiAgICAgICAgYWN0aW9uID0gYWN0aW9uLmFwcGx5KGluc3RhbmNlLCBbY3VycmVudCwgZV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWFjdGlvbikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChhY3Rpb24pIHtcclxuICAgICAgICBjYXNlIFwiY2xvc2VcIjpcclxuICAgICAgICAgIGluc3RhbmNlLmNsb3NlKHNlbGYuc3RhcnRFdmVudCk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJ0b2dnbGVDb250cm9sc1wiOlxyXG4gICAgICAgICAgaW5zdGFuY2UudG9nZ2xlQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcIm5leHRcIjpcclxuICAgICAgICAgIGluc3RhbmNlLm5leHQoKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcIm5leHRPckNsb3NlXCI6XHJcbiAgICAgICAgICBpZiAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5uZXh0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5jbG9zZShzZWxmLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwiem9vbVwiOlxyXG4gICAgICAgICAgaWYgKGN1cnJlbnQudHlwZSA9PSBcImltYWdlXCIgJiYgKGN1cnJlbnQuaXNMb2FkZWQgfHwgY3VycmVudC4kZ2hvc3QpKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5jYW5QYW4oKSkge1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnNjYWxlVG9GaXQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZS5pc1NjYWxlZERvd24oKSkge1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnNjYWxlVG9BY3R1YWwodGFwWCwgdGFwWSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLmNsb3NlKHNlbGYuc3RhcnRFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBJZ25vcmUgcmlnaHQgY2xpY2tcclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmJ1dHRvbiA9PSAyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTa2lwIGlmIGNsaWNrZWQgb24gdGhlIHNjcm9sbGJhclxyXG4gICAgaWYgKCEkdGFyZ2V0LmlzKFwiaW1nXCIpICYmIHRhcFggPiAkdGFyZ2V0WzBdLmNsaWVudFdpZHRoICsgJHRhcmdldC5vZmZzZXQoKS5sZWZ0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayB3aGVyZSBpcyBjbGlja2VkXHJcbiAgICBpZiAoJHRhcmdldC5pcyhcIi5mYW5jeWJveC1iZywuZmFuY3lib3gtaW5uZXIsLmZhbmN5Ym94LW91dGVyLC5mYW5jeWJveC1jb250YWluZXJcIikpIHtcclxuICAgICAgd2hlcmUgPSBcIk91dHNpZGVcIjtcclxuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5pcyhcIi5mYW5jeWJveC1zbGlkZVwiKSkge1xyXG4gICAgICB3aGVyZSA9IFwiU2xpZGVcIjtcclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIGluc3RhbmNlLmN1cnJlbnQuJGNvbnRlbnQgJiZcclxuICAgICAgaW5zdGFuY2UuY3VycmVudC4kY29udGVudFxyXG4gICAgICAgIC5maW5kKCR0YXJnZXQpXHJcbiAgICAgICAgLmFkZEJhY2soKVxyXG4gICAgICAgIC5maWx0ZXIoJHRhcmdldCkubGVuZ3RoXHJcbiAgICApIHtcclxuICAgICAgd2hlcmUgPSBcIkNvbnRlbnRcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGlzIGlzIGEgZG91YmxlIHRhcFxyXG4gICAgaWYgKHNlbGYudGFwcGVkKSB7XHJcbiAgICAgIC8vIFN0b3AgcHJldmlvdXNseSBjcmVhdGVkIHNpbmdsZSB0YXBcclxuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGFwcGVkKTtcclxuICAgICAgc2VsZi50YXBwZWQgPSBudWxsO1xyXG5cclxuICAgICAgLy8gU2tpcCBpZiBkaXN0YW5jZSBiZXR3ZWVuIHRhcHMgaXMgdG9vIGJpZ1xyXG4gICAgICBpZiAoTWF0aC5hYnModGFwWCAtIHNlbGYudGFwWCkgPiA1MCB8fCBNYXRoLmFicyh0YXBZIC0gc2VsZi50YXBZKSA+IDUwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE9LLCBub3cgd2UgYXNzdW1lIHRoYXQgdGhpcyBpcyBhIGRvdWJsZS10YXBcclxuICAgICAgcHJvY2VzcyhcImRibGNsaWNrXCIgKyB3aGVyZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBTaW5nbGUgdGFwIHdpbGwgYmUgcHJvY2Vzc2VkIGlmIHVzZXIgaGFzIG5vdCBjbGlja2VkIHNlY29uZCB0aW1lIHdpdGhpbiAzMDBtc1xyXG4gICAgICAvLyBvciB0aGVyZSBpcyBubyBuZWVkIHRvIHdhaXQgZm9yIGRvdWJsZS10YXBcclxuICAgICAgc2VsZi50YXBYID0gdGFwWDtcclxuICAgICAgc2VsZi50YXBZID0gdGFwWTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50Lm9wdHNbXCJkYmxjbGlja1wiICsgd2hlcmVdICYmIGN1cnJlbnQub3B0c1tcImRibGNsaWNrXCIgKyB3aGVyZV0gIT09IGN1cnJlbnQub3B0c1tcImNsaWNrXCIgKyB3aGVyZV0pIHtcclxuICAgICAgICBzZWxmLnRhcHBlZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzZWxmLnRhcHBlZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgaWYgKCFpbnN0YW5jZS5pc0FuaW1hdGluZykge1xyXG4gICAgICAgICAgICBwcm9jZXNzKFwiY2xpY2tcIiArIHdoZXJlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByb2Nlc3MoXCJjbGlja1wiICsgd2hlcmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgJChkb2N1bWVudClcclxuICAgIC5vbihcIm9uQWN0aXZhdGUuZmJcIiwgZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuICAgICAgaWYgKGluc3RhbmNlICYmICFpbnN0YW5jZS5HdWVzdHVyZXMpIHtcclxuICAgICAgICBpbnN0YW5jZS5HdWVzdHVyZXMgPSBuZXcgR3Vlc3R1cmVzKGluc3RhbmNlKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5vbihcImJlZm9yZUNsb3NlLmZiXCIsIGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcbiAgICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS5HdWVzdHVyZXMpIHtcclxuICAgICAgICBpbnN0YW5jZS5HdWVzdHVyZXMuZGVzdHJveSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxufSkod2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KTtcclxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vL1xyXG4vLyBTbGlkZVNob3dcclxuLy8gRW5hYmxlcyBzbGlkZXNob3cgZnVuY3Rpb25hbGl0eVxyXG4vL1xyXG4vLyBFeGFtcGxlIG9mIHVzYWdlOlxyXG4vLyAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCkuU2xpZGVTaG93LnN0YXJ0KClcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKGRvY3VtZW50LCAkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICQuZXh0ZW5kKHRydWUsICQuZmFuY3lib3guZGVmYXVsdHMsIHtcclxuICAgIGJ0blRwbDoge1xyXG4gICAgICBzbGlkZVNob3c6XHJcbiAgICAgICAgJzxidXR0b24gZGF0YS1mYW5jeWJveC1wbGF5IGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tcGxheVwiIHRpdGxlPVwie3tQTEFZX1NUQVJUfX1cIj4nICtcclxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNNi41IDUuNHYxMy4ybDExLTYuNnpcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTguMzMgNS43NWgyLjJ2MTIuNWgtMi4yVjUuNzV6bTUuMTUgMGgyLjJ2MTIuNWgtMi4yVjUuNzV6XCIvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPC9idXR0b24+XCJcclxuICAgIH0sXHJcbiAgICBzbGlkZVNob3c6IHtcclxuICAgICAgYXV0b1N0YXJ0OiBmYWxzZSxcclxuICAgICAgc3BlZWQ6IDMwMDAsXHJcbiAgICAgIHByb2dyZXNzOiB0cnVlXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHZhciBTbGlkZVNob3cgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfTtcclxuXHJcbiAgJC5leHRlbmQoU2xpZGVTaG93LnByb3RvdHlwZSwge1xyXG4gICAgdGltZXI6IG51bGwsXHJcbiAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAkYnV0dG9uOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgaW5zdGFuY2UgPSBzZWxmLmluc3RhbmNlLFxyXG4gICAgICAgIG9wdHMgPSBpbnN0YW5jZS5ncm91cFtpbnN0YW5jZS5jdXJySW5kZXhdLm9wdHMuc2xpZGVTaG93O1xyXG5cclxuICAgICAgc2VsZi4kYnV0dG9uID0gaW5zdGFuY2UuJHJlZnMudG9vbGJhci5maW5kKFwiW2RhdGEtZmFuY3lib3gtcGxheV1cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnRvZ2dsZSgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChpbnN0YW5jZS5ncm91cC5sZW5ndGggPCAyIHx8ICFvcHRzKSB7XHJcbiAgICAgICAgc2VsZi4kYnV0dG9uLmhpZGUoKTtcclxuICAgICAgfSBlbHNlIGlmIChvcHRzLnByb2dyZXNzKSB7XHJcbiAgICAgICAgc2VsZi4kcHJvZ3Jlc3MgPSAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtcHJvZ3Jlc3NcIj48L2Rpdj4nKS5hcHBlbmRUbyhpbnN0YW5jZS4kcmVmcy5pbm5lcik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2V0OiBmdW5jdGlvbihmb3JjZSkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgaW5zdGFuY2UgPSBzZWxmLmluc3RhbmNlLFxyXG4gICAgICAgIGN1cnJlbnQgPSBpbnN0YW5jZS5jdXJyZW50O1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgcmVhY2hlZCBsYXN0IGVsZW1lbnRcclxuICAgICAgaWYgKGN1cnJlbnQgJiYgKGZvcmNlID09PSB0cnVlIHx8IGN1cnJlbnQub3B0cy5sb29wIHx8IGluc3RhbmNlLmN1cnJJbmRleCA8IGluc3RhbmNlLmdyb3VwLmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgaWYgKHNlbGYuaXNBY3RpdmUgJiYgY3VycmVudC5jb250ZW50VHlwZSAhPT0gXCJ2aWRlb1wiKSB7XHJcbiAgICAgICAgICBpZiAoc2VsZi4kcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKHNlbGYuJHByb2dyZXNzLnNob3coKSwge3NjYWxlWDogMX0sIGN1cnJlbnQub3B0cy5zbGlkZVNob3cuc3BlZWQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNlbGYudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlLmN1cnJlbnQub3B0cy5sb29wICYmIGluc3RhbmNlLmN1cnJlbnQuaW5kZXggPT0gaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLmp1bXBUbygwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIGN1cnJlbnQub3B0cy5zbGlkZVNob3cuc3BlZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmLnN0b3AoKTtcclxuICAgICAgICBpbnN0YW5jZS5pZGxlU2Vjb25kc0NvdW50ZXIgPSAwO1xyXG4gICAgICAgIGluc3RhbmNlLnNob3dDb250cm9scygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZXIpO1xyXG5cclxuICAgICAgc2VsZi50aW1lciA9IG51bGw7XHJcblxyXG4gICAgICBpZiAoc2VsZi4kcHJvZ3Jlc3MpIHtcclxuICAgICAgICBzZWxmLiRwcm9ncmVzcy5yZW1vdmVBdHRyKFwic3R5bGVcIikuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGN1cnJlbnQgPSBzZWxmLmluc3RhbmNlLmN1cnJlbnQ7XHJcblxyXG4gICAgICBpZiAoY3VycmVudCkge1xyXG4gICAgICAgIHNlbGYuJGJ1dHRvblxyXG4gICAgICAgICAgLmF0dHIoXCJ0aXRsZVwiLCAoY3VycmVudC5vcHRzLmkxOG5bY3VycmVudC5vcHRzLmxhbmddIHx8IGN1cnJlbnQub3B0cy5pMThuLmVuKS5QTEFZX1NUT1ApXHJcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1idXR0b24tLXBsYXlcIilcclxuICAgICAgICAgIC5hZGRDbGFzcyhcImZhbmN5Ym94LWJ1dHRvbi0tcGF1c2VcIik7XHJcblxyXG4gICAgICAgIHNlbGYuaXNBY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudC5pc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICBzZWxmLnNldCh0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuaW5zdGFuY2UudHJpZ2dlcihcIm9uU2xpZGVTaG93Q2hhbmdlXCIsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VycmVudCA9IHNlbGYuaW5zdGFuY2UuY3VycmVudDtcclxuXHJcbiAgICAgIHNlbGYuY2xlYXIoKTtcclxuXHJcbiAgICAgIHNlbGYuJGJ1dHRvblxyXG4gICAgICAgIC5hdHRyKFwidGl0bGVcIiwgKGN1cnJlbnQub3B0cy5pMThuW2N1cnJlbnQub3B0cy5sYW5nXSB8fCBjdXJyZW50Lm9wdHMuaTE4bi5lbikuUExBWV9TVEFSVClcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYW5jeWJveC1idXR0b24tLXBhdXNlXCIpXHJcbiAgICAgICAgLmFkZENsYXNzKFwiZmFuY3lib3gtYnV0dG9uLS1wbGF5XCIpO1xyXG5cclxuICAgICAgc2VsZi5pc0FjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgc2VsZi5pbnN0YW5jZS50cmlnZ2VyKFwib25TbGlkZVNob3dDaGFuZ2VcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKHNlbGYuJHByb2dyZXNzKSB7XHJcbiAgICAgICAgc2VsZi4kcHJvZ3Jlc3MucmVtb3ZlQXR0cihcInN0eWxlXCIpLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc0FjdGl2ZSkge1xyXG4gICAgICAgIHNlbGYuc3RvcCgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYuc3RhcnQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKGRvY3VtZW50KS5vbih7XHJcbiAgICBcIm9uSW5pdC5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICBpZiAoaW5zdGFuY2UgJiYgIWluc3RhbmNlLlNsaWRlU2hvdykge1xyXG4gICAgICAgIGluc3RhbmNlLlNsaWRlU2hvdyA9IG5ldyBTbGlkZVNob3coaW5zdGFuY2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFwiYmVmb3JlU2hvdy5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCwgZmlyc3RSdW4pIHtcclxuICAgICAgdmFyIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcbiAgICAgIGlmIChmaXJzdFJ1bikge1xyXG4gICAgICAgIGlmIChTbGlkZVNob3cgJiYgY3VycmVudC5vcHRzLnNsaWRlU2hvdy5hdXRvU3RhcnQpIHtcclxuICAgICAgICAgIFNsaWRlU2hvdy5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChTbGlkZVNob3cgJiYgU2xpZGVTaG93LmlzQWN0aXZlKSB7XHJcbiAgICAgICAgU2xpZGVTaG93LmNsZWFyKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgXCJhZnRlclNob3cuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQpIHtcclxuICAgICAgdmFyIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcbiAgICAgIGlmIChTbGlkZVNob3cgJiYgU2xpZGVTaG93LmlzQWN0aXZlKSB7XHJcbiAgICAgICAgU2xpZGVTaG93LnNldCgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFwiYWZ0ZXJLZXlkb3duLmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50LCBrZXlwcmVzcywga2V5Y29kZSkge1xyXG4gICAgICB2YXIgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuICAgICAgLy8gXCJQXCIgb3IgU3BhY2ViYXJcclxuICAgICAgaWYgKFNsaWRlU2hvdyAmJiBjdXJyZW50Lm9wdHMuc2xpZGVTaG93ICYmIChrZXljb2RlID09PSA4MCB8fCBrZXljb2RlID09PSAzMikgJiYgISQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoXCJidXR0b24sYSxpbnB1dFwiKSkge1xyXG4gICAgICAgIGtleXByZXNzLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIFNsaWRlU2hvdy50b2dnbGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImJlZm9yZUNsb3NlLmZiIG9uRGVhY3RpdmF0ZS5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICB2YXIgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuICAgICAgaWYgKFNsaWRlU2hvdykge1xyXG4gICAgICAgIFNsaWRlU2hvdy5zdG9wKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gUGFnZSBWaXNpYmlsaXR5IEFQSSB0byBwYXVzZSBzbGlkZXNob3cgd2hlbiB3aW5kb3cgaXMgbm90IGFjdGl2ZVxyXG4gICQoZG9jdW1lbnQpLm9uKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpbnN0YW5jZSA9ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSxcclxuICAgICAgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuICAgIGlmIChTbGlkZVNob3cgJiYgU2xpZGVTaG93LmlzQWN0aXZlKSB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcclxuICAgICAgICBTbGlkZVNob3cuY2xlYXIoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBTbGlkZVNob3cuc2V0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufSkoZG9jdW1lbnQsIGpRdWVyeSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gRnVsbFNjcmVlblxyXG4vLyBBZGRzIGZ1bGxzY3JlZW4gZnVuY3Rpb25hbGl0eVxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4oZnVuY3Rpb24oZG9jdW1lbnQsICQpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgLy8gQ29sbGVjdGlvbiBvZiBtZXRob2RzIHN1cHBvcnRlZCBieSB1c2VyIGJyb3dzZXJcclxuICB2YXIgZm4gPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZm5NYXAgPSBbXHJcbiAgICAgIFtcInJlcXVlc3RGdWxsc2NyZWVuXCIsIFwiZXhpdEZ1bGxzY3JlZW5cIiwgXCJmdWxsc2NyZWVuRWxlbWVudFwiLCBcImZ1bGxzY3JlZW5FbmFibGVkXCIsIFwiZnVsbHNjcmVlbmNoYW5nZVwiLCBcImZ1bGxzY3JlZW5lcnJvclwiXSxcclxuICAgICAgLy8gbmV3IFdlYktpdFxyXG4gICAgICBbXHJcbiAgICAgICAgXCJ3ZWJraXRSZXF1ZXN0RnVsbHNjcmVlblwiLFxyXG4gICAgICAgIFwid2Via2l0RXhpdEZ1bGxzY3JlZW5cIixcclxuICAgICAgICBcIndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50XCIsXHJcbiAgICAgICAgXCJ3ZWJraXRGdWxsc2NyZWVuRW5hYmxlZFwiLFxyXG4gICAgICAgIFwid2Via2l0ZnVsbHNjcmVlbmNoYW5nZVwiLFxyXG4gICAgICAgIFwid2Via2l0ZnVsbHNjcmVlbmVycm9yXCJcclxuICAgICAgXSxcclxuICAgICAgLy8gb2xkIFdlYktpdCAoU2FmYXJpIDUuMSlcclxuICAgICAgW1xyXG4gICAgICAgIFwid2Via2l0UmVxdWVzdEZ1bGxTY3JlZW5cIixcclxuICAgICAgICBcIndlYmtpdENhbmNlbEZ1bGxTY3JlZW5cIixcclxuICAgICAgICBcIndlYmtpdEN1cnJlbnRGdWxsU2NyZWVuRWxlbWVudFwiLFxyXG4gICAgICAgIFwid2Via2l0Q2FuY2VsRnVsbFNjcmVlblwiLFxyXG4gICAgICAgIFwid2Via2l0ZnVsbHNjcmVlbmNoYW5nZVwiLFxyXG4gICAgICAgIFwid2Via2l0ZnVsbHNjcmVlbmVycm9yXCJcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwibW96UmVxdWVzdEZ1bGxTY3JlZW5cIixcclxuICAgICAgICBcIm1vekNhbmNlbEZ1bGxTY3JlZW5cIixcclxuICAgICAgICBcIm1vekZ1bGxTY3JlZW5FbGVtZW50XCIsXHJcbiAgICAgICAgXCJtb3pGdWxsU2NyZWVuRW5hYmxlZFwiLFxyXG4gICAgICAgIFwibW96ZnVsbHNjcmVlbmNoYW5nZVwiLFxyXG4gICAgICAgIFwibW96ZnVsbHNjcmVlbmVycm9yXCJcclxuICAgICAgXSxcclxuICAgICAgW1wibXNSZXF1ZXN0RnVsbHNjcmVlblwiLCBcIm1zRXhpdEZ1bGxzY3JlZW5cIiwgXCJtc0Z1bGxzY3JlZW5FbGVtZW50XCIsIFwibXNGdWxsc2NyZWVuRW5hYmxlZFwiLCBcIk1TRnVsbHNjcmVlbkNoYW5nZVwiLCBcIk1TRnVsbHNjcmVlbkVycm9yXCJdXHJcbiAgICBdO1xyXG5cclxuICAgIHZhciByZXQgPSB7fTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZuTWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciB2YWwgPSBmbk1hcFtpXTtcclxuXHJcbiAgICAgIGlmICh2YWwgJiYgdmFsWzFdIGluIGRvY3VtZW50KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWwubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIHJldFtmbk1hcFswXVtqXV0gPSB2YWxbal07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pKCk7XHJcblxyXG4gIGlmIChmbikge1xyXG4gICAgdmFyIEZ1bGxTY3JlZW4gPSB7XHJcbiAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGVsZW0pIHtcclxuICAgICAgICBlbGVtID0gZWxlbSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGVsZW1bZm4ucmVxdWVzdEZ1bGxzY3JlZW5dKGVsZW0uQUxMT1dfS0VZQk9BUkRfSU5QVVQpO1xyXG4gICAgICB9LFxyXG4gICAgICBleGl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBkb2N1bWVudFtmbi5leGl0RnVsbHNjcmVlbl0oKTtcclxuICAgICAgfSxcclxuICAgICAgdG9nZ2xlOiBmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgZWxlbSA9IGVsZW0gfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0Z1bGxzY3JlZW4oKSkge1xyXG4gICAgICAgICAgdGhpcy5leGl0KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVxdWVzdChlbGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGlzRnVsbHNjcmVlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oZG9jdW1lbnRbZm4uZnVsbHNjcmVlbkVsZW1lbnRdKTtcclxuICAgICAgfSxcclxuICAgICAgZW5hYmxlZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oZG9jdW1lbnRbZm4uZnVsbHNjcmVlbkVuYWJsZWRdKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkLmV4dGVuZCh0cnVlLCAkLmZhbmN5Ym94LmRlZmF1bHRzLCB7XHJcbiAgICAgIGJ0blRwbDoge1xyXG4gICAgICAgIGZ1bGxTY3JlZW46XHJcbiAgICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mc2VudGVyXCIgdGl0bGU9XCJ7e0ZVTExfU0NSRUVOfX1cIj4nICtcclxuICAgICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk03IDE0SDV2NWg1di0ySDd2LTN6bS0yLTRoMlY3aDNWNUg1djV6bTEyIDdoLTN2Mmg1di01aC0ydjN6TTE0IDV2MmgzdjNoMlY1aC01elwiLz48L3N2Zz4nICtcclxuICAgICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk01IDE2aDN2M2gydi01SDV6bTMtOEg1djJoNVY1SDh6bTYgMTFoMnYtM2gzdi0yaC01em0yLTExVjVoLTJ2NWg1Vjh6XCIvPjwvc3ZnPicgK1xyXG4gICAgICAgICAgXCI8L2J1dHRvbj5cIlxyXG4gICAgICB9LFxyXG4gICAgICBmdWxsU2NyZWVuOiB7XHJcbiAgICAgICAgYXV0b1N0YXJ0OiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbihmbi5mdWxsc2NyZWVuY2hhbmdlLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGlzRnVsbHNjcmVlbiA9IEZ1bGxTY3JlZW4uaXNGdWxsc2NyZWVuKCksXHJcbiAgICAgICAgaW5zdGFuY2UgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCk7XHJcblxyXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAvLyBJZiBpbWFnZSBpcyB6b29taW5nLCB0aGVuIGZvcmNlIHRvIHN0b3AgYW5kIHJlcG9zaXRpb24gcHJvcGVybHlcclxuICAgICAgICBpZiAoaW5zdGFuY2UuY3VycmVudCAmJiBpbnN0YW5jZS5jdXJyZW50LnR5cGUgPT09IFwiaW1hZ2VcIiAmJiBpbnN0YW5jZS5pc0FuaW1hdGluZykge1xyXG4gICAgICAgICAgaW5zdGFuY2UuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBpbnN0YW5jZS51cGRhdGUodHJ1ZSwgdHJ1ZSwgMCk7XHJcblxyXG4gICAgICAgICAgaWYgKCFpbnN0YW5jZS5pc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZS50cmlnZ2VyKFwib25GdWxsc2NyZWVuQ2hhbmdlXCIsIGlzRnVsbHNjcmVlbik7XHJcblxyXG4gICAgICAgIGluc3RhbmNlLiRyZWZzLmNvbnRhaW5lci50b2dnbGVDbGFzcyhcImZhbmN5Ym94LWlzLWZ1bGxzY3JlZW5cIiwgaXNGdWxsc2NyZWVuKTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2UuJHJlZnMudG9vbGJhclxyXG4gICAgICAgICAgLmZpbmQoXCJbZGF0YS1mYW5jeWJveC1mdWxsc2NyZWVuXVwiKVxyXG4gICAgICAgICAgLnRvZ2dsZUNsYXNzKFwiZmFuY3lib3gtYnV0dG9uLS1mc2VudGVyXCIsICFpc0Z1bGxzY3JlZW4pXHJcbiAgICAgICAgICAudG9nZ2xlQ2xhc3MoXCJmYW5jeWJveC1idXR0b24tLWZzZXhpdFwiLCBpc0Z1bGxzY3JlZW4pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKHtcclxuICAgIFwib25Jbml0LmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcbiAgICAgIHZhciAkY29udGFpbmVyO1xyXG5cclxuICAgICAgaWYgKCFmbikge1xyXG4gICAgICAgIGluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZChcIltkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW5dXCIpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS5ncm91cFtpbnN0YW5jZS5jdXJySW5kZXhdLm9wdHMuZnVsbFNjcmVlbikge1xyXG4gICAgICAgICRjb250YWluZXIgPSBpbnN0YW5jZS4kcmVmcy5jb250YWluZXI7XHJcblxyXG4gICAgICAgICRjb250YWluZXIub24oXCJjbGljay5mYi1mdWxsc2NyZWVuXCIsIFwiW2RhdGEtZmFuY3lib3gtZnVsbHNjcmVlbl1cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBGdWxsU2NyZWVuLnRvZ2dsZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2Uub3B0cy5mdWxsU2NyZWVuICYmIGluc3RhbmNlLm9wdHMuZnVsbFNjcmVlbi5hdXRvU3RhcnQgPT09IHRydWUpIHtcclxuICAgICAgICAgIEZ1bGxTY3JlZW4ucmVxdWVzdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRXhwb3NlIEFQSVxyXG4gICAgICAgIGluc3RhbmNlLkZ1bGxTY3JlZW4gPSBGdWxsU2NyZWVuO1xyXG4gICAgICB9IGVsc2UgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgaW5zdGFuY2UuJHJlZnMudG9vbGJhci5maW5kKFwiW2RhdGEtZmFuY3lib3gtZnVsbHNjcmVlbl1cIikuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFwiYWZ0ZXJLZXlkb3duLmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50LCBrZXlwcmVzcywga2V5Y29kZSkge1xyXG4gICAgICAvLyBcIkZcIlxyXG4gICAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuRnVsbFNjcmVlbiAmJiBrZXljb2RlID09PSA3MCkge1xyXG4gICAgICAgIGtleXByZXNzLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGluc3RhbmNlLkZ1bGxTY3JlZW4udG9nZ2xlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgXCJiZWZvcmVDbG9zZS5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuRnVsbFNjcmVlbiAmJiBpbnN0YW5jZS4kcmVmcy5jb250YWluZXIuaGFzQ2xhc3MoXCJmYW5jeWJveC1pcy1mdWxsc2NyZWVuXCIpKSB7XHJcbiAgICAgICAgRnVsbFNjcmVlbi5leGl0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufSkoZG9jdW1lbnQsIGpRdWVyeSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gVGh1bWJzXHJcbi8vIERpc3BsYXlzIHRodW1ibmFpbHMgaW4gYSBncmlkXHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbihmdW5jdGlvbihkb2N1bWVudCwgJCkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICB2YXIgQ0xBU1MgPSBcImZhbmN5Ym94LXRodW1ic1wiLFxyXG4gICAgQ0xBU1NfQUNUSVZFID0gQ0xBU1MgKyBcIi1hY3RpdmVcIjtcclxuXHJcbiAgLy8gTWFrZSBzdXJlIHRoZXJlIGFyZSBkZWZhdWx0IHZhbHVlc1xyXG4gICQuZmFuY3lib3guZGVmYXVsdHMgPSAkLmV4dGVuZChcclxuICAgIHRydWUsXHJcbiAgICB7XHJcbiAgICAgIGJ0blRwbDoge1xyXG4gICAgICAgIHRodW1iczpcclxuICAgICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtdGh1bWJzIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tdGh1bWJzXCIgdGl0bGU9XCJ7e1RIVU1CU319XCI+JyArXHJcbiAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNMTQuNTkgMTQuNTloMy43NnYzLjc2aC0zLjc2di0zLjc2em0tNC40NyAwaDMuNzZ2My43NmgtMy43NnYtMy43NnptLTQuNDcgMGgzLjc2djMuNzZINS42NXYtMy43NnptOC45NC00LjQ3aDMuNzZ2My43NmgtMy43NnYtMy43NnptLTQuNDcgMGgzLjc2djMuNzZoLTMuNzZ2LTMuNzZ6bS00LjQ3IDBoMy43NnYzLjc2SDUuNjV2LTMuNzZ6bTguOTQtNC40N2gzLjc2djMuNzZoLTMuNzZWNS42NXptLTQuNDcgMGgzLjc2djMuNzZoLTMuNzZWNS42NXptLTQuNDcgMGgzLjc2djMuNzZINS42NVY1LjY1elwiLz48L3N2Zz4nICtcclxuICAgICAgICAgIFwiPC9idXR0b24+XCJcclxuICAgICAgfSxcclxuICAgICAgdGh1bWJzOiB7XHJcbiAgICAgICAgYXV0b1N0YXJ0OiBmYWxzZSwgLy8gRGlzcGxheSB0aHVtYm5haWxzIG9uIG9wZW5pbmdcclxuICAgICAgICBoaWRlT25DbG9zZTogdHJ1ZSwgLy8gSGlkZSB0aHVtYm5haWwgZ3JpZCB3aGVuIGNsb3NpbmcgYW5pbWF0aW9uIHN0YXJ0c1xyXG4gICAgICAgIHBhcmVudEVsOiBcIi5mYW5jeWJveC1jb250YWluZXJcIiwgLy8gQ29udGFpbmVyIGlzIGluamVjdGVkIGludG8gdGhpcyBlbGVtZW50XHJcbiAgICAgICAgYXhpczogXCJ5XCIgLy8gVmVydGljYWwgKHkpIG9yIGhvcml6b250YWwgKHgpIHNjcm9sbGluZ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgJC5mYW5jeWJveC5kZWZhdWx0c1xyXG4gICk7XHJcblxyXG4gIHZhciBGYW5jeVRodW1icyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICB0aGlzLmluaXQoaW5zdGFuY2UpO1xyXG4gIH07XHJcblxyXG4gICQuZXh0ZW5kKEZhbmN5VGh1bWJzLnByb3RvdHlwZSwge1xyXG4gICAgJGJ1dHRvbjogbnVsbCxcclxuICAgICRncmlkOiBudWxsLFxyXG4gICAgJGxpc3Q6IG51bGwsXHJcbiAgICBpc1Zpc2libGU6IGZhbHNlLFxyXG4gICAgaXNBY3RpdmU6IGZhbHNlLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICBncm91cCA9IGluc3RhbmNlLmdyb3VwLFxyXG4gICAgICAgIGVuYWJsZWQgPSAwO1xyXG5cclxuICAgICAgc2VsZi5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgICBzZWxmLm9wdHMgPSBncm91cFtpbnN0YW5jZS5jdXJySW5kZXhdLm9wdHMudGh1bWJzO1xyXG5cclxuICAgICAgaW5zdGFuY2UuVGh1bWJzID0gc2VsZjtcclxuXHJcbiAgICAgIHNlbGYuJGJ1dHRvbiA9IGluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZChcIltkYXRhLWZhbmN5Ym94LXRodW1ic11cIik7XHJcblxyXG4gICAgICAvLyBFbmFibGUgdGh1bWJzIGlmIGF0IGxlYXN0IHR3byBncm91cCBpdGVtcyBoYXZlIHRodW1ibmFpbHNcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGdyb3VwLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGdyb3VwW2ldLnRodW1iKSB7XHJcbiAgICAgICAgICBlbmFibGVkKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZW5hYmxlZCA+IDEpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGVuYWJsZWQgPiAxICYmICEhc2VsZi5vcHRzKSB7XHJcbiAgICAgICAgc2VsZi4kYnV0dG9uLnJlbW92ZUF0dHIoXCJzdHlsZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi50b2dnbGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VsZi5pc0FjdGl2ZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi4kYnV0dG9uLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgaW5zdGFuY2UgPSBzZWxmLmluc3RhbmNlLFxyXG4gICAgICAgIHBhcmVudEVsID0gc2VsZi5vcHRzLnBhcmVudEVsLFxyXG4gICAgICAgIGxpc3QgPSBbXSxcclxuICAgICAgICBzcmM7XHJcblxyXG4gICAgICBpZiAoIXNlbGYuJGdyaWQpIHtcclxuICAgICAgICAvLyBDcmVhdGUgbWFpbiBlbGVtZW50XHJcbiAgICAgICAgc2VsZi4kZ3JpZCA9ICQoJzxkaXYgY2xhc3M9XCInICsgQ0xBU1MgKyBcIiBcIiArIENMQVNTICsgXCItXCIgKyBzZWxmLm9wdHMuYXhpcyArICdcIj48L2Rpdj4nKS5hcHBlbmRUbyhcclxuICAgICAgICAgIGluc3RhbmNlLiRyZWZzLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuZmluZChwYXJlbnRFbClcclxuICAgICAgICAgICAgLmFkZEJhY2soKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHBhcmVudEVsKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcImNsaWNrXCIgZXZlbnQgdGhhdCBwZXJmb3JtcyBnYWxsZXJ5IG5hdmlnYXRpb25cclxuICAgICAgICBzZWxmLiRncmlkLm9uKFwiY2xpY2tcIiwgXCJhXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaW5zdGFuY2UuanVtcFRvKCQodGhpcykuYXR0cihcImRhdGEtaW5kZXhcIikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBCdWlsZCB0aGUgbGlzdFxyXG4gICAgICBpZiAoIXNlbGYuJGxpc3QpIHtcclxuICAgICAgICBzZWxmLiRsaXN0ID0gJCgnPGRpdiBjbGFzcz1cIicgKyBDTEFTUyArICdfX2xpc3RcIj4nKS5hcHBlbmRUbyhzZWxmLiRncmlkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJC5lYWNoKGluc3RhbmNlLmdyb3VwLCBmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgc3JjID0gaXRlbS50aHVtYjtcclxuXHJcbiAgICAgICAgaWYgKCFzcmMgJiYgaXRlbS50eXBlID09PSBcImltYWdlXCIpIHtcclxuICAgICAgICAgIHNyYyA9IGl0ZW0uc3JjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGlzdC5wdXNoKFxyXG4gICAgICAgICAgJzxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiB0YWJpbmRleD1cIjBcIiBkYXRhLWluZGV4PVwiJyArXHJcbiAgICAgICAgICAgIGkgK1xyXG4gICAgICAgICAgICAnXCInICtcclxuICAgICAgICAgICAgKHNyYyAmJiBzcmMubGVuZ3RoID8gJyBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6dXJsKCcgKyBzcmMgKyAnKVwiJyA6ICdjbGFzcz1cImZhbmN5Ym94LXRodW1icy1taXNzaW5nXCInKSArXHJcbiAgICAgICAgICAgIFwiPjwvYT5cIlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc2VsZi4kbGlzdFswXS5pbm5lckhUTUwgPSBsaXN0LmpvaW4oXCJcIik7XHJcblxyXG4gICAgICBpZiAoc2VsZi5vcHRzLmF4aXMgPT09IFwieFwiKSB7XHJcbiAgICAgICAgLy8gU2V0IGZpeGVkIHdpZHRoIGZvciBsaXN0IGVsZW1lbnQgdG8gZW5hYmxlIGhvcml6b250YWwgc2Nyb2xsaW5nXHJcbiAgICAgICAgc2VsZi4kbGlzdC53aWR0aChcclxuICAgICAgICAgIHBhcnNlSW50KHNlbGYuJGdyaWQuY3NzKFwicGFkZGluZy1yaWdodFwiKSwgMTApICtcclxuICAgICAgICAgICAgaW5zdGFuY2UuZ3JvdXAubGVuZ3RoICpcclxuICAgICAgICAgICAgICBzZWxmLiRsaXN0XHJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgICAgICAgICAgLmVxKDApXHJcbiAgICAgICAgICAgICAgICAub3V0ZXJXaWR0aCh0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZm9jdXM6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICAkbGlzdCA9IHNlbGYuJGxpc3QsXHJcbiAgICAgICAgJGdyaWQgPSBzZWxmLiRncmlkLFxyXG4gICAgICAgIHRodW1iLFxyXG4gICAgICAgIHRodW1iUG9zO1xyXG5cclxuICAgICAgaWYgKCFzZWxmLmluc3RhbmNlLmN1cnJlbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRodW1iID0gJGxpc3RcclxuICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcyhDTEFTU19BQ1RJVkUpXHJcbiAgICAgICAgLmZpbHRlcignW2RhdGEtaW5kZXg9XCInICsgc2VsZi5pbnN0YW5jZS5jdXJyZW50LmluZGV4ICsgJ1wiXScpXHJcbiAgICAgICAgLmFkZENsYXNzKENMQVNTX0FDVElWRSk7XHJcblxyXG4gICAgICB0aHVtYlBvcyA9IHRodW1iLnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiBuZWVkIHRvIHNjcm9sbCB0byBtYWtlIGN1cnJlbnQgdGh1bWIgdmlzaWJsZVxyXG4gICAgICBpZiAoc2VsZi5vcHRzLmF4aXMgPT09IFwieVwiICYmICh0aHVtYlBvcy50b3AgPCAwIHx8IHRodW1iUG9zLnRvcCA+ICRsaXN0LmhlaWdodCgpIC0gdGh1bWIub3V0ZXJIZWlnaHQoKSkpIHtcclxuICAgICAgICAkbGlzdC5zdG9wKCkuYW5pbWF0ZShcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkbGlzdC5zY3JvbGxUb3AoKSArIHRodW1iUG9zLnRvcFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGR1cmF0aW9uXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBzZWxmLm9wdHMuYXhpcyA9PT0gXCJ4XCIgJiZcclxuICAgICAgICAodGh1bWJQb3MubGVmdCA8ICRncmlkLnNjcm9sbExlZnQoKSB8fCB0aHVtYlBvcy5sZWZ0ID4gJGdyaWQuc2Nyb2xsTGVmdCgpICsgKCRncmlkLndpZHRoKCkgLSB0aHVtYi5vdXRlcldpZHRoKCkpKVxyXG4gICAgICApIHtcclxuICAgICAgICAkbGlzdFxyXG4gICAgICAgICAgLnBhcmVudCgpXHJcbiAgICAgICAgICAuc3RvcCgpXHJcbiAgICAgICAgICAuYW5pbWF0ZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHRodW1iUG9zLmxlZnRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZHVyYXRpb25cclxuICAgICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICB0aGF0Lmluc3RhbmNlLiRyZWZzLmNvbnRhaW5lci50b2dnbGVDbGFzcyhcImZhbmN5Ym94LXNob3ctdGh1bWJzXCIsIHRoaXMuaXNWaXNpYmxlKTtcclxuXHJcbiAgICAgIGlmICh0aGF0LmlzVmlzaWJsZSkge1xyXG4gICAgICAgIGlmICghdGhhdC4kZ3JpZCkge1xyXG4gICAgICAgICAgdGhhdC5jcmVhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoYXQuaW5zdGFuY2UudHJpZ2dlcihcIm9uVGh1bWJzU2hvd1wiKTtcclxuXHJcbiAgICAgICAgdGhhdC5mb2N1cygwKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGF0LiRncmlkKSB7XHJcbiAgICAgICAgdGhhdC5pbnN0YW5jZS50cmlnZ2VyKFwib25UaHVtYnNIaWRlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVcGRhdGUgY29udGVudCBwb3NpdGlvblxyXG4gICAgICB0aGF0Lmluc3RhbmNlLnVwZGF0ZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5pc1Zpc2libGUgPSAhdGhpcy5pc1Zpc2libGU7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKHtcclxuICAgIFwib25Jbml0LmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcbiAgICAgIHZhciBUaHVtYnM7XHJcblxyXG4gICAgICBpZiAoaW5zdGFuY2UgJiYgIWluc3RhbmNlLlRodW1icykge1xyXG4gICAgICAgIFRodW1icyA9IG5ldyBGYW5jeVRodW1icyhpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIGlmIChUaHVtYnMuaXNBY3RpdmUgJiYgVGh1bWJzLm9wdHMuYXV0b1N0YXJ0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBUaHVtYnMuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImJlZm9yZVNob3cuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGl0ZW0sIGZpcnN0UnVuKSB7XHJcbiAgICAgIHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG4gICAgICBpZiAoVGh1bWJzICYmIFRodW1icy5pc1Zpc2libGUpIHtcclxuICAgICAgICBUaHVtYnMuZm9jdXMoZmlyc3RSdW4gPyAwIDogMjUwKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcImFmdGVyS2V5ZG93bi5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCwga2V5cHJlc3MsIGtleWNvZGUpIHtcclxuICAgICAgdmFyIFRodW1icyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlRodW1icztcclxuXHJcbiAgICAgIC8vIFwiR1wiXHJcbiAgICAgIGlmIChUaHVtYnMgJiYgVGh1bWJzLmlzQWN0aXZlICYmIGtleWNvZGUgPT09IDcxKSB7XHJcbiAgICAgICAga2V5cHJlc3MucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgVGh1bWJzLnRvZ2dsZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFwiYmVmb3JlQ2xvc2UuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuICAgICAgdmFyIFRodW1icyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlRodW1icztcclxuXHJcbiAgICAgIGlmIChUaHVtYnMgJiYgVGh1bWJzLmlzVmlzaWJsZSAmJiBUaHVtYnMub3B0cy5oaWRlT25DbG9zZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICBUaHVtYnMuJGdyaWQuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pKGRvY3VtZW50LCBqUXVlcnkpO1xyXG5cbi8vLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gU2hhcmVcclxuLy8gRGlzcGxheXMgc2ltcGxlIGZvcm0gZm9yIHNoYXJpbmcgY3VycmVudCB1cmxcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKGZ1bmN0aW9uKGRvY3VtZW50LCAkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICQuZXh0ZW5kKHRydWUsICQuZmFuY3lib3guZGVmYXVsdHMsIHtcclxuICAgIGJ0blRwbDoge1xyXG4gICAgICBzaGFyZTpcclxuICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXNoYXJlIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tc2hhcmVcIiB0aXRsZT1cInt7U0hBUkV9fVwiPicgK1xyXG4gICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk0yLjU1IDE5YzEuNC04LjQgOS4xLTkuOCAxMS45LTkuOFY1bDcgNy03IDYuM3YtMy41Yy0yLjggMC0xMC41IDIuMS0xMS45IDQuMnpcIi8+PC9zdmc+JyArXHJcbiAgICAgICAgXCI8L2J1dHRvbj5cIlxyXG4gICAgfSxcclxuICAgIHNoYXJlOiB7XHJcbiAgICAgIHVybDogZnVuY3Rpb24oaW5zdGFuY2UsIGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgKCFpbnN0YW5jZS5jdXJyZW50SGFzaCAmJiAhKGl0ZW0udHlwZSA9PT0gXCJpbmxpbmVcIiB8fCBpdGVtLnR5cGUgPT09IFwiaHRtbFwiKSA/IGl0ZW0ub3JpZ1NyYyB8fCBpdGVtLnNyYyA6IGZhbHNlKSB8fCB3aW5kb3cubG9jYXRpb25cclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG4gICAgICB0cGw6XHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1zaGFyZVwiPicgK1xyXG4gICAgICAgIFwiPGgxPnt7U0hBUkV9fTwvaDE+XCIgK1xyXG4gICAgICAgIFwiPHA+XCIgK1xyXG4gICAgICAgICc8YSBjbGFzcz1cImZhbmN5Ym94LXNoYXJlX19idXR0b24gZmFuY3lib3gtc2hhcmVfX2J1dHRvbi0tZmJcIiBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9e3t1cmx9fVwiPicgK1xyXG4gICAgICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTI4NyA0NTZ2LTI5OWMwLTIxIDYtMzUgMzUtMzVoMzh2LTYzYy03LTEtMjktMy01NS0zLTU0IDAtOTEgMzMtOTEgOTR2MzA2bTE0My0yNTRoLTIwNXY3MmgxOTZcIiAvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPHNwYW4+RmFjZWJvb2s8L3NwYW4+XCIgK1xyXG4gICAgICAgIFwiPC9hPlwiICtcclxuICAgICAgICAnPGEgY2xhc3M9XCJmYW5jeWJveC1zaGFyZV9fYnV0dG9uIGZhbmN5Ym94LXNoYXJlX19idXR0b24tLXR3XCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3VybD17e3VybH19JnRleHQ9e3tkZXNjcn19XCI+JyArXHJcbiAgICAgICAgJzxzdmcgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtNDU2IDEzM2MtMTQgNy0zMSAxMS00NyAxMyAxNy0xMCAzMC0yNyAzNy00Ni0xNSAxMC0zNCAxNi01MiAyMC02MS02Mi0xNTctNy0xNDEgNzUtNjgtMy0xMjktMzUtMTY5LTg1LTIyIDM3LTExIDg2IDI2IDEwOS0xMyAwLTI2LTQtMzctOSAwIDM5IDI4IDcyIDY1IDgwLTEyIDMtMjUgNC0zNyAyIDEwIDMzIDQxIDU3IDc3IDU3LTQyIDMwLTc3IDM4LTEyMiAzNCAxNzAgMTExIDM3OC0zMiAzNTktMjA4IDE2LTExIDMwLTI1IDQxLTQyelwiIC8+PC9zdmc+JyArXHJcbiAgICAgICAgXCI8c3Bhbj5Ud2l0dGVyPC9zcGFuPlwiICtcclxuICAgICAgICBcIjwvYT5cIiArXHJcbiAgICAgICAgJzxhIGNsYXNzPVwiZmFuY3lib3gtc2hhcmVfX2J1dHRvbiBmYW5jeWJveC1zaGFyZV9fYnV0dG9uLS1wdFwiIGhyZWY9XCJodHRwczovL3d3dy5waW50ZXJlc3QuY29tL3Bpbi9jcmVhdGUvYnV0dG9uLz91cmw9e3t1cmx9fSZkZXNjcmlwdGlvbj17e2Rlc2NyfX0mbWVkaWE9e3ttZWRpYX19XCI+JyArXHJcbiAgICAgICAgJzxzdmcgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtMjY1IDU2Yy0xMDkgMC0xNjQgNzgtMTY0IDE0NCAwIDM5IDE1IDc0IDQ3IDg3IDUgMiAxMCAwIDEyLTVsNC0xOWMyLTYgMS04LTMtMTMtOS0xMS0xNS0yNS0xNS00NSAwLTU4IDQzLTExMCAxMTMtMTEwIDYyIDAgOTYgMzggOTYgODggMCA2Ny0zMCAxMjItNzMgMTIyLTI0IDAtNDItMTktMzYtNDQgNi0yOSAyMC02MCAyMC04MSAwLTE5LTEwLTM1LTMxLTM1LTI1IDAtNDQgMjYtNDQgNjAgMCAyMSA3IDM2IDcgMzZsLTMwIDEyNWMtOCAzNy0xIDgzIDAgODcgMCAzIDQgNCA1IDIgMi0zIDMyLTM5IDQyLTc1bDE2LTY0YzggMTYgMzEgMjkgNTYgMjkgNzQgMCAxMjQtNjcgMTI0LTE1NyAwLTY5LTU4LTEzMi0xNDYtMTMyelwiIGZpbGw9XCIjZmZmXCIvPjwvc3ZnPicgK1xyXG4gICAgICAgIFwiPHNwYW4+UGludGVyZXN0PC9zcGFuPlwiICtcclxuICAgICAgICBcIjwvYT5cIiArXHJcbiAgICAgICAgXCI8L3A+XCIgK1xyXG4gICAgICAgICc8cD48aW5wdXQgY2xhc3M9XCJmYW5jeWJveC1zaGFyZV9faW5wdXRcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwie3t1cmxfcmF3fX1cIiBvbmNsaWNrPVwic2VsZWN0KClcIiAvPjwvcD4nICtcclxuICAgICAgICBcIjwvZGl2PlwiXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyaW5nKSB7XHJcbiAgICB2YXIgZW50aXR5TWFwID0ge1xyXG4gICAgICBcIiZcIjogXCImYW1wO1wiLFxyXG4gICAgICBcIjxcIjogXCImbHQ7XCIsXHJcbiAgICAgIFwiPlwiOiBcIiZndDtcIixcclxuICAgICAgJ1wiJzogXCImcXVvdDtcIixcclxuICAgICAgXCInXCI6IFwiJiMzOTtcIixcclxuICAgICAgXCIvXCI6IFwiJiN4MkY7XCIsXHJcbiAgICAgIFwiYFwiOiBcIiYjeDYwO1wiLFxyXG4gICAgICBcIj1cIjogXCImI3gzRDtcIlxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvWyY8PlwiJ2A9XFwvXS9nLCBmdW5jdGlvbihzKSB7XHJcbiAgICAgIHJldHVybiBlbnRpdHlNYXBbc107XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCJbZGF0YS1mYW5jeWJveC1zaGFyZV1cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCksXHJcbiAgICAgIGN1cnJlbnQgPSBpbnN0YW5jZS5jdXJyZW50IHx8IG51bGwsXHJcbiAgICAgIHVybCxcclxuICAgICAgdHBsO1xyXG5cclxuICAgIGlmICghY3VycmVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQudHlwZShjdXJyZW50Lm9wdHMuc2hhcmUudXJsKSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIHVybCA9IGN1cnJlbnQub3B0cy5zaGFyZS51cmwuYXBwbHkoY3VycmVudCwgW2luc3RhbmNlLCBjdXJyZW50XSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHBsID0gY3VycmVudC5vcHRzLnNoYXJlLnRwbFxyXG4gICAgICAucmVwbGFjZSgvXFx7XFx7bWVkaWFcXH1cXH0vZywgY3VycmVudC50eXBlID09PSBcImltYWdlXCIgPyBlbmNvZGVVUklDb21wb25lbnQoY3VycmVudC5zcmMpIDogXCJcIilcclxuICAgICAgLnJlcGxhY2UoL1xce1xce3VybFxcfVxcfS9nLCBlbmNvZGVVUklDb21wb25lbnQodXJsKSlcclxuICAgICAgLnJlcGxhY2UoL1xce1xce3VybF9yYXdcXH1cXH0vZywgZXNjYXBlSHRtbCh1cmwpKVxyXG4gICAgICAucmVwbGFjZSgvXFx7XFx7ZGVzY3JcXH1cXH0vZywgaW5zdGFuY2UuJGNhcHRpb24gPyBlbmNvZGVVUklDb21wb25lbnQoaW5zdGFuY2UuJGNhcHRpb24udGV4dCgpKSA6IFwiXCIpO1xyXG5cclxuICAgICQuZmFuY3lib3gub3Blbih7XHJcbiAgICAgIHNyYzogaW5zdGFuY2UudHJhbnNsYXRlKGluc3RhbmNlLCB0cGwpLFxyXG4gICAgICB0eXBlOiBcImh0bWxcIixcclxuICAgICAgb3B0czoge1xyXG4gICAgICAgIHRvdWNoOiBmYWxzZSxcclxuICAgICAgICBhbmltYXRpb25FZmZlY3Q6IGZhbHNlLFxyXG4gICAgICAgIGFmdGVyTG9hZDogZnVuY3Rpb24oc2hhcmVJbnN0YW5jZSwgc2hhcmVDdXJyZW50KSB7XHJcbiAgICAgICAgICAvLyBDbG9zZSBzZWxmIGlmIHBhcmVudCBpbnN0YW5jZSBpcyBjbG9zaW5nXHJcbiAgICAgICAgICBpbnN0YW5jZS4kcmVmcy5jb250YWluZXIub25lKFwiYmVmb3JlQ2xvc2UuZmJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNoYXJlSW5zdGFuY2UuY2xvc2UobnVsbCwgMCk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBPcGVuaW5nIGxpbmtzIGluIGEgcG9wdXAgd2luZG93XHJcbiAgICAgICAgICBzaGFyZUN1cnJlbnQuJGNvbnRlbnQuZmluZChcIi5mYW5jeWJveC1zaGFyZV9fYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cub3Blbih0aGlzLmhyZWYsIFwiU2hhcmVcIiwgXCJ3aWR0aD01NTAsIGhlaWdodD00NTBcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW9iaWxlOiB7XHJcbiAgICAgICAgICBhdXRvRm9jdXM6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufSkoZG9jdW1lbnQsIGpRdWVyeSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gSGFzaFxyXG4vLyBFbmFibGVzIGxpbmtpbmcgdG8gZWFjaCBtb2RhbFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAvLyBTaW1wbGUgJC5lc2NhcGVTZWxlY3RvciBwb2x5ZmlsbCAoZm9yIGpRdWVyeSBwcmlvciB2MylcclxuICBpZiAoISQuZXNjYXBlU2VsZWN0b3IpIHtcclxuICAgICQuZXNjYXBlU2VsZWN0b3IgPSBmdW5jdGlvbihzZWwpIHtcclxuICAgICAgdmFyIHJjc3Nlc2NhcGUgPSAvKFtcXDAtXFx4MWZcXHg3Zl18Xi0/XFxkKXxeLSR8W15cXHg4MC1cXHVGRkZGXFx3LV0vZztcclxuICAgICAgdmFyIGZjc3Nlc2NhcGUgPSBmdW5jdGlvbihjaCwgYXNDb2RlUG9pbnQpIHtcclxuICAgICAgICBpZiAoYXNDb2RlUG9pbnQpIHtcclxuICAgICAgICAgIC8vIFUrMDAwMCBOVUxMIGJlY29tZXMgVStGRkZEIFJFUExBQ0VNRU5UIENIQVJBQ1RFUlxyXG4gICAgICAgICAgaWYgKGNoID09PSBcIlxcMFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlxcdUZGRkRcIjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBDb250cm9sIGNoYXJhY3RlcnMgYW5kIChkZXBlbmRlbnQgdXBvbiBwb3NpdGlvbikgbnVtYmVycyBnZXQgZXNjYXBlZCBhcyBjb2RlIHBvaW50c1xyXG4gICAgICAgICAgcmV0dXJuIGNoLnNsaWNlKDAsIC0xKSArIFwiXFxcXFwiICsgY2guY2hhckNvZGVBdChjaC5sZW5ndGggLSAxKS50b1N0cmluZygxNikgKyBcIiBcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE90aGVyIHBvdGVudGlhbGx5LXNwZWNpYWwgQVNDSUkgY2hhcmFjdGVycyBnZXQgYmFja3NsYXNoLWVzY2FwZWRcclxuICAgICAgICByZXR1cm4gXCJcXFxcXCIgKyBjaDtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiAoc2VsICsgXCJcIikucmVwbGFjZShyY3NzZXNjYXBlLCBmY3NzZXNjYXBlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgaW5mbyBhYm91dCBnYWxsZXJ5IG5hbWUgYW5kIGN1cnJlbnQgaW5kZXggZnJvbSB1cmxcclxuICBmdW5jdGlvbiBwYXJzZVVybCgpIHtcclxuICAgIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpLFxyXG4gICAgICByZXogPSBoYXNoLnNwbGl0KFwiLVwiKSxcclxuICAgICAgaW5kZXggPSByZXoubGVuZ3RoID4gMSAmJiAvXlxcKz9cXGQrJC8udGVzdChyZXpbcmV6Lmxlbmd0aCAtIDFdKSA/IHBhcnNlSW50KHJlei5wb3AoLTEpLCAxMCkgfHwgMSA6IDEsXHJcbiAgICAgIGdhbGxlcnkgPSByZXouam9pbihcIi1cIik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGFzaDogaGFzaCxcclxuICAgICAgLyogSW5kZXggaXMgc3RhcnRpbmcgZnJvbSAxICovXHJcbiAgICAgIGluZGV4OiBpbmRleCA8IDEgPyAxIDogaW5kZXgsXHJcbiAgICAgIGdhbGxlcnk6IGdhbGxlcnlcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBUcmlnZ2VyIGNsaWNrIGV2bnQgb24gbGlua3MgdG8gb3BlbiBuZXcgZmFuY3lCb3ggaW5zdGFuY2VcclxuICBmdW5jdGlvbiB0cmlnZ2VyRnJvbVVybCh1cmwpIHtcclxuICAgIGlmICh1cmwuZ2FsbGVyeSAhPT0gXCJcIikge1xyXG4gICAgICAvLyBJZiB3ZSBjYW4gZmluZCBlbGVtZW50IG1hdGNoaW5nICdkYXRhLWZhbmN5Ym94JyBhdHJpYnV0ZSxcclxuICAgICAgLy8gdGhlbiB0cmlnZ2VyaW5nIGNsaWNrIGV2ZW50IHNob3VsZCBzdGFydCBmYW5jeUJveFxyXG4gICAgICAkKFwiW2RhdGEtZmFuY3lib3g9J1wiICsgJC5lc2NhcGVTZWxlY3Rvcih1cmwuZ2FsbGVyeSkgKyBcIiddXCIpXHJcbiAgICAgICAgLmVxKHVybC5pbmRleCAtIDEpXHJcbiAgICAgICAgLmZvY3VzKClcclxuICAgICAgICAudHJpZ2dlcihcImNsaWNrLmZiLXN0YXJ0XCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGdhbGxlcnkgbmFtZSBmcm9tIGN1cnJlbnQgaW5zdGFuY2VcclxuICBmdW5jdGlvbiBnZXRHYWxsZXJ5SUQoaW5zdGFuY2UpIHtcclxuICAgIHZhciBvcHRzLCByZXQ7XHJcblxyXG4gICAgaWYgKCFpbnN0YW5jZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0cyA9IGluc3RhbmNlLmN1cnJlbnQgPyBpbnN0YW5jZS5jdXJyZW50Lm9wdHMgOiBpbnN0YW5jZS5vcHRzO1xyXG4gICAgcmV0ID0gb3B0cy5oYXNoIHx8IChvcHRzLiRvcmlnID8gb3B0cy4kb3JpZy5kYXRhKFwiZmFuY3lib3hcIikgfHwgb3B0cy4kb3JpZy5kYXRhKFwiZmFuY3lib3gtdHJpZ2dlclwiKSA6IFwiXCIpO1xyXG5cclxuICAgIHJldHVybiByZXQgPT09IFwiXCIgPyBmYWxzZSA6IHJldDtcclxuICB9XHJcblxyXG4gIC8vIFN0YXJ0IHdoZW4gRE9NIGJlY29tZXMgcmVhZHlcclxuICAkKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBoYXMgZGlzYWJsZWQgdGhpcyBtb2R1bGVcclxuICAgIGlmICgkLmZhbmN5Ym94LmRlZmF1bHRzLmhhc2ggPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgaGFzaCB3aGVuIG9wZW5pbmcvY2xvc2luZyBmYW5jeUJveFxyXG4gICAgJChkb2N1bWVudCkub24oe1xyXG4gICAgICBcIm9uSW5pdC5mYlwiOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciB1cmwsIGdhbGxlcnk7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZS5ncm91cFtpbnN0YW5jZS5jdXJySW5kZXhdLm9wdHMuaGFzaCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVybCA9IHBhcnNlVXJsKCk7XHJcbiAgICAgICAgZ2FsbGVyeSA9IGdldEdhbGxlcnlJRChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBnYWxsZXJ5IHN0YXJ0IGluZGV4IG1hdGNoZXMgaW5kZXggZnJvbSBoYXNoXHJcbiAgICAgICAgaWYgKGdhbGxlcnkgJiYgdXJsLmdhbGxlcnkgJiYgZ2FsbGVyeSA9PSB1cmwuZ2FsbGVyeSkge1xyXG4gICAgICAgICAgaW5zdGFuY2UuY3VyckluZGV4ID0gdXJsLmluZGV4IC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBcImJlZm9yZVNob3cuZmJcIjogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGZpcnN0UnVuKSB7XHJcbiAgICAgICAgdmFyIGdhbGxlcnk7XHJcblxyXG4gICAgICAgIGlmICghY3VycmVudCB8fCBjdXJyZW50Lm9wdHMuaGFzaCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIG5lZWQgdG8gdXBkYXRlIHdpbmRvdyBoYXNoXHJcbiAgICAgICAgZ2FsbGVyeSA9IGdldEdhbGxlcnlJRChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIGlmICghZ2FsbGVyeSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVmFyaWFibGUgY29udGFpbmluZyBsYXN0IGhhc2ggdmFsdWUgc2V0IGJ5IGZhbmN5Qm94XHJcbiAgICAgICAgLy8gSXQgd2lsbCBiZSB1c2VkIHRvIGRldGVybWluZSBpZiBmYW5jeUJveCBuZWVkcyB0byBjbG9zZSBhZnRlciBoYXNoIGNoYW5nZSBpcyBkZXRlY3RlZFxyXG4gICAgICAgIGluc3RhbmNlLmN1cnJlbnRIYXNoID0gZ2FsbGVyeSArIChpbnN0YW5jZS5ncm91cC5sZW5ndGggPiAxID8gXCItXCIgKyAoY3VycmVudC5pbmRleCArIDEpIDogXCJcIik7XHJcblxyXG4gICAgICAgIC8vIElmIGN1cnJlbnQgaGFzaCBpcyB0aGUgc2FtZSAodGhpcyBpbnN0YW5jZSBtb3N0IGxpa2VseSBpcyBvcGVuZWQgYnkgaGFzaGNoYW5nZSksIHRoZW4gZG8gbm90aGluZ1xyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gXCIjXCIgKyBpbnN0YW5jZS5jdXJyZW50SGFzaCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpcnN0UnVuICYmICFpbnN0YW5jZS5vcmlnSGFzaCkge1xyXG4gICAgICAgICAgaW5zdGFuY2Uub3JpZ0hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZS5oYXNoVGltZXIpIHtcclxuICAgICAgICAgIGNsZWFyVGltZW91dChpbnN0YW5jZS5oYXNoVGltZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIGhhc2hcclxuICAgICAgICBpbnN0YW5jZS5oYXNoVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYgKFwicmVwbGFjZVN0YXRlXCIgaW4gd2luZG93Lmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnlbZmlyc3RSdW4gPyBcInB1c2hTdGF0ZVwiIDogXCJyZXBsYWNlU3RhdGVcIl0oXHJcbiAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUsXHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArIFwiI1wiICsgaW5zdGFuY2UuY3VycmVudEhhc2hcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaXJzdFJ1bikge1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLmhhc0NyZWF0ZWRIaXN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBpbnN0YW5jZS5jdXJyZW50SGFzaDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbnN0YW5jZS5oYXNoVGltZXIgPSBudWxsO1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBcImJlZm9yZUNsb3NlLmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50KSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50IHx8IGN1cnJlbnQub3B0cy5oYXNoID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGluc3RhbmNlLmhhc2hUaW1lcik7XHJcblxyXG4gICAgICAgIC8vIEdvdG8gcHJldmlvdXMgaGlzdG9yeSBlbnRyeVxyXG4gICAgICAgIGlmIChpbnN0YW5jZS5jdXJyZW50SGFzaCAmJiBpbnN0YW5jZS5oYXNDcmVhdGVkSGlzdG9yeSkge1xyXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UuY3VycmVudEhhc2gpIHtcclxuICAgICAgICAgIGlmIChcInJlcGxhY2VTdGF0ZVwiIGluIHdpbmRvdy5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKyAoaW5zdGFuY2Uub3JpZ0hhc2ggfHwgXCJcIikpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBpbnN0YW5jZS5vcmlnSGFzaDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlLmN1cnJlbnRIYXNoID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgbmVlZCB0byBzdGFydC9jbG9zZSBhZnRlciB1cmwgaGFzIGNoYW5nZWRcclxuICAgICQod2luZG93KS5vbihcImhhc2hjaGFuZ2UuZmJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB1cmwgPSBwYXJzZVVybCgpLFxyXG4gICAgICAgIGZiID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIEZpbmQgbGFzdCBmYW5jeUJveCBpbnN0YW5jZSB0aGF0IGhhcyBcImhhc2hcIlxyXG4gICAgICAkLmVhY2goXHJcbiAgICAgICAgJChcIi5mYW5jeWJveC1jb250YWluZXJcIilcclxuICAgICAgICAgIC5nZXQoKVxyXG4gICAgICAgICAgLnJldmVyc2UoKSxcclxuICAgICAgICBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgIHZhciB0bXAgPSAkKHZhbHVlKS5kYXRhKFwiRmFuY3lCb3hcIik7XHJcblxyXG4gICAgICAgICAgaWYgKHRtcCAmJiB0bXAuY3VycmVudEhhc2gpIHtcclxuICAgICAgICAgICAgZmIgPSB0bXA7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoZmIpIHtcclxuICAgICAgICAvLyBOb3csIGNvbXBhcmUgaGFzaCB2YWx1ZXNcclxuICAgICAgICBpZiAoZmIuY3VycmVudEhhc2ggIT09IHVybC5nYWxsZXJ5ICsgXCItXCIgKyB1cmwuaW5kZXggJiYgISh1cmwuaW5kZXggPT09IDEgJiYgZmIuY3VycmVudEhhc2ggPT0gdXJsLmdhbGxlcnkpKSB7XHJcbiAgICAgICAgICBmYi5jdXJyZW50SGFzaCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgZmIuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodXJsLmdhbGxlcnkgIT09IFwiXCIpIHtcclxuICAgICAgICB0cmlnZ2VyRnJvbVVybCh1cmwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDaGVjayBjdXJyZW50IGhhc2ggYW5kIHRyaWdnZXIgY2xpY2sgZXZlbnQgb24gbWF0Y2hpbmcgZWxlbWVudCB0byBzdGFydCBmYW5jeUJveCwgaWYgbmVlZGVkXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoISQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSkge1xyXG4gICAgICAgIHRyaWdnZXJGcm9tVXJsKHBhcnNlVXJsKCkpO1xyXG4gICAgICB9XHJcbiAgICB9LCA1MCk7XHJcbiAgfSk7XHJcbn0pKHdpbmRvdywgZG9jdW1lbnQsIGpRdWVyeSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gV2hlZWxcclxuLy8gQmFzaWMgbW91c2Ugd2VoZWVsIHN1cHBvcnQgZm9yIGdhbGxlcnkgbmF2aWdhdGlvblxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4oZnVuY3Rpb24oZG9jdW1lbnQsICQpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgdmFyIHByZXZUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKHtcclxuICAgIFwib25Jbml0LmZiXCI6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50KSB7XHJcbiAgICAgIGluc3RhbmNlLiRyZWZzLnN0YWdlLm9uKFwibW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCB3aGVlbCBNb3pNb3VzZVBpeGVsU2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgY3VycmVudCA9IGluc3RhbmNlLmN1cnJlbnQsXHJcbiAgICAgICAgICBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCBjdXJyZW50Lm9wdHMud2hlZWwgPT09IGZhbHNlIHx8IChjdXJyZW50Lm9wdHMud2hlZWwgPT09IFwiYXV0b1wiICYmIGN1cnJlbnQudHlwZSAhPT0gXCJpbWFnZVwiKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50LiRzbGlkZS5oYXNDbGFzcyhcImZhbmN5Ym94LWFuaW1hdGVkXCIpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlID0gZS5vcmlnaW5hbEV2ZW50IHx8IGU7XHJcblxyXG4gICAgICAgIGlmIChjdXJyVGltZSAtIHByZXZUaW1lIDwgMjUwKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcmV2VGltZSA9IGN1cnJUaW1lO1xyXG5cclxuICAgICAgICBpbnN0YW5jZVsoLWUuZGVsdGFZIHx8IC1lLmRlbHRhWCB8fCBlLndoZWVsRGVsdGEgfHwgLWUuZGV0YWlsKSA8IDAgPyBcIm5leHRcIiA6IFwicHJldmlvdXNcIl0oKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pKGRvY3VtZW50LCBqUXVlcnkpO1xyXG4iLCIvKiEgcmVzcG9uc2l2ZS1uYXYuanMgMS4wLjM5XG4gKiBodHRwczovL2dpdGh1Yi5jb20vdmlsamFtaXMvcmVzcG9uc2l2ZS1uYXYuanNcbiAqIGh0dHA6Ly9yZXNwb25zaXZlLW5hdi5jb21cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgQHZpbGphbWlzXG4gKiBBdmFpbGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuLyogZ2xvYmFsIEV2ZW50ICovXG4oZnVuY3Rpb24gKGRvY3VtZW50LCB3aW5kb3csIGluZGV4KSB7XG4gIC8vIEluZGV4IGlzIHVzZWQgdG8ga2VlcCBtdWx0aXBsZSBuYXZzIG9uIHRoZSBzYW1lIHBhZ2UgbmFtZXNwYWNlZFxuXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciByZXNwb25zaXZlTmF2ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgY29tcHV0ZWQgPSAhIXdpbmRvdy5nZXRDb21wdXRlZFN0eWxlO1xuXG4gICAgLyoqXG4gICAgICogZ2V0Q29tcHV0ZWRTdHlsZSBwb2x5ZmlsbCBmb3Igb2xkIGJyb3dzZXJzXG4gICAgICovXG4gICAgaWYgKCFjb21wdXRlZCkge1xuICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMuZ2V0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICB2YXIgcmUgPSAvKFxcLShbYS16XSl7MX0pL2c7XG4gICAgICAgICAgaWYgKHByb3AgPT09IFwiZmxvYXRcIikge1xuICAgICAgICAgICAgcHJvcCA9IFwic3R5bGVGbG9hdFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmUudGVzdChwcm9wKSkge1xuICAgICAgICAgICAgcHJvcCA9IHByb3AucmVwbGFjZShyZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzJdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA/IGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA6IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9XG4gICAgLyogZXhwb3J0ZWQgYWRkRXZlbnQsIHJlbW92ZUV2ZW50LCBnZXRDaGlsZHJlbiwgc2V0QXR0cmlidXRlcywgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzLCBmb3JFYWNoICovXG5cbiAgICAvKipcbiAgICAgKiBBZGQgRXZlbnRcbiAgICAgKiBmbiBhcmcgY2FuIGJlIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCB0aGFua3MgdG8gaGFuZGxlRXZlbnRcbiAgICAgKiByZWFkIG1vcmUgYXQ6IGh0dHA6Ly93d3cudGhlY3NzbmluamEuY29tL2phdmFzY3JpcHQvaGFuZGxlZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge2VsZW1lbnR9ICBlbGVtZW50XG4gICAgICogQHBhcmFtICB7ZXZlbnR9ICAgIGV2ZW50XG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAgICogQHBhcmFtICB7Ym9vbGVhbn0gIGJ1YmJsaW5nXG4gICAgICovXG4gICAgdmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsLCBldnQsIGZuLCBidWJibGUpIHtcbiAgICAgICAgaWYgKFwiYWRkRXZlbnRMaXN0ZW5lclwiIGluIGVsKSB7XG4gICAgICAgICAgLy8gQkJPUzYgZG9lc24ndCBzdXBwb3J0IGhhbmRsZUV2ZW50LCBjYXRjaCBhbmQgcG9seWZpbGxcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZuLCBidWJibGUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gQmluZCBmbiBhcyB0aGlzIGFuZCBzZXQgZmlyc3QgYXJnIGFzIGV2ZW50IG9iamVjdFxuICAgICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4sIGUpO1xuICAgICAgICAgICAgICB9LCBidWJibGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXCJhdHRhY2hFdmVudFwiIGluIGVsKSB7XG4gICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGNhbGxiYWNrIGlzIGFuIG9iamVjdCBhbmQgY29udGFpbnMgaGFuZGxlRXZlbnRcbiAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcIm9iamVjdFwiICYmIGZuLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICBlbC5hdHRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gQmluZCBmbiBhcyB0aGlzXG4gICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KFwib25cIiArIGV2dCwgZm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgRXZlbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtlbGVtZW50fSAgZWxlbWVudFxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9ICAgIGV2ZW50XG4gICAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAgICAgICAqIEBwYXJhbSAge2Jvb2xlYW59ICBidWJibGluZ1xuICAgICAgICovXG4gICAgICByZW1vdmVFdmVudCA9IGZ1bmN0aW9uIChlbCwgZXZ0LCBmbiwgYnViYmxlKSB7XG4gICAgICAgIGlmIChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiBpbiBlbCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZm4sIGJ1YmJsZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKGZuLCBlKTtcbiAgICAgICAgICAgICAgfSwgYnViYmxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFwiZGV0YWNoRXZlbnRcIiBpbiBlbCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgIGVsLmRldGFjaEV2ZW50KFwib25cIiArIGV2dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKGZuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5kZXRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHRoZSBjaGlsZHJlbiBvZiBhbnkgZWxlbWVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2VsZW1lbnR9XG4gICAgICAgKiBAcmV0dXJuIHthcnJheX0gUmV0dXJucyBtYXRjaGluZyBlbGVtZW50cyBpbiBhbiBhcnJheVxuICAgICAgICovXG4gICAgICBnZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgTmF2IGNvbnRhaW5lciBoYXMgbm8gY29udGFpbmluZyBlbGVtZW50c1wiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdG9yZSBhbGwgY2hpbGRyZW4gaW4gYXJyYXlcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBjaGlsZHJlbiBhbmQgc3RvcmUgaW4gYXJyYXkgaWYgY2hpbGQgIT0gVGV4dE5vZGVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGUuY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goZS5jaGlsZHJlbltpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0cyBtdWx0aXBsZSBhdHRyaWJ1dGVzIGF0IG9uY2VcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7YXR0cnN9ICAgYXR0cnNcbiAgICAgICAqL1xuICAgICAgc2V0QXR0cmlidXRlcyA9IGZ1bmN0aW9uIChlbCwgYXR0cnMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBhIGNsYXNzIHRvIGFueSBlbGVtZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gIGNsYXNzXG4gICAgICAgKi9cbiAgICAgIGFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgICAgICAgaWYgKGVsLmNsYXNzTmFtZS5pbmRleE9mKGNscykgIT09IDApIHtcbiAgICAgICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbHM7XG4gICAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoLyheXFxzKil8KFxccyokKS9nLFwiXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW55IGVsZW1lbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtlbGVtZW50fSBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBjbGFzc1xuICAgICAgICovXG4gICAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiKFxcXFxzfF4pXCIgKyBjbHMgKyBcIihcXFxcc3wkKVwiKTtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UocmVnLCBcIiBcIikucmVwbGFjZSgvKF5cXHMqKXwoXFxzKiQpL2csXCJcIik7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIGZvckVhY2ggbWV0aG9kIHRoYXQgcGFzc2VzIGJhY2sgdGhlIHN0dWZmIHdlIG5lZWRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHthcnJheX0gICAgYXJyYXlcbiAgICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgICogQHBhcmFtICB7c2NvcGV9ICAgIHNjb3BlXG4gICAgICAgKi9cbiAgICAgIGZvckVhY2ggPSBmdW5jdGlvbiAoYXJyYXksIGNhbGxiYWNrLCBzY29wZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2FsbGJhY2suY2FsbChzY29wZSwgaSwgYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgdmFyIG5hdixcbiAgICAgIG9wdHMsXG4gICAgICBuYXZUb2dnbGUsXG4gICAgICBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIiksXG4gICAgICBodG1sRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICBoYXNBbmltRmluaXNoZWQsXG4gICAgICBpc01vYmlsZSxcbiAgICAgIG5hdk9wZW47XG5cbiAgICB2YXIgUmVzcG9uc2l2ZU5hdiA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgYW5pbWF0ZTogdHJ1ZSwgICAgICAgICAgICAgICAgICAgIC8vIEJvb2xlYW46IFVzZSBDU1MzIHRyYW5zaXRpb25zLCB0cnVlIG9yIGZhbHNlXG4gICAgICAgICAgdHJhbnNpdGlvbjogMjg0LCAgICAgICAgICAgICAgICAgIC8vIEludGVnZXI6IFNwZWVkIG9mIHRoZSB0cmFuc2l0aW9uLCBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgICBsYWJlbDogXCJNZW51XCIsICAgICAgICAgICAgICAgICAgICAvLyBTdHJpbmc6IExhYmVsIGZvciB0aGUgbmF2aWdhdGlvbiB0b2dnbGVcbiAgICAgICAgICBpbnNlcnQ6IFwiYmVmb3JlXCIsICAgICAgICAgICAgICAgICAvLyBTdHJpbmc6IEluc2VydCB0aGUgdG9nZ2xlIGJlZm9yZSBvciBhZnRlciB0aGUgbmF2aWdhdGlvblxuICAgICAgICAgIGN1c3RvbVRvZ2dsZTogXCJcIiwgICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yOiBTcGVjaWZ5IHRoZSBJRCBvZiBhIGN1c3RvbSB0b2dnbGVcbiAgICAgICAgICBjbG9zZU9uTmF2Q2xpY2s6IGZhbHNlLCAgICAgICAgICAgLy8gQm9vbGVhbjogQ2xvc2UgdGhlIG5hdmlnYXRpb24gd2hlbiBvbmUgb2YgdGhlIGxpbmtzIGFyZSBjbGlja2VkXG4gICAgICAgICAgb3BlblBvczogXCJyZWxhdGl2ZVwiLCAgICAgICAgICAgICAgLy8gU3RyaW5nOiBQb3NpdGlvbiBvZiB0aGUgb3BlbmVkIG5hdiwgcmVsYXRpdmUgb3Igc3RhdGljXG4gICAgICAgICAgbmF2Q2xhc3M6IFwibmF2LWNvbGxhcHNlXCIsICAgICAgICAgLy8gU3RyaW5nOiBEZWZhdWx0IENTUyBjbGFzcy4gSWYgY2hhbmdlZCwgeW91IG5lZWQgdG8gZWRpdCB0aGUgQ1NTIHRvbyFcbiAgICAgICAgICBuYXZBY3RpdmVDbGFzczogXCJqcy1uYXYtYWN0aXZlXCIsICAvLyBTdHJpbmc6IENsYXNzIHRoYXQgaXMgYWRkZWQgdG8gPGh0bWw+IGVsZW1lbnQgd2hlbiBuYXYgaXMgYWN0aXZlXG4gICAgICAgICAganNDbGFzczogXCJqc1wiLCAgICAgICAgICAgICAgICAgICAgLy8gU3RyaW5nOiAnSlMgZW5hYmxlZCcgY2xhc3Mgd2hpY2ggaXMgYWRkZWQgdG8gPGh0bWw+IGVsZW1lbnRcbiAgICAgICAgICBpbml0OiBmdW5jdGlvbigpe30sICAgICAgICAgICAgICAgLy8gRnVuY3Rpb246IEluaXQgY2FsbGJhY2tcbiAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpe30sICAgICAgICAgICAgICAgLy8gRnVuY3Rpb246IE9wZW4gY2FsbGJhY2tcbiAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKXt9ICAgICAgICAgICAgICAgLy8gRnVuY3Rpb246IENsb3NlIGNhbGxiYWNrXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVXNlciBkZWZpbmVkIG9wdGlvbnNcbiAgICAgICAgZm9yIChpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnNbaV0gPSBvcHRpb25zW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkcyBcImpzXCIgY2xhc3MgZm9yIDxodG1sPlxuICAgICAgICBhZGRDbGFzcyhodG1sRWwsIHRoaXMub3B0aW9ucy5qc0NsYXNzKTtcblxuICAgICAgICAvLyBXcmFwcGVyXG4gICAgICAgIHRoaXMud3JhcHBlckVsID0gZWwucmVwbGFjZShcIiNcIiwgXCJcIik7XG5cbiAgICAgICAgLy8gVHJ5IHNlbGVjdGluZyBJRCBmaXJzdFxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy53cmFwcGVyRWwpKSB7XG4gICAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy53cmFwcGVyRWwpO1xuXG4gICAgICAgIC8vIElmIGVsZW1lbnQgd2l0aCBhbiBJRCBkb2Vzbid0IGV4aXN0LCB1c2UgcXVlcnlTZWxlY3RvclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy53cmFwcGVyRWwpKSB7XG4gICAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLndyYXBwZXJFbCk7XG5cbiAgICAgICAgLy8gSWYgZWxlbWVudCBkb2Vzbid0IGV4aXN0cywgc3RvcCBoZXJlLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBuYXYgZWxlbWVudCB5b3UgYXJlIHRyeWluZyB0byBzZWxlY3QgZG9lc24ndCBleGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElubmVyIHdyYXBwZXJcbiAgICAgICAgdGhpcy53cmFwcGVyLmlubmVyID0gZ2V0Q2hpbGRyZW4odGhpcy53cmFwcGVyKTtcblxuICAgICAgICAvLyBGb3IgbWluaWZpY2F0aW9uXG4gICAgICAgIG9wdHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIG5hdiA9IHRoaXMud3JhcHBlcjtcblxuICAgICAgICAvLyBJbml0XG4gICAgICAgIHRoaXMuX2luaXQodGhpcyk7XG4gICAgICB9O1xuXG4gICAgUmVzcG9uc2l2ZU5hdi5wcm90b3R5cGUgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVW5hdHRhY2hlcyBldmVudHMgYW5kIHJlbW92ZXMgYW55IGNsYXNzZXMgdGhhdCB3ZXJlIGFkZGVkXG4gICAgICAgKi9cbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlU3R5bGVzKCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgXCJvcGVuZWRcIik7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyk7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGh0bWxFbCwgb3B0cy5uYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgIG5hdi5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgbmF2LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpO1xuXG4gICAgICAgIHJlbW92ZUV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudCh3aW5kb3csIFwiZm9jdXNcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChkb2N1bWVudC5ib2R5LCBcInRvdWNobW92ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJ0b3VjaHN0YXJ0XCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoZW5kXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcIm1vdXNldXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwia2V5dXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwiY2xpY2tcIiwgdGhpcywgZmFsc2UpO1xuXG4gICAgICAgIGlmICghb3B0cy5jdXN0b21Ub2dnbGUpIHtcbiAgICAgICAgICBuYXZUb2dnbGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuYXZUb2dnbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hdlRvZ2dsZS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIHRoZSBuYXZpZ2F0aW9uIG9wZW4vY2xvc2VcbiAgICAgICAqL1xuICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChoYXNBbmltRmluaXNoZWQgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAoIW5hdk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIE9wZW5zIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgKi9cbiAgICAgIG9wZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFuYXZPcGVuKSB7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgICBhZGRDbGFzcyhuYXYsIFwib3BlbmVkXCIpO1xuICAgICAgICAgIGFkZENsYXNzKGh0bWxFbCwgb3B0cy5uYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgYWRkQ2xhc3MobmF2VG9nZ2xlLCBcImFjdGl2ZVwiKTtcbiAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBvcHRzLm9wZW5Qb3M7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwiZmFsc2VcIn0pO1xuICAgICAgICAgIG5hdk9wZW4gPSB0cnVlO1xuICAgICAgICAgIG9wdHMub3BlbigpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENsb3NlcyB0aGUgbmF2aWdhdGlvblxuICAgICAgICovXG4gICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobmF2T3Blbikge1xuICAgICAgICAgIGFkZENsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcIm9wZW5lZFwiKTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhodG1sRWwsIG9wdHMubmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKG5hdlRvZ2dsZSwgXCJhY3RpdmVcIik7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSk7XG5cbiAgICAgICAgICAvLyBJZiBhbmltYXRpb25zIGFyZSBlbmFibGVkLCB3YWl0IHVudGlsIHRoZXkgZmluaXNoXG4gICAgICAgICAgaWYgKG9wdHMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgaGFzQW5pbUZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgICBoYXNBbmltRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSwgb3B0cy50cmFuc2l0aW9uICsgMTApO1xuXG4gICAgICAgICAgLy8gQW5pbWF0aW9ucyBhcmVuJ3QgZW5hYmxlZCwgd2UgY2FuIGRvIHRoZXNlIGltbWVkaWF0ZWx5XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuYXZPcGVuID0gZmFsc2U7XG4gICAgICAgICAgb3B0cy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlc2l6ZSBpcyBjYWxsZWQgb24gd2luZG93IHJlc2l6ZSBhbmQgb3JpZW50YXRpb24gY2hhbmdlLlxuICAgICAgICogSXQgaW5pdGlhbGl6ZXMgdGhlIENTUyBzdHlsZXMgYW5kIGhlaWdodCBjYWxjdWxhdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIFJlc2l6ZSB3YXRjaGVzIG5hdmlnYXRpb24gdG9nZ2xlJ3MgZGlzcGxheSBzdGF0ZVxuICAgICAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2VG9nZ2xlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKSAhPT0gXCJub25lXCIpIHtcblxuICAgICAgICAgIGlzTW9iaWxlID0gdHJ1ZTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdlRvZ2dsZSwge1wiYXJpYS1oaWRkZW5cIjogXCJmYWxzZVwifSk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbmF2aWdhdGlvbiBpcyBoaWRkZW5cbiAgICAgICAgICBpZiAobmF2LmNsYXNzTmFtZS5tYXRjaCgvKF58XFxzKWNsb3NlZChcXHN8JCkvKSkge1xuICAgICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSk7XG4gICAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fY3JlYXRlU3R5bGVzKCk7XG4gICAgICAgICAgdGhpcy5fY2FsY0hlaWdodCgpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgaXNNb2JpbGUgPSBmYWxzZTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdlRvZ2dsZSwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJmYWxzZVwifSk7XG4gICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gb3B0cy5vcGVuUG9zO1xuICAgICAgICAgIHRoaXMuX3JlbW92ZVN0eWxlcygpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRha2VzIGNhcmUgb2YgYWxsIGV2ZW4gaGFuZGxpbmdcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqIEByZXR1cm4ge3R5cGV9IHJldHVybnMgdGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBzaG91bGQgYmUgdXNlZFxuICAgICAgICovXG4gICAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGV2dCA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgIHN3aXRjaCAoZXZ0LnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRvdWNoc3RhcnRcIjpcbiAgICAgICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRvdWNobW92ZVwiOlxuICAgICAgICAgIHRoaXMuX29uVG91Y2hNb3ZlKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ0b3VjaGVuZFwiOlxuICAgICAgICBjYXNlIFwibW91c2V1cFwiOlxuICAgICAgICAgIHRoaXMuX29uVG91Y2hFbmQoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNsaWNrXCI6XG4gICAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImtleXVwXCI6XG4gICAgICAgICAgdGhpcy5fb25LZXlVcChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZm9jdXNcIjpcbiAgICAgICAgY2FzZSBcInJlc2l6ZVwiOlxuICAgICAgICAgIHRoaXMucmVzaXplKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIHdpZGdldFxuICAgICAgICovXG4gICAgICBfaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXgrKztcblxuICAgICAgICBhZGRDbGFzcyhuYXYsIG9wdHMubmF2Q2xhc3MpO1xuICAgICAgICBhZGRDbGFzcyhuYXYsIG9wdHMubmF2Q2xhc3MgKyBcIi1cIiArIHRoaXMuaW5kZXgpO1xuICAgICAgICBhZGRDbGFzcyhuYXYsIFwiY2xvc2VkXCIpO1xuICAgICAgICBoYXNBbmltRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBuYXZPcGVuID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY2xvc2VPbk5hdkNsaWNrKCk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucygpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBJRTggdGhlIHJlc2l6ZSBldmVudCB0cmlnZ2VycyB0b28gZWFybHkgZm9yIHNvbWUgcmVhc29uXG4gICAgICAgICAqIHNvIGl0J3MgY2FsbGVkIGhlcmUgYWdhaW4gb24gaW5pdCB0byBtYWtlIHN1cmUgYWxsIHRoZVxuICAgICAgICAgKiBjYWxjdWxhdGVkIHN0eWxlcyBhcmUgY29ycmVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5yZXNpemUoKTtcbiAgICAgICAgfSwgMjApO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudCh3aW5kb3csIFwiZm9jdXNcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChkb2N1bWVudC5ib2R5LCBcInRvdWNobW92ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJ0b3VjaHN0YXJ0XCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoZW5kXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcIm1vdXNldXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwia2V5dXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwiY2xpY2tcIiwgdGhpcywgZmFsc2UpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IGNhbGxiYWNrIGhlcmVcbiAgICAgICAgICovXG4gICAgICAgIG9wdHMuaW5pdCgpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIFN0eWxlcyB0byB0aGUgPGhlYWQ+XG4gICAgICAgKi9cbiAgICAgIF9jcmVhdGVTdHlsZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgc3R5bGVzIGZyb20gdGhlIDxoZWFkPlxuICAgICAgICovXG4gICAgICBfcmVtb3ZlU3R5bGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBOYXZpZ2F0aW9uIFRvZ2dsZVxuICAgICAgICovXG4gICAgICBfY3JlYXRlVG9nZ2xlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyB0b2dnbGUsIGxldCdzIGNyZWF0ZSBvbmVcbiAgICAgICAgaWYgKCFvcHRzLmN1c3RvbVRvZ2dsZSkge1xuICAgICAgICAgIHZhciB0b2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICB0b2dnbGUuaW5uZXJIVE1MID0gb3B0cy5sYWJlbDtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKHRvZ2dsZSwge1xuICAgICAgICAgICAgXCJocmVmXCI6IFwiI1wiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm5hdi10b2dnbGVcIlxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXJlIHRvIGluc2VydCB0aGUgdG9nZ2xlXG4gICAgICAgICAgaWYgKG9wdHMuaW5zZXJ0ID09PSBcImFmdGVyXCIpIHtcbiAgICAgICAgICAgIG5hdi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0b2dnbGUsIG5hdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0b2dnbGUsIG5hdik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmF2VG9nZ2xlID0gdG9nZ2xlO1xuXG4gICAgICAgIC8vIFRoZXJlIGlzIGEgdG9nZ2xlIGFscmVhZHksIGxldCdzIHVzZSB0aGF0IG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0b2dnbGVFbCA9IG9wdHMuY3VzdG9tVG9nZ2xlLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuXG4gICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvZ2dsZUVsKSkge1xuICAgICAgICAgICAgbmF2VG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9nZ2xlRWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0b2dnbGVFbCkpIHtcbiAgICAgICAgICAgIG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodG9nZ2xlRWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY3VzdG9tIG5hdiB0b2dnbGUgeW91IGFyZSB0cnlpbmcgdG8gc2VsZWN0IGRvZXNuJ3QgZXhpc3RcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENsb3NlcyB0aGUgbmF2aWdhdGlvbiB3aGVuIGEgbGluayBpbnNpZGUgaXMgY2xpY2tlZC5cbiAgICAgICAqL1xuICAgICAgX2Nsb3NlT25OYXZDbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob3B0cy5jbG9zZU9uTmF2Q2xpY2spIHtcbiAgICAgICAgICB2YXIgbGlua3MgPSBuYXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgZm9yRWFjaChsaW5rcywgZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICBhZGRFdmVudChsaW5rc1tpXSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcmV2ZW50cyB0aGUgZGVmYXVsdCBmdW5jdGlvbmFsaXR5LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICBpZiAoZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyBUaGlzIGlzIHN0cmljdGx5IGZvciBvbGQgSUVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogT24gdG91Y2ggc3RhcnQgd2UgZ2V0IHRoZSBsb2NhdGlvbiBvZiB0aGUgdG91Y2guXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuICAgICAgICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuc3RhcnRZID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICAgIHRoaXMudG91Y2hIYXNNb3ZlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgbW91c2V1cCBldmVudCBjb21wbGV0ZWx5IGhlcmUgdG8gYXZvaWRcbiAgICAgICAgICogZG91YmxlIHRyaWdnZXJpbmcgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcIm1vdXNldXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDaGVjayBpZiB0aGUgdXNlciBpcyBzY3JvbGxpbmcgaW5zdGVhZCBvZiB0YXBwaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuc3RhcnRYKSA+IDEwIHx8XG4gICAgICAgIE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5zdGFydFkpID4gMTApIHtcbiAgICAgICAgICB0aGlzLnRvdWNoSGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIE9uIHRvdWNoIGVuZCB0b2dnbGUgdGhlIG5hdmlnYXRpb24uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vblRvdWNoRW5kOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB1c2VyIGlzbid0IHNjcm9sbGluZ1xuICAgICAgICBpZiAoIXRoaXMudG91Y2hIYXNNb3ZlZCkge1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGV2ZW50IHR5cGUgaXMgdG91Y2hcbiAgICAgICAgICBpZiAoZS50eXBlID09PSBcInRvdWNoZW5kXCIpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAvLyBFdmVudCB0eXBlIHdhcyBjbGljaywgbm90IHRvdWNoXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldnQgPSBlIHx8IHdpbmRvdy5ldmVudDtcblxuICAgICAgICAgICAgLy8gSWYgaXQgaXNuJ3QgYSByaWdodCBjbGljaywgZG8gdG9nZ2xpbmdcbiAgICAgICAgICAgIGlmICghKGV2dC53aGljaCA9PT0gMyB8fCBldnQuYnV0dG9uID09PSAyKSkge1xuICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3Iga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eSwgdG9nZ2xlIHRoZSBuYXZpZ2F0aW9uIG9uIEVudGVyXG4gICAgICAgKiBrZXlwcmVzcyB0b28uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vbktleVVwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZXZ0ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFkZHMgdGhlIG5lZWRlZCBDU1MgdHJhbnNpdGlvbnMgaWYgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZFxuICAgICAgICovXG4gICAgICBfdHJhbnNpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG9wdHMuYW5pbWF0ZSkge1xuICAgICAgICAgIHZhciBvYmpTdHlsZSA9IG5hdi5zdHlsZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSBcIm1heC1oZWlnaHQgXCIgKyBvcHRzLnRyYW5zaXRpb24gKyBcIm1zXCI7XG5cbiAgICAgICAgICBvYmpTdHlsZS5XZWJraXRUcmFuc2l0aW9uID1cbiAgICAgICAgICBvYmpTdHlsZS5Nb3pUcmFuc2l0aW9uID1cbiAgICAgICAgICBvYmpTdHlsZS5PVHJhbnNpdGlvbiA9XG4gICAgICAgICAgb2JqU3R5bGUudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlcyB0aGUgaGVpZ2h0IG9mIHRoZSBuYXZpZ2F0aW9uIGFuZCB0aGVuIGNyZWF0ZXNcbiAgICAgICAqIHN0eWxlcyB3aGljaCBhcmUgbGF0ZXIgYWRkZWQgdG8gdGhlIHBhZ2UgPGhlYWQ+XG4gICAgICAgKi9cbiAgICAgIF9jYWxjSGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzYXZlZEhlaWdodCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2LmlubmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgc2F2ZWRIZWlnaHQgKz0gbmF2LmlubmVyW2ldLm9mZnNldEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbm5lclN0eWxlcyA9IFwiLlwiICsgb3B0cy5qc0NsYXNzICsgXCIgLlwiICsgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCArIFwiLm9wZW5lZHttYXgtaGVpZ2h0OlwiICsgc2F2ZWRIZWlnaHQgKyBcInB4ICFpbXBvcnRhbnR9IC5cIiArIG9wdHMuanNDbGFzcyArIFwiIC5cIiArIG9wdHMubmF2Q2xhc3MgKyBcIi1cIiArIHRoaXMuaW5kZXggKyBcIi5vcGVuZWQuZHJvcGRvd24tYWN0aXZlIHttYXgtaGVpZ2h0Ojk5OTlweCAhaW1wb3J0YW50fVwiO1xuXG4gICAgICAgIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBpbm5lclN0eWxlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gaW5uZXJTdHlsZXM7XG4gICAgICAgIH1cblxuICAgICAgICBpbm5lclN0eWxlcyA9IFwiXCI7XG4gICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIG5ldyBSZXNwb25zaXZlIE5hdlxuICAgICAqL1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2l2ZU5hdihlbCwgb3B0aW9ucyk7XG5cbiAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gcmVzcG9uc2l2ZU5hdjtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cucmVzcG9uc2l2ZU5hdiA9IHJlc3BvbnNpdmVOYXY7XG4gIH1cblxufShkb2N1bWVudCwgd2luZG93LCAwKSk7XG4iLCJ2YXIgbmF2ID0gcmVzcG9uc2l2ZU5hdihcIi5uYXYtY29sbGFwc2VcIik7XG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oICQgKSB7XG5cbiAgJChcIltkYXRhLWZhbmN5Ym94XVwiKS5mYW5jeWJveCh7XG5cdFx0bG9vcCAgICAgOiB0cnVlXG5cdH0pO1xuXG59KTtcbiJdfQ==
