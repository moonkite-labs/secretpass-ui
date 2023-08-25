import { useState, useEffect } from 'react';

// material-ui
import { Button, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { useParams } from 'react-router-dom'; // Import the useParams hook

import { processLink } from 'services/FileDecryption';

// ==============================|| SAMPLE PAGE ||============================== //

const SecretFile = () => {
  const { link } = useParams();
  const decodedMessage = decodeURIComponent(link);

  const getMessage = async () => {
    try {
      const message = await processLink(decodedMessage);
      return message;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const [message, setMessage] = useState('');
  useEffect(() => {
    getMessage().then((resolvedMessage) => {
      // console.log(resolvedMessage);
      setMessage(resolvedMessage);
    });
  }, []);

  const handleDownloadFile = () => {
    console.log(message);
  };

  return (
    <MainCard>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
        <Button variant="contained" color="primary" onClick={handleDownloadFile}>
          Download
        </Button>
      </Stack>
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

export default SecretFile;
