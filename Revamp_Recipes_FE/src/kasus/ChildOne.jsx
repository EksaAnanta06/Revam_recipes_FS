import React, { useState } from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const ChildOne = () => {
    const [love, setLove] = useState(0);
    const handleLove = () => setLove(prev => prev + 1);

    return (
        <div className='border border-amber-50 bg-blue-500 p-5 flex flex-col text-center rounded-xl shadow-lg animate-fade-in'>
            <h1 className='text-white font-bold uppercase text-2xl'>ini adalah heading dari component ChildOne</h1>
            <p className='text-5xl font-bold text-white my-4'>{love}</p>
            <button className='bg-black p-3 rounded-2xl text-white mb-4' onClick={handleLove}>click</button>

            {/* Tombol pemicu download atau aksi lain */}
            <Button variant="contained" disableElevation startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                sx={{ bgcolor: "#2563eb", borderRadius: "12px", px: 3, py: 1.2, textTransform: "none", fontWeight: 600, fontSize: "13px", "&:hover": { bgcolor: "#1d4ed8" } }}>
                Download Info One
            </Button>
        </div>
    );
};

export default ChildOne;