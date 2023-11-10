document
  .querySelectorAll(
    '.table-responsive-arrow-left, .table-responsive-arrow-right'
  )
  .forEach((arrow) => {
    const table = arrow.closest('.table-responsive');
    arrow.addEventListener('mouseenter', () => {
      table.scroll(100);
    });

    arrow.addEventListener('mouseleave', () => {
      table.scroll(100);
    });
  });
