import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { api, defaultAxios } from "../../environment/api";

const ORDER_SLICE_SIZE = 600000;
const DISPLAY_SLICE_SIZE = 599896;

const check = (...arg) => {
  if (true) console.log(...arg);
};

const postRealData = async (id, type) => {
  const { url, method } =
    type === "order" ? api.postRealDataOrder : api.postRealDataDisplay;
  return defaultAxios({
    url,
    method,
    data: { id },
  });
};

const putRealData = async (id, type) => {
  const { url, method } =
    type === "order" ? api.putRealDataOrder : api.putRealDataDisplay;
  return defaultAxios({
    url,
    method,
    data: { id },
  });
};

const postRealDataContent = async (id, type, data) => {
  const { url, method } =
    type === "order"
      ? api.postRealDataOrderContent
      : api.postRealDataDisplayContent;
  return defaultAxios({
    url,
    method,
    data,
    params: { id },
  });
};

const UploadProgress = ({ file, isLoading, type }) => {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState();
  const [isError, setIsError] = useState(false);
  const isFirstUpload = useRef(true);

  const handleNextProgress = () => {
    const ADD_CONST = type === "order" ? ORDER_SLICE_SIZE : DISPLAY_SLICE_SIZE;
    if (progress < currentFile.size) {
      const ADDER =
        progress + ADD_CONST <= currentFile.size
          ? ADD_CONST
          : currentFile.size - progress;

      const partFile = currentFile.slice(progress, progress + ADDER);
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (e) => {
        const result = e.target.result.split("\n");
        if (result[result.length - 1] === "") result.splice(-1);

        // insert real data content
        check(2);
        postRealDataContent(currentFile.name, type, result)
          .then(() => {
            setProgress(progress + ADDER);
          })
          .catch(() => setIsError(true));
      });
      fileReader.readAsText(partFile);
    } else {
      putRealData(currentFile.name, type)
        .then(() => {
          // toggle real data status
          check(3);
        })
        .catch(() => setIsError(true));
    }
  };

  useEffect(() => {
    //TODO 在按一次上傳 file為何會變??
    setCurrentFile(file);
    setProgress(0);
  }, [file]);

  useEffect(() => {
    if (isLoading && currentFile && type) {
      if (isFirstUpload.current) {
        postRealData(currentFile.name, type)
          .then(() => {
            isFirstUpload.current = false;
            handleNextProgress();
            //insert real data
            check(1);
          })
          .catch(() => setIsError(true));
      } else handleNextProgress();
    }
  }, [isLoading, currentFile, type, progress]);

  return currentFile ? (
    <div>
      {currentFile.name}{" "}
      {isError
        ? "ERROR"
        : ((progress / currentFile.size) * 100).toFixed(2) + "%"}
    </div>
  ) : (
    <div />
  );
};

const ContentContainer = ({ type }) => {
  const [fileList, setFileList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState([]);

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          const { files } = e.target;
          const fileArray = Array.from(files);
          setFileList(fileArray);
          setIsLoadingList([...new Array(fileArray.length)].fill(false));
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          setIsLoadingList(isLoadingList.map(() => true));
        }}
      >
        上傳
      </Button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fileList.map((file, index) => {
          return (
            <UploadProgress
              key={Math.random()}
              file={file}
              isLoading={isLoadingList[index]}
              type={type}
            />
          );
        })}
      </div>
    </div>
  );
};

const RealDataUpload = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <div>
        委託檔
        <ContentContainer type="order" />
      </div>
      <div>
        揭示檔
        <ContentContainer type="display" />
      </div>
    </div>
  );
};
export default RealDataUpload;
