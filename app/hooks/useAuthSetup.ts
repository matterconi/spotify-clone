import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '../../redux/store';
import { setAccessToken, setUser } from '../../redux/authSlice';

export const useAuthSetup = () => {
  const { data: session } = useSession(); // Fetch the session
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session) {
      // Safely update Redux store on the client side
      dispatch(setAccessToken(session.accessToken));
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);
};
