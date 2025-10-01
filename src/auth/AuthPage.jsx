import { Box, Button, Container, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import api from '../api';


export default function AuthPage({ onAuthenticated }) {
const [tab, setTab] = useState(0);
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [email, setEmail] = useState('');
const [error, setError] = useState(null);


async function handleRegister(e) {
e.preventDefault();
setError(null);
try {
await api.post('/auth/register/', { username, email, password });
setTab(1);
} catch (err) {
setError(err.response?.data || String(err));
}
}


async function handleLogin(e) {
e.preventDefault();
setError(null);
try {
const res = await api.post('/auth/token/', { username, password });
onAuthenticated(res.data);
} catch (err) {
setError(err.response?.data || String(err));
}
}


return (
<Container maxWidth="sm">
<Paper sx={{ mt: 8, p: 3 }}>
<Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
<Tab label="Register" />
<Tab label="Login" />
</Tabs>
<Box sx={{ mt: 2 }}>
{tab === 0 && (
<Box component="form" onSubmit={handleRegister}>
<TextField label="Username" fullWidth required value={username} onChange={e=>setUsername(e.target.value)} sx={{mb:2}} />
<TextField label="Email" type="email" fullWidth required value={email} onChange={e=>setEmail(e.target.value)} sx={{mb:2}} />
<TextField label="Password" type="password" fullWidth required value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}} />
<Button variant="contained" fullWidth type="submit">Create account</Button>
</Box>
)}


{tab === 1 && (
<Box component="form" onSubmit={handleLogin}>
<TextField label="Username" fullWidth required value={username} onChange={e=>setUsername(e.target.value)} sx={{mb:2}} />
<TextField label="Password" type="password" fullWidth required value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}} />
<Button variant="contained" fullWidth type="submit">Sign in</Button>
</Box>
)}


{error && <Typography color="error" sx={{mt:2}}>{JSON.stringify(error)}</Typography>}
</Box>
</Paper>
</Container>
);
}