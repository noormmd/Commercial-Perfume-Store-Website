require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.static(path.join(__dirname, '..', 'Client', 'Public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Client', 'Public', 'src', 'pages', 'HeroPage.html'));
  });
  

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1RNdMLQ2riLkEmMkQq7glB1i', // Replace with your Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4242',
cancel_url: 'http://localhost:4242',

    });
    res.redirect(303, session.url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/success', (req, res) => {
  res.send('Payment successful! Thank you.');
});

app.get('/cancel', (req, res) => {
  res.send('Payment was cancelled.');
});


app.listen(4242, () => console.log('Server running on port 4242'));
