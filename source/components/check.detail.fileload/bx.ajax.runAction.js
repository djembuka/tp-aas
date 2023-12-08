window.BX = {
  ajax: {
    runAction(method) {
      let result;
      switch (method) {
        case 'twinpx:aas.api.methods.blocks':
          result = new Promise((resolve) => {
            resolve({
              status: 'success',
              data: {
                id: 'id12',
                blocks: [
                  {
                    id: 'id123',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1233',
                    name: 'Пример незаполненного блока',
                    hint: '',
                    permissions: { read: true, write: true, moderation: true },
                    heading: 'Анкета аудиторской организации',
                    description:
                      'Предоставьте заполненную анкету аудиторской организации. Ваша анкета пройдет процесс согласования и будет утверждена после анализа и подтверждения экспертом.',
                    items: [
                      {
                        id: 'id1231',
                        name: 'USER_FILE',
                        type: 'file',
                        multiple: true,
                        maxfiles: 5,
                        maxfilesize: 1024000,
                        required: false,
                        filename: [''],
                        default:
                          '<a href>Выберите файл</a> или перетащите в поле',
                        accept: ['pdf'],
                        value: [''],
                        label: 'Анкета аудиторской организации',
                        description: 'Пример мультиполя',
                      },
                      {
                        id: 'id1232',
                        name: 'USER_FILE_2',
                        type: 'file',
                        multiple: false,
                        maxfilesize: 1024000,
                        required: false,
                        filename: '',
                        default:
                          '<a href>Выберите файл</a> или перетащите в поле',
                        accept: ['pdf'],
                        value: '',
                        label: 'Анкета аудиторской организации',
                        description:
                          'Пример простого поля. Приложите файл в формате Exel, файл который вы приложите будет считаться официальном документом подписанным простой электронной подписью.',
                      },
                    ],
                  },
                  {
                    id: 'id124',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1244',
                    date_added: '15 января 2020',
                    name: 'Пример незаполненного блока',
                    status: 'empty',
                    hint: '',
                    heading: 'Анкета аудиторской организации',
                    needModerate: true,
                    permissions: { read: true, write: true, moderation: true },
                    description:
                      'Предоставьте заполненную анкету аудиторской организации. Ваша анкета пройдет процесс согласования и будет утверждена после анализа и подтверждения экспертом.',
                    history: [],
                    items: [
                      {
                        id: 'id1241',
                        name: 'USER_FILE',
                        type: 'file',
                        multiple: true,
                        maxfiles: 5,
                        maxfilesize: 1024000,
                        required: false,
                        filename: [''],
                        default:
                          '<a href>Выберите файл</a> или перетащите в поле',
                        accept: ['pdf'],
                        invalid: false,
                        name: 'file',
                        value: [''],
                        label: 'Анкета аудиторской организации',
                        description:
                          'Приложите файл в формате Exel, файл который вы приложите будет считаться официальном документом подписанным простой электронной подписью.',
                      },
                    ],
                  },
                ],
              },
              errors: [],
            });
          });
          break;
        case 'twinpx:aas.api.methods.saveBlock':
          result = new Promise((resolve) => {
            resolve({
              status: 'success',
              data: {
                status: 'moderating',
              },
              errors: [],
            });
          });
          break;
      }

      return result;
    },
  },
};
