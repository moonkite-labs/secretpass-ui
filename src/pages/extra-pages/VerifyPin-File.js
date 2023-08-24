// material-ui
import { Typography, Stack, FormHelperText, Box, Button } from '@mui/material';
import FormProvider, { RHFCodes } from '../../components/hook-form';
// import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { validatePin } from 'services/FileDecryption';

import { useParams } from 'react-router-dom'; // Import the useParams hook

// ==============================|| SAMPLE PAGE ||============================== //

const FilePage = () => {
  const { link } = useParams();
  const decodedMessage = decodeURIComponent(link);
  // const navigate = useNavigate();

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required')
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: ''
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues
  });

  const {
    handleSubmit,
    formState: { errors }
  } = methods;

  const onSubmit = async (data) => {
    const response = await validatePin(data, decodedMessage);
    if (response.status == 'success') {
      // navigate(`/t/d/${response.decryptedLink}`);
      console.log(response);
    }
    // ADD FAILED PIN ENTERED FLOW HERE
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '750px'
      }}
    >
      <Typography variant="h3" paragraph>
        Enter 6 digit PIN
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFCodes keyName="code" inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} />

          {(!!errors.code1 || !!errors.code2 || !!errors.code3 || !!errors.code4 || !!errors.code5 || !!errors.code6) && (
            <FormHelperText error sx={{ px: 2 }}>
              Code is required
            </FormHelperText>
          )}

          <Button fullWidth size="large" type="submit" variant="contained" sx={{ mt: 3 }}>
            Verify
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );
};

export default FilePage;
