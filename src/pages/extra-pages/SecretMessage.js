import { useState, useEffect } from 'react';

// material-ui
import { FormControl, OutlinedInput, Button, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { useParams } from 'react-router-dom'; // Import the useParams hook

import { processLink } from 'services/TextDecryption';

// ==============================|| SAMPLE PAGE ||============================== //

const SecretMessage = () => {
  const { link } = useParams();
  const decodedMessage = decodeURIComponent(link); // Decode the message

  const getMessage = async () => {
    try {
      const message = await processLink(`/${decodedMessage}`);
      return message;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const [message, setMessage] = useState(''); // Initialize with an empty string
  useEffect(() => {
    getMessage().then((resolvedMessage) => {
      setMessage(resolvedMessage);
    });
  }, []); // Empty dependency array means this effect runs only once, after initial render

  return (
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
          value={message}
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
  );
};

export default SecretMessage;
