import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './App.css';
import { AMINO_ACID_COLORS } from './constants/AMINO_ACID_COLORS';

interface FormInputs {
  sequence1: string;
  sequence2: string;
}

const AminoAcidVisualizer = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>();
  const [sequences, setSequences] = useState<{ seq1: string; seq2: string } | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setSequences({
      seq1: data.sequence1.toUpperCase(),
      seq2: data.sequence2.toUpperCase(),
    });
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      navigator.clipboard.writeText(selection.toString().replace(/\s/g,''));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1000);
    }
  };

  return (
    <Box sx={{ padding: 10, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Визуализация выравнивания аминокислотных последовательностей
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Первая последовательность"
          variant="outlined"
          margin="normal"
          {...register('sequence1', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[ARNDCQEGHILKMFPSTWYV-]+$/i,
              message: 'Допустимы только латинские буквы аминокислот A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V и символ -',
            },
            validate: (val) =>
              val.length === watch('sequence2')?.length ||
              'Последовательности должны быть одинаковой длины'
          })}
          error={!!errors.sequence1}
          helperText={errors.sequence1?.message}
          InputProps={{
            onMouseUp: handleCopy,
            style: { fontFamily: 'monospace' },
          }}
        />

        <TextField
          fullWidth
          label="Вторая последовательность"
          variant="outlined"
          margin="normal"
          {...register('sequence2', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[ARNDCQEGHILKMFPSTWYV-]+$/i,
              message: 'Допустимы только латинские буквы аминокислот A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V и символ -',
            },
            validate: (val) =>
              val.length === watch('sequence1')?.length ||
              'Последовательности должны быть одинаковой длины'
          })}
          error={!!errors.sequence2}
          helperText={errors.sequence2?.message}
          InputProps={{
            onMouseUp: handleCopy,
            style: { fontFamily: 'monospace' },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Визуализировать
        </Button>
      </form>

      {sequences && (
        <Box
          sx={{
            mt: 4,
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '1.2rem',
            lineHeight: '1.8',
          }}
          onMouseUp={handleCopy}
        >
          <div className="sequence-container">
            {sequences.seq1.split('').map((char, idx) => (
              <span
                key={`top-${idx}`}
                className="amino-acid"
                style={{ backgroundColor: AMINO_ACID_COLORS[char] || '#f0f0f0' }}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="sequence-container">
            {sequences.seq2.split('').map((char, idx) => (
              <span
                key={`bottom-${idx}`}
                className="amino-acid"
                style={{
                  backgroundColor: char !== sequences.seq1[idx] ? '#e0e0e0' : 'transparent',
                  color: char !== sequences.seq1[idx] ? '#000' : '#777',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </Box>
      )}

      <Snackbar
        open={showNotification}
        autoHideDuration={1000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">
          Последовательность скопирована в буфер обмена!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AminoAcidVisualizer;
