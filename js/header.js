document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');

  // Render header HTML
  header.innerHTML = `
    <div class="header-bar">
      <div class="logo">
      <a href="https://capitec-future-developers.github.io/The-Hub-Ecosytsem/#simulators">
        <img src="./img/Logo.png" alt="logo" class="logo-img"></a>
        <span class="material-icons-sharp menu-btn">menu</span>
      </div>
      <div class="right-side">
        <span class="material-icons-sharp">notifications</span>
        <span class="material-icons-sharp">history</span>
        <span class="material-icons-sharp">star</span>
        <img src="./img/issuer.png" alt="issuer" id="issuer" class="issuer-icon actives">
        <img src="./img/switch.png" alt="switch" id="switch" class="switch-icon">
        <div class="profile">
          <span class="material-icons-sharp">person</span>
          <span class="name">Omphile Mohlala</span>
          <span class="material-icons-sharp">arrow_drop_down</span>
        </div>
      </div>
    </div>
    <div class="subheader" id="subheader">Hi OmphileMohlala, Welcome to PowerCARD 3.5 !</div>
  `;

  const issuerBtn = document.getElementById('issuer');
  const switchBtn = document.getElementById('switch');

  // Function to toggle active class
  function activate(element) {
    issuerBtn.classList.remove('actives');
    switchBtn.classList.remove('actives');
    element.classList.add('actives');
  }

  // Add click events
  issuerBtn?.addEventListener('click', () => activate(issuerBtn));
  switchBtn?.addEventListener('click', () => activate(switchBtn));
});
