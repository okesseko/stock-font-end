import { configConsumerProps } from "antd/lib/config-provider";
import React, { useEffect, useRef, useState } from "react";
import { renderData } from "./math-model";
import { defaultAxios, api } from "../../../environment/api";

export default function Settings({ buttonStatus = "stop" }) {
  const isFirst = useRef(true);
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
  });
  useEffect(() => {
    defaultAxios({
      url: api.getDisplay.url,
      method: api.getDisplay.method,
      params: {
        isGetLatest: true,
      },
    }).then((res) => {
      displayData.current = res.data;
      setNextTime(renderData(setting, res.data));
    });
  }, []);

  useEffect(() => {
    if (nextTime && buttonStatus !== "stop") {
      setTimeout(() => {
        setNextTime(() => renderData(setting, displayData.current));
      }, nextTime);
    }
  }, [nextTime, buttonStatus]);

  const handleInputChangeLambdaB = (e) => {
    setSetting({ ...setting, default_lambda_B: e.currentTarget.value });
  };

  const handleInputChangeLambdaA = (e) => {
    setSetting({ ...setting, default_lambda_A: e.currentTarget.value });
  };

  const handleInputChangeLambdaRatioB = (e) => {
    setSetting({ ...setting, R_B: e.currentTarget.value });
  };

  const handleInputChangeLambdaRatioA = (e) => {
    setSetting({ ...setting, R_A: e.currentTarget.value });
  };

  const handleInputChangeThetaB = (e) => {
    setSetting({ ...setting, default_theta_B: e.currentTarget.value });
  };

  const handleInputChangeThetaA = (e) => {
    setSetting({ ...setting, default_theta_A: e.currentTarget.value });
  };

  const handleInputChangeThetaRatioB = (e) => {
    setSetting({ ...setting, R_theta_B: e.currentTarget.value });
  };

  const handleInputChangeThetaRatioA = (e) => {
    setSetting({ ...setting, R_theta_A: e.currentTarget.value });
  };

  const handleInputChangeMuB = (e) => {
    setSetting({ ...setting, mu_B: e.currentTarget.value });
  };
  const handleInputChangeMuA = (e) => {
    setSetting({ ...setting, mu_A: e.currentTarget.value });
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="mr-5 pr-5 border-r">
        <div>
          <div>
            λ<sub>B</sub>: {setting.default_lambda_B}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            onInput={handleInputChangeLambdaB}
            value={setting.default_lambda_B}
          />
        </div>
        <div>
          <div>
            R<sub>B</sub>: {setting.R_B}
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            onInput={handleInputChangeLambdaRatioB}
            value={setting.R_B}
          />
        </div>
        <hr className="my-3" />
        <div>
          <div>
            θ<sub>B</sub>: {setting.default_theta_B}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            onInput={handleInputChangeThetaB}
            value={setting.default_theta_B}
          />
        </div>
        <div>
          <div>
            R<sub>B</sub>: {setting.R_theta_B}
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            onInput={handleInputChangeThetaRatioB}
            value={setting.R_theta_B}
          />
        </div>
        <hr className="my-3" />
        <div>
          <div>
            μ<sub>B</sub>: {setting.mu_B}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            onInput={handleInputChangeMuB}
            value={setting.mu_B}
          />
        </div>
      </div>
      <div>
        <div>
          <div>
            λ<sub>A</sub>: {setting.default_lambda_A}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            onInput={handleInputChangeLambdaA}
            value={setting.default_lambda_A}
          />
        </div>
        <div>
          <div>
            R<sub>A</sub>: {setting.R_A}
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            onInput={handleInputChangeLambdaRatioA}
            value={setting.R_A}
          />
        </div>
        <hr className="my-3" />
        <div>
          <div>
            θ<sub>A</sub>: {setting.default_theta_A}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            onInput={handleInputChangeThetaA}
            value={setting.default_theta_A}
          />
        </div>
        <div>
          <div>
            R<sub>A</sub>: {setting.R_theta_A}
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            onInput={handleInputChangeThetaRatioA}
            value={setting.R_theta_A}
          />
        </div>
        <hr className="my-3" />
        <div>
          <div>
            μ<sub>A</sub>: {setting.mu_A}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            onInput={handleInputChangeMuA}
            value={setting.mu_A}
          />
        </div>
      </div>
    </div>
  );
}
