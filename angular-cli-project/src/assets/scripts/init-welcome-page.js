$(document).ready(function(){
  $('.button-collapse').sideNav();
  $('.parallax').parallax();
  $('.slider').slider({full_width: true});
  //$('.modal-trigger').leanModal(); // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
      ready: function() { }, // Callback for Modal open
      complete: function() { } // Callback for Modal close
    }
  );
});
