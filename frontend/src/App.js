import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { provider, ProviderComposer } from './compose';
import AssayPage from './pages/AssayPage';
import CreateAssay from './assays/CreateAssay';
import ListBatch from './batches/ListBatch';
import { BatchesProvider } from './context/BatchContext';

function App() {
  return (
    <div className="App">
      <Router>
        <ProviderComposer providers={[provider(AuthProvider), provider(BatchesProvider)]}>
          <Header/>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route element={<ListBatch/>} path="/" exact />
            
              <Route element={<AssayPage/>} path="/assay" exact/>
              <Route element={<CreateAssay/>} path="/assay/create_assay"/>
            </Route>
            <Route element={<LoginPage/>} path="/login" />
          </Routes>
        </ProviderComposer>        
      </Router>
    </div>
  );
}

export default App;
