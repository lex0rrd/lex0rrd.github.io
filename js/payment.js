

var data = {
  email: "test@test.org",
  fbp: "fbp..",
  fbc: "fbc..",
  user_agent: "...",
  ip: "...",
};

// Преобразуем данные в JSON
var json = JSON.stringify(data);

// Отправляем POST запрос
fetch('https://api.getglam.app/stripe/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: json
})
.then(response => response.json())
.then(data => {
  var paymentURL = data.paymentURL;
  // Перенаправляем пользователя на полученную ссылку для завершения оплаты через stripe
  window.location.href = paymentURL;
})
.catch((error) => {
  console.error('Error:', error);
});


document.addEventListener('DOMContentLoaded', async () => {
  // Load the publishable key from the server. The publishable key
  // is set in your .env file.
  const {publishableKey} = await fetch('https://api.getglam.app/stripe/config').then((r) => r.json());
  if (!publishableKey) {
    addMessage(
      'No publishable key returned from the server. Please check `.env` and try again'
    );
    alert('Please set your Stripe publishable API key in the .env file');
  }

  const stripe = Stripe(publishableKey, {
    apiVersion: '2020-08-27',
  });

  // On page load, we create a PaymentIntent on the server so that we have its clientSecret to
  // initialize the instance of Elements below. The PaymentIntent settings configure which payment
  // method types to display in the PaymentElement.
  const email = "test@test.org"
  const {
    error: backendError,
    clientSecret
  } = await fetch('https://api.getglam.app/stripe/create-payment-intent', {method: "POST", body: JSON.stringify({email: email}), headers: {"Content-Type": "application/json"}}).then(r => r.json());
  if (backendError) {
    addMessage(backendError.message);
  }
  addMessage(`Client secret returned.`);

  // Initialize Stripe Elements with the PaymentIntent's clientSecret,
  // then mount the payment element.
  const elements = stripe.elements({ clientSecret });
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
  // Create and mount the linkAuthentication Element to enable autofilling customer payment details
  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");
  // If the customer's email is known when the page is loaded, you can
  // pass the email to the linkAuthenticationElement on mount:
  //
  //   linkAuthenticationElement.mount("#link-authentication-element",  {
  //     defaultValues: {
  //       email: 'jenny.rosen@example.com',
  //     }
  //   })
  // If you need access to the email address entered:
  //
  //  linkAuthenticationElement.on('change', (event) => {
  //    const email = event.value.email;
  //    console.log({ email });
  //  })

  // When the form is submitted...
  const form = document.getElementById('payment-form');
  let submitted = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable double submission of the form
    if(submitted) { return; }
    submitted = true;
    form.querySelector('button').disabled = true;

    const nameInput = document.querySelector('#name');

    // Confirm the payment given the clientSecret
    // from the payment intent that was just created on
    // the server.
    const {error: stripeError} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/return.html`,
      }
    });

    if (stripeError) {
      addMessage(stripeError.message);

      // reenable the form.
      submitted = false;
      form.querySelector('button').disabled = false;
      return;
    }
  });
});
