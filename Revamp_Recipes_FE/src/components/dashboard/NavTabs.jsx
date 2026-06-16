import { Box } from '@mui/material';
import React from 'react'
import { NavLink } from 'react-router-dom';

 const NavTabs = () => {
  return (
      <Box sx={{ display: 'flex', gap: 1, p: 1, bgcolor: '#eff6ff', borderRadius: 3, width: "fit-content", mb: 2 }}>
          {/* Menggunakan end untuk memastikan kecocokan rute index */}
          <NavLink to="/allRecipes" style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                  <Box sx={{ px: 2, py: 0.6, borderRadius: 2.5, fontWeight: (isActive || location.pathname === '/') ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s ease', border: (isActive || location.pathname === '/') ? '2px solid #3b82f6' : '2px solid transparent', bgcolor: (isActive || location.pathname === '/') ? '#3b82f6' : 'white', color: (isActive || location.pathname === '/') ? 'white' : '#64748b', boxShadow: (isActive || location.pathname === '/') ? '0 2px 6px rgba(59,130,246,0.25)' : 'none', '&:hover': { bgcolor: (isActive || location.pathname === '/') ? '#2563eb' : '#f1f5f9' } }}>
                      Semua Resep
                  </Box>
              )}
          </NavLink>

          <NavLink to="/myRecipes" style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                  <Box sx={{ px: 2, py: 0.6, borderRadius: 2.5, fontWeight: isActive ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s ease', border: isActive ? '2px solid #3b82f6' : '2px solid transparent', bgcolor: isActive ? '#3b82f6' : 'white', color: isActive ? 'white' : '#64748b', boxShadow: isActive ? '0 2px 6px rgba(59,130,246,0.25)' : 'none', '&:hover': { bgcolor: isActive ? '#2563eb' : '#f1f5f9' } }}>
                      Resep Saya
                  </Box>
              )}
          </NavLink>
      </Box>
  )
}

export default NavTabs;
