import React, { Component } from 'react';
import Main from './Main';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import getWeb3 from "./getWeb3";
import CondoRegistry from './contracts/CondoRegistry.json';
import CondoToken from './contracts/CondoToken.json';
import './App.css';

class App extends Component {

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      this.setState({ web3 });

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });

      // Use web3 to get the corresponding networkID
      const networkId = await web3.eth.net.getId();

      // Get the contract instance.
      // load Condo Registry
      const condoRegistryDeployedNetwork = CondoRegistry.networks[networkId];
      if (condoRegistryDeployedNetwork) {
        const condoRegistry = new web3.eth.Contract(
          CondoRegistry.abi,
          condoRegistryDeployedNetwork && condoRegistryDeployedNetwork.address,
        );
        this.setState({ condoRegistry });
        let condoRegistryBalance = await condoRegistry.methods.balanceOf(this.state.account).call();
        let condoRegistryTotalRegistered = await condoRegistry.methods.totalSupply().call();
        let condoRegistryDeveloper = await condoRegistry.methods.owner().call()
        let condoRegistryUnitOwners = {};
        for (let i=1; i<=parseInt(condoRegistryTotalRegistered); i++) {
          let condoRegistryUnitOwner = await condoRegistry.methods.ownerOf(i).call();
          condoRegistryUnitOwners[i] = condoRegistryUnitOwner.toString();
        }
        this.setState({ 
          condoRegistryBalance: condoRegistryBalance.toString(),
          condoRegistryTotalRegistered: condoRegistryTotalRegistered.toString(),
          condoRegistryDeveloper: condoRegistryDeveloper.toString(),
          condoRegistryUnitOwners: condoRegistryUnitOwners
        });
      } else {
      window.alert('CondoRegistry contract has not been deployed to the detected network.');
      }

      // load Condo Token
      const condoTokenDeployedNetwork = CondoToken.networks[networkId];
      if (condoTokenDeployedNetwork) {
        const condoToken = new web3.eth.Contract(
          CondoToken.abi,
          condoTokenDeployedNetwork && condoTokenDeployedNetwork.address,
        );
        this.setState({ condoToken });
        let condoTokenBalance = await condoToken.methods.balanceOf(this.state.account).call();
        this.setState({ condoTokenBalance: condoTokenBalance.toString() });
      } else {
      window.alert('CondoToken contract has not been deployed to the detected network.');
      }

      this.setState({ loading: false });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`,
      );
      console.error(error);
    }
  }

  // mint NFT 
  mintNFT = (address, tokenURI) => {
    this.setState({ loading: true });
    this.state.condoRegistry.methods.safeMint(address, tokenURI)
      .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false })
        })
  }

  // transfer NFT
  transferNFT = (addressFrom, addressTo, tokenId) => {
    this.setState({ loading: true });
    this.state.condoRegistry.methods.safeTransferFrom(this.state.account, addressTo, tokenId)
      .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false})
        })
  }


  // transfer CDT
  transferCDT = (address, amount) => {
    this.setState({ loading: true });
    this.state.condoToken.methods.transfer(address, amount)
      .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false })
        })
  }


  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: '0x0',
      condoRegistry: {},
      condoToken: {},
      condoRegistryBalance: '0',
      condoTokenBalance: '0',
      condoRegistryTotalRegistered: '0',
      condoRegistryDeveloper: '0x0',
      condoRegistryUnitOwners: {},
      loading: true
    }
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <h2 id="loader" className="center">Loading...</h2>;
    } else {
      content = <Main 
        web3={this.state.web3}
        condoRegistryBalance={this.state.condoRegistryBalance}
        condoTokenBalance={this.state.condoTokenBalance}
        condoRegistryTotalRegistered={this.state.condoRegistryTotalRegistered}
        condoRegistryDeveloper={this.state.condoRegistryDeveloper}
        condoRegistryUnitOwners={this.state.condoRegistryUnitOwners}
        mintNFT={this.mintNFT}
        transferNFT={this.transferNFT}
        transferCDT={this.transferCDT}
      />
    }

    return (
      <div>
        <Box sx={{ flexGrow: 1, bgColor: 'primary.main' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                ConDAO
              </Typography>
              <Typography variant="h6" component="div">
                account: {this.state.account}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Container maxWidth="sm">
          <main>
            { content }
          </main>
        </Container> 
      </div>
    );
  }
}

export default App;
