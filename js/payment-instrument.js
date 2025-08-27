import { mockDatabase } from './mockDatabase.js';

function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

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
  const row = (label, value, trailing='') => `
<div class="card-section">
<div class="section-title">${label}</div>
${box(value)}
${trailing}
</div>
`;

  const fullName = `${(customer.first_name||'').toUpperCase()} ${(customer.family_name||'').toUpperCase()}`.trim();
  const maskedPan = instrument.number || customer.pan || '';
  const customerType = (instrument.type||'').toLowerCase().includes('business') ? 'CORPORATE' : 'INDIVIDUAL';

  return `
<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px;">Identification</div>
<div class="customer-card">
<div class="card-column">
${row('Institution','Capitec Bank Limited',small('000010'))}
${row('PAN',maskedPan)}
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
${row('Second first name', customer.first_name)}
${row('Status reason', instrument.status_reason)}
${row('Contract element ID', '')}
</div>
<div class="card-column">
${row('Payment instrument', '')}
${row('Primary PAN', '')}
${row('Corporate ID', customer.corporate_id)}
${row('', '')}
${row('Maiden name', '')}
${row('Legal ID', customer.legal_id)}
${row('Status date', formatDate(account.pan_status_date))}
</div>
</div>
<div class="customer-profile">
<div class="ID" style="background-color: #092365; color: white; padding: 10px;">Identification</div>
</div>
`;
}

export function renderCustomerAddress(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const abbrev = (value) => {
    if (!value) return '';
    const map = { 'REPLACED':'R','ACTIVE':'A','NEW':'N','NORMAL':'N' };
    return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
  };

  const box2 = (text) => `<span class="box-section2">${text ?? ''}</span>`;
  const box = (text) => `<div class="box-section">${text ?? ''}</div>`;
  const small = (text) => `<span class="small-box">${text ?? ''}</span>`;
  const row = (label, value, trailing='') => `
<div class="card-section">
<div class="section-title">${label}</div>
${box(value)}
${trailing}

</div>
`;

  return `
<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px;">Identification</div>
<div class="customer-card">
<div class="card-column">
${row('Institution','Capitec Bank Limited',small('000010'))}
${row('PAN', instrument.number || customer.pan)}
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
${row('Second first name', customer.first_name)}
${row('Status reason', instrument.status_reason)}
${row('Contract element ID', '')}
</div>
<div class="card-column">
${row('Payment instrument', '')}
${row('Primary PAN', '')}
${row('Corporate ID', customer.corporate_id)}
${row('', '')}
${row('Maiden name', '')}
${row('Legal ID', customer.legal_id)}
${row('Status date', formatDate(account.pan_status_date))}
</div>
</div>

<div class="address">
<div class="address-tabs">
<div class="address-tab tabactive">PRIMARY ADDRESS(MANDATORY):${instrument.full_name || ''}</div>
<div class="address-tab">SECONDARY ADDRESS:(OPTIONAL):${instrument.full_name || ''}</div>
</div>
<div class="address-content customer-card">
<div class="card-column">
${row('Type', 'Physical')}
${row('Card of', instrument.full_name || customer.first_name + ' ' + customer.family_name)}

</div>
<div class="card-column">
${row('Usage', 'Statement')}
${row('Start date', '')}
</div>
<div class="card-column">
${row('Sending mode', 'Email')}
${row('End date', '')}
</div>
<div class="address-customer-card">
<div class="demographic-header" style="position: absolute; background-color: #092365; color: white; padding-top: 10px; width: 500px; height: 30px; left: 20px;">Addresses</div>
<div class="card-column" style="position: absolute; top: 70px; width: 550px;">
${row('Line 1', customer.address)}
${row('Line 2', customer.suburb)}
${row('Line 3', '')}
${row('Line 4', '')}
${row('*Country', customer.country, small('710'))}
${row('Zip code', customer.postal_code)}
${row('*Region', customer.province, small('003'))}
${row('City', customer.city, small('01546'))}
</div>
</div>
<div class="phones-customer-card" style="position: absolute; left: 650px; top: 130px;">
<div class="demographic-header" style="position: absolute; background-color: #092365; color: white; padding-top: 10px; width: 500px; height: 30px; left: 20px;">Phones</div>
<div class="card-column" style="position: absolute; top: 70px; width: 550px;">
${row('Phone 1','Personal mobile phone', box2(customer.phone))}
${row('Phone 2','Home phone',box2(customer.home_phone || '00000000000'))}
${row('Phone 3','Work phone',box2(customer.work_phone || '0117849514'))}
${row('Phone 4','Others',box2(customer.other_phone || customer.phone))}
${row('Fax', 'EX: 0117849514' )}
</div>
</div>
<div class="web-customer-card" style="position: absolute; left: 650px; top: 200px;">
<div class="demographic-header" style="position: absolute; background-color: #092365; color: white; padding-top: 10px; width: 500px; height: 30px; left: 20px;">Web</div>
<div class="card-columnss" style="position: absolute; absolute; top: 50px; display: flex; flex-direction: row; gap: 1px;">
${row('Email',customer.email || customer.client_code+'@wol.co.za')}
${row('URL','htp://')}
</div>
</div>
</div>
</div>
`;
}

export function renderCustomerEmbossing(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const abbrev = (value) => {
    if (!value) return '';
    const map = { 'REPLACED':'R','ACTIVE':'A','NEW':'N','NORMAL':'N' };
    return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
  };

  const box = (text) => `<div class="box-section">${text ?? ''}</div>`;
  const small = (text) => `<span class="small-box">${text ?? ''}</span>`;
  const row = (label, value, trailing='') => `
<div class="card-section">
<div class="section-title">${label}</div>
${box(value)}
${trailing}
</div>
`;

  return `
<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px;">Identification</div>
<div class="customer-card">
<div class="card-column">
${row('Institution','Capitec Bank Limited',small('000010'))}
${row('PAN', instrument.number || customer.pan)}
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
${row('Second first name', customer.first_name)}
${row('Status reason', instrument.status_reason)}
${row('Contract element ID', '')}
</div>
<div class="card-column">
${row('Payment instrument', '')}
${row('Primary PAN', '')}
${row('Corporate ID', customer.corporate_id)}
${row('', '')}
${row('Maiden name', '')}
${row('Legal ID', customer.legal_id)}
${row('Status date', formatDate(account.pan_status_date))}
</div>
</div>

<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px;">Embossing</div>
<div class="embossing customer-card">
<div class="card-column" style="width: 500px;">
${row('File reference', '')}
${row('*Embossed name', instrument.full_name)}
${row('Promotion code', '')}
${row('Plastic code', account.plastic_code, small(''))}
${row('Plastic delivery method', '', small('002'))}
${row('Photo', '', small(''))}
</div>
<div class="card-column" style="padding-left: 200px; width: 500px">
${row('Second embossed name', '')}
${row('Encoded name', instrument.full_name)}
${row('Priority code', '', small(''))}
${row('', '')}
${row('PIN delivery method', '', small(''))}
${row('Photo reference', '')}
</div>
</div>
`;
}

export function renderCustomerProfile(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const box = (label, value) => `
<div class="profile-section">
<div class="section-label">${label}</div>
<div class="section-value">${value ?? ''}</div>
</div>
`;

  const phoneBox = (label, type, number) => `
<div class="phone-section">
<div class="section-label">${label}</div>
<div class="section-type">${type}</div>
<div class="section-value">${number}</div>
</div>
`;

  const emailBox = (label, email) => `
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
${box('Job title', customer.job_title || '')}
${box('Relationship', 'Not applicable')}
</div>
<div class="card-columns">
${box('Birth country', customer.birth_country || 'ZAR')}
${box('Language', customer.language || 'ENG')}
${box('Activity', 'Default')}
${box('Channel', customer.channel || '')}
${box('Disclosure flag', 'No choice')}
</div>
<div class="card-columns">
${box('Birth city', customer.birth_city || '')}
${box('VIP level', account.loyalty_status === 'NORMAL' ? 'Normal' : account.loyalty_status)}
${box('Customer segment', customer.customer_segment || 'default value')}
${box('Employee number', customer.employee_number || '')}
${box('Co-brander', customer.co_brander || '')}
</div>
</div>
`;

  const contactSection = `
<div class="contact-section">
<h2>Phones</h2>
${phoneBox('Phone 1','Personal mobile phone',customer.phone)}
${phoneBox('Phone 2','Home phone',customer.home_phone || '00000000000')}
${phoneBox('Phone 3','Work phone',customer.work_phone || '0117849514')}
${phoneBox('Phone 4','Others',customer.other_phone || customer.phone)}
<h2>Emails</h2>
${emailBox('Email 1', customer.email || customer.client_code+'@wol.co.za')}
${emailBox('Email 2', customer.secondary_email || 'email@address.com')}
</div>
`;

  return `
<div class="customer-profile">
<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px;">DEMOGRAPHIC</div>
${demographicSection}
<div class="contact-header" style="background-color: #092365; color: white; padding: 10px;">CONTACT</div>
${contactSection}
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
<button class="operations yo" id="operations">Operations</button>
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
<section id="Embossing">${renderCustomerEmbossing(customer)}</section>
<section id="Address"><p>${renderCustomerAddress(customer)}</p></section>
<section id="Additional"><p>Additional fields content...</p></section>
<section id="AddOn"><p>Add-on services content...</p></section>
<section id="Accounts"><p>Accounts content...</p></section>
<section id="Comms"><p>Communication strategy content...</p></section>
<section id="Pan"><p>PAN indicators content...</p></section>
</div>
</div>
</div>
`;


  document.getElementById('operations').addEventListener('click', () => {
    const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};

// Create and show the operations popup
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    popupOverlay.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
`;

    const operationsPopup = document.createElement('div');
    operationsPopup.className = 'operations-popup';
    operationsPopup.style.cssText = `
background-color: white;
width: 80%;
max-width: 1000px;
max-height: 80vh;
overflow-y: auto;
border-radius: 5px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

    operationsPopup.innerHTML = `
<div class="popup-header" style="background-color: #092365; color: white; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
<span style="font-weight: bold;">PAYMENT INSTRUMENTS OPERATIONS</span>
<button class="close-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
</div>
<div class="popup-content" style="padding: 20px;">
<div class="pan-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
<div>
<label style="display: block; font-weight: bold;">PAN:</label>
<input type="text" value="${customer.pan || ''}" disabled style="width: 100%; padding: 5px; border: 1px solid #ccc;">
</div>
<div>
<label style="display: block; font-weight: bold;">Embossed name:</label>
<input type="text" value="${instrument.full_name || customer.first_name + ' ' + customer.family_name}" disabled style="width: 100%; padding: 5px; border: 1px solid #ccc;">
</div>
<div>
<label style="display: block; font-weight: bold;">Expiry date:</label>
<input type="text" value="${instrument.expiry || ''}" disabled style="width: 100%; padding: 5px; border: 1px solid #ccc;">
</div>
</div>
<div class="pan-status" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
<div>
<label style="display: block; font-weight: bold;">Status:</label>
<input type="text" value="${instrument.condition || ''}" disabled style="width: 100%; padding: 5px; border: 1px solid #ccc;">
</div>
<div>
<label style="display: block; font-weight: bold;">Status reason:</label>
<input type="text" value="${instrument.status_reason || ''}" disabled style="width: 100%; padding: 5px; border: 1px solid #ccc;">
</div>
</div>
<div class="pan-operations" style="margin-bottom: 20px;">
<h2 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">PAN operations</h2>
<div class="operation" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; align-items: center;">
<label>PAN deactivation</label>
<button style="padding: 5px 30px; width: 100px; background-color: #092365; padding-right: -50px; color: white; border: none; border-radius: 3px; cursor: pointer;">Deactivate</button>
</div>
<div class="operation" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px; align-items: center;">
<label>PAN delivery</label>
<div>
<label style="display: block;">Delivery date:</label>
<input type="date" value="${new Date().toISOString().split('T')[0]}" style="width: 100%; padding: 5px; border: 1px solid #ccc;">
</div>
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Deliver</button>
</div>
<div class="operation" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px; align-items: center;">
<label>Renewal request</label>
<div>
<label style="display: block;">Batch number:</label>
<select style="width: 100%; padding: 5px; border: 1px solid #ccc;">
<option value="">Select batch number</option>
<option value="batch1">Batch 1</option>
<option value="batch2">Batch 2</option>
</select>
</div>
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Send</button>
</div>
<div class="operation" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px; align-items: center;">
<label>Expiry</label>
<input type="text" value="${instrument.expiry || ''}" disabled style="width: 100%; padding: 5px; border: 1px solid #ccc;">
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Send</button>
</div>
<div class="operation" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; align-items: center;">
<label>Unstop renewal</label>
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Unstop</button>
</div>
</div>
<div class="pending-operations" style="margin-bottom: 20px;">
<h2 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">PENDING OPERATIONS</h2>
<div style="display: flex; gap: 10px; margin-bottom: 10px;">
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Validate all</button>
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Cancel all</button>
<button style="padding: 5px 10px; background-color: #092365; color: white; border: none; border-radius: 3px; cursor: pointer;">Clear all</button>
</div>
</div>
<div class="pan-production-queue">
<h2 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">PAN PRODUCTION QUEUE</h2>
<table style="width: 100%; border-collapse: collapse;">
<thead>
<tr style="background-color: #f2f2f2;">
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Date</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">User</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Operation type</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Operation status</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">PAN perso</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">PIN perso</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">PIN delay</th>
<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">PIN hold status</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="8" style="border: 1px solid #ccc; padding: 8px; text-align: center;">No records found</td>
</tr>
</tbody>
</table>
</div>
</div>
`;


    operationsPopup.querySelector('.close-btn').addEventListener('click', () => {
      popupOverlay.remove();
    });


    popupOverlay.appendChild(operationsPopup);
    document.body.appendChild(popupOverlay);
  });


  document.getElementById('payment-back-btn').addEventListener('click', () => {
    window.history.back();
  });


  const options = document.querySelectorAll('.left-section .options');
  const body = document.getElementById('customerview');
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
