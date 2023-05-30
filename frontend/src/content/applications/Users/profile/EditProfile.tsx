import {
    Grid,
    Card,
    Box,
    Button,
    Avatar,
    IconButton,
    CardMedia
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
  import { useState } from 'react';
import UserEditPersonalDetails from 'src/components/User/UserEditPersonalDetails';
  
  function EditProfileTab({ user: UserProfile }) {

    const [cover, setCover] = useState(UserProfile.coverImg);
    const [avatar, setAvatar] = useState(UserProfile.avatar);

    const Input = styled('input')({
        display: 'none'
      });

    const AvatarWrapper = styled(Card)(
        ({ theme }) => `
      
          position: relative;
          overflow: visible;
          display: inline-block;
          margin-top: -${theme.spacing(9)};
          margin-left: ${theme.spacing(2)};
      
          .MuiAvatar-root {
            width: ${theme.spacing(16)};
            height: ${theme.spacing(16)};
          }
      `
      );
      
    const ButtonUploadWrapper = styled(Box)(
        ({ theme }) => `
          position: absolute;
          width: ${theme.spacing(4)};
          height: ${theme.spacing(4)};
          bottom: -${theme.spacing(1)};
          right: -${theme.spacing(1)};
      
          .MuiIconButton-root {
            border-radius: 100%;
            background: ${theme.colors.primary.main};
            color: ${theme.palette.primary.contrastText};
            box-shadow: ${theme.colors.shadows.primary};
            width: ${theme.spacing(4)};
            height: ${theme.spacing(4)};
            padding: 0;
        
            &:hover {
              background: ${theme.colors.primary.dark};
            }
          }
      `
      );
      
    const handleChangeCover = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
            setCover(reader.result);
        };
        
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleChangeAvatar = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setAvatar(reader.result);
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    }
    
    const CardCover = styled(Card)(
        ({ theme }) => `
            position: relative;
        
            .MuiCardMedia-root {
            height: ${theme.spacing(26)};
            }
        `
    );
    
    const CardCoverAction = styled(Box)(
        ({ theme }) => `
            position: absolute;
            right: ${theme.spacing(2)};
            bottom: ${theme.spacing(2)};
        `
    );
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
      <CardCover>
        <CardMedia image={cover} />
        <CardCoverAction>
          <Input accept="image/*" id="change-cover" multiple type="file" onChange={handleChangeCover}/>
          <label htmlFor="change-cover">
            <Button
              startIcon={<UploadTwoToneIcon />}
              variant="contained"
              component="span"
              onChange={handleChangeCover}
            >
              Modificar papel de parede
            </Button>
          </label>
        </CardCoverAction>
      </CardCover>
      <AvatarWrapper>
        <Avatar variant="rounded" alt={UserProfile.name} src={avatar} />
        <ButtonUploadWrapper>
          <Input
            accept="image/*"
            id="icon-button-file"
            name="icon-button-file"
            type="file"
            onChange={handleChangeAvatar}
          />
          <label htmlFor="icon-button-file">
            <IconButton component="span" color="primary">
              <UploadTwoToneIcon />
            </IconButton>
          </label>
        </ButtonUploadWrapper>
      </AvatarWrapper>
      </Grid>
        <UserEditPersonalDetails user={UserProfile} /> 
      </Grid>
    );
  }
  
  export default EditProfileTab;
  