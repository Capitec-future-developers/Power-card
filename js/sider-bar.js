document.addEventListener('DOMContentLoaded', () => {
  const sideBar = document.querySelector('.side-bar');
  const switchBtn = document.getElementById('switch');
  const issuerBtn = document.getElementById('issuer');
  const content = document.getElementById('content');

  // Original sidebar (Workspace: Operation)
  const originalSidebar = `
    <div class="search-bar">
      <input type="text" placeholder="Search a screen" class="search">
    </div>
    <span>Workspace : Operation</span>
    <div class="line" style="border-bottom: 1px solid #ffffff;"></div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span> Customer management</a>
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
        <li id="customer-service">Customer service</li>
      </ul>
    </div>
  `;

  // Authorization sidebar (Workspace: Authorization)
  const authorizationSidebar = `
    <div class="search-bar">
      <input type="text" placeholder="Search a screen" class="search">
    </div>
    <span>Workspace : Operation</span>
    <div class="line" style="border-bottom: 1px solid #ffffff;"></div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Authorization</a>
      <ul>
        <li id="authorization-list">Authorization list</li>
        <li>Authorization request</li>
        <li>Authorization request moto</li>
        <li>Authorization Monitoring</li>
        <li>Purge authorization</li>
        <li>Network message</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Activity</a>
      <ul>
        <li>Online network</li>
        <li>PAN activity</li>
        <li>PAN limits</li>
        <li>Pan forced approval</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>EMV</a>
      <ul>
        <li>Status</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Store and forward</a>
      <ul>
        <li>Authorization</li>
        <li>Bridge messages</li>
        <li>Exception file</li>
        <li>Base 1 exception file</li>
        <li>CIS exception file</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Monitoring</a>
      <ul>
        <li>Resource event log</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Replication</a>
      <ul>
        <li>Replication events</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Stoplist</a>
      <ul>
        <li>Stop list card bin range</li>
        <li>Stop list networks</li>
        <li>PANs captured</li>
        <li>Special operations</li>
      </ul>
    </div>

    <div class="drop">
      <a><span class="material-icons-sharp" style="color: red; font-size: 15px;">public</span>Dashboard</a>
      <ul>
        <li>System activity</li>
        <li>Switch activity</li>
        <li>Resource activity</li>
        <li>Resource operations</li>
      </ul>
    </div>
  `;

  function initDropdowns() {
    const drops = sideBar.querySelectorAll('.drop');
    drops.forEach(drop => {
      const link = drop.querySelector('a');
      const submenu = drop.querySelector('ul');
      submenu.style.display = "none";

      link.addEventListener('click', e => {
        e.preventDefault();
        const isVisible = submenu.style.display === "block";
        drops.forEach(d => d.querySelector('ul').style.display = "none");
        submenu.style.display = isVisible ? "none" : "block";
      });
    });
  }

  function renderSidebar(type) {
    if (type === 'switch') {
      sideBar.innerHTML = authorizationSidebar;
    } else {
      sideBar.innerHTML = originalSidebar;
    }
    initDropdowns();
  }

  function showSwitchFront() {
    content.innerHTML = `<img src="./img/switch-front.png" alt="switch-front" class="issuer-front">`;
    renderSidebar('switch');
  }

  function showIssuerFront() {
    content.innerHTML = `<img src="./img/issuer-front.png" alt="issuer-front" class="issuer-front">`;
    renderSidebar('issuer');
  }


  showIssuerFront();


  if (switchBtn) switchBtn.addEventListener('click', showSwitchFront);
  if (issuerBtn) issuerBtn.addEventListener('click', showIssuerFront);


  sideBar.addEventListener('click', e => {
    const target = e.target;
    if (target.id === 'customer-service' && typeof showCustomerService === 'function') {
      e.stopPropagation();
      showCustomerService();
    }

    if (target.id === 'authorization-list' && typeof showAuthorizationList === 'function') {
      e.stopPropagation();
      showAuthorizationList();
    }
  });
});
