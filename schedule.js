$(document).ready(function() {
    $('.dropdown ul li').click(function() {
      $('.dropdown ul li').each(function() {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        }
      });
      $(this).addClass('selected');
      $('.dropdown h1').html($(this).html()).removeClass().addClass('selected-' + ($(this).index()+1));
    });
  });