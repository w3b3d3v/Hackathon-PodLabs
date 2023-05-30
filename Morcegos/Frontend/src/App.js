import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { ethers } from 'ethers';
import myEpicNft from './utils/Contract.json';
import NFTListing from './components/NFTListing';
import FilterPanel from './components/FilterPanel';
import Navbar from './components/Navbar';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [userRole, setUserRole] = useState(null);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Certifique-se que você tem a MetaMask instalada!a');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
      setIsWalletConnected(true);
      checkUserRole(accounts[0]);
    } else {
      console.log('No authorized account found');
    }
  };

  const checkUserRole = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        const isLeader = await connectedContract.hasRole(connectedContract.LEADER_ROLE(), address);
        const isMember = await connectedContract.hasRole(connectedContract.MEMBER_ROLE(), address);
  
        if (isLeader) {
          setUserRole('Leader');
        } else if (isMember) {
          setUserRole('Member');
        } else {
          setUserRole('Visitor');
        }
      } else {
        console.log('Objeto ethereum não existe!');
      }
    } catch (error) {
      console.error('Erro ao verificar a role do usuário', error);
    }
  };

  const checkChain = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Certifique-se que você tem a MetaMask instalada!');
      return;
    }
  };

  const fetchActivities = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        const currentTokenId = await connectedContract.getTokenCount();
        const activitiesList = [];
        if (currentTokenId.toNumber() > 0) {
          for (let i = 1; i <= currentTokenId.toNumber(); i++) {
            if ((await connectedContract.activities(i)).status !== 5) {
              activitiesList.push(await connectedContract.activities(i));
            }
          }
          setActivities(activitiesList);
        }

      } else {
        console.log('Objeto ethereum não existe!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAccounts = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    setAccounts(accounts);
  };

  useEffect(() => {
    fetchAccounts();
    checkChain();
    checkIfWalletIsConnected();
    fetchActivities();
  }, []);

  return (
    <div className="App">
      <Navbar isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} userRole={userRole}/>
      <div className="container">
      <div className="header-container">
          <p className="header gradient-text">Web3Dev Marketplace</p>
      </div>
      <FilterPanel />
      <NFTListing nfts={activities} isWalletConnected={isWalletConnected} userRole={userRole} currentAccount={currentAccount} refreshList={fetchActivities} />
        <div>
      <ul>
<div>

</div>
      </ul>
        </div>
        <div className="footer-container">
          <a className="sub-text">Feito por Gustavo Boehm</a>
        </div>
      </div>
    </div>
  );
};
export default App;