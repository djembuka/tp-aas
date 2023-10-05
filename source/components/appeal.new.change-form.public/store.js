window.appealNewChangeFormStore = {
  hidden: [
    {
      name: 'APPEAL_ID',
      value: 116252,
    },
    {
      name: 'FORM_ID',
      value: 108719,
    },
  ],
  docsBlock: null,
  controlsBlock: {
    title: 'Содержание жалобы',
    text: '',
    controls: [
      {
        property: 50,
        word: 'PROPERTY',
        sort: 0,
        label: 'ОРНЗ объекта жалобы *',
        type: 'ornz',
        required: true,
        value: [''],
        multy: true,
        pattern: '^\\d{11}$',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'Текущие данные',
          comment:
            'ОРНЗ аудитора или аудиторской организации, на которую вы хотите пожаловаться.',
        },
      },
      {
        property: 51,
        word: 'PROPERTY',
        sort: 1,
        label: 'Суть жалобы *',
        type: 'textarea',
        required: true,
        value: '',
        multy: false,
        pattern: '',
        completeBlock: {
          title: '',
          value: '',
          comment:
            'Опишите в свободной форме, в чем, по вашему мнению, состоит нарушение.',
        },
      },
      {
        property: 93,
        word: 'PROPERTY',
        sort: 2,
        label: 'Что нарушено? *',
        type: 'textarea',
        required: true,
        value: '',
        multy: false,
        pattern: '',
        completeBlock: {
          title: '',
          value: '',
          comment:
            'Какие нормы (пункты, статьи нормативных актов), по вашему мнению, нарушил аудитор или аудиторская организация.',
        },
      },
      {
        property: 52,
        word: 'PROPERTY',
        sort: 3,
        label: 'Чем подтверждаются ваши доводы? *',
        type: 'textarea',
        required: true,
        value: '',
        multy: false,
        pattern: '',
        completeBlock: {
          title: '',
          value: '',
          comment:
            'Из каких документов или публичной информации следует наличие нарушения.',
        },
      },
      {
        property: 94,
        word: 'PROPERTY',
        sort: 4,
        label: 'Какие меры вы ожидаете от СРО? *',
        type: 'textarea',
        required: true,
        value: '',
        multy: false,
        pattern: '',
        completeBlock: {
          title: '',
          value: '',
          comment:
            'Что, на ваш взгляд, может предпринять СРО ААС? Например, провести проверку, применить меры дисциплинарного воздействия (какие?).',
        },
      },
    ],
  },
  confirmDocsBlock: {
    title: 'Документы',
    text: '',
    items: [
      {
        id: 0,
        checked: true,
        title: 'Пакет документов 1',
        text: '<ul><li>Жалоба в формате PDF с подписью и печатью (если печать есть)</li><li>Документ, подтверждающий полномочия заявителя</li><li>Документ, подтверждающий доводы</li></ul>',
        name: 'FIELDS_ATTACHE',
        value: 0,
        controls: [
          {
            property: 47,
            word: 'FILES[0]',
            label: 'Жалоба *',
            type: 'file',
            multy: false,
            maxSize: 102400000,
            required: true,
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> (pdf, до 100МБ)',
            ext: ['pdf'],
            completeBlock: {
              comment:
                'Жалоба в формате PDF с подписью и печатью (если печать есть)',
            },
          },
          {
            property: 42,
            word: 'FILES[0]',
            label: 'Документ, подтверждающий полномочия заявителя',
            type: 'file',
            multy: 3,
            maxSize: 10240000,
            required: false,
            filename: [''],
            value: [
              {
                id: 15444,
                val: '',
              },
            ],
            default:
              '<a href>Выберите файл</a> (pdf, jpg, jpeg, png, doc, docx, до 10МБ)',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Документ, подтверждающий полномочия заявителя',
            },
          },
          {
            property: 43,
            word: 'FILES[0]',
            label: 'Документ, подтверждающий доводы',
            type: 'file',
            multy: 3,
            maxSize: 10240000,
            required: false,
            filename: [''],
            value: [
              {
                id: 96328,
                val: '',
              },
            ],
            default:
              '<a href>Выберите файл</a> (pdf, jpg, jpeg, png, doc, docx, до 10МБ)',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Документ, подтверждающий доводы',
            },
          },
        ],
      },
    ],
  },
  autosaveTimeoutId: 42,
  autosave: 5000,
  agreement: {
    name: 'FORM_AGREEMENT',
    value: 'Y',
    checked: false,
    text: 'Я принимаю <a href="/privacy/" target="_blank">условия Пользовательского соглашения</a> и даю своё согласие СРО ААС на обработку моей персональной информации на условиях, определенных Политикой конфиденциальности.',
    invalid: false,
  },
  url: {
    autosave: '/components/appeal.new.change-form/autosave.json',
    fileUpload: '/components/appeal.new.change-form/fileupload.json',
    img: '/template/images/',
    getUsers: '/components/appeal.new.change-form/getuserjson.json',
  },
};
/*window.appealNewChangeFormStore = {
  hidden: [
    {
      name: 'APPEAL_ID',
      value: 110402,
    },
    {
      name: 'FORM_ID',
      value: 107168,
    },
  ],
  docsBlock: {
    title: 'Документы необходимые для внесения изменения',
    text: '',
    items: [
      {
        id: 5983,
        title:
          'Актуальный список учредителей (участников, акционеров). Приложение № 6а.',
        url: '/upload/iblock/f7c/Prilozhenie-_-6a.docx',
        icon: '/local/templates/aas/images/doc.svg',
        data: ['90.78 Кб .docx'],
      },
    ],
  },
  controlsBlock: {
    title: 'Данные для изменения',
    text: 'Подробное описание заполнения формы с <a href="">пояснением</a> о том, какие поля надо заполнять и как они должны выглядеть. Описанием может быть довольно большим.',
    controls: [
      {
        property: '178',
        word: 'PROPERTY',
        sort: '',
        label: 'Текст*',
        type: 'textarea',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'Текущие данные',
          comment:
            'Заполните это поле для того, чтобы Заполните это поле для того, чтобы Заполните это поле для того, чтобы…',
        },
      },
      {
        property: '179',
        word: 'PROPERTY',
        sort: '',
        label: 'Краткое наименование*',
        type: 'text',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'ООО «Компания»',
          comment:
            'Заполните это поле для того, чтобы Заполните это поле для того, чтобы Заполните это поле для того, чтобы…',
        },
      },
      {
        property: '180',
        word: 'WORD',
        label: 'Полное наименование*',
        type: 'text',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'ООО «Компания + Я»',
        },
      },
      {
        property: '181',
        word: 'WORD',
        label: 'Телефон',
        type: 'tel',
        required: false,
        pattern: '^([+]?[\\s0-9]+)?(\\d{3}|[(]?[0-9]+[)])?([-]?[\\s]?[0-9])+$',
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: '+75647891231',
        },
      },
      {
        property: '182',
        word: 'WORD',
        label: 'Наименование на иностранном языке*',
        type: 'tel',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: null,
        },
      },
      {
        multy: true,
        required: false,
        value: [''],
        property: '183',
        word: 'WORD',
        type: 'url',
        label: 'Сайт*',
        completeBlock: {
          comment: 'Вы можете добавить несколько сайтов.',
        },
      },
      {
        multy: true,
        required: false,
        value: [''],
        property: '184',
        word: 'QUALITY',
        type: 'textarea',
        label: 'Сообщение*',
        completeBlock: {
          comment: 'Вы можете добавить несколько сообщений.',
        },
      },
      {
        multy: true,
        value: [''],
        property: '185',
        word: 'QUANTITY',
        type: 'date',
        required: false,
        label: 'Дата*',
        completeBlock: {
          comment: 'Вы можете добавить несколько дат.',
        },
      },
    ],
  },
  confirmDocsBlock: {
    title: 'Подтверждающие документы',
    text: '',
    items: [
      {
        id: 0,
        checked: false,
        title: 'Пакет документов 1',
        text: '<ul><li>Актуальный список учредителей (участников, акционеров). Заполненное Приложение № 6а.</li><li>Актуальная выписка из реестра акционеров</li></ul>',
        name: 'FIELDS_ATTACHE',
        value: 0,
        controls: [
          {
            multy: 5,
            property: 4,
            word: 'FILES[0]',
            label: 'Заполненное Приложение № 6а',
            type: 'file',
            required: false,
            filename: [''],
            value: [''], //file id
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: [''],
            maxSize: 1e7,
            completeBlock: {
              comment:
                'Актуальный список учредителей (участников, акционеров). Заполненное Приложение № 6а.',
            },
            pattern: '',
          },
          {
            //draft
            multy: 2,
            property: 7,
            word: 'FILES[0]',
            label: 'Устав компании *',
            type: 'file',
            required: true,
            filename: [
              'Устав Открытого Акционерного Общества "Аудит Стрит".pdf',
              'Устав ОАО "Audit street".pdf',
            ],
            value: ['852', '456'], //file id
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf'],
            maxSize: 10e6,
            completeBlock: {
              comment:
                'Актуальный список учредителей (участников, акционеров). Заполненное Приложение № 6а.',
            },
            pattern: '',
          },
          {
            property: 5,
            word: 'FILES[0]',
            label: 'Актуальная выписка из реестра акционеров *',
            type: 'file',
            required: true,
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: [''],
            maxSize: 1000,
            completeBlock: {
              comment: 'Актуальная выписка из реестра акционеров',
            },
            pattern: '',
          },
          {
            property: 6,
            word: 'FILES[0]',
            label: 'Актуальная выписка 2 из реестра акционеров *',
            type: 'file',
            required: true,
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: [''],
            maxSize: 1e5,
            completeBlock: {
              comment: 'Актуальная выписка из реестра акционеров',
            },
            pattern: '',
          },
        ],
      },
      {
        id: '7846',
        checked: false,
        title: 'Пакет документов 1',
        text: '<ul><li>Приказ об увольнении или соглашение о расторжении трудового договора,</li><li>Справка-подтверждение (Приложение № 8а)</li></ul>',
        name: 'confirm-docs',
        value: 'block1',
        controls: [
          {
            property: '189',
            word: 'FILE',
            label: 'Устав в новой редакции или изменения к Уставу*',
            type: 'file',
            required: true,
            filename: 'Программа БЧ-2021.pdf',
            value: '123',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Комментарий который поясняет ограничения.',
            },
          },
          {
            property: '190',
            word: 'FILE',
            label: 'Актуальная выписка из ЕГРЮЛ*',
            type: 'file',
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Другой комментарий который поясняет ограничения.',
            },
          },
        ],
      },
    ],
  },
  autosaveTimeoutId: 1666,
  autosave: 5000,
  agreement: {
    name: 'FORM_AGREEMENT',
    value: 'Y',
    checked: false,
    text: 'Я принимаю <a href="/privacy/" target="_blank">условия Пользовательского соглашения</a> и даю своё согласие СРО ААС на обработку моей персональной информации на условиях, определенных Политикой конфиденциальности.',
    invalid: false,
  },
  url: {
    autosave: '/components/appeal.new.change-form/autosave.json',
    fileUpload: '/components/appeal.new.change-form/fileupload.json',
    img: '/template/images/',
  },
};

/*{
  docsBlock: {
    title: 'Документы необходимые для внесения изменения',
    text: 'Some text',
    items: [
      {
        id: '1234',
        title: 'Приложение № 8а — Справка-подтверждение',
        url: '/pages/news/',
        icon: '/template/images/doc.svg',
        data: [
          '654 Кб .doc',
          'Дата документа: 13 января 2020',
          'Дата публикации: 15 января 2020',
        ],
      },
      {
        id: '1235',
        title:
          'Постановление Правительства Российской Федерации от 16.02.2005 № 82 «Об утверждении Положения о порядке передачи информации в Федеральную службу по финансовому мониторингу адвокатами, нотариусами и лицами, осуществляющими предпринимательскую деятельность в сфере оказания юридических или бухгалтерских услуг»',
        url: '/pages/news/',
        icon: '/template/images/zip.svg',
        data: [
          '655 Кб .doc',
          'Дата документа: 14 января 2020',
          'Дата публикации: 16 февраля 2020',
        ],
      },
    ],
  },
  hidden: [
    {
      name: 'element_id',
      value: 'ID',
    },
    {
      name: 'PROPERTY[447][0]',
      value: 'Поддержка Twin px Support',
    },
  ],
  controlsBlock: {
    title: 'Данные для изменения',
    text: 'Подробное описание заполнения формы с <a href="">пояснением</a> о том, какие поля надо заполнять и как они должны выглядеть. Описанием может быть довольно большим.',
    controls: [
      {
        property: '178',
        word: 'PROPERTY',
        sort: '',
        label: 'Текст*',
        type: 'textarea',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'Текущие данные',
          comment:
            'Заполните это поле для того, чтобы Заполните это поле для того, чтобы Заполните это поле для того, чтобы…',
        },
      },
      {
        property: '179',
        word: 'PROPERTY',
        sort: '',
        label: 'Краткое наименование*',
        type: 'text',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'ООО «Компания»',
          comment:
            'Заполните это поле для того, чтобы Заполните это поле для того, чтобы Заполните это поле для того, чтобы…',
        },
      },
      {
        property: '180',
        word: 'WORD',
        label: 'Полное наименование*',
        type: 'text',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: 'ООО «Компания + Я»',
        },
      },
      {
        property: '181',
        word: 'WORD',
        label: 'Телефон*',
        type: 'tel',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: '+75647891231',
        },
      },
      {
        property: '182',
        word: 'WORD',
        label: 'Наименование на иностранном языке*',
        type: 'tel',
        required: false,
        value: '',
        completeBlock: {
          title: 'Текущие данные из реестра:',
          value: null,
        },
      },
      {
        multy: true,
        value: [''],
        property: '183',
        word: 'WORD',
        type: 'url',
        label: 'Сайт*',
        completeBlock: {
          comment: 'Вы можете добавить несколько сайтов.',
        },
      },
      {
        multy: true,
        value: [''],
        property: '184',
        word: 'QUALITY',
        type: 'textarea',
        required: false,
        label: 'Сообщение*',
        completeBlock: {
          comment: 'Вы можете добавить несколько сообщений.',
        },
      },
      {
        multy: true,
        value: [''],
        property: '185',
        word: 'QUANTITY',
        type: 'date',
        required: false,
        label: 'Дата*',
        completeBlock: {
          comment: 'Вы можете добавить несколько дат.',
        },
      },
    ],
  },
  confirmDocsBlock: {
    title: 'Подтверждающие документы',
    text: 'Выберите подходящий для вас пакет подтверждающих документов.',
    items: [
      {
        id: '7845',
        checked: false,
        title: 'Пакет документов 1',
        text: '<ul><li>Приказ об увольнении или соглашение о расторжении трудового договора,</li><li>Справка-подтверждение (Приложение № 8а)</li></ul>',
        name: 'confirm-docs',
        value: 'block1',
        controls: [
          {
            property: '187',
            word: 'FILE',
            label: 'Устав в новой редакции или изменения к Уставу*',
            type: 'file',
            required: true,
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Комментарий который поясняет ограничения.',
            },
          },
          {
            property: '188',
            word: 'FILE',
            label: 'Актуальная выписка из ЕГРЮЛ*',
            type: 'file',
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Другой комментарий который поясняет ограничения.',
            },
          },
        ],
      },
      {
        id: '7846',
        checked: false,
        title: 'Пакет документов 1',
        text: '<ul><li>Приказ об увольнении или соглашение о расторжении трудового договора,</li><li>Справка-подтверждение (Приложение № 8а)</li></ul>',
        name: 'confirm-docs',
        value: 'block1',
        controls: [
          {
            property: '189',
            word: 'FILE',
            label: 'Устав в новой редакции или изменения к Уставу*',
            type: 'file',
            required: true,
            filename: 'Программа БЧ-2021.pdf',
            value: '123',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Комментарий который поясняет ограничения.',
            },
          },
          {
            property: '190',
            word: 'FILE',
            label: 'Актуальная выписка из ЕГРЮЛ*',
            type: 'file',
            filename: '',
            value: '',
            default: '<a href>Выберите файл</a> или перетащите в поле',
            ext: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            completeBlock: {
              comment: 'Другой комментарий который поясняет ограничения.',
            },
          },
        ],
      },
    ],
  },
  autosaveTimeoutId: null,
  autosave: 5000,
  agreement: {
    name: 'FORM_AGREEMENT',
    value: 'Y',
    checked: false,
    text: 'Я принимаю <a href="/" target="_blank">условия Пользовательского соглашения</a> и даю своё согласие СРО ААС на обработку моей персональной информации на условиях, определенных Политикой конфиденциальности.',
    invalid: false,
  },
};
*/
