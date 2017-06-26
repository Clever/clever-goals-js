import "whatwg-fetch";
import * as timeme from "timeme.js";

const post = async (path, districtToken, body) => {
  const resp = await fetch(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${districtToken}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    throw new Error(`Got ${resp.status} from Clever Goals API: ${await resp.text()}`);
  }
};

export default class CleverGoals {
  districtToken;
  studentCleverId;
  apiURL;
  constructor(options) {
    if (!options.districtToken) {
      throw new Error("Missing required option districtToken");
    }
    if (!options.studentCleverId) {
      throw new Error("Missing required option studentCleverId");
    }
    this.districtToken = options.districtToken;
    this.studentCleverId = options.studentCleverId;
    // API URL is configurable for testing
    this.apiURL = options.apiURL || "https://api.clever.com";
  }

  async recordCumulativeUsage(value) {
    await post(
      `${this.apiURL}/v1.2/students/${this.studentCleverId}/metrics/cumulative`,
      this.districtToken,
      { usage: value },
    );
  }

  async recordCumulativeProgress(value) {
    await post(
      `${this.apiURL}/v1.2/students/${this.studentCleverId}/metrics/cumulative`,
      this.districtToken,
      { progress: value },
    );
  }

  async recordIncrementalUsage(value) {
    await post(
      `${this.apiURL}/v1.2/students/${this.studentCleverId}/metrics/incremental`,
      this.districtToken,
      { usage: value },
    );
  }

  async recordIncrementalProgress(value) {
    await post(
      `${this.apiURL}/v1.2/students/${this.studentCleverId}/metrics/incremental`,
      this.districtToken,
      { progress: value },
    );
  }

  startTrackingUsage() {
    console.log("Clever Goals: Starting usage tracking");

    const lock = (() => {
      let locked = false;
      let timeout;
      return {
        acquire: () => {
          if (locked) { return false; }
          locked = true;
          timeout = setTimeout(() => {
            locked = false;
          }, 60000); // timeout to release lock
          return true;
        },
        release: () => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          locked = false;
        },
      };
    })();

    timeme.initialize({
      idleTimeoutInSeconds: 60,
    });

    let totalSecondsSent = 0;

    setInterval(async () => {
      if (!lock.acquire()) { return; }
      const currTotalSeconds = timeme.getTimeOnCurrentPageInSeconds();
      const delta = currTotalSeconds - totalSecondsSent;
      if (delta === 0) { return; }
      try {
        await this.recordIncrementalUsage(delta / 60);
        totalSecondsSent = currTotalSeconds;
      } catch (err) {
        console.error("Clever Goals:", err);
      } finally {
        lock.release();
      }
    }, 5000);
  }
}
