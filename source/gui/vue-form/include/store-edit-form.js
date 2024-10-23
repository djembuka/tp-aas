window.reportFormOZOStore = {
  autosaveTimeoutId: null,
  reportId: 'idOZO',
  hidden: [
    {
      name: 'element_id',
      value: 'idOZO',
    },
    {
      name: 'PROPERTY[447][0]',
      value: 'Поддержка Twin px Support',
    },
  ],
  formBlocks: [
    {
      invalid: false,
      title: 'Оказание дополнительных услуг',
      controls: [
        {
          name: 'FORM_CONTROL_1',
          value: 'value1',
          checked: true,
          title: 'Бухгалтерские услуги',
          text: 'Оказываю бухгалтерские услуги.',
        },
        {
          name: 'FORM_CONTROL_2',
          value: 'value2',
          checked: false,
          title: 'Юридические услуги',
          text: 'Оказываю юридические услуги',
        },
        {
          name: 'FORM_CONTROL_3',
          value: 'value3',
          checked: false,
          title: 'Не оказываю никаких услуг',
          text: 'Я не предлагаю свои клиентам никаких дополнительных услуг, кроме аудита.',
        },
        {
          name: 'FORM_CONTROL_4',
          value: 'value4',
          checked: false,
          title: 'Бухгалтерские услуги',
          text: 'Оказываю бухгалтерские услуги.',
        },
      ],
    },
    {
      title: 'Аудит особо значимых организаций 2017-2021',
      controls: [
        {
          name: 'FORM_CONTROL_5',
          value: 'value1',
          checked: true,
          title: 'Проводили ОЗО',
          text: 'Вы проводили аудит ОЗО с 2017 по 2021',
        },
        {
          name: 'FORM_CONTROL_5',
          value: 'value2',
          checked: false,
          title: 'Не проводили ОЗО',
          text: 'Вы не проводили аудит ОЗО с 2017 по 2021',
        },
      ],
    },
    {
      title: 'Категория субъекта предпринимательства',
      controls: [
        {
          name: 'FORM_CONTROL_6',
          label: 'Категория субъекта предпринимательства',
          value: [
            {
              label: 'Микро',
              code: 'micro',
            },
            {
              label: 'Основной',
              code: 'basic',
            },
          ],
          selected: { label: 'Основной', code: 'basic' },
          type: 'select',
        },
      ],
    },
  ],
  audiOZOList: {
    title: 'Список организаций где был проведен аудит ОЗО',
    text: 'Перечислите все аудит ОЗО с 2017 по 2021 год. Все поля формы обязательны.',
    template: {
      controls: [
        {
          name: '179',
          label: 'Дата проведения аудита',
          value: '',
          type: 'date',
        },
        {
          name: '190',
          label: 'Год аудита',
          value: '',
          type: 'text',
        },
        {
          name: '180',
          label: 'Место фактического проведения аудита',
          value: '',
          type: 'text',
        },
        {
          name: '188',
          label: 'Тип ОЗО',
          value: '',
          type: 'text',
        },
        {
          name: '181',
          label: 'Наименования ОЗО',
          value: '',
          type: 'text',
        },
        {
          name: '182',
          label: 'ОГРН ОЗО',
          value: '',
          type: 'text',
        },
        {
          name: '183',
          label: 'Мнение, выраженное в аудиторском заключении',
          value: [
            {
              label: 'Положительное',
              code: 'positive',
            },
            {
              label: 'Отрицательное',
              code: 'negative',
            },
          ],
          selected: { label: 'Положительное', code: 'positive' },
          type: 'select',
        },
      ],
    },
    companies: [
      {
        id: 'companyId',
        hidden: [
          {
            name: 'infoblockId',
            value: 'companyId',
          },
        ],
        controls: [
          {
            name: '179',
            label: 'Дата проведения аудита',
            value: '31.05.2021',
            type: 'date',
          },
          {
            name: '190',
            label: 'Год аудита',
            value: '',
            type: 'text',
          },
          {
            name: '180',
            label: 'Место фактического проведения аудита',
            value: '',
            type: 'text',
          },
          {
            name: '188',
            label: 'Тип ОЗО',
            value: 'd',
            type: 'text',
          },
          {
            name: '181',
            label: 'Наименования ОЗО',
            value: 'Name',
            type: 'text',
          },
          {
            name: '182',
            label: 'ОГРН ОЗО',
            value: 'd',
            type: 'text',
          },
          {
            name: '183',
            label: 'Мнение, выраженное в аудиторском заключении',
            value: [
              {
                label:
                  'Положительное заключение с очень хорошим положительным отзывом о деятельности особо значимой компании',
                code: 'positive',
              },
              {
                label:
                  'Другое заключение с очень хорошим положительным отзывом о деятельности особо значимой компании',
                code: 'negative',
              },
            ],
            selected: {
              label:
                'Положительное заключение с очень хорошим положительным отзывом о деятельности особо значимой компании',
              code: 'positive',
            },
            type: 'select',
          },
        ],
      },
    ],
  },
  agreement: {
    name: 'FORM_AGREEMENT',
    value: 'Y',
    checked: false,
    text: 'Я принимаю <a href="/" target="_blank">условия Пользовательского соглашения</a> и даю своё согласие СРО ААС на обработку моей персональной информации на условиях, определенных Политикой конфиденциальности.',
    invalid: false,
  },
};
