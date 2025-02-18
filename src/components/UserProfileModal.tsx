import React from 'react';
import { X } from 'lucide-react';
import { QuestCompletion, Friend } from '../types';

interface UserProfileModalProps {
  user: Friend;
  completedQuests: QuestCompletion[];
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal = ({ user, completedQuests, isOpen, onClose }: UserProfileModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-sm text-gray-500">
                Добавлен в друзья с {new Date(user.addedAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Completed Quests */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
          <h3 className="text-lg font-semibold mb-4">Выполненные задания</h3>
          {completedQuests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Нет выполненных заданий</p>
          ) : (
            <div className="grid gap-6">
              {completedQuests.map((quest) => (
                <div key={quest._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={quest.images[0]}
                      alt="Quest completion"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">
                        {quest.country}, {quest.city}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {/* Выполнено: {new Date(quest.completedAt).toLocaleDateString('ru-RU')} */}
                      </p>
                      {quest.images.length > 1 && (
                        <div className="flex gap-2 mt-2">
                          {quest.images.slice(1).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Additional photo ${index + 1}`}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
