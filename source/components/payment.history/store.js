window.paymentHistoryStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/payment.history/table.json?format=json',
    src: '/template/images/',
  },
  quickFilterBlocks: [],
  filter: {
    controls: [
      {
        code: 'type',
        type: 'select',
        label: 'Тип операции',
        name: 'TYPE',
        options: [
          {
            label: 'Все',
            code: 'all',
          },
          {
            label: 'Приход',
            code: 'income',
          },
          {
            label: 'Списание',
            code: 'outcome',
          },
        ],
        selected: {
          label: 'Все',
          code: 'all',
        },
      },
      {
        code: 'date',
        type: 'date',
        label: 'Период',
        name: 'DATE',
        value: [null, null],
      },
    ],
  },
  table: {
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
