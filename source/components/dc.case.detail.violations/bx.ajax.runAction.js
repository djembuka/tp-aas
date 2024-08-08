window.BX = {
  ajax: {
    runComponentAction(_, type, data) {
      let result;
      switch (type) {
        case 'add':
          console.log('sdfdsf');
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
      }

      return result;
    },
  },
};
