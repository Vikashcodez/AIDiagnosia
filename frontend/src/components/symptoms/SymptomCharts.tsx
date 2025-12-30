
import { Card } from "@/components/ui/card";
import { PieChart as PieChartIcon, ThermometerSun } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ChartDataTypes {
  name: string;
  symptoms: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  treatments: Array<{
    name: string;
    effectiveness: number;
    color: string;
  }>;
  description: string;
}

interface SymptomChartsProps {
  selectedDisease: string;
  diseaseData: {
    [key: string]: ChartDataTypes;
  };
}

export function SymptomCharts({ selectedDisease, diseaseData }: SymptomChartsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <PieChartIcon className="h-6 w-6 text-medical-500" />
          <h2 className="text-2xl font-bold text-gray-900">Symptom Distribution</h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={diseaseData[selectedDisease].symptoms}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {diseaseData[selectedDisease].symptoms.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <ThermometerSun className="h-6 w-6 text-medical-500" />
          <h2 className="text-2xl font-bold text-gray-900">Treatment Effectiveness</h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={diseaseData[selectedDisease].treatments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Effectiveness (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="effectiveness">
                {diseaseData[selectedDisease].treatments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
