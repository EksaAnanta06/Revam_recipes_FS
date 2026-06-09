import React from 'react';

const ChildTwo = () => {
    return (
        <div className='border border-amber-50 bg-purple-500 p-5 flex flex-col text-center rounded-xl shadow-lg'>
            <h1 className='text-white font-bold uppercase text-2xl'>ini adalah heading dari component ChildTwo</h1>
            <p className='text-white mt-4'>Selamat datang di halaman kedua yang mulus tanpa mengganggu Navbar!</p>
        </div>
    );
};

export default ChildTwo;