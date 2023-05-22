import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import { NftOrder, NftStatus } from 'src/models/nft_order';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';

interface RecenNftsTableProps {
  className?: string;
  nfts: NftOrder[];
}

interface Filters {
  status?: NftStatus;
}

const getStatusLabel = (nftStatus: NftStatus): JSX.Element => {
  const map = {
    failed: {
      text: 'Burned',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[nftStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  nfts: NftOrder[],
  filters: Filters
): NftOrder[] => {
  return nfts.filter((nft) => {
    let matches = true;

    if (filters.status && nft.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  nfts: NftOrder[],
  page: number,
  limit: number
): NftOrder[] => {
  return nfts.slice(page * limit, page * limit + limit);
};

const ActivitiesTable: FC<RecenNftsTableProps> = ({ nfts }) => {
  const [selectedNfts, setSelectedNfts] = useState<number[]>(
    []
  );
  const selectedBulkActions = selectedNfts.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];


  const handleOnClickEditActivity = (event, tokenId) => {
    window.location.href = "/dapp/activity-settings/edit/"+tokenId;
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllNfts = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {   
    setSelectedNfts(
      event.target.checked
        ? nfts.map((nft) => nft.tokenId)
        : []
    );
  };

  const handleSelectOneNft = (
    event: ChangeEvent<HTMLInputElement>,
    tokenId: number
  ): void => {
    if (!selectedNfts.includes(tokenId)) {
      setSelectedNfts((prevSelected) => [
        ...prevSelected,
        tokenId
      ]);
    } else {
      setSelectedNfts((prevSelected) =>
        prevSelected.filter((id) => id !== tokenId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredNfts = applyFilters(nfts, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredNfts,
    page,
    limit
  );
  const selectedSomeNfts = selectedNfts.length > 0 && selectedNfts.length < nfts.length;
  const selectedAllNfts = selectedNfts.length === nfts.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Activities"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllNfts}
                  indeterminate={selectedSomeNfts}
                  onChange={handleSelectAllNfts}
                />
              </TableCell>
              <TableCell>Activity Title/Expire Date</TableCell>
              <TableCell>Activity Token</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell align="right">Reward</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((nft) => {
              const isNftSelected = selectedNfts.includes(
                nft.tokenId
              );
              return (
                <TableRow
                  hover
                  key={nft.tokenId}
                  selected={isNftSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isNftSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneNft(event, nft.tokenId)
                      }
                      value={isNftSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {nft.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {
                      //format(nft.orderDate, 'MMMM dd yyyy')
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {/* {
                      nft.orderID
                      } */}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {nft.creatorActivity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {numeral(nft.bounty).format(
                        `${"$"}0,0.00`
                      )}                      
                    </Typography>                    
                  </TableCell>
                  <TableCell align="right">
                    {/* {getStatusLabel(nft.status)} */}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Activity" arrow>
                      <IconButton onClick={(event) =>
                          handleOnClickEditActivity(event, nft.tokenId)
                        }
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Activity" arrow>
                      <IconButton 
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={handleSelectOneNft.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

ActivitiesTable.propTypes = {
  nfts: PropTypes.array.isRequired
};

ActivitiesTable.defaultProps = {
  nfts: []
};

export default ActivitiesTable;
