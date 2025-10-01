import { useState } from 'react';


export default function useAuth() {
const [user, setUser] = useState(() => {
try {
const raw = localStorage.getItem('user');
return raw ? JSON.parse(raw) : null;
} catch { return null; }
});


function saveTokens(data) {
localStorage.setItem('access', data.access);
localStorage.setItem('refresh', data.refresh);
}


function clear() {
localStorage.removeItem('access');
localStorage.removeItem('refresh');
localStorage.removeItem('user');
setUser(null);
}


function setUserFromToken(payload) {
localStorage.setItem('user', JSON.stringify(payload));
setUser(payload);
}


return { user, setUserFromToken, saveTokens, clear };
}