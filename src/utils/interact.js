
const ALCHEMY_WEBSOCKETS="wss://eth-goerli.g.alchemy.com/v2/jBb1eGN9hpw-LJkN4Vb10qGxq-Gqa-Sr";

const {createAlchemyWeb3}= require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(ALCHEMY_WEBSOCKETS);
const CONTRACT_ADDRESS="0xBC1F23aba4F942559e090c637B36aCeF0C58e7F2";


const contractAbi = require('./contract-abi.json');

export const helloWorldContract = new web3.eth.Contract(contractAbi,CONTRACT_ADDRESS);


//Implement interaction functions...
export const loadCurrentMessage = async ()=>{
    const message = await helloWorldContract.methods.message().call();
    return message
}
//Implement Wallet connection
export const connectWallet = async ()=>{
    if(window.ethereum){
        try{
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            const obj={
                status :"Write a message in the text-field above.",
                address:addressArray[0]
            };
            return obj
        }catch(err){
            return {
                address:"",
                status: err.message
            };
        }
    }else{
        return{
            address:"",
            status:'You must install metamask ,a virtual Ethereum wallet ...',
        }
    }
};


//Get current wallet connected function...
export const  getCurrentWalletConnected = async()=>{
    if(window.ethereum){
        try{
            const addressArray = await window.ethereum.request({
                method: "eth_accounts"
            });
            if(addressArray>0){
                return{
                    address:addressArray[0],
                    status:'Write a Message',
                }
            }else{
                return {
                    address:"",
                    status:"Connect to metamask using the right button"
                }
            }
        }catch(err){
            return {
                address:"",
                status: err.message
            }
        }
    }else{
        return{
            address:'',
        status:"You must Install metamsk ,a virtual wallet in your browser"        }
    }
}



//Implementing error update function..
    

 export const updateMessage = async (address, message) => {


    if(!window.ethereum || address === null){
        return {
            status:"Connect your Metamask wallet to update your message"
        }
    }
    if(message.trim() === ""){
        return{
            status:"Your message cannot be an empty string"
        };
    };

    const transactionPrameters ={
        to : CONTRACT_ADDRESS,
        from:address,
        data:helloWorldContract.methods.update(message).encodeABI(),
    };
    try{
        const txHash = await window.ethereum.request({
            method:"eth_sendTransaction",
            params:[transactionPrameters]
        });
        return{
            status:"View the status of your transaction on etherscan"
        }
    }catch(error){
        return{
            status: error.message,
        }
    }
}


