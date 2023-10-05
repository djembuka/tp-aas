window.excerptsMultipleGeneratePaths = {
  response: '/components/excerpts-multiple-generate/response.json',
  onMounted: '/components/excerpts-multiple-generate/response.json',
};

window.excerptsMultipleGenerateStore = {
  status: '',
  generated: {},
  employees: [
    {
      id: '456dfdsdf',
      name: 'Савельев Максим Олегович',
      ornz: '29906002124',
      checked: false,
    },
    {
      id: '256dfdsdf',
      name: 'Савельева Мария Евгеньевна',
      ornz: '39906002124',
      checked: false,
    },
    {
      id: '356dfdsdf',
      name: 'Савельев Роман Максимович',
      ornz: '49906002124',
      checked: false,
    },
    {
      id: '556dfdsdf',
      name: 'Савельева Анна Максимовна',
      ornz: '59906002124',
      checked: false,
    },
  ],
  bottomPanel: {
    select: {
      name: 'type',
      options: [
        {
          label: 'Стандартная выписка',
          code: '1',
        },
        {
          label: 'Расширенная выписка',
          code: '2',
        },
        {
          label: 'Справка о мерах дисциплинарного воздействия',
          code: '3',
        },
      ],
    },
  },
};
