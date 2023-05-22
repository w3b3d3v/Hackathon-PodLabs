import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAccount, useEnsName } from 'wagmi';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

function PageHeader() {
  const { data: accountData } = useAccount()
  const { data: ensNameData } = useEnsName({ address: accountData?.address })

  const user = {
    name: ensNameData ?? accountData?.address,
    avatar: '/static/images/avatars/1.jpg'
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          {...stringAvatar(ensNameData ? ensNameData : '0x '+ accountData?.address)}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Bem Vindo, {user.name}!
        </Typography>
        <Typography variant="subtitle2">
          Cheque suas atividades através do nosso portal!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
