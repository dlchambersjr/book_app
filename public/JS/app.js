'use strict';
console.log('app.js');
$('.select-button').on('click', function() {
  console.log('test');
  $(this).next().removeClass('hide-me');
});
