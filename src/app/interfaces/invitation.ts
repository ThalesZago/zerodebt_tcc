export interface Invitation {
  invitation_id: number;
  id: number;
  code_invitation: string;
  user_id: number;
  company_user_costumers_id: number;
  invitation_company_association_id: number;
  code_used: boolean;
  customer_name: string;
  email: string;
  cellphone: string;
  invitation_created_at: string;
  company_name: string;
  invited_by: string;
}
