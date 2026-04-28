import React from 'react'
import { useState } from 'react';



export const Test = () => {
    const [files, setFiles] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', files);
        console.log(formData)
        console.log("isi form data: ", formData.get("file"));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label className='text-black text-2xl font-bold'>Masukan File</label>
                <input
                    onChange={(e) => setFiles(e.target.files[0])}
                    className='bg-gray-600 border rounded text-amber-50'
                    accept="image/png, image/jpeg, image/gif, image/webp, image/svg"
                    type="file"
                    name="file"
                />
                <button
                    className='bg-green-400 p-1 text-white rounded'
                >Submit</button>
            </form>
        </div>
    )
}


