export interface PhenotypeData {
  id: string;
  accession: string;
  variety: string;
  location: string;
  year: number;
  plantHeight: number;
  leafLength: number;
  leafWidth: number;
  fruitWeight: number;
  fruitLength: number;
  fruitWidth: number;
  floweringTime: number;
  maturityTime: number;
  yieldPerPlant: number;
  sugarContent: number;
  vitaminC: number;
  // 可以添加更多表型字段
}

export interface PhenotypeFilter {
  accession?: string;
  variety?: string;
  location?: string;
  yearRange?: [number, number];
  trait?: keyof PhenotypeData;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'scatter' | 'histogram';
  xAxis: keyof PhenotypeData;
  yAxis: keyof PhenotypeData;
  groupBy?: keyof PhenotypeData;
  title: string;
  color?: string;
}

export interface PhenotypeAnalysisRequest {
  filters: PhenotypeFilter;
  chartConfigs: ChartConfig[];
  downloadFormat?: 'csv' | 'xlsx' | 'json';
}
