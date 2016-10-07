// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var deltaDown = 1;
var deltaUp = 1;
var navbarHeight = $('#navigation-bar').outerHeight();

$(window).scroll(function(event) {
  didScroll = true;
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 200);

function hasScrolled() {
  var st = $(this).scrollTop();



  // If they scrolled down and are past the navbar, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > navbarHeight) {
    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= deltaDown)
      return;
    // Scroll Down
    $('#navigation-bar').addClass('nav-up');
    $('.dropdown-button').dropdown('close');
  } else {
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= deltaUp)
        return;
    // Scroll Up
    if (st + $(window).height() < $(document).height()) {
      $('#navigation-bar').removeClass('nav-up');
    }
  }
  lastScrollTop = st;
}
