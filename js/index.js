// // Создаем кнопку "Вход с помощью Apple"
// var appleSignInButton = document.createElement("button");
// appleSignInButton.textContent = "Вход с помощью Apple";
// document.body.appendChild(appleSignInButton);

// // Обработчик нажатия на кнопку "Вход с помощью Apple"
// appleSignInButton.addEventListener("click", function() {
//   // Запускаем процесс аутентификации через Apple ID
//   AppleID.auth.init({
//         clientId : 'app.getglam.api',
//         scope : 'email',
//         redirectURI :  'https://lex0rrd.github.io/payment.html',
//         state : 'initial',
//         nonce : 'somenonce',
//         usePopup : true
//   });

//   // Запускаем аутентификацию
//   AppleID.auth.signIn();
// });

// // Обработчик успешной аутентификации через Apple ID
// AppleID.auth.onSignIn(function (authorization) {
//   // Получаем данные пользователя из успешной аутентификации
//   var user = authorization.user;

//   // Используем данные пользователя для создания платежа через Stripe API или для других целей
//   var email = user.email;
//   var user_agent = navigator.userAgent;
//   var ip = "user_ip_address"; // Здесь нужно получить реальный IP пользователя, например, с помощью серверной части вашего приложения

//   // Далее вы можете использовать эти данные для создания платежа через Stripe API или для других целей
// });
