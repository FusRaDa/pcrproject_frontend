import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { provider, ProviderComposer } from './compose';
import ListBatch from './batches/ListBatch';
import { BatchProvider } from './context/BatchContext';
import { AssayProvider } from './context/AssayContext';
import ListAssay from './assays/ListAssay';
import CreateAssay from './assays/CreateAssay';
import EditAssay from './assays/EditAssay';

function App() {
  return (
    <div className="App">
      <Router>
        <ProviderComposer providers={[provider(AuthProvider), provider(BatchProvider), provider(AssayProvider)]}>
          <Header/>
          <Routes>
            <Route element={<PrivateRoute/>}>

              <Route element={<ListBatch/>} path="/" exact />
           
              <Route element={<ListAssay/>} path="/assay" exact/>
              <Route element={<CreateAssay/>} path="/assay/create" exact/>
              <Route element={<EditAssay/>} path="/assay/edit/:pk" exact/>

            </Route>
            <Route element={<LoginPage/>} path="/login" />
          </Routes>
        </ProviderComposer>        
      </Router>
    </div>
  );
}

export default App;
