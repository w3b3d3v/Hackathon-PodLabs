import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Grid, Container, Tab, Tabs, styled } from '@mui/material';

import ProfileCover from './ProfileCover';

import RecentActivity from 'src/components/RecentActivity';
import UserProfile  from 'src/components/User/UserProfile';
import EditProfile from './EditProfile';
import { ChangeEvent, useState } from 'react';
import { useErc721Contract } from 'src/utils/Web3Erc721Utils';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserProfile() {
  const user = UserProfile();
  const [currentTab, setCurrentTab] = useState<string>('user-profile');
  const { data, loading } = useErc721Contract();

  const tabs = [
    { value: 'user-profile', label: 'Profile' },
    { value: 'user-profile-edit', label: 'Edit Profile' }
  ];  
  
  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };
  
  return (
    <>
      <Helmet>
        <title>Web3Dev User Profile</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {currentTab === 'user-profile' && <ProfileCover user={user} /> }
            {currentTab === 'user-profile-edit' && <EditProfile user={user}/>}
          </Grid>
          <Grid item xs={12} md={4}>
            {currentTab === 'user-profile' && <RecentActivity data={data} />}
          </Grid>

        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
