import * as React from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router'

type Inputs = {
  password: string
}

interface VerifiAccessProps {
  handleSuccess: (data: any) => void
}

export function VerifiAccess({ handleSuccess }: VerifiAccessProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // const res = await axios.get(
      //   `${
      //     process.env.NEXT_PUBLIC_APP_API_URL
      //   }/checklists/${'59a780af-a647-4391-9478-297458835da4'}?document=${5573652877}`,
      // )
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/checklists/${router.query.id}?document=${data.password}`,
      )
      handleSuccess(res.data.data)
    } catch (e) {
      setError('password', { type: 'custom', message: 'Digite sua senha!' })
    }
  }
  // 59a780af-a647-4391-9478-297458835da4?document={5573652877}`,

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography component="h1" variant="h6">
          Digite a senha para visualização
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 2 }}
        >
          <FormControl sx={{ width: '100%' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              CPF/CNPJ
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="CPF/CNPJ"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <span
                style={{
                  fontSize: '14px',
                  color: 'red',
                  marginTop: '5px',
                }}
              >
                Digite sua senha!
              </span>
            )}
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              color: 'white',
              background: '#0E948B',
              padding: '7px 10px',
              mt: 2,
              mb: 2,
              textTransform: 'uppercase',
              '&:hover': {
                background: '#1ACABA',
              },
              '&:disabled': {
                background: '#e0f2f1',
              },
            }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
