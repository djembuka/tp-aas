window.filterTableStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/filter-table/table.json',
    src: '/template/images/',
  },
  filter: {
    controls: [
      {
        code: 'id',
        count: 1,
        type: 'text',
        label: 'Номер (ID)',
        name: 'ID',
        value: '',
      },
      {
        code: 'object',
        count: 3,
        type: 'text',
        label: 'Объект проверки',
        name: 'OBJECT',
        value: '',
      },
      {
        code: 'author',
        count: 3,
        type: 'text',
        label: 'Куратор проверки',
        name: 'AUTHOR',
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
        label: 'Выбрать дату',
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
