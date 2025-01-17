export interface IBarChartReport {
  series: { name?: string; data: number[] }[];
  categories: string[];
}

export interface IDonutChartReport {
  series: number[];
  labels: string[];
}
