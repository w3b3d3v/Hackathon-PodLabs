import { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { useDateFormatter } from 'src/utils/DateUtils';
import { useShortenAddressOrEnsName } from 'src/utils/Web3Utils';

function PageHeader() {
  const { shortenAddressOrEnsName } = useShortenAddressOrEnsName();
  
  const shortenedAddressOrName = shortenAddressOrEnsName();

  const user = {
    name: shortenedAddressOrName,
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3">
            Hello, {user.name}!
            <Typography variant="subtitle2">
            Today's a good day to manage your activities! 
            This is the management panel to mint, update or burn your activities.
            </Typography>      
          </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
