import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = ({ isWalletConnected, setIsWalletConnected, currentAccount, setCurrentAccount, userRole }) => {
    const handleConnectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert('Baixe a MetaMask!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });

            console.log('Conectado', accounts[0]);
            setCurrentAccount(accounts[0]);
            setIsWalletConnected(true);
        } catch (error) {
            setIsWalletConnected(false);
        }
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="div" flexGrow={1}></Typography>
                <Box>
                    {!isWalletConnected ? (
                        <Button variant="outlined" color="primary" onClick={handleConnectWallet}>
                            Conectar Carteira
                        </Button>
                    ) : (
                        <Typography>Carteira Conectada {currentAccount}</Typography>
                    )}
                    {userRole && (
                        <Typography variant="subtitle1">Rule: {userRole}</Typography>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;