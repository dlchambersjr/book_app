'use strict';

// Monitor the select buttons
$('.select-button').on('click', function () {
  $(this).next().removeClass('hide-me');
  $(this).hide();
});
