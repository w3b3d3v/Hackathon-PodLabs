import { Card, Grid } from '@mui/material';
import AccountBalanceNft from 'src/components/Nfts/AccountBalanceNft';
import LastActivityDisplayNft from 'src/components/Nfts/LastActivityDisplayNft';

const AccountBalance = ({ lastToken, balance }) => {
  
  return (
    <Card>
      <Grid spacing={0} container>
        <AccountBalanceNft balance={balance}/>
        <LastActivityDisplayNft lastToken={lastToken}/>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
