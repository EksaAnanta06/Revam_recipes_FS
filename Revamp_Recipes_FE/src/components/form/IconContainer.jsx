import { LockOutlined } from '@mui/icons-material'
const IconContainer = () => {
    return (
        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <LockOutlined className="text-white" sx={{ fontSize: 40 }} />
            </div>
        </div>
    )
}

export default IconContainer