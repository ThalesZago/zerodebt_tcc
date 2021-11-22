export interface Document {
  id: number;
  file_path: string;
  path_name: string;
  product_id: number;
  opportunity_id: number;
  opportunity_document_types_id: number;
  description: string;
  type: string;
  url: string;
  base64: string;
  isNew: boolean;
}
