
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowLeft, User, Phone, Mail, Calendar, DollarSign, Download, Printer, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDetailsPage = () => {
  // Mock customer data
  const customer = {
    id: 'CUST-7891',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'May 12, 2020',
    status: 'Active',
    churnRisk: 87,
    monthlyCharges: 89.95,
    totalCharges: 3478.25,
    tenure: 39,
    contract: 'Month-to-month',
    paymentMethod: 'Credit card (automatic)',
    internetService: 'Fiber optic',
    onlineSecurity: 'No',
    onlineBackup: 'Yes',
    deviceProtection: 'Yes',
    techSupport: 'No',
    streamingTV: 'Yes',
    streamingMovies: 'Yes',
    paperlessBilling: 'Yes',
    partner: 'Yes',
    dependents: 'No',
    phoneService: 'Yes',
    multipleLines: 'Yes',
  };

  // Mock spending history data
  const spendingHistoryData = [
    { month: 'Jun', spending: 89.95 },
    { month: 'Jul', spending: 89.95 },
    { month: 'Aug', spending: 89.95 },
    { month: 'Sep', spending: 89.95 },
    { month: 'Oct', spending: 99.95 },
    { month: 'Nov', spending: 99.95 },
    { month: 'Dec', spending: 99.95 },
    { month: 'Jan', spending: 99.95 },
    { month: 'Feb', spending: 109.95 },
    { month: 'Mar', spending: 109.95 },
    { month: 'Apr', spending: 109.95 },
    { month: 'May', spending: 109.95 },
  ];

  // Mock churn risk factors data
  const riskFactorsData = [
    { factor: 'Month-to-month contract', impact: 35 },
    { factor: 'No tech support', impact: 25 },
    { factor: 'No online security', impact: 20 },
    { factor: 'High monthly charges', impact: 15 },
    { factor: 'Fiber optic service', impact: 5 },
  ];

  // Mock recommendation data
  const recommendations = [
    { id: 1, title: 'Offer Contract Upgrade', description: 'Suggest switching from month-to-month to a 1-year contract with a 15% discount for the first 3 months.', priority: 'High' },
    { id: 2, title: 'Tech Support Bundle', description: 'Offer a discounted tech support bundle that includes online security features.', priority: 'High' },
    { id: 3, title: 'Loyalty Discount', description: 'Provide a 10% loyalty discount for maintaining service for over 3 years.', priority: 'Medium' },
    { id: 4, title: 'Service Review Call', description: 'Schedule a service review call to address any concerns and gather feedback.', priority: 'Medium' },
  ];

  const getRiskBadge = (risk: number) => {
    if (risk < 30) return <Badge className="bg-success text-success-foreground">Low</Badge>;
    if (risk < 70) return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
      case 'Medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-success text-success-foreground">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <Link to="/customers" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to customers
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
              <div className="flex items-center mt-2">
                <Badge variant="outline">{customer.id}</Badge>
                <span className="mx-2">•</span>
                <Badge className={customer.status === 'Active' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}>
                  {customer.status}
                </Badge>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">Churn Risk:</span>
                  {getRiskBadge(customer.churnRisk)}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p>{customer.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Since</p>
                  <p>{customer.joinDate}</p>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Monthly Charges</p>
                  <p>${customer.monthlyCharges.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Spending History</CardTitle>
              <CardDescription>Monthly charges over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={spendingHistoryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Monthly Charge']} />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="service" className="w-full mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="service">Service Details</TabsTrigger>
            <TabsTrigger value="risk">Churn Risk Factors</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
                <CardDescription>Current service configuration and subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contract</p>
                    <p>{customer.contract}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p>{customer.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tenure</p>
                    <p>{customer.tenure} months</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Internet Service</p>
                    <p>{customer.internetService}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Online Security</p>
                    <p>{customer.onlineSecurity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Online Backup</p>
                    <p>{customer.onlineBackup}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Device Protection</p>
                    <p>{customer.deviceProtection}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tech Support</p>
                    <p>{customer.techSupport}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Streaming TV</p>
                    <p>{customer.streamingTV}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Streaming Movies</p>
                    <p>{customer.streamingMovies}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Paperless Billing</p>
                    <p>{customer.paperlessBilling}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Partner</p>
                    <p>{customer.partner}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dependents</p>
                    <p>{customer.dependents}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Service</p>
                    <p>{customer.phoneService}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Multiple Lines</p>
                    <p>{customer.multipleLines}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle>Churn Risk Factors</CardTitle>
                <CardDescription>Key factors contributing to this customer's churn risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={riskFactorsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="factor" type="category" width={150} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Impact on Churn Risk']} />
                      <Bar dataKey="impact" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <p className="text-amber-800 font-medium">Risk Analysis</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This customer is showing high churn risk primarily due to their month-to-month contract and lack of security features.
                    The combination of high monthly charges without tech support increases the likelihood of exploring competitor options.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Retention Recommendations</CardTitle>
                <CardDescription>Suggested actions to reduce churn risk for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{recommendation.title}</h3>
                          <p className="text-gray-600 mt-1">{recommendation.description}</p>
                        </div>
                        <div>
                          {getPriorityBadge(recommendation.priority)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Dismiss All</Button>
                <Button className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Create Outreach Task</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomerDetailsPage;
