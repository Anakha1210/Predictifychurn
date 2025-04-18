
import React from 'react';
import Header from '@/components/Header';
import ChurnRiskCard from '@/components/Dashboard/ChurnRiskCard';
import RecentPredictionsTable from '@/components/Dashboard/RecentPredictionsTable';
import ChurnFactorsChart from '@/components/Dashboard/ChurnFactorsChart';
import CustomerSegmentCard from '@/components/Dashboard/CustomerSegmentCard';
import { mockPredictions, mockChurnFactors, mockCustomerSegments } from '@/services/mockData';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Churn Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Monitor churn metrics and identify at-risk customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ChurnRiskCard 
            riskScore={27}
            previousScore={30}
            trend="down"
          />
          <div className="md:col-span-2">
            <ChurnFactorsChart data={mockChurnFactors} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <RecentPredictionsTable predictions={mockPredictions} />
          </div>
          <CustomerSegmentCard data={mockCustomerSegments} />
        </div>
        

      </main>
    </div>
  );
};

export default Index;
