const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'admin'
    });
    
    // Create 15 products
    const products = [
      { name: 'iPhone 15 Pro', brand: 'Apple', category: 'Smartphones', description: 'Latest iPhone with Titanium design.', price: 134900, mrp: 134900, stock: 50, rating: 4.8, reviews: 120, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500' },
      { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Smartphones', description: 'AI powered flagship phone.', price: 129999, mrp: 134999, discount: 3, stock: 40, rating: 4.7, reviews: 95, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500' },
      { name: 'OnePlus 12', brand: 'OnePlus', category: 'Smartphones', description: 'Smooth beyond belief.', price: 64999, mrp: 69999, discount: 7, stock: 80, rating: 4.5, reviews: 200, image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&w=500' },
      { name: 'MacBook Air M3', brand: 'Apple', category: 'Laptops', description: 'Supercharged by M3 chip.', price: 114900, mrp: 114900, stock: 30, rating: 4.9, reviews: 300, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500' },
      { name: 'HP Spectre x360', brand: 'HP', category: 'Laptops', description: 'Premium 2-in-1 laptop.', price: 124999, mrp: 139999, discount: 10, stock: 25, rating: 4.6, reviews: 80, image: 'https://images.unsplash.com/photo-1531297172868-8098c47b5399?auto=format&fit=crop&w=500' },
      { name: 'Dell XPS 15', brand: 'Dell', category: 'Laptops', description: 'Powerful creator laptop.', price: 144990, mrp: 154990, discount: 6, stock: 20, rating: 4.7, reviews: 110, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500' },
      { name: 'iPad Pro M4', brand: 'Apple', category: 'Tablets', description: 'Outrageous performance.', price: 99900, mrp: 99900, stock: 45, rating: 4.8, reviews: 150, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500' },
      { name: 'Samsung Galaxy Tab S9', brand: 'Samsung', category: 'Tablets', description: 'Ultimate productivity tablet.', price: 72999, mrp: 85999, discount: 15, stock: 35, rating: 4.6, reviews: 90, image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=500' },
      { name: 'Apple AirPods Pro', brand: 'Apple', category: 'Earbuds', description: 'Active noise cancellation.', price: 24900, mrp: 24900, stock: 100, rating: 4.7, reviews: 400, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500' },
      { name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Headphones', description: 'Industry leading noise cancellation.', price: 29990, mrp: 34990, discount: 14, stock: 60, rating: 4.8, reviews: 250, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500' },
      { name: 'Noise ColorFit Pro 4', brand: 'Noise', category: 'Smartwatches', description: 'Advanced fitness tracking.', price: 2999, mrp: 5999, discount: 50, stock: 150, rating: 4.2, reviews: 800, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=500' },
      { name: 'Samsung Galaxy Watch 6', brand: 'Samsung', category: 'Smartwatches', description: 'Your everyday health companion.', price: 25999, mrp: 29999, discount: 13, stock: 55, rating: 4.5, reviews: 120, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500' },
      { name: 'Logitech G Pro X Superlight', brand: 'Logitech', category: 'Gaming', description: 'Zero opposition wireless gaming mouse.', price: 12995, mrp: 13995, discount: 7, stock: 70, rating: 4.9, reviews: 350, image: 'https://images.unsplash.com/photo-1527814050087-379381547961?auto=format&fit=crop&w=500' },
      { name: 'Razer BlackWidow V4', brand: 'Razer', category: 'Gaming', description: 'Mechanical gaming keyboard.', price: 15499, mrp: 16999, discount: 8, stock: 40, rating: 4.6, reviews: 180, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500' },
      { name: 'Mi Power Bank 3i 20000mAh', brand: 'Xiaomi', category: 'Accessories', description: 'Fast charging power bank.', price: 2199, mrp: 2999, discount: 26, stock: 200, rating: 4.4, reviews: 1500, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=500' }
    ];
    
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
