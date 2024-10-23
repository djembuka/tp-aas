window.dcStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/dc.cases/table.json',
    src: '/template/images/',
  },
  filter: {
    controls: [
      {
        code: 'id',
        count: 1,
        type: 'text',
        label: 'Номер дела',
        name: 'ID',
        value: '',
      },
      {
        code: 'object',
        count: 3,
        type: 'text',
        label: 'Объект',
        name: 'OBJECT',
        value: '',
      },
      {
        code: 'status',
        type: 'select',
        label: 'Статус проверки',
        name: 'STATUS',
        newOptionCode: 'prop1',
        options: [
          {
            label: 'Все',
            code: '',
          },
          {
            label: 'Ожидает рассмотрения',
            code: 'prop1',
          },
          {
            label: 'Отклоненные',
            code: 'prop2',
          },
          {
            label: 'В работе',
            code: 'prop3',
          },
          {
            label: 'Выполненые',
            code: 'prop4',
          },
        ],
        selected: {
          label: 'Все',
          code: '',
        },
      },
      {
        code: 'date',
        type: 'date',
        label: 'Дата создания',
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
