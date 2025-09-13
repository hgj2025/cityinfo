
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CityId, CityName } from '../../types';
import AirportStationSection from './AirportStationSection';
import InterAttractionSection from './InterAttractionSection';
import CityTrafficSection from './CityTrafficSection';
import TicketInfoSection from './TicketInfoSection';
import TrafficTipsSection from './TrafficTipsSection';

interface TrafficContentProps {
  cityId: CityId;
  cityName: CityName;
}

const TrafficContent = ({ cityId, cityName }: TrafficContentProps) => {
  return (
    <div id="content-area" className="flex-1">
      {/* 面包屑导航 */}
      <div id="breadcrumb" className="flex items-center text-sm text-text-secondary mb-4">
        <Link to="/home" className="hover:text-primary">首页</Link>
        <i className="fas fa-chevron-right text-xs mx-2"></i>
        <Link to={`/city-detail?city_id=${cityId}`} className="hover:text-primary">{cityName}</Link>
        <i className="fas fa-chevron-right text-xs mx-2"></i>
        <span className="text-primary">交通指南</span>
      </div>

      {/* 页面标题 */}
      <div id="page-header" className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{cityName}交通指南</h1>
        <p className="text-text-secondary mt-2">了解{cityName}市内外交通方式，轻松规划您的出行路线</p>
      </div>

      {/* 交通指南内容 */}
      <div id="traffic-content" className="space-y-6">
        {/* 机场/火车站交通 */}
        <AirportStationSection />
        
        {/* 景点间交通路线 */}
        <InterAttractionSection />
        
        {/* 市内交通概览 */}
        <CityTrafficSection />
        
        {/* 交通卡/票务信息 */}
        <TicketInfoSection />
        
        {/* 交通贴士 */}
        <TrafficTipsSection />
      </div>
    </div>
  );
};

export default TrafficContent;
