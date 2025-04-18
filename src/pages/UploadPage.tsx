
import React from 'react';
import Header from '@/components/Header';
import DataUploadForm from '@/components/DataUpload/DataUploadForm';

const UploadPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upload Customer Data</h1>
          <p className="text-gray-500 mt-1">
            Upload your customer dataset to analyze and predict churn
          </p>
        </div>
        
        <DataUploadForm />
        
        <div className="mt-8 mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Format Requirements</h2>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-4">
              To ensure accurate predictions, your CSV file should include the following customer information columns:
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>CustomerID</strong> - Unique identifier</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>Gender</strong> - Customer gender</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>SeniorCitizen</strong> - Yes/No or 1/0</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>Partner</strong> - Yes/No</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>Dependents</strong> - Yes/No</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>Tenure</strong> - Months with the company</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>PhoneService</strong> - Yes/No</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>MultipleLines</strong> - Yes/No/No phone service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>InternetService</strong> - DSL/Fiber optic/No</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>OnlineSecurity</strong> - Yes/No/No internet service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>OnlineBackup</strong> - Yes/No/No internet service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>DeviceProtection</strong> - Yes/No/No internet service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>TechSupport</strong> - Yes/No/No internet service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>StreamingTV</strong> - Yes/No/No internet service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>StreamingMovies</strong> - Yes/No/No internet service</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>Contract</strong> - Month-to-month/One year/Two year</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>PaperlessBilling</strong> - Yes/No</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>PaymentMethod</strong> - Credit card/Bank transfer/etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>MonthlyCharges</strong> - Monthly amount</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span><strong>TotalCharges</strong> - Total amount charged</span>
              </li>
            </ul>
            
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium">Sample data:</p>
              <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto mt-1">
                CustomerID,Gender,SeniorCitizen,Partner,Dependents,Tenure,PhoneService,MultipleLines,InternetService,OnlineSecurity,...{"\n"}
                7590-VHVEG,Female,0,Yes,No,1,No,No phone service,DSL,No,...{"\n"}
                5575-GNVDE,Male,0,No,No,34,Yes,No,DSL,Yes,...{"\n"}
                3668-QPYBK,Male,0,No,No,2,Yes,No,DSL,Yes,...
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
