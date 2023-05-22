import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Grid } from '@mui/material';
import { Key, ReactChild, ReactFragment, ReactPortal } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import ActivityExpansiveDescriptionDetailsNft from '../ActivityExpansiveDescriptionDetailsNft';

export default function ActivityExpansiveDetailsNft({ data, loading }) {

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
            {data.map((data: any, index: Key) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ maxWidth: 1, height: 1}}>
                  <Grid spacing={0} container>

                    <Card sx={{ maxWidth: 1035 }}>
                      <CardMedia
                        sx={{ height: 420, width: 500 }}
                        image={data.image}
                        title="Web3Dev Blockchain"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {data.name}
                        </Typography>
                      </CardContent>
                    </Card>
                    <ActivityExpansiveDescriptionDetailsNft data={[data]} />

                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
    </>
  );
}