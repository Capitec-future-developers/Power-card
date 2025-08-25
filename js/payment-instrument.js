// Helper function to format dates (needs to be available in this module)
function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

 function renderCustomerCard(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const abbrev = (value) => {
    if (!value) return '';
    const map = { 'REPLACED': 'R', 'ACTIVE': 'A', 'NEW': 'N', 'NORMAL': 'N' };
    return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
  };

  const infoDot = `<button class="info-dot" data-customer-id="${customer.id || ''}">i</button>`;
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
        ${row('Gender', customer.gender)}
        ${row('Family name', customer.family_name)}
        ${row('Second name', customer.family_name)}
        ${row('Status', instrument.condition || 'N/A', small(abbrev(instrument.condition || ''))) }
        ${row('Application ID', customer.application_ID)}
      </div>
      <div class="card-column">
        ${row('Branch', instrument.branch)}
        ${row('PAN sequence', instrument.sequence)}
        ${row('Client host ID', customer.client_host_id)}
        ${row('Title', customer.title, small('01'))}
        ${row('First Name', customer.first_name)}
        ${row('Second first name',  customer.first_name)}
        ${row('Status reason', instrument.status_reason)}
        ${row('Contract element ID', '')}
      </div>
      <div class="card-column">
        ${row('Payment instrume....',  '')}
        ${row('Primary PAN', '')}
        ${row('Corporate ID', '')}
        ${row('') }
        ${row('Madine name',  '')}
        ${row('Legal ID', customer.legal_id)}
        ${row('Status date', formatDate(account.pan_status_date))}
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
          <button class="operations yo">Operations</button>
          <button class="Save-all yo">Save all</button>
        </div>
      </div>
      <div class="payment-content" style="display: flex; flex-direction: row; gap: 20px;">
        <!-- LEFT MENU -->
        <div class="left-section" style="width: 200px; display: flex; flex-direction: column; gap: 10px;">
          <div class="Id options" data-target="Identification">Identification</div>
          <div class="demo options" data-target="Demographic">Demographic</div>
          <div class="Emb options" data-target="Embossing">Embossing</div>
          <div class="address options" data-target="Address">Address</div>
          <div class="Add options" data-target="Additional">Additional fields</div>
          <div class="add-on options" data-target="AddOn">Add on services</div>
          <div class="Acc options" data-target="Accounts">Accounts/ posting rules</div>
          <div class="comms options" data-target="Comms">Communication strategy</div>
          <div class="pan options" data-target="Pan">Pan indicators</div>
        </div>

        <!-- RIGHT BODY -->
        <div class="payment-body" style="flex: 1; height: 500px; overflow-y: auto; scroll-behavior: smooth; padding-left: 20px;">
          <section id="Identification" ><h2 class="ID">Identification</h2>${renderCustomerCard(customer)}</section>
          <section id="Demographic"><h2 class="ID">Demographic</h2><p>Demographic content goes here...</p></section>
          <section id="Embossing"><h2 class="ID">Embossing</h2><p>Embossing content...</p></section>
          <section id="Address"><h2 class="ID">Address</h2><p>Address content...</p></section>
          <section id="Additional"><h2 class="ID">Additional Fields</h2><p>Additional fields content...</p></section>
          <section id="AddOn"><h2 class="ID">dd-on Services</h2><p>Add-on services content...</p></section>
          <section id="Accounts"><h2 class="ID">Accounts / Posting Rules</h2><p>Accounts content...</p></section>
          <section id="Comms"><h2 class="ID">Communication Strategy</h2><p>Comms strategy content...</p></section>
          <section id="Pan"><h2 class="ID">PAN Indicators</h2><p>PAN indicators content...</p></section>
        </div>
      </div>
    </div>
  `;

  // Back button
  document.getElementById('payment-back-btn').addEventListener('click', () => {
    window.history.back();
  });

  // Handle clicks on left menu
  const options = document.querySelectorAll('.left-section .options');
  const body = document.querySelector('.payment-body');

  options.forEach(option => {
    option.addEventListener('click', () => {
      const targetId = option.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Highlight active option on scroll
  body.addEventListener('scroll', () => {
    let currentSection = null;
    document.querySelectorAll('.payment-body section').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < 150 && rect.bottom > 150) {
        currentSection = sec.id;
      }
    });

    options.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-target') === currentSection);
    });
  });

  window.currentView = "payment-instrument";
  window.currentCustomer = customer;
}

console.log("Payment instrument module loaded");

// Placeholder example for future dynamic demographic rendering
function showDemographic(customer) {
  const content = document.getElementById("content");
  content.innerHTML = `<div class="demographic">Demographic section for ${customer.first_name}</div>`;
}
