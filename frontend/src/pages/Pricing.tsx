import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, Loader2, Home, LogIn, LogOut, User, Crown, Calendar, CreditCard, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authcontext";
import { useNavigate } from "react-router-dom";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

type Currency = {
  symbol: React.ReactNode;
  code: string;
  name: string;
};

type Subscription = {
  transaction_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  plan: 'basic' | 'premium' | 'enterprise';
  plan_name: string;
  plan_price: number;
  plan_duration: number;
  plan_features: string[];
  expiry_date: string;
  transaction_date: string;
  days_remaining: number;
  is_active: boolean;
  user_id: number;
};

// Define subscription plans
const PLANS = {
  basic: {
    name: 'Basic',
    price: 299,
    duration: 30,
    color: 'bg-blue-100 text-blue-800',
    icon: '🔵',
    features: [
      "AI-Powered Symptom Analysis",
      "Advanced Disease Prediction", 
      "Future Health Risk Assessment",
      "Medical Report Translation",
      "Personalized Diet Plans",
      "Smart Prescription Generator",
      "24/7 Mental Health Support",
      "Comprehensive Health Tips"
    ]
  },
  premium: {
    name: 'Premium',
    price: 599,
    duration: 30,
    color: 'bg-purple-100 text-purple-800',
    icon: '🟣',
    features: [
      "Everything in Basic",
      "Multi-language Support",
      "Secure Data Encryption",
      "Expert Consultation Access",
      "Health Progress Tracking",
      "Emergency Alert System",
      "Family Health Management",
      "Medication Reminders",
      "Lab Results Analysis"
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 1499,
    duration: 30,
    color: 'bg-green-100 text-green-800',
    icon: '🟢',
    features: [
      "Everything in Premium",
      "Priority support",
      "Early access to new features",
      "Custom AI models",
      "API Access",
      "Dedicated account manager",
      "White-label solution",
      "Bulk user management"
    ]
  }
};

// Currency conversion rates
const CURRENCY_RATES: Record<string, number> = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  INR: 1,
  JPY: 1.8,
  CAD: 0.016,
  AUD: 0.018,
};

export default function Pricing() {
  const isMobile = useIsMobile();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const { toast } = useToast();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  const currencies: Record<string, Currency> = {
    USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
    INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  };

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then((success) => {
      if (success) {
        setScriptLoaded(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load payment system. Please refresh the page.",
          variant: "destructive",
        });
      }
    });
  }, []);

  // Detect user's region and set currency
  useEffect(() => {
    const userLocale = navigator.language || 'en-US';
    const countryCode = userLocale.split('-')[1];
    
    const currencyMap: Record<string, string> = {
      'US': 'USD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
      'IN': 'INR'
    };

    const detectedCurrency = currencyMap[countryCode || 'US'] || 'USD';
    setSelectedCurrency(currencies[detectedCurrency]);
  }, []);

  // Check user subscription
  useEffect(() => {
    if (user && token) {
      checkUserSubscription();
    } else {
      setLoadingSubscription(false);
    }
  }, [user, token]);

  const checkUserSubscription = async () => {
    try {
      setLoadingSubscription(true);
      const response = await fetch(`http://localhost:5000/api/payment/user/${user.userid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success && data.has_active_subscription) {
        setSubscription(data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(null);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const convertPrice = (inrPrice: number, currencyCode: string): number => {
    const rate = CURRENCY_RATES[currencyCode] || 1;
    return Math.round(inrPrice * rate * 100) / 100;
  };

  const handleSubscription = async (planName: 'basic' | 'premium' | 'enterprise') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to subscribe",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (subscription) {
      toast({
        title: "Already Subscribed",
        description: `You already have an active ${subscription.plan} subscription`,
        variant: "destructive",
      });
      return;
    }

    if (!scriptLoaded) {
      toast({
        title: "Error",
        description: "Payment system is loading. Please wait...",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planName
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      const { order } = data;

      const options = {
        key: order.key_id,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "MediAssist Healthcare",
        description: `${PLANS[planName].name} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast({
              title: "Payment Successful!",
              description: `Your ${PLANS[planName].name} subscription is now active.`,
              variant: "default",
            });
            await checkUserSubscription();
          } else {
            toast({
              title: "Payment Verification Failed",
              description: verifyData.message || "Please contact support",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone_no || ''
        },
        theme: {
          color: "#4f46e5"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You can try again anytime",
              variant: "default",
            });
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencies[currencyCode]);
  };

  if (!selectedCurrency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Detecting your currency...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loadingSubscription && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleHome}
                className="rounded-full"
              >
                <Home className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MediAssist Pricing
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* Current Plan Badge */}
                  {subscription && (
                    <Badge className={`${PLANS[subscription.plan].color} px-3 py-1`}>
                      <Crown className="h-3 w-3 mr-1" />
                      {PLANS[subscription.plan].name}
                    </Badge>
                  )}
                  
                  {/* User Avatar */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.name} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="hidden md:flex gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={handleLogin} className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Show subscription details if user has active subscription */}
        {subscription && (
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${PLANS[subscription.plan].color}`}>
                    <span className="text-xl">{PLANS[subscription.plan].icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {PLANS[subscription.plan].name} Plan
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </h3>
                    <p className="text-muted-foreground">Your subscription is active</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expires on</p>
                      <p className="font-semibold">{formatDate(subscription.expiry_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="font-semibold">
                        {subscription.amount} {subscription.currency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Days Remaining</p>
                      <p className="font-semibold">{subscription.days_remaining} days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button onClick={handleHome} size="sm">
                  Go to Dashboard
                </Button>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Show pricing only if no active subscription */}
        {!subscription ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Unlock the full potential of AI-powered healthcare with our premium features
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {Object.entries(currencies).map(([code, currency]) => (
                <Button
                  key={code}
                  variant={selectedCurrency?.code === code ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCurrencyChange(code)}
                  className="min-w-[80px]"
                >
                  {currency.symbol} {code}
                </Button>
              ))}
            </div>
            
            {/* Pricing Cards */}
            <div className={`grid gap-8 max-w-7xl mx-auto ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
              
              {/* Basic Plan */}
              <Card className="relative border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Basic Plan</CardTitle>
                  <CardDescription>Perfect for individual users</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {selectedCurrency?.symbol}
                      {convertPrice(PLANS.basic.price, selectedCurrency?.code || 'INR').toLocaleString()}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">per month</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {PLANS.basic.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleSubscription('basic')}
                    disabled={loading || !user || !scriptLoaded}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : !user ? (
                      "Login Required"
                    ) : !scriptLoaded ? (
                      "Loading Payment..."
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className="relative border-2 border-primary hover:shadow-xl transition-all duration-300 scale-105">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Premium Plan</CardTitle>
                  <CardDescription>Best for serious health tracking</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {selectedCurrency?.symbol}
                      {convertPrice(PLANS.premium.price, selectedCurrency?.code || 'INR').toLocaleString()}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">per month</p>
                    <p className="text-xs text-green-600 font-medium">
                      More features than Basic
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {PLANS.premium.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleSubscription('premium')}
                    disabled={loading || !user || !scriptLoaded}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : !user ? (
                      "Login Required"
                    ) : !scriptLoaded ? (
                      "Loading Payment..."
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative border-2 hover:shadow-xl transition-all duration-300">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                  Best Value
                </Badge>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Enterprise Plan</CardTitle>
                  <CardDescription>For hospitals & clinics</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {selectedCurrency?.symbol}
                      {convertPrice(PLANS.enterprise.price, selectedCurrency?.code || 'INR').toLocaleString()}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">per month</p>
                    <p className="text-xs text-purple-600 font-medium">
                      All features included
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {PLANS.enterprise.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => handleSubscription('enterprise')}
                    disabled={loading || !user || !scriptLoaded}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : !user ? (
                      "Login Required"
                    ) : !scriptLoaded ? (
                      "Loading Payment..."
                    ) : (
                      "Contact Sales"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="mt-20 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                    <p className="text-sm text-muted-foreground">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Is my data secure?</h3>
                    <p className="text-sm text-muted-foreground">We use enterprise-grade encryption to protect your health data and comply with HIPAA standards.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                    <p className="text-sm text-muted-foreground">We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
                    <p className="text-sm text-muted-foreground">Yes, you can change your plan at any time and we'll prorate the charges accordingly.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>Secure payment powered by Razorpay. Your payment information is encrypted and secure.</p>
              <p className="mt-2">All prices are exclusive of applicable taxes.</p>
            </div>
          </>
        ) : (
          // If user has active subscription, show thank you message
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
                <p className="text-gray-600">
                  Your {PLANS[subscription.plan].name} plan is active. Enjoy all premium features.
                </p>
              </div>
              <Button onClick={handleHome} className="mt-4">
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}