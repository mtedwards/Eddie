jQuery(document).ready(function( $ ) {

  if($("#navToggle").length){
    var nav = responsiveNav(".nav-collapse", {
       customToggle: "#navToggle"
    });
  }

  $("[data-fancybox]").fancybox({
		loop     : true
	});

});
