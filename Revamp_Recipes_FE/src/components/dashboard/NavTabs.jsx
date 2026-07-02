import { Box } from '@mui/material';
import React from 'react'
import { NavLink } from 'react-router-dom';

 const NavTabs = () => {
  return (
      <Box sx={{ display: 'flex', gap: 0.75, p: 0.75, bgcolor: '#eff6ff', borderRadius: 3, width: 'fit-content' }}>
          <NavLink to="/allRecipes" style={{ textDecoration: 'none' }}>
              {({ isActive }) => {
                  const active = isActive || location.pathname === '/';
                  return (
                      <Box sx={{
                          px: { xs: 1.25, sm: 2 },
                          py: { xs: 0.5, sm: 0.6 },
                          borderRadius: 2.5,
                          fontWeight: active ? 700 : 500,
                          fontSize: { xs: '0.75rem', sm: '0.82rem' },
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: active ? '2px solid #3b82f6' : '2px solid transparent',
                          bgcolor: active ? '#3b82f6' : 'white',
                          color: active ? 'white' : '#64748b',
                          boxShadow: active ? '0 2px 6px rgba(59,130,246,0.25)' : 'none',
                          '&:hover': { bgcolor: active ? '#2563eb' : '#f1f5f9' },
                      }}>
                          Semua Resep
                      </Box>
                  );
              }}
          </NavLink>

          <NavLink to="/myRecipes" style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                  <Box sx={{
                      px: { xs: 1.25, sm: 2 },
                      py: { xs: 0.5, sm: 0.6 },
                      borderRadius: 2.5,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: { xs: '0.75rem', sm: '0.82rem' },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                      bgcolor: isActive ? '#3b82f6' : 'white',
                      color: isActive ? 'white' : '#64748b',
                      boxShadow: isActive ? '0 2px 6px rgba(59,130,246,0.25)' : 'none',
                      '&:hover': { bgcolor: isActive ? '#2563eb' : '#f1f5f9' },
                  }}>
                      Resep Saya
                  </Box>
              )}
          </NavLink>
      </Box>
  )
}

export default NavTabs;
