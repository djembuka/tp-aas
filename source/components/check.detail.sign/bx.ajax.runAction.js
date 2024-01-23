window.BX = {
  bitrix_sessid() {
    return 'SESSID';
  },
  message() {
    return 456789;
  },
  ajax: {
    runComponentAction(_, type, data) {
      let result;
      switch (type) {
        case 'sign':
          result = new Promise((resolve) => {
            resolve({
              status: 'success',
              data: {
                file: {
                  id: 8,
                  fileid: 456,
                  filename:
                    'Ещё одно уведомление Планом внешних проверок деятельности работы аудиторских организаций (22006155925_7635.pdf)',
                  filelink:
                    '/upload/iblock/0f3/blo6k046lx0ov82p38dd9bjukyoygi65/Ustav-SRO-AAS-ot-28-10-22_-utverzhdennyi_-Minyustom-s-otmetkami-MYU.pdf',
                  signed: true,
                  date: 'Подписано 30.01.2024 16:59:60',
                  status: {
                    id: 1,
                    name: 'Принят',
                    'text-color': '#74C37A',
                    'bg-color': '#EFFFF0',
                  },
                },
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
