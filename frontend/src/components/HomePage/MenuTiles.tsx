import { Grid, Box, Typography } from "@mui/material"
import { Tile } from "./Tile"
import styles from "./homepage.module.scss"
export const MenuTiles = () => {
  const name:string = "Upload Medical Record History";
  const handleUploadButton = () => {
    //will switch to rendering corresponding ui component
    console.log("Clicked");
  }

  return (
  <Box className={styles.contailer}>
    <Grid container spacing={2}> 
      <Tile text={name} buttonHandler={handleUploadButton}/>
    </Grid>
  </Box>
  )
}
