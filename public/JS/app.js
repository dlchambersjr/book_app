'use strict';

// Monitor the select buttons
$('.select-button').on('click', function () {
  $(this).next().removeClass('hide-me');
});

// // Monitor Delete buttons
// $('delete').on('click', function(event) {
//   $.ajax({
//     url:/delete/
//   })
// })