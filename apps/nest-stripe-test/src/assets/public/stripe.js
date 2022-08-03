
(async function() {
  const res  = await fetch('/api/app/config');
  const config = await res.json();
  // eslint-disable-next-line no-undef
  window['stripe'] = new Stripe(config.stripePublicKey);
})()