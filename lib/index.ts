import "whatwg-fetch";
import * as timeme from "timeme.js";

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

    const lock = (() => {
      let locked = false;
      let timeout;
      return {
        acquire: () => {
          if (locked) { return false; }
          locked = true;
          timeout = setTimeout(() => locked = false, 60000); // timeout to release lock
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
      const delta =  currTotalSeconds - totalSecondsSent;
      if (delta === 0) { return; }
      try {
        await this.recordIncrementalUsage(delta / 60);
        totalSecondsSent = currTotalSeconds;
      } catch (err) {
        console.error("Clever Goals:", err)
      } finally {
        lock.release();
      }
    }, 5000);
  }
}
