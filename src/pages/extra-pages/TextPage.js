// material-ui
import { FormControl, OutlinedInput, Button, Typography, Stack, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFMultiLineTextField } from '../../components/hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const TextPage = () => {
  const TextSchema = Yup.object().shape({
    message: Yup.string().required('Code is required')
  });
  const defaultValues = {
    message: ''
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
    console.log(data);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   console.log('DATA:', {
    //     email: data.email,
    //     code: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
    //     password: data.password
    //   });
    //   sessionStorage.removeItem('email-recovery');
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return (
    <>
      <MainCard>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFMultiLineTextField name="message" />
          {!!errors.message && <FormHelperText error sx={{ px: 2 }}></FormHelperText>}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Clear
            </Button>
            <Typography>maximum characters count is 1000</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Typography>Erase secret after →</Typography>
            <FormControl>
              <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
                <FormControlLabel value="female" control={<Radio />} label="Once received" />
                <FormControlLabel value="male" control={<Radio />} label="10 minutes" />
                <FormControlLabel value="other" control={<Radio />} label="1 hour" />
                <FormControlLabel value="other" control={<Radio />} label="12 hour" />
                <FormControlLabel value="other" control={<Radio />} label="1 day" />
                <FormControlLabel value="other" control={<Radio />} label="1 week" />
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <LoadingButton size="small" variant="contained" sx={{ textTransform: 'capitalize' }} type="submit">
              Encrypt
            </LoadingButton>
          </Stack>
        </FormProvider>
        <Stack direction="row" spacing={2} alignItems="start" sx={{ py: 2 }}>
          <Stack>
            <Stack direction="row" spacing={2}>
              <Typography>Share this link</Typography>
              <Typography>https://secretpass.my/t/p/8myrbyffibavs0pdip6x3uhn990ndxz</Typography>
            </Stack>
            <Typography sx={{ mt: 3.5 }}>
              You can share the link with your choice of communication channels like Slack DM,<br></br> WhatsApp, Telegram and etc. Please
              be cautious cautious not to share in the public channel
            </Typography>
          </Stack>
          <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
            Copy
          </Button>
        </Stack>
        <Typography sx={{ my: 3.5 }}>
          You also can share the link secured link above via email but it must be protected with the PIN. The PIN must be shared secretly in{' '}
          <br></br>
          order to avoid the information breached by other unintended person
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
          <Typography>Enter Your PIN:</Typography>
          <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
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
