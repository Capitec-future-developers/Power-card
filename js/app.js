const content = document.querySelector('.content');

content.innerHTML = `
<img src="../img/issuer-front.png" alt="issuer-front" class="issuer-front">
`;

const customerService = document.querySelector('.customer-service');

content.innerHTML = `
 <section>
 <div class="customer-details">
 <div class="left-details">
 <lable>Pan<input type="number" class="card-number"></lable>
 <lable>First name<input type="number" class="card-number"></lable>
 <lable>Corporate ID<input type="number" class="card-number"></lable>
 <lable>Legal ID<input type="number" class="card-number"></lable>
 <lable>Client host ID<input type="number" class="card-number"></lable>
 </div>
 <div class="right-details">
 <lable>First name<input type="number" class="card-number"></lable>
 <lable>Corporate ID<input type="number" class="card-number"></lable>
 <lable>Legal ID<input type="number" class="card-number"></lable>
 <lable>Client host ID<input type="number" class="card-number"></lable>
</div>

<div class="action-btn">
<div class="search-btn">Search<span class="material-icons-sharp">search</span></div>
<div class="clear">Clear<span class="material-icons-sharp">ink_eraser</span></div>
</div>
</div>
<div class="client-details">
<table>
<th>
<tr></tr>
<tr>Client code</tr>
<tr>First name</tr>
<tr>Family name</tr>
</th>
</table>
</div>
</section>
`
