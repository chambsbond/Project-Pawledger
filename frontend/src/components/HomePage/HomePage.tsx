import Stack from '@mui/material/Stack';
import Header from "@/components/HomePage/Header"
import { MenuTiles } from './MenuTiles';

export const HomePage = () => {

  return (
      <Stack direction="column" display="flex">
        <Header />
        <MenuTiles/>
      </Stack>
  )
}
