// src/config/razorpay.js

// Development Mode: Using Mock Razorpay
// For production, replace with real Razorpay SDK initialization
console.log('[razorpay] 🔧 Development Mode - Using Mock Razorpay Gateway');

const razorpayInstance = {
  isEnabled: true,
  orders: {
    create: async (options) => {
      console.log('[razorpay] 📦 Creating mock order with amount:', options.amount);
      
      // Mock Razorpay response structure
      const mockOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt || null,
        status: 'created',
        attempts: 0,
        notes: {},
        created_at: Math.floor(Date.now() / 1000)
      };
      
      console.log('[razorpay] ✅ Mock order created:', mockOrder.id);
      return mockOrder;
    }
  }
};

console.log('[razorpay] ✅ Mock Razorpay Ready - Test payments will work!');

export default razorpayInstance;
