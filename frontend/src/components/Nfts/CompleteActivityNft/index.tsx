import UserHeader from 'src/components/User/UserHeader';
import AlertDialog from 'src/components/Modal/AlertDialog'
import { useState } from 'react';
import ActivityDetailsNft from 'src/components/Nfts/ActivityDetailsNft'

// Alert Dialog Param
const textButton = 'Completar Atividade'
const textAlertDialog = 'Atividade Feita ?'
const textDialog = 'Tem certeza que deseja completar a atividade ?'

export default function CompleteActivityNft({ user, data, loading, tokenId }) {

  const [buttonState, setButtonState] = useState(false);

  function handleButtonClick() {
    setButtonState(true);
    // Chamar função
  }

  return (
    <>
      <UserHeader user={user}/>
      <AlertDialog textButton={textButton} textDialog={textDialog} textAlertDialog={textAlertDialog} handleButtonClick={handleButtonClick} buttonState={buttonState}/>
      <ActivityDetailsNft data={data} loading={loading} tokenId={tokenId}/>
    </>
  );
}
