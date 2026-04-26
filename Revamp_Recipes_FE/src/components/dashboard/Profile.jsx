import { Avatar, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { memo } from 'react';

const Profile = memo(({ avatar }) => {

    return (
        <Stack direction="row" spacing={0.5} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Avatar src={avatar ? avatar : ''}>
                    {!avatar && <PersonIcon />}
                </Avatar>
            </Stack>
        </Stack>
    )
})

export default Profile;
