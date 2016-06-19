/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/*!
 * smoothState.js is jQuery plugin that progressively enhances
 * page loads to behave more like a single-page application.
 *
 * @author  Miguel Ángel Pérez   reachme@miguel-perez.com
 * @see     http://smoothstate.com
 *
 */
!function(t){"use strict";"object"==typeof module&&"object"==typeof module.exports?t(require("jquery"),window,document):t(jQuery,window,document)}(function(t,e,n,o){"use strict";if(!e.history.pushState)return t.fn.smoothState=function(){return this},void(t.fn.smoothState.options={});if(!t.fn.smoothState){var r=t("html, body"),a=e.console,i={debug:!1,anchors:"a",hrefRegex:"",forms:"form",allowFormCaching:!1,repeatDelay:500,blacklist:".no-smoothState",prefetch:!1,prefetchOn:"mouseover touchstart",prefetchBlacklist:".no-prefetch",cacheLength:0,loadingClass:"is-loading",scroll:!0,alterRequest:function(t){return t},alterChangeState:function(t,e,n){return t},onBefore:function(t,e){},onStart:{duration:0,render:function(t){}},onProgress:{duration:0,render:function(t){}},onReady:{duration:0,render:function(t,e){t.html(e)}},onAfter:function(t,e){}},s={isExternal:function(t){var n=t.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);return"string"==typeof n[1]&&n[1].length>0&&n[1].toLowerCase()!==e.location.protocol?!0:"string"==typeof n[2]&&n[2].length>0&&n[2].replace(new RegExp(":("+{"http:":80,"https:":443}[e.location.protocol]+")?$"),"")!==e.location.host},stripHash:function(t){return t.replace(/#.*/,"")},isHash:function(t,n){n=n||e.location.href;var o=t.indexOf("#")>-1,r=s.stripHash(t)===s.stripHash(n);return o&&r},translate:function(e){var n={dataType:"html",type:"GET"};return e="string"==typeof e?t.extend({},n,{url:e}):t.extend({},n,e)},shouldLoadAnchor:function(t,e,n){var r=t.prop("href");return!(s.isExternal(r)||s.isHash(r)||t.is(e)||t.prop("target")||typeof n!==o&&""!==n&&-1===t.prop("href").search(n))},clearIfOverCapacity:function(t,e){return Object.keys||(Object.keys=function(t){var e,n=[];for(e in t)Object.prototype.hasOwnProperty.call(t,e)&&n.push(e);return n}),Object.keys(t).length>e&&(t={}),t},storePageIn:function(e,n,o,r,a){var i=t("<html></html>").append(t(o));return e[n]={status:"loaded",title:i.find("title").first().text(),html:i.find("#"+r),doc:o,state:a},e},triggerAllAnimationEndEvent:function(e,n){n=" "+n||"";var o=0,r="animationstart webkitAnimationStart oanimationstart MSAnimationStart",a="animationend webkitAnimationEnd oanimationend MSAnimationEnd",i="allanimationend",l=function(n){t(n.delegateTarget).is(e)&&(n.stopPropagation(),o++)},u=function(n){t(n.delegateTarget).is(e)&&(n.stopPropagation(),o--,0===o&&e.trigger(i))};e.on(r,l),e.on(a,u),e.on("allanimationend"+n,function(){o=0,s.redraw(e)})},redraw:function(t){t.height()}},l=function(n){if(null!==n.state){var o=e.location.href,r=t("#"+n.state.id),a=r.data("smoothState"),i=a.href!==o&&!s.isHash(o,a.href),l=n.state!==a.cache[a.href].state;(i||l)&&(l&&a.clear(a.href),a.load(o,!1))}},u=function(i,l){var u=t(i),c=u.prop("id"),f=null,h=!1,d={},p={},g=e.location.href,m=function(t){t=t||!1,t&&d.hasOwnProperty(t)?delete d[t]:d={},u.data("smoothState").cache=d},y=function(e,n){n=n||t.noop;var o=s.translate(e);if(d=s.clearIfOverCapacity(d,l.cacheLength),!d.hasOwnProperty(o.url)||"undefined"!=typeof o.data){d[o.url]={status:"fetching"};var r=t.ajax(o);r.done(function(t){s.storePageIn(d,o.url,t,c),u.data("smoothState").cache=d}),r.fail(function(){d[o.url].status="error"}),n&&r.always(n)}},v=function(){if(f){var e=t(f,u);if(e.length){var n=e.offset().top;r.scrollTop(n)}f=null}},S=function(o){var i="#"+c,s=d[o]?t(d[o].html.html()):null;s.length?(n.title=d[o].title,u.data("smoothState").href=o,l.loadingClass&&r.removeClass(l.loadingClass),l.onReady.render(u,s),u.one("ss.onReadyEnd",function(){h=!1,l.onAfter(u,s),l.scroll&&v(),O(u)}),e.setTimeout(function(){u.trigger("ss.onReadyEnd")},l.onReady.duration)):!s&&l.debug&&a?a.warn("No element with an id of "+i+" in response from "+o+" in "+d):e.location=o},w=function(t,n,o){var i=s.translate(t);"undefined"==typeof n&&(n=!0),"undefined"==typeof o&&(o=!0);var f=!1,h=!1,g={loaded:function(){var t=f?"ss.onProgressEnd":"ss.onStartEnd";h&&f?h&&S(i.url):u.one(t,function(){S(i.url),o||m(i.url)}),n&&(p=l.alterChangeState({id:c},d[i.url].title,i.url),d[i.url].state=p,e.history.pushState(p,d[i.url].title,i.url)),h&&!o&&m(i.url)},fetching:function(){f||(f=!0,u.one("ss.onStartEnd",function(){l.loadingClass&&r.addClass(l.loadingClass),l.onProgress.render(u),e.setTimeout(function(){u.trigger("ss.onProgressEnd"),h=!0},l.onProgress.duration)})),e.setTimeout(function(){d.hasOwnProperty(i.url)&&g[d[i.url].status]()},10)},error:function(){l.debug&&a?a.log("There was an error loading: "+i.url):e.location=i.url}};d.hasOwnProperty(i.url)||y(i),l.onStart.render(u),e.setTimeout(function(){l.scroll&&r.scrollTop(0),u.trigger("ss.onStartEnd")},l.onStart.duration),g[d[i.url].status]()},E=function(e){var n,o=t(e.currentTarget);s.shouldLoadAnchor(o,l.blacklist,l.hrefRegex)&&!h&&(e.stopPropagation(),n=s.translate(o.prop("href")),n=l.alterRequest(n),y(n))},b=function(e){var n=t(e.currentTarget);if(!e.metaKey&&!e.ctrlKey&&s.shouldLoadAnchor(n,l.blacklist,l.hrefRegex)&&(e.stopPropagation(),e.preventDefault(),!T())){A();var o=s.translate(n.prop("href"));h=!0,f=n.prop("hash"),o=l.alterRequest(o),l.onBefore(n,u),w(o)}},C=function(e){var n=t(e.currentTarget);if(!n.is(l.blacklist)&&(e.preventDefault(),e.stopPropagation(),!T())){A();var r={url:n.prop("action"),data:n.serialize(),type:n.prop("method")};h=!0,r=l.alterRequest(r),"get"===r.type.toLowerCase()&&(r.url=r.url+"?"+r.data),l.onBefore(n,u),w(r,o,l.allowFormCaching)}},P=0,T=function(){var t=null===l.repeatDelay,e=parseInt(Date.now())>P;return!(t||e)},A=function(){P=parseInt(Date.now())+parseInt(l.repeatDelay)},O=function(t){l.anchors&&l.prefetch&&t.find(l.anchors).not(l.prefetchBlacklist).on(l.prefetchOn,null,E)},x=function(t){l.anchors&&(t.on("click",l.anchors,b),O(t)),l.forms&&t.on("submit",l.forms,C)},R=function(){var t=u.prop("class");u.removeClass(t),s.redraw(u),u.addClass(t)};return l=t.extend({},t.fn.smoothState.options,l),null===e.history.state?(p=l.alterChangeState({id:c},n.title,g),e.history.replaceState(p,n.title,g)):p={},s.storePageIn(d,g,n.documentElement.outerHTML,c,p),s.triggerAllAnimationEndEvent(u,"ss.onStartEnd ss.onProgressEnd ss.onEndEnd"),x(u),{href:g,cache:d,clear:m,load:w,fetch:y,restartCSSAnimations:R}},c=function(e){return this.each(function(){var n=this.tagName.toLowerCase();this.id&&"body"!==n&&"html"!==n&&!t.data(this,"smoothState")?t.data(this,"smoothState",new u(this,e)):!this.id&&a?a.warn("Every smoothState container needs an id but the following one does not have one:",this):"body"!==n&&"html"!==n||!a||a.warn("The smoothstate container cannot be the "+this.tagName+" tag")})};e.onpopstate=l,t.smoothStateUtility=s,t.fn.smoothState=c,t.fn.smoothState.options=i}});

// Smooth page transitions
// TODO: If url is the same, don't animate

$(function(){
  'use strict';
  var options = {
    prefetch: true,
    cacheLength: 16,
    onStart: {
      duration: 150, // Duration of our animation
      render: function ($container) {
        // Add your CSS animation reversing class
        $container.addClass('is-exiting');

        // Restart your animation
        smoothState.restartCSSAnimations();
      }
    },
    onReady: {
      duration: 0,
      render: function ($container, $newContent) {
        // Remove your CSS animation reversing class
        $container.removeClass('is-exiting');

        // Inject the new content
        $container.html($newContent);
      }
    }
  },
  smoothState = $('#main').smoothState(options).data('smoothState');
});
