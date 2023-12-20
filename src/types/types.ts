export interface CompaniesTableProps {
    selectedCompanies: number[];
    setSelectedCompanies: React.Dispatch<React.SetStateAction<number[]>>;
  }
  
  export interface Worker {
    id: number;
    lastName: string;
    firstName: string;
    position: string;
    company: number;
  }
  
  export interface Company {
    id: number;
    name: string;
    address: string;
  }

  export interface WorkersTableProps {
    selectedCompanies: Array<number>;
  }
  