import axios from "axios";
import dayjs from "dayjs";
import Report from "../models/Reports.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(timezone);
dayjs.extend(utc);

export const fetchAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const uploadDetailsWithoutAudio = async (req, res) => {
  try {
    const detailsUploadData = req.body;


    if (detailsUploadData._id) {
      // If _id is present, update the existing document
      const updatedReport = await Report.findByIdAndUpdate(
        detailsUploadData._id,
        {
          uid: detailsUploadData.uid,
          name: detailsUploadData.name,
          story: detailsUploadData.story,
        },
        { new: true } // Return the updated document
      );

      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      return res.status(200).json(updatedReport);
    }

    // If _id is not present,a new document is created with both flags
    //  set to false since no audio is being uploaded in this controller
    const newReport = await Report.create({
      uid: detailsUploadData.uid,
      name: detailsUploadData.name,
      story: detailsUploadData.story,
      is_audio_uploaded: false,
      is_report_generated: false,
    });

    const responseData = {
      _id: newReport._id,
      uid: newReport.uid,
      name: newReport.name,
      is_audio_uploaded: newReport.is_audio_uploaded,
      is_report_generated: newReport.is_report_generated,
      story: newReport.story,
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error in uploadDetailsWithoutAudio:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const uploadAudio = async (req, res) => {
  try {
    const audioUploadData = req.body;

    // This calls IITB's S3 bucket to upload a base64 encoded audio file.
    // The documentation suggests that the file should be in the "audioFile" field.
    const externalApiUrl = String(process.env.S3_BUCKET_URL);

    const s3Response = await axios.post(
      externalApiUrl,
      { audioFile: audioUploadData.audioFile },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the s3Url from the external API's response.
    const s3Url = s3Response.data.s3Url;
    let reportDoc;

    // If _id is provided, we update an existing document.
    if (audioUploadData._id) {
      reportDoc = await Report.findByIdAndUpdate(
        audioUploadData._id,
        {
          uid: audioUploadData.uid,
          name: audioUploadData.name,
          story: audioUploadData.story,
          audio_url: s3Url,
          is_audio_uploaded: true,
          is_report_generated: false,
        },
        { new: true, overwrite: true }
      );
    } else {
      // Otherwise, we create a new one.
      reportDoc = await Report.create({
        uid: audioUploadData.uid,
        name: audioUploadData.name,
        story: audioUploadData.story,
        audio_url: s3Url,
        is_audio_uploaded: true,
        is_report_generated: false,
      });
    }

    if (!reportDoc) {
      throw new Error("Unable to update or create report document");
    }

    const responseData = {
      _id: reportDoc._id,
      uid: reportDoc.uid,
      name: reportDoc.name,
      is_audio_uploaded: reportDoc.is_audio_uploaded,
      is_report_generated: reportDoc.is_report_generated,
      story: reportDoc.story,
      audio_url: reportDoc.audio_url,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in uploadAudioController:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const triggerReportGeneration = async (req, res) => {
  try {
    const { _id, audio_url, reference_text_id, request_time } = req.body;

    if (!audio_url.startsWith("https://") || !audio_url.includes("s3")) {
      return res.status(400).json({ message: "Invalid S3 URL" });
    }

    const sasApiUrl = process.env.SAS_API_URL;
    const sasApiKey = process.env.SAS_API_KEY;

    if (!sasApiKey) {
      return res.status(400).json({ message: "Missing SAS API Key" });
    }

    // According to the documentation, the API key can be set in
    // the header inside the "x-api-key" feild
    const sasResponse = await axios
      .post(
        sasApiUrl,
        { s3_url: audio_url, reference_text_id: reference_text_id },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": sasApiKey,
          },
          timeout: 30000,
        }
      )
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          throw new error("SAS API timeout: No response from the server.");
        }
      });

    if (!sasResponse) {
      return res.status(500).json({ message: "Invalid SAS API response" });
    }

    const sasData = sasResponse.data;

    if (sasData.audio_type != "Ok") {
      return res.status(500).json({ message: "Invalid SAS API response" });
    }

    // 1-indexed to maintain consistency with how other details are structured
    const processedText = sasData.word_scores
      .map((item, index) => `${index + 1}-${item[0]}`)
      .join(",");

    // Response_time will be set in IST regardless of server location.
    // As I understand it, the response_time is supposed to be when the
    // the SAS API responds, not when the response reaches the frontend
    const response_time = dayjs()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const updateData = {
      // Fields from SAS API response:
      file_id: sasData.file_id,
      audio_type: sasData.audio_type,
      decoded_text: sasData.decoded_text,
      no_words: sasData.no_words,
      no_del: sasData.no_del,
      del_details: sasData.del_details,
      no_ins: sasData.no_ins,
      ins_details: sasData.ins_details,
      no_subs: sasData.no_subs,
      subs_details: sasData.subs_details,
      no_miscue: sasData.no_miscue,
      no_corr: sasData.no_corr,
      wcpm: sasData.wcpm,
      speech_rate: sasData.speech_rate,
      pron_score: sasData.pron_score,
      percent_attempt: sasData.percent_attempt,
      // Set by us
      is_report_generated: true,
      response_time,
      correct_text: processedText,
      // Fields from the request:
      audio_url,
      request_time,
    };

    const updatedReport = await Report.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error in triggerReportGenerationController:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
