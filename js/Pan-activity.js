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
${row('Institution','')}
${row('PAN', '')}
${row('Client code', '')}
${row('Gender', '')}
${row('Family name', '')}
${row('Second name', '')}
${row('Status', '')}
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


function setSubheader(text) {
  if (subheader) {
    subheader.textContent = text;
    subheader.style.display = "block";
  }
}

export function showPanActivity() {
  setSubheader("PAN Activity");
  window.currentView = "PAN-activity";
  localStorage.setItem("currentView", window.currentView);

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
          <thead >
            <tr>
              <th></th>
              <th>Loyalty account number</th>
              <th>Account type</th>
              <th>Account branch</th>
              <th>Account currency</th>
              <th id="pan-activity"><span class="material-icons-sharp">menu</span></th>
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
          </tbody>
        </table>
      </td>
    `;

    // Hook click on the nested menu cell to show detailed PAN Activity view
    const panActionCell = collapseRow.querySelector('#pan-activity');
    if (panActionCell) {
      panActionCell.addEventListener('click', () => {
        ShowPanAction(customer);
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

function ShowPanAction(customer) {

  subheader.textContent = "PAN Activity";

  const content = document.querySelector(".content");
  content.innerHTML = `
    <section class="pan-activity">
      <div class="lost-stolen-header">
<button class="back-btn yo" id="lost-stolen-back-btn">Back ↞</button>
<button class="save-all yo">Refresh🗘</button>
<div class="pan-body">${renderPanActivity(customer)}</div>
  `;

  document.getElementById("pan-activity").addEventListener("click", (e) => {
      if (e.target && e.target.id === "pan-activity") {
        ShowPanAction(customer);
    }
  })
}
