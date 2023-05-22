import {
    Box,
    Typography,
    Card,
    CardHeader,
    Divider,
    Avatar,
    useTheme,
    styled,
    CardMedia,
    CardContent,
    Grid,
  } from '@mui/material';
  
import { Key, ReactChild, ReactFragment, ReactPortal } from 'react';
  
  const AvatarPrimary = styled(Avatar)(
    ({ theme }) => `
        background: ${theme.colors.primary.lighter};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(7)};
        height: ${theme.spacing(7)};
  `
  );
  
  function ActivityExpansiveDescriptionDetailsNft({data}) {
    const theme = useTheme();
  
    return (
      <>
          {data.map((nftData: { bounty: number; image: string; name: boolean | ReactChild | ReactFragment | ReactPortal; description: boolean | ReactChild | ReactFragment | ReactPortal; }, index: Key) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
              <Card sx={{ml: 4}}>
              <CardHeader title={nftData.name} />
              <Divider />
              <Box px={2} py={4} display="flex" alignItems="flex-start">
                <Box pl={2} flex={1}>
                  <Typography variant="h3">Activity Description</Typography>
        
                  <Box pt={2} display="flex">
                    <Box pr={8}>
                      <Typography
                        gutterBottom
                        variant="caption"
                        sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                      >
                        Details
                      </Typography>
                      <Typography variant="h2">{nftData.description}</Typography>
                    </Box>
        
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box px={2} py={4} display="flex" alignItems="flex-start">
      
        
                <Box pl={2} flex={1}>
                  <Typography variant="h3">Activity Bounty</Typography>
        
                  <Box pt={2} display="flex">
                    <Box pr={8}>
                      <Typography
                        gutterBottom
                        variant="caption"
                        sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                      >
                        Total
                      </Typography>
                      <Typography variant="h2">${nftData.bounty}</Typography>
                    </Box>
        
                  </Box>
                </Box>
              </Box>
        
              <Divider />
              </Card>

            </Grid>
          ))}        
    </>
    );
  }
  
  export default ActivityExpansiveDescriptionDetailsNft;
  