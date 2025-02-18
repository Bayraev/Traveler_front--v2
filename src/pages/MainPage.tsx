import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { AppDispatch, RootState } from '../app/store';
import { setMapPosition } from '../app/features/mapSlice';
import { rollNewQuest, closeTaskPopup } from '../app/features/questSlice';
import { MapPinned } from 'lucide-react';
import siteConfig from '../config/siteConfig.json';
import { toast } from 'sonner';

const MainPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<OLMap | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const mapState = useSelector((state: RootState) => state.map);
  const { currentQuest, isTaskPopupOpen } = useSelector((state: RootState) => state.quest);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!mapRef.current) return;

    map.current = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([mapState.longitude, mapState.latitude]),
        zoom: mapState.zoom,
      }),
    });

    const view = map.current.getView();
    view.on('change', () => {
      const center = view.getCenter();
      if (center) {
        const [longitude, latitude] = fromLonLat(center, 'EPSG:4326');
        dispatch(
          setMapPosition({
            longitude,
            latitude,
            zoom: view.getZoom() || siteConfig.map.defaultZoom,
          }),
        );
      }
    });

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, []);

  const handleRollTask = async () => {
    if (!currentUser?._id) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    try {
      await dispatch(rollNewQuest(currentUser._id));
    } catch (error) {
      toast.error('Не удалось выкрутить квест, непредвиденная ошибка..');
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div ref={mapRef} className="w-full h-full" />

      <div className="absolute bottom-8 right-8 z-10">
        <button
          onClick={handleRollTask}
          className="btn btn-primary flex items-center space-x-2 shadow-lg">
          <MapPinned className="h-5 w-5" />
          <span>Получить задание</span>
        </button>
      </div>

      {isTaskPopupOpen && currentQuest && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuest.country}, {currentQuest.city}
            </h2>
            <img
              src={currentQuest.photoUrl}
              alt="Место задания"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-6">{currentQuest.description}</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => dispatch(closeTaskPopup())} className="btn btn-secondary">
                Принять
              </button>
              <button onClick={handleRollTask} className="btn btn-primary">
                Другое задание
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
