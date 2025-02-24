import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { Users, Trophy, Pen, Camera } from 'lucide-react';
import { fetchCurrentQuest, completeQuest } from '../app/features/questSlice';
import { validateImage } from '../utils/fileValidation';
import { toast } from 'sonner';
import { updateAvatar } from '../app/features/userSlice';

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentQuest = useSelector((state: RootState) => state.quest.currentQuest);
  const [isCompletionPopupOpen, setIsCompletionPopupOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Array<{ file: File; preview: string }>>([]);
  const [comments, setComments] = useState('');
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setNewAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpdate = async () => {
    if (!user?._id || !newAvatar) return;

    try {
      await dispatch(updateAvatar({ userId: user._id, avatar: newAvatar })).unwrap();
      setIsAvatarPopupOpen(false);
      setNewAvatar(null);
      setAvatarPreview('');
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  const handleAvatarClick = () => {
    setIsAvatarPopupOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pen className="h-6 w-6 text-white" />
                </div>
              </div>
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
                </div>
              </Link>

              <Link
                to="/profile/quests"
                className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Достижения</h3>
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

        {/* Avatar update popup */}
        {isAvatarPopupOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <h2 className="text-xl font-bold mb-4">Обновить аватар</h2>

              <div className="flex justify-center mb-4">
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="New avatar preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsAvatarPopupOpen(false);
                    setNewAvatar(null);
                    setAvatarPreview('');
                  }}
                  className="btn btn-secondary">
                  Отмена
                </button>
                <button
                  onClick={handleAvatarUpdate}
                  className="btn btn-primary"
                  disabled={!newAvatar}>
                  Сохранить
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
