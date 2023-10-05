window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/pwa/poll/sw.js', { scope: '/pwa/poll/' })
      .then((registration) => {
        //console.log('registered', registration);
      })
      .catch((error) => {
        //console.log('failed', error);
      });
  }

  if (
    document.querySelector('.pwa-button') &&
    window.localStorage &&
    localStorage.getItem('pwa') !== 'N'
  ) {
    let deferredPrompt;
    const addBlock = document.querySelector('.pwa-button');
    const addBtn = addBlock.querySelector('.pwa-button .btn-secondary');
    const refuseBtn = addBlock.querySelector('.pwa-button .btn-light');

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI to notify the user they can add to home screen
      addBlock.classList.add('i-visible');

      addBtn.addEventListener('click', () => {
        // hide our user interface that shows our A2HS button
        addBlock.classList.remove('i-visible');
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          /*if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }*/
          deferredPrompt = null;
        });
      });

      refuseBtn.addEventListener('click', () => {
        localStorage.setItem('pwa', 'N');
        addBlock.classList.add('i-hide');
        setTimeout(function () {
          addBlock.remove();
        }, 500);
      });
    });
  }
});
