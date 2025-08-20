const content = document.querySelector('.content');
const customerService = document.getElementById('customer-service');
const customerView = document.getElementById('customer-view');

content.innerHTML = `
<img src="../img/issuer-front.png" alt="issuer-front" class="issuer-front">
`;


function showCustomerService() {

  content.innerHTML = `
 <section>
<div class="customer-details">
  <div class="left-details">
    <div class="field">
      <label for="pan">Pan</label>
      <input type="number" id="pan" class="card-number">
    </div>
    <div class="field">
      <label for="fname">First name</label>
      <input type="text" id="fname" class="card-number">
    </div>
    <div class="field">
      <label for="corpId">Corporate ID</label>
      <input type="text" id="corpId" class="card-number">
    </div>
    <div class="field">
      <label for="legalId">Legal ID</label>
      <input type="text" id="legalId" class="card-number">
    </div>
    <div class="field">
      <label for="clientId">Client host ID</label>
      <input type="text" id="clientId" class="card-number">
    </div>
  </div>

  <div class="right-details">
    <div class="field">
      <label for="rfname">client code</label>
      <input type="text" id="rfname" class="card-number">
    </div>
    <div class="field">
      <label for="rcorpId">Family name</label>
      <input type="text" id="rcorpId" class="card-number">
    </div>
    <div class="field">
      <label for="rlegalId">Corporate name</label>
      <input type="text" id="rlegalId" class="card-number">
    </div>
    <div class="field">
      <label for="rclientId">Phone</label>
      <input type="tel" id="rclientId" class="card-number" placeholder="ex : 0655511132">
    </div>
  </div>
</div>


<div class="action-btn">
  <button class="search-btn inactive">
    Search <span class="material-icons-sharp">search</span>
  </button>

  <button class="clear" style="
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: white;
  background-color: #092365;
  border: none;
  font-size: 16px;
  width: 120px;
  height: 35px;
  cursor: pointer;
  border-radius: 1px;
  padding: 0 10px;">
    Clear <span class="material-icons-sharp" style="position: absolute;">ink_eraser</span>
  </button>
</div>


</div>
<div class="client-details">
  <table>
    <tr>
    <th style="width: 10px;"></th>
      <th>Client code</th>
      <th>First name</th>
      <th>Family name</th>
      <th>Legal ID</th>
      <th>Phone</th>
      <th>Birth date</th>
      <th>Address</th>
    </tr>
    <tr>
      <td>001</td>
      <td>John</td>
      <td>Doe</td>
    </tr>
  </table>
</div>

</section>
`;

  const searchBtn = document.querySelector('.search-btn');
  const clearBtn = document.querySelector('.clear');

  searchBtn.addEventListener('click', () => {
    const pan = document.getElementById('pan').value.trim();
    if (!pan) {
      alert('Please enter a PAN number');
      return;
    }


    customerView.innerHTML = `
    <div class="customer-details">
      <div class="left-details">
        <div class="field"><label>Pan</label><input type="text" value="${pan}" disabled></div>
        <div class="field"><label>First name</label><input type="text" value="John" disabled></div>
        <div class="field"><label>Corporate ID</label><input type="text" value="CORP001" disabled></div>
        <div class="field"><label>Legal ID</label><input type="text" value="L12345" disabled></div>
        <div class="field"><label>Client host ID</label><input type="text" value="CH001" disabled></div>
      </div>
      <div class="right-details">
        <div class="field"><label>Client code</label><input type="text" value="C001" disabled></div>
        <div class="field"><label>Family name</label><input type="text" value="Doe" disabled></div>
        <div class="field"><label>Corporate name</label><input type="text" value="Acme Corp" disabled></div>
        <div class="field"><label>Phone</label><input type="text" value="0655511132" disabled></div>
      </div>
    </div>
    `;
  });

  clearBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.customer-details input');
    inputs.forEach(input => input.value = '');
    customerView.innerHTML = '';
  });
}

// Attach event
customerService.addEventListener('click', (e) => {
  e.stopPropagation();
  showCustomerService();
});
