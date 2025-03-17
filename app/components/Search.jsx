"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const Search = () => {
  const [quality, setQuality] = useState("hd720");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [mediaType, setMediaType] = useState("video"); // "video" or "audio"

  useEffect(() => {
    const defaultFormat = data?.formats.find(
      (format) => format.qualityLabel === "720p"
    );
    if (defaultFormat) {
      setQuality("720p");
    }
  }, [data]);

  const extractVideoId = (url) => {
    let videoId = null;

    // Regular expressions for different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*?v=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    ];

    // Iterate through patterns to find a match
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        videoId = match[1];
        break;
      } else {
        return null;
      }
    }

    return videoId;
  };

  const getVideoData = async (videoId) => {
    const url = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "d40c265118mshdc90194a533aa99p18842bjsn18247c206e8e",
        "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
      },
    };
    try {
      setLoading(true);
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeQuality = (e) => {
    setQuality(e.target.value);
  };

  const handleChangeMediaType = (e) => {
    setMediaType(e.target.value);
  };

  const handleChangeUrl = (e) => {
    const videoId = extractVideoId(e.target.value);
    if (videoId) {
      getVideoData(videoId).then((data) => {
        setData(data);
      });
    }
  };

  const downloadMedia = async (e) => {
    e.preventDefault();
    
    let selectedFormat;
    
    if (mediaType === "video") {
      // For video formats
      selectedFormat = data.formats.find(
        (format) => format.qualityLabel === quality
      ) || data.adaptiveFormats.find(
        (format) => format.qualityLabel === quality && format.mimeType.includes("video")
      );
    } else {
      // For audio formats
      selectedFormat = data.adaptiveFormats.find(
        (format) => format.itag.toString() === quality && format.mimeType.includes("audio")
      );
    }

    if (!selectedFormat) {
      alert("Selected format not available");
      return;
    }

    // Create an anchor element
    const link = document.createElement("a");
    link.href = selectedFormat.url;
    link.target = "_blank";
    
    // Set the download attribute with the video title and appropriate extension
    let fileExtension;
    if (selectedFormat.mimeType.includes("audio/mp4")) {
      fileExtension = "m4a";
    } else if (selectedFormat.mimeType.includes("audio/webm")) {
      fileExtension = "webm";
    } else if (selectedFormat.mimeType.includes("video/mp4")) {
      fileExtension = "mp4";
    } else if (selectedFormat.mimeType.includes("video/webm")) {
      fileExtension = "webm";
    } else {
      fileExtension = "mp4"; // Default fallback
    }
    
    link.download = `${data.title}.${fileExtension}`;
    
    // Append to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to display format info
  const getFormatLabel = (format) => {
    if (format.qualityLabel) {
      return `${format.qualityLabel} (${format.mimeType.split(';')[0].split('/')[1]})`;
    } else if (format.mimeType.includes("audio")) {
      const audioType = format.mimeType.includes("mp4") ? "MP3" : "Opus";
      const kbps = Math.round(format.bitrate / 1000);
      return `${audioType} - ${kbps}kbps`;
    }
    return `Unknown format (${format.itag})`;
  };

  return (
    <div className="h-full w-full text-white">
      <div className="mb-4">
        <label htmlFor="url" className="block mb-2">
          YouTube Video URL
          <input
            type="text"
            id="url"
            placeholder="Enter a valid youtube url"
            onChange={handleChangeUrl}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </label>
      </div>

      {data ? (
        <div className="video-details w-full flex flex-col md:flex-row items-center justify-center md:justify-between">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={data?.thumbnail[2]?.url}
              height={300}
              width={500}
              alt="Thumbnail"
              className="w-auto h-auto rounded-md"
            />
            <h2 className="text-2xl font-semibold">{data.title}</h2>
          </div>

          <form
            className="h-full w-full flex items-center flex-col p-6"
            onSubmit={downloadMedia}
          >
            <div className="mb-4 w-full">
              <h3 className="block mb-2 text-2xl font-semibold">
                What would you like to download?
              </h3>
              <div className="flex space-x-4 mb-4">
                <label>
                  <input
                    type="radio"
                    name="mediaType"
                    value="video"
                    checked={mediaType === "video"}
                    onChange={handleChangeMediaType}
                    className="mr-2"
                  />
                  Video
                </label>
                <label>
                  <input
                    type="radio"
                    name="mediaType"
                    value="audio"
                    checked={mediaType === "audio"}
                    onChange={handleChangeMediaType}
                    className="mr-2"
                  />
                  Audio Only
                </label>
              </div>
            </div>

            <div className="mb-4 w-full">
              <h3 className="block mb-2 text-2xl font-semibold">
                Select Quality
              </h3>
              
              {mediaType === "video" ? (
                <div className="grid grid-cols-2 gap-2">
                  {/* Regular video formats */}
                  {data.formats.map((format) => (
                    <label className="flex items-center" key={format.qualityLabel}>
                      <input
                        type="radio"
                        value={format.qualityLabel}
                        checked={quality === format.qualityLabel}
                        onChange={handleChangeQuality}
                        className="mr-2"
                      />
                      {format.qualityLabel} (Combined Audio Video)
                    </label>
                  ))}
                  
                  {/* Adaptive video formats */}
                  {data.adaptiveFormats
                    .filter(format => format.mimeType.includes("video"))
                    .map((format) => (
                      <label className="flex items-center" key={format.itag}>
                        <input
                          type="radio"
                          value={format.qualityLabel}
                          checked={quality === format.qualityLabel}
                          onChange={handleChangeQuality}
                          className="mr-2"
                        />
                        {format.qualityLabel} ({format.mimeType.split(';')[0].split('/')[1]})
                      </label>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {/* Audio formats */}
                  {data.adaptiveFormats
                    .filter(format => format.mimeType.includes("audio"))
                    .map((format) => (
                      <label className="flex items-center" key={format.itag}>
                        <input
                          type="radio"
                          value={format.itag.toString()}
                          checked={quality === format.itag.toString()}
                          onChange={handleChangeQuality}
                          className="mr-2"
                        />
                        {getFormatLabel(format)}
                      </label>
                    ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              Download {mediaType === "video" ? "Video" : "Audio"}
            </button>
          </form>
        </div>
      ) : loading ? (
        <div className="h-[60vh] w-full flex items-center justify-center">
          <FaSpinner size={50} className="animate-spin" />
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="my-5 font-semibold font-sans text-3xl text-center w-full">
            Enter A valid Video Url to search Automatically
          </h1>
        </div>
      )}
    </div>
  );
};

export default Search;