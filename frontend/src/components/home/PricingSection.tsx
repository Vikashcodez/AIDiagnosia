
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, EuroIcon, IndianRupee, JapaneseYen, Check } from "lucide-react";

type Currency = {
  symbol: React.ReactNode;
  code: string;
  monthlyRate: number;
  yearlyRate: number;
  name: string;
};

export const PricingSection = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const { toast } = useToast();
  
  const currencies: Record<string, Currency> = {
    USD: {
      symbol: <DollarSign className="h-4 w-4" />,
      code: "USD",
      monthlyRate: 1,
      yearlyRate: 50,
      name: "US Dollar"
    },
    EUR: {
      symbol: <EuroIcon className="h-4 w-4" />,
      code: "EUR",
      monthlyRate: 0.94,
      yearlyRate: 47,
      name: "Euro"
    },
    INR: {
      symbol: <IndianRupee className="h-4 w-4" />,
      code: "INR",
      monthlyRate: 83.5,
      yearlyRate: 4175,
      name: "Indian Rupee"
    },
    JPY: {
      symbol: <JapaneseYen className="h-4 w-4" />,
      code: "JPY",
      monthlyRate: 156.2,
      yearlyRate: 7810,
      name: "Japanese Yen"
    }
  };

  // Detect user's region and set currency
  useEffect(() => {
    const detectUserCurrency = () => {
      try {
        // Try to detect from browser
        const userLanguage = navigator.language;
        if (userLanguage.includes("ja")) return currencies.JPY;
        if (userLanguage.includes("hi") || userLanguage.includes("in")) return currencies.INR;
        if (userLanguage.includes("fr") || userLanguage.includes("de") || userLanguage.includes("es") || userLanguage.includes("it")) return currencies.EUR;
        
        // Default to USD
        return currencies.USD;
      } catch (error) {
        console.error("Error detecting currency:", error);
        return currencies.USD;
      }
    };

    setSelectedCurrency(detectUserCurrency());
  }, []);

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencies[currencyCode]);
  };
  
  const handleSubscribe = () => {
    toast({
      title: "Subscription initiated",
      description: "Thank you for your interest! Subscription functionality coming soon.",
    });
  };

  if (!selectedCurrency) {
    return <div className="flex justify-center items-center">Loading pricing...</div>;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
        </div>
        
        {/* Currency selector */}
        <div className="mb-8 flex justify-center gap-2">
          {Object.values(currencies).map((currency) => (
            <Button 
              key={currency.code}
              variant={selectedCurrency?.code === currency.code ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleCurrencyChange(currency.code)}
            >
              {currency.symbol} {currency.code}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Free Plan */}
          <Card className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Free Trial</CardTitle>
              <CardDescription>Try out all features</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">0</span>
                <span className="text-gray-500 ml-2">/ 10 days</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Limited to 5 uses</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Access all features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Basic support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>5 total uses</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleSubscribe}
              >
                Start Free Trial
              </Button>
            </CardFooter>
          </Card>
          
          {/* Monthly Plan */}
          <Card className="border-2 border-medical-200 hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-2xl font-bold">Monthly</CardTitle>
                <Badge variant="outline" className="bg-medical-50">Popular</Badge>
              </div>
              <CardDescription>Unlimited monthly access</CardDescription>
              <div className="mt-4 flex items-center">
                {selectedCurrency.symbol}
                <span className="text-3xl font-bold ml-1">
                  {selectedCurrency.monthlyRate.toFixed(selectedCurrency.code === "JPY" ? 0 : 2)}
                </span>
                <span className="text-gray-500 ml-2">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Billed monthly</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Unlimited access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>All features included</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="medical"
                onClick={handleSubscribe}
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
          
          {/* Yearly Plan */}
          <Card className="border-2 border-medical-500 gradient-card hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-2xl font-bold">Yearly</CardTitle>
                <Badge className="bg-medical-500 text-white">Save 58%</Badge>
              </div>
              <CardDescription>Best value plan</CardDescription>
              <div className="mt-4 flex items-center">
                {selectedCurrency.symbol}
                <span className="text-3xl font-bold ml-1">
                  {selectedCurrency.yearlyRate.toFixed(selectedCurrency.code === "JPY" ? 0 : 2)}
                </span>
                <span className="text-gray-500 ml-2">/ year</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Billed annually</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Unlimited access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Premium support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>All features included</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Early access to new features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="medical"
                onClick={handleSubscribe}
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>All plans include a 14-day money-back guarantee. No questions asked.</p>
          <p className="mt-2">Need a custom plan for your organization? <a href="/support" className="text-medical-500 hover:underline">Contact us</a></p>
        </div>
      </div>
    </section>
  );
};
