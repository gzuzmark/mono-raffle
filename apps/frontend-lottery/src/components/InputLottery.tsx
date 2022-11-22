// have a function to enter the lottery
import { useWeb3Contract, useMoralis, useMoralisQuery } from 'react-moralis';
import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber, ethers, ContractTransaction } from 'ethers';
import { useNotification } from '@web3uikit/core';
import { Bell } from '@web3uikit/icons';
import { abi, contractAddresses } from '../constants';

interface contractAddressesInterface {
  [key: string]: string[];
}

export default function LotteryEntrance() {
  const addresses: contractAddressesInterface = contractAddresses;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId: string = parseInt(chainIdHex).toString();
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState('0');
  const [numPlayers, setNumPlayers] = useState('0');
  const [recentWinner, setRecentWinner] = useState('0');

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: 'getEntranceFee',
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: 'getRecentWinner',
    params: {},
  });

  const { runContractFunction: performUpkeep } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: 'getRecentWinner',
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (
      (await getEntranceFee()) as BigNumber
    ).toString();
    const numPlayersFromCall = (
      (await getNumberOfPlayers()) as BigNumber
    ).toString();
    const recentWinnerFromCall = (await getRecentWinner()) as string;
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      // try to read the raffle entrance fee
      console.log({ raffleAddress, chainId });
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx: ContractTransaction) {
    const contractReceipt = await tx.wait(1);
    const { events } = contractReceipt;
    console.log({ events });
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: 'info',
      message: 'Transaction Complete!',
      title: 'Transaction Notification',
      position: 'topR',
      icon: <Bell fontSize="50px" />,
    });
  };

  return (
    <div className="p-5">
      Hi from lottery entrance!
      {raffleAddress ? (
        <div className="">
          <button
            type="button"
            className="ml-auto rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={async function () {
              await enterRaffle({
                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                onError: (error) =>
                  console.log('📛 Error on click enter raffle:', error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="spinner-border h-8 w-8 animate-spin rounded-full border-b-2" />
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
          </div>
          <div>Number Of Players: {numPlayers} </div>
          <div> Recent Winner: {recentWinner} </div>
        </div>
      ) : (
        <div>No Raffle Address Deteched</div>
      )}
    </div>
  );
}
