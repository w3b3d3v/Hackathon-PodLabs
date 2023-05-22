import { forwardRef, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { useContractEvent, useContract , useSigner } from 'wagmi';
import NftERC721Artifact from "src/contracts/NftERC721.json";
import contractAddress from "src/contracts/contract-nfterc721-address.json";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { da } from 'date-fns/locale';
import WatchListRow from './content/dashboards/Crypto/WatchListRow';


const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const content = useRoutes(router);
  const { data: signer, isError, isLoading } = useSigner();
  const contractReadConfig = {
    addressOrName: contractAddress.NftERC721,
    contractInterface: NftERC721Artifact.abi,
  }
  const contractConfig = {
    ...contractReadConfig,
    signerOrProvider: signer,
  };
  const contract = useContract(contractConfig);

  
  // const onNftMinted = (data) => {
  //   console.log("Evento de mint!")
  //   console.log("data", data)
  //   if (data) 
  //     setOpenSuccess(true) 
  //   else
  //     setOpenError(true);
  // }
  // const mintEvent = contract.NftMinted;
  // mintEvent.watch(onNftMinted);
  // useContractEvent(contractReadConfig, 'NftMinted',
  //    (data) => console.log("data", data),
  //    {once: true},
  // )

  
  const handleCloseSnackSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseSnackError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
  };

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSnackSuccess}>
          <Alert onClose={handleCloseSnackSuccess} severity="success" sx={{ width: '100%' }}>
            Nft minted with sucess!
          </Alert>
        </Snackbar>
        <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseSnackError}>
          <Alert onClose={handleCloseSnackError} severity="error" sx={{ width: '100%' }}>
            Nft not minted! Try again!
          </Alert>
        </Snackbar>
        {content}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
