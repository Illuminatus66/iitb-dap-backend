# Node Backend API

A Node.js backend project built with Express, Mongoose, and TypeScript that handles report creation, audio uploads, and report generation via the Speech Assessment Service (SAS) API.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **Report Management**: Create and fetch reports.
- **Audio Upload**: Upload base64 encoded audio files to an S3 bucket.
- **Report Generation**: Trigger generation of detailed reports by integrating with an external SAS API.
- **Time Zone Handling**: Uses [Day.js](https://day.js.org/) with timezone support to format timestamps to IST since the server could be hosted anywhere in the world.
- **Error Handling**: Provides meaningful error messages for troubleshooting.

## Tech Stack

- **Node.js & Express**: For building the RESTful API.
- **Mongoose**: For MongoDB interactions.
- **Axios**: For making HTTP requests to external APIs.
- **Day.js**: For date and time manipulation.
- **TypeScript**: For type safety and better development experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (running locally or accessible remotely)
- A valid S3 Bucket URL for audio uploads 
 where the URL looks like this `https://s3.<bucket-region>/<s3-bucket-name>/<student-audio-file.extension>` and is set to public access
- SAS API credentials for report generation obtained from IIT-B DAP lab.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Illuminatus66/iitb-dap-backend.git
   cd iitb-dap-backend
   ```
2. **Install Dependencies:**

   ```bash
   npm install
   ```
### Configuration

Create a `.env` file in the root directory and add the following environment variables:

### MongoDB connection string
`MONGODB_URI`=your_mongodb_connection_string

### External S3 bucket URL for audio uploads
`S3_BUCKET_URL`= your_s3_bucket_url

### SAS API configuration for report generation
`SAS_API_URL`= the_sas_api_url
`SAS_API_KEY`=your_sas_api_key

### Port number for the server (optional)
`PORT`=3000

Make sure to replace the placeholder values with your actual credentials and URLs

## Project Structure

iitb_dap_backend/
|
│── controllers/
│   │── reportController.ts       # Contains endpoints for handling reports
|   └──types.ts                   # Type definitions for request and response payloads
│── models/
│   └── Reports.ts                # Mongoose schema for reports
│── routes/
│   └── reportRoutes.ts           # Express routes for the API
│── index.ts                      # Express app initialization
├── .env                          # Environment variables
├── package.json
├── tsconfig.json                 # TypeScript configuration
└── README.md

## API Endpoints

1. **Fetch All Reports**
- URL: `/reports/fetch-all-reports`
- Method: `GET`
- Description: Retrieves a list of all reports.
- Response: An array of report objects.

2. **Upload Details Without Audio**
- URL: `/reports/upload-details`
- Method: `POST`
- Description: Creates a new report document with only textual details (without audio).
- Request Body Example:
    ```bash
    {
    "uid": "4_A_49",
    "name": "Ishika Nebhnani",
    "story": "The Lion and The Mouse"
    }
    ```
- Response: The created report object.

3. **Upload Audio**
- URL: `/reports/upload-audio`
- Method: `POST`
- Description: Uploads a base64 encoded audio file to an S3 bucket and updates or creates a report document depending on whether _id is passed in the request body or not.
- Request Body Example:
    ``` bash
    {
    "_id": "optional_existing_id",
    "uid": "4_A_49",
    "name": "Ishika Nebhnani",
    "story": "The Lion and The Mouse",
    "audioFile": "data:audio/filetype;base64,ABCDEFGHIJK"
    }
    ```
- Response: The updated/created report object with an `audio_url`.

4. **Trigger Report Generation**
- URL: `/reports/generate-report`
- Method: `POST`
- Description: Triggers the generation of a report by calling the SAS API and updates the report with detailed results.
- Request Body Example:
    ``` bash
    {
    "_id": "existing_id",
    "audio_url": "https://s3.<bucket-region>/<s3-bucket-name>/<student-audio-file.extension>",
    "reference_text_id": "provided by IITB-DAP lab",
    "request_time": "2025-02-25T12:00:00.000Z"
    }
    ```
- Response: The updated and complete report object with additional fields generated from the SAS API.

## License
This project is licensed under the MIT License.