window.onload = () => {
  setUpDarkMode();
}

window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    toggleModal(event.target.id);
  }
}

function setUpDarkMode() {
  const toggleSwitch = document.querySelector('#theme-switch');
  let store = window.localStorage;

  const setTheme = theme => {
    store.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  if (store.getItem('theme')) {
      setTheme(store.getItem('theme'));
      toggleSwitch.checked = store.getItem('theme') == 'dark';
  }

  const toggleTheme = e => {
    const theme = e.target.checked ? 'dark' : 'light';
    setTheme(theme);
  }

  toggleSwitch.addEventListener('change', toggleTheme, false);
}

function toggleModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);
  modal.style.display = modal.style.display == "block" ? "none" : "block";
  return modal.style.display;
}
