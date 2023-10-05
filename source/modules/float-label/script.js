$('.b-float-label input, .b-float-label textarea')
  .each(function () {
    if ($.trim($(this).val()) !== '') {
      $(this).siblings('label').addClass('active');
    }
  })
  .blur(function () {
    var $input = $(this),
      $label = $input.siblings('label');
    if ($input.val() !== '') {
      $label.addClass('active');
    } else {
      $label.removeClass('active');
    }
  });
document.querySelectorAll('.password-invisible').forEach(function (element) {
  element.addEventListener('click', function (e) {
    e.preventDefault();
    element.classList.toggle('inverse');
    var input = element.parentNode.querySelector('input');
    if (input.getAttribute('type') === 'password') {
      input.setAttribute('type', 'text');
    } else if (input.getAttribute('type') === 'text') {
      input.setAttribute('type', 'password');
    }
  });
});
