const header = document.querySelector('.header');

header.innerHTML = `
<div class="logo">
      <img src="./img/Logo.png" alt="logo" style="position: absolute; height: 30px;">
      <span class="material-icons-sharp" style="position: absolute; left: 220px; color: red; cursor: pointer;">menu</span>
      <div class="right-side">
        <span class="material-icons-sharp">notifications</span>
        <span class="material-icons-sharp">history</span>
        <span class="material-icons-sharp">star</span>
        <img src="./img/issuer.png" alt="issuer" style="width: 30px; height: 30px; border-radius: 50%; border: 2px dashed #146;">
        <img src="./img/switch.png" alt="switch" style="width: 30px; height: 30px; border-radius: 50%;">
        <div class="profile">
          <span class="material-icons-sharp">person</span>
          <span class="name">Omphile Mohlala</span>
          <span class="material-icons-sharp">arrow_drop_down</span>
        </div>
      </div>
      </div>
    <div class="subheader">Hi OmphileMohlala, Welcome to PowerCARD 3.5 !</div>
`;
