
import { MapMarkerProps } from '../../types';
import styles from '../../styles.module.css';

const MapMarker = ({ id, top, left, icon, label, onClick }: MapMarkerProps) => {
  const iconClass = icon === 'city' ? 'fas fa-city' : 'fas fa-monument';
  const bgColor = icon === 'city' ? 'bg-primary' : 'bg-accent';
  const borderColor = icon === 'city' ? 'border-t-primary' : 'border-t-accent';

  return (
    <div 
      id={`marker-${id}`} 
      className={`${styles['map-marker']} absolute z-10`}
      style={{ top, left }}
      onClick={() => onClick(id)}
    >
      <div className="relative">
        <div className={`w-6 h-6 ${bgColor} rounded-full flex items-center justify-center text-white`}>
          <i className={`${iconClass} text-xs`}></i>
        </div>
        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${borderColor}`}></div>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
};

export default MapMarker;