import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  ShoppingBag, 
  Check, 
  Shield, 
  Clock, 
  Wallet,
  Building,
  Smartphone,
  Banknote,
  ArrowLeft
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, name: 'Cart', icon: ShoppingBag },
    { id: 2, name: 'Shipping', icon: MapPin },
    { id: 3, name: 'Payment', icon: CreditCard },
    { id: 4, name: 'Confirm', icon: Check },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep >= step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 rounded ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'free'>('standard');

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH_ON_DELIVERY'>('CASH_ON_DELIVERY');

  const subtotal = cart?.total || 0;
  const shippingCost = shippingMethod === 'free' ? 0 : shippingMethod === 'express' ? 499 : subtotal >= 50000 ? 0 : 199;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        shippingMethod,
        notes: '',
      };

      await api.post('/orders', orderData);
      
      clearCart();
      setCurrentStep(4);
      setTimeout(() => {
        navigate(`/profile?tab=orders`);
      }, 3000);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500 mb-4">Redirecting to your orders...</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
            <Button onClick={() => navigate('/profile?tab=orders')}>
              View Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container-custom">
        {/* Back button */}
        <Link
          to="/cart"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="input-field"
                      placeholder="Enter your full address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="input-field"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="input-field"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="input-field"
                        placeholder="PIN Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="input-field"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-primary-600" />
                  </div>
                  Shipping Method
                </h2>

                <div className="space-y-3">
                  {subtotal >= 50000 && (
                    <label
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        shippingMethod === 'free'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value="free"
                          checked={shippingMethod === 'free'}
                          onChange={() => setShippingMethod('free')}
                          className="h-4 w-4 text-green-600"
                        />
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900 flex items-center">
                            Free Shipping
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              Eligible
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            5-7 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">FREE</span>
                    </label>
                  )}

                  <label
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="h-4 w-4 text-primary-600"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">Standard Delivery</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          5-7 business days
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      {subtotal >= 50000 ? <span className="line-through text-gray-400">₹199</span> : '₹199'}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="h-4 w-4 text-primary-600"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900 flex items-center">
                          Express Delivery
                          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Fastest
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          2-3 business days
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹499</span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Wallet className="h-5 w-5 text-primary-600" />
                  </div>
                  Payment Method
                </h2>

                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
                    { value: 'UPI', label: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
                    { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
                    { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard, description: 'All banks supported' },
                    { value: 'NET_BANKING', label: 'Net Banking', icon: Building, description: 'All major banks' },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="h-4 w-4 text-primary-600"
                        />
                        <div className="ml-3 flex items-center">
                          <Icon className="h-5 w-5 text-gray-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.imageUrls?.[0] || 'https://placehold.co/64x64?text=Product'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary-600">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cart.itemCount} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      <span>₹{shippingCost.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                  className="w-full mt-6"
                  size="lg"
                >
                  {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                </Button>

                {/* Security Info */}
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                  <Shield className="h-4 w-4 mr-1" />
                  Secure 256-bit SSL encrypted payment
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
