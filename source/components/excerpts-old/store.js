window.excerptStore = {
  blocks: [
    {
      text: {
        head: 'Стандартная выписка по (индивидуальному) аудитору',
        btn: 'Получить выписку',
        title:
          'Стандартная выписка по (индивидуальному) аудитору &quot;СРО ААС&quot;',
        empty: 'У вас пока нет ни одной выписки.',
        loading: 'Идет генерация выписки',
        error: 'Ошибка загрузки выписки',
      },
      btnUrl: '/components/excerpts/getExcerpt.json',
      date: '7 июня 2021',
      state: 'excerpt', //excerpt, empty, loading
      files: {
        pdf: {
          url: '/upload/example.pdf',
          size: '8.07 Мб',
        },
        'pdf-sig': {
          pdf: {
            url: '/upload/example.pdf',
            size: '8.07 Мб',
          },
          sig: {
            url: '/pages/excerpt2/',
            size: '1.07 Мб',
          },
        },
      },
    },
    {
      text: {
        head: 'Стандартная выписка по организации',
        btn: 'Получить выписку',
        title: 'Стандартная выписка по организации &quot;СРО ААС&quot;',
        empty: 'У вас пока нет ни одной выписки.',
        loading: 'Идет генерация выписки',
        error: 'Ошибка загрузки выписки',
      },
      btnUrl: '/components/excerpts/getExcerpt.json',
      date: '7 июня 2021',
      state: 'excerpt',
      files: {
        pdf: {
          url: '/upload/example.pdf',
          size: '8.07 Мб',
        },
        'pdf-sig': {
          pdf: {
            url: '/upload/example.pdf',
            size: '8.07 Мб',
          },
          sig: {
            url: '/pages/excerpt2/',
            size: '1.07 Мб',
          },
        },
      },
    },
    {
      text: {
        head: 'Расширенная выписка по организации',
        btn: 'Получить выписку',
        empty: 'У вас пока нет ни одной выписки.',
        loading: 'Идет генерация выписки',
        error: 'Ошибка загрузки выписки',
      },
      btnUrl: '/components/excerpts/getExcerpt.json',
      state: 'empty',
    },
    {
      text: {
        head: 'Расширенная выписка по (индивидуальному) аудитору',
        btn: 'Получить выписку',
        title:
          'Расширенная выписка по (индивидуальному) аудитору &quot;СРО ААС&quot;',
        empty: 'У вас пока нет ни одной выписки.',
        loading: 'Идет генерация выписки',
        error: 'Ошибка загрузки выписки',
      },
      btnUrl: '/components/excerpts/getExcerpt.json',
      date: '7 июня 2021',
      state: 'excerpt',
      files: {
        pdf: {
          url: '/upload/example.pdf',
          size: '8.07 Мб',
        },
        'pdf-sig': {
          pdf: {
            url: '/upload/example.pdf',
            size: '8.07 Мб',
          },
          sig: {
            url: '/pages/excerpt2/',
            size: '1.07 Мб',
          },
        },
      },
    },
    {
      text: {
        head: 'Справка индивидуального аудитора',
        btn: 'Получить выписку',
        title: 'Справка индивидуального аудитора',
        empty: 'У вас пока нет ни одной выписки.',
        loading: 'Идет генерация выписки',
        error: 'Ошибка загрузки выписки',
      },
      btnUrl: '/components/excerpts/getExcerpt.json',
      date: '7 июня 2021',
      state: 'excerpt',
      files: {
        pdf: {
          url: '/upload/example.pdf',
          size: '8.07 Мб',
        },
        'pdf-sig': {
          pdf: {
            url: '/upload/example.pdf',
            size: '8.07 Мб',
          },
          sig: {
            url: '/pages/excerpt2/',
            size: '1.07 Мб',
          },
        },
      },
    },
    {
      text: {
        head: 'Справка аудиторской организации',
        btn: 'Получить выписку',
        empty: 'У вас пока нет ни одной выписки.',
        loading: 'Идет генерация выписки',
        error: 'Ошибка загрузки выписки',
      },
      btnUrl: '/components/excerpts/getExcerpt.json',
      state: 'empty',
    },
  ],
};
