export interface EvaluationProcessData {
  CH_CS_CODE: string;
  'Call Receipt Date': string;
  DISPOSITION: string;
  DURATION: number;
  GSFS_RECEIPT_NO: string;
  LAW_INVOICE_NO: string;
  MODEL_SUFFIX_CODE: string;
  PRODUCT1_CODE: string;
  REPAIR_END_DATE_YYYYMMDD: string;
  'Reason For Data Audit': string | null;
  SHIP_TO_CODE: string;
  SVC_DATA_FROM_CODE: string;
  SVC_STATUS_CODE_GERP: string;
  SVC_STATUS_CODE_GSFS: string;
  SVC_TYPE_CODE: string;
  WARRANTY_EXTENSION_CARD_NO: string | null;
}