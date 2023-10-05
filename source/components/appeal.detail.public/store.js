window.appealDetailData = {
  form: {
    action: '',
    method: '',
    fetchCurrentStatus: '/components/appeal.detail/response.json',
  },
  select: {
    name: 'STATUS',
    options: [
      {
        label: 'Ожидает проверки',
        code: '',
      },
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
        code: 'prop3',
      },
    ],
    selectedOption: {
      label: 'Ожидает проверки',
      code: '',
    },
    label: 'Статус обращения',
    codeToShowTextarea: ['prop1', 'prop2'],
  },
  textarea: {
    invalid: false,
    name: 'message',
    value: '',
    label: 'Комментарий для сотрудников СРО ААС',
  },
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
