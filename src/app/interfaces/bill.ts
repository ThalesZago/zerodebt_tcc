export interface Bill {
  bill_id: number;
  title: string;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
  bill_category_id: number;
}
