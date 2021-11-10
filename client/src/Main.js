import React, { Component } from 'react';
import { Container } from '@mui/material';
import condo_whole from './condo_whole.jpeg';

class Main extends Component {

  render() {

    return (
    	<div>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], width:"100%", }}>
          <img src={condo_whole} alt="condo_unit.jpeg" width="500px" />
          <h5>Condo Estate Developer {this.props.condoRegistryDeveloper}</h5>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>

        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>
          <table className="table table-borderless text-muted text-center">
            <thead>
              <tr>
                <th scope="col">Condo Units Total</th>
                <th scope="col">Condo Units Registered</th>
                <th scope="col">Condo Units You Own</th>
                <th scope="col">Condo Tokens You Have</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4</td>
                <td>{this.props.condoRegistryTotalRegistered} units</td>
                <td>{this.props.condoRegistryBalance} unit</td>
                <td>{this.props.web3.utils.fromWei(this.props.condoTokenBalance, 'Ether')} CDT</td>
              </tr>
            </tbody>
          </table>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>
          <table className="table table-borderless text-muted text-center">
            <thead>
              <tr>
                <th scope="col">Condo Unit Number</th>
                <th scope="col">Condo Unit Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1</td>
                <td>{this.props.condoRegistryUnitOwners['1']}</td>
              </tr>
              <tr>
                <td>#2</td>
                <td>{this.props.condoRegistryUnitOwners['2']}</td>
              </tr>
              <tr>
                <td>#3</td>
                <td>{this.props.condoRegistryUnitOwners['3']}</td>
              </tr>
              <tr>
                <td>#4</td>
                <td>{this.props.condoRegistryUnitOwners['4']}</td>                
              </tr>
            </tbody>
          </table>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>
          <h2>mint NFT</h2>
          <h5>condo unit NFTs can only be minted by condo estate developer</h5>
            <form onSubmit={(event) => {
              event.preventDefault();
              let address;
              address = this.input.value.toString();
              this.props.mintNFT(address, 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
            }}>
              <label>Address </label>
              <input
                id="component-simple mint-to-address" 
                placeholder="0x"
                type="text"
                ref={(input) => { this.input = input }} required/>
              <button type="submit" className="btn btn-primary">MINT</button>
            </form>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>
          <h2>transfer NFT</h2>
          <h5>condo units are represented by corresponding tokenId</h5>
          <h5>(condo unit #1 => tokenId: 1)</h5>
          <h4></h4>
            <form onSubmit={(event) => {
              event.preventDefault();
              let address;
              let tokenId;
              address = this.inputAddressTo.value.toString();
              tokenId = this.inputTokenId.value.toString();
              this.props.transferNFT(this.props.account, address, tokenId);
            }}>
              <label>Address </label>
              <input
                id="component-simple transfer-to-address" 
                placeholder="0x"
                type="text"
                ref={(input) => { this.inputAddressTo = input }} required/>
              <label>tokenId </label>
              <input
                id="component-simple transfer-tokenId" 
                placeholder="0"
                type="text"
                ref={(input) => { this.inputTokenId = input }} required/>
              <button type="submit" className="btn btn-primary">TRANSFER</button>
            </form>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [1, 3, 1, 3], }}>
          <h2>transfer CDT</h2>
          <h5>CDTs are governance token used for voting</h5>
            <form onSubmit={(event) => {
              event.preventDefault();
              let address;
              let amount;
              address = this.inputAddress.value.toString();
              amount = this.props.web3.utils.toWei(this.inputAmount.value, 'Ether');
              this.props.transferCDT(address, amount);
            }}>
              <label>Address </label>
              <input
                id="component-simple transfer-to-address" 
                placeholder="0x"
                type="text"
                ref={(input) => { this.inputAddress = input }} required/>
              <label>Amount </label>
              <input
                id="component-simple transfer-amount" 
                placeholder="0"
                type="text"
                ref={(input) => { this.inputAmount = input }} required/>
              <button type="submit" className="btn btn-primary">TRANSFER</button>
            </form>
        </Container>

      </div>
    )
  }

}

export default Main;