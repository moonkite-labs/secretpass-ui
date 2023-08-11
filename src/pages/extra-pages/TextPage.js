import { useState } from 'react';

// material-ui
import {
  FormControl,
  OutlinedInput,
  Button,
  Typography,
  Stack,
  // RadioGroup,
  // FormControlLabel,
  // Radio,
  FormHelperText,
  Snackbar,
  Box,
  IconButton
} from '@mui/material';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFMultiLineTextField, RHFRadioGroup } from '../../components/hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';

// project import
import MainCard from 'components/MainCard';

// Service Import
// import { encryptMessage } from '../../services/TextEncryption';

// assets
import { CopyOutlined } from '@ant-design/icons';
import { EncryptText } from 'services/TextEncryption';

// ==============================|| SAMPLE PAGE ||============================== //

const TextPage = () => {
  const [encryptedUrl, setEncryptedUrl] = useState('');
  const [open, setOpen] = useState(false);

  const TextSchema = Yup.object().shape({
    message: Yup.string().required('Code is required')
  });
  const defaultValues = {
    message: '',
    time: 'once'
  };
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(TextSchema),
    defaultValues
  });
  const {
    handleSubmit,
    formState: { errors }
  } = methods;

  const onSubmit = async (data) => {
    const password = generateRandomPassword(32);
    try {
      const encryptedLink = await EncryptText(data.message, data.time, password);
      setEncryptedUrl(encryptedLink);
      console.log('Selected Radio Value:', data.time);
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  const generateRandomPassword = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  };

  const handleCopy = () => {
    setOpen(true);
    navigator.clipboard.writeText(encryptedUrl);
  };

  return (
    <>
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
      <MainCard>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFMultiLineTextField name="message" />
          {!!errors.message && <FormHelperText error sx={{ px: 2 }}></FormHelperText>}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Button
              size="small"
              variant="contained"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => {
                methods.reset();
              }}
            >
              Clear
            </Button>
            <Typography>maximum characters count is 1000</Typography>
          </Stack>
          <RHFRadioGroup name="time" row label="Erase secret after" options={Time_Valid} />
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <LoadingButton size="small" variant="contained" sx={{ textTransform: 'capitalize' }} type="submit">
              Encrypt
            </LoadingButton>
          </Stack>
        </FormProvider>
        <Stack direction="row" spacing={2}>
          <Box display="flex" alignItems="center">
            <Typography>Share this link:</Typography>
          </Box>
          <FormControl sx={{ width: { xs: '100%', md: 500 } }}>
            <OutlinedInput
              size="medium"
              id="header-search"
              aria-describedby="header-search-text"
              inputProps={{
                'aria-label': 'weight'
              }}
              placeholder="Encrypted Text"
              value={encryptedUrl}
            />
          </FormControl>
          <IconButton size="medium" variant="contained" sx={{ display: 'flex', px: 1, textTransform: 'capitalize' }} onClick={handleCopy}>
            <Box display="flex" alignItems="center">
              <CopyOutlined />
            </Box>
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
          <Stack>
            <Typography sx={{ mt: 3.5 }}>
              You can share the link with your choice of communication channels like Slack DM,<br></br> WhatsApp, Telegram and etc. Please
              be cautious cautious not to share in the public channel
            </Typography>
          </Stack>
        </Stack>
        <Typography sx={{ my: 3.5 }}>
          You also can share the link secured link above via email but it must be protected with the PIN. The PIN must be shared secretly in{' '}
          <br></br>
          order to avoid the information breached by other unintended person
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
          <Typography>Enter Your PIN:</Typography>
          <FormControl sx={{ width: { xs: '100%', md: 500 } }}>
            <OutlinedInput
              size="small"
              id="header-search"
              aria-describedby="header-search-text"
              inputProps={{
                'aria-label': 'weight'
              }}
              placeholder="Ctrl + K"
            />
          </FormControl>
          <Typography>or leave it blank for auto generated PIN:</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
          <FormControl sx={{ width: '25%' }}>
            <OutlinedInput
              size="small"
              id="header-search"
              aria-describedby="header-search-text"
              inputProps={{
                'aria-label': 'weight'
              }}
              placeholder="Ctrl + K"
            />
          </FormControl>
          <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
            Encrypt & Send
          </Button>{' '}
        </Stack>
        <Typography sx={{ mt: 3.5 }}>
          Warning! Remember that secrets can only be downloaded once if not set otherwise. So do not open the link yourself.
        </Typography>
        <Typography>The PIN should be shared separately with other communication channels. It{`'`}s not included in the email </Typography>
      </MainCard>
    </>
  );
};

export default TextPage;

const Time_Valid = [
  {
    value: 'once',
    label: 'Once Received'
  },
  {
    value: 60 * 60,
    label: '1 hour'
  },
  {
    value: 12 * 60 * 60,
    label: '12 hour'
  },
  {
    value: 24 * 60 * 60,
    label: '1 day'
  },
  {
    value: 7 * 24 * 60 * 60,
    label: '1 week'
  }
];
