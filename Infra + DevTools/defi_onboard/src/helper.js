import Web3 from 'web3'
import Torus from '@toruslabs/torus-embed'

const web3Obj = {
    web3: new Web3(),
    torus: '',
    setweb3: function (provider) {
        const web3Inst = new Web3(provider);
        web3Obj.web3 = web3Inst;
        sessionStorage.setItem('pageUsingTorus', true)
    },
    initialize: async function () {
        let torus = new Torus({buttonPosition: "top-right"});
        await torus.init({
            buildEnv: "production", // default: production
            enableLogging: false, // default: false
            network: {
                host: "kovan", // default: mainnet
                chainId: 42, // default: 1
                networkName: "Kovan Test Network" // default: Main Ethereum Network
            },
            showTorusButton: false // default: true,
        });
        await torus.hideTorusButton();
        await torus.login();
        web3Obj.setweb3(torus.provider);
        web3Obj.torus = torus
    },
    fetchAddressUsingUsername: async function (verifier, username) {
        let torus = web3Obj.torus;
        let address = await torus.getPublicAddress({
            verifier: verifier,
            verifierId: username
        });
        return address;
    },
    logout: async function () {
        let torus = web3Obj.torus;
        await torus.logout();
    },
    initiateTopup: async function () {
        let torus = web3Obj.torus;
        return await torus.initiateTopup('coindirect', {
            selectedCurrency: "USD"
        });
    },
};
export default web3Obj
