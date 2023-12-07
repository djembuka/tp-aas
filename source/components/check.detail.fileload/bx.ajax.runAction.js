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
                blocks: [
                  {
                    id: 'id123',
                    title:
                      'Анкета аудиторской организации Анкета аудиторской организации Анкета аудиторской организации Анкета аудиторской организации',
                    status:
                      "<div class='label-green'><span>На рассмотрении</span></div>",
                    heading: 'Анкета аудиторской организации',
                    text: 'Предоставьте заполненную анкету аудиторской организации. Ваша анкета пройдет процесс согласования и будет утверждена после анализа и подтверждения экспертом.',
                    controls: [
                      {
                        id: 'id1231',
                        property: 50,
                        type: 'file',
                        word: 'FILES[1]',
                        multy: 5,
                        maxSize: 1024000,
                        required: false,
                        filename: [''],
                        default:
                          '<a href>Выберите файл</a> или перетащите в поле',
                        ext: ['pdf'],
                        invalid: false,
                        name: 'file',
                        value: [''],
                        label: 'Анкета аудиторской организации',
                      },
                    ],
                  },
                ],
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
