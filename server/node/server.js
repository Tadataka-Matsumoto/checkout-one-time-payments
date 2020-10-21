const express = require('express');
const app = express();
const { resolve } = require('path');
// const cors = require('cors');
var bodyParser = require('body-parser');
// Copy the .env.example in the root into a .env file in this folder
require('dotenv').config({ path: './.env' });
// const stripe = require('stripe')(
// 	'sk_test_51HbKSjIyjaakxrkQtJP0Z3jI8XViKhSlvOpns7ok60RgX3FFwCgyMVTSYhl481KNq3j9W0Q3HSpTV2FjDai1ZJ5b00a1X0uxzk'
// );
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// //eri'sacount
// const stripe = require('stripe')(
// 	'sk_test_51HU4oYEc81NFGDJi4Yy6u66McEpxkIxg718bZbE6xQpdcSyOvQqGG2macbksefTXllPlrg3Zah7sWpcl45OBzUHb0050I8PBXy'
// );
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// app.use(cors());
//app.use(express.static(process.env.STATIC_DIR));
app.use(
	express.json({
		// We need the raw body to verify webhook signatures.
		// Let's compute it only when hit ting the Stripe webhook endpoint.
		verify: function (req, res, buf) {
			if (req.originalUrl.startsWith('/webhook')) {
				req.rawBody = buf.toString();
			}
		},
	})
);

//これは使わなくてもいいかな。。。
// app.use(bodyParser.json());
// app.use(
// 	bodyParser.urlencoded({
// 		extended: true,
// 	})
// );


// app.get('/config', async (req, res) => {
// 	const price = await stripe.prices.retrieve(process.env.PRICE);
// 	res.send({
// 		publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
// 		unitAmount: price.unit_amount,
// 		currency: price.currency,
// 	});
// });


//eriさんのコード
app.post('/ephemeral_keys',  async (req, res) => {
	const apiVersion = req.body.api_version;
  const customerId = req.body.customerId;
  console.log(apiVersion, customerId);
  try {
    let key = await stripe.ephemeralKeys.create(
      {customer: customerId},
      {apiVersion: apiVersion}
    );
     res.send(key);
  } catch (error) {
      console.error(error.message);
  }

  //eriさんのコード
	// let key = stripe.ephemeralKeys
	// 	.create({ customer: customerId }, { apiVersion: apiVersion })
	// 	.then((key) => {
	// 		res.status(200).send(key);
	// 		console.log(key, 'this is the ephemeralkey');
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 		res.status(500).end();
	// 	});
});






//少しreactを生かす
app.post("/create-session", async (req, res) => {
  // app.post("/", async (req, res) => {
  const domainURL = process.env.DOMAIN;
  console.log(req.body);
  // const { quantity, locale } = req.body;
  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the Checkout page
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    //元のデータ
    // payment_method_types: process.env.PAYMENT_METHODS,
    // mode: 'payment',
    // line_items: [
    //   {
    //     price: process.env.PRICE,
    //     quantity: quantity
    //   },
    // ],

    //フロントから来るデータ
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode : 'payment',

  //   // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
  //   // success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
  //   // cancel_url: `${domainURL}/canceled.html`,
    success_url: `https://www.codechrysalis.io/`,
    cancel_url: `https://google.co.jp`
  // }
  // req.body
  });

  // res.json({ id: session.id });
  // console.log({ id: session.id })
  res.send({
    sessionId: session.id,
  });
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));










//ここから下は古いデータ

// const express = require('express');
// const app = express();
// const { resolve } = require('path');
// // Copy the .env.example in the root into a .env file in this folder
// require('dotenv').config({ path: './.env' });
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // app.use(express.static(process.env.STATIC_DIR));
// app.use(
//   express.json({
//     // We need the raw body to verify webhook signatures.
//     // Let's compute it only when hit ting the Stripe webhook endpoint.
//     verify: function (req, res, buf) {
//       if (req.originalUrl.startsWith('/webhook')) {
//         req.rawBody = buf.toString();
//       }
//     },
//   })
// );

// app.get('/', (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + '/index.html');
//   res.sendFile(path);
// });

// app.get('/config', async (req, res) => {
//   const price = await stripe.prices.retrieve(process.env.PRICE);

//   res.send({
//     publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
//     unitAmount: price.unit_amount,
//     currency: price.currency,
//   });
// });

// // Fetch the Checkout Session to display the JSON result on the success page
// // app.get('/checkout-session', async (req, res) => {
// //   const { sessionId } = req.query;
// //   const session = await stripe.checkout.sessions.retrieve(sessionId);
// //   res.send(session);
// // });



// //create ephemeralKeys
// app.post("/ephemeral_keys", async (req, res) => {

//   try {
//   //   console.log(req.body)
//   // 　const {email} = req.body.email;
//     //customerIDをemailから取り出す
//     const customer = await stripe.customers.create({email: "tdtk1538@gmail.com"});
//     const customerId = customer.id;
  
//     let key = await stripe.ephemeralKeys.create(
//       {customer: customerId},
//       {apiVersion: '2020-08-27'}
//     );
//     console.log("keyは何?", key);
//     res.send({key:key});
  
//   } catch (error) {
//       console.error(error.message);
//   }
  
//   });


// // Webhook handler for asynchronous events.
// // app.post('/webhook', async (req, res) => {
// //   let data;
// //   let eventType;
// //   // Check if webhook signing is configured.
// //   if (process.env.STRIPE_WEBHOOK_SECRET) {
// //     // Retrieve the event by verifying the signature using the raw body and secret.
// //     let event;
// //     let signature = req.headers['stripe-signature'];

// //     try {
// //       event = stripe.webhooks.constructEvent(
// //         req.rawBody,
// //         signature,
// //         process.env.STRIPE_WEBHOOK_SECRET
// //       );
// //     } catch (err) {
// //       console.log(`⚠️  Webhook signature verification failed.`);
// //       return res.sendStatus(400);
// //     }
// //     // Extract the object from the event.
// //     data = event.data;
// //     eventType = event.type;
// //   } else {
// //     // Webhook signing is recommended, but if the secret is not configured in `config.js`,
// //     // retrieve the event data directly from the request body.
// //     data = req.body.data;
// //     eventType = req.body.type;
// //   }

// //   if (eventType === 'checkout.session.completed') {
// //     console.log(`🔔  Payment received!`);
// //   }

// //   res.sendStatus(200);
// // });

// app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));





// //ここから下はYUSUKEさんのコード


// // const stripe = require('stripe')('sk_test_51HU4otHqeWVlhNqJ7YqaBOHRDjZp2Ipm68H7jdYa8CjZGuJZqnZOi1MgLlqad0VJuNffI5bmQMMMJokszXaNF62m00TC8UeTh5');
// // const express = require('express');
// // const app = express();
// // app.use(express.static('.'));

// // const YOUR_DOMAIN = 'http://localhost:3000/checkout';

// // app.post('/create-session', async (req, res) => {
// //   console.log("tttttttttttttt");
// //   const session = await stripe.checkout.sessions.create({
// //     payment_method_types: ['card'],
// //     line_items: [
// //       {
// //         price_data: {
// //           currency: 'usd',
// //           product_data: {
// //             name: 'Stubborn Attachments',
// //             images: ['https://i.imgur.com/EHyR2nP.png'],
// //           },
// //           unit_amount: 2000,
// //         },
// //         quantity: 1,
// //       },
// //     ],
// //     mode: 'payment',
// //     success_url: `https://www.codechrysalis.io/`,
// //     cancel_url: `https://google.co.jp`,
// //   });
// //   // console.log(res);
// //   res.json({ id: session.id });
// // });

// // app.listen(4242, () => console.log('Running on port 4242'));

