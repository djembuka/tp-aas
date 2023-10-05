window.addEventListener('load', function () {
  $('#appealChangeRegistrySelect').ikSelect();
  $('#appealChangeRegistrySelect').change(function (e) {
    $('[data-id="' + e.target.value + '"] .b-collapse-block__head').click();
    window.scrollTo({
      top:
        document
          .querySelector('[data-id="' + e.target.value + '"]')
          .getBoundingClientRect().top +
        window.scrollY -
        100,
      behavior: 'smooth',
    });
  });
});
