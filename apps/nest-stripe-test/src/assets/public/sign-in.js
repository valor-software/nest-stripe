let M = window['M'];
let customerList = [];
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);
});
localStorage.removeItem('customer');
localStorage.removeItem('customerId');

async function getCustomerList() {
  const email = document.querySelector('#email').value;
  const encodedEmail = encodeURI(email);
  const res  = await fetch(`api/stripe/customer/${encodedEmail}/by-email`);
  const customerListResponse = await res.json();
  if (customerListResponse.success) {
    customerList = customerListResponse.data;
    const customerListEl = document.querySelector('#customer-list');
    customerListEl.innerHTML='';
    customerList.forEach(customer => {
      const customerEl = document.createElement('option');
      customerEl.textContent = customer.name;
      customerEl.value = customer.id;
      customerListEl.appendChild(customerEl);
       M.FormSelect.init(customerListEl);
    });
  } else {
    console.error(customerListResponse);
    showCardError(customerListResponse.errorMessage);
  }
}

async function signIn() {
  const customerListEl = document.querySelector('#customer-list');
  const customer = customerList.find(x => x.id === customerListEl.value);
  localStorage.setItem('customer', JSON.stringify(customer));
  localStorage.setItem('customerId', customer.id);
  location.replace('subscribe.html');
}

function showCardError(text) {
  document.querySelector('#error-text').textContent = text;
}