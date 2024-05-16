import { Grid, Box, Typography, Button} from "@mui/material"
import Image from 'next/image';
import styles from "./homepage.module.scss"

export const Tile = (props : {text: string, buttonHandler: Function}) => {

  return (
      <Grid item xs={4}>
        <Box className={styles.tile}>
          <Typography className={styles.tile_text}>
            {props.text}
          </Typography>
          <Button onClick={props.buttonHandler}>
        <Image 
          src="/right_dog.png"
          height={40}
          width={55}
          padding-left
          alt="doggo"
        />
          </Button>
        </Box>
      </Grid>
  )
}
