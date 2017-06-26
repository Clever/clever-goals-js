import * as fetch from "whatwg-fetch";

export default class CleverGoals {
  districtToken;
  studentCleverId;
  constructor(options) {
    if (!options.districtToken) {
      throw new Error("Missing required option districtToken");
    }
    if (!options.studentCleverId) {
      throw new Error("Missing required option studentCleverId");
    }
    this.districtToken = options.districtToken;
    this.studentCleverId = options.studentCleverId;
  }

  async recordCumulativeUsage(value) {
  }

  async recordCumulativeProgress(value) {
  }

  async recordIncrementalUsage(delta) {
    const resp = await fetch(`http://localhost:5020/v1.2/students/${this.studentCleverId}/metrics/incremental`, {
      method: "POST",
      headers: { Authentication: `Bearer ${this.districtToken}` },
      body: JSON.stringify({ usage: delta }),
    });
    if (!resp.ok) {
      throw new Error(`Got ${resp.status} from Clever Goals API: ${await resp.text()}`);
    }
  }

  async recordIncrementalProgress(delta) {
  }

  startTrackingUsage() {
    console.log("Clever Goals: Starting usage tracking.");
  }
}
