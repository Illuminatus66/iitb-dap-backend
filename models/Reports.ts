import mongoose, { Document, Schema } from 'mongoose';

export interface ReportsDocument extends Document {
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
  file_id?: string;
  audio_type?: string;
  decoded_text?: string;
  no_words?: number;
  no_del?: number;
  del_details?: string;
  no_ins?: number;
  ins_details?: string;
  no_subs?: number;
  subs_details?: string;
  no_miscue?: number;
  no_corr?: number;
  wcpm?: number;
  speech_rate?: number;
  pron_score?: number;
  percent_attempt?: number;
  audio_url?: string;
  request_time?: string;
  response_time?: string;
}

const ReportsSchema: Schema = new Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  is_audio_uploaded: { type: Boolean, required: true },
  is_report_generated: { type: Boolean, required: true },
  story: { type: String, required: true },
  file_id: { type: String },
  audio_type: { type: String },
  decoded_text: { type: String },
  no_words: { type: Number },
  no_del: { type: Number },
  del_details: { type: String },
  no_ins: { type: Number },
  ins_details: { type: String },
  no_subs: { type: Number },
  subs_details: { type: String },
  no_miscue: { type: Number },
  no_corr: { type: Number },
  wcpm: { type: Number },
  speech_rate: { type: Number },
  pron_score: { type: Number },
  percent_attempt: { type: Number },
  audio_url: { type: String },
  request_time: { type: String },
  response_time: { type: String },
});

export const Report = mongoose.model<ReportsDocument>(
  'Report',
  ReportsSchema
);
