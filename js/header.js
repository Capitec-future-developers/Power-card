const header = document.querySelector('.header');

header.innerHTML = `
  <div class="header-bar">
    <div class="logo">
      <img src="./img/Logo.png" alt="logo" class="logo-img">
      <span class="material-icons-sharp menu-btn">menu</span>
    </div>
    <div class="right-side">
      <span class="material-icons-sharp">notifications</span>
      <span class="material-icons-sharp">history</span>
      <span class="material-icons-sharp">star</span>
      <img src="./img/issuer.png" alt="issuer" class="issuer-icon">
      <img src="./img/switch.png" alt="switch" class="switch-icon">
      <div class="profile">
        <span class="material-icons-sharp">person</span>
        <span class="name">Omphile Mohlala</span>
        <span class="material-icons-sharp">arrow_drop_down</span>
      </div>
    </div>
  </div>
  <div class="subheader" id="subheader">Hi OmphileMohlala, Welcome to PowerCARD 3.5 !</div>
`;
