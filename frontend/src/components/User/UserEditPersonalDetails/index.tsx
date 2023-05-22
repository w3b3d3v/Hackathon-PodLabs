import {
    Grid,
    Typography,
    CardContent,
    Card,
    Box,
    Divider,
    Button,
    TextField,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useState } from 'react';

// TO DO = Linkar com o UserProfile()
export default function UserEditPersonalDetails({ user: UserProfile }) {

    const [edit, setEdit] = useState(false);
    const [description, setDescription] = useState(UserProfile.description);
    const [editedUserProfile, setEditedUserProfile] = useState(UserProfile);


    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUserProfile({
            ...editedUserProfile,
            description: event.target.value
        });
        setDescription(event.target.value);
        console.log('editado user profile description = ', editedUserProfile.description)
    };

    const handleChangeEdit = (event: any) => {
        setEdit(true);
    }

    const handleSave = () => {
        setEdit(false);
        setEditedUserProfile({
            ...editedUserProfile,
            description: editedUserProfile.description
        });
        setDescription(editedUserProfile.description);

        console.log('Valor editado = ', editedUserProfile);
        console.log('description,', editedUserProfile.description)
    };

    function UserProfileSection(props: { label: string; value: string; xs: any; sm: any; md: any; textAlign: any; }) {
        const { label, value, xs, sm, md, textAlign } = props;

        return (
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={xs} sm={sm} md={md} textAlign={textAlign}>
                    <Box pr={2} py={1}>
                        <Typography variant="body1" color="textSecondary">{label}:</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12 - xs} sm={12 - sm} md={12 - md}>
                    <Box pr={2} py={1}>
                        <Typography variant="body1" color="textPrimary">{value}</Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }


    return (
        <Grid item xs={12}>
            <Card>
                <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Personal Details
                        </Typography>
                        <Typography variant="subtitle2">
                            Manage informations related to your personal details
                        </Typography>
                    </Box>
                    <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={handleChangeEdit}>
                        Edit
                    </Button>
                </Box>
                <Divider />
                <CardContent sx={{ p: 4 }}>
                    {edit ? (
                        <>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={editedUserProfile.description}
                                onChange={handleEditChange}
                            />

                            <Button variant="contained" color="primary" onClick={handleSave}>Salvar</Button>
                        </>
                    ) : (
                        <Typography variant="subtitle2">
                            {console.log('EdituserProfil no false nao', editedUserProfile)}

                            <UserProfileSection label="Nome" value={editedUserProfile.name} xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} />
                            <UserProfileSection label="Description" value={editedUserProfile.description} xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} />
                            <UserProfileSection label="Job Title" value={editedUserProfile.jobTitle} xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} />
                            <UserProfileSection label="Location" value={editedUserProfile.location} xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} />
                            <UserProfileSection label="Social" value={editedUserProfile.social} xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} />
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    )
}