window.BX = {
  ajax: {
    runComponentAction(_, type, data) {
      let result;
      switch (type) {
        case 'addViolation':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'err',
              data: {
                id: 4,
                url: '/pages/dc-violation-detail/',
                target: '_self',
                data: [
                  {
                    id: 1,
                    text: 'Добавлено',
                  },
                  {
                    id: 2,
                    text: '20.08.2024',
                  },
                  {
                    id: 3,
                    text: 'Жалоба',
                  },
                  {
                    id: 4,
                    text: 'Петрушина Татьяна Сергеевна',
                  },
                ],
              },
              errors: ['you error'],
            });
            // reject('Reject error');
          });
          break;

        case 'addAction':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'err',
              data: {
                id: 4,
                data: [
                  {
                    id: 1,
                    text: '18 июля 2024',
                  },
                  {
                    id: 2,
                    text: 'Рекомендовать Правлению СРО ААС применить к аудитору [ОРНЗ] [ФИО] меру дисциплинарного воздействия в виде исключения из СРО ААС за нарушение требований Федерального закона №307-ФЗ «Об аудиторской деятельности».',
                  },
                ],
              },
              errors: ['you error'],
            });
            // reject('Reject error');
          });
          break;
      }

      return result;
    },
  },
};
