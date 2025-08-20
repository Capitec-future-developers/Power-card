document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const customerServiceBtn = document.getElementById('customer-service');

  // Show initial image
  content.innerHTML = `<img src="img/issuer-front.png" alt="issuer-front" class="issuer-front">`;

  // Function to render customer service form
  function showCustomerService() {
    content.innerHTML = `
 <section>
 <div class="error-message" id="error-message"></div>

 <div class="customer-details">
 <div class="left-details">
 <div class="field"><label for="pan">Pan</label><input type="text" id="pan" class="card-number" placeholder="Enter PAN"></div>
 <div class="field"><label for="fname">First name</label><input type="text" id="fname" class="card-number"></div>
 <div class="field"><label for="corpId">Corporate ID</label><input type="text" id="corpId" class="card-number"></div>
 <div class="field"><label for="legalId">Legal ID</label><input type="text" id="legalId" class="card-number"></div>
 <div class="field"><label for="clientId">Client host ID</label><input type="text" id="clientId" class="card-number"></div>
 </div>
 <div class="right-details">
 <div class="field"><label for="clientCode">Client code</label><input type="text" id="clientCode" class="card-number"></div>
 <div class="field"><label for="familyName">Family name</label><input type="text" id="familyName" class="card-number"></div>
 <div class="field"><label for="corpName">Corporate name</label><input type="text" id="corpName" class="card-number"></div>
 <div class="field"><label for="phone">Phone</label><input type="tel" id="phone" class="card-number" placeholder="ex: 0655511132"></div>
 </div>
 </div>

 <div class="action-btn">
 <button class="search-btn">Search <span class="material-icons-sharp">search</span></button>
 <button class="clear" style="text-align: center;
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
  border-radius: 2px;
  padding-top: 10px;">Clear <span class="material-icons-sharp">ink_eraser</span></button>
 </div>

 <div class="client-details">
 <table id="client-table">
 <thead>
 <tr>
 <th>Client code</th>
 <th>First name</th>
 <th>Family name</th>
 <th>Legal ID</th>
 <th>Phone</th>
 <th>Birth date</th>
 <th>Address</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="client-table-body">
 <!-- Search results will appear here -->
 </tbody>
 </table>
 </div>
 </section>
 `;

    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear');
    const errorMessage = document.getElementById('error-message');

    searchBtn.addEventListener('click', async () => {
      const pan = document.getElementById('pan').value.trim();
      if (!pan) {
        showError('Please enter a PAN number');
        return;
      }

      // Clear previous error
      hideError();

      try {
        const res = await fetch(`/customer/${pan}`);
        if (!res.ok) {
          const errorData = await res.json();
          showError(errorData.message || 'PAN not found');
          return;
        }

        const response = await res.json();
        const customer = response.data;

        // Clear previous results
        const tableBody = document.getElementById('client-table-body');
        tableBody.innerHTML = '';

        // Add new row with customer data
        const row = document.createElement('tr');
        row.className = 'collapsible-row';
        row.innerHTML = `
 <td>${customer.client_code || ''}</td>
 <td>${customer.first_name || ''}</td>
 <td>${customer.family_name || ''}</td>
 <td>${customer.legal_id || ''}</td>
 <td>${customer.phone || ''}</td>
 <td>${customer.birth_date || ''}</td>
 <td>${customer.address ? customer.address.substring(0, 20) + '...' : ''}</td>
 <td><span class="material-icons-sharp">expand_more</span></td>
 `;

        // Add detail row
        const detailRow = document.createElement('tr');
        detailRow.className = 'detail-row';
        detailRow.innerHTML = `
 <td colspan="8">
 <div class="collapsible-content">
 <div class="detail-container">
 <div class="left-details">
 <div class="detail-field"><label>Pan</label><input type="text" value="${customer.pan}" disabled></div>
 <div class="detail-field"><label>First name</label><input type="text" value="${customer.first_name}" disabled></div>
 <div class="detail-field"><label>Corporate ID</label><input type="text" value="${customer.corporate_id}" disabled></div>
 <div class="detail-field"><label>Legal ID</label><input type="text" value="${customer.legal_id}" disabled></div>
 <div class="detail-field"><label>Client host ID</label><input type="text" value="${customer.client_host_id}" disabled></div>
 </div>
 <div class="right-details">
 <div class="detail-field"><label>Client code</label><input type="text" value="${customer.client_code}" disabled></div>
 <div class="detail-field"><label>Family name</label><input type="text" value="${customer.family_name}" disabled></div>
 <div class="detail-field"><label>Corporate name</label><input type="text" value="${customer.corporate_name}" disabled></div>
 <div class="detail-field"><label>Phone</label><input type="text" value="${customer.phone}" disabled></div>
 <div class="detail-field"><label>Birth date</label><input type="text" value="${customer.birth_date}" disabled></div>
 <div class="detail-field"><label>Address</label><input type="text" value="${customer.address}" disabled></div>
 </div>
 </div>
 </div>
 </td>
 `;

        tableBody.appendChild(row);
        tableBody.appendChild(detailRow);

        // Add click event to toggle details
        row.addEventListener('click', () => {
          const content = detailRow.querySelector('.collapsible-content');
          content.classList.toggle('active');

          const icon = row.querySelector('.material-icons-sharp');
          icon.textContent = content.classList.contains('active') ? 'expand_less' : 'expand_more';
        });
      } catch (err) {
        console.error(err);
        showError('Server error. Please try again later.');
      }
    });

    // Clear form
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.customer-details input').forEach(input => input.value = '');
      document.getElementById('client-table-body').innerHTML = '';
      hideError();
    });

    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }

    function hideError() {
      errorMessage.style.display = 'none';
    }
  }

  // Attach click event to customer service button
  if (customerServiceBtn) {
    customerServiceBtn.addEventListener('click', showCustomerService);
  }
});
