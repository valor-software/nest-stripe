// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
// eslint-disable-next-line no-undef
let stripe = Stripe('pk_test_51LLQ2WDqFfDeJ7rty32Q8eJPoihnDZx1ynRxwtlfF3ch0gIHNdned4XIN7xzlrv0oWHYLAEgZvc7MsIEV2dHx9gc00Yd1FygN9'
);
const customerId = 'cus_M8mi4joSIWeSQu';
const items = [{ priceId: "price_1LPmBKDqFfDeJ7rtNWuUVbC6", quantity: 1, price: 85 }];

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

let elements = stripe.elements({ appearance });

function showCardError(error) {
  console.error(error);
}

let card = elements.create('card',{
  style: {
    base: {
      iconColor: appearance.variables.colorIcon,
      color: appearance.variables.colorPrimary,
      fontWeight: appearance.variables.colorDanger.fontWeight,
      fontFamily: appearance.variables.colorDanger.fontFamily,
      fontSize: appearance.variables.colorDanger.fontSize,
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#87BBFD',
      },
    },
    invalid: {
      iconColor: appearance.variables.colorDanger,
      color: appearance.variables.colorDanger,
    },
  }
});
card.mount('#card-element');

card.on('change', function (event) {
  displayError(event);
});

window['cardRef'] = card;


function displayError(event) {
  //changeLoadingStatePrices(false);
  let displayError = document.getElementById('card-element-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
}

var form = document.getElementById('payment-form');

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      displayError(result);
    } else {
      // Send the token to your server
      createPaymentMethod(result.token);
    }
  });
  //createPaymentMethod(ev);
});

function createPaymentMethod(v) {
  // Set up payment method for recurring usage
  let billingName = 'OLEKSANDR PAVLOVSKYI';

  let priceId = items[0].priceId

  stripe
    .createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: {
        name: billingName,
      },
    })
    .then((result) => {
      if (result.error) {
        displayError(result);
      } else {
        createSubscription({
          customerId: customerId,
          paymentMethodId: result.paymentMethod.id,
          priceId: priceId,
        });
      }
    });
}


function createSubscription({ customerId, paymentMethodId, priceId }) {
  return fetch(`/api/stripe/customer/${customerId}/attach-payment-method/${paymentMethodId}`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: null
    })
    .then((response) => {
      return response.json();
    })
    .then(response => {
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
          priceId: priceId,
        })
      })
    })
    .then((response) => {
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
        paymentMethodId: paymentMethodId,
        priceId: priceId,
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

function onSubscriptionComplete(result) {
  // Payment was successful.
  if (result.status === 'active') {
    // Change your UI to show a success message to your customer.
    // Call your backend to grant access to your service based on
    // `result.subscription.items.data[0].price.product` the customer subscribed to.
    alert('Succeed')
  } else {
    console.log(result)
  }
}

function handlePaymentThatRequiresCustomerAction({
  priceId,
  paymentMethodId,
  result,
  isRetry
}) {
  if (result.status === 'active') {
    // Subscription is active, no customer actions required.
    return { result, priceId, paymentMethodId };
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
            alert('Succeed');
            return result.paymentIntent;
          }
        }
      })
      .catch((error) => {
        displayError(error);
      });
  } else {
    // No customer action needed.
    return { result, priceId, paymentMethodId };
  }
}

function handleRequiresPaymentMethod({
  result,
  paymentMethodId,
  priceId,
}) {
  if (result.status === 'succeeded' || result.status === 'active') {
    // subscription is active, no customer actions required.
    return { result, priceId, paymentMethodId };
  } else if (result.paymentIntentStatus === 'requires_payment_method') {
    // Using localStorage to manage the state of the retry here,
    // feel free to replace with what you prefer.
    // Store the latest invoice ID and status.
    localStorage.setItem('latestInvoiceId', result.latestInvoiceId);
    localStorage.setItem('latestInvoicePaymentIntentStatus', result.paymentIntentStatus);
    throw { error: { message: 'Your card was declined.' } };
  } else {
    return { result, priceId, paymentMethodId };
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