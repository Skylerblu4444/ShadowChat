import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import archiver from "archiver";

const projectDir = process.cwd();
const zipFile = path.join(projectDir, "shadowchat_full_backup.zip");
const repoUrl = process.env.REPO_URL || "https://github.com/skylerblu4444/ShadowChat.git";
const commitMessage = "Full ShadowChat MVP — all components, utils, wallets, scripts, styles, smart contracts";

console.log("Removing nested .git directories...");

function removeGitDirs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file === ".git") {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Removed nested Git folder: ${fullPath}`);
      } else {
        removeGitDirs(fullPath);
      }
    }
  }
}

removeGitDirs(projectDir);

console.log("Creating ZIP backup...");
const output = fs.createWriteStream(zipFile);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`✅ Backup created: ${zipFile} (${archive.pointer()} total bytes)`);
});

archive.on("error", (err) => { throw err; });

archive.pipe(output);
archive.glob("**/*", { ignore: ["node_modules/**", ".git/**"] });
await archive.finalize();

// Git operations
try {
  console.log("Setting up Git repository...");
  execSync("git init", { stdio: "inherit" });
  
  // Remove existing origin if present
  try { execSync("git remote remove origin"); } catch {}
  execSync(`git remote add origin ${repoUrl}`, { stdio: "inherit" });

  console.log("Adding all files...");
  execSync("git add .", { stdio: "inherit" });

  console.log("Committing changes...");
  execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

  console.log("Pushing to GitHub...");
  execSync("git branch -M main", { stdio: "inherit" });
  execSync("git push -u origin main --force", { stdio: "inherit" });

  console.log("✅ Push complete!");
} catch (error) {
  console.error("❌ Git operation failed:", error.message);
}
