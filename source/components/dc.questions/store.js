window.dcStore = {
  timeout: 2000,
  paths: {
    getTable: '/components/dc.questions/table.json',
    src: '/template/images/',
  },
  filter: {
    controls: [
      {
        code: 'id',
        count: 1,
        type: 'text',
        label: 'Номер заседания',
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
