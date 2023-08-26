import { useState } from 'react';

// material-ui
import {
  FormControl,
  OutlinedInput,
  Button,
  Typography,
  Stack,
  FormHelperText,
  Snackbar,
  Box,
  IconButton,
  Divider,
  TextField,
  Chip
} from '@mui/material';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFMultiLineTextField, RHFRadioGroup } from '../../components/hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';

// project import
import MainCard from 'components/MainCard';

// assets
import { CopyOutlined } from '@ant-design/icons';

// Service Import
import { EncryptText } from 'services/TextEncryption';

import { WEB_TEXT_DECRYPTION_URL } from '../../api/routes';
import { RandomPasswordGenerator } from '../../utils/PwdGen';
import { SendEmail } from 'services/EmailService';

// ==============================|| SAMPLE PAGE ||============================== //

const TextPage = () => {
  const [base64Url, setBase64Url] = useState('');
  const [encryptedUrl, setEncryptedUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [randomPin, setRandomPin] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState([]);

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
    const password = RandomPasswordGenerator(32);
    try {
      const result = await EncryptText(data.message, data.time, password);
      setEncryptedUrl(`${WEB_TEXT_DECRYPTION_URL}${result.decryptedLink}`);
      setBase64Url(result.decryptedLink);
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      console.log('Emails: ', emailChips);
      console.log('Encrypted URL: ', base64Url);
      const result = await SendEmail(emailChips, base64Url);
      if (result.emailSent) {
        console.log('Random PIN: ', result.pin);
        setRandomPin(result.pin);
        alert('Email Sent');
      }
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  const handleLinkCopyUrl = () => {
    setOpen(true);
    navigator.clipboard.writeText(encryptedUrl);
  };
  const handleLinkCopyPin = () => {
    setOpen(true);
    navigator.clipboard.writeText(randomPin);
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleEmailInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newEmail = emailInput.trim();
      if (newEmail) {
        setEmailChips([...emailChips, newEmail]);
        setEmailInput('');
      }
    }
  };

  const handleDeleteChip = (chipToDelete) => () => {
    setEmailChips((chips) => chips.filter((chip) => chip !== chipToDelete));
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
          <RHFRadioGroup name="time" row label="Erase secret after" options={Time_Validity} />
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
          <FormControl sx={{ width: { xs: '100%', md: '85%' } }}>
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
          <IconButton
            size="medium"
            variant="contained"
            sx={{ display: 'flex', px: 1, textTransform: 'capitalize' }}
            onClick={handleLinkCopyUrl}
          >
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
        <Divider />
        <Typography sx={{ my: 3.5 }}>
          You also can share the link secured link above via email but it must be protected with the PIN. The PIN must be shared secretly in
          order to avoid the information breached by other unintended person
        </Typography>
        <Typography sx={{ my: 3.5 }}>Email Secured Link</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Enter Email(s)"
              variant="outlined"
              fullWidth
              value={emailInput}
              onChange={handleEmailInputChange}
              onKeyDown={handleEmailInputKeyDown}
              placeholder="Enter email and press Enter or comma"
            />
            <div>
              {emailChips.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={handleDeleteChip(email)}
                  color="primary"
                  variant="outlined"
                  style={{ margin: '5px' }}
                />
              ))}
            </div>
          </Box>
        </Stack>
        <Typography>separate by pressing &apos;ENTER&apos; for more email </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
          <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={handleSendEmail}>
            Send Email with PIN
          </Button>
          <FormControl>
            <OutlinedInput
              size="small"
              id="header-search"
              aria-describedby="header-search-text"
              inputProps={{
                'aria-label': 'weight'
              }}
              value={randomPin}
              placeholder="Ctrl + K"
            />
          </FormControl>
          <IconButton
            size="medium"
            variant="contained"
            sx={{ display: 'flex', px: 1, textTransform: 'capitalize' }}
            onClick={handleLinkCopyPin}
          >
            <Box display="flex" alignItems="center">
              <CopyOutlined />
            </Box>
          </IconButton>
        </Stack>
        <Typography>
          Warning! Remember that secrets can only be downloaded once if not set otherwise. So do not open the link yourself.
        </Typography>
        <Typography>The PIN should be shared separately with other communication channels. It&apos;s not included in the email</Typography>
      </MainCard>
    </>
  );
};

export default TextPage;

const Time_Validity = [
  {
    value: 'once',
    label: 'Once Received'
  },
  {
    value: 3600,
    label: '1 hour'
  },
  {
    value: 43200,
    label: '12 hour'
  },
  {
    value: 86400,
    label: '1 day'
  },
  {
    value: 604800,
    label: '1 week'
  }
];
