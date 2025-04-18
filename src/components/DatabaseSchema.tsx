
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DatabaseSchema = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Database Schema Design</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="min-w-[600px]">
          <svg width="100%" height="520" viewBox="0 0 800 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Users Table */}
            <rect x="50" y="50" width="200" height="160" rx="4" fill="#E6F7FF" stroke="#1890FF" strokeWidth="2"/>
            <text x="150" y="30" textAnchor="middle" fontWeight="bold" fontSize="16">Users</text>
            <line x1="50" y1="80" x2="250" y2="80" stroke="#1890FF" strokeWidth="2"/>
            <text x="60" y="100" fontSize="14">id (PK)</text>
            <text x="60" y="120" fontSize="14">username</text>
            <text x="60" y="140" fontSize="14">email</text>
            <text x="60" y="160" fontSize="14">password_hash</text>
            <text x="60" y="180" fontSize="14">role</text>
            <text x="60" y="200" fontSize="14">created_at</text>

            {/* DataSets Table */}
            <rect x="50" y="280" width="200" height="160" rx="4" fill="#E6F7FF" stroke="#1890FF" strokeWidth="2"/>
            <text x="150" y="260" textAnchor="middle" fontWeight="bold" fontSize="16">DataSets</text>
            <line x1="50" y1="310" x2="250" y2="310" stroke="#1890FF" strokeWidth="2"/>
            <text x="60" y="330" fontSize="14">id (PK)</text>
            <text x="60" y="350" fontSize="14">user_id (FK)</text>
            <text x="60" y="370" fontSize="14">name</text>
            <text x="60" y="390" fontSize="14">description</text>
            <text x="60" y="410" fontSize="14">file_path</text>
            <text x="60" y="430" fontSize="14">created_at</text>

            {/* CustomerData Table */}
            <rect x="300" y="280" width="200" height="200" rx="4" fill="#E6F7FF" stroke="#1890FF" strokeWidth="2"/>
            <text x="400" y="260" textAnchor="middle" fontWeight="bold" fontSize="16">CustomerData</text>
            <line x1="300" y1="310" x2="500" y2="310" stroke="#1890FF" strokeWidth="2"/>
            <text x="310" y="330" fontSize="14">id (PK)</text>
            <text x="310" y="350" fontSize="14">dataset_id (FK)</text>
            <text x="310" y="370" fontSize="14">customer_id</text>
            <text x="310" y="390" fontSize="14">tenure</text>
            <text x="310" y="410" fontSize="14">contract_type</text>
            <text x="310" y="430" fontSize="14">payment_method</text>
            <text x="310" y="450" fontSize="14">monthly_charges</text>
            <text x="310" y="470" fontSize="14">total_charges</text>

            {/* PredictionResults Table */}
            <rect x="550" y="280" width="200" height="160" rx="4" fill="#E6F7FF" stroke="#1890FF" strokeWidth="2"/>
            <text x="650" y="260" textAnchor="middle" fontWeight="bold" fontSize="16">PredictionResults</text>
            <line x1="550" y1="310" x2="750" y2="310" stroke="#1890FF" strokeWidth="2"/>
            <text x="560" y="330" fontSize="14">id (PK)</text>
            <text x="560" y="350" fontSize="14">dataset_id (FK)</text>
            <text x="560" y="370" fontSize="14">customer_id</text>
            <text x="560" y="390" fontSize="14">churn_probability</text>
            <text x="560" y="410" fontSize="14">is_churn</text>
            <text x="560" y="430" fontSize="14">prediction_date</text>

            {/* PredictionModels Table */}
            <rect x="550" y="50" width="200" height="160" rx="4" fill="#E6F7FF" stroke="#1890FF" strokeWidth="2"/>
            <text x="650" y="30" textAnchor="middle" fontWeight="bold" fontSize="16">PredictionModels</text>
            <line x1="550" y1="80" x2="750" y2="80" stroke="#1890FF" strokeWidth="2"/>
            <text x="560" y="100" fontSize="14">id (PK)</text>
            <text x="560" y="120" fontSize="14">user_id (FK)</text>
            <text x="560" y="140" fontSize="14">name</text>
            <text x="560" y="160" fontSize="14">description</text>
            <text x="560" y="180" fontSize="14">accuracy</text>
            <text x="560" y="200" fontSize="14">created_at</text>

            {/* Relationship Lines */}
            {/* Users to DataSets */}
            <line x1="150" y1="210" x2="150" y2="280" stroke="#1890FF" strokeWidth="2" strokeDasharray="5,5"/>
            <polygon points="150,280 145,270 155,270" fill="#1890FF"/>

            {/* Users to PredictionModels */}
            <line x1="250" y1="130" x2="550" y2="130" stroke="#1890FF" strokeWidth="2" strokeDasharray="5,5"/>
            <polygon points="550,130 540,125 540,135" fill="#1890FF"/>

            {/* DataSets to CustomerData */}
            <line x1="250" y1="350" x2="300" y2="350" stroke="#1890FF" strokeWidth="2" strokeDasharray="5,5"/>
            <polygon points="300,350 290,345 290,355" fill="#1890FF"/>

            {/* DataSets to PredictionResults */}
            <line x1="250" y1="370" x2="400" y2="370" stroke="#1890FF" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="400" y1="370" x2="550" y2="350" stroke="#1890FF" strokeWidth="2" strokeDasharray="5,5"/>
            <polygon points="550,350 540,345 540,355" fill="#1890FF"/>

            {/* PredictionModels to PredictionResults (weak relationship) */}
            <line x1="650" y1="210" x2="650" y2="280" stroke="#1890FF" strokeWidth="2" strokeDasharray="10,5"/>
            <polygon points="650,280 645,270 655,270" fill="#1890FF"/>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSchema;
