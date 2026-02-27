const https = require("https");
const fs = require("fs");

const username = "JohnsAvrey";

https.get(`https://api.github.com/users/${username}/repos`, {
  headers: { "User-Agent": "node" }
}, res => {
  let data = "";

  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const repos = JSON.parse(data)
      .filter(r => !r.fork)
      .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 10);

    const list = repos
      .map(r => `- [${r.name}](${r.html_url}) — ${r.description || "No description"}`)
      .join("\n");

    const readme = fs.readFileSync("README.md","utf8");

    const newReadme = readme.replace(
      /<!-- PROJECTS:START -->[\s\S]*<!-- PROJECTS:END -->/,
      `<!-- PROJECTS:START -->\n${list}\n<!-- PROJECTS:END -->`
    );

    fs.writeFileSync("README.md", newReadme);
  });
});
