const sideBar = document.querySelector('.side-bar');

sideBar.innerHTML = `
  <div class="search-bar">
    <input type="text" placeholder="Search a screen" class="search">
  </div>
  <span>Workspace : Operation</span>
  <div class="line" style="border-bottom: 1px solid #ffffff;"></div>

  <div class="drop">
    <a style="text-wrap: nowrap;"><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span> Customer management</a>
    <ul>
      <li>Client</li>
      <li>Corporate</li>
      <li>Client compliance</li>
    </ul>
  </div>

  <div class="drop">
    <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span> Payment instruments</a>
    <ul>
      <li>Payment instrument</li>
      <li>Embossing recycle</li>
    </ul>
  </div>

  <div class="drop">
    <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span> Financial account</a>
    <ul>
      <li>Financial account</li>
      <li>Mass transaction capture</li>
      <li>Solidarity queue</li>
    </ul>
  </div>

  <div class="drop">
    <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span> Loyalty</a>
    <ul>
      <li>Loyalty account</li>
      <li>Validate free access</li>
      <li>Consummed free access</li>
    </ul>
  </div>

  <div class="drop">
    <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span> Customer service</a>
    <ul>
      <li>Customer service</li>
    </ul>
  </div>
`;

const drops = document.querySelectorAll('.drop');

drops.forEach(drop => {
  const link = drop.querySelector('a');
  const submenu = drop.querySelector('ul');

  // start hidden
  submenu.style.display = "none";

  link.addEventListener('click', () => {
    const isVisible = submenu.style.display === "block";
    // hide all first (if you want accordion behavior)
    drops.forEach(d => d.querySelector('ul').style.display = "none");
    // toggle clicked one
    submenu.style.display = isVisible ? "none" : "block";
  });
});
