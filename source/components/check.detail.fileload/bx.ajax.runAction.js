window.BX = {
  bitrix_sessid() {
    return 'SESSID';
  },
  ajax: {
    runComponentAction(_, type) {
      let result;
      switch (type) {
        case 'blocks':
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
                    name: 'Пример незаполненного блока с 1 полем - empty+write',
                    name_w: 'Название для прав записи',
                    name_m: 'Название для прав модерации',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'empty',
                    permissions: {
                      read: false,
                      write: true,
                      moderation: false,
                    },
                    status: '0',
                    items: [
                      {
                        id: 'collectionId1',
                        type: 'collection',
                        name: 'Название коллекции',
                        description: 'Описание коллекции',
                        hint: 'Подсказка коллекции',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции для moderation',
                        description_m: 'Описание коллекции для moderation',
                        hint_m: 'Подсказка коллекции для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1232',
                            type: 'file',
                            name: 'USER_FILE_2',
                            type: 'file',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description:
                              'Пример простого поля. Приложите файл в формате Exel, файл который вы приложите будет считаться официальном документом подписанным простой электронной подписью.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id124',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1244',
                    date_added: '15 января 2020',
                    name: 'Пример незаполненного блока с 3 полями - empty+write',
                    state: 'empty',
                    status: 0,
                    hint: '',
                    heading: 'Анкета аудиторской организации',
                    needModerate: true,
                    permissions: {
                      read: false,
                      write: true,
                      moderation: false,
                    },
                    description:
                      'Предоставьте заполненную анкету аудиторской организации. Ваша анкета пройдет процесс согласования и будет утверждена после анализа и подтверждения экспертом.',
                    history: [],
                    items: [
                      {
                        id: 'collectionId2',
                        type: 'collection',
                        name: 'Название коллекции 2',
                        description: 'Описание коллекции 2',
                        hint: 'Подсказка коллекции 2',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции для moderation',
                        description_m: 'Описание коллекции для moderation',
                        hint_m: 'Подсказка коллекции для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1233',
                            type: 'file',
                            name: 'USER_FILE_2',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description: 'Пример простого поля.',
                          },
                          {
                            id: 'id1234',
                            type: 'file',
                            name: 'USER_FILE_2',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description:
                              'Пожалуйста, приложите файл в формате Excel. Прикрепленный файл будет считаться официальным документом, подписанным простой электронной подписью.',
                          },
                          {
                            id: 'id1235',
                            type: 'file',
                            name: 'USER_FILE_2',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description: '',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id125',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1233',
                    name: 'Пример незаполненного блока с мультиполем - empty-write',
                    name_w: 'Название для прав записи',
                    name_m: 'Название для прав модерации',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'empty',
                    permissions: {
                      read: false,
                      write: true,
                      moderation: false,
                    },
                    status: '0',
                    items: [
                      {
                        id: 'collectionId3',
                        type: 'collection',
                        name: 'Название коллекции 3',
                        description: 'Описание коллекции 3',
                        hint: 'Подсказка коллекции 3',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции для moderation',
                        description_m: 'Описание коллекции для moderation',
                        hint_m: 'Подсказка коллекции для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1233',
                            type: 'file',
                            name: 'USER_FILE_3',
                            description: 'Пример мультиполя',
                            hint: 'Подсказка мультиполя',
                            multiple: true,
                            maxfiles: 5,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id126',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1233',
                    name: 'Пример незаполненного блока с мультиколлекцией (нужна доработка) - empty+write',
                    name_w: 'Название для прав записи',
                    name_m: 'Название для прав модерации',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'empty',
                    permissions: {
                      read: false,
                      write: true,
                      moderation: false,
                    },
                    status: '0',
                    items: [
                      {
                        id: 'collectionId4',
                        type: 'collection',
                        name: 'Название коллекции 4',
                        description: 'Описание коллекции 4',
                        hint: 'Подсказка коллекции 4',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции для moderation',
                        description_m: 'Описание коллекции для moderation',
                        hint_m: 'Подсказка коллекции для moderation',
                        multiple: true,
                        maxcollections: 3,
                        files: [
                          {
                            id: 'id1263',
                            type: 'file',
                            name: 'USER_FILE_6',
                            type: 'file',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description:
                              'Пример простого поля. Приложите файл в формате Exel, файл который вы приложите будет считаться официальном документом подписанным простой электронной подписью.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id130',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1283',
                    name: 'Заполнен, с правами записи - moderating+write',
                    name_w: 'Заполнен, с правами записи - moderating+write',
                    name_m: '',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'moderating',
                    permissions: {
                      read: false,
                      write: true,
                      moderation: false,
                    },
                    status: 'statusBlue',
                    items: [
                      {
                        id: 'collectionId10',
                        type: 'collection',
                        name: 'Название коллекции 10',
                        description: 'Описание коллекции 10',
                        hint: 'Подсказка коллекции 10',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 6 для moderation',
                        description_m: 'Описание коллекции 6 для moderation',
                        hint_m: 'Подсказка коллекции 6 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                      {
                        id: 'collectionId7',
                        type: 'collection',
                        name: 'Название коллекции 7',
                        description: 'Описание коллекции 7',
                        hint: 'Подсказка коллекции 7',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 7 для moderation',
                        description_m: 'Описание коллекции 7 для moderation',
                        hint_m: 'Подсказка коллекции 7 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id12871',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1282',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1283',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id131',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1283',
                    name: 'Промодерирован, с правами записи - filled+write',
                    name_w: 'Промодерирован, с правами записи - filled+write',
                    name_m: '',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'filled',
                    permissions: {
                      read: false,
                      write: false,
                      moderation: true,
                    },
                    status: 'statusGreen',
                    items: [
                      {
                        id: 'collectionId11',
                        type: 'collection',
                        name: 'Название коллекции 11',
                        description: 'Описание коллекции 11',
                        hint: 'Подсказка коллекции 11',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 6 для moderation',
                        description_m: 'Описание коллекции 6 для moderation',
                        hint_m: 'Подсказка коллекции 6 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                      {
                        id: 'collectionId7',
                        type: 'collection',
                        name: 'Название коллекции 7',
                        description: 'Описание коллекции 7',
                        hint: 'Подсказка коллекции 7',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 7 для moderation',
                        description_m: 'Описание коллекции 7 для moderation',
                        hint_m: 'Подсказка коллекции 7 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id12871',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1282',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1283',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id128',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1283',
                    name: 'Пустой, с правами модерации - empty+moderation',
                    name_w: 'Название для прав записи',
                    name_m: 'Пустой, с правами модерации - empty+moderation',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'empty',
                    permissions: {
                      read: false,
                      write: false,
                      moderation: true,
                    },
                    status: '',
                    items: [
                      {
                        id: 'collectionId1',
                        type: 'collection',
                        name: 'Название коллекции 1',
                        description: 'Описание коллекции',
                        hint: 'Подсказка коллекции',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции для moderation',
                        description_m: 'Описание коллекции для moderation',
                        hint_m: 'Подсказка коллекции для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1232',
                            type: 'file',
                            name: 'USER_FILE_2',
                            type: 'file',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description:
                              'Пример простого поля. Приложите файл в формате Exel, файл который вы приложите будет считаться официальном документом подписанным простой электронной подписью.',
                          },
                        ],
                      },
                      {
                        id: 'collectionId1',
                        type: 'collection',
                        name: 'Название коллекции 2',
                        description: 'Описание коллекции',
                        hint: 'Подсказка коллекции',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции для moderation',
                        description_m: 'Описание коллекции для moderation',
                        hint_m: 'Подсказка коллекции для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1232',
                            type: 'file',
                            name: 'USER_FILE_2',
                            type: 'file',
                            multiple: false,
                            maxfilesize: 1024000,
                            filename: '',
                            accept: ['pdf'],
                            description:
                              'Пример простого поля. Приложите файл в формате Exel, файл который вы приложите будет считаться официальном документом подписанным простой электронной подписью.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id123',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1233',
                    date_added: '15 января 2020',
                    name: 'Заполнен, с правами модерации - moderating+moderation',
                    name_w: 'Название для прав записи',
                    name_m: 'Название для прав модерации',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'moderating',
                    permissions: {
                      read: false,
                      write: false,
                      moderation: true,
                    },
                    status: 'statusBlue',
                    items: [
                      {
                        id: 'collectionId6',
                        type: 'collection',
                        name: 'Название коллекции 6',
                        description: 'Описание коллекции 6',
                        hint: 'Подсказка коллекции 6',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 6 для moderation',
                        description_m: 'Описание коллекции 6 для moderation',
                        hint_m: 'Подсказка коллекции 6 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1272',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1272',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1272',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                      {
                        id: 'collectionId7',
                        type: 'collection',
                        name: 'Название коллекции 7',
                        description: 'Описание коллекции 7',
                        hint: 'Подсказка коллекции 7',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 7 для moderation',
                        description_m: 'Описание коллекции 7 для moderation',
                        hint_m: 'Подсказка коллекции 7 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id12871',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1282',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1283',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id129',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1283',
                    name: 'Промодерирован, с правами модерации - filled+moderation',
                    name_w: 'Название для прав записи',
                    name_m:
                      'Промодерирован, с правами модерации - filled+moderation',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'filled',
                    permissions: {
                      read: false,
                      write: false,
                      moderation: true,
                    },
                    status: 'statusGreen',
                    items: [
                      {
                        id: 'collectionId9',
                        type: 'collection',
                        name: 'Название коллекции 9',
                        description: 'Описание коллекции 9',
                        hint: 'Подсказка коллекции 9',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 6 для moderation',
                        description_m: 'Описание коллекции 6 для moderation',
                        hint_m: 'Подсказка коллекции 6 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                      {
                        id: 'collectionId7',
                        type: 'collection',
                        name: 'Название коллекции 7',
                        description: 'Описание коллекции 7',
                        hint: 'Подсказка коллекции 7',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 7 для moderation',
                        description_m: 'Описание коллекции 7 для moderation',
                        hint_m: 'Подсказка коллекции 7 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id12871',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1282',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1283',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'id132',
                    author_name: 'Азарянц Ашот Александрович',
                    author_id: 'id1323',
                    name: 'Промодерирован, с правами чтения - filled+read',
                    name_r: 'Промодерирован, с правами чтения - filled+read',
                    name_m: '',
                    description: '',
                    hint: '',
                    needModerate: false,
                    state: 'filled',
                    permissions: {
                      read: true,
                      write: false,
                      moderation: false,
                    },
                    status: 'statusGreen',
                    items: [
                      {
                        id: 'collectionId12',
                        type: 'collection',
                        name: 'Название коллекции 12',
                        description: 'Описание коллекции 12',
                        hint: 'Подсказка коллекции 12',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 6 для moderation',
                        description_m: 'Описание коллекции 6 для moderation',
                        hint_m: 'Подсказка коллекции 6 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1292',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                      {
                        id: 'collectionId7',
                        type: 'collection',
                        name: 'Название коллекции 7',
                        description: 'Описание коллекции 7',
                        hint: 'Подсказка коллекции 7',
                        name_w: 'Название коллекции для write',
                        description_w: 'Описание коллекции для write',
                        hint_w: 'Подсказка коллекции для write',
                        name_m: 'Название коллекции 7 для moderation',
                        description_m: 'Описание коллекции 7 для moderation',
                        hint_m: 'Подсказка коллекции 7 для moderation',
                        multiple: false,
                        files: [
                          {
                            id: 'id12871',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.pdf',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1282',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.doc',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                          {
                            id: 'id1283',
                            type: 'file',
                            filename: 'Anketa-auditorskoi-mir-audit.xls',
                            filelink: 'link.pdf',
                            filesize: '654 Кб',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              errors: [],
            });
          });
          break;
        case 'statuses':
          result = new Promise((resolve) => {
            resolve({
              status: 'success',
              data: [
                {
                  id: 'statusGreen',
                  name: 'Принят',
                  active: true,
                  'text-color': '#74C37A',
                  'bg-color': '#EFFFF0',
                },
                {
                  id: 'statusRed',
                  name: 'Отклонён',
                  active: true,
                  'text-color': '#FF0000',
                  'bg-color': '#FFF4F4',
                },
                {
                  id: 'statusBlue',
                  name: 'На проверке',
                  active: true,
                  'text-color': '#4375D8',
                  'bg-color': '#F0F5FF',
                },
              ],
              errors: [],
            });
          });
          break;
        case 'saveBlock':
          result = new Promise((resolve) => {
            resolve({
              status: 'success',
              data: {
                status: 'moderating',
                vkkrId: 'id12',
                blockId: 'id123',
                history: [
                  {
                    id: 'is12312',
                    date: '15 января 2020',
                    author_id: 'id1233',
                    author_name: 'Азарянц Ашот Александрович',
                    type: 'uploaded_files',
                    items: [],
                    status: 1,
                  },
                ],
              },
              errors: [],
            });
          });
          break;
        case 'setBlockStatus':
          result = new Promise((resolve) => {
            resolve({
              status: 'success',
              data: {},
              errors: [],
            });
          });
          break;
      }

      return result;
    },
  },
};
