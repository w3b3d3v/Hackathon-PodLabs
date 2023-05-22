
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

export default function UserHeader({ user }) {

  const handleButtonHome = () => {
    window.location.href = "/dapp/#";
  };

  return (
    <>
      <Box display="flex" mb={3}>
        <Tooltip arrow placement="top" title="Go back">
          <IconButton color="primary" sx={{ p: 2, mr: 2 }} onClick={handleButtonHome}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            Atividades de {user.name}
          </Typography>
          <Typography variant="subtitle2">
            Cheque suas atividades e as conclua
          </Typography>
        </Box>
      </Box>
    </>
  );
}
