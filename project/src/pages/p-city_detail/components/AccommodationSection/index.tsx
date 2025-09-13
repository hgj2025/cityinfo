
import { Link } from 'react-router-dom';
import { Accommodation } from '../../types';
import styles from '../../styles.module.css';

interface AccommodationSectionProps {
  accommodations: Accommodation[];
}

const AccommodationSection: React.FC<AccommodationSectionProps> = ({ accommodations }) => {
  return (
    <section id="accommodation" className="mb-12">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <i className="fas fa-bed text-accent mr-2"></i>住宿
        </h2>
        
        <div id="accommodation-list" className="space-y-6">
          {accommodations.map(accommodation => (
            <Link 
              key={accommodation.id}
              to={`/accommodation-detail?accommodation_id=${accommodation.id}`} 
              id={`accommodation-card-${accommodation.id.replace('nanjing_', '')}`} 
              className={`block bg-white rounded-xl border border-gray-200 overflow-hidden ${styles['card-hover']}`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={accommodation.imageUrl} 
                    alt={accommodation.name} 
                    data-category="住宿" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-4">
                  <div className="flex flex-wrap items-start justify-between mb-2">
                    <h3 className="text-text-primary font-semibold text-lg">{accommodation.name}</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{accommodation.category}</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">{accommodation.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {accommodation.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-text-secondary text-xs px-2 py-1 rounded-full">{amenity}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-text-secondary">
                      <i className="fas fa-map-marker-alt text-accent mr-1"></i>
                      <span>{accommodation.location}</span>
                    </span>
                    <span className="flex items-center text-accent font-medium">
                      <i className="fas fa-yen-sign mr-1"></i>
                      <span>{accommodation.price}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <a href="#" id="more-accommodation-button" className="inline-flex items-center text-accent hover:text-accent/80">
            <span>查看更多住宿</span>
            <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;