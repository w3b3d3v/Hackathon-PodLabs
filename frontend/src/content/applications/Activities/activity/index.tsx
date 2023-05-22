import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Grid, Container } from '@mui/material';
import UserProfile  from 'src/components/User/UserProfile';
import { useContractLoadTokenId } from 'src/utils/Web3Erc721Utils';
import CompleteActivityNft from 'src/components/Nfts/CompleteActivityNft';
import { useParams } from 'react-router';
import { useEffect } from 'react';

function ManagementActivity() {
  const { data, loading, setLoading, loadNft } = useContractLoadTokenId();
  const user = UserProfile();
  const { tokenId } = useParams(); // TO DO Pegar TokenID do contrato e setar direto no useErc721Contract() como activityOwner
  
  async function loadData() {
    setLoading(true);
    loadNft(tokenId);
    setLoading(false);
  }

  useEffect(() => {
    if (!loading){
      if (data == null)
        loadData();
    }
   
  })

  return (
    <>
      <Helmet>
        <title>Activity Details - Member</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >

          <Grid item xs={12} md={12}>
            <CompleteActivityNft user={user} data={data} loading={loading} tokenId={tokenId} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementActivity;
