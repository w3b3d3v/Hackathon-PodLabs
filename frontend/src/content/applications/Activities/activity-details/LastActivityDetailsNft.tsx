import {Card, CardContent, Typography, Box, Grid, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useShortenAddressOrEnsName } from 'src/utils/Web3Utils';

export default function LastActivityDetailsNft({ data }) {  

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
        children: `${name}`
      };
    }

    const { shortenAddressOrEnsName } = useShortenAddressOrEnsName();
    const shortenedAddressOrName = shortenAddressOrEnsName(); 
    const [sliceData, setSliceData] = useState([]);

    useEffect(() => {
        console.log("slicing data..")
        //const sData = [...data]; // spreading will return a new array
        setSliceData(data.slice(0,3));
        console.log("slice data (0,3) = ", sliceData);
      }, [])

    return(
      <>
        {        
        sliceData.map((nftData, index) => (
          <Grid xs={12} sm={6} md={3} item key={index}>
            <Card
              sx={{
                px: 1
              }}
            >
              <CardContent>
                <Avatar variant="rounded" {...stringAvatar(shortenedAddressOrName)} />
                <Typography variant="h5" noWrap>
                  {nftData.name}
                </Typography>
                <Typography variant="subtitle1" noWrap>
                {nftData.description}
                </Typography>
                <Box
                  sx={{
                    pt: 3
                  }}
                >
                  <Typography variant="h3" gutterBottom noWrap>
                    Bounty ${nftData.bounty}
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {nftData.status}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}     
    
      </>
    );
  }