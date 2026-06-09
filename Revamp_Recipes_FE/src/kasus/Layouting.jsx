import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const Layouting = () => {
  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* INI BAGIAN LAYOUT YANG STATIS (Nggk bakal re-render/kedip) */}
      <nav className="p-4 bg-gray-100 flex gap-4 justify-center">
        <Link to="/dashboard/child-one" className="text-blue-600 font-bold">Ke Child One</Link>
        <Link to="/dashboard/child-two" className="text-blue-600 font-bold">Ke Child Two</Link>
      </nav>

      {/* KONTEN DINAMIS AKAN MUNCUL DI SINI */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Outlet ini yang bertugas menukar ChildOne dan ChildTwo secara smooth */}
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layouting;