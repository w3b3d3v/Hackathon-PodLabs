import React, { useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

export function useIpfsUploader(){
  const [uploadFileResult, setUploadFileResult] = useState({});
  const [uploadJsonResult, setUploadJsonResult] = useState({});

  async function uploadToInfura(file: File): Promise<{ cid: { }, path: string, size: number }> {
    /* configure Infura auth settings */
    const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
    const projectSecret = process.env.REACT_APP_INFURA_API_KEY_SECRET;
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    /* Create an instance of the client */
    const clientIpfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      }
    });    
    const addResult = await clientIpfs.add(file); 
    return addResult;        
  }

  async function uploadFileToPinata(file: File): Promise<{ IpfsHash: { }, PinSize: number, Timestamp: string }> {
    /* configure pinata auth settings */
    const JWT = process.env.REACT_APP_PINATA_AUTH;
    console.log("JWT", JWT);
    const formData = new FormData();
    formData.append('file', file)
    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);
    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData}`,
          Authorization: JWT
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return null;        
  }

  async function uploadJsonToPinata(file: string, fileName: string): Promise<{ IpfsHash: { }, PinSize: number, Timestamp: string }> {
    /* configure pinata auth settings */
    const JWT = process.env.REACT_APP_PINATA_AUTH;
    console.log("JWT", JWT);

    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": fileName
      },
      "pinataContent": file
    });

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: JWT
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return null;        
  }

  async function downloadJsonFromPinata(tokenUri: string): Promise<any> 
  {
    /* configure pinata auth settings */
    const JWT = process.env.REACT_APP_PINATA_AUTH;
    try{
      var config = {
        method: 'get',
        url: tokenUri,
        headers: { 
          'Content-Type': 'application/json'
        }
      };
      
      const res = await axios(config);
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return null;        
  }

  async function downloadListFromPinata(): Promise<any> 
  {
    /* configure pinata auth settings */
    const JWT = process.env.REACT_APP_PINATA_AUTH;
    try{
      var config = {
        method: 'get',
        url: 'https://api.pinata.cloud/data/pinList?status=pinned',
        headers: { 
          'Authorization': JWT
        }
      };
      
      const res = await axios(config);
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return null;        
  }

  return { 
    uploadToInfura, 
    uploadFileToPinata, 
    uploadJsonToPinata,
    downloadJsonFromPinata, 
    downloadListFromPinata,
    uploadFileResult, 
    setUploadFileResult, 
    uploadJsonResult, 
    setUploadJsonResult 
  };
}
