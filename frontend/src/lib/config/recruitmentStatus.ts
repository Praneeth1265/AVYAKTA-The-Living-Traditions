import { promises as fs } from "fs";
import path from "path";

const CONFIG_PATH = path.join(
  process.cwd(),
  "src/config/recruitment-status.json",
);

type RecruitmentStatusConfig = {
  isOpen: boolean;
};

export async function getRecruitmentStatus(): Promise<boolean> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw) as RecruitmentStatusConfig;
    return Boolean(parsed.isOpen);
  } catch {
    // Config file missing/unreadable - default to open so the site behaves
    // normally until an admin explicitly closes recruitment.
    return true;
  }
}

export async function setRecruitmentStatus(isOpen: boolean): Promise<void> {
  const config: RecruitmentStatusConfig = { isOpen };
  await fs.writeFile(
    CONFIG_PATH,
    JSON.stringify(config, null, 2) + "\n",
    "utf-8",
  );
}
