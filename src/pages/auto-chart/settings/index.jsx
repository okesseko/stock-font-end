import { configConsumerProps } from "antd/lib/config-provider";
import React, { useEffect, useRef, useState } from "react";
import { renderData } from "./math-model";
import { defaultAxios, api } from "../../../environment/api";
import errorNotification from "../../../utils/errorNotification";
import { Slider } from "antd";

export default function Settings({ buttonStatus = "stop", stockId }) {
  const displayData = useRef();
  const timeSet = useRef();
  const [nextTime, setNextTime] = useState(0);

  const [setting, setSetting] = useState({
    default_lambda_B: 10,
    default_lambda_A: 10,
    R_B: 0.8,
    R_A: 0.8,
    default_theta_B: 10,
    default_theta_A: 10,
    R_theta_B: 0.8,
    R_theta_A: 0.8,
    mu_B: 10,
    mu_A: 10,
    batch_size: 10,
  });
  useEffect(() => {
    defaultAxios({
      url: api.getDisplay.url,
      method: api.getDisplay.method,
      params: {
        isGetLatest: true,
      },
    })
      .then((res) => {
        displayData.current = res.data;
        setNextTime(renderData(setting, res.data, true));
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, []);

  useEffect(() => {
    if (nextTime && buttonStatus !== "stop") {
      setTimeout(() => {
        setNextTime(() =>
          renderData(setting, displayData.current, false, stockId)
        );
      }, nextTime);
    }
  }, [nextTime, buttonStatus]);

  const handleInputChangeLambdaB = (value) => {
    setSetting({ ...setting, default_lambda_B: value });
  };

  const handleInputChangeLambdaA = (value) => {
    setSetting({ ...setting, default_lambda_A: value });
  };

  const handleInputChangeLambdaRatioB = (value) => {
    setSetting({ ...setting, R_B: value });
  };

  const handleInputChangeLambdaRatioA = (value) => {
    setSetting({ ...setting, R_A: value });
  };

  const handleInputChangeThetaB = (value) => {
    setSetting({ ...setting, default_theta_B: value });
  };

  const handleInputChangeThetaA = (value) => {
    setSetting({ ...setting, default_theta_A: value });
  };

  const handleInputChangeThetaRatioB = (value) => {
    setSetting({ ...setting, R_theta_B: value });
  };

  const handleInputChangeThetaRatioA = (value) => {
    setSetting({ ...setting, R_theta_A: value });
  };

  const handleInputChangeMuB = (value) => {
    setSetting({ ...setting, mu_B: value });
  };

  const handleInputChangeMuA = (value) => {
    setSetting({ ...setting, mu_A: value });
  };

  const handleInputChangeBatchSize = (value) => {
    setSetting({ ...setting, batch_size: value });
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-1/2">
          <div>batch size: {setting.batch_size}</div>
          <Slider
            min={1}
            max={100}
            step={1}
            value={setting.batch_size}
            onChange={handleInputChangeBatchSize}
          />
        </div>
      </div>
      <div className="flex justify-center mx-5">
        <div className="mr-5 pr-5 border-r w-1/4">
          <div>
            <div>
              λ<sub>B</sub>: {setting.default_lambda_B}
            </div>
            <Slider
              min={1}
              max={100}
              step={0.1}
              value={setting.default_lambda_B}
              onChange={handleInputChangeLambdaB}
            />
          </div>
          <div>
            <div>
              R<sub>B</sub>: {setting.R_B}
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={setting.R_B}
              onChange={handleInputChangeLambdaRatioB}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              θ<sub>B</sub>: {setting.default_theta_B}
            </div>
            <Slider
              min={1}
              max={100}
              step={0.1}
              value={setting.default_theta_B}
              onChange={handleInputChangeThetaB}
            />
          </div>
          <div>
            <div>
              R<sub>B</sub>: {setting.R_theta_B}
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={setting.R_theta_B}
              onChange={handleInputChangeThetaRatioB}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              μ<sub>B</sub>: {setting.mu_B}
            </div>
            <Slider
              min={1}
              max={100}
              step={0.1}
              value={setting.mu_B}
              onChange={handleInputChangeMuB}
            />
          </div>
        </div>
        <div className="w-1/4">
          <div>
            <div>
              λ<sub>A</sub>: {setting.default_lambda_A}
            </div>
            <Slider
              min={1}
              max={100}
              step={0.1}
              value={setting.default_lambda_A}
              onChange={handleInputChangeLambdaA}
            />
          </div>
          <div>
            <div>
              R<sub>A</sub>: {setting.R_A}
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={setting.R_A}
              onChange={handleInputChangeLambdaRatioA}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              θ<sub>A</sub>: {setting.default_theta_A}
            </div>
            <Slider
              min={1}
              max={100}
              step={0.1}
              value={setting.default_theta_A}
              onChange={handleInputChangeThetaA}
            />
          </div>
          <div>
            <div>
              R<sub>A</sub>: {setting.R_theta_A}
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={setting.R_theta_A}
              onChange={handleInputChangeThetaRatioA}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              μ<sub>A</sub>: {setting.mu_A}
            </div>
            <Slider
              min={1}
              max={100}
              step={0.1}
              value={setting.mu_A}
              onChange={handleInputChangeMuA}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
