import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { Users, Trophy } from 'lucide-react';
import { fetchCurrentQuest, completeQuest } from '../app/features/questSlice';
import { validateImage } from '../utils/fileValidation';
import { toast } from 'sonner';

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentQuest = useSelector((state: RootState) => state.quest.currentQuest);
  const [isCompletionPopupOpen, setIsCompletionPopupOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Array<{ file: File; preview: string }>>([]);
  const [comments, setComments] = useState('');
  const dispatch: AppDispatch = useDispatch();
  // Fetch current quest on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCurrentQuest(user._id));
    }
  }, [user?._id]);

  if (!user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to array and validate each
    const newFiles = Array.from(files);

    for (const file of newFiles) {
      const validation = validateImage(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
    }

    // Check total number of images (existing + new)
    if (selectedPhotos.length + newFiles.length > 5) {
      toast.error('Максимальное количество фотографий - 5');
      return;
    }

    // Create object URLs for preview
    const newPhotos = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleSubmitCompletion = async () => {
    if (!user?._id) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    if (selectedPhotos.length === 0) {
      toast.error('Добавьте хотя бы одну фотографию');
      return;
    }

    try {
      await dispatch(
        completeQuest({
          userId: user._id,
          images: selectedPhotos.map((photo) => photo.file),
          description: comments,
        }),
      ).unwrap();

      // Clean up object URLs
      selectedPhotos.forEach((photo) => URL.revokeObjectURL(photo.preview));

      setIsCompletionPopupOpen(false);
      setSelectedPhotos([]);
      setComments('');
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-500">
                  Присоединился {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/profile/friends"
                className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Друзья</h3>
                  <p className="text-sm text-gray-500">{user.friends.length} друзей</p>
                </div>
              </Link>

              <Link
                to="/profile/quests"
                className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Достижения</h3>
                  <p className="text-sm text-gray-500">{user.completedQuests.length} выполнено</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {currentQuest && (
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Текущее задание</h2>
              <img
                src={currentQuest.photoUrl}
                alt="Место задания"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-4">
                {`${currentQuest.description}, ${currentQuest.country}, ${currentQuest.city}`}
              </p>
              <button onClick={() => setIsCompletionPopupOpen(true)} className="btn btn-primary">
                Отметить выполненным
              </button>
            </div>
          </div>
        )}

        {isCompletionPopupOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Подтверждение выполнения</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Загрузите фото (до 5 шт.)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full"
                  disabled={selectedPhotos.length >= 5}
                />
              </div>

              {selectedPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Фото ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() =>
                          setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsCompletionPopupOpen(false)}
                  className="btn btn-secondary">
                  Отмена
                </button>
                <button
                  onClick={handleSubmitCompletion}
                  className="btn btn-primary"
                  disabled={selectedPhotos.length === 0}>
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
