import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid';


function List({totalSupply}) {
  const [data, setData] = useState([]);
  console.log("Total supply: ", totalSupply)
  useEffect(() => {
    async function fetchData() {
      const fileNames = Array.from(Array(totalSupply).keys()).map((n) => n + 1); // Replace with your file names
      const promises = fileNames.map((fileName) => axios.get(`https://ipfs.io/ipfs/QmSyKikPBB7DgMpXpLqbzEwnMoyk8uqqTsnjHJH2uGAVjm/${fileName}.json`));
      const results = await Promise.all(promises);
      const jsonDatas = results.map((result) => result.data);
      console.log("Results: ", results)
      setData(jsonDatas);
    }

    fetchData();
  }, [totalSupply]);

  if (!data.length) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 4, md: 12}}>
            
                {data.map((jsonData, index) => (
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
                ))}
            
        </Grid>
      
    </div>
  );
}

export default List;
