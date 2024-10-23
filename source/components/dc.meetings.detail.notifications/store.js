window.dcMeetings = {
  timeout: 2000,
  paths: {
    getTable: '/components/dc.meetings.detail.notifications/table.json',
    src: '/template/images/',
  },
  filter: {
    controls: [
      {
        code: 'object',
        count: 1,
        type: 'text',
        label: 'Объект',
        name: 'OBJECT',
        value: '',
      },
      {
        code: 'question',
        count: 1,
        type: 'text',
        label: 'Номер вопроса',
        name: 'QUESTION',
        value: '',
      },
      {
        code: 'case',
        count: 1,
        type: 'text',
        label: 'Номер дела',
        name: 'CASE',
        value: '',
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
