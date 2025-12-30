import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authcontext";

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
  monthlyRate: number;
  yearlyRate: number;
  name: string;
};

// Define subscription plans
const PLANS = {
  basic: {
    name: 'basic',
    price: 299, // Default INR price, will be converted
    duration: 30, // days
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
    name: 'premium',
    price: 599, // Default INR price, will be converted
    duration: 30, // days
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
    name: 'enterprise',
    price: 1499, // Default INR price, will be converted
    duration: 30, // days
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

// Currency conversion rates (approximate)
const CURRENCY_RATES: Record<string, number> = {
  USD: 0.012, // 1 INR = 0.012 USD
  EUR: 0.011,
  GBP: 0.0095,
  INR: 1,
  JPY: 1.8,
  CAD: 0.016,
  AUD: 0.018,
  CHF: 0.011,
  SEK: 0.13,
  NOK: 0.13,
  DKK: 0.085,
  PLN: 0.048,
  CZK: 0.27,
  RUB: 1.1,
  BRL: 0.06,
  MXN: 0.21,
  CNY: 0.088,
  KRW: 16.1,
  SGD: 0.016,
  TRY: 0.36,
  AED: 0.044,
  SAR: 0.045
};

export default function Pricing() {
  const isMobile = useIsMobile();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();
  const { user, token } = useAuth();
  
  const currencies: Record<string, Currency> = {
    USD: { symbol: '$', code: 'USD', monthlyRate: 3.99, yearlyRate: 44, name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', monthlyRate: 3.69, yearlyRate: 40.7, name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', monthlyRate: 3.19, yearlyRate: 35.2, name: 'British Pound' },
    INR: { symbol: '₹', code: 'INR', monthlyRate: 329, yearlyRate: 3619, name: 'Indian Rupee' },
    JPY: { symbol: '¥', code: 'JPY', monthlyRate: 590, yearlyRate: 6490, name: 'Japanese Yen' },
    CAD: { symbol: 'C$', code: 'CAD', monthlyRate: 5.39, yearlyRate: 59.3, name: 'Canadian Dollar' },
    AUD: { symbol: 'A$', code: 'AUD', monthlyRate: 5.99, yearlyRate: 65.9, name: 'Australian Dollar' },
    CHF: { symbol: 'CHF', code: 'CHF', monthlyRate: 3.59, yearlyRate: 39.5, name: 'Swiss Franc' },
    SEK: { symbol: 'kr', code: 'SEK', monthlyRate: 41.9, yearlyRate: 461, name: 'Swedish Krona' },
    NOK: { symbol: 'kr', code: 'NOK', monthlyRate: 42.9, yearlyRate: 472, name: 'Norwegian Krone' },
    DKK: { symbol: 'kr', code: 'DKK', monthlyRate: 27.5, yearlyRate: 303, name: 'Danish Krone' },
    PLN: { symbol: 'zł', code: 'PLN', monthlyRate: 15.9, yearlyRate: 175, name: 'Polish Złoty' },
    CZK: { symbol: 'Kč', code: 'CZK', monthlyRate: 89.9, yearlyRate: 989, name: 'Czech Koruna' },
    RUB: { symbol: '₽', code: 'RUB', monthlyRate: 369, yearlyRate: 4059, name: 'Russian Ruble' },
    BRL: { symbol: 'R$', code: 'BRL', monthlyRate: 19.9, yearlyRate: 219, name: 'Brazilian Real' },
    MXN: { symbol: '$', code: 'MXN', monthlyRate: 69.9, yearlyRate: 769, name: 'Mexican Peso' },
    CNY: { symbol: '¥', code: 'CNY', monthlyRate: 28.9, yearlyRate: 318, name: 'Chinese Yuan' },
    KRW: { symbol: '₩', code: 'KRW', monthlyRate: 5290, yearlyRate: 58190, name: 'South Korean Won' },
    SGD: { symbol: 'S$', code: 'SGD', monthlyRate: 5.39, yearlyRate: 59.3, name: 'Singapore Dollar' },
    TRY: { symbol: '₺', code: 'TRY', monthlyRate: 119, yearlyRate: 1309, name: 'Turkish Lira' },
    AED: { symbol: 'د.إ', code: 'AED', monthlyRate: 14.6, yearlyRate: 161, name: 'UAE Dirham' },
    SAR: { symbol: 'ر.س', code: 'SAR', monthlyRate: 14.9, yearlyRate: 164, name: 'Saudi Riyal' }
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
      'IN': 'INR', 'JP': 'JPY', 'CA': 'CAD', 'AU': 'AUD', 'CH': 'CHF',
      'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'PL': 'PLN', 'CZ': 'CZK',
      'RU': 'RUB', 'BR': 'BRL', 'MX': 'MXN', 'CN': 'CNY', 'KR': 'KRW',
      'SG': 'SGD', 'TR': 'TRY', 'AE': 'AED', 'SA': 'SAR'
    };

    const detectedCurrency = currencyMap[countryCode || 'US'] || 'USD';
    setSelectedCurrency(currencies[detectedCurrency]);
  }, []);

  const convertPrice = (inrPrice: number, currencyCode: string): number => {
    const rate = CURRENCY_RATES[currencyCode] || 1;
    return Math.round(inrPrice * rate * 100) / 100; // Round to 2 decimal places
  };

  const handleSubscription = async (planName: 'basic' | 'premium' | 'enterprise') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to subscribe",
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
      // Create order on backend
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

      // Razorpay checkout options
      const options = {
        key: order.key_id,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "MediAssist Healthcare",
        description: `${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // Verify payment on backend
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
              description: `Your ${planName} subscription is now active.`,
              variant: "default",
            });
            // Refresh user data or redirect
            window.location.reload();
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
        notes: {
          address: user.address || ''
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

      // Open Razorpay checkout
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

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencies[currencyCode]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
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
          {Object.entries(currencies).slice(0, 12).map(([code, currency]) => (
            <Button
              key={code}
              variant={selectedCurrency.code === code ? "default" : "outline"}
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
                  {selectedCurrency.symbol}
                  {convertPrice(PLANS.basic.price, selectedCurrency.code).toLocaleString()}
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
                  {selectedCurrency.symbol}
                  {convertPrice(PLANS.premium.price, selectedCurrency.code).toLocaleString()}
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
                  {selectedCurrency.symbol}
                  {convertPrice(PLANS.enterprise.price, selectedCurrency.code).toLocaleString()}
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

        {/* Comparison Table */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Plan Comparison</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-semibold text-gray-700">Features</th>
                  <th className="p-4 text-center font-semibold text-gray-700">Basic</th>
                  <th className="p-4 text-center font-semibold text-gray-700 bg-blue-50 text-blue-700">Premium</th>
                  <th className="p-4 text-center font-semibold text-gray-700 bg-purple-50 text-purple-700">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-medium">Price per month</td>
                  <td className="p-4 text-center">
                    {selectedCurrency.symbol}
                    {convertPrice(PLANS.basic.price, selectedCurrency.code).toLocaleString()}
                  </td>
                  <td className="p-4 text-center bg-blue-50">
                    {selectedCurrency.symbol}
                    {convertPrice(PLANS.premium.price, selectedCurrency.code).toLocaleString()}
                  </td>
                  <td className="p-4 text-center bg-purple-50">
                    {selectedCurrency.symbol}
                    {convertPrice(PLANS.enterprise.price, selectedCurrency.code).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">AI Symptom Analysis</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center bg-blue-50">✓</td>
                  <td className="p-4 text-center bg-purple-50">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Disease Prediction</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center bg-blue-50">✓</td>
                  <td className="p-4 text-center bg-purple-50">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Health Risk Assessment</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center bg-blue-50">✓</td>
                  <td className="p-4 text-center bg-purple-50">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">24/7 Support</td>
                  <td className="p-4 text-center">Standard</td>
                  <td className="p-4 text-center bg-blue-50">Priority</td>
                  <td className="p-4 text-center bg-purple-50">Dedicated</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">API Access</td>
                  <td className="p-4 text-center">✗</td>
                  <td className="p-4 text-center bg-blue-50">Limited</td>
                  <td className="p-4 text-center bg-purple-50">Full Access</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Custom AI Models</td>
                  <td className="p-4 text-center">✗</td>
                  <td className="p-4 text-center bg-blue-50">✗</td>
                  <td className="p-4 text-center bg-purple-50">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
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
        
      </div>
    </div>
  );
}