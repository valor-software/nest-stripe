let M = window['M'];
let paymentMethodId = null;
let stripe = null;
let productList = [];
const customerId = localStorage.getItem('customerId');
const customer = JSON.parse(localStorage.getItem('customer'));
const productListEl = document.querySelector('#product-list');
const paymentMethodsEl = document.querySelector('#payment-method-list');
const cardHolderNameEl = document.querySelector('#card-holder-name');
const useAsDefaultEl = document.querySelector('#use-as-default')

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);
  M.updateTextFields();
});
const form = document.getElementById('payment-form');

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  if (paymentMethodId) {
    createSubscription();
  } else {
    createPaymentMethod();
  }
});

function onPaymentMethodChange() {
  paymentMethodId = paymentMethodsEl.value;
  if (paymentMethodId) {
    hideCardElement();
  } else {
    showCardElement()
    initializeCardElement();
  }
}

async function loadPaymentMethodList() {
  const res  = await fetch(`api/stripe/customer/${customerId}/payment-method-list?type=card`);
  const paymentMethodsResponse = await res.json();
  if (paymentMethodsResponse.success) {
    paymentMethods = paymentMethodsResponse.data;
    paymentMethodsEl.addEventListener('change', () => onPaymentMethodChange());
    const pmEl = paymentMethodsEl.children[0].cloneNode(true);
    paymentMethodsEl.innerHTML='';
    paymentMethodsEl.appendChild(pmEl);
    paymentMethods.forEach(pm => {
      const el = document.createElement('option');
      el.textContent = `${pm.billingDetails.name || ''} **** ${pm.card.last4} ${pm.card.expMonth} / ${pm.card.expYear}`;
      el.value = pm.id;
      paymentMethodsEl.appendChild(el);
    });
    M.FormSelect.init(paymentMethodsEl);
    onPaymentMethodChange();
  } else {
    console.error(paymentMethodsResponse);
    showCardError(paymentMethodsResponse.errorMessage);
  }
}

async function loadProductList() {
  const res  = await fetch(`api/stripe/product`);
  const productListResponse = await res.json();
  if (productListResponse.success) {
    productList = productListResponse.data;
    //productListEl.addEventListener('change', () => onPaymentMethodChange());
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
    showCardError(productListResponse.errorMessage);
  }
}

let paymentMethods = [];
(function() {
  loadPaymentMethodList();
  loadProductList();
})();

function showCardError(text) {
  document.querySelector('#error-text').textContent = text;
}

const style = {
  base: {
    iconColor: '#7B84A3',
    backgroundColor: '#465380',
    color: '#7B84A3',
    fontWeight: 'normal',
    fontFamily: 'Lato',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    ':-webkit-autofill': {
      color: '#fce883',
    },
    '::placeholder': {
      color: '#87BBFD',
    },
  },
  invalid: {
    iconColor: '#FF7B7B',
    color: '#FF7B7B',
  },
}

let card = null;
let cardNumber = null;
let cardExpiry = null;
let cardCvc = null;
function initializeCardElement() {
  stripe = window['stripe'];
  let elements = stripe.elements();
  // Card Number
  cardNumber = elements.create('cardNumber', {
    style,
    showIcon: true,
    iconStyle: 'solid',
    placeholder: '7777 7777 7777 7777'
  });
  cardNumber.mount('#card-number-element');
  cardNumber.on('change', function (event) {
    displayError(event);
  });
  window['cardNumberRef'] = cardNumber;
  // Card Expiry
  cardExpiry = elements.create('cardExpiry', {style});
  cardExpiry.mount('#card-expiry-element');
  cardExpiry.on('change', function (event) {
    displayError(event);
  });
  window['cardExpiryRef'] = cardExpiry;
  // Card CVC
  cardCvc = elements.create('cardCvc', {style});
  cardCvc.mount('#card-cvc-element');
  cardCvc.on('change', function (event) {
    displayError(event);
  });
  window['cardCvcRef'] = cardCvc;
}

function showCardElement() {
  const cardEl = document.querySelector('#card-element-wrap');
  cardEl.classList.remove('hidden');
}
function hideCardElement() {
  const cardEl = document.querySelector('#card-element-wrap');
  cardEl.classList.add('hidden');
}


function displayError(event) {
  //changeLoadingStatePrices(false);
  let displayError = document.getElementById('card-element-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
}

function createPaymentMethod() {
  const useAsDefault = useAsDefaultEl.checked;
  stripe
    .createPaymentMethod({
      type: 'card',
      card: cardNumber,
      billing_details: {
        name: cardHolderNameEl.value,
      },
    })
    .then(response => {
      if (response.error) {
        displayError(response);
        return response
      } else {
        paymentMethodId = response.paymentMethod.id;
        loadPaymentMethodList();
        return fetch(`/api/stripe/customer/${customerId}/attach-payment-method/${paymentMethodId}?useAsDefault=${useAsDefault}`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json',
          },
          body: null
        })
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (result.error) {
        displayError(result);
      } else {
        loadPaymentMethodList();
        createSubscription({
          customerId: customerId,
          paymentMethodId: result.paymentMethod.id
        });
      }
    });
}

function createSubscription(response) {
  const product = productList.find(p => p.id = productListEl.value);
  const items = product.prices.map(p => ({ priceId: p.id }));
  if (!response.success) {
    throw new Error(response.errorMessage)
  }
  return fetch('/api/stripe/subscription/create', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      customerId: customerId,
      items,
      defaultPaymentMethod: paymentMethodId
    })
  })
  .then((response) => {
    cardHolderNameEl.value = null;
    useAsDefaultEl.checked = undefined;
    loadPaymentMethodList();
    return response.json();
  })
  // If the card is declined, display an error to the user.
  .then((result) => {
    if (!result.success) {
      // The card had an error when trying to attach it to a customer.
      throw new Error(result.errorMessage);
    }
    return result;
  })
  // Normalize the result to contain the object returned by Stripe.
  // Add the additional details we need.
  .then((result) => {
    return {
      result,
      isRetry: false
    };
  })
  // Some payment methods require a customer to be on session
  // to complete the payment process. Check the status of the
  // payment intent to handle these actions.
  .then(handlePaymentThatRequiresCustomerAction)

  // If attaching this card to a Customer object succeeds,
  // but attempts to charge the customer fail, you
  // get a requires_payment_method error.
  .then(handleRequiresPaymentMethod)

  // No more actions required. Provision your service for the user.
  .then(onSubscriptionComplete)

  .catch((error) => {
    // An error has happened. Display the failure to the user here.
    // We utilize the HTML element we created.
    showCardError(error);
  });
}

function onSubscriptionComplete({result}) {
  // Payment was successful.
  if (result.status === 'active' || result.status === 'succeeded') {
    // Change your UI to show a success message to your customer.
    // Call your backend to grant access to your service based on
    // `result.subscription.items.data[0].price.product` the customer subscribed to.
    alert('Succeed')
  } else {
    console.log(result)
  }
}

function handlePaymentThatRequiresCustomerAction({result}) {
  if (result.status === 'active') {
    // Subscription is active, no customer actions required.
    return { result };
  }

  // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
  // If it's a retry, the payment intent will be on the invoice itself.

  if (
    result.paymentIntentStatus === 'requires_action' || result.paymentIntentStatus === 'requires_confirmation'
  ) {
    return stripe
      .confirmCardPayment(result.clientSecret, {
        payment_method: paymentMethodId,
      })
      .then((result) => {
        if (result.error) {
          // Start code flow to handle updating the payment details.
          // Display error message in your UI.
          // The card was declined (that is, insufficient funds, card has expired, etc).
          throw result;
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer.
            return { result: result.paymentIntent };
          }
        }
      })
      .catch((error) => {
        displayError(error);
      });
  } else {
    // No customer action needed.
    return { result };
  }
}

function handleRequiresPaymentMethod({
  result
}) {
  if (result.status === 'succeeded' || result.status === 'active') {
    // subscription is active, no customer actions required.
    return { result };
  } else if (result.paymentIntentStatus === 'requires_payment_method') {
    // Using localStorage to manage the state of the retry here,
    // feel free to replace with what you prefer.
    // Store the latest invoice ID and status.
    localStorage.setItem('latestInvoiceId', result.latestInvoiceId);
    localStorage.setItem('latestInvoicePaymentIntentStatus', result.paymentIntentStatus);
    throw { error: { message: 'Your card was declined.' } };
  } else {
    return {result};
  }
}

function retryInvoiceWithNewPaymentMethod({
  customerId,
  paymentMethodId,
  invoiceId,
  priceId
}) {
  return (
    fetch('/retry-invoice', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        invoiceId: invoiceId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      // If the card is declined, display an error to the user.
      .then((result) => {
        if (result.error) {
          // The card had an error when trying to attach it to a customer.
          throw result;
        }
        return result;
      })
      // Normalize the result to contain the object returned by Stripe.
      // Add the additional details we need.
      .then((result) => {
        return {
          // Use the Stripe 'object' property on the
          // returned result to understand what object is returned.
          invoice: result,
          paymentMethodId: paymentMethodId,
          priceId: priceId,
          isRetry: true,
        };
      })
      // Some payment methods require a customer to be on session
      // to complete the payment process. Check the status of the
      // payment intent to handle these actions.
      .then(handlePaymentThatRequiresCustomerAction)
      // No more actions required. Provision your service for the user.
      .then(onSubscriptionComplete)
      .catch((error) => {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        displayError(error);
      })
  );
}

async function createPrices() {
  const prodPrices = JSON.parse(localStorage.getItem('medusa_prices'));
  const priceIdMap = [];
  await Promise.all(prodPrices.map(async p => {
    const prodPriceId = p.id;
    const dto = {
      currency: p.currency,
      active: true,
      billingScheme: p.billingScheme,
      lookupKey: p.lookupKey,
      metadata: p.metadata,
      nickname: p.nickname || undefined,
      productData: {
        active: true,
        metadata: p.product.metadata,
        name: p.product.name,
        statementDescriptor: p.product.statementDescriptor || undefined,
        taxCode: p.product.taxCode  || undefined,
        unitLabel: p.product.unitLabel || undefined
      },
      recurring: p.recurring  || undefined,
      taxBehavior: p.taxBehavior  || undefined,
      tiers: p.tiers ? p.tiers.map(t => ({
        flatAmount: t.flatAmount == null ? undefined : t.flatAmount,
        flatAmountDecimal: t.unitAmountDecimal ? undefined : t.flatAmountDecimal,
        unitAmount: t.unitAmount == null ? undefined : t.unitAmount,
        unitAmountDecimal: t.flatAmountDecimal ? undefined : t.unitAmountDecimal,
        upTo: t.upTo
      })) : undefined,
      tiersMode: p.tiersMode  || undefined,
      transferLookupKey: p.transferLookupKey  || undefined,
      amount: p.unitAmount == null ? null : p.unitAmount
    }
    const resp = await (
      fetch('api/stripe/price/create', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(dto)
      }).then(r => r.json())
    );
    if (resp.success) {
      const { priceId } = resp;
      priceIdMap[prodPriceId] = priceId;
    } else {
      console.error(resp.errorMessage);
    }
    localStorage.setItem('medusa_priceIdMap', JSON.stringify(priceIdMap))
  }))
}

function createProducts() {
  const prodProducts = JSON.parse(localStorage.getItem('medusa_products'));
  const priceIdMap = [];
  const productIdMap = [];
  prodProducts.map(p => {
    const prodId = p.id;
    const dto = {}
  })
}