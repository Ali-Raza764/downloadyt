"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const Search = () => {
  const [quality, setQuality] = useState("hd720");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

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
      console.error;
    } finally {
      setLoading(false);
    }
  };
  const handleChangeQuality = (e) => {
    setQuality(e.target.value);
  };

  const handleChangeUrl = (e) => {
    const videoId = extractVideoId(e.target.value);
    videoId &&
      getVideoData(videoId).then((data) => {
        setData(data);
      });
  };

  const downloadVideo = async (e) => {
    e.preventDefault();
    const selectedFormat = data.formats.find(
      (format) => format.qualityLabel === quality
    );
    window.open(selectedFormat.url, "_blank");
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
              src={data?.thumbnail[2].url}
              height={300}
              width={500}
              alt="Thumbnail"
              className="w-auto h-auto rounded-md"
            />
            <h2 className="text-2xl font-semibold">{data.title}</h2>
          </div>

          <form
            className="h-full w-full flex items-center flex-col p-6"
            onSubmit={downloadVideo}
          >
            <div className="mb-4">
              <h3 className="block mb-2 text-2xl font-semibold">
                Select A Video Quality
              </h3>
              {data.formats.map((format) => (
                <label className="mr-4" key={format.qualityLabel}>
                  <input
                    type="radio"
                    value={format.qualityLabel}
                    checked={quality === format.qualityLabel}
                    onChange={handleChangeQuality}
                    className="mr-2"
                  />
                  {format.qualityLabel}
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              Download
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
