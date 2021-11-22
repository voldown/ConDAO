import React, { Component } from 'react';
import Main from './Main';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import getWeb3 from "./getWeb3";
import CondoRegistry from './contracts/CondoRegistry.json';
import CondoToken from './contracts/CondoToken.json';
import CondoGovernor from './contracts/CondoGovernor.json';
import './App.css';

function createCondoUnitRow(condoUnitId, condoUnitOwner) {
  return { condoUnitId, condoUnitOwner };
}

let condoUnitRows = [];

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: '0x0',
      condoRegistry: {},
      condoToken: {},
      condoRegistryBalance: '0',
      condoTokenBalance: '0',
      condoTokenTotalSupply: '0',
      condoRegistryTotalRegistered: '0',
      condoRegistryTotalUnits: '0',
      condoRegistryDeveloper: '0x0',
      condoRegistryUnitOwners: {},
      treasuryAddress: '0x0',
      treasuryBalance: '0',
      votingDelay: '0',
      votingPeriod: '0',
      condoTokenDelegates: '0x0',
      condoTokenGetVotes: '0',
      loading: true
    }
  }

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
        let condoRegistryTotalUnits = await condoRegistry.methods.maxTotalSupply().call();
        let condoRegistryDeveloper = await condoRegistry.methods.owner().call()
        let condoRegistryUnitOwners = {};
        if (condoRegistryTotalRegistered) {
          for (let i=0; i<parseInt(condoRegistryTotalRegistered); i++) {
            let condoRegistryTokenIdRegistered = await condoRegistry.methods.tokenByIndex(i).call();
            let condoRegistryUnitOwner = await condoRegistry.methods.ownerOf(condoRegistryTokenIdRegistered).call();
            condoRegistryUnitOwners[condoRegistryTokenIdRegistered] = condoRegistryUnitOwner.toString();
          }
        }
        for (let i=1; i<=condoRegistryTotalUnits; i++) {
          condoUnitRows.push(createCondoUnitRow(i, condoRegistryUnitOwners[i]));
        }
        this.setState({ 
          condoRegistryBalance: condoRegistryBalance.toString(),
          condoRegistryTotalRegistered: condoRegistryTotalRegistered.toString(),
          condoRegistryDeveloper: condoRegistryDeveloper.toString(),
          condoRegistryTotalUnits: condoRegistryTotalUnits.toString(),
          condoRegistryUnitOwners: condoRegistryUnitOwners,
          condoUnitRows: condoUnitRows,
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
        let condoTokenTotalSupply = await condoToken.methods.totalSupply().call();
        let condoTokenDelegates = await condoToken.methods.delegates(this.state.account).call();
        let condoTokenGetVotes = await condoToken.methods.getVotes(this.state.account).call();
        this.setState({ 
          condoTokenBalance: condoTokenBalance.toString(),
          condoTokenDelegates: condoTokenDelegates.toString(),
          condoTokenGetVotes: condoTokenGetVotes.toString(),
          condoTokenTotalSupply: condoTokenTotalSupply.toString(),
        });
      } else {
        window.alert('CondoToken contract has not been deployed to the detected network.');
      }

      // load Condo Governor
      const condoGovernorDeployedNetwork = CondoGovernor.networks[networkId];
      if (condoGovernorDeployedNetwork) {
        const condoGovernor = new web3.eth.Contract(
          CondoGovernor.abi,
          condoGovernorDeployedNetwork && condoGovernorDeployedNetwork.address,
        );
        this.setState({ condoGovernor });
        let treasuryAddress = await condoGovernor.methods.treasury().call();
        let treasuryBalance = await condoGovernor.methods.treasuryBalance().call();
        let votingDelay = await condoGovernor.methods.votingDelay().call();
        let votingPeriod = await condoGovernor.methods.votingPeriod().call();
        this.setState({
          treasuryAddress: treasuryAddress.toString(),
          treasuryBalance: treasuryBalance.toString(),
          votingDelay: votingDelay.toString(),
          votingPeriod: votingPeriod.toString(),
        })
      } else {
        window.alert('CondoGovernor contract has not been deployed to the detected network.'); 
      }

      // once contracts are loaded, set loading state to false
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
  mintNFT = async (address, tokenId, tokenURI) => {
    this.setState({ loading: true });
    await this.state.condoRegistry.methods.safeMint(address, tokenId, tokenURI)
      .send({ from: this.state.account })
        .on('transactionHash', (txHash) => {
          window.alert(`Transaction Hash: ${txHash}`);
        })
        .on('receipt', (receipt) => {
          window.alert('CONDO NFT Minted Successfully!')
          this.setState({ loading: false });
          window.location.reload(true);
        })
  }

  // transfer NFT
  transferNFT = async (addressFrom, addressTo, tokenId) => {
    this.setState({ loading: true });
    await this.state.condoRegistry.methods.safeTransferFrom(this.state.account, addressTo, tokenId)
      .send({ from: this.state.account })
        .on('transactionHash', (txHash) => {
          window.alert(`Transaction Hash: ${txHash}`);
        })
        .on('receipt', (receipt) => {
          window.alert('CONDO NFT transferred Successfully!')
          this.setState({ loading: false });
          window.location.reload(true);
        })
  }

  // transfer CDT
  transferCDT = async (address, amount) => {
    this.setState({ loading: true });
    await this.state.condoToken.methods.transfer(address, amount)
      .send({ from: this.state.account })
        .on('transactionHash', (txHash) => {
          window.alert(`Transaction Hash: ${txHash}`);
        })
        .on('receipt', (receipt) => {
          window.alert('CDTs transferred Successfully!')
          this.setState({ loading: false });
          window.location.reload(true);
        })
  }

  // delegate CDT
  delegateCDT = async (address) => {
    this.setState({ loading: true });
    await this.state.condoToken.methods.delegate(this.state.account)
      .send({ from: this.state.account })
        .on('transactionHash', (txHash) => {
          window.alert(`Transaction Hash: ${txHash}`);
        })
        .on('receipt', (receipt) => {
          window.alert('CDTs delegated Successfully!')
          this.setState({ loading: false });
          window.location.reload(true);
        })
  }

  // propose
  propose = async (address, value, calldata, description) => {
    this.setState({ loading: true });
    await this.state.condoGovernor.methods.propose(address, value, calldata, description)
      .send({ from: this.state.account })
        .on('transactionHash', (txHash) => {
          window.alert(`Transaction Hash: ${txHash}`);
        })
        .on('receipt', (receipt) => {
          let proposalId = receipt.events.ProposalCreated.returnValues['0'];
          window.alert(`Proposal Submitted Successfully! The Proposal ID is ${proposalId}`);
          this.setState({ loading: false });
          window.location.reload(true);
        })
  }

  // cast vote 
  castVote = async (proposalId, support) => {
    this.setState({ loading: true });
    await this.state.condoGovernor.methods.castVote(proposalId, support)
      .send({ from: this.state.account })
        .on('transactionHash', (txHash) => {
          window.alert(`Transaction Hash: ${txHash}`);
        })
        .on('receipt', (receipt) => {
          let proposalId = receipt.events.VoteCast.returnValues['1'];
          let support = receipt.events.VoteCast.returnValues['2'];
          let supportLabel;
          if (support === 1) {
            supportLabel = 'FOR';
          } else if (support === 0) {
            supportLabel = 'AGAINST';
          } else if (support === 2) {
            supportLabel = 'ABSTAIN';
          } else {
            supportLabel = 'NULL';
          }
          window.alert(`Your ${supportLabel} Vote Cast Successfully for Proposal ID: ${proposalId} `);
          this.setState({ loading: false });
          window.location.reload(true);
        })
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
        condoTokenTotalSupply={this.state.condoTokenTotalSupply}
        condoRegistryTotalRegistered={this.state.condoRegistryTotalRegistered}
        condoRegistryTotalUnits={this.state.condoRegistryTotalUnits}
        condoRegistryDeveloper={this.state.condoRegistryDeveloper}
        condoRegistryUnitOwners={this.state.condoRegistryUnitOwners}
        condoUnitRows = {this.state.condoUnitRows}
        treasuryAddress = {this.state.treasuryAddress}
        treasuryBalance = {this.state.treasuryBalance}
        votingDelay = {this.state.votingDelay}
        votingPeriod = {this.state.votingPeriod}
        condoTokenDelegates = {this.state.condoTokenDelegates}
        condoTokenGetVotes = {this.state.condoTokenGetVotes}
        mintNFT={this.mintNFT}
        transferNFT={this.transferNFT}
        transferCDT={this.transferCDT}
        delegateCDT={this.delegateCDT}
        propose={this.propose}
        castVote={this.castVote}
      />
    }

    return (
        <Box sx={{ maxWidth:"lg", flexGrow: 1, bgColor: 'primary.main' }}>
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
          <main>
            { content }
          </main>
        </Box>
    );
  }
}

export default App;
