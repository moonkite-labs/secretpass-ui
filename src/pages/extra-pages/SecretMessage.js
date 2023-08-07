// material-ui
import { FormControl, OutlinedInput, Button, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const SecretMessage = () => (
  <>
    <MainCard>
      <FormControl sx={{ width: '100%' }}>
        <OutlinedInput
          multiline
          rows={25}
          rowsmin={100}
          id="header-search"
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'weight'
          }}
          placeholder="Your secret message"
        />
      </FormControl>
      <Typography sx={{ textAlign: 'center', py: 2.5 }}>maximum characters count is 1000</Typography>

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
          Home
        </Button>
        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
          Destroy
        </Button>
      </Stack>
    </MainCard>
  </>
);

export default SecretMessage;
