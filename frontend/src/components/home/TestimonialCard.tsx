
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  image: string;
}

export function TestimonialCard({ quote, name, title, image }: TestimonialCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all p-8 relative">
      <div className="text-medical-500 text-5xl font-serif absolute top-6 left-6 opacity-20">
        ❝
      </div>
      <div className="mb-6 relative z-10">
        <p className="text-gray-700 italic">{quote}</p>
      </div>
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-4 border-2 border-medical-100">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-medical-100 text-medical-700">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </Card>
  );
}
