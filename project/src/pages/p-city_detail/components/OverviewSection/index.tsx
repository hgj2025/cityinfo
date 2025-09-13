
const OverviewSection: React.FC = () => {
  return (
    <section id="overview" className="mb-12">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <i className="fas fa-info-circle text-accent mr-2"></i>城市概览
        </h2>
        
        {/* 历史沿革 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">历史沿革</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <p className="text-text-secondary mb-4">南京，简称"宁"，古称金陵、建康，是江苏省会、副省级市、特大城市，国务院批复确定的中国东部地区重要的中心城市、全国重要的科研教育基地和综合交通枢纽。</p>
              <p className="text-text-secondary mb-4">南京是中国四大古都之一，有着7000多年文明史、近2600年建城史和近500年的建都史，曾数次庇佑华夏之正朔，是中华文明的重要发祥地，历史上曾长期是中国南方的政治、经济、文化中心。</p>
              <p className="text-text-secondary">南京先后成为东吴、东晋、宋、齐、梁、陈、南唐、明、太平天国等十个朝代的都城，故有"六朝古都，十朝都会"之称。</p>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1555921015-5532091f6026" 
                alt="南京历史" 
                data-category="历史" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* 文化特色 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">文化特色</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1555921015-5532091f6026" 
                alt="南京文化" 
                data-category="文化" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <p className="text-text-secondary mb-4">南京文化底蕴深厚，是中华文化的重要发祥地之一。金陵文化是南京历史文化的重要组成部分，以其独特的地域特色和深厚的历史积淀，在中国文化史上占有重要地位。</p>
              <p className="text-text-secondary mb-4">南京是中国四大古都之一，历史上曾是吴、东吴、东晋、宋、齐、梁、陈、南唐、明、太平天国等政权的都城，形成了独特的六朝文化、明朝文化等。</p>
              <p className="text-text-secondary">南京拥有丰富的文化遗产，包括明孝陵、中山陵、夫子庙、秦淮河等著名景点，以及众多的博物馆、纪念馆等文化场所。</p>
            </div>
          </div>
        </div>
        
        {/* 风俗习惯 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">风俗习惯</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <p className="text-text-secondary mb-4">南京人的生活习惯深受江南文化的影响，讲究精致与内敛。南京人喜欢喝茶，尤其是雨花茶，这已成为南京人日常生活中不可或缺的一部分。</p>
              <p className="text-text-secondary mb-4">南京人过年有"挂春联、贴年画、放鞭炮、吃年夜饭"等传统习俗。元宵节时，南京人有赏花灯、猜灯谜、吃元宵的习俗。清明节扫墓祭祖，端午节包粽子、赛龙舟，中秋节赏月、吃月饼等传统节日习俗在南京也保留完好。</p>
              <p className="text-text-secondary">南京人的饮食习惯偏甜，口味清淡，讲究色香味俱全，代表性的传统美食有盐水鸭、鸭血粉丝汤、牛肉锅贴、桂花鸭等。</p>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1528825871115-3581a5387919" 
                alt="南京风俗" 
                data-category="文化" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* 艺术与非遗 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">艺术与非物质文化遗产</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-primary/5 rounded-lg p-4 h-full">
                <h4 className="font-medium text-primary mb-2">云锦</h4>
                <p className="text-text-secondary text-sm">南京云锦是中国著名的传统丝织工艺品，与蜀锦、宋锦、壮锦并称为"中国四大名锦"。南京云锦织造技艺已被列入国家级非物质文化遗产名录。</p>
              </div>
            </div>
            <div>
              <div className="bg-primary/5 rounded-lg p-4 h-full">
                <h4 className="font-medium text-primary mb-2">金陵刻经</h4>
                <p className="text-text-secondary text-sm">金陵刻经是中国佛教文化的重要组成部分，始于南朝，盛于明清，是中国古代雕版印刷的杰出代表。</p>
              </div>
            </div>
            <div>
              <div className="bg-primary/5 rounded-lg p-4 h-full">
                <h4 className="font-medium text-primary mb-2">南京剪纸</h4>
                <p className="text-text-secondary text-sm">南京剪纸具有浓郁的地方特色，题材广泛，技法精湛，是江南民间艺术的重要组成部分。</p>
              </div>
            </div>
            <div>
              <div className="bg-primary/5 rounded-lg p-4 h-full">
                <h4 className="font-medium text-primary mb-2">金陵十三钗</h4>
                <p className="text-text-secondary text-sm">金陵十三钗是南京秦淮河畔的名妓群体，她们多才多艺，精通诗词歌赋，在中国文化史上留下了浓墨重彩的一笔。</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 节庆活动 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-3">节庆活动</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-primary/5">
                  <th className="py-3 px-4 text-left text-text-primary font-medium">节庆名称</th>
                  <th className="py-3 px-4 text-left text-text-primary font-medium">举办时间</th>
                  <th className="py-3 px-4 text-left text-text-primary font-medium">主要活动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-text-secondary">南京国际梅花节</td>
                  <td className="py-3 px-4 text-text-secondary">每年2-3月</td>
                  <td className="py-3 px-4 text-text-secondary">梅花展览、文艺表演、摄影比赛</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-text-secondary">南京国际爵士乐节</td>
                  <td className="py-3 px-4 text-text-secondary">每年10月</td>
                  <td className="py-3 px-4 text-text-secondary">爵士音乐会、街头表演、音乐工作坊</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-text-secondary">金陵灯会</td>
                  <td className="py-3 px-4 text-text-secondary">农历正月十五前后</td>
                  <td className="py-3 px-4 text-text-secondary">花灯展示、民俗表演、猜灯谜</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-text-secondary">南京国际美食节</td>
                  <td className="py-3 px-4 text-text-secondary">每年9-10月</td>
                  <td className="py-3 px-4 text-text-secondary">美食展示、烹饪比赛、文化交流</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 名人与历史故事 */}
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-3">名人与历史故事</h3>
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">郑和下西洋</h4>
              <p className="text-text-secondary text-sm">明朝时期，郑和七次从南京出发下西洋，足迹遍及东南亚、南亚、西亚和东非等30多个国家和地区，是中国古代航海史上的壮举。</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">李白与南京</h4>
              <p className="text-text-secondary text-sm">唐代诗人李白曾多次游览南京，留下了"钟山只隔数重山，潮打江南第一山"等脍炙人口的诗句。</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">孙中山与中山陵</h4>
              <p className="text-text-secondary text-sm">中山陵是中国近代伟大的民主革命先行者孙中山先生的陵墓，建于1926年至1929年，是中国近代建筑史上的经典之作。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;