import { Box, Container, styled} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import MediaNft from 'src/components/Nfts/MediaNft';
import { useContractLoadNfts } from 'src/utils/Web3Erc721Utils';
import { NftOrder } from 'src/models/nft_order';
import Footer from 'src/components/Footer';
import { useEffect, useState } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Overview() {
 
  const { loading, setLoading, loadNfts, quantity } = useContractLoadNfts();
  const [ data, setData ] = useState<NftOrder[]>(null);

  const OverviewWrapper = styled(Box)(
    () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
          `
  );

  useEffect(() => {        
    setLoading(true);  
    loadNfts().then(result => {
      console.log("result", result)
      setTimeout(()=>{
        setData(result);
        setLoading(false);  
        console.log("data", data)
      },2000)        
      
    })                     
  },[])


  useEffect(() =>{
    //if (data) console.log("data.length", data.length)
    console.log("loading", loading)
    console.log("quantity", quantity)
  }, [data, loading ])


  return (
    <OverviewWrapper>
      <Helmet>
        <title>Web3Dev Marketplace</title>
      </Helmet>
      <Container maxWidth="lg">
      {
        loading ? <SuspenseLoader />
          :
          (
        <MediaNft data={data}/>        
          )
      }               
      </Container>
      <Footer />
    </OverviewWrapper>
  );
}

export default Overview;
