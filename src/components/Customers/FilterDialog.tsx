import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: string;
    churnRisk: string;
    contract: string;
    tenure: string;
  };
  onFiltersChange: (filters: {
    status: string;
    churnRisk: string;
    contract: string;
    tenure: string;
  }) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Customers</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="churnRisk" className="text-right">
              Churn Risk
            </Label>
            <Select
              value={filters.churnRisk}
              onValueChange={(value) => handleFilterChange('churnRisk', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contract" className="text-right">
              Contract
            </Label>
            <Select
              value={filters.contract}
              onValueChange={(value) => handleFilterChange('contract', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="month-to-month">Month-to-month</SelectItem>
                <SelectItem value="one-year">One Year</SelectItem>
                <SelectItem value="two-year">Two Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tenure" className="text-right">
              Tenure
            </Label>
            <Select
              value={filters.tenure}
              onValueChange={(value) => handleFilterChange('tenure', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select tenure range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0-12">0-12 months</SelectItem>
                <SelectItem value="13-24">13-24 months</SelectItem>
                <SelectItem value="25-36">25-36 months</SelectItem>
                <SelectItem value="37+">37+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;