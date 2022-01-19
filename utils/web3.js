import Web3 from "web3";

let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3(Web3.givenProvider);
}

export default web3;

