export type ProfileStat = {
  id: string;
  label: string;
  value: number;
  icon: string;
  tone: 'accent' | 'info' | 'sun';
};

export type ProfileAction = {
  id: string;
  label: string;
  description: string;
  icon: string;
  tone: 'default' | 'danger';
};
