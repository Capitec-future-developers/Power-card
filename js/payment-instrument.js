// Helper function to format dates
function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

// Render main customer card
export function renderCustomerCard(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const abbrev = (value) => {
    if (!value) return '';
    const map = { 'REPLACED':'R','ACTIVE':'A','NEW':'N','NORMAL':'N' };
    return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
  };

  const infoDot = `<button class="info-dot" data-customer-id="${customer.id || ''}">i</button>`;
  const box = (text) => `<div class="box-section">${text ?? ''}</div>`;
  const small = (text) => `<span class="small-box">${text ?? ''}</span>`;
  const row = (label,value,trailing='') => `
    <div class="card-section">
      <div class="section-title">${label}</div>
      ${box(value)}
      ${trailing}
    </div>
  `;

  const fullName = `${(customer.first_name||'').toUpperCase()} ${(customer.family_name||'').toUpperCase()}`.trim();
  const maskedPan = instrument.number || customer.pan || '';
  const customerType = (instrument.type||'').toLowerCase().includes('business') ? 'CORPORATE' : 'INDIVIDUAL';
  const currencyCode = 'ZAR';
  const currencyNum = '710';

  return `
    <div class="customer-card">
      <div class="card-column">
        ${row('Institution','Capitec Bank Limited',small('000010'))}
        ${row('PAN',maskedPan, infoDot)}
        ${row('Client code', customer.client_code)}
        ${row('Gender', customer.gender)}
        ${row('Family name', customer.family_name)}
        ${row('Second name', customer.family_name)}
        ${row('Status', instrument.condition||'N/A', small(abbrev(instrument.condition||'')))}
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
        ${row('Payment instrument', '')}
        ${row('Primary PAN', '')}
        ${row('Corporate ID', '')}
        ${row('Madine name', '')}
        ${row('Legal ID', customer.legal_id)}
        ${row('Status date', formatDate(account.pan_status_date))}
      </div>
    </div>
  `;
}

// Render additional customer profile info (demographic + contact)
export function renderCustomerProfile(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const box = (label,value) => `
    <div class="profile-section">
      <div class="section-label">${label}</div>
      <div class="section-value">${value ?? ''}</div>
    </div>
  `;

  const phoneBox = (label,type,number) => `
    <div class="phone-section">
      <div class="section-label">${label}</div>
      <div class="section-type">${type}</div>
      <div class="section-value">${number}</div>
    </div>
  `;

  const emailBox = (label,email) => `
    <div class="email-section">
      <div class="section-label">${label}</div>
      <div class="section-value">${email}</div>
    </div>
  `;

  const demographicSection = `
    <div class="demographic-section">
    <div class="card-columns">
      ${box('Birth date', customer.birth_date)}
      ${box('Nationality', 'South Africa')}
      ${box('Customer type', instrument.type === 'Business Platinum Card' ? 'CORPORATE' : 'INDIVIDUAL')}
      ${box('Job title', customer.corporate_name ? 'ENTREPRENEUR' : '')}
      ${box('Relationship', 'Not applicable')}
      </div>
      <div class="card-columns">
      ${box('Birth country', 'ENG')}
      ${box('Language', 'ENG')}
      ${box('Activity', 'Default')}
      ${box('Channel', '0000')}
      ${box('Disclosure flag', 'No choice')}
      </div>
      <div class="card-columns">
      ${box('VIP level', account.loyalty_status === 'NORMAL' ? 'Normal' : account.loyalty_status)}
      ${box('Customer segment', 'default value')}
      ${box('Employee number', '')}
      ${box('Co-brander', '')}
      ${box('Birth city', '')}
      </div>
    </div>
  `;

  const contactSection = `
    <div class="contact-section">
      <h2>Phones</h2>
      ${phoneBox('Phone 1','Personal mobile phone',customer.phone)}
      ${phoneBox('Phone 2','Home phone','00000000000')}
      ${phoneBox('Phone 3','Home phone','0117849514')}
      ${phoneBox('Phone 4','Others',customer.phone)}
      <h2>Emails</h2>
      ${emailBox('Email 1', customer.client_code+'@wol.co.za')}
      ${emailBox('Email 2', 'email@address.com')}
    </div>
  `;

  return `
    <div class="customer-profile">
      <div class="demographic-header" style="background-color: blue; color: white; padding: 10px;">DEMOGRAPHIC</div>
      ${demographicSection}
      <div class="contact-header" style="background-color: blue; color: white; padding: 10px;">CONTACT</div>
      ${contactSection}
    </div>
  `;
}

// Show Payment Instrument Page
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
      <div class="payment-content" style="display:flex;flex-direction:row;gap:20px;">
        <div class="left-section" style="width:200px; display:flex; flex-direction:column; gap:10px;">
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
        <div class="payment-body" style="flex:1;height:500px;overflow-y:auto;scroll-behavior:smooth;padding-left:20px;">
          <section id="Identification">${renderCustomerCard(customer)}</section>
          <section id="Demographic">${renderCustomerProfile(customer)}</section>
          <section id="Embossing"><p>Embossing content...</p></section>
          <section id="Address"><p>Address content...</p></section>
          <section id="Additional"><p>Additional fields content...</p></section>
          <section id="AddOn"><p>Add-on services content...</p></section>
          <section id="Accounts"><p>Accounts content...</p></section>
          <section id="Comms"><p>Communication strategy content...</p></section>
          <section id="Pan"><p>PAN indicators content...</p></section>
        </div>
      </div>
    </div>
  `;

  // Back button
  document.getElementById('payment-back-btn').addEventListener('click', () => {
    window.history.back();
  });

  // Option click to scroll to section
  const options = document.querySelectorAll('.left-section .options');
  const body = document.querySelector('.payment-body');
  options.forEach(option => {
    option.addEventListener('click', () => {
      const targetId = option.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Scroll listener to highlight active option
  body.addEventListener('scroll', () => {
    let currentSection = null;
    document.querySelectorAll('.payment-body section').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if(rect.top < 150 && rect.bottom > 150) currentSection = sec.id;
    });
    options.forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-target') === currentSection));
  });

  window.currentView = "payment-instrument";
  window.currentCustomer = customer;
}

// Example usage
const mockDatabase = [
  {
    id:1,
    first_name:"Omphile",
    family_name:"Mohlala",
    client_code:"C001",
    phone:"0825511132",
    birth_date:"1990-05-21",
    title:"Mr",
    application_ID:"APP123",
    payment_instruments:[{type:"Platinum",number:"1234567890123456",branch:"Main Branch",sequence:"001",condition:"ACTIVE",status_reason:""}],
    accounts:[{number:"1234567890",pan_status_date:"2025-08-25",loyalty_status:"NORMAL"}],
    corporate_name:"Mzansi Tech",
    legal_id:"L12345",
    gender:"Male",
    client_host_id:"CH001"
  }
];

showPaymentInstrument(mockDatabase[0]);
