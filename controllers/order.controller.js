// import creatError from '../utils/createError.js';
import Stripe from 'stripe';
import Order from '../models/order.model.js';
import Gig from '../models/gig.model.js';

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: 'temporary',
    });
    await newOrder.save();
    res.status(200).send('Successful');
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const intent = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE);
    const gig = await Gig.findById(req.params.id);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
    await newOrder.save();
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    res.status(200).send('Order has been comfirmed!');
  } catch (err) {
    next(err);
  }
};
