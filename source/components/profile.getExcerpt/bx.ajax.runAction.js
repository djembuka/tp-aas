window.BX = {
  bitrix_sessid() {
    return 'SESSID';
  },
  message() {
    return 456789;
  },
  ajax: {
    runAction(type, data) {
      let result;
      switch (type) {
        case 'requestDocument':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: {
                id: 789,
              },
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 1, message: 'requestDocument error' }] });
          });
          break;

        case 'generateCode':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: null,
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 2, message: 'generateCode error' }] });
          });
          break;

        case 'getFileLink':
          result = new Promise((resolve, reject) => {
            resolve({
              status: 'success',
              data: {
                file: {
                  fileLink: '/',
                  name: 'Выписка-152156-ФC/24',
                  size: '654 Кб',
                  date: '20 июня 2024 11:55:06',
                  pdf: '/',
                  sig: '/',
                },
              },
              errors: [{ message: 'Error message' }],
            });
            // reject({ errors: [{ code: 3, message: 'getFileLink error' }] });
          });
          break;
      }

      return result;
    },
  },
};
