import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedNanjingOverview() {
  console.log('开始初始化南京城市概览数据...');

  const nanjingCityId = '550e8400-e29b-41d4-a716-446655440004';

  // 检查城市是否存在
  const city = await prisma.city.findUnique({
    where: { id: nanjingCityId }
  });

  if (!city) {
    console.error('南京城市记录不存在，请先创建城市数据');
    return;
  }

  // 南京概览数据
  const nanjingOverviewData = {
    cityId: nanjingCityId,
    
    // 历史沿革
    historyTitle: '历史沿革',
    historyTitleEn: 'Historical Evolution',
    historyContent: `南京，简称"宁"，古称金陵、建康，是江苏省省会、副省级市、特大城市、南京都市圈核心城市。南京地处中国东部、长江下游、濒江近海，是中国东部战区司令部驻地。\n\n南京是中国四大古都、首批国家历史文化名城，是中华文明的重要发祥地，历史上曾数次庇佑华夏之正朔，是四大古都中唯一未做过异族政权首都的古都，长期是中国南方的政治、经济、文化中心。\n\n南京早在100-120万年前就有古人类活动，35-60万年前已有南京猿人在汤山生活，有着7000多年文明史、近2600年建城史和近500年的建都史，有"六朝古都"、"十朝都会"之称。`,
    historyContentEn: `Nanjing, abbreviated as "Ning", formerly known as Jinling and Jiankang, is the capital city of Jiangsu Province, a sub-provincial city, megacity, and core city of the Nanjing Metropolitan Area. Located in eastern China, in the lower reaches of the Yangtze River, near the river and sea, Nanjing is the headquarters of the Eastern Theater Command of China.\n\nNanjing is one of China's Four Great Ancient Capitals and among the first batch of National Historical and Cultural Cities. It is an important birthplace of Chinese civilization and has historically served as the political, economic, and cultural center of southern China for extended periods.\n\nAncient human activities in Nanjing date back 1-1.2 million years, with Nanjing Man living in Tangshan 350,000-600,000 years ago. The city boasts over 7,000 years of civilization, nearly 2,600 years of city-building history, and nearly 500 years as a capital, earning it the titles "Ancient Capital of Six Dynasties" and "Capital of Ten Dynasties".`,
    historyImage: 'https://images.unsplash.com/photo-1555921015-5532091f6026',
    
    // 文化特色
    cultureTitle: '文化特色',
    cultureTitleEn: 'Cultural Characteristics',
    cultureContent: `南京文化底蕴深厚，是国家重要的科教中心，自古以来就是一座崇文重教的城市，有"天下文枢"、"东南第一学"的美誉。明清时期的南京，更是中国的文化中心。\n\n南京拥有厚重的文化底蕴和丰富的历史遗存。全市现有全国重点文物保护单位49处、江苏省文物保护单位109处、市级以上文物保护单位516处，国家级非物质文化遗产10项。\n\n南京云锦、金陵刻经、秦淮灯会等非物质文化遗产闻名中外。南京话作为江淮官话的代表，承载着深厚的地域文化特色。南京的文学艺术传统悠久，诞生了众多文学巨匠和艺术大师。`,
    cultureContentEn: `Nanjing has profound cultural heritage and is an important national center for science and education. Since ancient times, it has been a city that values culture and education, earning the reputation of "Literary Hub of the World" and "First Academy of the Southeast". During the Ming and Qing dynasties, Nanjing was the cultural center of China.\n\nNanjing possesses rich cultural heritage and abundant historical remains. The city currently has 49 national key cultural relic protection units, 109 Jiangsu provincial cultural relic protection units, 516 municipal-level and above cultural relic protection units, and 10 national-level intangible cultural heritage items.\n\nNanjing's intangible cultural heritage such as Nanjing Brocade, Jinling Scripture Engraving, and Qinhuai Lantern Festival are renowned both domestically and internationally. The Nanjing dialect, as a representative of Jianghuai Mandarin, carries profound regional cultural characteristics. Nanjing has a long tradition in literature and arts, giving birth to numerous literary giants and artistic masters.`,
    cultureImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919',
    
    // 风俗习惯
    customsTitle: '风俗习惯',
    customsTitleEn: 'Customs and Traditions',
    customsContent: `南京人性格温和、包容，说话慢条斯理，生活节奏相对悠闲。南京人重视传统节日，春节、清明、端午、中秋等传统节日都有独特的庆祝方式。\n\n南京的饮食文化独具特色，以淮扬菜为主，口味清淡，注重原汁原味。鸭血粉丝汤、盐水鸭、小笼包、鸭油酥烧饼等都是南京的特色美食。\n\n南京人喜欢喝茶聊天，茶馆文化浓厚。夫子庙、老门东等地的茶馆是市民休闲娱乐的重要场所。南京人还有晨练的习惯，玄武湖、紫金山等地每天清晨都有众多市民锻炼身体。`,
    customsContentEn: `Nanjing people are gentle and tolerant in character, speak in a measured manner, and maintain a relatively leisurely pace of life. They value traditional festivals, with unique ways of celebrating Spring Festival, Qingming, Dragon Boat Festival, Mid-Autumn Festival, and other traditional holidays.\n\nNanjing's culinary culture is distinctive, mainly featuring Huaiyang cuisine with light flavors that emphasize original tastes. Duck blood and vermicelli soup, salted duck, xiaolongbao, and duck oil crispy pancakes are all characteristic Nanjing delicacies.\n\nNanjing people enjoy drinking tea and chatting, with a rich teahouse culture. Teahouses in areas like Confucius Temple and Laomendong are important venues for citizens' leisure and entertainment. Nanjing people also have the habit of morning exercise, with numerous citizens exercising daily at dawn in places like Xuanwu Lake and Purple Mountain.`,
    customsImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919',
    
    // 艺术与非物质文化遗产
    heritageItems: [
      {
        name: '南京云锦',
        description: '南京云锦是中国传统的丝制工艺品，有"寸锦寸金"之称，代表了中国丝织工艺的最高水平，被誉为"东方瑰宝"、"中华一绝"。'
      },
      {
        name: '金陵刻经',
        description: '金陵刻经是中国传统的佛教经典雕版印刷技艺，始于清同治五年，是中国现存的唯一完整保存古代雕版印刷工艺的机构。'
      },
      {
        name: '秦淮灯会',
        description: '秦淮灯会是流传于南京地区的民俗文化活动，又称金陵灯会、夫子庙灯会，是中国持续时间最长、参与人数最多、规模最大的民俗灯会。'
      },
      {
        name: '南京白局',
        description: '南京白局是南京地区的传统曲艺形式，用南京方言说唱，曲调优美，内容贴近生活，是南京地区重要的民间艺术形式。'
      }
    ],
    heritageItemsEn: [
      {
        name: 'Nanjing Brocade',
        description: 'Nanjing Brocade is a traditional Chinese silk handicraft, known as "an inch of brocade worth an inch of gold", representing the highest level of Chinese silk weaving craftsmanship and hailed as "Oriental Treasure" and "Chinese Marvel".'
      },
      {
        name: 'Jinling Scripture Engraving',
        description: 'Jinling Scripture Engraving is a traditional Buddhist scripture woodblock printing technique that began in the fifth year of Emperor Tongzhi of the Qing Dynasty. It is the only institution in China that completely preserves ancient woodblock printing craftsmanship.'
      },
      {
        name: 'Qinhuai Lantern Festival',
        description: 'The Qinhuai Lantern Festival is a folk cultural activity popular in the Nanjing area, also known as Jinling Lantern Festival or Confucius Temple Lantern Festival. It is the longest-lasting, most participated, and largest-scale folk lantern festival in China.'
      },
      {
        name: 'Nanjing Baiju',
        description: 'Nanjing Baiju is a traditional folk art form in the Nanjing area, performed in Nanjing dialect with beautiful melodies and content close to daily life. It is an important folk art form in the Nanjing region.'
      }
    ],
    
    // 节庆活动
    festivals: [
      {
        name: '秦淮灯会',
        time: '春节期间（1月-3月）',
        activities: '赏花灯、猜灯谜、品小吃、看民俗表演、游秦淮河'
      },
      {
        name: '梅花节',
        time: '2月-3月',
        activities: '赏梅花、摄影比赛、诗词朗诵、茶艺表演、民俗展示'
      },
      {
        name: '樱花节',
        time: '3月-4月',
        activities: '赏樱花、樱花摄影、日式茶道、和服体验、音乐会'
      },
      {
        name: '森林音乐节',
        time: '9月-10月',
        activities: '户外音乐演出、森林徒步、露营体验、环保主题活动'
      }
    ],
    festivalsEn: [
      {
        name: 'Qinhuai Lantern Festival',
        time: 'Spring Festival Period (January-March)',
        activities: 'Lantern viewing, riddle guessing, local snacks, folk performances, Qinhuai River cruise'
      },
      {
        name: 'Plum Blossom Festival',
        time: 'February-March',
        activities: 'Plum blossom viewing, photography contests, poetry recitation, tea ceremony, folk exhibitions'
      },
      {
        name: 'Cherry Blossom Festival',
        time: 'March-April',
        activities: 'Cherry blossom viewing, photography, Japanese tea ceremony, kimono experience, concerts'
      },
      {
        name: 'Forest Music Festival',
        time: 'September-October',
        activities: 'Outdoor music performances, forest hiking, camping experiences, environmental themed activities'
      }
    ],
    
    // 名人与历史故事
    historicalStories: [
      {
        title: '朱元璋建立明朝',
        content: '1368年，朱元璋在南京称帝，建立明朝，定都南京。明太祖朱元璋在南京修建了宏伟的明故宫，使南京成为当时世界上最大的城市之一。明朝在南京建都54年，这一时期南京政治、经济、文化都达到了空前的繁荣。'
      },
      {
        title: '孙中山与中华民国',
        content: '1912年1月1日，孙中山在南京宣誓就任中华民国临时大总统，标志着中华民国的成立。孙中山先生逝世后，陵墓建在南京紫金山，即中山陵，成为南京最重要的纪念建筑之一，体现了南京在中国近代史上的重要地位。'
      },
      {
        title: '南京大屠杀与和平记忆',
        content: '1937年12月13日，侵华日军攻占南京后，对中国平民和战俘进行了长达6周的大规模屠杀，史称南京大屠杀。如今的侵华日军南京大屠杀遇难同胞纪念馆，不仅是对历史的铭记，更是对和平的呼唤，提醒世人珍爱和平、反对战争。'
      }
    ],
    historicalStoriesEn: [
      {
        title: 'Zhu Yuanzhang Establishes the Ming Dynasty',
        content: 'In 1368, Zhu Yuanzhang proclaimed himself emperor in Nanjing, establishing the Ming Dynasty with Nanjing as its capital. Emperor Taizu built the magnificent Ming Imperial Palace in Nanjing, making it one of the largest cities in the world at that time. The Ming Dynasty had its capital in Nanjing for 54 years, during which the city reached unprecedented prosperity in politics, economy, and culture.'
      },
      {
        title: 'Sun Yat-sen and the Republic of China',
        content: 'On January 1, 1912, Sun Yat-sen was sworn in as the provisional president of the Republic of China in Nanjing, marking the establishment of the Republic of China. After Dr. Sun Yat-sen\'s death, his mausoleum was built on Purple Mountain in Nanjing, known as Sun Yat-sen Mausoleum, becoming one of Nanjing\'s most important memorial buildings and reflecting Nanjing\'s important position in modern Chinese history.'
      },
      {
        title: 'Nanjing Massacre and Memory of Peace',
        content: 'On December 13, 1937, after the invading Japanese army captured Nanjing, they conducted a large-scale massacre of Chinese civilians and prisoners of war for six weeks, known as the Nanjing Massacre. Today\'s Memorial Hall of the Victims in Nanjing Massacre by Japanese Invaders is not only a remembrance of history but also a call for peace, reminding people to cherish peace and oppose war.'
      }
    ]
  };

  try {
    // 使用 upsert 创建或更新概览数据
    const overview = await prisma.cityOverview.upsert({
      where: { cityId: nanjingCityId },
      update: nanjingOverviewData,
      create: nanjingOverviewData,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        }
      }
    });

    console.log('南京城市概览数据初始化成功:', {
      id: overview.id,
      cityName: overview.city.name,
      historyTitle: overview.historyTitle,
      cultureTitle: overview.cultureTitle,
      customsTitle: overview.customsTitle,
      heritageItemsCount: Array.isArray(overview.heritageItems) ? overview.heritageItems.length : 0,
      festivalsCount: Array.isArray(overview.festivals) ? overview.festivals.length : 0,
      historicalStoriesCount: Array.isArray(overview.historicalStories) ? overview.historicalStories.length : 0
    });

    return overview;
  } catch (error) {
    console.error('南京城市概览数据初始化失败:', error);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  seedNanjingOverview()
    .then(() => {
      console.log('种子数据执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('种子数据执行失败:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}