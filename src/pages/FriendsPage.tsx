import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchFriends, addFriend } from '../store/slices/friendSlice';
import { UserPlus, Users } from 'lucide-react';

const FriendsPage = () => {
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { friends, loading } = useSelector((state: RootState) => state.friend);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFriends(currentUser._id));
    }
  }, [currentUser, dispatch]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(addFriend(newFriendUsername)).unwrap();
      setNewFriendUsername('');
    } catch (err) {
      setError('Пользователь не найден');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Мои друзья</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleAddFriend} className="flex gap-4">
            <div className="flex-grow">
              <input
                type="text"
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
                placeholder="Имя пользователя"
                className="input"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Добавить друга</span>
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">У вас пока нет друзей. Добавьте кого-нибудь!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex items-center p-4">
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{friend.username}</h3>
                  <p className="text-sm text-gray-500">
                    В системе с {new Date(friend.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
