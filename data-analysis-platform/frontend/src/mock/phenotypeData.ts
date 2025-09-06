// 表型数据 Mock 数据
export interface PhenotypeRecord {
  id: string;
  accession: string;
  trait: string;
  value: number;
  unit: string;
  environment: string;
  year: number;
  location: string;
  replicate: number;
  notes?: string;
  qcStatus: 'pass' | 'fail' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface TraitInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  dataType: 'numeric' | 'categorical' | 'binary';
  minValue?: number;
  maxValue?: number;
  categories?: string[];
}

export interface AccessionInfo {
  id: string;
  name: string;
  species: string;
  origin: string;
  type: 'landrace' | 'cultivar' | 'wild' | 'breeding_line';
  description?: string;
}

// Mock 表型数据
export const mockPhenotypeData: PhenotypeRecord[] = [
  {
    id: '1',
    accession: 'ACC001',
    trait: '株高',
    value: 125.5,
    unit: 'cm',
    environment: '温室',
    year: 2023,
    location: '北京',
    replicate: 1,
    notes: '正常生长',
    qcStatus: 'pass',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z'
  },
  {
    id: '2',
    accession: 'ACC001',
    trait: '株高',
    value: 128.2,
    unit: 'cm',
    environment: '温室',
    year: 2023,
    location: '北京',
    replicate: 2,
    qcStatus: 'pass',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z'
  },
  {
    id: '3',
    accession: 'ACC002',
    trait: '株高',
    value: 110.8,
    unit: 'cm',
    environment: '田间',
    year: 2023,
    location: '上海',
    replicate: 1,
    qcStatus: 'pass',
    createdAt: '2023-02-10T09:00:00Z',
    updatedAt: '2023-02-10T09:00:00Z'
  },
  {
    id: '4',
    accession: 'ACC003',
    trait: '叶长',
    value: 15.2,
    unit: 'cm',
    environment: '温室',
    year: 2023,
    location: '北京',
    replicate: 1,
    qcStatus: 'pass',
    createdAt: '2023-01-20T10:00:00Z',
    updatedAt: '2023-01-20T10:00:00Z'
  },
  {
    id: '5',
    accession: 'ACC004',
    trait: '叶宽',
    value: 8.5,
    unit: 'cm',
    environment: '田间',
    year: 2023,
    location: '广州',
    replicate: 1,
    qcStatus: 'pass',
    createdAt: '2023-03-05T11:00:00Z',
    updatedAt: '2023-03-05T11:00:00Z'
  },
  {
    id: '6',
    accession: 'ACC005',
    trait: '果重',
    value: 125.8,
    unit: 'g',
    environment: '温室',
    year: 2023,
    location: '北京',
    replicate: 1,
    qcStatus: 'pass',
    createdAt: '2023-04-12T12:00:00Z',
    updatedAt: '2023-04-12T12:00:00Z'
  },
  {
    id: '7',
    accession: 'ACC006',
    trait: '果长',
    value: 12.3,
    unit: 'cm',
    environment: '田间',
    year: 2023,
    location: '成都',
    replicate: 1,
    qcStatus: 'pending',
    createdAt: '2023-05-08T13:00:00Z',
    updatedAt: '2023-05-08T13:00:00Z'
  },
  {
    id: '8',
    accession: 'ACC007',
    trait: '开花期',
    value: 65,
    unit: '天',
    environment: '田间',
    year: 2023,
    location: '西安',
    replicate: 1,
    notes: '从播种开始计算',
    qcStatus: 'pass',
    createdAt: '2023-06-15T14:00:00Z',
    updatedAt: '2023-06-15T14:00:00Z'
  }
];

// Mock 性状信息
export const mockTraitInfo: TraitInfo[] = [
  {
    id: 'trait_001',
    name: '株高',
    description: '植株从地面到最高点的高度',
    category: '形态性状',
    unit: 'cm',
    dataType: 'numeric',
    minValue: 0,
    maxValue: 300
  },
  {
    id: 'trait_002',
    name: '叶长',
    description: '叶片的长度',
    category: '叶部性状',
    unit: 'cm',
    dataType: 'numeric',
    minValue: 0,
    maxValue: 50
  },
  {
    id: 'trait_003',
    name: '叶宽',
    description: '叶片的宽度',
    category: '叶部性状',
    unit: 'cm',
    dataType: 'numeric',
    minValue: 0,
    maxValue: 20
  },
  {
    id: 'trait_004',
    name: '果重',
    description: '单个果实的重量',
    category: '果实性状',
    unit: 'g',
    dataType: 'numeric',
    minValue: 0,
    maxValue: 1000
  },
  {
    id: 'trait_005',
    name: '果长',
    description: '果实的长度',
    category: '果实性状',
    unit: 'cm',
    dataType: 'numeric',
    minValue: 0,
    maxValue: 30
  },
  {
    id: 'trait_006',
    name: '开花期',
    description: '从播种到开花的天数',
    category: '发育性状',
    unit: '天',
    dataType: 'numeric',
    minValue: 30,
    maxValue: 120
  }
];

// Mock 种质信息
export const mockAccessionInfo: AccessionInfo[] = [
  {
    id: 'ACC001',
    name: '京番茄1号',
    species: 'Solanum lycopersicum',
    origin: '北京',
    type: 'cultivar',
    description: '高产抗病品种'
  },
  {
    id: 'ACC002',
    name: '沪番茄2号',
    species: 'Solanum lycopersicum',
    origin: '上海',
    type: 'cultivar',
    description: '早熟品种'
  },
  {
    id: 'ACC003',
    name: '野生种质W001',
    species: 'Solanum pimpinellifolium',
    origin: '秘鲁',
    type: 'wild',
    description: '野生种质资源'
  },
  {
    id: 'ACC004',
    name: '地方品种L001',
    species: 'Solanum lycopersicum',
    origin: '山东',
    type: 'landrace',
    description: '传统地方品种'
  },
  {
    id: 'ACC005',
    name: '育种系B001',
    species: 'Solanum lycopersicum',
    origin: '中国农科院',
    type: 'breeding_line',
    description: '新育成品系'
  },
  {
    id: 'ACC006',
    name: '川番茄3号',
    species: 'Solanum lycopersicum',
    origin: '四川',
    type: 'cultivar',
    description: '适应性强品种'
  },
  {
    id: 'ACC007',
    name: '陕番茄4号',
    species: 'Solanum lycopersicum',
    origin: '陕西',
    type: 'cultivar',
    description: '耐旱品种'
  }
];

// 生成更多模拟数据的函数
export const generateMockData = (count: number): PhenotypeRecord[] => {
  const traits = ['株高', '叶长', '叶宽', '果重', '果长', '开花期'];
  const environments = ['温室', '田间', '网室'];
  const locations = ['北京', '上海', '广州', '成都', '西安', '南京'];
  const units = ['cm', 'g', '天', 'mm'];
  
  const data: PhenotypeRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const trait = traits[Math.floor(Math.random() * traits.length)];
    const accession = `ACC${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`;
    
    data.push({
      id: `mock_${i + 1}`,
      accession,
      trait,
      value: Math.round((Math.random() * 200 + 10) * 100) / 100,
      unit: units[Math.floor(Math.random() * units.length)],
      environment: environments[Math.floor(Math.random() * environments.length)],
      year: 2023,
      location: locations[Math.floor(Math.random() * locations.length)],
      replicate: Math.floor(Math.random() * 3) + 1,
      qcStatus: Math.random() > 0.1 ? 'pass' : 'pending',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return data;
};
