
function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function renderCustomerCard(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const abbrev = (value) => {
    if (!value) return '';
    const map = { 'REPLACED': 'R', 'ACTIVE': 'A', 'NEW': 'N', 'NORMAL': 'N' };
    return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
  };

  const infoDot = `<button class="info-dot" data-customer-id="${customer.id || ''}">i</button>`;
  const infoDot2 = '<span class="info-dot">i</span>';
  const box = (text) => `<div class="box-section">${text ?? ''}</div>`;
  const small = (text) => `<span class="small-box">${text ?? ''}</span>`;
  const row = (label, value, trailing = '') => `
    <div class="card-section">
      <div class="section-title">${label}</div>
      ${box(value)}
      ${trailing}
    </div>`;

  const fullName = `${(customer.first_name || '').toUpperCase()} ${(customer.family_name || '').toUpperCase()}`.trim();
  const maskedPan = instrument.number || customer.pan || '';
  const customerType = (instrument.type || '').toLowerCase().includes('business') ? 'CORPORATE' : 'INDIVIDUAL';
  const currencyCode = 'ZAR';
  const currencyNum = '710';

  return `
    <div class="customer-card">
      <div class="card-column">
        ${row('Institution', 'Capitec Bank Limited', small('000010'))}
        ${row('PAN', maskedPan)}
         ${row('Client code', customer.client_code)}
         ${row('Gender', customer.gender )}
        ${row('PAN status reason', instrument.condition === 'REPLACED' ? 'LOST REPLACEMENT' : 'N/A', small(instrument.condition === 'REPLACED' ? 'LP' : ''))}
        ${row('PAN status date', formatDate(account.pan_status_date))}
        ${row('Client host ID', customer.client_host_id)}
        ${row('Phone', customer.phone)}
        ${row('Birth date', formatDate(customer.birth_date))}
         ${row('PAN status', instrument.condition || 'N/A', small(abbrev(instrument.condition || '')))}
        ${row('VIP level', (instrument.type || '').includes('Platinum') ? 'Platinum' : (instrument.type || '').includes('Gold') ? 'Gold' : 'Silver')}
      </div>
      <div class="card-column">
        ${row('Full name', `${fullName ? '01 ' + fullName : ''}`)}

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

export function showPaymentInstrument(customer) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="payment-instrument">
      <div class="payment-instrument-header">
        <button class="back-btn yo" id="payment-back-btn">← Back</button>
        <div class="rigth-sides">
        <button class="operate yo">Operations history</button>
        <button class="Memo yo">Memo</button>
        <button class="lost-stolen yo">Lost/stolen</button>
        <button class="operations yo" >Operations</button>
        <button class="Save-all yo">Save all</button>
        </div>
      </div>
      <div class="payment-content" style="display: flex; flex-direction: column; gap: 20px;">
        <div class="left-section" style="width: 200px;">
          <div class="Id options">Identification</div>
          <div class="demo options">Demographic</div>
          <div class="Emb options">Embossing</div>
          <div class="address options">Address</div>
          <div class="Add options">Additional fields</div>
          <div class="add-on options">Add on services</div>
          <div class="Acc options">Accounts/ posting rules</div>
          <div class="comms options">Communication strategy</div>
          <div class="pan options">Pan indicators</div>
        </div>
        <div class="payment-body" style="flex: 1;">
          <div class="ID">Identification</div>
          ${renderCustomerCard(customer)}

          <div class="payment-details" style="margin-top: 20px;">
            <h3>Payment Instrument Details</h3>
            <div class="instrument-info">
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                <div class="info-item">
                  <label>Card Type:</label>
                  <div>${customer.payment_instruments[0]?.type || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <label>Card Number:</label>
                  <div>${customer.payment_instruments[0]?.number || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <label>Expiry Date:</label>
                  <div>${customer.payment_instruments[0]?.expiry || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <label>Card Status:</label>
                  <div>${customer.payment_instruments[0]?.condition || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <label>Embossed Name:</label>
                  <div>${customer.payment_instruments[0]?.name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <label>Full Name:</label>
                  <div>${customer.payment_instruments[0]?.full_name || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;


  document.getElementById('payment-back-btn').addEventListener('click', () => {

    window.history.back();
  });


  window.currentView = "payment-instrument";
  window.currentCustomer = customer;
}

console.log("Payment instrument module loaded");
