export type AppNotification = {
  id: number;
  title: string;
  detail: string;
  time: string;
  type: "critical" | "resource" | "broadcast" | "mission" | "workflow" | "export";
};

export type Mission = {
  id: number;
  title: string;
  detail: string;
  status: "Waiting Approval" | "Running" | "Completed";
  createdAt: string;
};

export function getTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function addNotification(
  title: string,
  detail: string,
  type: AppNotification["type"] = "workflow"
) {
  const saved = localStorage.getItem("disasteriq-live-notifications");
  const existing: AppNotification[] = saved ? JSON.parse(saved) : [];

  const notification: AppNotification = {
    id: Date.now(),
    title,
    detail,
    time: getTime(),
    type,
  };

  localStorage.setItem(
    "disasteriq-live-notifications",
    JSON.stringify([notification, ...existing].slice(0, 30))
  );

  window.dispatchEvent(new CustomEvent("disasteriq-notification"));
}

export function addMission(title: string, detail: string) {
  const saved = localStorage.getItem("disasteriq-missions");
  const existing: Mission[] = saved ? JSON.parse(saved) : [];

  const mission: Mission = {
    id: Date.now(),
    title,
    detail,
    status: "Waiting Approval",
    createdAt: getTime(),
  };

  localStorage.setItem(
    "disasteriq-missions",
    JSON.stringify([mission, ...existing].slice(0, 20))
  );

  window.dispatchEvent(new CustomEvent("disasteriq-mission"));
}