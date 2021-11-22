export interface Iinterest {
  id: number;
  opportunities_id: number;
  company_id: number;
  customer_id: number;
  customer_opportunity_interest_list_id: number;
  type_sending_customer_opportunities_id: number;
  type_sending: string;
  send_customer_opportunity: boolean;
  created_at: string;
  name: string;
  last_name: string;
  company_name: string;
  fantasy_name: string;
  status: boolean;
}
