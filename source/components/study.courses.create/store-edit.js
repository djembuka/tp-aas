window.studyCourseCreateStore = {
  submitStepURL: '/components/study.courses.create/urls/submit-step.json',
  addBlockURL: '/components/study.courses.create/urls/add-block.json',
  deleteBlockURL: '/components/study.courses.create/urls/delete-block.json',
  addLessonURL: '/components/study.courses.create/urls/add-lesson.json',
  deleteLessonURL: '/components/study.courses.create/urls/delete-block.json',
  ornzControlURL: '/components/study.courses.create/urls/ornz-control.json',
  //courseId: 'course123', - we get course id only after first step is submitted to prevent creating empty courses
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
              label: 'Очная аудиторная',
              code: 'ochno',
            },
            {
              label: 'Заочная',
              code: 'zaochno',
            },
            {
              label: 'Дистанционная',
              code: 'distant',
            },
          ],
          selected: { label: 'Очная аудиторная', code: 'ochno' },
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
      visited: true,
      title: 'Шаг 2. Названия блоков',
      description:
        'Введите название блоков занятий для удобства восприятия расписания.<br>Блоком занятий может быть группа объединяя одой темой или датой проведения.<br><b>Пример:</b> Бухгалтерский учет и отчетность или Блок 1… и т.д.',
      blocks: [
        {
          id: 'block123',
          controls: [
            {
              name: 'BLOCK_TITLE',
              label: 'Название блока',
              value: 'Документооборот и бухгалтерия',
              type: 'text',
              required: true,
              invalid: false,
            },
            {
              name: 'PROGRAMM',
              label: 'Программа СРО ААС',
              type: 'ornz',
              value: { TEXT: 'sdf', ID: 'sdfsf' },
              required: true,
              invalid: false,
            },
          ],
        },
        {
          id: 'block124',
          controls: [
            {
              name: 'BLOCK_TITLE',
              label: 'Название блока',
              value: 'Бухгалтерский учет и отчетность',
              type: 'text',
              required: true,
              invalid: false,
            },
            {
              name: 'PROGRAMM',
              label: 'Программа СРО ААС',
              type: 'ornz',
              value: '',
              required: true,
              invalid: false,
            },
          ],
        },
      ],
      button: {
        text: 'Продолжить',
        type: 'continue',
      },
    },
    {
      id: '323qwe',
      visited: true,
      title: 'Шаг 3. Занятия',
      description: 'Добавьте для каждого блока занятия.',
      blocks: [
        {
          id: 'block123',
          lessons: [
            {
              id: 'lesson123',
              controls: [
                {
                  name: 'LESSON_TITLE',
                  label: 'Название занятия',
                  value:
                    'Немодифицированное и модифицированное мнение в аудиторском заключении. Разделы «Существенная неопределенность в отнощшении непрерывности деятельности», «Важные обстоятельства» и «Прочие сведения» в аудиторском заключении. Обязанности аудитора, относящиеся к прочей информации, включенной в годовой отчет организации.',
                  type: 'textarea',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_DATE',
                  label: 'Выберите дату',
                  value: '',
                  type: 'date',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'TEACHER_NAME',
                  label: 'Преподаватель',
                  value: '',
                  type: 'text',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'TASK_TYPE',
                  label: 'Тип занятия',
                  value: [
                    {
                      label: 'Очное',
                      code: 'ochno',
                    },
                    {
                      label: 'Заочное',
                      code: 'zaochno',
                    },
                    {
                      label: 'Дистанционное',
                      code: 'distant',
                    },
                  ],
                  selected: { label: 'Дистанционное', code: 'distant' },
                  type: 'select',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'TASK_DISCIPLINE',
                  label: 'Дисциплина',
                  value: [
                    {
                      label:
                        'Основы правового регулирования имущественных отношений',
                      code: '1',
                    },
                    {
                      label: 'Основы правового регулирования',
                      code: '2',
                    },
                    {
                      label: 'Основы имущественных отношений',
                      code: '3',
                    },
                  ],
                  selected: {
                    label:
                      'Основы правового регулирования имущественных отношений',
                    code: '1',
                  },
                  type: 'select',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_START',
                  label: 'Время начала',
                  value: '10:00',
                  type: 'time',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_END',
                  label: 'Время окончания',
                  value: '18:00',
                  type: 'time',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_HOURS',
                  label: 'Количество часов',
                  value: '',
                  type: 'text',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_ADDRESS',
                  label: 'Адрес занятия',
                  value: '',
                  type: 'text',
                  required: true,
                  invalid: false,
                },
              ],
            },
          ],
        },
        {
          id: 'block124',
          lessons: [
            {
              id: 'lesson123',
              controls: [
                {
                  name: 'LESSON_TITLE',
                  label: 'Название занятия',
                  value:
                    'Разделы «Существенная неопределенность в отнощшении непрерывности деятельности», «Важные обстоятельства» и «Прочие сведения».',
                  type: 'textarea',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_DATE',
                  label: 'Выберите дату',
                  value: '22.05.2023',
                  type: 'date',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'TEACHER_NAME',
                  label: 'Преподаватель',
                  value: 'Ковалевский Ярослав',
                  type: 'text',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'TASK_TYPE',
                  label: 'Тип занятия',
                  value: [
                    {
                      label: 'Очное',
                      code: 'ochno',
                    },
                    {
                      label: 'Заочное',
                      code: 'zaochno',
                    },
                    {
                      label: 'Дистанционное',
                      code: 'distant',
                    },
                  ],
                  selected: { label: 'Дистанционное', code: 'distant' },
                  type: 'select',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'TASK_DISCIPLINE',
                  label: 'Дисциплина',
                  value: [
                    {
                      label:
                        'Основы правового регулирования имущественных отношений',
                      code: '1',
                    },
                    {
                      label: 'Основы правового регулирования',
                      code: '2',
                    },
                    {
                      label: 'Основы имущественных отношений',
                      code: '3',
                    },
                  ],
                  selected: {
                    label:
                      'Основы правового регулирования имущественных отношений',
                    code: '1',
                  },
                  type: 'select',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_START',
                  label: 'Время начала',
                  value: '10:00',
                  type: 'time',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_END',
                  label: 'Время окончания',
                  value: '18:00',
                  type: 'time',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_HOURS',
                  label: 'Количество часов',
                  value: '',
                  type: 'text',
                  required: true,
                  invalid: false,
                },
                {
                  name: 'LESSON_ADDRESS',
                  label: 'Адрес занятия',
                  value: '',
                  type: 'text',
                  required: true,
                  invalid: false,
                },
              ],
            },
          ],
        },
      ],
      button: {
        text: 'Сохранить',
        type: 'save',
      },
    },
  ],
};
