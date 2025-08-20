document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const customerServiceBtn = document.getElementById('customer-service');


  const mockDatabase = [
    {
      pan: '4644090987127908',
      first_name: 'Omphile',
      family_name: 'Mohlala',
      corporate_id: 'CORP001',
      legal_id: 'L12345',
      client_host_id: 'CH001',
      client_code: 'C001',
      corporate_name: 'Mzansi Tech',
      phone: '0825511132',
      birth_date: '1990-01-01',
      address: '12 Rose Street, Johannesburg, SA',
      created_at: new Date('2025-01-01T10:00:00'),
      updated_at: new Date('2025-01-01T10:00:00')
    },
    {
      pan: '4140123456789012',
      first_name: 'Spencer',
      family_name: 'Nong',
      corporate_id: 'CORP002',
      legal_id: 'L67890',
      client_host_id: 'CH002',
      client_code: 'C002',
      corporate_name: 'Cape Innovations',
      phone: '0815522233',
      birth_date: '1995-05-05',
      address: '45 Oak Avenue, Cape Town, SA',
      created_at: new Date('2025-02-01T10:00:00'),
      updated_at: new Date('2025-02-01T10:00:00')
    },
    {
      pan: '4644987654321098',
      first_name: 'Zenzi',
      family_name: 'Dube',
      corporate_id: 'CORP003',
      legal_id: 'L54321',
      client_host_id: 'CH003',
      client_code: 'C003',
      corporate_name: 'Durban Solutions',
      phone: '0835533344',
      birth_date: '1985-12-15',
      address: '78 Pine Road, Durban, SA',
      created_at: new Date('2025-03-01T10:00:00'),
      updated_at: new Date('2025-03-01T10:00:00')
    }
  ];

  // Utility functions
  const isValidPAN = pan => typeof pan === 'string' && pan.length >= 13;
  const isUniqueLegalID = (legal_id, pan) => !mockDatabase.some(c => c.legal_id === legal_id && c.pan !== pan);
  const getCustomerSummary = customer => ({
    pan: customer.pan,
    full_name: `${customer.first_name} ${customer.family_name || ''}`.trim(),
    corporate_name: customer.corporate_name,
    phone: customer.phone,
    age: customer.birth_date ? Math.floor((new Date() - new Date(customer.birth_date)) / (365.25*24*60*60*1000)) : null,
    created_at: customer.created_at
  });

  // Show initial image
  content.innerHTML = `<img src="img/issuer-front.png" alt="issuer-front" class="issuer-front">`;

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
 <button class="clear" style="align-items: center;
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
 <tbody id="client-table-body"></tbody>
 </table>
 </div>
 </section>
 `;

    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear');
    const errorMessage = document.getElementById('error-message');

    searchBtn.addEventListener('click', () => {
      const pan = document.getElementById('pan').value.trim();
      const fname = document.getElementById('fname').value.trim();
      const clientId = document.getElementById('clientId').value.trim();

      // Check if at least one search criteria is provided
      if (!pan && !fname && !clientId) {
        showError('Please enter at least one search criteria (PAN, First Name, or Client Host ID)');
        return;
      }

      hideError();

      // Find customer based on search criteria
      let customer = null;
      if (pan) {
        if (!isValidPAN(pan)) {
          showError('PAN must be at least 13 characters');
          return;
        }
        customer = mockDatabase.find(c => c.pan === pan);
      } else if (fname) {
        customer = mockDatabase.find(c =>
          c.first_name.toLowerCase().includes(fname.toLowerCase())
        );
      } else if (clientId) {
        customer = mockDatabase.find(c => c.client_host_id === clientId);
      }

      if (!customer) {
        showError('No customer found with the provided criteria');
        document.getElementById('client-table-body').innerHTML = '';
        return;
      }

      renderCustomerTable(customer);
    });

    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.customer-details input').forEach(input => input.value = '');
      document.getElementById('client-table-body').innerHTML = '';
      hideError();
    });

    function renderCustomerTable(customer) {
      const tableBody = document.getElementById('client-table-body');
      tableBody.innerHTML = '';

      const row = document.createElement('tr');
      row.className = 'collapsible-row';
      row.innerHTML = `
 <td>${customer.client_code}</td>
 <td>${customer.first_name}</td>
 <td>${customer.family_name}</td>
 <td>${customer.legal_id}</td>
 <td>${customer.phone}</td>
 <td>${customer.birth_date}</td>
 <td>${customer.address.substring(0, 20)}...</td>
 <td><span class="material-icons-sharp expand-icon">expand_more</span></td>
 `;


      tableBody.appendChild(row);

    }

    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }

    function hideError() {
      errorMessage.style.display = 'none';
    }
  }

  if (customerServiceBtn) {
    customerServiceBtn.addEventListener('click', showCustomerService);
  }
});
