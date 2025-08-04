import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
} from '@mui/material'
import { Logout } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { imageService } from '@/services/imageService'
import { Image, GenerateImageData, ApiError } from '@/types'

export const HomePage: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string>('')
  const [savedImages, setSavedImages] = useState<Image[]>([])
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [currentPrompt, setCurrentPrompt] = useState<string>('')

  const { user, logout } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateImageData>()

  useEffect(() => {
    const loadUserImages = async (): Promise<void> => {
      if (!user) return

      try {
        setIsLoadingImages(true)
        const images = await imageService.getUserImages(user.id)
        setSavedImages(images)
      } catch (err) {
        const apiError = err as ApiError
        setError(`Помилка завантаження зображень: ${apiError.message}`)
      } finally {
        setIsLoadingImages(false)
      }
    }

    loadUserImages()
  }, [user])

  const handleGenerateImage = async (data: GenerateImageData): Promise<void> => {
    try {
      setIsGenerating(true)
      setError('')
      setSuccess('')
      setGeneratedImage('')
      setCurrentPrompt(data.prompt)

      const response = await imageService.generateImage(data)
      setGeneratedImage(response.imageUrl)
    } catch (err) {
      const apiError = err as ApiError
      setError(`Помилка генерації: ${apiError.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveImage = async (): Promise<void> => {
    if (!generatedImage || !currentPrompt) return

    try {
      setIsSaving(true)
      setError('')
      
      const savedImage = await imageService.saveImage(generatedImage, currentPrompt)
      setSavedImages(prev => [savedImage, ...prev])
      setSuccess('Зображення збережено!')
      
      // Очищаємо форму та згенероване зображення
      setGeneratedImage('')
      setCurrentPrompt('')
      reset()
    } catch (err) {
      const apiError = err as ApiError
      setError(`Помилка збереження: ${apiError.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Img Generator
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Generator Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Генератор зображень
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(handleGenerateImage)} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Опишіть зображення, яке хочете згенерувати"
              placeholder="Наприклад: красивий захід сонця над морем..."
              {...register('prompt', {
                required: 'Опис зображення обов\'язковий',
                minLength: {
                  value: 10,
                  message: 'Опис повинен містити мінімум 10 символів',
                },
              })}
              error={!!errors.prompt}
              helperText={errors.prompt?.message}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isGenerating}
              sx={{ mr: 2 }}
            >
              {isGenerating ? 'Генерація...' : 'Генерувати'}
            </Button>
          </Box>

          {isGenerating && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={60} />
            </Box>
          )}

          {generatedImage && (
            <Box>
              <Card sx={{ maxWidth: 512, mx: 'auto', mb: 2 }}>
                <CardMedia
                  component="img"
                  image={generatedImage}
                  alt="Згенероване зображення"
                  sx={{ width: '100%', height: 'auto' }}
                />
              </Card>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveImage}
                  disabled={isSaving}
                >
                  {isSaving ? 'Збереження...' : 'Зберегти'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Gallery Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Ваші збережені зображення
          </Typography>

          {isLoadingImages ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : savedImages.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              У вас ще немає збережених зображень
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {savedImages.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image.imageUrl}
                      alt={image.prompt}
                    />
                    <Box p={2}>
                      <Typography variant="body2" color="text.secondary">
                        {image.prompt}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(image.createdAt).toLocaleDateString('uk-UA')}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </>
  )
} 