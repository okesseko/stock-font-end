import React from "react";
import { mathRenderData } from "./math-model";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };

    this.handleInputChangeLambdaB = this.handleInputChangeLambdaB.bind(this);
    this.handleInputChangeLambdaA = this.handleInputChangeLambdaA.bind(this);
  }

  handleInputChangeLambdaB = (e) => {
    this.setState({ default_lambda_B: e.currentTarget.value });
  };

  handleInputChangeLambdaA = (e) => {
    this.setState({ default_lambda_A: e.currentTarget.value });
  };

  handleInputChangeLambdaRatioB = (e) => {
    this.setState({ R_B: e.currentTarget.value });
  };

  handleInputChangeLambdaRatioA = (e) => {
    this.setState({ R_A: e.currentTarget.value });
  };

  handleInputChangeThetaB = (e) => {
    this.setState({ default_theta_B: e.currentTarget.value });
  };

  handleInputChangeThetaA = (e) => {
    this.setState({ default_theta_A: e.currentTarget.value });
  };

  handleInputChangeThetaRatioB = (e) => {
    this.setState({ R_theta_B: e.currentTarget.value });
  };

  handleInputChangeThetaRatioA = (e) => {
    this.setState({ R_theta_A: e.currentTarget.value });
  };

  handleInputChangeMuB = (e) => {
    this.setState({ mu_B: e.currentTarget.value });
  };
  handleInputChangeMuA = (e) => {
    this.setState({ mu_A: e.currentTarget.value });
  };

  render() {
    return (
      <div className="flex justify-center mt-10">
        <div className="mr-5 pr-5 border-r">
          <div>
            <div>
              λ<sub>B</sub>: {this.state.default_lambda_B}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              onInput={this.handleInputChangeLambdaB}
              value={this.state.default_lambda_B}
            />
          </div>
          <div>
            <div>
              R<sub>B</sub>: {this.state.R_B}
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              onInput={this.handleInputChangeLambdaRatioB}
              value={this.state.R_B}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              θ<sub>B</sub>: {this.state.default_theta_B}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              onInput={this.handleInputChangeThetaB}
              value={this.state.default_theta_B}
            />
          </div>
          <div>
            <div>
              R<sub>B</sub>: {this.state.R_theta_B}
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              onInput={this.handleInputChangeThetaRatioB}
              value={this.state.R_theta_B}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              μ<sub>B</sub>: {this.state.mu_B}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              onInput={this.handleInputChangeMuB}
              value={this.state.mu_B}
            />
          </div>
        </div>
        <div>
          <div>
            <div>
              λ<sub>A</sub>: {this.state.default_lambda_A}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              onInput={this.handleInputChangeLambdaA}
              value={this.state.default_lambda_A}
            />
          </div>
          <div>
            <div>
              R<sub>A</sub>: {this.state.R_A}
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              onInput={this.handleInputChangeLambdaRatioA}
              value={this.state.R_A}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              θ<sub>A</sub>: {this.state.default_theta_A}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              onInput={this.handleInputChangeThetaA}
              value={this.state.default_theta_A}
            />
          </div>
          <div>
            <div>
              R<sub>A</sub>: {this.state.R_theta_A}
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              onInput={this.handleInputChangeThetaRatioA}
              value={this.state.R_theta_A}
            />
          </div>
          <hr className="my-3" />
          <div>
            <div>
              μ<sub>A</sub>: {this.state.mu_A}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              onInput={this.handleInputChangeMuA}
              value={this.state.mu_A}
            />
          </div>
        </div>
      </div>
    );
  }
}
