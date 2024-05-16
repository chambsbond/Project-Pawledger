import { Checkbox, FormGroup, FormControlLabel, Box } from "@mui/material"
export const VaccineInputForm = () => {

  return (
  <Box >
    <FormGroup>
      <FormControlLabel control={<Checkbox /> } label="Spayed/Neutered" />

    </FormGroup>
  </Box>
  )

}
