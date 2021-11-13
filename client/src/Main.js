import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Grid, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import condo_whole from './condo_whole.jpeg';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

class Main extends Component {

  render() {

    return (
      <Box sx={{ flexGrow: 1, bgColor: 'primary.main' }}>
        <Container sx={{ flexGrow: 1, maxWidth: "md", margin: [10, 10, 10, 10], }}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Item>
                <img src={condo_whole} alt="condo_unit.jpeg" width="500px" />
                <h5>Condo Estate Developer  {this.props.condoRegistryDeveloper}</h5>
              </Item>
            </Grid>
          </Grid>
        </Container>

        <Container sx={{ maxWidth:"md", margin: [10, 10, 10, 10], }}>
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


        <Container sx={{ maxWidth: "md", margin: [10, 10, 10, 10], }}>
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

        <Container sx={{ maxWidth: "md", margin: [10, 10, 10, 10], }}>
          <h2>Mint Condo NFT</h2>
          <h5>Condo unit NFTs can only be minted by condo estate developer</h5>
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

        <Container sx={{ maxWidth: "md", margin: [10, 10, 10, 10], }}>
          <h2>Transfer NFT</h2>
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

        <Container sx={{ maxWidth: "md", margin: [10, 10, 10, 10], }}>
          <h2>Transfer CDT</h2>
          <h5>CDTs are governance token used for voting</h5>
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
      </Box>
    )
  }

}

export default Main;