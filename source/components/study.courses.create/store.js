window.studyCourseCreateStore = {
  submitStepURL: '/components/study.courses.create/urls/submit-step.json',
  addBlockURL: '/components/study.courses.create/urls/add-block.json',
  deleteBlockURL: '/components/study.courses.create/urls/delete-block.json',
  addLessonURL: '/components/study.courses.create/urls/add-lesson.json',
  deleteLessonURL: '/components/study.courses.create/urls/delete-block.json',
  ornzControlURL: '/components/study.courses.create/urls/ornz-control.json',
  TYPE_COMPARE: {
    '91': [
        {
            label: 'Очная аудиторная',
            code: '93',
        },
    ],
    '92': [
        {
            label: 'Заочная дистанционная',
            code: '114',
        },
    ], 
    '97': [
        {
            label: 'Очная дистанционная',
            code: '94',
        }
    ],
    '98': [
        {
            label: 'Очная аудиторная',
            code: '93',
        },
        {
            label: 'Очная дистанционная',
            code: '94',
        }
    ],
  },
  steps: [
    {
      id: '123qwe',
      active: true,
      visited: true,
      title: 'Шаг 1. Общие данные',
      description: 'Внесите общие обязательные данные для создания курса.',
      controls: [
        {
          name: 'COURSE_NAME',
          label: 'Название курса',
          value: '',
          type: 'text',
          required: true,
          invalid: false,
        },
        {
          name: 'COURSE_NUM',
          label: 'Номер курса',
          value: '',
          type: 'text',
          required: true,
          invalid: false,
        },
        {
          name: 'COURSE_DESCRIPTION',
          label: 'Название курса',
          value: '',
          type: 'textarea',
          required: true,
          invalid: false,
        },
        {
          name: 'UMC_TYPE',
          label: 'Форма проведения',
          value: [
            {
              label: 'Выбрать',
              code: '',
            },
            {
              label: 'Заочная дистанционная',
              code: '91',
            },
            {
              label: 'Очная аудиторная',
              code: '92',
            },
            {
              label: 'Очная дистанционная',
              code: '97',
            },
            {
              label: 'Очная аудиторная/Очная дистанционная',
              code: '98',
            },
          ],
          selected: { label: 'Очная аудиторная', code: '92' },
          type: 'select',
          required: true,
          invalid: false,
        },
        {
          name: 'COURSE_LOCATION',
          label: 'Город',
          value: '',
          type: 'text',
          required: true,
          invalid: false,
        },
      ],
      button: {
        text: 'Продолжить',
        type: 'continue',
      },
    },
    {
      id: '223qwe',
      title: 'Шаг 2. Названия блоков',
      description:
        'Введите название блоков занятий для удобства восприятия расписания.<br>Блоком занятий может быть группа объединяя одой темой или датой проведения.<br><b>Пример:</b> Бухгалтерский учет и отчетность или Блок 1… и т.д.',
      blocks: [],
      button: {
        text: 'Продолжить',
        type: 'continue',
      },
    },
    {
      id: '323qwe',
      title: 'Шаг 3. Занятия',
      description: 'Добавьте для каждого блока занятия.',
      blocks: [],
      button: {
        text: 'Сохранить',
        type: 'save',
      },
    },
  ],
};
