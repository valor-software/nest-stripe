let M = window['M'];
let stripe = null;
let productList = [];
const customerId = localStorage.getItem('customerId');
const productListEl = document.querySelector('#product-list');

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);
  setTimeout(() => {
    stripe = window['stripe'];
    checkStatus();
  }, 200);
});

let elements;


async function loadProductList() {
  const res  = await fetch(`api/stripe/product`);
  const productListResponse = await res.json();
  if (productListResponse.success) {
    productList = productListResponse.data;
    productListEl.innerHTML='';
    productList.forEach(p => {
      const el = document.createElement('option');
      el.textContent = p.name;
      el.value = p.id;
      productListEl.appendChild(el);
    });
    M.FormSelect.init(productListEl);
  } else {
    console.error(productListResponse);
    showMessage(productListResponse.errorMessage);
  }
}

(function() {
  loadProductList();
})();

// Fetches a payment intent and captures the client secret
async function initialize() {
  document.querySelector('.proceed-to-payment').classList.add('hidden');
  document.querySelector('.payment-form').classList.remove('hidden');
  document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);
  
  const product = productList.find(p => p.id === productListEl.value);

  const items = [{
    productId: product.id,
    quantity: 1,
    price: product.prices.reduce((a,b) => a += b.unitAmount, 0),
    metadata: {
      productId: product.id,
      extId: 'xxx',
      name: product.name
    }
  }];

  const response = await fetch("/api/stripe/payment-intent/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, metadata: { customerId, productId: product.id } }),
  });
  const { clientSecret, success, errorMessage } = await response.json();
  if (!success) {
    console.error(errorMessage);
    return;
  }

  const appearance = {
    theme: 'none',

    variables: {
      colorPrimary: '#A873FF',
      colorBackground: '#2F3858',
      colorText: '#CAD1EA',
      colorDanger: '#FF7B7B',
      fontFamily: 'Lato\', \'Open Sans\', system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '8px',
      fontSizeBase: '16px',
      colorSuccess: '#54C752',
      colorWarning: '#F8BF8A',
      colorIcon: '#7B84A3',
      colorIconHover: '#C19FF9',		
    },
    rules: {
    '.Tab': {
        border: '2px solid #465380',
      },
      '.Tab:focus': {
        border: '4px solid rgba(145, 58, 232, 0.44)',  
      },
      '.Input': {
        color: '#CAD1EA',
      },
      '.Input::placeholder': {
        color: '#7B84A3',
      },
      '.Label': {
        color: '#CAD1EA',
        fontSize: '14px',
        fontWeight: '700',
      },
      '.Block': {
        colorBackground: '#262D47',
        borderRadius: '16px'
      },
      '.BlockDivider': {
        backgroundColor: '#465380',
      },
      '.BlockAction	': {
        color: '#A873FF',
      },
    },
  };
  //stripe.redirectToCheckout({sessionId});
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://localhost:3350/checkout.html",
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 8000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}