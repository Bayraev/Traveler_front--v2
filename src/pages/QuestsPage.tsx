import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Trophy } from 'lucide-react';
import { fetchCompletedQuests } from '../app/features/questSlice';
import { AppDispatch } from '../app/store';

const QuestsPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { completedQuests, loading } = useSelector((state: RootState) => state.quest);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchCompletedQuests(currentUser._id));
    }
  }, [currentUser?._id, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Мои достижения</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : completedQuests?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              У вас пока нет выполненных заданий. Начните свое путешествие прямо сейчас!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {completedQuests?.map((completion) => (
              <div key={completion._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  {completion.photos?.length > 0 && (
                    <img
                      src={completion.photos[0]}
                      alt="Фото выполненного задания"
                      className="object-cover w-full h-48"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Задание выполнено</h3>
                    <span className="text-sm text-gray-500">
                      {/* {new Date(completion.completedAt).toLocaleDateString('ru-RU')} */}
                    </span>
                  </div>
                  {completion.description && (
                    <p className="text-gray-600 mb-4">{completion.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {/* {completion.photos?.slice(1).map((photo, index) => (
                      
                    ))} */}
                    <img
                      src={completion.photoUrl}
                      alt={completion.description}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
