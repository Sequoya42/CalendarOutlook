export type Subject = {
  subject: string;
  isMeeting: boolean;
};
type ByDay = {
  timeSpent: number;
  subject: Subject[];
  isMeeting: boolean;
};

export type CalcMoula = {
  allTimeSpent: number;
  moula: number;
  tax: number;
  afterTax: number;
}

export type ByDays = Record<string, ByDay>;
