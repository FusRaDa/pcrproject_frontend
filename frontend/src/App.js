import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import Header from './components/Header'
import React from 'react';

import ListAssay from './assays/ListAssay';
import CreateAssay from './assays/CreateAssay';
import EditAssay from './assays/EditAssay';
import ListBatch from './batches/ListBatch';
import WelcomePage from './pages/WelcomePage';

import { AuthProvider } from './context/AuthContext';
import { provider, ProviderComposer } from './compose';
import { BatchProvider } from './context/BatchContext';
import { AssayProvider } from './context/AssayContext';
import { ReagentProvider } from './context/ReagentContext';


function App() {
  return (
    <div className="App">
      <Router>
        <ProviderComposer providers={[
            provider(AuthProvider), 
            provider(BatchProvider), 
            provider(AssayProvider), 
            provider(ReagentProvider),
            ]}>
          <Header/>
          <Routes>
            <Route element={<PrivateRoute/>}>

              <Route element={<ListBatch/>} path="/" exact />

              <Route element={<ListAssay/>} path="/assay" exact/>
              <Route element={<CreateAssay/>} path="/assay/create" exact/>
              <Route element={<EditAssay/>} path="/assay/edit/:pk" exact/>

            </Route>
            <Route element={<WelcomePage/>} path="/login" />
          </Routes>
        </ProviderComposer>        
      </Router>
    </div>
  );
}

export default App;
