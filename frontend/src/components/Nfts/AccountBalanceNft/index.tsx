import { Button, Typography, Box, Grid, Avatar, styled } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

export default function AccountBalanceNft({ balance }) {

  const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
          background-color: ${theme.colors.success.main};
          color: ${theme.palette.success.contrastText};
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
          box-shadow: ${theme.colors.shadows.success};
    `
  );

  return (
    <>
      <Grid item xs={12} md={6}>
        <Box p={4}>
          <Typography
            sx={{
              pb: 3
            }}
            variant="h4"
          >
            NFT Account Balance
          </Typography>
          <Box>
            <Typography variant="h1" gutterBottom>
              {balance}
            </Typography>
            <Typography
              variant="h4"
              fontWeight="normal"
              color="text.secondary"
            >
              1.0045983485234 BTC
            </Typography>
            <Box
              display="flex"
              sx={{
                py: 4
              }}
              alignItems="center"
            >
              <AvatarSuccess
                sx={{
                  mr: 2
                }}
                variant="rounded"
              >
                <TrendingUp fontSize="large" />
              </AvatarSuccess>
              <Box>
                <Typography variant="h4">+ $3,594.00</Typography>
                <Typography variant="subtitle2" noWrap>
                  this month
                </Typography>
              </Box>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid sm item>
              <Button fullWidth variant="outlined">
                Send
              </Button>
            </Grid>
            <Grid sm item>
              <Button fullWidth variant="contained">
                Receive
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}