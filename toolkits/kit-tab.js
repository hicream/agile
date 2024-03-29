/* ========================================================
 * v2.3.1
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element);
  };

  Tab.prototype = {

    //never work
    constructor: Tab ,

    show: function () {
      var $this = this.element , $ul = $this.closest('ul:not(.dropdown-menu)') , selector = $this.attr('data-target') , previous , $target , e;

      if (!selector) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return;
      //if ( $this.hasClass('active') ) return;

      previous = $ul.find('.active:last')[0];

      //what?
      e = $.Event('show', { relatedTarget: previous });
      $this.trigger(e);
      if (e.isDefaultPrevented()) return;

      $target = $(selector);

      this.activate($this.parent('li'), $ul);
      //this.activate($this, $ul);
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      });
    },

  activate: function ( element, container, callback) {
      var $active = container.find('> .active') , transition = callback && $.support.transition && $active.hasClass('fade');

      function next() {
        $active .removeClass('active') .find('> .dropdown-menu > .active') .removeClass('active');

        element.addClass('active');

        if (transition) {
          element[0].offsetWidth; // reflow for transition
          element.addClass('in');
        } else {
          element.removeClass('fade');
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active');
        }

        callback && callback();
      }

      transition ?  $active.one($.support.transition.end, next) : next();

      $active.removeClass('in');
    }
  }


 /* TAB PLUGIN DEFINIdata-toggle="tab"TION
  * ===================== */

  var old = $.fn.tab;

  $.fn.tab = function () {
    return this.each(function () {
      var $this = $(this) , data = $this.data('tab');
      if (!data) $this.data('tab', (data = new Tab(this)));
      data['show']();
    })
  }

  //$.fn.tab.Constructor = Tab;


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault();
    $(this).tab();
  })

}(window.jQuery);
