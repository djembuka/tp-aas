window.appealDetailData = {
  hidden: [
    {
      name: 'hidden_2',
      value: 'value_2',
    },
  ],
  form: {
    action: '',
    method: '',
    fetchCurrentStatus: '/components/appeal.detail/response.json',
    fileUpload: '/components/appeal.detail/fileupload.json',
  },
  select: {
    name: 'STATUS',
    options: [
      {
        label: 'В работе',
        code: 'prop1',
      },
      {
        label: 'Отклонено',
        code: 'prop2',
      },
      {
        label: 'Выполнено',
        code: 'prop4',
      },
    ],
    selectedOption: {
      label: '-',
      code: '',
    },
    label: 'Статус обращения',
  },
  textarea: {
    showForStatus: ['prop1', 'prop2'],
    invalid: false,
    name: 'message',
    value: '',
    label: 'Комментарий для сотрудников СРО ААС',
  },
  files: [
    {
      property: 48,
      word: 'FILES[0]',
      showForStatus: ['prop4'],
      type: 'file',
      multy: false,
      maxSize: 1024000,
      required: false,
      filename: '',
      default: '<a href>Выберите файл</a> (pdf, до 1МБ)',
      ext: ['pdf'],
      invalid: false,
      name: 'file',
      value: '',
      label: 'Устав в новой редакции',
    },
    {
      property: 49,
      word: 'FILES[0]',
      showForStatus: ['prop1'],
      type: 'file',
      multy: false,
      maxSize: 10240000,
      required: false,
      filename: '',
      default: '<a href>Выберите файл</a> (pdf, до 10МБ)',
      ext: ['pdf'],
      invalid: false,
      name: 'file',
      value: '',
      label: 'Устав в новой редакции или изменения к Уставу',
    },
  ],
  button: {
    name: 'statusConfirm',
    text: 'Сохранить',
    confirm: 'Сохранить',
    dismiss: 'Отменить',
    message: 'Для отправки необходимо заполнить все поля.',
  },
  modal: {
    html: '<h3 class="text-center">Вы хотите отредактировать отчет?</h3><hr><p>Вы переходите в режим редактирования отчета. После внесения изменений в отчет вам необходимо сдать его, нажав на кнопку «Сдать отчет».</p><p>До тех пор, пока вы повторно не отправите отчет, он будет находиться в статусе «Необходимо сдать».</p><hr>',
  },
  alert: {
    html: '<h3 class="text-center">Статус обращения был уже изменён другим сотрудником</h3><hr><p>Ваши изменения не могут быть сохранены. Пожалуйста, перезагрузите детальную страницу обращения, чтобы увидеть новый статус.</p><p>Ваши изменения не будут сохранены.</p><hr>',
    button: 'Понятно',
  },
};

window.explanationData = {
  hidden: [
    {
      name: 'hidden_1',
      value: 'value_1',
    },
    {
      name: 'hidden_2',
      value: 'value_2',
    },
  ],
  form: {
    action: '',
    method: '',
  },
  controls: [
    {
      property: 47,
      type: 'textarea',
      invalid: false,
      name: 'message',
      value: '',
      label: 'Текст пояснения',
      required: false,
    },
    {
      property: 50,
      type: 'file',
      word: 'FILES[1]',
      multy: 5,
      maxSize: 1024000,
      required: false,
      filename: [''],
      default: '<a href>Выберите файл</a> (pdf, до 10МБ)',
      ext: ['pdf'],
      invalid: false,
      name: 'file',
      value: [''],
      label: 'Файл пояснения',
    },
  ],
  button: {
    name: 'explanationSave',
    text: 'Сохранить',
    confirm: 'Сохранить',
    dismiss: 'Отменить',
    message: 'Для отправки необходимо заполнить все поля.',
  },
  modal: {
    html: '<h3 class="text-center">Вы хотите отредактировать отчет?</h3><hr><p>Вы переходите в режим редактирования отчета. После внесения изменений в отчет вам необходимо сдать его, нажав на кнопку «Сдать отчет».</p><p>До тех пор, пока вы повторно не отправите отчет, он будет находиться в статусе «Необходимо сдать».</p><hr>',
  },
  alert: {
    html: '<h3 class="text-center">Статус обращения был уже изменён другим сотрудником</h3><hr><p>Ваши изменения не могут быть сохранены. Пожалуйста, перезагрузите детальную страницу обращения, чтобы увидеть новый статус.</p><p>Ваши изменения не будут сохранены.</p><hr>',
    button: 'Понятно',
  },
};
