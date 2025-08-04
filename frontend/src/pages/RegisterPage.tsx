import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterData, ApiError } from '@/types'

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const handleRegister = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true)
      setError('')
      await registerUser(data.email, data.password)
      navigate('/')
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Img Generator
          </Typography>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Реєстрація
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(handleRegister)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'Email обов\'язковий',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Невірний формат email',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Пароль обов\'язковий',
                minLength: {
                  value: 6,
                  message: 'Пароль повинен містити мінімум 6 символів',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Підтвердження паролю"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Підтвердження паролю обов\'язкове',
                validate: (value: string) =>
                  value === password || 'Паролі не співпадають',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Реєстрація...' : 'Зареєструватись'}
            </Button>
            <Box textAlign="center">
              <Link to="/login">
                Вже є акаунт? Увійдіть
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
} 