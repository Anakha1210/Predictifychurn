
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ChurnRiskCardProps {
  riskScore: number;
  previousScore?: number;
  trend?: "up" | "down" | "none";
}

const ChurnRiskCard: React.FC<ChurnRiskCardProps> = ({
  riskScore,
  previousScore,
  trend = "none",
}) => {
  const riskLevel = 
    riskScore < 30 ? "Low" : 
    riskScore < 70 ? "Medium" : "High";
  
  const riskColor = 
    riskScore < 30 ? "bg-success text-success-foreground" : 
    riskScore < 70 ? "bg-warning text-warning-foreground" : 
    "bg-destructive text-destructive-foreground";

  const percentChange = previousScore 
    ? (((riskScore - previousScore) / previousScore) * 100).toFixed(1) 
    : null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Average Churn Risk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{riskScore}%</div>
          {trend !== "none" && percentChange && (
            <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-destructive' : 'text-success'}`}>
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {percentChange}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <Progress 
            value={riskScore} 
            className={`h-2 ${riskScore < 30 ? 'bg-success/20' : riskScore < 70 ? 'bg-warning/20' : 'bg-destructive/20'}`}
          />
          <p className={`mt-1 text-xs font-medium inline-block px-2 py-0.5 rounded-sm ${riskColor}`}>
            {riskLevel} Risk
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChurnRiskCard;
