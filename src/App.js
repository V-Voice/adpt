import { useState } from "react";
import CompaniesTable from "./components/CompaniesTable/CompaniesTable.tsx";
import WorkersTable from "./components/WorkersTable/WorkersTable.tsx";

function App() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  return (
    <div className="App">
      <CompaniesTable selectedCompanies={selectedCompanies} setSelectedCompanies={setSelectedCompanies}  />
      <WorkersTable selectedCompanies={selectedCompanies} />
    </div>
  );
}

export default App;
