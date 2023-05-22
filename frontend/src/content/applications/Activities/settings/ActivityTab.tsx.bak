import { useState } from 'react';
import {
  Box,
  TextField,
  CardMedia,
  Typography,
  Card,
  CardHeader,
  Divider,
  Avatar,
  IconButton,
  Button,
  CardActions,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import Text from 'src/components/Text';

const Input = styled('input')({
  display: 'none'
});
const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
);

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(48)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

function ActivityTab() {
  const [currency, setCurrency] = useState('EUR');

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src="/static/images/avatars/5.jpg" />}
        action={
          <IconButton color="primary">
            <MoreHorizTwoToneIcon fontSize="medium" />
          </IconButton>
        }
        titleTypographyProps={{ variant: 'h4' }}
        subheaderTypographyProps={{ variant: 'subtitle2' }}
        title="Allison Lipshutz"
        subheader={
          <>
            Managing Partner,{' '}
            <Link href="#" underline="hover">
              #software
            </Link>
            ,{' '}
            <Link href="#" underline="hover">
              #managers
            </Link>
            , Google Inc.
          </>
        }
      />
      <Box px={3} pb={2}>
        <Typography variant="h4" fontWeight="normal">
          Welcome to organizing your remote office for maximum productivity.
        </Typography>
      </Box>
      <CardCover sx={{ mx: 24 }}>
        <CardMedia
          sx={{ minHeight: 280 }}
          image="/static/images/placeholders/covers/5.jpg"
          title="Activity NFT"
        />      
        <CardCoverAction>
          <Input accept="image/*" id="change-cover" multiple type="file" />
          <label htmlFor="change-cover">
            <Button
              startIcon={<UploadTwoToneIcon />}
              variant="contained"
              component="span"
            >
              Change image
            </Button>
          </label>
        </CardCoverAction>
      </CardCover>      
      <Box p={3}>
        <Typography variant="h2" sx={{ pb: 1 }}>
          Organizing Your Remote Office for Maximum Productivity
        </Typography>
        <Typography variant="subtitle2">
          <Link href="#" underline="hover">
            example.com
          </Link>{' '}
          • 4 mins read
        </Typography>
      </Box>
      <Divider />
      <CardActionsWrapper
        sx={{
          display: { xs: 12, md: 3 },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <TextField 
            required
            id="outlined-required"
            label="Required"
            defaultValue="Hello World"
          />
          <TextField
            id="outlined-select-currency-native"
            select
            label="Native select"
            value={currency}
            onChange={handleChange}
            SelectProps={{
              native: true
            }}
            helperText="Please select your currency"
            sx={{ mx: 2 }}
          >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          </TextField>
          <TextField 
            id="outlined-required"
            label="Required"
            defaultValue="Hello World"
            sx={{ mx: 2 }}
          />
          <TextField
            required
            id="outlined-required"
            label="Required"
            defaultValue="Hello World"
          />
        </Box>
      </CardActionsWrapper>
      <CardActionsWrapper
        sx={{
          display: { xs: 'block', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >        
        <Box>
          <Button startIcon={<ThumbUpAltTwoToneIcon />} variant="contained">
            Like
          </Button>
          <Button
            startIcon={<CommentTwoToneIcon />}
            variant="outlined"
            sx={{ mx: 2 }}
          >
            Comment
          </Button>
          <Button startIcon={<ShareTwoToneIcon />} variant="outlined">
            Share
          </Button>
        </Box>
        <Box sx={{ mt: { xs: 2, md: 0 } }}>
          <Typography variant="subtitle2" component="span">
            <Text color="black">
              <b>485</b>
            </Text>{' '}
            reactions •{' '}
            <Text color="black">
              <b>63</b>
            </Text>{' '}
            comments
          </Typography>
        </Box>
      </CardActionsWrapper>
    </Card>
  );
}

export default ActivityTab;
