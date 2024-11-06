// hooks/usePlaylistActions.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { renamePlaylistThunk, deletePlaylistThunk } from '../../redux/musicThunks'; // Adjusted to use thunks
import { RootState } from '../../redux/store'; // Import RootState for state access
import { toast } from 'react-toastify'; // Import toast


export const usePlaylistActions = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken);

  const rename = useCallback(
    (playlistId: string, newName: string) => {
      if (accessToken) {
        try {
          dispatch(renamePlaylistThunk({ playlistId, newName }));
          toast.success(`Playlist renamed to "${newName}" successfully!`);
        } catch (error) {
            console.error('Error deleting playlist', error)
        }
      } else {
        console.error('No access token available for renaming playlist.');
      }
    },
    [dispatch, accessToken]
  );

  const remove = useCallback(
    (playlistId: string) => {
      if (accessToken) {
        try {
          dispatch(deletePlaylistThunk(playlistId));
          toast.success('Playlist deleted successfully!');
        }
        catch (error) {
          console.error('Error deleting playlist', error)
        }
      } else {
        console.error('No access token available for deleting playlist.');
      }
    },
    [dispatch, accessToken]
  );

  return { rename, remove };
};
