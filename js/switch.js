import { mockDatabase } from './mockDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.content');
  const switchBtn = document.getElementById('switch');
  const issuerBtn = document.getElementById('issuer');
  const authorizationList = document.getElementById('authorization-list');

  // ---------------- Switch / Issuer views ----------------
  function showSwitchFront() {
    content.innerHTML = `<img src="./img/switch-front.png" alt="switch-front" class="issuer-front">`;
    console.log('Mock Database:', mockDatabase);
  }

  function showIssuerFront() {
    content.innerHTML = `<img src="./img/issuer-front.png" alt="issuer-front" class="issuer-front">`;
    console.log('Mock Database:', mockDatabase);
  }

  if (switchBtn) switchBtn.addEventListener('click', showSwitchFront);
  if (issuerBtn) issuerBtn.addEventListener('click', showIssuerFront);

  // ---------------- Authorization List ----------------
  window.showAuthorizationList = function() {
    content.innerHTML = `
      <div class="file">
        <span>File:</span>
        <input type="radio" name="file" value="current">Current
        <input type="radio" name="file" value="pending">Pending
        <input type="radio" name="file" value="history">History
        <input type="radio" name="file" value="all">All
      </div>

      <div class="filter">
        <span>Filter:</span>
        <input type="radio" name="filter" value="current">Current
        <input type="radio" name="filter" value="full">Full
        <input type="radio" name="filter" value="period">Period
      </div>

      <div class="criteria-container">
        <button id="criteriaBtn">Select Criteria ▼</button>
        <div id="criteriaDropdown" class="criteria-dropdown"></div>
      </div>

      <div class="collapse-search">
        <div class="advanced-search-header">Advanced Search ▼</div>
        <div class="advanced-search-content">
          <div class="search-row">
            <label>External stan:</label>
            <input type="text" id="search-external-stan">
            <label>Reference:</label>
            <input type="text" id="search-reference">
          </div>
          <div class="search-row">
            <label>Destination:</label>
            <input type="text" id="search-destination">
            <label>Source:</label>
            <input type="text" id="search-source">
          </div>
          <div class="search-row">
            <label>Message:</label>
            <input type="text" id="search-message">
            <label>Processing code:</label>
            <input type="text" id="search-processing-code">
          </div>
          <div class="search-row">
            <label>Action:</label>
            <input type="text" id="search-action">
            <label>PAN:</label>
            <input type="text" id="search-pan">
          </div>
          <div class="search-row">
            <label>Local time From:</label>
            <input type="date" id="search-local-time-from">
            <label>To:</label>
            <input type="date" id="search-local-time-to">
          </div>
          <div class="search-row">
            <label>Internal time From:</label>
            <input type="date" id="search-internal-time-from">
            <label>To:</label>
            <input type="date" id="search-internal-time-to">
          </div>
          <div class="search-row">
            <label>Transaction amount:</label>
            <input type="number" id="search-transaction-amount">
            <label>Transaction currency:</label>
            <input type="text" id="search-transaction-currency">
          </div>
          <div class="search-row">
            <label>Terminal no.:</label>
            <input type="text" id="search-terminal-no">
            <label>Acceptor point:</label>
            <input type="text" id="search-acceptor-point">
          </div>
          <div class="search-row">
            <label>Authorization reference:</label>
            <input type="text" id="search-auth-ref">
            <label>Current table indicator:</label>
            <input type="text" id="search-current-table-indicator">
          </div>
          <div class="search-actions">
            <button id="search-btn" class="ui-btn">Search</button>
            <button id="clear-btn" class="ui-btn">Clear</button>
          </div>
        </div>
      </div>

      <table class="styled-table" id="transactionTable">
        <thead>
          <tr id="tableHeader"></tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    `;

    // ---------------- Column Criteria Dropdown ----------------
    const fields = [
      "Internal stan","External stan","Reference","Destination","Source","Message",
      "Function","Processing code","Source account","Destination account","Action",
      "Original action","Issuer response","Network","Network id.","Issuing institution",
      "PAN","Service setup","Local time","Transmission time","Response time",
      "Internal time","Capture date","Business date","entity code","Entity id.",
      "Source account type","Source account number","Destination Entity id.",
      "Destination account type","Destination account number","Transaction amount",
      "Cash back amount","Transaction currency","Replacement amount","Billing amount",
      "Billing currency","Issuer amount","Issuer settlement currency","Issuer date",
      "Acquirer settlement amount","Acquirer settlement ccy","Receiving institution",
      "Acquiring country","Acquiring institution code","Acquirer institution",
      "PAN acceptor activity","Terminal no.","Acceptor point","Pos entry mode",
      "Forwarding country","Forwarding institution code","Forwarding institution",
      "Authorization reference","Original code","Reason code","Reversal stan",
      "Authorization flag","Reversal flag","Financial impact","Matching status",
      "Original table indicator","Current table indicator","Authorization id",
      "Transaction id","Acronym"
    ];

    const criteriaDropdown = document.getElementById('criteriaDropdown');
    criteriaDropdown.innerHTML = '';
    fields.forEach(field => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${field}" checked> ${field}`;
      criteriaDropdown.appendChild(label);
    });

    document.getElementById('criteriaBtn').addEventListener('click', () => {
      criteriaDropdown.style.display = criteriaDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // ---------------- Advanced Search Toggle ----------------
    const advHeader = document.querySelector('.advanced-search-header');
    const advContent = document.querySelector('.advanced-search-content');
    advHeader.addEventListener('click', () => {
      const visible = advContent.style.display === 'block';
      advContent.style.display = visible ? 'none' : 'block';
      advHeader.textContent = visible ? 'Advanced Search ▼' : 'Advanced Search ▲';
    });

    // ---------------- Table Rendering ----------------
    function renderTable(filteredData = mockDatabase) {
      const checkboxes = criteriaDropdown.querySelectorAll('input[type=checkbox]');
      const selectedFields = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

      const headerRow = document.getElementById('tableHeader');
      const body = document.getElementById('tableBody');
      headerRow.innerHTML = '';
      body.innerHTML = '';

      // Header
      selectedFields.forEach(field => {
        const th = document.createElement('th');
        th.textContent = field;
        headerRow.appendChild(th);
      });

      // Rows
      filteredData.forEach(row => {
        const tr = document.createElement('tr');
        selectedFields.forEach(field => {
          const td = document.createElement('td');
          td.textContent = row[field] || '';
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    }

    renderTable();

    // ---------------- Search / Filter ----------------
    function filterTable() {
      let filtered = mockDatabase.filter(row => {
        return (
          (!document.getElementById('search-external-stan').value || row["External stan"]?.toLowerCase().includes(document.getElementById('search-external-stan').value.toLowerCase())) &&
          (!document.getElementById('search-reference').value || row["Reference"]?.toLowerCase().includes(document.getElementById('search-reference').value.toLowerCase())) &&
          (!document.getElementById('search-destination').value || row["Destination"]?.toLowerCase().includes(document.getElementById('search-destination').value.toLowerCase())) &&
          (!document.getElementById('search-source').value || row["Source"]?.toLowerCase().includes(document.getElementById('search-source').value.toLowerCase())) &&
          (!document.getElementById('search-message').value || row["Message"]?.toLowerCase().includes(document.getElementById('search-message').value.toLowerCase())) &&
          (!document.getElementById('search-processing-code').value || row["Processing code"]?.toLowerCase().includes(document.getElementById('search-processing-code').value.toLowerCase())) &&
          (!document.getElementById('search-action').value || row["Action"]?.toLowerCase().includes(document.getElementById('search-action').value.toLowerCase())) &&
          (!document.getElementById('search-pan').value || row["PAN"]?.toLowerCase().includes(document.getElementById('search-pan').value.toLowerCase()))
        );
      });
      renderTable(filtered);
    }

    document.getElementById('search-btn').addEventListener('click', filterTable);
    document.getElementById('clear-btn').addEventListener('click', () => {
      advContent.querySelectorAll('input').forEach(input => input.value = '');
      filterTable();
    });

    criteriaDropdown.addEventListener('change', () => renderTable());
  };

  // ---------------- Event delegation ----------------
  document.addEventListener('click', e => {
    if (e.target.id === 'authorization-list') {
      e.preventDefault();
      window.showAuthorizationList();
    }
  });

  // Initial render
  showIssuerFront();
});
