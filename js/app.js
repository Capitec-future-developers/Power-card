document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const customerServiceBtn = document.getElementById('customer-service');
  const customerView = document.getElementById('customer-view');
  const subheader = document.getElementById('subheader');

  // ---- Helper to update subheader ----
  function setSubheader(text) {
    if (subheader) subheader.textContent = text;
  }

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
      updated_at: new Date('2025-01-01T10:00:00'),
      payment_instruments: [
        {
          type: 'Personal Gold Credit Card',
          number: '464479XXXXXX6088',
          name: 'O. MOHLALA',
          full_name: 'OMPHILE MOHLALA',
          status: 'Not applicable',
          expiry: '05/2025',
          condition: 'REPLACED',
          type_detail: 'Primary'
        }
      ],
      accounts: [
        {
          type: 'Personal Gold Account',
          number: '4140442000004918',
          status: 'NORMAL',
          expiry: '01/10/2025',
          pan_status_date: '01/01/2025'
        }
      ]
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
      updated_at: new Date('2025-02-01T10:00:00'),
      payment_instruments: [
        {
          type: 'Business Platinum Card',
          number: '414012XXXXXX9012',
          name: 'S. NONG',
          full_name: 'SPENCER NONG',
          status: 'Active',
          expiry: '08/2026',
          condition: 'NEW',
          type_detail: 'Primary'
        }
      ],
      accounts: [
        {
          type: 'Business Account',
          number: '4140123000005678',
          status: 'NORMAL',
          expiry: '03/15/2026',
          pan_status_date: '02/01/2025'
        }
      ]
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
      updated_at: new Date('2025-03-01T10:00:00'),
      payment_instruments: [
        {
          type: 'Personal Silver Credit Card',
          number: '464498XXXXXX1098',
          name: 'Z. DUBE',
          full_name: 'ZENZI DUBE',
          status: 'Active',
          expiry: '11/2024',
          condition: 'ACTIVE',
          type_detail: 'Primary'
        }
      ],
      accounts: [
        {
          type: 'Savings Account',
          number: '4140442000009876',
          status: 'NORMAL',
          expiry: '12/12/2024',
          pan_status_date: '03/01/2025'
        }
      ]
    }
  ];

  // Utility functions
  const isValidPAN = pan => typeof pan === 'string' && pan.length >= 13;

  // Show initial image
  content.innerHTML = `<img src="img/issuer-front.png" alt="issuer-front" class="issuer-front">`;

  function showCustomerService() {
    setSubheader("Customer Service");

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
 <button class="clear" style="align-items: center; justify-content: center; gap: 5px; color: white; background-color: #092365; border: none; font-size: 16px; width: 120px; height: 35px; cursor: pointer; border-radius: 2px; padding-top: 10px;">Clear <span class="material-icons-sharp">ink_eraser</span></button>
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

      if (!pan && !fname && !clientId) {
        showError('Please enter at least one search criteria (PAN, First Name, or Client Host ID)');
        return;
      }

      hideError();

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

      const detailsRow = document.createElement('tr');
      detailsRow.className = 'details-row';
      detailsRow.innerHTML = `
 <td colspan="8" style="position: relative; height: 200px;">
 <div class="customer-detail-container">
 <!-- Payment Instruments Section -->
 <div class="payment-section">
 <h3>Payment Instruments</h3>
 <table class="payment-table" style="position: absolute; top: 70px; width: 100%; left: 10px; ">
 <tbody>
 ${customer.payment_instruments.map(instrument => `
 <tr>
 <td>${instrument.type}</td>
 <td>${instrument.number}</td>
 <td>${instrument.name}</td>
 <td>${instrument.full_name}</td>
 <td>${instrument.status}</td>
 <td>${instrument.expiry}</td>
 <td>${instrument.condition}</td>
 <td>${instrument.type_detail}</td>
 </tr>
 `).join('')}
 </tbody>
 </table>
 </div>

 <!-- Accounts Section -->
 <div class="accounts-section">
 <h3>Accounts</h3>
 <table class="accounts-table" style="position: absolute; top: 60px; width: 100%; left: 10px; " >
 <tbody>
 ${customer.accounts.map(account => `
 <tr>
 <td>${account.type}</td>
 <td>${account.number}</td>
 <td>${account.status}</td>
 <td>${account.expiry}</td>
 </tr>
 `).join('')}
 </tbody>
 </table>
 </div>
 </div>
 </td>
 `;

      detailsRow.style.display = 'none';

      row.addEventListener('click', () => {
        if (detailsRow.style.display === 'none') {
          detailsRow.style.display = 'table-row';
          row.querySelector('.expand-icon').textContent = 'expand_less';
        } else {
          detailsRow.style.display = 'none';
          row.querySelector('.expand-icon').textContent = 'expand_more';
        }
      });

      detailsRow.addEventListener('dblclick', (e) => {
        if (e.target.closest('.payment-table')) {
          showCustomerView(customer);
        }
      });

      tableBody.appendChild(row);
      tableBody.appendChild(detailsRow);
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

  function showCustomerView(customer) {
    setSubheader("Customer View");

    content.innerHTML = `
<section class="customer-view">
<div class="top-stuff" style="display: flex; gap: 10px; margin-bottom: 15px;">
 <button id="back-btn" style="background: #092365; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">← Back</button>
 <button class="right-btn" id="memo-btn" style="position: absolute; right: 180px;background: #092365; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Memo</button>
 <button class="right-btn" id="transactions-btn" style="background: #092365; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Account Transactions</button>
</div>

<!-- Memo Popup (hidden by default) -->
<div id="memo-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.3); z-index: 1000; width: 400px;">
 <h3>Add Memo</h3>
 <textarea id="memo-text" style="width: 100%; height: 100px; margin: 10px 0; padding: 8px;"></textarea>
 <div style="display: flex; justify-content: space-between;">
 <button id="save-memo" style="background: #092365; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Save</button>
 <button id="cancel-memo" style="background: #ccc; color: black; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Cancel</button>
 </div>
</div>

<div class="id">
 Identification
</div>

<!-- First Table: Institution Details -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Institution</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 18%;">Capitec Bank Limited</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">PAN</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 18%;">${customer.pan}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">PAN Status</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 19%;">Active</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">PAN Status Reason</th>
 <td style="border: 1px solid #ddd; padding: 8px;">N/A</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">PAN Status Date</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.payment_instruments[0].pan_status_date || '01/01/2025'}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Client Host ID</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.client_host_id}</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Phone</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.phone}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Birth Date</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.birth_date}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">VIP Level</th>
 <td style="border: 1px solid #ddd; padding: 8px;">Standard</td>
 </tr>
</table>

<!-- Second Table: Client Details -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Full Name</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 18%;">${customer.first_name} ${customer.family_name}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Client Code</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 18%;">${customer.client_code}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Client Status</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 19%;">Active</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Client Status Reason</th>
 <td style="border: 1px solid #ddd; padding: 8px;">N/A</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Client Status Date</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(customer.created_at)}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Legal ID</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.legal_id}</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Address</th>
 <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">${customer.address}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Member Since</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(customer.created_at)}</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Customer Type</th>
 <td style="border: 1px solid #ddd; padding: 8px;">Individual</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Email</th>
 <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">${customer.first_name.toLowerCase()}.${customer.family_name.toLowerCase()}@example.com</td>
 </tr>
</table>

<!-- Third Table: Account Details -->
<table style="width: cloudflare.com; border-collapse: collapse; margin-bottom: 20px;">
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Embossed Name</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 18%;">${customer.first_name.charAt(0)}. ${customer.family_name}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Account Number</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 18%;">${customer.accounts[0].number}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left; width: 15%;">Account Status</th>
 <td style="border: 1px solid #ddd; padding: 8px; width: 19%;">${customer.accounts[0].status}</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Account Status Reason</th>
 <td style="border: 1px solid #ddd; padding: 8px;">N/A</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Admin Status Date</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(customer.updated_at)}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Corporate Name</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.corporate_name}</td>
 </tr>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Currency</th>
 <td style="border: 1px solid #ddd; padding: 8px;">ZAR</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Card Type</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.payment_instruments[0].type}</td>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6; text-align: left;">Card Expiry</th>
 <td style="border: 1px solid #ddd; padding: 8px;">${customer.payment_instruments[0].expiry}</td>
 </tr>
</table>

<!-- Tab Section -->
<div class="tabs" style="margin-bottom: 20px; display: flex; border-bottom: 1px solid #ddd;">
 <button class="tab-btn active" data-tab="pan-summary">PAN Summary</button>
 <button class="tab-btn" data-tab="account-summary">Account Summary</button>
 <button class="tab-btn" data-tab="account-financials">Account Financials</button>
 <button class="tab-btn" data-tab="bills-loans">Bills & Loans</button>
 <button class="tab-btn" data-tab="loyalty">Loyalty</button>
 <button class="tab-btn" data-tab="addon-services">Add-on Services</button>
 <button class="tab-btn" data-tab="transaction-history">Transaction History</button>
</div>

<div id="tab-content" style="border: 1px solid #ddd; padding: 15px; min-height: 200px;">
 <!-- Tab content will be loaded here -->
 <div id="pan-summary" class="tab-pane active">
 <h3>PAN Summary</h3>
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
 <div>
 <p><strong>Primary Account Number:</strong> ${customer.pan}</p>
 <p><strong>Status:</strong> Active</p>
 <p><strong>Issued:</strong> ${formatDate(customer.created_at)}</p>
 <p><strong>Last Updated:</strong> ${formatDate(customer.updated_at)}</p>
 </div>
 <div>
 <p><strong>Card Type:</strong> ${customer.payment_instruments[0].type}</p>
 <p><strong>Card Condition:</strong> ${customer.payment_instruments[0].condition}</p>
 <p><strong>Expiry Date:</strong> ${customer.payment_instruments[0].expiry}</p>
 <p><strong>Cardholder Name:</strong> ${customer.payment_instruments[0].full_name}</p>
 </div>
 </div>
 </div>
 <div id="account-summary" class="tab-pane" style="display: none;">
 <h3>Account Summary</h3>
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
 <div>
 <p><strong>Account Number:</strong> ${customer.accounts[0].number}</p>
 <p><strong>Type:</strong> ${customer.accounts[0].type}</p>
 <p><strong>Status:</strong> ${customer.accounts[0].status}</p>
 <p><strong>Expiry:</strong> ${customer.accounts[0].expiry}</p>
 </div>
 <div>
 <p><strong>Opening Date:</strong> ${formatDate(customer.created_at)}</p>
 <p><strong>Currency:</strong> ZAR (South African Rand)</p>
 <p><strong>Account Owner:</strong> ${customer.first_name} ${customer.family_name}</p>
 <p><strong>Relationship:</strong> Primary Account Holder</p>
 </div>
 </div>
 </div>
 <div id="account-financials" class="tab-pane" style="display: none;">
 <h3>Account Financials</h3>
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
 <div>
 <p><strong>Current Balance:</strong> R 5,432.10</p>
 <p><strong>Available Balance:</strong> R 6,000.00</p>
 <p><strong>Credit Limit:</strong> R 10,000.00</p>
 <p><strong>Utilization Rate:</strong> 45.3%</p>
 </div>
 <div>
 <p><strong>Last Payment:</strong> R 500.00 on 15/08/2025</p>
 <p><strong>Minimum Payment Due:</strong> R 250.00</p>
 <p><strong>Payment Due Date:</strong> 05/09/2025</p>
 <p><strong>Overdraft Protection:</strong> Enabled</p>
 </div>
 </div>
 </div>
 <div id="bills-loans" class="tab-pane" style="display: none;">
 <h3>Bills & Loans</h3>
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
 <div>
 <h4>Active Loans</h4>
 <p><strong>Personal Loan:</strong> R 15,000.00 remaining</p>
 <p><strong>Monthly Payment:</strong> R 1,200.00</p>
 <p><strong>Interest Novak Interest Rate:</strong> 11.5%</p>
 <p><strong>Next Payment Due:</strong> 05/09/2025</p>
 </div>
 <div>
 <h4>Bill Payments</h4>
 <p><strong>Electricity:</strong> R 650.00 (Last paid: 12/08/2025)</p>
 <p><strong>Internet:</strong> R 899.00 (Due: 01/09/2025)</p>
 <p><strong>Insurance:</strong> R 1,250.00 (Due: 05/09/2025)</p>
 <p><strong>Mobile:</strong> R 299.00 (Auto-debit enabled)</p>
 </div>
 </div>
 <div id="loyalty" class="tab-pane" style="display: none;">
 <h3>Loyalty Program</h3>
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
 <div>
 <p><strong>Rewards Points:</strong> 1,250 points</p>
 <p><strong>Points Value:</strong> R 125.00</p>
 <p><strong>Tier:</strong> Silver Member</p>
 <p><strong>Annual Spend:</strong> R 45,680.00</p>
 </div>
 <div>
 <p><strong>Points Expiring:</strong> 100 points on 31/12/2025</p>
 <p><strong>Recent Redemption:</strong> R 50 voucher (15/07/2025)</p>
 <p><strong>Lifetime Points:</strong> 8,450 points</p>
 <p><strong>Partner Offers:</strong> 5 available</p>
 </div>
 </div>
 <div id="addon-services" class="tab-pane" style="display: none;">
 <h3>Add-on Services</h3>
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
 <div>
 <p><strong>Travel Insurance:</strong> Active (Worldwide coverage)</p>
 <p><strong>Purchase Protection:</strong> Active (90 days)</p>
 <p><strong>Extended Warranty:</strong> Not subscribed</p>
 <p><strong>Card Protection:</strong> Active</p>
 </div>
 <div>
 <p><strong>Airport Lounge Access:</strong> 4 visits per year</p>
 <p><strong>Concierge Service:</strong> Available</p>
 <p><strong>Roadside Assistance:</strong> Included</p>
 <p><strong>Fraud Monitoring:</strong> 24/7 Active</p>
 </div>
 </div>
 <div id="transaction-history" class="tab-pane" style="display: none;">
 <h3>Recent Transactions</h3>
 <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
 <thead>
 <tr>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6;">Date</th>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6;">Description</th>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6;">Category</th>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6;">Amount</th>
 <th style="border: 1px solid #ddd; padding: 8px; background-color: #e8e6e6;">Balance</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td style="border: 1px solid #ddd; padding: 8px;">18/08/2025</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Grocery Store</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Food</td>
 <td style="border: 1px solid #ddd; padding: 8px;">-R 350.50</td>
 <td style="border: 1px solid #ddd; padding: 8px;">R 5,432.10</td>
 </tr>
 <tr>
 <td style="border: 1px solid #ddd; padding: 8px;">15/08/2025</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Salary Deposit</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Income</td>
 <td style="border: 1px solid #ddd; padding: 8px;">+R 12,500.00</td>
 <td style="border: 1px solid #ddd; padding: 8px;">R 5,782.60</td>
 </tr>
 <tr>
 <td style="border: 1px solid #ddd; padding: 8px;">12/08/2025</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Electricity Payment</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Utilities</td>
 <td style="border: 1px solid #ddd; padding: 8px;">-R 650.00</td>
 <td style="border: 1px solid #ddd; padding: 8px;">R -6,717.40</td>
 </tr>
 <tr>
 <td style="border: 1px solid #ddd; padding: 8px;">10/08/2025</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Online Shopping</td>
 <td style="border: 1px solid #ddd; padding: 8px;">Shopping</td>
 <td style="border: 1px solid #ddd; padding: 8px;">-R 1,200.00</td>
 <td style="border: 1px solid #ddd; padding: 8px;">R -6,067.40</td>
 </tr>
 </tbody>
 </table>
 </div>
</div>
</section>
`;

    // Helper function to format dates
    function formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    // Back button functionality
    document.getElementById('back-btn').addEventListener('click', showCustomerService);

    // Memo button functionality
    document.getElementById('memo-btn').addEventListener('click', () => {
      document.getElementById('memo-popup').style.display = 'block';
    });

    document.getElementById('cancel-memo').addEventListener('click', () => {
      document.getElementById('memo-popup').style.display = 'none';
      document.getElementById('memo-text').value = '';
    });

    document.getElementById('save-memo').addEventListener('click', () => {
      const memoText = document.getElementById('memo-text').value;
      if (memoText.trim()) {
        alert('Memo saved: ' + memoText);
        document.getElementById('memo-popup').style.display = 'none';
        document.getElementById('memo-text').value = '';
      } else {
        alert('Please enter memo text');
      }
    });

    // Transactions button functionality
    document.getElementById('transactions-btn').addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');

      document.querySelector('[data-tab="transaction-history"]').classList.add('active');
      document.getElementById('transaction-history').style.display = 'block';
    });

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.style.display = 'none');

        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).style.display = 'block';
      });
    });
  }
});
