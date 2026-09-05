const CHANNEL = "m3fiqso5";
const WS_URL = "ws://127.0.0.1:3055";

const renames = [
  // 01 screen-login
  ["1:9", "screen-login"],
  ["1:15", "background"],
  ["1:57", "login-form"],
  ["1:33", "input-name"],
  ["1:22", "text-placeholder"],
  ["1:34", "button-login"],
  ["1:35", "text-login"],

  // 02 screen-home
  ["1:16", "screen-home"],
  ["1:14", "background"],
  ["2:301", "header"],
  ["2:299", "icon-arrow"],
  ["2:300", "icon-path"],
  ["2:270", "weather"],
  ["2:267", "weather-condition"],
  ["2:264", "text-condition"],
  ["2:275", "separator"],
  ["2:268", "weather-temp"],
  ["2:265", "text-temp"],
  ["2:271", "separator"],
  ["2:269", "weather-city"],
  ["2:266", "text-city"],
  ["2:223", "main"],
  ["2:224", "section-greeting"],
  ["2:225", "greeting"],
  ["2:226", "text-greeting"],
  ["2:227", "clock"],
  ["2:228", "text-clock"],
  ["2:229", "section-todo"],
  ["2:230", "input-todo"],
  ["2:231", "text-placeholder"],
  ["2:260", "quote"],
  ["2:315", "quote-text"],
  ["2:261", "text-quote"],
  ["2:316", "quote-author"],
  ["2:262", "text-author"],

  // 03 screen-home-todos
  ["2:174", "screen-home-todos"],
  ["2:175", "background"],
  ["2:302", "header"],
  ["2:303", "icon-arrow"],
  ["2:304", "icon-path"],
  ["2:305", "weather"],
  ["2:306", "weather-condition"],
  ["2:307", "text-condition"],
  ["2:308", "separator"],
  ["2:309", "weather-temp"],
  ["2:310", "text-temp"],
  ["2:311", "separator"],
  ["2:312", "weather-city"],
  ["2:313", "text-city"],
  ["2:218", "main"],
  ["2:179", "section-greeting"],
  ["2:180", "greeting"],
  ["2:181", "text-greeting"],
  ["2:182", "clock"],
  ["2:183", "text-clock"],
  ["2:217", "section-todo"],
  ["2:184", "input-todo"],
  ["2:185", "text-placeholder"],
  ["2:215", "todo-list"],
  ["2:186", "item-todo"],
  ["2:214", "todo-label"],
  ["2:187", "text-todo"],
  ["2:188", "button-delete"],
  ["2:189", "path-line-left"],
  ["2:190", "path-line-right"],
  ["2:191", "path-body"],
  ["2:192", "path-rim"],
  ["2:193", "path-lid"],
  ["2:194", "item-todo"],
  ["2:213", "todo-label"],
  ["2:195", "text-todo"],
  ["2:196", "button-delete"],
  ["2:197", "path-line-left"],
  ["2:198", "path-line-right"],
  ["2:199", "path-body"],
  ["2:200", "path-rim"],
  ["2:201", "path-lid"],
  ["2:202", "item-todo"],
  ["2:212", "todo-label"],
  ["2:203", "text-todo"],
  ["2:204", "button-delete"],
  ["2:205", "path-line-left"],
  ["2:206", "path-line-right"],
  ["2:207", "path-body"],
  ["2:208", "path-rim"],
  ["2:209", "path-lid"],
  ["2:317", "quote"],
  ["2:318", "quote-text"],
  ["2:319", "text-quote"],
  ["2:320", "quote-author"],
  ["2:321", "text-author"],
];

function uuid() {
  return crypto.randomUUID();
}

function waitForOpen(ws) {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    ws.addEventListener("open", () => resolve(), { once: true });
    ws.addEventListener("error", (err) => reject(err), { once: true });
  });
}

function waitForJoin(ws) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("join timeout")), 10000);
    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const joined =
          data.type === "system" &&
          (data.message === `Joined channel: ${CHANNEL}` ||
            data.message?.result === `Connected to channel: ${CHANNEL}` ||
            (typeof data.message === "string" &&
              data.message.includes("Joined channel")));
        if (joined) {
          clearTimeout(timeout);
          ws.removeEventListener("message", onMessage);
          resolve();
        }
      } catch {
        // ignore parse errors
      }
    };
    ws.addEventListener("message", onMessage);
  });
}

function renameNode(ws, nodeId, name) {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const timeout = setTimeout(() => {
      ws.removeEventListener("message", onMessage);
      reject(new Error(`timeout renaming ${nodeId} -> ${name}`));
    }, 15000);

    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg = data.message;
        if (!msg || msg.id !== id) return;
        if (msg.error) {
          clearTimeout(timeout);
          ws.removeEventListener("message", onMessage);
          reject(new Error(String(msg.error)));
          return;
        }
        if (msg.result) {
          clearTimeout(timeout);
          ws.removeEventListener("message", onMessage);
          resolve(msg.result);
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.addEventListener("message", onMessage);
    ws.send(
      JSON.stringify({
        id,
        type: "message",
        channel: CHANNEL,
        message: {
          id,
          command: "rename_node",
          params: { nodeId, name, commandId: id },
        },
      }),
    );
  });
}

const ws = new WebSocket(WS_URL);

try {
  await waitForOpen(ws);
  console.log("socket open");

  const joinPromise = waitForJoin(ws);
  ws.send(
    JSON.stringify({
      id: uuid(),
      type: "join",
      channel: CHANNEL,
    }),
  );
  await joinPromise;
  console.log(`joined ${CHANNEL}`);

  let ok = 0;
  const failures = [];

  for (const [nodeId, name] of renames) {
    try {
      const result = await renameNode(ws, nodeId, name);
      ok += 1;
      const previous = result?.previousName ?? "?";
      console.log(`OK ${nodeId}: "${previous}" -> "${name}"`);
    } catch (error) {
      failures.push({ nodeId, name, error: String(error) });
      console.error(`FAIL ${nodeId} -> ${name}: ${error}`);
    }
  }

  console.log(`\nDone. renamed=${ok}/${renames.length} failed=${failures.length}`);
  if (failures.length) {
    console.log(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  }
} finally {
  ws.close();
}
