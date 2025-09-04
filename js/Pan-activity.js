import { mockDatabase } from "./mockDatabase.js";

const content = document.querySelector(".content");
const subheader = document.getElementById("subheader");

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

    // Collapsible row
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
              <th><span class="material-icons-sharp">menu</span></th>
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

