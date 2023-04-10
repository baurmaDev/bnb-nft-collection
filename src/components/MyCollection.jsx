import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
import axios from 'axios'
import abi from '../assets/abi/BaurmaNFT.json'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Loader from './Loader';

const contractAddress = "0x26360Dd3977C26AC8DB95763f8868DfA308C1EA3";

function MyCollection({totalSupply}) {
    const [tokenIds, setTokenIds] = useState(new Set())
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("");
    const [recipient, setRecipient] = useState("");
    const ownerOf = async (tokenId) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi.abi, signer);
        try {
            const result = await contract.ownerOf(tokenId);
            if(localStorage.getItem('address') === result){
                setTokenIds(prevTokenIds => new Set([...prevTokenIds, tokenId]));
                console.log("Owner of: ", tokenId)
                return tokenId
            }
            
        } catch (e) {
            console.log(e);
        }
    }
    async function fetchData() {
      const fileNames = [...tokenIds]
      fileNames.map(item => console.log("AAA", item))
      const promises = fileNames.map((fileName) => axios.get(`https://ipfs.io/ipfs/QmSyKikPBB7DgMpXpLqbzEwnMoyk8uqqTsnjHJH2uGAVjm/${fileName}.json`));
      const results = await Promise.all(promises);
      const jsonDatas = results.map((result) => result.data);
      console.log("Collection: ", jsonDatas)
      setData(jsonDatas);
    }
    useEffect(() => {
        async function handleTokens(){
            const newArray = Array.from(Array(totalSupply).keys()).map((n) => n + 1);
            const promises = newArray.map((item) => ownerOf(item));
            const results = await Promise.all(promises);
            setLoading(true)
        }
        handleTokens()
        
        
    }, [])
    useEffect(() => {
        
        if(loading){
            console.log("AAAA")
            fetchData()
        }
    }, [loading])
    async function mint() {
    console.log("Minting started")
    if (!recipient) {
      setStatus("Please enter a recipient address");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    setStatus("Minting NFT...");
    
    try {
      const result = await contract.safeMint(recipient,{value: ethers.utils.parseEther("0.001").toString()},);
      setStatus(`NFT minted successfully! Transaction hash: ${result.hash}`);
    } catch (e) {
      console.log(e);
      setStatus("Error minting NFT");
    }
  }

  return (
    <>
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: '50px'
    }}>
        <div>
                <h2>Mint an NFT</h2>
                <div>
                <label style={{marginRight: '10px'}}>Recipient address:</label>
                <input
                    type="text"
                    onChange={(e) => setRecipient(e.target.value)}
                    value={recipient}
                />
                </div>
                <div style={{display: 'flex', flexDirection:'column', padding: '20px'}}>
                    <button onClick={mint}>Mint NFT</button>
                    <div>{status}</div>
                </div>
                
        </div>
    </div>
        {
            !data && <Loader />
        }
        <Grid container rowSpacing={4} columnSpacing={{ xs: 4, md: 12}}>
            {
                data && data.map((jsonData, index) => (
                    <Grid item xs={2}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            height="140"
                            image={jsonData.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                            alt="green iguana"
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {jsonData.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {jsonData.description}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    </Grid>
                ))
            }
                
            
        </Grid>
    </>
    
  )
}

export default MyCollection