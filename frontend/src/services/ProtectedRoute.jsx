import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = user ? true : false;
    const navigate = useNavigate();
    const location = useLocation();
    const [prevPath, setPrevPath] = useState(null);

    useEffect(() => {
        console.log({ isAuthenticated, currPath: location.pathname, prevPath })
        setPrevPath(location.pathname); // Update previous path
        if (!isAuthenticated) { // if user session expired or logged out
            console.log(1)
            navigate(location.pathname === '/' ? '/' : '/Login', { replace: true });
        }
        else if(isAuthenticated && !prevPath) {
            console.log(4)
            // If there's no previous path, navigate to /DonorDetails
            navigate('/DonorDetails', { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    return children;
}
