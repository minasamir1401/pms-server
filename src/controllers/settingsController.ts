import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

export const getSettings = (req: Request, res: Response) => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read settings" });
  }
};

export const updateSettings = (req: Request, res: Response) => {
  try {
    const dir = path.dirname(settingsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to write settings" });
  }
};
