import {
    Drawer, IconButton, List, ListItem,
    ListItemButton, ListItemText,
    Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import menu from '../../utils/hamburgerMenu.jsx';

const MobileDrawer = ({ methode, user }) => {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = methode;
    const token = localStorage.getItem("token");

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
                sx: {
                    width: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                }
            }}
        >
            {/* Header: User Info */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    {token ? (
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-semibold">
                            <Avatar src={user?.avatar ? user?.avatar : ''}>
                                {user?.avatar ? '' : <PersonIcon />}
                            </Avatar>
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium text-gray-800 leading-none">
                            {token ? (user?.username ?? 'Pengguna') : 'Selamat datang'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {token ? (user?.email ?? '') : 'Masuk untuk pengalaman lebih'}
                        </p>
                    </div>
                </div>

                <IconButton
                    onClick={toggleDrawer(false)}
                    size="small"
                    sx={{
                        bgcolor: 'grey.100',
                        borderRadius: '8px',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: 'grey.200' },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </div>

            {/* Navigation Section */}
            <div className="px-3 pt-3 flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">
                    Navigasi
                </p>
                <List disablePadding>
                    {menu.map((item) => (
                        <ListItem key={item.text} disablePadding className="mb-0.5">
                            <ListItemButton
                                onClick={toggleDrawer(false)}
                                component="a"
                                href={item.href}
                                selected={item.active}
                                sx={{
                                    borderRadius: '8px',
                                    py: '10px',
                                    px: 1,
                                    gap: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'grey.100',
                                        '&:hover': { bgcolor: 'grey.200' },
                                    },
                                    '&:hover': { bgcolor: 'grey.50' },
                                }}
                            >
                                <div className={`
                  w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                  ${item.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}
                `}>
                                    {item.icon}
                                </div>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: item.active ? 500 : 400,
                                        color: item.active ? 'text.primary' : 'text.secondary',
                                    }}
                                />
                                {item.active && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto" />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>

            {/* Footer: Auth Button */}
            <div className="p-4 border-t border-gray-100">
                {token ? (
                    <button
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                        onClick={() => { localStorage.clear(); navigate("/login", { replace: true }); }}
                    >
                        <LogoutIcon sx={{ fontSize: 16 }} />
                        Keluar
                    </button>
                ) : (
                    <button
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                            onClick={() => { navigate("/login", { replace: true }); }}
                    >
                        <LoginIcon sx={{ fontSize: 16 }} />
                        Masuk
                    </button>
                )}
            </div>
        </Drawer>
    );
};

export default MobileDrawer;