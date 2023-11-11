import Addresses from './contract-addresses.json'
import BorrowYourCar from './abis/BorrowYourCar.json'

declare const window: any;

const Web3 = require('web3');

let web3 = new Web3(window.web3.currentProvider)

// 修改地址为部署的合约地址
const CarAddress = Addresses.Car
const CarABI = BorrowYourCar.abi

// 获取合约实例
const CarContract = new web3.eth.Contract(CarABI, CarAddress);

// 导出web3实例和其它部署的合约
export {web3, CarContract}