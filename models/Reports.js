import { Schema, model } from "mongoose";

const ReportsSchema = new Schema({
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
  correct_text: {type: String },
  request_time: { type: String },
  response_time: { type: String },
});

export default model("Report", ReportsSchema);
