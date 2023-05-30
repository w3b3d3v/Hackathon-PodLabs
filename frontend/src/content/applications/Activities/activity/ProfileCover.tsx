import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  Tooltip,
  Avatar,
  CardMedia,
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import UserHeader from 'src/components/User/UserHeader';

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(48)};      
    }
`
);

const ProfileCover = ({ user }) => {
  return (
    <> 
      <UserHeader user={user}/>
      <CardCover sx={{ mx: 24 }}>
        <CardMedia image={user.coverImg} />
      </CardCover>      
      <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          {user.name}
        </Typography>
        <Typography variant="subtitle2">{user.description}</Typography>
        <Typography sx={{ py: 2 }} variant="subtitle2" color="text.primary">
          {user.jobTitle} | {user.location} |
        </Typography>
        <Box>
              <IconButton>
                <GitHubIcon/>
              </IconButton>

            <IconButton>
              <InstagramIcon/>
            </IconButton>

            <IconButton color="primary" sx={{ p: 0.5 }}>
              <MoreHorizTwoToneIcon />
            </IconButton>
          </Box>
      </Box>
    </>
  );
};

ProfileCover.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default ProfileCover;
