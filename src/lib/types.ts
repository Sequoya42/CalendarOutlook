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

type Owner = {
  address: string,
  name: string
}
export type SelectedCal = {
  id: string;
  owner: Owner
}
export type ByDays = Record<string, ByDay>;
