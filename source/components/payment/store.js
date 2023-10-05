window.paymentStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/payment/table.json?format=json',
    src: '/template/images/',
  },
  quickFilterBlocks: [
    {
      code: 'balance',
      title: 'Баланс',
      num: '1 500.45 ₽',
      text: 'Счет для оплаты взносов',
    },
  ],
  warning:
    '<span>Ближайшая уплата взноса менее через 15 дней. На вашем счету не хватает 234 рубля. Пополните ваш баланс.</span><a href="" class="btn btn-danger btn-md">Пополнить баланс</a>',
  filter: {
    controls: [],
  },
  table: {
    heading: 'Последние операции',
    link: '<a href="">Все платежи</a>',
    html: '',
    locationSearch: '',
    sortField: '',
    sortType: '',
    PAGEN_1: 1,
  },
  query: {
    sortField: '',
    sortType: '',
    locationSearch: '',
    PAGEN_1: '',
  },
};
