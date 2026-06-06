export interface VerifyAuditData {
  GSFS_RECEIPT_NO:string;
  "AUDIT TYPE": string;
  CH_CS_CODE: string;
  RSM: string;
  EVALUATION_GROUP: string;
  SVC_DATA_FROM_CODE: string;
  CAPTIVE_CHANNEL_MAPPING_ORIG: string;
  SHIP_TO_CODE: string;
  SVC_DEPARTMENT_NAME: string;
  RECIEPT_USER_ID: string;

  // For checkbox selection
  selected?: boolean;
}