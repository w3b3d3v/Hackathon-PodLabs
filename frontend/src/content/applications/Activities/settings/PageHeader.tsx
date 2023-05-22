import { Typography, Grid } from '@mui/material';
import { useShortenAddressOrEnsName } from 'src/utils/Web3Utils';

function PageHeader() {
  const { shortenAddressOrEnsName } = useShortenAddressOrEnsName();
  const shortenedAddress = shortenAddressOrEnsName();

  const user = {
    name: shortenedAddress,
    avatar: '/static/images/avatars/1.jpg'
  };


  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
      <Typography variant="h3" component="h3">
            Hello, {user.name}!
            <Typography variant="subtitle2">
            Today's a good day to create a new activity! 
            This is the wizard panel to create and mint your activities.
            </Typography>      
          </Typography>
      </Grid>      
    </Grid>
  );
}

export default PageHeader;
