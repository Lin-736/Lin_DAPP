import {Button, Image,List} from 'antd';
import {Header} from "../../asset";
import {useEffect, useState} from 'react';
import {CarContract, web3} from "../../utils/contracts";
import Web3 from 'web3';
import './index.css';

declare global {
    interface Window {
        ethereum?: any;
        web3?: any;
    }
}

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const CarPage = () => {
    const [account, setAccount] = useState('');
    const [userCars, setUserCars] = useState([]);
    const [managerAddress, setManagerAddress] = useState('');
    const [availableCars, setAvailableCars] = useState([]);
    const [carDetails, setCarDetails] = useState({ owner: null, borrower: null, borrowUntil: null });
    const [tokenId, setTokenId] = useState(Number);
    const getAvailableCarsList = async () => {
        try {
            // 调用智能合约的 getAvailableCars 方法
            const availableCarsList = await CarContract.methods.getAvailableCars().call();
            setAvailableCars(availableCarsList);
        } catch (error) {
            console.error('Error getting available cars:', error);
        }
    };

    const getUserCarsList = async () => {
        try {
            const userCarsList = await CarContract.methods.getUserCars(account).call();
            setUserCars(userCarsList);
        } catch (error) {
            console.error('Error getting user cars:', error);
        }
    };

    const getManagerAddress = async () => {
        try {
            // 调用合约的 manager 函数，获取 manager 地址
            const managerAddress = await CarContract.methods.manager().call();
            setManagerAddress(managerAddress);
        } catch (error) {
            console.error('Error getting manager address:', error);
        }
    };

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await window.web3.eth.getAccounts();
                setAccount(accounts[0]);
            } else {
                console.error("Web3 not detected. Please install MetaMask or use a web3-enabled browser.");
            }
        };

        loadWeb3();
        getManagerAddress();
    }, []);
    
    const mintNFTs = async () => {
        try {
          // 调用智能合约的 mintCarNFT 方法
          await CarContract.methods.mintCarNFT().send({ from: managerAddress });
          getUserCarsList();
          getAvailableCarsList();
        } catch (error) {
          console.error('Error minting NFTs:', error);
        }
    };
    
    const distributeCarNFT = async () => {
        try {
            // 调用智能合约的 distributeCarNFT 方法
            await CarContract.methods.distributeCarNFT(account).send({ from: managerAddress, gas: 3000000 });
            getUserCarsList();
            getAvailableCarsList();
        } catch (error) {
            console.error('Error distributing car NFT:', error);
        }
    };

    const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const switchac = async () => {
        try {
            const accounts = await window.web3.eth.getAccounts();
            const newAccount = accounts[getRandomInt(0,9)];
            setAccount(newAccount)
            getUserCarsList();
        } catch (error) {
            console.error('Error distributing car NFT:', error);
        }
    };
    
    const findc = async () => {
        try {
            if (availableCars.length==0)
            {
                setTokenId(0)
            }
            if (availableCars.length!=0)
            {
                setTokenId((tokenId+1)%availableCars.length)
            }
            
            getCarDetails(tokenId);
        } catch (error) {
            console.error('Error getting car details:', error);
        }
    };


    const getCarDetails = async (tokenId:number) => {
        try {
            const result = await CarContract.methods.cars(tokenId).call();
            const owner = result[0];
            const borrower = result[1];
            const borrowUntil = result[2];
    
            // 更新状态
            setCarDetails({ owner, borrower, borrowUntil });
        } catch (error) {
            console.error('Error getting car details:', error);
        }
    };
    
    const borrowCar = async (tokenId:number, duration:number) => {
        try {
            await CarContract.methods.borrowCar(tokenId, duration).send({ from: account });
            
            getUserCarsList();
            getAvailableCarsList();
    
            console.log(`Successfully borrowed car ${tokenId} for ${duration} seconds.`);
        } catch (error) {
            console.error('Error borrowing car:', error);
        }
    };
    

    return (
        <div className='container'>
            <Image
                width='100%'
                height='300px'
                preview={false}
                src={Header}
            />
            <div>管理员地址：{managerAddress}</div>
            <div>当前用户地址：{account}</div>
            <div className='main'>
                <h1>发车</h1>
                <Button onClick={mintNFTs}>发车</Button>
                <h2>你的汽车</h2>
                <List
                    dataSource={userCars}
                    renderItem={(carId, index) => (
                        <List.Item key={index}>Car ID: {carId}</List.Item>
                    )}
                />
                <h3>可用汽车列表</h3>
                <List
                    dataSource={availableCars}
                    renderItem={(carId, index) => (
                        <List.Item key={index}>Car ID: {carId}</List.Item>
                    )}
                />
                <h4>领车</h4>
                <Button onClick={distributeCarNFT}>领车</Button>
                <h5>换人</h5>
                <Button onClick={switchac}>换人</Button>
                <h6>查询</h6>
                <Button onClick={findc}>换车</Button>
                <div>汽车情况: {tokenId}</div>
                <p>Owner: {carDetails.owner}</p>
                <p>Borrower: {carDetails.borrower}</p>
                <p>Borrow Until: {carDetails.borrowUntil}</p>
                {availableCars.map((carId, index) => (
                <div key={index}>
                    <p>Car ID: {carId}</p>
                    <Button onClick={() => borrowCar(carId, 3600)}>Borrow for 1 hour</Button>
                </div>
                ))}

            </div>
         </div>    
    )
}

export default CarPage