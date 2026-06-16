export interface EvaluationProcessData {
   GSFS_RECEIPT_NO: string;
  CH_CS_CODE: string;
  PRODUCT1_CODE: string;
  MODEL_SUFFIX_CODE: string;
  REPAIR_END_DATE_YYYYMMDD: string;
  DISPOSITION: string;
  DURATION: number;
  WARRANTY_FLAG: string;
  SVC_STATUS_CODE_GERP: string;
  SVC_STATUS_CODE_GSFS: string;
  SVC_TYPE_CODE: string;
  SVC_DATA_FROM_CODE: string;
  SHIP_TO_CODE: string;
  CALL_RECEIPT_DATE: string;
  LAW_INVOICE_NO: string;
  WARRANTY_EXTENSION_CARD_NO: number;
  REASON_FOR_DATA_AUDIT: string | null;

  // Currently API returns these as JSON strings
  'ESC/LGC_CLAIM_DETAILS': string;
  HO_FEEDBACK_DETAILS: string;
}

export interface FeedbackDetail {
  'S.NO.': number;
  GSFS_RECEIPT_NO: string;
  FEEDBACK: string;
  REMARK: string;
  ATTACHEMENTS: string | null;
  EXPECTED_DATE: string;
}