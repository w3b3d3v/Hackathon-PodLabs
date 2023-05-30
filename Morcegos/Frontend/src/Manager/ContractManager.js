import { ethers } from "ethers";
import myContract from '../utils/Contract.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const abi = myContract.abi;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

export const assignActivity = async (activityId) => {
  try {
    const tx = await contract.assignActivity(activityId);
    const receipt = await tx.wait();
    console.log("Atividade atribuída com sucesso.");
    return receipt;
  } catch (err) {
    console.error("Erro ao atribuir atividade:", err);
  }
};

export const completeActivity = async (activityId, assignedTo) => {
  try {
    const tx = await contract.completeActivity(activityId);
    await tx.wait();
    console.log("Atividade concluída com sucesso.");
  } catch (err) {
    console.error("Erro ao concluir atividade:", err);
  }
};

export const approveActivity = async (activityId, assignedTo) => {
  try {
    const tx = await contract.approveActivity(activityId);
    await tx.wait();
    console.log("Atividade aprovada com sucesso.");
  } catch (err) {
    console.error("Erro ao aprovar atividade:", err);
  }
};

export const deleteActivity = async (activityId, assignedTo) => {
  try {
    const tx = await contract.deleteActivity(activityId);
    await tx.wait();
    console.log("Atividade deletada com sucesso.");
  } catch (err) {
    console.error("Erro ao deletar atividade:", err);
  }
};

export const rejectActivity = async (activityId, assignedTo) => {
  try {
    const tx = await contract.rejectActivity(activityId);
    await tx.wait();
    console.log("Atividade rejeitada com sucesso.");
  } catch (err) {
    console.error("Erro ao rejeitar atividade:", err);
  }
};

export const createActivity = async (title, description, reward, requiredApprovals, tokenURI, onSuccess, onError) => {
  try {
    const value = ethers.utils.parseUnits(reward, "ether");
    let tx = await contract.createActivity(title, description, reward, requiredApprovals, tokenURI, { value });
    await tx.wait();
    console.log("Atividade criada com sucesso.");
    onSuccess();
  } catch (err) {
    console.error("Erro ao criar atividade:", err);
    onError();
  }
};

export const getTokenUri = async (tokenId) => {
  try {
    let tx = await contract.tokenURI(tokenId);
    console.log(tx);
    console.log("TokenUri sucesso");
    return tx
  } catch (err) {
    console.error("TokenUri error ->", err);
  }
};

export const grantRole = async (role, account) => {
  try {
    let tx = await contract.grantRole(role, account);
    console.log(tx);
    console.log("grantRole sucesso");
    return tx
  } catch (err) {
    console.error("grantRole error ->", err);
  }
};