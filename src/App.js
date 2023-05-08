
import './App.css';
import Web3 from 'web3';
import { useCallback, useState, useEffect } from 'react';
//yeu cau vi metamask
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contracts';

function App() {

  const [web3Api,setWeb3APi] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  const [account,setAccount] = useState(null);
  const [balance,setBalance] = useState(null);

  //tao ra reload tang trai nghiem nguoi dung
  const [shouldReload, reload] = useState();
  const reloadEffect = () => reload(!shouldReload)
  
  useEffect(() => {
    const loadProvider = async () =>  {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);


      if(provider) {
        // provider.request({method: "eth_requestAccounts"})
        setWeb3APi ({
          web3: new Web3(provider),
          provider,
          contract
        })
      } else {
        console.error("Please, Install Metamask")
      }
    }
  loadProvider()
  }, []);

  //su dung getACcounts cua web3
  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0]); 
    }
    web3Api.web3 && getAccounts()
  },[web3Api.web3])


  useEffect(() => {
    const loadBalance = async () => {
      const {contract, web3} = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload]);

  //donate
  const addFunds = useCallback(async () => {
    const {contract, web3} = web3Api
    await contract .addFunds({
      from: account,
      value: web3.utils.toWei("1", 'ether')
    }) 
    reloadEffect();
  }, [web3Api, account])
  
  const withdraw = async () => {
    const {contract, web3} = web3Api
    const withdrawAmout = web3.utils.toWei("0.5","ether")
    await contract.withdraw(withdrawAmout, {
      from: account,
    })
    reloadEffect()
  }

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>{balance}</strong>ETH
        </div>
        {/* button chuc nang donate */}
        <button className="button is-primary mr-5" onClick={addFunds}>Donate</button>
        <button className="button is-danger" onClick={withdraw}>Withdraw</button>
        {/* button click dang nhap metamask */}
        <button className="button is-link ml-5" onClick={()=>web3Api.provider.request({method: "eth_requestAccounts"})}>
          Connect to Walles
        </button>
        <span>
          <p>
            <strong>
            Account Address: 
            </strong>
            {
              account ? account : "Account Denined"
            }
          </p>
        </span>
      </div>
    </div>
  );
}

export default App;

