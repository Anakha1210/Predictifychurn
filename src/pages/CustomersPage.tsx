
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterDialog from '@/components/Customers/FilterDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Filter, Download, ChevronDown, ExternalLink, 
  CheckCircle2, Loader, AlertCircle, RefreshCw 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCustomerData, fetchDatasets } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

// Define interfaces for our data
interface Dataset {
  id: number;
  name: string;
  record_count: number;
  created_at: string;
}

interface Customer {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  gender: string;
  status: string;
  churn_risk: number;
  monthly_charges: number;
  contract: string;
  tenure: number;
  is_churned: boolean;
  churn_probability?: number;
}

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    churnRisk: 'all',
    contract: 'all',
    tenure: 'all'
  });
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  
  // Load datasets on component mount
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const datasetsData = await fetchDatasets();
        setDatasets(datasetsData);
        
        // If there are datasets, select the first one by default
        if (datasetsData.length > 0) {
          setSelectedDataset(datasetsData[0].id.toString());
        }
      } catch (error) {
        console.error('Error loading datasets:', error);
        toast({
          title: "Error loading datasets",
          description: "Could not load available datasets. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    loadDatasets();
  }, []);
  
  // Load customer data when selectedDataset changes
  useEffect(() => {
    if (!selectedDataset) {
      setLoadingState('idle');
      return;
    }
    
    const loadCustomerData = async () => {
      try {
        setLoadingState('loading');
        const datasetId = parseInt(selectedDataset);
        const customerData = await fetchCustomerData(datasetId);
        
        if (!customerData || !Array.isArray(customerData)) {
          throw new Error('Invalid customer data received');
        }
        
        // Map the response to our Customer interface
        const mappedCustomers = customerData.map((customer) => ({
          id: customer.id.toString(),
          customer_id: customer.customer_id,
          name: customer.name,
          email: customer.email,
          gender: customer.gender,
          status: customer.is_churned ? 'Inactive' : 'Active',
          churn_risk: customer.churn_probability ? Math.round(customer.churn_probability * 100) : Math.random() * 100,
          monthly_charges: parseFloat(customer.monthly_charges),
          contract: customer.contract,
          tenure: parseInt(customer.tenure),
          is_churned: Boolean(customer.is_churned),
          churn_probability: customer.churn_probability
        }));
        
        setCustomers(mappedCustomers);
        setLoadingState('success');
      } catch (error) {
        console.error('Error loading customer data:', error);
        setLoadingState('error');
        toast({
          title: "Error loading customer data",
          description: error.message || "Could not load customer data. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    loadCustomerData();
  }, [selectedDataset]);
  
  // Filter customers based on search query and filters
  const filteredCustomers = customers.filter(customer => {
    // Search query filter
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customer_id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'active' && customer.status === 'Active') ||
      (filters.status === 'inactive' && customer.status === 'Inactive');

    // Churn risk filter
    const risk = customer.churn_risk || 0;
    const matchesChurnRisk =
      filters.churnRisk === 'all' ||
      (filters.churnRisk === 'high' && risk >= 70) ||
      (filters.churnRisk === 'medium' && risk >= 30 && risk < 70) ||
      (filters.churnRisk === 'low' && risk < 30);

    // Contract filter
    const matchesContract =
      filters.contract === 'all' ||
      (filters.contract === 'month-to-month' && customer.contract?.toLowerCase() === 'month-to-month') ||
      (filters.contract === 'one-year' && customer.contract?.toLowerCase() === 'one year') ||
      (filters.contract === 'two-year' && customer.contract?.toLowerCase() === 'two year');

    // Tenure filter
    const tenure = customer.tenure || 0;
    const matchesTenure =
      filters.tenure === 'all' ||
      (filters.tenure === '0-12' && tenure >= 0 && tenure <= 12) ||
      (filters.tenure === '13-24' && tenure >= 13 && tenure <= 24) ||
      (filters.tenure === '25-36' && tenure >= 25 && tenure <= 36) ||
      (filters.tenure === '37+' && tenure >= 37);

    return matchesSearch && matchesStatus && matchesChurnRisk && matchesContract && matchesTenure;
  });
  
  // Count customers by risk level
  const highRiskCount = customers.filter(c => (c.churn_risk || 0) >= 70).length;
  const mediumRiskCount = customers.filter(c => ((c.churn_risk || 0) >= 30 && (c.churn_risk || 0) < 70)).length;
  const lowRiskCount = customers.filter(c => (c.churn_risk || 0) < 30).length;
  
  const getChurnRiskBadge = (risk: number) => {
    if (risk < 30) return <Badge className="bg-success text-success-foreground">Low</Badge>;
    if (risk < 70) return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-6">
        <FilterDialog
          open={showFilterDialog}
          onOpenChange={setShowFilterDialog}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">
              Manage and analyze customer profiles and churn risk
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            {/* Dataset selector */}
            <Select
              value={selectedDataset}
              onValueChange={setSelectedDataset}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Select dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.length === 0 ? (
                  <SelectItem value="none" disabled>No datasets available</SelectItem>
                ) : (
                  datasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id.toString()}>
                      {dataset.name} ({dataset.record_count} records)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilterDialog(true)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>CRM Integration</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{highRiskCount}</div>
                <Badge className="bg-destructive text-destructive-foreground">
                  {customers.length ? Math.round((highRiskCount / customers.length) * 100) : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Medium Risk Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{mediumRiskCount}</div>
                <Badge className="bg-warning text-warning-foreground">
                  {customers.length ? Math.round((mediumRiskCount / customers.length) * 100) : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Risk Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{lowRiskCount}</div>
                <Badge className="bg-success text-success-foreground">
                  {customers.length ? Math.round((lowRiskCount / customers.length) * 100) : 0}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {loadingState === 'loading' && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Loading customer data...</p>
              <p className="text-gray-500">Please wait while we fetch the latest information.</p>
            </div>
          </div>
        )}

        {loadingState === 'error' && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Error loading customer data</p>
              <p className="text-gray-500 mb-4">There was a problem fetching the customer information.</p>
              <Button onClick={() => setSelectedDataset(selectedDataset)} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {loadingState === 'success' && (
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="high-risk">High Risk</TabsTrigger>
              <TabsTrigger value="medium-risk">Medium Risk</TabsTrigger>
              <TabsTrigger value="low-risk">Low Risk</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-9 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {loadingState === 'success' && customers.length > 0 && (
                <>
                  <TabsContent value="all" className="m-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Churn Risk</TableHead>
                          <TableHead>Monthly</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Tenure</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.customer_id}</TableCell>
                            <TableCell>
                              <Link to={`/customer/${customer.id}`} className="font-medium hover:underline text-blue-600">
                                {customer.name || 'Unknown'}
                              </Link>
                            </TableCell>
                            <TableCell>{customer.email || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {customer.status === 'Active' ? (
                                  <Badge className="bg-success text-success-foreground flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-gray-500">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getChurnRiskBadge(customer.churn_risk || 0)}
                            </TableCell>
                            <TableCell>${(customer.monthly_charges || 0).toFixed(2)}</TableCell>
                            <TableCell>{customer.contract || 'N/A'}</TableCell>
                            <TableCell>{customer.tenure || 0} months</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="high-risk" className="m-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Churn Risk</TableHead>
                          <TableHead>Monthly</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Tenure</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers
                          .filter(customer => (customer.churn_risk || 0) >= 70)
                          .map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell>{customer.customer_id}</TableCell>
                              <TableCell>
                                <Link to={`/customer/${customer.id}`} className="font-medium hover:underline text-blue-600">
                                  {customer.name || 'Unknown'}
                                </Link>
                              </TableCell>
                              <TableCell>{customer.email || 'N/A'}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {customer.status === 'Active' ? (
                                    <Badge className="bg-success text-success-foreground flex items-center">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-gray-500">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getChurnRiskBadge(customer.churn_risk || 0)}
                              </TableCell>
                              <TableCell>${(customer.monthly_charges || 0).toFixed(2)}</TableCell>
                              <TableCell>{customer.contract || 'N/A'}</TableCell>
                              <TableCell>{customer.tenure || 0} months</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="medium-risk" className="m-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Churn Risk</TableHead>
                          <TableHead>Monthly</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Tenure</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers
                          .filter(customer => (customer.churn_risk || 0) >= 30 && (customer.churn_risk || 0) < 70)
                          .map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell>{customer.customer_id}</TableCell>
                              <TableCell>
                                <Link to={`/customer/${customer.id}`} className="font-medium hover:underline text-blue-600">
                                  {customer.name || 'Unknown'}
                                </Link>
                              </TableCell>
                              <TableCell>{customer.email || 'N/A'}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {customer.status === 'Active' ? (
                                    <Badge className="bg-success text-success-foreground flex items-center">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-gray-500">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getChurnRiskBadge(customer.churn_risk || 0)}
                              </TableCell>
                              <TableCell>${(customer.monthly_charges || 0).toFixed(2)}</TableCell>
                              <TableCell>{customer.contract || 'N/A'}</TableCell>
                              <TableCell>{customer.tenure || 0} months</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="low-risk" className="m-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Churn Risk</TableHead>
                          <TableHead>Monthly</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Tenure</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers
                          .filter(customer => (customer.churn_risk || 0) < 30)
                          .map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell>{customer.customer_id}</TableCell>
                              <TableCell>
                                <Link to={`/customer/${customer.id}`} className="font-medium hover:underline text-blue-600">
                                  {customer.name || 'Unknown'}
                                </Link>
                              </TableCell>
                              <TableCell>{customer.email || 'N/A'}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {customer.status === 'Active' ? (
                                    <Badge className="bg-success text-success-foreground flex items-center">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-gray-500">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getChurnRiskBadge(customer.churn_risk || 0)}
                              </TableCell>
                              <TableCell>${(customer.monthly_charges || 0).toFixed(2)}</TableCell>
                              <TableCell>{customer.contract || 'N/A'}</TableCell>
                              <TableCell>{customer.tenure || 0} months</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Card>
        </Tabs>
      )}
    </main>
  </div>
  );
};

export default CustomersPage;
