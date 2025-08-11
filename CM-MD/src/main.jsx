import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { IntegratedChartsModule } from 'ag-grid-enterprise'; 
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise'; 

ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([AllEnterpriseModule]);
ModuleRegistry.registerModules([ IntegratedChartsModule.with(AgChartsEnterpriseModule) ]); 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
