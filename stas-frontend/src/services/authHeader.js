export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user && user.email && user.password) {
        const encoded = btoa(`${user.email}:${user.password}`);
        return {
            headers: {
                Authorization: `Basic ${encoded}`,
            },
        };
    }
    return {};
}