import {mockDatabase} from "./mockDatabase";


function showPanActivity(){
setSubheader("PAN Activity");
content.innerHTML = `
<section>
<div class="error-message" id="error-message"></div>
<div class="customer-details">
<div class="left-details">
            <div class="field"><label for="pan">Pan</label><input type="text" id="pan" class="card-number" placeholder="Enter PAN"></div>
</div>
<div class="right-details">
            <div class="field"><label for="clientCode">Client code</label><input type="text" id="clientCode" class="card-number"></div>
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

})
}
