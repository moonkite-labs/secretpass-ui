import { useState } from 'react';

// material-ui
import {
  FormControl,
  OutlinedInput,
  Button,
  Typography,
  Stack,
  Input,
  FormHelperText,
  Box,
  IconButton,
  Divider,
  TextField,
  Chip,
  Snackbar
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import FormProvider, { RHFRadioGroup } from '../../components/hook-form';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// assets
import { CopyOutlined } from '@ant-design/icons';

import upload from '../../assets/Upload.svg';

import { FileEncryption, SendEmail } from '../../services/FileEncryption';

// ==============================|| SAMPLE PAGE ||============================== //

const FilePage = () => {
  const [encryptedUrl, setEncryptedUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Url, setBase64Url] = useState('');
  const [open, setOpen] = useState(false);
  const [randomPin, setRandomPin] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const TextSchema = Yup.object().shape({
    message: Yup.string().required('Code is required')
  });

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  //   if (file) {
  //     setImagePreviewUrl(URL.createObjectURL(file));
  //     console.log('Image Preview URL:', URL.createObjectURL(file));
  //   }
  // };

  // Inside your handleFileChange function
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      try {
        const encryptedLink = await FileEncryption(file);
        setEncryptedUrl(encryptedLink);
      } catch (error) {
        console.error('Encryption error:', error);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for the image preview

    // Handle the file upload logic here, e.g., send the file to a server.
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  const handleLinkCopyUrl = () => {
    setOpen(true);
    navigator.clipboard.writeText(encryptedUrl);
  };

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
    // Check if a file is selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make the API call to upload the file
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('File upload failed');
      }
    }

    const password = generateRandomPassword(32);
    try {
      const result = await EncryptText(data.message, data.time, password);
      setEncryptedUrl('http://localhost:3000/t/d/' + result.decryptedLink);
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

  const handleLinkCopyPin = () => {
    setOpen(true);
    navigator.clipboard.writeText(randomPin);
  };

  const handleDeleteChip = (chipToDelete) => () => {
    setEmailChips((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const handleClickEncryptButton = async () => {
    try {
      if (selectedFile) {
        const encryptedLink = await FileEncryption(selectedFile);
        setEncryptedUrl(encryptedLink);
      } else {
        console.error('No file selected');
      }
    } catch (error) {
      console.error('Encryption error:', error);
    }
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
          <FormControl sx={{ width: '100%' }}>
            <div>
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                htmlFor="fileInput"
                style={{
                  border: '2px dashed #aaa',
                  borderRadius: '4px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
              >
                {selectedFile ? (
                  <>
                    <img src={imagePreviewUrl} alt="Preview" style={{ maxHeight: '500px', marginBottom: '10px' }} />
                    <span style={{ alignItems: 'center' }}>{selectedFile.name}</span>
                  </>
                ) : (
                  <>
                    <img src={upload} style={{ height: '50px', margin: '10px' }} alt="upload" />
                    <span>Drag and drop files here or click to browse</span>
                  </>
                )}
              </label>
              <Input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                value={''} // Reset the input value
                style={{ display: 'none' }} // Hide the input element
              />
              {selectedFile && (
                <div style={{ display: 'flex' }}>
                  <Button variant="contained" color="error" onClick={handleRemove}>
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </FormControl>

          {!!errors.message && <FormHelperText error sx={{ px: 2 }}></FormHelperText>}

          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <RHFRadioGroup name="time" row label="Erase secret after" options={Time_Validity} />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={handleClickEncryptButton}>
              Encrypt
            </Button>
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
        <Divider sx={{ my: 3.5 }} />
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
        <Typography>The PIN should be shared separately with other communication channels. It&apos;s not included in the email</Typography>{' '}
      </MainCard>
    </>
  );
};

export default FilePage;

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
