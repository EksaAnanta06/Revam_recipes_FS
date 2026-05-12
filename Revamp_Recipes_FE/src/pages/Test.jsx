import { useState } from 'react'

export const Test = () => {
    let [images, setImages] = useState({
        gambar1: null,
        gambar2: null,
        gambar3: null
    })

    const handleChange = (e) => {
        const { name, files } = e.target;
       
        setImages(prev => ({
            ...prev, 
            [name]: files[0]
        }));

        console.log(images)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <form className='flex flex-col justify-center w-max ml-4 mt-4' onSubmit={handleSubmit}>
                <label >masukan gambar 1</label>
                <input onChange={handleChange} type="file" name="gambar1" className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <label >masukan gambar 2</label>
                <input onChange={handleChange} type="file" name="gambar2" className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <label >masukan gambar 3</label>
                <input onChange={handleChange} type="file" name="gambar3" className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button className='w-max border rounded p-2 mt-2 bg-blue-500 text-white'>kirim</button>
            </form>
        </>
    )
}

