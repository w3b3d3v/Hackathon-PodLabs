import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Grid } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import DetailsDescriptionNft from 'src/content/applications/Activities/activity-details/DetailsDescriptionNft';
import { styled } from '@mui/material/styles';

const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
);

export default function ActivityDetailsNft({ data, loading, tokenId}) {


  return (
    <>
      {console.log('STATUS LOADING MEDIA NFT INITIAL = ', loading)}
      {console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = ', data)}

     
        <Box
          sx={{
            marginTop: 4,
            width: 1,
          }}>
          <Grid container spacing={10}>
              <Grid item xs={12} >
                <Card sx={{ maxWidth: 1, height: 1}}>
                  <Grid spacing={0} container>

                    <Card sx={{ maxWidth: 1035 }}>
                    {data && data.image && (
                      <><CardMedia
                        sx={{ height: 420, width: 500 }}
                        image={data.image}
                        title="Web3Dev Blockchain" /><CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {data.name}
                          </Typography>
                        </CardContent></>
                      )}

                    </Card>
                    <DetailsDescriptionNft data={data} loading={loading} tokenId={tokenId} />

                  </Grid>
                  <CardActionsWrapper
                    sx={{
                      display: { xs: 'block', md: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >        
                    <Box>              
                    </Box>
                    <Box sx={{ mt: { xs: 2, md: 0 } }}>
                      <Button type="submit" variant="contained">
                        Buy Activity
                      </Button>
                    </Box>
                  </CardActionsWrapper>
                </Card>
              </Grid>
          </Grid>
        </Box>
     
    </>
  );
}