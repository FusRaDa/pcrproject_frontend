import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import CreateBatch from './batches/CreateBatch';
import { provider, ProviderComposer } from './compose';
import EditBatch from './batches/EditBatch';

function App() {
  return (
    <div className="App">
      <Router>
        <ProviderComposer providers={[provider(AuthProvider)]}>

          <Header/>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route element={<HomePage/>} path="/" exact />
              <Route element={<CreateBatch/>} path="/create_batch" exact />
              <Route element={<EditBatch/>} path="/edit_batch/:pk" exact />
            </Route>
            <Route element={<LoginPage/>} path="/login" />
          </Routes>
        </ProviderComposer>        
      </Router>
    </div>
  );
}

export default App;
