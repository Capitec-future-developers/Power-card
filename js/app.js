import { mockDatabase } from './mockDatabase.js';
import { showPaymentInstrument } from './payment-instrument.js';
import { getTransactionHistory } from './mockDatabase.js';
import { showClient } from './Client.js';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const customerServiceBtn = document.getElementById('customer-service');
  const customerView = document.getElementById('customer-view');
  const subheader = document.getElementById('subheader');
  const paymentInstruments = document.getElementById('payment-instruments');
  const accounts = document.getElementById('client');

  function renderCustomerCard(customer) {
    const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
    const account = (customer.accounts && customer.accounts[0]) || {};

    const abbrev = (value) => {
      if (!value) return '';
      const map = { 'REPLACED': 'R', 'ACTIVE': 'A', 'NEW': 'N', 'NORMAL': 'N' };
      return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
    };

    const infoDot = `<button class="info-dot" data-customer-id="${customer.id || ''}">i</button>`;
    const infoDot2 = `<span class="info-dot2" data-customer-id="${customer.id || ''}">i</span>`;
    const box = (text) => `<div class="box-section">${text ?? ''}</div>`;
    const small = (text) => `<span class="small-box">${text ?? ''}</span>`;
    const row = (label, value, trailing = '') => `
      <div class="card-section">
        <div class="section-title">${label}</div>
        ${box(value)}
        ${trailing}
      </div>
    `;

    const fullName = `${(customer.first_name || '').toUpperCase()} ${(customer.family_name || '').toUpperCase()}`.trim();
    const maskedPan = instrument.number || customer.pan || '';
    const customerType = (instrument.type || '').toLowerCase().includes('business') ? 'CORPORATE' : 'INDIVIDUAL';
    const currencyCode = 'ZAR';
    const currencyNum = '710';

    return `
      <div class="customer-card">
        <div class="card-column">
          ${row('Institution', 'Capitec Bank Limited', small('000010'))}
          ${row('PAN', maskedPan, infoDot)}
          ${row('PAN status', instrument.condition || 'N/A', small(abbrev(instrument.condition || '')))}
          ${row('PAN status reason', instrument.condition === 'REPLACED' ? 'LOST REPLACEMENT' : 'N/A', small(instrument.condition === 'REPLACED' ? 'LP' : ''))}
          ${row('PAN status date', formatDate(account.pan_status_date))}
          ${row('Client host ID', customer.client_host_id)}
          ${row('Phone', customer.phone)}
          ${row('Birth date', formatDate(customer.birth_date))}
          ${row('VIP level', (instrument.type || '').includes('Platinum') ? 'Platinum' : (instrument.type || '').includes('Gold') ? 'Gold' : 'Silver')}
        </div>
        <div class="card-column">
          ${row('Full name', `${fullName ? '01 ' + fullName : ''}`)}
          ${row('Client code', customer.client_code, infoDot2)}
          ${row('Client status', account.status || 'NORMAL', small(abbrev(account.status || 'NORMAL')))}
          ${row('Client status reason', '')}
          ${row('Client status date', formatDate(customer.updated_at))}
          ${row('Legal ID', customer.legal_id)}
          ${row('Address', customer.address)}
          ${row('Member since', formatDate(customer.created_at))}
          ${row('Customer type', customerType)}
        </div>
        <div class="card-column">
          ${row('Embossed name', instrument.name || '')}
          ${row('Account number', account.number || '', infoDot2)}
          ${row('Account status', account.status || 'NORMAL', small('0'))}
          ${row('Account status reason', '')}
          ${row('Administrative status date', account.expiry || '')}
          ${row('Corporate ID', customer.corporate_id)}
          ${row('Corporate name', customer.corporate_name)}
          ${row('Currency', currencyCode, small(currencyNum))}
        </div>
      </div>
    `;
  }

  function setSubheader(text) {
    if (subheader) subheader.textContent = text;
  }

  // Utility functions
  const isValidPAN = pan => typeof pan === 'string' && pan.length >= 13;

  // Helper function to format dates
  function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  // Show initial image
  content.innerHTML = `<img src="img/issuer-front.png" alt="issuer-front" class="issuer-front">`;

  function showCustomerService() {
    localStorage.setItem('currentView', 'customerService');
    localStorage.removeItem('currentCustomer'); // Clear customer data
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
        <td colspan="8" style="position: relative; height: 275px;">
          <div class="customer-detail-container">
            <!-- Payment Instruments Section -->
            <div class="payment-section">
              <h3>Payment Instruments</h3>
              <table class="payment-table" style="position: absolute; top: 60px; width: 100%; left: 10px;">
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
              <table class="accounts-table" style="position: absolute; top: 50px; width: 100%; left: 10px;">
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
    // Store the current view and customer data in localStorage
    localStorage.setItem('currentView', 'customerView');
    localStorage.setItem('currentCustomer', JSON.stringify(customer));

    setSubheader("Customer View");
    content.innerHTML = `
      <section class="customer-view">
        <div class="top-stuff" style="display: flex; gap: 10px; margin-bottom: 15px;">
          <button id="back-btn" style="background: #092365; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">← Back</button>
          <button class="right-btn" id="memo-btn" style="position: absolute; right: 180px; background: #092365; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Memo</button>
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
        ${renderCustomerCard(customer)}
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
        <div class="tab-content" id="tab-content" style="border: 1px solid #ddd; padding: 15px; min-height: 200px;">
          <!-- Tab content will be loaded here -->
          <div id="pan-summary" class="tab-pane active">
            <section class="ps-pan-summary">
              <div class="ps-row">
                <div class="ps-panel">
                  <div class="ps-panel__title">Payment Instruments Information</div>
                  <div class="ps-panel__body">
                    ${customer.payment_instruments.map((instrument, index) => `
                      <div class="ps-field">
                        <div class="ps-label">${index === 0 ? 'Product name' : `Secondary Product ${index}`}</div>
                        <div class="ps-value">${instrument.type}</div>
                        <div class="ps-small">PPG001</div>
                      </div>
                      <div class="ps-field">
                        <div class="ps-label">${index === 0 ? 'PAN' : `Secondary PAN ${index}`}</div>
                        <div class="ps-value">${instrument.number}</div>
                      </div>
                      <div class="ps-field">
                        <div class="ps-label">${index === 0 ? 'Embossed name' : `Secondary Name ${index}`}</div>
                        <div class="ps-value">${instrument.full_name}</div>
                      </div>
                      <div class="ps-field">
                        <div class="ps-label">${index === 0 ? 'Expiry' : `Secondary Expiry ${index}`}</div>
                        <div class="ps-value">${instrument.expiry}</div>
                        <div class="ps-note">Last transaction date</div>
                        <div class="ps-value">${new Date(customer.updated_at).toISOString().slice(0,19).replace('T',' ')}.000</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                <div class="ps-panel">
                  <div class="ps-panel__title">Pending Authorizations</div>
                  <div class="ps-panel__body ps-auth">
                    <div class="ps-auth__row">
                      <div class="ps-label">Credit</div>
                      <div class="ps-value ps-value--short">3.85</div>
                      <div class="ps-small">ZAR</div>
                      <span class="info-dot">i</span>
                    </div>
                    <div class="ps-auth__row">
                      <div class="ps-label">Loan</div>
                      <div class="ps-value ps-value--short">0.00</div>
                      <div class="ps-small">ZAR</div>
                      <span class="info-dot">i</span>
                    </div>
                    <div class="ps-auth__row">
                      <div class="ps-label">Cash/Transfer</div>
                      <div class="ps-value ps-value--short">0.00</div>
                      <div class="ps-small">ZAR</div>
                      <span class="info-dot">i</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ps-panel ps-panel--wide">
                <div class="ps-panel__title">Annual Membership Fees</div>
                <div class="ps-panel__body">
                  <div class="ps-fees">
                    <div class="ps-fees__row">
                      <div class="ps-label">Last billing amount</div>
                      <div class="ps-value ps-value--short">0.00</div>
                      <div class="ps-small">ZAR</div>
                      <div class="ps-label">Last billing date</div>
                      <div class="ps-value">${formatDate(customer.created_at)}</div>
                    </div>
                    <div class="ps-fees__row">
                      <div class="ps-label">Next billing amount</div>
                      <div class="ps-value ps-value--short">0.00</div>
                      <div class="ps-small">ZAR</div>
                      <div class="ps-label">Next billing date</div>
                      <div class="ps-value">${formatDate(customer.updated_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div id="account-summary" class="tab-pane" style="display: none;">
            <section class="as-wrapper">
              <div class="as-section">
                <div class="as-title">Account</div>
                <div class="as-grid">
                  <div class="as-field"><div class="as-label">Retained administrative ...</div><div class="as-value"></div></div>
                  <div class="as-field"><div class="as-label">Retained reason code</div><div class="as-value"></div></div>
                  <div class="as-field"><div class="as-label">Balance status</div><div class="as-value">DEBTOR BALANCE</div></div>
                  <div class="as-field"><div class="as-label">Cycle</div><div class="as-value">C06</div></div>
                  <div class="as-field"><div class="as-label">Unpaid status</div><div class="as-value">${customer.accounts[0].status}</div></div>
                  <div class="as-field"><div class="as-label">Highest balance</div><div class="as-value"></div></div>
                  <div class="as-field"><div class="as-label">Product name</div><div class="as-value">${customer.accounts[0].type}</div></div>
                  <div class="as-field"><div class="as-label">Last payment date</div><div class="as-value">${formatDate(customer.updated_at)}</div></div>
                  <div class="as-field"><div class="as-label">Version</div><div class="as-value">1</div></div>
                  <div class="as-field"><div class="as-label">Highest payment amount</div><div class="as-value"></div></div>
                  <div class="as-field"><div class="as-label">Last monthly billing date</div><div class="as-value">${formatDate(customer.created_at)}</div></div>
                  <div class="as-field"><div class="as-label">Next term due date</div><div class="as-value">${formatDate(customer.accounts[0].expiry)}</div></div>
                  <div class="as-field"><div class="as-label">Last payment amount</div><div class="as-value">1,500.00 ZAR</div></div>
                  <div class="as-field"><div class="as-label">Nbr of checks returned</div><div class="as-value">0</div></div>
                  <div class="as-field"><div class="as-label">Next statement date</div><div class="as-value">${formatDate(customer.accounts[0].pan_status_date)}</div></div>
                  <div class="as-field"><div class="as-label">Next term over due date</div><div class="as-value">${formatDate(customer.accounts[0].pan_status_date)}</div></div>
                </div>
              </div>
              <div class="as-section">
                <div class="as-title">Credit limit</div>
                <div class="as-grid as-grid--four">
                  <div class="as-field"><div class="as-label">Credit limit</div><div class="as-value">20,000.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Cash limit</div><div class="as-value">20,000.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Additional loan limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Former credit limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Former cash limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Former loan limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                </div>
              </div>
              <div class="as-section">
                <div class="as-title">Temporary limits</div>
                <div class="as-grid as-grid--four">
                  <div class="as-field"><div class="as-label">Start date</div><div class="as-value">${formatDate(customer.accounts[0].pan_status_date)}</div></div>
                  <div class="as-field"><div class="as-label">End date</div><div class="as-value">${formatDate(customer.accounts[0].expiry)}</div></div>
                  <div class="as-field"><div class="as-label">Credit limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Cash limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                  <div class="as-field"><div class="as-label">Additional loan limit</div><div class="as-value">0.00</div><div class="as-suffix">ZAR</div></div>
                </div>
              </div>
              <div class="as-section">
                <div class="as-title">Direct debit accounts</div>
                <table class="as-table">
                  <thead>
                    <tr>
                      <th>Institution</th>
                      <th>Branch</th>
                      <th>Currency</th>
                      <th>Account number</th>
                      <th>IBAN</th>
                      <th>SWIFT code</th>
                      <th>Account status</th>
                      <th>Routing number</th>
                      <th>Start date</th>
                      <th>End date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colspan="10" style="text-align:left; color:#666; padding:10px;">No records found</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <div id="account-financials" class="tab-pane" style="display: none;">
            ${(() => { const f = computeFinancials(customer); return `
            <section class="af-wrapper">
              <div class="as-section">
                <div class="as-title">Account Financials</div>
                <div class="af-grid">
                  <div class="af-row">
                    <div class="af-label">Total account balance</div>
                    <div class="af-value">${f.totalAbs}</div>
                    <div class="af-suffix">ZAR</div>
                    <div class="af-polarity">${f.totalPolarity}</div>
                    <div class="af-equals">=</div>
                    <div class="af-label">Opening balance</div>
                    <div class="af-value">${f.openingAbs}</div>
                    <div class="af-suffix">ZAR</div>
                    <div class="af-polarity">${f.openingPolarity}</div>
                    <div class="af-actions"><button class="af-btn">Balance</button><button class="af-btn">Global Summary</button></div>
                  </div>
                  <div class="af-row">
                    <div class="af-label">Available balance</div>
                    <div class="af-value">${f.available}</div>
                    <div class="af-suffix">ZAR</div>
                    <div class="af-polarity">${f.availablePolarity}</div>
                    <div class="af-equals">-</div>
                    <div class="af-colspan">
                      <div class="af-breakdown">
                        <div class="af-break">
                          <span class="af-sub">Current cycle balance</span>
                          <span class="af-subv">${f.currentCycle}</span><span class="af-suffix">ZAR</span><span class="af-polarity">Debit</span>
                        </div>
                        <div class="af-break">
                          <span class="af-sub">Total loan balance</span>
                          <span class="af-subv">0.00</span><span class="af-suffix">ZAR</span><span class="af-polarity">Debit</span>
                        </div>
                        <div class="af-break">
                          <span class="af-sub">Credit limit</span>
                          <span class="af-subv">${f.creditLimit}</span><span class="af-suffix">ZAR</span>
                        </div>
                        <div class="af-break">
                          <span class="af-sub">Total account balance</span>
                          <span class="af-subv">${f.totalAbs}</span><span class="af-suffix">ZAR</span><span class="af-polarity">${f.totalPolarity}</span>
                        </div>
                        <div class="af-break">
                          <span class="af-sub">Pending authorizations</span>
                          <span class="af-subv">${f.pendingAuth}</span><span class="af-suffix">ZAR</span>
                        </div>
                        <div class="af-break">
                          <span class="af-sub">Loan contracts in progress</span>
                          <span class="af-subv">0.00</span><span class="af-suffix">ZAR</span>
                        </div>
                        <div class="af-break">
                          <span class="af-sub">In transit balance</span>
                          <span class="af-subv">0.00</span><span class="af-suffix">ZAR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="af-row">
                    <div class="af-label">Available cash</div>
                    <div class="af-value">${f.available}</div>
                    <div class="af-suffix">ZAR</div>
                    <div class="af-polarity">${f.availablePolarity}</div>
                    <div class="af-equals">-</div>
                    <div class="af-colspan">
                      <div class="af-breakdown">
                        <div class="af-break"><span class="af-sub">Cash limit</span><span class="af-subv">${f.creditLimit}</span><span class="af-suffix">ZAR</span></div>
                        <div class="af-break"><span class="af-sub">Total cash balance</span><span class="af-subv">${f.cashBalance}</span><span class="af-suffix">ZAR</span><span class="af-polarity">Debit</span></div>
                        <div class="af-break"><span class="af-sub">Pending cash authorizations</span><span class="af-subv">0.00</span><span class="af-suffix">ZAR</span></div>
                      </div>
                    </div>
                  </div>
                  <div class="af-row">
                    <div class="af-label">Accrued interest</div>
                    <div class="af-value">${(f.isMbod ? 89.24 : 0.00).toFixed ? (f.isMbod ? 89.24 : 0.00).toFixed(2) : (f.isMbod ? '89.24' : '0.00')}</div>
                    <div class="af-suffix">ZAR</div>
                    <div class="af-polarity"></div>
                    <div class="af-equals"></div>
                    <div class="af-colspan"></div>
                  </div>
                </div>
              </div>
              <div class="as-section">
                <div class="as-title">Status summary</div>
                <div style="padding:10px; color:#333;">
                  ${(() => {
                    const acct = (customer.accounts && customer.accounts[0]) || {}; const s = String(acct.status||'').toUpperCase();
                    if (f.isMbod) return `This account is in MBOD/arrears status (${acct.status}). The customer owes. Unpaid amount this cycle: ${f.unpaidText} ZAR.`;
                    return `This is a normal account (${acct.status}). Balance is positive and there is no unpaid amount.`;
                  })()}
                </div>
              </div>
            </section>
            `; })()}
          </div>
              <div class="as-section">
                <div class="as-title">Turnover</div>
                <div style="padding:10px;"><button class="af-btn">Turnover</button></div>
              </div>
            </section>
          </div>
          <div id="bills-loans" class="tab-pane" style="display: none;">
            <section class="af-wrapper">
              <div class="as-section">
                <div class="as-title" style="background: #1e4a72; color: white; padding: 8px 15px; margin: 0; font-weight: bold;">CURRENT LOANS</div>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                      <tr style="background: #f8f9fa;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Financing type</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Loan type</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Acronym</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Transaction amount</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Transaction date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Installment amount</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Number of terms</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Remaining terms</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Remaining capital balance</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Loan start date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Loan end date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Next installment</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Catalogue product</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="14" style="border: 1px solid #ddd; padding: 20px; text-align: center; color: #666;">No records found</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border: 1px solid #ddd; border-top: none;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">«</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">‹</button>
                      <button style="border: 1px solid #007bff; background: #007bff; color: white; padding: 4px 8px;">1</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">›</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">»</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span>10</span>
                      <select style="border: 1px solid #ccc; padding: 2px;">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="as-section">
                <div class="as-title" style="background: #1e4a72; color: white; padding: 8px 15px; margin: 0; font-weight: bold;">STATEMENTS</div>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                      <tr style="background: #f8f9fa;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Statement date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Minimum due</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Total payments posted</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Amount missed payments</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Due date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Overdue date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Term status</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Credit limit</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Opening balance</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Closing balance</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Request amount</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 6px;">08/06/2025</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">1,083.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">0.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">0.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px;">09/03/2025</td>
                        <td style="border: 1px solid #ddd; padding: 6px;">09/03/2025</td>
                        <td style="border: 1px solid #ddd; padding: 6px;">Waiting for payment</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">20,000.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">15,146.33 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">15,499.53 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">0.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: center;"> </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 6px;">07/06/2025</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">942.82 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">942.82 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">0.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px;">08/03/2025</td>
                        <td style="border: 1px solid #ddd; padding: 6px;">08/03/2025</td>
                        <td style="border: 1px solid #ddd; padding: 6px;">Term closed</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">20,000.00 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">16,056.58 ZAR</td>
                        <td style="border: 1px solid #ddd; padding: 6px; text-align: center;"> </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border: 1px solid #ddd; border-top: none;">
                    <div style="background: #e9ecef; padding: 8px; border: 1px solid #dee2e6;">
                      <span style="font-weight: bold;">Total terms unpaid amount</span>
                      <span style="margin-left: 200px; font-weight: bold;">1,083.00</span>
                      <span style="margin-left: 20px;">ZAR</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">«</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">‹</button>
                      <button style="border: 1px solid #007bff; background: #007bff; color: white; padding: 4px 8px;">1</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">2</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">3</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">4</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">›</button>
                      <button style="border: 1px solid #ccc; background: white; padding: 4px 8px;">»</button>
                      <span style="margin-left: 20px;">10</span>
                      <select style="border: 1px solid #ccc; padding: 2px;">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div id="loyalty" class="tab-pane" style="display: none;">
            <table class="styleds-table">
              <thead>
                <tr class="loyalty">
                  <th>Institution</th>
                  <th>Branch</th>
                  <th>Client code</th>
                  <th>Catalogue product</th>
                  <th>Product version</th>
                  <th>Loyalty account nbr</th>
                  <th>Account owner type</th>
                  <th>Loyalty status</th>
                  <th><span class="material-icons-sharp">component_exchange</span></th>
                </tr>
              </thead>
              <tbody>
                ${(customer?.loyalty_accounts || []).map(account => `
                  <tr>
                    <td>${account.institution}</td>
                    <td>${account.branch}</td>
                    <td>${account.client_code}</td>
                    <td>${account.catalogue_product}</td>
                    <td>${account.product_version || ''}</td>
                    <td>${account.loyalty_account_number || ''}</td>
                    <td>${account.account_owner_type}</td>
                    <td>${account.loyalty_status}</td>
                    <td>${account.exchange_icon || '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div id="addon-services" class="tab-pane" style="display: none;">
            <h3>Add-on Services</h3>
            <p>No add-on services available for this customer.</p>
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

    // Handle clicks on info-dot buttons to show payment instrument view
    content.addEventListener('click', (e) => {
      if (e.target.classList.contains('info-dot')) {
        showPaymentInstrument(customer);
      }
    });

    content.addEventListener('click', (e) => {
      if (e.target.classList.contains('info-dot2')) {
        showClient(customer);
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

// Handle page refresh to restore the correct view
window.addEventListener("DOMContentLoaded", () => {
  const savedView = localStorage.getItem("currentView");
  const savedCustomer = localStorage.getItem("currentCustomer");

  if (savedView === "customerView" && savedCustomer) {
    try {
      const customer = JSON.parse(savedCustomer);
      // Validate customer data by checking if it exists in mockDatabase
      const validCustomer = mockDatabase.find(c => c.id === customer.id);
      if (validCustomer) {
        showCustomerView(validCustomer);
      } else {
        // Fallback to customer service if customer data is invalid
        showCustomerService();
      }
    } catch (e) {
      // Handle JSON parse errors or invalid data
      showCustomerService();
    }
  } else {
    // Default to customer service view for all other cases
    showCustomerService();
  }
});
