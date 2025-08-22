document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const switchBtn = document.getElementById('switch'); // switch button
  const issuerBtn = document.getElementById('issuer'); // issuer button


  function showSwitchFront() {
    content.innerHTML = `
      <img src="./img/switch-front.png" alt="switch-front" class="issuer-front">
    `;
  }


  function showIssuerFront() {
    content.innerHTML = `
      <img src="./img/issuer-front.png" alt="issuer-front" class="issuer-front">
    `;
  }


  if (switchBtn) {
    switchBtn.addEventListener('click', showSwitchFront);
  }

  if (issuerBtn) {
    issuerBtn.addEventListener('click', showIssuerFront);
  }
});
