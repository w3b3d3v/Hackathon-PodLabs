import React from 'react';
import { assignActivity, completeActivity, approveActivity, rejectActivity, deleteActivity, getTokenUri } from ".././Manager/ContractManager.js";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button
} from '@mui/material';
import ActionsView from './ActionsView.js';

const NFTListing = ({ nfts, isWalletConnected, userRole, currentAccount, refreshList }) => {

  const getStatusString = (statusNumber) => {
    const statusStrings = [
      'Disponível',
      'Em progresso',
      'Aguardando aprovação',
      'Concluída',
      'Recusada',
      'Deletada',
    ];
    return statusStrings[statusNumber];
  };

  const getBgColor = (statusNumber) => {
    const statusStrings = [
      'green',
      '#1565c0',
      '#F5CB0C',
      '#760CF5',
      '#F5210C',
      '#484849',
    ];
    return statusStrings[statusNumber];
  };

  const handleRefreshList = () => {
    refreshList();
  };

  return (
    <Container>
      {(isWalletConnected && (userRole === 'Leader')) && (
      <ActionsView onActivityCreated={handleRefreshList}/>
      )}
      <Typography variant="h4" component="h1" align="center" gutterBottom></Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {nfts.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Box bgcolor={getBgColor(item.status)} color="white" p={1}>
            <Typography variant="subtitle2">{getStatusString(item.status)}</Typography>
            </Box>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image="https://web3dev-forem-production.s3.amazonaws.com/uploads/articles/7k2zs82e2adicadayuuy.png"
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Descrição: {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.reward ? `Recompensa: ${
                     item.reward.toString()
                    } ETH` : 'Recompensa: Indisponível'}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
  {item.assignedTo.toString() !== '0x0000000000000000000000000000000000000000' ? 'Responsável: ' + item.assignedTo.toString().slice(0, 5) + '...' + item.assignedTo.toString().slice(-4) : ''}
</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.assignedTo.toString() !== 'Aprovações necessárias: 0/' ?  'Aprovações necessárias: ' + item.approvalsReceived.toString() + '/' + item.requiredApprovals.toString() : ''}
                </Typography>
                        {(isWalletConnected && (userRole === 'Member')) && item.status == 0 && (
                            <Box mt={2}>
                                <Button variant="contained" fullWidth onClick={async () => {
                                    await assignActivity(item.id);
                                    handleRefreshList();
                                }}>Executar Tarefa</Button>
                            </Box>
                        )}
                        {(isWalletConnected && (userRole === 'Member')) && item.assignedTo.toString().toLowerCase() == currentAccount && item.status == 1 && (
                            <Box mt={2}>
                                <Button variant="contained" fullWidth onClick={async () => {
                                    completeActivity(item.id, currentAccount);
                                    handleRefreshList();
                                    }}>Completar Tarefa</Button>
                            </Box>
                        )}
                        {(isWalletConnected && (userRole === 'Leader')) && item.status == 2 && (
                            <Box mt={2}>
                                <Button variant="contained" fullWidth onClick={async () => {
                                    await approveActivity(item.id, currentAccount);
                                    handleRefreshList();
                                    }}>Aprovar Tarefa</Button>
                            </Box>
                        )}
                        {(isWalletConnected && (userRole === 'Leader')) && item.status == 2 && (
                            <Box mt={2}>
                                <Button variant="contained" fullWidth onClick={async () => {
                                    await rejectActivity(item.id, currentAccount);
                                    handleRefreshList();
                                }}>Rejeitar Tarefa</Button>
                            </Box>
                        )}
                        {(isWalletConnected && (userRole === 'Leader')) && item.status == 0 && (
                            <Box mt={2}>
                                <Button variant="contained" fullWidth onClick={async () => {
                                    await deleteActivity(item.id, currentAccount);
                                    handleRefreshList();
                                }}>Excluir Tarefa</Button>
                            </Box>
                        )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NFTListing;
