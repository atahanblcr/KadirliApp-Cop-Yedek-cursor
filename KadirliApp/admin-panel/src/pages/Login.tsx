import { useState } from 'react';
import { TextInput, Button, Paper, Title, Container, Group, PinInput, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Login() {
  const [phone, setPhone] = useState('+90');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Telefon gir, 2: Kod gir
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await axiosClient.post('/auth/otp', { phone });
      setStep(2);
    } catch (error) {
      alert('Kod gönderilemedi! Backend çalışıyor mu?');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/verify', { phone, code });
      
      // HATA AYIKLAMA: Gelen cevabı konsola yazdıralım
      console.log("BACKEND CEVABI:", res.data);

      // Token bazen 'token', bazen 'access_token' olarak gelir.
      // Hangisi varsa onu alalım.
      // Token'ı her yerde ara: Direkt, access_token olarak veya data kutusunun içinde
      const gelenToken = res.data.token || res.data.access_token || res.data.data?.token || res.data.data?.access_token;

      if (!gelenToken) {
        alert('HATA: Sunucudan token gelmedi! F12 ile Console a bak.');
        console.error("Token bulunamadı. Gelen veri:", res.data);
        setLoading(false);
        return;
      }

      // Token'ı kaydet
      localStorage.setItem('token', gelenToken);
      
      // Başarılı, yönlendir
      navigate('/');
      
    } catch (error) {
      alert('Hatalı kod veya sunucu hatası!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Admin Girişi</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {step === 1 ? (
          <>
            <TextInput 
                label="Telefon Numarası" 
                placeholder="+90555..." 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
            />
            <Button fullWidth mt="xl" onClick={handleSendCode} loading={loading}>
              Kod Gönder
            </Button>
          </>
        ) : (
          <>
            <Text size="sm" ta="center" mb="md">Telefonuna gelen kodu gir</Text>
            <Group justify="center">
                <PinInput length={6} type="number" value={code} onChange={setCode} />
            </Group>
            <Button fullWidth mt="xl" onClick={handleVerify} loading={loading}>
              Giriş Yap
            </Button>
            <Button variant="subtle" fullWidth mt="sm" onClick={() => setStep(1)}>
                Geri Dön
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}