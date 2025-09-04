import { mockDatabase } from "./mockDatabase.js";

const content = document.querySelector(".content");
const subheader = document.getElementById("subheader");

// Local date formatter for this module
function formatDate(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function renderPanActivity(customer) {
  const instrument = (customer.payment_instruments && customer.payment_instruments[0]) || {};
  const account = (customer.accounts && customer.accounts[0]) || {};

  const abbrev = (value) => {
    if (!value) return '';
    const map = { 'REPLACED': 'R', 'ACTIVE': 'A', 'NEW': 'N', 'NORMAL': 'N' };
    return map[value.toUpperCase()] || value.charAt(0).toUpperCase();
  };

  const refresh =   `<button class="refresh-btn" data-customer-id="${customer.id || ''}">🔄</button>`;
  const box = (text) => `<div class="box-section">${text ?? ''}</div>`;
  const small = (text) => `<span class="small-box">${text ?? ''}</span>`;
  const row = (label, value, trailing = '') => `
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
${row('Institution', 'Capitec Bank Limited', small('000010'))}


</div>
<div class="card-column">
${row('PAN', customer.pan)}

</div>
<div class="card-column">
${row('PAN seq', '1')}

</div>
</div>

<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px;">PAN INFORMATION</div><br>
<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px; margin-left: 20px; width: 95%;">LAST ACTIVITY</div>
<div class="customer-card" style="margin-left: 20px; width: 95%;">
<div class="card-column" >
${row('Activity date', formatDate(account.pan_status_date), '')}
${row('Terminal no', '94265602')}
${row('Action', 'Rejected, Pick up card')}

</div>
<div class="card-column" >
${row('Country', customer.country || 'N/A')}
${row('MCC', 'Service Station' , small('5541'))}
${row('Priority code', '')}
</div>
<div class="card-column" >
${row('Outlet no', '197570')}
${row('Service', '206')}
</div>
</div>
<div class="show-more" id="show-more" >Show more</div>
<div id="extra-info" style="display:none; margin-top:10px;">
  <div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;">PTC</div>
  <div class="customer-card" style="margin-left:20px;width:95%;">
    <div class="card-column">
      ${row('PIN verif. no.', 0, refresh)}
    </div>
    <div class="card-column">
      ${row('PIN error accumulate', 19)}
    </div>
    <div class="card-column">
      ${row('PIN error date', formatDate(account.pan_status_date))}
    </div>
  </div>
  <div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;">LAST CVV2</div>
  <div class="customer-card" style="margin-left:20px;width:95%;">
  <div class="card-column">
  ${row('Verification number', 0, refresh)}
  ${row('Manual reset', '')}
  ${row('Country code', customer.country || 'N/A')}
  ${row('MCC', 'Airlines, Air Carries', small('4541'))}
  </div>
  <div class="card-column">
  ${row('Error cum', 0)}
  ${row('Auto reset', formatDate(account.pan_status_date))}
  ${row('Outlet No', '197570')}
  ${row('Auth amount', '1,2342.00', small('ZAR'))}

</div>
<div class="card-column">
${row('Error date', '')}
${row('Check date', formatDate(account.pan_status_date))}
${row('Terminal no', '94265602')}
${row('Auth currency', 'Rand')}
</div>

</div>
<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;">LAST EXPIRY DATE</div>
<div class="customer-card" style="margin-left:20px;width:95%;">
<div class="card-column">
${row('Verfication number', 0, refresh)}
${row('Manual reset', '')}
</div>
<div class="card-column">
${row('Error cum', 0)}
  ${row('Auto reset', formatDate(account.pan_status_date))}
</div>
<div class="card-column">
${row('Error date', '')}
${row('Check date', formatDate(account.pan_status_date))}
</div>
</div>

<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;">LAST AUTHORIZATION</div>
<div class="customer-card" style="margin-left:20px;width:95%;">
<div class="card-column">
${row('Approved date', formatDate(account.pan_status_date))}
${row('Approved amount', '1,2342.00', small('ZAR'))}

</div>
<div class="card-column">
${row('Cancellation date', formatDate(account.pan_status_date))}
${row('Cancellation amount', '1,2342.00', small('ZAR'))}
</div>
<div class="card-column">
${row('Declined date', formatDate(account.pan_status_date))}
${row('Declined amount', '1,2342.00', small('ZAR'))}
</div>
</div>

<div class="sca-counter">
<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;">SCA COUNTER</div><BR>
<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;margin-left:20px;width:95%;">CONTACTLESS</div>
<div class="customer-card" style="margin-left:20px;width:95%;">
<div class="card-column">
${row('Last reset date', '')}
</div>
<div class="card-column">
${row('Counter', 0)}
</div>
<div class="card-column">
${row('Amount', 0.00, small('ZAR'))}
</div>
</div>
<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px;margin-left:20px;width:95%;">REMOTE PAYMENT</div>
<div class="customer-card" style="margin-left:20px;width:95%;">
<div class="card-column">
${row('Last reset date', '')}
</div>
<div class="card-column">
${row('Counter', 0)}
</div>
<div class="card-column">
${row('Amount', 0.00, small('ZAR'))}
</div>
</div>
</div>
</div>
</div>
<div class="demographic-header" style="background-color: #092365; color: white; padding: 10px; margin-top: 30px;">PAN ACTIVITY</div><br>
<div class="pash">
<div class="cash tp">${instrument.type, 'CASH LIMIT'}</div>
<div class="pos tp">${instrument.type, 'POS LIMIT'}</div>
</div>

<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px; width: 79%; margin-left: 200px; margin-top: -50px;">DAILY</div>
<div class="customer-card">
<div class="card-column" style="margin-left: 23px; margin-top: 50px; text-align: end">
<span></span>
<span>On us activity</span>
<span>National activty</span>
<span>International activity</span>
<span>Total activity</span>
</div>
<div class="card-column" style="margin-left: 100px; margin-top: 30px; font-weight: bold;">
<span>ONLINE</span>
<span>0.00 ZAR / 0 Trx</span>
<span>0.00 ZAR / 0 Trx</span>
<span>0.00 ZAR / 0 Trx</span>
<span>0.00 ZAR / 0 Trx</span>
</div>
<div class="card-column" style="margin-left: 80px; margin-top: 30px; font-weight: bold;">
<span>OFFLINE</span>
<span>0.00 ZAR / 0 Trx</span>
<span>0.00 ZAR / 0 Trx</span>
<span>0.00 ZAR / 0 Trx</span>
<span>0.00 ZAR / 0 Trx</span>

</div>
</div>

</div>
<div class="demographic-header" style="background-color:#0b2a63;color:white;padding:10px; width: 100%;  margin-top: 10px;">FEE ACTIVITY</div>
<div class="customer-card">
<div class="card-columns style="margin-left: 23px; margin-top: 50px; text-align: end">
<table>
<thead>
<tr>
<th>Fee type</th>
<th>Fee type description</th>
<th>Fee Id</th>
<th>Fee Id description</th>
<th>Period</th>
<th>Amount</th>
<th>Number</th>
</tr>
</thead>
<tbody>
<tb>
<tr>03</tr>
<tr>Cap On Us Withdr</td>
<tr>3</tr>
<tr>Cap On Us Cash W</td>
<tr>From 06/11/2025 To 06/11/2025</tr>
</tb>
</tbody>
</table>
</div>
</div>
</div>

`;
}

function setSubheader(text) {
  if (subheader) {
    subheader.textContent = text;
    subheader.style.display = "block";
  }
}

export function showPanActivity() {
  localStorage.setItem('currentView', 'panActivity');
  localStorage.removeItem('currentCustomer'); // Clear customer data
  setSubheader("PAN Activity");
  content.innerHTML = `
    <section class="pan-activity">
      <div class="error-message" id="error-message"></div>

      <div class="customer-details">
        <div class="left-details">
          <div class="field">
            <label for="institution">Institution</label>
            <input type="text" id="institution" class="card-numbers" placeholder="Capitec Bank">
          </div>
        </div>
        <div class="right-details">
          <div class="field">
            <label for="pan">PAN</label>
            <input type="text" id="pan" class="card-numbers" placeholder="Enter PAN">
          </div>
        </div>
      </div>

      <div class="action-btn" style="margin-top: -130px;">
        <button class="search-btn">
          <span class="material-icons-sharp">search</span> Search
        </button>
        <button class="clear-btn" style="background: #0b2a63; color: white; width: 120px; height: 35px;">
          <span class="material-icons-sharp">ink_eraser</span> Clear
        </button>
      </div>

      <div class="client-details">
        <table id="client-table" style="margin-top: -130px;">
          <thead>
            <tr>
              <th>Institution</th>
              <th>PAN</th>
            </tr>
          </thead>
          <tbody id="client-table-body"></tbody>
        </table>
      </div>
    </section>
  `;

  const searchBtn = document.querySelector(".search-btn");
  const clearBtn = document.querySelector(".clear-btn");
  const errorMessage = document.getElementById("error-message");

  searchBtn.addEventListener("click", () => {
    const pan = document.getElementById("pan").value.trim();

    if (!pan) {
      showError("Please enter PAN");
      return;
    }

    if (pan.length < 13) {
      showError("PAN must be at least 13 characters");
      return;
    }

    hideError();
    const customer = mockDatabase.find(c => c.pan === pan);

    if (!customer) {
      showError("No customer found with the provided PAN");
      document.getElementById("client-table-body").innerHTML = "";
      return;
    }

    renderCustomerTable(customer);
  });

  clearBtn.addEventListener("click", () => {
    document.querySelectorAll(".customer-details input").forEach(input => (input.value = ""));
    document.getElementById("client-table-body").innerHTML = "";
    hideError();
  });

  function renderCustomerTable(customer) {
    const tableBody = document.getElementById("client-table-body");
    tableBody.innerHTML = "";

    // Main row with clickable PAN
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${customer.institution || "N/A"}</td>
      <td class="collapsible-pan" style="cursor:pointer; color:#092365; font-weight:bold;">
        ${customer.pan || "N/A"}
      </td>
    `;

    const collapseRow = document.createElement("tr");
    collapseRow.classList.add("collapse-row");
    collapseRow.style.display = "none";
    collapseRow.innerHTML = `
      <td colspan="2">
        <table class="nested-table">
          <thead>
            <tr>
              <th></th>
              <th>Loyalty account number</th>
              <th>Account type</th>
              <th>Account branch</th>
              <th>Account currency</th>
              <th id="pan-action-cell"><span class="material-icons-sharp">menu</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>${(customer.loyalty_accounts && customer.loyalty_accounts[0] && customer.loyalty_accounts[0].loyalty_account_number) || "N/A"}</td>
              <td>${(customer.accounts && customer.accounts[0] && customer.accounts[0].type) || "N/A"}</td>
              <td>${(customer.accounts && customer.accounts[0] && customer.accounts[0].branch) || "N/A"}</td>
              <td>${(customer.accounts && customer.accounts[0] && customer.accounts[0].currency) || "N/A"}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </td>
    `;

    // Hook click on the nested menu cell to show detailed PAN Activity view
    const panActionCell = collapseRow.querySelector('#pan-action-cell');
    if (panActionCell) {
      panActionCell.addEventListener('click', () => {
        showPanAction(customer);
      });
    }

    // Toggle collapse
    row.querySelector(".collapsible-pan").addEventListener("click", () => {
      collapseRow.style.display =
        collapseRow.style.display === "none" ? "table-row" : "none";
    });

    tableBody.appendChild(row);
    tableBody.appendChild(collapseRow);
  }

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = "block";
  }

  function hideError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }
}

// Navigation handler
document.addEventListener("click", e => {
  if (e.target.id === "PAN-activity") {
    e.preventDefault();
    showPanActivity();
  }
});

function showPanAction(customer) {
  localStorage.setItem('currentView', 'panAction');
  localStorage.setItem('currentCustomer', JSON.stringify(customer));

  setSubheader("PAN Activity");
  content.innerHTML = `
    <section class="pan-activity" style="position: absolute;
  width: 88%;
  left: 220px;
  top: 150px;
">
      <div class="pan-head">
        <button class="back-btn yo" id="lost-stolen-back-btn">Back ↞</button>
        <button class="save-all yo">Refresh 🗘</button>
      </div>
      <div class="pan-body">${renderPanActivity(customer)}</div>
    </section>
  `;

  // Add back button functionality
  document.getElementById("lost-stolen-back-btn").addEventListener("click", () => {
    showPanActivity();
  });

  // Add refresh button functionality
  document.querySelector(".save-all").addEventListener("click", () => {
    showPanAction(customer);
  });
  const showMoreBtn = document.getElementById("show-more");
  const extraInfo = document.getElementById("extra-info");
  if (showMoreBtn && extraInfo) {
    showMoreBtn.addEventListener("click", () => {
      if (extraInfo.style.display === "none") {
        extraInfo.style.display = "block";
        showMoreBtn.textContent = "Show less";
      } else {
        extraInfo.style.display = "none";
        showMoreBtn.textContent = "Show more";
      }
    });
  }
}

// Handle page refresh to restore the correct view
window.addEventListener("DOMContentLoaded", () => {
  const savedView = localStorage.getItem("currentView");
  const savedCustomer = localStorage.getItem("currentCustomer");

  if (savedView === "panAction" && savedCustomer) {
    try {
      const customer = JSON.parse(savedCustomer);
      // Validate customer data by checking if it exists in mockDatabase
      const validCustomer = mockDatabase.find(c => c.id === customer.id);
      if (validCustomer) {
        showPanAction(validCustomer);
      } else {
        showPanActivity();
      }
    } catch (e) {
      showPanActivity();
    }
  } else if (savedView === "panActivity") {
    showPanActivity();
  } else {
    showPanActivity();
  }
});
