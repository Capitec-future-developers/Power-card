document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const customerServiceBtn = document.getElementById('customer-service');
  const customerView = document.getElementById('customer-view');

  // Show initial image
  content.innerHTML = `<img src="img/issuer-front.png" alt="issuer-front" class="issuer-front">`;

  // Function to render customer service form
  function showCustomerService() {
    content.innerHTML = `
    <section>
      <div class="customer-details">
        <div class="left-details">
          <div class="field"><label for="pan">Pan</label><input type="text" id="pan" class="card-number"></div>
          <div class="field"><label for="fname">First name</label><input type="text" id="fname" class="card-number"></div>
          <div class="field"><label for="corpId">Corporate ID</label><input type="text" id="corpId" class="card-number"></div>
          <div class="field"><label for="legalId">Legal ID</label><input type="text" id="legalId" class="card-number"></div>
          <div class="field"><label for="clientId">Client host ID</label><input type="text" id="clientId" class="card-number"></div>
        </div>
        <div class="right-details">
          <div class="field"><label for="rfname">Client code</label><input type="text" id="rfname" class="card-number"></div>
          <div class="field"><label for="rcorpId">Family name</label><input type="text" id="rcorpId" class="card-number"></div>
          <div class="field"><label for="rlegalId">Corporate name</label><input type="text" id="rlegalId" class="card-number"></div>
          <div class="field"><label for="rclientId">Phone</label><input type="tel" id="rclientId" class="card-number" placeholder="ex: 0655511132"></div>
        </div>
      </div>

      <div class="action-btn">
        <button class="search-btn">Search <span class="material-icons-sharp">search</span></button>
        <button class="clear" style="
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  gap: 5px;
  color: white;
  background-color: #092365;
  border: none;
  font-size: 16px;
  width: 120px;
  height: 35px;
  cursor: pointer;
  border-radius: 2px;
 ;">Clear <span class="material-icons-sharp">ink_eraser</span></button>
      </div>

      <div class="client-details">
        <table>
          <tr>
            <th>Client code</th>
            <th>First name</th>
            <th>Family name</th>
            <th>Legal ID</th>
            <th>Phone</th>
            <th>Birth date</th>
            <th>Address</th>
          </tr>
        </table>
      </div>
    </section>
    `;

    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear');


    searchBtn.addEventListener('click', async () => {
      const pan = document.getElementById('pan').value.trim();
      if (!pan) return alert('Please enter a PAN number');

      try {
        const res = await fetch(`/customer/${pan}`);
        if (!res.ok) return alert('PAN not found');
        const customer = await res.json();

        customerView.innerHTML = `
        <div class="customer-details">
          <div class="left-details">
            <div class="field"><label>Pan</label><input type="text" value="${customer.pan}" disabled></div>
            <div class="field"><label>First name</label><input type="text" value="${customer.first_name}" disabled></div>
            <div class="field"><label>Corporate ID</label><input type="text" value="${customer.corporate_id}" disabled></div>
            <div class="field"><label>Legal ID</label><input type="text" value="${customer.legal_id}" disabled></div>
            <div class="field"><label>Client host ID</label><input type="text" value="${customer.client_host_id}" disabled></div>
          </div>
          <div class="right-details">
            <div class="field"><label>Client code</label><input type="text" value="${customer.client_code}" disabled></div>
            <div class="field"><label>Family name</label><input type="text" value="${customer.family_name}" disabled></div>
            <div class="field"><label>Corporate name</label><input type="text" value="${customer.corporate_name}" disabled></div>
            <div class="field"><label>Phone</label><input type="text" value="${customer.phone}" disabled></div>
            <div class="field"><label>Birth date</label><input type="text" value="${customer.birth_date}" disabled></div>
            <div class="field"><label>Address</label><input type="text" value="${customer.address}" disabled></div>
          </div>
        </div>`;
      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    });

    // Clear form
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.customer-details input').forEach(input => input.value = '');
      customerView.innerHTML = '';
    });
  }

  // Attach click event
  if (customerServiceBtn) {
    customerServiceBtn.addEventListener('click', showCustomerService);
  }
});
