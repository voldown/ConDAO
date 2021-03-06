import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Grid, MenuItem, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import condo_whole from './condo_whole.jpeg';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const votingSupport = [
  {
    value: '1',
    label: 'FOR',
  },
  {
    value: '0',
    label: 'AGAINST',
  },
  {
    value: '2',
    label: 'ABSTAIN',
  },
];

class Main extends Component {

  render() {

    return (
      <Box sx={{ width: "100%", margin: 'auto', justifyContent: 'center', bgColor: 'primary.main' }}>
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', }}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Item>
                <h4>Condo Estate Developer Address: {this.props.condoRegistryDeveloper}</h4>
                <h4>Condo Registry Contract Address: {this.props.condoRegistryAddress}</h4>
                <h4>Condo Token Contract Address: {this.props.condoTokenAddress}</h4>
                <img src={condo_whole} alt="condo_unit.jpeg" width="500px" />
                <h4>Condo Governor Contract Address: {this.props.condoGovernorAddress}</h4>
                <h4>Condo Treasury Address: {this.props.treasuryAddress}</h4>
                <h4>Condo Treasury Balance: {this.props.web3.utils.fromWei(this.props.treasuryBalance, 'Ether')} ETH</h4>
              </Item>
            </Grid>
          </Grid>
        </Container>

        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Condo Units Total</TableCell>
                  <TableCell align="center">Condo Units Registered</TableCell>
                  <TableCell align="center">Condo Unit You Own</TableCell>
                  <TableCell align="center">Condo Tokens You Have</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{this.props.condoRegistryTotalUnits}</TableCell>
                  <TableCell align="center">{this.props.condoRegistryTotalRegistered}</TableCell>
                  <TableCell align="center">{this.props.condoRegistryBalance}</TableCell>
                  <TableCell align="center">{this.props.web3.utils.fromWei(this.props.condoTokenBalance, 'Ether')} CDT</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Container>


        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Condo Unit Number (Token ID)</TableCell>
                  <TableCell align="center">Condo Unit Owner (Address)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.condoUnitRows.map((row) => (
                <TableRow
                  key={row.condoUnitId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.condoUnitId}
                  </TableCell>
                  <TableCell align="center">{row.condoUnitOwner}</TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h1>Property Ownership / Token Transfer</h1>
          <h4>Workflow for Condo estate developer: Mint CONDO NFT >> Transfer CDT</h4>
          <h4>Workflow for Condo unit owners (optional): Transfer CONDO NFT >> Transfer CDT</h4>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Mint CONDO NFT</h2>
          <h5>Condo unit NFT can only be minted by condo estate developer</h5>
          <form onSubmit= {(event) => {
            event.preventDefault();
            let address;
            let tokenId;
            address = this.mintNftTo.value.toString();
            tokenId = this.mintTokenId.value.toString();
            this.props.mintNFT(address, tokenId,'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Address"
              defaultValue="0x"
              variant="standard"
              inputRef={(input) => { this.mintNftTo = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              required
              id="filled-required"
              label="Unit (Token ID)"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.mintTokenId = input }}
            />
            <Button 
              sx = {{ margin: [2, 2, 2, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Mint</Button>
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Transfer CONDO NFT</h2>
          <h5>Condo units are represented by corresponding tokenId</h5>
          <h5>(Condo Unit #1 => Token ID: 1)</h5>
          <form onSubmit={(event) => {
            event.preventDefault();
            let address;
            let tokenId;
            address = this.transferNftTo.value.toString();
            tokenId = this.transferTokenId.value.toString();
            this.props.transferNFT(this.props.account, address, tokenId);
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Address"
              defaultValue="0x"
              variant="standard"
              inputRef={(input) => { this.transferNftTo = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              required
              id="filled-required"
              label="Unit (Token ID)"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.transferTokenId = input }}
            />
            <Button 
              sx = {{ margin: [2, 2, 2, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Transfer</Button>
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Transfer CDT</h2>
          <h5>CDT is the governance token used for voting</h5>
          <form onSubmit={(event) => {
            event.preventDefault();
            let address;
            let amount;
            address = this.transferTo.value.toString();
            amount = this.props.web3.utils.toWei(this.transferToAmount.value, 'Ether');
            this.props.transferCDT(address, amount);
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Address"
              defaultValue="0x"
              variant="standard"
              inputRef={(input) => { this.transferTo = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              required
              id="filled-required"
              label="Amount (CDT)"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.transferToAmount = input }}
            />
            <Button 
              sx = {{ margin: [2, 2, 2, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Transfer</Button>
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h1>Governance Voting</h1>
          <h4>Workflow for all condo unit owners: Delegate CDT >> Check Your Votes</h4>
          <h4>Workflow for proposal making: Make a Proposal >> View Proposal State >> Execute a Proposal</h4>
          <h4>Workflow for proposal voting: View Proposal State >> Cast a Vote</h4>
          <h4>Voting Delay: {this.props.votingDelay} Block </h4>
          <h4>Voting Period: {this.props.votingPeriod} Block </h4>
          <h4>Quorum: 66% (66% of total supply of CDT votes are required for a proposal to be succeeded)</h4>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Delegate CDT</h2>
          <h5>Delegate CDT to yourself in advance to gain voting power extracted from your CDT</h5>
          <h5>Delegated Address: {this.props.condoTokenDelegates}</h5>
          <form onSubmit={(event) => {
            event.preventDefault();
            this.props.delegateCDT(this.props.account);
          }}>
            <Button 
              sx = {{ margin: [0, 2, 0, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Delegate</Button>    
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Check Your Votes</h2>
          <h5>Your Votes: {this.props.web3.utils.fromWei(this.props.condoTokenGetVotes, 'Ether')} CDT</h5>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Make a Proposal</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            let address = [this.props.treasuryAddress];
            let value = [0];
            let calldata = [this.props.web3.eth.abi.encodeFunctionCall({
                name: 'sendEther',
                type: 'function',
                inputs: [{
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                },{
                  "internalType": "uint256",
                  "name": "_value",
                  "type": "uint256"
                }]
            }, [this.proposeSendEthToAddress.value.toString(), this.props.web3.utils.toWei(this.proposeSendEthToValue.value,'Ether')])];
            let description = this.proposeProposalDescription.value.toString();
            this.props.propose(address, value, calldata, description);
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="outlined-multiline-static filled-required"
              label="Proposal Description"
              rows={3}
              defaultValue="Proposal #0: describe the reason why you would start this proposal..."
              variant="standard"
              inputRef={(input) => { this.proposeProposalDescription = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Address"
              defaultValue="0x"
              variant="standard"
              inputRef={(input) => { this.proposeSendEthToAddress = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              required
              id="filled-required"
              label="Value (ETH)"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.proposeSendEthToValue = input }}
            />
            <Button 
              sx = {{ margin: [2, 2, 2, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Propose</Button>
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>View Proposal State</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            let viewStateProposalId = this.viewStateProposalId.value.toString();
            this.props.proposalState(viewStateProposalId);
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Proposal ID"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.viewStateProposalId = input }}
            />
            <Button 
              sx = {{ margin: [0, 2, 0, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >View</Button>
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Cast a Vote</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            let voteForProposalId = this.voteForProposalId.value.toString();
            let voteSupport = this.voteSupport.value.toString();
            this.props.castVote(voteForProposalId, voteSupport);
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Proposal ID"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.voteForProposalId = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              select
              required
              id="filled-required"
              label="Support"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.voteSupport = input }}
            >
              {votingSupport.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button 
              sx = {{ margin: [2, 2, 2, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Vote</Button>
          </form>
        </Container>

        <Container sx={{ alignItems: 'center', justifyContent: 'center', mt: 10, mb: 10, }}>
          <h2>Execute a Proposal</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            let address = [this.props.treasuryAddress];
            let value = [0];
            let calldata = [this.props.web3.eth.abi.encodeFunctionCall({
                name: 'sendEther',
                type: 'function',
                inputs: [{
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                },{
                  "internalType": "uint256",
                  "name": "_value",
                  "type": "uint256"
                }]
            }, [this.executeSendEthToAddress.value.toString(), this.props.web3.utils.toWei(this.executeSendEthToValue.value,'Ether')])];
            let descriptionHash = this.props.web3.utils.keccak256(this.executeProposalDescription.value.toString());
            this.props.execute(address, value, calldata, descriptionHash);
          }}>
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="outlined-multiline-static filled-required"
              label="Proposal Description"
              rows={3}
              defaultValue="Proposal #0: describe the reason why you would start this proposal..."
              variant="standard"
              inputRef={(input) => { this.executeProposalDescription = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              fullWidth
              required
              id="filled-required"
              label="Address"
              defaultValue="0x"
              variant="standard"
              inputRef={(input) => { this.executeSendEthToAddress = input }}
            />
            <TextField
              sx = {{ padding: [1, 1, 1, 1] }}
              required
              id="filled-required"
              label="Value (ETH)"
              defaultValue="0"
              variant="standard"
              inputRef={(input) => { this.executeSendEthToValue = input }}
            />
            <Button 
              sx = {{ margin: [2, 2, 2, 2], padding: [1, 1, 1, 1] }}
              variant="outlined"
              type="submit"
            >Execute</Button>
          </form>
        </Container>

      </Box>
    )
  }

}

export default Main;