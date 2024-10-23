window.BX = {
  bitrix_sessid() {
    return 'SESSID';
  },
  message(code) {
    let result = '';
    switch (code) {
      case 'STEP_ONE_HEADING':
        result = 'Выберите тип выписки';
        break;
      case 'STEP_ONE_TEXT':
        result = 'Вы можете заказать выписки следующих типов:';
        break;
      case 'STEP_ONE_BUTTON':
        result = 'Получить выписку';
        break;
      case 'STEP_TWO_HEADING':
        result = 'Заказать выписку';
        break;
      case 'STEP_TWO_BUTTON':
        result = 'Получить выписку';
        break;
      case 'STEP_THREE_HEADING':
        result = 'Подтверждение';
        break;
      case 'STEP_THREE_TEXT':
        result =
          'На вашу почту отправлено письмо с кодом подтверждения, введите его для получения доступа к выпискам.';
        break;
      case 'STEP_THREE_BUTTON':
        result = 'Отправить';
        break;
      case 'STEP_FOUR_HEADING':
        result = 'Отправьте код повторно';
        break;
      case 'STEP_FOUR_TEXT':
        result =
          'Вы 3 раза ввели неверный код.<br />Получите новый код для входа повторив попытку.';
        break;
      case 'STEP_FOUR_BUTTON':
        result = 'Повторить попытку';
        break;
      case 'STEP_FIVE_HEADING':
        result = 'Ваша выписка создана';
        break;
      case 'STEP_FIVE_TEXT':
        result =
          'Скачайте выписку, она будет доступна,<br />пока у вас открыто данное окно.';
        break;
    }

    return result;
  },
  ajax: {
    runComponentAction(name, type, data) {
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
              status: 'error',
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
              errors: [
                {
                  message:
                    '\u0424\u043e\u0440\u043c\u0430\u0442 \u043a\u043e\u0434\u0430 \u043d\u0435\u0432\u0435\u0440\u043d\u044b\u0439',
                  code: 103,
                  customData: null,
                },
              ],
            });
            // reject({ errors: [{ code: 3, message: 'getFileLink error' }] });
          });
          break;
      }

      return result;
    },
  },
};
