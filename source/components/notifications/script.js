//
//
//
//
//
// вся разработка по адресу \aas.2px.ru\web\local\components\twinpx\notifications\templates\.default\script.js
//
//
//
//
//

window.addEventListener('load', () => {
  let intervalId = setInterval(() => {
    if (
      document
        .querySelector('.b-header')
        .classList.contains('ph-block--animated')
    ) {
      clearInterval(intervalId);
      //nc
      document.querySelectorAll('.nc').forEach((nc) => {
        const type = nc.getAttribute('data-type'); //top, count, content, modal
        const url = nc.getAttribute('data-url');
        const id = nc.getAttribute('data-id');

        (async () => {
          try {
            let response = await fetch(`${url}?type=${type}&id=${id}`);
            let result = await response.json();
            switch (type) {
              case 'top':
                nc.innerHTML = `<div class="notification notification--top">
                  <div class="notification__content container-fluid">${result.response.CONTENT}<a class="btn btn-md" href="${result.response.LINK}" style="margin-left: 35px;">Нужен текст ссылки</a></div>
                  <svg class="notification__clear" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                    <defs>
                      <clipPath id="clip-path">
                        <rect width="16" height="16" fill="none"></rect>
                      </clipPath>
                    </defs>
                    <g clip-path="url(#clip-path)">
                      <path d="M9.2,7.986l6.548-6.548A.842.842,0,1,0,14.562.247L8.013,6.8,1.465.247A.842.842,0,0,0,.274,1.438L6.822,7.986.247,14.562a.842.842,0,1,0,1.191,1.191L8.013,9.178l6.548,6.549a.842.842,0,0,0,1.191-1.191Z" transform="translate(0 0)" fill="#fff"></path>
                    </g>
                  </svg>
                </div>`;
                break;
              case 'content':
                nc.innerHTML = `<div class="notification notification--inside">
                  <div class="notification__content">${result.response.CONTENT}<a class="notification__clear btn btn-md" href="" style="margin-left: 35px;">Понятно</a></div>
                </div>`;
                break;
              case 'count':
                nc.innerHTML = `<span class="notification notification--count"><span>99</span></span>`;
                break;
              case 'modal':
                const div = document.createElement('div');
                div.id = 'notificationModal';
                div.classList.add('modal', 'fade');
                div.innerHTML = `
                  <div class="modal-dialog">
                    <div class="modal-content notification notification--modal">
                      <svg type="button" data-dismiss="modal" aria-label="Close" class="close notification__clear" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16" data-id="${id}" data-url="${url}">
                        <defs>
                          <clipPath id="clip-path">
                            <rect width="16" height="16" fill="none"></rect>
                          </clipPath>
                        </defs>
                        <g clip-path="url(#clip-path)">
                          <path d="M9.2,7.986l6.548-6.548A.842.842,0,1,0,14.562.247L8.013,6.8,1.465.247A.842.842,0,0,0,.274,1.438L6.822,7.986.247,14.562a.842.842,0,1,0,1.191,1.191L8.013,9.178l6.548,6.549a.842.842,0,0,0,1.191-1.191Z" transform="translate(0 0)" fill="#fff"></path>
                        </g>
                      </svg>
                      <div class="notification__h3">${result.response.HEADER}</div>
                      <div class="notification__p">${result.response.CONTENT}</div><a class="btn btn-lg notification__clear" href="" data-dismiss="modal">Понятно</a>
                    </div>
                  </div>`;
                nc.after(div);
                break;
            }
            //events
            setTimeout(() => {
              if (type === 'top') {
                document
                  .querySelector('body')
                  .classList.add('body--notifications');
              }
              if (type === 'modal') {
                $(`#notificationModal`).modal('show');
              } else {
                nc.querySelector('.notification').classList.add(
                  'notification--show'
                );
              }

              //clear
              const clear = nc.querySelector('.notification__clear');
              if (clear) {
                clear.addEventListener('click', (e) => {
                  e.preventDefault();
                  //hide
                  nc.querySelector('.notification').classList.remove(
                    'notification--show'
                  );
                  if (type === 'top') {
                    document
                      .querySelector('body')
                      .classList.remove('body--notifications');
                  }
                });
              }
              //modal
              if (type === 'modal') {
                $(`#notificationModal`).on('hide.bs.modal', () => {
                  async () => {
                    try {
                      await fetch(`${url}?type=${type}&id=${id}`);
                    } catch (err) {
                      throw err;
                    }
                  };
                });
              }
            }, 100);
          } catch (err) {
            throw err;
          }
        })();
      });
    }
  }, 100);
});
