window.BX = {
  bitrix_sessid() {
    return 'SESSID';
  },
  ajax: {
    runComponentAction(_, type, data) {
      let result;
      switch (type) {
        case 'profiles':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: [
                {
                  id: 1,
                  name: 'Общий профиль',
                  newAppealsCount: 99,
                  excelExportSupport: false,
                  default: true,
                },
                {
                  id: 2,
                  name: 'Профиль администратора',
                  newAppealsCount: 0,
                  default: false,
                },
                {
                  id: 3,
                  name: 'Профиль пользователя',
                },
                {
                  id: 4,
                  name: 'Профиль нового пользователя',
                },
                {
                  id: 5,
                  name: 'Профиль пользователя очень длинный',
                },
                {
                  id: 6,
                  name: 'Профиль модератора',
                },
                {
                  id: 7,
                  name: 'Профиль для чтения',
                },
              ],
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'profiles error' }] });
          });
          break;

        case 'setDeafultProfile':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: null,
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'setDeafultProfile error' }] });
          });
          break;

        case 'predefinedFilters':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: {
                predefinedFiltersTitle: 'Заголовок',
                filtersList: [
                  {
                    id: 1,
                    name: 'Название',
                    value: '5',
                    selectable: true,
                  },
                ],
              },
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'predefinedFilters error' }] });
          });
          break;

        case 'columnsNames':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: [
                {
                  id: 1,
                  name: 'Номер (ID)',
                  type: 'id',
                },
                {
                  id: 2,
                  name: 'Дата создания',
                  type: 'date',
                },
                {
                  id: 3,
                  name: 'Автор',
                  type: 'author',
                },
                {
                  id: 4,
                  name: 'Объект обращения',
                  type: 'object',
                },
                {
                  id: 5,
                  name: 'Тип обращения',
                  type: 'type',
                },
                {
                  id: 6,
                  name: 'Статус',
                  type: 'status',
                },
              ],
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'columnsNames error' }] });
          });
          break;

        case 'filters':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: [
                {
                  id: 1,
                  code: 'id',
                  count: 1,
                  type: 'text',
                  label: 'Номер (ID)',
                  name: 'ID',
                  value: '',
                },
                {
                  id: 2,
                  code: 'object',
                  count: 3,
                  type: 'text',
                  label: 'Объект изменений',
                  name: 'OBJECT',
                  value: '',
                },
                {
                  id: 3,
                  code: 'author',
                  count: 3,
                  type: 'text',
                  label: 'Автор (ФИО, ОРНЗ)',
                  name: 'AUTHOR',
                  value: '',
                },
                {
                  id: 4,
                  code: 'status',
                  type: 'select',
                  label: 'Статус обращения',
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
                  id: 5,
                  code: 'type',
                  type: 'select',
                  label: 'Тип обращения',
                  name: 'TYPE',
                  options: [
                    {
                      label: 'Все',
                      code: '',
                    },
                    {
                      label: 'Изменение в реестре',
                      code: 'prop5',
                    },
                    {
                      label: 'Жалоба',
                      code: 'prop6',
                    },
                    {
                      label: 'Заявка',
                      code: 'prop7',
                    },
                  ],
                  selected: {
                    label: 'Все',
                    code: '',
                  },
                },
                {
                  id: 6,
                  code: 'date',
                  type: 'date',
                  label: 'Дата',
                  name: 'DATE',
                  value: [null, null],
                },
              ],
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'filters error' }] });
          });
          break;

        case 'appeals':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: {
                resultCount: 10,
                maxCountPerRequest: 20,
                startIndex: 5,
                excelLink: false,
                items: [
                  {
                    url: '/',
                    cells: [
                      {
                        id: 1,
                        type: 'id',
                        value: '35',
                      },
                      {
                        id: 3,
                        type: 'date',
                        value: '18 мая 2021<br>15:12:41',
                      },
                      {
                        id: 4,
                        type: 'author',
                        value: 'Савельева Мария Евгеньевна<br>1398471982475',
                      },
                      {
                        id: 5,
                        type: 'object',
                        value: 'Петров Петр Иванович<br>2200605151435',
                      },
                      {
                        id: 5,
                        type: 'type',
                        value: 'Изменение в реестре',
                      },
                      {
                        id: 5,
                        type: 'status',
                        value: 'На рассмотрении',
                      },
                    ],
                  },
                  {
                    url: '',
                    cells: [
                      {
                        id: 1,
                        type: 'id',
                        value: '35',
                      },
                      {
                        id: 3,
                        type: 'date',
                        value: '18 мая 2021<br>15:12:41',
                      },
                      {
                        id: 4,
                        type: 'author',
                        value: 'Савельева Мария Евгеньевна<br>1398471982475',
                      },
                      {
                        id: 5,
                        type: 'object',
                        value: 'Петров Петр Иванович<br>2200605151435',
                      },
                      {
                        id: 5,
                        type: 'type',
                        value: 'Изменение в реестре',
                      },
                      {
                        id: 5,
                        type: 'status',
                        value: 'На рассмотрении',
                      },
                    ],
                  },
                  {
                    url: '',
                    cells: [
                      {
                        id: 1,
                        type: 'id',
                        value: '35',
                      },
                      {
                        id: 3,
                        type: 'date',
                        value: '18 мая 2021<br>15:12:41',
                      },
                      {
                        id: 4,
                        type: 'author',
                        value: 'Савельева Мария Евгеньевна<br>1398471982475',
                      },
                      {
                        id: 5,
                        type: 'object',
                        value: 'Петров Петр Иванович<br>2200605151435',
                      },
                      {
                        id: 5,
                        type: 'type',
                        value: 'Изменение в реестре',
                      },
                      {
                        id: 5,
                        type: 'status',
                        value: 'На рассмотрении',
                      },
                    ],
                  },
                  {
                    url: '',
                    cells: [
                      {
                        id: 1,
                        type: 'id',
                        value: '35',
                      },
                      {
                        id: 3,
                        type: 'date',
                        value: '18 мая 2021<br>15:12:41',
                      },
                      {
                        id: 4,
                        type: 'author',
                        value: 'Савельева Мария Евгеньевна<br>1398471982475',
                      },
                      {
                        id: 5,
                        type: 'object',
                        value: 'Петров Петр Иванович<br>2200605151435',
                      },
                      {
                        id: 5,
                        type: 'type',
                        value: 'Изменение в реестре',
                      },
                      {
                        id: 5,
                        type: 'status',
                        value: 'На рассмотрении',
                      },
                    ],
                  },
                  {
                    url: '',
                    cells: [
                      {
                        id: 1,
                        type: 'id',
                        value: '35',
                      },
                      {
                        id: 3,
                        type: 'date',
                        value: '18 мая 2021<br>15:12:41',
                      },
                      {
                        id: 4,
                        type: 'author',
                        value: 'Савельева Мария Евгеньевна<br>1398471982475',
                      },
                      {
                        id: 5,
                        type: 'object',
                        value: 'Петров Петр Иванович<br>2200605151435',
                      },
                      {
                        id: 5,
                        type: 'type',
                        value: 'Изменение в реестре',
                      },
                      {
                        id: 5,
                        type: 'status',
                        value: 'На рассмотрении',
                      },
                    ],
                  },
                ],
              },
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'appeals error' }] });
          });
          break;

        // case 'setDefaultFiltersValues':
        //   result = new Promise((resolve, reject) => {
        //     resolve({
        //       status: 'success',
        //       data: [],
        //       errors: [{ message: 'Error message' }],
        //     });
        //     // reject({ errors: [{ code: 2, message: 'setDefaultFiltersValues error' }] });
        //   });
        //   break;

        // case 'defaultFiltersValue':
        //   result = new Promise((resolve, reject) => {
        //     resolve({
        //       status: 'success',
        //       data: [],
        //       errors: [{ message: 'Error message' }],
        //     });
        //     // reject({ errors: [{ code: 2, message: 'defaultFiltersValue error' }] });
        //   });
        //   break;

        case 'setDefaultSort':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: null,
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'setDefaultSort error' }] });
          });
          break;

        case 'defaultSort':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: {
                columnSort: '1',
                sortType: 0,
              },
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'defaultSort error' }] });
          });
          break;
      }

      return result;
    },
  },
};
