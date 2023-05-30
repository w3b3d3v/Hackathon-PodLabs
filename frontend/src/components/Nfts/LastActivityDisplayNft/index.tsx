import {Card, CardActions, CardActionArea, CardContent, CardMedia, Button,Tooltip, Typography, Box, Grid, Avatar, styled, alpha} from '@mui/material';

export default function LastActivityDisplayNft( {lastToken}) {

    const handleButtonActivityDetails = () => {
      window.location.href = "/dapp/activity-details/"+lastToken.tokenId;
    };

    const handleButtonActivityEdit = () => {
      window.location.href = "/dapp/activity-settings/edit/"+lastToken.tokenId;
    };
    
    return(
      <>
        <Grid
          sx={{
            position: 'relative'
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box p={4} sx={{
                  width: '94%'
                }}>
            <Typography
              sx={{
                pb: 3
              }}
              variant="h4"
            >
              Last activity created
            </Typography>
            <Card >
              <CardMedia
                sx={{ height: 180 }}
                image={lastToken && lastToken.image}
                title="Web3Dev Blockchain"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {lastToken && lastToken.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lastToken && lastToken.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={handleButtonActivityEdit}>Edit</Button>
                <Button size="small" onClick={handleButtonActivityDetails}>Activity Details</Button>
              </CardActions>
            </Card>
          </Box>          
        </Grid>    
      </>
  
    );
  }