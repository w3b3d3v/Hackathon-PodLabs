import React from 'react';
import ActivityModal from './ActivityModal.js';
import RuleModal from './RuleModal.js';

const onActivityCreated = async () => {
  onActivityCreated();
};

const ActionsView = ({ onActivityCreated }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <ActivityModal onActivityCreated={onActivityCreated}/>
      <RuleModal />
    </div>
  );
};

export default ActionsView;
