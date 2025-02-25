export interface DetailsUploadRequest {
  uid: string;
  name: string;
  story: string;
}

export interface DetailsUploadResponse {
  _id: string;
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
}

export interface AudioUploadRequest {
  _id?: string;
  uid: string;
  name: string;
  story: string;
  audioFile: string;
}

export interface AudioUploadResponse {
  _id: string;
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
  audio_url: string;
}

export interface ReportGenerationRequest {
  _id: string;
  audio_url: string;
  reference_text_id: string;
  request_time: string;
}

export interface ReportGenerationResponse {
  _id: string;
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  file_id: string;
  audio_type: string;
  decoded_text: string;
  no_words: number;
  no_del: number;
  del_details: string;
  no_ins: number;
  ins_details: string;
  no_subs: number;
  subs_details: string;
  no_miscue: number;
  no_corr: number;
  wcpm: number;
  speech_rate: number;
  pron_score: number;
  percent_attempt: number;
  audio_url: string;
  story: string;
  request_time: string;
  response_time: string;
}