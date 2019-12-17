import React from 'react';
import web3Obj from './helper';
import Button from 'react-bootstrap-button-loader';
import {Navbar, Card, CardGroup} from 'react-bootstrap';

import LendingPool from "./LendingPool.json";
import AToken from "./AToken.json";

const ethAddress = '0x804C0B38593796bD44126102C8b5e827Cf389D80';
const lendingPoolAddress = '0xB36017F5aafDE1a9462959f0e53866433D373404';
const aethAddress = '0x436264Ac032f7f271934Fa920dcD655210193090';

class App extends React.Component {
    state = {
        account: '',
        balance: '',
        transaction: {
            receiver_username: '',
            receiver_network: 'ethereum',
            pay_amount: ''
        },
        loading: false,
        loadingPay: false,
        loadingDeposit: false,
        loadingRedeem: false,
        ethReserve: 0,
        aethReserve: 0,
        ethDeposit: '',
        aethRedeem: ''
    };

    componentDidMount() {
        const isTorus = sessionStorage.getItem('pageUsingTorus');
        if (isTorus) {
            web3Obj.initialize().then(() => {
                this.setStateInfo()
            })
        }
    }

    setStateInfo = async () => {
        let accounts = await web3Obj.web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        let balance = await web3Obj.web3.eth.getBalance(accounts[0]);
        this.setState({balance: web3Obj.web3.utils.fromWei(balance, "ether")});
        const contract = new web3Obj.web3.eth.Contract(LendingPool, lendingPoolAddress);
        let data = await contract.methods.getUserReserveData(ethAddress, accounts[0]).call();
        this.setState({
            ethReserve: data["currentUnderlyingBalance"],
            aethReserve: data["currentATokenBalance"]
        });
    };

    enableTorus = async () => {
        this.setState({loading: true});
        try {
            await web3Obj.initialize();
            this.setStateInfo()
        } catch (error) {
        }
        this.setState({loading: false});
    };

    updatePaymentDetails = (key, value) => {
        const transaction = this.state.transaction;
        transaction[key] = value;
        this.setState({
            transaction: transaction
        })
    };

    sendPayment = async () => {
        if (this.state.transaction.receiver_network.trim() === '' ||
            this.state.transaction.receiver_username.trim() === '' ||
            this.state.transaction.pay_amount.trim() === '') {
            return;
        }
        this.setState({loadingPay: true});
        let address = "";
        if (this.state.transaction.receiver_network !== "ethereum") {
            address = await web3Obj.fetchAddressUsingUsername(
                this.state.transaction.receiver_network,
                this.state.transaction.receiver_username
            );
        } else {
            address = this.state.transaction.receiver_username;
        }
        try {
            await web3Obj.web3.eth.sendTransaction({
                from: this.state.account,
                to: address,
                value: web3Obj.web3.utils.toWei(this.state.transaction.pay_amount, "ether")
            });
        } catch (e) {
        }
        let balance = await web3Obj.web3.eth.getBalance(this.state.account);
        this.setState({balance: web3Obj.web3.utils.fromWei(balance, "ether")});
        this.setState({
            loadingPay: false,
            transaction: {
                receiver_username: '',
                receiver_network: 'ethereum',
                pay_amount: ''
            }
        });
    };

    logout = async () => {
        await web3Obj.logout();
        this.setState({
            account: '',
            balance: '',
            transaction: {
                receiver_username: '',
                receiver_network: 'ethereum',
                pay_amount: ''
            },
            loading: false,
            loadingPay: false,
            loadingDeposit: false,
            loadingRedeem: false,
            ethReserve: 0,
            aethReserve: 0,
            ethDeposit: '',
            aethRedeem: ''
        });
    };

    initiateTopup = async () => {
        await web3Obj.initiateTopup();
    };

    deposit = async () => {
        if (this.state.ethDeposit.trim() === '') {
            return;
        }
        this.setState({loadingDeposit: true});
        const contract = new web3Obj.web3.eth.Contract(LendingPool, lendingPoolAddress);
        const ethAmountinWei = web3Obj.web3.utils.toWei(this.state.ethDeposit, "ether").toString();
        const referralCode = '0';
        try {
            await contract.methods.deposit(ethAddress, ethAmountinWei, referralCode)
                .send({from: this.state.account, value: web3Obj.web3.utils.toWei(this.state.ethDeposit, "ether")});
        } catch (e) {

        }
        await this.setStateInfo();
        this.setState({loadingDeposit: false, ethDeposit: ''});
    };

    redeem = async () => {
        if (this.state.aethRedeem.trim() === '') {
            return;
        }
        this.setState({loadingRedeem: true});
        const contract = new web3Obj.web3.eth.Contract(AToken, aethAddress);
        const aethAmountinWei = web3Obj.web3.utils.toWei(this.state.aethRedeem, "ether").toString();
        try {
            await contract.methods.redeem(aethAmountinWei).send({from: this.state.account});
        } catch (e) {

        }
        await this.setStateInfo();
        this.setState({loadingRedeem: false, aethRedeem: ''});
    };

    updateETHDeposit = (value) => {
        this.setState({ethDeposit: value})
    };

    updateaETHRedeem = (value) => {
        this.setState({aethRedeem: value})
    };

    render() {
        let loggedIn = this.state.account !== '';
        return (
            <div className="App">
                {!loggedIn &&
                <div className="panel-landing  h-100 d-flex" id="section-1">
                    <div style={{margin: "auto", textAlign: "center"}}>
                        <img src="/defi.png" width="300" height="100"/>
                        <br/>
                        <br/>
                        <h1>DeFi Onboard</h1>
                        <p><b>Gateway to Open Finance</b></p>
                        <br/>
                        <div>
                            <Button variant="primary btn btn-lg" onClick={this.enableTorus}
                                    loading={this.state.loading}>Login</Button>
                        </div>
                    </div>
                </div>
                }
                {loggedIn &&
                <div>
                    <Navbar bg="primary" variant="dark">
                        <div style={{width: "90%"}}>
                            <Navbar.Brand href="/">
                                <b>DeFi Onboard</b>
                            </Navbar.Brand>
                        </div>
                        <div style={{float: "right"}}>
                            <Button variant="btn btn-sm" onClick={this.logout}>Logout</Button>
                        </div>
                    </Navbar>
                    <div style={{margin: "20px"}}>
                        <div>
                            <div><b>Account:</b> {this.state.account}</div>
                            <div><b>Balance:</b> {this.state.balance}</div>
                            {/*<Button variant="primary btn btn-sm" onClick={this.initiateTopup}>Topup</Button>*/}
                            <br/>
                            <div><p className="h5">Send ETH using Ethereum Address / Social Network username</p></div>
                            <div style={{marginBottom: "10px"}}>
                                <select className="form-control"
                                        value={this.state.transaction.receiver_network}
                                        onChange={e => this.updatePaymentDetails('receiver_network', e.target.value)}>
                                    <option value="ethereum">Ethereum Address</option>
                                    <option value="google">Google Email</option>
                                    <option value="reddit">Reddit Username</option>
                                    <option value="discord">Discord Id</option>
                                </select>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <input className="form-control" type="text" placeholder="Receiver Address / Username"
                                       value={this.state.transaction.receiver_username}
                                       onChange={e => this.updatePaymentDetails('receiver_username', e.target.value)}/>
                            </div>
                            <div>
                                <input className="form-control" type="text" placeholder="Amount in ETH"
                                       value={this.state.transaction.pay_amount}
                                       onChange={e => this.updatePaymentDetails('pay_amount', e.target.value)}/>
                            </div>
                            <div>
                                <Button variant="primary btn" onClick={this.sendPayment}
                                        loading={this.state.loadingPay} style={{marginTop: "10px"}}>Send ETH</Button>
                            </div>
                            <br/>
                            <h3>Savings Account</h3>
                            <CardGroup>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>ETH Deposits</Card.Title>
                                        <Card.Text>
                                            {this.state.ethReserve / 1e18}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer style={{backgroundColor: "#2196f3"}}>

                                    </Card.Footer>
                                </Card>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>aETH Balance</Card.Title>
                                        <Card.Text>
                                            {this.state.aethReserve / 1e18}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer style={{backgroundColor: "#4caf50"}}>

                                    </Card.Footer>
                                </Card>
                            </CardGroup>
                            <br/>
                            <h5>Deposit ETH to earn interest using aETH</h5>
                            <div>
                                <input className="form-control" type="text" placeholder="Amount in ETH"
                                       value={this.state.ethDeposit}
                                       onChange={e => this.updateETHDeposit(e.target.value)}/>
                            </div>
                            <div>
                                <Button variant="primary btn" onClick={this.deposit} style={{marginTop: "10px"}}
                                        loading={this.state.loadingDeposit}
                                >Deposit ETH</Button>
                            </div>
                            <br/>
                            <h5>Redeem aETH to get ETH</h5>
                            <div>
                                <input className="form-control" type="text" placeholder="Amount in aETH"
                                       value={this.state.aethRedeem}
                                       onChange={e => this.updateaETHRedeem(e.target.value)}/>
                            </div>
                            <div>
                                <Button variant="primary btn" onClick={this.redeem} style={{marginTop: "10px"}}
                                        loading={this.state.loadingRedeem}
                                >Redeem aETH</Button>
                            </div>
                        </div>

                    </div>
                </div>
                }
            </div>
        )
    }
}

export default App
