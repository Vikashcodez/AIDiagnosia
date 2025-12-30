
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { DollarSign, EuroIcon, IndianRupee, JapaneseYen, Check } from "lucide-react";

type Currency = {
  symbol: React.ReactNode;
  code: string;
  monthlyRate: number;
  yearlyRate: number;
  name: string;
};

export default function Pricing() {
  const isMobile = useIsMobile();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  
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

  const features = [
    "AI-Powered Symptom Analysis",
    "Advanced Disease Prediction", 
    "Future Health Risk Assessment",
    "Medical Report Translation",
    "Personalized Diet Plans",
    "Smart Prescription Generator",
    "24/7 Mental Health Support",
    "Comprehensive Health Tips",
    "Multi-language Support",
    "Secure Data Encryption",
    "Expert Consultation Access",
    "Health Progress Tracking",
    "Emergency Alert System",
    "Family Health Management",
    "Medication Reminders",
    "Lab Results Analysis"
  ];

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
          
          {/* Free Trial */}
          <Card className="relative border-2 hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Free Trial</CardTitle>
              <CardDescription>Perfect for trying out our platform</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">FREE</span>
                <p className="text-sm text-muted-foreground mt-2">7 days trial</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-sm">• Limited to 10 analyses per day</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Start Free Trial
              </Button>
            </CardFooter>
          </Card>

          {/* Monthly Plan */}
          <Card className="relative border-2 border-primary hover:shadow-xl transition-all duration-300 scale-105">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              <CardDescription>Best for regular users</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {selectedCurrency.symbol}{selectedCurrency.monthlyRate.toLocaleString()}
                </span>
                <p className="text-sm text-muted-foreground mt-2">per month</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {features.slice(0, 12).map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Unlimited analyses</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Subscribe Monthly
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative border-2 hover:shadow-xl transition-all duration-300">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
              Best Value
            </Badge>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Yearly Plan</CardTitle>
              <CardDescription>Save with annual billing</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {selectedCurrency.symbol}{selectedCurrency.yearlyRate.toLocaleString()}
                </span>
                <p className="text-sm text-muted-foreground mt-2">per year</p>
                <p className="text-xs text-green-600 font-medium">
                  Save {Math.round(((selectedCurrency.monthlyRate * 12 - selectedCurrency.yearlyRate) / (selectedCurrency.monthlyRate * 12)) * 100)}%
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Early access to new features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="default">
                Subscribe Yearly
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
        
      </div>
    </div>
  );
}
